// Lv.4 / Lv.5 / Lv.6 課程產生器（文法起點，沿用 grammar_core u1-u12+r1-r4 概念，不重寫該系統本身）。
// 用法：node render_lv46.js
// 產生 k9/lv4、k9/lv5、k9/lv6 的 8 週頁面與各自的音訊清單。
const fs = require("fs");
const path = require("path");
const { WORD_LEVELS } = require(path.join(__dirname, "..", "..", "kids", "wordlevels.js"));
const { WORDBANK } = require(path.join(__dirname, "..", "..", "kids", "wordbank.js"));

const ROOT = path.join(__dirname, "..");

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""); }
function audioName(level, week, kind, value) { return `${level}w${week}_${kind}${value == null ? "" : `_${value}`}`; }

const LEVELS = [
  {
    id: 4, title: "句子如何運作", zh: "國小四年級 · 文法起點", icon: "🏗️",
    intro: "從這一級開始正式教文法，沿用 grammar_core 的 u1～u4＋r1：句子骨架、名詞與冠詞、代名詞、be動詞與一般動詞。",
    weeks: [
      { title: "Sentence Lab", zh: "造句實驗室", goal: "認識「主詞＋動詞」，重組並朗讀 8 個有意義句子。", pattern: ["The dog runs.", "Does the dog run?"],
        vocab: [["sentence","句子","📝"],["subject","主詞","🙋"],["verb","動詞","🏃"],["question","問句","❓"],["run","跑","🏃"],["jump","跳","⬆️"],["read","讀","📖"],["write","寫","✏️"]],
        grammar: { concept: "英文句子最少要有主詞和動詞：誰＋做什麼。中文可以只說「下雨了」，英文通常要講清楚是誰。句子還有四種口味：說事情、問問題、叫人做事、表示驚訝。",
          examples: [["I run.","我跑。"],["The dog is happy.","那隻狗很開心。"],["Are you ready?","你準備好了嗎？"],["Open the door.","把門打開。"]] },
        dialogue: [["Teacher","Look at these words: dog, the, runs. Can you make a sentence?","看看這些字：dog、the、runs。可以組成一個句子嗎？"],["Mia","The dog runs!","那隻狗在跑！"],["Teacher","Great! Now make it a question.","很好！現在把它變成問句。"],["Mia","Does the dog run?","那隻狗會跑嗎？"]],
        copywork: [["My brother reads every day.","我哥哥每天閱讀。"],["Does he read comic books?","他讀漫畫書嗎？"],["Sit down and listen, please.","請坐下並聆聽。"],["What a fast runner he is!","他真是個跑得快的人！"]] },
      { title: "Objects and Categories", zh: "物品與分類", goal: "分清楚 a/an/the 和單複數，製作迷你物品博物館標籤。", pattern: ["I have a box.", "The box is red."],
        vocab: [["box","箱子","📦"],["apple","蘋果","🍎"],["umbrella","雨傘","☂️"],["chair","椅子","🪑"],["toy","玩具","🧸"],["key","鑰匙","🔑"],["one","一個","1️⃣"],["many","很多","🔢"]],
        grammar: { concept: "第一次提到用 a/an（a 後面接子音開頭、an 接母音開頭），大家都知道是哪一個就用 the。一個東西後面加 s 變很多個。",
          examples: [["I see a cat.","我看到一隻貓。"],["I see an elephant.","我看到一隻大象。"],["The cat is sleeping.","那隻貓在睡覺。"],["I have two boxes.","我有兩個箱子。"]] },
        dialogue: [["Leo","This is a box. Look, it has an old key inside.","這是一個箱子。你看，裡面有一把舊鑰匙。"],["Mia","Wow! Is it the same key from yesterday?","哇！這是昨天那把鑰匙嗎？"],["Leo","Yes, it's the key. I have two more boxes at home.","對，就是那把鑰匙。我家裡還有兩個箱子。"],["Mia","Let's make labels for all the boxes!","我們幫所有箱子做標籤吧！"]],
        copywork: [["I have a red box.","我有一個紅色箱子。"],["It has an old toy inside.","裡面有一個舊玩具。"],["The toy is my favorite one.","這個玩具是我最喜歡的。"],["I keep many toys in boxes.","我把很多玩具放在箱子裡。"]] },
      { title: "People Around Me", zh: "我身邊的人", goal: "會用 I/me/my/mine 等代名詞修訂人物介紹。", pattern: ["He is my friend.", "That bag is mine."],
        vocab: [["he","他","👦"],["she","她","👧"],["his","他的","🙋"],["her","她的","🙋"],["mine","我的（東西）","✋"],["yours","你的（東西）","🫵"],["family","家人","👨‍👩‍👧‍👦"],["friend","朋友","🧑‍🤝‍🧑"]],
        grammar: { concept: "代名詞會換裝：I/he/she 站在動作前面；me/him/her 站在動作後面；my/his/her 加名詞；mine/his/hers 自己站，後面不加名詞。",
          examples: [["I like her.","我喜歡她。"],["She likes me.","她喜歡我。"],["This is my bag.","這是我的書包。"],["That bag is mine.","那個書包是我的。"]] },
        dialogue: [["Amy","Who is he?","他是誰？"],["Tom","He is my brother. His name is Sam.","他是我哥哥。他叫 Sam。"],["Amy","Is this book his?","這本書是他的嗎？"],["Tom","Yes, it's his. But this pen is mine.","對，是他的。但這支筆是我的。"]],
        copywork: [["This is my friend Ben.","這是我的朋友 Ben。"],["He is funny and kind.","他很風趣又善良。"],["Her name is Grace.","她的名字是 Grace。"],["These pencils are hers, not mine.","這些鉛筆是她的，不是我的。"]] },
      { title: "States and Actions", zh: "狀態與動作", goal: "分辨 be 動詞和一般動詞，依意思選對的動詞引擎。", pattern: ["I am happy.", "I play soccer."],
        vocab: [["is","是","🟰"],["are","是","🟰"],["am","是","🟰"],["happy","開心的","😊"],["tired","累的","😴"],["play","玩；打（球）","⚽"],["eat","吃","🍽️"],["sleep","睡覺","😴"]],
        grammar: { concept: "be 動詞（am/is/are）接狀態或名稱；一般動詞（play, eat…）接動作。一個句子只選一種引擎，不要兩個一起用。",
          examples: [["I am tired.","我累了。"],["I play soccer.","我踢足球。"],["She is a student.","她是學生。"],["She studies English.","她學英文。"]] },
        dialogue: [["Nora","Are you tired?","你累了嗎？"],["Ben","Yes, I am tired. But I still play basketball.","對，我累了。但我還是要打籃球。"],["Nora","I am hungry. I eat lunch now.","我餓了。我現在要吃午餐。"],["Ben","Good idea! I eat lunch, too.","好主意！我也要吃午餐。"]],
        copywork: [["My dog is small.","我的狗很小。"],["It runs and jumps a lot.","牠常常跑跑跳跳。"],["I am happy today.","我今天很開心。"],["I play with my dog every day.","我每天都和我的狗玩。"]] },
      { title: "Sentence Factory", zh: "造句工廠複習", goal: "從詞卡產生陳述、疑問、命令句（u1～u4 複習）。", pattern: ["Statement: He is happy.", "Question: Is he happy?"],
        vocab: [["sentence","句子","📝","W1"],["box","箱子","📦","W2"],["he","他","👦","W3"],["happy","開心的","😊","W4"],["run","跑","🏃","W1"],["the","那個","👉","W2"],["mine","我的（東西）","✋","W3"],["play","玩","⚽","W4"]],
        grammar: { concept: "同一組字，換句型就變不同功能：說一件事、問問題、叫人做事、表示驚訝。文法規則要拿來用，不是拿來背。",
          examples: [["He runs fast.","他跑得很快。"],["Does he run fast?","他跑得快嗎？"],["Run fast!","跑快一點！"],["How fast he runs!","他跑得好快！"]] },
        dialogue: [["Teacher","Here are three word cards: he, is, happy. Make a sentence.","這裡有三張字卡：he、is、happy。組一個句子。"],["Kids","He is happy.","他很開心。"],["Teacher","Now make it a question.","現在把它變成問句。"],["Kids","Is he happy?","他開心嗎？"]],
        copywork: [["The box is heavy.","這個箱子很重。"],["Is the box heavy?","這個箱子重嗎？"],["Please open the box.","請打開箱子。"],["What a big box!","好大的箱子！"]] },
      { title: "My Room, My Rules", zh: "我的房間我的規矩", goal: "整合 u1～u4，做房間圖文＋三條家庭規則。", pattern: ["My bed is next to the lamp.", "You must be quiet."],
        vocab: [["room","房間","🚪"],["bed","床","🛏️"],["lamp","燈","💡"],["clean","乾淨的；打掃","🧹"],["must","必須","❗"],["share","分享","🎁"],["quiet","安靜的","🤫"],["rule","規則","📋"]],
        grammar: { concept: "把前面四課合起來用：找到主詞和動詞、名詞加不加 a/an/the、代名詞換對衣服、be 動詞或一般動詞只選一個。",
          examples: [["This is my room.","這是我的房間。"],["It has a big bed and a small lamp.","裡面有一張大床和一盞小燈。"],["I keep it clean.","我保持它乾淨。"],["You must be quiet here.","你在這裡必須安靜。"]] },
        dialogue: [["Mom","Is your room clean?","你的房間乾淨嗎？"],["Amy","Yes, it is clean. My bed and my lamp are tidy.","是的，很乾淨。我的床和燈都整整齊齊。"],["Mom","Good. Please share your toys with your sister.","很好。請和妹妹分享妳的玩具。"],["Amy","OK. Rule one: be quiet after nine.","好。第一條規則：九點後要安靜。"]],
        copywork: [["My room has a bed, a lamp, and a small desk.","我的房間有一張床、一盞燈和一張小書桌。"],["I clean it every weekend.","我每個週末都會打掃它。"],["My rule is simple: keep it tidy.","我的規則很簡單：保持整齊。"],["My sister must knock before she comes in.","我妹妹進來前必須敲門。"]] },
      { title: "Mini Interview", zh: "小小訪談", goal: "用熟悉語塊整合問答，訪談同伴並轉述 5 項資訊。", pattern: ["What is your favorite sport?", "Can you swim?"],
        vocab: [["favorite","最喜歡的","⭐"],["interest","興趣","💡"],["can","會；能","✅"],["like","喜歡","😋"],["question","問題","❓"],["answer","回答","💬"],["hobby","興趣","🎨"],["sport","運動","⚽"]],
        grammar: { concept: "訪談需要問句：What is…? Do you…? Can you…? 回答時把問句裡的字換成自己的答案就好。",
          examples: [["What is your favorite color?","你最喜歡的顏色是什麼？"],["My favorite color is blue.","我最喜歡的顏色是藍色。"],["Can you play the piano?","你會彈鋼琴嗎？"],["Yes, I can. I practice every day.","會，我每天練習。"]] },
        dialogue: [["Leo","What is your favorite sport?","你最喜歡的運動是什麼？"],["Mia","My favorite sport is swimming. Can you swim?","我最喜歡的運動是游泳。你會游泳嗎？"],["Leo","Yes, I can! What is your hobby?","會！你的興趣是什麼？"],["Mia","My hobby is drawing.","我的興趣是畫畫。"]],
        copywork: [["I interviewed my friend Leo today.","我今天訪問了我的朋友 Leo。"],["His favorite sport is swimming.","他最喜歡的運動是游泳。"],["He can swim very fast.","他游泳游得很快。"],["His hobby is playing basketball.","他的興趣是打籃球。"]] },
      { title: "My World Page", zh: "我的世界頁面", goal: "作品修訂：檢查句子完整、名詞、代名詞、動詞，完成圖文頁與口頭導覽。", pattern: ["This page is about me.", "Let me check my sentences."],
        vocab: [["world","世界","🌍","W1-7"],["page","頁面","📄","W1-7"],["about","關於","💬","W1-7"],["complete","完整的","✅","W1-7"],["check","檢查","🔍","W1-7"],["fix","修正","🔧","W1-7"],["own","自己的","🙋","W1-7"],["ready","準備好的","👍","W1-7"]],
        grammar: { concept: "寫完先自己檢查：有沒有主詞和動詞？名詞前面要不要 a/an/the？代名詞用對了嗎？be 動詞和一般動詞有沒有混在一起？",
          examples: [["This is my world page.","這是我的世界頁面。"],["It is about my family and my room.","它是關於我的家人和我的房間。"],["I check every sentence.","我檢查每一個句子。"],["I fix the mistakes I find.","我修正我找到的錯誤。"]] },
        dialogue: [["Teacher","Is your world page complete?","你的世界頁面完成了嗎？"],["Tom","Almost. Let me check my sentences.","快好了。我來檢查一下句子。"],["Teacher","Good habit! Did you fix the mistake in sentence three?","好習慣！你修正第三句的錯誤了嗎？"],["Tom","Yes, I fixed it. Now it is my own page.","對，我修好了。現在這是我自己的頁面了。"]],
        copywork: [["My world page has four parts: family, room, friend, and hobby.","我的世界頁面有四個部分：家人、房間、朋友和興趣。"],["Each sentence has a subject and a verb.","每個句子都有主詞和動詞。"],["I checked my nouns and pronouns.","我檢查了我的名詞和代名詞。"],["Now my page is ready to share.","現在我的頁面可以分享了。"]] },
    ]
  },
  {
    id: 5, title: "日常、此刻與細節", zh: "國小五年級", icon: "🔁",
    intro: "沿用 grammar_core u5、u6、u9、u10、r3：現在簡單式、現在進行式、描述詞與頻率副詞、介係詞。",
    weeks: [
      { title: "Habits and Facts", zh: "習慣與事實", goal: "用現在簡單式寫說自己的平日作息。", pattern: ["I brush my teeth every day.", "She wakes up at seven."],
        vocab: [["usually","通常","🔁"],["every day","每天","📅"],["brush","刷","🪥"],["wake up","起床","⏰"],["go to bed","上床睡覺","🛏️"],["homework","功課","📓"],["habit","習慣","🔁"],["fact","事實","💡"]],
        grammar: { concept: "現在簡單式講習慣和事實，不是現在正在做。主詞是 he/she/it 時，動詞要加 s。",
          examples: [["I go to school every day.","我每天去上學。"],["He goes to school every day.","他每天去上學。"],["Water boils at 100 degrees.","水在100度會沸騰。"],["She always does her homework first.","她總是先做功課。"]] },
        dialogue: [["Nora","What is your daily habit?","你每天的習慣是什麼？"],["Kai","I wake up at seven. Then I brush my teeth.","我七點起床。然後我刷牙。"],["Nora","Does your sister wake up early, too?","你妹妹也很早起床嗎？"],["Kai","Yes, she wakes up at seven, too.","對，她也是七點起床。"]],
        copywork: [["I wake up at seven every morning.","我每天早上七點起床。"],["I brush my teeth and eat breakfast.","我刷牙然後吃早餐。"],["My mom goes to work at eight.","我媽媽八點去上班。"],["We do our homework after dinner.","我們晚餐後做功課。"]] },
      { title: "People and Animals", zh: "人與動物", goal: "用三單 -s 完成動物事實卡 6 句。", pattern: ["A fish lives in water.", "It swims all day."],
        vocab: [["eat","吃","🍽️"],["sleep","睡覺","😴"],["live","居住","🏠"],["habitat","棲息地","🌳"],["insect","昆蟲","🐛"],["forest","森林","🌲"],["ocean","海洋","🌊"],["desert","沙漠","🏜️"]],
        grammar: { concept: "說動物或別人的事實習慣時，動詞要記得加 s：eats、lives、swims，這是三單 -s。",
          examples: [["A camel lives in the desert.","駱駝住在沙漠裡。"],["It drinks very little water.","牠喝很少的水。"],["Fish live in the ocean.","魚住在海洋裡。"],["A fish breathes through gills.","魚用鰓呼吸。"]] },
        dialogue: [["Amy","Where does a camel live?","駱駝住在哪裡？"],["Leo","It lives in the desert. It eats plants.","牠住在沙漠。牠吃植物。"],["Amy","Where do fish live?","魚住在哪裡？"],["Leo","They live in the ocean. A fish swims all day.","牠們住在海洋。魚整天游泳。"]],
        copywork: [["An owl lives in the forest.","貓頭鷹住在森林裡。"],["It sleeps in the day and hunts at night.","牠白天睡覺，晚上狩獵。"],["A bee lives near flowers.","蜜蜂住在花朵附近。"],["It flies from flower to flower.","牠從一朵花飛到另一朵花。"]] },
      { title: "Live Scene", zh: "現場直播", goal: "用現在進行式做 60 秒現場轉播。", pattern: ["The team is playing now.", "The crowd is cheering."],
        vocab: [["now","現在","⏱️"],["right now","現在此刻","⏱️"],["wear","穿；戴","👕"],["watch","看；觀賞","👀"],["cheer","歡呼","📣"],["score","得分","🥅"],["team","隊伍","👥"],["crowd","群眾","👨‍👩‍👧‍👦"]],
        grammar: { concept: "現在進行式講「現在正在做」：be + 動詞ing 是一組，不能拆開。",
          examples: [["I am watching the game.","我正在看比賽。"],["The players are running fast.","球員們正在快速地跑。"],["Someone is scoring a goal!","有人正在得分！"],["The crowd is cheering loudly.","觀眾正在大聲歡呼。"]] },
        dialogue: [["Reporter","What is happening right now?","現在正在發生什麼事？"],["Helper","The team is playing very well.","這隊正打得很好。"],["Reporter","Look! Someone is scoring!","你看！有人在得分！"],["Helper","The crowd is cheering loudly!","觀眾正在大聲歡呼！"]],
        copywork: [["It is game day at our school.","今天是我們學校的比賽日。"],["The players are wearing blue shirts.","球員們穿著藍色球衣。"],["Right now, they are running to the goal.","現在他們正在往球門跑。"],["Everyone is cheering for our team.","大家都在為我們的隊伍歡呼。"]] },
      { title: "Usually vs. Now", zh: "平常與現在", goal: "對照現在簡單式與現在進行式，比較「通常」與「今天」。", pattern: ["I usually walk to school.", "But today I am riding my bike."],
        vocab: [["usually","通常","🔁"],["right now","現在此刻","⏱️"],["today","今天","📅"],["different","不同的","🔀"],["same","一樣的","🟰"],["change","改變","♻️"],["weekday","平日","📆"],["weekend","週末","🌞"]],
        grammar: { concept: "usually、every day 配現在簡單式；right now、today 常常配現在進行式，兩種時態可以拿來對比著講。",
          examples: [["I usually eat rice for lunch.","我平常午餐吃飯。"],["But today I am eating noodles.","但今天我在吃麵。"],["He usually plays quietly.","他平常安靜地玩。"],["Right now, he is shouting!","現在他在大叫！"]] },
        dialogue: [["Mia","You usually walk to school. Why are you riding a bike today?","你通常走路上學。今天為什麼騎腳踏車？"],["Tom","My bike is new! I am trying it out right now.","我的腳踏車是新的！我現在正在試騎。"],["Mia","Do you usually ride on weekends?","你通常週末會騎車嗎？"],["Tom","Yes, but today is different.","對，但今天不一樣。"]],
        copywork: [["I usually watch TV after school.","我放學後通常看電視。"],["But right now, I am reading a book.","但現在我正在看書。"],["My brother usually sleeps early.","我弟弟通常很早睡。"],["Tonight, he is staying up late.","今晚他熬夜。"]] },
      { title: "Better Description", zh: "更好的描述", goal: "用形容詞、副詞和頻率副詞擴寫單薄句子並朗讀。", pattern: ["She runs quickly.", "He is always careful."],
        vocab: [["quickly","快速地","⚡"],["slowly","慢慢地","🐌"],["loudly","大聲地","📢"],["quietly","安靜地","🤫"],["always","總是","🔁"],["sometimes","有時候","🔀"],["never","從不","🚫"],["carefully","小心地","🧐"]],
        grammar: { concept: "形容詞說東西怎樣（貼名詞），副詞說動作怎樣（貼動詞），頻率副詞說多常發生（always > usually > sometimes > never）。",
          examples: [["She is a fast runner.","她是個跑得快的跑者。"],["She runs quickly.","她跑得很快。"],["He always checks his work carefully.","他總是仔細檢查他的作業。"],["I sometimes forget my umbrella.","我有時候會忘記帶傘。"]] },
        dialogue: [["Coach","How does Amy run?","Amy 跑步跑得怎麼樣？"],["Ben","She runs quickly and carefully.","她跑得又快又小心。"],["Coach","Does she always warm up first?","她總是先熱身嗎？"],["Ben","Yes, she always warms up before she runs.","對，她跑步前總是會先熱身。"]],
        copywork: [["My dog is small but strong.","我的狗很小但很強壯。"],["It runs quickly and barks loudly.","牠跑得很快，叫得很大聲。"],["It is always happy to see me.","牠看到我總是很開心。"],["I never forget to feed it.","我從不忘記餵牠。"]] },
      { title: "Time and Place", zh: "時間與地點", goal: "用 at/on/in 和空間介係詞規劃一天行程並說明集合資訊。", pattern: ["Let's meet at the station.", "It is on Monday, in the morning."],
        vocab: [["at","在（時刻／地點）","📍"],["on","在（日期／星期）","📅"],["in","在（月份／季節）","🗓️"],["next to","在……旁邊","↔️"],["behind","在……後面","⬅️"],["in front of","在……前面","➡️"],["meet","見面","🤝"],["station","車站","🚉"]],
        grammar: { concept: "時間金字塔：in（月/年/季節）大於 on（日期/星期）大於 at（幾點）。空間介係詞看實際位置關係，不是照中文直翻。",
          examples: [["I have class at nine o'clock.","我九點有課。"],["It is on Monday morning.","是在星期一早上。"],["It is in April.","是在四月。"],["The station is next to the library.","車站在圖書館旁邊。"]] },
        dialogue: [["Nora","When is the trip?","校外教學是什麼時候？"],["Kai","It is on Saturday, at nine in the morning.","是星期六，早上九點。"],["Nora","Where do we meet?","我們在哪裡集合？"],["Kai","At the station, next to the library.","在車站，圖書館旁邊。"]],
        copywork: [["Our trip is in June.","我們的校外教學在六月。"],["We meet at the station at nine.","我們九點在車站集合。"],["The bus is in front of the school gate.","公車在校門前面。"],["I sit next to my best friend.","我坐在我最好朋友的旁邊。"]] },
      { title: "A Day in Detail", zh: "詳細的一天", goal: "複習：把時態、描述詞、介係詞合起來，寫 8～10 句生活報告初稿。", pattern: ["In the morning, I usually...", "Right now, I am..."],
        vocab: [["morning","早上","🌅","W1-6"],["afternoon","下午","🌞","W1-6"],["evening","傍晚","🌆","W1-6"],["routine","例行公事","🔁","W1-6"],["detail","細節","🔎","W1-6"],["report","報告","📋","W1-6"],["describe","描述","💬","W1-6"],["schedule","行程表","🗓️","W1-6"]],
        grammar: { concept: "把時態、描述詞、介係詞合起來，講一天的完整內容：習慣用現在簡單式，此刻用現在進行式，再加描述詞和地點時間。",
          examples: [["In the morning, I usually eat breakfast at seven.","早上我通常七點吃早餐。"],["Right now, I am writing my daily report.","現在我正在寫我的每日報告。"],["I always walk to school carefully.","我總是小心地走路上學。"],["In the evening, I do my homework at my desk.","晚上我在書桌前做功課。"]] },
        dialogue: [["Teacher","Tell me about your day, in detail.","詳細告訴我你的一天。"],["Amy","In the morning, I usually eat breakfast at seven.","早上我通常七點吃早餐。"],["Teacher","What are you doing right now?","你現在正在做什麼？"],["Amy","Right now, I am telling you about my day!","我現在正在告訴你我的一天！"]],
        copywork: [["In the morning, I wake up at seven and eat breakfast quickly.","早上我七點起床，然後很快地吃早餐。"],["At school, I usually study carefully and play happily at recess.","在學校，我通常認真讀書，下課愉快地玩耍。"],["In the afternoon, I am often doing my homework at my desk.","下午我常常在書桌前做功課。"],["In the evening, I read a book and go to bed at nine.","晚上我看書，九點上床睡覺。"]] },
      { title: "Life Reporter", zh: "生活報導員", goal: "作品修訂（u5、u6、u9、u10），完成圖文生活報告＋90 秒發表。", pattern: ["Here is my life report.", "Let me present it clearly."],
        vocab: [["reporter","記者","🎤","W1-7"],["report","報告","📋","W1-7"],["present","發表","🗣️","W1-7"],["share","分享","🤝","W1-7"],["audience","觀眾","👥","W1-7"],["clear","清楚的","✨","W1-7"],["detail","細節","🔎","W1-7"],["finish","完成","✅","W1-7"]],
        grammar: { concept: "發表前檢查：習慣用現在簡單式、正在做的用現在進行式、描述詞和介係詞的位置對不對。",
          examples: [["This is my life report.","這是我的生活報告。"],["I usually finish my homework by eight.","我通常八點前做完功課。"],["Right now, I am presenting it to you.","現在我正在向你報告。"],["I always try to speak clearly.","我總是試著講清楚。"]] },
        dialogue: [["Host","Are you ready to present your life report?","你準備好發表你的生活報告了嗎？"],["Leo","Yes! Right now, I am sharing it with the class.","是的！我現在正在跟全班分享。"],["Host","What time do you usually finish homework?","你通常幾點做完功課？"],["Leo","I usually finish it at eight, in my room.","我通常在我房間八點做完。"]],
        copywork: [["Good morning! I am a life reporter today.","早安！我今天是生活報導員。"],["I usually wake up at seven and walk to school.","我通常七點起床然後走路上學。"],["Right now, I am standing in front of my class.","現在我正站在全班面前。"],["Thank you for listening carefully to my report.","謝謝你們仔細聽我的報告。"]] },
    ]
  },
  {
    id: 6, title: "過去、選擇與計畫", zh: "國小六年級", icon: "📖",
    intro: "沿用 grammar_core u7、r2、u8、u11、u12、r4：過去簡單式、問句與否定、連接詞、can/there is/will、總複習。",
    weeks: [
      { title: "Yesterday", zh: "昨天", goal: "用過去簡單式規則動詞寫出昨日時間線 6～8 句。", pattern: ["I played soccer yesterday.", "I watched a movie last night."],
        vocab: [["yesterday","昨天","📆"],["last night","昨晚","🌙"],["walked","走了（過去式）","🚶"],["played","玩了（過去式）","⚽"],["watched","看了（過去式）","📺"],["cleaned","打掃了（過去式）","🧹"],["visited","拜訪了（過去式）","🚪"],["cooked","煮了（過去式）","🍳"]],
        grammar: { concept: "過去式把事情放進「昨天盒子」，規則動詞字尾加 -ed。",
          examples: [["I played basketball yesterday.","我昨天打籃球。"],["She watched a movie last night.","她昨晚看了一部電影。"],["We cleaned our room yesterday.","我們昨天打掃了房間。"],["He visited his grandma last weekend.","他上週末去看了他的奶奶。"]] },
        dialogue: [["Mia","What did you do yesterday?","你昨天做了什麼？"],["Tom","I played soccer, and I watched a movie last night.","我踢了足球，昨晚還看了電影。"],["Mia","Did you clean your room, too?","你也打掃房間了嗎？"],["Tom","Yes, I cleaned it in the morning.","對，我早上打掃的。"]],
        copywork: [["Yesterday was a busy day.","昨天是忙碌的一天。"],["I cleaned my room in the morning.","我早上打掃了房間。"],["I played soccer in the afternoon.","我下午踢了足球。"],["Last night, I watched a movie with my family.","昨晚我和家人一起看了電影。"]] },
      { title: "A Memorable Event", zh: "難忘的事", goal: "用常用不規則動詞口述一件真實或虛構事件。", pattern: ["I went to the zoo.", "I saw a lion."],
        vocab: [["went","去了（go 過去式）","🚶"],["saw","看見了（see 過去式）","👀"],["ate","吃了（eat 過去式）","🍽️"],["had","有；吃了（have 過去式）","🤲"],["made","做了（make 過去式）","🛠️"],["got","得到了（get 過去式）","🎁"],["came","來了（come 過去式）","🚶"],["took","拿了；拍了（take 過去式）","📸"]],
        grammar: { concept: "有些過去式不規則，不是加 -ed，要整個換一個字，像 go 變 went、see 變 saw，要多聽多記，沒有公式可以套。",
          examples: [["I went to the zoo last Sunday.","我上星期天去了動物園。"],["I saw a big lion there.","我在那裡看到一隻大獅子。"],["We ate ice cream after that.","我們之後吃了冰淇淋。"],["I had a wonderful day.","我度過了美好的一天。"]] },
        dialogue: [["Nora","Tell me about a memorable day.","跟我說說難忘的一天。"],["Kai","I went to the zoo. I saw a lion and ate ice cream!","我去了動物園。我看到獅子還吃了冰淇淋！"],["Nora","Sounds fun! What else happened?","聽起來很好玩！還發生了什麼事？"],["Kai","My dad took a lot of photos. We had a great day.","我爸拍了很多照片。我們度過美好的一天。"]],
        copywork: [["Last summer, I went to the beach.","去年夏天我去了海邊。"],["I saw many colorful fish in the water.","我在水裡看到很多色彩繽紛的魚。"],["I made a big sandcastle.","我做了一個大沙堡。"],["I had so much fun that day.","那天我玩得很開心。"]] },
      { title: "Time Detective", zh: "時間偵探", goal: "複習：依語意選對時態並修訂故事（now/every day/right now/yesterday）。", pattern: ["Yesterday I walked.", "I am walking right now."],
        vocab: [["yesterday","昨天","📆","W1"],["every day","每天","📅","W5-1"],["right now","現在此刻","⏱️","W5-3"],["ago","以前","⏪"],["timeline","時間軸","📏"],["clue","線索","🔎"],["detective","偵探","🕵️"],["decide","決定","🤔"]],
        grammar: { concept: "看時間詞決定動詞形狀：yesterday/last 用過去式，every day/usually 用現在簡單式，right now/now 用現在進行式。",
          examples: [["I walk to school every day.","我每天走路上學。"],["I walked to school yesterday.","我昨天走路上學。"],["I am walking to school right now.","我現在正在走路上學。"],["I visited my aunt three days ago.","我三天前去看了我阿姨。"]] },
        dialogue: [["Detective","Here's a clue: I ___ breakfast right now. What form?","這是一個線索：我現在___早餐。要用什麼形式？"],["Leo","Present continuous! I am eating breakfast right now.","現在進行式！我現在正在吃早餐。"],["Detective","Good! Now: I ___ breakfast yesterday.","很好！現在：我昨天___了早餐。"],["Leo","Past simple! I ate breakfast yesterday.","過去簡單式！我昨天吃了早餐。"]],
        copywork: [["Every day, I brush my teeth twice.","我每天刷兩次牙。"],["Yesterday, I brushed my teeth twice, too.","昨天我也刷了兩次牙。"],["Right now, I am brushing my teeth.","我現在正在刷牙。"],["A detective looks at time words before deciding the verb.","偵探會先看時間詞，再決定動詞形狀。"]] },
      { title: "Ask the Witness", zh: "詢問證人", goal: "用 do/does/did 問句與否定，完成偵探訪談 8 輪。", pattern: ["Did you see it?", "No, I didn't see it."],
        vocab: [["did","（過去式助動詞）","❗"],["didn't","沒有（過去式否定）","🚫"],["does","（第三人稱助動詞）","❗"],["doesn't","不（第三人稱否定）","🚫"],["witness","證人","🙋"],["evidence","證據","🔍"],["question","問題","❓"],["answer","回答","💬"]],
        grammar: { concept: "一般動詞的問句和否定要請小幫手：現在用 do/does，過去用 did，小幫手後面的動詞要回原形，不能再加 -s 或 -ed。",
          examples: [["Do you like apples?","你喜歡蘋果嗎？"],["I don't like apples.","我不喜歡蘋果。"],["Did you see the accident?","你看到那場意外了嗎？"],["No, I didn't see it.","不，我沒看到。"]] },
        dialogue: [["Officer","Did you see the cat run away?","你看到那隻貓跑走嗎？"],["Amy","No, I didn't see it run. But I heard it.","不，我沒看到牠跑。但我聽到了。"],["Officer","Does anyone else know?","還有其他人知道嗎？"],["Amy","My brother does. He saw everything.","我弟弟知道。他全都看到了。"]],
        copywork: [["Did you see who took the ball?","你看到是誰拿走球了嗎？"],["I didn't see anyone near the door.","我沒看到有人在門附近。"],["Does your friend know the answer?","你的朋友知道答案嗎？"],["He doesn't know, but he heard a noise.","他不知道，但他聽到一個聲音。"]] },
      { title: "Reasons and Results", zh: "原因與結果", goal: "用連接詞 and/but/or/so/because 合併短句成連貫段落。", pattern: ["I was tired, so I went to bed.", "I like tea, but I don't like coffee."],
        vocab: [["and","和；而且","➕"],["but","但是","🔀"],["or","或者","🔁"],["so","所以","➡️"],["because","因為","💡"],["reason","原因","🔎"],["result","結果","🎯"],["choice","選擇","🤔"]],
        grammar: { concept: "連接詞不是裝飾，是說明兩句話的關係：and 加一件事、but 轉折、or 選一個、so 講結果、because 講原因。",
          examples: [["I was hungry, so I ate a sandwich.","我肚子餓，所以我吃了三明治。"],["I like dogs, but I am afraid of cats.","我喜歡狗，但我怕貓。"],["You can have juice or water.","你可以喝果汁或水。"],["I stayed home because it was raining.","我待在家因為在下雨。"]] },
        dialogue: [["Mia","Why did you stay home yesterday?","你昨天為什麼待在家？"],["Leo","I stayed home because I was sick.","我待在家因為我生病了。"],["Mia","Do you want tea or juice now?","你現在想喝茶還是果汁？"],["Leo","I like both, but I will choose juice today.","我兩個都喜歡，但今天我選果汁。"]],
        copywork: [["I finished my homework, so I could play outside.","我做完功課了，所以我可以到外面玩。"],["I wanted to play soccer, but it started to rain.","我想踢足球，但開始下雨了。"],["I could watch TV or read a book.","我可以看電視或看書。"],["I chose to read because the story was exciting.","我選擇看書因為故事很刺激。"]] },
      { title: "Can We Improve It?", zh: "我們能改善它嗎？", goal: "用 can 和 there is/are 提出一項可行改善。", pattern: ["There is a problem.", "We can solve it."],
        vocab: [["can","能；會","✅"],["can't","不能；不會","🚫"],["there is","有（單數）","👉"],["there are","有（複數）","👉"],["problem","問題","❗"],["improve","改善","📈"],["idea","點子","💡"],["solve","解決","🧩"]],
        grammar: { concept: "can 後面的動詞要用原形；there is 接單數、there are 接複數，用來說「有」某個東西存在。",
          examples: [["There is a problem in our classroom.","我們教室裡有一個問題。"],["There are too many papers on the floor.","地板上有太多紙。"],["We can clean it up together.","我們可以一起把它清乾淨。"],["I can't do it alone.","我一個人做不到。"]] },
        dialogue: [["Leader","There is a problem with our playground.","我們的遊樂場有一個問題。"],["Nora","What is it?","是什麼問題？"],["Leader","There are not enough trash cans.","垃圾桶不夠多。"],["Nora","We can ask the school for more!","我們可以向學校要求更多！"]],
        copywork: [["There is a small garden behind our school.","我們學校後面有一個小花園。"],["There are not many flowers in it.","裡面沒有很多花。"],["We can plant more flowers together.","我們可以一起種更多花。"],["I can't wait to see it grow.","我等不及要看它長大了。"]] },
      { title: "Next Month", zh: "下個月", goal: "用 will 和 be going to 入門，製作未來計畫卡。", pattern: ["I will visit my grandma.", "We are going to have a trip."],
        vocab: [["will","將會","🔮"],["going to","打算要","📌"],["plan","計畫","🗺️"],["next month","下個月","📅"],["future","未來","🔮"],["trip","旅行","🧳"],["prepare","準備","🎒"],["hope","希望","🤞"]],
        grammar: { concept: "will 和 be going to 都可以講未來的事，will 常用來講當下的決定或猜測，be going to 常用來講已經計畫好的事。",
          examples: [["I will call you tonight.","我今晚會打電話給你。"],["We are going to visit Japan next month.","我們下個月要去日本玩。"],["It will rain tomorrow, I think.","我想明天會下雨。"],["I am going to prepare my bag tonight.","我今晚要準備我的包包。"]] },
        dialogue: [["Sara","What is your plan for next month?","你下個月的計畫是什麼？"],["Ben","We are going to visit my grandma.","我們要去看我奶奶。"],["Sara","That sounds fun! I will miss you.","聽起來很好玩！我會想你的。"],["Ben","Don't worry, I will send you photos.","別擔心，我會傳照片給你。"]],
        copywork: [["Next month, my family is going to travel.","下個月我的家人要去旅行。"],["We are going to visit the mountains.","我們要去山上玩。"],["I will pack my bag the night before.","我會在前一晚打包好包包。"],["I hope the weather will be nice.","我希望天氣會很好。"]] },
      { title: "Past to Future", zh: "從過去到未來", goal: "總複習：把過去事件和未來計畫合成雙段作品。", pattern: ["Last month I..., and next month I will..."],
        vocab: [["past","過去","⏪","W1-2"],["future","未來","🔮","W7"],["plan","計畫","🗺️","W7"],["event","事件","📌","W2"],["connect","連接","🔗"],["story","故事","📖","W2"],["both","兩者都","🤝"],["together","一起","👨‍👩‍👧‍👦"]],
        grammar: { concept: "把過去式和未來式合在一段話裡：先講已經發生的事，再講接下來的計畫，用 and/so/because 這些連接詞接起來。",
          examples: [["Last week, I visited my cousin.","上星期我去看了我表哥。"],["We had a great time together.","我們一起度過了美好的時光。"],["Next month, I am going to visit him again.","下個月我要再去看他一次。"],["I will bring him a gift.","我會帶禮物給他。"]] },
        dialogue: [["Teacher","Tell us about your past and your future plan.","跟我們說說你的過去和未來計畫。"],["Amy","Last month, I visited my cousin. We had a great time.","上個月我去看了我表哥。我們度過了美好的時光。"],["Teacher","What is your plan now?","你現在的計畫是什麼？"],["Amy","Next month, I am going to visit him again. I will bring a gift.","下個月我要再去看他一次。我會帶禮物去。"]],
        copywork: [["Last summer, I went to the beach with my family.","去年夏天我和家人去了海邊。"],["We swam and ate ice cream together.","我們一起游泳、吃冰淇淋。"],["Next summer, I am going to go camping instead.","明年夏天我打算改成去露營。"],["I will bring my camera to take photos.","我會帶相機去拍照。"]] },
    ]
  }
];

