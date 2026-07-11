// 世界城市卡 資料（一階：12 城護照＋前 3 城交流）。設計見 tools/_city_v2_final.md
// 語音：audio/city/<id>_name.mp3 / <id>_in.mp3 / <id>_lm.mp3 / <id>_visit.mp3（Kokoro）
const WORLD_CITIES = [
  { id: "taipei",    city: "Taipei",    country: "Taiwan",         flag: "🇹🇼", region: "亞洲",   landmark: "Taipei 101",            lmEmoji: "🏙️" },
  { id: "tokyo",     city: "Tokyo",     country: "Japan",          flag: "🇯🇵", region: "亞洲",   landmark: "Tokyo Tower",           lmEmoji: "🗼" },
  { id: "london",    city: "London",    country: "United Kingdom", flag: "🇬🇧", region: "歐洲",   landmark: "Big Ben",               lmEmoji: "🕰️" },
  { id: "seoul",     city: "Seoul",     country: "South Korea",    flag: "🇰🇷", region: "亞洲",   landmark: "N Seoul Tower",         lmEmoji: "🗼" },
  { id: "paris",     city: "Paris",     country: "France",         flag: "🇫🇷", region: "歐洲",   landmark: "Eiffel Tower",          lmEmoji: "🗼" },
  { id: "singapore", city: "Singapore", country: "Singapore",      flag: "🇸🇬", region: "亞洲",   landmark: "Merlion",               lmEmoji: "🦁" },
  { id: "newyork",   city: "New York",  country: "United States",  flag: "🇺🇸", region: "北美洲", landmark: "Statue of Liberty",     lmEmoji: "🗽" },
  { id: "bangkok",   city: "Bangkok",   country: "Thailand",       flag: "🇹🇭", region: "亞洲",   landmark: "Wat Arun",              lmEmoji: "🛕" },
  { id: "rome",      city: "Rome",      country: "Italy",          flag: "🇮🇹", region: "歐洲",   landmark: "Colosseum",             lmEmoji: "🏛️" },
  { id: "sydney",    city: "Sydney",    country: "Australia",      flag: "🇦🇺", region: "大洋洲", landmark: "Sydney Opera House",    lmEmoji: "🎭" },
  { id: "cairo",     city: "Cairo",     country: "Egypt",          flag: "🇪🇬", region: "非洲",   landmark: "Pyramids of Giza",      lmEmoji: "🔺" },
  { id: "rio",       city: "Rio",       country: "Brazil",         flag: "🇧🇷", region: "南美洲", landmark: "Christ the Redeemer",   lmEmoji: "⛰️" },
];

