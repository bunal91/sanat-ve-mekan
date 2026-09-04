#!/usr/bin/env python3
"""Build the Dusk Ladder planner product pack.

One HTML template -> print PDFs, fillable (AcroForm) PDFs and a browser HTML,
for every size / colorway / language combination.

    python3 build.py            # build everything into dist/
    python3 build.py --only letter-dusk-en

Requires: Chromium (headless) and, for the fillable PDFs, pypdf + reportlab.
"""
import argparse, base64, html, json, os, re, shutil, subprocess, sys, urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src", "planner.template.html")
DIST = os.path.join(ROOT, "dist")
WORK = os.environ.get("PLANNER_WORK", os.path.join(ROOT, ".build"))
CACHE = os.path.join(WORK, "fonts")

CHROME = next((p for p in [
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    shutil.which("chromium"), shutil.which("chromium-browser"),
    shutil.which("google-chrome"), shutil.which("chrome"),
] if p and os.path.exists(p)), None)

GF_URL = ("https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght"
          "@0,6..96,400;0,6..96,500;1,6..96,400"
          "&family=Barlow+Condensed:wght@500;600;700"
          "&family=IBM+Plex+Sans:wght@400;500;600&display=swap")
GF_LINK = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
           '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
           f'<link rel="stylesheet" href="{GF_URL}">')
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/120.0.0.0 Safari/537.36")

# --------------------------------------------------------------------------- data

SIZES = {
    "letter": dict(w="8.5in", h="11in", wpt=612.0, hpt=792.0, wpx=816, hpx=1056,
                   pad=".5in .55in .45in", display="41pt",
                   cap_en="US Letter, 8.5 &times; 11 in &nbsp;&middot;&nbsp; print at 100% scale, no margins",
                   cap_tr="US Letter, 21,6 &times; 27,9 cm &nbsp;&middot;&nbsp; %100 &ouml;l&ccedil;ekte, kenar bo&#351;luksuz yazd&#305;r&#305;n"),
    "a4":     dict(w="210mm", h="297mm", wpt=595.28, hpt=841.89, wpx=794, hpx=1123,
                   pad="13mm 14mm 12mm", display="40pt",
                   cap_en="A4, 210 &times; 297 mm &nbsp;&middot;&nbsp; print at 100% scale, no margins",
                   cap_tr="A4, 21 &times; 29,7 cm &nbsp;&middot;&nbsp; %100 &ouml;l&ccedil;ekte, kenar bo&#351;luksuz yazd&#305;r&#305;n"),
}

COLORWAYS = {
    # the dusk ramp reports time of day: dawn amber -> coral -> rose -> night violet
    "dusk": dict(ink="#23181f", soft="#6e6068", faint="#9a8f94", rule="#e3dcde",
                 rule_strong="#c7bcc1",
                 s1="#f2a65a", s2="#ee6c4d", s3="#c43e7a", s4="#4b2e83", grain="0.22"),
    # ink-saver: same ladder, graphite only
    "mono": dict(ink="#22222a", soft="#6a6a72", faint="#9a9aa2", rule="#e2e2e6",
                 rule_strong="#c2c2c8",
                 s1="#b9b9c0", s2="#8e8e97", s3="#5a5a63", s4="#22222a", grain="0.12"),
}

