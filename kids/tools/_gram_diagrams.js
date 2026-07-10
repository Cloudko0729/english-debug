// 文法根基課程 概念圖（inline SVG，key = unit id）
// 設計依 Codex 覆審規格：每單元一張、文字精準、小學生視覺。
const F = `font-family="Arial,'Noto Sans TC',sans-serif"`;
const box = (x, y, w, h, fill, stroke, rx = 12) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
const txt = (x, y, s, size = 15, fill = "#243042", w = "700", anchor = "middle") =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${w}" text-anchor="${anchor}" ${F}>${s}</text>`;
const arrow = (x1, y1, x2, y2, c = "#8a93b8") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3" marker-end="url(#ar)"/>`;
const DEFS = `<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#8a93b8"/></marker></defs>`;
const wrap = (inner, h = 320) => `<svg viewBox="0 0 660 ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${DEFS}${inner}</svg>`;

const DIAGRAMS = {

u1: wrap(
  box(20, 40, 170, 90, "#e6f6ec", "#2fbf71") + txt(105, 70, "誰？", 18, "#187a48") + txt(105, 100, "The dog 🐶", 16, "#187a48") +
  box(20, 190, 170, 90, "#eaf3ff", "#2f80ed") + txt(105, 220, "做什麼？", 18, "#1e5fb8") + txt(105, 250, "runs 🏃", 16, "#1e5fb8") +
  arrow(195, 85, 250, 130) + arrow(195, 235, 250, 190) +
  box(255, 110, 150, 100, "#fff3e0", "#f2a900", 16) + txt(330, 145, "🏗️ 句子工廠", 17, "#8a5a00") + txt(330, 175, "主詞＋動詞", 15, "#8a5a00") +
  arrow(410, 160, 460, 160) +
  box(470, 20, 175, 62, "#fff", "#2fbf71") + txt(557, 44, "直述 The dog runs.", 13.5) + txt(557, 66, "說一件事", 12, "#888", "400") +
  box(470, 96, 175, 62, "#fff", "#2f80ed") + txt(557, 120, "疑問 Does it run?", 13.5) + txt(557, 142, "問問題", 12, "#888", "400") +
  box(470, 172, 175, 62, "#fff", "#b5651d") + txt(557, 196, "命令 Run!", 13.5) + txt(557, 218, "叫人做事（誰＝you 藏起來）", 11, "#888", "400") +
  box(470, 248, 175, 62, "#fff", "#7c4dca") + txt(557, 272, "驚嘆 How fast!", 13.5) + txt(557, 294, "哇的感覺", 12, "#888", "400")
),

u2: wrap(
  txt(160, 34, "一個 🧍", 18, "#1e5fb8") +
  box(30, 50, 260, 110, "#eaf3ff", "#2f80ed") +
  txt(160, 90, "a dog · a cat · an apple", 15) + txt(160, 120, "an ➜ 母音開頭 (a·e·i·o·u)", 13, "#1e5fb8") + txt(160, 145, "第一次提到用 a / an", 13, "#666", "400") +
  txt(160, 205, "很多個 🧍🧍🧍", 18, "#187a48") +
  box(30, 220, 260, 90, "#e6f6ec", "#2fbf71") +
  txt(160, 258, "dogs · cats · apples", 15) + txt(160, 288, "字尾 +s / +es", 13, "#187a48") +
  box(340, 50, 300, 260, "#fff7dc", "#f2a900", 16) + txt(490, 85, "🏷️ the 貼紙", 18, "#8a5a00") +
  txt(490, 125, "你我都知道是「那一個」時貼上", 14, "#555", "400") +
  txt(490, 165, "I see a dog.  ➜ 第一次講", 14) +
  txt(490, 195, "The dog is cute. ➜ 就是剛那隻", 14) +
  txt(490, 245, "太陽月亮只有一個 ➜ the sun", 14) +
  txt(490, 275, "the moon 🌙", 14)
),

u3: wrap(
  txt(330, 30, "同一個「我」，位置不同就換衣服 🎭", 16) +
  box(30, 50, 140, 210, "#eaf3ff", "#2f80ed") + txt(100, 82, "👕 I", 20, "#1e5fb8") + txt(100, 112, "當主詞", 14) + txt(100, 145, "在動詞前面", 12, "#666", "400") + txt(100, 190, "I like cats.", 14, "#1e5fb8") +
  box(190, 50, 140, 210, "#e6f6ec", "#2fbf71") + txt(260, 82, "🧥 me", 20, "#187a48") + txt(260, 112, "當受詞", 14) + txt(260, 145, "在動詞後面", 12, "#666", "400") + txt(260, 190, "Look at me!", 14, "#187a48") +
  box(350, 50, 140, 210, "#fff3e0", "#f2a900") + txt(420, 82, "🎽 my", 20, "#a05c10") + txt(420, 112, "我的＋東西", 14) + txt(420, 145, "後面要接名詞", 12, "#666", "400") + txt(420, 190, "my bag", 14, "#a05c10") +
  box(510, 50, 140, 210, "#fde8ec", "#ef476f") + txt(580, 82, "👑 mine", 20, "#c0264b") + txt(580, 112, "我的（東西）", 14) + txt(580, 145, "後面不接名詞", 12, "#666", "400") + txt(580, 190, "It's mine.", 14, "#c0264b") +
  txt(330, 300, "he/him/his/his · she/her/her/hers · they/them/their/theirs 同一套換法", 13, "#555", "400")
),

u4: wrap(
  txt(170, 34, "⚙️ be 引擎（是/在/狀態）", 17, "#1e5fb8") +
  box(30, 50, 280, 120, "#eaf3ff", "#2f80ed") +
  txt(170, 88, "am · is · are", 18, "#1e5fb8") +
  txt(170, 120, "I am tall. / She is a nurse.", 14) + txt(170, 148, "They are at home.", 14) +
  txt(170, 205, "⚙️ 動作引擎（做動作）", 17, "#187a48") +
  box(30, 220, 280, 90, "#e6f6ec", "#2fbf71") +
  txt(170, 258, "run · eat · play · like…", 16, "#187a48") + txt(170, 288, "I play basketball.", 14) +
  box(360, 50, 280, 260, "#fde8ec", "#ef476f", 16) +
  txt(500, 90, "🚗 一台車一顆引擎！", 17, "#c0264b") +
  txt(500, 140, "❌ I am play basketball.", 16, "#c0264b") +
  txt(500, 175, "（兩顆引擎打架了）", 13, "#888", "400") +
  txt(500, 225, "✅ I play basketball.", 16, "#187a48") +
  txt(500, 260, "✅ I am tall.", 16, "#187a48")
),

r1: wrap(
  txt(330, 32, "🏭 造句輸送帶：零件對了，句子就對了", 16) +
  box(30, 60, 130, 70, "#eaf3ff", "#2f80ed") + txt(95, 90, "名詞/代名詞", 14, "#1e5fb8") + txt(95, 115, "The cat · She", 13) +
  box(180, 60, 130, 70, "#e6f6ec", "#2fbf71") + txt(245, 90, "動詞（選引擎）", 14, "#187a48") + txt(245, 115, "is / drinks", 13) +
  box(330, 60, 130, 70, "#fff3e0", "#f2a900") + txt(395, 90, "其他零件", 14, "#a05c10") + txt(395, 115, "milk · cute", 13) +
  arrow(95, 135, 95, 175) + arrow(245, 135, 245, 175) + arrow(395, 135, 395, 175) +
  `<rect x="30" y="180" width="600" height="34" rx="8" fill="#d9e2ec"/>` +
  `<circle cx="80" cy="214" r="10" fill="#8a93b8"/><circle cx="230" cy="214" r="10" fill="#8a93b8"/><circle cx="380" cy="214" r="10" fill="#8a93b8"/><circle cx="530" cy="214" r="10" fill="#8a93b8"/>` +
  arrow(330, 220, 330, 250) +
  box(120, 255, 420, 55, "#fff", "#2fbf71", 14) + txt(330, 288, "✅ The cat drinks milk. ／ She is cute.", 16, "#187a48")
),

u5: wrap(
  `<circle cx="180" cy="170" r="120" fill="none" stroke="#2f80ed" stroke-width="3" stroke-dasharray="10 6"/>` +
  txt(180, 145, "🔁 現在簡單式", 18, "#1e5fb8") + txt(180, 175, "習慣＋事實", 15) + txt(180, 205, "（不是現在正在！）", 12.5, "#888", "400") +
  txt(180, 40, "every day 🌞", 14, "#1e5fb8") + txt(48, 110, "usually", 14, "#1e5fb8") + txt(52, 250, "on Sundays", 13.5, "#1e5fb8") + txt(305, 110, "often", 14, "#1e5fb8") + txt(310, 250, "事實 🌍", 14, "#1e5fb8") +
  box(390, 55, 250, 105, "#e6f6ec", "#2fbf71", 14) +
  txt(515, 88, "I walk to school.", 15, "#187a48") + txt(515, 118, "The sun rises. （事實）", 14, "#187a48") + txt(515, 145, "習慣天天發生，用原形", 12.5, "#666", "400") +
  box(390, 180, 250, 110, "#fff3e0", "#f2a900", 14) +
  txt(515, 212, "⚠️ 三單 s", 16, "#a05c10") +
  txt(515, 242, "He walks. / She likes. / It runs.", 14, "#a05c10") +
  txt(515, 272, "主詞是 he/she/it ➜ 動詞＋s", 12.5, "#666", "400")
),

u6: wrap(
  `<circle cx="185" cy="160" r="105" fill="#fffdf3" stroke="#f2a900" stroke-width="5"/>` +
  `<line x1="262" y1="238" x2="330" y2="300" stroke="#f2a900" stroke-width="14" stroke-linecap="round"/>` +
  txt(185, 120, "🔍 RIGHT NOW", 18, "#a05c10") +
  txt(185, 155, "現在、這一刻", 14, "#555", "400") +
  txt(185, 190, "She is reading. 📖", 15) + txt(185, 218, "They are playing. ⚽", 15) +
  box(380, 60, 260, 100, "#eaf3ff", "#2f80ed", 14) +
  txt(510, 95, "be ＋ V-ing 是一組 🔗", 16, "#1e5fb8") +
  txt(510, 128, "is 🔗 reading（拆開就壞掉）", 14, "#1e5fb8") +
  box(380, 180, 260, 110, "#fde8ec", "#ef476f", 14) +
  txt(510, 212, "❌ She reading.（少了 be）", 14.5, "#c0264b") +
  txt(510, 242, "❌ She is read.（少了 -ing）", 14.5, "#c0264b") +
  txt(510, 272, "✅ She is reading.", 15, "#187a48")
),

u7: wrap(
  txt(330, 32, "📦 過去式＝把事情放進「昨天盒子」", 16) +
  box(30, 60, 285, 230, "#eaf3ff", "#2f80ed", 14) +
  txt(172, 95, "📗 規則相簿：＋ed", 16, "#1e5fb8") +
  txt(172, 135, "play ➜ played", 15) + txt(172, 165, "watch ➜ watched", 15) + txt(172, 195, "clean ➜ cleaned", 15) +
  txt(172, 235, "大部分動詞走這本", 13, "#666", "400") +
  box(345, 60, 295, 230, "#fff3e0", "#f2a900", 14) +
  txt(492, 95, "📙 不規則相簿：整個變身", 16, "#a05c10") +
  txt(492, 135, "go ➜ went　eat ➜ ate", 15) + txt(492, 165, "see ➜ saw　have ➜ had", 15) + txt(492, 195, "buy ➜ bought　get ➜ got", 15) +
  txt(492, 235, "常用的反而愛變身，背 20 個就夠用", 12.5, "#666", "400") +
  txt(330, 312, "yesterday · last night · two days ago ➜ 看到這些詞，動詞進昨天盒子", 13.5, "#555", "400")
),

r2: wrap(
  `<line x1="40" y1="180" x2="620" y2="180" stroke="#8a93b8" stroke-width="4" marker-end="url(#ar)"/>` +
  `<line x1="150" y1="165" x2="150" y2="195" stroke="#8a93b8" stroke-width="3"/>` +
  `<line x1="330" y1="165" x2="330" y2="195" stroke="#8a93b8" stroke-width="3"/>` +
  `<line x1="500" y1="165" x2="500" y2="195" stroke="#8a93b8" stroke-width="3"/>` +
  box(75, 50, 150, 95, "#fff3e0", "#f2a900", 12) + txt(150, 80, "🕰️ yesterday", 15, "#a05c10") + txt(150, 108, "過去式", 14) + txt(150, 132, "I played.", 14, "#a05c10") +
  box(255, 50, 150, 95, "#eaf3ff", "#2f80ed", 12) + txt(330, 80, "🔁 every day", 15, "#1e5fb8") + txt(330, 108, "現在簡單", 14) + txt(330, 132, "I play.", 14, "#1e5fb8") +
  box(425, 50, 150, 95, "#e6f6ec", "#2fbf71", 12) + txt(500, 80, "🔍 right now", 15, "#187a48") + txt(500, 108, "現在進行", 14) + txt(500, 132, "I am playing.", 14, "#187a48") +
  box(340, 210, 280, 90, "#f3edff", "#7c4dca", 12) + txt(480, 242, "🔮 later / tomorrow（預告）", 14.5, "#5a36a8") + txt(480, 272, "I will play. / I am going to play.", 14, "#5a36a8") +
  txt(200, 250, "🚏 看到時間詞", 15) + txt(200, 278, "就知道動詞穿哪件衣服", 13.5, "#555", "400")
),

u8: wrap(
  box(30, 50, 190, 90, "#fff", "#8a93b8") + txt(125, 85, "普通句", 15) + txt(125, 115, "You like dogs.", 15) +
  arrow(225, 95, 275, 95) +
  `<rect x="280" y="40" width="120" height="120" rx="18" fill="#eaf3ff" stroke="#2f80ed" stroke-width="3"/>` +
  `<circle cx="322" cy="80" r="9" fill="#2f80ed"/><circle cx="358" cy="80" r="9" fill="#2f80ed"/>` +
  `<rect x="315" y="105" width="50" height="10" rx="5" fill="#2f80ed"/>` +
  txt(340, 145, "🤖 do/does/did", 13.5, "#1e5fb8") +
  arrow(405, 70, 450, 55) + arrow(405, 125, 450, 145) +
  box(455, 30, 190, 65, "#e6f6ec", "#2fbf71") + txt(550, 55, "問句：小幫手到句首", 13.5, "#187a48") + txt(550, 80, "Do you like dogs?", 14, "#187a48") +
  box(455, 115, 190, 65, "#fff3e0", "#f2a900") + txt(550, 140, "否定：小幫手＋not", 13.5, "#a05c10") + txt(550, 165, "I don't like dogs.", 14, "#a05c10") +
  box(30, 210, 610, 95, "#fde8ec", "#ef476f", 14) +
  txt(335, 242, "🤖 小幫手出場後，動詞回原形！", 16, "#c0264b") +
  txt(335, 272, "She likes cats. ➜ Does she like cats?（likes 的 s 交給 does）", 14, "#c0264b") +
  txt(335, 296, "be 動詞不用小幫手：Is she tall? / She isn't tall.", 13, "#555", "400")
),

u9: wrap(
  box(30, 45, 190, 110, "#eaf3ff", "#2f80ed", 14) +
  txt(125, 75, "🏷️ 形容詞 → 名詞", 14.5, "#1e5fb8") + txt(125, 108, "a big dog", 16) + txt(125, 138, "東西「怎樣」", 12.5, "#666", "400") +
  box(235, 45, 190, 110, "#e6f6ec", "#2fbf71", 14) +
  txt(330, 75, "🏷️ 副詞 → 動作", 14.5, "#187a48") + txt(330, 108, "runs quickly", 16) + txt(330, 138, "動作「怎樣」（常 -ly）", 12.5, "#666", "400") +
  box(440, 45, 200, 110, "#fff3e0", "#f2a900", 14) +
  txt(540, 75, "🏷️ 頻率 → 習慣", 14.5, "#a05c10") + txt(540, 108, "I always run.", 16) + txt(540, 138, "放一般動詞前面", 12.5, "#666", "400") +
  txt(330, 195, "頻率量表", 15) +
  `<line x1="80" y1="235" x2="580" y2="235" stroke="#8a93b8" stroke-width="4"/>` +
  `<circle cx="80" cy="235" r="8" fill="#2fbf71"/><circle cx="205" cy="235" r="8" fill="#7cc576"/><circle cx="330" cy="235" r="8" fill="#f2a900"/><circle cx="455" cy="235" r="8" fill="#f28444"/><circle cx="580" cy="235" r="8" fill="#ef476f"/>` +
  txt(80, 265, "always", 13) + txt(205, 265, "usually", 13) + txt(330, 265, "sometimes", 13) + txt(455, 265, "seldom", 13) + txt(580, 265, "never", 13) +
  txt(80, 285, "100%", 12, "#888", "400") + txt(580, 285, "0%", 12, "#888", "400")
),

u10: wrap(
  box(40, 55, 250, 190, "#fffdf3", "#8a93b8", 10) +
  txt(165, 45, "🗺️ 空間：用「看」的", 15) +
  txt(100, 95, "on 🐱", 14, "#1e5fb8") + `<rect x="70" y="105" width="60" height="42" fill="#d9e2ec" rx="6"/>` + txt(100, 130, "盒子", 12) +
  txt(100, 172, "in 🐱", 14, "#187a48") + `<rect x="70" y="182" width="60" height="42" fill="#d9e2ec" rx="6"/>` + txt(100, 207, "盒子", 12) +
  txt(225, 95, "under 🐱", 14, "#a05c10") + `<rect x="195" y="105" width="60" height="10" fill="#d9e2ec" rx="4"/>` + txt(225, 135, "🐱", 16) +
  txt(225, 185, "next to", 14, "#7c4dca") + `<rect x="188" y="196" width="34" height="34" fill="#d9e2ec" rx="6"/>` + txt(243, 218, "🐱", 16) +
  `<path d="M 470 60 L 570 155 L 370 155 Z" fill="#fff3e0" stroke="#f2a900" stroke-width="2.5"/>` +
  `<path d="M 470 60 L 537 124 L 403 124 Z" fill="#fde8ec" stroke="#ef476f" stroke-width="2.5"/>` +
  `<path d="M 470 60 L 505 93 L 435 93 Z" fill="#eaf3ff" stroke="#2f80ed" stroke-width="2.5"/>` +
  txt(470, 84, "at", 13, "#1e5fb8") + txt(470, 114, "on", 14, "#c0264b") + txt(470, 146, "in", 15, "#a05c10") +
  txt(470, 45, "⏰ 時間金字塔（越下越大段）", 14) +
  txt(470, 185, "at 7:00（時刻）", 13, "#1e5fb8") +
  txt(470, 210, "on Monday（某一天）", 13, "#c0264b") +
  txt(470, 235, "in July / in 2026（月、年）", 13, "#a05c10") +
  txt(330, 290, "❌ 不要背中文翻譯，看圖記位置關係", 14, "#555", "400")
),

r3: wrap(
  txt(330, 30, "🌅 用學過的觀念，說完整的一天", 16) +
  box(30, 50, 140, 165, "#fff7dc", "#f2a900", 12) + txt(100, 82, "🌅 早上", 15) + txt(100, 115, "I get up", 13.5) + txt(100, 138, "at seven.", 13.5) + txt(100, 172, "現在簡單＋at", 11.5, "#a05c10") +
  box(190, 50, 140, 165, "#eaf3ff", "#2f80ed", 12) + txt(260, 82, "🏫 上學", 15) + txt(260, 115, "I always walk", 13.5) + txt(260, 138, "to school.", 13.5) + txt(260, 172, "頻率副詞", 11.5, "#1e5fb8") +
  box(350, 50, 140, 165, "#e6f6ec", "#2fbf71", 12) + txt(420, 82, "🍜 晚餐", 15) + txt(420, 115, "Dad is cooking", 13.5) + txt(420, 138, "right now.", 13.5) + txt(420, 172, "現在進行", 11.5, "#187a48") +
  box(510, 50, 140, 165, "#f3edff", "#7c4dca", 12) + txt(580, 82, "🛏️ 晚上", 15) + txt(580, 115, "I watched TV", 13.5) + txt(580, 138, "yesterday.", 13.5) + txt(580, 172, "過去式", 11.5, "#5a36a8") +
  arrow(170, 132, 188, 132) + arrow(330, 132, 348, 132) + arrow(490, 132, 508, 132) +
  box(90, 240, 480, 60, "#fff", "#2fbf71", 14) +
  txt(330, 265, "把四格串起來＝一小段英文日記 📔", 15, "#187a48") +
  txt(330, 290, "時態＋描述詞＋介係詞，全部用上", 13, "#555", "400")
),

u11: wrap(
  box(30, 120, 130, 80, "#eaf3ff", "#2f80ed", 40) + txt(95, 155, "句子 A", 16, "#1e5fb8") + txt(95, 182, "I was tired", 13.5) +
  box(500, 120, 130, 80, "#e6f6ec", "#2fbf71", 40) + txt(565, 155, "句子 B", 16, "#187a48") + txt(565, 182, "I slept early", 13.5) +
  `<path d="M 160 140 C 250 55, 410 55, 500 140" fill="none" stroke="#2f80ed" stroke-width="3.5"/>` + txt(330, 72, "and 而且（同方向）", 13.5, "#1e5fb8") +
  `<path d="M 160 150 C 255 95, 405 95, 500 150" fill="none" stroke="#ef476f" stroke-width="3.5"/>` + txt(330, 106, "but 但是（轉彎）", 13.5, "#c0264b") +
  `<path d="M 160 175 C 255 230, 405 230, 500 175" fill="none" stroke="#f2a900" stroke-width="3.5"/>` + txt(330, 222, "or 或者（二選一）", 13.5, "#a05c10") +
  `<path d="M 160 190 C 250 265, 410 265, 500 190" fill="none" stroke="#7c4dca" stroke-width="3.5"/>` + txt(330, 258, "so 所以（A 造成 B）｜because 因為（B 解釋 A）", 13.5, "#5a36a8") +
  txt(330, 300, "🌉 橋不是裝飾——選哪座橋＝說清楚兩句的關係", 14, "#555", "400")
),

u12: wrap(
  `<rect x="130" y="35" width="400" height="34" rx="10" fill="#b5651d"/>` + txt(330, 58, "🧰 好用小幫手工具箱", 16, "#fff") +
  box(45, 90, 180, 130, "#eaf3ff", "#2f80ed", 14) +
  txt(135, 120, "🔧 can", 17, "#1e5fb8") + txt(135, 150, "會、能力", 13.5) + txt(135, 180, "I can swim.", 14) + txt(135, 205, "She can cook.", 14) +
  box(240, 90, 180, 130, "#e6f6ec", "#2fbf71", 14) +
  txt(330, 120, "📦 There is/are", 15.5, "#187a48") + txt(330, 150, "有（存在）", 13.5) + txt(330, 180, "There is a park.", 13.5) + txt(330, 205, "There are two dogs.", 13.5) +
  box(435, 90, 180, 130, "#f3edff", "#7c4dca", 14) +
  txt(525, 120, "🕐 will / going to", 14.5, "#5a36a8") + txt(525, 150, "之後要做", 13.5) + txt(525, 180, "I will help you.", 13.5) + txt(525, 205, "I'm going to read.", 13.5) +
  box(45, 240, 570, 62, "#fde8ec", "#ef476f", 14) +
  txt(330, 265, "⚠️ 小幫手後面，動詞回原形！", 15.5, "#c0264b") +
  txt(330, 291, "✅ She can swim.　❌ She can swims.　（should/must 也一樣，之後再學）", 13, "#c0264b")
),

r4: wrap(
  txt(330, 30, "🧪 句子合體實驗室：短句 ➜ 一段話", 16) +
  box(30, 55, 180, 55, "#eaf3ff", "#2f80ed", 10) + txt(120, 88, "I am eleven.", 14) +
  box(30, 120, 180, 55, "#e6f6ec", "#2fbf71", 10) + txt(120, 153, "I like dogs.", 14) +
  box(30, 185, 180, 55, "#fff3e0", "#f2a900", 10) + txt(120, 218, "I can swim.", 14) +
  arrow(215, 100, 265, 135) + arrow(215, 148, 265, 148) + arrow(215, 200, 265, 165) +
  `<path d="M 300 105 L 340 105 L 340 130 L 375 195 L 265 195 L 300 130 Z" fill="#f3edff" stroke="#7c4dca" stroke-width="3"/>` +
  txt(320, 165, "⚗️ 合體", 14, "#5a36a8") +
  arrow(380, 165, 420, 165) +
  box(425, 80, 215, 170, "#fff", "#2fbf71", 14) +
  txt(532, 112, "📔 一段自我介紹", 15, "#187a48") +
  txt(532, 145, "Hi! I am eleven and", 13.5) + txt(532, 170, "I like dogs, but my", 13.5) + txt(532, 195, "brother likes cats.", 13.5) + txt(532, 220, "I can swim, too!", 13.5) +
  txt(330, 290, "文法是為了「說出你想說的」——不是背規則 💬", 14, "#555", "400")
),

};
if (typeof module !== "undefined" && module.exports) module.exports = { DIAGRAMS };
