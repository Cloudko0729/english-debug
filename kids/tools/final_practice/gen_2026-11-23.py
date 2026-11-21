"""第 3 週（11/23–11/27）練習卷：學校還沒教 Unit 4，主練習留在 Unit 3（課本故事句、不可數、看答句寫問句、
oi/oy 和易混字、習作點餐句），每天加一小欄 Unit 4「先試試」（數字、時間、作息片語），看哪些是弱項。
共用題目＋每人自己的錯字複習欄 → weeks/2026-11-23_<kid>.json"""
import json
W = r'D:\english\kids\tools\final_practice\weeks'


def spell(title, items, note="先看一次拼法，再自己寫兩次。"):
    return {"type": "spell", "title": title, "note": note, "items": items}


def recall(title, items, cols=None, review=False, first=False, note=None):
    s = {"type": "recall", "title": title, "items": [dict(zh=z, en=e, **({"first": True} if first else {})) for z, e in items]}
    if cols: s["cols"] = cols
    if review: s["review"] = True
    if note: s["note"] = note
    return s


TRY_NOTE = "Unit 4 還沒教：會的就寫，不會的空著，不要查。"


def try_lines(title, items):
    return {"type": "lines", "title": title, "try": True, "note": TRY_NOTE, "items": [{"text": t} for t in items]}


# ── 每人的錯字複習欄（第 2 週錯字紀錄）：看了寫 → 只看中文 → 句子 → 看中文和第一個字母
REVIEW = {
    "jonathan": [
        spell("錯字複習", [
            {"em": "", "zh": "臺灣", "en": "Taiwan", "tip": "Tai + wan，w 不是 m"},
            {"em": "👃", "zh": "聞起來", "en": "smell", "tip": "s-m-e-l-l，這裡寫原形，不加 s"},
            {"em": "😋", "zh": "餓的", "en": "hungry", "tip": "hun-gry，n 不要掉"}], note="上週寫錯的字。看一次、蓋起來、寫兩次。"),
        recall("錯字複習（只看中文）", [("臺灣", "Taiwan"), ("聞起來", "smell"), ("餓的", "hungry"), ("番茄（很多個）", "tomatoes")], cols=2),
        {"type": "reorder", "title": "錯字複習：把句子排好", "note": "動詞 spread 要緊接在 Next, 後面。",
         "items": [{"chunks": ["some tomato sauce", "Next,", "on the dough.", "spread"], "ans": "Next, spread some tomato sauce on the dough."}]},
        recall("錯字複習（看中文和第一個字母）", [("臺灣", "Taiwan"), ("聞起來", "smell"), ("餓的", "hungry"), ("麵團", "dough")], cols=2, first=True),
    ],
    "albert": [
        spell("錯字複習", [
            {"em": "🍟", "zh": "薯條", "en": "French fries", "tip": "French：F-r-e-n-c-h，是 e 不是 a"},
            {"em": "🤕", "zh": "頭痛", "en": "headache", "tip": "head + ache"},
            {"em": "🥟", "zh": "水餃（複數）", "en": "dumplings", "tip": "dumpling + s，不加 e"}], note="上週寫錯的字。看一次、蓋起來、寫兩次。"),
        recall("錯字複習（只看中文）", [("薯條", "French fries"), ("頭痛", "headache"), ("起司", "cheese"), ("烤", "bake")], cols=2),
        {"type": "lines", "title": "錯字複習：寫完整的句子", "note": "用 He'd、They'd 開頭，some 不要漏，句尾加句點，不用加 please。",
         "items": [{"em": "🥟🥟", "text": "What would Tim like to eat?　{{He'd like some dumplings.}}"},
                   {"em": "🍟", "text": "What would they like to eat?　{{They'd like some French fries.}}"}]},
        recall("錯字複習（看中文和第一個字母）", [("薯條", "French fries"), ("頭痛", "headache"), ("水餃（複數）", "dumplings"), ("起司", "cheese")], cols=2, first=True),
    ],
}
# Day 5 個人錯字欄（避開共同小考已考的字）
QUIZ_REVIEW = {
    "jonathan": [("臺灣", "Taiwan"), ("聞起來", "smell"), ("餓的", "hungry"), ("切片", "slice"), ("抹、塗", "spread"), ("盤子", "plate")],
    "albert": [("薯條", "French fries"), ("頭痛", "headache"), ("水餃（複數）", "dumplings"), ("烤", "bake"), ("最後", "lastly"), ("新鮮的", "fresh")],
}


