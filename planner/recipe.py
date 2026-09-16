#!/usr/bin/env python3
"""Build the Second Time recipe kit.

Every recipe card on the market prints the two things you already know --
ingredients and method -- and loses the part that actually made the dish
yours: which pan, what your oven really runs at, what it looks like when it
is ready, what goes wrong, and what you changed the second time you cooked
it. This kit is built around that. Two of its nine pages are a matched
front and back, printed as many times as there are dishes worth keeping.

    python3 recipe.py                  # every size / colourway
    python3 recipe.py --only letter-kitchen
    python3 recipe.py --extras         # start-here sheet, listing images, zips
"""
import argparse, base64, math, os

import build as B
import birthday as BD   # measure(), make_fillable(), package() are shared

ROOT, WORK = B.ROOT, B.WORK
DIST = os.path.join(ROOT, "dist-recipe")

GF_URL = ("https://fonts.googleapis.com/css2"
          "?family=Vollkorn:ital,wght@0,500;0,600;0,700;1,500"
          "&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap")

SIZES = {
    "letter": dict(B.SIZES["letter"], pad=".45in .5in .4in", display="36pt"),
    "a4":     dict(B.SIZES["a4"],     pad="12mm 13mm 11mm", display="35pt"),
}

COLORWAYS = {
    # teal = the method, paprika = heat and what goes wrong, honey = your notes.
    "kitchen": dict(ink="#1f1d1b", soft="#57524c", faint="#8e8880", rule="#e6e3de",
                    strong="#c7c2ba", teal="#1a6460", paprika="#bf4a26", honey="#a97b1f"),
    "mono":    dict(ink="#1f1f1e", soft="#575755", faint="#8f8f8c", rule="#e6e6e4",
                    strong="#c6c6c3", teal="#3c3c3a", paprika="#3c3c3a", honey="#8c8c89"),
}

PAGES = 9
MARK = "Nobody writes down the part that matters."

# --------------------------------------------------------------------------- helpers

def check(f, tone=""):
    return f'<span class="box {tone}" data-field="{f}" data-ftype="check"></span>'

def blank(f, cls="", fs="10.5"):
    return f'<span class="blank {cls}" data-field="{f}" data-fsize="{fs}"></span>'

def sec(label, hint="", tone=""):
    """The rule sits under the label only, not across the column."""
    hint = f'<span class="hint">{hint}</span>' if hint else ""
    return f'<div class="sec"><span class="lbl {tone}">{label}</span>{hint}</div>'

def field(label, f, cls="", fs="10.5"):
    return f'<div class="fr"><span class="flbl">{label}</span>{blank(f, cls, fs)}</div>'

def lines(prefix, n, cls="grow", fs="10.5"):
    return "".join(f'<div class="wl">{blank(f"{prefix}_{i}", cls, fs)}</div>'
                   for i in range(1, n + 1))

def ticked(prefix, items, tone=""):
    return "".join(f'<div class="wl">{check(f"{prefix}_{i}", tone)}'
                   f'<span class="rtext">{t}</span></div>'
                   for i, t in enumerate(items, start=1))

def steam(seed=1):
    """Three ribbons of steam, curling a little higher on every page."""
    parts = [f'<path d="M14 104 Q48 96 82 104"/>']          # the rim of the pan
    for k, x in enumerate((30, 48, 66)):
        amp = 5 + ((seed + k) % 4) * 1.6                     # each ribbon waves its own way
        top = 88 - seed * 6 - k * 4
        d = [f"M{x} 96"]
        y = 96
        left = True
        while y > top:
            y -= 13
            d.append(f"Q{x + (amp if left else -amp):.0f} {y + 6:.0f} {x} {max(y, top):.0f}")
            left = not left
        parts.append(f'<path d="{" ".join(d)}"/>')
    return (f'<svg class="steam" viewBox="0 0 96 116" aria-hidden="true">'
            f'<g fill="none" stroke="currentColor" stroke-width="1.15" '
            f'stroke-linecap="round">{"".join(parts)}</g></svg>')

def sheet(n, title, kicker, tag, body):
    return f'''
<div class="sheet">
  <header class="mast">
    <div class="masthead"><span class="kicker">{kicker}</span><h1>{title}</h1></div>
    <div class="mastright">{steam(n)}<span class="num"><b>{n}</b><i>{tag}</i></span></div>
  </header>
  <div class="page">{body}</div>
  <footer class="foot"><span class="mark">{MARK}</span>
    <span class="pn">{n} / {PAGES}</span></footer>
</div>'''

# --------------------------------------------------------------------------- pages

def page_1():
    pans = "".join(
        f'<div class="pn2">{blank(f"r1_p_{i}", "", "10")}{blank(f"r1_ps_{i}", "w2", "10")}'
        f'{blank(f"r1_pw_{i}", "", "10")}</div>'
        for i in range(1, 7))
    return sheet(1, "This<br>kitchen.", "Recipe kit &middot; fill this in once", "Once",
        '<div class="two b46"><section>' +
        '<div class="warn paprika">'
        '<b>Your oven is not the oven the recipe was written in</b>'
        '<p>Domestic ovens are routinely fifteen or twenty degrees out, and they are hotter at the '
        'back. That single fact is behind most of the cakes that sink and the chicken that is done '
        'on one side. Put a cheap oven thermometer on the middle shelf, set the dial to 180, wait '
        'twenty minutes and write down what it actually says. Every recipe you keep in here can '
        'then carry the real number.</p>'
        '</div>' +
        sec("The oven", "Dial against thermometer", "paprika") +
        '<div class="split2">' + field("Set to 180, it reads", "r1_o180", "w2") +
        field("So it runs", "r1_odiff", "w2") + '</div>' +
        '<div class="split2">' + field("Fan / conventional", "r1_ofan", "w2") +
        field("Hot spot is", "r1_ohot", "w2") + '</div>' +
        field("Shelf we use for baking", "r1_oshelf") +
        field("Grill, and how close", "r1_ogrill") +
        sec("The hob", "What &#8220;medium&#8221; means here", "teal") +
        field("Gas, electric or induction", "r1_hob") +
        '<div class="split2">' + field("Our medium is", "r1_hmed", "w2") +
        field("Our low is", "r1_hlow", "w2") + '</div>' +
        sec("The pans we actually own", "Sizes, not adjectives", "teal") +
        '<div class="pn2 head"><span>Pan or tin</span><span class="w2">Size</span>'
        '<span>What it is for</span></div>' + pans +
        '</section><section>' +
        sec("Who we cook for", "", "honey") +
        '<div class="split2">' + field("Usually", "r1_usually", "w2") +
        field("At a push", "r1_push", "w2") + '</div>' +
        sec("Allergies and the absolute nos", "First", "paprika") +
        lines("r1_all", 3) +
        sec("Will not eat, and there is no arguing", "", "honey") +
        lines("r1_no", 3) +
        sec("Always in the cupboard", "So a recipe can say &#8220;the usual&#8221;", "teal") +
        lines("r1_have", 5) +
        sec("Never in, and has to be bought", "", "honey") +
        lines("r1_never", 3) +
        sec("What this kitchen cannot do", "Honestly", "paprika") +
        lines("r1_cant", 3) +
        '</section></div>')

