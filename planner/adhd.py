#!/usr/bin/env python3
"""Build the First Move ADHD-friendly planning set.

Eight pages designed around the parts of planning that actually break: starting,
capturing, estimating time, and the maintenance nobody wants to think about.
The design rules are deliberate — few slots per page, large type, one job per
page, generous white space, colour used only as a signal.

    python3 adhd.py                     # every size / colourway
    python3 adhd.py --only letter-signal
    python3 adhd.py --extras            # start-here sheet, listing images, zips
"""
import argparse, base64, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-adhd")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600"
          "&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".5in .55in .45in", display="33pt"),
    "a4":     dict(B.SIZES["a4"],     pad="13mm 14mm 12mm", display="32pt"),
}

COLORWAYS = {
    # one signal each: teal = do it now, amber = parked on purpose,
    # plum = how you felt, green = done. Nothing else is coloured.
    "signal": dict(ink="#1e2430", soft="#5a6475", faint="#98a0af", rule="#e3e7ee",
                   strong="#c2c9d6", now="#0f7c86", park="#e08a2e",
                   mood="#6b5ca5", done="#2f9e6e"),
    "mono":   dict(ink="#22242a", soft="#5f6570", faint="#9aa0ab", rule="#e4e6ea",
                   strong="#c3c7cf", now="#3c4048", park="#8a8f99",
                   mood="#6a6f7a", done="#4e535c"),
}

PAGES = 8
MARK = "Start small. Start now."

# --------------------------------------------------------------------------- helpers

def check(f, tone="", big=False):
    cls = f"box {tone}{' big' if big else ''}"
    return f'<span class="{cls}" data-field="{f}" data-ftype="check"></span>'

def blank(f, cls="", fs="11"):
    return f'<span class="blank {cls}" data-field="{f}" data-fsize="{fs}"></span>'

def sec(label, hint="", tone=""):
    hint = f'<span class="hint">{hint}</span>' if hint else ""
    return (f'<div class="sec"><span class="lbl {tone}">{label}</span>'
            f'<span class="line"></span>{hint}</div>')

def field(label, f, cls="", fs="11"):
    return f'<div class="fr"><span class="flbl">{label}</span>{blank(f, cls, fs)}</div>'

def sheet(n, title, kicker, body):
    meta = (f'<div class="mini">{field("Date", f"a{n}_date", "w2", "9")}</div>'
            if n > 1 else '')
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{meta}<span class="pageno">{n}<i>/{PAGES}</i></span></div>
  </header>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="dots"><i class="n"></i><i class="p"></i><i class="d"></i></span></footer>
