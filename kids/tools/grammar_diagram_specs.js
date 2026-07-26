// Shared, code-native SVG diagrams for the grammar database.

"use strict";

const COLORS = {
  blue: ["#eaf3ff", "#2f80ed", "#1e5fb8"],
  green: ["#e6f6ec", "#2fbf71", "#187a48"],
  amber: ["#fff7dc", "#f2a900", "#8a5a00"],
  red: ["#fde8ec", "#ef476f", "#b4234d"],
  purple: ["#f2ebff", "#8b5cf6", "#5b35a8"],
  gray: ["#f4f6f8", "#8b95a5", "#3d4653"],
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");
}

function text(x, y, value, size = 16, color = "#243042", weight = 600, anchor = "middle") {
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="${anchor}" font-family="Arial,'Noto Sans TC',sans-serif">${esc(value)}</text>`;
}

function card(x, y, w, h, title, lines, color = "blue") {
  const [fill, stroke, ink] = COLORS[color];
  const compact = h <= 100;
  const lineStart = y + (compact ? 57 : 66);
  const lineGap = compact ? 22 : 27;
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="15" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`,
    text(x + w / 2, y + 32, title, 18, ink, 700),
    ...lines.map((line, index) => text(x + w / 2, lineStart + index * lineGap, line, 14, "#243042", index === 0 ? 650 : 500)),
  ].join("");
}

function arrow(x1, y1, x2, y2, label = "") {
  return [
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#7b8794" stroke-width="3" marker-end="url(#arrow)"/>`,
    label ? text((x1 + x2) / 2, (y1 + y2) / 2 - 8, label, 13, "#59636f", 600) : "",
  ].join("");
}

function svg(titleZh, descriptionZh, body) {
  return [
    `<svg width="760" height="440" viewBox="0 0 760 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">`,
    `<title id="title">${esc(titleZh)}</title>`,
    `<desc id="desc">${esc(descriptionZh)}</desc>`,
    `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#7b8794"/></marker></defs>`,
    `<rect width="760" height="440" rx="20" fill="#ffffff"/>`,
    text(380, 34, titleZh, 22, "#203047", 750),
    body,
    `</svg>`,
  ].join("");
}

function spec(id, titleZh, descriptionZh, body) {
  return { id, titleZh, descriptionZh, svg: svg(titleZh, descriptionZh, body) };
}

