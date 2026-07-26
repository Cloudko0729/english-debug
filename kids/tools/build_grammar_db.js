// Build the F0-F7 grammar database.
// Generated JSON/SVG files are deterministic. Edit this source, then rebuild.

"use strict";

const fs = require("fs");
const path = require("path");
const { DIAGRAMS } = require("./grammar_diagram_specs.js");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "grammar_db");
const BAND_DIR = path.join(OUT_DIR, "bands");
const DIAGRAM_DIR = path.join(OUT_DIR, "diagrams");
const SPEC_DIR = path.join(__dirname, "grammar_audio_specs");
const AUDIO_ROOT = path.join(ROOT, "audio", "grammar_db");

function contrast(wrong, better, reasonZh, status = "misleading") {
  return { wrong, better, reasonZh, status };
}

function bug(zh, wrong, better, reasonZh, severity = "E1") {
  return { zh, wrong, better, reasonZh, severity };
}

function variant(forms, noteZh, dialect = "general") {
  return { forms, noteZh, dialect };
}

function node(config) {
  const band = config.id.match(/^F\d/)[0];
  return {
    band,
    microLevel: Number(config.id.match(/^F\d\.(\d+)/)?.[1] || 0),
    prerequisites: [],
    variants: [],
    notesZh: [],
    ...config,
  };
}

