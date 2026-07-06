// 月度課程：文法「順延每月更新」(每月解鎖該月文法，未到月份的鎖住) ＋ 每週 30 新單字。
// 單字餵進每日單字測驗(vocab_quiz.html) + Day 21-27 每日測驗 + vocab_week.html 記憶表。
// 7 份國中文法教學頁分配到 7~10 月；當月(含)之後才解鎖讀取。經 Codex 複審。
// Audio: audio/words/<wordAudioKey(en)>.mp3
const CURRICULUM = [
  {
    month: "2026-07",
    label: "7 月",
    // 本月解鎖的文法（對應教學頁）
    grammar: [
      { topic: "過去式", eng: "Past Tense", file: "lessons/lesson_2026-07-02.html", icon: "⏪" },
      { topic: "未來式", eng: "Future",     file: "lessons/lesson_2026-07-03.html", icon: "🔮" }
    ],
    weeks: [
      {
        n: 1, start: "2026-07-01", end: "2026-07-07",
        theme: "旅行與時間", grammar: ["過去式", "未來式"],
        words: [
          { en: "trip", zh: "旅行、旅程", pos: "n" }, { en: "travel", zh: "旅行、旅遊", pos: "v" }, { en: "vacation", zh: "假期", pos: "n" },
          { en: "ticket", zh: "票", pos: "n" }, { en: "airport", zh: "機場", pos: "n" }, { en: "station", zh: "車站", pos: "n" },
          { en: "hotel", zh: "旅館", pos: "n" }, { en: "museum", zh: "博物館", pos: "n" }, { en: "beach", zh: "海灘", pos: "n" },
          { en: "mountain", zh: "山", pos: "n" }, { en: "map", zh: "地圖", pos: "n" }, { en: "luggage", zh: "行李", pos: "n" },
          { en: "passport", zh: "護照", pos: "n" }, { en: "tourist", zh: "觀光客", pos: "n" }, { en: "gift", zh: "禮物", pos: "n" },
          { en: "visit", zh: "拜訪、參觀", pos: "v" }, { en: "arrive", zh: "抵達", pos: "v" }, { en: "leave", zh: "離開", pos: "v" },
          { en: "return", zh: "返回", pos: "v" }, { en: "explore", zh: "探索", pos: "v" }, { en: "abroad", zh: "在國外、到國外", pos: "adv" },
          { en: "holiday", zh: "假日", pos: "n" }, { en: "weekend", zh: "週末", pos: "n" }, { en: "plan", zh: "計畫", pos: "n" },
          { en: "tonight", zh: "今晚", pos: "adv" }, { en: "yesterday", zh: "昨天", pos: "adv" }, { en: "tomorrow", zh: "明天", pos: "adv" },
          { en: "ago", zh: "…以前", pos: "adv" }, { en: "last", zh: "上一個的", pos: "adj" }, { en: "soon", zh: "很快、不久", pos: "adv" }
        ]
      },
      {
        // 自第 3 週起改為「週日開始、週六結束」；第 2 週提前於 07-11(六) 結束銜接
        n: 2, start: "2026-07-08", end: "2026-07-11",
        theme: "描述與經驗", grammar: ["過去式", "未來式"],
        words: [
          { en: "tall", zh: "高的", pos: "adj" }, { en: "short", zh: "矮的、短的", pos: "adj" }, { en: "heavy", zh: "重的", pos: "adj" },
          { en: "light", zh: "輕的", pos: "adj" }, { en: "expensive", zh: "昂貴的", pos: "adj" }, { en: "cheap", zh: "便宜的", pos: "adj" },
          { en: "modern", zh: "現代的", pos: "adj" }, { en: "old", zh: "老的、舊的", pos: "adj" }, { en: "popular", zh: "受歡迎的", pos: "adj" },
          { en: "famous", zh: "有名的", pos: "adj" }, { en: "similar", zh: "相似的", pos: "adj" }, { en: "different", zh: "不同的", pos: "adj" },
          { en: "comfortable", zh: "舒適的", pos: "adj" }, { en: "convenient", zh: "方便的", pos: "adj" }, { en: "dangerous", zh: "危險的", pos: "adj" },
          { en: "safe", zh: "安全的", pos: "adj" }, { en: "quiet", zh: "安靜的", pos: "adj" }, { en: "noisy", zh: "吵鬧的", pos: "adj" },
          { en: "crowded", zh: "擁擠的", pos: "adj" }, { en: "better", zh: "較好的", pos: "adj" }, { en: "worse", zh: "較差的", pos: "adj" },
          { en: "experience", zh: "經驗", pos: "n" }, { en: "adventure", zh: "冒險", pos: "n" }, { en: "local", zh: "當地的", pos: "adj" },
          { en: "recently", zh: "最近", pos: "adv" }, { en: "ever", zh: "曾經", pos: "adv" }, { en: "never", zh: "從不", pos: "adv" },
          { en: "already", zh: "已經", pos: "adv" }, { en: "yet", zh: "尚未、還（沒）", pos: "adv" }, { en: "wonderful", zh: "很棒的", pos: "adj" }
        ]
      },
      {
        n: 3, start: "2026-07-12", end: "2026-07-18",
        theme: "健康與規則", grammar: ["過去式", "未來式"],
        words: [
          { en: "health", zh: "健康", pos: "n" }, { en: "healthy", zh: "健康的", pos: "adj" }, { en: "exercise", zh: "運動", pos: "n" },
          { en: "medicine", zh: "藥", pos: "n" }, { en: "doctor", zh: "醫生", pos: "n" }, { en: "nurse", zh: "護士", pos: "n" },
          { en: "patient", zh: "病人", pos: "n" }, { en: "hospital", zh: "醫院", pos: "n" }, { en: "illness", zh: "疾病", pos: "n" },
          { en: "fever", zh: "發燒", pos: "n" }, { en: "headache", zh: "頭痛", pos: "n" }, { en: "cough", zh: "咳嗽", pos: "n" },
          { en: "rest", zh: "休息", pos: "v" }, { en: "habit", zh: "習慣", pos: "n" }, { en: "rule", zh: "規則", pos: "n" },
          { en: "sleep", zh: "睡覺", pos: "v" }, { en: "careful", zh: "小心的", pos: "adj" }, { en: "advice", zh: "建議", pos: "n" },
          { en: "reason", zh: "原因", pos: "n" }, { en: "result", zh: "結果", pos: "n" }, { en: "cause", zh: "造成、引起", pos: "v" },
          { en: "problem", zh: "問題", pos: "n" }, { en: "sign", zh: "標誌", pos: "n" }, { en: "mask", zh: "口罩", pos: "n" },
          { en: "mistake", zh: "錯誤", pos: "n" }, { en: "safety", zh: "安全", pos: "n" }, { en: "protect", zh: "保護", pos: "v" },
          { en: "avoid", zh: "避免", pos: "v" }, { en: "follow", zh: "遵守、跟隨", pos: "v" }, { en: "worry", zh: "擔心", pos: "v" }
        ]
      },
      {
        // 第 4 週涵蓋到 08-01(六)；8 月課程自 08-02(日) 起接手
        n: 4, start: "2026-07-19", end: "2026-08-01",
        theme: "嗜好與志向", grammar: ["過去式", "未來式"],
        words: [
          { en: "hobby", zh: "嗜好", pos: "n" }, { en: "interest", zh: "興趣", pos: "n" }, { en: "activity", zh: "活動", pos: "n" },
          { en: "collect", zh: "收集", pos: "v" }, { en: "painting", zh: "繪畫", pos: "n" }, { en: "hiking", zh: "健行", pos: "n" },
          { en: "camping", zh: "露營", pos: "n" }, { en: "fishing", zh: "釣魚", pos: "n" }, { en: "swimming", zh: "游泳", pos: "n" },
          { en: "reading", zh: "閱讀", pos: "n" }, { en: "cooking", zh: "烹飪", pos: "n" }, { en: "photo", zh: "照片", pos: "n" },
          { en: "talent", zh: "才能", pos: "n" }, { en: "skill", zh: "技能", pos: "n" }, { en: "practice", zh: "練習", pos: "v" },
          { en: "create", zh: "創造", pos: "v" }, { en: "try", zh: "嘗試", pos: "v" }, { en: "succeed", zh: "成功", pos: "v" },
          { en: "goal", zh: "目標", pos: "n" }, { en: "dream", zh: "夢想", pos: "n" }, { en: "future", zh: "未來", pos: "n" },
          { en: "job", zh: "工作、職業", pos: "n" }, { en: "wish", zh: "願望", pos: "n" }, { en: "creative", zh: "有創意的", pos: "adj" },
          { en: "imagine", zh: "想像", pos: "v" }, { en: "enjoy", zh: "喜愛、享受", pos: "v" }, { en: "relax", zh: "放鬆", pos: "v" },
          { en: "want", zh: "想要", pos: "v" }, { en: "hope", zh: "希望", pos: "v" }, { en: "decide", zh: "決定", pos: "v" }
        ]
      }
    ]
  },
  // ── 之後的月份：文法先排好，當月才解鎖（weeks 之後再依進度補上）──
  {
    month: "2026-08", label: "8 月", grammar: [
      { topic: "比較級",     eng: "Comparatives",   file: "lessons/lesson_2026-07-04.html", icon: "⚖️" },
      { topic: "現在完成式", eng: "Present Perfect", file: "lessons/lesson_2026-07-05.html", icon: "✅" }
    ], weeks: []
  },
  {
    month: "2026-09", label: "9 月", grammar: [
      { topic: "情態動詞", eng: "Modals",       file: "lessons/lesson_2026-07-06.html", icon: "⚠️" },
      { topic: "連接詞",   eng: "Conjunctions", file: "lessons/lesson_2026-07-07.html", icon: "🔗" }
    ], weeks: []
  },
  {
    month: "2026-10", label: "10 月", grammar: [
      { topic: "動名詞 / 不定詞", eng: "Gerund & Infinitive", file: "lessons/lesson_2026-07-08.html", icon: "🎯" }
    ], weeks: []
  }
];

