// 四季小鎮規則測試。用法: node kids/tools/test_town_core.js
// 鎖住設計報告裡孩子會直接感受到的規則：體力上限、作物隔日成長、不枯死、價格不加成。
const T = require("../town/town_core.js");
const C = require("../town/town_content.js");

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ " + name + (extra !== undefined ? "  → " + JSON.stringify(extra) : "")); }
}
const eq = (name, got, want) => ok(name + " = " + JSON.stringify(want), JSON.stringify(got) === JSON.stringify(want), got);
const fresh = () => T.newState("test", "2026-10-05");
const give = (st, n, day) => { for (let i = 0; i < n; i++) T.grant(st, "t" + Math.random(), 10, day || "2026-10-05"); };

console.log("\n── 日期與季節 ──");
eq("9/20 那週是秋", T.season("2026-09-20"), "秋");
eq("9/27 那週是冬", T.season("2026-09-30"), "冬");
eq("10/4 那週是春", T.season("2026-10-10"), "春");
eq("10/11 那週是夏", T.season("2026-10-11"), "夏");
eq("10/18 回到秋", T.season("2026-10-18"), "秋");
eq("週六算新的體力週", T.apWeek("2026-10-10"), "2026-10-10");
eq("週五還在上一週", T.apWeek("2026-10-09"), "2026-10-03");
eq("課表週從週日開始", T.contentWeek("2026-10-08"), "2026-10-04");

console.log("\n── 體力：三條規則 ──");
{
  const st = fresh();
  const r = T.grant(st, "daily:2026-10-05", 10, "2026-10-05");
  ok("完成一份 +10", r.ok && r.amount === 10);
  ok("同一份不能領兩次", !T.grant(st, "daily:2026-10-05", 10, "2026-10-05").ok);
  for (let d = 6; d <= 9; d++) T.grant(st, "daily:2026-10-0" + d, 10, "2026-10-0" + d);
  eq("5 份共 50", T.apTotal(st), 50);
  T.grant(st, "a", 10, "2026-10-09"); T.grant(st, "b", 10, "2026-10-09");
  eq("第 7 份到 70", T.apTotal(st), 70);
  const r8 = T.grant(st, "c", 10, "2026-10-09");
  ok("第 8 份超過週上限不給", r8.ok && r8.amount === 0 && r8.capped);
  eq("體力條最多 60", st.energy.wallet, 60);
  eq("超過的進儲備", st.energy.reserve, 10);
  const r9 = T.grant(st, "d", 10, "2026-10-10");
  ok("週六換週後又能拿", r9.amount === 10);
  T.spend(st, 25);
  eq("用掉之後從儲備補回體力條", [st.energy.wallet, st.energy.reserve], [55, 0]);
  ok("不夠就不能花", !T.spend(st, 999) && T.apTotal(st) === 55);
}

console.log("\n── 從練習紀錄補發體力 ──");
{
  const st = fresh();
  const prog = { coins: { claimedDrills: {
    "2026-10-02::2026-10-02-vocab": {}, "2026-10-05::2026-10-05-vocab": {}, "2026-10-06::2026-10-06-vocab": {} } } };
  eq("上線日之前的不補", T.syncFromProgress(st, prog), 20);
  eq("重開頁面不重複補", T.syncFromProgress(st, prog), 0);
  eq("總共 20", T.apTotal(st), 20);
}

