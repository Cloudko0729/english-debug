# 解析 .eml 寄件備份 → 純文字（不含附件）。輸出到 repo 外，避免客戶資料進公開 git。
# 用法: python tools/mail_extract.py "P:/AI/claude/mail" "P:/AI/claude/mail_text"
import email
import email.policy
import html
import re
import sys
from pathlib import Path

SRC = Path(sys.argv[1])
DST = Path(sys.argv[2])
DST.mkdir(parents=True, exist_ok=True)


def html_to_text(h: str) -> str:
    h = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", "", h)
    h = re.sub(r"(?i)<br\s*/?>", "\n", h)
    h = re.sub(r"(?i)</(p|div|tr|li|h[1-6]|table)>", "\n", h)
    h = re.sub(r"<[^>]+>", "", h)
    h = html.unescape(h)
    h = re.sub(r"[ \t ]+", " ", h)
    h = re.sub(r"\n{3,}", "\n\n", h)
    return h.strip()


def body_text(msg) -> str:
    plains, htmls = [], []
    for part in msg.walk():
        if part.is_multipart():
            continue
        cd = str(part.get("Content-Disposition") or "")
        if "attachment" in cd.lower():
            continue
        ct = part.get_content_type()
        if ct not in ("text/plain", "text/html"):
            continue
        try:
            txt = part.get_content()
        except Exception:
            payload = part.get_payload(decode=True) or b""
            for enc in ("utf-8", "big5", "cp950", "gb18030", "latin-1"):
                try:
                    txt = payload.decode(enc)
                    break
                except Exception:
                    continue
            else:
                continue
        (plains if ct == "text/plain" else htmls).append(txt)
    if plains:
        return "\n".join(plains)
    if htmls:
        return "\n".join(html_to_text(x) for x in htmls)
    return ""


ok = fail = 0
for f in sorted(SRC.glob("*.eml")):
    try:
        msg = email.message_from_bytes(f.read_bytes(), policy=email.policy.default)
        text = body_text(msg)
        head = (
            f"Subject: {msg.get('Subject', '')}\n"
            f"Date: {msg.get('Date', '')}\n"
            f"To: {msg.get('To', '')}\n"
            + "=" * 60 + "\n"
        )
        out = DST / (f.stem[:120] + ".txt")
        out.write_text(head + text, encoding="utf-8")
        ok += 1
    except Exception as e:
        print(f"FAIL {f.name}: {e}")
        fail += 1
print(f"done: {ok} ok, {fail} fail -> {DST}")
