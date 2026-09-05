#!/usr/bin/env python3
"""Build the Small Light journal for low days.

Nine pages designed for days when capacity is very low: a daily page that can
be completed in two minutes, a capacity ladder planned in advance, an activity
and mood log, a gentle page for the harshest thought, contact prompts, body
basics, a safety plan filled in on a steadier day, and a weekly look back.

It is a journal and planner. It is not therapy, treatment or medical care.
The delivery sheet and page eight say so plainly, and both point to real help.

    python3 depression.py                 # every size / colourway
    python3 depression.py --only letter-warm
    python3 depression.py --extras        # start-here sheet, listing images, zips
"""
import argparse, base64, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-depression")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,500;0,7..72,600;1,7..72,400"
          "&family=Figtree:wght@400;500;600&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".5in .55in .45in", display="30pt"),
    "a4":     dict(B.SIZES["a4"],     pad="13mm 14mm 12mm", display="29pt"),
}

COLORWAYS = {
    # amber = a small good thing, green = it counted, blue = people.
    # warm neutrals, nothing clinical, no red.
    "warm": dict(ink="#2b2724", soft="#6b625b", faint="#a39a92", rule="#e8e3dd",
                 strong="#cbc3ba", amber="#c98a3f", green="#4f8a7d", blue="#5b7391"),
    "mono": dict(ink="#2a2926", soft="#67635e", faint="#a09c96", rule="#e7e5e2",
                 strong="#c8c5c0", amber="#8a857e", green="#54514c", blue="#767169"),
}

PAGES = 9
MARK = "Some days, this page is enough."

# --------------------------------------------------------------------------- helpers

def check(f, tone="", big=False):
    return (f'<span class="box {tone}{" big" if big else ""}" '
            f'data-field="{f}" data-ftype="check"></span>')

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
    <div class="mastright"><div class="mini">{field("Date", f"d{n}_date", "w2", "9")}</div>
      <span class="pageno">{n} of {PAGES}</span></div>
  </header>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="note-small">A journal, not medical care &middot; page 8 has the numbers</span></footer>
