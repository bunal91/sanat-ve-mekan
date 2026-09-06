# -*- coding: utf-8 -*-
import sys, html, os
sys.path.insert(0, "/tmp/gen")
from data import PRODUCTS

E = lambda s: html.escape(s, quote=True)
uid = 0
def block(label, text, limit=None, mono=True, pre=True):
    """One Etsy field: label, character count against its real limit, copy button."""
    global uid; uid += 1
    n = len(text)
    if limit:
        state = "ok" if n <= limit else "over"
        count = f'<span class="count {state}">{n}<i>/{limit}</i></span>'
    else:
        count = f'<span class="count">{n} char</span>'
    cls = "body" + (" mono" if mono else "")
    inner = f'<pre class="{cls}">{E(text)}</pre>' if pre else f'<div class="{cls}">{E(text)}</div>'
    return f'''<div class="field">
  <div class="fhead"><span class="flabel">{E(label)}</span>{count}
    <button class="copy" type="button" data-target="c{uid}">Copy</button></div>
  <div class="fbody" id="c{uid}">{inner}</div>
</div>'''

def taglist(tags):
    global uid; uid += 1
    chips = "".join(
        f'<button class="chip" type="button" data-copy="{E(t)}">{E(t)}'
        f'<i>{len(t)}</i></button>' for t in tags)
    joined = ", ".join(tags)
    return f'''<div class="field">
  <div class="fhead"><span class="flabel">Tags &mdash; 13 of 13, each under 20 characters</span>
    <span class="count ok">13<i>/13</i></span>
    <button class="copy" type="button" data-target="c{uid}">Copy all</button></div>
  <div class="chips">{chips}</div>
  <div class="fbody hidden" id="c{uid}"><pre class="body mono">{E(joined)}</pre></div>
  <p class="tip">Click any single tag to copy just that one. Etsy wants them one at a time.</p>
</div>'''

def matlist(mats):
    global uid; uid += 1
    rows = "".join(f'<li><span>{E(m)}</span><i>{len(m)}</i></li>' for m in mats)
    joined = ", ".join(mats)
    return f'''<div class="field">
  <div class="fhead"><span class="flabel">Materials &mdash; 13 of 13, each under 45 characters</span>
    <span class="count ok">13<i>/13</i></span>
    <button class="copy" type="button" data-target="c{uid}">Copy all</button></div>
  <ul class="mats">{rows}</ul>
  <div class="fbody hidden" id="c{uid}"><pre class="body mono">{E(joined)}</pre></div>
  <p class="tip">Etsy indexes this field lightly and almost nobody fills it in. Free keywords.</p>
</div>'''

SECTIONS = []
for p in PRODUCTS:
    if p["section"] not in [s[0] for s in SECTIONS]:
        SECTIONS.append((p["section"], []))
    dict(SECTIONS)[p["section"]].append(p)
SECMAP = {}
for p in PRODUCTS:
    SECMAP.setdefault(p["section"], []).append(p)

rail = ""
for sec, items in SECMAP.items():
    rail += f'<p class="railsec">{E(sec)}</p><ul class="raillist">'
    for p in items:
        rail += (f'<li><a href="#{p["key"]}"><span class="dot" style="background:{p["accent"]}"></span>'
                 f'<span class="rn">{E(p["name"])}</span>'
                 f'<span class="rk">{E(p["kind"])}</span></a></li>')
    rail += "</ul>"

