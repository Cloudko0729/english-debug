// 執行 kids/school_exam.html，確認畫得出來、每個發音都有檔。
//
// 用法: node kids/tools/test_school_exam.js
//
// 頁面內容全是 JS 產生的，檔案存在不代表畫得出來；而每個可點的字都對應一個音檔，
// 缺檔不會報錯（Audio.play() 的 rejection 被吃掉），使用者只會看到按了沒反應。
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KIDS = path.join(__dirname, "..");
const HTML = path.join(KIDS, "school_exam.html");
const AUDIO = path.join(KIDS, "audio", "school");

let fail = 0;
const t = (n, c, x) => { if (!c) fail++; console.log((c ? "  ✓ " : "  ✗ ") + n + (c || !x ? "" : "  → " + x)); };

function el(id) {
  return { id, style: {}, innerHTML: "", textContent: "",
           classList: { add() {}, remove() {} }, addEventListener() {}, appendChild() {} };
}

function main() {
  const html = fs.readFileSync(HTML, "utf8");
  const inline = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].filter(m => !/src=/.test(m[1]));
  if (inline.length !== 1) throw new Error("預期一段內嵌 script，實際 " + inline.length);

  const byId = new Map();
  const sb = {
    console: { log() {}, warn() {}, error() {} }, setTimeout, Date,
    Audio: function () { return { play: () => Promise.resolve(), pause() {} }; },
  };
  sb.document = {
    getElementById(i) { if (!byId.has(i)) byId.set(i, el(i)); return byId.get(i); },
    addEventListener() {}, body: el(), head: el(), createElement: () => el(),
  };
  sb.window = sb; sb.globalThis = sb;
  vm.createContext(sb);
  ["school_db/textbook_g6a.js", "school_db/exam_plan.js"].forEach(f =>
    vm.runInContext(fs.readFileSync(path.join(KIDS, f), "utf8"), sb, { filename: f }));

  let err = null;
  try { vm.runInContext(inline[0][2], sb, { filename: "school_exam.html" }); } catch (e) { err = e; }

  console.log("school_exam.html：");
  t("內嵌 script 跑得起來", !err, err && err.message);
  const main = byId.get("main").innerHTML, cd = byId.get("cd").innerHTML, bar = byId.get("bar").innerHTML;
  t("倒數有算出來", /還有 \d+ 天|今天考試|考完了/.test(cd), cd.replace(/<[^>]+>/g, "").slice(0, 60));
  t("4 個 Unit 都畫出來", (main.match(/<h2>Unit /g) || []).length === 4);
  t("Review 有 2 個", (main.match(/<h2>Review /g) || []).length === 2);
  t("中秋與 Task 有出現", /Moon Festival/.test(main) && /Country Guessing/.test(main));
  t("分頁鈕 7 個", (bar.match(/<button/g) || []).length === 7);
  // 未拍照的三處（U3、U4、Review 2）要標出來，不要讓人以為那裡本來就是空的
  t("未拍照的單元有標註", (main.match(/⚠️/g) || []).length === 3, (main.match(/⚠️/g) || []).length);

  const keys = [...new Set([...main.matchAll(/say\('([^']+)'\)/g)].map(m => m[1]))];
  const miss = keys.filter(k => !fs.existsSync(path.join(AUDIO, k + ".mp3")));
  t(`${keys.length} 個發音都有檔`, miss.length === 0, "缺 " + miss.length + "：" + miss.slice(0, 8).join(" "));

  console.log(fail ? `\n❌ ${fail} 項不符` : "\n✅ 全部通過");
  process.exit(fail ? 1 : 0);
}

main();
