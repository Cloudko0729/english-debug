// 學校英語課本（國小六上）。
// 期中考 2026-11-05（四）：Unit 1、Unit 2、Review 1、中秋節（補充教材）
// 期末考 2027-01-12（二）、01-13（三）：Unit 3、Unit 4、Review 2
//
// 來源：P:\AI\claude\國小六上-期中考\ 的 23 張課本照片（2026-08-28 提供）。
// 照片涵蓋 p.2–46，也就是 Unit 1、Unit 2、Review 1 的完整內容。
// Unit 3、Unit 4、Review 2（p.47–78）2026-11-06 補拍 17 張，習作 p.18–33 於 11-08 提供，
// 照片放在 D:\國小\國小六上-期末考\（不進 repo）。workbook 欄位是習作裡課本沒有、但會考的句子。
//
// 這份資料的用途是「讓每週練習跟學校進度對得上」，不是取代課本。
// 所以只存：單字、句型、phonics、閱讀技巧、課文對白。習題不存（那是學校的事）。

const TEXTBOOK_G6A = {
  meta: {
    grade: "國小六上",
    examDate: "2026-11-05",
    midtermScope: "Unit 1、Unit 2、Review 1、中秋節",
    finalScope: "Unit 3、Unit 4、Review 2",
    photographed: "p.2–46（Unit 1、Unit 2、Review 1）＋ p.47–78（Unit 3、Unit 4、Review 2）＋ p.79–85（中秋節）＋ 習作 p.18–33",
    missing: "",
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
      // Learn with Boka（p.54）＋ Reminder（p.52）
      grammarTip: "I'd like = I would like（我想要）；也會看到 He'd、She'd、We'd、They'd like。some 後面可以接可數或不可數名詞：可數的要加 s／es（hamburgers、dumplings、sandwiches），不可數的不加（pizza、rice、steak、soup、coffee、ice cream、milk、tea）。a pizza 是一整個披薩，some pizza 是一片或好幾片。",
      phonics: { groups: ["oi", "oy"], sameSound: true, words: [
        { w: "coin", g: "oi" }, { w: "noise", g: "oi" }, { w: "soil", g: "oi" },
        { w: "boy", g: "oy" }, { w: "joy", g: "oy" }, { w: "toy", g: "oy" },
      ], chant: [
        "There is a coin in the soil.",
        "The boy is playing with a toy.",
        "The boy is Roy. He plays with some toys. He sees a golden coin. What a great joy!",
      ],
      // Listen, Point, and Say（p.59）：長得像、音不同的字，考卷的「選出聽到的字」就考這種
      pairs: [["paint", "point"], ["coin", "corn"], ["sail", "soil"], ["bay", "boy"]] },
      readingSkill: { en: "Sequence", zh: "排序" },
      story: [
        "Amy's dad takes the kids to the farm.",
        "The corn is fresh.",
        "I like potatoes. I can make some French fries.",
        "I can make some sandwiches.",
        "I can make a pizza.",
        "I'm done. It smells so good.",
        "The sandwiches are ready.",
        "What would you like to eat?",
        "I'd like some pizza, please.",
        "I'd like a sandwich, please.",
        "Sure! Here you are.",
        "Would you like some French fries?",
        "No, thank you. My plate is full.",
        "I'm so hungry.",
        "Me too. I could eat a horse.",
        "What? A horse?",
      ],
      reading: {
        title: "Let's Make a Pizza!",
        text: "Look at the tomatoes. They're red now. Let's pick some and make a pizza. What We Need: basil, cheese, dough, tomatoes, tomato sauce. First, slice the tomatoes. Next, spread some tomato sauce on the dough. Then, add cheese, tomato slices, and basil on top. Lastly, bake the pizza in the oven. Done! Now, let's eat the pizza!",
      },
      // 習作 p.18–23 裡課本沒有、但會考的句子
      workbook: [
        "What's wrong, Bill? I have a cold. I'd like some hot chicken soup, please.",
        "What would you like for dinner, Tommy? I'm not hungry. I'd like some tea, please.",
        "Would you like some dumplings? No, thank you. I'm full.",
        "I'd like two bowls of noodles, please.",
        "Would you like something else?",
        "What's today's special? Pizza. But it's sold out.",
        "Here you are. Enjoy your meal!",
        "Would you like some pizza and French fries? You can share the food.",
      ],
      moreToLearn: {
        title: "Famous Noodles Around the World", zh: "世界有名的麵（選讀）",
        text: "Many people in Taiwan like to eat beef noodles. The noodles come with a rich broth. Pho comes with rice noodles, a clear broth, and spices. It's aromatic and salty. Spaghetti is long and thin. You can try spaghetti with red, green, white, or black sauce.",
        items: [
          { en: "beef noodles", zh: "牛肉麵", from: "the ROC (Taiwan)" },
          { en: "pho", zh: "越南湯河粉", from: "Vietnam" },
          { en: "spaghetti", zh: "義大利細麵條", from: "Italy" },
        ],
      },
      extraWords: [
        { en: "take", zh: "帶（某人）去（某地）" }, { en: "fresh", zh: "新鮮的" },
        { en: "potato", zh: "馬鈴薯" }, { en: "I'm done.", zh: "我完成了。" },
        { en: "smell", zh: "聞起來" }, { en: "plate", zh: "盤子" },
        { en: "full", zh: "裝滿的；吃飽的" }, { en: "I could eat a horse.", zh: "我餓極了。" },
        { en: "pick", zh: "摘" }, { en: "basil", zh: "羅勒" },
        { en: "cheese", zh: "起司" }, { en: "dough", zh: "麵團" },
        { en: "tomato sauce", zh: "番茄醬" }, { en: "slice", zh: "切成薄片；薄片" },
        { en: "spread", zh: "鋪開" }, { en: "lastly", zh: "最後" },
        { en: "oven", zh: "烤箱" }, { en: "hamburgers", zh: "漢堡" },
        { en: "coffee", zh: "咖啡" }, { en: "ice cream", zh: "冰淇淋" },
        { en: "milk", zh: "牛奶" }, { en: "tea", zh: "茶" },
        { en: "bowl", zh: "碗" }, { en: "today's special", zh: "今日特餐" },
        { en: "sold out", zh: "賣完" }, { en: "fried", zh: "炒的" },
      ],
    },

    {
      id: "u4", n: 4, title: "A Call in the Morning", zh: "早晨的來電",
      topic: "生活作息", topicEn: "Daily Routine",
      goal: "詢問他人及回答作息時間",
      pages: "61–74",
      vocab: [
        { en: "get up", zh: "起床" }, { en: "have breakfast", zh: "吃早餐" },
        { en: "go to school", zh: "上學" }, { en: "have lunch", zh: "吃午餐" },
        { en: "go home", zh: "回家" }, { en: "have dinner", zh: "吃晚餐" },
        { en: "do my homework", zh: "做功課" }, { en: "go to bed", zh: "上床睡覺" },
      ],
      patterns: [
        { q: "What time do you get up?", a: "I get up at six thirty.",
          zh: "你幾點起床？我六點半起床。" },
        { q: "Do you have lunch at twelve?", a: "Yes, I do. / No, I don't. I have lunch at twelve thirty.",
          zh: "你十二點吃午餐嗎？是的／不，我十二點半吃午餐。" },
        // Learn with Boka（p.68）的第三人稱
        { q: "What time does Kevin get up?", a: "He gets up at six.",
          zh: "Kevin 幾點起床？他六點起床。" },
      ],
      grammarTip: "主詞是 he、she 或一個人（Kevin、Amy、Mom）時，動詞要變：do → does、go → goes、get → gets、have → has。問句：What time do you／they get up? What time does Kevin get up? 時間唸法：six thirty（6:30）、seven fifteen（7:15）、six forty-five（6:45）、six o'clock（6:00）。at + 幾點，on + 星期／weekdays／weekends。",
      phonics: { groups: ["ou", "ow"], sameSound: true, words: [
        { w: "house", g: "ou" }, { w: "mouse", g: "ou" }, { w: "shout", g: "ou" },
        { w: "clown", g: "ow" }, { w: "owl", g: "ow" }, { w: "shower", g: "ow" },
      ], chant: [
        "There is a mouse in the house.",
        "The clown has an owl.",
        "The clown has an owl. The owl is catching a mouse. \"Out! Out! Out! Get the mouse out!\" The clown shouts aloud.",
      ],
      pairs: [["couch", "coach"], ["owl", "oil"], ["tone", "town"], ["load", "loud"]] },
      readingSkill: { en: "Problem and Solution", zh: "問題與解決" },
      story: [
        "It's six thirty on Saturday morning.",
        "It's sunny today. Let's go to the park.",
        "Good idea! We can play basketball.",
        "Who's calling?",
        "Morning, Amy. Let's go to the park.",
        "Now? It's Saturday! It's six thirty in the morning. Do you get up at six thirty on Saturdays?",
        "No, I get up at six o'clock every day.",
        "You're an early bird.",
        "Yes, I am. What time do you get up?",
        "I get up at six thirty on weekdays. On weekends, I get up at eight.",
        "Oops! Sorry for waking you up.",
        "It's OK. See you at the park at seven thirty.",
        "See you then.",
        "Nice shot, Boka!",
        "You're really good at basketball.",
        "Stop, Lucky!",
      ],
      reading: {
        title: "Building Good Habits",
        text: "It's the end of the year. I want to break my bad habits. First, I find out my bad habits. Then, I set my goals and make a plan. 6:30 AM get up / 6:45 AM have breakfast / 7:00 AM go to school / 4:00 PM go home / 6:30 PM have dinner / 8:30 PM do my homework / 11:30 PM go to bed. I only have 7 hours of sleep. It's not enough. Sometimes, I don't have breakfast because I get up late. I don't exercise. My plan to break the bad habits: Get 8 hours of sleep every day. (go to bed at 10:30) Have breakfast every day. (go to bed early and get up early) Exercise every week. (go swimming once a week) What about you? Do you want to say goodbye to your bad habits? Make a plan and just do it. Be a better you!",
      },
      workbook: [
        "What time does Rose do her homework? She does her homework at eight.",
        "Does Josh have breakfast at seven? No, he doesn't. He has breakfast at six thirty.",
        "Owen goes home at four twenty.",
        "Mom gets up at six fifteen.",
        "What time do you go to school? I go to school at six forty.",
        "At seven thirty, Luna takes a nap, and I go to school.",
        "He does his homework at eight fifty.",
        "Does Hannah go to bed at ten?",
      ],
      moreToLearn: {
        title: "Breakfast Around the World", zh: "世界各地的早餐（選讀）",
        text: "A full English breakfast contains eggs, beans, bacon, mushrooms, sausages, toast, and tomatoes. A classic Japanese breakfast contains rice, miso soup, fish, and side dishes. Some people have natto with rice. In Singapore, people like to have kaya toast for breakfast. Kaya is a jam made with coconut milk, eggs, and sugar.",
        items: [
          { en: "full English breakfast", zh: "傳統英式早餐", from: "the UK" },
          { en: "classic Japanese breakfast", zh: "經典日式早餐", from: "Japan" },
          { en: "kaya toast", zh: "咖椰吐司", from: "Singapore" },
        ],
      },
      extraWords: [
        { en: "basketball", zh: "籃球" }, { en: "early bird", zh: "早起者" },
        { en: "weekday", zh: "平日" }, { en: "weekend", zh: "週末" },
        { en: "Nice shot!", zh: "好球！" }, { en: "daily", zh: "每天的" },
        { en: "routine", zh: "例行公事" }, { en: "schedule", zh: "日程表" },
        { en: "build", zh: "建立" }, { en: "habit", zh: "習慣" },
        { en: "end", zh: "末尾" }, { en: "break", zh: "改掉（習慣）" },
        { en: "set", zh: "設立" }, { en: "goal", zh: "目標" },
        { en: "because", zh: "因為" }, { en: "exercise", zh: "運動" },
        { en: "once", zh: "一次" }, { en: "problem", zh: "問題" },
        { en: "solution", zh: "解決辦法" }, { en: "take a nap", zh: "小睡" },
      ],
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
      // Review 2 的 Read and Fill in the Blanks（p.76–77）：媽媽打電話問住在台灣的孩子過得怎樣
      passages: [
        { title: "A Call from Mom",
          lines: [
            "Mom: How is your life in Taiwan?",
            "Son: It's good! But I have to get up very early.",
            "Mom: Why?",
            "Son: School starts at seven fifty. I go to school at seven thirty, so I get up at six forty-five.",
            "Mom: Wow! That's early. Do you go to bed early, too?",
            "Son: Yes, I go to bed at nine thirty.",
            "Mom: Great! Early to bed and early to rise. What do you have for breakfast?",
            "Son: I usually have a sandwich and some milk.",
            "Mom: I'm glad you fit in there.",
            "Son: Guess what? After lunch, we take a nap at twelve forty.",
            "Mom: That's interesting. What time do you go home?",
            "Son: I go home at four. Oh! It's six thirty now. Time for dinner. We have dumplings for dinner today. I have to go!",
            "Mom: Love you. Bye!",
            "Son: Bye, Mom.",
          ],
          questions: [
            { q: "What time does school start?", choices: ["At seven fifty.", "At seven thirty.", "At six forty-five.", "At nine thirty."], answer: "At seven fifty." },
            { q: "What time does the boy get up?", choices: ["At six forty-five.", "At seven fifty.", "At six thirty.", "At twelve forty."], answer: "At six forty-five." },
            { q: "What does the boy usually have for breakfast?", choices: ["A sandwich and some milk.", "Some dumplings.", "Some rice and soup.", "Some noodles and juice."], answer: "A sandwich and some milk." },
            { q: "What time do they take a nap?", choices: ["At twelve forty.", "At twelve thirty.", "At four.", "At seven thirty."], answer: "At twelve forty." },
            { q: "What do they have for dinner today?", choices: ["Dumplings.", "Pizza.", "Steak.", "Sandwiches."], answer: "Dumplings." },
          ],
        },
      ],
      words: [
        { en: "Early to bed and early to rise.", zh: "早睡早起。" }, { en: "fit in", zh: "適應" },
        { en: "take a nap", zh: "小睡" }, { en: "interesting", zh: "有趣的" },
      ],
      // Play and Say（p.78）：oi／oy／ou／ow 混合，四個連成一線
      phonicsGrid: ["boy","round","shower","house","brown","boil","out","how","coin","ploy","now","soil",
                    "foil","joy","sound","crown","cloud","soy","owl","oil","mouse","toy","noise","town",
                    "shout","Roy","down","join","loud","bow","point","loin","coy","clown","coil","proud"] },
  ],

  // 中秋節（p.79–85）。算補充教材，但列入期中考範圍。
  // 這一課的句型其實是「回收」：Would you like some…? 是 Unit 3 的主句型（提前見到），
  // What's wrong? 是 Unit 2 的。所以拿它來練 Unit 2 特別順。
  culture: {
    id: "moon", title: "Moon Festival", zh: "中秋節", pages: "79–85",
    goal: "說出中秋節相關用語",
    vocab: [
      { en: "moon cake", zh: "月餅" }, { en: "pomelo", zh: "柚子" },
      { en: "full moon", zh: "滿月" }, { en: "have a barbecue", zh: "烤肉" },
    ],
    patterns: [
      { q: "Would you like some moon cakes?", a: "Yes, please.", zh: "你想要一些月餅嗎？好的，謝謝。" },
      { q: "Do you like pomelos, Joe?", a: "Yes, I do.", zh: "Joe，你喜歡柚子嗎？是的，我喜歡。" },
    ],
    story: [
      "Hi, guys!",
      "Hi, Amy! We are having a barbecue. Join us!",
      "Would you like some barbecue?",
      "Sure!",
      "Would you like some moon cakes?",
      "Yes, please.",
      "What's wrong?",
      "Don't eat too fast.",
      "Would you like to try some pomelos, Joe?",
      "Sure. Thank you.",
      "This one looks good.",
      "But this one tastes good.",
      "You're right, Amy. It's sweet.",
      "Do you like pomelos, Joe?",
      "Yes, I do.",
      "I like Moon Festival. It's fun!",
      "Happy Moon Festival!",
    ],
    // p.84 挑柚子：green/big → yellowish-green/small
    tips: {
      title: "Tips for Picking Pomelos", zh: "挑柚子的訣竅",
      before: ["green", "big"], after: ["yellowish-green", "small"], wait: "After 1–2 Weeks",
      text: "Put pomelos in a cool place for one to two weeks. The pomelos will become sweet!",
    },
    // p.85 圈出不屬於中秋的東西 —— 考的是「哪些才是中秋的」
    activity: {
      title: "Circle and Say",
      q: "It's Moon Festival. Which objects are not parts of this festival?",
      belong: ["moon cake", "pomelo", "full moon", "barbecue"],
      notBelong: ["Christmas tree", "Santa", "jack-o'-lantern", "red envelope", "zongzi"],
    },
    extraWords: [
      { en: "Join us!", zh: "加入我們吧！" }, { en: "sure", zh: "當然" },
      { en: "taste", zh: "嘗起來" }, { en: "sweet", zh: "甜的" },
      { en: "pick", zh: "挑選" }, { en: "yellowish-green", zh: "黃綠色的" },
      { en: "become", zh: "變得" }, { en: "object", zh: "物品" },
    ],
  },

  task: { title: "A Country Guessing Book", zh: "國家猜猜書", pages: "86–87",
          goal: "綜合應用第一～第四課內容，完成指定活動" },
};

if (typeof module !== "undefined" && module.exports) module.exports = { TEXTBOOK_G6A };
if (typeof window !== "undefined") window.TEXTBOOK_G6A = TEXTBOOK_G6A;
