// 每月文法課表的規則引擎。
// 選擇頁（grammar_month.html）與文法地圖（grammar_db/lessons/index.html）共用同一份，
// 避免兩邊各算一次導致「地圖說我這個月要學 4 課、選擇頁說 5 課」這種對不起來的狀況。
//
// 依賴：window.GRAMMAR_NODES（由 build_grammar_lessons.js 產生）
// 儲存位置：kidsProgress.<student>.grammar.monthlyPlan
(function () {
  "use strict";

  var TIERS = ["F0", "F1", "F2", "F3", "F4", "F5", "F6", "F7"];

  // 一課答對率達這個門檻才算「這課穩了」。與救援機制、bonus 條件共用同一條線。
  // 寫 0.65 而不是 0.67：小測驗是 3 題，答對 2 題 = 0.6666…，用 0.67 會因為
  // 浮點數差那 0.003 把每個「答對 2 題」的小孩都判成不及格，全部掉進修復路線。
  var PASS = 0.65;
  // 課程紀錄要累積到這個課數，才有資格蓋過診斷結果。
  // 少於此數時診斷是唯一可信的訊號（Codex 建議的 75/25 權重，在離散決策下就是這條分界）。
  var LESSON_SAMPLE_MIN = 4;
  // 一個 band 要完成幾成、且都達標，才算「這一級走完了」。
  var TIER_DONE_RATIO = 0.6;

  var ROUTES = [
    { key: "repair",    icon: "🔧", label: "修復", count: 3,
      blurb: "先把還沒穩的舊課補起來，這個月不上新的。",
      tone: "#e8863c" },
    { key: "continue",  icon: "▶️", label: "延續", count: 4,
      blurb: "接著現在的進度往下走，穩穩前進。",
      tone: "#2fbf71" },
    { key: "challenge", icon: "🚀", label: "挑戰", count: 5,
      blurb: "課多一點，而且會碰到下一級的新東西。",
      tone: "#5b3aa0" },
  ];

  var MONTH_BONUS = 60;      // 完成整份月課表的獎勵。三條路線同額 —— 獎勵的是「完成計畫」，不是「選比較難的」。
  var BONUS_MIN_NODES = 3;   // 至少要完成這麼多不同節點才給 bonus，擋住「改選成 3 課再領」的取巧。

  function nodes() { return window.GRAMMAR_NODES || []; }
  function byId(id) {
    var all = nodes();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function tierIndex(t) { var i = TIERS.indexOf(t); return i < 0 ? 0 : i; }

  // ── 月份鍵 ────────────────────────────────────────────────────────────
  // 每月 25 號以後選的課算下個月的。這樣月底就能先規劃，也讓「7/27 開始用」
  // 自然落成 2026-08 啟動月，不必為第一個月寫特例。
  function planMonthKey(d) {
    d = d || new Date();
    var y = d.getFullYear(), m = d.getMonth();
    if (d.getDate() >= 25) m += 1;
    if (m > 11) { m -= 12; y += 1; }
    return y + "-" + String(m + 1).padStart(2, "0");
  }
  function monthLabel(key) {
    var p = key.split("-");
    return Number(p[1]) + " 月";
  }
  // 一律用本地時間組日期字串。
  // toISOString() 轉的是 UTC，在台灣（UTC+8）會少一天：
  // 月底 new Date(2026,8,0) 是 8/31 00:00 本地，轉 UTC 變成 8/30；
  // today() 則會在每天凌晨 0–8 點回傳前一天，害計畫提早一天失效。
  function ymd(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
      "-" + String(d.getDate()).padStart(2, "0");
  }
  // 計畫涵蓋到該月最後一天；啟動月（提前選的）自然就多涵蓋幾天。
  function monthEnd(key) {
    var p = key.split("-");
    return ymd(new Date(Number(p[0]), Number(p[1]), 0));
  }
  function today() { return ymd(new Date()); }

  // ── 讀進度 ────────────────────────────────────────────────────────────
  function grammarOf(p) {
    if (!p.grammar) p.grammar = { schemaVersion: 1, nodes: {}, completedCount: 0, coinsEarned: 0, updatedAt: null };
    if (!p.grammar.nodes) p.grammar.nodes = {};
    return p.grammar;
  }
  function recOf(p, id) { return grammarOf(p).nodes[id] || null; }
  function scoreOf(r) { return r && r.total ? r.best / r.total : 0; }
  function isSolid(p, id) { var r = recOf(p, id); return !!r && scoreOf(r) >= PASS; }
  function isTried(p, id) { return !!recOf(p, id); }

  function diagOf(p) {
    var d = p.diagnostics && p.diagnostics.grade6Adaptive && p.diagnostics.grade6Adaptive.latest;
    return d || null;
  }
  // 診斷結果裡的等級欄位歷經改版，band 可能是字串或物件，都收斂成 "F3" 這種代碼。
  function diagTier(d) {
    if (!d) return null;
    var t = d.learningTier || (d.band && (d.band.id || d.band)) || null;
    if (typeof t !== "string") return null;
    t = t.toUpperCase();
    return TIERS.indexOf(t) >= 0 ? t : null;
  }

  // 週測連續兩次不及格的節點視為「退化」—— 教學頁證明的是「當時學會了」，
  // 週測驗的是「一週後還記得嗎」。曾經通過但持續忘掉的課要重新排回修復路線，
  // 否則進度表會一直顯示 ✅，小孩卻早就不會了。
  function decayed(p) {
    var tests = p.weeklyTests || [];
    var hist = {};
    tests.forEach(function (t) {
      var m = (t && t.grammar) || {};
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
  // 課程紀錄優先，診斷只負責初始定位：小孩實際做過的課是持續訊號，
  // 診斷是一次性快照，兩者衝突時聽實際表現。
  function assess(p) {
    var all = nodes();
    var decay = decayed(p);
    var tried = [], solid = [], fragile = [];
    all.forEach(function (n) {
      if (!isTried(p, n.id)) return;
      tried.push(n.id);
      // 教學頁過關但週測一直忘 → 算 fragile，會被排進修復路線
      if (isSolid(p, n.id) && decay.indexOf(n.id) < 0) solid.push(n.id); else fragile.push(n.id);
    });

    // 每一級的完成情況（avg 只計算學過的課，用來分辨「勉強過關」與「輕鬆全對」）
    var perTier = {};
    TIERS.forEach(function (t) { perTier[t] = { total: 0, solid: 0, tried: 0, avg: 0 }; });
    all.forEach(function (n) {
      var s = perTier[n.band]; if (!s) return;
      s.total++;
      if (isTried(p, n.id)) { s.tried++; s.avg += scoreOf(recOf(p, n.id)); }
      // 用同一套退化判定，否則等級評估會以為某級已經走完，實際上小孩早就忘了
      if (solid.indexOf(n.id) >= 0) s.solid++;
    });
    TIERS.forEach(function (t) { var s = perTier[t]; s.avg = s.tried ? s.avg / s.tried : 0; });

    // 由課程紀錄推目前程度。
    // 注意不能要求「從 F0 連續達標」—— 診斷判 F2 的小孩會直接從 F2 開始上課，
    // 永遠不會有 F0 的紀錄，用連續判定會把他倒退嚕判成 F0。
    // 改成：掃過所有級，取「完成率達標的最高一級」，其後一級就是他該學的。
    var lessonTier = null, passedIdx = -1, topTriedIdx = -1;
    for (var i = 0; i < TIERS.length; i++) {
      var s = perTier[TIERS[i]];
      if (!s.tried) continue;
      topTriedIdx = i;
      if (s.total && s.solid / s.total >= TIER_DONE_RATIO) passedIdx = i;
    }
    if (passedIdx >= 0) lessonTier = TIERS[Math.min(passedIdx + 1, TIERS.length - 1)];
    else if (topTriedIdx >= 0) lessonTier = TIERS[topTriedIdx];   // 還卡在這一級

    var d = diagOf(p), dTier = diagTier(d);
    var tier, source;
    if (tried.length >= LESSON_SAMPLE_MIN && lessonTier) { tier = lessonTier; source = "lessons"; }
    else if (dTier) { tier = dTier; source = "diagnostic"; }
    else if (lessonTier) { tier = lessonTier; source = "lessons"; }
    else { tier = null; source = "none"; }

    return {
      tier: tier, source: source, perTier: perTier,
      tried: tried, solid: solid, fragile: fragile,
      lessonTier: lessonTier, diagTier: dTier,
      diagConfidence: d ? (d.confidence || (d.band && d.band.confidence) || null) : null,
      hasDiagnostic: !!d,
    };
  }

  // ── 排課 ──────────────────────────────────────────────────────────────
  // 前置節點沒穩的課排在後面；同一份課表內也維持前置在前。
  function prereqReady(p, n, alreadyPicked) {
    return (n.prerequisites || []).every(function (pre) {
      return isSolid(p, pre) || alreadyPicked.indexOf(pre) >= 0;
    });
  }

  // 池的順序就是教學順序 —— bands/*.json 已經保證前置節點排在前面，
  // 這裡只做去重後取前 count 個。
  // （曾經試過「先撿前置齊備的、再補其餘」，結果是 prerequisites 為空的高階節點
  //   會整個插隊到最前面，例如零基礎小孩的挑戰路線第一課排到 F3.4 介系詞。）
  function pickFrom(p, pool, count) {
    var seen = {}, picked = [];
    for (var i = 0; i < pool.length && picked.length < count; i++) {
      var n = pool[i];
      if (!n || seen[n.id]) continue;
      seen[n.id] = 1;
      picked.push(n.id);
    }
    return picked;
  }

  function tierNodes(t) { return nodes().filter(function (n) { return n.band === t; }); }

  function buildRoutes(p) {
    var a = assess(p);
    var tier = a.tier || "F0";
    var ti = tierIndex(tier);
    var nextTier = TIERS[Math.min(ti + 1, TIERS.length - 1)];

    // 修復池：做過但沒達標的（分數低的排前面），再補地基。
    // 補地基只往回一級，不從 F0 撿 —— 診斷判 F3 的小孩沒學過 F0 是正常的，
    // 把他丟回 F0.1 不是修復，是懲罰。
    var fragilePool = a.fragile.map(byId).filter(Boolean).sort(function (x, y) {
      return scoreOf(recOf(p, x.id)) - scoreOf(recOf(p, y.id));
    });
    var prevTier = TIERS[Math.max(ti - 1, 0)];
    var backfill = nodes().filter(function (n) {
      return (n.band === prevTier || n.band === tier) && !isTried(p, n.id);
    });
    var repairPool = fragilePool.concat(backfill);

    // 延續池：目前級沒學過的 → 沒穩的 → 下一級開頭（該級已學完時才會用到）
    var contPool = tierNodes(tier).filter(function (n) { return !isTried(p, n.id); })
      .concat(tierNodes(tier).filter(function (n) { return isTried(p, n.id) && !isSolid(p, n.id); }))
      .concat(tierNodes(nextTier));

    // 挑戰池：目前級沒學的排前面當墊腳石，主體是下一級
    var chalPool = tierNodes(tier).filter(function (n) { return !isTried(p, n.id); }).slice(0, 2)
      .concat(tierNodes(nextTier))
      .concat(tierNodes(TIERS[Math.min(ti + 2, TIERS.length - 1)]));

    var pools = { repair: repairPool, continue: contPool, challenge: chalPool };

    var out = ROUTES.map(function (r) {
      var ids = pickFrom(p, pools[r.key], r.count);
      var newCount = ids.filter(function (id) { return !isTried(p, id); }).length;
      return {
        key: r.key, icon: r.icon, label: r.label, blurb: r.blurb, tone: r.tone,
        tier: r.key === "challenge" ? nextTier : tier,
        nodes: ids, newCount: newCount,
        coins: ids.length * 40 + MONTH_BONUS,
        blocked: null,
      };
    });

    // 挑戰的硬性阻擋：前置沒穩就跳級，只會兩頭落空。仍可選，但不建議、且明說原因。
    var chal = out.filter(function (r) { return r.key === "challenge"; })[0];
    var weakHere = a.fragile.filter(function (id) { var n = byId(id); return n && tierIndex(n.band) <= ti; });
    if (weakHere.length >= 2) {
      chal.blocked = "還有 " + weakHere.length + " 課沒站穩，現在跳級會很吃力";
    }

    // ⭐ 建議：弱項多 → 修復；本級還有沒學的 → 延續；本級都穩了 → 挑戰
    var rec = "continue";
    if (weakHere.length >= 2) rec = "repair";
    else if (!chal.blocked) {
      // 看「剛走完的那一級」，不是 tier 本身 —— tier 照定義就是還沒學的那級，
      // 拿它去判斷永遠是 0%，挑戰就永遠推不出來。
      // 而且要求的不只是過關，是幾乎全對：學有餘力才值得跳級。
      var prev = a.perTier[TIERS[Math.max(ti - 1, 0)]];
      if (ti > 0 && prev && prev.total && prev.solid === prev.total && prev.avg >= 0.85) rec = "challenge";
    }
    // 診斷把握度低時不推挑戰 —— 一次考不準就叫小孩跳級，風險不對等
    if (rec === "challenge" && a.source === "diagnostic" && a.diagConfidence === "low") rec = "continue";

    out.forEach(function (r) { r.recommended = (r.key === rec); });

    var why = {
      repair: "有幾課的分數還沒到 67%，先補起來，之後學新的才不會卡住。",
      continue: a.source === "diagnostic"
        ? "依照你的起點診斷，" + tier + " 這一級最適合你現在學。"
        : "你在 " + tier + " 還有沒學完的課，接著把它走完最順。",
      challenge: tier + " 你已經學得很穩了，可以往 " + nextTier + " 前進。",
    };

    return { assess: a, routes: out, recommendedKey: rec, why: why[rec] };
  }

  // ── 計畫的存取與狀態 ──────────────────────────────────────────────────
  function loadPlan(p) {
    var g = grammarOf(p);
    var pl = g.monthlyPlan;
    if (!pl || !pl.month) return null;
    return pl;
  }
  // 計畫還在有效期內就算「這個月已經選好了」
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
    var g = grammarOf(p);
    var prev = g.monthlyPlan;
    var month = planMonthKey();
    var switches = 0, history = [];
    if (prev && prev.month === month) {
      switches = (prev.switches || 0) + 1;
      // 只留最近 6 筆：整份 progress 會原樣同步到 Google Sheet（單格 5 萬字上限），
      // 小孩連按「重新選一次」不該把存檔撐爆。
      history = (prev.history || []).concat([{ route: prev.route, nodes: prev.nodes, at: prev.chosenAt }]).slice(-6);
      // 改選不作廢已完成的課：把當月已學完的節點保留在課表最前面（維持原本的先後順序），
      // 避免白做一場。
      var keep = (prev.nodes || []).filter(function (id) { return isTried(p, id); });
      r.nodes = keep.concat(r.nodes.filter(function (id) { return keep.indexOf(id) < 0; }));
    }
    g.monthlyPlan = {
      month: month, coversThrough: monthEnd(month),
      route: r.key, tier: r.tier, nodes: r.nodes,
      chosenAt: today(), switches: switches, history: history,
      bonusClaimed: false,
    };
    g.updatedAt = today();
    return g.monthlyPlan;
  }

  // 計畫進度：完成數、bonus 是否可領、要不要跳救援
  function planStatus(p) {
    var pl = activePlan(p);
    if (!pl) return null;
    var done = [], weak = [], todo = [];
    pl.nodes.forEach(function (id) {
      if (isSolid(p, id)) done.push(id);
      else if (isTried(p, id)) weak.push(id);
      else todo.push(id);
    });

    // 救援：挑戰路線連續兩課首次成績低於門檻就出手。不強制切換，只建議。
    var rescue = null;
    if (pl.route === "challenge") {
      var seq = pl.nodes.filter(function (id) { return isTried(p, id); });
      var lowRun = 0;
      for (var i = 0; i < seq.length; i++) {
        if (!isSolid(p, seq[i])) { lowRun++; if (lowRun >= 2) break; } else lowRun = 0;
      }
      if (lowRun >= 2) rescue = "這一級有兩課還沒站穩。先回去把它們練熟，再回來挑戰會輕鬆很多——不是你學不會，是順序拿掉了會比較好走。";
    }

    var bonusReady = !pl.bonusClaimed &&
      done.length === pl.nodes.length &&
      done.length >= BONUS_MIN_NODES;

    return {
      plan: pl, done: done, weak: weak, todo: todo,
      total: pl.nodes.length, bonusReady: bonusReady, bonus: MONTH_BONUS,
      rescue: rescue,
    };
  }

  window.GrammarPlan = {
    TIERS: TIERS, PASS: PASS, MONTH_BONUS: MONTH_BONUS, ROUTES: ROUTES,
    byId: byId, nodes: nodes, tierNodes: tierNodes,
    planMonthKey: planMonthKey, monthLabel: monthLabel, monthEnd: monthEnd,
    assess: assess, buildRoutes: buildRoutes,
    loadPlan: loadPlan, activePlan: activePlan, needsChoice: needsChoice,
    choose: choose, planStatus: planStatus,
    isSolid: isSolid, isTried: isTried, recOf: recOf, scoreOf: scoreOf,
  };
})();
