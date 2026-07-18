// Lv.2 / Lv.3 課程產生器。
// 用法：node render_lv23.js
// 產生 k9/lv2、k9/lv3 的 8 週頁面與各自的音訊清單。
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
    id: 2, title: "生活與互動", zh: "國小二年級", icon: "🧩",
    intro: "用英文完成課堂、家庭、食物、地點和日常互動。",
    weeks: [
      { title: "Classroom Actions", zh: "課堂動作", goal: "聽懂並使用 6 個課堂指令，完成小老師任務。", pattern: ["Please open your book.", "Can I help?"], vocab: [["open","打開","📖"],["close","關上","🔒"],["read","讀","👀"],["write","寫","✏️"],["listen","聽","👂"],["help","幫忙","🤝"],["book","書","📘"],["teacher","老師","🧑‍🏫"]], dialogue: [["Mia","Please open your book.","請打開你的書。"],["Leo","OK. I am ready.","好的。我準備好了。"],["Mia","Can I help you write?","我可以幫你寫嗎？"],["Leo","Yes, please. Thank you!","可以，謝謝你！"]], copywork: [["Our class is ready.","我們的班級準備好了。"],["We listen to the teacher.","我們聽老師說。"],["We read and write together.","我們一起讀和寫。"],["Then we close our books.","然後我們把書關上。"]] },
      { title: "Clothes and Weather", zh: "衣服與天氣", goal: "看天氣選衣服，說出今天穿什麼。", pattern: ["I wear my ___." , "It is sunny / rainy / cold."], vocab: [["shirt","襯衫","👕"],["shoes","鞋子","👟"],["coat","外套","🧥"],["sunny","晴朗的","☀️"],["rainy","下雨的","🌧️"],["cold","冷的","🥶"],["hat","帽子","🧢"],["warm","溫暖的","🔥"]], dialogue: [["Nora","It is rainy today.","今天下雨。"],["Ben","I wear my coat and shoes.","我穿外套和鞋子。"],["Nora","Is it cold outside?","外面冷嗎？"],["Ben","Yes. Wear your hat, too.","對。也戴上你的帽子。"]], copywork: [["The morning is cold and rainy.","早上又冷又下雨。"],["I wear my warm coat.","我穿上溫暖的外套。"],["I put on my shoes and hat.","我穿鞋子、戴帽子。"],["Now I am ready to go.","現在我準備好出門了。"]] },
      { title: "My Home", zh: "我的家", goal: "用 Where is...? 找到家裡的物品。", pattern: ["Where is the ___?", "It is in / on the ___."], vocab: [["room","房間","🚪"],["bed","床","🛏️"],["table","桌子","🪑"],["door","門","🚪"],["kitchen","廚房","🍳"],["chair","椅子","🪑"],["box","盒子","📦"],["home","家","🏠"]], dialogue: [["Dad","Where is my book?","我的書在哪裡？"],["Amy","It is on the table.","它在桌子上。"],["Dad","Where is the blue box?","藍色盒子在哪裡？"],["Amy","It is in your room.","它在你的房間裡。"]], copywork: [["Our home has a small kitchen.","我們家有一間小廚房。"],["The table is next to the door.","桌子在門旁邊。"],["My book is in a blue box.","我的書在藍色盒子裡。"],["I keep my room clean.","我保持房間乾淨。"]] },
      { title: "Food and Drinks", zh: "食物與飲料", goal: "在簡單點餐情境中說出想要的食物。", pattern: ["I want ___.", "Here you are."], vocab: [["bread","麵包","🍞"],["noodles","麵","🍜"],["juice","果汁","🧃"],["hungry","餓的","😋"],["thirsty","渴的","🥤"],["rice","飯","🍚"],["water","水","💧"],["please","請","🙏"]], dialogue: [["Waiter","Hello. What do you want?","你好。你想要什麼？"],["Kai","I want noodles, please.","我想要麵，謝謝。"],["Waiter","Are you thirsty?","你渴嗎？"],["Kai","Yes. I want some juice.","對。我想要一些果汁。"]], copywork: [["I am hungry after school.","我放學後很餓。"],["I want rice and bread, please.","我想要飯和麵包。"],["My brother wants some juice.","我弟弟想要一些果汁。"],["We say thank you for our food.","我們為食物說謝謝。"]] },
      { title: "Pets and Abilities", zh: "寵物與能力", goal: "用 can / can't 說出動物會做什麼。", pattern: ["A rabbit can jump.", "A turtle can't fly."], vocab: [["rabbit","兔子","🐰"],["turtle","烏龜","🐢"],["run","跑","🏃"],["jump","跳","⬆️"],["swim","游泳","🏊"],["fly","飛","🪽"],["fast","快的","⚡"],["slow","慢的","🐌"]], dialogue: [["Lily","Can a rabbit jump?","兔子會跳嗎？"],["Tom","Yes, it can jump.","會，牠會跳。"],["Lily","Can a turtle fly?","烏龜會飛嗎？"],["Tom","No, it can't. It can swim.","不會。牠會游泳。"]], copywork: [["My pet turtle is slow.","我的寵物烏龜很慢。"],["It can swim in a small pool.","牠會在小水池裡游泳。"],["My rabbit can run and jump.","我的兔子會跑也會跳。"],["Both pets are fun to watch.","兩隻寵物都很有趣。"]] },
      { title: "Days and Routines", zh: "星期與作息", goal: "用星期、早上和晚上說出日常活動。", pattern: ["I play in the afternoon.", "I sleep at night."], vocab: [["Monday","星期一","1️⃣"],["Tuesday","星期二","2️⃣"],["today","今天","📅"],["morning","早上","🌅"],["night","晚上","🌙"],["school","學校","🏫"],["play","玩","⚽"],["sleep","睡覺","😴"]], dialogue: [["Eli","What do you do in the morning?","你早上做什麼？"],["Sara","I go to school.","我去學校。"],["Eli","What do you do at night?","你晚上做什麼？"],["Sara","I read and sleep.","我讀書然後睡覺。"]], copywork: [["On Monday, I go to school.","星期一我去學校。"],["I play with my friends in the afternoon.","下午我和朋友玩。"],["At night, I read a book.","晚上我讀一本書。"],["Then I sleep well.","然後我好好睡覺。"]] },
      { title: "Places Nearby", zh: "附近的地方", goal: "看地圖問路，說出要去的地方。", pattern: ["Where is the park?", "Let's go to the library."], vocab: [["park","公園","🌳"],["store","商店","🏪"],["school","學校","🏫"],["home","家","🏠"],["library","圖書館","📚"],["street","街道","🛣️"],["go","去","🚶"],["near","附近","📍"]], dialogue: [["May","Where is the library?","圖書館在哪裡？"],["Jay","It is near the park.","它在公園附近。"],["May","Let's go to the library.","我們去圖書館吧。"],["Jay","Great! I want a book.","太好了！我想要一本書。"]], copywork: [["The park is near my home.","公園在我家附近。"],["The library is across the street.","圖書館在街道對面。"],["I walk there with my dad.","我和爸爸走路去那裡。"],["We read together after lunch.","午餐後我們一起閱讀。"]] },
      { title: "My Helpful Day", zh: "我的助人日", goal: "整合 I can... 和 I help... 完成生活情境對話。", pattern: ["I can help you.", "I help at home."], vocab: [["help","幫忙","🤝"],["clean","清理","🧹"],["carry","搬","📦"],["share","分享","🎁"],["give","給","🫴"],["friend","朋友","🧑‍🤝‍🧑"],["home","家","🏠"],["together","一起","👨‍👩‍👧‍👦"]], dialogue: [["Mom","Can you help me?","你可以幫我嗎？"],["Owen","Yes. I can carry the box.","可以。我會搬盒子。"],["Mom","Thank you for sharing.","謝謝你分享。"],["Owen","We can clean together.","我們可以一起清理。"]], copywork: [["Today I help my family at home.","今天我在家幫助家人。"],["I carry a box and clean the table.","我搬盒子並清理桌子。"],["Then I share my books with my sister.","然後我和妹妹分享我的書。"],["Helping makes our day happy.","幫忙讓我們的一天很快樂。"]] },
    ]
  },
  {
    id: 3, title: "事件、時間與簡短故事", zh: "國小三年級", icon: "📚",
    intro: "把英文從單句拉長成一段有時間、原因和順序的故事。",
    weeks: [
      { title: "My Week", zh: "我的一週", goal: "用星期和時間說出一週中的活動。", pattern: ["On Monday, I...", "Tomorrow, I..."], vocab: [["Monday","星期一","1️⃣"],["Tuesday","星期二","2️⃣"],["Wednesday","星期三","3️⃣"],["Friday","星期五","5️⃣"],["today","今天","📅"],["tomorrow","明天","➡️"],["busy","忙碌的","🏃"],["week","星期；一週","🗓️"]], dialogue: [["Nina","What do you do on Monday?","你星期一做什麼？"],["Evan","I have music class.","我有音樂課。"],["Nina","Are you busy tomorrow?","你明天忙嗎？"],["Evan","Yes. I have a busy week.","對。我有忙碌的一週。"]], copywork: [["On Monday, I have music class.","星期一我有音樂課。"],["On Wednesday, I play with my team.","星期三我和隊友一起玩。"],["Today I am busy, but I am happy.","今天我很忙，但我很開心。"],["Tomorrow is a rest day at home.","明天是在家休息的一天。"]] },
      { title: "Hobbies", zh: "興趣", goal: "用 like + 動作 ing 說出興趣，完成同伴訪談。", pattern: ["I like drawing.", "Do you like music?"], vocab: [["draw","畫畫","🎨"],["dance","跳舞","💃"],["sing","唱歌","🎤"],["collect","收藏","🧺"],["game","遊戲","🎮"],["music","音樂","🎵"],["read","閱讀","📖"],["hobby","興趣","⭐"]], dialogue: [["Grace","What is your hobby?","你的興趣是什麼？"],["Noah","I like drawing and singing.","我喜歡畫畫和唱歌。"],["Grace","Do you like music?","你喜歡音樂嗎？"],["Noah","Yes. I listen to music every day.","喜歡。我每天聽音樂。"]], copywork: [["My favorite hobby is drawing.","我最喜歡的興趣是畫畫。"],["I like drawing animals and places.","我喜歡畫動物和地方。"],["My friend likes dancing.","我的朋友喜歡跳舞。"],["We share our hobbies after school.","放學後我們分享自己的興趣。"]] },
      { title: "Around Town", zh: "城鎮一角", goal: "用地點和 next to 說明地圖上的位置。", pattern: ["The bank is next to the market.", "Where is the station?"], vocab: [["hospital","醫院","🏥"],["station","車站","🚉"],["market","市場","🛒"],["bank","銀行","🏦"],["street","街道","🛣️"],["next to","在旁邊","↔️"],["across","在對面","🔁"],["town","城鎮","🏙️"]], dialogue: [["Ivy","Where is the market?","市場在哪裡？"],["Sam","It is next to the bank.","它在銀行旁邊。"],["Ivy","Is the station across the street?","車站在街道對面嗎？"],["Sam","Yes, it is near the hospital.","對，它在醫院附近。"]], copywork: [["Our town has a busy market.","我們的城鎮有一個熱鬧的市場。"],["The bank is next to the market.","銀行在市場旁邊。"],["The station is across the street.","車站在街道對面。"],["People walk safely around town.","人們安全地在城鎮裡走路。"]] },
      { title: "What Is Happening?", zh: "現在發生什麼事？", goal: "看圖片用現在進行式說出正在發生的事。", pattern: ["He is walking.", "They are waiting."], vocab: [["walking","正在走路","🚶"],["eating","正在吃","🍽️"],["reading","正在閱讀","📖"],["waiting","正在等","⏳"],["running","正在跑","🏃"],["talking","正在說話","💬"],["now","現在","⏱️"],["picture","圖片","🖼️"]], dialogue: [["Ella","What is the boy doing?","男孩正在做什麼？"],["Max","He is reading a picture book.","他正在讀圖畫書。"],["Ella","What are the girls doing?","女孩們正在做什麼？"],["Max","They are waiting and talking.","她們正在等候和說話。"]], copywork: [["Look at the picture.","看看這張圖片。"],["A boy is walking by the river.","一個男孩正在河邊走路。"],["Two girls are reading under a tree.","兩個女孩正在樹下閱讀。"],["Everyone is busy now.","現在每個人都很忙。"]] },
      { title: "Feelings and Reasons", zh: "感受與原因", goal: "用 because 說明自己的情緒和原因。", pattern: ["I feel happy because...", "She feels tired because..."], vocab: [["happy","開心的","😊"],["sad","難過的","😢"],["tired","累的","😴"],["excited","興奮的","🤩"],["afraid","害怕的","😨"],["because","因為","💡"],["feel","感覺","💛"],["reason","原因","🔎"]], dialogue: [["Mia","How do you feel today?","你今天感覺如何？"],["Leo","I feel excited because it is my birthday.","我很興奮，因為今天是我的生日。"],["Mia","Why is Ben tired?","Ben 為什麼累？"],["Leo","He feels tired because he ran fast.","他很累，因為他跑得很快。"]], copywork: [["I feel happy because my friend is here.","我很開心，因為我的朋友在這裡。"],["My sister feels tired after the game.","我妹妹遊戲後覺得很累。"],["She rests because she needs a break.","她休息，因為她需要休息一下。"],["We talk about our feelings.","我們談談自己的感受。"]] },
      { title: "A Small Problem", zh: "一個小問題", goal: "用 First, Then, Finally 排出並口述圖片故事。", pattern: ["First... Then... Finally...", "I ask for help."], vocab: [["lost","迷路；遺失的","❓"],["find","找到","🔍"],["give","給","🫴"],["call","打電話","📞"],["ask","詢問","🙋"],["carry","攜帶；搬","👜"],["first","首先","1️⃣"],["finally","最後","🏁"]], dialogue: [["Ben","I cannot find my bag.","我找不到我的書包。"],["Amy","First, ask the teacher for help.","首先，請老師幫忙。"],["Ben","Then I will call my dad.","然後我會打電話給爸爸。"],["Amy","Finally, we find it under the chair!","最後，我們在椅子下找到它了！"]], copywork: [["First, I lose my blue bag.","首先，我弄丟我的藍色書包。"],["Then I ask a teacher for help.","然後我請老師幫忙。"],["We look under the desk together.","我們一起在桌子下找。"],["Finally, I find my bag.","最後，我找到我的書包。"]] },
      { title: "Nature and Weather", zh: "自然與天氣", goal: "用 I can see... 和 It is... 做 30 秒氣象報告。", pattern: ["I can see...", "It is windy / rainy."], vocab: [["cloud","雲","☁️"],["wind","風","💨"],["rain","雨","🌧️"],["tree","樹","🌳"],["river","河流","🏞️"],["season","季節","🍂"],["sunny","晴朗的","☀️"],["windy","有風的","🌬️"]], dialogue: [["Ava","What can you see outside?","你在外面看到什麼？"],["Finn","I can see dark clouds and a river.","我看到烏雲和一條河。"],["Ava","Is it windy today?","今天風大嗎？"],["Finn","Yes. The trees are moving.","對。樹正在搖動。"]], copywork: [["I can see clouds above the river.","我看到雲在河流上方。"],["The wind is moving the trees.","風正在吹動樹。"],["Rain is coming in this season.","這個季節雨要來了。"],["We watch the sky and stay safe.","我們觀察天空並保持安全。"]] },
      { title: "My Day Story", zh: "我的一天故事", goal: "用時間、動作、情緒和 because 寫出 5～6 句小故事。", pattern: ["First... Then... because...", "At the end..."], vocab: [["first","首先","1️⃣"],["then","然後","➡️"],["finally","最後","🏁"],["morning","早上","🌅"],["afternoon","下午","🌞"],["evening","傍晚","🌆"],["story","故事","📚"],["end","結尾","🔚"]], dialogue: [["Sara","Tell me about your day.","告訴我你的一天。"],["Tom","First, I walk to school.","首先，我走路去學校。"],["Sara","What happens then?","然後發生什麼事？"],["Tom","Finally, I go home because I am tired.","最後，我回家，因為我累了。"]], copywork: [["First, I eat breakfast in the morning.","首先，我早上吃早餐。"],["Then I learn and play at school.","然後我在學校學習和玩耍。"],["In the afternoon, I help my friend.","下午我幫助我的朋友。"],["Finally, I go home because I am tired.","最後，我回家，因為我累了。"]] },
    ]
  }
];

