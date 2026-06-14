# English Debug Repo — 專案進度與交接文件

> 更新日期：2026-06-14
> 此檔為開發/交接用 markdown（給人或 Codex 看）。使用者實際使用的介面一律是 HTML。

---

## 0. 總覽

這個 repo 是一套「英文學習系統」，包含兩個獨立子系統：

| 子系統 | 對象 | 入口 |
|---|---|---|
| **成人工作英文** | 使用者本人（台灣工程師，維修/RMA 領域） | `index.html` |
| **小學生英文** | 兩位 5 年級小孩 Albert / Jonathan | `kids/index.html` |

- **GitHub repo**：https://github.com/Cloudko0729/english-debug
- **GitHub Pages（手機用）**：https://Cloudko0729.github.io/english-debug/
  - 成人：`/`、小學：`/kids/`
- **Git 流程**：每次產出後 `git add` → `commit`（結尾加 `Co-Authored-By: Claude ...`）→ `git push origin master`
- **語言慣例**：與使用者互動用繁體中文；英文句子/範例保留英文。

---

## 1. 成人工作英文系統

### 1.1 結構（repo 根目錄）
```
inbox/            收件匣（中文/英文待整理句子）
mistakes/         常犯錯 bug list
sentence_bank/    句型庫（依主題 .md）
drills/           每日練習 HTML + 每日測驗
output/           progress_log.md（進度紀錄）
prompts/          指令範本
```

### 1.2 每日練習（已到 Day 9）
- 檔名：`drills/daily_YYYY-MM-DD.html`（深色主題、3D 翻轉單字卡、Web Speech API 發音）
- 格式：Part 1 三核心句型 / Part 2 中翻英（可展開答案）/ Part 3 口說情境 / Part 4 今日 bug / Part 5 三句重點 / 複習單字卡（前 4 天）
- 已完成：Day 4(05-31) 索取除錯資訊、Day 5(06-01) RMA+升級、Day 6(06-02) follow-up、Day 7(06-06) 料號/間歇問題、Day 8(06-08) 道歉+ETA+主旨、**Day 9(06-14) 保固外維修報價**
- **流程**：與 Codex 討論新主題 → Codex 規劃內容（核心句/練習/bug/單字卡）→ 寫 HTML → 更新 `output/progress_log.md` → 更新 `index.html`（最新 badge）→ push

### 1.3 每日測驗（新）
- 檔案：`drills/adult_quiz.html` + `drills/quiz_bank.js`
- 題庫 36 題（Codex 從 sentence_bank + mistakes 產生）：14 中翻英、12 抓中式英文改寫、10 介系詞填空
- 每天 15 題，**答錯的隔天優先再考**；每題附中文解析
- localStorage：`adultQuizProgress`、`adultQuizSet.<date>`

### 1.4 句型庫（sentence_bank/）
repair_status, technical_debug, rma_and_return, escalation, polite_requests, customer_confirmation, schedule_and_delivery, part_number_and_spec, delay_apology, intermittent_issue, email_subject_lines, root_cause_report, repair_charges_quotation, ai_tool_discussion

---

## 2. 小學生英文系統（kids/）

### 2.1 結構
```
kids/
  index.html            首頁（選帳號、入口、完成打勾）
  vocab_quiz.html       每日單字測驗（20 題）
  wordbook.html         單字庫閱讀版（HTML）
  island.html           島嶼養成遊戲
  wordbank.js           1435 字單字庫
  word_emoji.js         307 個可圖像化單字 → emoji
  cloud_sync.js         Google 試算表自動存檔
  account_lock.js       換帳號密碼鎖
  drills/
    daily_2026-06-12.html  Day 1 Family
    daily_2026-06-13.html  Day 2 Animals
    daily_2026-06-14.html  Day 3 Food
    exam_final.html        期末評量
    audio/<date>/          每日練習語音
    audio/exam/            期末考語音
  audio/words/            1435 個單字語音 mp3
  vocab/                  10 主題單字 .md（wordbook 的來源）
  island_img/            建築/寵物像素圖 png
  tools/                 generate_audio.py + 語音 spec json
  google_sheets_sync/    Code.gs + SETUP.md（Apps Script 後端）
  saves/                 手動備份存檔（README）
```

