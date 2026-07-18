# 國小一年級至國中三年級英語課程大綱 — 定案版 v1（Claude × Codex 核對，2026-07-17）

## 0. 版本說明

流程比照 [[adult-course]] 的 outline_claude/outline_codex/outline_final：Claude 先出 `outline_claude.md`，Codex 獨立（沒看過 Claude 版）另外出 `outline_codex.md`，核對後由使用者拍板定案。

核對結果：**主體採用 Codex 版**。兩份草案唯一實質分歧在「Lv.7-9（國中）文法深度」——Claude 版把現有 grammar_core 16 單元薄薄分散到 Lv.4-9 六級，國中三年幾乎只剩複習；Codex 版把 16 單元在 Lv.6（國小畢業）前教完，國中三年另外設計比較級／量詞／條件句／關係子句／現在完成式／被動入門／引述觀點等全新內容。**使用者已拍板採 Codex 完整版**（理由：符合真實 CEFR A2→B1 進度需求，即使國中三年要新寫文法內容，也比國中文法明顯不足來得好）。

其餘部分（字彙兩層制、九級週表、評量方式）Codex 版本比 Claude 版更完整，直接採用，不逐項比對。Claude 獨立草案保留在 `outline_claude.md` 供歷史對照，不再更新。

**範圍確認**：這套 Lv.1-9 是給其他家長小孩用的獨立教材，跟使用者自己兩個小孩（Albert/Jonathan，現讀國小六年級）現有的 island.html 金幣制／`vocab_plan.js` 48 週排程無關、不互相影響，不接 `awardCoins`。

以下內容全文採用 `outline_codex.md`，僅第 7 節依上述決議調整。

---

## 1. 定位與設計原則

### 1.1 課程定位

- 本課程為提供一般家庭使用的獨立主幹課程，共 9 級，每級 8 週。
- 課程級別以 `Lv.1`～`Lv.9` 表示；既有 `wordlevels.js` 的字彙難度以 `wL1`～`wL8` 表示。兩套編號用途不同。
- 每週包含輸入、引導練習、可觀察產出與家庭延伸；不接 island 金幣、`awardCoins` 或既有 48 週排程。
- 八週負責建立該級核心能力。大量字彙採「理解字彙池＋主動使用核心字」兩層管理，避免八週內要求孩子硬背數百字。
- 題材由自己、家庭、學校逐步擴展到社區、自然、科技與社會議題；語言任務由單字反應逐步發展成對話、敘事、說明與簡短論述。

### 1.2 參考框架

| 框架 | 本案採用方式 |
|---|---|
| CEFR / CEFR Companion Volume | 用 can-do statements 定義各級成果，約從 Pre-A1 推進到 B1-；四技能與互動、調解能力一起規劃。 |
| Cambridge English Young Learners（Pre A1 Starters、A1 Movers、A2 Flyers） | 作為國小階段主題、任務長度與聽讀難度的參照，不採其考試題型作為教學目標。 |
| US Common Core ELA literacy progression | 採用由個人經驗到資訊文本、由複述到舉證與比較的讀寫進程；國中主題加入跨學科內容。 |
| WIDA ELD 的語言使用觀點 | 讓學生用英語敘事、說明、解釋與表達立場，評量以實際語言產出為主。 |

以上對應均為課程規劃用近似值，不等同官方認證或測驗分數換算。

### 1.3 為何 Lv.4 才進入顯性文法

Lv.1～Lv.3 先累積高頻語塊、聲音辨識、拼讀、圖像理解與基本互動。低年級學生的抽象分類與後設語言能力仍在發展，過早使用「主詞、助動詞、第三人稱單數」等術語，容易增加工作記憶負擔，也可能讓孩子先檢查規則才開口。前三級仍會大量接觸正確句型，例如 `I like...`、`Can you...?`、`He is...`，但以聽、仿說、替換與情境任務內化。

Lv.4 開始把已熟悉的句型整理成可命名、可比較的規律。此時孩子已有足夠語料可供歸納，讀寫能力也能支援句子拆解。文法教學固定遵循「先理解情境 → 觀察例句 → 說出規律 → 用於表達 → 在作品中修訂」，術語只保留能幫助溝通與修改的部分。

