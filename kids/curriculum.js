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
    ], weeks: [
      {
        n: 1, start: "2026-08-02", end: "2026-08-08",
        theme: "夏日戶外與安全", grammar: ["比較級","現在完成式"],
        words: [
          { en: "camping", zh: "露營", pos: "n" }, { en: "mountain-climbing", zh: "登山", pos: "n" }, { en: "hiking", zh: "步行", pos: "n" },
          { en: "hike", zh: "遠足", pos: "v" }, { en: "outside", zh: "在外面", pos: "adv" }, { en: "swimsuit", zh: "游泳衣", pos: "n" },
          { en: "pool", zh: "水池", pos: "n" }, { en: "surfing", zh: "衝浪", pos: "n" }, { en: "surf", zh: "海浪", pos: "v" },
          { en: "boat", zh: "船", pos: "n" }, { en: "fishing", zh: "釣魚", pos: "n" }, { en: "waterfall", zh: "瀑布", pos: "n" },
          { en: "pond", zh: "池塘", pos: "n" }, { en: "ocean", zh: "洋", pos: "n" }, { en: "woods", zh: "樹林", pos: "n" },
          { en: "fire station", zh: "消防站", pos: "n" }, { en: "police station", zh: "警察局", pos: "n" }, { en: "police officer", zh: "警官", pos: "n" },
          { en: "policeman", zh: "警察", pos: "n" }, { en: "scared", zh: "驚嚇的", pos: "adj" }, { en: "mosquito", zh: "蚊子", pos: "n" },
          { en: "sand", zh: "沙(複)沙灘", pos: "n" }, { en: "traveling", zh: "旅行的", pos: "n" }, { en: "deep", zh: "深的", pos: "adj" },
          { en: "watch", zh: "注意", pos: "v" }, { en: "rule", zh: "規則", pos: "n" }, { en: "danger", zh: "危險", pos: "n" },
          { en: "dangerous", zh: "危險的", pos: "adj" }, { en: "safety", zh: "安全", pos: "n" }, { en: "nature", zh: "大自然", pos: "n" },
        ],
      },
      {
        n: 2, start: "2026-08-09", end: "2026-08-15",
        theme: "廚房與料理", grammar: ["比較級","現在完成式"],
        words: [
          { en: "cooking", zh: "烹調(n)  烹調用", pos: "n" }, { en: "fork", zh: "叉子", pos: "n" }, { en: "knife", zh: "刀子", pos: "n" },
          { en: "spoon", zh: "湯匙", pos: "n" }, { en: "plate", zh: "盤子", pos: "n" }, { en: "pan", zh: "平底鍋", pos: "n" },
          { en: "pot", zh: "罐", pos: "n" }, { en: "oven", zh: "烤爐", pos: "n" }, { en: "microwave", zh: "微波", pos: "n" },
          { en: "microwave oven", zh: "微波爐", pos: "n" }, { en: "stove", zh: "爐", pos: "n" }, { en: "freezer", zh: "冷凍裝置", pos: "n" },
          { en: "table cloth", zh: "桌布", pos: "n" }, { en: "teapot", zh: "茶壺", pos: "n" }, { en: "napkin", zh: "餐巾", pos: "n" },
          { en: "soy-sauce", zh: "醬油", pos: "n" }, { en: "oil", zh: "油", pos: "n" }, { en: "pepper", zh: "胡椒粉", pos: "n" },
          { en: "ketchup", zh: "蕃茄醬", pos: "n" }, { en: "butter", zh: "奶油", pos: "n" }, { en: "glass", zh: "玻璃杯", pos: "n" },
          { en: "faucet", zh: "(容器或水管的)龍頭", pos: "n" }, { en: "mop", zh: "拖把(俗稱地拖)  ", pos: "n" }, { en: "sweep", zh: "(打)掃", pos: "v" },
          { en: "dessert", zh: "甜點", pos: "n" }, { en: "jar", zh: "甕", pos: "n" }, { en: "bowl", zh: "碗", pos: "n" },
          { en: "refrigerator", zh: "冰箱", pos: "n" }, { en: "saucer", zh: "碟子", pos: "n" }, { en: "tableware", zh: "餐具", pos: "n" },
        ],
      },
      {
        n: 3, start: "2026-08-16", end: "2026-08-22",
        theme: "商店與購物", grammar: ["比較級","現在完成式"],
        words: [
          { en: "shopping", zh: "購物", pos: "n" }, { en: "convenience store", zh: "便利商店", pos: "n" }, { en: "department store", zh: "百貨公司", pos: "n" },
          { en: "drugstore", zh: "藥局", pos: "n" }, { en: "flower shop", zh: "花店", pos: "n" }, { en: "stationery store", zh: "文具店", pos: "n" },
          { en: "clerk", zh: "店員", pos: "n" }, { en: "shopkeeper", zh: "店主", pos: "n" }, { en: "sale", zh: "特價", pos: "n" },
          { en: "sell", zh: "賣", pos: "v" }, { en: "cost", zh: "花費", pos: "v" }, { en: "coin", zh: "硬幣", pos: "n" },
          { en: "purse", zh: "錢包", pos: "n" }, { en: "wallet", zh: "錢包", pos: "n" }, { en: "mall", zh: "散步式商店街", pos: "n" },
          { en: "postcard", zh: "明信片", pos: "n" }, { en: "stationery", zh: "文具", pos: "n" }, { en: "cd player", zh: "雷射唱片播放器", pos: "n" },
          { en: "tape recorder", zh: "錄音機", pos: "n" }, { en: "vcr", zh: "錄影機", pos: "n" }, { en: "video", zh: "影片", pos: "n" },
          { en: "radio", zh: "收音機", pos: "n" }, { en: "blouse", zh: "女式襯衫", pos: "n" }, { en: "glove", zh: "手套", pos: "n" },
          { en: "sneakers", zh: "膠底運動鞋", pos: "n" }, { en: "suitcase", zh: "衣箱", pos: "n" }, { en: "cash", zh: "現金", pos: "n" },
          { en: "credit card", zh: "信用卡", pos: "n" }, { en: "customer", zh: "顧客", pos: "n" }, { en: "salesman", zh: "銷售員", pos: "n" },
        ],
      },
      {
        n: 4, start: "2026-08-23", end: "2026-08-29",
        theme: "城市與交通", grammar: ["比較級","現在完成式"],
        words: [
          { en: "airplane", zh: "飛機", pos: "n" }, { en: "taxi", zh: "計程車", pos: "n" }, { en: "subway", zh: "地鐵", pos: "n" },
          { en: "mrt", zh: "大眾捷運系統 Mas", pos: "n" }, { en: "motorcycle", zh: "機車", pos: "n" }, { en: "bicycle riding", zh: "騎腳踏車", pos: "n" },
          { en: "driver", zh: "司機", pos: "n" }, { en: "gas station", zh: "加油站", pos: "n" }, { en: "parking lot", zh: "停車場", pos: "n" },
          { en: "train station", zh: "火車站", pos: "n" }, { en: "traffic jam", zh: "交通阻塞", pos: "n" }, { en: "traffic light", zh: "交通燈號誌", pos: "n" },
          { en: "traffic lights", zh: "紅綠燈", pos: "n" }, { en: "traffic sign", zh: "交通號誌", pos: "n" }, { en: "downtown", zh: "往市中心", pos: "adv" },
          { en: "building", zh: "建築物", pos: "n" }, { en: "corner", zh: "角", pos: "n" }, { en: "sign", zh: "標記", pos: "n" },
          { en: "entrance", zh: "入口", pos: "n" }, { en: "exit", zh: "出口", pos: "n" }, { en: "get on", zh: "上車", pos: "phr" },
          { en: "get off", zh: "下車", pos: "phr" }, { en: "get in", zh: "進入", pos: "phr" }, { en: "garage", zh: "車庫", pos: "n" },
          { en: "flat tire", zh: "洩了氣的輪胎", pos: "n" }, { en: "wheel", zh: "輪", pos: "n" }, { en: "traffic", zh: "交通", pos: "n" },
          { en: "sidewalk", zh: "人行道", pos: "n" }, { en: "highway", zh: "公路", pos: "n" }, { en: "passenger", zh: "乘客", pos: "n" },
        ],
      },
      {
        n: 5, start: "2026-08-30", end: "2026-09-05",
        theme: "新學期與課表", grammar: ["比較級","現在完成式"],
        words: [
          { en: "class", zh: "班級", pos: "n" }, { en: "class leader", zh: "班長", pos: "n" }, { en: "elementary school", zh: "小學", pos: "n" },
          { en: "primary school", zh: "小學", pos: "n" }, { en: "senior high school", zh: "高中", pos: "n" }, { en: "first grade", zh: "一年級", pos: "n" },
          { en: "second grade", zh: "二年級", pos: "n" }, { en: "kindergarten", zh: "幼稚園", pos: "n" }, { en: "schoolmate", zh: "校友", pos: "n" },
          { en: "math", zh: "數學", pos: "n" }, { en: "mathematics", zh: "數學", pos: "n" }, { en: "calendar", zh: "月曆", pos: "n" },
          { en: "weekday", zh: "周一到周五的通稱", pos: "n" }, { en: "teach", zh: "教", pos: "v" }, { en: "teacher's day", zh: "教師節", pos: "n" },
          { en: "quarter", zh: "四分之一", pos: "n" }, { en: "level", zh: "水平", pos: "n" }, { en: "beginner", zh: "初學者", pos: "n" },
          { en: "beginning", zh: "開始", pos: "n" }, { en: "daily", zh: "每日的(adj)  ", pos: "adj" }, { en: "meeting", zh: "會議", pos: "n" },
          { en: "pop music", zh: "流行音樂", pos: "n" }, { en: "piano", zh: "鋼琴", pos: "n" }, { en: "trumpet", zh: "喇叭", pos: "n" },
          { en: "artist", zh: "藝術家", pos: "n" }, { en: "painting", zh: "繪畫", pos: "n" }, { en: "campus", zh: "校園", pos: "n" },
          { en: "course", zh: "課程", pos: "n" }, { en: "semester", zh: "學期", pos: "n" }, { en: "period", zh: "(一段)時間", pos: "n" },
        ],
      },
    ]
  },
  {
    month: "2026-09", label: "9 月", grammar: [
      { topic: "情態動詞", eng: "Modals",       file: "lessons/lesson_2026-07-06.html", icon: "⚠️" },
      { topic: "連接詞",   eng: "Conjunctions", file: "lessons/lesson_2026-07-07.html", icon: "🔗" }
    ], weeks: [
      {
        n: 1, start: "2026-09-06", end: "2026-09-12",
        theme: "天氣與季節", grammar: ["情態動詞","連接詞"],
        words: [
          { en: "raincoat", zh: "雨衣", pos: "n" }, { en: "shower", zh: "陣雨", pos: "n" }, { en: "snowman", zh: "雪人", pos: "n" },
          { en: "snowy", zh: "下雪的", pos: "adj" }, { en: "storm", zh: "暴風雨", pos: "n" }, { en: "stormy", zh: "暴風雨的", pos: "adj" },
          { en: "thunder", zh: "雷(n)  打雷", pos: "n" }, { en: "temperature", zh: "溫度", pos: "n" }, { en: "fog", zh: "霧(n)  霧", pos: "n" },
          { en: "foggy", zh: "多霧的", pos: "adj" }, { en: "freezing", zh: "結冰的", pos: "adj" }, { en: "shine", zh: "照耀", pos: "v" },
          { en: "sweater", zh: "毛衣", pos: "n" }, { en: "scarf", zh: "圍巾", pos: "n" }, { en: "gloves", zh: "手套", pos: "n" },
          { en: "north", zh: "北方", pos: "n" }, { en: "south", zh: "南方", pos: "n" }, { en: "east", zh: "東方", pos: "n" },
          { en: "west", zh: "西方", pos: "n" }, { en: "outer space", zh: "外太空", pos: "n" }, { en: "earth", zh: "地球", pos: "n" },
          { en: "space", zh: "太空", pos: "n" }, { en: "typhoon", zh: "颱風", pos: "n" }, { en: "rainbow", zh: "彩虹", pos: "n" },
          { en: "lightning", zh: "閃電", pos: "n" }, { en: "humid", zh: "有濕氣的", pos: "adj" }, { en: "northern", zh: "北方的", pos: "adj" },
          { en: "southern", zh: "南方的", pos: "adj" }, { en: "eastern", zh: "東方的", pos: "adj" }, { en: "western", zh: "西的", pos: "adj" },
        ],
      },
      {
        n: 2, start: "2026-09-13", end: "2026-09-19",
        theme: "圖書館與閱讀", grammar: ["情態動詞","連接詞"],
        words: [
          { en: "bookcase", zh: "書櫥", pos: "n" }, { en: "dictionary", zh: "字典", pos: "n" }, { en: "magazine", zh: "雜誌", pos: "n" },
          { en: "story", zh: "故事", pos: "n" }, { en: "textbook", zh: "教科書", pos: "n" }, { en: "workbook", zh: "習作", pos: "n" },
          { en: "reading test", zh: "閱讀測驗", pos: "n" }, { en: "print", zh: "印刷", pos: "v" }, { en: "printer", zh: "印表機", pos: "n" },
          { en: "sheet", zh: "(一)張", pos: "n" }, { en: "note", zh: "便條", pos: "n" }, { en: "ink", zh: "墨水", pos: "n" },
          { en: "rubber", zh: "橡皮", pos: "n" }, { en: "envelope", zh: "信封", pos: "n" }, { en: "e-mail", zh: "電子郵件", pos: "n" },
          { en: "email", zh: "電子郵件", pos: "n" }, { en: "review", zh: "評論", pos: "v" }, { en: "history", zh: "歷史", pos: "n" },
          { en: "leaf", zh: "葉子(書刊的)張", pos: "n" }, { en: "marker", zh: "作記號的人", pos: "n" }, { en: "aloud", zh: "出聲地", pos: "adv" },
          { en: "album", zh: "相簿", pos: "n" }, { en: "article", zh: "文章", pos: "n" }, { en: "chapter", zh: "(書籍)章", pos: "n" },
          { en: "comic", zh: "漫畫", pos: "n" }, { en: "letter", zh: "信", pos: "n" }, { en: "typewriter", zh: "打字機", pos: "n" },
          { en: "title", zh: "標題", pos: "n" }, { en: "vocabulary", zh: "字彙", pos: "n" }, { en: "poem", zh: "詩", pos: "n" },
        ],
      },
      {
        n: 3, start: "2026-09-20", end: "2026-09-26",
        theme: "中秋與家人", grammar: ["情態動詞","連接詞"],
        words: [
          { en: "mid-autumn festival", zh: "中秋節", pos: "n" }, { en: "moon cake", zh: "月餅", pos: "n" }, { en: "lantern festival", zh: "元宵節", pos: "n" },
          { en: "dragon-boat festival", zh: "端午節", pos: "n" }, { en: "family name", zh: "姓", pos: "n" }, { en: "parent", zh: "父母", pos: "n" },
          { en: "granddaughter", zh: "孫女", pos: "n" }, { en: "grandson", zh: "孫子", pos: "n" }, { en: "housewife", zh: "家庭婦女", pos: "n" },
          { en: "housework", zh: "家務勞動", pos: "n" }, { en: "mother's day", zh: "母親節", pos: "n" }, { en: "daughter", zh: "女兒", pos: "n" },
          { en: "husband", zh: "丈夫", pos: "n" }, { en: "wife", zh: "妻子", pos: "n" }, { en: "mom", zh: "媽媽", pos: "n" },
          { en: "mommy", zh: "媽咪", pos: "n" }, { en: "visitor", zh: "參觀者", pos: "n" }, { en: "guest", zh: "客人", pos: "n" },
          { en: "party", zh: "聚會", pos: "n" }, { en: "supper", zh: "晚餐", pos: "n" }, { en: "present", zh: "禮物", pos: "n" },
          { en: "temple", zh: "神殿", pos: "n" }, { en: "altogether", zh: "總共", pos: "adv" }, { en: "barbecue", zh: "吃烤燒肉的野餐", pos: "n" },
          { en: "lantern", zh: "燈籠", pos: "n" }, { en: "homesick", zh: "想家的", pos: "adj" }, { en: "meal", zh: "餐", pos: "n" },
          { en: "couple", zh: "夫妻", pos: "n" }, { en: "nephew", zh: "侄子", pos: "n" }, { en: "niece", zh: "侄女", pos: "n" },
        ],
      },
      {
        n: 4, start: "2026-09-27", end: "2026-10-03",
        theme: "朋友與情緒", grammar: ["情態動詞","連接詞"],
        words: [
          { en: "afraid", zh: "害怕的", pos: "adj" }, { en: "angry", zh: "生氣的", pos: "adj" }, { en: "alone", zh: "單獨的", pos: "adj" },
          { en: "feeling", zh: "感覺", pos: "n" }, { en: "fight", zh: "作戰", pos: "v" }, { en: "smile", zh: "微笑", pos: "v" },
          { en: "sorry", zh: "抱歉的", pos: "adj" }, { en: "unhappy", zh: "不快樂的", pos: "adj" }, { en: "unfriendly", zh: "不友善地", pos: "adj" },
          { en: "care", zh: "關心", pos: "v" }, { en: "careless", zh: "不注意的", pos: "adj" }, { en: "shout", zh: "呼喊", pos: "v" },
          { en: "voice", zh: "聲音", pos: "n" }, { en: "glad", zh: "高興的", pos: "adj" }, { en: "calm", zh: "平靜的", pos: "adj" },
          { en: "crazy", zh: "瘋狂的", pos: "adj" }, { en: "lovely", zh: "可愛的", pos: "adj" }, { en: "impolite", zh: "無禮的", pos: "adj" },
          { en: "rude", zh: "無禮的", pos: "adj" }, { en: "joke", zh: "笑話", pos: "n" }, { en: "welcome", zh: "歡迎", pos: "v" },
          { en: "pardon", zh: "原諒", pos: "v" }, { en: "argue", zh: "爭論", pos: "v" }, { en: "bored", zh: "無聊的", pos: "adj" },
          { en: "boring", zh: "無聊的", pos: "adj" }, { en: "excited", zh: "興奮的", pos: "adj" }, { en: "fear", zh: "害怕", pos: "n" },
          { en: "friendship", zh: "友誼", pos: "n" }, { en: "laugh", zh: "笑", pos: "v" }, { en: "nervous", zh: "神經緊張的", pos: "adj" },
        ],
      },
    ]
  },
  {
    month: "2026-10", label: "10 月", grammar: [
      { topic: "動名詞 / 不定詞", eng: "Gerund & Infinitive", file: "lessons/lesson_2026-07-08.html", icon: "🎯" }
    ], weeks: [
      {
        n: 1, start: "2026-10-04", end: "2026-10-10",
        theme: "運動與比賽", grammar: ["動名詞 / 不定詞"],
        words: [
          { en: "baseball", zh: "棒球", pos: "n" }, { en: "football", zh: "足球", pos: "n" }, { en: "softball", zh: "壘球", pos: "n" },
          { en: "volleyball", zh: "排球", pos: "n" }, { en: "tennis", zh: "網球", pos: "n" }, { en: "table tennis", zh: "乒乓球", pos: "n" },
          { en: "pingpong", zh: "乒乓球", pos: "n" }, { en: "dodge ball", zh: "躲避球", pos: "n" }, { en: "dodgeball", zh: "躲避球", pos: "n" },
          { en: "frisbee", zh: "飛盤", pos: "n" }, { en: "golf", zh: "高爾夫", pos: "n" }, { en: "gym", zh: "體操房", pos: "n" },
          { en: "jogging", zh: "慢跑", pos: "n" }, { en: "running", zh: "奔跑的", pos: "n" }, { en: "roller skate", zh: "溜冰鞋", pos: "n" },
          { en: "roller skating", zh: "輪式溜冰", pos: "n" }, { en: "skate", zh: "溜冰鞋", pos: "v" }, { en: "skating", zh: "滑冰", pos: "n" },
          { en: "ski", zh: "滑雪板", pos: "v" }, { en: "skiing", zh: "滑雪(運動)  滑雪", pos: "n" }, { en: "catch", zh: "接住", pos: "v" },
          { en: "winner", zh: "贏家", pos: "n" }, { en: "badminton", zh: "羽毛球", pos: "n" }, { en: "bowling", zh: "保齡球", pos: "n" },
          { en: "exercise", zh: "運動", pos: "n" }, { en: "physical education", zh: "體育", pos: "n" }, { en: "playground", zh: "操場", pos: "n" },
          { en: "team", zh: "隊伍", pos: "n" }, { en: "throw", zh: "扔", pos: "v" }, { en: "victory", zh: "勝利", pos: "n" },
        ],
      },
      {
        n: 2, start: "2026-10-11", end: "2026-10-17",
        theme: "身體與健康", grammar: ["動名詞 / 不定詞"],
        words: [
          { en: "asleep", zh: "睡覺的", pos: "adj" }, { en: "beard", zh: "鬍鬚", pos: "n" }, { en: "cough", zh: "咳嗽(v)  咳嗽", pos: "v" },
          { en: "doctor", zh: "醫生", pos: "n" }, { en: "eyebrow", zh: "眉毛", pos: "n" }, { en: "fever", zh: "發燒", pos: "n" },
          { en: "headache", zh: "頭痛", pos: "n" }, { en: "health", zh: "健康", pos: "n" }, { en: "heart", zh: "心臟", pos: "n" },
          { en: "ill", zh: "有病的", pos: "adj" }, { en: "nurse", zh: "護理師", pos: "n" }, { en: "pain", zh: "疼痛", pos: "n" },
          { en: "running nose", zh: "流鼻水", pos: "n" }, { en: "sick", zh: "生病的", pos: "adj" }, { en: "skin", zh: "皮(膚)  外皮", pos: "n" },
          { en: "sleepy", zh: "困乏的", pos: "adj" }, { en: "sore throat", zh: "喉嚨痛", pos: "n" }, { en: "stomachache", zh: "肚子痛", pos: "n" },
          { en: "throat", zh: "咽喉", pos: "n" }, { en: "tooth", zh: "牙齒", pos: "n" }, { en: "toothache", zh: "牙痛", pos: "n" },
          { en: "toothbrush", zh: "牙刷", pos: "n" }, { en: "ambulance", zh: "救護車", pos: "n" }, { en: "ankle", zh: "踝", pos: "n" },
          { en: "blood", zh: "血(液)  血統", pos: "n" }, { en: "brain", zh: "腦(袋)  智力", pos: "n" }, { en: "dentist", zh: "牙醫", pos: "n" },
          { en: "healthy", zh: "健康的", pos: "adj" }, { en: "illness", zh: "疾病", pos: "n" }, { en: "medicine", zh: "藥", pos: "n" },
        ],
      },
      {
        n: 3, start: "2026-10-18", end: "2026-10-24",
        theme: "食物與營養", grammar: ["動名詞 / 不定詞"],
        words: [
          { en: "bean", zh: "豆", pos: "n" }, { en: "cabbage", zh: "甘藍菜", pos: "n" }, { en: "carrot", zh: "胡蘿蔔", pos: "n" },
          { en: "cereal", zh: "穀物", pos: "n" }, { en: "cheese", zh: "起司", pos: "n" }, { en: "corn", zh: "穀物", pos: "n" },
          { en: "fast food", zh: "速食", pos: "n" }, { en: "fried chicken", zh: "炸雞", pos: "n" }, { en: "fried rice", zh: "炒飯", pos: "n" },
          { en: "grapefruit", zh: "葡萄柚(樹)", pos: "n" }, { en: "guava", zh: "蕃石榴", pos: "n" }, { en: "hamburger", zh: "漢堡", pos: "n" },
          { en: "instant noodle", zh: "速食麵", pos: "n" }, { en: "lettuce", zh: "萵苣", pos: "n" }, { en: "lunch box", zh: "午餐盒", pos: "n" },
          { en: "mango", zh: "芒果", pos: "n" }, { en: "milk shake", zh: "奶昔", pos: "n" }, { en: "noodle", zh: "麵條", pos: "n" },
          { en: "onion", zh: "洋蔥", pos: "n" }, { en: "potato", zh: "馬鈴薯", pos: "n" }, { en: "tofu", zh: "豆腐", pos: "n" },
          { en: "tomato", zh: "番茄", pos: "n" }, { en: "diet", zh: "通常所吃的食物", pos: "n" }, { en: "flour", zh: "麵粉", pos: "n" },
          { en: "honey", zh: "蜂蜜", pos: "n" }, { en: "loaf", zh: "一條(塊)麵包", pos: "n" }, { en: "meat", zh: "肉", pos: "n" },
          { en: "menu", zh: "菜單", pos: "n" }, { en: "vinegar", zh: "醋", pos: "n" }, { en: "hunger", zh: "饑餓", pos: "n" },
        ],
      },
      {
        n: 4, start: "2026-10-25", end: "2026-10-31",
        theme: "動物與棲地", grammar: ["動名詞 / 不定詞"],
        words: [
          { en: "bark", zh: "(狗等)吠", pos: "v" }, { en: "crab", zh: "蟹", pos: "n" }, { en: "deer", zh: "鹿", pos: "n" },
          { en: "dinosaur", zh: "恐龍", pos: "n" }, { en: "dolphin", zh: "海豚", pos: "n" }, { en: "donkey", zh: "驢子", pos: "n" },
          { en: "eagle", zh: "鷹", pos: "n" }, { en: "farm", zh: "農場", pos: "n" }, { en: "goat", zh: "山羊", pos: "n" },
          { en: "goose", zh: "鵝", pos: "n" }, { en: "hippopotamus", zh: "河馬", pos: "n" }, { en: "insect", zh: "昆蟲", pos: "n" },
          { en: "kangaroo", zh: "袋鼠", pos: "n" }, { en: "nest", zh: "巢", pos: "n" }, { en: "parrot", zh: "鸚鵡", pos: "n" },
          { en: "pigeon", zh: "鴿子", pos: "n" }, { en: "puppy", zh: "小狗", pos: "n" }, { en: "shark", zh: "鯊魚", pos: "n" },
          { en: "spider", zh: "蜘蛛", pos: "n" }, { en: "tail", zh: "尾巴", pos: "n" }, { en: "whale", zh: "鯨魚", pos: "n" },
          { en: "wolf", zh: "狼", pos: "n" }, { en: "bat", zh: "蝙蝠", pos: "n" }, { en: "bug", zh: "蟲", pos: "n" },
          { en: "cage", zh: "籠", pos: "n" }, { en: "cockroach", zh: "蟑螂", pos: "n" }, { en: "feather", zh: "羽毛", pos: "n" },
          { en: "field", zh: "田地", pos: "n" }, { en: "wild", zh: "野生的", pos: "adj" }, { en: "zebra", zh: "斑馬", pos: "n" },
        ],
      },
    ]
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