// wL2/wL3 的 canonical 字彙有些不會出現在每週單字卡，這裡補上字彙池所需的基礎中文義。
const EXTRA_ZH = {
  air: "空氣", and: "和", bee: "蜜蜂", birthday: "生日", box: "盒子", but: "但是", candy: "糖果", cap: "帽子", classmate: "同學", clock: "時鐘", coffee: "咖啡", cola: "可樂", coke: "可樂", cow: "牛", dear: "親愛的", doll: "娃娃", english: "英語", flower: "花", friendly: "友善的", fruit: "水果", ham: "火腿", hello: "哈囉", hi: "嗨", its: "它的", on: "在……上", picnic: "野餐", please: "請", real: "真的；真實的", roc: "巨鳥（神話）", sandwich: "三明治", sea: "海", sheep: "綿羊", ship: "船", shy: "害羞的", singer: "歌手", sofa: "沙發", son: "兒子", song: "歌曲", study: "讀書；學習", table: "桌子", thank: "感謝", these: "這些", those: "那些", under: "在……下面", usa: "美國", very: "非常", woman: "女人",
  "a.m.": "上午", about: "關於；大約", after: "在……之後", ago: "以前", america: "美國", animal: "動物", any: "任何的", beef: "牛肉", bicycle: "腳踏車", bike: "腳踏車", breakfast: "早餐", chalk: "粉筆", child: "小孩", computer: "電腦", cookie: "餅乾", cooky: "古怪的；瘋狂的", cry: "哭", dad: "爸爸", daddy: "爸爸", die: "死亡", "dining room": "餐廳", dinner: "晚餐", down: "向下；下方", drive: "開車", dry: "乾的", every: "每一個", feel: "感覺", fly: "飛", friend: "朋友", "good-bye": "再見", goodbye: "再見", "hot dog": "熱狗", house: "房子", ice: "冰", "ice cream": "冰淇淋", into: "進入……裡面", join: "加入", kick: "踢", kiss: "親吻", kitchen: "廚房", kite: "風箏", learn: "學習", need: "需要", "o'clock": "……點鐘", "p.m.": "下午", really: "真的；非常", salt: "鹽", spell: "拼字", star: "星星", start: "開始", telephone: "電話", phone: "電話", there: "那裡", together: "一起", train: "火車", trip: "旅行", truck: "卡車", try: "嘗試", up: "向上；上方", wait: "等待", wear: "穿戴", when: "何時；當……時", where: "哪裡", why: "為什麼", with: "和；與", word: "單字", worker: "工作者；工人", true: "真的；正確的"
};

