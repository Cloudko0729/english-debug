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
  },
  "2026-08-1": {            // 第1週 夏日戶外與安全 · 比較級/現在完成式
    listenBlank: [
      { full: "We have been camping for three days.", display: "We have been ___ for three days.", answer: "camping" },
      { full: "The ocean is much bigger than the pond.", display: "The ___ is much bigger than the pond.", answer: "ocean" },
      { full: "I have never tried surfing before.", display: "I have never tried ___ before.", answer: "surfing" },
      { full: "My sister bought a new swimsuit.", display: "My sister bought a new ___.", answer: "swimsuit" },
      { full: "The pool is safer than the river.", display: "The ___ is safer than the river.", answer: "pool" },
      { full: "We went hiking in the woods.", display: "We went ___ in the woods.", answer: "hiking" },
      { full: "The waterfall was louder than the wind.", display: "The ___ was louder than the wind.", answer: "waterfall" },
      { full: "A mosquito bit me last night.", display: "A ___ bit me last night.", answer: "mosquito" },
      { full: "The sand was hotter than the road.", display: "The ___ was hotter than the road.", answer: "sand" },
      { full: "We have visited the fire station twice.", display: "We have visited the ___ twice.", answer: "fire station" },
      { full: "A police officer taught us the rules.", display: "A ___ taught us the rules.", answer: "police officer" },
      { full: "This trail is more dangerous than that one.", display: "This trail is more ___ than that one.", answer: "dangerous" },
      { full: "Please watch your little brother.", display: "Please ___ your little brother.", answer: "watch" },
      { full: "The pond is smaller than the lake.", display: "The ___ is smaller than the lake.", answer: "pond" },
      { full: "Dad has gone fishing with my uncle.", display: "Dad has gone ___ with my uncle.", answer: "fishing" },
      { full: "We rented a small boat yesterday.", display: "We rented a small ___ yesterday.", answer: "boat" },
      { full: "I was scared of the big waves.", display: "I was ___ of the big waves.", answer: "scared" },
      { full: "The water near the rocks is very deep.", display: "The water near the rocks is very ___.", answer: "deep" },
      { full: "Every camper must follow this rule.", display: "Every camper must follow this ___.", answer: "rule" },
      { full: "We stayed outside until dark.", display: "We stayed ___ until dark.", answer: "outside" },
      { full: "I love walking in nature.", display: "I love walking in ___.", answer: "nature" },
      { full: "We learned about water safety today.", display: "We learned about water ___ today.", answer: "safety" },
      { full: "My brother likes mountain-climbing.", display: "My brother likes ___.", answer: "mountain-climbing" },
      { full: "The policeman helped us find the way.", display: "The ___ helped us find the way.", answer: "policeman" },
      { full: "I have enjoyed traveling with my family.", display: "I have enjoyed ___ with my family.", answer: "traveling" }
    ],
    reorder: [
      { sentence: "We have been camping for three days.", chunks: ["We", "have been", "camping", "for", "three days."] },
      { sentence: "The ocean is bigger than the pond.", chunks: ["The ocean", "is", "bigger than", "the pond."] },
      { sentence: "I have never gone surfing before.", chunks: ["I", "have never", "gone", "surfing", "before."] },
      { sentence: "She put on her new swimsuit.", chunks: ["She", "put on", "her new", "swimsuit."] },
      { sentence: "The pool is safer than the river.", chunks: ["The pool", "is", "safer than", "the river."] },
      { sentence: "We went hiking in the woods.", chunks: ["We", "went", "hiking", "in the woods."] },
      { sentence: "The waterfall is taller than our school.", chunks: ["The waterfall", "is", "taller than", "our school."] },
      { sentence: "A mosquito bit my arm last night.", chunks: ["A mosquito", "bit", "my arm", "last night."] },
      { sentence: "The sand was hotter than the water.", chunks: ["The sand", "was", "hotter than", "the water."] },
      { sentence: "We have visited the fire station twice.", chunks: ["We", "have visited", "the fire station", "twice."] },
      { sentence: "The police officer taught us three rules.", chunks: ["The police officer", "taught us", "three", "rules."] },
      { sentence: "This path is more dangerous than that one.", chunks: ["This path", "is", "more dangerous", "than that one."] },
      { sentence: "Please watch your brother near the pond.", chunks: ["Please", "watch", "your brother", "near the pond."] },
      { sentence: "Dad has gone fishing with my uncle.", chunks: ["Dad", "has gone", "fishing", "with my uncle."] },
      { sentence: "We rented a small boat yesterday.", chunks: ["We", "rented", "a small boat", "yesterday."] },
      { sentence: "I have learned the safety rules.", chunks: ["I", "have learned", "the safety", "rules."] },
      { sentence: "The woods are quieter than the beach.", chunks: ["The woods", "are", "quieter than", "the beach."] },
      { sentence: "My cousin has never seen the ocean.", chunks: ["My cousin", "has never", "seen", "the ocean."] },
      { sentence: "We stayed outside until the sun went down.", chunks: ["We", "stayed outside", "until", "the sun", "went down."] },
      { sentence: "Swimming here is more dangerous than it looks.", chunks: ["Swimming here", "is", "more dangerous", "than it looks."] }
    ],
    reading: [
      {
        passage: "Last weekend my family went camping in the woods. The trip was longer than last year's, but it was more fun. On Saturday we walked to a waterfall. The water there was much colder than the pool at home. I have never seen a waterfall that tall. At night a mosquito bit my leg, so Mom put some cream on it. I want to go camping again next month.",
        questions: [
          { q: "Where did the family go?", choices: ["The woods", "The beach", "The pool", "The city"], answer: "The woods" },
          { q: "What did they walk to on Saturday?", choices: ["A waterfall", "A pond", "A fire station", "A boat"], answer: "A waterfall" },
          { q: "How was the water compared with the pool?", choices: ["Colder", "Warmer", "Deeper", "Cleaner"], answer: "Colder" },
          { q: "What bit the writer at night?", choices: ["A mosquito", "A dog", "A fish", "A bird"], answer: "A mosquito" }
        ]
      },
      {
        passage: "Our school took us to the fire station on Friday. A police officer came too, and she taught us the safety rules. She said the ocean is more dangerous than the pool because the waves are strong. She also told us to watch small children near water. I have learned a lot from her. Now I always tell my little brother to stay outside the deep part.",
        questions: [
          { q: "Where did the school go?", choices: ["The fire station", "The police station", "The beach", "The woods"], answer: "The fire station" },
          { q: "Who taught the rules?", choices: ["A police officer", "A teacher", "A doctor", "A driver"], answer: "A police officer" },
          { q: "Why is the ocean more dangerous?", choices: ["The waves are strong", "The water is warm", "It is small", "It has sand"], answer: "The waves are strong" },
          { q: "What does the writer tell his brother?", choices: ["Stay outside the deep part", "Swim faster", "Go home", "Bring a boat"], answer: "Stay outside the deep part" }
        ]
      },
      {
        passage: "My uncle has a small boat. Last Sunday he took me fishing on the pond near his house. The pond is smaller than the lake, but there are more fish. I caught two fish, and my uncle caught five. Fishing is quieter than surfing, so I like it better. We have gone fishing three times this summer.",
        questions: [
          { q: "Whose boat did they use?", choices: ["My uncle's", "My dad's", "My friend's", "The school's"], answer: "My uncle's" },
          { q: "Where did they go fishing?", choices: ["The pond", "The ocean", "The pool", "The waterfall"], answer: "The pond" },
          { q: "How many fish did the writer catch?", choices: ["Two", "Five", "Three", "Seven"], answer: "Two" },
          { q: "Why does the writer like fishing?", choices: ["It is quieter", "It is faster", "It is cheaper", "It is warmer"], answer: "It is quieter" }
        ]
      },
      {
        passage: "This summer I tried surfing for the first time. My sister bought me a new swimsuit before the trip. The sand was so hot that I had to run to the water. I was scared at first because the waves were bigger than I thought. My teacher told me that safety comes first, so I stayed near her. After one hour, surfing became easier than swimming.",
        questions: [
          { q: "What did the writer try?", choices: ["Surfing", "Fishing", "Camping", "Hiking"], answer: "Surfing" },
          { q: "Who bought the swimsuit?", choices: ["My sister", "My mother", "My teacher", "My uncle"], answer: "My sister" },
          { q: "Why was the writer scared?", choices: ["The waves were big", "The water was cold", "The sand was hot", "The boat was small"], answer: "The waves were big" },
          { q: "What happened after one hour?", choices: ["Surfing became easier", "He went home", "He lost his swimsuit", "It started to rain"], answer: "Surfing became easier" }
        ]
      },
      {
        passage: "My class went hiking last Tuesday. The path in the woods was steeper than the one near school, so we walked slowly. Our teacher said mountain-climbing is more dangerous than hiking, so we must follow every rule. We saw a pond with small fish in it. I have never enjoyed nature so much. Traveling with my classmates made the day even better, and we will hike there again next month.",
        questions: [
          { q: "When did the class go hiking?", choices: ["Last Tuesday", "Last Sunday", "Yesterday", "Next week"], answer: "Last Tuesday" },
          { q: "How was the path?", choices: ["Steeper", "Shorter", "Wider", "Flatter"], answer: "Steeper" },
          { q: "What did they see?", choices: ["A pond", "A waterfall", "An ocean", "A boat"], answer: "A pond" },
          { q: "What is more dangerous than hiking?", choices: ["Mountain-climbing", "Swimming", "Fishing", "Camping"], answer: "Mountain-climbing" }
        ]
      }
    ]
  },
  "2026-08-2": {            // 第2週 廚房與料理 · 比較級/現在完成式
    listenBlank: [
      { full: "Mom has been cooking since five o'clock.", display: "Mom has been ___ since five o'clock.", answer: "cooking" },
      { full: "Please put the fork next to the plate.", display: "Please put the ___ next to the plate.", answer: "fork" },
      { full: "This knife is sharper than that one.", display: "This ___ is sharper than that one.", answer: "knife" },
      { full: "I need a spoon for my soup.", display: "I need a ___ for my soup.", answer: "spoon" },
      { full: "Dad washed every plate after dinner.", display: "Dad washed every ___ after dinner.", answer: "plate" },
      { full: "The pan is hotter than the pot.", display: "The ___ is hotter than the pot.", answer: "pan" },
      { full: "Grandma has used this pot for years.", display: "Grandma has used this ___ for years.", answer: "pot" },
      { full: "We baked the bread in the oven.", display: "We baked the bread in the ___.", answer: "oven" },
      { full: "The microwave is faster than the stove.", display: "The ___ is faster than the stove.", answer: "microwave" },
      { full: "Please turn off the stove now.", display: "Please turn off the ___ now.", answer: "stove" },
      { full: "The ice cream is in the freezer.", display: "The ice cream is in the ___.", answer: "freezer" },
      { full: "Mom put a clean table cloth on the table.", display: "Mom put a clean ___ on the table.", answer: "table cloth" },
      { full: "Grandpa filled the teapot with hot water.", display: "Grandpa filled the ___ with hot water.", answer: "teapot" },
      { full: "Take a napkin before you eat.", display: "Take a ___ before you eat.", answer: "napkin" },
      { full: "My brother added too much soy-sauce.", display: "My brother added too much ___.", answer: "soy-sauce" },
      { full: "Be careful, the oil is very hot.", display: "Be careful, the ___ is very hot.", answer: "oil" },
      { full: "This soup needs more pepper.", display: "This soup needs more ___.", answer: "pepper" },
      { full: "My sister likes ketchup on her eggs.", display: "My sister likes ___ on her eggs.", answer: "ketchup" },
      { full: "I have put butter on my bread.", display: "I have put ___ on my bread.", answer: "butter" },
      { full: "Please bring me a glass of water.", display: "Please bring me a ___ of water.", answer: "glass" },
      { full: "The faucet is leaking again.", display: "The ___ is leaking again.", answer: "faucet" },
      { full: "I will mop the floor after lunch.", display: "I will ___ the floor after lunch.", answer: "mop" },
      { full: "This dessert is sweeter than the cake.", display: "This ___ is sweeter than the cake.", answer: "dessert" },
      { full: "Grandma keeps sugar in a glass jar.", display: "Grandma keeps sugar in a glass ___.", answer: "jar" },
      { full: "Put the rice in a small bowl.", display: "Put the rice in a small ___.", answer: "bowl" }
    ],
    reorder: [
      { sentence: "Mom has been cooking all morning.", chunks: ["Mom", "has been", "cooking", "all morning."] },
      { sentence: "Please put the fork on the plate.", chunks: ["Please", "put", "the fork", "on the plate."] },
      { sentence: "This knife is sharper than that one.", chunks: ["This knife", "is", "sharper than", "that one."] },
      { sentence: "I need a spoon for my soup.", chunks: ["I", "need", "a spoon", "for my soup."] },
      { sentence: "Dad washed every plate after dinner.", chunks: ["Dad", "washed", "every plate", "after dinner."] },
      { sentence: "The pan is hotter than the pot.", chunks: ["The pan", "is", "hotter than", "the pot."] },
      { sentence: "Grandma has used this pot for years.", chunks: ["Grandma", "has used", "this pot", "for years."] },
      { sentence: "We baked the bread in the oven.", chunks: ["We", "baked", "the bread", "in the oven."] },
      { sentence: "The microwave is faster than the stove.", chunks: ["The microwave", "is", "faster than", "the stove."] },
      { sentence: "Please turn off the stove now.", chunks: ["Please", "turn off", "the stove", "now."] },
      { sentence: "The ice cream is in the freezer.", chunks: ["The ice cream", "is", "in the", "freezer."] },
      { sentence: "Mom put a clean table cloth on the table.", chunks: ["Mom", "put", "a clean table cloth", "on the table."] },
      { sentence: "Grandpa filled the teapot with hot water.", chunks: ["Grandpa", "filled", "the teapot", "with hot water."] },
      { sentence: "My brother added too much soy-sauce.", chunks: ["My brother", "added", "too much", "soy-sauce."] },
      { sentence: "This soup needs more pepper than salt.", chunks: ["This soup", "needs", "more pepper", "than salt."] },
      { sentence: "I have put butter on my bread.", chunks: ["I", "have put", "butter", "on my bread."] },
      { sentence: "Please bring me a glass of water.", chunks: ["Please", "bring me", "a glass", "of water."] },
      { sentence: "I will mop the floor after lunch.", chunks: ["I", "will mop", "the floor", "after lunch."] },
      { sentence: "This dessert is sweeter than the cake.", chunks: ["This dessert", "is", "sweeter than", "the cake."] },
      { sentence: "Put the rice in a small bowl.", chunks: ["Put", "the rice", "in a", "small bowl."] }
    ],
    reading: [
      {
        passage: "My mother has been cooking for our family since I was small. Tonight she made soup in a big pot on the stove. She asked me to put a fork, a spoon and a napkin next to every plate. I also put a clean table cloth on the table. Cooking at home is cheaper than eating outside, and it tastes better too.",
        questions: [
          { q: "How long has the mother been cooking for the family?", choices: ["Since the writer was small", "Since last year", "Since Monday", "Since dinner"], answer: "Since the writer was small" },
          { q: "What did she make?", choices: ["Soup", "Rice", "Bread", "Cake"], answer: "Soup" },
          { q: "What did the writer put next to every plate?", choices: ["A fork, a spoon and a napkin", "A knife and a jar", "A pan and a pot", "A teapot"], answer: "A fork, a spoon and a napkin" },
          { q: "Why is cooking at home better?", choices: ["It is cheaper and tastes better", "It is faster", "It is easier", "It is louder"], answer: "It is cheaper and tastes better" }
        ]
      },
      {
        passage: "Today I helped Dad in the kitchen for the first time. He told me that a knife is more dangerous than a spoon, so I must be careful. First we put some oil in the pan. Then we cooked eggs on the stove. Dad added a little pepper, but I asked for ketchup. I have never made breakfast before, and it was fun.",
        questions: [
          { q: "Who did the writer help?", choices: ["Dad", "Mom", "Grandma", "A friend"], answer: "Dad" },
          { q: "What is more dangerous than a spoon?", choices: ["A knife", "A pan", "A napkin", "A plate"], answer: "A knife" },
          { q: "What did they cook?", choices: ["Eggs", "Soup", "Rice", "Bread"], answer: "Eggs" },
          { q: "What did the writer ask for?", choices: ["Ketchup", "Pepper", "Butter", "Oil"], answer: "Ketchup" }
        ]
      },
      {
        passage: "Grandma keeps her sugar in a glass jar next to the teapot. Every afternoon she makes tea and puts a small saucer under each cup. Yesterday she baked a dessert in the oven. It was sweeter than the cake we bought last week. After tea, I helped her sweep the floor and wash the tableware.",
        questions: [
          { q: "Where does Grandma keep the sugar?", choices: ["In a glass jar", "In the freezer", "In a pot", "In the oven"], answer: "In a glass jar" },
          { q: "What does she put under each cup?", choices: ["A saucer", "A napkin", "A plate", "A bowl"], answer: "A saucer" },
          { q: "How was the dessert?", choices: ["Sweeter than the cake", "Colder than ice", "Hotter than soup", "Smaller than bread"], answer: "Sweeter than the cake" },
          { q: "What did the writer do after tea?", choices: ["Sweep the floor", "Mop the table", "Open the faucet", "Cook eggs"], answer: "Sweep the floor" }
        ]
      },
      {
        passage: "Our new kitchen has a microwave oven and a big refrigerator. The microwave is faster than the oven, so we use it when we are late. Mom keeps ice cream in the freezer for hot days. Last night the faucet started leaking, and water went all over the floor. Dad fixed it, and I used a mop to clean up.",
        questions: [
          { q: "What is faster than the oven?", choices: ["The microwave", "The stove", "The pan", "The pot"], answer: "The microwave" },
          { q: "What does Mom keep in the freezer?", choices: ["Ice cream", "Butter", "Soup", "Bread"], answer: "Ice cream" },
          { q: "What happened last night?", choices: ["The faucet leaked", "The oven broke", "The pot fell", "The light went out"], answer: "The faucet leaked" },
          { q: "What did the writer use to clean up?", choices: ["A mop", "A napkin", "A table cloth", "A spoon"], answer: "A mop" }
        ]
      },
      {
        passage: "On Sunday my brother and I cooked lunch by ourselves. We put rice in a bowl and soup in a pot. My brother added too much soy-sauce, so the soup was saltier than usual. I put butter on the bread and made a small dessert. Mom said our lunch was better than she expected. We have decided to cook again next weekend.",
        questions: [
          { q: "Who cooked lunch?", choices: ["The writer and his brother", "Mom and Dad", "Grandma", "The writer alone"], answer: "The writer and his brother" },
          { q: "What did the brother add too much of?", choices: ["Soy-sauce", "Pepper", "Ketchup", "Oil"], answer: "Soy-sauce" },
          { q: "What did the writer put on the bread?", choices: ["Butter", "Ketchup", "Oil", "Sugar"], answer: "Butter" },
          { q: "What did Mom say?", choices: ["The lunch was better than she expected", "The lunch was too salty", "She would cook next time", "She was not hungry"], answer: "The lunch was better than she expected" }
        ]
      }
    ]
  },
  "2026-08-3": {            // 第3週 商店與購物 · 比較級/現在完成式
    listenBlank: [
      { full: "We went shopping on Saturday morning.", display: "We went ___ on Saturday morning.", answer: "shopping" },
      { full: "I bought milk at the convenience store.", display: "I bought milk at the ___.", answer: "convenience store" },
      { full: "The department store is bigger than the mall.", display: "The ___ is bigger than the mall.", answer: "department store" },
      { full: "Mom bought medicine at the drugstore.", display: "Mom bought medicine at the ___.", answer: "drugstore" },
      { full: "Dad stopped at the flower shop.", display: "Dad stopped at the ___.", answer: "flower shop" },
      { full: "I need a new pen from the stationery store.", display: "I need a new pen from the ___.", answer: "stationery store" },
      { full: "The clerk helped me find my size.", display: "The ___ helped me find my size.", answer: "clerk" },
      { full: "The shopkeeper opened the door early.", display: "The ___ opened the door early.", answer: "shopkeeper" },
      { full: "These shoes are on sale today.", display: "These shoes are on ___ today.", answer: "sale" },
      { full: "They sell fresh bread every morning.", display: "They ___ fresh bread every morning.", answer: "sell" },
      { full: "How much does this book cost?", display: "How much does this book ___?", answer: "cost" },
      { full: "I found an old coin in my pocket.", display: "I found an old ___ in my pocket.", answer: "coin" },
      { full: "My sister lost her purse yesterday.", display: "My sister lost her ___ yesterday.", answer: "purse" },
      { full: "Dad keeps his cards in a brown wallet.", display: "Dad keeps his cards in a brown ___.", answer: "wallet" },
      { full: "The mall is closer than the market.", display: "The ___ is closer than the market.", answer: "mall" },
      { full: "I sent a postcard to my grandma.", display: "I sent a ___ to my grandma.", answer: "postcard" },
      { full: "She bought new stationery for school.", display: "She bought new ___ for school.", answer: "stationery" },
      { full: "My uncle still uses a cd player.", display: "My uncle still uses a ___.", answer: "cd player" },
      { full: "Grandpa listens to the radio every night.", display: "Grandpa listens to the ___ every night.", answer: "radio" },
      { full: "This blouse is cheaper than that dress.", display: "This ___ is cheaper than that dress.", answer: "blouse" },
      { full: "I lost one glove on the bus.", display: "I lost one ___ on the bus.", answer: "glove" },
      { full: "My sneakers are more comfortable than my boots.", display: "My ___ are more comfortable than my boots.", answer: "sneakers" },
      { full: "We packed everything in a big suitcase.", display: "We packed everything in a big ___.", answer: "suitcase" },
      { full: "I paid with cash instead of a card.", display: "I paid with ___ instead of a card.", answer: "cash" },
      { full: "The salesman was very friendly.", display: "The ___ was very friendly.", answer: "salesman" }
    ],
    reorder: [
      { sentence: "We went shopping on Saturday morning.", chunks: ["We", "went shopping", "on Saturday", "morning."] },
      { sentence: "I bought milk at the convenience store.", chunks: ["I", "bought", "milk", "at the convenience store."] },
      { sentence: "The department store is bigger than the mall.", chunks: ["The department store", "is", "bigger than", "the mall."] },
      { sentence: "Mom bought medicine at the drugstore.", chunks: ["Mom", "bought", "medicine", "at the drugstore."] },
      { sentence: "Dad stopped at the flower shop.", chunks: ["Dad", "stopped", "at the", "flower shop."] },
      { sentence: "I need a pen from the stationery store.", chunks: ["I", "need", "a pen", "from the stationery store."] },
      { sentence: "The clerk helped me find my size.", chunks: ["The clerk", "helped me", "find", "my size."] },
      { sentence: "These shoes are on sale today.", chunks: ["These shoes", "are", "on sale", "today."] },
      { sentence: "They sell fresh bread every morning.", chunks: ["They", "sell", "fresh bread", "every morning."] },
      { sentence: "This book costs more than that one.", chunks: ["This book", "costs", "more than", "that one."] },
      { sentence: "I found an old coin in my pocket.", chunks: ["I", "found", "an old coin", "in my pocket."] },
      { sentence: "My sister has lost her purse again.", chunks: ["My sister", "has lost", "her purse", "again."] },
      { sentence: "Dad keeps his cards in a wallet.", chunks: ["Dad", "keeps", "his cards", "in a wallet."] },
      { sentence: "The mall is closer than the market.", chunks: ["The mall", "is", "closer than", "the market."] },
      { sentence: "I have sent a postcard to Grandma.", chunks: ["I", "have sent", "a postcard", "to Grandma."] },
      { sentence: "This blouse is cheaper than that dress.", chunks: ["This blouse", "is", "cheaper than", "that dress."] },
      { sentence: "I lost one glove on the bus.", chunks: ["I", "lost", "one glove", "on the bus."] },
      { sentence: "My sneakers are more comfortable than my boots.", chunks: ["My sneakers", "are", "more comfortable", "than my boots."] },
      { sentence: "We packed everything in a big suitcase.", chunks: ["We", "packed", "everything", "in a big suitcase."] },
      { sentence: "The salesman showed us three radios.", chunks: ["The salesman", "showed us", "three", "radios."] }
    ],
    reading: [
      {
        passage: "On Saturday my mother took me shopping at the department store. It is much bigger than the convenience store near our house. Many shoes were on sale, so I bought a pair of sneakers. They were cheaper than the ones I saw last month. The clerk was friendly and helped me find my size. I paid with cash from my own purse.",
        questions: [
          { q: "Where did they go?", choices: ["The department store", "The drugstore", "The flower shop", "The mall"], answer: "The department store" },
          { q: "What did the writer buy?", choices: ["Sneakers", "A blouse", "A glove", "A suitcase"], answer: "Sneakers" },
          { q: "How were the sneakers compared with last month?", choices: ["Cheaper", "More expensive", "Bigger", "Heavier"], answer: "Cheaper" },
          { q: "How did the writer pay?", choices: ["With cash", "With a credit card", "With a coin", "With a postcard"], answer: "With cash" }
        ]
      },
      {
        passage: "My father needed a birthday gift for my mother, so we went to the flower shop first. Then we walked to the stationery store because Mom loves nice paper. The shopkeeper there has known our family for years. He gave us a small card for free. Dad said the gift was less important than the thought. I have never seen my mother so happy.",
        questions: [
          { q: "Where did they go first?", choices: ["The flower shop", "The stationery store", "The drugstore", "The mall"], answer: "The flower shop" },
          { q: "Why did they go to the stationery store?", choices: ["Mom loves nice paper", "It was on sale", "It was near", "Dad needed a pen"], answer: "Mom loves nice paper" },
          { q: "What did the shopkeeper give them?", choices: ["A small card", "A flower", "A coin", "A bag"], answer: "A small card" },
          { q: "What did Dad say?", choices: ["The thought is more important than the gift", "The gift was expensive", "The shop was far", "Mom was busy"], answer: "The thought is more important than the gift" }
        ]
      },
      {
        passage: "Last week I lost my wallet at the mall. Inside there were two coins and my bus card. I told a salesman, and he called the office for me. An hour later a customer brought it to the front desk. Nothing was missing. I have learned to keep my wallet in my front pocket. Losing money is worse than losing time.",
        questions: [
          { q: "Where did the writer lose the wallet?", choices: ["At the mall", "At school", "On the bus", "At the drugstore"], answer: "At the mall" },
          { q: "What was inside?", choices: ["Two coins and a bus card", "A credit card", "A postcard", "A glove"], answer: "Two coins and a bus card" },
          { q: "Who brought it back?", choices: ["A customer", "A clerk", "A salesman", "A teacher"], answer: "A customer" },
          { q: "What has the writer learned?", choices: ["To keep it in his front pocket", "To buy a new wallet", "To carry less money", "To walk faster"], answer: "To keep it in his front pocket" }
        ]
      },
      {
        passage: "My grandfather still uses an old cd player and a radio. He says music sounds warmer on them than on a phone. Last month we went to a shop that sells old machines. The clerk showed us a tape recorder and even a vcr. Grandpa smiled and told me that his first video cost him a whole month of work.",
        questions: [
          { q: "What does Grandpa still use?", choices: ["A cd player and a radio", "A phone and a tv", "A video and a camera", "A wallet"], answer: "A cd player and a radio" },
          { q: "Why does he like them?", choices: ["Music sounds warmer", "They are cheaper", "They are smaller", "They are new"], answer: "Music sounds warmer" },
          { q: "What did the clerk show them?", choices: ["A tape recorder and a vcr", "A blouse", "A suitcase", "Sneakers"], answer: "A tape recorder and a vcr" },
          { q: "What did Grandpa say about his first video?", choices: ["It cost a month of work", "It was free", "It was broken", "It was a gift"], answer: "It cost a month of work" }
        ]
      },
      {
        passage: "We are going to visit my aunt next week, so Mom bought a new suitcase at the mall. It is lighter than our old one but holds more clothes. I packed my favorite blouse, two pairs of gloves and my sneakers. Mom also bought postcards at the convenience store to send to my classmates. Shopping before a trip is more exciting than the trip itself.",
        questions: [
          { q: "Why did Mom buy a suitcase?", choices: ["They are visiting the aunt", "The old one was lost", "It was on sale", "For school"], answer: "They are visiting the aunt" },
          { q: "How is the new suitcase?", choices: ["Lighter but holds more", "Heavier but smaller", "Older", "The same"], answer: "Lighter but holds more" },
          { q: "What did the writer pack?", choices: ["A blouse, gloves and sneakers", "A radio", "A wallet", "A teapot"], answer: "A blouse, gloves and sneakers" },
          { q: "Where did Mom buy the postcards?", choices: ["The convenience store", "The flower shop", "The drugstore", "The department store"], answer: "The convenience store" }
        ]
      }
    ]
  },
  "2026-08-4": {            // 第4週 城市與交通 · 比較級/現在完成式
    listenBlank: [
      { full: "The airplane landed ten minutes late.", display: "The ___ landed ten minutes late.", answer: "airplane" },
      { full: "We took a taxi to the hospital.", display: "We took a ___ to the hospital.", answer: "taxi" },
      { full: "The subway is faster than the bus.", display: "The ___ is faster than the bus.", answer: "subway" },
      { full: "My father rides a motorcycle to work.", display: "My father rides a ___ to work.", answer: "motorcycle" },
      { full: "The driver stopped at the corner.", display: "The ___ stopped at the corner.", answer: "driver" },
      { full: "We stopped at the gas station first.", display: "We stopped at the ___ first.", answer: "gas station" },
      { full: "Dad found a space in the parking lot.", display: "Dad found a space in the ___.", answer: "parking lot" },
      { full: "I waited for my cousin at the train station.", display: "I waited for my cousin at the ___.", answer: "train station" },
      { full: "We were stuck in a traffic jam.", display: "We were stuck in a ___.", answer: "traffic jam" },
      { full: "Please wait for the green traffic light.", display: "Please wait for the green ___.", answer: "traffic light" },
      { full: "The traffic sign says no bicycles.", display: "The ___ says no bicycles.", answer: "traffic sign" },
      { full: "My aunt works downtown.", display: "My aunt works ___.", answer: "downtown" },
      { full: "That building is taller than our school.", display: "That ___ is taller than our school.", answer: "building" },
      { full: "Turn left at the next corner.", display: "Turn left at the next ___.", answer: "corner" },
      { full: "The entrance is on the other side.", display: "The ___ is on the other side.", answer: "entrance" },
      { full: "Please use the back exit.", display: "Please use the back ___.", answer: "exit" },
      { full: "We will get on the bus at eight.", display: "We will ___ the bus at eight.", answer: "get on" },
      { full: "Don't get off before the last stop.", display: "Don't ___ before the last stop.", answer: "get off" },
      { full: "Dad keeps his car in the garage.", display: "Dad keeps his car in the ___.", answer: "garage" },
      { full: "We had a flat tire on the highway.", display: "We had a ___ on the highway.", answer: "flat tire" },
      { full: "One wheel was making a strange sound.", display: "One ___ was making a strange sound.", answer: "wheel" },
      { full: "The traffic today is worse than yesterday.", display: "The ___ today is worse than yesterday.", answer: "traffic" },
      { full: "Please walk on the sidewalk.", display: "Please walk on the ___.", answer: "sidewalk" },
      { full: "The highway was busier than usual.", display: "The ___ was busier than usual.", answer: "highway" },
      { full: "Every passenger must wear a seat belt.", display: "Every ___ must wear a seat belt.", answer: "passenger" }
    ],
    reorder: [
      { sentence: "The airplane landed ten minutes late.", chunks: ["The airplane", "landed", "ten minutes", "late."] },
      { sentence: "We took a taxi to the hospital.", chunks: ["We", "took", "a taxi", "to the hospital."] },
      { sentence: "The subway is faster than the bus.", chunks: ["The subway", "is", "faster than", "the bus."] },
      { sentence: "My father rides a motorcycle to work.", chunks: ["My father", "rides", "a motorcycle", "to work."] },
      { sentence: "The driver stopped at the corner.", chunks: ["The driver", "stopped", "at the corner."] },
      { sentence: "We stopped at the gas station first.", chunks: ["We", "stopped", "at the gas station", "first."] },
      { sentence: "Dad found a space in the parking lot.", chunks: ["Dad", "found", "a space", "in the parking lot."] },
      { sentence: "I waited for my cousin at the train station.", chunks: ["I", "waited for", "my cousin", "at the train station."] },
      { sentence: "We were stuck in a traffic jam.", chunks: ["We", "were stuck", "in a", "traffic jam."] },
      { sentence: "Please wait for the green traffic light.", chunks: ["Please", "wait for", "the green", "traffic light."] },
      { sentence: "That building is taller than our school.", chunks: ["That building", "is", "taller than", "our school."] },
      { sentence: "Turn left at the next corner.", chunks: ["Turn left", "at the", "next corner."] },
      { sentence: "The entrance is on the other side.", chunks: ["The entrance", "is", "on the", "other side."] },
      { sentence: "We will get on the bus at eight.", chunks: ["We", "will", "get on", "the bus", "at eight."] },
      { sentence: "Dad keeps his car in the garage.", chunks: ["Dad", "keeps", "his car", "in the garage."] },
      { sentence: "We had a flat tire on the highway.", chunks: ["We", "had", "a flat tire", "on the highway."] },
      { sentence: "The traffic today is worse than yesterday.", chunks: ["The traffic", "today", "is worse than", "yesterday."] },
      { sentence: "Please walk on the sidewalk.", chunks: ["Please", "walk", "on the", "sidewalk."] },
      { sentence: "Every passenger must wear a seat belt.", chunks: ["Every passenger", "must wear", "a seat belt."] },
      { sentence: "I have never taken the subway alone.", chunks: ["I", "have never", "taken", "the subway", "alone."] }
    ],
    reading: [
      {
        passage: "Every morning my mother takes the subway to work downtown. She says the subway is faster than a taxi because there is no traffic jam under the ground. Last Friday the trains were late, so she took a bus instead. She got off at the wrong stop and had to walk ten minutes. Now she leaves home earlier than before.",
        questions: [
          { q: "How does the mother usually go to work?", choices: ["By subway", "By taxi", "By bus", "By motorcycle"], answer: "By subway" },
          { q: "Why is the subway faster?", choices: ["There is no traffic jam", "It is cheaper", "It is newer", "It is quieter"], answer: "There is no traffic jam" },
          { q: "What happened last Friday?", choices: ["The trains were late", "The bus broke", "She lost her wallet", "It rained"], answer: "The trains were late" },
          { q: "What does she do now?", choices: ["Leaves home earlier", "Takes a taxi", "Walks to work", "Works at home"], answer: "Leaves home earlier" }
        ]
      },
      {
        passage: "My uncle is a taxi driver in the city. He knows every street and every traffic sign. He told me that driving downtown is harder than driving on the highway because there are more traffic lights. Once a passenger got in with a big bag and left it behind, and my uncle drove back to return it. He said honesty is more important than money.",
        questions: [
          { q: "What is the uncle's job?", choices: ["A taxi driver", "A police officer", "A clerk", "A salesman"], answer: "A taxi driver" },
          { q: "What is harder than driving on the highway?", choices: ["Driving downtown", "Parking a car", "Walking", "Riding a bicycle"], answer: "Driving downtown" },
          { q: "What did a passenger leave?", choices: ["A bag", "A wallet", "A coin", "A suitcase"], answer: "A bag" },
          { q: "What did the uncle say?", choices: ["Honesty is more important than money", "Money is important", "The city is small", "Traffic is easy"], answer: "Honesty is more important than money" }
        ]
      },
      {
        passage: "Last Sunday we drove to the mountains. On the way, Dad stopped at a gas station to fill the car. Half an hour later, we had a flat tire on the highway. Dad changed the wheel by himself, but it took longer than he expected. We arrived after dark, so we could not see the waterfall. I have never had such a long trip.",
        questions: [
          { q: "Where did Dad stop first?", choices: ["A gas station", "A parking lot", "A train station", "A garage"], answer: "A gas station" },
          { q: "What happened on the highway?", choices: ["A flat tire", "A traffic jam", "Heavy rain", "A wrong turn"], answer: "A flat tire" },
          { q: "Who changed the wheel?", choices: ["Dad", "A driver", "A passenger", "The writer"], answer: "Dad" },
          { q: "Why could they not see the waterfall?", choices: ["They arrived after dark", "It was closed", "It was raining", "They were tired"], answer: "They arrived after dark" }
        ]
      },
      {
        passage: "There is a new building near the train station. It is taller than every other building downtown. On the first floor there is a big parking lot, and the entrance is on the corner. My brother and I went there by bicycle and rode along the sidewalk. A guard told us that bicycles must use the road, not the sidewalk. We have learned a new rule today.",
        questions: [
          { q: "Where is the new building?", choices: ["Near the train station", "Near the airport", "In the park", "Near our school"], answer: "Near the train station" },
          { q: "How tall is it?", choices: ["Taller than every other building downtown", "Shorter than the school", "The same as the mall", "Very small"], answer: "Taller than every other building downtown" },
          { q: "How did they get there?", choices: ["By bicycle", "By taxi", "By subway", "On foot"], answer: "By bicycle" },
          { q: "What did the guard say?", choices: ["Bicycles must use the road", "Bicycles are not allowed", "The building is closed", "They must pay"], answer: "Bicycles must use the road" }
        ]
      },
      {
        passage: "My grandfather has lived in this city for fifty years. He says the traffic now is much worse than before. When he was young, there were fewer cars, and bicycle riding was everywhere. Today he still walks to the market instead of taking the mrt. He tells me that walking is healthier than sitting in a car. I get on the bus with him only when it rains.",
        questions: [
          { q: "How long has Grandpa lived in this city?", choices: ["Fifty years", "Fifteen years", "Five years", "Two years"], answer: "Fifty years" },
          { q: "How was the traffic before?", choices: ["Better than now", "Worse than now", "The same as now", "Very busy"], answer: "Better than now" },
          { q: "How does he go to the market?", choices: ["He walks", "By mrt", "By taxi", "By bicycle"], answer: "He walks" },
          { q: "When do they take the bus?", choices: ["When it rains", "Every day", "On Sunday", "Never"], answer: "When it rains" }
        ]
      }
    ]
  },
  "2026-08-5": {            // 第5週 新學期與課表 · 比較級/現在完成式
    listenBlank: [
      { full: "Our class has thirty students this year.", display: "Our ___ has thirty students this year.", answer: "class" },
      { full: "She was chosen as the new class leader.", display: "She was chosen as the new ___.", answer: "class leader" },
      { full: "My cousin still goes to elementary school.", display: "My cousin still goes to ___.", answer: "elementary school" },
      { full: "My sister will start senior high school.", display: "My sister will start ___.", answer: "senior high school" },
      { full: "My brother is in first grade.", display: "My brother is in ___.", answer: "first grade" },
      { full: "The children in kindergarten sing every morning.", display: "The children in ___ sing every morning.", answer: "kindergarten" },
      { full: "My schoolmate lives on the same street.", display: "My ___ lives on the same street.", answer: "schoolmate" },
      { full: "I think math is harder than English.", display: "I think ___ is harder than English.", answer: "math" },
      { full: "Please write the date on the calendar.", display: "Please write the date on the ___.", answer: "calendar" },
      { full: "We have swimming class every weekday.", display: "We have swimming class every ___.", answer: "weekday" },
      { full: "Ms. Lin will teach us this semester.", display: "Ms. Lin will ___ us this semester.", answer: "teach" },
      { full: "We made cards for teacher's day.", display: "We made cards for ___.", answer: "teacher's day" },
      { full: "The test took a quarter of an hour.", display: "The test took a ___ of an hour.", answer: "quarter" },
      { full: "This book is for my level.", display: "This book is for my ___.", answer: "level" },
      { full: "I am still a beginner at the piano.", display: "I am still a ___ at the piano.", answer: "beginner" },
      { full: "The beginning of the story was slow.", display: "The ___ of the story was slow.", answer: "beginning" },
      { full: "We have a daily meeting before class.", display: "We have a ___ meeting before class.", answer: "daily" },
      { full: "The meeting starts at eight.", display: "The ___ starts at eight.", answer: "meeting" },
      { full: "My sister loves pop music.", display: "My sister loves ___.", answer: "pop music" },
      { full: "He plays the trumpet in the school band.", display: "He plays the ___ in the school band.", answer: "trumpet" },
      { full: "My aunt is a famous artist.", display: "My aunt is a famous ___.", answer: "artist" },
      { full: "Her painting is bigger than mine.", display: "Her ___ is bigger than mine.", answer: "painting" },
      { full: "The campus is quieter during the holiday.", display: "The ___ is quieter during the holiday.", answer: "campus" },
      { full: "I signed up for a drawing course.", display: "I signed up for a drawing ___.", answer: "course" },
      { full: "This semester is shorter than the last one.", display: "This ___ is shorter than the last one.", answer: "semester" }
    ],
    reorder: [
      { sentence: "Our class has thirty students this year.", chunks: ["Our class", "has", "thirty students", "this year."] },
      { sentence: "She has become our new class leader.", chunks: ["She", "has become", "our new", "class leader."] },
      { sentence: "My cousin still goes to elementary school.", chunks: ["My cousin", "still goes", "to elementary school."] },
      { sentence: "My sister will start senior high school.", chunks: ["My sister", "will start", "senior high school."] },
      { sentence: "My brother is in first grade.", chunks: ["My brother", "is", "in first grade."] },
      { sentence: "The children in kindergarten sing every morning.", chunks: ["The children", "in kindergarten", "sing", "every morning."] },
      { sentence: "My schoolmate lives on the same street.", chunks: ["My schoolmate", "lives", "on the same street."] },
      { sentence: "Math is harder than English for me.", chunks: ["Math", "is", "harder than", "English for me."] },
      { sentence: "Please write the date on the calendar.", chunks: ["Please", "write", "the date", "on the calendar."] },
      { sentence: "We have swimming class every weekday.", chunks: ["We", "have", "swimming class", "every weekday."] },
      { sentence: "Ms. Lin will teach us this semester.", chunks: ["Ms. Lin", "will teach", "us", "this semester."] },
      { sentence: "We made cards for teacher's day.", chunks: ["We", "made cards", "for", "teacher's day."] },
      { sentence: "The test took a quarter of an hour.", chunks: ["The test", "took", "a quarter", "of an hour."] },
      { sentence: "I am still a beginner at the piano.", chunks: ["I", "am still", "a beginner", "at the piano."] },
      { sentence: "We have a daily meeting before class.", chunks: ["We", "have", "a daily meeting", "before class."] },
      { sentence: "He plays the trumpet in the band.", chunks: ["He", "plays", "the trumpet", "in the band."] },
      { sentence: "Her painting is bigger than mine.", chunks: ["Her painting", "is", "bigger than", "mine."] },
      { sentence: "The campus is quieter during the holiday.", chunks: ["The campus", "is", "quieter", "during the holiday."] },
      { sentence: "I have signed up for a drawing course.", chunks: ["I", "have signed up", "for a", "drawing course."] },
      { sentence: "This semester is shorter than the last one.", chunks: ["This semester", "is", "shorter than", "the last one."] }
    ],
    reading: [
      {
        passage: "The new semester started on Monday. Our class has thirty students, and five of them are new schoolmates. Ms. Lin will teach us math this year. She says math is easier than most students think, but we must practice daily. We also have a short meeting every weekday morning. I am a little nervous, but I am more excited than nervous.",
        questions: [
          { q: "When did the semester start?", choices: ["On Monday", "On Friday", "Last week", "Next month"], answer: "On Monday" },
          { q: "How many students are in the class?", choices: ["Thirty", "Five", "Thirteen", "Twenty"], answer: "Thirty" },
          { q: "Who will teach math?", choices: ["Ms. Lin", "Mr. Wang", "The class leader", "An artist"], answer: "Ms. Lin" },
          { q: "How does the writer feel?", choices: ["More excited than nervous", "Very sad", "Bored", "Angry"], answer: "More excited than nervous" }
        ]
      },
      {
        passage: "My little brother started kindergarten this year, and my sister is in second grade at the same elementary school. I am the oldest, so I walk them to the campus every morning. My brother cried on the first day, but now he likes it better than staying home. Next year my sister will move to a new level, and I will start senior high school.",
        questions: [
          { q: "Who started kindergarten?", choices: ["The little brother", "The sister", "The writer", "A schoolmate"], answer: "The little brother" },
          { q: "Which grade is the sister in?", choices: ["Second grade", "First grade", "Kindergarten", "Senior high school"], answer: "Second grade" },
          { q: "Who walks them to school?", choices: ["The writer", "Their mother", "Their father", "A teacher"], answer: "The writer" },
          { q: "What will the writer do next year?", choices: ["Start senior high school", "Stay home", "Change class", "Teach"], answer: "Start senior high school" }
        ]
      },
      {
        passage: "Our teacher put a big calendar on the wall. She marked teacher's day and the last day of the semester in red. Every period is forty minutes long, and we get a quarter of an hour to rest between classes. My favorite course is art, because our teacher is a real artist. Her painting of the campus hangs by the entrance.",
        questions: [
          { q: "What did the teacher put on the wall?", choices: ["A calendar", "A painting", "A sign", "A photo"], answer: "A calendar" },
          { q: "How long is each period?", choices: ["Forty minutes", "A quarter of an hour", "One hour", "Thirty minutes"], answer: "Forty minutes" },
          { q: "What is the writer's favorite course?", choices: ["Art", "Math", "Music", "English"], answer: "Art" },
          { q: "Where does the painting hang?", choices: ["By the entrance", "In the classroom", "At home", "In the office"], answer: "By the entrance" }
        ]
      },
      {
        passage: "I joined the school band at the beginning of this semester. I chose the trumpet because it is louder than the piano. I am still a beginner, so my sound is not very good. Our teacher says practice is more important than talent. We play pop music at the school meeting every month. My parents have come to watch us twice.",
        questions: [
          { q: "What did the writer join?", choices: ["The school band", "The art class", "A meeting", "A course"], answer: "The school band" },
          { q: "Why did the writer choose the trumpet?", choices: ["It is louder than the piano", "It is easier", "It is smaller", "It is cheaper"], answer: "It is louder than the piano" },
          { q: "What does the teacher say?", choices: ["Practice is more important than talent", "Talent matters most", "Music is hard", "Play every day"], answer: "Practice is more important than talent" },
          { q: "How often do they play at the meeting?", choices: ["Every month", "Every week", "Every day", "Twice a year"], answer: "Every month" }
        ]
      },
      {
        passage: "Our class chose a new class leader today. Three students wanted the job, so we had a short meeting and voted. The winner was my schoolmate Anna, who is quieter than the other two but works harder. She said her first plan is to make a daily cleaning list. Our teacher told us that a good leader listens more than she speaks.",
        questions: [
          { q: "What did the class do today?", choices: ["Chose a new class leader", "Had a test", "Went outside", "Changed teachers"], answer: "Chose a new class leader" },
          { q: "How many students wanted the job?", choices: ["Three", "Two", "Five", "Thirty"], answer: "Three" },
          { q: "What is Anna like?", choices: ["Quieter but works harder", "The loudest", "The tallest", "The newest"], answer: "Quieter but works harder" },
          { q: "What did the teacher say?", choices: ["A good leader listens more than she speaks", "A leader must be loud", "A leader must be smart", "Leaders work alone"], answer: "A good leader listens more than she speaks" }
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
  ],
  "2026-08-1": [
    [{"en":"cream","zh":"藥膏、乳霜"}],
    [{"en":"waves","zh":"海浪"}],
    [{"en":"caught","zh":"抓到（catch 的過去式）"}],
    [{"en":"waves","zh":"海浪"}],
    [{"en":"steeper","zh":"更陡的"}, {"en":"classmates","zh":"同班同學"}]
  ],
  "2026-08-2": [
    [],
    [],
    [{"en":"sugar","zh":"糖"}],
    [{"en":"leaking","zh":"漏水"}, {"en":"fixed","zh":"修好（fix 的過去式）"}],
    [{"en":"saltier","zh":"更鹹的"}, {"en":"expected","zh":"預期"}]
  ],
  "2026-08-3": [
    [],
    [{"en":"thought","zh":"心意；想法"}],
    [{"en":"front desk","zh":"服務台"}, {"en":"missing","zh":"不見的"}],
    [{"en":"machines","zh":"機器"}],
    []
  ],
  "2026-08-4": [
    [],
    [{"en":"honesty","zh":"誠實"}],
    [{"en":"expected","zh":"預期"}],
    [{"en":"guard","zh":"警衛"}, {"en":"floor","zh":"樓層"}],
    [{"en":"fewer","zh":"比較少的"}, {"en":"healthier","zh":"比較健康的"}]
  ],
  "2026-08-5": [
    [{"en":"nervous","zh":"緊張的"}],
    [{"en":"oldest","zh":"最年長的"}],
    [{"en":"marked","zh":"標記"}, {"en":"hangs","zh":"掛著"}],
    [{"en":"band","zh":"樂團"}, {"en":"talent","zh":"天分"}],
    [{"en":"voted","zh":"投票"}, {"en":"winner","zh":"獲勝者"}]
  ]
};
function weekDrillFor(monthStr, weekN) { return WEEK_DRILLS[monthStr + "-" + weekN] || null; }
function passageGlossary(wid, idx) { return (PASSAGE_GLOSSARY[wid] && PASSAGE_GLOSSARY[wid][idx]) || []; }
if (typeof module !== "undefined" && module.exports) module.exports = { WEEK_DRILLS, weekDrillFor, PASSAGE_GLOSSARY, passageGlossary };
