#!/usr/bin/env python3
"""Üretilen .docx'in JSCMT yazar yönergesine ve şablonuna uyumunu denetler.

    python3 check.py [Unal_JSCMT_Manuscript.docx]

Her kural OK/HATA olarak yazılır; sonda sarı işaretli (yazarın dolduracağı) yerler listelenir.
Şekil ve tablolar metnin içinde olduğundan atıf, yerleşim ve altyazı kuralları belge sırasıyla denetlenir.
"""
import os
import re
import sys
import zipfile

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.paragraph import Paragraph
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, sys.argv[1] if len(sys.argv) > 1 else "Unal_JSCMT_Manuscript.docx")
doc = Document(PATH)
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
M = "{http://schemas.openxmlformats.org/officeDocument/2006/math}"

items = []                                         # belge sırası: ("p", Paragraph) | ("t", Table)
for el in doc.element.body.iterchildren():
    if el.tag == W + "p":
        items.append(("p", Paragraph(el, doc._body)))
    elif el.tag == W + "tbl":
        items.append(("t", Table(el, doc._body)))

res = []


def ok(name, cond, detail=""):
    res.append((bool(cond), name, detail))


def runs(p):
    return [r for r in p.runs if r.text.strip()]


def allrun(p, pred):
    rs = runs(p)
    return bool(rs) and all(pred(r) for r in rs)


def sz(r):
    return r.font.size.pt if r.font.size else None


tnr = lambda r: r.font.name == "Times New Roman"
txt = lambda p: p.text.replace(" ", " ")
is_img = lambda p: bool(p._p.findall(".//" + W + "drawing"))
is_eq = lambda p: bool(p._p.findall(".//" + M + "oMath"))
is_cap = lambda p: bool(re.match(r"^(Table \d+\.|Fig\. \d+\.)", txt(p)))

# ------------------------------------------------------------------ sayfa
s = doc.sections[0]
ok("A4 sayfa (21 × 29,7 cm)", abs(s.page_width.cm - 21.0) < 0.05 and abs(s.page_height.cm - 29.7) < 0.05)
ok("Kenar boşlukları şablondaki gibi (üst 2,5 / yanlar 1,5 / alt 1,0 cm)",
   abs(s.top_margin.cm - 2.5) < 0.05 and abs(s.left_margin.cm - 1.5) < 0.05
   and abs(s.right_margin.cm - 1.5) < 0.05 and abs(s.bottom_margin.cm - 1.0) < 0.05)
ok("İlk sayfada sayfa numarası yok", s.different_first_page_header_footer)
ok("Belge dili en-GB", doc.styles["Normal"].element.xpath("string(.//w:lang/@w:val)") == "en-GB")

paras = [p for k, p in items if k == "p"]
idx = {txt(p).strip(): i for i, p in enumerate(paras) if txt(p).strip()}

# ------------------------------------------------------------------ başlık sayfası
title_p = next(p for p in paras if p.style.name == "Title")
ok("Başlık TNR 14 pt kalın ortalı",
   allrun(title_p, lambda r: tnr(r) and sz(r) == 14 and r.bold) and title_p.alignment == WD_ALIGN_PARAGRAPH.CENTER)
ok("Başlık kısa (≤ 20 sözcük) ve kaynak/kısaltma yok",
   len(txt(title_p).split()) <= 20 and "[" not in txt(title_p), f"{len(txt(title_p).split())} sözcük")
author_p = paras[paras.index(title_p) + 1]
ok("Yazar satırı TNR 11 pt kalın italiksiz ortalı",
   allrun(author_p, lambda r: tnr(r) and sz(r) == 11 and r.bold and not r.italic)
   and author_p.alignment == WD_ALIGN_PARAGRAPH.CENTER, txt(author_p))
ok("Yazar adında üst simge kurum harfi", any(r.font.superscript and re.fullmatch(r"[a-z](,[a-z])*", r.text) for r in author_p.runs))
ok("Yazışma yazarı yıldızı dipnotla", bool(author_p._p.findall(".//" + W + "footnoteReference")))
z = zipfile.ZipFile(PATH)
fn = re.sub(r"<[^>]+>", "", z.read("word/footnotes.xml").decode("utf-8"))
ok("Dipnot: Tel., fax, e-mail, ORCID", all(k in fn for k in ("Tel.", "fax", "e-mail", "ORCID")))
ok("Dipnot simgesi yıldız (chicago)", 'w:numFmt w:val="chicago"' in z.read("word/document.xml").decode("utf-8"))
running = next(txt(p) for p in paras if txt(p).startswith("Running title:")).split(":", 1)[1].strip()
ok("Kısa başlık ≤ 80 karakter", len(running) <= 80, f"{len(running)} karakter")
aff = [p for p in paras if "Türkiye" in txt(p) and p.alignment == WD_ALIGN_PARAGRAPH.CENTER]
ok("Kurum satırları bölüm, üniversite, şehir ve ülke içeriyor", len(aff) == 2)

