// 每月「單字單元」課表的規則引擎（分級軌）。
//
// 這個站有兩條單字軌，別搞混：
//   1. 年度週計畫（vocab_plan.js → curriculum.js）：48 週 1440 字，主題式，固定週曆，
//      餵每日練習與週單字表。那是廣度。
//   2. 本檔案負責的分級單元（vocab_db/foundation）：33 單元 463 字，L1–L4，
//      每單元含例句／短文／對話／易混淆，每月由小孩自選路線。那是深度。
// 分級月選只能掛在第 2 條 —— 第 1 條是固定週曆，沒有「級」的概念。
//
// 與 grammar_plan.js 結構平行，但單位是「單元」、級距是 L1–L4。
// 兩者刻意不共用抽象：級距定義、推薦門檻、路線課量都不同，硬抽成一份反而更難改。
//
// 依賴：window.VOCAB_UNITS（由 build_vocab_units.js 產生）
// 儲存位置：kidsProgress.<student>.vocab
(function () {
  "use strict";

  var LEVELS = ["L1", "L2", "L3", "L4"];

  // 與 grammar_plan 用同一條及格線，小孩不會遇到「文法算過、單字不算過」這種說不清的差別。
  var PASS = 0.65;
  var UNIT_SAMPLE_MIN = 2;      // 完成幾個單元後，實際成績才蓋過診斷
  var LEVEL_DONE_RATIO = 0.6;   // 一級要完成幾成才算走完

  // 單元比文法課大（每單元 13–15 字），所以月量比文法少。
  // 3 單元 ≈ 42 字/月；這是「要真的記住」的深度字，跟週計畫每週 30 字的廣度不同性質。
  var ROUTES = [
    { key: "repair",    icon: "🔧", label: "修復", count: 2,
      blurb: "把之前沒記熟的單元再練一次，這個月不加新的。", tone: "#e8863c" },
    { key: "continue",  icon: "▶️", label: "延續", count: 3,
      blurb: "接著現在的進度，學下面幾個單元。", tone: "#2fbf71" },
    { key: "challenge", icon: "🚀", label: "挑戰", count: 4,
      blurb: "單元多一點，而且會碰到下一級的字。", tone: "#5b3aa0" },
  ];

  var MONTH_BONUS = 60;      // 與文法同額：獎勵完成計畫，不是獎勵選難的
  var BONUS_MIN_UNITS = 2;

  function units() { return window.VOCAB_UNITS || []; }
  function byId(id) {
    var all = units();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function levelIndex(l) { var i = LEVELS.indexOf(l); return i < 0 ? 0 : i; }
  function levelUnits(l) { return units().filter(function (u) { return u.level === l; }); }

  // ── 日期 ──────────────────────────────────────────────────────────────
  // 一律本地時間。toISOString() 是 UTC，在 UTC+8 會讓月底少一天、
  // 凌晨 0–8 點的 today() 回傳前一天。
  function ymd(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
      "-" + String(d.getDate()).padStart(2, "0");
  }
  function planMonthKey(d) {
    d = d || new Date();
    var y = d.getFullYear(), m = d.getMonth();
    if (d.getDate() >= 25) m += 1;          // 月底就能先規劃下個月
    if (m > 11) { m -= 12; y += 1; }
    return y + "-" + String(m + 1).padStart(2, "0");
  }
  function monthLabel(key) { return Number(key.split("-")[1]) + " 月"; }
  function monthEnd(key) {
    var p = key.split("-");
    return ymd(new Date(Number(p[0]), Number(p[1]), 0));
  }
  function today() { return ymd(new Date()); }

  // ── 讀進度 ────────────────────────────────────────────────────────────
  function vocabOf(p) {
    if (!p.vocab) p.vocab = { schemaVersion: 1, units: {}, completedCount: 0, coinsEarned: 0, updatedAt: null };
    if (!p.vocab.units) p.vocab.units = {};
    return p.vocab;
  }
  function recOf(p, id) { return vocabOf(p).units[id] || null; }
  function scoreOf(r) { return r && r.total ? r.best / r.total : 0; }
  function isSolid(p, id) { var r = recOf(p, id); return !!r && scoreOf(r) >= PASS; }
  function isTried(p, id) { return !!recOf(p, id); }

  function diagOf(p) {
    var d = p.diagnostics && p.diagnostics.grade6Adaptive && p.diagnostics.grade6Adaptive.latest;
    return d || null;
  }
  // 診斷給的是能力帶 F0–F7，要換成單字級。對照來自 units 的 bands：
  // L1=F0/F1、L2=F1/F2、L3=F2/F3、L4=F3。F4 以上沒有單字庫，一律收斂到 L4
  // （頁面會另外說明，不要假裝有內容）。
  var BAND_TO_LEVEL = { F0: "L1", F1: "L2", F2: "L3", F3: "L4", F4: "L4", F5: "L4", F6: "L4", F7: "L4" };
  function diagLevel(d) {
    if (!d) return null;
    var t = d.learningTier || (d.band && (d.band.id || d.band)) || null;
    if (typeof t !== "string") return null;
    return BAND_TO_LEVEL[t.toUpperCase()] || null;
  }

  // 週測連續兩次不及格的單元視為「退化」—— 單元頁證明的是「當時記住了」，
  // 週測驗的是「一週後還記得嗎」。曾經通過但持續忘掉的單元要重新排回修復路線，
  // 否則進度表會一直顯示 ✅，小孩卻早就忘光了。
  function decayed(p) {
    var tests = p.weeklyTests || [];
    var hist = {};
    tests.forEach(function (t) {
      var m = (t && t.vocab) || {};
      Object.keys(m).forEach(function (id) {
        if (!hist[id]) hist[id] = [];
        hist[id].push(m[id].total ? m[id].correct / m[id].total : 0);
      });
    });
    var out = [];
    Object.keys(hist).forEach(function (id) {
      var last2 = hist[id].slice(-2);
      if (last2.length >= 2 && last2.every(function (r) { return r < PASS; })) out.push(id);
    });
    return out;
  }

  // ── 判斷目前程度 ──────────────────────────────────────────────────────
  function assess(p) {
    var all = units();
    var decay = decayed(p);
    var tried = [], solidIds = [], fragile = [];
    all.forEach(function (u) {
      if (!isTried(p, u.id)) return;
      tried.push(u.id);
      // 單元頁過關但週測一直忘 → 算 fragile，會被排進修復路線
      if (isSolid(p, u.id) && decay.indexOf(u.id) < 0) solidIds.push(u.id); else fragile.push(u.id);
    });

    var perLevel = {};
    LEVELS.forEach(function (l) { perLevel[l] = { total: 0, solid: 0, tried: 0, avg: 0 }; });
    all.forEach(function (u) {
      var s = perLevel[u.level]; if (!s) return;
      s.total++;
      if (isTried(p, u.id)) { s.tried++; s.avg += scoreOf(recOf(p, u.id)); }
      // 用同一套退化判定，否則等級評估會以為某級已經走完，實際上小孩早就忘了
      if (solidIds.indexOf(u.id) >= 0) s.solid++;
    });
    LEVELS.forEach(function (l) { var s = perLevel[l]; s.avg = s.tried ? s.avg / s.tried : 0; });

    // 不要求從 L1 連續達標：診斷判 L3 的小孩會直接從 L3 開始，
    // 用連續判定會把他倒退嚕判成 L1。取「完成率達標的最高一級」的下一級。
    var unitLevel = null, passedIdx = -1, topTriedIdx = -1;
    for (var i = 0; i < LEVELS.length; i++) {
      var s = perLevel[LEVELS[i]];
      if (!s.tried) continue;
      topTriedIdx = i;
      if (s.total && s.solid / s.total >= LEVEL_DONE_RATIO) passedIdx = i;
    }
    if (passedIdx >= 0) unitLevel = LEVELS[Math.min(passedIdx + 1, LEVELS.length - 1)];
    else if (topTriedIdx >= 0) unitLevel = LEVELS[topTriedIdx];

    var d = diagOf(p), dLevel = diagLevel(d);
    var level, source;
    if (tried.length >= UNIT_SAMPLE_MIN && unitLevel) { level = unitLevel; source = "units"; }
    else if (dLevel) { level = dLevel; source = "diagnostic"; }
    else if (unitLevel) { level = unitLevel; source = "units"; }
    else { level = null; source = "none"; }

    return {
      level: level, source: source, perLevel: perLevel,
      tried: tried, fragile: fragile,
      unitLevel: unitLevel, diagLevel: dLevel,
      diagConfidence: d ? (d.confidence || (d.band && d.band.confidence) || null) : null,
      hasDiagnostic: !!d,
    };
  }

  // ── 排課 ──────────────────────────────────────────────────────────────
  // 池的順序就是教學順序（units 已按 l1-u01…l4-u10 排好），只做去重取前 N 個。
  function pickFrom(pool, count) {
    var seen = {}, picked = [];
    for (var i = 0; i < pool.length && picked.length < count; i++) {
      var u = pool[i];
      if (!u || seen[u.id]) continue;
      seen[u.id] = 1;
      picked.push(u.id);
    }
    return picked;
  }

  function buildRoutes(p) {
    var a = assess(p);
    var level = a.level || "L1";
    var li = levelIndex(level);
    var nextLevel = LEVELS[Math.min(li + 1, LEVELS.length - 1)];
    var atCeiling = level === "L4";

    // 修復：分數低的排前面，再補地基（只往回一級，不從 L1 撿 ——
    // 診斷判 L3 的小孩沒學過 L1 是正常的，把他丟回 l1-u01 不是修復是懲罰）
    var fragilePool = a.fragile.map(byId).filter(Boolean).sort(function (x, y) {
      return scoreOf(recOf(p, x.id)) - scoreOf(recOf(p, y.id));
    });
    var prevLevel = LEVELS[Math.max(li - 1, 0)];
    var backfill = units().filter(function (u) {
      return (u.level === prevLevel || u.level === level) && !isTried(p, u.id);
    });
    var repairPool = fragilePool.concat(backfill);

    var contPool = levelUnits(level).filter(function (u) { return !isTried(p, u.id); })
      .concat(levelUnits(level).filter(function (u) { return isTried(p, u.id) && !isSolid(p, u.id); }))
      .concat(levelUnits(nextLevel));

    var chalPool = levelUnits(level).filter(function (u) { return !isTried(p, u.id); }).slice(0, 1)
      .concat(levelUnits(nextLevel))
      .concat(levelUnits(LEVELS[Math.min(li + 2, LEVELS.length - 1)]));

    var pools = { repair: repairPool, continue: contPool, challenge: chalPool };

    var out = ROUTES.map(function (r) {
      var ids = pickFrom(pools[r.key], r.count);
      return {
        key: r.key, icon: r.icon, label: r.label, blurb: r.blurb, tone: r.tone,
        level: (r.key === "challenge" && !atCeiling) ? nextLevel : level,
        units: ids,
        wordCount: ids.reduce(function (s, id) { var u = byId(id); return s + (u ? u.wordCount : 0); }, 0),
        newCount: ids.filter(function (id) { return !isTried(p, id); }).length,
        coins: ids.length * 40 + MONTH_BONUS,
        blocked: null,
      };
    });

    // 一條路線如果排出來的單元全都已經學熟了，代表這個方向沒東西可給了。
    // 直接說清楚，不要端一份「全部打勾」的課表讓小孩以為有新進度。
    out.forEach(function (r) {
      if (r.units.length && r.units.every(function (id) { return isSolid(p, id); })) {
        r.blocked = "這些單元你都已經記熟了，換一條路線吧";
      }
    });

    var chal = out.filter(function (r) { return r.key === "challenge"; })[0];
    var weakHere = a.fragile.filter(function (id) { var u = byId(id); return u && levelIndex(u.level) <= li; });
    if (weakHere.length >= 2) {
      chal.blocked = "還有 " + weakHere.length + " 個單元沒記熟，現在往上跳會很吃力";
    } else if (atCeiling && !chal.blocked) {
      // 已在最高級：挑戰無處可去。明說，不要給一份跟延續一樣的課表假裝有差別。
      chal.blocked = "L4 是目前單字庫的最高級，再上去的字還在準備中";
    }

    // ⭐ 建議不能落在沒東西可給的路線上
    var pickable = out.filter(function (r) { return !r.blocked && r.units.length; });
    var rec = "continue";
    if (weakHere.length >= 2) rec = "repair";
    else if (!chal.blocked) {
      // 看「剛走完的那一級」，不是 level 本身 —— level 照定義就是還沒學完的那級，
      // 拿它判斷永遠不會成立，挑戰就永遠推不出來。
      var prev = a.perLevel[prevLevel];
      if (li > 0 && prev && prev.total && prev.solid === prev.total && prev.avg >= 0.85) rec = "challenge";
    }
    if (rec === "challenge" && a.source === "diagnostic" && a.diagConfidence === "low") rec = "continue";
    // 選中的路線如果無路可走，退到還有東西可給的那條；全部都滿了就不標建議
    if (!pickable.some(function (r) { return r.key === rec; })) {
      rec = pickable.length ? pickable[0].key : null;
    }

    out.forEach(function (r) { r.recommended = (r.key === rec); });

    var why = {
      repair: "有幾個單元的分數還沒到 65%，先把那些字記熟，之後學新的才不會混在一起。",
      continue: a.source === "diagnostic"
        ? "依照你的起點診斷，" + level + " 這一級的字最適合你現在學。"
        : "你在 " + level + " 還有沒學完的單元，接著走完最順。",
      challenge: level + " 的字你記得很熟，可以往 " + nextLevel + " 前進。",
    };

    return { assess: a, routes: out, recommendedKey: rec, why: why[rec], atCeiling: atCeiling };
  }

  // ── 計畫的存取與狀態 ──────────────────────────────────────────────────
  function loadPlan(p) {
    var v = vocabOf(p);
    return (v.monthlyPlan && v.monthlyPlan.month) ? v.monthlyPlan : null;
  }
  function activePlan(p) {
    var pl = loadPlan(p);
    if (!pl) return null;
    return (pl.coversThrough && pl.coversThrough >= today()) ? pl : null;
  }
  function needsChoice(p) { return !activePlan(p); }

  function choose(p, routeKey) {
    var built = buildRoutes(p);
    var r = built.routes.filter(function (x) { return x.key === routeKey; })[0];
    if (!r) return null;
    var v = vocabOf(p);
    var prev = v.monthlyPlan;
    var month = planMonthKey();
    var switches = 0, history = [];
    if (prev && prev.month === month) {
      switches = (prev.switches || 0) + 1;
      // 只留最近 6 筆：整份 progress 會同步到 Google Sheet（單格 5 萬字上限），
      // 小孩連按「重新選一次」不該把存檔撐爆。
      history = (prev.history || []).concat([{ route: prev.route, units: prev.units, at: prev.chosenAt }]).slice(-6);
      // 改選不作廢已做過的單元，維持原本先後順序放在最前面
      var keep = (prev.units || []).filter(function (id) { return isTried(p, id); });
      r.units = keep.concat(r.units.filter(function (id) { return keep.indexOf(id) < 0; }));
    }
    v.monthlyPlan = {
      month: month, coversThrough: monthEnd(month),
      route: r.key, level: r.level, units: r.units,
      chosenAt: today(), switches: switches, history: history,
      bonusClaimed: false,
    };
    v.updatedAt = today();
    return v.monthlyPlan;
  }

  function planStatus(p) {
    var pl = activePlan(p);
    if (!pl) return null;
    var done = [], weak = [], todo = [];
    pl.units.forEach(function (id) {
      if (isSolid(p, id)) done.push(id);
      else if (isTried(p, id)) weak.push(id);
      else todo.push(id);
    });

    var rescue = null;
    if (pl.route === "challenge") {
      var seq = pl.units.filter(function (id) { return isTried(p, id); });
      var lowRun = 0;
      for (var i = 0; i < seq.length; i++) {
        if (!isSolid(p, seq[i])) { lowRun++; if (lowRun >= 2) break; } else lowRun = 0;
      }
      if (lowRun >= 2) rescue = "連續兩個單元的字還沒記熟。先回去把它們練到熟，再往上會輕鬆很多——不是你記不住，是一次吃太多了。";
    }

    // 課表是選課當下的快照。小孩學了一陣子程度會前進，但課表不會自己改
    // —— 那是他選的，不該偷偷換掉。可是完全不講也不對：實際看過的狀況是
    // 課表停在 L4、小孩其實才剛走完 L2，L3 一片空白卻被指去做 L4。
    // 所以偏離就明說，並讓他自己決定要不要重選。
    var drift = null;
    var nowLevel = assess(p).level;
    if (nowLevel && pl.level) {
      var dNow = levelIndex(nowLevel), dPlan = levelIndex(pl.level);
      // 挑戰路線本來就會超前一級，所以超過一級才算偏離
      var ahead = pl.route === "challenge" ? 1 : 0;
      if (dPlan > dNow + ahead) {
        drift = { kind: "ahead", now: nowLevel,
          msg: "這個月的課表是 " + pl.level + " 的內容，但你目前的程度大約在 " + nowLevel +
               "，中間跳過的部分可能會讓這幾單元做起來很吃力。" };
      } else if (dPlan < dNow) {
        drift = { kind: "behind", now: nowLevel,
          msg: "你的程度已經前進到 " + nowLevel + " 了，這個月的課表還停在 " + pl.level +
               "。想換成新的也可以，已經拿到的金幣不會被扣掉。" };
      }
    }

    var bonusReady = !pl.bonusClaimed && done.length === pl.units.length && done.length >= BONUS_MIN_UNITS;

    return {
      plan: pl, done: done, weak: weak, todo: todo,
      total: pl.units.length, bonusReady: bonusReady, bonus: MONTH_BONUS, drift: drift,
      wordCount: pl.units.reduce(function (s, id) { var u = byId(id); return s + (u ? u.wordCount : 0); }, 0),
      rescue: rescue,
    };
  }

  window.VocabPlan = {
    LEVELS: LEVELS, PASS: PASS, MONTH_BONUS: MONTH_BONUS, ROUTES: ROUTES,
    byId: byId, units: units, levelUnits: levelUnits,
    planMonthKey: planMonthKey, monthLabel: monthLabel, monthEnd: monthEnd, today: today,
    assess: assess, buildRoutes: buildRoutes,
    loadPlan: loadPlan, activePlan: activePlan, needsChoice: needsChoice,
    choose: choose, planStatus: planStatus,
    isSolid: isSolid, isTried: isTried, recOf: recOf, scoreOf: scoreOf,
  };
})();