// wL4/wL5/wL6 canonical 字彙中，wordbank.js 沒有收錄的補上中文義。
const EXTRA_ZH = {
  be: "是（原形）", bookstore: "書店", cellphone: "手機", city: "城市", date: "日期", dig: "挖", dish: "盤子；菜餚", does: "（助動詞）", even: "甚至", fall: "秋天；跌倒", feed: "餵", from: "從", grandfather: "祖父", grandmother: "祖母", homework: "功課", movie: "電影", never: "從不", news: "新聞", of: "的", office: "辦公室", out: "出去；在外面", page: "頁面", paper: "紙", part: "部分", pork: "豬肉", road: "道路", salad: "沙拉", same: "一樣的", season: "季節", send: "寄；送", sir: "先生", size: "尺寸", smart: "聰明的", smell: "聞；味道", snack: "點心", snake: "蛇", so: "所以；那麼", some: "一些", soon: "很快", sound: "聲音；聽起來", speak: "說話", sports: "運動", stay: "停留", steak: "牛排", still: "仍然", stop: "停止", street: "街道", strong: "強壯的", sugar: "糖", sure: "確定的", sweet: "甜的", tape: "膠帶；錄音帶", television: "電視", this: "這個", tv: "電視", use: "使用", vacation: "假期", vegetable: "蔬菜", visit: "拜訪", wall: "牆", wet: "濕的", which: "哪一個", wind: "風", window: "窗戶", wonderful: "很棒的", worry: "擔心", writer: "作家", wrong: "錯的",
  "a few": "一些（可數）", "a little": "一點（不可數）", "a lot": "很多", afraid: "害怕的", again: "再一次", all: "全部", always: "總是", answer: "回答", anybody: "任何人", anyone: "任何人", anything: "任何事物", away: "離開；在遠處", back: "背部；回去", become: "變成", before: "在……之前", begin: "開始", both: "兩者都", careful: "小心的", catch: "抓住", class: "班級；課", cut: "切", daughter: "女兒", delicious: "好吃的", did: "（過去式助動詞）", driver: "駕駛", each: "每一個", enjoy: "享受", enough: "足夠的", everybody: "每個人", everyone: "每個人", everything: "每件事", farm: "農場", fire: "火", forget: "忘記", friday: "星期五", frisbee: "飛盤", get: "得到", glad: "高興的", hate: "討厭", hear: "聽到", high: "高的", him: "他（受格）", hope: "希望", hotel: "飯店", hurry: "趕快", husband: "丈夫", large: "大的", last: "最後的；上一個", left: "左邊；離開（過去式）", lesson: "課程", lucky: "幸運的", many: "很多", me: "我（受格）", meet: "遇見", mom: "媽媽", mommy: "媽咪", monday: "星期一", more: "更多", mountain: "山", much: "很多（不可數）", near: "靠近", number: "數字", often: "常常", once: "一次", only: "只", order: "點餐；順序", other: "其他的", outside: "在外面", over: "在……上方；結束", parent: "父母", party: "派對", pass: "通過", past: "過去", people: "人們", person: "人", pick: "挑選", pizza: "披薩", place: "地方", plan: "計畫", practice: "練習", prepare: "準備", present: "禮物；現在的", problem: "問題", pull: "拉", push: "推", queen: "皇后", question: "問題", quick: "快的", radio: "收音機", remember: "記得", repeat: "重複", ride: "騎；搭乘", right: "對的；右邊", safe: "安全的", saturday: "星期六", seldom: "很少", "senior high school": "高中", several: "幾個", shoe: "鞋子", smile: "微笑", sometimes: "有時候", sorry: "抱歉", sunday: "星期天", taiwan: "台灣", teach: "教", tell: "告訴", test: "考試", the: "那個（定冠詞）", them: "他們（受格）", thursday: "星期四", ticket: "票", to: "到；去", town: "城鎮", tuesday: "星期二", understand: "了解", unhappy: "不開心的", us: "我們（受格）", usually: "通常", waiter: "服務生", waitress: "女服務生", was: "是（過去式）", watch: "看；手錶", wednesday: "星期三", welcome: "歡迎", well: "好；健康地", were: "是（過去式複數）", wife: "妻子", win: "贏", your: "你的",
  age: "年紀", agree: "同意", airport: "機場", also: "也", angry: "生氣的", another: "另一個", april: "四月", august: "八月", bath: "洗澡", beach: "海灘", beautiful: "美麗的", because: "因為", believe: "相信", between: "在……之間", blow: "吹", borrow: "借（入）", boss: "老闆", bottle: "瓶子", bottom: "底部", camp: "露營", care: "照顧；在乎", chance: "機會", china: "中國", chocolate: "巧克力", christmas: "聖誕節", church: "教堂", climb: "爬", club: "社團", comfortable: "舒服的", convenient: "方便的", cost: "花費", couch: "沙發", count: "數", crazy: "瘋狂的", dead: "死的", december: "十二月", decide: "決定", different: "不同的", doctor: "醫生", dodgeball: "躲避球", during: "在……期間", "e-mail": "電子郵件", earth: "地球", east: "東方", easter: "復活節", either: "兩者之一", "elementary school": "國小", else: "其他的", email: "電子郵件", end: "結束", enter: "進入", eve: "前夕", example: "例子", fact: "事實", factory: "工廠", famous: "有名的", farmer: "農夫", favorite: "最喜歡的", february: "二月", few: "很少的", fill: "填滿", finally: "最後", finger: "手指", finish: "完成", fisherman: "漁夫", fix: "修理", floor: "地板", follow: "跟隨", front: "前面", fun: "有趣的", garbage: "垃圾", gift: "禮物", glove: "手套", habit: "習慣", hamburger: "漢堡", happen: "發生", health: "健康", heavy: "重的", helpful: "有幫助的", her: "她的", hide: "躲", his: "他的", history: "歷史", hobby: "興趣", holiday: "假日", idea: "想法", important: "重要的", inside: "在裡面", january: "一月", july: "七月", june: "六月", know: "知道", lazy: "懶惰的", lemon: "檸檬", let: "讓", lip: "嘴唇", listen: "聽", little: "小的", live: "居住；活的", loud: "大聲的", low: "低的", "mail carrier": "郵差", mailman: "郵差", map: "地圖", march: "三月", math: "數學", mathematics: "數學", may: "五月；可能", maybe: "也許", meeting: "會議", most: "大部分", mrt: "捷運", must: "必須", my: "我的", noodle: "麵", north: "北方", november: "十一月", october: "十月", oil: "油", our: "我們的", plane: "飛機", popcorn: "爆米花", put: "放", quiet: "安靜的", ready: "準備好的", restroom: "洗手間", "roller skate": "溜冰鞋", rose: "玫瑰", round: "圓的", sale: "拍賣", sell: "賣", september: "九月", shape: "形狀", share: "分享", shopkeeper: "店主", sick: "生病的", side: "邊；旁邊", south: "南方", space: "太空；空間", special: "特別的", story: "故事", sweater: "毛衣", "t-shirt": "T恤", their: "他們的", thin: "瘦的；薄的", thing: "東西", tooth: "牙齒", trash: "垃圾", useful: "有用的", video: "影片", voice: "聲音", weak: "虛弱的", west: "西方", will: "將會", wish: "希望", workbook: "練習本", would: "會（委婉語氣）",
};

