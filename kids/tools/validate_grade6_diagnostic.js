// Static validation for the Grade 6 entry diagnostic.

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const data = require("../diagnostic_grade6_data.js");

const ROOT = path.resolve(__dirname, "..");
const HTML_PATH = path.join(ROOT, "diagnostic_grade6.html");
const INDEX_PATH = path.join(ROOT, "index.html");
const PARENT_PATH = path.join(ROOT, "parent.html");
const AUDIO_SPEC_PATH = path.join(ROOT, "tools", "audio_grade6_diagnostic.json");
const AUDIO_DIR = path.join(ROOT, "audio", "diagnostic_grade6");

const errors = [];
const expectedCounts = {
  listening: 6,
  recognition: 8,
  recall: 8,
  grammar: 12,
  reading: 8,
};

function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(data.questions.length === 42, `題目總數應為 42，實際 ${data.questions.length}`);
assert(data.sections.length === 6, `區段總數應為 6，實際 ${data.sections.length}`);

const ids = data.questions.map(question => question.id);
assert(new Set(ids).size === ids.length, "題目 ID 有重複");

for (const [section, expected] of Object.entries(expectedCounts)) {
  const actual = data.questions.filter(question => question.section === section).length;
  assert(actual === expected, `${section} 應有 ${expected} 題，實際 ${actual}`);
}

const validTiers = new Set(["Core", "Bridge", "Extension"]);
const passageIds = new Set(data.passages.map(passage => passage.id));

for (const question of data.questions) {
  assert(Boolean(question.prompt), `${question.id} 缺少 prompt`);
  assert(validTiers.has(question.tier), `${question.id} 的 tier 無效`);
  assert(["mc", "input"].includes(question.type), `${question.id} 的 type 無效`);

  if (question.type === "mc") {
    assert(Array.isArray(question.choices) && question.choices.length === 4,
      `${question.id} 選擇題應有 4 個選項`);
    assert(question.choices.includes(question.answer),
      `${question.id} 的正解不在選項內`);
    assert(new Set(question.choices).size === question.choices.length,
      `${question.id} 有重複選項`);
  }

  if (question.type === "input") {
    assert(Array.isArray(question.accepted) && question.accepted.includes(question.answer),
      `${question.id} 輸入題 accepted 未包含標準答案`);
  }

  if (question.section === "listening") {
    assert(Boolean(question.spoken), `${question.id} 缺少聽力原句`);
    assert(Boolean(question.audio), `${question.id} 缺少預錄音檔代號`);
  }

  if (question.section === "reading") {
    assert(passageIds.has(question.passageId), `${question.id} 的 passageId 無效`);
  }
}

for (const kind of ["writing", "speaking"]) {
  const task = data.performance[kind];
  assert(Boolean(task && task.prompt), `${kind} 缺少任務提示`);
  assert(Array.isArray(task && task.rubric) && task.rubric.length === 5,
    `${kind} 量表應有 0–4 共 5 級`);
  assert(task.rubric.every((item, index) => item.score === index),
    `${kind} 量表分數必須依序為 0–4`);
}

assert(data.bands.length === 5, "程度級距應有 5 級");
assert(data.bands.every((band, index) => index === 0 || band.minPercent > data.bands[index - 1].minPercent),
  "程度級距門檻必須遞增");

const html = fs.readFileSync(HTML_PATH, "utf8");
assert(!html.includes("speechSynthesis"), "診斷頁不得使用瀏覽器內建 speechSynthesis");
assert(!html.includes("SpeechSynthesisUtterance"),
  "診斷頁不得使用瀏覽器內建 SpeechSynthesisUtterance");
assert(html.includes("audio/diagnostic_grade6/"),
  "診斷頁尚未連接預先產生的音檔目錄");

const audioSpec = JSON.parse(fs.readFileSync(AUDIO_SPEC_PATH, "utf8"));
const listeningQuestions = data.questions.filter(question => question.section === "listening");
assert(Object.keys(audioSpec.items).length === listeningQuestions.length,
  "音檔規格數量必須與聽力題數一致");
