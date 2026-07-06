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
        // 自第 3 週起改為「週日開始、週六結束」；第 2 週提前於 07-11(六) 結束銜接（短週：每日 2 輪補題量）
        // 2026-07-06 重選：原「描述與經驗」多字超過 1200 字第 6 級，全部換成 5~6 級（Codex 選字、Claude 審核）
        n: 2, start: "2026-07-08", end: "2026-07-11",
        theme: "我的一天與社區", grammar: ["過去式", "未來式"],
        words: [
          { en: "apartment", zh: "公寓", pos: "n" }, { en: "bakery", zh: "麵包店", pos: "n" }, { en: "bathroom", zh: "浴室", pos: "n" },
          { en: "bedroom", zh: "臥室", pos: "n" }, { en: "garden", zh: "花園", pos: "n" }, { en: "gate", zh: "大門", pos: "n" },
          { en: "living room", zh: "客廳", pos: "n" }, { en: "post office", zh: "郵局", pos: "n" }, { en: "town", zh: "城鎮", pos: "n" },
          { en: "yard", zh: "院子", pos: "n" }, { en: "bake", zh: "烘烤", pos: "v" }, { en: "borrow", zh: "借入", pos: "v" },
          { en: "finish", zh: "完成", pos: "v" }, { en: "fix", zh: "修理", pos: "v" }, { en: "forget", zh: "忘記", pos: "v" },
          { en: "listen", zh: "聽", pos: "v" }, { en: "meet", zh: "見面、遇見", pos: "v" }, { en: "order", zh: "點餐、訂購", pos: "v" },
          { en: "prepare", zh: "準備", pos: "v" }, { en: "remember", zh: "記得", pos: "v" }, { en: "ride", zh: "騎、搭乘", pos: "v" },
          { en: "share", zh: "分享", pos: "v" }, { en: "tell", zh: "告訴", pos: "v" }, { en: "convenient", zh: "方便的", pos: "adj" },
          { en: "delicious", zh: "美味的", pos: "adj" }, { en: "favorite", zh: "最喜愛的", pos: "adj" }, { en: "helpful", zh: "有幫助的", pos: "adj" },
          { en: "important", zh: "重要的", pos: "adj" }, { en: "usually", zh: "通常", pos: "adv" }, { en: "test", zh: "測驗", pos: "n" }
        ]
      },
      {
        // 2026-07-06 重選：原「健康與規則」20 字超過第 6 級，換成 5~6 級（Codex 選字、Claude 審核）
        n: 3, start: "2026-07-12", end: "2026-07-18",
        theme: "校園社團與班級挑戰", grammar: ["過去式", "未來式"],
        words: [
          { en: "club", zh: "社團", pos: "n" }, { en: "drama", zh: "戲劇", pos: "n" }, { en: "camera", zh: "相機", pos: "n" },
          { en: "photo", zh: "照片", pos: "n" }, { en: "report", zh: "報告", pos: "n" }, { en: "diary", zh: "日記", pos: "n" },
          { en: "science", zh: "科學", pos: "n" }, { en: "subject", zh: "科目", pos: "n" }, { en: "lesson", zh: "課程", pos: "n" },
          { en: "quiz", zh: "小考", pos: "n" }, { en: "exam", zh: "考試", pos: "n" }, { en: "goal", zh: "目標", pos: "n" },
          { en: "score", zh: "分數", pos: "n" }, { en: "race", zh: "賽跑、比賽", pos: "n" }, { en: "message", zh: "訊息", pos: "n" },
          { en: "question", zh: "問題", pos: "n" }, { en: "answer", zh: "答案、回答", pos: "n" }, { en: "practice", zh: "練習", pos: "v" },
          { en: "decide", zh: "決定", pos: "v" }, { en: "choose", zh: "選擇", pos: "v" }, { en: "agree", zh: "同意", pos: "v" },
          { en: "believe", zh: "相信", pos: "v" }, { en: "hope", zh: "希望", pos: "v" }, { en: "enjoy", zh: "喜愛、享受", pos: "v" },
          { en: "follow", zh: "跟隨、遵照", pos: "v" }, { en: "repeat", zh: "重複", pos: "v" }, { en: "win", zh: "贏", pos: "v" },
          { en: "ready", zh: "準備好的", pos: "adj" }, { en: "careful", zh: "小心的", pos: "adj" }, { en: "quickly", zh: "快速地", pos: "adv" }
        ]
      },
      {
        // 第 4 週涵蓋到 08-01(六)；8 月課程自 08-02(日) 起接手
        // 2026-07-06 重選：原「嗜好與志向」20 字超過第 6 級，換成 5~6 級（Codex 選字、Claude 審核）
        n: 4, start: "2026-07-19", end: "2026-08-01",
        theme: "週末露營與家庭小任務", grammar: ["過去式", "未來式"],
        words: [
          { en: "add", zh: "加入", pos: "v" }, { en: "basket", zh: "籃子", pos: "n" }, { en: "blanket", zh: "毯子", pos: "n" },
          { en: "boil", zh: "煮沸", pos: "v" }, { en: "bottle", zh: "瓶子", pos: "n" }, { en: "brave", zh: "勇敢的", pos: "adj" },
          { en: "camp", zh: "露營、營地", pos: "v" }, { en: "carefully", zh: "小心地", pos: "adv" }, { en: "empty", zh: "空的", pos: "adj" },
          { en: "finally", zh: "最後、終於", pos: "adv" }, { en: "fire", zh: "火", pos: "n" }, { en: "flashlight", zh: "手電筒", pos: "n" },
          { en: "forest", zh: "森林", pos: "n" }, { en: "fry", zh: "油煎、炒", pos: "v" }, { en: "happen", zh: "發生", pos: "v" },
          { en: "heavy", zh: "重的", pos: "adj" }, { en: "loud", zh: "大聲的", pos: "adj" }, { en: "mix", zh: "混合", pos: "v" },
          { en: "problem", zh: "問題", pos: "n" }, { en: "quiet", zh: "安靜的", pos: "adj" }, { en: "repair", zh: "修理", pos: "v" },
          { en: "rope", zh: "繩子", pos: "n" }, { en: "safe", zh: "安全的", pos: "adj" }, { en: "stone", zh: "石頭", pos: "n" },
          { en: "tent", zh: "帳篷", pos: "n" }, { en: "tool", zh: "工具", pos: "n" }, { en: "worried", zh: "擔心的", pos: "adj" },
          { en: "fill", zh: "裝滿、填滿", pos: "v" }, { en: "wood", zh: "木頭", pos: "n" }, { en: "rest", zh: "休息", pos: "v" }
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
