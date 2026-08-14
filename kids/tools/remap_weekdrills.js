// 週次改排之後，把 weekdrills 的題庫、生字表與音檔資料夾一起換到新的 key。
//
// 用法:
//   node kids/tools/remap_weekdrills.js 2026-08-3=2026-09-1 2026-08-4=2026-09-2
//   node kids/tools/remap_weekdrills.js --dry ...
//
// key 是 <月份>-<該月第幾週>，由日期算出來。所以只要某一週換了日期，題庫的 key 就
// 跟著失效 —— weekDrillFor() 查不到就回 null，那一天的 ②英聽填空 ③閱讀 ④重組
// 會整段消失，而且不會有任何錯誤訊息。8 月那次就是這樣沒被發現。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const FILE = path.join(KIDS, "drills", "weekdrills.js");
const AUDIO = path.join(KIDS, "audio", "weekdrill");

function main() {
  const dry = process.argv.includes("--dry");
  const pairs = process.argv.slice(2).filter(a => a.includes("=")).map(a => a.split("="));
  if (!pairs.length) { console.error("要給 舊key=新key"); process.exit(1); }

  let src = fs.readFileSync(FILE, "utf8");
  const before = new Function(src + ";return { WEEK_DRILLS, PASSAGE_GLOSSARY };")();

  pairs.forEach(([from, to]) => {
    if (!before.WEEK_DRILLS[from]) throw new Error(`weekdrills.js 沒有 ${from}`);
    if (before.WEEK_DRILLS[to]) throw new Error(`${to} 已經存在，會被蓋掉`);
  });

  // 一次全部換掉。key 只出現在 WEEK_DRILLS 與 PASSAGE_GLOSSARY 的引號裡，
  // 先換成暫時名稱再換回去，避免 A→B、B→C 這種連鎖改到同一個字串兩次。
  pairs.forEach(([from], i) => {
    src = src.split(`"${from}"`).join(`"@@TMP${i}@@"`);
  });
  pairs.forEach(([, to], i) => {
    src = src.split(`"@@TMP${i}@@"`).join(`"${to}"`);
  });

  const after = new Function(src + ";return { WEEK_DRILLS, PASSAGE_GLOSSARY };")();
  pairs.forEach(([from, to]) => {
    if (after.WEEK_DRILLS[from]) throw new Error(`${from} 還在`);
    if (!after.WEEK_DRILLS[to]) throw new Error(`${to} 沒生出來`);
    if (!after.PASSAGE_GLOSSARY[to]) throw new Error(`${to} 的生字表沒跟著搬`);
  });

  const moves = pairs.map(([from, to]) => {
    const a = path.join(AUDIO, from), b = path.join(AUDIO, to);
    const n = fs.existsSync(a) ? fs.readdirSync(a).length : 0;
    if (fs.existsSync(b)) throw new Error(`音檔資料夾 ${to} 已經存在`);
    if (!dry && fs.existsSync(a)) fs.renameSync(a, b);
    return `${from} → ${to}　${before.WEEK_DRILLS[from].listenBlank.length} 填空 / ` +
           `${before.WEEK_DRILLS[from].reorder.length} 重組 / ${before.WEEK_DRILLS[from].reading.length} 短文　音檔 ${n}`;
  });

  if (!dry) fs.writeFileSync(FILE, src, "utf8");
  moves.forEach(m => console.log("  " + m));
  console.log(dry ? "\n（--dry：沒有寫入）" : "\n已更新 weekdrills.js 與音檔資料夾");
}

main();
