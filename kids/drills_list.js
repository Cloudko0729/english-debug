// 所有每日練習的清單（首頁顯示當周、archive 依月份分類都讀這裡）。
// 新增一天只要在這裡 push 一筆 + 放好 drills/daily_<date>.html。
const DRILLS = [
  { day: 1,  date: "2026-06-12", theme: "family",     eng: "Family",         zh: "家庭",   icon: "👨‍👩‍👧" },
  { day: 2,  date: "2026-06-13", theme: "animals",    eng: "Animals",        zh: "動物",   icon: "🐶" },
  { day: 3,  date: "2026-06-14", theme: "food",       eng: "Food",           zh: "食物",   icon: "🍎" },
  { day: 4,  date: "2026-06-15", theme: "school",     eng: "School",         zh: "學校",   icon: "🏫" },
  { day: 5,  date: "2026-06-16", theme: "clothes",    eng: "Clothes",        zh: "衣服",   icon: "👕" },
  { day: 6,  date: "2026-06-17", theme: "weather",    eng: "Weather",        zh: "天氣",   icon: "☀️" },
  { day: 7,  date: "2026-06-18", theme: "body",       eng: "Body",           zh: "身體",   icon: "👀" },
  { day: 8,  date: "2026-06-19", theme: "time",       eng: "Time",           zh: "時間",   icon: "🕐" },
  { day: 9,  date: "2026-06-20", theme: "places",     eng: "Places",         zh: "地點",   icon: "🏪" },
  { day: 10, date: "2026-06-21", theme: "hobbies",    eng: "Hobbies",        zh: "興趣",   icon: "🎨" },
  { day: 11, date: "2026-06-22", theme: "verbs",      eng: "Verbs",          zh: "動作",   icon: "🏃" },
  { day: 12, date: "2026-06-23", theme: "adjectives", eng: "Adjectives",     zh: "形容詞", icon: "📏" },
  { day: 13, date: "2026-06-24", theme: "numbers",    eng: "Numbers",        zh: "數字",   icon: "🔢" },
  { day: 14, date: "2026-06-25", theme: "colors",     eng: "Colors",         zh: "顏色",   icon: "🌈" },
  { day: 15, date: "2026-06-26", theme: "money",      eng: "Money",          zh: "金錢",   icon: "💰" },
  { day: 16, date: "2026-06-27", theme: "feelings",   eng: "Feelings",       zh: "心情",   icon: "😊" },
  { day: 17, date: "2026-06-28", theme: "sports",     eng: "Sports",         zh: "運動",   icon: "⚽" },
  { day: 18, date: "2026-06-29", theme: "jobs",       eng: "Jobs",           zh: "職業",   icon: "💼" },
  { day: 19, date: "2026-06-30", theme: "transport",  eng: "Transportation", zh: "交通",   icon: "🚌" },
  { day: 20, date: "2026-07-01", theme: "nature",     eng: "Nature",         zh: "大自然", icon: "🏞️" },
];
