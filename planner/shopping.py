#!/usr/bin/env python3
"""Build the One Trip grocery kit.

Nine pages built on two things nobody prints. The first: a shopping list is
written in the kitchen, standing in front of the fridge, not in the shop with
a phone. The second: it should be laid out in the order of *your* shop, not in
somebody else's idea of categories -- so page 1 asks you to write your aisle
order once, and the list page follows it. Then the parts that actually move
money: what the shelf price hides, what goes in the bin, and the level below
which a cupboard staple gets re-ordered.

    python3 shopping.py                  # every size / colourway
    python3 shopping.py --only letter-market
    python3 shopping.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-shopping")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Darker+Grotesque:wght@500;600;700;800"
          "&family=Familjen+Grotesk:wght@400;500;600;700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="46pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="45pt"),
}

COLORWAYS = {
    # navy = the structure, green = money, rust = anything being wasted.
    "market": dict(ink="#17181c", soft="#52565f", faint="#8b8f98", rule="#e3e5e8",
                   strong="#c3c6cb", navy="#1f4e79", green="#2d7a52", rust="#bf4a2b"),
    "mono":   dict(ink="#1c1d1f", soft="#575a5e", faint="#909399", rule="#e6e7e9",
                   strong="#c5c7cb", navy="#3b3e42", green="#8a8d92", rust="#3b3e42"),
}

PAGES = 9
MARK = "Written in the kitchen, not in the shop."

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# --------------------------------------------------------------------------- helpers

def check(f, tone=""):
    return f'<span class="box {tone}" data-field="{f}" data-ftype="check"></span>'

def blank(f, cls="", fs="10.5"):
    return f'<span class="blank {cls}" data-field="{f}" data-fsize="{fs}"></span>'

def sec(label, hint="", tone=""):
    """Label, a dotted leader, and the hint at the far right -- a price list."""
    hint = f'<span class="hint">{hint}</span>' if hint else ""
    return (f'<div class="sec"><span class="lbl {tone}">{label}</span>'
            f'<span class="dots"></span>{hint}</div>')

def field(label, f, cls="", fs="10.5"):
    return f'<div class="fr"><span class="flbl">{label}</span>{blank(f, cls, fs)}</div>'

def lines(prefix, n, cls="grow", fs="10.5"):
    return "".join(f'<div class="wl">{blank(f"{prefix}_{i}", cls, fs)}</div>'
                   for i in range(1, n + 1))

def ticked(prefix, items, tone=""):
    return "".join(f'<div class="wl">{check(f"{prefix}_{i}", tone)}'
                   f'<span class="rtext">{t}</span></div>'
                   for i, t in enumerate(items, start=1))

def receipt(seed=1):
    """A till receipt, printing a line further on every page."""
    x0, x1, top = 10, 86, 6
    bot = 50 + seed * 6                      # the paper comes out as the kit goes on
    parts = [f'<path d="M{x0} {bot} L{x0} {top} L{x1} {top} L{x1} {bot}"/>']
    y = top + 13
    while y < bot - 9:                       # printed lines, the last one short
        end = x1 - 8 if y + 11 < bot - 9 else x0 + 30
        parts.append(f'<path d="M{x0 + 6} {y:.0f} L{end} {y:.0f}" stroke-dasharray="2 3"/>')
        y += 11
    teeth = []                               # and the torn bottom edge
    for i in range(9):
        x = x0 + i * (x1 - x0) / 8
        teeth.append(f'{"L" if i else "M"}{x:.1f} {bot - (5 if (i + seed) % 2 else 0)}')
    parts.append(f'<path d="{" ".join(teeth)}"/>')
    return (f'<svg class="till" viewBox="0 0 96 116" aria-hidden="true">'
            f'<g fill="none" stroke="currentColor" stroke-width="1.1" '
            f'stroke-linejoin="round">{"".join(parts)}</g></svg>')

def sheet(n, title, kicker, tag, body):
    """tag = what to do with this page, printed in the corner ticket."""
    meta = (f'<div class="mini">{field("Week of", f"q{n}_date", "w2", "9")}</div>' if n > 1 else '')
    return f'''
<div class="sheet">
  <header class="mast">
    <div class="masthead"><span class="kicker">{kicker}</span><h1>{title}</h1>{meta}</div>
    <div class="mastright">{receipt(n)}
      <span class="ticket"><b>{n}</b><i>{tag}</i></span></div>
  </header>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="pn">{n} / {PAGES}</span></footer>
  <div class="tear"></div>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    aisles = "".join(
        f'<div class="ao"><span class="aon">{i}</span>{blank(f"q1_ao_{i}", "grow", "10")}</div>'
        for i in range(1, 13))
    return sheet(1, "Your<br>shop.", "Grocery kit &middot; the page you fill in once", "Once",
        '<div class="two b46"><section>' +
        sec("Where we shop", "", "navy") +
        field("Main shop", "q1_main") +
        field("Branch, or delivery", "q1_branch") +
        '<div class="split2">' + field("Shopping day", "q1_day", "w2") +
        field("Slot or time", "q1_slot", "w2") + '</div>' +
        field("Loyalty card, and the account", "q1_card") +
        '<div class="split2">' + field("Budget a week", "q1_bw", "w2") +
        field("A month", "q1_bm", "w2") + '</div>' +
        '<div class="warn navy">'
        '<b>Write your aisle order once, and the rest of this kit follows it</b>'
        '<p>Walk your shop in your head from the door to the till and number what you pass. Every '
        'list in here is then written in <b>that</b> order rather than in categories invented by '
        'somebody who has never been to your shop &mdash; which is the whole reason for walking '
        'back across the place for the thing you forgot.</p>'
        '</div>' +
        sec("The aisle order, ours", "Door to till", "navy") +
        f'<div class="aos">{aisles}</div>' +
        '</section><section>' +
        sec("The other places", "", "green") +
        '<div class="op head"><span>Shop</span><span>What we get there</span>'
        '<span class="w3">Often</span></div>' +
        "".join(f'<div class="op">{blank(f"q1_op_{i}", "", "10")}'
                f'{blank(f"q1_opw_{i}", "", "10")}{blank(f"q1_oph_{i}", "w3", "10")}</div>'
                for i in range(1, 5)) +
        sec("Bought every single time", "The standing list", "green") +
        lines("q1_std", 6) +
        sec("What we always run out of", "", "rust") +
        lines("q1_out", 4) +
        sec("Who goes", "", "navy") +
        field("Usually", "q1_who") +
        field("If nobody can", "q1_who2") +
        sec("The three rules of this shop", "Ours", "navy") +
        lines("q1_rule", 3) +
        '</section></div>')

def page_2():
    use = "".join(
        f'<div class="uf">{blank(f"q2_uf_{i}", "", "10")}{blank(f"q2_ufb_{i}", "w2", "10")}'
        f'<span class="c">{check(f"q2_ufd_{i}", "green")}</span></div>'
        for i in range(1, 7))
    return sheet(2, "The kitchen<br>check.", "Grocery kit &middot; before the list", "Weekly",
        '<div class="two b46"><section>' +
        '<div class="warn">'
        '<b>Stand in front of the fridge with this page</b>'
        '<p>Almost everything bought twice is bought because nobody looked. Five minutes here, '
        'with the fridge open and the cupboard door open, is the difference between a list and a '
        'guess &mdash; and it is also where the week&#8217;s cooking decides itself, because what '
        'has to be used up comes first.</p>'
        '</div>' +
        sec("Use first", "Going over in the next three days", "green") +
        '<div class="uf head"><span>What</span><span class="w2">By when</span>'
        '<span class="c">Used</span></div>' + use +
        sec("Fridge &mdash; low or gone", "", "navy") + lines("q2_fr", 5) +
        sec("Freezer &mdash; what is actually in there", "", "navy") + lines("q2_fz", 5) +
        '</section><section>' +
        sec("Cupboard &mdash; low or gone", "Page 8 has the levels", "navy") + lines("q2_cb", 6) +
        sec("Household, cleaning, paper", "", "navy") + lines("q2_hh", 4) +
        sec("Toiletries, and the medicine cabinet", "", "navy") + lines("q2_to", 4) +
        sec("Pet, baby, anything else", "", "navy") + lines("q2_ot", 3) +
        sec("Already have too much of", "Do not buy these again this week", "rust") +
        lines("q2_too", 3) +
        '</section></div>')

def page_3():
    rows = "".join(
        f'<div class="dy"><span class="dyn">{d[:3]}</span>{blank(f"q3_m_{i}", "", "10")}'
        f'{blank(f"q3_n_{i}", "w3", "10")}'
        f'<span class="c">{check(f"q3_f_{i}", "green")}</span>'
        f'<span class="c">{check(f"q3_s_{i}", "rust")}</span></div>'
        for i, d in enumerate(DAYS, start=1))
    return sheet(3, "The week&#8217;s<br>food.", "Grocery kit &middot; five dinners, not seven", "Weekly",
        '<div class="two b46"><section>' +
        sec("Dinners", "F from the freezer &middot; S needs shopping", "navy") +
        '<div class="dy head"><span class="dyn">Day</span><span>What we are eating</span>'
        '<span class="w3">At table</span><span class="c">F</span>'
        '<span class="c">S</span></div>' + rows +
        sec("The two nights nobody cooks", "Name them now", "green") +
        '<div class="nc head"><span>Night</span><span>What happens instead</span></div>' +
        "".join(f'<div class="nc">{blank(f"q3_nc_{i}", "w2", "10")}'
                f'{blank(f"q3_ncw_{i}", "", "10")}</div>' for i in (1, 2)) +
        sec("Breakfasts and lunches to cover", "", "navy") + lines("q3_bl", 4) +
        '</section><section>' +
        '<div class="warn rust">'
        '<b>Plan two fewer meals than you think</b>'
        '<p>Seven dinners get planned, four get cooked, and the other three turn up on page 7 as '
        'a bag of salad and a packet of chicken thighs. Plan five, write the freezer night and the '
        'nobody-cooks night down as real plans rather than failures, and the waste log stops '
        'filling up.</p>'
        '</div>' +
        sec("Cooks from what is already here", "", "green") + lines("q3_have", 4) +
        sec("Needs buying", "These go onto page 4", "navy") + lines("q3_need", 5) +
        sec("Cooks twice", "Make the double batch on purpose", "green") + lines("q3_batch", 3) +
        sec("Who is out this week", "", "navy") + lines("q3_out", 3) +
        '</section></div>')

def aisle(n, rows=7):
    head = (f'<div class="ail"><span class="ain">{n}</span>'
            f'{blank(f"q4_a_{n}", "grow", "10")}</div>')
    body = "".join(
        f'<div class="it">{blank(f"q4_i{n}_{i}", "", "10")}{blank(f"q4_q{n}_{i}", "w3", "10")}'
        f'<span class="c">{check(f"q4_t{n}_{i}", "green")}</span></div>'
        for i in range(1, rows + 1))
    return f'<div class="blk">{head}{body}</div>'

def page_4():
    return sheet(4, "The list, in<br>aisle order.", "Grocery kit &middot; the page that goes with you",
        "Weekly",
        '<div class="two b2 tight"><section>' +
        '<div class="hdr"><span class="hl">Aisle, from page 1</span>'
        '<span class="hq">Qty</span><span class="ht">In</span></div>' +
        "".join(aisle(n) for n in (1, 2, 3)) +
        '</section><section>' +
        '<div class="hdr"><span class="hl">Aisle, from page 1</span>'
        '<span class="hq">Qty</span><span class="ht">In</span></div>' +
        "".join(aisle(n) for n in (4, 5, 6)) +
        '</section></div>')

def page_5():
    big = "".join(
        f'<div class="bg">{blank(f"q5_b_{i}", "", "10")}{blank(f"q5_bs_{i}", "w3", "10")}'
        f'{blank(f"q5_bq_{i}", "w3", "10")}'
        f'<span class="c">{check(f"q5_bt_{i}", "green")}</span></div>'
        for i in range(1, 11))
    top = "".join(
        f'<div class="tu">{blank(f"q5_t_{i}", "", "10")}'
        f'<span class="c">{check(f"q5_tt_{i}", "green")}</span></div>'
        for i in range(1, 8))
    return sheet(5, "The big shop,<br>and the top-up.", "Grocery kit &middot; two different lists",
        "Monthly",
        '<div class="two b46"><section>' +
        sec("The big shop", "Heavy, bulky, keeps &mdash; not fresh", "navy") +
        '<div class="bg head"><span>What</span><span class="w3">Size</span>'
        '<span class="w3">Qty</span><span class="c">In</span></div>' + big +
        '<span class="footnote">Cleaning, paper, tins, rice and pasta, drinks, pet food, washing '
        'powder. None of it needs to be bought fresh and all of it is heavy, so it belongs in one '
        'trip a month rather than in the weekly basket where it quietly doubles the bill.</span>' +
        sec("Where the big shop goes", "", "navy") +
        field("Shop, and when", "q5_where") +
        sec("Never worth buying big", "Goes off, or nobody likes it that much", "rust") +
        lines("q5_nobig", 3) +
        '</section><section>' +
        '<div class="warn rust">'
        '<b>The top-up is where the money actually goes</b>'
        '<p>Three quick trips a week for bread and milk cost more than most households&#8217; meat '
        'budget, because nobody walks out of a shop with only bread and milk. If there is going to '
        'be a top-up, write it here first &mdash; and if the list is two items long, send whoever '
        'can go in and out without a basket.</p>'
        '</div>' +
        sec("The top-up", "Bread, milk, fruit, salad", "green") +
        '<div class="tu head"><span>What</span><span class="c">In</span></div>' + top +
        sec("Never ordered online", "The things we want to choose ourselves", "rust") +
        lines("q5_no", 3) +
        sec("Substitutions we will accept", "And the ones we will not", "navy") +
        lines("q5_sub", 3) +
        '</section></div>')

def page_6():
    shops = "".join(
        f'<div class="sp">{blank(f"q6_d_{i}", "w2", "10")}{blank(f"q6_w_{i}", "", "10")}'
        f'{blank(f"q6_s_{i}", "w3", "10")}'
        f'<span class="c">{check(f"q6_p_{i}", "green")}</span></div>'
        for i in range(1, 11))
    unit = "".join(
        f'<div class="un">{blank(f"q6_ui_{i}", "", "10")}{blank(f"q6_us_{i}", "w3", "10")}'
        f'{blank(f"q6_up_{i}", "w3", "10")}{blank(f"q6_uu_{i}", "w3", "10")}</div>'
        for i in range(1, 6))
    return sheet(6, "What it<br>costs.", "Grocery kit &middot; the shelf price is not the price",
        "Monthly",
        '<div class="two b46"><section>' +
        sec("This month&#8217;s shops", "Every one of them, including the top-ups", "green") +
        '<div class="sp head"><span class="w2">Date</span><span>Where</span>'
        '<span class="w3">Spent</span><span class="c">Plan</span></div>' + shops +
        '<div class="tot"><span>Budget</span>' + blank("q6_bud", "w2", "10.5") +
        '<span>Spent</span>' + blank("q6_spent", "w2", "10.5") +
        '<span>Left</span>' + blank("q6_left", "w2", "10.5") + '</div>' +
        '<span class="footnote">The line that matters is not the big shop, it is the number of '
        'rows. Four shops a month and a full trolley beats eleven shops and a basket, every '
        'time.</span>' +
        '</section><section>' +
        '<div class="warn green">'
        '<b>Compare per 100 g, not per packet</b>'
        '<p>The shelf label carries a unit price in small print, and it is the only number on the '
        'shelf that tells the truth. The big box is often dearer per gram than the middle one, the '
        'offer is sometimes dearer than the plain shelf price, and the loose vegetables are almost '
        'always cheaper than the same vegetables in a bag.</p>'
        '</div>' +
        sec("Worked out once", "Per 100 g, per litre, per wash", "green") +
        '<div class="un head"><span>What</span><span class="w3">Size</span>'
        '<span class="w3">Price</span><span class="w3">Per unit</span></div>' + unit +
        sec("Always own-brand", "Tested, no difference", "green") + lines("q6_own", 4) +
        sec("Never own-brand", "For us, worth the money", "navy") + lines("q6_brand", 3) +
        sec("Only when it is on offer", "", "rust") + lines("q6_offer", 3) +
        '</section></div>')

def page_7():
    log = "".join(
        f'<div class="wa">{blank(f"q7_d_{i}", "w2", "10")}{blank(f"q7_w_{i}", "", "10")}'
        f'{blank(f"q7_y_{i}", "", "10")}</div>'
        for i in range(1, 13))
    return sheet(7, "What went<br>in the bin.", "Grocery kit &middot; one month, honestly", "Monthly",
        '<div class="two b2"><section>' +
        sec("The log", "Date, what, and why &mdash; one line", "rust") +
        '<div class="wa head"><span class="w2">Date</span><span>What</span>'
        '<span>Why it was not eaten</span></div>' + log +
        '<span class="footnote">The four honest reasons: bought too much, never got round to it, '
        'went off sooner than expected, nobody actually likes it. Write the real one.</span>' +
        '</section><section>' +
        '<div class="warn rust">'
        '<b>The bin is the cheapest place to look for money</b>'
        '<p>Nothing on this page was bought carelessly. It was bought by somebody planning to eat '
        'well: the salad, the herbs, the yoghurts, the second bag of spinach. Keeping this page '
        'for one month changes what goes in the trolley more than any budget does, because you '
        'stop arguing with yourself about what you <i>should</i> eat and start buying what you '
        'actually ate.</p>'
        '</div>' +
        sec("Shows up more than twice", "", "rust") + lines("q7_pat", 4) +
        sec("Buy less of", "", "navy") + lines("q7_less", 3) +
        sec("Buy smaller, or loose", "", "navy") + lines("q7_small", 3) +
        sec("Freeze it instead", "On the day it comes in", "green") + lines("q7_freeze", 3) +
        sec("What we are doing differently", "", "green") + lines("q7_diff", 3) +
        '</section></div>')

def page_8():
    lv = "".join(
        f'<div class="lv">{blank(f"q8_i_{i}", "", "10")}{blank(f"q8_f_{i}", "w3", "10")}'
        f'{blank(f"q8_r_{i}", "w3", "10")}{blank(f"q8_h_{i}", "w3", "10")}</div>'
        for i in range(1, 13))
    fz = "".join(
        f'<div class="fz">{blank(f"q8_fw_{i}", "", "10")}{blank(f"q8_fd_{i}", "w3", "10")}'
        f'{blank(f"q8_fb_{i}", "w3", "10")}</div>'
        for i in range(1, 9))
    return sheet(8, "The cupboard,<br>and the level.", "Grocery kit &middot; so the list writes itself",
        "Once",
        '<div class="two b46"><section>' +
        '<div class="warn navy">'
        '<b>A shopping list is an inventory problem</b>'
        '<p>You do not need to remember to buy rice. You need to know the number below which rice '
        'goes on the list &mdash; and then anybody in the house can write the list, not just the '
        'person who holds it all in their head. Fill this in once, in front of the open cupboard, '
        'and page 2 becomes a two-minute job.</p>'
        '</div>' +
        sec("Staples", "Full &middot; re-order at &middot; have now", "navy") +
        '<div class="lv head"><span>What</span><span class="w3">Full</span>'
        '<span class="w3">Order at</span><span class="w3">Have</span></div>' + lv +
        '</section><section>' +
        sec("The freezer", "Dated going in, or it is an archaeology dig", "green") +
        '<div class="fz head"><span>What</span><span class="w3">In</span>'
        '<span class="w3">By</span></div>' + fz +
        sec("Freezer rules we keep", "", "green") +
        ticked("q8_fr", ["Everything is dated and named on the day it goes in",
                         "Flat bags, standing up, not a pile",
                         "One shelf or drawer is the eat-me-next shelf",
                         "Leftovers get frozen the same evening, not on day three"], "green") +
        sec("Where things live", "No fourth jar", "navy") +
        '<div class="op head"><span>What</span><span>Where it is kept</span>'
        '<span class="w3">Seen</span></div>' +
        "".join(f'<div class="op">{blank(f"q8_wl_{i}", "", "10")}'
                f'{blank(f"q8_ww_{i}", "", "10")}{blank(f"q8_wc_{i}", "w3", "10")}</div>'
                for i in range(1, 5)) +
        '</section></div>')

def page_9():
    forg = "".join(
        f'<div class="fg">{blank(f"q9_d_{i}", "w2", "10")}{blank(f"q9_w_{i}", "", "10")}'
        f'<span class="c">{check(f"q9_s_{i}", "green")}</span></div>'
        for i in range(1, 13))
    return sheet(9, "What we<br>forgot.", "Grocery kit &middot; and what is good where", "Running",
        '<div class="two b2"><section>' +
        sec("The forgot list", "Tick it when it reaches page 1", "rust") +
        '<div class="fg head"><span class="w2">Date</span><span>What we forgot</span>'
        '<span class="c">On p1</span></div>' + forg +
        '<span class="footnote">It is the same three or four things forever. Once a thing has been '
        'written here twice it belongs on the standing list on page 1, and then it stops being '
        'something anybody has to remember.</span>' +
        '</section><section>' +
        sec("What is good where", "Worth the separate trip", "green") +
        '<div class="gw head"><span>Shop</span><span>What</span>'
        '<span class="w3">Price</span></div>' +
        "".join(f'<div class="gw">{blank(f"q9_gs_{i}", "", "10")}'
                f'{blank(f"q9_gw_{i}", "", "10")}{blank(f"q9_gp_{i}", "w3", "10")}</div>'
                for i in range(1, 6)) +
        sec("Not worth it here", "", "rust") + lines("q9_not", 3) +
        sec("Try next time", "", "navy") + lines("q9_try", 3) +
        sec("Prices worth remembering", "Know a real offer", "green") +
        lines("q9_price", 3) +
        sec("Notes", "", "navy") + lines("q9_note", 3) +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --navy:{C["navy"]}; --green:{C["green"]}; --rust:{C["rust"]};
  --backdrop:#eaebed;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#141518; }} }}
:root[data-theme="dark"]{{ --backdrop:#141518; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Familjen Grotesk","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden; position:relative;
  box-shadow:0 16px 40px rgba(23,24,28,.15);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:600; text-transform:uppercase; letter-spacing:.15em; font-size:7.4pt;
  color:var(--navy); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-start; gap:.3in;
  flex:none; border-bottom:2.5px solid var(--ink); padding-bottom:9px; }}
.masthead{{ min-width:0; }}
.mast h1{{ font-family:"Darker Grotesque",Arial,sans-serif; font-weight:800;
  font-size:{S["display"]}; line-height:.8; margin:4px 0 0; letter-spacing:-.018em;
  text-transform:uppercase; }}
.mastright{{ display:flex; align-items:flex-start; gap:12px; }}
.till{{ width:.82in; height:1in; color:var(--strong); }}
.ticket{{ border:1.6px solid var(--ink); padding:4px 8px 5px; text-align:center; flex:none;
  min-width:.52in; }}
.ticket b{{ font-family:"Darker Grotesque",Arial,sans-serif; font-size:19pt; font-weight:800;
  line-height:.85; display:block; }}
.ticket i{{ font-style:normal; display:block; font-size:6.4pt; font-weight:600;
  text-transform:uppercase; letter-spacing:.09em; color:var(--soft); padding-top:2px; }}
.mini{{ display:flex; gap:10px; padding-top:7px; }}
.mini .fr{{ display:flex; align-items:flex-end; gap:8px; flex:none; height:.22in; }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:10px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.02fr 1fr; }}
.two.b2{{ grid-template-columns:1.12fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}

.sec{{ display:flex; align-items:baseline; gap:8px; padding:9px 0 5px; overflow:hidden;
  flex:none; }}
.sec .dots{{ flex:1; height:0; border-bottom:1.6px dotted var(--strong); }}
.lbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.075em; font-size:8.2pt;
  color:var(--ink); white-space:nowrap; }}
.lbl.navy{{ color:var(--navy); }} .lbl.green{{ color:var(--green); }}
.lbl.rust{{ color:var(--rust); }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.5in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.2px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.78in; }} .blank.w3{{ flex:none; width:.5in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

/* a double box, like a form printed on a till roll */
.box{{ width:11px; height:11px; border:1.3px solid var(--strong); flex:none; margin-bottom:3px;
  box-shadow:inset 0 0 0 1.6px #fff; }}
.box.navy{{ border-color:var(--navy); }} .box.green{{ border-color:var(--green); }}
.box.rust{{ border-color:var(--rust); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.28in;
  max-height:.5in; }}
.rtext{{ font-size:9.9pt; padding-bottom:3px; line-height:1.15; }}
.footnote{{ font-size:8.4pt; color:var(--faint); line-height:1.45; padding-top:8px; display:block;
  flex:none; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:4px; border-bottom:1.4px solid var(--ink); margin-bottom:4px;
  font-weight:600; text-transform:uppercase; letter-spacing:.06em; font-size:7pt;
  color:var(--soft); }}
.head span, .head .blank{{ border:0; }}

.warn{{ border:1.4px solid var(--strong); padding:10px 13px; margin:10px 0; flex:none; }}
.warn.navy{{ border-color:var(--navy); }}
.warn.green{{ border-color:var(--green); }}
.warn.rust{{ border-color:var(--rust); }}
.warn b{{ font-size:9.6pt; }}
.warn p{{ margin:5px 0 0; font-size:9.2pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.aos{{ display:grid; grid-template-columns:1fr 1fr; gap:0 14px; flex:1 1 auto; min-height:0;
  align-content:stretch; }}
.ao{{ display:flex; align-items:flex-end; gap:7px; min-height:.28in; max-height:.4in;
  flex:1 1 auto; }}
.aon{{ font-family:"Darker Grotesque",Arial,sans-serif; font-weight:700; font-size:12pt;
  color:var(--navy); width:.16in; padding-bottom:1px; }}
.op{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.1fr) .5in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}

/* page 2 ------------------------------------------------------------------ */
.uf{{ display:grid; grid-template-columns:minmax(0,1fr) .78in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}

/* page 3 ------------------------------------------------------------------ */
.dy{{ display:grid; grid-template-columns:.36in minmax(0,1fr) .5in .26in .26in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.48in; }}
.dyn{{ font-size:8.8pt; color:var(--navy); font-weight:600; padding-bottom:4px; }}
.nc{{ display:grid; grid-template-columns:.78in minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}

/* page 4 ------------------------------------------------------------------ */
.two.tight{{ gap:0 .34in; }}
.hdr{{ display:grid; grid-template-columns:minmax(0,1fr) .5in .3in; gap:0 9px; flex:none;
  border-bottom:2px solid var(--ink); padding-bottom:4px;
  font-weight:600; text-transform:uppercase; letter-spacing:.06em; font-size:7pt;
  color:var(--soft); }}
.hq, .ht{{ text-align:center; }}
.blk{{ display:flex; flex-direction:column; flex:1 1 auto; min-height:0; padding-top:7px; }}
.ail{{ display:flex; align-items:flex-end; gap:7px; flex:none; height:.26in;
  margin-bottom:2px; }}
.ain{{ font-family:"Darker Grotesque",Arial,sans-serif; font-weight:800; font-size:13pt;
  color:var(--navy); width:.15in; line-height:1; }}
.ail .blank{{ border-bottom:1.6px solid var(--navy); }}
.it{{ display:grid; grid-template-columns:minmax(0,1fr) .5in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.24in; max-height:.34in; }}

/* page 5 ------------------------------------------------------------------ */
.bg{{ display:grid; grid-template-columns:minmax(0,1fr) .5in .5in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.tu{{ display:grid; grid-template-columns:minmax(0,1fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* page 6 ------------------------------------------------------------------ */
.sp{{ display:grid; grid-template-columns:.78in minmax(0,1fr) .5in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.un{{ display:grid; grid-template-columns:minmax(0,1fr) .5in .5in .5in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.tot{{ display:flex; align-items:flex-end; gap:8px; flex:none; height:.34in;
  border-top:1.6px solid var(--ink); margin-top:6px; padding-top:7px; }}
.tot span{{ font-size:7.6pt; font-weight:600; text-transform:uppercase; letter-spacing:.07em;
  color:var(--soft); padding-bottom:3px; white-space:nowrap; }}
.tot .blank{{ border-bottom:1.4px solid var(--green); }}

/* page 7 ------------------------------------------------------------------ */
.wa{{ display:grid; grid-template-columns:.78in minmax(0,1fr) minmax(0,1.1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* page 8 ------------------------------------------------------------------ */
.lv{{ display:grid; grid-template-columns:minmax(0,1fr) .5in .5in .5in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.42in; }}
.fz{{ display:grid; grid-template-columns:minmax(0,1fr) .5in .5in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* page 9 ------------------------------------------------------------------ */
.fg{{ display:grid; grid-template-columns:.78in minmax(0,1fr) .38in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}
.gw{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.1fr) .5in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.4px solid var(--ink); margin-top:10px; padding-top:7px; flex:none; }}
.foot .mark{{ font-family:"Darker Grotesque",Arial,sans-serif; font-weight:600; font-size:11.5pt;
  color:var(--faint); text-transform:uppercase; letter-spacing:.03em; }}
.pn{{ font-family:"Familjen Grotesk",Arial,sans-serif; font-size:7.6pt; font-weight:600;
  color:var(--faint); letter-spacing:.08em; }}
/* the torn edge along the bottom of every sheet */
.tear{{ position:absolute; left:0; right:0; bottom:0; height:7px;
  background:linear-gradient(-45deg, var(--rule) 5px, transparent 0) 0 100% / 11px 11px repeat-x,
             linear-gradient(45deg, var(--rule) 5px, transparent 0) 0 100% / 11px 11px repeat-x; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-shopping.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>One Trip Grocery Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-shopping-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"shopping-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"shopping-{name}")
        fill_pdf = os.path.join(DIST, f"shopping-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["green"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="One Trip &nbsp;&middot;&nbsp; grocery kit",
    title="Start<br><em>here.</em>",
    lede="Nine pages built on two things nobody else prints. A shopping list is written in the "
         "kitchen, in front of the open fridge &mdash; not in the shop, on a phone. And it should "
         "be laid out in the order of <b>your</b> shop, which is why page 1 asks you to write your "
         "aisle order down once and everything after it follows that order.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Fill page 1 first", "your aisle order, once &mdash; the rest depends on it"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. Tick the boxes with a click. Pages 1, 6 and 8 are filled in <b>once</b> and "
        "saved; pages 2, 3 and 4 are the ones you reprint or clear every week.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. The kit is built to be "
        "used that way: fill in page 1 and page 8 by hand once, stick them inside a cupboard door, "
        "and photocopy pages 2, 3 and 4 in a small stack. <b>Page 4 is the one that goes with "
        "you</b> &mdash; it is a list in your aisle order, so you walk the shop once.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "Pages 2, 3 and 4 weekly; 5, 6 and 7 monthly; 1 and 8 once",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="How to use it the first time",
    s5p="Do page 1 and page 8 on a quiet evening with the cupboard open &mdash; the aisle order, "
        "and the level at which each staple gets re-ordered. That hour is what makes every later "
        "week a five-minute job, because the list stops being something one person has to hold in "
        "their head. Then run pages 2 to 4 for a week, and keep page 7 for a month before you "
        "judge anything: what gets thrown away is the most useful number in the kit, and it takes "
        "four weeks to show a pattern.",
    license="Personal use only. Print as many copies as you like for your own household. Please do "
            "not resell, share or redistribute the files. Fonts: Darker Grotesque and Familjen "
            "Grotesk (SIL Open Font License).",
    mark="Written in the kitchen, not in the shop.",
)

PAGE_NAMES = ["Your shop", "The kitchen check", "The week&#8217;s food", "The list, in aisle order",
              "Big shop &amp; top-up", "What it costs", "What went in the bin",
              "The cupboard levels", "What we forgot"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["market"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Darker Grotesque",Arial,sans-serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Familjen Grotesk",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Familjen Grotesk"'),
                 ("--s1:#f2a65a", "--s1:" + C["green"]), ("--s2:#ee6c4d", "--s2:" + C["rust"]),
                 ("--s3:#c43e7a", "--s3:" + C["navy"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"]),
                 ("font-style:italic;", "font-style:normal;")]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-shopping.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    hp = os.path.join(work, "readme-shopping.html")
    open(hp, "w", encoding="utf-8").write(tpl)
    B.to_pdf(hp, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-shopping.css")
    doc = pymupdf.open(os.path.join(DIST, "shopping-planner-letter-market-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"shopping-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["market"]
    over = (
        "<style>"
        "h1{font-family:'Darker Grotesque',Arial,sans-serif;font-weight:800;line-height:.86;"
        "letter-spacing:-.02em;text-transform:uppercase}"
        f"h1 em{{font-style:normal;color:{C['green']}}}"
        "body{font-family:'Familjen Grotesk',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['navy']};font-family:'Familjen Grotesk';font-weight:600;"
        "letter-spacing:.18em}"
        f".rule{{background:{C['navy']};height:5px;width:250px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Familjen Grotesk';"
        "font-weight:600;letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(23,24,28,.17)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Familjen Grotesk',Arial,sans-serif;font-weight:600;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>Written in the<br>kitchen, not<br><em>in the shop.</em></h1>
          <span class="rule"></span>
          <p class="sub">A grocery kit laid out in the order of your shop, not somebody
          else&rsquo;s categories. The fridge check that comes before the list, five dinners
          instead of seven, the cupboard level below which a staple gets re-ordered, and one
          honest month of what went in the bin.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Undated, reusable</span><span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[3]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages,<br><em>one trip.</em></h1>
      <div class="tiles" style="margin-top:30px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">The idea the whole kit turns on</span>
      <h1>Your aisles.<br><em>Your order.</em></h1>
      <p class="sub">Write your shop down once, door to till, and number it. The list page is then
      six blocks you label yourself in that order &mdash; so you walk the shop once instead of
      going back for the thing that was three aisles ago. Page 2 is what comes before the list:
      the fridge, the freezer and the cupboard, checked rather than guessed.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[0]}" style="height:1170px"><img src="{imgs[1]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#eff0f2", "100px", "92px", hero),
                                       ("02-pages", "#ffffff", "76px", "62px", pages),
                                       ("03-detail", "#edeef0", "100px", "88px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-shopping-{name}.html")
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
        BD.package(DIST, "One-Trip-Grocery-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building grocery kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "shopping-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "market", embed_fonts=False))
    print("Wrote shopping-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "One-Trip-Grocery-Kit")


if __name__ == "__main__":
    main()
