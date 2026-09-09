#!/usr/bin/env python3
"""Build the Nine Lives cat care kit.

Nine pages built on the one thing that makes cats different from every other
pet: they hide illness, so the only way to notice is to have written the
ordinary week down. Records, a weight log, the litter tray as a diary, the
enrichment a cat actually needs, and the page you leave for the sitter.

    python3 cat.py                  # every size / colourway
    python3 cat.py --only letter-slate
    python3 cat.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, math, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-cat")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Alegreya:ital,wght@0,500;0,700;1,500"
          "&family=Epilogue:wght@400;500;600;700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="36pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="35pt"),
}

COLORWAYS = {
    # slate = the routine, clay = the cat itself, plum = anything you phone about.
    "slate": dict(ink="#1d2126", soft="#556069", faint="#8d959c", rule="#e3e6e9",
                  strong="#c3c8cd", slate="#3c5a6e", clay="#b06a4a", plum="#7a4a63"),
    "mono":  dict(ink="#1e2022", soft="#585c60", faint="#919498", rule="#e6e7e9",
                  strong="#c5c7ca", slate="#3b3e42", clay="#8a8d91", plum="#3b3e42"),
}

PAGES = 9
MARK = "Cats hide it. Write it down."

MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]

# Routine care, with the interval most practices work to. The kit prints the
# schedule and leaves every date blank, because vets and products differ.
ROUTINE = [
    ("Vaccination booster", "Yearly"),
    ("Worming", "Every 3 months"),
    ("Flea and tick", "Monthly, check the label"),
    ("Full check-up", "Yearly, twice over ten"),
    ("Teeth looked at", "At the check-up"),
    ("Claws checked", "Older cats especially"),
    ("Weighed", "Monthly, page 4"),
    ("Microchip details checked", "Yearly, and after moving"),
]

# --------------------------------------------------------------------------- helpers

def check(f, tone=""):
    return f'<span class="box {tone}" data-field="{f}" data-ftype="check"></span>'

def blank(f, cls="", fs="10.5"):
    return f'<span class="blank {cls}" data-field="{f}" data-fsize="{fs}"></span>'

def sec(label, hint="", tone=""):
    hint = f'<span class="hint">{hint}</span>' if hint else ""
    return (f'<div class="sec"><span class="lbl {tone}">{label}</span>'
            f'<span class="line"></span>{hint}</div>')

def field(label, f, cls="", fs="10.5"):
    return f'<div class="fr"><span class="flbl">{label}</span>{blank(f, cls, fs)}</div>'

def paws(seed=1):
    """Two paw prints, drawn, walking a little further across on every page."""
    parts = []
    for k, (bx, by, s) in enumerate(((22, 92, 1.0), (74, 46, 0.86))):
        x = bx + seed * 4.5
        y = by - seed * 1.6
        parts.append(f'<ellipse cx="{x:.1f}" cy="{y:.1f}" '
                     f'rx="{15 * s:.1f}" ry="{12 * s:.1f}"/>')
        for i in range(4):                     # four toes on an arc above the pad
            a = math.radians(196 + i * 29)
            tx = x + 22 * s * math.cos(a)
            ty = y + 22 * s * math.sin(a)
            parts.append(f'<ellipse cx="{tx:.1f}" cy="{ty:.1f}" '
                         f'rx="{6.2 * s:.1f}" ry="{7.4 * s:.1f}"/>')
    return (f'<svg class="paws" viewBox="0 0 136 128" aria-hidden="true">'
            f'<g fill="none" stroke="currentColor" stroke-width="1">{"".join(parts)}</g></svg>')

def sheet(n, title, kicker, body, note=None):
    meta = (f'<div class="mini">{field("Date", f"k{n}_date", "w2", "9")}</div>' if n > 1 else '')
    foot = note or MARK
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{paws(n)}{meta}<span class="pageno">{n}<i>/{PAGES}</i></span></div>
  </header>
  <div class="rules"><span></span><span class="sl"></span></div>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{foot}</span>
    <span class="dots">&#9679;&nbsp;&#9679;&nbsp;&#9679;</span></footer>
</div>'''

HEALTH_FOOT = "A record book, not veterinary advice &middot; page 2 has the numbers"

# --------------------------------------------------------------------------- pages

def page_1():
    return sheet(1, "This<br>cat.", "Cat kit &middot; who they are",
        '<div class="two b46"><section>' +
        sec("The facts", "One sheet each &mdash; print it again for the second cat", "slate") +
        field("Name", "k1_name") +
        field("Called, actually", "k1_called") +
        '<div class="split2">' + field("Born or about", "k1_born", "w2") +
        field("Came home", "k1_came", "w2") + '</div>' +
        field("Colour and markings", "k1_marks") +
        field("Breed, or best guess", "k1_breed") +
        '<div class="split2">' + field("Neutered", "k1_neuter", "w2") +
        field("Indoor / out", "k1_inout", "w2") + '</div>' +
        sec("The numbers you cannot look up in a hurry", "", "plum") +
        field("Microchip number", "k1_chip") +
        field("Chip registered with", "k1_chipco") +
        field("Insurance, and policy number", "k1_ins") +
        field("Registered at (practice)", "k1_practice") +
        '<div class="warn plum">'
        '<b>A microchip is only as good as the phone number on it</b>'
        '<p>The chip itself never changes and never expires, but the record attached to it does. '
        'If you have moved, changed your number, or the cat came from someone else, the details '
        'are very often still theirs. Log in once, check it, and write the date on page 3.</p>'
        '</div>' +
        sec("Where they came from", "", "slate") +
        field("Breeder, shelter or found", "k1_from") +
        field("Anything known about before", "k1_before") +
        sec("Photographs, in case they are lost", "", "plum") +
        "".join(f'<div class="wl">{check(f"k1_ph_{i}", "plum")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Clear head-on photograph, taken this year",
                                       "Both sides, and anything unusual",
                                       "Stored somewhere other than your phone"], start=1)) +
        '</section><section>' +
        sec("What they are like", "What a stranger would need", "clay") +
        field("Friendly with", "k1_ok") +
        field("Not friendly with", "k1_notok") +
        field("Where they hide", "k1_hide") +
        field("What frightens them", "k1_scare") +
        field("How they ask for food", "k1_askfood") +
        field("How they ask to be left alone", "k1_askalone") +
        field("Picked up? How?", "k1_pickup") +
        sec("Things they already do that are theirs", "", "clay") +
        "".join(f'<div class="wl">{blank(f"k1_quirk_{i}", "grow", "10.5")}</div>'
                for i in range(1, 5)) +
        sec("Other animals in the house", "", "slate") +
        '<div class="oa head"><span>Who</span><span>How they get on</span></div>' +
        "".join(f'<div class="oa">{blank(f"k1_oa_{i}", "", "10")}'
                f'{blank(f"k1_oah_{i}", "", "10")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

EMERGENCIES = [
    "Straining in the tray and producing little or nothing &mdash; especially a male cat",
    "Breathing with an open mouth, or fast shallow breathing at rest",
    "Sudden weakness or dragging of the back legs, often crying, legs cold",
    "Not eating at all for 24 hours, or hiding and not moving",
    "Eaten or chewed any part of a lily, or drunk the vase water",
    "Swallowed thread, string, tinsel or an elastic band &mdash; never pull it",
    "Repeated vomiting, a bloated belly, or a fall from a height",
]

def page_2():
    rows = "".join(
        f'<div class="em">{check(f"k2_em_{i}", "plum")}<span class="emt">{t}</span></div>'
        for i, t in enumerate(EMERGENCIES, start=1))
    return sheet(2, "Numbers, and<br>when to use them.", "Cat kit &middot; the page on the fridge",
        '<div class="two b46"><section>' +
        sec("The practice", "", "slate") +
        field("Vet", "k2_vet") +
        field("Daytime number", "k2_day") +
        field("Address", "k2_addr") +
        sec("Out of hours &mdash; usually somewhere else", "", "plum") +
        field("Who covers nights", "k2_ooh_who") +
        field("Number", "k2_ooh_num") +
        field("Address, and how long it takes", "k2_ooh_addr") +
        sec("Also worth having", "", "slate") +
        field("Insurance claim line", "k2_claim") +
        field("Microchip company", "k2_chipline") +
        field("Poisons helpline", "k2_poison") +
        field("Whoever has a spare key", "k2_key") +
        '<div class="warn plum">'
        '<b>Photograph this page once it is filled in</b>'
        '<p>The moment you need the out-of-hours number is the moment you cannot find the folder. '
        'Fill it in, take a picture of it on your phone, and put the paper copy on the fridge '
        'rather than in a drawer.</p>'
        '</div>' +
        sec("Getting there", "Worked out once, not at midnight", "slate") +
        field("Carrier lives", "k2_carrier") +
        field("Who drives, if it is the middle of the night", "k2_drive") +
        field("How long it takes", "k2_howlong", "w2") +
        '</section><section>' +
        sec("Phone now, do not wait until morning", "", "plum") +
        f'<div class="ems">{rows}</div>' +
        '<span class="footnote">This list is the short version of what emergency vets ask people '
        'to come in for. It is not a diagnosis and it is not complete. A cat that seems wrong to '
        'you is a good enough reason to phone &mdash; you know this animal and they do not.</span>' +
        sec("Anything else to watch for", "", "clay") +
        "".join(f'<div class="wl">{blank(f"k2_own_{i}", "grow", "10.5")}</div>'
                for i in range(1, 5)) +
        '</section></div>', note=HEALTH_FOOT)

TOXIC = [
    ("Lilies, any part", "Pollen and vase water too. Kidney failure. Emergency."),
    ("Paracetamol / acetaminophen", "Never, in any dose. Also ibuprofen and aspirin."),
    ("Dog flea treatment", "Permethrin is toxic to cats. Check every label."),
    ("Antifreeze", "Sweet, and lethal in tiny amounts. Wipe up spills."),
    ("Onion, garlic, chives", "Cooked or raw, including in gravy and baby food."),
    ("String, thread, tinsel", "Swallowed, it cuts. Never pull on a visible end."),
]

def page_3():
    rows = "".join(
        f'<div class="rt"><span class="rtc"><b>{what}</b><i>{how}</i></span>'
        f'{blank(f"k3_last_{i}", "w3", "10")}{blank(f"k3_due_{i}", "w3", "10")}'
        f'<span class="c">{check(f"k3_ok_{i}", "slate")}</span></div>'
        for i, (what, how) in enumerate(ROUTINE, start=1))
    tox = "".join(
        f'<div class="tx"><span class="txn">{what}</span><span class="txw">{why}</span></div>'
        for what, why in TOXIC)
    return sheet(3, "The year<br>of care.", "Cat kit &middot; what is due, and when",
        '<div class="two b46"><section>' +
        sec("Routine care", "Intervals vary &mdash; the vet decides", "slate") +
        '<div class="rt head"><span class="rtc">What, and how often</span>'
        '<span class="w3">Last</span><span class="w3">Due</span>'
        '<span class="c">Done</span></div>' + rows +
        sec("Anything ongoing", "Medication, a condition, a diet", "plum") +
        '<div class="og head"><span>What</span><span>Dose and when</span>'
        '<span class="c">Repeat</span></div>' +
        "".join(f'<div class="og">{blank(f"k3_og_{i}", "", "10")}'
                f'{blank(f"k3_ogd_{i}", "", "10")}'
                f'<span class="c">{check(f"k3_ogr_{i}", "plum")}</span></div>'
                for i in (1, 2, 3, 4)) +
        sec("Appointments made", "", "slate") +
        '<div class="og head"><span>What for</span><span>When</span>'
        '<span class="c">Been</span></div>' +
        "".join(f'<div class="og">{blank(f"k3_ap_{i}", "", "10")}'
                f'{blank(f"k3_apw_{i}", "", "10")}'
                f'<span class="c">{check(f"k3_apo_{i}", "slate")}</span></div>'
                for i in (1, 2, 3)) +
        '</section><section>' +
        sec("Keep out of the house", "The short list, and the reason", "plum") +
        f'<div class="txs">{tox}</div>' +
        '<span class="footnote">Lilies are the one people are surprised by: every part of a true '
        'lily is dangerous to cats, brushing pollen off a coat and licking it is enough, and there '
        'is no safe amount. If a bouquet arrives, take them out before it comes in.</span>' +
        sec("Where the records live", "", "slate") +
        field("Vaccination card", "k3_card") +
        field("Insurance documents", "k3_docs") +
        field("Prescription food or medicine from", "k3_pharm") +
        sec("Cost of the year", "", "clay") +
        '<div class="split2">' + field("Insurance", "k3_c_ins", "w2") +
        field("Food", "k3_c_food", "w2") + '</div>' +
        '<div class="split2">' + field("Vet", "k3_c_vet", "w2") +
        field("Everything else", "k3_c_other", "w2") + '</div>' +
        sec("Worth asking at the next check-up", "", "slate") +
        "".join(f'<div class="wl">{check(f"k3_ask_{i}", "slate")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Is this weight right for this cat?",
                                       "Do the teeth need doing?",
                                       "Is the flea and worm routine still the right one?",
                                       "Anything to expect at this age?"], start=1)) +
        '</section></div>', note=HEALTH_FOOT)

def page_4():
    rows = "".join(
        f'<div class="wt"><span class="wtn">{m}</span>{blank(f"k4_kg_{i}", "w2", "10.5")}'
        f'{blank(f"k4_note_{i}", "grow", "10")}</div>'
        for i, m in enumerate(MONTHS, start=1))
    return sheet(4, "Weight,<br>every month.", "Cat kit &middot; the page that catches things early",
        '<div class="two b2"><section>' +
        sec("Same scales, same day of the month", "Kilos or pounds", "slate") +
        '<div class="wt head"><span class="wtn">Month</span><span class="w2">Weight</span>'
        '<span>What else you noticed</span></div>' + rows +
        '</section><section>' +
        '<div class="warn plum">'
        '<b>Why this page exists</b>'
        '<p>A cat will not tell you it feels unwell and will often behave normally until it is '
        'very unwell indeed. Weight is the exception: it is a number, it does not depend on how '
        'you are feeling that day, and a steady drop over a few months is one of the earliest '
        'things a vet can act on. Weigh monthly, write it down even when it is boring, and take '
        'the page with you to the check-up.</p>'
        '</div>' +
        sec("How to weigh a cat who will not be weighed", "", "clay") +
        "".join(f'<div class="wl">{check(f"k4_how_{i}", "clay")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Weigh yourself, then yourself holding the cat",
                                       "Or the carrier with them in, minus the carrier",
                                       "The same scales every time; the number matters less "
                                       "than the change",
                                       "Same time of day, before food"], start=1)) +
        sec("Ideal weight, if the vet has given one", "", "slate") +
        '<div class="split2">' + field("Ideal", "k4_ideal", "w2") +
        field("Told on", "k4_ideal_when", "w2") + '</div>' +
        sec("Body shape, felt not looked at", "", "clay") +
        "".join(f'<div class="wl">{blank(f"k4_body_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Take to the next appointment", "", "plum") +
        "".join(f'<div class="wl">{check(f"k4_take_{i}", "plum")}'
                f'{blank(f"k4_take_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>', note=HEALTH_FOOT)

def page_5():
    return sheet(5, "Food<br>and water.", "Cat kit &middot; how much, and where",
        '<div class="two b46"><section>' +
        sec("What they eat", "", "clay") +
        '<div class="fd head"><span>What</span><span class="w2">How much</span>'
        '<span class="w2">When</span></div>' +
        "".join(f'<div class="fd">{blank(f"k5_f_{i}", "", "10")}'
                f'{blank(f"k5_fh_{i}", "w2", "10")}{blank(f"k5_fw_{i}", "w2", "10")}</div>'
                for i in range(1, 6)) +
        sec("Treats", "About a tenth of the day&#8217;s food", "clay") +
        "".join(f'<div class="wl">{blank(f"k5_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Never, for this cat", "Allergies, a diet, or just a firm no", "plum") +
        "".join(f'<div class="wl">{check(f"k5_no_{i}", "plum")}'
                f'{blank(f"k5_no_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Where the food is kept", "") +
        f'<div class="wl">{blank("k5_store", "grow", "10.5")}</div>' +
        sec("Changing food", "Over a week, mixed in", "slate") +
        "".join(f'<div class="ch">{blank(f"k5_ch_{i}", "", "10")}'
                f'{blank(f"k5_chd_{i}", "w2", "10")}'
                f'<span class="c">{check(f"k5_cho_{i}", "slate")}</span></div>'
                for i in (1, 2, 3)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>Cats are bad at drinking, and it matters</b>'
        '<p>They evolved to get most of their water from what they caught, which is why a dry-food '
        'cat can run mildly short for years and why urinary trouble is so common. More bowls, in '
        'more places, <b>away from the food</b> and away from the tray; wide bowls rather than '
        'deep narrow ones; changed daily. Wet food is water as well as dinner.</p>'
        '</div>' +
        sec("Water, where it is", "Not next to the food", "slate") +
        '<div class="wa head"><span>Where</span><span>Bowl or fountain</span>'
        '<span class="c">Daily</span></div>' +
        "".join(f'<div class="wa">{blank(f"k5_w_{i}", "", "10")}'
                f'{blank(f"k5_wb_{i}", "", "10")}'
                f'<span class="c">{check(f"k5_wd_{i}", "slate")}</span></div>'
                for i in range(1, 5)) +
        sec("Bowls and where they go", "", "clay") +
        "".join(f'<div class="wl">{check(f"k5_b_{i}", "clay")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Food and water apart, in different rooms if you can",
                                       "Neither of them beside the litter tray",
                                       "Wide and shallow, so the whiskers are not squashed",
                                       "Somewhere they can eat with their back to a wall",
                                       "One feeding station per cat, spread out"], start=1)) +
        sec("If they stop eating", "Phone if it reaches a day", "plum") +
        "".join(f'<div class="wl">{blank(f"k5_stop_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>', note=HEALTH_FOOT)

def page_6():
    return sheet(6, "The litter<br>tray.", "Cat kit &middot; the early warning system",
        '<div class="two b46"><section>' +
        '<div class="warn">'
        '<b>One tray per cat, plus one</b>'
        '<p>Two cats means three trays, and they go in different places rather than in a row. Most '
        'cats prefer them uncovered, in a quiet spot with a way out, with fine unscented clumping '
        'litter deep enough to dig &mdash; and scooped every day. Almost every &#8220;he is doing '
        'it on the carpet&#8221; problem is a tray problem, a stress problem, or a medical one, in '
        'that order of how often.</p>'
        '</div>' +
        sec("The trays", "", "slate") +
        '<div class="tr head"><span class="trn">#</span><span>Where it is</span>'
        '<span>Litter used</span><span class="c">Open</span></div>' +
        "".join(f'<div class="tr"><span class="trn">{i}</span>'
                f'{blank(f"k6_tw_{i}", "", "10")}{blank(f"k6_tl_{i}", "", "10")}'
                f'<span class="c">{check(f"k6_to_{i}", "slate")}</span></div>'
                for i in range(1, 5)) +
        '<div class="split2">' + field("Scooped", "k6_scoop", "w2") +
        field("Emptied fully", "k6_empty", "w2") + '</div>' +
        sec("Changing litter, or moving a tray", "", "clay") +
        "".join(f'<div class="wl">{check(f"k6_ch_{i}", "clay")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Add the new tray before taking the old one away",
                                       "Mix new litter into old over a week or two",
                                       "Move a tray a little at a time, not across the house",
                                       "No scented litter, no strong cleaners &mdash; they can "
                                       "smell what you cannot"], start=1)) +
        sec("What we use, and where it comes from", "", "clay") +
        field("Litter brand", "k6_brand") +
        field("Bought from", "k6_where") +
        field("How long a bag lasts", "k6_lasts", "w2") +
        '</section><section>' +
        sec("The tray diary", "Only when different", "plum") +
        '<div class="dy head"><span class="dyn">Date</span><span>What was different</span>'
        '<span class="c">Vet</span></div>' +
        "".join(f'<div class="dy">{blank(f"k6_dd_{i}", "w2", "10")}'
                f'{blank(f"k6_dw_{i}", "", "10")}'
                f'<span class="c">{check(f"k6_dv_{i}", "plum")}</span></div>'
                for i in range(1, 13)) +
        '<div class="warn plum">'
        '<b>The one that cannot wait</b>'
        '<p>A cat going to the tray again and again and producing little or nothing &mdash; '
        'squatting, straining, crying, licking &mdash; may have a blocked bladder. In male cats '
        'this is a genuine emergency and hours matter. Do not wait to see if it settles overnight: '
        'phone the number on page 2.</p>'
        '</div>' +
        '</section></div>', note=HEALTH_FOOT)

def page_7():
    return sheet(7, "The indoor<br>day.", "Cat kit &middot; play, claws and high places",
        '<div class="two b46"><section>' +
        '<div class="warn">'
        '<b>Play works when it looks like hunting</b>'
        '<p>Stalk, chase, pounce, catch &mdash; and then feed. A wand toy moving <b>away</b> from '
        'the cat, like something escaping, beats a toy waved in their face. Two or three short '
        'sessions a day beat one long one, and every session should end with a catch they are '
        'allowed to keep, or it is just frustration. Lasers alone never let them catch anything; '
        'if you use one, land it on a real toy at the end.</p>'
        '</div>' +
        sec("What this cat actually likes", "Most have one type", "clay") +
        '<div class="ty head"><span>Toy or game</span><span class="w2">How long</span>'
        '<span class="c">Keeps</span></div>' +
        "".join(f'<div class="ty">{blank(f"k7_t_{i}", "", "10")}'
                f'{blank(f"k7_th_{i}", "w2", "10")}'
                f'<span class="c">{check(f"k7_tk_{i}", "clay")}</span></div>'
                for i in range(1, 6)) +
        sec("Rotate, do not add", "Half away for a fortnight", "slate") +
        "".join(f'<div class="wl">{blank(f"k7_rot_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Food that takes work", "Enrichment and pacing at once", "clay") +
        "".join(f'<div class="wl">{check(f"k7_pz_{i}", "clay")}'
                f'{blank(f"k7_pz_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("Scratching", "Both kinds, or the sofa becomes one", "slate") +
        "".join(f'<div class="wl">{check(f"k7_sc_{i}", "slate")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Something upright and tall enough to stretch full length",
                                       "Something flat on the floor as well",
                                       "One next to where they sleep &mdash; they scratch on waking",
                                       "One where they already scratch, not where you would prefer",
                                       "Sturdy enough not to wobble, or it will not be used"], start=1)) +
        sec("Where they get up high", "Height is how a cat feels safe", "clay") +
        "".join(f'<div class="wl">{blank(f"k7_hi_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("The window", "Somewhere to sit, something to watch", "slate") +
        "".join(f'<div class="wl">{blank(f"k7_win_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        sec("Somewhere nobody follows them", "", "plum") +
        "".join(f'<div class="wl">{blank(f"k7_safe_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        sec("With another cat in the house", "", "slate") +
        "".join(f'<div class="wl">{check(f"k7_mc_{i}", "slate")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Beds, bowls and posts in more than one room",
                                       "Somewhere each of them can be alone",
                                       "Never fed nose to nose"], start=1)) +
        '</section></div>')

def page_8():
    return sheet(8, "While we<br>are away.", "Cat kit &middot; leave this out for the sitter",
        '<div class="two b46"><section>' +
        sec("The basics", "", "slate") +
        '<div class="split2">' + field("Cat", "k8_cat", "w2") +
        field("Dates", "k8_dates", "w2") + '</div>' +
        field("Us, and the best number", "k8_us") +
        field("If you cannot reach us", "k8_backup") +
        field("Vet, and out-of-hours (page 2)", "k8_vet") +
        field("Insurance policy number", "k8_ins") +
        sec("Feeding", "Amounts, not &#8220;a bit&#8221;", "clay") +
        '<div class="fd head"><span>What</span><span class="w2">How much</span>'
        '<span class="w2">When</span></div>' +
        "".join(f'<div class="fd">{blank(f"k8_f_{i}", "", "10")}'
                f'{blank(f"k8_fh_{i}", "w2", "10")}{blank(f"k8_fw_{i}", "w2", "10")}</div>'
                for i in range(1, 5)) +
        sec("Medication, if any", "", "plum") +
        '<div class="og head"><span>What</span><span>Dose and when</span>'
        '<span class="c">Given</span></div>' +
        "".join(f'<div class="og">{blank(f"k8_m_{i}", "", "10")}'
                f'{blank(f"k8_md_{i}", "", "10")}'
                f'<span class="c">{check(f"k8_mg_{i}", "plum")}</span></div>'
                for i in (1, 2, 3)) +
        '</section><section>' +
        sec("Where everything is", "", "slate") +
        '<div class="wh head"><span>What</span><span>Where</span></div>' +
        "".join(f'<div class="wh"><span class="whn">{t}</span>'
                f'{blank(f"k8_wh_{i}", "", "10")}</div>'
                for i, t in enumerate(["Food and bowls", "Litter and scoop", "Spare litter",
                                       "Carrier", "Cleaning things", "Toys",
                                       "Spare key"], start=1)) +
        '<div class="warn clay">'
        '<b>What to tell someone who has never met this cat</b>'
        '<p>Where they hide, and that hiding is normal for the first day. That they should be '
        '<b>seen</b> every visit, even if it means looking under a bed &mdash; a cat that has not '
        'been laid eyes on is the thing you need to know about. And that the tray tells you '
        'whether they are eating and drinking, so it gets checked even when it looks clean.</p>'
        '</div>' +
        sec("Please do, and please do not", "", "clay") +
        "".join(f'<div class="wl">{check(f"k8_do_{i}", "clay")}'
                f'{blank(f"k8_do_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        sec("Message us if", "", "plum") +
        "".join(f'<div class="wl">{blank(f"k8_msg_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_9():
    return sheet(9, "Anything<br>different.", "Cat kit &middot; the running log",
        '<div class="two b2"><section>' +
        sec("Dated, however small", "Two lines now beat memory", "slate") +
        '<div class="lg head"><span class="lgd">Date</span><span>What you noticed</span>'
        '<span class="c">Told vet</span></div>' +
        "".join(f'<div class="lg">{blank(f"k9_d_{i}", "w2", "10")}'
                f'{blank(f"k9_w_{i}", "grow", "10")}'
                f'<span class="c">{check(f"k9_v_{i}", "plum")}</span></div>'
                for i in range(1, 17)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>What counts as worth writing down</b>'
        '<p>Drinking more or less than usual. Sleeping somewhere new. Not jumping up where they '
        'always jump up. Eating more slowly. Grooming one patch bald. None of these is an '
        'emergency on the day, and all of them are the sort of thing a vet asks &#8220;how long '
        'has that been going on?&#8221; about &mdash; and this page is how you answer.</p>'
        '</div>' +
        sec("Questions for the next appointment", "", "plum") +
        "".join(f'<div class="wl">{blank(f"k9_q_{i}", "grow", "10.5")}</div>'
                for i in range(1, 5)) +
        sec("What the vet said", "", "slate") +
        "".join(f'<div class="wl">{blank(f"k9_said_{i}", "grow", "10.5")}</div>'
                for i in range(1, 5)) +
        sec("What we changed, and whether it helped", "", "clay") +
        "".join(f'<div class="wl">{blank(f"k9_chg_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>', note=HEALTH_FOOT)

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --slate:{C["slate"]}; --clay:{C["clay"]}; --plum:{C["plum"]};
  --backdrop:#e9ebed;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#141618; }} }}
:root[data-theme="dark"]{{ --backdrop:#141618; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Epilogue","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(29,33,38,.15);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:600; text-transform:uppercase; letter-spacing:.16em; font-size:7.4pt;
  color:var(--soft); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in; }}
.mast h1{{ font-family:"Alegreya",Georgia,serif; font-weight:700; font-size:{S["display"]};
  line-height:.98; margin:6px 0 0; letter-spacing:-.012em; }}
.mastright{{ display:flex; align-items:flex-end; gap:13px; position:relative; }}
.paws{{ position:absolute; right:-6px; top:-64px; width:1.24in; height:1.16in;
  color:var(--strong); }}
.pageno{{ font-family:"Alegreya",Georgia,serif; font-weight:700; font-size:17pt;
  color:var(--slate); }}
.pageno i{{ font-style:normal; font-size:9pt; color:var(--faint); }}
.mini{{ display:flex; gap:10px; padding-bottom:3px; }}
.mini .fr{{ height:.22in; }}
.rules{{ display:flex; flex-direction:column; gap:2px; padding-top:9px; flex:none; }}
.rules span{{ height:1.2px; background:var(--ink); }}
.rules span.sl{{ height:3px; background:var(--slate); }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:12px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.02fr 1fr; }}
.two.b2{{ grid-template-columns:1.15fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}

.sec{{ display:flex; align-items:center; gap:9px; padding:9px 0 6px; overflow:hidden; flex:none; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.09em; font-size:8.4pt;
  color:var(--ink); white-space:nowrap; }}
.lbl.slate{{ color:var(--slate); }} .lbl.clay{{ color:var(--clay); }}
.lbl.plum{{ color:var(--plum); }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.5in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.2px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.85in; }} .blank.w3{{ flex:none; width:.52in; }}
.blank.c{{ flex:none; width:.2in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

.box{{ width:11px; height:11px; border:1.4px solid var(--strong); flex:none; margin-bottom:3px;
  border-radius:50%; }}
.box.slate{{ border-color:var(--slate); }} .box.clay{{ border-color:var(--clay); }}
.box.plum{{ border-color:var(--plum); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.28in; max-height:.52in; }}
.rtext{{ font-size:10pt; padding-bottom:3px; line-height:1.15; }}
.footnote{{ font-size:8.4pt; color:var(--faint); line-height:1.45; padding-top:8px; display:block;
  flex:none; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:5px; border-bottom:1.5px solid var(--ink); margin-bottom:5px;
  font-weight:600; text-transform:uppercase; letter-spacing:.07em; font-size:7pt;
  color:var(--soft); }}
.head span, .head .blank{{ border:0; }}

.warn{{ border:1.5px solid var(--slate); border-radius:3px; padding:11px 13px; margin:10px 0;
  flex:none; }}
.warn.plum{{ border-color:var(--plum); }}
.warn.clay{{ border-color:var(--clay); }}
.warn b{{ font-size:9.6pt; }}
.warn p{{ margin:5px 0 0; font-size:9.3pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.oa{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.25fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}

/* page 2 ------------------------------------------------------------------ */
.ems{{ display:flex; flex-direction:column; flex:1 1 auto; }}
.em{{ display:flex; align-items:flex-start; gap:10px; flex:1 1 auto; min-height:.42in;
  max-height:.7in; border-bottom:1px solid var(--rule); padding-top:5px; }}
.em .box{{ margin-top:2px; margin-bottom:0; }}
.emt{{ font-size:9.6pt; line-height:1.25; }}

/* page 3 ------------------------------------------------------------------ */
.rt{{ display:grid; grid-template-columns:minmax(0,1fr) .52in .52in .26in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.34in; max-height:.52in; }}
.rtc{{ padding-bottom:3px; min-width:0; }}
.rtc b{{ display:block; font-size:9.3pt; font-weight:500; line-height:1.15; }}
.rtc i{{ display:block; font-style:normal; font-size:7.8pt; color:var(--faint);
  line-height:1.15; }}
.rt.head .rtc{{ padding-bottom:0; }}
.og{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.15fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.txs{{ display:flex; flex-direction:column; flex:none; }}
.tx{{ display:grid; grid-template-columns:1.32in minmax(0,1fr); gap:0 10px;
  align-items:baseline; min-height:.34in; border-bottom:1px solid var(--rule);
  padding-top:4px; }}
.txn{{ font-size:9.3pt; font-weight:600; color:var(--plum); line-height:1.2; }}
.txw{{ font-size:8.6pt; color:var(--soft); line-height:1.25; }}

/* page 4 ------------------------------------------------------------------ */
.wt{{ display:grid; grid-template-columns:.86in .85in minmax(0,1fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; }}
.wtn{{ font-size:9.2pt; color:var(--slate); font-weight:600; padding-bottom:4px; }}

/* pages 5 to 9 ------------------------------------------------------------ */
.fd{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .85in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.wa{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.ch{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.tr{{ display:grid; grid-template-columns:.22in minmax(0,1.2fr) minmax(0,1fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.trn{{ font-size:8.4pt; color:var(--faint); padding-bottom:4px; }}
.dy{{ display:grid; grid-template-columns:.85in minmax(0,1fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.dyn{{ font-size:9pt; padding-bottom:4px; }}
.ty{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.wh{{ display:grid; grid-template-columns:1.15fr minmax(0,1.35fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.whn{{ font-size:9.4pt; padding-bottom:4px; }}
.lg{{ display:grid; grid-template-columns:.85in minmax(0,1fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.26in; }}
.lgd{{ font-size:9pt; padding-bottom:4px; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.2px solid var(--ink); margin-top:10px; padding-top:8px; }}
.foot .mark{{ font-family:"Alegreya",Georgia,serif; font-style:italic; font-weight:500;
  font-size:9.5pt; color:var(--faint); }}
.dots{{ font-size:6pt; color:var(--clay); letter-spacing:.1em; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-cat.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Nine Lives Cat Care Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-cat-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"cat-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"cat-{name}")
        fill_pdf = os.path.join(DIST, f"cat-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["slate"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Nine Lives &nbsp;&middot;&nbsp; cat care kit",
    title="Start<br><em>here.</em>",
    lede="Nine pages built on the one thing that makes cats different: they hide illness, and the "
         "only way to notice early is to have written the ordinary month down. Records and "
         "numbers, a weight log, the litter tray as a diary, the enrichment an indoor cat needs, "
         "and the page you leave out for the sitter.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Print page 2 first", "the numbers, on the fridge, before you need them"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. Tick the boxes with a click. <b>Save a copy per cat</b> &mdash; pages 1 to 7 are "
        "about one animal, and a second cat wants its own file rather than a shared one.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Two of them are meant "
        "to leave the folder: <b>page 2</b> goes on the fridge with the out-of-hours number filled "
        "in, and <b>page 8</b> gets left on the kitchen table for whoever is feeding the cat while "
        "you are away.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "One copy of pages 1&ndash;7 per cat; pages 8 and 9 can be shared",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="What this is, and what it is not",
    s5p="It is a <b>record book</b>, made by a designer. It is not veterinary advice, not a "
        "diagnosis, and not a substitute for phoning your practice. The signs listed on page 2 are "
        "the short version of what emergency vets ask people to come in for &mdash; they are not "
        "complete, and a cat that seems wrong to you is reason enough to call. Fill in the "
        "out-of-hours number <b>today</b>, while nothing is happening: it is usually a different "
        "practice from your own, and the moment you need it is the moment you cannot look it up.",
    license="Personal use only. Print as many copies as you like for your own cats. Please do not "
            "resell, share or redistribute the files. Fonts: Alegreya and Epilogue "
            "(SIL Open Font License).",
    mark="Cats hide it. Write it down.",
)

PAGE_NAMES = ["This cat", "Numbers &amp; emergencies", "The year of care", "Weight, monthly",
              "Food &amp; water", "The litter tray", "The indoor day", "For the sitter",
              "Anything different"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["slate"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Alegreya",Georgia,serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Epilogue",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Epilogue"'),
                 ("--s1:#f2a65a", "--s1:" + C["clay"]), ("--s2:#ee6c4d", "--s2:" + C["plum"]),
                 ("--s3:#c43e7a", "--s3:" + C["slate"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-style:italic;", "font-style:normal;")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-cat.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    hp = os.path.join(work, "readme-cat.html")
    open(hp, "w", encoding="utf-8").write(tpl)
    B.to_pdf(hp, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-cat.css")
    doc = pymupdf.open(os.path.join(DIST, "cat-planner-letter-slate-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"cat-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["slate"]
    over = (
        "<style>"
        "h1{font-family:'Alegreya',Georgia,serif;font-weight:700;line-height:1.0;"
        "letter-spacing:-.015em}"
        f"h1 em{{font-style:normal;color:{C['clay']}}}"
        "body{font-family:'Epilogue',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['slate']};font-family:'Epilogue';font-weight:600;letter-spacing:.18em}}"
        f".rule{{background:{C['clay']};height:4px;width:220px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Epilogue';font-weight:600;"
        "letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(29,33,38,.17)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Epilogue',Arial,sans-serif;font-weight:600;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>Cats hide it.<br>Write it <em>down.</em></h1>
          <span class="rule"></span>
          <p class="sub">A cat care record built around the one thing that makes cats different
          from every other pet: a monthly weight log, the litter tray kept as a diary, the
          numbers on the fridge, and a page for the sitter.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated, one per cat</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>one cat.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The two pages that leave the folder</span>
      <h1>The numbers.<br><em>The weight log.</em></h1>
      <p class="sub">The out-of-hours vet is usually a different practice from your own, and the
      moment you need it is the moment you cannot look it up &mdash; so page 2 goes on the fridge.
      And weight is the one thing a cat cannot hide, which is why page 4 has twelve rows.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[1]}" style="height:1170px"><img src="{imgs[3]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#eff1f3", "100px", "88px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#edeff1", "100px", "80px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-cat-{name}.html")
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
        BD.package(DIST, "Nine-Lives-Cat-Care-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building cat kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "cat-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "slate", embed_fonts=False))
    print("Wrote cat-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Nine-Lives-Cat-Care-Kit")


if __name__ == "__main__":
    main()
