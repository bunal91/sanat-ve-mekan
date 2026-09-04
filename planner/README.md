# Printable planner shop — product packs

Two digital-download products, both generated from HTML templates: **Dusk Ladder**, a one-page
daily planner, and **Party Line**, a nine-page birthday planning kit. Every variant a listing
needs — page sizes, colourways, languages, print and fillable — comes out of one build.

No Canva templates: the products are sold as fillable PDFs, so the listing promises typing into
fields, not editing the design.

```
planner/
├── build.py                     # daily planner: HTML -> PDFs, form fields, listing images, ZIPs
├── birthday.py                   # birthday kit: nine pages, multi-page fillable, same plumbing
├── src/
│   ├── planner.template.html    # the daily planner (single source of truth)
│   ├── readme.template.html     # the "start here" sheet the buyer opens first (both products)
│   └── mockup.template.html     # 2000x2000 Etsy listing images
├── daily-planner.html           # browser/preview copy (Letter · dusk · EN)
├── birthday-planner.html        # browser/preview copy (Letter · party · 9 pages)
├── etsy-rehberi.html            # Turkish guide: shop setup, listing copy, pricing, niche
├── dist/                        # daily planner — 16 PDFs, 2 start-here sheets, 3 images, ZIPs
└── dist-birthday/               # birthday kit — 8 PDFs, start-here sheet, 3 images, ZIPs
```

## Build

```bash
pip install pypdf reportlab          # only needed for the fillable PDFs
python3 build.py                     # everything
python3 build.py --only a4-mono-tr   # one variant
python3 build.py --extras            # start-here sheets + listing images + ZIPs
python3 birthday.py                  # the birthday kit, every size and colourway
python3 birthday.py --only letter-party
python3 birthday.py --extras         # start-here sheet + listing images + ZIPs
```

Chromium (headless) does the rendering and prints the PDFs at exact page size; `PLANNER_WORK`
sets the scratch directory. Fonts are pulled once from Google Fonts and cached, then inlined as
data URIs so every PDF is self-contained.

## What gets generated

| Output | Count | Notes |
| --- | --- | --- |
| `daily-planner-{size}-{colourway}-{lang}-print.pdf` | 8 | Letter + A4 · dusk + mono · EN + TR |
| `daily-planner-…-fillable.pdf` | 8 | same pages, 61 AcroForm fields (lines, task boxes, day chips, mood scale) |
| `00-START-HERE-{lang}.pdf` | 2 | file list, Canva link button, print settings, licence |
| `listing-0{1,2,3}.png` | 3 | 2000×2000 listing images |
| `etsy/*.zip` | 3 | complete / Letter / A4 — with the two sheets, exactly Etsy's 5-file limit |

## The birthday kit

Nine pages: at a glance · countdown · guest list & RSVP · budget · vendors & helpers ·
cake, food and drink · shopping · run of show · gifts & thanks. Each page carries its own
masthead with the name and date, so a single printed sheet still makes sense on its own.
746 form fields per kit; four variants (Letter/A4 × colour/mono).

Its identity is deliberately a sibling, not a copy, of the daily planner: Fraunces for the
display line, Archivo for labels, IBM Plex Sans for data. Blue carries structure, citrus the
celebration, coral what is running out of time, mint what is settled — the countdown bands run
blue → mint → citrus → coral → ink as the party gets closer.

## How the fillable PDFs are made

The template marks every writable slot with `data-field`. `build.py` lays the page out in
headless Chromium at print geometry, reads back each rectangle with `getBoundingClientRect`,
converts CSS px to PDF points, and draws the AcroForm widgets there with ReportLab; the
Chromium-rendered design is then merged on top (annotations always paint above page content).
Add a section to the template and its form fields follow automatically. `birthday.py` extends
this across pages: each field is measured relative to its own sheet, and the overlay is built
page by page before the design is merged on top.

## Design notes

- **Type:** Bodoni Moda for the display line and priority numerals; Barlow Condensed for tracked
  uppercase labels; IBM Plex Sans with tabular numerals for the hour ladder. All three are SIL OFL.
- **Colour:** black on white, with one accent — a dusk ramp (amber → coral → rose → violet) down
  the schedule rail, so the gradient reports time of day rather than decorating. The `mono`
  colourway swaps it for graphite to save ink; the layout is identical.
- **Print:** `@page` at exact size with zero margins and `print-color-adjust: exact`. Every
  PDF is verified as a single page at 612×792 pt (Letter) or 595×842 pt (A4).

## Licence

The design is original. Fonts are SIL OFL — embedding and commercial use are permitted, selling
the font files themselves is not. The buyer-facing licence (personal use, no resale) is stated on
the START-HERE sheet.
