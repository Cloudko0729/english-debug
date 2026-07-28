// 做完練習後，產生一段可以貼到 ChatGPT（或其他 AI）的複習提示。
//
// 設計上要注意的幾件事：
//
// 1. 不帶任何個人資料。這段文字會離開本站送到第三方，所以只放學習內容 ——
//    沒有名字、沒有帳號、沒有進度數字以外的東西。
// 2. 明確禁止文法術語。整套教材的規則就是「小孩看不懂的術語一律不出現」
//    （見 grammar_db/LESSON_PAGE_SPEC.md）。如果 AI 回一句「主詞與動詞的一致性」，
//    前面所有白話化的努力就被抵銷了，所以這條規則必須跟著提示一起送出去。
// 3. 要求 AI 先出題、後給答案。直接把正解和說明一次倒出來，小孩只是看答案，
//    不是複習。
// 4. 限制長度。小孩不會讀一大段文字，講太多等於沒講。
//
// 用法：
//   AIReview.render("aiBox", {
//     subject: "文法",                       // 文法 / 單字 / 綜合測驗
//     topic:   "主詞代名詞",
//     goal:    "用 I、you、he 代替名字",      // 白話目標，不要放 form 那種公式
//     wrong:   [{ q, chose, answer, note }],  // note 可省略（該題的中文說明）
//     correct: 2, total: 3
//   });
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  // 提示文字本身是純文字，把可能干擾閱讀的換行收乾淨即可
  function line(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }

  var HOW_TO_HELP =
    "【請這樣幫我】\n" +
    "1. 先用小學生聽得懂的中文，說明我每一題為什麼錯。\n" +
    "   不要用「主詞」「受格」「時態一致」這類文法術語；真的需要用到，\n" +
    "   請先用一句話解釋那是什麼意思。\n" +
    "2. 每個說明配 2 個英文例句，句子要短，而且是我生活中真的會用到的。\n" +
    "3. 最後出 3 題新的練習題給我，先不要給答案。等我回答完再批改。\n" +
    "4. 說明用繁體中文，英文例句保持英文。\n" +
    "5. 請講簡短一點，我看不完太長的文字。";

  var HOW_TO_EXTEND =
    "【請這樣幫我】\n" +
    "1. 這個主題我全部答對了，請幫我看看有沒有更難一點、但同一個主題的用法。\n" +
    "2. 用小學生聽得懂的中文說明，不要用文法術語。\n" +
    "3. 出 5 題稍微難一點的練習題，先不要給答案，等我回答完再批改。\n" +
    "4. 說明用繁體中文，英文例句保持英文，請講簡短一點。";

  function buildPrompt(o) {
    var wrong = o.wrong || [];
    var parts = [];
    parts.push("我是台灣的小學生，正在學英文。以下是我剛剛做的練習，請幫我複習。");
    parts.push("");
    parts.push("【我在學的主題】" + line(o.subject) + "：" + line(o.topic) +
      (o.goal ? "\n（這一課要學會的是：" + line(o.goal) + "）" : ""));
    parts.push("");

    if (wrong.length) {
      parts.push("【我答錯的題目】（" + o.correct + " / " + o.total + " 答對）");
      wrong.forEach(function (w, i) {
        parts.push((i + 1) + ". 題目：" + line(w.q));
        parts.push("   我選了：" + line(w.chose));
        parts.push("   正確答案：" + line(w.answer));
        if (w.note) parts.push("   課本的說明：" + line(w.note));
      });
      parts.push("");
      parts.push(HOW_TO_HELP);
    } else {
      parts.push("【結果】" + o.total + " 題全部答對。");
      parts.push("");
      parts.push(HOW_TO_EXTEND);
    }
    return parts.join("\n");
  }

  var CSS_ID = "aiReviewCss";
  function ensureCss() {
    if (document.getElementById(CSS_ID)) return;
    var st = document.createElement("style");
    st.id = CSS_ID;
    st.textContent =
      ".airev{background:linear-gradient(135deg,#f0f7ff,#fff);border:2px solid #9ccbf5;border-radius:14px;" +
        "padding:14px 15px;margin:13px 0}" +
      ".airev h3{margin:0 0 3px;font-size:.98rem}" +
      ".airev p{margin:0 0 9px;font-size:.83rem;color:#5a6875;line-height:1.6}" +
      ".airev textarea{width:100%;min-height:120px;border:1px solid #cfd8e3;border-radius:10px;padding:9px 11px;" +
        "font-size:.8rem;font-family:ui-monospace,Menlo,Consolas,monospace;line-height:1.55;resize:vertical;" +
        "background:#fff;color:#22303f}" +
      ".airev .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:9px}" +
      ".airev button{border:0;border-radius:10px;padding:9px 18px;font-size:.9rem;font-weight:700;color:#fff;" +
        "cursor:pointer;font-family:inherit;background:#2f80ed}" +
      ".airev button.copied{background:#2fbf71}" +
      ".airev a.go{font-size:.85rem;color:#2f80ed;text-decoration:none;font-weight:700}" +
      ".airev .tiny{font-size:.75rem;color:#8a97a5;margin:7px 0 0}";
    document.head.appendChild(st);
  }

  function render(containerId, o) {
    var box = document.getElementById(containerId);
    if (!box) return;
    ensureCss();
    var text = buildPrompt(o);
    var hasWrong = (o.wrong || []).length > 0;

    box.innerHTML =
      '<div class="airev">' +
        "<h3>🤖 " + (hasWrong ? "把錯的地方交給 AI 再教一次" : "想再練難一點的嗎？") + "</h3>" +
        "<p>" + (hasWrong
          ? "下面這段文字整理好了你答錯的題目。按「複製」後貼到 ChatGPT，它會用你聽得懂的方式重講一次，再出新的題目考你。"
          : "全部答對了！想挑戰更難的話，複製下面這段貼到 ChatGPT，它會出難一點的題目給你。") + "</p>" +
        '<textarea id="' + esc(containerId) + '_t" spellcheck="false">' + esc(text) + "</textarea>" +
        '<div class="row">' +
          '<button id="' + esc(containerId) + '_b">📋 複製</button>' +
          '<a class="go" href="https://chatgpt.com/" target="_blank" rel="noopener">前往 ChatGPT →</a>' +
        "</div>" +
        '<p class="tiny">這段文字只有題目內容，沒有你的名字或任何個人資料。</p>' +
      "</div>";

    var btn = document.getElementById(containerId + "_b");
    var ta = document.getElementById(containerId + "_t");
    btn.onclick = function () {
      // navigator.clipboard 需要 HTTPS 且可能被權限擋掉；
      // 失敗就退回選取全文，讓小孩自己按複製（舊 iOS Safari 常走這條）
      function done() {
        btn.textContent = "✅ 複製好了，去貼上";
        btn.classList.add("copied");
        setTimeout(function () { btn.textContent = "📋 複製"; btn.classList.remove("copied"); }, 3000);
      }
      function fallback() {
        ta.focus(); ta.select();
        try { document.execCommand("copy"); done(); }
        catch (e) { btn.textContent = "請長按上面的文字複製"; }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ta.value).then(done, fallback);
      } else fallback();
    };
  }

  window.AIReview = { render: render, buildPrompt: buildPrompt };
})();