### 2.2 每日練習（5 大題型，固定格式）
每天一個主題（從 10 個單字主題輪流），全部自動批改，亮色童趣主題：
1. 🎧 英聽單字選擇（聽單字選答案，英文/中文混合）
2. ✏️ 英聽填空（聽整句填單字）
3. 📖 閱讀選擇（短文 + 4 題）
4. 🔀 句子重組（**▲▼ 上下移動**排序，非拖曳——拖曳在手機會卡）
5. 🖼️ 圖片選擇（emoji 看圖選字）
- 完成發金幣（每題 +5、每大題全對 +10、完成 +30），每天每份只能領一次
- 範本：`daily_2026-06-14.html`；每日只換 `DRILL` data 物件 + 語音

### 2.3 每日單字測驗（vocab_quiz.html）
- 20 題/天，從 1435 字庫抽，**弱點優先**：答錯2次+ → 答錯1次 → 沒練過的國小核心字 → 國中字
- 混 EN→ZH / ZH→EN / 看圖選英文（有 emoji 的字）
- 答對降低弱點計數、答錯升高（同時是弱點偵測+補強引擎）
- 發金幣（每題 +5、完成 +30），claimKey = `日期::vocab-quiz`

### 2.4 期末評量（exam_final.html）
依使用者提供的真實期末考改編，25 題 5 大題、自動批改、大獎勵：
- A 聽音辨字(6) / B 聽力看圖選回應(5，真實 Track 64 腳本語音 + 圖卡) / C 讀一讀選回應(4) / D 看圖寫單字(6) / E 看圖選句子(4)
- 獎勵：每題 +10，滿分再 +300 / 及格 +150 / 其餘 +60，只給第一次（claimKey `final-exam`）

### 2.5 單字庫（wordbank.js / wordbook.html）
- `wordbank.js`：1435 字，每字 `{ en, zh, [pos], theme, level }`。level：`basic`（119 國小核心，分主題）/ `more`（教育部國中基本 1200，從翰霖整理的權威表解析）
- `wordbook.html`：閱讀版，兩分頁（國小核心依主題 / 國中1200 依字母）+ 搜尋 + 🔊 發音
- `word_emoji.js`：307 個可圖像化單字 → emoji（Codex 配）

