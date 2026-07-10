// 整理文法講稿：合併批次 JSON → 每單元一份 .txt（NotebookLM 用）＋ 總覽 HTML（家長閱讀用）
const fs = require("fs"), path = require("path");
const { GRAMMAR_CORE } = require("../grammar_core/plan.js");
const outTxt = path.join(__dirname, "..", "grammar_core", "scripts");
fs.mkdirSync(outTxt, { recursive: true });

const units = {};
for (let b = 1; b <= 4; b++) {
  const f = path.join(__dirname, `_gram_batch${b}.json`);
  if (!fs.existsSync(f)) continue;
  Object.assign(units, JSON.parse(fs.readFileSync(f, "utf8")).units);
}

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
let idx = [], htmlUnits = "", made = 0;
for (const u of GRAMMAR_CORE) {
  const c = units[u.id];
  if (!c) { idx.push(`（缺 ${u.id}）`); continue; }
  made++;
  // ── NotebookLM 純文字稿 ──
  let t = `${u.name}（${u.eng}）\n核心觀念：${u.concept}\n這一集要講透：${u.podcastKey}\n\n=== 講稿 ===\n`;
  c.podcast.forEach(s => { t += (s.v === "en" ? `【英文例句】 ${s.t}` : s.t) + "\n"; });
  t += `\n=== 例句集 ===\n`;
  c.examples.forEach((e, i) => { t += `${i + 1}. ${e.en} — ${e.zh}\n`; });
  fs.writeFileSync(path.join(outTxt, `${u.id}.txt`), t);
  // ── HTML 段 ──
  htmlUnits += `<div class="unit" id="${u.id}"><h2>${u.icon} ${esc(u.name)} <span class="eng">${esc(u.eng)}</span></h2>
  <p class="meta">核心：${esc(u.concept)}｜講透：<b>${esc(u.podcastKey)}</b>｜建議 ${u.weeks} 週</p>
  <div class="script">` +
    c.podcast.map(s => s.v === "en"
      ? `<p class="en">🔊 ${esc(s.t)}</p>`
      : `<p>${esc(s.t)}</p>`).join("") +
  `</div><details><summary>例句集（${c.examples.length}）＋小測驗（${c.quiz.length}）</summary>
  <ol>${c.examples.map(e => `<li><b>${esc(e.en)}</b> — ${esc(e.zh)}</li>`).join("")}</ol>
  <ol class="quiz">${c.quiz.map(q => `<li>${esc(q.q)}<br><small>${q.choices.map(ch => ch === q.answer ? `<b>✅ ${esc(ch)}</b>` : esc(ch)).join(" ／ ")}</small></li>`).join("")}</ol>
  </details></div>`;
  idx.push(`<a href="#${u.id}">${u.icon} ${esc(u.name)}</a>`);
}

const html = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>文法根基課程 講稿總覽</title><style>
body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;max-width:800px;margin:0 auto;padding:0 16px 60px;line-height:1.75}
header{background:#2f80ed;color:#fff;text-align:center;padding:18px;border-radius:0 0 14px 14px;margin:0 -16px 14px}
header h1{margin:0;font-size:1.2rem} header p{margin:6px 0 0;font-size:.8rem;opacity:.9}
nav{font-size:.82rem;background:#fff;border-radius:10px;padding:10px 14px;display:flex;flex-wrap:wrap;gap:8px}
nav a{color:#1e5fb8;text-decoration:none;font-weight:700}
.unit{background:#fff;border-radius:14px;padding:16px 18px;margin-top:16px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
h2{font-size:1.05rem;color:#1e5fb8;margin:0 0 4px} .eng{font-size:.8rem;color:#999;font-weight:400}
.meta{font-size:.8rem;color:#777;margin:0 0 10px}
.script p{margin:8px 0;font-size:.92rem}
.script .en{background:#eaf3ff;border-left:4px solid #2f80ed;padding:6px 12px;border-radius:0 8px 8px 0;font-weight:700;color:#1e5fb8}
details{margin-top:10px;font-size:.85rem} summary{cursor:pointer;font-weight:700;color:#187a48}
.quiz li{margin-bottom:6px}
</style></head><body>
<header><h1>📻 文法根基課程 — 講稿總覽</h1><p>16 單元 · 每篇 2.5~4 分鐘 · 可做為 NotebookLM 語音來源 · <a href="../index.html" style="color:#ffe27a">← 回首頁</a></p></header>
<nav>${idx.join("")}</nav>
${htmlUnits}
</body></html>`;
fs.writeFileSync(path.join(__dirname, "..", "grammar_core", "scripts.html"), html);
console.log(`✔ 講稿 ${made}/16 單元 → grammar_core/scripts/*.txt + scripts.html`);