def week(kid):
    R = REVIEW[kid]
    days = [
        {"date": "2026-11-23", "label": "星期一", "sections": [
            {"type": "lines", "title": "課本故事填空", "box": ["done", "smells", "full", "hungry", "horse"],
             "items": [{"text": "I'm {{done}}. It {{smells}} so good."},
                       {"text": "No, thank you. My plate is {{full}}."},
                       {"text": "I'm so {{hungry}}.　Me too. I could eat a {{horse}}."}]},
            {"type": "copy", "title": "抄寫句子（課本）", "items": ["I'd like a sandwich, please. Sure! Here you are."]},
            {"type": "lines", "title": "這句是什麼意思？（考試有英翻中）", "note": "寫意思就好。",
             "items": [{"text": "I could eat a horse. → {{我好餓。}}"},
                       {"text": "My plate is full. → {{我的盤子滿了。}}"}]},
            try_lines("英文數字", ["12 → {{twelve}}　　15 → {{fifteen}}", "20 → {{twenty}}　　30 → {{thirty}}"]),
            R[0]]},
        {"date": "2026-11-24", "label": "星期二", "sections": [
            {"type": "circle", "title": "圈出正確的（課本 Learn with Boka）", "note": "照課本：coffee、ice cream、milk、tea 跟 some 用時不加 s。", "cols": 1,
             "items": [{"text": "I'd like some ( coffee / coffees ).", "ans": "coffee"},
                       {"text": "Would you like some ( ice cream / ice creams )?", "ans": "ice cream"},
                       {"text": "一整個：I'd like ( a / some ) pizza.", "ans": "a"},
                       {"text": "一兩片：I'd like ( a / some ) pizza.", "ans": "some"},
                       {"text": "一個：I'd like ( a / some ) sandwich, please.", "ans": "a"}]},
            {"type": "lines", "title": "看回答，寫問句", "note": "考試題型。第 1 題問對方想吃什麼，第 2 題用 Would you like 開頭。問句句尾要有問號。",
             "items": [{"text": "A: {{What would you like to eat?}}"}, {"text": "B: I'd like some noodles, please."},
                       {"em": "🍲 問要不要湯", "text": "A: {{Would you like some soup?}}"}, {"text": "B: Yes, please."}]},
            recall("上週以前的字（只看中文）", [("披薩", "pizza"), ("湯", "soup"), ("牛排", "steak"), ("麵（複數）", "noodles")], cols=2),
            try_lines("時間", ["6:00 → {{six o'clock}}　　7:30 → {{seven thirty}}"]),
            R[1]]},
        {"date": "2026-11-25", "label": "星期三", "sections": [
            {"type": "vowel", "title": "填 oi 或 oy（課本 Phonics）", "opts": ["oi", "oy"],
             "items": [{"em": "🪙", "zh": "硬幣", "pre": "c", "ans": "oi", "post": "n"},
                       {"em": "👦", "zh": "男孩", "pre": "b", "ans": "oy", "post": ""},
                       {"em": "🧸", "zh": "玩具", "pre": "t", "ans": "oy", "post": ""},
                       {"em": "🌱", "zh": "泥土", "pre": "s", "ans": "oi", "post": "l"},
                       {"em": "🔊", "zh": "噪音", "pre": "n", "ans": "oi", "post": "se"},
                       {"em": "😊", "zh": "喜悅", "pre": "j", "ans": "oy", "post": ""}]},
            {"type": "circle", "title": "圈出正確的字（易混字）", "note": "coin 硬幣、corn 玉米、boy 男孩、bay 海灣。", "cols": 1,
             "items": [{"text": "There is a ( coin / corn ) in the soil.", "ans": "coin"},
                       {"text": "The ( bay / boy ) is playing with a toy.", "ans": "boy"},
                       {"text": "The ( coin / corn ) is fresh.", "ans": "corn"}]},
            {"type": "lines", "title": "上週的披薩步驟（只看中文填）", "note": "照課文的用字和順序，連接詞和動詞都要寫。",
             "items": [{"em": "首先・切片", "text": "{{First}}, {{slice}} the tomatoes."},
                       {"em": "接著・抹", "text": "{{Next}}, {{spread}} some tomato sauce on the dough."},
                       {"em": "然後・加上", "text": "{{Then}}, {{add}} cheese, tomato slices, and basil on top."},
                       {"em": "最後・烤", "text": "{{Lastly}}, {{bake}} the pizza in the oven."}]},
            {"type": "lines", "title": "這是什麼？寫英文", "try": True, "note": TRY_NOTE,
             "items": [{"text": "⏰ 起床 {{get up}}　　🛏️ 上床睡覺 {{go to bed}}"},
                       {"text": "🍳 吃早餐 {{have breakfast}}　　🏫 上學 {{go to school}}"}]},
            R[2]]},
        {"date": "2026-11-26", "label": "星期四", "sections": [
            {"type": "lines", "title": "選字填空（他校考卷題型）", "box": ["at", "We'd", "horse", "Here you are"],
             "items": [{"text": "Look {{at}} the tomatoes. They're red now."},
                       {"text": "B and C: {{We'd}} like some rice."},
                       {"text": "I'm so hungry. I could eat a {{horse}}."},
                       {"text": "I'd like some steak, please.　Sure! {{Here you are}}."}]},
            {"type": "reorder", "title": "把句子排好，寫在格子裡", "note": "句首大寫，逗號、句點、問號都要寫。",
             "items": [{"chunks": ["please.", "I'd like", "some tea,"], "ans": "I'd like some tea, please."},
                       {"chunks": ["some French fries?", "Would you", "like"], "ans": "Would you like some French fries?"}]},
            {"type": "lines", "title": "看圖寫完整的回答", "note": "像課本一樣，兩樣東西用 and 連起來。",
             "items": [{"em": "🍟 + 🥟", "text": "What would you like to eat?"},
                       {"text": "{{I'd like some French fries and dumplings, please.}}"}]},
            try_lines("數字和時間", ["40 → {{forty}}　　50 → {{fifty}}", "6:45 → {{six forty-five}}　　7:15 → {{seven fifteen}}"]),
            R[3]]},
        {"date": "2026-11-27", "label": "星期五", "test": True, "sections": [
            recall("本週小考：看中文寫英文", [("披薩", "pizza"), ("米飯", "rice"), ("湯", "soup"), ("牛排", "steak"), ("麵（複數）", "noodles"),
                                         ("三明治（複數）", "sandwiches"), ("番茄（很多個）", "tomatoes"), ("起司", "cheese"), ("麵團", "dough")], cols=3),
            {"type": "lines", "title": "寫問句或完整的回答", "note": "問句要有問號；回答句尾要有句點。",
             "items": [{"em": "🍕 問想吃什麼", "text": "A: {{What would you like to eat?}}　B: I'd like some pizza, please."},
                       {"em": "🥛 不要", "text": "A: Would you like some milk?　B: {{No, thank you.}}"},
                       {"em": "🍜", "text": "A: What would Amy like to eat?　B: {{She'd like some noodles.}}"}]},
            {"type": "lines", "title": "時間和作息", "try": True, "note": "還沒教，不算分，不用訂正。", "items": [{"text": t} for t in ["8:30 → {{eight thirty}}　　回家 {{go home}}　　吃晚餐 {{have dinner}}"]]},
            recall("錯字複習（只看中文）", QUIZ_REVIEW[kid], cols=3, review=True),
            {"type": "retry", "title": "對完答案：挑最多 3 個錯字，各蓋住重寫一次", "note": "先照解答一個字母一個字母對好，再寫。", "rows": 3}]},
    ]
    return {"week": "2026-11-23", "file": f"{kid}-2026-11-23_期末考練習_第3週", "title": "期末考練習・第 3 週",
            "focus": "Unit 3 故事句、不可數、寫問句、oi/oy；Unit 4 先試試", "days": days}


for kid in ("jonathan", "albert"):
    open(W + f"\\2026-11-23_{kid}.json", "w", encoding="utf-8").write(json.dumps(week(kid), ensure_ascii=False, indent=1) + "\n")
print("ok")
