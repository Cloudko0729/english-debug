// 把新詞條追加進 adult/repair_terms.js（不動既有的 120 條）。
//
// 用法: node adult/tools/add_repair_terms.js
//
// 為什麼要工具而不是手改：repair_terms.js 是一整行的 JSON 陣列，手改容易改壞；
// 而且 id 是「載入時依序重編」的（t.id = i + 1），音檔檔名 t<id>_term.mp3 綁著 id，
// 所以新詞條只能加在尾端 —— 插在中間會讓後面所有詞條的音檔全部對錯。
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "repair_terms.js");

// 2026-08 debug flow 那批紀錄裡出現、原本詞條表沒有的
const ADD = [
  { en: "alternative part", zh: "替代料（也可說 alternate part）", cat: "parts",
    example: "This DC-DC converter uses an alternative component.",
    example_zh: "這顆 DC-DC 轉換器使用了替代料。" },
  { en: "flying probe", zh: "飛針測試", cat: "test",
    example: "The board went missing after the flying probe test.",
    example_zh: "飛針測試後系統偵測不到這塊板子。" },
  { en: "fully populated", zh: "插滿（所有插槽都裝上）", cat: "process",
    example: "The manual requires all DIMM slots to be fully populated.",
    example_zh: "手冊要求所有 DIMM 插槽必須插滿。" },
  { en: "poor soldering", zh: "焊接不良、虛焊", cat: "symptom",
    example: "We found poor soldering left by the previous vendor repair.",
    example_zh: "我們發現前一手外包維修留下的焊接不良。" },
  { en: "open trace", zh: "走線開路", cat: "symptom",
    example: "The IV check found an open trace to the FPGA.",
    example_zh: "IV 檢查發現通往 FPGA 的走線開路。" },
  { en: "cross-verify", zh: "交叉驗證", cat: "action",
    example: "We cross-verified the cable with a known good one.",
    example_zh: "我們用已知良品線材做了交叉驗證。" },
  { en: "still fail", zh: "（換過之後）仍然失敗", cat: "symptom",
    example: "Channel eleven still failed after the parts were replaced.",
    example_zh: "更換零件後，通道十一仍然失敗。" },
  { en: "conductive rubber strip", zh: "導電膠條", cat: "parts",
    example: "The conductive rubber strip was cleaned before the retest.",
    example_zh: "複測前已清潔導電膠條。" },
];

function main() {
  const src = fs.readFileSync(FILE, "utf8");
  const m = src.match(/^(const REPAIR_TERMS = )(\[[\s\S]*?\]);$/m);
  if (!m) throw new Error("找不到 REPAIR_TERMS 陣列");
  const terms = JSON.parse(m[2]);

  const have = new Set(terms.map(t => t.en.toLowerCase()));
  const fresh = ADD.filter(t => !have.has(t.en.toLowerCase()));
  const dup = ADD.filter(t => have.has(t.en.toLowerCase()));
  if (dup.length) console.log("已存在，跳過：" + dup.map(t => t.en).join("、"));
  if (!fresh.length) { console.log("沒有要新增的詞條"); return; }

  // 只加在尾端 —— id 依序重編，音檔綁著 id
  const out = terms.concat(fresh);
  const body = src.slice(0, m.index) + m[1] + JSON.stringify(out) + ";" +
               src.slice(m.index + m[0].length);
  fs.writeFileSync(FILE, body, "utf8");

  console.log(`新增 ${fresh.length} 條：${fresh.map(t => t.en).join("、")}`);
  console.log(`詞條總數 ${terms.length} → ${out.length}`);
  console.log(`新詞條的 id 為 ${terms.length + 1}–${out.length}，音檔要產生 t<id>_term.mp3 與 t<id>_ex.mp3`);
}

main();