def page_2():
    ing = "".join(
        f'<div class="ig">{blank(f"r2_i_{i}", "", "10")}{blank(f"r2_a_{i}", "w3", "10")}'
        f'{blank(f"r2_b_{i}", "w3", "10")}</div>'
        for i in range(1, 15))
    steps = "".join(
        f'<div class="st"><span class="stn">{i}</span>{blank(f"r2_s_{i}", "grow", "10")}</div>'
        for i in range(1, 9))
    return sheet(2, "The recipe.", "Recipe kit &middot; print this one many times", "Card",
        '<div class="rhead">' +
        f'<div class="rname"><span class="rl">Dish</span>{blank("r2_name", "grow", "15")}</div>' +
        f'<div class="rfrom"><span class="rl">From</span>{blank("r2_from", "grow", "10")}</div>' +
        '</div>' +
        '<div class="rbar">' +
        f'<div class="rb"><i>Serves</i>{blank("r2_serves", "grow", "11")}</div>' +
        f'<div class="rb"><i>Hands on</i>{blank("r2_hands", "grow", "11")}</div>' +
        f'<div class="rb"><i>Start to plate</i>{blank("r2_total", "grow", "11")}</div>' +
        f'<div class="rb"><i>Can be done ahead</i>{blank("r2_ahead", "grow", "11")}</div>' +
        '</div>' +
        '<div class="two b46 rbody"><section>' +
        sec("Ingredients", "And the same recipe, scaled", "teal") +
        '<div class="ig head"><span>What, and how much</span>'
        f'<span class="w3">For {blank("r2_n1", "w3", "8")}</span>'
        f'<span class="w3">For {blank("r2_n2", "w3", "8")}</span></div>' + ing +
        sec("The pan, and the oven", "From page 1", "paprika") +
        field("Pan or tin", "r2_pan") +
        '<div class="split2">' + field("Dial", "r2_dial", "w2") +
        field("Really", "r2_real", "w2") + '</div>' +
        field("What else it needs", "r2_kit") +
        field("Do this bit the day before", "r2_day") +
        '</section><section>' +
        sec("Start with", "The thing that takes longest", "honey") +
        lines("r2_first", 2) +
        sec("Method", "Short lines &mdash; it carries on overleaf", "teal") +
        f'<div class="sts">{steps}</div>' +
        sec("You know it is ready when", "Not a time &mdash; a sign", "paprika") +
        lines("r2_ready", 2) +
        sec("What goes wrong", "", "paprika") +
        lines("r2_wrong", 2) +
        '</section></div>')

def page_3():
    steps = "".join(
        f'<div class="st"><span class="stn">{i}</span>{blank(f"r3_s_{i}", "grow", "10")}</div>'
        for i in range(9, 19))
    cooks = "".join(
        f'<div class="ck">{blank(f"r3_d_{i}", "w2", "10")}{blank(f"r3_c_{i}", "", "10")}'
        f'<span class="c">{check(f"r3_w_{i}", "teal")}</span></div>'
        for i in range(1, 5))
    return sheet(3, "The second<br>time.", "Recipe kit &middot; the back of the card", "Card",
        '<div class="two b46"><section>' +
        sec("Method, continued", "", "teal") + f'<div class="sts">{steps}</div>' +
        sec("Serve it with", "", "honey") + lines("r3_with", 3) +
        sec("Who liked it, and who did not", "Before next time", "honey") +
        lines("r3_who", 3) +
        '</section><section>' +
        '<div class="warn">'
        '<b>The recipe is not finished the first time you cook it</b>'
        '<p>The first cook tells you almost nothing except whether it is worth a second. The '
        'second is where it becomes yours: less liquid, ten minutes longer, half the chilli, the '
        'onions started earlier. Write the change down <b>on the day</b>, in one line &mdash; a '
        'month later you will remember that you changed something and not what.</p>'
        '</div>' +
        sec("Cooked, and changed", "Tick if the change stays", "teal") +
        '<div class="ck head"><span class="w2">Date</span><span>What we did differently</span>'
        '<span class="c">Keep</span></div>' + cooks +
        sec("The version we cook now", "Once it settles", "honey") +
        lines("r3_now", 3) +
        sec("Keeping it", "", "paprika") +
        '<div class="split2">' + field("Fridge", "r3_fridge", "w2") +
        field("Freezes", "r3_freeze", "w2") + '</div>' +
        field("How to reheat it, properly", "r3_reheat") +
        sec("A photograph of it, if you want one", "", "honey") +
        '<div class="photo"></div>' +
        '</section></div>')

BATCH = [
    ("Doubles cleanly", "Stews, sauces, soups, braises, most bakes"),
    ("Does not double", "Anything fried or roasted &mdash; a crowded pan steams"),
    ("Season at the end", "Salt does not double neatly; taste twice"),
    ("Cool it fast", "Shallow trays, not a hot pot left on the side"),
    ("Freeze it flat", "Bags laid down freeze and thaw in a fraction of the time"),
    ("Label or lose it", "What, how many portions, and the date it went in"),
]