function _ym(dateStr) { return (dateStr || "").slice(0, 7); }
// 月份是否已開放（今天的月份 >= 該月）→ 文法教學頁的解鎖判斷
function isMonthOpen(monthStr, todayStr) { return _ym(todayStr) >= monthStr; }
// 取得某日期所屬月份課程（找不到→該日之前最近的月；再不行→第一個月）
function curriculumForDate(dateStr) {
  const m = _ym(dateStr);
  return CURRICULUM.find(c => c.month === m)
      || CURRICULUM.filter(c => c.month <= m).slice(-1)[0]
      || CURRICULUM[0];
}
// 把所有月份的週攤平
function allWeeks() {
  const out = [];
  CURRICULUM.forEach(c => (c.weeks || []).forEach(w => out.push({ ...w, month: c })));
  return out;
}
// 取得某日期所屬的「本週」單字組（沒對應→取最近、或第1週）
function vocabWeekForDate(dateStr) {
  const weeks = allWeeks();
  const d = dateStr || "";
  let wk = weeks.find(w => d >= w.start && d <= w.end);
  if (!wk) wk = (d < weeks[0].start) ? weeks[0] : weeks[weeks.length - 1];
  return { month: wk.month, week: wk };
}
// 找某教學頁檔案屬於哪個月（給解鎖判斷用）
function monthOfLessonFile(file) {
  for (const c of CURRICULUM) for (const g of c.grammar) if (file.indexOf(g.file) >= 0 || g.file.indexOf(file) >= 0) return c.month;
  return null;
}

