# 兒童英語圖片題：Claude 後續作業交接說明

> 建立日期：2026-07-12  
> 專案：`D:\English\kids`  
> 本文件目的：交給 Claude 審閱並決定後續圖片題整合與追加素材。  
> 對應的視覺報告：`reports/picture_vocab_audit_2026-07-12.html`

## 1. 結論

經完整年度單字計畫的保守人工篩選：

- 已完成：**76 個單字**的獨立圖片素材。
- 仍可直接新增：**57 個單字**；這些詞可以由單張圖清楚辨識，且全部沒有現成 `WORD_EMOJI` 映射。
- 其中 `garbage` / `trash` 可共用同一張素材，因此 57 個字約需 **56 張新基礎圖片**。
- 待情境審核：**25 個詞**。這些詞雖可能做成圖，但需要人物、場景或語境，暫時不列為必做。
- 不建議硬做：大量抽象詞、動詞、副詞、時間詞與語法詞，應維持文字／聽力／句子題型。

## 2. 現況與資料來源

### 2.1 圖片題目前如何運作

- `drills/daily_engine.js` 的圖片題以 `WORD_EMOJI[en]` 篩選候選單字。
- `word_emoji.js` 目前有 **317** 個 emoji 映射。
- 完整年度計畫共有 **52 週、1,560 個單字**。
- 因為只有 emoji 映射能進入圖片題，許多具體名詞目前不會被抽到。

### 2.2 已完成的素材

素材根目錄：`kids/picture_vocab_img/v2/`

- 76 張獨立 PNG。
- 8 張 contact sheet。
- 白底、粗線條、無文字為預設。
- 僅在顏色能降低誤判時使用 1～2 個關鍵色，例如 ketchup、butter、raincoat、rainbow、heart、medicine、sand。

所有已完成素材、接觸表與候選原則詳見：

```text
reports/picture_vocab_audit_2026-07-12.html
```

### 2.3 已完成的 76 個單字

| 批次 | 已完成單字 |
|---|---|
| 1：場所與家庭 | apartment, bakery, bathroom, bedroom, living room, post office, garden, gate, camera, basket, blanket, rope, forest, waterfall, pond, fire station |
| 2：廚房用品 | fork, knife, spoon, bowl, pot, oven, microwave oven, stove, refrigerator, napkin |
| 3：戶外與交通 | pool, boat, police station, airplane, taxi, motorcycle, traffic jam, sidewalk, garage, flat tire |
| 4：食物與動物 | cabbage, cheese, fried rice, tofu, tomato, donkey, goat, goose, nest, pigeon |
| 5：剩餘廚房與購物 | freezer, ketchup, butter, glass, mop, saucer, wallet, postcard, blouse, cash |
| 6：商店、學校與天氣 | department store, flower shop, stationery store, piano, raincoat, rainbow, bookcase, dictionary, magazine, album |
| 7：學校、運動與健康 | typewriter, baseball, tennis, beard, eyebrow, heart, nurse, medicine, cage, sand |

## 3. 仍值得新增的直接候選（57 個）

以下是「不靠文字、單張圖可清楚辨識」的保守候選。這些字均已確認不在目前 `WORD_EMOJI` 映射內。

### 3.1 家庭、衣物與居家物件（29 個）

```text
carpet, comb, couch, curtain, garbage, trash, shelf, sink,
washing machine, cabinet, towel, closet, dresser, dryer, hanger,
heater, button, pajamas, belt, jeans, pillow, armchair, drawer,
roof, air conditioner, fence, lamp, lid, pipe
```

注意：

- `garbage` 和 `trash` 使用同一張垃圾桶／垃圾袋素材即可。
- `cabinet`、`closet`、`dresser` 必須刻意畫出不同輪廓，否則不宜同時加入同一組選項。
- `roof`、`fence`、`pipe` 建議採局部建築物件圖，不要畫複雜房屋場景。

### 3.2 科技、休閒、文化與材料（15 個）

```text
cable, mouse, tape recorder, popcorn, pizza, flute, stage, swing,
seesaw, stamp, walkman, rubber band, earrings, gold, cotton
```

注意：

- `mouse` 必須畫成有線或無線「電腦滑鼠」，避免和動物混淆。
- `tape recorder` 和 `walkman` 都是舊式 3C，需保留卡帶／耳機等辨識元素。
- `stamp` 是郵票，不是印章；應避免使用文字或國別標記。
- `cotton` 建議畫成棉花植株／棉絮球，不是一般布料。

### 3.3 自然、植物與地景（13 個）

```text
mud, lake, river, stream, seed, lychee, papaya, grass, root,
rose, path, shore, valley
```

注意：

- `lake`、`river`、`stream` 建議在同一批生成並刻意做出大小／流動差異。
- `path`、`shore`、`valley` 需要極簡地景，不能與 `road`、`beach`、`mountain` 混淆。
- `root` 最適合畫植物地下根系的剖面圖。

## 4. 可做但需要 Claude 先審核的情境型候選（25 個）