def page_4():
    rows = "".join(
        f'<div class="bt"><span class="btn"><b>{a}</b><i>{b}</i></span>'
        f'{blank(f"r4_n_{i}", "", "10")}</div>'
        for i, (a, b) in enumerate(BATCH, start=1))
    fz = "".join(
        f'<div class="fz">{blank(f"r4_f_{i}", "", "10")}{blank(f"r4_p_{i}", "w3", "10")}'
        f'{blank(f"r4_fd_{i}", "w3", "10")}{blank(f"r4_fb_{i}", "w3", "10")}</div>'
        for i in range(1, 10))
    return sheet(4, "Cook once,<br>eat twice.", "Recipe kit &middot; the batch page", "As needed",
        '<div class="two b46"><section>' +
        sec("What doubling actually needs", "Yours beside it", "teal") +
        '<div class="bt head"><span class="btn">The rule</span>'
        '<span>What we do</span></div>' + rows +
        sec("Dishes that are better the next day", "", "honey") + lines("r4_next", 4) +
        sec("Dishes that are not", "Cook these to eat", "paprika") + lines("r4_not", 3) +
        '</section><section>' +
        '<div class="warn paprika">'
        '<b>&#8220;Reheat thoroughly&#8221; is not an instruction</b>'
        '<p>It is the line that produces dry chicken and a cold middle. Write the real one instead, '
        'per dish: what heat, in what, covered or not, with a splash of water or not, and how you '
        'know &mdash; steaming all the way through, not warm at the edges. Reheat once, and heat '
        'only what you are going to eat.</p>'
        '</div>' +
        sec("In the freezer", "Portions, and when it has to be eaten", "teal") +
        '<div class="fz head"><span>What</span><span class="w3">Portions</span>'
        '<span class="w3">In</span><span class="w3">By</span></div>' + fz +
        sec("How we reheat each of them", "Per dish, in one line", "paprika") +
        lines("r4_re", 3) +
        '</section></div>')

RESCUE = [
    ("Too salty", "Bulk it out &mdash; more liquid, potato, rice, unsalted stock. Then acid, "
                  "then something sweet. Nothing removes salt."),
    ("Too thin", "Reduce it uncovered, or a teaspoon of cornflour slaked in cold water. "
                 "Never tip dry flour into hot liquid."),
    ("Too thick", "Loosen with the cooking water, stock or milk, a splash at a time, off the "
                  "boil."),
    ("Split or curdled", "Off the heat. A spoonful of cold liquid, whisked hard. Or blitz it and "
                         "start the sauce again around it."),
    ("Bland", "Salt first. Then acid &mdash; lemon, vinegar. Then fat. Sweet and heat last. "
              "Nine times in ten it was salt or acid."),
    ("Meat dry", "Slice it thin across the grain and sauce it. Next time: lower heat, take it "
                 "out earlier, let it rest."),
    ("Burnt on the bottom", "Tip what is good into a clean pan without scraping. The burnt "
                            "taste travels; the pan does not come back."),
    ("Cake sunk or raw inside", "Oven too hot, or the door opened early. Check the real "
                                "temperature on page 1 and the date on the baking powder."),
]

def page_5():
    rows = "".join(
        f'<div class="rs"><span class="rsn"><b>{a}</b><i>{b}</i></span>'
        f'{blank(f"r5_n_{i}", "", "10")}</div>'
        for i, (a, b) in enumerate(RESCUE, start=1))
    return sheet(5, "When it<br>goes wrong.", "Recipe kit &middot; the page to stick inside a door",
        "Pin up",
        '<div class="two b2"><section>' +
        sec("The usual fixes, and yours", "What worked, in your kitchen", "paprika") +
        '<div class="rs head"><span class="rsn">What is wrong, and what to do</span>'
        '<span>What worked for us</span></div>' + rows +
        '</section><section>' +
        '<div class="warn">'
        '<b>Taste it earlier than you think</b>'
        '<p>Almost everything on this list is recoverable if it is caught while there is still '
        'time to act &mdash; and almost nothing is, once it is on the plate. Taste at the start, '
        'in the middle and before it leaves the pan; season in small amounts each time rather '
        'than once at the end, which is how things end up too salty in the first place.</p>'
        '</div>' +
        sec("What we get wrong, again and again", "", "paprika") + lines("r5_us", 4) +
        sec("What fixed it", "", "teal") + lines("r5_fix", 4) +
        sec("Things worth learning properly", "One at a time", "honey") + lines("r5_learn", 3) +
        '</section></div>')

def page_6():
    oven = "".join(
        f'<div class="ov">{blank(f"r6_d_{i}", "", "10")}{blank(f"r6_t_{i}", "w3", "10")}'
        f'{blank(f"r6_h_{i}", "w3", "10")}'
        f'<span class="c">{check(f"r6_sh_{i}", "paprika")}</span></div>'
        for i in range(1, 7))
    count = [("The day before", "r6_c1", 3), ("The morning", "r6_c2", 3),
             ("An hour before", "r6_c3", 3), ("The last ten minutes", "r6_c4", 3)]
    blocks = "".join(sec(t, "", "teal") + lines(p, n) for t, p, n in count)
    return sheet(6, "Cooking for<br>other people.", "Recipe kit &middot; counted backwards",
        "As needed",
        '<div class="two b46"><section>' +
        '<div class="warn paprika">'
        '<b>One oven, four dishes, and everything wants a different temperature</b>'
        '<p>This is why dinner is late, and it is arithmetic rather than skill. Write every dish '
        'down with the heat it needs and how long it takes, then decide what shares the oven, what '
        'is happy ten degrees off, what can come out and sit covered, and what is cooked on the '
        'hob instead. Anything that is fine at room temperature is a dish that stops competing.</p>'
        '</div>' +
        sec("The oven, dish by dish", "Tick what can share", "paprika") +
        '<div class="ov head"><span>Dish</span><span class="w3">Temp</span>'
        '<span class="w3">Mins</span><span class="c">Share</span></div>' + oven +
        '<div class="split2">' + field("Sitting down at", "r6_sit", "w2") +
        field("So the oven goes on at", "r6_on", "w2") + '</div>' +
        sec("Fine at room temperature", "First, then forget", "honey") +
        lines("r6_room", 3) +
        '</section><section>' +
        sec("Counted back from the table", "", "teal") + blocks +
        sec("Who is coming, and what they cannot eat", "", "paprika") +
        lines("r6_alg", 3) +
        '<span class="footnote">The one rule worth keeping: do not cook something for the first '
        'time for guests. Cook it once for yourself, put it on page 2, and then it is a recipe '
        'rather than a gamble.</span>' +
        '</section></div>')

