// 依 kids/grammar_db/LESSON_PAGE_SPEC.md 產生 48 個節點的孩子端教學頁。
// 用法：node kids/tools/build_grammar_lessons.js
//
// 規範重點（詳見 LESSON_PAGE_SPEC.md）：
//   固定五步驟：生活情境 → 一句話任務 → 2 個核心例句 → 1 組最小對照 → 3 題診斷＋1 個輸出任務
//   其餘（第 3-4 例句、第 2 組對照、form 公式、中文遷移 bug、完整 SVG）收進摺疊區
//   E0-E3 對孩子翻成白話標籤；語音一律用資料內的 Kokoro MP3 路徑
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");                 // kids/
const DB = path.join(ROOT, "grammar_db");
const OUT = path.join(DB, "lessons");
const BANDS = ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7"];

// 孩子端的等級名稱（LESSON_PAGE_SPEC 第 3 節的固定情境）
const BAND_NAME = {
  F0: { name: "句子零件島", scene: "家庭與小島物品" },
  F1: { name: "動作與問句島", scene: "學校、寵物、問答" },
  F2: { name: "日常時間島", scene: "每日作息與正在發生的事" },
  F3: { name: "過去故事島", scene: "旅行與昨天的事件" },
  F4: { name: "比較與選擇島", scene: "城市規劃、比較與規則" },
  F5: { name: "經驗與條件島", scene: "經驗、選擇與條件" },
  F6: { name: "報告與流程島", scene: "科學實驗、流程與報告" },
  F7: { name: "表達修訂島", scene: "簡報、文章修改與自然表達" },
};

// E0-E3 一律不對孩子顯示代碼（LESSON_PAGE_SPEC 第 2 節）
const SEV_LABEL = {
  E0: "🔴 意思跑掉了",
  E1: "🟠 句型少了零件",
  E2: "🟡 聽得懂但卡卡的",
  E3: "🔵 這樣說也可以",
};

