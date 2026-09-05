#!/usr/bin/env python3
"""Build the Thirty-First Halloween party planning kit.

Nine pages for the night itself and the four weeks before it: costumes and the
contest, a themed menu with the safety lines that matter, decor room by room, a
pumpkin plan with real carving timing, trick-or-treat logistics, an hour by hour
run of show, and the page you fill in on the first of November.

    python3 halloween.py                  # every size / colourway
    python3 halloween.py --only letter-spooky
    python3 halloween.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, math, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-halloween")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Anton"
          "&family=Rubik:ital,wght@0,400;0,500;0,600;1,400&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="38pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="37pt"),
}

COLORWAYS = {
    # pumpkin = the night itself, poison = food and drink, violet = the dark bits.
    # white paper on purpose: a black page eats a toner cartridge.
    "spooky": dict(ink="#16151a", soft="#56525e", faint="#918c9c", rule="#e6e2ea",
                   strong="#c7c1d0", pumpkin="#e4622a", poison="#7ba428", violet="#6b3fa0"),
    "mono":   dict(ink="#1c1b1f", soft="#5b5960", faint="#94919a", rule="#e6e5e8",
                   strong="#c6c4c9", pumpkin="#3a383f", poison="#8b8891", violet="#66636d"),
}

PAGES = 9
MARK = "One night. Plan it like a show."

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

def web():
    """A cobweb corner, drawn rather than clip-arted: three arcs on six radials."""
    cx, cy, spokes = 132, -6, 6
    lines = []
    for i in range(spokes + 1):
        a = math.radians(96 + i * (78 / spokes))
        lines.append(f'<line x1="{cx}" y1="{cy}" x2="{cx + 128 * math.cos(a):.1f}" '
                     f'y2="{cy + 128 * math.sin(a):.1f}"/>')
    for r in (44, 78, 112):
        pts = []
        for i in range(spokes + 1):
            a = math.radians(96 + i * (78 / spokes))
            pts.append(f'{cx + r * math.cos(a):.1f},{cy + r * math.sin(a):.1f}')
        lines.append(f'<polyline points="{" ".join(pts)}"/>')
    return (f'<svg class="web" viewBox="0 0 140 120" aria-hidden="true">'
            f'<g fill="none" stroke="currentColor" stroke-width="1">{"".join(lines)}</g></svg>')

def scare(prefix, n=5):
    return ('<span class="scare">' +
            "".join(f'{check(f"{prefix}_{i}", "pumpkin")}' for i in range(1, n + 1)) +
            '</span>')

def sheet(n, title, kicker, body):
    meta = (f'<div class="mini">{field("Date", f"h{n}_date", "w2", "9")}</div>' if n > 1 else '')
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{web()}{meta}<span class="pageno">{n}<i>/{PAGES}</i></span></div>
  </header>
  <div class="rules"><span></span><span class="pump"></span></div>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="bats">&#9679;&nbsp;&#9679;&nbsp;&#9679;</span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    return sheet(1, "Trick,<br>treat, plan.", "Halloween kit &middot; at a glance",
        '<div class="two b46"><section>' +
        sec("The night", "", "pumpkin") +
        field("Party for", "h1_for") + field("Date", "h1_date_main") +
        '<div class="split2">' + field("Doors", "h1_start", "w3") +
        field("Ends", "h1_end", "w3") + '</div>' +
        field("Where", "h1_where") + field("Theme", "h1_theme") +
        field("Dress code", "h1_dress") +
        '<div class="split2">' + field("Adults", "h1_adults", "w3") +
        field("Kids", "h1_kids", "w3") + '</div>' +
        field("Budget", "h1_budget") + field("RSVP by", "h1_rsvp") +
        field("Playlist by", "h1_playlist") + field("Who is helping", "h1_help") +
        sec("Handed to someone else", "Nobody hosts and answers the door", "violet") +
        "".join(f'<div class="wl">{check(f"h1_job_{i}", "violet")}'
                f'{blank(f"h1_job_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        '<div class="scarebox">' +
        sec("Scare level", "Decide it now; everything follows", "pumpkin") +
        f'<div class="scarerow">{scare("h1_scare")}</div>' +
        '<div class="scareends"><span>Giggles and glitter</span><span>Genuinely frightening</span></div>' +
        f'<div class="wl">{blank("h1_scare_note", "grow", "10")}</div>' +
        '</div>' +
        sec("The one image people should remember") +
        "".join(f'<div class="wl">{blank(f"h1_image_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        sec("Countdown", "", "violet") +
        '<div class="cdgrid">' +
        "".join(f'<div class="cd">{check(f"h1_cd_{i}", "violet")}'
                f'<span class="cdlbl">{lab}</span></div>'
                for i, lab in enumerate(["4 weeks", "2 weeks", "1 week", "The eve",
                                         "31 October", "1 November"], start=1)) +
        '</div>' +
        sec("Notes") +
        "".join(f'<div class="wl">{blank(f"h1_note_{i}", "grow", "10")}</div>' for i in range(1, 7)) +
        '</section></div>')

COUNTDOWN = [
    ("Four weeks out", "a", ["Set the date, the budget and the scare level",
                             "Send the invitations &mdash; costumes need notice",
                             "Order or start making costumes",
                             "Book anything that gets booked out in October",
                             "Decide: party, trick-or-treat, or both"]),
    ("Two weeks out", "b", ["Buy decorations before the good ones go",
                            "Plan the menu and the drinks",
                            "Buy the sweets &mdash; and hide them from yourself",
                            "Test the lights, the fog machine, the speaker",
                            "Ask about allergies on the RSVP"]),
    ("One week out", "c", ["Chase the guests who have not replied",
                           "Buy pumpkins &mdash; not earlier, they collapse",
                           "Batteries, tea lights, LED candles",
                           "Print the playlist and the games",
                           "Clear a room for coats and one for quiet"]),
    ("The night before", "d", ["Carve the pumpkins", "Chill the drinks, make ice",
                               "Hang everything that is not food",
                               "Charge the camera and the speaker",
                               "Lay out costumes and the make-up"]),
    ("31 October", "e", ["Food out late, so it is not warm and sad",
                         "Light the pumpkins at dusk",
                         "Porch light on means sweets, off means done",
                         "One person on the door, one on the camera",
                         "Photos before the make-up melts"]),
]

def page_2():
    blocks = []
    for bi, (title, tone, tasks) in enumerate(COUNTDOWN, start=1):
        wide = " wide" if bi == 5 else ""
        rows = "".join(f'<div class="tk">{check(f"h2_b{bi}_t{ti}", tone)}'
                       f'<span class="tktext">{t}</span></div>'
                       for ti, t in enumerate(tasks, start=1))
        rows += "".join(f'<div class="tk">{check(f"h2_b{bi}_x{i}", tone)}'
                        f'{blank(f"h2_b{bi}_l{i}", "grow", "10")}</div>' for i in (1, 2))
        blocks.append(f'<section class="cdblock{wide}"><div class="cdhead {tone}">'
                      f'<b>{title}</b></div><div class="tks">{rows}</div></section>')
    return sheet(2, "Four weeks<br>to the night.", "Halloween kit &middot; countdown",
                 f'<div class="cdcols">{"".join(blocks)}</div>')

def page_3():
    head = ('<div class="gl head"><span>#</span><span>Name</span><span>Coming as</span>'
            '<span class="c">Inv</span><span class="c">Yes</span><span class="c">No</span>'
            '<span class="c">+</span><span>Allergies &amp; notes</span></div>')
    rows = "".join(
        f'<div class="gl"><span class="idx">{i:02d}</span>{blank(f"h3_name_{i}", "", "10")}'
        f'{blank(f"h3_as_{i}", "", "10")}<span class="c">{check(f"h3_inv_{i}", "violet")}</span>'
        f'<span class="c">{check(f"h3_yes_{i}", "poison")}</span>'
        f'<span class="c">{check(f"h3_no_{i}")}</span>'
        f'{blank(f"h3_plus_{i}", "c", "9")}{blank(f"h3_notes_{i}", "", "9.5")}</div>'
        for i in range(1, 23))
    totals = ('<div class="totals">' +
              "".join(f'<div class="tot">{blank(f"h3_t_{k}", "num", "11")}'
                      f'<span class="totlbl">{v}</span></div>'
                      for k, v in [("inv", "Invited"), ("yes", "Coming"), ("no", "Can&#8217;t"),
                                   ("wait", "Waiting"), ("kids", "Kids")]) + '</div>')
    return sheet(3, "Who is<br>coming as what.", "Halloween kit &middot; guest list",
                 sec("Guests", "The costume column stops two people arriving as the same thing",
                     "pumpkin") + f'<div class="gltable">{head}{rows}</div>{totals}')

CATEGORIES = ["Best costume", "Funniest", "Most frightening", "Best homemade",
              "Best group", "Best last-minute effort"]

def page_4():
    house = "".join(
        f'<div class="cs">{blank(f"h4_who_{i}", "", "10.5")}{blank(f"h4_as_{i}", "", "10.5")}'
        f'<span class="c">{check(f"h4_have_{i}", "poison")}</span>'
        f'{blank(f"h4_missing_{i}", "", "10")}</div>' for i in range(1, 8))
    cats = "".join(
        f'<div class="cat"><span class="cattext">{c}</span>{blank(f"h4_cat_{i}", "", "10.5")}'
        f'{blank(f"h4_prize_{i}", "w2", "10")}</div>'
        for i, c in enumerate(CATEGORIES, start=1))
    return sheet(4, "Costumes<br>&amp; prizes.", "Halloween kit &middot; who is wearing what",
        '<div class="two b46"><section>' +
        sec("The household", "What is bought, what is still missing", "pumpkin") +
        '<div class="cs head"><span>Who</span><span>Going as</span><span class="c">Got it</span>'
        '<span>Still needed</span></div>' + house +
        '<div class="gap"></div>' +
        sec("Make-up and hair", "Who does it, and how long it takes") +
        "".join(f'<div class="wl">{blank(f"h4_makeup_{i}", "grow", "10.5")}</div>'
                for i in (1, 2, 3)) +
        sec("Repair kit by the mirror", "", "poison") +
        "".join(f'<div class="wl">{check(f"h4_fix_{i}", "poison")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Safety pins, tape, a needle and thread",
                                       "Wipes, and the make-up used for touch-ups",
                                       "Plasters &mdash; the shoes are always the problem",
                                       "Spare tights, socks, a hair grip or six"], start=1)) +
        sec("Test the whole costume once", "In a mirror, sitting down", "violet") +
        f'<div class="wl">{check("h4_test", "violet")}'
        f'{blank("h4_test_when", "grow", "10.5")}</div>' +
        '</section><section>' +
        sec("The contest", "Announce the categories on the invitation", "pumpkin") +
        '<div class="cat head"><span>Category</span><span>Winner</span><span class="w2">Prize</span></div>' +
        cats +
        '<div class="gap"></div>' +
        sec("Judging", "Decide before the drinks") +
        field("Judged by", "h4_judge") + field("Announced at", "h4_announce", "w2") +
        field("Prizes bought by", "h4_prizes_by") +
        sec("Photo plan", "The costumes are the reason people came", "violet") +
        "".join(f'<div class="wl">{check(f"h4_photo_{i}", "violet")}'
                f'{blank(f"h4_photo_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("For whoever turns up in normal clothes") +
        "".join(f'<div class="wl">{check(f"h4_spare_{i}", "pumpkin")}'
                f'{blank(f"h4_spare_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_5():
    def rows(prefix, n):
        return "".join(f'<div class="ml">{blank(f"{prefix}_{i}", "", "10.5")}'
                       f'{blank(f"{prefix}_who_{i}", "w2", "9.5")}</div>' for i in range(1, n + 1))
    return sheet(5, "Food that<br>looks wrong.", "Halloween kit &middot; menu &amp; drinks",
        '<div class="two b46"><section>' +
        sec("Savoury", "Name it on a card &mdash; half the fun is the label", "poison") +
        '<div class="ml head"><span>What it is</span><span class="w2">Who makes it</span></div>' +
        rows("h5_sav", 7) +
        '<div class="gap"></div>' +
        sec("Sweet", "", "poison") +
        '<div class="ml head"><span>What it is</span><span class="w2">Who makes it</span></div>' +
        rows("h5_swt", 6) +
        '<div class="gap"></div>' +
        sec("Sweets for the door", "Count on more children than last year") +
        '<div class="split2">' + field("Bags", "h5_bags", "w3") +
        field("Spare bags", "h5_spare", "w3") + '</div>' +
        '</section><section>' +
        sec("Drinks", "One punch bowl saves an hour of pouring", "poison") +
        '<div class="ml head"><span>What</span><span class="w2">How much</span></div>' +
        rows("h5_drink", 6) +
        '<div class="warn">'
        '<b>Two things to get right</b>'
        '<p>Dry ice goes <b>in the bowl around the punch, never in the drink</b>, and never in a '
        'sealed bottle. And if there are children, keep an alcohol-free punch that looks just as '
        'good &mdash; on a night of identical black cups, that matters.</p>'
        '</div>' +
        sec("Allergies", "Copy them from the guest list", "violet") +
        "".join(f'<div class="al">{blank(f"h5_al_who_{i}", "w2", "10")}'
                f'{blank(f"h5_al_what_{i}", "", "10")}'
                f'<span class="c">{check(f"h5_al_ok_{i}", "poison")}</span></div>'
                for i in range(1, 7)) +
        sec("Ice, cups and the bit everyone forgets", "", "pumpkin") +
        "".join(f'<div class="wl">{check(f"h5_kit_{i}", "pumpkin")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["More ice than seems sensible",
                                       "Cups people can tell apart, or a pen to name them",
                                       "Bin bags out early, one for bottles"], start=1)) +
        '</section></div>')

ROOMS = ["Doorway and path", "Hall", "Main room", "Kitchen", "Table", "Bathroom", "Garden"]

def page_6():
    rooms = "".join(
        f'<div class="rm"><span class="rmname">{r}</span>{blank(f"h6_room_{i}", "", "10.5")}'
        f'<span class="c">{check(f"h6_done_{i}", "poison")}</span></div>'
        for i, r in enumerate(ROOMS, start=1))
    return sheet(6, "Dark, but<br>you can see.", "Halloween kit &middot; decor &amp; atmosphere",
        '<div class="two b46"><section>' +
        sec("Room by room", "One idea each is plenty", "pumpkin") +
        '<div class="rm head"><span>Where</span><span>What happens there</span>'
        '<span class="c">Done</span></div>' + rooms +
        '<div class="gap"></div>' +
        sec("Light", "The whole effect is lighting; the rest is props", "violet") +
        "".join(f'<div class="wl">{check(f"h6_light_{i}", "violet")}'
                f'{blank(f"h6_light_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        sec("Outside, where people arrive", "", "poison") +
        "".join(f'<div class="wl">{check(f"h6_out_{i}", "poison")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["The path lit, the step visible",
                                       "A sign if the door is hard to find",
                                       "Nothing that blows over or trips people"], start=1)) +
        '</section><section>' +
        sec("Sound", "") +
        field("Playlist", "h6_playlist") + field("Starts quiet at", "h6_sound_when", "w2") +
        field("Speaker &amp; charger", "h6_speaker") +
        '<div class="gap"></div>' +
        '<div class="warn">'
        '<b>Before anyone arrives</b>'
        '<p>Real candles go where nobody walks and nothing hangs &mdash; LED tea lights everywhere '
        'else, especially inside pumpkins and near costumes. Check that the stairs and the path '
        'are lit even if the rest is dark, and put the breakables away rather than around.</p>'
        '</div>' +
        sec("Put away before the night", "", "violet") +
        "".join(f'<div class="wl">{check(f"h6_away_{i}", "violet")}'
                f'{blank(f"h6_away_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        sec("Anything with a plug or a fog button") +
        "".join(f'<div class="wl">{check(f"h6_rig_{i}", "poison")}'
                f'{blank(f"h6_rig_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("The entrance", "The first ten seconds do most of the work", "pumpkin") +
        "".join(f'<div class="wl">{blank(f"h6_entrance_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_7():
    plans = "".join(
        f'<div class="pk"><span class="pknum">{i}</span>{blank(f"h7_who_{i}", "", "10.5")}'
        f'{blank(f"h7_design_{i}", "", "10.5")}'
        f'<span class="c">{check(f"h7_carved_{i}", "pumpkin")}</span>'
        f'{blank(f"h7_where_{i}", "w2", "10")}</div>' for i in range(1, 11))
    return sheet(7, "Pumpkins.", "Halloween kit &middot; carve them late, not early",
        '<div class="two b46"><section>' +
        sec("The plan", "Who carves what, and where it ends up", "pumpkin") +
        '<div class="pk head"><span class="pknum">#</span><span>Whose</span><span>Design</span>'
        '<span class="c">Cut</span><span class="w2">Goes</span></div>' + plans +
        '<div class="gap"></div>' +
        '<div class="split2">' + field("Buy on", "h7_buy", "w2") +
        field("Carve on", "h7_carve", "w2") + '</div>' +
        '<span class="footnote">Carved pumpkins last about three days indoors and about five '
        'outside in the cold. Carving on the 28th is early. Carving on the 30th is right.</span>' +
        sec("If nobody wants a knife near it", "", "poison") +
        "".join(f'<div class="wl">{check(f"h7_alt_{i}", "poison")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Painted instead of cut &mdash; lasts a fortnight",
                                       "Drilled dots, a light behind them",
                                       "Three stacked, tallest at the back"], start=1)) +
        '</section><section>' +
        sec("What you need", "", "poison") +
        "".join(f'<div class="wl">{check(f"h7_kit_{i}", "poison")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Serrated knife or a carving saw", "Big spoon or scoop",
                                       "Marker for drawing the face on first",
                                       "Newspaper, and a bin bag ready",
                                       "LED tea lights, not real ones"], start=1)) +
        "".join(f'<div class="wl">{check(f"h7_kitx_{i}", "poison")}'
                f'{blank(f"h7_kit_t_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '<div class="gap"></div>' +
        sec("The insides", "Nobody plans this and everybody regrets it") +
        f'<div class="wl">{check("h7_seeds", "poison")}'
        f'<span class="rtext">Seeds kept, rinsed and roasted</span></div>' +
        f'<div class="wl">{check("h7_compost", "poison")}'
        f'<span class="rtext">The rest into the garden or the food waste</span></div>' +
        sec("Sketch the faces here", "You are copying it onto a curve") +
        '<div class="sketch">' + blank("h7_sketch", "grow", "10") + '</div>' +
        '</section></div>')

BEATS = [("Set up finished", "Nothing left to hang after the first guest"),
         ("Doors, drinks, photographs", "The costumes are freshest now"),
         ("Food out", "Later than feels right"),
         ("Games, or the contest", "One thing, well timed"),
         ("Prizes announced", "Before anyone starts leaving"),
         ("Music up, lights lower", "The party either lifts here or ends here"),
         ("Last drinks, taxis, coats", "Say the time out loud")]

def page_8():
    rows = "".join(
        f'<div class="rs">{blank(f"h8_time_{i}", "w3", "10")}{blank(f"h8_what_{i}", "", "10.5")}'
        f'{blank(f"h8_who_{i}", "w2", "10")}</div>' for i in range(1, 13))
    beats = "".join(
        f'<div class="beat"><span class="bnum">{i}</span>'
        f'<div class="btext"><b>{t}</b><span>{d}</span></div>'
        f'{blank(f"h8_beat_{i}", "w3", "10")}</div>'
        for i, (t, d) in enumerate(BEATS, start=1))
    tot = "".join(f'<div class="wl">{check(f"h8_tot_{i}", "violet")}'
                  f'<span class="rtext">{t}</span></div>'
                  for i, t in enumerate([
                      "Porch light on, bowl filled, path lit",
                      "Someone at home while the others walk",
                      "Torch, phone, and a bag that will not split",
                      "Route agreed, and the time you turn back",
                      "Check the sweets before the small ones eat them"], start=1))
    return sheet(8, "How the<br>night runs.", "Halloween kit &middot; run of show",
        '<div class="two b8"><section>' +
        sec("Hour by hour", "Set-up at the top, taxis at the bottom", "pumpkin") +
        '<div class="rs head"><span class="w3">Time</span><span>What happens</span>'
        '<span class="w2">Who is on it</span></div>' + rows +
        '</section><section>' +
        sec("Seven beats", "Write the time next to each", "violet") +
        f'<div class="beats">{beats}</div>' +
        sec("If there is trick-or-treating too", "", "poison") +
        f'<div class="tots">{tot}</div>' +
        '</section></div>')

def page_9():
    return sheet(9, "The first<br>of November.", "Halloween kit &middot; while it is fresh",
        '<div class="two"><section>' +
        sec("What worked", "Write it now; next October you will not remember", "poison") +
        "".join(f'<div class="wl">{blank(f"h9_worked_{i}", "grow", "10.5")}</div>'
                for i in range(1, 6)) +
        sec("What to do differently", "", "violet") +
        "".join(f'<div class="wl">{blank(f"h9_change_{i}", "grow", "10.5")}</div>'
                for i in range(1, 6)) +
        sec("The costumes: keep, mend or pass on", "", "pumpkin") +
        "".join(f'<div class="cs2">{blank(f"h9_cos_{i}", "", "10.5")}'
                f'{blank(f"h9_cos_do_{i}", "w2", "10")}</div>' for i in range(1, 5)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>Today, not next year</b>'
        '<p>Decorations, costumes and sweets are half price from today. Buy next year&#8217;s '
        'this afternoon, put it in one labelled box, and write on the lid what is inside. '
        'It is the single cheapest thing on this page.</p>'
        '</div>' +
        sec("Bought in the sales, in the box", "", "pumpkin") +
        "".join(f'<div class="wl">{check(f"h9_box_{i}", "pumpkin")}'
                f'{blank(f"h9_box_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        sec("Photos to send to people", "", "poison") +
        "".join(f'<div class="wl">{blank(f"h9_photo_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Where the box lives") +
        f'<div class="wl">{blank("h9_boxwhere", "grow", "10.5")}</div>' +
        sec("Next year, one line", "Worth ten written in September", "violet") +
        "".join(f'<div class="wl">{blank(f"h9_next_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --pumpkin:{C["pumpkin"]}; --poison:{C["poison"]}; --violet:{C["violet"]};
  --backdrop:#eceaf0;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#141317; }} }}
:root[data-theme="dark"]{{ --backdrop:#141317; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Rubik","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(22,21,26,.16);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:500; text-transform:uppercase; letter-spacing:.16em; font-size:7.6pt;
  color:var(--soft); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in; }}
.mast h1{{ font-family:"Anton","Rubik",sans-serif; font-weight:400; font-size:{S["display"]};
  line-height:.9; margin:8px 0 0; text-transform:uppercase; letter-spacing:.005em; }}
.mastright{{ display:flex; align-items:flex-end; gap:13px; position:relative; }}
.web{{ position:absolute; right:-6px; top:-58px; width:1.35in; height:1.15in;
  color:var(--strong); opacity:.85; }}
.pageno{{ font-family:"Anton","Rubik",sans-serif; font-size:15pt; color:var(--pumpkin); }}
.pageno i{{ font-style:normal; font-size:9pt; color:var(--faint); }}
.mini{{ display:flex; gap:10px; padding-bottom:3px; }}
.mini .fr{{ height:.22in; }}
.rules{{ display:flex; flex-direction:column; gap:2px; padding-top:9px; flex:none; }}
.rules span{{ height:1.4px; background:var(--ink); }}
.rules span.pump{{ height:3px; background:var(--pumpkin); }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:13px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.08fr 1fr; }}
.two.b8{{ grid-template-columns:1.25fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}
.gap{{ height:13px; flex:none; }}

.sec{{ display:flex; align-items:center; gap:9px; padding:7px 0 6px; overflow:hidden;
  flex:none; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-family:"Anton","Rubik",sans-serif; font-weight:400; text-transform:uppercase;
  letter-spacing:.05em; font-size:10.5pt; color:var(--ink); white-space:nowrap; }}
.lbl.pumpkin{{ color:var(--pumpkin); }} .lbl.poison{{ color:var(--poison); }}
.lbl.violet{{ color:var(--violet); }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.52in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.3px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.85in; }} .blank.w3{{ flex:none; width:.5in; }}
.blank.num{{ flex:none; width:.6in; }} .blank.c{{ flex:none; width:.2in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

.box{{ width:11px; height:11px; border:1.5px solid var(--strong); flex:none; margin-bottom:3px; }}
.box.pumpkin{{ border-color:var(--pumpkin); }} .box.poison{{ border-color:var(--poison); }}
.box.violet{{ border-color:var(--violet); }}
.box.a{{ border-color:var(--violet); }} .box.b{{ border-color:var(--poison); }}
.box.c{{ border-color:var(--pumpkin); }} .box.d{{ border-color:var(--soft); }}
.box.e{{ border-color:var(--ink); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.28in; max-height:.54in; }}
.cs2{{ display:grid; grid-template-columns:minmax(0,1fr) .85in; gap:0 9px; align-items:flex-end;
  flex:1 1 auto; min-height:.28in; max-height:.5in; }}
.rtext{{ font-size:10pt; padding-bottom:3px; line-height:1.15; }}
.footnote{{ font-size:8.4pt; color:var(--faint); line-height:1.4; padding-top:8px; display:block; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:5px; border-bottom:1.6px solid var(--ink); margin-bottom:5px;
  font-weight:500; text-transform:uppercase; letter-spacing:.07em; font-size:7.2pt;
  color:var(--soft); }}
.head span, .head .blank{{ border:0; }}

.warn{{ border:1.6px solid var(--violet); border-radius:2px; padding:11px 13px; margin:12px 0;
  flex:none; }}
.warn b{{ font-size:9.6pt; }}
.warn p{{ margin:5px 0 0; font-size:9.4pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.scarebox{{ border:1.6px solid var(--pumpkin); border-radius:2px; padding:10px 13px 11px;
  margin-bottom:12px; flex:none; }}
.scarerow{{ padding:3px 0 5px; }}
.scare{{ display:flex; gap:9px; }}
.scare .box{{ width:16px; height:16px; margin-bottom:0; border-radius:2px; }}
.scareends{{ display:flex; justify-content:space-between; padding-bottom:6px; }}
.scareends span{{ font-size:8pt; color:var(--faint); }}
.cdgrid{{ display:grid; grid-template-columns:1fr 1fr; gap:5px 14px; padding:2px 0 8px; flex:none; }}
.cd{{ display:flex; align-items:flex-end; gap:8px; }}
.cdlbl{{ font-size:9pt; color:var(--soft); padding-bottom:1px; }}

/* page 2 ------------------------------------------------------------------ */
.cdcols{{ flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr;
  grid-template-rows:1fr 1fr 1.06fr; gap:13px .3in; }}
.cdblock{{ display:flex; flex-direction:column; min-width:0; }}
.cdblock.wide{{ grid-column:1 / -1; }}
.cdblock.wide .tks{{ display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.tks{{ flex:1; display:flex; flex-direction:column; min-height:0; }}
.cdhead{{ border-bottom:2px solid var(--ink); padding-bottom:5px; margin-bottom:6px; }}
.cdhead b{{ font-family:"Anton","Rubik",sans-serif; font-weight:400; text-transform:uppercase;
  font-size:12pt; letter-spacing:.03em; }}
.cdhead.a{{ border-bottom-color:var(--violet); }} .cdhead.a b{{ color:var(--violet); }}
.cdhead.b{{ border-bottom-color:var(--poison); }} .cdhead.b b{{ color:var(--poison); }}
.cdhead.c{{ border-bottom-color:var(--pumpkin); }} .cdhead.c b{{ color:var(--pumpkin); }}
.cdhead.d{{ border-bottom-color:var(--soft); }}
.tk{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.27in;
  max-height:.4in; border-bottom:1px solid var(--rule); }}
.tktext{{ font-size:9.4pt; padding-bottom:3px; line-height:1.15; }}

/* page 3 ------------------------------------------------------------------ */
.gltable{{ flex:1; display:flex; flex-direction:column; }}
.gl{{ display:grid; grid-template-columns:.22in 1.4fr 1.25fr .24in .24in .24in .24in 1.5fr;
  gap:0 7px; align-items:flex-end; flex:1; min-height:.24in; }}
.gl .idx{{ font-size:7pt; color:var(--faint); padding-bottom:3px; }}
.totals{{ display:flex; gap:16px; border-top:2px solid var(--ink); margin-top:8px; padding-top:8px; }}
.tot{{ display:flex; align-items:flex-end; gap:8px; }}
.totlbl{{ font-family:"Anton","Rubik",sans-serif; text-transform:uppercase; font-size:8.5pt;
  color:var(--soft); padding-bottom:3px; letter-spacing:.04em; }}

/* pages 4 to 8 ------------------------------------------------------------ */
.cs{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.1fr) .28in minmax(0,1fr);
  gap:0 9px; align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.46in; }}
.cat{{ display:grid; grid-template-columns:minmax(0,1.15fr) minmax(0,1fr) .85in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.48in; }}
.cattext{{ font-size:9.4pt; padding-bottom:4px; line-height:1.15; }}
.ml{{ display:grid; grid-template-columns:minmax(0,1fr) .85in; gap:0 9px; align-items:flex-end;
  flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.al{{ display:grid; grid-template-columns:.85in minmax(0,1fr) .24in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.rm{{ display:grid; grid-template-columns:1.15fr minmax(0,1.5fr) .28in; gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.48in; }}
.rmname{{ font-size:9.8pt; padding-bottom:4px; }}
.pk{{ display:grid; grid-template-columns:.2in minmax(0,1fr) minmax(0,1.2fr) .28in .85in;
  gap:0 9px; align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.46in; }}
.pknum{{ font-family:"Anton","Rubik",sans-serif; font-size:10pt; color:var(--faint);
  padding-bottom:3px; }}
.sketch{{ flex:1 1 auto; min-height:1.1in; display:flex; }}
.sketch .blank{{ border:1.6px dashed var(--strong); border-radius:3px; height:auto; }}
.rs{{ display:grid; grid-template-columns:.5in minmax(0,1fr) .85in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.46in; }}
.beats{{ display:flex; flex-direction:column; flex:1 1 auto; padding-bottom:6px; }}
.beat{{ display:grid; grid-template-columns:.26in minmax(0,1fr) .5in; gap:0 9px;
  align-items:center; flex:1 1 auto; min-height:.4in; max-height:.56in;
  border-bottom:1px solid var(--rule); }}
.bnum{{ font-family:"Anton","Rubik",sans-serif; font-size:11pt; color:var(--pumpkin); }}
.btext b{{ display:block; font-size:9.6pt; font-weight:500; line-height:1.15; }}
.btext span{{ display:block; font-size:8.2pt; color:var(--faint); line-height:1.2; }}
.tots{{ display:flex; flex-direction:column; flex:1 1 auto; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.4px solid var(--ink); margin-top:10px; padding-top:8px; }}
.foot .mark{{ font-family:"Anton","Rubik",sans-serif; text-transform:uppercase; font-size:8.5pt;
  color:var(--faint); letter-spacing:.06em; }}
.bats{{ font-size:6pt; color:var(--pumpkin); letter-spacing:.1em; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-halloween.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Thirty-First Halloween Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-halloween-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"halloween-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"halloween-{name}")
        fill_pdf = os.path.join(DIST, f"halloween-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["pumpkin"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Thirty-First &nbsp;&middot;&nbsp; Halloween party kit",
    title="Start<br><em>here.</em>",
    lede="Nine pages for the thirty-first: four weeks of countdown, costumes and the contest, "
         "food that looks wrong, pumpkins carved at the right time, and an hour-by-hour plan "
         "for the night itself.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Page 2 is the countdown", "start there if the thirty-first is close"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. Tick the boxes with a click. <b>Save a copy first</b> and keep it as this "
        "year&#8217;s file &mdash; next October it is a head start rather than a blank page.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Print page 3 and page "
        "8 whatever else you do: the guest list wants a pen at the door, and the run of show wants "
        "to be on the fridge where everyone helping can read it.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "The pages are white on purpose &mdash; a black background eats a toner cartridge",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="Two safety lines that are in the kit",
    s5p="They are on the pages too, but they are worth repeating: dry ice goes in the bowl "
        "<b>around</b> the punch, never in the drink and never in a sealed bottle; and real "
        "candles go where nothing hangs and nobody walks &mdash; LED tea lights inside pumpkins "
        "and anywhere near costumes.",
    license="Personal use only. Print as many copies as you like for your own party. Please do not "
            "resell, share or redistribute the files. Fonts: Anton and Rubik (SIL Open Font License).",
    mark="One night. Plan it like a show.")

PAGE_NAMES = ["At a glance", "The countdown", "Guest list", "Costumes &amp; prizes",
              "Menu &amp; drinks", "Decor &amp; light", "Pumpkins", "Run of show",
              "The first of November"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["spooky"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Anton","Rubik",sans-serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Rubik",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Rubik"'),
                 ("--s1:#f2a65a", "--s1:" + C["pumpkin"]), ("--s2:#ee6c4d", "--s2:" + C["poison"]),
                 ("--s3:#c43e7a", "--s3:" + C["violet"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-style:italic;", "font-style:normal;")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-halloween.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    path = os.path.join(work, "readme-halloween.html")
    open(path, "w", encoding="utf-8").write(tpl)
    B.to_pdf(path, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-halloween.css")
    doc = pymupdf.open(os.path.join(DIST, "halloween-planner-letter-spooky-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"halloween-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["spooky"]
    over = (
        "<style>"
        "h1{font-family:'Anton','Rubik',sans-serif;font-weight:400;text-transform:uppercase;"
        "line-height:.92;letter-spacing:.005em}"
        f"h1 em{{font-style:normal;color:{C['pumpkin']}}}"
        "body{font-family:'Rubik',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['pumpkin']};font-family:'Rubik';font-weight:500;letter-spacing:.18em}}"
        f".rule{{background:{C['pumpkin']};height:5px;width:230px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Rubik';font-weight:500;"
        "letter-spacing:.04em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(22,21,26,.18)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Rubik',Arial,sans-serif;font-weight:500;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>Trick,<br>treat,<br><em>plan.</em></h1>
          <span class="rule"></span>
          <p class="sub">A Halloween party kit with a scare-level dial, a costume column on the
          guest list, pumpkins carved on the right date, and an hour-by-hour plan for the
          thirty-first.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated, reusable</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>one night.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The pages that save the night</span>
      <h1>Pumpkins.<br><em>Run of show.</em></h1>
      <p class="sub">Carve on the thirtieth, not the twenty-eighth &mdash; the kit says so and
      explains why. Then seven beats with a time against each, so the party lifts instead of
      drifting.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[6]}" style="height:1170px"><img src="{imgs[7]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#f4f1f6", "100px", "92px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#f2eff4", "100px", "80px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-halloween-{name}.html")
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
        BD.package(DIST, "Thirty-First-Halloween-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building Halloween kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "halloween-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "spooky", embed_fonts=False))
    print("Wrote halloween-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Thirty-First-Halloween-Kit")

if __name__ == "__main__":
    main()
