#!/usr/bin/env python3
"""Build the Confetti Club kids' birthday party kit.

Same production line as the grown-up kit (birthday.py) — HTML through headless
Chromium, field rectangles measured off the real layout — but a louder design and
pages built around the things that actually go wrong at a children's party:
allergies, pick-up times, goodie bags, and an hour that runs too hot.

    python3 kids.py                # every size / colourway
    python3 kids.py --only letter-confetti
    python3 kids.py --extras       # start-here sheet, listing images, zips
"""
import argparse, base64, os, random

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-kids")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Fredoka:wght@400;500;600"
          "&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,600&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".42in .48in .38in", display="36pt"),
    "a4":     dict(B.SIZES["a4"],     pad="11mm 12mm 10mm", display="35pt"),
}

COLORWAYS = {
    # five loud colours, each with a job: pink = the birthday kid, sun = food,
    # sky = people, lime = go/done, grape = time
    "confetti": dict(ink="#2a2140", soft="#6a6180", faint="#a29cb4", rule="#e7e3f0",
                     strong="#c9c2dc", a1="#ff4d8d", a2="#ffc531", a3="#35a7ff",
                     a4="#3fc96f", a5="#7b5cff"),
    "mono":     dict(ink="#232228", soft="#66646f", faint="#9d9aa6", rule="#e6e5ea",
                     strong="#c6c4cd", a1="#3a3944", a2="#9a97a3", a3="#6e6b78",
                     a4="#86838f", a5="#4e4c58"),
}

PAGES = 9
MARK = "Two hours. Nine pages. No tears."

# --------------------------------------------------------------------------- helpers

def check(f, tone=""):
    return f'<span class="box {tone}" data-field="{f}" data-ftype="check"></span>'

def blank(f, cls="", fs=""):
    fs = f' data-fsize="{fs}"' if fs else ""
    return f'<span class="blank {cls}" data-field="{f}"{fs}></span>'

def sec(label, tone="t1", hint=""):
    hint = f'<span class="hint">{hint}</span>' if hint else ""
    return (f'<div class="sec"><span class="pill {tone}">{label}</span>'
            f'<span class="dots"></span>{hint}</div>')

def field(label, f, cls="", fs=""):
    return f'<div class="fr"><span class="lbl">{label}</span>{blank(f, cls, fs)}</div>'

def confetti(seed):
    """A little scatter of shapes, deterministic per page so reprints match."""
    rnd = random.Random(seed)
    tones = ["var(--a1)", "var(--a2)", "var(--a3)", "var(--a4)", "var(--a5)"]
    bits = []
    for i in range(22):
        x, y = rnd.uniform(2, 296), rnd.uniform(3, 60)
        c, rot = tones[i % 5], rnd.uniform(0, 180)
        kind = i % 3
        if kind == 0:
            bits.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rnd.uniform(2, 3.6):.1f}" fill="{c}"/>')
        elif kind == 1:
            w, h = rnd.uniform(4, 8), rnd.uniform(2, 3)
            bits.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="1.2" '
                        f'fill="{c}" transform="rotate({rot:.0f} {x:.1f} {y:.1f})"/>')
        else:
            s = rnd.uniform(3.5, 6)
            bits.append(f'<path d="M{x:.1f} {y:.1f} l{s:.1f} {s:.1f} l-{s:.1f} {s:.1f} z" fill="{c}" '
                        f'opacity=".9" transform="rotate({rot:.0f} {x:.1f} {y:.1f})"/>')
    return (f'<svg class="confetti" viewBox="0 0 300 66" aria-hidden="true">{"".join(bits)}</svg>')

