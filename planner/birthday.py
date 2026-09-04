#!/usr/bin/env python3
"""Build the Party Line birthday planning kit.

Nine pages that follow a party from "we should do something" to the thank-you
notes, generated the same way as the daily planner: HTML -> Chromium -> PDF,
field rectangles measured off the real layout and turned into AcroForm widgets.

    python3 birthday.py                 # every size / colourway
    python3 birthday.py --only letter-party
    python3 birthday.py --no-fillable

Requires: Chromium (headless), plus pypdf + reportlab for the fillable PDFs.
"""
import argparse, base64, html, json, os, re, shutil

import build as B   # chrome plumbing, page sizes, font caching

ROOT, DIST, WORK = B.ROOT, os.path.join(B.ROOT, "dist-birthday"), B.WORK

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500"
          "&family=Archivo:wght@500;600;700"
          "&family=IBM+Plex+Sans:wght@400;500;600&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="34pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="33pt"),
}

COLORWAYS = {
    # blue carries structure, citrus carries the celebration, coral marks what is
    # running out of time, mint marks what is settled
    "party": dict(ink="#171a2b", soft="#5f6478", faint="#9096a8", rule="#e4e6ee",
                  strong="#c6cad8", a1="#2f6bff", a2="#f5b301", a3="#ff5c48", a4="#2fa37a"),
    "mono":  dict(ink="#1c1c22", soft="#63636e", faint="#96969f", rule="#e5e5e9",
                  strong="#c5c5cc", a1="#4a4a55", a2="#8d8d97", a3="#2b2b33", a4="#6f6f7a"),
}

PAGES = 9
MARK = "Nine pages, one party."

# --------------------------------------------------------------------------- markup helpers

def eyebrow(t):    return f'<span class="eyebrow">{t}</span>'
def check(f):      return f'<span class="box" data-field="{f}" data-ftype="check"></span>'
def blank(f, cls="", fs=""):
    fs = f' data-fsize="{fs}"' if fs else ""
    return f'<span class="blank {cls}" data-field="{f}"{fs}></span>'

def sec(label, hint=""):
    hint = f'<span class="hint">{hint}</span>' if hint else ""
    return f'<div class="sec">{eyebrow(label)}<span class="line"></span>{hint}</div>'

def field(label, f, cls="", fs=""):
    return f'<div class="fr"><span class="lbl">{label}</span>{blank(f, cls, fs)}</div>'

def sheet(n, title, meta_page, body, size):
    """Every page carries its own masthead, so a single printed page still works."""
    meta = ""
    if n > 1:
        meta = (f'<div class="mini">{field("For", f"p{n}_for", "w1", "8")}'
                f'{field("Date", f"p{n}_date", "w2", "8")}</div>')
    return f'''
<div class="sheet">
  <header class="mast">
    <div>{eyebrow(f"Birthday kit &nbsp;&middot;&nbsp; {meta_page}")}<h1>{title}</h1></div>
    <div class="mastright">{meta}<span class="pageno">{n:02d}<i>/{PAGES:02d}</i></span></div>
  </header>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span><span class="ramp"></span></footer>
</div>'''

# --------------------------------------------------------------------------- the nine pages

def page_1(S):
    countdown = "".join(
        f'<div class="cd"><span class="cdmark">{check(f"p1_cd_{i+1}")}</span>'
        f'<span class="cdlbl">{lab}</span></div>'
        for i, lab in enumerate(["6 weeks", "4 weeks", "2 weeks", "1 week",
                                 "Day before", "Party day"]))
    left = (sec("The basics") +
        field("For", "p1_for") + field("Turning", "p1_age", "w3") +
        field("Date", "p1_date") + field("Time", "p1_time") +
        field("Venue", "p1_venue") + field("Address", "p1_address") +
        field("Theme &amp; colours", "p1_theme") + field("Dress code", "p1_dress") +
        field("RSVP by", "p1_rsvpby") +
        '<div class="split2">' + field("Adults", "p1_adults", "w3") +
        field("Kids", "p1_kids", "w3") + '</div>' +
        field("Budget", "p1_budget") + field("Music", "p1_music") +
        field("Cake from", "p1_cakefrom") + field("The present", "p1_present") +
        field("Who is helping", "p1_helper") + field("If it rains", "p1_rain"))
    right = (sec("What makes this party", "Three things, ranked") +
        ''.join(f'<div class="big"><span class="n n{i}">{i}</span>{blank(f"p1_big_{i}", "grow")}</div>'
                for i in (1, 2, 3)) +
        sec("Countdown") + f'<div class="cdgrid">{countdown}</div>' +
        sec("Ideas &amp; colours", "Stick a swatch here, or write the mood") +
        f'<div class="board">{blank("p1_board")}</div>')
    return sheet(1, "Birthday,<br><em>planned.</em>", "At a glance",
                 f'<div class="two"><section>{left}</section><section>{right}</section></div>', S)