const NODES = [
  node({
    id: "F0.1-complete-sentence",
    titleZh: "完整句與片語",
    titleEn: "Complete Sentences and Fragments",
    goalZh: "分辨單字、片語和完整句，建立主詞加述語的最小骨架。",
    form: "subject + predicate",
    diagramRef: "sentence-slots",
    examples: [
      "My dog runs.",
      "The soup is hot.",
      "We play after school.",
      "Please sit down.",
    ],
    contrasts: [
      contrast("My dog very cute.", "My dog is very cute.", "形容詞 cute 前需要 be 動詞，才能形成完整述語。"),
      contrast("In the classroom.", "The students are in the classroom.", "單獨的地點片語沒有說明誰在那裡；正式寫作需要補完整。", "awkward"),
    ],
    bugs: [
      bug("天氣很冷。", "Is very cold.", "It is very cold.", "英文天氣句需要形式主詞 it。", "E0"),
      bug("我的妹妹很開心。", "My sister very happy.", "My sister is very happy.", "happy 是形容詞，需要 is 連接主詞。"),
    ],
    dialogue: [
      "Is this a complete sentence?",
      "Yes. The sentence has a subject and a predicate.",
      "What about \"under the table\"?",
      "That is a phrase, but it can be a natural short answer.",
    ],
    prompts: [
      "Say one complete sentence about your family.",
      "Write one complete sentence about your classroom.",
    ],
    variants: [
      variant(["In the classroom.", "They are in the classroom."], "簡短回答可用片語；獨立正式句通常補出主詞與動詞。"),
    ],
  }),
  node({
    id: "F0.2-be-agreement",
    titleZh: "主詞與 am / is / are",
    titleEn: "Subject Agreement with Be",
    goalZh: "依主詞選擇 am、is 或 are。",
    form: "I am; he/she/it is; you/we/they are",
    diagramRef: "predicate-routes",
    prerequisites: ["F0.1-complete-sentence"],
    examples: [
      "I am ready.",
      "She is my sister.",
      "They are at school.",
      "You are very kind.",
    ],
    contrasts: [
      contrast("I is ready.", "I am ready.", "主詞 I 固定搭配 am。"),
      contrast("They is at school.", "They are at school.", "複數主詞 they 搭配 are。"),
    ],
    bugs: [
      bug("我是學生。", "I is a student.", "I am a student.", "不要把中文「是」一律翻成 is。"),
      bug("那些書很新。", "Those books is new.", "Those books are new.", "複數主詞要用 are。"),
    ],
    dialogue: [
      "Are you ready for class?",
      "Yes, I am ready.",
      "Is Ben ready, too?",
      "Yes, he is ready.",
    ],
    prompts: [
      "Say one sentence with \"I am\".",
      "Write one sentence with a plural subject and \"are\".",
    ],
  }),
  node({
    id: "F0.3-be-meaning",
    titleZh: "be 表身分、狀態與位置",
    titleEn: "Be for Identity, State, and Location",
    goalZh: "使用 be 連接主詞與身分、狀態或位置。",
    form: "subject + be + noun/adjective/place",
    diagramRef: "predicate-routes",
    prerequisites: ["F0.2-be-agreement"],
    examples: [
      "Ben is a student.",
      "The soup is hot.",
      "My bag is on the chair.",
      "The children are happy.",
    ],
    contrasts: [
      contrast("Ben a student.", "Ben is a student.", "身分名詞前需要 be 形成述語。"),
      contrast("My bag under the chair.", "My bag is under the chair.", "位置片語前需要 be。"),
    ],
    bugs: [
      bug("她很累。", "She very tired.", "She is very tired.", "tired 是狀態形容詞，要用 is 連接。"),
      bug("我們在家。", "We at home.", "We are at home.", "英文位置句不能只把主詞和地點放在一起。"),
    ],
    dialogue: [
      "Who is Ben?",
      "He is a new student.",
      "Where is his bag?",
      "It is under the desk.",
    ],
    prompts: [
      "Say where your school bag is.",
      "Write one sentence about how you feel today.",
    ],
  }),
  node({
    id: "F0.4-singular-plural",
    titleZh: "一個與多個名詞",
    titleEn: "Singular and Plural Nouns",
    goalZh: "用單複數形式清楚表達數量。",
    form: "one + singular noun; two or more + plural noun",
    diagramRef: "noun-decision",
    prerequisites: ["F0.1-complete-sentence"],
    examples: [
      "I have one book.",
      "She has two books.",
      "There are three boxes.",
      "The children are outside.",
    ],
    contrasts: [
      contrast("I have two book.", "I have two books.", "數量大於一時，可數名詞通常用複數。"),
      contrast("Three child are playing.", "Three children are playing.", "child 的複數是不規則形式 children。"),
    ],
    bugs: [
      bug("五支鉛筆", "five pencil", "five pencils", "數字 five 後面要接複數可數名詞。"),
      bug("兩個盒子", "two boxs", "two boxes", "box 以 x 結尾，複數加 -es。"),
    ],
    dialogue: [
      "How many books do you have?",
      "I have three books.",
      "How many boxes are on the table?",
      "There is one box on the table.",
    ],
    prompts: [
      "Say one sentence with a number and a plural noun.",
      "Write the plural forms of \"box\" and \"child\" in sentences.",
    ],
    variants: [
      variant(["one fish", "two fish", "two fishes"], "`fish` 常以 fish 作複數；fishes 通常強調不同種類。"),
    ],
  }),
  node({
    id: "F0.5-a-an-sound",
    titleZh: "a / an 看聲音",
    titleEn: "Choosing A or An by Sound",
    goalZh: "依下一個字的起始聲音選擇 a 或 an。",
    form: "a + consonant sound; an + vowel sound",
    diagramRef: "a-an-sound",
    prerequisites: ["F0.4-singular-plural"],
    examples: [
      "I have a red bag.",
      "She eats an apple.",
      "We waited for an hour.",
      "This is a useful book.",
    ],
    contrasts: [
      contrast("She has an bag.", "She has a bag.", "bag 以子音聲音 /b/ 開始。"),
      contrast("We waited for a hour.", "We waited for an hour.", "hour 的 h 不發音，開頭是母音聲音。"),
    ],
    bugs: [
      bug("一所大學", "an university", "a university", "university 開頭是 /j/ 子音聲音。"),
      bug("一顆橘子", "a orange", "an orange", "orange 開頭是母音聲音。"),
    ],
    dialogue: [
      "Do we say \"a apple\"?",
      "No. We say \"an apple\".",
      "What about \"university\"?",
      "We say \"a university\" because it starts with a /y/ sound.",
    ],
    prompts: [
      "Say one noun phrase with \"a\" and one with \"an\".",
      "Write a sentence with \"an hour\".",
    ],
    variants: [
      variant(["an herb", "a herb"], "美式英語常不發 herb 的 h，所以用 an；英式英語通常發 h，所以用 a。", "US/UK"),
    ],
  }),
  node({
    id: "F1.1-subject-pronouns",
    titleZh: "主詞代名詞",
    titleEn: "Subject Pronouns",
    goalZh: "用 I、you、he、she、it、we、they 代替清楚的主詞。",
    form: "subject pronoun + predicate",
    diagramRef: "pronoun-positions",
    prerequisites: ["F0.2-be-agreement"],
    examples: [
      "I like music.",
      "She is my teacher.",
      "It is on the desk.",
      "They walk to school.",
    ],
    contrasts: [
      contrast("Me am ready.", "I am ready.", "主詞位置使用 I，不使用受格 me。"),
      contrast("Tom and Amy is here.", "They are here.", "Tom and Amy 是複數，可用 they 代替並搭配 are。"),
    ],
    bugs: [
      bug("她是我的妹妹。", "Her is my sister.", "She is my sister.", "主詞位置要用 she。"),
      bug("它很重。", "Is heavy.", "It is heavy.", "物品可用 it 作主詞，不能省略。"),
    ],
    dialogue: [
      "Who is that girl?",
      "She is my classmate.",
      "Where are Ben and Leo?",
      "They are in the library.",
    ],
    prompts: [
      "Use \"she\" or \"he\" to introduce someone.",
      "Write a sentence that uses \"they\" for two people.",
    ],
  }),
  node({
    id: "F1.2-action-affirmative",
    titleZh: "一般動詞肯定句",
    titleEn: "Affirmative Action-Verb Sentences",
    goalZh: "用主詞、一般動詞與必要受詞表達動作。",
    form: "subject + action verb + object/place/time",
    diagramRef: "sentence-slots",
    prerequisites: ["F0.1-complete-sentence"],
    examples: [
      "I like apples.",
      "We play basketball after school.",
      "My father drives to work.",
      "She reads a book every night.",
    ],
    contrasts: [
      contrast("I am like music.", "I like music.", "like 本身是一般動詞，這個意思不需要 am。"),
      contrast("We are play basketball.", "We play basketball.", "一般現在的動作句不使用 are + 原形。"),
    ],
    bugs: [
      bug("我每天走路上學。", "I am walk to school every day.", "I walk to school every day.", "walk 已是動詞，不要在前面加 am。"),
      bug("她看電視。", "She TV.", "She watches TV.", "需要加入表示動作的動詞 watches。", "E0"),
    ],
    dialogue: [
      "What do you do after school?",
      "I play basketball with my friends.",
      "What does your sister do?",
      "She reads in the library.",
    ],
    prompts: [
      "Say one sentence about something you do every day.",
      "Write a sentence with a subject, an action verb, and an object.",
    ],
  }),
  node({
    id: "F1.3-predicate-choice",
    titleZh: "be 述語與一般動詞述語",
    titleEn: "Choosing a Be or Action Predicate",
    goalZh: "依要表達的身分、狀態、位置或動作選擇正確述語。",
    form: "be + noun/adjective/place OR action verb",
    diagramRef: "predicate-routes",
    prerequisites: ["F0.3-be-meaning", "F1.2-action-affirmative"],
    examples: [
      "I am tired.",
      "He is a teacher.",
      "The book is on the desk.",
      "She plays soccer.",
    ],
    contrasts: [
      contrast("She is plays soccer.", "She plays soccer.", "一般現在式的 plays 已構成述語，不再加 is。"),
      contrast("I happy today.", "I am happy today.", "happy 是形容詞，需要 be 形成述語。"),
    ],
    bugs: [
      bug("我喜歡這首歌。", "I am like this song.", "I like this song.", "like 在這裡是動詞，不是形容詞。"),
      bug("他在教室裡。", "He in the classroom.", "He is in the classroom.", "位置片語前需要 is。"),
    ],
    dialogue: [
      "Is \"hungry\" an action?",
      "No. We say, \"I am hungry.\"",
      "What about \"eat\"?",
      "That is an action. We say, \"I eat lunch.\"",
    ],
    prompts: [
      "Say one be sentence and one action-verb sentence.",
      "Write a sentence about a state and a sentence about an action.",
    ],
    notesZh: [
      "「一個述語選一條基本路線」只用於初學肯定句；後續的 is playing、can swim、has finished 都是完整動詞片語。",
    ],
  }),
  node({
    id: "F1.4-be-questions-negatives",
    titleZh: "be 問句、否定與短答",
    titleEn: "Questions, Negatives, and Short Answers with Be",
    goalZh: "移動 be 形成問句，並把 not 放在 be 後。",
    form: "Be + subject ...?; subject + be + not ...",
    diagramRef: "question-routes",
    prerequisites: ["F0.2-be-agreement", "F1.3-predicate-choice"],
    examples: [
      "Are you tired?",
      "Is she at home?",
      "I am not busy.",
      "They aren't ready.",
    ],
    contrasts: [
      contrast("Do you tired?", "Are you tired?", "tired 是形容詞，問句使用 be 路線。"),
      contrast("She not is here.", "She is not here.", "not 放在 is 後面。"),
    ],
    bugs: [
      bug("他是老師嗎？", "Does he a teacher?", "Is he a teacher?", "身分句使用 is 形成問句。"),
      bug("我們不冷。", "We not cold.", "We are not cold.", "否定狀態句仍需要 are。"),
    ],
    dialogue: [
      "Are you ready?",
      "Yes, I am.",
      "Is Amy in the classroom?",
      "No, she isn't.",
    ],
    prompts: [
      "Ask someone how they feel using a be question.",
      "Write one negative sentence with \"is not\" or \"are not\".",
    ],
    variants: [
      variant(["is not", "isn't"], "完整形式與縮寫都自然；正式程度與語氣可能不同。"),
    ],
  }),
  node({
    id: "F1.5-do-does",
    titleZh: "do / does 問句與否定",
    titleEn: "Questions and Negatives with Do and Does",
    goalZh: "使用 do/does 詢問或否定現在的動作與喜好，主要動詞回原形。",
    form: "Do/Does + subject + base verb?; subject + do/does not + base verb",
    diagramRef: "question-routes",
    prerequisites: ["F1.2-action-affirmative", "F1.3-predicate-choice"],
    examples: [
      "Do you like apples?",
      "Does she walk to school?",
      "I don't drink coffee.",
      "He doesn't play soccer.",
    ],
    contrasts: [
      contrast("Does he likes cats?", "Does he like cats?", "does 已標示第三人稱，後面的動詞回原形。"),
      contrast("She don't eat meat.", "She doesn't eat meat.", "第三人稱單數 she 使用 doesn't。"),
    ],
    bugs: [
      bug("你每天看書嗎？", "Are you read every day?", "Do you read every day?", "read 是一般動詞，問句使用 do。"),
      bug("他不喜歡牛奶。", "He doesn't likes milk.", "He doesn't like milk.", "doesn't 後接原形 like。"),
    ],
    dialogue: [
      "Do you play soccer?",
      "Yes, I do.",
      "Does your sister play, too?",
      "No, she doesn't.",
    ],
    prompts: [
      "Ask a friend about a daily habit with \"Do you...?\"",
      "Write one negative sentence with \"doesn't\".",
    ],
  }),
  node({
    id: "F1.6-wh-questions",
    titleZh: "Wh- 資訊問句",
    titleEn: "Wh- Information Questions",
    goalZh: "用 who、what、where、when、why、how 詢問缺少的資訊。",
    form: "Wh-word + be/do/does + subject ...?",
    diagramRef: "question-routes",
    prerequisites: ["F1.4-be-questions-negatives", "F1.5-do-does"],
    examples: [
      "What do you need?",
      "Where is my book?",
      "When does class start?",
      "Why are you sad?",
    ],
    contrasts: [
      contrast("Where you live?", "Where do you live?", "一般動詞 live 的問句需要 do。"),
      contrast("What she wants?", "What does she want?", "第三人稱問句使用 does，want 回原形。"),
    ],
    bugs: [
      bug("你為什麼累？", "Why you are tired?", "Why are you tired?", "be 問句要把 are 放到主詞前。"),
      bug("他幾點起床？", "When he gets up?", "When does he get up?", "一般動詞問句需要 does，主要動詞回原形。"),
    ],
    dialogue: [
      "Where do you live?",
      "I live near the park.",
      "How do you get to school?",
      "I take the bus.",
    ],
    prompts: [
      "Ask one question with \"where\".",
      "Write one question with \"why\" and a be verb.",
    ],
    variants: [
      variant(["Who called you?", "Who did you call?"], "who 當主詞時通常不加 do；who 當受詞時使用 did/do/does。"),
    ],
  }),
  node({
    id: "F2.1-present-simple",
    titleZh: "現在簡單式",
    titleEn: "Present Simple",
    goalZh: "用現在簡單式表達習慣、反覆事件與一般事實。",
    form: "subject + base verb; he/she/it + verb-s",
    diagramRef: "tense-timeline",
    prerequisites: ["F1.2-action-affirmative", "F1.5-do-does"],
    examples: [
      "I walk to school every day.",
      "My brother plays soccer on Fridays.",
      "Water boils at 100 degrees Celsius.",
      "The library opens at nine.",
    ],
    contrasts: [
      contrast("He walk to school every day.", "He walks to school every day.", "第三人稱單數 he 的現在簡單式動詞通常加 -s。"),
      contrast("She is plays tennis on Fridays.", "She plays tennis on Fridays.", "現在簡單式的一般動詞不和 is 這樣連用。"),
    ],
    bugs: [
      bug("我妹妹每天讀書。", "My sister read every day.", "My sister reads every day.", "第三人稱單數 sister 要用 reads。"),
      bug("太陽從東方升起。", "The sun rise in the east.", "The sun rises in the east.", "一般事實使用現在簡單式，單數主詞加 -s。"),
    ],
    dialogue: [
      "What do you do every morning?",
      "I eat breakfast and walk to school.",
      "What does your brother do?",
      "He takes the bus.",
    ],
    prompts: [
      "Describe one thing you do every day.",
      "Write one fact about an animal.",
    ],
  }),
  node({
    id: "F2.2-frequency-adverbs",
    titleZh: "頻率副詞的位置",
    titleEn: "Position of Frequency Adverbs",
    goalZh: "把 always、usually、often、sometimes、never 放在自然的位置。",
    form: "before most verbs; after be",
    diagramRef: "frequency-position",
    prerequisites: ["F2.1-present-simple"],
    examples: [
      "I usually walk to school.",
      "She is often tired after practice.",
      "We never drink coffee at night.",
      "Sometimes, Dad cooks dinner.",
    ],
    contrasts: [
      contrast("I play usually soccer after school.", "I usually play soccer after school.", "頻率副詞通常放在一般動詞前。"),
      contrast("He always is late.", "He is always late.", "頻率副詞通常放在 be 後；前者只在特殊強調時可能出現。", "awkward"),
    ],
    bugs: [
      bug("我常常搭公車。", "I take often the bus.", "I often take the bus.", "often 放在主要動詞 take 前。"),
      bug("她從不遲到。", "She never is late.", "She is never late.", "be 句的 never 通常放在 is 後。"),
    ],
    dialogue: [
      "How often do you read?",
      "I usually read before bed.",
      "Is your brother ever late?",
      "No, he is never late.",
    ],
    prompts: [
      "Say one true sentence with \"usually\".",
      "Write one sentence with \"never\" in a natural position.",
    ],
  }),
  node({
    id: "F2.3-present-continuous",
    titleZh: "現在進行式",
    titleEn: "Present Continuous",
    goalZh: "用 be + V-ing 表達現在正在發生或暫時進行的事。",
    form: "subject + am/is/are + verb-ing",
    diagramRef: "tense-timeline",
    prerequisites: ["F0.2-be-agreement", "F1.2-action-affirmative"],
    examples: [
      "I am reading now.",
      "She is cooking dinner.",
      "They are playing outside.",
      "It is raining.",
    ],
    contrasts: [
      contrast("I reading now.", "I am reading now.", "現在進行式需要完整的 be + V-ing。"),
      contrast("She is cook dinner.", "She is cooking dinner.", "be 後要接 V-ing，不接原形表示進行。"),
    ],
    bugs: [
      bug("他現在正在跑步。", "He running now.", "He is running now.", "不能省略 is。"),
      bug("我們正在吃午餐。", "We are eat lunch.", "We are eating lunch.", "are 後接 eating。"),
    ],
    dialogue: [
      "What are you doing?",
      "I am drawing a picture.",
      "What is Leo doing?",
      "He is reading by the window.",
    ],
    prompts: [
      "Say what you are doing right now.",
      "Write one sentence about what another person is doing.",
    ],
  }),
  node({
    id: "F2.4-present-contrast",
    titleZh: "習慣與此刻",
    titleEn: "Present Simple versus Present Continuous",
    goalZh: "依習慣、事實、此刻或暫時情況選擇現在簡單或進行式。",
    form: "routine/fact: present simple; now/temporary: present continuous",
    diagramRef: "tense-timeline",
    prerequisites: ["F2.1-present-simple", "F2.3-present-continuous"],
    examples: [
      "I brush my teeth every morning.",
      "I am brushing my teeth now.",
      "Amy usually walks to school.",
      "Amy is taking the bus today.",
    ],
    contrasts: [
      contrast("Look! The dog runs after the ball.", "Look! The dog is running after the ball.", "眼前正在發生的動作通常用現在進行式。", "awkward"),
      contrast("I am going to school by bus every day.", "I go to school by bus every day.", "固定習慣通常用現在簡單式；進行式會暗示暫時安排。", "misleading"),
    ],
    bugs: [
      bug("我通常七點起床。", "I am usually getting up at seven.", "I usually get up at seven.", "穩定習慣使用現在簡單式。"),
      bug("安靜！寶寶正在睡覺。", "Be quiet! The baby sleeps.", "Be quiet! The baby is sleeping.", "此刻正在發生，用現在進行式。"),
    ],
    dialogue: [
      "Do you usually walk to school?",
      "Yes, but I am taking the bus today.",
      "Why are you taking the bus?",
      "It is raining right now.",
    ],
    prompts: [
      "Contrast what you usually do with what you are doing today.",
      "Write two sentences: one routine and one action happening now.",
    ],
  }),
  node({
    id: "F2.5-stative-verbs",
    titleZh: "常見狀態動詞",
    titleEn: "Common Stative Verbs",
    goalZh: "知道 like、want、know、need 等通常用簡單式表狀態。",
    form: "stative verb in simple form",
    diagramRef: "tense-timeline",
    prerequisites: ["F2.4-present-contrast"],
    examples: [
      "I like this song.",
      "I know the answer.",
      "She wants some water.",
      "We need more time.",
    ],
    contrasts: [
      contrast("I am knowing the answer.", "I know the answer.", "know 通常描述狀態，不使用進行式。"),
      contrast("She is wanting some water.", "She wants some water.", "want 通常使用現在簡單式。"),
    ],
    bugs: [
      bug("我不懂。", "I am not understanding.", "I don't understand.", "understand 通常作狀態動詞。"),
      bug("他需要幫忙。", "He is needing help.", "He needs help.", "need 通常不用進行式。"),
    ],
    dialogue: [
      "Do you know the answer?",
      "No, but I understand the question.",
      "Do you need help?",
      "Yes, I need a little help.",
    ],
    prompts: [
      "Say one sentence with \"know\" or \"need\".",
      "Write one sentence with a stative verb in the present simple.",
    ],
    variants: [
      variant(["I love it.", "I'm loving it."], "進行式可在廣告或特殊語境強調暫時感受，但不是基礎預設用法。"),
    ],
  }),
  node({
    id: "F2.6-pronoun-case",
    titleZh: "主格、受格與所有格",
    titleEn: "Pronoun Case and Possessives",
    goalZh: "依代名詞在句中的位置選擇 I/me/my/mine 等形式。",
    form: "subject / object / possessive determiner / possessive pronoun",
    diagramRef: "pronoun-positions",
    prerequisites: ["F1.1-subject-pronouns", "F1.2-action-affirmative"],
    examples: [
      "She helps me.",
      "This is my bag.",
      "This bag is mine.",
      "They gave us their map.",
    ],
    contrasts: [
      contrast("The teacher helps I.", "The teacher helps me.", "動詞 helps 後面的受詞使用 me。"),
      contrast("This is mine book.", "This is my book.", "名詞 book 前用 my；mine 後面不接名詞。"),
    ],
    bugs: [
      bug("請看我。", "Please look at I.", "Please look at me.", "介系詞 at 後使用受格 me。"),
      bug("這支筆是她的。", "This pen is her.", "This pen is hers.", "句尾不接名詞時用 hers。"),
    ],
    dialogue: [
      "Is this your pencil?",
      "No, mine is blue.",
      "Does this one belong to Amy?",
      "Yes, it is hers.",
    ],
    prompts: [
      "Say who helps you using an object pronoun.",
      "Write one sentence with \"my\" and one with \"mine\".",
    ],
  }),
  node({
    id: "F2.7-there-count-quantity",
    titleZh: "there is/are 與基本數量",
    titleEn: "There Is/Are, Countability, and Basic Quantity",
    goalZh: "描述存在，並搭配單複數、some 與 any。",
    form: "there is + singular/uncountable; there are + plural",
    diagramRef: "quantifier-matrix",
    prerequisites: ["F0.4-singular-plural", "F1.4-be-questions-negatives"],
    examples: [
      "There is a book on the desk.",
      "There are three books on the desk.",
      "There is some water in the bottle.",
      "Are there any questions?",
    ],
    contrasts: [
      contrast("There have a park near my house.", "There is a park near my house.", "英文存在句使用 there is，不直翻中文的「有」成 have。"),
      contrast("There is three apples.", "There are three apples.", "複數 apples 搭配 are。"),
    ],
    bugs: [
      bug("冰箱裡有一些牛奶。", "There are some milk in the fridge.", "There is some milk in the fridge.", "milk 是不可數名詞，搭配 is。"),
      bug("沒有任何問題。", "There aren't some questions.", "There aren't any questions.", "一般否定句常使用 any。"),
    ],
    dialogue: [
      "Is there any juice?",
      "Yes, there is some juice in the fridge.",
      "Are there any cups?",
      "Yes, there are four cups on the table.",
    ],
    prompts: [
      "Describe one thing that is in your room.",
      "Write a sentence with \"There are\" and a number.",
    ],
    variants: [
      variant(["There are two people outside.", "There's two people outside."], "口語常聽到 there's + 複數；正式學習與寫作使用 there are。"),
    ],
  }),
  node({
    id: "F3.1-past-be",
    titleZh: "過去的 was / were",
    titleEn: "Past Forms of Be",
    goalZh: "用 was/were 表達過去的身分、狀態與位置。",
    form: "I/he/she/it was; you/we/they were",
    diagramRef: "tense-timeline",
    prerequisites: ["F0.3-be-meaning", "F1.4-be-questions-negatives"],
    examples: [
      "I was tired yesterday.",
      "They were at the park.",
      "Was she at school?",
      "We weren't late.",
    ],
    contrasts: [
      contrast("We was at home.", "We were at home.", "複數主詞 we 的過去 be 是 were。"),
      contrast("I did be tired.", "I was tired.", "過去狀態直接使用 was，不使用 did be。"),
    ],
    bugs: [
      bug("他昨天很忙。", "He is busy yesterday.", "He was busy yesterday.", "yesterday 指過去，be 使用 was。"),
      bug("你們在圖書館嗎？", "Was you in the library?", "Were you in the library?", "you 的過去 be 使用 were。"),
    ],
    dialogue: [
      "Where were you yesterday?",
      "I was at the library.",
      "Was Ben there, too?",
      "No, he was at home.",
    ],
    prompts: [
      "Say where you were yesterday.",
      "Write one past be question with \"was\" or \"were\".",
    ],
  }),
  node({
    id: "F3.2-past-simple",
    titleZh: "一般動詞過去式",
    titleEn: "Past Simple of Action Verbs",
    goalZh: "用規則與高頻不規則過去式描述已結束事件。",
    form: "subject + past-tense verb",
    diagramRef: "tense-timeline",
    prerequisites: ["F2.1-present-simple"],
    examples: [
      "We played soccer yesterday.",
      "She went to the store.",
      "I saw a rainbow.",
      "Dad bought a new lamp.",
    ],
    contrasts: [
      contrast("She goed to the store.", "She went to the store.", "go 的過去式是不規則形式 went。"),
      contrast("I was went to school.", "I went to school.", "went 已是過去式主要動詞，不和 was 這樣連用。"),
    ],
    bugs: [
      bug("我昨天吃了蛋糕。", "I eated cake yesterday.", "I ate cake yesterday.", "eat 的過去式是 ate。"),
      bug("我們上週看了那部電影。", "We watch the movie last week.", "We watched the movie last week.", "已結束的過去事件使用 watched。"),
    ],
    dialogue: [
      "What did you do yesterday?",
      "I visited Grandma and played cards.",
      "Did you have fun?",
      "Yes, we had a great time.",
    ],
    prompts: [
      "Say one thing you did yesterday.",
      "Write two past-tense sentences about last weekend.",
    ],
  }),
  node({
    id: "F3.3-did-questions",
    titleZh: "did 問句與否定",
    titleEn: "Past Questions and Negatives with Did",
    goalZh: "用 did/didn't 詢問或否定過去事件，主要動詞回原形。",
    form: "Did + subject + base verb?; subject + did not + base verb",
    diagramRef: "question-routes",
    prerequisites: ["F3.2-past-simple", "F1.5-do-does"],
    examples: [
      "Did you go to school?",
      "She didn't eat breakfast.",
      "Where did they play?",
      "Yes, I did.",
    ],
    contrasts: [
      contrast("Did you went home?", "Did you go home?", "did 已標示過去，後面的動詞回原形 go。"),
      contrast("He doesn't play yesterday.", "He didn't play yesterday.", "過去否定使用 didn't。"),
    ],
    bugs: [
      bug("她昨天有打電話嗎？", "Did she called yesterday?", "Did she call yesterday?", "did 後接原形 call。"),
      bug("我沒有看到他。", "I didn't saw him.", "I didn't see him.", "didn't 後接原形 see。"),
    ],
    dialogue: [
      "Did you finish your homework?",
      "No, I didn't finish it.",
      "What did you do instead?",
      "I helped my brother with his project.",
    ],
    prompts: [
      "Ask one question about yesterday with \"Did\".",
      "Write one past negative sentence with \"didn't\".",
    ],
  }),
  node({
    id: "F3.4-prepositions",
    titleZh: "地點與時間介系詞",
    titleEn: "Prepositions of Place and Time",
    goalZh: "依空間關係或時間範圍選擇常用介系詞。",
    form: "in/on/at and spatial relations",
    diagramRef: "preposition-map",
    prerequisites: ["F0.3-be-meaning"],
    examples: [
      "The keys are in the box.",
      "The picture is on the wall.",
      "We meet at seven.",
      "I have music class on Monday.",
    ],
    contrasts: [
      contrast("We meet in seven.", "We meet at seven.", "精確時間點使用 at。"),
      contrast("I have PE at Monday.", "I have PE on Monday.", "星期與日期通常使用 on。"),
    ],
    bugs: [
      bug("我七月生日。", "My birthday is on July.", "My birthday is in July.", "月份使用 in。"),
      bug("貓在桌子下面。", "The cat is in the table.", "The cat is under the table.", "under 表示下方，不是裡面。"),
    ],
    dialogue: [
      "Where is the school office?",
      "It is next to the library.",
      "When does it open?",
      "It opens at eight on weekdays.",
    ],
    prompts: [
      "Say where an object is using a place preposition.",
      "Write a sentence with a time and a day.",
    ],
    variants: [
      variant(["on the weekend", "at the weekend"], "美式英語常用 on the weekend；英式英語常用 at the weekend。", "US/UK"),
    ],
  }),
  node({
    id: "F3.5-connectors",
    titleZh: "基本連接詞與邏輯",
    titleEn: "Basic Connectors and Logical Relations",
    goalZh: "用 and、but、or、because、so 清楚表達添加、轉折、選擇、原因與結果。",
    form: "clause + connector + clause",
    diagramRef: "connector-relations",
    prerequisites: ["F0.1-complete-sentence"],
    examples: [
      "I have a pencil and an eraser.",
      "The bag is old, but it is clean.",
      "Do you want tea or water?",
      "I stayed home because I was sick.",
    ],
    contrasts: [
      contrast("Because I was sick, so I stayed home.", "I stayed home because I was sick.", "標準英文通常不用 because 和 so 同時連接同一組原因結果。"),
      contrast("I was tired, but I went to bed early.", "I was tired, so I went to bed early.", "早睡是疲累的結果，so 比 but 更符合邏輯。", "misleading"),
    ],
    bugs: [
      bug("下雨了，所以我們待在室內。", "It rained, because we stayed inside.", "It rained, so we stayed inside.", "前句是原因，後句是結果，使用 so。", "E0"),
      bug("我喜歡蘋果和香蕉。", "I like apples but bananas.", "I like apples and bananas.", "兩項是添加關係，不是轉折。"),
    ],
    dialogue: [
      "Why did you stay home?",
      "I stayed home because I was sick.",
      "Are you feeling better now?",
      "Yes, so I can go to school tomorrow.",
    ],
    prompts: [
      "Join two ideas with \"because\".",
      "Write one sentence that shows a contrast with \"but\".",
    ],
  }),
  node({
    id: "F3.6-basic-helpers",
    titleZh: "can、will 與 going to",
    titleEn: "Can, Will, and Be Going To",
    goalZh: "用 can 表能力、will 表即時決定或預測、going to 表計畫或有跡象的預測。",
    form: "helper + base verb",
    diagramRef: "modal-strength",
    prerequisites: ["F1.3-predicate-choice"],
    examples: [
      "I can swim.",
      "I will call you tonight.",
      "We are going to visit Grandma.",
      "She can't come today.",
    ],
    contrasts: [
      contrast("He can swims.", "He can swim.", "can 後面的動詞使用原形。"),
      contrast("I will to go home.", "I will go home.", "will 後直接接原形，不加 to。"),
    ],
    bugs: [
      bug("她會騎腳踏車。", "She can rides a bike.", "She can ride a bike.", "can 後接 ride。"),
      bug("我們明天打算做蛋糕。", "We going to make a cake tomorrow.", "We are going to make a cake tomorrow.", "going to 前需要正確的 be。"),
    ],
    dialogue: [
      "Can you help me after school?",
      "Yes, I can help you.",
      "What are you going to make?",
      "I am going to make a poster.",
    ],
    prompts: [
      "Say one thing you can do.",
      "Write one plan with \"be going to\".",
    ],
    notesZh: [
      "can、will 與 going to 不能全部翻成同一個「會」；資料庫保留各自的溝通功能。",
    ],
  }),
];

