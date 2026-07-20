// 各級「單字練習題」產生器：涵蓋該級字彙池全部字（不只是週課程教過的），含例句＋發音＋四選一中文意思。
// 用法：node render_pool_quiz.js
// 依賴 pool_sentences.js（例句庫）＋各級既有的中文翻譯來源（render_lv1/render_lv23/render_lv46 的 zh 對照）。
const fs = require("fs");
const path = require("path");
const { WORD_LEVELS, EXTRA_LEVELS, wordLevel } = require(path.join(__dirname, "..", "..", "kids", "wordlevels.js"));
const { SENTENCES } = require("./pool_sentences.js");
const { LV1_ZH } = require("./render_lv1.js");
const { wordZh: wordZh23 } = require("./render_lv23.js");
const { wordZh: wordZh46 } = require("./render_lv46.js");
const { wordZh: wordZh79 } = require("./render_lv79.js");

const ROOT = path.join(__dirname, "..");
const HEADER_COLOR = { 1: "#2fbf71", 2: "#5b7cfa", 3: "#9b59b6", 4: "#0e9594", 5: "#e08e2b", 6: "#d1495b", 7: "#6a4c93" };
const TITLES = { 1: "國小一年級", 2: "國小二年級", 3: "國小三年級", 4: "國小四年級", 5: "國小五年級", 6: "國小六年級", 7: "國中一年級" };

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""); }
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function boldWord(sentence, word) {
  const escaped = esc(sentence);
  const pattern = new RegExp("\\b" + escapeRegex(word).replace(/ /g, "\\s+") + "\\b", "i");
  const m = escaped.match(pattern);
  if (!m) return escaped; // 找不到就整句照顯示，不影響功能
  return escaped.slice(0, m.index) + "<b>" + m[0] + "</b>" + escaped.slice(m.index + m[0].length);
}
function zhFor(level, word) {
  if (level === 1) return LV1_ZH[word] || "中文意思整理中";
  if (level === 2 || level === 3) return wordZh23(word);
  if (level === 7) return wordZh79(word);
  return wordZh46(word);
}
// Lv.1-6 沿用既有 WORD_LEVELS-only 範圍（PDF 1200 字表，不含 Codex 額外分級字，維持已上線內容不變）；
// Lv.7 用 wordLevel() 合併 WORD_LEVELS+EXTRA_LEVELS，跟 render_lv79.js 的字彙池範圍一致（575 字）。
function canonicalWordsFor(level) {
  if (level === 7) {
    const all = new Set([...Object.keys(WORD_LEVELS), ...Object.keys(EXTRA_LEVELS)]);
    return [...all].filter(w => wordLevel(w) === 7).sort();
  }
  return Object.keys(WORD_LEVELS).filter(w => WORD_LEVELS[w] === level).sort();
}

const CSS = `
body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;max-width:720px;margin:0 auto;padding:0 14px 60px;line-height:1.7}
header{color:#fff;text-align:center;padding:18px;border-radius:0 0 14px 14px;margin:0 -14px 12px}
header h1{margin:0;font-size:1.2rem} header p{margin:6px 0 0;font-size:.82rem;opacity:.92} header a{color:#fff;text-decoration:none;font-weight:700}
.card{background:#fff;border-radius:14px;padding:14px 16px;margin-top:14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.card h2{font-size:1rem;margin:0 0 8px}
.intro{font-size:.9rem;color:#555}
#start{border:none;border-radius:10px;color:#fff;font-weight:700;padding:11px 20px;cursor:pointer;font-size:.95rem}
.qcount{font-size:.82rem;color:#888;margin-top:6px}
.sent{font-size:1.05rem;background:#eef5ff;border-radius:10px;padding:12px 14px;margin-bottom:10px}
.sent b{color:#1e5fb8}
.playbtn{border:none;border-radius:8px;color:#fff;font-weight:700;padding:7px 14px;cursor:pointer;margin:0 8px 10px 0}
.choices{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.choices button{padding:12px 10px;border:2px solid #d9e2ec;border-radius:10px;background:#fff;font-weight:700;cursor:pointer;font-size:.92rem}
.choices button.correct{border-color:#2fbf71;background:#d9f7e8}
.choices button.wrong{border-color:#ef476f;background:#fde0e8}
#qstatus{font-weight:700;margin-top:10px;text-align:center}
#result{text-align:center;font-size:1.1rem;font-weight:700;margin-top:10px}
.again{display:block;text-align:center;border:none;border-radius:10px;color:#fff;font-weight:700;padding:10px;margin-top:12px;cursor:pointer;width:100%;font-size:.95rem}
.nav2{display:flex;justify-content:space-between;margin-top:16px;font-size:.85rem}
.nav2 a{text-decoration:none;font-weight:700;background:#fff;border-radius:10px;padding:9px 14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
`;

