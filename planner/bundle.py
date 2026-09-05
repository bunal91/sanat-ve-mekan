#!/usr/bin/env python3
"""Package the four mental-health sets as one bundle product.

Adds two pages that only exist in the bundle:

  00 START HERE      what the four sets are, which to open first, the safety note
  01 WHICH PAGE      a decision table: what is happening today -> set and page

Then zips everything the way an Etsy listing takes it: five files, foldered by
set, Letter and A4 split out as well as a complete download.

    python3 bundle.py            # sheets, listing images and zips
    python3 bundle.py --sheets   # just the two bundle pages

Requires the four sets to have been built already (dist-adhd, dist-autism,
dist-anxiety, dist-depression).
"""
import argparse, base64, os, zipfile

import build as B

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-bundle")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Instrument+Serif:ital@0;1"
          "&family=Public+Sans:wght@400;500;600;700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".5in .55in .45in", display="34pt"),
    "a4":     dict(B.SIZES["a4"],     pad="13mm 14mm 12mm", display="33pt"),
}

INK, SOFT, FAINT, RULE, STRONG = "#22242b", "#5f6572", "#9aa0ac", "#e4e7ec", "#c5cad3"

# each set keeps the colour it uses in its own pages
SETS = [
    dict(key="adhd", dist="dist-adhd", folder="1 - Attention (First Move)",
         name="First Move", who="Starting, and time",
         pages=8, colour="#0f7c86",
         blurb="One real task a day, a first move small enough to do, a brain dump with a column "
               "for letting things go, and a page that teaches you how long things really take."),
    dict(key="autism", dist="dist-autism", folder="2 - Predictability (Same Shape)",
         name="Same Shape", who="Order, and change",
         pages=9, colour="#6e8f7d",
         blurb="The day as a sequence, a page for when the plan changes, sensory needs written "
               "down once, and sentences prepared before you need them."),
    dict(key="anxiety", dist="dist-anxiety", folder="3 - Worry (Steady)",
         name="Steady", who="Worry, and evidence",
         pages=9, colour="#3f7f8c",
         blurb="A worry window with a closing time, a thought record, grounding, and a log of "
               "what you feared against what happened."),
    dict(key="depression", dist="dist-depression", folder="4 - Low days (Small Light)",
         name="Small Light", who="Low days, and safety",
         pages=9, colour="#4f8a7d",
         blurb="A daily page that takes two minutes, three versions of a day written in "
               "advance, an activity log, and a safety plan."),
]

# what is happening -> where to go. the reason the bundle is worth more than four downloads.
ROUTES = [
    ("I cannot make myself start", "adhd", "First Move", "3", "Task breakdown, then the first move"),
    ("My head is too full to choose", "adhd", "First Move", "2", "Brain dump, then triage"),
    ("I keep running out of time", "adhd", "First Move", "4", "Guess, then time it"),
    ("Something changed and I am thrown", "autism", "Same Shape", "3", "What changed, what stays the same"),
    ("Too loud, too bright, too much", "autism", "Same Shape", "4", "Sensory page, then the after plan"),
    ("I have to make a phone call", "autism", "Same Shape", "6", "Sentences you can read out"),
    ("An appointment is coming", "autism", "Same Shape", "7", "Prepared before, recovery after"),
    ("I cannot stop turning it over", "anxiety", "Steady", "2", "Worry time, with a closing time"),
    ("One thought will not let go", "anxiety", "Steady", "3", "Thought record"),
    ("I am sure something bad will happen", "anxiety", "Steady", "4", "Write the prediction, check it later"),
    ("My body will not settle", "anxiety", "Steady", "6", "Grounding and breathing"),
    ("Everything feels out of my hands", "anxiety", "Steady", "5", "Mine, and not mine"),
    ("Getting up is the whole day", "depression", "Small Light", "1", "The things that count"),
    ("I do not know what I can manage", "depression", "Small Light", "2", "Three versions of a day"),
    ("Nothing seems worth doing", "depression", "Small Light", "3", "Do it, then rate it"),
    ("I have gone quiet on everyone", "depression", "Small Light", "6", "Messages you can copy"),
    ("It is very dark today", "depression", "Small Light", "8", "Safety plan, and the numbers"),
]

