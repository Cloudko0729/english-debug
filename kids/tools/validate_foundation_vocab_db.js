// Validate the generated F0–F3 / L1–L4 vocabulary database.
// Usage:
//   node kids/tools/validate_foundation_vocab_db.js
//   node kids/tools/validate_foundation_vocab_db.js --audio

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DB_DIR = path.join(ROOT, "vocab_db", "foundation");
const CHECK_AUDIO = process.argv.includes("--audio");
const EXPECTED = {
  words: 463,
  examples: 926,
  units: 33,
  passages: 66,
  dialogueTurns: 264,
  confusionSets: 26,
  confusionExamples: 104,
  confusionDialogueTurns: 104,
};
const LEVEL_COUNTS = { 1: 106, 2: 105, 3: 115, 4: 137 };
const UNIT_COUNTS = { 1: 8, 2: 7, 3: 8, 4: 10 };

const errors = [];
function fail(message) { errors.push(message); }
function readJson(filename) {
  return JSON.parse(fs.readFileSync(path.join(DB_DIR, filename), "utf8"));
}
function unique(items) { return new Set(items).size === items.length; }
function sameMembers(left, right) {
  return left.length === right.length && [...left].sort().every((item, index) => item === [...right].sort()[index]);
}

const manifest = readJson("manifest.json");
const words = [];
const units = [];
for (let level = 1; level <= 4; level += 1) {
  const wordFile = readJson(`words_l${level}.json`);
  const unitFile = readJson(`units_l${level}.json`);
  if (wordFile.level !== level || unitFile.level !== level) fail(`L${level}: file level mismatch`);
  if (wordFile.words.length !== LEVEL_COUNTS[level]) fail(`L${level}: wrong word count`);
  if (unitFile.units.length !== UNIT_COUNTS[level]) fail(`L${level}: wrong unit count`);
  words.push(...wordFile.words);
  units.push(...unitFile.units);
}

if (!unique(words.map(word => word.id))) fail("Word IDs are not unique");
if (!unique(words.map(word => word.word))) fail("Word spellings are not unique");
const byWord = new Map(words.map(word => [word.word, word]));
const audioPaths = new Set();

for (const word of words) {
  if (!word.id || !word.word || !word.zh || !word.pos || !word.level) fail(`Incomplete word record: ${word.id || word.word}`);
  if (!Array.isArray(word.bands) || !word.bands.length) fail(`${word.id}: missing F band`);
  if (!word.collocation || !word.sentenceFrame) fail(`${word.id}: missing collocation or frame`);
  if (!Array.isArray(word.examples) || word.examples.length !== 2) fail(`${word.id}: expected two examples`);
  if (!Array.isArray(word.confusionRefs)) fail(`${word.id}: confusionRefs must be an array`);
  if (word.pronunciationAudio) audioPaths.add(word.pronunciationAudio);
  for (const example of word.examples || []) {
    if (!example.id || !example.text || !example.audio) fail(`${word.id}: incomplete example`);
    if (!["recognition", "application"].includes(example.purpose)) fail(`${example.id}: invalid purpose`);
    if (example.audio) audioPaths.add(example.audio);
  }
}

for (const level of [1, 2, 3, 4]) {
  const levelWords = words.filter(word => word.level === level).map(word => word.word);
  const levelUnits = units.filter(unit => unit.level === level);
  const assigned = levelUnits.flatMap(unit => unit.targetWords);
  if (!sameMembers(levelWords, assigned)) fail(`L${level}: units do not assign every word exactly once`);
}

