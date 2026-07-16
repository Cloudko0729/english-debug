// 字根字源教學庫：常見字首(prefix)／字尾(suffix)，附中文說明與範例字。
// 每個字根有一般範例(ex)，另有 WEEK_ROOT_PICKS 用當週真實課程單字舉例，讓小孩覺得「這就是我正在學的字」。
const WORD_ROOTS = [
  { id: "re", type: "prefix", affix: "re-", zh: "再次、往回", ex: [
    { base: "write", word: "rewrite", zh: "再寫一次、重寫" },
    { base: "read", word: "reread", zh: "再讀一次" },
  ] },
  { id: "un", type: "prefix", affix: "un-", zh: "不、非", ex: [
    { base: "happy", word: "unhappy", zh: "不快樂的" },
    { base: "kind", word: "unkind", zh: "不親切的" },
  ] },
  { id: "pre", type: "prefix", affix: "pre-", zh: "在…之前", ex: [
    { base: "view", word: "preview", zh: "事先看、預告" },
    { base: "school", word: "preschool", zh: "學前班、幼兒園" },
  ] },
  { id: "dis", type: "prefix", affix: "dis-", zh: "不、相反", ex: [
    { base: "like", word: "dislike", zh: "不喜歡" },
    { base: "appear", word: "disappear", zh: "消失（appear「出現」的相反）" },
  ] },
  { id: "ful", type: "suffix", affix: "-ful", zh: "充滿…的", ex: [
    { base: "color", word: "colorful", zh: "色彩豐富的" },
    { base: "wonder", word: "wonderful", zh: "很棒的、令人驚奇的" },
  ] },
  { id: "less", type: "suffix", affix: "-less", zh: "沒有…的", ex: [
    { base: "home", word: "homeless", zh: "無家可歸的" },
    { base: "use", word: "useless", zh: "沒有用的" },
  ] },
  { id: "ly", type: "suffix", affix: "-ly", zh: "…地（副詞）／像…的", ex: [
    { base: "slow", word: "slowly", zh: "慢慢地" },
    { base: "friend", word: "friendly", zh: "友善的" },
  ] },
  { id: "er", type: "suffix", affix: "-er", zh: "做…的人", ex: [
    { base: "teach", word: "teacher", zh: "教學的人、老師" },
    { base: "sing", word: "singer", zh: "唱歌的人、歌手" },
  ] },
  { id: "ist", type: "suffix", affix: "-ist", zh: "…專家、從事…的人", ex: [
    { base: "art", word: "artist", zh: "藝術家" },
    { base: "science", word: "scientist", zh: "科學家" },
  ] },
  { id: "able", type: "suffix", affix: "-able", zh: "可以…的", ex: [
    { base: "enjoy", word: "enjoyable", zh: "令人享受的" },
    { base: "comfort", word: "comfortable", zh: "舒服的" },
  ] },
  { id: "tion", type: "suffix", affix: "-tion", zh: "…的動作或狀態（名詞）", ex: [
    { base: "act", word: "action", zh: "動作、行動" },
    { base: "invite", word: "invitation", zh: "邀請（函）" },
  ] },
  { id: "ed", type: "suffix", affix: "-ed", zh: "感到…的（形容詞）", ex: [
    { base: "tire", word: "tired", zh: "感到疲累的" },
    { base: "excite", word: "excited", zh: "感到興奮的" },
  ] },
  { id: "ing", type: "suffix", affix: "-ing", zh: "令人感到…的（形容詞）", ex: [
    { base: "interest", word: "interesting", zh: "令人感興趣的" },
    { base: "bore", word: "boring", zh: "令人無聊的" },
  ] },
];

// 每週精選 3 個字根，例字取自該週真實課程單字（curriculum.js）
const WEEK_ROOT_PICKS = {
  1: [
    { id: "ist", base: "tour", word: "tourist", zh: "觀光客（本週單字）" },
    { id: "re", base: "turn", word: "return", zh: "返回（本週單字）" },
    { id: "er", base: "travel", word: "traveler", zh: "旅行的人（travel 是本週單字）" },
  ],
  2: [
    { id: "pre", base: "pare", word: "prepare", zh: "準備（本週單字）" },
    { id: "ful", base: "help", word: "helpful", zh: "有幫助的（本週單字）" },
    { id: "ly", base: "usual", word: "usually", zh: "通常（本週單字）" },
  ],
  3: [
    { id: "ful", base: "care", word: "careful", zh: "小心的（本週單字）" },
    { id: "ly", base: "quick", word: "quickly", zh: "快速地（本週單字）" },
    { id: "dis", base: "agree", word: "disagree", zh: "不同意（agree 是本週單字）" },
  ],
  4: [
    { id: "ed", base: "worry", word: "worried", zh: "擔心的（本週單字）" },
    { id: "un", base: "safe", word: "unsafe", zh: "不安全的（safe 是本週單字）" },
    { id: "re", base: "pair", word: "repair", zh: "修理（本週單字）" },
  ],
};

if (typeof module !== "undefined" && module.exports) module.exports = { WORD_ROOTS, WEEK_ROOT_PICKS };