const WORD_BANK_ZH = Object.fromEntries(WORDBANK.map(item => [item.en, item.zh]).filter(([, zh]) => zh));
const WEEK_ZH = Object.fromEntries(LEVELS.flatMap(level => level.weeks.flatMap(week => week.vocab.map(v => [v[0], v[1]]))));
function wordZh(word) { return EXTRA_ZH[word] || WEEK_ZH[word] || WORD_BANK_ZH[word] || "中文意思整理中"; }

const CSS = `
body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;max-width:720px;margin:0 auto;padding:0 14px 60px;line-height:1.7}
header{color:#fff;text-align:center;padding:18px;border-radius:0 0 14px 14px;margin:0 -14px 12px} header.l2{background:#5b7cfa} header.l3{background:#9b59b6}
header h1{margin:0;font-size:1.2rem} header p{margin:6px 0 0;font-size:.82rem;opacity:.92} header a{color:#fff;text-decoration:none;font-weight:700}
.card{background:#fff;border-radius:14px;padding:14px 16px;margin-top:14px;box-shadow:0 1px 4px rgba(0,0,0,.08)} .card h2{font-size:1rem;color:#4055a8;margin:0 0 8px}
.l3card h2{color:#7b3f91}.goal{font-size:.92rem;background:#eef1ff;border-radius:10px;padding:10px 14px;font-weight:700;color:#4055a8}.l3goal{background:#f6edfa;color:#7b3f91}
.pattern{font-size:1rem;background:#eef5ff;border-radius:10px;padding:10px 14px;font-weight:700;color:#1e5fb8;margin-top:8px}.dlg{border-top:1px dashed #eee;padding:9px 0;font-size:.95rem;display:flex;align-items:center;gap:8px}.dlg b{min-width:60px}.dlg button,.playall{border:none;border-radius:8px;background:#5b7cfa;color:#fff;font-weight:700;padding:6px 12px;cursor:pointer}.dlg small{display:block;color:#888;margin-top:2px}.dlg .txt{flex:1}
.vocabgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;margin-top:6px}.vcard{background:#fdf6e3;border:2px solid #f2d68a;border-radius:12px;text-align:center;padding:10px 6px;cursor:pointer}.vcard .em{font-size:1.8rem}.vcard b{display:block;margin-top:4px;font-size:.92rem}.vcard small{color:#888}
#gameArea{margin-top:8px}#gameArea button.gcard{padding:12px 10px;border:2px solid #d9e2ec;border-radius:12px;background:#fff;font-weight:700;cursor:pointer;margin:4px;font-size:1rem}#gameArea button.gcard.correct{border-color:#2fbf71;background:#d9f7e8}#gameArea button.gcard.wrong{border-color:#ef476f;background:#fde0e8}#gplay{border:none;border-radius:10px;background:#2f80ed;color:#fff;font-weight:700;padding:9px 16px;cursor:pointer;margin-bottom:8px}#gstatus{font-weight:700;margin-top:8px;min-height:1.4em}
.copywork{border:2px solid #f2d68a;background:#fffdf4}.copywork h2{color:#b5651d}.copywork .steps{margin:8px 0 10px;padding-left:22px}.copy-line{border-top:1px dashed #ddd;padding:8px 0;font-size:1rem}.copy-line b{display:block}.copy-line small{color:#777}.speak-check{background:#eafff2;border-radius:10px;padding:9px 12px;color:#187a48;font-weight:700;margin-top:10px}.donebox{text-align:center}.donebox label{font-weight:700;font-size:.9rem}.nav2{display:flex;justify-content:space-between;margin-top:16px;font-size:.85rem}.nav2 a{color:#4055a8;text-decoration:none;font-weight:700;background:#fff;border-radius:10px;padding:9px 14px;box-shadow:0 1px 4px rgba(0,0,0,.08)}
`;

