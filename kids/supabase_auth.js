// Kids English — Supabase 登入（每個小孩各自帳號）
// 需先在頁面載入 supabase-js UMD：
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   <script src="supabase_auth.js"></script>
// 登入後 currentStudent = 信箱前綴（albert / jonathan / test）。

const SUPABASE_URL = "https://ozndadnpequfkrusijag.supabase.co";
const SUPABASE_KEY = "sb_publishable_pk_Iw-IsjaRRJRYFpeUJhQ_8-7kSXxv";
const EMAIL_DOMAIN = "kids.local";   // 帳號信箱網域，建帳號時用的

// 建立 client（若 CDN 沒載到就保持 null，頁面會退回舊的選學生流程，不會鎖死）
let sbClient = null;
try {
  if (window.supabase && window.supabase.createClient) {
    sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    window.sbClient = sbClient;
  }
} catch (e) { console.warn("supabase init failed", e); }

// 登入後 account_lock 的密碼切換就不需要了
window.requireUnlock = function () { return true; };

// 取得目前登入的學生代號（信箱前綴），沒登入回 null
async function authStudent() {
  if (!sbClient) return null;
  const { data } = await sbClient.auth.getSession();
  const session = data && data.session;
  if (!session || !session.user || !session.user.email) return null;
  return session.user.email.split("@")[0].toLowerCase();
}

// 頁面入口守門：有登入 → 設定 currentStudent、隱藏選學生按鈕、加登出鈕，回傳學生代號
//                沒登入 → 顯示登入畫面，回傳 null
//                沒 Supabase（CDN 失敗）→ 回傳 undefined，讓頁面走舊流程
async function authGate() {
  if (!sbClient) return undefined;            // 降級：沒 Supabase 就不擋
  const student = await authStudent();
  if (!student) { showLogin(); return null; }
  localStorage.setItem("kidsCurrentStudent", student);
  decorateLoggedIn(student);
  return student;
}

// 把上方「我是：Albert / Jonathan / 測試」那排，換成「目前：Name ［登出］」
function decorateLoggedIn(student) {
  // 用選學生按鈕的父容器當作那條列（各頁 id 不同：studentRow / studentBar / 無 id）
  const btn = document.querySelector(".stu-btn");
  const bar = (btn && btn.parentElement)
    || document.getElementById("studentBar")
    || document.getElementById("studentRow");
  if (!bar) return;
  const name = student.charAt(0).toUpperCase() + student.slice(1);
  bar.innerHTML =
    `<span style="font-weight:700;color:#3a2a00">目前：${name}</span>` +
    `<button onclick="doLogout()" style="margin-left:12px;padding:4px 16px;border:2px solid #3a2a00;border-radius:18px;background:transparent;font-weight:700;color:#3a2a00;cursor:pointer">登出</button>`;
}

async function doLogout() {
  if (sbClient) await sbClient.auth.signOut();
  location.reload();
}

