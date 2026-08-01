// 「什麼字算已經教過」的單一來源。
//
// build_gloss.js（決定哪些字要標中文）與 validate_unit_text.js（決定超綱率）
// 都要用這一份。兩邊各自維護清單的話會出現「驗收說達標、頁面卻標了一堆字」
// 這種對不起來的狀況 —— 實際發生過。
"use strict";

// 功能詞：任何句子都會用到，標出來只是雜訊
const FUNC = new Set(("a an the this that these those i you he she it we they me him her us them " +
  "my your his its our their mine yours hers ours theirs am is are was were be been being " +
  "do does did done have has had having will would can could shall should may might must " +
  "and or but so because if when while then than as at by for from in into of off on out over " +
  "to under up with without about after before near not no yes very too also just only more most " +
  "some any all each every other another same both few many much little less least " +
  "what which who whom whose where why how there here now today tomorrow yesterday " +
  "again always never often sometimes usually one two three four five six seven eight nine ten " +
  "first second next last let s t m re ve ll d don doesn didn isn aren wasn weren won couldn shouldn").split(/\s+/).filter(Boolean));

// 高頻動詞的原形：小學課本一定教過，不算超綱也不必標。
// 注意只放原形 —— 不規則過去式（said / made / came）另外處理，
// 因為 say→said 看不出關聯，那是真正的學習負擔。
const COMMON_VERBS = new Set(("go goes come comes get gets make makes take takes give gives " +
  "see sees look looks know knows think thinks want wants need needs like likes " +
  "tell tells ask asks put puts find finds say says " +
  "run runs sit sits eat eats read reads write writes play plays").split(/\s+/).filter(Boolean));

// 不規則變化 → 原形。標註時會點名原形，讓小孩連得起來。
const IRREG = {
  said: "say", made: "make", came: "come", took: "take", gave: "give", found: "find",
  went: "go", ate: "eat", began: "begin", ran: "run", held: "hold", wrote: "write",
  became: "become", saw: "see", fell: "fall", bought: "buy", told: "tell", felt: "feel",
  chose: "choose", paid: "pay", stood: "stand", blew: "blow", shook: "shake",
  brought: "bring", caught: "catch", taught: "teach", thought: "think", knew: "know",
  grew: "grow", drew: "draw", threw: "throw", flew: "fly", swam: "swim", sang: "sing",
  drank: "drink", rang: "ring", sat: "sit", met: "meet", left: "leave", kept: "keep",
  slept: "sleep", lost: "lose", sent: "send", spent: "spend", built: "build",
  heard: "hear", won: "win", wore: "wear", broke: "break", spoke: "speak",
  woke: "wake", rode: "ride", drove: "drive", hid: "hide", rose: "rise",
  understood: "understand", forgot: "forget", got: "get", gone: "go", done: "do",
};

// 故事人物名字：不是要學的單字
const NAMES = new Set(("mia amy ben leo lily tom ken max anna sam emma jack lin chen wu yeh " +
  "nina ray kevin").split(/\s+/).filter(Boolean));

// 規則變化還原（look→looked 這種一眼看得出來）
function regularForms(w) {
  const o = [];
  if (/['’]s$/.test(w)) o.push(w.replace(/['’]s$/, ""));   // 所有格
  [[/ies$/, "y"], [/ied$/, "y"], [/es$/, ""], [/s$/, ""], [/ed$/, ""], [/ed$/, "e"],
   [/ing$/, ""], [/ing$/, "e"], [/er$/, ""], [/est$/, ""], [/ly$/, ""]]
    .forEach(([re, rep]) => { if (re.test(w)) o.push(w.replace(re, rep)); });
  if (/(.)\1(ed|ing)$/.test(w)) o.push(w.replace(/(.)\1(ed|ing)$/, "$1"));
  return o;
}

// 全部候選原形（含不規則）
function allForms(w) {
  const o = [w].concat(regularForms(w));
  if (IRREG[w]) o.push(IRREG[w]);
  return o;
}

// 把字表加入集合；多字詞條（"chinese new year"）的每個字也要算，
// 因為斷詞後它們是分開的。
function addEntry(set, term) {
  const k = String(term).toLowerCase();
  set.add(k);
  if (k.includes(" ")) k.split(/\s+/).forEach(x => set.add(x));
}

// 這個字算不算「已經會了」。
// forGloss=true 時，不規則變化不算已會 —— 頁面仍要標出來並點名原形。
function isKnown(w, taught, forGloss) {
  if (FUNC.has(w) || NAMES.has(w) || COMMON_VERBS.has(w)) return true;
  if (taught.has(w)) return true;
  if (regularForms(w).some(f => taught.has(f) || COMMON_VERBS.has(f))) return true;
  if (!forGloss && IRREG[w] && (taught.has(IRREG[w]) || COMMON_VERBS.has(IRREG[w]))) return true;
  return false;
}

const tokenize = t => (String(t).toLowerCase().match(/[a-z][a-z'’]*/g) || []);

module.exports = { FUNC, COMMON_VERBS, IRREG, NAMES, regularForms, allForms, addEntry, isKnown, tokenize };
