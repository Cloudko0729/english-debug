/**
 * Kids English — Google Sheets 自動存檔後端
 *
 * 用途：接收網站送來的學習進度，存進這個試算表，並自動產生每個小孩的「單字熟練表」。
 *
 * 部署步驟見同資料夾的 SETUP.md。
 * 部署後把 /exec 網址貼到網站的 kids/cloud_sync.js 的 CLOUD_URL。
 */

// 跟網站 cloud_sync.js 的 CLOUD_SECRET 必須一致（可自行改成別的字串）
const SECRET = "kids2026";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) return json_({ ok: false, err: "bad secret" });
    const student = String(data.student || "").toLowerCase();
    if (!student) return json_({ ok: false, err: "no student" });
    saveRaw_(student, data);
    if (data.mastery) writeMastery_(student, data.mastery);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, err: String(err) });
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.secret !== SECRET) return json_({ ok: false, err: "bad secret" });
  const student = String(p.student || "").toLowerCase();
  const row = findRaw_(student);
  if (!row) return json_({ ok: false, err: "not found" });
  return json_({
    ok: true,
    ts: row.ts,
    progress: row.progress ? JSON.parse(row.progress) : null,
    island: row.island ? JSON.parse(row.island) : null,
  });
}

function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function sheet_(name) { const s = ss_(); return s.getSheetByName(name) || s.insertSheet(name); }

// 原始存檔（給跨裝置還原用）：一個學生一列
function saveRaw_(student, data) {
  const sh = sheet_("Saves");
  if (sh.getLastRow() === 0) sh.appendRow(["student", "ts", "progress", "island"]);
  const values = sh.getDataRange().getValues();
  const progStr = JSON.stringify(data.progress || null);
  const islStr = JSON.stringify(data.island || null);
  const ts = data.ts || new Date().toISOString();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === student) {
      sh.getRange(i + 1, 2, 1, 3).setValues([[ts, progStr, islStr]]);
      return;
    }
  }
  sh.appendRow([student, ts, progStr, islStr]);
}

function findRaw_(student) {
  const sh = ss_().getSheetByName("Saves");
  if (!sh) return null;
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === student) {
      return { ts: values[i][1], progress: values[i][2], island: values[i][3] };
    }
  }
  return null;
}

// 人類可讀的單字熟練表：每個學生一個分頁，每次覆蓋更新
function writeMastery_(student, mastery) {
  const name = student.charAt(0).toUpperCase() + student.slice(1) + "_熟練表";
  const sh = sheet_(name);
  sh.clear();
  sh.appendRow(["單字", "中文", "答錯次數", "狀態", "更新時間"]);
  const now = new Date();
  const rows = mastery.map(m => [m.en, m.zh || "", m.wrong, m.status || "", now]);
  if (rows.length) sh.getRange(2, 1, rows.length, 5).setValues(rows);
  sh.setFrozenRows(1);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
