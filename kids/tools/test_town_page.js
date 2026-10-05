// 四季小鎮頁面冒煙測試：真的執行 kids/town/index.html 的程式，走完一整輪玩法。
// 用法: node kids/tools/test_town_page.js
// 規則細節由 test_town_core.js 負責；這支抓的是「規則對、畫面卻壞」的那一類錯：
// 函式名打錯、onclick 叫到不存在的東西、某個分頁渲染時丟例外、音檔 key 對不上。
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const DIR = path.join(__dirname, "..", "town");
const html = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (inline.length !== 1) throw new Error("預期一段內嵌 script，實際 " + inline.length);

const els = new Map();
function el(id) {
  if (!els.has(id)) els.set(id, { id, innerHTML: "", textContent: "", hidden: false, disabled: false,
    classList: { _s: new Set(), toggle(c, on) { on ? this._s.add(c) : this._s.delete(c); }, contains(c) { return this._s.has(c); } } });
  return els.get(id);
}
const store = new Map();
const sandbox = {
  console, URLSearchParams, Blob: function () {}, URL: { createObjectURL: () => "" },
  setTimeout, clearTimeout, setInterval: () => 0,
  location: { search: "" },
  document: { getElementById: el, body: { className: "" }, createElement: () => ({ click() {} }) },
  localStorage: { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) },
  Audio: function () { return { play: () => Promise.resolve() }; },
};
sandbox.window = sandbox;
vm.createContext(sandbox);
["town_core.js", "town_content.js"].forEach(f => vm.runInContext(fs.readFileSync(path.join(DIR, f), "utf8"), sandbox, { filename: f }));
// const / let 不會掛到 sandbox，補取值器
vm.runInContext(inline[0] + ";globalThis.__T={get st(){return st},set st(v){st=v},get sel(){return sel},set sel(v){sel=v},get moving(){return moving},set moving(v){moving=v}};", sandbox, { filename: "index.html<script>" });
const S = sandbox, G = sandbox.__T;

let pass = 0, fail = 0;
const ok = (n, c, x) => { if (c) { pass++; console.log("  ✓ " + n); } else { fail++; console.log("  ✗ " + n + (x !== undefined ? "  → " + JSON.stringify(x) : "")); } };
const run = code => vm.runInContext(code, sandbox);
const day = d => { S.location.search = "?date=" + d; run("render()"); };

console.log("\n── 開頁 ──");
ok("預設是測試帳號", run("student") === "test");
ok("農莊畫出來了", el("map").innerHTML.includes("field"));
ok("HUD 有體力", el("hud").innerHTML.includes("⚡"));

console.log("\n── 從練習紀錄補體力 ──");
store.set("kidsProgress.test", JSON.stringify({ coins: { claimedDrills: { "2026-10-05::2026-10-05-vocab": {}, "2026-10-06::2026-10-06-vocab": {} } } }));
run("pick('test')");
ok("兩份練習 → 20 ⚡", run("T.apTotal(st)") === 20, run("T.apTotal(st)"));
day("2026-10-05");
ok("今天做過練習會顯示 ✅", el("today").innerHTML.includes("✅"));

console.log("\n── 測試帳號加體力 ──");
ok("測試帳號看得到不限量按鈕", el("hud").innerHTML.includes("testBoost(50)"));
const ap0 = run("T.apTotal(st)");
for (let i = 0; i < 4; i++) run("testBoost(50)");
ok("連按 4 次 +200，不受每週 70 限制", run("T.apTotal(st)") === ap0 + 200, run("T.apTotal(st)"));
ok("體力條先補滿 60，其餘進儲備", G.st.energy.wallet === 60 && G.st.energy.reserve === ap0 + 200 - 60, G.st.energy);

console.log("\n── 種田一輪 ──");
const fid = run("st.farm.fields[0].id");
run(`tapThing('${fid}')`);
ok("點田出現播種選單", el("sheet").innerHTML.includes("要種什麼"));
run(`act(T.plant(st,'${fid}','rice',today(),C))`);
ok("種下稻米", G.st.farm.fields[0].crop === "rice");
run("doCare()");
ok("照料按鈕變成今天照料過了", el("careBtn").innerHTML.includes("今天照料過了"));
["2026-10-06", "2026-10-07"].forEach(d => { day(d); run("doCare()"); });
day("2026-10-08");
ok("第 4 天成熟（田有金框）", el("map").innerHTML.includes("ripe"));
run(`tapThing('${fid}')`); ok("出現收成按鈕", el("sheet").innerHTML.includes("收成"));
run(`act(T.harvest(st,'${fid}',today(),C))`);
ok("背包有稻米", G.st.inv.rice === 1);

