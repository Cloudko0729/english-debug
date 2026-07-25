# 兒童英語新版建置 — 審查報告（給 Codex）

> 審查者：Claude
> 日期：2026-07-25
> 範圍：commit `b0e25d7`…`a3169ee` ＋ 未 commit 的 foundation 詞庫與工具
> 修正 commit：`ccdbc2a`（已上線）

---

## 0. 結論

架構沒問題，可以繼續往下做。你回報的數字我全部重新獨立清點過，**全部屬實**。

有一個問題必須修，我已經修掉並上線了：**新增的 `progress.diagnostics` 會撐爆 Google Sheets 單格上限，讓家長頁再次靜默凍結**。詳見第 2 節——那是這份報告最重要的部分，也是之後新增任何「存進 progress 的欄位」都要記得的規則。

---

## 1. 驗證通過的部分

### 1.1 Foundation 詞庫（未 commit）

我沒有採信 `validate_foundation_vocab_db.js` 的輸出，另外寫程式重新清點：

| 項目 | 你的回報 | 我獨立清點 |
|---|---|---|
| 單字 | 463 | ✅ 463（L1 106 / L2 105 / L3 115 / L4 137） |
| 例句 | 926 | ✅ 926 |
| 單元 | 33 | ✅ 33 |
| 引導短文 | 66 | ✅ 66 |
| 對話句 | 264 | ✅ 264 |
| 易混淆組 | 26 | ✅ 26 |
| 易混淆例句 | 104 | ✅ 104 |
| 易混淆迷你對話 | 104 | ✅ 104 |
| 辨識題 | 52 | ✅ 52 |
| 音檔 | 1,984 全數通過解碼 | ✅ 全存在、可解碼、24kHz、78.59 分鐘、無零位元組 |

額外加測（你的 validator 沒涵蓋的）：

- 重複單字：**0**
- 選項文字重複的題目：**0**
- 答案不在選項中的題目：**0**
- 辨識題答案不在選項中：**0**

`manifest.json` 的 `missingWordAudio: 42` 一開始看起來像遺漏，追下去確認是「原本缺、已補生成」，跟 `kids/audio/words/` 底下 42 個新 mp3 對得上，命名沒問題。

### 1.2 適性診斷

兩條路線我都實際跑完整流程（透過頁面自己的函式驅動，不是只讀程式碼）：

- 全對 → 閘門 24/24 → `high` 路線 → 客觀題 42/42 → 綜合 96%（含人工評分 6/8，算式正確）
- 全部「我不知道」 → `low` 路線 → F0

檢查過的邏輯點：

- **band 索引不會跨路線洩漏**。`chooseBand()` 的 `Math.min(index, N)` 是對整個 `DATA.bands` 陣列做的，我確認 low = 索引 0–3、high = 4–7，clamp 值（1、2、5、6）都落在各自區間內，不會把 high 的人壓進 F0–F3。這點如果之後有人調整 bands 順序就會壞，值得加一條 assert。
- `attempts` 上限 3 正確生效。
- 題目資料乾淨（同上，0 重複選項 / 0 答案不在選項中）。
- `retake()` 有正確重設 `flowIndex`。

### 1.3 整合面

- `parent.html` 兩個診斷區塊都正確渲染，無 `undefined` / `NaN`、無 console 錯誤。
- `generate_audio.py` 的 `--prefix` / `--reverse` / `--force` 都是 opt-in，預設的「已存在就跳過」resumable 行為沒變，不影響 kids 和 k9 既有的音檔流程。向下相容，OK。

---

## 2. ⚠️ 已修正：`diagnostics` 會撐爆 Google Sheets 單格上限

### 背景（這是你不知道的脈絡）

`kids/` 的雲端同步是雙寫：**Supabase 是主存檔，Google Sheets/GAS 是給家長讀的鏡像**。

上週（commit `8a227e5`）才修好一個很難發現的 bug：

> Google Sheets 單格上限約 50,000 字元。`cloudSave()` 把整包 `progress` JSON 塞進**一個儲存格**。`coins.transactions` 累積到約 290–300 筆就會超過上限，GAS 端 `setValues()` 丟例外、`doPost` 接住後回 `{ok:false}`——但 `cloud_sync.js` 這端的 `fetch` 是 fire-and-forget、**從來不讀回應**，所以整個失敗過程完全沒有任何錯誤訊息。結果是家長頁的資料從 6/14 起凍結了 5 週都沒人發現，小孩的遊戲和 Supabase 主存檔全程都是正常的。

當時的修法是 `_capForSheet()`，只把送去 GAS 的 `coins.transactions` 砍到最近 150 筆。

### 這次的問題

`diagnostics` 是新欄位，**不在那道防線的保護範圍內**。它的體積不小：每次診斷的 `compact` 都含 `wordEvidence`（逐字明細），而且 `latest` 和 `attempts` 各存一份、`attempts` 留 3 次——等於同一份資料存了 4 次，其中約 25% 是純重複。

用 Jonathan 的真實帳號資料 + 兩支診斷都存滿，實測：

```
真實 progress（已套用舊的 150 筆交易上限）  26,738
＋ 適性診斷存滿（latest + 3 attempts）       9,519
＋ 固定診斷存滿（latest + 3 attempts）      11,492
                                        ─────────
                                          46,549   ← 對上限 50,000 只剩 6.9% 餘裕
```

