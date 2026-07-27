// 學習週的共同定義：每週六換一週。
//
// 週六同時是「上週作業截止」與「本週測驗開放」，所以作業與週測用同一個週次識別碼，
// 兩邊才不會各自算出不同的週。原本這段邏輯散在 weekly_test.html、homework.html
// 與 index.html 三處，任何一處改動都會讓它們對不起來。
//
// 一律用本地時間組字串：toISOString() 是 UTC，在 UTC+8 會讓凌晨 0–8 點算成前一天。
(function () {
  "use strict";

  function ymd(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") +
      "-" + String(d.getDate()).padStart(2, "0");
  }

  // 回傳「最近一個週六」的日期字串當作本週識別碼。
  // 週六解鎖後整週都能用，但一週仍然只算一次。
  function weekKey(d) {
    d = d || new Date();
    var back = (d.getDay() + 1) % 7;        // 0=週日…6=週六；週六回推 0 天
    return ymd(new Date(d.getFullYear(), d.getMonth(), d.getDate() - back));
  }

  function nextWeekKey(d) {
    var p = weekKey(d).split("-");
    var sat = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]) + 7);
    return ymd(sat);
  }

  // 同一週、同一個學生、同一個項目要穩定抽到同一題；換週才會不同。
  // 不能用亂數 —— 重新整理頁面必須拿到同一份內容。
  function seedOf() {
    var s = Array.prototype.join.call(arguments, "|"), n = 0;
    for (var i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) % 100000;
    return n;
  }

  window.WeekKey = { ymd: ymd, weekKey: weekKey, nextWeekKey: nextWeekKey, seedOf: seedOf };
})();
