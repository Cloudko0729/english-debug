// 每週「整句填空 / 閱讀短文 / 句子重組」題庫池（配合當週單字＋當月文法）。
// 引擎依日期抽子集（填空 5/池、重組 4/池、短文 1/池），讓同一週每天不一樣。
// key = "<month>-<weekN>"。語音：audio/weekdrill/<key>/  (lb0..、ro0..、passage0..)
const WEEK_DRILLS = {
  "2026-07-1": {            // 第1週 旅行與時間 · 過去式/未來式
    listenBlank: [
      { full: "I bought a ticket for the train.", display: "I bought a ___ for the train.", answer: "ticket" },
      { full: "We will travel to Japan next month.", display: "We will ___ to Japan next month.", answer: "travel" },
      { full: "She visited a famous museum yesterday.", display: "She ___ a famous museum yesterday.", answer: "visited" },
      { full: "They are going to stay at a hotel.", display: "They are going to stay at a ___.", answer: "hotel" },
      { full: "Don't forget your passport and map.", display: "Don't forget your ___ and map.", answer: "passport" },
      { full: "We arrived at the airport very early.", display: "We arrived at the ___ very early.", answer: "airport" },
      { full: "He took many photos on the beach.", display: "He took many photos on the ___.", answer: "beach" },
      { full: "I am going to explore the mountains tomorrow.", display: "I am going to ___ the mountains tomorrow.", answer: "explore" }
    ],
    reorder: [
      { sentence: "We arrived at the airport early.", chunks: ["We", "arrived", "at the", "airport", "early."] },
      { sentence: "I will visit a famous museum.", chunks: ["I", "will", "visit", "a famous", "museum."] },
      { sentence: "They bought tickets for the trip.", chunks: ["They", "bought", "tickets", "for the", "trip."] },
      { sentence: "She is going to travel abroad next year.", chunks: ["She", "is going to", "travel", "abroad", "next year."] },
      { sentence: "We stayed at a small hotel.", chunks: ["We", "stayed", "at a", "small", "hotel."] },
      { sentence: "I took many photos yesterday.", chunks: ["I", "took", "many", "photos", "yesterday."] },
      { sentence: "He will explore the mountains.", chunks: ["He", "will", "explore", "the", "mountains."] },
      { sentence: "They are going to the beach tomorrow.", chunks: ["They", "are going", "to the", "beach", "tomorrow."] }
    ],
    reading: [
      {
        passage: "Last summer, my family took a trip to Taitung. We arrived by train and stayed at a small hotel near the beach. Every morning, I explored the mountains and took many photos. We ate local food and bought some gifts for our friends. Next year, we are going to travel abroad for the first time. I can't wait to visit a new country.",
        questions: [
          { q: "Where did the family go last summer?", choices: ["Taitung", "Japan", "Taipei", "Tainan"], answer: "Taitung" },
          { q: "How did they arrive?", choices: ["By train", "By plane", "By car", "By bus"], answer: "By train" },
          { q: "What did they buy?", choices: ["Gifts", "Tickets", "Maps", "Hats"], answer: "Gifts" },
          { q: "What are they going to do next year?", choices: ["Travel abroad", "Stay home", "Move house", "Buy a car"], answer: "Travel abroad" }
        ]
      },
      {
        passage: "Yesterday was a busy day. We went to the airport early in the morning to meet my grandparents. After that, we visited a famous old temple and took a lot of photos. At noon, we ate noodles at a small shop. Tomorrow, we are going to take a train to the mountains. I think it will be a wonderful weekend.",
        questions: [
          { q: "Where did they go in the morning?", choices: ["The airport", "The beach", "The museum", "School"], answer: "The airport" },
          { q: "Who did they meet?", choices: ["Grandparents", "Friends", "Teachers", "Cousins"], answer: "Grandparents" },
          { q: "What did they eat at noon?", choices: ["Noodles", "Rice", "Bread", "Pizza"], answer: "Noodles" },
          { q: "Where are they going tomorrow?", choices: ["The mountains", "Abroad", "The beach", "Home"], answer: "The mountains" }
        ]
      },
      {
        passage: "My sister loves traveling. Last month, she visited three different cities. She bought a small gift in each place and sent me a postcard. She said the hotels were comfortable and the people were kind. Next week, she is going to fly to a new country. She is going to learn about its culture and try new food. I hope she has a safe trip.",
        questions: [
          { q: "How many cities did she visit last month?", choices: ["Three", "Two", "Four", "Five"], answer: "Three" },
          { q: "What did she buy in each place?", choices: ["A small gift", "A ticket", "A map", "A hat"], answer: "A small gift" },
          { q: "How were the hotels?", choices: ["Comfortable", "Expensive", "Dirty", "Noisy"], answer: "Comfortable" },
          { q: "What is she going to do next week?", choices: ["Fly to a new country", "Stay home", "Move house", "Buy a car"], answer: "Fly to a new country" }
        ]
      },
      {
        passage: "Last winter, we went skiing in the mountains. The weather was cold, but the view was beautiful. We stayed at a warm hotel and drank hot cocoa every night. I fell down many times, but I had a lot of fun. Next winter, I am going to learn snowboarding. I think it will be even more exciting.",
        questions: [
          { q: "What did they do last winter?", choices: ["Went skiing", "Went swimming", "Went camping", "Went fishing"], answer: "Went skiing" },
          { q: "How was the weather?", choices: ["Cold", "Hot", "Rainy", "Windy"], answer: "Cold" },
          { q: "What did they drink at night?", choices: ["Hot cocoa", "Cold juice", "Tea", "Milk"], answer: "Hot cocoa" },
          { q: "What is the writer going to learn next winter?", choices: ["Snowboarding", "Skiing", "Skating", "Swimming"], answer: "Snowboarding" }
        ]
      },
      {
        passage: "My uncle is a pilot, so he travels a lot. Last week, he flew to three countries. He always brings me a small gift from each place. This time, he gave me a map of the world and some foreign coins. When I grow up, I am going to travel around the world like him. I will visit every continent and take many photos.",
        questions: [
          { q: "What is the uncle's job?", choices: ["A pilot", "A driver", "A teacher", "A doctor"], answer: "A pilot" },
          { q: "How many countries did he fly to last week?", choices: ["Three", "Two", "Four", "Five"], answer: "Three" },
          { q: "What did he give the writer this time?", choices: ["A map and coins", "A book", "A hat", "A ticket"], answer: "A map and coins" },
          { q: "What is the writer going to do when older?", choices: ["Travel around the world", "Become a pilot", "Stay home", "Buy a plane"], answer: "Travel around the world" }
        ]
      },
      {
        passage: "Yesterday, our class went on a school trip to the science museum. We took a bus and arrived at nine o'clock. Inside, we saw many cool machines and watched a space show. My favorite part was the dinosaur room. We ate lunch in the park nearby. Next month, we are going to visit a farm and learn about animals.",
        questions: [
          { q: "Where did the class go yesterday?", choices: ["The science museum", "The zoo", "The beach", "A farm"], answer: "The science museum" },
          { q: "How did they get there?", choices: ["By bus", "By train", "By car", "On foot"], answer: "By bus" },
          { q: "What was the writer's favorite part?", choices: ["The dinosaur room", "The space show", "The machines", "Lunch"], answer: "The dinosaur room" },
          { q: "Where are they going next month?", choices: ["A farm", "A museum", "The beach", "Abroad"], answer: "A farm" }
        ]
      },
      {
        passage: "Last summer, my family camped near a big lake. We put up our tent and cooked dinner outside. At night, we saw thousands of stars. In the morning, I went fishing with my dad and caught two fish. It was quiet and peaceful. Next year, we are going to camp in a forest and ride bikes on the mountain trails.",
        questions: [
          { q: "Where did they camp last summer?", choices: ["Near a lake", "In a forest", "On a mountain", "By the sea"], answer: "Near a lake" },
          { q: "What did they see at night?", choices: ["Stars", "Birds", "Fish", "Boats"], answer: "Stars" },
          { q: "What did the writer catch?", choices: ["Two fish", "A bird", "Nothing", "A frog"], answer: "Two fish" },
          { q: "Where are they going to camp next year?", choices: ["In a forest", "Near a lake", "On a beach", "In a city"], answer: "In a forest" }
        ]
      }
    ]
  },
  "2026-07-2": {            // 第2週 描述與經驗 · 過去式/未來式
    listenBlank: [
      { full: "The hotel was very comfortable.", display: "The hotel was very ___.", answer: "comfortable" },
      { full: "The night market was very crowded.", display: "The night market was very ___.", answer: "crowded" },
      { full: "The food was cheap and delicious.", display: "The food was ___ and delicious.", answer: "cheap" },
      { full: "I think tomorrow will be wonderful.", display: "I think tomorrow will be ___.", answer: "wonderful" },
      { full: "The old temple was very famous.", display: "The old temple was very ___.", answer: "famous" },
      { full: "The new building is very modern.", display: "The new building is very ___.", answer: "modern" },
      { full: "The street was too noisy at night.", display: "The street was too ___ at night.", answer: "noisy" },
      { full: "The library was very quiet.", display: "The library was very ___.", answer: "quiet" }
    ],
    reorder: [
      { sentence: "The hotel was very comfortable.", chunks: ["The", "hotel", "was", "very", "comfortable."] },
      { sentence: "The city will be very modern.", chunks: ["The", "city", "will be", "very", "modern."] },
      { sentence: "The old town was wonderful.", chunks: ["The", "old", "town", "was", "wonderful."] },
      { sentence: "We saw many famous places.", chunks: ["We", "saw", "many", "famous", "places."] },
      { sentence: "The market was very crowded.", chunks: ["The", "market", "was", "very", "crowded."] },
      { sentence: "The new park is very popular.", chunks: ["The", "new park", "is", "very", "popular."] },
      { sentence: "The street was too noisy.", chunks: ["The", "street", "was", "too", "noisy."] },
      { sentence: "The library will be quiet today.", chunks: ["The", "library", "will be", "quiet", "today."] }
    ],
    reading: [
      {
        passage: "Last weekend, we visited an old town in the mountains. The streets were narrow and a little crowded, but the view was wonderful. We stayed in a small, comfortable hotel. The local food was cheap and delicious, and the people were friendly. Next month, we are going to visit a modern city by the sea. It will be a very different but exciting trip.",
        questions: [
          { q: "Where did they visit last weekend?", choices: ["An old town", "A modern city", "A beach", "A museum"], answer: "An old town" },
          { q: "How was the hotel?", choices: ["Small and comfortable", "Big and expensive", "Old and dirty", "Far away"], answer: "Small and comfortable" },
          { q: "How was the local food?", choices: ["Cheap and delicious", "Expensive", "Bad", "Spicy"], answer: "Cheap and delicious" },
          { q: "Where are they going next month?", choices: ["A modern city", "The mountains", "Abroad", "Home"], answer: "A modern city" }
        ]
      },
      {
        passage: "My new school is very different from my old one. The buildings are modern and the library is big and quiet. My classroom is on the fifth floor, so the view is wonderful. At first, I thought it would be hard, but my classmates are friendly. Next week, we are going to have a sports day. I think it will be a fun and busy day.",
        questions: [
          { q: "How are the school buildings?", choices: ["Modern", "Old", "Small", "Dirty"], answer: "Modern" },
          { q: "How is the library?", choices: ["Big and quiet", "Small and noisy", "Old", "Dark"], answer: "Big and quiet" },
          { q: "How are the classmates?", choices: ["Friendly", "Shy", "Rude", "Quiet"], answer: "Friendly" },
          { q: "What is happening next week?", choices: ["A sports day", "A test", "A trip", "A party"], answer: "A sports day" }
        ]
      },
      {
        passage: "Yesterday, my family went to a famous night market. It was very crowded and a little noisy, but the food was cheap and delicious. We tried many things and bought a few small gifts. The weather was warm and comfortable. Next time, we are going to visit a quiet park instead. I love busy places, but my mom likes quiet ones better.",
        questions: [
          { q: "How was the night market?", choices: ["Crowded and noisy", "Quiet and empty", "Cold", "Expensive"], answer: "Crowded and noisy" },
          { q: "How was the food?", choices: ["Cheap and delicious", "Expensive", "Bad", "Spicy"], answer: "Cheap and delicious" },
          { q: "How was the weather?", choices: ["Warm and comfortable", "Cold", "Rainy", "Windy"], answer: "Warm and comfortable" },
          { q: "Where are they going next time?", choices: ["A quiet park", "The night market", "Abroad", "A museum"], answer: "A quiet park" }
        ]
      },
      {
        passage: "Last weekend, my family tried a new restaurant downtown. The room was bright and modern, and the waiters were friendly. The food was a little expensive, but it was delicious. The place was crowded, so we waited for twenty minutes. Next time, we are going to try a small, quiet cafe near our house. I think it will be more relaxing.",
        questions: [
          { q: "How was the restaurant's room?", choices: ["Bright and modern", "Dark and old", "Small", "Dirty"], answer: "Bright and modern" },
          { q: "How was the food?", choices: ["Expensive but delicious", "Cheap and bad", "Free", "Spicy"], answer: "Expensive but delicious" },
          { q: "Why did they wait?", choices: ["It was crowded", "It was closed", "They were late", "It was far"], answer: "It was crowded" },
          { q: "Where are they going next time?", choices: ["A quiet cafe", "A big restaurant", "Abroad", "Home"], answer: "A quiet cafe" }
        ]
      },
      {
        passage: "My grandmother's house is old but very comfortable. The rooms are small, and the garden is full of beautiful flowers. It is quiet there, and the air is fresh. Every summer, I stay with her for a week. We cook together and tell stories at night. Next summer, she is going to teach me how to grow vegetables. I can't wait.",
        questions: [
          { q: "How is the grandmother's house?", choices: ["Old but comfortable", "New and modern", "Big and noisy", "Cold"], answer: "Old but comfortable" },
          { q: "What is in the garden?", choices: ["Beautiful flowers", "Tall trees", "A pool", "Toys"], answer: "Beautiful flowers" },
          { q: "How long does the writer stay every summer?", choices: ["A week", "A day", "A month", "A year"], answer: "A week" },
          { q: "What is the grandmother going to teach?", choices: ["Growing vegetables", "Cooking", "Painting", "Singing"], answer: "Growing vegetables" }
        ]
      },
      {
        passage: "Our city built a new library last year. It is the biggest and most modern building in town. Inside, it is quiet and clean, with thousands of books. There is also a small cafe on the first floor. Many students go there to study after school. Next month, the library is going to start a free English club. I am going to join it.",
        questions: [
          { q: "When was the library built?", choices: ["Last year", "This year", "Ten years ago", "Last month"], answer: "Last year" },
          { q: "How is the library inside?", choices: ["Quiet and clean", "Noisy and dirty", "Dark", "Small"], answer: "Quiet and clean" },
          { q: "What is on the first floor?", choices: ["A small cafe", "A garden", "A pool", "A shop"], answer: "A small cafe" },
          { q: "What is the writer going to join?", choices: ["A free English club", "A sports team", "A band", "A trip"], answer: "A free English club" }
        ]
      },
      {
        passage: "Yesterday was a rainy and windy day, so we stayed home. The house was warm and cozy. We watched an old movie and ate popcorn. My little brother was bored, so we played board games. It was a slow but happy day. Tomorrow the weather will be sunny, and we are going to ride bikes in the park.",
        questions: [
          { q: "How was the weather yesterday?", choices: ["Rainy and windy", "Sunny", "Hot", "Snowy"], answer: "Rainy and windy" },
          { q: "What did they eat?", choices: ["Popcorn", "Pizza", "Noodles", "Fruit"], answer: "Popcorn" },
          { q: "Why did they play board games?", choices: ["The brother was bored", "It was a party", "It was homework", "They were hungry"], answer: "The brother was bored" },
          { q: "What are they going to do tomorrow?", choices: ["Ride bikes", "Stay home", "Go to school", "Watch a movie"], answer: "Ride bikes" }
        ]
      }
    ]
  }
};
function weekDrillFor(monthStr, weekN) { return WEEK_DRILLS[monthStr + "-" + weekN] || null; }
if (typeof module !== "undefined" && module.exports) module.exports = { WEEK_DRILLS, weekDrillFor };
