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
  ["a", "b", "c2", "c3", "c4"].forEach(id => T.grant(st, id, 10, "2026-10-09"));
  eq("第 10 份到 100", T.apTotal(st), 100);
  const r8 = T.grant(st, "c", 10, "2026-10-09");
  ok("第 11 份超過週上限不給", r8.ok && r8.amount === 0 && r8.capped);
  eq("體力條最多 60", st.energy.wallet, 60);
  eq("超過的進儲備", st.energy.reserve, 40);
  const r9 = T.grant(st, "d", 10, "2026-10-10");
  ok("週六換週後又能拿", r9.amount === 10);
  T.spend(st, 55);
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

console.log("\n── 本週加分：文法、單字、週測、作業 ──");
{
  const st = fresh();
  const prog = {
    coins: { claimedDrills: {} },
    grammar: { nodes: { "F4.6": { best: 5, lastAt: "2026-10-13" }, "F0.1": { best: 4, lastAt: "2026-09-01" } } },
    vocab: { units: { "l1-u01": { best: 6, lastAt: "2026-10-14" } } },
    weeklyTests: [{ week: "2026-10-10", at: "2026-10-16", correct: 18, total: 20 }],
    homework: { weeks: { "2026-10-10": { write: { w1: { text: "x", at: "2026-10-13" }, w2: { text: "y", at: "2026-10-14" } }, speak: { s1: { rate: 3, at: "2026-10-15" } } } } },
  };
  const got = T.syncFromProgress(st, prog);
  eq("文法 10＋單字 10＋週測 10＋作業 3 項 6＝36（上線前那課不算）", got, 36);
  eq("算在本週加分，不佔每日練習的額度", [st.energy.bonusByWeek["2026-10-10"], (st.energy.byWeek || {})["2026-10-10"] || 0], [36, 0]);
  eq("再同步一次不會重複發", T.syncFromProgress(st, prog), 0);
  ok("重做同一課（lastAt 變新）也不會再發", (prog.grammar.nodes["F4.6"].lastAt = "2026-10-15", T.syncFromProgress(st, prog) === 0));
  // 加分額度 40：再多一課只能拿到剩下的 4
  prog.grammar.nodes["F4.5"] = { best: 5, lastAt: "2026-10-15" };
  prog.vocab.units["l1-u02"] = { best: 5, lastAt: "2026-10-15" };
  eq("本週加分最多 40", T.syncFromProgress(st, prog), 4);
  eq("加分額度用完", st.energy.bonusByWeek["2026-10-10"], 40);
  // 每日練習的 100 還是自己算
  const days = {};
  ["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16", "2026-10-13b", "2026-10-14b", "2026-10-15b", "2026-10-12b", "2026-10-16b", "2026-10-12c"].forEach((d, i) => {
    days[d.slice(0, 10) + "::x" + i] = { claimedAt: d.slice(0, 10) + "T10:00:00" };
  });
  prog.coins.claimedDrills = days;
  eq("每日練習照樣拿滿 100", T.syncFromProgress(st, prog), 100);
  eq("一週最多 100＋40＝140", T.apTotal(st), 140);
  // 下一週的週測、作業是新的額度
  prog.weeklyTests.push({ week: "2026-10-17", at: "2026-10-23", correct: 15, total: 20 });
  eq("下週的週測另外算", T.syncFromProgress(st, prog), 10);
  ok("同一週的週測只算一次", (prog.weeklyTests.push({ week: "2026-10-17", at: "2026-10-23", correct: 20, total: 20 }), T.syncFromProgress(st, prog) === 0));
  // 模擬考：第一次交卷 +20，重考不再給
  const st2 = fresh();
  const p2 = { exams: { "midterm-2026-g6a": { at: "2026-10-19", best: 80, tries: 1 } } };
  eq("期中考模擬卷第一次交卷 +20", T.syncFromProgress(st2, p2), 20);
  ok("重考（tries、best 變了）不再給", (p2.exams["midterm-2026-g6a"].tries = 2, p2.exams["midterm-2026-g6a"].best = 95, T.syncFromProgress(st2, p2) === 0));
  eq("模擬考也算在本週加分", st2.energy.bonusByWeek["2026-10-17"], 20);
  // 存檔整理保留加分額度
  const n = T.normalize(JSON.parse(JSON.stringify(st)), "test", "2026-10-16", C);
  eq("存檔整理：加分額度留著", n.energy.bonusByWeek["2026-10-10"], 40);
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

console.log("\n── 修好一階多一片田 ──");
{
  const st = fresh(); give(st, 1);
  // 把空地從左到右、從上到下排滿 2×2 的田
  const spots = [];
  for (let y = 1; y <= 8; y += 2) for (let x = 2; x <= 14; x += 2) spots.push([x, y]);
  const fill = () => { for (const [x, y] of spots) { if (st.farm.fields.length >= T.maxFields(st)) break; T.addField(st, x, y); } };
  eq("一開始最多 8 片", T.maxFields(st), 8);
  fill();
  eq("開滿 8 片", st.farm.fields.length, 8);
  const r = T.addField(st, 2, 7);
  ok("第 9 片開不了，提示修小鎮可以多開", !r.ok && r.msg.includes("每修好一階"), r.msg);
  // 用任務修好廣場第 1 階
  ["p1-wood", "p1-weeds", "p1-stone", "p1-carrot"].forEach(id => st.tasks[id] = { date: "2026-10-05" });
  st.decorOwned.flowers = 1;
  const d = T.doTask(st, "plaza", "p1-flowers", "2026-10-05", C);
  ok("修好一階：回報多一片田", d.stageDone && d.moreFields && d.msg.includes("多開一片田"), d.msg);
  eq("上限變 9 片", T.maxFields(st), 9);
  fill();
  eq("開到第 9 片", st.farm.fields.length, 9);
  st.town.plaza = 3; st.town.market = 3;
  eq("修好 6 階：14 片", T.maxFields(st), 14);
  st.town.future = 5;                  // 之後的地標也算，但最多只多 8 片
  eq("最多 16 片", T.maxFields(st), 16);
  delete st.town.future;
  // 匯入的存檔塞了太多田 → 依修好的階數裁掉
  const raw = JSON.parse(JSON.stringify(st));
  raw.town = { plaza: 1 };
  raw.farm.fields = spots.slice(0, 16).map(([x, y], i) => ({ id: "f" + (100 + i), x, y, crop: null, careDates: [] }));
  const n = T.normalize(raw, "test", "2026-10-06", C);
  eq("匯入：只修好 1 階就只留 9 片", n.farm.fields.length, 9);
}

console.log("\n── 照料費：每 8 片田 1 體力 ──");
{
  const st = fresh(); give(st, 7); st.town.plaza = 3; st.town.market = 3;
  const spots = [];
  for (let y = 1; y <= 8; y += 2) for (let x = 2; x <= 14; x += 2) spots.push([x, y]);
  for (const [x, y] of spots) { if (st.farm.fields.length >= T.maxFields(st)) break; T.addField(st, x, y); }
  eq("14 片田", st.farm.fields.length, 14);
  st.farm.fields.slice(0, 8).forEach(f => T.plant(st, f.id, "rice", "2026-10-05", C));
  eq("8 片要照料：1 體力", T.careCost(st, "2026-10-05", C), 1);
  let ap = T.apTotal(st); T.care(st, "2026-10-05", C);
  eq("照料 8 片扣 1", ap - T.apTotal(st), 1);
  T.plant(st, st.farm.fields[8].id, "rice", "2026-10-05", C);
  eq("再種第 9 片：要補 1", T.careCost(st, "2026-10-05", C), 1);
  ap = T.apTotal(st); T.care(st, "2026-10-05", C);
  eq("補照料扣 1", ap - T.apTotal(st), 1);
  st.farm.fields.slice(9, 14).forEach(f => T.plant(st, f.id, "rice", "2026-10-05", C));
  eq("第 10～14 片還在 16 片以內：免費", T.careCost(st, "2026-10-05", C), 0);
  ap = T.apTotal(st);
  ok("免費照料", T.care(st, "2026-10-05", C).ok && T.apTotal(st) === ap);
  ok("全部 14 片都照料到了", st.farm.fields.every(f => T.caredToday(f, "2026-10-05")));
  eq("隔天 14 片：2 體力", T.careCost(st, "2026-10-06", C), 2);
  // 舊存檔：只有 lastCare 沒有 carePaid → 今天算付過 1 份
  const old = fresh(); give(old, 1); T.plant(old, old.farm.fields[0].id, "rice", "2026-10-05", C);
  old.farm.lastCare = "2026-10-05";
  eq("舊存檔今天照料過：再照料免費", T.careCost(old, "2026-10-05", C), 0);
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
  ok("夠了還是可以繼續撿", T.gather(st, "wood", "2026-10-05", C).ok);
  eq("多撿一份扣 2 體力", T.apTotal(st), ap - C.COST.gather);
  eq("背包有 5 份木材", st.inv.wood, 5);
  ok("交木材任務", T.doTask(st, "plaza", "p1-wood", "2026-10-05", C).ok);
  eq("交任務只扣 4 份，多的留著", st.inv.wood, 1);
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
  ok("修好一階拿到階段紀念照", fin.stagePhoto === "plaza-1" && st.stagePhotos["plaza-1"] === "2026-10-05", fin);
  ok("繁榮度過 60，Nora 搬來", fin.arrived.includes("Nora") && T.isResident(st, "Nora", C), fin);
  eq("繁榮度 = 5 任務 + 1 階 + 5 顆心（階段照不另外加）", T.prosperity(st, C), 50 + 20 + 15);
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
  ok("廣場沒修完，市集的材料不算進目前需求", T.materialNeed(st, "wood", C) === 0);
  st.town.plaza = 3;
  ok("廣場三階修好：下一個目標換成市集", T.nextGoal(st, C).key === "market" && !T.doTask(st, "plaza", "p3-wood", "2026-10-05", C).ok);
  st.town.market = 3;
  ok("市集修好：下一個目標換成海邊碼頭", T.nextGoal(st, C).key === "harbor" && T.landmarkOpen(st, "harbor", C));
  ok("碼頭第 1 階有交小鎮幣的任務", T.stageView(st, "harbor", C).parts.some(x => x.k === "money" && x.need === 6));
  ok("碼頭沒修好前買不到海灘傘", !T.buy((st.money = 100, st), "parasol", 1, C).ok);
  st.town.harbor = 1;
  ok("碼頭第 1 階修好開賣海灘傘、還不賣小帆船", T.buy(st, "parasol", 1, C).ok && !T.buy(st, "boat", 1, C).ok);
  st.town.harbor = 3;
  ok("碼頭修好：下一個目標換成小鎮餐廳", T.nextGoal(st, C).key === "restaurant" && T.landmarkOpen(st, "restaurant", C));
  ok("餐廳沒修好前買不到番茄種子", !T.buy(st, "tomato_seed", 1, C).ok);
  ok("餐廳第 1 階要鐵礦", T.stageView(st, "restaurant", C).parts.some(x => x.k === "iron" && x.need === 2));
  st.town.restaurant = 1;
  ok("餐廳第 1 階修好開賣番茄種子", T.buy(st, "tomato_seed", 1, C).ok);
  ok("餐廳第 2 階的需求有番茄", T.stageView(st, "restaurant", C).parts.some(x => x.k === "tomato" && x.need === 3));
  st.town.restaurant = 3;
  ok("四個地標都修好就沒有下一個目標", T.nextGoal(st, C) === null);
}

console.log("\n── 作物不夠：用小鎮幣補齊（每個賣價＋1） ──");
{
  const st = fresh(); st.inv.carrot = 1; st.money = 5;
  const fc = T.fillCost(st, "carrot", 2, C);
  ok("只補差的 1 個，每個 5＋1＝6", fc.missing === 1 && fc.each === 6 && fc.cost === 6, fc);
  const r = T.doTask(st, "plaza", "p1-carrot", "2026-10-05", C, { buy: true });
  ok("錢不夠補不了", !r.ok && r.msg.includes("小鎮幣不夠"), r.msg);
  ok("失敗時什麼都沒扣", st.money === 5 && st.inv.carrot === 1 && !st.tasks["p1-carrot"]);
  ok("不帶 buy 不會自動花錢", (st.money = 20, !T.doTask(st, "plaza", "p1-carrot", "2026-10-05", C).ok && st.money === 20));
  const r2 = T.doTask(st, "plaza", "p1-carrot", "2026-10-05", C, { buy: true });
  ok("補齊後交出", r2.ok && st.tasks["p1-carrot"] && r2.msg.includes("花 6 小鎮幣補了 1 個"), r2.msg);
  eq("扣 6 幣、自己的那根也用掉", [st.money, st.inv.carrot], [14, 0]);
  ok("木材不能用錢補", T.fillCost(st, "wood", 4, C) === null && !T.doTask(st, "plaza", "p1-wood", "2026-10-05", C, { buy: true }).ok);
  ok("裝飾不走這條（要去商店買）", T.fillCost(st, "flowers", 1, C) === null);
  ok("市集還沒修，南瓜不能補", T.fillCost(st, "pumpkin", 2, C) === null);
  // 委託也可以補：補的價錢比委託付的多 1，所以不能拿來賺錢
  const card = C.WEEKS["2026-10-04"].cards.find(c => c.type === "quest");
  const m0 = st.money;
  const d = T.deliver(st, card, "2026-10-05", C, { buy: true });
  ok("委託：全部用錢補也能交", d.ok && st.quests[card.id], d.msg);
  eq("委託：每個淨虧 1 幣，補 2 個少 2", m0 - st.money, 2);
  // 期望值：自己種一個要 2 體力（約 4 幣），補一個要 6 幣，所以種比較划算
  ok("補的價錢永遠比賣價高", Object.keys(C.CROPS).every(k => C.SELL[k] + C.FILL_EXTRA > C.SELL[k]));
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
  const run = (crop, care, nf = 8) => {
    const st = fresh(); give(st, 7); st.money = 16; st.town.plaza = 3; st.town.market = 3; st.town.harbor = 3; st.town.restaurant = 1; st.town.more = 2;
    for (let y = 1; y <= 8 && st.farm.fields.length < nf; y += 2) for (let x = 2; x <= 14 && st.farm.fields.length < nf; x += 2) T.addField(st, x, y);
    const seed = C.CROPS[crop].freeSeed ? 0 : C.BUY[crop + "_seed"];
    if (seed) T.buy(st, crop + "_seed", nf, C);
    const ap0 = T.apTotal(st);
    st.farm.fields.forEach(f => T.plant(st, f.id, crop, "2026-10-05", C));
    for (let d = 0; d < care; d++) T.care(st, T.addDays("2026-10-05", d), C);
    const crops = st.farm.fields.reduce((n, f) => n + 1 + T.doubleChance(f, C) / 100, 0);
    return (crops * C.SELL[crop] - nf * seed) / (ap0 - T.apTotal(st));
  };
  Object.keys(C.CROPS).forEach(k => {
    const days = C.CROPS[k].days || T.GROW_DAYS, r0 = run(k, 0), rMax = run(k, days);
    ok(k + " 不照料：每體力 ≤ 2 幣（實際 " + r0.toFixed(2) + "）", r0 <= 2.0001);
    ok(k + " 照料滿 " + days + " 天比較划算，但不超過 2.4（實際 " + rMax.toFixed(2) + "）", rMax > r0 && rMax <= 2.4001);
    const r16 = run(k, days, 16);
    ok(k + " 開到 16 片、照料滿也不超過 2.4（實際 " + r16.toFixed(2) + "）", r16 <= 2.4001);
  });
}

console.log("\n── 釣魚 ──");
{
  ok("每種魚都在背包欄位裡", Object.keys(C.FISH).concat(Object.keys(C.MINERALS)).every(k => k in fresh().inv));
  ok("每一季都有普通、少見、稀有各一種", ["春", "夏", "秋", "冬"].every(s => {
    const tiers = Object.keys(C.FISH).filter(k => C.FISH[k].seasons.includes(s)).map(k => C.FISH[k].tier).sort().join();
    return tiers === "common,rare,uncommon";
  }));
  const st = fresh(); give(st, 1);
  const d = "2026-10-12";                      // 10/11 那週是夏季
  eq("10/12 是夏季", T.season(d), "夏");
  ok("夏天釣得到蝦子、鮪魚、河豚", Object.keys(T.fishTable(d, C)).sort().join() === "pufferfish,shrimp,tuna");
  const ap = T.apTotal(st);
  ok("沒甩竿不能收竿", !T.fish(st, d, C, true, 0.1).ok);
  ok("甩竿就扣 2 體力", T.cast(st, d, C).ok && T.apTotal(st) === ap - 2 && st.cast);
  ok("竿子在水裡再甩不會再扣（關頁面再回來）", T.cast(st, d, C).resumed && T.apTotal(st) === ap - 2);
  const miss = T.fish(st, d, C, false, 0.1);
  ok("沒按中：沒有魚，竿子收回來", miss.ok && miss.caught === null && !st.cast && T.apTotal(st) === ap - 2);
  ok("同一竿不能收兩次", !T.fish(st, d, C, true, 0.1).ok);
  T.cast(st, d, C);
  const ap2 = T.apTotal(st);
  ok("放棄：不退體力", T.giveUp(st).ok && !st.cast && T.apTotal(st) === ap2);
  T.cast(st, d, C);
  const a = T.fish(st, d, C, true, 0.1);
  ok("按中：r 小抽到普通的蝦子，第一次記圖鑑", a.caught === "shrimp" && a.first && st.inv.shrimp === 1 && st.dex.shrimp === 1, a);
  ok("第一次釣到記進生活冊", Object.values(st.book).flat().some(e => /第一次釣到蝦子/.test(e.text)));
  T.cast(st, d, C);
  const b = T.fish(st, d, C, true, 0.95);
  ok("r 大抽到稀有的河豚", b.caught === "pufferfish", b);
  T.cast(st, d, C);
  const c2 = T.fish(st, d, C, true, 0.1);
  ok("第二次就不是新圖鑑", !c2.first && st.dex.shrimp === 2);
  st.energy.wallet = 1; st.energy.reserve = 0;
  ok("體力不夠不能甩竿", !T.cast(st, d, C).ok && st.energy.wallet === 1 && !st.cast);
  // 期望值：每次按中 = Σ 機率 × 售價，每季都要 ≤ 4（每體力 ≤ 2）
  ["春", "夏", "秋", "冬"].forEach(s => {
    const day = { "秋": "2026-09-21", "冬": "2026-09-28", "春": "2026-10-05", "夏": "2026-10-12" }[s];
    eq(day + " 是" + s, T.season(day), s);
    const t = T.fishTable(day, C), tot = Object.values(t).reduce((x, y) => x + y, 0);
    const ev = Object.keys(t).reduce((x, k) => x + t[k] / tot * C.SELL[k], 0);
    ok(s + "季每次按中期望 " + ev.toFixed(2) + " 幣，每體力 ≤ 2", ev / C.COST.fish <= 2.0001);
  });
}

console.log("\n── 礦坑 ──");
{
  const st = fresh(); give(st, 7);
  eq("一開始在第 1 層", T.mineFloor(st, C), 0);
  const r = T.dig(st, "2026-10-12", C, 0.1);
  ok("r 小挖到石頭（石頭也進背包）", r.ok && r.found === "stone" && st.inv.stone === 1 && !r.first, r);
  const r2 = T.dig(st, "2026-10-12", C, 0.9);
  ok("r 大挖到石英、新圖鑑", r2.found === "quartz" && r2.first && st.dex.quartz === 1, r2);
  for (let i = 0; i < 7; i++) T.dig(st, "2026-10-12", C, 0.6);
  eq("挖了 9 次還在第 1 層", T.mineFloor(st, C), 0);
  const r3 = T.dig(st, "2026-10-12", C, 0.6);
  ok("第 10 次往下到第 2 層", r3.deeper && T.mineFloor(st, C) === 1, r3);
  st.mine.digs = 25;
  eq("25 次到第 3 層", T.mineFloor(st, C), 2);
  st.mine.digs = 999;
  eq("最多第 3 層", T.mineFloor(st, C), 2);
  C.MINE_FLOORS.forEach((f, i) => {
    const tot = Object.values(f.table).reduce((x, y) => x + y, 0);
    const ev = Object.keys(f.table).reduce((x, k) => x + f.table[k] / tot * (C.SELL[k] || 0), 0);
    ok(f.zh + "每次期望 " + ev.toFixed(2) + " 幣，每體力 ≤ 2", ev / C.COST.dig <= 2.0001);
  });
  ok("抽籤：r=0 拿第一個、r≈1 拿最後一個", T.pickWeighted({ a: 1, b: 1 }, 0) === "a" && T.pickWeighted({ a: 1, b: 1 }, 0.9999) === "b");
}

console.log("\n── 送禮 ──");
{
  const st = fresh();
  ok("Sam 喜歡紫水晶、Ben 喜歡螃蟹、Leo 喜歡鐵礦", T.giftable("Sam", C).includes("amethyst") && T.giftable("Ben", C).includes("crab") && T.giftable("Leo", C).includes("iron"));
  ok("每位村民至少有一樣可以送的", Object.keys(C.VILLAGERS).every(v => T.giftable(v, C).length >= 2));
  ok("還沒搬來的不能送", (st.inv.amethyst = 1, !T.gift(st, "Sam", "amethyst", "2026-10-12", C).ok));
  ok("不喜歡的不能送", (st.inv.squid = 1, !T.gift(st, "Leo", "squid", "2026-10-12", C).ok));
  st.inv.iron = 2;
  const g = T.gift(st, "Leo", "iron", "2026-10-12", C);
  ok("送 Leo 鐵礦：好感 +1、扣一個", g.ok && st.hearts.Leo === 1 && st.inv.iron === 1, g);
  ok("同一天不能再送", !T.gift(st, "Leo", "iron", "2026-10-12", C).ok && st.inv.iron === 1);
  ok("隔天可以", T.gift(st, "Leo", "iron", "2026-10-13", C).ok && st.hearts.Leo === 2);
  ok("背包沒有就不能送", !T.gift(st, "Leo", "iron", "2026-10-14", C).ok);
  st.decorOwned.flowers = 1;
  ok("裝飾也能送（花圃給 Mia）", T.gift(st, "Mia", "flowers", "2026-10-12", C).ok && st.decorOwned.flowers === 0);
  st.hearts.Mia = 10; st.inv.carrot = 2;
  ok("10 顆心還可以再送（上限 20）", T.gift(st, "Mia", "carrot", "2026-10-13", C).ok && st.hearts.Mia === 11);
  st.hearts.Mia = 20;
  const full = T.gift(st, "Mia", "carrot", "2026-10-14", C);
  ok("好感滿 20 就不收，東西也不會被拿走", !full.ok && st.inv.carrot === 1 && /滿了/.test(full.msg), full.msg);
  ok("存檔整理：好感最多 20", T.normalize(Object.assign({}, st, { hearts: { Mia: 99 } }), "test", "2026-10-14", C).hearts.Mia === 20);
  // 送禮讓好感上升 → 繁榮度夠了村民會搬來
  const s2 = fresh(); s2.hearts.Mia = 10; s2.hearts.Leo = 3; s2.decorOwned.flowers = 30;     // 13 顆心 39＋裝飾 20＝59
  for (let i = 0; i < 10; i++) T.placeDecor(s2, "flowers", 4 + i % 8, 6 + Math.floor(i / 8), "2026-10-12", C);
  s2.inv.iron = 1;
  const g2 = T.gift(s2, "Leo", "iron", "2026-10-12", C);
  ok("送禮讓繁榮度到 60：Nora 搬來", g2.arrived.includes("Nora"), g2);
}
{
  // 存檔整理：圖鑑、礦坑、送禮
  const st = fresh(); st.dex.squid = 3; st.mine.digs = 12; st.gifts.Leo = "2026-10-12";
  const raw = JSON.parse(JSON.stringify(st));
  raw.dex.evil = 5; raw.gifts.Nobody = "2026-10-12"; raw.gifts.Mia = "<b>"; raw.gifts.Ben = ["2026-10-12"];
  const n = T.normalize(raw, "test", "2026-10-12", C);
  ok("存檔整理：圖鑑只留認得的", JSON.stringify(n.dex) === JSON.stringify({ squid: 3 }));
  ok("存檔整理：礦坑次數留著", n.mine.digs === 12 && T.mineFloor(n, C) === 1);
  ok("存檔整理：送禮只留村民與日期", JSON.stringify(n.gifts) === JSON.stringify({ Leo: "2026-10-12" }));
}

console.log("\n── 階段紀念照 ──");
{
  const all = T.stageShots(fresh(), C), qid = new Set(C.QUESTS.map(q => q.id));
  eq("每個地標每一階一張", all.length, Object.values(C.LANDMARKS).reduce((n, L) => n + L.stages.length, 0));
  ok("id 不重複、也不跟好感任務撞名", new Set(all.map(s => s.id)).size === all.length && all.every(s => !qid.has(s.id)));
  ok("每一張都有英文和中文說明", all.every(s => s.caption && s.captionZh), all.filter(s => !s.caption || !s.captionZh));
  ok("新存檔一張都還沒有", all.every(s => !s.got && s.date === null));
  const st = fresh(); st.inv.wood = 4; const r = T.doTask(st, "plaza", "p1-wood", "2026-10-05", C);
  ok("沒交到最後一個不會給照片", r.ok && r.stagePhoto === null && !Object.keys(st.stagePhotos).length, r);
  const raw = JSON.parse(JSON.stringify(fresh()));
  raw.town = { plaza: 3, market: 1 };
  raw.stagePhotos = { "plaza-1": "2026-10-08", "plaza-2": ["x"], "market-2": "2026-10-09", "harbor-1": "2026-10-09", evil: "2026-10-09" };
  const n = T.normalize(raw, "test", "2026-10-15", C);
  eq("存檔整理：只留修好的階段、日期要是字串", Object.keys(n.stagePhotos), ["plaza-1"]);
  ok("舊存檔已經修好的階段也算有照片（沒日期）", T.stageShot(n, "plaza-2", C).got && T.stageShot(n, "plaza-2", C).date === null && T.stageShot(n, "market-1", C).got);
  ok("沒修好的不算", !T.stageShot(n, "market-2", C).got && !T.stageShot(n, "harbor-1", C).got);
  eq("修好 4 階 = 4 張", T.stageShots(n, C).filter(s => s.got).length, 4);
}

console.log("\n── 好感任務與紀念照 ──");
{
  ok("每位村民四個任務（5、10、15、20 顆心）", Object.keys(C.VILLAGERS).every(v => C.QUESTS.filter(q => q.by === v).map(q => q.at).join() === "5,10,15,20"));
  ok("好感任務的門檻都在上限內", C.QUESTS.every(q => q.at <= T.HEART_MAX));
  ok("好感任務不要銅礦（挖到第 3 層就回不去）", C.QUESTS.every(q => q.need.item !== "copper"));
  ok("任務 id 不重複", new Set(C.QUESTS.map(q => q.id)).size === C.QUESTS.length);
  ok("要的東西都認得", C.QUESTS.every(q => q.need.n > 0 && (q.need.item === "ap" || q.need.item in fresh().inv || C.DECOR[q.need.item])));
  const st = fresh(); give(st, 1);
  const q = T.questOf("leo-5", C);
  eq("好感不夠：鎖著", T.questState(st, q, C), "locked");
  ok("鎖著不能做", !T.doQuest(st, "leo-5", "2026-10-15", C).ok);
  st.hearts.Leo = 5;
  eq("5 顆心：可以做", T.questState(st, q, C), "ready");
  eq("10 顆心那個還鎖著", T.questState(st, T.questOf("leo-10", C), C), "locked");
  const r0 = T.doQuest(st, "leo-5", "2026-10-15", C);
  ok("木材不夠不能交", !r0.ok && /還差 3/.test(r0.msg), r0.msg);
  st.inv.wood = 3;
  const p0 = T.prosperity(st, C);
  const r = T.doQuest(st, "leo-5", "2026-10-15", C);
  ok("交出去拿到紀念照", r.ok && st.photos["leo-5"] === "2026-10-15" && st.inv.wood === 0, r);
  eq("紀念照讓繁榮度 +5", T.prosperity(st, C) - p0, 5);
  eq("做完變 done", T.questState(st, q, C), "done");
  ok("不能做第二次", !T.doQuest(st, "leo-5", "2026-10-15", C).ok);
  st.hearts.Ben = 10;
  ok("還沒搬來的村民不能做", T.questState(st, T.questOf("ben-5", C), C) === "locked");
  const ap = T.apTotal(st); st.hearts.Lily = 0;
  st.residents.Lily = "2026-10-15"; st.hearts.Lily = 5;
  ok("出力任務扣體力", T.doQuest(st, "lily-5", "2026-10-15", C).ok && T.apTotal(st) === ap - 3);
  const raw = JSON.parse(JSON.stringify(st)); raw.photos.evil = "2026-10-15"; raw.photos["mia-5"] = ["2026-10-15"];
  const n = T.normalize(raw, "test", "2026-10-15", C);
  ok("存檔整理：只留認得的紀念照、日期要是字串", Object.keys(n.photos).sort().join() === "leo-5,lily-5");
}

{
  const st = fresh(); st.residents.Nora = "2026-10-15"; st.hearts.Nora = 10; st.money = 10;
  ok("鮭魚不在季節也能用錢補（每個 6）", T.fillCost(st, "salmon", 1, C).cost === 6);
  ok("好感任務用錢補完成", T.doQuest(st, "nora-10", "2026-10-15", C, { buy: true }).ok && st.money === 4 && st.photos["nora-10"]);
  ok("第 2、3 層也挖得到石英", C.MINE_FLOORS.every(f => f.table.quartz > 0));
  const raw = JSON.parse(JSON.stringify(fresh())); raw.photos = { "tom-10": "2026-10-15", "leo-5": "2026-10-15" };
  const n = T.normalize(raw, "test", "2026-10-15", C);
  ok("匯入：好感不夠、沒搬來的紀念照都不算", Object.keys(n.photos).length === 0);
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
  ["05", "06", "07", "08", "09", "12", "13", "14", "15", "16", "02"].forEach(d => {
    claimed["2026-10-" + d + "::2026-10-" + d + "-vocab"] = { claimedAt: "2026-10-19T03:00:00.000Z" };
  });
  eq("同一天補做 11 份舊題，只拿得到那週的 100", T.syncFromProgress(st, { coins: { claimedDrills: claimed } }), 100);
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

// ── 每週聊天題 ──
{
  const WK = "2026-10-25", day = "2026-10-29", items = C.CHATS[WK].items;
  ok("聊天題每題 3 個選項、正解在選項裡、有解說", items.every(q => q.choices.length === 3 && q.choices.some(o => o.id === q.answer) && q.why));
  ok("聊天題正解位置有打散", new Set(items.map(q => q.answer)).size > 1);
  ok("聊天題 id 不重複", new Set(Object.values(C.CHATS).flatMap(w => w.items.map(q => q.id))).size === Object.values(C.CHATS).reduce((n, w) => n + w.items.length, 0));
  const st = fresh(), q = items[0], wrongId = q.choices.find(o => o.id !== q.answer).id;
  ok("下週才能答的、上週的都不行", !T.chatAnswer(st, q.id, q.answer, "2026-10-24", C).ok && !T.chatAnswer(st, q.id, q.answer, "2026-11-01", C).ok);
  ok("不存在的選項不行", !T.chatAnswer(st, q.id, "z", day, C).ok);
  const before = T.apTotal(st);
  const r = T.chatAnswer(st, q.id, q.answer, day, C);
  ok("答對有獎勵", r.ok && r.chat.ok && !!r.chat.got);
  ok("獎勵是 ⚡5 或 3 顆種子", (r.chat.got.ap === T.CHAT_AP && T.apTotal(st) === before + T.CHAT_AP) || (r.chat.got.n === T.CHAT_SEEDS && st.inv[r.chat.got.item] === T.CHAT_SEEDS));
  ok("同一題不能再答", !T.chatAnswer(st, q.id, q.answer, day, C).ok);
  const st2 = fresh(), ap2 = T.apTotal(st2), inv2 = JSON.stringify(st2.inv);
  const r2 = T.chatAnswer(st2, q.id, wrongId, day, C);
  ok("答錯沒有獎勵，也不能重答", r2.ok && !r2.chat.ok && T.apTotal(st2) === ap2 && JSON.stringify(st2.inv) === inv2 && !T.chatAnswer(st2, q.id, q.answer, day, C).ok);
  // 抽獎固定：同一個學生同一題，在哪台裝置答都一樣
  eq("抽獎結果固定", JSON.stringify(T.chatPrize(fresh(), q.id, C)), JSON.stringify(T.chatPrize(fresh(), q.id, C)));
  // 隨機：所有題目×幾個學生，兩種獎勵都會出現
  const kinds = new Set();
  ["albert", "jonathan", "test", "a", "b"].forEach(n => items.forEach(x => kinds.add(T.chatPrize(T.newState(n, day), x.id, C).ap ? "ap" : "seed")));
  ok("體力和種子都抽得到", kinds.has("ap") && kinds.has("seed"));
  ok("市集沒修好不會抽到玉米／南瓜種子", T.chatSeedKinds(fresh(), C).join() === "carrot_seed,potato_seed");
  const st3 = fresh(); st3.town.market = 1;
  ok("市集修好一階後玉米／南瓜種子也會出現", T.chatSeedKinds(st3, C).length === 4);
  // 體力超過隨身上限放儲備
  const st4 = fresh(); st4.energy.wallet = T.AP_WALLET_CAP - 2;
  const pick = items.find(x => T.chatPrize(st4, x.id, C).ap);
  T.chatAnswer(st4, pick.id, pick.answer, day, C);
  ok("隨身滿了，多的放儲備", st4.energy.wallet === T.AP_WALLET_CAP && st4.energy.reserve === T.CHAT_AP - 2);
  ok("聊天題不吃每週 100／加分 40 的額度", !(st4.energy.byWeek || {})[T.apWeek(day)] && !(st4.energy.bonusByWeek || {})[T.apWeek(day)]);
  // 存檔整理：留下合法紀錄，ok 重新判斷，不重發獎勵
  const raw = JSON.parse(JSON.stringify(st));
  raw.chats["c1025-mia"] = { date: day, choice: "c", ok: false, got: "ap" };
  raw.chats["nope"] = { date: day, choice: "a" };
  raw.chats["c1025-nora"] = { date: day, choice: "<b>" };
  const n = T.normalize(raw, "test", day, C);
  ok("存檔保留答過的題目", !!n.chats[q.id] && n.chats[q.id].got === st.chats[q.id].got);
  ok("存檔重新判斷對錯", n.chats["c1025-mia"].ok === true);
  ok("不認得的題目、亂填的選項丟掉", !n.chats.nope && !n.chats["c1025-nora"]);
  ok("答過的題目留在生活冊", (st.book[WK] || []).some(b => b.text.indexOf("聊天") >= 0));
  // 出題的村民還沒搬來就換人
  eq("Nora 沒搬來時換成 Mia／Leo", ["Mia", "Leo"].includes(T.chatSpeaker(fresh(), items[2], C)), true);
  const st5 = fresh(); st5.residents.Nora = day;
  eq("Nora 搬來了就是 Nora 問", T.chatSpeaker(st5, items[2], C), "Nora");
}

console.log(`\n${fail === 0 ? "✅" : "❌"} pass ${pass} / fail ${fail}\n`);
process.exit(fail ? 1 : 0);
