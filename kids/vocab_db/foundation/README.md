# Foundation Vocabulary Database

這個目錄是兒童英語 F0–F3／L1–L4 的可重建內容資料庫。JSON 是產物；若要修改內容，請編輯
`kids/tools/build_foundation_vocab_db.js` 後重新產生，避免直接手改 JSON。

## 範圍

- L1：106 字，對應 F0–F1
- L2：105 字，對應 F1–F2
- L3：115 字，對應 F2–F3
- L4：137 字，對應 F3
- 合計：463 字、926 個單字例句、33 個單元、66 篇引導短文、33 組課堂對話
- 易混淆內容：26 組；每組另有規則、4 個對比例句、4 句迷你對話及 2 題辨識題

L 與 F 是兩個不同維度：

- `level`（L1–L4）表示字彙教學次序。
- `bands`（F0–F3）表示診斷能力帶；相鄰 L 級可跨兩個 F 帶，方便安排補強。

## 檔案

- `manifest.json`：版本、範圍、產量及音檔政策。
- `words_l*.json`：單字、中文核心義、詞性、搭配、句型框、例句、音檔及易混淆索引。
- `units_l*.json`：每單元 13–15 字、兩篇引導短文及 8 回合課堂對話。
- `confusions_l1_l4.json`：容易混淆的單字與觀念。

## 單字資料契約

每筆單字至少包含：

- 穩定 ID、字面、中文核心義、詞性、L 級與 F 帶
- 一個常用搭配及一個可替換句型框
- 兩個不同用途的例句：`recognition` 與 `application`
- 單字音檔、例句音檔
- `confusionRefs`，可反查相關易混淆教學組

所有語音都是預先產生的本機 MP3。資料政策明確設定
`browserSpeechFallback: false`，前端不可改用瀏覽器內建語音。

## 重建與驗證

```powershell
node kids/tools/build_foundation_vocab_db.js
node kids/tools/validate_foundation_vocab_db.js
```

音檔依 `kids/tools/foundation_audio_specs/` 的規格用 Kokoro 產生；完成單句音檔後再組合完整對話：

```powershell
python kids/tools/assemble_foundation_dialogues.py
node kids/tools/validate_foundation_vocab_db.js --audio
```

若文字內容已修改，產生單句音檔時要加 `--force`，完整對話則使用
`assemble_foundation_dialogues.py --force`，確保音檔和 JSON 文字同步。

## 編輯原則

1. 低級數句子要具體、短而自然，不用抽象或可疑的通用模板。
2. 冠詞、不可數名詞、不規則複數、動名詞及專有名詞優先寫專用例句。
3. 同一字的兩句例句要呈現不同用法或情境。
4. 易混淆組要能說明差異，也要讓孩子在例句、對話與小題目中反覆辨識。
5. `cooky` 僅保留為來源字表中的少見舊拼法；實際教學以 `cookie` 為主。
