(function (root, factory) {
  const data = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = data;
  if (root) root.GRADE6_ADAPTIVE_DIAGNOSTIC = data;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sections = [
    { id: "gate-listening", stage: "gate", domain: "listening", title: "基礎閘門｜聽力", shortTitle: "基礎聽力", description: "每題播放不超過兩次。" },
    { id: "gate-recognition", stage: "gate", domain: "recognition", title: "基礎閘門｜常用字辨識", shortTitle: "常用字", description: "判斷生活常用字在句子裡的意思。" },
    { id: "gate-grammar", stage: "gate", domain: "grammar", title: "基礎閘門｜短句文法", shortTitle: "短句", description: "從最基本的 be、一般動詞與簡單時態開始。" },
    { id: "gate-reading", stage: "gate", domain: "reading", title: "基礎閘門｜短文閱讀", shortTitle: "短文", description: "閱讀一則短訊息並找出明確資訊。" },

    { id: "low-listening", stage: "low", domain: "listening", title: "基礎分流｜句子聽力", shortTitle: "加測聽力", description: "確認能否掌握位置、原因、過去事件與順序。" },
    { id: "low-recall", stage: "low", domain: "recall", title: "基礎分流｜主動回想", shortTitle: "主動回想", description: "沒有英文選項，依句意輸入最常用的英文單字。" },
    { id: "low-grammar", stage: "low", domain: "grammar", title: "基礎分流｜句型應用", shortTitle: "句型加測", description: "測第三人稱、過去式、所有格與因果連接。" },
    { id: "low-reading", stage: "low", domain: "reading", title: "基礎分流｜生活短文", shortTitle: "閱讀加測", description: "閱讀一篇日常短文，理解順序與原因。" },

    { id: "high-listening", stage: "high", domain: "listening", title: "進階分流｜情境聽力", shortTitle: "進階聽力", description: "測進行式、完成式、條件與被動句理解。" },
    { id: "high-vocabulary", stage: "high", domain: "vocabulary", title: "進階分流｜字彙運用", shortTitle: "進階字彙", description: "混合辨識與無選項回想。" },
    { id: "high-grammar", stage: "high", domain: "grammar", title: "進階分流｜文法應用", shortTitle: "進階文法", description: "測完成式、比較、條件、關係子句與被動。" },
    { id: "high-reading", stage: "high", domain: "reading", title: "進階分流｜資訊閱讀", shortTitle: "資訊閱讀", description: "讀懂資料、理由與結論。" },

    { id: "performance", stage: "performance", domain: "performance", title: "表達任務｜寫作與口說", shortTitle: "表達", description: "系統會依分流提供合適長度的任務。" },
  ];

  const passages = [
    {
      id: "gate-note",
      stage: "gate",
      title: "A Note from Lucy",
      text:
        "Hi Sam, I am at Grandma’s house. We are making lunch now. Please bring my red bag. It is on the chair in my room. We will meet you at the park at two o’clock. Don’t forget your hat because it is sunny today. — Lucy",
    },
    {
      id: "low-school-day",
      stage: "low",
      title: "Tom’s School Day",
      text:
        "Tom gets up at seven every school day. He eats breakfast and walks to school with his sister. On Tuesday, it rained, so their father drove them. Tom had English in the morning and art after lunch. He forgot his ruler, but his friend Amy shared hers. After school, Tom thanked Amy and went home.",
    },
    {
      id: "high-garden-report",
      stage: "high",
      title: "The School Garden Plan",
      text:
        "Class 6 wants to improve the empty garden behind the library. The students surveyed 50 classmates. Thirty-two students wanted vegetables, twelve preferred flowers, and six suggested a quiet reading area. Vegetables received the most votes, but they also need regular watering. The class therefore plans to grow vegetables in two small beds and place one bench beside them. A volunteer will teach the students how to save rainwater. After six weeks, the class will compare plant growth and water use before deciding whether to expand the garden.",
    },
  ];

  const questions = [
    {
      id: "GL1", section: "gate-listening", stage: "gate", domain: "listening", tier: "F0",
      type: "mc", audio: "gl1",
      spoken: "Touch the red book, then put it on the chair.",
      prompt: "Where should the red book go?",
      choices: ["On the chair.", "Under the table.", "In the bag.", "Beside the door."],
      answer: "On the chair.", word: "chair",
    },
    {
      id: "GL2", section: "gate-listening", stage: "gate", domain: "listening", tier: "F0",
      type: "mc", audio: "gl2",
      spoken: "Amy has a small dog. It sleeps under her desk.",
      prompt: "Where does Amy’s dog sleep?",
      choices: ["Under her desk.", "On her bed.", "Behind the door.", "In the garden."],
      answer: "Under her desk.", word: "under",
    },
    {
      id: "GL3", section: "gate-listening", stage: "gate", domain: "listening", tier: "F1",
      type: "mc", audio: "gl3",
      spoken: "Ben usually gets up at seven, but today he got up at eight.",
      prompt: "What time did Ben get up today?",
      choices: ["At eight.", "At seven.", "At six.", "At nine."],
      answer: "At eight.", word: "usually",
    },
    {
      id: "GL4", section: "gate-listening", stage: "gate", domain: "listening", tier: "F2",
      type: "mc", audio: "gl4",
      spoken: "Sara wanted juice, but the bottle was empty, so she drank water.",
      prompt: "What did Sara drink?",
      choices: ["Water.", "Juice.", "Milk.", "Tea."],
      answer: "Water.", word: "empty",
    },

    {
      id: "GR1", section: "gate-recognition", stage: "gate", domain: "recognition", tier: "F0",
      type: "mc", prompt: "I am hungry. I want some food. What does “hungry” mean?",
      choices: ["肚子餓", "口渴", "疲倦", "生氣"], answer: "肚子餓", word: "hungry",
    },
    {
      id: "GR2", section: "gate-recognition", stage: "gate", domain: "recognition", tier: "F0",
      type: "mc", prompt: "Today is Monday. Tomorrow is ____.",
      choices: ["Tuesday", "Sunday", "Friday", "Saturday"], answer: "Tuesday", word: "tomorrow",
    },
    {
      id: "GR3", section: "gate-recognition", stage: "gate", domain: "recognition", tier: "F1",
      type: "mc", prompt: "May I borrow your pencil?",
      choices: ["借用", "購買", "丟掉", "削尖"], answer: "借用", word: "borrow",
    },
    {
      id: "GR4", section: "gate-recognition", stage: "gate", domain: "recognition", tier: "F1",
      type: "mc", prompt: "The ball is between the two boxes.",
      choices: ["在兩個盒子中間", "在盒子裡面", "在盒子上面", "離盒子很遠"], answer: "在兩個盒子中間", word: "between",
    },
    {
      id: "GR5", section: "gate-recognition", stage: "gate", domain: "recognition", tier: "F1",
      type: "mc", prompt: "Be careful with the hot soup.",
      choices: ["小心", "快速", "安靜", "友善"], answer: "小心", word: "careful",
    },
    {
      id: "GR6", section: "gate-recognition", stage: "gate", domain: "recognition", tier: "F2",
      type: "mc", prompt: "I stayed home because I was sick. “Because” gives a ____.",
      choices: ["reason", "place", "person", "number"], answer: "reason", word: "because",
    },
    {
      id: "GR7", section: "gate-recognition", stage: "gate", domain: "recognition", tier: "F2",
      type: "mc", prompt: "Mia usually walks to school. This means she walks to school ____.",
      choices: ["most days", "right now only", "never", "once a year"], answer: "most days", word: "usually",
    },
    {
      id: "GR8", section: "gate-recognition", stage: "gate", domain: "recognition", tier: "F3",
      type: "mc", prompt: "The two pictures are different. They are ____.",
      choices: ["not the same", "both empty", "very expensive", "easy to carry"], answer: "not the same", word: "different",
    },

    {
      id: "GG1", section: "gate-grammar", stage: "gate", domain: "grammar", tier: "F0",
      type: "mc", prompt: "I ___ a student.", choices: ["am", "is", "are", "be"], answer: "am", grammar: "be",
    },
    {
      id: "GG2", section: "gate-grammar", stage: "gate", domain: "grammar", tier: "F0",
      type: "mc", prompt: "She ___ two brothers.", choices: ["has", "have", "is", "do"], answer: "has", grammar: "have-has",
    },
    {
      id: "GG3", section: "gate-grammar", stage: "gate", domain: "grammar", tier: "F1",
      type: "mc", prompt: "They ___ soccer every Sunday.", choices: ["play", "plays", "playing", "played"], answer: "play", grammar: "present-simple",
    },
    {
      id: "GG4", section: "gate-grammar", stage: "gate", domain: "grammar", tier: "F1",
      type: "mc", prompt: "___ you like milk?", choices: ["Do", "Does", "Are", "Is"], answer: "Do", grammar: "present-question",
    },
    {
      id: "GG5", section: "gate-grammar", stage: "gate", domain: "grammar", tier: "F1",
      type: "mc", prompt: "There ___ a cat under the chair.", choices: ["is", "are", "have", "am"], answer: "is", grammar: "there-is",
    },
    {
      id: "GG6", section: "gate-grammar", stage: "gate", domain: "grammar", tier: "F2",
      type: "mc", prompt: "Listen! The baby ___.", choices: ["is crying", "cry", "cried", "cries yesterday"], answer: "is crying", grammar: "present-progressive",
    },
    {
      id: "GG7", section: "gate-grammar", stage: "gate", domain: "grammar", tier: "F2",
      type: "mc", prompt: "Yesterday, I ___ at home.", choices: ["was", "am", "were", "be"], answer: "was", grammar: "past-be",
    },
    {
      id: "GG8", section: "gate-grammar", stage: "gate", domain: "grammar", tier: "F3",
      type: "mc", prompt: "My brother can ___ very fast.", choices: ["swim", "swims", "swimming", "swam"], answer: "swim", grammar: "modal-base",
    },

    {
      id: "GQ1", section: "gate-reading", stage: "gate", domain: "reading", tier: "F0",
      passageId: "gate-note", type: "mc", prompt: "Where is Lucy now?",
      choices: ["At Grandma’s house.", "At school.", "At the park.", "At Sam’s house."], answer: "At Grandma’s house.",
    },
    {
      id: "GQ2", section: "gate-reading", stage: "gate", domain: "reading", tier: "F1",
      passageId: "gate-note", type: "mc", prompt: "What should Sam bring?",
      choices: ["Lucy’s red bag.", "A blue book.", "Grandma’s lunch.", "A new chair."], answer: "Lucy’s red bag.",
    },
    {
      id: "GQ3", section: "gate-reading", stage: "gate", domain: "reading", tier: "F2",
      passageId: "gate-note", type: "mc", prompt: "Where is the bag?",
      choices: ["On the chair.", "Under the bed.", "In the park.", "Beside Grandma."], answer: "On the chair.",
    },
    {
      id: "GQ4", section: "gate-reading", stage: "gate", domain: "reading", tier: "F3",
      passageId: "gate-note", type: "mc", prompt: "Why should Sam bring a hat?",
      choices: ["Because it is sunny.", "Because it is raining.", "Because lunch is ready.", "Because the bag is heavy."], answer: "Because it is sunny.",
    },

    {
      id: "LL1", section: "low-listening", stage: "low", domain: "listening", tier: "F0",
      type: "mc", audio: "ll1",
      spoken: "The pencils are in the box beside the window.",
      prompt: "Where are the pencils?",
      choices: ["In the box.", "On the window.", "Under the desk.", "In the bag."], answer: "In the box.", word: "beside",
    },
    {
      id: "LL2", section: "low-listening", stage: "low", domain: "listening", tier: "F1",
      type: "mc", audio: "ll2",
      spoken: "Kevin is wearing a coat because it is cold.",
      prompt: "Why is Kevin wearing a coat?",
      choices: ["Because it is cold.", "Because it is sunny.", "Because he is swimming.", "Because the coat is wet."], answer: "Because it is cold.",
    },
    {
      id: "LL3", section: "low-listening", stage: "low", domain: "listening", tier: "F2",
      type: "mc", audio: "ll3",
      spoken: "Mia went to the market and bought three oranges.",
      prompt: "What did Mia buy?",
      choices: ["Three oranges.", "Two apples.", "A blue bag.", "Some bread."], answer: "Three oranges.",
    },
    {
      id: "LL4", section: "low-listening", stage: "low", domain: "listening", tier: "F3",
      type: "mc", audio: "ll4",
      spoken: "After dinner, wash the dishes before you watch television.",
      prompt: "What should you do first?",
      choices: ["Wash the dishes.", "Watch television.", "Make breakfast.", "Go shopping."], answer: "Wash the dishes.",
    },

    {
      id: "LR1", section: "low-recall", stage: "low", domain: "recall", tier: "F0",
      type: "input", prompt: "I feel ___ today.（快樂的）", answer: "happy", accepted: ["happy"], word: "happy",
    },
    {
      id: "LR2", section: "low-recall", stage: "low", domain: "recall", tier: "F1",
      type: "input", prompt: "My best ___ sits next to me.（朋友）", answer: "friend", accepted: ["friend"], word: "friend",
    },
    {
      id: "LR3", section: "low-recall", stage: "low", domain: "recall", tier: "F2",
      type: "input", prompt: "We go to ___ from Monday to Friday.（學校）", answer: "school", accepted: ["school"], word: "school",
    },
    {
      id: "LR4", section: "low-recall", stage: "low", domain: "recall", tier: "F3",
      type: "input", prompt: "I finished my homework ___.（昨天）", answer: "yesterday", accepted: ["yesterday"], word: "yesterday",
    },

    {
      id: "LG1", section: "low-grammar", stage: "low", domain: "grammar", tier: "F1",
      type: "mc", prompt: "My sister ___ television every evening.", choices: ["watches", "watch", "watched yesterday", "is watch"], answer: "watches", grammar: "third-person-s",
    },
    {
      id: "LG2", section: "low-grammar", stage: "low", domain: "grammar", tier: "F2",
      type: "mc", prompt: "We ___ to the zoo last Sunday.", choices: ["went", "go", "goes", "going"], answer: "went", grammar: "past-irregular",
    },
    {
      id: "LG3", section: "low-grammar", stage: "low", domain: "grammar", tier: "F2",
      type: "mc", prompt: "This is Anna. ___ bag is blue.", choices: ["Her", "She", "Hers is", "His"], answer: "Her", grammar: "possessive-adjective",
    },
    {
      id: "LG4", section: "low-grammar", stage: "low", domain: "grammar", tier: "F3",
      type: "mc", prompt: "I was tired, ___ I went to bed early.", choices: ["so", "but", "or", "if"], answer: "so", grammar: "cause-result",
    },

    {
      id: "LQ1", section: "low-reading", stage: "low", domain: "reading", tier: "F0",
      passageId: "low-school-day", type: "mc", prompt: "How does Tom usually go to school?",
      choices: ["He walks.", "He takes a bus.", "He rides a bike.", "His father drives him."], answer: "He walks.",
    },
    {
      id: "LQ2", section: "low-reading", stage: "low", domain: "reading", tier: "F1",
      passageId: "low-school-day", type: "mc", prompt: "Why did Tom’s father drive on Tuesday?",
      choices: ["Because it rained.", "Because Tom was late.", "Because school was far away.", "Because Amy called."], answer: "Because it rained.",
    },
    {
      id: "LQ3", section: "low-reading", stage: "low", domain: "reading", tier: "F2",
      passageId: "low-school-day", type: "mc", prompt: "What lesson did Tom have after lunch?",
      choices: ["Art.", "English.", "Math.", "Music."], answer: "Art.",
    },
    {
      id: "LQ4", section: "low-reading", stage: "low", domain: "reading", tier: "F3",
      passageId: "low-school-day", type: "mc", prompt: "What did Amy do?",
      choices: ["She shared her ruler.", "She drove Tom home.", "She made Tom’s lunch.", "She found his coat."], answer: "She shared her ruler.",
    },

    {
      id: "HL1", section: "high-listening", stage: "high", domain: "listening", tier: "F4",
      type: "mc", audio: "hl1",
      spoken: "Eva has already finished the map, but she has not written the directions yet.",
      prompt: "What has Eva not finished?",
      choices: ["The directions.", "The map.", "The drawing.", "The survey."], answer: "The directions.", word: "yet",
    },
    {
      id: "HL2", section: "high-listening", stage: "high", domain: "listening", tier: "F5",
      type: "mc", audio: "hl2",
      spoken: "While Daniel was taking photos, his partner interviewed the shop owner.",
      prompt: "What did Daniel’s partner do?",
      choices: ["Interviewed the shop owner.", "Took photos.", "Opened a new shop.", "Drew a map."], answer: "Interviewed the shop owner.",
    },
    {
      id: "HL3", section: "high-listening", stage: "high", domain: "listening", tier: "F6",
      type: "mc", audio: "hl3",
      spoken: "If the team collects enough evidence, they will present their conclusion on Friday.",
      prompt: "What must the team collect?",
      choices: ["Enough evidence.", "A new machine.", "More money.", "Friday’s homework."], answer: "Enough evidence.", word: "evidence",
    },
    {
      id: "HL4", section: "high-listening", stage: "high", domain: "listening", tier: "F7",
      type: "mc", audio: "hl4",
      spoken: "The new bridge was designed to make the route safer for people who walk or cycle.",
      prompt: "Why was the bridge designed?",
      choices: ["To make the route safer.", "To close the road.", "To increase traffic.", "To replace the park."], answer: "To make the route safer.", word: "designed",
    },

    {
      id: "HV1", section: "high-vocabulary", stage: "high", domain: "recognition", tier: "F4",
      type: "mc", prompt: "The photo is evidence that the animal was here. “Evidence” means ____.",
      choices: ["證據", "設備", "危險", "選擇"], answer: "證據", word: "evidence",
    },
    {
      id: "HV2", section: "high-vocabulary", stage: "high", domain: "recognition", tier: "F5",
      type: "mc", prompt: "A reliable website usually gives information we can ____.",
      choices: ["trust", "hide", "break", "forget"], answer: "trust", word: "reliable",
    },
    {
      id: "HV3", section: "high-vocabulary", stage: "high", domain: "recall", tier: "F6",
      type: "input", prompt: "Practice can help you ___ your writing.（改善）", answer: "improve", accepted: ["improve"], word: "improve",
    },
    {
      id: "HV4", section: "high-vocabulary", stage: "high", domain: "recall", tier: "F7",
      type: "input", prompt: "At the end of the report, write a short ___.（結論）", answer: "conclusion", accepted: ["conclusion"], word: "conclusion",
    },

    {
      id: "HG1", section: "high-grammar", stage: "high", domain: "grammar", tier: "F4",
      type: "mc", prompt: "I have lived here ___ 2022.", choices: ["since", "for", "ago", "during"], answer: "since", grammar: "present-perfect",
    },
    {
      id: "HG2", section: "high-grammar", stage: "high", domain: "grammar", tier: "F4",
      type: "mc", prompt: "This route is ___ than the other one.", choices: ["shorter", "shortest", "more short", "the short"], answer: "shorter", grammar: "comparative",
    },
    {
      id: "HG3", section: "high-grammar", stage: "high", domain: "grammar", tier: "F5",
      type: "mc", prompt: "If it rains tomorrow, we ___ inside.", choices: ["will stay", "stayed", "have stayed", "staying"], answer: "will stay", grammar: "first-conditional",
    },
    {
      id: "HG4", section: "high-grammar", stage: "high", domain: "grammar", tier: "F5",
      type: "mc", prompt: "The girl ___ won the contest is my cousin.", choices: ["who", "which", "where", "whose"], answer: "who", grammar: "relative-clause",
    },
    {
      id: "HG5", section: "high-grammar", stage: "high", domain: "grammar", tier: "F6",
      type: "mc", prompt: "The machine ___ by our team last week.", choices: ["was tested", "tested", "is testing", "has test"], answer: "was tested", grammar: "passive",
    },
    {
      id: "HG6", section: "high-grammar", stage: "high", domain: "grammar", tier: "F7",
      type: "mc", prompt: "___ the first plan is cheaper, the second plan is safer.", choices: ["Although", "Because", "If", "Until"], answer: "Although", grammar: "subordination",
    },

    {
      id: "HQ1", section: "high-reading", stage: "high", domain: "reading", tier: "F4",
      passageId: "high-garden-report", type: "mc", prompt: "How many students preferred flowers?",
      choices: ["12", "32", "6", "50"], answer: "12",
    },
    {
      id: "HQ2", section: "high-reading", stage: "high", domain: "reading", tier: "F5",
      passageId: "high-garden-report", type: "mc", prompt: "Why did the class not fill the whole garden with vegetables?",
      choices: ["Vegetables need regular watering.", "Nobody voted for vegetables.", "The library needs more space.", "The volunteer refused to help."], answer: "Vegetables need regular watering.",
    },
    {
      id: "HQ3", section: "high-reading", stage: "high", domain: "reading", tier: "F6",
      passageId: "high-garden-report", type: "mc", prompt: "What will the volunteer teach?",
      choices: ["How to save rainwater.", "How to build a library.", "How to conduct a survey.", "How to buy vegetables."], answer: "How to save rainwater.",
    },
    {
      id: "HQ4", section: "high-reading", stage: "high", domain: "reading", tier: "F7",
      passageId: "high-garden-report", type: "mc", prompt: "What will help the class decide whether to expand the garden?",
      choices: ["A comparison of plant growth and water use.", "The number of books in the library.", "The price of one bench.", "A second vote about flowers only."], answer: "A comparison of plant growth and water use.",
    },
  ];

  const performance = {
    low: {
      writing: {
        title: "基礎寫作｜3–5 句",
        prompt:
          "Write 3–5 English sentences about your school day. You may use: I get up at ___. I go to school by ___. My favorite class is ___. After school, I ___.",
      },
      speaking: {
        title: "基礎口說｜約30秒",
        prompt:
          "Talk about yourself in English for about 30 seconds: your name, your school day, one thing you like, and one thing you can do.",
      },
    },
    high: {
      writing: {
        title: "進階寫作｜6–10 句",
        prompt:
          "Yesterday your team found a strange box in the library. Write 6–10 English sentences. Explain who was there, what happened, what you did, and how the story ended.",
      },
      speaking: {
        title: "進階口說｜約60秒",
        prompt:
          "Choose one: explain how to get from home to school, or explain how you solve a simple problem. Give steps and at least one reason.",
      },
    },
    rubric: [
      { score: 0, label: "0｜未作答", description: "沒有英文產出。" },
      { score: 1, label: "1｜零散單字", description: "主要是單字或不完整片段，需要持續提示。" },
      { score: 2, label: "2｜簡單句", description: "能產出幾個可理解的簡單句，但連接與文法仍不穩。" },
      { score: 3, label: "3｜連接表達", description: "能依任務長度完成，會用 and、but、because、then 等連接。" },
      { score: 4, label: "4｜清楚完整", description: "內容有順序與細節，錯誤不妨礙理解。" },
    ],
  };

  const bands = [
    { id: "F0", label: "F0｜英語起點", route: "low", minPercent: 0, courseMode: "C0", courseLabel: "C0 起點鞏固", active: 4, receptive: 2, advice: "從圖像、聽辨與最短完整句開始；一次只要求一個主要意思。" },
    { id: "F1", label: "F1｜A1 起步", route: "low", minPercent: 30, courseMode: "C1", courseLabel: "C1 基礎鞏固", active: 5, receptive: 3, advice: "重建 be、代名詞與生活高頻字，增加短句口頭提取。" },
    { id: "F2", label: "F2｜A1 發展", route: "low", minPercent: 48, courseMode: "C2", courseLabel: "C2 句型鞏固", active: 6, receptive: 3, advice: "用固定句框建立一般動詞、問句與簡單過去式。" },
    { id: "F3", label: "F3｜A1 穩定", route: "low", minPercent: 65, courseMode: "B0", courseLabel: "B0 橋接準備", active: 8, receptive: 4, advice: "保留基礎複習，開始練句子連接與主動字彙。" },
    { id: "F4", label: "F4｜A1+／A2 起步", route: "high", minPercent: 0, courseMode: "B", courseLabel: "B 標準模式", active: 10, receptive: 5, advice: "從第1堂標準進度開始，優先把認識字轉成主動字。" },
    { id: "F5", label: "F5｜A2 基礎", route: "high", minPercent: 65, courseMode: "B", courseLabel: "B 標準模式", active: 10, receptive: 5, advice: "加入過去事件敘述、比較與短文重述。" },
    { id: "F6", label: "F6｜A2+ 橋接", route: "high", minPercent: 77, courseMode: "A", courseLabel: "A 加速模式", active: 12, receptive: 6, advice: "增加Bridge字、資訊閱讀與段落輸出。" },
    { id: "F7", label: "F7｜B1- 準備", route: "high", minPercent: 89, courseMode: "A", courseLabel: "A 加速模式", active: 12, receptive: 6, advice: "保留查漏，優先加入說明、研究、論證與修訂任務。" },
  ];

  return {
    id: "grade6-adaptive-foundation-diagnostic",
    version: "2026.07.24.1",
    title: "六年級英語適性起點診斷",
    gateRule: {
      minimumPercentForHigh: 75,
      minimumGrammarPercentForHigh: 63,
      minimumReadingPercentForHigh: 50,
    },
    sections,
    passages,
    questions,
    performance,
    bands,
  };
});