NEEDS = ["Quick, on a weeknight", "Feeds a crowd", "Freezes well", "Cheap",
         "When somebody is ill", "Uses what is already in", "Worth showing off",
         "Nobody has to be asked twice"]

def page_7():
    rows = "".join(
        f'<div class="ix"><span class="ixn">{t}</span>{blank(f"r7_a_{i}", "", "10")}'
        f'{blank(f"r7_b_{i}", "", "10")}</div>'
        for i, t in enumerate(NEEDS, start=1))
    return sheet(7, "The ones we<br>actually cook.", "Recipe kit &middot; an index by need", "Once",
        '<div class="two b46"><section>' +
        sec("Not alphabetical", "Two dishes against each, that is enough", "teal") +
        '<div class="ix head"><span class="ixn">When you need</span><span>This</span>'
        '<span>Or this</span></div>' + rows +
        '<span class="footnote">Nobody stands in a kitchen at half past six thinking of a dish by '
        'name. They think &#8220;something quick&#8221;, or &#8220;something that uses the mince '
        'in the fridge&#8221;. An index that answers the question people actually ask is the one '
        'that gets used.</span>' +
        '</section><section>' +
        sec("The rut", "What we cook too often", "paprika") + lines("r7_rut", 3) +
        sec("What to try next", "One a fortnight is plenty", "honey") + lines("r7_try", 5) +
        sec("Tried, and not keeping", "Say so, and stop re-cooking it", "paprika") +
        lines("r7_drop", 3) +
        sec("The dish this house is known for", "", "honey") + lines("r7_known", 2) +
        '</section></div>')

ASK = [
    "How much is &#8220;a bit&#8221;? Show me in your hand, then we will weigh it",
    "Which pan? This one, or the big one?",
    "How high is the heat, really &mdash; can I hear it?",
    "How do you know when it is done, without looking at a clock?",
    "What do you do if it goes wrong?",
    "What did your mother do differently?",
    "What do you always serve it with?",
    "What would you never put in it?",
]

def page_8():
    return sheet(8, "Written down<br>before it is lost.", "Recipe kit &middot; somebody else&#8217;s recipe",
        "As needed",
        '<div class="two b46"><section>' +
        '<div class="warn honey">'
        '<b>Family recipes die in the gap between &#8220;some flour&#8221; and a number</b>'
        '<p>The person who cooks it does not use a recipe, so there is nothing to photocopy. The '
        'only way to keep it is to stand next to them while they cook it and write down what you '
        'see &mdash; weighing things as they go in, and asking the questions below, which are the '
        'ones whose answers never make it onto a card.</p>'
        '</div>' +
        sec("Ask, while they are cooking", "", "teal") + ticked("r8_q", ASK, "teal") +
        '</section><section>' +
        sec("Whose recipe this is", "", "honey") +
        field("Cooked by", "r8_who") +
        field("Written down on", "r8_when") +
        field("Where they got it", "r8_got") +
        field("What they call it", "r8_call") +
        sec("What I saw them do", "The things they did not say out loud", "teal") +
        lines("r8_saw", 5) +
        sec("What I weighed, while they poured", "", "honey") + lines("r8_weighed", 4) +
        sec("The bit they could not explain", "Write it anyway", "paprika") +
        lines("r8_cant", 2) +
        '<span class="footnote">Then cook it once yourself, from your notes, while you can still '
        'ring them up &mdash; and put the finished version on a page 2.</span>' +
        '</section></div>')

CUPS = [("Plain flour", "1 cup", "125 g"), ("Caster sugar", "1 cup", "200 g"),
        ("Brown sugar, packed", "1 cup", "220 g"), ("Butter", "1 cup / 2 sticks", "225 g"),
        ("Rice, uncooked", "1 cup", "185 g"), ("Water or milk", "1 cup", "240 ml"),
        ("Tablespoon / teaspoon", "1 tbsp / 1 tsp", "15 ml / 5 ml")]

OVENS = [("Gas 4", "180&deg;C", "160&deg;C fan", "350&deg;F"),
         ("Gas 6", "200&deg;C", "180&deg;C fan", "400&deg;F"),
         ("Gas 7", "220&deg;C", "200&deg;C fan", "425&deg;F")]

def page_9():
    cups = "".join(
        f'<div class="cv"><span class="cvn">{a}</span><span class="cvm">{b}</span>'
        f'<span class="cvg">{c}</span></div>' for a, b, c in CUPS)
    ovens = "".join(
        f'<div class="ob"><span>{a}</span><span>{b}</span><span>{c}</span><span>{d}</span></div>'
        for a, b, c, d in OVENS)
    subs = "".join(
        f'<div class="sb">{blank(f"r9_s_{i}", "", "10")}{blank(f"r9_sw_{i}", "", "10")}</div>'
        for i in range(1, 8))
    return sheet(9, "The numbers<br>you keep<br>looking up.", "Recipe kit &middot; and what to swap",
        "Pin up",
        '<div class="two b46"><section>' +
        sec("Cups to grams", "Weight beats volume, every time", "teal") +
        '<div class="cv head"><span class="cvn">What</span><span class="cvm">Measure</span>'
        '<span class="cvg">Is about</span></div>' + cups +
        '<span class="footnote">A cup of flour can vary by a fifth depending on whether it was '
        'scooped or spooned, which is most of the difference between two people baking the same '
        'recipe. If there are scales in the kitchen, use them.</span>' +
        sec("Oven, three ways", "Fan is about 20&deg;C lower", "paprika") +
        '<div class="ob head"><span>Gas</span><span>Conventional</span><span>Fan</span>'
        '<span>Fahrenheit</span></div>' + ovens +
        sec("Tins we have, in both", "", "honey") +
        '<div class="split2">' + field("Round", "r9_round", "w2") +
        field("Square", "r9_square", "w2") + '</div>' +
        '<div class="split2">' + field("Loaf", "r9_loaf", "w2") +
        field("Roasting", "r9_roast", "w2") + '</div>' +
        '</section><section>' +
        sec("Swaps that work in this kitchen", "Tested, not hopeful", "teal") +
        '<div class="sb head"><span>Instead of</span><span>We use</span></div>' + subs +
        sec("Swaps that did not work", "", "paprika") + lines("r9_bad", 3) +
        sec("Where things are", "Spices, tins, the good oil", "honey") + lines("r9_where", 3) +
        sec("Worth buying properly", "Only three", "honey") + lines("r9_buy", 3) +
        '</section></div>')

