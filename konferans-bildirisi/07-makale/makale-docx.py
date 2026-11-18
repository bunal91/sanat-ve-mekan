#!/usr/bin/env python3
"""makale.md → Word (.docx).

Adımlar: (1) pandoc'un varsayılan referans belgesi makale biçimine göre
düzenlenir (A4, Times New Roman 12 pt, 1,5 satır aralığı, sayfa numarası);
(2) Markdown pandoc ile dönüştürülür; (3) tablolar, şekiller ve başlıklar
python-docx ile son biçimine getirilir.

Gerekenler: pandoc, python-docx.      python3 makale-docx.py
"""
import copy
import os
import re
import subprocess
import sys
import tempfile

from docx import Document
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_COLOR_INDEX, WD_LINE_SPACING
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "makale.md")
OUT = os.path.join(HERE, sys.argv[1] if len(sys.argv) > 1 else "Unal_Eggshell_Agar_Manuscript.docx")
FONT = "Times New Roman"
BLACK = RGBColor(0, 0, 0)


# ------------------------------------------------------------ yardımcılar
def set_fonts(rpr, name=FONT):
    """rFonts'u tema yazı tiplerinden arındırıp açık yazı tipine bağlar."""
    rf = rpr.find(qn("w:rFonts"))
    if rf is None:
        rf = OxmlElement("w:rFonts")
        rpr.insert(0, rf)
    for a in ("asciiTheme", "hAnsiTheme", "cstheme", "eastAsiaTheme"):
        if rf.get(qn("w:" + a)) is not None:
            del rf.attrib[qn("w:" + a)]
    for a in ("ascii", "hAnsi", "cs", "eastAsia"):
        rf.set(qn("w:" + a), name)


def find_style(doc, name):
    """Ada göre stil; pandoc'un referans belgesindeki yerleşik stil adları
    python-docx'in beklediği yazımdan farklı olduğu için büyük/küçük harfe
    bakmadan aranır."""
    for st in doc.styles:
        if st.name and st.name.lower() == name.lower():
            return st
    return None


def style(doc, name, kind=WD_STYLE_TYPE.PARAGRAPH, base=None):
    st = find_style(doc, name)
    if st is None:
        st = doc.styles.add_style(name, kind)
        if base:
            st.base_style = find_style(doc, base)
    return st


def fmt(st, size=None, bold=None, italic=None, align=None, before=None, after=None,
        line=None, keep_next=None, left=None, first=None):
    f = st.font
    f.name = FONT
    set_fonts(st.element.get_or_add_rPr())
    f.color.rgb = BLACK
    col = st.element.rPr.find(qn("w:color"))
    if col is not None:
        for a in ("themeColor", "themeShade", "themeTint"):
            if col.get(qn("w:" + a)) is not None:
                del col.attrib[qn("w:" + a)]
    if size is not None:
        f.size = Pt(size)
    if bold is not None:
        f.bold = bold
    if italic is not None:
        f.italic = italic
    if st.type == WD_STYLE_TYPE.PARAGRAPH:
        pf = st.paragraph_format
        if align is not None:
            pf.alignment = align
        if before is not None:
            pf.space_before = Pt(before)
        if after is not None:
            pf.space_after = Pt(after)
        if line is not None:
            pf.line_spacing_rule = WD_LINE_SPACING.MULTIPLE
            pf.line_spacing = line
        if keep_next is not None:
            pf.keep_with_next = keep_next
        if left is not None:
            pf.left_indent = Cm(left)
        if first is not None:
            pf.first_line_indent = Cm(first)


def border(tag, val="single", sz=8):
    e = OxmlElement("w:" + tag)
    e.set(qn("w:val"), val)
    e.set(qn("w:sz"), str(sz))
    e.set(qn("w:space"), "0")
    e.set(qn("w:color"), "000000")
    return e