const WORD_BANK_ZH = Object.fromEntries(WORDBANK.map(item => [item.en, item.zh]).filter(([, zh]) => zh));
const WEEK_ZH = Object.fromEntries(LEVELS.flatMap(level => level.weeks.flatMap(week => week.vocab.map(v => [v[0], v[1]]))));
function wordZh(word) { return EXTRA_ZH[word] || WEEK_ZH[word] || WORD_BANK_ZH[word] || "中文意思整理中"; }

const HEADER_COLOR = { 4: "#0e9594", 5: "#e08e2b", 6: "#d1495b" };
const CARD_COLOR = { 4: "#0e9594", 5: "#c8791f", 6: "#b13a4c" };

const CSS = `
body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;max-width:720px;margin:0 auto;padding:0 14px 60px;line-height:1.7}
header{color:#fff;text-align:center;padding:18px;border-radius:0 0 14px 14px;margin:0 -14px 12px}
header h1{margin:0;font-size:1.2rem} header p{margin:6px 0 0;font-size:.82rem;opacity:.92} header a{color:#fff;text-decoration:none;font-weight:700}
.card{background:#fff;border-radius:14px;padding:14px 16px;margin-top:14px;box-shadow:0 1px 4px rgba(0,0,0,.08)} .card h2{font-size:1rem;margin:0 0 8px}
.goal{font-size:.92rem;background:#eef1ff;border-radius:10px;padding:10px 14px;font-weight:700}
.pattern{font-size:1rem;background:#eef5ff;border-radius:10px;padding:10px 14px;font-weight:700;color:#1e5fb8;margin-top:8px}
.dlg{border-top:1px dashed #eee;padding:9px 0;font-size:.95rem;display:flex;align-items:center;gap:8px}.dlg b{min-width:60px}.dlg button,.playall{border:none;border-radius:8px;color:#fff;font-weight:700;padding:6px 12px;cursor:pointer}.dlg small{display:block;color:#888;margin-top:2px}.dlg .txt{flex:1}
.vocabgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-top:6px}.vcard{background:#fdf6e3;border:2px solid #f2d68a;border-radius:12px;text-align:center;padding:10px 6px;cursor:pointer}.vcard .em{font-size:1.8rem}.vcard b{display:block;margin-top:4px;font-size:.92rem}.vcard small{color:#888}.vcard .tag{font-size:.65rem;color:#b5651d;font-weight:700}
.grammar{border:2px solid #cdeceb}.grammar .concept{font-size:.92rem;background:#eafffb;border-radius:10px;padding:10px 14px;margin-bottom:8px}
.gex{border-top:1px dashed #eee;padding:8px 0;font-size:.95rem;display:flex;align-items:center;gap:8px}.gex button{border:none;border-radius:8px;color:#fff;font-weight:700;padding:6px 12px;cursor:pointer}.gex small{display:block;color:#888;margin-top:2px}
#gameArea{margin-top:8px}#gameArea button.gcard{padding:12px 10px;border:2px solid #d9e2ec;border-radius:12px;background:#fff;font-weight:700;cursor:pointer;margin:4px;font-size:1rem}#gameArea button.gcard.correct{border-color:#2fbf71;background:#d9f7e8}#gameArea button.gcard.wrong{border-color:#ef476f;background:#fde0e8}#gplay{border:none;border-radius:10px;color:#fff;font-weight:700;padding:9px 16px;cursor:pointer;margin-bottom:8px}#gstatus{font-weight:700;margin-top:8px;min-height:1.4em}
.copywork{border:2px solid #f2d68a;background:#fffdf4}.copywork h2{color:#b5651d}.copywork .steps{margin:8px 0 10px;padding-left:22px}.copy-line{border-top:1px dashed #ddd;padding:8px 0;font-size:1rem}.copy-line b{display:block}.copy-line small{color:#777}.speak-check{background:#eafff2;border-radius:10px;padding:9px 12px;color:#187a48;font-weight:700;margin-top:10px}
.donebox{text-align:center}.donebox label{font-weight:700;font-size:.9rem}.nav2{display:flex;justify-content:space-between;margin-top:16px;font-size:.85rem}.nav2 a{text-decoration:none;font-weight:700;background:#fff;border-radius:10px;padding:9px 14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
`;

