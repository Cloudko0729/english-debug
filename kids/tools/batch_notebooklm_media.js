// 批次產生 grammar_db 節點的 NotebookLM podcast + 影片，並壓縮後放進 lessons/podcast/。
//
// 用法：
//   node kids/tools/batch_notebooklm_media.js --bands F0,F1,F2,F3,F4
//   node kids/tools/batch_notebooklm_media.js --nodes F0.1-complete-sentence,F0.2-be-agreement
//   node kids/tools/batch_notebooklm_media.js --bands F0 --limit 3     # 先試跑 3 個
//   node kids/tools/batch_notebooklm_media.js --bands F0,F1 --audio-only
//
// 特性：
//   * 可中斷續跑：輸出檔已存在的節點自動跳過（不會重複燒 NotebookLM 額度）
//   * 每個節點獨立 try/catch，單一節點失敗不會中斷整批，最後列出失敗清單
//   * 進度寫入 kids/tools/_notebooklm_batch_log.json，隨時可查
//
// 前置條件：notebooklm CLI 已登入（notebooklm login），且 ffmpeg 可用。
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DB = path.join(ROOT, "grammar_db");
const SRC_DIR = path.join(DB, "notebooklm_sources");
const OUT_DIR = path.join(DB, "lessons", "podcast");
const TMP_DIR = path.join(__dirname, "_nbtmp");
const LOG = path.join(__dirname, "_notebooklm_batch_log.json");
const BANDS = ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7"];

function arg(name, def) {
  const i = process.argv.indexOf("--" + name);
  if (i < 0) return def;
  const v = process.argv[i + 1];
  return v && !v.startsWith("--") ? v : true;
}
const AUDIO_ONLY = !!arg("audio-only", false);
// 音檔與影片是兩條獨立配額：音檔被 Google 限流時，影片通常還能繼續生成。
const VIDEO_ONLY = !!arg("video-only", false);
const LIMIT = parseInt(arg("limit", "0"), 10) || 0;

function loadNodes() {
  const out = [];
  BANDS.forEach(b => {
    const d = JSON.parse(fs.readFileSync(path.join(DB, "bands", b + ".json"), "utf8"));
    (Array.isArray(d) ? d : d.nodes).forEach(n => out.push(n));
  });
  return out;
}

// NotebookLM 的 Google 登入實測只有約 2 小時效期，長批次跑到一半一定會過期。
// 過期後每個節點都會在第一步秒失敗，繼續跑只是把 log 洗版，所以偵測到就整批中止。
class AuthExpired extends Error {}
// Google 對生成有配額，且【音檔與影片各自獨立計算】：
//   實測 2026-07-26 音檔做到第 19 個被限流，同時間影片仍可正常生成。
//   限流是整個帳號層級（開全新 notebook 一樣被擋），無法繞過。
//   重置時間為【觸發後 24 小時】，不是隔日零點——例如 07-26 22:15 用完，
//   要等到 07-27 22:15 左右才會恢復。
// 額度用完後每次呼叫都即時失敗，繼續跑只會把剩下節點全標成失敗，所以整批中止等額度回復再續跑。
class RateLimited extends Error {}
function isAuthError(s) { return /Authentication expired|Run 'notebooklm login'/i.test(String(s)); }
function isRateLimit(s) { return /RATE_LIMITED|RateLimitError|rate limited by Google/i.test(String(s)); }

function nb(...args) {
  try {
    const out = execFileSync("notebooklm", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }).trim();
    if (isAuthError(out)) throw new AuthExpired(out);
    if (isRateLimit(out)) throw new RateLimited(out);
    return out;
  } catch (e) {
    if (e instanceof AuthExpired || e instanceof RateLimited) throw e;
    const blob = [e.message, e.stdout, e.stderr].map(x => x ? x.toString() : "").join("\n");
    if (isAuthError(blob)) throw new AuthExpired("NotebookLM 登入已過期");
    if (isRateLimit(blob)) throw new RateLimited("Google 生成配額已用盡");
    throw e;
  }
}

