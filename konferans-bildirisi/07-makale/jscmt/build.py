#!/usr/bin/env python3
"""JSCMT makalesini Word'e (.docx) çevirir.

Kaynak: makale-jscmt.md (metin), tablolar.py (tablo ve şekil altyazıları), refs.py (kaynakça),
sekiller/ (şekil dosyaları). Taban: dergi şablonu (manuscript_template.docx; sayfa düzeni, yazı tipi,
A4, kenar boşlukları şablondan gelir; gövde temizlenip yeniden kurulur).

Dergi kuralları (JSCMT yazar yönergesi ve şablonu) bu betikte şöyle uygulanır:
  - başlık 14 pt kalın ortalı; yazarlar 11 pt kalın ortalı; özet 9 pt; anahtar sözcükler 10 pt (hepsi Times New Roman)
  - yazışma yazarı yıldızı ve dipnot (Tel., faks, e-posta, ORCID); 80 karakteri aşmayan kısa başlık
  - Giriş alt başlıksız; "Results and Discussion" birleşik; bölüm sırası yönergedeki sıra
  - Vancouver numaralı atıflar (ilk geçiş sırasıyla), şekil/tablo atıfları ardışık
  - şekil altyazıları şeklin altında, tablo başlıkları tablonun üstünde, iki yana yaslı; 9 pt kalın italiksiz
  - şekiller ve tablolar kaynakçadan sonra (16. Figures, 17. Tables); tablolarda yalnız yatay çizgi

    python3 build.py [çıktı.docx]
"""
import copy
import os
import re
import subprocess
import sys
import tempfile
import zipfile

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import (WD_ALIGN_PARAGRAPH, WD_COLOR_INDEX, WD_LINE_SPACING,
                            WD_TAB_ALIGNMENT)
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor
from lxml import etree

import refs
from tablolar import FIGURES, TABLES

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, "manuscript_template.docx")
SRC = os.path.join(HERE, "makale-jscmt.md")
FIGDIR = os.path.join(HERE, "sekiller")
OUT = os.path.join(HERE, sys.argv[1] if len(sys.argv) > 1 else "Unal_JSCMT_Manuscript.docx")

FONT = "Times New Roman"
BLACK = RGBColor(0, 0, 0)
W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
M_NS = "http://schemas.openxmlformats.org/officeDocument/2006/math"

TITLE = "Production, properties and evaluation of a fully bio-based eggshell–agar composite for interior surfaces"
RUNNING_TITLE = "Eggshell–agar composite for interior surfaces"
AUTHOR = "Betül Ünal"
EMAIL = "b.unal91@gmail.com"

# ---------------------------------------------------------------------------- içerik
def parse_content(path):
    txt = open(path, encoding="utf-8").read()
    parts = re.split(r"(?m)^%%(\w+)\s*$", txt)
    return {k: v.strip("\n") for k, v in zip(parts[1::2], parts[2::2])}


def blocks(text):
    """Boş satırla ayrılmış bloklar → (tür, metin)."""
    out = []
    for b in re.split(r"\n\s*\n", text.strip()):
        b = b.strip()
        if not b:
            continue
        if b.startswith("#") and "\n" in b:           # başlık ve ardındaki paragraf aynı blokta
            head, rest = b.split("\n", 1)
            out.extend(blocks(head))
            out.extend(blocks(rest))
            continue
        if b.startswith("## "):
            out.append(("h2", b[3:].strip()))
        elif b.startswith("# "):
            out.append(("h1", b[2:].strip()))
        elif b.startswith("$$") and b.endswith("$$"):
            out.append(("eq", b[2:-2].strip()))
        else:
            out.append(("p", b))
    return out


CITE = re.compile(r"\{@([^}]+)\}")


def number_citations(texts):
    order = []
    for t in texts:
        for m in CITE.finditer(t):
            for k in m.group(1).split(","):
                k = k.strip()
                if k not in order:
                    order.append(k)
    return {k: i + 1 for i, k in enumerate(order)}


