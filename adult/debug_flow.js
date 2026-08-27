// Debug 流程英文寫法（箭頭式工程紀錄）。
//
// 來源：2026-08 與 GPT 討論的一批真實維修紀錄改寫。
// 原始檔裡有同事姓名與客戶產品／機台代號，這裡一律移除或改成通用描述 ——
// 這個 repo 是公開的（GitHub Pages）。技術內容完全保留，那才是要練的東西。
//
// 為什麼獨立成一頁而不是併進句型庫：
//   句型庫練的是「寫出完整句子」，這一頁練的是「工程紀錄怎麼記」。
//   issue tracking / debug log / FA report 本來就不寫完整句，硬湊成句子反而不像業界寫法。
//   兩種都要會：對外的 email 用句型庫，對內的紀錄用這一頁。

// 統一格式：症狀 → 檢查/動作 → 發現 → 根因 → 處置 → 結果
const DEBUG_FLOW_FORMAT = {
  en: ["symptom", "check / action", "finding", "root cause", "action", "PASS / RETURN"],
  zh: ["症狀", "檢查／動作", "發現", "根本原因", "處置", "結果"],
  note: "不是每一則都會用到全部欄位，但順序固定，掃過去就知道進行到哪一步。",
};

const DEBUG_FLOW = [
  {
    id: 1, cat: "cal",
    title: "AWG CAL fail",
    zh: "AWG 校正失敗",
    flow: "circuit analysis → traced AWG function to DAC circuit → replaced DAC → PASS",
    flow_zh: "電路分析 → 追到 AWG 功能的 DAC 電路 → 更換 DAC → PASS",
    raw: "circuit analysis->DAC funtion circuit to AWG function ->replace dac",
    fix: "原句的「DAC function circuit to AWG function」方向反了。追查是從症狀往回追到元件，寫 traced A to B 時 A 是起點。",
  },
  {
    id: 2, cat: "timeout",
    title: "Channel timeout error",
    zh: "通道逾時錯誤",
    flow: "board missing after flying probe → cross-verified cable and found cable failure causing board missing → IV check found ASIC Ch97 fail → swapped channel and issue followed → RETURN",
    flow_zh: "飛針測試後偵測不到板子 → 交叉驗證線材，發現線材故障導致偵測不到 → IV 檢查發現 ASIC Ch97 故障 → 交換通道後問題跟著跑 → RETURN",
    raw: "Miss board after flying probe->corss verfiy cable fail lead miss board->IV check ASIC(Ch97) fail swap chan change->return",
    fix: "「swap chan change」意思不明。工程上要講的是「交換通道後，問題跟著移動」——issue followed 是這個現象的固定講法，代表故障在被換的那個東西上。",
  },
  {
    id: 3, cat: "cal",
    title: "DC CAL fail",
    zh: "DC 校正失敗",
    flow: "replaced ADC → power alarm on motherboard → found burned resistor causing poor ADC soldering / contact",
    flow_zh: "更換 ADC → 主機板出現電源警報 → 發現燒毀電阻造成 ADC 焊接／接觸不良",
    raw: "replace ADC -> power alarm -> resistance burned cause ADC poor solder",
    fix: "resistance 是「電阻值」，實體零件要用 resistor。另外因果方向要確認：是「電阻燒掉 → 進一步發現 ADC 虛焊」還是「ADC 虛焊造成電阻燒掉」，兩者差很多。",
  },
  {
    id: 4, cat: "power",
    title: "Power alarm",
    zh: "電源警報",
    flow: "loop unstable → traced to DCDC failure after forcing Enable pin → found alternative DCDC part has different TM pin definition",
    flow_zh: "迴路不穩 → 強制拉 Enable pin 後確認是 DCDC 故障 → 發現替代料的 DCDC，TM pin 定義不同",
    raw: "loop unstable -> force Enable pin -> DCDC fail -> alternative part TM pin different",
    fix: "「替代料」用 alternative part 或 alternate part，比 substitute part 自然。這是替代料踩雷的典型案例，值得記。",
  },
  {
    id: 5, cat: "memory",
    title: "DUT EEPROM error",
    zh: "DUT EEPROM 錯誤",
    flow: "DIMM memory init fail → checked the board manual → found memory HW configuration requires fully populated DIMMs",
    flow_zh: "DIMM 記憶體初始化失敗 → 查板子手冊 → 發現記憶體硬體配置要求 DIMM 必須插滿",
    raw: "init DIMMs memory fail->found Memory hardware config and fully populated after check board manual",
    fix: "原句的 found ... and fully populated 讀不出因果。要分清楚兩種意思：「規範要求插滿」是 requires fully populated DIMMs，「檢查後確認已經插滿」是 confirmed DIMMs were fully populated。",
  },
  {
    id: 6, cat: "missing",
    title: "Missing board",
    zh: "偵測不到板子",
    flow: "checked thermal, code, resistor array, and IV per SOP, no issue found → replaced PIC interface BGA → PASS",
    flow_zh: "依 SOP 檢查熱影像、程式、排阻與 IV，未發現異常 → 更換 PIC 介面 BGA → PASS",
    raw: "check Thermal code resistor array IV by SOP no issue -> replace PIC interface BGA -> PASS",
    fix: "「查了一輪都正常」寫成 no issue found，接著才講最後做了什麼。這則原本就寫得清楚，只補了連接詞。",
  },
  {
    id: 7, cat: "code",
    title: "Amplifier fault",
    zh: "放大器故障",
    flow: "replaced and swapped all related parts, still fail → found code issue → re-wrote code → PASS",
    flow_zh: "更換並交換所有相關零件，仍然失敗 → 發現是程式問題 → 重寫程式 → PASS",
    raw: "replace swap all related parts still fail -> code issue -> rewrite code -> PASS",
    fix: "still fail 是工程紀錄的固定講法，表示「換過了但沒好」。換料無效才轉去查程式，這個順序寫出來，別人才知道你排除過硬體。",
  },
  {
    id: 8, cat: "code",
    title: "DONE LED red",
    zh: "DONE LED 亮紅燈",
    flow: "found version issue → compared code differences between versions → checked version matching rule",
    flow_zh: "發現是版本問題 → 比對不同版本的程式差異 → 檢查版本相容規則",
    raw: "version issue -> compare the different code address -> version matching rule",
    fix: "「compare the different code address」有歧義：是比較不同版本的 code address，還是比較不同 address 裡的內容？前者要寫 compared code between versions。",
  },
  {
    id: 9, cat: "power",
    title: "Warning 2,2,1",
    zh: "警告碼 2,2,1",
    flow: "main board fail → IV check on connector found open trace to FPGA → added jumper wire → PASS",
    flow_zh: "主板故障 → 連接器 IV 檢查發現通往 FPGA 的走線開路 → 加跳線 → PASS",
    raw: "main board fail -> IV check connector open to FPGA -> jumper wire -> PASS",
    fix: "open trace 才是「走線開路」。只寫 open，讀者不知道開路的是走線、腳位還是迴路。",
  },
  {
    id: 10, cat: "power",
    title: "Diag board voltage fail",
    zh: "診斷板電壓失敗",
    flow: "channel module fail → checked connector per SOP, still fail → cross-verified and traced issue to target FPGA → replaced FPGA → PASS",
    flow_zh: "通道模組故障 → 依 SOP 檢查連接器，仍然失敗 → 交叉驗證並追到目標 FPGA → 更換 FPGA → PASS",
    raw: "channel module fail -> check connector by SOP still fail -> cross verify to target FPGA -> replace FPGA -> PASS",
    fix: "cross-verified 要說明驗了什麼、得到什麼結論，否則只是流水帳。traced issue to X 是「把問題追到 X」的標準寫法。",
  },
  {
    id: 11, cat: "solder",
    title: "PPS init all channels fail",
    zh: "PPS 全通道初始化失敗",
    flow: "found poor soldering on all DACs → re-soldered all DACs → Ch1/2/5 still fail → replaced channel DACs → PASS",
    flow_zh: "發現所有 DAC 焊接不良 → 重焊所有 DAC → Ch1/2/5 仍失敗 → 更換該通道 DAC → PASS",
    raw: "all DAC poor solder -> resolder -> Ch1/2/5 still fail -> replace DAC -> PASS",
    fix: "重焊沒好才換料，這個過程要寫出來——它證明了不是焊接問題，而是元件本身壞掉。",
  },
  {
    id: 12, cat: "solder",
    title: "PPS init all channels fail（另一台）",
    zh: "PPS 全通道初始化失敗（另一台）",
    flow: "cleaned conductive rubber strip → channel still fail → found burned diode → re-checked thermal and IV, both OK → replaced diode again → PASS",
    flow_zh: "清潔導電膠條 → 通道仍失敗 → 發現二極體燒毀 → 重新檢查熱影像與 IV，皆正常 → 再次更換二極體 → PASS",
    raw: "clean rubber strip -> channel still fail -> burned diode -> recheck Thermal IV both OK -> replace diode again -> PASS",
    fix: "rubber strip 若指連接器上的導電膠條，寫 conductive rubber strip 比較不會誤會。both OK 表示「兩項都正常」，很省字。",
  },
  {
    id: 13, cat: "solder",
    title: "DCCAL fail Ch11/13/15",
    zh: "DCCAL 失敗 Ch11/13/15",
    flow: "SOP check and replaced failed parts → Ch11 still fail → found poor soldering from previous vendor repair → replaced related parts → PASS",
    flow_zh: "依 SOP 檢查並更換失效零件 → Ch11 仍失敗 → 發現前次外包維修焊接不良 → 更換相關零件 → PASS",
    raw: "SOP check replace fail parts -> Ch11 still fail -> previous vendor repair poor solder -> replace parts -> PASS",
    fix: "previous vendor repair 點名「上一手維修留下的問題」，責任歸屬寫清楚，對後續索賠或退件有用。",
  },
  {
    id: 14, cat: "data",
    title: "DCCAL fail（資料問題）",
    zh: "DCCAL 失敗（資料問題）",
    flow: "test system data record issue → found duplicated / extra data file → removed data file → PASS",
    flow_zh: "測試系統資料紀錄問題 → 發現重複／多餘的資料檔 → 移除該檔 → PASS",
    raw: "test system data record issue -> another data file need remove",
    fix: "「another data file」沒說是哪一種。duplicated / extra 講明是重複或多出來的，別人才知道為什麼要刪。",
  },
];

