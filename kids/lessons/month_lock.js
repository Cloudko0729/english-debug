// 教學頁月份鎖：未到該課月份就蓋鎖定畫面（測試帳號可預覽）。需先載入 ../curriculum.js
(function () {
  try {
    const file = "lessons/" + location.pathname.split("/").pop();
    const month = (typeof monthOfLessonFile === "function") ? monthOfLessonFile(file) : null;
    if (!month) return;
    const d = new Date();
    const today = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    const isTest = localStorage.getItem("kidsCurrentStudent") === "test";
    if (isMonthOpen(month, today) || isTest) return;
    const ov = document.createElement("div");
    ov.style.cssText = "position:fixed;inset:0;background:#2f80ed;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;font-family:Arial,'Noto Sans TC',sans-serif;text-align:center;padding:24px";
    ov.innerHTML = `<div style="font-size:3rem">🔒</div>
      <h2 style="margin:6px 0">這一課還沒開放</h2>
      <p style="opacity:.92;margin:6px 0 18px;line-height:1.6">${month.slice(0, 4)} 年 ${parseInt(month.slice(5), 10)} 月開放<br>到時候就能讀囉！先把這個月的學好 💪</p>
      <a href="../grammar.html" style="background:#fff;color:#2f80ed;font-weight:800;text-decoration:none;border-radius:11px;padding:11px 22px">← 回文法教學</a>`;
    document.body.appendChild(ov);
  } catch (e) {}
})();
