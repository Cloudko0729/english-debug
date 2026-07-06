# 任務：為 1222 個英文單字定難度級別

讀取 `kids/tools/_unleveled.txt`（格式：`單字<TAB>中文`，每行一個），為每個單字定級，寫出 JSON 檔到 `kids/tools/_extra_levels.json`。

## 分級標準（參照台灣國小 1200 字分級制）
- 1~2 級：國小低年級就會的超基礎字（a, cat, big, run）
- 3~4 級：國小中年級（family, breakfast, weather, homework）
- 5 級：國小高年級常用（answer, practice, remember, question）
- 6 級：國小高年級進階（because, different, important, decide）
- 7 級：國小畢業～國中入門（avoid, exercise, healthy, medicine, future）
- 8 級：國中以上/超出國小 1200 字範圍（ability, achieve, environment, opportunity）

這批字大多是國中基本字（多數會落在 7~8），但其中夾雜一些其實很簡單的變體或常見字，請照實際難度給，不要一律給 8。

## 輸出
寫檔 `kids/tools/_extra_levels.json`，格式：
```json
{"ability": 8, "abroad": 8, "mommy": 3, ...}
```
- key 全小寫、與輸入檔一致
- 1222 個字每個都要有
- 只寫這個 JSON 檔，不要動其他檔案，不要在回覆貼完整內容（回覆只需說明完成與統計各級數量）