## 2. 九級總覽

### 2.1 能力、文法與四技能比重

| 課程級別 | 對應年級 | 約略 CEFR / YLE | 文法或句型重點 | 八週結業產出 | 聽／說／讀／寫 |
|---|---|---|---|---|---|
| Lv.1 | G1 國小一 | Pre-A1 起步 | 語塊：I am, I like, This is, Can I；不講術語 | 看圖聽懂指令，完成 4～6 句自我介紹 | 60／30／10／0 |
| Lv.2 | G2 國小二 | Pre-A1 | 語塊：have, can, want, Where is；複數與位置靠示例習得 | 參與 6～8 輪情境對話，讀懂短圖文 | 50／30／15／5 |
| Lv.3 | G3 國小三 | Pre-A1 → A1 | 語塊：每天做什麼、正在做什麼、簡短 because；仍不做顯性分析 | 口述一天或一段圖片故事，寫 5～6 句 | 40／30／20／10 |
| Lv.4 | G4 國小四 | A1 / Starters→Movers | `grammar_core` u1～u4、r1：句子、冠詞、代名詞、兩種動詞 | 完成「我的世界」圖文頁並口頭導覽 | 35／25／25／15 |
| Lv.5 | G5 國小五 | A1+ / Movers | u5、u6、u9、u10、r3：現在簡單、現在進行、描述詞、介係詞 | 比較日常與此刻，製作有細節的生活報告 | 30／25／25／20 |
| Lv.6 | G6 國小六 | A2- / Movers→Flyers | u7、r2、u8、u11、u12、r4：過去、問句否定、連接詞、情態與未來入門 | 說寫一段過去事件及一項未來計畫 | 25／25／25／25 |
| Lv.7 | G7 國中一 | A2 / Flyers | 核心螺旋複習；比較級、數量詞、to-infinitive、when/if 子句 | 敘事、比較兩個選項並提出建議 | 25／20／30／25 |
| Lv.8 | G8 國中二 | A2+ | should/must/might、第一條件句、關係子句入門、現在完成式的經驗用法 | 解釋問題與方案，引用兩項文本資訊 | 20／20／30／30 |
| Lv.9 | G9 國中三 | B1- | 現在完成與過去比較、被動語態入門、引述觀點、段落銜接 | 完成短篇專題並進行 2～3 分鐘發表 | 20／20／30／30 |

> 比重是每級活動時間的建議值。寫作比重中的 G1 以描寫、配對、字母與標記圖像為主。

### 2.2 字彙量規劃

| 課程級別 | 既有難度來源 | 該來源新增／來源累計 | 建議八週主動核心字 | 建議理解字彙池累計 | 處理方式 |
|---|---|---:|---:|---:|---|
| Lv.1 | wL1 | 106／106 | 80～100 | 106 | 高頻名詞、動作與課堂語言，以聲音和圖像先行。 |
| Lv.2 | wL2 | 105／211 | 90～110 | 211 | 納入位置、衣物、食物、能力與日常動作。 |
| Lv.3 | wL3 | 115／326 | 100～120 | 326 | 擴充時間、場所、描述詞與基礎故事動詞。 |
| Lv.4 | wL4 | 137／463 | 110～130 | 463 | 字彙與句型、拼字規律及短文一起回收。 |
| Lv.5 | wL5 | 343／806 | 140～170 | 806 | 從 343 字中挑主動核心，其餘在分級讀物中反覆辨識。 |
| Lv.6 | wL6 | 552／1,358 | 160～200 | 1,358 | 增加不規則動詞、學科語言與多義高頻字。 |
| Lv.7 | wL7 | 575／1,933 | 180～220 | 1,933 | 增加敘事、比較、社區與自然科普字彙。 |
| Lv.8 | wL8＋補充 A | 346＋約 300／約 2,579 | 200～240 | 約 2,579 | 既有 wL8 全部納入理解池，補科技、環境、健康與媒體高頻字。 |
| Lv.9 | 補充 B | 約 500／約 3,079 | 220～260 | 約 3,079 | 補學術跨域、公共議題與論述連接語。 |

