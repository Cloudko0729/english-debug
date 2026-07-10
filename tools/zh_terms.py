# 中文維修詞彙探勘：從紀錄/信件抽高頻中文詞（2~4 字 n-gram，長詞優先去包含）＋樣本句
# 用法: python tools/zh_terms.py "P:/AI/claude/eng_records_all.txt" "P:/AI/claude/mail_text" "kids/tools/_zh_terms.txt"
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

GENERIC = set("""目前 已經 還沒 沒有 可以 需要 進行 處理 完成 確認 這個 那個 我們 你們 他們 今天 明天 昨天
以及 或是 但是 因為 所以 如果 請問 謝謝 麻煩 幫忙 一下 是否 有無 部分 狀況 情況 問題 相關 資料 資訊
下週 上週 本週 下午 上午 預計 大約 左右 之後 之前 以上 以下 其他 另外 附件 如附 請參 參閱 收到 回覆
工程 負責 變更 專案 異常 標記 客戶 廠商 原廠 先生 小姐 通知 安排 時間 日期 數量 費用 報告""".split())
NAMES = set("張爗 李丰毓 邱 黃 陳 林 吳 劉 蔡 許 鄭 王 洪 郭 曾 廖 賴 周 葉 蘇".split())

zh_re = re.compile(r"[一-鿿]+")
cnt = Counter()
samples = defaultdict(list)

def feed(text):
    for line in text.split("\n"):
        line = re.sub(r"\d{4}-\d{2}-\d{2}\s*::\s*", "", line).strip()
        line = re.sub(r"\[[^\]]{1,20}\]", "", line)
        if not line or "負責人變更" in line:
            continue
        for seg in zh_re.findall(line):
            for n in (2, 3, 4):
                for i in range(len(seg) - n + 1):
                    g = seg[i:i + n]
                    if g in GENERIC or any(ch in NAMES for ch in g):
                        continue
                    cnt[g] += 1
                    if len(samples[g]) < 2 and 8 < len(line) < 100:
                        samples[g].append(line)

feed(Path(sys.argv[1]).read_text(encoding="utf-8"))
for f in Path(sys.argv[2]).glob("*.txt"):
    feed(f.read_text(encoding="utf-8"))

# 長詞優先：若長詞頻率 >= 短詞的 60%，砍掉被包含的短詞
top = [w for w, c in cnt.most_common(3000) if c >= 20]
keep = []
for w in sorted(top, key=len, reverse=True):
    if any(w in k for k in keep if len(k) > len(w) and cnt[k] >= cnt[w] * 0.6):
        continue
    keep.append(w)
keep = [w for w in keep if not any(w != k and w in k and cnt[k] >= cnt[w] * 0.6 for k in keep)]
keep.sort(key=lambda w: -cnt[w])

out = []
for w in keep[:250]:
    ex = samples[w][0] if samples[w] else ""
    out.append(f"{w}\t{cnt[w]}\t{ex[:70]}")
Path(sys.argv[3]).write_text("\n".join(out), encoding="utf-8")
print(f"中文詞 {len(keep)} 個（取前 250）-> {sys.argv[3]}")
print("Top 30:", " / ".join(keep[:30]))
