// 修正 Day 10-16：listenVocab / reading.questions / pictureMC 的選項
// 之前 Codex 把答案都放第一個，而 render 照資料順序顯示（不打亂）→ 答案永遠第一個。
// 這裡把每題 choices 打亂，答案值不變、位置隨機。
const fs = require("fs");
const path = require("path");
const DATES = ["2026-06-21","2026-06-22","2026-06-23","2026-06-24","2026-06-25","2026-06-26","2026-06-27"];
const DRILLS_DIR = path.resolve(__dirname, "..", "drills");

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// 完全隨機打亂（答案落在任一位置都可能，分布自然），只避免和原本一模一樣
function shuffleChoices(choices, answer) {
  for (let t = 0; t < 50; t++) {
    const a = shuffle(choices);
    if (a.join("|") !== choices.join("|")) return a;
  }
  return shuffle(choices);
}

const posCount = {};
DATES.forEach(date => {
  const file = path.join(DRILLS_DIR, `daily_${date}.html`);
  let html = fs.readFileSync(file, "utf8");
  const m = html.match(/const DRILL = (\{[\s\S]*?\n\});\n\n\/\/ word-en lookup/);
  const drill = JSON.parse(m[1]);

  const fixArr = (items) => items.forEach(q => {
    q.choices = shuffleChoices(q.choices, q.answer);
    const p = q.choices.indexOf(q.answer);
    posCount[p] = (posCount[p] || 0) + 1;
    if (!q.choices.includes(q.answer)) throw new Error("answer lost: " + date);
  });
  fixArr(drill.listenVocab);
  fixArr(drill.reading.questions);
  fixArr(drill.pictureMC);

  const newJson = JSON.stringify(drill, null, 2);
  html = html.replace(/const DRILL = \{[\s\S]*?\n\};\n\n\/\/ word-en lookup/,
    `const DRILL = ${newJson};\n\n// word-en lookup`);
  fs.writeFileSync(file, html, "utf8");
  console.log("✔", date);
});
console.log("\n答案位置分布（0=第一個）:", JSON.stringify(posCount));