補充 A、B 建議從教育部國中小英語基本 1,200 字以外的國中常用字表、教育部 7,000 字分級，以及適齡 CEFR A2～B1 分級讀物語料交集建立。先做大小寫、詞形與重複字清理，再依頻率、可教性與主題覆蓋選字。表中的「來源累計」代表可辨識範圍；「主動核心字」才是八週作品中要求主動使用的範圍。

## 3. 各級八週課程

每週的「字彙範圍」即該級單字表的主題分組規格；正式製作時再由指定字彙來源輸出逐字 canonical list，避免本大綱中的示例字與 `wordlevels.js` 拼字版本分歧。

### Lv.1（G1）：我與身邊的世界

| 週 | 主題 | 字彙範圍（代表字） | 語言任務／句型 | 驗收產出 |
|---|---|---|---|---|
| 1 | Hello, Me | hello, name, one–ten, boy, girl | My name is... / I am... | 20～30 秒自我介紹錄音 |
| 2 | My Family | mom, dad, brother, sister, baby | This is my... | 家庭圖卡口頭導覽 |
| 3 | School Things | book, bag, pen, desk, chair | It is a... / Show me... | 聽指令找物與貼標籤 |
| 4 | Colors and Shapes | red, blue, yellow, circle, square | It is red. / I see... | 形狀尋寶照片加口述 |
| 5 | My Body | head, hand, eye, nose, foot | Touch your... / I have... | 動作歌指令挑戰 |
| 6 | Animals | cat, dog, bird, fish, big, small | I see a... / It is... | 選一隻動物說 3 句 |
| 7 | Food I Like | rice, milk, apple, egg, water | I like... / I don't like... | 家庭喜好小調查 |
| 8 | My Little Book | 複習前七週核心字 | Hello. This is... I like... | 完成並朗讀 4～6 頁小書 |

### Lv.2（G2）：生活與互動

| 週 | 主題 | 字彙範圍（代表字） | 語言任務／句型 | 驗收產出 |
|---|---|---|---|---|
| 1 | Classroom Actions | open, close, read, write, listen, help | Please... / Can I...? | 擔任 1 分鐘小老師 |
| 2 | Clothes and Weather | shirt, shoes, coat, sunny, rainy, cold | I wear... / It is... | 看天氣替角色選衣服 |
| 3 | My Home | room, bed, table, door, kitchen | Where is...? / It is in/on... | 房間圖 5 輪問答 |
| 4 | Food and Drinks | bread, noodles, juice, hungry, thirsty | I want... / Here you are. | 點餐角色扮演 |
| 5 | Pets and Abilities | rabbit, turtle, run, jump, swim, fly | A ... can/can't... | 動物能力猜謎卡 |
| 6 | Days and Routines | day, morning, night, school, play, sleep | I ... in the morning. | 三格日常流程圖 |
| 7 | Places Nearby | park, store, school, home, library | Let's go to... / Where is...? | 玩具地圖路線對話 |
| 8 | My Helpful Day | 複習生活動作與場所 | I can... / I help... | 6～8 輪情境對話錄影 |

### Lv.3（G3）：事件、時間與簡短故事

| 週 | 主題 | 字彙範圍（代表字） | 語言任務／句型 | 驗收產出 |
|---|---|---|---|---|
| 1 | My Week | Monday–Sunday, today, tomorrow, busy | On Monday, I... | 一週活動口述 |
| 2 | Hobbies | draw, dance, sing, collect, game, music | I like ...ing. | 同伴興趣訪談 |
| 3 | Around Town | hospital, station, market, bank, street | The ... is next to... | 資訊差地圖任務 |
| 4 | What Is Happening? | walking, eating, reading, waiting | He/She is ...ing. | 圖片偵探說 5 句 |
| 5 | Feelings and Reasons | happy, sad, tired, excited, afraid | I feel... because... | 情緒日記 4 格 |
| 6 | A Small Problem | lost, find, give, call, ask, carry | First... Then... Finally... | 排序並口述圖片故事 |
| 7 | Nature and Weather | cloud, wind, rain, tree, river, season | I can see... / It is... | 30 秒氣象報告 |
| 8 | My Day Story | 複習時間、動作、情緒、連接語 | First... Then... because... | 口述一天並寫 5～6 句 |