PAGE_FNS = [page_1, page_2, page_3, page_4, page_5, page_6, page_7, page_8, page_9]

# --------------------------------------------------------------------------- css

def css(size, colorway):
    S, C = SIZES[size], COLORWAYS[colorway]
    return f'''
:root{{
  --ink:{C["ink"]}; --soft:{C["soft"]}; --faint:{C["faint"]};
  --rule:{C["rule"]}; --strong:{C["strong"]};
  --teal:{C["teal"]}; --paprika:{C["paprika"]}; --honey:{C["honey"]};
  --backdrop:#eceae6;
}}
@media (prefers-color-scheme: dark){{ :root:not([data-theme="light"]){{ --backdrop:#161514; }} }}
:root[data-theme="dark"]{{ --backdrop:#161514; }}

@page{{ size: {S["w"]} {S["h"]}; margin: 0; }}
html, body{{ margin:0; }}
body{{ background:var(--backdrop); color:var(--ink);
  font-family:"Plus Jakarta Sans","Helvetica Neue",Arial,sans-serif;
  display:flex; flex-direction:column; align-items:center; gap:22px; padding:24px 14px 60px; }}

.sheet{{ width:{S["w"]}; height:{S["h"]}; box-sizing:border-box; padding:{S["pad"]};
  background:#fff; display:flex; flex-direction:column; overflow:hidden;
  box-shadow:0 16px 40px rgba(31,29,27,.15);
  -webkit-print-color-adjust:exact; print-color-adjust:exact; }}

.kicker{{ font-weight:600; text-transform:uppercase; letter-spacing:.15em; font-size:7.4pt;
  color:var(--teal); }}
.hint{{ font-size:8pt; color:var(--faint); white-space:nowrap; min-width:0;
  overflow:hidden; text-overflow:ellipsis; padding-left:10px; }}

.mast{{ display:flex; justify-content:space-between; align-items:flex-end; gap:.3in; flex:none; }}
.masthead{{ min-width:0; }}
.mast h1{{ font-family:"Vollkorn",Georgia,serif; font-weight:700; font-size:{S["display"]};
  line-height:.96; margin:5px 0 0; letter-spacing:-.008em; }}
.mastright{{ display:flex; align-items:flex-end; gap:12px; }}
.steam{{ width:.8in; height:.96in; color:var(--strong); }}
.num{{ text-align:right; flex:none; }}
.num b{{ font-family:"Vollkorn",Georgia,serif; font-size:21pt; font-weight:700; line-height:.9;
  display:block; color:var(--teal); }}
.num i{{ font-style:normal; display:block; font-size:6.6pt; font-weight:600;
  text-transform:uppercase; letter-spacing:.11em; color:var(--faint); padding-top:3px; }}

.page{{ flex:1; min-height:0; display:flex; flex-direction:column;
  border-top:1.4px solid var(--ink); margin-top:9px; padding-top:10px; }}
.two{{ flex:1 1 auto; min-height:0; display:grid; grid-template-columns:1fr 1fr; gap:0 .3in; }}
.two.b46{{ grid-template-columns:1.02fr 1fr; }}
.two.b2{{ grid-template-columns:1.25fr 1fr; }}
.two > section{{ display:flex; flex-direction:column; min-height:0; min-width:0; }}

/* the rule sits under the label only */
.sec{{ display:flex; align-items:baseline; padding:10px 0 5px; overflow:hidden; flex:none; }}
.lbl{{ font-weight:700; text-transform:uppercase; letter-spacing:.085em; font-size:8.2pt;
  color:var(--ink); white-space:nowrap; border-bottom:2.2px solid var(--ink);
  padding-bottom:3px; }}
.lbl.teal{{ color:var(--teal); border-bottom-color:var(--teal); }}
.lbl.paprika{{ color:var(--paprika); border-bottom-color:var(--paprika); }}
.lbl.honey{{ color:var(--honey); border-bottom-color:var(--honey); }}

.page .fr{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto;
  min-height:.28in; max-height:.5in; }}
.flbl{{ font-size:9pt; color:var(--soft); padding-bottom:4px; white-space:nowrap; }}
.blank{{ flex:1; border-bottom:1.2px solid var(--rule); height:100%; min-width:0; }}
.blank.w2{{ flex:none; width:.8in; }} .blank.w3{{ flex:none; width:.52in; }}
.split2{{ display:flex; gap:14px; }} .split2 .fr{{ flex:1; }}

.box{{ width:11px; height:11px; border:1.4px solid var(--strong); flex:none; margin-bottom:3px;
  border-radius:4px 0 4px 0; }}
.box.teal{{ border-color:var(--teal); }} .box.paprika{{ border-color:var(--paprika); }}
.box.honey{{ border-color:var(--honey); }}
.c{{ display:flex; justify-content:center; }}
.wl{{ display:flex; align-items:flex-end; gap:9px; flex:1 1 auto; min-height:.28in;
  max-height:.5in; }}
.rtext{{ font-size:9.7pt; padding-bottom:3px; line-height:1.18; }}
.footnote{{ font-size:8.4pt; color:var(--faint); line-height:1.45; padding-top:8px; display:block;
  flex:none; }}

.head{{ flex:none !important; min-height:0 !important; height:auto !important;
  padding-bottom:4px; border-bottom:1.2px solid var(--ink); margin-bottom:5px;
  font-weight:600; text-transform:uppercase; letter-spacing:.06em; font-size:7pt;
  color:var(--soft); }}
.head span, .head .blank{{ border:0; }}
.head .blank{{ border-bottom:1px solid var(--strong); }}

.warn{{ background:#00000006; border-left:3px solid var(--teal); padding:10px 13px;
  margin:9px 0; flex:none; }}
.warn.paprika{{ border-left-color:var(--paprika); }}
.warn.honey{{ border-left-color:var(--honey); }}
.warn b{{ font-family:"Vollkorn",Georgia,serif; font-size:10.4pt; }}
.warn p{{ margin:5px 0 0; font-size:9.2pt; line-height:1.5; color:var(--soft); }}

/* page 1 ------------------------------------------------------------------ */
.pn2{{ display:grid; grid-template-columns:minmax(0,1fr) .8in minmax(0,1.1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.46in; }}

/* page 2, the card ---------------------------------------------------------*/
.rhead{{ display:flex; flex-direction:column; gap:3px; flex:none; padding-bottom:7px; }}
.rname{{ display:flex; align-items:flex-end; gap:10px; height:.42in; }}
.rfrom{{ display:flex; align-items:flex-end; gap:10px; height:.28in; }}
.rl{{ font-size:7.4pt; font-weight:600; text-transform:uppercase; letter-spacing:.11em;
  color:var(--faint); padding-bottom:4px; white-space:nowrap; }}
.rname .blank{{ border-bottom:1.8px solid var(--ink); }}
.rbar{{ display:grid; grid-template-columns:repeat(4,1fr); gap:0 12px; flex:none;
  border-top:1.2px solid var(--rule); border-bottom:1.2px solid var(--rule);
  padding:6px 0 4px; margin-bottom:2px; }}
.rb{{ display:flex; flex-direction:column; min-width:0; }}
.rb i{{ font-style:normal; font-size:6.8pt; font-weight:600; text-transform:uppercase;
  letter-spacing:.1em; color:var(--faint); }}
.rb .blank{{ height:.24in; flex:none; }}
.rbody{{ padding-top:2px; }}
.ig{{ display:grid; grid-template-columns:minmax(0,1fr) .52in .52in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.26in; max-height:.38in; }}
.ig.head .blank{{ display:inline-block; width:.3in; height:.13in; vertical-align:baseline; }}
.sts{{ display:flex; flex-direction:column; flex:1 1 auto; min-height:0; }}
.st{{ display:flex; align-items:flex-end; gap:8px; flex:1 1 auto; min-height:.3in;
  max-height:.46in; }}
.stn{{ font-family:"Vollkorn",Georgia,serif; font-weight:600; font-size:11pt; color:var(--teal);
  width:.15in; padding-bottom:2px; }}

/* page 3 ------------------------------------------------------------------ */
.ck{{ display:grid; grid-template-columns:.8in minmax(0,1fr) .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.3in; max-height:.46in; }}
.photo{{ border:1.4px dashed var(--strong); flex:1 1 auto; min-height:.7in; margin-top:4px; }}

/* page 4 ------------------------------------------------------------------ */
.bt{{ display:grid; grid-template-columns:1.62in minmax(0,1fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.36in; max-height:.56in; }}
.btn{{ padding-bottom:3px; min-width:0; }}
.btn b{{ display:block; font-size:9.2pt; font-weight:600; line-height:1.15; }}
.btn i{{ display:block; font-style:normal; font-size:7.6pt; color:var(--faint); line-height:1.2; }}
.bt.head .btn{{ padding-bottom:0; }}
.fz{{ display:grid; grid-template-columns:minmax(0,1fr) .52in .52in .52in; gap:0 8px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.42in; }}

/* page 5 ------------------------------------------------------------------ */
.rs{{ display:grid; grid-template-columns:2.35in minmax(0,1fr); gap:0 12px;
  align-items:flex-end; flex:1 1 auto; min-height:.48in; max-height:.76in; }}
.rsn{{ padding-bottom:3px; min-width:0; }}
.rsn b{{ display:block; font-size:9.4pt; font-weight:600; line-height:1.15; color:var(--paprika); }}
.rsn i{{ display:block; font-style:normal; font-size:8pt; color:var(--soft); line-height:1.3;
  padding-top:1px; }}
.rs.head .rsn{{ padding-bottom:0; }}

/* page 6 ------------------------------------------------------------------ */
.ov{{ display:grid; grid-template-columns:minmax(0,1fr) .52in .52in .3in; gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

/* page 7 ------------------------------------------------------------------ */
.ix{{ display:grid; grid-template-columns:1.45in minmax(0,1fr) minmax(0,1fr); gap:0 9px;
  align-items:flex-end; flex:1 1 auto; min-height:.34in; max-height:.52in; }}
.ixn{{ font-size:9.2pt; line-height:1.15; padding-bottom:3px; }}
.ix.head .ixn{{ padding-bottom:0; }}

/* page 9 ------------------------------------------------------------------ */
.cv{{ display:grid; grid-template-columns:minmax(0,1.25fr) minmax(0,1fr) .8in; gap:0 10px;
  align-items:baseline; flex:none; min-height:.3in; border-bottom:1px solid var(--rule);
  padding-top:4px; }}
.cvn{{ font-size:9.2pt; font-weight:500; }}
.cvm{{ font-size:8.6pt; color:var(--soft); }}
.cvg{{ font-size:9.2pt; font-weight:600; color:var(--teal); text-align:right; }}
.cv.head span{{ font-size:7pt; }}
.ob{{ display:grid; grid-template-columns:.6in 1fr 1fr 1fr; gap:0 8px; align-items:baseline;
  flex:none; min-height:.3in; border-bottom:1px solid var(--rule); padding-top:4px;
  font-size:9pt; }}
.ob span:first-child{{ font-weight:600; color:var(--paprika); }}
.sb{{ display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); gap:0 10px;
  align-items:flex-end; flex:1 1 auto; min-height:.28in; max-height:.44in; }}

.foot{{ display:flex; align-items:center; justify-content:space-between; gap:12px;
  border-top:1.4px solid var(--ink); margin-top:10px; padding-top:7px; flex:none; }}
.foot .mark{{ font-family:"Vollkorn",Georgia,serif; font-style:italic; font-weight:500;
  font-size:10pt; color:var(--faint); }}
.pn{{ font-size:7.6pt; font-weight:600; color:var(--faint); letter-spacing:.08em; }}

@media print{{ body{{ background:#fff; padding:0; display:block; gap:0; }}
  .sheet{{ box-shadow:none; }} }}
'''