def cite_string(keys, num):
    ns = sorted(num[k.strip()] for k in keys.split(","))
    parts, i = [], 0
    while i < len(ns):
        j = i
        while j + 1 < len(ns) and ns[j + 1] == ns[j] + 1:
            j += 1
        if j - i >= 2:
            parts.append(f"{ns[i]}-{ns[j]}")
        else:
            parts.extend(str(n) for n in ns[i:j + 1])
        i = j + 1
    return "[" + ", ".join(parts) + "]"


UNIT = (r"(?:MPa|GPa|kN|kJ/m\^3\^|kJ|N|J|µm|mm\^2\^|mm|cm\^3\^|cm|kg/m\^3\^|kg|g/cm\^3\^|g|°C|min|h|s|"
        r"wt\.%|tonnes|W)")


def typography(t):
    t = re.sub(r"(?<=\d) (?=" + UNIT + r"(?![A-Za-z]))", "\u00a0", t)
    t = re.sub(r"(Fig\.|Figs\.|Table|Eq\.|Eqs\.|Section|Sections) (?=[\d(])", "\\1\u00a0", t)
    t = t.replace("'", "’")
    return t


# ---------------------------------------------------------------------------- yazı biçimi
TOK = re.compile(r"(\[\[.+?\]\])|(\*\*.+?\*\*)|(\*.+?\*)|(~.+?~)|(\^.+?\^)")


def set_font(run, size, bold=None, italic=None, underline=None):
    run.font.name = FONT
    rpr = run._element.get_or_add_rPr()
    rf = rpr.find(qn("w:rFonts"))
    for a in ("ascii", "hAnsi", "cs", "eastAsia"):
        rf.set(qn("w:" + a), FONT)
    run.font.size = Pt(size)
    run.font.color.rgb = BLACK
    if bold is not None:
        run.font.bold = bold
    if italic is not None:
        run.font.italic = italic
    if underline is not None:
        run.font.underline = underline


def add_inline(par, text, size, bold=False, italic=False):
    """Satır içi işaretlemeyi çalıştırmalara çevirir."""
    pos = 0
    for m in TOK.finditer(text):
        if m.start() > pos:
            r = par.add_run(text[pos:m.start()]); set_font(r, size, bold, italic)
        g = m.group(0)
        if m.group(1):
            r = par.add_run(g[2:-2]); set_font(r, size, bold, italic)
            r.font.highlight_color = WD_COLOR_INDEX.YELLOW
        elif m.group(2):
            r = par.add_run(g[2:-2]); set_font(r, size, True, italic)
        elif m.group(3):
            r = par.add_run(g[1:-1]); set_font(r, size, bold, not italic)
        elif m.group(4):
            r = par.add_run(g[1:-1]); set_font(r, size, bold, italic); r.font.subscript = True
        else:
            r = par.add_run(g[1:-1]); set_font(r, size, bold, italic); r.font.superscript = True
        pos = m.end()
    if pos < len(text):
        r = par.add_run(text[pos:]); set_font(r, size, bold, italic)


def pfmt(p, align=None, before=0, after=0, first=None, left=None, keep_next=False, line_single=True, page_break=False):
    pf = p.paragraph_format
    if align is not None:
        pf.alignment = align
    pf.space_before = Pt(before)
    pf.space_after = Pt(after)
    if first is not None:
        pf.first_line_indent = Cm(first)
    if left is not None:
        pf.left_indent = Cm(left)
    pf.keep_with_next = keep_next
    if line_single:
        pf.line_spacing_rule = WD_LINE_SPACING.SINGLE
    if page_break:
        pf.page_break_before = True
    return p