### Lv.4（G4）：句子如何運作

| 週 | 主題 | 字彙範圍 | 文法配置 | 驗收產出 |
|---|---|---|---|---|
| 1 | Sentence Lab | 人物、動作、課堂指令、句子類型用語 | u1 句子是什麼 | 重組並朗讀 8 個有意義句子 |
| 2 | Objects and Categories | 日用品、材質、單複數、類別 | u2 名詞與 a/an/the | 製作迷你物品博物館標籤 |
| 3 | People Around Me | family, jobs, appearance, belongings | u3 代名詞家族 | 用 I/me/my/mine 等修訂人物介紹 |
| 4 | States and Actions | feelings, traits, common actions | u4 be 與一般動詞 | 依意思選動詞引擎並口述 |
| 5 | Sentence Factory | 前四週字彙回收 | r1 造句工廠 | 從詞卡產生陳述、疑問、命令句 |
| 6 | My Room, My Rules | furniture, position, rules, chores | u1～u4 整合 | 房間圖文＋三條家庭規則 |
| 7 | Mini Interview | questions, interests, favorites, abilities | 以熟悉語塊整合問答 | 訪談同伴並轉述 5 項資訊 |
| 8 | My World Page | 本級核心字回收 | 作品修訂：句子完整、名詞、代名詞、動詞 | 圖文頁與 1 分鐘口頭導覽 |

### Lv.5（G5）：日常、此刻與細節

| 週 | 主題 | 字彙範圍 | 文法配置 | 驗收產出 |
|---|---|---|---|---|
| 1 | Habits and Facts | routines, frequency, school life | u5 現在簡單式 | 寫說自己的平日作息 |
| 2 | People and Animals | habitats, diets, behavior, third-person verbs | u5 三單 `-s` | 動物事實卡 6 句 |
| 3 | Live Scene | events, movement, people in a place | u6 現在進行式 | 60 秒現場轉播 |
| 4 | Usually vs. Now | routine verbs, temporary actions, time markers | u5、u6 對照 | 比較「通常」與「今天」 |
| 5 | Better Description | appearance, sound, speed, manner, frequency | u9 形容詞／副詞／頻率副詞 | 擴寫單薄句子並朗讀 |
| 6 | Time and Place | schedule, dates, locations, transport | u10 介係詞；at/on/in | 規劃一天行程並說明集合資訊 |
| 7 | A Day in Detail | 本級描述與日常字彙回收 | r3 描述我的一天 | 8～10 句生活報告初稿 |
| 8 | Life Reporter | 本級核心字回收 | u5、u6、u9、u10 作品修訂 | 圖文生活報告＋90 秒發表 |

### Lv.6（G6）：過去、選擇與計畫

| 週 | 主題 | 字彙範圍 | 文法配置 | 驗收產出 |
|---|---|---|---|---|
| 1 | Yesterday | activities, places, feelings, time markers | u7 過去簡單式：規則動詞 | 昨日時間線 6～8 句 |
| 2 | A Memorable Event | common irregular verbs, sequence, reactions | u7 常用不規則動詞 | 口述一件真實或虛構事件 |
| 3 | Time Detective | now, every day, last week, ago | r2 時間軸 | 依語意選時態並修訂故事 |
| 4 | Ask the Witness | question words, evidence, actions | u8 do/does/did 問句與否定 | 偵探訪談 8 輪 |
| 5 | Reasons and Results | choices, causes, results, opinions | u11 and/but/or/so/because | 合併短句成連貫段落 |
| 6 | Can We Improve It? | school/community problems, ability, possibility | u12 can、there is/are | 提出一項可行改善 |
| 7 | Next Month | events, goals, preparation, prediction | u12 will／be going to 入門 | 製作未來計畫卡 |
| 8 | Past to Future | 本級核心字回收 | r4 句子合體 | 過去事件＋未來計畫的雙段作品 |