def render_html(size, colorway, embed_fonts=True):
    fonts = B.google_fonts_css(embed_fonts, GF_URL, "faces-recipe.css")
    pages = "".join(fn() for fn in PAGE_FNS)
    return (f'<meta charset="utf-8">\n<title>Second Time Recipe Kit</title>\n{fonts}\n'
            f'<style>{css(size, colorway)}</style>\n{pages}\n')

# --------------------------------------------------------------------------- build

def build_variant(size, colorway, work, fillable=True):
    name = f"{size}-{colorway}"
    src = render_html(size, colorway, embed_fonts=True)
    render_path = os.path.join(work, f"render-recipe-{name}.html")
    open(render_path, "w", encoding="utf-8").write(src)

    print_pdf = os.path.join(DIST, f"recipe-planner-{name}-print.pdf")
    B.to_pdf(render_path, print_pdf)

    if fillable:
        fields = BD.measure(src, SIZES[size], work, f"recipe-{name}")
        fill_pdf = os.path.join(DIST, f"recipe-planner-{name}-fillable.pdf")
        BD.make_fillable(print_pdf, fields, SIZES[size], fill_pdf,
                         dict(COLORWAYS[colorway], a1=COLORWAYS[colorway]["teal"]),
                         pages=len(PAGE_FNS))
        print(f"  {name}: print + fillable ({len(fields)} fields over {len(PAGE_FNS)} pages)")
    else:
        print(f"  {name}: print")