console.log("\n── 作物：隔天才長、不枯死 ──");
{
  const st = fresh(); give(st, 3);
  const f = st.farm.fields[0];
  ok("沒有付費種子不能種紅蘿蔔", !T.plant(st, f.id, "carrot", "2026-10-05", C).ok);
  ok("稻米種子免費", T.plant(st, f.id, "rice", "2026-10-05", C).ok);
  eq("播種花 2 體力", T.apTotal(st), 28);
  ok("照料一次", T.care(st, "2026-10-05", C).ok);
  ok("同一天不能再照料", !T.care(st, "2026-10-05", C).ok);
  eq("當天照料，當天不長", T.growth(f, "2026-10-05"), 0);
  eq("隔天長一階", T.growth(f, "2026-10-06"), 1);
  // 週二、週三沒來
  eq("沒照料就停住", T.growth(f, "2026-10-09"), 1);
  T.care(st, "2026-10-09", C);
  T.care(st, "2026-10-12", C);
  ok("第三次照料當天還沒熟", !T.isRipe(f, "2026-10-12"));
  ok("隔天成熟", T.isRipe(f, "2026-10-13"));
  ok("放一個月也不會枯掉", T.isRipe(f, "2026-11-20"));
  ok("成熟的不用再照料", !T.care(st, "2026-10-13", C).ok);
  const before = T.apTotal(st);
  ok("收成", T.harvest(st, f.id, "2026-10-13", C).ok);
  eq("收成不花體力", T.apTotal(st), before);
  eq("背包多一份稻米", st.inv.rice, 1);
  ok("第一次收成記進生活冊", Object.values(st.book).flat().some(e => /第一次收成/.test(e.text)));
}

console.log("\n── 照料是整片田一次 ──");
{
  const st = fresh(); give(st, 2);
  T.addField(st, 7, 3); T.addField(st, 10, 3);
  st.farm.fields.forEach(f => T.plant(st, f.id, "rice", "2026-10-05", C));
  const ap = T.apTotal(st);
  T.care(st, "2026-10-05", C);
  eq("三片田只花 1 體力", ap - T.apTotal(st), 1);
  ok("三片都記到今天", st.farm.fields.every(f => f.careDates.includes("2026-10-05")));
}

console.log("\n── 地圖 ──");
{
  const st = fresh();
  ok("不能蓋在河上", !T.addField(st, 4, 9).ok);
  ok("不能蓋在家上", !T.addField(st, 0, 0).ok);
  ok("不能跟別的田重疊", !T.addField(st, 5, 4).ok);
  for (let i = 0; i < 7; i++) T.addField(st, 2 + (i % 4) * 3 + 2, 6 + Math.floor(i / 4) * 2);
  eq("最多 8 片", st.farm.fields.length, 8);
  ok("第 9 片不行", !T.addField(st, 13, 1).ok);
  const f = st.farm.fields[0]; give(st, 1);
  T.plant(st, f.id, "rice", "2026-10-05", C); T.care(st, "2026-10-05", C);
  ok("可以搬田", T.move(st, f.id, 13, 1).ok);
  ok("搬了作物和成長紀錄跟著走", f.crop === "rice" && f.careDates.length === 1);
}

console.log("\n── 買賣與委託不加成 ──");
{
  const st = fresh(); st.money = 3; st.inv.carrot = 2;
  ok("買紅蘿蔔種子 1 幣", T.buy(st, "carrot_seed", 1, C).ok && st.money === 2 && st.inv.carrot_seed === 1);
  ok("錢不夠買裝飾", !T.buy(st, "lantern", 1, C).ok);
  const card = C.WEEKS["2026-10-04"].cards.find(c => c.type === "quest");
  const m = st.money;
  ok("交委託", T.deliver(st, card, "2026-10-05", C).ok);
  eq("委託付的錢＝直接賣掉的價值", st.money - m, C.SELL.carrot * 2);
  ok("同一個委託不能交兩次", !T.deliver(st, card, "2026-10-05", C).ok);
}

console.log("\n── 廣場修復 ──");
{
  const st = fresh(); give(st, 1); st.money = 25; st.inv.rice = 2; st.inv.wood = 4;
  ok("木材不夠修不了", !T.repair(st, "plaza", "2026-10-05", C).ok);
  st.inv.wood = 5;
  ok("材料齊了可以修", T.repair(st, "plaza", "2026-10-05", C).ok);
  eq("扣掉 6 體力 20 幣 2 作物 5 木材", [T.apTotal(st), st.money, st.inv.rice, st.inv.wood], [4, 5, 0, 0]);
  eq("廣場到第 1 階", st.town.plaza, 1);
}