COUNTDOWN = [
    ("6 &ndash; 4 weeks out", "far", ["Set the date and the budget", "Draft the guest list",
                                      "Book the venue or clear the room", "Choose a theme and colours",
                                      "Order or make the invitations"]),
    ("3 &ndash; 2 weeks out", "mid", ["Send the invitations", "Order the cake",
                                      "Plan the menu and the drinks", "Book entertainment or a photographer",
                                      "Order decorations and party favours"]),
    ("1 week out", "near", ["Chase the guests who have not replied", "Confirm every vendor in writing",
                            "Buy drinks and everything that keeps", "Build the playlist",
                            "Prep the games and the prizes"]),
    ("The day before", "close", ["Shop for fresh food", "Chill the drinks and make ice",
                                 "Charge the camera and the speaker", "Pack the party box",
                                 "Set up whatever can be set up"]),
    ("Party day", "now", ["Decorate and set the table", "Take the cake out of the fridge in time",
                          "Put someone on the door and the camera", "Cake, candles, song",
                          "Say thank you before anyone leaves"]),
]

def page_2(S):
    blocks = []
    for bi, (title, cls, tasks) in enumerate(COUNTDOWN, start=1):
        wide = " wide" if cls == "now" else ""
        rows = "".join(f'<div class="tk">{check(f"p2_b{bi}_t{ti}")}'
                       f'<span class="tktext">{t}</span></div>'
                       for ti, t in enumerate(tasks, start=1))
        rows += "".join(f'<div class="tk">{check(f"p2_b{bi}_x{i}")}'
                        f'{blank(f"p2_b{bi}_line{i}", "grow", "8.5")}</div>'
                        for i in ((1, 2, 3) if wide else (1, 2)))
        blocks.append(f'<section class="cdblock {cls}{wide}"><div class="cdhead">'
                      f'<span class="pip"></span><h2>{title}</h2></div>'
                      f'<div class="tks">{rows}</div></section>')
    return sheet(2, "The<br><em>countdown.</em>", "Six weeks to zero",
                 f'<div class="cdcols">{"".join(blocks)}</div>', S)

def page_3(S):
    head = ('<div class="gl grow head"><span>#</span><span>Name</span><span>Contact</span>'
            '<span class="c">Inv.</span><span class="c">Yes</span><span class="c">No</span>'
            '<span class="c">+</span><span>Notes &amp; dietary needs</span></div>')
    rows = "".join(
        f'<div class="gl"><span class="idx">{i:02d}</span>{blank(f"p3_name_{i}", "", "8.5")}'
        f'{blank(f"p3_contact_{i}", "", "8")}<span class="c">{check(f"p3_inv_{i}")}</span>'
        f'<span class="c">{check(f"p3_yes_{i}")}</span><span class="c">{check(f"p3_no_{i}")}</span>'
        f'{blank(f"p3_plus_{i}", "c", "8")}{blank(f"p3_notes_{i}", "", "8")}</div>'
        for i in range(1, 23))
    totals = ('<div class="totals">' +
              "".join(f'<div class="tot">{blank(f"p3_t_{k}", "num", "10")}'
                      f'<span class="totlbl">{v}</span></div>'
                      for k, v in [("inv", "Invited"), ("yes", "Coming"), ("no", "Can&#8217;t"),
                                   ("wait", "Waiting"), ("heads", "Total heads")]) +
              '</div>')
    return sheet(3, "Guest list<br><em>&amp; RSVP.</em>", "Who is coming",
                 sec("Guests", "Tick the box when the invitation goes out") +
                 f'<div class="gltable">{head}{rows}</div>{totals}', S)

BUDGET_ROWS = ["Venue", "Food", "Drinks", "Cake", "Decorations", "Invitations",
               "Entertainment", "Photography", "Rentals", "Party favours",
               "The present", "Transport"]

def page_4(S):
    rows = "".join(
        f'<div class="bl"><span class="cat">{c}</span>{blank(f"p4_plan_{i}", "num", "9")}'
        f'{blank(f"p4_actual_{i}", "num", "9")}<span class="c">{check(f"p4_paid_{i}")}</span></div>'
        for i, c in enumerate(BUDGET_ROWS, start=1))
    rows += "".join(
        f'<div class="bl">{blank(f"p4_cat_{i}", "", "9")}{blank(f"p4_plan_x{i}", "num", "9")}'
        f'{blank(f"p4_actual_x{i}", "num", "9")}<span class="c">{check(f"p4_paidx_{i}")}</span></div>'
        for i in (1, 2, 3))
    deposits = "".join(
        f'<div class="dep">{blank(f"p4_dep_what_{i}", "", "8.5")}{blank(f"p4_dep_due_{i}", "w2", "8.5")}'
        f'{blank(f"p4_dep_amt_{i}", "num", "8.5")}</div>' for i in range(1, 7))
    return sheet(4, "What it<br><em>costs.</em>", "Budget",
        '<div class="two b46">'
        '<section>' + sec("Line by line", "Planned &middot; actual &middot; paid") +
        '<div class="bl head"><span class="cat">Category</span><span class="num">Planned</span>'
        '<span class="num">Actual</span><span class="c">Paid</span></div>' + rows +
        '<div class="bl total"><span class="cat">Total</span>' +
        blank("p4_total_plan", "num", "10") + blank("p4_total_actual", "num", "10") +
        '<span class="c"></span></div>'
        '</section>'
        '<section>' + sec("Currency &amp; ceiling") +
        field("Currency", "p4_currency", "w3") + field("Ceiling", "p4_ceiling") +
        field("Left to spend", "p4_left") +
        sec("Deposits due", "What &middot; when &middot; how much") +
        f'<div class="deps">{deposits}</div>' +
        sec("Who pays what", "Split it before the day, not after") +
        "".join(f'<div class="ml">{blank(f"p4_who_{i}", "", "8.5")}'
                f'{blank(f"p4_share_{i}", "w2", "8.5")}</div>' for i in range(1, 6)) +
        sec("Cash on the day", "Tips, taxis, the balloon man") +
        field("Take", "p4_cash", "w2") + field("For", "p4_cash_for") +
        sec("Notes") +
        "".join(f'<div class="wl">{blank(f"p4_lesson_{i}", "grow", "8.5")}</div>' for i in (1, 2, 3, 4)) +
        '</section></div>', S)