### 2.6 語音（本地 Kokoro TTS）
- 模型在 `C:\Users\CloudKo_Home\py\kokoro_models\`（kokoro-onnx），聲音 **af_heart**
- 工具 `kids/tools/generate_audio.py`：讀 JSON spec 批次生成 mp3（用 ffmpeg）
- 1435 個單字語音一次生成、天天重複用（`audio/words/`）；每日練習/期末考各自一組
- HTML 端找不到 mp3 才退回瀏覽器 TTS

### 2.7 帳號與安全
- 帳號：Albert / Jonathan / 🧪 測試（沙盒，獨立 localStorage 與雲端紀錄）
- **換帳號密碼鎖**（`account_lock.js`）：共用密碼、家長控管。第一次選帳號設定密碼（雜湊存本機，不在程式碼）；切換到「不同」帳號才需要密碼；同帳號不再問。首頁有「🔒 變更切換密碼」
- 每個有選帳號的頁面都套用 `requireUnlock()`

### 2.8 自動存檔（Google 試算表）
- 後端：Google Apps Script Web app（`kids/google_sheets_sync/Code.gs`，部署步驟 SETUP.md），**已部署啟用**
- 端點填在 `cloud_sync.js` 的 `CLOUD_URL`，密語 `CLOUD_SECRET = "kids2026"`（要跟 Code.gs 的 SECRET 一致）
- `cloudSyncOnOpen()`：開頁時，本機空→從雲端拉回（新/測試平板自動載入真實進度）、本機有→上傳備份；答題/蓋島後 `cloudSave()`
- 試算表分頁：`Saves`（原始存檔，跨裝置還原用）、`Albert_熟練表`/`Jonathan_熟練表`（答錯單字、次數、狀態）
- **多裝置規則**：一人一台、各點各的名字 → 不衝突（各自獨立紀錄）。同一帳號別同時兩台玩（最後存的蓋前面的）

---

## 3. 島嶼養成遊戲（kids/island.html）

答題賺金幣 → 蓋島嶼（箱庭諸島風格）。每位學生獨立島（`kidsIsland.<student>`）。

### 3.1 地圖
- **15×15 地形**（schemaVersion 2）：海洋 90 / 平地 116 / 丘陵 14 / 高山 5 格
- 只能在對應地形蓋建築；地形給基礎美化（丘陵+1、高山+2 = +24）
- 舊 7×7 島自動 migrate：不在合法地形的建築拆除並全額退款

### 3.2 數值
| 數值 | 來源 |
|---|---|
| 人口 | 房子/小鎮/牧場/碼頭 |
| 美化 | 地形 + 森林/池塘 + 城鎮中心 + 復育動物 |
| 快樂 | `beauty / (pop × 1.2)`，上限 100% |
| 金幣/天 | 各建築 coin × 收入倍率 |
| 建築 | 設施總數 |

- **快樂影響收入**：倍率 = `0.6 + 0.6 × 快樂%`（0.6～**1.2**，快樂滿有 20% 加成）。人多美化少 → 快樂掉、收入掉

### 3.3 建築（cost / 每級產出，平衡後）
| 建築 | 地形 | cost | 級數 | 重點數值 | 解鎖 |
|---|---|---|---|---|---|
| 城鎮中心 | 平地 | 0(唯一) | 5 | beauty/coin[8,14,22,32,45] | 隨時 |
| 寵物狗 🐶 | 陸地 | 0(唯一) | — | 每天點一次撿 15–55 | 隨時 |
| 森林 | 平地 | 90 | 3 | beauty[3,6,10] | 隨時 |
| 池塘 | 平地 | 70 | 3 | beauty[4,8,13] | 隨時 |
| 農場 | 平地 | 120 | 3 | coin[15,25,40] | 隨時 |
| 牧場 | 平地 | 150 | 3 | pop[2,4,7] coin[18,30,46] | 隨時 |
| 房子 | 平地 | 180 | 3 | pop[4,8,14] | 隨時 |
| 太陽能 | 平地 | 220 | 5 | coin[14,21,30,40,52] | 隨時 |
| 小鎮 | 平地 | 400 | 3 | pop[12,24,40] coin[20,35,55] | Lv2 |
| 風力發電 | 丘陵/海 | 320 | 5 | coin[18,26,36,48,62] | Lv2 |
| 碼頭 | 海(max3) | 300 | 5 | pop[4..14] coin[14,20,28,38,50] | Lv2 |
| 定置漁場 | 海(max5) | 360 | 5 | coin[20,30,42,56,72] | Lv3 |
| 遠洋漁船 | 海(max3) | 780 | 5 | coin[34,50,70,94,122] | Lv4 |

一般建築依 `activeDays`（放置天數）自動升級；城鎮中心靠達標升級。

### 3.4 城鎮中心（5 級）
升級需同時達成人口+美化：Lv2 (20,40)、Lv3 (55,90)、Lv4 (110,170)、Lv5 (190,290)。等級越高解鎖越多；**Lv5 把復育上限拉到最大**。

### 3.5 保育動物（復育，5 級，大量美化 + 少量金幣）
| 棲地 | 地形 | 解鎖 | 上限(一般→Lv5) | 物種 |
|---|---|---|---|---|
| 丘陵 | H | Lv2 | 1→3 | 石虎(800)、穿山甲(820)、鳳蝶(760) |
| 高山 | M | Lv3 | 2→5 | 黑熊(1050)、帝雉(950)、山椒魚(900)、長鬃山羊(950)、櫻花鉤吻鮭(980)、赫氏角鷹(1050)、水鹿(950) |
| 海洋 | O | Lv4 | 2→5 | 綠蠵龜(950)、中華白海豚(1100)、鯨鯊(1050)、珊瑚礁(850)、鱟(880) |

`CATEGORY_MAX`/`CATEGORY_MAX_L5` 控管；`catMax(cat)` 依 centerLevel() 回傳。

### 3.6 像素圖
原 7 種（house/forest/pond/ranch/farm/town/center）+ 能源/漁業 5 種（solar/windmill/dock/fishery/oceanboat）+ 寵物狗，皆 Codex `$imagegen` 生成、去背、256px，存 `island_img/`。動物目前用 emoji（可後續補像素圖）。

### 3.7 其他
- 建造選單 `#sheet` 可捲動（max-height 80vh，關閉鈕固定底）
- 拆除全額退款（免費的城鎮中心/狗不退）
- **❓ 說明書**（openManual）：解釋地形、數值、快樂/收入公式、升級門檻、復育上限
- 完成的練習在首頁打 ✅（data-claim / data-claim-today 對應 claimedDrills）