</div>'''

def pips(prefix, n=5, tone="mood"):
    return ('<span class="pips">' +
            "".join(f'<span class="pip">{check(f"{prefix}_{i}", tone)}</span>'
                    for i in range(1, n + 1)) + '</span>')

# --------------------------------------------------------------------------- pages

def page_1():
    """The daily sheet. Three tasks, never more."""
    one = ('<div class="onebox">' +
           sec("The one thing", "If only this happens, today counts", "now") +
           f'<div class="bigline">{blank("a1_one", "grow", "13")}</div>' +
           '<div class="onemeta">' +
           field("Because", "a1_why", "grow", "10") +
           '<div class="split2">' + field("Will take", "a1_est", "w3", "10") +
           field("Start at", "a1_start", "w3", "10") + '</div>' +
           f'<div class="firstmove"><span class="fmlbl">First move</span>'
           f'{blank("a1_first", "grow", "11")}'
           f'<span class="fmhint">One physical action. &ldquo;Open the file.&rdquo;</span></div>' +
           f'<div class="donerow">{check("a1_one_done", "done", True)}'
           f'<span class="donelbl">Done</span></div>'
           '</div></div>')
    two = "".join(
        f'<div class="taskrow">{check(f"a{1}_t{i}_done", "done", True)}'
        f'{blank(f"a1_t{i}", "grow", "11")}{blank(f"a1_t{i}_est", "w3", "9")}</div>'
        for i in (1, 2))
    blocks = "".join(
        f'<div class="tb"><span class="tblbl">{lab}</span>{blank(f"a1_blk_{i}", "grow", "10")}</div>'
        for i, lab in enumerate(["Morning", "Afternoon", "Evening"], start=1))
    basics = "".join(
        f'<span class="basic">{check(f"a1_b_{i}", "done")}<span>{lab}</span></span>'
        for i, lab in enumerate(["Meds", "Water", "Ate", "Moved", "Outside", "Washed"], start=1))
    dump = "".join(f'<div class="wl">{blank(f"a1_dump_{i}", "grow", "10")}</div>'
                   for i in range(1, 7))
    notnow = "".join(f'<div class="wl">{check(f"a1_park_{i}", "park")}'
                     f'{blank(f"a1_park_t_{i}", "grow", "10")}</div>' for i in range(1, 5))
    done = "".join(f'<div class="wl">{blank(f"a1_did_{i}", "grow", "10")}</div>'
                   for i in range(1, 6))
    left = (one +
            sec("Two more, only if the one thing is done", "", "now") +
            '<div class="tworows">' + two + '</div>' +
            sec("Roughly when") + f'<div class="tbs">{blocks}</div>' +
            sec("Basics", "Tick what happened, not what should have") +
            f'<div class="basics">{basics}</div>')
    right = (sec("Brain dump", "Everything in your head, unsorted") +
             f'<div class="dump">{dump}</div>' +
             sec("Not today", "Real, but not now", "park") +
             f'<div class="parks">{notnow}</div>' +
             sec("What I actually did", "Counts even if it was not on the list", "done") +
             f'<div class="dids">{done}</div>' +
             '<div class="energy">' +
             f'<span class="enlbl">Energy today</span>{pips("a1_energy")}'
             '<span class="enends">low &rarr; high</span></div>')
    return sheet(1, "Today", "Daily sheet &middot; print this one often",
                 f'<div class="two"><section>{left}</section><section>{right}</section></div>')

def page_2():
    lines = "".join(f'<div class="dl">{blank(f"a2_dump_{i}", "grow", "11")}</div>'
                    for i in range(1, 15))
    cols = []
    for key, title, tone, hint in [
            ("today", "Today", "now", "Max three"),
            ("week", "This week", "", "Give it a day"),
            ("later", "Someday", "park", "Off your mind"),
            ("ask", "Ask someone", "", "Not yours alone"),
            ("bin", "Let it go", "", "It is allowed")]:
        rows = "".join(f'<div class="tr">{check(f"a2_{key}_c{i}", tone)}'
                       f'{blank(f"a2_{key}_{i}", "grow", "9.5")}</div>' for i in range(1, 7))
        cols.append(f'<section class="tcol"><div class="tchead {tone}"><b>{title}</b>'
                    f'<span>{hint}</span></div>{rows}</section>')
    return sheet(2, "Get it out of<br>your head", "Brain dump &amp; triage",
        sec("Write everything. No order, no judgement.", "Ten minutes, then stop") +
        f'<div class="dumpbig">{lines}</div>' +
        '<div class="gap"></div>' +
        sec("Now sort it", "Each line goes in exactly one column") +
        f'<div class="triage">{"".join(cols)}</div>')

def page_3():
    steps = "".join(
        f'<div class="step">{check(f"a3_s{i}_done", "done", True)}'
        f'<span class="snum">{i}</span>{blank(f"a3_s{i}", "grow", "11")}'
        f'{blank(f"a3_s{i}_min", "w3", "9")}</div>' for i in range(1, 11))
    return sheet(3, "One task,<br>in pieces", "Task breakdown &middot; for the one you keep avoiding",
        '<div class="two b46"><section>' +
        sec("The task", "", "now") +
        f'<div class="bigline">{blank("a3_task", "grow", "13")}</div>' +
        field("Due", "a3_due", "w2", "10") +
        field("Why it matters", "a3_why", "grow", "10") +
        '<div class="gap"></div>' +
        f'<div class="firstmove tall"><span class="fmlbl">The very first move</span>'
        f'{blank("a3_first", "grow", "12")}'
        f'<span class="fmhint">Physical, under two minutes, no decisions in it</span></div>' +
        '<div class="gap"></div>' +
        sec("What is in the way", "Name it and it shrinks") +
        "".join(f'<div class="wl">{blank(f"a3_block_{i}", "grow", "10")}</div>' for i in (1, 2, 3)) +
        sec("Who could make this easier") +
        "".join(f'<div class="wl">{blank(f"a3_help_{i}", "grow", "10")}</div>' for i in (1, 2)) +
        sec("If I only get ten minutes today", "Which step fits in ten?", "now") +
        f'<div class="wl">{blank("a3_tenmin", "grow", "10.5")}</div>' +
        sec("What I keep telling myself about it", "Write it down; it is usually not true") +
        "".join(f'<div class="wl">{blank(f"a3_story_{i}", "grow", "10")}</div>' for i in (1, 2)) +
        '</section><section>' +
        sec("The steps", "Smaller than feels necessary", "now") +
        '<div class="step head"><span></span><span class="snum">#</span>'
        '<span>What happens</span><span class="w3">Mins</span></div>' +
        steps +
        '<div class="gap"></div>' +
        '<div class="split2">' + field("I guess", "a3_guess", "w3", "10") +
        field("It took", "a3_actual", "w3", "10") + '</div>' +
        sec("When it is done", "Decide the reward before you start", "done") +
        "".join(f'<div class="wl">{blank(f"a3_reward_{i}", "grow", "11")}</div>' for i in (1, 2)) +
        '</section></div>')

def page_4():
    rows = "".join(
        f'<div class="tm">{blank(f"a4_task_{i}", "", "10.5")}{blank(f"a4_guess_{i}", "w3", "10")}'
        f'{blank(f"a4_real_{i}", "w3", "10")}{blank(f"a4_off_{i}", "w3", "10")}'
        f'{blank(f"a4_note_{i}", "", "9.5")}</div>' for i in range(1, 13))
    return sheet(4, "How long<br>it really takes", "Time check &middot; the honest column is the last one",
        sec("Guess first, then time it", "Do not adjust the guess afterwards", "now") +
        '<div class="tm head"><span>Task</span><span class="w3">Guess</span>'
        '<span class="w3">Real</span><span class="w3">Off by</span><span>What made the difference</span></div>' +
        rows +
        '<div class="gap"></div>'
        '<div class="two b46"><section>' +
        '<div class="callout">'
        '<b>Why this page exists</b>'
        '<p>Most plans fail on arithmetic, not willpower. After ten rows you will know your own '
        'multiplier &mdash; the number you have to multiply every guess by. Use it. Plan the day '
        'with it instead of with hope.</p>'
        '</div>'
        '</section><section>' +
        sec("My multiplier", "Real &divide; guess, averaged") +
        f'<div class="bigline short">{blank("a4_mult", "w2", "16")}</div>' +
        sec("Things that always take longer") +
        "".join(f'<div class="wl">{blank(f"a4_slow_{i}", "grow", "10")}</div>' for i in (1, 2, 3, 4, 5)) +
        '</section></div>')

DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

def page_5():
    cols = "".join(
        f'<section class="day"><div class="dayhead"><b>{d}</b>{blank(f"a5_d{i}_date", "w3", "9")}</div>'
        f'<div class="onething">{check(f"a5_d{i}_done", "done", True)}'
        f'{blank(f"a5_d{i}_one", "grow", "10.5")}</div>'
        + "".join(f'<div class="small">{check(f"a5_d{i}_c{j}")}'
                  f'{blank(f"a5_d{i}_s{j}", "grow", "9.5")}</div>' for j in (1, 2, 3))
        + f'<div class="appt"><span>Fixed</span>{blank(f"a5_d{i}_appt", "grow", "9.5")}</div>'
        '</section>'
        for i, d in enumerate(DAYS, start=1))
    return sheet(5, "The week,<br>lightly", "One thing a day &middot; two if it is a good day",
        sec("Each day gets one real thing", "The rest is a bonus", "now") +
        f'<div class="week">{cols}</div>' +
        '<div class="gap"></div>'
        '<div class="two"><section>' +
        sec("One thing for the whole week", "", "now") +
        f'<div class="bigline">{blank("a5_week_one", "grow", "13")}</div>' +
        sec("Because", "The reason you will need on Thursday") +
        "".join(f'<div class="wl">{blank(f"a5_why_{i}", "grow", "10")}</div>' for i in (1, 2)) +
        '</section><section>' +
        sec("Appointments to book", "The ones that keep sliding", "park") +
        "".join(f'<div class="wl">{check(f"a5_ap_{i}", "park")}'
                f'{blank(f"a5_ap_t_{i}", "grow", "10")}</div>' for i in (1, 2, 3)) +
        '</section></div>' +
        '<div class="gap"></div>' +
        sec("Not this week", "Saying no to three things is planning too", "park") +
        '<div class="notweek">' +
        "".join(f'<div class="wl">{check(f"a5_no_{i}", "park")}'
                f'{blank(f"a5_no_t_{i}", "grow", "10")}</div>' for i in (1, 2, 3)) +
        '</div>')

MORNING = ["Out of bed, feet on the floor", "Water before coffee", "Meds",
           "Look at today&#8217;s one thing", "Dressed"]
EVENING = ["Phone on the charger, out of reach", "Tomorrow&#8217;s one thing written down",
           "Clothes out", "Dishes in the machine", "Lights down"]

def page_6():
    def rows(prefix, seeded):
        out = "".join(f'<div class="rt">{check(f"{prefix}_s{i}", "done", True)}'
                      f'<span class="rtext">{t}</span></div>'
                      for i, t in enumerate(seeded, start=1))
        out += "".join(f'<div class="rt">{check(f"{prefix}_b{i}", "done", True)}'
                       f'{blank(f"{prefix}_l{i}", "grow", "10.5")}</div>' for i in (1, 2, 3))
        return out
    return sheet(6, "Anchors", "Routines &middot; the two ends of the day",
        '<div class="two"><section>' +
        sec("Morning", "In order, no thinking required", "now") +
        rows("a6_am", MORNING) +
        '<div class="gap"></div>' +
        sec("If the morning went sideways", "Pick it up here, not tomorrow") +
        f'<div class="wl">{blank("a6_recover", "grow", "10.5")}</div>' +
        '</section><section>' +
        sec("Evening", "Five minutes that buy back the morning", "mood") +
        rows("a6_pm", EVENING) +
        '<div class="gap"></div>' +
        sec("The reset", "Five things that make tomorrow easier", "done") +
        "".join(f'<div class="wl">{check(f"a6_r_{i}", "done")}'
                f'{blank(f"a6_r_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        '</section></div>')

CHORES = ["Washing on", "Washing away", "Dishes", "Bins out", "Bed linen",
          "Food shop", "Meds &amp; repeats", "Money &amp; bills", "Inbox to zero-ish",
          "Floors", "Plants", "One kind thing for someone"]

def page_7():
    head = ('<div class="ch head"><span>The boring necessary</span>' +
            "".join(f'<span class="c">{d}</span>' for d in DAYS) + '</div>')
    rows = "".join(
        f'<div class="ch"><span class="chname">{c}</span>' +
        "".join(f'<span class="c">{check(f"a7_c{i}_d{j}", "done")}</span>'
                for j in range(1, 8)) + '</div>'
        for i, c in enumerate(CHORES, start=1))
    rows += "".join(
        f'<div class="ch">{blank(f"a7_x{i}", "", "10.5")}' +
        "".join(f'<span class="c">{check(f"a7_x{i}_d{j}", "done")}</span>'
                for j in range(1, 8)) + '</div>' for i in (1, 2, 3))
    return sheet(7, "Boring,<br>necessary", "Maintenance &middot; tick a box, that is the whole job",
        sec("The week", "Nothing here has to be done well", "done") +
        head + rows +
        '<div class="gap"></div>'
        '<div class="two"><section>' +
        sec("Due this month", "Bills, renewals, subscriptions", "park") +
        "".join(f'<div class="wl">{check(f"a7_due_{i}", "park")}'
                f'{blank(f"a7_due_t_{i}", "grow", "10")}</div>' for i in (1, 2, 3, 4)) +
        '</section><section>' +
        sec("Ran out of / need to reorder") +
        "".join(f'<div class="wl">{blank(f"a7_need_{i}", "grow", "10")}</div>' for i in (1, 2, 3, 4)) +
        '</section></div>')

def page_8():
    wins = "".join(f'<div class="wl">{blank(f"a8_win_{i}", "grow", "10.5")}</div>'
                   for i in range(1, 9))
    grid = "".join(
        f'<div class="ep"><span class="epd">{d}</span>{pips(f"a8_e{i}", 5)}</div>'
        for i, d in enumerate(DAYS, start=1))
    return sheet(8, "What actually<br>happened", "Wins &amp; patterns &middot; end of the week",
        '<div class="two b46"><section>' +
        sec("Done this week", "Including the small and the unglamorous", "done") +
        wins +
        '<div class="gap"></div>' +
        sec("Energy, day by day", "Look for the pattern, then plan around it", "mood") +
        f'<div class="epgrid">{grid}</div>' +
        '</section><section>' +
        sec("What worked", "", "now") +
        "".join(f'<div class="wl">{blank(f"a8_worked_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("What drained me", "", "park") +
        "".join(f'<div class="wl">{blank(f"a8_drain_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("One change for next week", "One. Not five.", "now") +
        f'<div class="wl">{blank("a8_change", "grow", "11")}</div>' +
        '<div class="callout kind">'
        '<b>Before you close this</b>'
        '<p>Write the sentence you would say to a friend who had this week.</p>' +
        f'<div class="wl">{blank("a8_kind", "grow", "11")}</div>'
        '</div>'
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --now:{C["now"]}; --park:{C["park"]}; --mood:{C["mood"]}; --done:{C["done"]};
  --backdrop:#eceef2;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#14171d; }} }}
:root[data-theme="dark"]{{ --backdrop:#14171d; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Atkinson Hyperlegible","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(30,36,48,.15);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:700; text-transform:uppercase; letter-spacing:.1em; font-size:8pt;
  color:var(--soft); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap;
  min-width:0; overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in;
  border-bottom:2.5px solid var(--ink); padding-bottom:9px; }}
.mast h1{{ font-family:"Bricolage Grotesque","Atkinson Hyperlegible",sans-serif; font-weight:600;
  font-size:{S["display"]}; line-height:1; margin:6px 0 0; letter-spacing:-.015em; }}
.mastright{{ display:flex; align-items:flex-end; gap:14px; }}
.pageno{{ font-family:"Bricolage Grotesque",sans-serif; font-weight:600; font-size:13pt;
  color:var(--soft); }}
.pageno i{{ font-style:normal; font-size:9pt; color:var(--faint); }}
.mini{{ display:flex; gap:10px; padding-bottom:2px; }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:14px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .34in; }}
.two.b46{{ grid-template-columns:1.05fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; }}
.gap{{ height:16px; flex:none; }}

.sec{{ display:flex; align-items:center; gap:9px; padding:2px 0 7px; overflow:hidden; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.07em; font-size:8.4pt;
  color:var(--ink); white-space:nowrap; }}
.lbl.now{{ color:var(--now); }} .lbl.park{{ color:var(--park); }}
.lbl.mood{{ color:var(--mood); }} .lbl.done{{ color:var(--done); }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:0 0 auto; height:.32in; }}
.mini .fr{{ height:.24in; }}
.flbl{{ font-weight:700; font-size:8.4pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.4px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.9in; }} .blank.w3{{ flex:none; width:.55in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

.box{{ width:12px; height:12px; border:1.6px solid var(--strong); border-radius:2px;
  flex:none; margin-bottom:3px; }}
.box.big{{ width:15px; height:15px; border-width:2px; }}
.box.now{{ border-color:var(--now); }} .box.park{{ border-color:var(--park); }}
.box.mood{{ border-color:var(--mood); }} .box.done{{ border-color:var(--done); }}
.c{{ display:flex; justify-content:center; }}

.wl{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.3in; max-height:.46in; }}

/* --- page 1 -------------------------------------------------------------- */
.onebox{{ border:2px solid var(--now); border-radius:3px; padding:11px 13px 12px;
  margin-bottom:14px; flex:none; }}
.onebox .sec{{ padding-top:0; }}
.bigline{{ display:flex; align-items:flex-end; height:.44in; }}
.bigline .blank{{ border-bottom:1.8px solid var(--strong); }}
.bigline.short{{ height:.5in; }}
.onemeta{{ padding-top:6px; }}
.firstmove{{ border-left:4px solid var(--now); background:rgba(0,0,0,.02);
  padding:7px 10px 8px; margin-top:9px; display:flex; flex-direction:column; gap:3px; }}
.firstmove.tall{{ padding:10px 12px 12px; }}
.fmlbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.07em; font-size:8pt;
  color:var(--now); }}
.firstmove .blank{{ height:.3in; border-bottom:1.4px solid var(--strong); }}
.fmhint{{ font-size:7.6pt; color:var(--faint); font-style:italic; }}
.donerow{{ display:flex; align-items:center; gap:8px; margin-top:10px; }}
.donelbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.08em; font-size:8pt;
  color:var(--done); }}
.donerow .box{{ margin-bottom:0; }}
.tworows{{ flex:none; }}
.taskrow{{ display:flex; align-items:flex-end; gap:10px; height:.42in; }}
.taskrow .blank{{ border-bottom:1.4px solid var(--rule); }}
.tbs{{ flex:none; }}
.tb{{ display:flex; align-items:flex-end; gap:10px; height:.36in; }}
.tblbl{{ width:.78in; flex:none; font-weight:700; font-size:8pt; color:var(--soft);
  padding-bottom:4px; }}
.basics{{ display:flex; flex-wrap:wrap; gap:8px 14px; padding-top:2px; flex:none; }}
.basic{{ display:flex; align-items:center; gap:6px; }}
.basic .box{{ margin-bottom:0; }}
.basic span{{ font-size:9pt; color:var(--soft); }}
.dump, .parks, .dids{{ display:flex; flex-direction:column; flex:1 1 auto; min-height:0; }}
.energy{{ display:flex; align-items:center; gap:10px; border-top:1.4px solid var(--rule);
  margin-top:10px; padding-top:10px; flex:none; }}
.enlbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.07em; font-size:8pt;
  color:var(--mood); }}
.enends{{ font-size:7.6pt; color:var(--faint); }}
.pips{{ display:flex; gap:7px; }}
.pip .box{{ border-radius:50%; margin-bottom:0; }}

/* --- page 2 -------------------------------------------------------------- */
.dumpbig{{ display:flex; flex-direction:column; flex:1 1 auto; min-height:0; }}
.dl{{ display:flex; align-items:flex-end; flex:1 1 auto; min-height:.26in; max-height:.36in; }}
.dl .blank{{ border-bottom:1.2px solid var(--rule); }}
.triage{{ display:grid; grid-template-columns:repeat(5,1fr); gap:0 .18in; flex:0 0 auto; }}
.tcol{{ display:flex; flex-direction:column; }}
.tchead{{ border-top:2.5px solid var(--ink); padding-top:6px; margin-bottom:6px; }}
.tchead b{{ display:block; font-size:9.5pt; font-weight:700; }}
.tchead span{{ display:block; font-size:7.6pt; color:var(--faint); }}
.tchead.now{{ border-color:var(--now); }} .tchead.now b{{ color:var(--now); }}
.tchead.park{{ border-color:var(--park); }} .tchead.park b{{ color:var(--park); }}
.tr{{ display:flex; align-items:flex-end; gap:6px; height:.3in; }}
.tr .blank{{ border-bottom:1.2px solid var(--rule); }}

/* --- page 3 -------------------------------------------------------------- */
.step{{ display:grid; grid-template-columns:17px 16px 1fr .55in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.34in; max-height:.5in; }}
.step .snum{{ font-family:"Bricolage Grotesque",sans-serif; font-weight:600; font-size:10pt;
  color:var(--faint); padding-bottom:3px; }}
.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:6px; border-bottom:2px solid var(--ink); margin-bottom:6px;
  font-weight:700; text-transform:uppercase; letter-spacing:.07em; font-size:7.6pt;
  color:var(--soft); }}
.head span, .head .blank{{ border:0; }}

/* --- page 4 -------------------------------------------------------------- */
.tm{{ display:grid; grid-template-columns:1.5fr .55in .55in .55in 1.3fr; gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.42in; }}
.callout{{ border:1.6px solid var(--rule); border-left:4px solid var(--now); padding:12px 14px;
  border-radius:2px; }}
.callout b{{ font-size:9.5pt; }}
.callout p{{ margin:6px 0 0; font-size:9.5pt; line-height:1.5; color:var(--soft); }}
.callout.kind{{ border-left-color:var(--mood); margin-top:14px; }}

/* --- page 5 -------------------------------------------------------------- */
.week{{ display:grid; grid-template-columns:repeat(7,1fr); gap:0 .14in; flex:0 1 auto;
  min-height:0; }}
.day{{ display:flex; flex-direction:column; }}
.dayhead{{ display:flex; align-items:flex-end; gap:6px; border-bottom:2px solid var(--ink);
  padding-bottom:5px; margin-bottom:7px; }}
.dayhead b{{ font-size:10pt; }}
.dayhead .blank{{ border-bottom:1.2px solid var(--rule); height:.2in; }}
.onething{{ display:flex; align-items:flex-end; gap:6px; flex:1.4 1 auto; min-height:.42in;
  max-height:.6in; }}
.onething .blank{{ border-bottom:1.6px solid var(--now); }}
.small{{ display:flex; align-items:flex-end; gap:6px; flex:1 1 auto; min-height:.3in;
  max-height:.44in; }}
.notweek{{ display:grid; grid-template-columns:repeat(3,1fr); gap:0 .3in; flex:none; }}
.appt{{ display:flex; flex-direction:column; gap:2px; flex:1 1 auto; min-height:.34in;
  justify-content:flex-end; }}
.appt span{{ font-size:7.4pt; color:var(--faint); text-transform:uppercase; letter-spacing:.07em; }}
.appt .blank{{ height:.22in; }}

/* --- page 6 -------------------------------------------------------------- */
.rt{{ display:flex; align-items:flex-end; gap:10px; flex:1 1 auto; min-height:.34in;
  max-height:.48in; border-bottom:1.2px solid var(--rule); }}
.rtext{{ font-size:10.5pt; padding-bottom:4px; line-height:1.15; }}

/* --- page 7 -------------------------------------------------------------- */
.ch{{ display:grid; grid-template-columns:1.9fr repeat(7,.34in); gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.42in;
  border-bottom:1.2px solid var(--rule); }}
.ch .chname{{ font-size:10.5pt; padding-bottom:4px; }}
.ch.head{{ border-bottom:2px solid var(--ink); }}
.ch.head .c{{ font-size:7.6pt; }}
.ch .box{{ margin-bottom:4px; }}

/* --- page 8 -------------------------------------------------------------- */
.epgrid{{ display:flex; flex-direction:column; flex:0 0 auto; }}
.ep{{ display:flex; align-items:center; gap:12px; height:.3in; }}
.epd{{ width:.42in; font-size:9pt; color:var(--soft); font-weight:700; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:2.5px solid var(--ink); margin-top:12px; padding-top:8px; }}
.foot .mark{{ font-family:"Bricolage Grotesque",sans-serif; font-weight:500; font-size:9pt;
  color:var(--faint); }}
.dots{{ display:flex; gap:6px; }}
.dots i{{ width:8px; height:8px; border-radius:50%; }}
.dots i.n{{ background:var(--now); }} .dots i.p{{ background:var(--park); }}
.dots i.d{{ background:var(--done); }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-adhd.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>First Move ADHD Planning Set</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-adhd-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"adhd-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"adhd-{name}")
        fill_pdf = os.path.join(DIST, f"adhd-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["now"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="First Move &nbsp;&middot;&nbsp; ADHD-friendly planning set",
    title="Start<br><em>here.</em>",
    lede="Eight pages built around the parts that actually break: starting, capturing, guessing "
         "how long things take, and the maintenance nobody wants to think about.",
    s1="What is in your download",
    files=[("4 fillable sets", "Letter + A4 &middot; colour + ink-saving mono &middot; 8 pages each"),
           ("4 print sets", "the same pages without form fields"),
           ("Page 1 is the daily", "print that one often; the rest are weekly or as needed"),
           ("This guide", "how to use it, print it, and what it is not")],
    s2="How to actually use it",
    s2p="Start with page 1 and nothing else for a week. One task a day is the whole system; the "
        "two extra lines are a bonus, not a target. When your head is too full to pick, do the "
        "brain dump on page 2 first. When a task keeps sliding, give it page 3. Skip any page "
        "that does not help &mdash; <b>an unused page is not a failure, it is a page that is not for you.</b>",
    s3="Type on it or print it",
    s3p="Open a <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app and type; or "
        "print the <b>-print.pdf</b> and use a pen. Many people find paper easier to start on and "
        "harder to ignore &mdash; the daily page is designed to sit on the desk, not in a tab.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "Print ten copies of page 1 at a time, so the choice is never &ldquo;print or plan&rdquo;",
          "Saving ink? The <b>mono</b> set is the same layout in graphite only"],
    s5="What this is not",
    s5p="This is a planning tool, not medical advice, therapy or a substitute for either. It was "
        "designed with well-known ADHD-friendly principles &mdash; few choices, visible time, one "
        "job per page &mdash; but it does not diagnose or treat anything. If something here makes "
        "your week harder rather than easier, stop using that page.",
    license="Personal use only. Print as many copies as you like for yourself. Please do not resell, "
            "share or redistribute the files. Fonts: Bricolage Grotesque and Atkinson Hyperlegible "
            "(SIL Open Font License).",
    mark="Start small. Start now.")

PAGE_NAMES = ["Today", "Brain dump &amp; triage", "One task, in pieces", "How long it takes",
              "The week, lightly", "Anchors", "Boring, necessary", "What happened"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["signal"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Bricolage Grotesque",sans-serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Atkinson Hyperlegible",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Atkinson Hyperlegible"'),
                 ("--s1:#f2a65a", "--s1:" + C["now"]), ("--s2:#ee6c4d", "--s2:" + C["done"]),
                 ("--s3:#c43e7a", "--s3:" + C["mood"]), ("--s4:#4b2e83", "--s4:" + C["park"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-size:9.6pt", "font-size:10.2pt")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-adhd.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    path = os.path.join(work, "readme-adhd.html")
    open(path, "w", encoding="utf-8").write(tpl)
    B.to_pdf(path, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-adhd.css")
    doc = pymupdf.open(os.path.join(DIST, "adhd-planner-letter-signal-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"adhd-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["signal"]
    over = (
        "<style>"
        "h1{font-family:'Bricolage Grotesque',sans-serif;font-weight:600;letter-spacing:-.015em}"
        f"h1 em{{font-style:normal;color:{C['now']}}}"
        "body{font-family:'Atkinson Hyperlegible',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['now']};font-weight:700;letter-spacing:.16em}}"
        f".rule{{background:{C['now']};height:4px;width:220px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Atkinson Hyperlegible';"
        "font-weight:700;letter-spacing:.08em}"
        ".tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:18px 34px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(30,36,48,.15)}"
        ".tile img{height:470px;width:auto;display:block}"
        f".tilecap{{font-family:'Atkinson Hyperlegible',Arial,sans-serif;font-weight:700;"
        f"text-transform:uppercase;letter-spacing:.1em;font-size:19px;color:{C['soft']};"
        "padding:11px 2px 0}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">ADHD-friendly &middot; Fillable PDF</span>
          <h1>One thing.<br><em>Then start.</em></h1>
          <span class="rule"></span>
          <p class="sub">A planning set with fewer slots on purpose: one real task a day, a place
          to dump the noise, a first move you can do in two minutes, and an honest column for how
          long things actually take.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">8 pages</span>
          <span class="badge">Undated</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the set</span>
      <h1>Eight pages,<br><em>one job each.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The two that do the work</span>
      <h1>Get it out.<br><em>Then break it down.</em></h1>
      <p class="sub">Empty your head onto one page and sort it into five columns &mdash; including
      one for letting things go. Then give the task you keep avoiding a page of its own, and a
      first move small enough to actually do.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[1]}" style="height:1040px"><img src="{imgs[2]}" style="height:1040px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#eef2f4", "100px", "84px", hero),
                                       ("02-pages", "#ffffff", "76px", "58px", pages),
                                       ("03-detail", "#f1f4f7", "100px", "76px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-adhd-{name}.html")
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
        BD.package(DIST, "First-Move-ADHD-Planning-Set")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building ADHD-friendly set ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "adhd-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "signal", embed_fonts=False))
    print("Wrote adhd-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "First-Move-ADHD-Planning-Set")

if __name__ == "__main__":
    main()
