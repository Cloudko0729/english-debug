// 兒童英語圖片題：生成圖片映射（優先於 word_emoji.js）。
// 素材：kids/picture_vocab_img/v2/（白底粗線稿，第一批 76 字）。
// 詳見 kids/reports/picture_vocab_claude_handoff_2026-07-12.md
const WORD_IMAGE = {
  apartment: "picture_vocab_img/v2/apartment.png",
  bakery: "picture_vocab_img/v2/bakery.png",
  bathroom: "picture_vocab_img/v2/bathroom.png",
  bedroom: "picture_vocab_img/v2/bedroom.png",
  "living room": "picture_vocab_img/v2/living_room.png",
  "post office": "picture_vocab_img/v2/post_office.png",
  garden: "picture_vocab_img/v2/garden.png",
  gate: "picture_vocab_img/v2/gate.png",
  camera: "picture_vocab_img/v2/camera.png",
  basket: "picture_vocab_img/v2/basket.png",
  blanket: "picture_vocab_img/v2/blanket.png",
  rope: "picture_vocab_img/v2/rope.png",
  forest: "picture_vocab_img/v2/forest.png",
  waterfall: "picture_vocab_img/v2/waterfall.png",
  pond: "picture_vocab_img/v2/pond.png",
  "fire station": "picture_vocab_img/v2/fire_station.png",

  fork: "picture_vocab_img/v2/fork.png",
  knife: "picture_vocab_img/v2/knife.png",
  spoon: "picture_vocab_img/v2/spoon.png",
  bowl: "picture_vocab_img/v2/bowl.png",
  pot: "picture_vocab_img/v2/pot.png",
  oven: "picture_vocab_img/v2/oven.png",
  "microwave oven": "picture_vocab_img/v2/microwave_oven.png",
  stove: "picture_vocab_img/v2/stove.png",
  refrigerator: "picture_vocab_img/v2/refrigerator.png",
  napkin: "picture_vocab_img/v2/napkin.png",

  pool: "picture_vocab_img/v2/pool.png",
  boat: "picture_vocab_img/v2/boat.png",
  "police station": "picture_vocab_img/v2/police_station.png",
  airplane: "picture_vocab_img/v2/airplane.png",
  taxi: "picture_vocab_img/v2/taxi.png",
  motorcycle: "picture_vocab_img/v2/motorcycle.png",
  "traffic jam": "picture_vocab_img/v2/traffic_jam.png",
  sidewalk: "picture_vocab_img/v2/sidewalk.png",
  garage: "picture_vocab_img/v2/garage.png",
  "flat tire": "picture_vocab_img/v2/flat_tire.png",

  cabbage: "picture_vocab_img/v2/cabbage.png",
  cheese: "picture_vocab_img/v2/cheese.png",
  "fried rice": "picture_vocab_img/v2/fried_rice.png",
  tofu: "picture_vocab_img/v2/tofu.png",
  tomato: "picture_vocab_img/v2/tomato.png",
  donkey: "picture_vocab_img/v2/donkey.png",
  goat: "picture_vocab_img/v2/goat.png",
  goose: "picture_vocab_img/v2/goose.png",
  nest: "picture_vocab_img/v2/nest.png",
  pigeon: "picture_vocab_img/v2/pigeon.png",

  freezer: "picture_vocab_img/v2/freezer.png",
  ketchup: "picture_vocab_img/v2/ketchup.png",
  butter: "picture_vocab_img/v2/butter.png",
  glass: "picture_vocab_img/v2/glass.png",
  mop: "picture_vocab_img/v2/mop.png",
  saucer: "picture_vocab_img/v2/saucer.png",
  wallet: "picture_vocab_img/v2/wallet.png",
  postcard: "picture_vocab_img/v2/postcard.png",
  blouse: "picture_vocab_img/v2/blouse.png",
  cash: "picture_vocab_img/v2/cash.png",

  "department store": "picture_vocab_img/v2/department_store.png",
  "flower shop": "picture_vocab_img/v2/flower_shop.png",
  "stationery store": "picture_vocab_img/v2/stationery_store.png",
  piano: "picture_vocab_img/v2/piano.png",
  raincoat: "picture_vocab_img/v2/raincoat.png",
  rainbow: "picture_vocab_img/v2/rainbow.png",
  bookcase: "picture_vocab_img/v2/bookcase.png",
  dictionary: "picture_vocab_img/v2/dictionary.png",
  magazine: "picture_vocab_img/v2/magazine.png",
  album: "picture_vocab_img/v2/album.png",

  typewriter: "picture_vocab_img/v2/typewriter.png",
  baseball: "picture_vocab_img/v2/baseball.png",
  tennis: "picture_vocab_img/v2/tennis.png",
  beard: "picture_vocab_img/v2/beard.png",
  eyebrow: "picture_vocab_img/v2/eyebrow.png",
  heart: "picture_vocab_img/v2/heart.png",
  nurse: "picture_vocab_img/v2/nurse.png",
  medicine: "picture_vocab_img/v2/medicine.png",
  cage: "picture_vocab_img/v2/cage.png",
  sand: "picture_vocab_img/v2/sand.png",
};

// 同一題組容易混淆、不應同時出現的字組（干擾選項要避開）
const IMAGE_CONFUSE_GROUPS = [
  ["oven", "microwave oven", "stove"],
  ["fork", "knife", "spoon"],
  ["taxi", "motorcycle", "boat", "airplane"],
  ["bedroom", "living room", "bathroom", "apartment"],
  ["forest", "garden", "pond"],
  ["bookcase", "dictionary", "magazine", "album"],
  ["bakery", "flower shop", "stationery store", "department store"],
  ["cabbage", "tomato", "tofu"],
  ["goat", "donkey", "goose", "pigeon"],
];
function imageConfusesWith(en) {
  const g = IMAGE_CONFUSE_GROUPS.find(grp => grp.includes(en));
  return g ? new Set(g.filter(x => x !== en)) : null;
}

if (typeof module !== "undefined" && module.exports)
  module.exports = { WORD_IMAGE, IMAGE_CONFUSE_GROUPS, imageConfusesWith };
