// 四季小鎮：產生村民卡片與故事的 Kokoro 配音規格。
// 用法:
//   node kids/tools/build_town_audio_spec.js
//   python kids/tools/generate_audio.py kids/tools/audio_town.json
// 檔名規則要跟 kids/town/index.html 的 townAudio() 一致：
//   <cardId>.mp3            卡片英文
//   <cardId>_<choiceId>.mp3 對話的每個回答
//   <storyId>.mp3           故事全文
//   <storyId>_say.mp3       孩子要自己念的最後一句
//   villager_<名字>(_motto)、arrive_<名字>  村民自我介紹、口頭禪、搬來的信
//   task_<任務id>.mp3       廣場任務
const fs = require("fs");
const path = require("path");
const C = require("../town/town_content.js");

const items = {};
Object.values(C.WEEKS).forEach(w => {
  w.cards.forEach(c => {
    items[c.id] = c.en;
    (c.choices || []).forEach(o => { items[c.id + "_" + o.id] = o.en; });
  });
  items[w.story.id] = w.story.lines.map(l => l.en).join(" ");
  items[w.story.id + "_say"] = w.story.speak;
});
Object.keys(C.VILLAGERS).forEach(v => {
  items["villager_" + v] = C.VILLAGERS[v].intro;
  items["villager_" + v + "_motto"] = C.VILLAGERS[v].motto;
  if (C.VILLAGERS[v].welcome) items["arrive_" + v] = C.VILLAGERS[v].welcome;
});
Object.values(C.LANDMARKS).forEach(L => L.stages.forEach(sg => sg.tasks.forEach(t => { items["task_" + t.id] = t.en; })));
const out = path.join(__dirname, "audio_town.json");
fs.writeFileSync(out, JSON.stringify({
  outdir: path.join(__dirname, "..", "audio", "town").replace(/\\/g, "/"),
  voice: "af_heart", speed: 0.9, items,
}, null, 1), "utf8");
console.log(Object.keys(items).length + " 段 → " + path.relative(process.cwd(), out));
