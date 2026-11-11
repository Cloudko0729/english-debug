"""期末考每週練習卷：weeks/<週一日期>.json → 練習卷 PDF（一天一頁，共 5 頁）＋解答 PDF。

用法：python kids/tools/final_practice/build.py kids/tools/final_practice/weeks/2026-11-09.json [輸出資料夾]
輸出資料夾預設 D:\\國小\\國小六上-期末考\\每週練習（不進 repo）。
每頁固定 A4 高度，內容超出會報錯（要刪題或縮短），確保印出來一天剛好一張。
"""
import html, json, os, re, sys
from playwright.sync_api import sync_playwright

E = html.escape
BLANK = re.compile(r"\{\{(.+?)\}\}")


def four(ans="", show=False, wide=False):
    """四線格；解答版把答案用紅字寫進去"""
    txt = f'<span class="ans">{E(ans)}</span>' if show and ans else ""
    return f'<div class="fl{" wide" if wide else ""}"><i class="l2"></i><i class="l3"></i>{txt}</div>'


def blank(ans, show):
    w = max(5.5, len(ans) * 0.62 + 1)
    inner = E(ans) if show else "&nbsp;"
    return f'<span class="bl{" on" if show else ""}" style="min-width:{w:.1f}em">{inner}</span>'


def fill_text(text, show):
    out, last = [], 0
    for m in BLANK.finditer(text):
        out.append(E(text[last:m.start()])); out.append(blank(m.group(1), show)); last = m.end()
    out.append(E(text[last:]))
    return "".join(out)


def sec_spell(s, show):
    rows = []
    for it in s["items"]:
        tip = f'<div class="tip">{E(it["tip"])}</div>' if it.get("tip") else ""
        rows.append(f'''<div class="srow"><div class="cue"><span class="em">{it.get("em", "")}</span><span class="zh">{E(it["zh"])}</span></div>
          <div class="model">{E(it["en"])}{tip}</div>{four(it["en"], show)}{four(it["en"], show)}</div>''')
    return "".join(rows)


def sec_recall(s, show):
    cols = s.get("cols", 2 if len(s["items"]) > 3 else 1)
    cells = []
    for it in s["items"]:
        first = f'<span class="first">{E(it["en"][0])}…</span>' if it.get("first") else ""
        cells.append(f'<div class="rc"><div class="cue"><span class="zh">{E(it["zh"])}</span>{first}</div>{four(it["en"], show)}</div>')
    return f'<div class="grid c{cols}">{"".join(cells)}</div>'


def sec_vowel(s, show):
    cells = []
    for it in s["items"]:
        b = f'<span class="vb">{E(it["ans"]) if show else "&nbsp;"}</span>'
        cells.append(f'<div class="vw"><span class="em">{it["em"]}</span><span class="zh">{E(it["zh"])}</span>'
                     f'<span class="word">{E(it["pre"])}{b}{E(it["post"])}</span></div>')
    opts = "　".join(E(o) for o in s["opts"])
    return f'<div class="opts">選：{opts}</div><div class="grid c3">{"".join(cells)}</div>'


def sec_lines(s, show):
    h = ""
    if s.get("box"):
        h += '<div class="box">' + "　".join(E(w) for w in s["box"]) + "</div>"
    if s.get("head"):
        h += f'<div class="ln head">{E(s["head"])}</div>'
    for it in s["items"]:
        em = f'<span class="em">{it["em"]}</span>' if it.get("em") else ""
        h += f'<div class="ln">{em}{fill_text(it["text"], show)}</div>'
    return h


def sec_circle(s, show):
    h = ""
    for i, it in enumerate(s["items"], 1):
        def opt(m):
            parts = [p.strip() for p in m.group(1).split("/")]
            return "( " + " / ".join(f'<span class="{"ring" if show and p == it["ans"] else ""}">{E(p)}</span>' for p in parts) + " )"
        body = re.sub(r"\(\s*([^)]+?)\s*\)", opt, E(it["text"]))
        h += f'<div class="ln">{i}. {body}</div>'
    return f'<div class="grid c{s.get("cols", 2)} circ">{h}</div>'


def sec_sort(s, show):
    words = "　".join(f'<b>{E(w)}</b> <small>{E(z)}</small>' for w, z, _ in s["words"])
    n = max(sum(1 for _, _, k in s["words"] if k == c) for c in s["cols"])
    rows = []
    for c in s["cols"]:
        got = [w for w, _, k in s["words"] if k == c] + [""] * n
        rows.append(f'<div class="srow"><div class="sh">{E(c)}</div>{"".join(four(w, show) for w in got[:n])}</div>')
    return f'<div class="words">{words}</div>{"".join(rows)}'


