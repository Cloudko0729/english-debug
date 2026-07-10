# 從 eng_records.txt 探勘維修英文詞彙（unigram+bigram）＋每詞抽 2 個實際片段
# 用法: python tools/records_terms.py "P:/AI/claude/eng_records.txt" "kids/tools/_repair_terms.txt"
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

text = Path(sys.argv[1]).read_text(encoding="utf-8")
records = text.split("\n=====\n")

STOP = set("""the a an and or but of to in on at by for with from as is are was were be been am do does did
done have has had will would can could should may might must this that it its we our you your they them
their he she his her not no yes all any some more most very too only just also so if then than when where
how what which who why there here out up down over under again please ok new old same other each per etc
via need needs needed use used using make makes made take takes taken get gets got go goes went come came
one two three four five six seven eight nine ten first second next last day days week weeks month time
times date today tomorrow yesterday morning afternoon after before during about above below""".split())
NAMES = set("""cloud edison huang henry swtseng alice allen emma ray cwliao wei eva eric lin francis xenia
ernie george lee adam chen wang chang liu yang wu chou tsai kuo hsu sandy nina hanson jimmy mark wayne
kevin peter david jason ryan tom amy jerry vivian tina angel joyce sam andy ken leo max
mon tue wed thu fri sat sun jan feb mar apr may jun jul aug sep oct nov dec""".split())

uni = Counter()
bi = Counter()
samples = defaultdict(list)

def clean_tokens(s):
    toks = []
    for w in re.findall(r"[A-Za-z]+", s):
        lw = w.lower()
        if len(lw) < 3 or lw in STOP or lw in NAMES:
            continue
        toks.append(lw)
    return toks

for rec in records:
    # 切成行、去掉日期戳
    for line in rec.split("\n"):
        line = re.sub(r"\d{4}-\d{2}-\d{2}\s*::\s*", "", line).strip()
        line = re.sub(r"\[[^\]]{1,20}\]", "", line)          # 去掉 [工程師名] 標記
        if not line or "負責人變更" in line:
            continue
        toks = clean_tokens(line)
        seen_here = set()
        for t in toks:
            uni[t] += 1
            if t not in seen_here and len(samples[t]) < 2 and 10 < len(line) < 120:
                samples[t].append(line)
                seen_here.add(t)
        for a, b in zip(toks, toks[1:]):
            bi[a + " " + b] += 1

out = ["=== UNIGRAM TOP 250 ==="]
for w, c in uni.most_common(250):
    ex = samples[w][0] if samples[w] else ""
    out.append(f"{w}\t{c}\t{ex[:90]}")
out.append("\n=== BIGRAM TOP 120 ===")
for w, c in bi.most_common(120):
    if c >= 5:
        out.append(f"{w}\t{c}")
Path(sys.argv[2]).write_text("\n".join(out), encoding="utf-8")
print(f"unigram {len(uni)} 種 / bigram {len(bi)} 種 -> {sys.argv[2]}")
print("Top 30:", ", ".join(w for w, _ in uni.most_common(30)))
