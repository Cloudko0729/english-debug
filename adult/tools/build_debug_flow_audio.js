// 產生 debug_flow.html 的語音 spec。
//
// 用法:
//   node adult/tools/build_debug_flow_audio.js
//   python kids/tools/generate_audio.py adult/tools/audio_debug_flow.json
//
// 唸的是箭頭流程本身。箭頭 → 換成停頓（逗號），直接丟給 TTS 會唸出符號名稱或整個跳過。
const fs = require("fs");
const path = require("path");

const ADULT = path.join(__dirname, "..");
const { DEBUG_FLOW, DEBUG_FLOW_PHRASES } = require(path.join(ADULT, "debug_flow.js"));
const OUT = path.join(__dirname, "audio_debug_flow.json");

// 箭頭 → 逗號＋空格；順便把 / 前後補空白，唸起來才會斷開
function speakable(s) {
  return String(s)
    .replace(/\s*→\s*/g, ", ")
    .replace(/\s*\/\s*/g, " or ")
    .replace(/\s+/g, " ")
    .trim();
}

function main() {
  const items = {};
  DEBUG_FLOW.forEach(d => { items["f" + d.id] = speakable(d.flow); });
  DEBUG_FLOW_PHRASES.forEach((p, i) => { items["p" + (i + 1)] = p.en; });

  fs.writeFileSync(OUT, JSON.stringify({
    outdir: path.join(ADULT, "audio", "debug_flow").replace(/\\/g, "/"),
    voice: "af_heart", speed: 0.92, items,
  }, null, 1), "utf8");

  console.log(`${Object.keys(items).length} 段（流程 ${DEBUG_FLOW.length}、片語 ${DEBUG_FLOW_PHRASES.length}）→ ${path.relative(process.cwd(), OUT)}`);
  console.log("\n抽樣：");
  console.log("  f2:", items.f2);
  console.log("  f5:", items.f5);
}

main();
