#!/usr/bin/env python3
"""Build the Long December Christmas planning kit.

Nine pages for the whole of December rather than one day: a gift list that
tracks money against a cap, a card list with posting deadlines, the food plan,
a lunch timed backwards from when you want to eat, the house and the people
sleeping in it, the day itself, and the week after.

    python3 christmas.py                  # every size / colourway
    python3 christmas.py --only letter-spruce
    python3 christmas.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, math, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-christmas")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Gilda+Display"
          "&family=Manrope:wght@400;500;600;700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="35pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="34pt"),
}

COLORWAYS = {
    # spruce = the day and the house, berry = money and deadlines, brass = people.
    # White paper again: December printing is heavy enough without a coloured ground.
    "spruce": dict(ink="#17201c", soft="#55605a", faint="#8d968f", rule="#e2e7e3",
                   strong="#c3ccc6", spruce="#1f4d3d", berry="#b3372c", brass="#a97c2f"),
    "mono":   dict(ink="#1b1e1c", soft="#5a605c", faint="#929894", rule="#e6e8e7",
                   strong="#c6cac8", spruce="#3a403c", berry="#3a403c", brass="#8b918d"),
}

PAGES = 9
MARK = "December, written down."

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

def sprig(seed=0):
    """A fir sprig, drawn: needle pairs stepped along a quadratic stem."""
    p0, p1, p2 = (16, 116), (58, 44 + seed * 3), (126, 12)
    def at(t):
        u = 1 - t
        return (u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
                u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1])
    parts = [f'<path d="M{p0[0]} {p0[1]} Q{p1[0]} {p1[1]} {p2[0]} {p2[1]}"/>']
    steps = 13
    for i in range(1, steps):
        t = i / steps
        x, y = at(t)
        nx, ny = at(min(t + .02, 1))
        a = math.atan2(ny - y, nx - x)
        ln = 20 - 11 * t                      # needles shorten towards the tip
        for s in (1, -1):
            b = a + s * math.radians(52)
            parts.append(f'<line x1="{x:.1f}" y1="{y:.1f}" '
                         f'x2="{x + ln * math.cos(b):.1f}" y2="{y + ln * math.sin(b):.1f}"/>')
    return (f'<svg class="sprig" viewBox="0 0 140 130" aria-hidden="true">'
            f'<g fill="none" stroke="currentColor" stroke-width="1" '
            f'stroke-linecap="round">{"".join(parts)}</g></svg>')

def sheet(n, title, kicker, body):
    meta = (f'<div class="mini">{field("Date", f"c{n}_date", "w2", "9")}</div>' if n > 1 else '')
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{sprig(n)}{meta}<span class="pageno">{n}<i>/{PAGES}</i></span></div>
  </header>
  <div class="rules"><span></span><span class="spr"></span></div>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="dots">&#9679;&nbsp;&#9679;&nbsp;&#9679;</span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    return sheet(1, "This<br>Christmas.", "Christmas kit &middot; at a glance",
        '<div class="two b46"><section>' +
        sec("The shape of it", "", "spruce") +
        field("Christmas Day at", "c1_where") +
        field("Who is there", "c1_who") +
        '<div class="split2">' + field("Adults", "c1_adults", "w3") +
        field("Children", "c1_kids", "w3") + '</div>' +
        field("Staying over", "c1_staying") +
        field("Travelling on", "c1_travel") +
        field("Christmas Eve is", "c1_eve") +
        field("Boxing Day is", "c1_boxing") +
        sec("Money, decided now", "A number written down is spent slower", "berry") +
        '<div class="split2">' + field("Gifts", "c1_b_gifts", "w2") +
        field("Food &amp; drink", "c1_b_food", "w2") + '</div>' +
        '<div class="split2">' + field("Travel", "c1_b_travel", "w2") +
        field("Everything else", "c1_b_other", "w2") + '</div>' +
        '<div class="capbox">' +
        '<span class="capl">All of it, and not a penny more</span>' +
        blank("c1_cap", "capnum", "17") + '</div>' +
        sec("Who does what", "Christmas is not one person&#8217;s job", "brass") +
        '<div class="jb head"><span>The job</span><span>Whose</span></div>' +
        "".join(f'<div class="jb"><span class="jbn">{t}</span>{blank(f"c1_job_{i}", "", "10.5")}</div>'
                for i, t in enumerate(["Presents", "Food shopping", "Cooking on the day",
                                       "Cards and post", "Washing up"], start=1)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>What we are not doing this year</b>'
        '<p>Fill this in before anything else. Christmas gets heavy because everything from every '
        'previous year is still on the list. Name three things you are dropping &mdash; a card to '
        'everyone, a second pudding, the drive on the day &mdash; and the rest of this kit gets '
        'easier.</p>'
        '</div>' +
        "".join(f'<div class="wl">{check(f"c1_drop_{i}", "berry")}'
                f'{blank(f"c1_drop_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("The one thing that has to be right", "", "spruce") +
        f'<div class="wl">{blank("c1_one", "grow", "10.5")}</div>' +
        sec("Booked, ordered, paid for", "Anything with a date on it", "brass") +
        "".join(f'<div class="wl">{check(f"c1_book_{i}", "brass")}'
                f'{blank(f"c1_book_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        sec("Traditions worth keeping", "") +
        "".join(f'<div class="wl">{blank(f"c1_trad_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

KEY_DATES = [
    ("Last post, second class", "berry"),
    ("Last post, first class", "berry"),
    ("Last post, overseas", "berry"),
    ("Food order placed", "spruce"),
    ("Food order collected", "spruce"),
    ("School / work ends", "brass"),
    ("Tree up", "brass"),
    ("Guests arrive", "brass"),
]

def page_2():
    days = "".join(
        f'<div class="day"><span class="dnum">{i}</span>{blank(f"c2_day_{i}", "grow", "9.5")}'
        f'<span class="c">{check(f"c2_done_{i}", "spruce")}</span></div>'
        for i in range(1, 26))
    keys = "".join(
        f'<div class="kd"><span class="kdl">{lab}</span>{blank(f"c2_key_{i}", "w2", "10")}</div>'
        for i, (lab, _t) in enumerate(KEY_DATES, start=1))
    return sheet(2, "December,<br>day by day.", "Christmas kit &middot; the month",
        '<div class="two b2"><section>' +
        sec("The twenty-five", "Most days should stay empty", "spruce") +
        f'<div class="days">{days}</div>' +
        '</section><section>' +
        sec("Dates that are not yours to move", "Look them up once", "berry") +
        f'<div class="kds">{keys}</div>' +
        '<div class="warn">'
        '<b>The posting dates are the real deadline</b>'
        '<p>Cards and parcels are the one part of Christmas that cannot be done late. Find this '
        'year&#8217;s last posting dates in the first week of December, write them above, and work '
        'back from them &mdash; not from the twenty-fifth.</p>'
        '</div>' +
        sec("Ordered, not bought", "Turkey, ham, a cake, a case of wine", "brass") +
        "".join(f'<div class="wl">{check(f"c2_order_{i}", "brass")}'
                f'{blank(f"c2_order_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        sec("Nobody has claimed these yet", "") +
        "".join(f'<div class="wl">{blank(f"c2_open_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_3():
    head = ('<div class="gift head"><span>Who</span><span>Idea</span>'
            '<span class="w3">Budget</span><span class="w3">Spent</span>'
            '<span class="c">Got</span><span class="c">Wrap</span><span class="c">Sent</span></div>')
    rows = "".join(
        f'<div class="gift">{blank(f"c3_who_{i}", "", "10")}{blank(f"c3_idea_{i}", "", "10")}'
        f'{blank(f"c3_budget_{i}", "w3", "10")}{blank(f"c3_spent_{i}", "w3", "10")}'
        f'<span class="c">{check(f"c3_got_{i}", "spruce")}</span>'
        f'<span class="c">{check(f"c3_wrap_{i}", "brass")}</span>'
        f'<span class="c">{check(f"c3_sent_{i}", "berry")}</span></div>'
        for i in range(1, 25))
    totals = ('<div class="totals">' +
              "".join(f'<div class="tot"><span class="totlbl">{v}</span>'
                      f'{blank(f"c3_t_{k}", "num", "12")}</div>'
                      for k, v in [("budget", "Budgeted"), ("spent", "Spent"),
                                   ("left", "Left")]) + '</div>')
    return sheet(3, "Gifts, and<br>what they cost.", "Christmas kit &middot; the list",
        sec("Everyone, with a number",
            "Fill the budget column first, before you buy anything", "spruce") +
        f'<div class="gifttable">{head}{rows}</div>{totals}')

def page_4():
    head = ('<div class="cd head"><span>Name</span><span>Address / where</span>'
            '<span class="c">Writ</span><span class="c">Post</span></div>')
    rows = "".join(
        f'<div class="cd">{blank(f"c4_name_{i}", "", "10")}{blank(f"c4_addr_{i}", "", "9.5")}'
        f'<span class="c">{check(f"c4_writ_{i}", "brass")}</span>'
        f'<span class="c">{check(f"c4_post_{i}", "berry")}</span></div>'
        for i in range(1, 23))
    return sheet(4, "Cards<br>and post.", "Christmas kit &middot; before the deadline",
        '<div class="two b46"><section>' +
        sec("The list", "Overseas first &mdash; they leave weeks earlier", "spruce") +
        f'<div class="cdtable">{head}{rows}</div>' +
        '</section><section>' +
        sec("Parcels going out", "", "berry") +
        '<div class="pc head"><span>To</span><span class="w2">Post by</span>'
        '<span class="c">Gone</span></div>' +
        "".join(f'<div class="pc">{blank(f"c4_pto_{i}", "", "10")}'
                f'{blank(f"c4_pby_{i}", "w2", "10")}'
                f'<span class="c">{check(f"c4_pgone_{i}", "berry")}</span></div>'
                for i in range(1, 8)) +
        sec("What you need before you start", "", "brass") +
        "".join(f'<div class="wl">{check(f"c4_kit_{i}", "brass")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Cards, and six more than you think",
                                       "Stamps &mdash; two sizes, and overseas ones",
                                       "Addresses, from last year&#8217;s envelopes",
                                       "Tape, tags, and paper that is not glittery",
                                       "A pen that does not smudge"], start=1)) +
        sec("Cards that arrived and want an answer") +
        "".join(f'<div class="wl">{blank(f"c4_in_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        '</section></div>')

def page_5():
    def rows(prefix, n, tone="spruce"):
        return "".join(f'<div class="ml">{blank(f"{prefix}_{i}", "", "10.5")}'
                       f'{blank(f"{prefix}_who_{i}", "w2", "9.5")}'
                       f'<span class="c">{check(f"{prefix}_ok_{i}", tone)}</span></div>'
                       for i in range(1, n + 1))
    return sheet(5, "What we<br>are eating.", "Christmas kit &middot; the food plan",
        '<div class="two b46"><section>' +
        sec("The meal", "Who makes it, not just what it is", "spruce") +
        '<div class="ml head"><span>Dish</span><span class="w2">Who</span>'
        '<span class="c">Got</span></div>' +
        rows("c5_main", 10) +
        sec("Pudding, cheese, chocolate", "", "brass") +
        rows("c5_swt", 4, "brass") +
        sec("The bits nobody remembers") +
        "".join(f'<div class="wl">{check(f"c5_bit_{i}", "spruce")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Bread, butter, gravy, sauces",
                                       "Milk and cream &mdash; twice what you think",
                                       "Foil, cling film, freezer bags for the leftovers",
                                       "A proper meal for whoever eats no meat"], start=1)) +
        '</section><section>' +
        sec("Drink", "Count the non-drinkers too", "brass") +
        rows("c5_drink", 5, "brass") +
        sec("Who cannot eat what", "Ask now, not on the day", "berry") +
        "".join(f'<div class="al">{blank(f"c5_al_who_{i}", "w2", "10")}'
                f'{blank(f"c5_al_what_{i}", "", "10")}'
                f'<span class="c">{check(f"c5_al_ok_{i}", "berry")}</span></div>'
                for i in range(1, 5)) +
        sec("Buy early, it keeps", "", "spruce") +
        "".join(f'<div class="wl">{check(f"c5_early_{i}", "spruce")}'
                f'{blank(f"c5_early_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("Buy on the last day, it will not", "") +
        "".join(f'<div class="wl">{check(f"c5_late_{i}")}'
                f'{blank(f"c5_late_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_6():
    head = ('<div class="oven head"><span>Dish</span><span class="w3">Temp</span>'
            '<span class="w3">Mins</span><span class="w3">In at</span>'
            '<span class="w3">Out at</span><span class="c">&#10003;</span></div>')
    rows = "".join(
        f'<div class="oven">{blank(f"c6_dish_{i}", "", "10")}{blank(f"c6_temp_{i}", "w3", "10")}'
        f'{blank(f"c6_mins_{i}", "w3", "10")}{blank(f"c6_in_{i}", "w3", "10")}'
        f'{blank(f"c6_out_{i}", "w3", "10")}'
        f'<span class="c">{check(f"c6_done_{i}", "spruce")}</span></div>'
        for i in range(1, 13))
    return sheet(6, "Lunch, timed<br>backwards.", "Christmas kit &middot; the one that saves the day",
        '<div class="servebar">'
        '<span class="servel">We are eating at</span>' + blank("c6_serve", "servenum", "20") +
        '<span class="servehint">Write this first. Everything below counts back from it.</span>'
        '</div>' +
        '<div class="two b8"><section>' +
        sec("Every dish, and when it goes in", "", "spruce") +
        f'<div class="oventable">{head}{rows}</div>' +
        '</section><section>' +
        '<div class="warn">'
        '<b>How to fill this in</b>'
        '<p>Start with the thing that takes longest and the thing that must rest. Write its '
        '<b>out at</b> time, subtract the minutes, and you have <b>in at</b>. Then fit everything '
        'else around it. Two dishes wanting different temperatures at the same time is the problem '
        'you want to find today, not on the day.</p>'
        '</div>' +
        sec("Resting, and what happens while it rests", "This is when the rest goes in", "berry") +
        '<div class="split2">' + field("Rests from", "c6_rest_from", "w2") +
        field("To", "c6_rest_to", "w2") + '</div>' +
        "".join(f'<div class="wl">{check(f"c6_rest_{i}", "berry")}'
                f'{blank(f"c6_rest_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Done the day before", "", "brass") +
        "".join(f'<div class="wl">{check(f"c6_prep_{i}", "brass")}'
                f'{blank(f"c6_prep_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        sec("On the table, not in the oven") +
        "".join(f'<div class="wl">{check(f"c6_table_{i}", "spruce")}'
                f'{blank(f"c6_table_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

ROOMS = ["Tree", "Front door", "Hall", "Living room", "Table", "Kitchen", "Spare room"]

def page_7():
    rooms = "".join(
        f'<div class="rm"><span class="rmname">{r}</span>{blank(f"c7_room_{i}", "", "10.5")}'
        f'<span class="c">{check(f"c7_done_{i}", "spruce")}</span></div>'
        for i, r in enumerate(ROOMS, start=1))
    beds = "".join(
        f'<div class="bed">{blank(f"c7_guest_{i}", "", "10.5")}{blank(f"c7_bed_{i}", "", "10")}'
        f'<span class="c">{check(f"c7_linen_{i}", "brass")}</span>'
        f'<span class="c">{check(f"c7_towel_{i}", "brass")}</span></div>'
        for i in range(1, 7))
    return sheet(7, "The house,<br>and the beds.", "Christmas kit &middot; before anyone arrives",
        '<div class="two b46"><section>' +
        sec("Room by room", "One idea each is plenty", "spruce") +
        '<div class="rm head"><span>Where</span><span>What goes there</span>'
        '<span class="c">Done</span></div>' + rooms +
        sec("The tree", "", "spruce") +
        '<div class="split2">' + field("Bought on", "c7_tree_when", "w2") +
        field("Up on", "c7_tree_up", "w2") + '</div>' +
        "".join(f'<div class="wl">{check(f"c7_tree_{i}", "spruce")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Lights tested before they go on",
                                       "Water it &mdash; a real tree drinks daily",
                                       "Nothing breakable at toddler or dog height"], start=1)) +
        sec("The things that go missing every year") +
        "".join(f'<div class="wl">{check(f"c7_find_{i}", "spruce")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["The stockings",
                                       "Spare bulbs and fuses for the lights",
                                       "The good tablecloth and the napkins",
                                       "Crackers, and somewhere to hide them",
                                       "The tree stand"], start=1)) +
        '</section><section>' +
        sec("Who is sleeping where", "", "brass") +
        '<div class="bed head"><span>Who</span><span>Where</span>'
        '<span class="c">Bed</span><span class="c">Twl</span></div>' + beds +
        sec("Things guests always need and never bring", "", "brass") +
        "".join(f'<div class="wl">{check(f"c7_sp_{i}", "brass")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["A spare toothbrush and toothpaste",
                                       "A phone charger by the bed",
                                       "An extra blanket, and where the heating is",
                                       "Somewhere to put a suitcase down"], start=1)) +
        sec("Where the boxes live", "Thank yourself in January") +
        f'<div class="wl">{blank("c7_boxes", "grow", "10.5")}</div>' +
        sec("Done before the doorbell", "", "berry") +
        "".join(f'<div class="wl">{check(f"c7_pre_{i}", "berry")}'
                f'{blank(f"c7_pre_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

BEATS = [("Awake, and the first cup of tea", "Before the first present, not after"),
         ("Presents", "Slower than anyone wants; someone collects the paper"),
         ("Breakfast that is not the lunch", "Otherwise nobody eats until four"),
         ("Kitchen closes to visitors", "One cook, one helper, everyone else out"),
         ("Lunch", "The time from page 6, said out loud the night before"),
         ("The walk, or the quiet hour", "The part people remember"),
         ("Calls to whoever is not here", "Put a time on it or it slips"),
         ("Games, film, leftovers", "Nothing more is cooked today")]

def page_8():
    rows = "".join(
        f'<div class="rs">{blank(f"c8_time_{i}", "w3", "10")}{blank(f"c8_what_{i}", "", "10.5")}'
        f'{blank(f"c8_who_{i}", "w2", "10")}</div>' for i in range(1, 14))
    beats = "".join(
        f'<div class="beat"><span class="bnum">{i}</span>'
        f'<div class="btext"><b>{t}</b><span>{d}</span></div>'
        f'{blank(f"c8_beat_{i}", "w3", "10")}</div>'
        for i, (t, d) in enumerate(BEATS, start=1))
    return sheet(8, "The day<br>itself.", "Christmas kit &middot; run of show",
        '<div class="two b8"><section>' +
        sec("Hour by hour", "Only the things that need a time", "spruce") +
        '<div class="rs head"><span class="w3">Time</span><span>What happens</span>'
        '<span class="w2">Who is on it</span></div>' + rows +
        sec("Photographs somebody has to take", "", "brass") +
        "".join(f'<div class="wl">{check(f"c8_ph_{i}", "brass")}'
                f'{blank(f"c8_ph_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("Eight beats", "Write the time next to each", "berry") +
        f'<div class="beats">{beats}</div>' +
        sec("Whoever is having a hard day") +
        "".join(f'<div class="wl">{blank(f"c8_care_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

def page_9():
    return sheet(9, "The week<br>after.", "Christmas kit &middot; while it is fresh",
        '<div class="two b46"><section>' +
        sec("Returns", "Most shops give until mid-January &mdash; but check", "berry") +
        '<div class="rt head"><span>What</span><span class="w2">From</span>'
        '<span class="w2">By when</span><span class="c">Done</span></div>' +
        "".join(f'<div class="rt">{blank(f"c9_rt_{i}", "", "10")}'
                f'{blank(f"c9_rt_from_{i}", "w2", "10")}{blank(f"c9_rt_by_{i}", "w2", "10")}'
                f'<span class="c">{check(f"c9_rt_ok_{i}", "berry")}</span></div>'
                for i in range(1, 7)) +
        sec("Thank-yous owed", "Let the children write their own", "brass") +
        '<div class="ty head"><span>To</span><span>For</span><span class="c">Sent</span></div>' +
        "".join(f'<div class="ty">{blank(f"c9_ty_who_{i}", "", "10")}'
                f'{blank(f"c9_ty_what_{i}", "", "10")}'
                f'<span class="c">{check(f"c9_ty_ok_{i}", "brass")}</span></div>'
                for i in range(1, 8)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>Buy next year&#8217;s Christmas this week</b>'
        '<p>Cards, paper, crackers, lights and decorations are half price from the twenty-seventh. '
        'Buy them now, put them in one labelled box with the decorations, and write on the lid what '
        'is inside. It is the cheapest hour you will spend on next Christmas.</p>'
        '</div>' +
        sec("Bought in the sales, in the box", "", "spruce") +
        "".join(f'<div class="wl">{check(f"c9_box_{i}", "spruce")}'
                f'{blank(f"c9_box_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("What we spent, honestly", "", "berry") +
        '<div class="split2">' + field("Planned", "c9_planned", "w2") +
        field("Actual", "c9_actual", "w2") + '</div>' +
        sec("Keep, change, drop", "Before you forget") +
        "".join(f'<div class="wl">{blank(f"c9_note_{i}", "grow", "10.5")}</div>'
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
  --spruce:{C["spruce"]}; --berry:{C["berry"]}; --brass:{C["brass"]};
  --backdrop:#e9ede9;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#131714; }} }}
:root[data-theme="dark"]{{ --backdrop:#131714; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Manrope","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(23,32,28,.16);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:600; text-transform:uppercase; letter-spacing:.16em; font-size:7.4pt;
  color:var(--soft); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in; }}
.mast h1{{ font-family:"Gilda Display","Georgia",serif; font-weight:400; font-size:{S["display"]};
  line-height:1.0; margin:6px 0 0; letter-spacing:-.005em; }}
.mastright{{ display:flex; align-items:flex-end; gap:13px; position:relative; }}
.sprig{{ position:absolute; right:-8px; top:-62px; width:1.3in; height:1.2in;
  color:var(--strong); }}
.pageno{{ font-family:"Gilda Display",Georgia,serif; font-size:16pt; color:var(--spruce); }}
.pageno i{{ font-style:normal; font-size:9pt; color:var(--faint); }}
.mini{{ display:flex; gap:10px; padding-bottom:3px; }}
.mini .fr{{ height:.22in; }}
.rules{{ display:flex; flex-direction:column; gap:2px; padding-top:9px; flex:none; }}
.rules span{{ height:1.2px; background:var(--ink); }}
.rules span.spr{{ height:3px; background:var(--spruce); }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:12px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.05fr 1fr; }}
.two.b8{{ grid-template-columns:1.3fr 1fr; }}
.two.b2{{ grid-template-columns:1fr 1.06fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}
.gap{{ height:12px; flex:none; }}

.sec{{ display:flex; align-items:center; gap:9px; padding:10px 0 6px; overflow:hidden; flex:none; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.09em; font-size:8.6pt;
  color:var(--ink); white-space:nowrap; }}
.lbl.spruce{{ color:var(--spruce); }} .lbl.berry{{ color:var(--berry); }}
.lbl.brass{{ color:var(--brass); }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.5in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.2px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.85in; }} .blank.w3{{ flex:none; width:.52in; }}
.blank.num{{ flex:none; width:.75in; }} .blank.c{{ flex:none; width:.2in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

.box{{ width:11px; height:11px; border:1.4px solid var(--strong); flex:none; margin-bottom:3px;
  border-radius:2px; }}
.box.spruce{{ border-color:var(--spruce); }} .box.berry{{ border-color:var(--berry); }}
.box.brass{{ border-color:var(--brass); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.28in; max-height:.52in; }}
.rtext{{ font-size:10pt; padding-bottom:3px; line-height:1.15; }}
.footnote{{ font-size:8.4pt; color:var(--faint); line-height:1.4; padding-top:8px; display:block; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:5px; border-bottom:1.5px solid var(--ink); margin-bottom:5px;
  font-weight:600; text-transform:uppercase; letter-spacing:.07em; font-size:7pt;
  color:var(--soft); }}
.head span, .head .blank{{ border:0; }}

.warn{{ border:1.5px solid var(--spruce); border-radius:3px; padding:11px 13px; margin:10px 0;
  flex:none; }}
.warn b{{ font-size:9.6pt; }}
.warn p{{ margin:5px 0 0; font-size:9.3pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.capbox{{ border:1.5px solid var(--berry); border-radius:3px; padding:9px 13px 10px;
  margin-top:10px; display:flex; align-items:flex-end; gap:12px; flex:none; }}
.capl{{ font-size:8.6pt; color:var(--soft); line-height:1.25; padding-bottom:3px; }}
.blank.capnum{{ flex:none; width:1.15in; border-bottom-width:1.5px;
  border-bottom-color:var(--berry); height:.34in; }}

.jb{{ display:grid; grid-template-columns:1.05fr minmax(0,1.35fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.jbn{{ font-size:9.8pt; padding-bottom:4px; }}

/* page 2 ------------------------------------------------------------------ */
.days{{ flex:1; display:flex; flex-direction:column; min-height:0; }}
.day{{ display:grid; grid-template-columns:.24in minmax(0,1fr) .24in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.2in; }}
.dnum{{ font-family:"Gilda Display",Georgia,serif; font-size:9.5pt; color:var(--faint);
  padding-bottom:2px; }}
.day:nth-child(25) .dnum{{ color:var(--berry); }}
.kds{{ flex:none; }}
.kd{{ display:flex; align-items:flex-end; gap:10px; min-height:.3in; padding-bottom:1px; }}
.kdl{{ font-size:9.4pt; color:var(--ink); flex:1; padding-bottom:4px;
  border-bottom:1.2px dotted var(--rule); }}

/* page 3 ------------------------------------------------------------------ */
.gifttable{{ flex:1; display:flex; flex-direction:column; }}
.gift{{ display:grid;
  grid-template-columns:minmax(0,1.15fr) minmax(0,1.6fr) .52in .52in .26in .26in .26in;
  gap:0 8px; align-items:flex-end; flex:1; min-height:.24in; }}
.totals{{ display:flex; gap:26px; justify-content:flex-end; border-top:2px solid var(--ink);
  margin-top:8px; padding-top:9px; }}
.tot{{ display:flex; align-items:flex-end; gap:9px; }}
.totlbl{{ font-weight:700; text-transform:uppercase; font-size:8.4pt; color:var(--soft);
  padding-bottom:3px; letter-spacing:.07em; }}

/* page 4 ------------------------------------------------------------------ */
.cdtable{{ flex:1; display:flex; flex-direction:column; }}
.cd{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.25fr) .26in .26in;
  gap:0 8px; align-items:flex-end; flex:1; min-height:.24in; }}
.pc{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* pages 5 to 9 ------------------------------------------------------------ */
.ml{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.27in; max-height:.44in; }}
.al{{ display:grid; grid-template-columns:.85in minmax(0,1fr) .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.servebar{{ display:flex; align-items:flex-end; gap:14px; border:1.5px solid var(--berry);
  border-radius:3px; padding:10px 14px 11px; margin-bottom:11px; flex:none; }}
.servel{{ font-weight:700; text-transform:uppercase; letter-spacing:.09em; font-size:9pt;
  color:var(--berry); padding-bottom:5px; white-space:nowrap; }}
.blank.servenum{{ flex:none; width:1.35in; border-bottom-width:1.5px;
  border-bottom-color:var(--berry); height:.36in; }}
.servehint{{ font-size:8.4pt; color:var(--faint); padding-bottom:5px; flex:1;
  text-align:right; }}
.oventable{{ flex:1; display:flex; flex-direction:column; }}
.oven{{ display:grid; grid-template-columns:minmax(0,1fr) .52in .52in .52in .52in .26in;
  gap:0 8px; align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.rm{{ display:grid; grid-template-columns:1.05fr minmax(0,1.4fr) .26in; gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.29in; max-height:.46in; }}
.rmname{{ font-size:9.8pt; padding-bottom:4px; }}
.bed{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr) .26in .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.rs{{ display:grid; grid-template-columns:.52in minmax(0,1fr) .85in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.29in; max-height:.46in; }}
.rt{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .85in .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.ty{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.15fr) .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.beats{{ display:flex; flex-direction:column; flex:1 1 auto; padding-bottom:4px; }}
.beat{{ display:grid; grid-template-columns:.26in minmax(0,1fr) .52in; gap:0 9px;
  align-items:center; flex:1 1 auto; min-height:.38in; max-height:.66in;
  border-bottom:1px solid var(--rule); }}
.bnum{{ font-family:"Gilda Display",Georgia,serif; font-size:12pt; color:var(--berry); }}
.btext b{{ display:block; font-size:9.5pt; font-weight:600; line-height:1.15; }}
.btext span{{ display:block; font-size:8.2pt; color:var(--faint); line-height:1.2; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.2px solid var(--ink); margin-top:10px; padding-top:8px; }}
.foot .mark{{ font-family:"Gilda Display",Georgia,serif; font-size:9.5pt; color:var(--faint); }}
.dots{{ font-size:6pt; color:var(--spruce); letter-spacing:.1em; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-christmas.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Long December Christmas Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-christmas-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"christmas-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"christmas-{name}")
        fill_pdf = os.path.join(DIST, f"christmas-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["spruce"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Long December &nbsp;&middot;&nbsp; Christmas planning kit",
    title="Start<br><em>here.</em>",
    lede="Nine pages for the whole of December, not just the twenty-fifth: a gift list that keeps "
         "count of the money, a card list with the posting deadlines, the food, a lunch timed "
         "backwards from when you want to eat, the house, the day itself, and the week after.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Page 3 and page 6", "the gift list and the lunch timing &mdash; start with those"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. Tick the boxes with a click. <b>Save a copy first</b> and keep it as this "
        "year&#8217;s file &mdash; next December it opens as a head start rather than a blank page, "
        "with last year&#8217;s gift list and addresses already in it.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Whatever else you do, "
        "print page 6 and put it on the kitchen wall: it is the lunch timed backwards from the hour "
        "you want to eat, and it is the page that stops the day going wrong.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "White pages on purpose &mdash; a colour-filled background eats a cartridge",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="Two dates to look up in the first week of December",
    s5p="The kit leaves them blank on purpose, because they move every year and they are different "
        "in every country: <b>the last posting dates</b> (second class, first class, overseas) and "
        "<b>the return deadline</b> for anything you buy as a gift. Write them on page 2 and page 9, "
        "and the rest of the month works backwards from them.",
    license="Personal use only. Print as many copies as you like for your own Christmas. Please do "
            "not resell, share or redistribute the files. Fonts: Gilda Display and Manrope "
            "(SIL Open Font License).",
    mark="December, written down.",
)

PAGE_NAMES = ["At a glance", "The month", "Gifts &amp; budget", "Cards &amp; post",
              "The food plan", "Lunch, timed backwards", "House &amp; beds",
              "The day itself", "The week after"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["spruce"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Gilda Display",Georgia,serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Manrope",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Manrope"'),
                 ("--s1:#f2a65a", "--s1:" + C["brass"]), ("--s2:#ee6c4d", "--s2:" + C["berry"]),
                 ("--s3:#c43e7a", "--s3:" + C["spruce"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-style:italic;", "font-style:normal;")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-christmas.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    hp = os.path.join(work, "readme-christmas.html")
    open(hp, "w", encoding="utf-8").write(tpl)
    B.to_pdf(hp, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-christmas.css")
    doc = pymupdf.open(os.path.join(DIST, "christmas-planner-letter-spruce-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"christmas-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["spruce"]
    over = (
        "<style>"
        "h1{font-family:'Gilda Display',Georgia,serif;font-weight:400;line-height:1.02;"
        "letter-spacing:-.01em}"
        f"h1 em{{font-style:normal;color:{C['spruce']}}}"
        "body{font-family:'Manrope',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['berry']};font-family:'Manrope';font-weight:600;letter-spacing:.18em}}"
        f".rule{{background:{C['spruce']};height:4px;width:220px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Manrope';font-weight:600;"
        "letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(23,32,28,.18)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Manrope',Arial,sans-serif;font-weight:600;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>The whole<br>of <em>December.</em></h1>
          <span class="rule"></span>
          <p class="sub">A Christmas planning kit that keeps count of the money, remembers the
          posting deadlines, and times Christmas lunch backwards from the hour you want to eat.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated, use every year</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>one December.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The two pages people come back for</span>
      <h1>The gift list.<br><em>The oven clock.</em></h1>
      <p class="sub">Every name with a budget beside it and a running total, so December is not a
      surprise in January. Then lunch written backwards from the time you sit down, so two dishes
      never want the oven at once.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[2]}" style="height:1170px"><img src="{imgs[5]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#f1f4f1", "100px", "92px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#eef2ef", "100px", "80px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-christmas-{name}.html")
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
        BD.package(DIST, "Long-December-Christmas-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building Christmas kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "christmas-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "spruce", embed_fonts=False))
    print("Wrote christmas-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Long-December-Christmas-Kit")


if __name__ == "__main__":
    main()