# --------------------------------------------------------------------------- pages

def css(size):
    S = SIZES[size]
    return f'''
:root{{ --ink:{INK}; --soft:{SOFT}; --faint:{FAINT}; --rule:{RULE}; --strong:{STRONG};
  --adhd:{SETS[0]["colour"]}; --autism:{SETS[1]["colour"]};
  --anxiety:{SETS[2]["colour"]}; --depression:{SETS[3]["colour"]};
  --backdrop:#eceef1; }}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#15161a; }} }}
:root[data-theme="dark"]{{ --backdrop:#15161a; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Public Sans","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(34,36,43,.14);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:600; text-transform:uppercase; letter-spacing:.14em; font-size:8pt;
  color:var(--soft); }}
.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in;
  border-bottom:1.6px solid var(--ink); padding-bottom:10px; }}
.mast h1{{ font-family:"Instrument Serif",Georgia,serif; font-weight:400; font-size:{S["display"]};
  line-height:1.02; margin:7px 0 0; }}
.mast h1 em{{ font-style:italic; }}
.stripe{{ display:flex; gap:0; height:5px; margin-top:12px; flex:none; }}
.stripe i{{ flex:1; }}
.stripe i.a{{ background:var(--adhd); }} .stripe i.b{{ background:var(--autism); }}
.stripe i.c{{ background:var(--anxiety); }} .stripe i.d{{ background:var(--depression); }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:16px; }}
.lede{{ font-size:10.2pt; line-height:1.5; color:var(--soft); max-width:5.6in; margin:0 0 12px; }}
.sec{{ display:flex; align-items:center; gap:10px; padding:2px 0 8px; overflow:hidden; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.1em; font-size:8.4pt;
  color:var(--ink); white-space:nowrap; }}
.hint{{ font-size:8.4pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

/* the four sets ----------------------------------------------------------- */
.sets{{ display:flex; flex-direction:column; gap:8px; flex:0 1 auto; }}
.set{{ display:grid; grid-template-columns:.32in 1fr; gap:0 12px; border-top:2.5px solid var(--rule);
  padding-top:8px; }}
.set.a{{ border-top-color:var(--adhd); }} .set.b{{ border-top-color:var(--autism); }}
.set.c{{ border-top-color:var(--anxiety); }} .set.d{{ border-top-color:var(--depression); }}
.setno{{ font-family:"Instrument Serif",Georgia,serif; font-size:20pt; line-height:.9;
  color:var(--faint); }}
.set.a .setno{{ color:var(--adhd); }} .set.b .setno{{ color:var(--autism); }}
.set.c .setno{{ color:var(--anxiety); }} .set.d .setno{{ color:var(--depression); }}
.setbody b{{ font-family:"Instrument Serif",Georgia,serif; font-weight:400; font-size:14pt;
  display:block; line-height:1.1; }}
.setbody .who{{ font-size:8.6pt; text-transform:uppercase; letter-spacing:.1em;
  color:var(--soft); display:block; padding:3px 0 5px; }}
.setbody p{{ margin:0; font-size:9.2pt; line-height:1.45; color:var(--soft); }}

/* the routing table ------------------------------------------------------- */
.routes{{ flex:1; display:flex; flex-direction:column; min-height:0; }}
.rt{{ display:grid; grid-template-columns:minmax(0,1.55fr) .28in minmax(0,.95fr) .34in minmax(0,1.35fr);
  gap:0 12px; align-items:center; flex:1 1 auto; min-height:.3in; max-height:.42in;
  border-bottom:1px solid var(--rule); }}
.rt.head{{ flex:none; min-height:0; height:auto; padding-bottom:7px;
  border-bottom:1.6px solid var(--ink); margin-bottom:5px;
  font-weight:700; text-transform:uppercase; letter-spacing:.09em; font-size:7.4pt;
  color:var(--soft); }}
.rt .what{{ font-size:10pt; }}
.rt .dot{{ width:10px; height:10px; border-radius:50%; }}
.rt .dot.adhd{{ background:var(--adhd); }} .rt .dot.autism{{ background:var(--autism); }}
.rt .dot.anxiety{{ background:var(--anxiety); }} .rt .dot.depression{{ background:var(--depression); }}
.rt .set-name{{ font-size:9.4pt; color:var(--ink); }}
.rt .pg{{ font-family:"Instrument Serif",Georgia,serif; font-size:14pt; text-align:center; }}
.rt .why{{ font-size:8.8pt; color:var(--soft); }}

.mine{{ display:grid; grid-template-columns:repeat(3,1fr); gap:0 .3in; flex:none;
  padding-top:6px; }}
.mine .fr{{ display:flex; align-items:flex-end; gap:10px; height:.4in; }}
.blank{{ flex:1; border-bottom:1.3px solid var(--strong); height:100%; min-width:0; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}

.note{{ border:1.5px solid var(--ink); border-radius:2px; padding:10px 13px; margin-top:11px;
  font-size:9.2pt; line-height:1.45; flex:none; }}
.note b{{ font-weight:700; }}
.steps{{ display:flex; flex-direction:column; gap:7px; flex:1 1 auto; padding-top:11px; }}
.step{{ display:grid; grid-template-columns:.3in 1fr; gap:0 12px; }}
.step .n{{ font-family:"Instrument Serif",Georgia,serif; font-size:15pt; color:var(--faint);
  line-height:1; }}
.step h3{{ font-size:9.8pt; margin:0 0 2px; font-weight:600; }}
.step p{{ margin:0; font-size:9.2pt; line-height:1.45; color:var(--soft); }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.6px solid var(--ink); margin-top:12px; padding-top:9px; }}
.foot .mark{{ font-family:"Instrument Serif",Georgia,serif; font-style:italic; font-size:10pt;
  color:var(--faint); }}
.foot .small{{ font-size:8.4pt; color:var(--faint); }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def sheet(title, kicker, body):
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
  </header>
  <div class="stripe"><i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i></div>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">Four sets, one shelf.</span>
    <span class="small">Journals and planners &middot; not medical care</span></footer>
</div>'''

