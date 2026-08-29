// 從課本資料產生每日練習第 ⑨ 段的題庫 kids/drills/school_daily.js。
//
// 用法: node kids/tools/build_school_drill.js
//
// 題型只做四種，都是期中考真的會考的：
//   vocab     單字中英對應（看中文選英文）
//   pattern   句型問答配對（給問句選答句）
//   phonics   同組字音辨別（哪一個是 er 的音）
//   sentence  課文句子填空（挖掉關鍵字）
// 不做「翻譯整句」那種——那是作文，不是這次考試的題型。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const { TEXTBOOK_G6A: T } = require(path.join(KIDS, "school_db", "textbook_g6a.js"));
const OUT = path.join(KIDS, "drills", "school_daily.js");

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

// 音檔 key：跟檔名一致，全部小寫、非英數換底線
const akey = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

function unitQuestions(u, allVocab) {
  const qs = [];
  const pool = allVocab.filter(v => !u.vocab.some(x => x.en === v.en));
  const patterns = u.patterns || [];
  const phonics = u.phonics || { groups: [], words: [] };

  // ① 單字：看中文選英文
  u.vocab.forEach(v => {
    const distract = pool.filter(x => x.zh !== v.zh).slice(0, 30);
    const picked = [];
    for (const d of distract) { if (picked.length >= 3) break; if (!picked.includes(d.en)) picked.push(d.en); }
    const ch = order([v.en, ...picked], v.en);
    if (ch && ch.length >= 3) qs.push({ kind: "vocab", q: `「${v.zh}」的英文是？`, choices: ch, answer: v.en, audio: akey(v.en) });
  });

  // ② 句型：給問句選答句。干擾項用同課的其他答句與別課的答句，才考得出「聽懂問句」
  patterns.forEach((p, i) => {
    const others = T.units.flatMap(x => x.patterns).concat(T.culture.patterns || [])
      .filter(x => x.a !== p.a).map(x => x.a);
    // 答句可能有 " / " 分隔的兩種回答，取第一種當正解
    const ans = p.a.split(" / ")[0].trim();
    const ch = order([ans, ...others.map(o => o.split(" / ")[0].trim())].slice(0, 4), ans);
    if (ch && ch.length >= 3) qs.push({ kind: "pattern", q: p.q, choices: ch, answer: ans, audio: akey(u.id + "_pat" + i) });
  });

  // ③ phonics：哪一個字是這一組的音
  (phonics.groups || []).forEach(g => {
    const mine = (phonics.words || []).filter(w => w.g === g).map(w => w.w);
    if (!mine.length) return;
    const others = T.units.flatMap(x => (x.phonics.words || []))
      .filter(w => w.g !== g).map(w => w.w);
    mine.forEach(w => {
      const ch = order([w, ...others.slice(0, 3)], w);
      if (ch && ch.length >= 3) qs.push({ kind: "phonics", q: `哪一個字有 ${g} 的音？`, choices: ch, answer: w, audio: akey(w) });
    });
  });

  // ④ 課文句子填空：挖掉本課單字
  (u.story || []).forEach((s, i) => {
    const hit = u.vocab.find(v => new RegExp("\\b" + v.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(s));
    if (!hit) return;
    const display = s.replace(new RegExp(hit.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "＿＿＿");
    const others = u.vocab.filter(v => v.en !== hit.en).map(v => v.en);
    const ch = order([hit.en, ...others.slice(0, 3)], hit.en);
    if (ch && ch.length >= 3) {
      qs.push({ kind: "sentence", q: display, choices: ch, answer: hit.en, audio: akey(u.id + "_st" + i), full: s });
    }
  });

  return qs;
}

function main() {
  const allVocab = T.units.flatMap(u => u.vocab).concat(T.culture.vocab);
  const bank = {};

  T.units.forEach(u => { bank[u.id] = unitQuestions(u, allVocab); });

  // 暖身：複習頁的字彙分類題
  const wq = [];
  Object.entries(T.warmup.vocab).forEach(([cat, words]) => {
    const others = Object.entries(T.warmup.vocab).filter(([c]) => c !== cat).flatMap(([, w]) => w);
    words.forEach(w => {
      const ch = order([w, ...others.slice(0, 3)], w);
      if (ch && ch.length >= 3) wq.push({ kind: "vocab", q: `哪一個是 ${cat}（${{Places:"地點",Transportation:"交通工具",Clothes:"衣物",Objects:"物品"}[cat]}）？`, choices: ch, answer: w, audio: akey(w) });
    });
  });
  T.warmup.phonics.forEach(p => {
    const others = T.warmup.phonics.filter(x => x.group !== p.group).flatMap(x => x.words);
    p.words.forEach(w => {
      const ch = order([w, ...others.slice(0, 3)], w);
      if (ch && ch.length >= 3) wq.push({ kind: "phonics", q: `哪一個字是 ${p.group} 開頭？`, choices: ch, answer: w, audio: akey(w) });
    });
  });
  bank.warmup = wq;

  // Review 1：短文理解（國家＋症狀＋處置）
  const r1 = [];
  T.reviews[0].passages.forEach((p, i) => {
    const countries = T.reviews[0].passages.map(x => x.country);
    const cch = order([p.country, ...countries.filter(c => c !== p.country), "the UK"].slice(0, 4), p.country);
    if (cch) r1.push({ kind: "reading", passage: p.text, q: `Where is ${p.name} from?`, choices: cch, answer: p.country, audio: akey("r1_p" + i) });
    const allSym = T.reviews[0].passages.flatMap(x => x.symptoms);
    const s0 = p.symptoms[0];
    const sch = order([s0, ...allSym.filter(s => !p.symptoms.includes(s))].slice(0, 4), s0);
    if (sch && sch.length >= 3) r1.push({ kind: "reading", passage: p.text, q: `What's wrong with ${p.name}?`, choices: sch, answer: s0, audio: akey("r1_p" + i) });
  });
  // phonics 混合辨音（Four in a Row）
  const GRID_GROUP = w => (/ir/.test(w) ? "ir" : /ur/.test(w) ? "ur" : /er/.test(w) ? "er" : /ar/.test(w) ? "ar" : /or/.test(w) ? "or" : null);
  const byGroup = {};
  T.reviews[0].phonicsGrid.forEach(w => { const g = GRID_GROUP(w); if (g) (byGroup[g] = byGroup[g] || []).push(w); });
  Object.entries(byGroup).forEach(([g, ws]) => {
    const others = Object.entries(byGroup).filter(([x]) => x !== g).flatMap(([, w]) => w);
    ws.slice(0, 5).forEach(w => {
      const ch = order([w, ...others.slice(0, 3)], w);
      if (ch && ch.length >= 3) r1.push({ kind: "phonics", q: `哪一個字有 ${g} 的音？`, choices: ch, answer: w, audio: akey(w) });
    });
  });
  bank.r1 = r1;
  bank.r2 = [];

  // 中秋節：跟各單元用同一支產生器（它現在也有 patterns 與 story），
  // 再加上課本 p.85「圈出不屬於中秋的東西」那個活動改成的辨識題。
  const moon = unitQuestions(T.culture, allVocab);
  const act = T.culture.activity;
  if (act) {
    act.belong.forEach(x => {
      const ch = order([x, ...act.notBelong.slice(0, 3)], x);
      if (ch && ch.length >= 3)
        moon.push({ kind: "vocab", q: "哪一個是中秋節會出現的？", choices: ch, answer: x, audio: akey(x) });
    });
    act.notBelong.slice(0, 4).forEach(x => {
      const ch = order([x, ...act.belong.slice(0, 3)], x);
      if (ch && ch.length >= 3)
        moon.push({ kind: "vocab", q: "哪一個「不是」中秋節的東西？", choices: ch, answer: x, audio: akey(x) });
    });
  }
  const tips = T.culture.tips;
  if (tips) {
    // 挑柚子：放一兩週之後會變成什麼樣子
    const ch = order([tips.after[0], ...tips.before, "sweet"], tips.after[0]);
    if (ch && ch.length >= 3)
      moon.push({ kind: "vocab", q: "柚子放一到兩週後會變成什麼顏色？", choices: ch, answer: tips.after[0], audio: akey(tips.after[0]) });
  }
  bank.moon = moon;

  const total = Object.values(bank).reduce((s, a) => s + a.length, 0);
  const thin = Object.entries(bank).filter(([, a]) => a.length < 3).map(([k, a]) => k + "(" + a.length + ")");

  const body =
`// 由 kids/tools/build_school_drill.js 產生，請勿手動編輯。
// 每日練習第 ⑨ 段「學校課本」的題庫。資料來源 kids/school_db/textbook_g6a.js。
const SCHOOL_BANK = ${JSON.stringify(bank)};
if (typeof window !== "undefined") window.SCHOOL_BANK = SCHOOL_BANK;
if (typeof module !== "undefined" && module.exports) module.exports = { SCHOOL_BANK };
`;
  fs.writeFileSync(OUT, body, "utf8");

  console.log(JSON.stringify({
    ok: true, total,
    perUnit: Object.fromEntries(Object.entries(bank).map(([k, a]) => [k, a.length])),
    thin: thin.length ? thin : "無",
    out: path.relative(process.cwd(), OUT),
  }, null, 2));
}

main();
