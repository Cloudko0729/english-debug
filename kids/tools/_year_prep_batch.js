// 產生第 N 批（12 週）的 Codex prompt + 已用字/可複習字清單
// 用法: node _year_prep_batch.js <1|2|3|4>
const fs = require("fs");
const N = +process.argv[2];
const THEMES = [
  "夏日戶外與安全", "廚房與料理", "商店與購物", "城市與交通", "新學期與課表",
  "天氣與季節", "圖書館與閱讀", "中秋與家人", "朋友與情緒",
  "運動與比賽", "身體與健康", "食物與營養", "動物與棲地",
  "家事與幫忙", "科技與3C", "職業與夢想", "金錢與零用錢",
  "冬天與衣物", "時間與計畫", "年度回顧複習週", "聖誕與禮物", "跨年與願望",
  "新年目標與習慣", "旅行進階", "個性與描述人", "居家與安全",
  "農曆新年與家族", "傳統與文化", "娛樂與休閒", "收心與學習方法",
  "環境與地球", "植物與昆蟲", "科學與實驗", "城市與方向", "春季複習週",
  "清明家族與戶外", "溝通與表達", "媒體與訊息", "比較與選擇",
  "世界與國家", "國中教室英語", "考試與作業英語", "意見與理由", "畢業與轉銜複習",
  "國一先修(上)", "國一先修(下)", "難字總複習A", "難字總複習B"
];
const QUOTA = w =>
  w <= 5  ? "L5-6×26＋L7×4" :
  w <= 13 ? "L5-6×22＋L7×8" :
  w <= 22 ? "L5-6×16＋L7×12＋L8×2" :
  w <= 35 ? "L5-6×10＋L7×14＋L8×6" :
  w <= 44 ? "L5-6×6＋L7×14＋L8×10" :
            "L7×10＋L8×10＋複習×10";
const weeks = fs.readFileSync(__dirname + "/_year_weeks.txt", "utf8").trim().split("\n")
  .map(l => { const [w, s, e] = l.split("\t"); return { n: +w.slice(1), s, e }; });

const from = (N - 1) * 12 + 1, to = N * 12;
// 已用字（前面批次非複習字）＋ 可複習字（前面批次 L7-8）
const { wordLevel } = require("../wordlevels.js");
const used = [], reviewable = [];
for (let b = 1; b < N; b++) {
  const j = JSON.parse(fs.readFileSync(__dirname + `/_year_batch${b}.json`, "utf8"));
  j.weeks.forEach(wk => {
    const rev = new Set((wk.review || []).map(s => s.toLowerCase()));
    wk.words.forEach(w => {
      const k = w.en.toLowerCase();
      if (!rev.has(k)) {
        used.push(k);
        if ((wordLevel(k) || 0) >= 7) reviewable.push(`${k}\tW${wk.n}\t${w.zh}`);
      }
    });
  });
}
fs.writeFileSync(__dirname + "/_year_used.txt", used.sort().join("\n"));
fs.writeFileSync(__dirname + "/_year_reviewable.txt", reviewable.join("\n"));

const specs = weeks.filter(w => w.n >= from && w.n <= to).map(w => {
  const revMax = (w.n >= 45 || [20, 35, 44].includes(w.n)) ? 10 : 5;
  return `W${w.n}（${w.s}~${w.e}）主題「${THEMES[w.n - 1]}」 新字配額 ${QUOTA(w.n)}，複習最多 ${revMax} 字`;
}).join("\n");

const prompt = `# 任務：小六年度單字計畫 第 ${N} 批（W${from}~W${to}，共 12 週，每週 30 字）

為升小六的台灣小孩排週單字表。直接把結果寫檔到 kids/tools/_year_batch${N}.json，回覆只要一句「完成」＋各週主題字數統計，不要在回覆貼 JSON 內容。

## 資料檔（都在 kids/tools/）
- _year_pool.txt：候選字池（單字<TAB>級別<TAB>中文）。新字「只能」從這裡挑。
- _year_used.txt：前面批次已用掉的字，「不可」再當新字。
- _year_reviewable.txt：可當「複習字」的清單（字<TAB>首次週次<TAB>中文）；複習字只能從這挑，且本週週次 − 首次週次 ≥ 4。${N === 1 ? "（第 1 批是空的 → 全部用新字，review 給空陣列）" : ""}

## 每週規則
- 恰好 30 字 = 新字＋複習字（複習字算在 30 內）
- ≥20 字要與該週主題相關（主題掛勾幫助記憶）；其餘可為該難度段的常用字
- 新字級別配額如下表（±2 可接受；配額不足時用相鄰級別補）
- 中文 zh 用池檔提供的；池檔沒中文的字自己給簡短中文
- 每字附詞性 pos（n/v/adj/adv/prep/conj/phr）

## 本批 12 週
${specs}

## 輸出 JSON 格式（寫到 kids/tools/_year_batch${N}.json）
{"weeks":[{"n":${from},"start":"...","end":"...","theme":"...","words":[{"en":"...","zh":"...","pos":"n"}],"review":["複習字en"]}]}
- words 恰 30 個；review 列出 words 中屬於複習字的 en（可為空陣列）
- 不要動其他任何檔案
`;
fs.writeFileSync(__dirname + `/_year_batch${N}_prompt.md`, prompt);
console.log(`批次 ${N} prompt 就緒（W${from}-W${to}）；已用 ${used.length} 字、可複習 ${reviewable.length} 字`);
