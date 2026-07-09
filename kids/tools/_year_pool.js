// 年度規劃候選池：L5~L8，排除 2026-07 四週已用字與 wordbank basic 已教字
const { WORD_LEVELS, EXTRA_LEVELS } = require("../wordlevels.js");
const fs = require("fs");
const WORDBANK = (() => { const m = {}; eval(fs.readFileSync(__dirname + "/../wordbank.js", "utf8") + ";m.w=WORDBANK;"); return m.w; })();
const { CURRICULUM } = require("../curriculum.js");

const used = new Set();
CURRICULUM.forEach(c => (c.weeks || []).forEach(wk => wk.words.forEach(w => used.add(w.en.toLowerCase()))));
WORDBANK.filter(w => w.level === "basic").forEach(w => used.add(w.en.toLowerCase()));

const zhOf = {};
WORDBANK.forEach(w => { const k = w.en.toLowerCase(); if (!zhOf[k]) zhOf[k] = w.zh.split("、")[0].split("，")[0].slice(0, 10); });

const all = Object.assign({}, EXTRA_LEVELS, WORD_LEVELS);
const out = [], cnt = {};
for (const [en, lv] of Object.entries(all)) {
  if (lv < 5 || lv > 8) continue;
  if (used.has(en)) continue;
  if (!/^[a-z][a-z' .-]*$/.test(en)) continue;
  out.push(`${en}\t${lv}\t${zhOf[en] || ""}`);
  cnt[lv] = (cnt[lv] || 0) + 1;
}
fs.writeFileSync(__dirname + "/_year_pool.txt", out.sort().join("\n"));
console.log("候選池:", out.length, "字", JSON.stringify(cnt));

// 48 週日曆（2026-08-02 週日起）
const weeks = [];
let d = new Date("2026-08-02T00:00:00");
const f = x => x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
for (let i = 1; i <= 48; i++) {
  const e = new Date(d); e.setDate(d.getDate() + 6);
  weeks.push(`W${i}\t${f(d)}\t${f(e)}`);
  d = new Date(d); d.setDate(d.getDate() + 7);
}
fs.writeFileSync(__dirname + "/_year_weeks.txt", weeks.join("\n"));
console.log("48 週：W1 " + weeks[0].split("\t")[1] + " ~ W48 " + weeks[47].split("\t")[2]);
