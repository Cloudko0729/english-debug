// 刪掉 batch_notebooklm_media.js 建立的文法節點筆記本（NotebookLM 上）。
//
// 用法:
//   node kids/tools/prune_notebooklm.js            # 只列出會刪什麼，不動手
//   node kids/tools/prune_notebooklm.js --yes      # 真的刪
//
// 為什麼可以刪：批次每跑一次就開一個新筆記本，失敗重試的也都留著，
// 47 個節點累積了 130 個。每個裡面只有兩樣東西——
//   1) 來源 .md   → kids/grammar_db/notebooklm_sources/ 裡有，且已進 git
//   2) 影片/音檔   → 已下載、壓縮、放進 repo 與 R2
// 兩樣都在別的地方，筆記本本身沒有不可重生的內容。
//
// 安全閘門：刪某個節點的筆記本之前，先確認那個節點的 m4a 在本機、mp4 在 R2 回 200
// 且大小相符。缺任何一樣就整個節點跳過 —— 沒把產出收好就刪掉來源，是不可逆的錯。
// 標題對不上節點 id 的筆記本一律不碰（那些是使用者自己的筆記）。
const fs = require("fs");
const path = require("path");
const https = require("https");
const { execFileSync } = require("child_process");

const KIDS = path.join(__dirname, "..");
const DB = path.join(KIDS, "grammar_db");
const PODCAST = path.join(DB, "lessons", "podcast");
const MEDIA = JSON.parse(fs.readFileSync(path.join(DB, "media_config.json"), "utf8"));
const LOG = path.join(__dirname, "_notebooklm_pruned.json");
const GO = process.argv.includes("--yes");

function nodes() {
  const out = [];
  ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7"].forEach(b => {
    const j = JSON.parse(fs.readFileSync(path.join(DB, "bands", b + ".json"), "utf8"));
    (j.nodes || j).forEach(n => out.push(n));
  });
  return out;
}
function head(url) {
  return new Promise(r => {
    https.request(url, { method: "HEAD" }, res => {
      r({ status: res.statusCode, length: +(res.headers["content-length"] || 0) }); res.resume();
    }).on("error", () => r({ status: 0, length: 0 })).end();
  });
}
function nb(...args) {
  return execFileSync("notebooklm", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }).trim();
}

async function main() {
  const all = JSON.parse(nb("list", "--json")).notebooks || [];
  const ns = nodes();

  // 每個節點的產出都收好了嗎
  console.log("先確認 48 個節點的產出都在：");
  const safe = new Set();
  const unsafe = [];
  for (const n of ns) {
    const m4a = path.join(PODCAST, n.id + ".m4a");
    const mp4 = path.join(PODCAST, n.id + ".mp4");
    if (!fs.existsSync(m4a) || !fs.existsSync(mp4)) { unsafe.push(n.id + "（本機缺檔）"); continue; }
    const r = await head(MEDIA.videoBase + n.id + ".mp4");
    if (r.status !== 200 || r.length !== fs.statSync(mp4).size) {
      unsafe.push(`${n.id}（R2 ${r.status || "連不上"}${r.status === 200 ? "，大小不符" : ""}）`); continue;
    }
    safe.add(n.id);
  }
  console.log(`  產出齊全 ${safe.size}/${ns.length}`);
  if (unsafe.length) { console.log("  ⚠️ 以下節點的筆記本一律不刪："); unsafe.forEach(x => console.log("     " + x)); }

  // 標題含節點 id 的才算批次產物
  const targets = [], keep = [];
  all.forEach(x => {
    const hit = ns.find(n => x.title.includes(n.id));
    if (hit && safe.has(hit.id)) targets.push({ ...x, node: hit.id });
    else keep.push(x);
  });

  console.log(`\n筆記本共 ${all.length} 個`);
  console.log(`  要刪（批次建的文法節點）：${targets.length}`);
  console.log(`  保留：${keep.length}`);
  const perNode = {};
  targets.forEach(t => (perNode[t.node] = (perNode[t.node] || 0) + 1));
  console.log(`  涵蓋 ${Object.keys(perNode).length} 個節點，其中重複 ${targets.length - Object.keys(perNode).length} 個\n`);

  if (!GO) {
    targets.slice(0, 12).forEach(t => console.log(`  ${t.created_at.slice(0, 10)}  ${t.title}`));
    if (targets.length > 12) console.log(`  …還有 ${targets.length - 12} 個`);
    console.log("\n保留的（不會碰）前 8 個：");
    keep.slice(0, 8).forEach(t => console.log(`  ${t.created_at.slice(0, 10)}  ${t.title}`));
    console.log("\n（沒有 --yes：一個都沒刪）");
    return;
  }

  let ok = 0; const failed = [];
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    process.stdout.write(`  [${i + 1}/${targets.length}] ${t.title.slice(0, 44)} … `);
    try { nb("delete", "-n", t.id, "-y", "--json"); console.log("刪除"); ok++; }
    catch (e) { console.log("失敗"); failed.push({ id: t.id, title: t.title, err: String(e.message).split("\n")[0] }); }
  }
  fs.writeFileSync(LOG, JSON.stringify({
    at: new Date().toISOString(), deleted: ok, failed,
    ids: targets.map(t => ({ id: t.id, title: t.title })),
  }, null, 1), "utf8");
  console.log(`\n${failed.length ? "⚠️" : "✅"} 刪除 ${ok}/${targets.length}　紀錄寫入 ${path.relative(process.cwd(), LOG)}`);
}

main();
