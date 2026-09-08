#!/usr/bin/env python3
"""Build the Five to Midnight New Year kit.

Nine pages for the night and the turn: a party run backwards from 00:00, a
guest list that asks how everyone is getting home, the bottle arithmetic, then
the year in twelve lines, what not to carry into the next one, and the boring
first week of January nobody plans.

    python3 newyear.py                  # every size / colourway
    python3 newyear.py --only letter-midnight
    python3 newyear.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, math, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-newyear")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Syne:wght@600;700;800"
          "&family=Hanken+Grotesk:wght@400;500;600;700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="37pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="36pt"),
}

COLORWAYS = {
    # midnight = the clock and the night, gold = the toast, plum = the year behind you.
    "midnight": dict(ink="#171a2b", soft="#525774", faint="#8d92a8", rule="#e3e4ec",
                     strong="#c2c4d3", midnight="#2b2d6b", gold="#9a7b1f", plum="#6b3560"),
    "mono":     dict(ink="#1b1c22", soft="#5a5c66", faint="#93959d", rule="#e6e7ea",
                     strong="#c6c7cc", midnight="#3a3b44", gold="#8b8d95", plum="#3a3b44"),
}

PAGES = 9
MARK = "Backwards from midnight."

# Rough pouring arithmetic, printed in the kit: a 750 ml bottle is about six
# flutes for a toast, or five glasses of wine across an evening.
BOTTLES = [
    ("6 people", "1 bottle", "3 bottles"),
    ("12 people", "2 bottles", "6 bottles"),
    ("20 people", "4 bottles", "10 bottles"),
    ("30 people", "5 bottles", "15 bottles"),
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

def clock(seed=1):
    """A clock face, drawn, at five to midnight — and one minute later each page."""
    cx, cy, r = 68, 62, 36
    minute = 54 + seed                      # 11:55 on page 1, 11:59 by the last
    parts = [f'<circle cx="{cx}" cy="{cy}" r="{r}"/>']
    for i in range(12):
        a = math.radians(i * 30 - 90)
        long = 7 if i % 3 == 0 else 4
        parts.append(f'<line x1="{cx + (r - 2) * math.cos(a):.1f}" '
                     f'y1="{cy + (r - 2) * math.sin(a):.1f}" '
                     f'x2="{cx + (r - 2 - long) * math.cos(a):.1f}" '
                     f'y2="{cy + (r - 2 - long) * math.sin(a):.1f}"/>')
    am = math.radians(minute * 6 - 90)      # minute hand
    ah = math.radians((11 + minute / 60) * 30 - 90)   # hour hand, just short of twelve
    parts.append(f'<line x1="{cx}" y1="{cy}" x2="{cx + (r - 9) * math.cos(am):.1f}" '
                 f'y2="{cy + (r - 9) * math.sin(am):.1f}" stroke-width="1.4"/>')
    parts.append(f'<line x1="{cx}" y1="{cy}" x2="{cx + (r - 18) * math.cos(ah):.1f}" '
                 f'y2="{cy + (r - 18) * math.sin(ah):.1f}" stroke-width="1.8"/>')
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="2" fill="currentColor"/>')
    return (f'<svg class="clock" viewBox="0 0 136 128" aria-hidden="true">'
            f'<g fill="none" stroke="currentColor" stroke-width="1" '
            f'stroke-linecap="round">{"".join(parts)}</g></svg>')

def sheet(n, title, kicker, body):
    meta = (f'<div class="mini">{field("Date", f"n{n}_date", "w2", "9")}</div>' if n > 1 else '')
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{clock(n)}{meta}<span class="pageno">{n}<i>/{PAGES}</i></span></div>
  </header>
  <div class="rules"><span></span><span class="mid"></span></div>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="dots">&#9679;&nbsp;&#9679;&nbsp;&#9679;</span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    return sheet(1, "The last<br>night.", "New Year kit &middot; at a glance",
        '<div class="two b46"><section>' +
        sec("The night", "", "midnight") +
        field("Where", "n1_where") + field("Whose place", "n1_whose") +
        '<div class="split2">' + field("Doors", "n1_doors", "w3") +
        field("Ends", "n1_ends", "w3") + '</div>' +
        field("How many", "n1_count", "w2") +
        field("Dress", "n1_dress") +
        field("Music by", "n1_music") +
        field("Budget", "n1_budget", "w2") +
        sec("What kind of night is this", "Decide it now", "gold") +
        '<div class="kinds">' +
        "".join(f'<div class="kind">{check(f"n1_kind_{i}", "gold")}'
                f'<span class="kindlbl">{lab}</span></div>'
                for i, lab in enumerate(["A party", "Six people and a good dinner",
                                         "Out, then back here", "Children up till midnight",
                                         "Two of us and something better than usual",
                                         "Asleep by eleven, on purpose"], start=1)) +
        '</div>' +
        sec("Midnight itself", "Decide it in advance", "midnight") +
        "".join(f'<div class="wl">{blank(f"n1_mid_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>The two things that ruin New Year&#8217;s Eve</b>'
        '<p>Not enough to eat after eleven, and no way home. Everything else is decoration. '
        'Page 3 puts food on the table twice, and page 2 asks every guest how they are getting '
        'home <b>before</b> they arrive &mdash; because at one in the morning on the first of '
        'January there are no taxis, and there is no talking anyone out of driving.</p>'
        '</div>' +
        sec("Booked, ordered, paid for", "", "gold") +
        "".join(f'<div class="wl">{check(f"n1_book_{i}", "gold")}'
                f'{blank(f"n1_book_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("The bits that make it feel like New Year", "", "plum") +
        "".join(f'<div class="wl">{check(f"n1_bit_{i}", "plum")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Something fizzy, and something fizzy without alcohol",
                                       "Enough glasses out before eleven",
                                       "Whatever is on the television, found in advance",
                                       "A song for the first minute of the year",
                                       "A photograph, taken before everyone is tired"], start=1)) +
        sec("Tomorrow morning", "Set it up tonight") +
        "".join(f'<div class="wl">{blank(f"n1_tom_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

def page_2():
    head = ('<div class="gl head"><span>#</span><span>Name</span>'
            '<span>Getting home how</span><span class="c">Inv</span><span class="c">Yes</span>'
            '<span class="c">No</span><span class="c">Bed</span><span>Bringing</span></div>')
    rows = "".join(
        f'<div class="gl"><span class="idx">{i:02d}</span>{blank(f"n2_name_{i}", "", "10")}'
        f'{blank(f"n2_home_{i}", "", "10")}'
        f'<span class="c">{check(f"n2_inv_{i}", "midnight")}</span>'
        f'<span class="c">{check(f"n2_yes_{i}", "gold")}</span>'
        f'<span class="c">{check(f"n2_no_{i}")}</span>'
        f'<span class="c">{check(f"n2_bed_{i}", "plum")}</span>'
        f'{blank(f"n2_bring_{i}", "", "9.5")}</div>'
        for i in range(1, 21))
    totals = ('<div class="totals">' +
              "".join(f'<div class="tot">{blank(f"n2_t_{k}", "num", "11")}'
                      f'<span class="totlbl">{v}</span></div>'
                      for k, v in [("inv", "Invited"), ("yes", "Coming"), ("no", "Can&#8217;t"),
                                   ("bed", "Staying"), ("drive", "Driving")]) + '</div>')
    return sheet(2, "Who is here,<br>and how they leave.", "New Year kit &middot; guest list",
        sec("Ask the second question too",
            "&#8220;How are you getting home?&#8221;", "midnight") +
        f'<div class="gltable">{head}{rows}</div>{totals}' +
        '<div class="warn" style="margin-bottom:0">'
        '<b>Beds, sofas and a spare toothbrush</b>'
        '<p>Tick the <b>Bed</b> column for anyone who might stay, and count them now rather than '
        'at midnight. Two people who planned to drive and changed their minds is the usual number. '
        'Blankets, a spare toothbrush and somewhere dark to sleep cost you nothing in advance and '
        'are impossible to produce at two in the morning.</p>'
        '</div>')

BEATS = [("Food out, the first time", "Before anyone has had three drinks"),
         ("Music up, lights down", "The room changes or it does not"),
         ("Glasses out, all of them", "Counted, on a table, not in a cupboard"),
         ("Bottles opened and poured", "Ten minutes before, not on the hour"),
         ("Everyone into one room", "The hardest five minutes of the night"),
         ("MIDNIGHT", "Whatever you decided on page 1"),
         ("Phone calls and messages", "The network is busy; give it ten minutes"),
         ("Food out, the second time", "This is the one people remember"),
         ("Taxis, coats, beds", "Say it out loud once, kindly")]

def page_3():
    rows = "".join(
        f'<div class="rs">{blank(f"n3_time_{i}", "w3", "10")}{blank(f"n3_what_{i}", "", "10.5")}'
        f'{blank(f"n3_who_{i}", "w2", "10")}</div>' for i in range(1, 13))
    beats = "".join(
        f'<div class="beat{" mid" if t == "MIDNIGHT" else ""}"><span class="bnum">{i}</span>'
        f'<div class="btext"><b>{t}</b><span>{d}</span></div>'
        f'{blank(f"n3_beat_{i}", "w3", "10")}</div>'
        for i, (t, d) in enumerate(BEATS, start=1))
    return sheet(3, "Backwards<br>from midnight.", "New Year kit &middot; run of show",
        '<div class="anchor">'
        '<span class="anchorl">Everything counts back from</span>'
        '<span class="anchornum">00:00</span>'
        '<span class="anchorhint">The only fixed deadline in the whole shop</span>'
        '</div>' +
        '<div class="two b8"><section>' +
        sec("Hour by hour", "Start at eight and work down", "midnight") +
        '<div class="rs head"><span class="w3">Time</span><span>What happens</span>'
        '<span class="w2">Who is on it</span></div>' + rows +
        '</section><section>' +
        sec("Nine beats", "Write the time next to each", "gold") +
        f'<div class="beats">{beats}</div>' +
        '</section></div>')

def page_4():
    bands = "".join(
        f'<div class="bt">{check(f"n4_band_{i}", "gold")}'
        f'<span class="btp">{ppl}</span><span class="btt">{toast}</span>'
        f'<span class="bte">{evening}</span></div>'
        for i, (ppl, toast, evening) in enumerate(BOTTLES, start=1))
    def rows(prefix, n, tone="midnight"):
        return "".join(f'<div class="ml">{blank(f"{prefix}_{i}", "", "10.5")}'
                       f'{blank(f"{prefix}_who_{i}", "w2", "9.5")}'
                       f'<span class="c">{check(f"{prefix}_ok_{i}", tone)}</span></div>'
                       for i in range(1, n + 1))
    return sheet(4, "Food twice,<br>drink counted.", "New Year kit &middot; the table",
        '<div class="two b46"><section>' +
        sec("Before eleven", "Grazing, not a sit-down", "midnight") +
        '<div class="ml head"><span>What</span><span class="w2">Who</span>'
        '<span class="c">Got</span></div>' + rows("n4_early", 8) +
        sec("After midnight", "Hot, salty, and made in advance", "gold") +
        rows("n4_late", 6, "gold") +
        '<span class="footnote">The second round of food is the one people talk about the next '
        'day. It does not have to be clever &mdash; it has to exist, and it has to appear without '
        'anybody cooking at half past midnight.</span>' +
        '</section><section>' +
        sec("How many bottles", "One bottle is about six flutes", "gold") +
        '<div class="bt head"><span></span><span class="btp">People</span>'
        '<span class="btt">For the toast</span><span class="bte">The whole evening</span></div>' +
        bands +
        '<span class="footnote">The evening column assumes about half a bottle of wine a head '
        'across the night. Round up. Nobody has ever regretted one bottle too many in the '
        'cupboard on the second of January.</span>' +
        sec("Not drinking", "Count them properly; make it as good", "plum") +
        "".join(f'<div class="wl">{check(f"n4_nd_{i}", "plum")}'
                f'{blank(f"n4_nd_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Ice, glasses, and the rest", "") +
        "".join(f'<div class="wl">{check(f"n4_kit_{i}", "midnight")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["More ice than you believe",
                                       "Glasses counted, and a marker to name them",
                                       "A bottle opener that is not lost",
                                       "Bin bags out early, one for the glass"], start=1)) +
        '</section></div>')

MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]

def page_5():
    rows = "".join(
        f'<div class="mo"><span class="moname">{m}</span>{blank(f"n5_mo_{i}", "grow", "10")}</div>'
        for i, m in enumerate(MONTHS, start=1))
    return sheet(5, "The year, in<br>twelve lines.", "New Year kit &middot; looking back",
        '<div class="two b2"><section>' +
        sec("One line each", "The first thing you think of, not the best", "plum") +
        f'<div class="months">{rows}</div>' +
        '</section><section>' +
        '<div class="warn">'
        '<b>Use a calendar, not your memory</b>'
        '<p>Scroll back through your own photographs, or your diary, one month at a time. Almost '
        'nobody can remember March in December, and the year always turns out to have had more in '
        'it than it felt like. That is the point of the page.</p>'
        '</div>' +
        sec("Better than expected", "", "gold") +
        "".join(f'<div class="wl">{blank(f"n5_good_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Harder than expected", "", "plum") +
        "".join(f'<div class="wl">{blank(f"n5_hard_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("People who mattered this year", "", "midnight") +
        "".join(f'<div class="wl">{blank(f"n5_who_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Something you finished", "Even if nobody noticed") +
        "".join(f'<div class="wl">{blank(f"n5_fin_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

def page_6():
    return sheet(6, "Not carrying<br>this over.", "New Year kit &middot; what to put down",
        '<div class="two b46"><section>' +
        '<div class="warn">'
        '<b>The page most New Year planners are missing</b>'
        '<p>A list of new things to start, on top of a year that is already full, is how January '
        'resolutions die by February. Before you add anything, take something off. Write down what '
        'you are putting down, and where it is written matters: a thing dropped on paper is dropped, '
        'a thing dropped in your head comes back.</p>'
        '</div>' +
        sec("Obligations I am not renewing", "", "plum") +
        "".join(f'<div class="wl">{check(f"n6_ob_{i}", "plum")}'
                f'{blank(f"n6_ob_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        sec("Things that cost money for nothing", "", "gold") +
        '<div class="sub head"><span>What</span><span class="w2">Per month</span>'
        '<span class="c">Cancelled</span></div>' +
        "".join(f'<div class="sub">{blank(f"n6_sub_{i}", "", "10")}'
                f'{blank(f"n6_cost_{i}", "w2", "10")}'
                f'<span class="c">{check(f"n6_sub_ok_{i}", "gold")}</span></div>'
                for i in range(1, 7)) +
        '</section><section>' +
        sec("A project I am allowed to abandon", "", "midnight") +
        "".join(f'<div class="wl">{blank(f"n6_proj_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("A habit that is not working", "Name it plainly", "plum") +
        "".join(f'<div class="wl">{blank(f"n6_hab_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Something I have been meaning to say", "", "gold") +
        "".join(f'<div class="wl">{blank(f"n6_say_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("And one thing I am keeping, deliberately", "", "midnight") +
        "".join(f'<div class="wl">{blank(f"n6_keep_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

def page_7():
    quarters = "".join(
        f'<div class="qt"><span class="qtn">{q}</span>{blank(f"n7_q_{i}", "", "10.5")}'
        f'{blank(f"n7_qw_{i}", "w2", "10")}</div>'
        for i, q in enumerate(["Jan &ndash; Mar", "Apr &ndash; Jun",
                               "Jul &ndash; Sep", "Oct &ndash; Dec"], start=1))
    return sheet(7, "Next year,<br>on one page.", "New Year kit &middot; ahead",
        '<div class="two b46"><section>' +
        sec("One to start, one to stop, one to finish", "", "gold") +
        '<div class="three">' +
        "".join(f'<div class="tri"><span class="trin">{lab}</span>'
                f'{blank(f"n7_{k}", "grow", "11")}</div>'
                for k, lab in [("start", "Start"), ("stop", "Stop"), ("finish", "Finish")]) +
        '</div>' +
        sec("The four quarters", "A phrase each", "midnight") +
        '<div class="qt head"><span class="qtn">When</span><span>What it is for</span>'
        '<span class="w2">In a word</span></div>' + quarters +
        sec("Already in the diary", "Birthdays, trips, deadlines", "plum") +
        '<div class="dt head"><span>What</span><span class="w2">When</span>'
        '<span class="c">Booked</span></div>' +
        "".join(f'<div class="dt">{blank(f"n7_d_{i}", "", "10")}'
                f'{blank(f"n7_dw_{i}", "w2", "10")}'
                f'<span class="c">{check(f"n7_dok_{i}", "plum")}</span></div>'
                for i in range(1, 7)) +
        '</section><section>' +
        sec("Money, decided in January", "", "gold") +
        field("Saving towards", "n7_save") + field("How much a month", "n7_save_amt", "w2") +
        field("Paying off", "n7_debt") + field("By when", "n7_debt_when", "w2") +
        field("One thing worth the money", "n7_worth") +
        sec("Something to learn, badly", "", "midnight") +
        "".join(f'<div class="wl">{blank(f"n7_learn_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        sec("People to see more of", "Put a month next to each", "plum") +
        "".join(f'<div class="pp">{blank(f"n7_pp_{i}", "", "10.5")}'
                f'{blank(f"n7_ppw_{i}", "w2", "10")}</div>' for i in range(1, 6)) +
        sec("If the year goes badly", "Written while it is easy") +
        f'<div class="wl">{blank("n7_bad", "grow", "10.5")}</div>' +
        '</section></div>')

def page_8():
    return sheet(8, "The first week<br>of January.", "New Year kit &middot; the boring page",
        '<div class="two b46"><section>' +
        '<div class="warn">'
        '<b>Nobody plans this week, and it decides the year</b>'
        '<p>Renewals fall due, prices go up quietly, and the diary is empty enough to actually do '
        'something about it. An hour spent here in the first week is worth more than any resolution '
        'on this list.</p>'
        '</div>' +
        sec("What renews, and at what price", "Insurance, phone, energy", "gold") +
        '<div class="rn head"><span>What</span><span class="w2">Renews</span>'
        '<span class="w2">New price</span><span class="c">Done</span></div>' +
        "".join(f'<div class="rn">{blank(f"n8_rn_{i}", "", "10")}'
                f'{blank(f"n8_rnw_{i}", "w2", "10")}{blank(f"n8_rnp_{i}", "w2", "10")}'
                f'<span class="c">{check(f"n8_rnok_{i}", "gold")}</span></div>'
                for i in range(1, 8)) +
        sec("Due in the first quarter", "Tax, bills, forms", "plum") +
        '<div class="rn head"><span>What</span><span class="w2">Due</span>'
        '<span class="w2">Roughly</span><span class="c">Done</span></div>' +
        "".join(f'<div class="rn">{blank(f"n8_du_{i}", "", "10")}'
                f'{blank(f"n8_duw_{i}", "w2", "10")}{blank(f"n8_dup_{i}", "w2", "10")}'
                f'<span class="c">{check(f"n8_duok_{i}", "plum")}</span></div>'
                for i in range(1, 6)) +
        '</section><section>' +
        sec("An hour of admin, once", "", "midnight") +
        "".join(f'<div class="wl">{check(f"n8_ad_{i}", "midnight")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Birthdays into next year&#8217;s calendar, all of them",
                                       "Passports and licences &mdash; check the expiry dates",
                                       "The medicine cabinet, and anything out of date",
                                       "Photographs backed up somewhere that is not the phone",
                                       "Appointments booked while the diary is empty",
                                       "One drawer, emptied"], start=1)) +
        sec("Booked in January because it is cheap", "", "gold") +
        "".join(f'<div class="wl">{check(f"n8_bk_{i}", "gold")}'
                f'{blank(f"n8_bk_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("Put away, and where", "The decorations, and this kit") +
        "".join(f'<div class="wl">{blank(f"n8_aw_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_9():
    return sheet(9, "The first<br>of January.", "New Year kit &middot; the day after",
        '<div class="two b46"><section>' +
        sec("How the night went", "Write it today", "plum") +
        "".join(f'<div class="wl">{blank(f"n9_went_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("Do again next year", "", "gold") +
        "".join(f'<div class="wl">{check(f"n9_again_{i}", "gold")}'
                f'{blank(f"n9_again_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("Do not do again", "", "plum") +
        "".join(f'<div class="wl">{check(f"n9_not_{i}", "plum")}'
                f'{blank(f"n9_not_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("Today, and nothing more", "", "midnight") +
        "".join(f'<div class="wl">{check(f"n9_today_{i}", "midnight")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Water, and something to eat that is not sweet",
                                       "Outside for twenty minutes, whatever the weather",
                                       "The glasses washed before the evening",
                                       "Whoever stayed, fed before they drive",
                                       "Nothing started today; the diary begins tomorrow"], start=1)) +
        sec("Messages worth sending today", "", "gold") +
        "".join(f'<div class="wl">{blank(f"n9_msg_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("One line for the year that has started", "", "plum") +
        "".join(f'<div class="wl">{blank(f"n9_line_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '<span class="footnote">Save your filled-in copy. Next December, page 5 opens with '
        'this year&#8217;s twelve lines already in it, and the year does not vanish.</span>' +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --midnight:{C["midnight"]}; --gold:{C["gold"]}; --plum:{C["plum"]};
  --backdrop:#e8e9ef;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#121320; }} }}
:root[data-theme="dark"]{{ --backdrop:#121320; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Hanken Grotesk","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(23,26,43,.16);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:600; text-transform:uppercase; letter-spacing:.17em; font-size:7.4pt;
  color:var(--soft); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in; }}
.mast h1{{ font-family:"Syne","Helvetica Neue",sans-serif; font-weight:800; font-size:{S["display"]};
  line-height:.98; margin:6px 0 0; letter-spacing:-.025em; }}
.mastright{{ display:flex; align-items:flex-end; gap:13px; position:relative; }}
.clock{{ position:absolute; right:-2px; top:-64px; width:1.22in; height:1.15in;
  color:var(--strong); }}
.pageno{{ font-family:"Syne",sans-serif; font-weight:700; font-size:15pt; color:var(--midnight); }}
.pageno i{{ font-style:normal; font-size:9pt; color:var(--faint); }}
.mini{{ display:flex; gap:10px; padding-bottom:3px; }}
.mini .fr{{ height:.22in; }}
.rules{{ display:flex; flex-direction:column; gap:2px; padding-top:9px; flex:none; }}
.rules span{{ height:1.2px; background:var(--ink); }}
.rules span.mid{{ height:3px; background:var(--midnight); }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:12px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.05fr 1fr; }}
.two.b8{{ grid-template-columns:1.22fr 1fr; }}
.two.b2{{ grid-template-columns:1fr 1.04fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}

.sec{{ display:flex; align-items:center; gap:9px; padding:10px 0 6px; overflow:hidden; flex:none; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-family:"Syne",sans-serif; font-weight:700; text-transform:uppercase;
  letter-spacing:.05em; font-size:8.8pt; color:var(--ink); white-space:nowrap; }}
.lbl.midnight{{ color:var(--midnight); }} .lbl.gold{{ color:var(--gold); }}
.lbl.plum{{ color:var(--plum); }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.5in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.2px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.85in; }} .blank.w3{{ flex:none; width:.52in; }}
.blank.num{{ flex:none; width:.6in; }} .blank.c{{ flex:none; width:.2in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

.box{{ width:11px; height:11px; border:1.4px solid var(--strong); flex:none; margin-bottom:3px;
  border-radius:2px; }}
.box.midnight{{ border-color:var(--midnight); }} .box.gold{{ border-color:var(--gold); }}
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

.warn{{ border:1.5px solid var(--midnight); border-radius:3px; padding:11px 13px; margin:10px 0;
  flex:none; }}
.warn b{{ font-size:9.6pt; }}
.warn p{{ margin:5px 0 0; font-size:9.3pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.kinds{{ display:flex; flex-direction:column; flex:none; padding:2px 0 2px; }}
.kind{{ display:flex; align-items:flex-end; gap:9px; min-height:.28in; }}
.kindlbl{{ font-size:9.6pt; color:var(--ink); padding-bottom:2px; line-height:1.15; }}

/* page 2 ------------------------------------------------------------------ */
.gltable{{ flex:1; display:flex; flex-direction:column; }}
.gl{{ display:grid; grid-template-columns:.22in 1.4fr 1.5fr .24in .24in .24in .24in 1.25fr;
  gap:0 7px; align-items:flex-end; flex:1; min-height:.24in; }}
.gl .idx{{ font-size:7pt; color:var(--faint); padding-bottom:3px; }}
.totals{{ display:flex; gap:16px; border-top:2px solid var(--ink); margin-top:8px; padding-top:8px;
  flex:none; }}
.tot{{ display:flex; align-items:flex-end; gap:8px; }}
.totlbl{{ font-family:"Syne",sans-serif; font-weight:700; text-transform:uppercase; font-size:8.2pt;
  color:var(--soft); padding-bottom:3px; letter-spacing:.04em; }}

/* page 3 ------------------------------------------------------------------ */
.anchor{{ display:flex; align-items:center; gap:16px; border:1.5px solid var(--midnight);
  border-radius:3px; padding:9px 15px 10px; margin-bottom:11px; flex:none; }}
.anchorl{{ font-family:"Syne",sans-serif; font-weight:700; text-transform:uppercase;
  letter-spacing:.07em; font-size:8.8pt; color:var(--midnight); }}
.anchornum{{ font-family:"Syne",sans-serif; font-weight:800; font-size:23pt; line-height:1;
  letter-spacing:-.02em; }}
.anchorhint{{ font-size:8.4pt; color:var(--faint); flex:1; text-align:right; }}
.rs{{ display:grid; grid-template-columns:.52in minmax(0,1fr) .85in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.beats{{ display:flex; flex-direction:column; flex:1 1 auto; }}
.beat{{ display:grid; grid-template-columns:.26in minmax(0,1fr) .52in; gap:0 9px;
  align-items:center; flex:1 1 auto; min-height:.38in; max-height:.62in;
  border-bottom:1px solid var(--rule); }}
.beat.mid{{ border-top:1.5px solid var(--midnight); border-bottom:1.5px solid var(--midnight); }}
.beat.mid .btext b{{ font-family:"Syne",sans-serif; font-weight:800; letter-spacing:.03em;
  color:var(--midnight); font-size:10.5pt; }}
.bnum{{ font-family:"Syne",sans-serif; font-weight:700; font-size:11pt; color:var(--gold); }}
.btext b{{ display:block; font-size:9.5pt; font-weight:600; line-height:1.15; }}
.btext span{{ display:block; font-size:8.2pt; color:var(--faint); line-height:1.2; }}

/* page 4 ------------------------------------------------------------------ */
.ml{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .26in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.27in; max-height:.46in; }}
.bt{{ display:grid; grid-template-columns:.24in .82in .95in minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:none; min-height:.32in; border-bottom:1px solid var(--rule); }}
.bt span{{ padding-bottom:5px; font-size:9.4pt; }}
.bt .btt{{ color:var(--gold); font-weight:700; }}
.bt .bte{{ color:var(--soft); }}

/* page 5 ------------------------------------------------------------------ */
.months{{ flex:1; display:flex; flex-direction:column; min-height:0; }}
.mo{{ display:grid; grid-template-columns:.78in minmax(0,1fr); gap:0 10px; align-items:flex-end;
  flex:1 1 auto; min-height:.3in; }}
.moname{{ font-family:"Syne",sans-serif; font-weight:600; font-size:9pt; color:var(--plum);
  padding-bottom:4px; }}

/* pages 6 to 9 ------------------------------------------------------------ */
.sub{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.three{{ display:flex; flex-direction:column; flex:none; padding-bottom:2px; }}
.tri{{ display:flex; align-items:flex-end; gap:11px; min-height:.4in; }}
.trin{{ font-family:"Syne",sans-serif; font-weight:800; text-transform:uppercase; font-size:9.5pt;
  letter-spacing:.06em; color:var(--gold); width:.74in; padding-bottom:4px; }}
.qt{{ display:grid; grid-template-columns:.78in minmax(0,1fr) .85in; gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.48in; }}
.qtn{{ font-size:9pt; color:var(--midnight); font-weight:600; padding-bottom:4px; }}
.dt{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.pp{{ display:grid; grid-template-columns:minmax(0,1fr) .85in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.rn{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .85in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.2px solid var(--ink); margin-top:10px; padding-top:8px; }}
.foot .mark{{ font-family:"Syne",sans-serif; font-weight:600; text-transform:uppercase;
  font-size:8.2pt; color:var(--faint); letter-spacing:.05em; }}
.dots{{ font-size:6pt; color:var(--gold); letter-spacing:.1em; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-newyear.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Five to Midnight New Year Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-newyear-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"newyear-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"newyear-{name}")
        fill_pdf = os.path.join(DIST, f"newyear-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["midnight"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Five to Midnight &nbsp;&middot;&nbsp; New Year kit",
    title="Start<br><em>here.</em>",
    lede="Nine pages for the night and the turn: a party run backwards from 00:00, a guest list "
         "that asks how everyone is getting home, the bottle arithmetic &mdash; then the year in "
         "twelve lines, what you are not carrying into the next one, and the first week of "
         "January nobody plans.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Pages 1&ndash;4 are the night", "pages 5&ndash;9 are the year turning"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. Tick the boxes with a click. <b>Save a copy first</b> and keep it &mdash; next "
        "December, page 5 opens with this year&#8217;s twelve lines already in it, which is the "
        "whole reason that page exists.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Print page 3 whatever "
        "else you do and put it in the kitchen: it is the night counted back from midnight, and it "
        "is what anyone helping needs to be able to read without asking you.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "White pages on purpose &mdash; a midnight-blue background eats a cartridge",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="Two things this kit is deliberately not",
    s5p="It is <b>not a dated diary</b> &mdash; no year is printed anywhere, so it works this "
        "December and every one after. And page 6 is <b>not a goals page</b>: it is a list of "
        "things to put down. A page of new intentions stacked on a year that is already full is "
        "how January resolutions die in February, so this kit asks you to subtract before it lets "
        "you add.",
    license="Personal use only. Print as many copies as you like for your own new year. Please do "
            "not resell, share or redistribute the files. Fonts: Syne and Hanken Grotesk "
            "(SIL Open Font License).",
    mark="Backwards from midnight.",
)

PAGE_NAMES = ["The night", "Guest list", "Backwards from midnight", "Food &amp; drink",
              "The year in twelve lines", "Not carrying this over", "Next year, one page",
              "The first week of January", "The first of January"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["midnight"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Syne","Helvetica Neue",sans-serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Hanken Grotesk",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Hanken Grotesk"'),
                 ("--s1:#f2a65a", "--s1:" + C["gold"]), ("--s2:#ee6c4d", "--s2:" + C["plum"]),
                 ("--s3:#c43e7a", "--s3:" + C["midnight"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-style:italic;", "font-style:normal;")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-newyear.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    hp = os.path.join(work, "readme-newyear.html")
    open(hp, "w", encoding="utf-8").write(tpl)
    B.to_pdf(hp, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-newyear.css")
    doc = pymupdf.open(os.path.join(DIST, "newyear-planner-letter-midnight-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"newyear-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["midnight"]
    over = (
        "<style>"
        "h1{font-family:'Syne','Helvetica Neue',sans-serif;font-weight:800;line-height:.98;"
        "letter-spacing:-.028em}"
        f"h1 em{{font-style:normal;color:{C['midnight']}}}"
        "body{font-family:'Hanken Grotesk',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['gold']};font-family:'Hanken Grotesk';font-weight:600;"
        "letter-spacing:.18em}"
        f".rule{{background:{C['midnight']};height:4px;width:220px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Hanken Grotesk';"
        "font-weight:600;letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(23,26,43,.18)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Hanken Grotesk',Arial,sans-serif;font-weight:600;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>Backwards<br>from <em>midnight.</em></h1>
          <span class="rule"></span>
          <p class="sub">A New Year kit in two halves: the night run back from 00:00, with the
          bottle arithmetic and a guest list that asks how everyone is getting home &mdash; then
          the year in twelve lines, and what you are not carrying into the next one.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated, any year</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>one turn.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">Not a goals page</span>
      <h1>The year in twelve lines.<br><em>And what to put down.</em></h1>
      <p class="sub">One line for each month, because nobody remembers March in December. Then a
      page of things to stop paying for, stop turning up to and stop half-finishing &mdash; because
      new intentions stacked on a full year are how January dies in February.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[4]}" style="height:1170px"><img src="{imgs[5]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#eff0f5", "100px", "92px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#ecedf3", "100px", "72px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-newyear-{name}.html")
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
        BD.package(DIST, "Five-to-Midnight-New-Year-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building New Year kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "newyear-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "midnight", embed_fonts=False))
    print("Wrote newyear-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Five-to-Midnight-New-Year-Kit")


if __name__ == "__main__":
    main()
