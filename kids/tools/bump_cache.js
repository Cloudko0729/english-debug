// 快取版本戳記：把 kids 頁面裡本站 JS 的 ?v= 戳記更新成目前時間。
// 每次改了 js（engine/curriculum/weekdrills/...）就跑一次，瀏覽器會自動抓新版。
// 用法: node tools/bump_cache.js
const fs = require("fs");
const path = require("path");
const STAMP = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);   // YYYYMMDDHHmm
const KIDS = path.join(__dirname, "..");

// 要蓋戳記的本站 script（CDN 不動）
const TARGETS = ["daily_engine.js", "weekdrills.js", "structure_units.js",
  "curriculum.js", "worddex.js", "word_emoji.js", "wordbank.js",
  "cloud_sync.js", "account_lock.js", "supabase_auth.js", "drills_list.js", "quizbank.js", "city_data.js"];

function bump(file) {
  let h = fs.readFileSync(file, "utf8"), changed = false;
  TARGETS.forEach(t => {
    const re = new RegExp(`(src="(?:\\.\\./)*(?:kids/|drills/|grammar_core/)?${t.replace(".", "\\.")})(\\?v=\\d+)?"`, "g");
    if (re.test(h)) { h = h.replace(re, `$1?v=${STAMP}"`); changed = true; }
  });
  if (changed) { fs.writeFileSync(file, h); return true; }
  return false;
}

let n = 0;
const pages = [];
fs.readdirSync(KIDS).filter(f => f.endsWith(".html")).forEach(f => pages.push(path.join(KIDS, f)));
fs.readdirSync(path.join(KIDS, "drills")).filter(f => f.endsWith(".html")).forEach(f => pages.push(path.join(KIDS, "drills", f)));
fs.readdirSync(path.join(KIDS, "lessons")).filter(f => f.endsWith(".html")).forEach(f => pages.push(path.join(KIDS, "lessons", f)));
["index.html", "pusher.html", "pusher3d.html"].forEach(f => pages.push(path.join(KIDS, "..", "typing-game", f)));
pages.forEach(f => { try { if (bump(f)) n++; } catch (e) {} });
console.log(`✔ 戳記 v=${STAMP}，更新 ${n} 個頁面`);