console.log("\n── 開田、擺裝飾、搬家 ──");
run("tapCell(8,4)"); ok("點空地出現開田", el("sheet").innerHTML.includes("開一片田"));
run("act(T.addField(st,8,4))"); ok("多一片田", G.st.farm.fields.length === 2);
run("st.money=20; act(T.buy(st,'lantern',1,C))");
run("tapCell(12,2)"); ok("空地選單出現燈籠", el("sheet").innerHTML.includes("擺燈籠"));
run("act(T.placeDecor(st,'lantern',12,2))");
const did = run("st.farm.decor[0].id");
run(`moving={id:'${did}'}; render()`); ok("搬家模式提示列打開", el("moveBar").hidden === false);
run("tapCell(13,2)"); ok("燈籠搬到 13,2", G.st.farm.decor[0].x === 13 && G.moving === null);

console.log("\n── 四個分頁都渲染得出來 ──");
["shop", "mail", "town"].forEach(k => { run(`tab('${k}')`); ok(k + " 分頁打開", el("p-" + k).hidden === false && el("p-" + k).innerHTML.length > 100); });
ok("商店有賣稻米按鈕", el("p-shop").innerHTML.includes("賣 1 個"));
ok("村民分頁看到本週的信", el("p-mail").innerHTML.includes("Mia"));
ok("下週的卡片還看不到", !el("p-mail").innerHTML.includes("w2-mail-leo"));
ok("小鎮分頁有廣場", el("p-town").innerHTML.includes("小鎮廣場"));

console.log("\n── 村民 ──");
run("markRead('w1-mail-mia')");
ok("讀信後解鎖故事", el("p-mail").innerHTML.includes("沒有書名的書") && el("p-mail").innerHTML.includes("我念好了"));
run("act(T.finishStory(st,findStory('w1-story-mia'),today()))");
ok("念完 Mia 亮一顆心", G.st.hearts.Mia === 1);
run("act(T.answer(st,findCard('w1-talk-leo'),'a',today()))");
ok("對話選擇被記住", el("p-mail").innerHTML.includes("choice picked"));
day("2026-10-11"); run("tab('mail')");
ok("換週後看得到下週的卡", el("p-mail").innerHTML.includes("朋友與情緒"));
ok("季節換成夏", S.document.body.className === "s-夏");

console.log("\n── 每顆 🔊 都有音檔 ──");
const all = [...el("p-mail").innerHTML.matchAll(/townAudio\('([^']+)'\)/g)].map(m => m[1]);
const missing = [...new Set(all)].filter(k => !fs.existsSync(path.join(__dirname, "..", "audio", "town", k + ".mp3")));
ok("村民分頁 " + new Set(all).size + " 個音檔全部存在", all.length > 10 && !missing.length, missing);
run("tapThing(st.farm.fields[1].id)");
const words = [...el("sheet").innerHTML.matchAll(/wordAudio\('([^']+)'\)/g)].map(m => m[1]);
Object.values(run("C.CROPS")).concat(Object.values(run("C.DECOR"))).forEach(x => words.push(x.en));
const wm = [...new Set(words)].filter(w => !fs.existsSync(path.join(__dirname, "..", "audio", "words", w.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".mp3")));
ok("作物與裝飾的單字音檔都存在", !wm.length, wm);

console.log("\n── 看中文會保持展開 ──");
run("tab('mail')"); run("showZh('w1-mail-leo')");
ok("第一次按看中文就展開（不會被重繪收回）", /card[^"]*showzh[^>]*>[\s\S]*?Leo/.test(el("p-mail").innerHTML));

console.log("\n── 匯入 ──");
const before = store.get("kidsTown.v1.test");
run(`importSave({ files: [{ text: () => Promise.resolve('{"schemaVersion":1,"student":"albert"}') }] })`);
setTimeout(() => {
  ok("別人的存檔匯入失敗，原存檔沒被動到", store.get("kidsTown.v1.test") === before);

console.log("\n── 存檔 ──");
const saved = JSON.parse(store.get("kidsTown.v1.test"));
ok("存檔寫進 localStorage", saved.schemaVersion === 1 && saved.hearts.Mia === 1);
run("pick('albert')"); ok("換帳號是另一份存檔", G.st.student === "albert" && G.st.hearts.Mia === undefined);
ok("一般帳號沒有不限量按鈕", !el("hud").innerHTML.includes("testBoost"));
const apA = run("T.apTotal(st)"); run("testBoost(50)");
ok("一般帳號就算呼叫也不會加", run("T.apTotal(st)") === apA);
run("pick('test')"); ok("換回來進度還在", G.st.hearts.Mia === 1);

console.log(`\n${fail === 0 ? "✅" : "❌"} pass ${pass} / fail ${fail}\n`);
process.exit(fail ? 1 : 0);
}, 50);