def build_reference(path):
    subprocess.run(["pandoc", "-o", path, "--print-default-data-file", "reference.docx"], check=True)
    d = Document(path)
    # belge varsayılanları
    rpr_def = d.styles.element.find(qn("w:docDefaults")).find(qn("w:rPrDefault")).find(qn("w:rPr"))
    set_fonts(rpr_def)
    J, L, C = WD_ALIGN_PARAGRAPH.JUSTIFY, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER
    fmt(find_style(d, "Normal"), size=12)
    fmt(find_style(d, "Body Text"), size=12, align=J, before=0, after=8, line=1.5)
    fmt(find_style(d, "First Paragraph"), size=12, align=J, before=0, after=8, line=1.5)
    fmt(find_style(d, "Compact"), size=12, align=L, before=0, after=3, line=1.5)
    fmt(find_style(d, "Title"), size=15, bold=True, align=C, before=0, after=14, line=1.15)
    fmt(find_style(d, "Author"), size=12, align=C, before=0, after=4, line=1.15)
    fmt(style(d, "Affiliation", base="Normal"), size=11, italic=True, align=C, before=0, after=4, line=1.15)
    fmt(find_style(d, "Heading 1"), size=13, bold=True, align=L, before=18, after=8, line=1.15, keep_next=True)
    fmt(find_style(d, "Heading 2"), size=12, bold=True, align=L, before=14, after=6, line=1.15, keep_next=True)
    fmt(find_style(d, "Heading 3"), size=12, bold=True, italic=True, align=L, before=10, after=4, line=1.15, keep_next=True)
    fmt(find_style(d, "Table Caption"), size=10.5, italic=False, align=L, before=12, after=4, line=1.15, keep_next=True)
    fmt(find_style(d, "Image Caption"), size=10.5, italic=False, align=L, before=4, after=14, line=1.15)
    fmt(find_style(d, "Caption"), size=10.5, italic=False, align=L, line=1.15)
    fmt(find_style(d, "Captioned Figure"), align=C, before=8, after=2, keep_next=True)
    fmt(find_style(d, "Figure"), align=C, before=8, after=2)
    fmt(find_style(d, "Bibliography"), size=11, align=L, before=0, after=6, line=1.15, left=1.0, first=-1.0)
    ph = style(d, "Placeholder", WD_STYLE_TYPE.CHARACTER)
    ph.font.highlight_color = WD_COLOR_INDEX.YELLOW
    set_fonts(find_style(d, "Hyperlink").element.get_or_add_rPr())
    # tablo stili: üst ve alt çizgi, başlık satırının altında ince çizgi
    tst = find_style(d, "Table").element
    tblpr = tst.find(qn("w:tblPr"))
    if tblpr is None:
        tblpr = OxmlElement("w:tblPr")
        tst.append(tblpr)
    old = tblpr.find(qn("w:tblBorders"))
    if old is not None:
        tblpr.remove(old)
    tb = OxmlElement("w:tblBorders")
    tb.append(border("top", sz=8))
    tb.append(border("bottom", sz=8))
    ind = tblpr.find(qn("w:tblInd"))
    (ind.addnext(tb) if ind is not None else tblpr.insert(0, tb))
    for sp in tst.findall(qn("w:tblStylePr")):
        if sp.get(qn("w:type")) == "firstRow":
            tcpr = sp.find(qn("w:tcPr"))
            if tcpr is None:
                tcpr = OxmlElement("w:tcPr")
                sp.append(tcpr)
            for o in tcpr.findall(qn("w:tcBorders")):
                tcpr.remove(o)
            tcb = OxmlElement("w:tcBorders")
            tcb.append(border("bottom", sz=4))
            tcpr.insert(0, tcb)
    # sayfa: A4, 2,5 cm kenar boşluğu, altta ortalı sayfa numarası
    sec = d.sections[0]
    sec.page_width, sec.page_height = Cm(21.0), Cm(29.7)
    sec.left_margin = sec.right_margin = sec.top_margin = sec.bottom_margin = Cm(2.5)
    sec.footer_distance = sec.header_distance = Cm(1.25)
    sec.gutter = Cm(0)
    fp = sec.footer.paragraphs[0]
    fp.alignment = C
    run = fp.add_run()
    run.font.name, run.font.size = FONT, Pt(10)
    for kind, text in (("begin", None), (None, " PAGE "), ("end", None)):
        if kind:
            fc = OxmlElement("w:fldChar")
            fc.set(qn("w:fldCharType"), kind)
            run._r.append(fc)
        else:
            it = OxmlElement("w:instrText")
            it.set(qn("xml:space"), "preserve")
            it.text = text
            run._r.append(it)
    d.save(path)


UNITS = r"(MPa|GPa|kN|N|kJ/m\^3\^|kJ|J|mm\^2\^|mm|cm\^3\^|cm|µm|g/cm\^3\^|g|kg|°C|min|h|s|wt\.%|phr|tonnes|days)"


def preprocess(text):
    """Sayı ile birim arasına bölünmez boşluk."""
    text = re.sub(r"(?<=\d) (?=" + UNITS + r"(?![\w]))", " ", text)
    return text


