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

console.log("\n── 作物：照天數成熟、照料加豐收機率 ──");
{
  const st = fresh(); give(st, 3);
  const f = st.farm.fields[0];
  ok("沒有付費種子不能種紅蘿蔔", !T.plant(st, f.id, "carrot", "2026-10-05", C).ok);
  ok("稻米種子免費", T.plant(st, f.id, "rice", "2026-10-05", C).ok);
  eq("播種花 2 體力", T.apTotal(st), 28);
  eq("種下當天是第 0 天", T.growth(f, "2026-10-05"), 0);
  eq("不照料也會長：隔天第 1 天", T.growth(f, "2026-10-06"), 1);
  ok("第 2 天還沒熟", !T.isRipe(f, "2026-10-07"));
  ok("種下 3 天後成熟（完全沒照料）", T.isRipe(f, "2026-10-08"));
  ok("放一個月也不會枯掉", T.isRipe(f, "2026-11-20"));
  eq("沒照料：收成 2 個的機率 0%", T.doubleChance(f, C), 0);
  ok("成熟的不用再照料", !T.care(st, "2026-10-08", C).ok);
  const before = T.apTotal(st);
  const r = T.harvest(st, f.id, "2026-10-08", C);
  ok("收成", r.ok && r.n === 1, r);
  eq("收成不花體力", T.apTotal(st), before);
  eq("沒照料就是 1 個", st.inv.rice, 1);
  ok("第一次收成記進生活冊", Object.values(st.book).flat().some(e => /第一次收成/.test(e.text)));
}
{
  const st = fresh(); give(st, 3);
  const f = st.farm.fields[0];
  T.plant(st, f.id, "rice", "2026-10-05", C);
  ok("照料一次", T.care(st, "2026-10-05", C).ok);
  ok("同一天不能再照料", !T.care(st, "2026-10-05", C).ok);
  eq("照料 1 天：10%", T.doubleChance(f, C), 10);
  T.care(st, "2026-10-06", C); T.care(st, "2026-10-07", C);
  eq("照料 3 天：30%", T.doubleChance(f, C), 30);
  ok("照料不會讓它早熟", !T.isRipe(f, "2026-10-07") && T.isRipe(f, "2026-10-08"));
  ok("成熟那天起不能再照料", !T.care(st, "2026-10-08", C).ok);
  eq("最多 30%", T.doubleChance(f, C), 30);
}
{
  // 豐收是固定擲骰：機率 p% 的田，大約 p% 會收成 2 個；重新整理也不會變
  const st = fresh();
  let two = 0, N = 2000;
  for (let i = 0; i < N; i++) {
    const f = { id: "f" + i, crop: "rice", plantedDate: "2026-10-05", careDates: ["2026-10-05", "2026-10-06", "2026-10-07"], days: 3 };
    if (T.roll(st, f) < T.doubleChance(f, C)) two++;
  }
  ok("30% 的田大約三成收 2 個（實際 " + (two / N * 100).toFixed(1) + "%）", Math.abs(two / N - 0.3) < 0.04);
  const f = { id: "f9", crop: "rice", plantedDate: "2026-10-05", careDates: [], days: 3 };
  ok("同一片田擲幾次都一樣", T.roll(st, f) === T.roll(st, f));
  // 找一片會中的田，確認真的收 2 個
  const s2 = fresh(); give(s2, 3);
  const g = s2.farm.fields[0];
  let day = 5;
  for (; day < 60; day++) { g.crop = "rice"; g.plantedDate = "2026-10-" + String(day).padStart(2, "0"); if (T.roll(s2, g) < 30) break; }
  g.crop = null;
  const d0 = "2026-10-" + String(day).padStart(2, "0");
  T.plant(s2, g.id, "rice", d0, C);
  [0, 1, 2].forEach(k => { s2.farm.lastCare = null; T.care(s2, T.addDays(d0, k), C); });
  const r = T.harvest(s2, g.id, T.addDays(d0, 3), C);
  ok("骰中了：大豐收收 2 個", r.n === 2 && s2.inv.rice === 2 && /大豐收/.test(r.msg), r);
}
{
  const st = fresh(); give(st, 3); st.inv.pumpkin_seed = 1;
  ok("市集還沒修，南瓜不能種", !T.plant(st, st.farm.fields[0].id, "pumpkin", "2026-10-05", C).ok);
  ok("也不能買種子", (st.money = 10, !T.buy(st, "pumpkin_seed", 1, C).ok));
  st.town.plaza = 3; st.town.market = 1;
  ok("市集第 1 階修好就能買", T.buy(st, "pumpkin_seed", 1, C).ok);
  const f = st.farm.fields[0];
  ok("南瓜種下去", T.plant(st, f.id, "pumpkin", "2026-10-05", C).ok);
  ok("南瓜要 4 天", !T.isRipe(f, "2026-10-08") && T.isRipe(f, "2026-10-09"));
  ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08"].forEach(d => T.care(st, d, C));
  eq("4 天作物照料滿是 40%", T.doubleChance(f, C), 40);
  // 匯入的存檔塞了一堆重複或範圍外的照料日、亂寫成熟天數 → 整理掉
  const raw = JSON.parse(JSON.stringify(st));
  raw.farm.fields[0].careDates = Array(10).fill("2026-10-05").concat(["2026-10-01", "2026-10-20"]);
  raw.farm.fields[0].days = 1;
  const n = T.normalize(raw, "test", "2026-10-06", C), g = n.farm.fields[0];
  ok("匯入：重複照料日去掉、範圍外的不算", g.careDates.length === 1 && T.doubleChance(g, C) === 10, g.careDates);
  ok("匯入：成熟天數照作物表", g.days === 4 && !T.isRipe(g, "2026-10-06"));
  ok("噴水池要市集第 2 階", !T.buy(st, "fountain", 1, C).ok);
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

console.log("\n── 廣場任務：每階 5 個、同時開放 ──");
{
  const L = C.LANDMARKS.plaza;
  eq("廣場有 3 階", L.stages.length, 3);
  ok("每階剛好 5 個任務", L.stages.every(sg => sg.tasks.length === 5));
  ok("外觀比階段多一張（含還沒修）", L.look.length === L.stages.length + 1);
  const ids = L.stages.flatMap(sg => sg.tasks.map(t => t.id));
  ok("任務 id 不重複", new Set(ids).size === ids.length);
  ok("每個任務的人都是村民、東西都認得", L.stages.every(sg => sg.tasks.every(t => C.VILLAGERS[t.by] && t.need.n > 0 &&
    (t.need.item === "ap" || t.need.item in T.newState("x", "2026-10-05").inv || C.DECOR[t.need.item]))));
  // 照著任務做一定會搬來：某位村民第一次出任務的那一階之前，只靠任務拿到的繁榮度要過他的門檻
  const P = C.PROSPERITY, per = 5 * P.task + P.stage;
  let before = 0;
  Object.keys(C.LANDMARKS).forEach(k => C.LANDMARKS[k].stages.forEach((sg, i) => {
    sg.tasks.forEach(t => {
      const a = C.VILLAGERS[t.by].arrive || 0;
      ok(`${k} 第 ${i + 1} 階 ${t.by} 的任務：前面的任務保證夠他搬來（${before} ≥ ${a}）`, before >= a);
    });
    before += per;
  }));
  const last = Object.keys(C.VILLAGERS).map(v => C.VILLAGERS[v].arrive || 0).sort((a, b) => b - a)[0];
  ok("所有地標修完，最後一位村民一定會來", before >= last);
}
{
  const st = fresh(); give(st, 7);
  const g = T.stageView(st, "plaza", C);
  eq("一開始 5 個都沒交", g.left, 5);
  ok("合計需求有木材 4、石頭 3", g.parts.some(x => x.k === "wood" && x.need === 4) && g.parts.some(x => x.k === "stone" && x.need === 3));
  eq("撿木材的上限是這一階要的量", T.materialNeed(st, "wood", C), 4);
  for (let i = 0; i < 4; i++) T.gather(st, "wood", "2026-10-05", C);
  const ap = T.apTotal(st);
  ok("第 5 份木材不給撿", !T.gather(st, "wood", "2026-10-05", C).ok);
  eq("也不扣體力", T.apTotal(st), ap);
  ok("交木材任務", T.doTask(st, "plaza", "p1-wood", "2026-10-05", C).ok);
  eq("木材扣掉了", st.inv.wood, 0);
  eq("交完就不再需要木材", T.materialNeed(st, "wood", C), 0);
  ok("同一個任務不能交兩次", !T.doTask(st, "plaza", "p1-wood", "2026-10-05", C).ok);
  eq("Leo 好感 +1", st.hearts.Leo, 1);
  eq("繁榮度 = 任務 10 + 好感 3", T.prosperity(st, C), 13);
  ok("別階的任務現在不能交", !T.doTask(st, "plaza", "p2-stone", "2026-10-05", C).ok);
  const a0 = T.apTotal(st);
  ok("出力任務直接扣體力", T.doTask(st, "plaza", "p1-weeds", "2026-10-05", C).ok && T.apTotal(st) === a0 - 4);
  const r = T.doTask(st, "plaza", "p1-flowers", "2026-10-05", C);
  ok("背包沒有花圃交不了，還會提醒可以收回", !r.ok && r.msg.includes("收回"), r.msg);
  st.decorOwned.flowers = 1; T.placeDecor(st, "flowers", 12, 2, "2026-10-05", C);
  ok("擺在農莊的不算", !T.doTask(st, "plaza", "p1-flowers", "2026-10-05", C).ok);
  T.storeDecor(st, st.farm.decor[0].id);
  ok("收回背包就能交", T.doTask(st, "plaza", "p1-flowers", "2026-10-05", C).ok && st.decorOwned.flowers === 0);
  st.inv.stone = 3; st.inv.carrot = 2;
  ok("交第 4 個", T.doTask(st, "plaza", "p1-stone", "2026-10-05", C).ok);
  eq("還沒滿 5 個不會升階", st.town.plaza, 0);
  ok("Nora 還沒搬來", !T.isResident(st, "Nora", C));
  const fin = T.doTask(st, "plaza", "p1-carrot", "2026-10-05", C);
  ok("第 5 個交完：升到第 2 階", fin.stageDone && st.town.plaza === 1, fin);
  ok("繁榮度過 60，Nora 搬來", fin.arrived.includes("Nora") && T.isResident(st, "Nora", C), fin);
  eq("繁榮度 = 5 任務 + 1 階 + 5 顆心", T.prosperity(st, C), 50 + 20 + 15);
  ok("第 2 階的需求換成石頭", T.materialNeed(st, "stone", C) === 5 && T.materialNeed(st, "wood", C) === 0);
  const g2 = T.nextGoal(st, C);
  ok("下一個目標是第 2 階", g2.stage === 1 && g2.left === 5 && g2.title === "石板路與燈籠", g2);
}
{
  const st = fresh();
  st.town.plaza = 1; st.inv.rice = 3;
  ok("還沒搬來的村民不能交任務", !T.doTask(st, "plaza", "p2-rice", "2026-10-05", C).ok);
  T.arrive(st, "2026-10-05", C);
  ok("前一階修好就夠 Nora 搬來", T.isResident(st, "Nora", C));
  ok("廣場沒修完，市集不能交", (st.inv.wood = 5, !T.doTask(st, "market", "m1-wood", "2026-10-05", C).ok));
  ok("廣場沒修完，市集的材料不算進撿材料上限", T.materialNeed(st, "wood", C) === 0);
  st.town.plaza = 3;
  ok("廣場三階修好：下一個目標換成市集", T.nextGoal(st, C).key === "market" && !T.doTask(st, "plaza", "p3-wood", "2026-10-05", C).ok);
  st.town.market = 3;
  ok("兩個地標都修好就沒有下一個目標", T.nextGoal(st, C) === null);
}

console.log("\n── 繁榮度與新村民 ──");
{
  const st = fresh();
  eq("一開始 0", T.prosperity(st, C), 0);
  ok("一開始只有 Mia、Leo", ["Mia", "Leo"].every(v => T.isResident(st, v, C)) && !["Nora", "Ben", "Sam"].some(v => T.isResident(st, v, C)));
  st.decorOwned.flowers = 30;
  for (let i = 0; i < 12; i++) T.placeDecor(st, "flowers", 4 + i % 8, 6 + Math.floor(i / 8), "2026-10-05", C);
  eq("裝飾最多算 10 件", T.prosperity(st, C), 20);
  st.hearts.Mia = 10; st.hearts.Leo = 10;
  const r = T.placeDecor(st, "flowers", 12, 8, "2026-10-05", C);
  ok("好感和裝飾也能讓村民早點來", T.prosperity(st, C) === 80 && T.isResident(st, "Nora", C) && r.arrived.includes("Nora"), r);
  st.farm.decor.slice().forEach(d => T.storeDecor(st, d.id));
  ok("收回裝飾、分數掉了，搬來的人也不會走", T.prosperity(st, C) === 60 && T.isResident(st, "Nora", C));
  const lv = T.prosperityLevel(st, C);
  ok("等級：60 是第 2 級，下一位是 Ben", lv.index === 1 && lv.next.at === 130 && lv.nextVillager === "Ben", lv);
}
{
  // 舊存檔：兩階制時修好兩階 → 讀進來是第 3 階，Nora、Ben 直接搬來
  const store = new Map(), S = { getItem: k => store.get(k) || null, setItem: (k, v) => store.set(k, v) };
  const old = fresh(); old.town.plaza = 2; delete old.tasks; delete old.residents;
  store.set(T.key("test"), JSON.stringify(old));
  const { st } = T.load(S, "test", "2026-10-09", C);
  ok("舊存檔修好兩階：現在在第 3 階", st.town.plaza === 2 && T.stageView(st, "plaza", C).title === "小舞台");
  ok("舊存檔讀進來，Nora、Ben 搬來、Sam 還沒", T.isResident(st, "Nora", C) && T.isResident(st, "Ben", C) && !T.isResident(st, "Sam", C));
  const raw = JSON.parse(JSON.stringify(st)); raw.tasks = { "p3-wood": { date: "2026-10-09" }, "evil<script>": { date: "x" } };
  raw.residents = { Sam: "2026-10-09", Mia: "2026-10-01", Nobody: "2026-10-01" };
  const n = T.normalize(raw, "test", "2026-10-09", C);
  ok("存檔整理：只留認得的任務", Object.keys(n.tasks).join() === "p3-wood");
  ok("存檔整理：只留後來搬來的村民", Object.keys(n.residents).join() === "Sam");
}

console.log("\n── 審查修正：匯入存檔的任務要對得上階段 ──");
{
  const base = JSON.parse(JSON.stringify(fresh()));
  const all1 = Object.fromEntries(C.LANDMARKS.plaza.stages[0].tasks.map(t => [t.id, { date: "2026-10-06" }]));
  const a = T.normalize(Object.assign({}, base, { tasks: all1 }), "test", "2026-10-09", C);
  ok("第 1 階 5 個都交了卻停在 0 階：整理後升到第 2 階", a.town.plaza === 1 && !Object.keys(a.tasks).length, a.town);
  const b = T.normalize(Object.assign({}, base, { tasks: { "p3-wood": { date: "2026-10-06" }, "p1-wood": { date: "2026-10-06" } } }), "test", "2026-10-09", C);
  ok("還沒開放的階段的任務不算", Object.keys(b.tasks).join() === "p1-wood" && T.prosperity(b, C) === 10);
  const c = T.normalize(Object.assign({}, base, { tasks: { constructor: { date: "2026-10-06" } }, residents: { constructor: "2026-10-06" } }), "test", "2026-10-09", C);
  ok("constructor 這種內建名字不會混進來", !Object.keys(c.tasks).length && !Object.keys(c.residents).length);
  const d = T.normalize(Object.assign({}, base, { stories: { "w1-story-mia": { done: "<img src=x onerror=alert(1)>" } },
    cards: { "w1-talk-mia": { readAt: "2026-10-06", choice: "<b>", evil: "x" } } }), "test", "2026-10-09", C);
  ok("故事完成日不是日期就丟掉", !("done" in d.stories["w1-story-mia"]));
  ok("卡片只留認得的欄位", JSON.stringify(d.cards["w1-talk-mia"]) === JSON.stringify({ readAt: "2026-10-06" }));
}

console.log("\n── 經濟：不照料每體力 2 幣，照料滿約 2.3 幣 ──");
{
  // 8 片紅蘿蔔一起種、收成全賣，算每 1 體力淨賺多少幣（種子錢也算成本）
  // 豐收用期望值算（固定擲骰的單次結果會跳），care＝照料幾天
  const run = (crop, care) => {
    const st = fresh(); give(st, 7); st.money = 8; st.town.plaza = 3; st.town.market = 3;
    for (let i = 0; i < 7; i++) T.addField(st, 2 + (i % 4) * 3 + 2, 6 + Math.floor(i / 4) * 2);
    const seed = C.CROPS[crop].freeSeed ? 0 : C.BUY[crop + "_seed"];
    if (seed) T.buy(st, crop + "_seed", 8, C);
    const ap0 = T.apTotal(st);
    st.farm.fields.forEach(f => T.plant(st, f.id, crop, "2026-10-05", C));
    for (let d = 0; d < care; d++) T.care(st, T.addDays("2026-10-05", d), C);
    const crops = st.farm.fields.reduce((n, f) => n + 1 + T.doubleChance(f, C) / 100, 0);
    return (crops * C.SELL[crop] - 8 * seed) / (ap0 - T.apTotal(st));
  };
  Object.keys(C.CROPS).forEach(k => {
    const days = C.CROPS[k].days || T.GROW_DAYS, r0 = run(k, 0), rMax = run(k, days);
    ok(k + " 不照料：每體力 ≤ 2 幣（實際 " + r0.toFixed(2) + "）", r0 <= 2.0001);
    ok(k + " 照料滿 " + days + " 天比較划算，但不超過 2.4（實際 " + rMax.toFixed(2) + "）", rMax > r0 && rMax <= 2.4001);
  });
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
