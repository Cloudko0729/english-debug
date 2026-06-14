// Kids English — Google 試算表自動同步
// 部署 Apps Script 後，把 /exec 網址貼到下面 CLOUD_URL（CLOUD_SECRET 要跟 Code.gs 一致）。
// 留空 CLOUD_URL 時所有同步自動略過，網站照常運作。
const CLOUD_URL = "https://script.google.com/macros/s/AKfycbyZlQ609fvyiiOYIb-UegMSd2zQRSg9DoykH-aknkzZQEIl9jo71NSa4F17dLeErW3t6g/exec";
const CLOUD_SECRET = "kids2026";

function _masteryFromProgress(progress) {
  if (typeof WORDBANK === "undefined" || !progress || !progress.wrongCounts) return null;
  const zh = {};
  WORDBANK.forEach(w => { zh[w.en] = w.zh; });
  return Object.keys(progress.wrongCounts)
    .filter(w => progress.wrongCounts[w] > 0)
    .map(w => ({
      en: w,
      zh: zh[w] || "",
      wrong: progress.wrongCounts[w],
      status: progress.wrongCounts[w] >= 2 ? "加強中" : "不熟",
    }))
    .sort((a, b) => b.wrong - a.wrong);
}

// 自動存檔（fire-and-forget，不阻塞 UI）
function cloudSave(student) {
  if (!CLOUD_URL || !student) return;
  let progress = null, island = null;
  try { progress = JSON.parse(localStorage.getItem("kidsProgress." + student) || "null"); } catch (e) {}
  try { island = JSON.parse(localStorage.getItem("kidsIsland." + student) || "null"); } catch (e) {}
  const payload = { secret: CLOUD_SECRET, student, ts: new Date().toISOString(), progress, island };
  const m = _masteryFromProgress(progress);
  if (m) payload.mastery = m;  // 沒有 WORDBANK 的頁面就不送 mastery，Sheet 的熟練表不會被清掉
  try {
    // 用純文字 body 避免 CORS preflight（Apps Script 友善）
    fetch(CLOUD_URL, { method: "POST", body: JSON.stringify(payload) });
  } catch (e) {}
}

// 開啟頁面時的智慧同步：本機沒進度就從雲端拉回（避免測試/新平板用空資料蓋掉雲端）；
// 本機已有進度就上傳備份。onRestored 在「成功拉回」後呼叫，讓頁面用新資料重畫。
function cloudSyncOnOpen(student, onRestored) {
  if (!CLOUD_URL || !student) return;
  let prog = null;
  try { prog = JSON.parse(localStorage.getItem("kidsProgress." + student) || "null"); } catch (e) {}
  const localEmpty = !prog ||
    (((prog.totalCorrect || 0) + (prog.totalWrong || 0)) === 0 && !(prog.coins && prog.coins.balance > 0));
  if (localEmpty) {
    cloudLoad(student).then(d => {
      if (d && d.progress) { if (typeof onRestored === "function") onRestored(); }
      else cloudSave(student);  // 雲端也沒有 → 這是第一台裝置，上傳建立
    });
  } else {
    cloudSave(student);  // 本機已有進度 → 正常備份
  }
}

// 從雲端還原（手動觸發；會覆蓋本機進度）
function cloudLoad(student) {
  if (!CLOUD_URL || !student) return Promise.resolve(null);
  return fetch(CLOUD_URL + "?student=" + encodeURIComponent(student) + "&secret=" + encodeURIComponent(CLOUD_SECRET))
    .then(r => r.json())
    .then(d => {
      if (d && d.ok) {
        if (d.progress) localStorage.setItem("kidsProgress." + student, JSON.stringify(d.progress));
        if (d.island) localStorage.setItem("kidsIsland." + student, JSON.stringify(d.island));
        return d;
      }
      return null;
    })
    .catch(() => null);
}
