// 產生六年級 10 堂主課的逐字分類表。
// Source of truth:
//   kids/grade6_10_lessons_candidate_vocab.md
// Output:
//   kids/grade6_10_lessons_vocab_classified.md
//
// Classification is a curriculum planning judgment, not an official CEFR
// certification for individual words.

const fs = require("fs");
const path = require("path");
const { WORD_LEVELS, EXTRA_LEVELS } = require("../wordlevels.js");

const ROOT = path.resolve(__dirname, "..");
const INPUT = path.join(ROOT, "grade6_10_lessons_candidate_vocab.md");
const OUTPUT = path.join(ROOT, "grade6_10_lessons_vocab_classified.md");
const OUTPUT_JSON = path.join(ROOT, "grade6_10_lessons_vocab_classified.json");

const LESSON_NAMES = {
  1: "Sentence Foundations",
  2: "Everyday Facts and Questions",
  3: "Usually and Right Now",
  4: "What Happened?",
  5: "Build a Clear Story",
  6: "Past and Present Connections",
  7: "Compare, Measure and Decide",
  8: "Plans, Conditions and Connections",
  9: "Explain People, Things and Processes",
  10: "Edit Like a Grade 6 Writer",
};

const DOMAIN_BY_LESSON = {
  1: "人物／基礎文法",
  2: "空間／地圖",
  3: "作息／動作狀態",
  4: "事件／敘事",
  5: "敘事／引語",
  6: "時間／歷史資料",
  7: "比較／證據",
  8: "環境／公民",
  9: "科技／流程",
  10: "研究／寫作修訂",
};

// 本地表未收，但仍屬常見 A1–A2 日常或兒童故事字。
const CORE_OVERRIDES = new Set([
  "librarian", "clue", "label", "belong",
  "route", "bridge", "clinic", "opposite", "nearby", "locate", "destination",
  "routine", "schedule", "notice",
  "festival", "celebrate", "performance", "ingredient", "taste", "spill",
  "break", "announce", "whisper", "slip", "rescue", "shelter",
  "journey", "slippery",
]);

// 字面或用途比本地級數更偏學術／正式，主動學習但列為 Bridge。
const BRIDGE_OVERRIDES = new Set([
  "identify", "organize", "responsible", "curious", "investigate",
  "source", "change", "remain", "replace", "present",
  "sentence", "noun", "singular", "plural",
  "landmark", "position", "region", "compass", "location",
  "unusual", "temporary", "permanent", "frequency",
  "incident", "emergency", "witness", "background", "meanwhile", "eventually", "sequence",
  "archive", "historical", "progress", "duration", "connection", "specific", "summary",
  "evidence", "reliable", "likely", "approximately",
  "sustainable", "emission", "renewable", "conserve", "proposal", "condition",
  "alternative", "community",
  "manufacture", "equipment", "technology", "innovation", "automatic", "digital",
  "mechanical", "user", "accessible",
  "synonym", "antonym", "credible", "audience", "revise",
]);

// 以英美六年級閱讀／修訂辨識為目標，不要求立即自由產出。
const EXTENSION_OVERRIDES = new Set([
  "predicate", "determiner", "punctuation",
  "fragment", "run-on",
  "interruption",
  "timeline", "account", "quotation", "narrator", "consequence", "viewpoint",
  "participle", "perfect", "continuous",
  "infrastructure",
  "connotation", "ambiguous", "cohesive", "transition", "bias",
]);

const GRAMMAR_TERMS = new Set([
  "sentence", "subject", "predicate", "noun", "verb", "singular", "plural",
  "pronoun", "determiner", "punctuation", "frequency", "action", "state",
  "fragment", "run-on", "participle", "perfect", "continuous",
  "synonym", "antonym", "connotation", "ambiguous", "cohesive", "transition",
]);

// Exact or accepted variant appearing in the England Years 5–6 statutory spelling list.
const UK_Y56_SPELLING = new Set([
  "achieve", "average", "communicate", "community", "develop", "environment",
  "equipment", "immediately", "necessary", "persuade", "recommend",
]);

const US_G6_LANGUAGE = new Set([
  "claim", "reason", "evidence", "fact", "opinion", "reliable", "likely",
  "possible", "certain", "approximately", "source", "document", "summary",
  "article", "author", "context", "reference", "quote", "verify", "misleading",
  "research", "survey", "data", "argument", "conclusion", "present", "persuade",
  "request", "obtain", "communicate", "formal", "precise", "synonym", "antonym",
  "connotation", "ambiguous", "cohesive", "transition", "credible", "bias",
  "audience", "revise",
]);

