// 從 kids/drills/weekdrills.js 產生 Kokoro 語音 spec（每週一個 JSON）。
//
// 用法:
//   node kids/tools/build_weekdrill_audio_spec.js 2026-08-1 2026-08-2 ...
//   node kids/tools/build_weekdrill_audio_spec.js --missing      # 只做還缺音檔的週
// 接著:
//   python kids/tools/generate_audio.py kids/tools/audio_weekdrill_<週>.json
//
// 唸的是「完整句子」不是挖空後的句子 —— 英聽填空的整個設計就是讓小孩先聽到完整句，
// 才知道空格該填什麼。之前有一次填空題的四個選項在文法上都成立，就是因為小孩沒有
// 聲音可以依靠，只能猜。
const fs = require("fs");
const path = require("path");

const KIDS = path.join(__dirname, "..");
const AUDIO = path.join(KIDS, "audio", "weekdrill");
const VOICE = "af_heart";
const SPEED = 0.9;

function main() {
  const src = fs.readFileSync(path.join(KIDS, "drills", "weekdrills.js"), "utf8");
  const WEEK_DRILLS = new Function(src + ";return WEEK_DRILLS;")();

  const args = process.argv.slice(2);
  let weeks = args.filter(a => !a.startsWith("--"));
  if (args.includes("--missing") || !weeks.length) {
    weeks = Object.keys(WEEK_DRILLS).filter(wid => {
      const d = WEEK_DRILLS[wid], dir = path.join(AUDIO, wid);
      const have = fs.existsSync(dir) ? new Set(fs.readdirSync(dir)) : new Set();
      const want = d.listenBlank.length + d.reorder.length + d.reading.length;
      return have.size < want;
    });
  }
  if (!weeks.length) { console.log("沒有缺音檔的週"); return; }

  weeks.forEach(wid => {
    const d = WEEK_DRILLS[wid];
    if (!d) throw new Error("weekdrills.js 沒有 " + wid);
    const items = {};
    d.listenBlank.forEach((q, i) => { items["lb" + i] = q.full; });
    d.reorder.forEach((q, i) => { items["ro" + i] = q.sentence; });
    d.reading.forEach((r, i) => { items["passage" + i] = r.passage; });

    const out = path.join(KIDS, "tools", `audio_weekdrill_${wid}.json`);
    fs.writeFileSync(out, JSON.stringify({
      outdir: path.join(AUDIO, wid).replace(/\\/g, "/"),
      voice: VOICE, speed: SPEED, items,
    }, null, 1), "utf8");
    console.log(`${wid}　${Object.keys(items).length} 段　→ ${path.relative(process.cwd(), out)}`);
  });
}

main();