for (const unit of units) {
  if (unit.targetWords.length < 13 || unit.targetWords.length > 15) fail(`${unit.id}: unit size must be 13–15`);
  if (!unique(unit.targetWords)) fail(`${unit.id}: duplicate target word`);
  if (!Array.isArray(unit.passages) || unit.passages.length !== 2) fail(`${unit.id}: expected two passages`);
  const focusWords = unit.passages.flatMap(passage => passage.focusWords || []);
  if (!sameMembers(unit.targetWords, focusWords)) fail(`${unit.id}: passages must cover all unit words once`);
  for (const passage of unit.passages || []) {
    if (!passage.text || passage.type !== "guided-reading" || !passage.audio) fail(`${passage.id}: incomplete passage`);
    if (passage.audio) audioPaths.add(passage.audio);
  }
  if (!unit.dialogue || !Array.isArray(unit.dialogue.turns) || unit.dialogue.turns.length !== 8) {
    fail(`${unit.id}: expected eight dialogue turns`);
  } else {
    unit.dialogue.turns.forEach((turn, index) => {
      const expectedSpeaker = index % 2 === 0 ? "A" : "B";
      if (turn.speaker !== expectedSpeaker || !turn.text || !turn.audio) fail(`${turn.id}: invalid dialogue turn`);
      if (turn.audio) audioPaths.add(turn.audio);
    });
  }
  if (!unit.dialogue.fullAudio) fail(`${unit.id}: missing full dialogue audio`);
  else audioPaths.add(unit.dialogue.fullAudio);
}

const confusionFile = readJson("confusions_l1_l4.json");
const confusions = confusionFile.confusions || [];
if (!unique(confusions.map(item => item.id))) fail("Confusion IDs are not unique");
for (const item of confusions) {
  if (!item.titleZh || !item.conceptZh || !Array.isArray(item.rules) || item.rules.length < 2) {
    fail(`${item.id}: incomplete concept explanation`);
  }
  if (!Array.isArray(item.examples) || item.examples.length < 4) fail(`${item.id}: needs at least four contrast examples`);
  if (!Array.isArray(item.dialogue) || item.dialogue.length < 4) fail(`${item.id}: needs at least four dialogue turns`);
  if (!Array.isArray(item.checks) || item.checks.length < 2) fail(`${item.id}: needs at least two checks`);
  for (const member of item.members || []) {
    const word = byWord.get(member);
    if (!word) fail(`${item.id}: unknown member ${member}`);
    else if (!word.confusionRefs.includes(item.id)) fail(`${item.id}: missing reciprocal ref on ${member}`);
  }
  for (const example of item.examples || []) {
    if (!example.text || !example.audio) fail(`${example.id}: incomplete confusion example`);
    if (example.audio) audioPaths.add(example.audio);
  }
  for (const turn of item.dialogue || []) {
    if (!turn.text || !turn.audio) fail(`${turn.id}: incomplete confusion dialogue turn`);
    if (turn.audio) audioPaths.add(turn.audio);
  }
  if (!item.fullAudio) fail(`${item.id}: missing full confusion dialogue`);
  else audioPaths.add(item.fullAudio);
}

const actual = {
  words: words.length,
  examples: words.reduce((sum, word) => sum + word.examples.length, 0),
  units: units.length,
  passages: units.reduce((sum, unit) => sum + unit.passages.length, 0),
  dialogueTurns: units.reduce((sum, unit) => sum + unit.dialogue.turns.length, 0),
  confusionSets: confusions.length,
  confusionExamples: confusions.reduce((sum, item) => sum + item.examples.length, 0),
  confusionDialogueTurns: confusions.reduce((sum, item) => sum + item.dialogue.length, 0),
};
for (const [key, expected] of Object.entries(EXPECTED)) {
  if (actual[key] !== expected) fail(`${key}: expected ${expected}, got ${actual[key]}`);
  if (manifest.counts[key] !== expected) fail(`manifest ${key}: expected ${expected}, got ${manifest.counts[key]}`);
}
if (manifest.policy.browserSpeechFallback !== false) fail("Browser speech fallback must remain disabled");

if (CHECK_AUDIO) {
  for (const relative of audioPaths) {
    const filename = path.join(ROOT, relative);
    if (!fs.existsSync(filename)) fail(`Missing audio: ${relative}`);
    else if (fs.statSync(filename).size < 1000) fail(`Audio file is too small: ${relative}`);
  }
}

if (errors.length) {
  console.error(`Foundation vocabulary validation failed (${errors.length}):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  scope: manifest.scope,
  counts: actual,
  audioChecked: CHECK_AUDIO,
  audioFiles: audioPaths.size,
}, null, 2));
