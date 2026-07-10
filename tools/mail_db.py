# 建立信件場景資料庫（存 P 槽，不進 repo）
# 掃描 mail_text → 每封標場景標籤、抽 cloudko 署名段的英文行 → mail_db.json + 統計
# 用法: python tools/mail_db.py "P:/AI/claude/mail_text" "P:/AI/claude/mail_db.json"
import json
import re
import sys
from collections import Counter
from pathlib import Path

SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])

# 場景標籤（實務分類，對應 26 週課綱）
TAGS = {
    "quotation":    r"報價|quotation|quote|repair cost|費用|價格|price",
    "lead_time":    r"交期|lead ?time|ETA|delivery date|deliver|何時|交貨",
    "rma":          r"RMA|退修|送修|寄回|return.*repair|send.*back",
    "status":       r"進度|status|checking|under repair|維修中|測試中|update you",
    "parts":        r"料件|備品|零件|part number|P/N|PN|spare|尋料|찾|代尋",
    "abnormal":     r"異常|fail|error|symptom|故障|不良|重現|cannot|issue",
    "shipment":     r"出貨|ship|shipment|tracking|寄出|貨運|包裝",
    "warranty":     r"保固|warranty|保修",
    "delay":        r"delay|延遲|延後|apolog|sorry|抱歉",
    "follow_up":    r"follow.?up|reminder|催|回覆確認|尚未回",
    "visit":        r"來訪|參觀|拜訪|visit|來廠|導覽",
    "meeting":      r"會議|meeting|視訊|con.?call|demo",
    "inquiry":      r"詢問|詢價|inquiry|enquir|請問|確認.*需求",
    "verification": r"驗證|驗収|驗收|verify|verification|測試報告|test report",
}

def en_lines_of(text: str):
    """抽純英文行（≥4 個英文字、無中文）"""
    out = []
    for line in text.split("\n"):
        s = line.strip()
        if not s or re.search(r"[一-鿿]", s):
            continue
        words = re.findall(r"[A-Za-z']{2,}", s)
        if len(words) >= 4 and not s.startswith((">", "http", "From:", "To:", "Sent:", "Subject:", "Cc:")):
            out.append(s)
    return out


db = []
tag_count = Counter()
for f in sorted(SRC.glob("*.txt")):
    text = f.read_text(encoding="utf-8")
    m = re.match(r"Subject: (.*)\nDate: (.*)\nTo: (.*)\n=+\n", text)
    subject = m.group(1) if m else f.stem
    date = m.group(2) if m else ""
    body = text[m.end():] if m else text
    tags = [t for t, pat in TAGS.items() if re.search(pat, subject + "\n" + body, re.I)]
    if not tags:
        tags = ["other"]
    for t in tags:
        tag_count[t] += 1
    en = en_lines_of(body)
    db.append({
        "file": f.name, "subject": subject.replace("Fwd: ", ""), "date": date,
        "tags": tags, "en_lines": en[:60], "en_count": len(en),
        "chars": len(body),
    })

OUT.write_text(json.dumps({"built": "2026-07-10", "mails": db}, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"db: {len(db)} 封 -> {OUT}")
print("場景分布：")
for t, c in tag_count.most_common():
    print(f"  {t:14s} {c}")
print(f"英文行總數：{sum(x['en_count'] for x in db)}")
