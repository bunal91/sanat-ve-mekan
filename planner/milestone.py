#!/usr/bin/env python3
"""Build the Golden Hour milestone birthday kit (50th, 60th, 90th).

Eleven pages for the birthdays people hire rooms for: a long lead time, guests
who span five decades, speeches, a slideshow, a seating plan, and often a
surprise to keep. Same production line as the other kits.

    python3 milestone.py                    # every size / colourway
    python3 milestone.py --only letter-gold
    python3 milestone.py --extras           # start-here sheet, listing images, zips
"""
import argparse, base64, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-milestone")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500"
          "&family=Jost:wght@400;500;600&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="35pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="34pt"),
}

COLORWAYS = {
    # gold marks what is booked and paid, garnet marks the moments of the evening,
    # slate carries the people and the logistics
    "gold": dict(ink="#1b1a22", soft="#6a6472", faint="#9c96a4", rule="#e6e1e4",
                 strong="#c8c1c8", a1="#b08d4b", a2="#8e2f45", a3="#2f4157"),
    "mono": dict(ink="#1f1f24", soft="#67656e", faint="#9a98a1", rule="#e5e4e8",
                 strong="#c5c3ca", a1="#8a8790", a2="#3a3942", a3="#6b6975"),
}

PAGES = 11
ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"]
MARK = "A birthday worth the room."

# --------------------------------------------------------------------------- helpers

def check(f, tone=""):
    return f'<span class="box {tone}" data-field="{f}" data-ftype="check"></span>'

def blank(f, cls="", fs=""):
    fs = f' data-fsize="{fs}"' if fs else ""
    return f'<span class="blank {cls}" data-field="{f}"{fs}></span>'

def sec(label, hint=""):
    hint = f'<span class="hint">{hint}</span>' if hint else ""
    return f'<div class="sec"><span class="eyebrow">{label}</span><span class="line"></span>{hint}</div>'

def field(label, f, cls="", fs=""):
    return f'<div class="fr"><span class="lbl">{label}</span>{blank(f, cls, fs)}</div>'

def sheet(n, title, kicker, body):
    meta = ""
    if n > 1:
        meta = (f'<div class="mini">{field("For", f"m{n}_for", "w1", "8")}'
                f'{field("Date", f"m{n}_date", "w2", "8")}</div>')
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="eyebrow">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{meta}<span class="pageno">{ROMAN[n]}<i>of {ROMAN[PAGES]}</i></span></div>
  </header>
  <div class="rules"><span></span><span class="gold"></span></div>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span><span class="dia">&#9670;</span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    chips = "".join(
        f'<div class="cd">{check(f"m1_cd_{i}", "gold")}<span class="cdlbl">{lab}</span></div>'
        for i, lab in enumerate(["3 months", "6 weeks", "3 weeks", "1 week",
                                 "The eve", "The day"], start=1))
    left = (sec("The basics") +
        field("For", "m1_for") + field("Date", "m1_date") +
        '<div class="split2">' + field("From", "m1_from", "w3") +
        field("Until", "m1_until", "w3") + '</div>' +
        field("Venue", "m1_venue") + field("Address", "m1_address") +
        field("The shape of it", "m1_style") + field("Dress code", "m1_dress") +
        '<div class="split2">' + field("Guests", "m1_guests", "w3") +
        field("Tables", "m1_tables", "w3") + '</div>' +
        field("Budget", "m1_budget") + field("RSVP by", "m1_rsvp") +
        field("Organiser", "m1_organiser") + field("Co-host", "m1_cohost") +
        f'<div class="fr"><span class="lbl">Surprise?</span>{check("m1_surprise_y", "garnet")}'
        f'<span class="lbl2">Yes</span>{check("m1_surprise_n")}'
        f'<span class="lbl2">No</span></div>')
    right = ('<div class="numberbox"><span class="numlbl">Turning</span>'
        f'{blank("m1_age", "bignum", "34")}<span class="numyears">years</span></div>' +
        sec("The tone, in three words", "Then hold every choice to it") +
        "".join(f'<div class="wl">{blank(f"m1_tone_{i}", "grow", "11")}</div>' for i in (1, 2, 3)) +
        sec("The one thing they would hate", "Every milestone has one") +
        f'<div class="wl">{blank("m1_hate", "grow", "10")}</div>' +
        sec("Countdown") + f'<div class="cdgrid">{chips}</div>' +
        sec("Notes") +
        "".join(f'<div class="wl">{blank(f"m1_note_{i}", "grow", "9")}</div>' for i in range(1, 5)))
    return sheet(1, "Fifty. Sixty.<br><em>Ninety.</em>", "Milestone birthday &middot; At a glance",
                 f'<div class="two"><section>{left}</section><section>{right}</section></div>')