READ_ME = dict(
    doc="Start here", brand="Second Time &nbsp;&middot;&nbsp; recipe kit",
    title="Start<br><em>here.</em>",
    lede="Every recipe card prints the two things you already know &mdash; ingredients and method "
         "&mdash; and loses the part that made the dish yours: which pan, what your oven really "
         "runs at, what it looks like when it is ready, what goes wrong, and what you changed the "
         "second time you cooked it. This kit is built around that.",
    s1="What is in your download",
    files=[("4 fillable kits", "Letter + A4 &middot; colour + ink-saving mono &middot; 9 pages each"),
           ("4 print kits", "the same pages without form fields"),
           ("Pages 2 and 3 are a pair", "the front and back of one recipe &mdash; print them many times"),
           ("This guide", "printing and filling in, on one page")],
    s2="Type on it",
    s2p="Open a file ending in <b>-fillable.pdf</b> in Adobe Acrobat Reader (free) or a tablet app "
        "and type. For each dish, <b>save a copy of pages 2 and 3 under the name of the recipe</b> "
        "&mdash; that is how the collection is built. Page 1 and page 7 are filled in once and "
        "kept at the front.",
    s3="Or print and write",
    s3p="The <b>-print.pdf</b> files are the same nine pages without fields. Print <b>pages 2 and 3 "
        "back to back</b> and you have a two-sided recipe sheet: the recipe on the front, and on "
        "the back the rest of the method, what you changed each time you cooked it, how it keeps "
        "and how to reheat it. Run off twenty of them and put them in a ring binder.",
    s4="Print it well",
    tips=["Paper: plain A4 or US Letter, 90&ndash;120 gsm &mdash; heavier if it lives in the kitchen",
          "Scale: <b>100% / Actual size</b> &mdash; never &ldquo;Fit to page&rdquo;",
          "Pages 2 + 3 double-sided, many times; pages 5 and 9 inside a cupboard door",
          "Saving ink? The <b>mono</b> kit is the same layout in graphite only"],
    s5="Start with page 1, and an oven thermometer",
    s5p="Domestic ovens are routinely fifteen or twenty degrees out and hotter at the back, which "
        "is behind most of the cakes that sink and the chicken done on one side. Put a thermometer "
        "on the middle shelf, set the dial to 180, wait twenty minutes and write down what it "
        "actually says. Then measure your pans. After that every recipe you keep in here can carry "
        "the real number and the real pan &mdash; which is what makes it repeatable by you, and by "
        "anybody else in the house.",
    license="Personal use only. Print as many copies as you like for your own kitchen. Please do "
            "not resell, share or redistribute the files, and please do not sell anything printed "
            "from them. Fonts: Vollkorn and Plus Jakarta Sans (SIL Open Font License).",
    mark="Nobody writes down the part that matters.",
)

PAGE_NAMES = ["This kitchen", "The recipe (front)", "The second time (back)", "Cook once, eat twice",
              "When it goes wrong", "Cooking for other people", "An index by need",
              "Someone else&#8217;s recipe", "The numbers you look up"]

def build_readme(work):
    R, S = READ_ME, SIZES["letter"]
    tpl = open(os.path.join(ROOT, "src", "readme.template.html"), encoding="utf-8").read()
    C = COLORWAYS["kitchen"]
    for a, b in [('"Bodoni Moda","Didot",Georgia,serif', '"Vollkorn",Georgia,serif'),
                 ('"Barlow Condensed","Arial Narrow",sans-serif', '"Plus Jakarta Sans",Arial,sans-serif'),
                 ('font-family:"IBM Plex Sans"', 'font-family:"Plus Jakarta Sans"'),
                 ("--s1:#f2a65a", "--s1:" + C["honey"]), ("--s2:#ee6c4d", "--s2:" + C["paprika"]),
                 ("--s3:#c43e7a", "--s3:" + C["teal"]), ("--s4:#4b2e83", "--s4:" + C["ink"]),
                 ("--ink:#23181f", "--ink:" + C["ink"]), ("--soft:#6e6068", "--soft:" + C["soft"]),
                 ("--faint:#9a8f94", "--faint:" + C["faint"]), ("--rule:#e3dcde", "--rule:" + C["rule"])]:
        tpl = tpl.replace(a, b)
    values = {
        "DOC_TITLE": R["doc"], "FONTS": B.google_fonts_css(True, GF_URL, "faces-recipe.css"),
        "PAGE_W": S["w"], "PAGE_H": S["h"], "PAD": ".55in .6in .5in",
        "L_BRAND": R["brand"], "L_TITLE": R["title"], "L_LEDE": R["lede"], "L_S1_H": R["s1"],
        "FILE_LIST": "".join(f"<div><b>{n}</b><span>{d}</span></div>" for n, d in R["files"]),
        "L_S2_H": R["s2"], "L_S2_P": R["s2p"], "L_S3_H": R["s3"], "L_S3_P": R["s3p"],
        "L_S4_H": R["s4"], "PRINT_TIPS": "".join(f"<li>{t}</li>" for t in R["tips"]),
        "L_S5_H": R["s5"], "L_S5_P": R["s5p"], "L_LICENSE": R["license"], "L_MARK": R["mark"],
    }
    for k, v in values.items():
        tpl = tpl.replace("{{" + k + "}}", v)
    hp = os.path.join(work, "readme-recipe.html")
    open(hp, "w", encoding="utf-8").write(tpl)
    B.to_pdf(hp, os.path.join(DIST, "00-START-HERE.pdf"))
    print("  start-here sheet")

