// 產生每週手寫／口說作業的題目資料 kids/homework_tasks.js。
//
// 用法: node kids/tools/build_homework_tasks.js
//
// 題目文字取自 grammar_db/kid_wording.json 的 speak / write（那是已經白話化過、
// 小孩讀得懂的版本），語音取自 bands/*.json 的 productionTasks.promptAudio。
//
// 另外抽出「這一課必須用到的英文字」給手寫檢查用：
// 中文提示裡常常夾著要練的字（「寫一句用 they 講兩個人的話」），
// 但也會夾到說明用詞（「用 why 加 be 動詞寫一個問句」的 be 不是要求寫進句子裡）。
// 判準：只有同時出現在該課範例答案裡的字才採用 —— 範例答案是這一課的標準答案，
// 真正該用的字一定在裡面。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const DB = path.join(KIDS, "grammar_db");
const BANDS = ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7"];

// 驗證要以「整組」為單位，不是逐字。
// 「寫一句用 is not 或 are not 的否定句」的範例只會示範其中一種，逐字驗證會把
// are not 丟掉，於是小孩正確寫出 "The doors are not locked." 反而被提示寫錯 ——
// 那比不檢查更糟。只要組裡有一個字出現在範例，整組都算合法替代寫法。
// 手寫檢查本身是「含其中任一個就通過」，所以多留幾個只會更寬鬆，不會誤判。
function extractMust(zh, eg) {
  const raw = [];
  (zh.match(/[A-Za-z][A-Za-z''\-]*(?:\s+[A-Za-z][A-Za-z''\-]*)?/g) || []).forEach(s => {
    const t = s.trim();
    if (t.length > 1 && !raw.some(k => k.toLowerCase() === t.toLowerCase())) raw.push(t);
  });
  const low = (eg || "").toLowerCase();
  // 整組沒有任何一個出現在範例 → 這些是說明用詞（「用 why 加 be 動詞」的 be），整組丟掉
  return raw.some(t => low.includes(t.toLowerCase())) ? raw : [];
}

function main() {
  const wording = JSON.parse(fs.readFileSync(path.join(DB, "kid_wording.json"), "utf8"));
  const audio = {};
  BANDS.forEach(b => {
    const d = JSON.parse(fs.readFileSync(path.join(DB, "bands", b + ".json"), "utf8"));
    (d.nodes || d).forEach(n => {
      (n.productionTasks || []).forEach(t => {
        if (!audio[n.id]) audio[n.id] = {};
        const kind = t.type === "speaking" ? "speak" : "write";
        if (t.promptAudio) audio[n.id][kind] = t.promptAudio;
      });
    });
  });

  const out = {};
  let withMust = 0, genericOnly = 0, missing = [];
  Object.keys(wording).forEach(id => {
    if (id.startsWith("_")) return;                  // _note 之類的說明欄位
    const w = wording[id];
    if (!w || (!w.speak && !w.write)) { missing.push(id); return; }
    const rec = {};
    if (w.speak) {
      rec.speak = { zh: w.speak.zh, eg: w.speak.eg, egAudio: (audio[id] || {}).speak || null };
    }
    if (w.write) {
      const must = extractMust(w.write.zh, w.write.eg);
      if (must.length) withMust++; else genericOnly++;
      rec.write = { zh: w.write.zh, eg: w.write.eg, egAudio: (audio[id] || {}).write || null, must: must };
    }
    out[id] = rec;
  });

  if (missing.length) console.warn("⚠️ 沒有作業文字的節點：", missing.join(" "));

  fs.writeFileSync(path.join(KIDS, "homework_tasks.js"),
    "// 由 kids/tools/build_homework_tasks.js 產生，請勿手動編輯。\n" +
    "window.HOMEWORK_TASKS = " + JSON.stringify(out, null, 0) + ";\n", "utf8");

  console.log(JSON.stringify({
    ok: true, nodes: Object.keys(out).length,
    withSpeak: Object.values(out).filter(r => r.speak).length,
    withWrite: Object.values(out).filter(r => r.write).length,
    writeWithKeyCheck: withMust, writeGenericCheckOnly: genericOnly,
    missing,
  }, null, 2));
}

main();
