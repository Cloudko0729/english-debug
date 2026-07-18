// Lv.1（G1 國小一）8 週內容產生器。
// 用法：node render_lv1.js
//   1. 依下面 WEEKS 資料產生 k9/lv1/week1.html ~ week8.html、k9/lv1/index.html
//   2. 同時輸出 k9/tools/audio_lv1.json 給 kids/tools/generate_audio.py 生音檔
const fs = require("fs");
const path = require("path");

const OUTDIR = path.join(__dirname, "..", "lv1");
const AUDIO_SPEC_OUT = path.join(__dirname, "audio_lv1.json");
const AUDIO_OUTDIR = path.join(__dirname, "..", "lv1", "audio").replace(/\\/g, "/");

function slug(en) {
  return en.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

const WEEKS = [
  {
    id: 1, title: "Hello, Me", zh: "哈囉，我", icon: "👋",
    goal: "看圖聽懂招呼指令，完成 4～6 句自我介紹",
    pattern: ["My name is ___.", "I am a boy. / I am a girl."],
    vocab: [
      { en: "hello", zh: "哈囉", emoji: "👋" },
      { en: "hi", zh: "嗨", emoji: "🙋" },
      { en: "name", zh: "名字", emoji: "🏷️" },
      { en: "boy", zh: "男生", emoji: "👦" },
      { en: "girl", zh: "女生", emoji: "👧" },
      { en: "one", zh: "一", emoji: "1️⃣" },
      { en: "two", zh: "二", emoji: "2️⃣" },
      { en: "three", zh: "三", emoji: "3️⃣" },
      { en: "four", zh: "四", emoji: "4️⃣" },
      { en: "five", zh: "五", emoji: "5️⃣" },
      { en: "six", zh: "六", emoji: "6️⃣" },
      { en: "seven", zh: "七", emoji: "7️⃣" },
      { en: "eight", zh: "八", emoji: "8️⃣" },
      { en: "nine", zh: "九", emoji: "9️⃣" },
      { en: "ten", zh: "十", emoji: "🔟" },
    ],
    dialogue: [
      { who: "Amy 👧", en: "Hi! My name is Amy.", zh: "嗨！我叫 Amy。" },
      { who: "Tom 👦", en: "Hi Amy! My name is Tom.", zh: "嗨 Amy！我叫 Tom。" },
      { who: "Amy 👧", en: "I am a girl.", zh: "我是女生。" },
      { who: "Tom 👦", en: "I am a boy. Nice to meet you!", zh: "我是男生。很高興認識你！" },
    ],
    game: { instruction: "🔊 聽數字，點對的卡片", words: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"] },
    copywork: [
      { en: "Hello! I am Mia.", zh: "哈囉！我是 Mia。" },
      { en: "I am seven years old.", zh: "我七歲。" },
      { en: "I have a big smile.", zh: "我有一個大大的笑容。" },
      { en: "I say hello to my friends.", zh: "我向朋友們說哈囉。" },
    ],
  },
  {
    id: 2, title: "My Family", zh: "我的家人", icon: "👨‍👩‍👧‍👦",
    goal: "用 This is my... 介紹家人，完成家庭圖卡口頭導覽",
    pattern: ["This is my ___.", "I love my family."],
    vocab: [
      { en: "family", zh: "家人", emoji: "👨‍👩‍👧‍👦" },
      { en: "mom", zh: "媽媽", emoji: "👩" },
      { en: "dad", zh: "爸爸", emoji: "👨" },
      { en: "brother", zh: "哥哥／弟弟", emoji: "👦" },
      { en: "sister", zh: "姐姐／妹妹", emoji: "👧" },
      { en: "baby", zh: "小寶寶", emoji: "👶" },
      { en: "grandma", zh: "奶奶／阿嬤", emoji: "👵" },
      { en: "grandpa", zh: "爺爺／阿公", emoji: "👴" },
      { en: "this", zh: "這（是）", emoji: "👉" },
      { en: "my", zh: "我的", emoji: "🙋" },
      { en: "big", zh: "大的", emoji: "🐘" },
      { en: "small", zh: "小的", emoji: "🐭" },
      { en: "love", zh: "愛", emoji: "❤️" },
      { en: "happy", zh: "開心", emoji: "😊" },
      { en: "is", zh: "是", emoji: "🟰" },
    ],
    dialogue: [
      { who: "Amy 👧", en: "This is my mom.", zh: "這是我媽媽。" },
      { who: "Amy 👧", en: "This is my dad.", zh: "這是我爸爸。" },
      { who: "Amy 👧", en: "This is my baby brother.", zh: "這是我的小弟弟。" },
      { who: "Amy 👧", en: "I love my family!", zh: "我愛我的家人！" },
    ],
    game: { instruction: "🔊 聽家人稱呼，點對的卡片", words: ["mom", "dad", "brother", "sister", "baby", "grandma", "grandpa"] },
    copywork: [
      { en: "My family is big.", zh: "我的家庭很大。" },
      { en: "I have a mom, a dad, and a baby brother.", zh: "我有媽媽、爸爸和一個小弟弟。" },
      { en: "We are happy.", zh: "我們很快樂。" },
      { en: "I love them all.", zh: "我愛他們每一個人。" },
    ],
  },
  {
    id: 3, title: "School Things", zh: "學校用品", icon: "🎒",
    goal: "聽指令找物並貼標籤，會用 It is a... / Show me...",
    pattern: ["It is a ___.", "Show me your ___."],
    vocab: [
      { en: "book", zh: "書", emoji: "📖" },
      { en: "bag", zh: "書包", emoji: "🎒" },
      { en: "pen", zh: "筆", emoji: "🖊️" },
      { en: "pencil", zh: "鉛筆", emoji: "✏️" },
      { en: "desk", zh: "書桌", emoji: "🪑" },
      { en: "chair", zh: "椅子", emoji: "💺" },
      { en: "ruler", zh: "尺", emoji: "📏" },
      { en: "eraser", zh: "橡皮擦", emoji: "🧽" },
      { en: "teacher", zh: "老師", emoji: "🧑‍🏫" },
      { en: "classroom", zh: "教室", emoji: "🏫" },
      { en: "it", zh: "它", emoji: "🔵" },
      { en: "a", zh: "一個", emoji: "1️⃣" },
      { en: "show", zh: "給...看", emoji: "👀" },
      { en: "me", zh: "我", emoji: "🙋" },
      { en: "please", zh: "請", emoji: "🙏" },
    ],
    dialogue: [
      { who: "Teacher 🧑‍🏫", en: "Show me your book, please.", zh: "請給我看你的書。" },
      { who: "Tom 👦", en: "Here it is. It is a book.", zh: "在這裡。它是一本書。" },
      { who: "Teacher 🧑‍🏫", en: "Good! Show me your pencil.", zh: "很好！給我看你的鉛筆。" },
      { who: "Tom 👦", en: "It is a pencil.", zh: "它是一支鉛筆。" },
    ],
    game: { instruction: "🔊 聽學校用品，點對的卡片", words: ["book", "bag", "pen", "pencil", "desk", "chair", "ruler", "eraser"] },
    copywork: [
      { en: "My school bag is blue.", zh: "我的書包是藍色的。" },
      { en: "I have a book, a pencil, and an eraser.", zh: "我有一本書、一支鉛筆和一個橡皮擦。" },
      { en: "They are in my bag.", zh: "它們都在我的書包裡。" },
      { en: "I am ready for school.", zh: "我準備好上學了。" },
    ],
  },
  {
    id: 4, title: "Colors and Shapes", zh: "顏色與形狀", icon: "🌈",
    goal: "完成形狀尋寶照片加口述，會用 It is red. / I see...",
    pattern: ["It is ___ (color).", "I see a ___ (shape)."],
    vocab: [
      { en: "red", zh: "紅色", emoji: "🔴" },
      { en: "blue", zh: "藍色", emoji: "🔵" },
      { en: "yellow", zh: "黃色", emoji: "🟡" },
      { en: "green", zh: "綠色", emoji: "🟢" },
      { en: "orange", zh: "橘色", emoji: "🟠" },
      { en: "purple", zh: "紫色", emoji: "🟣" },
      { en: "black", zh: "黑色", emoji: "⚫" },
      { en: "white", zh: "白色", emoji: "⚪" },
      { en: "circle", zh: "圓形", emoji: "⭕" },
      { en: "square", zh: "正方形", emoji: "🟥" },
      { en: "triangle", zh: "三角形", emoji: "🔺" },
      { en: "star", zh: "星形", emoji: "⭐" },
      { en: "big", zh: "大的", emoji: "🐘" },
      { en: "small", zh: "小的", emoji: "🐭" },
      { en: "see", zh: "看見", emoji: "👀" },
    ],
    dialogue: [
      { who: "Amy 👧", en: "I see a red circle.", zh: "我看到一個紅色圓形。" },
      { who: "Tom 👦", en: "I see a blue square.", zh: "我看到一個藍色正方形。" },
      { who: "Amy 👧", en: "Look! A yellow star!", zh: "你看！一個黃色星星！" },
      { who: "Tom 👦", en: "It is big and yellow.", zh: "它又大又黃。" },
    ],
    game: { instruction: "🔊 聽顏色或形狀，點對的卡片", words: ["red", "blue", "yellow", "green", "circle", "square", "triangle", "star"] },
    copywork: [
      { en: "I see a small red circle.", zh: "我看到一個紅色的小圓形。" },
      { en: "I see a big blue square.", zh: "我看到一個藍色的大正方形。" },
      { en: "The star is yellow.", zh: "星星是黃色的。" },
      { en: "Colors and shapes are fun!", zh: "顏色和形狀真有趣！" },
    ],
  },
  {
    id: 5, title: "My Body", zh: "我的身體", icon: "🙆",
    goal: "完成動作歌指令挑戰，會用 Touch your... / I have...",
    pattern: ["Touch your ___.", "I have two ___."],
    vocab: [
      { en: "head", zh: "頭", emoji: "🗣️" },
      { en: "hand", zh: "手", emoji: "✋" },
      { en: "eye", zh: "眼睛", emoji: "👁️" },
      { en: "nose", zh: "鼻子", emoji: "👃" },
      { en: "mouth", zh: "嘴巴", emoji: "👄" },
      { en: "ear", zh: "耳朵", emoji: "👂" },
      { en: "foot", zh: "腳", emoji: "🦶" },
      { en: "hair", zh: "頭髮", emoji: "💇" },
      { en: "arm", zh: "手臂", emoji: "💪" },
      { en: "touch", zh: "摸", emoji: "👉" },
      { en: "have", zh: "有", emoji: "🤲" },
      { en: "two", zh: "二", emoji: "2️⃣" },
      { en: "your", zh: "你的", emoji: "🫵" },
      { en: "stand up", zh: "站起來", emoji: "🧍" },
      { en: "sit down", zh: "坐下", emoji: "🪑" },
    ],
    dialogue: [
      { who: "Teacher 🧑‍🏫", en: "Stand up! Touch your head.", zh: "站起來！摸摸你的頭。" },
      { who: "Kids 🧒", en: "Touch your nose. Touch your ears.", zh: "摸摸鼻子。摸摸耳朵。" },
      { who: "Teacher 🧑‍🏫", en: "I have two hands and two feet.", zh: "我有兩隻手和兩隻腳。" },
      { who: "Kids 🧒", en: "Sit down, please.", zh: "請坐下。" },
    ],
    game: { instruction: "🔊 聽身體部位，點對的卡片", words: ["head", "hand", "eye", "nose", "mouth", "ear", "foot", "arm"] },
    copywork: [
      { en: "I have two eyes and two ears.", zh: "我有兩隻眼睛和兩隻耳朵。" },
      { en: "I have one nose and one mouth.", zh: "我有一個鼻子和一張嘴巴。" },
      { en: "I clap my hands.", zh: "我拍拍手。" },
      { en: "I stamp my feet.", zh: "我跺跺腳。" },
    ],
  },
  {
    id: 6, title: "Animals", zh: "動物", icon: "🐾",
    goal: "選一隻動物說 3 句，會用 I see a... / It is...",
    pattern: ["I see a ___.", "It is big. / It is small."],
    vocab: [
      { en: "cat", zh: "貓", emoji: "🐱" },
      { en: "dog", zh: "狗", emoji: "🐶" },
      { en: "bird", zh: "鳥", emoji: "🐦" },
      { en: "fish", zh: "魚", emoji: "🐟" },
      { en: "rabbit", zh: "兔子", emoji: "🐰" },
      { en: "duck", zh: "鴨子", emoji: "🦆" },
      { en: "cow", zh: "牛", emoji: "🐮" },
      { en: "pig", zh: "豬", emoji: "🐷" },
      { en: "big", zh: "大的", emoji: "🐘" },
      { en: "small", zh: "小的", emoji: "🐭" },
      { en: "cute", zh: "可愛的", emoji: "🥰" },
      { en: "see", zh: "看見", emoji: "👀" },
      { en: "it", zh: "它", emoji: "🔵" },
      { en: "is", zh: "是", emoji: "🟰" },
      { en: "a", zh: "一個", emoji: "1️⃣" },
    ],
    dialogue: [
      { who: "Tom 👦", en: "I see a dog. It is big.", zh: "我看到一隻狗。牠很大。" },
      { who: "Amy 👧", en: "I see a cat. It is small and cute.", zh: "我看到一隻貓。牠又小又可愛。" },
      { who: "Tom 👦", en: "Look at the duck!", zh: "你看那隻鴨子！" },
      { who: "Amy 👧", en: "It is cute.", zh: "牠好可愛。" },
    ],
    game: { instruction: "🔊 聽動物名稱，點對的卡片", words: ["cat", "dog", "bird", "fish", "rabbit", "duck", "cow", "pig"] },
    copywork: [
      { en: "A small rabbit is in the grass.", zh: "一隻小兔子在草地上。" },
      { en: "It has long ears.", zh: "牠有長長的耳朵。" },
      { en: "It can jump.", zh: "牠會跳。" },
      { en: "I like this cute rabbit.", zh: "我喜歡這隻可愛的兔子。" },
    ],
  },
  {
    id: 7, title: "Food I Like", zh: "我喜歡的食物", icon: "🍎",
    goal: "完成家庭喜好小調查，會用 I like... / I don't like...",
    pattern: ["I like ___.", "I don't like ___."],
    vocab: [
      { en: "rice", zh: "飯", emoji: "🍚" },
      { en: "milk", zh: "牛奶", emoji: "🥛" },
      { en: "apple", zh: "蘋果", emoji: "🍎" },
      { en: "egg", zh: "蛋", emoji: "🥚" },
      { en: "water", zh: "水", emoji: "💧" },
      { en: "bread", zh: "麵包", emoji: "🍞" },
      { en: "juice", zh: "果汁", emoji: "🧃" },
      { en: "banana", zh: "香蕉", emoji: "🍌" },
      { en: "like", zh: "喜歡", emoji: "😋" },
      { en: "don't", zh: "不", emoji: "🚫" },
      { en: "eat", zh: "吃", emoji: "🍽️" },
      { en: "drink", zh: "喝", emoji: "🥤" },
      { en: "yummy", zh: "好吃", emoji: "😋" },
      { en: "I", zh: "我", emoji: "🙋" },
      { en: "no", zh: "不要", emoji: "🙅" },
    ],
    dialogue: [
      { who: "Amy 👧", en: "I like apples. They are yummy.", zh: "我喜歡蘋果。它們很好吃。" },
      { who: "Tom 👦", en: "I like milk, but I don't like eggs.", zh: "我喜歡牛奶，但我不喜歡蛋。" },
      { who: "Amy 👧", en: "Do you like juice?", zh: "你喜歡果汁嗎？" },
      { who: "Tom 👦", en: "Yes! I like juice very much.", zh: "喜歡！我很喜歡果汁。" },
    ],
    game: { instruction: "🔊 聽食物名稱，點對的卡片", words: ["rice", "milk", "apple", "egg", "water", "bread", "juice", "banana"] },
    extra: {
      title: "👍👎 我喜歡 / 我不喜歡",
      instruction: "看到食物卡，選 👍 我喜歡 或 👎 我不喜歡，聽聽看整句怎麼說。",
    },
    copywork: [
      { en: "I eat bread and an egg for breakfast.", zh: "我早餐吃麵包和一顆蛋。" },
      { en: "I drink milk.", zh: "我喝牛奶。" },
      { en: "I like apples, too.", zh: "我也喜歡蘋果。" },
      { en: "My breakfast is yummy!", zh: "我的早餐真好吃！" },
    ],
  },
  {
    id: 8, title: "My Little Book", zh: "我的小書", icon: "📕",
    goal: "完成並朗讀 4～6 頁小書，複習前七週核心字",
    pattern: ["Hello. This is... I like..."],
    review: true,
    vocab: [
      { en: "hello", zh: "哈囉", emoji: "👋", from: "W1" },
      { en: "name", zh: "名字", emoji: "🏷️", from: "W1" },
      { en: "family", zh: "家人", emoji: "👨‍👩‍👧‍👦", from: "W2" },
      { en: "this", zh: "這（是）", emoji: "👉", from: "W2" },
      { en: "book", zh: "書", emoji: "📖", from: "W3" },
      { en: "show", zh: "給...看", emoji: "👀", from: "W3" },
      { en: "red", zh: "紅色", emoji: "🔴", from: "W4" },
      { en: "circle", zh: "圓形", emoji: "⭕", from: "W4" },
      { en: "head", zh: "頭", emoji: "🗣️", from: "W5" },
      { en: "touch", zh: "摸", emoji: "👉", from: "W5" },
      { en: "dog", zh: "狗", emoji: "🐶", from: "W6" },
      { en: "cute", zh: "可愛的", emoji: "🥰", from: "W6" },
      { en: "apple", zh: "蘋果", emoji: "🍎", from: "W7" },
      { en: "like", zh: "喜歡", emoji: "😋", from: "W7" },
    ],
    book: [
      { en: "Hello! My name is ___.", zh: "哈囉！我叫 ___。" },
      { en: "This is my family. I love them.", zh: "這是我的家人。我愛他們。" },
      { en: "This is my book and my pencil.", zh: "這是我的書和我的鉛筆。" },
      { en: "I see a red circle and a blue square.", zh: "我看到一個紅色圓形和一個藍色正方形。" },
      { en: "I have two hands. Touch your head!", zh: "我有兩隻手。摸摸你的頭！" },
      { en: "I see a dog. It is cute.", zh: "我看到一隻狗。牠好可愛。" },
      { en: "I like apples. Yummy!", zh: "我喜歡蘋果。好吃！" },
    ],
    game: { instruction: "🔊 複習：聽單字，點對的卡片（每週各挑一個字）", words: ["hello", "family", "book", "red", "head", "dog", "apple"] },
    copywork: [
      { en: "Hello! I am Leo.", zh: "哈囉！我是 Leo。" },
      { en: "I have a happy family.", zh: "我有一個快樂的家庭。" },
      { en: "My school bag is blue.", zh: "我的書包是藍色的。" },
      { en: "I like dogs and apples.", zh: "我喜歡狗和蘋果。" },
      { en: "This is my little book.", zh: "這是我的小書。" },
    ],
  },
];

function esc(s) { return String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function vocabAudioName(weekId, en) { return `w${weekId}_${slug(en)}`; }
function dlgAudioName(weekId, i) { return `w${weekId}_dlg${i}`; }
function bookAudioName(i) { return `w8_book${i}`; }
function copyworkAudioName(weekId) { return `w${weekId}_copywork`; }

const CSS = `
body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;max-width:720px;margin:0 auto;padding:0 14px 60px;line-height:1.7}
header{background:#2fbf71;color:#fff;text-align:center;padding:16px;border-radius:0 0 14px 14px;margin:0 -14px 12px}
header h1{margin:0;font-size:1.2rem} header p{margin:5px 0 0;font-size:.8rem;opacity:.92}
header a{color:#eaffef;text-decoration:none;font-weight:700}
.card{background:#fff;border-radius:14px;padding:14px 16px;margin-top:14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.card h2{font-size:1rem;color:#187a48;margin:0 0 8px}
.goal{font-size:.92rem;background:#eafff2;border-radius:10px;padding:10px 14px;font-weight:700;color:#187a48}
.pattern{font-size:1rem;background:#eef5ff;border-radius:10px;padding:10px 14px;font-weight:700;color:#1e5fb8;margin-top:8px}
.dlg{border-top:1px dashed #eee;padding:9px 0;font-size:.95rem;display:flex;align-items:center;gap:8px}
.dlg b{min-width:64px}
.dlg button{border:none;border-radius:8px;background:#2fbf71;color:#fff;font-weight:700;padding:6px 12px;cursor:pointer}
.dlg small{display:block;color:#888;margin-top:2px}
.dlg .txt{flex:1}
.vocabgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-top:6px}
.vcard{background:#fdf6e3;border:2px solid #f2d68a;border-radius:12px;text-align:center;padding:10px 6px;cursor:pointer}
.vcard .em{font-size:1.8rem}
.vcard b{display:block;margin-top:4px;font-size:.92rem}
.vcard small{color:#888}
.vcard.from{opacity:.85}
.vcard .tag{font-size:.65rem;color:#b5651d;font-weight:700}
#gameArea{margin-top:8px}
#gameArea button.gcard{padding:12px 10px;border:2px solid #d9e2ec;border-radius:12px;background:#fff;font-weight:700;cursor:pointer;margin:4px;font-size:1rem}
#gameArea button.gcard.correct{border-color:#2fbf71;background:#d9f7e8}
#gameArea button.gcard.wrong{border-color:#ef476f;background:#fde0e8}
#gplay{border:none;border-radius:10px;background:#2f80ed;color:#fff;font-weight:700;padding:9px 16px;cursor:pointer;margin-bottom:8px}
#gstatus{font-weight:700;margin-top:8px;min-height:1.4em}
.extra{border-top:1px dashed #eee;padding-top:10px;margin-top:10px}
.foodbtn{border:2px solid #d9e2ec;border-radius:12px;padding:8px 12px;background:#fff;font-weight:700;cursor:pointer;margin:4px}
.copywork{border:2px solid #f2d68a;background:#fffdf4}
.copywork .steps{margin:8px 0 10px;padding-left:22px}
.copywork .copy-line{border-top:1px dashed #ddd;padding:8px 0;font-size:1rem}
.copywork .copy-line b{display:block;color:#243042}
.copywork .copy-line small{color:#777}
.copywork .speak-check{background:#eafff2;border-radius:10px;padding:9px 12px;color:#187a48;font-weight:700;margin-top:10px}
.donebox{text-align:center;margin-top:10px}
.donebox label{font-weight:700;font-size:.9rem}
.nav2{display:flex;justify-content:space-between;margin-top:16px;font-size:.85rem}
.nav2 a{color:#187a48;text-decoration:none;font-weight:700;background:#fff;border-radius:10px;padding:9px 14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.book-page{border-top:1px dashed #eee;padding:10px 0;font-size:.98rem}
.book-page b{font-size:1.05rem}
`;

function renderDialogueHTML(weekId, dlg) {
  return `<div class="card"><h2>🎧 情境對話</h2><button id="playAll" onclick="playAllDlg()">▶️ 全部播放</button>` +
    dlg.map((d, i) => `<div class="dlg"><b>${esc(d.who)}</b><button onclick="playAudio('${dlgAudioName(weekId, i)}')">🔊</button><span class="txt">${esc(d.en)}<small>${esc(d.zh)}</small></span></div>`).join("") +
    `</div>`;
}

function renderVocabHTML(weekId, vocab) {
  return `<div class="card"><h2>🔤 單字卡（點卡片聽發音）</h2><div class="vocabgrid">` +
    vocab.map(v => `<div class="vcard${v.from ? " from" : ""}" onclick="playAudio('${vocabAudioName(weekId, v.en)}')">${v.from ? `<div class="tag">${esc(v.from)}</div>` : ""}<div class="em">${v.emoji}</div><b>${esc(v.en)}</b><small>${esc(v.zh)}</small></div>`).join("") +
    `</div></div>`;
}

function renderGameHTML(weekId, game) {
  return `<div class="card"><h2>🎮 聽力遊戲</h2><p>${esc(game.instruction)}</p>
  <button id="gplay" onclick="startGame()">▶️ 開始</button>
  <div id="gameArea"></div><div id="gstatus"></div></div>`;
}

function renderExtraHTML(weekId, extra, vocab) {
  const foods = vocab.filter(v => ["apple", "milk", "egg", "banana", "bread", "rice", "juice", "water"].includes(v.en));
  return `<div class="card extra"><h2>${esc(extra.title)}</h2><p>${esc(extra.instruction)}</p>
  <div id="foodArea">${foods.map(f => `<span class="foodbtn" data-en="${esc(f.en)}">${f.emoji} ${esc(f.en)}</span>`).join("")}</div>
  <div style="margin-top:8px"><button class="foodbtn" onclick="foodChoice('like')">👍 I like it.</button><button class="foodbtn" onclick="foodChoice('dislike')">👎 I don't like it.</button></div>
  <div id="foodResult" style="margin-top:8px;font-weight:700"></div></div>`;
}

function renderCopyworkHTML(week) {
  return `<div class="card copywork"><h2>✍️ 本週手寫記憶＋口說作業</h2>
  <p>這是另外準備的本週短文。請抄在實體筆記本上，抄寫時小聲念，完成後再練習朗讀與背說。</p>
  <button onclick="playAudio('${copyworkAudioName(week.id)}')" style="border:none;border-radius:10px;background:#2f80ed;color:#fff;font-weight:700;padding:8px 14px;cursor:pointer">🔊 聽整篇示範</button>
  <ol class="steps"><li>先聽整段 2 次。</li><li>每句手寫 1 次，邊寫邊念。</li><li>看著筆記本朗讀 3 次。</li><li>闔上頁面，試著完整背說 1 次。</li></ol>` +
    week.copywork.map(p => `<div class="copy-line"><b>${esc(p.en)}</b><small>${esc(p.zh)}</small></div>`).join("") +
    `<div class="speak-check">完成標準：能不看網頁，指著自己的手寫內容順順念完。</div></div>`;
}

function renderBookHTML(book) {
  return `<div class="card"><h2>📕 我的小書（把七句連起來）</h2>` +
    book.map((p, i) => `<div class="book-page"><button onclick="playAudio('${bookAudioName(i)}')">🔊</button> <b>${esc(p.en)}</b><br><small>${esc(p.zh)}</small></div>`).join("") +
    `</div>`;
}

const GAME_JS = `
function playAudio(name){new Audio("audio/"+name+".mp3").play().catch(()=>{});}
let dlgIdx=0;
function playAllDlg(){
  dlgIdx=0; playNextDlg();
}
function playNextDlg(){
  if(dlgIdx>=DLG.length)return;
  const a=new Audio("audio/"+DLG[dlgIdx]+".mp3");
  a.onended=()=>{dlgIdx++;playNextDlg();};
  a.play().catch(()=>{dlgIdx++;playNextDlg();});
}
let gWords=[], gIdx=0, gScore=0;
function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startGame(){
  gWords=shuffle(GAME_WORDS); gIdx=0; gScore=0;
  document.getElementById("gstatus").textContent="";
  renderGameRound();
}
function renderGameRound(){
  const area=document.getElementById("gameArea");
  if(gIdx>=gWords.length){area.innerHTML="";document.getElementById("gstatus").textContent="🎉 完成！答對 "+gScore+" / "+gWords.length;return;}
  const target=gWords[gIdx];
  const choices=shuffle(GAME_WORDS.filter(w=>w!==target).slice(0,3).concat([target]));
  area.innerHTML=choices.map(w=>{const v=VOCAB_MAP[w];return '<button class="gcard" data-w="'+w+'" onclick="gameAnswer(this,\\''+w+'\\')">'+v.emoji+' '+v.en+'</button>';}).join("");
  new Audio("audio/"+VOCAB_AUDIO[target]+".mp3").play().catch(()=>{});
  document.getElementById("gstatus").textContent="第 "+(gIdx+1)+" / "+gWords.length+" 題";
}
function gameAnswer(btn,w){
  const target=gWords[gIdx];
  document.querySelectorAll("#gameArea button").forEach(b=>b.disabled=true);
  if(w===target){btn.classList.add("correct");gScore++;}
  else{btn.classList.add("wrong");document.querySelector('#gameArea [data-w="'+target+'"]').classList.add("correct");}
  setTimeout(()=>{gIdx++;renderGameRound();},900);
}
const FOOD_FORM={apple:"apples",egg:"eggs",banana:"bananas",milk:"milk",bread:"bread",rice:"rice",juice:"juice",water:"water"};
function foodChoice(kind){
  const sel=document.querySelector("#foodArea .foodbtn.sel");
  const word=sel?sel.dataset.en:null;
  const r=document.getElementById("foodResult");
  if(!word){r.textContent="先點一樣食物，再選 👍 或 👎";return;}
  const form=FOOD_FORM[word]||word;
  const sent = kind==="like" ? "I like "+form+"." : "I don't like "+form+".";
  r.textContent=sent;
}
document.addEventListener("click",e=>{
  if(e.target.classList && e.target.classList.contains("foodbtn") && e.target.dataset.en){
    document.querySelectorAll("#foodArea .foodbtn").forEach(b=>b.classList.remove("sel"));
    e.target.classList.add("sel");
    playAudio(VOCAB_AUDIO[e.target.dataset.en]);
  }
});
const doneKey="k9progress";
function loadDone(){try{return JSON.parse(localStorage.getItem(doneKey)||"{}");}catch(e){return {};}}
function saveDone(d){localStorage.setItem(doneKey,JSON.stringify(d));}
function toggleDone(cb){
  const d=loadDone(); if(!d.lv1)d.lv1={};
  d.lv1["week"+WEEK_ID]=cb.checked; saveDone(d);
}
(function initDone(){
  const d=loadDone();
  const cb=document.getElementById("doneCb");
  if(cb && d.lv1 && d.lv1["week"+WEEK_ID]) cb.checked=true;
})();
`;

function renderWeekPage(week, weekList) {
  const prev = weekList.find(w => w.id === week.id - 1);
  const next = weekList.find(w => w.id === week.id + 1);
  const vocabAudioMap = {};
  week.vocab.forEach(v => { vocabAudioMap[v.en] = vocabAudioName(week.id, v.en); });
  const dlgNames = week.review ? [] : week.dialogue.map((_, i) => dlgAudioName(week.id, i));

  let body = `<div class="card"><div class="goal">🎯 ${esc(week.goal)}</div>` +
    week.pattern.map(p => `<div class="pattern">${esc(p)}</div>`).join("") + `</div>`;

  if (week.review) {
    body += renderBookHTML(week.book);
  } else {
    body += renderDialogueHTML(week.id, week.dialogue);
  }
  body += renderVocabHTML(week.id, week.vocab);
  body += renderGameHTML(week.id, week.game);
  if (week.extra) body += renderExtraHTML(week.id, week.extra, week.vocab);
  body += renderCopyworkHTML(week);
  body += `<div class="card donebox"><label><input type="checkbox" id="doneCb" onchange="toggleDone(this)"> ✅ 這週完成了（記在這台裝置，不用帳號）</label></div>`;

  const gameWords = JSON.stringify(week.game.words);
  const gameAudioMap = {};
  week.game.words.forEach(w => { gameAudioMap[w] = vocabAudioName(week.id, w); });
  const gVocabMap = {};
  week.vocab.forEach(v => { gVocabMap[v.en] = { en: v.en, emoji: v.emoji }; });
  const bookNames = week.review ? week.book.map((_, i) => bookAudioName(i)) : [];

  return `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${week.icon} Week ${week.id}：${esc(week.title)} — Lv.1</title><style>${CSS}</style></head><body>
<header><h1>${week.icon} Week ${week.id}：${esc(week.title)} <span style="font-size:.8rem;opacity:.85">${esc(week.zh)}</span></h1>
<p><a href="index.html">← Lv.1 目錄</a> · <a href="../index.html">課程首頁</a></p></header>
${body}
<div class="nav2">
  <span>${prev ? `<a href="week${prev.id}.html">← Week ${prev.id}</a>` : ""}</span>
  <span>${next ? `<a href="week${next.id}.html">Week ${next.id} →</a>` : `<a href="index.html">Lv.1 完成 🎉</a>`}</span>
</div>
<script>
const WEEK_ID=${week.id};
const DLG=${JSON.stringify(dlgNames)};
const GAME_WORDS=${gameWords};
const VOCAB_AUDIO=${JSON.stringify(Object.assign({}, vocabAudioMap, gameAudioMap))};
const VOCAB_MAP=${JSON.stringify(gVocabMap)};
${GAME_JS}
</script>
</body></html>`;
}

function renderIndexPage(weekList) {
  const rows = weekList.map(w => `<a class="wcard" href="week${w.id}.html"><div class="em">${w.icon}</div><div><b>Week ${w.id}：${esc(w.title)}</b><small>${esc(w.zh)}</small></div><div class="chk" id="chk${w.id}"></div></a>`).join("");
  return `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>🌱 Lv.1 國小一年級 — 8 週英語入門</title><style>
body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;max-width:720px;margin:0 auto;padding:0 14px 60px;line-height:1.7}
header{background:#2fbf71;color:#fff;text-align:center;padding:18px;border-radius:0 0 14px 14px;margin:0 -14px 12px}
header h1{margin:0;font-size:1.25rem} header p{margin:6px 0 0;font-size:.82rem;opacity:.92}
header a{color:#eaffef;text-decoration:none;font-weight:700}
.card{background:#fff;border-radius:14px;padding:14px 16px;margin-top:14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.card h2{font-size:1rem;color:#187a48;margin:0 0 8px}
.wcard{display:flex;align-items:center;gap:12px;background:#fff;border-radius:14px;padding:12px 14px;margin-top:10px;box-shadow:0 1px 4px rgba(0,0,0,.08);text-decoration:none;color:inherit}
.wcard .em{font-size:1.8rem}
.wcard b{display:block;font-size:.95rem}
.wcard small{color:#888}
.wcard .chk{margin-left:auto;font-size:1.2rem}
</style></head><body>
<header><h1>🌱 Lv.1 國小一年級</h1><p><a href="../index.html">← 課程首頁</a> · Pre-A1 起步 · 不考試，聽說為主</p></header>
<div class="card"><h2>這一級要做到</h2><p>看得懂、聽得懂日常招呼、家人、學校用品、顏色形狀、身體、動物、食物的基本單字和短句；能完成 8 週的小任務並做出一本「我的小書」。</p></div>
${rows}
<script>
try{
  const d=JSON.parse(localStorage.getItem("k9progress")||"{}");
  if(d.lv1){for(const k in d.lv1){if(d.lv1[k]){const m=k.match(/week(\\d+)/);if(m)document.getElementById("chk"+m[1]).textContent="✅";}}}
}catch(e){}
</script>
</body></html>`;
}

// ---- 產生檔案 ----
fs.mkdirSync(OUTDIR, { recursive: true });
WEEKS.forEach(w => {
  fs.writeFileSync(path.join(OUTDIR, `week${w.id}.html`), renderWeekPage(w, WEEKS), "utf-8");
});
fs.writeFileSync(path.join(OUTDIR, "index.html"), renderIndexPage(WEEKS), "utf-8");

// ---- 產生語音清單 ----
const items = {};
WEEKS.forEach(w => {
  w.vocab.forEach(v => { items[vocabAudioName(w.id, v.en)] = v.en; });
  if (!w.review) {
    w.dialogue.forEach((d, i) => { items[dlgAudioName(w.id, i)] = d.en; });
  } else {
    w.book.forEach((p, i) => { items[bookAudioName(i)] = p.en; });
  }
  items[copyworkAudioName(w.id)] = w.copywork.map(p => p.en).join(" ");
});
fs.writeFileSync(AUDIO_SPEC_OUT, JSON.stringify({ outdir: AUDIO_OUTDIR, voice: "af_heart", speed: 0.85, items }, null, 2), "utf-8");

console.log(`已產生 ${WEEKS.length} 週頁面 + index.html`);
console.log(`語音清單：${Object.keys(items).length} 條 -> ${AUDIO_SPEC_OUT}`);