// 開跑前先確認登入還有效，避免整批空轉
function preflightAuth() {
  try { nb("list", "--json"); return true; }
  catch (e) {
    if (e instanceof AuthExpired) return false;
    throw e;
  }
}
function ff(...args) {
  execFileSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 32 * 1024 * 1024 });
}
function jparse(s) {
  const i = s.indexOf("{");
  if (i < 0) throw new Error("no JSON in CLI output: " + s.slice(0, 200));
  return JSON.parse(s.slice(i));
}
function log(msg) {
  const line = `[${new Date().toISOString().slice(11, 19)}] ${msg}`;
  process.stdout.write(line + "\n");
}

// 壓縮設定（LESSON_PAGE_SPEC 第 6 節：實測 32MB → 4.8MB）
function compressAudio(inFile, outFile) {
  ff("-i", inFile, "-c:a", "aac", "-b:a", "48k", "-ac", "1", "-movflags", "+faststart", outFile);
}
function compressVideo(inFile, outFile) {
  ff("-i", inFile, "-c:v", "libx264", "-crf", "30", "-preset", "slow",
     "-vf", "scale=854:480", "-c:a", "aac", "-b:a", "48k", "-ac", "1",
     "-movflags", "+faststart", outFile);
}

function doNode(n) {
  const srcMd = path.join(SRC_DIR, n.id + ".md");
  if (!fs.existsSync(srcMd)) throw new Error("來源文件不存在，請先跑 build_notebooklm_sources.js：" + srcMd);

  const outA = path.join(OUT_DIR, n.id + ".m4a");
  const outV = path.join(OUT_DIR, n.id + ".mp4");
  const needA = !VIDEO_ONLY && !fs.existsSync(outA);
  const needV = !AUDIO_ONLY && !fs.existsSync(outV);
  if (!needA && !needV) { log(`  ↷ ${n.id} 已存在，跳過`); return "skipped"; }

  // 1) 建 notebook
  log(`  · 建立 notebook…`);
  const nbId = jparse(nb("create", `文法 ${n.id} ${n.titleZh}`, "--json")).notebook.id;

  // 2) 加來源並等處理完成
  log(`  · 上傳來源文件…`);
  const srcId = jparse(nb("source", "add", srcMd, "--type", "file",
    "--title", `${n.id} 教學文件`, "--notebook", nbId, "--json")).source.id;
  nb("source", "wait", srcId, "--notebook", nbId, "--json");

  const desc = `用活潑、口語、像哥哥姊姊跟小學生聊天的語氣，講解「${n.titleZh}」。` +
    `用來源文件裡的情境對話當開場，帶出中文母語者最容易犯的錯。結尾重複一次句型公式。`;

  fs.mkdirSync(TMP_DIR, { recursive: true });

  // 3) 音檔
  if (needA) {
    log(`  · 生成 podcast…`);
    nb("generate", "audio", desc, "--notebook", nbId, "--format", "deep-dive",
       "--length", "short", "--language", "zh_Hant", "--wait", "--timeout", "900", "--json");
    const tmpA = path.join(TMP_DIR, n.id + ".raw.m4a");
    nb("download", "audio", "--notebook", nbId, "--force", tmpA, "--json");
    log(`  · 壓縮音檔…`);
    compressAudio(tmpA, outA);
    fs.unlinkSync(tmpA);
  }

  // 4) 影片
  if (needV) {
    log(`  · 生成影片…`);
    nb("generate", "video", desc, "--notebook", nbId, "--style", "kawaii",
       "--language", "zh_Hant", "--wait", "--timeout", "1800", "--json");
    const tmpV = path.join(TMP_DIR, n.id + ".raw.mp4");
    nb("download", "video", "--notebook", nbId, "--force", tmpV, "--json");
    log(`  · 壓縮影片…`);
    compressVideo(tmpV, outV);
    fs.unlinkSync(tmpV);
  }

  const mb = f => fs.existsSync(f) ? (fs.statSync(f).size / 1048576).toFixed(2) + "MB" : "-";
  log(`  ✔ ${n.id} 完成（音 ${mb(outA)} / 影 ${mb(outV)}）`);
  return "done";
}

