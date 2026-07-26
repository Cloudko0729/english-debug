// Validate the generated F0–F7 grammar database.
// Usage:
//   node kids/tools/validate_grammar_db.js
//   node kids/tools/validate_grammar_db.js --audio

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DB_DIR = path.join(ROOT, "grammar_db");
const SPEC_DIR = path.join(ROOT, "tools", "grammar_audio_specs");
const CHECK_AUDIO = process.argv.includes("--audio");
const EXPECTED = {
  nodes: 48,
  naturalExamples: 192,
  contrastPairs: 96,
  chineseTransferBugs: 96,
  dialogues: 48,
  dialogueTurns: 192,
  diagnostics: 144,
  productionTasks: 96,
  revisionTasks: 48,
  diagrams: 19,
  generatedAudioLines: 912,
  fullDialogueAudio: 48,
  totalAudioReferences: 960,
};
const BAND_COUNTS = { F0: 5, F1: 6, F2: 7, F3: 6, F4: 6, F5: 6, F6: 6, F7: 6 };
const STATUSES = new Set(["natural", "acceptable", "awkward", "misleading"]);
const SEVERITIES = new Set(["E0", "E1", "E2", "E3"]);
const DIAGNOSTIC_DOMAINS = new Set(["form", "repair", "naturalness"]);

const errors = [];
function fail(message) { errors.push(message); }
function unique(values) { return new Set(values).size === values.length; }
function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(DB_DIR, relative), "utf8"));
}
function collectAudio(value, output) {
  if (Array.isArray(value)) {
    value.forEach(child => collectAudio(child, output));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach(child => collectAudio(child, output));
  } else if (typeof value === "string" && value.toLowerCase().endsWith(".mp3")) {
    output.add(value);
  }
}
function validateUtterance(value, label, audioPaths) {
  if (!value || !value.text || !STATUSES.has(value.status) || !value.audio) {
    fail(`${label}: incomplete utterance or invalid status`);
  }
  if (value?.audio) audioPaths.add(value.audio);
}

const manifest = readJson("manifest.json");
const diagramIndex = readJson("diagrams.json");
const lessonCycle = readJson("ten_lesson_cycle.json");
const monthlyCourseMap = readJson("monthly_course_map.json");
const diagrams = diagramIndex.diagrams || [];
const diagramIds = new Set(diagrams.map(item => item.id));
const nodes = [];
for (let number = 0; number <= 7; number += 1) {
  const band = `F${number}`;
  const data = readJson(`bands/f${number}.json`);
  if (data.band !== band) fail(`${band}: file band mismatch`);
  if (!Array.isArray(data.nodes) || data.nodes.length !== BAND_COUNTS[band]) {
    fail(`${band}: expected ${BAND_COUNTS[band]} nodes, got ${data.nodes?.length}`);
  }
  nodes.push(...(data.nodes || []));
}

if (!unique(nodes.map(item => item.id))) fail("Grammar node IDs are not unique");
if (!unique(diagrams.map(item => item.id))) fail("Diagram IDs are not unique");
const nodeIds = new Set(nodes.map(item => item.id));
const audioPaths = new Set();

