// 產生 kids/vocab_db/gloss.js：單字單元的對話與短文裡「超出 L1–L4 範圍」的字 → 中文意思。
//
// 用法: node kids/tools/build_gloss.js
//
// 為什麼需要：
//   短文的超綱內容詞在 L3 佔 23.9%、L4 佔 26.6% —— 四個字有一個沒教過，
//   小孩讀不下去只能猜。與其重寫全部內容（那會連 330 個音檔一起報廢），
//   先把超綱字標出來並附上中文，讓他讀得懂、也順便認識新字。
//
// 中文從站上既有資料湊：wordbank（1606 字）、curriculum、年度週計畫、foundation 本身。
// 查不到的先做形態還原（複數、過去式、不規則動詞），再查一次；仍查不到的走人工表。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const DB = path.join(KIDS, "vocab_db", "foundation");
const OUT = path.join(KIDS, "vocab_db", "gloss.js");

// 不規則動詞：過去式／過去分詞 → 原形。查不到中文的 179 個字裡絕大多數是這類。
const IRREG = {
  said: "say", made: "make", came: "come", took: "take", gave: "give", found: "find",
  went: "go", ate: "eat", began: "begin", ran: "run", held: "hold", wrote: "write",
  became: "become", saw: "see", fell: "fall", bought: "buy", told: "tell", felt: "feel",
  chose: "choose", paid: "pay", stood: "stand", blew: "blow", shook: "shake",
  brought: "bring", caught: "catch", taught: "teach", thought: "think", knew: "know",
  grew: "grow", drew: "draw", threw: "throw", flew: "fly", swam: "swim", sang: "sing",
  drank: "drink", rang: "ring", sat: "sit", met: "meet", left: "leave", kept: "keep",
  slept: "sleep", read: "read", put: "put", cut: "cut", lost: "lose", sent: "send",
  spent: "spend", built: "build", heard: "hear", won: "win", wore: "wear", broke: "break",
  spoke: "speak", woke: "wake", rode: "ride", drove: "drive", wrote_: "write",
  hid: "hide", hidden: "hide", hiding: "hide", risen: "rise", rose: "rise",
  understood: "understand", forgot: "forget", got: "get", had: "have",
};

// 站上湊不到、又常出現的，人工補。寫成小學生看得懂的短意思，不要辭典式長解釋。
const MANUAL = {
  "let's": "我們來…吧", okay: "好、可以", inside: "在裡面", side: "旁邊、side",
  art: "美術", slowly: "慢慢地", move: "移動", hurt: "受傷、痛", instead: "改成、反而",
  above: "在上面", appeared: "出現", turned: "轉、變成", pieces: "小塊、片",
  case: "盒子、情況", group: "一組人", free: "免費的、有空的", pack: "打包",
  string: "繩子", tightly: "緊緊地", recipe: "食譜", herself: "她自己",
  poured: "倒（水）", saved: "存下來、救", bright: "明亮的", bye: "再見",
  cheered: "歡呼", line: "線、排隊", dining: "用餐（的）", nina: "Nina（人名）",
  everyone: "每個人", cousin: "表／堂兄弟姊妹", story: "故事", team: "隊伍",
  ready: "準備好的", maybe: "也許", idea: "點子", front: "前面", across: "橫越",
  through: "穿過", end: "結尾、結束", show: "給…看、表演", used: "用（過去式）",
  kids: "小孩們", ride: "騎、搭乘", bring: "帶來", stayed: "留下來",
  along: "沿著", anymore: "不再", backpack: "背包", bigger: "更大的",
  bridge: "橋", clay: "黏土", colorful: "色彩繽紛的", convenience: "便利（商店）",
  covered: "蓋住", cross: "穿越", dark: "暗的", display: "展示",
  doorbell: "門鈴", dough: "麵團", easier: "比較容易的", erased: "擦掉",
  farther: "更遠", fed: "餵（過去式）", folded: "摺起來", fur: "毛皮",
  grilled: "烤的", ground: "地面", happily: "開心地", heat: "加熱、熱",
  hill: "小山", hills: "小山", hung: "掛（過去式）", hurts: "會痛",
  imagination: "想像力", knocked: "敲（門）", lap: "大腿、一圈", leads: "帶領、通往",
  led: "帶領（過去式）", melt: "融化", moved: "搬動、移動", nearby: "附近的",
  noticed: "注意到", packed: "打包好", pancake: "鬆餅", pedals: "踏板",
  players: "球員", posters: "海報", pottery: "陶藝", pretend: "假裝",
  proud: "驕傲的", rail: "扶手、欄杆", rang: "響（過去式）", relay: "接力",
  ringing: "在響", runners: "跑者", sandcastle: "沙堡", sauce: "醬料",
  saving: "存錢、節省", scooter: "滑板車", shallow: "淺的", shone: "發光（過去式）",
  slipped: "滑倒", sore: "痠痛的", spinach: "菠菜", splashed: "濺起水花",
  steep: "陡的", storybooks: "故事書", studio: "工作室", surprise: "驚喜",
  tickled: "搔癢", tide: "潮水", trail: "步道", view: "景色",
  whispered: "小聲說", whistle: "哨子", woke: "醒來（過去式）",
  announcement: "廣播、通知", blew: "吹（過去式）", hiding: "躲起來",
};

