// 六上期中考模擬卷（2026-11-05 考）：Unit 1、Unit 2、Review 1、中秋節。
// 題目照課本句型出（school_db/textbook_g6a.js），題型照學校考卷的樣子：
// 聽音辨字、聽問句選回應、對話選句子、文法、看圖寫字、閱讀。
// 音檔在 audio/exam_midterm/：a<i>＝辨字的字、b<i>＝聽力問句、f＝閱讀短文。
const MIDTERM = {
  id: "midterm-2026-g6a",
  title: "六上期中考模擬卷",
  scope: "Unit 1、Unit 2、Review 1、中秋節",
  // A 聽音辨字：er / ir / ur / ar / or（Review 1 的 Four in a Row）
  phonics: [
    { word: "burn",  choices: ["burn", "born", "bark"] },
    { word: "park",  choices: ["park", "pork", "purse"] },
    { word: "hurt",  choices: ["hurt", "hard", "horse"] },
    { word: "bird",  choices: ["bird", "bark", "born"] },
    { word: "corn",  choices: ["corn", "car", "curve"] },
    { word: "skirt", choices: ["skirt", "short", "party"] },
    { word: "farm",  choices: ["farm", "corn", "perm"] },
    { word: "fork",  choices: ["fork", "fern", "farm"] },
  ],
  // B 聽問句，看圖選回應
  listen: [
    { say: "Where are you from?", name: "Yuki", pic: "🇯🇵", label: "Japan",
      choices: ["I'm from Japan.", "I'm Yuki.", "Yes, I am."], answer: "I'm from Japan." },
    { say: "Is Tommy from the USA?", name: "Tommy", pic: "🇨🇦", label: "Canada",
      choices: ["No, he's not. He's from Canada.", "Yes, she is.", "He's from the USA."], answer: "No, he's not. He's from Canada." },
    { say: "What's wrong?", name: "Joe", pic: "🤒", label: "fever",
      choices: ["I have a fever.", "I'm from France.", "Yes, I do."], answer: "I have a fever." },
    { say: "Does Ella have a cough?", name: "Ella", pic: "🤧", label: "runny nose ✓　cough ✗",
      choices: ["No, she doesn't. She has a runny nose.", "Yes, she does.", "No, he doesn't. He has a cough."], answer: "No, she doesn't. She has a runny nose." },
    { say: "Would you like some moon cakes?", name: "Amy", pic: "🥮", label: "moon cakes",
      choices: ["Yes, please.", "I'm from Taiwan.", "Yes, she is."], answer: "Yes, please." },
    { say: "Do you have a stomachache?", name: "Joe", pic: "😋", label: "hungry",
      choices: ["No, I'm just hungry.", "Yes, he does.", "I'm from India."], answer: "No, I'm just hungry." },
  ],
  // C 讀對話，選出空格的句子
  read: [
    { a: "______", b: "I'm from Australia.",
      choices: ["Where are you from?", "What's wrong?", "Is she from Australia?"], answer: "Where are you from?",
      why: "回答 I'm from…，問的是「你從哪裡來」。" },
    { a: "Is Raj from India?", b: "______",
      choices: ["Yes, he is.", "Yes, he does.", "No, I'm not."], answer: "Yes, he is.",
      why: "問句是 Is Raj from India?，回答也用 is；Raj 是男生，用 he，所以是 Yes, he is.。" },
    { a: "What's wrong, Amy?", b: "______",
      choices: ["I have a sore throat.", "I'm from the UK.", "I has a sore throat."], answer: "I have a sore throat.",
      why: "Amy 在說自己哪裡不舒服，用 I have。I 後面不能用 has。" },
    { a: "______", b: "Yes, he does. He has a headache, too.",
      choices: ["Does Joe have a fever?", "Is Joe from Japan?", "Do you have a fever?"], answer: "Does Joe have a fever?",
      why: "回答是 Yes, he does.，所以問句是 Does Joe have…?；does 後面的 have 用原形。" },
    { a: "Do you like pomelos?", b: "______",
      choices: ["Yes, I do.", "Yes, I am.", "Yes, please."], answer: "Yes, I do.",
      why: "用 Do 問，就用 do 回答。Yes, please. 是回答 Would you like…?" },
    { a: "Would you like some barbecue?", b: "______",
      choices: ["Sure!", "Yes, he does.", "No, she isn't."], answer: "Sure!",
      why: "別人請你吃東西，回答 Sure! 或 Yes, please.。" },
    { a: "Which one is NOT a Moon Festival thing?", b: "",
      choices: ["a Christmas tree", "moon cakes", "pomelos", "a full moon"], answer: "a Christmas tree",
      why: "聖誕樹是聖誕節的東西。中秋節有月餅、柚子、滿月和烤肉。" },
  ],
  // D 文法：選出正確的字
  grammar: [
    { q: "Where ___ they from?", choices: ["are", "is", "am"], answer: "are", why: "they 用 are。" },
    { q: "Ken ___ from Canada.", choices: ["is", "are", "am"], answer: "is", why: "Ken 是一個人（他），用 is。" },
    { q: "She ___ a toothache.", choices: ["has", "have", "is"], answer: "has", why: "肯定句裡，主詞是 She（第三人稱單數）就用 has。" },
    { q: "I ___ a runny nose.", choices: ["have", "has", "am"], answer: "have", why: "肯定句裡，主詞是 I 就用 have：I have a runny nose.。" },
    { q: "___ he have a fever?", choices: ["Does", "Do", "Is"], answer: "Does", why: "問他有沒有生病，用 Does he have…?。如果是問他從哪裡來，才用 Is he from…?。" },
    { q: "Do you have a cold? — No, I ___.", choices: ["don't", "doesn't", "am not"], answer: "don't", why: "問句是 Do you have…?，回答自己沒有就說 No, I don't.。" },
    { q: "Does Amy ___ a cough?", choices: ["have", "has", "is"], answer: "have", why: "does 後面用原形動詞，所以是 have，不是 has。" },
    { q: "哪一句寫對了？", choices: ["I'm from Taiwan.", "I'm from taiwan.", "i'm from Taiwan."], answer: "I'm from Taiwan.",
      why: "Taiwan 是國名，T 要大寫；I（我）不管在哪裡都要大寫。" },
  ],
  // E 看圖寫單字（國名要大寫）
  write: [
    { pic: "🇫🇷", zh: "法國", answers: ["France"], cap: true },
    { pic: "🇮🇳", zh: "印度", answers: ["India"], cap: true },
    { pic: "🇦🇺", zh: "澳洲", answers: ["Australia"], cap: true },
    { pic: "🤒", zh: "發燒", answers: ["fever"] },
    { pic: "🦷", zh: "牙痛", answers: ["toothache"] },
    { pic: "🤕", zh: "頭痛", answers: ["headache"] },
    { pic: "🥮", zh: "月餅", answers: ["moon cake", "mooncake"] },
    { pic: "🌕", zh: "滿月", answers: ["full moon"] },
  ],
  // F 閱讀（Review 1 Read and Write 的樣子：國家＋症狀＋怎麼照顧）
  reading: {
    passage: "Hi, I'm Mia. I'm from Canada. My friend Raj is from India. Today Raj is sick. He has a fever and a sore throat. The doctor tells him to take medicine and get some rest. I make some honey and lemon tea for him. I hope he feels better soon.",
    gloss: [["hope", "希望"], ["feels better", "覺得好一點"], ["soon", "很快"]],
    questions: [
      { q: "Where is Mia from?", choices: ["Canada", "India", "Taiwan"], answer: "Canada" },
      { q: "What's wrong with Raj?", choices: ["He has a fever and a sore throat.", "He has a toothache.", "He has a cough and a runny nose."], answer: "He has a fever and a sore throat." },
      { q: "What does the doctor tell Raj to do?", choices: ["Take medicine and get some rest.", "Eat some moon cakes.", "Go to school."], answer: "Take medicine and get some rest." },
      { q: "What does Mia make for Raj?", choices: ["Honey and lemon tea", "Chicken soup", "Moon cakes"], answer: "Honey and lemon tea" },
    ],
  },
};
if (typeof module !== "undefined" && module.exports) module.exports = { MIDTERM };
if (typeof window !== "undefined") window.MIDTERM = MIDTERM;