function renderWeek(level, week, index) {
  const prefix = `l${level.id}w${index + 1}`;
  const vocabAudio = Object.fromEntries(week.vocab.map(v => [v[0], audioName(level.id, index + 1, "v", slug(v[0]))]));
  const dlgAudio = week.dialogue.map((_, i) => audioName(level.id, index + 1, "d", i));
  const copyAudio = audioName(level.id, index + 1, "copy");
  const vocabMap = Object.fromEntries(week.vocab.map(v => [v[0], { en: v[0], emoji: v[2] }]));
  const body = `<div class="card"><div class="goal ${level.id === 3 ? "l3goal" : ""}">🎯 ${esc(week.goal)}</div>${week.pattern.map(p => `<div class="pattern">${esc(p)}</div>`).join("")}</div>
<div class="card ${level.id === 3 ? "l3card" : ""}"><h2>🎧 情境對話</h2><button class="playall" onclick="playDialogue()">▶️ 全部播放</button>${week.dialogue.map((d, i) => `<div class="dlg"><b>${esc(d[0])}</b><button onclick="playAudio('${dlgAudio[i]}')">🔊</button><span class="txt">${esc(d[1])}<small>${esc(d[2])}</small></span></div>`).join("")}</div>
<div class="card ${level.id === 3 ? "l3card" : ""}"><h2>🔤 單字卡</h2><div class="vocabgrid">${week.vocab.map(v => `<div class="vcard" onclick="playAudio('${vocabAudio[v[0]]}')"><div class="em">${v[2]}</div><b>${esc(v[0])}</b><small>${esc(v[1])}</small></div>`).join("")}</div></div>
<div class="card ${level.id === 3 ? "l3card" : ""}"><h2>🎮 聽力遊戲</h2><p>🔊 聽單字，點對的卡片</p><button id="gplay" onclick="startGame()">▶️ 開始</button><div id="gameArea"></div><div id="gstatus"></div></div>
<div class="card copywork"><h2>✍️ 本週獨立短文：手寫＋口說</h2><p>這篇短文不在上方對話中。請抄在實體筆記本上，邊寫邊小聲念，再朗讀和背說。</p><button class="playall" onclick="playAudio('${copyAudio}')">🔊 聽整篇示範</button><ol class="steps"><li>先聽整篇 2 次。</li><li>每句手寫 1 次，邊寫邊念。</li><li>看著筆記本朗讀 3 次。</li><li>闔上頁面，試著完整背說 1 次。</li></ol>${week.copywork.map(p => `<div class="copy-line"><b>${esc(p[0])}</b><small>${esc(p[1])}</small></div>`).join("")}<div class="speak-check">完成標準：能不看網頁，順順念完自己的手寫短文。</div></div>
<div class="card donebox"><label><input type="checkbox" id="doneCb" onchange="toggleDone(this)"> ✅ 這週完成了</label></div>`;
  const previous = index ? `<a href="week${index}.html">← Week ${index}</a>` : `<a href="index.html">← ${level.title}</a>`;
  const next = index < 7 ? `<a href="week${index + 2}.html">Week ${index + 2} →</a>` : `<a href="index.html">完成 ${level.title} 🎉</a>`;
  return `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${level.icon} Lv.${level.id} Week ${index + 1}：${esc(week.title)}</title><style>${CSS}</style></head><body><header class="l${level.id}"><h1>${level.icon} Lv.${level.id} Week ${index + 1}：${esc(week.title)}</h1><p><a href="index.html">← ${esc(level.title)}</a> · ${esc(week.zh)}</p></header>${body}<div class="nav2"><span>${previous}</span><span>${next}</span></div><script>
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
  const pool = canonical.map(word => `<details class="pool-word"><summary>${esc(word)}</summary><span>${esc(wordZh(word))}</span></details>`).join("");
  return `<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Lv.${level.id} ${esc(level.title)}</title><style>${CSS}.home{background:${level.id === 2 ? "#5b7cfa" : "#9b59b6"};color:#fff;text-align:center;padding:22px 16px;border-radius:0 0 14px 14px;margin:0 -14px 14px}.home h1{margin:0;font-size:1.35rem}.home a{color:#fff}.week{display:flex;align-items:center;gap:12px;background:#fff;border-radius:14px;padding:12px 14px;margin-top:10px;box-shadow:0 1px 4px rgba(0,0,0,.08);text-decoration:none;color:inherit}.week .num{background:#eef1ff;color:#4055a8;border-radius:50%;width:32px;height:32px;text-align:center;line-height:32px;font-weight:700}.week b{display:block}.week small{color:#888}.pool-intro{color:#666;font-size:.88rem;margin:4px 0 10px}.poolgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}.pool-word{background:#fdf6e3;border:1px solid #f2d68a;border-radius:9px;min-height:38px}.pool-word summary{cursor:pointer;padding:6px 8px;font-weight:700;color:#243042;list-style-position:inside}.pool-word span{display:block;padding:0 8px 7px;color:#4055a8;font-size:.85rem;font-weight:700}</style></head><body><header class="home"><h1>${level.icon} Lv.${level.id}：${esc(level.title)}</h1><p><a href="../index.html">← 國小～國中英語 9 級課程</a> · ${esc(level.zh)}</p></header><div class="card"><h2>📚 Lv.${level.id} 字彙池（wL${level.id}，${canonical.length} 字）</h2><p class="pool-intro">點一下單字，就會展開中文意思；再點一次可以收合。這是理解字彙池，每週主動練習仍以各週單字卡為主。</p><div class="poolgrid">${pool}</div></div><div class="card"><h2>這一級要做到</h2><p>${esc(level.intro)}</p><p>每週都有獨立短文：先聽、手寫、朗讀，再背說。</p></div>${rows}</body></html>`;
}

for (const level of LEVELS) {
  const out = path.join(ROOT, `lv${level.id}`); fs.mkdirSync(path.join(out, "audio"), { recursive: true });
  level.weeks.forEach((week, i) => fs.writeFileSync(path.join(out, `week${i + 1}.html`), renderWeek(level, week, i), "utf8"));
  fs.writeFileSync(path.join(out, "index.html"), renderIndex(level), "utf8");
  const items = {};
  level.weeks.forEach((week, i) => {
    week.vocab.forEach(v => { items[audioName(level.id, i + 1, "v", slug(v[0]))] = v[0]; });
    week.dialogue.forEach((d, j) => { items[audioName(level.id, i + 1, "d", j)] = d[1]; });
    items[audioName(level.id, i + 1, "copy")] = week.copywork.map(p => p[0]).join(" ");
  });
  fs.writeFileSync(path.join(__dirname, `audio_lv${level.id}.json`), JSON.stringify({ outdir: path.join(out, "audio").replace(/\\/g, "/"), voice: "af_heart", speed: 0.85, items }, null, 2), "utf8");
  const canonicalCount = Object.values(WORD_LEVELS).filter(sourceLevel => sourceLevel === level.id).length;
  console.log(`Lv.${level.id} canonical wL${level.id}: ${canonicalCount} 字`);
}
console.log("已產生 Lv.2 / Lv.3 各 8 週頁面與音訊清單");