def build_mockups(work):
    import pymupdf
    tpl = open(os.path.join(ROOT, "src", "mockup.template.html"), encoding="utf-8").read()
    fonts = B.google_fonts_css(True, GF_URL, "faces-recipe.css")
    doc = pymupdf.open(os.path.join(DIST, "recipe-planner-letter-kitchen-print.pdf"))
    imgs = []
    for i, page in enumerate(doc):
        f = os.path.join(work, f"recipe-page-{i+1}.png")
        page.get_pixmap(dpi=110).save(f)
        imgs.append("data:image/png;base64," + base64.b64encode(open(f, "rb").read()).decode())

    C = COLORWAYS["kitchen"]
    over = (
        "<style>"
        "h1{font-family:'Vollkorn',Georgia,serif;font-weight:700;line-height:.98;"
        "letter-spacing:-.01em}"
        f"h1 em{{font-style:italic;color:{C['paprika']}}}"
        "body{font-family:'Plus Jakarta Sans',Arial,sans-serif}"
        f"body{{color:{C['ink']}}} .sub{{color:{C['soft']}}}"
        f".eyebrow{{color:{C['teal']};font-family:'Plus Jakarta Sans';font-weight:600;"
        "letter-spacing:.18em}"
        f".rule{{background:{C['teal']};height:4px;width:230px}}"
        f".badge{{border-color:{C['ink']};color:{C['ink']};font-family:'Plus Jakarta Sans';"
        "font-weight:600;letter-spacing:.02em;text-transform:none}"
        ".tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 40px;flex:1;"
        "align-content:center;justify-items:center}"
        ".tiles > div{min-width:0;display:flex;flex-direction:column;align-items:center}"
        ".tile{background:#fff;box-shadow:0 14px 34px rgba(31,29,27,.17)}"
        ".tile img{height:472px;width:auto;display:block}"
        f".tilecap{{font-family:'Plus Jakarta Sans',Arial,sans-serif;font-weight:600;font-size:20px;"
        f"color:{C['soft']};padding:11px 2px 0;text-transform:none;letter-spacing:0}}"
        "</style>")

    tiles = "".join(f'<div><div class="tile"><img src="{im}"></div>'
                    f'<div class="tilecap">{n}</div></div>' for im, n in zip(imgs, PAGE_NAMES))

    hero = f'''
      <div class="split">
        <div class="txt">
          <span class="eyebrow">Nine pages &middot; fillable PDF</span>
          <h1>Nobody writes<br>down the part<br><em>that matters.</em></h1>
          <span class="rule"></span>
          <p class="sub">A recipe sheet with the things a recipe card always leaves out: which pan,
          what your oven really runs at, what it looks like when it is ready, what goes wrong
          &mdash; and, on the back, what you changed the second time you cooked it.</p>
          <div class="badges" style="margin-top:40px"><span class="badge">9 pages</span>
          <span class="badge">Two-sided recipe sheet</span>
          <span class="badge">Letter + A4</span></div>
        </div>
        <img src="{imgs[1]}">
      </div>'''
    pages = f'''
      <span class="eyebrow">Every page in the kit</span>
      <h1>Nine pages, and<br>the sheet you print<br><em>over and over.</em></h1>
      <div class="tiles" style="margin-top:24px">{tiles}</div>'''
    detail = f'''
      <span class="eyebrow">Front and back, printed as a pair</span>
      <h1>The recipe.<br><em>The second time.</em></h1>
      <p class="sub">The front carries the dish, the scaling column, the pan, the real oven
      temperature and what to start first. The back carries the rest of the method and the part
      no card has: a dated line for each time you cooked it and what you changed, until the
      version you actually cook is written down.</p>
      <div class="shots" style="margin-top:30px;gap:60px">
        <img src="{imgs[1]}" style="height:1170px"><img src="{imgs[2]}" style="height:1170px"></div>'''

    for name, bg, pad, h1, content in [("01-hero", "#f0eeea", "100px", "84px", hero),
                                       ("02-pages", "#ffffff", "76px", "54px", pages),
                                       ("03-detail", "#eeece8", "100px", "80px", detail)]:
        page = tpl
        for k, v in {"FONTS": fonts, "BG": bg, "PAD": pad, "H1": h1,
                     "GAP": "0", "CONTENT": over + content}.items():
            page = page.replace("{{" + k + "}}", v)
        hp = os.path.join(work, f"mockup-recipe-{name}.html")
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
        BD.package(DIST, "Second-Time-Recipe-Kit")
        return

    combos = [(s, c) for s in SIZES for c in COLORWAYS]
    if args.only:
        combos = [tuple(args.only.split("-"))]

    print("Building recipe kit ->", DIST)
    for size, colorway in combos:
        build_variant(size, colorway, WORK, fillable=not args.no_fillable)

    open(os.path.join(ROOT, "recipe-planner.html"), "w", encoding="utf-8").write(
        render_html("letter", "kitchen", embed_fonts=False))
    print("Wrote recipe-planner.html (browser / preview copy)")

    build_readme(WORK)
    build_mockups(WORK)
    BD.package(DIST, "Second-Time-Recipe-Kit")


if __name__ == "__main__":
    main()
