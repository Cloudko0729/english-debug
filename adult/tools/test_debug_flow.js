// 實際執行 adult/debug_flow.html 的內嵌 script，確認頁面真的畫得出來、音檔都在。
//
// 用法: node adult/tools/test_debug_flow.js
//
// 為什麼要跑真的程式：這一頁的內容全是 JS 產生的，檔案存在不代表畫得出來。
// 而且每個可點的發音都對應一個檔案，缺檔不會報錯 —— Audio.play() 的 rejection 被吃掉，
// 使用者只會看到一個按了沒反應的字。
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ADULT = path.join(__dirname, "..");
const HTML = path.join(ADULT, "debug_flow.html");

let fail = 0;
const ok = (n, c, extra) => { if (c) console.log("  ✓ " + n); else { fail++; console.log("  ✗ " + n + (extra ? "  → " + extra : "")); } };

function el(byId, id) {
  return {
    id, style: {}, dataset: {}, innerHTML: "", textContent: "",
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    appendChild() {}, addEventListener() {}, querySelector: () => el(byId), querySelectorAll: () => [],
  };
}

function run() {
  const html = fs.readFileSync(HTML, "utf8");
  const inline = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].filter(m => !/src=/.test(m[1]));
  if (inline.length !== 1) throw new Error("預期一段內嵌 script，實際 " + inline.length);

  const byId = new Map();
  const sandbox = {
    console: { log() {}, warn() {}, error() {} },
    Audio: function () { return { play: () => Promise.resolve(), pause() {} }; },
    setTimeout, clearTimeout,
  };
  sandbox.document = {
    getElementById(id) { if (!byId.has(id)) byId.set(id, el(byId, id)); return byId.get(id); },
    querySelector: () => el(byId), querySelectorAll: () => [], createElement: () => el(byId),
    addEventListener() {}, body: el(byId), head: el(byId),
  };
  sandbox.window = sandbox; sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  // 頁面用 <script src> 載入的資料檔
  vm.runInContext(fs.readFileSync(path.join(ADULT, "debug_flow.js"), "utf8"), sandbox, { filename: "debug_flow.js" });
  vm.runInContext(inline[0][2] + ";globalThis.__T={draw:draw,say:say};", sandbox, { filename: "debug_flow.html" });
  return { sandbox, byId, html };
}

function main() {
  const { sandbox, byId } = run();
  const { DEBUG_FLOW, DEBUG_FLOW_PHRASES } = require(path.join(ADULT, "debug_flow.js"));

  console.log("頁面渲染：");
  const list = byId.get("list").innerHTML;
  const phr = byId.get("phr").innerHTML;
  const chain = byId.get("chain").innerHTML;
  ok("流程格式列有畫出來", chain.includes("symptom") && chain.includes("PASS"));
  ok(`案例列出 ${DEBUG_FLOW.length} 則`, (list.match(/class="c"/g) || []).length === DEBUG_FLOW.length,
     (list.match(/class="c"/g) || []).length + " 則");
  ok(`片語列出 ${DEBUG_FLOW_PHRASES.length} 條`, (phr.match(/class="p"/g) || []).length === DEBUG_FLOW_PHRASES.length);
  ok("每則都有「原本怎麼寫的」", (list.match(/<details>/g) || []).length === DEBUG_FLOW.length);
  ok("狀態列有數字", /顯示 \d+ \/ \d+ 則/.test(byId.get("stat").textContent), byId.get("stat").textContent);

  console.log("\n分類篩選：");
  const cats = [...new Set(DEBUG_FLOW.map(d => d.cat))];
  cats.forEach(c => {
    sandbox.fc = c; sandbox.__T.draw();
    const n = (byId.get("list").innerHTML.match(/class="c"/g) || []).length;
    const want = DEBUG_FLOW.filter(d => d.cat === c).length;
    ok(`${c} → ${want} 則`, n === want, n + " 則");
  });
  sandbox.fc = "all"; sandbox.__T.draw();

  console.log("\n音檔：");
  const dir = path.join(ADULT, "audio", "debug_flow");
  const want = DEBUG_FLOW.map(d => "f" + d.id).concat(DEBUG_FLOW_PHRASES.map((_, i) => "p" + (i + 1)));
  const miss = want.filter(k => !fs.existsSync(path.join(dir, k + ".mp3")));
  ok(`${want.length} 個發音檔都在`, miss.length === 0, "缺 " + miss.join(" "));

  console.log("\n資料自洽：");
  ok("id 不重複", new Set(DEBUG_FLOW.map(d => d.id)).size === DEBUG_FLOW.length);
  const noArrow = DEBUG_FLOW.filter(d => !d.flow.includes("→"));
  ok("每則 flow 都是箭頭式", noArrow.length === 0, noArrow.map(d => d.id).join(" "));
  const mismatched = DEBUG_FLOW.filter(d =>
    d.flow.split("→").length !== d.flow_zh.split("→").length);
  ok("中英文步驟數一致", mismatched.length === 0, mismatched.map(d => d.id).join(" "));
  const noFix = DEBUG_FLOW.filter(d => !d.raw || !d.fix);
  ok("每則都有原句與說明", noFix.length === 0, noFix.map(d => d.id).join(" "));

  console.log("\n公開安全：");
  const src = fs.readFileSync(path.join(ADULT, "debug_flow.js"), "utf8");
  ok("沒有同事姓名", !/潤樺|望平|弘宇|仁竣|志昀|昇澤|建皓/.test(src));
  ok("沒有客戶產品代號", !/Champion|Minimod|VIS16|CSDPS|150AE|T2K|93K|ND4_|ND2_/.test(src));

  console.log(`\n${fail === 0 ? "✅" : "❌"} ${fail === 0 ? "全部通過" : fail + " 項不符"}`);
  process.exit(fail ? 1 : 0);
}

main();
