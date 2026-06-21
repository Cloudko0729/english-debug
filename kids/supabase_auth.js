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

// 把上方「我是：Albert / Jonathan / 測試」那排換成「目前：X ・ 登出」
function decorateLoggedIn(student) {
  const row = document.getElementById("studentRow") || document.querySelector("#studentRow, .stu-row");
  document.querySelectorAll(".stu-btn").forEach(b => { b.style.display = "none"; });
  // 加一個登出連結（避免重複加）
  if (!document.getElementById("logoutBtn")) {
    const host = row || document.body;
    const span = document.createElement("span");
    span.id = "logoutBtn";
    span.style.cssText = "font-size:.8rem;color:#3a2a00;cursor:pointer;text-decoration:underline;margin-left:8px";
    const name = student.charAt(0).toUpperCase() + student.slice(1);
    span.textContent = `目前：${name}（登出）`;
    span.onclick = doLogout;
    if (row) row.appendChild(span);
  }
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
  location.reload();
}
