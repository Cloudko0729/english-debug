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

-- ── 島嶼信箱（2026-07-09 新增）：小孩互相留言 ────────────────────────────────
-- 全家登入者都可讀；只能用自己的帳號寄；每個收件人保留最近 100 筆。
create table if not exists public.island_messages (
  id         bigint generated always as identity primary key,
  sender_id  uuid not null references auth.users(id) on delete cascade,
  sender     text not null,     -- albert / jonathan / ryder / test（信箱前綴）
  recipient  text not null,
  body       text not null check (char_length(body) <= 200),
  created_at timestamptz default now()
);
create index if not exists island_messages_recipient_idx
  on public.island_messages (recipient, created_at desc);
alter table public.island_messages enable row level security;
create policy "family can read messages"
  on public.island_messages for select
  to authenticated using (true);
create policy "send as self"
  on public.island_messages for insert
  to authenticated with check (auth.uid() = sender_id);

create or replace function public.prune_island_messages() returns trigger
language plpgsql security definer as $$
begin
  delete from public.island_messages m
  where m.recipient = new.recipient
    and m.id not in (
      select id from public.island_messages
      where recipient = new.recipient
      order by created_at desc
      limit 100
    );
  return null;
end;
$$;

drop trigger if exists trg_prune_island_messages on public.island_messages;
create trigger trg_prune_island_messages
  after insert on public.island_messages
  for each row execute function public.prune_island_messages();
