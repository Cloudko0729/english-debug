// 今日快練引擎：每日 5 題資料驅動（單字＋句型文法），依 Codex×Claude 對齊設計。
// 需要：vocab.js(ADULT_VOCAB)、repair_terms.js(REPAIR_TERMS)、qbank.js(GRAMMAR_QS)
(function () {
  const COURSE_START = "2026-07-13";   // W1 週一
  // 26 週場景 tag（vocab.js 場景空間）＋是否維修相關週
  const WEEK_TAGS = [
    ["office", 0], ["service", 0], ["parts", 1], ["repair", 1],            // W1-4 基礎
    ["quotation", 1], ["quotation", 1], ["repair", 1], ["delivery", 1],    // W5-8 報價RMA
    ["repair", 1], ["parts", 1], ["repair", 1], ["repair", 1], ["service", 1], // W9-13 狀態異常
    ["meeting", 0], ["repair", 1], ["office", 0], ["service", 0],          // W14-17 來訪
    ["meeting", 0], ["meeting", 0], ["repair", 1], ["delivery", 1], ["meeting", 0], // W18-22 電話
    ["quotation", 1], ["repair", 1], ["service", 1], ["general", 0],       // W23-26 整合
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
  const weekNo = () => Math.min(26, Math.max(1, Math.floor((Date.parse(todayStr()) - Date.parse(COURSE_START)) / 604800000) + 1));
  function allowedLevels(w) { return w <= 6 ? [1] : w <= 14 ? [1, 2] : w <= 22 ? [1, 2, 3] : [2, 3]; }
  function levelWeight(w, lv) {
    const t = w <= 6 ? { 1: 1 } : w <= 14 ? { 1: .65, 2: .35 } : w <= 22 ? { 1: .35, 2: .45, 3: .2 } : { 2: .55, 3: .45 };
    return t[lv] || 0;
  }
  // 種子隨機（同日固定；重測全隨機）
  function seeded(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; }; }
  const shuf = (a, rnd) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor((rnd ? rnd() : Math.random()) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ── 狀態 ──
  function loadState() {
    try { const s = JSON.parse(localStorage.getItem("adultPracticeState") || "null"); if (s && s.version === 1) return s; } catch (e) {}
    return { version: 1, words: {}, repairs: {}, grammar: {}, mistakes: [], days: {} };
  }
  const state = loadState();
  const save = () => localStorage.setItem("adultPracticeState", JSON.stringify(state));
  function rec(map, key) { return map[key] || (map[key] = { seen: 0, correct: 0, wrong: 0, streak: 0, lastSeen: "", nextReview: "" }); }
  function nextInterval(it, ok) { if (!ok) return 1; return it.streak <= 0 ? 1 : it.streak === 1 ? 3 : it.streak === 2 ? 7 : 14; }
  function addDays(dateStr, n) { const d = new Date(dateStr + "T00:00:00"); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function mark(kind, key, ok) {
    const map = kind === "word" ? state.words : kind === "repair" ? state.repairs : state.grammar;
    const it = rec(map, key);
    it.seen++; ok ? (it.correct++, it.streak++) : (it.wrong++, it.streak = 0);
    it.lastSeen = todayStr();
    it.nextReview = addDays(todayStr(), nextInterval(it, ok));
    if (!ok) state.mistakes.push({ id: kind + ":" + key, type: kind, wrongAt: todayStr(), due: addDays(todayStr(), 1) });
    if (state.mistakes.length > 60) state.mistakes = state.mistakes.slice(-60);
    save();
  }

  // ── 選字 ──
  const W = weekNo(), weekTag = WEEK_TAGS[W - 1][0], repairWeek = !!WEEK_TAGS[W - 1][1];
  const retake = !!(state.days[todayStr()] && state.days[todayStr()].done);
  const rnd = retake ? null : seeded(todayStr() + "-quick");
  const R = () => (rnd ? rnd() : Math.random());

  function scoreWord(v) {
    const it = state.words[v.en] || { seen: 0, correct: 0, streak: 0 };
    if (it.streak >= 3) return -1;   // mastered
    let s = 0;
    if (v.tag === weekTag) s += 100;
    else if ((RELATED[weekTag] || []).includes(v.tag)) s += 40;
    if (v.src === "mail") s += 20;
    s += levelWeight(W, v.level) * 30;
    s -= it.seen * 25 + it.correct * 8;
    return s + R() * 15;
  }
  function pickNewWords(n, excl) {
    const lv = allowedLevels(W);
    return ADULT_VOCAB.filter(v => lv.includes(v.level) && !excl.has(v.en) && (state.words[v.en] || { seen: 0 }).seen === 0)
      .map(v => [scoreWord(v), v]).filter(x => x[0] >= 0).sort((a, b) => b[0] - a[0]).slice(0, n).map(x => x[1]);
  }
  function pickReviewWords(n, excl) {
    const t = todayStr();
    const due = ADULT_VOCAB.filter(v => { const it = state.words[v.en]; return it && it.seen > 0 && it.streak < 3 && !excl.has(v.en) && (it.nextReview <= t || it.wrong > it.correct); });
    const pool = due.length ? due : ADULT_VOCAB.filter(v => { const it = state.words[v.en]; return it && it.seen > 0 && it.streak < 3 && !excl.has(v.en); });
    return shuf(pool, rnd).slice(0, n);
  }
  function wordQ(v, dir) {
    const lv = ADULT_VOCAB.filter(x => x.en !== v.en && Math.abs(x.level - v.level) <= 1);
    const near = shuf(lv.filter(x => x.tag === v.tag), rnd).concat(shuf(lv, rnd)).filter((x, i, arr) => arr.findIndex(y => y.en === x.en) === i).slice(0, 3);
    if (dir === "e2z") return { kind: "word", key: v.en, q: `「${v.en}」的意思是？`, choices: shuf([{ label: v.zh, ok: 1 }].concat(near.map(x => ({ label: x.zh, ok: 0 }))), rnd), why: `${v.en} = ${v.zh}（${v.src === "mail" ? "⭐你的常用字" : "商業補充字"}）` };
    return { kind: "word", key: v.en, q: `「${v.zh}」的英文是？`, choices: shuf([{ label: v.en, ok: 1 }].concat(near.map(x => ({ label: x.en, ok: 0 }))), rnd), why: `${v.zh} = ${v.en}` };
  }
  function repairQ(excl) {
    const pool = REPAIR_TERMS.filter(t => !excl.has(t.en) && (state.repairs[t.en] || { streak: 0 }).streak < 3);
    if (!pool.length) return null;
    const t = shuf(pool, rnd)[0];
    const re = new RegExp(t.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const blank = re.test(t.example) ? t.example.replace(re, "＿＿＿") : t.example + "（＿＿＿）";
    const near = shuf(REPAIR_TERMS.filter(x => x.en !== t.en && x.cat === t.cat), rnd).slice(0, 3);
    return { kind: "repair", key: t.en, q: `維修詞條填空：${blank}`, sub: t.example_zh, choices: shuf([{ label: t.en, ok: 1 }].concat(near.map(x => ({ label: x.en, ok: 0 }))), rnd), why: `${t.en} = ${t.zh}` };
  }
  function grammarQ(prefTypes, excl) {
    let pool = GRAMMAR_QS.filter(g => !excl.has(g.id));
    const tagged = pool.filter(g => g.tag === weekTag);
    pool = (tagged.length ? tagged : pool).slice();
    if (prefTypes) { const p = pool.filter(g => prefTypes.includes(g.type)); if (p.length) pool = p; }
    pool.sort((a, b) => ((state.grammar[a.id] || { seen: 0 }).seen - (state.grammar[b.id] || { seen: 0 }).seen) || (R() - .5));
    const g = pool[0];
    if (!g) return null;
    return { kind: "grammar", key: g.id, q: g.q, choices: shuf(g.c.map((label, i) => ({ label, ok: i === g.a ? 1 : 0 })), rnd), why: g.why, swap: g.swap };
  }
  function mistakeQs(n, excl) {
    const t = todayStr(), out = [];
    const due = state.mistakes.filter(m => m.due <= t);
    for (const m of shuf(due, rnd)) {
      if (out.length >= n) break;
      const [kind, key] = m.id.split(":");
      if (excl.has(key)) continue;
      if (kind === "word") { const v = ADULT_VOCAB.find(x => x.en === key); if (v) { out.push(wordQ(v, R() < .5 ? "e2z" : "z2e")); excl.add(key); } }
      else if (kind === "repair") { const q = repairQ(new Set([...excl].filter(k => k !== key))); if (q && q.key === key) { out.push(q); excl.add(key); } }
      else { const g = GRAMMAR_QS.find(x => x.id === key); if (g) { out.push({ kind: "grammar", key: g.id, q: g.q, choices: shuf(g.c.map((label, i) => ({ label, ok: i === g.a ? 1 : 0 })), rnd), why: g.why, swap: g.swap }); excl.add(key); } }
    }
    return out;
  }

  // ── 每日配方 ──
  function buildToday() {
    const dow = new Date().getDay();   // 0日..6六
    const excl = new Set(); const qs = [];
    const add = q => { if (q) { qs.push(q); excl.add(q.key); } };
    const news = n => pickNewWords(n, excl).forEach((v, i) => add(wordQ(v, i % 2 ? "z2e" : "e2z")));
    const revs = n => pickReviewWords(n, excl).forEach((v, i) => add(wordQ(v, i % 2 ? "e2z" : "z2e")));
    const scene = () => { const v = pickNewWords(1, excl)[0] || pickReviewWords(1, excl)[0]; if (v) add(wordQ(v, "e2z")); };
    if (dow === 5 || dow === 6 || dow === 0) {           // 週五＋週末：回收日
      mistakeQs(3, excl).forEach(q => qs.push(q));
      while (qs.length < 3) { const r = pickReviewWords(1, excl)[0]; if (!r) break; add(wordQ(r, "e2z")); }
      const core = ADULT_VOCAB.filter(v => v.tag === weekTag && !excl.has(v.en));
      if (core.length) add(wordQ(shuf(core, rnd)[0], "z2e"));
      add(grammarQ(null, excl));
    } else if (dow === 1) { news(2); revs(1); scene(); add(grammarQ(["A"], excl)); }
    else if (dow === 2) { news(2); revs(1); add(grammarQ(["B", "C"], excl)); add(grammarQ(["B", "C"], excl)); }
    else if (dow === 3) { news(1); revs(2); add(repairWeek ? (repairQ(excl) || grammarQ(["D"], excl)) : grammarQ(["D"], excl)); add(grammarQ(["D", "A"], excl)); }
    else { news(1); revs(2); add(grammarQ(["A", "C"], excl)); add(grammarQ(["D"], excl)); }
    // 補滿 5 題
    while (qs.length < 5) { const v = pickNewWords(1, excl)[0]; if (!v) break; add(wordQ(v, "e2z")); }
    return qs.slice(0, 5);
  }

  // ── 對外 ──
  window.QuickPractice = {
    week: W, weekTag, retake,
    build: buildToday,
    answer: (q, ok) => mark(q.kind, q.key, ok),
    finish: (okCount, total) => { state.days[todayStr()] = { done: 1, ok: okCount, total }; save(); },
    stats: () => ({ learned: Object.keys(state.words).length, mistakes: state.mistakes.filter(m => m.due <= todayStr()).length }),
  };
})();
