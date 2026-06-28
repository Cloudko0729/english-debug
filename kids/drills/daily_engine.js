// 每日測驗引擎（分段版，比照前面 Day 1-20）：依 DRILL_DATE 從 curriculum 當週單字 +
// weekdrills.js 當週整句/短文，組成 5 段題型：①英聽選擇 ②英聽填空 ③閱讀選擇 ④句子重組 ⑤圖片題。
// 需要：DRILL_DATE / DRILL_THEME、curriculum.js、weekdrills.js、wordbank.js、word_emoji.js、
//       cloud_sync.js、account_lock.js、supabase_auth.js。
(function () {
  const WORD_AUDIO = "../audio/words/";
  let currentStudent = null, DRILL = null, WDID = "";
  const sectionScores = {};

  const css = `
  #app{display:none;max-width:680px;margin:0 auto;padding:0 14px 70px}
  .sec{background:#fff;border:2px solid #e2e8f0;border-radius:16px;padding:16px;margin:14px 0}
  .sec-h{font-weight:800;color:#2f80ed;font-size:1.05rem;margin-bottom:4px}
  .sec-d{color:#888;font-size:.82rem;margin-bottom:10px}
  .meta{background:#eef9f1;border:1px solid #cdeed8;border-radius:12px;padding:10px 14px;margin:12px 0;color:#1c7a4d;font-weight:700;font-size:.9rem}
  .q{border-top:1px dashed #e7ebf0;padding:11px 0}
  .q:first-of-type{border-top:none}
  .q-no{font-weight:700;color:#243042;margin-bottom:7px}
  .q-no .sub{font-weight:400;color:#999;font-size:.8rem;margin-left:4px}
  .play{display:inline-flex;align-items:center;justify-content:center;border:none;border-radius:10px;background:#2f80ed;color:#fff;font-weight:700;cursor:pointer;padding:7px 14px;font-size:.9rem}
  .emoji{font-size:2.6rem;text-align:center;margin:4px 0}
  .prompt{font-size:1.2rem;font-weight:800;text-align:center;color:#243042;margin:4px 0}
  .blank{font-size:1.05rem;text-align:center;margin:8px 0;color:#243042}
  .opts{display:flex;flex-direction:column;gap:7px;margin-top:8px}
  .opt{padding:10px 12px;border:2px solid #e2e8f0;border-radius:10px;background:#fff;cursor:pointer;font-weight:600;text-align:left}
  .opt.ok{border-color:#2fbf71;background:#d9f7e8}
  .opt.no{border-color:#ef476f;background:#fde0e8}
  .passage{background:#f7faff;border:1px solid #d8e6ff;border-radius:10px;padding:11px 13px;line-height:1.7;margin:8px 0}
  .chunks,.answ{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
  .chunk{padding:8px 11px;border:2px solid #2f80ed;border-radius:9px;background:#fff;color:#2f80ed;font-weight:700;cursor:pointer}
  .chunk.used{opacity:.3;pointer-events:none}
  .answ{min-height:40px;border:2px dashed #cbd5e1;border-radius:9px;padding:6px;align-items:center}
  .slot{padding:8px 11px;border-radius:9px;background:#2f80ed;color:#fff;font-weight:700;cursor:pointer}
  .ro-fb{font-weight:800;margin-top:4px}
  .total{text-align:center;background:#fff;border:2px solid #ffd24d;border-radius:16px;padding:18px;margin:16px 0}
  .total .s{font-size:1.5rem;font-weight:900;color:#2fbf71}
  .total .c{margin-top:8px;font-weight:700}
  .lock{text-align:center;color:#667085;padding:60px 20px}.lock h2{color:#2f80ed}.lock a{color:#2f80ed;font-weight:700;text-decoration:none}
  .gobtn{display:block;text-align:center;background:#ffb703;color:#3a2a00;font-weight:800;border:none;border-radius:12px;padding:14px;width:100%;font-size:1.05rem;cursor:pointer;margin-top:10px}`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function todayStr() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function getProgress(s) { const raw = localStorage.getItem("kidsProgress." + s); return raw ? JSON.parse(raw) : { wrongCounts: {}, sessions: 0, totalCorrect: 0, totalWrong: 0 }; }
  function saveProgress(s, p) { localStorage.setItem("kidsProgress." + s, JSON.stringify(p)); }
  function recordResult(en, ok) { if (!currentStudent || !en) return; const p = getProgress(currentStudent); if (!p.wrongCounts) p.wrongCounts = {}; if (!ok) { p.wrongCounts[en] = (p.wrongCounts[en] || 0) + 1; p.totalWrong = (p.totalWrong || 0) + 1; } else { p.totalCorrect = (p.totalCorrect || 0) + 1; if (p.wrongCounts[en] > 0) p.wrongCounts[en] = Math.max(0, p.wrongCounts[en] - 1); } saveProgress(currentStudent, p); }
  function seeded(s0) { let s = 0; for (const c of s0) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; }; }
  function akey(en) { return (typeof wordAudioKey === "function") ? wordAudioKey(en) : String(en).toLowerCase().replace(/[^a-z0-9]+/g, ""); }
  let _au = null;
  function playUrl(url, fb) { if (_au) _au.pause(); const a = new Audio(url); _au = a; a.play().catch(() => { if (fb && window.speechSynthesis) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(fb); u.lang = "en-US"; u.rate = .85; speechSynthesis.speak(u); } }); }
  window.__pw = en => playUrl(WORD_AUDIO + akey(en) + ".mp3", en);
  window.__pwd = key => playUrl("../audio/weekdrill/" + WDID + "/" + key + ".mp3");

  // 干擾選項（en 不同、zh 也不同）
  function distinctChoices(answerWord, pool, rnd) {
    const shuffled = shuffleArr(pool.filter(x => x.en !== answerWord.en), rnd);
    const usedEn = new Set([answerWord.en]), usedZh = new Set([answerWord.zh]), picks = [];
    for (const x of shuffled) { if (picks.length >= 3) break; if (usedEn.has(x.en) || usedZh.has(x.zh)) continue; usedEn.add(x.en); usedZh.add(x.zh); picks.push(x); }
    for (const x of shuffled) { if (picks.length >= 3) break; if (picks.indexOf(x) < 0 && x.en !== answerWord.en) picks.push(x); }
    return shuffleArr([answerWord, ...picks], rnd);
  }
  function shuffleArr(a, rnd) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor((rnd ? rnd() : Math.random()) * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

  function buildDrill() {
    const ctx = vocabWeekForDate(DRILL_DATE), week = ctx.week, month = ctx.month, rnd = seeded(DRILL_DATE);
    const words = week.words;
    const wd = (typeof weekDrillFor === "function") ? weekDrillFor(month.month, week.n) : null;
    WDID = month.month + "-" + week.n;
    // ① 英聽選擇 6
    const s1 = shuffleArr(words, rnd).slice(0, 6).map(w => ({ en: w.en, choices: distinctChoices(w, words, rnd).map(o => ({ label: o.en, correct: o.en === w.en })) }));
    // ⑤ 圖片題 6（優先有 emoji 的）
    const emo = en => (typeof WORD_EMOJI !== "undefined") ? WORD_EMOJI[en] : null;
    let pic = shuffleArr(words.filter(w => emo(w.en)), rnd);
    if (pic.length < 6) pic = pic.concat(shuffleArr(words.filter(w => !emo(w.en) && pic.indexOf(w) < 0), rnd));
    const s5 = pic.slice(0, 6).map(w => ({ emoji: emo(w.en) || null, zh: w.zh, en: w.en, choices: distinctChoices(w, words, rnd).map(o => ({ label: o.en, correct: o.en === w.en })) }));
    // ② 英聽填空：從池抽 5（依日期，不同天不一樣）
    const lbPool = wd ? wd.listenBlank.map((q, i) => ({ ...q, _i: i })) : [];
    const s2 = shuffleArr(lbPool, rnd).slice(0, 5).map(q => {
      const ansW = { en: q.answer, zh: "" };
      const ch = distinctChoices(ansW, words.concat(lbPool.map(x => ({ en: x.answer, zh: "" }))), rnd).map(o => ({ label: o.en, correct: o.en === q.answer }));
      return { key: "lb" + q._i, display: q.display, choices: ch };
    });
    // ③ 閱讀：依日期輪替挑 1 篇（連續幾天不會同一篇）
    let s3 = null;
    if (wd) {
      const dnum = parseInt(DRILL_DATE.replace(/-/g, ""), 10) || 0;
      const ri = dnum % wd.reading.length;
      const r = wd.reading[ri];
      s3 = { key: "passage" + ri, passage: r.passage, questions: r.questions.map(q => ({ q: q.q, choices: shuffleArr(q.choices, rnd).map(c => ({ label: c, correct: c === q.answer })) })) };
    }
    // ④ 句子重組：從池抽 4
    const roPool = wd ? wd.reorder.map((q, i) => ({ ...q, _i: i })) : [];
    const s4 = shuffleArr(roPool, rnd).slice(0, 4).map(q => ({ key: "ro" + q._i, sentence: q.sentence, chunks: shuffleArr(q.chunks, rnd) }));
    return { week, month, s1, s2, s3, s4, s5, hasWd: !!wd };
  }

  function optsHtml(sec, qi, choices) { return `<div class="opts">${choices.map((c, ci) => `<button class="opt" onclick="__ans('${sec}',${qi},${ci},this)">${c.label}</button>`).join("")}</div>`; }

  function render() {
    const w = DRILL.week, m = DRILL.month;
    let h = `<div class="meta">📒 ${m.label} 第 ${w.n} 週 · ${w.theme} · 文法：${m.grammar.map(g => g.topic).join("、")}</div>`;
    // ①
    h += `<div class="sec"><div class="sec-h">① 英聽選擇</div><div class="sec-d">點 🔊 聽單字，選出正確英文</div>`;
    DRILL.s1.forEach((q, i) => { h += `<div class="q"><div class="q-no">${i + 1}.</div><button class="play" onclick="__pw('${q.en.replace(/'/g, "\\'")}')">🔊 點我聽</button>${optsHtml('s1', i, q.choices)}</div>`; });
    h += `</div>`;
    // ②
    if (DRILL.hasWd) {
      h += `<div class="sec"><div class="sec-h">② 英聽填空</div><div class="sec-d">點 🔊 聽整句，選出空格的字</div>`;
      DRILL.s2.forEach((q, i) => { h += `<div class="q"><div class="q-no">${i + 1}.</div><button class="play" onclick="__pwd('${q.key}')">🔊 聽整句</button><div class="blank">${q.display}</div>${optsHtml('s2', i, q.choices)}</div>`; });
      h += `</div>`;
      // ③
      h += `<div class="sec"><div class="sec-h">③ 閱讀選擇</div><div class="sec-d">先 🔊 聽短文，再回答問題</div>
        <button class="play" onclick="__pwd('${DRILL.s3.key}')" style="margin-bottom:8px">🔊 唸短文</button>
        <div class="passage">${DRILL.s3.passage}</div>`;
      DRILL.s3.questions.forEach((q, i) => { h += `<div class="q"><div class="q-no">${i + 1}. ${q.q}</div>${optsHtml('s3', i, q.choices)}</div>`; });
      h += `</div>`;
      // ④
      h += `<div class="sec"><div class="sec-h">④ 句子重組</div><div class="sec-d">點詞塊照順序排成正確句子（可 🔊 聽）</div>`;
      DRILL.s4.forEach((q, i) => { h += `<div class="q" id="ro_${i}"><div class="q-no">${i + 1}. <button class="play" style="padding:4px 10px;font-size:.8rem" onclick="__pwd('${q.key}')">🔊</button></div>
        <div class="answ" id="answ_${i}"></div>
        <div class="chunks" id="chunks_${i}">${q.chunks.map((c, ci) => `<button class="chunk" id="ch_${i}_${ci}" onclick="__roPick(${i},${ci})">${c}</button>`).join("")}</div>
        <div class="ro-fb" id="rofb_${i}"></div></div>`; });
      h += `</div>`;
    }
    // ⑤
    h += `<div class="sec"><div class="sec-h">⑤ 圖片題</div><div class="sec-d">看圖（或中文）選出正確英文</div>`;
    DRILL.s5.forEach((q, i) => { h += `<div class="q"><div class="q-no">${i + 1}.</div>${q.emoji ? `<div class="emoji">${q.emoji}</div>` : `<div class="prompt">${q.zh}</div>`}${optsHtml('s5', i, q.choices)}</div>`; });
    h += `</div>`;
    h += `<button class="gobtn" onclick="__showTotal()">看總成績 🎉</button><div id="totalBox"></div>`;
    const app = document.getElementById("app"); app.innerHTML = h; app.style.display = "block";
    // 計分容器
    ['s1', 's2', 's3', 's5'].forEach(s => sectionScores[s] = [0, (DRILL[s] && (DRILL[s].questions ? DRILL[s].questions.length : DRILL[s].length)) || 0]);
    sectionScores.s3 = [0, DRILL.s3 ? DRILL.s3.questions.length : 0];
    sectionScores.s4 = [0, DRILL.s4.length];
  }

  window.__ans = (sec, qi, ci, btn) => {
    const box = btn.closest('.q'); if (box.dataset.done) return; box.dataset.done = "1";
    const list = (sec === 's3') ? DRILL.s3.questions[qi].choices : DRILL[sec][qi].choices;
    const ok = list[ci].correct;
    box.querySelectorAll('.opt').forEach((b, bi) => { b.disabled = true; if (list[bi].correct) b.classList.add('ok'); else if (bi === ci) b.classList.add('no'); });
    if (ok) sectionScores[sec][0]++;
    if (sec === 's1' || sec === 's5') recordResult(DRILL[sec][qi].en, ok);
  };

  // 句子重組
  const roState = {};
  window.__roPick = (qi, ci) => {
    const q = DRILL.s4[qi]; if (!roState[qi]) roState[qi] = []; if (document.getElementById('ro_' + qi).dataset.done) return;
    const chip = document.getElementById('ch_' + qi + '_' + ci); if (chip.classList.contains('used')) return;
    chip.classList.add('used'); roState[qi].push({ ci, text: q.chunks[ci] });
    renderAnsw(qi);
    if (roState[qi].length === q.chunks.length) checkRo(qi);
  };
  function renderAnsw(qi) {
    const el = document.getElementById('answ_' + qi);
    el.innerHTML = roState[qi].map((s, k) => `<span class="slot" onclick="__roUndo(${qi},${k})">${s.text}</span>`).join("");
  }
  window.__roUndo = (qi, k) => {
    if (document.getElementById('ro_' + qi).dataset.done) return;
    const s = roState[qi].splice(k, 1)[0]; if (s) document.getElementById('ch_' + qi + '_' + s.ci).classList.remove('used');
    renderAnsw(qi);
  };
  function checkRo(qi) {
    const q = DRILL.s4[qi], box = document.getElementById('ro_' + qi); box.dataset.done = "1";
    const got = roState[qi].map(s => s.text).join(" ");
    const ok = got === q.sentence;
    const fb = document.getElementById('rofb_' + qi);
    fb.textContent = ok ? "✓ 正確！" : "✗ 正解：" + q.sentence;
    fb.style.color = ok ? "#2fbf71" : "#ef476f";
    if (ok) sectionScores.s4[0]++;
  }

  window.__showTotal = () => {
    let c = 0, t = 0, perfect = 0;
    Object.keys(sectionScores).forEach(k => { c += sectionScores[k][0]; t += sectionScores[k][1]; if (sectionScores[k][1] > 0 && sectionScores[k][0] === sectionScores[k][1]) perfect++; });
    const msg = awardCoins(c, perfect);
    document.getElementById('totalBox').innerHTML = `<div class="total"><div class="s">🎉 答對 ${c} / ${t}！</div><div class="c">${msg}</div></div>`;
    document.getElementById('totalBox').scrollIntoView({ behavior: "smooth" });
  };

  function awardCoins(correct, perfect) {
    if (!currentStudent) return "登入後才能拿金幣喔";
    const p = getProgress(currentStudent);
    if (!p.coins) p.coins = { balance: 0, lifetimeEarned: 0, lifetimeSpent: 0, transactions: [], claimedDrills: {} };
    const ID = DRILL_DATE + "-" + DRILL_THEME, claimKey = DRILL_DATE + "::" + ID;
    if (p.coins.claimedDrills[claimKey]) return `🪙 今天這份的金幣已經領過囉（共 ${p.coins.balance} 金幣）`;
    const earned = correct * 5 + perfect * 10 + 30;
    p.coins.balance += earned; p.coins.lifetimeEarned += earned;
    p.coins.transactions.push({ type: "earn", source: "dailyDrill", amount: earned, balanceAfter: p.coins.balance, createdAt: new Date().toISOString(), meta: { drillId: ID, date: DRILL_DATE, correct } });
    p.coins.claimedDrills[claimKey] = { claimedAt: new Date().toISOString(), earned, correct };
    saveProgress(currentStudent, p);
    if (typeof cloudSave === "function") cloudSave(currentStudent);
    return `🪙 +${earned} 金幣！（共 ${p.coins.balance} 金幣）<br><a href="../island.html" style="color:#2f80ed;font-weight:700">👉 去蓋我的島嶼</a>`;
  }

  function showLock() { const a = document.getElementById("app"); a.innerHTML = `<div class="lock"><div style="font-size:3rem">🔒</div><h2>這份測驗還沒開放</h2><p>${DRILL_DATE} 才開始喔！</p><a href="../index.html">← 回首頁</a></div>`; a.style.display = "block"; }

  window.selectStudent = function (name) {
    if (typeof requireUnlock === "function" && !requireUnlock(name)) return;
    if (todayStr() < DRILL_DATE && name !== "test") { showLock(); return; }
    currentStudent = name; localStorage.setItem("kidsCurrentStudent", name);
    document.querySelectorAll(".stu-btn").forEach(b => b.classList.toggle("active", b.textContent.toLowerCase().includes(name)));
    const p = getProgress(name); p.sessions = (p.sessions || 0) + 1; saveProgress(name, p);
    DRILL = buildDrill(); render();
  };
  function init() {
    const isTest = localStorage.getItem("kidsCurrentStudent") === "test";
    if (todayStr() < DRILL_DATE && !isTest) { showLock(); return; }
    if (!window.sbClient) { const last = localStorage.getItem("kidsCurrentStudent"); if (last) window.selectStudent(last); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