for (const question of listeningQuestions) {
  assert(audioSpec.items[question.audio] === question.spoken,
    `${question.id} 的音檔文字與題庫不一致`);
  const audioPath = path.join(AUDIO_DIR, `${question.audio}.mp3`);
  assert(fs.existsSync(audioPath), `${question.id} 缺少 MP3：${question.audio}.mp3`);
  if (fs.existsSync(audioPath)) {
    const stat = fs.statSync(audioPath);
    assert(stat.size > 10000, `${question.audio}.mp3 太小，可能產生失敗`);
    const header = fs.readFileSync(audioPath).subarray(0, 3);
    const looksLikeMp3 =
      header.toString("ascii") === "ID3" ||
      (header[0] === 0xff && (header[1] & 0xe0) === 0xe0);
    assert(looksLikeMp3, `${question.audio}.mp3 檔頭不是有效 MP3`);
  }
}
const inlineScripts = [
  ...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi),
].map(match => match[1]).filter(script => script.trim());

assert(inlineScripts.length >= 1, "HTML 找不到主程式");
inlineScripts.forEach((script, index) => {
  try {
    new vm.Script(script, { filename: `diagnostic-inline-${index + 1}.js` });
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
  };
  sandbox.window = sandbox;
  sandbox.window.GRADE6_DIAGNOSTIC = data;
  sandbox.window.sbClient = {};
  vm.createContext(sandbox);

  try {
    vm.runInContext(inlineScripts[0], sandbox, {
      filename: "diagnostic-grade6-runtime.js",
    });

    const perfect = vm.runInContext(`
      currentStudent = "test";
      draft = emptyDraft();
      DATA.questions.forEach(q => { draft.answers[q.id] = q.answer; });
      draft.manual = { writing: 4, speaking: 4 };
      draft.writing = "We found a box. We opened it carefully because it was old.";
      scoreDiagnostic();
    `, sandbox);
    assert(perfect.objectiveCorrect === 42, "全對煙霧測試應為 42/42");
    assert(perfect.overallPercent === 100, "全對煙霧測試應為 100%");
    assert(perfect.band.id === "b1ready", "全對煙霧測試應判為 B1- 準備度");

    const allSkipped = vm.runInContext(`
      draft = emptyDraft();
      DATA.questions.forEach(q => { draft.answers[q.id] = SKIP; });
      draft.manual = { writing: 0, speaking: 0 };
      scoreDiagnostic();
    `, sandbox);
    assert(allSkipped.objectiveCorrect === 0, "全不知道煙霧測試應為 0/42");
    assert(allSkipped.band.id === "foundation", "全不知道煙霧測試應判為基礎重建");

    const provisional = vm.runInContext(`
      draft = emptyDraft();
      DATA.questions.forEach(q => { draft.answers[q.id] = q.answer; });
      draft.manual = { writing: null, speaking: null };
      scoreDiagnostic();
    `, sandbox);
    assert(provisional.band.id === "a2plus",
      "人工評分未完成時，最高只能暫定為 A2+");
  } catch (error) {
    errors.push(`計分煙霧測試失敗：${error.message}`);
  }
}

for (const relative of [
  "diagnostic_grade6_data.js",
  "cloud_sync.js",
  "account_lock.js",
  "supabase_auth.js",
]) {
  assert(fs.existsSync(path.join(ROOT, relative)), `缺少頁面依賴：${relative}`);
}

const indexHtml = fs.readFileSync(INDEX_PATH, "utf8");
const parentHtml = fs.readFileSync(PARENT_PATH, "utf8");
assert(indexHtml.includes('href="diagnostic_grade6.html"'), "兒童首頁尚未加入診斷入口");
assert(parentHtml.includes("diagnosticHtml(p)"), "家長總覽尚未顯示診斷摘要");

const summary = {
  questionCount: data.questions.length,
  sectionCounts: Object.fromEntries(
    Object.keys(expectedCounts).map(section => [
      section,
      data.questions.filter(question => question.section === section).length,
    ]),
  ),
  uniqueQuestionIds: new Set(ids).size,
  passageCount: data.passages.length,
  prerecordedAudioFiles: listeningQuestions.length,
  browserSpeechFallback: false,
  inlineScriptsChecked: inlineScripts.length,
  scoringSmokeTests: 3,
  errors,
};

console.log(JSON.stringify(summary, null, 2));
if (errors.length) process.exit(1);
