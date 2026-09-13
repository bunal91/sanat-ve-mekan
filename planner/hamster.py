#!/usr/bin/env python3
"""Build the Small Hours hamster care kit.

Nine pages for an animal almost every kit gets wrong. A hamster is awake when
you are not, lives two or three years rather than fifteen, is solitary in a way
that is not negotiable, and is kept well or badly almost entirely by numbers --
floor area, bedding depth, wheel diameter, room temperature, grams. So this kit
measures things: the home, the week, the food and the hoard, the night, the
hands, the sitter's page, and the log that also has room for growing old.

    python3 hamster.py                  # every size / colourway
    python3 hamster.py --only letter-night
    python3 hamster.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, math, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-hamster")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Petrona:ital,wght@0,500;0,600;0,700;1,500"
          "&family=Work+Sans:wght@400;500;600;700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="35pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="34pt"),
}

COLORWAYS = {
    # dusk = the routine, sand = the hamster, alarm = anything you telephone about.
    "night": dict(ink="#1b1d2a", soft="#535768", faint="#8b8f9d", rule="#e4e5ea",
                  strong="#c4c6cf", dusk="#454b7d", sand="#a87a3e", alarm="#8e3b4e"),
    "mono":  dict(ink="#1f2022", soft="#585a5e", faint="#919399", rule="#e6e7e9",
                  strong="#c5c7cb", dusk="#3c3e44", sand="#8a8d92", alarm="#3c3e44"),
}

PAGES = 9
MARK = "Awake when you are not."
HEALTH_FOOT = "A record book, not veterinary advice &middot; page 2 has the numbers"

MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# The numbers a hamster is kept well or badly by. Every figure gets a blank
# beside it, because the point of the page is to measure what you actually have.
HOME = [
    ("Unbroken floor area", "100 &times; 50 cm is what most keepers work to"),
    ("Bar spacing, if barred", "1 cm or less, or a dwarf will get out"),
    ("Bedding depth, deepest corner", "25&ndash;40 cm, so they can dig a burrow"),
    ("Wheel diameter", "Syrian 28 cm+, dwarf 20 cm+, solid surface"),
    ("Sand bath dish", "Play or chinchilla sand &mdash; never dust, never water"),
    ("Hides", "At least two, and one with more than one room"),
    ("Chews and gnawing wood", "The front teeth never stop growing"),
    ("Water", "Bottle and a shallow dish; checked every day"),
    ("Room temperature", "18&ndash;24&deg;C, out of sun and draughts"),
]

# Lifespan and company, which differ enough between species to be worth printing.
SPECIES = [
    ("Syrian", "Alone, always", "2&ndash;3"),
    ("Chinese", "Alone", "2&ndash;3"),
    ("Roborovski", "Pairs sometimes", "3"),
    ("Winter White", "Pairs sometimes", "1&frac12;&ndash;2"),
    ("Campbell&#8217;s", "Pairs sometimes", "1&frac12;&ndash;2"),
]

# --------------------------------------------------------------------------- helpers

def check(f, tone=""):
    return f'<span class="box {tone}" data-field="{f}" data-ftype="check"></span>'

def blank(f, cls="", fs="10.5"):
    return f'<span class="blank {cls}" data-field="{f}" data-fsize="{fs}"></span>'

def sec(label, hint="", tone=""):
    """Rule above the label, not beside it -- the whole page reads in bands."""
    hint = f'<span class="hint">{hint}</span>' if hint else ""
    return (f'<div class="sec {tone}"><span class="over"></span>'
            f'<span class="lbl">{label}</span>{hint}</div>')

def field(label, f, cls="", fs="10.5"):
    return f'<div class="fr"><span class="flbl">{label}</span>{blank(f, cls, fs)}</div>'

def wheel(seed=1):
    """A wheel, drawn, turned a little further on every page."""
    cx, cy, r = 62, 54, 40
    a0 = seed * 14
    spokes = []
    for i in range(8):
        a = math.radians(a0 + i * 45)
        spokes.append(f'<path d="M{cx + 9 * math.cos(a):.1f} {cy + 9 * math.sin(a):.1f} '
                      f'L{cx + r * math.cos(a):.1f} {cy + r * math.sin(a):.1f}"/>')
    return (f'<svg class="wheel" viewBox="0 0 124 116" aria-hidden="true">'
            f'<g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">'
            f'<circle cx="{cx}" cy="{cy}" r="{r}"/><circle cx="{cx}" cy="{cy}" r="{r - 5}"/>'
            f'<circle cx="{cx}" cy="{cy}" r="8.5"/>{"".join(spokes)}'
            f'<path d="M{cx - 26} {cy + 44} L{cx} {cy + 9} L{cx + 26} {cy + 44}"/>'
            f'<path d="M{cx - 32} {cy + 46} L{cx + 32} {cy + 46}"/></g></svg>')

def sheet(n, title, kicker, body, note=None):
    meta = (f'<div class="mini">{field("Date", f"h{n}_date", "w2", "9")}</div>' if n > 1 else '')
    return f'''
<div class="sheet">
  <div class="strip"><span class="kicker">{kicker}</span>
    <span class="dotline"></span><span class="pageno">{n}<i>&thinsp;/&thinsp;{PAGES}</i></span></div>
  <header class="mast"><h1>{title}</h1>
    <div class="mastright">{wheel(n)}{meta}</div></header>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{note or MARK}</span>
    <span class="seeds"><i></i><i></i><i></i></span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    return sheet(1, "This<br>hamster.", "Hamster kit &middot; who they are",
        '<div class="two b46"><section>' +
        sec("The facts", "One sheet each", "dusk") +
        field("Name", "h1_name") +
        field("Species", "h1_species") +
        '<div class="split2">' + field("Male / female", "h1_sex", "w2") +
        field("Colour", "h1_colour", "w2") + '</div>' +
        '<div class="split2">' + field("Born or about", "h1_born", "w2") +
        field("Came home", "h1_came", "w2") + '</div>' +
        field("Where from, and what they were kept in", "h1_from") +
        field("Anything known about before", "h1_before") +
        '<div class="warn alarm">'
        '<b>A Syrian lives alone. That part is not negotiable.</b>'
        '<p>Syrians turn on a cage mate somewhere around eight weeks old, and the fight is usually '
        'found in the morning. Chinese are solitary too. Dwarf species are sometimes kept in '
        'same-sex pairs from the same litter, in a very large cage with two of everything &mdash; '
        'and even then it can end, quickly, at any age. One hamster per cage is the version that '
        'always works.</p>'
        '</div>' +
        sec("How long we have them", "", "sand") +
        '<div class="sp head"><span>Species</span><span>Kept</span>'
        '<span class="w3">Years</span></div>' +
        "".join(f'<div class="sp"><span class="spn">{a}</span><span class="spk">{b}</span>'
                f'<span class="spy">{c}</span></div>' for a, b, c in SPECIES) +
        '<div class="split2">' + field("Ours", "h1_span", "w2") +
        field("Old at about", "h1_old", "w2") + '</div>' +
        '<span class="footnote">A hamster of eighteen months is an old animal. Page 9 is where '
        'that gets written down rather than noticed too late.</span>' +
        '</section><section>' +
        sec("What they are like", "What a stranger would need", "sand") +
        field("When they get up", "h1_wake") +
        field("When they go quiet", "h1_sleep") +
        field("Where they sleep, and their nest", "h1_nest") +
        field("Where they have hoarded", "h1_hoard") +
        field("How they are picked up", "h1_lift") +
        field("What makes them jumpy", "h1_jumpy") +
        field("Have they bitten, and what happened", "h1_bite") +
        sec("Things they already do that are theirs", "", "sand") +
        "".join(f'<div class="wl">{blank(f"h1_quirk_{i}", "grow", "10.5")}</div>'
                for i in range(1, 4)) +
        sec("Escaping", "Assume it will happen once", "alarm") +
        "".join(f'<div class="wl">{check(f"h1_esc_{i}", "alarm")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Door and lid checked every night, by one named person",
                                       "Gaps under doors blocked in the room they are in",
                                       "A bucket, a ramp and some seed is how they are caught",
                                       "Flour on the floor overnight shows you the room"],
                                      start=1)) +
        '</section></div>')

EMERGENCIES = [
    "Watery diarrhoea and a wet, dirty bottom, hunched and not moving &mdash; wet tail, and in a "
    "young Syrian it can kill in a day or two",
    "Cold, stiff and seemingly dead in a cold room &mdash; this can be torpor. Warm the room "
    "slowly, warm them in your hands, and phone",
    "Breathing with effort, clicking or squeaking, or a wet nose and eyes",
    "Not eating, not drinking, and nothing new in the hoard for a day",
    "Drooling, a wet chin, or eating dropped food &mdash; the front teeth may be overgrown",
    "A bulging or closed eye, or a pouch that will not empty &mdash; never pull at a pouch",
    "A leg not being used after a fall, or caught in a wheel or bars",
    "Any lump that is new, or bleeding from anywhere",
]

def page_2():
    rows = "".join(
        f'<div class="em">{check(f"h2_em_{i}", "alarm")}<span class="emt">{t}</span></div>'
        for i, t in enumerate(EMERGENCIES, start=1))
    return sheet(2, "Numbers, and<br>when to use them.", "Hamster kit &middot; the page on the fridge",
        '<div class="two b46"><section>' +
        '<div class="warn alarm">'
        '<b>Find the vet before you need one</b>'
        '<p>Plenty of practices will happily register a hamster and have not treated one in years. '
        'Ask the question today, on the telephone, in these words: <b>do you have a vet who sees '
        'small exotics, and are they in at weekends?</b> Write down whoever says yes, because a '
        'hamster that is unwell in the evening does not have until Monday.</p>'
        '</div>' +
        sec("The practice", "", "dusk") +
        field("Vet who sees exotics", "h2_vet") +
        field("Daytime number", "h2_day") +
        field("Address", "h2_addr") +
        sec("Out of hours &mdash; usually somewhere else", "", "alarm") +
        field("Who covers nights", "h2_ooh_who") +
        field("Number", "h2_ooh_num") +
        field("Address, and how long it takes", "h2_ooh_addr") +
        sec("Also worth having", "", "dusk") +
        field("Who drives, if it is the evening", "h2_drive") +
        field("Insurance, if any", "h2_ins") +
        field("Whoever has a spare key", "h2_key") +
        sec("The carry box, made up in advance", "", "sand") +
        "".join(f'<div class="wl">{check(f"h2_box_{i}", "sand")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["A small solid box with a lid and air holes",
                                       "A handful of their own bedding, so it smells right",
                                       "A slice of cucumber instead of a water bottle",
                                       "Kept warm on the way, never on a cold car seat"], start=1)) +
        '</section><section>' +
        sec("Phone now, do not wait until morning", "", "alarm") +
        f'<div class="ems">{rows}</div>' +
        '<span class="footnote">This list is the short version of what vets who see small animals '
        'ask people to come in for. It is not a diagnosis and it is not complete. A hamster hides '
        'being unwell until it is very unwell, so a hamster that seems wrong to you is a good '
        'enough reason to phone.</span>' +
        sec("Weight now, and what it was", "Grams, on kitchen scales", "dusk") +
        '<div class="split2">' + field("Now", "h2_wt", "w2") +
        field("A month ago", "h2_wt_old", "w2") + '</div>' +
        '</section></div>', note=HEALTH_FOOT)

def page_3():
    rows = "".join(
        f'<div class="hm"><span class="hmc"><b>{what}</b><i>{why}</i></span>'
        f'{blank(f"h3_ours_{i}", "", "10")}'
        f'<span class="c">{check(f"h3_ok_{i}", "dusk")}</span></div>'
        for i, (what, why) in enumerate(HOME, start=1))
    return sheet(3, "The home,<br>measured.", "Hamster kit &middot; the numbers that decide everything",
        '<div class="two b46"><section>' +
        sec("Measure what you actually have", "Ours, in centimetres", "dusk") +
        '<div class="hm head"><span class="hmc">What, and the figure to aim at</span>'
        '<span>Ours</span><span class="c">OK</span></div>' + rows +
        '<div class="warn">'
        '<b>Measure the floor, not the box</b>'
        '<p>Cage sizes on the shelf are measured generously and count shelves, tubes and lids as '
        'space. A hamster uses the floor: one unbroken rectangle it can run and dig in. Take a tape '
        'to the inside of the base, write the number above, and if it is short, a large flat-packed '
        'storage box with a mesh lid costs less than a cage and is usually bigger.</p>'
        '</div>' +
        sec("Where the cage is", "", "sand") +
        field("Room", "h3_room") +
        "".join(f'<div class="wl">{check(f"h3_pl_{i}", "sand")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Out of direct sun and away from a radiator",
                                       "Not in a draught, and not on the floor",
                                       "Not on or beside a television or speaker",
                                       "Somewhere a night-time noise will not wake the house"],
                                      start=1)) +
        '</section><section>' +
        '<div class="warn alarm">'
        '<b>Bedding: deep, plain, and never fluffy</b>'
        '<p>Paper-based bedding or unscented aspen, deep enough in at least one corner to hold a '
        'burrow that does not fall in. Not pine or cedar shavings. And <b>never</b> the fluffy '
        'cotton-wool bedding sold beside them: it wraps around legs, and it does not pass through '
        'a hamster that swallows it.</p>'
        '</div>' +
        sec("What we use", "", "dusk") +
        field("Bedding", "h3_bed") +
        field("Nesting material", "h3_nest") +
        field("Sand", "h3_sand") +
        field("Bought from", "h3_shop") +
        sec("The wheel", "Measured across, inside", "sand") +
        "".join(f'<div class="wl">{check(f"h3_wh_{i}", "sand")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Solid running surface, no bars and no mesh",
                                       "Their back stays flat when they run, not curved",
                                       "Quiet enough that nobody unplugs it at midnight",
                                       "Wiped weekly &mdash; it is where the wee ends up"],
                                      start=1)) +
        sec("Changed or added, and when", "", "dusk") +
        '<div class="cg head"><span>What changed</span><span class="w2">When</span></div>' +
        "".join(f'<div class="cg">{blank(f"h3_cg_{i}", "", "10")}'
                f'{blank(f"h3_cgw_{i}", "w2", "10")}</div>' for i in (1, 2, 3, 4)) +
        '</section></div>')

def page_4():
    rows = "".join(
        f'<div class="wkd"><span class="wkn">{d[:3]}</span>'
        f'<span class="c">{check(f"h4_w_{i}", "dusk")}</span>'
        f'<span class="c">{check(f"h4_f_{i}", "dusk")}</span>'
        f'<span class="c">{check(f"h4_s_{i}", "dusk")}</span>'
        f'<span class="c">{check(f"h4_e_{i}", "sand")}</span>'
        f'{blank(f"h4_n_{i}", "", "10")}</div>'
        for i, d in enumerate(DAYS, start=1))
    return sheet(4, "The<br>week.", "Hamster kit &middot; daily, weekly, monthly",
        '<div class="two b46"><section>' +
        sec("Every day", "W water &middot; F food &middot; S spot &middot; E eyes on", "dusk") +
        '<div class="wkd head"><span class="wkn">Day</span><span class="c">W</span>'
        '<span class="c">F</span><span class="c">S</span><span class="c">E</span>'
        '<span>Anything to note</span></div>' + rows +
        sec("What those four mean", "", "dusk") +
        "".join(f'<div class="wl">{check(f"h4_d_{i}", "dusk")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Water: bottle actually runs when you tap it",
                                       "Food: fresh food from yesterday taken out",
                                       "Spot: the wet corner lifted out and replaced",
                                       "Eyes on: seen awake and moving, not just a lump "
                                       "of bedding"], start=1)) +
        sec("Once a week", "", "sand") +
        "".join(f'<div class="wl">{check(f"h4_w7_{i}", "sand")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Wheel wiped, sand sieved or changed",
                                       "Hoard checked and anything fresh taken out",
                                       "Weighed, in grams, and written on page 5",
                                       "Looked over properly &mdash; page 7"], start=1)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>Do not clean it all at once</b>'
        '<p>A cage stripped and scrubbed is a hamster whose whole map of the world has been '
        'deleted, and that shows up as bar chewing, hoarding in a panic, or a bite. Change a part '
        'of the bedding at a time, put a handful of the old back in, and leave the nest alone '
        'unless it is wet. Hot water and a little unscented soap; no disinfectant smell.</p>'
        '</div>' +
        sec("Once a month, or when it needs it", "", "dusk") +
        "".join(f'<div class="wl">{check(f"h4_m_{i}", "dusk")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Part of the bedding changed, some of the old kept back",
                                       "Bottle taken apart and the spout checked",
                                       "Cage wiped, no strong cleaners",
                                       "Chews looked at and replaced"], start=1)) +
        sec("Who does what", "", "sand") +
        '<div class="wo head"><span>Job</span><span>Whose</span></div>' +
        "".join(f'<div class="wo">{blank(f"h4_j_{i}", "", "10")}'
                f'{blank(f"h4_jw_{i}", "", "10")}</div>' for i in (1, 2, 3, 4)) +
        sec("What we noticed this month", "", "dusk") +
        "".join(f'<div class="wl">{blank(f"h4_no_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

NEVER = [
    ("Citrus, onion, garlic", "Too acidic, or toxic outright"),
    ("Chocolate and sweets", "As bad here as in any other animal"),
    ("Sticky or sugary treats", "Yoghurt drops, honey sticks &mdash; pouches"),
    ("Almonds, apple pips", "Bitter almonds and pips carry cyanide"),
    ("Raw beans, raw potato", "Both are toxic uncooked"),
    ("Anything from the table", "Salt and fat, in an animal this small"),
]

def page_5():
    wrows = "".join(
        f'<div class="wt"><span class="wtn">{m}</span>{blank(f"h5_g_{i}", "w2", "10.5")}'
        f'{blank(f"h5_note_{i}", "grow", "10")}</div>'
        for i, m in enumerate(MONTHS, start=1))
    nev = "".join(
        f'<div class="tx"><span class="txn">{what}</span><span class="txw">{why}</span></div>'
        for what, why in NEVER)
    return sheet(5, "Food, and<br>the hoard.", "Hamster kit &middot; scattered, not poured",
        '<div class="two b46"><section>' +
        sec("What they eat", "A tablespoon of mix is a day", "sand") +
        '<div class="fd head"><span>What</span><span class="w2">How much</span>'
        '<span class="w2">When</span></div>' +
        "".join(f'<div class="fd">{blank(f"h5_f_{i}", "", "10")}'
                f'{blank(f"h5_fh_{i}", "w2", "10")}{blank(f"h5_fw_{i}", "w2", "10")}</div>'
                for i in range(1, 5)) +
        '<div class="warn">'
        '<b>Scatter it, do not put it in a bowl</b>'
        '<p>Throwing the day&#8217;s mix across the bedding turns dinner into an hour of foraging, '
        'which is most of the enrichment a hamster needs and costs nothing. A bowl is eaten in four '
        'minutes and the rest of the night is a wheel. Keep a bowl for the fresh food, which comes '
        'out again the next day.</p>'
        '</div>' +
        sec("Fresh, small and often", "A slice, not a plateful", "sand") +
        "".join(f'<div class="wl">{blank(f"h5_fr_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Never", "", "alarm") + f'<div class="txs">{nev}</div>' +
        sec("The hoard", "Checked weekly, not emptied", "dusk") +
        "".join(f'<div class="wl">{check(f"h5_h_{i}", "dusk")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Fresh food taken out before it turns",
                                       "The dry hoard left where it is &mdash; it is theirs",
                                       "A hoard that stops growing is worth a note"], start=1)) +
        '</section><section>' +
        sec("Weight, in grams", "Same scales, same day", "dusk") +
        '<div class="wt head"><span class="wtn">Month</span><span class="w2">Grams</span>'
        '<span>What else you noticed</span></div>' + wrows +
        '<span class="footnote">A kitchen scale and a small bowl will do it: put the bowl on, zero '
        'it, and let them potter about in it for a moment. On an animal weighing forty or a hundred '
        'and fifty grams, a tenth of the body gone is a fortnight of quiet weight loss and it is '
        'very hard to see through fur &mdash; so weigh weekly the moment anything looks off, and '
        'take the numbers with you.</span>' +
        '</section></div>', note=HEALTH_FOOT)

def page_6():
    return sheet(6, "The<br>night.", "Hamster kit &middot; what happens after lights out",
        '<div class="two b46"><section>' +
        '<div class="warn">'
        '<b>Never wake a hamster to hold it</b>'
        '<p>Everything good with a hamster happens on their clock. They surface in the evening, '
        'run further in a night than you would walk in a day, and a hand that arrives at two in the '
        'afternoon is a predator in a dream. Wait for them to come out, let them hear you first, '
        'and let them come to the hand rather than the other way round.</p>'
        '</div>' +
        sec("When this hamster is actually up", "", "sand") +
        '<div class="split2">' + field("Out at", "h6_out", "w2") +
        field("Back in at", "h6_in", "w2") + '</div>' +
        field("Busiest hour", "h6_busy") +
        sec("What they do with the night", "What this one uses", "dusk") +
        "".join(f'<div class="wl">{check(f"h6_e_{i}", "dusk")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["The wheel", "Digging, once the bedding is deep enough",
                                       "Foraging for scattered food",
                                       "Cardboard, tubes and boxes to destroy",
                                       "Climbing, low down and over something soft",
                                       "The sand bath"], start=1)) +
        sec("Rotated, not added to", "Cheap, and changed often", "sand") +
        "".join(f'<div class="wl">{blank(f"h6_rot_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        '<div class="warn alarm">'
        '<b>Why there is no ball on this list</b>'
        '<p>A hamster in a plastic ball cannot see where it is going, cannot stop, cannot smell '
        'anything useful and has small feet next to a lot of ventilation slots. Most people who '
        'keep hamsters have quietly stopped using them. A taped-off playpen on the floor, with '
        'hides and cardboard and you sitting in it, does the same job and they can leave.</p>'
        '</div>' +
        sec("The playpen", "Never out of sight, not even once", "alarm") +
        "".join(f'<div class="wl">{check(f"h6_pp_{i}", "alarm")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Sides taller than they can climb or jump",
                                       "Nothing they can get behind or under",
                                       "On the floor, so there is nowhere to fall from",
                                       "Counted back in before you walk away"], start=1)) +
        sec("Chewing the bars, or pacing", "What it usually means", "dusk") +
        "".join(f'<div class="wl">{check(f"h6_bc_{i}", "dusk")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Not enough floor, or not enough bedding to dig in",
                                       "A wheel too small, or no wheel at all",
                                       "Nothing to forage for, food in a bowl",
                                       "Woken during the day, again"], start=1)) +
        sec("What we tried, and whether it helped", "", "sand") +
        "".join(f'<div class="wl">{blank(f"h6_try_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

LOOK = [
    ("Eyes", "Both open, clear, not sticky"),
    ("Nose and breathing", "Dry, quiet, no clicking"),
    ("Front teeth", "Even, not overlong, chin dry"),
    ("Pouches", "Empty at some point &mdash; never pull"),
    ("Bottom", "Dry and clean, bedding not stuck"),
    ("Feet and nails", "No sores, nails not curling"),
    ("Coat", "No bald patches, no scurf or wetness"),
    ("Under the hands", "Slowly, for lumps"),
]

def page_7():
    rows = "".join(
        f'<div class="ck"><span class="ckn"><b>{what}</b><i>{how}</i></span>'
        f'<span class="c">{check(f"h7_c_{i}", "dusk")}</span>'
        f'{blank(f"h7_n_{i}", "", "10")}</div>'
        for i, (what, how) in enumerate(LOOK, start=1))
    return sheet(7, "In your<br>hands.", "Hamster kit &middot; taming, and the weekly look",
        '<div class="two b46"><section>' +
        sec("The weekly look-over", "Mostly by looking", "dusk") +
        '<div class="ck head"><span class="ckn">What to look for</span>'
        '<span class="c">Done</span><span>Noticed</span></div>' + rows +
        '<span class="footnote">Most of this is done with your eyes while they are busy with a '
        'sunflower seed. Only the last one needs hands, and it is worth doing every week: on an '
        'animal this size, a lump the size of a pea is a large lump.</span>' +
        sec("Lumps and anything new", "", "alarm") +
        '<div class="lm head"><span class="lmd">Date</span><span>Where</span>'
        '<span class="c">Vet</span></div>' +
        "".join(f'<div class="lm">{blank(f"h7_ld_{i}", "w2", "10")}'
                f'{blank(f"h7_lw_{i}", "", "10")}'
                f'<span class="c">{check(f"h7_lv_{i}", "alarm")}</span></div>'
                for i in range(1, 5)) +
        '</section><section>' +
        sec("Taming, a week at a time", "Do not skip one", "sand") +
        '<div class="tm head"><span class="tmn">Step</span><span>Started</span>'
        '<span class="c">There</span></div>' +
        "".join(f'<div class="tm"><span class="tmn">{t}</span>'
                f'{blank(f"h7_t_{i}", "w2", "10")}'
                f'<span class="c">{check(f"h7_td_{i}", "sand")}</span></div>'
                for i, t in enumerate(["Left alone to settle in, a week",
                                       "Talking near the cage, every evening",
                                       "A hand resting inside, not moving",
                                       "Food taken from a flat palm",
                                       "Walking onto the hand for food",
                                       "Scooped up, both hands, low over a table"], start=1)) +
        '<div class="warn alarm">'
        '<b>A bite is almost always a startled hamster</b>'
        '<p>Woken up, grabbed from above, or a finger that smelled of dinner. It is not temper and '
        'it is not personal. Wash your hands before you reach in, say something first so they know '
        'you are there, and never take a hamster out of its nest to show somebody. Children sit on '
        'the floor with a hamster in their lap, or they do not hold it yet.</p>'
        '</div>' +
        sec("Who may hold this hamster", "And how", "dusk") +
        "".join(f'<div class="wl">{blank(f"h7_who_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>', note=HEALTH_FOOT)

def page_8():
    return sheet(8, "While we<br>are away.", "Hamster kit &middot; leave this out for the sitter",
        '<div class="two b46"><section>' +
        sec("The basics", "", "dusk") +
        '<div class="split2">' + field("Hamster", "h8_who", "w2") +
        field("Dates", "h8_dates", "w2") + '</div>' +
        field("Us, and the best number", "h8_us") +
        field("If you cannot reach us", "h8_backup") +
        field("Vet, and out-of-hours (page 2)", "h8_vet") +
        sec("Every day, please", "Evening is best &mdash; they are up", "dusk") +
        "".join(f'<div class="wl">{check(f"h8_d_{i}", "dusk")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Tap the water bottle and watch a drop come out",
                                       "Yesterday&#8217;s fresh food out, a little new food in",
                                       "Lift out the wet corner of bedding",
                                       "See the hamster awake and moving at least once"],
                                      start=1)) +
        sec("Feeding", "Amounts, not &#8220;a bit&#8221;", "sand") +
        '<div class="fd head"><span>What</span><span class="w2">How much</span>'
        '<span class="w2">When</span></div>' +
        "".join(f'<div class="fd">{blank(f"h8_f_{i}", "", "10")}'
                f'{blank(f"h8_fh_{i}", "w2", "10")}{blank(f"h8_fw_{i}", "w2", "10")}</div>'
                for i in range(1, 4)) +
        sec("Medication, if any", "", "alarm") +
        '<div class="og head"><span>What</span><span>Dose and when</span>'
        '<span class="c">Given</span></div>' +
        "".join(f'<div class="og">{blank(f"h8_m_{i}", "", "10")}'
                f'{blank(f"h8_md_{i}", "", "10")}'
                f'<span class="c">{check(f"h8_mg_{i}", "alarm")}</span></div>'
                for i in (1, 2)) +
        '</section><section>' +
        '<div class="warn alarm">'
        '<b>Please do not</b>'
        '<p>Wake them to look at them, take them out, clean the whole cage, move the cage into '
        'another room, or open the lid with the door to the room open. And if they are curled up '
        'cold and stiff in a cold room, they may not have died &mdash; that is torpor, it happens '
        'when a room drops below about fifteen degrees, and it is a telephone call to the vet, not '
        'a bin bag.</p>'
        '</div>' +
        sec("Where everything is", "", "dusk") +
        '<div class="wh head"><span>What</span><span>Where</span></div>' +
        "".join(f'<div class="wh"><span class="whn">{t}</span>'
                f'{blank(f"h8_wh_{i}", "", "10")}</div>'
                for i, t in enumerate(["Food and treats", "Spare bedding", "Sand",
                                       "Cleaning things", "Carry box", "Spare key"], start=1)) +
        sec("The room", "", "sand") +
        '<div class="split2">' + field("Keep it at", "h8_temp", "w2") +
        field("Lights off by", "h8_lights", "w2") + '</div>' +
        sec("Message us if", "", "alarm") +
        "".join(f'<div class="wl">{blank(f"h8_msg_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_9():
    return sheet(9, "Anything<br>different.", "Hamster kit &middot; the log, and growing old",
        '<div class="two b2"><section>' +
        sec("Dated, however small", "Two lines now beat memory", "dusk") +
        '<div class="lg head"><span class="lgd">Date</span><span>What you noticed</span>'
        '<span class="c">Told vet</span></div>' +
        "".join(f'<div class="lg">{blank(f"h9_d_{i}", "w2", "10")}'
                f'{blank(f"h9_w_{i}", "grow", "10")}'
                f'<span class="c">{check(f"h9_v_{i}", "alarm")}</span></div>'
                for i in range(1, 15)) +
        sec("Questions for the vet", "", "alarm") +
        "".join(f'<div class="wl">{blank(f"h9_q_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>What counts as worth writing down</b>'
        '<p>Less on the wheel. A hoard that stops growing. Sleeping somewhere new, or out in the '
        'open. Drinking more. A wet chin. Fur thinning over the hips. Grams going down two weeks '
        'running. None of these is an emergency on the day, and all of them are the sort of thing a '
        'vet asks &#8220;how long has that been going on?&#8221; about.</p>'
        '</div>' +
        sec("Getting old, which happens quickly", "", "sand") +
        "".join(f'<div class="wl">{check(f"h9_old_{i}", "sand")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Wheel swapped for one they can still get into",
                                       "Climbing taken out, ramps put in low",
                                       "Bedding still deep, but a shallower way in",
                                       "Food where they sleep, and something softer",
                                       "Weighed weekly rather than monthly"], start=1)) +
        sec("What we would want for them", "", "dusk") +
        "".join(f'<div class="wl">{blank(f"h9_want_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '<span class="footnote">Two years is a short time and it goes faster at the end. Deciding '
        'in advance what you would and would not want to put a small animal through &mdash; and '
        'writing the vet&#8217;s number beside it &mdash; is a kindness to the person you will be '
        'on that day.</span>' +
        '</section></div>', note=HEALTH_FOOT)

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --dusk:{C["dusk"]}; --sand:{C["sand"]}; --alarm:{C["alarm"]};
  --backdrop:#e9eaee;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#141520; }} }}
:root[data-theme="dark"]{{ --backdrop:#141520; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Work Sans","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(27,29,42,.15);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

/* a thin strip over the title, rather than a masthead rule under it */
.strip{{ display:flex; align-items:center; gap:12px; flex:none;
  border-bottom:1.4px solid var(--ink); padding-bottom:6px; }}
.kicker{{ font-weight:600; text-transform:uppercase; letter-spacing:.16em; font-size:7.4pt;
  color:var(--dusk); white-space:nowrap; }}
.dotline{{ flex:1; height:0; border-bottom:1.4px dotted var(--strong); }}
.pageno{{ font-family:"Petrona",Georgia,serif; font-weight:700; font-size:13pt; color:var(--ink); }}
.pageno i{{ font-style:normal; font-size:8.5pt; color:var(--faint); }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in;
  flex:none; padding-top:7px; }}
.mast h1{{ font-family:"Petrona",Georgia,serif; font-weight:700; font-size:{S["display"]};
  line-height:1.0; margin:0; letter-spacing:-.012em; }}
.mastright{{ display:flex; align-items:flex-end; gap:13px; position:relative; }}
.wheel{{ position:absolute; right:0; bottom:.26in; width:1.16in; height:1.08in;
  color:var(--strong); }}
.mini{{ display:flex; gap:10px; }}
.mini .fr{{ display:flex; align-items:flex-end; gap:8px; flex:none; height:.22in; }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:9px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.02fr 1fr; }}
.two.b2{{ grid-template-columns:1.15fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}

/* the band sits above the label, so the page reads in horizontal bands */
.sec{{ display:grid; grid-template-columns:minmax(0,auto) minmax(0,1fr); gap:0 10px;
  padding:9px 0 5px; flex:none; align-items:baseline; }}
.over{{ grid-column:1 / -1; height:2.2px; background:var(--strong); margin-bottom:5px; }}
.sec.dusk .over{{ background:var(--dusk); }}
.sec.sand .over{{ background:var(--sand); }}
.sec.alarm .over{{ background:var(--alarm); }}
.lbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.085em; font-size:8.2pt;
  color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0; justify-self:end;
  overflow:hidden; text-overflow:ellipsis; }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.5in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.2px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.8in; }} .blank.w3{{ flex:none; width:.5in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

.box{{ width:12px; height:12px; border:1.3px solid var(--strong); background:#00000008;
  flex:none; margin-bottom:3px; }}
.box.dusk{{ border-color:var(--dusk); }} .box.sand{{ border-color:var(--sand); }}
.box.alarm{{ border-color:var(--alarm); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.28in;
  max-height:.52in; }}
.rtext{{ font-size:9.9pt; padding-bottom:3px; line-height:1.15; }}
.footnote{{ font-size:8.4pt; color:var(--faint); line-height:1.45; padding-top:8px; display:block;
  flex:none; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:5px; border-bottom:1.2px solid var(--ink); margin-bottom:5px;
  font-weight:600; text-transform:uppercase; letter-spacing:.06em; font-size:7pt;
  color:var(--soft); }}
.head span, .head .blank{{ border:0; }}

.warn{{ background:#0000000a; border-radius:5px; padding:11px 13px; margin:10px 0; flex:none; }}
.warn b{{ font-size:9.6pt; color:var(--dusk); }}
.warn.alarm b{{ color:var(--alarm); }}
.warn p{{ margin:5px 0 0; font-size:9.2pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.sp{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr) .5in; gap:0 9px;
  align-items:baseline; flex:none; min-height:.26in; border-bottom:1px solid var(--rule);
  padding-top:3px; }}
.spn{{ font-size:9.2pt; font-weight:600; color:var(--dusk); }}
.spk{{ font-size:8.6pt; color:var(--soft); }}
.spy{{ font-size:8.8pt; color:var(--soft); }}
.sp.head{{ border-bottom:1.2px solid var(--ink); }}

/* page 2 ------------------------------------------------------------------ */
.ems{{ display:flex; flex-direction:column; flex:1 1 auto; }}
.em{{ display:flex; align-items:flex-start; gap:10px; flex:1 1 auto; min-height:.4in;
  max-height:.76in; border-bottom:1px solid var(--rule); padding-top:5px; }}
.em .box{{ margin-top:2px; margin-bottom:0; }}
.emt{{ font-size:9.4pt; line-height:1.25; }}

/* page 3 ------------------------------------------------------------------ */
.hm{{ display:grid; grid-template-columns:1.72in minmax(0,1fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.34in; max-height:.54in; }}
.hmc{{ padding-bottom:3px; min-width:0; }}
.hmc b{{ display:block; font-size:9.2pt; font-weight:500; line-height:1.15; }}
.hmc i{{ display:block; font-style:normal; font-size:7.7pt; color:var(--faint); line-height:1.15; }}
.hm.head .hmc{{ padding-bottom:0; }}
.cg{{ display:grid; grid-template-columns:minmax(0,1fr) .8in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}

/* page 4 ------------------------------------------------------------------ */
.wkd{{ display:grid; grid-template-columns:.36in .26in .26in .26in .26in minmax(0,1fr);
  gap:0 8px; align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.46in; }}
.wkn{{ font-size:8.8pt; color:var(--dusk); font-weight:600; padding-bottom:4px; }}
.wo{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}

/* page 5 ------------------------------------------------------------------ */
.fd{{ display:grid; grid-template-columns:minmax(0,1fr) .8in .8in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.txs{{ display:flex; flex-direction:column; flex:none; }}
.tx{{ display:grid; grid-template-columns:1.24in minmax(0,1fr); gap:0 10px;
  align-items:baseline; min-height:.32in; border-bottom:1px solid var(--rule); padding-top:4px; }}
.txn{{ font-size:9.1pt; font-weight:600; color:var(--alarm); line-height:1.2; }}
.txw{{ font-size:8.5pt; color:var(--soft); line-height:1.25; }}
.wt{{ display:grid; grid-template-columns:.8in .8in minmax(0,1fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.29in; max-height:.44in; }}
.wtn{{ font-size:9.1pt; color:var(--dusk); font-weight:600; padding-bottom:4px; }}

/* page 7 ------------------------------------------------------------------ */
.ck{{ display:grid; grid-template-columns:1.55in .3in minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.33in; max-height:.5in; }}
.ckn{{ padding-bottom:3px; min-width:0; }}
.ckn b{{ display:block; font-size:9.2pt; font-weight:500; line-height:1.15; }}
.ckn i{{ display:block; font-style:normal; font-size:7.7pt; color:var(--faint); line-height:1.15; }}
.ck.head .ckn{{ padding-bottom:0; }}
.lm{{ display:grid; grid-template-columns:.8in minmax(0,1fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.tm{{ display:grid; grid-template-columns:minmax(0,1fr) .8in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.48in; }}
.tmn{{ font-size:9.2pt; padding-bottom:3px; line-height:1.15; }}
.tm.head .tmn{{ font-size:inherit; padding-bottom:0; }}

/* pages 8 and 9 ----------------------------------------------------------- */
.og{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.15fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.wh{{ display:grid; grid-template-columns:1.15fr minmax(0,1.35fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.whn{{ font-size:9.4pt; padding-bottom:4px; }}
.lg{{ display:grid; grid-template-columns:.8in minmax(0,1fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.26in; max-height:.44in; }}
.lgd{{ font-size:9pt; padding-bottom:4px; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.4px solid var(--ink); margin-top:10px; padding-top:8px; }}
.foot .mark{{ font-family:"Petrona",Georgia,serif; font-style:italic; font-weight:500;
  font-size:10pt; color:var(--faint); }}
.seeds{{ display:flex; gap:5px; }}
.seeds i{{ width:7px; height:4.5px; border-radius:50%; background:var(--sand);
  transform:rotate(-20deg); }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-hamster.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Small Hours Hamster Care Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-hamster-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"hamster-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"hamster-{name}")
        fill_pdf = os.path.join(DIST, f"hamster-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["dusk"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Small Hours &nbsp;&middot;&nbsp; hamster care kit",
    title="Start<br><em>here.</em>",
    lede="Nine pages for an animal that is awake when you are not, lives two or three years rather "
         "than fifteen, and is kept well or badly almost entirely by numbers. The home measured "
         "properly, the week, the food and the hoard, the night, taming and the weekly look-over, "
         "the sitter&#8217;s page, and a log with room for growing old.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Print page 2 first", "the vet who sees exotics, before you need one"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. Tick the boxes with a click. <b>Save a copy per hamster</b> &mdash; pages 1 to 7 "
        "are about one animal, and hamsters are kept one to a cage anyway.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Two of them are meant "
        "to leave the folder: <b>page 2</b> goes on the fridge with the exotics vet filled in, and "
        "<b>page 8</b> gets left out for whoever is looking in while you are away.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "Page 3 is worth printing twice: once now, once after you have measured",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="What this is, and what it is not",
    s5p="It is a <b>record book</b>, made by a designer. It is not veterinary advice, not a "
        "diagnosis, and not a substitute for phoning a vet. The figures on page 3 are the ones "
        "experienced hamster keepers work to rather than the minimum a box will quote you, and the "
        "signs on page 2 are a short list, not a complete one. Find a practice that sees small "
        "exotics <b>today</b>, while nothing is wrong: many do not, and a hamster that is unwell on "
        "a Friday evening does not have until Monday.",
    license="Personal use only. Print as many copies as you like for your own hamsters. Please do "
            "not resell, share or redistribute the files. Fonts: Petrona and Work Sans "
            "(SIL Open Font License).",
    mark="Awake when you are not.",
)

PAGE_NAMES = ["This hamster", "Numbers &amp; emergencies", "The home, measured", "The week",
              "Food &amp; the hoard", "The night", "In your hands", "For the sitter",
              "The log, and growing old"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["night"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Petrona",Georgia,serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Work Sans",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Work Sans"'),
                 ("--s1:#f2a65a", "--s1:" + C["sand"]), ("--s2:#ee6c4d", "--s2:" + C["alarm"]),
                 ("--s3:#c43e7a", "--s3:" + C["dusk"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"])]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-hamster.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    hp = os.path.join(work, "readme-hamster.html")
    open(hp, "w", encoding="utf-8").write(tpl)
    B.to_pdf(hp, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-hamster.css")
    doc = pymupdf.open(os.path.join(DIST, "hamster-planner-letter-night-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"hamster-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["night"]
    over = (
        "<style>"
        "h1{font-family:'Petrona',Georgia,serif;font-weight:700;line-height:1.0;"
        "letter-spacing:-.012em}"
        f"h1 em{{font-style:italic;color:{C['sand']}}}"
        "body{font-family:'Work Sans',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['dusk']};font-family:'Work Sans';font-weight:600;letter-spacing:.18em}}"
        f".rule{{background:{C['dusk']};height:3px;width:230px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Work Sans';font-weight:600;"
        "letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(27,29,42,.17)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Work Sans',Arial,sans-serif;font-weight:600;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>Awake when<br>you are <em>not.</em></h1>
          <span class="rule"></span>
          <p class="sub">A hamster care record built around the numbers a hamster is actually kept
          well by: floor area, bedding depth, wheel diameter, room temperature and grams &mdash;
          plus the vet who sees exotics, the night, and a log with room for growing old.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Syrian &amp; dwarf</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>one hamster.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The page most hamster kits leave out</span>
      <h1>Measure the floor,<br><em>not the box.</em></h1>
      <p class="sub">Cage sizes on the shelf count shelves, tubes and lids as space. Page 3 lists
      the figures experienced keepers work to &mdash; unbroken floor area, bedding deep enough to
      hold a burrow, wheel diameter, bar spacing, room temperature &mdash; with a blank beside each
      one for what you actually measured.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[2]}" style="height:1170px"><img src="{imgs[1]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#eeeff3", "100px", "86px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#ecedf1", "100px", "76px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-hamster-{name}.html")
        open(hp, "w", encoding="utf-8").write(page)
        B.to_png(hp, os.path.join(DIST, f"listing-{name}.png"), 2000, 2000, scale=1)
        print(f"  listing image {name}")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--no-fillable", action="store_true")
    ap.add_argument("--extras", action="store_true")
    args = ap.parse_args()

    os.makedirs(DIST, exist_ok=True)
    os.makedirs(WORK, exist_ok=True)

    if args.extras:
        build_readme(WORK)
        build_mockups(WORK)
        BD.package(DIST, "Small-Hours-Hamster-Care-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building hamster kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "hamster-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "night", embed_fonts=False))
    print("Wrote hamster-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Small-Hours-Hamster-Care-Kit")


if __name__ == "__main__":
    main()
