// 每週「整句填空 / 閱讀短文 / 句子重組」內容（配合當週單字＋當月文法）。
// 單字題(英聽選擇/圖片)由引擎從 curriculum 該週 words 動態出；這裡放需要整句/短文語音的部分。
// key = "<month>-<weekN>"。語音：audio/weekdrill/<key>/  (lb0..、passage、ro0..)
const WEEK_DRILLS = {
  "2026-07-1": {            // 第1週 旅行與時間 · 過去式/未來式
    listenBlank: [
      { full: "I bought a ticket for the train.", display: "I bought a ___ for the train.", answer: "ticket" },
      { full: "We will travel to Japan next month.", display: "We will ___ to Japan next month.", answer: "travel" },
      { full: "She visited a famous museum yesterday.", display: "She ___ a famous museum yesterday.", answer: "visited" },
      { full: "They are going to stay at a hotel.", display: "They are going to stay at a ___.", answer: "hotel" },
      { full: "Don't forget your passport and map.", display: "Don't forget your ___ and map.", answer: "passport" }
    ],
    reading: {
      passage: "Last summer, my family took a trip to Taitung. We arrived by train and stayed at a small hotel near the beach. Every morning, I explored the mountains and took many photos. We ate local food and bought some gifts for our friends. Next year, we are going to travel abroad for the first time. I can't wait to visit a new country.",
      questions: [
        { q: "Where did the family go last summer?", choices: ["Taitung", "Japan", "Taipei", "Tainan"], answer: "Taitung" },
        { q: "How did they arrive?", choices: ["By train", "By plane", "By car", "By bus"], answer: "By train" },
        { q: "What did they buy?", choices: ["Gifts", "Tickets", "Maps", "Hats"], answer: "Gifts" },
        { q: "What are they going to do next year?", choices: ["Travel abroad", "Stay home", "Move house", "Buy a car"], answer: "Travel abroad" }
      ]
    },
    reorder: [
      { sentence: "We arrived at the airport early.", chunks: ["We", "arrived", "at the", "airport", "early."] },
      { sentence: "I will visit a famous museum.", chunks: ["I", "will", "visit", "a famous", "museum."] },
      { sentence: "They bought tickets for the trip.", chunks: ["They", "bought", "tickets", "for the", "trip."] },
      { sentence: "She is going to travel abroad next year.", chunks: ["She", "is going to", "travel", "abroad", "next year."] }
    ]
  },
  "2026-07-2": {            // 第2週 描述與經驗 · 過去式/未來式
    listenBlank: [
      { full: "The hotel was very comfortable.", display: "The hotel was very ___.", answer: "comfortable" },
      { full: "The night market was very crowded.", display: "The night market was very ___.", answer: "crowded" },
      { full: "The food was cheap and delicious.", display: "The food was ___ and delicious.", answer: "cheap" },
      { full: "I think tomorrow will be wonderful.", display: "I think tomorrow will be ___.", answer: "wonderful" },
      { full: "The old temple was very famous.", display: "The old temple was very ___.", answer: "famous" }
    ],
    reading: {
      passage: "Last weekend, we visited an old town in the mountains. The streets were narrow and a little crowded, but the view was wonderful. We stayed in a small, comfortable hotel. The local food was cheap and delicious, and the people were friendly. Next month, we are going to visit a modern city by the sea. It will be a very different but exciting trip.",
      questions: [
        { q: "Where did they visit last weekend?", choices: ["An old town", "A modern city", "A beach", "A museum"], answer: "An old town" },
        { q: "How was the hotel?", choices: ["Small and comfortable", "Big and expensive", "Old and dirty", "Far away"], answer: "Small and comfortable" },
        { q: "How was the local food?", choices: ["Cheap and delicious", "Expensive", "Bad", "Spicy"], answer: "Cheap and delicious" },
        { q: "Where are they going next month?", choices: ["A modern city", "The mountains", "Abroad", "Home"], answer: "A modern city" }
      ]
    },
    reorder: [
      { sentence: "The hotel was very comfortable.", chunks: ["The", "hotel", "was", "very", "comfortable."] },
      { sentence: "The city will be very modern.", chunks: ["The", "city", "will be", "very", "modern."] },
      { sentence: "The old town was wonderful.", chunks: ["The", "old", "town", "was", "wonderful."] },
      { sentence: "We saw many famous places.", chunks: ["We", "saw", "many", "famous", "places."] }
    ]
  }
};
function weekDrillFor(monthStr, weekN) { return WEEK_DRILLS[monthStr + "-" + weekN] || null; }
if (typeof module !== "undefined" && module.exports) module.exports = { WEEK_DRILLS, weekDrillFor };
