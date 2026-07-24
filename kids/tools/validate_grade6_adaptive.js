// Static and scoring validation for the adaptive Grade 6 entry diagnostic.

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const data = require("../diagnostic_grade6_adaptive_data.js");

const ROOT = path.resolve(__dirname, "..");
const HTML_PATH = path.join(ROOT, "diagnostic_grade6_adaptive.html");
const INDEX_PATH = path.join(ROOT, "index.html");
const PARENT_PATH = path.join(ROOT, "parent.html");
const AUDIO_SPEC_PATH = path.join(ROOT, "tools", "audio_grade6_adaptive.json");
const AUDIO_DIR = path.join(ROOT, "audio", "diagnostic_grade6_adaptive");
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const expectedCounts = {
  "gate-listening": 4,
  "gate-recognition": 8,
  "gate-grammar": 8,
  "gate-reading": 4,
  "low-listening": 4,
  "low-recall": 4,
  "low-grammar": 4,
  "low-reading": 4,
  "high-listening": 4,
  "high-vocabulary": 4,
  "high-grammar": 6,
  "high-reading": 4,
};
const stageCounts = { gate: 24, low: 16, high: 18 };

assert(data.id === "grade6-adaptive-foundation-diagnostic", "診斷 ID 不正確");
assert(data.questions.length === 58, `題庫應有 58 題，目前為 ${data.questions.length}`);
assert(data.sections.length === 13, `應有 13 個區段（含表達任務），目前為 ${data.sections.length}`);
assert(data.passages.length === 3, `應有 3 篇分級短文，目前為 ${data.passages.length}`);
assert(data.bands.length === 8, `應有 F0–F7 共 8 級，目前為 ${data.bands.length}`);
assert(data.bands.map(band => band.id).join(",") === "F0,F1,F2,F3,F4,F5,F6,F7",
  "級別必須依序為 F0–F7");

const ids = data.questions.map(question => question.id);
assert(new Set(ids).size === ids.length, "題目 ID 不可重複");

for (const [section, expected] of Object.entries(expectedCounts)) {
  const actual = data.questions.filter(question => question.section === section).length;
  assert(actual === expected, `${section} 應有 ${expected} 題，目前為 ${actual}`);
}
for (const [stage, expected] of Object.entries(stageCounts)) {
  const actual = data.questions.filter(question => question.stage === stage).length;
  assert(actual === expected, `${stage} 階段應有 ${expected} 題，目前為 ${actual}`);
}

const sectionIds = new Set(data.sections.map(section => section.id));
const passageIds = new Set(data.passages.map(passage => passage.id));
const validStages = new Set(["gate", "low", "high"]);
const validTypes = new Set(["mc", "input"]);
const validTiers = new Set(["F0", "F1", "F2", "F3", "F4", "F5", "F6", "F7"]);

for (const question of data.questions) {
  assert(Boolean(question.prompt), `${question.id} 缺少題目文字`);
  assert(sectionIds.has(question.section), `${question.id} 使用不存在的 section`);
  assert(validStages.has(question.stage), `${question.id} 的 stage 不正確`);
  assert(validTypes.has(question.type), `${question.id} 的 type 不正確`);
  assert(validTiers.has(question.tier), `${question.id} 的 tier 不正確`);

  if (question.type === "mc") {
    assert(Array.isArray(question.choices) && question.choices.length === 4,
      `${question.id} 選擇題必須正好有 4 個選項`);
    assert(question.choices.includes(question.answer), `${question.id} 的答案不在選項內`);
    assert(new Set(question.choices).size === question.choices.length, `${question.id} 有重複選項`);
  }
  if (question.type === "input") {
    assert(Array.isArray(question.accepted) && question.accepted.includes(question.answer),
      `${question.id} 的 accepted 必須包含標準答案`);
  }
  if (question.domain === "reading") {
    assert(passageIds.has(question.passageId), `${question.id} 的 passageId 不存在`);
  }
  if (question.domain === "listening") {
    assert(Boolean(question.audio), `${question.id} 缺少預生成音檔 ID`);
    assert(Boolean(question.spoken), `${question.id} 缺少語音原文`);
  }
}

