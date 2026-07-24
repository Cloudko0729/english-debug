// Classify every occurrence in the legacy 48-week / 1,440-item vocabulary plan.
//
// Source of truth:
//   kids/vocab_plan.js
//
// Outputs:
//   kids/legacy_vocab_1440_classified.md
//   kids/legacy_vocab_1440_classified.json
//
// Difficulty is a curriculum-planning judgment. It is not an official
// per-word CEFR certification.

const fs = require("fs");
const path = require("path");
const { VOCAB_PLAN } = require("../vocab_plan.js");
const { WORDBANK } = require("../wordbank.js");
const { WORD_LEVELS, EXTRA_LEVELS } = require("../wordlevels.js");

const ROOT = path.resolve(__dirname, "..");
const CURRENT_CLASSIFIED = path.join(
  ROOT,
  "grade6_10_lessons_vocab_classified.json",
);
const OUTPUT_MD = path.join(ROOT, "legacy_vocab_1440_classified.md");
const OUTPUT_JSON = path.join(ROOT, "legacy_vocab_1440_classified.json");

const LEVEL_LABELS = {
  Core: "Core（A1–A2 核心）",
  Bridge: "Bridge（A2+–B1- 橋接）",
  Extension: "Extension（六年級／國中銜接辨識）",
};

const TARGET_LABELS = {
  active: "應用",
  receptive: "認識",
};

const ROLE_LABELS = {
  "new-active": "新字－主動",
  "new-receptive": "新字－認識",
  review: "累積複習",
};

const UK_Y56_SPELLING = new Set([
  "achieve",
  "ancient",
  "apparent",
  "appreciate",
  "available",
  "average",
  "communicate",
  "community",
  "conscience",
  "conscious",
  "controversy",
  "convenience",
  "correspond",
  "criticise",
  "curiosity",
  "definite",
  "desperate",
  "determined",
  "develop",
  "dictionary",
  "environment",
  "equipment",
  "especially",
  "exaggerate",
  "excellent",
  "existence",
  "explanation",
  "familiar",
  "foreign",
  "forty",
  "frequently",
  "government",
  "guarantee",
  "harass",
  "hindrance",
  "identity",
  "immediate",
  "immediately",
  "individual",
  "interfere",
  "interrupt",
  "language",
  "leisure",
  "lightning",
  "marvellous",
  "mischievous",
  "muscle",
  "necessary",
  "neighbour",
  "nuisance",
  "occupy",
  "occur",
  "opportunity",
  "parliament",
  "persuade",
  "physical",
  "prejudice",
  "privilege",
  "profession",
  "programme",
  "pronunciation",
  "queue",
  "recognise",
  "recommend",
  "relevant",
  "restaurant",
  "rhyme",
  "rhythm",
  "sacrifice",
  "secretary",
  "shoulder",
  "signature",
  "sincere",
  "soldier",
  "stomach",
  "sufficient",
  "suggest",
  "symbol",
  "system",
  "temperature",
  "thorough",
  "twelfth",
  "variety",
  "vegetable",
  "vehicle",
  "yacht",
]);

const US_G6_LANGUAGE = new Set([
  "argument",
  "article",
  "author",
  "audience",
  "bias",
  "claim",
  "compare",
  "conclusion",
  "context",
  "credible",
  "data",
  "debate",
  "detail",
  "determine",
  "document",
  "evidence",
  "fact",
  "formal",
  "inference",
  "information",
  "meaning",
  "opinion",
  "precise",
  "reason",
  "reference",
  "research",
  "result",
  "revise",
  "source",
  "summary",
  "support",
  "topic",
  "transition",
  "verify",
]);

const GRAMMAR_TERMS = new Set([
  "adjective",
  "adverb",
  "article",
  "auxiliary",
  "connective",
  "determiner",
  "noun",
  "object",
  "possessive",
  "preposition",
  "pronoun",
  "reflexive",
  "sentence",
  "subject",
  "verb",
  "vocabulary",
]);

const DATED_TERMS = new Set([
  "cassette",
  "cd player",
  "mtv",
  "tape recorder",
  "typewriter",
  "vcr",
  "walkman",
]);

const INCLUSIVE_REVIEW = new Set([
  "chairman",
  "dumb",
  "englishman",
  "housewife",
  "mailman",
  "policeman",
  "salesman",
  "stupid",
]);

const DATA_LABELS = new Set([
  "aux.v",
  "ld",
  "num",
  "o",
  "oc",
  "s",
  "sc",
]);

