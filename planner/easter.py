#!/usr/bin/env python3
"""Build the Four Days Easter kit.

Nine pages for a four-day weekend rather than one lunch: an egg hunt worked out
from the number of children, a hiding map so the last eggs are found in April
and not in July, baskets costed per child, Sunday lunch, and the other three
days.

    python3 easter.py                  # every size / colourway
    python3 easter.py --only letter-dye
    python3 easter.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, math, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-easter")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Marcellus"
          "&family=Mulish:wght@400;500;600;700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="36pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="35pt"),
}

COLORWAYS = {
    # rhubarb = the children and the hunt, duck = the four days and the plan,
    # daffodil = food and the good bits. Dye colours, on white paper.
    "dye":  dict(ink="#1f1b21", soft="#5d5661", faint="#968f9a", rule="#e8e4ea",
                 strong="#c9c3ce", rhubarb="#c2456a", duck="#3f7f96", daffodil="#b3841a"),
    "mono": dict(ink="#1d1c1e", soft="#5b585d", faint="#949196", rule="#e7e6e8",
                 strong="#c7c5c9", rhubarb="#3c3a3e", duck="#8b888d", daffodil="#3c3a3e"),
}

PAGES = 9
MARK = "Four days, not one lunch."

# Rough guidance printed in the kit, so nobody buys 200 eggs or 12.
EGGS = [
    ("Under 3", "8 &ndash; 10 each", "In sight, at knee height"),
    ("3 &ndash; 5", "12 &ndash; 15 each", "Low, but hidden"),
    ("6 &ndash; 9", "18 &ndash; 20 each", "Properly hidden"),
    ("10 and up", "20 &ndash; 25 each", "Hard, and a clue or two"),
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

def egg(seed=0):
    """An egg, drawn, with a dip-dye band that sits higher on every page."""
    cx, cy, rx, ry = 68, 64, 30, 40
    parts = [f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}"/>']
    band = cy + 26 - seed * 5.5                 # the dye line rises through the kit
    for i in range(9):
        t = -1 + i * 0.25
        x = cx + t * rx * 0.92
        # half-height of the egg at this x, from the ellipse equation
        half = ry * math.sqrt(max(0.0, 1 - (x - cx) ** 2 / (rx * rx)))
        top, bot = cy - half, cy + half
        y1 = min(max(band - 9, top + 1.5), bot - 1.5)
        y2 = min(max(band + 9, top + 1.5), bot - 1.5)
        if y2 - y1 > 1:
            parts.append(f'<line x1="{x:.1f}" y1="{y1:.1f}" x2="{x:.1f}" y2="{y2:.1f}"/>')
    return (f'<svg class="egg" viewBox="0 0 136 128" aria-hidden="true">'
            f'<g fill="none" stroke="currentColor" stroke-width="1" '
            f'stroke-linecap="round">{"".join(parts)}</g></svg>')

def sheet(n, title, kicker, body):
    meta = (f'<div class="mini">{field("Date", f"e{n}_date", "w2", "9")}</div>' if n > 1 else '')
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{egg(n)}{meta}<span class="pageno">{n}<i>/{PAGES}</i></span></div>
  </header>
  <div class="rules"><span></span><span class="rhu"></span></div>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="dots">&#9679;&nbsp;&#9679;&nbsp;&#9679;</span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

DAYS = [("Good Friday", "a"), ("Saturday", "b"), ("Easter Sunday", "c"), ("Easter Monday", "d")]

def page_1():
    days = "".join(
        f'<div class="dy"><span class="dyn {t}">{lab}</span>{blank(f"e1_day_{i}", "", "10.5")}'
        f'{blank(f"e1_who_{i}", "w2", "10")}</div>'
        for i, (lab, t) in enumerate(DAYS, start=1))
    return sheet(1, "Four days,<br>not one lunch.", "Easter kit &middot; at a glance",
        '<div class="two b46"><section>' +
        sec("The weekend", "It is a four-day weekend, so plan four days", "duck") +
        '<div class="dy head"><span class="dyn">Which day</span><span>What happens</span>'
        '<span class="w2">Who is here</span></div>' + days +
        sec("The house", "", "daffodil") +
        field("Where we are", "e1_where") +
        '<div class="split2">' + field("Adults", "e1_adults", "w3") +
        field("Children", "e1_kids", "w3") + '</div>' +
        field("Staying over", "e1_staying") +
        field("Travelling on", "e1_travel") +
        field("Lunch on Sunday at", "e1_lunch", "w2") +
        sec("Who cannot eat what", "Milk, nuts and soya", "rhubarb") +
        "".join(f'<div class="al">{blank(f"e1_al_who_{i}", "w2", "10")}'
                f'{blank(f"e1_al_what_{i}", "", "10")}'
                f'<span class="c">{check(f"e1_al_ok_{i}", "rhubarb")}</span></div>'
                for i in range(1, 5)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>Buy the eggs early, hide them from yourself</b>'
        '<p>The good chocolate sells out in the last week and the shops are shut on the Sunday '
        'in a lot of places. Buy in the fortnight before, put it somewhere you would not casually '
        'open, and write on page 4 what is meant for whom &mdash; otherwise half of it is eaten '
        'before Friday and you buy it twice.</p>'
        '</div>' +
        sec("Ordered or booked", "Lamb, a table, a service, a train", "duck") +
        "".join(f'<div class="wl">{check(f"e1_ord_{i}", "duck")}'
                f'{blank(f"e1_ord_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("What we always do", "The bit that makes it Easter here", "daffodil") +
        "".join(f'<div class="wl">{blank(f"e1_trad_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("What we are skipping this year", "", "rhubarb") +
        "".join(f'<div class="wl">{check(f"e1_skip_{i}", "rhubarb")}'
                f'{blank(f"e1_skip_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_2():
    bands = "".join(
        f'<div class="eg">{check(f"e2_band_{i}", "rhubarb")}'
        f'<span class="ega">{age}</span><span class="egn">{n}</span>'
        f'<span class="egh">{how}</span></div>'
        for i, (age, n, how) in enumerate(EGGS, start=1))
    return sheet(2, "The hunt,<br>worked out.", "Easter kit &middot; how many eggs",
        '<div class="two b46"><section>' +
        sec("How many eggs, by age", "Tick the row for your youngest", "rhubarb") +
        '<div class="eg head"><span></span><span class="ega">Age</span>'
        '<span class="egn">Eggs each</span><span class="egh">How hidden</span></div>' + bands +
        '<div class="mathbox">'
        '<div class="mr"><span class="ml">Children hunting</span>' + blank("e2_kids", "mn", "15") + '</div>'
        '<div class="mr"><span class="ml">Eggs each</span>' + blank("e2_each", "mn", "15") + '</div>'
        '<div class="mr tot"><span class="ml">Eggs to buy</span>' + blank("e2_total", "mn", "17") + '</div>'
        '</div>' +
        sec("Zones, so the little ones stand a chance", "", "duck") +
        '<div class="zn head"><span>Who</span><span>Where they may look</span></div>' +
        "".join(f'<div class="zn">{blank(f"e2_zw_{i}", "", "10")}'
                f'{blank(f"e2_zz_{i}", "", "10")}</div>' for i in range(1, 6)) +
        sec("Before they go out", "", "daffodil") +
        "".join(f'<div class="wl">{check(f"e2_go_{i}", "daffodil")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Coats and shoes on before the sugar",
                                       "One basket or bag each, named",
                                       "A camera or a phone that is charged",
                                       "The rules said out loud, once"], start=1)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>Three rules, said out loud before they start</b>'
        '<p>Count the eggs before you hide them, or you will never know when it is finished. '
        'Give the youngest a head start and a colour or an area of their own. And say the rule '
        'that prevents the tears: <b>nobody eats anything until the whole basket is counted.</b></p>'
        '</div>' +
        sec("The rules for this house", "", "rhubarb") +
        "".join(f'<div class="wl">{check(f"e2_rule_{i}", "rhubarb")}'
                f'{blank(f"e2_rule_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("Timing", "", "duck") +
        '<div class="split2">' + field("Hidden by", "e2_hidden", "w2") +
        field("Starts", "e2_start", "w2") + '</div>' +
        field("If it rains, indoors from", "e2_rain") +
        sec("Not chocolate, for whoever cannot", "", "daffodil") +
        "".join(f'<div class="wl">{check(f"e2_nc_{i}", "daffodil")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Plastic eggs with a coin or a sticker inside",
                                       "Dairy-free chocolate, bought separately and marked",
                                       "A small toy, so nobody is counting who got less"], start=1)) +
        '</section></div>')

def page_3():
    rows = "".join(
        f'<div class="hd"><span class="hdn">{i:02d}</span>{blank(f"e3_where_{i}", "", "10")}'
        f'<span class="c">{check(f"e3_hid_{i}", "duck")}</span>'
        f'<span class="c">{check(f"e3_found_{i}", "rhubarb")}</span></div>'
        for i in range(1, 25))
    return sheet(3, "Where they<br>are hidden.", "Easter kit &middot; the map",
        '<div class="two b3"><section>' +
        sec("Sketch the garden or the room", "Number the places as you go", "duck") +
        '<div class="mapbox">' + blank("e3_map", "grow", "10") + '</div>' +
        '<span class="footnote">Draw it roughly &mdash; the fence, the door, the tree, the sofa. '
        'It only has to be good enough for you to read at the end.</span>' +
        '</section><section>' +
        sec("The list", "Hidden, then found", "rhubarb") +
        '<div class="hd head"><span class="hdn">#</span><span>Hiding place</span>'
        '<span class="c">Hid</span><span class="c">Found</span></div>' + rows +
        '</section></div>' +
        '<div class="warn" style="margin-bottom:0">'
        '<b>This is the page nobody else sells, and the one you will use</b>'
        '<p>Write down every hiding place as you hide it, and tick it off as it is found. Whatever '
        'is still unticked at the end of the morning is the chocolate that turns up behind a '
        'radiator in July, or under a hedge in a state nobody wants to describe. Two minutes with '
        'a pen now.</p>'
        '</div>')

def page_4():
    rows = "".join(
        f'<div class="bk">{blank(f"e4_who_{i}", "", "10.5")}{blank(f"e4_what_{i}", "", "10")}'
        f'{blank(f"e4_nonc_{i}", "", "10")}{blank(f"e4_cost_{i}", "w3", "10")}'
        f'<span class="c">{check(f"e4_ok_{i}", "duck")}</span></div>'
        for i in range(1, 11))
    return sheet(4, "Baskets,<br>and the bill.", "Easter kit &middot; who gets what",
        sec("One row per child",
            "The non-chocolate column stops the crash at eleven", "rhubarb") +
        '<div class="bk head"><span>Who</span><span>Chocolate</span>'
        '<span>Not chocolate</span><span class="w3">Cost</span>'
        '<span class="c">Got</span></div>' +
        f'<div class="bktable">{rows}</div>' +
        '<div class="totals">' +
        "".join(f'<div class="tot"><span class="totlbl">{v}</span>'
                f'{blank(f"e4_t_{k}", "num", "12")}</div>'
                for k, v in [("planned", "Budgeted"), ("spent", "Spent"),
                             ("left", "Left")]) + '</div>' +
        '<div class="warn" style="margin-bottom:0">'
        '<b>Baskets go up, every year, for no reason</b>'
        '<p>They start as one egg and end as a hamper because each adult buys separately and '
        'nobody sees the total. Fill in the cost column before you shop, not after. If several '
        'people are buying, photograph this page and send it &mdash; it is the cheapest '
        'conversation you will have this month.</p>'
        '</div>')

def page_5():
    def rows(prefix, n, tone="daffodil"):
        return "".join(f'<div class="ml">{blank(f"{prefix}_{i}", "", "10.5")}'
                       f'{blank(f"{prefix}_who_{i}", "w2", "9.5")}'
                       f'<span class="c">{check(f"{prefix}_ok_{i}", tone)}</span></div>'
                       for i in range(1, n + 1))
    return sheet(5, "Sunday<br>lunch.", "Easter kit &middot; the long one",
        '<div class="two b46"><section>' +
        sec("The table", "", "daffodil") +
        '<div class="ml head"><span>Dish</span><span class="w2">Who</span>'
        '<span class="c">Got</span></div>' + rows("e5_main", 9) +
        sec("Pudding", "", "rhubarb") +
        rows("e5_swt", 4, "rhubarb") +
        sec("Drink", "", "duck") +
        rows("e5_drink", 4, "duck") +
        '</section><section>' +
        sec("The meat, and when it rests", "It needs a rest either way", "daffodil") +
        field("What it is", "e5_meat") +
        '<div class="split2">' + field("Weight", "e5_weight", "w2") +
        field("In at", "e5_in", "w2") + '</div>' +
        '<div class="split2">' + field("Out at", "e5_out", "w2") +
        field("Carve at", "e5_carve", "w2") + '</div>' +
        '<div class="warn">'
        '<b>The rest is not optional, and it is your free half hour</b>'
        '<p>Meat out of the oven wants twenty to thirty minutes loosely covered &mdash; and that '
        'half hour is when the potatoes crisp, the gravy is finished and the table is laid. '
        'Plan it in rather than discovering it. Use a thermometer if you have one; time and '
        'colour are both worse guesses.</p>'
        '</div>' +
        sec("While it rests", "", "duck") +
        "".join(f'<div class="wl">{check(f"e5_rest_{i}", "duck")}'
                f'{blank(f"e5_rest_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("People arriving mid-afternoon", "Feed the late ones", "rhubarb") +
        "".join(f'<div class="wl">{blank(f"e5_late_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_6():
    def block(title, tone, fid, items):
        rows = "".join(f'<div class="dt">{check(f"{fid}_t{ti}", tone)}'
                       f'<span class="dttext">{t}</span></div>'
                       for ti, t in enumerate(items, start=1))
        rows += "".join(f'<div class="dt">{check(f"{fid}_x{i}", tone)}'
                        f'{blank(f"{fid}_l{i}", "grow", "10")}</div>' for i in (1, 2, 3, 4))
        return (f'<section class="dblock"><div class="dhead {tone}"><b>{title}</b>'
                f'{blank(f"{fid}_date", "w2", "10")}</div><div class="dts">{rows}</div></section>')
    return sheet(6, "The other<br>three days.", "Easter kit &middot; Friday, Saturday, Monday",
        '<div class="dcols">' +
        block("Good Friday", "duck", "e6_fri",
              ["Quiet, and no cooking that needs the oven",
               "Fish, if that is what you do",
               "The travelling, if anyone is coming to you",
               "Buy the fresh things while the shops are open"]) +
        block("Saturday", "rhubarb", "e6_sat",
              ["Dyeing or decorating eggs &mdash; newspaper down first",
               "Baking, with whoever wants to help",
               "Everything for Sunday that can be made today",
               "Eggs counted, and the hiding places chosen"]) +
        block("Easter Monday", "daffodil", "e6_mon",
              ["A walk, or somewhere outside",
               "Leftovers, and nothing cooked from scratch",
               "The drive home, before it gets busy",
               "The chocolate, rationed and put somewhere"]) +
        '</div>')

def page_7():
    rows = "".join(
        f'<div class="ac">{blank(f"e7_what_{i}", "", "10.5")}{blank(f"e7_need_{i}", "", "10")}'
        f'{blank(f"e7_when_{i}", "w2", "10")}'
        f'<span class="c">{check(f"e7_ok_{i}", "rhubarb")}</span></div>'
        for i in range(1, 9))
    return sheet(7, "Four days<br>of children.", "Easter kit &middot; things to do",
        '<div class="two b46"><section>' +
        sec("The plan", "One thing a day is plenty; two is ambitious", "rhubarb") +
        '<div class="ac head"><span>What</span><span>What it needs</span>'
        '<span class="w2">Which day</span><span class="c">Done</span></div>' + rows +
        sec("Dyeing eggs, without the disaster", "", "duck") +
        "".join(f'<div class="wl">{check(f"e7_dye_{i}", "duck")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Hard-boil more than you need; some will crack",
                                       "Newspaper, old clothes, and a bowl each",
                                       "Vinegar in the water makes the colour hold",
                                       "Somewhere they can dry without being touched"], start=1)) +
        '</section><section>' +
        sec("Outside, whatever the weather", "", "daffodil") +
        "".join(f'<div class="wl">{blank(f"e7_out_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("For the twenty minutes before lunch", "", "duck") +
        "".join(f'<div class="wl">{check(f"e7_quiet_{i}", "duck")}'
                f'{blank(f"e7_quiet_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("Bought or borrowed for the weekend", "", "rhubarb") +
        "".join(f'<div class="wl">{check(f"e7_buy_{i}", "rhubarb")}'
                f'{blank(f"e7_buy_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("Whoever is here without children", "") +
        "".join(f'<div class="wl">{blank(f"e7_adult_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

def page_8():
    beds = "".join(
        f'<div class="bd">{blank(f"e8_who_{i}", "", "10.5")}{blank(f"e8_room_{i}", "", "10")}'
        f'<span class="c">{check(f"e8_fri_{i}", "duck")}</span>'
        f'<span class="c">{check(f"e8_sat_{i}", "duck")}</span>'
        f'<span class="c">{check(f"e8_sun_{i}", "duck")}</span>'
        f'<span class="c">{check(f"e8_linen_{i}", "daffodil")}</span></div>'
        for i in range(1, 8))
    return sheet(8, "Beds and<br>the driving.", "Easter kit &middot; a four-night weekend",
        '<div class="two b46"><section>' +
        sec("Who is sleeping where, and which nights", "", "duck") +
        '<div class="bd head"><span>Who</span><span>Where</span>'
        '<span class="c">Fri</span><span class="c">Sat</span><span class="c">Sun</span>'
        '<span class="c">Bed</span></div>' + beds +
        sec("Coming and going", "Worst on Friday and Monday", "rhubarb") +
        '<div class="ar head"><span>Who</span><span class="w2">Arrives</span>'
        '<span class="w2">Leaves</span></div>' +
        "".join(f'<div class="ar">{blank(f"e8_aw_{i}", "", "10")}'
                f'{blank(f"e8_ai_{i}", "w2", "10")}{blank(f"e8_ao_{i}", "w2", "10")}</div>'
                for i in range(1, 6)) +
        '</section><section>' +
        sec("Things guests need and never bring", "", "daffodil") +
        "".join(f'<div class="wl">{check(f"e8_sp_{i}", "daffodil")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["A spare toothbrush, and towels out",
                                       "A charger by the bed",
                                       "Wellingtons and coats, in every size you have",
                                       "Somewhere for a travel cot, if there is one"], start=1)) +
        sec("Shops shut, chemists shut", "", "rhubarb") +
        "".join(f'<div class="wl">{check(f"e8_shut_{i}", "rhubarb")}'
                f'{blank(f"e8_shut_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("The house, before anyone arrives", "", "duck") +
        "".join(f'<div class="wl">{check(f"e8_house_{i}", "duck")}'
                f'{blank(f"e8_house_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        '</section></div>')

def page_9():
    return sheet(9, "Tuesday.", "Easter kit &middot; what is left",
        '<div class="two b46"><section>' +
        sec("The chocolate, honestly", "Rationing works", "rhubarb") +
        "".join(f'<div class="wl">{check(f"e9_ch_{i}", "rhubarb")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Each child&#8217;s stash into one named box or bag",
                                       "Out of sight, and out of reach",
                                       "One piece a day, agreed out loud and in advance",
                                       "Anything broken or unwrapped, into the baking cupboard",
                                       "What nobody likes, given away without ceremony"], start=1)) +
        sec("Food that has to be eaten this week", "", "daffodil") +
        "".join(f'<div class="wl">{blank(f"e9_food_{i}", "grow", "10.5")}</div>'
                for i in range(1, 6)) +
        sec("Still not found", "From page 3 &mdash; go and look now", "duck") +
        "".join(f'<div class="wl">{check(f"e9_lost_{i}", "duck")}'
                f'{blank(f"e9_lost_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>Half price from tomorrow</b>'
        '<p>Chocolate, decorations, baskets and the plastic eggs are all reduced the moment Easter '
        'is over. Buy next year&#8217;s non-food items now &mdash; the eggs will not keep, but the '
        'baskets, the ribbon and the plastic eggs will, and they go in the same box as the '
        'decorations with a label on the lid.</p>'
        '</div>' +
        sec("Bought in the sales, in the box", "", "daffodil") +
        "".join(f'<div class="wl">{check(f"e9_box_{i}", "daffodil")}'
                f'{blank(f"e9_box_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("Thank yous", "", "duck") +
        '<div class="ty head"><span>To</span><span>For</span><span class="c">Sent</span></div>' +
        "".join(f'<div class="ty">{blank(f"e9_ty_who_{i}", "", "10")}'
                f'{blank(f"e9_ty_what_{i}", "", "10")}'
                f'<span class="c">{check(f"e9_ty_ok_{i}", "duck")}</span></div>'
                for i in range(1, 6)) +
        sec("Next year, three lines", "Worth ten in March", "rhubarb") +
        "".join(f'<div class="wl">{blank(f"e9_next_{i}", "grow", "10.5")}</div>'
                for i in (1, 2, 3)) +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --rhubarb:{C["rhubarb"]}; --duck:{C["duck"]}; --daffodil:{C["daffodil"]};
  --backdrop:#eceaef;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#141215; }} }}
:root[data-theme="dark"]{{ --backdrop:#141215; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Mulish","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(31,27,33,.15);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:600; text-transform:uppercase; letter-spacing:.18em; font-size:7.4pt;
  color:var(--soft); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in; }}
.mast h1{{ font-family:"Marcellus",Georgia,serif; font-weight:400; font-size:{S["display"]};
  line-height:1.02; margin:6px 0 0; letter-spacing:-.005em; }}
.mastright{{ display:flex; align-items:flex-end; gap:13px; position:relative; }}
.egg{{ position:absolute; right:2px; top:-64px; width:1.16in; height:1.14in;
  color:var(--strong); }}
.pageno{{ font-family:"Marcellus",Georgia,serif; font-size:17pt; color:var(--rhubarb); }}
.pageno i{{ font-style:normal; font-size:9pt; color:var(--faint); }}
.mini{{ display:flex; gap:10px; padding-bottom:3px; }}
.mini .fr{{ height:.22in; }}
.rules{{ display:flex; flex-direction:column; gap:2px; padding-top:9px; flex:none; }}
.rules span{{ height:1.2px; background:var(--ink); }}
.rules span.rhu{{ height:3px; background:var(--rhubarb); }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:12px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.05fr 1fr; }}
.two.b3{{ grid-template-columns:1.15fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}

.sec{{ display:flex; align-items:center; gap:9px; padding:10px 0 6px; overflow:hidden; flex:none; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.1em; font-size:8.4pt;
  color:var(--ink); white-space:nowrap; }}
.lbl.rhubarb{{ color:var(--rhubarb); }} .lbl.duck{{ color:var(--duck); }}
.lbl.daffodil{{ color:var(--daffodil); }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.5in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.2px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.85in; }} .blank.w3{{ flex:none; width:.52in; }}
.blank.num{{ flex:none; width:.75in; }} .blank.c{{ flex:none; width:.2in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

.box{{ width:11px; height:11px; border:1.4px solid var(--strong); flex:none; margin-bottom:3px;
  border-radius:50%; }}
.box.rhubarb{{ border-color:var(--rhubarb); }} .box.duck{{ border-color:var(--duck); }}
.box.daffodil{{ border-color:var(--daffodil); }}
.box.a{{ border-color:var(--duck); }} .box.b{{ border-color:var(--rhubarb); }}
.box.c{{ border-color:var(--daffodil); }} .box.d{{ border-color:var(--soft); }}
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

.warn{{ border:1.5px solid var(--duck); border-radius:3px; padding:11px 13px; margin:10px 0;
  flex:none; }}
.warn b{{ font-size:9.6pt; }}
.warn p{{ margin:5px 0 0; font-size:9.3pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.dy{{ display:grid; grid-template-columns:1.02in minmax(0,1fr) .85in; gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.5in; }}
.dyn{{ font-size:9.4pt; font-weight:600; padding-bottom:4px; }}
.dyn.a{{ color:var(--duck); }} .dyn.b{{ color:var(--rhubarb); }}
.dyn.c{{ color:var(--daffodil); }} .dyn.d{{ color:var(--soft); }}
.al{{ display:grid; grid-template-columns:.85in minmax(0,1fr) .24in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* page 2 ------------------------------------------------------------------ */
.eg{{ display:grid; grid-template-columns:.24in .72in .95in minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:none; min-height:.32in; border-bottom:1px solid var(--rule); }}
.eg span{{ padding-bottom:5px; font-size:9.4pt; }}
.eg .egn{{ color:var(--rhubarb); font-weight:700; }}
.eg .egh{{ color:var(--soft); font-size:9pt; }}
.mathbox{{ border:1.5px solid var(--rhubarb); border-radius:3px; padding:8px 13px 9px;
  margin-top:11px; flex:none; }}
.mr{{ display:flex; align-items:flex-end; gap:12px; min-height:.28in; }}
.mr .ml{{ flex:1; font-size:9.4pt; color:var(--soft); padding-bottom:4px; }}
.mr.tot{{ border-top:1.4px solid var(--rhubarb); margin-top:4px; padding-top:5px; }}
.mr.tot .ml{{ color:var(--ink); font-weight:700; }}
.blank.mn{{ flex:none; width:.95in; height:.3in; border-bottom-width:1.4px;
  border-bottom-color:var(--rhubarb); }}
.zn{{ display:grid; grid-template-columns:.95fr minmax(0,1.4fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}

/* page 3 ------------------------------------------------------------------ */
.mapbox{{ flex:1 1 auto; min-height:2.6in; display:flex; }}
.mapbox .blank{{ border:1.5px dashed var(--strong); border-radius:4px; height:auto; }}
.hd{{ display:grid; grid-template-columns:.24in minmax(0,1fr) .26in .3in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.22in; }}
.hdn{{ font-size:7.4pt; color:var(--faint); padding-bottom:3px; }}

/* page 4 ------------------------------------------------------------------ */
.bktable{{ flex:1; display:flex; flex-direction:column; }}
.bk{{ display:grid;
  grid-template-columns:minmax(0,1fr) minmax(0,1.5fr) minmax(0,1.2fr) .52in .3in;
  gap:0 9px; align-items:flex-end; flex:1; min-height:.3in; }}
.totals{{ display:flex; gap:26px; justify-content:flex-end; border-top:2px solid var(--ink);
  margin-top:8px; padding-top:9px; flex:none; }}
.tot{{ display:flex; align-items:flex-end; gap:9px; }}
.totlbl{{ font-weight:700; text-transform:uppercase; font-size:8.4pt; color:var(--soft);
  padding-bottom:3px; letter-spacing:.07em; }}

/* pages 5 to 9 ------------------------------------------------------------ */
.ml{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.27in; max-height:.46in; }}
.dcols{{ flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr 1fr; gap:0 .3in; }}
.dblock{{ display:flex; flex-direction:column; min-width:0; }}
.dhead{{ display:flex; align-items:flex-end; gap:10px; border-bottom:2px solid var(--ink);
  padding-bottom:5px; margin-bottom:6px; flex:none; }}
.dhead b{{ font-family:"Marcellus",Georgia,serif; font-weight:400; font-size:13.5pt;
  line-height:1.05; flex:1; }}
.dhead .blank{{ height:.24in; }}
.dhead.duck{{ border-bottom-color:var(--duck); }} .dhead.duck b{{ color:var(--duck); }}
.dhead.rhubarb{{ border-bottom-color:var(--rhubarb); }}
.dhead.rhubarb b{{ color:var(--rhubarb); }}
.dhead.daffodil{{ border-bottom-color:var(--daffodil); }}
.dhead.daffodil b{{ color:var(--daffodil); }}
.dts{{ flex:1; display:flex; flex-direction:column; min-height:0; }}
.dt{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.3in;
  max-height:.8in; border-bottom:1px solid var(--rule); }}
.dttext{{ font-size:9.4pt; padding-bottom:3px; line-height:1.2; }}
.ac{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.15fr) .85in .3in;
  gap:0 9px; align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.bd{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr) .26in .26in .26in .3in;
  gap:0 8px; align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.ar{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .85in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.ty{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.2fr) .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.2px solid var(--ink); margin-top:10px; padding-top:8px; }}
.foot .mark{{ font-family:"Marcellus",Georgia,serif; font-size:9.5pt; color:var(--faint); }}
.dots{{ font-size:6pt; color:var(--rhubarb); letter-spacing:.1em; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-easter.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Four Days Easter Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-easter-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"easter-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"easter-{name}")
        fill_pdf = os.path.join(DIST, f"easter-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["rhubarb"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Four Days &nbsp;&middot;&nbsp; Easter planning kit",
    title="Start<br><em>here.</em>",
    lede="Nine pages for a four-day weekend rather than one lunch: the egg hunt worked out from "
         "the number of children, a hiding map so the last eggs are found in April and not in "
         "July, baskets costed per child, Sunday lunch, and what to do on the other three days.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Page 3 is the one", "print it, and take it outside with a pen"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. Tick the boxes with a click. <b>Save a copy first</b> and keep it as this "
        "year&#8217;s file &mdash; next spring it opens with the baskets, the beds and the hiding "
        "places already in it.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Print page 3 whatever "
        "else you do: it is the hiding map, and it is the only one of these pages you will be "
        "holding while standing in a garden.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "White pages on purpose &mdash; pastel backgrounds eat a cartridge and print muddy",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="Two numbers the kit gives you, so you do not guess",
    s5p="<b>How many eggs:</b> roughly 8&ndash;10 each under three, 12&ndash;15 for three to "
        "fives, 18&ndash;20 for six to nines and 20&ndash;25 above that &mdash; page 2 has the "
        "table and does the multiplication. <b>And what it costs:</b> page 4 has a cost column "
        "per basket and a total, because Easter baskets grow every year when several adults buy "
        "separately and nobody adds it up.",
    license="Personal use only. Print as many copies as you like for your own Easter. Please do "
            "not resell, share or redistribute the files. Fonts: Marcellus and Mulish "
            "(SIL Open Font License).",
    mark="Four days, not one lunch.",
)

PAGE_NAMES = ["The four days", "The hunt, worked out", "The hiding map", "Baskets &amp; the bill",
              "Sunday lunch", "Friday, Saturday, Monday", "Four days of children",
              "Beds &amp; driving", "Tuesday"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["dye"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Marcellus",Georgia,serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Mulish",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Mulish"'),
                 ("--s1:#f2a65a", "--s1:" + C["daffodil"]), ("--s2:#ee6c4d", "--s2:" + C["rhubarb"]),
                 ("--s3:#c43e7a", "--s3:" + C["duck"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-style:italic;", "font-style:normal;")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-easter.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    hp = os.path.join(work, "readme-easter.html")
    open(hp, "w", encoding="utf-8").write(tpl)
    B.to_pdf(hp, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-easter.css")
    doc = pymupdf.open(os.path.join(DIST, "easter-planner-letter-dye-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"easter-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["dye"]
    over = (
        "<style>"
        "h1{font-family:'Marcellus',Georgia,serif;font-weight:400;line-height:1.03;"
        "letter-spacing:-.008em}"
        f"h1 em{{font-style:normal;color:{C['rhubarb']}}}"
        "body{font-family:'Mulish',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['duck']};font-family:'Mulish';font-weight:600;letter-spacing:.18em}}"
        f".rule{{background:{C['rhubarb']};height:4px;width:220px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Mulish';font-weight:600;"
        "letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(31,27,33,.17)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Mulish',Arial,sans-serif;font-weight:600;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>Four days,<br>not one <em>lunch.</em></h1>
          <span class="rule"></span>
          <p class="sub">An Easter kit that works the egg hunt out from the number of children,
          gives you somewhere to write down every hiding place, and costs the baskets before
          you buy them.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated, every year</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>four days.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The page nobody else sells</span>
      <h1>The hiding map.<br><em>Hidden, then found.</em></h1>
      <p class="sub">Sketch the garden, number every hiding place as you hide it, and tick it off
      as it is found. Whatever is still unticked is the egg that turns up behind a radiator in
      July. Beside it, the table that tells you how many eggs to buy in the first place.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[2]}" style="height:1170px"><img src="{imgs[1]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#f3f1f4", "100px", "92px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#f0eef2", "100px", "78px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-easter-{name}.html")
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
        BD.package(DIST, "Four-Days-Easter-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building Easter kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "easter-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "dye", embed_fonts=False))
    print("Wrote easter-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Four-Days-Easter-Kit")


if __name__ == "__main__":
    main()