def sheet(n, title, kicker, body):
    meta = ""
    if n > 1:
        meta = (f'<div class="mini">{field("Party for", f"k{n}_for", "w1", "8")}'
                f'{field("Date", f"k{n}_date", "w2", "8")}</div>')
    return f'''
<div class="sheet">
  <header class="mast">
    <div class="masthead-left">
      <span class="hat">{kicker}</span>
      <h1>{title}</h1>
    </div>
    <div class="mastright">{confetti(n * 7 + 3)}{meta}
      <span class="pagebadge">{n}<i>/{PAGES}</i></span></div>
  </header>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="dotrow"><i></i><i></i><i></i><i></i><i></i></span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    wishes = "".join(
        f'<div class="wish"><span class="star s{i}">&#9733;</span>{blank(f"k1_wish_{i}", "grow")}</div>'
        for i in (1, 2, 3))
    balloons = "".join(
        f'<div class="bal"><span class="balloon b{i}">{check(f"k1_cd_{i}", "clear")}</span>'
        f'<span class="ballbl">{lab}</span></div>'
        for i, lab in enumerate(["4 wks", "2 wks", "1 wk", "Eve", "Party!"], start=1))
    left = (sec("The basics", "t1") +
        field("Birthday kid", "k1_name") + field("Turning", "k1_age", "w3") +
        field("Date", "k1_date") + field("Doors open", "k1_start", "w3") +
        field("Doors close", "k1_end", "w3") + field("Where", "k1_where") +
        field("Theme", "k1_theme") + field("Dress up?", "k1_dress") +
        '<div class="split2">' + field("Kids", "k1_kids", "w3") +
        field("Grown-ups", "k1_adults", "w3") + '</div>' +
        field("Budget", "k1_budget") + field("RSVP by", "k1_rsvp") +
        field("Entertainer", "k1_ent") + field("Goodie bag theme", "k1_bagtheme") +
        field("Helpers", "k1_helpers") + field("Invitations", "k1_inv"))
    right = (sec("Three wishes", "t2", "Ask the birthday kid, write it down") + wishes +
        sec("Countdown", "t3") + f'<div class="bals">{balloons}</div>' +
        sec("Theme board", "t5", "Colours, characters, a drawing") +
        f'<div class="board">{blank("k1_board")}</div>')
    return sheet(1, "Whose party<br><em>is it?</em>", "Kids&#8217; party kit &middot; Start here",
                 f'<div class="two"><section>{left}</section><section>{right}</section></div>')

COUNTDOWN = [
    ("4 weeks to go", "c1", ["Pick the date &mdash; check the school calendar",
                             "Ask the birthday kid what they actually want",
                             "Set the number: kids = age + 1 works",
                             "Book the room, the hall or the garden",
                             "Book the entertainer or plan the games"]),
    ("2 weeks to go", "c2", ["Send the invitations with a start AND an end time",
                             "Ask every parent about allergies",
                             "Order the cake", "Buy the goodie bag bits",
                             "Line up two grown-up helpers"]),
    ("1 week to go", "c3", ["Chase the parents who have not replied",
                            "Confirm the entertainer in writing",
                            "Buy drinks, snacks and paper everything",
                            "Charge the speaker, make the playlist",
                            "Print the pick-up list with phone numbers"]),
    ("The night before", "c4", ["Fill the goodie bags", "Chill the drinks, make the ice",
                                "Blow up what can be blown up",
                                "Set out plates, cups and the cake table",
                                "Charge the camera"]),
    ("Party day", "c5", ["Decorate", "Cake out of the fridge an hour before",
                         "One grown-up on the door with the list",
                         "One grown-up on the camera", "Cake, candles, song",
                         "Goodie bag into every hand at the door"]),
]

def page_2():
    blocks = []
    for bi, (title, tone, tasks) in enumerate(COUNTDOWN, start=1):
        wide = " wide" if bi == 5 else ""
        rows = "".join(f'<div class="tk">{check(f"k2_b{bi}_t{ti}", tone)}'
                       f'<span class="tktext">{t}</span></div>'
                       for ti, t in enumerate(tasks, start=1))
        rows += "".join(f'<div class="tk">{check(f"k2_b{bi}_x{i}", tone)}'
                        f'{blank(f"k2_b{bi}_line{i}", "grow", "8.5")}</div>'
                        for i in ((1, 2) if wide else (1, 2)))
        blocks.append(f'<section class="cdblock{wide}">'
                      f'<div class="cdhead"><span class="balloon {tone}"></span>'
                      f'<h2>{title}</h2></div><div class="tks">{rows}</div></section>')
    return sheet(2, "Four weeks<br><em>to go.</em>", "Kids&#8217; party kit &middot; Countdown",
                 f'<div class="cdcols">{"".join(blocks)}</div>')

def page_3():
    head = ('<div class="gl head"><span>#</span><span>Child</span><span>Grown-up &amp; phone</span>'
            '<span class="c">Inv</span><span class="c">Yes</span><span class="c">No</span>'
            '<span>Allergies &amp; notes</span><span class="w2">Pick-up</span></div>')
    rows = "".join(
        f'<div class="gl"><span class="idx">{i:02d}</span>{blank(f"k3_child_{i}", "", "8.5")}'
        f'{blank(f"k3_parent_{i}", "", "8")}<span class="c">{check(f"k3_inv_{i}", "t3")}</span>'
        f'<span class="c">{check(f"k3_yes_{i}", "t4")}</span>'
        f'<span class="c">{check(f"k3_no_{i}", "t1")}</span>'
        f'{blank(f"k3_notes_{i}", "", "8")}{blank(f"k3_pickup_{i}", "w2", "8")}</div>'
        for i in range(1, 21))
    totals = ('<div class="totals">' +
              "".join(f'<div class="tot">{blank(f"k3_t_{k}", "num", "10")}'
                      f'<span class="totlbl">{v}</span></div>'
                      for k, v in [("inv", "Invited"), ("yes", "Coming"), ("no", "Can&#8217;t"),
                                   ("wait", "Waiting"), ("grown", "Grown-ups staying")]) +
              '</div>')
    return sheet(3, "Who is<br><em>coming?</em>", "Kids&#8217; party kit &middot; Guest list",
                 sec("Guests", "t3", "Every child needs a grown-up and a phone number") +
                 f'<div class="gltable">{head}{rows}</div>{totals}')

def page_4():
    def act(i):
        pips = "".join(f'<span class="c">{check(f"k4_e{i}_{p}", "t1")}</span>' for p in range(1, 6))
        return (f'<div class="act">{blank(f"k4_act_{i}", "", "8.5")}'
                f'{blank(f"k4_len_{i}", "w3", "8")}{blank(f"k4_need_{i}", "", "8")}'
                f'<span class="energy">{pips}</span></div>')
    rows = "".join(act(i) for i in range(1, 11))
    prizes = "".join(f'<div class="ml">{blank(f"k4_prize_{i}", "", "8.5")}'
                     f'{blank(f"k4_prize_n_{i}", "w2", "8")}</div>' for i in range(1, 7))
    return sheet(4, "Games<br><em>&amp; chaos.</em>", "Kids&#8217; party kit &middot; Activities",
        sec("The plan", "t1", "Energy: calm on the left, wild on the right") +
        '<div class="act head"><span>Activity</span><span class="w3">Mins</span>'
        '<span>What we need</span><span class="energy lblhead">Calm &rarr; wild</span></div>' +
        rows +
        '<div class="gap"></div>'
        '<div class="two b46"><section>' +
        sec("Prizes &amp; who won", "t2") +
        '<div class="ml head"><span>Prize</span><span class="w2">How many</span></div>' + prizes +
        '</section><section>' +
        sec("Backups", "t5", "The two that save the day") +
        field("If it rains", "k4_rain") + field("If they get wild", "k4_wild") +
        field("Quiet game to finish", "k4_quiet") + field("Music / playlist", "k4_music") +
        field("Spare activity", "k4_spare") + field("Total minutes", "k4_total", "w3") +
        '</section></div>')

def page_5():
    kid = "".join(f'<div class="ml">{blank(f"k5_kid_{i}", "", "8.5")}'
                  f'{blank(f"k5_kid_q_{i}", "w2", "8")}</div>' for i in range(1, 9))
    grown = "".join(f'<div class="ml">{blank(f"k5_grown_{i}", "", "8.5")}'
                    f'{blank(f"k5_grown_q_{i}", "w2", "8")}</div>' for i in range(1, 6))
    drinks = "".join(f'<div class="ml">{blank(f"k5_drink_{i}", "", "8.5")}'
                     f'{blank(f"k5_drink_q_{i}", "w2", "8")}</div>' for i in range(1, 6))
    allergy = "".join(f'<div class="al">{blank(f"k5_al_who_{i}", "w2", "8.5")}'
                      f'{blank(f"k5_al_what_{i}", "", "8.5")}'
                      f'<span class="c">{check(f"k5_al_ok_{i}", "t4")}</span></div>'
                      for i in range(1, 7))
    cake = (sec("The cake", "t1", "Order it two weeks out") +
            field("Flavour", "k5_flavour") + field("Serves", "k5_serves", "w3") +
            field("Writing on top", "k5_msg") + field("From", "k5_bakery") +
            field("Collect at", "k5_collect", "w3") +
            f'<div class="fr"><span class="lbl">Candles</span>{check("k5_candles", "t2")}'
            f'<span class="lbl2">Lighter</span>{check("k5_lighter", "t2")}'
            f'<span class="lbl2">Knife</span>{check("k5_knife", "t2")}</div>')
    return sheet(5, "Cake, snacks<br><em>&amp; allergies.</em>", "Kids&#8217; party kit &middot; Food",
        '<div class="two b46"><section>' + cake + '<div class="gap"></div>' +
        sec("Food for the kids", "t2", "Small, boring and beige wins") +
        '<div class="ml head"><span>What</span><span class="w2">How much</span></div>' + kid +
        '<div class="gap"></div>' +
        sec("Food for the grown-ups", "t3") +
        '<div class="ml head"><span>What</span><span class="w2">How much</span></div>' + grown +
        '</section><section>' +
        '<div class="alert">' +
        sec("Allergy list", "t1", "Copy it off the guest list, then tick when checked") +
        '<div class="al head"><span class="w2">Who</span><span>What they cannot have</span>'
        '<span class="c">OK</span></div>' + allergy +
        f'<div class="alertnote">{check("k5_al_told", "t1")}'
        '<span>Every grown-up helping has read this list</span></div>' +
        '</div><div class="gap"></div>' +
        sec("Drinks", "t3") +
        '<div class="ml head"><span>What</span><span class="w2">How much</span></div>' + drinks +
        '<div class="gap"></div>' +
        sec("Cake time", "t5") + field("Cake at", "k5_caketime", "w3") +
        field("Who carries it", "k5_carrier") + field("Who films it", "k5_filmer") +
        '</section></div>')

BUDGET = ["Room or hall", "Entertainer", "Cake", "Food &amp; drinks", "Decorations",
          "Goodie bags", "Prizes", "Invitations"]

def page_6():
    bags = "".join(f'<div class="bag">{check(f"k6_bag_{i}", "t2")}'
                   f'{blank(f"k6_bag_item_{i}", "", "8.5")}{blank(f"k6_bag_qty_{i}", "w3", "8")}'
                   f'{blank(f"k6_bag_cost_{i}", "w3", "8")}</div>' for i in range(1, 12))
    money = "".join(f'<div class="bl"><span class="cat">{c}</span>'
                    f'{blank(f"k6_plan_{i}", "num", "9")}{blank(f"k6_actual_{i}", "num", "9")}'
                    f'<span class="c">{check(f"k6_paid_{i}", "t4")}</span></div>'
                    for i, c in enumerate(BUDGET, start=1))
    money += "".join(f'<div class="bl">{blank(f"k6_cat_x{i}", "", "9")}'
                     f'{blank(f"k6_plan_x{i}", "num", "9")}{blank(f"k6_actual_x{i}", "num", "9")}'
                     f'<span class="c">{check(f"k6_paid_x{i}", "t4")}</span></div>' for i in (1, 2, 3, 4))
    return sheet(6, "Goodie bags<br><em>&amp; the bill.</em>", "Kids&#8217; party kit &middot; Money",
        '<div class="two b46"><section>' +
        sec("What goes in the bag", "t2", "Five small things beat one big thing") +
        '<div class="bag head"><span></span><span>Item</span><span class="w3">Each</span>'
        '<span class="w3">Cost</span></div>' + bags +
        '<div class="gap"></div>' +
        '<div class="split2">' + field("Bags needed", "k6_bags", "w3") +
        field("Cost per bag", "k6_perbag", "w3") + '</div>' +
        field("Who fills them", "k6_filler") +
        f'<div class="fr"><span class="lbl">Names on</span>{check("k6_names", "t3")}'
        f'<span class="lbl2">Spares made</span>{check("k6_spares", "t3")}</div>' +
        '</section><section>' +
        sec("What it costs", "t5", "Planned &middot; actual &middot; paid") +
        '<div class="bl head"><span class="cat">Line</span><span class="num">Planned</span>'
        '<span class="num">Actual</span><span class="c">Paid</span></div>' + money +
        '<div class="bl total"><span class="cat">Total</span>' +
        blank("k6_total_plan", "num", "10") + blank("k6_total_actual", "num", "10") +
        '<span class="c"></span></div>' +
        sec("Note to self", "t3") +
        "".join(f'<div class="wl">{blank(f"k6_note_{i}", "grow", "8.5")}</div>' for i in (1, 2, 3, 4)) +
        '</section></div>')

SHOP = [("Food &amp; drink", "t2", "k7_a", ["Ice", "Juice boxes", "Fruit", "Something beige"]),
        ("Paper &amp; plastic", "t3", "k7_b", ["Plates", "Cups", "Napkins", "Bin bags", "Wet wipes"]),
        ("Decorations", "t1", "k7_c", ["Balloons", "Banner", "Candles", "Tape", "Table cover"])]

def page_7():
    cols = []
    for title, tone, prefix, seeded in SHOP:
        rows = "".join(f'<div class="sh">{check(f"{prefix}_s{i}", tone)}'
                       f'<span class="shtext">{t}</span>{blank(f"{prefix}_sw{i}", "w2", "8")}</div>'
                       for i, t in enumerate(seeded, start=1))
        rows += "".join(f'<div class="sh">{check(f"{prefix}_b{i}", tone)}'
                        f'{blank(f"{prefix}_item_{i}", "", "8.5")}'
                        f'{blank(f"{prefix}_where_{i}", "w2", "8")}</div>' for i in range(1, 13))
        cols.append(f'<section>{sec(title, tone)}'
                    f'<div class="sh head"><span></span><span>Item</span>'
                    f'<span class="w2">Where / cost</span></div>{rows}</section>')
    return sheet(7, "The<br><em>shopping.</em>", "Kids&#8217; party kit &middot; Supplies",
                 f'<div class="three">{"".join(cols)}</div>')

BEATS = [("Doors open, free play", "The first 15 minutes are always chaos. Let them run."),
         ("Activity or entertainer", "The main event, while everyone is fresh"),
         ("Food", "Sit them down. Beige food, small portions."),
         ("Cake &amp; song", "Camera ready before the candles go on"),
         ("Games &amp; prizes", "Two short ones beat one long one"),
         ("Goodie bags &amp; goodbyes", "One bag per child, handed over at the door")]

def page_8():
    beats = "".join(
        f'<div class="beat"><span class="bnum b{i}">{i}</span>'
        f'<div class="btext"><b>{t}</b><span>{d}</span></div>'
        f'{blank(f"k8_beat_{i}", "w3", "9")}</div>'
        for i, (t, d) in enumerate(BEATS, start=1))
    jobs = "".join(f'<div class="hr">{blank(f"k8_job_who_{i}", "", "8.5")}'
                   f'{blank(f"k8_job_what_{i}", "", "8.5")}'
                   f'<span class="c">{check(f"k8_job_ok_{i}", "t4")}</span></div>'
                   for i in range(1, 7))
    forget = ["Camera charged, someone on it", "Pick-up list by the door",
              "Ice and spare cups", "Wipes, plasters, a spare t-shirt",
              "Bin bag for the wrapping", "A quiet corner for the tired one"]
    rem = "".join(f'<div class="rem">{check(f"k8_rem_{i}", "t5")}<span>{t}</span></div>'
                  for i, t in enumerate(forget, start=1))
    return sheet(8, "How the day<br><em>runs.</em>", "Kids&#8217; party kit &middot; Party day",
        '<div class="two b8"><section>' +
        sec("Six beats, two hours", "t1", "Write the time next to each") +
        f'<div class="beats">{beats}</div>' +
        sec("Grown-up jobs", "t3", "Name against every job, or it lands on you") +
        '<div class="hr head"><span>Who</span><span>What they are on</span><span class="c">OK</span></div>' +
        jobs +
        '</section><section>' +
        sec("Set-up", "t5") + field("Start at", "k8_setup", "w3") +
        field("Helpers arrive", "k8_helpers", "w3") + field("Clean-up crew", "k8_clean") +
        sec("Do not forget", "t2") + f'<div class="rems">{rem}</div>' +
        sec("Emergency numbers", "t1") +
        "".join(f'<div class="wl">{blank(f"k8_num_{i}", "grow", "8.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_9():
    gifts = "".join(
        f'<div class="gf"><span class="idx">{i:02d}</span>{blank(f"k9_gift_{i}", "", "8.5")}'
        f'{blank(f"k9_from_{i}", "w2", "8.5")}<span class="c">{check(f"k9_thanks_{i}", "t4")}</span></div>'
        for i in range(1, 15))
    shots = "".join(f'<div class="wl">{check(f"k9_shot_{i}", "t3")}'
                    f'{blank(f"k9_shot_t_{i}", "grow", "8.5")}</div>' for i in range(1, 6))
    return sheet(9, "Thank yous<br><em>&amp; the good bits.</em>", "Kids&#8217; party kit &middot; After",
        '<div class="two b8"><section>' +
        sec("Gifts", "t4", "Tick when the thank-you goes out") +
        '<div class="gf head"><span class="idx">#</span><span>What it was</span>'
        '<span class="w2">Who from</span><span class="c">Sent</span></div>' + gifts +
        '</section><section>' +
        sec("Photos to take", "t3", "Decide before, not during") + f'<div class="shots">{shots}</div>' +
        sec("What they loved", "t1") +
        "".join(f'<div class="wl">{blank(f"k9_loved_{i}", "grow", "8.5")}</div>' for i in (1, 2, 3)) +
        sec("For next year", "t5", "Write it now, you will forget by then") +
        "".join(f'<div class="wl">{blank(f"k9_next_{i}", "grow", "8.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --a1:{C["a1"]}; --a2:{C["a2"]}; --a3:{C["a3"]}; --a4:{C["a4"]}; --a5:{C["a5"]};
  --backdrop:#f0edf6;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#161320; }} }}
:root[data-theme="dark"]{{ --backdrop:#161320; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Nunito","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(42,33,64,.16);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.hat{{ display:inline-block; font-weight:800; text-transform:uppercase; letter-spacing:.11em;
  font-size:6.8pt; color:var(--a1); border:1.5px solid var(--a1); border-radius:999px;
  padding:3px 9px; }}
.hint{{ font-weight:700; text-transform:uppercase; letter-spacing:.07em; font-size:6.6pt;
  color:var(--faint); white-space:nowrap; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.28in;
  border-bottom:2.4px dotted var(--strong); padding-bottom:9px; }}
.mast h1{{ font-family:"Fredoka","Nunito",sans-serif; font-weight:600; font-size:{S["display"]};
  line-height:.94; margin:8px 0 0; letter-spacing:-.01em; }}
.mast h1 em{{ font-style:normal; color:var(--a1); }}
.mastright{{ display:flex; align-items:flex-end; gap:12px; position:relative; }}
.confetti{{ position:absolute; right:0; top:-46px; width:2.05in; height:.46in; opacity:.95; }}
.pagebadge{{ font-family:"Fredoka","Nunito",sans-serif; font-weight:600; font-size:12pt;
  color:#fff; background:var(--a5); border-radius:50%; width:.36in; height:.36in;
  display:flex; align-items:baseline; justify-content:center; gap:1px; padding-top:5px; }}
.pagebadge i{{ font-style:normal; font-size:6.5pt; opacity:.85; }}
.mini{{ display:flex; flex-direction:column; gap:4px; padding-bottom:2px; }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:11px; }}
.two{{ flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .26in; }}
.two.b46{{ grid-template-columns:1.1fr 1fr; }}
.two.b8{{ grid-template-columns:1.3fr 1fr; }}
.three{{ flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr 1fr; gap:0 .22in; }}
.two > section, .three > section{{ display:flex; flex-direction:column; min-height:0; }}
.gap{{ height:12px; flex:none; }}

.sec{{ display:flex; align-items:center; gap:7px; padding:2px 0 6px; }}
.sec .dots{{ flex:1; height:0; border-top:1.6px dotted var(--strong); }}
.pill{{ font-weight:800; text-transform:uppercase; letter-spacing:.09em; font-size:7pt;
  border-radius:999px; padding:3px 9px; color:#fff; white-space:nowrap; }}
.pill.t1{{ background:var(--a1); }} .pill.t2{{ background:var(--a2); color:var(--ink); }}
.pill.t3{{ background:var(--a3); }} .pill.t4{{ background:var(--a4); }}
.pill.t5{{ background:var(--a5); }}

.page .fr{{ display:flex; align-items:flex-end; gap:8px; flex:1 1 auto;
  min-height:.27in; max-height:.5in; }}
.mini .fr{{ display:flex; align-items:flex-end; gap:7px; flex:none; height:.2in; }}
.fr .lbl, .fr .lbl2{{ font-weight:700; text-transform:uppercase; letter-spacing:.06em;
  font-size:6.8pt; color:var(--soft); padding-bottom:3px; white-space:nowrap; }}
.fr .lbl{{ width:.78in; flex:none; }}
.fr .lbl2{{ padding-left:9px; }}
.blank{{ flex:1; border-bottom:1.4px dotted var(--strong); height:100%; min-width:0; }}
.blank.w1{{ flex:none; width:1.1in; }} .blank.w2{{ flex:none; width:.72in; }}
.blank.w3{{ flex:none; width:.46in; }} .blank.num{{ flex:none; width:.6in; }}
.split2{{ display:flex; gap:12px; }}
.split2 .fr{{ flex:1; }} .split2 .fr .lbl{{ width:auto; }}

.box{{ width:10px; height:10px; border:1.5px solid var(--strong); border-radius:3px;
  flex:none; margin-bottom:3px; }}
.box.t1{{ border-color:var(--a1); }} .box.t2{{ border-color:var(--a2); }}
.box.t3{{ border-color:var(--a3); }} .box.t4{{ border-color:var(--a4); }}
.box.t5{{ border-color:var(--a5); }}
.box.c1{{ border-color:var(--a1); }} .box.c2{{ border-color:var(--a2); }}
.box.c3{{ border-color:var(--a3); }} .box.c4{{ border-color:var(--a4); }}
.box.c5{{ border-color:var(--a5); }}
.c{{ display:flex; justify-content:center; }}

.wl{{ display:flex; align-items:flex-end; gap:7px; flex:1 1 auto; min-height:.26in; max-height:.5in; }}

.wish{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.3in; max-height:.44in; }}
.wish .star{{ font-size:13pt; line-height:1; width:15px; flex:none; padding-bottom:2px; }}
.wish .s1{{ color:var(--a1); }} .wish .s2{{ color:var(--a2); }} .wish .s3{{ color:var(--a3); }}
.wish .blank{{ border-bottom:1.6px dotted var(--a5); }}
.wish:last-of-type{{ margin-bottom:6px; }}

.bals{{ display:flex; justify-content:space-between; gap:6px; padding:4px 0 8px; flex:none; }}
.bal{{ display:flex; flex-direction:column; align-items:center; gap:4px; }}
.balloon{{ width:15px; height:18px; border-radius:50% 50% 50% 50% / 58% 58% 42% 42%;
  border:1.6px solid var(--a1); display:flex; align-items:center; justify-content:center;
  position:relative; }}
.balloon::after{{ content:""; position:absolute; bottom:-5px; left:50%; width:1px; height:5px;
  background:var(--strong); }}
.balloon .box{{ margin:0; border:0; width:8px; height:8px; }}
.bal .ballbl{{ font-weight:800; text-transform:uppercase; letter-spacing:.05em; font-size:6.2pt;
  color:var(--soft); }}
.b1{{ border-color:var(--a1); }} .b2{{ border-color:var(--a2); }} .b3{{ border-color:var(--a3); }}
.b4{{ border-color:var(--a4); }} .b5{{ border-color:var(--a5); }}
.balloon.c1{{ background:var(--a1); border-color:var(--a1); }}
.balloon.c2{{ background:var(--a2); border-color:var(--a2); }}
.balloon.c3{{ background:var(--a3); border-color:var(--a3); }}
.balloon.c4{{ background:var(--a4); border-color:var(--a4); }}
.balloon.c5{{ background:var(--a5); border-color:var(--a5); }}

.board{{ flex:1 1 auto; min-height:1.1in; display:flex; }}
.board .blank{{ border:1.8px dashed var(--strong); border-radius:8px; height:auto; }}

.cdcols{{ flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr;
  grid-template-rows:1fr 1fr 1.08fr; gap:12px .26in; }}
.cdblock{{ display:flex; flex-direction:column; }}
.cdblock.wide{{ grid-column:1 / -1; }}
.cdblock.wide .tks{{ display:grid; grid-template-columns:1fr 1fr; gap:0 .26in; }}
.tks{{ flex:1; display:flex; flex-direction:column; min-height:0; }}
.cdhead{{ display:flex; align-items:center; gap:8px; border-bottom:2px dotted var(--strong);
  padding-bottom:5px; margin-bottom:6px; }}
.cdhead h2{{ font-family:"Fredoka","Nunito",sans-serif; font-weight:500; font-size:11.5pt;
  margin:0; line-height:1; }}
.cdhead .balloon{{ width:13px; height:16px; }}
.tk{{ display:flex; align-items:flex-end; gap:8px; flex:1 1 auto; min-height:.26in;
  max-height:.4in; border-bottom:1.2px dotted var(--rule); }}
.tktext{{ font-size:8.4pt; padding-bottom:3px; line-height:1.15; }}

.gltable{{ flex:1; display:flex; flex-direction:column; }}
.gl{{ display:grid; grid-template-columns:.22in 1.25fr 1.2fr .24in .24in .24in 1.25fr .72in;
  gap:0 7px; align-items:flex-end; flex:1; min-height:.24in; }}
.gl .idx{{ font-size:7pt; color:var(--faint); padding-bottom:3px; }}
.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:5px; border-bottom:1.6px solid var(--ink); margin-bottom:5px;
  font-weight:800; text-transform:uppercase; letter-spacing:.06em; font-size:6.3pt;
  color:var(--soft); }}
.head .blank, .head span{{ border:0; }}
.totals{{ display:flex; gap:14px; border-top:2px dotted var(--strong); margin-top:8px; padding-top:8px; }}
.tot{{ display:flex; align-items:flex-end; gap:7px; }}
.totlbl{{ font-weight:800; text-transform:uppercase; letter-spacing:.07em; font-size:6.8pt;
  color:var(--soft); padding-bottom:3px; }}

.act{{ display:grid; grid-template-columns:1.35fr .46in 1.5fr .95in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.27in; max-height:.46in; }}
.energy{{ display:flex; gap:4px; justify-content:flex-end; padding-bottom:1px; }}
.energy .box{{ border-radius:50%; width:9px; height:9px; }}
.energy.lblhead{{ display:block; text-align:right; }}

.ml{{ display:grid; grid-template-columns:1fr .72in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.25in; max-height:.5in; }}
.bag{{ display:grid; grid-template-columns:12px 1fr .46in .46in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.25in; max-height:.46in; }}
.bl{{ display:grid; grid-template-columns:1.25fr .6in .6in .24in; gap:0 9px; align-items:flex-end;
  flex:1 1 auto; min-height:.25in; max-height:.46in; }}
.bl .cat{{ font-size:8.4pt; padding-bottom:3px; }}
.bl.total{{ flex:none; border-top:2px dotted var(--strong); margin-top:5px; padding-top:6px; }}
.bl.total .cat{{ font-weight:800; text-transform:uppercase; letter-spacing:.07em; font-size:7.4pt; }}
.sh{{ display:grid; grid-template-columns:12px 1fr .7in; gap:0 7px; align-items:flex-end;
  flex:1 1 auto; min-height:.24in; max-height:.4in; }}
.shtext{{ font-size:8pt; padding-bottom:3px; }}
.hr{{ display:grid; grid-template-columns:1fr 1.4fr .24in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.26in; max-height:.42in; }}
.gf{{ display:grid; grid-template-columns:.22in 1.5fr .72in .24in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.25in; max-height:.42in; }}
.gf .idx{{ font-size:7pt; color:var(--faint); padding-bottom:3px; }}

.alert{{ border:1.8px solid var(--a1); border-radius:10px; padding:9px 11px 11px;
  display:flex; flex-direction:column; flex:1 1 auto; }}
.al{{ display:grid; grid-template-columns:.72in 1fr .24in; gap:0 8px; align-items:flex-end;
  flex:1 1 auto; min-height:.25in; max-height:.4in; }}
.alertnote{{ display:flex; align-items:flex-end; gap:7px; border-top:1.4px dotted var(--a1);
  margin-top:6px; padding-top:7px; }}
.alertnote span{{ font-size:7.6pt; font-weight:700; color:var(--a1); padding-bottom:1px; }}

.beats{{ display:flex; flex-direction:column; flex:1 1 auto; padding-bottom:6px; }}
.beat{{ display:grid; grid-template-columns:.28in 1fr .46in; gap:0 9px; align-items:center;
  flex:1 1 auto; min-height:.42in; border-bottom:1.2px dotted var(--rule); }}
.bnum{{ font-family:"Fredoka","Nunito",sans-serif; font-weight:600; font-size:10pt; color:#fff;
  width:.24in; height:.24in; border-radius:50%; display:flex; align-items:center;
  justify-content:center; }}
.bnum.b1{{ background:var(--a1); }} .bnum.b2{{ background:var(--a2); color:var(--ink); }}
.bnum.b3{{ background:var(--a3); }} .bnum.b4{{ background:var(--a4); }}
.bnum.b5{{ background:var(--a5); }} .bnum.b6{{ background:var(--ink); }}
.btext b{{ display:block; font-size:8.6pt; font-weight:700; line-height:1.1; }}
.btext span{{ display:block; font-size:7.2pt; color:var(--soft); line-height:1.2; }}
.rems{{ display:flex; flex-direction:column; flex:1 1 auto; }}
.rem{{ display:flex; align-items:flex-end; gap:8px; flex:1 1 auto; min-height:.25in; max-height:.38in; }}
.rem span{{ font-size:7.7pt; color:var(--soft); padding-bottom:2px; line-height:1.1; }}
.shots{{ display:flex; flex-direction:column; flex:1 1 auto; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:2.4px dotted var(--strong); margin-top:9px; padding-top:7px; }}
.foot .mark{{ font-family:"Fredoka","Nunito",sans-serif; font-weight:400; font-size:8pt;
  color:var(--faint); }}
.dotrow{{ display:flex; gap:5px; }}
.dotrow i{{ width:7px; height:7px; border-radius:50%; }}
.dotrow i:nth-child(1){{ background:var(--a1); }} .dotrow i:nth-child(2){{ background:var(--a2); }}
.dotrow i:nth-child(3){{ background:var(--a3); }} .dotrow i:nth-child(4){{ background:var(--a4); }}
.dotrow i:nth-child(5){{ background:var(--a5); }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-kids.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Confetti Club Kids Party Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-kids-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"kids-party-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"kids-{name}")
        fill_pdf = os.path.join(DIST, f"kids-party-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         COLORWAYS[colorway], pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Confetti Club &nbsp;&middot;&nbsp; Kids&#8217; Party Kit",
    title="Start<br><em>here.</em>",
    lede="Thank you. Nine pages for a children&#8217;s party: who is coming, what they cannot eat, "
         "what happens in which order, and who is doing it.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Allergy page", "a list you can hand to every grown-up helping"),
           ("This guide", "typing, printing and the licence in one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "like GoodNotes or Xodo. Click a line and type; tick the boxes with a click. "
        "<b>Save a copy first</b> &mdash; then the guest list stays editable as the replies come in.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Print the guest list and "
        "the party-day plan even if you fill everything else on screen: on the day you want paper "
        "by the door, with the pick-up times and the phone numbers on it.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "Margins: none / borderless, portrait",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="If anything looks off",
    s5p="Message me through Etsy and I will sort it the same day. And if the party went well, a "
        "review helps this small shop more than you would think.",
    license="Personal use only. Print as many copies as you like for your own parties. Please do not "
            "resell, share or redistribute the files. Fonts: Fredoka and Nunito (SIL Open Font License).",
    mark="Two hours. Nine pages. No tears.")

PAGE_NAMES = ["Whose party is it", "Four weeks to go", "Who is coming", "Games &amp; chaos",
              "Cake, snacks &amp; allergies", "Goodie bags &amp; the bill", "The shopping",
              "How the day runs", "Thank yous"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["confetti"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Fredoka","Nunito",sans-serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Nunito",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Nunito"'),
                 ("--s1:#f2a65a", "--s1:" + C["a1"]), ("--s2:#ee6c4d", "--s2:" + C["a2"]),
                 ("--s3:#c43e7a", "--s3:" + C["a3"]), ("--s4:#4b2e83", "--s4:" + C["a5"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"])]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-kids.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    path = os.path.join(work, "readme-kids.html")
    open(path, "w", encoding="utf-8").write(tpl)
    B.to_pdf(path, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-kids.css")
    doc = pymupdf.open(os.path.join(DIST, "kids-party-planner-letter-confetti-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"kids-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["confetti"]
    over = (
        "<style>"
        "h1{font-family:'Fredoka','Nunito',sans-serif;font-weight:600;letter-spacing:-.01em}"
        f"h1 em{{font-style:normal;color:{C['a1']}}}"
        "body{font-family:'Nunito',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}} .eyebrow{{color:{C['a1']};font-family:'Nunito';font-weight:800}}"
        f".rule{{background:linear-gradient(90deg,{C['a1']} 0 20%,{C['a2']} 20% 40%,{C['a3']} 40% 60%,"
        f"{C['a4']} 60% 80%,{C['a5']} 80% 100%)}}"
        f".badge{{border-color:{C['a5']};color:{C['a5']};font-family:'Nunito';font-weight:800;border-radius:999px}}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:14px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(42,33,64,.16);border-radius:6px}"
        ".tile img{height:548px;width:auto;display:block;border-radius:6px}"
        f".tilecap{{font-family:'Nunito',Arial,sans-serif;font-weight:800;text-transform:uppercase;"
        f"letter-spacing:.09em;font-size:20px;color:{C['soft']};padding:11px 2px 0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; Fillable PDF</span>
          <h1>Two hours.<br><em>No tears.</em></h1>
          <span class="rule"></span>
          <p class="sub">A kids&#8217; birthday party, planned properly: guest list with pick-up
          times, an allergy page, goodie bags, games with an energy plan, and a party-day running
          order that fits in two hours.</p>
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
      <span class="eyebrow">The two pages that save the day</span>
      <h1>Allergies.<br><em>Pick-ups.</em></h1>
      <p class="sub">Every child with a grown-up, a phone number and a pick-up time. Every allergy
      on one page you can hand to whoever is helping.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[2]}" style="height:1040px"><img src="{imgs[4]}" style="height:1040px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#fdf3f7", "100px", "84px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#f2f7ff", "100px", "76px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-kids-{name}.html")
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
        BD.package(DIST, "Confetti-Club-Kids-Party-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building kids' party kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "kids-party-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "confetti", embed_fonts=False))
    print("Wrote kids-party-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Confetti-Club-Kids-Party-Kit")

if __name__ == "__main__":
    main()
