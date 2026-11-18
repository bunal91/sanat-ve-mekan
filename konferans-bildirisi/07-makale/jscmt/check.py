#!/usr/bin/env python3
"""Üretilen .docx'in JSCMT yazar yönergesine uyumunu otomatik denetler.

    python3 check.py [Unal_JSCMT_Manuscript.docx]
Çıktı: her kural için OK/HATA; sonda yer tutucu listesi.
"""
import os
import re
import sys
import zipfile

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn

HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.join(HERE, sys.argv[1] if len(sys.argv) > 1 else "Unal_JSCMT_Manuscript.docx")
doc = Document(PATH)
paras = doc.paragraphs
res = []


def ok(name, cond, detail=""):
    res.append((bool(cond), name, detail))


def runs_of(p):
    return [r for r in p.runs if r.text.strip()]


def all_runs(p, pred):
    rs = runs_of(p)
    return bool(rs) and all(pred(r) for r in rs)


def size(r):
    return r.font.size.pt if r.font.size else None


tnr = lambda r: r.font.name == "Times New Roman"

# --- sayfa / şablon
s = doc.sections[0]
ok("A4 sayfa (21 × 29,7 cm)", abs(s.page_width.cm - 21.0) < 0.05 and abs(s.page_height.cm - 29.7) < 0.05)
ok("Kenar boşlukları şablondaki gibi (üst 2,5 / yanlar 1,5 / alt 1,0 cm)",
   abs(s.top_margin.cm - 2.5) < 0.05 and abs(s.left_margin.cm - 1.5) < 0.05 and abs(s.right_margin.cm - 1.5) < 0.05 and abs(s.bottom_margin.cm - 1.0) < 0.05)
ok("İlk sayfada sayfa numarası yok (titlePg)", s.different_first_page_header_footer)
ok("Belge dili en-GB", doc.styles["Normal"].element.xpath("string(.//w:lang/@w:val)") == "en-GB")

# --- başlık sayfası
idx = {p.text.strip(): i for i, p in enumerate(paras) if p.text.strip()}
title_p = next(p for p in paras if p.style.name == "Title")
ok("Başlık: Times New Roman 14 pt kalın ortalı", all_runs(title_p, lambda r: tnr(r) and size(r) == 14 and r.bold) and title_p.alignment == WD_ALIGN_PARAGRAPH.CENTER)
ok("Başlık kısa (≤ 20 sözcük), kaynak/kısaltma yok", len(title_p.text.split()) <= 20 and "[" not in title_p.text, f"{len(title_p.text.split())} sözcük")
author_p = paras[paras.index(title_p) + 1]
ok("Yazar satırı: TNR 11 pt kalın italiksiz ortalı", all_runs(author_p, lambda r: tnr(r) and size(r) == 11 and r.bold and not r.italic) and author_p.alignment == WD_ALIGN_PARAGRAPH.CENTER, author_p.text)
ok("Yazarda üst simge küçük harf kurum işareti", any(r.font.superscript and re.fullmatch(r"[a-z](,[a-z])*", r.text) for r in author_p.runs))
ok("Yazışma yazarı yıldızı dipnotla (dipnot referansı var)", bool(author_p._p.xpath(".//w:footnoteReference")))
z = zipfile.ZipFile(PATH)
fn = re.sub(r"<[^>]+>", "", z.read("word/footnotes.xml").decode("utf-8"))
ok("Dipnot: Tel., fax, e-mail, ORCID", all(k in fn for k in ("Tel.", "fax", "e-mail", "ORCID")))
ok("Dipnot sembol biçimi (chicago → *)", 'w:numFmt w:val="chicago"' in z.read("word/document.xml").decode("utf-8"))
running = next(p.text for p in paras if p.text.startswith("Running title:")).split(":", 1)[1].strip()
ok("Kısa başlık ≤ 80 karakter", len(running) <= 80, f"{len(running)} karakter")
aff = [p for p in paras if "University" in p.text and p.alignment == WD_ALIGN_PARAGRAPH.CENTER]
ok("Kurum satırları: bölüm, üniversite, şehir, posta kodu/ülke", len(aff) >= 1 and all(("Türkiye" in p.text) for p in aff))

