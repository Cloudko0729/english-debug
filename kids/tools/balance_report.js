// 島嶼數值平衡報表產生器：從 island.html 萃取 BUILDINGS/CENTER_TARGETS，
// 產出 kids/balance.html（成本/時間/效益/合併路線總表）。改數值後重跑即可同步。
// 用法: node tools/balance_report.js
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "island.html"), "utf8");

function extract(name) {
  const m = html.match(new RegExp("const " + name + " = (\\{[\\s\\S]*?\\n\\});"));
  if (!m) throw new Error("找不到 " + name);
  return eval("(" + m[1] + ")");
}
function extractArr(name) {
  const m = html.match(new RegExp("const " + name + " = (\\[[\\s\\S]*?\\]);"));
  if (!m) throw new Error("找不到 " + name);
  return eval(m[1]);
}
const B = extract("BUILDINGS");
const CENTER_TARGETS = extractArr("CENTER_TARGETS");
const mergeCost = (c, s) => Math.max(20, Math.round(c.cost / 2)) * s;

const GROUPS = [
  { name: "🏠 平地建築", keys: ["forest", "pond", "ranch", "farm", "house", "town", "center"] },
  { name: "⚡ 能源", keys: ["solar", "windmill"] },
  { name: "⚓ 海上", keys: ["dock", "fishery", "oceanboat"] },
  { name: "🐾 丘陵動物", keys: ["leopardcat", "pangolin", "butterfly"] },
  { name: "🏔️ 高山動物", keys: ["bear", "salamander", "mikado", "serow", "salmon", "hawk", "sambar"] },
  { name: "🌊 海洋動物", keys: ["turtle", "dolphin", "whaleshark", "coral", "horseshoecrab"] },
  { name: "🎴 圖鑑地標（免費/集滿主題解鎖）", keys: ["lighthouse", "fountain", "hotspring", "ferris"] },
  { name: "🎁 委託板禮物（禮物券）", keys: ["postbox", "picnic", "lantern"] },
  { name: "🛶 訪客商品（特價上架）", keys: ["balloon", "statue", "flowerclock"] },
];

function cumDays(levelDays) {
  if (!levelDays) return [];
  const out = []; let acc = 0;
  levelDays.forEach(d => { acc = d; out.push(acc); });   // levelDays 是「累積天數門檻」
  return out;
}
function fmtArr(a) { return (a || []).join("/"); }

let rows = "";
GROUPS.forEach(g => {
  rows += `<tr class="grp"><td colspan="8">${g.name}</td></tr>`;
  g.keys.forEach(k => {
    const c = B[k]; if (!c) return;
    const maxLv = c.maxLevel || 3;
    const maxCoin = c.coin[maxLv - 1] || 0;
    const payback = (c.cost > 0 && maxCoin > 0) ? Math.ceil(c.cost / maxCoin) : "";
    const lastDay = c.levelDays ? c.levelDays[c.levelDays.length - 1] : "";
    const limit = c.unique ? "限1" : c.max ? "限" + c.max : c.category ? "同類上限" : "";
    const merge = (c.cost > 0 && !c.unique && !c.pet && k !== "center")
      ? [1, 2, 3, 4, 5].map(s => mergeCost(c, s)).join("/") : "—";
    rows += `<tr>
      <td>${c.emoji} ${c.name}${limit ? `<span class="lim">${limit}</span>` : ""}</td>
      <td class="num">${c.cost === 0 ? "免費" : "🪙" + c.cost}</td>
      <td class="num">${maxLv}</td>
      <td class="num">${lastDay ? lastDay + "天滿級" : "—"}</td>
      <td class="num">${fmtArr(c.coin.slice(0, maxLv))}</td>
      <td class="num">${fmtArr(c.beauty.slice(0, maxLv))}</td>
      <td class="num">${fmtArr(c.pop.slice(0, maxLv))}</td>
      <td class="num">${payback ? payback + "天" : "—"}</td>
    </tr>`;
    if (merge !== "—") rows += `<tr class="mrow"><td colspan="8">└ ✨合併費(1→5🌟)：🪙 ${merge}　每🌟全數值+50%，合併後回Lv1（再花 ${lastDay || "?"} 天練回滿級）</td></tr>`;
  });
});