COUNTDOWN = [
    ("Three months out", ["Agree the date with the guest of honour &mdash; or with the one keeping the secret",
                          "Set the budget and who is paying for what",
                          "Draft the guest list, decade by decade",
                          "Visit and book the venue", "Book the caterer and the photographer"]),
    ("Six weeks out", ["Send the invitations &mdash; posted, for this one",
                       "Ask about dietary needs on the invitation",
                       "Book the music, the flowers and the cake",
                       "Ask three people to speak, and tell them the length",
                       "Start collecting photographs for the slideshow"]),
    ("Three weeks out", ["Chase every guest who has not replied",
                         "Confirm final numbers with the caterer",
                         "Draft the seating plan", "Order the printing: menus, place cards",
                         "Collect messages from those who cannot come"]),
    ("One week out", ["Confirm every vendor in writing, with times",
                      "Finish the slideshow and watch it through",
                      "Send the running order to whoever is on the microphone",
                      "Confirm the surprise choreography with the driver",
                      "Print the seating plan and the running order"]),
    ("The day before", ["Deliver whatever the venue will hold",
                        "Charge everything: camera, speaker, laptop",
                        "Lay out the gift table and the guest book",
                        "Brief the helpers on the arrival plan",
                        "Sleep &mdash; tomorrow is long"]),
    ("The day", ["Set up and run the slideshow once, in the room",
                 "Sound check the microphone before anyone arrives",
                 "One person on the door with the seating plan",
                 "One person on the camera, all evening",
                 "Speeches, toast, cake &mdash; in that order",
                 "Thank the room before it empties"]),
]

def page_2():
    blocks = []
    for bi, (title, tasks) in enumerate(COUNTDOWN, start=1):
        wide = " wide" if bi == 6 else ""
        rows = "".join(f'<div class="tk">{check(f"m2_b{bi}_t{ti}")}'
                       f'<span class="tktext">{t}</span></div>'
                       for ti, t in enumerate(tasks, start=1))
        rows += "".join(f'<div class="tk">{check(f"m2_b{bi}_x{i}")}'
                        f'{blank(f"m2_b{bi}_line{i}", "grow", "8.5")}</div>' for i in (1, 2))
        blocks.append(f'<section class="cdblock{wide}"><div class="cdhead">'
                      f'<span class="rule-dot"></span><h2>{title}</h2></div>'
                      f'<div class="tks">{rows}</div></section>')
    return sheet(2, "Three months<br><em>to the day.</em>", "Milestone birthday &middot; Countdown",
                 f'<div class="cdcols">{"".join(blocks)}</div>')

def page_3():
    head = ('<div class="gl head"><span>#</span><span>Name</span><span>How they know them</span>'
            '<span>Contact</span><span class="c">Inv</span><span class="c">Yes</span>'
            '<span class="c">No</span><span class="c">+1</span><span>Dietary</span></div>')
    rows = "".join(
        f'<div class="gl"><span class="idx">{i:02d}</span>{blank(f"m3_name_{i}", "", "8.5")}'
        f'{blank(f"m3_how_{i}", "", "8")}{blank(f"m3_contact_{i}", "", "8")}'
        f'<span class="c">{check(f"m3_inv_{i}", "slate")}</span>'
        f'<span class="c">{check(f"m3_yes_{i}", "gold")}</span>'
        f'<span class="c">{check(f"m3_no_{i}")}</span>'
        f'{blank(f"m3_plus_{i}", "c", "8")}{blank(f"m3_diet_{i}", "", "8")}</div>'
        for i in range(1, 25))
    totals = ('<div class="totals">' +
              "".join(f'<div class="tot">{blank(f"m3_t_{k}", "num", "10")}'
                      f'<span class="totlbl">{v}</span></div>'
                      for k, v in [("inv", "Invited"), ("yes", "Coming"), ("no", "Can&#8217;t"),
                                   ("wait", "Waiting"), ("seat", "To seat")]) + '</div>')
    return sheet(3, "Five decades<br><em>in one room.</em>", "Milestone birthday &middot; Guest list",
                 sec("Guests", "Family &middot; school &middot; work &middot; neighbours &middot; the ones who go back furthest") +
                 f'<div class="gltable">{head}{rows}</div>{totals}')

