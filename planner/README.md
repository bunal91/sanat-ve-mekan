# Printable planner shop — product packs

Twelve digital-download products (one of them a bundle), all generated from HTML templates: **Dusk Ladder**, a one-page
daily planner; **Party Line**, a nine-page birthday planning kit; **Confetti Club**, a nine-page
kids' party kit; **Golden Hour**, an eleven-page milestone birthday kit; **First Move**, an eight-page
ADHD-friendly planning set; **Same Shape**, a nine-page autism-friendly set; **Steady**, a nine-page anxiety journal;
**Small Light**, a nine-page journal for low days; **Thirty-First**, a nine-page Halloween
party kit; **Long December**, a nine-page Christmas planning kit; and **One Table**, a nine-page
Thanksgiving kit. Each has its own design language rather
than a recoloured shell. Every variant a listing
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
├── anxiety.py                    # anxiety journal: nine pages, worry window to calm plan
├── depression.py                 # low-days journal: nine pages, safety plan at the centre
├── bundle.py                     # the four mental-health sets as one product, plus its index sheet
├── halloween.py                  # Halloween party kit: nine pages, one night
├── christmas.py                  # Christmas kit: nine pages, the whole of December
├── thanksgiving.py               # Thanksgiving kit: nine pages, one meal, one oven
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
├── anxiety-journal.html         # browser/preview copy (Letter · steady · 9 pages)
├── low-days-journal.html        # browser/preview copy (Letter · warm · 9 pages)
├── bundle-sheets.html           # browser/preview copy of the two bundle-only pages
├── halloween-planner.html       # browser/preview copy (Letter · spooky · 9 pages)
├── christmas-planner.html       # browser/preview copy (Letter · spruce · 9 pages)
├── thanksgiving-planner.html    # browser/preview copy (Letter · harvest · 9 pages)
├── etsy-rehberi.html            # Turkish guide: shop setup, listing copy, pricing, niche
├── dist/                        # daily planner — 16 PDFs, 2 start-here sheets, 3 images, ZIPs
├── dist-birthday/               # birthday kit — 8 PDFs, start-here sheet, 3 images, ZIPs
├── dist-kids/                   # kids' kit — same shape
├── dist-milestone/              # milestone kit — same shape
├── dist-adhd/                   # ADHD set — same shape
├── dist-autism/                 # autism-friendly set — same shape
├── dist-anxiety/                # anxiety journal — same shape
├── dist-depression/             # low-days journal — same shape
├── dist-bundle/                 # bundle sheets, listing images, foldered zips
├── dist-halloween/              # Halloween kit — same shape
├── dist-christmas/              # Christmas kit — same shape
└── dist-thanksgiving/           # Thanksgiving kit — same shape
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
python3 anxiety.py                   # the anxiety journal
python3 depression.py                # the low-days journal
python3 bundle.py                    # bundle sheets + foldered zips (build the four sets first)
python3 halloween.py                 # the Halloween kit
python3 christmas.py                 # the Christmas kit
python3 thanksgiving.py              # the Thanksgiving kit
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

## The anxiety journal

Nine pages using tools that have been published as self-help for decades: a daily page that starts
by asking how much is in the tank and ends by comparing what was feared with what happened; a worry
window with a closing time and a solve/park split; a thought record; an evidence log of predictions
against outcomes; control sorting; a body page with a drawn figure, 5-4-3-2-1 grounding and a
printed breathing pattern; small steps rated before and after; a nights page including a "three in
the morning" box; and a calm plan with contacts and a blank for the reader's local crisis line.

Newsreader and Karla, sea/sand/moss on white, no red anywhere. Every page footer reads *"A journal,
not medical advice"*, and the delivery sheet says the same at length, including a line asking the
reader to fill in their crisis line while calm.

## The low-days journal

Nine pages written for very low capacity. The daily page is finishable in two minutes and treats
getting out of bed, drinking water and taking medication as entries. Page 2 is a capacity ladder
written on a steadier day — what a 1 looks like, what a 5 looks like, what an 8 looks like — so a
flat morning means reading a plan rather than making one. Page 3 logs activity with mood before
and after, which is where the evidence comes from. Then a gentle page for the harshest thought,
an anhedonia-aware list of small good things, contact prompts with ready-made messages, a weekly
basics grid, a safety plan, and a look back.

**Safety is structural here, not a footnote.** Page 8 opens with a framed block saying that if
someone is thinking about ending their life this page is not enough, and pointing to the local
emergency number; it has fields for the reader's own crisis and emergency numbers and asks them
to photograph the page. Every page footer reads *"A journal, not medical care · page 8 has the
numbers"*, and the delivery sheet says plainly that depression is treatable, that this is not
treatment, and that speaking to a doctor is the most useful thing on the list.