const LEVEL_LABELS = {
  Core: "Core（A1–A2 核心）",
  Bridge: "Bridge（A2+–B1- 橋接）",
  Extension: "Extension（英美六年級辨識）",
};

function normalize(word) {
  return String(word || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function variants(word) {
  return normalize(word).split(/\s*\/\s*/);
}

function localLevel(word) {
  for (const variant of variants(word)) {
    if (WORD_LEVELS[variant]) return { source: "TW1200", level: WORD_LEVELS[variant] };
    if (EXTRA_LEVELS[variant]) return { source: "RepoExtra", level: EXTRA_LEVELS[variant] };
  }
  return null;
}

function parseCandidates() {
  const lines = fs.readFileSync(INPUT, "utf8").split(/\r?\n/);
  const items = [];
  let lesson = 0;
  let target = "";
  const code = String.fromCharCode(96);
  const pairRe = new RegExp(`${code}([^${code}]+)${code}（([^）]+)）`, "g");

  for (const line of lines) {
    const lessonMatch = line.match(/^## 第 (\d+) 堂/);
    if (lessonMatch) {
      lesson = Number(lessonMatch[1]);
      target = "";
      continue;
    }
    if (/^### 應用字/.test(line)) {
      target = "active";
      continue;
    }
    if (/^### 認識/.test(line)) {
      target = "receptive";
      continue;
    }
    if (!lesson || !target || !line.startsWith("- ")) continue;

    for (const match of line.matchAll(pairRe)) {
      items.push({
        lesson,
        lessonName: LESSON_NAMES[lesson],
        word: match[1],
        zh: match[2],
        target,
      });
    }
  }
  return items;
}

function classifyDifficulty(item) {
  const word = normalize(item.word);
  if (EXTENSION_OVERRIDES.has(word)) return "Extension";
  if (CORE_OVERRIDES.has(word)) return "Core";
  if (BRIDGE_OVERRIDES.has(word)) return "Bridge";

  const local = localLevel(word);
  if (item.target === "active") {
    if (local && local.level <= 6) return "Core";
    return "Bridge";
  }
  if (local && local.level <= 6) return "Core";
  if (local && local.level === 7) return "Bridge";
  return "Extension";
}

function classifyFramework(item) {
  const word = normalize(item.word);
  const tags = [];
  if (GRAMMAR_TERMS.has(word)) tags.push("英美 G1–6 文法術語");
  if (UK_Y56_SPELLING.has(word)) tags.push("UK Y5–6 spelling");
  if (US_G6_LANGUAGE.has(word)) tags.push("US G6 Language");

  if (tags.length === 0) {
    if (item.lesson <= 3) tags.push("臺灣／Cambridge 日常核心");
    else if (item.lesson <= 6) tags.push("Cambridge A2 敘事");
    else if (item.lesson === 7) tags.push("英美 G6 比較與論證");
    else if (item.lesson === 8) tags.push("英美 G6 環境／公民");
    else if (item.lesson === 9) tags.push("英美 G6 科技／流程");
    else tags.push("英美 G6 研究／修訂");
  }
  return tags.join("＋");
}

function localSourceLabel(word) {
  const local = localLevel(word);
  if (!local) return "補充詞";
  return local.source === "TW1200"
    ? `本地 1200 表 L${local.level}`
    : `Repo 補充分級 L${local.level}`;
}

function buildRecords() {
  return parseCandidates().map(item => ({
    ...item,
    difficulty: classifyDifficulty(item),
    targetLabel: item.target === "active" ? "應用" : "認識",
    localSource: localSourceLabel(item.word),
    framework: classifyFramework(item),
    domain: DOMAIN_BY_LESSON[item.lesson],
    studentStatus: "待診斷",
  }));
}

function validate(records) {
  const errors = [];
  if (records.length !== 300) errors.push(`總數應為 300，實際 ${records.length}`);

  const normalized = records.map(item => normalize(item.word));
  const duplicates = [...new Set(normalized.filter((word, index) => normalized.indexOf(word) !== index))];
  if (duplicates.length) errors.push(`重複：${duplicates.join(", ")}`);

  for (let lesson = 1; lesson <= 10; lesson++) {
    const lessonItems = records.filter(item => item.lesson === lesson);
    const active = lessonItems.filter(item => item.target === "active").length;
    const receptive = lessonItems.filter(item => item.target === "receptive").length;
    if (active !== 20 || receptive !== 10) {
      errors.push(`第 ${lesson} 堂應為 20 應用＋10 認識，實際 ${active}＋${receptive}`);
    }
  }

  const validLevels = new Set(["Core", "Bridge", "Extension"]);
  const invalid = records.filter(item => !validLevels.has(item.difficulty));
  if (invalid.length) errors.push(`未分類：${invalid.map(item => item.word).join(", ")}`);

  if (errors.length) throw new Error(errors.join("\n"));
}

function render(records) {
  const counts = {
    Core: records.filter(item => item.difficulty === "Core").length,
    Bridge: records.filter(item => item.difficulty === "Bridge").length,
    Extension: records.filter(item => item.difficulty === "Extension").length,
    active: records.filter(item => item.target === "active").length,
    receptive: records.filter(item => item.target === "receptive").length,
  };

  const out = [
    "# 六年級一年制課程：300 個候選字逐字分類",
    "",
    "> 產生日期：2026-07-24",
    "> 來源：`kids/grade6_10_lessons_candidate_vocab.md`",
    "> 學生狀態：尚未進行個人測驗，全部先標為「待診斷」",
    "",
    "## 分類標準",
    "",
    "- **Core**：A1–A2 日常高頻、故事核心或本地分級較基礎的字，優先建立主動使用。",
    "- **Bridge**：A2+–B1-、較抽象或正式的主題字，逐步由理解提升到說寫。",
    "- **Extension**：英美六年級文法、學術、修訂或專門領域辨識字，先要求讀懂與受控使用。",
    "- **應用**：要能聽、說、讀，常用者能寫；**認識**：先能辨識、推義和在句框中使用。",
    "- 個別單字沒有全球唯一的官方 CEFR 等級；本表是依本地 1,200 字分級、額外字級、學習目標與英美六年級任務所做的課程判定。",
    "",
    "## 統計",
    "",
    `- 總數：${records.length}`,
    `- 學習目標：應用 ${counts.active}、認識 ${counts.receptive}`,
    `- 難度：Core ${counts.Core}、Bridge ${counts.Bridge}、Extension ${counts.Extension}`,
    "",
  ];

  for (let lesson = 1; lesson <= 10; lesson++) {
    const lessonItems = records.filter(item => item.lesson === lesson);
    const lessonCounts = {
      Core: lessonItems.filter(item => item.difficulty === "Core").length,
      Bridge: lessonItems.filter(item => item.difficulty === "Bridge").length,
      Extension: lessonItems.filter(item => item.difficulty === "Extension").length,
    };
    out.push(
      `## 第 ${lesson} 堂：${LESSON_NAMES[lesson]}`,
      "",
      `本堂難度分布：Core ${lessonCounts.Core}／Bridge ${lessonCounts.Bridge}／Extension ${lessonCounts.Extension}`,
      "",
      "| 單字 | 中文 | 目標 | 程度 | 本地來源 | 課程依據 | 學生狀態 |",
      "|---|---|---|---|---|---|---|",
    );
    for (const item of lessonItems) {
      out.push(
        `| \`${item.word}\` | ${item.zh} | ${item.targetLabel} | ${LEVEL_LABELS[item.difficulty]} | ${item.localSource} | ${item.framework} | ${item.studentStatus} |`,
      );
    }
    out.push("");
  }
  return `${out.join("\n").trimEnd()}\n`;
}

const records = buildRecords();
validate(records);
fs.writeFileSync(OUTPUT, render(records), "utf8");
fs.writeFileSync(
  OUTPUT_JSON,
  `${JSON.stringify(
    {
      generatedOn: "2026-07-24",
      source: path.basename(INPUT),
      note: "Difficulty is a curriculum-planning classification, not an official per-word CEFR certification.",
      schema: {
        difficulty: {
          Core: "A1–A2 core",
          Bridge: "A2+–B1- bridge",
          Extension: "UK/US Grade 6 recognition",
        },
        target: {
          active: "應用字：要能在說寫中主動使用",
          receptive: "認識字：先能在聽讀中辨認理解",
        },
        studentStatus: "待診斷／已會／學習中／需複習",
      },
      records,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const summary = {
  total: records.length,
  active: records.filter(item => item.target === "active").length,
  receptive: records.filter(item => item.target === "receptive").length,
  Core: records.filter(item => item.difficulty === "Core").length,
  Bridge: records.filter(item => item.difficulty === "Bridge").length,
  Extension: records.filter(item => item.difficulty === "Extension").length,
  output: path.relative(path.resolve(ROOT, ".."), OUTPUT).replace(/\\/g, "/"),
  outputJson: path.relative(path.resolve(ROOT, ".."), OUTPUT_JSON).replace(/\\/g, "/"),
};
console.log(JSON.stringify(summary, null, 2));
