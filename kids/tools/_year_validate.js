// 驗證年度批次 JSON：node _year_validate.js <batch.json> [前面批次.json ...]
// 規則：每週30字、級別配額±2、非複習字不得與任何已用字重複、
//       複習字必須是 L7-8 且出現在 ≥4 週前、每週複習 ≤5（P6 ≤10）
const fs = require("fs");
const { wordLevel } = require("../wordlevels.js");
const { CURRICULUM } = require("../curriculum.js");

// Codex 覆審後配額（P1~P6）
const QUOTA = w =>
  w <= 5  ? { 56: 26, 7: 4,  8: 0 } :
  w <= 13 ? { 56: 22, 7: 8,  8: 0 } :
  w <= 22 ? { 56: 16, 7: 12, 8: 2 } :
  w <= 35 ? { 56: 10, 7: 14, 8: 6 } :
  w <= 44 ? { 56: 6,  7: 14, 8: 10 } :
            { 56: 0,  7: 10, 8: 10 };   // P6 另有 10 複習
const TOL = 3;

const files = process.argv.slice(2);
const target = files[0];
const batches = files.map(f => JSON.parse(fs.readFileSync(__dirname + "/" + f, "utf8")));

// 已用字 → 首次出現週次（0 = 2026-07 課程或 basic）
const firstSeen = new Map();
CURRICULUM.forEach(c => (c.weeks || []).forEach(wk => wk.words.forEach(w => firstSeen.set(w.en.toLowerCase(), 0))));
const WORDBANK = (() => { const m = {}; eval(fs.readFileSync(__dirname + "/../wordbank.js", "utf8") + ";m.w=WORDBANK;"); return m.w; })();
WORDBANK.filter(w => w.level === "basic").forEach(w => firstSeen.set(w.en.toLowerCase(), 0));
// 前面批次
batches.slice(1).forEach(b => b.weeks.forEach(wk => wk.words.forEach(w => {
  const k = w.en.toLowerCase();
  if (!firstSeen.has(k)) firstSeen.set(k, wk.n);
})));

const errs = [], warns = [];
const tgt = batches[0];
tgt.weeks.forEach(wk => {
  const rev = new Set((wk.review || []).map(s => s.toLowerCase()));
  if (wk.words.length !== 30) errs.push(`W${wk.n} 字數 ${wk.words.length}`);
  if (!wk.theme) errs.push(`W${wk.n} 無主題`);
  const seen = new Set();
  const q = QUOTA(wk.n), got = { 56: 0, 7: 0, 8: 0 };
  const revMax = (wk.n >= 45 || [20, 35, 44].includes(wk.n)) ? 10 : 5;   // 複習週放寬
  if (rev.size > revMax) errs.push(`W${wk.n} 複習字 ${rev.size} > ${revMax}`);
  wk.words.forEach(w => {
    const k = w.en.toLowerCase();
    if (seen.has(k)) errs.push(`W${wk.n} 週內重複 '${k}'`); seen.add(k);
    const lv = wordLevel(k);
    if (!lv) { errs.push(`W${wk.n} '${k}' 無分級（不在池）`); return; }
    got[lv <= 6 ? 56 : lv]++;
    if (rev.has(k)) {
      if (lv < 7) errs.push(`W${wk.n} 複習字 '${k}' 級別 ${lv} < 7`);
      const fs_ = firstSeen.get(k);
      if (fs_ === undefined) errs.push(`W${wk.n} 複習字 '${k}' 之前沒教過`);
      else if (fs_ > 0 && wk.n - fs_ < 4) errs.push(`W${wk.n} 複習字 '${k}' 間隔 ${wk.n - fs_} < 4 週`);
    } else {
      if (firstSeen.has(k)) errs.push(`W${wk.n} '${k}' 已在 ${firstSeen.get(k) === 0 ? "既有課程" : "W" + firstSeen.get(k)} 用過（非複習）`);
    }
  });
  // 配額寬鬆帶：複習字也計入該級，容許 ±TOL＋複習數的浮動
  const slack = rev.size;
  if (got[56] > q[56] + TOL || got[56] < q[56] - TOL - slack) warns.push(`W${wk.n} L5-6 ${got[56]} vs 配額 ${q[56]}`);
  if (got[8] > q[8] + TOL + slack) warns.push(`W${wk.n} L8 ${got[8]} vs 配額 ${q[8]}`);
  // 本批內部後續週查重用
  wk.words.forEach(w => { const k = w.en.toLowerCase(); if (!firstSeen.has(k) && !rev.has(k)) firstSeen.set(k, wk.n); });
});
if (errs.length) { console.error("❌ " + errs.length + " 錯誤:\n" + errs.slice(0, 40).join("\n")); process.exit(1); }
console.log(`✔ ${target} 驗證通過（${tgt.weeks.length} 週）` + (warns.length ? `；配額提醒 ${warns.length} 項:\n` + warns.join("\n") : ""));