function renderWeek(level, week, index) {
  const color = CARD_COLOR[level.id];
  const vocabAudio = Object.fromEntries(week.vocab.map(v => [v[0], audioName(level.id, index + 1, "v", slug(v[0]))]));
  const dlgAudio = week.dialogue.map((_, i) => audioName(level.id, index + 1, "d", i));
  const gexAudio = week.grammar.examples.map((_, i) => audioName(level.id, index + 1, "g", i));
  const copyAudio = audioName(level.id, index + 1, "copy");
  const vocabMap = Object.fromEntries(week.vocab.map(v => [v[0], { en: v[0], emoji: v[2] }]));
  const body = `<div class="card"><div class="goal" style="color:${color}">🎯 ${esc(week.goal)}</div>${week.pattern.map(p => `<div class="pattern">${esc(p)}</div>`).join("")}</div>
<div class="card"><h2 style="color:${color}">🎧 情境對話</h2><button class="playall" style="background:${color}" onclick="playDialogue()">▶️ 全部播放</button>${week.dialogue.map((d, i) => `<div class="dlg"><b>${esc(d[0])}</b><button style="background:${color}" onclick="playAudio('${dlgAudio[i]}')">🔊</button><span class="txt">${esc(d[1])}<small>${esc(d[2])}</small></span></div>`).join("")}</div>
<div class="card"><h2 style="color:${color}">🔤 單字卡</h2><div class="vocabgrid">${week.vocab.map(v => `<div class="vcard" onclick="playAudio('${vocabAudio[v[0]]}')">${v[3] ? `<div class="tag">${esc(v[3])}</div>` : ""}<div class="em">${v[2]}</div><b>${esc(v[0])}</b><small>${esc(v[1])}</small></div>`).join("")}</div></div>
<div class="card grammar"><h2 style="color:${color}">📐 本週文法小提示</h2><div class="concept">${esc(week.grammar.concept)}</div>${week.grammar.examples.map((ex, i) => `<div class="gex"><button style="background:${color}" onclick="playAudio('${gexAudio[i]}')">🔊</button><span><b>${esc(ex[0])}</b><small>${esc(ex[1])}</small></span></div>`).join("")}</div>
<div class="card"><h2 style="color:${color}">🎮 聽力遊戲</h2><p>🔊 聽單字，點對的卡片</p><button id="gplay" style="background:${color}" onclick="startGame()">▶️ 開始</button><div id="gameArea"></div><div id="gstatus"></div></div>
<div class="card copywork"><h2>✍️ 本週獨立短文：手寫＋口說</h2><p>這篇短文不在上方對話中。請抄在實體筆記本上，邊寫邊小聲念，再朗讀和背說。</p><button class="playall" style="background:${color}" onclick="playAudio('${copyAudio}')">🔊 聽整篇示範</button><ol class="steps"><li>先聽整篇 2 次。</li><li>每句手寫 1 次，邊寫邊念。</li><li>看著筆記本朗讀 3 次。</li><li>闔上頁面，試著完整背說 1 次。</li></ol>${week.copywork.map(p => `<div class="copy-line"><b>${esc(p[0])}</b><small>${esc(p[1])}</small></div>`).join("")}<div class="speak-check">完成標準：能不看網頁，順順念完自己的手寫短文。</div></div>
<div class="card donebox"><label><input type="checkbox" id="doneCb" onchange="toggleDone(this)"> ✅ 這週完成了</label></div>`;
  const previous = index ? `<a href="week${index}.html" style="color:${color}">← Week ${index}</a>` : `<a href="index.html" style="color:${color}">← ${level.title}</a>`;
  const next = index < 7 ? `<a href="week${index + 2}.html" style="color:${color}">Week ${index + 2} →</a>` : `<a href="index.html" style="color:${color}">完成 ${level.title} 🎉</a>`;
  return `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${level.icon} Lv.${level.id} Week ${index + 1}：${esc(week.title)}</title><style>${CSS}</style></head><body><header style="background:${HEADER_COLOR[level.id]}"><h1>${level.icon} Lv.${level.id} Week ${index + 1}：${esc(week.title)}</h1><p><a href="index.html">← ${esc(level.title)}</a> · ${esc(week.zh)}</p></header>${body}<div class="nav2"><span>${previous}</span><span>${next}</span></div><script>
const DIALOGUE_AUDIO=${JSON.stringify(dlgAudio)};
const VOCAB_AUDIO=${JSON.stringify(vocabAudio)};
const VOCAB_MAP=${JSON.stringify(vocabMap)};
const GAME_WORDS=${JSON.stringify(week.vocab.map(v => v[0]))};
function playAudio(name){new Audio("audio/"+name+".mp3").play().catch(()=>{});}
let dialogueIndex=0; function playDialogue(){dialogueIndex=0;playNext();} function playNext(){if(dialogueIndex>=DIALOGUE_AUDIO.length)return;const a=new Audio("audio/"+DIALOGUE_AUDIO[dialogueIndex]+".mp3");a.onended=()=>{dialogueIndex++;playNext();};a.play().catch(()=>{dialogueIndex++;playNext();});}
let gWords=[],gIdx=0,gScore=0;
function shuffle(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startGame(){gWords=shuffle(GAME_WORDS);gIdx=0;gScore=0;document.getElementById("gstatus").textContent="";renderGameRound();}
function renderGameRound(){
  const area=document.getElementById("gameArea");
  if(gIdx>=gWords.length){area.innerHTML="";document.getElementById("gstatus").textContent="🎉 完成！答對 "+gScore+" / "+gWords.length;return;}
  const target=gWords[gIdx];
  const choices=shuffle(GAME_WORDS.filter(w=>w!==target).slice(0,3).concat([target]));
  area.innerHTML=choices.map(w=>{const v=VOCAB_MAP[w];return '<button class="gcard" data-w="'+w+'" onclick="gameAnswer(this,\\''+w+'\\')">'+v.emoji+' '+v.en+'</button>';}).join("");
  new Audio("audio/"+VOCAB_AUDIO[target]+".mp3").play().catch(()=>{});
  document.getElementById("gstatus").textContent="第 "+(gIdx+1)+" / "+gWords.length+" 題";
}
function gameAnswer(btn,w){
  const target=gWords[gIdx];
  document.querySelectorAll("#gameArea button").forEach(b=>b.disabled=true);
  if(w===target){btn.classList.add("correct");gScore++;}
  else{btn.classList.add("wrong");document.querySelector('#gameArea [data-w="'+target+'"]').classList.add("correct");}
  setTimeout(()=>{gIdx++;renderGameRound();},900);
}
const doneKey="k9progress"; function toggleDone(cb){let d={};try{d=JSON.parse(localStorage.getItem(doneKey)||"{}")}catch(e){} if(!d.lv${level.id})d.lv${level.id}={};d.lv${level.id}["week${index + 1}"]=cb.checked;localStorage.setItem(doneKey,JSON.stringify(d));} (function(){try{const d=JSON.parse(localStorage.getItem(doneKey)||"{}");const cb=document.getElementById("doneCb");if(cb&&d.lv${level.id}&&d.lv${level.id}["week${index + 1}"])cb.checked=true;}catch(e){}})();
</script></body></html>`;
}

