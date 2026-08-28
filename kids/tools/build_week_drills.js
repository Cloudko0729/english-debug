// 產生一週的每日練習頁（週一～週五 5 天）＋ 更新 kids/drills_list.js。
//
// 用法:
//   node kids/tools/build_week_drills.js                 # 下週（從今天算的下一個週一）
//   node kids/tools/build_week_drills.js 2026-08-10      # 指定那一週的週一
//   node kids/tools/build_week_drills.js 2026-08-10 --dry # 只看會產生什麼，不寫檔
//
// 為什麼是 5 天不是 7 天：
//   週一～週五每天一份，週六走 weekly_review.html（總複習＋回報學習成果），
//   週日休息。首頁的「本週練習」是週日～週六，所以週六那天卡片會只剩總複習。
//
// 頁面本身只是外殼 —— 題目是 daily_engine.js 在瀏覽器裡依 DRILL_DATE 從
// curriculum.js 當週單字 + 當月文法即時組出來的。所以「做下週練習」真正要確認的是
// curriculum.js 有沒有那一週的資料，而不是頁面裡有什麼。
//
// drills_list.js 的 theme 一定要等於頁面裡的 DRILL_THEME：
//   首頁用 date + "::" + date + "-" + theme 去對 coins.claimedDrills，對不起來
//   就永遠不會顯示 ✅ 已完成。2026-08-03~07 那批就是寫成 "outdoor" 而頁面是
//   "vocab"，小孩寫完了首頁卻一直是未完成。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const DRILLS_DIR = path.join(KIDS, "drills");
const LIST = path.join(KIDS, "drills_list.js");
const DRILL_THEME = "vocab";     // 必須與頁面裡的 DRILL_THEME 一致
const DAYS = 5;                  // 週一～週五

// 主題圖示。查不到不會擋住產生，只會提醒 —— 少一個 emoji 不值得讓整週的練習出不來。
const THEME_ICON = {
  "夏日戶外與安全": "🏕️", "廚房與料理": "🍳", "商店與購物": "🛒",
  "城市與交通": "🚇", "新學期與課表": "🎒", "露營": "🏕️", "旅行": "✈️",
  "天氣與季節": "🌦️", "運動與比賽": "⚽", "醫院與健康": "🏥",
  "7 月總複習": "🔁", "8 月上半總複習": "🔁", "圖書館與閱讀": "📚",
  "節日與慶典": "🎉", "科技與 3C": "💻", "動物與自然": "🦉",
};

function ymd(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
         "-" + String(d.getDate()).padStart(2, "0");
}
function parseYmd(s) {
  const p = String(s).split("-");
  return new Date(+p[0], +p[1] - 1, +p[2]);
}
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

// 從今天算的下一個週一。今天就是週一也算「下週」—— 這個工具是拿來備料的，
// 不是拿來補當天的。
function nextMonday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();                  // 0=Sun
  return addDays(d, dow === 0 ? 1 : 8 - dow);
}

function loadCurriculum() {
  const src = fs.readFileSync(path.join(KIDS, "curriculum.js"), "utf8");
  return new Function(src + ";return CURRICULUM;")();
}

// 找出涵蓋這幾天的課程週。curriculum 的週是週日～週六，跟我們的週一～週五對得上。
function weekFor(curriculum, monday, friday) {
  for (const m of curriculum) {
    for (const w of m.weeks || []) {
      if (w.start <= monday && w.end >= friday) return { month: m, week: w };
    }
  }
  return null;
}

