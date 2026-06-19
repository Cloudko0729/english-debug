/**
 * Kids English — Google Sheets 自動存檔後端
 *
 * 用途：接收網站送來的學習進度，存進這個試算表。
 *   - Saves    分頁：每個學生一列，永遠是「最新」狀態（給 smart-sync / 預設還原用）。
 *   - History  分頁：每個學生每天一列，保留最近 10 天的每日快照（給「選日期還原」用）。
 *   - <名字>_熟練表 分頁：人類可讀的單字熟練表，每次覆蓋更新。
 *
 * 部署步驟見同資料夾的 SETUP.md。
 * 改完這個檔後，要在 Apps Script 重新「部署 → 管理部署作業 → 編輯 → 新版本」才會生效。
 * 部署後把 /exec 網址貼到網站的 kids/cloud_sync.js 的 CLOUD_URL。
 */

// 跟網站 cloud_sync.js 的 CLOUD_SECRET 必須一致（可自行改成別的字串）
const SECRET = "kids2026";
const HISTORY_DAYS = 10;   // 每個學生在 History 分頁保留的天數

function doPost(e) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(20000); } catch (lockErr) {}
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.secret !== SECRET) return json_({ ok: false, err: "bad secret" });
    const student = String(data.student || "").toLowerCase();
    if (!student) return json_({ ok: false, err: "no student" });

    const serverTs = new Date().toISOString();
    const date = String(data.date || serverTs.slice(0, 10));   // 前端本機日期；沒送就用 server 日期
    const summary = summarize_(data.progress, data.island);

    saveRaw_(student, data);                                   // Saves：最新（欄位維持不變）
    saveHistory_(student, date, data, summary, serverTs);      // History：每日快照 + 修剪
    if (data.mastery) writeMastery_(student, data.mastery);

    return json_({ ok: true, serverTs: serverTs, date: date, summary: summary });
  } catch (err) {
    return json_({ ok: false, err: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (relErr) {}
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.secret !== SECRET) return json_({ ok: false, err: "bad secret" });
  const student = String(p.student || "").toLowerCase();
  if (!student) return json_({ ok: false, err: "no student" });

  // 近 10 天列表（只回摘要，很輕量）
  if (p.list) {
    return json_({ ok: true, items: listHistory_(student) });
  }

  // 指定日期的完整快照
  if (p.date) {
    const h = findHistory_(student, String(p.date));
    if (!h) return json_({ ok: false, err: "not found" });
    return json_({
      ok: true,
      student: student,
      date: h.date,
      serverTs: h.serverTs,
      clientTs: h.clientTs,
      summary: parseOrNull_(h.summary),
      progress: parseOrNull_(h.progress),
      island: parseOrNull_(h.island),
    });
  }

  // 預設：回最新（向後相容，欄位不變）
  const row = findRaw_(student);
  if (!row) return json_({ ok: false, err: "not found" });
  return json_({
    ok: true,
    ts: row.ts,
    progress: parseOrNull_(row.progress),
    island: parseOrNull_(row.island),
  });
}

function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function sheet_(name) { const s = ss_(); return s.getSheetByName(name) || s.insertSheet(name); }
function parseOrNull_(s) { try { return s ? JSON.parse(s) : null; } catch (e) { return null; } }

// 日期欄正規化：Sheets 可能把 "2026-06-19" 自動轉成 Date 物件，統一轉回 "YYYY-MM-DD"
function toDateStr_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, ss_().getSpreadsheetTimeZone(), "yyyy-MM-dd");
  return String(v);
}

// ─── Saves：最新狀態（一個學生一列）────────────────────────────────────────────
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

// ─── History：每日快照（一個學生每天一列，保留最近 HISTORY_DAYS 天）──────────────
function historySheet_() {
  const sh = sheet_("History");
  if (sh.getLastRow() === 0) {
    sh.appendRow(["student", "date", "serverTs", "clientTs", "summary", "progress", "island"]);
    sh.setFrozenRows(1);
  }
  // 強制日期欄(B)為純文字，避免 Sheets 把 "2026-06-19" 自動轉成日期物件
  sh.getRange("B:B").setNumberFormat("@");
  return sh;
}

function saveHistory_(student, date, data, summary, serverTs) {
  const sh = historySheet_();
  const values = sh.getDataRange().getValues();
  const progStr = JSON.stringify(data.progress || null);
  const islStr = JSON.stringify(data.island || null);
  const sumStr = JSON.stringify(summary || null);
  const clientTs = data.ts || serverTs;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === student && toDateStr_(values[i][1]) === date) {
      // 同一天重存 → 覆蓋那一列（後到的覆蓋）
      sh.getRange(i + 1, 3, 1, 5).setValues([[serverTs, clientTs, sumStr, progStr, islStr]]);
      pruneHistory_(student);
      return;
    }
  }
  sh.appendRow([student, date, serverTs, clientTs, sumStr, progStr, islStr]);
  pruneHistory_(student);
}

function pruneHistory_(student) {
  const sh = ss_().getSheetByName("History");
  if (!sh) return;
  const values = sh.getDataRange().getValues();
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === student) rows.push({ i: i, date: toDateStr_(values[i][1]) });
  }
  if (rows.length <= HISTORY_DAYS) return;
  rows.sort((a, b) => (a.date < b.date ? 1 : (a.date > b.date ? -1 : 0)));   // 新 → 舊
  // 保留前 HISTORY_DAYS 個日期，其餘刪除；由下往上刪，避免列號位移
  const toDelete = rows.slice(HISTORY_DAYS).map(r => r.i).sort((a, b) => b - a);
  toDelete.forEach(idx => sh.deleteRow(idx + 1));
}

function listHistory_(student) {
  const sh = ss_().getSheetByName("History");
  if (!sh) return [];
  const values = sh.getDataRange().getValues();
  const items = [];
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === student) {
      items.push({
        date: toDateStr_(values[i][1]),
        serverTs: values[i][2],
        clientTs: values[i][3],
        summary: parseOrNull_(values[i][4]),
      });
    }
  }
  items.sort((a, b) => (a.date < b.date ? 1 : -1));   // 新 → 舊
  return items;
}

function findHistory_(student, date) {
  const sh = ss_().getSheetByName("History");
  if (!sh) return null;
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === student && toDateStr_(values[i][1]) === date) {
      return {
        date: toDateStr_(values[i][1]),
        serverTs: values[i][2],
        clientTs: values[i][3],
        summary: values[i][4],
        progress: values[i][5],
        island: values[i][6],
      };
    }
  }
  return null;
}

// 後端統一算摘要：給選日期還原時的列表用
function summarize_(progress, island) {
  const st = (island && island.stats) || {};
  const co = (progress && progress.coins) || {};
  const buildings = st.totalBuildings != null
    ? st.totalBuildings
    : (island && island.buildings ? island.buildings.length : 0);
  return {
    coins: co.balance || 0,
    population: st.population || 0,
    beauty: st.beauty || 0,
    happiness: st.happiness || 0,
    buildings: buildings,
    correct: (progress && progress.totalCorrect) || 0,
    wrong: (progress && progress.totalWrong) || 0,
  };
}

// ─── 人類可讀的單字熟練表：每個學生一個分頁，每次覆蓋更新 ──────────────────────
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