// 交流系統（一階只開放前 3 城）
const CITY_EXCHANGE = {
 "taipei": {
  "clue": "People here love a sweet drink with chewy pearls.",
  "clueZh": "這裡的人喜歡一種有 QQ 珍珠的甜飲料",
  "pref": "bubbletea",
  "cards": [
   {
    "id": "taipei_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🌙",
    "en": "Night Market",
    "zh": "夜市",
    "sent": "Night markets are famous in Taipei.",
    "sentZh": "夜市在台北很有名",
    "fact": "台北的夜市傍晚開到半夜，小吃、遊戲、衣服都有，是觀光客最愛。",
    "words": [
     "night",
     "market",
     "famous"
    ]
   },
   {
    "id": "taipei_lm2",
    "type": "landmark",
    "lv": 3,
    "emoji": "🏛️",
    "en": "National Palace Museum",
    "zh": "故宮博物院",
    "sent": "The National Palace Museum is in Taipei.",
    "sentZh": "故宮博物院在台北",
    "fact": "故宮收藏將近 70 萬件文物，翠玉白菜和肉形石最有名。",
    "words": [
     "museum",
     "palace",
     "national"
    ]
   },
   {
    "id": "taipei_person",
    "type": "person",
    "lv": 4,
    "emoji": "🎤",
    "en": "Teresa Teng",
    "zh": "鄧麗君",
    "sent": "Teresa Teng sang gentle songs across Asia.",
    "sentZh": "鄧麗君在亞洲各地演唱溫柔歌曲。",
    "fact": "鄧麗君出生於台灣，以清澈溫柔的歌聲聞名，華語與多種語言歌曲影響亞洲流行音樂。",
    "words": [
     "gentle",
     "song",
     "Asia"
    ],
    "era": "1953–1995",
    "field": "歌唱"
   }
  ]
 },
 "tokyo": {
  "clue": "A hot bowl of noodles is very famous here.",
  "clueZh": "這裡有一種很有名的熱湯麵",
  "pref": "ramen",
  "cards": [
   {
    "id": "tokyo_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🌸",
    "en": "Cherry Blossoms",
    "zh": "櫻花（花見）",
    "sent": "People enjoy cherry blossoms in spring.",
    "sentZh": "人們在春天賞櫻花",
    "fact": "春天全東京的公園開滿櫻花，大家會在樹下野餐，叫做「花見」。",
    "words": [
     "cherry",
     "blossom",
     "spring"
    ]
   },
   {
    "id": "tokyo_lm2",
    "type": "landmark",
    "lv": 3,
    "emoji": "⛩️",
    "en": "Senso-ji Temple",
    "zh": "淺草寺",
    "sent": "Senso-ji Temple is very old.",
    "sentZh": "淺草寺非常古老",
    "fact": "淺草寺已經超過 1300 年，大紅燈籠寫著「雷門」，是東京最老的寺廟。",
    "words": [
     "temple",
     "old",
     "gate"
    ]
   },
   {
    "id": "tokyo_person",
    "type": "person",
    "lv": 4,
    "emoji": "🎨",
    "en": "Hokusai",
    "zh": "葛飾北齋",
    "sent": "Hokusai painted the famous Great Wave.",
    "sentZh": "葛飾北齋畫了著名的《神奈川沖浪裏》。",
    "fact": "葛飾北齋出生於江戶，也就是今日東京，以浮世繪版畫聞名，《富嶽三十六景》影響世界藝術。",
    "words": [
     "paint",
     "famous",
     "wave"
    ],
    "era": "1760–1849",
    "field": "浮世繪"
   }
  ]
 },
 "london": {
  "clue": "People here enjoy a warm drink in the afternoon.",
  "clueZh": "這裡的人喜歡在下午喝一種溫熱的飲料",
  "pref": "tea",
  "cards": [
   {
    "id": "london_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🚌",
    "en": "Double-decker Bus",
    "zh": "紅色雙層巴士",
    "sent": "Red double-decker buses run in London.",
    "sentZh": "紅色雙層巴士在倫敦跑",
    "fact": "倫敦的紅色雙層巴士超過 100 年歷史，坐上層第一排看街景最棒。",
    "words": [
     "bus",
     "red",
     "ride"
    ]
   },
   {
    "id": "london_lm2",
    "type": "landmark",
    "lv": 3,
    "emoji": "🌉",
    "en": "Tower Bridge",
    "zh": "倫敦塔橋",
    "sent": "Tower Bridge opens for ships.",
    "sentZh": "塔橋會打開讓船通過",
    "fact": "塔橋中間可以像翅膀一樣升起，讓大船從泰晤士河通過。",
    "words": [
     "bridge",
     "tower",
     "ship"
    ]
   },
   {
    "id": "london_person",
    "type": "person",
    "lv": 4,
    "emoji": "✒️",
    "en": "William Shakespeare",
    "zh": "威廉・莎士比亞",
    "sent": "Shakespeare wrote plays for London theaters.",
    "sentZh": "莎士比亞為倫敦劇院創作戲劇。",
    "fact": "莎士比亞在倫敦從事演員與劇作工作，作品包括《哈姆雷特》和《仲夏夜之夢》，至今仍常被演出。",
    "words": [
     "write",
     "play",
     "theater"
    ],
    "era": "1564–1616",
    "field": "戲劇與文學"
   }
  ]
 },
 "seoul": {
  "clue": "Traditional palaces meet bright K-pop streets here.",
  "clueZh": "傳統宮殿與閃亮的韓流街道在此相遇。",
  "pref": "bookmark",
  "cards": [
   {
    "id": "seoul_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "👘",
    "en": "Hanbok",
    "zh": "韓服",
    "sent": "People wear colorful hanbok on special days.",
    "sentZh": "人們在特別的日子穿上彩色韓服。",
    "fact": "韓服以鮮明色彩和優雅線條聞名，現今韓國人常在節慶、婚禮或參觀宮殿時穿著。",
    "words": [
     "colorful",
     "wear",
     "special"
    ]
   },
   {
    "id": "seoul_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🏯",
    "en": "Gyeongbokgung Palace",
    "zh": "景福宮",
    "sent": "Guards march beside the grand palace gates.",
    "sentZh": "衛兵在宏偉的宮門旁行進。",
    "fact": "景福宮建於一三九五年，是首爾重要的朝鮮王朝宮殿，遊客能欣賞傳統建築與守門將換崗。",
    "words": [
     "guard",
     "palace",
     "gate"
    ]
   },
   {
    "id": "seoul_person",
    "type": "person",
    "lv": 4,
    "emoji": "🔤",
    "en": "King Sejong",
    "zh": "世宗大王",
    "sent": "King Sejong helped create the Korean alphabet.",
    "sentZh": "世宗大王協助創製韓文字母。",
    "fact": "世宗大王在朝鮮王朝時期推動創製訓民正音，讓一般百姓更容易閱讀與書寫，深刻影響韓國文化。",
    "words": [
     "create",
     "alphabet",
     "help"
    ],
    "era": "1397–1450",
    "field": "語文與教育"
   }
  ]
 },
 "paris": {
  "clue": "Artists and cafés line a famous European river.",
  "clueZh": "藝術家與咖啡館排列在一條著名歐洲河流旁。",
  "pref": "baguette",
  "cards": [
   {
    "id": "paris_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🎨",
    "en": "Seine Riverside",
    "zh": "塞納河畔文化",
    "sent": "Booksellers share old stories beside the Seine.",
    "sentZh": "書商在塞納河畔分享古老故事。",
    "fact": "塞納河穿過巴黎，河岸有歷史悠久的綠色書攤，販售舊書、海報與明信片，形成獨特風景。",
    "words": [
     "bookseller",
     "river",
     "story"
    ]
   },
   {
    "id": "paris_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🖼️",
    "en": "Louvre Museum",
    "zh": "羅浮宮",
    "sent": "The Louvre protects art from many centuries.",
    "sentZh": "羅浮宮保存許多世紀的藝術品。",
    "fact": "羅浮宮原是王宮，後來成為世界知名博物館，收藏《蒙娜麗莎》等珍品，入口有玻璃金字塔。",
    "words": [
     "museum",
     "protect",
     "century"
    ]
   },
   {
    "id": "paris_person",
    "type": "person",
    "lv": 4,
    "emoji": "🎨",
    "en": "Claude Monet",
    "zh": "克勞德・莫內",
    "sent": "Monet painted changing light around Paris.",
    "sentZh": "莫內描繪巴黎周邊變化的光線。",
    "fact": "莫內是法國印象派重要畫家，曾在巴黎學習與創作，常用色彩和短筆觸捕捉光線瞬間的變化。",
    "words": [
     "light",
     "paint",
     "change"
    ],
    "era": "1840–1926",
    "field": "繪畫"
   }
  ]
 },
 "singapore": {
  "clue": "A lion legend watches over this island city.",
  "clueZh": "一則獅子傳說守望著這座島嶼城市。",
  "pref": "orchid",
  "cards": [
   {
    "id": "singapore_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🦁",
    "en": "Merlion Legend",
    "zh": "魚尾獅傳說",
    "sent": "The Merlion joins a lion and fish.",
    "sentZh": "魚尾獅結合了獅子與魚。",
    "fact": "魚尾代表新加坡早期的漁村歷史，獅頭則呼應傳說中的獅子城名稱，如今是著名城市象徵。",
    "words": [
     "legend",
     "lion",
     "fish"
    ]
   },
   {
    "id": "singapore_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🌳",
    "en": "Gardens by the Bay",
    "zh": "濱海灣花園",
    "sent": "Giant tree towers glow beautifully after sunset.",
    "sentZh": "巨大的樹塔在日落後美麗發光。",
    "fact": "濱海灣花園以擎天樹和大型溫室聞名，展示世界各地植物，也運用環保科技收集能源與雨水。",
    "words": [
     "giant",
     "glow",
     "garden"
    ]
   },
   {
    "id": "singapore_person",
    "type": "person",
    "lv": 4,
    "emoji": "🎻",
    "en": "Goh Soon Tioe",
    "zh": "吳順籌",
    "sent": "Goh Soon Tioe taught young Singapore musicians.",
    "sentZh": "吳順籌教導年輕的新加坡音樂家。",
    "fact": "吳順籌是新加坡小提琴家與音樂教育家，培養許多年輕演奏者，也協助推動當地古典音樂發展。",
    "words": [
     "teach",
     "young",
     "musician"
    ],
    "era": "1911–1982",
    "field": "音樂教育"
   }
  ]
 },
 "newyork": {
  "clue": "Yellow taxis rush past theaters and towering buildings.",
  "clueZh": "黃色計程車飛馳過劇院與高聳建築。",
  "pref": "bagel",
  "cards": [
   {
    "id": "newyork_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🎭",
    "en": "Broadway",
    "zh": "百老匯",
    "sent": "Broadway actors sing and dance on stage.",
    "sentZh": "百老匯演員在舞台上唱歌跳舞。",
    "fact": "百老匯是紐約著名的劇院區，聚集許多大型音樂劇與舞台劇，明亮招牌讓夜晚格外熱鬧。",
    "words": [
     "actor",
     "stage",
     "dance"
    ]
   },
   {
    "id": "newyork_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🌳",
    "en": "Central Park",
    "zh": "中央公園",
    "sent": "Families picnic beside lakes in Central Park.",
    "sentZh": "家庭在中央公園的湖邊野餐。",
    "fact": "中央公園是曼哈頓的大型城市綠地，園內有湖泊、草地、步道與遊樂場，讓居民親近自然。",
    "words": [
     "picnic",
     "lake",
     "park"
    ]
   },
   {
    "id": "newyork_person",
    "type": "person",
    "lv": 4,
    "emoji": "🎺",
    "en": "Louis Armstrong",
    "zh": "路易斯・阿姆斯壯",
    "sent": "Armstrong filled New York clubs with jazz.",
    "sentZh": "阿姆斯壯讓紐約俱樂部充滿爵士樂。",
    "fact": "阿姆斯壯是爵士樂先驅，成年後長居紐約皇后區，以小號演奏和獨特歌聲推動爵士樂走向世界。",
    "words": [
     "jazz",
     "club",
     "trumpet"
    ],
    "era": "1901–1971",
    "field": "爵士音樂"
   }
  ]
 },
 "bangkok": {
  "clue": "Golden temples shine beside busy canals and markets.",
  "clueZh": "金色寺廟在繁忙運河與市場旁閃耀。",
  "pref": "jasmine",
  "cards": [
   {
    "id": "bangkok_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🛶",
    "en": "Floating Market",
    "zh": "水上市場",
    "sent": "Vendors sell fresh fruit from small boats.",
    "sentZh": "攤販從小船上販售新鮮水果。",
    "fact": "曼谷周邊的水上市場保留運河生活特色，商販划船販售水果、熟食與花朵，呈現熱鬧水上交易。",
    "words": [
     "vendor",
     "fresh",
     "boat"
    ]
   },
   {
    "id": "bangkok_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🏯",
    "en": "Grand Palace",
    "zh": "大皇宮",
    "sent": "Golden roofs sparkle inside the Grand Palace.",
    "sentZh": "金色屋頂在大皇宮內閃閃發光。",
    "fact": "大皇宮建於十八世紀，建築融合泰國傳統藝術與精緻裝飾，園區內也有著名的玉佛寺。",
    "words": [
     "golden",
     "roof",
     "sparkle"
    ]
   },
   {
    "id": "bangkok_person",
    "type": "person",
    "lv": 4,
    "emoji": "📚",
    "en": "Sunthorn Phu",
    "zh": "順吞鋪",
    "sent": "Sunthorn Phu wrote poems loved across Thailand.",
    "sentZh": "順吞鋪創作深受泰國喜愛的詩歌。",
    "fact": "順吞鋪是泰國重要詩人，曾在曼谷生活與任職，作品語言生動，其中長篇故事《帕阿派瑪尼》廣為流傳。",
    "words": [
     "poem",
     "write",
     "love"
    ],
    "era": "1786–1855",
    "field": "詩歌與文學"
   }
  ]
 },
 "rome": {
  "clue": "Ancient roads lead to fountains and lively squares.",
  "clueZh": "古老道路通往噴泉與熱鬧廣場。",
  "pref": "gelato",
  "cards": [
   {
    "id": "rome_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🏟️",
    "en": "Roman Spectacles",
    "zh": "古羅馬競技文化",
    "sent": "Crowds once watched contests in huge arenas.",
    "sentZh": "人群曾在巨大競技場觀看比賽。",
    "fact": "古羅馬人會在大型圓形競技場觀看競賽與表演，座位依社會身分安排，活動常吸引大量觀眾。",
    "words": [
     "crowd",
     "contest",
     "arena"
    ]
   },
   {
    "id": "rome_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "⛲",
    "en": "Trevi Fountain",
    "zh": "特雷維噴泉",
    "sent": "Visitors toss coins into the bright fountain.",
    "sentZh": "遊客把硬幣投進明亮的噴泉。",
    "fact": "特雷維噴泉是羅馬最大的巴洛克式噴泉，雕像描繪海洋主題，投幣許願是廣為流傳的傳統。",
    "words": [
     "toss",
     "coin",
     "fountain"
    ]
   },
   {
    "id": "rome_person",
    "type": "person",
    "lv": 4,
    "emoji": "🎬",
    "en": "Federico Fellini",
    "zh": "費德里柯・費里尼",
    "sent": "Fellini made imaginative films about Roman life.",
    "sentZh": "費里尼拍攝充滿想像力的羅馬生活電影。",
    "fact": "費里尼長期在羅馬生活與工作，以富想像力的電影語言聞名，《甜蜜的生活》留下經典的羅馬影像。",
    "words": [
     "film",
     "imaginative",
     "life"
    ],
    "era": "1920–1993",
    "field": "電影"
   }
  ]
 },
 "sydney": {
  "clue": "Ocean waves curl near a sail-shaped landmark.",
  "clueZh": "海浪在一座帆形地標附近捲起。",
  "pref": "surfboard",
  "cards": [
   {
    "id": "sydney_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🏄",
    "en": "Surfing Culture",
    "zh": "衝浪文化",
    "sent": "Surfers ride blue waves along Sydney beaches.",
    "sentZh": "衝浪者在雪梨海灘乘著藍色浪花。",
    "fact": "雪梨擁有眾多海灘，衝浪是當地受歡迎的戶外活動；人們也重視水上安全與海灘救生文化。",
    "words": [
     "surfer",
     "ride",
     "wave"
    ]
   },
   {
    "id": "sydney_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🏖️",
    "en": "Bondi Beach",
    "zh": "邦代海灘",
    "sent": "Swimmers enjoy golden sand at Bondi Beach.",
    "sentZh": "游泳者在邦代海灘享受金色沙灘。",
    "fact": "邦代海灘以金色沙灘和海浪聞名，是雪梨代表性海灘；沿岸步道可欣賞壯闊的太平洋景色。",
    "words": [
     "swimmer",
     "sand",
     "beach"
    ]
   },
   {
    "id": "sydney_person",
    "type": "person",
    "lv": 4,
    "emoji": "🐊",
    "en": "Steve Irwin",
    "zh": "史蒂夫・厄文",
    "sent": "Steve Irwin taught families about wild animals.",
    "sentZh": "史蒂夫・厄文教導家庭認識野生動物。",
    "fact": "史蒂夫・厄文出生於澳洲，透過電視節目介紹野生動物與保育；他的活力讓許多孩子關心自然。",
    "words": [
     "wild",
     "animal",
     "teach"
    ],
    "era": "1962–2006",
    "field": "野生動物保育"
   }
  ]
 },
 "cairo": {
  "clue": "Desert history rises beside a life-giving river.",
  "clueZh": "沙漠歷史在一條孕育生命的河流旁升起。",
  "pref": "papyrus",
  "cards": [
   {
    "id": "cairo_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🚤",
    "en": "Life along the Nile",
    "zh": "尼羅河文化",
    "sent": "Farmers grow crops beside the long Nile.",
    "sentZh": "農民在長長的尼羅河旁種植作物。",
    "fact": "尼羅河為乾燥的埃及帶來水源與沃土，古埃及農業、交通和曆法都與河水的季節變化密切相關。",
    "words": [
     "farmer",
     "crop",
     "river"
    ]
   },
   {
    "id": "cairo_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🏺",
    "en": "Egyptian Museum",
    "zh": "埃及博物館",
    "sent": "Ancient treasures tell stories inside this museum.",
    "sentZh": "古代珍寶在這座博物館裡訴說故事。",
    "fact": "開羅的埃及博物館收藏大量古埃及文物，包括雕像、棺木與日常用品，幫助人們認識古老文明。",
    "words": [
     "ancient",
     "treasure",
     "museum"
    ]
   },
   {
    "id": "cairo_person",
    "type": "person",
    "lv": 4,
    "emoji": "👑",
    "en": "Tutankhamun",
    "zh": "圖坦卡門",
    "sent": "Tutankhamun became pharaoh when he was young.",
    "sentZh": "圖坦卡門年幼時成為法老。",
    "fact": "圖坦卡門是古埃及少年法老，他的陵墓保存許多珍貴文物；相關收藏長期是開羅埃及學研究焦點。",
    "words": [
     "pharaoh",
     "young",
     "tomb"
    ],
    "era": "約西元前1341–1323年",
    "field": "古埃及歷史"
   }
  ]
 },
 "rio": {
  "clue": "Music and mountains brighten this coastal Brazilian city.",
  "clueZh": "音樂與群山照亮這座巴西海岸城市。",
  "pref": "carnivalmask",
  "cards": [
   {
    "id": "rio_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🥁",
    "en": "Samba Carnival",
    "zh": "森巴嘉年華",
    "sent": "Samba dancers fill the streets with rhythm.",
    "sentZh": "森巴舞者用節奏充滿街道。",
    "fact": "里約嘉年華以森巴遊行、華麗服裝和鼓樂聞名，各森巴學校長期排練，在遊行大道展現故事主題。",
    "words": [
     "rhythm",
     "dancer",
     "street"
    ]
   },
   {
    "id": "rio_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "⛰️",
    "en": "Sugarloaf Mountain",
    "zh": "糖麵包山",
    "sent": "Cable cars climb above Rio's blue bay.",
    "sentZh": "纜車爬上里約藍色海灣的上方。",
    "fact": "糖麵包山矗立在瓜納巴拉灣旁，外形圓潤獨特，遊客可搭乘纜車登高欣賞里約城市與海岸。",
    "words": [
     "cable car",
     "climb",
     "bay"
    ]
   },
   {
    "id": "rio_person",
    "type": "person",
    "lv": 4,
    "emoji": "🎶",
    "en": "Pixinguinha",
    "zh": "皮辛吉尼亞",
    "sent": "Pixinguinha brought joyful choro music to Rio.",
    "sentZh": "皮辛吉尼亞把歡樂的紹羅音樂帶到里約。",
    "fact": "皮辛吉尼亞出生於里約，是巴西重要作曲家與長笛演奏家，他豐富了紹羅樂，影響後來的巴西音樂。",
    "words": [
     "joyful",
     "music",
     "flute"
    ],
    "era": "1897–1973",
    "field": "巴西音樂"
   }
  ]
 }
};

