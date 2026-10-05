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
  var NAME = { wood: "木材", stone: "石頭", crop: "作物", carrot_seed: "紅蘿蔔種子", potato_seed: "馬鈴薯種子" };

  // 小鎮地標。小樣只有廣場的前兩階段。
  var LANDMARKS = {
    plaza: {
      zh: "小鎮廣場", en: "the plaza",
      look: ["🚧 雜草和破木板", "🧹 清乾淨了，有一張長桌", "🎪 掛上燈串，可以辦活動"],
      stages: [
        { ap: 6, money: 20, items: { crop: 2, wood: 5 }, done: "清掉雜草，Leo 用木材做了一張長桌" },
        { ap: 6, money: 20, items: { crop: 2, stone: 5 }, done: "鋪好石板路，掛上燈串" },
      ],
    },
  };

  var VILLAGERS = {
    Mia: { emoji: "👩‍🦰", zh: "Mia，圖書館員" },
    Leo: { emoji: "🧔", zh: "Leo，木匠" },
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
              LANDMARKS: LANDMARKS, VILLAGERS: VILLAGERS, WEEKS: WEEKS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.TownContent = api;
})(typeof window !== "undefined" ? window : this);
