"""第 2 週（11/16–11/20）練習卷＋週末複習（11/21–22）：共用題目＋每人自己的錯字複習欄 → weeks/*.json"""
import json, copy
W = r'D:\english\kids\tools\final_practice\weeks'

def spell(title, items, note="先看一次拼法，再自己寫兩次。"):
    return {"type": "spell", "title": title, "note": note, "items": items}

def recall(title, items, cols=None, review=False, first=False):
    s = {"type": "recall", "title": title, "items": [dict(zh=z, en=e, **({"first": True} if first else {})) for z, e in items]}
    if cols: s["cols"] = cols
    if review: s["review"] = True
    return s

# ── 每人的錯字複習欄（每天一欄，題型一天一換：看了寫 → 只看中文 → 看中文和第一個字母 → 句子）
REVIEW = {
    "jonathan": [
        spell("錯字複習", [
            {"em": "😋", "zh": "餓的", "en": "hungry", "tip": "hun-gry，n 不要掉"},
            {"em": "", "zh": "臺灣", "en": "Taiwan", "tip": "Tai + wan，兩個都是 a"}], note="上週末寫錯的字。看一次、蓋起來、寫兩次。"),
        recall("錯字複習（只看中文）", [("餓的", "hungry"), ("臺灣", "Taiwan"), ("盤子", "plate"), ("聞起來", "smell")], cols=2),
        recall("錯字複習（看中文和第一個字母）", [("餓的", "hungry"), ("臺灣", "Taiwan"), ("新鮮的", "fresh"), ("滿的", "full")], cols=2, first=True),
        {"type": "lines", "title": "錯字複習：寫完整的回答", "note": "句尾要有句點。",
         "items": [{"em": "✓", "text": "A: Would you like some soup?　B: {{Yes, please.}}"},
                   {"em": "✘ 吃飽了", "text": "A: Are you hungry?　B: {{No, I'm full.}}"}]},
    ],
    "albert": [
        spell("錯字複習", [
            {"em": "🤢", "zh": "肚子痛", "en": "stomachache", "tip": "stomach + ache，ache 是 a-c-h-e"},
            {"em": "🤕", "zh": "頭痛", "en": "headache", "tip": "head + ache"},
            {"em": "👃", "zh": "聞起來", "en": "smell", "tip": "s-m-e-l-l"}], note="上週末寫錯的字。看一次、蓋起來、寫兩次。"),
        recall("錯字複習（只看中文）", [("肚子痛", "stomachache"), ("頭痛", "headache"), ("薯條", "French fries"), ("聞起來", "smell")], cols=2),
        recall("錯字複習（看中文和第一個字母）", [("肚子痛", "stomachache"), ("頭痛", "headache"), ("三明治（複數）", "sandwiches"), ("水餃（複數）", "dumplings")], cols=2, first=True),
        {"type": "lines", "title": "錯字複習：寫完整的回答", "note": "I'd like some ___, please. 整句寫完，注意逗號和句點。",
         "items": [{"em": "🥟🥟", "text": "A: What would you like to eat?　B: {{I'd like some dumplings, please.}}"},
                   {"em": "🍟", "text": "A: What would you like to eat?　B: {{I'd like some French fries, please.}}"}]},
    ],
}
# Day 5 小考的錯字欄（只看中文）
QUIZ_REVIEW = {
    "jonathan": [("餓的", "hungry"), ("臺灣", "Taiwan"), ("盤子", "plate"), ("滿的", "full"), ("新鮮的", "fresh"), ("聞起來", "smell")],
    "albert": [("肚子痛", "stomachache"), ("頭痛", "headache"), ("聞起來", "smell"), ("薯條", "French fries"), ("三明治（複數）", "sandwiches"), ("水餃（複數）", "dumplings")],
}

