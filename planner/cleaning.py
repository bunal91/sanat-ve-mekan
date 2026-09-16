#!/usr/bin/env python3
"""Build the Ten Minutes cleaning kit.

Every cleaning schedule on the market is the same daily / weekly / monthly
list in a nicer font, written for a house nobody lives in. Two things make a
schedule survive contact with a real week: minutes against every job, so you
find out that your "quick Saturday" is a four-hour plan before you start it,
and a name against every job, including the invisible ones nobody counts.

    python3 cleaning.py                  # every size / colourway
    python3 cleaning.py --only letter-bright
    python3 cleaning.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, math, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-cleaning")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Space+Grotesk:wght@500;600;700"
          "&family=Cabin:wght@400;500;600;700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="38pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="37pt"),
}

COLORWAYS = {
    # cobalt = the schedule, amber = minutes, magenta = anything about safety.
    "bright": dict(ink="#191a1d", soft="#54575d", faint="#8c9097", rule="#e4e5e8",
                   strong="#c4c6cb", cobalt="#2a56b8", amber="#c2761a", magenta="#b0306b"),
    "mono":   dict(ink="#1d1e20", soft="#56585b", faint="#8f9195", rule="#e6e7e9",
                   strong="#c5c7ca", cobalt="#3b3d40", amber="#8b8d90", magenta="#3b3d40"),
}

PAGES = 9
MARK = "Minutes, not adjectives."

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]

# --------------------------------------------------------------------------- helpers

def check(f, tone=""):
    return f'<span class="box {tone}" data-field="{f}" data-ftype="check"></span>'

def blank(f, cls="", fs="10.5"):
    return f'<span class="blank {cls}" data-field="{f}" data-fsize="{fs}"></span>'

def mins(f):
    """The minutes box — the thing this kit has that the others do not."""
    return f'<span class="blank min" data-field="{f}" data-fsize="10"></span>'

def sec(label, hint="", tone="cobalt"):
    """A filled tab, reversed out, with the hint sitting after it."""
    hint = f'<span class="hint">{hint}</span>' if hint else ""
    return f'<div class="sec"><span class="tab {tone}">{label}</span>{hint}</div>'

def field(label, f, cls="", fs="10.5"):
    return f'<div class="fr"><span class="flbl">{label}</span>{blank(f, cls, fs)}</div>'

def lines(prefix, n, cls="grow", fs="10.5"):
    return "".join(f'<div class="wl">{blank(f"{prefix}_{i}", cls, fs)}</div>'
                   for i in range(1, n + 1))

def ticked(prefix, items, tone=""):
    return "".join(f'<div class="wl">{check(f"{prefix}_{i}", tone)}'
                   f'<span class="rtext">{t}</span></div>'
                   for i, t in enumerate(items, start=1))

def pane(seed=1):
    """A pane being wiped: fewer smears left on it as the kit goes on."""
    x0, y0, x1, y1 = 10, 8, 86, 88
    parts = [f'<rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" rx="2"/>']
    for i in range(9 - seed):                       # the smears clear page by page
        y = y0 + 9 + i * 8.5
        off = 6 + (i % 3) * 5
        parts.append(f'<path d="M{x0 + 5 + off} {y:.0f} L{x1 - 7} {y - 4:.0f}" '
                     f'stroke-dasharray="3 4"/>')
    a = math.radians(210 + seed * 7)                # and the wipe itself sweeps round
    cx, cy, r = 48, 50, 30
    parts.append(f'<path d="M{cx + r * math.cos(a):.1f} {cy + r * math.sin(a) * .62:.1f} '
                 f'A{r} {r * .62} 0 0 1 '
                 f'{cx + r * math.cos(a + 2.2):.1f} {cy + r * math.sin(a + 2.2) * .62:.1f}" '
                 f'stroke-width="2.2"/>')
    return (f'<svg class="pane" viewBox="0 0 96 100" aria-hidden="true">'
            f'<g fill="none" stroke="currentColor" stroke-width="1.15" '
            f'stroke-linecap="round">{"".join(parts)}</g></svg>')

def sheet(n, title, kicker, tag, body, wide=False):
    return f'''
<div class="sheet">
  <header class="mast">
    <div class="masthead"><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{pane(n)}<span class="num"><b>{n}</b><i>{tag}</i></span></div>
  </header>
  <div class="page{' wide' if wide else ''}">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="pn">{n} / {PAGES}</span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    rooms = "".join(
        f'<div class="rm">{blank(f"c1_r_{i}", "", "10")}{blank(f"c1_f_{i}", "", "10")}'
        f'{blank(f"c1_w_{i}", "", "10")}</div>'
        for i in range(1, 9))
    return sheet(1, "This<br>house.", "Cleaning kit &middot; fill this in once", "Once",
        '<div class="two b46"><section>' +
        '<div class="warn cobalt">'
        '<b>Every cleaning schedule you have ever downloaded was written for a different house</b>'
        '<p>Somebody else&#8217;s weekly list has a conservatory, a utility room and no cat. Yours '
        'has whatever it has. Write the rooms down first, with the floor in each one &mdash; '
        'because the floor decides the method, and half of what goes wrong is a wet mop on wood or '
        'a bleach spray on stone.</p>'
        '</div>' +
        sec("The rooms, and what is underfoot", "Floors decide") +
        '<div class="rm head"><span>Room</span><span>Floor</span>'
        '<span>What makes it hard</span></div>' + rooms +
        sec("Who lives here", "", "amber") +
        '<div class="split2">' + field("Adults", "c1_ad", "w2") +
        field("Children", "c1_ch", "w2") + '</div>' +
        '<div class="split2">' + field("Pets", "c1_pet", "w2") +
        field("Anyone home in the day", "c1_home", "w2") + '</div>' +
        field("Asthma, allergies or a baby &mdash; changes the products", "c1_health") +
        '</section><section>' +
        sec("What &#8220;clean enough&#8221; means here", "Agree it, or it is never met", "amber") +
        lines("c1_enough", 3) +
        '<span class="footnote">This is the most useful line on the page and the one nobody '
        'writes. Two people can keep the same house and be measured against two different '
        'standards, neither of them said out loud. Say it out loud.</span>' +
        sec("Bins and recycling", "", "cobalt") +
        '<div class="bn head"><span>Which</span><span class="w2">Day</span>'
        '<span>Whose job</span></div>' +
        "".join(f'<div class="bn">{blank(f"c1_b_{i}", "", "10")}'
                f'{blank(f"c1_bd_{i}", "w2", "10")}{blank(f"c1_bw_{i}", "", "10")}</div>'
                for i in range(1, 5)) +
        sec("Where the cleaning things live", "", "cobalt") +
        lines("c1_where", 2) +
        sec("What we pay somebody else to do", "And what it costs", "amber") +
        lines("c1_paid", 2) +
        sec("What is broken and keeps being worked around", "", "magenta") +
        lines("c1_broken", 3) +
        '</section></div>')

RESET = ["Kitchen surfaces cleared and wiped", "Sink empty, and dried",
         "Everything that lives upstairs, taken upstairs", "The floor in one room",
         "Five things put back where they go"]

def page_2():
    jobs = "".join(
        f'<div class="jb"><span class="jn">{i}</span>{blank(f"c2_j_{i}", "grow", "10")}'
        f'{mins(f"c2_m_{i}")}</div>'
        for i in range(1, 6))
    grid = "".join(
        f'<div class="gd"><span class="gdn">{d[:3]}</span>' +
        "".join(f'<span class="c">{check(f"c2_g{k}_{i}", "cobalt")}</span>' for k in range(1, 6)) +
        f'{blank(f"c2_gn_{i}", "", "9")}</div>'
        for i, d in enumerate(DAYS, start=1))
    return sheet(2, "The ten<br>minutes.", "Cleaning kit &middot; the evening reset", "Daily",
        '<div class="two b46"><section>' +
        '<div class="warn">'
        '<b>A house is not kept by deep cleans. It is kept by ten minutes, most evenings.</b>'
        '<p>Not every evening &mdash; <b>most</b>. The difference between a house that feels fine '
        'and one that does not is almost never the Saturday; it is whether the kitchen was cleared '
        'before bed. Pick five things, time them once, and stop there when the time is up. The '
        'timer is the point: it turns an open-ended, resentful job into a short one with an end.</p>'
        '</div>' +
        sec("Our five", "Write the minutes in, once you have timed it", "amber") +
        '<div class="jb head"><span class="jn">#</span><span>The job</span>'
        '<span class="mh">Mins</span></div>' + jobs +
        f'<div class="tot"><span>Ten minutes, really</span>{mins("c2_total")}</div>' +
        sec("Started at, most nights", "A time beats good intentions", "cobalt") +
        field("We start at", "c2_time", "w2") +
        sec("Who does the reset", "", "cobalt") + lines("c2_who", 2) +
        sec("When the house is fuller", "Guests, half-term, after a party", "amber") +
        lines("c2_full", 3) +
        sec("If there is only time for one of the five", "Which one, and why", "magenta") +
        lines("c2_one", 2) +
        '</section><section>' +
        sec("The week", "One column per job", "cobalt") +
        '<div class="gd head"><span class="gdn">Day</span>'
        '<span class="c">1</span><span class="c">2</span><span class="c">3</span>'
        '<span class="c">4</span><span class="c">5</span><span>Note</span></div>' + grid +
        sec("The morning version, if evenings never work", "", "amber") + lines("c2_am", 3) +
        sec("What we let go", "Deliberately, not guiltily", "magenta") + lines("c2_let", 3) +
        '<span class="footnote">Missing three days does not restart anything and does not mean it '
        'failed. The grid is there so you can see that you did it eleven times this month, which '
        'is eleven more than the schedule you gave up on in February.</span>' +
        '</section></div>')

def page_3():
    rows = "".join(
        f'<div class="ct">{blank(f"c3_r_{i}", "", "10")}{blank(f"c3_j_{i}", "", "10")}'
        f'{blank(f"c3_w_{i}", "", "10")}{mins(f"c3_m_{i}")}'
        f'<span class="c">{check(f"c3_d_{i}", "cobalt")}</span></div>'
        for i in range(1, 19))
    return sheet(3, "The circuit.", "Cleaning kit &middot; the weekly round, timed", "Weekly",
        sec("Room by room &mdash; and a name and a number against every line", "", "cobalt") +
        '<div class="ct head"><span>Room</span><span>The job</span><span>Whose</span>'
        '<span class="mh">Mins</span><span class="c">Done</span></div>' + rows +
        '<div class="ctot"><span class="ctl">Add the minutes up</span>'
        f'<span class="ctb">{mins("c3_total")}</span>'
        '<span class="ctx">&mdash; and that is what you are actually asking of a Saturday</span>'
        '</div>' +
        '<div class="warn amber">'
        '<b>The total at the bottom is the whole point of this page</b>'
        '<p>Nearly every cleaning schedule fails at the same place: it is a list of jobs with no '
        'idea how long they take, so it is agreed to cheerfully and abandoned by eleven o&#8217;'
        'clock. Time each job once, honestly, and add them up. If the number comes to four hours, '
        'you have not got a schedule &mdash; you have got a wish, and something on this page has '
        'to move to page 5, be done less often, or be done by somebody else.</p>'
        '</div>', wide=True)

INVISIBLE = [
    "Noticing that something has run out, before it runs out",
    "Actually buying it",
    "Knowing where things live, so they can be put back",
    "Booking the boiler, the chimney, the drain, the repair",
    "Keeping the bins and the recycling in the right week",
    "Holding the whole list in their head, which is a job in itself",
]

def page_4():
    inv = "".join(
        f'<div class="iv"><span class="ivt">{t}</span>{blank(f"c4_i_{i}", "", "10")}</div>'
        for i, t in enumerate(INVISIBLE, start=1))
    return sheet(4, "Who does<br>what.", "Cleaning kit &middot; including the invisible half",
        "Agree it",
        '<div class="two b46"><section>' +
        '<div class="warn magenta">'
        '<b>Half the work in a house has no name and nobody thanks you for it</b>'
        '<p>The cleaning is the visible part. The rest is noticing, remembering, reordering, '
        'booking and deciding &mdash; and in most houses it is all done by one person who did not '
        'volunteer. It cannot be shared out until it is written down, so it is written down here '
        'with a name beside it like any other job.</p>'
        '</div>' +
        sec("The jobs nobody counts", "Put a name against each", "magenta") +
        '<div class="iv head"><span class="ivt">The job</span><span>Whose</span></div>' + inv +
        sec("The visible ones, then", "The circuit on page 3", "cobalt") +
        '<div class="iv head"><span class="ivt">The job</span><span>Whose</span></div>' +
        "".join(f'<div class="iv">{blank(f"c4_v_{i}", "", "10")}'
                f'{blank(f"c4_vw_{i}", "", "10")}</div>' for i in range(1, 6)) +
        '</section><section>' +
        sec("What each of us would rather do", "It is not all equally hated", "amber") +
        '<div class="pr head"><span>Who</span><span>Happy to</span><span>Would rather not</span></div>' +
        "".join(f'<div class="pr">{blank(f"c4_p_{i}", "", "10")}'
                f'{blank(f"c4_ph_{i}", "", "10")}{blank(f"c4_pn_{i}", "", "10")}</div>'
                for i in range(1, 5)) +
        sec("Children, and what is actually theirs", "By age, and meant", "cobalt") +
        lines("c4_kid", 4) +
        sec("Reviewed every so often", "Nothing here is a life sentence", "amber") +
        '<div class="split2">' + field("Last talked about", "c4_last", "w2") +
        field("Next", "c4_next", "w2") + '</div>' +
        sec("What we changed, and whether it held", "", "cobalt") + lines("c4_chg", 3) +
        '</section></div>')

MONTHLY = ["Skirting boards, door frames, handles and switches",
           "Inside the microwave, and the oven door glass",
           "Descale the kettle and the shower head",
           "A hot empty cycle and the filter on the washing machine",
           "Test the smoke alarms",
           "Under the beds, and behind the sofa"]

SEASONAL = ["Windows, both sides",
            "Curtains, blinds and the tops of doors",
            "The oven, properly",
            "Defrost the freezer, and eat what is in it first",
            "Mattresses turned, pillows washed",
            "Gutters, drains and the outside tap before the frost"]

def page_5():
    m = "".join(f'<div class="fq">{check(f"c5_m_{i}", "cobalt")}<span class="fqt">{t}</span>'
                f'{blank(f"c5_md_{i}", "w3", "9")}</div>'
                for i, t in enumerate(MONTHLY, start=1))
    s2 = "".join(f'<div class="fq">{check(f"c5_s_{i}", "amber")}<span class="fqt">{t}</span>'
                 f'{blank(f"c5_sd_{i}", "w3", "9")}</div>'
                 for i, t in enumerate(SEASONAL, start=1))
    return sheet(5, "Monthly,<br>twice a year,<br>once ever.", "Cleaning kit &middot; honest frequencies",
        "Rarely",
        '<div class="two b46"><section>' +
        sec("Once a month", "Date it when it is done", "cobalt") +
        '<div class="fq head"><span class="box"></span><span class="fqt">The job</span>'
        '<span class="w3">Done</span></div>' + m +
        sec("Ours, as well", "", "cobalt") + lines("c5_mine", 3) +
        '<div class="warn magenta">'
        '<b>Three of these are about fire, not tidiness</b>'
        '<p>Test the smoke alarms monthly and change the batteries yearly. Empty the tumble '
        'dryer&#8217;s lint filter <b>every single load</b>, and clean the extractor filter over '
        'the hob &mdash; both are grease and fluff sitting next to heat. And never leave cloths '
        'that have been used with oil screwed up in a warm pile.</p>'
        '</div>' +
        '</section><section>' +
        sec("Twice a year", "Spring, and before the clocks change", "amber") +
        '<div class="fq head"><span class="box"></span><span class="fqt">The job</span>'
        '<span class="w3">Done</span></div>' + s2 +
        sec("Once a decade, or when we move", "", "amber") + lines("c5_ever", 3) +
        sec("It is fine to skip", "Written down so it stops nagging", "magenta") +
        lines("c5_skip", 4) +
        '<span class="footnote">Nobody washes their curtains every month, and a list that says '
        'they should is a list that gets thrown away in week three. Put the job on the honest '
        'shelf instead: twice a year, once a decade, or never &mdash; and then stop carrying '
        'it around.</span>' +
        '</section></div>')

MIX = [
    ("Bleach + ammonia", "Glass and some multi-surface sprays contain ammonia. Together they "
                         "give off chloramine. Never in the same sink, bowl or cloth."),
    ("Bleach + anything acidic", "Vinegar, lemon, limescale removers, some toilet cleaners. "
                                 "Releases chlorine gas."),
    ("Bleach + surgical spirit", "Or any rubbing alcohol. Do not."),
    ("Two different drain unblockers", "Never one after the other, and never add anything to a "
                                       "pipe that already has one sitting in it."),
    ("Acid on natural stone", "Vinegar and limescale remover etch marble, limestone and "
                              "travertine permanently. Use something made for stone."),
    ("Anything, in a closed bathroom", "Open the window or the door first. Gloves on. Never "
                                       "decant into an unlabelled bottle."),
]

def page_6():
    rows = "".join(
        f'<div class="mx"><span class="mxn">{a}</span><span class="mxw">{b}</span></div>'
        for a, b in MIX)
    return sheet(6, "What not<br>to mix.", "Cleaning kit &middot; the page that goes in the cupboard",
        "Pin up",
        '<div class="two b2"><section>' +
        sec("Never, in any quantity", "This is the page to photograph", "magenta") +
        f'<div class="mxs">{rows}</div>' +
        '<span class="footnote">If something is mixed by accident: leave the room, open the '
        'windows from outside if you can, and do not go back in to clear it up. If anybody is '
        'coughing or short of breath, get them into fresh air and ring for advice &mdash; this '
        'kit is not medical advice and does not pretend to be.</span>' +
        '</section><section>' +
        '<div class="warn">'
        '<b>Most houses need four things, not a cupboard full</b>'
        '<p>Something general for surfaces, something for grease, something for limescale, and '
        'good cloths. Everything else is a solved problem being sold twice. Fewer bottles also '
        'means fewer chances of two of them meeting.</p>'
        '</div>' +
        sec("What we actually use", "And where it is kept", "cobalt") +
        '<div class="pd head"><span>For</span><span>What</span><span class="w3">Left</span></div>' +
        "".join(f'<div class="pd">{blank(f"c6_f_{i}", "", "10")}'
                f'{blank(f"c6_p_{i}", "", "10")}'
                f'<span class="c">{check(f"c6_l_{i}", "amber")}</span></div>'
                for i in range(1, 8)) +
        sec("Cloths", "Colour per room stops the worst of it", "cobalt") +
        lines("c6_cloth", 3) +
        sec("Tried and not buying again", "", "magenta") + lines("c6_no", 3) +
        '</section></div>')

STAINS = [
    ("Blood, egg, milk, sweat", "Cold water only &mdash; heat sets protein. Then an enzyme "
                                "detergent. Never hot."),
    ("Red wine", "Blot hard, do not rub. Dilute with cold water, blot again, then a stain "
                 "remover. Salt is folklore; blotting is the work."),
    ("Grease and oil", "Absorb first with bicarb or cornflour, brush off, then washing-up "
                       "liquid on what is left."),
    ("Ballpoint ink", "Cloth underneath, dab with surgical spirit from the back, small area "
                      "at a time, changing the cloth as it lifts."),
    ("Tea and coffee", "Cold water straight away, then detergent. On washables, a vinegar "
                       "rinse helps &mdash; not on wool."),
    ("Candle wax", "Harden it with ice, scrape off the ridge, then brown paper and a warm iron "
                   "to draw the rest out."),
    ("A pet accident", "Blot, then an <b>enzyme</b> cleaner. Nothing ammonia-based &mdash; it "
                       "smells like the reason they went there in the first place."),
    ("Mud", "Let it dry completely. Brush it off. Then wash. Working it wet spreads it into "
            "the fibres."),
]

def page_7():
    rows = "".join(
        f'<div class="sn"><span class="snn"><b>{a}</b><i>{b}</i></span>'
        f'{blank(f"c7_n_{i}", "", "10")}</div>'
        for i, (a, b) in enumerate(STAINS, start=1))
    return sheet(7, "When<br>something<br>spills.", "Cleaning kit &middot; blot, do not rub", "Pin up",
        '<div class="two b2"><section>' +
        sec("The standard method, and what worked here", "", "magenta") +
        '<div class="sn head"><span class="snn">What, and what to do</span>'
        '<span>What worked for us</span></div>' + rows +
        '</section><section>' +
        '<div class="warn">'
        '<b>Three rules that cover most of it</b>'
        '<p>Work from the outside of the mark inwards, or you spread it. <b>Blot, never rub</b> '
        '&mdash; rubbing pushes it into the fibres and roughs them up. And test anything new on a '
        'hidden corner first, because the second stain is the one you made yourself.</p>'
        '</div>' +
        sec("Ours, the ones that keep happening", "", "amber") + lines("c7_us", 4) +
        sec("What we keep for it, and where", "", "cobalt") + lines("c7_kit", 3) +
        sec("Taken to a professional", "Some things are worth not ruining", "magenta") +
        lines("c7_pro", 3) +
        '</section></div>')

ORDER = ["Clear the surfaces before you clean anything",
         "Top down &mdash; dust falls, so ceilings and shelves before floors",
         "Dry work before wet work, or you make mud",
         "One room finished beats four rooms started",
         "Bin bag and a box for elsewhere, both in your hand"]

def page_8():
    rows = "".join(
        f'<div class="dp"><span class="dpn">{m}</span>{blank(f"c8_r_{i}", "", "10")}'
        f'{blank(f"c8_d_{i}", "w2", "10")}'
        f'<span class="c">{check(f"c8_t_{i}", "cobalt")}</span></div>'
        for i, m in enumerate(MONTHS, start=1))
    return sheet(8, "One room<br>a month.", "Cleaning kit &middot; instead of a spring clean",
        "Monthly",
        '<div class="two b46"><section>' +
        '<div class="warn cobalt">'
        '<b>The spring clean is a weekend nobody has</b>'
        '<p>A whole house in two days is why it does not happen at all. One room a month is '
        'twelve rooms a year, it fits in an afternoon, and it means every room gets properly done '
        'once &mdash; which is more than a spring clean has managed in most houses since the last '
        'time somebody moved.</p>'
        '</div>' +
        sec("The year", "Write the room in, date it when it is done", "cobalt") +
        '<div class="dp head"><span class="dpn">Month</span><span>Room</span>'
        '<span class="w2">Done</span><span class="c">&#10003;</span></div>' + rows +
        '</section><section>' +
        sec("The order that works", "Every time, in every room", "amber") +
        ticked("c8_o", ORDER, "amber") +
        sec("This room, the bits that only get done now", "", "cobalt") +
        lines("c8_bits", 5) +
        sec("What came out of it", "Bin, charity, elsewhere, mending", "amber") +
        lines("c8_out", 4) +
        sec("What we found we do not need at all", "", "magenta") + lines("c8_none", 3) +
        '</section></div>')

def page_9():
    log = "".join(
        f'<div class="lg">{blank(f"c9_d_{i}", "w2", "10")}{blank(f"c9_w_{i}", "", "10")}'
        f'{mins(f"c9_m_{i}")}</div>'
        for i in range(1, 15))
    return sheet(9, "What it<br>actually<br>took.", "Cleaning kit &middot; the log", "Running",
        '<div class="two b2"><section>' +
        sec("Timed, not guessed", "Then correct page 3", "amber") +
        '<div class="lg head"><span class="w2">Date</span><span>What got done</span>'
        '<span class="mh">Mins</span></div>' + log +
        '<span class="footnote">Do this for a fortnight and the numbers on page 3 stop being '
        'guesses. Almost everybody is wrong in the same direction: the small jobs take four '
        'minutes rather than fifteen, and the ones that are put off for months take eleven.</span>' +
        '</section><section>' +
        '<div class="warn amber">'
        '<b>The job you keep putting off is usually not the job</b>'
        '<p>It is a missing bin, a shelf that is too high, a cupboard you have to empty to get '
        'into, or a decision nobody has made. Write down <b>why</b> beside it rather than just '
        'writing it down again &mdash; half of them turn out to be a five-pound fix rather than a '
        'failure of character.</p>'
        '</div>' +
        sec("Keeps getting put off &mdash; and why", "", "magenta") +
        '<div class="po head"><span>The job</span><span>The actual reason</span></div>' +
        "".join(f'<div class="po">{blank(f"c9_p_{i}", "", "10")}'
                f'{blank(f"c9_pw_{i}", "", "10")}</div>' for i in range(1, 5)) +
        sec("Worth paying somebody for", "Hours, times what your hour is worth", "cobalt") +
        lines("c9_pay", 3) +
        sec("What we changed, and whether it held", "", "cobalt") + lines("c9_chg", 3) +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --cobalt:{C["cobalt"]}; --amber:{C["amber"]}; --magenta:{C["magenta"]};
  --backdrop:#e9eaec;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#141517; }} }}
:root[data-theme="dark"]{{ --backdrop:#141517; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Cabin","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(25,26,29,.15);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:600; text-transform:uppercase; letter-spacing:.15em; font-size:7.4pt;
  color:var(--cobalt); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in; flex:none;
  border-bottom:2.5px solid var(--ink); padding-bottom:8px; }}
.masthead{{ min-width:0; }}
.mast h1{{ font-family:"Space Grotesk",Arial,sans-serif; font-weight:700; font-size:{S["display"]};
  line-height:.94; margin:4px 0 0; letter-spacing:-.022em; }}
.mastright{{ display:flex; align-items:flex-end; gap:12px; }}
.pane{{ width:.8in; height:.84in; color:var(--strong); }}
.num{{ text-align:right; flex:none; }}
.num b{{ font-family:"Space Grotesk",Arial,sans-serif; font-size:21pt; font-weight:700;
  line-height:.9; display:block; }}
.num i{{ font-style:normal; display:block; font-size:6.6pt; font-weight:600;
  text-transform:uppercase; letter-spacing:.11em; color:var(--faint); padding-top:3px; }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:10px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.02fr 1fr; }}
.two.b2{{ grid-template-columns:1.3fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}

/* a filled tab, reversed out */
.sec{{ display:flex; align-items:center; gap:9px; padding:10px 0 6px; overflow:hidden;
  flex:none; }}
.tab{{ font-weight:700; text-transform:uppercase; letter-spacing:.07em; font-size:7.8pt;
  color:#fff; background:var(--ink); padding:3px 7px 2.5px; white-space:nowrap; }}
.tab.cobalt{{ background:var(--cobalt); }}
.tab.amber{{ background:var(--amber); }}
.tab.magenta{{ background:var(--magenta); }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.5in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.2px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.78in; }} .blank.w3{{ flex:none; width:.5in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

/* the minutes box */
.blank.min{{ flex:none; width:.46in; height:.22in; border:1.3px solid var(--amber);
  border-radius:3px; margin-bottom:2px; }}
.mh{{ text-align:center; }}

/* a pill, so the tick box is this kit's and nobody else's */
.box{{ width:14px; height:10px; border:1.4px solid var(--strong); flex:none; margin-bottom:3px;
  border-radius:99px; }}
.box.cobalt{{ border-color:var(--cobalt); }} .box.amber{{ border-color:var(--amber); }}
.box.magenta{{ border-color:var(--magenta); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.28in;
  max-height:.5in; }}
.rtext{{ font-size:9.7pt; padding-bottom:3px; line-height:1.18; }}
.footnote{{ font-size:8.4pt; color:var(--faint); line-height:1.45; padding-top:8px; display:block;
  flex:none; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:4px; border-bottom:1.4px solid var(--ink); margin-bottom:5px;
  font-weight:600; text-transform:uppercase; letter-spacing:.06em; font-size:7pt;
  color:var(--soft); }}
.head span, .head .blank{{ border:0; }}
/* head cells inherit the head's size, whatever class they carry in the body */
.head *{{ font-size:inherit !important; font-weight:inherit; padding-bottom:0 !important; }}
.head .box{{ border:0; }}

.warn{{ border:1.4px solid var(--strong); border-top-width:4px; padding:10px 13px; margin:9px 0;
  flex:none; }}
.warn.cobalt{{ border-color:var(--cobalt); }}
.warn.amber{{ border-color:var(--amber); }}
.warn.magenta{{ border-color:var(--magenta); }}
.warn b{{ font-family:"Space Grotesk",Arial,sans-serif; font-size:9.8pt; }}
.warn p{{ margin:5px 0 0; font-size:9.2pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.rm{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,.8fr) minmax(0,1.1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.bn{{ display:grid; grid-template-columns:minmax(0,1fr) .78in minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* page 2 ------------------------------------------------------------------ */
.jb{{ display:grid; grid-template-columns:.2in minmax(0,1fr) .46in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.46in; }}
.jn{{ font-family:"Space Grotesk",Arial,sans-serif; font-weight:700; font-size:10pt;
  color:var(--cobalt); padding-bottom:3px; }}
.tot{{ display:flex; align-items:flex-end; justify-content:space-between; gap:10px; flex:none;
  border-top:1.6px solid var(--ink); margin-top:5px; padding-top:7px; }}
.tot span{{ font-size:8pt; font-weight:700; text-transform:uppercase; letter-spacing:.07em;
  padding-bottom:3px; }}
.gd{{ display:grid;
  grid-template-columns:.36in .24in .24in .24in .24in .24in minmax(0,1fr); gap:0 7px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.gdn{{ font-size:8.6pt; color:var(--cobalt); font-weight:600; padding-bottom:4px; }}

/* page 3, full width ------------------------------------------------------ */
.page.wide{{ display:flex; flex-direction:column; }}
.ct{{ display:grid; grid-template-columns:.95in minmax(0,1fr) .85in .46in .3in; gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.26in; max-height:.36in; }}
.ctot{{ display:flex; align-items:flex-end; gap:12px; flex:none;
  border-top:2px solid var(--ink); margin-top:6px; padding-top:8px; }}
.ctb{{ display:flex; align-items:flex-end; flex:none; }}
.ctl{{ font-family:"Space Grotesk",Arial,sans-serif; font-size:10pt; font-weight:700;
  text-transform:uppercase; letter-spacing:.05em; padding-bottom:2px; }}
.ctx{{ font-size:9pt; color:var(--soft); padding-bottom:3px; }}

/* page 4 ------------------------------------------------------------------ */
.iv{{ display:grid; grid-template-columns:minmax(0,1.5fr) minmax(0,1fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.48in; }}
.ivt{{ font-size:9.2pt; line-height:1.15; padding-bottom:3px; }}
.iv.head .ivt{{ padding-bottom:0; }}
.pr{{ display:grid; grid-template-columns:minmax(0,.7fr) minmax(0,1fr) minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* page 5 ------------------------------------------------------------------ */
.fq{{ display:grid; grid-template-columns:16px minmax(0,1fr) .5in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.34in; max-height:.52in; }}
.fqt{{ font-size:9.3pt; line-height:1.18; padding-bottom:3px; }}
.fq.head .fqt{{ padding-bottom:0; }}

/* page 6 ------------------------------------------------------------------ */
.mxs{{ display:flex; flex-direction:column; flex:1 1 auto; }}
.mx{{ display:grid; grid-template-columns:1.55in minmax(0,1fr); gap:0 12px;
  align-items:flex-start; flex:1 1 auto; min-height:.46in; max-height:.8in;
  border-bottom:1px solid var(--rule); padding-top:6px; }}
.mxn{{ font-size:9.6pt; font-weight:700; color:var(--magenta); line-height:1.18; }}
.mxw{{ font-size:8.8pt; color:var(--soft); line-height:1.35; }}
.pd{{ display:grid; grid-template-columns:minmax(0,.8fr) minmax(0,1fr) .5in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* page 7 ------------------------------------------------------------------ */
.sn{{ display:grid; grid-template-columns:2.5in minmax(0,1fr); gap:0 12px;
  align-items:flex-end; flex:1 1 auto; min-height:.46in; max-height:.74in; }}
.snn{{ padding-bottom:3px; min-width:0; }}
.snn b{{ display:block; font-size:9.4pt; font-weight:700; line-height:1.15; color:var(--magenta); }}
.snn i{{ display:block; font-style:normal; font-size:8pt; color:var(--soft); line-height:1.3;
  padding-top:1px; }}
.sn.head .snn{{ padding-bottom:0; }}

/* page 8 ------------------------------------------------------------------ */
.dp{{ display:grid; grid-template-columns:.82in minmax(0,1fr) .78in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.42in; }}
.dpn{{ font-size:9pt; color:var(--cobalt); font-weight:600; padding-bottom:4px; }}

/* page 9 ------------------------------------------------------------------ */
.lg{{ display:grid; grid-template-columns:.78in minmax(0,1fr) .46in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.po{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.2fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.4px solid var(--ink); margin-top:10px; padding-top:7px; flex:none; }}
.foot .mark{{ font-family:"Space Grotesk",Arial,sans-serif; font-weight:600; font-size:9.6pt;
  color:var(--faint); letter-spacing:.01em; }}
.pn{{ font-size:7.6pt; font-weight:600; color:var(--faint); letter-spacing:.08em; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-cleaning.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Ten Minutes Cleaning Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-cleaning-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"cleaning-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"cleaning-{name}")
        fill_pdf = os.path.join(DIST, f"cleaning-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["cobalt"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Ten Minutes &nbsp;&middot;&nbsp; cleaning kit",
    title="Start<br><em>here.</em>",
    lede="Every cleaning schedule you have downloaded was written for a house nobody lives in. Two "
         "things make one survive a real week: <b>minutes</b> against every job, so you find out "
         "that your quick Saturday is a four-hour plan before you agree to it &mdash; and a "
         "<b>name</b> against every job, including the invisible half nobody counts.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Pages 6 and 7 go in the cupboard", "what not to mix, and what to do about a spill"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. Pages 1, 3, 4 and 6 are filled in <b>once</b> and saved &mdash; they are the "
        "house, the circuit, who does what, and the cupboard. Pages 2, 8 and 9 are the ones you "
        "keep using.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Three of them are "
        "meant to leave the folder: <b>page 3</b> where everybody can see it, <b>page 6</b> inside "
        "the cupboard door where the bottles are, and <b>page 7</b> beside it. Page 2 can be "
        "reprinted weekly or just ticked in pencil and rubbed out.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "Page 3 is landscape-wide on purpose: print it, do not crop it",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="Two things before you start, and one warning",
    s5p="First, time the jobs. Not estimate &mdash; time them, once, with a phone, and write the "
        "number in. Page 9 exists because everybody is wrong in the same direction. Second, fill "
        "in page 4 with somebody else in the room, because the invisible work is the half that "
        "causes the arguments. And the warning: <b>page 6 is not decoration</b>. Bleach with an "
        "ammonia-based glass cleaner, or with vinegar or a limescale remover, produces gas that "
        "sends people to hospital every year. That page goes inside the cupboard door before the "
        "kit goes in a drawer.",
    license="Personal use only. Print as many copies as you like for your own home. Please do not "
            "resell, share or redistribute the files. Fonts: Space Grotesk and Cabin "
            "(SIL Open Font License).",
    mark="Minutes, not adjectives.",
)

PAGE_NAMES = ["This house", "The ten minutes", "The circuit, timed", "Who does what",
              "Honest frequencies", "What not to mix", "When something spills",
              "One room a month", "What it actually took"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["bright"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Space Grotesk",Arial,sans-serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Cabin",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Cabin"'),
                 ("--s1:#f2a65a", "--s1:" + C["amber"]), ("--s2:#ee6c4d", "--s2:" + C["magenta"]),
                 ("--s3:#c43e7a", "--s3:" + C["cobalt"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-style:italic;", "font-style:normal;")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-cleaning.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    hp = os.path.join(work, "readme-cleaning.html")
    open(hp, "w", encoding="utf-8").write(tpl)
    B.to_pdf(hp, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-cleaning.css")
    doc = pymupdf.open(os.path.join(DIST, "cleaning-planner-letter-bright-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"cleaning-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["bright"]
    over = (
        "<style>"
        "h1{font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;line-height:.94;"
        "letter-spacing:-.024em}"
        f"h1 em{{font-style:normal;color:{C['cobalt']}}}"
        "body{font-family:'Cabin',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['cobalt']};font-family:'Cabin';font-weight:600;letter-spacing:.18em}}"
        f".rule{{background:{C['amber']};height:5px;width:230px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Cabin';font-weight:600;"
        "letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(25,26,29,.17)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Cabin',Arial,sans-serif;font-weight:600;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>Minutes,<br><em>not adjectives.</em></h1>
          <span class="rule"></span>
          <p class="sub">A cleaning schedule with a number and a name against every job, so you
          find out that your quick Saturday is a four-hour plan before you agree to it &mdash;
          and so the half of the work nobody counts has somebody&rsquo;s name on it too.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated, any house</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[2]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>one house.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">Two pages that are not decoration</span>
      <h1>The total.<br><em>And the cupboard.</em></h1>
      <p class="sub">Page 3 asks for the minutes and then adds them up, which is where most
      schedules quietly fall apart. Page 6 is the one that goes inside the cupboard door: bleach
      with an ammonia-based glass cleaner, or with vinegar or a limescale remover, gives off gas
      &mdash; and almost no cleaning printable says so.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[2]}" style="height:1170px"><img src="{imgs[5]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#eff0f2", "100px", "92px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#edeef0", "100px", "84px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-cleaning-{name}.html")
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
        BD.package(DIST, "Ten-Minutes-Cleaning-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building cleaning kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "cleaning-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "bright", embed_fonts=False))
    print("Wrote cleaning-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Ten-Minutes-Cleaning-Kit")


if __name__ == "__main__":
    main()