function main() {
  const bandsArg = String(arg("bands", "") || "").toUpperCase();
  const nodesArg = String(arg("nodes", "") || "");
  let nodes = loadNodes();
  if (nodesArg) {
    const want = nodesArg.split(",").map(s => s.trim()).filter(Boolean);
    nodes = nodes.filter(n => want.includes(n.id));
  } else if (bandsArg) {
    const want = bandsArg.split(",").map(s => s.trim()).filter(Boolean);
    nodes = nodes.filter(n => want.includes(n.band));
  }
  if (LIMIT) nodes = nodes.slice(0, LIMIT);
  if (!nodes.length) { console.error("沒有符合條件的節點"); process.exit(1); }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const todo = nodes.filter(n =>
    (!VIDEO_ONLY && !fs.existsSync(path.join(OUT_DIR, n.id + ".m4a"))) ||
    (!AUDIO_ONLY && !fs.existsSync(path.join(OUT_DIR, n.id + ".mp4"))));
  const perNode = AUDIO_ONLY ? 7 : VIDEO_ONLY ? 14 : 21;   // 實測分鐘數
  log(`本批共 ${nodes.length} 個節點，其中 ${todo.length} 個待處理${AUDIO_ONLY ? "（只做音檔）" : VIDEO_ONLY ? "（只做影片）" : ""}`);
  log(`預估 ${todo.length * perNode} 分鐘（約 ${(todo.length * perNode / 60).toFixed(1)} 小時）；` +
      `登入效期約 2 小時，超過的部分會中止，重新登入後重跑同一指令即可續做。`);

  if (!preflightAuth()) {
    log(`✘ NotebookLM 登入已過期，未開始任何工作。請先執行：notebooklm login`);
    process.exit(2);
  }

  const result = { startedAt: new Date().toISOString(), done: [], skipped: [], failed: [], abortedAuth: false };
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    log(`[${i + 1}/${nodes.length}] ${n.id} ${n.titleZh}`);
    try {
      const r = doNode(n);
      result[r === "skipped" ? "skipped" : "done"].push(n.id);
    } catch (e) {
      if (e instanceof AuthExpired || e instanceof RateLimited) {
        const rl = e instanceof RateLimited;
        result[rl ? "abortedRateLimit" : "abortedAuth"] = true;
        result.finishedAt = new Date().toISOString();
        fs.writeFileSync(LOG, JSON.stringify(result, null, 2), "utf8");
        log(`✘ ${rl ? "Google 生成配額已用盡" : "登入過期"}，於第 ${i + 1}/${nodes.length} 個節點中止（本輪完成 ${result.done.length} 個）`);
        log(rl ? `  配額為觸發後 24 小時重置（不是隔日零點）。屆時重跑同一指令即可接著做。\n` +
                 `  另註：音檔與影片配額獨立，音檔被擋時可先跑 --video-only。`
               : `  重新登入後重跑同一指令即可接著做：notebooklm login`);
        console.log(JSON.stringify(result, null, 2));
        process.exit(2);
      }
      const msg = (e && e.message ? e.message : String(e)).split("\n")[0].slice(0, 300);
      log(`  ✘ ${n.id} 失敗：${msg}`);
      result.failed.push({ id: n.id, error: msg });
    }
    result.finishedAt = new Date().toISOString();
    fs.writeFileSync(LOG, JSON.stringify(result, null, 2), "utf8");
  }

  log(`完成：成功 ${result.done.length}／跳過 ${result.skipped.length}／失敗 ${result.failed.length}`);
  if (result.failed.length) {
    log(`失敗清單（可重跑同一指令，已完成的會自動跳過）：`);
    result.failed.forEach(f => log(`   ${f.id}: ${f.error}`));
  }
  console.log(JSON.stringify(result, null, 2));
}

main();