# ------------------------------------------------------------------ özet ve anahtar sözcükler
abs_p = paras[idx["Abstract"] + 1]
ok("Özet TNR 9 pt, kalın ve italik değil", allrun(abs_p, lambda r: tnr(r) and sz(r) == 9 and not r.bold and not r.italic))
nw = len(txt(abs_p).split())
ok("Özet ≤ 300 sözcük", nw <= 300, f"{nw} sözcük")
ok("Özet atıfsız", not re.search(r"\[\d|\{@", txt(abs_p)))
ok("Özette MDF tanımlı (ilk geçişte)", "medium-density fibreboard (MDF)" in txt(abs_p)
   and txt(abs_p).index("medium-density fibreboard (MDF)") < txt(abs_p).index("MDF") + 1)
kw_p = next(p for p in paras if txt(p).startswith("Keywords:"))
kws = [k.strip() for k in txt(kw_p).split(":", 1)[1].split(";") if k.strip()]
ok("Anahtar sözcük 4–6 adet, noktalı virgülle", 4 <= len(kws) <= 6 and ";" in txt(kw_p), f"{len(kws)} adet")
ok("Anahtar sözcükler TNR 10 pt, kalın ve italik değil", allrun(kw_p, lambda r: tnr(r) and sz(r) == 10 and not r.bold and not r.italic))

# ------------------------------------------------------------------ bölümler
h1 = [txt(p).strip() for p in paras if p.style.name == "Heading 1"]
expected = ["1. Introduction", "2. Materials and Methods", "3. Results and Discussion", "4. Conclusion",
            "Acknowledgements", "Conflicts of Interest", "Author contributions", "Data availability statement",
            "Financial Disclosure", "Peer-review", "Use of AI for writing assistance", "Ethics Approval", "References"]
ok("Bölüm sırası yönergedeki sıra (şekil ve tablolar metnin içinde)", h1 == expected, "" if h1 == expected else str(h1))
seq = [(p.style.name, txt(p).strip()) for p in paras if p.style.name in ("Heading 1", "Heading 2")]
i1 = seq.index(("Heading 1", "1. Introduction"))
i2 = seq.index(("Heading 1", "2. Materials and Methods"))
ok("Giriş bölümünde alt başlık yok", all(k != "Heading 2" for k, _ in seq[i1 + 1:i2]))
h2 = [t for k, t in seq if k == "Heading 2"]
ok("İkinci düzey başlıklar 2.1 / 3.1 biçiminde numaralı", all(re.match(r"[23]\.\d ", t) for t in h2))
h1p = next(p for p in paras if p.style.name == "Heading 1")
ok("Birinci düzey başlık TNR 10 pt kalın, sola", allrun(h1p, lambda r: tnr(r) and sz(r) == 10 and r.bold) and h1p.alignment == WD_ALIGN_PARAGRAPH.LEFT)
h2p = next(p for p in paras if p.style.name == "Heading 2")
ok("İkinci düzey başlık TNR 10 pt italik", allrun(h2p, lambda r: tnr(r) and sz(r) == 10 and r.italic and not r.bold))

# gövde paragrafları: TNR 10 pt, iki yana yaslı, ilk satır girintisi 0,42 cm
bad = []
start, end = idx["1. Introduction"], idx["Acknowledgements"]
for p in paras[start:end]:
    if p.style.name.startswith("Heading") or is_img(p) or is_eq(p) or is_cap(p) or not txt(p).strip():
        continue
    if p.alignment != WD_ALIGN_PARAGRAPH.JUSTIFY and not txt(p).startswith("Figures"):
        bad.append(("hizalama", txt(p)[:30]))
    fi = p.paragraph_format.first_line_indent
    if fi is None or abs(fi.cm - 0.42) > 0.02:
        bad.append(("girinti", txt(p)[:30]))
    if not allrun(p, lambda r: tnr(r) and sz(r) == 10):
        bad.append(("yazı", txt(p)[:30]))
ok("Gövde metni TNR 10 pt, iki yana yaslı, ilk satır girintili", not bad, str(bad[:3]))

# ------------------------------------------------------------------ atıflar (belge sırasıyla)
ref_idx = next(i for i, (k, p) in enumerate(items) if k == "p" and txt(p).strip() == "References")
body_items = items[:ref_idx]
text_items = []                                  # (öğe no, metin) — tablo hücreleri dahil, belge sırasıyla
for i, (k, o) in enumerate(body_items):
    if k == "p":
        if not is_cap(o):
            text_items.append((i, txt(o)))
    else:
        for row in o.rows:
            for c in row.cells:
                for cp in c.paragraphs:
                    text_items.append((i, txt(cp)))