def sec_copy(s, show):
    return "".join(f'<div class="model line">{E(t)}</div>{four(t, show, True)}' for t in s["items"])


def sec_reorder(s, show):
    return "".join(f'<div class="chunks">{" ／ ".join(E(c) for c in it["chunks"])}</div>{four(it["ans"], show, True)}' for it in s["items"])


def sec_retry(s, show):
    return "".join(four(wide=True) for _ in range(s.get("rows", 3)))


SECS = dict(spell=sec_spell, recall=sec_recall, vowel=sec_vowel, lines=sec_lines, circle=sec_circle,
            sort=sec_sort, copy=sec_copy, reorder=sec_reorder, retry=sec_retry)


def page(wk, d, n, show):
    body = ""
    for i, s in enumerate(d["sections"]):
        note = f'<span class="note">{E(s["note"])}</span>' if s.get("note") else ""
        tag = ' <span class="rv">複習</span>' if s.get("review") else ""
        body += f'<section><h2><b>{chr(65 + i)}</b> {E(s["title"])}{tag}{note}</h2>{SECS[s["type"]](s, show)}</section>'
    m, dd = d["date"][5:7].lstrip("0"), d["date"][8:].lstrip("0")
    key = '<span class="key">解答</span>' if show else ""
    return f'''<div class="page"><div class="inner">
      <header><div><div class="t">{E(wk["title"])}　{E(d.get("tag") or f"Day {n}")}　{m}/{dd}（{E(d["label"][-1])}）{key}</div><div class="f">{E(wk["focus"])}</div></div>
        <div class="who">姓名 ＿＿＿＿＿＿　開始 ＿＿:＿＿　結束 ＿＿:＿＿</div></header>
      {body}
      <footer>{E(d["footer"]) if d.get("footer") else "錯的字圈起來，明天再寫一次。" if not d.get("test") else "對完答案，把錯的字寫在 E 欄。"}　家長簽名 ＿＿＿＿＿＿</footer>
    </div></div>'''


