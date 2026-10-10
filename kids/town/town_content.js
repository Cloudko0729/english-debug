// 四季小鎮：內容資料（第一階段小樣）
// 數值依設計報告《四季小鎮》的定案經濟：作物每投入 1 體力最多淨賺 2 幣、建築不生錢、價格固定。
(function (root) {
  "use strict";

  // days＝種下幾天後成熟（不照料也會熟）；unlock＝地標修到第幾階才開賣種子
  var CROPS = {
    rice:    { en: "rice",    zh: "稻米",   emoji: "🌾", freeSeed: true },
    carrot:  { en: "carrot",  zh: "紅蘿蔔", emoji: "🥕" },
    potato:  { en: "potato",  zh: "馬鈴薯", emoji: "🥔" },
    corn:    { en: "corn",    zh: "玉米",   emoji: "🌽", unlock: { market: 1 } },
    pumpkin: { en: "pumpkin", zh: "南瓜",   emoji: "🎃", unlock: { market: 1 }, days: 4 },
  };
  // 售價：每片扣掉種子錢都是淨 4 幣，播種 2 體力 → 不照料時每體力 2 幣。
  // 照料一天 +10% 收成 2 個的機率（3 天作物最多 30%），8 片田全照料時期望值約每體力 2.3 幣。
  // 南瓜長 4 天、照料最多 40%，所以售價跟紅蘿蔔一樣，全照料才不會超過每體力 2.4 幣
  var SELL = { rice: 4, carrot: 5, potato: 5, corn: 5, pumpkin: 5 };
  // 照料：每照料一天，收成時拿到 2 個的機率 +10%
  var CARE_BONUS = 10;
  var DECOR = {
    flowers: { en: "flowers",  zh: "花圃",   emoji: "🌼" },
    tree:    { en: "tree",     zh: "小樹",   emoji: "🌳" },
    lantern: { en: "lantern",  zh: "燈籠",   emoji: "🏮" },
    bench:   { en: "bench",    zh: "長椅",   emoji: "🪑" },
    mailbox: { en: "mailbox",  zh: "信箱",   emoji: "📮" },
    rock:    { en: "rock",     zh: "石頭堆", emoji: "🪨" },
    fountain: { en: "fountain", zh: "噴水池", emoji: "⛲", unlock: { market: 2 } },
  };
  var BUY = { carrot_seed: 1, potato_seed: 1, corn_seed: 1, pumpkin_seed: 1,
              flowers: 10, tree: 10, lantern: 10, bench: 10, mailbox: 10, rock: 10, fountain: 20 };
  var COST = { plant: 2, care: 1, gather: 2 };
  var NAME = { wood: "木材", stone: "石頭", crop: "作物", carrot_seed: "紅蘿蔔種子", potato_seed: "馬鈴薯種子",
               corn_seed: "玉米種子", pumpkin_seed: "南瓜種子",
               rice: "稻米", carrot: "紅蘿蔔", potato: "馬鈴薯", corn: "玉米", pumpkin: "南瓜", ap: "體力", money: "小鎮幣",
               flowers: "花圃", tree: "小樹", lantern: "燈籠", bench: "長椅", mailbox: "信箱", rock: "石頭堆", fountain: "噴水池" };

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
    // 市集：Sam 的推車停下來的地方。after＝前一個地標全部修好才開放。
    // 第 1 階修好開賣玉米、南瓜種子；第 2 階修好開賣噴水池。
    market: {
      zh: "週末市集", en: "the market", after: "plaza",
      look: ["🌾 小鎮入口的空地", "🛖 搭好木頭攤位", "🪧 掛上大招牌，擺滿了花", "🏪 熱鬧的週末市集"],
      stages: [
        { title: "搭起攤位", done: "木頭攤位搭好了，Sam 的推車有了固定的位子；商店開始賣玉米和南瓜種子", tasks: [
          { id: "m1-wood", by: "Sam", need: { item: "wood", n: 5 },
            en: "A market needs stalls. Can you bring five pieces of wood?", zh: "市集需要攤位。你可以帶五塊木材來嗎？" },
          { id: "m1-build", by: "Leo", need: { item: "ap", n: 6 },
            en: "I will build the stalls. Can you help me hold the boards?", zh: "我來搭攤位。你可以幫我扶著木板嗎？" },
          { id: "m1-stone", by: "Sam", need: { item: "stone", n: 4 },
            en: "The ground is too soft. Please bring four stones for the floor.", zh: "地面太軟了。請帶四顆石頭來鋪地板。" },
          { id: "m1-potato", by: "Nora", need: { item: "potato", n: 3 },
            en: "I want to sell potato bread at the market. I need three potatoes.", zh: "我想在市集賣馬鈴薯麵包，需要三顆馬鈴薯。" },
          { id: "m1-lantern", by: "Ben", need: { item: "lantern", n: 1 },
            en: "Let's hang a lantern on the gate. Then people can find us at night.", zh: "我們在大門掛一個燈籠吧，這樣晚上大家也找得到我們。" },
        ] },
        { title: "招牌與花", done: "掛上大招牌，攤位前擺滿了花；商店開始賣噴水池", tasks: [
          { id: "m2-corn", by: "Sam", need: { item: "corn", n: 3 },
            // an ear of corn＝一根玉米
            en: "Can you grow some corn for me? I need three ears of corn for my stall.", zh: "你可以幫我種一些玉米嗎？我的攤位需要三根玉米。" },
          { id: "m2-pumpkin", by: "Nora", need: { item: "pumpkin", n: 2 },
            en: "I'm making pumpkin soup! Can you bring two pumpkins?", zh: "我要煮南瓜湯！你可以帶兩顆南瓜來嗎？" },
          { id: "m2-flowers", by: "Lily", need: { item: "flowers", n: 2 },
            en: "Flowers make the market look nice. Can you help me add two flower beds?", zh: "花讓市集變漂亮。你可以幫我多擺兩個花圃嗎？" },
          { id: "m2-sign", by: "Ben", need: { item: "ap", n: 6 },
            en: "Let's paint a big sign for the market. Can you help me?", zh: "我們來幫市集畫一塊大招牌吧。你可以幫我嗎？" },
          { id: "m2-wood", by: "Leo", need: { item: "wood", n: 6 },
            en: "The tables are too small. I need six more pieces of wood.", zh: "桌子太小了，我還需要六塊木材。" },
        ] },
        { title: "第一次市集日", done: "第一次市集日！大家都來逛，Sam 說這是他見過最溫暖的小鎮", tasks: [
          { id: "m3-mailbox", by: "Tom", need: { item: "mailbox", n: 1 },
            en: "People will send letters about the market. We need a mailbox here.", zh: "大家會寄信聊市集的事，這裡需要一個信箱。" },
          { id: "m3-carry", by: "Tom", need: { item: "ap", n: 8 },
            en: "So many boxes! Help me carry them to the stalls.", zh: "箱子好多！幫我把它們搬到攤位上。" },
          { id: "m3-pumpkin", by: "Sam", need: { item: "pumpkin", n: 3 },
            en: "Big pumpkins make people stop and look. Please bring three.", zh: "大南瓜會讓大家停下來看。請帶三顆來。" },
          { id: "m3-tree", by: "Lily", need: { item: "tree", n: 1 },
            en: "A tree gives us shade. Can we plant one by the stalls?", zh: "樹可以給我們遮陰。我們可以在攤位旁邊種一棵嗎？" },
          { id: "m3-rice", by: "Nora", need: { item: "rice", n: 4 },
            en: "I'll make rice balls for the shoppers. I need four bags of rice.", zh: "我要幫來逛的人做飯糰，需要四袋稻米。" },
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
      { at: 270, zh: "有市集的小鎮", emoji: "🛖" },
      { at: 340, zh: "人來人往的小鎮", emoji: "🏪" },
      { at: 420, zh: "四季都熱鬧的小鎮", emoji: "🌟" },
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
    Lily: {
      emoji: "💐", img: "img/lily.png", zh: "Lily，花店老闆", arrive: 270,
      role: { en: "florist", zh: "花店老闆" }, place: { en: "my flower cart", zh: "我的花車" },
      traits: [{ en: "kind", zh: "善良" }, { en: "dreamy", zh: "愛做夢" }, { en: "a little messy", zh: "有點亂" }],
      likes: [
        { emoji: "🌼", en: "flowers", zh: "花", item: "flowers" },
        { emoji: "🌳", en: "trees", zh: "樹", item: "tree" },
        { emoji: "🎨", en: "drawing", zh: "畫畫" },
        { emoji: "☀️", en: "sunny mornings", zh: "晴朗的早晨" } ],
      dislikes: [{ emoji: "🌬️", en: "cold wind", zh: "冷風" }, { emoji: "👣", en: "people stepping on flowers", zh: "有人踩到花" }],
      intro: "Hi! I'm Lily. I sell flowers. I think every town needs more colors!",
      introZh: "嗨！我是 Lily，我賣花。我覺得每個小鎮都需要多一點顏色！",
      motto: "Let's add some color!", mottoZh: "我們來加一點顏色吧！",
      about: "Lily 是 Mia 從小一起長大的好朋友。她聽 Mia 介紹小鎮，就帶著一整車的花搬來。她的攤位總是有點亂，花盆和畫筆堆在一起，但每個經過的人都會忍不住停下來看。",
      welcome: "Hello! I'm Lily, Mia's old friend. Mia told me about your town. Can I sell flowers here?",
      welcomeZh: "哈囉！我是 Lily，Mia 的老朋友。Mia 跟我介紹了你們的小鎮。我可以在這裡賣花嗎？",
    },
    Tom: {
      emoji: "📬", img: "img/tom.png", zh: "Tom，郵差", arrive: 340,
      role: { en: "mail carrier", zh: "郵差" }, place: { en: "the post office by the market", zh: "市集旁的郵局" },
      traits: [{ en: "friendly", zh: "友善" }, { en: "fast", zh: "動作很快" }, { en: "talkative", zh: "很愛聊天" }],
      likes: [
        { emoji: "📮", en: "mailboxes", zh: "信箱", item: "mailbox" },
        { emoji: "🚶", en: "long walks", zh: "散步走很遠" },
        { emoji: "🍙", en: "rice balls", zh: "飯糰", item: "rice" },
        { emoji: "💬", en: "talking with everyone", zh: "跟大家聊天" } ],
      dislikes: [{ emoji: "✉️", en: "lost letters", zh: "寄丟的信" }, { emoji: "☔", en: "wet letters", zh: "被雨淋濕的信" }],
      intro: "Hi there! I'm Tom, the mail carrier. I walk all over town every day. I know everyone's name!",
      introZh: "你好！我是 Tom，郵差。我每天走遍整個小鎮，我知道每個人的名字！",
      motto: "Every letter has a story.", mottoZh: "每一封信都有一個故事。",
      about: "Tom 以前每個月才來小鎮送一次信。現在小鎮越來越熱鬧，信多到一個月送不完，他乾脆搬來住。他走路很快、話很多，送一封信常常要聊半小時。",
      welcome: "Good morning! I'm Tom. Your town gets so many letters now, so I moved here to help. I will bring your mail every day!",
      welcomeZh: "早安！我是 Tom。你們小鎮現在的信好多，所以我搬來幫忙。我每天都會幫你送信！",
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

  var api = { CROPS: CROPS, SELL: SELL, BUY: BUY, DECOR: DECOR, COST: COST, NAME: NAME, CARE_BONUS: CARE_BONUS,
              LANDMARKS: LANDMARKS, PROSPERITY: PROSPERITY, VILLAGERS: VILLAGERS, WEEKS: WEEKS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.TownContent = api;
})(typeof window !== "undefined" ? window : this);