const SPELLING_REVIEW = new Set([
  "good looking",
  "mountain-climbing",
  "over-weight",
  "soy-sauce",
  "table cloth",
  "under-weight",
]);

const FUNCTIONAL_PRIORITY = new Set([
  "although",
  "because",
  "but",
  "compare",
  "describe",
  "explain",
  "however",
  "if",
  "reason",
  "so",
  "therefore",
  "while",
]);

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ");
}

function variantKey(value) {
  return normalize(value)
    .replace(/-/g, " ")
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s+/g, " ");
}

function variants(value) {
  const normalized = normalize(value);
  const slashParts = normalized.split(/\s*\/\s*/);
  const results = new Set([normalized]);
  for (const part of slashParts) {
    results.add(part);
    results.add(part.replace(/-/g, " "));
  }
  return [...results].filter(Boolean);
}

function buildBankMap() {
  const map = new Map();
  for (const entry of WORDBANK) {
    for (const key of variants(entry.en)) {
      if (!map.has(key)) map.set(key, entry);
    }
  }
  return map;
}

function loadCurrentClassifications() {
  if (!fs.existsSync(CURRENT_CLASSIFIED)) return new Map();
  const data = JSON.parse(fs.readFileSync(CURRENT_CLASSIFIED, "utf8"));
  return new Map(
    data.records.flatMap(record =>
      variants(record.word).map(key => [key, record]),
    ),
  );
}

const BANK_MAP = buildBankMap();
const CURRENT_MAP = loadCurrentClassifications();

function exactLocalLevel(word) {
  for (const key of variants(word)) {
    if (WORD_LEVELS[key]) {
      return { level: WORD_LEVELS[key], sourceType: "TW1200", matched: key };
    }
    if (EXTRA_LEVELS[key]) {
      return { level: EXTRA_LEVELS[key], sourceType: "RepoExtra", matched: key };
    }
  }
  return null;
}

