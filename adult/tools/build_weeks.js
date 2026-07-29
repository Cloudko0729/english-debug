// 從 adult/course/weeks_5_8.json 產生 W5-W8 的週總覽頁與 5 個日頁。
//
// 用法: node adult/tools/build_weeks.js
//
// 做法是「以 W4 當模板做定錨替換」而不是從零拼 HTML：
// W1-W4 是手寫的，CSS 與互動邏輯（選項判定、詞塊組句、打卡、進度寫入 localStorage）
// 都已經驗證過。重新實作一份只會產生兩套會各自長歪的程式碼，所以只換內容區塊，
// 其餘原樣沿用。W1-W4 本身不動。
const fs = require("fs");
const path = require("path");
const { shuffleChoices } = require("../../tools/_shuffle.js");

const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "course");
const DATA = path.join(DIR, "weeks_5_8.json");
const TPL = 4;                                  // 模板週次

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function read(f) { return fs.readFileSync(path.join(DIR, f), "utf8"); }
function write(f, s) { fs.writeFileSync(path.join(DIR, f), s, "utf8"); }

// 把只差在週次編號的字串一次換掉（w4d1 → w5d1、w4_speech → w5_speech、audio/w4_… 等）
function renumber(s, n) {
  return s.replace(/\bw4(d[1-5]|dg[1-9]|_[a-z0-9]+)?\b/g, (m, tail) => "w" + n + (tail || ""));
}

// 用開頭與結尾定錨換掉一段區塊；找不到就丟錯，不要靜靜產出半套內容
function swap(src, startMark, endMark, body, what) {
  const a = src.indexOf(startMark);
  if (a < 0) throw new Error(`模板找不到起點：${what} / ${startMark.slice(0, 40)}`);
  const b = src.indexOf(endMark, a + startMark.length);
  if (b < 0) throw new Error(`模板找不到終點：${what} / ${endMark.slice(0, 40)}`);
  return src.slice(0, a + startMark.length) + body + src.slice(b);
}
function swapLine(src, re, body, what) {
  if (!re.test(src)) throw new Error(`模板找不到：${what}`);
  return src.replace(re, body);
}

// ── 週總覽頁 ────────────────────────────────────────────────────────────
function buildWeek(w) {
  let s = renumber(read(`w${TPL}.html`), w.n);

  s = swapLine(s, /<title>[^<]*<\/title>/,
    `<title>W${w.n} ${esc(w.title)} — 商用英語</title>`, "title");
  s = swapLine(s, /<header><h1>📅 W\d+ — [^<]*<\/h1>/,
    `<header><h1>📅 W${w.n} — ${esc(w.title)}</h1>`, "header h1");
  s = swapLine(s, /· 本週產出：[^<]*<\/p>/,
    `· 本週產出：${esc(w.produce)}</p>`, "header 產出");
  s = swapLine(s, /<div class="goal">🎯 本週結束時你要能：[^<]*<\/div>/,
    `<div class="goal">🎯 本週結束時你要能：${esc(w.goal)}</div>`, "goal");

  // 核心句
  const core = w.core.map((c, i) =>
    `  <div class="pt"><div class="en"><button class="play" onclick="new Audio('audio/w${w.n}_s${i + 1}.mp3').play()">🔊</button>${i + 1}. ${esc(c.en)}</div>` +
    `<div class="zh">${esc(c.zh)}</div><div class="note">${esc(c.note)}</div></div>`).join("\n");
  s = swap(s, `<div class="card"><h2>⭐ 本週 5 個核心句</h2>\n`, `\n</div>\n\n<div class="card"><h2>📧 Email 骨架`,
    core, "核心句");

  // Email 骨架
  const sk = w.skeleton;
  const skel = `\n    <b>① Subject</b>：${esc(sk.subject)}<br>\n` +
    `    <b>② 稱呼</b>：${esc(sk.greet)}<br>\n` +
    `    <b>③ 開場</b>：${esc(sk.open)}<br>\n` +
    `    <b>④ 正事</b>：${esc(sk.body)}<br>\n` +
    `    <b>⑤ 結尾</b>：${esc(sk.close)}\n  `;
  s = swap(s, `<div class="skeleton">`, `</div>\n</div>`, skel, "email 骨架");
  s = swapLine(s, /<h2>📧 Email 骨架（[^）]*）<\/h2>/,
    `<h2>📧 Email 骨架（${esc(w.title)}）</h2>`, "骨架標題");

  // 電話講稿
  s = swap(s, `<div class="speech">`, `</div>\n  <audio`,
    esc(w.speech).replace(/\n/g, "\n  "), "講稿");

  // Email 常見錯誤語法
  const bugs = w.bugs.map((b, i) =>
    `  <div class="bug"><div class="bad">${esc(b.bad)}</div>\n` +
    `    <span class="why">${esc(b.why)}</span>\n` +
    `    <div class="good"><button class="play" onclick="new Audio('audio/w${w.n}_gram${i + 1}.mp3').play()">🔊</button>${esc(b.good)}</div></div>`).join("\n");
  s = swap(s, `<div class="card"><h2>📧 Email 常見錯誤語法</h2>\n`, `\n</div>\n\n<div class="card"><h2>🛠️`,
    bugs, "文法錯誤");

  // 維修紀錄
  const recs = w.recs.map((r, i) =>
    `  <div class="rec"><div class="line"><b>Symptom：</b>${esc(r.s)}</div>\n` +
    `    <div class="line"><b>Action：</b>${esc(r.a)}</div>\n` +
    `    <div class="line"><b>Result：</b>${esc(r.r)}</div>\n` +
    `    <button class="play" style="margin-top:6px" onclick="new Audio('audio/w${w.n}_rec${i + 1}.mp3').play()">🔊 播放整則</button>` +
    `<div class="short"><b>精簡版：</b>${esc(r.short)}</div>` +
    `<button class="play" style="margin-top:6px" onclick="new Audio('audio/w${w.n}_recshort${i + 1}.mp3').play()">🔊 播放精簡版</button></div>`).join("\n");
  s = swap(s, `真實工程師交班常用的電報式簡寫，不用完整文法，但夠清楚。</p>\n`, `\n</div>\n\n<div class="card"><h2>🗓️`,
    recs, "維修紀錄");

  write(`w${w.n}.html`, s);
}

