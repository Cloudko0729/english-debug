"""第 3 週（11/23–11/27）練習卷：Unit 4 作息片語、時間用英文字寫、What time do you ...? / Do you ...?
共用題目＋每人自己的錯字複習欄 → weeks/2026-11-23_<kid>.json
（does / gets / has / goes 是第 4 週，這週只用 I / you。）"""
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
QUIZ_REVIEW = {
    "jonathan": [("臺灣", "Taiwan"), ("聞起來", "smell"), ("餓的", "hungry"), ("番茄（很多個）", "tomatoes"), ("麵團", "dough"), ("切片", "slice")],
    "albert": [("薯條", "French fries"), ("頭痛", "headache"), ("水餃（複數）", "dumplings"), ("起司", "cheese"), ("烤", "bake"), ("番茄（很多個）", "tomatoes")],
}

ROUTINE = [("起床", "get up"), ("吃早餐", "have breakfast"), ("上學", "go to school"), ("吃午餐", "have lunch"),
           ("回家", "go home"), ("吃晚餐", "have dinner"), ("寫功課", "do my homework"), ("上床睡覺", "go to bed")]


def week(kid):
    R = REVIEW[kid]
    days = [
        {"date": "2026-11-23", "label": "星期一", "sections": [
            spell("看圖寫片語（課本 My Daily Routine）", [
                {"em": "⏰", "zh": "起床", "en": "get up", "tip": "get + up，兩個字"},
                {"em": "🍳", "zh": "吃早餐", "en": "have breakfast", "tip": "break + fast"},
                {"em": "🏫", "zh": "上學", "en": "go to school", "tip": "school：s-ch-oo-l"},
                {"em": "🍱", "zh": "吃午餐", "en": "have lunch", "tip": "lunch：l-u-n-ch"}]),
            {"type": "lines", "title": "時間用英文寫", "note": "考試的時間要寫英文字，不寫數字。整點寫 seven 或 seven o'clock 都可以。",
             "items": [{"text": "6:30 → {{six thirty}}　　7:00 → {{seven o'clock}}"},
                       {"text": "7:30 → {{seven thirty}}　　12:00 → {{twelve (o'clock)}}"}]},
            {"type": "copy", "title": "抄寫句子（課本）", "items": ["What time do you get up? I get up at six thirty."]},
            recall("上週的字（只看中文）", [("切片", "slice"), ("抹、塗", "spread"), ("烤", "bake"), ("最後", "lastly")], cols=2, note="寫課本用的字。"),
            R[0]]},
        {"date": "2026-11-24", "label": "星期二", "sections": [
            spell("看圖寫片語（課本 My Daily Routine）", [
                {"em": "🏠", "zh": "回家", "en": "go home", "tip": "home 的 e 不發音"},
                {"em": "🍽️", "zh": "吃晚餐", "en": "have dinner", "tip": "din-ner，兩個 n"},
                {"em": "📝", "zh": "寫功課", "en": "do my homework", "tip": "home + work"},
                {"em": "🛏️", "zh": "上床睡覺", "en": "go to bed"}]),
            recall("昨天的片語（只看中文）", ROUTINE[:4], cols=2),
            {"type": "lines", "title": "看時間寫句子", "note": "用 I ___ at ___. 時間寫英文字。",
             "items": [{"em": "🍽️ 吃晚餐", "text": "6:30　I {{have dinner}} at {{six thirty}}."},
                       {"em": "📝 寫功課", "text": "8:00　I {{do my homework}} at {{eight (o'clock)}}."},
                       {"em": "🛏️ 睡覺", "text": "9:30　I {{go to bed}} at {{nine thirty}}."}]},
            {"type": "copy", "title": "抄寫句子（課本）", "items": ["I have dinner at six thirty."]},
            R[1]]},
        {"date": "2026-11-25", "label": "星期三", "sections": [
            spell("寫時間要用的數字", [
                {"em": "", "zh": "十二", "en": "twelve", "tip": "twel + ve"},
                {"em": "", "zh": "十五", "en": "fifteen", "tip": "fif + teen，不是 five"},
                {"em": "", "zh": "三十", "en": "thirty", "tip": "thir + ty"},
                {"em": "", "zh": "四十", "en": "forty", "tip": "for + ty，沒有 u"},
                {"em": "", "zh": "五十", "en": "fifty", "tip": "fif + ty"}]),
            {"type": "lines", "title": "有分鐘的時間（習作）", "note": "先說幾點，再說幾分。",
             "items": [{"text": "4:15 → {{four fifteen}}　　7:20 → {{seven twenty}}"},
                       {"text": "6:45 → {{six forty-five}}　　7:50 → {{seven fifty}}"}]},
            {"type": "lines", "title": "上週的披薩步驟（只看中文填）", "note": "連接詞和動詞都要寫。",
             "items": [{"em": "首先・切片", "text": "{{First}}, {{slice}} the tomatoes."},
                       {"em": "接著・抹", "text": "{{Next}}, {{spread}} some tomato sauce on the dough."},
                       {"em": "然後・加上", "text": "{{Then}}, {{add}} cheese, tomato slices, and basil on top."},
                       {"em": "最後・烤", "text": "{{Lastly}}, {{bake}} the pizza in the oven."}]},
            {"type": "circle", "title": "圈出正確的（上週）", "cols": 2,
             "items": [{"text": "Tony would like ( a / some ) dumplings.", "ans": "some"},
                       {"text": "I'd like ( a / some ) sandwich, please.", "ans": "a"}]},
            R[2]]},
        {"date": "2026-11-26", "label": "星期四", "sections": [
            {"type": "lines", "title": "課本故事填空", "note": "第 2 句先填「平日」，再填「週末」。", "box": ["every day", "early bird", "weekdays", "weekends"],
             "items": [{"text": "I get up at six o'clock {{every day}}. You're an {{early bird}}."},
                       {"text": "I get up at six thirty on {{weekdays}}. On {{weekends}}, I get up at eight."}]},
            {"type": "lines", "title": "回答問題", "note": "照課本用 Yes, I do. / No, I don't. 回答，句尾加句點，不用加 please。",
             "items": [{"em": "🍱 12:00 吃", "text": "Do you have lunch at twelve?　{{Yes, I do.}}"},
                       {"em": "🍱 其實 12:30 吃", "text": "Do you have lunch at twelve?　{{No, I don't.}}"},
                       {"text": "　　　　I have lunch at {{twelve thirty}}."}]},
            {"type": "reorder", "title": "把句子排好，寫在格子裡", "note": "句首大寫，句尾的 ? 或 . 也要寫。",
             "items": [{"chunks": ["up?", "What time", "get", "do you"], "ans": "What time do you get up?"},
                       {"chunks": ["at six thirty.", "have dinner", "I"], "ans": "I have dinner at six thirty."}]},
            {"type": "circle", "title": "圈出正確的", "cols": 1,
             "items": [{"text": "I get up at six thirty ( on / at ) weekdays.", "ans": "on"},
                       {"text": "Do you go to bed at nine?　No, I ( don't / do ).", "ans": "don't"},
                       {"text": "What time ( do / are ) you have dinner?", "ans": "do"}]},
            R[3]]},
        {"date": "2026-11-27", "label": "星期五", "test": True, "sections": [
            recall("本週小考：看中文寫英文片語", ROUTINE, cols=2),
            {"type": "lines", "title": "時間用英文寫",
             "items": [{"text": "6:30 → {{six thirty}}　　7:15 → {{seven fifteen}}"},
                       {"text": "12:00 → {{twelve (o'clock)}}　　6:45 → {{six forty-five}}"}]},
            {"type": "lines", "title": "寫完整的回答", "note": "時間寫英文字，句尾加句點。",
             "items": [{"em": "⏰ 6:30", "text": "What time do you get up?　{{I get up at six thirty.}}"},
                       {"em": "🛏️ 其實 10:00 睡", "text": "Do you go to bed at nine?　{{No, I don't.}}"},
                       {"text": "　　　　{{I go to bed at ten.}}"}]},
            recall("錯字複習（只看中文）", QUIZ_REVIEW[kid], cols=3, review=True),
            {"type": "retry", "title": "對完答案：挑最多 3 個錯字，各寫三次", "note": "先照解答一個字母一個字母對好，再寫。", "rows": 3}]},
    ]
    return {"week": "2026-11-23", "file": f"{kid}-2026-11-23_期末考練習_第3週", "title": "期末考練習・第 3 週",
            "focus": "Unit 4 作息片語、時間用英文寫、What time / Do you", "days": days}


for kid in ("jonathan", "albert"):
    open(W + f"\\2026-11-23_{kid}.json", "w", encoding="utf-8").write(json.dumps(week(kid), ensure_ascii=False, indent=1) + "\n")
print("ok")
