# 用語音辨識檢查音檔「唸的內容」對不對，不只是檔案存不存在。
#
# 用法:
#   node kids/tools/list_drill_audio.js 2026-10-05 ... > list.json
#   python kids/tools/verify_audio_asr.py list.json
#
# 每個音檔用 faster-whisper (small.en) 轉成文字，跟原文正規化後比對：
#   - 句子：逐字比對，相似度 < 0.85 就列出
#   - 單字／短片語：辨識結果必須等於原文，或在 SAME_SOUND 白名單裡
# 另外檢查：檔案不存在、找不到原文、音長異常（太短可能是空檔，太長可能唸了別的東西）。
#
# 語音辨識會錯，所以這是篩檢不是判決：列出來的要人聽過再決定。
# 但「檔案在、內容卻是上一版句子」這種錯，它一定抓得到。
import json, re, sys, difflib
from pathlib import Path

# 同音或辨識常見寫法：辨識成右邊任何一個都算對
SAME_SOUND = {
    "email": {"email", "e mail"}, "e-mail": {"email", "e mail"},
    "ink": {"ink", "inc"}, "t-shirt": {"t shirt", "tshirt"},
    "the uk": {"the uk", "uk"}, "the usa": {"the usa", "usa"},
    "mrt": {"mrt", "m r t"},
    "ago": {"ago", "a go"},
}

def norm(s):
    s = s.lower().replace("’", "'").replace("-", "")      # e-mail = email
    s = re.sub(r"[^a-z0-9' ]+", " ", s)
    s = s.replace("'", "")
    return re.sub(r"\s+", " ", s).strip()

NUM = {"thirty five": "35", "thirty-five": "35", "twenty": "20", "ten": "10", "three": "3", "two": "2",
       "seven": "7", "six": "6", "twelve": "12", "four": "4", "five": "5", "one": "1"}
def norm_num(s):
    s = norm(s)
    for w, d in sorted(NUM.items(), key=lambda x: -len(x[0])):
        s = re.sub(r"\b" + w + r"\b", d, s)
    return s

def main():
    sys.stdout.reconfigure(encoding="utf-8")
    items = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    from faster_whisper import WhisperModel
    import soundfile as sf
    model = WhisperModel("small.en", device="cpu", compute_type="int8")
    bad, ok = [], 0
    for it in items:
        f, exp = Path(it["file"]), it.get("expected")
        tag = f"{it['kind']:9s} {it['rel']}"
        if not f.exists():
            bad.append((tag, "檔案不存在", exp, "")); continue
        if not exp:
            bad.append((tag, "找不到原文，無法比對", "", "")); continue
        try:
            dur = sf.info(str(f)).duration
        except Exception:
            dur = None
        segs, _ = model.transcribe(str(f), language="en", beam_size=5, vad_filter=False)
        got = " ".join(s.text.strip() for s in segs).strip()
        e, g = norm_num(exp), norm_num(got)
        words = len(e.split())
        # 只唸一個字時，辨識器常自己補冠詞（"A leaf."、"The comic"）；原文沒有冠詞就拿掉再比
        g0 = g   # 拿掉冠詞前的樣子：ago 會被聽成 "a go"，拿掉 a 就變成 go 了
        if words <= 3 and not re.match(r"^(a|an|the) ", e):
            g = re.sub(r"^(a|an|the) ", "", g)
        if words <= 3:
            good = (g == e or g in SAME_SOUND.get(e, set()) or g.rstrip("s") == e.rstrip("s")
                    or g.replace(" ", "") == e.replace(" ", "") or g0.replace(" ", "") == e.replace(" ", ""))
            score = 1.0 if good else difflib.SequenceMatcher(None, e, g).ratio()
            if not good:
                bad.append((tag, f"單字不符（{score:.2f}）", exp, got)); continue
        else:
            score = difflib.SequenceMatcher(None, e.split(), g.split()).ratio()
            if score < 0.85:
                bad.append((tag, f"句子相似度 {score:.2f}", exp, got)); continue
        # 音長：每個字大約 0.25–0.9 秒（Kokoro speed 0.9）
        if dur is not None and words:
            per = dur / words
            if per < 0.15 or per > 2.5:
                bad.append((tag, f"音長異常 {dur:.1f}s／{words} 字", exp, got)); continue
        ok += 1

    # 複查：小模型標記的，改用大模型、並在前面接一段已知的引導句「The next word is」。
    # 單獨一個字沒有上下文，辨識器很容易把 title 聽成 Tidal、pork 聽成 Bork；
    # 接了引導句，後半段仍是原檔的聲音，但辨識器知道接下來是一個字。
    # 兩個模型都對不上，才算真的要人去聽。
    if bad:
        import numpy as np, librosa
        big = WhisperModel("mobiuslabsgmbh/faster-whisper-large-v3-turbo", device="cpu", compute_type="int8")
        carrier = Path(__file__).with_name("asr_carrier.mp3")
        car = librosa.load(str(carrier), sr=16000, mono=True)[0] if carrier.exists() else None
        by_rel = {i["rel"]: i for i in items}
        still = []
        for tag, why, exp, got in bad:
            it = by_rel.get(tag.split()[-1])
            if not it or not exp or not Path(it["file"]).exists():
                still.append((tag, why, exp, got)); continue
            y = librosa.load(it["file"], sr=16000, mono=True)[0]
            e = norm_num(exp); short = len(e.split()) <= 3
            if short and car is not None:
                y = np.concatenate([car, np.zeros(3200, dtype=np.float32), y])
            segs, _ = big.transcribe(y, language="en", beam_size=5)
            got2 = " ".join(x.text.strip() for x in segs).strip()
            g2 = norm_num(got2)
            if short:
                g2 = re.sub(r"^the next word is ", "", g2)
                g20 = g2
                if not re.match(r"^(a|an|the) ", e):
                    g2 = re.sub(r"^(a|an|the) ", "", g2)
                passed = (g2 == e or g2 in SAME_SOUND.get(e, set())
                          or g20.replace(" ", "") == e.replace(" ", ""))
            else:
                passed = difflib.SequenceMatcher(None, e.split(), g2.split()).ratio() >= 0.85
            if passed:
                ok += 1
            else:
                still.append((tag, why, exp, got + "　／大模型複查：" + got2))
        bad = still

    print(f"\n檢查 {len(items)} 個音檔：通過 {ok}，要看的 {len(bad)}")
    for tag, why, exp, got in bad:
        print(f"\n✗ {tag}\n   原因：{why}\n   原文：{exp}\n   聽到：{got}")
    sys.exit(1 if bad else 0)

if __name__ == "__main__":
    main()