const page = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>島嶼數值平衡表 — Kids English</title>
<style>
 body{font-family:Arial,"Noto Sans TC",sans-serif;background:#fff7dc;color:#243042;max-width:900px;margin:0 auto;padding:0 12px 50px;line-height:1.5}
 header{background:#2f80ed;color:#fff;text-align:center;padding:16px;margin:0 -12px 14px}
 header h1{font-size:1.25rem} header p{font-size:.8rem;opacity:.9;margin-top:4px}
 header a{color:#ffe27a;text-decoration:none;font-weight:700}
 table{width:100%;border-collapse:collapse;font-size:.82rem;background:#fff;border-radius:10px;overflow:hidden}
 th,td{border:1px solid #e2e8f0;padding:5px 7px;text-align:left}
 th{background:#dbeafe;color:#1e5fb8;position:sticky;top:0}
 td.num{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
 tr.grp td{background:#fff3d6;font-weight:800;color:#8a5a00}
 tr.mrow td{background:#fdf2ff;color:#7c4dca;font-size:.76rem}
 .lim{font-size:.68rem;background:#eef1f5;color:#667085;border-radius:6px;padding:1px 5px;margin-left:5px}
 .note{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:10px 13px;margin:12px 0;font-size:.85rem}
</style>
</head>
<body>
<header><h1>📊 島嶼數值平衡表</h1><p>由 tools/balance_report.js 從 island.html 自動產生（${new Date().toISOString().slice(0, 10)}） · <a href="island.html">← 回島嶼</a></p></header>
<div class="note"><b>說明</b>：金幣/美化/人口欄位 = 各等級數值（Lv1/Lv2/…）。回本天數 = 成本 ÷ 滿級日產（未計快樂倍率 0.6~1.2）。
城鎮中心升級門檻：${CENTER_TARGETS.map((t, i) => `Lv${i + 2}=人口${t.pop}+美化${t.beauty}`).join("、")}。
✨合併：兩棟同類同星滿級 → 保留棟+1🌟回Lv1，費用=半價×新星數，每🌟數值+50%（上限5🌟）。</div>
<table>
<tr><th>建築</th><th>成本</th><th>等級</th><th>滿級時間</th><th>金幣/天</th><th>美化</th><th>人口</th><th>回本</th></tr>
${rows}
</table>
</body>
</html>`;
fs.writeFileSync(path.join(__dirname, "..", "balance.html"), page, "utf8");
console.log("✔ kids/balance.html 已產生");

// 同時輸出精簡文字版（給數值規劃討論用）
let txt = "";
GROUPS.forEach(g => {
  txt += "## " + g.name + "\n";
  g.keys.forEach(k => {
    const c = B[k]; if (!c) return;
    const maxLv = c.maxLevel || 3;
    txt += `${c.name}(${k}): cost=${c.cost} maxLv=${maxLv} levelDays=${fmtArr(c.levelDays)} coin=${fmtArr(c.coin.slice(0, maxLv))} beauty=${fmtArr(c.beauty.slice(0, maxLv))} pop=${fmtArr(c.pop.slice(0, maxLv))}\n`;
  });
});
txt += "\nCENTER_TARGETS: " + JSON.stringify(CENTER_TARGETS) + "\n合併費=max(20,cost/2)×新星數,每星+50%,合併回Lv1\n收入倍率=0.6+0.6×快樂%,快樂=美化/(人口×1.2)\n";
fs.writeFileSync(path.join(__dirname, "balance_data.txt"), txt, "utf8");
console.log("✔ tools/balance_data.txt 已產生（討論用）");
