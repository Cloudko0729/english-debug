// 四季小鎮：遊戲規則核心（第一階段小樣）
//
// 這支檔案只有規則與存檔，沒有畫面，node 測試直接 require 它（kids/tools/test_town_core.js）。
// 所有動作函式都長成 act(state, ...args, today) → { ok, msg }，並直接修改 state。
// today 一律由呼叫端傳入「本地日期字串 YYYY-MM-DD」，規則裡不讀時鐘，測試才能跨日。
//
// 定案規則見設計報告《四季小鎮》：
//   體力只來自學習：完成一份 +10，每週最多 70（週六 00:00 換週），體力條上限 60，溢出進儲備。
//   小鎮幣只來自出貨與委託；建築收益為零。
//   作物：整片田一天照料一次 1 體力，3 個照料日成熟；當天照料的成長隔天才算；沒照料就停住，永不枯死。
//   一週一季：秋冬春夏四週一輪，跟課表週同步（週日開始），2026-09-20 那週是秋。
(function (root) {
  "use strict";

  var SCHEMA = 1;
  var AP_PER_TASK = 10;
  var AP_WEEKLY_CAP = 70;
  var AP_WALLET_CAP = 60;
  var GROW_DAYS = 3;
  var MAX_FIELDS = 8;
  var MAX_DECOR = 48;
  var W = 16, H = 12;
  var SEASON_ANCHOR = "2026-09-20";           // 秋季第一週的週日
  var SEASONS = ["秋", "冬", "春", "夏"];
  // 從這天起完成的每日練習才補發體力（小樣上線日）
  var TOWN_START = "2026-10-05";

  // ── 日期 ────────────────────────────────────────────────────────────────
  function parse(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2], 12); }
  function ymd(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return ymd(d); }
  function dayDiff(a, b) { return Math.round((parse(b) - parse(a)) / 86400000); }
  // 體力週：跟 week_key.js 同一個定義 —— 最近一個週六
  function apWeek(s) { var d = parse(s); return addDays(s, -((d.getDay() + 1) % 7)); }
  // 課表週：週日開始
  function contentWeek(s) { var d = parse(s); return addDays(s, -d.getDay()); }
  function season(s) {
    var w = Math.floor(dayDiff(SEASON_ANCHOR, contentWeek(s)) / 7);
    return SEASONS[((w % 4) + 4) % 4];
  }

  // ── 地圖 ────────────────────────────────────────────────────────────────
  // 固定地形：最下兩排是河，左上 2×2 是家，第一排是通往小鎮的路。其餘是自由配置區。
  function terrainAt(x, y) {
    if (y >= 10) return "water";
    if (x <= 1 && y <= 1) return "house";
    if (y === 0) return "path";
    if (x === 2 && y === 1) return "bin";       // 出貨箱
    return "free";
  }
  function inBounds(x, y) { return x >= 0 && y >= 0 && x < W && y < H; }

  // ── 新存檔 ──────────────────────────────────────────────────────────────
  function newState(student, today) {
    return {
      schemaVersion: SCHEMA, student: student, createdAt: today, rev: 0,
      energy: { wallet: 0, reserve: 0, week: apWeek(today), weekEarned: 0, receipts: {} },
      money: 0,
      inv: { carrot_seed: 0, potato_seed: 0, rice: 0, carrot: 0, potato: 0, wood: 0, stone: 0 },
      decorOwned: {},
      farm: {
        fields: [{ id: "f1", x: 4, y: 3, crop: null, plantedDate: null, careDates: [] }],
        decor: [], lastCare: null,
      },
      town: { plaza: 0 },
      cards: {}, stories: {}, hearts: {}, quests: {},
      book: {},          // 生活冊：{ 週日日期: [ { date, text, en } ] }
      log: [],
      nextId: 2,
    };
  }

  function note(st, today, text, en) {
    var wk = contentWeek(today);
    (st.book[wk] = st.book[wk] || []).push({ date: today, text: text, en: en || "" });
    st.log.unshift({ date: today, text: text });
    if (st.log.length > 40) st.log.length = 40;
  }
  var fail = function (msg) { return { ok: false, msg: msg }; };
  var done = function (st, msg) { st.rev++; return { ok: true, msg: msg }; };

  // ── 體力 ────────────────────────────────────────────────────────────────
  function apTotal(st) { return st.energy.wallet + st.energy.reserve; }
  function rollWeek(st, today) {
    var wk = apWeek(today);
    if (st.energy.week !== wk) { st.energy.week = wk; st.energy.weekEarned = 0; }
  }
  // 學習完成 → 體力。同一個 activityId 只發一次。週上限以「學習那天」所屬的週計，
  // 這樣上週做的練習這週才打開小鎮補發，也不會吃掉這週的額度。
  function grant(st, activityId, amount, learnedOn) {
    if (st.energy.receipts[activityId]) return fail("已經領過");
    var e = st.energy, wk = apWeek(learnedOn);
    e.byWeek = e.byWeek || {};
    var used = e.byWeek[wk] || 0;
    var give = Math.max(0, Math.min(amount, AP_WEEKLY_CAP - used));
    e.byWeek[wk] = used + give;
    e.receipts[activityId] = { on: learnedOn, amount: give };
    var room = Math.max(0, AP_WALLET_CAP - e.wallet);
    var toWallet = Math.min(give, room);
    e.wallet += toWallet;
    e.reserve += give - toWallet;
    if (wk === e.week) e.weekEarned = e.byWeek[wk];
    st.rev++;
    return { ok: true, amount: give, capped: give < amount };
  }
  function spend(st, n) {
    if (apTotal(st) < n) return false;
    var e = st.energy, a = Math.min(e.wallet, n);
    e.wallet -= a; e.reserve -= (n - a);
    // 隨身用掉之後，從儲備補回隨身條（畫面上只是一個數字移動，總量不變）
    var refill = Math.min(e.reserve, AP_WALLET_CAP - e.wallet);
    e.wallet += refill; e.reserve -= refill;
    return true;
  }
  // 讀 kidsProgress 的每日練習完成紀錄，補發還沒發的體力。
  // 完成紀錄本來就跟著雲端同步，所以換裝置打開小鎮也拿得到。
  // 週上限與上線日一律看「實際完成那天」（claimedAt），不看題目日期：
  // 週一補做上週五的題目，算在這週；同一天補做八份舊題，也只能拿到這週剩下的額度。
  // 去重用完整的完成紀錄鍵，同一天兩份不同練習各算一份。
  function completedOn(v, fallback) {
    var t = v && v.claimedAt && Date.parse(v.claimedAt);
    return t ? ymd(new Date(t)) : fallback;
  }
  function syncFromProgress(st, progress) {
    var claimed = (progress && progress.coins && progress.coins.claimedDrills) || {};
    var got = 0;
    Object.keys(claimed).sort().forEach(function (k) {
      var date = k.split("::")[0];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
      var on = completedOn(claimed[k], date);
      if (on < TOWN_START) return;
      var r = grant(st, "daily:" + k, AP_PER_TASK, on);
      if (r.ok) got += r.amount;
    });
    return got;
  }

  // ── 田地 ────────────────────────────────────────────────────────────────
  function growth(f, today) {
    if (!f.crop) return 0;
    var n = f.careDates.filter(function (d) { return d < today; }).length;
    return Math.min(n, GROW_DAYS);
  }
  function isRipe(f, today) { return !!f.crop && growth(f, today) >= GROW_DAYS; }
  function caredToday(f, today) { return f.careDates.indexOf(today) >= 0; }

  function occupied(st, x, y, ignoreId) {
    var hit = null;
    st.farm.fields.forEach(function (f) {
      if (f.id !== ignoreId && x >= f.x && x <= f.x + 1 && y >= f.y && y <= f.y + 1) hit = f.id;
    });
    st.farm.decor.forEach(function (d) { if (d.id !== ignoreId && d.x === x && d.y === y) hit = d.id; });
    return hit;
  }
  function areaFree(st, x, y, w, h, ignoreId) {
    for (var dy = 0; dy < h; dy++) for (var dx = 0; dx < w; dx++) {
      var cx = x + dx, cy = y + dy;
      if (!inBounds(cx, cy) || terrainAt(cx, cy) !== "free" || occupied(st, cx, cy, ignoreId)) return false;
    }
    return true;
  }
  function addField(st, x, y) {
    if (st.farm.fields.length >= MAX_FIELDS) return fail("田最多 " + MAX_FIELDS + " 片");
    if (!areaFree(st, x, y, 2, 2)) return fail("這裡放不下 2×2 的田");
    st.farm.fields.push({ id: "f" + (st.nextId++), x: x, y: y, crop: null, plantedDate: null, careDates: [] });
    return done(st, "開了一片新田");
  }
  // 搬動田或裝飾：免費，田裡的作物和成長紀錄跟著走
  function move(st, id, x, y) {
    var f = st.farm.fields.find(function (q) { return q.id === id; });
    if (f) {
      if (!areaFree(st, x, y, 2, 2, id)) return fail("這裡放不下");
      f.x = x; f.y = y; return done(st, "搬好了");
    }
    var d = st.farm.decor.find(function (q) { return q.id === id; });
    if (d) {
      if (!areaFree(st, x, y, 1, 1, id)) return fail("這裡放不下");
      d.x = x; d.y = y; return done(st, "搬好了");
    }
    return fail("找不到要搬的東西");
  }

  function plant(st, fieldId, crop, today, C) {
    var f = st.farm.fields.find(function (q) { return q.id === fieldId; });
    if (!f) return fail("找不到這片田");
    if (f.crop) return fail("這片田已經種了東西");
    var info = C.CROPS[crop];
    if (!info) return fail("沒有這種種子");
    if (!info.freeSeed && (st.inv[crop + "_seed"] || 0) < 1) return fail("沒有" + info.zh + "種子，先去商店買");
    if (!spend(st, C.COST.plant)) return fail("體力不夠（播種要 " + C.COST.plant + "）");
    if (!info.freeSeed) st.inv[crop + "_seed"]--;
    f.crop = crop; f.plantedDate = today; f.careDates = [];
    return done(st, "種下了 " + info.en);
  }
  // 照料：整座農莊一天一次。當天新種的也算進今天的照料。
  function care(st, today, C) {
    var growing = st.farm.fields.filter(function (f) { return f.crop && !isRipe(f, today) && !caredToday(f, today); });
    if (!growing.length) {
      return fail(st.farm.lastCare === today ? "今天已經照料過了，明天再來看它們長大" : "現在沒有需要照料的作物");
    }
    var cost = st.farm.lastCare === today ? 0 : C.COST.care;     // 一天一次：今天付過就不再收
    if (!spend(st, cost)) return fail("體力不夠（照料要 " + C.COST.care + "）");
    growing.forEach(function (f) { f.careDates.push(today); });
    st.farm.lastCare = today;
    return done(st, "照料了 " + growing.length + " 片田，明天會長大" + (cost ? "" : "（今天已付過照料費）"));
  }
  function harvest(st, fieldId, today, C) {
    var f = st.farm.fields.find(function (q) { return q.id === fieldId; });
    if (!f || !isRipe(f, today)) return fail("還沒成熟");
    var crop = f.crop;
    st.inv[crop] = (st.inv[crop] || 0) + 1;
    f.crop = null; f.plantedDate = null; f.careDates = [];
    var first = !st.firstHarvest;
    st.firstHarvest = st.firstHarvest || today;
    note(st, today, (first ? "第一次收成！" : "收成了 ") + C.CROPS[crop].zh, "a " + C.CROPS[crop].en);
    return done(st, "收成了 1 個 " + C.CROPS[crop].en);
  }

  // ── 買賣與採集 ──────────────────────────────────────────────────────────
  function qty(n) { return typeof n === "number" && isFinite(n) && n >= 1 && Math.floor(n) === n; }
  function sell(st, item, n, C) {
    if (!qty(n)) return fail("數量不對");
    var price = C.SELL[item];
    if (!price) return fail("這個不能賣");
    if ((st.inv[item] || 0) < n) return fail("數量不夠");
    st.inv[item] -= n; st.money += price * n;
    return done(st, "賣出 " + n + " 個，得到 " + price * n + " 小鎮幣");
  }
  function buy(st, item, n, C) {
    if (!qty(n)) return fail("數量不對");
    var price = C.BUY[item];
    if (!price) return fail("商店沒有賣這個");
    if (st.money < price * n) return fail("小鎮幣不夠");
    st.money -= price * n;
    if (C.DECOR[item]) st.decorOwned[item] = (st.decorOwned[item] || 0) + n;
    else st.inv[item] = (st.inv[item] || 0) + n;
    return done(st, "買好了");
  }
  // 還沒修完的地標，總共還要多少某種材料（從目前階段算到最後一階）
  function materialNeed(st, item, C) {
    var need = 0;
    Object.keys(C.LANDMARKS).forEach(function (k) {
      C.LANDMARKS[k].stages.slice(st.town[k] || 0).forEach(function (sg) { need += sg.items[item] || 0; });
    });
    return need;
  }
  // 下一個目標：第一個還沒修完的地標的下一階，以及每樣東西的進度
  function nextGoal(st, C) {
    var key = Object.keys(C.LANDMARKS).find(function (k) { return (st.town[k] || 0) < C.LANDMARKS[k].stages.length; });
    if (!key) return null;
    var L = C.LANDMARKS[key], stage = st.town[key] || 0, need = L.stages[stage];
    var crops = st.inv.rice + st.inv.carrot + st.inv.potato;
    var parts = [{ k: "ap", have: apTotal(st), need: need.ap }, { k: "money", have: st.money, need: need.money }];
    Object.keys(need.items).forEach(function (k) { parts.push({ k: k, have: k === "crop" ? crops : (st.inv[k] || 0), need: need.items[k] }); });
    return { key: key, stage: stage, total: L.stages.length, name: L.zh, done: need.done, parts: parts,
             ready: parts.every(function (x) { return x.have >= x.need; }) };
  }
  function gather(st, material, today, C) {
    if (material !== "wood" && material !== "stone") return fail("沒有這種材料");
    if ((st.inv[material] || 0) >= materialNeed(st, material, C)) return fail((C.NAME[material] || material) + "已經夠了，先去修廣場吧");
    if (!spend(st, C.COST.gather)) return fail("體力不夠（採集要 " + C.COST.gather + "）");
    st.inv[material]++;
    return done(st, "採到 1 份 " + material);
  }
  function placeDecor(st, type, x, y) {
    if ((st.decorOwned[type] || 0) < 1) return fail("背包裡沒有這個裝飾");
    if (st.farm.decor.length >= MAX_DECOR) return fail("裝飾最多 " + MAX_DECOR + " 件");
    if (!areaFree(st, x, y, 1, 1)) return fail("這裡放不下");
    st.decorOwned[type]--;
    st.farm.decor.push({ id: "d" + (st.nextId++), type: type, x: x, y: y });
    return done(st, "擺好了");
  }
  function storeDecor(st, id) {
    var i = st.farm.decor.findIndex(function (d) { return d.id === id; });
    if (i < 0) return fail("找不到");
    var d = st.farm.decor.splice(i, 1)[0];
    st.decorOwned[d.type] = (st.decorOwned[d.type] || 0) + 1;
    return done(st, "收回背包了");
  }

  // ── 小鎮修復 ────────────────────────────────────────────────────────────
  function canRepair(st, key, C) {
    var L = C.LANDMARKS[key], stage = st.town[key] || 0, need = L && L.stages[stage];
    if (!need) return { ok: false, missing: ["已經全部修好"] };
    var miss = [];
    if (apTotal(st) < need.ap) miss.push("體力 " + need.ap);
    if (st.money < need.money) miss.push("小鎮幣 " + need.money);
    Object.keys(need.items).forEach(function (k) {
      var have = k === "crop" ? (st.inv.rice + st.inv.carrot + st.inv.potato) : (st.inv[k] || 0);
      if (have < need.items[k]) miss.push((C.NAME[k] || k) + " " + need.items[k]);
    });
    return { ok: !miss.length, missing: miss, need: need };
  }
  function takeCrops(st, n) {
    ["rice", "carrot", "potato"].forEach(function (c) { var t = Math.min(n, st.inv[c]); st.inv[c] -= t; n -= t; });
  }
  function repair(st, key, today, C) {
    var chk = canRepair(st, key, C);
    if (!chk.ok) return fail("還缺：" + chk.missing.join("、"));
    var need = chk.need;
    spend(st, need.ap); st.money -= need.money;
    Object.keys(need.items).forEach(function (k) {
      if (k === "crop") takeCrops(st, need.items[k]); else st.inv[k] -= need.items[k];
    });
    st.town[key] = (st.town[key] || 0) + 1;
    note(st, today, C.LANDMARKS[key].zh + "：" + need.done, "");
    return done(st, need.done);
  }

  // ── 英文內容 ────────────────────────────────────────────────────────────
  function readCard(st, card, today) {
    if (!weekOpen(card, today)) return fail("還沒開放");
    if (!st.cards[card.id]) {
      st.cards[card.id] = { readAt: today };
      if (card.type === "letter") note(st, today, "讀了 " + card.speaker + " 的信", card.keep || "");
    }
    return done(st, "");
  }
  function answer(st, card, choiceId, today) {
    if (!weekOpen(card, today)) return fail("還沒開放");
    var c = (card.choices || []).find(function (q) { return q.id === choiceId; });
    if (!c) return fail("沒有這個回答");
    st.cards[card.id] = Object.assign(st.cards[card.id] || {}, { readAt: today, choice: choiceId });
    note(st, today, "跟 " + card.speaker + " 聊天", c.en);
    return done(st, "");
  }
  // 委託：交物品得到小鎮幣，金額等於直接賣掉的價值，不加成（避免變成新的賺錢捷徑）
  function deliver(st, card, today, C) {
    if (!weekOpen(card, today)) return fail("這個委託還沒開放");
    if (st.quests[card.id]) return fail("已經交過了");
    var q = card.quest, have = st.inv[q.item] || 0;
    if (have < q.n) return fail("需要 " + q.n + " 個 " + C.CROPS[q.item].en + "，你有 " + have + " 個");
    st.inv[q.item] -= q.n;
    var pay = (C.SELL[q.item] || 0) * q.n;
    st.money += pay;
    st.quests[card.id] = { date: today };
    st.hearts[card.speaker] = st.hearts[card.speaker] || 0;
    note(st, today, "幫 " + card.speaker + " 完成委託", card.keep || "");
    return done(st, "交給 " + card.speaker + " 了，得到 " + pay + " 小鎮幣");
  }
  // 心事件：讀完、最後一句自己念出來，亮一顆心。只看有沒有完成，不看答對率。
  function weekOpen(item, today) { return !!item && !!item.week && item.week <= contentWeek(today); }
  function finishStory(st, story, today) {
    if (!weekOpen(story, today)) return fail("這段故事還沒開放");
    if (!st.cards[story.needCard]) return fail("先讀 " + story.speaker + " 的信");
    st.stories[story.id] = st.stories[story.id] || {};
    if (st.stories[story.id].done) return fail("這段故事已經完成了");
    st.stories[story.id].done = today;
    st.hearts[story.speaker] = (st.hearts[story.speaker] || 0) + 1;
    note(st, today, "和 " + story.speaker + " 的故事：" + story.title, story.speak);
    return done(st, story.speaker + " 的心亮了一顆 ❤️");
  }

  // ── 存檔 ────────────────────────────────────────────────────────────
  // normalize：把讀進來的資料（本機或匯入檔）整理成合法狀態，不合法就丟例外。
  // 數字一律轉成非負整數、id 只接受 f12 / d3 這種格式、類型必須存在於內容表 ——
  // 這些值之後會被插進畫面，不能讓匯入檔夾帶文字或程式碼。
  var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  function int(v, max) { v = Math.floor(Number(v)); if (!isFinite(v) || v < 0) v = 0; return max != null ? Math.min(v, max) : v; }
  function str(v, max) { return String(v == null ? "" : v).slice(0, max || 200); }
  function dates(a) { return Array.isArray(a) ? a.filter(function (d) { return DATE_RE.test(d); }).slice(0, 400) : []; }
  function obj(v) { return v && typeof v === "object" && !Array.isArray(v) ? v : {}; }
  function normalize(raw, student, today, C) {
    if (!raw || typeof raw !== "object") throw new Error("存檔不是物件");
    if (raw.schemaVersion !== SCHEMA) throw new Error("存檔版本 " + raw.schemaVersion + " 不認得");
    if (raw.student !== student) throw new Error("這不是 " + student + " 的存檔");
    var st = newState(student, DATE_RE.test(raw.createdAt) ? raw.createdAt : today);
    st.rev = int(raw.rev);
    st.nextId = Math.max(int(raw.nextId), 2);
    var e = obj(raw.energy);
    st.energy.wallet = int(e.wallet, AP_WALLET_CAP);
    st.energy.reserve = int(e.reserve, 100000);
    st.energy.week = DATE_RE.test(e.week) ? e.week : apWeek(today);
    st.energy.weekEarned = int(e.weekEarned, AP_WEEKLY_CAP);
    st.energy.byWeek = {};
    Object.keys(obj(e.byWeek)).forEach(function (k) { if (DATE_RE.test(k)) st.energy.byWeek[k] = int(e.byWeek[k], AP_WEEKLY_CAP); });
    Object.keys(obj(e.receipts)).forEach(function (k) {
      var r = obj(e.receipts[k]);
      st.energy.receipts[str(k, 80)] = { on: DATE_RE.test(r.on) ? r.on : today, amount: int(r.amount, AP_PER_TASK) };
    });
    st.money = int(raw.money, 10000000);
    var inv = obj(raw.inv);
    Object.keys(st.inv).forEach(function (k) { st.inv[k] = int(inv[k], 100000); });
    var dec = obj(raw.decorOwned);
    Object.keys(dec).forEach(function (k) { if (C.DECOR[k]) st.decorOwned[k] = int(dec[k], 1000); });
    var farm = obj(raw.farm), seen = {};
    st.farm.fields = (Array.isArray(farm.fields) ? farm.fields : []).filter(function (f) {
      return f && /^f\d+$/.test(f.id) && !seen[f.id] && (seen[f.id] = 1);
    }).slice(0, MAX_FIELDS).map(function (f) {
      return { id: f.id, x: int(f.x, W - 2), y: int(f.y, H - 2), crop: C.CROPS[f.crop] ? f.crop : null,
               plantedDate: DATE_RE.test(f.plantedDate) ? f.plantedDate : null, careDates: dates(f.careDates) };
    });
    st.farm.decor = (Array.isArray(farm.decor) ? farm.decor : []).filter(function (d) {
      return d && /^d\d+$/.test(d.id) && C.DECOR[d.type] && !seen[d.id] && (seen[d.id] = 1);
    }).slice(0, MAX_DECOR).map(function (d) { return { id: d.id, type: d.type, x: int(d.x, W - 1), y: int(d.y, H - 1) }; });
    st.farm.lastCare = DATE_RE.test(farm.lastCare) ? farm.lastCare : null;
    var town = obj(raw.town);
    Object.keys(C.LANDMARKS).forEach(function (k) { st.town[k] = int(town[k], C.LANDMARKS[k].stages.length); });
    ["cards", "stories", "quests"].forEach(function (k) {
      var src = obj(raw[k]);
      Object.keys(src).forEach(function (id) {
        var v = obj(src[id]), o = {};
        Object.keys(v).forEach(function (f) { o[str(f, 20)] = str(v[f], 40); });
        st[k][str(id, 60)] = o;
      });
    });
    Object.keys(C.VILLAGERS).forEach(function (v) { var h = obj(raw.hearts)[v]; if (h != null) st.hearts[v] = int(h, 10); });
    var book = obj(raw.book);
    Object.keys(book).forEach(function (wk) {
      if (!DATE_RE.test(wk) || !Array.isArray(book[wk])) return;
      st.book[wk] = book[wk].slice(0, 200).map(function (x) {
        x = obj(x); return { date: DATE_RE.test(x.date) ? x.date : wk, text: str(x.text), en: str(x.en) };
      });
    });
    st.log = (Array.isArray(raw.log) ? raw.log : []).slice(0, 40).map(function (x) { x = obj(x); return { date: str(x.date, 10), text: str(x.text) }; });
    if (DATE_RE.test(raw.firstHarvest)) st.firstHarvest = raw.firstHarvest;
    return st;
  }

  function key(student) { return "kidsTown.v1." + student; }
  // 讀不懂的存檔不覆蓋：先另存一份備份，再開新存檔，並回報給畫面
  function load(storage, student, today, C) {
    var raw = storage.getItem(key(student)), st = null, problem = null;
    if (raw) {
      try { st = normalize(JSON.parse(raw), student, today, C); }
      catch (e) {
        problem = e.message;
        try { storage.setItem(key(student) + ".broken." + today + "." + Date.now(), raw); } catch (e2) {}
      }
    }
    if (!st) st = newState(student, today);
    rollWeek(st, today);
    st._baseRev = raw && !problem ? st.rev : -1;
    return { st: st, problem: problem };
  }
  // 存檔前檢查：如果別的分頁已經存了更新的版本，這邊不要蓋掉它
  function save(storage, st) {
    var cur = null;
    try { cur = JSON.parse(storage.getItem(key(st.student)) || "null"); } catch (e) { cur = null; }
    if (cur && typeof cur.rev === "number" && st._baseRev >= 0 && cur.rev > st._baseRev) return { ok: false, conflict: true };
    var copy = Object.assign({}, st); delete copy._baseRev;
    storage.setItem(key(st.student), JSON.stringify(copy));      // 寫不進去會丟例外，交給呼叫端
    st._baseRev = st.rev;
    return { ok: true };
  }

  var api = {
    SCHEMA: SCHEMA, AP_PER_TASK: AP_PER_TASK, AP_WEEKLY_CAP: AP_WEEKLY_CAP, AP_WALLET_CAP: AP_WALLET_CAP,
    GROW_DAYS: GROW_DAYS, MAX_FIELDS: MAX_FIELDS, W: W, H: H, TOWN_START: TOWN_START,
    ymd: ymd, addDays: addDays, apWeek: apWeek, contentWeek: contentWeek, season: season,
    terrainAt: terrainAt, occupied: occupied, areaFree: areaFree,
    newState: newState, apTotal: apTotal, grant: grant, spend: spend, syncFromProgress: syncFromProgress,
    growth: growth, isRipe: isRipe, caredToday: caredToday,
    addField: addField, move: move, plant: plant, care: care, harvest: harvest,
    sell: sell, buy: buy, gather: gather, placeDecor: placeDecor, storeDecor: storeDecor,
    canRepair: canRepair, repair: repair, materialNeed: materialNeed, nextGoal: nextGoal,
    readCard: readCard, answer: answer, deliver: deliver, finishStory: finishStory,
    key: key, load: load, save: save, normalize: normalize, weekOpen: weekOpen,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.TownCore = api;
})(typeof window !== "undefined" ? window : this);
