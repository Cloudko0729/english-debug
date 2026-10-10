// 四季小鎮：遊戲規則核心（第一階段小樣）
//
// 這支檔案只有規則與存檔，沒有畫面，node 測試直接 require 它（kids/tools/test_town_core.js）。
// 所有動作函式都長成 act(state, ...args, today) → { ok, msg }，並直接修改 state。
// today 一律由呼叫端傳入「本地日期字串 YYYY-MM-DD」，規則裡不讀時鐘，測試才能跨日。
//
// 定案規則見設計報告《四季小鎮》：
//   體力只來自學習：完成一份 +10，每週最多 70（週六 00:00 換週），體力條上限 60，溢出進儲備。
//   小鎮幣只來自出貨與委託；建築收益為零。
//   作物：種下後照天數成熟（多數 3 天），不照料也會熟，永不枯死。
//         整片田一天照料一次 1 體力；每照料一天，收成時拿到 2 個的機率 +10%。
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
      inv: { carrot_seed: 0, potato_seed: 0, corn_seed: 0, pumpkin_seed: 0,
             rice: 0, carrot: 0, potato: 0, corn: 0, pumpkin: 0, wood: 0, stone: 0 },
      decorOwned: {},
      farm: {
        fields: [{ id: "f1", x: 4, y: 3, crop: null, plantedDate: null, careDates: [] }],
        decor: [], lastCare: null,
      },
      town: { plaza: 0 },        // 每個地標修好了幾階
      tasks: {},                 // 這一階交過的任務 { 任務id: { date } }；更早的階段整階算完成
      residents: {},             // 後來搬來的村民 { 名字: 搬來那天 }；Mia、Leo 一開始就在
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
  // 成長看種下幾天（f.days，種的時候從作物表抄過來）；照料不影響成熟時間
  function cropDays(f) { return f.days || GROW_DAYS; }
  function growth(f, today) {
    if (!f.crop || !f.plantedDate) return 0;
    return Math.max(0, Math.min(dayDiff(f.plantedDate, today), cropDays(f)));
  }
  function isRipe(f, today) { return !!f.crop && growth(f, today) >= cropDays(f); }
  // 收成 2 個的機率（%）：成熟前每照料一天 +CARE_BONUS
  function careDays(f) {
    if (!f.crop || !f.plantedDate) return 0;
    var ripeOn = addDays(f.plantedDate, cropDays(f));
    return f.careDates.filter(function (d) { return d >= f.plantedDate && d < ripeOn; }).length;
  }
  function doubleChance(f, C) { return Math.min(100, careDays(f) * ((C && C.CARE_BONUS) || 10)); }
  // 擲骰固定由「誰、哪片田、哪天種的」決定：重新整理頁面也不會變，不能重抽
  function roll(st, f) {
    var s = st.student + "|" + f.id + "|" + f.plantedDate, h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h % 100;
  }
  // 種子／裝飾有沒有開賣：unlock 寫的每個地標都要修到那一階
  function unlocked(st, thing) {
    var u = thing && thing.unlock;
    return !u || Object.keys(u).every(function (k) { return (st.town[k] || 0) >= u[k]; });
  }
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
    if (!unlocked(st, info)) return fail(info.zh + "還沒開賣");
    if (!info.freeSeed && (st.inv[crop + "_seed"] || 0) < 1) return fail("沒有" + info.zh + "種子，先去商店買");
    if (!spend(st, C.COST.plant)) return fail("體力不夠（播種要 " + C.COST.plant + "）");
    if (!info.freeSeed) st.inv[crop + "_seed"]--;
    f.crop = crop; f.plantedDate = today; f.careDates = []; f.days = info.days || GROW_DAYS;
    return done(st, "種下了 " + info.en + "，" + f.days + " 天後成熟");
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
    return done(st, "照料了 " + growing.length + " 片田，收成 2 個的機率 +" + ((C && C.CARE_BONUS) || 10) + "%" + (cost ? "" : "（今天已付過照料費）"));
  }
  function harvest(st, fieldId, today, C) {
    var f = st.farm.fields.find(function (q) { return q.id === fieldId; });
    if (!f || !isRipe(f, today)) return fail("還沒成熟");
    var crop = f.crop, n = roll(st, f) < doubleChance(f, C) ? 2 : 1;
    st.inv[crop] = (st.inv[crop] || 0) + n;
    f.crop = null; f.plantedDate = null; f.careDates = []; delete f.days;
    var first = !st.firstHarvest;
    st.firstHarvest = st.firstHarvest || today;
    note(st, today, (first ? "第一次收成！" : n > 1 ? "大豐收！" : "收成了 ") + C.CROPS[crop].zh + (n > 1 ? " ×2" : ""), "a " + C.CROPS[crop].en);
    var r = done(st, n > 1 ? "🎉 大豐收！收成了 2 個 " + C.CROPS[crop].en : "收成了 1 個 " + C.CROPS[crop].en);
    r.n = n; return r;
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
    var thing = C.DECOR[item] || C.CROPS[item.replace(/_seed$/, "")];
    if (!unlocked(st, thing)) return fail("還沒開賣");
    if (st.money < price * n) return fail("小鎮幣不夠");
    st.money -= price * n;
    if (C.DECOR[item]) st.decorOwned[item] = (st.decorOwned[item] || 0) + n;
    else st.inv[item] = (st.inv[item] || 0) + n;
    return done(st, "買好了");
  }
  // 地標開放了沒：after 寫的前一個地標要全部修好
  function landmarkOpen(st, key, C) {
    var L = C.LANDMARKS[key];
    return !!L && (!L.after || (st.town[L.after] || 0) >= C.LANDMARKS[L.after].stages.length);
  }
  // 這一階還沒交的任務，總共還要多少某種材料（只算開放中地標的目前這一階，跟畫面上列出來的一致）
  function materialNeed(st, item, C) {
    var need = 0;
    Object.keys(C.LANDMARKS).forEach(function (k) {
      if (!landmarkOpen(st, k, C)) return;
      var sg = C.LANDMARKS[k].stages[st.town[k] || 0];
      if (sg) sg.tasks.forEach(function (t) { if (!st.tasks[t.id] && t.need.item === item) need += t.need.n; });
    });
    return need;
  }
  // 下一個目標：第一個還沒修完的地標的這一階（給農莊頁的目標卡）
  function nextGoal(st, C) {
    var key = Object.keys(C.LANDMARKS).find(function (k) { return landmarkOpen(st, k, C) && (st.town[k] || 0) < C.LANDMARKS[k].stages.length; });
    return key ? stageView(st, key, C) : null;
  }
  function gather(st, material, today, C) {
    if (material !== "wood" && material !== "stone") return fail("沒有這種材料");
    if ((st.inv[material] || 0) >= materialNeed(st, material, C)) return fail((C.NAME[material] || material) + "已經夠了，先去小鎮交任務吧");
    if (!spend(st, C.COST.gather)) return fail("體力不夠（採集要 " + C.COST.gather + "）");
    st.inv[material]++;
    return done(st, "採到 1 份 " + material);
  }
  function placeDecor(st, type, x, y, today, C) {
    if ((st.decorOwned[type] || 0) < 1) return fail("背包裡沒有這個裝飾");
    if (st.farm.decor.length >= MAX_DECOR) return fail("裝飾最多 " + MAX_DECOR + " 件");
    if (!areaFree(st, x, y, 1, 1)) return fail("這裡放不下");
    st.decorOwned[type]--;
    st.farm.decor.push({ id: "d" + (st.nextId++), type: type, x: x, y: y });
    var came = (today && C) ? arrive(st, today, C) : [];
    var r = done(st, "擺好了" + (came.length ? "　🏠 " + came.join("、") + " 搬來小鎮了！" : ""));
    r.arrived = came; return r;
  }
  function storeDecor(st, id) {
    var i = st.farm.decor.findIndex(function (d) { return d.id === id; });
    if (i < 0) return fail("找不到");
    var d = st.farm.decor.splice(i, 1)[0];
    st.decorOwned[d.type] = (st.decorOwned[d.type] || 0) + 1;
    return done(st, "收回背包了");
  }

  // ── 小鎮任務 ────────────────────────────────────────────────────────────
  // 每一階 5 個任務同時開放、順序隨意；5 個都交完，地標升一階。
  // 手上有多少：ap＝體力總量、裝飾＝背包裡還沒擺出去的、其他＝背包
  function haveOf(st, item, C) {
    if (item === "ap") return apTotal(st);
    if (item === "money") return st.money;
    if (C.DECOR[item]) return st.decorOwned[item] || 0;
    return st.inv[item] || 0;
  }
  function isResident(st, v, C) { var p = C.VILLAGERS[v]; return !!p && (!p.arrive || !!st.residents[v]); }
  // 某個地標目前這一階的樣子：每個任務的進度，以及「還沒交的任務」合計要多少東西
  function stageView(st, key, C) {
    var L = C.LANDMARKS[key], i = st.town[key] || 0, sg = L.stages[i];
    if (!sg) return null;
    var sum = {};
    var tasks = sg.tasks.map(function (t) {
      var have = haveOf(st, t.need.item, C), doneT = !!st.tasks[t.id], here = isResident(st, t.by, C);
      if (!doneT) sum[t.need.item] = (sum[t.need.item] || 0) + t.need.n;
      return { task: t, done: doneT, have: have, need: t.need.n, here: here, ready: !doneT && here && have >= t.need.n };
    });
    var parts = Object.keys(sum).map(function (k) { return { k: k, need: sum[k], have: haveOf(st, k, C) }; });
    return { key: key, name: L.zh, stage: i, total: L.stages.length, title: sg.title, done: sg.done, tasks: tasks, parts: parts,
             left: tasks.filter(function (x) { return !x.done; }).length,
             ready: tasks.some(function (x) { return x.ready; }) };
  }
  function doTask(st, key, taskId, today, C) {
    var L = C.LANDMARKS[key];
    if (!L) return fail("沒有這個地方");
    if (!landmarkOpen(st, key, C)) return fail(L.zh + "還沒開放");
    var i = st.town[key] || 0, sg = L.stages[i];
    if (!sg) return fail("已經全部修好了");
    var t = sg.tasks.find(function (q) { return q.id === taskId; });
    if (!t) return fail("這個任務不在這一階");
    if (st.tasks[t.id]) return fail("這個任務已經完成了");
    if (!isResident(st, t.by, C)) return fail(t.by + " 還沒搬來");
    var item = t.need.item, n = t.need.n, have = haveOf(st, item, C);
    if (have < n) {
      return fail("還差 " + (n - have) + " " + (C.NAME[item] || item) + (C.DECOR[item] ? "（擺在農莊的可以先收回背包）" : ""));
    }
    if (item === "ap") spend(st, n);
    else if (item === "money") st.money -= n;
    else if (C.DECOR[item]) st.decorOwned[item] -= n;
    else st.inv[item] -= n;
    st.tasks[t.id] = { date: today };
    st.hearts[t.by] = Math.min(10, (st.hearts[t.by] || 0) + 1);
    note(st, today, "幫 " + t.by + " 完成" + L.zh + "任務", t.en);
    var msg = "交給 " + t.by + " 了！❤️ +1、繁榮度 +" + C.PROSPERITY.task;
    var stageDone = sg.tasks.every(function (q) { return st.tasks[q.id]; }), opened = [];
    if (stageDone) {
      st.town[key] = i + 1;
      note(st, today, L.zh + "第 " + (i + 1) + " 階完成：" + sg.done, "");
      msg += "　🎉 " + L.zh + "第 " + (i + 1) + " 階完成：" + sg.done;
    }
    var came = arrive(st, today, C);
    if (came.length) msg += "　🏠 " + came.join("、") + " 搬來小鎮了！";
    if (stageDone) Object.keys(C.LANDMARKS).forEach(function (k) { if (C.LANDMARKS[k].after === key && landmarkOpen(st, k, C)) opened.push(k); });
    st.rev++;
    return { ok: true, msg: msg, key: key, stageDone: stageDone, arrived: came, opened: opened };
  }

  // ── 繁榮度與新村民 ──────────────────────────────────────────────────────
  // 繁榮度不存檔，每次從進度算：交過的任務、修好的階段、所有好感、擺在農莊的裝飾（有上限）
  function prosperity(st, C) {
    var P = C.PROSPERITY, tasks = 0, stages = 0, hearts = 0;
    Object.keys(C.LANDMARKS).forEach(function (k) {
      var built = st.town[k] || 0;
      stages += built;
      C.LANDMARKS[k].stages.forEach(function (sg, i) {
        sg.tasks.forEach(function (t) { if (i < built || st.tasks[t.id]) tasks++; });
      });
    });
    Object.keys(st.hearts).forEach(function (v) { hearts += st.hearts[v] || 0; });
    var decor = Math.min(st.farm.decor.length, P.decorMax);
    return tasks * P.task + stages * P.stage + hearts * P.heart + decor * P.decor;
  }
  function prosperityLevel(st, C) {
    var score = prosperity(st, C), lv = C.PROSPERITY.levels, i = 0;
    while (i + 1 < lv.length && score >= lv[i + 1].at) i++;
    var waiting = Object.keys(C.VILLAGERS).filter(function (v) { return C.VILLAGERS[v].arrive && !st.residents[v]; })
      .sort(function (a, b) { return C.VILLAGERS[a].arrive - C.VILLAGERS[b].arrive; });
    return { score: score, level: lv[i], index: i, next: lv[i + 1] || null, nextVillager: waiting[0] || null };
  }
  // 繁榮度夠了就搬來（只會多不會少：之後收回裝飾讓分數掉下來，已經搬來的也不會走）
  function arrive(st, today, C) {
    var score = prosperity(st, C), came = [];
    Object.keys(C.VILLAGERS).forEach(function (v) {
      var p = C.VILLAGERS[v];
      if (p.arrive && !st.residents[v] && score >= p.arrive) {
        st.residents[v] = today;
        note(st, today, v + " 搬來小鎮了", "");
        came.push(v);
      }
    });
    return came;
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
  function finishStory(st, story, today, C) {
    if (!weekOpen(story, today)) return fail("這段故事還沒開放");
    if (!st.cards[story.needCard]) return fail("先讀 " + story.speaker + " 的信");
    st.stories[story.id] = st.stories[story.id] || {};
    if (st.stories[story.id].done) return fail("這段故事已經完成了");
    st.stories[story.id].done = today;
    st.hearts[story.speaker] = (st.hearts[story.speaker] || 0) + 1;
    note(st, today, "和 " + story.speaker + " 的故事：" + story.title, story.speak);
    var came = C ? arrive(st, today, C) : [];
    var r = done(st, story.speaker + " 的心亮了一顆 ❤️" + (came.length ? "　🏠 " + came.join("、") + " 搬來小鎮了！" : ""));
    r.arrived = came; return r;
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
    if (typeof raw.savedAt === "string" && !isNaN(Date.parse(raw.savedAt))) st.savedAt = raw.savedAt.slice(0, 30);
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
      var crop = Object.prototype.hasOwnProperty.call(C.CROPS, f.crop) ? f.crop : null;
      var g = { id: f.id, x: int(f.x, W - 2), y: int(f.y, H - 2), crop: crop,
                plantedDate: crop ? (DATE_RE.test(f.plantedDate) ? f.plantedDate : today) : null, careDates: [] };
      if (crop) {
        // 成熟天數一律照作物表，不信匯入值；照料日期去重、只留生長期間內的
        g.days = C.CROPS[crop].days || GROW_DAYS;
        var end = addDays(g.plantedDate, g.days), seenD = {};
        g.careDates = dates(f.careDates).filter(function (d) { return d >= g.plantedDate && d < end && !seenD[d] && (seenD[d] = 1); });
      }
      return g;
    });
    st.farm.decor = (Array.isArray(farm.decor) ? farm.decor : []).filter(function (d) {
      return d && /^d\d+$/.test(d.id) && C.DECOR[d.type] && !seen[d.id] && (seen[d.id] = 1);
    }).slice(0, MAX_DECOR).map(function (d) { return { id: d.id, type: d.type, x: int(d.x, W - 1), y: int(d.y, H - 1) }; });
    st.farm.lastCare = DATE_RE.test(farm.lastCare) ? farm.lastCare : null;
    var town = obj(raw.town);
    Object.keys(C.LANDMARKS).forEach(function (k) { st.town[k] = int(town[k], C.LANDMARKS[k].stages.length); });
    ["cards", "stories", "quests"].forEach(function (k) {
      var src = obj(raw[k]);
      // 只收認得的欄位：日期欄位要是日期、choice 只能是短代號（這些值會被插進畫面）
      Object.keys(src).forEach(function (id) {
        var v = obj(src[id]), o = {};
        ["readAt", "done", "date"].forEach(function (f) { if (DATE_RE.test(v[f])) o[f] = v[f]; });
        if (/^[a-z0-9]{1,8}$/.test(v.choice)) o.choice = v.choice;
        st[k][str(id, 60)] = o;
      });
    });
    Object.keys(C.VILLAGERS).forEach(function (v) { var h = obj(raw.hearts)[v]; if (h != null) st.hearts[v] = int(h, 10); });
    // 任務：只收這一階的；這一階 5 個都交了就升階（不重發獎勵）；還沒開放的階段一律不算
    var tk = obj(raw.tasks), own = Object.prototype.hasOwnProperty;
    Object.keys(C.LANDMARKS).forEach(function (k) {
      var stages = C.LANDMARKS[k].stages;
      stages.forEach(function (sg) { sg.tasks.forEach(function (t) {
        if (own.call(tk, t.id)) st.tasks[t.id] = { date: DATE_RE.test(obj(tk[t.id]).date) ? tk[t.id].date : today };
      }); });
      var open = landmarkOpen(st, k, C);
      if (!open) st.town[k] = 0;
      while (open && st.town[k] < stages.length && stages[st.town[k]].tasks.every(function (t) { return st.tasks[t.id]; })) st.town[k]++;
      stages.forEach(function (sg, i) { if (!open || i !== st.town[k]) sg.tasks.forEach(function (t) { delete st.tasks[t.id]; }); });
    });
    var rs = obj(raw.residents);
    Object.keys(rs).forEach(function (v) { if (own.call(C.VILLAGERS, v) && C.VILLAGERS[v].arrive) st.residents[v] = DATE_RE.test(rs[v]) ? rs[v] : today; });
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
    arrive(st, today, C);
    st._baseRev = raw && !problem ? st.rev : -1;
    return { st: st, problem: problem };
  }
  // 存檔前檢查：如果別的分頁已經存了更新的版本，這邊不要蓋掉它
  function save(storage, st) {
    var cur = null;
    try { cur = JSON.parse(storage.getItem(key(st.student)) || "null"); } catch (e) { cur = null; }
    if (cur && typeof cur.rev === "number" && st._baseRev >= 0 && cur.rev > st._baseRev) return { ok: false, conflict: true };
    st.savedAt = new Date().toISOString();                       // 雲端合併時「較新的勝出」看這個
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
    growth: growth, isRipe: isRipe, caredToday: caredToday, cropDays: cropDays, careDays: careDays, doubleChance: doubleChance,
    roll: roll, unlocked: unlocked, landmarkOpen: landmarkOpen,
    addField: addField, move: move, plant: plant, care: care, harvest: harvest,
    sell: sell, buy: buy, gather: gather, placeDecor: placeDecor, storeDecor: storeDecor,
    materialNeed: materialNeed, nextGoal: nextGoal, stageView: stageView, doTask: doTask, haveOf: haveOf,
    isResident: isResident, prosperity: prosperity, prosperityLevel: prosperityLevel, arrive: arrive,
    readCard: readCard, answer: answer, deliver: deliver, finishStory: finishStory,
    key: key, load: load, save: save, normalize: normalize, weekOpen: weekOpen,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.TownCore = api;
})(typeof window !== "undefined" ? window : this);