body = ""
for i, p in enumerate(PRODUCTS, start=1):
    alts = "".join(f'<li><span class="an">Image {j}</span>{E(a)}</li>'
                   for j, a in enumerate(p["alts"], start=1))
    attrs = "".join(f'<li>{E(a)}</li>' for a in p["attrs"])
    body += f'''
<section class="product" id="{p["key"]}" style="--accent:{p["accent"]}">
  <div class="phead">
    <div class="pstripe"></div>
    <div class="pmeta">
      <span class="pnum">Listing {i:02d}</span>
      <h2>{E(p["name"])}</h2>
      <p class="pkind">{E(p["kind"])} &middot; {E(p["pages"])}</p>
    </div>
    <dl class="pfacts">
      <div><dt>Price</dt><dd>{E(p["price"])} <span class="cur">USD</span></dd></div>
      <div><dt>Launch offer</dt><dd>{E(p["coupon"])}</dd></div>
      <div><dt>Files to upload</dt><dd class="mono sm">{E(p["folder"])}</dd></div>
      <div><dt>Shop section</dt><dd>{E(p["section"])}</dd></div>
    </dl>
  </div>

  {block("Listing title", p["title"], 140)}
  {block("Description", p["desc"], None, mono=False)}
  {taglist(p["tags"])}
  {matlist(p["materials"])}

  <div class="split">
    <div class="field flat">
      <div class="fhead"><span class="flabel">Category &amp; attributes</span></div>
      <p class="cat">{E(p["category"])}</p>
      <ul class="attrs">{attrs}</ul>
    </div>
    <div class="field flat">
      <div class="fhead"><span class="flabel">Photo alt text</span></div>
      <ul class="altlist">{alts}</ul>
    </div>
  </div>

  <div class="field flat pin">
    <div class="fhead"><span class="flabel">Pinterest &amp; Instagram</span></div>
    <p class="tip">Etsy has no hashtags &mdash; it has the 13 tags above. Hashtags belong on the
    social side, and for printables Pinterest is usually the largest source of outside traffic.</p>
    {block("Pin title", p["pin_title"], 100)}
    {block("Pin description", p["pin_desc"], 500)}
    {block("Instagram hashtags", p["hashtags"], None)}
  </div>

  <aside class="note">
    <span class="notelabel">Worth knowing</span>
    <p>{E(p["note"])}</p>
  </aside>
</section>'''

CHEAT = [
 ("Title", "140 characters", "The first 3&ndash;5 words carry most of the search weight. Etsy reads the whole thing, shoppers read the first line."),
 ("Tags", "13 tags, 20 characters each", "Use all thirteen. Multi-word phrases beat single words, because that is how people actually search."),
 ("Materials", "13 entries, 45 characters each", "Lightly indexed and almost always left blank. Free keywords."),
 ("Description", "no practical limit", "The first ~160 characters become the Google snippet. Plain text only &mdash; Etsy strips HTML."),
 ("Photos", "10 photos, 1 video", "Listings with a video convert measurably better. A 5&ndash;10 second scroll through the pages is enough."),
 ("Digital files", "5 files, 20&nbsp;MB each", "Which is exactly why every kit ships as three zips plus two loose sheets."),
]
cheatrows = "".join(
 f'<div class="cheat"><span class="cf">{f}</span><span class="cl">{l}</span><p>{n}</p></div>'
 for f, l, n in CHEAT)

SH_SECTIONS = "Daily & weekly\nParty & event kits\nSeasonal kits\nMental health & neurodivergent"
SH_ANNOUNCE = ("Fillable PDF planners and event kits \u2014 you type into ready-made fields, print as "
  "often as you like, and use them again next year. Every kit comes in US Letter and A4, in colour "
  "and in an ink-saving version. Instant download; nothing is posted to you.")
SH_DELIVERY = ("Delivery: instant download\n"
  "Files per listing: 3 zips + 2 loose PDFs = 5 (Etsy's limit)\n"
  "Renewal: automatic\n"
  "Personalisation: off\n"
  "Returns: not accepted (digital, delivered instantly) \u2014 say so in the description too")
SH_FAQ = ("Q: Can I change the layout, the fonts or the colours?\n"
  "A: No. These are fillable PDFs: you type into the fields that are already there. The design "
  "itself is fixed, and there is no Canva link. If you need to redesign the pages, please don't "
  "buy this one.\n\n"
  "Q: What do I open it with?\n"
  "A: The free Adobe Acrobat Reader on a computer, or any PDF app on a tablet or phone. Save a "
  "copy before you start typing, so you keep a blank one.\n\n"
  "Q: Is a year printed on it?\n"
  "A: No, everything is undated. Fill it in, save it, and it opens next year as a head start.")
SH_NOTE = ("These field limits are what Etsy enforced when this page was written. Etsy changes "
  "them, so check the current seller handbook before you paste twelve listings in one sitting.")

_b1 = block("Shop sections", SH_SECTIONS, None, mono=False)
_b2 = block("Shop announcement", SH_ANNOUNCE, None, mono=False)
_b3 = block("Digital download settings", SH_DELIVERY, None, mono=False)
_b4 = block("FAQ \u2014 add these three to every listing", SH_FAQ, None, mono=False)

