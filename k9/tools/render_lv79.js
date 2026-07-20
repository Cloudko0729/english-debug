// Lv.7 / Lv.8 / Lv.9（國中）課程產生器。文法是全新內容（不在 grammar_core），
// 用一個貫穿三年的主角 Zoe（+同學 Leo）當故事線，讓文法在同一個角色的持續情境裡反覆出現。
// 用法：node render_lv79.js
const fs = require("fs");
const path = require("path");
const { WORD_LEVELS, EXTRA_LEVELS, wordLevel } = require(path.join(__dirname, "..", "..", "kids", "wordlevels.js"));
const { WORDBANK } = require(path.join(__dirname, "..", "..", "kids", "wordbank.js"));

const ROOT = path.join(__dirname, "..");

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""); }
function audioName(level, week, kind, value) { return `${level}w${week}_${kind}${value == null ? "" : `_${value}`}`; }

const LEVELS = [
  {
    id: 7, title: "比較、敘事與社區", zh: "國中一年級 · Zoe 的第一年", icon: "🏫",
    intro: "全新文法內容（比較級/最高級、可數不可數量詞、to-infinitive、when/while、if 入門），跟著主角 Zoe 一路從新生開始。",
    weeks: [
      { title: "New School Life", zh: "新生活開始", goal: "複習核心時態與問句，適應國中新生活。", pattern: ["What is your favorite subject?", "Do you have a locker?"],
        vocab: [["subject","科目","📘"],["club","社團","🎨"],["schedule","課表","🗓️"],["responsibility","責任","📋"],["classmate","同學","🧑‍🤝‍🧑"],["uniform","制服","👕"],["locker","置物櫃","🗄️"],["timetable","時間表","⏰"]],
        grammar: { concept: "複習核心時態和問句：新環境要重新練習「你叫什麼名字/你喜歡什麼」這類問句，確認舊文法都還記得。",
          examples: [["What is your favorite subject?","你最喜歡的科目是什麼？"],["I have six classes today.","我今天有六堂課。"],["Do you have a locker?","你有置物櫃嗎？"],["I am not nervous anymore.","我不再緊張了。"]] },
        dialogue: [["Zoe","Hi! I'm Zoe. This is my first week of junior high.","嗨！我是Zoe。這是我讀國中的第一週。"],["Leo","Welcome! What subject do you like?","歡迎！你喜歡什麼科目？"],["Zoe","I like art. Do you have a club?","我喜歡美術。你有社團嗎？"],["Leo","Yes, I'm in the science club.","對，我在科學社。"]],
        copywork: [["My name is Zoe, and this is my new school.","我叫Zoe，這是我的新學校。"],["I have a new schedule and a new locker.","我有新的課表和新的置物櫃。"],["My classmates are friendly.","我的同學很友善。"],["I am excited about junior high.","我對國中生活很期待。"]] },
      { title: "Two Good Choices", zh: "兩個好選擇", goal: "用比較級/最高級比較兩個活動或商品並選擇。", pattern: ["This club is more popular than that one.", "This is the best choice."],
        vocab: [["price","價格","🏷️"],["distance","距離","📏"],["quality","品質","✨"],["convenient","方便的","👍"],["popular","受歡迎的","⭐"],["cheaper","比較便宜的","💰"],["closer","比較近的","📍"],["best","最好的","🏆"]],
        grammar: { concept: "比較級用來比兩個東西：形容詞字尾加 er，或前面加 more；最高級比三個以上，加 est 或用 most，前面要加 the。",
          examples: [["The art club is more popular than the chess club.","美術社比棋藝社更受歡迎。"],["This bike is cheaper than that one.","這台腳踏車比那台便宜。"],["This is the closest store to school.","這是離學校最近的商店。"],["Math is the most difficult subject for me.","數學對我來說是最難的科目。"]] },
        dialogue: [["Zoe","Should I join the art club or the dance club?","我該加入美術社還是舞蹈社？"],["Leo","The art club is quieter, but the dance club is more popular.","美術社比較安靜，但舞蹈社比較受歡迎。"],["Zoe","Which one is closer to my classroom?","哪一個離我的教室比較近？"],["Leo","The art room is the closest.","美術教室是最近的。"]],
        copywork: [["I compared two clubs before I decided.","我比較了兩個社團才決定。"],["The art club is smaller but more relaxing.","美術社比較小，但比較放鬆。"],["It is also the cheapest club to join.","它也是加入費最便宜的社團。"],["I think it is the best choice for me.","我覺得這對我來說是最好的選擇。"]] },
      { title: "Food, Waste and Amounts", zh: "食物、浪費與數量", goal: "用可數/不可數、some/any/much/many 做一日食物浪費觀察報告。", pattern: ["We have too much food waste.", "There isn't enough space in the fridge."],
        vocab: [["ingredient","食材","🥕"],["package","包裝","📦"],["waste","浪費","🗑️"],["enough","足夠的","✅"],["leftover","剩菜","🍱"],["portion","份量","🍽️"],["container","容器","🧴"],["recycle","回收","♻️"]],
        grammar: { concept: "可數名詞用 many/a few，不可數名詞用 much/a little；some 用在肯定句，any 用在問句和否定句。",
          examples: [["We don't have much rice left.","我們剩下的飯不多了。"],["There are too many packages in the trash.","垃圾裡有太多包裝。"],["Do you have any leftovers?","你有剩菜嗎？"],["I have a few ingredients for the recipe.","我有一些做這道菜的食材。"]] },
        dialogue: [["Zoe","How much food do we waste every week?","我們每週浪費多少食物？"],["Leo","Too much! Look at all these packages.","太多了！你看這些包裝。"],["Zoe","Do we have any leftovers we can reuse?","我們有剩菜可以再利用嗎？"],["Leo","Yes, a few. Let's make a plan.","有一些。我們來做個計畫。"]],
        copywork: [["Our class studied food waste for a week.","我們班研究了食物浪費一週。"],["We found too much packaging in the trash.","我們發現垃圾裡有太多包裝。"],["We didn't have much time, but we tried our best.","我們沒有太多時間，但盡力了。"],["Now we bring our own containers.","現在我們自備容器。"]] },
      { title: "Learning a Skill", zh: "學一項技能", goal: "用 want/need/plan/learn + to-infinitive 教別人學一項技能。", pattern: ["I want to learn the guitar.", "I need to practice every day."],
        vocab: [["practice","練習","🎸"],["improve","進步","📈"],["goal","目標","🎯"],["step","步驟","👣"],["challenge","挑戰","💪"],["skill","技能","🛠️"],["progress","進度","📊"],["patient","有耐心的","🧘"]],
        grammar: { concept: "want/need/plan/learn 後面接動詞要加 to，變成「想要做/需要做/計畫做/學會做」。",
          examples: [["I want to play the guitar well.","我想要把吉他彈好。"],["I need to practice every day.","我需要每天練習。"],["She plans to join the music contest.","她計畫參加音樂比賽。"],["He learned to skateboard last summer.","他去年夏天學會了滑滑板。"]] },
        dialogue: [["Zoe","What do you want to learn this year?","你今年想學什麼？"],["Leo","I want to learn to code.","我想學寫程式。"],["Zoe","I need to practice guitar every day.","我需要每天練吉他。"],["Leo","That's a great goal. Good luck!","那是個很棒的目標。加油！"]],
        copywork: [["I decided to learn the guitar this year.","我今年決定要學吉他。"],["I need to practice thirty minutes every day.","我需要每天練習三十分鐘。"],["It is hard, but I plan to keep trying.","這很難，但我計畫繼續嘗試。"],["I hope to play a full song by June.","我希望六月前能彈完一首完整的歌。"]] },
      { title: "When Things Changed", zh: "事情發生的那一刻", goal: "用 when/while 敘述一個 10-12 句的轉折故事。", pattern: ["While I was practicing, the string broke.", "When I saw it, I was surprised."],
        vocab: [["accident","意外","⚡"],["surprise","驚喜；驚訝","😲"],["decision","決定","🤔"],["response","反應","💬"],["suddenly","突然地","❗"],["meanwhile","同時","⏱️"],["react","反應","🔄"],["moment","時刻","⏳"]],
        grammar: { concept: "when 講一件事發生的那個時間點；while 講一個較長的動作進行中，另一件事發生了，while 後面常接進行式。",
          examples: [["When I opened the door, I saw my dog.","我打開門的時候，看到我的狗。"],["While I was doing homework, my phone rang.","我在做功課的時候，手機響了。"],["She smiled when she heard the news.","她聽到消息的時候笑了。"],["While we were walking home, it started to rain.","我們走路回家的時候，開始下雨了。"]] },
        dialogue: [["Leo","What happened at practice yesterday?","昨天練習發生了什麼事？"],["Zoe","While I was playing, a string broke.","我在彈的時候，一根弦斷了。"],["Leo","What did you do?","你怎麼做？"],["Zoe","When it happened, I just laughed and fixed it.","發生的時候，我就笑了笑，把它修好。"]],
        copywork: [["While I was practicing, something surprising happened.","我在練習的時候，發生了一件驚訝的事。"],["A guitar string broke when I hit a high note.","我彈到高音時，一根弦斷了。"],["While I was fixing it, my hands were shaking.","我在修的時候，手在抖。"],["When I finished, I felt proud of myself.","修好的時候，我為自己感到驕傲。"]] },
      { title: "Community Helpers", zh: "社區小幫手", goal: "複習 because/so，訪談或模擬一個社區角色。", pattern: ["I volunteer because I want to help.", "It rained, so we moved inside."],
        vocab: [["service","服務","🤝"],["volunteer","志工","🙋"],["safety","安全","🦺"],["elderly","年長的","👵"],["public","公共的","🏛️"],["helpful","有幫助的","💡"],["community","社區","🏘️"],["support","支持","💪"]],
        grammar: { concept: "複習 because 和 so：because 講原因，so 講結果，兩個都是連接詞，但方向相反。",
          examples: [["I help the elderly because they need support.","我幫助老人，因為他們需要支持。"],["It was raining, so we canceled the event.","下雨了，所以我們取消了活動。"],["She volunteers because she enjoys helping others.","她做志工，因為她喜歡幫助別人。"],["The park was dirty, so we cleaned it together.","公園很髒，所以我們一起清理了它。"]] },
        dialogue: [["Zoe","Why do you volunteer on weekends?","你為什麼週末去當志工？"],["Leo","I volunteer because I want to help my community.","我當志工因為我想幫助我的社區。"],["Zoe","The library needed help, so I joined too.","圖書館需要幫忙，所以我也加入了。"],["Leo","Great! Let's help together.","太好了！我們一起幫忙吧。"]],
        copywork: [["I joined a community service group this month.","這個月我加入了一個社區服務團隊。"],["We visited elderly neighbors because they live alone.","我們拜訪年長的鄰居，因為他們獨居。"],["They were happy, so we visited again the next week.","他們很開心，所以我們下週又去拜訪了。"],["Helping others makes me feel useful.","幫助別人讓我覺得自己有用。"]] },
      { title: "Local Nature", zh: "在地自然", goal: "用 if 入門，製作在地生物解說卡。", pattern: ["If we protect the river, fish will return.", "If we don't act, the habitat will disappear."],
        vocab: [["species","物種","🐦"],["habitat","棲地","🌳"],["protect","保護","🛡️"],["damage","損害","💥"],["observe","觀察","🔍"],["wildlife","野生動物","🦌"],["pollution","污染","🏭"],["ecosystem","生態系","🌿"]],
        grammar: { concept: "if 開頭講一個條件，後面用 will 講可能的結果：如果……，就會……。",
          examples: [["If we clean the river, fish will come back.","如果我們清理河流，魚就會回來。"],["If we don't recycle, the park will get dirty.","如果我們不回收，公園就會變髒。"],["If you plant a tree, it will grow for years.","如果你種一棵樹，它會生長好幾年。"],["If we protect this habitat, more animals will live here.","如果我們保護這個棲地，會有更多動物住在這裡。"]] },
        dialogue: [["Leo","What will happen if we don't protect this forest?","如果我們不保護這片森林會怎樣？"],["Zoe","If we don't act, the animals will lose their home.","如果我們不行動，動物們會失去牠們的家。"],["Leo","If we plant more trees, will it help?","如果我們種更多樹，會有幫助嗎？"],["Zoe","Yes! If we all help, the forest will recover.","會！如果我們都幫忙，森林會恢復的。"]],
        copywork: [["Our class visited the local forest this week.","我們班這週參觀了當地的森林。"],["If people keep littering, the habitat will be damaged.","如果人們繼續亂丟垃圾，棲地會被破壞。"],["If we protect it now, wildlife will thrive here.","如果我們現在保護它，野生動物會在這裡繁盛。"],["I will remember to protect nature every day.","我會記得每天保護大自然。"]] },
      { title: "Better Community Pitch", zh: "社區改善提案", goal: "螺旋整合本級全部文法，完成 2 分鐘社區改善提案。", pattern: ["Our pitch is about improving the park.", "If we do this, our community will improve."],
        vocab: [["pitch","提案","📣"],["proposal","提案","📄"],["improve","改善","📈"],["present","發表","🗣️"],["audience","觀眾","👥"],["teamwork","團隊合作","🤝"],["solution","解決方案","💡"],["impact","影響","🌟"]],
        grammar: { concept: "把這一級學過的文法合起來用：比較級選最好的方案、數量詞講資源、to-infinitive 講計畫、if 講結果，一起寫一份提案。",
          examples: [["This is the best solution for our community.","這是我們社區最好的解決方案。"],["We need to collect enough support first.","我們需要先收集足夠的支持。"],["We plan to present it to the school next week.","我們計畫下週跟學校報告。"],["If the school agrees, we will start next month.","如果學校同意，我們下個月就會開始。"]] },
        dialogue: [["Zoe","Our pitch is about a cleaner park.","我們的提案是關於一個更乾淨的公園。"],["Leo","It is the best idea our team has had.","這是我們團隊想過最好的點子。"],["Zoe","If the school likes it, we will start soon.","如果學校喜歡，我們很快就會開始。"],["Leo","I am proud of our teamwork this year.","我為我們今年的團隊合作感到驕傲。"]],
        copywork: [["This year, I learned to speak up for my ideas.","今年，我學會了為自己的想法發聲。"],["Our team compared many solutions before choosing the best one.","我們的團隊比較了很多方案才選出最好的。"],["If our school supports us, real change will happen.","如果我們學校支持我們，真正的改變就會發生。"],["I am proud of everything I learned this year.","我為今年學到的一切感到驕傲。"]] },
    ]
  },
  {
    id: 8, title: "科技、健康與環境選擇", zh: "國中二年級 · Zoe 的第二年", icon: "💻",
    intro: "全新文法內容（should/must/might、第一條件句、關係子句、現在完成式經驗用法），Zoe 和 Leo 升上二年級，開始做更深的專題。",
    weeks: [
      { title: "Digital Habits", zh: "數位習慣", goal: "複習頻率、比較，做一週數位習慣圖表解說。", pattern: ["I usually check my phone every hour.", "I spend more time online than my sister."],
        vocab: [["device","裝置","📱"],["screen","螢幕","🖥️"],["message","訊息","💬"],["privacy","隱私","🔒"],["balance","平衡","⚖️"],["notification","通知","🔔"],["scroll","滑動","👆"],["limit","限制","🚫"]],
        grammar: { concept: "複習頻率副詞和比較級，用來描述自己的 3C 使用習慣：多常用、跟別人比起來如何。",
          examples: [["I usually check messages after school.","我通常放學後查看訊息。"],["My screen time is longer than my brother's.","我的螢幕使用時間比我弟弟長。"],["I rarely turn off notifications.","我很少關閉通知。"],["I want a better balance between study and phone time.","我想要在讀書和手機時間之間有更好的平衡。"]] },
        dialogue: [["Zoe","How much screen time do you have a day?","你一天的螢幕使用時間多少？"],["Leo","About three hours. I usually scroll before bed.","大概三小時。我通常睡前會滑手機。"],["Zoe","That's more than me. I should set a limit.","那比我多。我應該設個限制。"],["Leo","Good idea. Let's try together.","好主意。我們一起試試看。"]],
        copywork: [["This week, I tracked my screen time.","這週，我記錄了我的螢幕使用時間。"],["I usually spend two hours online after school.","我通常放學後花兩小時上網。"],["My privacy settings are more careful than before.","我的隱私設定比以前更謹慎了。"],["I want a healthy balance, not zero screen time.","我想要健康的平衡，不是完全不用螢幕。"]] },
      { title: "Advice for Well-being", zh: "健康建議", goal: "用 should/must，給同齡者一份健康建議單。", pattern: ["You should sleep eight hours.", "You must rest when you are sick."],
        vocab: [["stress","壓力","😣"],["sleep","睡眠","😴"],["exercise","運動","🏃"],["habit","習慣","🔁"],["support","支持","💪"],["relax","放鬆","🧘"],["energy","精力","⚡"],["routine","例行公事","📅"]],
        grammar: { concept: "should/shouldn't 是建議（應該/不應該）；must/have to 是規定或必要（一定要），語氣比 should 強。",
          examples: [["You should drink more water.","你應該多喝水。"],["You shouldn't skip breakfast.","你不應該不吃早餐。"],["You must rest if you are sick.","如果你生病了，你一定要休息。"],["I have to finish my homework before dinner.","我晚餐前一定要做完功課。"]] },
        dialogue: [["Zoe","I feel stressed about exams. What should I do?","我對考試感到壓力很大。我應該怎麼做？"],["Leo","You should take short breaks and sleep enough.","你應該休息一下，並睡眠充足。"],["Zoe","I must study more, though.","不過我一定要多讀一點書。"],["Leo","You should balance both. Health comes first.","你應該兩者平衡。健康第一。"]],
        copywork: [["This month, I learned to manage stress better.","這個月，我學會更好地管理壓力。"],["I should sleep eight hours every night.","我每晚應該睡八小時。"],["I must not skip exercise, even during exams.","即使在考試期間，我也不能不運動。"],["You should take care of your health first.","你應該先照顧好自己的健康。"]] },
      { title: "Possibility and Evidence", zh: "可能性與證據", goal: "用 may/might/could 判斷三則主張的可信度。", pattern: ["It might rain later.", "This claim could be true."],
        vocab: [["likely","可能的","🎲"],["possible","可能的","❓"],["clue","線索","🔎"],["claim","主張","💬"],["evidence","證據","📋"],["guess","猜測","🤔"],["probably","大概","👍"],["uncertain","不確定的","🌫️"]],
        grammar: { concept: "may/might/could 都可以講「可能」，表示不確定；could 也可以講過去的能力，這裡先用來講可能性。",
          examples: [["It might rain this afternoon.","今天下午可能會下雨。"],["This claim could be true, but we need evidence.","這個說法可能是真的，但我們需要證據。"],["She may know the answer already.","她可能已經知道答案了。"],["The story could be a myth.","這個故事可能是個傳說。"]] },
        dialogue: [["Leo","Do you think this old story is true?","你覺得這個古老的故事是真的嗎？"],["Zoe","It might be true, but we need more evidence.","它可能是真的，但我們需要更多證據。"],["Leo","This clue could help us find out.","這條線索可能可以幫我們找出答案。"],["Zoe","Let's check. It could be an interesting project.","我們來查查看。這可能是個有趣的專案。"]],
        copywork: [["Our class investigated an old local legend.","我們班調查了一個古老的地方傳說。"],["The story might be based on a real event.","這個故事可能是根據真實事件改編的。"],["We found a clue that could support the claim.","我們找到一個可能支持這個說法的線索。"],["It was uncertain, but the search was fun.","雖然不確定，但這個尋找過程很有趣。"]] },
      { title: "If We Change One Thing", zh: "如果我們改變一件事", goal: "用第一條件句做環保行動及結果海報。", pattern: ["If we save energy, we will reduce our footprint.", "If more people recycle, we will have less waste."],
        vocab: [["energy","能源","⚡"],["transport","交通運輸","🚌"],["recycle","回收","♻️"],["emission","排放","💨"],["resource","資源","🌍"],["reduce","減少","📉"],["solar","太陽能的","☀️"],["footprint","足跡","👣"]],
        grammar: { concept: "第一條件句正式版：If + 現在簡單式, … will + 動詞原形，講「如果做了這件事，未來就會發生」。",
          examples: [["If we use less plastic, we will reduce waste.","如果我們用更少塑膠，就會減少垃圾。"],["If more people take the bus, traffic will improve.","如果更多人搭公車，交通就會改善。"],["If we save energy, our bills will be lower.","如果我們省能源，帳單就會變低。"],["If we plant more trees, the air will be cleaner.","如果我們種更多樹，空氣就會更乾淨。"]] },
        dialogue: [["Zoe","If we all recycle more, what will happen?","如果我們都多回收一點，會發生什麼事？"],["Leo","If we recycle more, we will make less waste.","如果我們多回收，就會製造更少垃圾。"],["Zoe","If our school uses solar power, we will save money too.","如果我們學校用太陽能，也會省錢。"],["Leo","Let's suggest it to the principal.","我們跟校長建議看看吧。"]],
        copywork: [["Our class chose one thing to change this month.","這個月我們班選了一件事來改變。"],["If we reduce plastic use, our school will produce less waste.","如果我們減少塑膠使用，學校就會製造更少垃圾。"],["If everyone joins, the change will be bigger.","如果大家都加入，改變就會更大。"],["If we start today, results will come soon.","如果我們今天就開始，結果很快就會出現。"]] },
      { title: "People and Things That Help", zh: "幫上忙的人與物", goal: "用 who/that/which 關係子句介紹一項有用發明。", pattern: ["She is the inventor who created this tool.", "This is the app that helps students study."],
        vocab: [["inventor","發明家","💡"],["tool","工具","🔧"],["feature","功能","⭐"],["solution","解決方案","🧩"],["user","使用者","🙋"],["device","裝置","📱"],["function","功能","⚙️"],["design","設計","🎨"]],
        grammar: { concept: "who 用來指人、which 用來指東西、that 兩種都可以用，關係子句用來補充說明前面的名詞是誰/是什麼。",
          examples: [["She is the scientist who invented this machine.","她是發明這台機器的科學家。"],["This is the app that helps me study English.","這是幫我學英文的應用程式。"],["The tool which he designed is very useful.","他設計的這個工具非常有用。"],["I met the teacher who started this club.","我見到了創辦這個社團的老師。"]] },
        dialogue: [["Leo","Who is the person who invented this app?","發明這個應用程式的人是誰？"],["Zoe","She is a student who studied here years ago.","她是幾年前在這裡讀書的學生。"],["Leo","This is the feature that I use the most.","這是我最常用的功能。"],["Zoe","It's the tool which helps me the most, too.","這也是最幫得上我的工具。"]],
        copywork: [["I researched an inventor who solved a real problem.","我研究了一位解決真實問題的發明家。"],["She created a tool that helps people who are blind.","她創造了一個幫助盲人的工具。"],["The feature which I admire most is its simple design.","我最欣賞的功能是它簡單的設計。"],["I want to build something that helps others, too.","我也想做一個能幫助別人的東西。"]] },
      { title: "Experiences", zh: "經驗", goal: "用現在完成式經驗用法做同伴經驗訪談與摘要。", pattern: ["I have never been abroad.", "Have you ever tried surfing?"],
        vocab: [["abroad","在國外","✈️"],["ever","曾經","🕰️"],["never","從不","🚫"],["try","嘗試","🎯"],["achieve","達成","🏆"],["experience","經驗","💼"],["journey","旅程","🧭"],["accomplish","完成","✅"]],
        grammar: { concept: "現在完成式(have/has + 過去分詞)講「到現在為止的經驗」，常跟 ever/never/already/yet 一起用，不強調確切時間。",
          examples: [["I have never been to Japan.","我從來沒去過日本。"],["Have you ever tried Thai food?","你吃過泰式料理嗎？"],["She has already finished her project.","她已經完成她的專案了。"],["I haven't tried surfing yet.","我還沒試過衝浪。"]] },
        dialogue: [["Zoe","Have you ever traveled abroad?","你曾經出國旅行過嗎？"],["Leo","Yes, I have been to Korea once.","有，我去過韓國一次。"],["Zoe","I have never been abroad, but I want to try.","我從來沒出過國，但我想試試看。"],["Leo","You should! It was an amazing experience.","你應該去！那是個很棒的經驗。"]],
        copywork: [["I interviewed my friend about his experiences.","我訪問了我朋友關於他的經驗。"],["He has visited three countries so far.","到目前為止他去過三個國家。"],["I have never traveled abroad, but I have big dreams.","我從來沒出過國，但我有遠大的夢想。"],["I hope to have my own journey soon.","我希望很快能有自己的旅程。"]] },
      { title: "Read Across Two Sources", zh: "對照兩份資料", goal: "複習整合：完成兩份短文本比較表。", pattern: ["This article says one thing, but that survey shows another.", "In my opinion, both sources are useful."],
        vocab: [["survey","調查","📊"],["article","文章","📰"],["fact","事實","💡"],["opinion","意見","💬"],["source","來源","📚"],["compare","比較","⚖️"],["summarize","摘要","📝"],["viewpoint","觀點","👁️"]],
        grammar: { concept: "複習：讀兩篇資料時，用比較級比較內容、用現在完成式講「已經讀過的部分」、用關係子句介紹資料來源。",
          examples: [["This is the survey which most students answered.","這是大部分學生都回答過的調查。"],["I have already read both articles.","我已經讀過這兩篇文章了。"],["This source is more reliable than that one.","這個來源比那個更可靠。"],["The opinion in this article might be one-sided.","這篇文章的觀點可能有點偏頗。"]] },
        dialogue: [["Leo","Have you compared the two articles yet?","你比較過這兩篇文章了嗎？"],["Zoe","Yes, I have. This one is more detailed.","有，我比較過了。這篇比較詳細。"],["Leo","Which source do you trust more?","你比較信任哪一個來源？"],["Zoe","The survey which asked real students feels more reliable.","那份問真實學生的調查感覺比較可靠。"]],
        copywork: [["I read two articles about the same topic.","我讀了兩篇關於同一主題的文章。"],["One source is more detailed than the other.","其中一個來源比另一個更詳細。"],["I have already compared their main points.","我已經比較過它們的重點了。"],["The source which used real data felt more trustworthy.","使用真實數據的那個來源感覺更值得信賴。"]] },
      { title: "Problem-Solution Brief", zh: "問題解決簡報", goal: "螺旋整合本級全部文法，完成 150-180 字簡報＋2分鐘口說。", pattern: ["We should propose a solution that works.", "If we present clear evidence, people will listen."],
        vocab: [["claim","主張","💬"],["evidence","證據","📋"],["argument","論點","🗣️"],["brief","簡報","📄"],["present","發表","🎤"],["propose","提出","💡"],["effective","有效的","✅"],["outcome","結果","🎯"]],
        grammar: { concept: "把 should/must、可能性、if 條件句、關係子句、現在完成式全部合起來，寫一份有主張、理由、證據的簡短報告。",
          examples: [["We have found a solution that could really help.","我們找到了一個可能真的有幫助的解決方案。"],["If we present it well, people will support us.","如果我們報告得好，人們會支持我們。"],["This is the evidence which proves our point.","這是證明我們論點的證據。"],["We should try this before the semester ends.","我們應該在學期結束前試試看。"]] },
        dialogue: [["Zoe","Have we finished our problem-solution brief?","我們的問題解決報告完成了嗎？"],["Leo","Almost. This is the evidence that supports our idea.","快了。這是支持我們想法的證據。"],["Zoe","If we present it clearly, they should understand.","如果我們講得清楚，他們應該會理解。"],["Leo","I'm proud of the evidence we have gathered.","我很自豪我們蒐集到的證據。"]],
        copywork: [["This year, I have learned to argue with evidence.","今年，我學會了用證據來論證。"],["We proposed a solution that could reduce our school's waste.","我們提出了一個可能減少學校垃圾的方案。"],["If people read our evidence, they should agree with us.","如果人們讀了我們的證據，應該會同意我們。"],["I am proud of the argument our team has built.","我為我們團隊建立的論點感到驕傲。"]] },
    ]
  },
  {
    id: 9, title: "資訊判讀與公共議題", zh: "國中三年級 · Zoe 的畢業年", icon: "🎓",
    intro: "全新文法內容（現在完成式與過去式比較、流程被動、引述觀點、篇章銜接），Zoe 準備畢業專題發表，回顧三年的成長。",
    weeks: [
      { title: "Experience and Time", zh: "經驗與時間", goal: "比較現在完成式與過去式，寫個人成長時間線與短文。", pattern: ["I have lived here since 2019.", "I visited Japan last year."],
        vocab: [["experience","經驗","💼"],["event","事件","📌"],["since","自從","⏳"],["recently","最近","🕰️"],["specific","特定的","🎯"],["date","日期","📅"],["moment","時刻","✨"],["memory","回憶","💭"]],
        grammar: { concept: "現在完成式講「到現在還算數的經驗」，不講明確時間；過去式講「已經結束、有明確時間點」的事，兩個不能混用同一句。",
          examples: [["I have lived in this city since 2019.","我從2019年就住在這個城市。"],["I visited Japan last year.","我去年去了日本。"],["She has already read this book.","她已經讀過這本書了。"],["She read it last month.","她上個月讀了這本書。"]] },
        dialogue: [["Zoe","How long have you lived here?","你住在這裡多久了？"],["Leo","I have lived here since I was born.","我從出生就住在這裡了。"],["Zoe","I moved here two years ago.","我兩年前搬來這裡的。"],["Leo","Time really flies. We are in ninth grade now!","時間過得真快。我們現在九年級了！"]],
        copywork: [["I have lived in this town since I was little.","我從小就住在這個城鎮。"],["Three years ago, I started junior high.","三年前，我開始讀國中。"],["I have made many memories since then.","從那時候起，我留下了很多回憶。"],["Now, I am in my last year here.","現在，我在這裡的最後一年了。"]] },
      { title: "How Things Are Made", zh: "東西是怎麼做出來的", goal: "用被動語態（流程用途）做產品生命週期解說。", pattern: ["Paper is made from trees.", "The product is transported by truck."],
        vocab: [["process","過程","🔄"],["material","材料","🧱"],["produce","生產","🏭"],["transport","運送","🚚"],["consume","消耗","🍽️"],["factory","工廠","🏭"],["raw","原始的","🌾"],["package","包裝","📦"]],
        grammar: { concept: "被動語態(be + 過去分詞)常用來講流程，重點是「東西怎麼被做出來」，不強調是誰做的。",
          examples: [["Paper is made from trees.","紙是用樹做成的。"],["The juice is produced in this factory.","這果汁是在這間工廠生產的。"],["The boxes are transported by truck.","這些箱子是用卡車運送的。"],["This bread is baked every morning.","這種麵包每天早上都會烘烤。"]] },
        dialogue: [["Leo","How is chocolate made?","巧克力是怎麼做出來的？"],["Zoe","The beans are grown, then dried and processed.","可可豆先被種植，然後乾燥和加工。"],["Leo","Then it is transported to factories, right?","然後被運送到工廠，對嗎？"],["Zoe","Yes, and finally it is packaged and sold.","對，最後被包裝和販售。"]],
        copywork: [["Our class visited a factory this month.","這個月我們班參觀了一間工廠。"],["The raw material is collected from local farms.","原料是從當地農場收集來的。"],["It is processed and packaged in this building.","它在這棟建築物裡被加工和包裝。"],["Finally, the product is transported to stores.","最後，產品被運送到商店。"]] },
      { title: "News and Viewpoints", zh: "新聞與觀點", goal: "用引述觀點做兩方觀點中立摘要。", pattern: ["According to the report, the plan will start soon.", "She said that the project was successful."],
        vocab: [["report","報導","📰"],["according to","根據","📋"],["claim","主張","💬"],["quote","引用","💭"],["perspective","觀點","👁️"],["statement","陳述","🗣️"],["source","來源","📚"],["journalist","記者","🎤"]],
        grammar: { concept: "引述別人的話：according to + 來源；say/tell that + 句子，用來轉述別人的意見，不是自己親口說的。",
          examples: [["According to the news, the event was a success.","根據新聞，這個活動很成功。"],["She said that she was proud of the team.","她說她為這個團隊感到驕傲。"],["He told me that the project changed his mind.","他告訴我這個專案改變了他的想法。"],["According to the survey, most students agreed.","根據這份調查，大部分學生都同意。"]] },
        dialogue: [["Zoe","According to this article, our idea already exists elsewhere.","根據這篇文章，我們的點子在別的地方已經有了。"],["Leo","Really? What did the reporter say?","真的嗎？記者說了什麼？"],["Zoe","She said that similar projects helped other schools.","她說類似的專案幫助了其他學校。"],["Leo","That's good news. It means our idea can work too.","那是個好消息。表示我們的點子也可能行得通。"]],
        copywork: [["I read a report about students like us.","我讀了一篇關於像我們這樣學生的報導。"],["According to the article, small actions can create big change.","根據這篇文章，小小的行動可以帶來大改變。"],["The writer said that every school could do this.","作者說每間學校都可以這麼做。"],["This gave me more confidence in our project.","這讓我對我們的專案更有信心。"]] },
      { title: "Media and Misinformation", zh: "媒體與假訊息", goal: "複習事實/推論/意見；might/must，查核模擬素材並說明依據。", pattern: ["This headline might be misleading.", "We must verify the source first."],
        vocab: [["headline","標題","📰"],["context","背景","🗺️"],["reliable","可靠的","✅"],["misleading","誤導的","⚠️"],["verify","查證","🔍"],["fact-check","事實查核","✔️"],["bias","偏見","⚖️"],["trustworthy","值得信賴的","🤝"]],
        grammar: { concept: "複習：may/might/could 講可能性、must 講必須，用來評估一則新聞可不可信：可能誇大、一定要先查證。",
          examples: [["This headline might be exaggerated.","這個標題可能誇大了。"],["We must check the source before we believe it.","我們必須先查看來源才相信它。"],["This claim could be misleading without more context.","這個說法沒有更多背景資訊的話可能會誤導人。"],["A reliable source should show clear evidence.","一個可靠的來源應該要有清楚的證據。"]] },
        dialogue: [["Leo","This headline says something shocking. Is it true?","這個標題說了很驚人的事。是真的嗎？"],["Zoe","It might not be. We must check the source first.","可能不是。我們必須先查看來源。"],["Leo","You're right, the context is missing here.","你說得對，這裡少了背景資訊。"],["Zoe","Always verify before you share news.","分享新聞前一定要先查證。"]],
        copywork: [["This week, our class studied how to spot fake news.","這週我們班學習如何辨識假新聞。"],["A misleading headline might hide the real story.","一個誤導的標題可能隱藏了真正的故事。"],["We must always check the source and the context.","我們一定要總是查看來源和背景資訊。"],["Now I check facts before I believe a headline.","現在我在相信一個標題之前會先查證事實。"]] },
      { title: "Sustainable Cities", zh: "永續城市", goal: "複習整合，比較兩項城市方案。", pattern: ["If cities add more parks, life will improve.", "This policy could reduce traffic."],
        vocab: [["housing","住房","🏠"],["traffic","交通","🚦"],["access","使用權","🚪"],["green space","綠地","🌳"],["policy","政策","📜"],["sustainable","永續的","♻️"],["urban","都市的","🏙️"],["planning","規劃","🗺️"]],
        grammar: { concept: "複習 if 條件句和可能性語氣：討論城市政策的時候，常常要講「如果做了這個，可能會有這個結果」。",
          examples: [["If the city builds more parks, people will be healthier.","如果城市蓋更多公園，人們會更健康。"],["This policy could reduce traffic in the city center.","這項政策可能會減少市中心的交通。"],["If housing is cheaper, more families will move here.","如果住房更便宜，會有更多家庭搬來這裡。"],["Green spaces might improve air quality.","綠地可能會改善空氣品質。"]] },
        dialogue: [["Zoe","What would make our city better?","什麼會讓我們的城市變得更好？"],["Leo","If we had more green space, life would be nicer.","如果我們有更多綠地，生活會更好。"],["Zoe","This new policy could reduce traffic, too.","這項新政策也可能會減少交通。"],["Leo","I hope the city tries it soon.","我希望城市能盡快試試看。"]],
        copywork: [["Our class designed a plan for a better city.","我們班設計了一個讓城市更好的方案。"],["If there were more parks, people would be happier.","如果有更多公園，人們會更快樂。"],["This policy could make housing more affordable.","這項政策可能會讓住房更負擔得起。"],["I hope our ideas can help real cities someday.","我希望我們的點子有一天能幫助真實的城市。"]] },
      { title: "Global Connections", zh: "全球連結", goal: "複習關係子句＋跨段連接語，解釋一項全球連結。", pattern: ["This is a tradition which came from another country.", "However, our cultures are also very different."],
        vocab: [["trade","貿易","🚢"],["culture","文化","🎭"],["migration","遷移","🧳"],["influence","影響","🌟"],["exchange","交流","🔄"],["connect","連結","🔗"],["however","然而","↩️"],["therefore","因此","➡️"]],
        grammar: { concept: "複習關係子句，加上篇章銜接詞(however 轉折、therefore 因此、in addition 另外)，讓長文章讀起來更順。",
          examples: [["This is a custom which came from another culture.","這是一個來自另一個文化的習俗。"],["However, we also have our own traditions.","然而，我們也有自己的傳統。"],["Trade connects countries; therefore, cultures mix together.","貿易連結各國；因此，文化互相融合。"],["In addition, many words in our language come from other places.","另外，我們語言中很多字來自其他地方。"]] },
        dialogue: [["Leo","Where did this food tradition come from?","這個飲食傳統是從哪裡來的？"],["Zoe","It is a dish which traveled here through trade.","這是一道透過貿易傳到這裡的菜。"],["Leo","Interesting! However, we make it a bit differently now.","有趣！不過我們現在做法有點不一樣。"],["Zoe","Yes, and in addition, we added our own spices.","對，另外我們還加了自己的香料。"]],
        copywork: [["I researched a tradition which came from another country.","我研究了一個來自另一個國家的傳統。"],["It changed over time; therefore, it looks different today.","它隨著時間改變了；因此，現在看起來不一樣了。"],["However, its main idea is still the same.","不過，它的主要精神還是一樣的。"],["In addition, I learned how connected our world really is.","另外，我了解到我們的世界其實有多麼緊密相連。"]] },
      { title: "Research Studio", zh: "研究工作室", goal: "複習整合，完成專題草稿與同儕回饋。", pattern: ["Our data shows that the plan worked.", "Therefore, we reached this conclusion."],
        vocab: [["question","問題","❓"],["source","來源","📚"],["note","筆記","📝"],["data","數據","📊"],["conclusion","結論","🎯"],["evidence","證據","📋"],["method","方法","🔬"],["findings","發現","🔍"]],
        grammar: { concept: "複習：現在完成式講已經完成的研究步驟、被動語態講資料怎麼被蒐集、篇章銜接詞把發現連起來成一篇報告。",
          examples: [["We have collected data from three sources.","我們已經從三個來源蒐集了資料。"],["The survey was conducted last month.","這份調查是上個月做的。"],["Therefore, we can make this conclusion.","因此，我們可以得出這個結論。"],["In addition, our findings match other studies.","另外，我們的發現跟其他研究相符。"]] },
        dialogue: [["Zoe","Have you finished collecting your research data?","你收集研究資料完成了嗎？"],["Leo","Yes, the survey was done by fifty students.","對，這份調查是由五十個學生完成的。"],["Zoe","Therefore, what conclusion can we make?","因此，我們可以得出什麼結論？"],["Leo","Our findings show that most students agree with us.","我們的發現顯示大部分學生都同意我們。"]],
        copywork: [["This month, I have worked on my research project.","這個月，我一直在做我的研究專案。"],["My data was collected from students in three classes.","我的資料是從三個班級的學生蒐集的。"],["Therefore, I believe my conclusion is well supported.","因此，我相信我的結論有充分的支持。"],["In addition, I have learned to think like a researcher.","另外，我學會了像研究者一樣思考。"]] },
      { title: "Public Showcase", zh: "公開發表", goal: "總複習，完成 200-250 字專題＋2-3分鐘發表，回顧三年成長。", pattern: ["I have grown so much since my first day.", "This is the project which I am most proud of."],
        vocab: [["showcase","發表會","🎪"],["achievement","成就","🏆"],["growth","成長","🌱"],["journey","旅程","🧭"],["proud","驕傲的","✨"],["future","未來","🔮"],["farewell","告別","👋"],["graduate","畢業","🎓"]],
        grammar: { concept: "總複習：用現在完成式回顧三年的成長、用被動語態介紹作品怎麼做出來、用關係子句和連接詞把整個故事講完整。",
          examples: [["I have learned so much since I started junior high.","從我開始讀國中以來，我學到了好多。"],["This project was made with my whole team.","這個作品是跟我整個團隊一起做出來的。"],["This is the moment which I am most proud of.","這是我最感到驕傲的時刻。"],["Therefore, I am ready for high school.","因此，我準備好上高中了。"]] },
        dialogue: [["Leo","Can you believe we are graduating soon?","你能相信我們快畢業了嗎？"],["Zoe","I have grown so much since Lv.7. This showcase is the proof.","從七年級以來我成長好多。這場展覽就是證明。"],["Leo","This is the project which I am most proud of.","這是我最引以為傲的作品。"],["Zoe","Me too. Thank you for three amazing years.","我也是。謝謝這三年美好的時光。"]],
        copywork: [["Three years ago, I was a nervous new student.","三年前，我是個緊張的新生。"],["Since then, I have learned, failed, and grown.","從那時候起，我學習、失敗、也成長了。"],["This showcase is the project which I am most proud of.","這場展覽是我最引以為傲的作品。"],["Therefore, I am ready to start a new journey in high school.","因此，我準備好在高中展開新的旅程。"]] },
    ]
  },
];

