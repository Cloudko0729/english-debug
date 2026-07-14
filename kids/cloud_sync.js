// Kids English — 雲端同步
//   主存檔：Supabase（每個小孩各自帳號，auth.uid() 隔離）
//   雙寫：Google Apps Script + Sheets（家長可讀的試算表 + 熟練表，維持原樣）
// 沒有 Supabase session 時，自動退回「只用 Google Sheet」的舊行為，頁面照常運作。

const CLOUD_URL = "https://script.google.com/macros/s/AKfycbyZlQ609fvyiiOYIb-UegMSd2zQRSg9DoykH-aknkzZQEIl9jo71NSa4F17dLeErW3t6g/exec";
const CLOUD_SECRET = "kids2026";

function _todayStr() {
  const n = new Date();
  return n.getFullYear() + "-" +
    String(n.getMonth() + 1).padStart(2, "0") + "-" +
    String(n.getDate()).padStart(2, "0");
}

function _masteryFromProgress(progress) {
  if (typeof WORDBANK === "undefined" || !progress || !progress.wrongCounts) return null;
  const zh = {};
  WORDBANK.forEach(w => { zh[w.en] = w.zh; });
  return Object.keys(progress.wrongCounts)
    .filter(w => progress.wrongCounts[w] > 0)
    .map(w => ({
      en: w, zh: zh[w] || "", wrong: progress.wrongCounts[w],
      status: progress.wrongCounts[w] >= 2 ? "加強中" : "不熟",
    }))
    .sort((a, b) => b.wrong - a.wrong);
}

// 摘要（給選日期還原的清單用）
function _summarize(progress, island) {
  const st = (island && island.stats) || {};
  const co = (progress && progress.coins) || {};
  return {
    coins: co.balance || 0,
    population: st.population || 0,
    beauty: st.beauty || 0,
    happiness: st.happiness || 0,
    buildings: st.totalBuildings != null ? st.totalBuildings : (island && island.buildings ? island.buildings.length : 0),
    correct: (progress && progress.totalCorrect) || 0,
    wrong: (progress && progress.totalWrong) || 0,
  };
}

function _localData(student) {
  let progress = null, island = null, island2 = null;
  try { progress = JSON.parse(localStorage.getItem("kidsProgress." + student) || "null"); } catch (e) {}
  try { island = JSON.parse(localStorage.getItem("kidsIsland." + student) || "null"); } catch (e) {}
  try { island2 = JSON.parse(localStorage.getItem("kidsIsland2." + student) || "null"); } catch (e) {}
  return { progress, island, island2 };
}

// ── 二號島打包／拆包：island2 塞進 island._island2 一起同步 ──────────────────
// island 欄位是 JSON blob（Supabase jsonb / Sheets 存字串），塞巢狀欄位不用改後端 schema；
// 舊存檔沒有 _island2 也完全相容。
function _packIslands(island, island2) {
  if (!island || !island2) return island;
  return Object.assign({}, island, { _island2: island2 });
}
function _storeIslands(student, islandData) {
  if (!islandData) return;
  const isl2 = islandData._island2 || null;
  const isl1 = Object.assign({}, islandData);
  delete isl1._island2;
  localStorage.setItem("kidsIsland." + student, JSON.stringify(isl1));
  if (isl2) localStorage.setItem("kidsIsland2." + student, JSON.stringify(isl2));
}

// 取目前登入的 Supabase 使用者（沒有就 null）
async function _sbUser() {
  const sb = window.sbClient;
  if (!sb) return null;
  try { const { data } = await sb.auth.getSession(); return (data && data.session && data.session.user) || null; }
  catch (e) { return null; }
}

// ── 存檔：Supabase（若已登入）+ Google Sheet（雙寫）─────────────────────────
function cloudSave(student) {
  if (!student) return;
  const { progress, island, island2 } = _localData(student);
  const islandPacked = _packIslands(island, island2);
  const day = _todayStr();
  const summary = _summarize(progress, island);

  // 1) 雙寫 Google Sheet（維持家長可讀的試算表 + 熟練表）
  if (CLOUD_URL) {
    const payload = { secret: CLOUD_SECRET, student, ts: new Date().toISOString(), date: day, progress, island: islandPacked };
    const m = _masteryFromProgress(progress);
    if (m) payload.mastery = m;
    try { fetch(CLOUD_URL, { method: "POST", body: JSON.stringify(payload) }); } catch (e) {}
  }

  // 2) 主存檔：Supabase（需登入）
  if (!window.sbClient) { _sbDebug("no client (CDN?)"); }
  _sbUser().then(user => {
    if (!user) { _sbDebug("no session"); return; }
    const sb = window.sbClient;
    const now = new Date().toISOString();
    Promise.all([
      sb.from("saves").upsert({ user_id: user.id, student, ts: now, progress, island: islandPacked }, { onConflict: "user_id" }),
      sb.from("history").upsert(
        { user_id: user.id, student, day, client_ts: now, summary, progress, island: islandPacked },
        { onConflict: "user_id,day" }
      )
    ]).then(([s, h]) => {
      if (s && s.error) _sbDebug("saves ✗ " + s.error.message + " [" + (s.error.code || "") + "]");
      else if (h && h.error) _sbDebug("history ✗ " + h.error.message + " [" + (h.error.code || "") + "]");
      else _sbDebug("ok " + now.slice(11, 19));
    }).catch(e => _sbDebug("throw " + (e && e.message)));
  });
}

// 同步狀態：只記在背景 console + localStorage（不顯示在畫面上）
function _sbDebug(msg) {
  try {
    localStorage.setItem("kidsSbStatus", msg + " @" + new Date().toISOString());
    if (msg.indexOf("ok") === 0) { if (window.console) console.log("[sync] " + msg); }
    else if (window.console) console.warn("[sync] " + msg);
  } catch (e) {}
}