def border(p, side, sz=4, space=6):
    ppr = p._p.get_or_add_pPr()
    bdr = ppr.find(qn("w:pBdr"))
    if bdr is None:
        bdr = OxmlElement("w:pBdr")
        ppr.append(bdr)
    e = OxmlElement("w:" + side)
    e.set(qn("w:val"), "single"); e.set(qn("w:sz"), str(sz)); e.set(qn("w:space"), str(space)); e.set(qn("w:color"), "000000")
    bdr.append(e)


# ---------------------------------------------------------------------------- denklemler
def omml(latex):
    with tempfile.TemporaryDirectory() as t:
        md = os.path.join(t, "e.md")
        open(md, "w", encoding="utf-8").write("$" + latex + "$\n")
        out = os.path.join(t, "e.docx")
        subprocess.run(["pandoc", md, "-o", out], check=True)
        with zipfile.ZipFile(out) as z:
            xml = z.read("word/document.xml")
    el = etree.fromstring(xml).find(".//{%s}oMath" % M_NS)
    return el


def add_equation(doc, latex, n):
    p = doc.add_paragraph()
    pfmt(p, WD_ALIGN_PARAGRAPH.LEFT, before=6, after=6)
    p.paragraph_format.tab_stops.add_tab_stop(Cm(9.0), WD_TAB_ALIGNMENT.CENTER)
    p.paragraph_format.tab_stops.add_tab_stop(Cm(18.0), WD_TAB_ALIGNMENT.RIGHT)
    p.add_run().add_tab()
    p._p.append(copy.deepcopy(omml(latex)))
    p.add_run().add_tab()
    r = p.add_run(f"({n})"); set_font(r, 10)


# ---------------------------------------------------------------------------- tablolar ve şekiller
def set_cell_border(cell, **kw):
    tcpr = cell._tc.get_or_add_tcPr()
    b = tcpr.find(qn("w:tcBorders"))
    if b is None:
        b = OxmlElement("w:tcBorders")
        tcpr.append(b)
    for side, sz in kw.items():
        e = OxmlElement("w:" + side)
        e.set(qn("w:val"), "single"); e.set(qn("w:sz"), str(sz)); e.set(qn("w:space"), "0"); e.set(qn("w:color"), "000000")
        b.append(e)


def add_table(doc, spec, fmt):
    head, rows, widths, align = spec["head"], spec["rows"], spec["widths"], spec["align"]
    t = doc.add_table(rows=1 + len(rows), cols=len(head))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.autofit = False
    tblpr = t._tbl.tblPr
    bd = OxmlElement("w:tblBorders")
    for side in ("top", "bottom"):                       # yalnız yatay çizgiler: tablonun üstü ve altı
        e = OxmlElement("w:" + side)
        e.set(qn("w:val"), "single"); e.set(qn("w:sz"), "8"); e.set(qn("w:space"), "0"); e.set(qn("w:color"), "000000")
        bd.append(e)
    tblpr.append(bd)
    mar = OxmlElement("w:tblCellMar")
    for side, w in (("top", 25), ("left", 60), ("bottom", 25), ("right", 60)):
        e = OxmlElement("w:" + side); e.set(qn("w:w"), str(w)); e.set(qn("w:type"), "dxa"); mar.append(e)
    tblpr.append(mar)
    for ri, row in enumerate([head] + rows):
        tr = t.rows[ri]
        trpr = tr._tr.get_or_add_trPr()
        trpr.append(OxmlElement("w:cantSplit"))
        if ri == 0:
            trpr.append(OxmlElement("w:tblHeader"))
        for ci, text in enumerate(row):
            c = tr.cells[ci]
            c.width = Cm(widths[ci])
            if ri == 0:
                set_cell_border(c, bottom=4)
            p = c.paragraphs[0]
            pfmt(p, WD_ALIGN_PARAGRAPH.CENTER if align[ci] == "c" else WD_ALIGN_PARAGRAPH.LEFT)
            add_inline(p, fmt(text), 8, bold=(ri == 0))
    for ci, w in enumerate(widths):
        t.columns[ci].width = Cm(w)
    return t


