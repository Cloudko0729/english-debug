// 把年度單字週計畫（vocab_plan.js）的週次搬進 curriculum.js。
//
// vocab_plan.js 是備課來源：48 週、每週 30 字、涵蓋 2026-08-02 ~ 2027-07-03，
// 但站上實際讀的是 curriculum.js。原本靠人工每月手動搬，結果 8 月那次沒人搬，
// curriculum.js 從 2026-08 起 weeks 全空，每日練習與週單字表會直接開天窗。
// 這支工具把它自動化，之後每月不必再手動複製。
//
// 用法:
//   node kids/tools/sync_curriculum_weeks.js          # 只填 weeks 是空的月份
//   node kids/tools/sync_curriculum_weeks.js --force  # 連已有內容的月份也覆蓋
//
// 只動 weeks 欄位，不碰 grammar（那批指向即將退役的 grammar_core 頁面，另案處理）。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const CURRICULUM_FILE = path.join(KIDS, "curriculum.js");
const PLAN_FILE = path.join(KIDS, "vocab_plan.js");
const FORCE = process.argv.includes("--force");

function loadConst(file, name) {
  return new Function(fs.readFileSync(file, "utf8") + "; return " + name + ";")();
}

// 一週歸屬到哪個月：用開始日。跨月的那一週（例如 8/30–9/5）算 8 月，
// 跟 curriculum.js 既有的 7 月週次一致（W4 是 7/19–7/25，沒有跨月問題，
// 但用開始日是唯一不會讓同一週同時出現在兩個月的規則）。
function monthOf(week) { return week.start.slice(0, 7); }

function fmtWords(words, indent) {
  const pad = " ".repeat(indent);
  const lines = [];
  for (let i = 0; i < words.length; i += 3) {
    lines.push(pad + words.slice(i, i + 3).map(w =>
      `{ en: ${JSON.stringify(w.en)}, zh: ${JSON.stringify(w.zh)}, pos: ${JSON.stringify(w.pos)} }`
    ).join(", ") + ",");
  }
  return lines.join("\n");
}

function fmtWeeks(weeks, grammarLabels) {
  const body = weeks.map(w =>
`      {
        n: ${w.n}, start: ${JSON.stringify(w.start)}, end: ${JSON.stringify(w.end)},
        theme: ${JSON.stringify(w.theme)}, grammar: ${JSON.stringify(grammarLabels)},
        words: [
${fmtWords(w.words, 10)}
        ],
      },`).join("\n");
  return "weeks: [\n" + body + "\n    ]";
}

function main() {
  const plan = loadConst(PLAN_FILE, "VOCAB_PLAN");
  const curriculum = loadConst(CURRICULUM_FILE, "CURRICULUM");

  // 依月份分組，並重新編號成該月的第幾週
  const byMonth = {};
  plan.weeks.forEach(w => {
    const m = monthOf(w);
    if (!byMonth[m]) byMonth[m] = [];
    byMonth[m].push(w);
  });
  Object.keys(byMonth).forEach(m => {
    byMonth[m].forEach((w, i) => { w.n = i + 1; });
  });

  let src = fs.readFileSync(CURRICULUM_FILE, "utf8");
  const filled = [], skipped = [], noSource = [];

  curriculum.forEach(month => {
    const weeks = byMonth[month.month];
    if (!weeks || !weeks.length) { noSource.push(month.month); return; }
    if (month.weeks && month.weeks.length && !FORCE) { skipped.push(month.month); return; }

    // 週的 grammar 只是顯示用的主題標籤，從該月的文法設定推導
    const labels = (month.grammar || []).map(g => g.topic).filter(Boolean);

    // 定位這個月的 weeks: [] 並就地替換。用 month 字串當錨點，避免改到別的月份。
    const anchor = `month: ${JSON.stringify(month.month)}`;
    const at = src.indexOf(anchor);
    if (at < 0) throw new Error(`找不到 ${month.month} 的定義`);
    const emptyAt = src.indexOf("weeks: []", at);
    if (emptyAt < 0) {
      if (!FORCE) { skipped.push(month.month); return; }
      throw new Error(`${month.month} 的 weeks 不是空的，--force 尚未支援覆蓋非空週次`);
    }
    // 確認這個 weeks: [] 確實屬於這個月（下一個 month: 之前）
    const nextMonthAt = src.indexOf("month: \"", at + anchor.length);
    if (nextMonthAt >= 0 && emptyAt > nextMonthAt) {
      throw new Error(`${month.month} 的 weeks: [] 落在下一個月份區塊，格式與預期不符`);
    }

    src = src.slice(0, emptyAt) + fmtWeeks(weeks, labels) + src.slice(emptyAt + "weeks: []".length);
    filled.push({ month: month.month, weeks: weeks.length, words: weeks.reduce((s, w) => s + w.words.length, 0) });
  });

  if (filled.length) fs.writeFileSync(CURRICULUM_FILE, src, "utf8");

  // 寫回後重新載入驗證，確保產出的檔案語法正確且資料讀得出來
  const after = loadConst(CURRICULUM_FILE, "CURRICULUM");
  const report = after.map(m => ({
    month: m.month,
    weeks: (m.weeks || []).length,
    words: (m.weeks || []).reduce((s, w) => s + w.words.length, 0),
  }));

  console.log(JSON.stringify({
    ok: true, filled, skipped,
    noSourceInPlan: noSource,
    curriculumAfter: report,
  }, null, 2));
}

main();