這些詞可透過小場景或人物職業圖表示，但若只用單張圖片，可能會有性別刻板印象、文化偏差或多個合理答案。暫時不建議直接納入每日四選一圖片題。

```text
basement, ceiling, downstairs, upstairs, airmail,
bill, plastic, straw,
factory, barber, farmer, fisherman, hairdresser, mailman, waiter,
captain, cheerleader, movie star, photographer, reporter, secretary,
engineer, guide, banker, stamp collecting
```

建議處理：

1. 若要使用職業圖，採角色任務／情境配對，不把髮型、膚色、性別當成職業線索。
2. `downstairs` / `upstairs` 適合雙格對照或動畫，不適合單張靜態圖。
3. `bill` 可能是帳單或鈔票；`plastic` / `straw` 是材料詞，需明確定義教學語意後再做。
4. `stamp collecting` 更適合作為多張郵票的收藏情境，不是單一物件詞。

## 5. 明確排除規則

以下類型不列入圖片擴充，即使字庫中存在，也不要為了增加數量硬做：

- 時間與頻率：usually, yesterday, tomorrow, soon, ago。
- 認知／情緒動詞：believe, decide, remember, hope, agree。
- 泛用動作：prepare, finish, follow, share, tell。
- 抽象概念：problem, safety, science, subject, advantage, reason。
- 程度與方式：important, convenient, carefully, quickly。
- 需要前後文才成立的方向或關係：arrive, leave, return, abroad, weekend。
- 文法詞與連接詞：pronoun, preposition, determiner, although, therefore 等。

## 6. 後續實作建議（給 Claude）

### 6.1 不要改寫既有 emoji 表

新增獨立圖片映射，例如建立 `word_image.js`：

```js
const WORD_IMAGE = {
  "camera": "picture_vocab_img/v2/camera.png",
  "washing machine": "picture_vocab_img/v2/washing_machine.png",
  "garbage": "picture_vocab_img/v2/garbage_trash.png",
  "trash": "picture_vocab_img/v2/garbage_trash.png"
};
```

### 6.2 建議的顯示優先順序

```text
WORD_IMAGE（生成／手繪圖片）
  → WORD_EMOJI（既有 emoji）
  → 不進圖片題；改用文字或其他題型
```

### 6.3 整合前應檢查

1. `daily_engine.js`：讓 `weekPic` / `basicPic` 接受 `WORD_IMAGE` 或 `WORD_EMOJI`。
2. 題目 render：圖片使用 `<img>`，保留 `alt`，並控制手機載入尺寸與 `object-fit`。
3. 圖片快取與載入失敗 fallback：圖片載不到時退回 emoji，不要退回中文而誤當圖片題。
4. 選項干擾：同一題組避免同時放置外形太接近的字，例如 `cabinet / closet / dresser` 或 `lake / river / stream`。
5. 先從每週 6 題的圖片池觀察答錯率，再擴大使用。

## 7. 建議的後續生成順序

若 Claude 決定繼續製作 57 個直接候選，建議每次 8～10 張，順序如下：

1. 居家物件 A：carpet, comb, couch, curtain, shelf, sink, towel, washing machine。
2. 收納與衣物：cabinet, closet, dresser, dryer, hanger, heater, button, pajamas, belt, jeans。
3. 家具與建築：pillow, armchair, drawer, roof, air conditioner, fence, lamp, lid, pipe。
4. 科技與休閒：cable, mouse, tape recorder, popcorn, pizza, flute, stage, swing, seesaw。
5. 文化與材料：stamp, walkman, rubber band, earrings, gold, cotton。
6. 自然 A：mud, lake, river, stream, seed, grass, root。
7. 自然 B：lychee, papaya, rose, path, shore, valley，加上 `garbage / trash` 共用素材。

## 8. 生成風格規則

- 白底、粗輪廓、主體大、無文字／數字／標誌。
- 黑白／灰階是預設。
- 只有顏色能降低誤判時才用 1～2 個關鍵色，例如紅色 ketchup、黃色 butter、藍色水或雨衣、彩色 rainbow、紅色心臟、棕色 sand。
- 同一題組會互相比較的物件，應在同一批生成並強化輪廓差異。
- 不做寫實照片、不做複雜背景、不用文化或性別刻板印象當線索。

## 9. 驗證紀錄

本次已驗證：

- 57 個直接候選均不在 `WORD_EMOJI` 映射內。
- 已完成素材：76 張獨立 PNG + 8 張 contact sheet。
- `picture_vocab_audit_2026-07-12.html` 目前所有圖片引用均可解析。

## 10. Claude 的建議起始工作

1. 先閱讀本文件與 `picture_vocab_audit_2026-07-12.html`。
2. 不要重新生成已完成的 76 張素材。
3. 先規劃 `WORD_IMAGE` 映射與 `daily_engine.js` 的顯示 fallback。
4. 若要補圖，優先完成第 7 節的 57 個直接候選；情境型 25 個另開審核。
5. 在正式啟用前，以手機版測試圖片載入速度、版面與容易混淆的選項組合。