def add_caption(doc, label, text, fmt, align, above):
    p = doc.add_paragraph()
    if above:   # tablo başlığı: tablonun üstünde, iki yana yaslı, tabloyla arasında bir satır boşluk
        pfmt(p, align, before=12, after=11.5, keep_next=True)
    else:       # şekil altyazısı: şeklin altında
        pfmt(p, align, before=4, after=14)
    add_inline(p, fmt(f"{label} {text}"), 9, bold=True, italic=False)
    return p


# ---------------------------------------------------------------------------- ana akış
def main():
    content = parse_content(SRC)
    body_blocks = blocks(content["BODY"])
    decl_blocks = blocks(content["DECLARATIONS"])

    # --- atıf numaraları: gövde metni → bildirimler → altyazılar → tablolar (ilk geçiş sırası)
    texts = [content["ABSTRACT"], content["KEYWORDS"]] + [b[1] for b in body_blocks] + [b[1] for b in decl_blocks]
    num = number_citations(texts)
    n_body = len(num)
    texts2 = texts + [f[2] for f in FIGURES]
    for spec in TABLES.values():
        texts2 += [c for row in spec["rows"] for c in row]
    num = number_citations(texts2)
    late = [k for k, v in num.items() if v > n_body]
    if late:
        print("UYARI: gövdede ilk kez geçmeyen atıflar:", late)
    missing = [k for k in num if k not in refs.ALL_KEYS]
    assert not missing, missing

    def fmt(t):
        t = CITE.sub(lambda m: cite_string(m.group(1), num), t)
        return typography(t)

    # --- belge: şablon gövdesi temizlenir
    doc = Document(TEMPLATE)
    body = doc.element.body
    for el in list(body):
        if el.tag != qn("w:sectPr"):
            body.remove(el)
    sect = body.find(qn("w:sectPr"))
    for ref in sect.findall(qn("w:headerReference")) + sect.findall(qn("w:footerReference")):
        rid = ref.get(qn("r:id"))
        sect.remove(ref)
        doc.part.drop_rel(rid)
    for rid, rel in list(doc.part.rels.items()):
        if rel.reltype.endswith("/hyperlink") or rel.reltype.endswith("/image"):
            doc.part.drop_rel(rid)

    # --- stiller
    def style(name, size, bold=False, italic=False):
        st = doc.styles[name]
        st.font.name = FONT
        rpr = st.element.get_or_add_rPr()
        rf = rpr.find(qn("w:rFonts"))
        if rf is None:
            rf = OxmlElement("w:rFonts"); rpr.insert(0, rf)
        for a in list(rf.attrib):
            del rf.attrib[a]
        for a in ("ascii", "hAnsi", "cs", "eastAsia"):
            rf.set(qn("w:" + a), FONT)
        st.font.size = Pt(size); st.font.bold = bold; st.font.italic = italic
        st.font.color.rgb = BLACK
        for tag in ("w:kern", "w:szCs"):
            e = rpr.find(qn(tag))
            if e is not None:
                rpr.remove(e)

    style("Normal", 10)
    style("Heading 1", 10, bold=True)
    style("Heading 2", 10, italic=True)
    style("Title", 14, bold=True)

    sec = doc.sections[0]
    fpr = OxmlElement("w:footnotePr"); nf = OxmlElement("w:numFmt"); nf.set(qn("w:val"), "chicago"); fpr.append(nf)
    for tag in ("w:endnotePr", "w:type", "w:pgSz"):
        anchor = sect.find(qn(tag))
        if anchor is not None:
            anchor.addprevious(fpr)
            break
    sec.different_first_page_header_footer = True
    sec.first_page_header.is_linked_to_previous = False
    sec.first_page_footer.is_linked_to_previous = False
    sec.footer.is_linked_to_previous = False
    fp = sec.footer.paragraphs[0]
    pfmt(fp, WD_ALIGN_PARAGRAPH.CENTER)
    r = fp.add_run()
    set_font(r, 8)
    for kind in ("begin", None, "separate", "t", "end"):
        if kind in ("begin", "separate", "end"):
            e = OxmlElement("w:fldChar"); e.set(qn("w:fldCharType"), kind); r._r.append(e)
        elif kind is None:
            e = OxmlElement("w:instrText"); e.set(qn("xml:space"), "preserve"); e.text = " PAGE "; r._r.append(e)
        else:
            e = OxmlElement("w:t"); e.text = "2"; r._r.append(e)

    J, L, C = WD_ALIGN_PARAGRAPH.JUSTIFY, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER

    # --- başlık sayfası
    p = doc.add_paragraph(); pfmt(p, L, after=8)
    r = p.add_run("Research Article"); set_font(r, 12, underline=True)

    p = doc.add_paragraph(style="Title"); pfmt(p, C, before=0, after=10)
    r = p.add_run(TITLE); set_font(r, 14, bold=True, italic=False)

    p = doc.add_paragraph(); pfmt(p, C, after=4)
    r = p.add_run(AUTHOR); set_font(r, 11, bold=True, italic=False)
    r = p.add_run("a,b"); set_font(r, 11, bold=True, italic=False); r.font.superscript = True
    fr = p.add_run()                                           # yazışma yazarı dipnotu: işareti "*" (chicago numFmt)
    set_font(fr, 11, bold=True, italic=False); fr.font.superscript = True
    ref = OxmlElement("w:footnoteReference"); ref.set(qn("w:id"), "1")
    fr._r.append(ref)

    p = doc.add_paragraph(); pfmt(p, C, after=6)
    add_inline(p, "ORCID: [[0000-0000-0000-0000]]", 9)

    affil = [
        ("a", "Department of Interior Architecture and Environmental Design, Institute of Fine Arts, Hacettepe University, [[Beytepe Campus, 06800]] Ankara, Türkiye"),
        ("b", "Present address: Department of Interior Architecture, [[Faculty of Architecture, Design and Fine Arts]], Cappadocia University, Mustafapaşa Campus, 50420 Ürgüp, Nevşehir, Türkiye"),
    ]
    for letter, text in affil:
        p = doc.add_paragraph(); pfmt(p, C, after=2)
        r = p.add_run(letter); set_font(r, 9, italic=True); r.font.superscript = True
        add_inline(p, " " + text, 9, italic=True)
        for rr in p.runs[1:]:
            if not rr.font.highlight_color:
                rr.font.italic = True

    p = doc.add_paragraph(); pfmt(p, C, before=6, after=10)
    add_inline(p, "Running title: " + RUNNING_TITLE, 9)

    p = doc.add_paragraph(); pfmt(p, L, before=0, after=6, keep_next=True)
    border(p, "top", space=8)
    r = p.add_run("Abstract"); set_font(r, 10, bold=True, italic=False)

    p = doc.add_paragraph(); pfmt(p, J, after=8)
    add_inline(p, fmt(content["ABSTRACT"].replace("\n", " ")), 9, bold=False, italic=False)

    p = doc.add_paragraph(); pfmt(p, L, before=0, after=12)
    border(p, "bottom", space=8)
    add_inline(p, "Keywords: " + content["KEYWORDS"], 10, bold=False, italic=False)

    # --- gövde
    eq_n = 0
    for kind, text in body_blocks:
        if kind == "h1":
            p = doc.add_paragraph(style="Heading 1"); pfmt(p, L, before=12, after=12, keep_next=True)
            r = p.add_run(text); set_font(r, 10, bold=True, italic=False)
        elif kind == "h2":
            p = doc.add_paragraph(style="Heading 2"); pfmt(p, L, before=12, after=12, keep_next=True)
            r = p.add_run(text); set_font(r, 10, bold=False, italic=True)
        elif kind == "eq":
            eq_n += 1
            add_equation(doc, text, eq_n)
        else:
            p = doc.add_paragraph(); pfmt(p, J, after=11.5, first=0.42)
            add_inline(p, fmt(text.replace("\n", " ")), 10)
    assert eq_n == 4, eq_n

    # --- bildirimler (yönergedeki sıra)
    for kind, text in decl_blocks:
        if kind == "h2":
            p = doc.add_paragraph(style="Heading 1"); pfmt(p, L, before=12, after=6, keep_next=True)
            r = p.add_run(text); set_font(r, 10, bold=True, italic=False)
        else:
            p = doc.add_paragraph(); pfmt(p, J, after=6)
            add_inline(p, fmt(text.replace("\n", " ")), 10)

    # --- kaynakça (Vancouver, ilk geçiş sırası)
    p = doc.add_paragraph(style="Heading 1"); pfmt(p, L, before=12, after=6, keep_next=True)
    r = p.add_run("References"); set_font(r, 10, bold=True, italic=False)
    for key, n in sorted(num.items(), key=lambda kv: kv[1]):
        p = doc.add_paragraph(); pfmt(p, L, after=2, left=0.55, first=-0.55)
        p.paragraph_format.tab_stops.add_tab_stop(Cm(0.55))
        add_inline(p, typography(f"{n}.\t{refs.vancouver(key)}"), 8)

    # --- şekiller (16) ve tablolar (17)
    p = doc.add_paragraph(style="Heading 1"); pfmt(p, L, before=0, after=12, keep_next=True, page_break=True)
    r = p.add_run("Figures"); set_font(r, 10, bold=True, italic=False)
    for i, (fn, w, cap) in enumerate(FIGURES, 1):
        pp = doc.add_paragraph(); pfmt(pp, C, before=6, after=2, keep_next=True)
        pp.add_run().add_picture(os.path.join(FIGDIR, fn), width=Cm(w))
        add_caption(doc, f"Fig. {i}.", cap, fmt, L, above=False)

    p = doc.add_paragraph(style="Heading 1"); pfmt(p, L, before=0, after=12, keep_next=True, page_break=True)
    r = p.add_run("Tables"); set_font(r, 10, bold=True, italic=False)
    for i, (k, spec) in enumerate(TABLES.items(), 1):
        add_caption(doc, f"Table {i}.", spec["caption"], fmt, J, above=True)
        add_table(doc, spec, fmt)
        sp = doc.add_paragraph(); pfmt(sp, L, after=6)

    cp = doc.core_properties
    cp.title = TITLE; cp.author = AUTHOR; cp.language = "en-GB"
    cp.keywords = content["KEYWORDS"]; cp.comments = ""; cp.subject = "Research Article"
    doc.save(OUT)
    postprocess(OUT)
    print("yazıldı:", OUT, os.path.getsize(OUT), "bayt |", len(num), "kaynak,", eq_n, "denklem")
    return num