// 頁面是外殼，內容全由 daily_engine 產生。版本戳記先用 000000000000，
// 產生完跑 bump_cache.js 會統一換掉。
function pageHtml(date, v) {
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>每日測驗 ${date} — Kids English</title>
<style>
 body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;margin:0}
 header{background:#2f80ed;color:#fff;text-align:center;padding:18px 16px}
 header h1{margin:0;font-size:1.25rem} header p{margin:4px 0 0;font-size:.82rem;opacity:.9}
 header a{color:#ffe27a;text-decoration:none;font-weight:700}
 #studentBar{max-width:680px;margin:14px auto 0;padding:0 14px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-weight:700;color:#3a2a00}
 .stu-btn{padding:7px 16px;border:2px solid #2f80ed;border-radius:18px;background:#fff;color:#2f80ed;font-weight:700;cursor:pointer}
 .stu-btn.active{background:#2f80ed;color:#fff}
</style>
</head>
<body>
<header><h1>📝 每日測驗</h1><p>當週單字 ＋ 當月文法 · <a href="../index.html">← 回首頁</a></p></header>
<div id="studentBar">我是：
 <button class="stu-btn" onclick="selectStudent('albert')">Albert</button>
 <button class="stu-btn" onclick="selectStudent('jonathan')">Jonathan</button>
 <button class="stu-btn" onclick="selectStudent('ryder')">Ryder</button>
 <button class="stu-btn" onclick="selectStudent('guest')">🎫 訪客</button>
 <button class="stu-btn" style="opacity:.7" onclick="selectStudent('test')">🧪 測試</button>
</div>
<div id="app"></div>
<script>const DRILL_DATE="${date}";const DRILL_THEME="${DRILL_THEME}";</script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../wordbank.js?v=${v}"></script>
<script src="../worddex.js?v=${v}"></script>
<script src="../curriculum.js?v=${v}"></script>
<script src="../word_emoji.js?v=${v}"></script>
<script src="../word_image.js?v=${v}"></script>
<script src="../cloud_sync.js?v=${v}"></script>
<script src="../account_lock.js?v=${v}"></script>
<script src="../supabase_auth.js?v=${v}"></script>
<script src="weekdrills.js?v=${v}"></script>
<script src="structure_units.js?v=${v}"></script>
<script src="../grammar_nodes.js?v=${v}"></script>
<script src="../grammar_plan.js?v=${v}"></script>
<script src="grammar_daily.js?v=${v}"></script>
<script src="../school_db/textbook_g6a.js?v=${v}"></script>
<script src="../school_db/exam_plan.js?v=${v}"></script>
<script src="school_daily.js?v=${v}"></script>
<script src="daily_engine.js?v=${v}"></script>
</body>
</html>
`;
}

// 沿用檔案裡既有的版本戳記，之後 bump_cache.js 會統一換掉
function currentStamp() {
  const any = fs.readdirSync(DRILLS_DIR).filter(f => /^daily_.*\.html$/.test(f)).sort().pop();
  const m = any && fs.readFileSync(path.join(DRILLS_DIR, any), "utf8").match(/\?v=(\d+)/);
  return m ? m[1] : "000000000000";
}

// 改寫 drills_list.js：同日期的舊資料換掉、依日期插到正確位置，其餘一行都不動。
// 不整份重寫 —— 前 20 天是手寫的主題式練習，欄位跟現在這批不一樣。
//
// day 序號最後統一依行的順序重編，不是接在最大值之後。這樣先補舊的一週、
// 再補新的一週也不會把順序弄反（序號只是顯示用的 Day N，重編沒有副作用）。
function updateList(rows, dry) {
  const src = fs.readFileSync(LIST, "utf8");
  const lines = src.split(/\r?\n/);
  const endIdx = lines.findIndex(l => l.trim() === "];");
  if (endIdx < 0) throw new Error("drills_list.js 找不到結尾的 ];");

  const dateOf = l => { const m = l.match(/date:\s*"(\d{4}-\d{2}-\d{2})"/); return m ? m[1] : null; };
  const dates = new Set(rows.map(r => r.date));
  const kept = lines.slice(0, endIdx).filter(l => !dates.has(dateOf(l)));

  const fmt = r => `  { day: 0, date: "${r.date}", theme: "${DRILL_THEME}", kind: "vocab", ` +
    `eng: "${r.eng}", zh: "${r.zh}", icon: "${r.icon}" },`;
  // 插在第一筆「日期比它晚」的資料之前；都比它早就放最後
  const body = kept.slice();
  rows.forEach(r => {
    const at = body.findIndex(l => { const d = dateOf(l); return d && d > r.date; });
    body.splice(at < 0 ? body.length : at, 0, fmt(r));
  });

  let n = 0;
  const renumbered = body.map(l => (dateOf(l) ? l.replace(/day:\s*\d+/, "day: " + (++n)) : l));
  const out = renumbered.concat(lines.slice(endIdx)).join("\n");
  if (!dry) fs.writeFileSync(LIST, out, "utf8");
  return renumbered.filter(l => dates.has(dateOf(l))).map(l => l.trim());
}

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry");
  const given = args.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a));
  const monday = given ? parseYmd(given) : nextMonday();
  if (monday.getDay() !== 1) throw new Error("要給週一的日期，" + ymd(monday) + " 是週" + "日一二三四五六"[monday.getDay()]);

  const days = [];
  for (let i = 0; i < DAYS; i++) days.push(ymd(addDays(monday, i)));
  const saturday = ymd(addDays(monday, 5));

  const ctx = weekFor(loadCurriculum(), days[0], days[DAYS - 1]);
  if (!ctx) {
    console.error(`✗ curriculum.js 沒有涵蓋 ${days[0]} ~ ${days[DAYS - 1]} 的週。`);
    console.error("  先跑 node kids/tools/sync_curriculum_weeks.js 把年度週計畫搬進來。");
    process.exit(1);
  }
  const { month, week } = ctx;
  if (!week.words || !week.words.length) throw new Error(`${week.start} 那一週沒有單字`);

  const icon = THEME_ICON[week.theme] || "📝";
  if (!THEME_ICON[week.theme]) console.warn(`⚠️ 主題「${week.theme}」沒有對應圖示，先用 📝（可加進 THEME_ICON）`);
  const zh = `第${week.n}週 ${week.theme}＋${(week.grammar || []).join("／") || "文法根基"}`;

  const v = currentStamp();
  const written = [];
  days.forEach(d => {
    const f = path.join(DRILLS_DIR, `daily_${d}.html`);
    const exists = fs.existsSync(f);
    if (!dry) fs.writeFileSync(f, pageHtml(d, v), "utf8");
    written.push((exists ? "覆寫 " : "新增 ") + path.relative(KIDS, f));
  });

  const rows = updateList(days.map(d => ({ date: d, eng: "每日測驗", zh, icon })), dry);

  console.log(`\n📅 ${days[0]} ~ ${days[DAYS - 1]}（週一～週五，5 天）`);
  console.log(`   ${month.label}　第 ${week.n} 週　${icon} ${week.theme}`);
  console.log(`   單字 ${week.words.length} 個：${week.words.slice(0, 8).map(w => w.en).join(", ")}…`);
  console.log(`   文法：${(week.grammar || []).join("、") || "（沿用當月）"}`);
  console.log(`   ${saturday}（週六）走 weekly_review.html 總複習，不產生每日頁\n`);
  written.forEach(l => console.log("   " + l));
  console.log("\n   drills_list.js:");
  rows.forEach(l => console.log("   " + l));
  if (dry) console.log("\n（--dry：沒有寫入任何檔案）");
  else console.log("\n下一步：node kids/tools/bump_cache.js");
}

main();