VENDOR_ROWS = ["Venue", "Cake", "Catering", "Drinks", "Photographer",
               "Music / DJ", "Entertainer", "Rentals"]

def page_5(S):
    vend = "".join(
        f'<div class="vr"><span class="cat">{v}</span>{blank(f"p5_v_name_{i}", "", "8.5")}'
        f'{blank(f"p5_v_phone_{i}", "w2", "8.5")}{blank(f"p5_v_cost_{i}", "num", "8.5")}'
        f'<span class="c">{check(f"p5_v_booked_{i}")}</span>'
        f'<span class="c">{check(f"p5_v_conf_{i}")}</span></div>'
        for i, v in enumerate(VENDOR_ROWS, start=1))
    vend += "".join(
        f'<div class="vr">{blank(f"p5_v_cat_{i}", "", "8.5")}{blank(f"p5_v_name_x{i}", "", "8.5")}'
        f'{blank(f"p5_v_phone_x{i}", "w2", "8.5")}{blank(f"p5_v_cost_x{i}", "num", "8.5")}'
        f'<span class="c">{check(f"p5_v_bookedx_{i}")}</span>'
        f'<span class="c">{check(f"p5_v_confx_{i}")}</span></div>' for i in (1, 2))
    helpers = "".join(
        f'<div class="hr">{blank(f"p5_h_who_{i}", "", "8.5")}{blank(f"p5_h_what_{i}", "", "8.5")}'
        f'{blank(f"p5_h_when_{i}", "w2", "8.5")}<span class="c">{check(f"p5_h_ok_{i}")}</span></div>'
        for i in range(1, 9))
    return sheet(5, "Who is<br><em>on it.</em>", "Vendors &amp; helpers",
        sec("Vendors", "Booked = deposit paid &middot; Confirmed = re-checked in the last week") +
        '<div class="vr head"><span class="cat">Service</span><span>Name</span><span class="w2">Phone</span>'
        '<span class="num">Cost</span><span class="c">Bk</span><span class="c">Cf</span></div>' + vend +
        '<div class="gap"></div>' +
        sec("Helpers", "One name against every job, or it lands on you") +
        '<div class="hr head"><span>Who</span><span>What they are on</span><span class="w2">When</span>'
        '<span class="c">OK</span></div>' + helpers, S)

def page_6(S):
    def listcol(title, prefix, n, hint=""):
        rows = "".join(f'<div class="ml">{blank(f"{prefix}_item_{i}", "", "8.5")}'
                       f'{blank(f"{prefix}_who_{i}", "w2", "8")}</div>' for i in range(1, n + 1))
        return (f'<section>{sec(title, hint)}'
                f'<div class="ml head"><span>Dish</span><span class="w2">Who brings it</span></div>'
                f'{rows}</section>')
    cake = (sec("The cake", "Order it three weeks out") +
            field("Flavour", "p6_cake_flavour") + field("Size / servings", "p6_cake_size") +
            field("Writing on top", "p6_cake_msg") + field("Bakery", "p6_cake_bakery") +
            field("Collect at", "p6_cake_time") +
            f'<div class="fr"><span class="lbl">Candles</span>{check("p6_candles")}'
            f'<span class="lbl2">Lighter</span>{check("p6_lighter")}'
            f'<span class="lbl2">Knife &amp; plates</span>{check("p6_knife")}</div>')
    drinks = (sec("Drinks", "Plan 2&ndash;3 per guest for the first two hours") +
              "".join(f'<div class="ml">{blank(f"p6_drink_{i}", "", "8.5")}'
                      f'{blank(f"p6_drink_qty_{i}", "w2", "8")}</div>' for i in range(1, 8)))
    allergies = (sec("Allergies &amp; dietary needs", "Copy them off the guest list") +
                 "".join(f'<div class="wl">{blank(f"p6_diet_{i}", "grow", "8.5")}</div>'
                         for i in range(1, 5)))
    return sheet(6, "Cake, food<br><em>and drink.</em>", "The menu",
        '<div class="two b46"><section>' +
        listcol("Savoury", "p6_sav", 8, "What is actually being eaten") +
        '<div class="gap"></div>' + listcol("Sweet &amp; sides", "p6_swt", 6) +
        '<div class="gap"></div>' +
        sec("Oven &amp; timing", "What goes in when, counting back from the doors") +
        '<div class="ml head"><span>Dish</span><span class="w2">In at</span></div>' +
        "".join(f'<div class="ml">{blank(f"p6_time_item_{i}", "", "8.5")}'
                f'{blank(f"p6_time_when_{i}", "w2", "8")}</div>' for i in range(1, 6)) +
        '</section><section>' + cake + '<div class="gap"></div>' + drinks +
        '<div class="gap"></div>' + allergies + '</section></div>', S)