for (const route of ["low", "high"]) {
  const task = data.performance[route];
  assert(Boolean(task && task.writing && task.writing.prompt), `${route} 缺少寫作任務`);
  assert(Boolean(task && task.speaking && task.speaking.prompt), `${route} 缺少口說任務`);
}
assert(Array.isArray(data.performance.rubric) && data.performance.rubric.length === 5,
  "表達量表必須包含 0–4 分");
assert(data.performance.rubric.every((item, index) => item.score === index),
  "表達量表分數必須依序為 0、1、2、3、4");

const audioSpec = JSON.parse(fs.readFileSync(AUDIO_SPEC_PATH, "utf8"));
const listeningQuestions = data.questions.filter(question => question.domain === "listening");
assert(listeningQuestions.length === 12, `應有 12 題聽力，目前為 ${listeningQuestions.length}`);
assert(Object.keys(audioSpec.items).length === listeningQuestions.length,
  "語音清單數量必須與聽力題數相同");
for (const question of listeningQuestions) {
  assert(audioSpec.items[question.audio] === question.spoken,
    `${question.id} 的題庫語音與預生成語音文字不一致`);
  const audioPath = path.join(AUDIO_DIR, `${question.audio}.mp3`);
  assert(fs.existsSync(audioPath), `${question.id} 缺少 ${question.audio}.mp3`);
  if (fs.existsSync(audioPath)) {
    const stat = fs.statSync(audioPath);
    assert(stat.size > 10000, `${question.audio}.mp3 太小，可能不是完整音檔`);
    const header = fs.readFileSync(audioPath).subarray(0, 3);
    const looksLikeMp3 =
      header.toString("ascii") === "ID3" ||
      (header[0] === 0xff && (header[1] & 0xe0) === 0xe0);
    assert(looksLikeMp3, `${question.audio}.mp3 不是有效的 MP3 檔頭`);
  }
}

const html = fs.readFileSync(HTML_PATH, "utf8");
assert(html.includes("audio/diagnostic_grade6_adaptive/"),
  "測驗頁未引用預生成語音目錄");
assert(!html.includes("speechSynthesis"), "測驗頁不得使用瀏覽器 speechSynthesis");
assert(!html.includes("SpeechSynthesisUtterance"),
  "測驗頁不得使用瀏覽器 SpeechSynthesisUtterance");

const inlineScripts = [
  ...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi),
].map(match => match[1]).filter(script => script.trim());
assert(inlineScripts.length === 1, `預期 1 段內嵌程式，目前為 ${inlineScripts.length}`);
inlineScripts.forEach((script, index) => {
  try {
    new vm.Script(script, { filename: `adaptive-inline-${index + 1}.js` });
  } catch (error) {
    errors.push(`HTML 內嵌程式語法錯誤：${error.message}`);
  }
});