for (const node of nodes) {
  const label = node.id || "(missing node ID)";
  if (!node.id || !node.band || !node.microLevel || !node.titleZh || !node.titleEn ||
      !node.communicativeGoalZh || !node.form) fail(`${label}: incomplete identity or objective`);
  if (!node.id.startsWith(`${node.band}.`)) fail(`${label}: ID and band disagree`);
  if (!diagramIds.has(node.diagramRef)) fail(`${label}: unknown diagram ${node.diagramRef}`);
  if (!Array.isArray(node.prerequisites)) fail(`${label}: prerequisites must be an array`);
  for (const prerequisite of node.prerequisites || []) {
    if (!nodeIds.has(prerequisite)) fail(`${label}: unknown prerequisite ${prerequisite}`);
    if (prerequisite === node.id) fail(`${label}: cannot require itself`);
  }

  if (!Array.isArray(node.naturalExamples) || node.naturalExamples.length !== 4) {
    fail(`${label}: expected four natural examples`);
  }
  for (const example of node.naturalExamples || []) {
    validateUtterance(example, example.id || label, audioPaths);
    if (example.status !== "natural") fail(`${example.id}: natural example must be marked natural`);
  }
  if (!unique((node.naturalExamples || []).map(item => item.text))) fail(`${label}: duplicate natural example`);

  if (!Array.isArray(node.contrastPairs) || node.contrastPairs.length !== 2) {
    fail(`${label}: expected two contrast pairs`);
  }
  for (const pair of node.contrastPairs || []) {
    validateUtterance(pair.wrong, `${pair.id} wrong`, audioPaths);
    validateUtterance(pair.better, `${pair.id} better`, audioPaths);
    if (!pair.reasonZh || pair.wrong.text === pair.better.text) fail(`${pair.id}: invalid contrast`);
    if (pair.better.status !== "natural") fail(`${pair.id}: better form must be natural`);
  }

  if (!Array.isArray(node.chineseTransferBugs) || node.chineseTransferBugs.length !== 2) {
    fail(`${label}: expected two Chinese-transfer bugs`);
  }
  for (const bug of node.chineseTransferBugs || []) {
    validateUtterance(bug.wrong, `${bug.id} wrong`, audioPaths);
    validateUtterance(bug.better, `${bug.id} better`, audioPaths);
    if (!bug.zh || !bug.reasonZh || !SEVERITIES.has(bug.severity)) fail(`${bug.id}: incomplete bug record`);
    if (bug.wrong.text === bug.better.text) fail(`${bug.id}: wrong and better forms are identical`);
    if (bug.better.status !== "natural") fail(`${bug.id}: better form must be natural`);
  }

  const diagnostics = node.diagnostics || [];
  if (diagnostics.length !== 3) fail(`${label}: expected three diagnostics`);
  if (!unique(diagnostics.map(item => item.id))) fail(`${label}: duplicate diagnostic ID`);
  if (new Set(diagnostics.map(item => item.domain)).size !== 3 ||
      diagnostics.some(item => !DIAGNOSTIC_DOMAINS.has(item.domain))) {
    fail(`${label}: diagnostic domains must be form, repair and naturalness`);
  }
  for (const item of diagnostics) {
    const choices = item.choices || [];
    if (!item.promptZh || choices.length !== 3 || !unique(choices.map(choice => choice.id)) ||
        !unique(choices.map(choice => choice.text))) fail(`${item.id}: invalid choices`);
    const answer = choices.find(choice => choice.id === item.answerId);
    if (!answer || answer.status !== "natural") fail(`${item.id}: answer must identify one natural choice`);
    choices.forEach(choice => validateUtterance(choice, `${item.id} choice`, audioPaths));
  }

  const tasks = node.productionTasks || [];
  if (tasks.length !== 2 || !tasks.some(item => item.type === "speaking") ||
      !tasks.some(item => item.type === "writing")) fail(`${label}: requires speaking and writing tasks`);
  for (const task of tasks) {
    if (!task.prompt || !task.promptAudio || !task.expectedFeatures?.length ||
        task.scoring?.meaning !== 2 || task.scoring?.targetForm !== 2 ||
        task.scoring?.naturalness !== 1) fail(`${task.id}: incomplete production task`);
    if (task.promptAudio) audioPaths.add(task.promptAudio);
  }

  const revision = node.revisionTask;
  if (!revision?.text || !revision.audio || !revision.promptZh ||
      revision.expectedCorrections?.length !== 2 || revision.severityTargets?.length !== 2) {
    fail(`${label}: incomplete revision task`);
  }
  if (revision?.audio) audioPaths.add(revision.audio);

  const turns = node.dialogue?.turns || [];
  if (turns.length !== 4) fail(`${label}: expected four dialogue turns`);
  turns.forEach((turn, index) => {
    const speaker = index % 2 === 0 ? "A" : "B";
    if (turn.speaker !== speaker || !turn.text || !turn.audio) fail(`${turn.id}: invalid dialogue turn`);
    if (turn.audio) audioPaths.add(turn.audio);
  });
  if (!node.dialogue?.fullAudio) fail(`${label}: missing full dialogue audio`);
  else audioPaths.add(node.dialogue.fullAudio);
}

for (const [band, expectedCount] of Object.entries(BAND_COUNTS)) {
  const levels = nodes.filter(item => item.band === band).map(item => item.microLevel).sort((a, b) => a - b);
  const expectedLevels = Array.from({ length: expectedCount }, (_, index) => index + 1);
  if (levels.join(",") !== expectedLevels.join(",")) fail(`${band}: micro-levels must be contiguous`);
}

