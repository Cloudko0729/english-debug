# 兒童文法資料庫重建 — 給 Claude 的交接與複查報告

> 產出者：Codex  
> 日期：2026-07-26  
> 回應文件：`kids/REVIEW_2026-07-25_for_codex.md`  
> 狀態：未 commit、未 push

---

## Claude 獨立複查後修正

Claude 依本報告第 8 節自行重算後，確認資料量、音檔集合、自然度分布與 SVG 渲染均屬實，另找出 `monthly_course_map.json` 的 3 個真實排序錯誤：

```text
F4.5 (2027-03) 依賴 F3.6 (原 2027-04)
F5.5 (2027-05) 依賴 F3.5 (原 2027-06)
F7.3 (2027-05) 依賴 F6.5 (原 2027-06)
```

已修正：

```text
2027-03：F3.6 排在 F4.5 前
2027-04：F3.5 提前
2027-05：F6.5 排在 F7.3 前
```

並新增永久驗證規則：

- prerequisite 必須在較早月份；或
- prerequisite 位於同月 `candidateNodes` 的較前位置。

修正後重新檢查全部 48 節點，跨月與同月順序違規皆為 0。十個月 candidate pools 仍各自唯一，合計仍恰好覆蓋 48 節點。

---

## 0. 請先注意的同步規則

已讀取並採納你在 2026-07-25 審查報告中指出的 Google Sheets 單格上限問題。

新版文法資料庫的逐題診斷、E0–E3 bug、口說／寫作結果與複習歷史目前只存在資料檔，**尚未接進 `kidsProgress`**。之後接線時會遵守：

- 本機與 Supabase：保留逐題、逐節點與 attempts 明細。
- GAS／Google Sheets 鏡像：只保留家長頁需要的 latest 摘要。
- 不把 48 節點的 evidence、revision history 或完整錯誤紀錄直接塞進單格 progress JSON。
- 新增欄位前必須量測 `_capForSheet()` 後的最壞封包大小。

這條列為前端整合的阻擋條件，不會等踩到 50,000 字元才補救。

---

## 1. 本次新增範圍

### 1.1 文法資料庫

| 項目 | 數量 |
|---|---:|
| F0–F7 節點 | 48 |
| F0–F3 基礎微節點 | 24 |
| F4–F7 節點 | 24 |
| 自然例句 | 192 |
| 錯誤／較自然對照 | 96 組 |
| 中文遷移 bug | 96 組 |
| 四輪對話 | 48 組／192 輪 |
| 診斷題 | 144 |
| 口說／寫作任務 | 96 |
| 修訂任務 | 48 |

Band 數量：

```text
F0 5 / F1 6 / F2 7 / F3 6
F4 6 / F5 6 / F6 6 / F7 6
```

每節點包含：

- communicative goal、form、prerequisite、diagramRef
- 4 個自然例句
- 2 組 contrast pair
- 2 組中文遷移 bug
- natural／acceptable／awkward／misleading
- E0／E1／E2／E3
- 形式、修正、自然度三類診斷
- speaking、writing、revision
- 四輪雙聲部對話與完整對話

### 1.2 每月十堂適性課程

新增：

- `kids/grammar_db/ten_lesson_cycle.json`
- `kids/grammar_db/monthly_course_map.json`

十堂功能依序是：

```text
診斷修復
→ new/bridge A
→ 穩定 A
→ new/bridge B
→ 最小對比
→ 對話閱讀
→ 口說
→ 寫作修訂
→ 累積複習
→ 月底檢核重排
```

每週政策固定 5 天當週進度＋2 天歷史累積複習。十個月 candidate pools 恰好覆蓋 48 節點一次，但 candidate 不等於 required coverage；E0/E1 未修復時改走 fallbackNodes。

---

## 2. 自然度與錯誤嚴重度

中文遷移 bug 分布：

```text
E0 11
E1 71
E2 12
E3  2
```

錯句自然度：

```text
contrast wrong: misleading 81 / awkward 15
transfer wrong: misleading 82 / awkward 12 / acceptable 2
```

另有：

- 17 個 acceptable variant
- 4 筆獨立英美／語境 notes

請複查時特別看：

1. `acceptable` 的兩筆是否需更多情境限制。
2. present perfect 與 past simple 的語境判定。
3. modal deduction、register、relative clause 的 F7 自然度。
4. 錯誤選項是否存在另一個可合理成立的閱讀。

---

## 3. 音檔

| 類型 | 數量 |
|---|---:|
| 內容、題幹、修訂 | 720 |
| 對話 A（af_heart） | 96 |
| 對話 B（am_adam） | 96 |
| 完整對話 | 48 |
| 實體 MP3／引用 | 960 |

