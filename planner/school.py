#!/usr/bin/env python3
"""Build the Night Before back-to-school kit.

Nine pages for the parent, not the pupil: what they have grown out of, the list
and the labelling, what the year actually costs, the week as a grid, lunchboxes,
the evening routine that decides the morning, the first day, and the names and
numbers.

    python3 school.py                  # every size / colourway
    python3 school.py --only letter-term
    python3 school.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-school")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Zilla+Slab:wght@500;600;700"
          "&family=Asap:wght@400;500;600;700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="35pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="34pt"),
}

COLORWAYS = {
    # ink = the week and the plan, red = money and deadlines, pencil = the things.
    "term": dict(ink="#1a1e24", soft="#525a66", faint="#8b929c", rule="#e2e5ea",
                 strong="#c2c7cf", pen="#1f5fa0", red="#cf3b2f", pencil="#a8761c"),
    "mono": dict(ink="#1c1e21", soft="#585c62", faint="#919498", rule="#e6e7e9",
                 strong="#c5c7ca", pen="#3a3d42", red="#3a3d42", pencil="#8a8d92"),
}

PAGES = 9
MARK = "The night before decides the morning."

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

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

def ruled(seed=0):
    """The corner of an exercise book: blue rules behind a red margin line."""
    x0, x1 = 6, 130
    margin = 30
    top = 14 + (seed % 5) * 3          # the block slides down as the kit goes on
    parts = []
    for i in range(6):
        y = top + i * 17
        parts.append(f'<line class="r" x1="{x0}" y1="{y}" x2="{x1}" y2="{y}"/>')
    parts.append(f'<line class="m" x1="{margin}" y1="{top - 12}" '
                 f'x2="{margin}" y2="{top + 5 * 17 + 12}"/>')
    return (f'<svg class="ruled" viewBox="0 0 136 128" aria-hidden="true">'
            f'<g fill="none" stroke-width="1" stroke-linecap="round">{"".join(parts)}</g></svg>')

def sheet(n, title, kicker, body):
    meta = (f'<div class="mini">{field("Date", f"s{n}_date", "w2", "9")}</div>' if n > 1 else '')
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{ruled(n)}{meta}<span class="pageno">{n}<i>/{PAGES}</i></span></div>
  </header>
  <div class="rules"><span></span><span class="pen"></span></div>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="dots">&#9679;&nbsp;&#9679;&nbsp;&#9679;</span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    return sheet(1, "This<br>September.", "School kit &middot; at a glance",
        '<div class="two b46"><section>' +
        sec("The child", "One sheet each &mdash; print it again for the next one", "pen") +
        field("Name", "s1_name") +
        '<div class="split2">' + field("Year", "s1_year", "w3") +
        field("Class", "s1_class", "w3") + '</div>' +
        field("School", "s1_school") +
        field("Teacher", "s1_teacher") +
        field("Term starts", "s1_start", "w2") +
        field("Uniform needed from", "s1_uniform_from", "w2") +
        sec("The dates that are not yours to move", "Look them up in August", "red") +
        '<div class="kd head"><span>What</span><span class="w2">When</span>'
        '<span class="c">In diary</span></div>' +
        "".join(f'<div class="kd"><span class="kdn">{lab}</span>'
                f'{blank(f"s1_kd_{i}", "w2", "10")}'
                f'<span class="c">{check(f"s1_kdok_{i}", "red")}</span></div>'
                for i, lab in enumerate(["Term starts", "First INSET / staff day",
                                         "Half term", "Term ends", "Parents&#8217; evening",
                                         "Photographs", "Forms due back",
                                         "Clubs start", "Last day of term"], start=1)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>The three weeks before are the whole job</b>'
        '<p>Nothing on these nine pages is hard. What makes September hard is doing all of it in '
        'the last four days, at ten o&#8217;clock at night, while sewing name tapes into a jumper '
        'that turns out to be the wrong size. Page 2 first, in the middle of August: if the shoes '
        'do not fit, everything else waits.</p>'
        '</div>' +
        sec("Who does the mornings", "Written down, it stops being a row", "pen") +
        '<div class="wk head"><span>Day</span><span>Drop-off</span><span>Pick-up</span></div>' +
        "".join(f'<div class="wk"><span class="wkd">{d}</span>'
                f'{blank(f"s1_drop_{i}", "", "10")}{blank(f"s1_pick_{i}", "", "10")}</div>'
                for i, d in enumerate(DAYS, start=1)) +
        sec("Money, decided before the shopping", "", "red") +
        '<div class="capbox">' +
        '<span class="capl">The whole of September, and not a penny more</span>' +
        blank("s1_cap", "capnum", "17") + '</div>' +
        sec("The one thing they are worried about", "", "pencil") +
        "".join(f'<div class="wl">{blank(f"s1_worry_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        sec("Booked before September", "Haircut, shoes, the eye test", "pen") +
        "".join(f'<div class="wl">{check(f"s1_bk_{i}", "pen")}'
                f'{blank(f"s1_bk_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

UNIFORM = ["Jumper / cardigan", "Shirts / polos", "Trousers / skirt", "Dress",
           "PE top", "PE shorts / joggers", "Socks / tights", "Coat",
           "School shoes", "PE trainers", "Wellingtons", "Book bag / rucksack",
           "Water bottle", "Lunchbox", "Swimming kit"]

def page_2():
    rows = "".join(
        f'<div class="un"><span class="unn">{item}</span>'
        f'{blank(f"s2_was_{i}", "w3", "10")}{blank(f"s2_now_{i}", "w3", "10")}'
        f'{blank(f"s2_need_{i}", "w3", "10")}{blank(f"s2_where_{i}", "", "10")}'
        f'<span class="c">{check(f"s2_got_{i}", "pen")}</span></div>'
        for i, item in enumerate(UNIFORM, start=1))
    return sheet(2, "What they have<br>grown out of.", "School kit &middot; sizes, then shopping",
        '<div class="two b2"><section>' +
        sec("Measure before you buy anything", "Last size, this size, how many", "pen") +
        '<div class="un head"><span class="unn">What</span><span class="w3">Was</span>'
        '<span class="w3">Now</span><span class="w3">How many</span>'
        '<span>Where from</span><span class="c">Got</span></div>' + rows +
        '</section><section>' +
        '<div class="warn">'
        '<b>Shoes exactly, jumpers one size up</b>'
        '<p>Feet are measured, not guessed, and they are measured at the end of August rather '
        'than in July &mdash; children grow over the summer and shoes bought early are tight by '
        'October. Jumpers and coats can take a size up; shirts and trousers cannot, because a '
        'child in clothes that are too big is a child who cannot manage their own zip.</p>'
        '</div>' +
        sec("Second-hand first", "Most of it is worn for one year", "pencil") +
        "".join(f'<div class="wl">{check(f"s2_sh_{i}", "pencil")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["The school&#8217;s own second-hand rail or sale",
                                       "The class or year group chat",
                                       "Anything with a logo, bought used; plain, bought new",
                                       "Handed down, and checked before it is put away"], start=1)) +
        sec("Passed on to someone else", "", "pen") +
        "".join(f'<div class="wl">{blank(f"s2_pass_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Feet measured on", "", "red") +
        '<div class="split2">' + field("Date", "s2_feet_when", "w2") +
        field("Size", "s2_feet_size", "w2") + '</div>' +
        sec("Still to find", "") +
        "".join(f'<div class="wl">{check(f"s2_find_{i}", "red")}'
                f'{blank(f"s2_find_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_3():
    rows = "".join(
        f'<div class="sp">{blank(f"s3_what_{i}", "", "10.5")}'
        f'{blank(f"s3_many_{i}", "w3", "10")}'
        f'<span class="c">{check(f"s3_got_{i}", "pen")}</span>'
        f'<span class="c">{check(f"s3_lab_{i}", "red")}</span></div>'
        for i in range(1, 17))
    return sheet(3, "The list, and<br>the labelling.", "School kit &middot; the evening nobody enjoys",
        '<div class="two b46"><section>' +
        sec("What the letter asked for", "Copy it here once", "pen") +
        '<div class="sp head"><span>What</span><span class="w3">How many</span>'
        '<span class="c">Got</span><span class="c">Named</span></div>' + rows +
        '</section><section>' +
        '<div class="warn">'
        '<b>Label the thing, not the bag</b>'
        '<p>The bag comes home. The jumper does not. Everything that can be taken off during a '
        'school day needs a name on the item itself &mdash; jumper, coat, PE kit, water bottle, '
        'lunchbox, and <b>both shoes</b>, inside. It is an hour in August and it is the difference '
        'between losing four jumpers a year and losing none.</p>'
        '</div>' +
        sec("How you are labelling", "Pick one and buy enough of it", "red") +
        "".join(f'<div class="wl">{check(f"s3_m_{i}", "red")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Iron-on tapes &mdash; survive the wash, slow to do",
                                       "Stick-on labels &mdash; for bottles, boxes and pencil cases",
                                       "A laundry marker on the care label &mdash; free, and enough",
                                       "Sew-on, if the school insists"], start=1)) +
        '<div class="split2">' + field("Ordered on", "s3_lab_when", "w2") +
        field("How many", "s3_lab_many", "w2") + '</div>' +
        sec("Labelled and done", "", "pen") +
        "".join(f'<div class="wl">{check(f"s3_done_{i}", "pen")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Every jumper and cardigan",
                                       "The coat, inside the collar",
                                       "Both shoes, and both trainers",
                                       "Water bottle and lunchbox",
                                       "PE bag and everything in it"], start=1)) +
        sec("Buy two of", "The things that vanish first", "pencil") +
        "".join(f'<div class="wl">{blank(f"s3_two_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

COSTS = ["Uniform", "School shoes", "PE kit and trainers", "Coat", "Bag and lunchbox",
         "Stationery", "Books", "School dinners / snacks", "Clubs and lessons",
         "Trips", "Photographs", "Charity and dressing-up days"]

def page_4():
    rows = "".join(
        f'<div class="cs"><span class="csn">{item}</span>'
        f'{blank(f"s4_est_{i}", "w2", "10")}{blank(f"s4_act_{i}", "w2", "10")}'
        f'<span class="c">{check(f"s4_paid_{i}", "red")}</span></div>'
        for i, item in enumerate(COSTS, start=1))
    return sheet(4, "What the year<br>actually costs.", "School kit &middot; the honest page",
        '<div class="two b46"><section>' +
        sec("Line by line", "Guess first, then write what it really was", "red") +
        '<div class="cs head"><span class="csn">What</span><span class="w2">Reckoned</span>'
        '<span class="w2">Really</span><span class="c">Paid</span></div>' + rows +
        '<div class="totals">' +
        "".join(f'<div class="tot"><span class="totlbl">{v}</span>'
                f'{blank(f"s4_t_{k}", "num", "12")}</div>'
                for k, v in [("est", "Reckoned"), ("act", "Really"),
                             ("over", "Difference")]) + '</div>' +
        '</section><section>' +
        '<div class="warn">'
        '<b>It is never the uniform, it is the twelfth thing</b>'
        '<p>Most people budget for the uniform and the shoes and stop there. The rest of the list '
        'above &mdash; trips, clubs, photographs, the dressing-up day in October &mdash; arrives '
        'in letters, one at a time, and is never added up. Total it in August and the letters '
        'stop being a surprise.</p>'
        '</div>' +
        sec("Paid monthly, not once", "Dinners, clubs, the milk", "pen") +
        '<div class="mo head"><span>What</span><span class="w2">Per month</span>'
        '<span class="c">Set up</span></div>' +
        "".join(f'<div class="mo">{blank(f"s4_mo_{i}", "", "10")}'
                f'{blank(f"s4_mo_c_{i}", "w2", "10")}'
                f'<span class="c">{check(f"s4_mo_ok_{i}", "pen")}</span></div>'
                for i in range(1, 6)) +
        sec("Help that exists and is not advertised", "Ask the office; they will not offer", "pencil") +
        "".join(f'<div class="wl">{check(f"s4_help_{i}", "pencil")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["A uniform grant or voucher, if there is one",
                                       "Free or reduced school meals",
                                       "Help with trips and residentials",
                                       "Paying for a big trip in instalments"], start=1)) +
        sec("What we are not buying this year", "", "red") +
        "".join(f'<div class="wl">{blank(f"s4_no_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_5():
    cols = "".join(
        f'<section class="dblock"><div class="dhead"><b>{d}</b></div>'
        f'<div class="dts">' +
        sec("Needs", "") +
        "".join(f'<div class="dt">{check(f"s5_n{i}_{j}", "pen")}'
                f'{blank(f"s5_nt{i}_{j}", "grow", "9.5")}</div>' for j in (1, 2, 3, 4, 5)) +
        sec("After school", "") +
        "".join(f'<div class="dt">{blank(f"s5_a{i}_{j}", "grow", "9.5")}</div>' for j in (1, 2)) +
        sec("Collected by", "") +
        f'<div class="dt">{blank(f"s5_c{i}", "grow", "9.5")}</div>'
        '</div></section>'
        for i, d in enumerate(DAYS, start=1))
    return sheet(5, "The week,<br>on one page.", "School kit &middot; what goes in on which day",
        f'<div class="dcols">{cols}</div>' +
        '<div class="warn" style="margin-bottom:0">'
        '<b>Print this one and put it where the bags are</b>'
        '<p>PE kit on Tuesday, library book on Thursday, recorder on Friday, forest school '
        'wellingtons on the week you forget. None of it is hard to remember and all of it is '
        'impossible to remember at half past eight. This page lives by the front door, not in '
        'a folder.</p>'
        '</div>')

def page_6():
    rows = "".join(
        f'<div class="lb"><span class="lbd">{d}</span>{blank(f"s6_main_{i}", "", "10")}'
        f'{blank(f"s6_side_{i}", "", "10")}{blank(f"s6_fruit_{i}", "", "10")}'
        f'{blank(f"s6_treat_{i}", "w2", "10")}</div>'
        for i, d in enumerate(DAYS, start=1))
    return sheet(6, "Five<br>lunchboxes.", "School kit &middot; the daily one",
        '<div class="two b46"><section>' +
        sec("The week, packed", "Four slots, every day", "pencil") +
        '<div class="lb head"><span class="lbd">Day</span><span>Main</span>'
        '<span>Something else</span><span>Fruit / veg</span>'
        '<span class="w2">Treat</span></div>' + rows +
        sec("What they will actually eat", "Be honest; the bin is honest", "pen") +
        "".join(f'<div class="wl">{blank(f"s6_eat_{i}", "grow", "10.5")}</div>'
                for i in range(1, 6)) +
        sec("What comes home untouched, every time", "", "red") +
        "".join(f'<div class="wl">{blank(f"s6_back_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>Read the school&#8217;s rules once, then stop guessing</b>'
        '<p>Most schools ban nuts outright, and many also rule on sweets, chocolate, fizzy drinks '
        'and glass. Write the actual rule here rather than remembering a version of it &mdash; and '
        'if your child has an allergy, the office needs it in writing and the class teacher needs '
        'to have read it, which are two different things.</p>'
        '</div>' +
        sec("This school&#8217;s rules", "", "red") +
        "".join(f'<div class="wl">{blank(f"s6_rule_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Allergies, and who has been told", "", "red") +
        '<div class="al head"><span class="w2">Who</span><span>What</span>'
        '<span class="c">Office</span><span class="c">Class</span></div>' +
        "".join(f'<div class="al">{blank(f"s6_al_w_{i}", "w2", "10")}'
                f'{blank(f"s6_al_t_{i}", "", "10")}'
                f'<span class="c">{check(f"s6_al_o_{i}", "red")}</span>'
                f'<span class="c">{check(f"s6_al_c_{i}", "red")}</span></div>'
                for i in (1, 2, 3)) +
        sec("Kit that makes it quicker", "", "pencil") +
        "".join(f'<div class="wl">{check(f"s6_kit_{i}", "pencil")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["A box they can open themselves, tested at home",
                                       "A bottle that does not leak in a bag",
                                       "Something prepared on Sunday for all five days",
                                       "A spare box, for the day one is left at school"], start=1)) +
        '</section></div>')

def page_7():
    return sheet(7, "The night<br>before.", "School kit &middot; the routine that fixes mornings",
        '<div class="two b46"><section>' +
        '<div class="warn">'
        '<b>A good morning is made the night before</b>'
        '<p>Every difficult school morning is really an evening that did not happen. This page is '
        'meant to be printed once and used every night until nobody needs to read it &mdash; '
        'which takes about three weeks. Tick it for the first fortnight, then stop; by then it is '
        'a habit and the page has done its job.</p>'
        '</div>' +
        sec("The evening, in order", "Before anyone is tired, not after", "pen") +
        "".join(f'<div class="wl">{check(f"s7_ev_{i}", "pen")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Bag emptied &mdash; letters, lunchbox, anything wet",
                                       "Tomorrow checked against the week on page 5",
                                       "Uniform out, all of it, including socks",
                                       "Shoes by the door, together",
                                       "Lunch made, or made as far as it will keep",
                                       "Bottle washed and filled",
                                       "Reading book and homework signed and in the bag",
                                       "Bag by the door, zipped"], start=1)) +
        sec("Anything else that is only yours", "", "pencil") +
        "".join(f'<div class="wl">{check(f"s7_own_{i}", "pencil")}'
                f'{blank(f"s7_own_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("The morning, split", "Two columns so nobody does both", "red") +
        '<div class="mg head"><span>The job</span><span>Whose</span>'
        '<span class="w2">By when</span></div>' +
        "".join(f'<div class="mg"><span class="mgn">{t}</span>'
                f'{blank(f"s7_mw_{i}", "", "10")}{blank(f"s7_mt_{i}", "w2", "10")}</div>'
                for i, t in enumerate(["Wake, curtains, lights on", "Breakfast",
                                       "Dressed", "Teeth and hair", "Shoes and coat",
                                       "Out of the door"], start=1)) +
        sec("Bedtime, worked back from waking", "", "pen") +
        '<div class="split2">' + field("Wakes at", "s7_wake", "w2") +
        field("So, asleep by", "s7_sleep", "w2") + '</div>' +
        field("Which means upstairs at", "s7_up", "w2") +
        sec("For the child who is slow in the mornings", "", "pencil") +
        "".join(f'<div class="wl">{check(f"s7_slow_{i}", "pencil")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["A clock they can read, in their room",
                                       "One instruction at a time, not a list",
                                       "Breakfast they can start without help",
                                       "Ten minutes earlier, rather than louder",
                                       "The same order every morning, so it stops "
                                       "needing to be said"], start=1)) +
        '</section></div>')

def page_8():
    return sheet(8, "The first day,<br>and the first week.", "School kit &middot; the part that is not admin",
        '<div class="two b46"><section>' +
        sec("Before", "", "pen") +
        field("What they are looking forward to", "s8_fwd") +
        field("What they are worried about", "s8_worry") +
        field("Who they already know in the class", "s8_know") +
        field("What we said we would do about it", "s8_said") +
        sec("The morning itself", "", "pencil") +
        "".join(f'<div class="wl">{check(f"s8_m_{i}", "pencil")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Photograph at the door, before anyone cries",
                                       "Leave ten minutes earlier than you think",
                                       "Say what happens at the end of the day, out loud",
                                       "A short goodbye &mdash; long ones are harder",
                                       "Somewhere to go afterwards, for you"], start=1)) +
        sec("What to ask at pick-up", "&#8220;How was school?&#8221; gets you nothing", "red") +
        "".join(f'<div class="wl">{check(f"s8_ask_{i}", "red")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Who did you sit next to?",
                                       "What was the best bit of lunch?",
                                       "What made somebody laugh?",
                                       "What was hard?"], start=1)) +
        '</section><section>' +
        '<div class="warn">'
        '<b>The first fortnight is exhausting, and that is normal</b>'
        '<p>Expect tiredness, short tempers and a child who falls apart at the door at four '
        'o&#8217;clock having been fine all day &mdash; that is what holding it together all day '
        'looks like from the outside. Early nights and a light week beat any conversation about '
        'it. If it is still hard after three or four weeks, that is when you talk to the teacher.</p>'
        '</div>' +
        sec("The first week, day by day", "One line, that evening", "pen") +
        '<div class="fw head"><span>Day</span><span>How it went</span></div>' +
        "".join(f'<div class="fw"><span class="fwd">{d}</span>'
                f'{blank(f"s8_fw_{i}", "grow", "10")}</div>'
                for i, d in enumerate(DAYS, start=1)) +
        sec("Keep this week light", "", "pencil") +
        "".join(f'<div class="wl">{check(f"s8_light_{i}", "pencil")}'
                f'{blank(f"s8_light_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Worth mentioning to the teacher", "", "red") +
        "".join(f'<div class="wl">{blank(f"s8_tell_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_9():
    return sheet(9, "Names<br>and numbers.", "School kit &middot; pinned up, not searched for",
        '<div class="two b46"><section>' +
        sec("The school", "", "pen") +
        field("Office", "s9_office") +
        field("Absence line, and by what time", "s9_absence") +
        field("Class teacher", "s9_teacher") +
        field("Teaching assistant", "s9_ta") +
        field("Head of year", "s9_head") +
        field("Before / after-school club", "s9_club") +
        field("School email or app", "s9_app") +
        field("School nurse or first aid", "s9_nurse") +
        sec("Other grown-ups who can collect", "In writing, to the office", "red") +
        '<div class="pe head"><span>Who</span><span class="w2">Number</span>'
        '<span class="c">Told</span></div>' +
        "".join(f'<div class="pe">{blank(f"s9_pw_{i}", "", "10")}'
                f'{blank(f"s9_pn_{i}", "w2", "10")}'
                f'<span class="c">{check(f"s9_pok_{i}", "red")}</span></div>'
                for i in range(1, 6)) +
        '</section><section>' +
        sec("Parents worth having a number for", "", "pencil") +
        '<div class="pe head"><span>Who, and whose parent</span><span class="w2">Number</span>'
        '<span class="c">Have it</span></div>' +
        "".join(f'<div class="pe">{blank(f"s9_ow_{i}", "", "10")}'
                f'{blank(f"s9_on_{i}", "w2", "10")}'
                f'<span class="c">{check(f"s9_ook_{i}", "pencil")}</span></div>'
                for i in range(1, 6)) +
        sec("September admin, done once", "", "pen") +
        "".join(f'<div class="wl">{check(f"s9_ad_{i}", "pen")}'
                f'<span class="rtext">{t}</span></div>'
                for i, t in enumerate(["Every form signed and sent back",
                                       "Medical and allergy details updated",
                                       "The payment app set up before you need it",
                                       "Emergency contacts checked, not assumed",
                                       "Term dates in your own calendar, all of them"], start=1)) +
        sec("Next August, three lines", "Written now, worth ten next summer", "red") +
        "".join(f'<div class="wl">{blank(f"s9_next_{i}", "grow", "10.5")}</div>'
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
  --pen:{C["pen"]}; --red:{C["red"]}; --pencil:{C["pencil"]};
  --backdrop:#e9ebee;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#131518; }} }}
:root[data-theme="dark"]{{ --backdrop:#131518; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Asap","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(26,30,36,.15);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:600; text-transform:uppercase; letter-spacing:.16em; font-size:7.4pt;
  color:var(--soft); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in; }}
.mast h1{{ font-family:"Zilla Slab",Georgia,serif; font-weight:700; font-size:{S["display"]};
  line-height:1.0; margin:6px 0 0; letter-spacing:-.015em; }}
.mastright{{ display:flex; align-items:flex-end; gap:13px; position:relative; }}
.ruled{{ position:absolute; right:-4px; top:-62px; width:1.24in; height:1.16in; }}
.ruled .r{{ stroke:var(--strong); }}
.ruled .m{{ stroke:var(--red); opacity:.55; }}
.pageno{{ font-family:"Zilla Slab",Georgia,serif; font-weight:700; font-size:16pt;
  color:var(--pen); }}
.pageno i{{ font-style:normal; font-size:9pt; color:var(--faint); }}
.mini{{ display:flex; gap:10px; padding-bottom:3px; }}
.mini .fr{{ height:.22in; }}
.rules{{ display:flex; flex-direction:column; gap:2px; padding-top:9px; flex:none; }}
.rules span{{ height:1.2px; background:var(--ink); }}
.rules span.pen{{ height:3px; background:var(--pen); }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:12px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.05fr 1fr; }}
.two.b2{{ grid-template-columns:1.35fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}

.sec{{ display:flex; align-items:center; gap:9px; padding:9px 0 6px; overflow:hidden; flex:none; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-family:"Zilla Slab",Georgia,serif; font-weight:600; text-transform:uppercase;
  letter-spacing:.06em; font-size:9pt; color:var(--ink); white-space:nowrap; }}
.lbl.pen{{ color:var(--pen); }} .lbl.red{{ color:var(--red); }}
.lbl.pencil{{ color:var(--pencil); }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.5in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.2px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.85in; }} .blank.w3{{ flex:none; width:.5in; }}
.blank.num{{ flex:none; width:.75in; }} .blank.c{{ flex:none; width:.2in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

.box{{ width:11px; height:11px; border:1.4px solid var(--strong); flex:none; margin-bottom:3px;
  border-radius:2px; }}
.box.pen{{ border-color:var(--pen); }} .box.red{{ border-color:var(--red); }}
.box.pencil{{ border-color:var(--pencil); }}
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

.warn{{ border:1.5px solid var(--pen); border-radius:3px; padding:11px 13px; margin:10px 0;
  flex:none; }}
.warn b{{ font-size:9.6pt; }}
.warn p{{ margin:5px 0 0; font-size:9.3pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.kd{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.kdn{{ font-size:9.6pt; padding-bottom:4px; }}
.wk{{ display:grid; grid-template-columns:.72in minmax(0,1fr) minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.wkd{{ font-size:9pt; color:var(--pen); font-weight:600; padding-bottom:4px; }}
.capbox{{ border:1.5px solid var(--red); border-radius:3px; padding:9px 13px 10px;
  margin-top:6px; display:flex; align-items:flex-end; gap:12px; flex:none; }}
.capl{{ font-size:8.6pt; color:var(--soft); line-height:1.25; padding-bottom:3px; }}
.blank.capnum{{ flex:none; width:1.05in; height:.32in; border-bottom-width:1.5px;
  border-bottom-color:var(--red); }}

/* page 2 ------------------------------------------------------------------ */
.un{{ display:grid; grid-template-columns:1.2in .44in .44in .44in minmax(0,1fr) .3in;
  gap:0 8px; align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.unn{{ font-size:9.4pt; padding-bottom:4px; }}

/* page 3 ------------------------------------------------------------------ */
.sp{{ display:grid; grid-template-columns:minmax(0,1fr) .5in .3in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.26in; max-height:.44in; }}

/* page 4 ------------------------------------------------------------------ */
.cs{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .85in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.54in; }}
.csn{{ font-size:9.6pt; padding-bottom:4px; }}
.totals{{ display:flex; gap:22px; justify-content:flex-end; border-top:2px solid var(--ink);
  margin-top:8px; padding-top:9px; flex:none; }}
.tot{{ display:flex; align-items:flex-end; gap:9px; }}
.totlbl{{ font-family:"Zilla Slab",Georgia,serif; font-weight:600; text-transform:uppercase;
  font-size:8.4pt; color:var(--soft); padding-bottom:3px; letter-spacing:.05em; }}
.mo{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* page 5 ------------------------------------------------------------------ */
.dcols{{ flex:1; min-height:0; display:grid; grid-template-columns:repeat(5,1fr); gap:0 .22in; }}
.dblock{{ display:flex; flex-direction:column; min-width:0; }}
.dhead{{ border-bottom:2px solid var(--pen); padding-bottom:5px; margin-bottom:4px; flex:none; }}
.dhead b{{ font-family:"Zilla Slab",Georgia,serif; font-weight:700; font-size:12pt;
  color:var(--pen); }}
.dblock .sec{{ padding:7px 0 4px; }}
.dblock .lbl{{ font-size:7.4pt; letter-spacing:.09em; color:var(--soft); }}
.dts{{ flex:1; display:flex; flex-direction:column; min-height:0; }}
.dt{{ display:flex; align-items:flex-end; gap:7px; flex:1 1 auto; min-height:.3in;
  max-height:.8in; }}

/* page 6 ------------------------------------------------------------------ */
.lb{{ display:grid;
  grid-template-columns:.72in minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr) .85in;
  gap:0 9px; align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.5in; }}
.lbd{{ font-size:9pt; color:var(--pencil); font-weight:600; padding-bottom:4px; }}
.al{{ display:grid; grid-template-columns:.85in minmax(0,1fr) .42in .42in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* pages 7 to 9 ------------------------------------------------------------ */
.mg{{ display:grid; grid-template-columns:1.35fr minmax(0,1fr) .85in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}
.mgn{{ font-size:9.4pt; padding-bottom:4px; line-height:1.15; }}
.fw{{ display:grid; grid-template-columns:.72in minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.5in; }}
.fwd{{ font-size:9pt; color:var(--pen); font-weight:600; padding-bottom:4px; }}
.pe{{ display:grid; grid-template-columns:minmax(0,1fr) .85in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.2px solid var(--ink); margin-top:10px; padding-top:8px; }}
.foot .mark{{ font-family:"Zilla Slab",Georgia,serif; font-weight:500; font-size:9pt;
  color:var(--faint); }}
.dots{{ font-size:6pt; color:var(--pen); letter-spacing:.1em; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-school.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Night Before School Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-school-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"school-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"school-{name}")
        fill_pdf = os.path.join(DIST, f"school-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["pen"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Night Before &nbsp;&middot;&nbsp; back-to-school kit",
    title="Start<br><em>here.</em>",
    lede="Nine pages for the parent rather than the pupil: what they have grown out of, the list "
         "and the labelling, what the year actually costs, the week as a grid, five lunchboxes, "
         "the evening routine that fixes the mornings, the first day, and the names and numbers.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Start with page 2", "if the shoes do not fit, everything else waits"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. Tick the boxes with a click. <b>Save a copy first</b>, and save one per child "
        "&mdash; next August it opens with last year&#8217;s sizes, costs and phone numbers "
        "already in it, which is exactly when you want them.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Print <b>page 5</b> "
        "and put it where the bags are: it is the week as five columns, and it is what stops the "
        "PE-kit-on-Tuesday problem. Print <b>page 7</b> too and use it every night for the first "
        "fortnight, then stop &mdash; by then it is a habit.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "One copy of pages 1&ndash;4 per child; pages 5&ndash;9 can be shared",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="Two things this kit says out loud",
    s5p="<b>Label the thing, not the bag.</b> The bag comes home; the jumper does not. Everything "
        "that can be taken off during the day needs a name on the item &mdash; jumper, coat, PE "
        "kit, bottle, lunchbox and both shoes, inside. And <b>shoes exactly, jumpers one size "
        "up</b>: feet are measured at the end of August, not in July, because children grow over "
        "the summer.",
    license="Personal use only. Print as many copies as you like for your own family. Please do "
            "not resell, share or redistribute the files. Fonts: Zilla Slab and Asap "
            "(SIL Open Font License).",
    mark="The night before decides the morning.",
)

PAGE_NAMES = ["This September", "Sizes, then shopping", "The list &amp; the labelling",
              "What the year costs", "The week, one page", "Five lunchboxes",
              "The night before", "The first day", "Names &amp; numbers"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["term"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Zilla Slab",Georgia,serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Asap",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Asap"'),
                 ("--s1:#f2a65a", "--s1:" + C["pencil"]), ("--s2:#ee6c4d", "--s2:" + C["red"]),
                 ("--s3:#c43e7a", "--s3:" + C["pen"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-style:italic;", "font-style:normal;")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-school.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    hp = os.path.join(work, "readme-school.html")
    open(hp, "w", encoding="utf-8").write(tpl)
    B.to_pdf(hp, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-school.css")
    doc = pymupdf.open(os.path.join(DIST, "school-planner-letter-term-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"school-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["term"]
    over = (
        "<style>"
        "h1{font-family:'Zilla Slab',Georgia,serif;font-weight:700;line-height:1.0;"
        "letter-spacing:-.018em}"
        f"h1 em{{font-style:normal;color:{C['pen']}}}"
        "body{font-family:'Asap',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['red']};font-family:'Asap';font-weight:600;letter-spacing:.18em}}"
        f".rule{{background:{C['pen']};height:4px;width:220px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Asap';font-weight:600;"
        "letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(26,30,36,.17)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Asap',Arial,sans-serif;font-weight:600;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>The night before<br>decides the <em>morning.</em></h1>
          <span class="rule"></span>
          <p class="sub">A back-to-school kit for the parent, not the pupil: sizes before
          shopping, the labelling, what the year really costs, and the week as five columns
          that lives by the front door.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated, any year</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>one September.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The two pages that go on the wall</span>
      <h1>The week.<br><em>The evening.</em></h1>
      <p class="sub">Five columns for what goes in the bag on which day, because nobody
      remembers the recorder at half past eight. And an evening routine to tick for a
      fortnight and then never need again.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[4]}" style="height:1170px"><img src="{imgs[6]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#f0f2f4", "100px", "84px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#eef0f3", "100px", "80px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-school-{name}.html")
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
        BD.package(DIST, "Night-Before-School-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building school kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "school-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "term", embed_fonts=False))
    print("Wrote school-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Night-Before-School-Kit")


if __name__ == "__main__":
    main()