// 功能詞不註解：任何句子都會用到，標出來只是雜訊
const FUNC = new Set(("a an the this that these those i you he she it we they me him her us them " +
  "my your his its our their mine yours hers ours theirs am is are was were be been being " +
  "do does did done have has had having will would can could shall should may might must " +
  "and or but so because if when while then than as at by for from in into of off on out over " +
  "to under up with without about after before near not no yes very too also just only more most " +
  "some any all each every other another same both few many much little less least " +
  "what which who whom whose where why how there here now today tomorrow yesterday " +
  "again always never often sometimes usually one two three four five six seven eight nine ten " +
  "first second next last t s m re ve ll d don doesn didn isn aren wasn weren won couldn shouldn b p uh i'll i'm it's that's don't doesn't let turn seen taken break changes points lines living mark piece").split(/\s+/).filter(Boolean));

// 故事人物名字：不是要學的單字
const NAMES = new Set(("mia amy ben leo lily tom ken max anna sam emma jack lin chen wu yeh nina ray kevin " +
  // 所有格形式也是同一個人／同一個字，不必註解
  "aunt's dad's mom's leo's grandma's kitten's neighbor's classmate's children's chinese").split(" "));

function loadZh() {
  const zh = new Map();
  const put = (en, t) => { const k = String(en || "").toLowerCase(); if (k && t && !zh.has(k)) zh.set(k, t); };
  const run = (file, name) => {
    try { return new Function(fs.readFileSync(path.join(KIDS, file), "utf8") + "; return " + name + ";")(); }
    catch (e) { return null; }
  };
  (run("wordbank.js", "WORDBANK") || []).forEach(w => put(w.en, w.zh));
  (run("curriculum.js", "CURRICULUM") || []).forEach(m => (m.weeks || []).forEach(w => w.words.forEach(x => put(x.en, x.zh))));
  const vp = run("vocab_plan.js", "VOCAB_PLAN");
  if (vp) vp.weeks.forEach(w => w.words.forEach(x => put(x.en, x.zh)));
  [1, 2, 3, 4].forEach(l => {
    JSON.parse(fs.readFileSync(path.join(DB, `words_l${l}.json`), "utf8")).words.forEach(w => put(w.word, w.zh));
  });
  return zh;
}