def page_start():
    sets = "".join(
        f'<div class="set {c}"><span class="setno">{i}</span>'
        f'<div class="setbody"><b>{s["name"]}</b><span class="who">{s["who"]} &middot; '
        f'{s["pages"]} pages</span><p>{s["blurb"]}</p></div></div>'
        for i, (s, c) in enumerate(zip(SETS, "abcd"), start=1))
    return sheet("Four sets,<br><em>one shelf.</em>", "Start here &middot; read this page first",
        '<p class="lede">Four separate planning sets, each designed on its own terms rather than '
        'recoloured from one template. You do not need all four. Most people use one, and borrow '
        'a page or two from another.</p>' +
        f'<div class="sets">{sets}</div>' +
        '<div class="note"><b>Please read this part.</b> These are journals and planners. They are '
        'not therapy, treatment, diagnosis or medical care, and they do not replace them. If any '
        'of this is making daily life hard, talking to a doctor is worth more than any planner. '
        '<b>If you are in danger or thinking about harming yourself, contact your local emergency '
        'number or a crisis line now.</b> Small Light page 8 is where you write those numbers '
        'down &mdash; do that today, while you can.</div>' +
        '<div class="steps">' +
        '<div class="step"><span class="n">1</span><div><h3>Open the second sheet first</h3>'
        '<p>&ldquo;Which page today&rdquo; is a table: what is happening on the left, which set and '
        'page on the right. Print it and keep it at the front of the folder.</p></div></div>' +
        '<div class="step"><span class="n">2</span><div><h3>Print one daily page, not four</h3>'
        '<p>Pick the set that matches this month and print ten copies of its first page. '
        'Four daily pages is four decisions before breakfast.</p></div></div>' +
        '<div class="step"><span class="n">3</span><div><h3>Fill the written-when-calm pages early</h3>'
        '<p>Same Shape 4 and 5, Steady 9, Small Light 2 and 8 are written on a good day and used '
        'on a bad one. That is the whole point of them.</p></div></div>' +
        '</div>')

