// 從 grammar_core 批次 JSON 產生 quizbank.js（每日測驗的文法題來源＋進度排程）
const fs = require("fs"), path = require("path");
const { GRAMMAR_CORE } = require("../grammar_core/plan.js");
const units = {};
for (let b = 1; b <= 4; b++)
  Object.assign(units, JSON.parse(fs.readFileSync(path.join(__dirname, `_gram_batch${b}.json`), "utf8")).units);

const meta = GRAMMAR_CORE.map(u => ({ id: u.id, name: u.name, icon: u.icon,
  minWeeks: parseInt(String(u.weeks)) || 2 }));
const quiz = {};
GRAMMAR_CORE.forEach(u => { quiz[u.id] = units[u.id].quiz; });

const out = `// 文法根基課程 題庫＋進度排程（產生自 _gram_batch*.json，勿手改；重產跑 tools/_make_gc_quizbank.js）
const GC_UNITS = ${JSON.stringify(meta)};
const GC_QUIZ = ${JSON.stringify(quiz)};
const GC_START = "2026-07-12";   // 課程起算日（週日）
// 依「建議最少週數」推進度：回傳 { current, opened:[已開放單元...] }
function gcProgress(dateStr) {
  const days = Math.floor((Date.parse(dateStr) - Date.parse(GC_START)) / 86400000);
  if (days < 0) return null;
  const wk = Math.floor(days / 7);
  let acc = 0, cur = GC_UNITS[GC_UNITS.length - 1];
  const opened = [];
  for (const u of GC_UNITS) {
    opened.push(u);
    acc += u.minWeeks;
    if (wk < acc) { cur = u; break; }
  }
  return { current: cur, opened };
}
if (typeof module !== "undefined" && module.exports) module.exports = { GC_UNITS, GC_QUIZ, gcProgress };
`;
fs.writeFileSync(path.join(__dirname, "..", "grammar_core", "quizbank.js"), out);
console.log("✔ quizbank.js（" + meta.length + " 單元、" + Object.values(quiz).reduce((a, q) => a + q.length, 0) + " 題）");