---

## 4. 工具與協作

- **Codex CLI**（`@openai/codex` v0.129.0）：透過 `codex:codex-rescue` 子代理協作。
  - 規劃每日訓練內容、產生題庫、平衡審查
  - **`$imagegen` 可生圖**（GPT Image）：已用來生建築/寵物像素圖。輸出在 `~/.codex/generated_images/<session>/ig_*.png`（子代理回報路徑可能不準，直接去目錄撈最新檔）
- **語音**：本地 Kokoro（kokoro-onnx）+ ffmpeg；`generate_audio.py`
- **圖片後處理**：Python Pillow 去白底（r,g,b>240→透明）+ resize 256

---

## 5. localStorage / 資料結構參考

| Key | 內容 |
|---|---|
| `kidsProgress.<student>` | `{ wrongCounts{}, sessions, totalCorrect, totalWrong, coins{ balance, lifetimeEarned, lifetimeSpent, transactions[], claimedDrills{} } }` |
| `kidsIsland.<student>` | `{ schemaVersion:2, grid, season, stats{}, buildings[], events[], settings{}, lastProcessedDate, dogLastCollect }` |
| `kidsCurrentStudent` | 最後選的學生 |
| `kidsSwitchPwHash` / `kidsUnlockedStudent` | 換帳號密碼鎖 |
| `vocabQuizSet.<student>.<date>` | 當天凍結的單字測驗題組 |
| `adultQuizProgress` / `adultQuizSet.<date>` | 成人測驗 |

claimedDrills key 格式：每日主題 `日期::日期-主題`（如 `2026-06-14::2026-06-14-food`）；單字測驗 `日期::vocab-quiz`；期末考 `final-exam`。

---

## 6. 常見任務 SOP

**產出成人每日練習**：與 Codex 討論新主題 → 規劃內容 → 複製 Day N 範本改 DRILL → 新句型庫 .md → 更新 progress_log + index → push

**產出小學每日練習**：Codex 規劃該主題 5 大題內容（驗算句子重組的順序！）→ 複製最近一份 daily HTML 改 `DRILL`/標題/日期/`DRILL_ID`/`AUDIO_DIR` → 寫 audio JSON spec + 跑 `generate_audio.py` → 更新 `kids/index.html`（最新 + data-claim）→ push

**加新島嶼建築/動物**：在 `BUILDINGS` 加項目（emoji/name/cost/terrain/maxLevel/各級陣列/levelDays，動物加 category+categoryMax，能源加 max）→ 加進 `BUILD_ORDER` → 需要的話加 `REQ_CENTER` → 生像素圖（Codex $imagegen）設 `img:true`，否則用 emoji

**生像素圖**：Codex `$imagegen`（指定 16-bit pixel art, centered, plain background, square）→ Pillow 去背+256px → 放 `island_img/` → 設 `img:true`

---

## 7. 待辦 / 已知限制

- 保育動物（15 種）尚未生像素圖（目前 emoji）
- 成人 Day 1–3（05-30 初期）較早期；Day 1 小學（Family）無金幣機制、首頁不打勾
- 期末考的 Listen and Number（B 段聽力編號）與開放式寫句子（G/H）未納入（需原始音檔/老師批改）
- Apps Script 自動存檔密語為共享等級（小孩單字進度，非敏感資料）
- 15×15 島嶼在手機每格約 22px，建築圖偏小（可接受；要更大可改捲動+放大）

---

## 8. 記憶檔（給 Claude 跨對話）

位置：`C:\Users\CloudKo_Home\.claude\projects\D--english\memory\`
- feedback：Codex 協作、HTML 輸出慣例
- project：kids 每日格式、島嶼遊戲、雲端同步
- reference：Kokoro 語音、Codex imagegen
