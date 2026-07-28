// 產生每週綜合測驗的題庫 kids/weekly_bank.js。
//
// 用法: node kids/tools/build_weekly_bank.js
//
// 週測的職責是「抓遺忘」，不是「抓學過沒」：教學頁的小測驗證明當下學會了，
// 週測要驗一週後還記不記得。所以題目來源刻意跟教學頁錯開，同一批題目重考
// 只是在測背答案，測不出保留率。
//
//   文法：教學頁用 node.diagnostics；週測改用 chineseTransferBugs 與 contrastPairs
//         （前者是中文母語者真的會犯的錯，價值最高）。
//   單字：單元頁的克漏字用 examples[0]；週測用 examples[1]，另外加聽音辨字。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const GDB = path.join(KIDS, "grammar_db", "bands");
const VDB = path.join(KIDS, "vocab_db", "foundation");
const BANDS = ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7"];
const LEVELS = [1, 2, 3, 4];

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// 選項順序由答案字串決定，不用亂數 —— 重跑要產生一模一樣的檔案，否則每次都有假 diff。
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

// ── 文法 ────────────────────────────────────────────────────────────────
function grammarQuestions(n) {
  const qs = [];
  const bugs = n.chineseTransferBugs || [];
  const pairs = n.contrastPairs || [];

  // 中文直翻題：給中文，從「這一節點的正確句與錯誤句」裡選出正確翻譯。
  // 其他 bug 的 better 句也是正確英文，但不是這句中文的翻譯 —— 拿來當干擾項剛好。
  bugs.forEach(b => {
    if (!b.zh || !b.better || !b.wrong) return;
    const pool = [b.better.text, b.wrong.text];
    bugs.forEach(o => { if (o.id !== b.id) { if (o.better) pool.push(o.better.text); if (o.wrong) pool.push(o.wrong.text); } });
    pairs.forEach(p => { if (p.wrong) pool.push(p.wrong.text); });
    const options = order(pool.slice(0, 4), b.better.text);
    if (!options || options.length < 3) return;
    qs.push({
      kind: "transfer", ask: `「${b.zh}」的英文怎麼說？`,
      options, answer: b.better.text,
      why: b.reasonZh || "", severity: b.severity || null,
      audio: b.better.audio || null,
    });
  });

  // 對錯辨識題：所有干擾項都是真的錯句，不會出現「兩個都對」
  pairs.forEach(p => {
    if (!p.better || !p.wrong) return;
    const pool = [p.better.text, p.wrong.text];
    pairs.forEach(o => { if (o.id !== p.id && o.wrong) pool.push(o.wrong.text); });
    bugs.forEach(b => { if (b.wrong) pool.push(b.wrong.text); });
    const options = order(pool.slice(0, 4), p.better.text);
    if (!options || options.length < 3) return;
    qs.push({
      kind: "contrast", ask: "哪一句才對？",
      options, answer: p.better.text,
      why: p.reasonZh || "", severity: null,
      audio: p.better.audio || null,
    });
  });

  return qs;
}

// ── 單字 ────────────────────────────────────────────────────────────────
// 與 build_vocab_units.js 相同的顯示對照：word 欄位是小寫查詢鍵，
// 給小孩看的地方必須是正確英文寫法。
const DISPLAY = {
  i: "I", mr: "Mr.", mrs: "Mrs.", ms: "Ms.", ok: "OK", coke: "Coke",
  english: "English", usa: "USA", america: "America", tv: "TV",
};
const disp = w => DISPLAY[w] || w;

function vocabQuestions(unit, wordMap) {
  const pool = unit.targetWords.map(w => wordMap.get(w)).filter(Boolean);
  const qs = [];

  pool.forEach((w, i) => {
    // 中文義相同的字不能當干擾項（a/an 都是「一個」、dad/daddy 都是「爸爸」），
    // 否則會出現兩個選項都對的無解題。
    const others = pool.filter(x => x.word !== w.word && x.zh !== w.zh);
    if (others.length < 3) return;
    const ds = others.slice(0, 3).map(x => disp(x.word));

    // 挖空題用第二個例句（單元頁用第一個），且一律搭配朗讀。
    //
    // 純文字的「哪個字放進空格才對？」保證不了唯一答案：干擾項來自同一單元，
    // 而單元是主題式的，所以「I see a ＿＿＿.」的選項會是 pig / bird / cat / dog，
    // 四個都填得進去。改由音檔決定答案，聽到什麼就只有一個對。
    const ex = (w.examples || [])[1];
    if (ex && ex.audio && i % 2 === 0) {
      const re = new RegExp("\\b" + w.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
      if (re.test(ex.text)) {
        const options = order([disp(w.word), ...ds], disp(w.word));
        if (options && options.length === 4) {
          qs.push({
            kind: "cloze", ask: `先聽一次，空格裡是哪個字？<br><span class="sent">${esc(ex.text.replace(re, "＿＿＿"))}</span>`,
            options, answer: disp(w.word), why: "", audio: ex.audio,
          });
        }
      }
    }
    // 聽音辨字：每次聽到的都不一樣，天生就跟教學頁不重複
    if (w.pronunciationAudio && i % 2 === 1) {
      const sameZhOk = pool.filter(x => x.word !== w.word).slice(0, 3).map(x => disp(x.word));
      const options = order([disp(w.word), ...sameZhOk], disp(w.word));
      if (options && options.length === 4) {
        qs.push({
          kind: "listen", ask: "聽聽看，念的是哪一個字？",
          options, answer: disp(w.word), why: "", audio: w.pronunciationAudio,
        });
      }
    }
  });

  return qs;
}

function main() {
  const grammar = {};
  let gTotal = 0, gThin = [];
  BANDS.forEach(b => {
    const d = JSON.parse(fs.readFileSync(path.join(GDB, b + ".json"), "utf8"));
    (d.nodes || d).forEach(n => {
      const qs = grammarQuestions(n);
      grammar[n.id] = qs;
      gTotal += qs.length;
      if (qs.length < 2) gThin.push(n.id + "(" + qs.length + ")");
    });
  });

  const words = new Map();
  const vocab = {};
  let vTotal = 0, vThin = [];
  LEVELS.forEach(l => {
    JSON.parse(fs.readFileSync(path.join(VDB, `words_l${l}.json`), "utf8")).words.forEach(w => words.set(w.word, w));
  });
  LEVELS.forEach(l => {
    JSON.parse(fs.readFileSync(path.join(VDB, `units_l${l}.json`), "utf8")).units.forEach(u => {
      const qs = vocabQuestions(u, words);
      vocab[u.id] = qs;
      vTotal += qs.length;
      if (qs.length < 2) vThin.push(u.id + "(" + qs.length + ")");
    });
  });

  // 題目太少的節點/單元會讓週測抽不出題，寧可產生時就吵出來
  if (gThin.length || vThin.length) {
    console.warn("⚠️ 可出題數不足 2 的項目：", [...gThin, ...vThin].join(" "));
  }

  fs.writeFileSync(path.join(KIDS, "weekly_bank.js"),
    "// 由 kids/tools/build_weekly_bank.js 產生，請勿手動編輯。\n" +
    "window.WEEKLY_BANK = " + JSON.stringify({ grammar, vocab }, null, 0) + ";\n", "utf8");

  console.log(JSON.stringify({
    ok: true,
    grammarNodes: Object.keys(grammar).length, grammarQuestions: gTotal,
    vocabUnits: Object.keys(vocab).length, vocabQuestions: vTotal,
    thin: [...gThin, ...vThin],
  }, null, 2));
}

main();
