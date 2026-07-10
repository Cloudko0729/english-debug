// 今日快練引擎 v2（槽位制，2026-07-11 Claude×Codex 對齊設計）
// 槽位：①複習 ②單字(商用字/中→英維修詞輪替) ③文法修復(錯句修復/填空/排序輪替)
//       ④功能句(禮貌改寫/自然句) ⑤聽說槽(P3 前先出 中→英 或 時態題)
// 週五/週末：②-④讓位給錯題回收。錯句修復答錯 → 隔天同 error_code 不同句。
// 需要：vocab.js、repair_terms.js、zh_terms.js、qbank.js、repair_qs.js
(function () {
  const COURSE_START = "2026-07-13";
  const WEEK_TAGS = [
    ["office", 0], ["service", 0], ["parts", 1], ["repair", 1],
    ["quotation", 1], ["quotation", 1], ["repair", 1], ["delivery", 1],
    ["repair", 1], ["parts", 1], ["repair", 1], ["repair", 1], ["service", 1],
    ["meeting", 0], ["repair", 1], ["office", 0], ["service", 0],
    ["meeting", 0], ["meeting", 0], ["repair", 1], ["delivery", 1], ["meeting", 0],
    ["quotation", 1], ["repair", 1], ["service", 1], ["general", 0],
  ];
  const RELATED = {
    quotation: ["payment", "order", "delivery"], repair: ["parts", "service", "logistics"],
    delivery: ["logistics", "order", "repair"], parts: ["repair", "order", "quotation"],
    meeting: ["office", "general", "service"], service: ["repair", "general", "office"],
    office: ["general", "meeting", "service"], general: ["office", "service", "meeting"],
    order: ["payment", "delivery", "quotation"], payment: ["order", "quotation", "general"],
    logistics: ["delivery", "parts", "general"],
  };
  const todayStr = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  const dayIdx = Math.floor(Date.parse(todayStr()) / 86400000);
  const weekNo = () => Math.min(26, Math.max(1, Math.floor((Date.parse(todayStr()) - Date.parse(COURSE_START)) / 604800000) + 1));
  function allowedLevels(w) { return w <= 6 ? [1] : w <= 14 ? [1, 2] : w <= 22 ? [1, 2, 3] : [2, 3]; }
  function levelWeight(w, lv) {
    const t = w <= 6 ? { 1: 1 } : w <= 14 ? { 1: .65, 2: .35 } : w <= 22 ? { 1: .35, 2: .45, 3: .2 } : { 2: .55, 3: .45 };
    return t[lv] || 0;
  }
  function seeded(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
  const shuf = (a, rnd) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor((rnd ? rnd() : Math.random()) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ── 狀態 ──
  function loadState() {
    try { const s = JSON.parse(localStorage.getItem("adultPracticeState") || "null"); if (s && s.version >= 1) { s.version = 2; s.zhterms = s.zhterms || {}; s.repairfix = s.repairfix || {}; s.errorCodes = s.errorCodes || {}; return s; } } catch (e) {}
    return { version: 2, words: {}, repairs: {}, grammar: {}, zhterms: {}, repairfix: {}, errorCodes: {}, mistakes: [], days: {} };
  }
  const state = loadState();
  state.emailasm = state.emailasm || {}; state.dialog = state.dialog || {};
  const save = () => localStorage.setItem("adultPracticeState", JSON.stringify(state));
  const mapOf = k => k === "word" ? state.words : k === "repair" ? state.repairs : k === "zhterm" ? state.zhterms
    : (k === "repairfix" || k === "reorder") ? state.repairfix
    : k === "emailasm" ? state.emailasm : k === "dialog" ? state.dialog : state.grammar;
  function rec(map, key) { return map[key] || (map[key] = { seen: 0, correct: 0, wrong: 0, streak: 0, lastSeen: "", nextReview: "" }); }
  function nextInterval(it, ok) { if (!ok) return 1; return it.streak <= 0 ? 1 : it.streak === 1 ? 3 : it.streak === 2 ? 7 : 14; }
  function addDays(dateStr, n) { const d = new Date(dateStr + "T00:00:00"); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function mark(q, ok) {
    const it = rec(mapOf(q.kind), q.key);
    it.seen++; ok ? (it.correct++, it.streak++) : (it.wrong++, it.streak = 0);
    it.lastSeen = todayStr(); it.nextReview = addDays(todayStr(), nextInterval(it, ok));
    if (q.code) {   // 錯誤代碼追蹤（同錯點隔天不同句）
      const ec = state.errorCodes[q.code] || (state.errorCodes[q.code] = { wrong: 0, correct: 0 });
      ok ? ec.correct++ : (ec.wrong++, ec.lastWrong = todayStr());
    }
    if (!ok) state.mistakes.push({ id: q.kind + ":" + q.key, kind: q.kind, code: q.code || null, wrongAt: todayStr(), due: addDays(todayStr(), 1) });
    if (state.mistakes.length > 80) state.mistakes = state.mistakes.slice(-80);
    save();
  }

  // ── 本日參數 ──
  const W = weekNo(), weekTag = WEEK_TAGS[W - 1][0], repairWeek = !!WEEK_TAGS[W - 1][1];
  const retake = !!(state.days[todayStr()] && state.days[todayStr()].done);
  const rnd = retake ? null : seeded(todayStr() + "-quick2");
  const R = () => (rnd ? rnd() : Math.random());

  // ── 題目產生器 ──
  function wordQ(v, dir) {
    const lv = ADULT_VOCAB.filter(x => x.en !== v.en && Math.abs(x.level - v.level) <= 1);
    const near = shuf(lv.filter(x => x.tag === v.tag), rnd).concat(shuf(lv, rnd)).filter((x, i, a) => a.findIndex(y => y.en === x.en) === i).slice(0, 3);
    if (dir === "e2z") return { kind: "word", key: v.en, label: "🔤 單字", q: `「${v.en}」的意思是？`, choices: shuf([{ label: v.zh, ok: 1 }].concat(near.map(x => ({ label: x.zh, ok: 0 }))), rnd), why: `${v.en} = ${v.zh}` };
    return { kind: "word", key: v.en, label: "🔤 單字", q: `「${v.zh}」的英文是？`, choices: shuf([{ label: v.en, ok: 1 }].concat(near.map(x => ({ label: x.en, ok: 0 }))), rnd), why: `${v.zh} = ${v.en}` };
  }
  function scoreWord(v) {
    const it = state.words[v.en] || { seen: 0, correct: 0, streak: 0 };
    if (it.streak >= 3) return -1;
    let s = 0;
    if (v.tag === weekTag) s += 100; else if ((RELATED[weekTag] || []).includes(v.tag)) s += 40;
    if (v.src === "mail") s += 20;
    s += levelWeight(W, v.level) * 30 - it.seen * 25 - it.correct * 8;
    return s + R() * 15;
  }
  function newWordQ(excl) {
    const lv = allowedLevels(W);
    const pool = ADULT_VOCAB.filter(v => lv.includes(v.level) && !excl.has(v.en) && (state.words[v.en] || { seen: 0 }).seen === 0)
      .map(v => [scoreWord(v), v]).filter(x => x[0] >= 0).sort((a, b) => b[0] - a[0]);
    return pool.length ? wordQ(pool[0][1], dayIdx % 2 ? "z2e" : "e2z") : null;
  }
  function reviewWordQ(excl) {
    const t = todayStr();
    let pool = ADULT_VOCAB.filter(v => { const it = state.words[v.en]; return it && it.seen > 0 && it.streak < 3 && !excl.has(v.en) && (it.nextReview <= t || it.wrong > it.correct); });
    if (!pool.length) pool = ADULT_VOCAB.filter(v => { const it = state.words[v.en]; return it && it.seen > 0 && it.streak < 3 && !excl.has(v.en); });
    return pool.length ? wordQ(shuf(pool, rnd)[0], dayIdx % 2 ? "e2z" : "z2e") : null;
  }
  function zhtermQ(excl) {
    const pool = ZH_TERMS.filter(t => !excl.has(t.zh) && (state.zhterms[t.zh] || { streak: 0 }).streak < 3);
    if (!pool.length) return null;
    pool.sort((a, b) => ((state.zhterms[a.zh] || { seen: 0 }).seen - (state.zhterms[b.zh] || { seen: 0 }).seen) || (R() - .5));
    const t = pool[0];
    const near = shuf(ZH_TERMS.filter(x => x.zh !== t.zh), rnd).slice(0, 3);
    return { kind: "zhterm", key: t.zh, label: "🀄 維修詞", q: `「${t.zh}」的英文說法是？`, choices: shuf([{ label: t.en, ok: 1 }].concat(near.map(x => ({ label: x.en, ok: 0 }))), rnd), why: `${t.zh} = ${t.en}`, swap: t.example };
  }
  function repairfixQ(excl, preferCode) {
    let pool = REPAIR_QS.filter(q => !excl.has(q.id) && (state.repairfix[q.id] || { streak: 0 }).streak < 2);
    if (!pool.length) return null;
    if (preferCode) { const p = pool.filter(q => q.code === preferCode && (state.repairfix[q.id] || { seen: 0 }).seen === 0); if (p.length) pool = p; }
    else {
      const tagged = pool.filter(q => q.tag === weekTag);
      if (tagged.length) pool = tagged;
    }
    pool.sort((a, b) => ((state.repairfix[a.id] || { seen: 0 }).seen - (state.repairfix[b.id] || { seen: 0 }).seen) || (R() - .5));
    const q = pool[0];
    return { kind: "repairfix", key: q.id, code: q.code, label: "🔧 錯句修復", q: `這句有中式錯誤：「${q.wrong}」`, sub: `（${q.zh}）點詞塊組出正確的句子`, chunks: shuf(q.chunks, rnd), correct: q.chunks, why: q.why, swap: q.swap };
  }
  function reorderQ(excl) {
    let pool = REPAIR_QS.filter(q => !excl.has(q.id));
    const tagged = pool.filter(q => q.tag === weekTag);
    if (tagged.length) pool = tagged;
    if (!pool.length) return null;
    const q = shuf(pool, rnd)[0];
    return { kind: "reorder", key: q.id, label: "🧩 句子排序", q: `把詞塊排成正確句子（${q.zh}）`, chunks: shuf(q.chunks, rnd), correct: q.chunks, why: q.why, swap: q.swap };
  }
  function emailQ(excl) {
    if (typeof EMAIL_QS === "undefined") return null;
    let pool = EMAIL_QS.filter(q => !excl.has(q.id) && (state.emailasm[q.id] || { streak: 0 }).streak < 2);
    const tagged = pool.filter(q => q.tag === weekTag); if (tagged.length) pool = tagged;
    if (!pool.length) return null;
    pool.sort((a, b) => ((state.emailasm[a.id] || { seen: 0 }).seen - (state.emailasm[b.id] || { seen: 0 }).seen) || (R() - .5));
    const q = pool[0];
    return { kind: "emailasm", key: q.id, label: "📧 郵件組裝", q: `把這句寫成英文：「${q.zh}」`, chunks: shuf(q.chunks, rnd), correct: q.chunks, why: q.why, swap: q.swap };
  }
  function dialogQ(excl) {
    if (typeof DIALOG_QS === "undefined") return null;
    let pool = DIALOG_QS.filter(q => !excl.has(q.id) && (state.dialog[q.id] || { streak: 0 }).streak < 2);
    const tagged = pool.filter(q => q.tag === weekTag); if (tagged.length) pool = tagged;
    if (!pool.length) return null;
    pool.sort((a, b) => ((state.dialog[a.id] || { seen: 0 }).seen - (state.dialog[b.id] || { seen: 0 }).seen) || (R() - .5));
    const q = pool[0];
    return { kind: "dialog", key: q.id, label: "💬 對話回應", q: `客戶說：“${q.cue}”（${q.cueZh}）你回：`, choices: shuf(q.choices.map((label, i) => ({ label, ok: i === q.a ? 1 : 0 })), rnd), why: q.why, swap: q.swap };
  }
  function grammarQ(prefTypes, excl) {
    let pool = GRAMMAR_QS.filter(g => !excl.has(g.id));
    const tagged = pool.filter(g => g.tag === weekTag);
    pool = (tagged.length ? tagged : pool).slice();
    if (prefTypes) { const p = pool.filter(g => prefTypes.includes(g.type)); if (p.length) pool = p; }
    pool.sort((a, b) => ((state.grammar[a.id] || { seen: 0 }).seen - (state.grammar[b.id] || { seen: 0 }).seen) || (R() - .5));
    const g = pool[0]; if (!g) return null;
    const LBL = { A: "✍️ 自然句", B: "✍️ 搭配詞", C: "✍️ 時態", D: "✍️ 禮貌句" };
    return { kind: "grammar", key: g.id, label: LBL[g.type] || "✍️ 句型", q: g.q, choices: shuf(g.c.map((label, i) => ({ label, ok: i === g.a ? 1 : 0 })), rnd), why: g.why, swap: g.swap };
  }
  function mistakeQs(n, excl) {
    const t = todayStr(), out = [];
    for (const m of shuf(state.mistakes.filter(m => m.due <= t), rnd)) {
      if (out.length >= n) break;
      let q = null;
      if (m.kind === "word") { const v = ADULT_VOCAB.find(x => x.en === m.id.split(":")[1]); if (v && !excl.has(v.en)) q = wordQ(v, R() < .5 ? "e2z" : "z2e"); }
      else if (m.kind === "zhterm") { const z = m.id.split(":")[1]; if (!excl.has(z)) { const bak = new Set([...excl]); q = zhtermQ(bak); if (q && q.key !== z) q = null; else if (!q) q = null; } }
      else if (m.kind === "repairfix" || m.kind === "reorder") q = repairfixQ(excl, m.code);   // 同錯點、不同句
      else if (m.kind === "emailasm") { const e = (typeof EMAIL_QS !== "undefined") && EMAIL_QS.find(x => x.id === m.id.split(":")[1]); if (e && !excl.has(e.id)) q = { kind: "emailasm", key: e.id, label: "📧 郵件組裝", q: `把這句寫成英文：「${e.zh}」`, chunks: shuf(e.chunks, rnd), correct: e.chunks, why: e.why, swap: e.swap }; }
      else if (m.kind === "dialog") { const d = (typeof DIALOG_QS !== "undefined") && DIALOG_QS.find(x => x.id === m.id.split(":")[1]); if (d && !excl.has(d.id)) q = { kind: "dialog", key: d.id, label: "💬 對話回應", q: `客戶說：“${d.cue}”（${d.cueZh}）你回：`, choices: shuf(d.choices.map((label, i) => ({ label, ok: i === d.a ? 1 : 0 })), rnd), why: d.why, swap: d.swap }; }
      else { const g = GRAMMAR_QS.find(x => x.id === m.id.split(":")[1]); if (g && !excl.has(g.id)) q = { kind: "grammar", key: g.id, label: "✍️ 句型", q: g.q, choices: shuf(g.c.map((label, i) => ({ label, ok: i === g.a ? 1 : 0 })), rnd), why: g.why, swap: g.swap }; }
      if (q && !excl.has(q.key)) { out.push(q); excl.add(q.key); }
    }
    return out;
  }

  // ── 槽位制組題 ──
  function buildToday() {
    const dow = new Date().getDay();
    const excl = new Set(); const qs = [];
    const add = q => { if (q && !excl.has(q.key)) { qs.push(q); excl.add(q.key); return true; } return false; };
    const isReviewDay = (dow === 5 || dow === 6 || dow === 0);
    // 槽1 複習
    if (!isReviewDay) { if (!add(mistakeQs(1, excl)[0])) add(reviewWordQ(excl) || newWordQ(excl)); }
    if (isReviewDay) {
      mistakeQs(3, excl).forEach(q => add(q));
      while (qs.length < 3) { if (!add(reviewWordQ(excl))) break; }
      const core = ADULT_VOCAB.filter(v => v.tag === weekTag && !excl.has(v.en));
      if (core.length) add(wordQ(shuf(core, rnd)[0], "z2e"));
      add(grammarQ(null, excl));
    } else {
      // 槽2 單字：商用字/中→英維修詞 隔日輪替
      add(dayIdx % 2 ? (zhtermQ(excl) || newWordQ(excl)) : (newWordQ(excl) || zhtermQ(excl)));
      // 槽3 文法修復：錯句修復/填空/排序 三日輪替（有昨日錯碼優先同碼異句）
      const wrongCode = Object.entries(state.errorCodes).find(([c, e]) => e.lastWrong === addDays(todayStr(), -1));
      const rot = dayIdx % 3;
      add(rot === 0 ? (repairfixQ(excl, wrongCode && wrongCode[0]) || grammarQ(["B"], excl))
        : rot === 1 ? (grammarQ(["B"], excl) || repairfixQ(excl))
        : (reorderQ(excl) || repairfixQ(excl)));
      // 槽4 功能句：郵件組裝 / 對話回應 隔日輪替（fallback 禮貌/自然句）
      add(dayIdx % 2 ? (emailQ(excl) || dialogQ(excl) || grammarQ(["D"], excl))
                     : (dialogQ(excl) || emailQ(excl) || grammarQ(["A"], excl)));
      // 槽5 聽說槽（P3 前：中→英 或 時態）
      add(dayIdx % 2 ? (grammarQ(["C"], excl) || zhtermQ(excl)) : (zhtermQ(excl) || grammarQ(["C"], excl)));
    }
    while (qs.length < 5) { if (!add(newWordQ(excl) || reviewWordQ(excl) || grammarQ(null, excl))) break; }
    return qs.slice(0, 5);
  }

  window.QuickPractice = {
    week: W, weekTag, retake,
    build: buildToday,
    answer: (q, ok) => mark(q, ok),
    finish: (okCount, total) => { state.days[todayStr()] = { done: 1, ok: okCount, total }; save(); },
    stats: () => ({ learned: Object.keys(state.words).length + Object.keys(state.zhterms).length, mistakes: state.mistakes.filter(m => m.due <= todayStr()).length }),
  };
})();