def week(kid):
    R = REVIEW[kid]
    days = [
        {"date": "2026-11-16", "label": "星期一", "sections": [
            spell("看圖寫單字（披薩要用的東西）", [
                {"em": "🍅", "zh": "番茄（很多個）", "en": "tomatoes", "tip": "tomato + es"},
                {"em": "🧀", "zh": "起司", "en": "cheese", "tip": "ch + ee + se"},
                {"em": "", "zh": "麵團", "en": "dough", "tip": "這個字的 ough 跟 go 的 o 同音"},
                {"em": "🌿", "zh": "羅勒", "en": "basil"},
                {"em": "🥫", "zh": "番茄醬", "en": "tomato sauce", "tip": "sauce：s-a-u-c-e"},
                {"em": "", "zh": "烤箱", "en": "oven", "tip": "o 的聲音跟 love 的 o 一樣"}]),
            {"type": "lines", "title": "課本短文填空", "box": ["red", "pick", "pizza", "tomatoes"],
             "items": [{"text": "Look at the {{tomatoes}}. They're {{red}} now."},
                       {"text": "Let's {{pick}} some and make a {{pizza}}."}]},
            {"type": "copy", "title": "抄寫材料清單（課本）", "note": "時間不夠可以跳過。", "items": ["What We Need: basil, cheese, dough, tomatoes, tomato sauce"]},
            recall("上週的字（只看中文）", [("米飯", "rice"), ("牛排", "steak"), ("麵（複數）", "noodles"), ("玉米", "corn")], cols=2),
            R[0]]},
        {"date": "2026-11-17", "label": "星期二", "sections": [
            spell("看圖寫單字（做披薩的動作）", [
                {"em": "🔪", "zh": "切片", "en": "slice", "tip": "sl + ice"},
                {"em": "🥄", "zh": "抹、塗", "en": "spread", "tip": "拼字拆開看：sp + read"},
                {"em": "➕", "zh": "加上", "en": "add", "tip": "兩個 d"},
                {"em": "🔥", "zh": "烤", "en": "bake", "tip": "b-a-k-e，a 唸自己的名字"},
                {"em": "🔚", "zh": "最後", "en": "lastly", "tip": "last + ly"}]),
            recall("昨天的字（只看中文）", [("番茄（很多個）", "tomatoes"), ("起司", "cheese"), ("麵團", "dough"), ("烤箱", "oven")], cols=2),
            {"type": "lines", "title": "做披薩的四個步驟", "box": ["First", "Next", "Then", "Lastly"],
             "note": "依課文的用字和順序填。",
             "items": [{"text": "{{First}}, slice the tomatoes."},
                       {"text": "{{Next}}, spread some tomato sauce on the dough."},
                       {"text": "{{Then}}, add cheese, tomato slices, and basil on top."},
                       {"text": "{{Lastly}}, bake the pizza in the oven."}]},
            {"type": "copy", "title": "抄寫句子（課本）", "items": ["Lastly, bake the pizza in the oven."]},
            R[1]]},
        {"date": "2026-11-18", "label": "星期三", "sections": [
            {"type": "lines", "title": "一個 → 很多", "note": "字尾是 ch、sh、s、x 的加 es；tomato、potato 也加 es；其他大多加 s。",
             "items": [{"text": "one tomato → three {{tomatoes}}"}, {"text": "one sandwich → two {{sandwiches}}"},
                       {"text": "one hamburger → five {{hamburgers}}"}, {"text": "one slice → four {{slices}}"}]},
            {"type": "sort", "title": "可數還是不可數？",
             "note": "直接抄進去，不用再加字尾。可以一個一個數的，some 後面用複數；湯、飯、牛奶這種不能數的，不加 s。",
             "cols": ["可數", "不可數"],
             "words": [["dumplings", "水餃", "可數"], ["rice", "飯", "不可數"], ["sandwiches", "三明治", "可數"], ["milk", "牛奶", "不可數"],
                       ["tomatoes", "番茄", "可數"], ["tea", "茶", "不可數"], ["hamburgers", "漢堡", "可數"], ["soup", "湯", "不可數"]]},
            {"type": "circle", "title": "圈出正確的", "cols": 1,
             "items": [{"text": "I'd like some ( milk / milks ), please.", "ans": "milk"},
                       {"text": "We'd like some ( hamburger / hamburgers ).", "ans": "hamburgers"},
                       {"text": "Tony would like ( a / some ) dumplings.", "ans": "some"},
                       {"text": "Would you like some ( rice / rices )?", "ans": "rice"}]},
            {"type": "copy", "title": "抄寫句子（課本）", "items": ["I'd like some pizza, please. Sure! Here you are."]},
            R[2]]},
        {"date": "2026-11-19", "label": "星期四", "sections": [
            {"type": "lines", "title": "縮寫", "note": "would 縮成 'd。",
             "items": [{"text": "I would like → {{I'd}} like　　He would like → {{He'd}} like"},
                       {"text": "We would like → {{We'd}} like　　They would like → {{They'd}} like"}]},
            {"type": "lines", "title": "看圖寫完整的句子", "note": "考試常考：要寫整句，像課本一樣用 He'd、They'd、I'd 開頭；第 3 題句尾加 please。",
             "items": [{"em": "🍜", "text": "What would Tim like to eat?　{{He'd like some noodles.}}"},
                       {"em": "🍲 湯", "text": "What would they like to eat?　{{They'd like some soup.}}"},
                       {"em": "🥩", "text": "What would you like to eat?　{{I'd like some steak, please.}}"}]},
            {"type": "reorder", "title": "把句子排好，寫在格子裡", "note": "句首大寫，句尾的 . 也要寫。第 2 題時間不夠可以跳過。",
             "items": [{"chunks": ["the pizza", "Lastly,", "in the oven.", "bake"], "ans": "Lastly, bake the pizza in the oven."},
                       {"chunks": ["on the dough.", "Next,", "some tomato sauce", "spread"], "ans": "Next, spread some tomato sauce on the dough."}]},
            {"type": "circle", "title": "圈出正確的（習作）", "cols": 1,
             "items": [{"text": "A: Would you like some dumplings?　B: No, thank you. I'm ( full / hungry ).", "ans": "full"},
                       {"text": "Jane ( would / is ) like some rice.", "ans": "would"},
                       {"text": "( They'd / They're ) like some soup.", "ans": "They'd"}]},
            R[3]]},
        {"date": "2026-11-20", "label": "星期五", "test": True, "sections": [
            recall("本週小考：看中文寫英文", [("番茄（很多個）", "tomatoes"), ("起司", "cheese"), ("麵團", "dough"), ("烤箱", "oven"),
                                         ("切片", "slice"), ("抹、塗", "spread"), ("烤", "bake"), ("最後", "lastly"), ("羅勒", "basil")], cols=3),
            {"type": "lines", "title": "做披薩要先做哪一步？寫 1～4", "note": "依課文的步驟順序，在前面寫數字。",
             "items": [{"text": "{{4}}　We bake the pizza."},
                       {"text": "{{2}}　We spread tomato sauce on the dough."},
                       {"text": "{{3}}　We put cheese, tomato slices, and basil on top."},
                       {"text": "{{1}}　We slice the tomatoes."}]},
            {"type": "lines", "title": "寫完整的句子", "note": "用 She'd 開頭；不想要用 No, thank you.", "items": [
                {"em": "🍕", "text": "What would Amy like to eat?　{{She'd like some pizza.}}"},
                {"em": "🥛", "text": "Would you like some milk? (✘)　{{No, thank you.}}"}]},
            recall("錯字複習（只看中文）", QUIZ_REVIEW[kid], cols=3, review=True),
            {"type": "retry", "title": "對完答案：挑最多 3 個錯字，各寫三次", "rows": 3}]},
    ]
    return {"week": "2026-11-16", "file": f"{kid}-2026-11-16_期末考練習_第2週", "title": "期末考練習・第 2 週",
            "focus": "Unit 3 披薩短文、some + 可數／不可數、He'd / They'd、寫完整句", "days": days}

