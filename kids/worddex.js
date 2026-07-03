// 單字圖鑑：答對收集卡片、不同天答對升星（★=收集、★★=3天、★★★=5天）。
// 資料存 kidsProgress.<student>.wordDex = { "<en>": ["YYYY-MM-DD", ...] }（不同天、最多留 5 筆）
// 答錯不扣星。主題(每週30字)全收集 → 解鎖島嶼地標（island.html 讀 dexThemeComplete）。
function _dexToday() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

// 答對時記錄收集（回傳 {isNew, stars, starUp} 給呼叫端顯示回饋）
function dexRecord(p, en) {
  if (!p || !en) return null;
  if (!p.wordDex) p.wordDex = {};
  const key = String(en).toLowerCase();
  const days = p.wordDex[key] || [];
  const today = _dexToday();
  const before = dexStars(days);
  const isNew = days.length === 0;
  if (!days.includes(today) && days.length < 5) days.push(today);
  p.wordDex[key] = days;
  const after = dexStars(days);
  return { isNew, stars: after, starUp: after > before };
}
function dexStars(days) {
  const n = (days || []).length;
  return n >= 5 ? 3 : n >= 3 ? 2 : n >= 1 ? 1 : 0;
}
function dexGet(p, en) { return (p && p.wordDex && p.wordDex[String(en).toLowerCase()]) || []; }

// 主題（週）統計：words = curriculum 該週 words
function dexThemeStats(p, words) {
  let collected = 0, stars = 0;
  words.forEach(w => { const s = dexStars(dexGet(p, w.en)); if (s > 0) collected++; stars += s; });
  return { collected, total: words.length, stars };
}
function dexThemeComplete(p, words) { const st = dexThemeStats(p, words); return st.collected >= st.total; }
// 全圖鑑總星數（美化加成用：每 10 星 +1 美化）
function dexTotalStars(p) {
  if (!p || !p.wordDex) return 0;
  let s = 0; for (const k in p.wordDex) s += dexStars(p.wordDex[k]);
  return s;
}

if (typeof module !== "undefined" && module.exports)
  module.exports = { dexRecord, dexStars, dexGet, dexThemeStats, dexThemeComplete, dexTotalStars };
