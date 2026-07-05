# Generate Daily Drill Prompt

用途：根據最近的句子和常犯錯，產生今日 10 分鐘練習。

---

## 使用方式

說「請產生今日英文訓練」，Claude Code 會：

1. 讀取 inbox/ 最近的句子
2. 讀取 mistakes/ 的常見 bug
3. 產生符合格式的 drills/daily_10min.md