if (inlineScripts.length) {
  const storage = new Map();
  const localStorage = {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); },
  };
  function AudioStub() {
    this.pause = function () {};
    this.play = function () { return Promise.resolve(); };
  }
  const sandbox = {
    console,
    localStorage,
    navigator: {},
    document: {},
    confirm() { return true; },
    alert() {},
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Blob,
    URL,
    Audio: AudioStub,
  };
  sandbox.window = sandbox;
  sandbox.window.GRADE6_ADAPTIVE_DIAGNOSTIC = data;
  sandbox.window.sbClient = {};
  vm.createContext(sandbox);

  try {
    vm.runInContext(inlineScripts[0], sandbox, { filename: "adaptive-grade6-runtime.js" });

    const highRoute = vm.runInContext(`
      currentStudent = "test";
      draft = newDraft();
      DATA.questions.filter(q => q.stage === "gate").forEach(q => { draft.answers[q.id] = q.answer; });
      chooseRoute();
    `, sandbox);
    assert(highRoute === "high", "基礎閘門全對時應進入 high 分流");

    const lowRoute = vm.runInContext(`
      draft = newDraft();
      DATA.questions.filter(q => q.stage === "gate").forEach(q => { draft.answers[q.id] = SKIP; });
      chooseRoute();
    `, sandbox);
    assert(lowRoute === "low", "基礎閘門全錯時應進入 low 分流");

    const perfectHigh = vm.runInContext(`
      draft = newDraft();
      draft.route = "high";
      DATA.questions.filter(q => q.stage === "gate" || q.stage === "high")
        .forEach(q => { draft.answers[q.id] = q.answer; });
      draft.manual = { writing: 4, speaking: 4 };
      scoreDiagnostic();
    `, sandbox);
    assert(perfectHigh.objective.correct === 42, "high 分流滿分應為 42/42 題");
    assert(perfectHigh.overallPercent === 100, "high 分流滿分應為 100%");
    assert(perfectHigh.band.id === "F7", "high 分流滿分應落在 F7");

    const provisionalHigh = vm.runInContext(`
      draft = newDraft();
      draft.route = "high";
      DATA.questions.filter(q => q.stage === "gate" || q.stage === "high")
        .forEach(q => { draft.answers[q.id] = q.answer; });
      draft.manual = { writing: null, speaking: null };
      scoreDiagnostic();
    `, sandbox);
    assert(provisionalHigh.band.id === "F6", "表達未評分時 high 分流最高應暫定為 F6");

    const allSkippedLow = vm.runInContext(`
      draft = newDraft();
      draft.route = "low";
      DATA.questions.filter(q => q.stage === "gate" || q.stage === "low")
        .forEach(q => { draft.answers[q.id] = SKIP; });
      draft.manual = { writing: 0, speaking: 0 };
      scoreDiagnostic();
    `, sandbox);
    assert(allSkippedLow.objective.correct === 0, "low 分流全跳過應為 0 題答對");
    assert(allSkippedLow.band.id === "F0", "low 分流全跳過應落在 F0");
  } catch (error) {
    errors.push(`執行期評分測試失敗：${error.message}`);
  }
}

for (const relative of [
  "diagnostic_grade6_adaptive_data.js",
  "cloud_sync.js",
  "account_lock.js",
  "supabase_auth.js",
]) {
  assert(fs.existsSync(path.join(ROOT, relative)), `缺少必要檔案：${relative}`);
}

const indexHtml = fs.readFileSync(INDEX_PATH, "utf8");
const parentHtml = fs.readFileSync(PARENT_PATH, "utf8");
assert(indexHtml.includes('href="diagnostic_grade6_adaptive.html"'),
  "首頁缺少適性診斷入口");
assert(parentHtml.includes("adaptiveDiagnosticHtml(p)"),
  "家長頁缺少適性診斷結果區塊");
for (const [name, source] of [["index", indexHtml], ["parent", parentHtml]]) {
  const scripts = [
    ...source.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi),
  ].map(match => match[1]).filter(script => script.trim());
  scripts.forEach((script, index) => {
    try {
      new vm.Script(script, { filename: `${name}-inline-${index + 1}.js` });
    } catch (error) {
      errors.push(`${name}.html 內嵌程式語法錯誤：${error.message}`);
    }
  });
}

const summary = {
  questionCount: data.questions.length,
  stageCounts: Object.fromEntries(
    Object.keys(stageCounts).map(stage => [
      stage,
      data.questions.filter(question => question.stage === stage).length,
    ]),
  ),
  levels: data.bands.map(band => band.id),
  prerecordedAudioFiles: listeningQuestions.length,
  browserSpeechFallback: false,
  scoringSmokeTests: 5,
  errors,
};

console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exit(1);