const visitState = new Map();
function visit(nodeId, trail = []) {
  if (visitState.get(nodeId) === "done") return;
  if (visitState.get(nodeId) === "visiting") {
    fail(`Prerequisite cycle: ${[...trail, nodeId].join(" -> ")}`);
    return;
  }
  visitState.set(nodeId, "visiting");
  const node = nodes.find(item => item.id === nodeId);
  for (const prerequisite of node?.prerequisites || []) visit(prerequisite, [...trail, nodeId]);
  visitState.set(nodeId, "done");
}
nodes.forEach(item => visit(item.id));

const lessons = lessonCycle.lessons || [];
if (lessons.length !== 10 || lessons.map(item => item.slot).join(",") !== "1,2,3,4,5,6,7,8,9,10") {
  fail("Ten-lesson cycle must contain ordered slots 1–10");
}
if (lessonCycle.weeklyPractice?.progressDays !== 5 ||
    lessonCycle.weeklyPractice?.cumulativeReviewDays !== 2 ||
    lessonCycle.weeklyPractice?.browserSpeechFallback !== false) {
  fail("Weekly practice policy must remain 5 progress days + 2 cumulative review days with no browser TTS");
}
const expectedMonths = [
  "2026-09", "2026-10", "2026-11", "2026-12", "2027-01",
  "2027-02", "2027-03", "2027-04", "2027-05", "2027-06",
];
const months = monthlyCourseMap.months || [];
if (months.map(item => item.month).join(",") !== expectedMonths.join(",")) {
  fail("Monthly course map must cover 2026-09 through 2027-06 in order");
}
const candidateCoverage = [];
for (const month of months) {
  if (!month.storyGoalZh || !month.adaptationZh ||
      !Array.isArray(month.candidateNodes) || !Array.isArray(month.fallbackNodes) ||
      !unique(month.candidateNodes) || !unique(month.fallbackNodes)) fail(`${month.month}: incomplete monthly map`);
  for (const nodeId of [...month.candidateNodes, ...month.fallbackNodes]) {
    if (!nodeIds.has(nodeId)) fail(`${month.month}: unknown course node ${nodeId}`);
  }
  candidateCoverage.push(...month.candidateNodes);
}
if (!unique(candidateCoverage) ||
    candidateCoverage.length !== nodes.length ||
    candidateCoverage.some(nodeId => !nodeIds.has(nodeId))) {
  fail("Monthly candidate pools must cover each of the 48 grammar nodes exactly once");
}
if (!monthlyCourseMap.candidateOrderPolicy) fail("Monthly course map must document prerequisite-first candidate order");
const candidatePositions = new Map();
months.forEach((month, monthIndex) => {
  month.candidateNodes.forEach((nodeId, nodeIndex) => {
    candidatePositions.set(nodeId, { month: month.month, monthIndex, nodeIndex });
  });
});
for (const node of nodes) {
  const nodePosition = candidatePositions.get(node.id);
  for (const prerequisite of node.prerequisites) {
    const prerequisitePosition = candidatePositions.get(prerequisite);
    if (!nodePosition || !prerequisitePosition) continue;
    const outOfOrder = prerequisitePosition.monthIndex > nodePosition.monthIndex ||
      (prerequisitePosition.monthIndex === nodePosition.monthIndex &&
       prerequisitePosition.nodeIndex >= nodePosition.nodeIndex);
    if (outOfOrder) {
      fail(`${node.id}: prerequisite ${prerequisite} must appear earlier in monthly candidate order`);
    }
  }
}

const specPaths = new Set();
const specCounts = {};
for (const filename of ["grammar_content.json", "grammar_dialogue_a.json", "grammar_dialogue_b.json"]) {
  const spec = JSON.parse(fs.readFileSync(path.join(SPEC_DIR, filename), "utf8"));
  const entries = Object.entries(spec.items || {});
  specCounts[filename] = entries.length;
  for (const [name, text] of entries) {
    if (!name || !text) fail(`${filename}: empty audio name or text`);
    const relative = path.relative(ROOT, path.join(spec.outdir, `${name}.mp3`)).replaceAll("\\", "/");
    if (specPaths.has(relative)) fail(`${filename}: duplicate output ${relative}`);
    specPaths.add(relative);
  }
}
for (const expectedPath of [...audioPaths].filter(item => !item.includes("/dialogues/"))) {
  if (!specPaths.has(expectedPath)) fail(`Audio reference missing from specs: ${expectedPath}`);
}
for (const generatedPath of specPaths) {
  if (!audioPaths.has(generatedPath)) fail(`Audio spec output is unreferenced: ${generatedPath}`);
}

