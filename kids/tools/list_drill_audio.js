// 列出指定日期的每日練習實際會播放的每一個音檔，以及它「應該」唸出的文字。
// 交給 verify_audio_asr.py 做語音辨識比對。
//
// 用法:
//   node kids/tools/list_drill_audio.js 2026-10-05 2026-10-06 ... > list.json
//
// 為什麼要另外做：validate_daily_drill.js 只檢查檔案存不存在。檔案在、內容卻錯的情況
// 它抓不到 —— 例如題目改了句子但沒重配音、配音規格檔用錯 key、TTS 把字唸成別的字。
// 這支工具從頁面實際產生的 🔊 按鈕出發，反查每顆按鈕的原文：
//   __pw('en')        → audio/words/<key>.mp3          原文＝單字本身
//   __pwd('lbN')      → audio/weekdrill/<週>/lbN.mp3   原文＝weekdrills.js 的 full / sentence / passage
//   __pst('key',..)   → audio/structure/<key>.mp3      原文＝structure_units.js 的例句
//   __psc('key')      → audio/school/<key>.mp3         原文＝audio_school.json 的配音規格
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const load = (rel, expr) => new Function(fs.readFileSync(path.join(KIDS, rel), "utf8") + ";return " + expr + ";")();

// 借 validate_daily_drill.js 的 runDay（真的執行引擎產生頁面），不要另寫一份
const vsrc = fs.readFileSync(path.join(__dirname, "validate_daily_drill.js"), "utf8").replace(/\r?\nmain\(\);\s*$/, "\n");
const { runDay, wdidFor } = new Function("require", "__dirname", "module", "process",
  vsrc + ";return { runDay, wdidFor };")(require, __dirname, { exports: {} }, process);

const WEEK = load("drills/weekdrills.js", "WEEK_DRILLS");
const { PHONICS_UNITS, SKELETON_UNITS } = load("drills/structure_units.js", "{ PHONICS_UNITS, SKELETON_UNITS }");
const SCHOOL = JSON.parse(fs.readFileSync(path.join(__dirname, "audio_school.json"), "utf8")).items;
const wordKey = load("wordbank.js", "wordAudioKey");

const structureText = {};
SKELETON_UNITS.forEach(u => (u.examples || []).forEach((e, i) => { structureText[u.id + "_e" + i] = e.parts.join(" "); }));
PHONICS_UNITS.forEach(u => (u.words || []).forEach((w, i) => { if (w.ex) structureText["ph_" + u.id + "_" + i] = w.ex; }));

function weekText(wid, key) {
  const d = WEEK[wid]; if (!d) return null;
  let m;
  if ((m = key.match(/^lb(\d+)$/))) return d.listenBlank[+m[1]] && d.listenBlank[+m[1]].full;
  if ((m = key.match(/^ro(\d+)$/))) return d.reorder[+m[1]] && d.reorder[+m[1]].sentence;
  if ((m = key.match(/^passage(\d+)$/))) return d.reading[+m[1]] && d.reading[+m[1]].passage;
  return null;
}

const dates = process.argv.slice(2).filter(a => /^\d{4}-\d{2}-\d{2}$/.test(a));
if (!dates.length) { console.error("請給日期"); process.exit(1); }

const seen = new Map();
const add = (rel, expected, kind, date) => {
  const file = path.join(KIDS, "audio", rel);
  if (!seen.has(file)) seen.set(file, { file, rel, expected, kind, dates: [] });
  const it = seen.get(file);
  if (!it.dates.includes(date)) it.dates.push(date);
};

dates.forEach(date => {
  const html = runDay(date, "vocab");
  const wid = wdidFor(date);
  [...html.matchAll(/__pw\('((?:[^'\\]|\\.)*)'\)/g)].forEach(m => {
    const en = m[1].replace(/\\'/g, "'");
    add("words/" + wordKey(en) + ".mp3", en, "word", date);
  });
  [...html.matchAll(/__pwd\('([^']+)'\)/g)].forEach(m => add("weekdrill/" + wid + "/" + m[1] + ".mp3", weekText(wid, m[1]), "weekdrill", date));
  [...html.matchAll(/__pst\('([^']+)'/g)].forEach(m => add("structure/" + m[1] + ".mp3", structureText[m[1]] || null, "structure", date));
  [...html.matchAll(/__psc\('([^']+)'\)/g)].forEach(m => add("school/" + m[1] + ".mp3", SCHOOL[m[1]] || null, "school", date));
});

process.stdout.write(JSON.stringify([...seen.values()], null, 1));