// ── 日頁 ────────────────────────────────────────────────────────────────
function buildD1(w) {
  let s = renumber(read(`w${TPL}d1.html`), w.n);
  s = swapLine(s, /<title>[^<]*<\/title>/, `<title>W${w.n} 週一 — 讀信＋圈句型</title>`, "d1 title");
  s = swapLine(s, /<h1>📖 W\d+ 週一 — 讀信＋圈句型<\/h1>/, `<h1>📖 W${w.n} 週一 — 讀信＋圈句型</h1>`, "d1 h1");
  s = swapLine(s, /<h2>先讀這封信（[^）]*）<\/h2>/, `<h2>先讀這封信（${esc(w.d1.mailNote)}）</h2>`, "d1 說明");

  const m = w.d1.mail;
  const body = `\n  <div class="subj">Subject: ${esc(m.subject)}</div>\n  ${esc(m.greet)}<br><br>\n` +
    m.paras.map(p => "  " + p.map(x => `<b>${esc(x)}</b>`).join("\n  ") + "<br><br>").join("\n") + "\n" +
    `  ${esc(m.close)}<br><br>\n  ${m.sign}\n`;
  s = swap(s, `<div class="mail">`, `</div>\n<p style="font-size:.84rem`, body, "d1 信件");

  s = swapLine(s, /<h2>✏️ 練習（\d+ 題）<\/h2>/, `<h2>✏️ 練習（${w.d1.quiz.length} 題）</h2>`, "d1 題數");
  s = swap(s, `const QUIZ = [\n`, `\n];`, quizJs(w.d1.quiz), "d1 題目");
  return write(`w${w.n}d1.html`, s);
}

// 選項要洗牌：內容資料裡正解一律寫在第一個（"a": 0），照原順序輸出的話
// 使用者每題點第一個就全對，測驗完全失效。
function quizJs(qs) {
  return qs.map(q => {
    const sh = shuffleChoices(q.c, q.c[q.a], q.q);
    return ` { q: ${JSON.stringify(q.q)},\n` +
      `   c: [${sh.options.map(x => JSON.stringify(x)).join(", ")}],\n` +
      `   a: ${sh.answerIndex}, why: ${JSON.stringify(q.why)} },`;
  }).join("\n").replace(/,$/, "");
}

function buildD2(w) {
  let s = renumber(read(`w${TPL}d2.html`), w.n);
  s = swapLine(s, /<title>[^<]*<\/title>/, `<title>W${w.n} 週二 — 核心句練習</title>`, "d2 title");
  s = swapLine(s, /<h1>[^<]*週二[^<]*<\/h1>/, `<h1>✏️ W${w.n} 週二 — 核心句練習</h1>`, "d2 h1");
  s = swap(s, `const QUIZ = [\n`, `\n];`, quizJs(w.d2.quiz), "d2 題目");
  return write(`w${w.n}d2.html`, s);
}

