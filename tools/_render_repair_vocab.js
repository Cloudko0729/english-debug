// 驗證 _repair_vocab.json → adult/repair_terms.js + repair_terms.html
const fs = require("fs"), path = require("path");
const j = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "kids", "tools", "_repair_vocab.json"), "utf8"));
const T = j.terms;

const errs = [];
if (T.length < 110 || T.length > 130) errs.push("詞條數 " + T.length);
const seen = new Set(), cats = { parts: 0, symptom: 0, test: 0, tool: 0, process: 0, action: 0 };
T.forEach(t => {
  const k = t.en.toLowerCase();
  if (seen.has(k)) errs.push("重複 " + k); seen.add(k);
  if (!(t.cat in cats)) errs.push(t.en + " cat '" + t.cat + "'?"); else cats[t.cat]++;
  if (!t.zh || !t.example || !t.example_zh) errs.push(t.en + " 欄位缺");
  if (t.example && /BR\d{4}|\[[A-Z]/i.test(t.example)) errs.push(t.en + " 例句疑似含代號");
});
if (cats.action > 25) errs.push("動詞 " + cats.action + " > 25");
if (errs.length) { console.error("❌\n" + errs.slice(0, 20).join("\n")); process.exit(1); }
console.log(`✔ ${T.length} 詞條通過：` + Object.entries(cats).map(([k, v]) => k + v).join(" "));

fs.writeFileSync(path.join(__dirname, "..", "adult", "repair_terms.js"),
  "// 維修英文詞條表（探勘自 25,063 筆真實工程紀錄；Codex 起草、Claude 驗證）\n" +
  "const REPAIR_TERMS = " + JSON.stringify(T) + ";\n" +
  'if (typeof module !== "undefined" && module.exports) module.exports = { REPAIR_TERMS };\n');

const CAT_ZH = { parts: "🔩 零件", symptom: "⚠️ 症狀", test: "🔬 測試檢驗", tool: "🛠️ 儀器工具", process: "📋 流程單據", action: "🔧 動作" };
const html = `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>維修英文詞條表</title><style>
body{font-family:"Segoe UI","Microsoft JhengHei","Noto Sans TC",sans-serif;max-width:720px;margin:0 auto;padding:0 14px 60px;background:#f4f6fb;color:#1a1a2e}
header{background:#1f4463;color:#fff;text-align:center;padding:18px;border-radius:0 0 16px 16px;margin:0 -14px 12px}
header h1{margin:0;font-size:1.2rem} header p{margin:6px 0 0;font-size:.8rem;opacity:.85}
header a{color:#9fd0ff;text-decoration:none;font-weight:700}
#bar{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}
#bar button{padding:6px 13px;border:2px solid #d9e2ec;border-radius:16px;background:#fff;font-weight:700;cursor:pointer;font-size:.8rem}
#bar button.on{border-color:#1f4463;background:#1f4463;color:#fff}
.t{background:#fff;border-radius:12px;padding:11px 14px;margin-bottom:8px;box-shadow:0 1px 3px rgba(0,0,0,.07)}
.t .hd{display:flex;align-items:baseline;gap:9px;flex-wrap:wrap}
.t .en{font-weight:800;font-size:1rem;color:#14324a;cursor:pointer}
.t .zh{color:#666;font-size:.85rem}
.t .cat{font-size:.68rem;background:#eef3fa;color:#41618a;border-radius:5px;padding:2px 7px;margin-left:auto}
.t .ex{margin-top:5px;font-size:.88rem;color:#2c4a68;background:#f6f9fd;border-left:3px solid #9fc3e8;border-radius:0 8px 8px 0;padding:5px 11px;cursor:pointer}
.t .exzh{font-size:.78rem;color:#999;margin-top:2px;padding-left:12px}
#stat{font-size:.78rem;color:#666;margin:6px 0}
</style></head><body>
<header><h1>🔧 維修英文詞條表</h1>
<p><a href="index.html">← 課程目錄</a> · 來自 25,063 筆真實工程紀錄 · 點單字或例句發音</p></header>
<div id="bar"></div><div id="stat"></div><div id="list"></div>
<script src="repair_terms.js"></script>
<script>
let fc="all";
const CAT_ZH=${JSON.stringify(CAT_ZH)};
function draw(){
  let b='<button class="'+(fc==='all'?'on':'')+'" onclick="fc=\\'all\\';draw()">全部</button>';
  Object.entries(CAT_ZH).forEach(([c,z])=>b+='<button class="'+(fc===c?'on':'')+'" onclick="fc=\\''+c+'\\';draw()">'+z+'</button>');
  document.getElementById('bar').innerHTML=b;
  const rows=REPAIR_TERMS.filter(t=>fc==='all'||t.cat===fc);
  document.getElementById('stat').textContent='顯示 '+rows.length+' / '+REPAIR_TERMS.length+' 條';
  document.getElementById('list').innerHTML=rows.map(t=>
    '<div class="t"><div class="hd"><span class="en" onclick="say(this.textContent)">'+t.en+'</span><span class="zh">'+t.zh+'</span><span class="cat">'+CAT_ZH[t.cat]+'</span></div>'+
    '<div class="ex" onclick="say(this.textContent)">'+t.example+'</div><div class="exzh">'+t.example_zh+'</div></div>').join('');
}
function say(s){const u=new SpeechSynthesisUtterance(s);u.lang='en-US';u.rate=.85;speechSynthesis.cancel();speechSynthesis.speak(u);}
draw();
</script></body></html>`;
fs.writeFileSync(path.join(__dirname, "..", "adult", "repair_terms.html"), html);
console.log("✔ adult/repair_terms.js + repair_terms.html");