而且 `wordDex`（Jonathan 目前 0 筆，會隨著小孩收集單字一直長）和 `wrongCounts`（目前 13 筆）都還會繼續增加。**這是會踩線的，而且踩線後的表現跟上次一模一樣：沒有錯誤訊息，家長頁就是慢慢地不再更新。**

### 修法（commit `ccdbc2a`，已上線）

擴充 `_capForSheet()`，送去 GAS 的鏡像只保留 `diagnostics.*.latest`，並移除 `latest.wordEvidence`：

```js
const diag = progress.diagnostics;
if (diag && typeof diag === "object") {
  const slim = {};
  Object.keys(diag).forEach(function (key) {
    const latest = diag[key] && diag[key].latest;
    if (!latest) return;
    const copy = Object.assign({}, latest);
    delete copy.wordEvidence;
    slim[key] = { latest: copy };
  });
  out = Object.assign({}, out, { diagnostics: slim });
}
```

**本機 localStorage 和 Supabase 主存檔完全不動，保留全部歷史**——只有給家長看的那份鏡像瘦身。

驗證方式（端對端，不是只看程式碼）：攔截實際送出的 GAS POST 封包比對

```
本機（必須完整）  ：68,386 bytes、400 筆交易、attempts 保留、wordEvidence 保留 ✅
GAS 鏡像（必須瘦身）：26,532 bytes、150 筆交易、attempts 移除、wordEvidence 移除 ✅
最壞情況：46,549 → 25,681 字元，餘裕從 6.9% 回到 48.6%
```

再用「瘦身後的完全相同封包」重新渲染 `parent.html`，確認 band、綜合分數、閘門 22/24、各分項百分比全部照常顯示，無 `undefined` / `NaN` / console 錯誤。`parent.html` 只讀 `band` / `overallPercent` / `gate` / `sectionScores` / `domainScores` / `completedAt`，這些都保留了。

### 🔑 之後請記住這條規則

**任何要寫進 `kidsProgress.{student}` 的新欄位，都必須考慮它在 Google Sheets 鏡像裡的體積。**

判斷標準很簡單：

1. 這個欄位會**隨著使用次數無上限成長**嗎？（陣列、歷史紀錄、逐項明細）
2. 如果會，就要在 `cloud_sync.js` 的 `_capForSheet()` 加對應的精簡規則。
3. 家長頁需要的欄位保留，明細類（逐字、逐題）只留在本機和 Supabase。

這個系統的失敗模式很惡劣——**不會報錯、不會有任何徵兆**，只會讓家長頁悄悄停在某一天，可能幾週後才被發現。所以寧可先砍。

---

## 3. 其他觀察（不影響上線，供參考）

### 3.1 輸入題只接受單一拼法

`LR1`–`LR4`、`HV3`–`HV4` 六題的 `accepted` 都只有一個答案：

```
LR2  answer: "friend"      accepted: ["friend"]
LR3  answer: "school"      accepted: ["school"]
HV4  answer: "conclusion"  accepted: ["conclusion"]
```

`normalize()` 有處理大小寫、前後空白、結尾標點，所以 `Happy` / `happy.` 都算對。但小孩寫 `friends`、`the school` 會被判錯。

以診斷用途來說這是可接受的（LR2 因為 `sits` 所以必須單數，LR3 `go to school` 是慣用語），但如果之後要拿這套當日常練習的自動批改，建議把常見的合理變體補進 `accepted`，否則小孩會覺得「我明明對了」。

### 3.2 `latest` 與 `attempts` 重複

`holder.latest = compact` 之後又 `holder.attempts = [...].concat([compact])`，最新那筆存了兩份。本機空間不值錢，但如果之後 `attempts` 要放寬到更多次，可以改成 `latest` 只存索引或直接讀 `attempts[attempts.length-1]`。

### 3.3 固定題組頁我沒做完整端對端

`diagnostic_grade6.html` 我只驗到資料層（42 題、章節分布、音檔）和它自己 validator 的 3 組計分測試。我的自動化腳本在那頁跑不完（是我的驅動腳本問題，不是頁面錯誤），所以**那頁沒有像適性版一樣被我完整跑過一輪**。首頁標「推薦」的適性版才是我完整驗過兩條路線的。如果固定版還會繼續用，建議補一次真人實跑。

---

## 4. 尚未 commit 的檔案

以下是你這次的產出，目前還是 untracked 狀態，我沒有替你 commit（那是你和使用者決定的範圍）：

```
kids/vocab_db/                          ← foundation 詞庫本體
kids/audio/vocab_foundation/            ← 1,269 個新音檔
kids/audio/words/*.mp3                  ← 42 個補的 word 音檔
kids/tools/build_foundation_vocab_db.js
kids/tools/validate_foundation_vocab_db.js
kids/tools/verify_foundation_audio.py
kids/tools/assemble_foundation_dialogues.py
kids/tools/foundation_audio_specs/
```

`kids/tools/generate_audio.py` 的修改因為跟 cache bump 綁在一起，已經隨 `ccdbc2a` 一起 commit 了。

---

## 5. 建議的下一步

1. 把上面第 4 節的檔案 commit 上去（foundation 詞庫目前只在本機）。
2. 之後動到 `kidsProgress` 的 schema 時，回頭看第 2 節那條規則。
3. 若固定題組頁還要繼續用，補一次完整實跑。
