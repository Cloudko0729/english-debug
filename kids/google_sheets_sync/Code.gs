/**
 * Kids English — Google Sheets 自動存檔後端
 *
 * 用途：接收網站送來的學習進度，存進這個試算表。
 *   - Saves    分頁：每個學生一列，永遠是「最新」狀態（給 smart-sync / 預設還原用）。
 *   - History  分頁：每個學生每天一列，保留最近 10 天的每日快照（給「選日期還原」用）。
 *   - <名字>_熟練表 分頁：人類可讀的單字熟練表，每次覆蓋更新。
 *   - 模擬考錯題 分頁：每次模擬考交卷的錯題，一題一列，只往下加不覆蓋。
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

    // 每一步各自 try：一步出錯（例如舊版遇到儲存格 5 萬字上限）不會讓後面的都沒寫
    const errs = [];
    const step = (name, fn) => { try { fn(); } catch (stepErr) { errs.push(name + ": " + stepErr); } };
    step("exam", () => writeExamWrong_(student, data.progress && data.progress.exams));
    if (data.mastery) step("mastery", () => writeMastery_(student, data.mastery));
    step("saves", () => saveRaw_(student, data));                                  // Saves：最新
    step("history", () => saveHistory_(student, date, data, summary, serverTs));   // History：每日快照 + 修剪

    if (errs.length) return json_({ ok: false, err: errs.join(" | "), serverTs: serverTs });
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

// ─── 大存檔切段：一格最多 5 萬字，超過就切成好幾段放在列尾 ──────────────────────
// 主欄位放第一段，meta 欄放 {"p":progress段數,"i":island段數}，其餘段依序接在 meta 後面。
// 舊列沒有 meta，照舊整格讀，所以前後相容。
const CELL_MAX = 45000;
function split_(str) {
  const parts = [];
  for (let i = 0; i < str.length; i += CELL_MAX) parts.push(str.slice(i, i + CELL_MAX));
  return parts.length ? parts : [""];
}
// 回傳 { first: [progress第一段, island第一段], meta, rest: [...其餘段] }
function pack_(progStr, islStr) {
  const p = split_(progStr), i = split_(islStr);
  return { first: [p[0], i[0]], meta: JSON.stringify({ p: p.length, i: i.length }), rest: p.slice(1).concat(i.slice(1)) };
}
// row：整列 values；pIdx／iIdx：主欄位位置；mIdx：meta 欄位置（後面接其餘段）
function unpack_(row, pIdx, iIdx, mIdx) {
  let meta = null;
  try { meta = row[mIdx] ? JSON.parse(row[mIdx]) : null; } catch (e) {}
  if (!meta || !meta.p) return { progress: row[pIdx], island: row[iIdx] };
  const rest = row.slice(mIdx + 1);
  return {
    progress: [row[pIdx]].concat(rest.slice(0, meta.p - 1)).join(""),
    island: [row[iIdx]].concat(rest.slice(meta.p - 1, meta.p - 1 + meta.i - 1)).join(""),
  };
}
// 寫一列：從 col 開始寫 values，並清掉這列後面上次留下、這次用不到的段
function writeRow_(sh, r, col, values) {
  sh.getRange(r, col, 1, values.length).setValues([values]);
  const last = sh.getLastColumn(), from = col + values.length;
  if (last >= from) sh.getRange(r, from, 1, last - from + 1).clearContent();
}

// ─── Saves：最新狀態（一個學生一列）────────────────────────────────────────────
function saveRaw_(student, data) {
  const sh = sheet_("Saves");
  if (sh.getLastRow() === 0) sh.appendRow(["student", "ts", "progress", "island", "parts"]);
  const values = sh.getDataRange().getValues();
  const pk = pack_(JSON.stringify(data.progress || null), JSON.stringify(data.island || null));
  const ts = data.ts || new Date().toISOString();
  const row = [ts, pk.first[0], pk.first[1], pk.meta].concat(pk.rest);
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === student) { writeRow_(sh, i + 1, 2, row); return; }
  }
  writeRow_(sh, values.length + 1, 1, [student].concat(row));
}

function findRaw_(student) {
  const sh = ss_().getSheetByName("Saves");
  if (!sh) return null;
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === student) {
      const u = unpack_(values[i], 2, 3, 4);
      return { ts: values[i][1], progress: u.progress, island: u.island };
    }
  }
  return null;
}

// ─── History：每日快照（一個學生每天一列，保留最近 HISTORY_DAYS 天）──────────────
function historySheet_() {
  const sh = sheet_("History");
  if (sh.getLastRow() === 0) {
    sh.appendRow(["student", "date", "serverTs", "clientTs", "summary", "progress", "island", "parts"]);
    sh.setFrozenRows(1);
  }
  // 強制日期欄(B)為純文字，避免 Sheets 把 "2026-06-19" 自動轉成日期物件
  sh.getRange("B:B").setNumberFormat("@");
  return sh;
}

function saveHistory_(student, date, data, summary, serverTs) {
  const sh = historySheet_();
  const values = sh.getDataRange().getValues();
  const pk = pack_(JSON.stringify(data.progress || null), JSON.stringify(data.island || null));
  const sumStr = JSON.stringify(summary || null);
  const clientTs = data.ts || serverTs;
  const row = [date, serverTs, clientTs, sumStr, pk.first[0], pk.first[1], pk.meta].concat(pk.rest);
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === student && toDateStr_(values[i][1]) === date) {
      // 同一天重存 → 覆蓋那一列（連日期欄一起寫成純文字，順便修掉舊的 Date 格）
      writeRow_(sh, i + 1, 2, row);
      pruneHistory_(student);
      return;
    }
  }
  writeRow_(sh, values.length + 1, 1, [student].concat(row));
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
      const u = unpack_(values[i], 5, 6, 7);
      return {
        date: toDateStr_(values[i][1]),
        serverTs: values[i][2],
        clientTs: values[i][3],
        summary: values[i][4],
        progress: u.progress,
        island: u.island,
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

// ─── 模擬考錯題：每份卷每考一次，就把那次的錯題加到表尾（全對也記一列）────────────
// 前端在 progress.exams[卷號] 存最近一次的 { title, tries, lastAt, last, wrong:[{sec,q,you,ans}] }；
// 同一個「學生＋卷＋第幾次」只寫一次，所以重複同步不會重複加。
function writeExamWrong_(student, exams) {
  if (!exams) return;
  const sh = sheet_("模擬考錯題");
  if (sh.getLastRow() === 0) {
    sh.appendRow(["學生", "卷別", "第幾次", "日期", "分數", "大題", "題目", "他的答案", "正確答案", "卷號"]);
    sh.setFrozenRows(1);
  }
  sh.getRange("D:D").setNumberFormat("@");
  const seen = {};
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) seen[values[i][0] + "|" + values[i][9] + "|" + values[i][2]] = true;
  const rows = [];
  Object.keys(exams).forEach(id => {
    const r = exams[id];
    if (!r || !Array.isArray(r.wrong) || !r.tries) return;   // 舊紀錄沒有錯題明細，跳過
    if (seen[student + "|" + id + "|" + r.tries]) return;
    const head = [student, r.title || id, r.tries, String(r.lastAt || ""), r.last];
    if (!r.wrong.length) rows.push(head.concat(["", "全對 🌟", "", "", id]));
    r.wrong.forEach(w => rows.push(head.concat([w.sec || "", w.q || "", w.you || "（沒寫）", w.ans || "", id])));
  });
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, 10).setValues(rows);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
