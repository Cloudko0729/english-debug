// 檢查學校課本題庫 kids/drills/school_daily.js。
//
// 用法: node kids/tools/validate_school_drill.js
//
// 最重要的一項是「唯一解」：這個系統踩過兩次同樣的坑 ——
// 克漏字四個選項在文法上都通、單字題兩個選項中文一樣。選擇題只要有第二個對的，
// 小孩選了對的也會被判錯，而且他永遠不知道為什麼。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const { TEXTBOOK_G6A: T } = require(path.join(KIDS, "school_db", "textbook_g6a.js"));
const { SCHOOL_BANK } = require(path.join(KIDS, "drills", "school_daily.js"));
const { EXAM_PLAN, examFocusFor, daysToExam } = require(path.join(KIDS, "school_db", "exam_plan.js"));
const AUDIO = path.join(KIDS, "audio", "school");

let fail = 0;
const bad = (m) => { fail++; console.log("  ✗ " + m); };
const warn = (m) => console.log("  ⚠️ " + m);

// 每個字屬於哪個 phonics 組（用來抓「兩個選項都是 er」）
const GROUP_OF = {};
T.units.forEach(u => (u.phonics.words || []).forEach(w => { GROUP_OF[w.w] = w.g; }));
T.warmup.phonics.forEach(p => p.words.forEach(w => { GROUP_OF[w] = p.group; }));
const gridGroup = w => (/ir/.test(w) ? "ir" : /ur/.test(w) ? "ur" : /er/.test(w) ? "er"
                      : /ar/.test(w) ? "ar" : /or/.test(w) ? "or" : null);

// 中文 → 英文對照，抓「兩個選項中文意思一樣」
const ZH = {};
T.units.flatMap(u => u.vocab).concat(T.culture.vocab).forEach(v => { ZH[v.en] = v.zh; });

function main() {
  console.log("題庫結構：");
  const keys = Object.keys(SCHOOL_BANK);
  const total = Object.values(SCHOOL_BANK).reduce((s, a) => s + a.length, 0);
  console.log(`  ${keys.length} 組、共 ${total} 題`);
  keys.forEach(k => {
    const n = SCHOOL_BANK[k].length;
    if (n === 0) warn(`${k} 是空的（Unit 3/4 課文未拍照，Review 2 因此無題）`);
    else if (n < 4) warn(`${k} 只有 ${n} 題，每天要抽 4 題`);
  });

  console.log("\n每題基本檢查：");
  let noAns = 0, dup = 0, tooMany = 0, tooFew = 0;
  Object.entries(SCHOOL_BANK).forEach(([k, arr]) => {
    arr.forEach((q, i) => {
      const at = `${k}#${i}`;
      if (!q.choices.includes(q.answer)) { bad(`${at} 正解不在選項裡：${q.answer}`); noAns++; }
      if (new Set(q.choices).size !== q.choices.length) { bad(`${at} 有重複選項`); dup++; }
      if (q.choices.length > 4) { bad(`${at} 有 ${q.choices.length} 個選項（應為 4）`); tooMany++; }
      if (q.choices.length < 3) { bad(`${at} 只有 ${q.choices.length} 個選項`); tooFew++; }
    });
  });
  if (!noAns && !dup && !tooMany && !tooFew) console.log("  ✓ 正解都在選項裡、無重複、都是 4 選 1");

  console.log("\n唯一解：");
  let multi = 0;
  Object.entries(SCHOOL_BANK).forEach(([k, arr]) => {
    arr.forEach((q, i) => {
      const at = `${k}#${i}`;
      // phonics：問「哪一個有 X 的音」，就只能有一個選項屬於 X
      const m = /哪一個字有 (\w+) 的音/.exec(q.q) || /哪一個字是 (\w+) 開頭/.exec(q.q);
      if (m) {
        const g = m[1];
        const hits = q.choices.filter(c => (GROUP_OF[c] || gridGroup(c)) === g);
        if (hits.length > 1) { bad(`${at} 有 ${hits.length} 個選項都是 ${g}：${hits.join("、")}`); multi++; }
      }
      // 單字：問「「中文」的英文是」，就只能有一個選項是那個中文
      const z = /「(.+?)」的英文是/.exec(q.q);
      if (z) {
        const hits = q.choices.filter(c => ZH[c] === z[1]);
        if (hits.length > 1) { bad(`${at} 有 ${hits.length} 個選項都是「${z[1]}」：${hits.join("、")}`); multi++; }
      }
      // 課文填空：把選項填回去，只有正解能還原成原句
      if (q.kind === "sentence" && q.full) {
        const fits = q.choices.filter(c => q.q.replace("＿＿＿", c) === q.full);
        if (fits.length > 1) { bad(`${at} 有 ${fits.length} 個選項填進去都對`); multi++; }
        if (fits.length === 0) { bad(`${at} 正解填回去跟原句對不起來`); multi++; }
      }
    });
  });
  if (!multi) console.log("  ✓ 沒有多重正解");

  console.log("\n音檔：");
  const want = new Set();
  Object.values(SCHOOL_BANK).flat().forEach(q => { if (q.audio) want.add(q.audio); });
  const miss = [...want].filter(k => !fs.existsSync(path.join(AUDIO, k + ".mp3")));
  if (miss.length) bad(`缺 ${miss.length} 個：${miss.slice(0, 8).join(" ")}`);
  else console.log(`  ✓ ${want.size} 個發音檔都在`);

  console.log("\n考前排程：");
  const covered = new Set();
  EXAM_PLAN.weeks.forEach(w => w.focus.forEach(f => covered.add(f)));
  const need = T.units.map(u => u.id).concat(["warmup", "r1", "r2", "moon"]);
  const notPlanned = need.filter(x => !covered.has(x));
  if (notPlanned.length) bad(`沒排進任何一週：${notPlanned.join(" ")}`);
  else console.log("  ✓ 所有單元都排進去了");
  // 每一週都要抽得到題
  EXAM_PLAN.weeks.forEach(w => {
    const n = w.focus.reduce((s, f) => s + (SCHOOL_BANK[f] || []).length, 0);
    if (n < 4) bad(`${w.start} 那一週只有 ${n} 題可抽（要 4 題）`);
  });
  // 考完就不該再出題
  if (examFocusFor("2026-11-06")) bad("考完隔天還在出學校題");
  else console.log("  ✓ 11/06（考後）不再出學校題");
  const d = daysToExam("2026-09-01");
  if (d !== 65) bad(`倒數天數算錯：9/1 應為 65 天，實際 ${d}`);
  else console.log("  ✓ 倒數天數正確");

  console.log(`\n${fail === 0 ? "✅ 全部通過" : "❌ " + fail + " 個問題"}`);
  process.exit(fail ? 1 : 0);
}

main();