// wL7/wL8 canonical 字彙中，wordbank.js 沒有收錄的補上中文義。
const EXTRA_ZH = {
  adventure: "冒險", almost: "幾乎", although: "雖然", around: "大約；周圍", asian: "亞洲的", australian: "澳洲的", band: "樂團", been: "是（be的過去分詞）", behind: "在……後面", bell: "鈴", belt: "皮帶", beside: "在……旁邊", bite: "咬", blackboard: "黑板", block: "街區；阻擋", bored: "感到無聊的", boring: "無聊的", born: "出生", bring: "帶來", britain: "英國", british: "英國的", build: "建造", business: "生意", can: "罐頭；能夠", canadian: "加拿大的", carry: "攜帶", center: "中心", cheat: "作弊", check: "檢查", chopsticks: "筷子", clear: "清楚的", clothes: "衣服", collect: "收集", comic: "漫畫", could: "可以（can的過去式）", country: "國家", dangerous: "危險的", done: "完成的", dozen: "一打", dream: "夢", drop: "掉落", england: "英格蘭", englishman: "英格蘭人", europe: "歐洲", european: "歐洲的", ever: "曾經", excited: "興奮的", exciting: "令人興奮的", excuse: "藉口", exercise: "運動", "french fries": "薯條", fries: "薯條", full: "飽的；滿的", future: "未來", german: "德國人；德國的", germany: "德國", gram: "公克", grass: "草", grow: "生長", guess: "猜", halloween: "萬聖節", handsome: "帥的", "hard-working": "努力工作的", healthy: "健康的", hers: "她的（東西）", hold: "拿著", illness: "疾病", interest: "興趣", interested: "感興趣的", interesting: "有趣的", island: "島", italy: "義大利", itself: "它自己", jeans: "牛仔褲", joy: "喜悅", "junior high school": "國中", just: "只是", keep: "保持", key: "鑰匙", kill: "殺", kilogram: "公斤", knee: "膝蓋", knock: "敲", korea: "韓國", korean: "韓國的", lake: "湖", lamp: "燈", land: "陸地", later: "稍後", laugh: "笑", leader: "領導者", lend: "借出", letter: "信", life: "生活", list: "清單", lose: "輸；失去", luggage: "行李", machine: "機器", mail: "郵件", matter: "事情", meal: "一餐", mean: "意思是", meat: "肉", menu: "菜單", might: "可能", mile: "英里", million: "百萬", mistake: "錯誤", modern: "現代的", moment: "時刻", mouse: "老鼠", myself: "我自己", next: "下一個", nobody: "沒有人", nod: "點頭", noise: "噪音", nothing: "什麼都沒有", ours: "我們的（東西）", pe: "體育", philippines: "菲律賓", "physical education": "體育", playground: "遊樂場；操場", popular: "受歡迎的", possible: "可能的", pound: "英鎊；磅", railway: "鐵路", recorder: "直笛", reporter: "記者", "republic of china": "中華民國", river: "河流", rome: "羅馬", russia: "俄羅斯", russian: "俄羅斯的", "san francisco": "舊金山", seat: "座位", shop: "商店", should: "應該", shoulder: "肩膀", show: "展示", simple: "簡單的", since: "自從", singapore: "新加坡", somebody: "某人", someone: "某人", something: "某事", somewhere: "某處", spend: "花費", strange: "奇怪的", stupid: "愚蠢的", surprised: "驚訝的", team: "隊伍", teenager: "青少年", than: "比", "thanksgiving day": "感恩節", theirs: "他們的（東西）", think: "想", though: "雖然", time: "時間", tourist: "觀光客", towel: "毛巾", traffic: "交通", trouble: "麻煩", typhoon: "颱風", until: "直到", wake: "醒來", way: "方式", without: "沒有", world: "世界", yet: "還沒", yours: "你的（東西）", yourself: "你自己",
  aids: "愛滋病", creative: "有創意的", experience: "經驗", explore: "探索", ld: "學習障礙（縮寫）", recently: "最近", talent: "才能", "youth day": "青年節",
};