// ── 智慧同步：本機空就拉回，否則上傳備份 ─────────────────────────────────────
// 最後活動時間（用金幣交易的最新 createdAt 判斷新舊）
function _lastAct(prog) {
  const tx = prog && prog.coins && prog.coins.transactions;
  if (!tx || !tx.length) return 0;
  let m = 0; for (const t of tx) { const c = Date.parse(t.createdAt || 0) || 0; if (c > m) m = c; }
  return m;
}
function cloudSyncOnOpen(student, onRestored) {
  if (!student) return;
  let prog = null;
  try { prog = JSON.parse(localStorage.getItem("kidsProgress." + student) || "null"); } catch (e) {}
  const localEmpty = !prog ||
    (((prog.totalCorrect || 0) + (prog.totalWrong || 0)) === 0 && !(prog.coins && prog.coins.balance > 0));
  if (localEmpty) {
    cloudLoad(student).then(d => {
      if (d && d.progress) { if (typeof onRestored === "function") onRestored(); }
      else cloudSave(student);
    });
    return;
  }
  // 本機有資料 → 比對時間，雲端較新才拉雲端；本機較新或相同才推上去（避免舊本機蓋掉雲端最新）
  Promise.resolve(typeof cloudPeek === "function" ? cloudPeek(student) : null).then(cloud => {
    const cAct = _lastAct(cloud && cloud.progress), lAct = _lastAct(prog);
    if (cloud && cloud.progress && cAct > lAct + 2000) {
      localStorage.setItem("kidsProgress." + student, JSON.stringify(cloud.progress));
      if (cloud.island) _storeIslands(student, cloud.island);
      if (typeof onRestored === "function") onRestored();
    } else {
      cloudSave(student);
    }
  }).catch(() => cloudSave(student));
}

// ── 還原最新：Supabase 優先，沒登入退回 Google Sheet ────────────────────────
async function cloudLoad(student) {
  const user = await _sbUser();
  if (user) {
    try {
      const { data } = await window.sbClient.from("saves")
        .select("progress, island").eq("user_id", user.id).maybeSingle();
      if (data) {
        if (data.progress) localStorage.setItem("kidsProgress." + student, JSON.stringify(data.progress));
        if (data.island) _storeIslands(student, data.island);
        return data;
      }
      return null;
    } catch (e) { return null; }
  }
  return _gasLoad(student);
}
function _gasLoad(student) {
  if (!CLOUD_URL || !student) return Promise.resolve(null);
  return fetch(CLOUD_URL + "?student=" + encodeURIComponent(student) + "&secret=" + encodeURIComponent(CLOUD_SECRET))
    .then(r => r.json())
    .then(d => {
      if (d && d.ok) {
        if (d.progress) localStorage.setItem("kidsProgress." + student, JSON.stringify(d.progress));
        if (d.island) _storeIslands(student, d.island);
        return d;
      }
      return null;
    })
    .catch(() => null);
}

// 只「讀取」雲端最新存檔（不覆蓋本機），給登入時的「雲端 vs 暫存」選擇用
async function cloudPeek(student) {
  const user = await _sbUser();
  if (user) {
    try {
      const { data } = await window.sbClient.from("saves")
        .select("progress, island, ts").eq("user_id", user.id).maybeSingle();
      return data || null;
    } catch (e) { return null; }
  }
  if (!CLOUD_URL || !student) return null;
  return fetch(CLOUD_URL + "?student=" + encodeURIComponent(student) + "&secret=" + encodeURIComponent(CLOUD_SECRET))
    .then(r => r.json())
    .then(d => (d && d.ok) ? { progress: d.progress, island: d.island, ts: d.ts } : null)
    .catch(() => null);
}

// ── 近 10 天清單 ─────────────────────────────────────────────────────────────
async function cloudListHistory(student) {
  const user = await _sbUser();
  if (user) {
    try {
      const { data } = await window.sbClient.from("history")
        .select("day, server_ts, client_ts, summary")
        .eq("user_id", user.id).order("day", { ascending: false }).limit(10);
      return (data || []).map(r => ({ date: r.day, serverTs: r.server_ts, clientTs: r.client_ts, summary: r.summary }));
    } catch (e) { return []; }
  }
  // GAS fallback
  if (!CLOUD_URL || !student) return [];
  return fetch(CLOUD_URL + "?list=1&student=" + encodeURIComponent(student) + "&secret=" + encodeURIComponent(CLOUD_SECRET))
    .then(r => r.json()).then(d => (d && d.ok && Array.isArray(d.items)) ? d.items : []).catch(() => []);
}

// ── 還原某一天完整快照 ───────────────────────────────────────────────────────
async function cloudLoadDate(student, date) {
  const user = await _sbUser();
  if (user) {
    try {
      const { data } = await window.sbClient.from("history")
        .select("progress, island, day").eq("user_id", user.id).eq("day", date).maybeSingle();
      if (data) {
        if (data.progress) localStorage.setItem("kidsProgress." + student, JSON.stringify(data.progress));
        if (data.island) _storeIslands(student, data.island);
        return data;
      }
      return null;
    } catch (e) { return null; }
  }
  // GAS fallback
  if (!CLOUD_URL || !student || !date) return null;
  return fetch(CLOUD_URL + "?student=" + encodeURIComponent(student) + "&date=" + encodeURIComponent(date) + "&secret=" + encodeURIComponent(CLOUD_SECRET))
    .then(r => r.json()).then(d => {
      if (d && d.ok) {
        if (d.progress) localStorage.setItem("kidsProgress." + student, JSON.stringify(d.progress));
        if (d.island) _storeIslands(student, d.island);
        return d;
      }
      return null;
    }).catch(() => null);
}
