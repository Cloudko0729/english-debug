# Supabase 遷移評估（Kids English 雲端後端）

目的：評估把現在的「Google Apps Script + Google Sheets」雲端存檔後端，換成 Supabase 的可行性、需要什麼、怎麼改。

> 結論先講：**技術上完全可行且更正規**，但對目前 3 帳號、每天幾筆寫入的規模是 over-engineering。真正值得換的時機是「要做登入帳號 / 多家庭 / 跨裝置即時同步」。遷移成本低，因為前端已抽象成 4 個函式。

---

## 1. 你需要準備什麼

1. **Supabase 帳號**（用 GitHub 登入即可）→ 建一個免費 project。
2. 從 project 設定拿到三樣東西：
   - `Project URL`（例：`https://xxxx.supabase.co`）
   - `anon public key`（可公開，給前端用，受 RLS 保護）
   - `service_role key`（**機密**，只能放伺服器端／Edge Function，千萬不要放進前端）
3. （選）Supabase CLI，用來部署 Edge Function 與管理 schema。
4. 免費方案夠用：500MB DB、無限 API 請求、50k 月活躍認證使用者——你用不到 1%。
   - ⚠️ **免費 project 閒置 7 天會自動暫停**，要登後台喚醒。每天用的話不會中招，長假可能要注意。

---

## 2. 資料庫 Schema（Postgres）

```sql
-- 最新狀態：一個學生一列（取代 Sheets 的 Saves）
create table saves (
  student     text primary key,
  ts          timestamptz default now(),
  progress    jsonb,
  island      jsonb
);

-- 每日快照：一個學生每天一列，保留近 10 天（取代 Sheets 的 History）
create table history (
  id        bigint generated always as identity primary key,
  student   text not null,
  day       date not null,              -- 前端本機日期
  server_ts timestamptz default now(),
  client_ts timestamptz,
  summary   jsonb,                       -- 後端不用算了，可存前端送的或用 generated column
  progress  jsonb,
  island    jsonb,
  unique (student, day)
);
create index on history (student, day desc);
```

- 「保留近 10 天」用一個 trigger（每次 insert 後刪掉該 student 第 11 筆以後），或在前端/Edge Function 寫完後刪。Postgres 的 trigger 比 Apps Script 的 LockService 乾淨可靠。
- `summary` 不需要後端算了——可以用 Postgres **generated column** 直接從 island/progress 抽，或前端送上來。
- 熟練表不用獨立 table，直接從 `saves.progress->'wrongCounts'` 查即可。

---

## 3. 安全模型（這是關鍵決策）

現在是「共用密碼 kids2026 寫在前端」——弱，但對低風險的小孩 App 可接受。換 Supabase 有三條路：

| 方案 | 做法 | 安全性 | 工夫 |
|---|---|---|---|
| **A. 開放 anon** | 關掉 RLS，前端用 anon key 直接讀寫 table | 最弱：任何人看到原始碼就能讀寫所有資料（跟現在同級甚至更糟） | 最少 |
| **B. Edge Function + 共用密碼**（建議） | 前端帶 secret 呼叫 Edge Function，function 用 service_role 在伺服器端讀寫 | 與現況同級，但 service key 不外洩、可加速率限制 | 中 |
| **C. 真正登入（Supabase Auth）** | 每個家庭一組帳密，RLS 用 `auth.uid()` 隔離資料 | 最強，真正的資料隔離 | 最多（要做登入 UI，小孩要記帳密） |

**建議**：若只是把後端換掉、不想改使用體驗 → **走 B**，等於把現在的 Apps Script 換成 Edge Function，前端幾乎不動。若哪天要多家庭 → 走 C。

---

## 4. 前端要改什麼（cloud_sync.js 的 4 個函式）

好消息：前端已經把後端抽象成 4 個函式，換後端只要重寫這 4 個，**drill / island / vocab 頁面一行都不用動**。

### 方案 A/C（直接用 supabase-js）
```html
<script type="module">
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cloudSave(student) {
  const progress = JSON.parse(localStorage.getItem("kidsProgress." + student) || "null");
  const island   = JSON.parse(localStorage.getItem("kidsIsland." + student) || "null");
  const day = _todayStr();
  await sb.from("saves").upsert({ student, ts: new Date(), progress, island });
  await sb.from("history").upsert(
    { student, day, client_ts: new Date(), progress, island, summary: summarize(progress, island) },
    { onConflict: "student,day" });
  // 修剪近 10 天交給 DB trigger
}
async function cloudLoad(student) {
  const { data } = await sb.from("saves").select("*").eq("student", student).single();
  if (data) { /* 寫回 localStorage */ }
  return data;
}
async function cloudListHistory(student) {
  const { data } = await sb.from("history")
    .select("day, server_ts, client_ts, summary").eq("student", student)
    .order("day", { ascending: false }).limit(10);
  return data || [];
}
async function cloudLoadDate(student, day) {
  const { data } = await sb.from("history").select("progress, island, day")
    .eq("student", student).eq("day", day).single();
  if (data) { /* 寫回 localStorage */ }
  return data;
}
</script>
```

### 方案 B（Edge Function，跟現在最像）
- 前端維持 `fetch(EDGE_URL, ...)`，只是 URL 從 `/exec` 換成 Supabase Edge Function URL，body 一樣帶 secret。
- 4 個函式幾乎照搬現在的 cloud_sync.js，改個網址而已。
- 後端邏輯（upsert + 修剪 + summary）寫在 Edge Function（Deno/TypeScript），用 service_role key 操作 DB。

---

## 5. 家長看進度（會失去的便利，要補回來）

現在家長能直接開 Google 試算表、手機上看「熟練表」。Supabase 沒有這種「分享一個連結就能看」的試算表。補法兩選一：

- **做一個唯讀頁** `kids/parent.html`：用 anon key（只給 select 權限）查 Supabase，把每個小孩的進度＋熟練表畫成表格。家長存書籤即可，免登入。（推薦）
- 或**繼續同步寫一份到 Google Sheet**（雙寫），保留現在的試算表閱讀體驗。

---

## 6. 既有資料搬遷

資料量極小（3 個帳號），一次性：
1. 對現在的 `/exec` 端點，每個 student 各 GET 一次最新 + 近 10 天 history。
2. 寫個小腳本把 JSON `insert` 進 Supabase 的 saves / history。
3. 對一下數字，確認搬對了。

---

## 7. 工作量與風險

**工作量**：約半天～一天。
- 建 project + schema + RLS/trigger：~1–2 小時
- （方案 B）寫 Edge Function：~2 小時
- 改 cloud_sync.js 4 個函式：~1 小時
- 家長唯讀頁：~1–2 小時
- 搬資料 + 測試：~1 小時

**風險／要注意**：
- anon key 一定會在前端被看到——**RLS 沒設好 = 資料全公開**。走方案 B 可避免（service key 在伺服器端）。
- 免費 project 閒置 7 天暫停。
- 失去 Google Sheet 的零工夫閱讀體驗（用第 5 點補）。
- 多一個外部服務／帳號要維護。

---

## 8. 需要你決定的事

1. **安全模型**：A 開放 / **B Edge Function+共用密碼（建議）** / C 真正登入？
2. **家長看進度**：做唯讀頁 / 雙寫 Google Sheet / 只用 Supabase 後台？
3. **時機**：現在就換，還是等到「要做登入或多家庭」再換？

> 我的建議：**現在先不換**（Sheets 夠用且家長閱讀方便）；等你確定要做「登入帳號 / 多家庭 / 跨裝置即時同步」時，走 **方案 B**，那時遷移成本也就改 4 個函式 + 一個 Edge Function。