function componentEstimate(word) {
  const parts = variantKey(word)
    .split(/[^a-z']+/)
    .filter(Boolean);
  if (parts.length < 2) return null;
  const levels = parts.map(part => {
    if (WORD_LEVELS[part]) return WORD_LEVELS[part];
    if (EXTRA_LEVELS[part]) return EXTRA_LEVELS[part];
    return null;
  });
  if (levels.some(level => level === null)) return null;
  return {
    level: Math.max(...levels),
    sourceType: "ComponentEstimate",
    matched: parts.join(" + "),
  };
}

function localEvidence(word) {
  const exact = exactLocalLevel(word);
  if (exact) return exact;

  const components = componentEstimate(word);
  if (components) return components;

  for (const key of variants(word)) {
    if (BANK_MAP.has(key)) {
      const entry = BANK_MAP.get(key);
      return {
        level: null,
        sourceType: entry.level === "basic" ? "WordbankBasic" : "WordbankJunior",
        matched: key,
      };
    }
  }
  return { level: null, sourceType: "LegacyOnly", matched: null };
}

function sourceLabel(evidence) {
  if (evidence.sourceType === "TW1200") {
    return `本地 1,200 表 L${evidence.level}`;
  }
  if (evidence.sourceType === "RepoExtra") {
    return `Repo 補充分級 L${evidence.level}`;
  }
  if (evidence.sourceType === "ComponentEstimate") {
    return `組成字推估 L${evidence.level}`;
  }
  if (evidence.sourceType === "WordbankBasic") return "Wordbank 國小核心";
  if (evidence.sourceType === "WordbankJunior") return "Wordbank 國中基本";
  return "舊版課表自建詞";
}

function currentClassification(word) {
  for (const key of variants(word)) {
    if (CURRENT_MAP.has(key)) return CURRENT_MAP.get(key);
  }
  return null;
}

function difficultyFor(item, evidence) {
  const current = currentClassification(item.word);
  if (current) return current.difficulty;

  if (evidence.level !== null) {
    if (evidence.level <= 6) return "Core";
    if (evidence.level === 7) return "Bridge";
    return "Extension";
  }
  if (evidence.sourceType === "WordbankBasic") return "Core";
  if (evidence.sourceType === "WordbankJunior") {
    return item.week >= 45 ? "Extension" : "Bridge";
  }
  return item.week >= 41 ? "Extension" : "Bridge";
}

function itemType(word) {
  const normalized = normalize(word);
  if (normalized.includes("/")) return "英美／同義變體";
  if (/\s/.test(normalized)) return "片語";
  if (normalized.includes("-")) return "連字複合詞";
  return "單字";
}

function qualityFlags(word) {
  const key = normalize(word);
  const flags = [];
  if (DATED_TERMS.has(key)) flags.push("年代用語：更新情境");
  if (INCLUSIVE_REVIEW.has(key)) flags.push("包容用語：建議換詞");
  if (DATA_LABELS.has(key)) flags.push("資料標籤：不應當單字教");
  if (SPELLING_REVIEW.has(key)) flags.push("拼寫／連字號：需校正");
  return flags;
}

function frameworkFor(item) {
  const key = normalize(item.word);
  const tags = [];
  if (GRAMMAR_TERMS.has(key)) tags.push("英美 G1–6 文法術語");
  if (UK_Y56_SPELLING.has(key)) tags.push("UK Y5–6 spelling");
  if (US_G6_LANGUAGE.has(key)) tags.push("US G6 Language");
  if (tags.length) return tags.join("＋");

  if (item.week <= 30) return "臺灣 1,200／Cambridge A1–A2 日常主題";
  if (item.week <= 36) return "A2 跨學科自然與社會";
  if (item.week <= 40) return "A2+ 資訊、比較與溝通";
  if (item.week <= 44) return "六年級轉銜／國中教室語言";
  return "國中先修／B1- 延伸";
}

function priorityScore(record) {
  let score = { Core: 100, Bridge: 70, Extension: 40 }[record.difficulty];
  if (record.localLevel !== null) score += 9 - record.localLevel;
  if (record.localSourceType === "TW1200") score += 8;
  if (/^(v|vt|vi)$/.test(record.pos)) score += 8;
  else if (/^(adj|adv|prep|conj|pron)$/.test(record.pos)) score += 5;
  else if (record.pos === "n") score += 2;
  if (FUNCTIONAL_PRIORITY.has(normalize(record.word))) score += 20;
  if (record.itemType === "片語") score += 2;
  score -= record.qualityFlags.length * 35;
  return score;
}

function flattenPlan() {
  return VOCAB_PLAN.weeks.flatMap(week =>
    week.words.map((entry, index) => ({
      occurrenceId: `W${String(week.n).padStart(2, "0")}-${String(
        index + 1,
      ).padStart(2, "0")}`,
      week: week.n,
      start: week.start,
      end: week.end,
      theme: week.theme,
      slot: index + 1,
      word: entry.en,
      normalized: normalize(entry.en),
      canonicalKey: variantKey(entry.en),
      zh: entry.zh,
      pos: entry.pos || "",
    })),
  );
}

function classifyRecords() {
  const base = flattenPlan().map(item => {
    const evidence = localEvidence(item.word);
    const flags = qualityFlags(item.word);
    const record = {
      ...item,
      difficulty: difficultyFor(item, evidence),
      difficultyLabel: "",
      target: "",
      targetLabel: "",
      priorityRankWithinWeek: 0,
      scheduleRole: "",
      scheduleRoleLabel: "",
      itemType: itemType(item.word),
      localLevel: evidence.level,
      localSourceType: evidence.sourceType,
      localSource: sourceLabel(evidence),
      framework: frameworkFor(item),
      domain: item.theme,
      occurrenceNumber: 0,
      totalOccurrences: 0,
      firstOccurrenceWeek: 0,
      duplicateOf: null,
      qualityFlags: flags,
      studentStatus: "待診斷",
      recommendation: "",
    };
    record.difficultyLabel = LEVEL_LABELS[record.difficulty];
    record._priorityScore = priorityScore(record);
    return record;
  });

  const exactGroups = new Map();
  for (const record of base) {
    const key = record.normalized;
    if (!exactGroups.has(key)) exactGroups.set(key, []);
    exactGroups.get(key).push(record);
  }

  for (const group of exactGroups.values()) {
    group.forEach((record, index) => {
      record.occurrenceNumber = index + 1;
      record.totalOccurrences = group.length;
      record.firstOccurrenceWeek = group[0].week;
      record.duplicateOf = index === 0 ? null : group[0].occurrenceId;
    });
  }

  for (const week of VOCAB_PLAN.weeks) {
    const weekRecords = base.filter(record => record.week === week.n);
    const ranked = [...weekRecords].sort(
      (a, b) => b._priorityScore - a._priorityScore || a.slot - b.slot,
    );
    ranked.forEach((record, index) => {
      record.priorityRankWithinWeek = index + 1;
      record.target = index < 20 ? "active" : "receptive";
      record.targetLabel = TARGET_LABELS[record.target];
      record.scheduleRole =
        record.occurrenceNumber > 1
          ? "review"
          : record.target === "active"
            ? "new-active"
            : "new-receptive";
      record.scheduleRoleLabel = ROLE_LABELS[record.scheduleRole];

      if (record.qualityFlags.includes("資料標籤：不應當單字教")) {
        record.recommendation = "移除並回查原始資料";
      } else if (record.qualityFlags.includes("年代用語：更新情境")) {
        record.recommendation = "改成歷史文化認識字或換成現代用語";
      } else if (
        record.qualityFlags.includes("包容用語：建議換詞") ||
        record.qualityFlags.includes("拼寫／連字號：需校正")
      ) {
        record.recommendation = "替換或校正後再教";
      } else if (record.scheduleRole === "review") {
        record.recommendation = "移入累積複習槽";
      } else if (record.target === "active") {
        record.recommendation = "保留為主動候選字";
      } else {
        record.recommendation = "保留為閱讀認識字";
      }
    });
  }

  return base.map(({ _priorityScore, ...record }) => record);
}

function summarize(records) {
  const uniqueWords = new Set(records.map(record => record.normalized));
  const duplicateRecords = records.filter(record => record.occurrenceNumber > 1);
  const qualityFlagged = records.filter(record => record.qualityFlags.length > 0);
  const sourceCounts = {};
  const typeCounts = {};
  const roleCounts = {};

  for (const record of records) {
    sourceCounts[record.localSourceType] =
      (sourceCounts[record.localSourceType] || 0) + 1;
    typeCounts[record.itemType] = (typeCounts[record.itemType] || 0) + 1;
    roleCounts[record.scheduleRole] =
      (roleCounts[record.scheduleRole] || 0) + 1;
  }

  return {
    totalOccurrences: records.length,
    uniqueWords: uniqueWords.size,
    duplicateOccurrences: duplicateRecords.length,
    duplicateWordGroups: new Set(
      duplicateRecords.map(record => record.normalized),
    ).size,
    active: records.filter(record => record.target === "active").length,
    receptive: records.filter(record => record.target === "receptive").length,
    Core: records.filter(record => record.difficulty === "Core").length,
    Bridge: records.filter(record => record.difficulty === "Bridge").length,
    Extension: records.filter(record => record.difficulty === "Extension")
      .length,
    qualityFlaggedOccurrences: qualityFlagged.length,
    sourceCounts,
    typeCounts,
    roleCounts,
  };
}

function validate(records) {
  const errors = [];
  if (VOCAB_PLAN.weeks.length !== 48) {
    errors.push(`週數應為 48，實際 ${VOCAB_PLAN.weeks.length}`);
  }
  if (records.length !== 1440) {
    errors.push(`總項目應為 1440，實際 ${records.length}`);
  }

  for (const week of VOCAB_PLAN.weeks) {
    const weekRecords = records.filter(record => record.week === week.n);
    if (weekRecords.length !== 30) {
      errors.push(`第 ${week.n} 週應為 30 項，實際 ${weekRecords.length}`);
    }
    const active = weekRecords.filter(record => record.target === "active").length;
    const receptive = weekRecords.filter(
      record => record.target === "receptive",
    ).length;
    if (active !== 20 || receptive !== 10) {
      errors.push(
        `第 ${week.n} 週目標分配錯誤：應用 ${active}、認識 ${receptive}`,
      );
    }
  }

  const required = [
    "occurrenceId",
    "week",
    "theme",
    "word",
    "zh",
    "pos",
    "difficulty",
    "target",
    "scheduleRole",
    "itemType",
    "localSource",
    "framework",
    "studentStatus",
    "recommendation",
  ];
  const missing = records.filter(record =>
    required.some(key => record[key] === undefined || record[key] === ""),
  );
  if (missing.length) errors.push(`${missing.length} 筆缺少必填欄位`);

  if (errors.length) {
    throw new Error(`Legacy vocabulary validation failed:\n- ${errors.join("\n- ")}`);
  }
}

function escapeCell(value) {
  return String(value === null || value === undefined ? "" : value)
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ");
}

function renderMarkdown(records, summary) {
  const out = [
    "# 舊版 48 週 1,440 個詞彙項目逐項分類",
    "",
    "> 產生日期：2026-07-24",
    "> 來源：`kids/vocab_plan.js`",
    "> 本表保留每個原始週次與詞彙項目；同字再次出現會標為「累積複習」。",
    "> 難度屬課程規劃判定，不代表個別單字具有唯一官方 CEFR 等級。",
    "",
    "## 分類標準",
    "",
    "- **Core**：A1–A2 日常核心，優先建立聽說讀寫的主動能力。",
    "- **Bridge**：A2+–B1- 橋接詞，依主題與任務逐步轉成主動字。",
    "- **Extension**：六年級跨學科、學術或國中銜接詞，先以閱讀辨識與句框使用為主。",
    "- **應用／認識**：依每週實用性、現有分級、詞性及資料品質排序，每週保留舊版的 20／10 候選配置。",
    "- **累積複習**：完全相同的字再次出現，不再計為新字。",
    "",
    "## 總覽",
    "",
    `- 原始項目：${summary.totalOccurrences}`,
    `- 不重複字詞：${summary.uniqueWords}`,
    `- 重複出現：${summary.duplicateOccurrences} 項，分屬 ${summary.duplicateWordGroups} 個字詞`,
    `- 舊版候選目標：應用 ${summary.active}、認識 ${summary.receptive}`,
    `- 難度：Core ${summary.Core}、Bridge ${summary.Bridge}、Extension ${summary.Extension}`,
    `- 有資料品質旗標：${summary.qualityFlaggedOccurrences} 項`,
    "",
    "## 使用提醒",
    "",
    "這份分類用來清理與選字，不代表建議兒童每週學 30 個全新單字。新版安排應把部分位置改成字族、搭配詞與間隔複習；詳見 `kids/children_vocab_learning_plan.md`。",
    "",
  ];

  for (const week of VOCAB_PLAN.weeks) {
    const weekRecords = records.filter(record => record.week === week.n);
    const counts = {
      Core: weekRecords.filter(record => record.difficulty === "Core").length,
      Bridge: weekRecords.filter(record => record.difficulty === "Bridge").length,
      Extension: weekRecords.filter(
        record => record.difficulty === "Extension",
      ).length,
      review: weekRecords.filter(record => record.scheduleRole === "review")
        .length,
    };
    out.push(
      `## Week ${week.n}：${week.theme}`,
      "",
      `${week.start}～${week.end}｜Core ${counts.Core}／Bridge ${counts.Bridge}／Extension ${counts.Extension}／重複複習 ${counts.review}`,
      "",
      "| # | 單字 | 中文 | 詞性 | 目標 | 程度 | 排程角色 | 本地來源 | 類型 | 品質旗標 | 學生狀態 |",
      "|---:|---|---|---|---|---|---|---|---|---|---|",
    );
    for (const record of weekRecords) {
      out.push(
        `| ${record.slot} | \`${escapeCell(record.word)}\` | ${escapeCell(
          record.zh,
        )} | ${escapeCell(record.pos)} | ${record.targetLabel} | ${
          record.difficulty
        } | ${record.scheduleRoleLabel} | ${escapeCell(
          record.localSource,
        )} | ${record.itemType} | ${
          record.qualityFlags.length
            ? escapeCell(record.qualityFlags.join("；"))
            : "—"
        } | ${record.studentStatus} |`,
      );
    }
    out.push("");
  }

  return `${out.join("\n").trimEnd()}\n`;
}

const records = classifyRecords();
validate(records);
const summary = summarize(records);

fs.writeFileSync(OUTPUT_MD, renderMarkdown(records, summary), "utf8");
fs.writeFileSync(
  OUTPUT_JSON,
  `${JSON.stringify(
    {
      generatedOn: "2026-07-24",
      source: "vocab_plan.js",
      note: "Difficulty and target are curriculum-planning classifications, not official per-word CEFR certifications.",
      schema: {
        difficulty: {
          Core: "A1–A2 core",
          Bridge: "A2+–B1- bridge",
          Extension: "Grade 6 / junior-high transition recognition",
        },
        target: {
          active: "應用候選：預計在說寫中主動使用",
          receptive: "認識候選：先在聽讀中辨認理解",
        },
        scheduleRole: {
          "new-active": "第一次出現的主動候選字",
          "new-receptive": "第一次出現的認識候選字",
          review: "同字再次出現，視為累積複習",
        },
        studentStatus: "待診斷／已會／學習中／需複習",
      },
      summary,
      records,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(
  JSON.stringify(
    {
      ...summary,
      output: path.relative(path.resolve(ROOT, ".."), OUTPUT_MD).replace(/\\/g, "/"),
      outputJson: path
        .relative(path.resolve(ROOT, ".."), OUTPUT_JSON)
        .replace(/\\/g, "/"),
    },
    null,
    2,
  ),
);