def postprocess(path):
    d = Document(path)
    body = d.element.body
    for t in d.tables:
        t.alignment = WD_TABLE_ALIGNMENT.CENTER
        ncols = len(t.columns)
        size = Pt(9) if ncols >= 9 else Pt(9.5)
        for ri, row in enumerate(t.rows):
            trpr = row._tr.get_or_add_trPr()
            if trpr.find(qn("w:cantSplit")) is None:
                trpr.append(OxmlElement("w:cantSplit"))
            if ri == 0 and trpr.find(qn("w:tblHeader")) is None:
                trpr.append(OxmlElement("w:tblHeader"))
            for cell in row.cells:
                tcpr = cell._tc.get_or_add_tcPr()
                for o in tcpr.findall(qn("w:tcMar")):
                    tcpr.remove(o)
                mar = OxmlElement("w:tcMar")
                for side, w in (("top", 40), ("left", 70), ("bottom", 40), ("right", 70)):
                    m = OxmlElement("w:" + side)
                    m.set(qn("w:w"), str(w))
                    m.set(qn("w:type"), "dxa")
                    mar.append(m)
                tcpr.append(mar)
                for p in cell.paragraphs:
                    pf = p.paragraph_format
                    pf.space_before = pf.space_after = Pt(0)
                    pf.line_spacing_rule = WD_LINE_SPACING.SINGLE
                    if p.alignment == WD_ALIGN_PARAGRAPH.JUSTIFY:
                        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                    for r in p.runs:
                        r.font.size = size
                        if ri == 0:
                            r.font.bold = True
    # yer tutucular: karakter stiline ek olarak doğrudan sarı vurgu (her görüntüleyicide görünsün)
    for rpr in body.iter(qn("w:rPr")):
        rs = rpr.find(qn("w:rStyle"))
        if rs is not None and rs.get(qn("w:val")) == "Placeholder" and rpr.find(qn("w:highlight")) is None:
            hl = OxmlElement("w:highlight")
            hl.set(qn("w:val"), "yellow")
            rpr.append(hl)
    # tablodan sonraki paragrafın üstüne boşluk
    for tbl in body.findall(qn("w:tbl")):
        nxt = tbl.getnext()
        if nxt is not None and nxt.tag == qn("w:p"):
            ppr = nxt.get_or_add_pPr()
            sp = ppr.find(qn("w:spacing"))
            if sp is None:
                sp = OxmlElement("w:spacing")
                ppr.append(sp)
            sp.set(qn("w:before"), "240")
    # denklem paragrafları ve şekiller ortalı
    for p in d.paragraphs:
        if p._p.find(qn("m:oMathPara")) is not None:
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(10)
        if p._p.findall(".//" + qn("w:drawing")):
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.keep_with_next = True
    # belge özellikleri
    cp = d.core_properties
    cp.title = ("From Strength to Resilience: Production, Characterisation and Evaluation of a Fully "
                "Bio-Based Eggshell–Agar Composite for Interior Surfaces")
    cp.author = "Betül Ünal"
    cp.language = "en-GB"
    cp.keywords = "eggshell waste; agar; bio-based composite; production protocol; modulus of resilience"
    d.save(path)


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
M_NS = "http://schemas.openxmlformats.org/officeDocument/2006/math"
ORDER = {
    "style": ["name", "aliases", "basedOn", "next", "link", "autoRedefine", "hidden", "uiPriority",
              "semiHidden", "unhideWhenUsed", "qFormat", "locked", "personal", "personalCompose",
              "personalReply", "rsid", "pPr", "rPr", "tblPr", "trPr", "tcPr", "tblStylePr"],
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
ORDER["settings"] = """writeProtection view zoom removePersonalInformation removeDateAndTime
 doNotDisplayPageBoundaries displayBackgroundShape printPostScriptOverText printFractionalCharacterWidth
 printFormsData embedTrueTypeFonts embedSystemFonts saveSubsetFonts saveFormsData mirrorMargins
 alignBordersAndEdges bordersDoNotSurroundHeader bordersDoNotSurroundFooter gutterAtTop hideSpellingErrors
 hideGrammaticalErrors activeWritingStyle proofState formsDesign attachedTemplate linkStyles
 stylePaneFormatFilter stylePaneSortMethod documentType mailMerge revisionView trackRevisions
 doNotTrackMoves doNotTrackFormatting documentProtection autoFormatOverride styleLockTheme styleLockQFSet
 defaultTabStop autoHyphenation consecutiveHyphenLimit hyphenationZone doNotHyphenateCaps showEnvelope
 summaryLength clickAndTypeStyle defaultTableStyle evenAndOddHeaders bookFoldRevPrinting bookFoldPrinting
 bookFoldPrintingSheets drawingGridHorizontalSpacing drawingGridVerticalSpacing
 displayHorizontalDrawingGridEvery displayVerticalDrawingGridEvery doNotUseMarginsForDrawingGridOrigin
 drawingGridHorizontalOrigin drawingGridVerticalOrigin doNotShadeFormData noPunctuationKerning
 characterSpacingControl printTwoOnOne strictFirstAndLastChars noLineBreaksAfter noLineBreaksBefore
 savePreviewPicture doNotValidateAgainstSchema saveInvalidXml ignoreMixedContent alwaysShowPlaceholderText
 doNotDemarcateInvalidXml saveXmlDataOnly useXSLTWhenSaving saveThroughXslt showXMLTags
 alwaysMergeEmptyNamespace updateFields hdrShapeDefaults footnotePr endnotePr compat docVars rsids mathPr
 attachedSchema themeFontLang clrSchemeMapping doNotIncludeSubdocsInStats doNotAutoCompressPictures
 forceUpgrade captions readModeInkLockDown smartTagType schemaLibrary shapeDefaults doNotEmbedSmartTags
 decimalSymbol listSeparator""".split()
M_ORDER = {"dPr": ["begChr", "sepChr", "endChr", "grow", "shp", "ctrlPr"]}


def _reorder(root, ns, table):
    from lxml import etree
    for tag, order in table.items():
        rank = {n: i for i, n in enumerate(order)}
        for el in root.iter("{%s}%s" % (ns, tag)):
            kids = list(el)
            key = [rank.get(etree.QName(k).localname, len(order)) for k in kids]
            if key != sorted(key):
                for k in kids:
                    el.remove(k)
                for _, k in sorted(zip(key, range(len(kids))), key=lambda t: (t[0], t[1])):
                    el.append(kids[k])


def sanitize(path):
    """pandoc ve python-docx çıktısındaki şema sırası sapmalarını giderir
    (Word bunları çoğunlukla hoş görür; katı doğrulayıcılar görmez)."""
    import zipfile
    from lxml import etree
    src = zipfile.ZipFile(path)
    items = [(i, src.read(i.filename)) for i in src.infolist() if not i.filename.endswith("/")]
    src.close()
    out = []
    for info, data in items:
        name = info.filename
        if name.startswith("word/") and name.endswith(".xml"):
            root = etree.fromstring(data)
            _reorder(root, W_NS, ORDER)
            _reorder(root, M_NS, M_ORDER)
            for rpr in root.iter("{%s}rPr" % W_NS):          # öğe-dışı metin kalıntıları
                if rpr.text and rpr.text.strip():
                    rpr.text = None
                for ch in rpr:
                    if ch.tail and ch.tail.strip():
                        ch.tail = None
            for nsid in root.iter("{%s}nsid" % W_NS):         # 8 haneli onaltılık kimlik
                v = nsid.get("{%s}val" % W_NS) or ""
                nsid.set("{%s}val" % W_NS, v.upper().rjust(8, "0")[-8:])
            if name == "word/settings.xml":                   # zoom, şemadaki yerine
                for z in root.findall("{%s}zoom" % W_NS):
                    root.remove(z)
                    pos = 0
                    for i, ch in enumerate(root):
                        if etree.QName(ch).localname in ("writeProtection", "view"):
                            pos = i + 1
                    root.insert(pos, z)
            data = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)
        out.append((name, data))
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for name, data in out:
            z.writestr(name, data)


def main():
    with tempfile.TemporaryDirectory() as tmp:
        ref = os.path.join(tmp, "reference.docx")
        build_reference(ref)
        md = os.path.join(tmp, "makale.md")
        with open(SRC, encoding="utf-8") as fh:
            src = preprocess(fh.read())
        with open(md, "w", encoding="utf-8") as fh:
            fh.write(src)
        subprocess.run(["pandoc", md, "-f", "markdown+implicit_figures+fenced_divs+bracketed_spans",
                        "-t", "docx", "--reference-doc", ref, "--resource-path", HERE,
                        "--columns", "60", "-o", OUT], check=True)
    postprocess(OUT)
    sanitize(OUT)
    print("yazıldı:", OUT, os.path.getsize(OUT), "bayt")


if __name__ == "__main__":
    main()
