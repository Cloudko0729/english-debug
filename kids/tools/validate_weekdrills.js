// 檢查 kids/drills/weekdrills.js 的每週題庫：資料自洽、題量夠一週輪替、音檔齊全。
//
// 用法: node kids/tools/validate_weekdrills.js
//
// 為什麼需要：這是手寫的大量資料，最容易錯的是「看起來對、跑起來壞」的地方——
// 重組的詞塊拼回去少一個空格、填空的 display 跟 full 對不起來、選項裡沒有正解。
// 這些在檔案裡一眼看不出來，但小孩會直接卡在那一題上。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const AUDIO = path.join(KIDS, "audio", "weekdrill");

// daily_engine 每天抽的題數：填空 5、重組 4、短文 1（依 dayIdx 輪替）
const PER_DAY = { lb: 5, ro: 4, rd: 1 };
const DAYS = 5;                       // 週一～週五
const NEED = { lb: PER_DAY.lb * DAYS, ro: PER_DAY.ro * DAYS, rd: DAYS };
const Q_PER_PASSAGE = 4;

const STRICT_FROM = "2026-08";   // 五天制開始的月份；更早的週維持原本七天制的題量

let fail = 0;
const bad  = (w, msg) => { fail++; console.log(`  ✗ [${w}] ${msg}`); };
const warn = (w, msg) => console.log(`  ⚠️ [${w}] ${msg}`);

function main() {
  const src = fs.readFileSync(path.join(KIDS, "drills", "weekdrills.js"), "utf8");
  const { WEEK_DRILLS, PASSAGE_GLOSSARY } = new Function(
    src + ";return { WEEK_DRILLS, PASSAGE_GLOSSARY };")();

  const curriculum = new Function(
    fs.readFileSync(path.join(KIDS, "curriculum.js"), "utf8") + ";return CURRICULUM;")();
  const weekWords = {};   // WDID → 該週單字（小寫）
  curriculum.forEach(m => (m.weeks || []).forEach(w => {
    weekWords[m.month + "-" + w.n] = new Set((w.words || []).map(x => String(x.en).toLowerCase()));
  }));

  Object.keys(WEEK_DRILLS).sort().forEach(wid => {
    const d = WEEK_DRILLS[wid];
    const gl = PASSAGE_GLOSSARY[wid];

    // ── 題量。低於「每天要抽的數量」是真的壞（抽不到題）；只是不夠一週不重複則是品質問題。
    // 五天制是 2026-08 才開始的，七月那幾週是七天制寫的，不用回頭補到新標準。
    const strict = wid >= STRICT_FROM;
    const note = (kind, got, need, unit) => {
      if (got < PER_DAY[kind]) bad(wid, `${unit} 只有 ${got} 題，每天要抽 ${PER_DAY[kind]} 題`);
      else if (got < need) (strict ? bad : warn)(wid, `${unit} 只有 ${got} 題，5 天不重複需要 ${need}`);
    };
    note("lb", d.listenBlank.length, NEED.lb, "填空");
    note("ro", d.reorder.length, NEED.ro, "重組");
    note("rd", d.reading.length, NEED.rd, "短文");

    // ── 英聽填空：display 必須就是 full 把答案挖掉
    d.listenBlank.forEach((q, i) => {
      const at = `lb${i}`;
      if (!q.full || !q.display || !q.answer) return bad(wid, `${at} 少了 full/display/answer`);
      if (q.full.indexOf(q.answer) < 0) return bad(wid, `${at} 答案「${q.answer}」不在句子裡：${q.full}`);
      const expect = q.full.replace(q.answer, "___");
      if (expect !== q.display) bad(wid, `${at} display 對不上 full\n       應為 ${expect}\n       實為 ${q.display}`);
      if ((q.display.match(/___/g) || []).length !== 1) bad(wid, `${at} 空格不是剛好一個：${q.display}`);
    });

    // ── 句子重組：詞塊拼回去要一字不差
    d.reorder.forEach((q, i) => {
      const at = `ro${i}`;
      if (!q.sentence || !Array.isArray(q.chunks)) return bad(wid, `${at} 少了 sentence/chunks`);
      const joined = q.chunks.join(" ");
      if (joined !== q.sentence) bad(wid, `${at} 詞塊拼不回原句\n       原句 ${q.sentence}\n       拼出 ${joined}`);
      if (q.chunks.length < 3) bad(wid, `${at} 只有 ${q.chunks.length} 塊，太好猜`);
      // 詞塊全部一樣就沒得排；重複詞塊會讓「正解」不只一種排法
      const uniq = new Set(q.chunks);
      if (uniq.size !== q.chunks.length) bad(wid, `${at} 有重複詞塊，會有多種正確排法：${q.chunks.join(" / ")}`);
    });

    // ── 閱讀：正解必須在選項裡，且選項不重複
    d.reading.forEach((r, i) => {
      const at = `passage${i}`;
      if (!r.passage) return bad(wid, `${at} 沒有短文`);
      if (r.questions.length !== Q_PER_PASSAGE) bad(wid, `${at} 有 ${r.questions.length} 題，應為 ${Q_PER_PASSAGE}`);
      r.questions.forEach((q, j) => {
        if (q.choices.length < 3) bad(wid, `${at} 第 ${j + 1} 題只有 ${q.choices.length} 個選項`);
        if (q.choices.indexOf(q.answer) < 0) bad(wid, `${at} 第 ${j + 1} 題的正解不在選項裡：${q.answer}`);
        if (new Set(q.choices).size !== q.choices.length) bad(wid, `${at} 第 ${j + 1} 題有重複選項`);
      });
    });

    // ── 生字表：每篇短文一格（可以是空陣列，但不能少）
    if (!gl) bad(wid, "PASSAGE_GLOSSARY 沒有這一週");
    else if (gl.length !== d.reading.length) bad(wid, `生字表 ${gl.length} 格，短文 ${d.reading.length} 篇，對不起來`);

    // ── 音檔：缺一個那題就只剩靜音
    const dir = path.join(AUDIO, wid);
    const have = fs.existsSync(dir) ? new Set(fs.readdirSync(dir)) : new Set();
    const want = [];
    d.listenBlank.forEach((_, i) => want.push(`lb${i}.mp3`));
    d.reorder.forEach((_, i) => want.push(`ro${i}.mp3`));
    d.reading.forEach((_, i) => want.push(`passage${i}.mp3`));
    const miss = want.filter(f => !have.has(f));
    if (miss.length) bad(wid, `缺 ${miss.length} 個音檔：${miss.slice(0, 6).join(" ")}${miss.length > 6 ? " …" : ""}`);

    // ── 提醒（不算失敗）：填空答案最好是當週單字，練習才有意義
    const ws = weekWords[wid];
    if (ws && ws.size) {
      const off = d.listenBlank.filter(q => !ws.has(String(q.answer).toLowerCase()));
      if (off.length > d.listenBlank.length * 0.4) {
        console.log(`  ⚠️ [${wid}] ${off.length}/${d.listenBlank.length} 個填空答案不是當週單字`);
      }
    }

    console.log(`  · ${wid}　填空 ${d.listenBlank.length}　重組 ${d.reorder.length}　短文 ${d.reading.length}　音檔 ${want.length - miss.length}/${want.length}`);
  });

  console.log(`\n${fail === 0 ? "✅ 全部通過" : "❌ " + fail + " 個問題"}`);
  process.exit(fail ? 1 : 0);
}

main();