### Lv.7（G7）：比較、敘事與社區

| 週 | 主題 | 字彙範圍 | 語言焦點 | 驗收產出 |
|---|---|---|---|---|
| 1 | New School Life | subjects, clubs, schedules, responsibilities | 核心時態與問句診斷回收 | 給新生的校園語音導覽 |
| 2 | Two Good Choices | price, distance, quality, convenient, popular | 比較級／最高級 | 比較兩個活動或商品並選擇 |
| 3 | Food, Waste and Amounts | ingredients, package, waste, enough, less | 可數／不可數、some/any/much/many | 一日食物浪費觀察報告 |
| 4 | Learning a Skill | practice, improve, goal, step, challenge | want/need/plan/learn + to-infinitive | 教別人學一項技能 |
| 5 | When Things Changed | accident, surprise, decision, response | when/while 入門；敘事時間線 | 10～12 句轉折故事 |
| 6 | Community Helpers | service, volunteer, safety, elderly, public | because/so；提出理由與建議 | 訪談或模擬社區角色 |
| 7 | Local Nature | species, habitat, protect, damage, observe | if 入門；原因與可能結果 | 製作在地生物解說卡 |
| 8 | Better Community Pitch | 全級社區、比較、問題解決字彙 | 螺旋整合與段落組織 | 2 分鐘社區改善提案 |

### Lv.8（G8）：科技、健康與環境選擇

| 週 | 主題 | 字彙範圍 | 語言焦點 | 驗收產出 |
|---|---|---|---|---|
| 1 | Digital Habits | device, screen, message, privacy, balance | 頻率、比較、資料描述 | 一週數位習慣圖表解說 |
| 2 | Advice for Well-being | stress, sleep, exercise, habit, support | should/shouldn't、must/have to | 給同齡者的健康建議單 |
| 3 | Possibility and Evidence | likely, possible, clue, claim, evidence | may/might/could；確定程度 | 判斷三則主張的可信度 |
| 4 | If We Change One Thing | energy, transport, recycle, emission, resource | 第一條件句 | 環保行動及結果海報 |
| 5 | People and Things That Help | inventor, tool, feature, solution, user | who/that/which 關係子句入門 | 介紹一項有用發明 |
| 6 | Experiences | abroad, ever, never, try, achieve | 現在完成式：經驗用法 | 同伴經驗訪談與摘要 |
| 7 | Read Across Two Sources | survey, article, fact, opinion, source | 摘要、比較、引用資訊 | 兩份短文本比較表 |
| 8 | Problem–Solution Brief | 全級科技、健康、環境字彙 | 主張—理由—證據；語法修訂 | 150～180 字簡報＋2 分鐘口說 |

### Lv.9（G9）：資訊判讀與公共議題

| 週 | 主題 | 字彙範圍 | 語言焦點 | 驗收產出 |
|---|---|---|---|---|
| 1 | Experience and Time | experience, event, since, recently, specific dates | 現在完成式與過去式比較 | 個人成長時間線與短文 |
| 2 | How Things Are Made | process, material, produce, transport, consume | 被動語態入門：流程用途 | 產品生命週期解說 |
| 3 | News and Viewpoints | report, according to, claim, quote, perspective | 引述觀點：say/tell/according to | 兩方觀點中立摘要 |
| 4 | Media and Misinformation | headline, context, reliable, misleading, verify | 事實、推論、意見；might/must | 查核模擬素材並說明依據 |
| 5 | Sustainable Cities | housing, traffic, access, green space, policy | 條件、因果與權衡語言 | 比較兩項城市方案 |
| 6 | Global Connections | trade, culture, migration, influence, exchange | 關係子句回收；跨段連接語 | 解釋一項全球連結 |
| 7 | Research Studio | question, source, note, data, conclusion | 改述、摘要、段落銜接 | 完成專題草稿與同儕回饋 |
| 8 | Public Showcase | 依學生專題建立個人字彙表 | 全級語言修訂 | 200～250 字專題＋2～3 分鐘發表 |