## The bundle

`bundle.py` packages the four mental-health sets as one product. The discount is not what makes it
worth buying — two pages that exist only here are:

- **Which page today?** — a seventeen-line decision table. What is happening on the left ("I cannot
  make myself start", "something changed and I am thrown", "I cannot stop turning it over", "it is
  very dark today"), which set, which page, and what that page does on the right. A bad morning
  becomes a lookup instead of a decision.
- **Four sets, one shelf** — what each set is for, which to open first, the safety note, and a
  list of the pages meant to be filled in on a good day and used on a bad one.

Files are zipped foldered by set, in complete / Letter / A4 splits, which with the two loose
sheets is exactly the five files an Etsy listing accepts.

## The Halloween kit

Nine pages locked to one date: at a glance with a five-box **scare-level dial** that settles every
later decision, a four-week countdown, a guest list with a *coming as* column so two people do not
arrive as the same thing, costumes and prize categories with a repair kit by the mirror, a menu,
decor room by room, a pumpkin page, an hour-by-hour run of show with seven beats and a
trick-or-treating checklist, and a page for the first of November. 562 form fields, four variants.

Two things are load-bearing rather than decorative. The pumpkin page says **carve on the 30th, not
the 28th** and explains why (about three days indoors, about five outside in the cold) — the one
fact most people learn by ruining a pumpkin. And two framed safety boxes: dry ice goes in the bowl
*around* the punch, never in the drink and never in a sealed bottle; real candles only where
nothing hangs and nobody walks, LED tea lights inside pumpkins and near costumes.

Anton for poster headlines with Rubik for everything else; pumpkin orange, poison green and violet
on **white** — a black page looks good on screen and eats a toner cartridge in a printer, which
buyers write about in reviews. The cobweb in each masthead is drawn from three arcs on six radials
rather than dropped in as clip-art.

## The Christmas kit

Nine pages for the month rather than the day, because what makes Christmas hard is the thirty days
before it: at a glance (with a spending cap and a *what we are not doing this year* box), December
day by day with the dates that are not yours to move, gifts, cards and post, the food plan, lunch
timed backwards, the house and the beds, the day itself, and the week after. 762 form fields — the
largest kit in the shop — in four variants.

Two pages carry the product. **Page 3** is the gift list with a budget column, a spent column and a
budgeted/spent/left total, so December is not a surprise in January. **Page 6** is the oven clock:
one box at the top for the hour you sit down, then every dish with its temperature, minutes, *in
at* and *out at* — Christmas lunch written backwards, which is the only way it works. Page 2 leaves
the last posting dates deliberately blank: they move every year and differ by country, so the kit
asks the buyer to look them up rather than printing a date that would be wrong.

Gilda Display over Manrope; spruce, berry and brass on white — no red-and-green cliché, and no
clip-art. The masthead sprig is drawn: needle pairs stepped along a quadratic Bézier, the stem
angle shifting one page to the next. Colour has a job — green is the day and the house, berry is
money and deadlines, brass is people.

## The Thanksgiving kit

Nine pages for one meal and the people around it: at a glance with a headcount that sizes the
bird, the bird worked out from its weight, who is bringing what, one oven and everything else,
the shopping, the table, the three days before, the day, and Friday. 617 form fields, four
variants.

Three things carry it. **Page 2** is a weight table — tick your band and read the fridge thaw
time and the roasting time — with the dates then written backwards from the meal, plus a framed
box giving the only number that decides whether a turkey is cooked (165°F / 74°C in the thigh and
the breast, clear of the bone) and a cold-water rescue for a bird still frozen on the morning.
**Page 3** is the potluck list, and its point is the *oven* column: a guest arriving with a
casserole that wants forty minutes at 375°F while the turkey rests is the commonest way the meal
runs late, so the kit makes you ask and moves the answer onto page 4. **Page 4** is that oven,
counted back from the hour you sit down, next to a column for every dish moved off it.

DM Serif Display over DM Sans; maple, sage and cranberry on white. The masthead mark is a place
setting — plate, fork, knife and the fold of a napkin — drawn in strokes, the napkin angle shifting
page to page. Colour has a job: maple is the food and the oven, sage the people and the table,
cranberry anything with a clock on it. Weights and temperatures lead in lb and °F with kg and °C
alongside, because the buyers are overwhelmingly American.

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
