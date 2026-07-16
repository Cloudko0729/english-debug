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
  .pic-wrap{display:flex;justify-content:center;margin:4px 0}
  .pic-img{width:120px;height:auto;max-height:110px;object-fit:contain;border-radius:10px;background:#fff;border:1px solid #e2e8f0}
  .prompt{font-size:1.2rem;font-weight:800;text-align:center;color:#243042;margin:4px 0}
  .blank{font-size:1.05rem;text-align:center;margin:8px 0;color:#243042}
  .opts{display:flex;flex-direction:column;gap:7px;margin-top:8px}
  .opt{padding:10px 12px;border:2px solid #e2e8f0;border-radius:10px;background:#fff;cursor:pointer;font-weight:600;text-align:left}
  .opt.ok{border-color:#2fbf71;background:#d9f7e8}
  .opt.no{border-color:#ef476f;background:#fde0e8}
  .passage{background:#f7faff;border:1px solid #d8e6ff;border-radius:10px;padding:11px 13px;line-height:1.7;margin:8px 0}
  .teach{background:#f3f0ff;border:1px solid #ddd3ff;border-radius:10px;padding:10px 12px;margin:6px 0 10px}
  .teach .tip{font-size:.9rem;color:#4b3a8f;font-weight:700;margin-bottom:8px}
  .wordrow{display:flex;gap:8px;flex-wrap:wrap}
  .wchip{padding:8px 14px;border:2px solid #7c4dca;border-radius:10px;background:#fff;color:#4b3a8f;font-weight:800;font-size:1rem;cursor:pointer}
  .phword{border-top:1px dashed #d8ccf5;padding:8px 0 6px;margin-top:6px}
  .phword:first-of-type{border-top:none;margin-top:0}
  .phtop{display:flex;align-items:center;gap:10px}
  .phzh{color:#555;font-size:.9rem;font-weight:700}
  .phex{margin-top:4px;display:flex;align-items:center;gap:7px;font-size:.92rem;color:#333}
  .skel{margin:7px 0;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
  .rolechip{color:#fff;font-weight:800;border-radius:8px;padding:4px 10px;font-size:.95rem}
  .skzh{color:#888;font-size:.82rem}
  .gloss{background:#fffbe9;border:1px solid #ffe9a8;border-radius:10px;padding:9px 12px;margin:0 0 8px;font-size:.86rem}
  .gloss b{display:block;color:#a06a00;margin-bottom:4px;font-size:.82rem}
  .gloss .gi{margin:2px 0;color:#555}
  .gloss .ge{font-weight:800;color:#243042}
  .gcfix{margin-top:8px;background:#eef5ff;border:1.5px solid #bcd6ff;border-radius:9px;padding:7px 11px;font-size:.88rem;font-weight:700}
  .gcfix a{color:#1e5fb8;text-decoration:none}
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
  function recordResult(en, ok) {
    if (!currentStudent || !en) return; const p = getProgress(currentStudent); if (!p.wrongCounts) p.wrongCounts = {};
    if (!ok) { p.wrongCounts[en] = (p.wrongCounts[en] || 0) + 1; p.totalWrong = (p.totalWrong || 0) + 1; }
    else {
      p.totalCorrect = (p.totalCorrect || 0) + 1; if (p.wrongCounts[en] > 0) p.wrongCounts[en] = Math.max(0, p.wrongCounts[en] - 1);
      if (typeof dexRecord === "function") { const r = dexRecord(p, en); if (r && r.isNew) dexToast("🎴 收集到「" + en + "」！"); else if (r && r.starUp) dexToast("⭐ 「" + en + "」升到 " + "★".repeat(r.stars) + "！"); }
    }
    saveProgress(currentStudent, p);
  }
  let _dtTimer = null;
  function dexToast(msg) {
    let el = document.getElementById("dexToast");
    if (!el) { el = document.createElement("div"); el.id = "dexToast"; el.style.cssText = "position:fixed;top:14px;left:50%;transform:translateX(-50%);background:#243042;color:#ffd24d;padding:9px 18px;border-radius:20px;font-weight:800;font-size:.9rem;z-index:9999;transition:opacity .3s;font-family:Arial,'Noto Sans TC',sans-serif"; document.body.appendChild(el); }
    el.textContent = msg; el.style.opacity = "1";
    clearTimeout(_dtTimer); _dtTimer = setTimeout(() => el.style.opacity = "0", 1800);
  }
  function seeded(s0) { let s = 0; for (const c of s0) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; }; }
  function akey(en) { return (typeof wordAudioKey === "function") ? wordAudioKey(en) : String(en).toLowerCase().replace(/[^a-z0-9]+/g, ""); }
  let _au = null;
  function playUrl(url, fb) { if (_au) _au.pause(); const a = new Audio(url); _au = a; a.play().catch(() => { if (fb && window.speechSynthesis) { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(fb); u.lang = "en-US"; u.rate = .85; speechSynthesis.speak(u); } }); }
  window.__pw = en => playUrl(WORD_AUDIO + akey(en) + ".mp3", en);
  window.__pwd = key => playUrl("../audio/weekdrill/" + WDID + "/" + key + ".mp3");
  window.__pst = (key, fb) => playUrl("../audio/structure/" + key + ".mp3", fb);

  // 干擾選項（en 不同、zh 也不同）
  function distinctChoices(answerWord, pool, rnd) {
    const shuffled = shuffleArr(pool.filter(x => x.en !== answerWord.en), rnd);
    const usedEn = new Set([answerWord.en]), usedZh = new Set([answerWord.zh]), picks = [];
    for (const x of shuffled) { if (picks.length >= 3) break; if (usedEn.has(x.en) || usedZh.has(x.zh)) continue; usedEn.add(x.en); usedZh.add(x.zh); picks.push(x); }
    for (const x of shuffled) { if (picks.length >= 3) break; if (picks.indexOf(x) < 0 && x.en !== answerWord.en) picks.push(x); }
    return shuffleArr([answerWord, ...picks], rnd);
  }
  function shuffleArr(a, rnd) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor((rnd ? rnd() : Math.random()) * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

  // 分塊輪替：同一週用固定順序(seed=週)，第 dayIdx 天取一段不重疊區塊。
  // 池大小 >= 2×每日題數 → 隔天保證不重複；整週平均分散、出現次數最少。
  // retake（同日重測，金幣已領過）→ 改成全隨機抽，當純練習，每次都不同。
  function pickBlock(pool, k, dayIdx, seedStr, retake) {
    if (!pool.length) return [];
    if (retake) return shuffleArr(pool).slice(0, k);
    const order = shuffleArr(pool, seeded(seedStr));
    const start = ((dayIdx * k) % order.length + order.length) % order.length;
    return order.concat(order).slice(start, start + k);
  }
  // 短週（週長 ≤5 天，如換週制的過渡週）：領完金幣後再開，出「第 2 輪」全新題組補足題量
  function _weekDays() {
    try {
      const w = vocabWeekForDate(DRILL_DATE).week;
      return Math.round((Date.parse(w.end) - Date.parse(w.start)) / 86400000) + 1;
    } catch (e) { return 7; }
  }
  function _isShortWeek() { return _weekDays() <= 5; }
  function _isRetake() {
    if (!currentStudent) return false;
    const p = getProgress(currentStudent);
    const claimKey = DRILL_DATE + "::" + DRILL_DATE + "-" + DRILL_THEME;
    return !!(p.coins && p.coins.claimedDrills && p.coins.claimedDrills[claimKey]);
  }

  function buildDrill() {
    const ctx = vocabWeekForDate(DRILL_DATE), week = ctx.week, month = ctx.month;
    const retaken = _isRetake();
    const round2 = retaken && _isShortWeek();          // 短週第 2 輪：固定出「下一組」新題（補足題量）
    const retake = retaken && !_isShortWeek();         // 一般週重測 → 全隨機
    const rnd = retake ? null : seeded(DRILL_DATE + (round2 ? "-r2" : ""));
    const words = week.words;
    const wd = (typeof weekDrillFor === "function") ? weekDrillFor(month.month, week.n) : null;
    WDID = month.month + "-" + week.n;
    const baseIdx = Math.max(0, Math.round((Date.parse(DRILL_DATE) - Date.parse(week.start)) / 86400000));
    const dayIdx = baseIdx + (round2 ? _weekDays() : 0);   // 第 2 輪 → 題塊往後跳一週長，不重複

    // ① 英聽選擇 6（分塊輪替；重測→隨機）
    const s1 = pickBlock(words, 6, dayIdx, WDID + "-v", retake).map(w => ({ en: w.en, choices: distinctChoices(w, words, rnd).map(o => ({ label: o.en, correct: o.en === w.en })) }));

    // ⑤ 圖片題 6：本週可圖示字 + 小學程度較難可圖示字（池固定/週），分塊輪替
    // 顯示優先序：WORD_IMAGE（生成圖）→ WORD_EMOJI → 不進圖片題
    const img = en => (typeof WORD_IMAGE !== "undefined") ? WORD_IMAGE[en] : null;
    const emo = en => (typeof WORD_EMOJI !== "undefined") ? WORD_EMOJI[en] : null;
    const hasVisual = en => !!(img(en) || emo(en));
    const weekPic = words.filter(w => hasVisual(w.en)).map(w => ({ en: w.en, zh: w.zh }));
    let basicPic = [];
    if (typeof WORDBANK !== "undefined") basicPic = WORDBANK
      .filter(w => w.level === "basic" && hasVisual(w.en) && String(w.en).length >= 5 && !words.some(x => x.en === w.en))
      .map(w => ({ en: w.en, zh: w.zh }));
    const picPool = weekPic.concat(shuffleArr(basicPic, seeded(WDID + "-pb")).slice(0, 24));
    // 圖片題干擾選項避開易混詞（cabinet/closet/dresser、lake/river/stream 這類）
    function picChoices(answerWord, pool, rnd) {
      const confuse = (typeof imageConfusesWith === "function") ? imageConfusesWith(answerWord.en) : null;
      const safePool = confuse ? pool.filter(x => !confuse.has(x.en)) : pool;
      return distinctChoices(answerWord, safePool.length >= 4 ? safePool : pool, rnd);
    }
    const s5 = pickBlock(picPool, 6, dayIdx, WDID + "-pic", retake).map(w => ({ img: img(w.en), emoji: emo(w.en), zh: w.zh, en: w.en, choices: picChoices(w, picPool, rnd).map(o => ({ label: o.en, correct: o.en === w.en })) }));

    // ② 英聽填空 5（分塊輪替）
    const lbPool = wd ? wd.listenBlank.map((q, i) => ({ ...q, _i: i })) : [];
    const s2 = pickBlock(lbPool, 5, dayIdx, WDID + "-lb", retake).map(q => {
      const ansW = { en: q.answer, zh: "" };
      const ch = distinctChoices(ansW, words.concat(lbPool.map(x => ({ en: x.answer, zh: "" }))), rnd).map(o => ({ label: o.en, correct: o.en === q.answer }));
      return { key: "lb" + q._i, display: q.display, choices: ch };
    });

    // ③ 閱讀：依天數輪替挑 1 篇（一週內各天不同篇）
    let s3 = null;
    if (wd) {
      const ri = retake ? Math.floor(Math.random() * wd.reading.length) : (dayIdx % wd.reading.length);
      const r = wd.reading[ri];
      const gloss = (typeof passageGlossary === "function") ? passageGlossary(WDID, ri) : [];
      s3 = { key: "passage" + ri, passage: r.passage, glossary: gloss, questions: r.questions.map(q => ({ q: q.q, choices: shuffleArr(q.choices, rnd).map(c => ({ label: c, correct: c === q.answer })) })) };
    }

    // ④ 句子重組 4（分塊輪替）
    const roPool = wd ? wd.reorder.map((q, i) => ({ ...q, _i: i })) : [];
    const s4 = pickBlock(roPool, 4, dayIdx, WDID + "-ro", retake).map(q => ({ key: "ro" + q._i, sentence: q.sentence, chunks: shuffleArr(q.chunks, rnd) }));

    // ⑥ 今日發音（詞族解碼，依日期輪替單元）
    let s6 = null;
    if (typeof phonicsUnitFor === "function") {
      const u = phonicsUnitFor(DRILL_DATE);
      const qs = [];
      // Q1/Q2：聽音選拼字（family 內辨音，兩題不同目標字）
      const off = retake ? Math.floor(Math.random() * u.words.length) : dayIdx;
      const t1 = u.words[off % u.words.length].en, t2 = u.words[(off + 2) % u.words.length].en;
      [t1, t2].forEach(t => qs.push({ kind: "listen", en: t, choices: shuffleArr(u.words.map(w => ({ label: w.en, correct: w.en === t })), rnd) }));
      // Q3：同家族判斷（視覺規則，不用語音）
      qs.push({ kind: "family", q: `哪一個字也是「${u.title.replace(/（.*/, "")}」家族？`, choices: shuffleArr([{ label: u.bonus, correct: true }, ...u.non.map(x => ({ label: x, correct: false }))], rnd) });
      s6 = { unit: u, qs };
    }

    // ⑦ 句型積木（顏色標角色，依日期輪替骨架）
    let s7 = null;
    if (typeof skeletonUnitFor === "function") {
      const u = skeletonUnitFor(DRILL_DATE);
      const qs = u.quiz.map(q => {
        if (q.type === "order") return { kind: "mc", q: q.q, choices: shuffleArr([{ label: q.answer, correct: true }, ...q.wrong.map(x => ({ label: x, correct: false }))], rnd) };
        if (q.type === "slot") return { kind: "mc", q: q.q, choices: shuffleArr([{ label: q.answer, correct: true }, ...q.wrong.map(x => ({ label: x, correct: false }))], rnd) };
        const correct = u.examples[q.ex].parts.join(" ");
        return { kind: "mc", q: q.q, audio: u.id + "_e" + q.ex, choices: shuffleArr(q.options.map(o => ({ label: o, correct: o === correct })), rnd) };
      });
      s7 = { unit: u, qs };
    }

    // ⑧ 文法（根基課程進度）：主要出「目前單元」，已開放多單元時混 1 題舊單元複習
    let s8 = null;
    if (typeof gcProgress === "function" && typeof GC_QUIZ !== "undefined") {
      const gp = gcProgress(DRILL_DATE);
      if (gp) {
        const cur = gp.current;
        const mk = (raw, unit) => ({ q: raw.q, unit, choices: shuffleArr(raw.choices.map(c => ({ label: c, correct: c === raw.answer })), rnd) });
        const pool = GC_QUIZ[cur.id].map((q, i) => ({ ...q, _i: i }));
        let qs = pickBlock(pool, 3, dayIdx, WDID + "-gc-" + cur.id, retake).map(q => mk(q, cur));
        if (gp.opened.length > 1) {
          const prevList = gp.opened.slice(0, -1);
          const prevU = prevList[retake ? Math.floor(Math.random() * prevList.length) : dayIdx % prevList.length];
          const ppool = GC_QUIZ[prevU.id].map((q, i) => ({ ...q, _i: i }));
          qs = qs.slice(0, 2).concat(pickBlock(ppool, 1, dayIdx, WDID + "-gcr", retake).map(q => mk(q, prevU)));
        }
        s8 = { current: cur, qs };
      }
    }

    return { week, month, s1, s2, s3, s4, s5, s6, s7, s8, hasWd: !!wd };
  }

  function optsHtml(sec, qi, choices) { return `<div class="opts">${choices.map((c, ci) => `<button class="opt" onclick="__ans('${sec}',${qi},${ci},this)">${c.label}</button>`).join("")}</div>`; }

  function render() {
    const w = DRILL.week, m = DRILL.month;
    const retakeNote = !_isRetake() ? ""
      : (_isShortWeek() ? "<br>📚 短週補題 第 2 輪：全新題組（金幣今天已領過）"
                        : "<br>🔁 練習模式：今天金幣已領過，題目改成隨機出");
    const gramNote = DRILL.s8 ? `文法課程：${DRILL.s8.current.icon} ${DRILL.s8.current.name}` : `文法：${m.grammar.map(g => g.topic).join("、")}`;
    let h = `<div class="meta">📒 ${m.label} 第 ${w.n} 週 · ${w.theme} · ${gramNote}${retakeNote}</div>`;
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
      if (DRILL.s3.glossary && DRILL.s3.glossary.length) h += `<div class="gloss"><b>📖 生字</b>${DRILL.s3.glossary.map(g => `<div class="gi"><span class="ge">${g.en}</span> ${g.zh}</div>`).join("")}</div>`;
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
    DRILL.s5.forEach((q, i) => {
      const fallbackVisual = (q.emoji ? `<div class=emoji>${q.emoji}</div>` : `<div class=prompt>${q.zh}</div>`).replace(/'/g, "\\'").replace(/"/g, "&quot;");
      const visual = q.img
        ? `<div class="pic-wrap"><img class="pic-img" src="../${q.img}" alt="${q.en}" loading="lazy" onerror="this.outerHTML='${fallbackVisual}'"></div>`
        : (q.emoji ? `<div class="emoji">${q.emoji}</div>` : `<div class="prompt">${q.zh}</div>`);
      h += `<div class="q"><div class="q-no">${i + 1}.</div>${visual}${optsHtml('s5', i, q.choices)}</div>`;
    });
    h += `</div>`;
    // ⑥ 今日發音
    if (DRILL.s6) {
      const u = DRILL.s6.unit;
      h += `<div class="sec"><div class="sec-h">⑥ 今日發音 — ${u.title}</div><div class="sec-d">先聽規則、跟著念，再作答</div>
        <div class="teach"><div class="tip">💡 ${u.tip}</div>
        ${u.words.map((w, wi) => `<div class="phword">
          <div class="phtop"><button class="wchip" onclick="__pw('${w.en}')">🔊 ${w.en}</button><span class="phzh">${w.zh}</span></div>
          <div class="phex"><button class="play" style="padding:3px 9px;font-size:.75rem" onclick="__pst('ph_${u.id}_${wi}','${w.ex.replace(/'/g, "\\'")}')">🔊</button> ${w.ex}</div>
        </div>`).join("")}</div>`;
      DRILL.s6.qs.forEach((q, i) => {
        if (q.kind === "listen") h += `<div class="q"><div class="q-no">${i + 1}. <span class="sub">聽發音，選出聽到的字</span></div><button class="play" onclick="__pw('${q.en}')">🔊 點我聽</button>${optsHtml('s6', i, q.choices)}</div>`;
        else h += `<div class="q"><div class="q-no">${i + 1}. ${q.q}</div>${optsHtml('s6', i, q.choices)}</div>`;
      });
      h += `</div>`;
    }
    // ⑦ 句型積木
    if (DRILL.s7) {
      const u = DRILL.s7.unit;
      h += `<div class="sec"><div class="sec-h">⑦ 句型積木 — ${u.name}</div><div class="sec-d">看顏色記住句子的「形狀」：${u.roles.map(r => `<span style="color:${r.c};font-weight:800">${r.t}</span>`).join(" ＋ ")}</div>
        <div class="teach">${u.examples.map((e, i) => `<div class="skel"><button class="play" style="padding:4px 10px;font-size:.8rem" onclick="__pst('${u.id}_e${i}','${e.parts.join(" ").replace(/'/g, "\\'")}')">🔊</button> ${e.parts.map((p, pi) => `<span class="rolechip" style="background:${u.roles[Math.min(pi, u.roles.length - 1)].c}">${p}</span>`).join(" ")} <span class="skzh">${e.zh}</span></div>`).join("")}</div>`;
      DRILL.s7.qs.forEach((q, i) => {
        h += `<div class="q"><div class="q-no">${i + 1}. ${q.q}</div>${q.audio ? `<button class="play" onclick="__pst('${q.audio}','')">🔊 點我聽</button>` : ""}${optsHtml('s7', i, q.choices)}</div>`;
      });
      h += `</div>`;
    }
    // ⑧ 文法（根基課程）
    if (DRILL.s8) {
      h += `<div class="sec"><div class="sec-h">⑧ 文法 — ${DRILL.s8.current.icon} ${DRILL.s8.current.name}</div><div class="sec-d">文法根基課程進度題；答錯會出現複習連結，點過去看單元</div>`;
      DRILL.s8.qs.forEach((q, i) => { h += `<div class="q"><div class="q-no">${i + 1}. ${q.q}</div>${optsHtml('s8', i, q.choices)}</div>`; });
      h += `</div>`;
    }
    h += `<button class="gobtn" onclick="__showTotal()">看總成績 🎉</button><div id="totalBox"></div>`;
    const app = document.getElementById("app"); app.innerHTML = h; app.style.display = "block";
    // 計分容器
    ['s1', 's2', 's5'].forEach(s => sectionScores[s] = [0, (DRILL[s] || []).length]);
    sectionScores.s3 = [0, DRILL.s3 ? DRILL.s3.questions.length : 0];
    sectionScores.s4 = [0, DRILL.s4.length];
    sectionScores.s6 = [0, DRILL.s6 ? DRILL.s6.qs.length : 0];
    sectionScores.s7 = [0, DRILL.s7 ? DRILL.s7.qs.length : 0];
    sectionScores.s8 = [0, DRILL.s8 ? DRILL.s8.qs.length : 0];
  }

  window.__ans = (sec, qi, ci, btn) => {
    const box = btn.closest('.q'); if (box.dataset.done) return; box.dataset.done = "1";
    const list = (sec === 's3') ? DRILL.s3.questions[qi].choices
               : (sec === 's6' || sec === 's7' || sec === 's8') ? DRILL[sec].qs[qi].choices
               : DRILL[sec][qi].choices;
    const ok = list[ci].correct;
    box.querySelectorAll('.opt').forEach((b, bi) => { b.disabled = true; if (list[bi].correct) b.classList.add('ok'); else if (bi === ci) b.classList.add('no'); });
    if (ok) sectionScores[sec][0]++;
    if (sec === 's1' || sec === 's5') recordResult(DRILL[sec][qi].en, ok);
    // 文法題答錯 → 給課程複習連結（開新分頁）
    if (!ok && sec === 's8') {
      const u = DRILL.s8.qs[qi].unit;
      const d = document.createElement('div');
      d.className = 'gcfix';
      d.innerHTML = `📘 這題的觀念在 <a href="../grammar_core/${u.id}.html" target="_blank" rel="noopener">${u.icon}「${u.name}」單元</a>，點過去複習一下！`;
      box.appendChild(d);
    }
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
    const extra = _isShortWeek() ? "<br>📚 短週補題：再開一次這份測驗，會有第 2 輪全新題目！" : "";
    return `🪙 +${earned} 金幣！${extra}（共 ${p.coins.balance} 金幣）<br><a href="../island.html" style="color:#2f80ed;font-weight:700">👉 去蓋我的島嶼</a>`;
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