# ---------------------------------------------------------------------------- son işlemler
FOOTNOTE = ('<w:footnote xmlns:w="%s" w:id="1"><w:p><w:pPr><w:keepLines/><w:spacing w:line="240" w:lineRule="auto"/></w:pPr>'
            '<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:vertAlign w:val="superscript"/><w:sz w:val="18"/></w:rPr><w:footnoteRef/></w:r>'
            '%s</w:p></w:footnote>')


def run_xml(text, highlight=False):
    hl = '<w:highlight w:val="yellow"/>' if highlight else ""
    return ('<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>'
            f'<w:sz w:val="18"/>{hl}</w:rPr><w:t xml:space="preserve">{text}</w:t></w:r>')


def footnote_xml():
    parts = [run_xml("Corresponding author. Tel.: "), run_xml("[+90 000 000 00 00]", True), run_xml("; fax: "),
             run_xml("[+90 000 000 00 00]", True), run_xml("; e-mail: " + EMAIL + ". ORCID: "),
             run_xml("[0000-0000-0000-0000]", True), run_xml(".")]
    return FOOTNOTE % (W_NS, "".join(parts))


ORDER = {
    "pPr": ["pStyle", "keepNext", "keepLines", "pageBreakBefore", "framePr", "widowControl", "numPr",
            "suppressLineNumbers", "pBdr", "shd", "tabs", "suppressAutoHyphens", "kinsoku", "wordWrap",
            "overflowPunct", "topLinePunct", "autoSpaceDE", "autoSpaceDN", "bidi", "adjustRightInd",
            "snapToGrid", "spacing", "ind", "contextualSpacing", "mirrorIndents", "suppressOverlap", "jc",
            "textDirection", "textAlignment", "textboxTightWrap", "outlineLvl", "divId", "cnfStyle", "rPr",
            "sectPr", "pPrChange"],
    "rPr": ["rStyle", "rFonts", "b", "bCs", "i", "iCs", "caps", "smallCaps", "strike", "dstrike", "outline",
            "shadow", "emboss", "imprint", "noProof", "snapToGrid", "vanish", "webHidden", "color", "spacing",
            "w", "kern", "position", "sz", "szCs", "highlight", "u", "effect", "bdr", "shd", "fitText",
            "vertAlign", "rtl", "cs", "em", "lang", "eastAsianLayout", "specVanish", "oMath"],
    "tcPr": ["cnfStyle", "tcW", "gridSpan", "hMerge", "vMerge", "tcBorders", "shd", "noWrap", "tcMar",
             "textDirection", "tcFitText", "vAlign", "hideMark"],
    "tblPr": ["tblStyle", "tblpPr", "tblOverlap", "bidiVisual", "tblStyleRowBandSize", "tblStyleColBandSize",
              "tblW", "jc", "tblCellSpacing", "tblInd", "tblBorders", "shd", "tblLayout", "tblCellMar",
              "tblLook", "tblCaption", "tblDescription"],
}


