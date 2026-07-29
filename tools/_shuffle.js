// 選擇題選項的洗牌，兩個產品（kids / adult）的產生器共用。
//
// 為什麼需要這個：
//   grammar_db 的 diagnostics 正解一律排在第一個（answerId 都是 "a"），
//   成人課程的題目也是手寫時把正解寫在最前面。結果小孩／使用者只要每題都點
//   第一個按鈕就全對，測驗完全失效 —— 分數、金幣、進度紀錄、以及吃進度做
//   分級推薦的月課表，全部跟著失真。
//
// 為什麼不用 Math.random()：
//   產生器每次重跑都要輸出一模一樣的檔案，否則每次 build 都有假 diff，
//   而且同一份題目在不同時間產生會給出不同答案位置，沒辦法重現問題。
//   所以用「題目內容」推出種子，同一題永遠得到同一個順序。
"use strict";

// FNV-1a：短字串夠散、實作短、跨語言好對照
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

// xorshift32：由種子產生可重現的偽隨機序列
function rngOf(seed) {
  let s = seed || 1;
  return function () {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;  s >>>= 0;
    return s / 4294967296;
  };
}

// 依種子洗牌（Fisher-Yates）。回傳新陣列，不動原本的。
//
// 注意：結果取決於「輸入順序」，所以對同一份資料套用兩次不會等於套用一次
// —— 同一個排列套兩次是 P²，而三個元素若剛好是單純對調，P² 就回到原狀。
// 要修改既有檔案（可能被重跑）時請用 shuffleIdempotent。
function shuffleSeeded(arr, seedStr) {
  const out = arr.slice();
  const rnd = rngOf(hash(String(seedStr)));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = out[i]; out[i] = out[j]; out[j] = t;
  }
  return out;
}

// 可重複套用版：先把選項正規化排序，再洗。
// 因為起點固定，不管跑幾次都得到同一個結果 —— 修改既有檔案的工具必須用這個，
// 否則重跑一次就把答案位置洗回原狀（實際踩過：W1-W4 跑兩次後又變成大半在第一個）。
function shuffleIdempotent(arr, seedStr, keyFn) {
  const k = keyFn || (x => String(x));
  const canonical = arr.slice().sort((a, b) => (k(a) < k(b) ? -1 : k(a) > k(b) ? 1 : 0));
  return shuffleSeeded(canonical, seedStr);
}

// 選擇題專用：傳入選項與正解，回傳 { options, answerIndex }。
// seedStr 建議帶題目文字，這樣同樣的正解出現在不同題目時位置也會不同。
function shuffleChoices(choices, answer, seedStr) {
  const options = shuffleSeeded(choices, seedStr);
  const answerIndex = options.indexOf(answer);
  if (answerIndex < 0) throw new Error("洗牌後找不到正解：" + String(answer).slice(0, 60));
  return { options, answerIndex };
}

// 物件型選項（例如 {t, id}）用 keyFn 取出比較用的值
function shuffleObjects(choices, isAnswer, seedStr) {
  const options = shuffleSeeded(choices, seedStr);
  const answerIndex = options.findIndex(isAnswer);
  if (answerIndex < 0) throw new Error("洗牌後找不到正解（物件型）");
  return { options, answerIndex };
}

module.exports = { hash, rngOf, shuffleSeeded, shuffleIdempotent, shuffleChoices, shuffleObjects };