joined = "\n".join(t for _, t in text_items)

cites = []
for _, t in text_items:
    for m in re.finditer(r"\[(\d[\d,\s\-–]*)\]", t):
        for part in m.group(1).split(","):
            part = part.strip()
            if "-" in part or "–" in part:
                a, b = re.split(r"[-–]", part)
                cites += list(range(int(a), int(b) + 1))
            elif part:
                cites.append(int(part))
first = []
for c in cites:
    if c not in first:
        first.append(c)
ok("Atıflar ilk geçiş sırasıyla 1, 2, 3 … (Vancouver)", first == list(range(1, len(first) + 1)), f"{len(first)} kaynak")

refs_p = [p for p in paras[idx["References"] + 1:] if p.style.name != "Heading 1"]
ref_p = []
for p in paras[idx["References"] + 1:]:
    if p.style.name == "Heading 1":
        break
    ref_p.append(p)
ok("Her kaynak metinde atıflı ve her atıf kaynakçada", set(first) == set(range(1, len(ref_p) + 1)), f"{len(ref_p)} kaynak")
ok("Kaynakça numaraları 1'den ardışık",
   [txt(p).split(".", 1)[0] for p in ref_p] == [str(i) for i in range(1, len(ref_p) + 1)])
ok("Kaynakça TNR 8 pt", all(allrun(p, lambda r: sz(r) == 8) for p in ref_p))


def au_count(t):
    s_ = t.split("\t", 1)[1]
    etal = " et al." in s_.split(". ")[0] or ", et al." in s_
    head = s_.split(", et al.", 1)[0] if etal else s_.split(". ", 1)[0]
    n = 0
    for tk in head.split(", "):
        if re.match(r"^\S.* [A-ZÇĞİÖŞÜ]{1,4}$", tk):
            n += 1
        else:
            break
    return n, etal


bad_auth = []
for p in ref_p:
    n, etal = au_count(txt(p))
    if (etal and n != 6) or (not etal and n > 6):
        bad_auth.append((txt(p)[:25], n, etal))
ok("6'dan fazla yazarda ilk 6 ve 'et al.'", not bad_auth, str(bad_auth[:2]))
ok("Metinde yazar-yıl atıfı kalmamış", not re.search(r"\((?:[A-ZÇĞİÖŞÜ][^()\[\]]*?), (?:19|20)\d{2}[a-z]?\)", joined))
ok("Metinde 'Figure' uzun biçimi yok", "Figure " not in joined and "Figures " not in joined)
ok("SI birimleri: g/cm³ ve cm³ yok", "g/cm" not in joined and "cm^3" not in joined and "cm3" not in joined)

# ------------------------------------------------------------------ şekil ve tablo atıfları ve yerleşimi
text_only = [(i, t) for i, t in text_items]
fig_seen, tab_seen = [], []
first_mention = {}
for i, t in text_only:
    for m in re.finditer(r"Fig\. (\d)", t):
        n = int(m.group(1))
        if n not in fig_seen:
            fig_seen.append(n)
        first_mention.setdefault(("F", n), i)
    for m in re.finditer(r"Table (\d)", t):
        n = int(m.group(1))
        if n not in tab_seen:
            tab_seen.append(n)
        first_mention.setdefault(("T", n), i)
ok("Şekil atıfları ardışık (Fig. 1 … 8)", fig_seen == list(range(1, 9)), str(fig_seen))
ok("Tablo atıfları ardışık (Table 1 … 8)", tab_seen == list(range(1, 9)), str(tab_seen))

img_items, tab_items = [], []
for i, (k, o) in enumerate(items):
    if k == "p" and is_img(o):
        img_items.append(i)
    if k == "t":
        tab_items.append(i)
ok("Gömülü şekil sayısı 8", len(img_items) == 8, str(len(img_items)))
ok("Tablo sayısı 8", len(tab_items) == 8 and len(doc.tables) == 8)
ok("Denklem sayısı 4 ve sağda (n) numaralı",
   sum(1 for k, p in items if k == "p" and is_eq(p)) == 4
   and all(re.search(r"\(\d\)\s*$", txt(p)) for k, p in items if k == "p" and is_eq(p)))

far = []
for n, i in enumerate(img_items, 1):
    m = first_mention.get(("F", n))
    if m is None or not (i > m) or sum(1 for j in range(m + 1, i) if items[j][0] == "t" or (items[j][0] == "p" and not is_img(items[j][1]) and not is_cap(items[j][1]))) > 2:
        far.append(n)
