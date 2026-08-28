// 學校英語課本（國小六上）期中考範圍。考試日 2026-11-05（四）。
//
// 來源：P:\AI\claude\國小六上-期中考\ 的 23 張課本照片（2026-08-28 提供）。
// 照片涵蓋 p.2–46，也就是 Unit 1、Unit 2、Review 1 的完整內容。
// Unit 3、Unit 4 只有 Contents 頁的大綱（單字、句型、phonics、閱讀技巧都齊），
// 課文與練習頁沒拍到 —— 那兩課的 story / reading 欄位因此是空的，等補拍再填。
//
// 這份資料的用途是「讓每週練習跟學校進度對得上」，不是取代課本。
// 所以只存：單字、句型、phonics、閱讀技巧、課文對白。習題不存（那是學校的事）。

const TEXTBOOK_G6A = {
  meta: {
    grade: "國小六上",
    examDate: "2026-11-05",
    examName: "期中考",
    scope: "Unit 1–4 ＋ Review 1–2 ＋ Culture: Moon Festival",
    photographed: "p.2–46（Unit 1、Unit 2、Review 1）",
    missing: "Unit 3、Unit 4 的課文與練習頁未拍（大綱已從 Contents 取得）",
  },

  // 開學前的複習頁（p.5–9），期中考不直接考，但每日練習可以拿來暖身
  warmup: {
    phonics: [
      { group: "bl", words: ["black", "block"] },
      { group: "pl", words: ["plane", "plant"] },
      { group: "gl", words: ["glad", "glass"] },
      { group: "cl", words: ["clay", "clean"] },
      { group: "br", words: ["bread", "brown"] },
      { group: "pr", words: ["prince", "prize"] },
      { group: "gr", words: ["grapes", "grass"] },
      { group: "cr", words: ["crab", "crush"] },
      { group: "tr", words: ["train", "tree", "truck"] },
      { group: "dr", words: ["dragonfly", "draw", "drum"] },
      { group: "sp", words: ["spoon", "spy"] },
      { group: "st", words: ["star", "storm"] },
      { group: "sk", words: ["ski", "sky"] },
    ],
    vocab: {
      Places: ["park", "bakery", "bookstore", "supermarket", "post office", "bank", "restaurant", "hospital"],
      Transportation: ["bike", "bus", "car", "MRT", "plane", "scooter", "taxi", "train"],
      Clothes: ["dress", "skirt", "sweater", "T-shirt", "pants", "shorts", "sneakers", "socks"],
      Objects: ["jacket", "key", "umbrella", "smartphone", "water bottle", "watch", "glasses"],
    },
    sentences: [
      { en: "I'm going to the post office.", zh: "我要去郵局。" },
      { en: "We can get to the park by bike.", zh: "我們可以騎腳踏車到公園。" },
      { en: "How much are the socks?", zh: "這些襪子多少錢？" },
      { en: "They're thirty dollars.", zh: "三十元。" },
      { en: "It's my watch.", zh: "這是我的手錶。" },
      { en: "They're my glasses.", zh: "這是我的眼鏡。" },
    ],
  },

  units: [
    {
      id: "u1", n: 1, title: "Whale Watching", zh: "賞鯨",
      topic: "國家", topicEn: "Countries",
      goal: "詢問他人及回答來自哪個國家",
      pages: "15–28",
      vocab: [
        { en: "Australia", zh: "澳洲" }, { en: "Canada", zh: "加拿大" },
        { en: "France", zh: "法國" }, { en: "India", zh: "印度" },
        { en: "Japan", zh: "日本" }, { en: "Taiwan", zh: "台灣" },
        { en: "the UK", zh: "英國" }, { en: "the USA", zh: "美國" },
      ],
      patterns: [
        { q: "Where are you from?", a: "I'm from Japan.", zh: "你來自哪裡？我來自日本。" },
        { q: "Is he/she from the USA?", a: "Yes, he/she is. / No, he's/she's not. He's/She's from the UK.",
          zh: "他／她來自美國嗎？是的／不是，他／她來自英國。" },
      ],
      // Learn with Boka（p.22）的替換表 —— 這是考試最常出的地方
      drill: {
        question: { frame: "Where ___ ___ from?", subjects: [
          { subj: "you", be: "are" }, { subj: "they", be: "are" },
          { subj: "Ken", be: "is" }, { subj: "Yuki", be: "is" },
        ]},
        answer: { frame: "___ ___ from Japan.", subjects: [
          { subj: "I", be: "am" }, { subj: "We", be: "are" }, { subj: "They", be: "are" },
          { subj: "He", be: "is" }, { subj: "She", be: "is" },
        ]},
      },
      grammarTip: "專有名詞的字首字母要大寫，例如：Taiwan、Amy、Sunday、Christmas、English。",
      phonics: { groups: ["er", "ir", "ur"], words: [
        { w: "clerk", g: "er" }, { w: "perm", g: "er" },
        { w: "girl", g: "ir" }, { w: "skirt", g: "ir" },
        { w: "nurse", g: "ur" }, { w: "purse", g: "ur" },
      ], chant: [
        "The clerk has a perm.",
        "The girl is wearing a skirt.",
        "The nurse has a purple purse.",
      ]},
      readingSkill: { en: "Find Details", zh: "找出細節" },
      story: [
        "Welcome, everyone.",
        "I can't wait to go whale watching.",
        "My name is Ella. Nice to meet you.",
        "Hi! I'm Tommy. It's my first time in Taiwan.",
        "Hi, Tommy! I'm from the UK. Where are you from?",
        "I'm from Canada.",
        "Are you from the USA?",
        "No, I'm not. I'm from France.",
        "Look! There's a whale.",
        "That's not a whale. It's a dolphin.",
        "Wow! There are more dolphins.",
        "Is that a whale?",
        "Yes, it is.",
        "What a big fish!",
        "A whale is not a fish. It's a mammal.",
        "This is amazing!",
        "We're so lucky.",
        "I like whales.",
      ],
      reading: {
        title: "Kevin's Friends Around the World",
        text: "I'm Kevin. I'm from Taiwan. I like to read English books. I write to my friends in English.",
      },
      extraWords: [
        { en: "whale", zh: "鯨魚" }, { en: "dolphin", zh: "海豚" },
        { en: "mammal", zh: "哺乳動物" }, { en: "field trip", zh: "校外教學" },
      ],
    },

    {
      id: "u2", n: 2, title: "Having a Cold", zh: "感冒了",
      topic: "病症", topicEn: "Symptoms",
      goal: "詢問他人及回答常見的病症",
      pages: "29–42",
      vocab: [
        { en: "cold", zh: "感冒" }, { en: "cough", zh: "咳嗽" },
        { en: "fever", zh: "發燒" }, { en: "headache", zh: "頭痛" },
        { en: "stomachache", zh: "肚子痛" }, { en: "toothache", zh: "牙痛" },
        { en: "runny nose", zh: "流鼻水" }, { en: "sore throat", zh: "喉嚨痛" },
      ],
      patterns: [
        { q: "What's wrong?", a: "I have a headache.", zh: "怎麼了？我頭痛。" },
        { q: "Does he/she have a fever?", a: "Yes, he/she does. / No, he/she doesn't. He/She has a cough.",
          zh: "他／她發燒了嗎？是的／沒有，他／她在咳嗽。" },
      ],
      drill: {
        question: { frame: "Do you have a fever?", answers: ["Yes, I do.", "No, I don't."] },
        question3: { frame: "Does Kevin have a fever?", answers: ["Yes, he does.", "No, he doesn't."] },
      },
      grammarTip: "1. I / You / We / They + have；He / She / It / Amy + has。2. do 和 does 後面用原形動詞。",
      // 身體部位 → 症狀的構詞（p.33），很好考
      wordBuilding: [
        { part: "head", ache: "headache", zh: "頭 → 頭痛" },
        { part: "tooth", ache: "toothache", zh: "牙齒 → 牙痛" },
        { part: "stomach", ache: "stomachache", zh: "胃 → 肚子痛" },
        { part: "nose", ache: "runny nose", zh: "鼻子 → 流鼻水" },
        { part: "throat", ache: "sore throat", zh: "喉嚨 → 喉嚨痛" },
      ],
      phonics: { groups: ["ar", "or"], words: [
        { w: "car", g: "ar" }, { w: "farm", g: "ar" }, { w: "party", g: "ar" },
        { w: "corn", g: "or" }, { w: "horse", g: "or" }, { w: "pork", g: "or" },
      ], chant: [
        "There's a party at the farm.",
        "Have some corn and pork.",
      ]},
      readingSkill: { en: "Question Words", zh: "疑問詞" },
      story: [
        "What's wrong?",
        "I have a headache.",
        "You look flushed.",
        "Does he have a fever?",
        "Yes, he does.",
        "Mom, I think Joe is sick.",
        "Let me take you to the doctor now.",
        "What's wrong?",
        "I have a headache and a fever.",
        "What's wrong? Do you have a stomachache?",
        "No, I'm just hungry.",
      ],
      reading: {
        title: "Seeing a Doctor",
        text: "Hello, everyone. I'm Joe. I'd like to talk about seeing a doctor in Taiwan and in the UK.",
      },
      moreToLearn: {
        title: "Home Remedy", zh: "居家療法",
        text: "Do you see a doctor or try home remedies for a cold? A common way to feel better is to drink honey and lemon tea. There are many ways to get better, but the best way is to sleep more and drink lots of water.",
        items: [
          { en: "chicken soup", zh: "雞湯", from: "the USA" },
          { en: "golden milk", zh: "薑黃牛奶", from: "India" },
          { en: "baked tangerine with salt", zh: "鹽烤橘子", from: "the ROC (Taiwan)" },
          { en: "steamed pear with rock sugar", zh: "冰糖燉雪梨", from: "the ROC (Taiwan)" },
        ],
      },
      extraWords: [
        { en: "flushed", zh: "臉紅的" }, { en: "sick", zh: "生病的" },
        { en: "doctor", zh: "醫生" }, { en: "medicine", zh: "藥" },
        { en: "rest", zh: "休息" }, { en: "stay healthy", zh: "保持健康" },
        { en: "symptom", zh: "症狀" }, { en: "remedy", zh: "療法" },
        { en: "honey", zh: "蜂蜜" }, { en: "lemon", zh: "檸檬" },
      ],
    },

    {
      id: "u3", n: 3, title: "From Farm to Table", zh: "從農場到餐桌",
      topic: "食物", topicEn: "Food",
      goal: "詢問他人及回答想吃的食物",
      pages: "47–60",
      vocab: [
        { en: "pizza", zh: "披薩" }, { en: "rice", zh: "米飯" },
        { en: "soup", zh: "湯" }, { en: "steak", zh: "牛排" },
        { en: "dumplings", zh: "水餃" }, { en: "noodles", zh: "麵" },
        { en: "sandwiches", zh: "三明治" }, { en: "French fries", zh: "薯條" },
      ],
      patterns: [
        { q: "What would you like to eat?", a: "I'd like some pizza, please.",
          zh: "你想吃什麼？我想要一些披薩，謝謝。" },
        { q: "Would you like some sandwiches?", a: "Yes, please. / No, thank you.",
          zh: "你想要一些三明治嗎？好的，謝謝／不用了，謝謝。" },
      ],
      grammarTip: "I'd like = I would like（我想要）。複數食物名詞要加 -s / -es：dumplings、sandwiches。",
      phonics: { groups: ["oi", "oy"], words: [], chant: [] },
      readingSkill: { en: "Sequence", zh: "排序" },
      story: [],
      reading: null,
      extraWords: [],
      _note: "課文頁未拍照，story / reading / phonics 例字待補",
    },

    {
      id: "u4", n: 4, title: "A Call in the Morning", zh: "早晨的來電",
      topic: "生活作息", topicEn: "Daily Routine",
      goal: "詢問他人及回答作息時間",
      pages: "61–74",
      vocab: [
        { en: "get up", zh: "起床" }, { en: "have breakfast", zh: "吃早餐" },
        { en: "go to school", zh: "上學" }, { en: "have lunch", zh: "吃午餐" },
        { en: "do my homework", zh: "做功課" }, { en: "go home", zh: "回家" },
        { en: "have dinner", zh: "吃晚餐" }, { en: "go to bed", zh: "上床睡覺" },
      ],
      patterns: [
        { q: "What time do you get up?", a: "I get up at six thirty.",
          zh: "你幾點起床？我六點半起床。" },
        { q: "Do you have lunch at twelve?", a: "Yes, I do. / No, I don't. I have lunch at twelve thirty.",
          zh: "你十二點吃午餐嗎？是的／不，我十二點半吃午餐。" },
      ],
      grammarTip: "時間唸法：six thirty（6:30）、twelve thirty（12:30）。at + 時間點。",
      phonics: { groups: ["ou", "ow"], words: [], chant: [] },
      readingSkill: { en: "Problem and Solution", zh: "解決問題" },
      story: [],
      reading: null,
      extraWords: [],
      _note: "課文頁未拍照，story / reading / phonics 例字待補",
    },
  ],

  reviews: [
    { id: "r1", n: 1, covers: ["u1", "u2"], skill: { en: "Find Details", zh: "找出細節" }, pages: "43–46",
      // Review 1 的 Read and Write（p.44）—— 國家＋症狀＋處置，正好把兩課綁在一起
      passages: [
        { text: "Aiko is from Japan. She has a sore throat and a headache. Her mom makes some honey and lemon tea for her.",
          name: "Aiko", country: "Japan", symptoms: ["sore throat", "headache"], remedy: "have some honey and lemon tea" },
        { text: "Ben is from Australia. He has a cough and a runny nose. He needs to get some chicken soup.",
          name: "Ben", country: "Australia", symptoms: ["cough", "runny nose"], remedy: "get some chicken soup" },
        { text: "Raj is from India. He has a fever and a sore throat. The doctor tells Raj to take medicine and get some rest.",
          name: "Raj", country: "India", symptoms: ["fever", "sore throat"], remedy: "take medicine and get some rest" },
      ],
      // Four in a Row（p.46）：er/ir/ur/ar/or 混合辨音，期中考的 phonics 題型就長這樣
      phonicsGrid: ["dirt","clerk","port","thirty","nerve","party","turn","corn","hard","hurt","skirt","fern",
                    "bark","burn","bird","perm","church","born","term","car","nurse","chirp","fork","curve",
                    "surf","girl","serve","pork","purse","park","horse","mark","short","herd","farm","thirsty"],
    },
    { id: "r2", n: 2, covers: ["u3", "u4"], skill: { en: "Sequence", zh: "排序" }, pages: "75–78",
      passages: [], phonicsGrid: [], _note: "未拍照" },
  ],

  culture: {
    id: "moon", title: "Moon Festival", zh: "中秋節", pages: "79–85",
    goal: "說出中秋節相關用語",
    vocab: [
      { en: "moon cake", zh: "月餅" }, { en: "pomelo", zh: "柚子" },
      { en: "full moon", zh: "滿月" }, { en: "have a barbecue", zh: "烤肉" },
    ],
  },

  task: { title: "A Country Guessing Book", zh: "國家猜猜書", pages: "86–87",
          goal: "綜合應用第一～第四課內容，完成指定活動" },
};

if (typeof module !== "undefined" && module.exports) module.exports = { TEXTBOOK_G6A };
if (typeof window !== "undefined") window.TEXTBOOK_G6A = TEXTBOOK_G6A;