function renderIndex(level) {
  const rows = level.weeks.map((w, i) => `<a class="week" href="week${i + 1}.html"><span class="num">${i + 1}</span><span><b>Week ${i + 1}：${esc(w.title)}</b><small>${esc(w.zh)}</small></span></a>`).join("");
  const canonical = Object.keys(WORD_LEVELS).filter(word => WORD_LEVELS[word] === level.id).sort();
  const usedWords = new Set(level.weeks.flatMap(w => w.vocab.map(v => v[0])));
  const pool = canonical.map(word => `<details class="pool-word${usedWords.has(word) ? " used" : ""}"><summary>${esc(word)}</summary><span>${esc(wordZh(word))}</span></details>`).join("");
  const color = HEADER_COLOR[level.id];
  return `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Lv.${level.id} ${esc(level.title)}</title><style>${CSS}.home{background:${color};color:#fff;text-align:center;padding:22px 16px;border-radius:0 0 14px 14px;margin:0 -14px 14px}.home h1{margin:0;font-size:1.35rem}.home a{color:#fff}.week{display:flex;align-items:center;gap:12px;background:#fff;border-radius:14px;padding:12px 14px;margin-top:10px;box-shadow:0 1px 4px rgba(0,0,0,.08);text-decoration:none;color:inherit}.week .num{background:#eef1ff;color:${color};border-radius:50%;width:32px;height:32px;text-align:center;line-height:32px;font-weight:700}.week b{display:block}.week small{color:#888}.pool-intro{color:#666;font-size:.88rem;margin:4px 0 10px}.poolgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}.pool-word{background:#fdf6e3;border:1px solid #f2d68a;border-radius:9px;min-height:38px}.pool-word.used{background:#eef4f4;border:1px solid #9ad8d6}.pool-word summary{cursor:pointer;padding:6px 8px;font-weight:700;color:#243042;list-style-position:inside}.pool-word span{display:block;padding:0 8px 7px;color:${color};font-size:.85rem;font-weight:700}.legend{font-size:.8rem;color:#666;margin:8px 0}.legend .sw{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:4px;vertical-align:-1px}.quizlink{display:block;text-align:center;background:${color};color:#fff;font-weight:700;text-decoration:none;border-radius:10px;padding:10px;margin-top:10px}</style></head><body><header class="home"><h1>${level.icon} Lv.${level.id}：${esc(level.title)}</h1><p><a href="../index.html">← 國小～國中英語 9 級課程</a> · ${esc(level.zh)}</p></header><div class="card"><h2 style="color:${color}">📚 Lv.${level.id} 字彙池（wL${level.id}，${canonical.length} 字）</h2><p class="pool-intro">點一下單字，就會展開中文意思；再點一次可以收合。這是理解字彙池，每週主動練習仍以各週單字卡為主。</p><p class="legend"><span class="sw" style="background:#eef4f4;border:1px solid #9ad8d6"></span>本級 8 週課程教過　<span class="sw" style="background:#fdf6e3;border:1px solid #f2d68a"></span>只在字彙池，還沒排進課程</p><div class="poolgrid">${pool}</div><a class="quizlink" href="vocab_quiz.html">🎯 開始這一級的單字練習題</a></div><div class="card"><h2 style="color:${color}">這一級要做到</h2><p>${esc(level.intro)}</p><p>每週都有文法小提示、聽力遊戲、獨立短文：先聽、手寫、朗讀，再背說。</p></div>${rows}</body></html>`;
}