function baseWords() {
  const s = new Set();
  [1, 2, 3, 4].forEach(l => {
    JSON.parse(fs.readFileSync(path.join(DB, `words_l${l}.json`), "utf8")).words.forEach(w => {
      s.add(w.word.toLowerCase());
      (w.aliases || []).forEach(a => s.add(a.toLowerCase()));
    });
  });
  return s;
}

// 形態還原：規則變化 + 不規則動詞
function stems(w) {
  const out = [w];
  if (IRREG[w]) out.push(IRREG[w]);
  [[/ies$/, "y"], [/ied$/, "y"], [/es$/, ""], [/s$/, ""], [/ed$/, ""], [/ed$/, "e"],
   [/ing$/, ""], [/ing$/, "e"], [/er$/, ""], [/est$/, ""], [/ly$/, ""]]
    .forEach(([re, rep]) => { if (re.test(w)) out.push(w.replace(re, rep)); });
  if (/(.)\1(ed|ing)$/.test(w)) out.push(w.replace(/(.)\1(ed|ing)$/, "$1"));
  return out;
}

const tok = t => (String(t).toLowerCase().match(/[a-z][a-z'’]*/g) || []);

function main() {
  const zh = loadZh(), base = baseWords();
  // 不規則變化不算已教：look→looked 一眼看得出來，say→said 看不出來。
  // 規則變化還原後算已教，不規則的照樣標註並點明是哪個字的過去式。
  const regular = w => {
    const o = [];
    [[/ies$/, "y"], [/ied$/, "y"], [/es$/, ""], [/s$/, ""], [/ed$/, ""], [/ed$/, "e"],
     [/ing$/, ""], [/ing$/, "e"], [/er$/, ""], [/est$/, ""], [/ly$/, ""]]
      .forEach(([re, rep]) => { if (re.test(w)) o.push(w.replace(re, rep)); });
    if (/(.)(ed|ing)$/.test(w)) o.push(w.replace(/(.)(ed|ing)$/, "$1"));
    return o;
  };
  const known = w => base.has(w) || FUNC.has(w) || NAMES.has(w)
    || (!IRREG[w] && regular(w).some(s => base.has(s)));

  // 蒐集所有單元對話與短文的超綱字
  const seen = new Map();
  [1, 2, 3, 4].forEach(l => {
    JSON.parse(fs.readFileSync(path.join(DB, `units_l${l}.json`), "utf8")).units.forEach(u => {
      u.dialogue.turns.map(t => t.text)
        .concat(u.passages.map(p => p.text))
        .forEach(t => tok(t).forEach(w => { if (!known(w)) seen.set(w, (seen.get(w) || 0) + 1); }));
    });
  });

  const gloss = {}, missing = [];
  [...seen.keys()].sort().forEach(w => {
    if (MANUAL[w]) { gloss[w] = MANUAL[w]; return; }
    const hit = stems(w).find(s => zh.has(s));
    if (hit) {
      // 只取第一個意思，長解釋對小孩沒用
      let t = String(zh.get(hit)).split(/[、,；;（(]/)[0].trim().slice(0, 12);
      // 不規則變化點名原形，小孩才連得起來
      if (IRREG[w] && IRREG[w] !== w) t += "（" + IRREG[w] + " 的過去式）";
      gloss[w] = t;
      return;
    }
    missing.push(w);
  });

  fs.writeFileSync(OUT,
    "// 由 kids/tools/build_gloss.js 產生，請勿手動編輯。\n" +
    "// 單字單元的對話／短文裡超出 L1-L4 範圍的字 → 中文意思。\n" +
    "window.VOCAB_GLOSS = " + JSON.stringify(gloss, null, 0) + ";\n", "utf8");

  console.log(JSON.stringify({
    ok: true, outOfScope: seen.size, glossed: Object.keys(gloss).length,
    coverage: (Object.keys(gloss).length / seen.size * 100).toFixed(0) + "%",
    stillMissing: missing.length, missingList: missing,   // 全部列出，方便一次補進 MANUAL
  }, null, 2));
}

main();