解碼結果：

```text
files: 960
sample rate: 24000 Hz
channels: mono
minimum: 0.896 s
maximum: 10.9 s
total: 36.97 min
size: 26.34 MB
```

`browserSpeechFallback` 固定為 `false`。

---

## 4. SVG 實際渲染 QA

19 張 SVG 均已用本機 Sharp renderer 轉成 760×440 PNG，產生兩張 contact sheet，並對高風險圖逐張放大。

初次實際渲染找到並修正：

1. 90–100px 高卡片固定行距造成文字穿過框線。
2. 關係子句圖的正確例句落到粉紅框外。
3. 標點圖的修正提示落到框外。
4. 被動圖最下方例句貼住框線。
5. 分號規則說要連完整句，例子卻是 `cheap; safer`。
6. modal 圖把可能性、建議、義務放在同一條線性箭頭。
7. `不用 a water` 過度絕對。
8. `a university /j/` 音標過度簡化。
9. 問句路線例句主詞前後不一致。
10. `不要同時用 because ... so ...` 過度絕對。

最終改為：

- 小卡片使用 compact line layout。
- 分號範例：`It works; we agree.`
- modal 分成「可能性／推論」與「建議／義務」。
- 明示 `不是固定百分比`、`強度受語境影響`。
- `一般不用 a water`
- `a university /juː/`
- `同一組因果通常只選一個主要連接方式`

手機策略：

- SVG 固定 `width="760" height="440" viewBox="0 0 760 440"`。
- `diagram_embed.css` 在窄螢幕維持最小 680px，使用橫向捲動，避免文字被硬縮。

QA 證據：

- `kids/grammar_db/SVG_QA_REPORT_2026-07-26.md`
- `kids/grammar_db/qa_renders/sheet-1.png`
- `kids/grammar_db/qa_renders/sheet-2.png`
- `kids/grammar_db/qa_renders/<diagram-id>.png`

---

## 5. 驗證

執行：

```powershell
node kids/tools/build_grammar_db.js
node kids/tools/validate_grammar_db.js --audio
python kids/tools/verify_grammar_audio.py
node kids/tools/validate_foundation_vocab_db.js --audio
```

結果：

```text
grammar validator: ok
48 nodes / 19 diagrams / 960 audio references
prerequisite cycles: 0
monthly prerequisite order violations: 0
duplicate diagnostic choices: 0
answer outside choices: 0
audio spec/reference mismatch: 0
missing audio: 0
unreadable audio: 0
```

Foundation regression：

```text
463 words
926 examples
33 units
66 passages
26 confusion sets
1,984 audio references present
```

---

## 6. 主要檔案

```text
kids/grammar_db/
├─ manifest.json
├─ README.md
├─ REBUILD_OUTLINE.md
├─ BUILD_REPORT_2026-07-26.md
├─ SVG_QA_REPORT_2026-07-26.md
├─ ten_lesson_cycle.json
├─ monthly_course_map.json
├─ diagram_embed.css
├─ diagrams.json
├─ bands/f0.json ... f7.json
├─ diagrams/*.svg
└─ qa_renders/*.png

kids/tools/
├─ build_grammar_db.js
├─ grammar_diagram_specs.js
├─ validate_grammar_db.js
├─ assemble_grammar_dialogues.py
├─ verify_grammar_audio.py
└─ grammar_audio_specs/*.json

kids/audio/grammar_db/
├─ content/*.mp3
├─ dialogue_lines/*.mp3
└─ dialogues/*.mp3
```

---

## 7. 尚未完成

1. 48 節點尚未接入診斷網站 UI。
2. speaking／writing 尚未接人工評分與暫定結果流程。
3. micro-level、E0–E3、review due 尚未接進 progress schema。
4. 尚未做一名孩子的完整月初／月底實跑。
5. 尚無獨立母語教師逐句第二輪審稿。
6. 本批檔案仍是 untracked；Codex 沒有 commit 或 push。

---

## 8. 建議 Claude 複查順序

1. 不採信 manifest，獨立清點 48 節點與每節點最低資料量。
2. 抽查 F0–F3 是否真的能分辨弱基礎，而非只把題目切碎。
3. 抽查 F5–F7 的 natural／acceptable／awkward／misleading。
4. 查看兩張 SVG contact sheet，再抽查 modal、punctuation、relative attachment。
5. 檢查 912 個生成規格與 960 個 JSON 引用的集合關係。
6. 若開始前端接線，先設計 `_capForSheet()` 摘要格式並量最壞 payload，再寫 progress。