// ── 登入畫面（蓋住整頁）──────────────────────────────────────────────────────
function showLogin() {
  if (document.getElementById("loginOverlay")) return;
  const ov = document.createElement("div");
  ov.id = "loginOverlay";
  ov.style.cssText = "position:fixed;inset:0;background:#2f80ed;display:flex;align-items:center;justify-content:center;z-index:99999;font-family:Arial,'Noto Sans TC',sans-serif;padding:20px";
  ov.innerHTML = `
    <div style="background:#fff;border-radius:18px;max-width:340px;width:100%;padding:26px 22px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.25)">
      <div style="font-size:2.4rem">🔑</div>
      <h2 style="margin:6px 0 4px;color:#2f80ed">登入</h2>
      <p style="margin:0 0 16px;color:#888;font-size:.85rem">選你的名字，再輸入密碼</p>
      <div id="loginNames" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:14px">
        <button class="ln" data-name="albert"   style="${lnStyle()}">Albert</button>
        <button class="ln" data-name="jonathan" style="${lnStyle()}">Jonathan</button>
        <button class="ln" data-name="test"     style="${lnStyle()}">🧪 測試</button>
      </div>
      <input id="loginPw" type="password" placeholder="密碼" autocomplete="current-password"
        style="width:100%;box-sizing:border-box;padding:11px 12px;border:2px solid #e2e2e2;border-radius:10px;font-size:1rem;margin-bottom:12px" />
      <button id="loginGo" style="width:100%;padding:12px;border:0;border-radius:10px;background:#2f80ed;color:#fff;font-size:1rem;font-weight:700;cursor:pointer">登入</button>
      <div id="loginErr" style="color:#e23;font-size:.82rem;margin-top:10px;min-height:1em"></div>
    </div>`;
  document.body.appendChild(ov);

  let picked = null;
  ov.querySelectorAll(".ln").forEach(b => b.onclick = () => {
    picked = b.dataset.name;
    ov.querySelectorAll(".ln").forEach(x => x.style.outline = "none");
    b.style.outline = "3px solid #ffb703";
    document.getElementById("loginPw").focus();
  });
  const go = () => doLogin(picked, document.getElementById("loginPw").value);
  document.getElementById("loginGo").onclick = go;
  document.getElementById("loginPw").addEventListener("keydown", e => { if (e.key === "Enter") go(); });
}
function lnStyle() {
  return "padding:8px 14px;border:2px solid #2f80ed;border-radius:18px;background:#fff;color:#2f80ed;font-weight:700;cursor:pointer;font-size:.9rem";
}

async function doLogin(name, password) {
  const err = document.getElementById("loginErr");
  if (!name) { err.textContent = "先選名字"; return; }
  if (!password) { err.textContent = "請輸入密碼"; return; }
  err.textContent = "登入中…";
  const email = `${name}@${EMAIL_DOMAIN}`;
  const { error } = await sbClient.auth.signInWithPassword({ email, password });
  if (error) { err.textContent = "登入失敗：密碼錯誤或帳號不存在"; return; }
  sessionStorage.setItem("kidsJustLoggedIn", name);   // 標記「剛登入」→ 重整後跳出來源選擇
  location.reload();
}

// 本機是否已有該學生的進度（用來決定登入時要不要問「雲端 vs 暫存」）
function _localHasData(student) {
  let p = null;
  try { p = JSON.parse(localStorage.getItem("kidsProgress." + student) || "null"); } catch (e) {}
  if (p && (((p.totalCorrect || 0) + (p.totalWrong || 0)) > 0 || (p.coins && p.coins.balance > 0))) return true;
  return !!localStorage.getItem("kidsIsland." + student);
}