def page_which():
    rows = "".join(
        f'<div class="rt"><span class="what">{what}</span>'
        f'<span class="dot {key}"></span><span class="set-name">{name}</span>'
        f'<span class="pg">{pg}</span><span class="why">{why}</span></div>'
        for what, key, name, pg, why in ROUTES)
    return sheet("Which page<br><em>today?</em>", "Index sheet &middot; keep this at the front",
        '<div class="sec"><span class="lbl">Find the line that is closest</span>'
        '<span class="line"></span><span class="hint">Nothing here has to be used in order</span></div>' +
        '<div class="rt head"><span>What is happening</span><span></span><span>Set</span>'
        '<span>Page</span><span>What that page does</span></div>' +
        f'<div class="routes">{rows}</div>' +
        '<div class="sec" style="padding-top:14px"><span class="lbl">The three I actually use</span>'
        '<span class="line"></span><span class="hint">Write them here after a fortnight</span></div>' +
        '<div class="mine">' +
        "".join(f'<div class="fr"><span class="flbl">{i}</span>'
                f'<span class="blank" data-field="b_mine_{i}" data-ftype="text" '
                f'data-fsize="11"></span></div>' for i in (1, 2, 3)) +
        '</div>')

def render_html(size, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-bundle.css")
    return (f'<meta charset="utf-8">\n<title>Four Set Bundle</title>\n{fonts}\n'
            f'<style>{css(size)}</style>\n{page_start()}{page_which()}\n')

# --------------------------------------------------------------------------- build

def build_sheets(work):
    for size in SIZES:
        src = render_html(size, embed_fonts=True)
        path = os.path.join(work, f"render-bundle-{size}.html")
        open(path, "w", encoding="utf-8").write(src)
        out = os.path.join(DIST, f"00-START-HERE-and-INDEX-{size}.pdf")
        B.to_pdf(path, out)
        print(f"  bundle sheets ({size})")
    open(os.path.join(ROOT, "bundle-sheets.html"), "w", encoding="utf-8").write(
        render_html("letter", embed_fonts=False))

def package():
    """Five files, which is Etsy's maximum: three zips and the two loose sheets."""
    out = os.path.join(DIST, "etsy")
    os.makedirs(out, exist_ok=True)

    members = []          # (arcname, path)
    for s in SETS:
        d = os.path.join(ROOT, s["dist"])
        if not os.path.isdir(d):
            raise SystemExit(f"missing {s['dist']} — build that set first")
        for f in sorted(x for x in os.listdir(d) if x.endswith(".pdf")):
            members.append((f"{s['folder']}/{f}", os.path.join(d, f)))
    sheets = [(f, os.path.join(DIST, f)) for f in sorted(os.listdir(DIST))
              if f.startswith("00-") and f.endswith(".pdf")]

    def zip_up(name, entries):
        p = os.path.join(out, name)
        with zipfile.ZipFile(p, "w", zipfile.ZIP_DEFLATED) as z:
            for arc, src in entries:
                z.write(src, arc)
        print(f"  {name}  ({os.path.getsize(p)/1e6:.1f} MB, {len(entries)} files)")

    zip_up("Mental-Health-Bundle-COMPLETE.zip", sheets + members)
    zip_up("Mental-Health-Bundle-Letter.zip",
           sheets + [m for m in members if "letter" in m[0]])
    zip_up("Mental-Health-Bundle-A4.zip",
           sheets + [m for m in members if "a4" in m[0]])
    for f, src in sheets:
        import shutil
        shutil.copy(src, os.path.join(out, f))
    print(f"  + {len(sheets)} loose sheets -> {3 + len(sheets)} files, Etsy's maximum is 5")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-bundle.css")

    def png(pdf, page=0, dpi=110):
        doc = pymupdf.open(pdf)
        f = os.path.join(work, os.path.basename(pdf).replace(".pdf", f"-{page}.png"))
        doc[page].get_pixmap(dpi=dpi).save(f)
        return "data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode()

    firsts = [png(os.path.join(ROOT, s["dist"], f)) for s in SETS
              for f in sorted(os.listdir(os.path.join(ROOT, s["dist"])))
              if f.endswith("letter-" + ("signal" if s["key"] == "adhd" else
                                         "calm" if s["key"] == "autism" else
                                         "steady" if s["key"] == "anxiety" else "warm")
                            + "-print.pdf")]
    index = png(os.path.join(DIST, "00-START-HERE-and-INDEX-letter.pdf"), page=1)
    start = png(os.path.join(DIST, "00-START-HERE-and-INDEX-letter.pdf"), page=0)

    over = (
        "<style>"
        "h1{font-family:'Instrument Serif',Georgia,serif;font-weight:400}"
        f"h1 em{{font-style:italic;color:{SETS[2]['colour']}}}"
        "body{font-family:'Public Sans',Arial,sans-serif}"
        f"body{{color:{INK}}} .sub{{color:{SOFT}}}"
        f".eyebrow{{color:{SOFT};font-family:'Public Sans';font-weight:600;letter-spacing:.14em}}"
        ".rule{height:5px;width:260px;display:flex;background:none;overflow:hidden}"
        f".badge{{border-color:{STRONG};color:{INK};font-family:'Public Sans';font-weight:500;"
        "letter-spacing:.04em;text-transform:none}"
        ".four{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;flex:1;"
        "align-content:center;justify-items:center}"
        ".four > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".card{background:#fff;box-shadow:0 14px 34px rgba(34,36,43,.16)}"
        ".card img{width:100%;display:block}"
        f".cap{{font-family:'Public Sans',Arial,sans-serif;font-weight:600;font-size:21px;"
        f"color:{INK};padding:14px 2px 2px}}"
        f".capsub{{font-size:18px;color:{SOFT}}}"
        "</style>")

    stripe = "".join(f'<i style="flex:1;background:{s["colour"]}"></i>' for s in SETS)
    cards = "".join(
        f'<div><div class="card"><img src="{im}"></div>'
        f'<div class="cap">{s["name"]}</div><div class="capsub">{s["who"]} &middot; {s["pages"]} pages</div></div>'
        for im, s in zip(firsts, SETS))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Four sets &middot; 35 pages &middot; fillable PDF</span>
          <h1>Four sets,<br><em>one shelf.</em></h1>
          <span class="rule">{stripe}</span>
          <p class="sub">Attention, predictability, worry and low days &mdash; four planning sets,
          each designed on its own terms, plus an index sheet that tells you which page to open
          today.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">35 pages</span>
          <span class="badge">Undated</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{index}">
      </div>'''
    four = f'''
      <span class="eyebrow">What is in the bundle</span>
      <h1>Four sets,<br><em>not four copies.</em></h1>
      <div class="four" style="margin-top:40px">{cards}</div>'''
    detail = f'''
      <span class="eyebrow">The sheet that only comes with the bundle</span>
      <h1>Which page<br><em>today?</em></h1>
      <p class="sub">Seventeen lines: what is happening on the left, which set and which page on
      the right. Keep it at the front of the folder so a bad morning is a lookup, not a decision.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{index}" style="height:1040px"><img src="{start}" style="height:1040px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#eef0f3", "100px", "84px", hero),
                                       ("02-four", "#ffffff", "80px", "62px", four),
                                       ("03-index", "#f1f3f5", "100px", "76px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-bundle-{name}.html")
        open(hp, "w", encoding="utf-8").write(page)
        B.to_png(hp, os.path.join(DIST, f"listing-{name}.png"), 2000, 2000, scale=1)
        print(f"  listing image {name}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sheets", action="store_true", help="only the two bundle pages")
    args = ap.parse_args()

    os.makedirs(DIST, exist_ok=True)
    os.makedirs(WORK, exist_ok=True)

    print("Building bundle ->", DIST)
    build_sheets(WORK)
    if args.sheets:
        return
    build_mockups(WORK)
    package()

if __name__ == "__main__":
    main()
