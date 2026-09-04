# Printable planner shop — product packs

Six digital-download products, all generated from HTML templates: **Dusk Ladder**, a one-page
daily planner; **Party Line**, a nine-page birthday planning kit; **Confetti Club**, a nine-page
kids' party kit; **Golden Hour**, an eleven-page milestone birthday kit; **First Move**, an eight-page
ADHD-friendly planning set; and **Same Shape**, a nine-page autism-friendly set. Each has its own
design language rather than a recoloured shell. Every variant a listing
needs — page sizes, colourways, languages, print and fillable — comes out of one build.

No Canva templates: the products are sold as fillable PDFs, so the listing promises typing into
fields, not editing the design.

```
planner/
├── build.py                     # daily planner: HTML -> PDFs, form fields, listing images, ZIPs
├── birthday.py                   # birthday kit: nine pages, multi-page fillable, same plumbing
├── kids.py                       # kids' party kit: same plumbing, its own design language
├── milestone.py                  # milestone kit (50th/60th/90th): eleven pages
├── adhd.py                       # ADHD-friendly set: eight pages, fewer slots on purpose
├── autism.py                     # autism-friendly set: nine pages, same shape every page
├── src/
│   ├── planner.template.html    # the daily planner (single source of truth)
│   ├── readme.template.html     # the "start here" sheet the buyer opens first (both products)
│   └── mockup.template.html     # 2000x2000 Etsy listing images
├── daily-planner.html           # browser/preview copy (Letter · dusk · EN)
├── birthday-planner.html        # browser/preview copy (Letter · party · 9 pages)
├── kids-party-planner.html      # browser/preview copy (Letter · confetti · 9 pages)
├── milestone-planner.html       # browser/preview copy (Letter · gold · 11 pages)
├── adhd-planner.html            # browser/preview copy (Letter · signal · 8 pages)
├── autism-planner.html          # browser/preview copy (Letter · calm · 9 pages)
├── etsy-rehberi.html            # Turkish guide: shop setup, listing copy, pricing, niche
├── dist/                        # daily planner — 16 PDFs, 2 start-here sheets, 3 images, ZIPs
├── dist-birthday/               # birthday kit — 8 PDFs, start-here sheet, 3 images, ZIPs
├── dist-kids/                   # kids' kit — same shape
├── dist-milestone/              # milestone kit — same shape
├── dist-adhd/                   # ADHD set — same shape
└── dist-autism/                 # autism-friendly set — same shape
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
python3 kids.py                      # the kids' party kit
python3 milestone.py                 # the milestone kit
python3 adhd.py                      # the ADHD-friendly set
python3 autism.py                    # the autism-friendly set
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

## The kids' party kit

Nine pages aimed at the parent, not the party: guest list with the grown-up's phone number and a
pick-up time per child, a framed allergy page with a "every helper has read this" tick, games with
minutes and an energy meter, goodie bags costed per bag, and a party day built as six beats inside
two hours. 721 form fields, four variants.

Its design is deliberately louder: Fredoka and Nunito, a seeded confetti scatter in each masthead
(deterministic, so reprints match), balloon countdown markers, dotted rules, pill section labels.
Five colours with jobs — pink the birthday kid, sun food, sky people, lime done, grape time.
`kids.py` reuses `birthday.py`'s measurement, AcroForm and packaging helpers.

## The milestone kit

Eleven pages for a 50th, 60th or 90th: a three-month countdown, a guest list with a "how they know
them" column because the room spans five decades, a surprise page written as instructions (cover
story, who is in on it, the reveal step by step, and what to do if they find out), vendors and
budget, menu and bar, speeches with minutes against each speaker, a slideshow page that tracks
photographs by decade and messages from those who cannot come, a seating plan, the run of show,
and thank-yous. 839 form fields, four variants.

Its identity is the quiet one: Cormorant Garamond and Jost, gold and garnet on white, roman
numeral page numbers, a hairline-and-gold rule under each masthead.

## The ADHD-friendly set

Eight pages, and the constraints are the product: one real task a day (two more only if that one
is done), a first-move box for the single physical action that starts it, a brain dump with a
five-column triage that includes *let it go*, a task-breakdown page, a guess-versus-actual time
page that teaches you your own multiplier, a light week, morning and evening anchors, a weekly
maintenance grid, and a wins page that records what actually happened.

Type is deliberately larger than the other kits and set in Atkinson Hyperlegible, a face designed
for legibility, with Bricolage Grotesque for display. Colour is used only as a signal: teal for
what to do now, amber for what is parked on purpose, plum for how the day felt, green for done.
The delivery sheet states plainly that this is a planning tool and not medical advice.

## The autism-friendly set

Nine pages built on predictability rather than motivation, and deliberately not a recolour of the
ADHD set: the day as a sequence with a first/then box, a week where every day has the same three
parts, a page for when the plan changes (what changed, what it affects, and in its own frame what
stays exactly the same), a sensory page naming the two ends of each sense, a hard-moment plan
written on a calm day including what does *not* help, prepared sentences with worked examples,
appointment preparation, decisions made once, and a weekly energy budget.

Every page carries the identical layout rhythm, the same three muted colours (sage = as expected,
clay = something changed, lavender = how it felt) and a key in the footer. Type is Lexend with IBM
Plex Mono for times and labels; language is literal, with no idioms. The delivery sheet states
that it is a planning tool and not medical advice, and that any page can be ignored or rewritten.

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