const DIAGRAMS = [
  spec("sentence-slots", "句子槽位圖", "完整句的主詞、述語與可選補充資訊。",
    card(35, 90, 190, 150, "主詞 Subject", ["誰／什麼", "My sister"], "green") +
    arrow(230, 165, 285, 165, "+") +
    card(290, 90, 190, 150, "述語 Predicate", ["發生什麼", "reads"], "blue") +
    arrow(485, 165, 540, 165, "+ 可選") +
    card(545, 90, 180, 150, "補充資訊", ["什麼／哪裡／何時", "a book at night"], "amber") +
    card(155, 285, 450, 105, "完整輸出", ["My sister reads a book at night.", "命令句的主詞 you 可隱藏：Please sit down."], "purple")),

  spec("noun-decision", "名詞決策樹", "依可數性與數量選擇單數、複數或不可數形式。",
    card(270, 62, 220, 90, "這個名詞可數嗎？", ["book / water"], "purple") +
    arrow(300, 155, 175, 220, "可數") +
    arrow(460, 155, 590, 220, "不可數") +
    card(40, 225, 270, 150, "可數 Count", ["one book → 單數", "two books → 複數", "many / a few books"], "green") +
    card(450, 225, 270, 150, "不可數 Noncount", ["some water", "much / a little water", "一般不用 a water"], "blue")),

  spec("a-an-sound", "a / an 聲音入口", "a 或 an 取決於下一個聲音，不只看第一個字母。",
    card(260, 60, 240, 90, "先聽下一個聲音", ["不是只看字母"], "purple") +
    arrow(300, 155, 175, 220, "子音聲音") +
    arrow(460, 155, 585, 220, "母音聲音") +
    card(45, 225, 270, 150, "使用 a", ["a bag /b/", "a university /juː/", "a useful book"], "green") +
    card(445, 225, 270, 150, "使用 an", ["an apple /æ/", "an hour /aʊ/", "an old map"], "blue")),

  spec("pronoun-positions", "代名詞位置圖", "代名詞形式由它在句中的工作決定。",
    card(25, 85, 160, 145, "主詞", ["I / she / they", "She helps me."], "green") +
    arrow(190, 158, 225, 158) +
    card(230, 85, 130, 145, "動詞", ["helps", "動作"], "gray") +
    arrow(365, 158, 400, 158) +
    card(405, 85, 160, 145, "受詞", ["me / her / them", "看動作落到誰"], "blue") +
    card(585, 85, 150, 145, "所有格", ["my bag", "The bag is mine."], "amber") +
    card(155, 285, 450, 100, "指涉檢查", ["Tom told Ben that he... → he 是誰？", "不清楚時重複名字或改寫。"], "red")),

  spec("predicate-routes", "述語選擇圖", "依身分狀態位置或動作，選擇基本述語路線。",
    card(250, 58, 260, 85, "你要表達什麼？", ["先判斷意思，再選形式"], "purple") +
    arrow(300, 148, 175, 215, "身分／狀態／位置") +
    arrow(460, 148, 585, 215, "動作") +
    card(35, 220, 285, 145, "be 路線", ["She is a student.", "She is tired.", "She is at home."], "blue") +
    card(440, 220, 285, 145, "一般動詞路線", ["She reads.", "She likes music.", "She walks home."], "green") +
    text(380, 405, "後續會形成完整動詞片語：is reading · can swim · has finished", 14, "#b4234d", 650)),

  spec("question-routes", "問句雙路線", "be 句前移 be；一般動詞句使用 do、does 或 did。",
    card(250, 55, 260, 80, "先找原句的述語", ["be 還是一般動詞？"], "purple") +
    arrow(300, 140, 170, 205, "be") +
    arrow(460, 140, 590, 205, "一般動詞") +
    card(35, 210, 285, 160, "be 前移", ["You are tired.", "Are you tired?", "You are not tired."], "blue") +
    card(440, 210, 285, 160, "請助動詞", ["You like tea.", "Do you like tea?", "She doesn't like tea."], "green")),

  spec("tense-timeline", "時態與時間關係", "用時間線比較習慣、正在、已結束與連到現在的事件。",
    `<line x1="65" y1="220" x2="700" y2="220" stroke="#6b7280" stroke-width="4" marker-end="url(#arrow)"/>` +
    text(380, 205, "NOW", 15, "#b4234d", 750) +
    `<line x1="380" y1="85" x2="380" y2="350" stroke="#ef476f" stroke-width="2" stroke-dasharray="6 6"/>` +
    card(35, 65, 190, 105, "已結束 Past", ["I visited in 2024."], "amber") +
    card(265, 270, 230, 105, "現在連結 Perfect", ["I have visited twice."], "purple") +
    card(535, 65, 190, 105, "此刻進行", ["I am reading now."], "blue") +
    text(150, 255, "習慣反覆：I read every day.", 14, "#187a48", 650)),

  spec("frequency-position", "頻率副詞位置", "一般動詞前、be 後是最穩定的基礎位置。",
    text(105, 92, "never", 14, "#b4234d", 700) +
    text(245, 92, "sometimes", 14, "#8a5a00", 700) +
    text(390, 92, "often", 14, "#1e5fb8", 700) +
    text(530, 92, "usually", 14, "#187a48", 700) +
    text(665, 92, "always", 14, "#5b35a8", 700) +
    `<line x1="85" y1="120" x2="680" y2="120" stroke="#8b95a5" stroke-width="5" marker-end="url(#arrow)"/>` +
    card(65, 180, 285, 145, "一般動詞前", ["I usually walk.", "We never drink coffee."], "green") +
    card(410, 180, 285, 145, "be 後", ["She is often tired.", "He is always kind."], "blue")),

  spec("quantifier-matrix", "數量詞矩陣", "依可數性選擇 many、much、few、little、fewer 或 less。",
    card(50, 90, 300, 135, "可數複數", ["many books", "a few apples", "fewer bottles"], "green") +
    card(410, 90, 300, 135, "不可數", ["much time", "a little water", "less sugar"], "blue") +
    card(50, 270, 300, 105, "肯定常用 some", ["There are some apples."], "amber") +
    card(410, 270, 300, 105, "一般問句／否定常用 any", ["Are there any questions?"], "purple")),

  spec("preposition-map", "介系詞關係圖", "先看空間或時間關係，不用單一中文「在」硬套。",
    card(40, 75, 210, 145, "空間", ["in the box", "on the table", "under the chair"], "green") +
    card(275, 75, 210, 145, "時間點 at", ["at seven", "at noon"], "blue") +
    card(510, 75, 210, 145, "日期／範圍", ["on Monday", "in July", "in 2026"], "amber") +
    card(150, 275, 460, 100, "固定搭配也要記成語塊", ["at night · in the morning", "US: on the weekend · UK: at the weekend"], "purple")),

  spec("connector-relations", "連接詞關係圖", "連接詞標示兩個想法之間的邏輯關係。",
    card(35, 75, 210, 120, "添加／選擇", ["and = 加上", "or = 選擇"], "green") +
    card(275, 75, 210, 120, "轉折", ["but / however", "兩項資訊有反差"], "purple") +
    card(515, 75, 210, 120, "原因／結果", ["because = 原因", "so / therefore = 結果"], "blue") +
    card(145, 260, 470, 105, "先檢查真實邏輯", ["便宜不一定導致不安全。", "同一組因果通常只選一個主要連接方式。"], "red")),

  spec("comparison-scale", "比較刻度圖", "原級、比較級與最高級依比較數量與對象選擇。",
    card(45, 105, 200, 140, "一項描述", ["tall", "interesting"], "gray") +
    arrow(250, 175, 285, 175, "兩者") +
    card(290, 105, 200, 140, "比較級", ["taller than", "more interesting"], "green") +
    arrow(495, 175, 530, 175, "三者以上") +
    card(535, 105, 190, 140, "最高級", ["the tallest", "the most interesting"], "purple") +
    text(380, 315, "不要重複標記：more bigger ✗  →  bigger ✓", 16, "#b4234d", 700)),

  spec("modal-strength", "情態功能與強度", "先分開可能性推論與建議義務，再在相同功能內比較強度。",
    card(55, 75, 300, 155, "可能性／推論", ["might / may = 較弱推測", "must be = 根據證據強推論", "不是固定百分比"], "blue") +
    card(405, 75, 300, 155, "建議／義務", ["should = 建議", "have to / must = 義務", "強度仍受語境影響"], "red") +
    card(135, 280, 490, 90, "形式共同點", ["modal + 原形：might rain · should go · must be"], "green")),

  spec("relative-attachment", "關係子句附著圖", "關係子句應緊接它所描述的人、物、地點或時間。",
    card(40, 90, 220, 135, "先行詞", ["the engineer", "要補充的人"], "green") +
    arrow(265, 158, 315, 158, "緊接") +
    card(320, 90, 390, 135, "關係子句", ["who designed the device", "who → 人", "which/that → 物 · where → 地點"], "blue") +
    card(120, 285, 520, 90, "避免錯掛", ["the device who designed it ✗", "the engineer who designed the device ✓"], "red")),

  spec("active-passive-focus", "主動與被動焦點", "同一事件可依資訊焦點選擇主動或被動。",
    card(40, 90, 290, 145, "主動：做事者重要", ["Students test the water.", "焦點：students"], "green") +
    arrow(335, 163, 420, 163, "改變焦點") +
    card(425, 90, 290, 145, "被動：流程／物件重要", ["The water is tested.", "焦點：water"], "blue") +
    card(145, 285, 470, 95, "被動形式", ["be + past participle", "is tested · was built · can be recycled"], "purple")),

  spec("paragraph-cohesion", "段落銜接圖", "用順序、邏輯、指涉與關鍵詞讓句子形成段落。",
    card(30, 85, 160, 145, "順序", ["First", "Then", "Finally"], "green") +
    arrow(195, 158, 220, 158) +
    card(225, 85, 160, 145, "邏輯", ["However", "Therefore", "In addition"], "blue") +
    arrow(390, 158, 415, 158) +
    card(420, 85, 140, 145, "指涉", ["it / they", "this change"], "amber") +
    arrow(565, 158, 590, 158) +
    card(595, 85, 135, 145, "關鍵詞", ["route", "the new route"], "purple") +
    card(135, 290, 490, 85, "每一步都要能回答", ["前一句和後一句的關係是什麼？代名詞指誰？"], "red")),

  spec("register-scale", "語體選擇刻度", "依對象、目的與媒介調整用字和請求方式。",
    card(35, 95, 210, 145, "朋友口語", ["Can you send it?", "Hey, I found out..."], "green") +
    card(275, 95, 210, 145, "一般禮貌", ["Could you please...?", "I can't attend."], "blue") +
    card(515, 95, 210, 145, "正式報告／信件", ["I would like to request...", "The data indicate..."], "purple") +
    text(380, 310, "避免混搭：I wanna obtain the document. ✗", 16, "#b4234d", 700)),

  spec("punctuation-map", "標點功能圖", "依資訊關係選擇冒號、分號、破折號、括號或連字號。",
    card(25, 80, 165, 150, "冒號 :", ["引出清單", "three things: ..."], "green") +
    card(205, 80, 165, 150, "分號 ;", ["完整句 A ; 完整句 B", "It works; we agree."], "blue") +
    card(385, 80, 165, 150, "破折號／括號", ["插入補充資訊", "強調／附帶"], "purple") +
    card(565, 80, 165, 150, "連字號 -", ["複合修飾語", "three-day event"], "amber") +
    card(135, 285, 490, 90, "禁止逗號拼接", ["The plan is cheap, it is unsafe. ✗", "使用分號或連接詞。"], "red")),

  spec("revision-layers", "自然度修訂層", "先保住意思，再依序檢查結構、搭配與語體。",
    card(35, 105, 150, 145, "1 意思", ["否定？時間？", "指涉清楚？"], "red") +
    arrow(190, 178, 215, 178) +
    card(220, 105, 150, 145, "2 結構", ["主詞／述語", "動詞形式"], "amber") +
    arrow(375, 178, 400, 178) +
    card(405, 105, 150, 145, "3 搭配", ["really like", "discuss the issue"], "green") +
    arrow(560, 178, 585, 178) +
    card(590, 105, 140, 145, "4 語體", ["對象／目的", "正式度一致"], "blue") +
    text(380, 320, "可懂 ≠ 自然；但不能為了自然改變原意。", 17, "#5b35a8", 750)),
];

module.exports = { DIAGRAMS };
