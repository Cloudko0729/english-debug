// 實測 kids/island.html 的每日結算：離線補算天數、上限、建築成長、二號島背景結算。
//
// 用法: node kids/tools/test_island_tick.js
//
// 為什麼要跑真的程式而不是看程式碼：island.html 有 2600 行內嵌 JS 而且沒有任何
// 測試，之前兩次壞掉都是「函式本身沒問題，但整條路徑跑起來就卡住」——
// 語法檢查和肉眼審查都抓不到，只有真的執行才會現形。
// 不是語法檢查 —— 語法檢查抓不到「補算天數算錯」這種事。
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const HTML = path.join(__dirname, "..", "island.html");
const src = fs.readFileSync(HTML, "utf8");
const scripts = [...src.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)]
  .filter(m => !/src=/.test(m[1]));
if (scripts.length !== 1) throw new Error("預期只有一段內嵌 script，實際 " + scripts.length);
const code = scripts[0][2];

// ── 最小 DOM / localStorage 樁 ──────────────────────────────────────────────
const store = new Map();
function el() {
  const e = {
    style: {}, dataset: {}, children: [], classList: {
      add() {}, remove() {}, toggle() {}, contains() { return false; },
    },
    textContent: "", innerHTML: "", value: "",
    appendChild(c) { this.children.push(c); return c; },
    remove() {}, addEventListener() {}, removeEventListener() {},
    setAttribute() {}, getAttribute() { return null; },
    querySelector() { return el(); }, querySelectorAll() { return []; },
    focus() {}, click() {}, scrollIntoView() {}, getBoundingClientRect() {
      return { top: 0, left: 0, width: 0, height: 0 };
    },
  };
  return e;
}
const byId = new Map();   // 同一個 id 要回同一個元素，才驗得到 innerHTML 寫了什麼
const doc = {
  body: el(), documentElement: el(),
  getElementById(id) { if (!byId.has(id)) byId.set(id, el()); return byId.get(id); },
  querySelector() { return el(); },
  querySelectorAll() { return []; },
  createElement() { return el(); },
  addEventListener() {}, createTextNode() { return el(); },
};
const sandbox = {
  console, document: doc, localStorage: {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
  },
  location: { href: "", search: "", hash: "" },
  navigator: { userAgent: "node" },
  setTimeout, clearTimeout, setInterval, clearInterval,
  requestAnimationFrame: fn => setTimeout(fn, 0),
  fetch: () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }),
  alert() {}, confirm: () => false, prompt: () => null,
  Audio: function () { return { play() { return Promise.resolve(); }, pause() {} }; },
  speechSynthesis: { speak() {}, cancel() {}, getVoices: () => [] },
  WORLD_CITIES: [], WORDBANK: [], CURRICULUM: [], WORD_ROOTS: {},
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
// const/let 不會掛到 sandbox 上（function 宣告會），所以補一組取值器把它們接出來。
// 用 getter/setter 而不是快照，才拿得到 island 被改動後的即時值。
const bridge = `;globalThis.__T = {
  get BUILDINGS(){return BUILDINGS},
  get OFFLINE_DAYS_MAX(){return OFFLINE_DAYS_MAX},
  get lastTickDays(){return lastTickDays},
  get island(){return island}, set island(v){island=v},
  get TERRAIN_MAP(){return TERRAIN_MAP}, set TERRAIN_MAP(v){TERRAIN_MAP=v},
  get currentStudent(){return currentStudent}, set currentStudent(v){currentStudent=v},
};`;
vm.runInContext(code + bridge, sandbox, { filename: "island.html<script>" });
const T = sandbox.__T;      // const / let 綁定
// 測試裡一律寫 S.xxx：函式走 sandbox，const/let 轉去 __T 的取值器。
const S = new Proxy(sandbox, {
  get: (o, k) => (k in T ? T[k] : o[k]),
  set: (o, k, v) => { if (k in T) T[k] = v; else o[k] = v; return true; },
});

// ── 測試工具 ────────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ " + name + (extra ? "  → " + extra : "")); }
}
function eq(name, got, want) { ok(name + " = " + JSON.stringify(want), got === want, "got " + JSON.stringify(got)); }

