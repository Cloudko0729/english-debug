# 兒童文法資料庫 F0–F7

本資料庫把「會選答案」與「能自然表達」分開記錄。F0–F3 將基礎文法切成 24 個微節點，F4–F7 再銜接句子、段落與六年級所需的語意、篇章及語體控制。

## 檔案

- `manifest.json`：範圍、政策與固定數量。
- `bands/f0.json`–`bands/f7.json`：48 個教學節點。
- `diagrams.json` 與 `diagrams/*.svg`：19 張可直接嵌入網頁的示意圖。
- `diagram_embed.css`：手機以橫向捲動保留可讀字級，避免把 760px 圖硬縮成小字。
- `REBUILD_OUTLINE.md`：重建原則、分級、月份映射與整合方式。
- `ten_lesson_cycle.json`：每月 10 堂的適性教學、產出與複習循環。
- `monthly_course_map.json`：2026-09 至 2027-06 的故事目標、候選節點與補救節點。

`monthly_course_map.json` 的 `candidateNodes` 有順序意義：前置節點必須位於較早月份，或位於同月陣列中的較前位置。`validate_grammar_db.js` 會檢查這項拓撲規則。

## 每個節點包含

- 明確的溝通目標、形式與前置節點
- 4 個自然例句
- 2 組錯誤／較自然對照
- 2 組中文遷移易錯句，含 E0–E3 嚴重度
- natural、acceptable、awkward、misleading 自然度標記
- 3 題診斷：形式、修正、自然度
- 1 個口說任務、1 個寫作任務
- 4 輪雙人對話及完整對話音檔欄位
- 1 個雙句修訂任務
- 可接受變體與英美差異註記

## 重要語意

- `E0`：可能造成根本誤解。
- `E1`：核心結構錯誤，母語人士通常能猜懂。
- `E2`：意思可懂，但明顯不自然或語境不合。
- `E3`：可接受變體或需要語境才能判定。
- `natural`：一般語境自然。
- `acceptable`：文法可接受，但有語境、語體或方言限制。
- `awkward`：多半能懂，但母語人士通常會改寫。
- `misleading`：形式或邏輯可能改變核心意思。

## 重建與驗證

```powershell
node kids/tools/build_grammar_db.js
node kids/tools/validate_grammar_db.js
node kids/tools/validate_grammar_db.js --audio
python kids/tools/verify_grammar_audio.py
```

音檔必須由資料內的固定 MP3 路徑播放；`browserSpeechFallback` 固定為 `false`，不使用瀏覽器即時語音。

嵌入 SVG 時請使用：

```html
<link rel="stylesheet" href="grammar_db/diagram_embed.css">
<div class="grammar-diagram-scroll">
  <img src="grammar_db/diagrams/question-routes.svg" alt="問句雙路線">
</div>
```
