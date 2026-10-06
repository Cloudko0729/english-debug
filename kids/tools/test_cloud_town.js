// 四季小鎮的雲端同步：小鎮存檔塞在 island._town，兩邊都有時 savedAt 較新的勝出。
// 用法: node kids/tools/test_cloud_town.js
// 不連網：cloudPeek / cloudSave 都換成假的，只測 cloud_sync.js 的打包與合併。
const fs = require("fs");
const path = require("path");
const vm = require("vm");

let pass = 0, fail = 0;
const ok = (name, cond, extra) => { if (cond) pass++; else { fail++; console.log("❌ " + name, extra !== undefined ? JSON.stringify(extra) : ""); } };

function sandbox() {
  const store = {};
  const localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; },
  };
  const ctx = { localStorage, console, Date, JSON, Promise, Object, Array, Math, setTimeout, window: {}, fetch: () => Promise.reject(new Error("no net")) };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "cloud_sync.js"), "utf8"), ctx);
  return { ctx, store };
}
const town = (rev, at) => ({ schemaVersion: 1, student: "albert", rev, savedAt: at });
const T1 = "2026-10-06T01:00:00.000Z", T2 = "2026-10-06T02:00:00.000Z";

(async () => {
  console.log("── 打包 ──");
  {
    const { ctx } = sandbox();
    const p = ctx._packIslands({ a: 1 }, null, town(3, T1));
    ok("有舊島：小鎮放在 _town", p.a === 1 && p._town.rev === 3);
    const q = ctx._packIslands(null, null, town(3, T1));
    ok("沒有舊島也會帶小鎮", q && q._town.rev === 3 && Object.keys(q).length === 1);
    ok("都沒有就是 null", ctx._packIslands(null, null, null) === null);
    const r = ctx._packIslands({ a: 1 }, { b: 2 }, null);
    ok("二號島照舊", r._island2.b === 2 && !("_town" in r));
  }

  console.log("── 拆包：較新的勝出 ──");
  {
    const { ctx, store } = sandbox();
    ctx._storeIslands("albert", { a: 1, _town: town(5, T1) });
    ok("本機沒有小鎮：直接用雲端", JSON.parse(store["kidsTown.v1.albert"]).rev === 5);
    ok("舊島照存、不帶 _town", !("_town" in JSON.parse(store["kidsIsland.albert"])));
    ctx._storeIslands("albert", { a: 1, _town: town(2, "2026-10-05T00:00:00.000Z") });
    ok("雲端較舊：不蓋本機", JSON.parse(store["kidsTown.v1.albert"]).rev === 5);
    ctx._storeIslands("albert", { a: 1, _town: town(9, T2) });
    ok("雲端較新：換成雲端", JSON.parse(store["kidsTown.v1.albert"]).rev === 9);
    ctx._storeIslands("albert", { a: 1, _town: town(1, "2026-10-01T00:00:00.000Z") }, true);
    ok("指定某天還原：照雲端那份", JSON.parse(store["kidsTown.v1.albert"]).rev === 1);
  }
  {
    const { ctx, store } = sandbox();
    ctx._storeIslands("ryder", { _town: town(1, T1) });
    ok("只有小鎮的帳號不會生出空的舊島", !("kidsIsland.ryder" in store) && "kidsTown.v1.ryder" in store);
  }

  console.log("── 開頁同步 ──");
  {
    // 學習進度兩邊一樣，但小鎮在別台玩過 → 拉下小鎮、推上去、通知頁面重載
    const { ctx, store } = sandbox();
    const prog = { totalCorrect: 5, coins: { balance: 3, transactions: [{ createdAt: T1 }] } };
    store["kidsProgress.albert"] = JSON.stringify(prog);
    store["kidsTown.v1.albert"] = JSON.stringify(town(4, T1));
    let pushed = null, restored = 0;
    ctx.cloudPeek = async () => ({ progress: prog, island: { _town: town(7, T2) } });
    ctx.cloudSave = s => { pushed = JSON.parse(store["kidsTown.v1." + s]).rev; };
    ctx.cloudSyncOnOpen("albert", () => restored++);
    await new Promise(r => setTimeout(r, 20));
    ok("拉下別台較新的小鎮", JSON.parse(store["kidsTown.v1.albert"]).rev === 7);
    ok("推上去的是合併後的", pushed === 7, pushed);
    ok("通知頁面重載", restored === 1);
  }
  {
    // 本機小鎮較新 → 不動本機，直接推
    const { ctx, store } = sandbox();
    const prog = { totalCorrect: 5, coins: { balance: 3, transactions: [{ createdAt: T1 }] } };
    store["kidsProgress.albert"] = JSON.stringify(prog);
    store["kidsTown.v1.albert"] = JSON.stringify(town(8, T2));
    let pushed = null, restored = 0;
    ctx.cloudPeek = async () => ({ progress: prog, island: { _town: town(3, T1) } });
    ctx.cloudSave = s => { pushed = JSON.parse(store["kidsTown.v1." + s]).rev; };
    ctx.cloudSyncOnOpen("albert", () => restored++);
    await new Promise(r => setTimeout(r, 20));
    ok("本機較新：推本機那份", pushed === 8 && restored === 0);
  }

  console.log("\n" + (fail ? "❌" : "✅") + " pass " + pass + " / fail " + fail);
  process.exit(fail ? 1 : 0);
})();
