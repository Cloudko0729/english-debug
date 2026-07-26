// 從 grammar_db 節點資料產生 NotebookLM 來源文件（餵給 NotebookLM 生 podcast / 影片）。
// 用法：node kids/tools/build_notebooklm_sources.js [F0 F1 F2 F3 F4]
//   不給參數＝全部 48 個節點；給 band 代號＝只產生那些等級。
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DB = path.join(ROOT, "grammar_db");
const OUT = path.join(DB, "notebooklm_sources");
const BANDS = ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7"];

// 各等級的固定情境（與 LESSON_PAGE_SPEC 第 3 節一致）
const BAND_SCENE = {
  F0: "家庭與小島物品", F1: "學校、寵物、問答", F2: "每日作息與正在發生的事", F3: "旅行與昨天的事件",
  F4: "城市規劃、比較與規則", F5: "經驗、選擇與條件", F6: "科學實驗、流程與報告", F7: "簡報、文章修改與自然表達",
};

// 少數帶公式的目標句改寫成白話（與 build_grammar_lessons.js 同步）
const GOAL_OVERRIDE = {
  "F2.3-present-continuous": "告訴別人現在正在做什麼",
  "F4.6-infinitive-gerund": "在常用動詞後面，選對要接哪一種動詞形式",
  "F5.1-present-perfect-experience": "說出你「曾經做過」的事，或現在還看得到的結果",
  "F5.4-first-conditional": "說出「如果⋯⋯就會⋯⋯」這種有可能發生的事",
};

function loadNodes() {
  const out = [];
  BANDS.forEach(b => {
    const d = JSON.parse(fs.readFileSync(path.join(DB, "bands", b + ".json"), "utf8"));
    (Array.isArray(d) ? d : d.nodes).forEach(n => out.push(n));
  });
  return out;
}

function render(n) {
  const goal = GOAL_OVERRIDE[n.id] || String(n.communicativeGoalZh || "").replace(/。$/, "");
  const turns = (n.dialogue && n.dialogue.turns) || [];
  const ex = n.naturalExamples || [];
  const ct = n.contrastPairs || [];
  const bugs = n.chineseTransferBugs || [];
  const speak = (n.productionTasks || []).find(t => t.type === "speaking");
  const write = (n.productionTasks || []).find(t => t.type === "writing");

  return `# ${n.titleZh} ${n.titleEn} — NotebookLM 來源文件

> 用途：把這份文件整份貼進 NotebookLM 的來源（Source），再請它產生 Audio Overview（podcast）與 Video Overview。
> 目標聽眾：國小中年級英文學習者，中文為母語。語氣請活潑、口語、像哥哥姊姊在聊天教學，不要念條列項目。
> 本課情境主題：${BAND_SCENE[n.band] || ""}

## 這堂課要教什麼

${goal}。

句型公式：**${n.form}**

今天學完，小朋友要能自己造一句像這樣的話：
「${ex[0] ? ex[0].text : ""}」

## 情境對話（可以直接當開場小劇場）

${turns.map(t => `${t.speaker}: ${t.text}`).join("\n")}

請用這段對話當開場，營造真實生活情境，再帶出文法規則。

## 自然例句

${ex.map((e, i) => `${i + 1}. ${e.text}`).join("\n")}

## 常見錯誤對照（請用「你猜猜看哪句對」的口吻帶過）

${ct.map(c => `- ❌ ${c.wrong.text} → ✅ ${c.better.text}\n  （${c.reasonZh}）`).join("\n")}

## 中文母語者最容易犯的錯（請特別強調，因為是中文直翻習慣造成的）

${bugs.map((b, i) => `${i + 1}. 「${b.zh}」常被說成 ❌ ${b.wrong.text}\n   正確：✅ ${b.better.text}\n   原因：${b.reasonZh}`).join("\n\n")}

## 小任務（podcast 結尾可以邀請小朋友一起做）

- 口說任務：${speak ? speak.prompt : ""}
- 寫作任務：${write ? write.prompt : ""}

## 給 NotebookLM 的額外提示

- 請控制長度在 3-5 分鐘（podcast）或 2-3 分鐘（影片），適合小學生的專注長度。
- 可以用遊戲化的開場（例如當小偵探、闖關、解謎）吸引注意力。
- 請避免使用過於學術的文法術語，改用小學生聽得懂的說法。
- 結尾請重複一次今天的句型公式，加深印象。
`;
}

function main() {
  const want = process.argv.slice(2).map(s => s.toUpperCase());
  const nodes = loadNodes().filter(n => !want.length || want.includes(n.band));
  fs.mkdirSync(OUT, { recursive: true });
  nodes.forEach(n => fs.writeFileSync(path.join(OUT, n.id + ".md"), render(n), "utf8"));
  console.log(JSON.stringify({
    ok: true, generated: nodes.length,
    bands: [...new Set(nodes.map(n => n.band))].sort(),
    out: path.relative(process.cwd(), OUT),
  }, null, 2));
}

main();
