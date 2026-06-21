// 一次性搬移 → Supabase（每個帳號各自登入後寫入自己的資料）
// 用法（在 D:\english 底下開終端機，需要 Node 18+）：
//   A) 用「匯出的 JSON 檔」當來源（最新、最保險）：
//      node kids/supabase/migrate.mjs test <密碼> "C:\path\test.json"
//   B) 不給檔 → 從 Google 試算表抓：
//      node kids/supabase/migrate.mjs test <密碼>
// saves 用該來源的最新 progress/island；history 仍從試算表抓近 10 天（若有）。

const SUPABASE_URL = "https://ozndadnpequfkrusijag.supabase.co";
const ANON         = "sb_publishable_pk_Iw-IsjaRRJRYFpeUJhQ_8-7kSXxv";
const GAS          = "https://script.google.com/macros/s/AKfycbyZlQ609fvyiiOYIb-UegMSd2zQRSg9DoykH-aknkzZQEIl9jo71NSa4F17dLeErW3t6g/exec";
const SECRET       = "kids2026";
const DOMAIN       = "kids.local";

import { readFileSync } from "node:fs";
const [, , name, password, jsonPath] = process.argv;
if (!name || !password) {
  console.error('用法: node kids/supabase/migrate.mjs <albert|jonathan|test> <密碼> ["匯出檔.json"]');
  process.exit(1);
}
const email = `${name}@${DOMAIN}`;

const gj = async (q) => (await fetch(GAS + q)).json();

async function main() {
  // 1) 登入拿 token
  const tokRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const tok = await tokRes.json();
  if (!tok.access_token) { console.error("❌ 登入失敗：", tok); process.exit(1); }
  const uid = tok.user.id;
  console.log(`✓ 登入成功 ${name}  (uid=${uid})`);

  const H = {
    apikey: ANON,
    Authorization: `Bearer ${tok.access_token}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal",
  };

  // 2) 取得最新 progress/island → 寫 saves
  let progress = null, island = null;
  if (jsonPath) {
    const bundle = JSON.parse(readFileSync(jsonPath, "utf8"));
    progress = bundle.progress || null;
    island   = bundle.island   || null;
    console.log(`  來源：匯出檔 ${jsonPath}`);
  } else {
    const latest = await gj(`?student=${name}&secret=${SECRET}`);
    if (!latest.ok) console.warn(`⚠️ 試算表沒有 ${name} 的最新資料：`, latest.err || latest);
    progress = latest.progress || null;
    island   = latest.island   || null;
    console.log("  來源：Google 試算表");
  }

  const sRes = await fetch(`${SUPABASE_URL}/rest/v1/saves?on_conflict=user_id`, {
    method: "POST", headers: H,
    body: JSON.stringify({ user_id: uid, student: name, ts: new Date().toISOString(), progress, island }),
  });
  console.log(`saves  → HTTP ${sRes.status}${sRes.ok ? " ✓" : "  " + (await sRes.text())}`);

  // 3) 從試算表取近 10 天 → 寫 history
  const list = await gj(`?list=1&student=${name}&secret=${SECRET}`);
  const items = (list.ok && Array.isArray(list.items)) ? list.items : [];
  console.log(`history 天數：${items.length}（${items.map(i => i.date).join(", ") || "無"}）`);
  for (const it of items) {
    const snap = await gj(`?student=${name}&date=${it.date}&secret=${SECRET}`);
    const hRes = await fetch(`${SUPABASE_URL}/rest/v1/history?on_conflict=user_id,day`, {
      method: "POST", headers: H,
      body: JSON.stringify({
        user_id: uid, student: name, day: it.date,
        client_ts: new Date().toISOString(),
        summary: it.summary || null,
        progress: snap.progress || null,
        island: snap.island || null,
      }),
    });
    console.log(`  history ${it.date} → HTTP ${hRes.status}${hRes.ok ? " ✓" : "  " + (await hRes.text())}`);
  }
  console.log(`✅ ${name} 完成`);
}
main().catch(e => { console.error("錯誤：", e); process.exit(1); });
