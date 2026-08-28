// 學校考試範圍與考前每週進度表。
//
// 期中考 2026-11-05（四）：Unit 1、Unit 2、Review 1
// 期末考 日期未定：       Unit 3、Unit 4、Review 2、中秋節、Task
//
// 每日練習的第 ⑨ 段「學校課本」會依 DRILL_DATE 查這張表，決定今天要練哪一課。
// 週次沿用既有規則：週日起算，跟 curriculum.js 一致。
//
// 為什麼期中考只有兩課卻排十週：學校本來就上得慢，而且這十週是「跟著學校走」，
// 不是趕進度。所以前七週一課一課紮實推，後三週改成混合 —— 期中考是混著考的，
// 只練單課到考前，就沒練過「跨課辨別」。
//
// 中秋節（課本 p.79）放在期末範圍是照課本順序。但 2026 中秋是 9/25，
// 學校有可能在節日當週就上，那樣它會落進期中範圍。等確認再調 phase。

const EXAMS = {
  midterm: {
    name: "期中考", date: "2026-11-05",
    scope: "Unit 1、Unit 2、Review 1",
    units: ["u1", "u2", "r1"],
  },
  final: {
    name: "期末考", date: null,          // 學校還沒公布
    scope: "Unit 3、Unit 4、Review 2、中秋節",
    units: ["u3", "u4", "r2", "moon"],
  },
};

const EXAM_PLAN = {
  exams: EXAMS,
  // 相容舊欄位：頁面上的倒數目前指期中考
  examDate: EXAMS.midterm.date,
  // start = 該週的週日
  weeks: [
    // ── 期中考範圍（Unit 1、2、Review 1）─────────────────────────────
    { start: "2026-08-30", phase: "midterm", focus: ["warmup"],       label: "開學暖身：複習頁字彙與 phonics" },
    { start: "2026-09-06", phase: "midterm", focus: ["u1"],           label: "Unit 1 國家單字＋Where are you from?" },
    { start: "2026-09-13", phase: "midterm", focus: ["u1"],           label: "Unit 1 be 動詞替換（am／are／is）" },
    { start: "2026-09-20", phase: "midterm", focus: ["u1"],           label: "Unit 1 課文＋er／ir／ur" },
    { start: "2026-09-27", phase: "midterm", focus: ["u2"],           label: "Unit 2 病症單字＋What's wrong?" },
    { start: "2026-10-04", phase: "midterm", focus: ["u2"],           label: "Unit 2 have／has＋Does he have…?" },
    { start: "2026-10-11", phase: "midterm", focus: ["u2"],           label: "Unit 2 課文＋ar／or＋構詞" },
    { start: "2026-10-18", phase: "midterm", focus: ["u1", "u2"],     label: "Unit 1＋2 混合（跨課辨別）" },
    { start: "2026-10-25", phase: "midterm", focus: ["r1"],           label: "Review 1 短文＋混合辨音" },
    { start: "2026-11-01", phase: "midterm", focus: ["u1", "u2", "r1"], label: "期中考總複習（11/5 考）" },

    // ── 期末考範圍（Unit 3、4、Review 2、中秋）──────────────────────
    { start: "2026-11-08", phase: "final", focus: ["u3"],             label: "Unit 3 食物單字＋What would you like to eat?" },
    { start: "2026-11-15", phase: "final", focus: ["u3"],             label: "Unit 3 Would you like…?＋oi／oy" },
    { start: "2026-11-22", phase: "final", focus: ["u3", "moon"],     label: "Unit 3 收尾＋中秋節用語" },
    { start: "2026-11-29", phase: "final", focus: ["u4"],             label: "Unit 4 作息單字＋What time do you…?" },
    { start: "2026-12-06", phase: "final", focus: ["u4"],             label: "Unit 4 時間唸法＋ou／ow" },
    { start: "2026-12-13", phase: "final", focus: ["u3", "u4"],       label: "Unit 3＋4 混合（跨課辨別）" },
    { start: "2026-12-20", phase: "final", focus: ["r2", "moon"],     label: "Review 2＋中秋節複習" },
    { start: "2026-12-27", phase: "final", focus: ["u3", "u4", "r2", "moon"], label: "期末考總複習" },
  ],
};

// 某一天要練哪些單元。超出排程範圍回 null。
function examFocusFor(dateStr) {
  const ws = EXAM_PLAN.weeks;
  if (dateStr < ws[0].start) return null;
  let hit = null;
  for (const w of ws) { if (dateStr >= w.start) hit = w; else break; }
  if (!hit) return null;
  // 考完就別再複習那一場 —— 期中考在 11/5（週四），但那一週到 11/7 才結束，
  // 只看週界的話 11/6、11/7 還會出「期中考總複習」。考完隔天直接跳到下一場的第一週。
  const exDate = EXAMS[hit.phase].date;
  if (exDate && dateStr > exDate) {
    const next = ws.find(w => w.phase !== hit.phase && w.start > exDate);
    if (!next) return null;
    hit = next;
  }
  // 最後一週之後就停 —— 排程沒排到的日子不要硬出題
  const last = ws[ws.length - 1];
  const lastEnd = (() => { const p = last.start.split("-"); const d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + 6); return d.toISOString().slice(0, 10); })();
  if (dateStr > lastEnd) return null;
  return hit;
}

// 那一天正在準備哪一場考試，還有幾天。期末日期未定時 days 為 null。
function nextExamFor(dateStr) {
  const wk = examFocusFor(dateStr);
  const phase = wk ? wk.phase : (dateStr <= EXAMS.midterm.date ? "midterm" : "final");
  const ex = EXAMS[phase];
  return { phase, name: ex.name, date: ex.date, scope: ex.scope, days: ex.date ? diffDays(dateStr, ex.date) : null };
}

function diffDays(from, to) {
  const p = s => { const a = String(s).split("-"); return new Date(+a[0], +a[1] - 1, +a[2], 12); };
  return Math.round((p(to) - p(from)) / 86400000);
}

// 距離期中考還有幾天（負數＝已考完）。保留舊介面。
function daysToExam(dateStr) { return diffDays(dateStr, EXAMS.midterm.date); }

if (typeof module !== "undefined" && module.exports)
  module.exports = { EXAM_PLAN, EXAMS, examFocusFor, nextExamFor, daysToExam };
if (typeof window !== "undefined") {
  window.EXAM_PLAN = EXAM_PLAN;
  window.EXAMS = EXAMS;
  window.examFocusFor = examFocusFor;
  window.nextExamFor = nextExamFor;
  window.daysToExam = daysToExam;
}