LANGS = {
    "en": dict(
        doc="Dusk Ladder Daily Planner",
        eyebrow="Daily Planner &nbsp;&middot;&nbsp; 6 AM &ndash; 10 PM",
        title="Today,<br><em>in order.</em>",
        date="Date", week="Wk", days=["M", "T", "W", "T", "F", "S", "S"],
        days_label="Day of week",
        schedule="Schedule", tick="Dotted tick = half hour",
        bands=["Morning", "Afternoon", "Evening"],
        hours=[["6 AM", "7", "8", "9", "10", "11"], ["12 PM", "1", "2", "3", "4"],
               ["5 PM", "6", "7", "8", "9", "10"]],
        hour_w=".42in",
        priorities="Today&#8217;s Priorities", priorities_hint="Ranked &mdash; one is the one",
        tasks="Tasks", todo="To do", started="Started", done="Done", moved="Moved",
        meals="Meals", meal_rows=["Morning", "Midday", "Evening", "Between"], meal_w=".58in",
        mood="Mood", mood_low="Flat", mood_high="Lit up",
        three_words="The day in three words",
        gratitude="Gratitude", gratitude_hint="Small counts",
        tomorrow="Tomorrow&#8217;s first move", mark="One sheet, one day.",
        print_btn="Print sheet"),
    "tr": dict(
        doc="G&uuml;nl&uuml;k Planlay&#305;c&#305; &mdash; Alacakaranl&#305;k",
        eyebrow="G&uuml;nl&uuml;k Planlay&#305;c&#305; &nbsp;&middot;&nbsp; 06.00 &ndash; 22.00",
        title="Bug&uuml;n,<br><em>s&#305;ras&#305;yla.</em>",
        date="Tarih", week="Hf", days=["P", "S", "&Ccedil;", "P", "C", "C", "P"],
        days_label="Haftanin gunu",
        schedule="Program", tick="Noktal&#305; &ccedil;izgi = yar&#305;m saat",
        bands=["Sabah", "&Ouml;&#287;leden Sonra", "Ak&#351;am"],
        hours=[["06.00", "07", "08", "09", "10", "11"], ["12.00", "13", "14", "15", "16"],
               ["17.00", "18", "19", "20", "21", "22"]],
        hour_w=".44in",
        priorities="Bug&uuml;n&uuml;n &Ouml;ncelikleri", priorities_hint="S&#305;ral&#305; &mdash; biri as&#305;l olan",
        tasks="G&ouml;revler", todo="Yap&#305;lacak", started="Ba&#351;lad&#305;", done="Bitti", moved="Ertelendi",
        meals="&Ouml;&#287;&uuml;nler", meal_rows=["Sabah", "&Ouml;&#287;le", "Ak&#351;am", "Ara"], meal_w=".52in",
        mood="Ruh Hali", mood_low="Durgun", mood_high="Co&#351;kulu",
        three_words="G&uuml;n&uuml; &uuml;&ccedil; kelimeyle",
        gratitude="&#350;&uuml;kran", gratitude_hint="K&uuml;&ccedil;&uuml;k &#351;eyler say&#305;l&#305;r",
        tomorrow="Yar&#305;n&#305;n ilk ad&#305;m&#305;", mark="Bir g&uuml;n, bir sayfa.",
        print_btn="Yazd&#305;r"),
}

TASK_ROWS = 8

# --------------------------------------------------------------------------- fonts

def google_fonts_css(embed: bool) -> str:
    """Return the <link> tag, or a <style> block with the latin faces inlined."""
    if not embed:
        return GF_LINK
    os.makedirs(CACHE, exist_ok=True)
    cached = os.path.join(CACHE, "faces.css")
    if os.path.exists(cached):
        return open(cached, encoding="utf-8").read()
    css = subprocess.run(["curl", "-sS", "-A", UA, GF_URL],
                         capture_output=True, text=True, check=True).stdout
    blocks = re.findall(r"/\*\s*([\w\-\[\]]+)\s*\*/\s*(@font-face\s*\{.*?\})", css, re.S)
    out = "\n".join(b for name, b in blocks if name in ("latin", "latin-ext"))
    for url in sorted(set(re.findall(r"url\((https://fonts\.gstatic\.com/[^)]+)\)", out))):
        data = subprocess.run(["curl", "-sS", "-A", UA, url],
                              capture_output=True, check=True).stdout
        out = out.replace(url, "data:font/woff2;base64," + base64.b64encode(data).decode())
    out = "<style>\n" + out + "\n</style>"
    open(cached, "w", encoding="utf-8").write(out)
    return out

# --------------------------------------------------------------------------- html