function buildD3(w) {
  let s = renumber(read(`w${TPL}d3.html`), w.n);
  s = swapLine(s, /<title>[^<]*<\/title>/, `<title>W${w.n} 週三 — 組一封完整回信</title>`, "d3 title");
  s = swapLine(s, /<h1>📧 W\d+ 週三 — 組一封完整回信<\/h1>/, `<h1>📧 W${w.n} 週三 — 組一封完整回信</h1>`, "d3 h1");
  s = swap(s, `<div class="brief">📩 <b>情境</b>：`, `</div>`, esc(w.d3.brief), "d3 情境");
  const lines = w.d3.lines.map(L =>
    `  { zh: ${JSON.stringify(L.zh)}, chunks: [${L.chunks.map(c => JSON.stringify(c)).join(", ")}] },`).join("\n");
  s = swap(s, `const LINES = [\n`, `\n];`, lines.replace(/,$/, ""), "d3 句子");
  return write(`w${w.n}d3.html`, s);
}

function buildD4(w) {
  let s = renumber(read(`w${TPL}d4.html`), w.n);
  const short = w.title.length > 8 ? w.title.slice(0, 8) : w.title;
  s = swapLine(s, /<title>[^<]*<\/title>/, `<title>W${w.n} 週四 — Shadowing ${esc(short)}</title>`, "d4 title");
  s = swapLine(s, /<h1>🎙️ W\d+ 週四 — Shadowing [^<]*<\/h1>/,
    `<h1>🎙️ W${w.n} 週四 — Shadowing ${esc(short)}</h1>`, "d4 h1");
  s = swapLine(s, /目標：[^<]*<\/p>/, `目標：不看稿講出一段${esc(w.title)}說明</p>`, "d4 目標");
  s = swap(s, `<div class="speech">`, `</div>\n<audio`, esc(w.speech), "d4 講稿");
  return write(`w${w.n}d4.html`, s);
}

function buildD5(w) {
  let s = renumber(read(`w${TPL}d5.html`), w.n);
  s = swapLine(s, /<title>[^<]*<\/title>/, `<title>W${w.n} 週五 — 情境應答＋回收</title>`, "d5 title");
  s = swapLine(s, /<h1>💬 W\d+ 週五 — 情境應答<\/h1>/, `<h1>💬 W${w.n} 週五 — 情境應答</h1>`, "d5 h1");
  const qs = w.d5.qs.map((q, i) => {
    const sh = shuffleChoices(q.choices, q.choices[q.a], q.cue);
    return ` { id: "w${w.n}dg${i + 1}", cue: ${JSON.stringify(q.cue)}, cueZh: ${JSON.stringify(q.cueZh)},\n` +
      `   choices: [${sh.options.map(c => JSON.stringify(c)).join(", ")}],\n` +
      `   a: ${sh.answerIndex}, why: ${JSON.stringify(q.why)}, swap: ${JSON.stringify(q.swap)} },`;
  }).join("\n");
  s = swap(s, `const QS = [\n`, `\n];`, qs.replace(/,$/, ""), "d5 題目");
  return write(`w${w.n}d5.html`, s);
}

// ── 音檔 spec ───────────────────────────────────────────────────────────
function audioSpec(weeks) {
  const items = {};
  weeks.forEach(w => {
    w.core.forEach((c, i) => { items[`w${w.n}_s${i + 1}`] = c.en; });
    items[`w${w.n}_speech`] = w.speech.replace(/\n/g, " ");
    w.bugs.forEach((b, i) => { items[`w${w.n}_gram${i + 1}`] = b.good; });
    w.recs.forEach((r, i) => {
      items[`w${w.n}_rec${i + 1}`] = [r.s, r.a, r.r].join(" ");
      items[`w${w.n}_recshort${i + 1}`] = r.short;
    });
    // 週五情境題的客戶提問語音（頁面用 id 當檔名）
    w.d5.qs.forEach((q, i) => { items[`w${w.n}dg${i + 1}`] = q.cue; });
  });
  return { outdir: "D:/english/adult/course/audio", voice: "af_heart", speed: 0.92, items };
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA, "utf8"));
  const made = [];
  data.weeks.forEach(w => {
    buildWeek(w); buildD1(w); buildD2(w); buildD3(w); buildD4(w); buildD5(w);
    made.push(`w${w.n}`);
  });
  const spec = audioSpec(data.weeks);
  fs.writeFileSync(path.join(__dirname, "audio_w5_w8.json"), JSON.stringify(spec, null, 2), "utf8");

  console.log(JSON.stringify({
    ok: true, weeks: made, pages: made.length * 6,
    audioItems: Object.keys(spec.items).length,
    spec: path.relative(process.cwd(), path.join(__dirname, "audio_w5_w8.json")),
  }, null, 2));
}

main();