SHOP = [("Food &amp; drink", "p7_a", ["Ice", "Soft drinks", "Napkins", "Snacks for early arrivals"]),
        ("Table &amp; serving", "p7_b", ["Plates", "Cups", "Cutlery", "Serving dishes", "Bin bags"]),
        ("Decorations &amp; extras", "p7_c", ["Balloons", "Banner", "Candles", "Batteries", "Gift table"])]

def page_7(S):
    cols = []
    for title, prefix, seeded in SHOP:
        rows = "".join(f'<div class="sh">{check(f"{prefix}_s{i}")}'
                       f'<span class="shtext">{t}</span>{blank(f"{prefix}_sw{i}", "w2", "8")}</div>'
                       for i, t in enumerate(seeded, start=1))
        rows += "".join(f'<div class="sh">{check(f"{prefix}_b{i}")}'
                        f'{blank(f"{prefix}_item_{i}", "", "8.5")}{blank(f"{prefix}_where_{i}", "w2", "8")}</div>'
                        for i in range(1, 13))
        cols.append(f'<section>{sec(title)}<div class="sh head"><span></span><span>Item</span>'
                    f'<span class="w2">Where / cost</span></div>{rows}</section>')
    return sheet(7, "The<br><em>shopping.</em>", "Supplies",
                 f'<div class="three">{"".join(cols)}</div>', S)

REMEMBER = ["Candles and something to light them", "Playlist queued and speaker charged",
            "Camera or phone with room on it", "Ice, more than you think",
            "Bin bags and a spare cloth", "Somewhere to put coats and gifts",
            "Cake knife, server, plates", "Painkillers and plasters"]

def page_8(S):
    rows = "".join(
        f'<div class="rs">{blank(f"p8_time_{i}", "w3", "8.5")}{blank(f"p8_what_{i}", "", "9")}'
        f'{blank(f"p8_who_{i}", "w2", "8.5")}</div>' for i in range(1, 17))
    remember = "".join(f'<div class="rem">{check(f"p8_rem_{i}")}<span>{t}</span></div>'
                       for i, t in enumerate(REMEMBER, start=1))
    beats = "".join(f'<div class="beat"><span class="bt">{t}</span>{blank(f"p8_beat_{i}", "w3", "8.5")}</div>'
                    for i, t in enumerate(["Doors open", "Food out", "Cake &amp; song",
                                           "Games", "Speeches", "Goodbyes"], start=1))
    return sheet(8, "How the day<br><em>runs.</em>", "Run of show",
        '<div class="two b8"><section>' +
        sec("Hour by hour", "Start with set-up, end with clean-up") +
        '<div class="rs head"><span class="w3">Time</span><span>What happens</span>'
        '<span class="w2">Who is on it</span></div>' + rows +
        '</section><section>' + sec("The six moments", "Write the time next to each") +
        f'<div class="beats">{beats}</div>' +
        sec("Do not forget") + f'<div class="rems">{remember}</div>' +
        sec("Set-up starts") + field("At", "p8_setup", "w3") +
        field("Clean-up crew", "p8_cleanup") + '</section></div>', S)

def page_9(S):
    gifts = "".join(
        f'<div class="gf"><span class="idx">{i:02d}</span>{blank(f"p9_gift_{i}", "", "8.5")}'
        f'{blank(f"p9_from_{i}", "w2", "8.5")}<span class="c">{check(f"p9_thanks_{i}")}</span></div>'
        for i in range(1, 15))
    shots = "".join(f'<div class="wl">{check(f"p9_shot_{i}")}{blank(f"p9_shot_t_{i}", "grow", "8.5")}</div>'
                    for i in range(1, 7))
    return sheet(9, "Gifts, thanks<br><em>and next time.</em>", "After the party",
        '<div class="two b8"><section>' +
        sec("Gifts", "Tick when the thank-you goes out") +
        '<div class="gf head"><span class="idx">#</span><span>What it was</span>'
        '<span class="w2">Who from</span><span class="c">Sent</span></div>' + gifts +
        '</section><section>' +
        sec("Photos to take", "Decide before the day, not during it") + f'<div class="shots">{shots}</div>' +
        sec("What worked") +
        "".join(f'<div class="wl">{blank(f"p9_worked_{i}", "grow", "8.5")}</div>' for i in range(1, 5)) +
        sec("What I would change") +
        "".join(f'<div class="wl">{blank(f"p9_change_{i}", "grow", "8.5")}</div>' for i in range(1, 5)) +
        '</section></div>', S)

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --a1:{C["a1"]}; --a2:{C["a2"]}; --a3:{C["a3"]}; --a4:{C["a4"]};
  --backdrop:#eceef4;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#14151c; }} }}
