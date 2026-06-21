-- Kids English — Supabase schema（每個小孩各自帳號 / per-kid auth）
-- 在 Supabase 後台 → SQL Editor 貼上整段執行即可。
-- 資料以 auth.uid() 隔離：每個小孩只看得到自己的資料。
-- student 欄存顯示名（albert/jonathan/test），來自登入信箱前綴，給「雙寫 Google Sheet」對應用。

-- ── 最新狀態：一個使用者一列（取代 Sheets 的 Saves）─────────────────────────
create table if not exists public.saves (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  student  text,
  ts       timestamptz default now(),
  progress jsonb,
  island   jsonb
);
alter table public.saves enable row level security;
create policy "saves are self-owned"
  on public.saves for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 每日快照：一個使用者每天一列，保留近 10 天（取代 Sheets 的 History）──────
create table if not exists public.history (
  id        bigint generated always as identity primary key,
  user_id   uuid references auth.users(id) on delete cascade,
  student   text,
  day       date not null,            -- 前端本機日期
  server_ts timestamptz default now(),
  client_ts timestamptz,
  summary   jsonb,
  progress  jsonb,
  island    jsonb,
  unique (user_id, day)
);
create index if not exists history_user_day_idx on public.history (user_id, day desc);
alter table public.history enable row level security;
create policy "history is self-owned"
  on public.history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 自動修剪：每個使用者只保留最近 10 天 ────────────────────────────────────
create or replace function public.prune_history() returns trigger
language plpgsql as $$
begin
  delete from public.history h
  where h.user_id = new.user_id
    and h.day < (
      select min(day) from (
        select day from public.history
        where user_id = new.user_id
        order by day desc
        limit 10
      ) keep
    );
  return null;
end;
$$;

drop trigger if exists trg_prune_history on public.history;
create trigger trg_prune_history
  after insert on public.history
  for each row execute function public.prune_history();
