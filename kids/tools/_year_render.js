// 合併 4 批 → kids/vocab_plan.js（資料）+ kids/vocab_plan.html（家長閱覽頁）
const fs = require("fs");
const { wordLevel } = require("../wordlevels.js");
const weeks = [];
for (let b = 1; b <= 4; b++)
  JSON.parse(fs.readFileSync(__dirname + `/_year_batch${b}.json`, "utf8")).weeks.forEach(w => weeks.push(w));
weeks.sort((a, b) => a.n - b.n);

// 資料檔
const data = { generated: "2026-07-10", note: "小五升小六年度單字週計畫（Codex 起草、Claude 驗證）", weeks };
fs.writeFileSync(__dirname + "/../vocab_plan.js",
  "// 年度單字週計畫（W1=2026-08-02 起，週日開始）。每月備課時把當月週次搬進 curriculum.js。\n" +
  "const VOCAB_PLAN = " + JSON.stringify(data, null, 1) + ";\n" +
  'if (typeof module !== "undefined" && module.exports) module.exports = { VOCAB_PLAN };\n');

// 統計
const PHASE = n => n <= 5 ? "P1 鞏固" : n <= 13 ? "P2 起步" : n <= 22 ? "P3 過渡" : n <= 35 ? "P4 進階" : n <= 44 ? "P5 銜接" : "P6 總複習";
let totNew = 0, totRev = 0, lv = { 56: 0, 7: 0, 8: 0 };
weeks.forEach(w => {
  const rev = new Set((w.review || []).map(s => s.toLowerCase()));
  w.words.forEach(x => {
    const l = wordLevel(x.en) || 8;
    if (rev.has(x.en.toLowerCase())) totRev++; else { totNew++; lv[l <= 6 ? 56 : l]++; }
  });
});

// HTML
const monthOf = s => s.slice(0, 7);
const months = {};
weeks.forEach(w => (months[monthOf(w.start)] = months[monthOf(w.start)] || []).push(w));
const chip = (x, isRev) => {
  const l = wordLevel(x.en) || 8;
  const c = l <= 6 ? "#e6f6ec;color:#187a48" : l === 7 ? "#fff3e0;color:#a05c10" : "#fde8ec;color:#c0264b";
  return `<span class="w" style="background:${c.split(";")[0]};${c.split(";")[1]}" title="L${l}">${isRev ? "🔁" : ""}${x.en}<i>${x.zh}</i></span>`;
};
let body = "";
for (const [m, ws] of Object.entries(months)) {
  body += `<h2>${m.replace("-", " 年 ")} 月</h2>`;
  ws.forEach(w => {
    const rev = new Set((w.review || []).map(s => s.toLowerCase()));
    body += `<div class="wk"><div class="wh"><b>W${w.n}</b> ${w.start.slice(5)}~${w.end.slice(5)} · <b>${w.theme}</b> <span class="ph">${PHASE(w.n)}</span></div>
    <div class="ws">${w.words.map(x => chip(x, rev.has(x.en.toLowerCase()))).join("")}</div></div>`;
  });
}
const html = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>年度單字週計畫 — Kids English</title><style>
body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;max-width:860px;margin:0 auto;padding:0 14px 60px}
header{background:#2f80ed;color:#fff;text-align:center;padding:18px;border-radius:0 0 14px 14px;margin:0 -14px 14px}
header h1{margin:0;font-size:1.2rem} header p{margin:6px 0 0;font-size:.8rem;opacity:.9}
header a{color:#ffe27a;font-weight:700;text-decoration:none}
.legend{font-size:.78rem;background:#fff;border-radius:10px;padding:8px 12px;margin-bottom:10px;line-height:1.9}
h2{font-size:1rem;color:#1e5fb8;margin:20px 0 8px}
.wk{background:#fff;border-radius:12px;padding:10px 12px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,.07)}
.wh{font-size:.88rem;margin-bottom:7px} .ph{font-size:.7rem;background:#eef5ff;color:#1e5fb8;border-radius:6px;padding:2px 7px;margin-left:6px}
.ws{display:flex;flex-wrap:wrap;gap:5px}
.w{font-size:.76rem;font-weight:700;border-radius:7px;padding:3px 7px;white-space:nowrap}
.w i{font-style:normal;font-weight:400;opacity:.75;margin-left:3px;font-size:.7rem}
</style></head><body>
<header><h1>📅 年度單字週計畫（升小六）</h1>
<p>2026-08-02 ～ 2027-07-03 · 48 週 · 新字 ${totNew}＋複習 ${totRev} · <a href="index.html">← 回首頁</a></p></header>
<div class="legend">🟢 5-6 級（國小核心） 🟠 7 級（國小畢業~國中入門） 🔴 8 級（國中以上） 🔁 間隔複習字（≥4 週後回收）<br>
新字分布：5-6 級 ${lv[56]}、7 級 ${lv[7]}、8 級 ${lv[8]}。每週 ≥20 字與主題相關；難度逐階爬升（P1→P6）。</div>
${body}
</body></html>`;
fs.writeFileSync(__dirname + "/../vocab_plan.html", html);
console.log(`✔ vocab_plan.js + vocab_plan.html（新字 ${totNew}＋複習 ${totRev}；L5-6 ${lv[56]} / L7 ${lv[7]} / L8 ${lv[8]}）`);