NODES.push(
  node({
    id: "F4.1-past-continuous",
    titleZh: "過去進行式與 when / while",
    titleEn: "Past Continuous with When and While",
    goalZh: "描述過去某時正在進行的背景動作，以及被另一事件打斷的關係。",
    form: "was/were + V-ing; when + event; while + ongoing action",
    diagramRef: "tense-timeline",
    prerequisites: ["F3.1-past-be", "F3.2-past-simple"],
    examples: [
      "I was reading when the phone rang.",
      "They were playing soccer at four.",
      "While Mom was cooking, I set the table.",
      "It was raining when we left school.",
    ],
    contrasts: [
      contrast("I was read when the phone rang.", "I was reading when the phone rang.", "過去進行式使用 was/were + V-ing。"),
      contrast("While the bell rang, we were studying.", "When the bell rang, we were studying.", "短暫發生的 bell rang 通常以 when 引入。", "awkward"),
    ],
    bugs: [
      bug("我回家時，他正在睡覺。", "He slept when I came home.", "He was sleeping when I came home.", "要強調我到家那一刻正在持續的背景動作，使用 was sleeping。", "E0"),
      bug("他們當時正在等公車。", "They was waiting for the bus.", "They were waiting for the bus.", "複數主詞 they 搭配 were。"),
    ],
    dialogue: [
      "What were you doing when I called?",
      "I was taking a shower.",
      "Was your brother home?",
      "Yes, he was doing his homework.",
    ],
    prompts: [
      "Say what you were doing at eight last night.",
      "Write a sentence with \"when\" and the past continuous.",
    ],
  }),
  node({
    id: "F4.2-adjectives-adverbs",
    titleZh: "形容詞與副詞",
    titleEn: "Adjectives and Adverbs",
    goalZh: "用形容詞描述名詞或主詞，用副詞描述動作方式。",
    form: "adjective + noun / be + adjective; verb + adverb",
    diagramRef: "sentence-slots",
    prerequisites: ["F0.3-be-meaning", "F1.2-action-affirmative"],
    examples: [
      "She is a careful student.",
      "She checks her work carefully.",
      "The soup smells good.",
      "Ben runs fast.",
    ],
    contrasts: [
      contrast("He is a carefully boy.", "He is a careful boy.", "名詞 boy 前使用形容詞 careful。"),
      contrast("She speaks English good.", "She speaks English well.", "描述 speaks 的方式通常用副詞 well。"),
    ],
    bugs: [
      bug("他慢慢地走。", "He walks slow.", "He walks slowly.", "正式基礎用法以副詞 slowly 描述 walks。", "E2"),
      bug("這朵花聞起來很香。", "This flower smells sweetly.", "This flower smells sweet.", "smell 在這裡是連綴動詞，後接形容詞。"),
    ],
    dialogue: [
      "How does Amy write?",
      "She writes very carefully.",
      "Is she a careful student?",
      "Yes, she always checks her work.",
    ],
    prompts: [
      "Describe how someone does an action.",
      "Write one sentence with an adjective and one with an adverb.",
    ],
    variants: [
      variant(["He runs fast.", "He works hard."], "fast 和 hard 本身可作副詞；不要造出 fastly，hardly 的意思則是「幾乎不」。"),
    ],
  }),
  node({
    id: "F4.3-comparatives",
    titleZh: "比較級與最高級",
    titleEn: "Comparatives and Superlatives",
    goalZh: "比較兩者或三者以上，並清楚指出比較對象。",
    form: "-er/more ... than; the -est/most; as ... as",
    diagramRef: "comparison-scale",
    prerequisites: ["F4.2-adjectives-adverbs"],
    examples: [
      "Mia is taller than Ben.",
      "This book is more interesting than that one.",
      "Leo is the fastest runner in the class.",
      "My bag is as heavy as yours.",
    ],
    contrasts: [
      contrast("This box is more bigger.", "This box is bigger.", "比較級只標示一次，不同時使用 more 和 -er。"),
      contrast("Amy is the goodest singer.", "Amy is the best singer.", "good 的最高級是不規則形式 best。"),
    ],
    bugs: [
      bug("這條路比那條路短。", "This road is short than that road.", "This road is shorter than that road.", "兩者比較使用 shorter than。"),
      bug("這是三個方案中最方便的。", "This is the more convenient of the three plans.", "This is the most convenient of the three plans.", "三者以上選最高程度，使用 most。"),
    ],
    dialogue: [
      "Which bag is lighter?",
      "The blue bag is lighter than the red one.",
      "Which bag is the cheapest?",
      "The green bag is the cheapest of the three.",
    ],
    prompts: [
      "Compare two objects near you.",
      "Write a sentence with a superlative.",
    ],
    variants: [
      variant(["friendlier", "more friendly"], "兩種形式都可見；friendlier 較常見。"),
    ],
  }),
  node({
    id: "F4.4-quantifiers",
    titleZh: "數量詞",
    titleEn: "Quantifiers",
    goalZh: "依可數與不可數名詞選擇 many、much、few、little、fewer、less。",
    form: "count: many/few/fewer; noncount: much/little/less",
    diagramRef: "quantifier-matrix",
    prerequisites: ["F2.7-there-count-quantity"],
    examples: [
      "How many books do you have?",
      "We don't have much time.",
      "There are a few apples left.",
      "This bottle has less water.",
    ],
    contrasts: [
      contrast("How much books do you need?", "How many books do you need?", "books 是複數可數名詞，使用 many。"),
      contrast("We need less plastic bottles.", "We need fewer plastic bottles.", "正式用法中，複數可數名詞 bottles 使用 fewer。", "awkward"),
    ],
    bugs: [
      bug("我有一點時間。", "I have a few time.", "I have a little time.", "time 在這個意思中不可數，使用 a little。"),
      bug("班上只有少數學生。", "There are little students in the class.", "There are few students in the class.", "students 可數，使用 few。"),
    ],
    dialogue: [
      "How much water do we need?",
      "We need a little more water.",
      "How many bottles should we bring?",
      "A few bottles will be enough.",
    ],
    prompts: [
      "Ask one question with \"how many\" or \"how much\".",
      "Write a sentence with \"a few\" and a count noun.",
    ],
    variants: [
      variant(["fewer people", "less people"], "less + 複數在口語中常見；正式寫作優先使用 fewer people。"),
    ],
  }),
  node({
    id: "F4.5-modal-functions",
    titleZh: "建議、義務與可能性",
    titleEn: "Modal Functions: Advice, Obligation, and Possibility",
    goalZh: "依溝通目的選擇 should、must、have to、may、might、could。",
    form: "modal + base verb; have to + base verb",
    diagramRef: "modal-strength",
    prerequisites: ["F3.6-basic-helpers"],
    examples: [
      "You should get more sleep.",
      "Students must wear a helmet here.",
      "I have to finish my homework.",
      "It might rain this afternoon.",
    ],
    contrasts: [
      contrast("You must to wear a helmet.", "You must wear a helmet.", "must 後直接接原形。"),
      contrast("She shoulds see a doctor.", "She should see a doctor.", "情態動詞不因第三人稱加 -s。"),
    ],
    bugs: [
      bug("你應該休息一下。", "You should to take a break.", "You should take a break.", "should 後接原形。"),
      bug("明天可能會下雪。", "It must snow tomorrow.", "It might snow tomorrow.", "只有可能性時用 might；must 會表達更強的確定或義務。", "E0"),
    ],
    dialogue: [
      "I have a bad headache.",
      "You should rest and drink some water.",
      "Do I have to see a doctor?",
      "You might need one if the pain gets worse.",
    ],
    prompts: [
      "Give one piece of advice with \"should\".",
      "Write a sentence about a possibility with \"might\".",
    ],
  }),
  node({
    id: "F4.6-infinitive-gerund",
    titleZh: "to + V 與 V-ing 搭配",
    titleEn: "Common Infinitive and Gerund Patterns",
    goalZh: "在高頻動詞與介系詞後選擇常見的 to + V 或 V-ing 形式。",
    form: "want/need/plan + to V; enjoy/finish + V-ing; preposition + V-ing",
    diagramRef: "predicate-routes",
    prerequisites: ["F1.2-action-affirmative"],
    examples: [
      "I want to read this book.",
      "We plan to leave early.",
      "She enjoys drawing.",
      "Ben is good at swimming.",
    ],
    contrasts: [
      contrast("She enjoys to draw.", "She enjoys drawing.", "enjoy 後面接 V-ing。"),
      contrast("I want reading this book.", "I want to read this book.", "want 後面通常接 to + 原形。"),
    ],
    bugs: [
      bug("他完成了打掃房間。", "He finished to clean his room.", "He finished cleaning his room.", "finish 後接 V-ing。"),
      bug("我們決定搭公車。", "We decided taking the bus.", "We decided to take the bus.", "decide 後通常接 to + V。"),
    ],
    dialogue: [
      "What do you want to do this weekend?",
      "I want to visit the science museum.",
      "What do you enjoy doing there?",
      "I enjoy trying the hands-on activities.",
    ],
    prompts: [
      "Say something you enjoy doing.",
      "Write one sentence about what you plan to do.",
    ],
    variants: [
      variant(["I like reading.", "I like to read."], "兩種形式通常都自然，語意重點可能因情境略有不同。"),
    ],
  }),
  node({
    id: "F5.1-present-perfect-experience",
    titleZh: "現在完成式：經驗與結果",
    titleEn: "Present Perfect for Experience and Result",
    goalZh: "用 have/has + 過去分詞表達到現在為止的經驗或目前相關結果。",
    form: "have/has + past participle",
    diagramRef: "tense-timeline",
    prerequisites: ["F3.2-past-simple", "F0.2-be-agreement"],
    examples: [
      "I have visited Japan twice.",
      "She has never eaten sushi.",
      "Have you ever seen a whale?",
      "We have finished our project.",
    ],
    contrasts: [
      contrast("Did you ever visited Japan?", "Have you ever visited Japan?", "詢問到目前為止的經驗，使用 have + 過去分詞。"),
      contrast("I have went there twice.", "I have gone there twice.", "go 的過去分詞是 gone。"),
    ],
    bugs: [
      bug("我看過那部電影三次。", "I saw that movie three times in my life.", "I have seen that movie three times.", "未限定已結束時間、強調到目前的累積經驗，現在完成式較自然。", "E2"),
      bug("她已經完成了。", "She has finish it.", "She has finished it.", "has 後使用過去分詞 finished。"),
    ],
    dialogue: [
      "Have you ever ridden a horse?",
      "Yes, I have ridden one twice.",
      "Has your sister tried it?",
      "No, she has never ridden a horse.",
    ],
    prompts: [
      "Ask someone about an experience with \"Have you ever...?\"",
      "Write one sentence about something you have done.",
    ],
  }),
  node({
    id: "F5.2-perfect-markers",
    titleZh: "already、yet、since 與 for",
    titleEn: "Present Perfect Time Markers",
    goalZh: "用 already、yet、since、for 清楚表達完成與持續時間。",
    form: "already in affirmative; yet in questions/negatives; since point; for duration",
    diagramRef: "tense-timeline",
    prerequisites: ["F5.1-present-perfect-experience"],
    examples: [
      "I have already finished my homework.",
      "She hasn't called yet.",
      "We have lived here since 2022.",
      "He has studied English for three years.",
    ],
    contrasts: [
      contrast("I have lived here since three years.", "I have lived here for three years.", "三年是一段期間，使用 for。"),
      contrast("I have finished my homework yesterday.", "I finished my homework yesterday.", "明確已結束的 yesterday 通常使用過去簡單式。"),
    ],
    bugs: [
      bug("我們從星期一就一直很忙。", "We have been busy for Monday.", "We have been busy since Monday.", "Monday 是起點，使用 since。"),
      bug("你已經吃過了嗎？", "Did you eat yet?", "Have you eaten yet?", "詢問到現在是否已完成，在標準學習語境用現在完成式。"),
    ],
    dialogue: [
      "Have you finished the report yet?",
      "Yes, I have already finished it.",
      "How long have you worked on it?",
      "I have worked on it for three days.",
    ],
    prompts: [
      "Say how long you have studied English.",
      "Write one sentence with \"already\" or \"yet\".",
    ],
    variants: [
      variant(["Have you eaten yet?", "Did you eat yet?"], "美式口語可用過去式搭 yet；正式分級先掌握現在完成式。", "US"),
    ],
  }),
  node({
    id: "F5.3-perfect-vs-past",
    titleZh: "現在完成式與過去式",
    titleEn: "Present Perfect versus Past Simple",
    goalZh: "依時間是否已結束、是否與現在相關選擇時態。",
    form: "finished time: past; life experience/current result: present perfect",
    diagramRef: "tense-timeline",
    prerequisites: ["F5.1-present-perfect-experience", "F5.2-perfect-markers"],
    examples: [
      "I visited London in 2024.",
      "I have visited London three times.",
      "She lost her keys yesterday.",
      "She has lost her keys, so she can't open the door.",
    ],
    contrasts: [
      contrast("I have met him last Friday.", "I met him last Friday.", "last Friday 是明確結束的過去時間。"),
      contrast("I went to Japan three times in my life.", "I have been to Japan three times.", "未結束的人生經驗通常用現在完成式更自然。", "awkward"),
    ],
    bugs: [
      bug("他2019年搬到這裡。", "He has moved here in 2019.", "He moved here in 2019.", "明確過去年份搭配過去簡單式。"),
      bug("我的鉛筆不見了，所以現在不能寫。", "I lost my pencil, so I can't write now.", "I have lost my pencil, so I can't write now.", "若強調目前仍找不到，可用現在完成式表現在結果；原句在部分語境仍可接受。", "E3"),
    ],
    dialogue: [
      "Have you seen my notebook?",
      "I saw it on your desk this morning.",
      "I have checked the desk, but it isn't there.",
      "Then someone may have moved it.",
    ],
    prompts: [
      "Contrast one finished past event with one life experience.",
      "Write two sentences that show past simple and present perfect.",
    ],
  }),
  node({
    id: "F5.4-first-conditional",
    titleZh: "第一條件句",
    titleEn: "First Conditional",
    goalZh: "用 if + 現在式和 will/can 表達真實可能的未來條件與結果。",
    form: "if + present simple, will/can + base verb",
    diagramRef: "connector-relations",
    prerequisites: ["F2.1-present-simple", "F3.6-basic-helpers"],
    examples: [
      "If it rains, we will stay inside.",
      "If you study, you will learn more.",
      "I will call you if I need help.",
      "If we leave now, we can catch the bus.",
    ],
    contrasts: [
      contrast("If it will rain, we will stay inside.", "If it rains, we will stay inside.", "第一條件句的 if 子句通常使用現在簡單式。"),
      contrast("If you will study, you pass the test.", "If you study, you will have a better chance of passing the test.", "條件與結果的形式要完整，且避免把結果說得不合理地絕對。", "misleading"),
    ],
    bugs: [
      bug("如果你早點睡，明天會感覺好一點。", "If you will sleep early, you feel better tomorrow.", "If you sleep early, you will feel better tomorrow.", "if 子句用現在式，結果使用 will。"),
      bug("如果我們錯過公車，可以走路。", "If we miss the bus, we can to walk.", "If we miss the bus, we can walk.", "can 後接原形。"),
    ],
    dialogue: [
      "What will we do if it rains?",
      "If it rains, we will move the picnic inside.",
      "Can everyone still come?",
      "Yes. We can meet in the gym if the park is wet.",
    ],
    prompts: [
      "Say what you will do if it rains tomorrow.",
      "Write one realistic first conditional sentence.",
    ],
  }),
  node({
    id: "F5.5-relative-basic",
    titleZh: "基本關係子句",
    titleEn: "Basic Relative Clauses",
    goalZh: "用 who、which、that、where 把必要資訊連到正確的人、物或地點。",
    form: "noun + relative word + clause",
    diagramRef: "relative-attachment",
    prerequisites: ["F0.1-complete-sentence", "F3.5-connectors"],
    examples: [
      "The girl who won the race is my sister.",
      "This is the book that I borrowed.",
      "We built a machine which saves water.",
      "The park where we play is nearby.",
    ],
    contrasts: [
      contrast("The girl which won the race is my sister.", "The girl who won the race is my sister.", "指人時使用 who。"),
      contrast("This is the book who I borrowed.", "This is the book that I borrowed.", "指物時使用 that 或 which。"),
    ],
    bugs: [
      bug("那位幫我的老師很親切。", "The teacher which helped me is kind.", "The teacher who helped me is kind.", "teacher 指人，使用 who。"),
      bug("這是我們見面的咖啡店。", "This is the café which we met.", "This is the café where we met.", "要表達在該地點發生，使用 where。"),
    ],
    dialogue: [
      "Who is the boy who is holding the map?",
      "He is Leo, the student who found the key.",
      "Is that the key that opens the box?",
      "Yes, it is the key that we need.",
    ],
    prompts: [
      "Describe a person with a \"who\" clause.",
      "Write one sentence with \"that\" or \"which\".",
    ],
    variants: [
      variant(["the book that I read", "the book which I read", "the book I read"], "限定物件子句中 that、which 或省略受詞關係代名詞都可能自然。"),
    ],
  }),
  node({
    id: "F5.6-reflexive-reference",
    titleZh: "反身代名詞與清楚指涉",
    titleEn: "Reflexive Pronouns and Clear Reference",
    goalZh: "在主詞與受詞同一人時使用反身代名詞，並避免代名詞指涉含糊。",
    form: "subject acts on self; intensive self for emphasis",
    diagramRef: "pronoun-positions",
    prerequisites: ["F2.6-pronoun-case"],
    examples: [
      "I made the card myself.",
      "She hurt herself while running.",
      "They introduced themselves.",
      "Ben told Leo that Ben would lead the team.",
    ],
    contrasts: [
      contrast("Myself made the card.", "I made the card myself.", "myself 不能取代普通主詞 I。"),
      contrast("Please give the form to myself.", "Please give the form to me.", "主詞不是同一人時，普通受詞使用 me。"),
    ],
    bugs: [
      bug("他看著鏡子裡的自己。", "He looked at him in the mirror.", "He looked at himself in the mirror.", "主詞與受詞是同一個人，使用 himself。", "E0"),
      bug("Tom 告訴 Ben 他會當隊長。", "Tom told Ben that he would be the leader.", "Tom told Ben that Tom would be the leader.", "原句的 he 可能指 Tom 或 Ben；必要時重複名字消除歧義。", "E0"),
    ],
    dialogue: [
      "Did you build this model by yourself?",
      "Yes, I built it myself.",
      "Did Amy make hers by herself?",
      "No, her brother helped her.",
    ],
    prompts: [
      "Say one thing you did by yourself.",
      "Rewrite an ambiguous pronoun sentence so the meaning is clear.",
    ],
  }),
);

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function writeJson(filename, value) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function taipeiDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addAudio(items, key, text, folder = "content") {
  if (items[key] && items[key] !== text) {
    throw new Error(`Audio key collision: ${key}`);
  }
  items[key] = text;
  return `audio/grammar_db/${folder}/${key}.mp3`;
}

