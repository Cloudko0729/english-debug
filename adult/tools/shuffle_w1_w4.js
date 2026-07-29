// 一次性修正：把手寫的 W1-W4 日頁選擇題選項洗牌。
//
// 用法: node adult/tools/shuffle_w1_w4.js [--dry]
//
// W1-W4 是手寫 HTML，題目直接內嵌在頁面的 QUIZ / QS 陣列裡，正解一律寫在第一個
// （a: 0），使用者每題點第一個就全對。W5 之後由 build_weeks.js 產生已經會洗牌，
// 這支工具負責補救先前手寫的部分。
//
// 做法是解析頁面裡的陣列、洗牌、寫回去，不重建整個頁面 —— 那些頁面的其他內容
// （信件、講稿、CSS、互動邏輯）都是好的，沒有理由碰。
// 洗牌用題目文字當種子，重跑會得到一樣的結果，不會每次執行都產生新的 diff。
const fs = require("fs");
const path = require("path");
// 用可重複套用版：這支工具會被重跑，shuffleSeeded 跑兩次會把答案洗回第一個
const { shuffleIdempotent } = require("../../tools/_shuffle.js");

const DIR = path.join(__dirname, "..", "course");
const DRY = process.argv.includes("--dry");

// 從 `const NAME = [ ... ];` 取出陣列原文
function findArray(src, name) {
  const head = "const " + name + " = [";
  const a = src.indexOf(head);
  if (a < 0) return null;
  // 從 [ 開始括號配對，字串內的括號要跳過
  let i = a + head.length - 1, depth = 0, q = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (q) {
      if (c === "\\") { i++; continue; }
      if (c === q) q = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { q = c; continue; }
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) break; }
  }
  if (depth !== 0) throw new Error(name + " 括號沒有配對成功");
  return { start: a + head.length - 1, end: i + 1, text: src.slice(a + head.length - 1, i + 1) };
}

// 這些陣列是資料字面值（沒有函式呼叫），用 Function 取值是安全且最不易出錯的做法
function evalArray(text) {
  return new Function("return " + text + ";")();
}

// 洗一題：choices 欄位名在 d1/d2 是 c，d5 是 choices
function shuffleOne(q, seedBase) {
  const key = Array.isArray(q.c) ? "c" : (Array.isArray(q.choices) ? "choices" : null);
  if (!key) return { changed: false };
  if (typeof q.a !== "number" || q.a < 0 || q.a >= q[key].length) return { changed: false };
  const answer = q[key][q.a];
  const seed = String(q.q || q.cue || "") + "|" + seedBase;
  const options = shuffleIdempotent(q[key], seed);
  const at = options.indexOf(answer);
  if (at < 0) throw new Error("洗牌後找不到正解");
  const changed = at !== q.a || options.some((o, i) => o !== q[key][i]);
  q[key] = options;
  q.a = at;
  return { changed };
}

// 輸出成與原本相近的格式（每題一塊，欄位順序保持穩定）
function fmt(arr, indent) {
  const pad = " ".repeat(indent);
  return "[\n" + arr.map(q => {
    const keys = Object.keys(q);
    const body = keys.map(k => {
      const v = q[k];
      if (Array.isArray(v)) return pad + "  " + k + ": [" + v.map(x => JSON.stringify(x)).join(", ") + "]";
      return pad + "  " + k + ": " + JSON.stringify(v);
    }).join(",\n");
    return pad + "{\n" + body + "\n" + pad + "}";
  }).join(",\n") + "\n" + " ".repeat(Math.max(indent - 1, 0)) + "]";
}

// 處理一個檔案裡的一組陣列常數
function fixFile(file, names, seedBase) {
  let src = fs.readFileSync(file, "utf8");
  let moved = 0, found = false;
  names.forEach(name => {
    const loc = findArray(src, name);
    if (!loc) return;                       // 例如 W1/W2 的 QS 是從共用題庫撈的，不是字面陣列
    found = true;
    const arr = evalArray(loc.text);
    const before = arr.map(q => q.a);
    arr.forEach(q => shuffleOne(q, seedBase));
    moved += arr.map(q => q.a).filter((x, i) => x !== before[i]).length;
    src = src.slice(0, loc.start) + fmt(arr, 1) + src.slice(loc.end);
  });
  if (!DRY && found) fs.writeFileSync(file, src, "utf8");
  return { moved, found };
}

function run() {
  const report = [];
  for (let w = 1; w <= 4; w++) {
    ["d1", "d2", "d5"].forEach(d => {
      const file = path.join(DIR, `w${w}${d}.html`);
      if (!fs.existsSync(file)) return;
      const r = fixFile(file, ["QUIZ", "QS"], `w${w}${d}`);
      report.push({ file: `w${w}${d}.html`, moved: r.moved, inlineArray: r.found });
    });
  }
  // 共用題庫：quick.html 用的 40 題文法，正解也全部寫在第一個。
  // dialog_qs.js 的 100 題本來就是散的（32% 在第一個），不動。
  const qb = path.join(DIR, "qbank.js");
  if (fs.existsSync(qb)) {
    const r = fixFile(qb, ["GRAMMAR_QS"], "qbank");
    report.push({ file: "qbank.js", moved: r.moved, inlineArray: r.found });
  }
  console.log(JSON.stringify({ ok: true, dryRun: DRY, files: report }, null, 2));
}

run();