const WORD_BANK_ZH = Object.fromEntries(WORDBANK.map(item => [item.en, item.zh]).filter(([, zh]) => zh));
const WEEK_ZH = Object.fromEntries(LEVELS.flatMap(level => level.weeks.flatMap(week => week.vocab.map(v => [v[0], v[1]]))));
function wordZh(word) { return EXTRA_ZH[word] || WEEK_ZH[word] || WORD_BANK_ZH[word] || "中文意思整理中"; }

// Lv.7 用 wL7 全部字；Lv.8/9 平分 wL8（extra 346 字），先簡單對半切（之後可再補教育部7000字表擴充，見 outline_final.md 開放問題）。
function canonicalWordsFor(levelId) {
  const all = new Set([...Object.keys(WORD_LEVELS), ...Object.keys(EXTRA_LEVELS)]);
  if (levelId === 7) return [...all].filter(w => wordLevel(w) === 7).sort();
  const wl8 = [...all].filter(w => wordLevel(w) === 8).sort();
  const half = Math.ceil(wl8.length / 2);
  return levelId === 8 ? wl8.slice(0, half) : wl8.slice(half);
}

const HEADER_COLOR = { 7: "#6a4c93", 8: "#1b7f79", 9: "#a83254" };
const CARD_COLOR = { 7: "#6a4c93", 8: "#166b66", 9: "#8f2b47" };