function ago(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 佈一座島：n 棟同型建築，上次結算在 daysAgo 天前
function seed(student, islandId, type, count, daysAgo, level) {
  const isl = S.newIsland(student, islandId);
  isl.lastProcessedDate = ago(daysAgo);
  isl.rubble = {};
  isl.buildings = [];
  for (let i = 0; i < count; i++) {
    isl.buildings.push({ id: "b" + i, type, x: i, y: 0, level: level || 1, activeDays: 0,
                         placedAt: ago(daysAgo) });
  }
  store.set("kidsIsland" + (islandId === 2 ? "2" : "") + "." + student, JSON.stringify(isl));
  return isl;
}
function coins(student) { return S.getProgress(student).coins.balance; }
function loadIsl(student, id) {
  return JSON.parse(store.get("kidsIsland" + (id === 2 ? "2" : "") + "." + student));
}
function runOn(student, islandId) {
  S.currentStudent = student;
  S.island = loadIsl(student, islandId);
  S.TERRAIN_MAP = S.terrainMapFor(islandId);
  return S.runDailyTick();
}

console.log("\n── daysBetween ──");
eq("同一天", S.daysBetween(ago(0), ago(0)), 0);
eq("昨天→今天", S.daysBetween(ago(1), ago(0)), 1);
eq("五天前→今天", S.daysBetween(ago(5), ago(0)), 5);
eq("跨月 (7/31→8/3)", S.daysBetween("2026-07-31", "2026-08-03"), 3);
eq("跨年 (2025-12-30→2026-01-02)", S.daysBetween("2025-12-30", "2026-01-02"), 3);
eq("跨日光節約 (2026-03-07→2026-03-10)", S.daysBetween("2026-03-07", "2026-03-10"), 3);
eq("壞資料回退 1 天", S.daysBetween("garbage", ago(0)), 1);

console.log("\n── 上限 3 天 ──");
const TYPE = Object.keys(S.BUILDINGS).find(k => (S.BUILDINGS[k].coin || [])[0] > 0);
console.log("  (用建築: " + TYPE + ", Lv1 產 " + S.BUILDINGS[TYPE].coin[0] + ")");
const got = {};
[1, 2, 3, 5, 30].forEach(d => {
  store.clear();
  seed("t" + d, 1, TYPE, 3, d);
  got[d] = runOn("t" + d, 1);
});
console.log("  隔 1/2/3/5/30 天的產出:", JSON.stringify(got));
ok("1 天 < 2 天 < 3 天（有累積）", got[1] < got[2] && got[2] < got[3],
   JSON.stringify(got));
eq("隔 5 天 = 隔 3 天（封頂）", got[5], got[3]);
eq("隔 30 天 = 隔 3 天（封頂）", got[30], got[3]);
ok("3 天約等於 1 天的 3 倍", Math.abs(got[3] - got[1] * 3) <= 2,
   `1天=${got[1]} 3天=${got[3]}`);

console.log("\n── 同一天不重複發 ──");
store.clear();
seed("dup", 1, TYPE, 3, 2);
const first = runOn("dup", 1);
const second = runOn("dup", 1);
ok("第一次有產出", first > 0, String(first));
eq("同一天再跑", second, 0);
eq("金幣沒被灌兩次", coins("dup"), first);

console.log("\n── activeDays / 升級一起補 ──");
store.clear();
const LVL = Object.keys(S.BUILDINGS).find(k => (S.BUILDINGS[k].levelDays || []).length >= 2);
console.log("  (用建築: " + LVL + ", levelDays " + JSON.stringify(S.BUILDINGS[LVL].levelDays) + ")");
seed("grow", 1, LVL, 1, 3);
runOn("grow", 1);
const g = loadIsl("grow", 1).buildings[0];
eq("activeDays 補了 3 天", g.activeDays, 3);
const need = S.BUILDINGS[LVL].levelDays;
const wantLv = 1 + need.filter(n => n != null && 3 >= n).length;
eq("等級", g.level, Math.min(wantLv, S.BUILDINGS[LVL].maxLevel || 3));

console.log("\n── 二號島背景結算 ──");
store.clear();
S.currentStudent = "bg";
seed("bg", 1, TYPE, 2, 2);
seed("bg", 2, TYPE, 2, 2);
S.island = loadIsl("bg", 1);
S.TERRAIN_MAP = S.terrainMapFor(1);
const p1 = S.runDailyTick();
const p2 = S.tickIslandInBackground(2);
ok("一號島有產出", p1 > 0, String(p1));
ok("二號島也結算了（沒手動切過去）", p2 > 0, String(p2));
eq("結算後全域 island 還是一號島", S.island.islandId, 1);
eq("結算後 TERRAIN_MAP 還原", S.TERRAIN_MAP === S.terrainMapFor(1), true);
eq("二號島已存檔", loadIsl("bg", 2).lastProcessedDate, ago(0));
eq("金幣是兩島相加", coins("bg"), p1 + p2);

console.log("\n── 空的二號島不會被建檔 ──");
store.clear();
S.currentStudent = "empty";
S.island = S.newIsland("empty", 1);
S.TERRAIN_MAP = S.terrainMapFor(1);
eq("回傳 0", S.tickIslandInBackground(2), 0);
eq("沒寫入 localStorage", store.has("kidsIsland2.empty"), false);

console.log("\n── 舊存檔沒有 lastProcessedDate ──");
store.clear();
const legacy = seed("old", 1, TYPE, 2, 4);
delete legacy.lastProcessedDate;
store.set("kidsIsland.old", JSON.stringify(legacy));
const lp = runOn("old", 1);
eq("當一天算", S.lastTickDays, 1);
ok("有產出", lp > 0, String(lp));

console.log("\n── 交易紀錄 ──");
store.clear();
seed("tx", 1, TYPE, 2, 3);
runOn("tx", 1);
const tx = S.getProgress("tx").coins.transactions.slice(-1)[0];
eq("source", tx.source, "islandProduction");
eq("meta.days", tx.meta.days, 3);
eq("meta.islandId", tx.meta.islandId, 1);
eq("balanceAfter 對得上", tx.balanceAfter, coins("tx"));

// selectStudent 是真正的進入點。先前踩過「函式邏輯測過了，但頁面實際跑起來
// 讀到未宣告的變數就整頁卡住」，所以這裡把整條路徑跑一次，不只測 runDailyTick。
console.log("\n── selectStudent 全流程 ──");
store.clear();
seed("albert", 1, TYPE, 3, 5);   // 五天沒玩
seed("albert", 2, TYPE, 2, 5);
let threw = null;
try { S.selectStudent("albert"); } catch (e) { threw = e; }
ok("沒拋錯", !threw, threw && (threw.message + "\n" + String(threw.stack).split("\n")[1]));
const notice = byId.get("notice");
console.log("  notice:", notice && notice.innerHTML.replace(/<[^>]+>/g, ""));
ok("提示有出現", notice && notice.style.display === "block");
ok("說了補算 3 天", notice && /補算了/.test(notice.innerHTML) && />3</.test(notice.innerHTML),
   notice && notice.innerHTML);
ok("兩座島都列出來", notice && /一號島/.test(notice.innerHTML) && /二號島/.test(notice.innerHTML));
ok("封頂時有提醒每天回來", notice && /最多補 3 天/.test(notice.innerHTML));
ok("金幣有進帳", coins("albert") > 0, String(coins("albert")));
eq("兩座島都結算到今天",
   [loadIsl("albert", 1).lastProcessedDate, loadIsl("albert", 2).lastProcessedDate].join("|"),
   ago(0) + "|" + ago(0));

console.log("\n── 隔天再開：不重複發 ──");
const before = coins("albert");
byId.get("notice").style.display = "";
try { S.selectStudent("albert"); } catch (e) { ok("第二次 selectStudent 沒拋錯", false, e.message); }
eq("金幣沒變", coins("albert"), before);
eq("提示收起來", byId.get("notice").style.display, "none");

console.log(`\n${fail === 0 ? "✅" : "❌"} pass ${pass} / fail ${fail}\n`);
process.exit(fail ? 1 : 0);
