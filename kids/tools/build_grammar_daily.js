// 產生每日練習第 ⑧ 段（文法）的資料 kids/drills/grammar_daily.js，取代已退役的
// grammar_core/quizbank.js。
//
// 用法: node kids/tools/build_grammar_daily.js
//
// 為什麼保留常數名稱 GC_UNITS / GC_QUIZ / gcProgress：
//   daily_engine.js 與 33 個既有的每日練習頁都依賴這組介面。改名要同時動很多檔案，
//   風險遠大於收益，所以只換內容來源（grammar_core 16 單元 → grammar_db 48 節點），
//   介面保持相容。
//
// 排程仍是日期推進，不是個人月課表 —— daily_engine 在組題時還不知道是哪個學生
//（學生是頁面載入後才選的），所以這裡沒辦法吃 monthlyPlan。每日的文法題是「每天
// 接觸一下」，個人化的部分由文法課表、週測與作業負責。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const DB = path.join(KIDS, "grammar_db");
const OUT = path.join(KIDS, "drills", "grammar_daily.js");
const BANDS = ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7"];
const START = "2026-07-12";        // 沿用原本的課程起算日，歷史頁面的進度才不會跳掉
const MIN_PER_NODE = 3;            // daily_engine 每天要抽 3 題，低於這個數就出不了題

const BAND_ICON = {
  F0: "🧱", F1: "🔤", F2: "🔁", F3: "📖", F4: "🎨", F5: "🌉", F6: "🧭", F7: "✒️",
};

function loadNodes() {
  const out = [];
  BANDS.forEach(b => {
    const d = JSON.parse(fs.readFileSync(path.join(DB, "bands", b + ".json"), "utf8"));
    (d.nodes || d).forEach(n => out.push(n));
  });
  return out;
}

// 選項順序由答案決定，不用亂數：重跑要產生一模一樣的檔案。
// （daily_engine 自己還會再依當日種子洗一次，這裡只要穩定即可。）
function order(options, answer) {
  const uniq = [];
  options.forEach(o => { if (o != null && o !== "" && !uniq.includes(o)) uniq.push(o); });
  if (!uniq.includes(answer)) return null;
  const ans = uniq.splice(uniq.indexOf(answer), 1)[0];
  let seed = 0;
  for (let i = 0; i < answer.length; i++) seed += answer.charCodeAt(i);
  uniq.splice(seed % (uniq.length + 1), 0, ans);
  return uniq;
}

// 一個節點的題目來自三種素材，湊到夠 daily_engine 每天抽 3 題還能輪替：
//   diagnostics       —— 現成的選擇題（教學頁也用這個，每天練到重複沒關係）
//   chineseTransferBugs —— 中文直翻錯誤，最貼近小孩真的會犯的錯
//   contrastPairs     —— 對錯辨識
function questionsFor(n) {
  const qs = [];

  (n.diagnostics || []).forEach(d => {
    const choices = (d.choices || []).map(c => c.text).filter(Boolean);
    const ansChoice = (d.choices || []).find(c => c.id === d.answerId);
    if (!ansChoice || choices.length < 3) return;
    const ordered = order(choices, ansChoice.text);
    if (ordered) qs.push({ q: d.promptZh || "哪一句最自然？", choices: ordered, answer: ansChoice.text });
  });

  (n.chineseTransferBugs || []).forEach(b => {
    if (!b.zh || !b.better || !b.wrong) return;
    const pool = [b.better.text, b.wrong.text];
    (n.chineseTransferBugs || []).forEach(o => {
      if (o.id !== b.id) { if (o.better) pool.push(o.better.text); if (o.wrong) pool.push(o.wrong.text); }
    });
    (n.contrastPairs || []).forEach(p => { if (p.wrong) pool.push(p.wrong.text); });
    const ordered = order(pool.slice(0, 4), b.better.text);
    if (ordered && ordered.length >= 3) {
      qs.push({ q: `「${b.zh}」的英文怎麼說？`, choices: ordered, answer: b.better.text });
    }
  });

  (n.contrastPairs || []).forEach(p => {
    if (!p.better || !p.wrong) return;
    const pool = [p.better.text, p.wrong.text];
    (n.contrastPairs || []).forEach(o => { if (o.id !== p.id && o.wrong) pool.push(o.wrong.text); });
    (n.chineseTransferBugs || []).forEach(b => { if (b.wrong) pool.push(b.wrong.text); });
    const ordered = order(pool.slice(0, 4), p.better.text);
    if (ordered && ordered.length >= 3) {
      qs.push({ q: "哪一句才對？", choices: ordered, answer: p.better.text });
    }
  });

  // 去重（同答案同題型會重複）
  const seen = new Set();
  return qs.filter(q => { const k = q.q + "|" + q.answer; if (seen.has(k)) return false; seen.add(k); return true; });
}

function main() {
  const nodes = loadNodes();
  const units = [], quiz = {};
  const thin = [];

  nodes.forEach(n => {
    const qs = questionsFor(n);
    if (qs.length < MIN_PER_NODE) { thin.push(n.id + "(" + qs.length + ")"); return; }
    units.push({ id: n.id, name: n.titleZh, icon: BAND_ICON[n.band] || "📘", minWeeks: 1 });
    quiz[n.id] = qs;
  });

  if (thin.length) {
    // 題數不足的節點直接不排進去，總比排進去讓 daily_engine 抽不到題好
    console.warn("⚠️ 題數不足 " + MIN_PER_NODE + " 未納入每日練習：", thin.join(" "));
  }

  const body =
`// 由 kids/tools/build_grammar_daily.js 產生，請勿手動編輯。
// 每日練習第 ⑧ 段的文法題庫。取代已退役的 grammar_core/quizbank.js：
// 內容改用 grammar_db 的 F0–F7 節點，介面（GC_UNITS / GC_QUIZ / gcProgress）
// 維持相容，daily_engine.js 與既有的每日練習頁不必改寫組題邏輯。
const GC_UNITS = ${JSON.stringify(units, null, 0)};
const GC_QUIZ = ${JSON.stringify(quiz, null, 0)};
const GC_START = ${JSON.stringify(START)};   // 課程起算日（週日）

// 依日期推進：每個節點一週，回傳 { current, opened:[已開放節點...] }
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
`;
  fs.writeFileSync(OUT, body, "utf8");

  const total = Object.values(quiz).reduce((s, a) => s + a.length, 0);
  console.log(JSON.stringify({
    ok: true, units: units.length, questions: total,
    avgPerUnit: +(total / units.length).toFixed(1),
    excluded: thin,
    out: path.relative(process.cwd(), OUT),
  }, null, 2));
}

main();