:root[data-theme="dark"]{{ --backdrop:#14151c; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
      font-family:"IBM Plex Sans","Helvetica Neue",Arial,sans-serif;
      display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(23,26,43,.16);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.eyebrow{{ font-family:"Archivo",Arial,sans-serif; font-weight:700; text-transform:uppercase;
  letter-spacing:.16em; font-size:7.4pt; color:var(--soft); line-height:1; white-space:nowrap; }}
.hint{{ font-family:"Archivo",Arial,sans-serif; font-weight:500; text-transform:uppercase;
  letter-spacing:.1em; font-size:6.6pt; color:var(--faint); white-space:nowrap; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in;
  border-bottom:1.4px solid var(--ink); padding-bottom:8px; }}
.mast h1{{ font-family:"Fraunces","Georgia",serif; font-weight:600; font-size:{S["display"]};
  line-height:.92; margin:7px 0 0; letter-spacing:-.012em; }}
.mast h1 em{{ font-style:italic; font-weight:500; color:var(--a1); }}
.mastright{{ display:flex; align-items:flex-end; gap:14px; }}
.pageno{{ font-family:"Fraunces","Georgia",serif; font-size:17pt; line-height:1; color:var(--ink); }}
.pageno i{{ font-style:normal; font-size:9pt; color:var(--faint); }}
.mini{{ display:flex; flex-direction:column; gap:5px; padding-bottom:3px; }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:12px; }}
.two{{ flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .28in; }}
.two.b46{{ grid-template-columns:1.18fr 1fr; }}
.two.b8{{ grid-template-columns:1.25fr 1fr; }}
.three{{ flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr 1fr; gap:0 .24in; }}
.two > section, .three > section{{ display:flex; flex-direction:column; min-height:0; }}
.gap{{ height:14px; flex:none; }}

.sec{{ display:flex; align-items:center; gap:7px; padding:0 0 6px; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}

.page .fr{{ display:flex; align-items:flex-end; gap:8px;
  flex:1 1 auto; min-height:.27in; max-height:.46in; }}
.mini .fr{{ display:flex; align-items:flex-end; gap:8px; flex:none; height:.22in; }}
.fr .lbl, .fr .lbl2{{ font-family:"Archivo",Arial,sans-serif; font-weight:600; text-transform:uppercase;
  letter-spacing:.08em; font-size:6.8pt; color:var(--soft); padding-bottom:3px; white-space:nowrap; }}
.fr .lbl{{ width:.72in; flex:none; }}
.fr .lbl2{{ padding-left:10px; }}
.blank{{ flex:1; border-bottom:1px solid var(--rule); height:100%; min-width:0; }}
.blank.grow{{ flex:1; }}
.blank.w1{{ flex:none; width:1.15in; }}
.blank.w2{{ flex:none; width:.75in; }}
.blank.w3{{ flex:none; width:.5in; }}
.blank.num{{ flex:none; width:.62in; }}
.blank.c{{ flex:none; width:.22in; }}
.split2{{ display:flex; gap:12px; }}
.split2 .fr{{ flex:1; }}
.split2 .fr .lbl{{ width:auto; }}

.box{{ width:9px; height:9px; border:1px solid var(--strong); flex:none; margin-bottom:3px; }}
.c{{ display:flex; justify-content:center; }}

.wl{{ display:flex; align-items:flex-end; gap:7px; flex:1 1 auto; min-height:.26in; max-height:.44in; }}

.big{{ display:flex; align-items:flex-end; gap:9px; height:.36in; }}
.big .n{{ font-family:"Fraunces","Georgia",serif; font-size:15pt; line-height:1; width:14px; flex:none; }}
.big .n1{{ color:var(--a3); }} .big .n2{{ color:var(--a2); }} .big .n3{{ color:var(--a1); }}
.big .blank{{ border-bottom:1px solid var(--strong); }}

.cdgrid{{ display:grid; grid-template-columns:1fr 1fr; gap:5px 12px; padding:2px 0 6px; flex:none; }}
.board{{ flex:1 1 auto; min-height:1.3in; display:flex; }}
.board .blank{{ border:1px dashed var(--strong); border-radius:2px; height:auto; }}
.cd{{ display:flex; align-items:center; gap:7px; }}
.cdmark .box{{ margin-bottom:0; border-radius:50%; width:10px; height:10px; }}
.cdlbl{{ font-family:"Archivo",Arial,sans-serif; font-weight:600; text-transform:uppercase;
  letter-spacing:.08em; font-size:6.8pt; color:var(--soft); }}

.cdcols{{ flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr;
  grid-template-rows:1fr 1fr 1.05fr; gap:13px .28in; }}
.cdblock.wide{{ grid-column:1 / -1; }}
.cdblock.wide .tks{{ display:grid; grid-template-columns:1fr 1fr; gap:0 .28in; }}
.tks{{ flex:1; display:flex; flex-direction:column; min-height:0; }}
.cdblock{{ display:flex; flex-direction:column; }}
.cdhead{{ display:flex; align-items:center; gap:8px; border-bottom:1.2px solid var(--ink);
  padding-bottom:5px; margin-bottom:7px; }}
.cdhead h2{{ font-family:"Archivo",Arial,sans-serif; font-weight:700; text-transform:uppercase;
  letter-spacing:.12em; font-size:8pt; margin:0; }}
.cdhead .pip{{ width:8px; height:8px; border-radius:50%; flex:none; }}
.far .pip{{ background:var(--a1); }} .mid .pip{{ background:var(--a4); }}
.near .pip{{ background:var(--a2); }} .close .pip{{ background:var(--a3); }}
.now .pip{{ background:var(--ink); }}
.tk{{ display:flex; align-items:flex-end; gap:8px; flex:1 1 auto; min-height:.27in; max-height:.4in;
  border-bottom:1px solid var(--rule); }}
.tktext{{ font-size:8.5pt; color:var(--ink); padding-bottom:3px; line-height:1.15; }}

.gltable{{ flex:1; display:flex; flex-direction:column; }}
.gl{{ display:grid; grid-template-columns:.24in 1.5fr 1.1fr .26in .26in .26in .26in 1.35fr;
  gap:0 7px; align-items:flex-end; flex:1; min-height:.24in; }}
.gl .idx{{ font-size:7pt; color:var(--faint); font-variant-numeric:tabular-nums; padding-bottom:3px; }}
.gl.head, .bl.head, .vr.head, .hr.head, .rs.head, .gf.head, .ml.head, .sh.head{{
  flex:none; min-height:0; height:auto; padding-bottom:5px; border-bottom:1px solid var(--strong);
  margin-bottom:4px; font-family:"Archivo",Arial,sans-serif; font-weight:700; text-transform:uppercase;
  letter-spacing:.1em; font-size:6.4pt; color:var(--soft); }}
.gl.head span, .bl.head span, .vr.head span, .hr.head span,
.rs.head span, .gf.head span, .ml.head span, .sh.head span{{ border:0; }}
.totals{{ display:flex; gap:16px; border-top:1.4px solid var(--ink); margin-top:8px; padding-top:8px; }}
.tot{{ display:flex; align-items:flex-end; gap:7px; }}
.totlbl{{ font-family:"Archivo",Arial,sans-serif; font-weight:700; text-transform:uppercase;
  letter-spacing:.1em; font-size:6.8pt; color:var(--soft); padding-bottom:3px; }}

.bl{{ display:grid; grid-template-columns:1.3fr .62in .62in .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.26in; max-height:.42in; }}
.bl .cat{{ font-size:8.5pt; color:var(--ink); padding-bottom:3px; }}
.bl.total{{ flex:none; border-top:1.4px solid var(--ink); margin-top:6px; padding-top:7px; }}
.bl.total .cat{{ font-family:"Archivo",Arial,sans-serif; font-weight:700; text-transform:uppercase;
  letter-spacing:.1em; font-size:7.4pt; }}
.deps{{ display:flex; flex-direction:column; flex:0 1 auto; }}
.dep{{ display:grid; grid-template-columns:1fr .75in .62in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.27in; max-height:.4in; }}

.vr{{ display:grid; grid-template-columns:.8fr 1.3fr .75in .62in .26in .26in; gap:0 8px;
  align-items:flex-end; flex:1; min-height:.26in; }}
.vr .cat{{ font-size:8.5pt; padding-bottom:3px; }}
.hr{{ display:grid; grid-template-columns:1fr 1.5fr .75in .26in; gap:0 8px;
  align-items:flex-end; flex:1; min-height:.26in; }}

.ml{{ display:grid; grid-template-columns:1fr .75in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.25in; max-height:.44in; }}
.sh{{ display:grid; grid-template-columns:11px 1fr .75in; gap:0 7px; align-items:flex-end;
  flex:1; min-height:.24in; }}
.shtext{{ font-size:8pt; padding-bottom:3px; line-height:1.1; }}

.rs{{ display:grid; grid-template-columns:.5in 1fr .75in; gap:0 8px; align-items:flex-end;
  flex:1; min-height:.26in; }}
.beats{{ display:flex; flex-direction:column; flex:1 1 auto; padding-bottom:6px; }}
.beat{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.27in; max-height:.42in; }}
.beat .bt{{ font-family:"Archivo",Arial,sans-serif; font-weight:600; text-transform:uppercase;
  letter-spacing:.08em; font-size:6.8pt; color:var(--soft); padding-bottom:3px;
  width:.72in; flex:none; }}
.rems{{ display:flex; flex-direction:column; flex:1 1 auto; padding-bottom:4px; }}
.rem{{ display:flex; align-items:flex-end; gap:8px; flex:1 1 auto; min-height:.25in; max-height:.36in; }}
.rem span{{ font-size:7.8pt; color:var(--soft); padding-bottom:2px; line-height:1.1; }}
.shots{{ display:flex; flex-direction:column; flex:1 1 auto; padding-bottom:4px; }}

.gf{{ display:grid; grid-template-columns:.24in 1.5fr .75in .26in; gap:0 8px;
  align-items:flex-end; flex:1; min-height:.26in; }}
.gf .idx{{ font-size:7pt; color:var(--faint); font-variant-numeric:tabular-nums; padding-bottom:3px; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.4px solid var(--ink); margin-top:10px; padding-top:7px; }}
.foot .mark{{ font-family:"Fraunces","Georgia",serif; font-style:italic; font-size:8pt; color:var(--faint); }}
.foot .ramp{{ width:1.5in; height:3px; border-radius:2px;
  background:linear-gradient(90deg,var(--a1),var(--a4) 34%,var(--a2) 68%,var(--a3)); }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-birthday.css")
    pages = "".join(fn(size) for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Party Line Birthday Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- measure + fillable

MEASURE_JS = """
<style>body{padding:0 !important;background:#fff !important;display:block !important;gap:0 !important}
.sheet{box-shadow:none !important}</style>
<script>
(() => {
  const emit = () => {
    if (document.getElementById('FIELDS')) return;
    const sheets = [...document.querySelectorAll('.sheet')];
    const rows = [...document.querySelectorAll('[data-field]')].map(el => {
      const s = el.closest('.sheet');
      const p = sheets.indexOf(s);
      const r = el.getBoundingClientRect(), b = s.getBoundingClientRect();
      return [p, el.dataset.field, el.dataset.ftype || 'text',
              r.x - b.x, r.y - b.y, r.width, r.height, +(el.dataset.fsize || 9.5)];
    });
    const pre = document.createElement('pre');
    pre.id = 'FIELDS';
    pre.textContent = JSON.stringify(rows);
    document.documentElement.appendChild(pre);
  };
  const ready = document.fonts ? document.fonts.ready : Promise.resolve();
  ready.then(() => requestAnimationFrame(emit));
  setTimeout(emit, 3000);
})();
</script>
"""

def measure(src, size, work, name):
    """size may be a key of this kit's SIZES, or a size dict from another kit."""
    S = SIZES[size] if isinstance(size, str) else size
    path = os.path.join(work, f"measure-{name}.html")
    open(path, "w", encoding="utf-8").write(src + MEASURE_JS)
    for _ in range(4):
        dom = B.chrome("--dump-dom", f"--window-size={S['wpx']},{S['hpx']}", "file://" + path).stdout
        m = re.search(r'<pre id="FIELDS">(.*?)</pre>', dom, re.S)
        if m:
            return json.loads(html.unescape(m.group(1)))
    raise SystemExit(f"could not measure fields for {name}")

def make_fillable(design_pdf, fields, size, out_pdf, colorway, pages=None):
    """Draw the AcroForm widgets page by page, then merge the design over them."""
    from reportlab.pdfgen import canvas
    from reportlab.lib.colors import HexColor
    from pypdf import PdfReader, PdfWriter

    S = SIZES[size] if isinstance(size, str) else size
    C = COLORWAYS[colorway] if isinstance(colorway, str) else colorway
    pages = pages or len(PAGE_FNS)
    px2pt = 0.75
    overlay = out_pdf + ".overlay"
    c = canvas.Canvas(overlay, pagesize=(S["wpt"], S["hpt"]))
    ink, accent = HexColor(C["ink"]), HexColor(C["a1"])

    by_page = {}
    for page, name, ftype, x, y, w, h, fs in fields:
        by_page.setdefault(page, []).append((name, ftype, x, y, w, h, fs))

    for page in range(pages):
        for name, ftype, x, y, w, h, fs in by_page.get(page, []):
            x, y, w, h = x * px2pt, y * px2pt, w * px2pt, h * px2pt
            if ftype == "check":
                side = min(w, h) * 0.85
                c.acroForm.checkbox(
                    name=name, x=x + (w - side) / 2, y=S["hpt"] - (y + h) + (h - side) / 2,
                    size=side, buttonStyle="check", borderWidth=0, checked=False,
                    borderColor=None, fillColor=None, textColor=accent, forceBorder=False)
            else:
                box = min(h, 15.0)
                c.acroForm.textfield(
                    name=name, x=x + 1, y=S["hpt"] - (y + h) + 1.5, width=max(w - 2, 8), height=box,
                    fontName="Helvetica", fontSize=fs, textColor=ink,
                    borderWidth=0, borderColor=None, fillColor=None,
                    forceBorder=False, annotationFlags="print")
        c.showPage()
    c.save()

    writer = PdfWriter(clone_from=overlay)
    design = PdfReader(design_pdf)
    for i, page in enumerate(writer.pages):
        page.merge_page(design.pages[i])
    writer.set_need_appearances_writer(True)
    with open(out_pdf, "wb") as fh:
        writer.write(fh)
    os.remove(overlay)

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-bd-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"birthday-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = measure(src, size, work, name)
        fill_pdf = os.path.join(DIST, f"birthday-planner-{name}-fillable.pdf")
        make_fillable(print_pdf, fields, size, fill_pdf, colorway)
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

# --------------------------------------------------------------------------- buyer + listing extras

READ_ME = dict(
    doc="Start here", brand="Party Line &nbsp;&middot;&nbsp; Birthday Kit",
    title="Start<br><em>here.</em>",
    lede="Thank you. Nine pages that carry a party from the first idea to the thank-you notes "
         "&mdash; type into them, print them, or both.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields, cleaner for batch printing"),
           ("746 form fields", "every line, box and tick, ready to type into"),
           ("This guide", "typing, printing and the licence in one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free, Mac and Windows) "
        "or a tablet app like GoodNotes or Xodo. Click any line and type; tick the boxes with a "
        "click. <b>Save a copy first</b> and keep it as your working file &mdash; one party, one "
        "document, editable to the last minute.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without the fields. Print the whole kit "
        "once and put it in a folder, or print single pages as you need them &mdash; every page "
        "carries the name and the date at the top, so a loose sheet still makes sense.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "Margins: none / borderless, portrait",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="If anything looks off",
    s5p="Message me through Etsy and I will sort it the same day &mdash; a file that will not open, "
        "a size you need, a page you wish said something else. If the kit earned its place on your "
        "table, a review helps this small shop more than you would think.",
    license="Personal use only. Print as many copies as you like for yourself and for the party you "
            "are planning. Please do not resell, share or redistribute the files. Fonts: Fraunces, "
            "Archivo, IBM Plex Sans (SIL Open Font License).",
    mark="Nine pages, one party.")

def build_readme(work):
    """Reuse the shared delivery sheet, retypeset in this kit's faces and colours."""
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    P = COLORWAYS["party"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Fraunces","Georgia",serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Archivo",Arial,sans-serif'),
                 ("--s1:#f2a65a", "--s1:" + P["a1"]), ("--s2:#ee6c4d", "--s2:" + P["a4"]),
                 ("--s3:#c43e7a", "--s3:" + P["a2"]), ("--s4:#4b2e83", "--s4:" + P["a3"]),
                 ("--ink:#23181f", "--ink:" + P["ink"]), ("--soft:#6e6068", "--soft:" + P["soft"]),
                 ("--faint:#9a8f94", "--faint:" + P["faint"]), ("--rule:#e3dcde", "--rule:" + P["rule"])]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-birthday.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    path = os.path.join(work, "readme-birthday.html")
    open(path, "w", encoding="utf-8").write(tpl)
    B.to_pdf(path, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

PAGE_NAMES = ["At a glance", "The countdown", "Guest list &amp; RSVP", "Budget",
              "Vendors &amp; helpers", "Cake, food and drink", "Shopping",
              "Run of show", "Gifts &amp; thanks"]

def page_images(work, dpi=110):
    """Rasterise the print kit so the listing images show the real pages."""
    import pymupdf
    doc = pymupdf.open(os.path.join(DIST, "birthday-planner-letter-party-print.pdf"))
    out = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"bd-page-{i+1}.png")
        page.get_pixmap(dpi=dpi).save(f)
        out.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())
    return out

def build_mockups(work):
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-birthday.css")
    imgs = page_images(work)
    P = COLORWAYS["party"]
    over = (
        "<style>"
        f"h1 em{{color:{P['a1']}}}"
        f".rule{{background:linear-gradient(90deg,{P['a1']},{P['a4']} 34%,{P['a2']} 68%,{P['a3']})}}"
        f"body{{color:{P['ink']}}} .sub{{color:{P['soft']}}} .eyebrow{{color:{P['soft']}}}"
        f".badge{{border-color:{P['ink']};color:{P['ink']}}}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:14px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(23,26,43,.14)}"
        ".tile img{height:548px;width:auto;display:block}"
        f".tilecap{{font-family:'Archivo',Arial,sans-serif;font-weight:700;text-transform:uppercase;"
        f"letter-spacing:.12em;font-size:20px;color:{P['faint']};padding:11px 2px 0}}"
        "</style>")

    tiles = "".join(
        f'<div><div class="tile"><img src="{im}"></div><div class="tilecap">{n}</div></div>'
        for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; Fillable PDF</span>
          <h1>Birthday,<br><em>planned.</em></h1>
          <span class="rule"></span>
          <p class="sub">From the first idea to the thank-you notes: countdown, guest list and
          RSVPs, budget, vendors, menu, shopping, run of show, gifts.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Type or print</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''

    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>one party.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''

    detail = f'''
      <span class="eyebrow">746 form fields</span>
      <h1>Type into it,<br><em>not around it.</em></h1>
      <p class="sub">Every line and tick box &mdash; guest list, RSVPs, budget columns, the run of
      show. Fill it in Acrobat Reader or on a tablet, or print it and use a pen.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[2]}" style="height:1040px"><img src="{imgs[7]}" style="height:1040px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#eef1f8", "100px", "80px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#eef1f8", "100px", "70px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts + over, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-bd-{name}.html")
        open(hp, "w", encoding="utf-8").write(page)
        B.to_png(hp, os.path.join(DIST, f"listing-{name}.png"), 2000, 2000, scale=1)
        print(f"  listing image {name}")


def package(dist=None, stem="Party-Line-Birthday-Kit"):
    """Zip a kit the way an Etsy listing takes it: complete, Letter, A4."""
    import zipfile
    dist = dist or DIST
    out = os.path.join(dist, "etsy")
    os.makedirs(out, exist_ok=True)
    pdfs = sorted(f for f in os.listdir(dist) if f.endswith(".pdf"))
    for zname, members in {
        f"{stem}-COMPLETE.zip": pdfs,
        f"{stem}-Letter.zip": [f for f in pdfs if "letter" in f or f.startswith("00-")],
        f"{stem}-A4.zip": [f for f in pdfs if "a4" in f or f.startswith("00-")],
    }.items():
        zpath = os.path.join(out, zname)
        with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
            for f in members:
                z.write(os.path.join(dist, f), f)
        print(f"  {zname}  ({os.path.getsize(zpath)/1e6:.1f} MB, {len(members)} files)")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--no-fillable", action="store_true")
    ap.add_argument("--extras", action="store_true",
                    help="only the start-here sheet, listing images and zips")
    args = ap.parse_args()

    os.makedirs(DIST, exist_ok=True)
    os.makedirs(WORK, exist_ok=True)
    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    if args.extras:
        build_readme(WORK)
        build_mockups(WORK)
        package()
        return

    print("Building birthday kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "birthday-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "party", embed_fonts=False))
    print("Wrote birthday-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    package()

if __name__ == "__main__":
    main()
