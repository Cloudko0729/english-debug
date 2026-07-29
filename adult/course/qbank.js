// 句型文法題庫（種子 40 題；題型 A 自然句二選一 / B 搭配詞挖空 / C 時態情境 / D 禮貌改寫）
// 出題原則：測「哪句像真人商務信」，不教抽象文法；答錯給 30 字微解說＋替換句。
// tag 對應 vocab.js 場景；之後每週可續擴。
const GRAMMAR_QS = [
 {
   id: "a01",
   type: "A",
   tag: "general",
   q: "哪一句比較自然？",
   c: ["Please kindly provide us the quotation.", "Could you please send us the quotation?"],
   a: 1,
   why: "Could you please…? 是最自然的商務請求。Please kindly 是老式套語，能不用就不用。",
   swap: "Could you please send us the updated invoice?"
 },
 {
   id: "a02",
   type: "A",
   tag: "general",
   q: "回覆客戶來信，第一句哪個自然？",
   c: ["Thank you for your email.", "Thanks your email."],
   a: 0,
   why: "Thank you for ＋名詞。少了 for 是常見中式寫法。",
   swap: "Thank you for your quick reply."
 },
 {
   id: "a03",
   type: "A",
   tag: "repair",
   q: "說明「還在查原因」，哪句自然？",
   c: ["We are still checking the root cause.", "We still check the reason why."],
   a: 0,
   why: "進行中的動作用 are checking；root cause 是工程慣用詞。",
   swap: "We are still verifying the failure symptom."
 },
 {
   id: "a04",
   type: "A",
   tag: "delivery",
   q: "告知交期，哪句自然？",
   c: ["The delivery day probably need two weeks.", "The estimated lead time is about two weeks."],
   a: 1,
   why: "lead time 是交期慣用詞；estimated＋is 結構穩。",
   swap: "The estimated repair time is about five working days."
 },
 {
   id: "a05",
   type: "A",
   tag: "service",
   q: "請對方稍等，哪句自然？",
   c: ["Please wait us a few days more.", "Please allow us a few more days to complete the test."],
   a: 1,
   why: "allow us＋時間＝請給我們…時間。wait us 是直翻錯誤（wait 不接受詞）。",
   swap: "Please allow us two more days to confirm the result."
 },
 {
   id: "a06",
   type: "A",
   tag: "quotation",
   q: "報價信結尾，哪句自然？",
   c: ["Please review the attached quotation and let us know your decision.", "Please see quotation and tell me yes or no."],
   a: 0,
   why: "review the attached＋文件名；let us know your decision 委婉專業。",
   swap: "Please review the attached report and let us know your comments."
 },
 {
   id: "a07",
   type: "A",
   tag: "repair",
   q: "維修完成通知，哪句自然？",
   c: ["The unit has been repaired and is ready for shipment.", "The unit already repair finish and can ship."],
   a: 0,
   why: "has been repaired（完成被動）＋ is ready for＝標準完工通知句。",
   swap: "The board has been repaired and is ready for the final test."
 },
 {
   id: "a08",
   type: "A",
   tag: "parts",
   q: "詢問料件，哪句自然？",
   c: ["Please tell me this part how much and when.", "Could you please quote the price and lead time for this part?"],
   a: 1,
   why: "quote the price and lead time＝詢價固定搭配。",
   swap: "Could you please quote the price and availability for PN 12345?"
 },
 {
   id: "a09",
   type: "A",
   tag: "delivery",
   q: "延遲道歉，哪句自然？",
   c: ["We are sorry to let you wait so long time.", "We apologize for the delay."],
   a: 1,
   why: "apologize for the delay 是最短最專業的道歉句。",
   swap: "We apologize for the late reply."
 },
 {
   id: "a10",
   type: "A",
   tag: "general",
   q: "承諾回覆時間，哪句自然？",
   c: ["We will update you by Friday.", "We will give you answer until Friday."],
   a: 0,
   why: "update you by＋時間＝最晚何時回覆。until 是「持續到」，用錯意思相反。",
   swap: "We will update you by the end of this week."
 },
 {
   id: "a11",
   type: "A",
   tag: "repair",
   q: "描述故障，哪句自然？",
   c: ["The unit fails intermittently during the burn-in test.", "The unit sometimes bad when test."],
   a: 0,
   why: "fails intermittently＝間歇性故障，工程報告標準說法。",
   swap: "The board fails intermittently at high temperature."
 },
 {
   id: "a12",
   type: "A",
   tag: "meeting",
   q: "會議開場確認議程，哪句自然？",
   c: ["Today we would like to discuss the repair schedule.", "Today we want talk about repair schedule."],
   a: 0,
   why: "would like to＝比 want 客氣；discuss 後面直接接受詞，不加 about。",
   swap: "Today we would like to discuss the test result."
 },
 {
   id: "b01",
   type: "B",
   tag: "general",
   q: "We are waiting ___ your confirmation.",
   c: ["on", "for", "to"],
   a: 1,
   why: "wait for＋人/物。",
   swap: "We are waiting for your reply."
 },
 {
   id: "b02",
   type: "B",
   tag: "delivery",
   q: "The unit will be sent to the customer ___ verification.",
   c: ["to", "for", "with"],
   a: 1,
   why: "sent for verification＝送去驗證（目的用 for）。",
   swap: "The sample was sent for analysis."
 },
 {
   id: "b03",
   type: "B",
   tag: "general",
   q: "Thank you ___ your quick reply.",
   c: ["for", "to", "of"],
   a: 0,
   why: "thank you for＋名詞。",
   swap: "Thank you for your support."
 },
 {
   id: "b04",
   type: "B",
   tag: "repair",
   q: "The failure is related ___ the power module.",
   c: ["to", "of", "with"],
   a: 0,
   why: "related to＝與…有關。",
   swap: "This issue is related to the firmware version."
 },
 {
   id: "b05",
   type: "B",
   tag: "delivery",
   q: "We will ship the unit ___ the end of this week.",
   c: ["until", "by", "at"],
   a: 1,
   why: "by＋時間＝最晚在…之前。",
   swap: "Please reply by Wednesday."
 },
 {
   id: "b06",
   type: "B",
   tag: "quotation",
   q: "Please refer ___ the attached quotation.",
   c: ["on", "to", "with"],
   a: 1,
   why: "refer to＝參閱。",
   swap: "Please refer to the test report."
 },
 {
   id: "b07",
   type: "B",
   tag: "repair",
   q: "The unit passed the functional test ___ any errors.",
   c: ["with no", "without", "not have"],
   a: 1,
   why: "without any errors＝無任何錯誤。",
   swap: "The board completed the burn-in without any failures."
 },
 {
   id: "b08",
   type: "B",
   tag: "service",
   q: "Please feel free to contact me ___ any time.",
   c: ["at", "on", "in"],
   a: 0,
   why: "at any time＝隨時。",
   swap: "You can reach me at any time."
 },
 {
   id: "b09",
   type: "B",
   tag: "parts",
   q: "This part is out ___ stock now.",
   c: ["in", "from", "of"],
   a: 2,
   why: "out of stock＝缺貨。",
   swap: "The component is out of stock at the OEM."
 },
 {
   id: "b10",
   type: "B",
   tag: "repair",
   q: "We replaced the fuse ___ a new one.",
   c: ["with", "to", "by"],
   a: 0,
   why: "replace A with B＝把 A 換成 B。",
   swap: "We replaced the damaged relay with a new one."
 },
 {
   id: "b11",
   type: "B",
   tag: "meeting",
   q: "Let's schedule a meeting ___ next Tuesday.",
   c: ["to", "for", "in"],
   a: 1,
   why: "schedule…for＋時間＝排定在。",
   swap: "The demo is scheduled for Friday morning."
 },
 {
   id: "b12",
   type: "B",
   tag: "general",
   q: "Please keep us informed ___ the status.",
   c: ["of", "to", "for"],
   a: 0,
   why: "keep…informed of＝隨時告知。",
   swap: "We will keep you informed of the progress."
 },
 {
   id: "c01",
   type: "C",
   tag: "delivery",
   q: "「我們已經寄出替換品」，回信該用哪句？",
   c: ["We ship the replacement.", "We are ship the replacement.", "We have shipped the replacement."],
   a: 2,
   why: "已完成且跟現在有關→ have shipped。",
   swap: "We have sent the revised quotation."
 },
 {
   id: "c02",
   type: "C",
   tag: "repair",
   q: "「目前正在測試中」，哪句對？",
   c: ["The unit is under testing now.", "The unit tested now.", "The unit will test now."],
   a: 0,
   why: "under testing／being tested＝正在測。",
   swap: "The board is under repair now."
 },
 {
   id: "c03",
   type: "C",
   tag: "repair",
   q: "「昨天收到你們的機台」，哪句對？",
   c: ["We received your unit yesterday.", "We have received your unit yesterday.", "We receive your unit yesterday."],
   a: 0,
   why: "有明確過去時間（yesterday）用過去式，不用 have。",
   swap: "We received the parts last Friday."
 },
 {
   id: "c04",
   type: "C",
   tag: "delivery",
   q: "「下週會安排出貨」，哪句對？",
   c: ["We arranged the shipment next week.", "We arrange the shipment next week already.", "We will arrange the shipment next week."],
   a: 2,
   why: "未來計畫用 will＋原形。",
   swap: "We will arrange the final test next Monday."
 },
 {
   id: "c05",
   type: "C",
   tag: "repair",
   q: "「這問題以前也發生過」，哪句對？",
   c: ["This issue happened before yesterday.", "This issue is happen before.", "This issue has happened before."],
   a: 2,
   why: "經驗（發生過）用 has happened；before 不接特定時間。",
   swap: "This symptom has appeared before on the same model."
 },
 {
   id: "c06",
   type: "C",
   tag: "quotation",
   q: "「報價單已附上」，哪句對？",
   c: ["The quotation is attached.", "The quotation attaches.", "The quotation attached it."],
   a: 0,
   why: "is attached（被動）＝已附上。也可 Please find the attached quotation。",
   swap: "The test report is attached for your reference."
 },
 {
   id: "c07",
   type: "C",
   tag: "service",
   q: "「如果測試通過我們就出貨」，哪句對？",
   c: ["If the test will pass, we arrange the shipment.", "If the test passes, we will arrange the shipment.", "If the test passed, we will arranged it."],
   a: 1,
   why: "條件句：if＋現在式，主句 will。",
   swap: "If the parts arrive this week, we will finish the repair by Friday."
 },
 {
   id: "c08",
   type: "C",
   tag: "repair",
   q: "「修好前會先跟你確認費用」，哪句對？",
   c: ["We confirm with you the cost before repaired.", "We will confirm the cost with you before the repair.", "We will confirmed the cost before repair it."],
   a: 1,
   why: "confirm A with B＝跟 B 確認 A；before＋名詞。",
   swap: "We will confirm the schedule with you before the visit."
 },
 {
   id: "d01",
   type: "D",
   tag: "general",
   q: "把「Send me the tracking number.」改得適合商務信：",
   c: ["Send me the tracking number now.", "Could you please send me the tracking number?", "You must send me the tracking number."],
   a: 1,
   why: "要求對方動作→ Could you please…?",
   swap: "Could you please confirm the delivery date?"
 },
 {
   id: "d02",
   type: "D",
   tag: "quotation",
   q: "把「Answer me about the quotation.」改禮貌：",
   c: ["Tell me about quotation.", "Answer the quotation quickly.", "May I have your feedback on the quotation?"],
   a: 2,
   why: "催回覆用 May I have your feedback on…?（軟）。",
   swap: "May I have your comments on the proposal?"
 },
 {
   id: "d03",
   type: "D",
   tag: "delivery",
   q: "把「We can't ship this week.」說得更緩和：",
   c: ["Shipping is impossible this week.", "We can not ship. Sorry.", "I'm afraid the shipment will be delayed to next week."],
   a: 2,
   why: "壞消息用 I'm afraid＋事實＋新時間。",
   swap: "I'm afraid the repair will take a few more days."
 },
 {
   id: "d04",
   type: "D",
   tag: "service",
   q: "把「What do you want?」用在詢問需求：",
   c: ["Could you let us know your requirements?", "What do you want exactly?", "Tell me your want."],
   a: 0,
   why: "詢問需求→ let us know your requirements。",
   swap: "Could you let us know your expected schedule?"
 },
 {
   id: "d05",
   type: "D",
   tag: "parts",
   q: "把「Give me the part number.」改禮貌：",
   c: ["Give me part number please.", "Could you please provide the part number?", "I need part number, give me."],
   a: 1,
   why: "provide＝提供，搭配 Could you please。",
   swap: "Could you please provide the serial number of the unit?"
 },
 {
   id: "d06",
   type: "D",
   tag: "general",
   q: "催沒回的信，哪句得體？",
   c: ["I'm just following up on my previous email.", "Why you don't reply my email?", "You did not answer me yet."],
   a: 0,
   why: "follow up on＝跟催的標準說法，不帶指責。",
   swap: "I'm just following up on the quotation sent last week."
 },
 {
   id: "d07",
   type: "D",
   tag: "meeting",
   q: "想改會議時間，哪句得體？",
   c: ["Would it be possible to reschedule the meeting to Thursday?", "Change the meeting to Thursday.", "I want meeting Thursday."],
   a: 0,
   why: "Would it be possible to…?＝最軟的請求句型。",
   swap: "Would it be possible to extend the deadline by two days?"
 },
 {
   id: "d08",
   type: "D",
   tag: "repair",
   q: "要跟客戶多收費用，哪句得體？",
   c: ["Please note that an additional charge will apply for this repair.", "You need pay more money for this.", "This repair is expensive, you pay."],
   a: 0,
   why: "Please note that…＝提醒句；charge will apply＝將收取費用。",
   swap: "Please note that the warranty does not cover this damage."
 }
];
if (typeof module !== "undefined" && module.exports) module.exports = { GRAMMAR_QS };
