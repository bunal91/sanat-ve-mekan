#!/usr/bin/env python3
"""Build the Same Shape autism-friendly planning set.

Nine pages built on predictability rather than motivation: the day as a
sequence, a page for when the plan changes, sensory and body check-ins, a
written-when-calm plan for overwhelm, prepared scripts, appointment
preparation, decisions made once, and a weekly energy budget.

Design rules, applied to every page: the same layout rhythm, plain literal
language with no idioms, low-arousal colour, generous spacing, nothing that
blinks for attention.

    python3 autism.py                   # every size / colourway
    python3 autism.py --only letter-calm
    python3 autism.py --extras          # start-here sheet, listing images, zips
"""
import argparse, base64, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-autism")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Lexend:wght@300;400;500;600"
          "&family=IBM+Plex+Mono:wght@400;500&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".5in .55in .45in", display="30pt"),
    "a4":     dict(B.SIZES["a4"],     pad="13mm 14mm 12mm", display="29pt"),
}

COLORWAYS = {
    # muted on purpose. sage = as expected, clay = something changed,
    # lavender = how it felt. no red, no saturation spikes.
    "calm": dict(ink="#2e3a38", soft="#64726f", faint="#9aa6a3", rule="#e4e9e7",
                 strong="#c4cecb", same="#6e8f7d", change="#b5765c", feel="#8c87a8"),
    "mono": dict(ink="#2f3134", soft="#66696e", faint="#9b9ea3", rule="#e6e7e9",
                 strong="#c6c8cc", same="#5b6167", change="#7e848b", feel="#6e737a"),
}

PAGES = 9
MARK = "Same shape, every day."

# --------------------------------------------------------------------------- helpers

def check(f, tone=""):
    return f'<span class="box {tone}" data-field="{f}" data-ftype="check"></span>'

def blank(f, cls="", fs="11"):
    return f'<span class="blank {cls}" data-field="{f}" data-fsize="{fs}"></span>'

def sec(label, hint="", tone=""):
    hint = f'<span class="hint">{hint}</span>' if hint else ""
    return (f'<div class="sec"><span class="lbl {tone}">{label}</span>'
            f'<span class="line"></span>{hint}</div>')

def field(label, f, cls="", fs="11"):
    return f'<div class="fr"><span class="flbl">{label}</span>{blank(f, cls, fs)}</div>'

def sheet(n, title, kicker, body):
    """Every page has the same three parts, in the same places, every time."""
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright"><div class="mini">{field("Date", f"s{n}_date", "w2", "9")}</div>
      <span class="pageno">{n} / {PAGES}</span></div>
  </header>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="key"><i class="same"></i>same<i class="change"></i>changed<i class="feel"></i>how it felt</span>
  </footer>
