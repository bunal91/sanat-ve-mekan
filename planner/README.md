# Dusk Ladder — Daily Planner (Etsy product pack)

A printable one-page daily planner, built once and generated into every variant a digital
download listing needs: two page sizes, two colourways, two languages, print and fillable.

```
planner/
├── build.py                     # generator: HTML -> PDFs, form fields, listing images, ZIPs
├── src/
│   ├── planner.template.html    # the planner itself (single source of truth)
│   ├── readme.template.html     # the "start here" sheet the buyer opens first
│   └── mockup.template.html     # 2000x2000 Etsy listing images
├── daily-planner.html           # browser/preview copy (Letter · dusk · EN)
├── etsy-rehberi.html            # Turkish guide: turning this into an Etsy shop
└── dist/                        # generated — 16 planner PDFs, 2 start-here sheets,
    └── etsy/                    #   3 listing images, and the 5-file Etsy upload set
```

## Build

```bash
pip install pypdf reportlab          # only needed for the fillable PDFs
python3 build.py                     # everything
python3 build.py --only a4-mono-tr   # one variant
python3 build.py --extras            # start-here sheets + listing images + ZIPs
python3 build.py --canva-link "https://www.canva.com/design/..."   # bake the template link in
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

## How the fillable PDFs are made

The template marks every writable slot with `data-field`. `build.py` lays the page out in
headless Chromium at print geometry, reads back each rectangle with `getBoundingClientRect`,
converts CSS px to PDF points, and draws the AcroForm widgets there with ReportLab; the
Chromium-rendered design is then merged on top (annotations always paint above page content).
Add a section to the template and its form fields follow automatically.

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