# --- özet / anahtar sözcükler
ia = idx["Abstract"]
abs_p = paras[ia + 1]
ok("Özet: TNR 9 pt, kalın değil, italik değil", all_runs(abs_p, lambda r: tnr(r) and size(r) == 9 and not r.bold and not r.italic))
nw = len(abs_p.text.split())
ok("Özet ≤ 300 sözcük", nw <= 300, f"{nw} sözcük")
ok("Özette atıf yok", not re.search(r"\[\d", abs_p.text))
ok("Özette MDF tanımlı", "medium-density fibreboard (MDF)" in abs_p.text)
kw_p = next(p for p in paras if p.text.startswith("Keywords:"))
kws = [k.strip() for k in kw_p.text.split(":", 1)[1].split(";") if k.strip()]
ok("Anahtar sözcük 4–6, noktalı virgülle", 4 <= len(kws) <= 6 and ";" in kw_p.text, f"{len(kws)} sözcük")
ok("Anahtar sözcükler TNR 10 pt, kalın/italik değil", all_runs(kw_p, lambda r: tnr(r) and size(r) == 10 and not r.bold and not r.italic))

# --- bölüm sırası
h1 = [p.text.strip() for p in paras if p.style.name == "Heading 1"]
expected = ["1. Introduction", "2. Materials and Methods", "3. Results and Discussion", "4. Conclusion", "Acknowledgements",
            "Conflicts of Interest", "Author contributions", "Data availability statement", "Financial Disclosure", "Peer-review",
            "Use of AI for writing assistance", "Ethics Approval", "References", "Figures", "Tables"]
ok("Bölüm sırası yönergedeki sıra (Ethics Approval şablondaki gibi sonda)", h1 == expected, "" if h1 == expected else str(h1))
seq = [(p.style.name, p.text.strip()) for p in paras if p.style.name in ("Heading 1", "Heading 2")]
i1 = seq.index(("Heading 1", "1. Introduction")); i2 = seq.index(("Heading 1", "2. Materials and Methods"))
ok("Giriş: alt başlık yok", all(k != "Heading 2" for k, _ in seq[i1 + 1:i2]))
h2 = [t for k, t in seq if k == "Heading 2"]
ok("Alt başlıklar 1.1 biçiminde numaralı", all(re.match(r"\d\.\d ", t) for t in h2))
h1p = [p for p in paras if p.style.name == "Heading 1"][0]
ok("Birinci düzey başlık: 10 pt kalın sola", all_runs(h1p, lambda r: size(r) == 10 and r.bold) and h1p.alignment == WD_ALIGN_PARAGRAPH.LEFT)
h2p = [p for p in paras if p.style.name == "Heading 2"][0]
ok("İkinci düzey başlık: 10 pt italik", all_runs(h2p, lambda r: size(r) == 10 and r.italic and not r.bold))

# --- gövde biçimi
i_intro = paras.index([p for p in paras if p.text.strip() == "1. Introduction"][0])
body_p = paras[i_intro + 1]
ok("Gövde: TNR 10 pt, iki yana yaslı, ilk satır girintili", all_runs(body_p, lambda r: tnr(r) and size(r) == 10) and body_p.alignment == WD_ALIGN_PARAGRAPH.JUSTIFY and body_p.paragraph_format.first_line_indent and abs(body_p.paragraph_format.first_line_indent.cm - 0.42) < 0.02)
ok("Paragraflar arası bir satır boşluk", body_p.paragraph_format.space_after and body_p.paragraph_format.space_after.pt >= 11)

# --- metin ve atıflar
i_ref = idx["References"]
main = [p for p in paras[:i_ref]]
text_main = "\n".join(p.text for p in main)
refs_start = i_ref + 1
ref_paras = []
for p in paras[refs_start:]:
    if p.style.name == "Heading 1":
        break
    ref_paras.append(p)
n_refs = len(ref_paras)
cites = []
for m in re.finditer(r"\[(\d[\d,\s\-]*)\]", "\n".join(p.text for p in paras[idx["1. Introduction"]:i_ref] if not p.text.startswith("[[")).replace(" ", " ")):
    for part in m.group(1).split(","):
        part = part.strip()
        if "-" in part:
            a, b = part.split("-"); cites += list(range(int(a), int(b) + 1))
        else:
            cites.append(int(part))
first, seen = [], set()
for c in cites:
    if c not in seen:
        seen.add(c); first.append(c)
