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
  taipei: {
    clue: "People here love a sweet drink with chewy pearls.",
    clueZh: "這裡的人喜歡一種有 QQ 珍珠的甜飲料",
    pref: "bubbletea",
    cards: [
      { id: "taipei_culture", type: "culture", lv: 2, emoji: "🌙", en: "Night Market", zh: "夜市",
        sent: "Night markets are famous in Taipei.", sentZh: "夜市在台北很有名",
        fact: "台北的夜市傍晚開到半夜，小吃、遊戲、衣服都有，是觀光客最愛。", words: ["night", "market", "famous"] },
      { id: "taipei_lm2", type: "landmark", lv: 3, emoji: "🏛️", en: "National Palace Museum", zh: "故宮博物院",
        sent: "The National Palace Museum is in Taipei.", sentZh: "故宮博物院在台北",
        fact: "故宮收藏將近 70 萬件文物，翠玉白菜和肉形石最有名。", words: ["museum", "palace", "national"] },
    ],
  },
  tokyo: {
    clue: "A hot bowl of noodles is very famous here.",
    clueZh: "這裡有一種很有名的熱湯麵",
    pref: "ramen",
    cards: [
      { id: "tokyo_culture", type: "culture", lv: 2, emoji: "🌸", en: "Cherry Blossoms", zh: "櫻花（花見）",
        sent: "People enjoy cherry blossoms in spring.", sentZh: "人們在春天賞櫻花",
        fact: "春天全東京的公園開滿櫻花，大家會在樹下野餐，叫做「花見」。", words: ["cherry", "blossom", "spring"] },
      { id: "tokyo_lm2", type: "landmark", lv: 3, emoji: "⛩️", en: "Senso-ji Temple", zh: "淺草寺",
        sent: "Senso-ji Temple is very old.", sentZh: "淺草寺非常古老",
        fact: "淺草寺已經超過 1300 年，大紅燈籠寫著「雷門」，是東京最老的寺廟。", words: ["temple", "old", "gate"] },
    ],
  },
  london: {
    clue: "People here enjoy a warm drink in the afternoon.",
    clueZh: "這裡的人喜歡在下午喝一種溫熱的飲料",
    pref: "tea",
    cards: [
      { id: "london_culture", type: "culture", lv: 2, emoji: "🚌", en: "Double-decker Bus", zh: "紅色雙層巴士",
        sent: "Red double-decker buses run in London.", sentZh: "紅色雙層巴士在倫敦跑",
        fact: "倫敦的紅色雙層巴士超過 100 年歷史，坐上層第一排看街景最棒。", words: ["bus", "red", "ride"] },
      { id: "london_lm2", type: "landmark", lv: 3, emoji: "🌉", en: "Tower Bridge", zh: "倫敦塔橋",
        sent: "Tower Bridge opens for ships.", sentZh: "塔橋會打開讓船通過",
        fact: "塔橋中間可以像翅膀一樣升起，讓大船從泰晤士河通過。", words: ["bridge", "tower", "ship"] },
  ],
  },
};

// 禮物池（送禮時出 3 選 1：含該城偏好 1 個＋隨機 2 個）
const CITY_GIFTS = [
  { id: "bubbletea", emoji: "🧋", en: "bubble tea",  zh: "珍珠奶茶" },
  { id: "ramen",     emoji: "🍜", en: "ramen",       zh: "拉麵" },
  { id: "tea",       emoji: "☕", en: "afternoon tea", zh: "下午茶" },
  { id: "kite",      emoji: "🪁", en: "kite",        zh: "風箏" },
  { id: "orchid",    emoji: "🌸", en: "orchid",      zh: "蘭花" },
  { id: "baguette",  emoji: "🥖", en: "baguette",    zh: "法國麵包" },
  { id: "gelato",    emoji: "🍨", en: "gelato",      zh: "義式冰淇淋" },
  { id: "bagel",     emoji: "🥯", en: "bagel",       zh: "貝果" },
  { id: "surfboard", emoji: "🏄", en: "surfboard",   zh: "衝浪板" },
  { id: "bookmark",  emoji: "🔖", en: "bookmark",    zh: "書籤" },
];

// 好感度常數（Codex 對齊數值）
const FRIEND_LV = [0, 50, 125, 225];          // 一階到 Lv3
const FRIEND_CAP_CITY = 35, FRIEND_CAP_DAY = 100;
const GIFT_COST = 80, GIFT_PTS = 7, GIFT_PREF_PTS = 11, GIFT_PTS_CAP = 12;
const GREET_PTS = 3, ACT_COST = 100, ACT_PTS = [0, 8, 14, 20];
const EXCHANGE_OPEN = ["taipei", "tokyo", "london"];

if (typeof module !== "undefined" && module.exports)
  module.exports = { WORLD_CITIES, CITY_EXCHANGE, CITY_GIFTS, FRIEND_LV, EXCHANGE_OPEN };
