# 任務：客戶對話回應題庫（100 題）

為半導體維修公司窗口出「客戶說一句 → 選最得體回應」題（電話/視訊/來訪情境）。

## 每題格式
{"id":"dg_001","tag":"場景","cue":"Any update on the repair?","cueZh":"維修有進度嗎？","choices":["We are still checking the root cause and will update you by Friday.","I don't know, the engineer not tell me.","You ask too fast, please wait."],"a":0,"why":"回應要含：現況＋下一步/期限（≤30字說明）","swap":"同情境替換句"}
- choices 3 個：1 個得體正解＋2 個台灣人真的會講的中式/失禮干擾項
- a = 正解 index（隨機放置 0~2，不要都是 0）
- tag 同前清單；情境涵蓋：問進度、催交期、問報價、殺價、問故障原因、要求借機(loaner)、約時間、聽不懂請重說、客訴抱怨、確認出貨、保固爭議、來訪接待
- 正解句長 ≤16 字、A2~B1 能講出口的
- id dg_001 ~ dg_100

寫檔 kids/tools/_p2_dialog.json：{"items":[…100 題…]}
回覆只要統計。直接產完整內容，不要佔位符，不要先探索檔案。
