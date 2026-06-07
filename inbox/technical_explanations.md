# Technical Explanations
> 技術問題說明範例，適用於寄給客戶、原廠或內部討論。每個範例提供中文草稿、自然英文版、正式 email 版。

---

## 1. EEPROM 資料不一致

### 中文草稿
我們在測試時發現 EEPROM 內的資料和預期的 golden file 不一致，有幾個 byte 的數值對不起來。這可能是在某次燒錄過程中沒有寫入成功，或是資料在傳輸中發生錯誤。我們會重新燒錄並驗證。

### 自然英文版
During testing, we found a mismatch between the EEPROM data and the expected golden file — a few bytes are off. This could be from a failed write during a previous flash, or possibly data corruption during transfer. We'll reflash and verify.

### 正式 email 版
During our diagnostic process, we identified a data discrepancy between the EEPROM content and the reference golden file. Specifically, several byte values did not match the expected configuration.

This issue may have resulted from an incomplete write operation during a previous programming session or data corruption during transmission.

We will perform a complete EEPROM rewrite and conduct verification testing to confirm the data integrity before proceeding.

---

## 2. Checksum 錯誤

### 中文草稿
板子在啟動時出現 checksum error，代表 firmware 或 EEPROM 的某段資料在比對時對不上。這通常是資料損毀或 firmware 版本不對造成的。我們需要確認是哪一段資料有問題，再決定要怎麼處理。

### 自然英文版
The board is throwing a checksum error on boot, which means something in the firmware or EEPROM isn't matching what it expects. Usually this points to data corruption or a firmware version mismatch. We need to figure out which section is failing before we can fix it.

### 正式 email 版
Upon power-up, the unit is generating a checksum error, indicating that one or more data segments in the firmware or EEPROM do not match the expected values.

This condition is typically caused by data corruption or a firmware version incompatibility. We are currently investigating which specific segment is affected to determine the appropriate corrective action.

We will provide a detailed update once the root cause has been confirmed.

---

## 3. 問題只在特定條件下重現

### 中文草稿
這個問題我們在測試台上測試了很多次，大部分情況下都是正常的，只有在特定條件下才會出現。目前懷疑是在高溫或特定信號時序下才會觸發。我們還在縮小範圍，需要更多時間確認。

### 自然英文版
We've run the board through our standard tests multiple times and it behaves normally most of the time. The issue only shows up under specific conditions — we suspect it might be temperature-related or tied to a particular signal timing. Still narrowing it down, so we'll need a bit more time.

### 正式 email 版
Our team has conducted extensive testing on the unit; however, the reported failure has proven difficult to reproduce consistently. The issue appears to occur only under specific operating conditions.

Current analysis suggests the failure may be related to elevated operating temperatures or specific signal timing parameters. We are continuing our investigation to identify the precise trigger condition.

We appreciate your patience and will provide a follow-up once we have further findings.

---

## 4. Firmware 版本不符

### 中文草稿
我們確認了板子上燒的 firmware 版本是 v1.2.3，但這個型號目前應該要用 v1.3.0。版本不對的話有些功能可能會有問題，或是在對接新模組時會不相容。建議我們先把 firmware 升級到正確版本再做後續測試。

### 自然英文版
Checked the board — it's running firmware v1.2.3, but this model should be on v1.3.0. The older version might cause issues with certain functions or create compatibility problems when connecting to newer modules. We should update it to the correct version before continuing with testing.

### 正式 email 版
Upon inspection, we identified that the unit is currently running firmware version v1.2.3. However, the correct firmware version for this model is v1.3.0.

Using an outdated firmware version may result in functional anomalies or compatibility issues when interfacing with current peripheral modules.

We recommend upgrading the firmware to v1.3.0 prior to further testing. Please advise if you have any concerns or specific requirements regarding this update.

---

## 5. 複製板與原板資料比對

### 中文草稿
我們把這塊板子的 EEPROM 資料跟原板（golden board）做比對，發現有幾個位置的值不一樣。目前在確認這些差異是預期中的出廠設定差異，還是有問題的資料。如果是有問題的資料，我們需要重新燒錄。

### 自然英文版
We did a data comparison between this board's EEPROM and the golden board, and there are a few values that don't match. We're checking now whether those differences are expected calibration offsets or actual bad data. If it turns out to be corrupted data, we'll need to reflash.

### 正式 email 版
We have performed a data comparison between the EEPROM content of the suspect unit and the reference golden board.

The comparison revealed discrepancies at several memory locations. We are currently analyzing whether these differences represent expected factory calibration variations or indicate data corruption.

If the discrepancies are confirmed to be erroneous, we will proceed with reprogramming the EEPROM to restore the correct data. We will update you with our findings.