## 4. 文法配置與既有資產沿用

### 4.1 `grammar_core` 16 單元配置（Lv.4-6 全部教完）

| 課程級別 | 沿用單元 | 安排理由 |
|---|---|---|
| Lv.4 | u1、u2、u3、u4、r1 | 把前三級已聽說過的句型整理成句子、名詞、代名詞與動詞引擎。 |
| Lv.5 | u5、u6、u9、u10、r3 | 圍繞「日常與此刻」整合時態、描述詞及時間地點，直接支援生活報告。 |
| Lv.6 | u7、r2、u8、u11、u12、r4 | 先建立過去時間軸，再處理 did 問句；以連接詞、情態與未來完成段落整合。 |

現有 16 單元全部保留，不調整講稿核心內容。每個單元頁可拆成 15～20 分鐘觀念輸入，接到該週主題任務；複習單元保留作為作品修訂站。這樣可重用既有頁面與配音，也讓文法服務當週表達。

### 4.2 Lv.7～Lv.9 延伸文法（已拍板：全新設計，不只是複習）

| 級別 | 新增最小單元 | 教學邊界 |
|---|---|---|
| Lv.7 | 比較級／最高級、數量詞、to-infinitive、when/while/if | 只教能支援比較、步驟、敘事與結果預測的高頻形式。 |
| Lv.8 | should/must/might、第一條件句、限定關係子句、現在完成式經驗用法 | 現在完成式先限 `ever/never/already/yet` 等常見情境；不展開完成式家族表。 |
| Lv.9 | 現在完成與過去、流程被動、觀點引述、篇章銜接 | 被動限流程與資訊文本；引述以忠實轉述為目標，暫不要求完整時態倒退規則。 |

這些形式在 A2～B1 的分級讀物、科普文與公共資訊中出現頻繁。國中階段需要具備理解能力，也需要少量可控產出。每個新單元仍採語境、觀察、使用與修訂流程，不做整頁變化表背誦。**製作優先序**（資源有限時）：比較級、情態動詞、條件句、篇章銜接優先；關係子句、完成式、被動與引述可先做理解層任務，之後再補產出層。

> 這 3 級的新文法內容目前只有大綱層級的範圍界定，還沒有講稿/配音/單元頁，等於要重跑一次 [[grammar-core]] 當初「Claude 起草→Codex 覆審→家長 ElevenLabs 配音→建頁」的流程，工期跟配音成本會明顯高於 Lv.4-6（純沿用既有內容）。

## 5. 每週教材與練習結構

每週建議 3 次、每次 25～40 分鐘；家庭可依年齡縮短或拆分。

| 段落 | 內容 | 建議練習 |
|---|---|---|
| A. 可理解輸入 | 短動畫、圖片故事、對話或分級短文 | 聽指令、選圖、排序、找關鍵資訊 |
| B. 字彙與聲音 | 8～15 個當週主動字，舊字持續回收 | 圖音配對、音節／字母規律、分類、快速指認 |
| C. 互動使用 | 有資訊差或實際目的的同伴／親子任務 | 問答、訪談、地圖、猜謎、角色扮演 |
| D. 語言整理 | Lv.1～3 做句型 noticing；Lv.4 起加入短文法整理 | 替換、重組、比較例句、找錯並說明 |
| E. 作品 | 可保存、可重錄、可修訂的產出 | 錄音、圖文頁、小書、短文、簡報 |
| F. 回收 | 依 1 天、1 週、數週間隔重現核心字句 | 快速口述、舊字新情境、累積作品修訂 |

練習題不使用單一總分。系統可記錄「第一次嘗試、提示後完成、可獨立完成、能換情境使用」四種狀態，供家長判斷下一步。

## 6. 非考試型評量

### 6.1 每級評量組合

