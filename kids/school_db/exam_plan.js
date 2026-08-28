// 期中考（2026-11-05）前的每週學校進度對應表。
//
// 每日練習的第 ⑨ 段「學校課本」會依 DRILL_DATE 查這張表，決定今天要練哪一課。
// 週次沿用既有規則：週日起算，跟 curriculum.js 一致。
//
// 排法：學校一課大約上三到四週，所以前面照課本順序推進，最後兩週整個範圍混合複習
// —— 期中考本來就是混合出題，只練單課到考前會沒練過「跨課辨別」。
// Unit 3、4 的課文還沒拍到，那兩週先用 Contents 給的單字與句型（那正是必考的部分）。

const EXAM_PLAN = {
  examDate: "2026-11-05",
  // start = 該週的週日
  weeks: [
    { start: "2026-08-30", focus: ["warmup"],       label: "開學暖身：複習頁字彙與 phonics" },
    { start: "2026-09-06", focus: ["u1"],           label: "Unit 1 國家（單字＋Where are you from?）" },
    { start: "2026-09-13", focus: ["u1"],           label: "Unit 1 be 動詞替換＋er/ir/ur" },
    { start: "2026-09-20", focus: ["u1", "u2"],     label: "Unit 1 收尾 → Unit 2 病症單字" },
    { start: "2026-09-27", focus: ["u2"],           label: "Unit 2 have/has＋Does he have…?" },
    { start: "2026-10-04", focus: ["u2", "r1"],     label: "Unit 2 ar/or ＋ Review 1" },
    { start: "2026-10-11", focus: ["u3"],           label: "Unit 3 食物（What would you like to eat?）" },
    { start: "2026-10-18", focus: ["u3", "u4"],     label: "Unit 3 收尾 → Unit 4 作息單字" },
    { start: "2026-10-25", focus: ["u4", "r2"],     label: "Unit 4 時間問答 ＋ Review 2" },
    { start: "2026-11-01", focus: ["u1", "u2", "u3", "u4", "moon"], label: "期中考總複習（11/5 考）" },
  ],
};

// 某一天要練哪些單元（回傳 id 陣列）。超出範圍回 null。
function examFocusFor(dateStr) {
  const ws = EXAM_PLAN.weeks;
  let hit = null;
  for (const w of ws) {
    if (dateStr >= w.start) hit = w; else break;
  }
  if (!hit) return null;
  // 考完就不再出學校題
  if (dateStr > EXAM_PLAN.examDate) return null;
  return hit;
}

// 距離考試還有幾天（負數＝已考完）
function daysToExam(dateStr) {
  const p = s => { const a = String(s).split("-"); return new Date(+a[0], +a[1] - 1, +a[2], 12); };
  return Math.round((p(EXAM_PLAN.examDate) - p(dateStr)) / 86400000);
}

if (typeof module !== "undefined" && module.exports)
  module.exports = { EXAM_PLAN, examFocusFor, daysToExam };
if (typeof window !== "undefined") {
  window.EXAM_PLAN = EXAM_PLAN;
  window.examFocusFor = examFocusFor;
  window.daysToExam = daysToExam;
}