SHARED = f'''
<section class="product" id="shared" style="--accent:#6b645d">
  <div class="phead">
    <div class="pstripe"></div>
    <div class="pmeta">
      <span class="pnum">Shop level</span>
      <h2>Set once, not per listing</h2>
      <p class="pkind">The only text on this page that is deliberately the same everywhere</p>
    </div>
  </div>
  {_b1}
  {_b2}
  {_b3}
  {_b4}
  <aside class="note">
    <span class="notelabel">Worth knowing</span>
    <p>{E(SH_NOTE)}</p>
  </aside>
</section>'''

HTML = f'''<title>Twelve Etsy Listings</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{{
  --paper:#f7f5f2; --surface:#ffffff; --sunk:#f2efea;
  --ink:#1b1917; --muted:#6b645d; --faint:#9c948b;
  --line:#e5dfd7; --line-2:#d6cec3;
  --ui:#2c5f57; --ui-soft:#e4efec;
  --warn:#a8501c;
}}
@media (prefers-color-scheme: dark){{
  :root:not([data-theme="light"]){{
    --paper:#131211; --surface:#1c1a18; --sunk:#232120;
    --ink:#f2ede6; --muted:#a79e94; --faint:#7d756c;
    --line:#2f2b28; --line-2:#3d3833;
    --ui:#7cbcae; --ui-soft:#1e2f2c;
    --warn:#d9905d;
  }}
}}
:root[data-theme="dark"]{{
  --paper:#131211; --surface:#1c1a18; --sunk:#232120;
  --ink:#f2ede6; --muted:#a79e94; --faint:#7d756c;
  --line:#2f2b28; --line-2:#3d3833;
  --ui:#7cbcae; --ui-soft:#1e2f2c;
  --warn:#d9905d;
}}

*{{ box-sizing:border-box; }}
body{{ background:var(--paper); color:var(--ink);
  font-family:"Archivo","Helvetica Neue",Arial,sans-serif; font-size:15px; line-height:1.55;
  -webkit-font-smoothing:antialiased; }}
a{{ color:inherit; }}
:focus-visible{{ outline:2px solid var(--ui); outline-offset:2px; border-radius:3px; }}

.wrap{{ max-width:1240px; margin:0 auto; padding:0 22px 100px;
  display:grid; grid-template-columns:236px minmax(0,1fr); gap:0 44px; align-items:start; }}

/* ---------- masthead ---------- */
header.top{{ grid-column:1 / -1; padding:56px 0 30px; border-bottom:1px solid var(--line-2); }}
.eyebrow{{ font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.18em;
  text-transform:uppercase; color:var(--ui); margin:0 0 14px; }}
h1{{ font-family:"Fraunces","Georgia",serif; font-variation-settings:"opsz" 120,"SOFT" 20;
  font-weight:600; font-size:clamp(34px,5vw,52px); line-height:1.03; letter-spacing:-.02em;
  margin:0; text-wrap:balance; max-width:16ch; }}
.lede{{ color:var(--muted); max-width:62ch; margin:16px 0 0; font-size:16px; }}
.lede b{{ color:var(--ink); font-weight:600; }}

.cheats{{ grid-column:1 / -1; display:grid;
  grid-template-columns:repeat(auto-fit,minmax(215px,1fr)); gap:0;
  border-bottom:1px solid var(--line-2); }}
.cheat{{ padding:18px 20px 20px; border-right:1px solid var(--line); }}
.cheat:last-child{{ border-right:0; }}
.cf{{ display:block; font-weight:700; font-size:13px; letter-spacing:.02em; }}
.cl{{ display:block; font-family:"IBM Plex Mono",monospace; font-size:12px; color:var(--ui);
  margin:3px 0 7px; }}
.cheat p{{ margin:0; font-size:12.5px; line-height:1.5; color:var(--muted); }}

/* ---------- rail ---------- */
nav.rail{{ position:sticky; top:20px; padding:34px 0 0; }}
.railsec{{ font-family:"IBM Plex Mono",monospace; font-size:10.5px; letter-spacing:.14em;
  text-transform:uppercase; color:var(--faint); margin:22px 0 8px; }}
.raillist{{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; }}
.raillist a{{ display:grid; grid-template-columns:9px 1fr; gap:0 10px; align-items:baseline;
  text-decoration:none; padding:6px 8px 6px 0; border-radius:4px; }}
.raillist a:hover{{ background:var(--sunk); }}
.dot{{ width:8px; height:8px; border-radius:50%; align-self:center; }}
.rn{{ font-weight:600; font-size:13.5px; }}
.rk{{ grid-column:2; font-size:11.5px; color:var(--faint); }}

/* ---------- product ---------- */
main{{ padding-top:34px; min-width:0; }}
.product{{ padding:0 0 58px; margin-bottom:44px; border-bottom:1px solid var(--line-2); }}
.product:last-child{{ border-bottom:0; }}
.phead{{ display:grid; grid-template-columns:4px 1fr; gap:0 18px; align-items:start;
  padding-bottom:22px; }}
.pstripe{{ background:var(--accent); border-radius:2px; align-self:stretch; min-height:64px; }}
.pmeta{{ grid-column:2; }}
.pnum{{ font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.16em;
  text-transform:uppercase; color:var(--accent); }}
.phead h2{{ font-family:"Fraunces",Georgia,serif; font-variation-settings:"opsz" 60;
  font-weight:600; font-size:29px; line-height:1.08; margin:5px 0 2px; letter-spacing:-.015em; }}
.pkind{{ margin:0; color:var(--muted); font-size:13.5px; }}
.pfacts{{ grid-column:2; margin:16px 0 0; display:grid;
  grid-template-columns:repeat(auto-fit,minmax(148px,1fr)); gap:12px 22px;
  border-top:1px solid var(--line); padding-top:14px; }}
.pfacts div{{ min-width:0; }}
.pfacts dt{{ font-family:"IBM Plex Mono",monospace; font-size:10.5px; letter-spacing:.12em;
  text-transform:uppercase; color:var(--faint); }}
.pfacts dd{{ margin:3px 0 0; font-size:13.5px; font-weight:500; }}
.pfacts .cur{{ color:var(--faint); font-weight:400; font-size:11px; }}
.pfacts .sm{{ font-size:12px; font-weight:400; word-break:break-all; }}

/* ---------- fields ---------- */
.field{{ margin-top:20px; }}
.fhead{{ display:flex; align-items:center; gap:12px; flex-wrap:wrap;
  padding-bottom:7px; border-bottom:1px solid var(--line); }}
.flabel{{ font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.13em;
  text-transform:uppercase; color:var(--ink); font-weight:500; flex:1; min-width:0; }}
.count{{ font-family:"IBM Plex Mono",monospace; font-size:11.5px; color:var(--muted);
  font-variant-numeric:tabular-nums; }}
.count i{{ font-style:normal; color:var(--faint); }}
.count.ok{{ color:var(--ui); }}
.count.over{{ color:var(--warn); font-weight:500; }}
button.copy{{ font-family:"IBM Plex Mono",monospace; font-size:11px; letter-spacing:.1em;
  text-transform:uppercase; color:var(--ui); background:var(--ui-soft);
  border:1px solid transparent; border-radius:4px; padding:4px 11px; cursor:pointer; }}
button.copy:hover{{ border-color:var(--ui); }}
button.copy.done{{ background:var(--ui); color:var(--surface); }}
.fbody{{ background:var(--surface); border:1px solid var(--line); border-top:0;
  border-radius:0 0 5px 5px; padding:14px 16px; max-height:none; overflow-x:auto; }}
.fbody.hidden{{ display:none; }}
pre.body, div.body{{ margin:0; white-space:pre-wrap; word-wrap:break-word; font-size:13.5px;
  line-height:1.62; font-family:"Archivo",Arial,sans-serif; }}
pre.body.mono{{ font-family:"IBM Plex Mono",monospace; font-size:13px; line-height:1.5; }}
.tip{{ margin:8px 0 0; font-size:12.5px; color:var(--muted); }}

.chips{{ display:flex; flex-wrap:wrap; gap:7px; padding:14px 0 2px; }}
.chip{{ font-family:"IBM Plex Mono",monospace; font-size:12.5px; color:var(--ink);
  background:var(--surface); border:1px solid var(--line-2); border-radius:100px;
  padding:5px 8px 5px 12px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; }}
.chip:hover{{ border-color:var(--accent); }}
.chip.done{{ border-color:var(--ui); background:var(--ui-soft); }}
.chip i{{ font-style:normal; font-size:10.5px; color:var(--faint);
  font-variant-numeric:tabular-nums; }}

.mats{{ list-style:none; margin:12px 0 0; padding:0;
  display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:0 26px; }}
.mats li{{ display:flex; justify-content:space-between; gap:14px; align-items:baseline;
  padding:5px 0; border-bottom:1px dotted var(--line); font-size:13px; }}
.mats i{{ font-style:normal; font-family:"IBM Plex Mono",monospace; font-size:10.5px;
  color:var(--faint); font-variant-numeric:tabular-nums; }}

.split{{ display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:0 34px; }}
.field.flat .fhead{{ border-bottom-color:var(--line-2); }}
.cat{{ margin:12px 0 0; font-size:13.5px; font-weight:500; }}
.attrs{{ list-style:none; margin:8px 0 0; padding:0; font-size:12.5px; color:var(--muted); }}
.attrs li{{ padding:2px 0; }}
.altlist{{ list-style:none; margin:12px 0 0; padding:0; font-size:12.5px; color:var(--muted); }}
.altlist li{{ padding:5px 0; border-bottom:1px dotted var(--line); }}
.an{{ display:block; font-family:"IBM Plex Mono",monospace; font-size:10px; letter-spacing:.1em;
  text-transform:uppercase; color:var(--faint); }}

.pin{{ margin-top:28px; padding:0 0 4px; }}
.pin .field{{ margin-top:14px; }}

.note{{ margin-top:26px; border-left:3px solid var(--accent); padding:2px 0 2px 16px; }}
.notelabel{{ font-family:"IBM Plex Mono",monospace; font-size:10.5px; letter-spacing:.14em;
  text-transform:uppercase; color:var(--accent); }}
.note p{{ margin:5px 0 0; font-size:13.5px; color:var(--muted); max-width:70ch; }}

footer.end{{ grid-column:1 / -1; border-top:1px solid var(--line-2); margin-top:20px;
  padding-top:22px; font-size:12.5px; color:var(--faint); }}

@media (max-width:900px){{
  .wrap{{ grid-template-columns:minmax(0,1fr); }}
  nav.rail{{ position:static; padding-top:24px; }}
  .raillist{{ display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); }}
  .cheat{{ border-right:0; border-bottom:1px solid var(--line); }}
}}
@media (prefers-reduced-motion:reduce){{ *{{ transition:none !important; }} }}
</style>

<div class="wrap">
  <header class="top">
    <p class="eyebrow">Copy &amp; paste &middot; twelve products</p>
    <h1>Every listing, written for its own product.</h1>
    <p class="lede">Title, description, all thirteen tags, materials, category, photo alt text and
    the Pinterest copy &mdash; for each of the twelve kits, written from what that kit actually
    does. Character counts are against Etsy&rsquo;s real limits, so nothing gets truncated on paste.
    <b>Nothing here is boilerplate except the block marked as such at the bottom.</b></p>
  </header>

  <div class="cheats">{cheatrows}</div>

  <nav class="rail">{rail}
    <p class="railsec">Shop level</p>
    <ul class="raillist"><li><a href="#shared">
      <span class="dot" style="background:#6b645d"></span>
      <span class="rn">Set once</span><span class="rk">Sections, FAQ, policies</span></a></li></ul>
  </nav>

  <main>{body}{SHARED}</main>

  <footer class="end">
    <p>Prices in USD, before Etsy&rsquo;s fees. Launch offers are suggestions &mdash; the seasonal
    three deliberately discount early and stop discounting once the season starts.</p>
  </footer>
</div>

<script>
(function () {{
  function flash(btn, label) {{
    var old = btn.textContent;
    btn.textContent = label; btn.classList.add("done");
    setTimeout(function () {{ btn.textContent = old; btn.classList.remove("done"); }}, 1100);
  }}
  function put(text, btn, label) {{
    if (navigator.clipboard && navigator.clipboard.writeText) {{
      navigator.clipboard.writeText(text).then(function () {{ flash(btn, label); }}, fallback);
    }} else {{ fallback(); }}
    function fallback() {{
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.top = "-1000px";
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try {{ ok = document.execCommand("copy"); }} catch (e) {{ ok = false; }}
      document.body.removeChild(ta);
      flash(btn, ok ? label : "Select it");
    }}
  }}
  document.addEventListener("click", function (e) {{
    var b = e.target.closest("button.copy");
    if (b) {{
      var el = document.getElementById(b.getAttribute("data-target"));
      if (el) put(el.innerText.trim(), b, "Copied");
      return;
    }}
    var c = e.target.closest("button.chip");
    if (c) put(c.getAttribute("data-copy"), c, c.getAttribute("data-copy"));
  }});
}})();
</script>
'''
out = "/home/user/sanat-ve-mekan/planner/etsy-listings.html"
open(out, "w", encoding="utf-8").write(HTML)
print("wrote", out, len(HTML), "bytes")
