# 任務：郵件一句話組裝題庫 第 {N} 批（90 題）

為半導體維修公司窗口（A2→B1-）出「中文意圖 → 組裝英文句」題。
形式：顯示中文（例：請客戶提供序號），使用者把打亂的詞塊點回正確順序。

## 每題格式
{"id":"em_{N}_001","tag":"場景","zh":"請提供機台序號","chunks":["Could you please","provide","the serial number","of the unit?"],"why":"一句話說明句型重點（≤30字）","swap":"同句型可套用的另一句"}
- chunks 3~5 塊，join(" ") 後必須是一句自然完整的商務英文（含結尾標點）
- 詞塊切分要照「意群」切（主詞組/動詞組/受詞組/時間），不要一字一塊
- tag 從這選：general/repair/quotation/delivery/parts/service/payment/logistics/office/meeting
- 難度：A2~B1，句長 6~12 字；同場景由簡到難
- id 用 em_{N}_001 ~ em_{N}_090

## 本批涵蓋場景（{SCOPE}）
{SCENES}

寫檔 kids/tools/_p2_email{N}.json：{"items":[…90 題…]}
回覆只要統計。直接產完整內容，不要佔位符，不要先探索檔案。
