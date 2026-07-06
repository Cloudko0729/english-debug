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
  "2026-07-2": {            // 第2週 我的一天與社區 · 過去式/未來式（2026-07-06 重選，5~6級字）
    listenBlank: [
      {"full":"My apartment was quiet last night.","display":"My ___ was quiet last night.","answer":"apartment"},
      {"full":"I cleaned my bedroom before dinner yesterday.","display":"I cleaned my ___ before dinner yesterday.","answer":"bedroom"},
      {"full":"The bathroom will be clean soon.","display":"The ___ will be clean soon.","answer":"bathroom"},
      {"full":"We visited the bakery after school yesterday.","display":"We visited the ___ after school yesterday.","answer":"bakery"},
      {"full":"The cake was delicious at lunch today.","display":"The cake was ___ at lunch today.","answer":"delicious"},
      {"full":"Dad watered the garden before breakfast.","display":"Dad watered the ___ before breakfast.","answer":"garden"},
      {"full":"I will wait by the gate.","display":"I will wait by the ___.","answer":"gate"},
      {"full":"We mailed a card at the post office.","display":"We mailed a card at the ___.","answer":"post office"},
      {"full":"Our town was sunny this morning.","display":"Our ___ was sunny this morning.","answer":"town"},
      {"full":"We played ball in the yard yesterday.","display":"We played ball in the ___ yesterday.","answer":"yard"},
      {"full":"Did you borrow my book yesterday?","display":"Did you ___ my book yesterday?","answer":"borrow"},
      {"full":"I will finish math before dinner.","display":"I will ___ math before dinner.","answer":"finish"},
      {"full":"Dad will fix my bike tonight.","display":"Dad will ___ my bike tonight.","answer":"fix"},
      {"full":"I did not forget my book today.","display":"I did not ___ my book today.","answer":"forget"},
      {"full":"Please listen to Mom after lunch.","display":"Please ___ to Mom after lunch.","answer":"listen"},
      {"full":"We will meet near school tomorrow.","display":"We will ___ near school tomorrow.","answer":"meet"},
      {"full":"I will order lunch after class.","display":"I will ___ lunch after class.","answer":"order"},
      {"full":"Mom will prepare breakfast before seven.","display":"Mom will ___ breakfast before seven.","answer":"prepare"},
      {"full":"Did you remember the time yesterday?","display":"Did you ___ the time yesterday?","answer":"remember"},
      {"full":"I will ride my bike home.","display":"I will ___ my bike home.","answer":"ride"},
      {"full":"We will share the cake tomorrow.","display":"We will ___ the cake tomorrow.","answer":"share"}
    ],
    reorder: [
      {"sentence":"I will prepare breakfast in the apartment.","chunks":["I will","prepare breakfast","in the","apartment."]},
      {"sentence":"We visited the bakery after school yesterday.","chunks":["We visited","the bakery","after school","yesterday."]},
      {"sentence":"Dad will fix the gate this weekend.","chunks":["Dad will","fix","the gate","this weekend."]},
      {"sentence":"I did not forget my book today.","chunks":["I did not","forget","my book","today."]},
      {"sentence":"They will meet in the living room.","chunks":["They will","meet","in the","living room."]},
      {"sentence":"We will ride bikes around town.","chunks":["We will","ride bikes","around","town."]},
      {"sentence":"The garden was clean after rain.","chunks":["The garden","was clean","after","rain."]},
      {"sentence":"I will borrow a book before class.","chunks":["I will","borrow","a book","before class."]},
      {"sentence":"Mom will bake bread in the kitchen.","chunks":["Mom will","bake bread","in the","kitchen."]},
      {"sentence":"The post office was busy this morning.","chunks":["The post office","was busy","this","morning."]},
      {"sentence":"My favorite place was the yard.","chunks":["My favorite","place","was the","yard."]},
      {"sentence":"The bathroom will be clean after dinner.","chunks":["The bathroom","will be clean","after","dinner."]},
      {"sentence":"We listened to a story before bed.","chunks":["We listened","to a story","before","bed."]},
      {"sentence":"Please remember your important test tomorrow.","chunks":["Please remember","your important","test","tomorrow."]},
      {"sentence":"They will share snacks in the garden.","chunks":["They will","share snacks","in the","garden."]},
      {"sentence":"We usually finish homework before dinner.","chunks":["We usually","finish homework","before","dinner."]}
    ],
    reading: [
      {
        passage: "On Monday morning, Lily got up in her bedroom. She went to the bathroom and then ate breakfast in the living room. Her dad baked bread before seven, and it was delicious. Lily usually looks in her bag before school, but yesterday she forgot her book. Tomorrow she will prepare her bag after dinner and put the book by the gate.",
        questions: [
          {"q":"Where did Lily eat breakfast?","choices":["in the living room","in the garden","at the bakery","at the post office"],"answer":"in the living room"},
          {"q":"What did Dad bake?","choices":["bread","rice","noodles","fish"],"answer":"bread"},
          {"q":"What did Lily forget yesterday?","choices":["her book","her shoes","her lunch","her hat"],"answer":"her book"},
          {"q":"What will Lily prepare tomorrow?","choices":["her bag","the garden","a cake","the bathroom"],"answer":"her bag"}
        ]
      },
      {
        passage: "After school, Ben and his sister walked to the bakery near their apartment. Ben ordered two cakes, and his sister got a drink for Mom. The shop was small but convenient, so many people stopped there. Yesterday Ben forgot his wallet, and his sister helped him. Next Friday, he will share his own money and buy a snack for her.",
        questions: [
          {"q":"Where did Ben go after school?","choices":["the bakery","the post office","the garden","the bathroom"],"answer":"the bakery"},
          {"q":"What did Ben order?","choices":["two cakes","two drinks","two books","two cards"],"answer":"two cakes"},
          {"q":"Why did his sister help him?","choices":["He forgot his wallet","He lost his shoe","He missed the bus","He broke the gate"],"answer":"He forgot his wallet"},
          {"q":"What will Ben share next Friday?","choices":["his own money","his favorite book","his new bike","his school bag"],"answer":"his own money"}
        ]
      },
      {
        passage: "On Saturday, Amy helped Grandpa in the garden. They watered flowers in the yard and cleaned the old gate. The work was not easy, but Grandpa said Amy was helpful. Last week, the gate was broken, so Dad fixed it. Tomorrow Amy will meet two friends there, and they will ride bikes around the town after lunch.",
        questions: [
          {"q":"Who helped Grandpa?","choices":["Amy","Ben","Lily","Tom"],"answer":"Amy"},
          {"q":"What did they clean?","choices":["the old gate","the bathroom","the living room","the post office"],"answer":"the old gate"},
          {"q":"What happened to the gate last week?","choices":["It was broken","It was new","It was open","It was small"],"answer":"It was broken"},
          {"q":"What will Amy and her friends do tomorrow?","choices":["ride bikes around the town","bake cakes at home","borrow books after class","order lunch at school"],"answer":"ride bikes around the town"}
        ]
      },
      {
        passage: "Tom and his mom went to the post office yesterday. Tom wanted to mail a card to Dad. The line was long, but the woman there was helpful and kind. Tom listened to her and put the card in a box. Next week, he will write a new card and send it on Monday morning.",
        questions: [
          {"q":"Where did Tom go yesterday?","choices":["the post office","the bakery","the garden","the apartment"],"answer":"the post office"},
          {"q":"Who was the card for?","choices":["Dad","Mom","Grandpa","Ben"],"answer":"Dad"},
          {"q":"Who was helpful and kind?","choices":["the woman there","Tom's teacher","his sister","his friend"],"answer":"the woman there"},
          {"q":"What will Tom do next week?","choices":["write a new card","fix the gate","ride a bike","order a cake"],"answer":"write a new card"}
        ]
      },
      {
        passage: "May had an important test on Thursday. She usually studied in the living room, but last night she read in her bedroom because the TV was on. Her brother forgot his pencil, so May shared one with him. Tomorrow she will borrow a book and prepare with her friend after class. She will sleep early.",
        questions: [
          {"q":"What did May have on Thursday?","choices":["an important test","a birthday dinner","a new bike","a long trip"],"answer":"an important test"},
          {"q":"Where did May study last night?","choices":["in her bedroom","in the garden","at the bakery","near the gate"],"answer":"in her bedroom"},
          {"q":"What did May share with her brother?","choices":["a pencil","a cake","a book","a card"],"answer":"a pencil"},
          {"q":"What will May borrow tomorrow?","choices":["a book","a bike","a wallet","a bag"],"answer":"a book"}
        ]
      },
      {
        passage: "Kevin and his dad rode around town on Sunday. They left their apartment after breakfast and stopped at a small park. Kevin listened to birds and took pictures of the garden. Last month, he fell near the gate, but Dad helped him. Next Sunday, Kevin will ride to the post office and meet his friend there before lunch.",
        questions: [
          {"q":"When did Kevin ride around town?","choices":["on Sunday","on Monday","on Friday","on Thursday"],"answer":"on Sunday"},
          {"q":"Where did they stop?","choices":["at a small park","at the bakery","in the bathroom","in the bedroom"],"answer":"at a small park"},
          {"q":"What happened last month?","choices":["he fell near the gate","he forgot his book","he baked bread","he ordered lunch"],"answer":"he fell near the gate"},
          {"q":"Where will Kevin ride next Sunday?","choices":["to the post office","to the living room","to the yard","to the apartment"],"answer":"to the post office"}
        ]
      },
      {
        passage: "On Saturday night, Nina's family had dinner in the living room. Grandma baked a cake, and Nina told a funny story. Everyone laughed because the story was about a lost shoe. The cake was delicious, so Nina will order one from the bakery for her birthday next month. She will remember to share it with friends after school on Friday.",
        questions: [
          {"q":"Where did Nina's family have dinner?","choices":["in the living room","in the yard","at the post office","at the bakery"],"answer":"in the living room"},
          {"q":"Who baked a cake?","choices":["Grandma","Nina","Dad","Mom"],"answer":"Grandma"},
          {"q":"What was the story about?","choices":["a lost shoe","a new bike","a small town","a broken gate"],"answer":"a lost shoe"},
          {"q":"What will Nina order for her birthday?","choices":["a cake from the bakery","a card from the post office","a book from school","a bike from town"],"answer":"a cake from the bakery"}
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
    [],
    [{"en":"wallet","zh":"皮夾"}],
    [{"en":"broken","zh":"壞掉的"}],
    [{"en":"line","zh":"排隊隊伍"}, {"en":"mail","zh":"寄（信）"}],
    [],
    [{"en":"fell","zh":"跌倒（fall 的過去式）"}, {"en":"park","zh":"公園"}],
    [{"en":"story","zh":"故事"}, {"en":"funny","zh":"好笑的"}, {"en":"laugh","zh":"大笑"}]
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
