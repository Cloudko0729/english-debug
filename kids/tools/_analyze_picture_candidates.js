const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');

function loadConst(file, name) {
  const code = fs.readFileSync(path.join(root, file), 'utf8');
  const box = {};
  vm.createContext(box);
  vm.runInContext(`${code}\n;globalThis.__result = ${name};`, box, { filename: file });
  return box.__result;
}

const curriculum = loadConst('curriculum.js', 'CURRICULUM');
const vocabPlan = loadConst('vocab_plan.js', 'VOCAB_PLAN');
const emoji = loadConst('word_emoji.js', 'WORD_EMOJI');

const weeks = [];
for (const month of curriculum) {
  for (const week of month.weeks || []) {
    weeks.push({ source: 'curriculum', month: month.month, ...week });
  }
}
for (const week of vocabPlan.weeks || []) {
  weeks.push({ source: 'vocab_plan', month: week.start.slice(0, 7), ...week });
}

const missing = [];
for (const week of weeks) {
  for (const word of week.words || []) {
    if (!emoji[word.en]) {
      missing.push({
        week: week.n,
        start: week.start,
        theme: week.theme,
        en: word.en,
        zh: word.zh,
        pos: word.pos || '',
        source: week.source
      });
    }
  }
}

const byPos = {};
for (const item of missing) {
  const pos = item.pos || 'unknown';
  byPos[pos] = (byPos[pos] || 0) + 1;
}

console.log(JSON.stringify({
  totalWeeks: weeks.length,
  totalWords: weeks.reduce((n, w) => n + (w.words || []).length, 0),
  mappedEmojiCount: Object.keys(emoji).length,
  missingCount: missing.length,
  byPos,
  missing
}, null, 2));