if (require.main === module) {
  for (const level of LEVELS) {
    const out = path.join(ROOT, `lv${level.id}`); fs.mkdirSync(path.join(out, "audio"), { recursive: true });
    level.weeks.forEach((week, i) => fs.writeFileSync(path.join(out, `week${i + 1}.html`), renderWeek(level, week, i), "utf8"));
    fs.writeFileSync(path.join(out, "index.html"), renderIndex(level), "utf8");
    const items = {};
    level.weeks.forEach((week, i) => {
      week.vocab.forEach(v => { items[audioName(level.id, i + 1, "v", slug(v[0]))] = v[0]; });
      week.dialogue.forEach((d, j) => { items[audioName(level.id, i + 1, "d", j)] = d[1]; });
      week.grammar.examples.forEach((ex, j) => { items[audioName(level.id, i + 1, "g", j)] = ex[0]; });
      items[audioName(level.id, i + 1, "copy")] = week.copywork.map(p => p[0]).join(" ");
    });
    fs.writeFileSync(path.join(__dirname, `audio_lv${level.id}.json`), JSON.stringify({ outdir: path.join(out, "audio").replace(/\\/g, "/"), voice: "af_heart", speed: 0.85, items }, null, 2), "utf8");
    const canonicalCount = Object.values(WORD_LEVELS).filter(sourceLevel => sourceLevel === level.id).length;
    console.log(`Lv.${level.id} canonical wL${level.id}: ${canonicalCount} 字, audio items: ${Object.keys(items).length}`);
  }
  console.log("已產生 Lv.4 / Lv.5 / Lv.6 各 8 週頁面與音訊清單");
}

module.exports = { LEVELS, wordZh };