function enrichNodes() {
  const contentItems = {};
  const dialogueA = {};
  const dialogueB = {};

  const enriched = NODES.map(raw => {
    const key = slug(raw.id);
    const examples = raw.examples.map((textValue, index) => {
      const audioKey = `${key}_example_${index + 1}`;
      return {
        id: `${raw.id}-example-${index + 1}`,
        text: textValue,
        status: "natural",
        purpose: ["recognition", "conversation", "narrative", "writing"][index],
        audio: addAudio(contentItems, audioKey, textValue),
      };
    });

    const contrasts = raw.contrasts.map((item, index) => {
      const base = `${key}_contrast_${index + 1}`;
      return {
        id: `${raw.id}-contrast-${index + 1}`,
        wrong: {
          text: item.wrong,
          status: item.status,
          audio: addAudio(contentItems, `${base}_wrong`, item.wrong),
        },
        better: {
          text: item.better,
          status: "natural",
          audio: addAudio(contentItems, `${base}_better`, item.better),
        },
        reasonZh: item.reasonZh,
      };
    });

    const chineseTransferBugs = raw.bugs.map((item, index) => {
      const base = `${key}_bug_${index + 1}`;
      return {
        id: `${raw.id}-bug-${index + 1}`,
        zh: item.zh,
        wrong: {
          text: item.wrong,
          status: item.severity === "E3" ? "acceptable" : item.severity === "E2" ? "awkward" : "misleading",
          audio: addAudio(contentItems, `${base}_wrong`, item.wrong),
        },
        better: {
          text: item.better,
          status: "natural",
          audio: addAudio(contentItems, `${base}_better`, item.better),
        },
        reasonZh: item.reasonZh,
        severity: item.severity,
      };
    });

    const turns = raw.dialogue.map((textValue, index) => {
      const speaker = index % 2 === 0 ? "A" : "B";
      const audioKey = `${key}_dialogue_${index + 1}`;
      const target = speaker === "A" ? dialogueA : dialogueB;
      const audio = addAudio(target, audioKey, textValue, "dialogue_lines");
      return {
        id: `${raw.id}-dialogue-${index + 1}`,
        speaker,
        text: textValue,
        audio,
      };
    });

    const productionTasks = raw.prompts.map((prompt, index) => {
      const type = index === 0 ? "speaking" : "writing";
      const audioKey = `${key}_prompt_${type}`;
      return {
        id: `${raw.id}-${type}`,
        type,
        prompt,
        promptAudio: addAudio(contentItems, audioKey, prompt),
        expectedFeatures: [raw.form],
        scoring: {
          meaning: 2,
          targetForm: 2,
          naturalness: 1,
        },
      };
    });

    const diagnostics = [
      {
        id: `${raw.id}-diagnostic-form`,
        domain: "form",
        promptZh: "哪一句最符合本節點的自然英文形式？",
        choices: [
          { ...examples[0], id: "a" },
          { ...contrasts[0].wrong, id: "b" },
          { ...contrasts[1].wrong, id: "c" },
        ],
        answerId: "a",
      },
      {
        id: `${raw.id}-diagnostic-repair`,
        domain: "repair",
        promptZh: `哪一句最適合修正「${contrasts[0].wrong.text}」？`,
        choices: [
          { ...contrasts[0].better, id: "a" },
          { ...contrasts[0].wrong, id: "b" },
          { ...contrasts[1].wrong, id: "c" },
        ],
        answerId: "a",
      },
      {
        id: `${raw.id}-diagnostic-naturalness`,
        domain: "naturalness",
        promptZh: "哪一句在一般情境中最自然，也不會改變核心意思？",
        choices: [
          { ...examples[1], id: "a" },
          { ...chineseTransferBugs[0].wrong, id: "b" },
          { ...chineseTransferBugs[1].wrong, id: "c" },
        ],
        answerId: "a",
      },
    ];

    const revisionText = `${contrasts[0].wrong.text} ${contrasts[1].wrong.text}`;
    const revisionKey = `${key}_revision`;
    const revisionTask = {
      id: `${raw.id}-revision`,
      promptZh: "保留原意，修正下列兩句的形式、語意或自然度問題。",
      text: revisionText,
      audio: addAudio(contentItems, revisionKey, revisionText),
      expectedCorrections: contrasts.map(item => item.better.text),
      severityTargets: raw.bugs.map(item => item.severity),
    };

    return {
      schemaVersion: "1.0.0",
      id: raw.id,
      band: raw.band,
      microLevel: raw.microLevel,
      titleZh: raw.titleZh,
      titleEn: raw.titleEn,
      communicativeGoalZh: raw.goalZh,
      form: raw.form,
      prerequisites: raw.prerequisites,
      diagramRef: raw.diagramRef,
      naturalExamples: examples,
      contrastPairs: contrasts,
      chineseTransferBugs,
      acceptableVariants: raw.variants,
      notesZh: raw.notesZh,
      diagnostics,
      productionTasks,
      revisionTask,
      dialogue: {
        turns,
        fullAudio: `audio/grammar_db/dialogues/${key}.mp3`,
      },
    };
  });

  return { enriched, contentItems, dialogueA, dialogueB };
}