def render_html(size: str, colorway: str, lang: str, embed_fonts: bool) -> str:
    S, C, L = SIZES[size], COLORWAYS[colorway], LANGS[lang]
    tpl = open(SRC, encoding="utf-8").read()

    chips = "".join(
        f'<span data-field="day_{i+1}" data-ftype="check">{d}</span>'
        for i, d in enumerate(L["days"]))

    hours, n = [], 0
    for band_class, band_label, labels in zip(
            ["morning", "afternoon", "evening"], L["bands"], L["hours"]):
        hours.append(f'<div class="band {band_class}"><span class="dot"></span>'
                     f'{band_label}<span class="line"></span></div>')
        for label in labels:
            n += 1
            hours.append(f'<div class="hour"><span class="t">{label}</span>'
                         f'<span class="slot" data-field="hour_{n:02d}"></span></div>')

    tasks = "".join(
        f'<div class="task"><span class="box" data-field="task_{i+1}_box" data-ftype="check">'
        f'</span><span class="slot" data-field="task_{i+1}"></span></div>'
        for i in range(TASK_ROWS))

    meals = "".join(
        f'<div class="meal"><span class="lbl">{m}</span>'
        f'<span class="slot" data-field="meal_{i+1}"></span></div>'
        for i, m in enumerate(L["meal_rows"]))

    values = {
        "DOC_TITLE": L["doc"], "FONTS": google_fonts_css(embed_fonts),
        "INK": C["ink"], "INK_SOFT": C["soft"], "INK_FAINT": C["faint"],
        "RULE": C["rule"], "RULE_STRONG": C["rule_strong"],
        "S1": C["s1"], "S2": C["s2"], "S3": C["s3"], "S4": C["s4"], "GRAIN": C["grain"],
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": S["pad"], "DISPLAY_SIZE": S["display"],
        "HOUR_W": L["hour_w"], "MEAL_W": L["meal_w"],
        "L_PRINT": L["print_btn"], "L_EYEBROW": L["eyebrow"], "L_TITLE": L["title"],
        "L_DATE": L["date"], "L_WEEK": L["week"], "L_DAYS": L["days_label"], "DAY_CHIPS": chips,
        "L_SCHEDULE": L["schedule"], "L_TICK": L["tick"], "HOUR_ROWS": "\n".join(hours),
        "L_PRIORITIES": L["priorities"], "L_PRIORITIES_HINT": L["priorities_hint"],
        "L_TASKS": L["tasks"], "L_TODO": L["todo"], "L_STARTED": L["started"],
        "L_DONE": L["done"], "L_MOVED": L["moved"], "TASK_ROWS": tasks,
        "L_MEALS": L["meals"], "MEAL_ROWS": meals,
        "L_MOOD": L["mood"], "L_MOOD_LOW": L["mood_low"], "L_MOOD_HIGH": L["mood_high"],
        "L_THREE_WORDS": L["three_words"],
        "L_GRATITUDE": L["gratitude"], "L_GRATITUDE_HINT": L["gratitude_hint"],
        "L_TOMORROW": L["tomorrow"], "L_MARK": L["mark"],
        "L_CAPTION": S["cap_" + lang], "EXTRA_CSS": "",
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    left = set(re.findall(r"\{\{(\w+)\}\}", tpl))
    if left:
        raise SystemExit(f"unfilled template tokens: {sorted(left)}")
    return tpl

# --------------------------------------------------------------------------- chromium

def chrome(*args) -> subprocess.CompletedProcess:
    if not CHROME:
        raise SystemExit("Chromium not found - set CHROME or install chromium.")
    base = [CHROME, "--headless", "--no-sandbox", "--disable-gpu",
            "--virtual-time-budget=8000", "--hide-scrollbars"]
    return subprocess.run(base + list(args), capture_output=True, text=True)

def to_pdf(html_path: str, pdf_path: str):
    chrome("--no-pdf-header-footer", f"--print-to-pdf={pdf_path}", "file://" + html_path)
    if not os.path.exists(pdf_path):
        raise SystemExit(f"chromium produced no PDF for {html_path}")

def to_png(html_path: str, png_path: str, w: int, h: int, scale: float = 2):
    chrome(f"--window-size={w},{h}", f"--force-device-scale-factor={scale}",
           f"--screenshot={png_path}", "file://" + html_path)

MEASURE_JS = """
<style>body{padding:0 !important;background:#fff !important;display:block !important}
.caption,.print-btn{display:none !important}
.stage{display:block !important}
.sheet{box-shadow:none !important}</style>
<script>
(() => {
  const emit = () => {
    if (document.getElementById('FIELDS')) return;
    const rows = [...document.querySelectorAll('[data-field]')].map(el => {
      const r = el.getBoundingClientRect();
      return [el.dataset.field, el.dataset.ftype || 'text', r.x, r.y, r.width, r.height];
    });
    const pre = document.createElement('pre');
    pre.id = 'FIELDS';
    pre.textContent = JSON.stringify(rows);
    document.documentElement.appendChild(pre);
  };
  const ready = document.fonts ? document.fonts.ready : Promise.resolve();
  ready.then(() => requestAnimationFrame(emit));
  setTimeout(emit, 2500);   // fallback if webfonts never resolve
})();
</script>
"""

def measure(html_src: str, size: str, work: str, name: str):
    """Lay the sheet out at print geometry and read back every field rectangle."""
    S = SIZES[size]
    path = os.path.join(work, f"measure-{name}.html")
    open(path, "w", encoding="utf-8").write(html_src + MEASURE_JS)
    for attempt in range(4):        # chromium sometimes dumps before the DOM settles
        dom = chrome("--dump-dom", f"--window-size={S['wpx']},{S['hpx']}", "file://" + path).stdout
        m = re.search(r'<pre id="FIELDS">(.*?)</pre>', dom, re.S)
        if m:
            return json.loads(html.unescape(m.group(1)))
    raise SystemExit(f"could not measure fields for {name}")

# --------------------------------------------------------------------------- fillable

def make_fillable(design_pdf: str, fields, size: str, out_pdf: str, colorway: str):
    from reportlab.pdfgen import canvas
    from reportlab.lib.colors import HexColor
    from pypdf import PdfReader, PdfWriter

    S, C = SIZES[size], COLORWAYS[colorway]
    px2pt = 0.75                      # CSS px (96dpi) -> PDF pt (72dpi)
    overlay = out_pdf + ".overlay"
    c = canvas.Canvas(overlay, pagesize=(S["wpt"], S["hpt"]))
    ink = HexColor(C["ink"])
    accent = HexColor(C["s3"])

    for name, ftype, x, y, w, h in fields:
        x, y, w, h = x * px2pt, y * px2pt, w * px2pt, h * px2pt
        if ftype == "check":
            side = min(w, h) * 0.78
            c.acroForm.checkbox(
                name=name, x=x + (w - side) / 2, y=S["hpt"] - (y + h) + (h - side) / 2,
                size=side, buttonStyle="check", borderWidth=0, checked=False,
                borderColor=None, fillColor=None, textColor=accent, forceBorder=False)
        else:
            box = min(h, 17.0)        # sit the typed line just above the rule
            c.acroForm.textfield(
                name=name, x=x + 1, y=S["hpt"] - (y + h) + 1.5, width=w - 2, height=box,
                fontName="Helvetica", fontSize=9.5, textColor=ink,
                borderWidth=0, borderColor=None, fillColor=None,
                forceBorder=False, annotationFlags="print")
    c.showPage()
    c.save()

    writer = PdfWriter(clone_from=overlay)          # keeps /AcroForm
    writer.pages[0].merge_page(PdfReader(design_pdf).pages[0])   # widgets stay on top
    writer.set_need_appearances_writer(True)
    with open(out_pdf, "wb") as fh:
        writer.write(fh)
    os.remove(overlay)


# --------------------------------------------------------------------------- extras

SHOT_CSS = ("<style>body{padding:0 !important;background:#fff !important;display:block !important}"
            ".caption,.print-btn{display:none !important}.stage{display:block !important}"
            ".sheet{box-shadow:none !important}</style>")

README = {
    "en": dict(
        doc="Start here", brand="Dusk Ladder &nbsp;&middot;&nbsp; Daily Planner",
        title="Start<br><em>here.</em>",
        lede="Thank you. Everything in this pack is yours to print as often as you like. "
             "Four short steps and you are set up.",
        s1="What is in your download",
        files=[("8 print PDFs", "Letter + A4 &middot; Dusk + Mono &middot; EN + TR"),
               ("8 fillable PDFs", "type straight onto every line, then print or keep it on file"),
               ("1 Canva template link", "change any word, heading, colour or section"),
               ("This guide", "printing and editing in one page")],
        s2="Edit it in Canva", s2p="Open the link below in a browser where you are signed in to "
           "Canva (free account is enough). Canva makes a copy in your own account &mdash; edit "
           "the headings, swap the wording, change the colours, then Share &rarr; Download &rarr; PDF Print.",
        s2btn="Open the template",
        s3="Type on it instead", s3p="Prefer to keep it digital? Open any file ending in "
           "<b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet annotation app, click a "
           "line and type. Tick the task boxes, the day of the week and the mood scale with a click.",
        s4="Print it well",
        tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm holds ink best",
              "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
              "Margins: none / borderless, portrait orientation",
              "Saving ink? Print the <b>Mono</b> version &mdash; same layout, graphite only"],
        s5="If anything looks off",
        s5p="Message me through Etsy and I will sort it out the same day &mdash; a file that will "
            "not open, a size you need, a section you wish said something else. If the planner "
            "earns its place on your desk, a review helps this small shop more than you would think.",
        license="Personal use only. Print as many copies as you like for yourself. Please do not "
                "resell, share or redistribute the files or the template link, and do not sell the "
                "printed sheets. Fonts: Bodoni Moda, Barlow Condensed, IBM Plex Sans (SIL Open Font License).",
        mark="One sheet, one day."),
    "tr": dict(
        doc="Buradan ba&#351;lay&#305;n", brand="Alacakaranl&#305;k &nbsp;&middot;&nbsp; G&uuml;nl&uuml;k Planlay&#305;c&#305;",
        title="Buradan<br><em>ba&#351;lay&#305;n.</em>",
        lede="Te&#351;ekk&uuml;rler. Bu paketteki her dosyay&#305; diledi&#287;iniz kadar yazd&#305;rabilirsiniz. "
             "D&ouml;rt k&#305;sa ad&#305;mda haz&#305;rs&#305;n&#305;z.",
        s1="Paketin i&ccedil;inde ne var",
        files=[("8 bask&#305; PDF&#8217;i", "Letter + A4 &middot; Renkli + Mono &middot; EN + TR"),
               ("8 doldurulabilir PDF", "her sat&#305;ra do&#287;rudan yaz&#305;n, sonra yazd&#305;r&#305;n ya da dijital saklay&#305;n"),
               ("1 Canva &#351;ablon linki", "her kelimeyi, ba&#351;l&#305;&#287;&#305;, rengi ve b&ouml;l&uuml;m&uuml; de&#287;i&#351;tirin"),
               ("Bu k&#305;lavuz", "yazd&#305;rma ve d&uuml;zenleme tek sayfada")],
        s2="Canva&#8217;da d&uuml;zenleyin", s2p="A&#351;a&#287;&#305;daki linki Canva hesab&#305;n&#305;zda a&ccedil;&#305;k oldu&#287;unuz bir "
           "taray&#305;c&#305;da a&ccedil;&#305;n (&uuml;cretsiz hesap yeterli). Canva &#351;ablonun bir kopyas&#305;n&#305; sizin hesab&#305;n&#305;za "
           "kurar &mdash; ba&#351;l&#305;klar&#305; de&#287;i&#351;tirin, renkleri se&ccedil;in, sonra Payla&#351; &rarr; &#304;ndir &rarr; PDF Print.",
        s2btn="&#350;ablonu a&ccedil;",
        s3="Ya da &uuml;zerine yaz&#305;n", s3p="Dijital kalmay&#305; tercih ederseniz: sonu <b>-fillable.pdf</b> ile "
           "biten dosyalar&#305; Adobe Acrobat Reader&#8217;da (&uuml;cretsiz) ya da bir tablet uygulamas&#305;nda a&ccedil;&#305;n, "
           "sat&#305;ra t&#305;klay&#305;p yaz&#305;n. G&ouml;rev kutular&#305;n&#305;, g&uuml;n&uuml; ve ruh hali &ouml;l&ccedil;e&#287;ini t&#305;klayarak i&#351;aretleyin.",
        s4="&#304;yi bir bask&#305; i&ccedil;in",
        tips=["Ka&#287;&#305;t: d&uuml;z A4 veya Letter, 90&ndash;120 gr en iyi sonucu verir",
              "&Ouml;l&ccedil;ek: <b>%100 / Ger&ccedil;ek boyut</b> &mdash; &ldquo;Sayfaya s&#305;&#287;d&#305;r&rdquo; se&ccedil;meyin",
              "Kenar bo&#351;lu&#287;u: yok / kenarl&#305;ks&#305;z, dikey y&ouml;n",
              "M&uuml;rekkep tasarrufu: <b>Mono</b> s&uuml;r&uuml;m&uuml; yazd&#305;r&#305;n &mdash; ayn&#305; d&uuml;zen, tek renk"],
        s5="Bir sorun olursa",
        s5p="Etsy mesajlar&#305;ndan yaz&#305;n, ayn&#305; g&uuml;n &ccedil;&ouml;zelim &mdash; a&ccedil;&#305;lmayan bir dosya, ihtiyac&#305;n&#305;z olan "
            "ba&#351;ka bir boyut ya da de&#287;i&#351;mesini istedi&#287;iniz bir b&ouml;l&uuml;m. Planlay&#305;c&#305; masan&#305;zda yerini bulduysa, "
            "b&#305;rakaca&#287;&#305;n&#305;z yorum bu k&uuml;&ccedil;&uuml;k d&uuml;kkana sand&#305;&#287;&#305;n&#305;zdan &ccedil;ok yarar.",
        license="Yaln&#305;zca ki&#351;isel kullan&#305;m i&ccedil;indir. Kendiniz i&ccedil;in diledi&#287;iniz kadar &ccedil;&#305;kt&#305; alabilirsiniz. "
                "Dosyalar&#305; ve &#351;ablon linkini satmay&#305;n, payla&#351;may&#305;n ya da da&#287;&#305;tmay&#305;n; bas&#305;lm&#305;&#351; sayfalar&#305; da satmay&#305;n. "
                "Yaz&#305; tipleri: Bodoni Moda, Barlow Condensed, IBM Plex Sans (SIL Open Font License).",
        mark="Bir g&uuml;n, bir sayfa."),
}