// 文法題庫（每日測驗用，依當月文法出題）。key = grammar topic。
const GRAMMAR_BANK = {
  "過去式": [
    { q: "We ___ to the museum yesterday.", choices: ["went", "go", "going"], answer: "went" },
    { q: "She ___ a new bag last week.", choices: ["bought", "buy", "buys"], answer: "bought" },
    { q: "They ___ a movie last night.", choices: ["saw", "see", "seen"], answer: "saw" },
    { q: "I ___ noodles for lunch.", choices: ["ate", "eat", "eaten"], answer: "ate" },
    { q: "He ___ very tired yesterday.", choices: ["was", "were", "is"], answer: "was" },
    { q: "We ___ at home last weekend.", choices: ["were", "was", "are"], answer: "were" },
    { q: "I ___ go to school yesterday.", choices: ["didn't", "don't", "wasn't"], answer: "didn't" },
    { q: "___ you visit your grandma last Sunday?", choices: ["Did", "Do", "Was"], answer: "Did" },
    { q: "She ___ English last night.", choices: ["studied", "study", "studies"], answer: "studied" },
    { q: "The bus ___ here ten minutes ago.", choices: ["stopped", "stop", "stops"], answer: "stopped" }
  ],
  "未來式": [
    { q: "I ___ going to visit my uncle.", choices: ["am", "will", "is"], answer: "am" },
    { q: "It ___ rain tomorrow.", choices: ["will", "am", "are"], answer: "will" },
    { q: "She is going to ___ a new phone.", choices: ["buy", "buys", "buying"], answer: "buy" },
    { q: "We ___ have a test next Monday.", choices: ["are going to", "went to", "going"], answer: "are going to" },
    { q: "They ___ come to the party tonight.", choices: ["will", "did", "was"], answer: "will" },
    { q: "Take an umbrella. It ___ rain.", choices: ["is going to", "was", "did"], answer: "is going to" },
    { q: "I think it ___ be sunny tomorrow.", choices: ["will", "was", "did"], answer: "will" },
    { q: "What ___ you going to do this weekend?", choices: ["are", "did", "was"], answer: "are" },
    { q: "I ___ help you with your homework.", choices: ["will", "was", "did"], answer: "will" },
    { q: "He is going to ___ to Japan next month.", choices: ["travel", "traveled", "travels"], answer: "travel" }
  ]
};

if (typeof module !== "undefined" && module.exports)
  module.exports = { CURRICULUM, GRAMMAR_BANK, curriculumForDate, vocabWeekForDate, isMonthOpen, monthOfLessonFile, allWeeks };
