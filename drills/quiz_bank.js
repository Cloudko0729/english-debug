const QUIZ_BANK = [
  {
    type: "zh2en",
    zh: "這台機器已經維修完成並重新組裝。",
    choices: [
      "The unit has been repaired and reassembled.",
      "The unit already finished repair and assemble back.",
      "The repair item has done reassemble.",
      "The unit is repaired complete and combine again."
    ],
    answer: "The unit has been repaired and reassembled.",
    tag: "repair_status"
  },
  {
    type: "zh2en",
    zh: "這台設備將送交客戶確認測試。",
    choices: [
      "The unit will be sent to the customer for verification.",
      "The unit will send to customer verify.",
      "The customer will verify by sending the unit.",
      "The unit will be sent customer to validate."
    ],
    answer: "The unit will be sent to the customer for verification.",
    tag: "customer_verification"
  },
  {
    type: "zh2en",
    zh: "我們無法在相同條件下重現這個問題。",
    choices: [
      "The issue could not be reproduced under the same conditions.",
      "The issue could not reproduce in same condition.",
      "We cannot make the issue happen under same environment.",
      "The issue was not happened with the same condition."
    ],
    answer: "The issue could not be reproduced under the same conditions.",
    tag: "technical_debug"
  },
  {
    type: "zh2en",
    zh: "請提供 RMA 編號，以便我們安排退回出貨。",
    choices: [
      "Could you provide the RMA number so we can proceed with the return shipment?",
      "Please give RMA number for we can send back.",
      "Could you provide RMA number to us arrange return goods?",
      "Please confirm us the RMA number then we ship back."
    ],
    answer: "Could you provide the RMA number so we can proceed with the return shipment?",
    tag: "rma_return"
  },
  {
    type: "zh2en",
    zh: "這個問題需要升級到產品團隊處理。",
    choices: [
      "This issue needs to be escalated to the product team.",
      "This issue needs escalate product team handle.",
      "We need upgrade this issue to product team.",
      "This issue should be raised up for product team."
    ],
    answer: "This issue needs to be escalated to the product team.",
    tag: "escalation"
  },
  {
    type: "zh2en",
    zh: "由於需要額外測試來確認根因，分析時間比預期更久。",
    choices: [
      "The analysis is taking longer than expected because we need to run additional tests to confirm the root cause.",
      "The analysis takes more long because need additional test to confirm root cause.",
      "Because we need more test, the analysis is over expected time.",
      "The analysis is delayed due needs extra testing for confirm root reason."
    ],
    answer: "The analysis is taking longer than expected because we need to run additional tests to confirm the root cause.",
    tag: "delay_apology"
  },
  {
    type: "zh2en",
    zh: "根因確認為 EEPROM 資料損毀，原因是不完整的寫入動作。",
    choices: [
      "The root cause was confirmed to be EEPROM data corruption due to an incomplete write operation.",
      "The root cause confirmed EEPROM data broken because write not complete.",
      "The EEPROM data corruption was validate from incomplete writing.",
      "We confirm the root reason is EEPROM data damage by not full write."
    ],
    answer: "The root cause was confirmed to be EEPROM data corruption due to an incomplete write operation.",
    tag: "root_cause_report"
  },
  {
    type: "zh2en",
    zh: "我們已使用正確的 golden file 重新燒錄 EEPROM，並驗證資料完整性。",
    choices: [
      "We have reflashed the EEPROM with the correct golden file and verified the data integrity.",
      "We have reflash EEPROM by correct golden file and verify data complete.",
      "We did EEPROM again with golden file and checked data is integrity.",
      "We validated EEPROM golden file to make data integrity correct."
    ],
    answer: "We have reflashed the EEPROM with the correct golden file and verified the data integrity.",
    tag: "root_cause_report"
  },
  {
    type: "zh2en",
    zh: "請確認目前安裝在這台設備上的 firmware 版本。",
    choices: [
      "Please confirm the firmware version currently installed on the unit.",
      "Please confirm what firmware version install in the unit now.",
      "Please validate the unit current firmware version with us.",
      "Please check us the firmware version currently on the unit."
    ],
    answer: "Please confirm the firmware version currently installed on the unit.",
    tag: "part_number_and_spec"
  },
  {
    type: "zh2en",
    zh: "請確認這個替代料是否符合原始規格。",
    choices: [
      "Please confirm that the substitute part meets the original specification.",
      "Please confirm the substitute part can match original spec or not.",
      "Please verify if this replace part is same original specification.",
      "Please check this substitute material meet original spec."
    ],
    answer: "Please confirm that the substitute part meets the original specification.",
    tag: "part_number_and_spec"
  },
  {
    type: "zh2en",
    zh: "這個問題是間歇性的，無法穩定重現。",
    choices: [
      "The issue occurs intermittently and cannot be reproduced consistently.",
      "The issue is sometimes happened and cannot reproduce stable.",
      "This issue occurs not every time and cannot reproduce consistent.",
      "The issue is intermittent and cannot be happened every test."
    ],
    answer: "The issue occurs intermittently and cannot be reproduced consistently.",
    tag: "intermittent_issue"
  },
  {
    type: "zh2en",
    zh: "請在方便時提供更新，我們會非常感謝。",
    choices: [
      "We would appreciate an update when you have a moment.",
      "We will appreciate you update when you have time.",
      "Please update us when you are convenient.",
      "We are appreciated if you can update in your moment."
    ],
    answer: "We would appreciate an update when you have a moment.",
    tag: "polite_requests"
  },
  {
    type: "zh2en",
    zh: "維修完成後，我們會安排出貨。",
    choices: [
      "We will arrange the shipment once the repair is complete.",
      "We will arrange shipment after repair complete.",
      "After repaired complete, we arrange the delivery.",
      "We will ship arrangement once repair finished."
    ],
    answer: "We will arrange the shipment once the repair is complete.",
    tag: "schedule_and_delivery"
  },
  {
    type: "zh2en",
    zh: "郵件主旨：SN 12345 的 LVDS 訊號異常，需要提供 log file 與 firmware 版本。",
    choices: [
      "[Action Required] SN 12345 - Please Provide Log File and Firmware Version for LVDS Issue",
      "SN 12345 LVDS abnormal need log file firmware version",
      "[Need Action] Please give log and firmware for SN 12345 LVDS problem",
      "About SN 12345 - Customer verify LVDS and firmware."
    ],
    answer: "[Action Required] SN 12345 - Please Provide Log File and Firmware Version for LVDS Issue",
    tag: "email_subject_lines"
  },
  {
    type: "bugfix",
    prompt: "The repair item will send to customer verify.",
    choices: [
      "The repaired unit will be sent to the customer for verification.",
      "The repair item will send to customer verify.",
      "The repaired item will send customer to verify.",
      "The repair unit will be sent to customer validate."
    ],
    answer: "The repaired unit will be sent to the customer for verification.",
    note: "設備用 unit；被送出要用 will be sent；客戶確認測試用 for verification。",
    tag: "verify_validate_confirm"
  },
  {
    type: "bugfix",
    prompt: "Please follow up this case tomorrow.",
    choices: [
      "Please follow up on this case tomorrow.",
      "Please follow up this case tomorrow.",
      "Please follow this case tomorrow.",
      "Please follow to this case tomorrow."
    ],
    answer: "Please follow up on this case tomorrow.",
    note: "follow up on + 事情，表示追蹤某個案件或問題。",
    tag: "follow_up_on"
  },
  {
    type: "bugfix",
    prompt: "Please reply us by EOD.",
    choices: [
      "Please reply to us by EOD.",
      "Please reply us by EOD.",
      "Please reply for us by EOD.",
      "Please response us by EOD."
    ],
    answer: "Please reply to us by EOD.",
    note: "reply 是不及物動詞，對某人回覆要說 reply to someone。",
    tag: "reply_to"
  },
  {
    type: "bugfix",
    prompt: "Could you confirm us the firmware version?",
    choices: [
      "Could you confirm the firmware version with us?",
      "Could you confirm us the firmware version?",
      "Could you confirm to us the firmware version?",
      "Could you validate us the firmware version?"
    ],
    answer: "Could you confirm the firmware version with us?",
    note: "confirm + 事項；若要表達跟我們確認，用 confirm ... with us。",
    tag: "confirm_with"
  },
  {
    type: "bugfix",
    prompt: "We need more 2 days to complete the verification.",
    choices: [
      "We need two more days to complete the verification.",
      "We need more 2 days to complete the verification.",
      "We need 2 days more for complete verification.",
      "We need another 2 days more to finish verify."
    ],
    answer: "We need two more days to complete the verification.",
    note: "數量要放在 more 前面：two more days；to complete + 名詞較自然。",
    tag: "delay_eta"
  },
  {
    type: "bugfix",
    prompt: "The delay is because additional testing required.",
    choices: [
      "The delay is due to additional testing required to confirm the root cause.",
      "The delay is because additional testing required.",
      "The delay is due additional testing for confirm root cause.",
      "The delay because we need test more to validate root cause."
    ],
    answer: "The delay is due to additional testing required to confirm the root cause.",
    note: "due to 後面接名詞片語；confirm the root cause 比 validate root cause 自然。",
    tag: "due_to"
  },
  {
    type: "bugfix",
    prompt: "We will escalate this issue for engineering team.",
    choices: [
      "We will escalate this issue to the engineering team.",
      "We will escalate this issue for engineering team.",
      "We will upgrade this issue to engineering team.",
      "We will escalate engineering team about this issue."
    ],
    answer: "We will escalate this issue to the engineering team.",
    note: "升級給某團隊處理用 escalate ... to + 團隊。",
    tag: "escalation"
  },
  {
    type: "bugfix",
    prompt: "Please help to expedite the review on this one.",
    choices: [
      "Please expedite the review on this one.",
      "Please help to expedite the review on this one.",
      "Please help expedite for the review on this one.",
      "Please make expedite this review on this one."
    ],
    answer: "Please expedite the review on this one.",
    note: "expedite 本身就是動詞，直接接 the review，不需要 help to。",
    tag: "expedite"
  },
  {
    type: "bugfix",
    prompt: "The test result is still pending for customer confirmation.",
    choices: [
      "The test result is still pending customer confirmation.",
      "The test result is still pending for customer confirmation.",
      "The test result still waits customer confirm.",
      "The test result is pending customer to confirm."
    ],
    answer: "The test result is still pending customer confirmation.",
    note: "pending 可直接接名詞，pending customer confirmation 表示等待客戶確認。",
    tag: "pending"
  },
  {
    type: "bugfix",
    prompt: "We will check into the LVDS abnormal behavior.",
    choices: [
      "We will look into the LVDS abnormal behavior.",
      "We will check into the LVDS abnormal behavior.",
      "We will look the LVDS abnormal behavior.",
      "We will investigate into the LVDS abnormal behavior."
    ],
    answer: "We will look into the LVDS abnormal behavior.",
    note: "look into 表示調查；check 不搭配 into。",
    tag: "look_into"
  },
  {
    type: "bugfix",
    prompt: "The FPGA team is responsible to confirm the checksum mismatch.",
    choices: [
      "The FPGA team is responsible for confirming the checksum mismatch.",
      "The FPGA team is responsible to confirm the checksum mismatch.",
      "The FPGA team is responsible confirm the checksum mismatch.",
      "The FPGA team is responsibility for confirm the checksum mismatch."
    ],
    answer: "The FPGA team is responsible for confirming the checksum mismatch.",
    note: "be responsible for + V-ing / 名詞；不是 responsible to + 原形動詞。",
    tag: "responsible_for"
  },
  {
    type: "bugfix",
    prompt: "Please confirm the part number is compatible with current hardware revision.",
    choices: [
      "Please confirm whether the part number is compatible with the current hardware revision.",
      "Please confirm the part number is compatible with current hardware revision.",
      "Please confirm if the part number can compatible with the current hardware revision.",
      "Please verify the part number whether compatible to current hardware revision."
    ],
    answer: "Please confirm whether the part number is compatible with the current hardware revision.",
    note: "confirm whether/if + 子句；compatible with 是固定搭配。",
    tag: "part_number_and_spec"
  },
  {
    type: "cloze",
    sentence: "We will follow up ___ this RMA case again by Friday.",
    answer: "on",
    note: "follow up on + 案件/問題，表示持續追蹤。",
    tag: "follow_up_on"
  },
  {
    type: "cloze",
    sentence: "The repaired unit will be sent ___ verification after the functional test.",
    answer: "for",
    note: "be sent for verification 表示被送去做確認測試。",
    tag: "customer_verification"
  },
  {
    type: "cloze",
    sentence: "Could you please reply ___ our previous email with the firmware version?",
    answer: "to",
    note: "reply to + email/person 是固定用法。",
    tag: "reply_to"
  },
  {
    type: "cloze",
    sentence: "We need to escalate this issue ___ the product team because the FPGA behavior is still abnormal.",
    answer: "to",
    note: "escalate ... to + 團隊/層級，表示升級處理。",
    tag: "escalation"
  },
  {
    type: "cloze",
    sentence: "Please confirm ___ the customer whether the issue can be reproduced on their side.",
    answer: "with",
    note: "confirm with someone 表示向某人確認。",
    tag: "confirm_with"
  },
  {
    type: "cloze",
    sentence: "The shipment has been postponed due ___ the replacement parts not arriving yet.",
    answer: "to",
    note: "due to + 名詞片語，表示原因。",
    tag: "delay_apology"
  },
  {
    type: "cloze",
    sentence: "Please ___ the review on this one because the customer is waiting for the ETA.",
    answer: "expedite",
    note: "expedite 是動詞，表示加快處理。",
    tag: "expedite"
  },
  {
    type: "cloze",
    sentence: "The test result is still ___ customer confirmation.",
    answer: "pending",
    note: "pending customer confirmation 表示等待客戶確認。",
    tag: "pending"
  },
  {
    type: "cloze",
    sentence: "We will look ___ the checksum mismatch and compare it with the golden file.",
    answer: "into",
    note: "look into 表示調查問題或異常。",
    tag: "look_into"
  },
  {
    type: "cloze",
    sentence: "The hardware team is responsible ___ confirming the LVDS connector specification.",
    answer: "for",
    note: "be responsible for + V-ing/名詞，表示負責某事。",
    tag: "responsible_for"
  }
];
