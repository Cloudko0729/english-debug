// 四季小鎮：內容資料（第一階段小樣）
// 數值依設計報告《四季小鎮》的定案經濟：作物每投入 1 體力最多淨賺 2 幣、建築不生錢、價格固定。
(function (root) {
  "use strict";

  var CROPS = {
    rice:   { en: "rice",   zh: "稻米",   emoji: "🌾", freeSeed: true },
    carrot: { en: "carrot", zh: "紅蘿蔔", emoji: "🥕" },
    potato: { en: "potato", zh: "馬鈴薯", emoji: "🥔" },
  };
  // 售價：免費種子 4、付費種子作物 5（種子 1 幣 → 淨 4），每片播種 2 體力 → 每體力最多 2 幣
  var SELL = { rice: 4, carrot: 5, potato: 5 };
  var DECOR = {
    flowers: { en: "flowers",  zh: "花圃",   emoji: "🌼" },
    tree:    { en: "tree",     zh: "小樹",   emoji: "🌳" },
    lantern: { en: "lantern",  zh: "燈籠",   emoji: "🏮" },
    bench:   { en: "bench",    zh: "長椅",   emoji: "🪑" },
    mailbox: { en: "mailbox",  zh: "信箱",   emoji: "📮" },
    rock:    { en: "rock",     zh: "石頭堆", emoji: "🪨" },
  };
  var BUY = { carrot_seed: 1, potato_seed: 1, flowers: 10, tree: 10, lantern: 10, bench: 10, mailbox: 10, rock: 10 };
  var COST = { plant: 2, care: 1, gather: 2 };
  var NAME = { wood: "木材", stone: "石頭", crop: "作物", carrot_seed: "紅蘿蔔種子", potato_seed: "馬鈴薯種子",
               rice: "稻米", carrot: "紅蘿蔔", potato: "馬鈴薯", ap: "體力", money: "小鎮幣",
               flowers: "花圃", tree: "小樹", lantern: "燈籠", bench: "長椅", mailbox: "信箱", rock: "石頭堆" };

  // 小鎮地標：每一階 5 個任務，同時列出來，順序隨意。5 個都交完，這一階就修好了。
  // 每個任務由一位村民提出（有英文語音 task_<id>），交完那位村民 +1 好感、小鎮繁榮度 +10。
  // need.item：ap＝出力幫忙（直接扣體力）、wood/stone/rice/carrot/potato＝背包、花圃燈籠等＝背包裡還沒擺出去的裝飾。
  // 估算（Codex 從零模擬，含播種、照料、出售、買種子與裝飾）：8 片田一起種是 34／44／46 體力，合計約 124，
  // 一週約 50 體力的話要兩週半；只用一片田要 43／71／73，因為照料費沒有分攤。新手提示要鼓勵多開田。
  var LANDMARKS = {
    plaza: {
      zh: "小鎮廣場", en: "the plaza",
      look: ["🚧 雜草和破木板", "🧹 清乾淨了，有一張長桌", "🏮 鋪好石板路，掛上燈籠", "🎪 有一座小舞台，可以辦活動"],
      stages: [
        { title: "清理廣場", done: "雜草清光了，Leo 做好一張長桌", tasks: [
          { id: "p1-wood", by: "Leo", need: { item: "wood", n: 4 },
            en: "I need four pieces of wood. I will make a long table.", zh: "我需要四塊木材，我要做一張長桌。" },
          { id: "p1-weeds", by: "Leo", need: { item: "ap", n: 4 },
            en: "There are so many weeds! Can you help me pull them?", zh: "雜草好多！你可以幫我拔嗎？" },
          { id: "p1-stone", by: "Leo", need: { item: "stone", n: 3 },
            en: "Please bring three stones. I want to fix the old wall.", zh: "請帶三顆石頭來，我想修好那道舊牆。" },
          { id: "p1-carrot", by: "Mia", need: { item: "carrot", n: 2 },
            en: "Working is hard. Let's eat some carrots! Can you bring two?", zh: "工作好累，我們來吃紅蘿蔔吧！你可以帶兩根來嗎？" },
          { id: "p1-flowers", by: "Mia", need: { item: "flowers", n: 1 },
            en: "The plaza looks sad. Could we put some flowers here?", zh: "廣場看起來好冷清。我們可以在這裡放一些花嗎？" },
        ] },
        { title: "石板路與燈籠", done: "鋪好石板路，晚上也有燈籠照亮", tasks: [
          { id: "p2-stone", by: "Leo", need: { item: "stone", n: 5 },
            en: "Let's make a stone path. We need five stones.", zh: "我們來鋪一條石板路，需要五顆石頭。" },
          { id: "p2-carry", by: "Leo", need: { item: "ap", n: 6 },
            en: "These stones are heavy! Help me carry them, please.", zh: "這些石頭好重！請幫我一起搬。" },
          { id: "p2-rice", by: "Nora", need: { item: "rice", n: 3 },
            en: "I want to make rice cakes for everyone. Please bring three bags of rice.", zh: "我想做米糕給大家吃，請帶三袋稻米來。" },
          { id: "p2-potato", by: "Nora", need: { item: "potato", n: 2 },
            en: "Potato bread is my favorite. Can you bring two potatoes?", zh: "馬鈴薯麵包是我的最愛。你可以帶兩顆馬鈴薯來嗎？" },
          { id: "p2-lantern", by: "Mia", need: { item: "lantern", n: 2 },
            en: "At night the plaza is too dark. Two lanterns will help.", zh: "晚上廣場太暗了，兩個燈籠就會好很多。" },
        ] },
        { title: "小舞台", done: "小舞台搭好了！Ben 在上面打鼓，大家都來看", tasks: [
          { id: "p3-wood", by: "Leo", need: { item: "wood", n: 6 },
            en: "We need six pieces of wood to build a stage.", zh: "我們需要六塊木材來搭舞台。" },
          { id: "p3-drums", by: "Ben", need: { item: "ap", n: 6 },
            en: "Let's get ready for the show! Help me set up the drums.", zh: "來準備表演吧！幫我把鼓架好。" },
          { id: "p3-bench", by: "Ben", need: { item: "bench", n: 1 },
            en: "People need a place to sit. Can we get a bench?", zh: "大家需要地方坐。我們可以弄一張長椅嗎？" },
          { id: "p3-carrot", by: "Nora", need: { item: "carrot", n: 3 },
            en: "I'm making carrot cake for the party. I need three carrots.", zh: "我要為派對做紅蘿蔔蛋糕，需要三根紅蘿蔔。" },
          { id: "p3-flowers", by: "Mia", need: { item: "flowers", n: 2 },
            en: "Flowers make everyone smile. Can you bring two more flowers for the stage?", zh: "花會讓大家微笑。你可以再帶兩個花圃來布置舞台嗎？" },
        ] },
      ],
    },
  };

  // 繁榮度：不存檔，每次從進度算出來（任務、修好的階段、好感、擺出來的裝飾）。
  // 新村民在繁榮度到門檻時搬來；門檻都不超過「只靠任務」就拿得到的分數，
  // 所以照著任務做一定會搬來，多照顧村民、多佈置農莊只會讓他們早一點來。
  var PROSPERITY = {
    task: 10, stage: 20, heart: 3, decor: 2, decorMax: 10,
    levels: [
      { at: 0,   zh: "冷清的小村",   emoji: "🏚️" },
      { at: 60,  zh: "有點人氣的小村", emoji: "🏡" },
      { at: 130, zh: "熱鬧的小村",   emoji: "🏘️" },
      { at: 200, zh: "繁榮的小鎮",   emoji: "🎪" },
    ],
  };

  // 村民設定。個性要跟已經寫好的信和故事對得上：
  //   Mia 在第二週的信裡說過心情不好、想一個人靜一靜 → 溫和、愛書、需要獨處
  //   Leo 在故事裡對椅子大吼、接著道歉 → 熱情、急性子、很快認錯、喜歡熱鬧
  // likes / dislikes 盡量用遊戲裡有的東西（item），之後做送禮時直接沿用。
  var VILLAGERS = {
    Mia: {
      emoji: "👩‍🦰", img: "img/mia.png", zh: "Mia，圖書館員",
      role: { en: "librarian", zh: "圖書館員" }, place: { en: "the town library", zh: "小鎮圖書館" },
      traits: [{ en: "gentle", zh: "溫和" }, { en: "curious", zh: "好奇" }, { en: "a little shy", zh: "有點害羞" }],
      likes: [
        { emoji: "📚", en: "books", zh: "書" },
        { emoji: "🥕", en: "carrots", zh: "紅蘿蔔", item: "carrot" },
        { emoji: "🌼", en: "flowers", zh: "花", item: "flowers" },
        { emoji: "🌧️", en: "rainy days", zh: "下雨天" } ],
      dislikes: [{ emoji: "📢", en: "loud noise", zh: "很吵的聲音" }, { emoji: "📄", en: "torn pages", zh: "破掉的書頁" }],
      intro: "Hi, I'm Mia. I'm the town librarian. I love quiet rainy days and a good story. I'm a little shy, but I always want to hear about your day.",
      introZh: "嗨，我是 Mia，小鎮的圖書館員。我喜歡安靜的下雨天和好看的故事。我有點害羞，但我一直都很想聽你說說你的一天。",
      motto: "Every book is a new friend.", mottoZh: "每一本書都是一個新朋友。",
      about: "Mia 從小就在圖書館長大。她最喜歡下雨天，因為大家會躲進來看書。人多的時候她會有點緊張，需要一個人安靜一下；但只要有人問她推薦哪本書，她就會笑得很開心。",
    },
    Leo: {
      emoji: "🧔", img: "img/leo.png", zh: "Leo，木匠",
      role: { en: "carpenter", zh: "木匠" }, place: { en: "the plaza workshop", zh: "廣場旁的工坊" },
      traits: [{ en: "cheerful", zh: "開朗" }, { en: "hard-working", zh: "認真" }, { en: "a little hot-tempered", zh: "有點急性子" }],
      likes: [
        { emoji: "🪵", en: "wood", zh: "木材", item: "wood" },
        { emoji: "🥔", en: "potatoes", zh: "馬鈴薯", item: "potato" },
        { emoji: "🪑", en: "making chairs", zh: "做椅子", item: "bench" },
        { emoji: "😂", en: "jokes", zh: "笑話" } ],
      dislikes: [{ emoji: "🔧", en: "broken tools", zh: "壞掉的工具" }, { emoji: "🍽️", en: "eating alone", zh: "一個人吃飯" }],
      intro: "Hello! I'm Leo, the town carpenter. I can fix almost anything with my hammer. I get angry fast, but I say sorry fast too!",
      introZh: "哈囉！我是 Leo，小鎮的木匠。我拿著鐵鎚幾乎什麼都修得好。我很容易生氣，但我道歉也很快！",
      motto: "Let's fix it together!", mottoZh: "我們一起把它修好吧！",
      about: "Leo 是小鎮最愛熱鬧的人，每次修好東西都要找朋友來一起吃馬鈴薯慶祝。他脾氣來得快去得也快，生氣完會馬上說對不起。他最大的心願是把舊廣場修成大家都想來的地方。",
    },
    // 之後搬來的村民：arrive＝繁榮度門檻，welcome＝搬來時寄來的信（語音 arrive_<名字>）
    Nora: {
      emoji: "👩‍🍳", img: "img/nora.png", zh: "Nora，麵包師", arrive: 60,
      role: { en: "baker", zh: "麵包師" }, place: { en: "the bakery by the plaza", zh: "廣場旁的麵包店" },
      traits: [{ en: "warm", zh: "熱心" }, { en: "busy", zh: "很忙" }, { en: "a little forgetful", zh: "有點健忘" }],
      likes: [
        { emoji: "🍞", en: "bread", zh: "麵包" },
        { emoji: "🌾", en: "rice", zh: "稻米", item: "rice" },
        { emoji: "🥔", en: "potatoes", zh: "馬鈴薯", item: "potato" },
        { emoji: "🎶", en: "singing", zh: "唱歌" } ],
      dislikes: [{ emoji: "🔥", en: "burnt bread", zh: "烤焦的麵包" }, { emoji: "⏰", en: "being late", zh: "遲到" }],
      intro: "Good morning! I'm Nora, the baker. I get up very early to make bread. Please come and eat with me!",
      introZh: "早安！我是 Nora，麵包師。我每天很早起來做麵包。歡迎來跟我一起吃！",
      motto: "Bread tastes better with friends.", mottoZh: "跟朋友一起吃，麵包更好吃。",
      about: "Nora 聽說小鎮廣場變乾淨了，就先搬來開麵包店，兒子 Ben 之後也會來。她每天天還沒亮就起床烤麵包，一邊揉麵一邊唱歌。她常常忘記東西放哪裡，但從來不會忘記大家喜歡吃什麼。",
      welcome: "Hello, neighbor! I just moved to your town. My son Ben will join me soon. I opened a small bakery by the plaza. Come and try my bread!",
      welcomeZh: "哈囉，鄰居！我剛搬來你們小鎮，兒子 Ben 很快也會來。我在廣場旁開了一家小麵包店，來嚐嚐我的麵包吧！",
    },
    Ben: {
      emoji: "🧒", img: "img/ben.png", zh: "Ben，愛打鼓的男孩", arrive: 130,
      role: { en: "student", zh: "學生" }, place: { en: "the room above the bakery", zh: "麵包店樓上" },
      traits: [{ en: "energetic", zh: "精力旺盛" }, { en: "funny", zh: "很搞笑" }, { en: "a little careless", zh: "有點粗心" }],
      likes: [
        { emoji: "⚽", en: "soccer", zh: "足球" },
        { emoji: "🥁", en: "playing the drums", zh: "打鼓" },
        { emoji: "🏮", en: "lanterns", zh: "燈籠", item: "lantern" },
        { emoji: "🍙", en: "rice cakes", zh: "米糕", item: "rice" } ],
      dislikes: [{ emoji: "🌧️", en: "rainy days", zh: "下雨天" }, { emoji: "🛏️", en: "going to bed early", zh: "早早上床睡覺" }],
      intro: "Hey! I'm Ben. I'm twelve years old. I love soccer and music. One day I want to play the drums on a big stage!",
      introZh: "嘿！我是 Ben，今年十二歲。我喜歡足球和音樂。總有一天，我要在大舞台上打鼓！",
      motto: "Let's make some noise!", mottoZh: "我們來熱鬧一下吧！",
      about: "Ben 是 Nora 的兒子，跟你差不多大。他最討厭下雨天，因為不能踢球——剛好跟喜歡下雨天的 Mia 相反。他打鼓很大聲，Mia 會摀住耳朵，但每次都還是笑著聽完。",
      welcome: "Hi! I'm Ben, Nora's son. The plaza looks so cool now! Can we build a stage? I want to play the drums there.",
      welcomeZh: "嗨！我是 Ben，Nora 的兒子。廣場現在好酷！我們可以搭一座舞台嗎？我想在那裡打鼓。",
    },
    Sam: {
      emoji: "🧓", img: "img/sam.png", zh: "Sam，旅行商人", arrive: 200,
      role: { en: "traveling merchant", zh: "旅行商人" }, place: { en: "his cart by the gate", zh: "小鎮入口的推車" },
      traits: [{ en: "calm", zh: "沉穩" }, { en: "smart", zh: "聰明" }, { en: "a little mysterious", zh: "有點神祕" }],
      likes: [
        { emoji: "🗺️", en: "old maps", zh: "舊地圖" },
        { emoji: "🍵", en: "hot tea", zh: "熱茶" },
        { emoji: "🪨", en: "pretty stones", zh: "漂亮的石頭", item: "stone" },
        { emoji: "🌳", en: "trees", zh: "樹", item: "tree" } ],
      dislikes: [{ emoji: "📦", en: "messy shelves", zh: "亂七八糟的貨架" }, { emoji: "⌛", en: "waiting in line", zh: "排隊等候" }],
      intro: "Hello there. I'm Sam. I travel from town to town and sell things from far away. This town is lively now, so I want to stay a while.",
      introZh: "你好。我是 Sam。我從一個小鎮旅行到另一個小鎮，賣遠方來的東西。這個小鎮現在很熱鬧，所以我想待一陣子。",
      motto: "A fair price makes everyone happy.", mottoZh: "公道的價錢讓大家都開心。",
      about: "Sam 推著一台裝滿寶物的木推車，走過很多地方。他聽說這個小鎮越來越熱鬧，就決定留下來。他說等小鎮再繁榮一點，就要在廣場旁邊開一個市集。",
      welcome: "Hello! This town looks happy. Can I park my cart here? I want to open a market here one day.",
      welcomeZh: "你好！這個小鎮看起來好快樂。我可以把推車停在這裡嗎？我希望有一天在這裡開個市集。",
    },
  };

  // 每週 5 張卡（2 信、2 對話、1 委託）＋ 1 段心事件。週次用課表週的週日。
  // 每週的核心字取自 curriculum.js 當週單字；keep 是收進生活冊的那一句。
  var WEEKS = {
    "2026-10-04": {
      theme: "圖書館與閱讀",
      targets: ["story", "comic", "magazine", "aloud", "title", "letter", "poem", "library"],
      cards: [
        { id: "w1-mail-mia", type: "letter", speaker: "Mia",
          en: "Hi! I'm Mia. I work at the town library. We have a lot of comics and magazines. Come and read a story with me!",
          zh: "嗨！我是 Mia，在小鎮圖書館工作。我們有很多漫畫和雜誌。來跟我一起讀故事吧！",
          keep: "Come and read a story with me!" },
        { id: "w1-mail-leo", type: "letter", speaker: "Leo",
          en: "Hello, neighbor! I'm Leo. The plaza is old and dirty. Can you help me fix it? I need some wood and two crops.",
          zh: "哈囉，鄰居！我是 Leo。廣場又舊又髒，你可以幫我修理嗎？我需要一些木材和兩份作物。",
          keep: "Can you help me fix it?" },
        { id: "w1-talk-mia", type: "talk", speaker: "Mia",
          en: "Do you like reading aloud?", zh: "你喜歡大聲朗讀嗎？",
          choices: [
            { id: "a", en: "Yes, I like reading aloud.", zh: "喜歡，我喜歡大聲念。" },
            { id: "b", en: "I like reading quietly.", zh: "我喜歡安靜地讀。" } ] },
        { id: "w1-talk-leo", type: "talk", speaker: "Leo",
          en: "What do you want to grow on your farm?", zh: "你想在農場種什麼？",
          choices: [
            { id: "a", en: "I want to grow carrots.", zh: "我想種紅蘿蔔。" },
            { id: "b", en: "I want to grow potatoes.", zh: "我想種馬鈴薯。" },
            { id: "c", en: "I want to grow rice.", zh: "我想種稻米。" } ] },
        { id: "w1-quest-mia", type: "quest", speaker: "Mia",
          en: "We will have a reading party soon. Please bring two carrots for the snacks.",
          zh: "我們很快會辦讀書會。請帶兩根紅蘿蔔來當點心。",
          quest: { item: "carrot", n: 2 }, keep: "Please bring two carrots." },
      ],
      story: { id: "w1-story-mia", speaker: "Mia", title: "沒有書名的書",
        needCard: "w1-mail-mia",
        lines: [
          { en: "Mia shows you an old book.", zh: "Mia 拿出一本舊書給你看。" },
          { en: "\"This book has no title,\" she says.", zh: "「這本書沒有書名。」她說。" },
          { en: "\"It is a story about a happy farm.\"", zh: "「它是一個關於快樂農場的故事。」" },
          { en: "\"Can you give it a title?\"", zh: "「你可以幫它取個書名嗎？」" } ],
        speak: "Let's call it The Happy Farm.", speakZh: "我們叫它《快樂農場》吧。" },
    },
    "2026-10-11": {
      theme: "朋友與情緒",
      targets: ["nervous", "calm", "lovely", "sorry", "glad", "excited", "joke", "laugh"],
      cards: [
        { id: "w2-mail-leo", type: "letter", speaker: "Leo",
          en: "Thank you for your help! I was nervous about the plaza, but now I feel calm. You are a lovely neighbor.",
          zh: "謝謝你的幫忙！我本來很擔心廣場，現在我覺得很安心。你是很棒的鄰居。",
          keep: "You are a lovely neighbor." },
        { id: "w2-mail-mia", type: "letter", speaker: "Mia",
          en: "I'm sorry I was not at the library yesterday. I felt unhappy and wanted to be alone. Today I'm glad again!",
          zh: "抱歉我昨天不在圖書館。我心情不好，想一個人靜一靜。今天我又開心起來了！",
          keep: "Today I'm glad again!" },
        { id: "w2-talk-leo", type: "talk", speaker: "Leo",
          en: "How do you feel today?", zh: "你今天覺得怎麼樣？",
          choices: [
            { id: "a", en: "I feel excited!", zh: "我覺得很興奮！" },
            { id: "b", en: "I feel a little bored.", zh: "我覺得有點無聊。" },
            { id: "c", en: "I feel nervous.", zh: "我覺得有點緊張。" } ] },
        { id: "w2-talk-mia", type: "talk", speaker: "Mia",
          en: "Do you want to hear a joke?", zh: "你想聽一個笑話嗎？",
          choices: [
            { id: "a", en: "Sure! I love jokes.", zh: "好啊！我超愛笑話。" },
            { id: "b", en: "Maybe later, thanks.", zh: "晚一點好了，謝謝。" } ] },
        { id: "w2-quest-leo", type: "quest", speaker: "Leo",
          en: "My friends are coming to the plaza. Please bring two potatoes. We will cook together and laugh a lot.",
          zh: "我的朋友要來廣場。請帶兩顆馬鈴薯來。我們會一起煮東西、一起大笑。",
          quest: { item: "potato", n: 2 }, keep: "We will cook together and laugh a lot." },
      ],
      story: { id: "w2-story-leo", speaker: "Leo", title: "壞掉的椅子",
        needCard: "w2-mail-leo",
        lines: [
          { en: "Leo is shouting at a broken chair.", zh: "Leo 對著一張壞掉的椅子大吼。" },
          { en: "Then he stops and smiles.", zh: "接著他停下來，笑了。" },
          { en: "\"Sorry, I was angry,\" he says.", zh: "「抱歉，我剛剛在生氣。」他說。" },
          { en: "\"Shouting does not fix chairs. Friends do.\"", zh: "「大吼修不好椅子，朋友才修得好。」" } ],
        speak: "Let's fix it together.", speakZh: "我們一起修吧。" },
    },
  };

  // 每張卡、每段故事標上它所屬的週，規則用它判斷開放了沒
  Object.keys(WEEKS).forEach(function (wk) {
    WEEKS[wk].cards.forEach(function (x) { x.week = wk; });
    WEEKS[wk].story.week = wk;
  });

  var api = { CROPS: CROPS, SELL: SELL, BUY: BUY, DECOR: DECOR, COST: COST, NAME: NAME,
              LANDMARKS: LANDMARKS, PROSPERITY: PROSPERITY, VILLAGERS: VILLAGERS, WEEKS: WEEKS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.TownContent = api;
})(typeof window !== "undefined" ? window : this);
