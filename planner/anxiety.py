#!/usr/bin/env python3
"""Build the Steady anxiety-friendly journal and planning set.

Nine pages using tools that are widely published as self-help: a worry window,
a thought record, a log of what was feared against what actually happened,
control sorting, grounding and body signals, small steps taken at your own
pace, nights, and a calm plan written while calm.

It is a journal and planner. It is not therapy, treatment or medical advice,
and the delivery sheet says so plainly.

    python3 anxiety.py                  # every size / colourway
    python3 anxiety.py --only letter-steady
    python3 anxiety.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-anxiety")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400"
          "&family=Karla:ital,wght@0,400;0,500;0,600;1,400&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".5in .55in .45in", display="31pt"),
    "a4":     dict(B.SIZES["a4"],     pad="13mm 14mm 12mm", display="30pt"),
}

COLORWAYS = {
    # sea = steady / now, sand = worry parked on purpose, moss = what actually
    # happened. no red anywhere, and nothing at full saturation.
    "steady": dict(ink="#23303a", soft="#5d6f7a", faint="#97a5ad", rule="#e2e9ec",
                   strong="#c2ced4", sea="#3f7f8c", sand="#d0a15c", moss="#6f9070"),
    "mono":   dict(ink="#282b2e", soft="#63686d", faint="#9aa0a5", rule="#e5e7e9",
                   strong="#c5c9cd", sea="#414549", sand="#8d9298", moss="#6b7075"),
}

PAGES = 9
MARK = "Steady, not fearless."

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
    return f'''
<div class="sheet">
  <header class="mast">
    <div><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright"><div class="mini">{field("Date", f"x{n}_date", "w2", "9")}</div>
      <span class="pageno">{n} of {PAGES}</span></div>
  </header>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="note-small">A journal, not medical advice</span></footer>
</div>'''

def scale10(prefix, label):
    return ('<div class="scale"><span class="sclbl">' + label + '</span>' +
            "".join(f'<span class="sc">{check(f"{prefix}_{i}", "sea")}<span>{i}</span></span>'
                    for i in range(0, 11)) + '</div>')

# --------------------------------------------------------------------------- pages

def page_1():
    plan = "".join(
        f'<div class="taskrow">{check(f"x1_p{i}_done", "moss")}'
        f'{blank(f"x1_p{i}", "grow", "11")}</div>' for i in (1, 2, 3))
    body_check = "".join(
        f'<span class="bc">{check(f"x1_body_{i}", "sea")}<span>{l}</span></span>'
        for i, l in enumerate(["Chest", "Stomach", "Jaw", "Shoulders", "Hands",
                               "Head", "Breath", "Restless"], start=1))
    return sheet(1, "Today", "Daily page &middot; print this one often",
        '<div class="two b46"><section>' +
        '<div class="capbox">' +
        sec("How much is in the tank today", "Plan for this number, not for a good day", "sea") +
        scale10("x1_cap", "0 = empty &nbsp; 10 = full") +
        '</div>' +
        sec("What I am doing today", "Three is a full day when the tank is low", "sea") +
        plan +
        sec("One kind thing for me", "Not a reward. Just a good part of the day.") +
        f'<div class="wl">{blank("x1_kind", "grow", "11")}</div>' +
        sec("Where I feel it", "Tick anything that is true right now") +
        f'<div class="bodycheck">{body_check}</div>' +
        sec("What helped, even a little", "", "moss") +
        "".join(f'<div class="wl">{blank(f"x1_helped_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4, 5)) +
        '</section><section>' +
        '<div class="parkbox">' +
        sec("Worries, parked", "Write them here. They keep. Worry time is on page 2.", "sand") +
        "".join(f'<div class="wl">{check(f"x1_w_{i}", "sand")}'
                f'{blank(f"x1_w_t_{i}", "grow", "10.5")}</div>' for i in range(1, 7)) +
        '</div>' +
        sec("This morning I was worried that&hellip;", "One sentence, before the day starts", "sand") +
        "".join(f'<div class="wl">{blank(f"x1_feared_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '<div class="evbox">' +
        sec("What actually happened", "Fill this in tonight, honestly", "moss") +
        "".join(f'<div class="wl">{blank(f"x1_actual_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</div>' +
        sec("Tomorrow needs one thing from me") +
        f'<div class="wl">{blank("x1_tomorrow", "grow", "10.5")}</div>' +
        '</section></div>')

def page_2():
    rows = "".join(
        f'<div class="wr">{blank(f"x2_worry_{i}", "", "10.5")}'
        f'<span class="c">{check(f"x2_solve_{i}", "sea")}</span>'
        f'<span class="c">{check(f"x2_park_{i}", "sand")}</span>'
        f'{blank(f"x2_step_{i}", "", "10.5")}{blank(f"x2_when_{i}", "w2", "10")}</div>'
        for i in range(1, 13))
    return sheet(2, "Worry time", "Worry window &middot; same time each day, then it is closed",
        '<div class="windowrow">' +
        '<div class="wbox">' + field("Worry time starts", "x2_start", "w2", "11") +
        field("and ends", "x2_end", "w2", "11") +
        '<span class="wnote">Twenty minutes is enough. When it ends, the page closes and the '
        'worries wait until tomorrow.</span></div>' +
        '</div>' +
        sec("The worries, and what kind they are", "A problem has a next step. A worry does not.", "sea") +
        '<div class="wr head"><span>The worry</span><span class="c">Solve</span>'
        '<span class="c">Park</span><span>If it can be solved, the next step is&hellip;</span>'
        '<span class="w2">When</span></div>' + rows +
        '<div class="gap"></div>'
        '<div class="two"><section>' +
        sec("Worries that keep coming back", "Write them once. They do not need answering again.", "sand") +
        "".join(f'<div class="wl">{blank(f"x2_repeat_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("What I will do when worry time is over", "Decide it now, so there is somewhere to go") +
        "".join(f'<div class="wl">{blank(f"x2_after_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_3():
    return sheet(3, "The thought, looked at slowly", "Thought record &middot; one situation per page",
        '<div class="two"><section>' +
        sec("What happened", "Facts only: where, who, what was said", "sea") +
        "".join(f'<div class="wl">{blank(f"x3_sit_{i}", "grow", "11")}</div>' for i in (1, 2, 3)) +
        sec("The thought that arrived", "In your own words, exactly as it came") +
        f'<div class="quote">{blank("x3_thought", "grow", "12")}</div>' +
        scale10("x3_before", "How strong it felt: 0 to 10") +
        '<div class="gap"></div>' +
        sec("What makes it feel true", "The evidence for it, taken seriously") +
        "".join(f'<div class="wl">{blank(f"x3_for_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4, 5, 6)) +
        '</section><section>' +
        sec("What does not fit it", "Facts that the thought is leaving out", "moss") +
        "".join(f'<div class="wl">{blank(f"x3_against_{i}", "grow", "10.5")}</div>'
                for i in (1, 2, 3, 4)) +
        '<div class="gap"></div>' +
        sec("What I would say to a friend", "The same situation, someone else in it") +
        "".join(f'<div class="wl">{blank(f"x3_friend_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '<div class="fairbox">' +
        sec("A fairer sentence", "Not a cheerful one. A true one.", "moss") +
        "".join(f'<div class="wl">{blank(f"x3_fair_{i}", "grow", "11")}</div>' for i in (1, 2)) +
        '</div>' +
        scale10("x3_after", "How strong it feels now: 0 to 10") +
        '</section></div>')

def page_4():
    rows = "".join(
        f'<div class="pv">{blank(f"x4_date_{i}", "w2", "10")}'
        f'{blank(f"x4_pred_{i}", "", "10.5")}{blank(f"x4_sure_{i}", "w3", "10")}'
        f'{blank(f"x4_real_{i}", "", "10.5")}{blank(f"x4_learn_{i}", "", "10")}</div>'
        for i in range(1, 13))
    return sheet(4, "What I feared,<br>what happened", "Evidence log &middot; fill it in over weeks, not days",
        sec("Before: what you expect. After: what happened.", "Do not soften either column", "sea") +
        '<div class="pv head"><span class="w2">Date</span><span>What I expected to happen</span>'
        '<span class="w3">Sure %</span><span>What actually happened</span>'
        '<span>What that tells me</span></div>' + rows +
        '<div class="gap"></div>'
        '<div class="two"><section>' +
        '<div class="callout">'
        '<b>Why this page is the important one</b>'
        '<p>Anxiety makes confident predictions. Written down and checked a few weeks later, most '
        'of them turn out to have been wrong, or much smaller than expected. One page of your own '
        'handwriting is worth more than anyone telling you it will be fine.</p>'
        '</div>'
        '</section><section>' +
        sec("Looking back over the page", "Read the middle column only", "moss") +
        "".join(f'<div class="wl">{blank(f"x4_back_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_5():
    mine = "".join(f'<div class="wl">{check(f"x5_mine_{i}", "sea")}'
                   f'{blank(f"x5_mine_t_{i}", "grow", "10.5")}</div>' for i in range(1, 8))
    theirs = "".join(f'<div class="wl">{blank(f"x5_not_{i}", "grow", "10.5")}</div>'
                     for i in range(1, 8))
    return sheet(5, "Mine, and not mine", "Control page &middot; when everything feels urgent",
        '<div class="two"><section>' +
        '<div class="minebox">' +
        sec("Things I can do something about", "Small counts. Sending one email counts.", "sea") +
        mine + '</div>' +
        '<div class="gap"></div>' +
        sec("The next step on one of them", "Choose one. Only one.", "sea") +
        f'<div class="wl">{blank("x5_step", "grow", "11")}</div>' +
        '<div class="split2">' + field("When", "x5_when", "w2", "10.5") +
        field("How long", "x5_long", "w3", "10.5") + '</div>' +
        '</section><section>' +
        '<div class="notminebox">' +
        sec("Things I cannot do anything about", "True, important, and still not yours", "sand") +
        theirs + '</div>' +
        '<div class="gap"></div>' +
        sec("What I do when one of those visits", "A plan, not a rule") +
        "".join(f'<div class="wl">{blank(f"x5_visit_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        '</section></div>')

BODY_SVG = '''
<svg class="bodymap" viewBox="0 0 120 250" aria-hidden="true">
  <g fill="none" stroke="var(--strong)" stroke-width="1.6" stroke-linejoin="round">
    <circle cx="60" cy="26" r="18"/>
    <path d="M52 44 h16 v8 c14 3 24 12 26 26 l4 44 h-12 l-3 -30 -2 62 h-9 l-5 -46 -5 46 h-9
             l-2 -62 -3 30 h-12 l4 -44 c2 -14 12 -23 26 -26 z"/>
    <path d="M44 160 l-3 76 h13 l6 -52 6 52 h13 l-3 -76"/>
  </g>
</svg>'''

GROUND = [("5 things I can see", "x6_see", 5), ("4 things I can touch", "x6_touch", 4),
          ("3 things I can hear", "x6_hear", 3), ("2 things I can smell", "x6_smell", 2),
          ("1 slow breath", "x6_breath", 1)]

def page_6():
    areas = "".join(
        f'<span class="bc">{check(f"x6_area_{i}", "sea")}<span>{l}</span></span>'
        for i, l in enumerate(["Head", "Jaw", "Throat", "Chest", "Stomach",
                               "Back", "Hands", "Legs"], start=1))
    ground = "".join(
        f'<div class="gr"><span class="grl">{title}</span>' +
        "".join(f'{blank(f"{key}_{j}", "", "10")}' for j in range(1, n + 1)) + '</div>'
        for title, key, n in GROUND)
    return sheet(6, "Where it sits,<br>what settles it", "Body page &middot; fill it in on a calm day",
        '<div class="two b46"><section>' +
        sec("Where I feel it", "Mark the drawing, or tick the words") +
        '<div class="bodyrow">' + BODY_SVG +
        f'<div class="areas">{areas}</div></div>' +
        sec("What it feels like", "Your words, not clinical ones") +
        "".join(f'<div class="wl">{blank(f"x6_feels_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        sec("What settles it, and how long it takes", "", "moss") +
        "".join(f'<div class="wl">{check(f"x6_settle_{i}", "moss")}'
                f'{blank(f"x6_settle_t_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4, 5)) +
        '</section><section>' +
        sec("Five, four, three, two, one", "Out loud if you can", "sea") +
        f'<div class="grounding">{ground}</div>' +
        '<div class="breathbox">'
        '<div class="bb"><span class="bbt">Breathe in</span><span class="bbn">4</span></div>'
        '<div class="bb"><span class="bbt">Hold</span><span class="bbn">4</span></div>'
        '<div class="bb"><span class="bbt">Breathe out</span><span class="bbn">6</span></div>'
        '<div class="bb"><span class="bbt">Hold</span><span class="bbn">2</span></div>'
        '<span class="bbnote">Longer out than in. Four rounds.</span>'
        '</div>' +
        sec("My calm kit", "The objects, the playlist, the place") +
        "".join(f'<div class="wl">{blank(f"x6_kit_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        '</section></div>')

def page_7():
    steps = "".join(
        f'<div class="st">{check(f"x7_s{i}_done", "moss")}<span class="stn">{i}</span>'
        f'{blank(f"x7_s{i}", "grow", "10.5")}{blank(f"x7_s{i}_before", "w3", "10")}'
        f'{blank(f"x7_s{i}_after", "w3", "10")}</div>' for i in range(1, 8))
    return sheet(7, "Small steps,<br>my own pace", "Steps page &middot; there is no schedule here",
        '<div class="two b46"><section>' +
        sec("Something I have been avoiding", "One thing, written plainly", "sand") +
        f'<div class="quote">{blank("x7_thing", "grow", "12")}</div>' +
        field("Why it matters to me", "x7_why", "grow", "10.5") +
        '<div class="gap"></div>' +
        sec("Broken into steps, smallest first", "Rate how it felt before and after, 0 to 10", "sea") +
        '<div class="st head"><span></span><span class="stn">#</span><span>The step</span>'
        '<span class="w3">Before</span><span class="w3">After</span></div>' + steps +
        '<span class="footnote">If a step feels too big, it is not the next step. Put a smaller '
        'one in front of it. Going back a step is not going backwards.</span>' +
        '</section><section>' +
        sec("Who knows I am doing this", "Doing it alone is harder than it needs to be") +
        "".join(f'<div class="wl">{blank(f"x7_who_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        sec("What helps me stay with it", "", "moss") +
        "".join(f'<div class="wl">{blank(f"x7_help_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("What I noticed afterwards", "Every time, even when it went badly", "moss") +
        "".join(f'<div class="wl">{blank(f"x7_noticed_{i}", "grow", "10.5")}</div>'
                for i in (1, 2, 3, 4)) +
        '<div class="callout soft">'
        '<b>Worth saying</b>'
        '<p>Steps like these are easier with someone alongside you &mdash; a friend, or a therapist '
        'if you have access to one. This page is a place to keep track, not a programme.</p>'
        '</div>' +
        '</section></div>')

WIND = ["Screens off, or at least face down", "Lights lower", "Something warm to drink",
        "Tomorrow's first thing written down", "Ten slow breaths"]

def page_8():
    wind = "".join(f'<div class="wl">{check(f"x8_w_{i}", "sea")}'
                   f'<span class="rtext">{t}</span></div>' for i, t in enumerate(WIND, start=1))
    wind += "".join(f'<div class="wl">{check(f"x8_wb_{i}", "sea")}'
                    f'{blank(f"x8_wl_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3))
    return sheet(8, "Nights", "Evening page &middot; the hours anxiety likes best",
        '<div class="two"><section>' +
        sec("Winding down", "The same order, so the body learns it", "sea") + wind +
        '<div class="gap"></div>' +
        '<div class="split2">' + field("Lights out", "x8_lights", "w2", "10.5") +
        field("Alarm", "x8_alarm", "w2", "10.5") + '</div>' +
        sec("Tomorrow, so I can put it down") +
        "".join(f'<div class="wl">{blank(f"x8_tom_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        '</section><section>' +
        '<div class="nightbox">' +
        sec("The three in the morning page", "Write it here. Decide nothing until daylight.", "sand") +
        "".join(f'<div class="wl">{blank(f"x8_night_{i}", "grow", "10.5")}</div>'
                for i in range(1, 8)) +
        '<span class="footnote">Nothing written between midnight and six needs an answer '
        'before breakfast.</span>' +
        '</div>' +
        sec("What helped last time I could not sleep", "", "moss") +
        "".join(f'<div class="wl">{blank(f"x8_helped_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_9():
    return sheet(9, "My plan,<br>written while calm", "Calm plan &middot; fill it in on a good day",
        '<div class="two"><section>' +
        sec("Early signs", "What happens first, before it gets big", "sand") +
        "".join(f'<div class="wl">{blank(f"x9_early_{i}", "grow", "10.5")}</div>'
                for i in range(1, 6)) +
        '<div class="gap"></div>' +
        sec("What helps", "Specific: which room, which person, which words", "moss") +
        "".join(f'<div class="wl">{check(f"x9_help_{i}", "moss")}'
                f'{blank(f"x9_help_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        '<div class="gap"></div>' +
        sec("What does not help", "So people know what to stop doing", "sand") +
        "".join(f'<div class="wl">{blank(f"x9_no_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("A sentence people can use", "Written by you, in advance") +
        f'<div class="quote">{blank("x9_sentence", "grow", "11")}</div>' +
        sec("People I can contact") +
        "".join('<div class="ct">' + blank(f"x9_name_{i}", "", "10.5") +
                blank(f"x9_num_{i}", "w2", "10.5") + '</div>' for i in (1, 2, 3)) +
        sec("Professional support", "If you have it, or when you get it") +
        field("Doctor", "x9_gp", "grow", "10.5") +
        field("Therapist", "x9_therapist", "grow", "10.5") +
        '<div class="crisisbox">' +
        sec("Crisis line where I live", "Look it up now, while you are calm", "sea") +
        '<div class="ct">' + blank("x9_crisis_name", "", "10.5") +
        blank("x9_crisis_num", "w2", "10.5") + '</div>' +
        '<span class="footnote">If you are in danger or thinking about harming yourself, '
        'contact your local emergency number or this line. That is what it is for.</span>' +
        '</div>' +
        sec("Afterwards", "What I need, and for how long", "moss") +
        "".join(f'<div class="wl">{blank(f"x9_after_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --sea:{C["sea"]}; --sand:{C["sand"]}; --moss:{C["moss"]};
  --backdrop:#eaeef0;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#151a1d; }} }}
:root[data-theme="dark"]{{ --backdrop:#151a1d; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Karla","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(35,48,58,.14);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-size:8.2pt; color:var(--soft); letter-spacing:.02em; }}
.hint{{ font-size:8.2pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in;
  border-bottom:1.5px solid var(--strong); padding-bottom:10px; }}
.mast h1{{ font-family:"Newsreader",Georgia,serif; font-weight:500; font-size:{S["display"]};
  line-height:1.04; margin:6px 0 0; letter-spacing:-.005em; }}
.mastright{{ display:flex; align-items:flex-end; gap:16px; }}
.pageno{{ font-family:"Newsreader",Georgia,serif; font-size:11pt; color:var(--soft); }}
.mini .fr{{ height:.24in; }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:14px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .34in; }}
.two.b46{{ grid-template-columns:1.06fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}
.gap{{ height:14px; flex:none; }}

.sec{{ display:flex; align-items:center; gap:9px; padding:2px 0 7px; overflow:hidden; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-weight:600; font-size:9.6pt; color:var(--ink); white-space:nowrap; }}
.lbl.sea{{ color:var(--sea); }} .lbl.sand{{ color:var(--sand); }} .lbl.moss{{ color:var(--moss); }}

.page .fr{{ display:flex; align-items:flex-end; gap:10px; flex:0 0 auto; height:.33in; }}
.flbl{{ font-size:9.4pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.3px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.95in; }} .blank.w3{{ flex:none; width:.5in; }}
.split2{{ display:flex; gap:16px; }} .split2 .fr{{ flex:1; }}

.box{{ width:12px; height:12px; border:1.4px solid var(--strong); border-radius:2px;
  flex:none; margin-bottom:3px; }}
.box.sea{{ border-color:var(--sea); }} .box.sand{{ border-color:var(--sand); }}
.box.moss{{ border-color:var(--moss); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:10px; flex:1 1 auto; min-height:.32in; max-height:.64in; }}
.rtext{{ font-size:10.2pt; padding-bottom:4px; }}
.footnote{{ font-size:8.4pt; color:var(--faint); line-height:1.4; padding-top:8px; display:block; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:6px; border-bottom:1.3px solid var(--strong); margin-bottom:6px;
  font-size:8pt; color:var(--soft); }}
.head span, .head .blank{{ border:0; }}

.quote{{ border-left:3px solid var(--sea); padding-left:12px; display:flex;
  align-items:flex-end; height:.44in; margin-bottom:8px; flex:none; }}
.callout{{ border:1.4px solid var(--rule); border-left:4px solid var(--sea); padding:12px 14px;
  border-radius:2px; }}
.callout.soft{{ border-left-color:var(--moss); margin-top:12px; }}
.callout b{{ font-size:9.6pt; }}
.callout p{{ margin:6px 0 0; font-size:9.6pt; line-height:1.5; color:var(--soft); }}

.scale{{ display:flex; align-items:center; flex-wrap:wrap; gap:6px 9px; padding:4px 0 8px; flex:none; }}
.sclbl{{ font-size:8.6pt; color:var(--faint); width:100%; }}
.sc{{ display:flex; align-items:center; gap:4px; }}
.sc .box{{ margin-bottom:0; border-radius:50%; width:13px; height:13px; }}
.sc span{{ font-size:8.4pt; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.capbox{{ border:1.5px solid var(--sea); border-radius:3px; padding:10px 13px 4px;
  margin-bottom:13px; flex:none; }}
.taskrow{{ display:flex; align-items:flex-end; gap:11px; flex:1 1 auto;
  min-height:.4in; max-height:.72in; }}
.bodycheck{{ display:flex; flex-wrap:wrap; gap:9px 15px; padding:2px 0 10px; flex:none; }}
.bc{{ display:flex; align-items:center; gap:7px; }}
.bc .box{{ margin-bottom:0; }}
.bc span{{ font-size:9.6pt; color:var(--soft); }}
.parkbox{{ border:1.5px solid var(--sand); border-radius:3px; padding:10px 13px 11px;
  display:flex; flex-direction:column; flex:1 1 auto; margin-bottom:13px; }}
.evbox{{ border:1.5px solid var(--moss); border-radius:3px; padding:10px 13px 11px;
  display:flex; flex-direction:column; flex:1 1 auto; margin:6px 0 10px; }}

/* page 2 ------------------------------------------------------------------ */
.windowrow{{ display:flex; flex:none; margin-bottom:14px; }}
.wbox{{ border:1.5px solid var(--sea); border-radius:3px; padding:11px 14px 12px; flex:1;
  display:flex; flex-wrap:wrap; gap:0 22px; align-items:flex-end; }}
.wbox .fr{{ flex:0 0 auto; width:2.4in; }}
.wnote{{ font-size:8.8pt; color:var(--soft); line-height:1.45; padding-top:8px; flex:1 0 100%; }}
.wr{{ display:grid; grid-template-columns:minmax(0,1.5fr) .3in .3in minmax(0,1.5fr) .95in;
  gap:0 11px; align-items:flex-end; flex:1 1 auto; min-height:.32in; max-height:.5in; }}

/* page 3 ------------------------------------------------------------------ */
.fairbox{{ border:1.5px solid var(--moss); border-radius:3px; padding:10px 13px 11px;
  display:flex; flex-direction:column; flex:1 1 auto; margin:8px 0; }}

/* page 4 ------------------------------------------------------------------ */
.pv{{ display:grid; grid-template-columns:.95in minmax(0,1.5fr) .5in minmax(0,1.5fr) minmax(0,1.1fr);
  gap:0 11px; align-items:flex-end; flex:1 1 auto; min-height:.32in; max-height:.5in; }}

/* page 5 ------------------------------------------------------------------ */
.minebox{{ border:1.5px solid var(--sea); border-radius:3px; padding:10px 13px 11px;
  display:flex; flex-direction:column; flex:1 1 auto; }}
.notminebox{{ border:1.5px solid var(--sand); border-radius:3px; padding:10px 13px 11px;
  display:flex; flex-direction:column; flex:1 1 auto; }}

/* page 6 ------------------------------------------------------------------ */
.bodyrow{{ display:flex; gap:16px; align-items:center; flex:0 1 auto; padding-bottom:10px; }}
.bodymap{{ width:1.05in; height:2.1in; flex:none; }}
.areas{{ display:flex; flex-wrap:wrap; gap:10px 14px; align-content:center; flex:1; }}
.grounding{{ display:flex; flex-direction:column; flex:0 1 auto; padding-bottom:8px; }}
.gr{{ display:flex; align-items:flex-end; gap:8px; flex:1 1 auto; min-height:.34in; max-height:.5in; }}
.grl{{ font-size:9.4pt; color:var(--soft); width:1.5in; flex:none; padding-bottom:4px; }}
.breathbox{{ border:1.5px solid var(--sea); border-radius:3px; padding:11px 13px 12px;
  display:grid; grid-template-columns:1fr 1fr; gap:8px 14px; flex:none; margin-bottom:12px; }}
.bb{{ display:flex; align-items:baseline; justify-content:space-between; gap:10px;
  border-bottom:1px dotted var(--strong); padding-bottom:4px; }}
.bbt{{ font-size:9.6pt; color:var(--ink); }}
.bbn{{ font-family:"Newsreader",Georgia,serif; font-size:15pt; color:var(--sea); }}
.bbnote{{ grid-column:1 / -1; font-size:8.6pt; color:var(--faint); }}

/* page 7 ------------------------------------------------------------------ */
.st{{ display:grid; grid-template-columns:16px 14px minmax(0,1fr) .5in .5in; gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.34in; max-height:.52in; }}
.stn{{ font-family:"Newsreader",Georgia,serif; font-size:10.5pt; color:var(--faint);
  padding-bottom:3px; }}

/* page 8 ------------------------------------------------------------------ */
.nightbox{{ border:1.5px solid var(--sand); border-radius:3px; padding:10px 13px 11px;
  display:flex; flex-direction:column; flex:1 1 auto; margin-bottom:12px; }}

/* page 9 ------------------------------------------------------------------ */
.ct{{ display:grid; grid-template-columns:minmax(0,1fr) .95in; gap:0 12px; align-items:flex-end;
  flex:1 1 auto; min-height:.32in; max-height:.46in; }}
.crisisbox{{ border:1.5px solid var(--sea); border-radius:3px; padding:10px 13px 11px;
  display:flex; flex-direction:column; flex:0 1 auto; margin:10px 0; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.5px solid var(--strong); margin-top:12px; padding-top:9px; }}
.foot .mark{{ font-family:"Newsreader",Georgia,serif; font-style:italic; font-size:9.4pt;
  color:var(--faint); }}
.note-small{{ font-size:8.2pt; color:var(--faint); }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-anxiety.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Steady Anxiety Journal</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-anxiety-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"anxiety-journal-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"anxiety-{name}")
        fill_pdf = os.path.join(DIST, f"anxiety-journal-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["sea"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Steady &nbsp;&middot;&nbsp; anxiety-friendly journal &amp; planner",
    title="Start<br><em>here.</em>",
    lede="Nine pages that use tools people have found helpful for years: a worry window, a thought "
         "record, a log of what you feared against what actually happened, and a plan written while "
         "you are calm.",
    s1="What is in your download",
    files=[("4 fillable sets", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print sets", "the same pages without form fields"),
           ("Page 1 is the daily", "pages 6 and 9 are filled in once, on a calm day"),
           ("This guide", "how to use it, print it, and what it is not")],
    s2="Where to start",
    s2p="Page 1 for a week, and nothing else. When worries take over the day, add page 2 and give "
        "them a set time. Page 4 is the one that pays off slowly &mdash; write what you expect to "
        "happen, then come back later and write what did. After a few weeks that page is evidence "
        "in your own handwriting.",
    s3="Type on it or print it",
    s3p="Open a <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app and type, or "
        "print the <b>-print.pdf</b> and use a pen. Writing by hand is slower, which on these pages "
        "is the point.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "Print several copies of pages 1, 3 and 4 at once",
          "Saving ink? The <b>mono</b> set is the same layout with no colour"],
    s5="What this is not",
    s5p="This is a journal and planner. It is not therapy, treatment, diagnosis or medical advice, "
        "and it is not a substitute for support from a doctor or therapist. If anxiety is making "
        "daily life hard, talking to a professional is worth it and this set works well alongside "
        "that. <b>Fill in the crisis line on page 9 today, while you are calm.</b> If you are in "
        "danger or thinking about harming yourself, contact your local emergency number or a "
        "crisis line now.",
    license="Personal use only. Print as many copies as you like for yourself. Please do not resell, "
            "share or redistribute the files. Fonts: Newsreader and Karla (SIL Open Font License).",
    mark="Steady, not fearless.")

PAGE_NAMES = ["Today", "Worry time", "Thought record", "Feared vs. happened",
              "Mine, and not mine", "Body &amp; grounding", "Small steps", "Nights",
              "My calm plan"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["steady"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Newsreader",Georgia,serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Karla",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Karla"'),
                 ("--s1:#f2a65a", "--s1:" + C["sea"]), ("--s2:#ee6c4d", "--s2:" + C["moss"]),
                 ("--s3:#c43e7a", "--s3:" + C["sand"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-size:9.6pt", "font-size:10.2pt")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-anxiety.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    path = os.path.join(work, "readme-anxiety.html")
    open(path, "w", encoding="utf-8").write(tpl)
    B.to_pdf(path, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-anxiety.css")
    doc = pymupdf.open(os.path.join(DIST, "anxiety-journal-letter-steady-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"anxiety-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["steady"]
    over = (
        "<style>"
        "h1{font-family:'Newsreader',Georgia,serif;font-weight:500;letter-spacing:-.005em}"
        f"h1 em{{font-style:italic;color:{C['sea']}}}"
        "body{font-family:'Karla',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['soft']};font-family:'Karla';font-weight:600;letter-spacing:.12em}}"
        f".rule{{background:{C['sea']};height:3px;width:210px}}"
        f".badge{{border-color:{C['strong']};color:{C['ink']};font-family:'Karla';font-weight:500;"
        "letter-spacing:.04em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 12px 30px rgba(35,48,58,.14)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Karla',Arial,sans-serif;font-weight:500;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>Steady,<br><em>not fearless.</em></h1>
          <span class="rule"></span>
          <p class="sub">An anxiety-friendly journal and planner: a worry window with a closing
          time, a thought record, a log of what you feared against what actually happened,
          grounding, and a plan written while you are calm.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the set</span>
      <h1>Nine pages,<br><em>one at a time.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The page that pays off slowly</span>
      <h1>What you feared.<br><em>What happened.</em></h1>
      <p class="sub">Write the prediction before, the outcome after, and read the middle column a
      month later. Evidence in your own handwriting is worth more than reassurance.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[3]}" style="height:1040px"><img src="{imgs[1]}" style="height:1040px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#eef2f3", "100px", "82px", hero),
                                       ("02-pages", "#ffffff", "76px", "56px", pages),
                                       ("03-detail", "#f0f3f4", "100px", "74px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-anxiety-{name}.html")
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
        BD.package(DIST, "Steady-Anxiety-Journal")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building anxiety journal ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "anxiety-journal.html"), "w", encoding="utf-8").write(
        render_html("letter", "steady", embed_fonts=False))
    print("Wrote anxiety-journal.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Steady-Anxiety-Journal")

if __name__ == "__main__":
    main()