ok("Atıflar ilk geçiş sırasıyla 1,2,3… (Vancouver)", first == sorted(first) and first == list(range(1, len(first) + 1)), f"{len(first)} farklı atıf")
ok("Her kaynak metinde atıflı, her atıf listede", set(first) == set(range(1, n_refs + 1)), f"{n_refs} kaynak")
ok("Kaynak numaraları listede ardışık", [p.text.split(".", 1)[0] for p in ref_paras] == [str(i) for i in range(1, n_refs + 1)])
ok("Kaynakça 8 pt (şablondaki Els-reference boyutu)", all(all_runs(p, lambda r: size(r) == 8) for p in ref_paras))
def author_count(t):
    s = t.split("\t", 1)[1]
    etal = ", et al." in s.split(". ")[0] + "." or re.match(r"^[^.]*?, et al\. ", s) is not None
    head = s.split(", et al.", 1)[0] if etal else s.split(". ", 1)[0]
    toks = head.split(", ")
    n = 0
    for tk in toks:
        if re.match(r"^\S.* [A-Z]{1,4}$", tk):
            n += 1
        else:
            break
    return n, etal
bad_auth = []
for p in ref_paras:
    n, etal = author_count(p.text)
    if (etal and n != 6) or (not etal and n > 6):
        bad_auth.append((p.text[:30], n, etal))
ok("Kaynakçada 6'dan fazla yazarda ilk 6 + 'et al.'", not bad_auth, str(bad_auth))
ok("Metinde yazar-yıl atıfı kalmamış", not re.search(r"\([A-Z][A-Za-z\-]+(?: et al\.)?,? \d{4}\)", text_main))

# --- şekil / tablo / denklem atıfları
def order_of(pattern, scope):
    seen, out = set(), []
    for m in re.finditer(pattern, scope):
        n = int(m.group(1))
        if n not in seen:
            seen.add(n); out.append(n)
    return out

scope = "\n".join(p.text for p in paras[idx["1. Introduction"]:i_ref]).replace(" ", " ")
fig_order = order_of(r"Fig\. (\d)", scope)
tab_order = order_of(r"Table (\d)", scope)
T = lambda p: p.text.replace(" ", " ")
n_fig = sum(1 for p in paras if re.match(r"Fig\. \d\.", T(p)))
n_tab = sum(1 for p in paras if re.match(r"Table \d\.", T(p)))
ok("Şekil atıfları ardışık sırada ve hepsi atıflı", fig_order == list(range(1, n_fig + 1)), str(fig_order))
ok("Tablo atıfları ardışık sırada ve hepsi atıflı", tab_order == list(range(1, n_tab + 1)), str(tab_order))
ok("'Figure' değil 'Fig.' kullanılmış", "Figure " not in scope)
eq_nums = [p.text for p in paras if p._p.xpath(".//m:oMath") and re.search(r"\(\d\)$", p.text.strip())]
ok("Denklemler sağda (1)–(4) numaralı", len(eq_nums) == 4)

# --- altyazılar
caps_f = [p for p in paras if re.match(r"Fig\. \d\.", T(p))]
caps_t = [p for p in paras if re.match(r"Table \d\.", T(p))]
ok("Altyazılar bulundu (6 şekil, 5 tablo)", len(caps_f) == 6 and len(caps_t) == 5, f"{len(caps_f)} şekil, {len(caps_t)} tablo")
cap_style = lambda r: tnr(r) and size(r) == 9 and r.bold and not r.italic
ok("Şekil altyazıları 9 pt TNR kalın italiksiz", all(all_runs(p, cap_style) for p in caps_f))
ok("Tablo başlıkları 9 pt TNR kalın italiksiz", all(all_runs(p, cap_style) for p in caps_t))
ok("Tablo başlıkları iki yana yaslı", all(p.alignment == WD_ALIGN_PARAGRAPH.JUSTIFY for p in caps_t))
body_el = doc.element.body
order = [(el.tag.split("}")[1], el) for el in body_el]
def pos(el):
    return [e for _, e in order].index(el)
fig_ok = True
for p in caps_f:
    prev = p._p.getprevious()
    fig_ok &= bool(prev is not None and prev.xpath(".//w:drawing"))
