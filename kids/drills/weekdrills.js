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
      { full: "I am going to explore the mountains tomorrow.", display: "I am going to ___ the mountains tomorrow.", answer: "explore" },
      { full: "We will leave for our vacation soon.", display: "We will leave for our ___ soon.", answer: "vacation" },
      { full: "The tourist enjoyed the long holiday.", display: "The ___ enjoyed the long holiday.", answer: "tourist" },
      { full: "I will pack my bag tonight.", display: "I will pack my bag ___.", answer: "tonight" },
      { full: "They arrived a few days ago.", display: "They arrived a few days ___.", answer: "ago" },
      { full: "We will visit the old town soon.", display: "We will ___ the old town soon.", answer: "visit" },
      { full: "I kept my ticket in my bag.", display: "I kept my ___ in my bag.", answer: "ticket" },
      { full: "The bus to the museum was late.", display: "The bus to the ___ was late.", answer: "museum" },
      { full: "We are going to plan a long trip.", display: "We are going to ___ a long trip.", answer: "plan" },
      { full: "We will return home after the holiday.", display: "We will ___ home after the holiday.", answer: "return" },
      { full: "The map showed the way to the station.", display: "The ___ showed the way to the station.", answer: "map" }
    ],
    reorder: [
      { sentence: "We arrived at the airport early.", chunks: ["We", "arrived", "at the", "airport", "early."] },
      { sentence: "I will visit a famous museum.", chunks: ["I", "will", "visit", "a famous", "museum."] },
      { sentence: "They bought tickets for the trip.", chunks: ["They", "bought", "tickets", "for the", "trip."] },
      { sentence: "She is going to travel abroad next year.", chunks: ["She", "is going to", "travel", "abroad", "next year."] },
      { sentence: "We stayed at a small hotel.", chunks: ["We", "stayed", "at a", "small", "hotel."] },
      { sentence: "I took many photos yesterday.", chunks: ["I", "took", "many", "photos", "yesterday."] },
      { sentence: "He will explore the mountains.", chunks: ["He", "will", "explore", "the", "mountains."] },
      { sentence: "They are going to the beach tomorrow.", chunks: ["They", "are going", "to the", "beach", "tomorrow."] },
      { sentence: "We will travel by train next week.", chunks: ["We", "will", "travel", "by train", "next week."] },
      { sentence: "She bought a map at the station.", chunks: ["She", "bought", "a map", "at the", "station."] },
      { sentence: "I am going to pack my luggage.", chunks: ["I", "am going to", "pack", "my", "luggage."] },
      { sentence: "They visited the old temple yesterday.", chunks: ["They", "visited", "the old", "temple", "yesterday."] },
      { sentence: "We will return home on Sunday.", chunks: ["We", "will", "return", "home", "on Sunday."] },
      { sentence: "He sent a postcard from abroad.", chunks: ["He", "sent", "a postcard", "from", "abroad."] },
      { sentence: "The trip will start next month.", chunks: ["The trip", "will", "start", "next", "month."] },
      { sentence: "We bought gifts for our family.", chunks: ["We", "bought", "gifts", "for our", "family."] }
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
      { full: "The library was very quiet.", display: "The library was very ___.", answer: "quiet" },
      { full: "The short trip was a great experience.", display: "The short trip was a great ___.", answer: "experience" },
      { full: "The heavy box was hard to carry.", display: "The ___ box was hard to carry.", answer: "heavy" },
      { full: "This bag is light and easy to carry.", display: "This bag is ___ and easy to carry.", answer: "light" },
      { full: "The two hotels look very similar.", display: "The two hotels look very ___.", answer: "similar" },
      { full: "The MRT is fast and convenient.", display: "The MRT is fast and ___.", answer: "convenient" },
      { full: "That dark road is dangerous at night.", display: "That dark road is ___ at night.", answer: "dangerous" },
      { full: "Please stay safe on your trip.", display: "Please stay ___ on your trip.", answer: "safe" },
      { full: "The weather got worse in the afternoon.", display: "The weather got ___ in the afternoon.", answer: "worse" },
      { full: "We had an exciting adventure last summer.", display: "We had an exciting ___ last summer.", answer: "adventure" },
      { full: "I have recently been to Japan.", display: "I have ___ been to Japan.", answer: "recently" },
      { full: "She has never tried this food before.", display: "She has ___ tried this food before.", answer: "never" },
      { full: "Have you finished your homework yet?", display: "Have you finished your homework ___?", answer: "yet" },
      { full: "He has already packed his bags.", display: "He has ___ packed his bags.", answer: "already" }
    ],
    reorder: [
      { sentence: "The hotel was very comfortable.", chunks: ["The", "hotel", "was", "very", "comfortable."] },
      { sentence: "The city will be very modern.", chunks: ["The", "city", "will be", "very", "modern."] },
      { sentence: "The old town was wonderful.", chunks: ["The", "old", "town", "was", "wonderful."] },
      { sentence: "We saw many famous places.", chunks: ["We", "saw", "many", "famous", "places."] },
      { sentence: "The market was very crowded.", chunks: ["The", "market", "was", "very", "crowded."] },
      { sentence: "The new park is very popular.", chunks: ["The", "new park", "is", "very", "popular."] },
      { sentence: "The street was too noisy.", chunks: ["The", "street", "was", "too", "noisy."] },
      { sentence: "The library will be quiet today.", chunks: ["The", "library", "will be", "quiet", "today."] },
      { sentence: "The food was cheap and tasty.", chunks: ["The", "food", "was", "cheap", "and tasty."] },
      { sentence: "The view will be wonderful tonight.", chunks: ["The", "view", "will be", "wonderful", "tonight."] },
      { sentence: "The new mall is very modern.", chunks: ["The", "new mall", "is", "very", "modern."] },
      { sentence: "The old house was very quiet.", chunks: ["The", "old house", "was", "very", "quiet."] },
      { sentence: "The beach was clean and beautiful.", chunks: ["The", "beach", "was", "clean", "and beautiful."] },
      { sentence: "The restaurant will be crowded tonight.", chunks: ["The", "restaurant", "will be", "crowded", "tonight."] },
      { sentence: "The mountain air was very fresh.", chunks: ["The", "mountain air", "was", "very", "fresh."] },
      { sentence: "The festival was big and famous.", chunks: ["The", "festival", "was", "big", "and famous."] }
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
  },
  "2026-07-3": {            // 第3週 健康與規則 · 過去式/未來式（Codex 起草、Claude 審核）
    listenBlank: [
      { full: "The doctor gave me medicine yesterday.", display: "The doctor gave me ___ yesterday.", answer: "medicine" },
      { full: "A healthy habit helped Amy sleep well.", display: "A healthy ___ helped Amy sleep well.", answer: "habit" },
      { full: "We will exercise after school tomorrow.", display: "We will ___ after school tomorrow.", answer: "exercise" },
      { full: "The nurse checked the patient in the room.", display: "The nurse checked the ___ in the room.", answer: "patient" },
      { full: "Dad had a fever last night.", display: "Dad had a ___ last night.", answer: "fever" },
      { full: "My headache went away after rest.", display: "My ___ went away after rest.", answer: "headache" },
      { full: "A cough kept Tom home today.", display: "A ___ kept Tom home today.", answer: "cough" },
      { full: "Good health starts with enough sleep.", display: "Good ___ starts with enough sleep.", answer: "health" },
      { full: "We followed the rule at the pool.", display: "We followed the ___ at the pool.", answer: "rule" },
      { full: "Please be careful near the stairs.", display: "Please be ___ near the stairs.", answer: "careful" },
      { full: "Mom's advice made me feel better.", display: "Mom's ___ made me feel better.", answer: "advice" },
      { full: "The reason was clear to everyone today.", display: "The ___ was clear to everyone today.", answer: "reason" },
      { full: "The result made our teacher happy.", display: "The ___ made our teacher happy.", answer: "result" },
      { full: "Dirty hands can cause illness at school.", display: "Dirty hands can cause ___ at school.", answer: "illness" },
      { full: "That problem worried the nurse yesterday.", display: "That ___ worried the nurse yesterday.", answer: "problem" },
      { full: "The sign says we need masks inside.", display: "The ___ says we need masks inside.", answer: "sign" },
      { full: "I made a mistake with my medicine.", display: "I made a ___ with my medicine.", answer: "mistake" },
      { full: "Our safety rules protect every student here.", display: "Our ___ rules protect every student here.", answer: "safety" },
      { full: "We will avoid running in the hall.", display: "We will ___ running in the hall.", answer: "avoid" },
      { full: "Please follow the doctor's advice today.", display: "Please ___ the doctor's advice today.", answer: "follow" },
      { full: "Do not worry about one mistake.", display: "Do not ___ about one mistake.", answer: "worry" }
    ],
    reorder: [
      { sentence: "The doctor checked my fever yesterday.", chunks: ["The doctor", "checked", "my fever", "yesterday."] },
      { sentence: "We are going to visit the hospital tomorrow.", chunks: ["We are going to", "visit", "the hospital", "tomorrow."] },
      { sentence: "The nurse gave the patient water.", chunks: ["The nurse", "gave", "the patient", "water."] },
      { sentence: "I will take medicine after lunch.", chunks: ["I will", "take medicine", "after", "lunch."] },
      { sentence: "Kelly had a headache this morning.", chunks: ["Kelly", "had a headache", "this", "morning."] },
      { sentence: "Dirty hands will cause a health problem.", chunks: ["Dirty hands", "will cause", "a health", "problem."] },
      { sentence: "Good sleep will improve your health.", chunks: ["Good sleep", "will improve", "your", "health."] },
      { sentence: "Our class followed the safety rule.", chunks: ["Our class", "followed", "the safety", "rule."] },
      { sentence: "We will wear a mask on the bus.", chunks: ["We will", "wear a mask", "on", "the bus."] },
      { sentence: "Dad is going to exercise tonight.", chunks: ["Dad", "is going to", "exercise", "tonight."] },
      { sentence: "The sign warned us to be careful.", chunks: ["The sign", "warned us", "to be", "careful."] },
      { sentence: "This healthy habit helped my brother.", chunks: ["This healthy habit", "helped", "my", "brother."] },
      { sentence: "I made a mistake in the game.", chunks: ["I", "made a mistake", "in the", "game."] },
      { sentence: "We will avoid sweet drinks today.", chunks: ["We will", "avoid", "sweet drinks", "today."] },
      { sentence: "Rest helped Tina feel better yesterday.", chunks: ["Rest", "helped Tina", "feel better", "yesterday."] },
      { sentence: "His advice will protect our team.", chunks: ["His advice", "will protect", "our", "team."] }
    ],
    reading: [
      {
        passage: "On Monday, Ben had a fever and a cough. His mother took him to the doctor. The doctor checked him and said the illness was not serious. Ben got medicine and advice: drink water and rest. He was worried about missing school, but his mother said his health came first. He will stay home today and will go back when he feels healthy.",
        questions: [
          { q: "What problem did Ben have?", choices: ["a fever and a cough", "a broken arm", "a toothache", "a stomachache"], answer: "a fever and a cough" },
          { q: "Where did Ben go?", choices: ["to the doctor", "to the pool", "to the library", "to the park"], answer: "to the doctor" },
          { q: "What advice did Ben get?", choices: ["drink water and rest", "run outside", "eat candy", "play all night"], answer: "drink water and rest" },
          { q: "What will Ben do today?", choices: ["stay home", "take a trip", "join a race", "visit a zoo"], answer: "stay home" }
        ]
      },
      {
        passage: "At school, Mia felt a bad headache after lunch. Her teacher took her to the nurse. The nurse asked questions, checked her face, and let her rest in the health room. Mia said she slept late last night. The nurse gave simple advice about sleep. Mia's father will pick her up, and she is going to follow a better sleep habit tonight.",
        questions: [
          { q: "What hurt Mia?", choices: ["her head", "her hand", "her knee", "her tooth"], answer: "her head" },
          { q: "Who helped Mia?", choices: ["the nurse", "the cook", "the driver", "the singer"], answer: "the nurse" },
          { q: "What did Mia do last night?", choices: ["slept late", "ate breakfast", "played soccer", "cleaned shoes"], answer: "slept late" },
          { q: "What will Mia follow tonight?", choices: ["a better sleep habit", "a new math rule", "a long bus sign", "a hard music lesson"], answer: "a better sleep habit" }
        ]
      },
      {
        passage: "Last month, Leo often skipped breakfast and slept only six hours. The result was a tired body and many small mistakes in class. His teacher talked about healthy habits. Leo made a plan: he will eat breakfast, drink water, exercise after school, and sleep earlier. He is going to check his habit chart each night. His problem will get smaller if he keeps trying.",
        questions: [
          { q: "What did Leo skip last month?", choices: ["breakfast", "homework", "music class", "bus time"], answer: "breakfast" },
          { q: "What was the result?", choices: ["a tired body", "a new notebook", "a clean desk", "a full bottle"], answer: "a tired body" },
          { q: "What will Leo do after school?", choices: ["exercise", "sleep", "cook", "draw"], answer: "exercise" },
          { q: "What is Leo going to check each night?", choices: ["his habit chart", "his lunch box", "his phone screen", "his school bag"], answer: "his habit chart" }
        ]
      },
      {
        passage: "Yesterday, our class went to the city pool. Before we swam, the teacher read each rule. We walked on the wet floor, followed the sign, and stayed away from deep water. One boy ran and made a mistake, but no one was hurt. The coach said safety protects everyone. Next week, we will bring caps and will be careful again.",
        questions: [
          { q: "Where did the class go?", choices: ["the city pool", "the school gym", "the music room", "the bus stop"], answer: "the city pool" },
          { q: "What did the teacher read?", choices: ["each rule", "a story", "a menu", "a map"], answer: "each rule" },
          { q: "What mistake did one boy make?", choices: ["He ran.", "He jumped.", "He shouted.", "He slept."], answer: "He ran." },
          { q: "What will the class bring next week?", choices: ["caps", "masks", "books", "coats"], answer: "caps" }
        ]
      },
      {
        passage: "Last Friday, many students at school had a cough. The principal put a sign near the gate: Wear a mask if you feel sick. Anna forgot her mask and worried about her friends. Her teacher gave her one and explained the reason. A mask can protect others and help avoid illness. Tomorrow, Anna is going to bring two masks in her bag.",
        questions: [
          { q: "What did the sign say to wear?", choices: ["a mask", "a hat", "a jacket", "a watch"], answer: "a mask" },
          { q: "Who gave Anna a mask?", choices: ["her teacher", "her brother", "her doctor", "her friend"], answer: "her teacher" },
          { q: "Why can a mask help?", choices: ["It can protect others.", "It can make lunch.", "It can open doors.", "It can clean shoes."], answer: "It can protect others." },
          { q: "What will Anna bring tomorrow?", choices: ["two masks", "two books", "two bottles", "two pencils"], answer: "two masks" }
        ]
      },
      {
        passage: "On Sunday night, Jay worried about a math test and did not sleep well. In the morning, he had a headache and made two mistakes on easy questions. His dad said worry can cause problems for health. Jay will study earlier next time and rest before bed. He is going to turn off the tablet at nine and follow a calm sleep rule.",
        questions: [
          { q: "Why did Jay worry?", choices: ["a math test", "a music show", "a bus ride", "a new game"], answer: "a math test" },
          { q: "What happened in the morning?", choices: ["He had a headache.", "He won a race.", "He cleaned a room.", "He ate a cake."], answer: "He had a headache." },
          { q: "What can worry cause?", choices: ["problems for health", "rules for sports", "signs for rooms", "masks for class"], answer: "problems for health" },
          { q: "What will Jay do next time?", choices: ["study earlier", "run faster", "sing louder", "draw bigger"], answer: "study earlier" }
        ]
      },
      {
        passage: "At recess yesterday, Sara and her friends played basketball. Sara wanted to win, so she ran too fast and fell. The nurse cleaned her knee and gave advice about safety. Sara learned that exercise is healthy, but players must be careful. Tomorrow, the team will warm up first, follow the game rules, and avoid pushing. They are going to protect each other.",
        questions: [
          { q: "What game did Sara play?", choices: ["basketball", "soccer", "baseball", "tennis"], answer: "basketball" },
          { q: "Who cleaned Sara's knee?", choices: ["the nurse", "the doctor", "the coach", "the teacher"], answer: "the nurse" },
          { q: "What will the team do first?", choices: ["warm up", "eat lunch", "take a test", "write names"], answer: "warm up" },
          { q: "What will they avoid?", choices: ["pushing", "sleeping", "drawing", "singing"], answer: "pushing" }
        ]
      }
    ]
  }
};
// 每篇短文的「沒教過的生字」中文解釋（index 對應該週 reading[]）
const PASSAGE_GLOSSARY = {
  "2026-07-1": [
    [{ en: "Taitung", zh: "台東（地名）" }],
    [{ en: "temple", zh: "寺廟" }, { en: "grandparents", zh: "（外）祖父母" }],
    [{ en: "postcard", zh: "明信片" }],
    [{ en: "skiing", zh: "（雙板）滑雪" }, { en: "cocoa", zh: "熱可可" }, { en: "snowboarding", zh: "單板滑雪" }],
    [{ en: "pilot", zh: "飛行員、機長" }, { en: "coins", zh: "硬幣" }, { en: "continent", zh: "洲、大陸" }],
    [{ en: "science", zh: "科學" }, { en: "machines", zh: "機器" }, { en: "dinosaur", zh: "恐龍" }, { en: "farm", zh: "農場" }],
    [{ en: "lake", zh: "湖" }, { en: "tent", zh: "帳篷" }, { en: "peaceful", zh: "寧靜的" }, { en: "trails", zh: "步道、小徑" }]
  ],
  "2026-07-2": [
    [{ en: "narrow", zh: "狹窄的" }, { en: "view", zh: "風景、景色" }],
    [{ en: "floor", zh: "樓層" }, { en: "classmates", zh: "同學" }],
    [{ en: "instead", zh: "改為、取而代之" }],
    [{ en: "downtown", zh: "市中心" }, { en: "waiters", zh: "服務生" }, { en: "cafe", zh: "咖啡廳" }],
    [{ en: "garden", zh: "花園" }, { en: "fresh", zh: "新鮮的" }, { en: "vegetables", zh: "蔬菜" }],
    [{ en: "library", zh: "圖書館" }, { en: "club", zh: "社團" }],
    [{ en: "cozy", zh: "溫馨舒適的" }, { en: "popcorn", zh: "爆米花" }, { en: "board games", zh: "桌遊" }]
  ],
  "2026-07-3": [
    [{ en: "serious", zh: "嚴重的" }, { en: "missing", zh: "錯過" }],
    [{ en: "simple", zh: "簡單的" }, { en: "pick up", zh: "接走" }],
    [{ en: "skipped", zh: "跳過、略過" }, { en: "chart", zh: "表格" }, { en: "earlier", zh: "較早地" }],
    [{ en: "pool", zh: "游泳池" }, { en: "swam", zh: "游泳（過去式）" }, { en: "wet", zh: "濕的" }, { en: "deep", zh: "深的" }, { en: "coach", zh: "教練" }, { en: "caps", zh: "泳帽" }],
    [{ en: "principal", zh: "校長" }, { en: "gate", zh: "大門" }, { en: "forgot", zh: "忘記（過去式）" }, { en: "explained", zh: "解釋了" }, { en: "others", zh: "其他人" }],
    [{ en: "turn off", zh: "關掉" }, { en: "tablet", zh: "平板電腦" }, { en: "calm", zh: "平靜的" }, { en: "earlier", zh: "較早地" }],
    [{ en: "recess", zh: "下課時間" }, { en: "basketball", zh: "籃球" }, { en: "fell", zh: "跌倒（過去式）" }, { en: "knee", zh: "膝蓋" }, { en: "warm up", zh: "熱身" }, { en: "pushing", zh: "推擠" }]
  ]
};
function weekDrillFor(monthStr, weekN) { return WEEK_DRILLS[monthStr + "-" + weekN] || null; }
function passageGlossary(wid, idx) { return (PASSAGE_GLOSSARY[wid] && PASSAGE_GLOSSARY[wid][idx]) || []; }
if (typeof module !== "undefined" && module.exports) module.exports = { WEEK_DRILLS, weekDrillFor, PASSAGE_GLOSSARY, passageGlossary };