| 評量 | 頻率 | 可觀察證據 |
|---|---|---|
| 每週小任務 | 每週 1 次 | 能否用本週語言完成找路、點餐、訪談、解說等目的 |
| 口說／朗讀錄音 | 第 2、4、6、8 週 | 可理解度、語意完整度、停頓變化、能否自行重錄修正 |
| 閱讀回應 | 每週 | 找到明示資訊、依圖片或上下文推測、Lv.7 起比較來源與提出依據 |
| 寫作作品 | Lv.2 起逐步增加 | 訊息是否清楚、句子是否連貫、目標語言能否支持內容 |
| 作品集 | 每級結束 | 初稿、回饋、修訂稿與學生自評一起保留，呈現進步軌跡 |
| 家庭觀察 | 每兩週 | 是否願意開口、能否理解日常指令、能否把舊語言帶到新情境 |

### 6.2 四級表現描述

1. **開始接觸**：需要圖片、示範或逐句提示。
2. **提示後完成**：能在字卡、句框或選項協助下完成任務。
3. **獨立完成**：能在熟悉情境中自行理解與表達。
4. **遷移使用**：能在新主題中重組舊字句、補充細節或自行修訂。

升級建議看一組證據：八週作品集完成、主要 can-do 多數達到「獨立完成」、至少一項達到「遷移使用」。單次失誤或拼字錯誤不作為留級依據。

## 7. 待使用者決定（大綱層級已解決的不重複列出）

已解決（2026-07-17）：
- Lv.7-9 文法深度 → 採 Codex 完整版，見 4.2
- 與 island/vocab_plan 的關係 → 無關、不整合
- Claude/Codex 分歧定案方式 → 本文件
- Lv.8～Lv.9 補充字彙來源 → 採建議方案（教育部 7,000 字分級 ∩ CEFR A2～B1 適齡語料），Lv.2-9 製作時再實際選字
- 發布形式 → **獨立首頁**，`k9/index.html`，從根目錄 `index.html` 開一個新入口卡片，不掛在 `kids/` 底下、不接 island 機制。已依此建好 Lv.1 並上線。
- 新家庭如何選起始級別 → **不做 placement 測驗**，家長自行依小孩程度挑 Lv. 開始
- 帳號 → 沿用「發布形式」決定的無帳號路線：完成勾選只存在該裝置 localStorage（`k9progress`），不做跨裝置同步

還沒決定，等做到 Lv.7-9（會用到）或需要時再問：

| 問題 | 建議方案 | 決定後影響 |
|---|---|---|
| 語音辨識是否納入評量 | 只作回放與提示，不自動判定發音分數；保留人工自評／家長觀察 | 影響瀏覽器權限、隱私與錯判風險 |
| 中文支援何時淡出 | Lv.1～2 家長說明與關鍵指令雙語；Lv.3～6 漸減；Lv.7～9 僅複雜概念保留中文 | 影響每頁文案量與錄音版本數 |

## 9. 製作紀錄（2026-07-17～07-18）

Lv.1（G1）8 週已實際做完上線：`k9/lv1/index.html` + `week1.html`~`week8.html`。實作方式：
- 內容資料與產生器都在 `k9/tools/render_lv1.js`（node 執行即可重新產生全部頁面，之後 Lv.2-9 可以複製這支腳本改資料）。
- 每週固定結構：目標/句型卡 → 情境對話（4 句，可整段播放）→ 單字卡（12-15字，點卡聽發音）→ 聽力配對小遊戲（點卡片、無帳號計分）→ 錄音角（瀏覽器 MediaRecorder 本機錄音/重錄，不上傳，麥克風權限被拒會顯示替代方案文字，不會噴錯）→ 完成勾選（存 localStorage）。Week 7 多一個「👍我喜歡／👎我不喜歡」小活動；Week 8 是複習週，改用「小書」7 頁彙整前七週句型。
- 語音：`kids/tools/generate_audio.py`（Kokoro af_heart，同現有兒童語音管線）產生，共 162 個檔案，放 `k9/lv1/audio/`。
- 已用 Playwright 實際跑過 headless Chromium：k9/index.html → Lv.1 目錄 → Week 1，點單字卡、播情境對話、玩聽力遊戲、按錄音鍵，全程 console 無錯誤，音檔請求都 200。
- 根目錄 `index.html` 新增第三個入口卡片連到 `k9/index.html`。