// 登入後跳出：☁️ 讀雲端紀錄 / 💾 用這台暫存
async function showSourceChoice(student, proceed) {
  let cloud = null;
  try { cloud = (typeof cloudPeek === "function") ? await cloudPeek(student) : null; } catch (e) {}
  if (!cloud || !cloud.progress) { proceed(); return; }   // 雲端沒資料就直接用本機

  const lp = (function () { try { return JSON.parse(localStorage.getItem("kidsProgress." + student) || "null"); } catch (e) { return null; } })();
  const localCoins = (lp && lp.coins && lp.coins.balance) || 0;
  const cloudCoins = (cloud.progress.coins && cloud.progress.coins.balance) || 0;

  // 用「最後一筆活動時間」比新舊
  const lastAct = prog => {
    const tx = prog && prog.coins && prog.coins.transactions;
    if (!tx || !tx.length) return 0;
    let m = 0; for (const t of tx) { const c = Date.parse(t.createdAt || 0) || 0; if (c > m) m = c; }
    return m;
  };
  const fmt = ms => { if (!ms) return "—"; const t = new Date(ms); return `${t.getMonth() + 1}/${t.getDate()} ${t.toTimeString().slice(0, 5)}`; };
  const cAct = lastAct(cloud.progress), lAct = lastAct(lp);
  let rec = "same";
  if (cAct > lAct + 2000) rec = "cloud"; else if (lAct > cAct + 2000) rec = "local";
  const badge = "<span style='font-size:.7rem;background:#2fbf71;color:#fff;border-radius:8px;padding:1px 7px;margin-left:6px'>✅ 建議（較新）</span>";
  const sameNote = rec === "same"
    ? `<p style="margin:0 0 12px;color:#2fbf71;font-size:.8rem;font-weight:700">兩邊進度看起來一樣，選哪個都可以 👍</p>` : "";

  const ov = document.createElement("div");
  ov.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:100000;padding:18px;font-family:Arial,'Noto Sans TC',sans-serif";
  ov.innerHTML = `
    <div style="background:#fff;border-radius:18px;max-width:380px;width:100%;padding:22px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.25)">
      <div style="font-size:2rem">🔄</div>
      <h2 style="margin:6px 0 4px;color:#2f80ed">要用哪個進度？</h2>
      <p style="margin:0 0 12px;color:#888;font-size:.82rem">${student.charAt(0).toUpperCase() + student.slice(1)}</p>
      ${sameNote}
      <button id="srcCloud" style="display:block;width:100%;border:2px solid ${rec === "cloud" ? "#2fbf71" : "#2f80ed"};background:#eef5ff;border-radius:12px;padding:12px;margin-bottom:10px;cursor:pointer;text-align:left">
        <b style="color:#2f80ed">☁️ 讀取雲端紀錄</b>${rec === "cloud" ? badge : ""}<div style="font-size:.82rem;color:#555;margin-top:3px">🪙 ${cloudCoins}　·　最後活動 ${fmt(cAct)}</div></button>
      <button id="srcLocal" style="display:block;width:100%;border:2px solid ${rec === "local" ? "#2fbf71" : "#2fbf71"};background:#f0fcf6;border-radius:12px;padding:12px;cursor:pointer;text-align:left">
        <b style="color:#1c7a4d">💾 用這台的暫存</b>${rec === "local" ? badge : ""}<div style="font-size:.82rem;color:#555;margin-top:3px">🪙 ${localCoins}　·　最後活動 ${fmt(lAct)}</div></button>
      <p style="margin:12px 0 0;color:#aaa;font-size:.72rem">雲端＝之前或別台存的；暫存＝這台剛剛玩的。</p>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector("#srcCloud").onclick = () => {
    localStorage.setItem("kidsProgress." + student, JSON.stringify(cloud.progress));
    if (cloud.island) localStorage.setItem("kidsIsland." + student, JSON.stringify(cloud.island));
    ov.remove(); proceed();
  };
  ov.querySelector("#srcLocal").onclick = () => { ov.remove(); proceed(); };
}

// ── 自動守門：等 DOM 與頁面腳本都就緒後再執行（避免 getSession 從快取秒回時，
//    搶在頁面的 selectStudent/pickStudent 定義之前就呼叫 → 選不到學生的競態）。
//    有登入 → 自動選取該學生；沒登入 → 顯示登入畫面；沒 Supabase → 不做事，走頁面原本流程。
function runAutoGate() {
  if (!sbClient) return;
  authGate().then(student => {
    if (!student) return;                       // null = 已顯示登入畫面
    const proceed = () => {
      const sel = (typeof window.selectStudent === "function") ? window.selectStudent
                : (typeof window.pickStudent === "function") ? window.pickStudent : null;
      if (sel) { try { sel(student); } catch (e) { console.error("auto-select 失敗：", e); } }
    };
    // 剛登入 + 這台本機已有資料 → 讓使用者選「雲端 vs 暫存」；否則照常
    if (sessionStorage.getItem("kidsJustLoggedIn") === student) {
      sessionStorage.removeItem("kidsJustLoggedIn");
      if (_localHasData(student)) { showSourceChoice(student, proceed); return; }
    }
    proceed();
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runAutoGate);
} else {
  runAutoGate();
}
