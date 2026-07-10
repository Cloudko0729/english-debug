// P2 題庫驗證＋轉檔：_p2_email1/2.json + _p2_dialog.json → adult/course/email_qs.js + dialog_qs.js
const fs = require("fs"), path = require("path");
const K = p => path.join(__dirname, "..", "kids", "tools", p);
const TAGS = new Set("general repair quotation delivery parts service payment logistics office meeting order".split(" "));
const errs = [];

// 郵件組裝
const email = [];
for (const f of ["_p2_email1.json", "_p2_email2.json"]) {
  const j = JSON.parse(fs.readFileSync(K(f), "utf8"));
  email.push(...j.items);
}
const ids = new Set();
email.forEach(q => {
  if (ids.has(q.id)) errs.push("email 重複 id " + q.id); ids.add(q.id);
  if (!TAGS.has(q.tag)) errs.push(q.id + " tag '" + q.tag + "'");
  if (!q.zh) errs.push(q.id + " 無 zh");
  if (!Array.isArray(q.chunks) || q.chunks.length < 3 || q.chunks.length > 5) errs.push(q.id + " chunks 數 " + (q.chunks || []).length);
  else {
    if (q.chunks.some(c => !c || !c.trim())) errs.push(q.id + " 空 chunk");
    const s = q.chunks.join(" ");
    if (!/[.?!]$/.test(s)) errs.push(q.id + " 句尾無標點: " + s.slice(-15));
    if (s.split(" ").length > 16) errs.push(q.id + " 句子過長");
  }
});
if (email.length < 160) errs.push("email 總數 " + email.length + " < 160");

// 對話回應
const dialog = JSON.parse(fs.readFileSync(K("_p2_dialog.json"), "utf8")).items;
const dcnt = { 0: 0, 1: 0, 2: 0 };
dialog.forEach(q => {
  if (ids.has(q.id)) errs.push("dialog 重複 id " + q.id); ids.add(q.id);
  if (!TAGS.has(q.tag)) errs.push(q.id + " tag '" + q.tag + "'");
  if (!q.cue || !q.cueZh) errs.push(q.id + " 缺 cue/cueZh");
  if (!Array.isArray(q.choices) || q.choices.length !== 3) errs.push(q.id + " choices 數");
  else if (new Set(q.choices).size !== 3) errs.push(q.id + " choices 重複");
  if (![0, 1, 2].includes(q.a)) errs.push(q.id + " a 無效"); else dcnt[q.a]++;
});
if (dialog.length < 80) errs.push("dialog 總數 " + dialog.length + " < 80");
if (Math.max(...Object.values(dcnt)) > dialog.length * 0.6) errs.push("正解位置分布不均 " + JSON.stringify(dcnt));

if (errs.length) { console.error("❌ " + errs.length + " 項:\n" + errs.slice(0, 25).join("\n")); process.exit(1); }
console.log(`✔ 郵件組裝 ${email.length} 題、對話回應 ${dialog.length} 題（正解分布 ${JSON.stringify(dcnt)}）`);

fs.writeFileSync(path.join(__dirname, "..", "adult", "course", "email_qs.js"),
  "// 郵件一句話組裝題庫（Codex 起草、Claude 驗證）\nconst EMAIL_QS = " + JSON.stringify(email) + ";\n" +
  'if (typeof module !== "undefined" && module.exports) module.exports = { EMAIL_QS };\n');
fs.writeFileSync(path.join(__dirname, "..", "adult", "course", "dialog_qs.js"),
  "// 客戶對話回應題庫（Codex 起草、Claude 驗證）\nconst DIALOG_QS = " + JSON.stringify(dialog) + ";\n" +
  'if (typeof module !== "undefined" && module.exports) module.exports = { DIALOG_QS };\n');
console.log("✔ adult/course/email_qs.js + dialog_qs.js");