CSS = """
@page { size: A4; margin: 0 }
* { box-sizing: border-box }
body { margin: 0; font-family: "Microsoft JhengHei", sans-serif; color: #222; -webkit-print-color-adjust: exact; print-color-adjust: exact }
.page { width: 210mm; height: 297mm; padding: 10mm 12mm 9mm; page-break-after: always; overflow: hidden }
.inner { height: 100%; display: flex; flex-direction: column; gap: 2.4mm }
header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1.2mm solid #2f7d4f; padding-bottom: 2mm }
header .t { font-size: 14pt; white-space: nowrap; font-weight: 700 } header .f { font-size: 9.5pt; color: #555; margin-top: .5mm }
header .who { font-size: 10pt; white-space: nowrap }
.key { background: #c0392b; color: #fff; border-radius: 2mm; padding: 0 2mm; font-size: 11pt; margin-left: 2mm }
footer { margin-top: auto; font-size: 9.5pt; color: #555; border-top: .3mm solid #ccc; padding-top: 1.5mm }
h2 { font-size: 11.5pt; margin: 0 0 1.5mm; display: flex; align-items: baseline; gap: 2mm; flex-wrap: wrap }
h2 b { background: #2f7d4f; color: #fff; border-radius: 50%; width: 6mm; height: 6mm; display: inline-flex; align-items: center; justify-content: center; font-size: 9.5pt }
.rv { background: #f39c12; color: #fff; font-size: 8.5pt; border-radius: 1.5mm; padding: 0 1.5mm }
.note { font-size: 8.5pt; color: #666; font-weight: 400 }
.en, .model, .ans, .ln, .chunks, .words b, .vw .word, .box, .opts, .first, .sh { font-family: "Andika", "Comic Sans MS", sans-serif }
.fl { position: relative; height: 9.5mm; border-top: .25mm solid #888; border-bottom: .25mm solid #888; flex: 1; min-width: 0 }
.fl .l2 { position: absolute; left: 0; right: 0; top: 33.3%; border-top: .2mm dashed #aaa }
.fl .l3 { position: absolute; left: 0; right: 0; top: 66.6%; border-top: .3mm solid #e08a8a }
.fl .ans { position: absolute; left: 2mm; bottom: 2.75mm; font-size: 12.5pt; line-height: 1; color: #c0392b }
.fl.wide { flex: none; width: 100%; margin-bottom: 1.5mm }
.srow { display: flex; align-items: center; gap: 2.5mm; margin-bottom: 1.2mm }
.cue { width: 27mm; display: flex; align-items: center; gap: 1.5mm; flex: none }
.em { font-family: "Segoe UI Emoji", sans-serif; font-size: 15pt; margin-right: 1mm }
.zh { font-size: 10.5pt }
.model { width: 33mm; flex: none; font-size: 15pt }
.model .tip { font-family: "Microsoft JhengHei"; font-size: 7.5pt; color: #888; margin-top: .3mm }
.model.line { width: auto; font-size: 13pt; margin: 0 }
.grid { display: grid; gap: 1.5mm 5mm } .c1 { grid-template-columns: 1fr } .c2 { grid-template-columns: 1fr 1fr } .c3 { grid-template-columns: 1fr 1fr 1fr }
.rc { display: flex; align-items: center; gap: 2mm } .rc .cue { width: auto; min-width: 16mm }
.c3 .rc .cue { min-width: 14mm }
.first { font-size: 12pt; color: #888 }
.vw { display: flex; align-items: center; gap: 1.5mm; font-size: 10.5pt; padding: 1mm 0 }
.vw .word { font-size: 17pt; margin-left: auto; margin-right: 4mm }
.vb { display: inline-block; min-width: 11mm; border-bottom: .4mm solid #333; text-align: center; margin: 0 .8mm; color: #c0392b }
.opts { font-size: 11pt; margin-bottom: 1mm }
.ln { font-size: 13pt; line-height: 1.8; display: flex; align-items: baseline; flex-wrap: wrap; white-space: pre-wrap }
.ln.head { color: #444 }
.bl { display: inline-block; border-bottom: .35mm solid #333; margin: 0 1mm; text-align: center; line-height: 1.3 }
.bl.on { color: #c0392b }
.box { border: .4mm dashed #2f7d4f; border-radius: 2mm; padding: 1.2mm 3mm; font-size: 13pt; display: inline-block; margin-bottom: 1mm; align-self: flex-start }
.ring { outline: .5mm solid #c0392b; outline-offset: .3mm; border-radius: 50%; color: #c0392b }
.words { font-size: 11pt; margin-bottom: 1.5mm } .words b { font-size: 14pt; font-weight: 400 } .words small { color: #777 }
.scol { border: .3mm solid #bbb; border-radius: 2mm; padding: 1mm 3mm 0 } .sh { width: 12mm; flex: none; text-align: center; font-size: 15pt; color: #2f7d4f }
.scol .fl { flex: none; width: 100%; margin-bottom: 1.5mm }
.chunks { font-size: 13pt; margin: 1mm 0 }
.circ .ln { font-size: 12pt }
section { display: flex; flex-direction: column }
"""


def build(path, out_dir):
    wk = json.load(open(path, encoding="utf-8"))
    os.makedirs(out_dir, exist_ok=True)
    # file：自訂檔名（例如個人化的週末複習卷），不給就用「週一日期_標題」
    base = os.path.join(out_dir, wk.get("file") or f'{wk["week"]}_{wk["title"].replace("・", "_").replace(" ", "")}')
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        for show, suffix in ((False, ""), (True, "_解答")):
            pages = "".join(page(wk, d, i + 1, show) for i, d in enumerate(wk["days"]))
            doc = f'''<!doctype html><html><head><meta charset="utf-8">
              <link href="https://fonts.googleapis.com/css2?family=Andika&display=block" rel="stylesheet">
              <style>{CSS}</style></head><body>{pages}</body></html>'''
            pg = b.new_page()
            pg.set_content(doc, wait_until="networkidle")
            pg.evaluate("document.fonts.ready")
            over = pg.evaluate("""[...document.querySelectorAll('.inner')].map((e, i) => e.scrollHeight > e.clientHeight + 1 ? (i + 1) + ':' + (e.scrollHeight - e.clientHeight) + 'px' : '').filter(Boolean)""")
            andika = pg.evaluate("document.fonts.check('16px Andika')")
            if os.environ.get("SHOT"):
                pg.set_viewport_size({"width": 794, "height": 1123})
                for i in range(len(wk["days"])):
                    pg.locator(".page").nth(i).screenshot(path=os.path.join(os.environ["SHOT"], f"day{i + 1}{suffix and '_key'}.png"))
            if over:
                raise SystemExit(f"內容超出一頁：{over}（{suffix or '練習卷'}）")
            pg.pdf(path=base + suffix + ".pdf", format="A4", print_background=True, prefer_css_page_size=True)
            pg.close()
            print(base + suffix + ".pdf", "Andika" if andika else "（Andika 沒載到，改用 Comic Sans）")
        b.close()


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else r"D:\國小\國小六上-期末考\每週練習")
