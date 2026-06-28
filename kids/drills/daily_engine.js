// 每日測驗引擎：依 DRILL_DATE 從 curriculum 取「當週 30 單字 + 當月文法」自動出題。
// 需要：DRILL_DATE / DRILL_THEME（wrapper 設定）、curriculum.js、wordbank.js(wordAudioKey)、
//       word_emoji.js、cloud_sync.js、account_lock.js、supabase_auth.js。
(function () {
  const WORD_AUDIO = "../audio/words/";
  let currentStudent = null;
  const state = { questions: [], answered: 0, correct: 0 };

  // ── styles ──
  const css = `
  #app{display:none;margin:0 auto;max-width:680px;padding:0 14px 60px}
  .dq-meta{background:#eef9f1;border:1px solid #cdeed8;border-radius:12px;padding:10px 14px;margin:12px 0;color:#1c7a4d;font-weight:700;font-size:.9rem}
  .dq-card{background:#fff;border:2px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:12px}
  .dq-no{font-weight:800;color:#243042;margin-bottom:8px}
  .dq-sub{font-weight:400;color:#888;font-size:.82rem;margin-left:4px}
  .dq-emoji{font-size:3rem;text-align:center;margin:6px 0}
  .dq-prompt{font-size:1.35rem;font-weight:800;text-align:center;margin:6px 0;color:#243042}
  .dq-play{display:block;margin:6px auto;border:none;border-radius:10px;background:#2f80ed;color:#fff;font-weight:700;font-size:1rem;padding:9px 18px;cursor:pointer}
  .dq-opts{display:flex;flex-direction:column;gap:8px;margin-top:8px}
  .dq-opt{padding:11px 13px;border:2px solid #e2e8f0;border-radius:10px;background:#fff;cursor:pointer;font-weight:600;font-size:1rem;text-align:left}
  .dq-opt.ok{border-color:#2fbf71;background:#d9f7e8}
  .dq-opt.no{border-color:#ef476f;background:#fde0e8}
  .dq-result{text-align:center;margin-top:10px}
  .dq-score{font-size:1.3rem;font-weight:800;color:#2fbf71}
  .dq-coin{margin-top:6px;font-weight:700;color:#243042}
  .dq-lock{text-align:center;color:#667085;padding:60px 20px}
  .dq-lock h2{color:#2f80ed}.dq-lock a{color:#2f80ed;font-weight:700;text-decoration:none}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function todayStr() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function getProgress(s) { const raw = localStorage.getItem("kidsProgress." + s); return raw ? JSON.parse(raw) : { wrongCounts: {}, sessions: 0, totalCorrect: 0, totalWrong: 0 }; }
  function saveProgress(s, p) { localStorage.setItem("kidsProgress." + s, JSON.stringify(p)); }
  function recordResult(en, correct) {
    if (!currentStudent || !en) return;
    const p = getProgress(currentStudent); if (!p.wrongCounts) p.wrongCounts = {};
    if (!correct) { p.wrongCounts[en] = (p.wrongCounts[en] || 0) + 1; p.totalWrong = (p.totalWrong || 0) + 1; }
    else { p.totalCorrect = (p.totalCorrect || 0) + 1; if (p.wrongCounts[en] > 0) p.wrongCounts[en] = Math.max(0, p.wrongCounts[en] - 1); }
    saveProgress(currentStudent, p);
  }

  function seeded(seedStr) { let s = 0; for (const c of seedStr) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; }; }
  function shuffleWith(arr, rnd) { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
  function key(en) { return (typeof wordAudioKey === "function") ? wordAudioKey(en) : en.toLowerCase().replace(/[^a-z0-9]+/g, ""); }
  let curAudio = null;
  function playWord(en) { if (curAudio) curAudio.pause(); const a = new Audio(WORD_AUDIO + key(en) + ".mp3"); curAudio = a; a.play().catch(() => { if (window.speechSynthesis) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(en); u.lang = "en-US"; u.rate = .85; speechSynthesis.speak(u); } }); }

  function buildQuiz() {
    const ctx = vocabWeekForDate(DRILL_DATE);
    const week = ctx.week, month = ctx.month;
    const rnd = seeded(DRILL_DATE);
    const words = week.words;
    const emojiOf = en => (typeof WORD_EMOJI !== "undefined") ? WORD_EMOJI[en] : null;

    const vq = shuffleWith(words, rnd).slice(0, 14).map(w => {
      const r = rnd(), em = emojiOf(w.en);
      let type = (em && r < 0.25) ? "pic" : (r < 0.5) ? "listen" : (r < 0.75) ? "en2zh" : "zh2en";
      // 干擾選項：中文也要不同（避免如 trip/travel 都是「旅行」造成兩個一樣的選項）
      const shuffled = shuffleWith(words.filter(x => x.en !== w.en), rnd);
      const usedZh = new Set([w.zh]), pool = [];
      for (const x of shuffled) { if (pool.length >= 3) break; if (usedZh.has(x.zh)) continue; usedZh.add(x.zh); pool.push(x); }
      for (const x of shuffled) { if (pool.length >= 3) break; if (pool.indexOf(x) < 0) pool.push(x); }
      const opts = shuffleWith([w, ...pool], rnd);
      const base = { kind: "vocab", en: w.en, audio: null, emoji: null, prompt: null };
      if (type === "pic") return { ...base, emoji: em, sub: "看圖選英文", choices: opts.map(o => ({ label: o.en, correct: o.en === w.en })) };
      if (type === "listen") return { ...base, audio: w.en, sub: "聽發音選英文", choices: opts.map(o => ({ label: o.en, correct: o.en === w.en })) };
      if (type === "en2zh") return { ...base, prompt: w.en, sub: "選中文意思", choices: opts.map(o => ({ label: o.zh, correct: o.en === w.en })) };
      return { ...base, prompt: w.zh, sub: "選英文", choices: opts.map(o => ({ label: o.en, correct: o.en === w.en })) };
    });

    let gq = [];
    month.grammar.forEach(g => { const bank = (typeof GRAMMAR_BANK !== "undefined" && GRAMMAR_BANK[g.topic]) || []; gq = gq.concat(bank.map(q => ({ ...q, topic: g.topic }))); });
    gq = shuffleWith(gq, rnd).slice(0, 6).map(q => ({
      kind: "grammar", en: null, prompt: q.q, sub: "選正確的字（" + q.topic + "）",
      choices: shuffleWith(q.choices.map(c => ({ label: c, correct: c === q.answer })), rnd)
    }));

    state.questions = vq.concat(gq); state.answered = 0; state.correct = 0;
    return { week, month };
  }

  function render(meta) {
    const app = document.getElementById("app");
    let html = `<div class="dq-meta">📒 ${meta.month.label} 第 ${meta.week.n} 週 · ${meta.week.theme}（單字）＋ 文法：${meta.month.grammar.map(g => g.topic).join("、")}</div>`;
    html += state.questions.map((q, i) => {
      const head = q.emoji ? `<div class="dq-emoji">${q.emoji}</div>`
        : q.audio ? `<button class="dq-play" onclick="__dqPlay(${i})">🔊 點我聽</button>`
          : `<div class="dq-prompt">${q.prompt}</div>`;
      return `<div class="dq-card" id="dq${i}"><div class="dq-no">${i + 1}. <span class="dq-sub">${q.sub}</span></div>${head}
        <div class="dq-opts">${q.choices.map((c, ci) => `<button class="dq-opt" onclick="__dqAns(${i},${ci})">${c.label}</button>`).join("")}</div></div>`;
    }).join("");
    html += `<div id="dqResult" class="dq-result"></div>`;
    app.innerHTML = html; app.style.display = "block";
  }

  window.__dqPlay = i => { const q = state.questions[i]; if (q.audio) playWord(q.audio); };
  window.__dqAns = (i, ci) => {
    const q = state.questions[i], box = document.getElementById("dq" + i);
    if (box.dataset.done) return; box.dataset.done = "1";
    const correct = q.choices[ci].correct;
    box.querySelectorAll(".dq-opt").forEach((b, bi) => { b.disabled = true; if (q.choices[bi].correct) b.classList.add("ok"); else if (bi === ci) b.classList.add("no"); });
    if (q.kind === "vocab") recordResult(q.en, correct);
    state.answered++; if (correct) state.correct++;
    if (state.answered === state.questions.length) finish();
  };

  function finish() {
    const total = state.questions.length, c = state.correct;
    const msg = awardCoins(c, total);
    const r = document.getElementById("dqResult");
    r.innerHTML = `<div class="dq-score">🎉 答對 ${c} / ${total}！</div><div class="dq-coin">${msg}</div>`;
    r.scrollIntoView({ behavior: "smooth" });
  }

  function awardCoins(correct, total) {
    if (!currentStudent) return "登入後才能拿金幣喔";
    const p = getProgress(currentStudent);
    if (!p.coins) p.coins = { balance: 0, lifetimeEarned: 0, lifetimeSpent: 0, transactions: [], claimedDrills: {} };
    const DRILL_ID = DRILL_DATE + "-" + DRILL_THEME, claimKey = DRILL_DATE + "::" + DRILL_ID;
    if (p.coins.claimedDrills[claimKey]) return `🪙 今天這份的金幣已經領過囉（目前 ${p.coins.balance} 金幣）`;
    const earned = correct * 5 + (correct === total ? 20 : 0) + 30;
    p.coins.balance += earned; p.coins.lifetimeEarned += earned;
    p.coins.transactions.push({ type: "earn", source: "dailyVocabDrill", amount: earned, balanceAfter: p.coins.balance, createdAt: new Date().toISOString(), meta: { drillId: DRILL_ID, date: DRILL_DATE, correct } });
    p.coins.claimedDrills[claimKey] = { claimedAt: new Date().toISOString(), earned, correct };
    saveProgress(currentStudent, p);
    if (typeof cloudSave === "function") cloudSave(currentStudent);
    return `🪙 +${earned} 金幣！（共 ${p.coins.balance} 金幣）<br><a href="../island.html" style="color:#2f80ed;font-weight:700">👉 去蓋我的島嶼</a>`;
  }

  function showLock() {
    document.getElementById("app").innerHTML = `<div class="dq-lock"><div style="font-size:3rem">🔒</div><h2>這份測驗還沒開放</h2><p>${DRILL_DATE} 才開始喔！明天再來～</p><a href="../index.html">← 回首頁</a></div>`;
    document.getElementById("app").style.display = "block";
  }

  window.selectStudent = function (name) {
    if (typeof requireUnlock === "function" && !requireUnlock(name)) return;
    if (todayStr() < DRILL_DATE && name !== "test") { showLock(); return; }
    currentStudent = name;
    localStorage.setItem("kidsCurrentStudent", name);
    document.querySelectorAll(".stu-btn").forEach(b => b.classList.toggle("active", b.textContent.toLowerCase().includes(name)));
    const p = getProgress(name); p.sessions = (p.sessions || 0) + 1; saveProgress(name, p);
    const meta = buildQuiz(); render(meta);
  };

  function init() {
    const isTest = localStorage.getItem("kidsCurrentStudent") === "test";
    if (todayStr() < DRILL_DATE && !isTest) { showLock(); return; }
    if (!window.sbClient) { const last = localStorage.getItem("kidsCurrentStudent"); if (last) window.selectStudent(last); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