// 這一批案例裡反覆出現、值得單獨記的講法
const DEBUG_FLOW_PHRASES = [
  { en: "still fail", zh: "換過／修過了但還是失敗", note: "接在動作後面，代表這一步沒解決問題。工程紀錄最常用的轉折。" },
  { en: "no issue found", zh: "查過沒發現異常", note: "比 everything is OK 精確：是「查了但沒找到」，不是「保證正常」。" },
  { en: "traced issue to", zh: "把問題追到……", note: "traced the issue to the FPGA。方向是從症狀往元件追。" },
  { en: "issue followed", zh: "問題跟著跑", note: "交換零件後問題跟著移動，代表故障在被換的那個東西上。" },
  { en: "cross-verified", zh: "交叉驗證", note: "用另一組已知良品或另一條路徑比對。要說明驗了什麼。" },
  { en: "alternative part", zh: "替代料、second source", note: "或 alternate part，都比 substitute part 自然。替代料常見的坑：pin definition 不同。" },
  { en: "fully populated", zh: "插滿（記憶體槽等）", note: "requires fully populated DIMMs（規範要求）vs. confirmed DIMMs were fully populated（檢查後確認）。" },
  { en: "poor soldering", zh: "焊接不良、虛焊", note: "poor solder 是常見誤寫；soldering 才是焊接這個動作與結果。" },
  { en: "open trace", zh: "走線開路", note: "只寫 open，不知道開路的是走線、腳位還是迴路。" },
  { en: "burned resistor", zh: "燒毀電阻", note: "resistance 是電阻值，實體零件是 resistor。" },
  { en: "per SOP", zh: "依照 SOP", note: "checked the connector per SOP。比 by SOP 正式且常見。" },
  { en: "previous vendor repair", zh: "前一手外包維修", note: "點名責任歸屬，對索賠與退件有用。" },
];

if (typeof module !== "undefined" && module.exports)
  module.exports = { DEBUG_FLOW, DEBUG_FLOW_PHRASES, DEBUG_FLOW_FORMAT };