function writeDiagrams() {
  fs.mkdirSync(DIAGRAM_DIR, { recursive: true });
  for (const item of DIAGRAMS) {
    fs.writeFileSync(path.join(DIAGRAM_DIR, `${item.id}.svg`), `${item.svg}\n`, "utf8");
  }
  writeJson(path.join(OUT_DIR, "diagrams.json"), {
    schemaVersion: "1.0.0",
    diagrams: DIAGRAMS.map(item => ({
      id: item.id,
      titleZh: item.titleZh,
      descriptionZh: item.descriptionZh,
      file: `diagrams/${item.id}.svg`,
    })),
  });
}

function writeAudioSpecs(build) {
  fs.mkdirSync(SPEC_DIR, { recursive: true });
  const specs = [
    ["grammar_content.json", {
      outdir: path.join(AUDIO_ROOT, "content"),
      voice: "af_heart",
      speed: 0.88,
      items: build.contentItems,
    }],
    ["grammar_dialogue_a.json", {
      outdir: path.join(AUDIO_ROOT, "dialogue_lines"),
      voice: "af_heart",
      speed: 0.9,
      items: build.dialogueA,
    }],
    ["grammar_dialogue_b.json", {
      outdir: path.join(AUDIO_ROOT, "dialogue_lines"),
      voice: "am_adam",
      speed: 0.9,
      items: build.dialogueB,
    }],
  ];
  const counts = {};
  for (const [filename, specValue] of specs) {
    writeJson(path.join(SPEC_DIR, filename), specValue);
    counts[filename] = Object.keys(specValue.items).length;
  }
  return counts;
}

