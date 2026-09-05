#!/usr/bin/env python3
"""Build the One Table Thanksgiving planning kit.

Nine pages for one meal and the people around it: the turkey worked out from
its weight, a who-brings-what list that asks whether the dish needs the oven,
an oven plan for a kitchen that only has one, the shopping, the table, the
three days before, the day itself, and Friday.

    python3 thanksgiving.py                  # every size / colourway
    python3 thanksgiving.py --only letter-harvest
    python3 thanksgiving.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, math, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-thanksgiving")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=DM+Serif+Display:ital@0;1"
          "&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="36pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="35pt"),
}

COLORWAYS = {
    # maple = the food and the oven, sage = the people and the table,
    # cranberry = anything with a clock on it.
    "harvest": dict(ink="#221a15", soft="#5f5449", faint="#978c80", rule="#e9e3db",
                    strong="#cbc2b6", maple="#b4531f", sage="#5f7a4f", cranberry="#8c2f4a"),
    "mono":    dict(ink="#1f1c19", soft="#5c5751", faint="#948e87", rule="#e7e5e2",
                    strong="#c7c3be", maple="#3d3833", sage="#8a857e", cranberry="#3d3833"),
}

PAGES = 9
MARK = "One table. One afternoon."

# The bands are the USDA guides: about 24 hours in the fridge per 4-5 lb, and
# roasting unstuffed at 325 F. They are printed in the kit as a reference.
TURKEY = [
    ("8 &ndash; 12 lb", "3.5 &ndash; 5.5 kg", "2 days", "2&frac34; &ndash; 3 hrs"),
    ("12 &ndash; 16 lb", "5.5 &ndash; 7 kg", "3 days", "3 &ndash; 3&frac34; hrs"),
    ("16 &ndash; 20 lb", "7 &ndash; 9 kg", "4 days", "3&frac34; &ndash; 4&frac12; hrs"),
    ("20 &ndash; 24 lb", "9 &ndash; 11 kg", "5 days", "4&frac12; &ndash; 5 hrs"),
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

def setting(seed=0):
    """A place setting, drawn: a plate between a fork and a knife."""
    cx, cy, r = 70, 62, 34
    parts = [f'<circle cx="{cx}" cy="{cy}" r="{r}"/>',
             f'<circle cx="{cx}" cy="{cy}" r="{r - 7.5}"/>']
    # fork: four tines onto a neck and a handle
    fx = cx - r - 17
    for i in range(4):
        x = fx - 6 + i * 4
        parts.append(f'<line x1="{x}" y1="{cy - 30}" x2="{x}" y2="{cy - 10}"/>')
    parts.append(f'<path d="M{fx - 6} {cy - 10} Q{fx} {cy - 2} {fx + 6} {cy - 10}"/>')
    parts.append(f'<line x1="{fx}" y1="{cy - 4}" x2="{fx}" y2="{cy + 30}"/>')
    # knife: a blade that tapers back into the handle
    kx = cx + r + 17
    parts.append(f'<path d="M{kx} {cy + 30} L{kx} {cy - 12} '
                 f'Q{kx + 5} {cy - 30} {kx - 4} {cy - 30} L{kx - 4} {cy - 6} Z"/>')
    # a folded napkin edge, angled a little differently on every page
    a = math.radians(-8 + (seed % 5) * 4)
    nx, ny = cx, cy + r + 20
    parts.append(f'<path d="M{nx - 30 * math.cos(a):.1f} {ny - 30 * math.sin(a):.1f} '
                 f'L{nx + 30 * math.cos(a):.1f} {ny + 30 * math.sin(a):.1f}"/>')
    return (f'<svg class="setting" viewBox="0 0 140 130" aria-hidden="true">'
            f'<g fill="none" stroke="currentColor" stroke-width="1" '
            f'stroke-linejoin="round">{"".join(parts)}</g></svg>')

def sheet(n, title, kicker, body):
    meta = (f'<div class="mini">{field("Date", f"t{n}_date", "w2", "9")}</div>' if n > 1 else '')
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{setting(n)}{meta}<span class="pageno">{n}<i>/{PAGES}</i></span></div>
  </header>
  <div class="rules"><span></span><span class="mpl"></span></div>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="dots">&#9679;&nbsp;&#9679;&nbsp;&#9679;</span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    return sheet(1, "One table,<br>one afternoon.", "Thanksgiving kit &middot; at a glance",
        '<div class="two b46"><section>' +
        sec("The meal", "", "maple") +
        field("Where", "t1_where") + field("Date", "t1_date_main") +
        '<div class="split2">' + field("Doors", "t1_doors", "w3") +
        field("We eat at", "t1_eat", "w3") + '</div>' +
        field("Who is cooking", "t1_cook") +
        field("Who is hosting", "t1_host") +
        field("Whose kitchen", "t1_kitchen") +
        sec("The count", "Everything follows from it", "sage") +
        '<div class="countgrid">' +
        "".join(f'<div class="cnt"><span class="cntlbl">{lab}</span>'
                f'{blank(f"t1_n_{k}", "cntnum", "13")}</div>'
                for k, lab in [("adults", "Adults"), ("kids", "Children"),
                               ("veg", "No meat"), ("total", "At the table")]) +
        '</div>' +
        '<div class="capbox">' +
        '<span class="capl">Turkey needed &mdash; about 1 lb (450 g) a head, 1&frac12; for leftovers</span>' +
        blank("t1_birdsize", "capnum", "16") + '</div>' +
        sec("Who cannot eat what", "Ask on the invitation", "cranberry") +
        "".join(f'<div class="al">{blank(f"t1_al_who_{i}", "w2", "10")}'
                f'{blank(f"t1_al_what_{i}", "", "10")}'
                f'<span class="c">{check(f"t1_al_ok_{i}", "cranberry")}</span></div>'
                for i in range(1, 6)) +
        sec("Getting here", "Arrivals decide when the food goes out", "sage") +
        '<div class="ar head"><span>Who</span><span class="w2">Arriving</span>'
        '<span class="w2">Leaving</span></div>' +
        "".join(f'<div class="ar">{blank(f"t1_ar_who_{i}", "", "10")}'
                f'{blank(f"t1_ar_in_{i}", "w2", "10")}'
                f'{blank(f"t1_ar_out_{i}", "w2", "10")}</div>' for i in range(1, 6)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>Two decisions, made today</b>'
        '<p>First: <b>is it a potluck or is it not?</b> Half of the arguments about Thanksgiving '
        'are really about a guest who thought they were bringing something and a host who was '
        'already cooking it. Second: <b>what time do we eat?</b> Say it on the invitation. '
        'Everything on page 4 counts backwards from that hour.</p>'
        '</div>' +
        '<div class="split2">' + field("Potluck?", "t1_potluck", "w2") +
        field("Told everyone", "t1_told", "w2") + '</div>' +
        sec("What makes it Thanksgiving here", "", "maple") +
        "".join(f'<div class="wl">{blank(f"t1_trad_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Ordered, not bought", "The bird, the pies, the ice", "sage") +
        "".join(f'<div class="wl">{check(f"t1_ord_{i}", "sage")}'
                f'{blank(f"t1_ord_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("Borrowed &mdash; and whose it is", "") +
        "".join(f'<div class="bw">{blank(f"t1_bw_what_{i}", "", "10")}'
                f'{blank(f"t1_bw_who_{i}", "w2", "10")}'
                f'<span class="c">{check(f"t1_bw_back_{i}", "cranberry")}</span></div>'
                for i in range(1, 5)) +
        '</section></div>')

def page_2():
    bands = "".join(
        f'<div class="tk">{check(f"t2_band_{i}", "maple")}'
        f'<span class="tkw">{lb}</span><span class="tkk">{kg}</span>'
        f'<span class="tkd">{thaw}</span><span class="tkr">{roast}</span></div>'
        for i, (lb, kg, thaw, roast) in enumerate(TURKEY, start=1))
    return sheet(2, "The bird,<br>worked out.", "Thanksgiving kit &middot; weight, thaw, time",
        '<div class="two b46"><section>' +
        sec("Find your weight, tick the row", "", "maple") +
        '<div class="tk head"><span></span><span class="tkw">Weight</span>'
        '<span class="tkk">Metric</span><span class="tkd">Thaw</span>'
        '<span class="tkr">Roast at 325&deg;F / 165&deg;C</span></div>' + bands +
        '<span class="footnote">Guides, not laws: about 24 hours in the fridge for every '
        '4&ndash;5 lb, and roughly 13 minutes a pound unstuffed. Stuffed adds about half an hour. '
        'A thermometer settles it, a clock does not.</span>' +
        sec("So, the dates", "Work backwards from the meal", "cranberry") +
        field("Bird collected or delivered", "t2_get") +
        field("Out of the freezer on", "t2_thaw_start") +
        field("Thawed by", "t2_thaw_end") +
        field("Brine or dry-brine from", "t2_brine") +
        field("Into the oven at", "t2_in") +
        field("Out of the oven at", "t2_out") +
        field("Rests until", "t2_rest") +
        field("Carved by", "t2_carve") +
        '<div class="warn" style="border-color:var(--cranberry)">'
        '<b>Still frozen on the morning?</b>'
        '<p>Cold water, still in its wrapping, breast down: <b>30 minutes per pound</b>, and '
        'change the water every 30 minutes. Never warm water, and never left on the counter. '
        'Cook it straight afterwards rather than putting it back in the fridge.</p>'
        '</div>' +
        '</section><section>' +
        '<div class="warn">'
        '<b>The only number that decides whether it is cooked</b>'
        '<p><b>165&deg;F / 74&deg;C</b> in the thickest part of the thigh and of the breast, with '
        'the probe not touching bone. Colour, timing and the little plastic pop-up all lie. And '
        '<b>do not rinse the raw bird</b> &mdash; it does nothing except spray the sink and '
        'everything near it.</p>'
        '</div>' +
        sec("Rest it, properly", "Twenty to forty minutes", "maple") +
        "".join(f'<div class="wl">{check(f"t2_rest_{i}", "maple")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Loosely covered with foil, not wrapped tight",
                                       "Somewhere the cats and the children are not",
                                       "The oven is now free &mdash; this is the plan on page 4",
                                       "Juices into the gravy while it rests"], start=1)) +
        sec("Before the day", "", "sage") +
        "".join(f'<div class="wl">{check(f"t2_pre_{i}", "sage")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["A meat thermometer that works, tested",
                                       "A tin the bird actually fits in",
                                       "Room in the fridge, cleared before it arrives",
                                       "Foil, string, and a rack or some onions",
                                       "Somewhere to put a hot tin down"], start=1)) +
        sec("Not doing a turkey?", "The weight and the method") +
        "".join(f'<div class="wl">{blank(f"t2_alt_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

def page_3():
    head = ('<div class="pl head"><span>Who</span><span>What they are bringing</span>'
            '<span>Course</span><span class="c">Oven</span><span class="c">Cold</span>'
            '<span class="c">Here</span></div>')
    rows = "".join(
        f'<div class="pl">{blank(f"t3_who_{i}", "", "10")}{blank(f"t3_what_{i}", "", "10")}'
        f'{blank(f"t3_course_{i}", "", "9.5")}'
        f'<span class="c">{check(f"t3_oven_{i}", "maple")}</span>'
        f'<span class="c">{check(f"t3_fridge_{i}", "cranberry")}</span>'
        f'<span class="c">{check(f"t3_here_{i}", "sage")}</span></div>'
        for i in range(1, 21))
    return sheet(3, "Who is<br>bringing what.", "Thanksgiving kit &middot; the potluck",
        sec("Ask for a dish by name", "&#8220;Anything you like&#8221; gets you four bowls of the same thing",
            "maple") +
        f'<div class="pltable">{head}{rows}</div>' +
        '<div class="warn" style="margin-bottom:0">'
        '<b>The oven column is the whole point</b>'
        '<p>A guest arriving with a casserole that needs forty minutes at 375&deg;F, at the hour '
        'the turkey is resting and the potatoes are in, is the single most common way the meal '
        'runs late. Ask everyone whether their dish needs the oven, and put the ones that do onto '
        'page 4 <b>now</b>. Cold, room-temperature and stovetop dishes are the ones to ask for.</p>'
        '</div>')

def page_4():
    head = ('<div class="ov head"><span>Dish</span><span class="w3">Temp</span>'
            '<span class="w3">Mins</span><span class="w3">In at</span>'
            '<span class="w3">Out at</span><span class="c">&#10003;</span></div>')
    rows = "".join(
        f'<div class="ov">{blank(f"t4_dish_{i}", "", "10")}{blank(f"t4_temp_{i}", "w3", "10")}'
        f'{blank(f"t4_mins_{i}", "w3", "10")}{blank(f"t4_in_{i}", "w3", "10")}'
        f'{blank(f"t4_out_{i}", "w3", "10")}'
        f'<span class="c">{check(f"t4_done_{i}", "maple")}</span></div>'
        for i in range(1, 15))
    return sheet(4, "One oven,<br>everything else.", "Thanksgiving kit &middot; the kitchen plan",
        '<div class="servebar">'
        '<span class="servel">We eat at</span>' + blank("t4_serve", "servenum", "20") +
        '<span class="servehint">Write it first. Every line below counts back from this hour.</span>'
        '</div>' +
        '<div class="two b8"><section>' +
        sec("The oven, hour by hour", "", "maple") +
        f'<div class="ovtable">{head}{rows}</div>' +
        '</section><section>' +
        sec("Off the oven entirely", "Each one buys back an hour", "sage") +
        '<div class="hb head"><span>Dish</span><span>Stove / cold / slow cooker</span></div>' +
        "".join(f'<div class="hb">{blank(f"t4_off_{i}", "", "10")}'
                f'{blank(f"t4_off_how_{i}", "", "10")}</div>' for i in range(1, 6)) +
        sec("Made the day before", "Anything that reheats", "cranberry") +
        "".join(f'<div class="wl">{check(f"t4_ahead_{i}", "cranberry")}'
                f'{blank(f"t4_ahead_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        sec("The last fifteen minutes") +
        "".join(f'<div class="wl">{check(f"t4_last_{i}", "maple")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Gravy finished with the resting juices",
                                       "Plates and serving dishes warmed",
                                       "Someone carving, someone else pouring",
                                       "Everything cold brought out of the fridge"], start=1)) +
        '</section></div>')

def page_5():
    def rows(prefix, n, tone="sage"):
        return "".join(f'<div class="sh">{blank(f"{prefix}_{i}", "", "10.5")}'
                       f'{blank(f"{prefix}_q_{i}", "w3", "10")}'
                       f'<span class="c">{check(f"{prefix}_ok_{i}", tone)}</span></div>'
                       for i in range(1, n + 1))
    return sheet(5, "The<br>shopping.", "Thanksgiving kit &middot; three trips, not five",
        '<div class="two"><section>' +
        sec("Order now, collect later", "The bird, the pies", "cranberry") +
        '<div class="sh head"><span>What</span><span class="w3">How much</span>'
        '<span class="c">Got</span></div>' + rows("t5_ord", 5, "cranberry") +
        sec("Cupboard &mdash; buy any time", "", "sage") +
        rows("t5_cup", 9) +
        sec("Budget", "", "maple") +
        '<div class="split2">' + field("Planned", "t5_planned", "w2") +
        field("Spent", "t5_spent", "w2") + '</div>' +
        '</section><section>' +
        sec("Fresh &mdash; the last two days", "", "maple") +
        '<div class="sh head"><span>What</span><span class="w3">How much</span>'
        '<span class="c">Got</span></div>' + rows("t5_fresh", 10, "maple") +
        sec("Drink, and something for the drivers", "", "sage") +
        rows("t5_drink", 4) +
        sec("Not food, and always forgotten", "") +
        "".join(f'<div class="wl">{check(f"t5_non_{i}", "cranberry")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Foil, parchment, freezer bags",
                                       "Containers for the leftovers guests take home",
                                       "Ice &mdash; more than the fridge can make",
                                       "Bin bags, and somewhere for the recycling"], start=1)) +
        '</section></div>')

def page_6():
    seats = "".join(
        f'<div class="st"><span class="stn">{i}</span>{blank(f"t6_seat_{i}", "", "10.5")}'
        f'{blank(f"t6_note_{i}", "w2", "9.5")}</div>' for i in range(1, 19))
    return sheet(6, "The table,<br>and who is at it.", "Thanksgiving kit &middot; seating",
        '<div class="two b46"><section>' +
        sec("Where everyone sits", "Decide it now, not at the door", "sage") +
        '<div class="st head"><span class="stn">#</span><span>Who</span>'
        '<span class="w2">Next to</span></div>' + seats +
        '</section><section>' +
        sec("The children", "Their own table, if enough", "maple") +
        '<div class="split2">' + field("How many", "t6_kids_n", "w3") +
        field("Where", "t6_kids_where", "w3") + '</div>' +
        "".join(f'<div class="wl">{check(f"t6_kid_{i}", "maple")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Something for them to do before the food",
                                       "Cups with lids, or cups they can spill",
                                       "One adult who has agreed to sit there"], start=1)) +
        sec("On the table", "", "sage") +
        "".join(f'<div class="wl">{check(f"t6_tab_{i}", "sage")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Enough chairs, counted, not assumed",
                                       "Plates, cutlery and glasses &mdash; counted twice",
                                       "Serving spoons, one per dish",
                                       "Water on the table before anyone sits",
                                       "Nothing tall in the middle; people want to see"], start=1)) +
        sec("The round of thanks", "Short, and equal", "cranberry") +
        '<div class="split2">' + field("Who starts", "t6_thanks_who", "w2") +
        field("When", "t6_thanks_when", "w2") + '</div>' +
        f'<div class="wl">{blank("t6_thanks_note", "grow", "10.5")}</div>' +
        sec("Whoever is finding today hard", "") +
        "".join(f'<div class="wl">{blank(f"t6_care_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

DAYS = [("Two days before", "a", ["Fridge cleared, bird in it if it is not already",
                                  "Big shop done &mdash; everything except the fresh",
                                  "Chairs, plates and glasses counted",
                                  "Anyone who has not said what they are bringing, chased"]),
        ("The day before", "b", ["Fresh shop, early",
                                 "Everything on the make-ahead list, made",
                                 "Table laid, or stacked ready to lay",
                                 "Bird out, patted dry, seasoned if you are dry-brining",
                                 "Read page 4 out loud to whoever is helping"]),
        ("Thanksgiving morning", "c", ["Oven on early &mdash; it takes longer than you think",
                                       "Bird in at the time on page 2",
                                       "Coffee and something to eat, for the cooks",
                                       "Cold dishes out of the fridge in good time",
                                       "Dishwasher emptied before anyone arrives"])]

def page_7():
    blocks = []
    for bi, (title, tone, tasks) in enumerate(DAYS, start=1):
        rows = "".join(f'<div class="dt">{check(f"t7_b{bi}_t{ti}", tone)}'
                       f'<span class="dttext">{t}</span></div>'
                       for ti, t in enumerate(tasks, start=1))
        rows += "".join(f'<div class="dt">{check(f"t7_b{bi}_x{i}", tone)}'
                        f'{blank(f"t7_b{bi}_l{i}", "grow", "10")}</div>' for i in (1, 2, 3))
        blocks.append(f'<section class="dblock"><div class="dhead {tone}">'
                      f'<b>{title}</b>{blank(f"t7_b{bi}_date", "w2", "10")}</div>'
                      f'<div class="dts">{rows}</div></section>')
    return sheet(7, "The three days<br>before.", "Thanksgiving kit &middot; countdown",
                 f'<div class="dcols">{"".join(blocks)}</div>')

BEATS = [("Kitchen busy, guests elsewhere", "One cook, one helper, a drink for both"),
         ("Arrivals", "Coats, a drink, and something to eat that is not the meal"),
         ("Bird out of the oven", "The oven is now free; page 4 takes over"),
         ("Everything else in and out", "Twenty minutes of noise, then it is done"),
         ("Sit down", "Say the time out loud an hour beforehand"),
         ("The round of thanks", "Before the food goes cold, not after"),
         ("Eat", "Nothing is being cooked now"),
         ("Pudding, and a walk for whoever wants one", "The plates can wait half an hour")]

def page_8():
    rows = "".join(
        f'<div class="rs">{blank(f"t8_time_{i}", "w3", "10")}{blank(f"t8_what_{i}", "", "10.5")}'
        f'{blank(f"t8_who_{i}", "w2", "10")}</div>' for i in range(1, 14))
    beats = "".join(
        f'<div class="beat"><span class="bnum">{i}</span>'
        f'<div class="btext"><b>{t}</b><span>{d}</span></div>'
        f'{blank(f"t8_beat_{i}", "w3", "10")}</div>'
        for i, (t, d) in enumerate(BEATS, start=1))
    return sheet(8, "How the day<br>runs.", "Thanksgiving kit &middot; run of show",
        '<div class="two b8"><section>' +
        sec("Hour by hour", "Only the things that need a time", "maple") +
        '<div class="rs head"><span class="w3">Time</span><span>What happens</span>'
        '<span class="w2">Who is on it</span></div>' + rows +
        sec("Jobs with a name against them", "", "cranberry") +
        "".join(f'<div class="jb"><span class="jbn">{t}</span>'
                f'{blank(f"t8_job_{i}", "", "10.5")}</div>'
                for i, t in enumerate(["Carving", "Drinks", "Washing up",
                                       "The children"], start=1)) +
        '</section><section>' +
        sec("Eight beats", "Write the time next to each", "sage") +
        f'<div class="beats">{beats}</div>' +
        sec("Before anyone leaves", "", "cranberry") +
        "".join(f'<div class="wl">{check(f"t8_leave_{i}", "cranberry")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Containers filled &mdash; the list is on page 9",
                                       "Borrowed dishes back in their bags",
                                       "One photograph while everyone is still here"], start=1)) +
        '</section></div>')

def page_9():
    return sheet(9, "Friday.", "Thanksgiving kit &middot; leftovers and after",
        '<div class="two b46"><section>' +
        sec("Sent home with people", "Fill them before people go", "sage") +
        '<div class="lo head"><span>Who</span><span>What</span>'
        '<span class="c">Gone</span></div>' +
        "".join(f'<div class="lo">{blank(f"t9_lo_who_{i}", "", "10")}'
                f'{blank(f"t9_lo_what_{i}", "", "10")}'
                f'<span class="c">{check(f"t9_lo_ok_{i}", "sage")}</span></div>'
                for i in range(1, 8)) +
        sec("Tonight, not tomorrow", "Two hours out, no more", "cranberry") +
        "".join(f'<div class="wl">{check(f"t9_now_{i}", "cranberry")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Meat off the bird and into the fridge",
                                       "Carcass into a pot or a freezer bag for stock",
                                       "Everything else boxed and labelled with the date",
                                       "Anything that will not be eaten in four days, frozen"], start=1)) +
        sec("Borrowed things going back", "") +
        "".join(f'<div class="wl">{check(f"t9_ret_{i}", "maple")}'
                f'{blank(f"t9_ret_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("The second meal", "Plan one, not five", "maple") +
        "".join(f'<div class="wl">{blank(f"t9_meal_{i}", "grow", "10.5")}</div>'
                for i in (1, 2, 3)) +
        sec("Thank-yous", "", "sage") +
        '<div class="ty head"><span>To</span><span>For</span><span class="c">Sent</span></div>' +
        "".join(f'<div class="ty">{blank(f"t9_ty_who_{i}", "", "10")}'
                f'{blank(f"t9_ty_what_{i}", "", "10")}'
                f'<span class="c">{check(f"t9_ty_ok_{i}", "sage")}</span></div>'
                for i in range(1, 8)) +
        sec("Next year, in three lines", "Worth ten in November", "cranberry") +
        "".join(f'<div class="wl">{blank(f"t9_next_{i}", "grow", "10.5")}</div>'
                for i in (1, 2, 3)) +
        '<div class="split2">' + field("At the table", "t9_count", "w3") +
        field("Bird was", "t9_bird", "w3") + '</div>' +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --maple:{C["maple"]}; --sage:{C["sage"]}; --cranberry:{C["cranberry"]};
  --backdrop:#efeae3;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#17130f; }} }}
:root[data-theme="dark"]{{ --backdrop:#17130f; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"DM Sans","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(34,26,21,.16);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:500; text-transform:uppercase; letter-spacing:.17em; font-size:7.4pt;
  color:var(--soft); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in; }}
.mast h1{{ font-family:"DM Serif Display",Georgia,serif; font-weight:400; font-size:{S["display"]};
  line-height:.98; margin:6px 0 0; letter-spacing:-.008em; }}
.mastright{{ display:flex; align-items:flex-end; gap:13px; position:relative; }}
.setting{{ position:absolute; right:-4px; top:-64px; width:1.25in; height:1.16in;
  color:var(--strong); }}
.pageno{{ font-family:"DM Serif Display",Georgia,serif; font-size:17pt; color:var(--maple); }}
.pageno i{{ font-style:normal; font-size:9pt; color:var(--faint); }}
.mini{{ display:flex; gap:10px; padding-bottom:3px; }}
.mini .fr{{ height:.22in; }}
.rules{{ display:flex; flex-direction:column; gap:2px; padding-top:9px; flex:none; }}
.rules span{{ height:1.2px; background:var(--ink); }}
.rules span.mpl{{ height:3px; background:var(--maple); }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:12px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.06fr 1fr; }}
.two.b8{{ grid-template-columns:1.3fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}
.gap{{ height:12px; flex:none; }}

.sec{{ display:flex; align-items:center; gap:9px; padding:10px 0 6px; overflow:hidden; flex:none; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.09em; font-size:8.5pt;
  color:var(--ink); white-space:nowrap; }}
.lbl.maple{{ color:var(--maple); }} .lbl.sage{{ color:var(--sage); }}
.lbl.cranberry{{ color:var(--cranberry); }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.5in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.2px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.85in; }} .blank.w3{{ flex:none; width:.52in; }}
.blank.c{{ flex:none; width:.2in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

.box{{ width:11px; height:11px; border:1.4px solid var(--strong); flex:none; margin-bottom:3px; }}
.box.maple{{ border-color:var(--maple); }} .box.sage{{ border-color:var(--sage); }}
.box.cranberry{{ border-color:var(--cranberry); }}
.box.a{{ border-color:var(--sage); }} .box.b{{ border-color:var(--cranberry); }}
.box.c{{ border-color:var(--maple); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.28in; max-height:.52in; }}
.rtext{{ font-size:10pt; padding-bottom:3px; line-height:1.15; }}
.footnote{{ font-size:8.4pt; color:var(--faint); line-height:1.4; padding-top:8px; display:block;
  flex:none; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:5px; border-bottom:1.5px solid var(--ink); margin-bottom:5px;
  font-weight:500; text-transform:uppercase; letter-spacing:.07em; font-size:7pt;
  color:var(--soft); }}
.head span, .head .blank{{ border:0; }}

.warn{{ border:1.5px solid var(--maple); border-radius:3px; padding:11px 13px; margin:10px 0;
  flex:none; }}
.warn b{{ font-size:9.6pt; }}
.warn p{{ margin:5px 0 0; font-size:9.3pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.countgrid{{ display:grid; grid-template-columns:1fr 1fr; gap:4px 16px; padding:3px 0 2px;
  flex:none; }}
.cnt{{ display:flex; align-items:flex-end; gap:10px; }}
.cntlbl{{ font-size:9.2pt; color:var(--soft); padding-bottom:4px; flex:1; }}
.blank.cntnum{{ flex:none; width:.62in; height:.3in; }}
.capbox{{ border:1.5px solid var(--maple); border-radius:3px; padding:9px 13px 10px;
  margin-top:9px; display:flex; align-items:flex-end; gap:12px; flex:none; }}
.capl{{ font-size:8.5pt; color:var(--soft); line-height:1.3; padding-bottom:3px; }}
.blank.capnum{{ flex:none; width:1in; border-bottom-width:1.5px;
  border-bottom-color:var(--maple); height:.34in; }}
.al{{ display:grid; grid-template-columns:.85in minmax(0,1fr) .24in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.bw{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .24in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.ar{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .85in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* page 2 ------------------------------------------------------------------ */
.tk{{ display:grid; grid-template-columns:.24in .82in .78in .58in minmax(0,1fr); gap:0 8px;
  align-items:flex-end; flex:none; min-height:.32in; border-bottom:1px solid var(--rule); }}
.tk span{{ padding-bottom:5px; font-size:9.4pt; }}
.tk .tkk{{ color:var(--faint); font-size:8.6pt; }}
.tk .tkd{{ color:var(--cranberry); font-weight:700; }}
.tk.head span{{ padding-bottom:5px; }}

/* page 3 ------------------------------------------------------------------ */
.pltable{{ flex:1; display:flex; flex-direction:column; }}
.pl{{ display:grid;
  grid-template-columns:minmax(0,1.15fr) minmax(0,1.9fr) minmax(0,.9fr) .38in .38in .38in;
  gap:0 8px; align-items:flex-end; flex:1; min-height:.26in; }}

/* pages 4 to 9 ------------------------------------------------------------ */
.servebar{{ display:flex; align-items:flex-end; gap:14px; border:1.5px solid var(--cranberry);
  border-radius:3px; padding:10px 14px 11px; margin-bottom:10px; flex:none; }}
.servel{{ font-weight:700; text-transform:uppercase; letter-spacing:.09em; font-size:9pt;
  color:var(--cranberry); padding-bottom:5px; white-space:nowrap; }}
.blank.servenum{{ flex:none; width:1.35in; border-bottom-width:1.5px;
  border-bottom-color:var(--cranberry); height:.36in; }}
.servehint{{ font-size:8.4pt; color:var(--faint); padding-bottom:5px; flex:1; text-align:right; }}
.ovtable{{ flex:1; display:flex; flex-direction:column; }}
.ov{{ display:grid; grid-template-columns:minmax(0,1fr) .52in .52in .52in .52in .26in;
  gap:0 8px; align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.hb{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.15fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.sh{{ display:grid; grid-template-columns:minmax(0,1fr) .52in .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.26in; max-height:.42in; }}
.st{{ display:grid; grid-template-columns:.24in minmax(0,1fr) .85in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.26in; max-height:.44in; }}
.stn{{ font-family:"DM Serif Display",Georgia,serif; font-size:10pt; color:var(--faint);
  padding-bottom:3px; }}
.rs{{ display:grid; grid-template-columns:.52in minmax(0,1fr) .85in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.jb{{ display:grid; grid-template-columns:.95fr minmax(0,1.5fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.jbn{{ font-size:9.8pt; padding-bottom:4px; }}
.lo{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.35fr) .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.ty{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.2fr) .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.beats{{ display:flex; flex-direction:column; flex:1 1 auto; padding-bottom:4px; }}
.beat{{ display:grid; grid-template-columns:.26in minmax(0,1fr) .52in; gap:0 9px;
  align-items:center; flex:1 1 auto; min-height:.4in; max-height:.68in;
  border-bottom:1px solid var(--rule); }}
.bnum{{ font-family:"DM Serif Display",Georgia,serif; font-size:12pt; color:var(--maple); }}
.btext b{{ display:block; font-size:9.5pt; font-weight:500; line-height:1.15; }}
.btext span{{ display:block; font-size:8.2pt; color:var(--faint); line-height:1.2; }}

/* page 7 ------------------------------------------------------------------ */
.dcols{{ flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr 1fr; gap:0 .3in; }}
.dblock{{ display:flex; flex-direction:column; min-width:0; }}
.dhead{{ display:flex; align-items:flex-end; gap:10px; border-bottom:2px solid var(--ink);
  padding-bottom:5px; margin-bottom:6px; flex:none; }}
.dhead b{{ font-family:"DM Serif Display",Georgia,serif; font-weight:400; font-size:13pt;
  line-height:1.05; flex:1; }}
.dhead .blank{{ height:.24in; }}
.dhead.a{{ border-bottom-color:var(--sage); }} .dhead.a b{{ color:var(--sage); }}
.dhead.b{{ border-bottom-color:var(--cranberry); }} .dhead.b b{{ color:var(--cranberry); }}
.dhead.c{{ border-bottom-color:var(--maple); }} .dhead.c b{{ color:var(--maple); }}
.dts{{ flex:1; display:flex; flex-direction:column; min-height:0; }}
.dt{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.3in;
  max-height:.8in; border-bottom:1px solid var(--rule); }}
.dttext{{ font-size:9.4pt; padding-bottom:3px; line-height:1.2; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.2px solid var(--ink); margin-top:10px; padding-top:8px; }}
.foot .mark{{ font-family:"DM Serif Display",Georgia,serif; font-size:9.5pt; color:var(--faint); }}
.dots{{ font-size:6pt; color:var(--maple); letter-spacing:.1em; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-thanksgiving.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>One Table Thanksgiving Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-thanksgiving-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"thanksgiving-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"thanksgiving-{name}")
        fill_pdf = os.path.join(DIST, f"thanksgiving-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["maple"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="One Table &nbsp;&middot;&nbsp; Thanksgiving planning kit",
    title="Start<br><em>here.</em>",
    lede="Nine pages for one meal and the people around it: the bird worked out from its weight, "
         "a who-brings-what list that asks whether the dish needs the oven, an oven plan for a "
         "kitchen that only has one, the table, the three days before, the day, and Friday.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Start with page 2", "the thaw dates decide when you have to buy the bird"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. Tick the boxes with a click. <b>Save a copy first</b> and keep it as this "
        "year&#8217;s file &mdash; next November it opens with the guest list, the seating and the "
        "timings already in it.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Print page 4 whatever "
        "else you do and put it on the kitchen wall: it is the oven plan counting back from the "
        "hour you sit down, and it is what everyone helping needs to be able to read.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "White pages on purpose &mdash; a colour-filled background eats a cartridge",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="The one number the kit will not let you guess",
    s5p="A turkey is cooked at <b>165&deg;F / 74&deg;C</b> in the thickest part of the thigh and "
        "of the breast, with the probe clear of the bone. Colour, timing and the plastic pop-up "
        "are all worse than a thermometer. The weight table on page 2 gives fridge thawing times "
        "and roasting times as a starting point &mdash; they are guides, and the thermometer is "
        "the answer. And do not rinse the raw bird.",
    license="Personal use only. Print as many copies as you like for your own table. Please do not "
            "resell, share or redistribute the files. Fonts: DM Serif Display and DM Sans "
            "(SIL Open Font License).",
    mark="One table. One afternoon.",
)

PAGE_NAMES = ["At a glance", "The bird, worked out", "Who brings what", "One oven, everything else",
              "The shopping", "The table", "The three days before", "How the day runs", "Friday"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["harvest"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"DM Serif Display",Georgia,serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"DM Sans",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"DM Sans"'),
                 ("--s1:#f2a65a", "--s1:" + C["maple"]), ("--s2:#ee6c4d", "--s2:" + C["cranberry"]),
                 ("--s3:#c43e7a", "--s3:" + C["sage"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-style:italic;", "font-style:normal;")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-thanksgiving.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    hp = os.path.join(work, "readme-thanksgiving.html")
    open(hp, "w", encoding="utf-8").write(tpl)
    B.to_pdf(hp, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-thanksgiving.css")
    doc = pymupdf.open(os.path.join(DIST, "thanksgiving-planner-letter-harvest-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"thanksgiving-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["harvest"]
    over = (
        "<style>"
        "h1{font-family:'DM Serif Display',Georgia,serif;font-weight:400;line-height:1.0;"
        "letter-spacing:-.012em}"
        f"h1 em{{font-style:normal;color:{C['maple']}}}"
        "body{font-family:'DM Sans',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['cranberry']};font-family:'DM Sans';font-weight:500;letter-spacing:.18em}}"
        f".rule{{background:{C['maple']};height:4px;width:220px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'DM Sans';font-weight:500;"
        "letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(34,26,21,.18)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'DM Sans',Arial,sans-serif;font-weight:500;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>One table,<br>one <em>afternoon.</em></h1>
          <span class="rule"></span>
          <p class="sub">A Thanksgiving kit that works the bird out from its weight, asks every
          guest whether their dish needs the oven, and plans a kitchen that only has one.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated, use every year</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>one meal.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The two pages that save the meal</span>
      <h1>The thaw dates.<br><em>The oven plan.</em></h1>
      <p class="sub">A weight table that turns pounds into the day the bird leaves the freezer,
      and the temperature that actually decides whether it is cooked. Then one oven, every dish,
      counted back from the hour you sit down.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[1]}" style="height:1170px"><img src="{imgs[3]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#f5f1ea", "100px", "92px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#f2eee7", "100px", "80px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-thanksgiving-{name}.html")
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
        BD.package(DIST, "One-Table-Thanksgiving-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building Thanksgiving kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "thanksgiving-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "harvest", embed_fonts=False))
    print("Wrote thanksgiving-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "One-Table-Thanksgiving-Kit")


if __name__ == "__main__":
    main()