def page_4():
    knows = "".join(f'<div class="kn">{blank(f"m4_knows_{i}", "", "8.5")}'
                    f'{blank(f"m4_knows_role_{i}", "w2", "8")}'
                    f'<span class="c">{check(f"m4_knows_ok_{i}", "gold")}</span></div>'
                    for i in range(1, 9))
    reveal = "".join(f'<div class="wl"><span class="step">{i}</span>'
                     f'{blank(f"m4_reveal_{i}", "grow", "9")}</div>' for i in range(1, 6))
    return sheet(4, "Keeping<br><em>the secret.</em>", "Milestone birthday &middot; The surprise",
        '<div class="two b46"><section>' +
        sec("Is it a surprise?") +
        f'<div class="fr"><span class="lbl">Surprise</span>{check("m4_yes", "garnet")}'
        f'<span class="lbl2">Yes</span>{check("m4_no")}<span class="lbl2">No &mdash; skip this page</span></div>' +
        field("Cover story", "m4_cover") + field("Who tells it", "m4_teller") +
        field("What they think is happening", "m4_decoy") +
        field("Who brings them", "m4_driver") + field("Arrives at", "m4_arrival", "w3") +
        field("Guests arrive by", "m4_guests_by", "w3") +
        field("Where cars go", "m4_parking") +
        '<div class="gap"></div>' +
        sec("Who is in on it", "Everyone briefed gets a tick") +
        '<div class="kn head"><span>Name</span><span class="w2">Their job</span>'
        '<span class="c">Told</span></div>' + knows +
        '</section><section>' +
        sec("The reveal, step by step", "Write it as instructions, not hopes") +
        f'<div class="reveal">{reveal}</div>' +
        sec("Rules for the room") +
        f'<div class="rem">{check("m4_r1", "garnet")}<span>Phones on silent, no posting until after</span></div>' +
        f'<div class="rem">{check("m4_r2", "garnet")}<span>Nobody parks where they will be seen</span></div>' +
        f'<div class="rem">{check("m4_r3", "garnet")}<span>One person greets, everyone else stays quiet</span></div>' +
        f'<div class="rem">{check("m4_r4", "garnet")}<span>Camera running before the door opens</span></div>' +
        sec("If they find out", "There is always a chance") +
        "".join(f'<div class="wl">{blank(f"m4_planb_{i}", "grow", "9")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

VENDORS = ["Venue", "Catering", "Bar", "Cake", "Photographer", "Music", "Flowers",
           "Printing", "Transport", "Hire"]

def page_5():
    vend = "".join(
        f'<div class="vr"><span class="cat">{v}</span>{blank(f"m5_name_{i}", "", "8.5")}'
        f'{blank(f"m5_phone_{i}", "w2", "8")}{blank(f"m5_cost_{i}", "num", "8.5")}'
        f'<span class="c">{check(f"m5_dep_{i}", "gold")}</span>'
        f'<span class="c">{check(f"m5_conf_{i}", "slate")}</span></div>'
        for i, v in enumerate(VENDORS, start=1))
    vend += (f'<div class="vr">{blank("m5_cat_x1", "", "8.5")}{blank("m5_name_x1", "", "8.5")}'
             f'{blank("m5_phone_x1", "w2", "8")}{blank("m5_cost_x1", "num", "8.5")}'
             f'<span class="c">{check("m5_dep_x1", "gold")}</span>'
             f'<span class="c">{check("m5_conf_x1", "slate")}</span></div>')
    money = "".join(
        f'<div class="bl"><span class="cat">{c}</span>{blank(f"m5_plan_{i}", "num", "9")}'
        f'{blank(f"m5_act_{i}", "num", "9")}</div>'
        for i, c in enumerate(["Venue hire", "Food", "Drink", "Cake", "Photography",
                               "Music", "Flowers &amp; styling", "Printing", "Gifts &amp; favours"], start=1))
    money += (f'<div class="bl">{blank("m5_bcat_x1", "", "9")}'
              f'{blank("m5_bplan_x1", "num", "9")}{blank("m5_bact_x1", "num", "9")}</div>')
    deps = "".join(f'<div class="dep">{blank(f"m5_dw_{i}", "", "8.5")}'
                   f'{blank(f"m5_dd_{i}", "w2", "8.5")}{blank(f"m5_da_{i}", "num", "8.5")}</div>'
                   for i in range(1, 5))
    return sheet(5, "Who is booked,<br><em>what it costs.</em>", "Milestone birthday &middot; Vendors &amp; budget",
        sec("Vendors", "Deposit paid &middot; confirmed in the last fortnight") +
        '<div class="vr head"><span class="cat">Service</span><span>Name</span>'
        '<span class="w2">Phone</span><span class="num">Cost</span>'
        '<span class="c">Dep</span><span class="c">Cnf</span></div>' + vend +
        '<div class="gap"></div>'
        '<div class="two b46"><section>' +
        sec("The budget") +
        '<div class="bl head"><span class="cat">Line</span><span class="num">Planned</span>'
        '<span class="num">Actual</span></div>' + money +
        '<div class="bl total"><span class="cat">Total</span>' +
        blank("m5_total_plan", "num", "10") + blank("m5_total_act", "num", "10") + '</div>' +
        '</section><section>' +
        sec("Deposits due", "What &middot; when &middot; how much") +
        f'<div class="deps">{deps}</div>' +
        sec("Currency &amp; ceiling") + field("Currency", "m5_currency", "w3") +
        field("Hard ceiling", "m5_ceiling", "w2") + field("Who pays what", "m5_who") +
        sec("Still to price", "The three that always come late") +
        "".join(f'<div class="wl">{blank(f"m5_todo_{i}", "grow", "8.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_6():
    def rows(prefix, n, extra="w2"):
        return "".join(f'<div class="ml">{blank(f"{prefix}_{i}", "", "8.5")}'
                       f'{blank(f"{prefix}_q_{i}", extra, "8")}</div>' for i in range(1, n + 1))
    diet = "".join(f'<div class="al">{blank(f"m6_d_who_{i}", "w2", "8.5")}'
                   f'{blank(f"m6_d_what_{i}", "", "8.5")}'
                   f'<span class="c">{check(f"m6_d_ok_{i}", "gold")}</span></div>'
                   for i in range(1, 7))
    return sheet(6, "The table<br><em>itself.</em>", "Milestone birthday &middot; Menu, bar &amp; cake",
        '<div class="two b46"><section>' +
        sec("The menu", "Course by course, and who is making it") +
        '<div class="ml head"><span>Course</span><span class="w2">Who / where</span></div>' +
        rows("m6_course", 9) +
        '<div class="gap"></div>' +
        sec("The cake") + field("Baker", "m6_baker") + field("Flavour", "m6_flavour") +
        field("Serves", "m6_serves", "w3") + field("Written on it", "m6_written") +
        field("Delivered at", "m6_delivered", "w3") +
        '</section><section>' +
        sec("The bar", "A bottle of wine per two guests, over dinner") +
        '<div class="ml head"><span>What</span><span class="w2">How much</span></div>' +
        rows("m6_bar", 8) +
        '<div class="gap"></div>' +
        sec("Dietary needs", "Copy from the guest list, tick when the caterer knows") +
        '<div class="al head"><span class="w2">Who</span><span>What they need</span>'
        '<span class="c">Told</span></div>' + diet +
        f'<div class="rem">{check("m6_told", "gold")}'
        '<span>Caterer has the final list in writing</span></div>' +
        '</section></div>')

def page_7():
    order = "".join(
        f'<div class="sp"><span class="idx">{i}</span>{blank(f"m7_who_{i}", "", "9")}'
        f'{blank(f"m7_topic_{i}", "", "8.5")}{blank(f"m7_min_{i}", "w3", "8.5")}'
        f'<span class="c">{check(f"m7_conf_{i}", "gold")}</span></div>' for i in range(1, 7))
    return sheet(7, "Who speaks,<br><em>and for how long.</em>", "Milestone birthday &middot; Speeches",
        '<div class="two b8"><section>' +
        sec("The order", "Three speakers, four minutes each. Nobody has ever wanted more.") +
        '<div class="sp head"><span class="idx">#</span><span>Who</span><span>What they will say</span>'
        '<span class="w3">Mins</span><span class="c">Cnf</span></div>' + order +
        '<div class="gap"></div>' +
        sec("The toast") + field("Led by", "m7_toast_by") + field("The words", "m7_toast_words") +
        field("Charged glasses by", "m7_glasses", "w3") +
        '<div class="gap"></div>' +
        sec("Cards &amp; the present") + field("Presented by", "m7_present_by") +
        field("When in the evening", "m7_present_when") + field("Where it waits", "m7_present_where") +
        '</section><section>' +
        sec("Before anyone speaks") +
        "".join(f'<div class="rem">{check(f"m7_pre_{i}", "slate")}<span>{t}</span></div>'
                for i, t in enumerate([
                    "Microphone tested, in the room, with the doors shut",
                    "Speakers know the order and their cue",
                    "Water on the top table",
                    "Music paused, not just turned down",
                    "Camera on the guest of honour, not the speaker",
                    "Someone ready to close it and move to the cake"], start=1)) +
        sec("Introduced by", "One voice runs the evening") +
        field("Name", "m7_mc") + field("Their cue card", "m7_mc_cue") +
        sec("Notes") +
        "".join(f'<div class="wl">{blank(f"m7_note_{i}", "grow", "9")}</div>' for i in (1, 2, 3, 4)) +
        '</section></div>')

def page_8():
    photos = "".join(
        f'<div class="ph">{blank(f"m8_era_{i}", "w2", "8.5")}{blank(f"m8_from_{i}", "", "8.5")}'
        f'<span class="c">{check(f"m8_asked_{i}", "slate")}</span>'
        f'<span class="c">{check(f"m8_got_{i}", "gold")}</span>'
        f'<span class="c">{check(f"m8_scan_{i}", "garnet")}</span></div>' for i in range(1, 11))
    msgs = "".join(
        f'<div class="ph2">{blank(f"m8_msg_who_{i}", "", "8.5")}'
        f'<span class="c">{check(f"m8_msg_asked_{i}", "slate")}</span>'
        f'<span class="c">{check(f"m8_msg_got_{i}", "gold")}</span>'
        f'{blank(f"m8_msg_read_{i}", "w2", "8")}</div>' for i in range(1, 8))
    return sheet(8, "Photographs<br><em>and voices.</em>", "Milestone birthday &middot; Slideshow",
        '<div class="two b46"><section>' +
        sec("Photographs to gather", "Ask early") +
        '<div class="ph head"><span class="w2">Decade</span><span>Who has them</span>'
        '<span class="c">Ask</span><span class="c">Got</span><span class="c">Scan</span></div>' + photos +
        '<div class="gap"></div>' +
        sec("The slideshow") + field("Runs for", "m8_length", "w3") +
        field("Music", "m8_music") + field("Shown at", "m8_shown", "w3") +
        field("Who runs it", "m8_operator") +
        '</section><section>' +
        sec("Messages from the absent", "Read two aloud") +
        '<div class="ph2 head"><span>Who</span><span class="c">Ask</span><span class="c">Got</span>'
        '<span class="w2">Read by</span></div>' + msgs +
        '<div class="gap"></div>' +
        sec("Tech check", "Do this in the room, not at home") +
        "".join(f'<div class="rem">{check(f"m8_t_{i}", "gold")}<span>{t}</span></div>'
                for i, t in enumerate([
                    "Laptop, charger and the right adaptor",
                    "Projector or screen tested with the actual file",
                    "Sound through the room, not the laptop",
                    "A copy of the file on a memory stick",
                    "Someone who knows how to start it"], start=1)) +
        sec("Notes") +
        "".join(f'<div class="wl">{blank(f"m8_note_{i}", "grow", "9")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_9():
    def table(i):
        seats = "".join(f'<div class="seat">{blank(f"m9_t{i}_s{s}", "grow", "8.5")}</div>'
                        for s in range(1, 9))
        return (f'<section class="tbl"><div class="tblhead"><span class="tno">{i}</span>'
                f'{blank(f"m9_t{i}_name", "grow", "8.5")}</div>{seats}</section>')
    return sheet(9, "Where everyone<br><em>sits.</em>", "Milestone birthday &middot; Seating",
        sec("Tables", "Name the table, then fill the seats") +
        f'<div class="tables">{"".join(table(i) for i in range(1, 9))}</div>' +
        '<div class="gap"></div>'
        '<div class="two b46"><section>' +
        sec("Keep apart", "Every family has a pair") +
        "".join(f'<div class="wl">{blank(f"m9_apart_{i}", "grow", "8.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("Seat together", "The ones who will carry a table") +
        "".join(f'<div class="wl">{blank(f"m9_together_{i}", "grow", "8.5")}</div>' for i in (1, 2, 3)) +
        sec("Place cards", "Printed, checked against the final list") +
        f'<div class="rem">{check("m9_cards", "gold")}<span>Names spelled the way they spell them</span></div>' +
        '</section></div>')

BEATS = ["Doors, drinks, photographs", "Everyone seated", "Dinner served",
         "Speeches", "Cake and the toast", "Music", "Farewells"]

def page_10():
    rows = "".join(
        f'<div class="rs">{blank(f"m10_time_{i}", "w3", "8.5")}{blank(f"m10_what_{i}", "", "9")}'
        f'{blank(f"m10_who_{i}", "w2", "8.5")}</div>' for i in range(1, 17))
    beats = "".join(f'<div class="beat"><span class="bt">{t}</span>'
                    f'{blank(f"m10_beat_{i}", "w3", "8.5")}</div>'
                    for i, t in enumerate(BEATS, start=1))
    forget = ["Seating plan printed, twice", "Running order to the microphone",
              "Cake knife, and someone to cut it", "Guest book and a pen that works",
              "Gift table with somewhere to put cards", "Taxi numbers by the door",
              "Someone sober driving the guest of honour home"]
    rem = "".join(f'<div class="rem">{check(f"m10_r_{i}", "garnet")}<span>{t}</span></div>'
                  for i, t in enumerate(forget, start=1))
    return sheet(10, "How the evening<br><em>runs.</em>", "Milestone birthday &middot; Run of show",
        '<div class="two b8"><section>' +
        sec("Hour by hour", "Start at set-up, end when the room is empty") +
        '<div class="rs head"><span class="w3">Time</span><span>What happens</span>'
        '<span class="w2">Who is on it</span></div>' + rows +
        '</section><section>' +
        sec("The seven beats", "Write the time next to each") + f'<div class="beats">{beats}</div>' +
        sec("Do not forget") + f'<div class="rems">{rem}</div>' +
        sec("Set-up &amp; clear-down") + field("Access from", "m10_access", "w3") +
        field("Out by", "m10_out", "w3") + field("Clear-down crew", "m10_crew") +
        '</section></div>')

def page_11():
    gifts = "".join(
        f'<div class="gf"><span class="idx">{i:02d}</span>{blank(f"m11_gift_{i}", "", "8.5")}'
        f'{blank(f"m11_from_{i}", "w2", "8.5")}'
        f'<span class="c">{check(f"m11_sent_{i}", "gold")}</span></div>' for i in range(1, 17))
    keep = ["Guest book, signed", "The menu card and the running order",
            "Photographs shared with everyone who came", "The slideshow file, backed up",
            "Messages from those who could not come", "A note of what you would do again"]
    return sheet(11, "Thank yous<br><em>and keepsakes.</em>", "Milestone birthday &middot; After",
        '<div class="two b8"><section>' +
        sec("Gifts", "Tick when the thank-you is written and posted") +
        '<div class="gf head"><span class="idx">#</span><span>What it was</span>'
        '<span class="w2">Who from</span><span class="c">Sent</span></div>' + gifts +
        '</section><section>' +
        sec("Keep") +
        "".join(f'<div class="rem">{check(f"m11_k_{i}", "gold")}<span>{t}</span></div>'
                for i, t in enumerate(keep, start=1)) +
        sec("What worked") +
        "".join(f'<div class="wl">{blank(f"m11_worked_{i}", "grow", "9")}</div>' for i in (1, 2, 3)) +
        sec("What you would change") +
        "".join(f'<div class="wl">{blank(f"m11_change_{i}", "grow", "9")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6,
            page_7, page_8, page_9, page_10, page_11]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --gold:{C["a1"]}; --garnet:{C["a2"]}; --slate:{C["a3"]};
  --backdrop:#efecee;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#16151a; }} }}
:root[data-theme="dark"]{{ --backdrop:#16151a; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Jost","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(27,26,34,.15);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.eyebrow{{ font-weight:600; text-transform:uppercase; letter-spacing:.19em; font-size:6.9pt;
  color:var(--soft); white-space:nowrap; }}
.hint{{ font-weight:400; text-transform:uppercase; letter-spacing:.1em; font-size:6.5pt;
  color:var(--faint); white-space:nowrap; min-width:0; overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in; }}
.mast h1{{ font-family:"Cormorant Garamond",Georgia,serif; font-weight:600; font-size:{S["display"]};
  line-height:.94; margin:7px 0 0; letter-spacing:-.005em; }}
.mast h1 em{{ font-style:italic; font-weight:500; color:var(--garnet); }}
.mastright{{ display:flex; align-items:flex-end; gap:14px; }}
.pageno{{ font-family:"Cormorant Garamond",Georgia,serif; font-size:15pt; line-height:1;
  color:var(--ink); letter-spacing:.04em; }}
.pageno i{{ font-style:italic; font-size:8pt; color:var(--faint); letter-spacing:0; }}
.mini{{ display:flex; flex-direction:column; gap:4px; padding-bottom:2px; }}
.rules{{ display:flex; flex-direction:column; gap:2px; padding-top:8px; flex:none; }}
.rules span{{ height:1px; background:var(--ink); }}
.rules span.gold{{ height:2px; background:var(--gold); }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:12px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .28in; }}
.page > .vr, .page > .gl{{ flex:0 1 auto; }}
.two.b46{{ grid-template-columns:1.12fr 1fr; }}
.two.b8{{ grid-template-columns:1.28fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; }}
.gap{{ height:13px; flex:none; }}

.sec{{ display:flex; align-items:center; gap:8px; padding:1px 0 6px; overflow:hidden; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}

.page .fr{{ display:flex; align-items:flex-end; gap:8px; flex:1 1 auto;
  min-height:.27in; max-height:.54in; }}
.mini .fr{{ display:flex; align-items:flex-end; gap:7px; flex:none; height:.2in; }}
.fr .lbl, .fr .lbl2{{ font-weight:500; text-transform:uppercase; letter-spacing:.08em;
  font-size:6.7pt; color:var(--soft); padding-bottom:3px; white-space:nowrap; }}
.fr .lbl{{ width:.85in; flex:none; }}
.fr .lbl2{{ padding-left:6px; padding-right:4px; }}
.blank{{ flex:1; border-bottom:1px solid var(--rule); height:100%; min-width:0; }}
.blank.w1{{ flex:none; width:1.1in; }} .blank.w2{{ flex:none; width:.78in; }}
.blank.w3{{ flex:none; width:.48in; }} .blank.num{{ flex:none; width:.6in; }}
.blank.c{{ flex:none; width:.2in; }}
.split2{{ display:flex; gap:12px; }} .split2 .fr{{ flex:1; }} .split2 .fr .lbl{{ width:auto; }}

.box{{ width:9px; height:9px; border:1px solid var(--strong); flex:none; margin-bottom:3px; }}
.box.gold{{ border-color:var(--gold); }} .box.garnet{{ border-color:var(--garnet); }}
.box.slate{{ border-color:var(--slate); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:8px; flex:1 1 auto; min-height:.26in; max-height:.54in; }}
.wl .step{{ font-family:"Cormorant Garamond",Georgia,serif; font-size:12pt; color:var(--gold);
  width:11px; flex:none; line-height:1; padding-bottom:2px; }}

.numberbox{{ display:flex; align-items:flex-end; gap:10px; border:1px solid var(--gold);
  border-radius:2px; padding:9px 12px 10px; margin-bottom:12px; flex:none; }}
.numlbl{{ font-weight:500; text-transform:uppercase; letter-spacing:.14em; font-size:6.8pt;
  color:var(--soft); padding-bottom:5px; }}
.blank.bignum{{ flex:1; border-bottom:1px solid var(--rule); height:.46in; }}
.numyears{{ font-family:"Cormorant Garamond",Georgia,serif; font-style:italic; font-size:13pt;
  color:var(--gold); padding-bottom:2px; }}

.cdgrid{{ display:grid; grid-template-columns:1fr 1fr; gap:5px 14px; padding:2px 0 8px; flex:none; }}
.cd{{ display:flex; align-items:flex-end; gap:7px; }}
.cdlbl{{ font-weight:500; text-transform:uppercase; letter-spacing:.09em; font-size:6.8pt;
  color:var(--soft); padding-bottom:1px; }}

.cdcols{{ flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr;
  grid-template-rows:1fr 1fr 1.08fr; gap:13px .28in; }}
.cdblock{{ display:flex; flex-direction:column; }}
.cdblock.wide{{ grid-column:1 / -1; }}
.cdblock.wide .tks{{ display:grid; grid-template-columns:1fr 1fr; gap:0 .28in; }}
.tks{{ flex:1; display:flex; flex-direction:column; min-height:0; }}
.cdhead{{ display:flex; align-items:center; gap:8px; border-bottom:1px solid var(--ink);
  padding-bottom:5px; margin-bottom:6px; }}
.cdhead h2{{ font-family:"Cormorant Garamond",Georgia,serif; font-weight:600; font-size:12.5pt;
  margin:0; line-height:1; }}
.rule-dot{{ width:6px; height:6px; background:var(--gold); transform:rotate(45deg); flex:none; }}
.tk{{ display:flex; align-items:flex-end; gap:8px; flex:1 1 auto; min-height:.26in; max-height:.4in;
  border-bottom:1px solid var(--rule); }}
.tktext{{ font-size:8.3pt; padding-bottom:3px; line-height:1.15; }}

.gltable{{ flex:1; display:flex; flex-direction:column; }}
.gl{{ display:grid; grid-template-columns:.22in 1.35fr 1.05fr 1.05fr .22in .22in .22in .22in 1fr;
  gap:0 6px; align-items:flex-end; flex:1; min-height:.22in; }}
.gl .idx{{ font-size:6.8pt; color:var(--faint); padding-bottom:3px; }}
.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:5px; border-bottom:1px solid var(--ink); margin-bottom:5px;
  font-weight:600; text-transform:uppercase; letter-spacing:.09em; font-size:6.2pt;
  color:var(--soft); }}
.head span, .head .blank{{ border:0; }}
.totals{{ display:flex; gap:16px; border-top:1px solid var(--ink); margin-top:8px; padding-top:8px; }}
.tot{{ display:flex; align-items:flex-end; gap:7px; }}
.totlbl{{ font-weight:600; text-transform:uppercase; letter-spacing:.09em; font-size:6.8pt;
  color:var(--soft); padding-bottom:3px; }}

.kn{{ display:grid; grid-template-columns:1fr .78in .22in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.26in; max-height:.42in; }}
.reveal{{ display:flex; flex-direction:column; flex:0 1 auto; padding-bottom:6px; }}
.vr{{ display:grid; grid-template-columns:.72fr 1.3fr .78in .6in .22in .22in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.25in; max-height:.4in; }}
.vr .cat{{ font-size:8.4pt; padding-bottom:3px; }}
.bl{{ display:grid; grid-template-columns:1.3fr .6in .6in; gap:0 9px; align-items:flex-end;
  flex:1 1 auto; min-height:.25in; max-height:.42in; }}
.bl .cat{{ font-size:8.4pt; padding-bottom:3px; }}
.bl.total{{ flex:none; border-top:1px solid var(--ink); margin-top:5px; padding-top:6px; }}
.bl.total .cat{{ font-weight:600; text-transform:uppercase; letter-spacing:.09em; font-size:7.2pt; }}
.deps{{ display:flex; flex-direction:column; flex:0 1 auto; }}
.dep{{ display:grid; grid-template-columns:1fr .78in .6in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.26in; max-height:.4in; }}
.ml{{ display:grid; grid-template-columns:1fr .78in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.25in; max-height:.44in; }}
.al{{ display:grid; grid-template-columns:.78in 1fr .22in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.25in; max-height:.4in; }}
.sp{{ display:grid; grid-template-columns:.18in 1.1fr 1.5fr .48in .22in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.46in; }}
.sp .idx{{ font-family:"Cormorant Garamond",Georgia,serif; font-size:11pt; color:var(--gold);
  padding-bottom:2px; }}
.ph{{ display:grid; grid-template-columns:.78in 1fr .22in .22in .22in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.25in; max-height:.4in; }}
.ph2{{ display:grid; grid-template-columns:1fr .22in .22in .78in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.25in; max-height:.4in; }}
.rs{{ display:grid; grid-template-columns:.48in 1fr .78in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.25in; max-height:.42in; }}
.gf{{ display:grid; grid-template-columns:.22in 1.4fr .78in .22in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.25in; max-height:.42in; }}
.gf .idx{{ font-size:6.8pt; color:var(--faint); padding-bottom:3px; }}

.tables{{ flex:1; min-height:0; display:grid; grid-template-columns:repeat(4,1fr);
  grid-template-rows:1fr 1fr; gap:12px .24in; }}
.tbl{{ display:flex; flex-direction:column; border:1px solid var(--rule); border-radius:2px;
  padding:7px 9px 8px; min-height:0; }}
.tblhead{{ display:flex; align-items:flex-end; gap:7px; border-bottom:1px solid var(--gold);
  padding-bottom:4px; margin-bottom:4px; flex:none; }}
.tno{{ font-family:"Cormorant Garamond",Georgia,serif; font-size:13pt; color:var(--gold);
  line-height:1; }}
.seat{{ display:flex; align-items:flex-end; flex:1 1 auto; min-height:.2in; max-height:.32in; }}

.beats{{ display:flex; flex-direction:column; flex:1 1 auto; padding-bottom:6px; }}
.beat{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.26in; max-height:.42in; }}
.beat .bt{{ font-weight:500; text-transform:uppercase; letter-spacing:.08em; font-size:6.7pt;
  color:var(--soft); padding-bottom:3px; width:1.15in; flex:none; }}
.rems{{ display:flex; flex-direction:column; flex:1 1 auto; }}
.rem{{ display:flex; align-items:flex-end; gap:8px; flex:1 1 auto; min-height:.25in; max-height:.38in; }}
.rem span{{ font-size:7.7pt; color:var(--soft); padding-bottom:2px; line-height:1.15; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1px solid var(--ink); margin-top:10px; padding-top:7px; }}
.foot .mark{{ font-family:"Cormorant Garamond",Georgia,serif; font-style:italic; font-size:9pt;
  color:var(--faint); }}
.foot .dia{{ color:var(--gold); font-size:7pt; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-milestone.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Golden Hour Milestone Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-milestone-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"milestone-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"milestone-{name}")
        fill_pdf = os.path.join(DIST, f"milestone-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         COLORWAYS[colorway], pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Golden Hour &nbsp;&middot;&nbsp; Milestone Birthday Kit",
    title="Start<br><em>here.</em>",
    lede="Thank you. Eleven pages for a birthday that fills a room &mdash; the guest list, the "
         "speeches, the slideshow, the seating, and the surprise if there is one.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; gold + ink-saving mono &middot; 11 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Surprise &amp; speeches pages", "the two that generic party planners leave out"),
           ("This guide", "typing, printing and the licence in one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "like GoodNotes or Xodo. Click a line and type. <b>Save a copy first</b> and keep it as the "
        "working file &mdash; on a three-month plan you will come back to it thirty times.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same eleven pages without fields. Even if you work on "
        "screen, print three for the night itself: the seating plan, the running order and the "
        "guest list. Paper does not run out of battery halfway through the speeches.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "Margins: none / borderless, portrait",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="If anything looks off",
    s5p="Message me through Etsy and I will sort it the same day. And if the evening went the way "
        "you hoped, a review helps this small shop more than you would think.",
    license="Personal use only. Print as many copies as you like for your own celebration. Please do "
            "not resell, share or redistribute the files. Fonts: Cormorant Garamond and Jost "
            "(SIL Open Font License).",
    mark="A birthday worth the room.")

PAGE_NAMES = ["At a glance", "The countdown", "Guest list", "The surprise",
              "Vendors &amp; budget", "Menu, bar &amp; cake", "Speeches", "Slideshow",
              "Seating", "Run of show", "Thank yous"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["gold"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Cormorant Garamond",Georgia,serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Jost",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Jost"'),
                 ("--s1:#f2a65a", "--s1:" + C["a1"]), ("--s2:#ee6c4d", "--s2:" + C["a2"]),
                 ("--s3:#c43e7a", "--s3:" + C["a3"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"])]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-milestone.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    path = os.path.join(work, "readme-milestone.html")
    open(path, "w", encoding="utf-8").write(tpl)
    B.to_pdf(path, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-milestone.css")
    doc = pymupdf.open(os.path.join(DIST, "milestone-planner-letter-gold-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"milestone-page-{i+1}.png")
        page.get_pixmap(dpi=104).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["gold"]
    over = (
        "<style>"
        "h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600}"
        f"h1 em{{font-style:italic;color:{C['a2']}}}"
        "body{font-family:'Jost',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['soft']};font-family:'Jost';font-weight:500;letter-spacing:.28em}}"
        f".rule{{background:{C['a1']};height:3px}}"
        f".badge{{border-color:{C['a1']};color:{C['ink']};font-family:'Jost';font-weight:500;"
        "letter-spacing:.14em}"
        ".tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:16px 30px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        f".tile{{background:#fff;box-shadow:0 12px 30px rgba(27,26,34,.15)}}"
        ".tile img{height:352px;width:auto;display:block}"
        f".tilecap{{font-family:'Jost',Arial,sans-serif;font-weight:500;text-transform:uppercase;"
        f"letter-spacing:.13em;font-size:18px;color:{C['soft']};padding:10px 2px 0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Eleven pages &middot; Fillable PDF</span>
          <h1>Fifty. Sixty.<br><em>Ninety.</em></h1>
          <span class="rule"></span>
          <p class="sub">A planning kit for the birthdays people hire a room for: three-month
          countdown, guest list across five decades, speeches, slideshow, seating plan, and a
          surprise page for keeping the secret.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">11 pages</span>
          <span class="badge">Type or print</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Eleven pages,<br><em>one evening.</em></h1>
      <div class="tiles" style="margin-top:26px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The pages other planners leave out</span>
      <h1>The surprise.<br><em>The speeches.</em></h1>
      <p class="sub">Who is in on it, what the cover story is, and the reveal written as
      instructions. Then who speaks, in what order, for how many minutes.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[3]}" style="height:1040px"><img src="{imgs[6]}" style="height:1040px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#f6f3ef", "100px", "84px", hero),
                                       ("02-pages", "#ffffff", "76px", "56px", pages),
                                       ("03-detail", "#f3f1f4", "100px", "76px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-milestone-{name}.html")
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
        BD.package(DIST, "Golden-Hour-Milestone-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building milestone kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "milestone-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "gold", embed_fonts=False))
    print("Wrote milestone-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Golden-Hour-Milestone-Kit")

if __name__ == "__main__":
    main()
