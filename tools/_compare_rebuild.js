// 比對：Codex 獨立重建 vs 既有 adult/vocab.js + repair_terms.js
const fs = require("fs"), path = require("path");
const nb = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "kids", "tools", "_codex_rebuild.json"), "utf8"));
const { ADULT_VOCAB } = require("../adult/vocab.js");
const { REPAIR_TERMS } = require("../adult/repair_terms.js");

const norm = s => String(s).toLowerCase().trim();
const oldSet = new Set([...ADULT_VOCAB.map(v => norm(v.en)), ...REPAIR_TERMS.map(t => norm(t.en))]);
const newSet = new Set(nb.en_terms.map(t => norm(t.en)));

const overlap = nb.en_terms.filter(t => oldSet.has(norm(t.en)));
const added = nb.en_terms.filter(t => !oldSet.has(norm(t.en)));
const skippedOld = [...oldSet].filter(w => !newSet.has(w));

console.log("=== 英文詞庫比對 ===");
console.log(`既有兩表合計 ${oldSet.size} 條；Codex 新版 ${nb.en_terms.length} 條`);
console.log(`重疊 ${overlap.length}（${(overlap.length / nb.en_terms.length * 100).toFixed(0)}% 一致）`);
console.log(`Codex 新增而既有沒有：${added.length} 條`);
console.log("  新增樣本:", added.slice(0, 25).map(t => t.en).join(", "));
console.log(`既有而 Codex 沒挑：${skippedOld.length} 條`);
console.log("  被略樣本:", skippedOld.slice(0, 25).join(", "));

console.log("\n=== 中→英詞彙（全新） ===");
console.log(`共 ${nb.zh_to_en.length} 條`);
const frag = nb.zh_to_en.filter(z => /修完成結|品交換作|京元|好修|沛頓/.test(z.zh));
console.log(`碎片/公司名殘留: ${frag.length}${frag.length ? " → " + frag.map(z => z.zh).join(",") : ""}`);
const noEx = nb.zh_to_en.filter(z => !z.example || !z.en);
console.log(`缺欄位: ${noEx.length}`);
nb.zh_to_en.slice(0, 12).forEach(z => console.log(` ${z.zh} → ${z.en}`));
