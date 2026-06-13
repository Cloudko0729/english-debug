# Saves 進度備份

放每個學生的雲端存檔，給「☁️ 從雲端還原」用。

## 怎麼用

1. 在島嶼頁（任一裝置）按 **⬇️ 匯出備份**，下載 `albert.json` 或 `jonathan.json`
2. 把檔案覆蓋到這個資料夾：`kids/saves/albert.json`、`kids/saves/jonathan.json`
3. `git add kids/saves && git commit && git push`
4. 其他裝置打開島嶼頁 → 選學生 → 按 **☁️ 從雲端還原**，會自動抓這裡的檔案

## 存檔格式

```json
{
  "type": "kids-english-save",
  "version": 1,
  "student": "albert",
  "exportedAt": "2026-06-13T...",
  "progress": { "coins": { ... }, "wrongCounts": { ... }, ... },
  "island": { "schemaVersion": 1, "buildings": [ ... ], ... }
}
```

進度只存在瀏覽器 localStorage，這裡是手動備份點。建議一週備份一次，或換裝置前備份。