ok("Şekil altyazıları şeklin altında", fig_ok)
tab_ok = True
for p in caps_t:
    nxt = p._p.getnext()
    tab_ok &= bool(nxt is not None and nxt.tag == qn("w:tbl"))
ok("Tablo başlıkları tablonun üstünde", tab_ok)
low = lambda t: re.sub(r"^(Fig|Table) \d\.\s*", "", t.replace(" ", " "))
caps_found = sorted({m.group(0) for p in caps_f + caps_t for m in re.finditer(r"(?<=[a-z] )[A-Z][a-z]{3,}", low(p.text))
                     if m.group(0) not in ("Table",)})  # 'of Table 4': çapraz gönderme, büyük harf doğru
ok("Altyazıda yalnız ilk sözcük büyük harfle başlıyor (kısaltma/özel ad hariç)", not caps_found, "; ".join(caps_found))

# --- tablolar
vert = False
for t in doc.tables:
    xml = t._tbl.xml
    vert |= any(k in xml for k in ("w:left w:val", "w:right w:val", "w:insideV"))
ok("Tablolarda dikey çizgi yok", not vert)
ok("Tablo sayısı = başlık sayısı", len(doc.tables) == n_tab == 5)
head_units = ["Water (g)", "Maximum load (kN)", "σ", "(MPa)", "(kJ/m"]
no_unit = [c.text for t in (doc.tables[0], doc.tables[2], doc.tables[3]) for c in t.rows[0].cells[1:]
           if c.text.strip() not in ("Basis", "Source") and "(" not in c.text]
ok("Sayısal sütun başlıklarında birim (Tablo 1, 3, 4)", not no_unit, str(no_unit))

# --- şekil dosyaları
imgs = doc.inline_shapes
ok("Gömülü şekil sayısı = altyazı sayısı", len(imgs) == n_fig == 6)
fdir = os.path.join(HERE, "sekiller")
from PIL import Image
low_dpi = []
for i, sh in enumerate(imgs, 1):
    w_cm = sh.width.cm
    px = Image.open(os.path.join(fdir, f"Fig_{i}.png")).width
    dpi = px / (w_cm / 2.54)
    if dpi < 299:
        low_dpi.append((i, round(dpi)))
ok("Şekiller yerleşim boyutunda ≥ 300 dpi", not low_dpi, str(low_dpi))
ok("Ayrı şekil dosyaları (TIFF) mevcut", all(os.path.exists(os.path.join(fdir, f"Fig_{i}.tif")) for i in range(1, 7)))

# --- SI / yazım
ok("SI dışı birim yok (g/cm³, psi, inç vb.)", not re.search(r"g/cm|psi\b|\binch|\bkg-f|kgf", text_main))
ok("Amerikan/İngiliz imla tutarlı (İngiliz): 'characterization' vb. gövdede yok", not re.search(r"characteriz|behavior|color\b|stabiliz|center\b", text_main))
ok("Bölüm içi bağlı yazım: 'non-load-bearing'", "loadbearing" not in text_main)

# --- bildirimler
need = ["Acknowledgements", "Conflicts of Interest", "Author contributions", "Data availability statement", "Financial Disclosure", "Peer-review", "Use of AI for writing assistance", "Ethics Approval"]
ok("Tüm bildirim bölümleri var", all(k in idx for k in need))

# --- istatistik
ok("İstatistik: test ve anlamlılık düzeyi (0,05) belirtilmiş", "two-sided" in text_main and "0.05" in text_main)

# --- yer tutucular
ph = []
for p in paras:
    for r in p.runs:
        if r.font.highlight_color is not None and r.text.strip():
            ph.append(r.text.strip())
fnx = z.read("word/footnotes.xml").decode("utf-8")
ph += re.findall(r'<w:highlight w:val="yellow"/></w:rPr><w:t[^>]*>([^<]+)</w:t>', fnx)
bad = [n for ok_, n, d in res if not ok_]
for ok_, n, d in res:
    print(("OK    " if ok_ else "HATA  ") + n + (f"  [{d}]" if d else ""))
print(f"\n{sum(1 for r in res if r[0])}/{len(res)} kontrol geçti.")
print("\nSarı işaretli (yazarın dolduracağı) yerler:")
for t in ph:
    print("  -", t)
sys.exit(1 if bad else 0)
