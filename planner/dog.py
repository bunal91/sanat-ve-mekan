#!/usr/bin/env python3
"""Build the Long Lead dog care kit.

Nine pages built on the thing that actually goes wrong with dogs. A cat hides
illness; a dog tells you everything and is let down by the week around it --
a word that changes depending on who is holding the lead, a walk that is a
route rather than a sniff, a weight that creeps up a kilo at a time. So: the
records and the numbers, the walk, the food and the weight, the words the
whole house agrees on, the hands-on check, the sitter's page, and a log.

    python3 dog.py                  # every size / colourway
    python3 dog.py --only letter-field
    python3 dog.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, math, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-dog")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Rokkitt:wght@500;600;700"
          "&family=Schibsted+Grotesk:wght@400;500;600;700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="37pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="36pt"),
}

COLORWAYS = {
    # moss = the routine, ochre = the dog, brick = anything you telephone about.
    "field": dict(ink="#1a211d", soft="#525c56", faint="#8b938e", rule="#e2e6e3",
                  strong="#c2c9c5", moss="#3f5d4a", ochre="#a8702a", brick="#8c3a30"),
    "mono":  dict(ink="#1f2121", soft="#585b5a", faint="#919494", rule="#e6e7e7",
                  strong="#c5c7c7", moss="#3c3f3e", ochre="#8a8d8c", brick="#3c3f3e"),
}

PAGES = 9
MARK = "Same word. Same hand. Every time."
HEALTH_FOOT = "A record book, not veterinary advice &middot; page 2 has the numbers"

MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# Routine care, with the interval most practices work to. The kit prints the
# schedule and leaves every date blank, because vets and products differ.
ROUTINE = [
    ("Vaccination booster", "Yearly, kennels will ask"),
    ("Worming", "Every 3 months, more if they scavenge"),
    ("Lungworm cover", "Check the product covers it"),
    ("Flea and tick", "Monthly, check the label"),
    ("Full check-up", "Yearly, twice once they are older"),
    ("Teeth looked at", "At the check-up"),
    ("Nails checked", "Clicking on the floor is too long"),
    ("Weighed", "Monthly, page 5"),
    ("Microchip details checked", "Yearly, and after moving"),
    ("Insurance and licence renewed", "Diary it before it lapses"),
]

# --------------------------------------------------------------------------- helpers

def check(f, tone=""):
    return f'<span class="box {tone}" data-field="{f}" data-ftype="check"></span>'

def blank(f, cls="", fs="10.5"):
    return f'<span class="blank {cls}" data-field="{f}" data-fsize="{fs}"></span>'

def sec(label, hint="", tone=""):
    hint = f'<span class="hint">{hint}</span>' if hint else ""
    return (f'<div class="sec"><i class="tick {tone}"></i><span class="lbl">{label}</span>'
            f'<span class="line"></span>{hint}</div>')

def field(label, f, cls="", fs="10.5"):
    return f'<div class="fr"><span class="flbl">{label}</span>{blank(f, cls, fs)}</div>'

def lead(seed=1):
    """A lead, drawn, paying out a little further on every page."""
    t = seed / PAGES
    x0, y0 = 15, 24
    parts = [f'<ellipse cx="{x0}" cy="{y0}" rx="9.5" ry="7.6"/>']      # the hand loop
    ax, ay = 40 + 30 * t, 14 + 44 * t                                   # the slack swings out
    bx, by = 70 - 24 * t, 74 + 22 * t
    ex, ey = 106, 100
    parts.append(f'<path d="M{x0 + 9.5:.1f} {y0} C{ax:.1f} {ay:.1f} {bx:.1f} {by:.1f} {ex} {ey}"/>')
    parts.append(f'<path d="M{ex} {ey} l8.5 6.5"/>')                    # and the trigger clip
    parts.append(f'<ellipse cx="{ex + 13}" cy="{ey + 10}" rx="5.6" ry="4.7"/>')
    return (f'<svg class="lead" viewBox="0 0 132 122" aria-hidden="true">'
            f'<g fill="none" stroke="currentColor" stroke-width="1.15" '
            f'stroke-linecap="round">{"".join(parts)}</g></svg>')

def sheet(n, title, kicker, body, note=None):
    meta = (f'<div class="mini">{field("Date", f"g{n}_date", "w2", "9")}</div>' if n > 1 else '')
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{lead(n)}{meta}<span class="pageno">{n}<i>/{PAGES}</i></span></div>
  </header>
  <div class="bar"><span class="fill" style="width:{12 + n * 8}%"></span><span class="rest"></span></div>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{note or MARK}</span>
    <span class="clip"></span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    return sheet(1, "This<br>dog.", "Dog kit &middot; who they are",
        '<div class="two b46"><section>' +
        sec("The facts", "One sheet per dog", "moss") +
        field("Name", "g1_name") +
        field("Called, actually", "g1_called") +
        '<div class="split2">' + field("Born or about", "g1_born", "w2") +
        field("Came home", "g1_came", "w2") + '</div>' +
        field("Breed, or best guess", "g1_breed") +
        field("Colour and markings", "g1_marks") +
        '<div class="split2">' + field("Neutered", "g1_neuter", "w2") +
        field("Grown weight", "g1_grown", "w2") + '</div>' +
        sec("The numbers you cannot look up in a hurry", "", "brick") +
        field("Microchip number", "g1_chip") +
        field("Chip registered with", "g1_chipco") +
        field("Insurance, and policy number", "g1_ins") +
        field("Registered at (practice)", "g1_practice") +
        field("Licence or council registration", "g1_licence") +
        '<div class="warn brick">'
        '<b>The chip gets them home tomorrow. The tag gets them home tonight.</b>'
        '<p>A microchip needs a stranger to find a vet or a scanner, and it only works if the '
        'record attached to it is still yours &mdash; after a move, a new number, or a rehoming '
        'it very often is not. A tag is read by the person standing over your dog. Put your '
        '<b>mobile number</b> on it, not the dog&#8217;s name, and check both once a year.</p>'
        '</div>' +
        sec("Where they came from", "", "moss") +
        field("Breeder, rescue or found", "g1_from") +
        field("Anything known about before", "g1_before") +
        '</section><section>' +
        sec("What a stranger would need to know", "", "ochre") +
        field("Good with", "g1_ok") +
        field("Not good with", "g1_notok") +
        field("What frightens them", "g1_scare") +
        field("What they guard, honestly", "g1_guard") +
        field("Where they sleep", "g1_sleep") +
        field("Handled, lifted, collar grabbed?", "g1_handle") +
        field("How they ask to go out", "g1_askout") +
        field("How they ask to be left alone", "g1_askalone") +
        sec("Things they already do that are theirs", "", "ochre") +
        "".join(f'<div class="wl">{blank(f"g1_quirk_{i}", "grow", "10.5")}</div>'
                for i in range(1, 4)) +
        sec("If they are ever lost", "", "brick") +
        "".join(f'<div class="wl">{check(f"g1_ph_{i}", "brick")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Clear photograph taken this year, standing, side on",
                                       "A second one of the face, and of anything unusual",
                                       "Stored somewhere other than your phone",
                                       "Tag on the collar says a number that still works"], start=1)) +
        sec("Other animals in the house", "", "moss") +
        '<div class="oa head"><span>Who</span><span>How they get on</span></div>' +
        "".join(f'<div class="oa">{blank(f"g1_oa_{i}", "", "10")}'
                f'{blank(f"g1_oah_{i}", "", "10")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

EMERGENCIES = [
    "Belly swollen and tight, trying to be sick and bringing nothing up, pacing &mdash; "
    "deep-chested dogs especially. Hours matter.",
    "Overheated: panting hard, staggering, gums brick red or very pale. Start cooling, "
    "phone on the way.",
    "A fit lasting more than a few minutes, or one after another without waking up between",
    "Eaten chocolate, sugar-free gum or sweets, grapes, raisins, or any human medicine &mdash; "
    "phone with the packet in your hand",
    "Swallowed a ball, a sock, a corn cob, a stick or a bone",
    "Hit by a car, a bad fall, or a fight &mdash; even if they get straight up",
    "Gums pale, white or blue, collapse, or a belly that swells after an accident",
    "Straining and producing nothing, or not able to pass water",
]

def page_2():
    rows = "".join(
        f'<div class="em">{check(f"g2_em_{i}", "brick")}<span class="emt">{t}</span></div>'
        for i, t in enumerate(EMERGENCIES, start=1))
    return sheet(2, "Numbers, and<br>when to use them.", "Dog kit &middot; the page on the fridge",
        '<div class="two b46"><section>' +
        sec("The practice", "", "moss") +
        field("Vet", "g2_vet") +
        field("Daytime number", "g2_day") +
        field("Address", "g2_addr") +
        sec("Out of hours &mdash; usually somewhere else", "", "brick") +
        field("Who covers nights", "g2_ooh_who") +
        field("Number", "g2_ooh_num") +
        field("Address, and how long it takes", "g2_ooh_addr") +
        sec("Also worth having", "", "moss") +
        field("Insurance claim line", "g2_claim") +
        field("Microchip company", "g2_chipline") +
        field("Animal poisons helpline", "g2_poison") +
        field("Whoever has a spare key", "g2_key") +
        '<div class="warn brick">'
        '<b>Photograph this page once it is filled in</b>'
        '<p>The moment you need the out-of-hours number is the moment you cannot find the folder. '
        'Fill it in, take a picture of it on your phone, and put the paper copy on the fridge '
        'rather than in a drawer. Tell the person who walks the dog where it is.</p>'
        '</div>' +
        sec("Getting there", "Worked out once, not at midnight", "moss") +
        field("Who drives, if it is 3am", "g2_drive") +
        '<div class="split2">' + field("How long", "g2_howlong", "w2") +
        field("Dog&#8217;s weight", "g2_wt", "w2") + '</div>' +
        field("Can you lift this dog alone? Who helps?", "g2_lift") +
        '</section><section>' +
        sec("Phone now, do not wait until morning", "", "brick") +
        f'<div class="ems">{rows}</div>' +
        '<span class="footnote">This list is the short version of what emergency vets ask people '
        'to come in for. It is not a diagnosis and it is not complete. A dog that seems wrong to '
        'you is a good enough reason to phone &mdash; you know this animal and they do not.</span>' +
        sec("Anything else to watch for, for this dog", "", "ochre") +
        "".join(f'<div class="wl">{blank(f"g2_own_{i}", "grow", "10.5")}</div>'
                for i in range(1, 4)) +
        '</section></div>', note=HEALTH_FOOT)

TOXIC = [
    ("Chocolate", "The darker and the smaller the dog, the worse. Keep the wrapper."),
    ("Xylitol / birch sugar", "Sugar-free gum, sweets, some peanut butter. Fast collapse."),
    ("Grapes, raisins, sultanas", "Including mince pies and fruit loaf. No known safe amount."),
    ("Human painkillers", "Ibuprofen and paracetamol. Never guess a dose."),
    ("Cooked bones, corn cobs", "Bones splinter; a cob is the classic blockage."),
    ("Onion, garlic, leek", "Cooked or raw, including in gravy and stock."),
    ("Antifreeze, slug pellets", "Sweet, and lethal in small amounts. Check the shed."),
]

def page_3():
    rows = "".join(
        f'<div class="rt"><span class="rtc"><b>{what}</b><i>{how}</i></span>'
        f'{blank(f"g3_last_{i}", "w3", "10")}{blank(f"g3_due_{i}", "w3", "10")}'
        f'<span class="c">{check(f"g3_ok_{i}", "moss")}</span></div>'
        for i, (what, how) in enumerate(ROUTINE, start=1))
    tox = "".join(
        f'<div class="tx"><span class="txn">{what}</span><span class="txw">{why}</span></div>'
        for what, why in TOXIC)
    return sheet(3, "The year<br>of care.", "Dog kit &middot; what is due, and when",
        '<div class="two b46"><section>' +
        sec("Routine care", "Intervals vary &mdash; the vet decides", "moss") +
        '<div class="rt head"><span class="rtc">What, and how often</span>'
        '<span class="w3">Last</span><span class="w3">Due</span>'
        '<span class="c">Done</span></div>' + rows +
        sec("Anything ongoing", "Medication, a condition, a diet", "brick") +
        '<div class="og head"><span>What</span><span>Dose and when</span>'
        '<span class="c">Repeat</span></div>' +
        "".join(f'<div class="og">{blank(f"g3_og_{i}", "", "10")}'
                f'{blank(f"g3_ogd_{i}", "", "10")}'
                f'<span class="c">{check(f"g3_ogr_{i}", "brick")}</span></div>'
                for i in (1, 2, 3)) +
        sec("Appointments made", "", "moss") +
        '<div class="og head"><span>What for</span><span>When</span>'
        '<span class="c">Been</span></div>' +
        "".join(f'<div class="og">{blank(f"g3_ap_{i}", "", "10")}'
                f'{blank(f"g3_apw_{i}", "", "10")}'
                f'<span class="c">{check(f"g3_apo_{i}", "moss")}</span></div>'
                for i in (1, 2, 3)) +
        '</section><section>' +
        sec("Keep out of reach", "The short list, and the reason", "brick") +
        f'<div class="txs">{tox}</div>' +
        '<span class="footnote">If something has been eaten, phone before you wait to see. '
        'Take the packet with you &mdash; how much, how strong and how long ago are the three '
        'things you will be asked, and a guess is worth less than a wrapper.</span>' +
        sec("Where the records live", "", "moss") +
        field("Vaccination card", "g3_card") +
        field("Insurance documents", "g3_docs") +
        field("Food or medicine from", "g3_pharm") +
        sec("Cost of the year", "", "ochre") +
        '<div class="split2">' + field("Insurance", "g3_c_ins", "w2") +
        field("Food", "g3_c_food", "w2") + '</div>' +
        '<div class="split2">' + field("Vet", "g3_c_vet", "w2") +
        field("Everything else", "g3_c_other", "w2") + '</div>' +
        sec("Worth asking at the next check-up", "", "moss") +
        "".join(f'<div class="wl">{check(f"g3_ask_{i}", "moss")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Is this weight right for this dog?",
                                       "Do the teeth need doing?",
                                       "Is the worm and flea routine still the right one?",
                                       "Anything to expect at this age or in this breed?"], start=1)) +
        '</section></div>', note=HEALTH_FOOT)

def page_4():
    rows = "".join(
        f'<div class="wk"><span class="wkd">{d[:3]}</span>{blank(f"g4_wh_{i}", "", "10")}'
        f'{blank(f"g4_hm_{i}", "w3", "10")}'
        f'<span class="c">{check(f"g4_of_{i}", "ochre")}</span>'
        f'<span class="c">{check(f"g4_sn_{i}", "moss")}</span></div>'
        for i, d in enumerate(DAYS, start=1))
    return sheet(4, "Out.", "Dog kit &middot; the walk, and what it is for",
        '<div class="two b46"><section>' +
        '<div class="warn ochre">'
        '<b>The sniffing is the walk</b>'
        '<p>A dog reads the lamp post the way you read your phone, and twenty minutes of being '
        'allowed to do it properly will settle a dog that an hour of marching will not. Let the '
        'lead go slack and let them choose where to stop. A ball thrown a hundred times is '
        'exercise, but it is also the same joint, the same skid and the same adrenaline a hundred '
        'times &mdash; it is a part of the week, not the whole of it.</p>'
        '</div>' +
        sec("The week", "Off = off the lead &middot; Sniff = let to choose", "moss") +
        '<div class="wk head"><span class="wkd">Day</span><span>Where we went</span>'
        '<span class="w3">Mins</span><span class="c">Off</span>'
        '<span class="c">Sniff</span></div>' + rows +
        sec("How the week went", "", "ochre") +
        "".join(f'<div class="wl">{blank(f"g4_af_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        sec("What this dog needs in a day", "Not the breed book", "ochre") +
        '<div class="split2">' + field("Walking", "g4_need_walk", "w2") +
        field("Sniffing", "g4_need_sniff", "w2") + '</div>' +
        '<div class="split2">' + field("Training", "g4_need_train", "w2") +
        field("Sleep", "g4_need_sleep", "w2") + '</div>' +
        '</section><section>' +
        sec("Where they can be off the lead", "", "moss") +
        "".join(f'<div class="wl">{blank(f"g4_off_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Where they absolutely cannot", "Livestock, roads", "brick") +
        "".join(f'<div class="wl">{blank(f"g4_non_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '<div class="warn brick">'
        '<b>Heat, and the five-second rule</b>'
        '<p>Press the back of your hand to the pavement and hold it there. If you cannot keep it '
        'for five seconds, they cannot walk on it. Walk early or late, take water, and skip it '
        'altogether on the hot days &mdash; a missed walk costs you nothing. Flat-faced, heavy, '
        'old and black-coated dogs overheat first, and a car in the shade with a window open is '
        'still a car.</p>'
        '</div>' +
        sec("The long line", "How recall is practised before it is trusted", "ochre") +
        "".join(f'<div class="wl">{check(f"g4_ll_{i}", "ochre")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["A long line on a harness, never on a collar",
                                       "Paid every single time they come, at first",
                                       "Called only for something they want",
                                       "Let go again after coming &mdash; or coming ends the fun"],
                                      start=1)) +
        sec("Rest days, and after", "More sleep than you think", "moss") +
        "".join(f'<div class="wl">{blank(f"g4_rest_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

def page_5():
    wrows = "".join(
        f'<div class="wt"><span class="wtn">{m}</span>{blank(f"g5_kg_{i}", "w2", "10.5")}'
        f'{blank(f"g5_note_{i}", "grow", "10")}</div>'
        for i, m in enumerate(MONTHS, start=1))
    return sheet(5, "Food, and<br>the waistline.", "Dog kit &middot; measured, not guessed",
        '<div class="two b46"><section>' +
        sec("What they eat", "Weighed on scales, not scooped", "ochre") +
        '<div class="fd head"><span>What</span><span class="w2">How much</span>'
        '<span class="w2">When</span></div>' +
        "".join(f'<div class="fd">{blank(f"g5_f_{i}", "", "10")}'
                f'{blank(f"g5_fh_{i}", "w2", "10")}{blank(f"g5_fw_{i}", "w2", "10")}</div>'
                for i in range(1, 5)) +
        sec("Treats", "A tenth of the day, taken out of the meal", "ochre") +
        "".join(f'<div class="wl">{blank(f"g5_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Never, for this dog", "An allergy, a diet, or a firm no", "brick") +
        "".join(f'<div class="wl">{check(f"g5_no_{i}", "brick")}'
                f'{blank(f"g5_no_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Changing food", "Over a week, mixed in", "moss") +
        "".join(f'<div class="ch">{blank(f"g5_ch_{i}", "", "10")}'
                f'{blank(f"g5_chd_{i}", "w2", "10")}'
                f'<span class="c">{check(f"g5_cho_{i}", "moss")}</span></div>'
                for i in (1, 2)) +
        '<div class="warn ochre">'
        '<b>Felt with your hands, not judged by eye</b>'
        '<p>Run your fingers flat along the ribs: they should feel like the back of your hand with '
        'the fingers spread &mdash; there, under a little cover, without pressing. Look down from '
        'above for a waist, and from the side for a tuck. Most of us cannot see the extra kilo on '
        'our own dog, which is exactly why the column beside this one is worth filling in.</p>'
        '</div>' +
        sec("Who else feeds this dog", "Everyone counts", "moss") +
        "".join(f'<div class="wl">{blank(f"g5_who_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section><section>' +
        sec("Weight, same scales, same week", "Kilos or pounds", "moss") +
        '<div class="wt head"><span class="wtn">Month</span><span class="w2">Weight</span>'
        '<span>What else you noticed</span></div>' + wrows +
        sec("Ideal weight, if the vet has given one", "", "brick") +
        '<div class="split2">' + field("Ideal", "g5_ideal", "w2") +
        field("Told on", "g5_ideal_when", "w2") + '</div>' +
        '<span class="footnote">A dog kept lean stays sound for longer, moves better for longer, '
        'and asks less of hips and knees that already have a hard job. Gaining a kilo a year is '
        'invisible; twelve rows of numbers are not.</span>' +
        '</section></div>', note=HEALTH_FOOT)

WORDS = [
    ("Come back", "g6_w_come"),
    ("Sit", "g6_w_sit"),
    ("Down", "g6_w_down"),
    ("Wait / stay", "g6_w_wait"),
    ("Leave it", "g6_w_leave"),
    ("Drop it", "g6_w_drop"),
    ("Off the furniture", "g6_w_off"),
    ("Bed / settle", "g6_w_bed"),
    ("Good &mdash; the marker", "g6_w_yes"),
    ("Free, you can go", "g6_w_free"),
]

def page_6():
    rows = "".join(
        f'<div class="wd"><span class="wdn">{what}</span>{blank(f"{f}", "", "10")}'
        f'{blank(f"{f}_h", "", "10")}</div>' for what, f in WORDS)
    log = "".join(
        f'<div class="tl"><span class="tld">{d[:3]}</span>{blank(f"g6_tw_{i}", "", "10")}'
        f'<span class="c">{check(f"g6_t1_{i}", "moss")}</span>'
        f'<span class="c">{check(f"g6_t2_{i}", "moss")}</span>'
        f'<span class="c">{check(f"g6_t3_{i}", "moss")}</span></div>'
        for i, d in enumerate(DAYS, start=1))
    return sheet(6, "Same<br>word.", "Dog kit &middot; what the whole house says",
        '<div class="two b46"><section>' +
        '<div class="warn">'
        '<b>A dog cannot learn a word that keeps changing</b>'
        '<p>If it is &#8220;come&#8221; from you, &#8220;here&#8221; from the children and the '
        'dog&#8217;s name shouted twice from the garden, that is three words for one thing and none '
        'of them means anything yet. Agree on one word each, write it here, and put the page on the '
        'fridge so the whole house is teaching the same lesson.</p>'
        '</div>' +
        sec("The words we use", "And the hand that goes with it", "ochre") +
        '<div class="wd head"><span class="wdn">What we ask</span>'
        '<span>The word</span><span>The hand signal</span></div>' + rows +
        sec("Never used as a punishment", "Or it stops working", "brick") +
        "".join(f'<div class="wl">{check(f"g6_np_{i}", "brick")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["The recall word &mdash; coming back is always worth it",
                                       "Their bed, or their crate",
                                       "Their name on its own"], start=1)) +
        '</section><section>' +
        sec("Five minutes, three times a day", "Short beats long", "moss") +
        '<div class="tl head"><span class="tld">Day</span><span>What we practised</span>'
        '<span class="c">1</span><span class="c">2</span><span class="c">3</span></div>' + log +
        sec("What we are working on now", "One thing at a time", "ochre") +
        '<div class="wo head"><span>The thing</span><span>Started</span>'
        '<span>Where we are</span></div>' +
        "".join(f'<div class="wo">{blank(f"g6_wo_{i}", "", "10")}'
                f'{blank(f"g6_wos_{i}", "w3", "10")}{blank(f"g6_wow_{i}", "", "10")}</div>'
                for i in (1, 2, 3)) +
        sec("What actually pays this dog", "Not always food", "ochre") +
        "".join(f'<div class="wl"><span class="rn">{i}</span>'
                f'{blank(f"g6_pay_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Rules the house has agreed", "Sofa, beds, doorways", "moss") +
        "".join(f'<div class="wl">{blank(f"g6_rule_{i}", "grow", "10.5")}</div>'
                for i in (1, 2, 3)) +
        '</section></div>')

CHECKS = [
    ("Ears", "Smell, redness, head shaking"),
    ("Eyes", "Clear, no squinting"),
    ("Teeth and gums", "Pink, no tartar line, breath"),
    ("Nails", "No clicking on hard floors"),
    ("Feet and pads", "Between the toes, grass seeds"),
    ("Coat and skin", "Part it &mdash; scurf, hot spots"),
    ("Along the body", "Both hands, slowly, for lumps"),
    ("Bottom and tail", "Scooting, soreness, anything caught"),
    ("Ticks", "After every walk in long grass"),
]

def page_7():
    rows = "".join(
        f'<div class="ck"><span class="ckn"><b>{what}</b><i>{how}</i></span>'
        f'<span class="c">{check(f"g7_c_{i}", "moss")}</span>'
        f'{blank(f"g7_n_{i}", "", "10")}</div>'
        for i, (what, how) in enumerate(CHECKS, start=1))
    return sheet(7, "Hands<br>on.", "Dog kit &middot; the weekly once-over",
        '<div class="two b46"><section>' +
        sec("Once a week, the same way round", "In your lap", "moss") +
        '<div class="ck head"><span class="ckn">What, and what to feel for</span>'
        '<span class="c">Done</span><span>Noticed</span></div>' + rows +
        '<div class="warn">'
        '<b>Why a dog that is handled every week is easier at the vet</b>'
        '<p>Ears looked in, paws held, mouth opened, tail lifted &mdash; done at home, in your lap, '
        'for nothing more than a piece of chicken. A dog who has had all of that a hundred times '
        'does not need holding down for it on a table. It is also how you find the lump in the '
        'week it appears rather than the month it is obvious.</p>'
        '</div>' +
        sec("Grooming", "Coat type decides everything here", "ochre") +
        '<div class="split2">' + field("Brushed", "g7_brush", "w2") +
        field("Bathed", "g7_bath", "w2") + '</div>' +
        '<div class="split2">' + field("Clipped", "g7_clip", "w2") +
        field("Nails", "g7_nails", "w2") + '</div>' +
        field("Groomer, and number", "g7_groomer") +
        '</section><section>' +
        sec("Teeth", "The only thing that really works is daily", "brick") +
        "".join(f'<div class="wl">{check(f"g7_th_{i}", "brick")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Dog toothpaste only &mdash; human paste can contain xylitol",
                                       "Lift the lip and do the outside; that is where it forms",
                                       "A few seconds daily beats a scrub once a month",
                                       "Nothing so hard you would not hit your own knee with it"],
                                      start=1)) +
        sec("Lumps, bumps and anything new", "Where, how big, and when", "brick") +
        '<div class="lm head"><span class="lmd">Date</span><span>Where on the body</span>'
        '<span class="w3">Size</span><span class="c">Vet</span></div>' +
        "".join(f'<div class="lm">{blank(f"g7_ld_{i}", "w2", "10")}'
                f'{blank(f"g7_lw_{i}", "", "10")}{blank(f"g7_ls_{i}", "w3", "10")}'
                f'<span class="c">{check(f"g7_lv_{i}", "brick")}</span></div>'
                for i in range(1, 8)) +
        '<span class="footnote">Measure it against something &mdash; a pea, a grape, a coin &mdash; '
        'and write the date. Whether a lump is changing is the question that gets asked, and it is '
        'not one anybody can answer from memory.</span>' +
        sec("What they hate having done, and how we manage it", "", "ochre") +
        "".join(f'<div class="wl">{blank(f"g7_hate_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>', note=HEALTH_FOOT)

def page_8():
    return sheet(8, "While we<br>are away.", "Dog kit &middot; leave this out for the sitter",
        '<div class="two b46"><section>' +
        sec("The basics", "", "moss") +
        '<div class="split2">' + field("Dog", "g8_dog", "w2") +
        field("Dates", "g8_dates", "w2") + '</div>' +
        field("Us, and the best number", "g8_us") +
        field("If you cannot reach us", "g8_backup") +
        field("Vet, and out-of-hours (page 2)", "g8_vet") +
        field("Insurance policy number", "g8_ins") +
        field("Kennel or sitter, and number", "g8_sitter") +
        sec("Feeding", "Amounts, not &#8220;a bit&#8221;", "ochre") +
        '<div class="fd head"><span>What</span><span class="w2">How much</span>'
        '<span class="w2">When</span></div>' +
        "".join(f'<div class="fd">{blank(f"g8_f_{i}", "", "10")}'
                f'{blank(f"g8_fh_{i}", "w2", "10")}{blank(f"g8_fw_{i}", "w2", "10")}</div>'
                for i in range(1, 4)) +
        sec("Medication, if any", "", "brick") +
        '<div class="og head"><span>What</span><span>Dose and when</span>'
        '<span class="c">Given</span></div>' +
        "".join(f'<div class="og">{blank(f"g8_m_{i}", "", "10")}'
                f'{blank(f"g8_md_{i}", "", "10")}'
                f'<span class="c">{check(f"g8_mg_{i}", "brick")}</span></div>'
                for i in (1, 2, 3)) +
        sec("The walks", "Where, how long, and on what", "moss") +
        "".join(f'<div class="wl">{blank(f"g8_walk_{i}", "grow", "10.5")}</div>'
                for i in (1, 2, 3)) +
        '</section><section>' +
        '<div class="warn brick">'
        '<b>Not off the lead. Not for the first week.</b>'
        '<p>A dog with perfect recall at home has no recall at all in a strange field with the '
        'person they are worried about. Keep them on a lead or a long line, check the tag says a '
        'number that will be answered while we are away, and if there is any chance of a slip '
        'lead being needed, it is on the hook by the door.</p>'
        '</div>' +
        sec("Where everything is", "", "moss") +
        '<div class="wh head"><span>What</span><span>Where</span></div>' +
        "".join(f'<div class="wh"><span class="whn">{t}</span>'
                f'{blank(f"g8_wh_{i}", "", "10")}</div>'
                for i, t in enumerate(["Food, and the scoop or scales", "Lead, harness, long line",
                                       "Poo bags", "Towels", "Bed and favourite toy",
                                       "Spare key"], start=1)) +
        sec("Please do, and please do not", "", "ochre") +
        "".join(f'<div class="wl">{check(f"g8_do_{i}", "ochre")}'
                f'{blank(f"g8_do_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("Message us if", "", "brick") +
        "".join(f'<div class="wl">{blank(f"g8_msg_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_9():
    return sheet(9, "Anything<br>different.", "Dog kit &middot; the running log",
        '<div class="two b2"><section>' +
        sec("Dated, however small", "Two lines now beat memory", "moss") +
        '<div class="lg head"><span class="lgd">Date</span><span>What you noticed</span>'
        '<span class="c">Told vet</span></div>' +
        "".join(f'<div class="lg">{blank(f"g9_d_{i}", "w2", "10")}'
                f'{blank(f"g9_w_{i}", "grow", "10")}'
                f'<span class="c">{check(f"g9_v_{i}", "brick")}</span></div>'
                for i in range(1, 17)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>What counts as worth writing down</b>'
        '<p>Slow to get up after a lie-down. Drinking more. Off the stairs, or off the sofa they '
        'always get on. Licking one paw. Scratching one ear. Eating more slowly, or turning the '
        'head to chew. A lump that feels different. None of these is an emergency on the day, and '
        'all of them are the sort of thing a vet asks &#8220;how long has that been going '
        'on?&#8221; about &mdash; and this page is how you answer.</p>'
        '</div>' +
        sec("Questions for the next appointment", "", "brick") +
        "".join(f'<div class="wl">{blank(f"g9_q_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("What the vet said", "", "moss") +
        "".join(f'<div class="wl">{blank(f"g9_said_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("What we changed, and whether it helped", "", "ochre") +
        "".join(f'<div class="wl">{blank(f"g9_chg_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>', note=HEALTH_FOOT)

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --moss:{C["moss"]}; --ochre:{C["ochre"]}; --brick:{C["brick"]};
  --backdrop:#e8ebe9;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#131614; }} }}
:root[data-theme="dark"]{{ --backdrop:#131614; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Schibsted Grotesk","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(26,33,29,.15);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:600; text-transform:uppercase; letter-spacing:.15em; font-size:7.4pt;
  color:var(--soft); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in; }}
.mast h1{{ font-family:"Rokkitt",Rockwell,Georgia,serif; font-weight:700; font-size:{S["display"]};
  line-height:.94; margin:5px 0 0; letter-spacing:-.006em; }}
.mastright{{ display:flex; align-items:flex-end; gap:13px; position:relative; }}
.lead{{ position:absolute; right:-8px; top:-62px; width:1.3in; height:1.2in;
  color:var(--strong); }}
.pageno{{ font-family:"Rokkitt",Rockwell,Georgia,serif; font-weight:700; font-size:18pt;
  color:var(--moss); }}
.pageno i{{ font-style:normal; font-size:9pt; color:var(--faint); }}
.mini{{ display:flex; gap:10px; padding-bottom:4px; }}
.mini .fr{{ display:flex; align-items:flex-end; gap:8px; flex:none; height:.22in; }}

/* the bar under the masthead pays out with the page number */
.bar{{ display:flex; height:5px; margin-top:9px; flex:none; }}
.fill{{ background:var(--moss); flex:none; }}
.rest{{ background:var(--rule); flex:1; }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:11px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.02fr 1fr; }}
.two.b2{{ grid-template-columns:1.15fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}

.sec{{ display:flex; align-items:center; gap:8px; padding:9px 0 6px; overflow:hidden; flex:none; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.tick{{ width:7px; height:7px; background:var(--ink); flex:none; }}
.tick.moss{{ background:var(--moss); }} .tick.ochre{{ background:var(--ochre); }}
.tick.brick{{ background:var(--brick); }}
.lbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.08em; font-size:8.3pt;
  color:var(--ink); white-space:nowrap; }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.5in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.2px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.85in; }} .blank.w3{{ flex:none; width:.5in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

.box{{ width:11px; height:11px; border:1.5px solid var(--strong); flex:none; margin-bottom:3px;
  border-radius:1.5px; }}
.box.moss{{ border-color:var(--moss); }} .box.ochre{{ border-color:var(--ochre); }}
.box.brick{{ border-color:var(--brick); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.28in;
  max-height:.52in; }}
.rtext{{ font-size:10pt; padding-bottom:3px; line-height:1.15; }}
.rn{{ font-family:"Rokkitt",Rockwell,Georgia,serif; font-weight:700; font-size:11pt;
  color:var(--ochre); padding-bottom:2px; }}
.footnote{{ font-size:8.4pt; color:var(--faint); line-height:1.45; padding-top:8px; display:block;
  flex:none; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:5px; border-bottom:1.5px solid var(--ink); margin-bottom:5px;
  font-weight:600; text-transform:uppercase; letter-spacing:.06em; font-size:7pt;
  color:var(--soft); }}
.head span, .head .blank{{ border:0; }}

.warn{{ border-left:4px solid var(--moss); background:#00000005; padding:10px 13px;
  margin:10px 0; flex:none; }}
.warn.brick{{ border-left-color:var(--brick); }}
.warn.ochre{{ border-left-color:var(--ochre); }}
.warn b{{ font-size:9.6pt; }}
.warn p{{ margin:5px 0 0; font-size:9.3pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.oa{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.25fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}

/* page 2 ------------------------------------------------------------------ */
.ems{{ display:flex; flex-direction:column; flex:1 1 auto; }}
.em{{ display:flex; align-items:flex-start; gap:10px; flex:1 1 auto; min-height:.4in;
  max-height:.72in; border-bottom:1px solid var(--rule); padding-top:5px; }}
.em .box{{ margin-top:2px; margin-bottom:0; }}
.emt{{ font-size:9.5pt; line-height:1.25; }}

/* page 3 ------------------------------------------------------------------ */
.rt{{ display:grid; grid-template-columns:minmax(0,1fr) .5in .5in .26in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.32in; max-height:.5in; }}
.rtc{{ padding-bottom:3px; min-width:0; }}
.rtc b{{ display:block; font-size:9.2pt; font-weight:500; line-height:1.15; }}
.rtc i{{ display:block; font-style:normal; font-size:7.7pt; color:var(--faint); line-height:1.15; }}
.rt.head .rtc{{ padding-bottom:0; }}
.og{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.15fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.txs{{ display:flex; flex-direction:column; flex:none; }}
.tx{{ display:grid; grid-template-columns:1.3in minmax(0,1fr); gap:0 10px;
  align-items:baseline; min-height:.33in; border-bottom:1px solid var(--rule); padding-top:4px; }}
.txn{{ font-size:9.2pt; font-weight:600; color:var(--brick); line-height:1.2; }}
.txw{{ font-size:8.5pt; color:var(--soft); line-height:1.25; }}

/* page 4 ------------------------------------------------------------------ */
.wk{{ display:grid; grid-template-columns:.42in minmax(0,1fr) .5in .3in .34in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.48in; }}
.wkd{{ font-size:9pt; color:var(--moss); font-weight:600; padding-bottom:4px; }}

/* page 5 ------------------------------------------------------------------ */
.wt{{ display:grid; grid-template-columns:.8in .8in minmax(0,1fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.29in; max-height:.44in; }}
.wtn{{ font-size:9.1pt; color:var(--moss); font-weight:600; padding-bottom:4px; }}

/* page 6 ------------------------------------------------------------------ */
.wd{{ display:grid; grid-template-columns:1.12in minmax(0,1fr) minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.wdn{{ font-size:9.1pt; padding-bottom:4px; line-height:1.1; }}
.tl{{ display:grid; grid-template-columns:.34in minmax(0,1fr) .26in .26in .26in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.tld{{ font-size:8.6pt; color:var(--moss); font-weight:600; padding-bottom:4px; }}
.wo{{ display:grid; grid-template-columns:minmax(0,1fr) .6in minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* page 7 ------------------------------------------------------------------ */
.ck{{ display:grid; grid-template-columns:1.62in .3in minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.33in; max-height:.5in; }}
.ckn{{ padding-bottom:3px; min-width:0; }}
.ckn b{{ display:block; font-size:9.2pt; font-weight:500; line-height:1.15; }}
.ckn i{{ display:block; font-style:normal; font-size:7.7pt; color:var(--faint); line-height:1.15; }}
.ck.head .ckn{{ padding-bottom:0; }}
.lm{{ display:grid; grid-template-columns:.72in minmax(0,1fr) .5in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* pages 5 to 9 ------------------------------------------------------------ */
.fd{{ display:grid; grid-template-columns:minmax(0,1fr) .8in .8in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.ch{{ display:grid; grid-template-columns:minmax(0,1fr) .8in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.wh{{ display:grid; grid-template-columns:1.15fr minmax(0,1.35fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.whn{{ font-size:9.4pt; padding-bottom:4px; }}
.lg{{ display:grid; grid-template-columns:.85in minmax(0,1fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.26in; }}
.lgd{{ font-size:9pt; padding-bottom:4px; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.2px solid var(--ink); margin-top:10px; padding-top:8px; }}
.foot .mark{{ font-family:"Rokkitt",Rockwell,Georgia,serif; font-weight:600; font-size:10pt;
  color:var(--faint); letter-spacing:.01em; }}
.clip{{ width:26px; height:7px; border:1.4px solid var(--ochre); border-radius:4px; flex:none; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-dog.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Long Lead Dog Care Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-dog-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"dog-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"dog-{name}")
        fill_pdf = os.path.join(DIST, f"dog-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["moss"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Long Lead &nbsp;&middot;&nbsp; dog care kit",
    title="Start<br><em>here.</em>",
    lede="Nine pages for the dog you already have. The records and the numbers, the walk and what "
         "it is actually for, food weighed rather than guessed and a year of weights, the words "
         "the whole house agrees to use, the weekly hands-on check, the page you leave for the "
         "sitter, and somewhere to write down the small things.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Print page 2 first", "the numbers, on the fridge, before you need them"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. Tick the boxes with a click. <b>Save a copy per dog</b> &mdash; pages 1 to 7 are "
        "about one animal, and a second dog wants its own file rather than a shared one.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Three of them are "
        "meant to leave the folder: <b>page 2</b> goes on the fridge with the out-of-hours number "
        "filled in, <b>page 6</b> goes up where the family will read it so everyone uses the same "
        "words, and <b>page 8</b> gets left out for whoever has the dog while you are away.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "One copy of pages 1&ndash;7 per dog; pages 8 and 9 can be shared",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="What this is, and what it is not",
    s5p="It is a <b>record book</b>, made by a designer. It is not veterinary advice, not a "
        "diagnosis, not a training course, and not a substitute for phoning your practice. The "
        "signs listed on page 2 are the short version of what emergency vets ask people to come in "
        "for &mdash; they are not complete, and a dog that seems wrong to you is reason enough to "
        "call. Fill in the out-of-hours number <b>today</b>, while nothing is happening: it is "
        "usually a different practice from your own, and the moment you need it is the moment you "
        "cannot look it up.",
    license="Personal use only. Print as many copies as you like for your own dogs. Please do not "
            "resell, share or redistribute the files. Fonts: Rokkitt and Schibsted Grotesk "
            "(SIL Open Font License).",
    mark="Same word. Same hand. Every time.",
)

PAGE_NAMES = ["This dog", "Numbers &amp; emergencies", "The year of care", "Out: the walk",
              "Food &amp; weight", "Same word", "Hands on", "For the sitter",
              "Anything different"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["field"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Rokkitt",Rockwell,Georgia,serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Schibsted Grotesk",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Schibsted Grotesk"'),
                 ("--s1:#f2a65a", "--s1:" + C["ochre"]), ("--s2:#ee6c4d", "--s2:" + C["brick"]),
                 ("--s3:#c43e7a", "--s3:" + C["moss"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-style:italic;", "font-style:normal;")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-dog.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    hp = os.path.join(work, "readme-dog.html")
    open(hp, "w", encoding="utf-8").write(tpl)
    B.to_pdf(hp, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-dog.css")
    doc = pymupdf.open(os.path.join(DIST, "dog-planner-letter-field-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"dog-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["field"]
    over = (
        "<style>"
        "h1{font-family:'Rokkitt',Rockwell,Georgia,serif;font-weight:700;line-height:.96;"
        "letter-spacing:-.008em}"
        f"h1 em{{font-style:normal;color:{C['ochre']}}}"
        "body{font-family:'Schibsted Grotesk',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['moss']};font-family:'Schibsted Grotesk';font-weight:600;"
        "letter-spacing:.18em}"
        f".rule{{background:{C['moss']};height:5px;width:240px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Schibsted Grotesk';"
        "font-weight:600;letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(26,33,29,.17)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Schibsted Grotesk',Arial,sans-serif;font-weight:600;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>Same word.<br>Same hand.<br><em>Every time.</em></h1>
          <span class="rule"></span>
          <p class="sub">A dog care record for the whole house: the numbers on the fridge, the walk
          and what it is for, food weighed rather than guessed, a year of weights, and one page
          where everybody agrees which word means come back.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated, one per dog</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>one dog.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The two pages that go on the wall</span>
      <h1>The numbers.<br><em>The words.</em></h1>
      <p class="sub">The out-of-hours vet is usually a different practice from your own, and the
      moment you need it is the moment you cannot look it up &mdash; so page 2 goes on the fridge.
      And a dog cannot learn a word that changes depending on who is holding the lead, which is
      what page 6 is for.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[1]}" style="height:1170px"><img src="{imgs[5]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#eef1ef", "100px", "84px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#ecefed", "100px", "80px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-dog-{name}.html")
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
        BD.package(DIST, "Long-Lead-Dog-Care-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building dog kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "dog-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "field", embed_fonts=False))
    print("Wrote dog-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Long-Lead-Dog-Care-Kit")


if __name__ == "__main__":
    main()
