**結論：不要加每日題數，改成 5 題內輪替。簡報用語要加，但只做「狀態簡報 / 口頭更新」微題型，不做完整簡報課。**

**1. 現有每日 5 題缺口與建議新增題型**

現況主體是：單字選擇、維修詞英文填空、文法選擇題、錯題複習。缺口是「看得懂」多，「能寄、能回、能說」少。

建議新增 5 類，優先順序如下：

1. **郵件一句話組裝**
   - 中文意圖 → 排序英文片語 / 補 1-2 個關鍵字。
   - 例：`請客戶提供序號` → `Could you please provide the serial number?`
   - 補足課綱 55% 郵件目標。

2. **錯句修復型文法**
   - 不問文法名稱，直接修常見錯句。
   - 例：`We still check the reason why.` → `We are still checking the root cause.`
   - 取代部分現有純選擇題。

3. **中→英維修詞 / 狀態詞**
   - 現有 `zh_terms.js` 應該進今日快練。
   - 例：`等待客戶驗證` → `waiting for customer verification`
   - 這最貼近窗口每天從中文工作流轉英文的情境。

4. **客戶對話回應**
   - 客戶問一句，選 / 組一句得體回覆。
   - 例：Customer: `Any update on the repair?`
   - Answer: `We are still checking the root cause and will update you by Friday.`
   - 對應課綱 25% 對話。

5. **聽力 / 跟讀微題**
   - 用本地 TTS 產生英文句音檔。
   - 題型：聽一句 → 選狀態、日期、下一步；或聽後補關鍵詞。
   - 不建議做語音評分，靜態網頁很難穩定批改。

**簡報用語評估：要加，但定位要窄。**

不要做「正式商務簡報」大單元。這位使用者更需要的是維修狀態口頭更新：

- `Today I’d like to give a quick update on this repair.`
- `The current status is pending verification.`
- `The main finding is a damaged relay.`
- `Next, we will run the final test.`
- `Please let me know if you have any questions.`

題型可做：
- 簡報功能配對：開場 / 轉折 / 重點 / 下一步 / 結尾。
- 句序排列：Opening → Status → Finding → Next step → Closing。
- 聽 TTS 後選「這句是在講目前狀態還是下一步」。

**2. 文法要用什麼形式練**

原則：不開文法課，只做錯誤驅動的「可寄句修復」。

建議保留少量選擇題，但主力改成這 4 種：

1. **錯句修復**
   - 顯示常見錯句，讓使用者從片語庫組出正確句。
   - 錯點標籤存在系統裡，不顯示成文法課。
   - error codes 例：`wait_for`, `by_vs_until`, `present_progressive`, `polite_request`, `passive_repaired`.

2. **一格填空**
   - 適合介系詞、固定搭配。
   - 例：`We are waiting ___ your confirmation.` → `for`

3. **片語排序**
   - 適合 A2→B1-，比自由輸入穩定，也能自動批改。
   - 例：`The unit / has been repaired / and is ready / for shipment.`

4. **中文意圖 → 限制式輸入**
   - 不做完全開放寫作。
   - 給關鍵詞或句型框架。
   - 例：`請在週五前回覆` → `Could you please reply by Friday?`

批改方式：小寫化、去標點、允許同義答案清單，不用 AI 批改。錯了就進錯題池，隔天用同錯點、不同句子再考一次。

**3. 怎麼塞進每日 5 題 × 10 分鐘**

不要加題數。維持每日 5 題，改輪替配方。

建議每日配方：

1. **錯題 / 到期複習**：單字、維修詞、文法錯點混合。
2. **新單字或維修詞**：依週主題挑。
3. **文法修復題**：錯句修復、填空、排序輪替。
4. **郵件 / 對話功能句**：依課綱週主題。
5. **聽力或口頭狀態題**：TTS 聽句、簡報用語、狀態更新輪替。

簡報用語不每天出。建議每週 1-2 題，集中在 meeting / speaking / customer update 週。它應該吃第 5 題的位置，不額外加題。

**4. 新資產需求與量估**

最小可行版：

- **郵件句型題庫**：160-220 題  
  覆蓋 request、status update、delay、quotation、RMA、shipping、apology、follow-up。

- **錯句修復文法題庫**：80-120 題  
  可從現有 40 題擴寫，每題增加 wrong sentence、correct sentence、error_code、accepted_answers。

- **中→英維修詞題庫**：先用現有 120 筆  
  需要補：aliases、常見錯答、難度、週標籤。新增資料量不大。

- **對話回應題庫**：80-120 題  
  客戶詢問、催件、確認報價、詢問 ETA、要求說明原因、安排會議。

- **簡報 / 狀態更新用語**：60 句 + 30 個 mini status scripts  
  不是完整簡報稿，而是 3-5 句口頭更新模板。

- **TTS 音檔**：約 250-400 clips  
  優先產：對話客戶句、狀態更新句、簡報功能句、常用郵件句。單字音檔不是第一優先。

**5. 不該做的項次**

不建議做：

- **每日完整簡報練習**：太重，和窗口實際高頻任務不符。改做 30-60 秒 status briefing。
- **開放式長郵件自動批改**：靜態網頁難穩定評分，容易誤判。應做句子組裝、模板填空、段落排序。
- **發音自動評分**：瀏覽器語音辨識不穩，且不是目前最高 ROI。可做 TTS 跟讀與自我檢核。
- **文法章節課**：例如現在完成式一整課、介系詞一整課。會違反「錯誤驅動」原則。
- **加到每日 7-10 題**：會破壞 10 分鐘習慣。應用輪替，不加量。
- **高階商務法務詞大量提前加入**：A2→B1- 階段應先能處理 repair status、quotation、ETA、delay、customer confirmation。