M_ORDER = {"dPr": ["begChr", "sepChr", "endChr", "grow", "shp", "ctrlPr"]}


def reorder(root):
    for tag, order in list(ORDER.items()) + [("m:" + k, v) for k, v in M_ORDER.items()]:
        rank = {n: i for i, n in enumerate(order)}
        ns, local = (M_NS, tag[2:]) if tag.startswith("m:") else (W_NS, tag)
        for el in root.iter("{%s}%s" % (ns, local)):
            kids = list(el)
            key = [rank.get(etree.QName(k).localname, len(order)) for k in kids]
            if key != sorted(key):
                for k in kids:
                    el.remove(k)
                for _, k in sorted(zip(key, range(len(kids))), key=lambda t: (t[0], t[1])):
                    el.append(kids[k])


def postprocess(path):
    src = zipfile.ZipFile(path)
    items = [(i, src.read(i.filename)) for i in src.infolist() if not i.filename.endswith("/")]
    src.close()
    out = []
    for info, data in items:
        name = info.filename
        if name == "word/footnotes.xml":
            root = etree.fromstring(data)
            for fn in root.findall("{%s}footnote" % W_NS):
                if fn.get("{%s}id" % W_NS) == "1":
                    root.replace(fn, etree.fromstring(footnote_xml()))
            data = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)
        elif name.startswith("word/") and name.endswith(".xml") and name != "word/fontTable.xml":
            root = etree.fromstring(data)
            reorder(root)
            for nsid in root.iter("{%s}nsid" % W_NS):
                v = nsid.get("{%s}val" % W_NS) or ""
                nsid.set("{%s}val" % W_NS, v.upper().rjust(8, "0")[-8:])
            data = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)
        out.append((name, data))
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for name, data in out:
            z.writestr(name, data)


if __name__ == "__main__":
    main()