def weekend(kid):
    rv = {
        "jonathan": [("餓的", "hungry"), ("臺灣", "Taiwan"), ("盤子", "plate"), ("聞起來", "smell")],
        "albert": [("肚子痛", "stomachache"), ("頭痛", "headache"), ("聞起來", "smell"), ("薯條", "French fries")],
    }[kid]
    days = [
        {"date": "2026-11-21", "label": "星期六", "tag": "複習 1", "sections": [
            recall("這週的字（只看中文）", [("番茄（很多個）", "tomatoes"), ("起司", "cheese"), ("麵團", "dough"), ("烤箱", "oven"),
                                         ("切片", "slice"), ("抹、塗", "spread"), ("烤", "bake"), ("最後", "lastly"), ("羅勒", "basil")], cols=3),
            {"type": "lines", "title": "做披薩的步驟（不看課本）", "note": "依課文的用字和順序，用 First、Next、Then、Lastly 開頭。",
             "items": [{"text": "{{First}}, {{slice}} the tomatoes."},
                       {"text": "{{Next}}, {{spread}} some tomato sauce on the {{dough}}."},
                       {"text": "{{Then}}, add {{cheese}}, tomato slices, and basil on top."},
                       {"text": "{{Lastly}}, {{bake}} the pizza in the {{oven}}."}]},
            {"type": "circle", "title": "圈出正確的", "cols": 1,
             "items": [{"text": "We'd like some ( tea / teas ).", "ans": "tea"},
                       {"text": "I'd like two ( sandwich / sandwiches ), please.", "ans": "sandwiches"},
                       {"text": "( He'd / He ) like some noodles.", "ans": "He'd"}]},
            recall("錯字複習（只看中文）", rv, cols=2, review=True)]},
        {"date": "2026-11-22", "label": "星期日", "tag": "複習 2", "test": True, "sections": [
            {"type": "lines", "title": "看圖寫完整的句子", "note": "用 He'd、They'd 開頭，整句寫完，句尾加句點。",
             "items": [{"em": "🥟🥟", "text": "What would Ben like to eat?　{{He'd like some dumplings.}}"},
                       {"em": "🍚", "text": "What would they like to eat?　{{They'd like some rice.}}"},
                       {"em": "🍟 ✘", "text": "Would you like some French fries?　{{No, thank you.}}"}]},
            {"type": "reorder", "title": "把句子排好，寫在格子裡",
             "items": [{"chunks": ["slice", "First,", "the tomatoes."], "ans": "First, slice the tomatoes."},
                       {"chunks": ["some pizza,", "I'd", "please.", "like"], "ans": "I'd like some pizza, please."}]},
            recall("錯字複習（看中文和第一個字母）", rv, cols=2, review=True, first=True),
            {"type": "retry", "title": "對完答案：最多挑 3 個錯字，各蓋住重寫一次", "rows": 3}]},
    ]
    return {"week": "2026-11-21", "file": f"{kid}-2026-11-21_期末考練習_第2週_週末複習", "title": "期末考・第 2 週週末複習",
            "focus": "披薩步驟、可數／不可數、完整句", "days": days}

for kid in ("jonathan", "albert"):
    for fn, d in ((f"2026-11-16_{kid}.json", week(kid)), (f"2026-11-21_{kid}.json", weekend(kid))):
        open(W + "\\" + fn, "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=1) + "\n")
print("ok")