CANVA_LINK_PLACEHOLDER = "https://www.canva.com/design/REPLACE-WITH-YOUR-TEMPLATE-LINK"

def build_readme(lang: str, work: str, canva_link: str = CANVA_LINK_PLACEHOLDER):
    """One-page delivery sheet: what is in the pack, the Canva link, how to print."""
    R, S = README[lang], SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    values = {
        "DOC_TITLE": R["doc"], "FONTS": google_fonts_css(True),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"],
        "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S2_BTN": R["s2btn"],
        "CANVA_LINK": canva_link,
        "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"],
        "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    path = os.path.join(work, f"readme-{lang}.html")
    open(path, "w", encoding="utf-8").write(tpl)
    out = os.path.join(DIST, f"00-START-HERE-{lang}.pdf")
    to_pdf(path, out)
    print(f"  start-here sheet ({lang})")
    return out

def sheet_png(size: str, colorway: str, lang: str, work: str, scale: float = 2) -> str:
    S = SIZES[size]
    src = render_html(size, colorway, lang, embed_fonts=True) + SHOT_CSS
    hp = os.path.join(work, f"shot-{size}-{colorway}-{lang}.html")
    open(hp, "w", encoding="utf-8").write(src)
    png = os.path.join(work, f"sheet-{size}-{colorway}-{lang}.png")
    to_png(hp, png, S["wpx"], S["hpx"], scale)
    return png