function main() {
  fs.mkdirSync(BAND_DIR, { recursive: true });
  const build = enrichNodes();
  const diagramIds = new Set(DIAGRAMS.map(item => item.id));
  const nodeIds = new Set(build.enriched.map(item => item.id));
  if (nodeIds.size !== build.enriched.length) throw new Error("Duplicate grammar node ID");
  for (const item of build.enriched) {
    if (!diagramIds.has(item.diagramRef)) throw new Error(`${item.id}: missing diagram ${item.diagramRef}`);
    for (const prerequisite of item.prerequisites) {
      if (!nodeIds.has(prerequisite)) throw new Error(`${item.id}: unknown prerequisite ${prerequisite}`);
    }
  }

  const sorted = build.enriched.slice().sort((a, b) =>
    Number(a.band.slice(1)) - Number(b.band.slice(1)) ||
    a.microLevel - b.microLevel ||
    a.id.localeCompare(b.id));
  for (let number = 0; number <= 7; number += 1) {
    const band = `F${number}`;
    writeJson(path.join(BAND_DIR, `${band.toLowerCase()}.json`), {
      schemaVersion: "1.0.0",
      band,
      nodes: sorted.filter(item => item.band === band),
    });
  }
  writeDiagrams();
  const audioSpecs = writeAudioSpecs(build);

  const counts = {
    nodes: sorted.length,
    byBand: Object.fromEntries(Array.from({ length: 8 }, (_, number) => {
      const band = `F${number}`;
      return [band, sorted.filter(item => item.band === band).length];
    })),
    naturalExamples: sorted.reduce((sum, item) => sum + item.naturalExamples.length, 0),
    contrastPairs: sorted.reduce((sum, item) => sum + item.contrastPairs.length, 0),
    chineseTransferBugs: sorted.reduce((sum, item) => sum + item.chineseTransferBugs.length, 0),
    dialogues: sorted.length,
    dialogueTurns: sorted.reduce((sum, item) => sum + item.dialogue.turns.length, 0),
    diagnostics: sorted.reduce((sum, item) => sum + item.diagnostics.length, 0),
    productionTasks: sorted.reduce((sum, item) => sum + item.productionTasks.length, 0),
    revisionTasks: sorted.length,
    diagrams: DIAGRAMS.length,
    generatedAudioLines: Object.values(audioSpecs).reduce((sum, count) => sum + count, 0),
    fullDialogueAudio: sorted.length,
    totalAudioReferences: Object.values(audioSpecs).reduce((sum, count) => sum + count, 0) + sorted.length,
  };

  const manifest = {
    schemaVersion: "1.0.0",
    generatedOn: taipeiDate(),
    scope: "F0-F7 grammar; F0-F3 fine-grained foundation",
    policy: {
      foundationNodes: 24,
      judgmentLabels: ["natural", "acceptable", "awkward", "misleading"],
      errorSeverity: ["E0", "E1", "E2", "E3"],
      browserSpeechFallback: false,
      dialogueVoices: { A: "af_heart", B: "am_adam" },
      diagramFormat: "inline-compatible SVG",
    },
    counts,
    audioSpecs,
    files: {
      bands: Array.from({ length: 8 }, (_, number) => `bands/f${number}.json`),
      diagrams: "diagrams.json",
      outline: "REBUILD_OUTLINE.md",
      tenLessonCycle: "ten_lesson_cycle.json",
      monthlyCourseMap: "monthly_course_map.json",
    },
  };
  writeJson(path.join(OUT_DIR, "manifest.json"), manifest);
  console.log(JSON.stringify(manifest, null, 2));
}

