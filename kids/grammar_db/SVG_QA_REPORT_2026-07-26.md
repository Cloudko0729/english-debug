# 文法 SVG 實際渲染與目視 QA 報告

> 日期：2026-07-26  
> 範圍：`kids/grammar_db/diagrams/*.svg` 共 19 張  
> 結果：19/19 完成實際渲染與目視檢查

## 檢查方式

1. 以本機 Sharp SVG renderer 將每張 SVG 依原始 `760 × 440` viewBox 轉成 PNG。
2. 產生兩張 contact sheet，先檢查整體一致性。
3. 對版面邊界較近或概念較複雜的圖逐張放大檢查。
4. 修正後重新生成全部 SVG、重新渲染並再次檢查兩張 contact sheet。
5. 重跑文法資料庫與 960 個音檔引用驗證。

QA 預覽位於：

- `qa_renders/sheet-1.png`：前 10 張
- `qa_renders/sheet-2.png`：後 9 張
- `qa_renders/<diagram-id>.png`：19 張個別渲染

## 初次渲染發現的問題

### 1. 小高度卡片文字超出邊界

`card()` 原本固定從 `y + 66` 開始排文字，90–100px 高的卡片若有兩行，第二行會落在框線或框外。

實際受影響：

- `relative-attachment.svg`：正確關係子句超出粉紅框。
- `punctuation-map.svg`：修正提示落在框外。
- `active-passive-focus.svg`：被動例句過度貼近下框線。

修正：

- 100px 以下卡片改用較緊密的 `57px` 起點與 `22px` 行距。
- 其他卡片維持原本的 66px／27px 節奏。

### 2. 分號範例與規則矛盾

原圖說明分號連接兩個完整句，範例卻是：

```text
cheap; safer
```

兩側皆不是完整子句。已改成：

```text
完整句 A ; 完整句 B
It works; we agree.
```

### 3. 情態動詞被錯放在單一線性強度軸

原圖把 `might → may/could → should → must/have to` 放在同一箭頭上，容易讓孩子把「可能性、建議、義務」誤解成同一種百分比。

新版拆成兩組：

- 可能性／推論：`might / may` 與證據型 `must be`
- 建議／義務：`should` 與 `have to / must`

另明示：

- 不是固定百分比。
- 強度受語境影響。
- 共同形式是 `modal + 原形`。

### 4. 過度絕對或前後不一致的文字

同步修正：

- `不用 a water` → `一般不用 a water`
- `a university /j/` → `a university /juː/`
- `You are tired. / Are you tired? / She is not tired.` → 統一主詞為 `You`
- `不要同時用 because ... so ...` → `同一組因果通常只選一個主要連接方式`

## 手機可讀性

SVG 現在包含明確的：

```text
width="760"
height="440"
viewBox="0 0 760 440"
```

新增 `diagram_embed.css`。窄螢幕不把整張圖硬縮到 360px，而是在最小 680px 可讀寬度下提供橫向捲動。`diagram_gallery.html` 亦使用相同策略。

## 最終目視結果

| 檢查項目 | 結果 |
|---|---|
| 19 張皆可由 SVG renderer 解碼 | 通過 |
| 標題與主要內容無裁切 | 通過 |
| 卡片文字未穿越框線 | 通過 |
| 箭頭未遮住主要文字 | 通過 |
| 中英文與音標字元可顯示 | 通過 |
| 錯誤／提醒不只靠紅綠色辨識 | 通過 |
| a/an 依聲音而非字母 | 通過 |
| be／一般動詞問句分流 | 通過 |
| 情態功能不再混成單一百分比 | 通過 |
| 分號範例符合完整子句規則 | 通過 |
| 主動／被動呈現資訊焦點 | 通過 |
| 手機保留可讀寬度 | 通過 |

## 驗證指令

```powershell
node kids/tools/build_grammar_db.js
node kids/tools/validate_grammar_db.js --audio
```

最終結果：

```text
ok: true
diagrams: 19
audioChecked: true
audioFiles: 960
```
