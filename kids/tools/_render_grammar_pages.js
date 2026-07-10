// 產生文法根基課程單元頁（16 頁）＋ 課程首頁 hub
const fs = require("fs"), path = require("path");
const { GRAMMAR_CORE } = require("../grammar_core/plan.js");
const { DIAGRAMS } = require("./_gram_diagrams.js");
const OUT = path.join(__dirname, "..", "grammar_core");

const units = {};
for (let b = 1; b <= 4; b++)
  Object.assign(units, JSON.parse(fs.readFileSync(path.join(__dirname, `_gram_batch${b}.json`), "utf8")).units);

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const STAMP = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);

for (let i = 0; i < GRAMMAR_CORE.length; i++) {
  const u = GRAMMAR_CORE[i], c = units[u.id];
  const prev = GRAMMAR_CORE[i - 1], next = GRAMMAR_CORE[i + 1];
  const page = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${u.icon} ${esc(u.name)} — 文法根基</title><style>
body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;max-width:720px;margin:0 auto;padding:0 14px 60px;line-height:1.7}
header{background:#2f80ed;color:#fff;text-align:center;padding:16px;border-radius:0 0 14px 14px;margin:0 -14px 12px}
header h1{margin:0;font-size:1.15rem} header p{margin:5px 0 0;font-size:.78rem;opacity:.92}
header a{color:#ffe27a;text-decoration:none;font-weight:700}
.card{background:#fff;border-radius:14px;padding:14px 16px;margin-top:14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.card h2{font-size:1rem;color:#1e5fb8;margin:0 0 8px}
.concept{font-size:.92rem;background:#eef5ff;border-radius:10px;padding:10px 14px;font-weight:700;color:#1e5fb8}
svg{width:100%;height:auto}
audio{width:100%;margin-top:6px}
.pod-missing{color:#999;font-size:.85rem;text-align:center;padding:10px}
details{font-size:.88rem} summary{cursor:pointer;font-weight:700;color:#187a48;padding:4px 0}
.script p{margin:7px 0;font-size:.9rem}
.script .en{background:#eaf3ff;border-left:4px solid #2f80ed;padding:5px 11px;border-radius:0 8px 8px 0;font-weight:700;color:#1e5fb8}
.ex{border-top:1px dashed #eee;padding:8px 0;font-size:.92rem}
.ex button{border:none;border-radius:8px;background:#2f80ed;color:#fff;font-weight:700;padding:5px 11px;cursor:pointer;margin-right:8px}
.ex small{color:#888;display:block;margin-top:2px}
.q{border-top:1px dashed #eee;padding:10px 0}
.q .qt{font-weight:700;margin-bottom:6px;font-size:.92rem}
.q button{padding:8px 14px;border:2px solid #d9e2ec;border-radius:10px;background:#fff;font-weight:700;cursor:pointer;margin:3px 4px 3px 0;font-size:.88rem}
#result{font-weight:800;font-size:1rem;margin-top:10px;min-height:1.4em}
.nav2{display:flex;justify-content:space-between;margin-top:16px;font-size:.85rem}
.nav2 a{color:#1e5fb8;text-decoration:none;font-weight:700;background:#fff;border-radius:10px;padding:9px 14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
#studentBar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-weight:700;font-size:.85rem;margin-top:10px}
.stu-btn{padding:6px 14px;border:2px solid #2f80ed;border-radius:16px;background:#fff;color:#2f80ed;font-weight:700;cursor:pointer}
.stu-btn.active{background:#2f80ed;color:#fff}
#toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:#243042;color:#fff;border-radius:12px;padding:10px 18px;font-weight:700;display:none;z-index:60}
</style></head><body>
<header><h1>${u.icon} ${esc(u.name)} <span style="font-size:.75rem;opacity:.85">${esc(u.eng)}</span></h1>
<p><a href="index.html">← 課程目錄</a> · 建議 ${u.weeks} 週 · 學穩再前進</p></header>
<div id="studentBar">我是：
 <button class="stu-btn" onclick="pick('albert')">Albert</button>
 <button class="stu-btn" onclick="pick('jonathan')">Jonathan</button>
 <button class="stu-btn" onclick="pick('ryder')">Ryder</button>
 <button class="stu-btn" style="opacity:.7" onclick="pick('test')">🧪 測試</button>
</div>
<div class="card"><div class="concept">💡 ${esc(u.concept)}</div></div>
<div class="card"><h2>🗺️ 概念圖</h2>${DIAGRAMS[u.id] || ""}</div>
<div class="card"><h2>🎧 聽講解（${esc(u.podcastKey)}）</h2>
<audio controls preload="none" src="audio/${u.id}.mp3" onerror="this.outerHTML='<div class=pod-missing>🎙️ 語音準備中，先看下面的講稿吧</div>'"></audio>
<details><summary>📄 看講稿</summary><div class="script">${c.podcast.map(s => s.v === "en" ? `<p class="en">${esc(s.t)}</p>` : `<p>${esc(s.t)}</p>`).join("")}</div></details></div>
<div class="card"><h2>📚 例句集</h2>${c.examples.map((e, j) =>
  `<div class="ex"><button onclick="playEx(${j})">🔊</button><b>${esc(e.en)}</b><small>${esc(e.zh)}</small></div>`).join("")}</div>
<div class="card"><h2>📝 小測驗（完成領金幣，每人一次）</h2><div id="quiz"></div><div id="result"></div></div>
<div class="nav2">
  <span>${prev ? `<a href="${prev.id}.html">← ${prev.icon} ${esc(prev.name)}</a>` : ""}</span>
  <span>${next ? `<a href="${next.id}.html">${next.icon} ${esc(next.name)} →</a>` : ""}</span>
</div>
<div id="toast"></div>
<script>
const UID=${JSON.stringify(u.id)}, QUIZ=${JSON.stringify(c.quiz)};
let stu=localStorage.getItem("kidsCurrentStudent")||null;
function pick(n){stu=n;localStorage.setItem("kidsCurrentStudent",n);
  document.querySelectorAll(".stu-btn").forEach(b=>b.classList.toggle("active",b.textContent.toLowerCase().includes(n==="test"?"測試":n)));}
if(stu)pick(stu);
function toast(m){const t=document.getElementById("toast");t.textContent=m;t.style.display="block";setTimeout(()=>t.style.display="none",2200);}
function playEx(i){new Audio("audio/ex/"+UID+"_"+i+".mp3").play().catch(()=>toast("語音載入中，再點一次"));}
// 測驗
let done=0, ok=0;
const qEl=document.getElementById("quiz");
qEl.innerHTML=QUIZ.map((q,i)=>'<div class="q" id="q'+i+'"><div class="qt">'+(i+1)+". "+q.q.replace(/</g,"&lt;")+'</div>'+
  q.choices.map(ch=>'<button onclick="ans('+i+',this)">'+ch.replace(/</g,"&lt;")+"</button>").join("")+"</div>").join("");
function ans(i,btn){
  const box=document.getElementById("q"+i); if(box.dataset.done)return; box.dataset.done="1";
  const good=btn.textContent===QUIZ[i].answer;
  box.querySelectorAll("button").forEach(b=>{b.disabled=true;
    if(b.textContent===QUIZ[i].answer){b.style.borderColor="#2fbf71";b.style.background="#d9f7e8";}
    else if(b===btn){b.style.borderColor="#ef476f";b.style.background="#fde0e8";}});
  done++; if(good)ok++;
  if(done===QUIZ.length)finish();
}
function finish(){
  const r=document.getElementById("result");
  let msg="🎉 答對 "+ok+" / "+QUIZ.length+"！";
  if(!stu){r.textContent=msg+"（先選名字才能領金幣）";return;}
  const key="gc::"+UID;
  const raw=localStorage.getItem("kidsProgress."+stu);
  const p=raw?JSON.parse(raw):{wrongCounts:{},sessions:0,totalCorrect:0,totalWrong:0};
  if(!p.coins)p.coins={balance:0,lifetimeEarned:0,lifetimeSpent:0,transactions:[],claimedDrills:{}};
  if(p.coins.claimedDrills[key]){r.textContent=msg+"（這單元的金幣領過囉）";return;}
  const earned=ok*5+(ok===QUIZ.length?10:0)+20;
  p.coins.balance+=earned;p.coins.lifetimeEarned+=earned;
  p.coins.transactions.push({type:"earn",source:"grammarCore",amount:earned,balanceAfter:p.coins.balance,createdAt:new Date().toISOString(),meta:{unit:UID,correct:ok}});
  p.coins.claimedDrills[key]={claimedAt:new Date().toISOString(),earned,correct:ok};
  localStorage.setItem("kidsProgress."+stu,JSON.stringify(p));
  if(typeof cloudSave==="function")cloudSave(stu);
  r.innerHTML=msg+" 🪙 +"+earned+"（共 "+p.coins.balance+"）";
}
</script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../cloud_sync.js?v=${STAMP}"></script>
<script src="../account_lock.js?v=${STAMP}"></script>
<script src="../supabase_auth.js?v=${STAMP}"></script>
</body></html>`;
  fs.writeFileSync(path.join(OUT, `${u.id}.html`), page);
}

// ── hub ──
const hub = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>📘 文法根基課程</title><style>
body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;max-width:680px;margin:0 auto;padding:0 14px 60px}
header{background:#2f80ed;color:#fff;text-align:center;padding:18px;border-radius:0 0 14px 14px;margin:0 -14px 12px}
header h1{margin:0;font-size:1.2rem} header p{margin:6px 0 0;font-size:.8rem;opacity:.9}
header a{color:#ffe27a;text-decoration:none;font-weight:700}
.note{font-size:.82rem;background:#fff;border-radius:10px;padding:10px 14px;color:#555;line-height:1.7}
a.u{display:flex;align-items:center;gap:12px;background:#fff;border-radius:12px;padding:12px 14px;margin-top:10px;text-decoration:none;color:inherit;box-shadow:0 1px 4px rgba(0,0,0,.08);border:2px solid transparent}
a.u:hover{border-color:#2f80ed44}
a.u.review{background:#f3edff}
.ic{font-size:1.5rem} .t b{font-size:.95rem} .t small{display:block;color:#888;font-size:.76rem;margin-top:2px}
.done{margin-left:auto;font-size:1.1rem}
</style></head><body>
<header><h1>📘 文法根基課程</h1><p>觀念根基優先 · 學穩再前進，不趕進度 · <a href="../index.html">← 回首頁</a> · <a href="scripts.html">📄 講稿總覽</a></p></header>
<div class="note">每個單元：概念圖 → 聽講解 → 例句 → 小測驗（領金幣 🪙）。順序由上往下，一個觀念花幾週都可以，複習單元把前面觀念組合起來用。</div>
${GRAMMAR_CORE.map(u => `<a class="u ${u.kind}" href="${u.id}.html" data-uid="${u.id}">
  <span class="ic">${u.icon}</span>
  <span class="t"><b>${esc(u.name)}</b><small>${esc(u.concept)}</small></span>
  <span class="done" data-done="${u.id}"></span></a>`).join("")}
<script>
const stu=localStorage.getItem("kidsCurrentStudent");
if(stu){try{
  const p=JSON.parse(localStorage.getItem("kidsProgress."+stu)||"{}");
  const cd=(p.coins&&p.coins.claimedDrills)||{};
  document.querySelectorAll("[data-done]").forEach(el=>{ if(cd["gc::"+el.dataset.done]) el.textContent="✅"; });
}catch(e){}}
</script></body></html>`;
fs.writeFileSync(path.join(OUT, "index.html"), hub);

// ── 例句英文語音 spec ──
const items = {};
GRAMMAR_CORE.forEach(u => units[u.id].examples.forEach((e, j) => items[`${u.id}_${j}`] = e.en));
fs.writeFileSync(path.join(__dirname, "audio_gram_ex.json"),
  JSON.stringify({ outdir: "D:/english/kids/grammar_core/audio/ex", voice: "af_heart", speed: 0.88, items }, null, 1));
console.log(`✔ ${GRAMMAR_CORE.length} 單元頁 + hub；例句語音 spec ${Object.keys(items).length} 條`);