NODES.push(
  node({
    id: "F7.4-reference-across-sentences",
    titleZh: "跨句指涉與避免含糊",
    titleEn: "Reference across Sentences",
    goalZh: "讓 it、they、this、these 等清楚指向前文，必要時重複關鍵名詞。",
    form: "pronoun/demonstrative + unambiguous antecedent",
    diagramRef: "paragraph-cohesion",
    prerequisites: ["F5.6-reflexive-reference", "F6.6-cohesion-basic"],
    examples: [
      "The bridge had a loose board. This problem made it unsafe.",
      "Mia interviewed two nurses. They described the same issue.",
      "We changed the bus route. The new route reduced travel time.",
      "The report and the map disagreed, so we checked both sources.",
    ],
    contrasts: [
      contrast("The map was beside the report, but it was outdated.", "The map was beside the report, but the map was outdated.", "it 可能指 map 或 report；重複名詞可消除歧義。", "misleading"),
      contrast("We moved the meeting online. This was helpful.", "We moved the meeting online. This change helped more students attend.", "this 後補上概括名詞 change，資訊更清楚。", "awkward"),
    ],
    bugs: [
      bug("John 告訴 Peter，他需要更多時間。", "John told Peter that he needed more time.", "John told Peter, \"I need more time.\"", "原句 he 指涉不清；直接引語可明確指出 John。", "E0"),
      bug("設備壞了。這造成延誤。", "The device broke. This caused a delay.", "The device broke. This failure caused a delay.", "原句可接受；正式說明加入 failure 更精確。", "E3"),
    ],
    dialogue: [
      "Why is this sentence unclear?",
      "The pronoun \"it\" could refer to two different things.",
      "How can we fix it?",
      "We can repeat the key noun or use a clearer noun phrase.",
    ],
    prompts: [
      "Explain what one pronoun refers to in a short paragraph.",
      "Rewrite an ambiguous sentence with a clear noun reference.",
    ],
  }),
  node({
    id: "F7.5-punctuation",
    titleZh: "子句與資訊標點",
    titleEn: "Punctuation for Clauses and Information",
    goalZh: "使用冒號、分號、破折號、括號與連字號組織資訊，而不製造逗號拼接。",
    form: "colon for introduction; semicolon for related clauses; dash/brackets for parenthesis; hyphen in compounds",
    diagramRef: "punctuation-map",
    prerequisites: ["F0.1-complete-sentence", "F6.6-cohesion-basic"],
    examples: [
      "We need three things: paper, tape, and scissors.",
      "The first plan is cheaper; the second is safer.",
      "The final test—our most difficult task—starts tomorrow.",
      "We designed a low-cost water filter.",
    ],
    contrasts: [
      contrast("The first plan is cheaper, the second is safer.", "The first plan is cheaper; the second is safer.", "兩個完整句不能只用逗號連接。"),
      contrast("We need: paper, tape, and scissors.", "We need three things: paper, tape, and scissors.", "冒號前通常需要能獨立成立並完整引出後文的結構。", "awkward"),
    ],
    bugs: [
      bug("報告有兩部分：問題和建議。", "The report has two parts; the problem and the recommendation.", "The report has two parts: the problem and the recommendation.", "後面是前句引出的清單，使用冒號。"),
      bug("這是一個為期三天的活動。", "This is a three day event.", "This is a three-day event.", "數字與單數名詞共同放在名詞前作複合修飾語時加連字號。"),
    ],
    dialogue: [
      "Why can't we join these sentences with only a comma?",
      "They are both complete clauses.",
      "What can we use instead?",
      "We can use a semicolon or add a coordinating conjunction.",
    ],
    prompts: [
      "Read a sentence with a colon and explain what it introduces.",
      "Write two closely related clauses joined by a semicolon.",
    ],
    variants: [
      variant(["The final test—our hardest task—starts tomorrow.", "The final test (our hardest task) starts tomorrow."], "破折號較有強調感；括號通常較像附帶資訊。"),
    ],
  }),
  node({
    id: "F7.6-edit-naturalness",
    titleZh: "修改自然度與語意",
    titleEn: "Editing for Naturalness and Meaning",
    goalZh: "找出文法正確性之外的語序、贅字、搭配與含糊問題。",
    form: "meaning first, then structure, collocation, and register",
    diagramRef: "revision-layers",
    prerequisites: ["F7.3-register", "F7.4-reference-across-sentences", "F7.5-punctuation"],
    examples: [
      "I really like this book.",
      "We discussed the problem after class.",
      "Please enter the room quietly.",
      "The results clearly support our plan.",
    ],
    contrasts: [
      contrast("I very like this book.", "I really like this book.", "very 通常不直接修飾動詞 like；使用 really。"),
      contrast("We discussed about the problem.", "We discussed the problem.", "discuss 直接接受詞，不加 about。"),
    ],
    bugs: [
      bug("請安靜地進入房間。", "Please enter into the room quietly.", "Please enter the room quietly.", "enter 在此可直接接受詞 room，into 顯得多餘。", "E2"),
      bug("我們返回回學校。", "We returned back to school.", "We returned to school.", "return 已包含「回」的意思，back 通常多餘。", "E2"),
    ],
    dialogue: [
      "Is this sentence understandable?",
      "Yes, but \"I very like it\" sounds unnatural.",
      "How should we revise it?",
      "We should say, \"I really like it.\"",
    ],
    prompts: [
      "Explain why one understandable sentence still sounds awkward.",
      "Revise a sentence for meaning, naturalness, and register.",
    ],
    notesZh: [
      "最後一級不以更難的規則為主，而是整合 E0–E3 判定，建立自我修改能力。",
    ],
  }),
);

NODES.push(
  node({
    id: "F7.1-relative-advanced",
    titleZh: "關係子句深化",
    titleEn: "Advanced Relative Clauses and Attachment",
    goalZh: "使用 whose、when 與非限定關係子句，並讓補充資訊連到正確先行詞。",
    form: "defining or non-defining relative clause with clear antecedent",
    diagramRef: "relative-attachment",
    prerequisites: ["F5.5-relative-basic"],
    examples: [
      "The student whose idea won is in my class.",
      "June is the month when we present our project.",
      "Ms. Lee, who teaches science, checked our design.",
      "The device that measures air quality is on the roof.",
    ],
    contrasts: [
      contrast("Ms. Lee who teaches science checked our design.", "Ms. Lee, who teaches science, checked our design.", "若 Ms. Lee 身分已明確，非必要補充資訊通常以逗號隔開。", "awkward"),
      contrast("We spoke to the engineer about the device who designed it.", "We spoke to the engineer who designed the device.", "who 子句應緊接它所描述的 engineer，避免錯誤附著。", "misleading"),
    ],
    bugs: [
      bug("那位腳踏車被偷的學生報警了。", "The student who bike was stolen called the police.", "The student whose bike was stolen called the police.", "表示所屬關係使用 whose。"),
      bug("我們在五月完成，那是雨季開始的月份。", "We finished in May, which the rainy season begins.", "We finished in May, when the rainy season begins.", "指時間並表示在那時發生，使用 when。"),
    ],
    dialogue: [
      "Who checked the final design?",
      "Ms. Lee, who teaches science, checked it.",
      "Is she the teacher whose class won last year?",
      "Yes, and June is the month when her class presents again.",
    ],
    prompts: [
      "Describe a person with \"whose\".",
      "Write one non-defining relative clause with commas.",
    ],
  }),
  node({
    id: "F7.2-modal-deduction",
    titleZh: "情態動詞的推論強度",
    titleEn: "Modal Deduction and Degrees of Certainty",
    goalZh: "用 must、may、might、could、can't 表達有證據的不同確定程度。",
    form: "modal + base form; modal + have + past participle for past deduction",
    diagramRef: "modal-strength",
    prerequisites: ["F4.5-modal-functions", "F5.1-present-perfect-experience"],
    examples: [
      "The lights are on, so someone must be home.",
      "This key might open the old box.",
      "The answer could be in the report.",
      "That can't be Ben; he is at school.",
    ],
    contrasts: [
      contrast("Someone must to be home.", "Someone must be home.", "must 後接原形 be。"),
      contrast("It must rain tomorrow because the sky is cloudy.", "It might rain tomorrow because the sky is cloudy.", "多雲只能支持可能性，使用 must 會顯得過度確定。", "misleading"),
    ],
    bugs: [
      bug("她可能忘了。", "She must have forgotten.", "She might have forgotten.", "只有可能性時使用 might have；must have 表強烈推論。", "E0"),
      bug("那不可能是真的。", "That must not be true.", "That can't be true.", "表達邏輯上不可能時，can't be 通常更直接自然。", "E2"),
    ],
    dialogue: [
      "Why is the classroom door open?",
      "The teacher might be inside.",
      "Could a student have opened it?",
      "Yes, but it can't have been Leo because he is absent.",
    ],
    prompts: [
      "Make one careful guess with \"might\".",
      "Write one strong deduction and include the evidence.",
    ],
  }),
  node({
    id: "F7.3-register",
    titleZh: "正式與非正式語體",
    titleEn: "Formal and Informal Register",
    goalZh: "依對象與目的調整請求、用字、縮寫與語氣。",
    form: "choose wording and contraction level for audience",
    diagramRef: "register-scale",
    prerequisites: ["F4.5-modal-functions", "F6.5-reporting-sources"],
    examples: [
      "Could you please send me the schedule?",
      "Hey, can you send me the plan?",
      "I would like to request more information.",
      "We found out that the event was canceled.",
    ],
    contrasts: [
      contrast("Hey, teacher, give me the form.", "Could you please give me the form?", "對老師提出請求時，後者語氣較合適。", "awkward"),
      contrast("I wanna obtain the document.", "I would like to obtain the document.", "wanna 與 obtain 的語體混合，正式請求應保持一致。", "awkward"),
    ],
    bugs: [
      bug("請寄給我詳細資料。", "Send me the details.", "Could you please send me the details?", "直接命令可能顯得突兀；請求句較自然。", "E2"),
      bug("我們在正式報告中發現污染增加。", "We found out pollution got worse.", "We found that pollution had increased.", "正式報告使用較精確且一致的語體。", "E2"),
    ],
    dialogue: [
      "How would you ask a friend for the file?",
      "I would say, \"Can you send me the file?\"",
      "What would you write to the principal?",
      "I would write, \"Could you please send me the document?\"",
    ],
    prompts: [
      "Make the same request to a friend and to a teacher.",
      "Rewrite an informal sentence for a school report.",
    ],
    variants: [
      variant(["I can't attend.", "I cannot attend."], "縮寫較常見於口語與一般書信；完整形式可較正式或帶強調。"),
    ],
  }),
);

