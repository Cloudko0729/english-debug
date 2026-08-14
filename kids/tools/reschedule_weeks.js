// 在年度單字週計畫（kids/vocab_plan.js）中插入複習週，並重排後續週次。
//
// 用法:
//   node kids/tools/reschedule_weeks.js --dry
//   node kids/tools/reschedule_weeks.js
//
// 插進來的週次要從哪裡挪出空間 —— 查過了，48 週裡沒有任何一週是純複習：
// 連「年度回顧複習週」「春季複習週」都各自帶了 20 個別週沒有的新字。
// 所以擠掉任何一週都會真的少教一批單字，這裡改成整份往後順延，年度結束往後兩週。
//
// 但不能無腦順延 —— 有幾週綁在真實日期上，順延兩週教材就會晚於節日本身
// （中秋 2026-09-25 的教材會落到 10/04）。所以那幾週釘在原本的日期，
// 其餘主題依序填進剩下的格子。結果：一個主題都沒少、節日週一格都沒動、
// 其他非季節性主題往後約兩週。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const PLAN_FILE = path.join(KIDS, "vocab_plan.js");
const WORDS_PER_WEEK = 30;

const INSERT_AT = "2026-08-16";     // 從這一週開始插入
const REVIEWS = [
  { theme: "7 月總複習", months: ["2026-07"] },
  { theme: "8 月上半總複習", months: ["2026-08"], before: INSERT_AT },
];

// 綁真實日期的週，釘住不動
const PINNED = [
  "新學期與課表",         // 開學就在 9/1 前後，往後挪就不是「新學期」了
  "中秋與家人",          // 中秋 2026-09-25
  "聖誕與禮物",          // 12-25
  "跨年與願望",          // 12-31 / 01-01
  "新年目標與習慣",       // 元旦後第一週
  "農曆新年與家族",       // 2027 除夕 02-06
  "清明家族與戶外",       // 04-05
];

function loadConst(file, name) {
  return new Function(fs.readFileSync(file, "utf8") + "; return " + name + ";")();
}
function ymd(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
         "-" + String(d.getDate()).padStart(2, "0");
}
function parse(s) { const p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
function addDays(s, n) { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); }

// 複習週挑字：從來源週各取「最難的幾個」，難度用 wordlevels.js 的分級。
// 平均分配到每個來源週，才不會整週複習都壓在同一個主題上。
function pickReviewWords(sourceWeeks, want) {
  const { wordLevel } = require(path.join(KIDS, "wordlevels.js"));
  const perWeek = sourceWeeks.map((w, i) =>
    Math.floor(want / sourceWeeks.length) + (i < want % sourceWeeks.length ? 1 : 0));
  const out = [], seen = new Set();
  sourceWeeks.forEach((w, i) => {
    // 同級維持原順序 → 重跑產生一模一樣的結果
    const ranked = w.words.map((x, j) => ({ x, j, lv: wordLevel(String(x.en).toLowerCase()) || 5 }))
      .sort((a, b) => (b.lv - a.lv) || (a.j - b.j));
    let taken = 0;
    for (const r of ranked) {
      if (taken >= perWeek[i]) break;
      const k = String(r.x.en).toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k); out.push(r.x); taken++;
    }
  });
  if (out.length !== want) throw new Error(`複習週只湊到 ${out.length} 字，需要 ${want}`);
  return out;
}

