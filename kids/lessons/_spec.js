// 用法: node _spec.js <date>   例: node _spec.js 2026-07-03
const fs = require("fs");
const date = process.argv[2];
const h = fs.readFileSync(`${__dirname}/lesson_${date}.html`, "utf8");
function arr(name) { const re = new RegExp("const " + name + " = (\\[[\\s\\S]*?\\]);"); return eval(h.match(re)[1]); }
const VOCAB = arr("VOCAB"), DIALOGUE = arr("DIALOGUE"), PASSAGE = arr("PASSAGE");
const items = {};
VOCAB.forEach((v, i) => { items["w" + i] = v.en; items["e" + i] = v.ex; });
DIALOGUE.forEach((d, i) => items["d" + i] = d.en);
PASSAGE.forEach((p, i) => items["p" + i] = p.en);
fs.writeFileSync(`${__dirname}/../tools/audio_lesson_${date}.json`,
  JSON.stringify({ outdir: `D:/english/kids/lessons/audio/${date}`, voice: "af_heart", speed: 0.9, items }, null, 1), "utf8");
console.log(date, "→", Object.keys(items).length, "段");