console.log("\n── 經濟上限：每 1 體力最多賺 2 幣 ──");
{
  // 最有效率的種法：8 片田一起種、一起照料 3 天、收成全賣
  const st = fresh(); give(st, 7); st.money = 8; st.inv.carrot_seed = 0;
  for (let i = 0; i < 7; i++) T.addField(st, 2 + (i % 4) * 3 + 2, 6 + Math.floor(i / 4) * 2);
  T.buy(st, "carrot_seed", 8, C);
  const ap0 = T.apTotal(st), m0 = st.money + 8;      // 種子錢也算成本
  st.farm.fields.forEach(f => T.plant(st, f.id, "carrot", "2026-10-05", C));
  ["2026-10-05", "2026-10-06", "2026-10-07"].forEach(d => T.care(st, d, C));
  st.farm.fields.forEach(f => T.harvest(st, f.id, "2026-10-08", C));
  T.sell(st, "carrot", 8, C);
  const apUsed = ap0 - T.apTotal(st), net = st.money - m0;
  ok("淨收益 ≤ 2 幣／體力（實際 " + (net / apUsed).toFixed(2) + "）", net / apUsed <= 2, { net, apUsed });
}

console.log("\n── 心事件 ──");
{
  const st = fresh();
  const W1 = C.WEEKS["2026-10-04"], story = W1.story;
  ok("沒讀信不能完成故事", !T.finishStory(st, story, "2026-10-05").ok);
  T.readCard(st, W1.cards.find(c => c.id === story.needCard), "2026-10-05");
  ok("讀完信可以完成", T.finishStory(st, story, "2026-10-05").ok);
  eq("Mia 亮一顆心", st.hearts.Mia, 1);
  ok("同一段不能重複亮心", !T.finishStory(st, story, "2026-10-06").ok);
  const s2 = C.WEEKS["2026-10-11"].story;
  st.cards[s2.needCard] = { readAt: "2026-10-05" };
  ok("下週的故事這週不能完成（就算偷改已讀）", !T.finishStory(st, s2, "2026-10-08").ok);
  ok("下週的委託這週不能交", !T.deliver(st, C.WEEKS["2026-10-11"].cards.find(c => c.quest), "2026-10-08", C).ok);
}

console.log("\n── 審查修正：體力按完成日 ──");
{
  const st = fresh();
  const claimed = {};
  ["05", "06", "07", "08", "09", "12", "13", "14"].forEach(d => {
    claimed["2026-10-" + d + "::2026-10-" + d + "-vocab"] = { claimedAt: "2026-10-19T03:00:00.000Z" };
  });
  eq("同一天補做 8 份舊題，只拿得到那週的 70", T.syncFromProgress(st, { coins: { claimedDrills: claimed } }), 70);
  const st2 = fresh();
  eq("上線前的題目在上線後才做，照樣給", T.syncFromProgress(st2, { coins: { claimedDrills: {
    "2026-10-02::2026-10-02-vocab": { claimedAt: "2026-10-05T02:00:00.000Z" } } } }), 10);
  const st3 = fresh();
  eq("同一天兩份不同練習各算一份", T.syncFromProgress(st3, { coins: { claimedDrills: {
    "2026-10-05::2026-10-05-vocab": {}, "2026-10-05::2026-10-05-grammar": {} } } }), 20);
  // 台北凌晨 1 點完成（UTC 前一天 17:00），算台北那一天
  const st4 = fresh();
  T.syncFromProgress(st4, { coins: { claimedDrills: { "2026-10-10::2026-10-10-vocab": { claimedAt: "2026-10-09T17:00:00.000Z" } } } });
  ok("UTC 時戳換成台北日期（週六凌晨算新的一週）", Object.keys(st4.energy.byWeek)[0] === "2026-10-10", st4.energy.byWeek);
}