function main() {
  const dry = process.argv.includes("--dry");
  const plan = loadConst(PLAN_FILE, "VOCAB_PLAN");
  const curriculum = loadConst(path.join(KIDS, "curriculum.js"), "CURRICULUM");
  const original = plan.weeks.map(w => ({ start: w.start, theme: w.theme, words: w.words }));

  const at = original.findIndex(w => w.start === INSERT_AT);
  if (at < 0) throw new Error(`vocab_plan 沒有 ${INSERT_AT} 這一週`);

  // 複習週的單字從 curriculum 已經教過的週次挑（7 月只存在 curriculum，不在 vocab_plan）
  const reviews = REVIEWS.map(r => {
    const src = [];
    curriculum.forEach(m => {
      if (!r.months.includes(m.month)) return;
      (m.weeks || []).forEach(w => {
        if (r.before && w.start >= r.before) return;
        if (w.start >= INSERT_AT) return;
        src.push(w);
      });
    });
    if (!src.length) throw new Error(`${r.theme} 的來源週是空的`);
    return { theme: r.theme, words: pickReviewWords(src, WORDS_PER_WEEK), review: true, from: src.map(w => w.start) };
  });

  // 新的主題順序 = 插入點之前 + 複習週 + 插入點之後
  const seq = original.slice(0, at).concat(reviews, original.slice(at));

  // 格子：從原本第一週起連續 seq.length 週
  const slots = [];
  for (let i = 0, d = original[0].start; i < seq.length; i++, d = addDays(d, 7)) slots.push(d);

  // 釘住的主題回到原本日期，其餘依序填空格
  const pinAt = {};
  PINNED.forEach(t => {
    const w = original.find(x => x.theme === t);
    if (!w) throw new Error(`計畫裡找不到要釘住的「${t}」`);
    if (!slots.includes(w.start)) throw new Error(`${t} 的原日期 ${w.start} 不在格子範圍內`);
    pinAt[w.start] = t;
  });
  const pinnedThemes = new Set(Object.values(pinAt));
  const queue = seq.filter(w => !pinnedThemes.has(w.theme));
  if (queue.length + Object.keys(pinAt).length !== slots.length) {
    throw new Error(`格子 ${slots.length} 個，主題 ${queue.length}+${Object.keys(pinAt).length} 個，對不起來`);
  }

  const placed = slots.map(slot => {
    const t = pinAt[slot];
    const w = t ? seq.find(x => x.theme === t) : queue.shift();
    return { start: slot, end: addDays(slot, 6), theme: w.theme, words: w.words, review: w.review ? [] : [] };
  });

  // 檢查：主題一個沒少、沒有重複、單字總數守恆
  const themesBefore = new Set(original.map(w => w.theme));
  const themesAfter = new Set(placed.map(w => w.theme));
  const lost = [...themesBefore].filter(t => !themesAfter.has(t));
  if (lost.length) throw new Error("主題消失了：" + lost.join("、"));
  if (themesAfter.size !== placed.length) throw new Error("有重複的主題");

  const moved = placed.filter(w => {
    const o = original.find(x => x.theme === w.theme);
    return o && o.start !== w.start;
  });

  console.log(`\n插入 ${reviews.length} 個複習週，年度從 ${original.length} 週變成 ${placed.length} 週`);
  console.log(`結束日 ${original[original.length - 1].start} → ${placed[placed.length - 1].start}\n`);
  console.log("複習週：");
  reviews.forEach((r, i) => {
    console.log(`  ${slots[at + i]}　${r.theme}（挑自 ${r.from.join("、")}）`);
    console.log(`    ${r.words.map(x => x.en).join(", ")}`);
  });
  console.log(`\n釘住不動的節日週：`);
  Object.entries(pinAt).forEach(([d, t]) => console.log(`  ${d}　${t}`));
  console.log(`\n改了日期的主題 ${moved.length} 個（前 10 個）：`);
  moved.slice(0, 10).forEach(w => {
    const o = original.find(x => x.theme === w.theme);
    console.log(`  ${o.start} → ${w.start}　${w.theme}`);
  });

  if (dry) { console.log("\n（--dry：沒有寫入）"); return; }

  // 依月份重新編號（跟 sync_curriculum_weeks.js 的規則一致：用開始日歸月）
  const byMonth = {};
  placed.forEach(w => { const m = w.start.slice(0, 7); (byMonth[m] = byMonth[m] || []).push(w); });
  Object.values(byMonth).forEach(ws => ws.forEach((w, i) => { w.n = i + 1; }));
  plan.weeks = placed.map(w => ({ n: w.n, start: w.start, end: w.end, theme: w.theme, words: w.words, review: [] }));

  const header = fs.readFileSync(PLAN_FILE, "utf8").split("\n")[0];
  fs.writeFileSync(PLAN_FILE, header + "\nconst VOCAB_PLAN = " +
    JSON.stringify(plan, null, 1) + ";\n" +
    'if (typeof module !== "undefined" && module.exports) module.exports = { VOCAB_PLAN };\n', "utf8");
  console.log("\n已寫入 kids/vocab_plan.js");
  console.log("下一步：node kids/tools/sync_curriculum_weeks.js --force");
}

main();