**Lv.2 / Lv.3 已做完上線**（`k9/tools/render_lv23.js`，8+8週）：對話＋單字卡＋聽力遊戲＋「本週獨立短文」（抄寫＋朗讀＋背說，取代 Lv.1 的錄音角）＋字彙池（點字展開中文義，來源=wordlevels.js canonical＋wordbank.js既有翻譯＋手動補譯）。**Claude 事後審查**：逐句核對英文正確性（無誤）、Playwright 測試全部頁面無 console 錯誤/無缺音檔；發現 Lv.2/3 漏做了 Lv.1 有的聽力遊戲，已補上統一。清掉 Lv.1 資料夾 8 個舊版錄音功能孤兒音檔。

**Lv.4 / Lv.5 / Lv.6 已做完上線**（`k9/tools/render_lv46.js`，8+8+8週，共408個音檔）：在 Lv.2/3 的結構上加一張「📐 本週文法小提示」卡（該週 grammar_core 概念的簡短說明＋3-4句例句音檔），**不直接連結或嵌入 kids/grammar_core 既有頁面**（那套頁面綁 island 學生選擇器/金幣測驗，跟 k9 的無帳號/不接island決策衝突），改成自己重寫精簡版文法說明＋新例句，內容不重複既有頁面的文法解說文字。文法配置照 outline 第4節：Lv.4=u1-4+r1（8週全部教完u1-4）、Lv.5=u5,u6,u9,u10+r3、Lv.6=u7,r2,u8,u11,u12+r4。字彙池同樣模式，Lv.4-6 wordbank.js覆蓋率只有3-4成，手動補了354個字的中文翻譯。已用Playwright跑過全部27個新頁面（3個index+24週），console全部乾淨、音檔全部存在。

**單字練習題（全 6 級字彙池，2026-07-18）**：使用者要求每級字彙池全部字（Lv1-6共853字）都要有練習題，含例句與發音，且各級 8 週課程頁面裡字彙池已教過的字要跟未教過的字用不同顏色標示。實作：
- `k9/tools/pool_sentences.js`：853 字每字一句原創例句（無缺漏，程式驗證過）。
- `k9/tools/render_pool_quiz.js`：新增 `k9/lv{1-6}/vocab_quiz.html`，每次隨機抽 12 題（字彙池不限本級週課程教過的字），例句中目標字加粗、🔊 發音鍵、四選一中文意思（干擾選項從同級字彙池隨機抽），可重複練習抽到不同字。
- 各級 `index.html` 字彙池區塊：本級 8 週課程教過的字用一種底色、只在字彙池未排進課程的字用另一種底色，附圖例；新增「🎯 開始這一級的單字練習題」連結。
- 三支既有產生器（render_lv1/23/46.js）改為 `require.main===module` 才寫檔＋`module.exports`，讓 render_pool_quiz.js 可以重用它們既有的中文翻譯查詢邏輯，不用重複維護。
- 音檔：853 個新字音檔（`pool_<slug>.mp3`，各級自己的 audio/ 資料夾），背景跑約 25 分鐘（Kokoro CPU-bound），過程中用 Monitor 心跳追蹤進度。
- 測試中抓到一個真的 bug：quiz 頁面 client-side JS 呼叫了只在 Node 產生器裡定義的 `esc()`，導致選項按鈕全部噴錯——已在頁面內加對應的瀏覽器端 `esc()` 修好，Playwright 重測全 6 級 index+quiz 頁面（含實際作答互動）確認 console 全乾淨。

## 8. 製作前最低規格

- 每級先寫 6～10 條可驗收 can-do statements，再展開頁面。
- 每週標記主動字、理解字、舊字回收與詞形，不以主題清單代替逐字資料。
- 每項活動記錄適用年齡、預估時間、是否需家長陪同、輸入素材與產出格式。
- 所有音訊提供文字稿；圖片具替代文字；互動活動保留鍵盤操作或靜態替代方案。
- 每級先完成第 1 週與第 8 週的垂直切片，驗證難度跨度與作品集流程後再批量製作。