// 禮物池（送禮時出 3 選 1：含該城偏好 1 個＋隨機 2 個）
const CITY_GIFTS = [
 {
  "id": "bubbletea",
  "emoji": "🧋",
  "en": "bubble tea",
  "zh": "珍珠奶茶"
 },
 {
  "id": "ramen",
  "emoji": "🍜",
  "en": "ramen",
  "zh": "拉麵"
 },
 {
  "id": "tea",
  "emoji": "☕",
  "en": "afternoon tea",
  "zh": "下午茶"
 },
 {
  "id": "kite",
  "emoji": "🪁",
  "en": "kite",
  "zh": "風箏"
 },
 {
  "id": "orchid",
  "emoji": "🌸",
  "en": "orchid",
  "zh": "蘭花"
 },
 {
  "id": "baguette",
  "emoji": "🥖",
  "en": "baguette",
  "zh": "法國麵包"
 },
 {
  "id": "gelato",
  "emoji": "🍨",
  "en": "gelato",
  "zh": "義式冰淇淋"
 },
 {
  "id": "bagel",
  "emoji": "🥯",
  "en": "bagel",
  "zh": "貝果"
 },
 {
  "id": "surfboard",
  "emoji": "🏄",
  "en": "surfboard",
  "zh": "衝浪板"
 },
 {
  "id": "bookmark",
  "emoji": "🔖",
  "en": "bookmark",
  "zh": "書籤"
 },
 {
  "id": "jasmine",
  "emoji": "💮",
  "en": "jasmine garland",
  "zh": "茉莉花環"
 },
 {
  "id": "papyrus",
  "emoji": "📜",
  "en": "papyrus",
  "zh": "紙莎草"
 },
 {
  "id": "carnivalmask",
  "emoji": "🎭",
  "en": "carnival mask",
  "zh": "嘉年華面具"
 }
];

// 好感度常數（Codex 對齊數值）
const FRIEND_LV = [0, 50, 125, 225, 350, 500];   // 二階全開 Lv5
const FRIEND_CAP_CITY = 35, FRIEND_CAP_DAY = 100;
const GIFT_COST = 80, GIFT_PTS = 7, GIFT_PREF_PTS = 11, GIFT_PTS_CAP = 12;
const GREET_PTS = 3, ACT_COST = 100, ACT_PTS = [0, 8, 14, 20];
const EXCHANGE_OPEN = WORLD_CITIES.map(c => c.id);   // 二階：全 12 城開放交流

if (typeof module !== "undefined" && module.exports)
  module.exports = { WORLD_CITIES, CITY_EXCHANGE, CITY_GIFTS, FRIEND_LV, EXCHANGE_OPEN };
