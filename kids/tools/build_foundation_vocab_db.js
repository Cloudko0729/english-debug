// Build the F0–F3 / L1–L4 reusable vocabulary content database.
// The generated JSON is deterministic; edit this source and rebuild instead of
// hand-editing generated files.

"use strict";

const fs = require("fs");
const path = require("path");
const { WORD_LEVELS, EXTRA_LEVELS } = require("../wordlevels.js");
const { WORDBANK, wordAudioKey } = require("../wordbank.js");
const { WEEK_DRILLS } = require("../drills/weekdrills.js");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "vocab_db", "foundation");
const SPEC_DIR = path.join(ROOT, "tools", "foundation_audio_specs");
const AUDIO_ROOT = path.join(ROOT, "audio", "vocab_foundation");
const ALL_LEVELS = { ...EXTRA_LEVELS, ...WORD_LEVELS };
const LEVEL_COUNTS = { 1: 106, 2: 105, 3: 115, 4: 137 };
const UNIT_COUNTS = { 1: 8, 2: 7, 3: 8, 4: 10 };
const BANDS = { 1: ["F0", "F1"], 2: ["F1", "F2"], 3: ["F2", "F3"], 4: ["F3"] };

function list(text) {
  return new Set(text.trim().split(/\s*\|\s*/).filter(Boolean));
}
function table(text) {
  const out = {};
  for (const raw of text.trim().split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const at = line.indexOf("=");
    if (at < 1) throw new Error(`Bad table row: ${line}`);
    out[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return out;
}
function cap(text) { return text.charAt(0).toUpperCase() + text.slice(1); }
function slug(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}
function hasOwn(object, key) { return Object.prototype.hasOwnProperty.call(object, key); }

// Existing wordbank intentionally omitted many grammar words and very common
// nouns. These are the single teaching meanings used by the foundation DB.
const ZH = table(`
a=一個
an=一個
am=是（用於 I）
are=是（用於 you／we／they）
at=在；於
ball=球
bed=床
boy=男孩
bus=公車
car=汽車
card=卡片
cup=杯子
do=做；助動詞
door=門
fat=胖的
fine=很好；沒事
food=食物
girl=女孩
great=很棒的
he=他
here=這裡
how=如何；怎麼樣
i=我
in=在……裡面
is=是（用於 he／she／it）
it=它；這件事
job=工作；職業
jog=慢跑
kid=小孩
king=國王
lunch=午餐
man=男人
miss=想念；錯過
moon=月亮
mr=先生
mrs=太太
ms=女士
name=名字
neck=脖子
no=不；沒有
not=不
ok=好；可以
or=或者
pen=原子筆
pet=寵物
picture=圖片；照片
pie=派
pig=豬
room=房間
say=說
she=她
sky=天空
sun=太陽
tea=茶
that=那個
they=他們；她們；它們
too=也；太
toy=玩具
tree=樹
we=我們
what=什麼
who=誰
yes=是；好
you=你；你們
air=空氣
and=和；而且
bee=蜜蜂
birthday=生日
but=但是
box=盒子
candy=糖果
cap=帽子
classmate=同學
clock=時鐘
coffee=咖啡
coke=可樂
cola=可樂
cow=乳牛
day=一天；白天
dear=親愛的
doll=洋娃娃
english=英文
flower=花
friendly=友善的
fruit=水果
ham=火腿
hello=哈囉
hi=嗨
its=它的
old=老的；舊的
on=在……上面
picnic=野餐
please=請
real=真的
roc=中華民國
sandwich=三明治
sea=海
sheep=綿羊
ship=船
shy=害羞的
singer=歌手
sofa=沙發
son=兒子
song=歌曲
study=學習
table=桌子
thank=感謝
these=這些
those=那些
under=在……下面
usa=美國
very=非常
woman=女人
year=年
a.m.=上午
about=關於；大約
after=在……之後
ago=……以前
america=美國
animal=動物
any=任何；一些
beef=牛肉
bicycle=腳踏車
bike=腳踏車
breakfast=早餐
chalk=粉筆
child=孩子
computer=電腦
cookie=餅乾
cooky=餅乾（舊拼法）
cry=哭
dad=爸爸
daddy=爸爸
die=死亡
dining room=飯廳
dinner=晚餐
down=向下；在下面
drive=開車
dry=乾的
every=每一個
feel=感覺
fly=飛
friend=朋友
good-bye=再見
goodbye=再見
hot dog=熱狗
house=房子
ice=冰
ice cream=冰淇淋
into=進入……裡面
join=加入
kick=踢
kiss=親吻
kitchen=廚房
kite=風箏
learn=學習
need=需要
o'clock=……點鐘
p.m.=下午；晚上
phone=電話
really=真的；非常
salt=鹽
spell=拼字
star=星星
start=開始
telephone=電話
there=那裡
together=一起
train=火車
trip=旅行
truck=卡車
true=真的；正確的
try=嘗試
up=向上；在上面
wait=等待
wear=穿著
when=何時
where=哪裡
why=為什麼
with=和……一起；用
word=單字
worker=工作者
write=寫
alphabet=字母表
be=是；成為
bookstore=書店
cellphone=手機
city=城市
date=日期
dig=挖
dish=盤子；一道菜
does=do 的第三人稱形式；助動詞
even=甚至；平坦的
fall=秋天；掉落
feed=餵食
from=從；來自
grandfather=祖父；外祖父
grandmother=祖母；外祖母
homework=家庭作業
light=光；燈
movie=電影
never=從不
news=新聞
of=……的
office=辦公室
out=向外；在外面
page=頁
paper=紙
part=部分
pork=豬肉
road=道路
salad=沙拉
same=相同的
season=季節
send=寄送
sir=先生
size=尺寸
smart=聰明的
smell=氣味；聞起來
snack=點心
snake=蛇
so=所以；如此
some=一些
soon=很快
sound=聲音；聽起來
speak=說話；說某種語言
sports=運動
stay=停留
steak=牛排
still=仍然
stop=停止；車站
street=街道
strong=強壯的
sugar=糖
sure=確定的
sweet=甜的
tape=膠帶；錄音帶
television=電視
this=這個
tv=電視
use=使用
vacation=假期
vegetable=蔬菜
visit=拜訪；參觀
wall=牆
wet=濕的
which=哪一個
wind=風
window=窗戶
wonderful=很棒的
worry=擔心
writer=作家
wrong=錯的
`);

const POS = {
  article: list("a|an"),
  be: list("am|are|is|be"),
  auxiliary: list("do|does"),
  pronoun: list("he|i|it|she|they|we|who|you"),
  determiner: list("any|every|its|some|that|these|this|those|what|which"),
  preposition: list("about|after|at|from|in|in front of|into|next to|of|on|under|with"),
  conjunction: list("and|but|or|so"),
  interjection: list("good-bye|goodbye|hello|hey|hi|no|oh|oh-oh|ok|oops|please|thank|uh-uh|wow|yes"),
  number: list("eight|eighteen|eighty|eleven|fifteen|fifty|five|forty|four|fourteen|nine|nineteen|ninety|one|seven|seventeen|seventy|six|sixteen|sixty|ten|thirteen|thirty|three|twelve|twenty|two|zero"),
  title: list("mr|mrs|ms|sir"),
  verb: list("buy|call|close|come|cry|dance|die|dig|draw|drink|drive|eat|fall|feed|feel|fly|give|go|help|invite|join|jog|kick|kiss|learn|love|make|miss|need|paint|pay|play|read|run|say|see|send|sing|sit|sleep|smell|speak|spell|stand|start|stay|stop|study|swim|take|talk|try|use|visit|wait|walk|want|wash|wear|work|worry|write"),
  adjective: list("bad|best|better|big|black|brown|busy|cool|cute|dear|dirty|dry|fat|fine|friendly|funny|good|gray|great|green|hot|long|new|nice|old|pink|pretty|real|red|same|short|shy|slow|small|smart|strong|sunny|sure|sweet|tall|thirsty|true|warm|wet|white|wonderful|wrong|yellow|young|yucky|yummy"),
  adverb: list("a.m.|ago|down|even|here|how|never|not|now|o'clock|out|p.m.|really|soon|still|there|today|together|tomorrow|too|up|very|when|where|why|yesterday"),
};

const THEMES = {
  language: list("a|about|am|an|and|are|at|be|do|does|english|from|he|how|i|in|is|it|its|not|of|on|or|please|real|roc|say|she|so|some|speak|that|these|they|this|those|too|true|under|usa|very|we|what|when|where|which|who|why|with|word|wrong|yes|you"),
  numbers_time: list("a.m.|after|afternoon|ago|birthday|clock|date|day|eight|eighteen|eighty|eleven|evening|every|fifteen|fifty|five|forty|four|fourteen|hour|morning|never|nine|nineteen|ninety|now|o'clock|one|p.m.|seven|seventeen|seventy|six|sixteen|sixty|soon|start|still|ten|thirteen|thirty|three|today|tomorrow|twelve|twenty|two|week|weekend|year|yesterday|zero"),
  people_family: list("aunt|baby|boy|brother|child|children|classmate|dad|daddy|father|friend|girl|grandfather|grandma|grandmother|grandpa|kid|king|man|mr|mrs|ms|name|parents|she|singer|sir|sister|son|student|teacher|uncle|woman|worker|writer"),
  body_health: list("arm|body|ear|eye|fat|feel|fine|hair|hand|head|hot|hungry|leg|neck|nose|sad|thirsty|toe"),
  animals_nature: list("air|animal|ant|bee|bird|butterfly|cat|cow|dog|duck|elephant|flower|fox|frog|fruit|hen|hippo|horse|kite|lion|moon|panda|pet|pig|sand|sea|sheep|sky|snake|star|sun|tree|weather|wind|zoo"),
  school: list("alphabet|bag|book|bookstore|box|card|chalk|chair|classroom|computer|crayon|desk|draw|drawing|english|eraser|glue|homework|learn|page|paint|paper|pen|pencil|pencil box|pencil case|picture|read|reading|ruler|school|spell|study|table|teacher|word|write|writer"),
  food: list("apple|banana|beef|bread|breakfast|cake|candy|coffee|coke|cola|cookie|cookies|cooky|cup|dinner|dish|drink|drinks|eat|egg|feed|food|ham|hot dog|ice|ice cream|juice|lunch|milk|pie|pork|rice|salad|salt|sandwich|snack|soup|steak|sugar|sweet|tea|vegetable|water|yucky|yummy"),
  home_objects: list("ball|balloon|bank|bed|card|cellphone|city|clock|cup|dining room|doll|door|house|kitchen|light|office|pen|phone|picture|room|sofa|table|tape|telephone|television|toy|tv|wall|window"),
  clothes: list("cap|coat|dress|hat|shirt|short|skirt|socks|wear"),
  places_transport: list("america|bank|bicycle|bike|bookstore|bus|bus stop|car|cellphone|city|drive|home|into|office|restaurant|road|ship|station|store|street|telephone|train|trip|truck|visit"),
  actions: list("ask|buy|call|close|come|cry|dance|die|dig|do|draw|drive|fall|feel|fly|give|go|help|invite|join|jog|kick|kiss|learn|love|make|miss|need|pay|play|read|run|say|see|send|sing|sit|sleep|speak|spell|stand|stay|stop|swim|take|talk|try|use|visit|wait|walk|want|wash|work|worry|write"),
  descriptions: list("bad|best|better|big|black|brown|busy|cool|cute|dear|dirty|dry|fat|fine|friendly|funny|good|gray|great|green|long|new|nice|old|pink|pretty|real|red|same|short|shy|slow|small|smart|strong|sunny|sure|tall|true|warm|wet|white|wonderful|wrong|yellow|young"),
  seasons_weather: list("autumn|cool|dry|fall|season|snow|spring|summer|sunny|vacation|warm|weather|wet|wind|winter"),
  recreation_media: list("cd|dancing|movie|news|newspaper|picnic|soccer|song|sport|sports|swim|swimming|television|tv|vacation"),
};

const THEME_LABELS = {
  language: ["語言與句型", "Language Tools"],
  numbers_time: ["數字與時間", "Numbers and Time"],
  people_family: ["人物與家庭", "People and Family"],
  body_health: ["身體與感受", "Body and Feelings"],
  animals_nature: ["動物與自然", "Animals and Nature"],
  school: ["校園與學習", "School and Learning"],
  food: ["食物與用餐", "Food and Meals"],
  home_objects: ["住家與物品", "Home and Objects"],
  clothes: ["衣物與外觀", "Clothes and Looks"],
  places_transport: ["地點與交通", "Places and Transport"],
  actions: ["動作與日常", "Actions and Routines"],
  descriptions: ["顏色與描述", "Colors and Descriptions"],
  seasons_weather: ["季節與天氣", "Seasons and Weather"],
  recreation_media: ["休閒與媒體", "Fun and Media"],
  general: ["生活綜合", "Everyday English"],
};

const SPECIAL_EXAMPLES = {
  a: ["I have a red pen.", "There is a cat by the door."],
  an: ["I eat an apple after school.", "She has an old book."],
  am: ["I am a student.", "I am happy today."],
  are: ["You are my friend.", "They are in the classroom."],
  at: ["We meet at the bus stop.", "I get up at seven."],
  be: ["Please be quiet.", "I want to be a writer."],
  do: ["I do my homework after dinner.", "Do you like this song?"],
  does: ["She does her homework at home.", "Does he walk to school?"],
  he: ["He is my brother.", "He plays with the dog."],
  i: ["I am ten years old.", "I like to read."],
  in: ["The ball is in the box.", "We play in the park."],
  is: ["She is my teacher.", "The milk is cold."],
  it: ["It is a sunny day.", "I found a key, and it is small."],
  she: ["She is my sister.", "She has a new bag."],
  they: ["They are good friends.", "They walk to school together."],
  we: ["We are in the same class.", "We eat lunch at school."],
  you: ["You are very kind.", "Do you want some water?"],
  this: ["This is my pencil.", "This book is new."],
  that: ["That is our bus.", "That tree is tall."],
  these: ["These are my shoes.", "These apples are sweet."],
  those: ["Those are her books.", "Those birds are in the tree."],
  its: ["The dog moves its tail.", "The bird is in its nest."],
  what: ["What is your name?", "What do you want for lunch?"],
  who: ["Who is that boy?", "Who has my ruler?"],
  how: ["How are you today?", "How do you go to school?"],
  when: ["When is your birthday?", "Tell me when you are ready."],
  where: ["Where is my book?", "Where do you live?"],
  why: ["Why are you sad?", "Why do you like this story?"],
  which: ["Which bag is yours?", "Which sport do you like?"],
  and: ["I have a pencil and an eraser.", "She can sing and dance."],
  but: ["The bag is old, but it is clean.", "I am tired, but I can help."],
  or: ["Do you want tea or water?", "We can walk or take the bus."],
  so: ["It is raining, so we stay inside.", "I was hungry, so I ate a sandwich."],
  no: ["No, that is not my pen.", "There is no milk in the cup."],
  not: ["This book is not new.", "I do not like cold soup."],
  too: ["I like apples, too.", "This bag is too heavy."],
  very: ["The classroom is very clean.", "I am very happy today."],
  any: ["Do you have any questions?", "I do not have any money."],
  some: ["I need some paper.", "There are some apples on the table."],
  about: ["This book is about animals.", "We talk about our weekend."],
  after: ["I wash my hands after lunch.", "We play outside after school."],
  from: ["I am from Taiwan.", "This card is from my friend."],
  of: ["I want a cup of water.", "The door of the room is open."],
  on: ["The book is on the desk.", "We have music class on Friday."],
  under: ["The cat is under the chair.", "My shoes are under the bed."],
  "in front of": ["The bus stops in front of the school.", "Amy stands in front of me."],
  "next to": ["The bank is next to the bookstore.", "I sit next to my friend."],
  into: ["Put the books into the box.", "The dog runs into the room."],
  with: ["I go to school with my sister.", "Write your name with a pen."],
  here: ["My bag is here.", "Please come here and sit down."],
  there: ["The bus stop is over there.", "There is a bird in the tree."],
  now: ["I am busy now.", "Please open your book now."],
  soon: ["The bus will come soon.", "See you soon."],
  still: ["I am still doing my homework.", "The baby is still asleep."],
  never: ["I never drink coffee.", "He is never late for school."],
  today: ["Today is Monday.", "We have a test today."],
  tomorrow: ["Tomorrow will be sunny.", "I will visit Grandma tomorrow."],
  yesterday: ["Yesterday was rainy.", "I saw Tom yesterday."],
  ago: ["We met two days ago.", "She called me an hour ago."],
  "a.m.": ["School starts at eight a.m.", "I get up at seven a.m."],
  "p.m.": ["The movie starts at three p.m.", "I do my homework at six p.m."],
  "o'clock": ["It is nine o'clock.", "Lunch starts at twelve o'clock."],
  down: ["Please sit down.", "The ball rolls down the road."],
  up: ["Please stand up.", "Look up at the sky."],
  out: ["The children are out in the yard.", "Please take the books out of the bag."],
  together: ["We study together.", "Let us clean the room together."],
  "good-bye": ["Good-bye, Mr. Lin.", "We say good-bye after class."],
  goodbye: ["Goodbye! See you tomorrow.", "She waved goodbye to her friend."],
  hello: ["Hello, my name is Amy.", "I say hello to my teacher."],
  hi: ["Hi, Ben! How are you?", "She says hi to her classmate."],
  hey: ["Hey, wait for me!", "Hey, that is my ball."],
  oh: ["Oh, I see your bag.", "Oh, this cake is good."],
  "oh-oh": ["Oh-oh! My pencil is broken.", "Oh-oh! We missed the bus."],
  oops: ["Oops! I dropped my book.", "Oops! This is your cup."],
  "uh-uh": ["Uh-uh, that answer is not right.", "Uh-uh, I do not want coffee."],
  wow: ["Wow! That kite is big.", "Wow! You can swim fast."],
  please: ["Please close the door.", "Please give me some water."],
  thank: ["I thank Dad for his help.", "Thank you for the nice card."],
  ok: ["OK, I can help you.", "Is it OK to sit here?"],
  mr: ["Mr. Lin is our teacher.", "I say hello to Mr. Wang."],
  mrs: ["Mrs. Chen has a small store.", "I gave the card to Mrs. Lee."],
  ms: ["Ms. Wu teaches English.", "Please ask Ms. Lin for help."],
  sir: ["Yes, sir. I understand.", "Excuse me, sir. Is this your bag?"],
  america: ["My aunt lives in America.", "America is a large country."],
  usa: ["The USA is in North America.", "My friend is from the USA."],
  roc: ["ROC means the Republic of China.", "Taiwan is also called the ROC in some formal names."],
  english: ["We study English at school.", "This book is in English."],
  air: ["The air is cool and clean.", "Open the window and let in some air."],
  food: ["We need food and water.", "The food at this restaurant is good."],
  news: ["I heard good news today.", "Dad reads the news in the morning."],
  paper: ["I write on a piece of paper.", "We need some paper for the picture."],
  homework: ["I do my homework after school.", "My math homework is on the desk."],
  money: ["I save my money.", "There is some money in the bag."],
  salt: ["Please put some salt in the soup.", "Too much salt is not healthy."],
  sugar: ["I put a little sugar in my tea.", "This cake has too much sugar."],
  water: ["I drink water after running.", "The water in the cup is warm."],
  beef: ["We eat beef with rice.", "The beef is hot."],
  bread: ["I eat bread for breakfast.", "The bread is on the table."],
  pork: ["Mom cooks pork for dinner.", "The pork is in the dish."],
  rice: ["I eat rice for lunch.", "The rice is in my bowl."],
  salad: ["We have salad with dinner.", "The salad has many vegetables."],
  sports: ["We play sports after school.", "Sports help us stay strong."],
  weather: ["The weather is sunny today.", "We check the weather before our trip."],
  even: ["Even my little brother can do it.", "The two sides are even."],
  fall: ["Leaves fall from the tree.", "Fall is another word for autumn."],
  smell: ["The soup smells good.", "I smell flowers in the garden."],
  sound: ["I hear a strange sound.", "Your plan sounds good."],
  light: ["Please turn on the light.", "The bag is light and easy to carry."],
  miss: ["I miss my friend.", "Do not miss the school bus."],
  say: ["Please say your name.", "She says hello to the new student."],
  speak: ["I can speak English.", "Please speak slowly."],
  talk: ["I talk with my friend after class.", "We talk about the story."],
  study: ["I study English every day.", "We study in the library."],
  learn: ["I learn new words at school.", "We learn how to make a card."],
  spell: ["Can you spell your name?", "I can spell this word."],
  write: ["I write my name on the paper.", "She writes a short story."],
  read: ["I read a book at night.", "Please read this page."],
  die: ["Plants die without water.", "The old tree did not die in winter."],
  feel: ["I feel happy today.", "The water feels warm."],
  fly: ["Birds can fly.", "We fly a kite in the park."],
  join: ["I want to join the music club.", "Please join us for lunch."],
  kick: ["Do not kick the door.", "He kicks the ball into the goal."],
  kiss: ["Mom gives the baby a kiss.", "She kisses her child good night."],
  need: ["I need a pencil.", "Plants need water and light."],
  start: ["Class starts at eight.", "We start our homework after dinner."],
  try: ["Please try this soup.", "I try to read every day."],
  wait: ["Please wait for me.", "We wait at the bus stop."],
  wear: ["I wear a coat in winter.", "She wears a white shirt."],
  drive: ["My father drives to work.", "Please drive slowly on this road."],
  dry: ["My socks are dry now.", "Please dry the wet table."],
  cry: ["The baby cries when she is hungry.", "Do not cry; I can help you."],
  "dining room": ["We eat dinner in the dining room.", "The dining room has a large table."],
  house: ["My house has three rooms.", "There is a tree in front of the house."],
  home: ["I go home after school.", "My mother is at home."],
  room: ["My room is small but clean.", "There are two windows in the room."],
  job: ["My father has a new job.", "Teaching is an important job."],
  work: ["My parents work in the city.", "We work together on the picture."],
  worker: ["The worker fixes the road.", "A worker wears a yellow hat."],
  writer: ["The writer makes funny stories.", "I want to be a writer."],
  best: ["This is my best picture.", "Amy is my best friend."],
  better: ["I feel better today.", "This plan is better than the old one."],
  fine: ["I am fine, thank you.", "The weather is fine today."],
  good: ["This is a good book.", "The soup smells good."],
  great: ["You did a great job.", "We had a great day at the zoo."],
  nice: ["She is nice to everyone.", "It is a nice day for a picnic."],
  wonderful: ["We had a wonderful trip.", "That is a wonderful idea."],
  real: ["Is this a real flower?", "The story is based on a real animal."],
  same: ["We are in the same class.", "These two bags are the same color."],
  sure: ["I am sure this is my book.", "Are you sure about the date?"],
  wrong: ["This answer is wrong.", "I took the wrong bus."],
  fat: ["The cat is fat.", "This pig is short and fat."],
  tall: ["My brother is tall.", "That is a tall tree."],
  long: ["She has long hair.", "The road is long."],
  short: ["This pencil is short.", "The boy has short hair."],
  big: ["The elephant is big.", "I have a big school bag."],
  small: ["The ant is small.", "She lives in a small house."],
  hot: ["The soup is hot.", "It is hot in summer."],
  warm: ["The tea is warm.", "Spring days are warm."],
  cool: ["The evening air is cool.", "Put the drink in a cool place."],
  wet: ["My shoes are wet.", "The road is wet after the rain."],
  sweet: ["The apple is sweet.", "This tea is too sweet."],
  yummy: ["The cake is yummy.", "This soup looks yummy."],
  yucky: ["The old milk smells yucky.", "This medicine tastes yucky."],
};

// Low-level vocabulary needs concrete, child-friendly examples. These entries
// replace generic templates whenever an article, plural form, gerund, proper
// noun, or abstract meaning would otherwise make the sentence unnatural.
Object.assign(SPECIAL_EXAMPLES, {
  alphabet: ["We sing the alphabet song.", "Write the alphabet from A to Z."],
  balloon: ["The red balloon is in the sky.", "She has a balloon for the party."],
  birthday: ["My birthday is in May.", "We made a card for Dad's birthday."],
  bookstore: ["We buy books at the bookstore.", "The bookstore is next to the bank."],
  breakfast: ["I eat breakfast at seven.", "We have bread and milk for breakfast."],
  "bus stop": ["We wait for the bus at the bus stop.", "The bus stop is in front of the school."],
  cd: ["This CD has ten songs.", "Dad plays a CD in the car."],
  cellphone: ["Mom calls me on her cellphone.", "Please put your cellphone in your bag."],
  chalk: ["The teacher writes with chalk.", "There is a piece of chalk by the board."],
  child: ["The child is reading a book.", "Every child needs a pencil."],
  children: ["The children are playing outside.", "These children are in my class."],
  "chinese new year": ["We visit Grandma during Chinese New Year.", "Chinese New Year is a family holiday."],
  city: ["Many people live in the city.", "We take a bus into the city."],
  classmate: ["Ben is my new classmate.", "I sit next to my classmate."],
  clock: ["The clock is on the wall.", "I look at the clock before class."],
  cookie: ["I have a cookie for my snack.", "This cookie is shaped like a star."],
  cookies: ["The cookies are on the plate.", "We made six cookies after school."],
  cooky: ["This cooky is round and sweet.", "She put the cooky on a plate."],
  crayon: ["I color the sun with a yellow crayon.", "My blue crayon is in the pencil box."],
  cup: ["Please give me a cup of water.", "The blue cup is on the table."],
  dad: ["Dad reads the news after dinner.", "I help Dad wash the car."],
  daddy: ["Daddy, please read this story.", "My daddy makes breakfast on Sunday."],
  dancing: ["Dancing is fun and good exercise.", "We practice dancing after school."],
  date: ["Write today's date on the page.", "What is the date of the school trip?"],
  dear: ["My dear friend sent me a card.", "Dear Grandma, thank you for the gift."],
  dig: ["The dog likes to dig in the sand.", "We dig a small hole for the tree."],
  dinner: ["We eat dinner at six.", "Mom cooks rice and vegetables for dinner."],
  dish: ["Please put the salad in this dish.", "I wash my dish after dinner."],
  drawing: ["Her drawing is on the classroom wall.", "I made a drawing of my family."],
  drinks: ["The cold drinks are in the kitchen.", "We bring drinks to the picnic."],
  every: ["I read every day.", "Every student has a book."],
  feed: ["Please feed the cat before school.", "We feed the ducks at the park."],
  friendly: ["Our new classmate is friendly.", "The friendly dog likes children."],
  fruit: ["I eat some fruit after lunch.", "Apples and bananas are fruit."],
  glue: ["Put some glue on the paper.", "The glue is next to the scissors."],
  grandfather: ["My grandfather walks every morning.", "I visit my grandfather on Sunday."],
  grandmother: ["My grandmother makes good soup.", "This card is for my grandmother."],
  "hot dog": ["I have a hot dog for lunch.", "The hot dog is on the plate."],
  ice: ["Please put some ice in my water.", "The ice melts in the warm sun."],
  invite: ["I want to invite Amy to my party.", "We invite our friends to the picnic."],
  kitchen: ["Mom is cooking in the kitchen.", "The cups are in the kitchen."],
  kite: ["We fly a kite in the park.", "The red kite is high in the sky."],
  kitten: ["The little kitten is under the chair.", "I give the kitten some milk."],
  kitty: ["Here, kitty! Come to me.", "The kitty is sleeping on the sofa."],
  lunch: ["I eat lunch at school.", "We have rice and vegetables for lunch."],
  moon: ["The moon is bright tonight.", "We can see the moon in the night sky."],
  movie: ["We watch a funny movie together.", "The movie starts at three."],
  name: ["My name is Tina.", "Please write your name on the card."],
  newspaper: ["Grandpa reads the newspaper every morning.", "The newspaper is on the table."],
  office: ["My mother works in an office.", "Please take this paper to the school office."],
  page: ["Open your book to page ten.", "There is a picture on this page."],
  panda: ["The panda is eating.", "We saw a panda at the zoo."],
  part: ["This is my favorite part of the story.", "Each child reads one part of the dialogue."],
  pencil: ["I write with a pencil.", "My pencil is in the pencil case."],
  "pencil box": ["My ruler is in the pencil box.", "This pencil box is blue."],
  "pencil case": ["Put your eraser in the pencil case.", "Her pencil case is on the desk."],
  phone: ["The phone is ringing.", "I talk to Grandma on the phone."],
  picnic: ["We have a picnic in the park.", "Please bring fruit to the picnic."],
  reading: ["Reading helps me learn new words.", "We have reading time after lunch."],
  really: ["I really like this song.", "Is that really your bag?"],
  sandwich: ["I made a sandwich for lunch.", "The sandwich has ham and egg in it."],
  sea: ["The sea is blue and calm.", "We can see ships on the sea."],
  send: ["Please send this card to Grandma.", "I send a message to my friend."],
  shy: ["The new student is shy.", "My little sister feels shy around new people."],
  singing: ["Singing makes me happy.", "We practice singing for the school show."],
  size: ["What size is this shirt?", "These two boxes are the same size."],
  sky: ["The sky is blue today.", "I can see a kite in the sky."],
  smart: ["Amy is smart and works hard.", "That was a smart answer."],
  snack: ["I eat fruit for my afternoon snack.", "Please put your snack in the bag."],
  song: ["We sing a song in music class.", "This song is easy to learn."],
  son: ["Their son is six years old.", "Mr. Lee walks to school with his son."],
  sport: ["Soccer is my favorite sport.", "Which sport do you play after school?"],
  star: ["We can see a bright star tonight.", "Draw a star next to your name."],
  stay: ["Please stay here with me.", "We stay inside when it rains."],
  steak: ["Dad cooks steak for dinner.", "The steak is on the plate."],
  stop: ["Please stop at the red light.", "The rain will stop soon."],
  street: ["Our school is on this street.", "Look both ways before you cross the street."],
  strong: ["My brother is strong.", "Milk helps children grow strong."],
  sun: ["The sun is bright and warm.", "Do not look straight at the sun."],
  swimming: ["We go swimming in summer.", "Swimming is my favorite sport."],
  table: ["The books are on the table.", "We eat dinner at the kitchen table."],
  tape: ["Use tape to put the picture on the wall.", "The tape is in the pencil box."],
  telephone: ["The telephone is next to the sofa.", "I use the telephone to call Grandpa."],
  television: ["We watch a program on television.", "Please turn off the television after the movie."],
  train: ["We take the train to the city.", "The train stops at this station."],
  tree: ["A bird is in the tree.", "We planted a small tree by the house."],
  trip: ["Our class trip is on Friday.", "I packed a hat for the trip."],
  true: ["The story is true.", "Is it true that pandas can swim?"],
  tv: ["We watch TV after dinner.", "The TV is in the living room."],
  use: ["I use a ruler to draw a line.", "Can I use your blue crayon?"],
  vacation: ["We visit Grandma during summer vacation.", "Our winter vacation starts next week."],
  vegetable: ["A carrot is a vegetable.", "Please eat a vegetable with your dinner."],
  wall: ["There is a clock on the wall.", "We put our pictures on the classroom wall."],
  wind: ["The wind is strong today.", "I can feel the wind on my face."],
  window: ["Please open the window.", "The bird is outside the window."],
  worry: ["Do not worry; I can help you.", "I worry when my dog is missing."],
  yes: ["Yes, I am ready.", "She said yes to the picnic."],
});

Object.assign(SPECIAL_EXAMPLES, {
  ball: ["I throw the ball to Ben.", "The red ball is under the chair."],
  boy: ["The boy is my brother.", "A boy is playing with the dog."],
  box: ["Put the books in the box.", "The box is under my desk."],
  card: ["I made a card for Grandma.", "Write your name on the card."],
  coke: ["I do not drink Coke every day.", "The Coke is cold."],
  cola: ["Would you like some cola?", "The cola is in the cup."],
  friend: ["Amy is my best friend.", "I talk with my friend after class."],
  girl: ["The girl has a blue kite.", "That girl is in my class."],
  kid: ["The kid is playing with a toy.", "Every kid gets a turn."],
  king: ["The king lives in a big house.", "The story is about a kind king."],
  man: ["The man is waiting for the bus.", "That man is my teacher."],
  pet: ["My pet is a small dog.", "We take our pet to the park."],
  picture: ["I draw a picture of my family.", "The picture is on my desk."],
  pie: ["We made an apple pie.", "The pie is on the table."],
  season: ["Spring is my favorite season.", "Each season has different weather."],
  singer: ["The singer has a beautiful voice.", "My aunt is a singer."],
  tea: ["I drink warm tea in the morning.", "The tea is on the table."],
  toy: ["The baby has a new toy.", "Please put the toy in the box."],
  woman: ["The woman is waiting at the bus stop.", "That woman is our teacher."],
  word: ["Read the word on the card.", "I use this word in a sentence."],
});

const COLLOCATIONS = {
  a: "a + singular noun", an: "an + vowel sound", am: "I am", are: "you/we/they are",
  is: "he/she/it is", do: "do homework", does: "does homework", at: "at seven",
  in: "in the box", on: "on the desk", under: "under the chair",
  "in front of": "in front of the school", "next to": "next to my friend",
  come: "come here", go: "go home", say: "say hello", speak: "speak English",
  talk: "talk with a friend", see: "see a bird", read: "read a book", write: "write a story",
  home: "go home", house: "a small house", room: "in the room",
  job: "have a job", work: "work together", worker: "a factory worker",
  breakfast: "eat breakfast", lunch: "eat lunch", dinner: "eat dinner",
  morning: "in the morning", afternoon: "in the afternoon", evening: "in the evening",
  today: "today is", yesterday: "yesterday was", tomorrow: "tomorrow will",
  wear: "wear a coat", dress: "wear a dress", weather: "check the weather",
  sport: "play a sport", sports: "play sports", swimming: "go swimming",
};

function confusion(id, titleZh, members, conceptZh, rules, examples, dialogue, checks) {
  return {
    id, titleZh, members, conceptZh, rules,
    examples: examples.map((text, index) => ({ id: `${id}-e${index + 1}`, text })),
    dialogue: dialogue.map((line, index) => ({
      id: `${id}-d${index + 1}`, speaker: index % 2 === 0 ? "A" : "B", text: line,
    })),
    checks,
  };
}

const CONFUSIONS = [
  confusion("a-an", "a / an：看聲音，不只看字母", ["a", "an"],
    "兩者都放在單數可數名詞前。下一個字以母音聲音開始用 an，其他用 a。",
    ["a + consonant sound", "an + vowel sound", "注意 hour 的 h 不發音，因此是 an hour"],
    ["I have a red bag.", "She eats an apple.", "He waits for an hour.", "This is a useful book."],
    ["Do you have a pencil?", "Yes, and I have an eraser, too.", "Is it an old eraser?", "No, it is a new one."],
    [{ prompt: "___ apple", answer: "an", choices: ["a", "an"] }, { prompt: "___ useful book", answer: "a", choices: ["a", "an"] }],
  ),
  confusion("be-forms", "am / is / are：主詞決定 be 動詞", ["am", "is", "are", "be"],
    "I 配 am；he、she、it 和單數配 is；you、we、they 和複數配 are。情態動詞或 to 後使用 be。",
    ["I am", "he/she/it is", "you/we/they are", "can be / to be"],
    ["I am ready.", "The dog is under the desk.", "They are good friends.", "Please be quiet."],
    ["Are you ready?", "Yes, I am.", "Is Ben with you?", "Yes, we are in the same class."],
    [{ prompt: "She ___ my sister.", answer: "is", choices: ["am", "is", "are"] }, { prompt: "We ___ at school.", answer: "are", choices: ["am", "is", "are"] }],
  ),
  confusion("do-does", "do / does：一般動詞問句", ["do", "does"],
    "I、you、we、they 用 do；he、she、it 用 does。用了 does，後面的動詞回原形。",
    ["Do + I/you/we/they", "Does + he/she/it", "Does she like，不說 Does she likes"],
    ["Do you like milk?", "Does Amy walk to school?", "We do our homework.", "He does his homework."],
    ["Do you play soccer?", "Yes, I do.", "Does your sister play, too?", "No, she does not."],
    [{ prompt: "___ he read every day?", answer: "Does", choices: ["Do", "Does"] }, { prompt: "___ they live here?", answer: "Do", choices: ["Do", "Does"] }],
  ),
  confusion("pronouns", "I / you / he / she / it / we / they", ["i", "you", "he", "she", "it", "we", "they"],
    "代名詞替代人物或物品。I 永遠大寫；it 通常代替單一物品或動物；we 包含說話者。",
    ["I = 說話者", "you = 對方", "he/she = 單一人物", "it = 單一物品", "we/they = 複數"],
    ["I am a student.", "She is my teacher.", "It is a new book.", "They are in the library."],
    ["Who is Amy?", "She is my sister.", "Where are Ben and Leo?", "They are at school."],
    [{ prompt: "Tom is my friend. ___ is nice.", answer: "He", choices: ["He", "She", "It"] }, { prompt: "The book is new. ___ is red.", answer: "It", choices: ["He", "She", "It"] }],
  ),
  confusion("this-that", "this / that / these / those：距離與單複數", ["this", "that", "these", "those"],
    "近處單數 this、遠處單數 that；近處複數 these、遠處複數 those。",
    ["this = 近＋單", "that = 遠＋單", "these = 近＋複", "those = 遠＋複"],
    ["This pencil is mine.", "That bus is ours.", "These books are new.", "Those trees are tall."],
    ["Is this your bag?", "Yes, it is.", "Are those your shoes?", "No, my shoes are here."],
    [{ prompt: "___ apples here are sweet.", answer: "These", choices: ["This", "That", "These", "Those"] }, { prompt: "___ bird over there is small.", answer: "That", choices: ["This", "That", "These", "Those"] }],
  ),
  confusion("in-on-at", "in / on / at：位置與時間", ["in", "on", "at"],
    "in 表示在裡面或較大時間；on 表示接觸表面或日期；at 表示一個點或精確時間。",
    ["in the box / in July", "on the desk / on Monday", "at school / at seven"],
    ["The pencil is in the box.", "The book is on the desk.", "We meet at school.", "Class starts at eight."],
    ["Where is your notebook?", "It is in my bag.", "When is the test?", "It is on Friday at nine."],
    [{ prompt: "___ Monday", answer: "on", choices: ["in", "on", "at"] }, { prompt: "___ the room", answer: "in", choices: ["in", "on", "at"] }],
  ),
  confusion("place-relations", "under / in front of / next to", ["under", "in front of", "next to"],
    "under 是正下方；in front of 是前方；next to 是緊鄰旁邊。",
    ["under = 下方", "in front of = 前方", "next to = 緊鄰"],
    ["The cat is under the chair.", "The bus is in front of the school.", "The bank is next to the bookstore.", "My shoes are under the bed."],
    ["Where is the bus stop?", "It is in front of the bank.", "Is the bank next to the store?", "Yes, they are side by side."],
    [{ prompt: "The pencil is below the book.", answer: "under", choices: ["under", "next to"] }, { prompt: "The two stores are side by side.", answer: "next to", choices: ["in front of", "next to"] }],
  ),
  confusion("here-there", "here / there：說話者的位置", ["here", "there"],
    "here 是靠近說話者；there 是離說話者較遠的位置。",
    ["come here", "over there", "this ... here", "that ... there"],
    ["My bag is here.", "The bus stop is over there.", "Come here, please.", "There is a bird in that tree."],
    ["Is my book there?", "No, it is here on my desk.", "Where is the bus?", "It is over there."],
    [{ prompt: "The pencil beside me is ___.", answer: "here", choices: ["here", "there"] }, { prompt: "Look at that tree over ___.", answer: "there", choices: ["here", "there"] }],
  ),
  confusion("come-go", "come / go：移動方向", ["come", "go"],
    "come 是朝說話者或目的地靠近；go 是離開目前位置前往別處。",
    ["come here", "come home", "go to school", "go there"],
    ["Please come here.", "Dad comes home at six.", "I go to school by bus.", "We go there on Sunday."],
    ["Can you come to my house?", "Yes, I can go after lunch.", "When will you come?", "I will come at two."],
    [{ prompt: "Please ___ here.", answer: "come", choices: ["come", "go"] }, { prompt: "We ___ to the zoo tomorrow.", answer: "go", choices: ["come", "go"] }],
  ),
  confusion("say-speak-talk", "say / speak / talk", ["say", "speak", "talk"],
    "say 重點是說出的內容；speak 常接語言或正式發言；talk 表示交談，常用 talk to/with/about。",
    ["say hello", "speak English", "talk with a friend", "talk about a story"],
    ["Please say your name.", "I can speak English.", "I talk with my friend.", "We talk about the movie."],
    ["Can you speak English?", "Yes, but I speak slowly.", "What do you talk about at school?", "We talk about books."],
    [{ prompt: "___ English", answer: "speak", choices: ["say", "speak", "talk"] }, { prompt: "___ hello", answer: "say", choices: ["say", "speak", "talk"] }],
  ),
  confusion("home-house-room", "home / house / room", ["home", "house", "room"],
    "house 是建築物；room 是房子裡的一個房間；home 強調居住與歸屬，可直接說 go home。",
    ["a big house", "my room", "at home", "go home（不加 to）"],
    ["My house has three rooms.", "My room is small.", "Mom is at home.", "I go home after school."],
    ["Where do you live?", "I live in a small house.", "Is your room upstairs?", "Yes, but I study at home in the living room."],
    [{ prompt: "I go ___ after school.", answer: "home", choices: ["home", "house", "room"] }, { prompt: "The kitchen is a ___ in a house.", answer: "room", choices: ["home", "house", "room"] }],
  ),
  confusion("job-work-worker", "job / work / worker", ["job", "work", "worker"],
    "job 是一份職業或工作；work 可指工作這件事或動詞；worker 是做工作的人。",
    ["have a job", "go to work", "work together", "a factory worker"],
    ["My father has a new job.", "My parents work in the city.", "We have a lot of work today.", "The worker fixes the road."],
    ["What is your father's job?", "He is a worker at a bakery.", "Does he work every day?", "He works from Monday to Friday."],
    [{ prompt: "She has a new ___.", answer: "job", choices: ["job", "work", "worker"] }, { prompt: "The ___ repairs the door.", answer: "worker", choices: ["job", "work", "worker"] }],
  ),
  confusion("child-children-kid", "child / children / kid", ["child", "children", "kid"],
    "child 是正式的單數；children 是不規則複數；kid 是較口語的孩子。",
    ["one child", "two children", "a kid"],
    ["The child is five years old.", "The children play outside.", "That kid is my friend.", "Every child needs help sometimes."],
    ["How many children are there?", "There are three children.", "Is that kid your brother?", "Yes, he is the youngest child in my family."],
    [{ prompt: "two ___", answer: "children", choices: ["child", "children", "childs"] }, { prompt: "one ___", answer: "child", choices: ["child", "children"] }],
  ),
  confusion("time-of-day", "morning / afternoon / evening", ["morning", "afternoon", "evening"],
    "morning 是起床到中午前；afternoon 是中午後；evening 是傍晚到睡前。",
    ["in the morning", "in the afternoon", "in the evening"],
    ["I eat breakfast in the morning.", "We have art in the afternoon.", "I eat dinner in the evening.", "The sky gets dark in the evening."],
    ["When do you study?", "I study in the afternoon.", "What do you do in the evening?", "I eat dinner with my family."],
    [{ prompt: "Breakfast is usually in the ___.", answer: "morning", choices: ["morning", "afternoon", "evening"] }, { prompt: "Dinner is usually in the ___.", answer: "evening", choices: ["morning", "afternoon", "evening"] }],
  ),
  confusion("day-reference", "today / yesterday / tomorrow / ago", ["today", "yesterday", "tomorrow", "ago"],
    "today 是今天；yesterday 是昨天；tomorrow 是明天；ago 從現在往前數一段時間。",
    ["today is", "yesterday was", "tomorrow will", "two days ago"],
    ["Today is sunny.", "Yesterday was rainy.", "Tomorrow will be warm.", "We met two days ago."],
    ["Did you see Amy yesterday?", "No, I saw her two days ago.", "Will she come tomorrow?", "Yes, she will come after lunch."],
    [{ prompt: "the day before today", answer: "yesterday", choices: ["today", "yesterday", "tomorrow"] }, { prompt: "three hours ___", answer: "ago", choices: ["ago", "tomorrow"] }],
  ),
  confusion("connectors", "and / but / or / so", ["and", "but", "or", "so"],
    "and 加上相同方向資訊；but 表示轉折；or 提供選擇；so 表示前因後果。",
    ["A and B", "A, but B", "A or B", "原因, so 結果"],
    ["I have a pen and a ruler.", "The bag is old, but it is clean.", "Do you want tea or water?", "I was tired, so I went home."],
    ["Do you want rice or bread?", "I want rice and soup.", "The soup is hot, but it is good.", "I am hungry, so I can eat it."],
    [{ prompt: "It rained, ___ we stayed home.", answer: "so", choices: ["and", "but", "or", "so"] }, { prompt: "The dog is small, ___ it is strong.", answer: "but", choices: ["and", "but", "or", "so"] }],
  ),
  confusion("some-any", "some / any", ["some", "any"],
    "肯定句常用 some；一般問句與否定句常用 any。邀請或預期答案是 yes 的問句也可用 some。",
    ["some water", "any questions?", "not any", "Would you like some ...?"],
    ["I need some paper.", "Do you have any questions?", "We do not have any milk.", "Would you like some tea?"],
    ["Do we have any apples?", "Yes, there are some on the table.", "Can I have some?", "Yes, you can have two."],
    [{ prompt: "I have ___ books.", answer: "some", choices: ["some", "any"] }, { prompt: "Do you have ___ pencils?", answer: "any", choices: ["some", "any"] }],
  ),
  confusion("size-length-height", "big / small / tall / long / short", ["big", "small", "tall", "long", "short"],
    "big/small 說整體大小；tall 說由下到上的高度；long/short 說長度，short 也可說身高較矮。",
    ["a big box", "a small ant", "a tall tree", "a long road", "short hair"],
    ["The elephant is big.", "The ant is small.", "The tree is tall.", "The road is long."],
    ["Is the giraffe big?", "Yes, and it is very tall.", "Is its tail long?", "Yes, but its hair is short."],
    [{ prompt: "a ___ tree（高）", answer: "tall", choices: ["big", "tall", "long"] }, { prompt: "a ___ road（長）", answer: "long", choices: ["tall", "long", "short"] }],
  ),
  confusion("temperature", "hot / warm / cool", ["hot", "warm", "cool"],
    "hot 是很熱；warm 是舒適的溫暖；cool 是稍冷或涼爽。",
    ["hot soup", "warm tea", "cool air"],
    ["The soup is hot.", "The tea is warm.", "The evening air is cool.", "Summer days are hot."],
    ["Is the water hot?", "No, it is warm.", "How is the air outside?", "It is cool this evening."],
    [{ prompt: "Tea that is comfortable to drink is ___.", answer: "warm", choices: ["hot", "warm", "cool"] }, { prompt: "Summer sun can be very ___.", answer: "hot", choices: ["hot", "warm", "cool"] }],
  ),
  confusion("quality-words", "good / fine / nice / great", ["good", "fine", "nice", "great"],
    "good 是一般的好；fine 常回答身體狀況沒問題；nice 表示令人愉快或待人友善；great 比 good 更強。",
    ["good food", "I am fine", "a nice person", "a great job"],
    ["The food is good.", "I am fine, thank you.", "She is nice to everyone.", "You did a great job."],
    ["How are you?", "I am fine, thank you.", "How was your trip?", "It was great, and the people were nice."],
    [{ prompt: "How are you? I am ___.", answer: "fine", choices: ["fine", "great"] }, { prompt: "You did a ___ job!", answer: "great", choices: ["fine", "great"] }],
  ),
  confusion("meal-times", "breakfast / lunch / dinner", ["breakfast", "lunch", "dinner"],
    "breakfast 是早上第一餐；lunch 是中午餐；dinner 通常是晚餐或一天的主餐。",
    ["eat breakfast", "have lunch", "cook dinner"],
    ["I eat breakfast at seven.", "We have lunch at school.", "Dad cooks dinner at six.", "Dinner is in the dining room."],
    ["What do you eat for breakfast?", "I eat bread and an egg.", "Where do you have lunch?", "I have lunch at school."],
    [{ prompt: "the morning meal", answer: "breakfast", choices: ["breakfast", "lunch", "dinner"] }, { prompt: "the midday meal", answer: "lunch", choices: ["breakfast", "lunch", "dinner"] }],
  ),
  confusion("phone-words", "phone / telephone / cellphone", ["phone", "telephone", "cellphone"],
    "phone 是最常用總稱；telephone 可指電話或較正式說法；cellphone 特別指行動電話。",
    ["call by phone", "a telephone number", "use a cellphone"],
    ["I call Mom on the phone.", "What is your telephone number?", "My cellphone is in my bag.", "The office telephone is on the desk."],
    ["Can I use your phone?", "Yes, my cellphone is on the table.", "Do you know the school's telephone number?", "Yes, it is on this card."],
    [{ prompt: "a mobile phone", answer: "cellphone", choices: ["telephone", "cellphone"] }, { prompt: "the general short word", answer: "phone", choices: ["phone", "cellphone"] }],
  ),
  confusion("media-words", "TV / television / movie / news", ["tv", "television", "movie", "news"],
    "TV 是 television 的縮寫；movie 是電影；news 是新聞，形式看似複數但通常當不可數名詞。",
    ["watch TV", "turn on the television", "watch a movie", "read the news"],
    ["We watch TV after dinner.", "Please turn off the television.", "The movie is funny.", "Dad reads the news."],
    ["What is on TV?", "The evening news is on now.", "Can we watch a movie later?", "Yes, after the news."],
    [{ prompt: "TV is short for ___.", answer: "television", choices: ["television", "movie"] }, { prompt: "Information about recent events is ___.", answer: "news", choices: ["movie", "news"] }],
  ),
  confusion("fall-autumn", "fall / autumn", ["fall", "autumn"],
    "作為季節時兩者都表示秋天；fall 較常見於美式英文，autumn 英美皆可用。fall 也可作動詞「掉落」。",
    ["in fall", "in autumn", "leaves fall"],
    ["Leaves fall in autumn.", "We go hiking in the fall.", "Autumn is cool.", "Do not fall on the wet road."],
    ["Which season do you like?", "I like autumn.", "Do you say fall, too?", "Yes, fall and autumn can name the same season."],
    [{ prompt: "Leaves ___ from trees.", answer: "fall", choices: ["fall", "autumn"] }, { prompt: "another word for the season fall", answer: "autumn", choices: ["fall", "autumn"] }],
  ),
  confusion("sport-forms", "sport / sports / swimming / soccer", ["sport", "sports", "swimming", "soccer"],
    "sport 可指一種運動；sports 指運動活動的總稱；swimming 與 soccer 是具體運動名稱。",
    ["a team sport", "play sports", "go swimming", "play soccer"],
    ["Soccer is a team sport.", "We play sports after school.", "I go swimming on Sunday.", "My brother plays soccer."],
    ["What sport do you like?", "I like swimming.", "Do you play sports at school?", "Yes, I play soccer."],
    [{ prompt: "I ___ soccer.", answer: "play", choices: ["play", "go"] }, { prompt: "I ___ swimming.", answer: "go", choices: ["play", "go"] }],
  ),
  confusion("cookie-forms", "cookie / cookies / cooky", ["cookie", "cookies", "cooky"],
    "cookie 是單數，cookies 是複數。cooky 是較少見的舊拼法，學習時以 cookie 為主。",
    ["one cookie", "two cookies", "prefer the spelling cookie"],
    ["I have one cookie.", "There are three cookies on the plate.", "Cookie is the usual spelling.", "The old spelling cooky is uncommon."],
    ["Would you like a cookie?", "Yes, may I have two cookies?", "How do you spell it?", "Use c-o-o-k-i-e."],
    [{ prompt: "two ___", answer: "cookies", choices: ["cookie", "cookies", "cooky"] }, { prompt: "the usual singular spelling", answer: "cookie", choices: ["cookie", "cooky"] }],
  ),
];

function getPos(word) {
  for (const [pos, words] of Object.entries(POS)) {
    if (words.has(word)) return pos;
  }
  const bank = WORDBANK.find(item => item.en.toLowerCase() === word);
  if (bank && bank.pos) {
    if (/^v/.test(bank.pos)) return "verb";
    if (/^adj/.test(bank.pos)) return "adjective";
    if (/^adv/.test(bank.pos)) return "adverb";
    if (/^prep/.test(bank.pos)) return "preposition";
    if (/^pron/.test(bank.pos)) return "pronoun";
    if (/^conj/.test(bank.pos)) return "conjunction";
    if (/^int/.test(bank.pos)) return "interjection";
  }
  return "noun";
}

function getTheme(word) {
  for (const [theme, words] of Object.entries(THEMES)) {
    if (words.has(word)) return theme;
  }
  const bank = WORDBANK.find(item => item.en.toLowerCase() === word);
  if (bank && bank.theme) {
    const map = {
      animals: "animals_nature", body: "body_health", clothes: "clothes",
      family: "people_family", food: "food", health: "body_health",
      hobbies: "recreation_media", places: "places_transport", school: "school",
      time: "numbers_time", transport: "places_transport", weather: "seasons_weather",
    };
    return map[bank.theme] || "general";
  }
  return "general";
}

function articleFor(word) {
  return /^[aeiou]/i.test(word) ? "an" : "a";
}

function genericExamples(word, pos, theme) {
  if (pos === "number") {
    const singular = word === "one";
    return [
      `I have ${word} ${singular ? "pencil" : "pencils"}.`,
      `${cap(word)} ${singular ? "bird is" : "birds are"} in the tree.`,
    ];
  }
  if (pos === "verb") {
    return [`I ${word} every day.`, `We ${word} together.`];
  }
  if (pos === "adjective") {
    return [`The picture is ${word}.`, `It looks ${word} to me.`];
  }
  if (pos === "adverb") {
    return [`We are ${word} ready.`, `Please come ${word}.`];
  }
  if (pos === "title") {
    return [`${cap(word)} Lin is here.`, `I say hello to ${cap(word)} Chen.`];
  }
  if (theme === "animals_nature") {
    return [`I see ${articleFor(word)} ${word}.`, `The ${word} is near the tree.`];
  }
  if (theme === "food") {
    return [`I like ${word}.`, `${cap(word)} is on the table.`];
  }
  if (theme === "school") {
    return [`I use ${articleFor(word)} ${word} at school.`, `The ${word} is on my desk.`];
  }
  if (theme === "people_family") {
    return [`I see the ${word} today.`, `The ${word} is here with us.`];
  }
  if (theme === "body_health") {
    return [`This is my ${word}.`, `My ${word} feels fine.`];
  }
  if (theme === "places_transport") {
    return [`The ${word} is near my home.`, `We can see the ${word} from here.`];
  }
  if (theme === "home_objects") {
    return [`There is ${articleFor(word)} ${word} in the room.`, `The ${word} is clean.`];
  }
  if (theme === "clothes") {
    return [`I have ${articleFor(word)} ${word}.`, `The ${word} is clean.`];
  }
  return [`This is ${articleFor(word)} ${word}.`, `The ${word} is here.`];
}

function collectExistingExamples() {
  const map = new Map();
  function add(word, text, audio, source) {
    const key = word.toLowerCase().trim();
    if (!map.has(key)) map.set(key, []);
    const items = map.get(key);
    if (!items.some(item => item.text.toLowerCase() === text.toLowerCase())) {
      items.push({ text, audio, source });
    }
  }

  for (const item of WORDBANK) {
    (item.ex || []).forEach((text, index) => {
      const audio = `audio/words/ex/${wordAudioKey(item.en)}_${index}.mp3`;
      add(item.en, text, fs.existsSync(path.join(ROOT, audio)) ? audio : null, "wordbank");
    });
  }

  const lessonDir = path.join(ROOT, "lessons");
  for (const filename of fs.readdirSync(lessonDir).filter(name => /^lesson_.*\.html$/.test(name))) {
    const html = fs.readFileSync(path.join(lessonDir, filename), "utf8");
    const match = html.match(/const VOCAB = (\[[\s\S]*?\]);/);
    if (!match) continue;
    const vocab = eval(match[1]); // Trusted local lesson data.
    const date = filename.slice(7, -5);
    vocab.forEach((item, index) => {
      const audio = `lessons/audio/${date}/e${index}.mp3`;
      add(item.en, item.ex, fs.existsSync(path.join(ROOT, audio)) ? audio : null, `lesson-${date}`);
    });
  }

  for (const [weekId, drill] of Object.entries(WEEK_DRILLS)) {
    drill.listenBlank.forEach((item, index) => {
      const audio = `audio/weekdrill/${weekId}/lb${index}.mp3`;
      add(item.answer, item.full, fs.existsSync(path.join(ROOT, audio)) ? audio : null, `weekdrill-${weekId}`);
    });
  }
  return map;
}

function collocationFor(word, pos, theme) {
  if (COLLOCATIONS[word]) return COLLOCATIONS[word];
  if (pos === "verb") return `${word} + object/place`;
  if (pos === "adjective") return `be ${word}`;
  if (pos === "adverb") return word;
  if (pos === "number") return `${word} + plural noun`;
  if (["article", "be", "auxiliary", "pronoun", "determiner", "preposition", "conjunction"].includes(pos)) {
    return SPECIAL_EXAMPLES[word] ? SPECIAL_EXAMPLES[word][0] : word;
  }
  if (theme === "food") return word;
  return `${articleFor(word)} ${word}`;
}

function sentenceFrame(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const replaced = text.replace(new RegExp(`\\b${escaped}\\b`, "i"), "___");
  return replaced === text ? text : replaced;
}

function buildWords() {
  const existing = collectExistingExamples();
  const result = [];
  const generatedAudio = {};
  const missingWordAudio = {};

  for (let level = 1; level <= 4; level += 1) {
    const words = Object.keys(ALL_LEVELS).filter(word => ALL_LEVELS[word] === level).sort();
    if (words.length !== LEVEL_COUNTS[level]) {
      throw new Error(`L${level} expected ${LEVEL_COUNTS[level]} words, got ${words.length}`);
    }
    for (const word of words) {
      const bank = WORDBANK.find(item => item.en.toLowerCase() === word);
      const zh = (bank && bank.zh) || ZH[word];
      if (!zh) throw new Error(`Missing zh: ${word}`);
      const pos = getPos(word);
      const theme = getTheme(word);
      const id = `l${level}-${slug(word)}`;
      const candidates = [];
      const curated = SPECIAL_EXAMPLES[word] || [];
      for (const text of curated) {
        candidates.push({ text, audio: null, source: "foundation-generated" });
      }
      for (const item of existing.get(word) || []) {
        if (!candidates.some(candidate => candidate.text.toLowerCase() === item.text.toLowerCase())) {
          candidates.push({ ...item });
        }
      }
      for (const text of curated.length ? [] : genericExamples(word, pos, theme)) {
        if (!candidates.some(item => item.text.toLowerCase() === text.toLowerCase())) {
          candidates.push({ text, audio: null, source: "foundation-generated" });
        }
      }
      const chosen = candidates.slice(0, 2).map((item, index) => {
        const audioKey = `${id}-e${index + 1}`;
        let audio = item.audio;
        if (!audio) {
          audio = `audio/vocab_foundation/examples/${audioKey}.mp3`;
          generatedAudio[audioKey] = item.text;
        }
        return {
          id: `${id}-e${index + 1}`,
          text: item.text,
          zhHint: zh,
          purpose: index === 0 ? "recognition" : "application",
          audio,
          source: item.source,
        };
      });
      if (chosen.length !== 2) throw new Error(`Need two examples: ${word}`);

      const audioKey = wordAudioKey(word);
      const wordAudio = `audio/words/${audioKey}.mp3`;
      if (!fs.existsSync(path.join(ROOT, wordAudio))) missingWordAudio[audioKey] = word;

      result.push({
        id, word, aliases: [], zh, pos, level, bands: BANDS[level],
        difficulty: "Core", target: "active", theme,
        collocation: collocationFor(word, pos, theme),
        sentenceFrame: sentenceFrame(chosen[1].text, word),
        pronunciationAudio: wordAudio,
        examples: chosen,
        confusionRefs: [],
      });
    }
  }
  return { words: result, generatedAudio, missingWordAudio };
}

const UNIT_THEME_ORDER = [
  "language",
  "numbers_time",
  "people_family",
  "body_health",
  "animals_nature",
  "school",
  "food",
  "home_objects",
  "clothes",
  "places_transport",
  "actions",
  "descriptions",
  "seasons_weather",
  "recreation_media",
  "general",
];

function packLevel(words, level) {
  const unitCount = UNIT_COUNTS[level];
  const minimumSize = Math.floor(words.length / unitCount);
  const largerUnits = words.length % unitCount;
  const grouped = new Map();
  for (const word of words) {
    if (!grouped.has(word.theme)) grouped.set(word.theme, []);
    grouped.get(word.theme).push(word);
  }
  const orderedThemes = UNIT_THEME_ORDER
    .filter(theme => grouped.has(theme))
    .concat([...grouped.keys()].filter(theme => !UNIT_THEME_ORDER.includes(theme)).sort());
  const queue = orderedThemes.flatMap(theme =>
    grouped.get(theme).slice().sort((a, b) => a.word.localeCompare(b.word)));
  const bins = Array.from({ length: unitCount }, (_, index) => {
    const targetSize = minimumSize + (index < largerUnits ? 1 : 0);
    const selected = queue.splice(0, targetSize);
    const themeCounts = {};
    selected.forEach(word => {
      themeCounts[word.theme] = (themeCounts[word.theme] || 0) + 1;
    });
    return {
      id: `l${level}-u${String(index + 1).padStart(2, "0")}`,
      level,
      words: selected,
      themeCounts,
    };
  });
  if (queue.length || bins.some(bin => !bin.words.length || bin.words.length > 15)) {
    throw new Error(`Invalid L${level} unit packing`);
  }
  return bins;
}

// Hand-authored, level-controlled reading and dialogue content. Each unit has
// two complete scenes and one natural eight-turn conversation. Keep this data
// here so rebuilding the JSON never falls back to concatenated example cards.
const UNIT_CONTENT = {
  "l1-u01": {
    passages: [
      "It is seven. I am in the kitchen with Dad. He has an egg and a red cup. The cup is on the table. We are ready for breakfast. I do not want tea. I want milk. Is it hot or cold? Dad says it is cold. I eat the egg at home.",
      "I am at the park with my sister. She is on a red bike, and I am in a little car. It is a toy car, but it is big for me. We do not go fast. Are we near the tree or the bus? We are near the tree.",
    ],
    dialogue: [
      "Are you at the school door?",
      "Yes, I am here with Ben.",
      "Is he in your class?",
      "Yes. He has a book and an apple.",
      "Do you have a pen?",
      "No, I do not. It is at home.",
      "Do you want a red pen or a blue pen?",
      "A blue pen, please.",
    ],
  },
  "l1-u02": {
    passages: [
      "Today we have a class party. We put five red cups and four blue cups on the table. That is nine cups. What do we need now? We need cake, too. They bring the cake, and she brings water. Who has the plates? You do. Yes, we are ready.",
      "A girl and a boy are at the school store. She wants eight pencils, and he wants five pens. They see four red bags and nine blue bags. What bag do you like? The girl says, \"That red bag.\" The boy says, \"I like that bag, too.\"",
    ],
    dialogue: [
      "What is in that big box?",
      "It is a birthday cake.",
      "Who is the cake for?",
      "It is for Amy. She is nine today.",
      "Do we have eight cups?",
      "Yes, and we have four plates, too.",
      "Can you say, \"Happy birthday\" with us?",
      "Yes! We are ready.",
    ],
  },
  "l1-u03": {
    passages: [
      "Today is sports day. Six kids run, and three kids sit by the tree. One boy has a red ball. Two girls have a blue ball. Now the teacher says, \"Go!\" Seven kids run to the line. Ten hands go up. Every kid wants to play.",
      "A baby, a boy, and a girl are at home. The girl has one paper hat. The boy has two toy cars. Now they play king and queen. The baby is the king. He sits on a big chair. Today, the three kids have fun together.",
    ],
    dialogue: [
      "How many kids are on your team?",
      "We have ten kids now.",
      "Do you have six boys?",
      "No. We have three boys and seven girls.",
      "Who has the ball today?",
      "One girl has it.",
      "Can two new kids play with us?",
      "Yes. Every kid can play.",
    ],
  },
  "l1-u04": {
    passages: [
      "Tom is at the school health room. His arm and leg hurt. His neck is fine, but one eye is red. The nurse looks at his ear, too. Tom is hot and sad. He sees a fat cat by the door. The cat makes him smile.",
      "A man is at the school door. His name is Mr. Brown. Mrs. Green is with him. They need help, so Ms. Hill comes. She says, \"My name is Anna. Come with me.\" The man and Mrs. Green go to the school office. Now they are fine.",
    ],
    dialogue: [
      "What is wrong with your arm?",
      "It hurts when I move it.",
      "Does your leg hurt, too?",
      "No, my leg is fine.",
      "Is your neck hot?",
      "No, but my ear is hot.",
      "Can you see with this eye?",
      "Yes. I can see you.",
    ],
  },
  "l1-u05": {
    passages: [
      "Our dog is a good pet, but he likes to run. At the park, he sees a bird and runs to a tree. A cat is under the tree. The cat sees a pig on a card. Our dog sees it, too. He wants to play with them all.",
      "The sun is in the sky, and a bird sits in our tree. My cat looks up with her nose in the air. At night, the moon comes out. My little pet is sad because the bird is not there. I give her a lion toy, and she is happy.",
    ],
    dialogue: [
      "Is that your dog by the tree?",
      "Yes. He is my new pet.",
      "Why is your cat up there?",
      "She sees a bird in the sky.",
      "Is the bird near the sun?",
      "No, it is under the tree.",
      "Your dog looks sad now.",
      "He wants the cat to come down.",
    ],
  },
  "l1-u06": {
    passages: [
      "It is lunch time at home. Dad puts an egg and rice on my plate. Mom gives me a cup of water. My sister has milk, and Grandma has tea. A pie is on the table, too. We have good food. We sit down and eat lunch together.",
      "My room is ready for art time. A pen and a cup are on my desk. I draw a picture of a red ball by my bed. Then I draw milk, tea, and an egg. The picture is for Mom. I put it on her door.",
    ],
    dialogue: [
      "What do you want for lunch?",
      "I want an egg and some rice.",
      "Do you want milk or tea?",
      "Milk, please. Is it in the cup?",
      "Yes, and the water is here.",
      "Can we have the pie, too?",
      "Yes, but eat your food first.",
      "Okay. I am ready to eat.",
    ],
  },
  "l1-u07": {
    passages: [
      "I come home at four. My dog and I go to the park. I jog, and he can run. We love this game. Then I sit by the door and watch him. I miss Mom, but she comes home soon. We all go into the room together.",
      "A toy car is in my room. I sit on the bed and make it go. The car runs to the door. Now it is under a toy bus. Dad comes home and looks in. \"Come with me,\" he says. We go to the real car and ride to Grandma's home.",
    ],
    dialogue: [
      "Do you go home by bus?",
      "No, I go home in Dad's car.",
      "Can you come to the park first?",
      "Yes. I want to run with you.",
      "Do you jog every day?",
      "No, I sit and play with my toy.",
      "I miss our park games.",
      "Me too. Let us go now.",
    ],
  },
  "l1-u08": {
    passages: [
      "I see a new bike at the store. It is big, red, and very nice. Dad says the bike is good, but it is too tall for me. A small bike is here. It is not new, but it is great. I can ride it well, so we take it home.",
      "Today I walk to school with Mom. The new guard has a big job. He stands here by the red door and helps us. A boy has a bad fall, but he is okay. The guard is nice to him. \"No running,\" he says. We walk into school.",
    ],
    dialogue: [
      "Is that your new red bike?",
      "Yes. It is big and nice.",
      "Can you ride it here?",
      "No, this road is not good.",
      "Is the park okay?",
      "Yes. The park is great.",
      "Do you want to walk there now?",
      "Okay. My job is to take the bike.",
    ],
  },
  "l2-u01": {
    passages: [
      "It is my birthday, and our classroom is very busy. The clock is on the wall, and the party is at three. These red cups are on the table. Those blue plates are under the table. Please put them next to the real cake. My classmate writes \"Happy Birthday\" in English. Dad says its color is very nice.",
      "Our class has a special day about places. These students have flags, and those students have maps. One map is of the USA. Another card says ROC. Please put each card on the right desk, not under it. Our teacher checks the clock. We have one hour, and the room is very busy.",
    ],
    dialogue: [
      "Please put these cups on the table.",
      "Okay. What about those plates?",
      "Put them under the birthday sign.",
      "Is it a real cake in that box?",
      "Yes, and its color is pink.",
      "Wow! The party starts at three, right?",
      "Yes. Look at the clock.",
      "It is three now. Let us start!",
    ],
  },
  "l2-u02": {
    passages: [
      "Our school has a family music show. My sister is a singer, and my brother plays the drum. My father sits with my little son. A woman helps each student get ready. My classmate stands by our teacher. The air in the hall is cool. After the song, every family smiles and claps.",
      "A teacher takes her class outside for nature week. One student sees an ant on a flower. Another child finds a bee in the air. My classmate shows me his toe because an ant is near it. A woman helps him stand up. We laugh and talk about the small animals we see this year.",
    ],
    dialogue: [
      "Is that woman your teacher?",
      "Yes. She is our music teacher.",
      "Is the singer your sister?",
      "No, she is my classmate's sister.",
      "Where is your brother?",
      "He is next to my father and son.",
      "Can every student join the song?",
      "Yes. Our class sings together.",
    ],
  },
  "l2-u03": {
    passages: [
      "Our class visits a small zoo. A cow and a sheep eat near the tree. A hen walks by the flower, and a frog sits under it. We see a fox, a hippo, and many birds. At lunch, we eat fruit by the sea animal room. Then we draw our favorite animal in a book.",
      "Today our classroom becomes an animal art room. Each student takes a book from the box and sits on a chair. I draw a fox near a flower. My friend draws a frog by the sea. The teacher adds a cow, a hen, a hippo, and a sheep to one big zoo picture. We put it on the classroom wall.",
    ],
    dialogue: [
      "What animal is near the flower?",
      "It is a small frog.",
      "Can you see the fox, too?",
      "Yes. It is by the sheep.",
      "Where is the hippo?",
      "It is in the water.",
      "Do you want to draw this zoo?",
      "Yes. My book is in the classroom.",
    ],
  },
  "l2-u04": {
    passages: [
      "We stop at a convenience store after school. I want an apple and a ham sandwich. My sister wants candy, cake, and cola. Dad says we need real food, so we get rice and a salad, too. Mom does not drink coffee or Coke at night. She takes water. We eat together at the table.",
      "Our class makes a food book. I use a pencil and ruler to draw a long table. Amy uses glue for the apple and cake pictures. We read each page and write one food word. At lunch, we eat rice and ham at school. After lunch, we study the new words and put the book by the classroom door.",
    ],
    dialogue: [
      "Do you want cake or candy?",
      "I want cake and an apple.",
      "Can I have a Coke?",
      "No, please take water today.",
      "What does Dad want to eat?",
      "He wants ham and rice.",
      "Where can we sit?",
      "That table by the door is free.",
    ],
  },
  "l2-u05": {
    passages: [
      "At lunch, Mom gives me a bowl of rice and soup. I close my book and sit on the sofa. My sister makes a sandwich and puts on her cap. We see a ship from the window. I sing a song about the sea, and she plays with her doll. Then we wash our bowls and go to the store.",
      "A small store has a school play today. One child wears a short shirt and a red cap. Another child sits on a sofa with a doll. I give them a toy ship for the show. They sing, play, and see their teacher smile. After the show, we close the door and share soup and sandwiches.",
    ],
    dialogue: [
      "Please close your book. Lunch is ready.",
      "What do we have today?",
      "Rice, soup, and a sandwich.",
      "Can I eat on the sofa?",
      "No. Sit at the table.",
      "Can I play with my doll after lunch?",
      "Yes, and give me your bowl first.",
      "Okay. I want to sing, too.",
    ],
  },
  "l2-u06": {
    passages: [
      "Our classroom is dirty after art class, and everyone is busy. I wash the gray table while my friendly classmate picks up paper. The old box is brown, and the new box is green. We talk about where things go. A shy girl wants to help, so she stands by me. Soon the room looks very clean.",
      "Mia wants a cute shirt for the school show. She tries a pink one, but it is very short. The black shirt is old and dirty. A friendly worker shows her a green shirt with brown buttons. Mia is shy, so Mom talks for her. She stands by the mirror and wants the green one. They wash it at home.",
    ],
    dialogue: [
      "Why is your shirt dirty?",
      "I paint in art class today.",
      "Do you want the green shirt?",
      "No, the green one is too short.",
      "How about this cute pink one?",
      "I am shy about pink.",
      "The gray one looks friendly and clean.",
      "Okay. I want to try it.",
    ],
  },
  "l2-u07": {
    passages: [
      "We have a picnic by the school. I say hello to a shy girl in a white cap. She says hi, but she talks very slowly. We show her our small yellow ball and green cups. \"Wow, I like the colors,\" she says. We thank her and ask her to sing a song. Soon we are all friends.",
      "A small boy comes to the music room. \"Hey, what is your favorite color?\" I ask. He says yellow, but his guitar is white. \"Oh, it is very nice!\" I say. He is shy and plays a slow song. At the end, everyone says, \"Wow!\" The boy smiles and says, \"Thank you.\"",
    ],
    dialogue: [
      "Hi! Can I sit here for the picnic?",
      "Yes, but this mat is very small.",
      "Oh, I can sit by the yellow bag.",
      "Hey, that is my white cap!",
      "Wow, it looks nice on you.",
      "Thank you. I am a little shy.",
      "Do you want to sing our song?",
      "Yes, but please sing slowly.",
    ],
  },
  "l3-u01": {
    passages: [
      "At eleven a.m., our English teacher gives us a new word. We read it together and ask what it is about. Ben knows where it is in the book, but he does not know why it is there. After an hour, we can say the word and write it. Every child feels great because what we say is true. We will study together every afternoon.",
      "Two hours ago, Amy called me after school. She wanted help with three English words, so she walked to my home. We read the words with my sister in the afternoon. When the sun was down, Amy asked where she could put her book. I put her book in a bag. In the evening, she walked home and said, \"I know every word now.\" I said, \"Great!\" because it was true.",
    ],
    dialogue: [
      "When can we study our English words together?",
      "How about eleven a.m. after breakfast?",
      "I have school then. Is the afternoon OK?",
      "Yes. Where do you want to study?",
      "At my house, with my sister.",
      "Great. We can study for one hour.",
      "Why do you need these word cards?",
      "Because I read them every evening.",
    ],
  },
  "l3-u02": {
    passages: [
      "Yesterday morning, my aunt and uncle came to our house at eight o'clock. Dad made breakfast, and every child helped. My brother gave the children milk, and I put food on the table. My uncle is a worker, so he had to go at eleven a.m. Before he went, Daddy took a family picture. We said good-bye and asked him to come again in one week.",
      "Our school family day started at two p.m. yesterday. My friend Ben came with his dad, aunt, and two children. His daddy helped the teacher, and my family made drinks. At three o'clock, the children started to run. Ben was slow, but his friend helped him. They tried to run together. Every child said their run was great, even with zero prizes.",
    ],
    dialogue: [
      "When does our family breakfast start tomorrow?",
      "It starts at eight o'clock in the morning.",
      "Will Aunt Anna and Uncle Ben come?",
      "Yes, they will come with their children.",
      "Can I invite my friend Sam too?",
      "Yes, his dad can come after work.",
      "Great, I will call him before two p.m.",
      "Please help Daddy put the food on the table.",
    ],
  },
  "l3-u03": {
    passages: [
      "The weather was hot when our teacher took us to the zoo. I saw a big elephant take food with its nose. A child asked why the animal had no hair on its body. A duck put its head down and sat under a tree. I put my hand in my bag and found an apple. I was hungry, so I ate it with my lunch.",
      "Ben and I went to the sea with a kite. The weather was fine, so Ben started to run. The kite went up, but it came down into a tree. Ben was sad and put his head on my arm. I asked him to help me. He took my hand, and we got it down together. The kite was fine. A star was in the evening sky when we walked home.",
    ],
    dialogue: [
      "Why is that duck under the tree?",
      "It may feel hot in this weather.",
      "Can we give the animal some water?",
      "Yes, put the cup by its head.",
      "My hand is dirty from the chalk.",
      "Your bag has water. Please wash it.",
      "After that, can we fly my kite?",
      "Yes, we can fly it this evening.",
    ],
  },
  "l3-u04": {
    passages: [
      "Before school, Mia ate a banana and drank milk for breakfast. In the classroom, the teacher asked the children to write about their food. Mia had a computer, but she could not spell banana. She asked a friend and then wrote the word. Her eraser fell under the desk. She found it with an old cookie under the desk. The teacher said, \"Please do not eat cookies in the classroom.\"",
      "Dad and I made beef and rice for dinner. My sister made cold drinks with juice and ice. She gave me a cookie, but I wanted it after dinner. While Dad made the food, I used the computer to learn a new English word. I wrote it on a card and asked my sister to spell it. She spelled it well, so I gave her two cookies after we ate.",
    ],
    dialogue: [
      "What did you eat for breakfast today?",
      "I ate a banana and two cookies.",
      "Did you make the cookies at school?",
      "Yes, we read about them on a computer.",
      "Did you write how to make them?",
      "Yes, but I could not spell banana.",
      "Did your teacher give you an eraser?",
      "Yes, then each child ate one cookie.",
    ],
  },
  "l3-u05": {
    passages: [
      "It was hot after school, so Amy came to my house. We went into the kitchen and made ice cream with milk and ice. I put in too much salt, but Amy said it was still good. We took the ice cream and juice to the dining room. Dad came home with hot dogs for dinner. We ate together and gave him a big cup of ice cream.",
      "Mia wanted to wear her new dress to a family dinner. The weather was cold, so her aunt gave her a coat and a red hat. Before they left the house, the telephone rang in the dining room. Her uncle was on the phone. He asked Mia to call him on her phone when they got there. Mia said yes, put on her coat, and walked out with her aunt.",
    ],
    dialogue: [
      "Why are you wearing that coat and hat?",
      "We are eating dinner at my aunt's house.",
      "Are you wearing your new red dress?",
      "Yes, but the weather is very cold.",
      "Should I bring some juice?",
      "Bring juice, because we have hot dogs.",
      "Good, I will call her on my phone.",
      "Great, please come before dinner starts.",
    ],
  },
  "l3-u06": {
    passages: [
      "My friend Sam came from America for a family trip. Dad did not drive because we wanted to take a train to the sea. On the train, Sam saw a bird fly in the sky. When we got there, we saw a big truck at a store. Dad called his friend, and the man gave us two bicycles. We had a great afternoon on the bikes.",
      "Emma wanted to try her new bicycle after school. Dad helped her get on the bike, and she started to go. A truck came by, so Dad asked her to wait. When it was gone, Emma tried again. She went too fast, and her bike went into a tree. She did not cry because her arm and leg were fine. Dad called home and said, \"Emma can go now!\"",
    ],
    dialogue: [
      "Are we taking the train for our trip?",
      "Yes, Dad does not want to drive.",
      "Can we take our bikes with us?",
      "No, but Uncle Sam has two bicycles.",
      "Should I call him and ask now?",
      "Yes, he came back from America yesterday.",
      "Look, a red kite can fly very high.",
      "Great, we can take it on our trip.",
    ],
  },
  "l3-u07": {
    passages: [
      "In autumn, our school asked families to join a dance. I invited my friend Lily because she wanted to try it. We needed two hats, so we made them with old cards. Lily helped me, and we waited for the glue to dry. At school, the teacher asked us to dance together. We tried three times. After the dance, I took the hats home.",
      "Dad came home from work and said he needed help. Our dog was dirty after a walk, so we had to wash and dry it. I took water, and Dad made a warm bed. The dog tried to run, but Dad asked it to wait. When its hair was dry, I kissed its head. The dog went to sleep, and Dad said we did great work.",
    ],
    dialogue: [
      "Do you want to join our ball game?",
      "Yes, but I need help kicking the ball.",
      "Try again, and kick the ball slowly.",
      "Okay, please wait while I take my coat.",
      "Your coat is still wet from the rain.",
      "I will put it here to dry.",
      "Good. We can make two teams together.",
      "Great, I will invite Lily after school.",
    ],
  },
  "l3-u08": {
    passages: [
      "At school, we made a store with toys and books. I had ten dollars in play money. I looked down and saw a car under the table. \"Oops, is there any money with it?\" I asked. Ben said, \"Uh-uh, but the car is one dollar.\" I really wanted it, so I gave him one dollar. Then we put everything up and said good-bye.",
      "Emma and I were singing together in her room. Her baby brother was sleeping, so we had to sing slowly. Then Emma stood up, but I looked down at the words. \"Oh-oh, I do not know this word,\" I said. Emma said it with me, and I could sing again. Her brother opened his eyes. \"Oops!\" we said, and we gave him a toy.",
    ],
    dialogue: [
      "Do you have any money with you?",
      "Uh-uh, I only have one dollar.",
      "Really? Your bag is down there.",
      "Oops, my money is in that bag.",
      "Good, but our bus is here now.",
      "Let us take the bag together.",
      "Okay, I have it. Good-bye, Amy.",
      "Goodbye, Ben. See you at school.",
    ],
  },
  "l4-u01": {
    passages: [
      "Our class made a paper for sports day. I wrote the date on it, but I wrote it wrong. The paper said the game was on the eighteenth. Amy said the date was the fifteenth. She does not like to speak to a big class, so I told the teacher for her. We made a new paper and put it on the wall. Some students came to read it. Now everyone knows which day is right.",
      "My father asked me to speak to my uncle on the phone. My uncle lives far from us. He said he will come on the eighteenth and stay for some days. I asked which train he takes. He said the one at eight. I wrote this on paper so I will not get the date wrong. My mother was happy. She says my uncle is very funny.",
    ],
    dialogue: [
      "Does this paper show the right date?",
      "No, I think the date is wrong.",
      "Which day is the sports day?",
      "It is on the eighteenth, not the fifteenth.",
      "Can you speak to the teacher about this?",
      "Yes, she is in the school office now.",
      "Good, because some students want to know.",
      "I will tell them from my seat.",
    ],
  },
  "l4-u02": {
    passages: [
      "My grandmother is seventy this year. My mother is forty and my father is fifty. I am thirteen. We made a big card with all the numbers on it. My little sister put fourteen flowers on the front. I asked my grandmother if she was happy. She said she never counts her years. She only counts her friends. That was a good answer, and I still think about it now.",
      "Our teacher asked us to count to ninety. Ben stopped at sixteen because he could not think. I helped him from seventeen to thirty. Then he went on to sixty by himself. After that he did nineteen and forty with no help. The teacher said he did well and gave him a book. Ben was very happy. He said he will never stop at sixteen again.",
    ],
    dialogue: [
      "How old is your grandmother now?",
      "She is seventy this year.",
      "Can you count to ninety in English?",
      "Yes, but I still stop at sixteen sometimes.",
      "I never stop there. I stop at thirty.",
      "Then we can help each other.",
      "Good. Can you come to my house soon?",
      "Yes, I will come on the weekend.",
    ],
  },
  "l4-u03": {
    passages: [
      "My grandpa is a writer. He writes at home every morning. My grandma helps him read his work. On the weekend my parents take me to see them. My grandma made a cake for me because I am twelve now. My grandpa gave me a book about a butterfly. I read it that night in my room. After that I was very thirsty and drank some water.",
      "We went to the zoo with my grandmother on the weekend. We saw a big panda eat its lunch. A man said good morning to my grandfather and called him sir. My grandfather was happy all day. Twenty children came with their parents too. It was hot and we were thirsty, so we sat under a tree. Tomorrow I will draw the panda for my grandma.",
    ],
    dialogue: [
      "What does your grandpa do?",
      "He is a writer. He writes every morning.",
      "Will you see your grandparents this weekend?",
      "Yes, my parents will take me tomorrow.",
      "How old are you now?",
      "I am twelve. My grandma made me a cake.",
      "That is nice. Are you thirsty now?",
      "Yes, can I have some water?",
    ],
  },
  "l4-u04": {
    passages: [
      "We had art class after reading class today. I took out my pencil box and found my crayon was gone. Ben let me use his paint. I made a drawing of a snake on my paper. The wind came in the window and moved my page. My drawing fell down, but it was not wet. The teacher put it on the wall for everyone to see.",
      "My homework was to write every letter of the alphabet. I did the first page at school and the second page at home. My pencil case was in my bag, so I used a pen. After that we went to the bookstore. My mother bought me a new pencil box and some bread. I ate the bread on the bus and read my new book.",
    ],
    dialogue: [
      "Did you do your homework for reading class?",
      "Yes, I did two pages this morning.",
      "Can I use your crayon for my drawing?",
      "Sure, it is in my pencil box.",
      "I want to paint a snake on this page.",
      "Close the window first, because of the wind.",
      "Good idea. Do you want some bread?",
      "Yes, thank you. I am very hungry.",
    ],
  },
  "l4-u05": {
    passages: [
      "My mother made dinner for us today. She put a big dish of salad on the table. My father made pork and a small steak. I do not like vegetable soup, so I said it was yucky. My mother said the salad was yummy and I should try it. I did try it, and it was good. After dinner we had a sweet snack with a little sugar.",
      "We went to the bank with my father on Saturday. A man there gave me a red balloon. After that we went home and I called my friend on my cellphone. I asked her to come to my house for a snack. We ate bread and one small dish of fruit. It was sweet and yummy. Then we went out to feed the birds near my window.",
    ],
    dialogue: [
      "What is in that big dish on the table?",
      "It is salad. My mother made it.",
      "Is there any pork or steak today?",
      "Yes, but eat some vegetable first.",
      "The soup is yucky, but the salad is yummy.",
      "Then take more salad and less soup.",
      "Can we have a sweet snack after dinner?",
      "Yes, but only a little sugar.",
    ],
  },
  "l4-u06": {
    passages: [
      "My father works in an office in the city. On Saturday we took the bus to see him. We got off at the bus stop near his office. The light in his room was on and the window was open. He put some tape on a box for me and gave me a pen. After that we went to a restaurant on the road near the station.",
      "Our television is on the wall in the living room. My little brother watches TV after school every day. Today the TV was off because my mother wanted a quiet house. My brother put his socks on and we went out. We walked down the road to the station and back. He said the city is very big at night. My sister wore her new skirt.",
    ],
    dialogue: [
      "Where does your father work?",
      "He works in an office in the city.",
      "How do we get there from here?",
      "We take the bus at the bus stop.",
      "Is there a restaurant near the station?",
      "Yes, there is a good one on that road.",
      "Then let us eat there after we see him.",
      "Good. Put on your socks and we can go.",
    ],
  },
  "l4-u07": {
    passages: [
      "We went to the beach and I did not want to swim at first. The water was cold, so I stayed on the sand. My sister said the water was better after some minutes. I did use her hat because the sun was hot. Then we did dig a big hole in the sand. My father said we should stop before lunch. It was the best day.",
      "My mother sent me to buy some bread on the street near our house. She gave me money to pay for it. I did not worry because I go there often. On the way I saw my friend and we did stop to talk. I told her we will visit my aunt tomorrow. She said her cat did fall from a chair but was fine.",
    ],
    dialogue: [
      "Do you want to swim with us today?",
      "The water is cold, so I will stay here.",
      "It is better after some minutes.",
      "Then I will use your hat and come in.",
      "Can you buy some bread on that street?",
      "Yes, my mother gave me money to pay.",
      "Do not worry, the shop is very near.",
      "I know. I will not stop on the way.",
    ],
  },
  "l4-u08": {
    passages: [
      "The weather was warm and sunny on Sunday. We went to the park and it was very cool under the trees. My friend Amy has long hair and she wore a pretty blue dress. She is smart and very funny too. We saw a strong man carry two big boxes to a car. I was sure he was tired after that. It was a wonderful day.",
      "My little brother and I have the same shoes. His are small and mine are long. He fell in the water and his socks were wet. He was not sad because the day was warm. He is young, but he is strong. My mother said he is a funny child. We told her it was a wonderful day, and she said she was sure of that.",
    ],
    dialogue: [
      "The weather is warm and sunny today.",
      "Yes, but it is cool under these trees.",
      "Your new dress is very pretty.",
      "Thank you. My sister has the same one.",
      "Is she the tall one with long hair?",
      "Yes, and she is very smart and funny.",
      "Are you sure she is only twelve?",
      "I am sure. She is young but strong.",
    ],
  },
  "l4-u09": {
    passages: [
      "Summer vacation is my favorite season. In summer we swim every day and eat ice after lunch. In winter there is snow on the hills near my home. In spring we see flowers on the way to school. My father reads the newspaper for the news about the weather. He said tomorrow will be a good day for sport, so we will play soccer in the park.",
      "We went to see a movie on Saturday with my cousin. Before the movie we played soccer in the park. My cousin is very good at that sport. After the movie we went home and my mother put on a CD. My sister likes dancing to it. The news said there will be snow this winter. We want to see the snow in our vacation.",
    ],
    dialogue: [
      "What do you do in the summer vacation?",
      "We swim every day and play soccer.",
      "Is soccer your favorite sport?",
      "Yes, but I like dancing too.",
      "Did you see the news about the winter?",
      "Yes, my father read it in the newspaper.",
      "It said there will be snow this season.",
      "Then let us go to the hills in winter.",
    ],
  },
  "l4-u10": {
    passages: [
      "We had a party for Chinese New Year at my grandma's house. My little kitten sat next to me all night. My mother put red paper in front of the door. Even my father made a dish for us. The food had a very good smell. We ate a big part of it and left a little on the table. Out on the road I could hear children play.",
      "Our school has a sports day every spring. This year I did not know my shoe size, so my mother took me out to buy new ones. On the day I ran in two sports and did swimming after. My kitty came to the door when I got home. She made a small sound and sat next to my bag. Even my sister said I did well.",
    ],
    dialogue: [
      "What do you do for Chinese New Year?",
      "We go to my grandma's house for a party.",
      "Is your kitten there too?",
      "Yes, my kitty sits next to me all night.",
      "That red paper in front of the door is pretty.",
      "My mother put it there this morning.",
      "Do you have sports day this spring?",
      "Yes, and I will do swimming this year.",
    ],
  },
};

function dominantTheme(bin) {
  return Object.entries(bin.themeCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
}

function countThemes(words) {
  const counts = {};
  words.forEach(word => {
    counts[word.theme] = (counts[word.theme] || 0) + 1;
  });
  return counts;
}

function buildUnits(words) {
  const units = [];
  const passageAudio = {};
  const dialogueA = {};
  const dialogueB = {};

  for (let level = 1; level <= 4; level += 1) {
    const bins = packLevel(words.filter(word => word.level === level), level);
    for (const bin of bins) {
      const theme = dominantTheme(bin);
      const rankedThemes = Object.entries(bin.themeCounts)
        .sort((a, b) => b[1] - a[1] || UNIT_THEME_ORDER.indexOf(a[0]) - UNIT_THEME_ORDER.indexOf(b[0]));
      const titleThemes = rankedThemes
        .filter(([, count], index) => index === 0 || count >= 3)
        .slice(0, 2)
        .map(([name]) => name);
      const titleZh = titleThemes.map(name => (THEME_LABELS[name] || THEME_LABELS.general)[0]).join(" × ");
      const titleEn = titleThemes.map(name => (THEME_LABELS[name] || THEME_LABELS.general)[1]).join(" & ");
      const themeRank = new Map(rankedThemes.map(([name], index) => [name, index]));
      const ordered = bin.words.slice().sort((a, b) =>
        themeRank.get(a.theme) - themeRank.get(b.theme) || a.word.localeCompare(b.word));
      // 短文與對話一律取自手寫的 UNIT_CONTENT。
      // 舊版是把每個目標字的例句串起來當短文、再用 "Can you use X in a sentence?"
      // 當對話，兩者都不是真實語料，小孩看不到這些字什麼時候會用到。
      // 這裡刻意直接丟錯而不是退回舊模板 —— 少寫一個單元要立刻被發現，
      // 不能靜靜地產出一份看起來正常、其實是例句串接的內容。
      const authored = UNIT_CONTENT[bin.id];
      if (!authored) throw new Error(`UNIT_CONTENT 缺少 ${bin.id}，請先補寫短文與對話再重跑`);
      if (!Array.isArray(authored.passages) || authored.passages.length !== 2) {
        throw new Error(`${bin.id} 需要正好 2 篇短文`);
      }
      if (!Array.isArray(authored.dialogue) || authored.dialogue.length !== 8) {
        throw new Error(`${bin.id} 需要正好 8 回合對話`);
      }

      const splitAt = Math.ceil(ordered.length / 2);
      const passages = [0, 1].map(index => {
        const selected = index === 0 ? ordered.slice(0, splitAt) : ordered.slice(splitAt);
        const passageThemeCounts = countThemes(selected);
        const passageTheme = Object.entries(passageThemeCounts)
          .sort((a, b) => b[1] - a[1] || UNIT_THEME_ORDER.indexOf(a[0]) - UNIT_THEME_ORDER.indexOf(b[0]))[0][0];
        const [, passageTitleEn] = THEME_LABELS[passageTheme] || THEME_LABELS.general;
        const id = `${bin.id}-p${index + 1}`;
        const text = authored.passages[index];
        passageAudio[id] = text;
        return {
          id,
          title: index === 0 ? `${passageTitleEn}: First Reading` : `${passageTitleEn}: Second Reading`,
          type: "guided-reading",
          theme: passageTheme,
          text,
          focusWords: selected.map(word => word.word),
          audio: `audio/vocab_foundation/passages/${id}.mp3`,
        };
      });
      // 8 回合，A/B 交替；A 用 af_heart、B 用 am_adam（兩份 spec 分開送 Kokoro）
      const dialogue = authored.dialogue.map((text, index) => {
        const id = `${bin.id}-d${index + 1}`;
        const speaker = index % 2 === 0 ? "A" : "B";
        (speaker === "A" ? dialogueA : dialogueB)[id] = text;
        return { id, speaker, text, audio: `audio/vocab_foundation/dialogue_lines/${id}.mp3` };
      });
      units.push({
        id: bin.id, level, bands: BANDS[level], theme,
        sequence: units.filter(unit => unit.level === level).length + 1,
        unitThemes: rankedThemes.map(([name, count]) => ({ name, count })),
        titleZh,
        titleEn,
        targetWords: ordered.map(word => word.word),
        passages,
        dialogue: {
          turns: dialogue,
          fullAudio: `audio/vocab_foundation/dialogues/${bin.id}-dialogue.mp3`,
        },
      });
    }
  }
  return { units, passageAudio, dialogueA, dialogueB };
}

function attachConfusions(words) {
  const byWord = new Map(words.map(word => [word.word, word]));
  for (const item of CONFUSIONS) {
    for (const member of item.members) {
      if (!byWord.has(member)) throw new Error(`Confusion member outside L1-L4: ${member}`);
      byWord.get(member).confusionRefs.push(item.id);
    }
    item.examples.forEach(example => {
      example.audio = `audio/vocab_foundation/confusions/${example.id}.mp3`;
    });
    item.dialogue.forEach(line => {
      line.audio = `audio/vocab_foundation/confusion_dialogue_lines/${line.id}.mp3`;
    });
    item.fullAudio = `audio/vocab_foundation/confusion_dialogues/${item.id}.mp3`;
  }
}

function writeJson(filename, data) {
  fs.writeFileSync(filename, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function taipeiDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function writeSpecs(wordBuild, unitBuild) {
  const confusionExamples = {};
  const confusionA = {};
  const confusionB = {};
  for (const item of CONFUSIONS) {
    item.examples.forEach(example => { confusionExamples[example.id] = example.text; });
    item.dialogue.forEach(line => {
      (line.speaker === "A" ? confusionA : confusionB)[line.id] = line.text;
    });
  }
  const specs = [
    ["foundation_missing_words.json", {
      outdir: path.join(ROOT, "audio", "words"), voice: "af_heart", speed: 0.84,
      items: wordBuild.missingWordAudio,
    }],
    ["foundation_examples.json", {
      outdir: path.join(AUDIO_ROOT, "examples"), voice: "af_heart", speed: 0.86,
      items: wordBuild.generatedAudio,
    }],
    ["foundation_passages.json", {
      outdir: path.join(AUDIO_ROOT, "passages"), voice: "af_heart", speed: 0.86,
      items: unitBuild.passageAudio,
    }],
    ["foundation_dialogue_a.json", {
      outdir: path.join(AUDIO_ROOT, "dialogue_lines"), voice: "af_heart", speed: 0.88,
      items: unitBuild.dialogueA,
    }],
    ["foundation_dialogue_b.json", {
      outdir: path.join(AUDIO_ROOT, "dialogue_lines"), voice: "am_adam", speed: 0.88,
      items: unitBuild.dialogueB,
    }],
    ["foundation_confusion_examples.json", {
      outdir: path.join(AUDIO_ROOT, "confusions"), voice: "af_heart", speed: 0.86,
      items: confusionExamples,
    }],
    ["foundation_confusion_dialogue_a.json", {
      outdir: path.join(AUDIO_ROOT, "confusion_dialogue_lines"), voice: "af_heart", speed: 0.88,
      items: confusionA,
    }],
    ["foundation_confusion_dialogue_b.json", {
      outdir: path.join(AUDIO_ROOT, "confusion_dialogue_lines"), voice: "am_adam", speed: 0.88,
      items: confusionB,
    }],
  ];
  fs.mkdirSync(SPEC_DIR, { recursive: true });
  specs.forEach(([filename, spec]) => writeJson(path.join(SPEC_DIR, filename), spec));
  return Object.fromEntries(specs.map(([filename, spec]) => [filename, Object.keys(spec.items).length]));
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const wordBuild = buildWords();
  attachConfusions(wordBuild.words);
  const unitBuild = buildUnits(wordBuild.words);

  for (let level = 1; level <= 4; level += 1) {
    writeJson(path.join(OUT_DIR, `words_l${level}.json`), {
      schemaVersion: "1.0.0", level, bands: BANDS[level],
      words: wordBuild.words.filter(word => word.level === level),
    });
    writeJson(path.join(OUT_DIR, `units_l${level}.json`), {
      schemaVersion: "1.0.0", level, bands: BANDS[level],
      units: unitBuild.units.filter(unit => unit.level === level),
    });
  }
  writeJson(path.join(OUT_DIR, "confusions_l1_l4.json"), {
    schemaVersion: "1.0.0", confusions: CONFUSIONS,
  });
  const audioSpecs = writeSpecs(wordBuild, unitBuild);
  const manifest = {
    schemaVersion: "1.0.0",
    generatedOn: taipeiDate(),
    scope: "F0-F3 / L1-L4",
    policy: {
      wordsPerUnitMaximum: 15,
      examplesPerWord: 2,
      passagesPerUnit: 2,
      dialogueTurnsPerUnit: 8,
      browserSpeechFallback: false,
      dialogueVoices: { A: "af_heart", B: "am_adam" },
    },
    counts: {
      words: wordBuild.words.length,
      byLevel: Object.fromEntries([1, 2, 3, 4].map(level => [
        `L${level}`, wordBuild.words.filter(word => word.level === level).length,
      ])),
      examples: wordBuild.words.reduce((sum, word) => sum + word.examples.length, 0),
      generatedExampleAudio: Object.keys(wordBuild.generatedAudio).length,
      reusedExampleAudio: wordBuild.words.reduce((sum, word) =>
        sum + word.examples.filter(example => example.source !== "foundation-generated").length, 0),
      missingWordAudio: Object.keys(wordBuild.missingWordAudio).length,
      units: unitBuild.units.length,
      passages: unitBuild.units.reduce((sum, unit) => sum + unit.passages.length, 0),
      dialogues: unitBuild.units.length,
      dialogueTurns: unitBuild.units.reduce((sum, unit) => sum + unit.dialogue.turns.length, 0),
      confusionSets: CONFUSIONS.length,
      confusionExamples: CONFUSIONS.reduce((sum, item) => sum + item.examples.length, 0),
      confusionDialogueTurns: CONFUSIONS.reduce((sum, item) => sum + item.dialogue.length, 0),
    },
    audioSpecs,
    files: {
      words: [1, 2, 3, 4].map(level => `words_l${level}.json`),
      units: [1, 2, 3, 4].map(level => `units_l${level}.json`),
      confusions: "confusions_l1_l4.json",
    },
  };
  writeJson(path.join(OUT_DIR, "manifest.json"), manifest);
  console.log(JSON.stringify(manifest, null, 2));
}

if (require.main === module) main();

module.exports = {
  ZH, POS, THEMES, SPECIAL_EXAMPLES, CONFUSIONS,
  buildWords, buildUnits, attachConfusions,
};
