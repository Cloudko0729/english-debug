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
  "2026-07-3": {            // 第3週 校園社團與班級挑戰 · 過去式/未來式（重選，Codex 起草、Claude 審核）
    listenBlank: [
      {"full":"Our club practiced after school yesterday.","display":"Our ___ practiced after school yesterday.","answer":"club"},
      {"full":"We will choose the drama club tomorrow.","display":"We will ___ the drama club tomorrow.","answer":"choose"},
      {"full":"My camera was in the classroom.","display":"My ___ was in the classroom.","answer":"camera"},
      {"full":"She will take a photo later.","display":"She will take a ___ later.","answer":"photo"},
      {"full":"Tom wrote a report after class yesterday.","display":"Tom wrote a ___ after class yesterday.","answer":"report"},
      {"full":"I will write in my diary tonight.","display":"I will write in my ___ tonight.","answer":"diary"},
      {"full":"We studied science in class yesterday.","display":"We studied ___ in class yesterday.","answer":"science"},
      {"full":"This subject was hard for me yesterday.","display":"This ___ was hard for me yesterday.","answer":"subject"},
      {"full":"The lesson will start after lunch.","display":"The ___ will start after lunch.","answer":"lesson"},
      {"full":"The quiz was very short yesterday.","display":"The ___ was very short yesterday.","answer":"quiz"},
      {"full":"Our exam will start at nine.","display":"Our ___ will start at nine.","answer":"exam"},
      {"full":"This question was easy for us.","display":"This ___ was easy for us.","answer":"question"},
      {"full":"Leo will answer after the quiz.","display":"Leo will ___ after the quiz.","answer":"answer"},
      {"full":"Our goal was to read ten pages.","display":"Our ___ was to read ten pages.","answer":"goal"},
      {"full":"The score will be on the board.","display":"The ___ will be on the board.","answer":"score"},
      {"full":"Ben will run in the race.","display":"Ben will run in the ___.","answer":"race"},
      {"full":"I sent a message after lunch.","display":"I sent a ___ after lunch.","answer":"message"},
      {"full":"We will practice before the show.","display":"We will ___ before the show.","answer":"practice"},
      {"full":"They will finish quickly after class.","display":"They will finish ___ after class.","answer":"quickly"},
      {"full":"Please be careful near the stairs.","display":"Please be ___ near the stairs.","answer":"careful"},
      {"full":"We were ready for the race.","display":"We were ___ for the race.","answer":"ready"}
    ],
    reorder: [
      {"sentence":"We will choose a new club tomorrow.","chunks":["We will","choose","a new","club tomorrow."]},
      {"sentence":"Mia wrote a report about science yesterday.","chunks":["Mia wrote","a report","about science","yesterday."]},
      {"sentence":"Our class will repeat the lesson tomorrow.","chunks":["Our class","will repeat","the lesson","tomorrow."]},
      {"sentence":"Leo sent a message before the quiz.","chunks":["Leo sent","a message","before","the quiz."]},
      {"sentence":"The exam was hard, but I was ready.","chunks":["The exam","was hard,","but I","was ready."]},
      {"sentence":"I will answer the question after class.","chunks":["I will","answer","the question","after class."]},
      {"sentence":"They were careful during the race yesterday.","chunks":["They were","careful","during the race","yesterday."]},
      {"sentence":"We will check the score after lunch.","chunks":["We will","check","the score","after lunch."]},
      {"sentence":"Nina took a photo with her camera.","chunks":["Nina took","a photo","with her","camera."]},
      {"sentence":"The drama club enjoyed the play yesterday.","chunks":["The drama club","enjoyed","the play","yesterday."]},
      {"sentence":"Sam will decide his goal tonight.","chunks":["Sam will","decide","his goal","tonight."]},
      {"sentence":"I believe our class will win tomorrow.","chunks":["I believe","our class","will win","tomorrow."]},
      {"sentence":"The teacher agreed with our answer yesterday.","chunks":["The teacher","agreed with","our answer","yesterday."]},
      {"sentence":"We had to follow the teacher today.","chunks":["We had","to follow","the teacher","today."]},
      {"sentence":"Ken will practice quickly before the exam.","chunks":["Ken will","practice quickly","before","the exam."]},
      {"sentence":"She will write in her diary tonight.","chunks":["She will","write in","her diary","tonight."]}
    ],
    reading: [
      {
        passage: "Yesterday, our science club met after lunch. We had one question: how can light help a plant? Amy wrote the answer, and Ben drew the plant for the report. The first try was slow, so we practiced again. Tomorrow we will choose a new question and make a short report. I hope everyone will be ready and careful. We liked the work.",
        questions: [
          {"q":"What club met after lunch?","choices":["science club","drama club","history club","camera club"],"answer":"science club"},
          {"q":"What did Amy write?","choices":["the answer","the score","a diary","a message"],"answer":"the answer"},
          {"q":"What will they choose tomorrow?","choices":["a new question","a new camera","a new race","a new exam"],"answer":"a new question"},
          {"q":"How did the writer feel about the work?","choices":["The writer liked it.","The writer hated it.","The writer forgot it.","The writer lost it."],"answer":"The writer liked it."}
        ]
      },
      {
        passage: "Last Friday, our drama club practiced a short play. I was not ready at first, but my friends helped me speak. Jenny used a camera, and Leo took each photo for our album. The teacher sent a message to our class. Next Friday, we will act again for our class. I believe we will enjoy the play and answer every question.",
        questions: [
          {"q":"What club practiced a play?","choices":["drama club","science club","photo club","race club"],"answer":"drama club"},
          {"q":"Who used a camera?","choices":["Jenny","Leo","the teacher","the writer"],"answer":"Jenny"},
          {"q":"What did the teacher send?","choices":["a message","a report","a diary","a score"],"answer":"a message"},
          {"q":"What will the club do next Friday?","choices":["act again","take an exam","run a race","write a diary"],"answer":"act again"}
        ]
      },
      {
        passage: "On Monday, our class had a race in the gym. I ran quickly, but Nora was faster and won. Our score was on the board, and our goal was to try again. We did not feel sad. Tomorrow we will practice before school and follow the teacher. I hope I will win one race this month, but I will be careful.",
        questions: [
          {"q":"Where did the class have a race?","choices":["in the gym","in the library","in the classroom","in the park"],"answer":"in the gym"},
          {"q":"Who won the race?","choices":["Nora","Ben","Mia","Leo"],"answer":"Nora"},
          {"q":"What was the class goal?","choices":["to try again","to go home","to miss school","to draw a plant"],"answer":"to try again"},
          {"q":"What will they do tomorrow?","choices":["practice before school","take photos","write diaries","choose cameras"],"answer":"practice before school"}
        ]
      },
      {
        passage: "Yesterday, I had a history lesson about old schools. The subject was new to me, so I wrote many words in my diary. At home, I asked Dad one question and found the answer in a book. Next week, I will write a report and read it to my class. I will choose three photos and make the report easy to read.",
        questions: [
          {"q":"What lesson did the writer have?","choices":["a history lesson","a science quiz","a drama lesson","a race lesson"],"answer":"a history lesson"},
          {"q":"Where did the writer write many words?","choices":["in my diary","on the board","in a message","on a photo"],"answer":"in my diary"},
          {"q":"Who did the writer ask?","choices":["Dad","Mom","Ben","Amy"],"answer":"Dad"},
          {"q":"What will the writer choose?","choices":["three photos","three races","three exams","three clubs"],"answer":"three photos"}
        ]
      },
      {
        passage: "Yesterday, the class wanted a new club day. We talked after lunch and did not agree at first. Some students wanted drama, and some wanted science. May sent a message with two club names. Tomorrow, everyone will choose one subject on the calendar. The teacher will read the answers. I hope we will decide before Friday and enjoy the new day.",
        questions: [
          {"q":"What did the class want?","choices":["a new club day","a new exam day","a new camera","a new diary"],"answer":"a new club day"},
          {"q":"Which two club names were in the message?","choices":["drama and science","race and photo","quiz and exam","goal and score"],"answer":"drama and science"},
          {"q":"What will everyone choose?","choices":["one subject","one camera","one report","one diary"],"answer":"one subject"},
          {"q":"When does the writer hope to decide?","choices":["before Friday","after Friday","next month","last Monday"],"answer":"before Friday"}
        ]
      },
      {
        passage: "Last night, I was not ready for the quiz. My brother gave me ten questions, and I repeated each answer. I was slow at first, but I was ready after dinner. The quiz was not an exam, but I wanted a good score. Tomorrow, I will practice again and ask the teacher one more question. I believe I will do better.",
        questions: [
          {"q":"What was the writer not ready for?","choices":["the quiz","the race","the drama","the camera"],"answer":"the quiz"},
          {"q":"Who gave the writer ten questions?","choices":["My brother","My teacher","My friend","My classmate"],"answer":"My brother"},
          {"q":"What was not an exam?","choices":["the quiz","the report","the lesson","the message"],"answer":"the quiz"},
          {"q":"What will the writer ask tomorrow?","choices":["one more question","one new score","one photo","one diary"],"answer":"one more question"}
        ]
      },
      {
        passage: "Yesterday, a new student came to our class. He did not know the lesson, so I gave him my book and answered his question. At lunch, we practiced the words together and wrote them in a diary. He read quickly after that. Tomorrow, I will send him a message about the next subject. I hope he will enjoy our class and feel ready.",
        questions: [
          {"q":"Who came to the class?","choices":["a new student","a new teacher","a new brother","a new winner"],"answer":"a new student"},
          {"q":"What did the writer give him?","choices":["my book","my camera","my photo","my score"],"answer":"my book"},
          {"q":"When did they practice the words?","choices":["at lunch","at night","after dinner","before school"],"answer":"at lunch"},
          {"q":"What will the writer send?","choices":["a message","a report","an exam","a race"],"answer":"a message"}
        ]
      }
    ]
  },
  "2026-07-4": {            // 第4週 週末露營與家庭小任務 · 過去式/未來式（重選，Codex 起草、Claude 審核）
    listenBlank: [
      {"full":"We will camp by the lake tomorrow.","display":"We will ___ by the lake tomorrow.","answer":"camp"},
      {"full":"Dad washed my bottle after breakfast.","display":"Dad washed my ___ after breakfast.","answer":"bottle"},
      {"full":"I used a blanket on the bus.","display":"I used a ___ on the bus.","answer":"blanket"},
      {"full":"Mia will bring a flashlight tonight.","display":"Mia will bring a ___ tonight.","answer":"flashlight"},
      {"full":"Tom pulled the rope very hard.","display":"Tom pulled the ___ very hard.","answer":"rope"},
      {"full":"We carried the basket to Grandma.","display":"We carried the ___ to Grandma.","answer":"basket"},
      {"full":"Mom will add eggs to lunch.","display":"Mom will ___ eggs to lunch.","answer":"add"},
      {"full":"We will mix fruit with milk.","display":"We will ___ fruit with milk.","answer":"mix"},
      {"full":"Grandpa will boil water for tea.","display":"Grandpa will ___ water for tea.","answer":"boil"},
      {"full":"Ben will fry rice for us.","display":"Ben will ___ rice for us.","answer":"fry"},
      {"full":"I wrote the new name carefully.","display":"I wrote the new name ___.","answer":"carefully"},
      {"full":"The brave child helped his brother.","display":"The ___ child helped his brother.","answer":"brave"},
      {"full":"The room was quiet after nine.","display":"The room was ___ after nine.","answer":"quiet"},
      {"full":"The music was loud last night.","display":"The music was ___ last night.","answer":"loud"},
      {"full":"That box was too heavy yesterday.","display":"That box was too ___ yesterday.","answer":"heavy"},
      {"full":"The cup was empty after lunch.","display":"The cup was ___ after lunch.","answer":"empty"},
      {"full":"What will happen after the game?","display":"What will ___ after the game?","answer":"happen"},
      {"full":"We finally found the lost key.","display":"We ___ found the lost key.","answer":"finally"},
      {"full":"The bridge will be safe soon.","display":"The bridge will be ___ soon.","answer":"safe"},
      {"full":"Mom was worried about the rain.","display":"Mom was ___ about the rain.","answer":"worried"},
      {"full":"Sam solved the problem before class.","display":"Sam solved the ___ before class.","answer":"problem"}
    ],
    reorder: [
      {"sentence":"We will camp by the lake tomorrow.","chunks":["We will","camp by","the lake","tomorrow."]},
      {"sentence":"Dad will repair the old chair tomorrow.","chunks":["Dad will","repair","the old chair","tomorrow."]},
      {"sentence":"She packed a blanket for the trip.","chunks":["She packed","a blanket","for the","trip."]},
      {"sentence":"The basket was heavy after lunch.","chunks":["The basket","was heavy","after","lunch."]},
      {"sentence":"We will fill the bottle with water.","chunks":["We will","fill the","bottle with","water."]},
      {"sentence":"Ben found a tool under the table.","chunks":["Ben found","a tool","under the","table."]},
      {"sentence":"Mom will fry rice after school.","chunks":["Mom will","fry rice","after","school."]},
      {"sentence":"We will mix the sauce carefully.","chunks":["We will","mix the","sauce","carefully."]},
      {"sentence":"The forest was quiet after rain.","chunks":["The forest","was quiet","after","rain."]},
      {"sentence":"A loud sound woke us up.","chunks":["A loud","sound","woke us","up."]},
      {"sentence":"Mia was worried about the dark sky.","chunks":["Mia was","worried about","the dark","sky."]},
      {"sentence":"The brave boy carried the rope.","chunks":["The brave","boy carried","the","rope."]},
      {"sentence":"We will boil eggs before breakfast.","chunks":["We will","boil eggs","before","breakfast."]},
      {"sentence":"They finally reached home before dinner.","chunks":["They finally","reached home","before","dinner."]},
      {"sentence":"This tent will stay dry tonight.","chunks":["This tent","will stay","dry","tonight."]},
      {"sentence":"A small problem happened during cooking.","chunks":["A small","problem happened","during","cooking."]}
    ],
    reading: [
      {
        passage: "Last Saturday, our family went to a small camp near the forest. Dad put up the tent, and I held the flashlight. My brother tied a rope to a tree, but it fell. We fixed it before dinner. The night was quiet and safe. Tomorrow, we will bring one more blanket and rest before we walk home. Mom said the work was good.",
        questions: [
          {"q":"Where did the family go?","choices":["a small camp","a big store","a school club","a bus stop"],"answer":"a small camp"},
          {"q":"What did the speaker hold?","choices":["a flashlight","a basket","a stone","a bottle"],"answer":"a flashlight"},
          {"q":"What fell from the tree?","choices":["a rope","a tent","a blanket","a tool"],"answer":"a rope"},
          {"q":"What will they bring tomorrow?","choices":["one more blanket","a new chair","two eggs","a loud radio"],"answer":"one more blanket"}
        ]
      },
      {
        passage: "On Sunday morning, Grandma opened her basket in our kitchen. She found rice, eggs, and one empty bottle. I helped her add water, mix eggs, and boil soup. My sister will fry rice tonight, so Grandma helped her carefully. The soup was hot, but no one was hurt. Finally, we ate lunch and washed every bowl before Dad came home from work.",
        questions: [
          {"q":"Who opened the basket?","choices":["Grandma","Dad","my sister","my brother"],"answer":"Grandma"},
          {"q":"What was empty?","choices":["one bottle","one bowl","one bag","one cup"],"answer":"one bottle"},
          {"q":"What will the sister fry?","choices":["rice","eggs","soup","bread"],"answer":"rice"},
          {"q":"When did Dad come home?","choices":["after lunch","before breakfast","at midnight","during school"],"answer":"after lunch"}
        ]
      },
      {
        passage: "Yesterday afternoon, our old box had a problem. It hit a stone, and one part of wood broke. Dad was worried. The box was heavy. He used a tool to repair it, and I held the small part. We will fill the box with toys tomorrow. Finally, the box moved again, and we felt happy at home after dinner together.",
        questions: [
          {"q":"What had a problem?","choices":["an old box","a new bike","a small tent","a heavy bag"],"answer":"an old box"},
          {"q":"What did the box hit?","choices":["a stone","a bottle","a table","a tree"],"answer":"a stone"},
          {"q":"What did Dad use?","choices":["a tool","a rope","a blanket","a basket"],"answer":"a tool"},
          {"q":"What will they put in the box?","choices":["toys","rice","water","wood"],"answer":"toys"}
        ]
      },
      {
        passage: "A loud wind came before our picnic. My little sister was worried, so I packed the basket fast. Dad checked the fire and made it safe. We sat on a blanket under the roof and ate apples. The rain stopped at four. Next Friday, we will try the picnic again, and I will be brave if the wind comes back.",
        questions: [
          {"q":"What came before the picnic?","choices":["a loud wind","a quiet cat","a heavy box","a safe fire"],"answer":"a loud wind"},
          {"q":"Who was worried?","choices":["my little sister","Dad","Mom","Grandma"],"answer":"my little sister"},
          {"q":"Where did they sit?","choices":["under the roof","in the forest","near the lake","by the bus"],"answer":"under the roof"},
          {"q":"When will they try again?","choices":["Next Friday","Last Friday","This morning","At midnight"],"answer":"Next Friday"}
        ]
      },
      {
        passage: "Last month, our family cleaned the forest path. We found an empty bottle near a stone and old wood by the water. I picked them up carefully when ants were there. Nothing bad happened, and the path looked clean again. Next month, we will go back with bags. We will keep the forest safe for children and our family too.",
        questions: [
          {"q":"What did the family clean?","choices":["the forest path","the kitchen floor","the school bus","the bedroom wall"],"answer":"the forest path"},
          {"q":"What did they find?","choices":["an empty bottle","a new tent","a loud radio","a warm blanket"],"answer":"an empty bottle"},
          {"q":"How did the speaker pick things up?","choices":["carefully","loudly","quickly","angrily"],"answer":"carefully"},
          {"q":"What will they bring next month?","choices":["bags","eggs","chairs","books"],"answer":"bags"}
        ]
      },
      {
        passage: "Yesterday, our family carried water to a small garden. The basket was heavy, but every bottle was full. I had a problem when one bottle fell, and water ran on my shoes. Mom helped me fill it again. We rested under a tree after lunch. Tomorrow, we will carry two bottles and take more rest, so we stay safe there.",
        questions: [
          {"q":"Where did the family carry water?","choices":["a small garden","a dark forest","a music room","a train station"],"answer":"a small garden"},
          {"q":"What was heavy?","choices":["the basket","the blanket","the rope","the tent"],"answer":"the basket"},
          {"q":"What fell?","choices":["one bottle","one stone","one tool","one apple"],"answer":"one bottle"},
          {"q":"What will they carry tomorrow?","choices":["two bottles","three baskets","four boxes","five bags"],"answer":"two bottles"}
        ]
      },
      {
        passage: "Last night, Dad wanted a quiet dinner in the yard. We built a small fire and put wood by it. Mom asked me to add tomatoes to soup and mix it. A loud sound came from the street, and my baby brother cried. We will eat at the table tomorrow if that happens again. Finally, we all ate and felt safe.",
        questions: [
          {"q":"What kind of dinner did Dad want?","choices":["a quiet dinner","a loud dinner","a cold dinner","a quick dinner"],"answer":"a quiet dinner"},
          {"q":"What did they build?","choices":["a small fire","a big tent","a stone wall","a wood box"],"answer":"a small fire"},
          {"q":"What did Mom ask the speaker to add?","choices":["tomatoes","eggs","rice","water"],"answer":"tomatoes"},
          {"q":"Where will they eat tomorrow?","choices":["at the table","in the yard","near the street","under the tree"],"answer":"at the table"}
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
    [{"en":"plant","zh":"植物"}],
    [{"en":"album","zh":"相簿"}, {"en":"act","zh":"表演"}],
    [{"en":"gym","zh":"體育館"}, {"en":"board","zh":"板子；看板"}],
    [{"en":"history","zh":"歷史"}],
    [{"en":"calendar","zh":"日曆；行事曆"}],
    [],
    []
  ],
  "2026-07-4": [
    [],
    [],
    [{"en":"part","zh":"部分；零件"}],
    [{"en":"picnic","zh":"野餐"}, {"en":"roof","zh":"屋頂"}],
    [{"en":"path","zh":"小路"}, {"en":"ant","zh":"螞蟻"}],
    [{"en":"garden","zh":"花園；菜園"}],
    [{"en":"yard","zh":"院子"}, {"en":"tomato","zh":"番茄"}, {"en":"street","zh":"街道"}]
  ]
};
function weekDrillFor(monthStr, weekN) { return WEEK_DRILLS[monthStr + "-" + weekN] || null; }
function passageGlossary(wid, idx) { return (PASSAGE_GLOSSARY[wid] && PASSAGE_GLOSSARY[wid][idx]) || []; }
if (typeof module !== "undefined" && module.exports) module.exports = { WEEK_DRILLS, weekDrillFor, PASSAGE_GLOSSARY, passageGlossary };
