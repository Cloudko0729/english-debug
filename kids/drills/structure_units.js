// 語言架構教材：⑥ 發音解碼(詞族) + ⑦ 句型積木(顏色標角色)。
// 每日測驗依日期輪替一個單元(隔天不同)。單字語音用 audio/words/，句子語音 audio/structure/<unit>/eN.mp3
const PHONICS_UNITS = [
  { id: "ake", title: "a_e 魔法 e（-ake 家族）", tip: "字尾的 e 不發音，讓 a 變成長音 /eɪ/：c-ake、m-ake", words: [{"en":"cake","zh":"蛋糕","ex":"I made a cake."},{"en":"make","zh":"做、製作","ex":"Let's make a card."},{"en":"take","zh":"拿、帶","ex":"Take your bag."},{"en":"lake","zh":"湖","ex":"We swam in the lake."}], bonus: "bake", non: ["boat", "ship"] },
  { id: "ame", title: "a_e 魔法 e（-ame 家族）", tip: "一樣的魔法 e：n-ame、g-ame，a 唸 /eɪ/", words: [{"en":"name","zh":"名字","ex":"My name is Amy."},{"en":"game","zh":"遊戲","ex":"We played a game."},{"en":"same","zh":"一樣的","ex":"We wear the same shoes."},{"en":"came","zh":"來（過去式）","ex":"He came to my house."}], bonus: "frame", non: ["farm", "goat"] },
  { id: "ike", title: "i_e 魔法 e（-ike 家族）", tip: "字尾 e 讓 i 變長音 /aɪ/：b-ike、l-ike", words: [{"en":"bike","zh":"腳踏車","ex":"I ride my bike."},{"en":"like","zh":"喜歡","ex":"I like dogs."},{"en":"nine","zh":"九","ex":"It is nine o'clock."},{"en":"time","zh":"時間","ex":"What time is it?"}], bonus: "hike", non: ["big", "lip"] },
  { id: "ope", title: "o_e 魔法 e（o 的長音）", tip: "字尾 e 讓 o 變長音 /oʊ/：h-ome、n-ose", words: [{"en":"home","zh":"家","ex":"I went home."},{"en":"nose","zh":"鼻子","ex":"Touch your nose."},{"en":"note","zh":"筆記、便條","ex":"I wrote a note."},{"en":"hope","zh":"希望","ex":"I hope you win."}], bonus: "rope", non: ["hot", "not"] },
  { id: "ee", title: "ee 長音 /iː/", tip: "兩個 e 在一起，拉長唸 /iː/：s-ee、tr-ee", words: [{"en":"see","zh":"看見","ex":"I see a bird."},{"en":"bee","zh":"蜜蜂","ex":"A bee is on the flower."},{"en":"tree","zh":"樹","ex":"The tree is tall."},{"en":"green","zh":"綠色","ex":"The grass is green."}], bonus: "sleep", non: ["set", "ten"] },
  { id: "ea", title: "ea 長音 /iː/", tip: "ea 也常唸 /iː/：eat、sea、tea", words: [{"en":"eat","zh":"吃","ex":"Let's eat lunch."},{"en":"sea","zh":"海","ex":"The sea is blue."},{"en":"tea","zh":"茶","ex":"Mom drinks tea."},{"en":"read","zh":"閱讀","ex":"I read a book."}], bonus: "clean", non: ["egg", "red"] },
  { id: "sh", title: "sh 的噓聲 /ʃ/", tip: "s+h 一起唸「噓」的聲音：sh-ip、sh-op", words: [{"en":"ship","zh":"船","ex":"The ship is big."},{"en":"shop","zh":"商店","ex":"We went to the shop."},{"en":"she","zh":"她","ex":"She is my sister."},{"en":"fish","zh":"魚","ex":"The fish can swim."}], bonus: "shoe", non: ["sit", "sun"] },
  { id: "ch", title: "ch 的 /tʃ/", tip: "c+h 一起唸「娶」的氣音：ch-air、lun-ch", words: [{"en":"chair","zh":"椅子","ex":"Sit on the chair."},{"en":"cheese","zh":"起司","ex":"I like cheese."},{"en":"chicken","zh":"雞、雞肉","ex":"We ate chicken."},{"en":"lunch","zh":"午餐","ex":"It is time for lunch."}], bonus: "teacher", non: ["cat", "car"] },
  { id: "st", title: "st 開頭混音", tip: "s 和 t 連在一起快唸：st-op、st-ar", words: [{"en":"stop","zh":"停止","ex":"Stop at the red light."},{"en":"star","zh":"星星","ex":"I see a star."},{"en":"study","zh":"讀書、學習","ex":"I study English."},{"en":"student","zh":"學生","ex":"He is a student."}], bonus: "stand", non: ["sad", "top"] },
  { id: "tr", title: "tr 開頭混音", tip: "t 和 r 連在一起快唸：tr-ee、tr-ain", words: [{"en":"tree","zh":"樹","ex":"A bird is in the tree."},{"en":"train","zh":"火車","ex":"The train is fast."},{"en":"trip","zh":"旅行","ex":"We took a trip."},{"en":"try","zh":"嘗試","ex":"Try again!"}], bonus: "truck", non: ["ten", "rain"] },
  { id: "ay", title: "ay 長音 /eɪ/", tip: "字尾 ay 唸 /eɪ/：d-ay、pl-ay", words: [{"en":"day","zh":"天、日子","ex":"Have a nice day."},{"en":"play","zh":"玩","ex":"Let's play outside."},{"en":"say","zh":"說","ex":"Say hello."},{"en":"way","zh":"路、方法","ex":"This way, please."}], bonus: "today", non: ["dog", "put"] },
  { id: "oo", title: "oo 長音 /uː/", tip: "兩個 o 常唸 /uː/：f-ood、m-oon", words: [{"en":"food","zh":"食物","ex":"The food is good."},{"en":"moon","zh":"月亮","ex":"The moon is bright."},{"en":"school","zh":"學校","ex":"I go to school."},{"en":"zoo","zh":"動物園","ex":"We went to the zoo."}], bonus: "cool", non: ["fox", "fog"] },
  { id: "er", title: "字尾 -er（做…的人）", tip: "動作 + er = 做這件事的人：teach+er、sing+er", words: [{"en":"teacher","zh":"老師","ex":"My teacher is kind."},{"en":"farmer","zh":"農夫","ex":"The farmer has a cow."},{"en":"singer","zh":"歌手","ex":"She is a singer."},{"en":"player","zh":"球員、選手","ex":"He is a good player."}], bonus: "worker", non: ["water", "under"] },
  { id: "ow", title: "ow 長音 /oʊ/", tip: "字尾 ow 常唸 /oʊ/：sn-ow、wind-ow", words: [{"en":"yellow","zh":"黃色","ex":"The sun is yellow."},{"en":"window","zh":"窗戶","ex":"Open the window."},{"en":"snow","zh":"雪","ex":"I love snow."},{"en":"show","zh":"表演、節目","ex":"The show was fun."}], bonus: "slow", non: ["now", "cow"] }
];

