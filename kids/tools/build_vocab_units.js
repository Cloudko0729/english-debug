// 從 vocab_db/foundation 產生 33 個單字單元教學頁 + 索引 + 前端要吃的 vocab_units.js。
//
// 用法: node kids/tools/build_vocab_units.js
//
// 頁面遵循 grammar_db/LESSON_PAGE_SPEC.md 的原則：
//   * 漸進式呈現，不要一次把答案全部攤開
//   * 說明用中文，例句用英文（小孩看不懂的術語一律不出現）
//   * 只用預先生成的 Kokoro 音檔，不使用瀏覽器 speechSynthesis
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const DB = path.join(KIDS, "vocab_db", "foundation");
const OUT = path.join(KIDS, "vocab_db", "units");
const LEVELS = [1, 2, 3, 4];
const QUIZ_N = 8;          // 每單元題數
const COIN_CAP = 40;

function readJson(f) { return JSON.parse(fs.readFileSync(path.join(DB, f), "utf8")); }
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}
// 放進 JS 字串字面值用的跳脫（題目資料是以 JSON 內嵌，所以主要防 </script>）
function jsonInline(v) {
  return JSON.stringify(v).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

function load() {
  const words = new Map();
  const units = [];
  LEVELS.forEach(l => {
    readJson(`words_l${l}.json`).words.forEach(w => words.set(w.word, w));
    readJson(`units_l${l}.json`).units.forEach(u => units.push(u));
  });
  const confusions = readJson("confusions_l1_l4.json").confusions;
  return { words, units, confusions };
}

// 資料庫的 word 欄位是查詢鍵，一律小寫；但這些字在英文裡有固定寫法，
// 給小孩看的地方必須正確 —— 讓小孩把「我」記成 i 比不教還糟。
// 例句本身的大小寫在資料庫裡已經是對的，只有這個欄位要補。
const DISPLAY = {
  i: "I", mr: "Mr.", mrs: "Mrs.", ms: "Ms.", ok: "OK", coke: "Coke",
  english: "English", usa: "USA", america: "America", tv: "TV",
};
function disp(word) { return DISPLAY[word] || word; }

// ── 出題 ────────────────────────────────────────────────────────────────
// 干擾項優先取同單元、同詞性的字：跨單元或跨詞性的選項太好排除，題目就白出了。
// sameZhOk=false 時排除中文義相同的字 —— 這批資料有 16 組同義字（a/an 都是「一個」、
// am/is/are 都是「是」），拿來當干擾項會出現兩個選項都對的無解題。
function distractors(target, pool, n, keyFn, sameZhOk) {
  const usable = pool.filter(w => w.word !== target.word && (sameZhOk || w.zh !== target.zh));
  const same = usable.filter(w => w.pos === target.pos);
  const rest = usable.filter(w => w.pos !== target.pos);
  const out = [];
  const push = arr => arr.forEach(w => { if (out.length < n && !out.some(x => keyFn(x) === keyFn(w))) out.push(w); });
  push(same); push(rest);
  return out;
}

function buildQuiz(unit, wordMap, levelWords) {
  const pool = unit.targetWords.map(w => wordMap.get(w)).filter(Boolean);
  const widePool = (levelWords || []).filter(w => w.level === unit.level);
  if (pool.length < 4) return [];          // 選項不足就不出題（實際上每單元 13+ 字）
  const qs = [];
  // 四種題型輪流出，確保每種都出現，也避免整份都是同一種
  const kinds = ["zh2en", "en2zh", "listen", "cloze"];
  for (let i = 0; i < Math.min(QUIZ_N, pool.length); i++) {
    const w = pool[i * 2 % pool.length] || pool[i];
    const kind = kinds[i % kinds.length];

    if (kind === "listen" && !w.pronunciationAudio) { qs.push(mk("en2zh", w, pool)); continue; }
    // 挖空題的答案由音檔決定，沒有音檔就出不了這種題
    if (kind === "cloze" && !(w.examples && w.examples[0] && w.examples[0].audio)) { qs.push(mk("zh2en", w, pool)); continue; }
    qs.push(mk(kind, w, pool));
  }
  // 去掉重複的題目（同字同題型）
  const seen = new Set();
  return qs.filter(q => { const k = q.kind + "|" + q.answer; if (seen.has(k)) return false; seen.add(k); return true; });

  function mk(kind, w, pool) {
    // 同單元的字不夠湊 4 個選項時，往同一級的其他單元借
    const wide = pool.concat(widePool.filter(x => !pool.some(y => y.word === x.word)));

    if (kind === "zh2en") {
      const ds = distractors(w, wide, 3, x => x.word, false);
      return { kind, ask: `「${w.zh}」的英文是哪一個？`, answer: disp(w.word),
        options: shuffle([disp(w.word), ...ds.map(x => disp(x.word))], disp(w.word)), audio: null };
    }
    if (kind === "en2zh") {
      const ds = distractors(w, wide, 3, x => x.zh, false);
      return { kind, ask: `<b>${disp(w.word)}</b> 是什麼意思？`, answer: w.zh,
        options: shuffle([w.zh, ...ds.map(x => x.zh)], w.zh), audio: null };
    }
    if (kind === "listen") {
      // 聽力題可以用同義字當干擾（考的是聽到哪個音，不是意思）
      const ds = distractors(w, wide, 3, x => x.word, true);
      return { kind, ask: "聽聽看，念的是哪一個字？", answer: disp(w.word),
        options: shuffle([disp(w.word), ...ds.map(x => disp(x.word))], disp(w.word)), audio: w.pronunciationAudio };
    }
    // 挖空題一律**搭配例句朗讀**，答案由聽到的內容決定。
    //
    // 原本是純文字的「哪個字放進空格才對？」，但那種題目沒辦法保證只有一個答案：
    // 干擾項取自同單元，而單元是主題式的，所以「I see a ＿＿＿.」的選項會是
    // pig / bird / cat / dog —— 四個都對。「The ＿＿＿ sleeps on a chair.」選 dog
    // 也完全正確，卻被判錯。同義字過濾擋不住這種，那四個字中文義並不相同。
    //
    // 哪些句子「夠具體到只有一個答案」無法可靠地自動判斷，所以改成由音檔決定答案：
    // 聽到什麼就只有一個對，順便多練一次聽力。926 個例句音檔都是現成的。
    const ex = w.examples[0];
    const re = new RegExp("\\b" + w.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
    const blanked = re.test(ex.text) ? ex.text.replace(re, "＿＿＿") : ex.text + "（＿＿＿）";
    const ds = distractors(w, wide, 3, x => x.word, true);
    return { kind, ask: `先聽一次，空格裡是哪個字？<br><span class="sent">${esc(blanked)}</span>`,
      answer: disp(w.word), options: shuffle([disp(w.word), ...ds.map(x => disp(x.word))], disp(w.word)),
      audio: ex.audio || null };
  }
}

// 產生時就把選項順序固定下來（不能用 Math.random，否則每次重跑 diff 都在動）。
// 依答案字串的字元碼決定正解位置，看起來夠散、又完全可重現。
function shuffle(opts, answer) {
  const uniq = [];
  opts.forEach(o => { if (o != null && !uniq.includes(o)) uniq.push(o); });
  const ans = uniq.splice(uniq.indexOf(answer), 1)[0];
  let seed = 0;
  for (let i = 0; i < answer.length; i++) seed += answer.charCodeAt(i);
  const at = seed % (uniq.length + 1);
  uniq.splice(at, 0, ans);
  return uniq;
}

// ── 頁面 ────────────────────────────────────────────────────────────────
const STYLE = `
*{box-sizing:border-box}
body{margin:0;font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif;
  background:#f6f8fa;color:#22303f;line-height:1.7;padding:0 0 70px}
header{background:linear-gradient(135deg,#e6f4ea,#f1f8ff);padding:18px 16px 14px;border-bottom:3px solid #8fd6a8}
header h1{margin:0 0 3px;font-size:1.2rem}
header p{margin:0;font-size:.79rem;color:#5a6875}
header a{color:#2f80ed;text-decoration:none}
.wrap{max-width:720px;margin:0 auto;padding:0 14px}
.stubar{display:flex;align-items:center;gap:7px;flex-wrap:wrap;background:#fff;border:1px solid #e3e8ee;
  border-radius:12px;padding:9px 12px;margin:14px 0}
/* 按鈕另外包一層：supabase_auth 登入後會把 .stu-btn 的父容器整個換成
   「目前：Name／登出」，金幣如果跟按鈕同層就會被一起清掉，
   接著 refreshCoin() 對 null 取值拋錯，整個頁面卡在「先選上面的名字」。 */
.stubar .btns{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.stubar .lab{font-size:.8rem;color:#6b7a8c}
.stu-btn{border:1px solid #cfd8e3;background:#fff;border-radius:16px;padding:5px 13px;font-size:.85rem;cursor:pointer;font-family:inherit}
.stu-btn.active{background:#2f80ed;color:#fff;border-color:#2f80ed;font-weight:700}
.coin{margin-left:auto;background:#fff6dc;border:1px solid #f2d38a;border-radius:14px;padding:4px 11px;font-size:.85rem;font-weight:700}
#coinBox.bump{animation:coinBump .6s ease}
@keyframes coinBump{0%,100%{transform:scale(1)}30%{transform:scale(1.35);background:#ffe27a}}
.card{background:#fff;border:1px solid #e3e8ee;border-radius:14px;padding:15px 16px;margin:13px 0}
.card h2{font-size:1rem;margin:0 0 4px}
.card .hint{font-size:.83rem;color:#6b7a8c;margin:0 0 11px}
/* 單字卡：先只給英文，點了才翻中文與例句 */
.wgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:9px}
.wcard{border:1px solid #dde4ec;border-radius:11px;padding:10px 11px;background:#fcfdff;cursor:pointer}
.wcard.open{background:#f2fbf5;border-color:#8fd6a8}
.wcard .en{font-size:1.02rem;font-weight:700;display:flex;align-items:center;gap:6px}
.wcard .pos{font-size:.7rem;color:#8a97a5;font-weight:400}
.wcard .back{display:none;margin-top:6px;font-size:.85rem}
.wcard.open .back{display:block}
.wcard .zh{font-weight:700;color:#1f6b45}
.wcard .col{font-size:.77rem;color:#6b7a8c;margin-top:2px}
.wcard .ex{margin-top:6px;padding-top:6px;border-top:1px dashed #dde4ec;font-size:.84rem}
.wcard .ex div{margin:3px 0}
.spk{border:0;background:#e6f0fb;border-radius:8px;padding:2px 8px;font-size:.8rem;cursor:pointer;font-family:inherit}
.spk:hover{background:#cfe2f7}
/* 對話 */
.turn{display:flex;gap:8px;align-items:flex-start;padding:6px 0;border-top:1px solid #f0f3f7;font-size:.9rem}
.turn:first-child{border-top:0}
.turn .who{font-weight:700;width:1.5em;flex-shrink:0;color:#2f80ed}
.turn .who.b{color:#b3621a}
.turn .tx{flex:1}
.psg{font-size:.93rem;margin:0 0 6px}
.zhline{font-size:.8rem;color:#8a97a5}
/* 測驗 */
.q{border-top:1px solid #eef1f5;padding:12px 0}
.q:first-of-type{border-top:0}
.q .ask{font-weight:700;font-size:.93rem;margin-bottom:7px}
.q .sent{display:block;font-weight:400;color:#3d4b5a;margin-top:3px}
.opt{display:block;width:100%;text-align:left;border:1px solid #cfd8e3;background:#fff;border-radius:10px;
  padding:9px 12px;margin:5px 0;font-size:.9rem;cursor:pointer;font-family:inherit}
.opt:hover{border-color:#2f80ed}
.opt.ok{background:#e8f7ee;border-color:#2fbf71;font-weight:700}
.opt.no{background:#fdecec;border-color:#e88}
.opt[disabled]{cursor:default}
#quizScore{font-weight:700;margin-top:9px}
.fin{width:100%;border:0;border-radius:12px;padding:13px;font-size:1rem;font-weight:700;color:#fff;
  background:#2fbf71;cursor:pointer;font-family:inherit}
.nav{display:flex;justify-content:space-between;gap:8px;margin:16px 0 0;font-size:.85rem}
.nav a{color:#2f80ed;text-decoration:none}
#toast{position:fixed;top:16px;left:50%;transform:translateX(-50%) translateY(-90px);background:#243042;color:#fff;
  padding:11px 20px;border-radius:20px;font-size:.95rem;font-weight:700;transition:transform .3s;z-index:100;
  max-width:90%;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.25)}
#toast.show{transform:translateX(-50%) translateY(0)}
`;

function renderUnit(unit, wordMap, confusions, prev, next, levelWords) {
  const words = unit.targetWords.map(w => wordMap.get(w)).filter(Boolean);
  const quiz = buildQuiz(unit, wordMap, levelWords);

  const refIds = new Set();
  words.forEach(w => (w.confusionRefs || []).forEach(id => refIds.add(id)));
  const cons = confusions.filter(c => refIds.has(c.id));

  const wcards = words.map((w, i) => `
    <div class="wcard" onclick="flip(this)">
      <div class="en">${esc(disp(w.word))} <span class="pos">${esc(w.pos || "")}</span>
        ${w.pronunciationAudio ? `<button class="spk" onclick="event.stopPropagation();play('../../${esc(w.pronunciationAudio)}')">🔊</button>` : ""}</div>
      <div class="back">
        <div class="zh">${esc(w.zh)}</div>
        ${w.collocation ? `<div class="col">常這樣用：${esc(w.collocation)}</div>` : ""}
        <div class="ex">
          ${(w.examples || []).map(e => `<div>${esc(e.text)}
            ${e.audio ? `<button class="spk" onclick="event.stopPropagation();play('../../${esc(e.audio)}')">🔊</button>` : ""}</div>`).join("")}
        </div>
      </div>
    </div>`).join("");

  const turns = unit.dialogue.turns.map(t => `
    <div class="turn"><span class="who${t.speaker === "B" ? " b" : ""}">${esc(t.speaker)}</span>
      <span class="tx">${esc(t.text)}</span>
      ${t.audio ? `<button class="spk" onclick="play('../../${esc(t.audio)}')">🔊</button>` : ""}</div>`).join("");

  const psgs = unit.passages.map(p => `
    <div style="margin:0 0 13px">
      <p class="psg">${esc(p.text)}</p>
      ${p.audio ? `<button class="spk" onclick="play('../../${esc(p.audio)}')">🔊 聽這一篇</button>` : ""}
    </div>`).join("");

  const conBlock = cons.length ? `
  <div class="card">
    <h2>④ 這幾組最容易搞混</h2>
    <p class="hint">看清楚差在哪裡，之後就不會用錯。</p>
    ${cons.map(c => `
      <div style="margin:0 0 13px;padding:11px;background:#fff9ec;border:1px solid #f3dfae;border-radius:11px">
        <b style="font-size:.93rem">${esc(c.titleZh)}</b>
        <p class="hint" style="margin:3px 0 6px">${esc(c.conceptZh)}</p>
        ${(c.examples || []).slice(0, 4).map(e => `<div style="font-size:.86rem;margin:3px 0">${esc(e.text)}
          ${e.audio ? `<button class="spk" onclick="play('../../${esc(e.audio)}')">🔊</button>` : ""}</div>`).join("")}
      </div>`).join("")}
  </div>` : "";

  const stepNo = cons.length ? "⑤" : "④";

  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(unit.titleZh)} · 單字單元 ${esc(unit.id)}</title>
<style>${STYLE}</style>
</head>
<body>
<header>
  <h1>🔤 ${esc(unit.titleZh)}</h1>
  <p>${esc(unit.id.toUpperCase())} · ${esc(unit.titleEn)} · ${words.length} 個字　·
     <a href="index.html">← 單元列表</a>　<a href="../../index.html">🏠 首頁</a></p>
</header>

<div class="wrap">
  <div class="stubar">
    <span class="btns"><span class="lab">我是：</span>
    <button class="stu-btn" onclick="pickStudent('albert')">Albert</button>
    <button class="stu-btn" onclick="pickStudent('jonathan')">Jonathan</button>
    <button class="stu-btn" onclick="pickStudent('ryder')">Ryder</button>
    <button class="stu-btn" style="opacity:.7" onclick="pickStudent('test')">🧪 測試</button></span>
    <span class="coin" id="coinBox">🪙 —</span>
  </div>

  <div id="offPlan" style="display:none;background:#fff8e1;border:2px solid #f2d38a;border-radius:12px;margin:13px 0;padding:11px 14px;font-size:.85rem;color:#8a6d1a"></div>

  <div class="card">
    <h2>① 先認識這些字</h2>
    <p class="hint">點一下卡片會翻開中文和例句。先自己猜猜看是什麼意思，再翻開對答案。</p>
    <div class="wgrid">${wcards}</div>
  </div>

  <div class="card">
    <h2>② 聽聽看什麼時候會用到</h2>
    <p class="hint">這些字在真的講話時長這樣。先整段聽一次，再一句一句聽。</p>
    ${unit.dialogue.fullAudio ? `<button class="spk" onclick="play('../../${esc(unit.dialogue.fullAudio)}')" style="margin-bottom:8px">▶️ 整段播放</button>` : ""}
    ${turns}
  </div>

  <div class="card">
    <h2>③ 讀一段短文</h2>
    <p class="hint">同樣這些字，放在一個完整的故事裡。可以邊聽邊看。</p>
    ${psgs}
  </div>
${conBlock}
  <div class="card">
    <h2>${stepNo} 小測驗</h2>
    <p class="hint">${quiz.length} 題。答對越多，金幣越多（這一單元最多 🪙 ${COIN_CAP}）。</p>
    <div id="quizBox"></div>
    <div id="quizScore"></div>
  </div>

  <div class="card" id="finishCard">
    <button class="fin" onclick="finishUnit()">我學完這一單元了 🪙</button>
    <div id="finishMsg" class="hint" style="margin:9px 0 0"></div>
  </div>

  <div id="aiBox"></div>

  <div class="nav">
    <span>${prev ? `<a href="${esc(prev.id)}.html">← ${esc(prev.titleZh)}</a>` : ""}</span>
    <span>${next ? `<a href="${esc(next.id)}.html">${esc(next.titleZh)} →</a>` : ""}</span>
  </div>
</div>

<div id="toast"></div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../../cloud_sync.js"></script>
<script src="../../account_lock.js"></script>
<script src="../../supabase_auth.js"></script>
<script src="../../ai_review.js"></script>
<script src="../../vocab_units.js"></script>
<script src="../../vocab_unit_plan.js"></script>
<script>
var UNIT_ID = ${jsonInline(unit.id)};
var QUIZ = ${jsonInline(quiz)};
var currentStudent = null, curAudio = null, done = 0, ok = 0, wrongList = [];
var UNIT_TITLE = ${jsonInline(unit.titleZh)};
var UNIT_GOAL = ${jsonInline("這個單元的字：" + words.slice(0, 6).map(w => disp(w.word)).join("、") + " 等 " + words.length + " 個")};

function getProgress(s) {
  var raw = localStorage.getItem("kidsProgress." + s);
  var p = raw ? JSON.parse(raw) : { wrongCounts:{}, sessions:0, totalCorrect:0, totalWrong:0 };
  if (!p.coins) p.coins = { balance:0, lifetimeEarned:0, lifetimeSpent:0, transactions:[], claimedDrills:{} };
  if (!p.vocab) p.vocab = { schemaVersion:1, units:{}, completedCount:0, coinsEarned:0, updatedAt:null };
  if (!p.vocab.units) p.vocab.units = {};
  return p;
}
function saveProgress(s, p) { localStorage.setItem("kidsProgress." + s, JSON.stringify(p)); }

// 只播預先生成的 Kokoro 音檔；沒有音檔就安靜跳過，不退回瀏覽器機械音。
function play(src) {
  if (curAudio) { curAudio.pause(); curAudio = null; }
  var a = new Audio(src); curAudio = a;
  a.play().catch(function () {});
}
function flip(el) { el.classList.toggle("open"); }

function refreshCoin(bump) {
  var el = document.getElementById("coinBox");
  if (!el) return;          // 登入列可能把它換掉了；少顯示金幣不該讓整頁停擺
  el.textContent = currentStudent ? "🪙 " + getProgress(currentStudent).coins.balance : "🪙 —";
  if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
}
var _tt = null;
function toast(msg) {
  var t = document.getElementById("toast");
  t.innerHTML = msg; t.classList.add("show");
  clearTimeout(_tt); _tt = setTimeout(function () { t.classList.remove("show"); }, 3200);
}

function drawQuiz() {
  var h = "";
  QUIZ.forEach(function (q, i) {
    h += '<div class="q" id="q' + i + '"><div class="ask">' + (i + 1) + ". " + q.ask +
      (q.audio ? ' <button class="spk" onclick="play(\\'../../' + q.audio + '\\')">🔊 播放</button>' : "") + '</div>';
    q.options.forEach(function (o, j) {
      h += '<button class="opt" onclick="ans(' + i + ',' + j + ')">' + o + '</button>';
    });
    h += '</div>';
  });
  document.getElementById("quizBox").innerHTML = h;
  // 聽力題一進來先自動播一次，小孩才知道要聽什麼
}
function ans(qi, oi) {
  var q = QUIZ[qi], box = document.getElementById("q" + qi);
  var btns = box.querySelectorAll(".opt");
  if (btns[0].disabled) return;
  var good = q.options[oi] === q.answer;
  for (var i = 0; i < btns.length; i++) {
    btns[i].disabled = true;
    if (q.options[i] === q.answer) btns[i].classList.add("ok");
    else if (i === oi) btns[i].classList.add("no");
  }
  done++; if (good) ok++;
  // 留下錯題內容給 AI 複習用：只記題目與選項文字，不含個人資料
  if (!good) wrongList.push({ q: q.ask.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    chose: q.options[oi], answer: q.answer });
  if (done === QUIZ.length) {
    document.getElementById("quizScore").innerHTML = "🎉 答對 " + ok + " / " + QUIZ.length +
      "　<span style='font-weight:400;color:#667085'>↓ 按下面的按鈕領金幣</span>";
    toast("✍️ 測驗完成！捲到最下面領金幣 🪙");
    if (window.AIReview) AIReview.render("aiBox", {
      subject: "單字", topic: UNIT_TITLE, goal: UNIT_GOAL,
      wrong: wrongList, correct: ok, total: QUIZ.length,
    });
  }
}

// 與文法課同一條金幣公式：底分 + 依正確率加成 + 全對再加，上限 ${COIN_CAP}。
// 重做只補差額，所以重複刷同一單元拿不到更多。
function coinsFor(correct, total) {
  var base = 15 + Math.round(15 * (total ? correct / total : 0)) + (total && correct === total ? 10 : 0);
  return Math.min(base, ${COIN_CAP});
}

function finishUnit() {
  if (!currentStudent) { toast("先選上面的名字，才知道金幣要給誰"); return; }
  if (done < QUIZ.length) { toast("小測驗還有 " + (QUIZ.length - done) + " 題沒做完"); return; }
  var p = getProgress(currentStudent);
  var isFirst = !p.vocab.units[UNIT_ID];
  var prev = p.vocab.units[UNIT_ID] || { best:0, total:QUIZ.length, coins:0, attempts:0 };
  var bestCorrect = Math.max(prev.best || 0, ok);
  var should = coinsFor(bestCorrect, QUIZ.length);
  var delta = Math.max(0, should - (prev.coins || 0));
  var now = new Date();
  var day = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");

  p.vocab.units[UNIT_ID] = { best: bestCorrect, total: QUIZ.length, coins: (prev.coins || 0) + delta,
    attempts: (prev.attempts || 0) + 1, lastAt: day };
  if (isFirst) p.vocab.completedCount = (p.vocab.completedCount || 0) + 1;
  p.vocab.coinsEarned = (p.vocab.coinsEarned || 0) + delta;
  p.vocab.updatedAt = day;
  if (delta > 0) {
    p.coins.balance += delta; p.coins.lifetimeEarned += delta;
    p.coins.transactions.push({ type:"earn", source:"vocabUnit", amount:delta,
      balanceAfter:p.coins.balance, createdAt:day, meta:{ unitId:UNIT_ID, correct:bestCorrect, total:QUIZ.length } });
  }
  saveProgress(currentStudent, p);
  if (typeof cloudSave === "function") cloudSave(currentStudent);
  refreshCoin(delta > 0);
  toast(delta > 0 ? "🪙 +" + delta + " 金幣！　共 " + p.coins.balance
                  : "這一單元已經領滿 🪙 " + p.vocab.units[UNIT_ID].coins + " 了");
  var msg = document.getElementById("finishMsg");
  msg.innerHTML = delta > 0
    ? "🎉 這一單元完成！領到 <b>🪙 +" + delta + "</b>（這一單元共 " + p.vocab.units[UNIT_ID].coins + " ／ 上限 ${COIN_CAP}）<br>" +
      "<a href='../../island.html' style='color:#2f80ed;font-weight:700'>👉 去蓋我的島嶼</a>"
    : "這一單元的金幣已經領滿了（🪙 " + p.vocab.units[UNIT_ID].coins + "）。答對更多題才會再補發喔！";
  msg.scrollIntoView({ behavior: "smooth", block: "center" });
}

// 這個單元如果不在本月課表裡，講清楚
function drawOffPlan() {
  var el = document.getElementById("offPlan");
  if (!el || !window.VocabPlan || !currentStudent) { if (el) el.style.display = "none"; return; }
  var pl = VocabPlan.activePlan(getProgress(currentStudent));
  if (!pl || (pl.units || []).indexOf(UNIT_ID) >= 0) { el.style.display = "none"; return; }
  el.style.display = "block";
  el.innerHTML = "📌 這個單元不在你這個月的課表裡。想先看完全可以，金幣一樣會給，" +
    "只是它不算進這個月的進度。<br>" +
    "<a href='../../vocab_month.html' style='color:#2f80ed;font-weight:700'>← 回本月課表</a>";
}

function pickStudent(name) {
  if (typeof requireUnlock === "function" && !requireUnlock(name)) return;
  currentStudent = name;
  localStorage.setItem("kidsCurrentStudent", name);
  var btns = document.querySelectorAll(".stu-btn");
  for (var i = 0; i < btns.length; i++)
    btns[i].classList.toggle("active", btns[i].textContent.toLowerCase().indexOf(name) >= 0);
  refreshCoin();
  drawOffPlan();
}

drawQuiz();
(function () {
  var last = localStorage.getItem("kidsCurrentStudent");
  if (!window.sbClient && last && last !== "guest") pickStudent(last); else refreshCoin();
  drawOffPlan();
})();
</script>
</body>
</html>
`;
}

function renderIndex(units) {
  const byLevel = {};
  units.forEach(u => { (byLevel[u.level] = byLevel[u.level] || []).push(u); });
  const LEVEL_NOTE = {
    1: { name: "L1 起步", scene: "最基本的字：人、東西、動作、數字" },
    2: { name: "L2 日常", scene: "把日常生活講清楚需要的字" },
    3: { name: "L3 描述", scene: "時間、地點、感受，說得更完整" },
    4: { name: "L4 進階", scene: "校園、休閒、天氣，接近六年級程度" },
  };

  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>單字單元地圖 L1–L4</title>
<style>${STYLE}
.bandcard{background:#fff;border:1px solid #e3e8ee;border-radius:14px;padding:14px 16px;margin:13px 0}
.bandcard h2{margin:0 0 2px;font-size:1.02rem}
.bandcard .sc{font-size:.8rem;color:#6b7a8c;margin-bottom:9px}
.nlist a{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:9px 0;
  border-top:1px solid #eef1f5;text-decoration:none;color:#22303f;font-size:.9rem}
.nlist a:first-child{border-top:0}
.nlist a.done{color:#1f6b45}
.nlist .sub{font-size:.75rem;color:#8a97a5;font-weight:400}
.nlist .st{font-size:.78rem;color:#8a97a5;white-space:nowrap}
.overall{background:#eef5ff;border-left:4px solid #2f80ed;border-radius:10px;margin:13px 0;padding:10px 14px;
  font-size:.88rem;font-weight:700;color:#1f4463}
.mbox{background:linear-gradient(135deg,#eef7ff,#fff);border:2px solid #9ccbf5;border-radius:13px;margin:13px 0;padding:12px 14px}
.mbox.mgo{background:linear-gradient(135deg,#fff6dc,#fff);border-color:#f2c94c}
.mbox b{font-size:.95rem}
.mbox p{margin:3px 0 8px;font-size:.83rem;color:#5a6875}
.mbox>a{display:inline-block;font-size:.85rem;color:#2f80ed;text-decoration:none;font-weight:700}
.mrow{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:9px}
.mrow a{background:#fff;border:1px solid #cfe0f0;border-radius:9px;padding:5px 10px;font-size:.82rem;color:#22303f;text-decoration:none}
/* 本月課表的單元要一眼看得出來；其餘淡化但不鎖 —— 想先看下一級可以點，
   只是不會被誤認為「這個月要做的」 */
.nlist a.thismonth{background:#f2f8ff;border-radius:9px;padding-left:9px;padding-right:9px}
.nlist a.thismonth .tag{background:#2f80ed;color:#fff;font-size:.68rem;font-weight:700;border-radius:8px;padding:1px 7px;margin-left:6px;white-space:nowrap}
.nlist a.offplan{opacity:.45}
.offnote{font-size:.78rem;color:#8a97a5;margin:10px 0 0}
</style>
</head>
<body>
<header>
  <h1>🔤 單字單元地圖</h1>
  <p>L1–L4 共 ${units.length} 單元 · ${units.reduce((s, u) => s + u.targetWords.length, 0)} 個字　·
     <a href="../../index.html">← 回首頁</a></p>
</header>

<div class="wrap">
  <div class="stubar">
    <span class="btns">
      <span class="lab">我是：</span>
      <button class="stu-btn" onclick="pickStudent('albert')">Albert</button>
      <button class="stu-btn" onclick="pickStudent('jonathan')">Jonathan</button>
      <button class="stu-btn" onclick="pickStudent('ryder')">Ryder</button>
      <button class="stu-btn" style="opacity:.7" onclick="pickStudent('test')">🧪 測試</button>
    </span>
    <span class="coin" id="coinBox">🪙 —</span>
  </div>
  <div class="overall" id="overall">先選名字，就會顯示你每個單元的進度。</div>
  <div id="monthBox"></div>
  <p class="offnote" id="offNote" style="display:none">淡掉的是這個月課表以外的單元。想先看可以點進去，只是它們不算在這個月的進度裡。</p>
${Object.keys(byLevel).sort().map(l => {
    const info = LEVEL_NOTE[l];
    return `  <div class="bandcard">
    <h2>${esc(info.name)}</h2>
    <div class="sc">${esc(info.scene)}　·　${byLevel[l].length} 單元</div>
    <div class="nlist">
${byLevel[l].map(u => `      <a href="${esc(u.id)}.html" data-unit="${esc(u.id)}"><span>${esc(u.titleZh)}<span class="sub"> ${u.targetWords.length} 字</span></span><span class="st"></span></a>`).join("\n")}
    </div>
  </div>`;
  }).join("\n")}
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../../cloud_sync.js"></script>
<script src="../../account_lock.js"></script>
<script src="../../supabase_auth.js"></script>
<script src="../../ai_review.js"></script>
<script src="../../vocab_units.js"></script>
<script src="../../vocab_unit_plan.js"></script>
<script>
var currentStudent = null;
function getProgress(s) {
  var raw = localStorage.getItem("kidsProgress." + s);
  var p = raw ? JSON.parse(raw) : { wrongCounts:{}, sessions:0, totalCorrect:0, totalWrong:0 };
  if (!p.coins) p.coins = { balance:0, lifetimeEarned:0, lifetimeSpent:0, transactions:[], claimedDrills:{} };
  if (!p.vocab) p.vocab = { schemaVersion:1, units:{}, completedCount:0, coinsEarned:0, updatedAt:null };
  if (!p.vocab.units) p.vocab.units = {};
  return p;
}

// 本月課表置頂：33 單元一次攤開太多，小孩要先知道這個月只做哪幾個。
function drawMonth(p) {
  var box = document.getElementById("monthBox"), VP = window.VocabPlan;
  if (!box || !VP) return;
  if (!p) { box.innerHTML = ""; return; }
  var s = VP.planStatus(p);
  if (!s) {
    box.innerHTML = '<div class="mbox mgo"><b>🗓️ ' + VP.monthLabel(VP.planMonthKey()) +
      '的單字還沒選</b><p>選好路線，這裡就會只顯示這個月要做的單元。</p>' +
      '<a href="../../vocab_month.html">👉 去選這個月的單字</a></div>';
    return;
  }
  var route = VP.ROUTES.filter(function (r) { return r.key === s.plan.route; })[0] || {};
  var items = s.plan.units.map(function (id) {
    var u = VP.byId(id); if (!u) return "";
    var st = VP.isSolid(p, id) ? "✅" : (VP.isTried(p, id) ? "🔁" : "▫️");
    return '<a href="' + id + '.html">' + st + " " + u.titleZh + "</a>";
  }).join("");
  box.innerHTML = '<div class="mbox"><b>' + (route.icon || "") + " " + VP.monthLabel(s.plan.month) +
    '的單字 · ' + (route.label || "") + '路線</b>' +
    '<p>學完 ' + s.done.length + " / " + s.total + " 單元（共 " + s.wordCount + " 字）" +
      (s.bonusReady ? '　🎁 <a href="../../vocab_month.html">有獎勵可以領</a>' : "") + '</p>' +
    '<div class="mrow">' + items + '</div>' +
    '<a href="../../vocab_month.html">🔄 換一條路線</a></div>';
}

function draw() {
  var links = document.querySelectorAll(".nlist a");
  if (!currentStudent) {
    for (var i = 0; i < links.length; i++) { links[i].classList.remove("done"); links[i].querySelector(".st").textContent = "›"; }
    document.getElementById("overall").textContent = "先選名字，就會顯示你每個單元的進度。";
    document.getElementById("coinBox").textContent = "🪙 —";
    drawMonth(null);
    return;
  }
  var p = getProgress(currentStudent), recs = p.vocab.units || {}, doneN = 0, coinN = 0;
  // 本月課表的單元標出來，其餘淡化 —— 33 單元全部一樣亮的話，選了課表也看不出差別
  var planIds = [];
  if (window.VocabPlan) {
    var pl = VocabPlan.activePlan(p);
    if (pl) planIds = pl.units || [];
  }
  for (var j = 0; j < links.length; j++) {
    var a = links[j], r = recs[a.dataset.unit];
    var inPlan = planIds.indexOf(a.dataset.unit) >= 0;
    a.classList.toggle("thismonth", inPlan);
    a.classList.toggle("offplan", planIds.length > 0 && !inPlan && !r);
    var tag = a.querySelector(".tag");
    if (inPlan && !tag) {
      tag = document.createElement("span");
      tag.className = "tag"; tag.textContent = "本月";
      a.querySelector("span").appendChild(tag);
    } else if (!inPlan && tag) { tag.parentNode.removeChild(tag); }
    if (r) {
      doneN++; coinN += r.coins || 0;
      a.classList.add("done");
      a.querySelector(".st").textContent = "✅ " + r.best + "/" + r.total + "　🪙" + r.coins;
    } else { a.classList.remove("done"); a.querySelector(".st").textContent = "›"; }
  }
  document.getElementById("coinBox").textContent = "🪙 " + p.coins.balance;
  document.getElementById("overall").textContent =
    "已完成 " + doneN + " / " + links.length + " 單元　·　單字課累積 🪙 " + coinN;
  var note = document.getElementById("offNote");
  if (note) note.style.display = planIds.length ? "block" : "none";
  drawMonth(p);
}
window.pickStudent = function (name) {
  if (typeof requireUnlock === "function" && !requireUnlock(name)) return;
  currentStudent = name;
  localStorage.setItem("kidsCurrentStudent", name);
  var btns = document.querySelectorAll(".stu-btn");
  for (var i = 0; i < btns.length; i++) btns[i].classList.toggle("active", btns[i].textContent.toLowerCase().indexOf(name) >= 0);
  draw();
};
(function () {
  var last = localStorage.getItem("kidsCurrentStudent");
  if (!window.sbClient && last && last !== "guest") window.pickStudent(last); else draw();
})();
</script>
</body>
</html>
`;
}

function main() {
  const { words, units, confusions } = load();
  fs.mkdirSync(OUT, { recursive: true });

  const allWords = Array.from(words.values());
  let quizTotal = 0;
  units.forEach((u, i) => {
    const q = buildQuiz(u, words, allWords);
    if (q.length < 4) throw new Error(`${u.id} 只出得出 ${q.length} 題，資料有問題`);
    quizTotal += q.length;
    fs.writeFileSync(path.join(OUT, u.id + ".html"),
      renderUnit(u, words, confusions, units[i - 1] || null, units[i + 1] || null, allWords), "utf8");
  });
  fs.writeFileSync(path.join(OUT, "index.html"), renderIndex(units), "utf8");

  // 選課頁與單元地圖都要在前端讀到單元清單，但不該各自維護一份
  const slim = units.map(u => ({
    id: u.id, level: "L" + u.level, titleZh: u.titleZh, titleEn: u.titleEn,
    wordCount: u.targetWords.length, bands: u.bands,
  }));
  fs.writeFileSync(path.join(KIDS, "vocab_units.js"),
    "// 由 kids/tools/build_vocab_units.js 產生，請勿手動編輯。\n" +
    "window.VOCAB_UNITS = " + JSON.stringify(slim, null, 0) + ";\n", "utf8");

  console.log(JSON.stringify({
    ok: true, pages: units.length, index: 1, unitsJs: slim.length,
    quizQuestions: quizTotal, avgPerUnit: +(quizTotal / units.length).toFixed(1),
    out: path.relative(process.cwd(), OUT),
  }, null, 2));
}

main();
