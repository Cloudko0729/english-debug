// 帳號切換鎖 — 共用密碼，家長控管
// 第一次切換帳號時由家長設定密碼（雜湊存在本機，不放進公開程式碼）。
// 之後換成「不同」帳號才需要輸入密碼；同一帳號不會一直問。
// 這是 app 級防手滑的鎖，不是高強度加密。

function _lockHash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

function _getPwHash() { return localStorage.getItem("kidsSwitchPwHash") || ""; }
function _setPwHash(pw) { localStorage.setItem("kidsSwitchPwHash", _lockHash(pw)); }
function _getUnlocked() { return localStorage.getItem("kidsUnlockedStudent") || ""; }
function _setUnlocked(s) { localStorage.setItem("kidsUnlockedStudent", s); }

// 切換到 student 前呼叫；回傳 true 才允許切換
function requireUnlock(student) {
  if (student === "guest") return true;         // 訪客免密碼（試玩帳號，資料只留本機）
  if (_getUnlocked() === student) return true;  // 這台平板已解鎖同一帳號

  const hash = _getPwHash();
  if (!hash) {
    // 第一次：家長設定切換密碼
    const p1 = prompt("👪 家長請設定「切換帳號密碼」（這台平板第一次設定）：");
    if (!p1) return false;
    const p2 = prompt("再輸入一次確認：");
    if (p1 !== p2) { alert("兩次密碼不一樣，請重新操作"); return false; }
    _setPwHash(p1);
    _setUnlocked(student);
    return true;
  }

  const input = prompt(`要切換成 ${student.charAt(0).toUpperCase() + student.slice(1)}，請輸入切換密碼：`);
  if (input == null) return false;
  if (_lockHash(input) === hash) { _setUnlocked(student); return true; }
  alert("密碼錯誤");
  return false;
}

// 家長變更密碼（要先輸入舊密碼；尚未設定時直接設定）
function changeSwitchPassword() {
  const hash = _getPwHash();
  if (hash) {
    const old = prompt("請輸入目前的切換密碼：");
    if (old == null) return;
    if (_lockHash(old) !== hash) { alert("舊密碼錯誤"); return; }
  }
  const n1 = prompt("輸入新的切換密碼：");
  if (!n1) return;
  const n2 = prompt("再輸入一次新密碼：");
  if (n1 !== n2) { alert("兩次不一樣，未變更"); return; }
  _setPwHash(n1);
  alert("已更新切換密碼 ✅");
}
