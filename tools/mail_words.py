# 從 mail_db.json 統計高頻英文字（排除停用詞/人名/公司名）
# 用法: python tools/mail_words.py "P:/AI/claude/mail_db.json" "P:/AI/claude/mail_words.txt"
import json
import re
import sys
from collections import Counter
from pathlib import Path

db = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))

STOP = set("""the a an and or but if then than so of to in on at by for with from as is are was were be been
being am do does did done have has had having will would can could should may might must shall this that
these those it its he she they them their we our you your i me my mine us him her his who which what when
where why how all any some no not only very too also just there here out up down over under again more most
other into about after before between during without within don didn doesn isn aren wasn weren won can't cannot
its it's i'm we're you're they're that's please dear best regards thanks thank hi hello sincerely
mr mrs ms sir madam ok yes attachment attached refer following per via etc am pm""".split())
NAMES = set("""cloud nina hanson sandy george fixwell fix well terapower ting mei ho amy jimmy mark
wayne boko diron nemo taiwan hsinchu january february march april may june july august september october
november december monday tuesday wednesday thursday friday saturday sunday
kyec chipbond chipmos sigurd cypress allenc allen alice cloudko com tw exe tel www http https cpsm
vitrox rockwell teradyne advantest agilent keysight lecroy tektronix hp ase spil powertech kingston
micron nanya winbond realtek novatek mediatek tsmc umc lily kevin peter david eric jason ryan
address ltd corp inc dept division lane road city dist east west north south
ext fax mobile phone email subject sent cc bcc fwd re original message forwarded wrote""".split())

cnt = Counter()
for m in db["mails"]:
    for line in m["en_lines"]:
        for w in re.findall(r"[a-zA-Z']+", line.lower()):
            w = w.strip("'")
            if len(w) < 3 or w in STOP or w in NAMES:
                continue
            if not w.isalpha():
                continue
            cnt[w] += 1

out = [f"{w}\t{c}" for w, c in cnt.most_common(250) if c >= 3]
Path(sys.argv[2]).write_text("\n".join(out), encoding="utf-8")
print(f"高頻字 {len(out)} 個 -> {sys.argv[2]}")
print("Top 30:", ", ".join(w for w, _ in cnt.most_common(30)))