NODES.push(
  node({
    id: "F6.1-tense-choice",
    titleZh: "跨句時態選擇",
    titleEn: "Tense Choice Across Sentences",
    goalZh: "依事件時間、背景與目前關聯，在短文中維持清楚一致的時態。",
    form: "choose tense from communicative timeline, not one keyword",
    diagramRef: "tense-timeline",
    prerequisites: ["F4.1-past-continuous", "F5.3-perfect-vs-past"],
    examples: [
      "I was walking home when I found the key.",
      "We have kept the key since that day.",
      "The box was locked, so we asked a teacher for help.",
      "Now we are studying the map inside it.",
    ],
    contrasts: [
      contrast("Yesterday we find a key and now we kept it.", "Yesterday we found a key, and we have kept it since then.", "已結束事件用 found；從過去持續到現在用 have kept。", "misleading"),
      contrast("I was opening the box, and I saw an old map inside.", "I opened the box and saw an old map inside.", "兩個依序完成的主要事件通常都用過去簡單式。", "awkward"),
    ],
    bugs: [
      bug("我正在回家時開始下雨，所以我跑到商店。", "I walked home when it was starting to rain, so I run to a store.", "I was walking home when it started to rain, so I ran to a store.", "背景動作用過去進行，短事件與後續事件用過去簡單式。", "E0"),
      bug("我們從星期一起就在做這份報告。", "We worked on this report since Monday.", "We have worked on this report since Monday.", "since Monday 連到現在時使用現在完成式。"),
    ],
    dialogue: [
      "How did you find the old map?",
      "I was cleaning a shelf when a box fell open.",
      "What have you done since then?",
      "I have compared the map with two newer maps.",
    ],
    prompts: [
      "Tell a short story with a background action and a main event.",
      "Write three connected sentences using past and present perfect clearly.",
    ],
  }),
  node({
    id: "F6.2-passive-process",
    titleZh: "流程被動與資訊焦點",
    titleEn: "Passive Voice for Processes and Focus",
    goalZh: "在做事者未知、不重要或流程本身較重要時使用被動。",
    form: "be + past participle; optional by-agent",
    diagramRef: "active-passive-focus",
    prerequisites: ["F0.2-be-agreement", "F3.2-past-simple"],
    examples: [
      "The bottles are washed before they are reused.",
      "The bridge was built in 1998.",
      "The results are checked by two students.",
      "This material can be recycled.",
    ],
    contrasts: [
      contrast("The bottles are wash before reuse.", "The bottles are washed before reuse.", "被動使用 be + 過去分詞 washed。"),
      contrast("The bridge was build in 1998.", "The bridge was built in 1998.", "build 的過去分詞是不規則形式 built。"),
    ],
    bugs: [
      bug("紙張在工廠被分類。", "The paper is sort at the factory.", "The paper is sorted at the factory.", "is 後接過去分詞 sorted。"),
      bug("學生每天使用這台機器。", "This machine is used by students every day.", "Students use this machine every day.", "若做事者 students 是句子重點，主動句通常更直接自然。", "E2"),
    ],
    dialogue: [
      "How is the water cleaned?",
      "First, it is filtered through sand.",
      "What happens next?",
      "Then it is tested before it is stored.",
    ],
    prompts: [
      "Explain one process step with the passive voice.",
      "Rewrite an active process sentence to focus on the product.",
    ],
    notesZh: ["被動不是較正式就一定較好；是否使用取決於資訊焦點。"],
  }),
  node({
    id: "F6.3-future-forms",
    titleZh: "未來形式的細微差異",
    titleEn: "Nuance among Future Forms",
    goalZh: "區分時刻表、已安排活動、意圖計畫與即時決定或預測。",
    form: "present simple schedule; present continuous arrangement; going to plan/evidence; will decision/prediction",
    diagramRef: "tense-timeline",
    prerequisites: ["F2.3-present-continuous", "F3.6-basic-helpers"],
    examples: [
      "The train leaves at six tomorrow.",
      "I am meeting Ms. Lee after school.",
      "We are going to build a model.",
      "I think the plan will work.",
    ],
    contrasts: [
      contrast("I will meeting Ms. Lee tomorrow.", "I am meeting Ms. Lee tomorrow.", "已安排的會面可用現在進行式；will 後也不能接 meeting。"),
      contrast("Look at those clouds. It will rain.", "Look at those clouds. It is going to rain.", "根據眼前跡象的預測，going to 通常較自然。", "awkward"),
    ],
    bugs: [
      bug("公車明天早上七點出發。", "The bus will leaves at seven tomorrow.", "The bus leaves at seven tomorrow.", "固定時刻表可用現在簡單式；will 後也不能加 -s。"),
      bug("電話響了，我來接。", "The phone is ringing. I am going to answer it.", "The phone is ringing. I will answer it.", "說話當下的即時決定常使用 will。", "E2"),
    ],
    dialogue: [
      "What are you doing after school?",
      "I am meeting our science teacher.",
      "What are you going to discuss?",
      "We are going to plan the final presentation.",
    ],
    prompts: [
      "Describe one arrangement and one plan.",
      "Write a schedule sentence and a prediction sentence.",
    ],
  }),
  node({
    id: "F6.4-expanded-noun-phrases",
    titleZh: "擴展名詞片語",
    titleEn: "Expanded Noun Phrases",
    goalZh: "用有順序的形容詞、介系詞片語或子句精確描述名詞。",
    form: "determiner + ordered modifiers + noun + postmodifier",
    diagramRef: "noun-decision",
    prerequisites: ["F4.2-adjectives-adverbs", "F5.5-relative-basic"],
    examples: [
      "We found a small wooden box.",
      "She carried a beautiful old map.",
      "The students in the library found the clue.",
      "We tested a device that measures temperature.",
    ],
    contrasts: [
      contrast("She has a red big bag.", "She has a big red bag.", "一般順序中，大小通常放在顏色前。", "awkward"),
      contrast("We opened a wooden old box.", "We opened an old wooden box.", "年齡通常放在材質前，且 old 前用 an。"),
    ],
    bugs: [
      bug("一座漂亮的小石橋", "a stone small beautiful bridge", "a beautiful small stone bridge", "評價、大小、材質依常見順序排列。", "E2"),
      bug("桌上的那本書", "the on the table book", "the book on the table", "英文通常把較長的地點修飾語放在名詞後。"),
    ],
    dialogue: [
      "Which box did you find?",
      "We found a small wooden box under the stairs.",
      "What was inside it?",
      "There was an old map with several handwritten notes.",
    ],
    prompts: [
      "Describe an object with two natural modifiers.",
      "Write one noun phrase with a modifier after the noun.",
    ],
  }),
  node({
    id: "F6.5-reporting-sources",
    titleZh: "引述來源與觀點",
    titleEn: "Reporting Sources and Viewpoints",
    goalZh: "用 according to、says that、explained that 等方式忠實標示資訊來源。",
    form: "According to + noun, clause; source + says/explains that + clause",
    diagramRef: "paragraph-cohesion",
    prerequisites: ["F3.5-connectors"],
    examples: [
      "According to the report, traffic has increased.",
      "The article says that the river is cleaner now.",
      "Ms. Chen explained that the test was safe.",
      "Leo said, \"We need more evidence.\"",
    ],
    contrasts: [
      contrast("According to the article says the park is safer.", "According to the article, the park is safer.", "according to 已引入來源，後面不要再加 says 形成雙重結構。"),
      contrast("Amy said me that the test was easy.", "Amy told me that the test was easy.", "tell 可直接接受詞 me；say 通常不使用 said me。"),
    ],
    bugs: [
      bug("根據老師說，活動取消了。", "According to the teacher said, the event was canceled.", "According to the teacher, the event was canceled.", "避免 according to 與 said 疊在同一來源結構。"),
      bug("文章說水質已改善。", "The article says the water quality improved already.", "The article says that the water quality has improved.", "報告目前相關的改善結果時，has improved 較清楚自然。", "E2"),
    ],
    dialogue: [
      "What does the survey show?",
      "According to the survey, most students walk to school.",
      "Does the article agree?",
      "Yes. It says that walking has increased this year.",
    ],
    prompts: [
      "Report one fact with \"According to...\".",
      "Write one sentence that clearly names an information source.",
    ],
    variants: [
      variant(["Amy said that the test was easy.", "Amy told me that the test was easy."], "say 著重內容；tell 通常要指出接收資訊的人。"),
    ],
  }),
  node({
    id: "F6.6-cohesion-basic",
    titleZh: "句內與段內銜接",
    titleEn: "Cohesion within and across Sentences",
    goalZh: "使用時間順序、連接語、代名詞與關鍵詞重複建立清楚段落。",
    form: "ordered connectors + clear reference + controlled repetition",
    diagramRef: "paragraph-cohesion",
    prerequisites: ["F3.5-connectors", "F5.6-reflexive-reference"],
    examples: [
      "First, we measured the water. Then, we recorded the result.",
      "The first plan is cheaper. However, the second plan is safer.",
      "The team tested the bridge. This test revealed a weak point.",
      "Solar panels cost more at first. Therefore, we compared long-term savings.",
    ],
    contrasts: [
      contrast("The first plan is cheaper. Therefore, the second plan is safer.", "The first plan is cheaper. However, the second plan is safer.", "兩項優點形成對比，使用 however，不是結果 therefore。", "misleading"),
      contrast("We changed the route. This was better.", "We changed the route. This change made the walk safer.", "this 單獨指涉可能含糊；補上名詞 change 更清楚。", "awkward"),
    ],
    bugs: [
      bug("我們先訪問居民。最後，我們整理答案。", "First, we interviewed residents. Finally, we organized their answers.", "First, we interviewed residents. Next, we organized their answers.", "只有兩個緊接步驟時 next 比 finally 更符合流程；若確為最後一步才用 finally。", "E2"),
      bug("方案很便宜，因此它不安全。", "The plan is cheap. Therefore, it is unsafe.", "The plan is cheap, but it may not be safe.", "便宜不必然導致不安全；應標示轉折或可能性。", "E0"),
    ],
    dialogue: [
      "Which plan is cheaper?",
      "Plan A is cheaper. However, Plan B is safer.",
      "How should we decide?",
      "First, we should compare cost. Then, we should check the evidence.",
    ],
    prompts: [
      "Connect two contrasting ideas with a clear transition.",
      "Write a three-sentence process with clear sequence words.",
    ],
  }),
);

if (require.main === module) main();

module.exports = { NODES, enrichNodes };
