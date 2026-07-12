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
  { id: "hongkong", city: "Hong Kong", country: "Hong Kong SAR, China", flag: "🇭🇰", region: "亞洲", landmark: "Victoria Peak", lmEmoji: "⛰️" },
  { id: "mumbai", city: "Mumbai", country: "India", flag: "🇮🇳", region: "亞洲", landmark: "Gateway of India", lmEmoji: "🚪" },
  { id: "berlin", city: "Berlin", country: "Germany", flag: "🇩🇪", region: "歐洲", landmark: "Brandenburg Gate", lmEmoji: "🏛️" },
  { id: "athens", city: "Athens", country: "Greece", flag: "🇬🇷", region: "歐洲", landmark: "The Parthenon", lmEmoji: "🏛️" },
  { id: "toronto", city: "Toronto", country: "Canada", flag: "🇨🇦", region: "北美洲", landmark: "CN Tower", lmEmoji: "🗼" },
  { id: "auckland", city: "Auckland", country: "New Zealand", flag: "🇳🇿", region: "大洋洲", landmark: "Sky Tower", lmEmoji: "🗼" },
  { id: "madrid", city: "Madrid", country: "Spain", flag: "🇪🇸", region: "歐洲", landmark: "Royal Palace of Madrid", lmEmoji: "🏰" },
  { id: "amsterdam", city: "Amsterdam", country: "Netherlands", flag: "🇳🇱", region: "歐洲", landmark: "Amsterdam Canals", lmEmoji: "🚤" },
  { id: "mexico_city", city: "Mexico City", country: "Mexico", flag: "🇲🇽", region: "北美洲", landmark: "Angel of Independence", lmEmoji: "🗽" },
  { id: "cape_town", city: "Cape Town", country: "South Africa", flag: "🇿🇦", region: "非洲", landmark: "Table Mountain", lmEmoji: "⛰️" },
  { id: "buenos_aires", city: "Buenos Aires", country: "Argentina", flag: "🇦🇷", region: "南美洲", landmark: "Obelisco", lmEmoji: "🗼" },
  { id: "beijing", city: "Beijing", country: "China", flag: "🇨🇳", region: "亞洲", landmark: "The Great Wall", lmEmoji: "🧱" },
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
    "emoji": "✍️",
    "en": "Lin Yutang",
    "zh": "林語堂",
    "sent": "Lin Yutang wrote famous books in English.",
    "sentZh": "林語堂用英文寫出著名的書。",
    "fact": "林語堂是聞名世界的作家與發明家，用英文向世界介紹中華文化，晚年住在台北陽明山，故居現在是紀念館。",
    "words": [
        "write",
        "book",
        "English"
    ],
    "era": "1895–1976",
    "field": "文學"
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
 },
 "hongkong": {
  "clue": "Harbor ferries glide beneath a dazzling mountain skyline.",
  "clueZh": "港灣渡輪在璀璨的山城天際線下穿梭。",
  "pref": "bubbletea",
  "cards": [
   {
    "id": "hongkong_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🥟",
    "en": "Dim Sum",
    "zh": "點心",
    "sent": "Families share small dim sum dishes at tea.",
    "sentZh": "家人喝茶時一起分享小份點心。",
    "fact": "香港茶樓的點心種類豐富，人們常與親友圍桌喝茶，分享蒸籠中的蝦餃、燒賣和叉燒包。",
    "words": [
     "family",
     "share",
     "dish"
    ]
   },
   {
    "id": "hongkong_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "⛴️",
    "en": "Star Ferry",
    "zh": "天星小輪",
    "sent": "The green ferry crosses the busy harbor.",
    "sentZh": "綠色渡輪穿越繁忙的港灣。",
    "fact": "天星小輪自十九世紀起往返維多利亞港兩岸，至今仍是市民通勤和遊客賞景的經典交通工具。",
    "words": [
     "ferry",
     "cross",
     "harbor"
    ]
   },
   {
    "id": "hongkong_person",
    "type": "person",
    "lv": 4,
    "emoji": "🥋",
    "en": "Bruce Lee",
    "zh": "李小龍",
    "sent": "Bruce Lee shared martial arts through exciting films.",
    "sentZh": "李小龍透過精彩電影推廣武術。",
    "fact": "李小龍在香港成長並投身電影，以敏捷身手和武術理念享譽世界，也促進不同文化對中國功夫的認識。",
    "words": [
     "martial",
     "film",
     "share"
    ],
    "era": "1940–1973",
    "field": "武術與電影"
   }
  ]
 },
 "mumbai": {
  "clue": "Colorful films and crowded trains energize this seaside metropolis.",
  "clueZh": "繽紛電影與擁擠列車為這座海濱大城注入活力。",
  "pref": "tea",
  "cards": [
   {
    "id": "mumbai_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🎬",
    "en": "Bollywood",
    "zh": "寶萊塢",
    "sent": "Dancers fill musical films with color and joy.",
    "sentZh": "舞者讓歌舞電影充滿色彩與歡樂。",
    "fact": "孟買是印度印地語電影產業的重要中心，許多寶萊塢作品融合歌曲、舞蹈、戲劇與鮮明服裝。",
    "words": [
     "dancer",
     "musical",
     "joy"
    ]
   },
   {
    "id": "mumbai_landmark",
    "type": "landmark",
    "lv": 3,
    "emoji": "🚉",
    "en": "Chhatrapati Shivaji Terminus",
    "zh": "賈特拉帕蒂·希瓦吉終點站",
    "sent": "Busy trains arrive beneath grand stone arches.",
    "sentZh": "繁忙列車駛入宏偉的石拱門下。",
    "fact": "這座歷史車站融合維多利亞哥德式與印度建築元素，華麗外觀下每天仍有大量通勤列車進出。",
    "words": [
     "train",
     "stone",
     "arch"
    ]
   },
   {
    "id": "mumbai_person",
    "type": "person",
    "lv": 4,
    "emoji": "🎤",
    "en": "Lata Mangeshkar",
    "zh": "拉塔·曼吉茜卡",
    "sent": "Lata sang thousands of songs for Indian films.",
    "sentZh": "拉塔為印度電影演唱了數千首歌曲。",
    "fact": "拉塔·曼吉茜卡長年在孟買錄製電影歌曲，以清亮歌聲跨越多種印度語言，成為極具影響力的歌手。",
    "words": [
     "sing",
     "song",
     "thousand"
    ],
    "era": "1929–2022",
    "field": "歌唱與電影音樂"
   }
  ]
 },
 "berlin": {
  "clue": "History, art, and music thrive beside a once-divided wall.",
  "clueZh": "歷史、藝術與音樂在昔日分隔城市的圍牆旁蓬勃發展。",
  "pref": "bookmark",
  "cards": [
   {
    "id": "berlin_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🎨",
    "en": "Street Art",
    "zh": "街頭藝術",
    "sent": "Artists paint bold stories across city walls.",
    "sentZh": "藝術家在城市牆面畫下鮮明故事。",
    "fact": "柏林擁有活躍的街頭藝術文化，牆面上的大型彩繪常以創意圖像表達歷史、自由與社會觀察。",
    "words": [
     "artist",
     "paint",
     "wall"
    ]
   },
   {
    "id": "berlin_landmark",
    "type": "landmark",
    "lv": 3,
    "emoji": "🏺",
    "en": "Museum Island",
    "zh": "博物館島",
    "sent": "Five museums protect treasures beside the river.",
    "sentZh": "五座博物館在河畔守護珍貴文物。",
    "fact": "博物館島位於施普雷河上，聚集五座重要博物館，收藏跨越古代文明、藝術與歐洲歷史的珍品。",
    "words": [
     "museum",
     "protect",
     "treasure"
    ]
   },
   {
    "id": "berlin_person",
    "type": "person",
    "lv": 4,
    "emoji": "🧠",
    "en": "Albert Einstein",
    "zh": "阿爾伯特·愛因斯坦",
    "sent": "Einstein explored light, space, time, and energy.",
    "sentZh": "愛因斯坦探索光、空間、時間與能量。",
    "fact": "愛因斯坦曾在柏林研究與任教，提出影響深遠的物理理論，幫助人類重新理解時間、空間和重力。",
    "words": [
     "explore",
     "space",
     "energy"
    ],
    "era": "1879–1955",
    "field": "物理學"
   }
  ]
 },
 "athens": {
  "clue": "Ancient columns overlook lively streets near the blue Aegean.",
  "clueZh": "古老石柱俯瞰鄰近蔚藍愛琴海的熱鬧街道。",
  "pref": "bookmark",
  "cards": [
   {
    "id": "athens_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🎭",
    "en": "Ancient Theater",
    "zh": "古希臘戲劇",
    "sent": "Actors told powerful stories behind painted masks.",
    "sentZh": "演員戴著彩繪面具講述動人的故事。",
    "fact": "古代雅典人會在露天劇場欣賞悲劇與喜劇，演員運用面具、歌唱和對話，把故事傳給廣大觀眾。",
    "words": [
     "actor",
     "story",
     "mask"
    ]
   },
   {
    "id": "athens_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🏟️",
    "en": "Panathenaic Stadium",
    "zh": "帕那辛納克體育場",
    "sent": "White marble seats surround the long running track.",
    "sentZh": "白色大理石座位環繞著長跑道。",
    "fact": "帕那辛納克體育場以白色大理石建成，曾舉辦古代競賽，也見證一八九六年首屆現代奧運會。",
    "words": [
     "marble",
     "seat",
     "track"
    ]
   },
   {
    "id": "athens_person",
    "type": "person",
    "lv": 4,
    "emoji": "📚",
    "en": "Aristotle",
    "zh": "亞里斯多德",
    "sent": "Aristotle studied nature, ideas, language, and living things.",
    "sentZh": "亞里斯多德研究自然、思想、語言與生物。",
    "fact": "亞里斯多德曾在雅典求學並創辦學園，他廣泛研究邏輯、自然和倫理，深深影響後世教育與科學思考。",
    "words": [
     "study",
     "nature",
     "idea"
    ],
    "era": "384–322 BCE",
    "field": "哲學與科學"
   }
  ]
 },
 "toronto": {
  "clue": "Many languages mingle beside a vast freshwater lake.",
  "clueZh": "多種語言在遼闊的淡水湖畔交會。",
  "pref": "bagel",
  "cards": [
   {
    "id": "toronto_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🌍",
    "en": "Multicultural Festivals",
    "zh": "多元文化節慶",
    "sent": "Neighbors share music, food, and dances from everywhere.",
    "sentZh": "鄰居分享來自世界各地的音樂、美食與舞蹈。",
    "fact": "多倫多居民來自世界各地，城市常以節慶、遊行和市集分享不同社群的音樂、飲食與傳統。",
    "words": [
     "neighbor",
     "music",
     "everywhere"
    ]
   },
   {
    "id": "toronto_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🏰",
    "en": "Casa Loma",
    "zh": "卡薩羅馬城堡",
    "sent": "Secret passages wind through this hilltop castle.",
    "sentZh": "祕密通道蜿蜒穿過這座山丘城堡。",
    "fact": "卡薩羅馬建於二十世紀初，擁有塔樓、祕密通道和華麗房間，如今是介紹多倫多歷史的博物館。",
    "words": [
     "secret",
     "passage",
     "castle"
    ]
   },
   {
    "id": "toronto_person",
    "type": "person",
    "lv": 4,
    "emoji": "🏃",
    "en": "Terry Fox",
    "zh": "泰瑞·福克斯",
    "sent": "Terry ran across Canada to support cancer research.",
    "sentZh": "泰瑞跑步橫越加拿大以支持癌症研究。",
    "fact": "泰瑞·福克斯在多倫多附近結束希望馬拉松，他以義肢長跑為癌症研究募款，勇氣至今鼓舞無數人。",
    "words": [
     "run",
     "support",
     "research"
    ],
    "era": "1958–1981",
    "field": "運動與公益"
   }
  ]
 },
 "auckland": {
  "clue": "Sailboats cross volcanic harbors in this breezy island city.",
  "clueZh": "帆船穿越火山環抱的港灣，駛過這座微風島城。",
  "pref": "surfboard",
  "cards": [
   {
    "id": "auckland_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🛶",
    "en": "Waka Ama",
    "zh": "毛利支架獨木舟",
    "sent": "Teams paddle long canoes together across the harbor.",
    "sentZh": "隊伍齊心划著長舟穿越港灣。",
    "fact": "支架獨木舟運動源自太平洋航海傳統，奧克蘭許多隊伍共同訓練，學習合作、節奏與海洋文化。",
    "words": [
     "team",
     "paddle",
     "canoe"
    ]
   },
   {
    "id": "auckland_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🌉",
    "en": "Auckland Harbour Bridge",
    "zh": "奧克蘭海港大橋",
    "sent": "The great bridge stretches across sparkling blue water.",
    "sentZh": "宏偉大橋橫跨閃耀的藍色海面。",
    "fact": "奧克蘭海港大橋跨越懷特瑪塔港，連接市中心與北岸，是城市交通要道和醒目的海港景觀。",
    "words": [
     "bridge",
     "stretch",
     "water"
    ]
   },
   {
    "id": "auckland_person",
    "type": "person",
    "lv": 4,
    "emoji": "🏔️",
    "en": "Sir Edmund Hillary",
    "zh": "艾德蒙·希拉里爵士",
    "sent": "Hillary climbed Everest and explored icy Antarctica.",
    "sentZh": "希拉里攀登聖母峰並探索冰封南極。",
    "fact": "希拉里出生於奧克蘭，成為首批登上聖母峰頂的人之一，之後持續探險並協助尼泊爾山區興建學校。",
    "words": [
     "climb",
     "explore",
     "icy"
    ],
    "era": "1919–2008",
    "field": "登山與探險"
   }
  ]
 },
 "madrid": {
  "clue": "Grand plazas glow while flamenco rhythms fill lively streets.",
  "clueZh": "宏偉廣場閃耀，佛朗明哥節奏洋溢在熱鬧街頭。",
  "pref": "carnivalmask",
  "cards": [
   {
    "id": "madrid_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "💃",
    "en": "Flamenco",
    "zh": "佛朗明哥",
    "sent": "Dancers clap and move to lively guitar music.",
    "sentZh": "舞者隨著活潑的吉他音樂拍手起舞。",
    "fact": "佛朗明哥融合歌唱、吉他與舞蹈，源自西班牙南部，在馬德里的劇場與小酒館也十分盛行。",
    "words": [
     "dancer",
     "clap",
     "guitar"
    ]
   },
   {
    "id": "madrid_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🖼️",
    "en": "Prado Museum",
    "zh": "普拉多博物館",
    "sent": "Famous paintings fill this grand art museum.",
    "sentZh": "著名畫作陳列在這座宏偉的藝術博物館中。",
    "fact": "普拉多博物館收藏大量歐洲藝術珍品，尤其以西班牙繪畫著稱，是馬德里重要的文化地標。",
    "words": [
     "famous",
     "painting",
     "museum"
    ]
   },
   {
    "id": "madrid_person",
    "type": "person",
    "lv": 4,
    "emoji": "🎨",
    "en": "Diego Velázquez",
    "zh": "迪亞哥・委拉斯開茲",
    "sent": "Velázquez painted people with remarkable detail and depth.",
    "sentZh": "委拉斯開茲以非凡的細節與深度描繪人物。",
    "fact": "委拉斯開茲長年在馬德里創作，以細膩肖像與光影技巧聞名，代表作《宮女》現藏於普拉多博物館。",
    "words": [
     "paint",
     "detail",
     "depth"
    ],
    "era": "1599–1660",
    "field": "繪畫藝術"
   }
  ]
 },
 "amsterdam": {
  "clue": "Bicycles cross bridges beside narrow houses and sparkling waterways.",
  "clueZh": "自行車穿越橋梁，沿途是窄屋與閃亮水道。",
  "pref": "orchid",
  "cards": [
   {
    "id": "amsterdam_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🚲",
    "en": "Cycling Culture",
    "zh": "自行車文化",
    "sent": "Families ride bicycles along safe city paths.",
    "sentZh": "家庭沿著安全的城市道路騎自行車。",
    "fact": "阿姆斯特丹擁有密集的自行車道與停車設施，許多居民每天騎車上學、工作或前往市場。",
    "words": [
     "bicycle",
     "ride",
     "path"
    ]
   },
   {
    "id": "amsterdam_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🏛️",
    "en": "Rijksmuseum",
    "zh": "國家博物館",
    "sent": "Dutch masterpieces welcome visitors inside this great museum.",
    "sentZh": "荷蘭傑作在這座宏偉博物館裡迎接訪客。",
    "fact": "荷蘭國家博物館收藏林布蘭與維梅爾等大師作品，帶領訪客認識數百年的荷蘭藝術與歷史。",
    "words": [
     "Dutch",
     "masterpiece",
     "visitor"
    ]
   },
   {
    "id": "amsterdam_person",
    "type": "person",
    "lv": 4,
    "emoji": "🖌️",
    "en": "Rembrandt",
    "zh": "林布蘭",
    "sent": "Rembrandt used light to create powerful painted stories.",
    "sentZh": "林布蘭運用光線創造動人的繪畫故事。",
    "fact": "林布蘭在阿姆斯特丹生活與創作多年，善用明暗對比描繪人物情感，成為荷蘭藝術的重要大師。",
    "words": [
     "light",
     "powerful",
     "story"
    ],
    "era": "1606–1669",
    "field": "繪畫與版畫"
   }
  ]
 },
 "mexico_city": {
  "clue": "Ancient ruins and colorful murals brighten this mountain capital.",
  "clueZh": "古老遺跡與繽紛壁畫照亮這座山間首都。",
  "pref": "carnivalmask",
  "cards": [
   {
    "id": "mexico_city_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🌼",
    "en": "Day of the Dead",
    "zh": "亡靈節",
    "sent": "Families remember loved ones with flowers and food.",
    "sentZh": "家人用鮮花與食物懷念摯愛親友。",
    "fact": "亡靈節期間，人們布置花朵、照片與食物，溫馨紀念離世親友，展現墨西哥獨特的生命觀。",
    "words": [
     "remember",
     "flower",
     "family"
    ]
   },
   {
    "id": "mexico_city_landmark",
    "type": "landmark",
    "lv": 3,
    "emoji": "🏰",
    "en": "Chapultepec Castle",
    "zh": "查普爾特佩克城堡",
    "sent": "The hilltop castle overlooks trees and busy avenues.",
    "sentZh": "山頂城堡俯瞰樹林與繁忙大道。",
    "fact": "查普爾特佩克城堡坐落於公園山丘上，如今是國家歷史博物館，可俯瞰墨西哥城廣闊景色。",
    "words": [
     "hilltop",
     "castle",
     "overlook"
    ]
   },
   {
    "id": "mexico_city_person",
    "type": "person",
    "lv": 4,
    "emoji": "🌺",
    "en": "Frida Kahlo",
    "zh": "芙烈達・卡蘿",
    "sent": "Frida painted bold portraits inspired by her life.",
    "sentZh": "芙烈達以自身生命為靈感描繪鮮明肖像。",
    "fact": "芙烈達・卡蘿出生並生活於墨西哥城，以強烈色彩和自畫像表達身體經驗、情感與文化認同。",
    "words": [
     "bold",
     "portrait",
     "inspire"
    ],
    "era": "1907–1954",
    "field": "繪畫藝術"
   }
  ]
 },
 "cape_town": {
  "clue": "Oceans meet beneath a famous flat-topped mountain near penguins.",
  "clueZh": "海洋在著名的平頂山下交會，附近還有企鵝。",
  "pref": "surfboard",
  "cards": [
   {
    "id": "cape_town_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🎶",
    "en": "Cape Jazz",
    "zh": "開普爵士樂",
    "sent": "Musicians blend joyful rhythms into lively jazz songs.",
    "sentZh": "音樂家把歡快節奏融入活潑的爵士歌曲。",
    "fact": "開普爵士樂融合非洲、歐洲與亞洲音樂元素，以活潑節奏呈現開普敦多元社群的文化交流。",
    "words": [
     "musician",
     "rhythm",
     "blend"
    ]
   },
   {
    "id": "cape_town_landmark",
    "type": "landmark",
    "lv": 3,
    "emoji": "🏝️",
    "en": "Robben Island",
    "zh": "羅本島",
    "sent": "Boats carry visitors to this historic island museum.",
    "sentZh": "船隻載著訪客前往這座歷史島嶼博物館。",
    "fact": "羅本島位於開普敦外海，曾作為監獄與隔離地，如今透過博物館保存南非追求自由的歷史記憶。",
    "words": [
     "boat",
     "historic",
     "island"
    ]
   },
   {
    "id": "cape_town_person",
    "type": "person",
    "lv": 4,
    "emoji": "❤️",
    "en": "Christiaan Barnard",
    "zh": "克里斯蒂安・巴納德",
    "sent": "Barnard led the first successful human heart transplant.",
    "sentZh": "巴納德主持了首次成功的人類心臟移植手術。",
    "fact": "巴納德醫師在開普敦的醫院完成世界首例成功的人類心臟移植，推動心臟外科與移植醫學發展。",
    "words": [
     "heart",
     "transplant",
     "successful"
    ],
    "era": "1922–2001",
    "field": "心臟外科醫學"
   }
  ]
 },
 "buenos_aires": {
  "clue": "Tango dancers sweep across plazas in this elegant port city.",
  "clueZh": "探戈舞者在這座優雅港都的廣場上翩然起舞。",
  "pref": "bookmark",
  "cards": [
   {
    "id": "buenos_aires_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🕺",
    "en": "Tango",
    "zh": "探戈",
    "sent": "Partners dance closely to dramatic tango music.",
    "sentZh": "舞伴隨著戲劇性的探戈音樂貼近共舞。",
    "fact": "探戈誕生於拉普拉塔河沿岸社區，結合舞蹈、音樂與詩歌，後來成為布宜諾斯艾利斯的文化象徵。",
    "words": [
     "partner",
     "closely",
     "dramatic"
    ]
   },
   {
    "id": "buenos_aires_landmark",
    "type": "landmark",
    "lv": 2,
    "emoji": "🎭",
    "en": "Teatro Colón",
    "zh": "哥倫布劇院",
    "sent": "Opera and ballet shine inside this splendid theater.",
    "sentZh": "歌劇與芭蕾在這座華麗劇院中綻放光彩。",
    "fact": "哥倫布劇院以華麗建築和優良音響聞名，自二十世紀初起便是歌劇、芭蕾與古典音樂的重要舞台。",
    "words": [
     "opera",
     "ballet",
     "theater"
    ]
   },
   {
    "id": "buenos_aires_person",
    "type": "person",
    "lv": 4,
    "emoji": "📚",
    "en": "Jorge Luis Borges",
    "zh": "豪爾赫・路易斯・波赫士",
    "sent": "Borges wrote imaginative stories about mazes and libraries.",
    "sentZh": "波赫士創作關於迷宮與圖書館的想像故事。",
    "fact": "波赫士出生於布宜諾斯艾利斯，以迷宮、鏡子與無限等主題創作短篇故事，深刻影響世界文學。",
    "words": [
     "imaginative",
     "maze",
     "library"
    ],
    "era": "1899–1986",
    "field": "文學創作"
   }
  ]
 },
 "beijing": {
  "clue": "Ancient courtyards stand beside modern towers in this northern capital.",
  "clueZh": "古老院落與現代高樓並立於這座北方首都。",
  "pref": "kite",
  "cards": [
   {
    "id": "beijing_culture",
    "type": "culture",
    "lv": 2,
    "emoji": "🎭",
    "en": "Peking Opera",
    "zh": "京劇",
    "sent": "Performers sing and act in colorful painted faces.",
    "sentZh": "表演者畫著彩色臉譜唱歌演戲。",
    "fact": "京劇結合唱腔、念白、武術與舞蹈，鮮明臉譜能提示角色性格，是北京極具代表性的表演藝術。",
    "words": [
     "performer",
     "painted",
     "act"
    ]
   },
   {
    "id": "beijing_landmark",
    "type": "landmark",
    "lv": 3,
    "emoji": "🏯",
    "en": "Forbidden City",
    "zh": "故宮",
    "sent": "Red walls surround hundreds of historic palace buildings.",
    "sentZh": "紅牆環繞著數百座歷史宮殿建築。",
    "fact": "北京故宮是規模宏大的古代宮殿建築群，擁有數百年歷史，如今以博物院形式保存珍貴文物。",
    "words": [
     "surround",
     "historic",
     "palace"
    ]
   },
   {
    "id": "beijing_person",
    "type": "person",
    "lv": 4,
    "emoji": "🎭",
    "en": "Mei Lanfang",
    "zh": "梅蘭芳",
    "sent": "Mei Lanfang brought Peking Opera to world audiences.",
    "sentZh": "梅蘭芳把京劇帶給世界各地的觀眾。",
    "fact": "梅蘭芳生於北京，以精湛唱腔與表演革新京劇旦角藝術，並透過海外演出促進東西方戲劇交流。",
    "words": [
     "audience",
     "opera",
     "perform"
    ],
    "era": "1894–1961",
    "field": "京劇表演藝術"
   }
  ]
 },
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
