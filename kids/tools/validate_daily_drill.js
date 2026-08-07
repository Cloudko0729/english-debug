// 實際執行每日練習頁，檢查那一天真的出得了題。
//
// 用法:
//   node kids/tools/validate_daily_drill.js                    # 檢查 drills_list 裡今天之後的所有日期
//   node kids/tools/validate_daily_drill.js 2026-08-10 ...     # 只檢查指定日期
//   node kids/tools/validate_daily_drill.js --all              # 全部
//
// 為什麼要跑真的引擎：
//   daily_*.html 只是外殼，題目是 daily_engine.js 在瀏覽器裡依 DRILL_DATE 從
//   curriculum 當週單字 + 當月文法即時組出來的。檔案存在不代表出得了題 ——
//   curriculum 缺那一週、單字不夠湊選項、文法節點排不到，頁面都會是空的或殘的，
//   而這些從檔案內容一個字都看不出來。
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KIDS = path.join(__dirname, "..");
const DRILLS = path.join(KIDS, "drills");

// 引擎要的依賴，順序照頁面裡的 <script>
const DEPS = [
  "wordbank.js", "worddex.js", "curriculum.js", "word_emoji.js", "word_image.js",
  "drills/weekdrills.js", "drills/structure_units.js",
  "grammar_nodes.js", "grammar_plan.js", "drills/grammar_daily.js",
];
const ENGINE = "drills/daily_engine.js";

// 期待的段落。引擎的段落標題就長這樣，少一段就是那天的素材不夠。
const SECTIONS = ["單字", "文法"];
const MIN_QUESTIONS = 8;      // 一天低於這個題數就太薄，不值得小孩打開

function el(byId, id) {
  const e = {
    id, style: {}, dataset: {}, children: [],
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    textContent: "", innerHTML: "", value: "",
    appendChild(c) { this.children.push(c); return c; },
    remove() {}, addEventListener() {}, removeEventListener() {},
    setAttribute() {}, getAttribute: () => null,
    querySelector: () => el(byId), querySelectorAll: () => [],
    focus() {}, click() {}, scrollIntoView() {},
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 0, height: 0 }),
  };
  return e;
}

function runDay(date, theme) {
  const byId = new Map();
  const store = new Map();
  const sandbox = {
    console: { log() {}, warn() {}, error() {} },
    DRILL_DATE: date, DRILL_THEME: theme,
    localStorage: {
      getItem: k => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: k => store.delete(k),
    },
    location: { href: "", search: "", hash: "" },
    navigator: { userAgent: "node" },
    setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame: fn => setTimeout(fn, 0),
    Audio: function () { return { play: () => Promise.resolve(), pause() {} }; },
    speechSynthesis: { speak() {}, cancel() {}, getVoices: () => [] },
    SpeechSynthesisUtterance: function () {},
    alert() {}, confirm: () => false, prompt: () => null,
    fetch: () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }),
  };
  sandbox.document = {
    body: el(byId), documentElement: el(byId), head: el(byId),
    getElementById(id) { if (!byId.has(id)) byId.set(id, el(byId, id)); return byId.get(id); },
    querySelector: () => el(byId), querySelectorAll: () => [],
    createElement: () => el(byId), createTextNode: () => el(byId),
    addEventListener() {},
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);

  DEPS.concat(ENGINE).forEach(f => {
    const p = path.join(KIDS, f);
    if (!fs.existsSync(p)) throw new Error("找不到依賴 " + f);
    vm.runInContext(fs.readFileSync(p, "utf8"), sandbox, { filename: f });
  });

  // test 帳號不受日期鎖限制，才驗得到未來的日子
  sandbox.selectStudent("test");
  return sandbox.document.getElementById("app").innerHTML || "";
}

function main() {
  const args = process.argv.slice(2);
  const list = new Function(fs.readFileSync(path.join(KIDS, "drills_list.js"), "utf8") + ";return DRILLS;")();
  const today = new Date();
  const todayStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") +
                   "-" + String(today.getDate()).padStart(2, "0");

  const want = args.filter(a => /^\d{4}-\d{2}-\d{2}$/.test(a));
  const rows = want.length ? list.filter(d => want.includes(d.date))
             : args.includes("--all") ? list
             : list.filter(d => d.date >= todayStr);
  if (!rows.length) { console.log("沒有要檢查的日期"); return; }

  let bad = 0;
  rows.forEach(d => {
    let html = "", err = null;
    try { html = runDay(d.date, d.theme); } catch (e) { err = e; }
    if (err) {
      bad++; console.log(`✗ ${d.date}  拋錯：${err.message}`);
      console.log("   " + String(err.stack).split("\n")[1].trim());
      return;
    }
    // 題數＝作答按鈕的段落數；選項按鈕都帶 __ans(
    const qs = (html.match(/__ans\('/g) || []).length;
    const roq = (html.match(/__roPick\(/g) || []).length;   // 句子重組另計
    const missing = SECTIONS.filter(s => !html.includes(s));
    const words = (html.match(/__pw\('/g) || []).length;
    const ok = html.length > 500 && !missing.length && qs + roq >= MIN_QUESTIONS && !/這份測驗還沒開放/.test(html);
    if (!ok) bad++;
    console.log(`${ok ? "✓" : "✗"} ${d.date}  ${d.icon} ${d.zh}`);
    console.log(`     ${html.length} 字元 · 選擇/填空 ${qs} 題 · 重組 ${roq} 題 · 發音字 ${words}` +
                (missing.length ? `　⚠️ 缺段落：${missing.join("、")}` : "") +
                (/這份測驗還沒開放/.test(html) ? "　⚠️ 被日期鎖擋住" : ""));
  });

  console.log(`\n${bad === 0 ? "✅" : "❌"} ${rows.length - bad} / ${rows.length} 天出得了題`);
  process.exit(bad ? 1 : 0);
}

main();
