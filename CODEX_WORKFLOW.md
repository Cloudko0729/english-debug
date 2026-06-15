# Codex 分工與審查流程

> 目的：讓 Codex 負責「可重複、規則明確」的內容生成與分析；Claude 只做驗證、整合與最終審查（commit/push）。
> 更新：2026-06-15

---

## 原則

1. **Codex 做**：生成內容、草稿、結構化資料、分析建議。
2. **Claude 做**：驗證正確性、整合進系統、最終決定、`git commit`/`push`（這是審查關卡）。
3. 每件委派用固定的「Codex 任務規格」交付，要求 **只回傳資料**（JS 物件/陣列），回來由 Claude 審查整合。

---

## A. Codex 可自己執行（Claude 只審查 / 整合）

| 工作 | Codex 產出 | Claude 把關 |
|---|---|---|
| **每日兒童練習內容** | 5 大題 `DRILL` 物件：listenVocab(6)/listenBlank(5)/reading/reorder(4)/pictureMC(6) | **驗證重組題可解**、套版、生語音、更新 index、commit |
| **每日成人練習內容** | 主題 + 3 核心句/5 中翻英/3 口說/2 bug/5 複習單字卡 | 套版、新句型庫、更新 progress_log/index、commit |
| **國中字（junior）例句** | 每字 2–3 句簡單例句（依批次清單） | 合併進 wordbank.js、commit |
| **測驗題庫擴充** | adult `quiz_bank.js` 題、vocab 題目 | 驗證答案都在選項內、合併 |
| **新字 emoji 對照** | `{ word: emoji }`（可圖像化才給） | 合併 word_emoji.js |
| **像素圖** | `$imagegen` 產圖（建築/動物/寵物） | 檢視品質、Pillow 去背 256px、放 island_img、commit |
| **經濟 / 平衡分析** | 回本天數、門檻、數值建議表 | 最終拍板數值再套用 |
| **易混淆字組辨識題** | 題目資料（如 cat/cap、fish/wish） | 整合進測驗 |
| **新主題單字 + 例句** | `{en, zh, theme, level, ex[]}` 批次 | 去重、合併、生語音 |

> 低風險純資料（例句、emoji、題庫）：Codex 可直接寫檔，Claude 看 diff 即可。

---

## B. Claude 保留（不委派，需判斷或風險高）

- **重組題順序驗證**：Codex 曾把 chunk 拆錯，每次必用程式暴力排列驗證「能拼回原句」。
- **island.html / 既有 HTML 程式修改**：遊戲機制、狀態、localStorage、migration——風險高。
- **遊戲機制與數值最終決定**。
- **`git commit` / `push`**：慣例（Co-Authored-By）、push 驗證、且這是使用者要的最後審查關卡。
- **記憶檔（memory/）與交接文件（PROJECT_STATUS.md）更新**。

---

## C. Codex 任務規格範本

每次委派附：**目標 + 輸出格式 + 規則限制 + 「只回傳資料、不要寫檔」**。

**每日兒童練習**
```
主題：<theme>。產生 const DRILL = { date, day, theme,
  listenVocab[6]（前3英文選項、後3中文選項）,
  listenBlank[5], reading{passage~60字, questions[4]},
  reorder[4]（每句拆5塊，join 空格須等於原句，打散順序）,
  pictureMC[6]（指定可用 emoji 清單） }。只回傳物件。
```

**每日成人練習**
```
主題（不重複前N天）。回傳：3核心句(英/中/場景/注意)、5中翻英(附答案)、
3口說情境、2 bug(原句/問題/正確/套用)、5複習單字卡(Day n-4~n-1)、
建議新 sentence_bank 檔名+內容。
```

**例句批次**
```
為以下單字各產生 2-3 句 Grade-5 簡單例句，回傳 const EX = { word:[...] }。
```

---

## D. 每次交付後 Claude 的固定檢查清單

1. 資料格式正確、答案都在選項內。
2. 重組題：程式驗證可解。
3. 技術內容（RMA/EEPROM…）語意正確、沒被改壞。
4. 語音/圖檔產生並放對位置。
5. 更新 index / progress_log / 完成打勾 data-claim。
6. `git commit`（Co-Authored-By）+ `push`。
7. 需要時更新 memory / PROJECT_STATUS.md。