</div>'''

def scale10(prefix, label, tone="blue"):
    return ('<div class="scale"><span class="sclbl">' + label + '</span>' +
            "".join(f'<span class="sc">{check(f"{prefix}_{i}", tone)}<span>{i}</span></span>'
                    for i in range(0, 11)) + '</div>')

# --------------------------------------------------------------------------- pages

BASICS = ["Got out of bed", "Had water", "Ate something", "Took my medication",
          "Washed, or changed clothes", "Opened a window or went outside",
          "Said something to another person", "Lay down and rested on purpose"]

def page_1():
    basics = "".join(
        f'<div class="basic">{check(f"d1_b_{i}", "green", True)}'
        f'<span class="btext">{t}</span></div>' for i, t in enumerate(BASICS, start=1))
    return sheet(1, "Today", "Daily page &middot; two minutes is a full entry",
        '<div class="two b46"><section>' +
        '<div class="basicsbox">' +
        sec("Things that count", "Tick what happened. Nothing here is small.", "green") +
        basics +
        f'<div class="basic">{check("d1_b_x", "green", True)}'
        f'{blank("d1_b_own", "grow", "10.5")}</div>' +
        '</div>' +
        sec("If there was more in the tank", "Only if. This line is allowed to stay empty.") +
        "".join(f'<div class="wl">{check(f"d1_more_{i}", "green")}'
                f'{blank(f"d1_more_t_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section><section>' +
        scale10("d1_mood", "How today felt: 0 to 10") +
        sec("One thing that was not terrible", "It does not have to be good", "amber") +
        "".join(f'<div class="wl">{blank(f"d1_ok_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Hardest part of today", "Naming it is not complaining") +
        "".join(f'<div class="wl">{blank(f"d1_hard_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Someone I had contact with", "A message counts. A shop assistant counts.", "blue") +
        f'<div class="wl">{blank("d1_contact", "grow", "10.5")}</div>' +
        '<div class="truebox">' +
        sec("One true sentence", "Not positive. True.") +
        f'<div class="wl">{blank("d1_true", "grow", "11")}</div>' +
        '</div>' +
        sec("Tomorrow, the smallest version") +
        f'<div class="wl">{blank("d1_tomorrow", "grow", "10.5")}</div>' +
        sec("Someone I could message tomorrow", "You do not have to say much", "blue") +
        f'<div class="wl">{blank("d1_msg", "grow", "10.5")}</div>' +
        '</section></div>')

LEVELS = [("If today is a 1 or 2", "The floor. Survival counts as a full day.", "one",
           ["Water and something to eat", "Medication", "One window open",
            "Rest without calling it lazy"]),
          ("If today is a 4 or 5", "One thing outside the basics.", "five",
           ["A shower, or a change of clothes", "One short errand or one message",
            "Ten minutes outside", "Something on in the background"]),
          ("If today is a 7 or 8", "Use it, but do not spend all of it.", "eight",
           ["The thing that has been waiting", "See someone, briefly",
            "Cook something proper", "Tidy one surface"])]

def page_2():
    cols = "".join(
        f'<section class="lvl {cls}"><div class="lvlhead"><b>{title}</b><span>{sub}</span></div>'
        + "".join(f'<div class="lrow">{check(f"d2_{cls}_s{j}", "green")}'
                  f'<span class="ltext">{t}</span></div>' for j, t in enumerate(seeded, start=1))
        + "".join(f'<div class="lrow">{check(f"d2_{cls}_b{j}", "green")}'
                  f'{blank(f"d2_{cls}_l{j}", "grow", "10")}</div>' for j in (1, 2, 3))
        + '</section>'
        for title, sub, cls, seeded in LEVELS)
    return sheet(2, "Three versions<br>of a day", "Capacity page &middot; write it on a steadier day",
        sec("Decide these now, so you do not have to decide later", "Then match the day to the number", "blue") +
        f'<div class="levels">{cols}</div>' +
        '<div class="gap"></div>'
        '<div class="two"><section>' +
        sec("What I always postpone when it is low", "It can wait. Write it here so it stops nagging.") +
        "".join(f'<div class="wl">{blank(f"d2_wait_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("What I will not judge myself for", "Write it in your own handwriting", "amber") +
        "".join(f'<div class="wl">{blank(f"d2_nojudge_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_3():
    rows = "".join(
        f'<div class="act">{blank(f"d3_date_{i}", "w2", "10")}'
        f'{blank(f"d3_what_{i}", "", "10.5")}{blank(f"d3_before_{i}", "w3", "10")}'
        f'{blank(f"d3_after_{i}", "w3", "10")}{blank(f"d3_note_{i}", "", "10")}</div>'
        for i in range(1, 13))
    return sheet(3, "Did it anyway", "Activity log &middot; mood before, mood after",
        sec("Doing something first, feeling like it second", "Rate 0 to 10 before and after, honestly", "green") +
        '<div class="act head"><span class="w2">Date</span><span>What I did</span>'
        '<span class="w3">Before</span><span class="w3">After</span>'
        '<span>Worth repeating?</span></div>' + rows +
        '<div class="gap"></div>'
        '<div class="two"><section>' +
        '<div class="callout">'
        '<b>What this page is for</b>'
        '<p>Depression says nothing will help, so there is no point starting. This page is where '
        'you check. Often the after number is a little higher than the before number &mdash; not '
        'fixed, just a little higher. A page of small differences is worth more than any promise.</p>'
        '</div>'
        '</section><section>' +
        sec("Things that moved the number, even by one", "", "green") +
        "".join(f'<div class="wl">{blank(f"d3_worked_{i}", "grow", "10.5")}</div>'
                for i in (1, 2, 3, 4)) +
        '</section></div>')

def page_4():
    return sheet(4, "What it says,<br>what is also true", "Thought page &middot; one at a time",
        '<div class="two"><section>' +
        '<div class="saysbox">' +
        sec("What it is saying today", "Write it exactly. It loses some weight on paper.") +
        "".join(f'<div class="wl">{blank(f"d4_says_{i}", "grow", "11")}</div>' for i in (1, 2, 3)) +
        '</div>' +
        scale10("d4_belief", "How true it feels right now: 0 to 10") +
        sec("When it started saying this", "A time, a place, or after what") +
        "".join(f'<div class="wl">{blank(f"d4_when_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Has it said this before?", "What happened after, last time") +
        "".join(f'<div class="wl">{blank(f"d4_before_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("What is also true", "Facts, not encouragement", "green") +
        "".join(f'<div class="wl">{blank(f"d4_true_{i}", "grow", "10.5")}</div>'
                for i in range(1, 6)) +
        sec("What I would say to someone I love", "Same situation, their face instead of yours") +
        "".join(f'<div class="wl">{blank(f"d4_friend_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '<div class="truebox">' +
        sec("A sentence I can keep", "Short enough to remember on a bad morning", "amber") +
        f'<div class="wl">{blank("d4_keep", "grow", "11")}</div>' +
        '</div>' +
        scale10("d4_after", "How true it feels now: 0 to 10") +
        '</section></div>')

def page_5():
    rows = "".join(
        f'<div class="sg">{blank(f"d5_thing_{i}", "", "10.5")}'
        f'<span class="c">{check(f"d5_tried_{i}", "amber")}</span>'
        f'{blank(f"d5_how_{i}", "", "10")}</div>' for i in range(1, 13))
    return sheet(5, "Small good things", "Not-fun page &middot; try it anyway, expect nothing",
        '<div class="two b46"><section>' +
        sec("Things that used to be good", "They may feel flat now. Write them down anyway.", "amber") +
        '<div class="sg head"><span>The thing</span><span class="c">Tried</span>'
        '<span>What it was actually like</span></div>' + rows +
        '</section><section>' +
        '<div class="callout soft">'
        '<b>If nothing feels good</b>'
        '<p>That is a symptom, not a verdict on your life. The point of this page is not to enjoy '
        'things on demand. It is to keep doing a few of them while the enjoyment is offline, '
        'because that is usually how it comes back &mdash; slowly, and after the doing, not before.</p>'
        '</div>' +
        sec("Free, five minutes, no leaving the house", "The list for the worst days", "green") +
        "".join(f'<div class="wl">{blank(f"d5_easy_{i}", "grow", "10.5")}</div>'
                for i in range(1, 6)) +
        sec("Worth trying again when things lift a little") +
        "".join(f'<div class="wl">{blank(f"d5_later_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

MESSAGES = ["I am having a rough week. No need to reply, I just did not want to disappear.",
            "Can I come and sit at yours for an hour? I do not need to talk.",
            "I am not great at the moment. Could you check in on me on Thursday?"]

def page_6():
    people = "".join(
        f'<div class="pr">{blank(f"d6_name_{i}", "", "10.5")}{blank(f"d6_how_{i}", "w2", "10")}'
        f'<span class="c">{check(f"d6_last_{i}", "blue")}</span>'
        f'{blank(f"d6_note_{i}", "", "10")}</div>' for i in range(1, 10))
    msgs = "".join(f'<div class="msg">&ldquo;{m}&rdquo;</div>' for m in MESSAGES)
    return sheet(6, "People", "Contact page &middot; low effort on purpose",
        '<div class="two b46"><section>' +
        sec("People I can reach", "Tick when you last had contact, without keeping score", "blue") +
        '<div class="pr head"><span>Who</span><span class="w2">Best way</span>'
        '<span class="c">Recent</span><span>What they are good for</span></div>' + people +
        '<div class="gap"></div>' +
        sec("Who I do not have to explain anything to", "", "blue") +
        "".join(f'<div class="wl">{blank(f"d6_easy_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section><section>' +
        sec("Messages you can send as they are", "Copy one. Sending something beats sending nothing.") +
        f'<div class="msgs">{msgs}</div>' +
        sec("My own version", "Write it now, while writing is possible") +
        "".join(f'<div class="wl">{blank(f"d6_mine_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("What I want people to do when I go quiet", "They usually want to help and do not know how") +
        "".join(f'<div class="wl">{blank(f"d6_want_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        '</section></div>')

TRACK = ["Slept", "Ate", "Water", "Medication", "Moved", "Outside", "Washed", "Saw someone"]
DAYS = ["M", "T", "W", "T", "F", "S", "S"]

def page_7():
    head = ('<div class="tr head"><span>This week</span>' +
            "".join(f'<span class="c">{d}</span>' for d in DAYS) + '<span>Notes</span></div>')
    rows = "".join(
        f'<div class="tr"><span class="trname">{t}</span>' +
        "".join(f'<span class="c">{check(f"d7_r{i}_d{j}", "green")}</span>' for j in range(1, 8)) +
        blank(f"d7_note_{i}", "", "10") + '</div>'
        for i, t in enumerate(TRACK, start=1))
    appts = "".join(
        f'<div class="ap">{blank(f"d7_ap_what_{i}", "", "10.5")}'
        f'{blank(f"d7_ap_when_{i}", "w2", "10")}'
        f'<span class="c">{check(f"d7_ap_done_{i}", "green")}</span></div>' for i in (1, 2, 3, 4))
    return sheet(7, "The basics,<br>across a week", "Body page &middot; information, not a scorecard",
        sec("Tick what happened", "Gaps are data, not failures", "green") + head + rows +
        '<div class="gap"></div>'
        '<div class="two"><section>' +
        sec("Appointments and repeat prescriptions", "The admin that gets hardest when it matters most", "blue") +
        '<div class="ap head"><span>What</span><span class="w2">When</span>'
        '<span class="c">Done</span></div>' + appts +
        '</section><section>' +
        sec("What I noticed this week", "Sleep, appetite, anything that changed") +
        "".join(f'<div class="wl">{blank(f"d7_noticed_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '<span class="footnote">If sleep, appetite or energy have changed a lot, that is worth '
        'telling a doctor. Bring this page with you &mdash; it is easier than remembering.</span>' +
        '</section></div>')

def page_8():
    return sheet(8, "If it gets<br>very dark", "Safety plan &middot; fill this in on a steadier day",
        '<div class="crisis">'
        '<b>If you are thinking about ending your life, or you are not safe right now, this page '
        'is not enough.</b> Call your local emergency number, or the crisis line you have written '
        'below, or go to your nearest emergency department. Tell someone. People are trained for '
        'exactly this and they are not shocked by it.'
        '</div>' +
        '<div class="two"><section>' +
        sec("Signs that things are getting worse", "For me, specifically") +
        "".join(f'<div class="wl">{blank(f"d8_sign_{i}", "grow", "10.5")}</div>'
                for i in range(1, 5)) +
        sec("Things that have helped me get through an hour", "Small, physical, close at hand", "green") +
        "".join(f'<div class="wl">{check(f"d8_help_{i}", "green")}'
                f'{blank(f"d8_help_t_{i}", "grow", "10.5")}</div>' for i in range(1, 5)) +
        sec("Places I can go, or people to be near", "Even without talking", "blue") +
        "".join(f'<div class="wl">{blank(f"d8_place_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        sec("Making the next hours safer", "What I will ask someone to look after for now") +
        "".join(f'<div class="wl">{blank(f"d8_safer_{i}", "grow", "10.5")}</div>' for i in (1, 2)) +
        '</section><section>' +
        sec("People I can call", "Write the numbers. Do not rely on your phone or your memory.", "blue") +
        "".join('<div class="ct">' + blank(f"d8_name_{i}", "", "10.5") +
                blank(f"d8_num_{i}", "w2", "10.5") + '</div>' for i in (1, 2, 3)) +
        sec("Professional support") +
        '<div class="ct">' + blank("d8_gp_name", "", "10.5") + blank("d8_gp_num", "w2", "10.5") + '</div>' +
        '<div class="ct">' + blank("d8_th_name", "", "10.5") + blank("d8_th_num", "w2", "10.5") + '</div>' +
        '<div class="crisisbox">' +
        sec("Crisis line where I live", "Look it up today, while you can", "blue") +
        '<div class="ct">' + blank("d8_crisis_name", "", "11") +
        blank("d8_crisis_num", "w2", "11") + '</div>' +
        '<div class="ct">' + blank("d8_emerg_name", "", "11") +
        blank("d8_emerg_num", "w2", "11") + '</div>' +
        '<span class="footnote">Write the emergency number for your country on the second line. '
        'Then photograph this page, so it is on your phone too.</span>' +
        '</div>' +
        sec("Reasons I have stayed before", "In your own words. Nobody else reads this.", "amber") +
        "".join(f'<div class="wl">{blank(f"d8_reason_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3)) +
        '</section></div>')

def page_9():
    return sheet(9, "The week,<br>looked back at", "Weekly page &middot; gently, and once",
        '<div class="two"><section>' +
        sec("What actually happened", "Facts, including the flat days") +
        "".join(f'<div class="wl">{blank(f"d9_happened_{i}", "grow", "10.5")}</div>'
                for i in range(1, 6)) +
        sec("Small things I did", "Getting up counts. Answering a message counts.", "green") +
        "".join(f'<div class="wl">{check(f"d9_win_{i}", "green")}'
                f'{blank(f"d9_win_t_{i}", "grow", "10.5")}</div>' for i in range(1, 6)) +
        '</section><section>' +
        sec("What made it heavier", "So it can be planned around, not blamed on you") +
        "".join(f'<div class="wl">{blank(f"d9_heavy_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        sec("What I would say to someone who had this week", "Then read it again, slowly", "amber") +
        "".join(f'<div class="wl">{blank(f"d9_say_{i}", "grow", "10.5")}</div>' for i in (1, 2, 3, 4)) +
        sec("One thing I need next week", "Ask someone for it if you can", "blue") +
        f'<div class="wl">{blank("d9_need", "grow", "11")}</div>' +
        '<div class="callout soft">'
        '<b>Worth checking</b>'
        '<p>If most weeks have looked like this for a while, that is worth telling a doctor. Take '
        'these pages with you. Describing it is hard; showing it is easier.</p>'
        '</div>' +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --amber:{C["amber"]}; --green:{C["green"]}; --blue:{C["blue"]};
  --backdrop:#eeeae5;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#191715; }} }}
:root[data-theme="dark"]{{ --backdrop:#191715; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Figtree","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(43,39,36,.14);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-size:8.4pt; color:var(--soft); }}
.hint{{ font-size:8.4pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in;
  border-bottom:1.5px solid var(--strong); padding-bottom:10px; }}
.mast h1{{ font-family:"Literata",Georgia,serif; font-weight:600; font-size:{S["display"]};
  line-height:1.06; margin:6px 0 0; letter-spacing:-.01em; }}
.mastright{{ display:flex; align-items:flex-end; gap:16px; }}
.pageno{{ font-family:"Literata",Georgia,serif; font-size:11pt; color:var(--soft); }}
.mini .fr{{ height:.24in; }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:14px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .34in; }}
.two.b46{{ grid-template-columns:1.06fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}
.gap{{ height:14px; flex:none; }}

.sec{{ display:flex; align-items:center; gap:9px; padding:2px 0 7px; overflow:hidden; }}
.sec .line{{ flex:1; height:1px; background:var(--rule); }}
.lbl{{ font-weight:600; font-size:9.8pt; color:var(--ink); white-space:nowrap; }}
.lbl.amber{{ color:var(--amber); }} .lbl.green{{ color:var(--green); }}
.lbl.blue{{ color:var(--blue); }}

.page .fr{{ display:flex; align-items:flex-end; gap:10px; flex:0 0 auto; height:.33in; }}
.flbl{{ font-size:9.4pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.3px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:1in; }} .blank.w3{{ flex:none; width:.55in; }}
.split2{{ display:flex; gap:16px; }} .split2 .fr{{ flex:1; }}

.box{{ width:12px; height:12px; border:1.4px solid var(--strong); border-radius:2px;
  flex:none; margin-bottom:3px; }}
.box.big{{ width:15px; height:15px; }}
.box.amber{{ border-color:var(--amber); }} .box.green{{ border-color:var(--green); }}
.box.blue{{ border-color:var(--blue); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:10px; flex:1 1 auto; min-height:.32in; max-height:.7in; }}
.footnote{{ font-size:8.6pt; color:var(--faint); line-height:1.45; padding-top:8px; display:block; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:6px; border-bottom:1.3px solid var(--strong); margin-bottom:6px;
  font-size:8pt; color:var(--soft); }}
.head span, .head .blank{{ border:0; }}

.scale{{ display:flex; align-items:center; flex-wrap:wrap; gap:6px 9px; padding:4px 0 10px; flex:none; }}
.sclbl{{ font-size:8.8pt; color:var(--faint); width:100%; }}
.sc{{ display:flex; align-items:center; gap:4px; }}
.sc .box{{ margin-bottom:0; border-radius:50%; width:13px; height:13px; }}
.sc span{{ font-size:8.6pt; color:var(--soft); }}

.callout{{ border:1.4px solid var(--rule); border-left:4px solid var(--green); padding:12px 14px;
  border-radius:2px; }}
.callout.soft{{ border-left-color:var(--amber); margin-bottom:12px; }}
.callout b{{ font-size:9.8pt; }}
.callout p{{ margin:6px 0 0; font-size:9.8pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.basicsbox{{ border:1.5px solid var(--green); border-radius:3px; padding:10px 13px 11px;
  display:flex; flex-direction:column; flex:1 1 auto; margin-bottom:12px; }}
.basic{{ display:flex; align-items:flex-end; gap:11px; flex:1 1 auto;
  min-height:.34in; max-height:.58in; }}
.btext{{ font-size:10.4pt; padding-bottom:3px; line-height:1.15; }}
.truebox{{ border:1.5px solid var(--amber); border-radius:3px; padding:9px 12px 10px;
  display:flex; flex-direction:column; flex:0 1 auto; margin:8px 0; }}

/* page 2 ------------------------------------------------------------------ */
.levels{{ display:grid; grid-template-columns:repeat(3,1fr); gap:0 .3in; flex:1 1 auto;
  min-height:0; }}
.lvl{{ display:flex; flex-direction:column; min-width:0; border-top:2.5px solid var(--strong);
  padding-top:9px; }}
.lvl.one{{ border-top-color:var(--blue); }}
.lvl.five{{ border-top-color:var(--green); }}
.lvl.eight{{ border-top-color:var(--amber); }}
.lvlhead{{ padding-bottom:8px; }}
.lvlhead b{{ font-family:"Literata",Georgia,serif; font-weight:600; font-size:11.5pt;
  display:block; }}
.lvlhead span{{ font-size:8.8pt; color:var(--faint); display:block; padding-top:3px;
  line-height:1.35; }}
.lrow{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.34in;
  max-height:.52in; border-bottom:1px solid var(--rule); }}
.ltext{{ font-size:9.8pt; padding-bottom:4px; line-height:1.2; }}

/* page 3 ------------------------------------------------------------------ */
.act{{ display:grid; grid-template-columns:1in minmax(0,1.6fr) .55in .55in minmax(0,1.2fr);
  gap:0 11px; align-items:flex-end; flex:1 1 auto; min-height:.32in; max-height:.5in; }}

/* page 4 ------------------------------------------------------------------ */
.saysbox{{ border:1.5px solid var(--strong); border-radius:3px; padding:10px 13px 11px;
  display:flex; flex-direction:column; flex:0 1 auto; margin-bottom:6px; }}

/* page 5 ------------------------------------------------------------------ */
.sg{{ display:grid; grid-template-columns:minmax(0,1.3fr) .3in minmax(0,1.5fr); gap:0 11px;
  align-items:flex-end; flex:1 1 auto; min-height:.32in; max-height:.5in; }}

/* page 6 ------------------------------------------------------------------ */
.pr{{ display:grid; grid-template-columns:minmax(0,1.2fr) 1in .3in minmax(0,1.3fr); gap:0 11px;
  align-items:flex-end; flex:1 1 auto; min-height:.32in; max-height:.5in; }}
.msgs{{ display:flex; flex-direction:column; gap:9px; padding-bottom:10px; flex:none; }}
.msg{{ font-family:"Literata",Georgia,serif; font-size:10pt; line-height:1.45; color:var(--soft);
  border-left:3px solid var(--blue); padding:2px 0 2px 11px; }}

/* page 7 ------------------------------------------------------------------ */
.tr{{ display:grid; grid-template-columns:1.3fr repeat(7,.3in) minmax(0,1.4fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.32in; max-height:.5in;
  border-bottom:1px solid var(--rule); }}
.trname{{ font-size:10.2pt; padding-bottom:4px; }}
.tr .box{{ margin-bottom:4px; }}
.ap{{ display:grid; grid-template-columns:minmax(0,1fr) 1in .3in; gap:0 11px;
  align-items:flex-end; flex:1 1 auto; min-height:.32in; max-height:.5in; }}

/* page 8 ------------------------------------------------------------------ */
.crisis{{ border:2px solid var(--blue); border-radius:3px; padding:12px 15px 13px;
  font-size:10pt; line-height:1.5; color:var(--ink); margin-bottom:14px; flex:none; }}
.crisis b{{ font-weight:600; }}
.crisisbox{{ border:1.5px solid var(--blue); border-radius:3px; padding:10px 13px 11px;
  display:flex; flex-direction:column; flex:0 1 auto; margin:10px 0; }}
.ct{{ display:grid; grid-template-columns:minmax(0,1fr) 1in; gap:0 12px; align-items:flex-end;
  flex:1 1 auto; min-height:.32in; max-height:.46in; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.5px solid var(--strong); margin-top:12px; padding-top:9px; }}
.foot .mark{{ font-family:"Literata",Georgia,serif; font-style:italic; font-size:9.4pt;
  color:var(--faint); }}
.note-small{{ font-size:8.4pt; color:var(--faint); }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-depression.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Small Light Journal</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-depression-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"low-days-journal-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"depression-{name}")
        fill_pdf = os.path.join(DIST, f"low-days-journal-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["green"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Small Light &nbsp;&middot;&nbsp; a journal for low days",
    title="Start<br><em>here.</em>",
    lede="Nine pages written for days when there is very little in the tank. Page one can be "
         "finished in two minutes, and finishing it counts.",
    s1="What is in your download",
    files=[("4 fillable sets", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print sets", "the same pages without form fields"),
           ("Page 1 is the daily", "page 8 is the safety plan &mdash; fill it in early"),
           ("This guide", "how to use it, and what it is not")],
    s2="Please read this part first",
    s2p="This is a journal. It is not therapy, treatment, diagnosis or medical care, and it cannot "
        "replace them. Depression is treatable and it is not a character flaw; if you have not "
        "spoken to a doctor about how you have been feeling, that is the single most useful thing "
        "on this list. <b>If you are thinking about ending your life, or you do not feel safe, "
        "contact your local emergency number or a crisis line now.</b> Page 8 is where you write "
        "those numbers down &mdash; do it today, while you can, not on the night you need them.",
    s3="How to use it on a bad day",
    s3p="Page 1, and nothing else. Tick what happened &mdash; got up, drank water, took your "
        "medication. Those are the entries. Page 2 is worth filling in on a steadier day, so that "
        "on a flat one you are reading a plan instead of making one. Page 3 is the slow one that "
        "pays off: do something, rate how you felt before and after, and let the page show you "
        "what actually helps.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "Print ten copies of page 1 at once, and page 8 twice &mdash; one for the wall",
          "Saving ink? The <b>mono</b> set is the same layout with no colour"],
    s5="If someone gave you this",
    s5p="If you are supporting someone, these pages are easier to fill in together than alone, and "
        "the ones that matter most are page 8 and page 6. Do not use them to check up on someone or "
        "to measure their progress. A journal that becomes homework stops being useful.",
    license="Personal use only. Print as many copies as you like for yourself, or for one person you "
            "support. Please do not resell, share or redistribute the files. Fonts: Literata and "
            "Figtree (SIL Open Font License).",
    mark="Some days, this page is enough.")

PAGE_NAMES = ["Today", "Three versions of a day", "Did it anyway", "What it says",
              "Small good things", "People", "The basics", "Safety plan", "The week"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["warm"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Literata",Georgia,serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Figtree",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Figtree"'),
                 ("--s1:#f2a65a", "--s1:" + C["amber"]), ("--s2:#ee6c4d", "--s2:" + C["green"]),
                 ("--s3:#c43e7a", "--s3:" + C["blue"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-size:9.6pt", "font-size:10.2pt")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-depression.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    path = os.path.join(work, "readme-depression.html")
    open(path, "w", encoding="utf-8").write(tpl)
    B.to_pdf(path, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-depression.css")
    doc = pymupdf.open(os.path.join(DIST, "low-days-journal-letter-warm-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"depression-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["warm"]
    over = (
        "<style>"
        "h1{font-family:'Literata',Georgia,serif;font-weight:600;letter-spacing:-.01em}"
        f"h1 em{{font-style:normal;color:{C['green']}}}"
        "body{font-family:'Figtree',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['soft']};font-family:'Figtree';font-weight:600;letter-spacing:.12em}}"
        f".rule{{background:{C['amber']};height:3px;width:200px}}"
        f".badge{{border-color:{C['strong']};color:{C['ink']};font-family:'Figtree';font-weight:500;"
        "letter-spacing:.03em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 12px 30px rgba(43,39,36,.14)}"
        ".tile img{height:520px;width:auto;display:block}"
        f".tilecap{{font-family:'Figtree',Arial,sans-serif;font-weight:500;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>Some days,<br><em>this is enough.</em></h1>
          <span class="rule"></span>
          <p class="sub">A journal for low days. The daily page takes two minutes and counts
          getting out of bed as an entry. There is a capacity ladder for 1, 5 and 8 days, an
          activity log that shows what actually shifts the mood, and a safety plan page.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[0]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the set</span>
      <h1>Nine pages,<br><em>low demand.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">Written for the days there is nothing left</span>
      <h1>Three versions<br><em>of a day.</em></h1>
      <p class="sub">Decide on a steadier day what a 1 looks like, what a 5 looks like and what an
      8 looks like. Then a flat morning means reading a plan instead of making one.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[1]}" style="height:1040px"><img src="{imgs[2]}" style="height:1040px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#f2efea", "100px", "80px", hero),
                                       ("02-pages", "#ffffff", "76px", "56px", pages),
                                       ("03-detail", "#f3f0ec", "100px", "74px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-depression-{name}.html")
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
        BD.package(DIST, "Small-Light-Low-Days-Journal")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building low-days journal ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "low-days-journal.html"), "w", encoding="utf-8").write(
        render_html("letter", "warm", embed_fonts=False))
    print("Wrote low-days-journal.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Small-Light-Low-Days-Journal")

if __name__ == "__main__":
    main()
