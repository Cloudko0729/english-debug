// 檢查單字單元的對話與短文是否符合該級的用字與長度限制。
//
// 用法:
//   node kids/tools/validate_unit_text.js           # 全部
//   node kids/tools/validate_unit_text.js L3 L4     # 指定等級
//   node kids/tools/validate_unit_text.js --list L4 # 另外列出超綱字
//
// 為什麼需要：改寫內容時沒有客觀標準就只能憑感覺。實測 L3 短文有 23.9%、
// L4 有 26.6% 的內容詞沒教過，四個字有一個看不懂 —— 那不是閱讀是猜。
// 這支工具把標準寫死，改完直接跑，不必信任產出。
const fs = require("fs");
const path = require("path");
// 「什麼算已教」與 build_gloss.js 共用同一份，避免兩邊判定不一致
const K = require("./_known_words.js");

const KIDS = path.join(__dirname, "..");
const DB = path.join(KIDS, "vocab_db", "foundation");

// 每級的目標。長度是「看得完」，超綱率是「讀得懂」，兩個都要過。
const TARGET = {
  1: { passage: [40, 60], dialogue: [4, 9], maxUnknown: 0.10 },
  2: { passage: [50, 70], dialogue: [5, 10], maxUnknown: 0.10 },
  3: { passage: [55, 75], dialogue: [5, 10], maxUnknown: 0.10 },
  4: { passage: [65, 85], dialogue: [6, 11], maxUnknown: 0.12 },
};

// 功能詞：任何句子都會用到，不計入超綱
const FUNC = new Set(("a an the this that these those i you he she it we they me him her us them " +
  "my your his its our their mine yours hers ours theirs am is are was were be been being " +
  "do does did done have has had having will would can could shall should may might must " +
  "and or but so because if when while then than as at by for from in into of off on out over " +
  "to under up with without about after before near not no yes very too also just only more most " +
  "some any all each every other another same both few many much little less least " +
  "what which who whom whose where why how there here now today tomorrow yesterday " +
  "again always never often sometimes usually one two three four five six seven eight nine ten " +
  "first second next last let s t m re ve ll d don doesn didn isn aren wasn weren won couldn shouldn " +
  "said says say go goes went come comes came get gets got make makes made take takes took " +
  "give gives gave see sees saw look looks looked know knows knew think thinks thought " +
  "want wants need needs like likes tell tells told ask asks asked put puts find finds found")
  .split(/\s+/).filter(Boolean));

function baseWords(uptoLevel) {
  const s = new Set();
  for (let l = 1; l <= uptoLevel; l++) {
    JSON.parse(fs.readFileSync(path.join(DB, `words_l${l}.json`), "utf8")).words.forEach(w => {
      K.addEntry(s, w.word);
      (w.aliases || []).forEach(a => K.addEntry(s, a));
    });
  }
  return s;
}
const tok = K.tokenize;

function check(text, known) {
  const ws = tok(text);
  // 驗收看的是「閱讀負擔」，不規則變化算已會（懂 say 就大致懂 said 的語意）
  const bad = ws.filter(w => !K.isKnown(w, known, false));
  return { len: ws.length, unknown: bad, rate: ws.length ? bad.length / ws.length : 0 };
}

function main() {
  const args = process.argv.slice(2);
  const showList = args.includes("--list");
  const levels = args.filter(a => /^L[1-4]$/i.test(a)).map(a => Number(a[1]));
  const want = levels.length ? levels : [1, 2, 3, 4];

  let fail = 0, total = 0;
  const allBad = new Map();

  want.forEach(l => {
    const known = baseWords(l);              // 只認到自己這一級為止
    const t = TARGET[l];
    const units = JSON.parse(fs.readFileSync(path.join(DB, `units_l${l}.json`), "utf8")).units;
    console.log(`\n═══ L${l}（短文 ${t.passage[0]}-${t.passage[1]} 詞、對話每句 ${t.dialogue[0]}-${t.dialogue[1]} 詞、超綱 ≤${(t.maxUnknown * 100).toFixed(0)}%）═══`);
    units.forEach(u => {
      const probs = [];
      u.passages.forEach((p, i) => {
        total++;
        const r = check(p.text, known);
        r.unknown.forEach(w => allBad.set(w, (allBad.get(w) || 0) + 1));
        if (r.len < t.passage[0] || r.len > t.passage[1]) probs.push(`短文${i + 1} ${r.len}詞`);
        if (r.rate > t.maxUnknown) probs.push(`短文${i + 1} 超綱${(r.rate * 100).toFixed(0)}%`);
      });
      const dLens = u.dialogue.turns.map(x => tok(x.text).length);
      const dAll = check(u.dialogue.turns.map(x => x.text).join(" "), known);
      dAll.unknown.forEach(w => allBad.set(w, (allBad.get(w) || 0) + 1));
      total++;
      const tooLong = dLens.filter(n => n > t.dialogue[1]).length;
      if (tooLong) probs.push(`對話 ${tooLong} 句過長（最長 ${Math.max(...dLens)} 詞）`);
      if (dAll.rate > t.maxUnknown) probs.push(`對話超綱${(dAll.rate * 100).toFixed(0)}%`);

      if (probs.length) { fail++; console.log(`  ✘ ${u.id} ${u.titleZh}\n      ${probs.join("；")}`); }
      else console.log(`  ✓ ${u.id} ${u.titleZh}`);
    });
  });

  console.log(`\n未達標單元：${fail} / ${want.reduce((s, l) => s + JSON.parse(fs.readFileSync(path.join(DB, `units_l${l}.json`), "utf8")).units.length, 0)}`);
  if (showList) {
    console.log("\n超綱字（依出現次數）：");
    console.log([...allBad].sort((a, b) => b[1] - a[1]).map(([w, n]) => `${w}(${n})`).join(" "));
  }
  process.exit(fail ? 1 : 0);
}

main();