// 句型積木：roles 用顏色標「誰/動作/什麼/地點」，examples 依角色切塊
const SKELETON_UNITS = [
  {
    id: "svo", name: "誰 ＋ 動作 ＋ 什麼",
    roles: [{ t: "誰", c: "#e63946" }, { t: "動作", c: "#2f80ed" }, { t: "什麼", c: "#2fbf71" }],
    examples: [
      { parts: ["I", "eat", "breakfast."], zh: "我吃早餐。" },
      { parts: ["She", "reads", "books."], zh: "她讀書。" },
      { parts: ["We", "play", "soccer."], zh: "我們踢足球。" }
    ],
    quiz: [
      { type: "order", q: "哪一句順序正確？", answer: "She reads books.", wrong: ["Reads she books.", "Books reads she."] },
      { type: "slot", q: "「動作」格要放哪個字？　I ___ breakfast.", answer: "eat", wrong: ["breakfast", "happy"] },
      { type: "listen", q: "聽聽看，是哪一句？", ex: 2, options: ["We play soccer.", "We play basketball.", "She plays soccer."] }
    ]
  },
  {
    id: "place", name: "誰 ＋ 動作 ＋ 地點",
    roles: [{ t: "誰", c: "#e63946" }, { t: "動作", c: "#2f80ed" }, { t: "地點", c: "#f4a261" }],
    examples: [
      { parts: ["I", "go", "to school."], zh: "我去上學。" },
      { parts: ["They", "swim", "at the beach."], zh: "他們在海邊游泳。" },
      { parts: ["He", "studies", "in the library."], zh: "他在圖書館讀書。" }
    ],
    quiz: [
      { type: "order", q: "哪一句順序正確？", answer: "I go to school.", wrong: ["To school I go.", "Go I to school."] },
      { type: "slot", q: "「地點」格要放哪個？　They swim ___.", answer: "at the beach", wrong: ["eat lunch", "very fast"] },
      { type: "listen", q: "聽聽看，是哪一句？", ex: 2, options: ["He studies in the library.", "He studies in the kitchen.", "She studies in the library."] }
    ]
  },
  {
    id: "be", name: "誰 ＋ is/are ＋ 怎麼樣",
    roles: [{ t: "誰", c: "#e63946" }, { t: "is/are", c: "#7c4dca" }, { t: "怎麼樣", c: "#2fbf71" }],
    examples: [
      { parts: ["The cake", "is", "sweet."], zh: "蛋糕是甜的。" },
      { parts: ["My hands", "are", "clean."], zh: "我的手是乾淨的。" },
      { parts: ["The train", "is", "fast."], zh: "火車很快。" }
    ],
    quiz: [
      { type: "order", q: "哪一句順序正確？", answer: "The cake is sweet.", wrong: ["Sweet is the cake.", "The cake sweet is."] },
      { type: "slot", q: "My hands ___ clean. 要放哪個？", answer: "are", wrong: ["is", "am"] },
      { type: "listen", q: "聽聽看，是哪一句？", ex: 2, options: ["The train is fast.", "The train is slow.", "The plane is fast."] }
    ]
  },
  {
    id: "past", name: "誰 ＋ 動作(過去) ＋ 什麼",
    roles: [{ t: "誰", c: "#e63946" }, { t: "過去動作", c: "#2f80ed" }, { t: "什麼", c: "#2fbf71" }],
    examples: [
      { parts: ["I", "ate", "lunch."], zh: "我吃了午餐。" },
      { parts: ["She", "bought", "a gift."], zh: "她買了一個禮物。" },
      { parts: ["They", "saw", "a movie."], zh: "他們看了一部電影。" }
    ],
    quiz: [
      { type: "order", q: "哪一句順序正確？", answer: "She bought a gift.", wrong: ["Bought she a gift.", "A gift she bought."] },
      { type: "slot", q: "「過去動作」格要放哪個？　I ___ lunch.（昨天）", answer: "ate", wrong: ["eat", "eating"] },
      { type: "listen", q: "聽聽看，是哪一句？", ex: 2, options: ["They saw a movie.", "They see a movie.", "They saw a mouse."] }
    ]
  },
  {
    id: "will", name: "誰 ＋ will ＋ 動作",
    roles: [{ t: "誰", c: "#e63946" }, { t: "will", c: "#7c4dca" }, { t: "動作", c: "#2f80ed" }],
    examples: [
      { parts: ["I", "will", "help you."], zh: "我會幫你。" },
      { parts: ["It", "will", "rain tomorrow."], zh: "明天會下雨。" },
      { parts: ["We", "will", "visit grandma."], zh: "我們會去看奶奶。" }
    ],
    quiz: [
      { type: "order", q: "哪一句順序正確？", answer: "I will help you.", wrong: ["I help will you.", "Will I help you."] },
      { type: "slot", q: "will 後面要放哪種字？　It will ___ tomorrow.", answer: "rain", wrong: ["rains", "rained"] },
      { type: "listen", q: "聽聽看，是哪一句？", ex: 2, options: ["We will visit grandma.", "We will visit grandpa.", "We visit grandma."] }
    ]
  },
  {
    id: "going", name: "誰 ＋ is going to ＋ 動作",
    roles: [{ t: "誰", c: "#e63946" }, { t: "be going to", c: "#7c4dca" }, { t: "動作", c: "#2f80ed" }],
    examples: [
      { parts: ["I", "am going to", "study tonight."], zh: "我今晚要讀書。" },
      { parts: ["She", "is going to", "buy a phone."], zh: "她要買手機。" },
      { parts: ["They", "are going to", "play soccer."], zh: "他們要去踢足球。" }
    ],
    quiz: [
      { type: "order", q: "哪一句順序正確？", answer: "She is going to buy a phone.", wrong: ["She going is to buy a phone.", "Is she going buy to a phone."] },
      { type: "slot", q: "I ___ going to study. 要放哪個？", answer: "am", wrong: ["is", "are"] },
      { type: "listen", q: "聽聽看，是哪一句？", ex: 2, options: ["They are going to play soccer.", "They are going to play baseball.", "They are going to watch soccer."] }
    ]
  },
  {
    id: "can", name: "誰 ＋ can ＋ 動作",
    roles: [{ t: "誰", c: "#e63946" }, { t: "can", c: "#7c4dca" }, { t: "動作", c: "#2f80ed" }],
    examples: [
      { parts: ["I", "can", "swim."], zh: "我會游泳。" },
      { parts: ["He", "can", "ride a bike."], zh: "他會騎腳踏車。" },
      { parts: ["Birds", "can", "fly."], zh: "鳥會飛。" }
    ],
    quiz: [
      { type: "order", q: "哪一句順序正確？", answer: "He can ride a bike.", wrong: ["He ride can a bike.", "Can he ride a bike"] },
      { type: "slot", q: "can 後面要放哪個？　I can ___.", answer: "swim", wrong: ["swims", "swimming"] },
      { type: "listen", q: "聽聽看，是哪一句？", ex: 2, options: ["Birds can fly.", "Birds can sing.", "Fish can fly."] }
    ]
  }
];

// 依日期輪替：每天一個單元(隔天不同)
function phonicsUnitFor(dateStr) { const n = Math.floor(Date.parse(dateStr) / 86400000); return PHONICS_UNITS[((n % PHONICS_UNITS.length) + PHONICS_UNITS.length) % PHONICS_UNITS.length]; }
function skeletonUnitFor(dateStr) { const n = Math.floor(Date.parse(dateStr) / 86400000); return SKELETON_UNITS[((n % SKELETON_UNITS.length) + SKELETON_UNITS.length) % SKELETON_UNITS.length]; }

if (typeof module !== "undefined" && module.exports) module.exports = { PHONICS_UNITS, SKELETON_UNITS, phonicsUnitFor, skeletonUnitFor };