const CSS = `
body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;max-width:720px;margin:0 auto;padding:0 14px 60px;line-height:1.7}
header{color:#fff;text-align:center;padding:18px;border-radius:0 0 14px 14px;margin:0 -14px 12px}
header h1{margin:0;font-size:1.2rem} header p{margin:6px 0 0;font-size:.82rem;opacity:.92} header a{color:#fff;text-decoration:none;font-weight:700}
.card{background:#fff;border-radius:14px;padding:14px 16px;margin-top:14px;box-shadow:0 1px 4px rgba(0,0,0,.08)} .card h2{font-size:1rem;margin:0 0 8px}
.goal{font-size:.92rem;background:#eef1ff;border-radius:10px;padding:10px 14px;font-weight:700}
.pattern{font-size:1rem;background:#eef5ff;border-radius:10px;padding:10px 14px;font-weight:700;color:#1e5fb8;margin-top:8px}
.dlg{border-top:1px dashed #eee;padding:9px 0;font-size:.95rem;display:flex;align-items:center;gap:8px}.dlg b{min-width:60px}.dlg button,.playall{border:none;border-radius:8px;color:#fff;font-weight:700;padding:6px 12px;cursor:pointer}.dlg small{display:block;color:#888;margin-top:2px}.dlg .txt{flex:1}
.vocabgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-top:6px}.vcard{background:#fdf6e3;border:2px solid #f2d68a;border-radius:12px;text-align:center;padding:10px 6px;cursor:pointer}.vcard .em{font-size:1.8rem}.vcard b{display:block;margin-top:4px;font-size:.92rem}.vcard small{color:#888}
.grammar{border:2px solid #dcd3f5}.grammar .concept{font-size:.92rem;background:#f5f2ff;border-radius:10px;padding:10px 14px;margin-bottom:8px}
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
<div class="card"><h2 style="color:${color}">🔤 單字卡</h2><div class="vocabgrid">${week.vocab.map(v => `<div class="vcard" onclick="playAudio('${vocabAudio[v[0]]}')"><div class="em">${v[2]}</div><b>${esc(v[0])}</b><small>${esc(v[1])}</small></div>`).join("")}</div></div>
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
  const canonical = canonicalWordsFor(level.id);
  const usedWords = new Set(level.weeks.flatMap(w => w.vocab.map(v => v[0])));
  const pool = canonical.map(word => `<details class="pool-word${usedWords.has(word) ? " used" : ""}"><summary>${esc(word)}</summary><span>${esc(wordZh(word))}</span></details>`).join("");
  const color = HEADER_COLOR[level.id];
  const poolLabel = level.id === 7 ? "wL7" : `wL8${level.id === 8 ? "前半" : "後半"}`;
  return `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Lv.${level.id} ${esc(level.title)}</title><style>${CSS}.home{background:${color};color:#fff;text-align:center;padding:22px 16px;border-radius:0 0 14px 14px;margin:0 -14px 14px}.home h1{margin:0;font-size:1.35rem}.home a{color:#fff}.week{display:flex;align-items:center;gap:12px;background:#fff;border-radius:14px;padding:12px 14px;margin-top:10px;box-shadow:0 1px 4px rgba(0,0,0,.08);text-decoration:none;color:inherit}.week .num{background:#eef1ff;color:${color};border-radius:50%;width:32px;height:32px;text-align:center;line-height:32px;font-weight:700}.week b{display:block}.week small{color:#888}.pool-intro{color:#666;font-size:.88rem;margin:4px 0 10px}.poolgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}.pool-word{background:#fdf6e3;border:1px solid #f2d68a;border-radius:9px;min-height:38px}.pool-word.used{background:#f5f2ff;border:1px solid #c9b8ef}.pool-word summary{cursor:pointer;padding:6px 8px;font-weight:700;color:#243042;list-style-position:inside}.pool-word span{display:block;padding:0 8px 7px;color:${color};font-size:.85rem;font-weight:700}.legend{font-size:.8rem;color:#666;margin:8px 0}.legend .sw{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:4px;vertical-align:-1px}</style></head><body><header class="home"><h1>${level.icon} Lv.${level.id}：${esc(level.title)}</h1><p><a href="../index.html">← 國小～國中英語 9 級課程</a> · ${esc(level.zh)}</p></header><div class="card"><h2 style="color:${color}">📚 Lv.${level.id} 字彙池（${poolLabel}，${canonical.length} 字）</h2><p class="pool-intro">點一下單字，就會展開中文意思；再點一次可以收合。這是理解字彙池，每週主動練習仍以各週單字卡為主。</p><p class="legend"><span class="sw" style="background:#f5f2ff;border:1px solid #c9b8ef"></span>本級 8 週課程教過　<span class="sw" style="background:#fdf6e3;border:1px solid #f2d68a"></span>只在字彙池，還沒排進課程</p><div class="poolgrid">${pool}</div></div><div class="card"><h2 style="color:${color}">這一級要做到</h2><p>${esc(level.intro)}</p><p>每週都有文法小提示、聽力遊戲、獨立短文：先聽、手寫、朗讀，再背說。</p></div>${rows}</body></html>`;
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
    console.log(`Lv.${level.id} 字彙池: ${canonicalWordsFor(level.id).length} 字, audio items: ${Object.keys(items).length}`);
  }
  console.log("已產生 Lv.7 / Lv.8 / Lv.9 各 8 週頁面與音訊清單");
}

module.exports = { LEVELS, wordZh };