</div>'''

def scale(prefix, labels, tone="feel"):
    return ('<div class="scale">' +
            "".join(f'<span class="sc">{check(f"{prefix}_{i}", tone)}<span>{l}</span></span>'
                    for i, l in enumerate(labels, start=1)) + '</div>')

# --------------------------------------------------------------------------- pages

STEP_TIMES = ["", "", "", "", "", "", "", "", ""]

def page_1():
    rows = "".join(
        f'<div class="stp">{blank(f"s1_time_{i}", "w3", "10")}'
        f'{blank(f"s1_what_{i}", "grow", "11")}{blank(f"s1_need_{i}", "w2", "9.5")}'
        f'<span class="c">{check(f"s1_done_{i}", "same")}</span></div>'
        for i in range(1, 13))
    body_check = "".join(
        f'<span class="bc">{check(f"s1_body_{i}", "feel")}<span>{l}</span></span>'
        for i, l in enumerate(["Hungry", "Thirsty", "Too hot", "Too cold", "Too loud",
                               "Too bright", "Need to move", "Need quiet", "Tired"], start=1))
    return sheet(1, "Today, in order", "Daily page &middot; print this one often",
        '<div class="two b46"><section>' +
        '<div class="firstthen">'
        '<div class="ft"><span class="ftl">First</span>' + blank("s1_first", "grow", "12") + '</div>'
        '<div class="ft"><span class="ftl">Then</span>' + blank("s1_then", "grow", "12") + '</div>'
        '</div>' +
        sec("The order of today", "Times are a guide, not a promise", "same") +
        '<div class="stp head"><span class="w3">Time</span><span>What happens</span>'
        '<span class="w2">What I need</span><span class="c">Done</span></div>' + rows +
        '</section><section>' +
        sec("Is anything different today?", "So it is not a surprise later", "change") +
        "".join(f'<div class="wl">{check(f"s1_diff_{i}", "change")}'
                f'{blank(f"s1_diff_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("What my body is telling me", "Tick any that are true right now", "feel") +
        f'<div class="bodycheck">{body_check}</div>' +
        sec("What would help right now") +
        "".join(f'<div class="wl">{blank(f"s1_help_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Quiet time today", "Put it in the plan, not at the end of it", "same") +
        '<div class="split2">' + field("From", "s1_quiet_from", "w3", "10") +
        field("Until", "s1_quiet_to", "w3", "10") + '</div>' +
        sec("How today was", "", "feel") +
        scale("s1_howwas", ["Hard", "", "Okay", "", "Good"]) +
        '</section></div>')

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def page_2():
    cols = "".join(
        f'<section class="day"><div class="dayhead"><b>{d}</b></div>'
        + "".join(f'<div class="slot"><span class="sl">{lab}</span>'
                  f'{blank(f"s2_d{i}_{key}", "grow", "9.5")}</div>'
                  for key, lab in [("m", "Morning"), ("a", "Afternoon"), ("e", "Evening")])
        + f'<div class="diff">{check(f"s2_d{i}_diff", "change")}'
          f'<span>Something is different</span></div>'
        + f'<div class="slot rest"><span class="sl">Quiet time</span>'
          f'{blank(f"s2_d{i}_rest", "grow", "9.5")}</div>'
        '</section>'
        for i, d in enumerate(DAYS, start=1))
    return sheet(2, "The week, the same shape", "Weekly page &middot; fill it in on the same day each week",
        sec("Every day has the same three parts", "If a part is empty, that is a rest, not a gap", "same") +
        f'<div class="week">{cols}</div>' +
        '<div class="gap"></div>'
        '<div class="two"><section>' +
        sec("Known changes this week", "Write them as soon as you hear about them", "change") +
        "".join(f'<div class="wl">{check(f"s2_ch_{i}", "change")}'
                f'{blank(f"s2_ch_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        '</section><section>' +
        sec("Things that stay the same", "Nothing is changing here", "same") +
        "".join(f'<div class="wl">{blank(f"s2_same_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        '</section></div>')

def page_3():
    return sheet(3, "When the plan changes", "Change page &middot; use it while the change is happening",
        '<div class="two b46"><section>' +
        sec("What changed", "Write the facts only", "change") +
        "".join(f'<div class="wl">{blank(f"s3_what_{i}", "grow", "11")}</div>' for i in (1, 2, 3)) +
        field("Who told me", "s3_who", "grow", "10.5") +
        field("When I found out", "s3_when", "w2", "10.5") +
        '<div class="gap"></div>' +
        sec("What this changes", "Only the parts that are actually affected", "change") +
        "".join(f'<div class="wl">{blank(f"s3_affects_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '<div class="gap"></div>' +
        '<div class="samebox">' +
        sec("What stays exactly the same", "This is usually most of the day", "same") +
        "".join(f'<div class="wl">{blank(f"s3_stays_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        '</div>' +
        '</section><section>' +
        sec("The new order", "Rewrite the rest of the day, in order", "same") +
        '<div class="stp head"><span class="w3">Time</span><span>What happens now</span>'
        '<span class="c">Done</span></div>' +
        "".join(f'<div class="stp two-col">{blank(f"s3_time_{i}", "w3", "10")}'
                f'{blank(f"s3_new_{i}", "grow", "10.5")}'
                f'<span class="c">{check(f"s3_done_{i}", "same")}</span></div>'
                for i in range(1, 9)) +
        '<div class="gap"></div>' +
        sec("What I need to manage this", "", "feel") +
        "".join(f'<div class="wl">{blank(f"s3_need_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Who I can ask if I do not understand") +
        f'<div class="wl">{blank("s3_ask", "grow", "10.5")}</div>' +
        '</section></div>')

SENSES = [("Sound", "s4_snd"), ("Light", "s4_lgt"), ("Touch &amp; clothes", "s4_tch"),
          ("Smell", "s4_sml"), ("Taste &amp; food", "s4_tst"), ("Movement", "s4_mvt"),
          ("People &amp; talking", "s4_ppl"), ("Screens", "s4_scr")]

def page_4():
    rows = "".join(
        f'<div class="sen"><span class="senname">{name}</span>'
        f'{blank(f"{key}_too_much", "", "10")}{blank(f"{key}_helps", "", "10")}'
        f'<span class="c">{check(f"{key}_today", "feel")}</span></div>'
        for name, key in SENSES)
    return sheet(4, "What helps, what is too much", "Sensory page &middot; fill in once, then update it slowly",
        sec("For each one, name the two ends", "Tick the last column if it was a problem today", "feel") +
        '<div class="sen head"><span class="senname">Sense</span><span>Too much is&hellip;</span>'
        '<span>What helps is&hellip;</span><span class="c">Today</span></div>' + rows +
        '<div class="gap"></div>'
        '<div class="two"><section>' +
        sec("Before something demanding", "What I do to get ready", "same") +
        "".join(f'<div class="wl">{check(f"s4_before_{i}", "same")}'
                f'{blank(f"s4_before_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("During", "What makes it possible to stay", "same") +
        "".join(f'<div class="wl">{check(f"s4_during_{i}", "same")}'
                f'{blank(f"s4_during_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("After", "What I need, and how long", "feel") +
        "".join(f'<div class="wl">{check(f"s4_after_{i}", "feel")}'
                f'{blank(f"s4_after_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Things that always help", "The short list, for a day with no thinking left") +
        "".join(f'<div class="wl">{blank(f"s4_always_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_5():
    return sheet(5, "My plan for a hard moment", "Written on a calm day &middot; used on a hard one",
        '<div class="two"><section>' +
        sec("Early signs", "What happens first, before it gets big", "change") +
        "".join(f'<div class="wl">{blank(f"s5_early_{i}", "grow", "10.5")}</div>'
                for i in range(1, 6)) +
        '<div class="gap"></div>' +
        sec("What was happening before it started", "This is how you find the pattern") +
        "".join(f'<div class="wl">{blank(f"s5_before_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '<div class="gap"></div>' +
        sec("What helps", "Which room, which object, which words", "same") +
        "".join(f'<div class="wl">{check(f"s5_help_{i}", "same")}'
                f'{blank(f"s5_help_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        '</section><section>' +
        '<div class="nobox">' +
        sec("What does not help", "So people know what to stop", "change") +
        "".join(f'<div class="wl">{blank(f"s5_no_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        '</div>' +
        '<div class="gap"></div>' +
        sec("What to tell people", "A sentence they can use", "same") +
        f'<div class="quote">{blank("s5_tell", "grow", "11")}</div>' +
        sec("Who to contact") +
        '<div class="split2">' + field("Name", "s5_contact", "grow", "10.5") +
        field("Number", "s5_number", "w2", "10.5") + '</div>' +
        sec("Where I can go") +
        f'<div class="wl">{blank("s5_place", "grow", "10.5")}</div>' +
        sec("Afterwards", "What I need, and how long it usually takes", "feel") +
        "".join(f'<div class="wl">{blank(f"s5_after_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

SCRIPTS = [("Starting a phone call", "s6_call",
            "Hello, my name is ____. I am calling about ____."),
           ("Asking for something to change", "s6_ask",
            "I find ____ difficult. Would it be possible to ____?"),
           ("Saying no", "s6_no", "Thank you for asking. I am not able to do that."),
           ("Asking someone to repeat", "s6_rep",
            "Sorry, could you say that again more slowly?"),
           ("Ending a conversation", "s6_end", "I need to go now. Thank you."),
           ("Telling someone I need a break", "s6_brk",
            "I need ten minutes on my own. I will come back.")]

def page_6():
    blocks = "".join(
        f'<section class="script"><div class="schead"><b>{title}</b></div>'
        f'<div class="seed">{seed}</div>'
        f'<div class="wl">{blank(f"{key}_1", "grow", "10.5")}</div>'
        f'<div class="wl">{blank(f"{key}_2", "grow", "10.5")}</div></section>'
        for title, key, seed in SCRIPTS)
    return sheet(6, "Sentences I can use", "Scripts page &middot; write them before you need them",
        sec("Each one has an example, then room for your own words", "Say them exactly as written if that is easier") +
        f'<div class="scripts">{blocks}</div>' +
        '<div class="gap"></div>'
        '<div class="two"><section>' +
        sec("Words other people use that I want defined", "Ask once, then keep it") +
        "".join(f'<div class="wl">{blank(f"s6_word_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("Sentences that have worked before", "", "same") +
        "".join(f'<div class="wl">{blank(f"s6_worked_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_7():
    return sheet(7, "Getting ready for an appointment", "Appointment page &middot; one page per appointment",
        '<div class="two b46"><section>' +
        sec("The facts", "", "same") +
        field("What it is", "s7_what", "grow", "11") +
        field("Who I am seeing", "s7_who", "grow", "10.5") +
        field("Where", "s7_where", "grow", "10.5") +
        '<div class="split2">' + field("Date", "s7_date", "w2", "10.5") +
        field("Time", "s7_time", "w3", "10.5") + '</div>' +
        '<div class="split2">' + field("Leave at", "s7_leave", "w3", "10.5") +
        field("How I get there", "s7_travel", "grow", "10.5") + '</div>' +
        field("How long it will take", "s7_long", "w2", "10.5") +
        '<div class="gap"></div>' +
        sec("What to take", "", "same") +
        "".join(f'<div class="wl">{check(f"s7_take_{i}", "same")}'
                f'{blank(f"s7_take_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        '<div class="gap"></div>' +
        sec("What happens, in order", "Ask them to tell you this if you do not know") +
        "".join(f'<div class="wl">{blank(f"s7_order_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4, 5)) +
        '</section><section>' +
        sec("What I want to say", "Write it now; it is hard to find words in the room", "same") +
        "".join(f'<div class="wl">{blank(f"s7_say_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        sec("Questions I want to ask") +
        "".join(f'<div class="wl">{blank(f"s7_q_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '<div class="samebox">' +
        sec("What they need to know about me", "How I communicate, what to avoid", "feel") +
        "".join(f'<div class="wl">{blank(f"s7_about_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</div>' +
        sec("Afterwards", "Plan the recovery before you go", "feel") +
        "".join(f'<div class="wl">{blank(f"s7_after_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

DEFAULTS = [("Breakfast", "s8_bf"), ("Lunch", "s8_ln"), ("Dinner", "s8_dn"),
            ("Snacks", "s8_sn"), ("Drinks", "s8_dr")]

def page_8():
    foods = "".join(
        f'<div class="def"><span class="defname">{name}</span>'
        f'{blank(f"{key}_1", "", "10.5")}{blank(f"{key}_2", "", "10.5")}</div>'
        for name, key in DEFAULTS)
    return sheet(8, "Decided once, so I do not decide again", "Defaults page &middot; update it a few times a year",
        '<div class="two"><section>' +
        sec("Food that always works", "Two options each is enough", "same") +
        '<div class="def head"><span class="defname">Meal</span><span>Option one</span>'
        '<span>Option two</span></div>' + foods +
        '<div class="gap"></div>' +
        sec("Clothes that work", "Fabric, fit, the exact ones", "same") +
        "".join(f'<div class="wl">{blank(f"s8_clothes_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4, 5)) +
        '</section><section>' +
        sec("Places that are okay", "And the quiet times to go", "same") +
        "".join(f'<div class="def2">{blank(f"s8_place_{i}", "", "10.5")}'
                f'{blank(f"s8_place_when_{i}", "w2", "10")}</div>' for i in range(1, 7)) +
        '<div class="gap"></div>' +
        sec("Getting up", "The same order, every morning") +
        "".join(f'<div class="wl">{check(f"s8_am_{i}", "same")}'
                f'{blank(f"s8_am_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        sec("Winding down", "The same order, every night") +
        "".join(f'<div class="wl">{check(f"s8_pm_{i}", "same")}'
                f'{blank(f"s8_pm_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        '</section></div>')

def page_9():
    rows = "".join(
        f'<div class="en">{blank(f"s9_event_{i}", "", "10.5")}{blank(f"s9_day_{i}", "w2", "10")}'
        + "".join(f'<span class="c">{check(f"s9_cost_{i}_{j}", "feel")}</span>' for j in range(1, 6))
        + f'{blank(f"s9_rec_{i}", "", "10")}</div>' for i in range(1, 11))
    return sheet(9, "How much the week asks of me", "Energy page &middot; fill it in before the week starts",
        sec("List what is coming, then mark how much it costs", "Five circles = the whole day", "feel") +
        '<div class="en head"><span>What is happening</span><span class="w2">Day</span>'
        '<span class="costhead">Cost: low to high</span><span>Recovery I need after</span></div>' +
        rows +
        '<div class="gap"></div>'
        '<div class="two"><section>' +
        sec("How many demanding things this week", "Count the fours and fives", "change") +
        '<div class="split2">' + field("Number", "s9_count", "w3", "12") +
        field("Is that too many?", "s9_toomany", "grow", "10.5") + '</div>' +
        sec("What I can move or cancel", "Moving something is allowed", "same") +
        "".join(f'<div class="wl">{blank(f"s9_move_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("Days with nothing in them", "Protect these first", "same") +
        "".join(f'<div class="wl">{check(f"s9_free_{i}", "same")}'
                f'{blank(f"s9_free_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Looking back", "Was the week heavier or lighter than expected?", "feel") +
        "".join(f'<div class="wl">{blank(f"s9_back_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --same:{C["same"]}; --change:{C["change"]}; --feel:{C["feel"]};
  --backdrop:#eaeeec;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#161a19; }} }}
:root[data-theme="dark"]{{ --backdrop:#161a19; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Lexend","Helvetica Neue",Arial,sans-serif; font-weight:300;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(46,58,56,.13);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-family:"IBM Plex Mono",monospace; font-size:8pt; color:var(--soft);
  letter-spacing:.02em; }}
.hint{{ font-size:8.4pt; font-weight:300; color:var(--faint); white-space:nowrap;
  min-width:0; overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in;
  border-bottom:1.6px solid var(--strong); padding-bottom:10px; }}
.mast h1{{ font-weight:500; font-size:{S["display"]}; line-height:1.06; margin:7px 0 0;
  letter-spacing:-.012em; }}
.mastright{{ display:flex; align-items:flex-end; gap:16px; }}
.pageno{{ font-family:"IBM Plex Mono",monospace; font-size:11pt; color:var(--soft); }}
.mini .fr{{ height:.24in; }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:15px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .36in; }}
.two.b46{{ grid-template-columns:1.08fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}
.gap{{ height:15px; flex:none; }}

.sec{{ display:flex; align-items:center; gap:10px; padding:2px 0 8px; overflow:hidden; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-weight:500; font-size:10pt; color:var(--ink); white-space:nowrap; }}
.lbl.same{{ color:var(--same); }} .lbl.change{{ color:var(--change); }}
.lbl.feel{{ color:var(--feel); }}

.page .fr{{ display:flex; align-items:flex-end; gap:10px; flex:0 0 auto; height:.34in; }}
.flbl{{ font-weight:400; font-size:9.5pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.3px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:1in; }} .blank.w3{{ flex:none; width:.6in; }}
.split2{{ display:flex; gap:16px; }} .split2 .fr{{ flex:1; }}

.box{{ width:13px; height:13px; border:1.4px solid var(--strong); border-radius:2px;
  flex:none; margin-bottom:3px; }}
.box.same{{ border-color:var(--same); }} .box.change{{ border-color:var(--change); }}
.box.feel{{ border-color:var(--feel); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:10px; flex:1 1 auto; min-height:.32in; max-height:.6in; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:6px; border-bottom:1.3px solid var(--strong); margin-bottom:6px;
  font-family:"IBM Plex Mono",monospace; font-size:7.6pt; color:var(--soft); }}
.head span, .head .blank{{ border:0; }}

/* page 1 ------------------------------------------------------------------ */
.firstthen{{ display:flex; flex-direction:column; gap:8px; border:1.4px solid var(--same);
  border-radius:3px; padding:11px 13px 12px; margin-bottom:14px; flex:none; }}
.ft{{ display:flex; align-items:flex-end; gap:12px; height:.36in; }}
.ftl{{ font-family:"IBM Plex Mono",monospace; font-size:9.5pt; color:var(--same);
  width:.5in; flex:none; padding-bottom:4px; }}
.stp{{ display:grid; grid-template-columns:.6in minmax(0,1fr) 1in .3in; gap:0 12px;
  align-items:flex-end; flex:1 1 auto; min-height:.32in; max-height:.56in; }}
.stp.two-col{{ grid-template-columns:.6in 1fr .3in; }}
.bodycheck{{ display:flex; flex-wrap:wrap; gap:9px 16px; padding:2px 0 10px; flex:none; }}
.bc{{ display:flex; align-items:center; gap:7px; }}
.bc .box{{ margin-bottom:0; }}
.bc span{{ font-size:9.5pt; color:var(--soft); }}
.scale{{ display:flex; gap:22px; padding:4px 0 6px; flex:none; }}
.sc{{ display:flex; align-items:center; gap:7px; }}
.sc .box{{ margin-bottom:0; border-radius:50%; }}
.sc span{{ font-size:9pt; color:var(--soft); }}

/* page 2 ------------------------------------------------------------------ */
.week{{ display:grid; grid-template-columns:repeat(7,1fr); gap:0 .16in; flex:1 1 auto; min-height:0; }}
.day{{ display:flex; flex-direction:column; min-width:0; }}
.dayhead{{ border-bottom:1.4px solid var(--strong); padding-bottom:6px; margin-bottom:8px; }}
.dayhead b{{ font-weight:500; font-size:9.5pt; }}
.slot{{ display:flex; flex-direction:column; gap:3px; flex:1 1 auto; min-height:.5in;
  max-height:.95in; justify-content:flex-end; }}
.sl{{ font-family:"IBM Plex Mono",monospace; font-size:7.2pt; color:var(--faint); }}
.slot .blank{{ height:.26in; }}
.slot.rest .blank{{ border-bottom-color:var(--same); }}
.diff{{ display:flex; align-items:center; gap:6px; padding:7px 0; flex:none; }}
.diff .box{{ margin-bottom:0; width:11px; height:11px; }}
.diff span{{ font-size:7.4pt; color:var(--change); line-height:1.1; }}

/* page 3, 5, 7 ------------------------------------------------------------ */
.samebox{{ border:1.4px solid var(--same); border-radius:3px; padding:10px 12px 11px;
  display:flex; flex-direction:column; flex:1 1 auto; }}
.nobox{{ border:1.4px solid var(--change); border-radius:3px; padding:10px 12px 11px;
  display:flex; flex-direction:column; flex:1 1 auto; }}
.quote{{ border-left:3px solid var(--same); padding-left:11px; display:flex;
  align-items:flex-end; height:.4in; margin-bottom:6px; }}

/* page 4 ------------------------------------------------------------------ */
.sen{{ display:grid; grid-template-columns:1.1fr minmax(0,1.4fr) minmax(0,1.4fr) .3in; gap:0 14px;
  align-items:flex-end; flex:1 1 auto; min-height:.32in; max-height:.56in; }}
.senname{{ font-size:10pt; padding-bottom:4px; }}

/* page 6 ------------------------------------------------------------------ */
.scripts{{ display:grid; grid-template-columns:1fr 1fr; gap:14px .36in; flex:0 1 auto; }}
.script{{ display:flex; flex-direction:column; min-width:0; }}
.schead{{ border-bottom:1.4px solid var(--strong); padding-bottom:5px; margin-bottom:5px; }}
.schead b{{ font-weight:500; font-size:10pt; }}
.seed{{ font-size:9.5pt; color:var(--same); font-style:italic; padding-bottom:5px; line-height:1.3; }}

/* page 8 ------------------------------------------------------------------ */
.def{{ display:grid; grid-template-columns:.9fr 1.2fr 1.2fr; gap:0 12px; align-items:flex-end;
  flex:1 1 auto; min-height:.32in; max-height:.56in; }}
.defname{{ font-size:10pt; padding-bottom:4px; }}
.def2{{ display:grid; grid-template-columns:1fr 1in; gap:0 12px; align-items:flex-end;
  flex:1 1 auto; min-height:.32in; max-height:.56in; }}

/* page 9 ------------------------------------------------------------------ */
.en{{ display:grid; grid-template-columns:minmax(0,1.5fr) 1in .3in .3in .3in .3in .3in minmax(0,1.2fr);
  gap:0 10px; align-items:flex-end; flex:1 1 auto; min-height:.32in; max-height:.54in; }}
.en.head .costhead{{ grid-column:span 5; text-align:center; }}
.en .box{{ border-radius:50%; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.6px solid var(--strong); margin-top:12px; padding-top:9px; }}
.foot .mark{{ font-family:"IBM Plex Mono",monospace; font-size:8.4pt; color:var(--faint); }}
.key{{ display:flex; align-items:center; gap:7px; font-size:8pt; color:var(--faint); }}
.key i{{ width:9px; height:9px; border-radius:2px; display:inline-block; margin-left:9px; }}
.key i.same{{ background:var(--same); margin-left:0; }}
.key i.change{{ background:var(--change); }}
.key i.feel{{ background:var(--feel); }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-autism.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Same Shape Planning Set</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-autism-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"autism-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"autism-{name}")
        fill_pdf = os.path.join(DIST, f"autism-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["same"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Same Shape &nbsp;&middot;&nbsp; autism-friendly planning set",
    title="Start<br><em>here.</em>",
    lede="Nine pages built on predictability instead of motivation. Every page has the same "
         "layout, the same three colours, and plain language with no idioms.",
    s1="What is in your download",
    files=[("4 fillable sets", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print sets", "the same pages without form fields"),
           ("Page 1 is the daily", "print that one often; page 3 is for the days a plan changes"),
           ("This guide", "how to use it, print it, and what it is not")],
    s2="How to use it",
    s2p="Start with page 1 only. Fill in the order of the day in the morning, or the night before "
        "if mornings are hard. Page 3 is the one to reach for when something changes &mdash; it "
        "writes down what changed and, more importantly, what stays the same. Pages 4, 5, 6 and 8 "
        "are filled in once on a calm day and used later; they are not daily work.",
    s3="Type on it or print it",
    s3p="Open a <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app and type; or "
        "print the <b>-print.pdf</b> and use a pen. Some people fill pages 4 to 8 on the computer "
        "once, print those, and keep only page 1 as a daily print.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "The <b>mono</b> set has no colour at all, if colour is distracting",
          "Print several copies of page 1 and page 3 at the same time"],
    s5="What this is not",
    s5p="This is a planning tool. It is not medical advice, therapy, an assessment, or a substitute "
        "for support from people who know you. It was made using ideas that autistic people widely "
        "describe as helpful &mdash; predictable structure, plain language, sensory planning, "
        "written scripts &mdash; but every autistic person is different. Use the pages that help. "
        "Ignore the pages that do not. Cross out any wording that is wrong for you and write your own.",
    license="Personal use only. Print as many copies as you like for yourself, or for one person you "
            "support. Please do not resell, share or redistribute the files. Fonts: Lexend and "
            "IBM Plex Mono (SIL Open Font License).",
    mark="Same shape, every day.")

PAGE_NAMES = ["Today, in order", "The week", "When the plan changes", "Sensory",
              "Plan for a hard moment", "Sentences I can use", "Appointment",
              "Decided once", "Energy for the week"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["calm"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Lexend",sans-serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Lexend",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Lexend"'),
                 ("--s1:#f2a65a", "--s1:" + C["same"]), ("--s2:#ee6c4d", "--s2:" + C["feel"]),
                 ("--s3:#c43e7a", "--s3:" + C["change"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-size:9.6pt", "font-size:10.2pt"), ("font-style:italic;", "font-style:normal;")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-autism.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    path = os.path.join(work, "readme-autism.html")
    open(path, "w", encoding="utf-8").write(tpl)
    B.to_pdf(path, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-autism.css")
    doc = pymupdf.open(os.path.join(DIST, "autism-planner-letter-calm-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"autism-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["calm"]
    over = (
        "<style>"
        "h1{font-family:'Lexend',sans-serif;font-weight:500;letter-spacing:-.012em}"
        f"h1 em{{font-style:normal;color:{C['same']}}}"
        "body{font-family:'Lexend',Arial,sans-serif;font-weight:300}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['soft']};font-family:'IBM Plex Mono',monospace;font-weight:400;"
        "letter-spacing:.06em;text-transform:none}"
        f".rule{{background:{C['same']};height:3px;width:200px}}"
        f".badge{{border-color:{C['strong']};color:{C['ink']};font-family:'Lexend';font-weight:400;"
        "letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 12px 30px rgba(46,58,56,.13)}"
        ".tile img{height:520px;width:auto;display:block}"
        f".tilecap{{font-family:'Lexend',Arial,sans-serif;font-weight:400;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>The day,<br><em>in order.</em></h1>
          <span class="rule"></span>
          <p class="sub">An autism-friendly planning set: the day as a sequence, a page for when
          the plan changes, sensory needs written down, sentences prepared before you need them,
          and decisions made once so they are not made again.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the set</span>
      <h1>Nine pages,<br><em>one shape.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The page most planners do not have</span>
      <h1>When the plan<br><em>changes.</em></h1>
      <p class="sub">It writes down what changed, what that actually affects, and &mdash; in its own
      box &mdash; everything that stays exactly the same. Then the rest of the day is rewritten in
      order, so it is a plan again.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[2]}" style="height:1040px"><img src="{imgs[4]}" style="height:1040px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#eef1ef", "100px", "80px", hero),
                                       ("02-pages", "#ffffff", "76px", "56px", pages),
                                       ("03-detail", "#f0f3f1", "100px", "74px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-autism-{name}.html")
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
        BD.package(DIST, "Same-Shape-Planning-Set")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building autism-friendly set ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "autism-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "calm", embed_fonts=False))
    print("Wrote autism-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Same-Shape-Planning-Set")

if __name__ == "__main__":
    main()
