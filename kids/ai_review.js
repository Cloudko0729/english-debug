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

  // 作業用的提示：AI 在這裡扮演的是「家長沒空時代為檢查／陪練」的角色，
  // 跟測驗複習不同 —— 測驗是「講解我錯的地方」，作業是「看我寫的對不對」
  // 與「陪我練口說」。所以另外一組文字，不硬套同一個模板。
  function taskPrompt(o) {
    var parts = [];
    if (o.kind === "write") {
      parts.push("我是台灣的小學生，正在學英文。爸媽現在沒空，請你幫我看作業。");
      parts.push("");
      parts.push("【今天的作業】" + line(o.taskZh));
      if (o.example) parts.push("【課本給的範例】" + line(o.example));
      parts.push("【我寫的句子】" + (line(o.written) || "（我還沒寫，請先給我一點提示）"));
      parts.push("");
      parts.push(
        "【請這樣幫我】\n" +
        "1. 先告訴我這句對不對。有錯的話，用小學生聽得懂的中文說明錯在哪裡，\n" +
        "   不要用「主詞」「單複數」「時態」這類文法術語；真的需要用到，\n" +
        "   請先用一句話解釋那是什麼意思。\n" +
        "2. 給我改好的句子，並說明你改了哪裡。\n" +
        "3. 如果我本來就寫對了，告訴我還可以怎麼講更自然。\n" +
        "4. 最後請我用同一個句型再寫 2 句不一樣的，先不要給答案，等我寫完再幫我看。\n" +
        "5. 說明用繁體中文，英文句子保持英文。請講簡短一點，我看不完太長的文字。");
    } else {
      parts.push("我是台灣的小學生，正在練英文口說。爸媽現在沒空，請你當我的練習對象。");
      parts.push("");
      parts.push("【今天要練的】" + line(o.taskZh));
      if (o.example) parts.push("【課本給的範例】" + line(o.example));
      parts.push("");
      parts.push(
        "【請這樣陪我練】\n" +
        "我會用語音跟你對話。如果我是用打字的，就照打字的方式進行。\n" +
        "1. 先用中文說這種句子什麼時候會用到，配 2 個很短的英文例句，\n" +
        "   英文的部分請唸慢一點，讓我跟著唸一次。\n" +
        "2. 然後開始跟我練：一次只問我一個問題，並用中文說明你要我怎麼回答。\n" +
        "3. 我回答後，先說我哪裡講得好，再告訴我一個可以改的地方就好，\n" +
        "   一次不要糾正太多。如果我某個字唸得不清楚，示範慢速唸一次讓我跟著唸。\n" +
        "4. 我卡住或不會講的時候，用中文給我提示，不要直接把整句講完讓我複誦。\n" +
        "5. 總共問我 3 個問題就好，結束時用中文告訴我今天進步在哪裡。\n" +
        "6. 說明用繁體中文，英文例句保持英文，不要用文法術語。");
    }
    return parts.join("\n");
  }

  // 把一段提示文字畫成「可看、可編輯、可複製」的區塊。
  // 文字直接攤開而不是偷偷塞進剪貼簿：這是要送到第三方的內容，
  // 家長應該看得到到底送出了什麼。
  function paint(box, id, title, hint, text) {
    ensureCss();
    box.innerHTML =
      '<div class="airev">' +
        "<h3>🤖 " + esc(title) + "</h3>" +
        "<p>" + esc(hint) + "</p>" +
        '<textarea id="' + esc(id) + '_t" spellcheck="false">' + esc(text) + "</textarea>" +
        '<div class="row">' +
          '<button id="' + esc(id) + '_b">📋 複製</button>' +
          '<a class="go" href="https://chatgpt.com/" target="_blank" rel="noopener">前往 ChatGPT →</a>' +
        "</div>" +
        '<p class="tiny">這段文字只有練習內容，沒有你的名字或任何個人資料。</p>' +
      "</div>";

    var btn = document.getElementById(id + "_b");
    var ta = document.getElementById(id + "_t");
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

  // 測驗結束後的複習區塊
  function render(containerId, o) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var hasWrong = (o.wrong || []).length > 0;
    paint(box, containerId,
      hasWrong ? "把錯的地方交給 AI 再教一次" : "想再練難一點的嗎？",
      hasWrong
        ? "下面這段文字整理好了你答錯的題目。按「複製」後貼到 ChatGPT，它會用你聽得懂的方式重講一次，再出新的題目考你。"
        : "全部答對了！想挑戰更難的話，複製下面這段貼到 ChatGPT，它會出難一點的題目給你。",
      buildPrompt(o));
  }

  // 作業用：家長沒空時，讓 AI 代為檢查手寫或當口說的練習對象。
  // 手寫的內容要在按下去的當下才讀（小孩可能又改了），所以由呼叫端傳進來。
  function renderTask(containerId, o) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var isWrite = o.kind === "write";
    paint(box, containerId,
      isWrite ? "請 AI 幫我看這一句" : "請 AI 陪我練口說",
      isWrite
        ? "複製下面這段貼到 ChatGPT，它會告訴你這句對不對、哪裡可以更好，再出兩句讓你練。"
        : "複製下面這段貼到 ChatGPT，然後按它的語音按鈕（耳機圖示）開始說話，它聽得到你唸英文，會陪你一問一答。不方便講話的話，用打字也可以。",
      taskPrompt(o));
  }

  // paintPrompt：任何頁面都能丟一段自訂提示進來，共用同一套外觀與複製行為
  function paintPrompt(containerId, title, hint, text) {
    var box = document.getElementById(containerId);
    if (!box) return;
    paint(box, containerId, title, hint, text);
  }

  window.AIReview = {
    render: render, renderTask: renderTask, paintPrompt: paintPrompt,
    buildPrompt: buildPrompt, taskPrompt: taskPrompt,
  };
})();