// 孩子端用語（goal / formZh）獨立成資料檔，不直接用資料庫的 communicativeGoalZh 與 form —
// 那兩個欄位是寫給教學引擎的術語（例如 "subject + predicate"），孩子看不懂。
// 見 LESSON_PAGE_SPEC.md 第 1 節。
const KID = JSON.parse(fs.readFileSync(path.join(DB, "kid_wording.json"), "utf8"));
// 題幹的孩子端用語（資料庫的 promptZh 帶有「本節點」這類引擎術語）
const { kidPrompt } = require("./_kid_prompt.js");

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
// 放進 onclick='...' 的字串
function jsq(s) { return String(s == null ? "" : s).replace(/\\/g, "\\\\").replace(/'/g, "\\'"); }
// 音檔路徑：資料內是相對 kids/，頁面在 kids/grammar_db/lessons/ → 往上兩層
function au(p) { return "../../" + p; }

function loadNodes() {
  const out = [];
  BANDS.forEach(b => {
    const d = JSON.parse(fs.readFileSync(path.join(DB, "bands", b + ".json"), "utf8"));
    (Array.isArray(d) ? d : d.nodes).forEach(n => out.push(n));
  });
  return out;
}

function goalOf(n) {
  const k = KID[n.id];
  if (!k || !k.goal) throw new Error(`kid_wording.json 缺少 ${n.id} 的 goal（孩子端用語必須人工撰寫，不可回退成資料庫術語）`);
  return k.goal;
}
function formZhOf(n) {
  const k = KID[n.id];
  if (!k || !k.formZh) throw new Error(`kid_wording.json 缺少 ${n.id} 的 formZh`);
  return k.formZh;
}
// 作業說明一律中文（英文題幹孩子讀不懂），另外附英文範例答案＋範例語音。
// 注意：資料裡的 promptAudio 唸的是英文「指令」，不是示範答案，不能當示範用。
function taskOf(n, kind) {
  const k = KID[n.id];
  if (!k || !k[kind] || !k[kind].zh || !k[kind].eg) throw new Error(`kid_wording.json 缺少 ${n.id} 的 ${kind}.zh / ${kind}.eg`);
  return k[kind];
}
// 範例語音檔名（由 build_task_example_audio.js 產生）
function egAudio(n, kind) { return `../../audio/grammar_db/task_examples/${n.id.replace(/[.\-]/g, "_").toLowerCase()}_${kind}.mp3`; }

const STYLE = `
  :root{--bg:#fff7dc;--panel:#fff;--primary:#2f80ed;--soft:#dbeafe;--accent:#ffb703;--green:#2fbf71;--purple:#7c4dca;--danger:#ef476f;--text:#243042;--muted:#667085;--border:#e2e8f0;}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:Arial,"Noto Sans TC",sans-serif;background:var(--bg);color:var(--text);max-width:720px;margin:0 auto;padding-bottom:60px;line-height:1.7;}
  header{background:var(--primary);color:#fff;text-align:center;padding:18px 16px 14px;}
  header .band{display:inline-block;background:#ffe27a;color:#5a4200;font-size:.7rem;font-weight:800;border-radius:20px;padding:2px 12px;margin-bottom:6px;}
  header h1{font-size:1.3rem;} header p{font-size:.8rem;opacity:.9;margin-top:4px;}
  header a{color:#ffe27a;text-decoration:none;font-weight:700;}
  .card{background:var(--panel);border:2px solid var(--border);border-radius:16px;margin:14px;padding:16px;}
  .scene{background:#fff8ea;border:2px dashed var(--accent);border-radius:16px;margin:14px;padding:16px;}
  .scene .hd{font-weight:800;color:#8a6d1a;margin-bottom:8px;font-size:.95rem;}
  .scene .tip{font-size:.82rem;color:#8a6d1a;margin-top:8px;}
  .goal{background:#eef5ff;border-left:4px solid var(--primary);border-radius:10px;padding:12px 14px;margin:14px;font-size:1rem;font-weight:700;color:#1f4463;}
  .podcast{background:#f3edff;border:2px solid #d7c6ff;border-radius:16px;margin:14px;padding:14px 16px;display:none;}
  .podcast.show{display:block;}
  .podcast .hd{font-weight:800;color:#5a36a8;font-size:.9rem;margin-bottom:8px;}
  .podcast audio,.podcast video{width:100%;border-radius:10px;margin-top:4px;display:block;}
  .podcast .mlabel{font-size:.82rem;font-weight:700;color:#5a36a8;margin-top:8px;}
  .play{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:none;border-radius:50%;background:var(--primary);color:#fff;font-size:.85rem;cursor:pointer;vertical-align:middle;flex-shrink:0;}
  .play.big{width:auto;border-radius:8px;padding:6px 14px;font-size:.85rem;gap:6px;font-weight:700;}
  .step-no{display:inline-block;background:var(--primary);color:#fff;border-radius:8px;font-size:.75rem;font-weight:800;padding:2px 10px;margin-bottom:8px;}
  .card h2{font-size:1.05rem;color:var(--primary);margin-bottom:8px;}
  .ex-line{display:flex;align-items:center;gap:8px;margin:8px 0;font-size:1rem;flex-wrap:wrap;}
  .contrast{border:1.5px solid var(--border);border-radius:12px;padding:10px 12px;margin:8px 0;background:#fbfcff;}
  .contrast .bad{color:var(--danger);font-weight:700;font-size:.95rem;}
  .contrast .bad::before{content:"❌ ";}
  .contrast .good{color:#1a7a4d;font-weight:700;font-size:1rem;margin-top:4px;}
  .contrast .good::before{content:"✅ ";}
  .contrast .why{color:var(--muted);font-size:.82rem;margin-top:4px;}
  .dialog-line{display:flex;gap:10px;align-items:flex-start;margin:10px 0;}
  .who{font-weight:800;color:var(--primary);width:22px;flex-shrink:0;text-align:center;background:var(--soft);border-radius:50%;height:22px;line-height:22px;font-size:.8rem;}
  .who.b{color:#fff;background:var(--green);}
  .more-btn{width:100%;padding:10px;border:2px dashed var(--border);border-radius:10px;background:#fff;color:var(--muted);font-weight:700;cursor:pointer;margin-top:10px;font-size:.88rem;font-family:inherit;}
  .more-box{display:none;margin-top:10px;}
  .more-box.show{display:block;}
  .q{border-top:1px dashed #eee;padding:12px 0;}
  .q:first-of-type{border-top:none;}
  .q .qt{font-weight:700;margin-bottom:8px;font-size:.95rem;}
  .q button.opt{display:block;width:100%;text-align:left;padding:10px 13px;border:2px solid var(--border);border-radius:10px;background:#fff;font-weight:600;cursor:pointer;margin:5px 0;font-size:.9rem;font-family:inherit;}
  .q button.opt.ok{border-color:var(--green);background:#d9f6e8;}
  .q button.opt.no{border-color:var(--danger);background:#fde0e8;}
  .prod-box{background:#f0fff5;border:1.5px solid #bfe8cd;border-radius:12px;padding:14px;margin:10px 0;}
  .prod-box .prompt{font-weight:700;font-size:.98rem;margin-bottom:8px;}
  .prod-box .done-check{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:.88rem;color:#1a7a4d;font-weight:700;}
  /* 英文範例答案（不是題目指令） */
  .prod-box .eg{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:#fff;border:1.5px solid #bfe8cd;border-radius:10px;padding:8px 10px;margin-top:8px;}
  .prod-box .eg-tag{font-size:.7rem;font-weight:800;background:#2fbf71;color:#fff;border-radius:10px;padding:2px 9px;flex-shrink:0;}
  .prod-box .eg-en{font-size:.98rem;font-weight:700;color:#14324a;}
  .why-drawer{margin:14px;}
  .why-btn{width:100%;padding:12px;border:2px solid var(--purple);border-radius:12px;background:#f3edff;color:var(--purple);font-weight:800;cursor:pointer;font-size:.92rem;font-family:inherit;}
  .why-content{display:none;background:var(--panel);border:2px solid var(--border);border-top:none;border-radius:0 0 12px 12px;padding:14px;}
  .why-content.show{display:block;}
  /* 規則先給中文（孩子看的），英文原式縮小放在下面當對照 */
  .form-rule{background:#eef5ff;border-left:4px solid var(--primary);border-radius:8px;padding:10px 12px;font-size:.95rem;font-weight:700;color:#1f4463;margin-bottom:6px;}
  .form-badge{background:#f1f3f6;color:#8a93a0;border-radius:6px;padding:4px 9px;font-family:monospace;font-size:.72rem;display:inline-block;margin-bottom:12px;}
  .bug-line{background:#fff8e1;border-radius:10px;padding:8px 12px;margin:6px 0;font-size:.88rem;}
  .bug-line .tag{display:inline-block;font-size:.72rem;font-weight:800;padding:1px 8px;border-radius:10px;background:#ffe0b3;color:#8a4a12;margin-right:6px;}
  /* 手機：只給「看整張規則圖」時才橫向捲動（LESSON_PAGE_SPEC 第 4 節） */
  .diagram-wrap{overflow-x:auto;margin-top:12px;border:1px solid var(--border);border-radius:10px;background:#fffdf8;}
  .diagram-wrap img{display:block;width:760px;max-width:none;}
  @media (min-width:800px){.diagram-wrap img{width:100%;}}
  .navbtns{display:flex;gap:8px;margin:16px 14px;}
  .navbtns a{flex:1;text-align:center;padding:12px;border-radius:12px;text-decoration:none;font-weight:800;font-size:.9rem;border:2px solid var(--border);background:#fff;color:var(--text);}
  .navbtns a.home{background:var(--green);color:#fff;border-color:var(--green);}
  .navbtns a.dim{opacity:.4;pointer-events:none;}
  .stubar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;justify-content:center;background:var(--accent);padding:9px 12px;}
  .stubar .lab{font-size:.8rem;font-weight:800;color:#3a2a00;}
  .stu-btn{padding:5px 13px;border:2px solid #3a2a00;border-radius:18px;background:transparent;color:#3a2a00;font-weight:700;font-size:.82rem;cursor:pointer;font-family:inherit;}
  .stu-btn.active{background:#3a2a00;color:#fff;}
  .coin{margin-left:auto;background:#fff;border-radius:16px;padding:4px 12px;font-weight:800;color:#c98a00;font-size:.85rem;}
  .finish-btn{width:100%;padding:14px;border:none;border-radius:12px;background:var(--green);color:#fff;font-weight:800;font-size:1rem;cursor:pointer;font-family:inherit;}
  .finish-btn:disabled{opacity:.5;cursor:default;}
  /* 領金幣的浮動提示，樣式與 island.html 一致，小孩才認得 */
  #toast{position:fixed;top:16px;left:50%;transform:translateX(-50%) translateY(-90px);background:#243042;color:#fff;
    padding:11px 20px;border-radius:20px;font-size:.95rem;font-weight:700;transition:transform .3s;z-index:100;
    max-width:90%;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.25);}
  #toast.show{transform:translateX(-50%) translateY(0);}
  #coinBox.bump{animation:coinBump .6s ease;}
  @keyframes coinBump{0%,100%{transform:scale(1)}30%{transform:scale(1.35);background:#ffe27a}}
`;

function renderNode(n, prev, next) {
  const band = BAND_NAME[n.band] || { name: n.band, scene: "" };
  const goal = goalOf(n);
  const ex = n.naturalExamples, ct = n.contrastPairs, bugs = n.chineseTransferBugs;
  const speak = n.productionTasks.find(t => t.type === "speaking");
  const write = n.productionTasks.find(t => t.type === "writing");
  const turns = (n.dialogue && n.dialogue.turns) || [];
  const audioPrefix = `AU`;

  const exLine = e =>
    `<div class="ex-line"><button class="play" onclick="pa('${jsq(au(e.audio))}')">🔊</button><span>${esc(e.text)}</span></div>`;
  const ctBlock = c =>
    `<div class="contrast">
      <div class="bad">${esc(c.wrong.text)}</div>
      <div class="good"><button class="play" style="width:24px;height:24px;font-size:.7rem" onclick="pa('${jsq(au(c.better.audio))}')">🔊</button> ${esc(c.better.text)}</div>
      <div class="why">${esc(c.reasonZh)}</div>
    </div>`;

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(n.titleZh)} — ${esc(band.name)}</title>
<style>${STYLE}</style>
</head>
<body>

<header>
  <div class="band">${esc(n.band)} ${esc(band.name)}</div>
  <h1>📗 ${esc(n.titleZh)}</h1>
  <p>${esc(n.titleEn)} · <a href="index.html">← 回文法地圖</a></p>
</header>

<div class="stubar">
  <span class="lab">我是：</span>
  <button class="stu-btn" onclick="pickStudent('albert')">Albert</button>
  <button class="stu-btn" onclick="pickStudent('jonathan')">Jonathan</button>
  <button class="stu-btn" onclick="pickStudent('ryder')">Ryder</button>
  <button class="stu-btn" style="opacity:.7" onclick="pickStudent('test')">🧪 測試</button>
  <span class="coin" id="coinBox">🪙 —</span>
</div>

<div class="scene">
  <div class="hd">🏝️ 情境：先看看什麼時候會用到</div>
  ${turns.map((t, i) => `<div class="dialog-line">
    <span class="who ${t.speaker === "B" ? "b" : ""}">${esc(t.speaker)}</span>
    <button class="play" onclick="pa('${jsq(au(t.audio))}')">🔊</button>
    <div><div>${esc(t.text)}</div></div>
  </div>`).join("")}
  ${n.dialogue && n.dialogue.fullAudio ? `<button class="play big" style="margin-top:6px" onclick="pa('${jsq(au(n.dialogue.fullAudio))}')">🔊 整段對話</button>` : ""}
</div>

<div class="goal">🎯 今天你要學會：${esc(goal)}</div>

<div class="podcast" id="podcastBox">
  <div class="hd">🎧 教學 Podcast（NotebookLM 生成）</div>
  <div class="mlabel">🎬 影片</div>
  <video id="pcVideo" controls preload="metadata" playsinline></video>
  <div class="mlabel" style="margin-top:12px">🎧 Podcast</div>
  <audio id="pcAudio" controls preload="metadata"></audio>
</div>

<div class="card">
  <span class="step-no">STEP ①</span>
  <h2>核心例句</h2>
  ${ex.slice(0, 2).map(exLine).join("")}
  ${ex.length > 2 ? `<button class="more-btn" id="exBtn" onclick="tog('ex')">👀 看更多例句</button>
  <div class="more-box" id="exBox">${ex.slice(2).map(exLine).join("")}</div>` : ""}
</div>

<div class="card">
  <span class="step-no">STEP ②</span>
  <h2>比一比：哪句對？</h2>
  ${ct.slice(0, 1).map(ctBlock).join("")}
  ${ct.length > 1 ? `<button class="more-btn" id="ctBtn" onclick="tog('ct')">👀 看更多對照</button>
  <div class="more-box" id="ctBox">${ct.slice(1).map(ctBlock).join("")}</div>` : ""}
</div>

<div class="why-drawer">
  <button class="why-btn" onclick="togWhy()" id="whyBtn">🤔 為什麼？（規則＋常見錯誤）</button>
  <div class="why-content" id="whyContent">
    <div class="form-rule">📌 ${esc(formZhOf(n))}</div>
    <div class="form-badge" title="英文文法書上的寫法">${esc(n.form)}</div>
    ${bugs.map(b => `<div class="bug-line">
      <span class="tag">${esc(SEV_LABEL[b.severity] || b.severity)}</span>「${esc(b.zh)}」<br>
      <span style="color:var(--danger)">❌ ${esc(b.wrong.text)}</span> →
      <span style="color:#1a7a4d">✅ ${esc(b.better.text)}</span>
      <button class="play" style="width:22px;height:22px;font-size:.65rem;margin-left:4px" onclick="pa('${jsq(au(b.better.audio))}')">🔊</button><br>
      <span style="color:var(--muted)">${esc(b.reasonZh)}</span>
    </div>`).join("")}
    <button class="more-btn" id="dgBtn" onclick="tog('dg')">📊 看整張規則圖</button>
    <div class="more-box" id="dgBox">
      <div class="diagram-wrap"><img src="../diagrams/${esc(n.diagramRef)}.svg" alt="${esc(n.titleZh)}示意圖" loading="lazy"></div>
    </div>
  </div>
</div>

<div class="card">
  <span class="step-no">STEP ③</span>
  <h2>小測驗</h2>
  <div id="quiz"></div>
  <div id="quizScore" style="font-weight:800;margin-top:10px"></div>
</div>

<div class="card">
  <span class="step-no">STEP ④</span>
  <h2>🎤 口說作業</h2>
  <div class="prod-box">
    <div class="prompt">🗣️ ${esc(taskOf(n, "speak").zh)}</div>
    <div class="eg"><span class="eg-tag">範例</span>
      <button class="play" onclick="pa('${jsq(egAudio(n, "speak"))}')">🔊</button>
      <span class="eg-en">${esc(taskOf(n, "speak").eg)}</span>
    </div>
    <label class="done-check"><input type="checkbox"> 我說完了</label>
  </div>
</div>

<div class="card">
  <span class="step-no">STEP ⑤</span>
  <h2>✍️ 手寫作業（紙本為主）</h2>
  <div class="prod-box">
    <div class="prompt">✍️ ${esc(taskOf(n, "write").zh)}</div>
    <div class="eg"><span class="eg-tag">範例</span>
      <button class="play" onclick="pa('${jsq(egAudio(n, "write"))}')">🔊</button>
      <span class="eg-en">${esc(taskOf(n, "write").eg)}</span>
    </div>
    <p style="font-size:.85rem;color:var(--muted);margin-top:8px">紙上寫：① 照抄一次 → ② 遮住憑記憶寫一次 → ③ 自己換個內容寫一句。</p>
    <label class="done-check"><input type="checkbox"> 我寫完了</label>
  </div>
</div>

<div id="toast"></div>

<div class="card" id="finishCard">
  <h2>🎁 完成這一課</h2>
  <p style="font-size:.85rem;color:var(--muted);margin-bottom:10px">做完上面的小測驗和作業，按這裡領金幣，進度也會記錄下來。</p>
  <button id="finishBtn" class="finish-btn" onclick="finishLesson()">✅ 我學完這一課了</button>
  <div id="finishMsg" style="font-weight:800;margin-top:10px;min-height:1.4em"></div>

<div id="aiBox"></div>
</div>

<div class="navbtns">
  <a class="${prev ? "" : "dim"}" href="${prev ? esc(prev.id) + ".html" : "#"}">← 上一課</a>
  <a class="home" href="index.html">📋 文法地圖</a>
  <a class="${next ? "" : "dim"}" href="${next ? esc(next.id) + ".html" : "#"}">下一課 →</a>
</div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../../cloud_sync.js"></script>
<script src="../../account_lock.js"></script>
<script src="../../supabase_auth.js"></script>
<script src="../../ai_review.js"></script>
<script>
var cur = null;
function pa(src) { if (cur) { cur.pause(); cur = null; } var a = new Audio(src); cur = a; a.play().catch(function(){}); }
function tog(k) {
  var box = document.getElementById(k + "Box"), btn = document.getElementById(k + "Btn");
  var show = !box.classList.contains("show");
  box.classList.toggle("show", show);
  btn.textContent = show ? "🙈 收起來"
    : (k === "ex" ? "👀 看更多例句" : k === "ct" ? "👀 看更多對照" : "📊 看整張規則圖");
}
function togWhy() {
  var box = document.getElementById("whyContent");
  var show = !box.classList.contains("show");
  box.classList.toggle("show", show);
  document.getElementById("whyBtn").textContent = show ? "🙈 收起來" : "🤔 為什麼？（規則＋常見錯誤）";
}
var QUIZ = ${JSON.stringify(n.diagnostics.map(d => ({
    q: kidPrompt(d.promptZh),
    opts: d.choices.map(c => ({ t: c.text, id: c.id, audio: c.audio ? au(c.audio) : null })),
    a: d.answerId,
  })))};
var done = 0, ok = 0, wrongList = [];
var NODE_TITLE = ${JSON.stringify(n.titleZh)};
var NODE_GOAL = ${JSON.stringify((KID[n.id] && KID[n.id].goal) || n.communicativeGoalZh || "")};
document.getElementById("quiz").innerHTML = QUIZ.map(function (q, i) {
  return '<div class="q" id="dq' + i + '"><div class="qt">' + (i + 1) + '. ' + q.q + '</div>' +
    q.opts.map(function (o) {
      return '<button class="opt" onclick="ans(' + i + ',\\'' + o.id + '\\',this)">' + o.t + '</button>';
    }).join("") + '</div>';
}).join("");
function ans(i, id, btn) {
  var box = document.getElementById("dq" + i);
  if (box.dataset.done) return; box.dataset.done = "1";
  var q = QUIZ[i], good = id === q.a;
  var btns = box.querySelectorAll("button.opt");
  for (var j = 0; j < btns.length; j++) {
    btns[j].disabled = true;
    if (q.opts[j].id === q.a) btns[j].classList.add("ok");
    else if (btns[j] === btn) btns[j].classList.add("no");
  }
  done++; if (good) ok++;
  // 留下錯題內容給 AI 複習用：只記題目與選項文字，不含任何個人資料
  if (!good) {
    var chosen = null;
    for (var k = 0; k < q.opts.length; k++) if (q.opts[k].id === id) chosen = q.opts[k].t;
    var right = null;
    for (var m = 0; m < q.opts.length; m++) if (q.opts[m].id === q.a) right = q.opts[m].t;
    wrongList.push({ q: q.q, chose: chosen, answer: right });
  }
  if (done === QUIZ.length) {
    document.getElementById("quizScore").innerHTML = "🎉 答對 " + ok + " / " + QUIZ.length +
      "　<span style='font-weight:400;color:#667085'>↓ 做完下面的作業，按「我學完這一課了」領金幣</span>";
    if (typeof toast === "function") toast("✍️ 測驗完成！捲到最下面領金幣 🪙");
    if (window.AIReview) AIReview.render("aiBox", {
      subject: "文法", topic: NODE_TITLE, goal: NODE_GOAL,
      wrong: wrongList, correct: ok, total: QUIZ.length,
    });
  }
}
// ── 學生 / 進度 / 金幣 ────────────────────────────────────────────────
var NODE_ID = ${JSON.stringify(n.id)};
var currentStudent = null;
function getProgress(s) {
  var raw = localStorage.getItem("kidsProgress." + s);
  var p = raw ? JSON.parse(raw) : { wrongCounts:{}, sessions:0, totalCorrect:0, totalWrong:0 };
  if (!p.coins) p.coins = { balance:0, lifetimeEarned:0, lifetimeSpent:0, transactions:[], claimedDrills:{} };
  // 文法軌進度：只存摘要，逐題紀錄不進這裡（雲端同步有單格上限，見 REPORT 第 0 節）
  if (!p.grammar) p.grammar = { schemaVersion:1, nodes:{}, completedCount:0, coinsEarned:0, updatedAt:null };
  return p;
}
function saveProgress(s, p) { localStorage.setItem("kidsProgress." + s, JSON.stringify(p)); }
function refreshCoin(bump) {
  var el = document.getElementById("coinBox");
  el.textContent = currentStudent ? "🪙 " + getProgress(currentStudent).coins.balance : "🪙 —";
  if (bump) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
}
var _toastTimer = null;
function toast(msg) {
  var t = document.getElementById("toast");
  t.innerHTML = msg;
  t.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3200);
}
window.pickStudent = function (name) {
  if (typeof requireUnlock === "function" && !requireUnlock(name)) return;
  currentStudent = name;
  localStorage.setItem("kidsCurrentStudent", name);
  var btns = document.querySelectorAll(".stu-btn");
  for (var i = 0; i < btns.length; i++) btns[i].classList.toggle("active", btns[i].textContent.toLowerCase().indexOf(name) >= 0);
  refreshCoin(); renderFinishState();
};
function nodeRec() {
  if (!currentStudent) return null;
  return getProgress(currentStudent).grammar.nodes[NODE_ID] || null;
}
function renderFinishState() {
  var btn = document.getElementById("finishBtn"), msg = document.getElementById("finishMsg");
  if (!currentStudent) { btn.disabled = false; msg.textContent = "先在上面選你的名字，才能記錄進度和領金幣。"; return; }
  var r = nodeRec();
  if (r) {
    btn.disabled = false;
    msg.innerHTML = "✅ 這一課已完成（答對 " + r.best + "/" + r.total + "，已領 🪙 " + r.coins + "）。<br>" +
      "<span style='font-weight:400;color:#667085'>再做一次如果進步，會補發差額。</span>";
  } else { btn.disabled = false; msg.textContent = ""; }
}
// 金幣：完成 15 ＋ 表現 round(15×正確率) ＋ 全對 10，單課上限 40。
// 用「應得總額 - 已領」補差額，而不是一次領完就永久鎖住 —— 重做進步才有意義。
function coinsFor(correct, total) {
  var base = 15 + Math.round(15 * (total ? correct / total : 0)) + (total && correct === total ? 10 : 0);
  return Math.min(base, 40);
}
window.finishLesson = function () {
  if (!currentStudent) { document.getElementById("finishMsg").textContent = "先在上面選你的名字喔！"; return; }
  var p = getProgress(currentStudent);
  var isFirst = !p.grammar.nodes[NODE_ID];
  var prev = p.grammar.nodes[NODE_ID] || { best:0, total:QUIZ.length, coins:0, attempts:0 };
  var bestCorrect = Math.max(prev.best || 0, ok);
  var should = coinsFor(bestCorrect, QUIZ.length);
  var delta = Math.max(0, should - (prev.coins || 0));
  // 只存日期不存完整 ISO 時戳、band 由 node id 前綴推得即可 —— 摘要要塞進雲端單格，
  // 48 課滿載得壓在 5KB 以內（見 REPORT_2026-07-26 第 0 節）。
  var now = new Date().toISOString().slice(0, 10);
  p.grammar.nodes[NODE_ID] = {
    best: bestCorrect, total: QUIZ.length, coins: prev.coins + delta,
    attempts: (prev.attempts || 0) + 1, lastAt: now,
  };
  if (isFirst) p.grammar.completedCount = (p.grammar.completedCount || 0) + 1;
  p.grammar.coinsEarned = (p.grammar.coinsEarned || 0) + delta;
  p.grammar.updatedAt = now;
  if (delta > 0) {
    p.coins.balance += delta; p.coins.lifetimeEarned += delta;
    p.coins.transactions.push({ type:"earn", source:"grammarLesson", amount:delta,
      balanceAfter:p.coins.balance, createdAt:now, meta:{ nodeId:NODE_ID, correct:bestCorrect, total:QUIZ.length } });
  }
  saveProgress(currentStudent, p);
  if (typeof cloudSave === "function") cloudSave(currentStudent);
  refreshCoin(delta > 0);
  toast(delta > 0
    ? "🪙 +" + delta + " 金幣！　共 " + p.coins.balance
    : "這一課已經領滿 🪙 " + p.grammar.nodes[NODE_ID].coins + " 了");
  var msg = document.getElementById("finishMsg");
  msg.innerHTML = delta > 0
    ? "🎉 這一課完成！領到 <b>🪙 +" + delta + "</b>（這一課共 " + p.grammar.nodes[NODE_ID].coins + " ／ 上限 40）<br>" +
      "<a href='../../island.html' style='color:#2f80ed;font-weight:700'>👉 去蓋我的島嶼</a>"
    : "這一課的金幣已經領滿了（🪙 " + p.grammar.nodes[NODE_ID].coins + "）。答對更多題才會再補發喔！";
  msg.scrollIntoView({ behavior: "smooth", block: "center" });
};
(function initStudent() {
  var last = localStorage.getItem("kidsCurrentStudent");
  if (!window.sbClient && last && last !== "guest") window.pickStudent(last);
  else { refreshCoin(); renderFinishState(); }
})();

// NotebookLM 素材：有檔才顯示（fail-safe：載入失敗才隱藏，見 LESSON_PAGE_SPEC 第 7 節）
(function () {
  var a = document.getElementById("pcAudio"), v = document.getElementById("pcVideo"), box = document.getElementById("podcastBox");
  a.src = "podcast/${esc(n.id)}.m4a"; v.src = "podcast/${esc(n.id)}.mp4";
  var okCount = 0, errCount = 0;
  function shown() { okCount++; box.classList.add("show"); }
  function bad() { errCount++; if (errCount >= 2) box.classList.remove("show"); }
  a.addEventListener("loadedmetadata", shown); a.addEventListener("error", bad);
  v.addEventListener("loadedmetadata", shown); v.addEventListener("error", bad);
})();
</script>
</body>
</html>
`;
}

function renderIndex(nodes) {
  const byBand = {};
  nodes.forEach(n => { (byBand[n.band] = byBand[n.band] || []).push(n); });
  const bands = Object.keys(byBand).sort();
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>文法地圖 F0–F7</title>
<style>${STYLE}
  .bandcard{background:var(--panel);border:2px solid var(--border);border-radius:16px;margin:14px;padding:14px 16px;}
  .bandcard h2{font-size:1.05rem;color:var(--primary);margin-bottom:2px;}
  .bandcard .sc{font-size:.78rem;color:var(--muted);margin-bottom:10px;}
  .nlist{display:flex;flex-direction:column;gap:7px;}
  .nlist a{display:flex;justify-content:space-between;align-items:center;gap:8px;border:2px solid var(--border);border-radius:11px;padding:10px 13px;text-decoration:none;color:inherit;font-weight:700;font-size:.9rem;}
  .nlist a:hover{border-color:var(--primary);}
  .nlist a.done{border-color:var(--green);background:#f3fcf7;}
  .nlist .sub{font-weight:400;color:var(--muted);font-size:.78rem;}
  .nlist .st{font-size:.75rem;font-weight:800;white-space:nowrap;color:var(--muted);}
  .nlist a.done .st{color:var(--green);}
  .stubar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;justify-content:center;background:var(--accent);padding:9px 12px;}
  .stubar .lab{font-size:.8rem;font-weight:800;color:#3a2a00;}
  .stu-btn{padding:5px 13px;border:2px solid #3a2a00;border-radius:18px;background:transparent;color:#3a2a00;font-weight:700;font-size:.82rem;cursor:pointer;font-family:inherit;}
  .stu-btn.active{background:#3a2a00;color:#fff;}
  .coin{margin-left:auto;background:#fff;border-radius:16px;padding:4px 12px;font-weight:800;color:#c98a00;font-size:.85rem;}
  .overall{background:#eef5ff;border-left:4px solid var(--primary);border-radius:10px;margin:14px;padding:10px 14px;font-size:.9rem;font-weight:700;color:#1f4463;}
  /* 本月課表：置頂顯示，讓小孩知道 48 課裡這個月只要做哪幾課 */
  .mbox{background:linear-gradient(135deg,#eef7ff,#fff);border:2px solid #9ccbf5;border-radius:13px;margin:14px;padding:12px 14px;}
  .mbox.mgo{background:linear-gradient(135deg,#fff6dc,#fff);border-color:#f2c94c;}
  .mbox b{font-size:.95rem;}
  .mbox p{margin:3px 0 8px;font-size:.83rem;color:#5a6875;}
  .mbox>a{display:inline-block;font-size:.85rem;color:#2f80ed;text-decoration:none;font-weight:700;}
  .mrow{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:9px;}
  .mrow a{background:#fff;border:1px solid #cfe0f0;border-radius:9px;padding:5px 10px;font-size:.82rem;color:#22303f;text-decoration:none;}
  .mrow a:hover{border-color:#2f80ed;}
</style>
</head>
<body>
<header>
  <h1>🗺️ 文法地圖</h1>
  <p>F0–F7 共 ${nodes.length} 課 · <a href="../../index.html">← 回首頁</a></p>
</header>

<div class="stubar">
  <span class="lab">我是：</span>
  <button class="stu-btn" onclick="pickStudent('albert')">Albert</button>
  <button class="stu-btn" onclick="pickStudent('jonathan')">Jonathan</button>
  <button class="stu-btn" onclick="pickStudent('ryder')">Ryder</button>
  <button class="stu-btn" style="opacity:.7" onclick="pickStudent('test')">🧪 測試</button>
  <span class="coin" id="coinBox">🪙 —</span>
</div>
<div class="overall" id="overall">先選名字，就會顯示你每一課的進度。</div>
<div id="monthBox"></div>
${bands.map(b => {
    const info = BAND_NAME[b] || { name: b, scene: "" };
    return `<div class="bandcard">
  <h2>${esc(b)} ${esc(info.name)}</h2>
  <div class="sc">情境：${esc(info.scene)}　·　${byBand[b].length} 課</div>
  <div class="nlist">
    ${byBand[b].map(n => `<a href="${esc(n.id)}.html" data-node="${esc(n.id)}"><span>${esc(n.titleZh)}<span class="sub"> ${esc(n.titleEn)}</span></span><span class="st"></span></a>`).join("")}
  </div>
</div>`;
  }).join("")}

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../../cloud_sync.js"></script>
<script src="../../account_lock.js"></script>
<script src="../../supabase_auth.js"></script>
<script src="../../grammar_nodes.js"></script>
<script src="../../grammar_plan.js"></script>
<script>
var currentStudent = null;
function getProgress(s) {
  var raw = localStorage.getItem("kidsProgress." + s);
  var p = raw ? JSON.parse(raw) : { wrongCounts:{}, sessions:0, totalCorrect:0, totalWrong:0 };
  if (!p.coins) p.coins = { balance:0, lifetimeEarned:0, lifetimeSpent:0, transactions:[], claimedDrills:{} };
  if (!p.grammar) p.grammar = { schemaVersion:1, nodes:{}, completedCount:0, coinsEarned:0, updatedAt:null };
  return p;
}

// 本月課表置頂：48 課一次攤開太多，小孩需要知道「這個月只要做這幾課」。
// 其餘節點不鎖，仍可自由點進去。
function drawMonth(p) {
  var box = document.getElementById("monthBox");
  var GP = window.GrammarPlan;
  if (!box || !GP) return;
  var s = p ? GP.planStatus(p) : null;
  if (!p) { box.innerHTML = ""; return; }
  if (!s) {
    box.innerHTML = '<div class="mbox mgo"><b>🗓️ ' + GP.monthLabel(GP.planMonthKey()) +
      '的課還沒選</b><p>選好路線，這裡就會只顯示這個月要做的幾課。</p>' +
      '<a href="../../grammar_month.html">👉 去選這個月的課表</a></div>';
    return;
  }
  var route = GP.ROUTES.filter(function (r) { return r.key === s.plan.route; })[0] || {};
  var items = s.plan.nodes.map(function (id) {
    var n = GP.byId(id); if (!n) return "";
    var st = GP.isSolid(p, id) ? "✅" : (GP.isTried(p, id) ? "🔁" : "▫️");
    return '<a href="' + id + '.html">' + st + " " + n.titleZh + "</a>";
  }).join("");
  box.innerHTML = '<div class="mbox"><b>' + (route.icon || "") + " " + GP.monthLabel(s.plan.month) +
    '的課表 · ' + (route.label || "") + '路線</b>' +
    '<p>學完 ' + s.done.length + " / " + s.total + ' 課' +
      (s.bonusReady ? '　🎁 <a href="../../grammar_month.html">有獎勵可以領</a>' : "") + '</p>' +
    '<div class="mrow">' + items + '</div>' +
    '<a href="../../grammar_month.html">🔄 換一條路線</a></div>';
}

function draw() {
  var links = document.querySelectorAll(".nlist a");
  if (!currentStudent) {
    for (var i = 0; i < links.length; i++) { links[i].classList.remove("done"); links[i].querySelector(".st").textContent = "›"; }
    document.getElementById("overall").textContent = "先選名字，就會顯示你每一課的進度。";
    document.getElementById("coinBox").textContent = "🪙 —";
    drawMonth(null);
    return;
  }
  var p = getProgress(currentStudent), recs = p.grammar.nodes || {}, doneN = 0, coinN = 0;
  for (var j = 0; j < links.length; j++) {
    var a = links[j], r = recs[a.dataset.node];
    if (r) {
      doneN++; coinN += r.coins || 0;
      a.classList.add("done");
      a.querySelector(".st").textContent = "✅ " + r.best + "/" + r.total + "　🪙" + r.coins;
    } else { a.classList.remove("done"); a.querySelector(".st").textContent = "›"; }
  }
  document.getElementById("coinBox").textContent = "🪙 " + p.coins.balance;
  document.getElementById("overall").textContent =
    "已完成 " + doneN + " / " + links.length + " 課　·　文法課累積 🪙 " + coinN;
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
  const nodes = loadNodes();
  fs.mkdirSync(OUT, { recursive: true });
  nodes.forEach((n, i) => {
    const html = renderNode(n, nodes[i - 1] || null, nodes[i + 1] || null);
    fs.writeFileSync(path.join(OUT, n.id + ".html"), html, "utf8");
  });
  fs.writeFileSync(path.join(OUT, "index.html"), renderIndex(nodes), "utf8");

  // 每月分級選擇頁 / 文法地圖都需要在前端讀到節點清單，但不該各自維護一份。
  // 從 bands 直接吐出精簡版，欄位只留排課會用到的。
  const slim = nodes.map(n => ({
    id: n.id, band: n.band, titleZh: n.titleZh, titleEn: n.titleEn,
    prerequisites: n.prerequisites || [],
  }));
  fs.writeFileSync(path.join(ROOT, "grammar_nodes.js"),
    "// 由 kids/tools/build_grammar_lessons.js 產生，請勿手動編輯。\n" +
    "window.GRAMMAR_NODES = " + JSON.stringify(slim, null, 0) + ";\n", "utf8");

  console.log(JSON.stringify({ ok: true, pages: nodes.length, index: 1, nodesJs: slim.length, out: path.relative(process.cwd(), OUT) }, null, 2));
}

main();
