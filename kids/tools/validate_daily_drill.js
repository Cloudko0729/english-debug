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
  "school_db/textbook_g6a.js", "school_db/exam_plan.js", "drills/school_daily.js",
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

// 檔名規則跟 wordbank.js 的 wordAudioKey 一致
const audioKey = en => String(en).toLowerCase().replace(/[^a-z0-9]+/g, "");

// 那一天屬於哪一週 —— weekdrill 音檔按 <月份>-<該月第幾週> 分資料夾。
// 直接用 curriculum.js 的 vocabWeekForDate，不要自己再算一次：它會把超出範圍的
// 日期夾到頭尾那一週（六月那批舊練習就是靠這個借用 2026-07-1 的素材），
// 自己重算就會誤判成「沒有這一週」。
let _weekFor = null;
function wdidFor(date) {
  if (!_weekFor) {
    _weekFor = new Function(fs.readFileSync(path.join(KIDS, "curriculum.js"), "utf8") +
      ";return vocabWeekForDate;")();
  }
  const ctx = _weekFor(date);          // ctx.month 是整個月份物件，不是字串
  return ctx.month.month + "-" + ctx.week.n;
}

// 那一天所屬的週一（週日算前一週的，跟 curriculum 的週日起算對得上）
function mondayOf(date) {
  const p = date.split("-");
  const d = new Date(+p[0], +p[1] - 1, +p[2]);
  const dow = d.getDay();
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
         "-" + String(d.getDate()).padStart(2, "0");
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
  const byWeek = {};   // 週一日期 → { 題目 key: [出現在哪幾天] }
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

    // 每個 🔊 按鈕都要真的有檔案。缺檔不會報錯 —— Audio.play() 的 rejection 被
    // playUrl 吃掉，小孩只會看到一顆按了沒反應的按鈕。（廚房那一週的 oil 就是這樣。）
    const mute = [];
    [...html.matchAll(/__pw\('((?:[^'\\]|\\.)*)'\)/g)].forEach(m => {
      const en = m[1].replace(/\\'/g, "'");
      if (!fs.existsSync(path.join(KIDS, "audio", "words", audioKey(en) + ".mp3"))) mute.push("words/" + en);
    });
    [...html.matchAll(/__pwd\('([^']+)'\)/g)].forEach(m => {
      if (!fs.existsSync(path.join(KIDS, "audio", "weekdrill", wdidFor(d.date), m[1] + ".mp3"))) mute.push("weekdrill/" + m[1]);
    });
    [...html.matchAll(/__psc\('([^']+)'\)/g)].forEach(m => {
      if (!fs.existsSync(path.join(KIDS, "audio", "school", m[1] + ".mp3"))) mute.push("school/" + m[1]);
    });
    [...html.matchAll(/__pst\('([^']+)'/g)].forEach(m => {
      if (!fs.existsSync(path.join(KIDS, "audio", "structure", m[1] + ".mp3"))) mute.push("structure/" + m[1]);
    });
    if (mute.length) {
      bad++;
      console.log(`     ✗ ${mute.length} 顆 🔊 沒有音檔：${[...new Set(mute)].slice(0, 6).join("、")}`);
    }

    // 記下這天實際抽到哪幾題，等一下比對同一週有沒有重複
    const mon = mondayOf(d.date);
    const w = (byWeek[mon] = byWeek[mon] || {});
    [...html.matchAll(/__pwd\('([a-z]+\d+)'\)/g)].forEach(m => {
      (w[m[1]] = w[m[1]] || []).push(d.date.slice(5));
    });
  });

  // 一週五天應該完全不重複。重複代表題庫不夠大，小孩會覺得「昨天寫過了」。
  Object.keys(byWeek).sort().forEach(mon => {
    const w = byWeek[mon];
    const keys = Object.keys(w);
    if (!keys.length) return;
    const dup = keys.filter(k => w[k].length > 1);
    const days = new Set([].concat(...keys.map(k => w[k]))).size;
    if (days < 2) return;                       // 只驗了一兩天，比對沒意義
    const tag = dup.length ? "⚠️" : "✓";
    console.log(`${tag} ${mon} 那一週：${days} 天共 ${keys.length} 題，重複 ${dup.length}` +
      (dup.length ? `　${dup.slice(0, 5).map(k => k + "(" + w[k].join(",") + ")").join(" ")}` : ""));
  });

  console.log(`\n${bad === 0 ? "✅" : "❌"} ${rows.length - bad} / ${rows.length} 天出得了題`);
  process.exit(bad ? 1 : 0);
}

main();