ok("Her şekil ilk atıfından sonra ve en fazla 2 paragraf uzakta", not far, str(far))
farT = []
for n, i in enumerate(tab_items, 1):
    m = first_mention.get(("T", n))
    if m is None or not (i > m) or sum(1 for j in range(m + 1, i) if items[j][0] == "t" or (items[j][0] == "p" and not is_img(items[j][1]) and not is_cap(items[j][1]))) > 2:
        farT.append(n)
ok("Her tablo ilk atıfından sonra ve en fazla 2 paragraf uzakta", not farT, str(farT))

# altyazılar
cap_ok_f, cap_ok_t, cap_style_f, cap_style_t = True, True, True, True
for n, i in enumerate(img_items, 1):
    nxt = items[i + 1][1] if i + 1 < len(items) and items[i + 1][0] == "p" else None
    cap_ok_f &= bool(nxt is not None and txt(nxt).startswith(f"Fig. {n}."))
    if nxt is not None:
        cap_style_f &= allrun(nxt, lambda r: tnr(r) and sz(r) == 9 and r.bold and not r.italic)
for n, i in enumerate(tab_items, 1):
    prv = items[i - 1][1] if i - 1 >= 0 and items[i - 1][0] == "p" else None
    cap_ok_t &= bool(prv is not None and txt(prv).startswith(f"Table {n}."))
    if prv is not None:
        cap_style_t &= allrun(prv, lambda r: tnr(r) and sz(r) == 9 and r.bold and not r.italic)
        cap_style_t &= prv.alignment == WD_ALIGN_PARAGRAPH.JUSTIFY
ok("Şekil altyazısı şeklin altında", cap_ok_f)
ok("Tablo başlığı tablonun üstünde", cap_ok_t)
ok("Altyazılar TNR 9 pt kalın italiksiz (tablo başlıkları iki yana yaslı)", cap_style_f and cap_style_t)
caps = [txt(p) for k, p in items if k == "p" and is_cap(p)]
bad_case = []
for c in caps:
    body_c = re.sub(r"^(Table \d+\.|Fig\. \d+\.)\s*", "", c)
    for m in re.finditer(r"(?<=[a-z] )[A-Z][a-z]{3,}", body_c):
        if m.group(0) not in ("Table", "Appels"):   # 'Table 6' çapraz gönderme; Appels özel ad
            bad_case.append(m.group(0))
ok("Altyazıda yalnız ilk sözcük büyük harfle başlıyor", not bad_case, str(sorted(set(bad_case))))

# tablolar: dikey çizgi yok, başlık satırı kalın
vert = False
for t in doc.tables:
    xml = t._tbl.xml
    vert |= any(k in xml for k in ("w:left w:val", "w:right w:val", "w:insideV"))
ok("Tablolarda dikey çizgi yok", not vert)
no_unit = []
for t in (doc.tables[2], doc.tables[4], doc.tables[5]):
    for c in t.rows[0].cells[1:]:
        if c.text.strip() and "(" not in c.text and "Basis" not in c.text and "Source" not in c.text:
            no_unit.append(c.text.strip())
ok("Sayısal sütun başlıklarında birim (Tablo 3, 5, 6)", not no_unit, str(no_unit))

# şekil dosyaları: yerleşim boyutunda ≥ 300 dpi, TIFF mevcut
fdir = os.path.join(HERE, "sekiller")
low = []
for n, sh in enumerate(doc.inline_shapes, 1):
    px = Image.open(os.path.join(fdir, f"Fig_{n}.png")).width
    dpi = px / (sh.width.cm / 2.54)
    if dpi < 299:
        low.append((n, round(dpi)))
ok("Şekiller yerleşim boyutunda ≥ 300 dpi", not low, str(low))
ok("Ayrı şekil dosyaları (TIFF) mevcut", all(os.path.exists(os.path.join(fdir, f"Fig_{i}.tif")) for i in range(1, 9)))

# ------------------------------------------------------------------ yer tutucular
ph = []
for p in paras:
    for r in p.runs:
        if r.font.highlight_color is not None and r.text.strip():
            ph.append(r.text.strip())
fnx = z.read("word/footnotes.xml").decode("utf-8")
ph += re.findall(r'<w:highlight w:val="yellow"/></w:rPr><w:t[^>]*>([^<]+)</w:t>', fnx)

bad_r = [n for ok_, n, d in res if not ok_]
for ok_, n, d in res:
    print(("OK    " if ok_ else "HATA  ") + n + (f"  [{d}]" if d else ""))
print(f"\n{sum(1 for r in res if r[0])}/{len(res)} kontrol geçti.")
print("\nSarı işaretli (yazarın dolduracağı) yerler:")
for t in ph:
    print("  -", t)
sys.exit(1 if bad_r else 0)