def data_uri(path: str) -> str:
    return "data:image/png;base64," + base64.b64encode(open(path, "rb").read()).decode()

def build_mockups(work: str):
    """Three 2000x2000 listing images in the product's own visual identity."""
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = google_fonts_css(True)
    dusk = data_uri(sheet_png("letter", "dusk", "en", work))
    mono = data_uri(sheet_png("letter", "mono", "en", work))

    scenes = []
    scenes.append(("01-hero", "#f5f0f3", "100px", "86px", "0", f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Printable &middot; Editable</span>
          <h1>Today,<br><em>in order.</em></h1>
          <span class="rule"></span>
          <p class="sub">One page for the whole day &mdash; schedule 6 AM to 10 PM,
          priorities, tasks, meals, mood, gratitude.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">US Letter + A4</span>
          <span class="badge">Editable in Canva</span>
          <span class="badge">Fillable PDF</span></div>
        </div>
        <img src="{dusk}">
      </div>'''))

    items = [("Schedule 6 AM &ndash; 10 PM", "hour rows with half-hour ticks, banded morning / afternoon / evening"),
             ("Top three priorities", "ranked, so the day has one real headline"),
             ("Tasks with a status key", "to do &middot; started &middot; done &middot; moved"),
             ("Meals, mood, gratitude", "a mood scale, three words for the day, three lines of thanks"),
             ("Two colourways", "Dusk gradient, or Mono for saving ink"),
             ("Two languages", "English and Turkish, both included")]
    scenes.append(("02-included", "#ffffff", "120px", "88px", "0", '''
      <span class="eyebrow">What you get</span>
      <h1>Everything<br><em>in the pack.</em></h1>
      <span class="rule"></span>
      <div class="cols" style="margin-top:70px">''' +
      "".join(f'<div class="item"><b>{a}</b><span>{b}</span></div>' for a, b in items) +
      '''</div>
      <p class="caption" style="margin-top:auto">16 PDF files &middot; Canva template link &middot; instant download</p>'''))

    scenes.append(("03-colourways", "#efe9ee", "110px", "64px", "90px", f'''
      <span class="eyebrow">Two colourways, two sizes</span>
      <h1>Dusk, <em>or mono.</em></h1>
      <div class="shots" style="margin-top:40px"><img src="{dusk}" style="height:1180px">
      <img src="{mono}" style="height:1180px"></div>
      <p class="caption">Same layout &middot; US Letter and A4 &middot; English and Turkish</p>'''))

    for name, bg, pad, h1, gap, content in scenes:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": gap or "0", "CONTENT": content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-{name}.html")
        open(hp, "w", encoding="utf-8").write(page)
        to_png(hp, os.path.join(DIST, f"listing-{name}.png"), 2000, 2000, scale=1)
        print(f"  listing image {name}")

def package():
    """Zip the pack the way an Etsy listing takes it: max 5 files, 20 MB each."""
    import zipfile
    out = os.path.join(DIST, "etsy")
    os.makedirs(out, exist_ok=True)
    pdfs = sorted(f for f in os.listdir(DIST) if f.endswith(".pdf"))
    bundles = {
        "Dusk-Ladder-Daily-Planner-COMPLETE.zip": pdfs,
        "Dusk-Ladder-Daily-Planner-Letter.zip": [f for f in pdfs if "letter" in f or f.startswith("00-")],
        "Dusk-Ladder-Daily-Planner-A4.zip": [f for f in pdfs if "a4" in f or f.startswith("00-")],
    }
    for zname, members in bundles.items():
        zpath = os.path.join(out, zname)
        with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
            for f in members:
                z.write(os.path.join(DIST, f), f)
        print(f"  {zname}  ({os.path.getsize(zpath)/1e6:.1f} MB, {len(members)} files)")
    for f in ("00-START-HERE-en.pdf", "00-START-HERE-tr.pdf"):
        shutil.copy(os.path.join(DIST, f), os.path.join(out, f))
    print("  + both START-HERE sheets, loose -> 5 files total, the Etsy maximum")

# --------------------------------------------------------------------------- build

def build_variant(size: str, colorway: str, lang: str, work: str, fillable=True):
    name = f"{size}-{colorway}-{lang}"
    src = render_html(size, colorway, lang, embed_fonts=True)
    render_path = os.path.join(work, f"render-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"daily-planner-{name}-print.pdf")
    to_pdf(render_path, print_pdf)

    if fillable:
        fields = measure(src, size, work, name)
        fill_pdf = os.path.join(DIST, f"daily-planner-{name}-fillable.pdf")
        make_fillable(print_pdf, fields, size, fill_pdf, colorway)
        print(f"  {name}: print + fillable ({len(fields)} fields)")
    else:
        print(f"  {name}: print")
    return print_pdf

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="single variant, e.g. letter-dusk-en")
    ap.add_argument("--no-fillable", action="store_true")
    ap.add_argument("--extras", action="store_true", help="only the start-here sheets + listing images")
    ap.add_argument("--canva-link", default=CANVA_LINK_PLACEHOLDER)
    args = ap.parse_args()

    os.makedirs(DIST, exist_ok=True)
    os.makedirs(WORK, exist_ok=True)

    if args.extras:
        for lang in README:
            build_readme(lang, WORK, args.canva_link)
        build_mockups(WORK)
        package()
        return

    combos = [(s, c, l) for s in SIZES for c in COLORWAYS for l in LANGS]
    if args.only:
        s, c, l = args.only.split("-")
        combos = [(s, c, l)]

    print("Building planner pack ->", DIST)
    for size, colorway, lang in combos:
        build_variant(size, colorway, lang, WORK, fillable=not args.no_fillable)

    # browser copy (Google Fonts linked, not embedded) of the flagship variant
    open(os.path.join(ROOT, "daily-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "dusk", "en", embed_fonts=False))
    print("Wrote daily-planner.html (browser / preview copy)")

    for lang in README:
        build_readme(lang, WORK, args.canva_link)
    build_mockups(WORK)
    package()

if __name__ == "__main__":
    main()