for (const item of diagrams) {
  if (!item.titleZh || !item.descriptionZh || !item.file) fail(`${item.id}: incomplete diagram index`);
  const filename = path.join(DB_DIR, item.file);
  if (!fs.existsSync(filename)) {
    fail(`${item.id}: missing SVG`);
    continue;
  }
  const svg = fs.readFileSync(filename, "utf8");
  if (!/<svg\b/.test(svg) || !/width="760"/.test(svg) || !/height="440"/.test(svg) ||
      !/viewBox="0 0 760 440"/.test(svg) || !/<title\b/.test(svg) ||
      !/<desc\b/.test(svg) || !/role="img"/.test(svg)) fail(`${item.id}: SVG lacks accessibility metadata`);
  if (/<image\b/i.test(svg)) fail(`${item.id}: embedded raster image is not allowed`);
}
const embedCssPath = path.join(DB_DIR, "diagram_embed.css");
if (!fs.existsSync(embedCssPath)) {
  fail("Missing mobile diagram embed CSS");
} else {
  const embedCss = fs.readFileSync(embedCssPath, "utf8").replace(/\s+/g, "");
  if (!embedCss.includes(".grammar-diagram-scroll") ||
      !embedCss.includes("overflow-x:auto") ||
      !embedCss.includes("min-width:680px")) {
    fail("Mobile diagram embed CSS must preserve readable width with horizontal scrolling");
  }
}

const actual = {
  nodes: nodes.length,
  naturalExamples: nodes.reduce((sum, item) => sum + item.naturalExamples.length, 0),
  contrastPairs: nodes.reduce((sum, item) => sum + item.contrastPairs.length, 0),
  chineseTransferBugs: nodes.reduce((sum, item) => sum + item.chineseTransferBugs.length, 0),
  dialogues: nodes.length,
  dialogueTurns: nodes.reduce((sum, item) => sum + item.dialogue.turns.length, 0),
  diagnostics: nodes.reduce((sum, item) => sum + item.diagnostics.length, 0),
  productionTasks: nodes.reduce((sum, item) => sum + item.productionTasks.length, 0),
  revisionTasks: nodes.filter(item => item.revisionTask).length,
  diagrams: diagrams.length,
  generatedAudioLines: specPaths.size,
  fullDialogueAudio: nodes.filter(item => item.dialogue.fullAudio).length,
  totalAudioReferences: audioPaths.size,
};
for (const [key, expected] of Object.entries(EXPECTED)) {
  if (actual[key] !== expected) fail(`${key}: expected ${expected}, got ${actual[key]}`);
  if (manifest.counts[key] !== expected) fail(`manifest ${key}: expected ${expected}, got ${manifest.counts[key]}`);
}
for (const [band, expected] of Object.entries(BAND_COUNTS)) {
  if (manifest.counts.byBand?.[band] !== expected) fail(`manifest ${band}: expected ${expected}`);
}
if (manifest.policy?.foundationNodes !== 24) fail("Foundation node count must be 24");
if (manifest.policy?.browserSpeechFallback !== false) fail("Browser speech fallback must remain disabled");
if (manifest.files?.tenLessonCycle !== "ten_lesson_cycle.json" ||
    manifest.files?.monthlyCourseMap !== "monthly_course_map.json") fail("Manifest is missing course-map references");
if (specCounts["grammar_content.json"] !== 720 ||
    specCounts["grammar_dialogue_a.json"] !== 96 ||
    specCounts["grammar_dialogue_b.json"] !== 96) fail("Audio spec counts must be 720 / 96 / 96");

if (CHECK_AUDIO) {
  for (const relative of audioPaths) {
    const filename = path.join(ROOT, relative);
    if (!fs.existsSync(filename)) fail(`Missing audio: ${relative}`);
    else if (fs.statSync(filename).size < 1000) fail(`Audio file is too small: ${relative}`);
  }
}

if (errors.length) {
  console.error(`Grammar database validation failed (${errors.length}):`);
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