console.log("\n── 審查修正：照料一天只收一次 ──");
{
  const st = fresh(); give(st, 1);
  T.plant(st, st.farm.fields[0].id, "rice", "2026-10-05", C);
  T.care(st, "2026-10-05", C);
  T.addField(st, 8, 3); T.plant(st, st.farm.fields[1].id, "rice", "2026-10-05", C);
  const ap = T.apTotal(st);
  ok("後來種的也能照料", T.care(st, "2026-10-05", C).ok);
  eq("但不再扣體力", T.apTotal(st), ap);
}

console.log("\n── 審查修正：數量必須是正整數 ──");
{
  const st = fresh();
  ok("負數購買被擋", !T.buy(st, "carrot_seed", -100, C).ok && st.money === 0);
  ok("小數被擋", !T.buy(st, "carrot_seed", 0.5, C).ok);
  ok("字串被擋", !T.sell(st, "rice", "3", C).ok);
}

console.log("\n── 審查修正：存檔讀寫 ──");
{
  const mem = new Map(), S = { getItem: k => mem.has(k) ? mem.get(k) : null, setItem: (k, v) => mem.set(k, String(v)) };
  mem.set("kidsTown.v1.test", "{壞掉的 JSON");
  const r = T.load(S, "test", "2026-10-05", C);
  ok("壞存檔回報問題", !!r.problem);
  ok("壞存檔有另存備份", [...mem.keys()].some(k => k.startsWith("kidsTown.v1.test.broken.")));
  ok("原本那份還沒被覆蓋", mem.get("kidsTown.v1.test") === "{壞掉的 JSON");
  const evil = T.newState("test", "2026-10-05");
  evil.money = '<img src=x onerror="alert(1)">'; evil.farm.fields[0].id = "f1');alert(1);('";
  evil.farm.decor.push({ id: "d9", type: "<b>", x: 3, y: 3 });
  const n = T.normalize(JSON.parse(JSON.stringify(evil)), "test", "2026-10-05", C);
  ok("金額夾帶的文字被清成數字", n.money === 0);
  ok("不合格式的田 id 被丟掉", n.farm.fields.length === 0);
  ok("不存在的裝飾類型被丟掉", n.farm.decor.length === 0);
  let threw = false; try { T.normalize({ schemaVersion: 1, student: "albert" }, "test", "2026-10-05", C); } catch (e) { threw = true; }
  ok("別人的存檔匯入會被拒絕", threw);
  const partial = T.normalize({ schemaVersion: 1, student: "test" }, "test", "2026-10-05", C);
  ok("缺欄位的存檔補成完整狀態", partial.energy && Array.isArray(partial.farm.fields) && partial.inv.rice === 0);
  // 兩個分頁
  mem.clear();
  const a = T.load(S, "test", "2026-10-05", C).st; T.save(S, a);
  const b = T.load(S, "test", "2026-10-05", C).st;
  give(a, 1); T.save(S, a);
  give(b, 1);
  ok("B 分頁晚存會被擋下，不會蓋掉 A", T.save(S, b).conflict === true);
}


console.log("\n── 內容完整性 ──");
Object.entries(C.WEEKS).forEach(([wk, w]) => {
  eq(wk + " 一週 5 張卡", w.cards.length, 5);
  ok(wk + " 卡片 id 不重複", new Set(w.cards.map(c => c.id)).size === 5);
  ok(wk + " 委託要的作物存在", w.cards.filter(c => c.quest).every(c => C.CROPS[c.quest.item]));
  ok(wk + " 故事的前置卡存在", w.cards.some(c => c.id === w.story.needCard));
  ok(wk + " 週次是週日", T.contentWeek(wk) === wk);
});

console.log(`\n${fail === 0 ? "✅" : "❌"} pass ${pass} / fail ${fail}\n`);
process.exit(fail ? 1 : 0);