function renderQuizPage(level) {
  const color = HEADER_COLOR[level];
  const canonical = canonicalWordsFor(level);
  const pool = canonical.map(word => ({
    en: word,
    zh: zhFor(level, word),
    audio: "pool_" + slug(word),
    sentAudio: "pool_sent_" + slug(word),
    sentHtml: boldWord(SENTENCES[word], word),
  }));
  return `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>🎯 Lv.${level} 單字練習題</title><style>${CSS}</style></head><body>
<header style="background:${color}"><h1>🎯 Lv.${level} 單字練習題</h1><p><a href="index.html">← Lv.${level}：${esc(TITLES[level])}</a></p></header>
<div class="card"><h2 style="color:${color}">字彙池練習</h2><p class="intro">從 Lv.${level} 字彙池（${pool.length} 字，不限本級 8 週課程教過的字）隨機出題：看例句、聽發音，選出正確的中文意思。每次練習抽 ${Math.min(12, pool.length)} 題，可以一直重來抽到不同的字。</p>
<button id="start" style="background:${color}" onclick="startQuiz()">▶️ 開始練習</button>
<p class="qcount" id="qcount"></p>
<div id="quizArea"></div>
<div id="qstatus"></div>
<div id="result"></div>
<button class="again" id="again" style="background:${color};display:none" onclick="startQuiz()">🔁 再來一組</button>
</div>
<div class="nav2"><span><a href="index.html" style="color:${color}">← Lv.${level} 目錄</a></span><span></span></div>
<script>
const POOL=${JSON.stringify(pool)};
const N=Math.min(12,POOL.length);
let session=[],qi=0,score=0;
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startQuiz(){
  session=shuffle(POOL).slice(0,N); qi=0; score=0;
  document.getElementById("result").textContent="";
  document.getElementById("again").style.display="none";
  document.getElementById("qcount").textContent="";
  renderQ();
}
function renderQ(){
  const area=document.getElementById("quizArea");
  if(qi>=session.length){
    area.innerHTML=""; document.getElementById("qstatus").textContent="";
    document.getElementById("result").textContent="🎉 完成！答對 "+score+" / "+session.length;
    document.getElementById("again").style.display="block";
    return;
  }
  const q=session[qi];
  const distractors=shuffle(POOL.filter(p=>p.en!==q.en)).slice(0,3).map(p=>p.zh);
  const choices=shuffle(distractors.concat([q.zh]));
  area.innerHTML='<div class="sent">'+q.sentHtml+'</div>'+
    '<button class="playbtn" style="background:${color}" onclick="playAudio(\\''+q.sentAudio+'\\')">🔊 聽整句例句</button>'+
    '<button class="playbtn" style="background:#8a93b8" onclick="playAudio(\\''+q.audio+'\\')">🔊 只聽這個字</button>'+
    '<div class="choices">'+choices.map(c=>'<button onclick="answer(this,\\''+c.replace(/'/g,"\\\\'")+'\\')">'+esc(c)+'</button>').join("")+'</div>';
  document.getElementById("qstatus").textContent="第 "+(qi+1)+" / "+session.length+" 題";
  document.getElementById("qcount").textContent="本級字彙池共 "+POOL.length+" 字，慢慢都會抽到。";
}
function answer(btn,c){
  const q=session[qi];
  document.querySelectorAll(".choices button").forEach(b=>b.disabled=true);
  if(c===q.zh){btn.classList.add("correct");score++;}
  else{btn.classList.add("wrong");
    document.querySelectorAll(".choices button").forEach(b=>{if(b.textContent===q.zh)b.classList.add("correct");});
  }
  setTimeout(()=>{qi++;renderQ();},1100);
}
function playAudio(name){new Audio("audio/"+name+".mp3").play().catch(()=>{});}
</script>
</body></html>`;
}

if (require.main === module) {
  for (const level of [1, 2, 3, 4, 5, 6, 7]) {
    const out = path.join(ROOT, `lv${level}`);
    fs.mkdirSync(path.join(out, "audio"), { recursive: true });
    fs.writeFileSync(path.join(out, "vocab_quiz.html"), renderQuizPage(level), "utf8");
    const canonical = canonicalWordsFor(level);
    const items = {};
    canonical.forEach(word => {
      items["pool_" + slug(word)] = word;
      items["pool_sent_" + slug(word)] = SENTENCES[word];
    });
    fs.writeFileSync(path.join(__dirname, `audio_pool_lv${level}.json`), JSON.stringify({ outdir: path.join(out, "audio").replace(/\\/g, "/"), voice: "af_heart", speed: 0.85, items }, null, 2), "utf8");
    console.log(`Lv.${level} 單字練習題：${canonical.length} 字`);
  }
  console.log("已產生 Lv.1-6 單字練習題頁面與音訊清單");
}
