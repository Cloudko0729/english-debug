// 把 grammar_db/lessons/podcast/ 的影片上傳到 Cloudflare R2（教學頁的 videoBase 指向那裡）。
//
// 用法:
//   node kids/tools/upload_videos_r2.js --dry     # 只列出還沒上傳的
//   node kids/tools/upload_videos_r2.js
//   node kids/tools/upload_videos_r2.js --verify  # 只重新核對 R2 上有沒有、大小對不對
//
// 為什麼要有這支：影片不進 repo（48 支約 216MB，佔站台三分之一），改由 R2 供應。
// 但 batch_notebooklm_media.js 只負責生成，上傳一直是手動下 wrangler 指令，
// 生成完忘記上傳 = 教學頁指到 404，而且頁面不會報錯（fail-safe 只在音檔也壞掉時才隱藏）。
//
// 前置：npx wrangler login 已完成（npx wrangler whoami 可確認）。
const fs = require("fs");
const path = require("path");
const https = require("https");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "grammar_db", "lessons", "podcast");
const MEDIA = JSON.parse(fs.readFileSync(path.join(ROOT, "grammar_db", "media_config.json"), "utf8"));
const BUCKET = "english-media";
const PREFIX = "podcast/";

const DRY = process.argv.includes("--dry");
const VERIFY = process.argv.includes("--verify");

// HEAD 一下公開網址，回傳 { status, length }
function head(url) {
  return new Promise(resolve => {
    https.request(url, { method: "HEAD" }, res => {
      resolve({ status: res.statusCode, length: +(res.headers["content-length"] || 0) });
      res.resume();
    }).on("error", () => resolve({ status: 0, length: 0 })).end();
  });
}

async function main() {
  const base = MEDIA.videoBase;
  if (!base || !/^https?:\/\//.test(base)) {
    console.error("media_config.json 的 videoBase 不是網址，不需要上傳"); process.exit(1);
  }
  const files = fs.readdirSync(DIR).filter(f => f.endsWith(".mp4")).sort();
  console.log(`本機影片 ${files.length} 支，逐一核對 ${base}\n`);

  const todo = [];
  for (const f of files) {
    const local = fs.statSync(path.join(DIR, f)).size;
    const r = await head(base + f);
    const ok = r.status === 200 && r.length === local;
    if (!ok) todo.push({ f, local, r });
    // 大小對不上比缺檔更危險：頁面載得到但播到一半斷掉
    const mark = r.status === 200 ? (r.length === local ? "✓" : "⚠ 大小不符") : "✗ " + (r.status || "連不上");
    console.log(`  ${mark.padEnd(12)} ${f}  本機 ${(local / 1048576).toFixed(1)}MB` +
                (r.status === 200 && r.length !== local ? `  遠端 ${(r.length / 1048576).toFixed(1)}MB` : ""));
  }

  if (!todo.length) { console.log("\n✅ 全部已上傳且大小一致"); return; }
  console.log(`\n要上傳 ${todo.length} 支`);
  if (VERIFY) { console.log("（--verify：不上傳）"); process.exit(1); }
  if (DRY) { console.log("（--dry：不上傳）"); return; }

  let done = 0;
  for (const { f } of todo) {
    process.stdout.write(`  上傳 ${f} … `);
    try {
      execFileSync("npx", ["wrangler", "r2", "object", "put", `${BUCKET}/${PREFIX}${f}`,
        "--file", path.join(DIR, f), "--content-type", "video/mp4", "--remote"],
        { stdio: ["ignore", "pipe", "pipe"], shell: true });
      // 上傳完立刻核對，不要只相信指令沒報錯
      const r = await head(base + f);
      const local = fs.statSync(path.join(DIR, f)).size;
      if (r.status === 200 && r.length === local) { console.log("OK"); done++; }
      else console.log(`失敗（HTTP ${r.status}，大小 ${r.length}/${local}）`);
    } catch (e) {
      console.log("失敗：" + String(e.message).split("\n")[0]);
    }
  }
  console.log(`\n${done === todo.length ? "✅" : "❌"} 成功 ${done}/${todo.length}`);
  process.exit(done === todo.length ? 0 : 1);
}

main();
