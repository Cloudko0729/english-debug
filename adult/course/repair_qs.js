// 錯句修復題庫：顯示中式錯句 → 點詞塊組出正確句。
// error_code 分組；答錯後隔天出「同錯點、不同句子」。每碼 3 句變體。
const REPAIR_QS = [
  // wait_for：wait 直接接受詞（中式：等你回覆）
  { id: "rf_waitfor_1", code: "wait_for", tag: "general", wrong: "We are waiting your confirmation.", chunks: ["We are waiting", "for", "your confirmation."], zh: "我們在等你的確認", why: "wait 後面要加 for 才能接人/物。", swap: "We are waiting for your reply." },
  { id: "rf_waitfor_2", code: "wait_for", tag: "parts", wrong: "We are still waiting the parts from the OEM.", chunks: ["We are still waiting", "for the parts", "from the OEM."], zh: "我們還在等原廠的料件", why: "wait for the parts。少了 for 是最常見的直翻錯。", swap: "We are waiting for the test result." },
  { id: "rf_waitfor_3", code: "wait_for", tag: "quotation", wrong: "The customer is waiting our quotation.", chunks: ["The customer is waiting", "for", "our quotation."], zh: "客戶在等我們的報價", why: "wait for＋報價/回覆/料件，for 不能省。", swap: "They are waiting for our confirmation." },
  // by_deadline：until 誤用（中式：直到週五回覆）
  { id: "rf_by_1", code: "by_deadline", tag: "general", wrong: "We will update you until Friday.", chunks: ["We will update you", "by", "Friday."], zh: "我們最晚週五回覆你", why: "「最晚何時完成」用 by；until 是「持續到」，意思整個相反。", swap: "Please reply by Wednesday." },
  { id: "rf_by_2", code: "by_deadline", tag: "delivery", wrong: "The unit will be shipped until the end of this week.", chunks: ["The unit will be shipped", "by", "the end of this week."], zh: "機台最晚本週末前出貨", why: "一次性動作的期限用 by。", swap: "The repair will be completed by next Monday." },
  { id: "rf_by_3", code: "by_deadline", tag: "quotation", wrong: "Please confirm the quotation until tomorrow.", chunks: ["Please confirm the quotation", "by", "tomorrow."], zh: "請最晚明天確認報價", why: "請對方在期限前做完某事 → by＋時間。", swap: "Please send the PO by Friday." },
  // thank_for：Thanks your email
  { id: "rf_thank_1", code: "thank_for", tag: "general", wrong: "Thanks your email.", chunks: ["Thank you", "for", "your email."], zh: "謝謝你的來信", why: "thank you for＋名詞，for 不能省。", swap: "Thank you for your quick reply." },
  { id: "rf_thank_2", code: "thank_for", tag: "service", wrong: "Thank you your support all the time.", chunks: ["Thank you", "for your support", "as always."], zh: "一直以來謝謝你的支持", why: "for 之外，「一直以來」用 as always 比 all the time 自然。", swap: "Thank you for your patience." },
  { id: "rf_thank_3", code: "thank_for", tag: "meeting", wrong: "Thanks your time today.", chunks: ["Thank you", "for your time", "today."], zh: "謝謝你今天撥空", why: "會議結尾金句：Thank you for your time.", swap: "Thank you for joining the meeting." },
  // be_ving：進行式漏 be 或漏 ing
  { id: "rf_ving_1", code: "be_ving", tag: "repair", wrong: "We still checking the root cause.", chunks: ["We are", "still checking", "the root cause."], zh: "我們還在查根本原因", why: "進行式 be＋V-ing 是一組，漏 are 是高頻錯。", swap: "We are still verifying the symptom." },
  { id: "rf_ving_2", code: "be_ving", tag: "repair", wrong: "The engineer is analyze the failure now.", chunks: ["The engineer is", "analyzing", "the failure now."], zh: "工程師正在分析故障", why: "is 後面要接 V-ing：is analyzing。", swap: "Our team is testing the board now." },
  { id: "rf_ving_3", code: "be_ving", tag: "status", wrong: "The unit is test in the chamber.", chunks: ["The unit is", "being tested", "in the chamber."], zh: "機台正在腔體裡測試", why: "「正在被測」用 is being tested；至少要 is under test。", swap: "The board is being repaired now." },
  // polite_request：命令句直翻
  { id: "rf_polite_1", code: "polite_request", tag: "general", wrong: "Send me the serial number.", chunks: ["Could you please", "send me", "the serial number?"], zh: "請提供序號", why: "要求對方動作 → Could you please…?", swap: "Could you please provide the error log?" },
  { id: "rf_polite_2", code: "polite_request", tag: "parts", wrong: "Give me the part number and quantity.", chunks: ["Could you please provide", "the part number", "and quantity?"], zh: "請提供料號與數量", why: "give me → provide 更專業，搭配 Could you please。", swap: "Could you please provide the model name and quantity?" },
  { id: "rf_polite_3", code: "polite_request", tag: "delivery", wrong: "Tell me when you can ship it.", chunks: ["Could you please let me know", "when you can", "ship it?"], zh: "請告知何時能出貨", why: "tell me → let me know 較軟；完整句型 Could you please let me know…?", swap: "Could you please let me know the expected delivery date?" },
  // passive_done：維修完成的被動完成式
  { id: "rf_passive_1", code: "passive_done", tag: "repair", wrong: "The unit already repair finish.", chunks: ["The unit", "has been repaired", "and is ready for shipment."], zh: "機台已修好可出貨", why: "完工通知固定句：has been repaired（完成＋被動）。", swap: "The board has been repaired and passed the final test." },
  { id: "rf_passive_2", code: "passive_done", tag: "repair", wrong: "The board was repair complete yesterday.", chunks: ["The board", "was repaired", "yesterday."], zh: "板子昨天修好了", why: "有明確過去時間 → was repaired；不要堆 complete。", swap: "The unit was repaired and shipped last Friday." },
  { id: "rf_passive_3", code: "passive_done", tag: "test", wrong: "The final test already done by us.", chunks: ["The final test", "has been completed."], zh: "最終測試已完成", why: "has been completed；already 可省，by us 多餘。", swap: "The verification has been completed." },
  // replace_with：更換的搭配
  { id: "rf_replace_1", code: "replace_with", tag: "repair", wrong: "We changed a new fuse for the old one.", chunks: ["We replaced", "the fuse", "with a new one."], zh: "我們把保險絲換新", why: "replace A with B＝把 A 換成 B；change a new X 是直翻。", swap: "We replaced the damaged relay with a new one." },
  { id: "rf_replace_2", code: "replace_with", tag: "parts", wrong: "The capacitor was changed to new.", chunks: ["The capacitor", "was replaced", "with a new one."], zh: "電容已換新", why: "被動版：was replaced with a new one。", swap: "The connector was replaced with a new one." },
  { id: "rf_replace_3", code: "replace_with", tag: "repair", wrong: "We suggest change the whole module.", chunks: ["We suggest", "replacing", "the whole module."], zh: "我們建議整個模組換掉", why: "suggest＋V-ing：suggest replacing。", swap: "We suggest replacing the power supply." },
  // related_to：與…有關
  { id: "rf_related_1", code: "related_to", tag: "repair", wrong: "The failure is related with the power module.", chunks: ["The failure", "is related to", "the power module."], zh: "故障跟電源模組有關", why: "related to，不是 related with。", swap: "This issue is related to the firmware version." },
  { id: "rf_related_2", code: "related_to", tag: "repair", wrong: "This issue maybe about the copied board.", chunks: ["This issue", "may be related to", "the copied board."], zh: "這問題可能跟複製板有關", why: "「可能有關」→ may be related to；maybe 是副詞不能當動詞。", swap: "The symptom may be related to the thermal sensor." },
  { id: "rf_related_3", code: "related_to", tag: "test", wrong: "The error has relation of the test program.", chunks: ["The error", "is related to", "the test program."], zh: "錯誤跟測試程式有關", why: "直接用 is related to，不要 has relation of。", swap: "The fail code is related to the calibration data." },
  // update_status：回報進度句
  { id: "rf_update_1", code: "update_status", tag: "status", wrong: "I will report you the progress tomorrow.", chunks: ["I will update you", "on the progress", "tomorrow."], zh: "我明天跟你回報進度", why: "update you on＋事情；report to you 也可但 update 更常用。", swap: "We will update you on the test result on Friday." },
  { id: "rf_update_2", code: "update_status", tag: "status", wrong: "Any update I will tell you soon.", chunks: ["We will keep you", "informed of", "any updates."], zh: "有進度會隨時告知", why: "keep you informed of＝隨時告知的固定句。", swap: "We will keep you informed of the shipping status." },
  { id: "rf_update_3", code: "update_status", tag: "repair", wrong: "The repair status is as following.", chunks: ["The repair status", "is as follows."], zh: "維修狀態如下", why: "as follows 固定寫法（不是 as following）。", swap: "The test results are as follows." },
];
if (typeof module !== "undefined" && module.exports) module.exports = { REPAIR_QS };
