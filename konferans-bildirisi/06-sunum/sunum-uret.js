const pptxgen = require("pptxgenjs");
const G = "/home/user/sanat-ve-mekan/konferans-bildirisi/03-gorseller/";
const OUT = "/tmp/claude-0/-home-user-sanat-ve-mekan/083887b3-c080-5d69-a4cb-b10c492fdc94/scratchpad/deck/ICSMMEP26_Presentation_Unal.pptx";
const F = "Calibri";
const K = { ink:"141414", body:"3C3C3C", grey:"8C8C8C", faint:"BDBDBD", line:"E4E4E4",
            panel:"F7F6F4", acc:"B4513A", dark:"141414", onD:"FFFFFF", onDg:"9E9E9E", onDf:"5A5A5A" };
const THEME = { name:"Eggshell Mono", headFontFace:F, bodyFontFace:F, colors:{
  dk1:K.ink, lt1:"FFFFFF", dk2:K.dark, lt2:K.panel, accent1:K.acc, accent2:K.grey,
  accent3:K.body, accent4:K.ink, accent5:K.line, accent6:K.grey, hlink:K.acc, folHlink:K.grey } };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace:F, bodyFontFace:F };
pres.author = "Betul Unal";
pres.title = "Eggshell-Agar Biocomposites for Sustainable Interior Applications";

const sn = (c) => ({ placeholder:{ options:{ name:"slideNumber", type:"sldNum",
  x:12.35, y:6.95, w:0.4, h:0.26, fontSize:8.5, color:c, align:"right", fontFace:F } } });
pres.defineSlideMaster({ title:"FULL",  background:{ color:K.dark }, objects:[] });
pres.defineSlideMaster({ title:"PAGE",  background:{ color:"FFFFFF" }, objects:[ sn(K.faint) ] });
pres.defineSlideMaster({ title:"DARK",  background:{ color:K.dark },   objects:[ sn(K.onDf) ] });

const S = (o={}) => Object.assign({ isTextBox:true, margin:0, fontFace:F }, o);

/* ---- type scale: exactly three levels ----
   H1  20 bold   slide title, always same size, always same place
   H2  13 bold   every sub-heading on every slide, no exceptions
   body 12       prose; emphasis by weight and italic only
   10.5 tables · 9 footnotes · large numerals are data display, not headings */
const H1 = (s,t,d) => s.addText(t, S({ x:0.8, y:0.55, w:11.7, h:0.5, fontSize:20, bold:true,
  color:d?K.onD:K.ink, valign:"middle" }));
const H2 = (s,x,y,w,t,d) => s.addText(t, S({ x,y,w, h:0.3, fontSize:13, bold:true,
  color:d?K.onD:K.ink, valign:"middle" }));
const txt = (s,x,y,w,h,t,d,sz) => s.addText(t, S({ x,y,w,h, fontSize:sz||12,
  color:d?K.onD:K.body, valign:"top", lineSpacing:(sz||12)+6 }));
const em = (s,x,y,w,h,t,d,it) => s.addText(t, S({ x,y,w,h, fontSize:12, bold:true, italic:!!it,
  color:d?K.onD:K.ink, valign:"top", lineSpacing:18 }));
const dim = (s,x,y,w,h,t,d,sz) => s.addText(t, S({ x,y,w,h, fontSize:sz||10.5,
  color:d?K.onDg:K.grey, valign:"top", lineSpacing:(sz||10.5)+5 }));
const micro = (s,x,y,w,t,d) => s.addText(t, S({ x,y,w, h:0.5, fontSize:9,
  color:d?"8E8E8E":K.faint, valign:"top", lineSpacing:12.5 }));
const fig = (s,x,y,w,v,l,d,sz) => {
  s.addText(v, S({ x,y,w, h:(sz||32)/48, fontSize:sz||32, bold:true, color:K.acc, valign:"bottom" }));
  s.addText(l, S({ x, y:y+(sz||32)/48+0.04, w, h:0.46, fontSize:9.5, color:d?K.onDg:K.grey, valign:"top", lineSpacing:12.5 })); };
const list = (s,x,y,w,h,items,d,sz) => s.addText(
  items.map((t,i)=>({ text:t, options:{ bullet:{ characterCode:"2013" }, breakLine:i<items.length-1 } })),
  S({ x,y,w,h, fontSize:sz||12, color:d?K.onD:K.body, valign:"top", paraSpaceAfter:6, lineSpacing:(sz||12)+5 }));
const TH = (t) => ({ text:t, options:{ bold:true, color:K.ink, fill:{ color:K.panel }, align:"center", valign:"middle", fontSize:10.5, fontFace:F } });
const TD = (t,o={}) => ({ text:t, options:Object.assign({ align:"center", valign:"middle", color:K.body, fontSize:10.5, fontFace:F }, o) });
const TL = (t,o={}) => TD(t, Object.assign({ align:"left" }, o));
const ACC = { bold:true, color:K.acc };
const tbl = (s,rows,opt) => s.addTable(rows, Object.assign({ rowH:0.36, fontSize:10.5, fontFace:F,
  border:{ type:"solid", color:K.line, pt:1 }, fill:{ color:"FFFFFF" } }, opt));
const rule = (s,x,y,w,d) => s.addShape(pres.ShapeType.rect, { x,y,w, h:0.01,
  fill:{ color:d?K.onDf:K.line }, line:{ color:d?K.onDf:K.line, transparency:100 }, objectName:"ru"+x+y });
const vrule = (s,x,y,h,d) => s.addShape(pres.ShapeType.rect, { x,y, w:0.015, h,
  fill:{ color:d?K.onDf:K.line }, line:{ color:d?K.onDf:K.line, transparency:100 }, objectName:"vr"+x+y });
function band(s, t, sub) {
  s.addShape(pres.ShapeType.rect, { x:0, y:6.05, w:13.33, h:1.45,
    fill:{ color:K.dark, transparency:6 }, line:{ color:K.dark, transparency:100 }, objectName:"bd" });
  s.addText(t, S({ x:0.8, y:6.28, w:11.7, h:0.4, fontSize:20, bold:true, color:K.onD }));
  if (sub) s.addText(sub, S({ x:0.8, y:6.74, w:11.7, h:0.3, fontSize:10.5, color:"CFCFCF" }));
}
/* numbered item: numeral, heading, body — used on gap, aim, questions, further work */
function item(s, n, y, h, b, d, hx, hw, bx, bw) {
  s.addText(n, S({ x:0.8, y:y+0.05, w:0.6, h:0.3, fontSize:12, bold:true, color:K.acc }));
  s.addText(h, S({ x:hx||1.55, y, w:hw||4.1, h:0.62, fontSize:13, bold:true,
    color:d?K.onD:K.ink, lineSpacing:18 }));
  if (b) s.addText(b, S({ x:bx||5.95, y:y+0.02, w:bw||6.55, h:0.8, fontSize:12,
    color:d?K.onDg:K.body, lineSpacing:17 }));
}
/* ---- schematic helpers ---- */
/* a labelled node box in a flow diagram */
const node = (s,x,y,w,h,txt,kind) => {
  const fill = kind==="acc"?K.acc : kind==="dark"?K.dark : kind==="ghost"?"FFFFFF" : K.panel;
  const ln   = kind==="ghost"?K.faint : fill;
  s.addShape(pres.ShapeType.rect, { x,y,w,h, fill:{ color:fill },
    line:{ color:ln, width:1 }, objectName:"nd"+x+y });
  s.addText(txt, S({ x:x+0.12, y, w:w-0.24, h, fontSize:11, bold:true, lineSpacing:14,
    color:(kind==="acc"||kind==="dark")?K.onD:(kind==="ghost"?K.grey:K.ink),
    align:"center", valign:"middle" }));
};
/* a small arrow between nodes */
const arw = (s,x,y,w) => s.addShape(pres.ShapeType.rightArrow,
  { x, y, w:w||0.22, h:0.15, fill:{ color:K.faint },
    line:{ color:K.faint, transparency:100 }, objectName:"aw"+x+y });
/* a proportional stacked bar */
const stackbar = (s,x,y,w,h,parts) => {
  let cx = x;
  parts.forEach(([frac,col],i)=>{ const seg = w*frac;
    s.addShape(pres.ShapeType.rect, { x:cx, y, w:seg, h, fill:{ color:col },
      line:{ color:"FFFFFF", width:0.75 }, objectName:"sb"+x+y+i });
    cx += seg; });
};
/* legend swatch */
const swatch = (s,x,y,col,txt) => {
  s.addShape(pres.ShapeType.rect, { x, y:y+0.04, w:0.18, h:0.12, fill:{ color:col },
    line:{ color:col, transparency:100 }, objectName:"sw"+x+y });
  s.addText(txt, S({ x:x+0.26, y, w:1.3, h:0.2, fontSize:9.5, color:K.grey, valign:"middle" }));
};
let s;

/* ===================== 1 · cover ===================== */
pres.addSection({ title:"Opening" });
s = pres.addSlide({ masterName:"FULL", sectionTitle:"Opening" });
s.addImage({ path:G+"02-panel-elde.png", x:5.62, y:0, w:7.71, h:7.5, objectName:"cov" });
s.addShape(pres.ShapeType.rect, { x:0, y:0, w:5.9, h:7.5, fill:{ color:K.dark }, line:{ color:K.dark, transparency:100 }, objectName:"panel" });
s.addText("Eggshell–Agar\nBiocomposites", S({ x:0.85, y:2.2, w:4.6, h:1.6, fontSize:32, bold:true, color:K.onD, lineSpacing:42, valign:"bottom" }));
s.addText("Development and characterisation for sustainable interior applications",
  S({ x:0.85, y:3.95, w:4.4, h:0.7, fontSize:13, color:"C8C8C8", lineSpacing:19 }));
rule(s, 0.85, 4.95, 2.4, true);
s.addText([{ text:"Betül Ünal", options:{ bold:true, color:K.onD, fontSize:13, breakLine:true } },
           { text:"Department of Interior Architecture", options:{ color:K.onDg, fontSize:11, breakLine:true } },
           { text:"Cappadocia University", options:{ color:K.onDg, fontSize:11 } }],
  S({ x:0.85, y:5.2, w:4.4, h:1.0 }));
s.addText("ICSMMEP-26   ·   MECCA   ·   3–4 NOVEMBER 2026",
  S({ x:0.85, y:6.5, w:4.6, h:0.3, fontSize:9, bold:true, charSpacing:1.4, color:K.onDf }));
s.addNotes("Good morning. Betul Unal, Department of Interior Architecture, Cappadocia University. The panel in the photograph is the subject of this paper: a composite of waste eggshell bound in agar, cast at 300 by 300 millimetres. Over the next fifteen minutes I will set out the production protocol, the characterisation results, and an argument about how materials of this class should be evaluated.");

/* ===================== 2 · background ===================== */
pres.addSection({ title:"Introduction" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Introduction" });
H1(s, "Background");
H2(s, 0.8, 1.5, 4.6, "Material basis");
fig(s, 0.8, 2.1, 4.6, "94–97%", "calcium carbonate by mass");
fig(s, 0.8, 3.6, 4.6, "0.85–2.66", "specific gravity, below most mineral fillers");
micro(s, 0.8, 5.2, 4.6, "William & Owen (1995) · Torres et al. (2010) · Owuamanam & Cree (2020)");
vrule(s, 6.3, 1.5, 4.2);
H2(s, 6.9, 1.5, 5.6, "Two routes");
node(s, 6.9, 2.3, 5.6, 0.5, "Food processing");
s.addShape(pres.ShapeType.downArrow, { x:9.6, y:2.92, w:0.18, h:0.26,
  fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"d1" });
node(s, 6.9, 3.3, 5.6, 0.5, "Waste eggshell");
s.addShape(pres.ShapeType.downArrow, { x:8.1, y:3.92, w:0.18, h:0.26,
  fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"d2" });
s.addShape(pres.ShapeType.downArrow, { x:11.1, y:3.92, w:0.18, h:0.26,
  fill:{ color:K.acc }, line:{ color:K.acc, transparency:100 }, objectName:"d3" });
node(s, 6.9, 4.3, 2.6, 0.5, "Landfill", "ghost");
node(s, 9.9, 4.3, 2.6, 0.5, "Mineral resource", "acc");
em(s, 6.9, 5.3, 5.6, 1.2, "The case for eggshell as a mineral phase is settled. This paper is about the phase that binds it.", false, true);
s.addNotes("The point of departure. Eggshell arises continuously as a food-processing by-product and is predominantly landfilled. Chemically it is almost pure calcium carbonate, between ninety-four and ninety-seven percent by mass, held in a porous protein-bound crystalline structure, and its specific gravity sits below that of most mineral fillers used in construction. That composition and that uninterrupted supply are why a substantial literature already incorporates it into construction and polymer materials. All shell used in this study came from a single bakery, collected over more than a year. I want to be clear at the outset: the case for eggshell as a mineral phase is settled, and this paper does not re-make it. The paper is concerned with the phase that binds it.");

/* ===================== 3 · prior applications ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Introduction" });
H1(s, "Prior applications");
H2(s, 0.8, 1.42, 11.7, "Established uses of eggshell waste in engineered materials");
tbl(s, [
  [TH("Application"), TH("Binding phase"), TH("Reference")],
  [TL("Partial cement replacement in concrete"), TL("Portland clinker"), TL("Teara et al. (2019); Bhartiya & Dubey (2018)")],
  [TL("Compressed laterite brick"), TL("Soil – lime"), TL("Adogla et al. (2016)")],
  [TL("Hot-mix asphalt"), TL("Bitumen"), TL("Razzaq & Yousif (2017)")],
  [TL("Clay stabilisation"), TL("Clay mineral"), TL("Soundara & Vilasini (2015)")],
  [TL("Eco-ceramic wall tile"), TL("Ceramic body"), TL("Vilarinho et al. (2022)")],
  [TL("Particulate filler in PVC"), TL("Poly(vinyl chloride)"), TL("Skórczewska et al. (2020)")],
  [TL("Filler in flexible polyurethane foam"), TL("Polyurethane"), TL("Victor et al. (2019)")],
  [TL("Ceramic–metal composite"), TL("Metal matrix"), TL("Bilici et al. (2023); Yönetken et al. (2016)")],
  [TL("Bone tissue scaffold"), TL("Calcium phosphate"), TL("Shafiei et al. (2019)")],
  [TL("Wallpaper"), TL("Cellulosic furnish"), TL("Tutuş et al. (2018)")],
], { x:0.8, y:1.8, w:11.7, colW:[4.7,3.1,3.9], rowH:0.34 });
rule(s, 0.8, 5.72, 11.7);
em(s, 0.8, 5.88, 11.2, 0.4, "The burden is carried by the binder, and the binder is left untouched.");
s.addShape(pres.ShapeType.rect, { x:0.8, y:6.15, w:11.7, h:0.38, fill:{ color:K.acc },
  line:{ color:K.acc, transparency:100 }, objectName:"ph1" });
s.addText("MINERAL PHASE   ·   recovered from waste",
  S({ x:1.0, y:6.15, w:11.3, h:0.38, fontSize:11, bold:true, charSpacing:0.4, color:K.onD, valign:"middle" }));
s.addShape(pres.ShapeType.rect, { x:0.8, y:6.53, w:11.7, h:0.38, fill:{ color:K.dark },
  line:{ color:K.dark, transparency:100 }, objectName:"ph2" });
s.addText("BINDING PHASE   ·   cementitious, ceramic or petrochemical",
  S({ x:1.0, y:6.53, w:11.3, h:0.38, fontSize:11, bold:true, charSpacing:0.4, color:K.onD, valign:"middle" }));
s.addNotes("This is the literature the study departs from, and reading down the middle column is the whole argument. Eggshell has been used as a partial cement replacement in concrete, as a stabiliser in compressed laterite brick and in clay, as a filler in hot-mix asphalt, in eco-ceramic wall tile, as a particulate filler in PVC and in flexible polyurethane foam, in ceramic-metal composites, in bone scaffolds, and even in wallpaper. The valorisation is real and it is well evidenced. But in every one of those cases the mineral is recovered from waste while the binding phase remains cementitious, ceramic or petrochemical. The environmental burden of the material is carried by the binder, and the binder is untouched.");

/* ===================== 5 · research gap ===================== */
s = pres.addSlide({ masterName:"DARK", sectionTitle:"Introduction" });
H1(s, "Research gap", true);
H2(s, 0.8, 1.45, 11.7, "Three gaps follow from the preceding two slides", true);
rule(s, 0.8, 1.9, 11.7, true);
[["01","The binding phase is never biological",
      "No study reports an eggshell composite in which both phases are of biological origin."],
 ["02","Agar is characterised only as an unfilled film",
      "Never as the binder of a mineral-filled solid in bending."],
 ["03","Property sets are reported in fragments",
      "Property data is scattered across separate studies on separate formulations."]]
 .forEach(([n,h,b],i)=>{ const y = 2.3 + i*1.45;
  item(s, n, y, h, b, true, 1.55, 5.0, 6.9, 5.6);
  if (i<2) rule(s, 0.8, y+1.15, 11.7, true); });
em(s, 0.8, 6.65, 11.2, 0.5,
  "This is not a novel constituent. It is a documented protocol and a single coherent property set.", true, true);
s.addNotes("Three gaps follow directly from those two slides. First, the binding phase is never biological. Across the whole eggshell literature the mineral is recovered from waste while the matrix stays Portland clinker, bitumen, lime, a ceramic body or a thermoplastic - no study reports an eggshell composite in which both phases are biological and fully biodegradable. Second, agar is characterised only as an unfilled film in tension for packaging, not as the binder of a highly mineral-filled cast solid in bending. Third, property sets are reported in fragments: compressive, flexural, fire and hygric behaviour appear in separate studies on separate formulations, and no single study gives all four for one formulation family. I want to state the contribution precisely, because overclaiming here would be easy. It is not a novel constituent. It is a documented protocol and a single coherent property set.");

/* ===================== 6 · aim ===================== */
pres.addSection({ title:"Framework" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Framework" });
H1(s, "Aim");
s.addShape(pres.ShapeType.rect, { x:0.8, y:1.45, w:11.7, h:1.15, fill:{ color:K.panel },
  line:{ color:K.panel, transparency:100 }, objectName:"aimp" });
s.addText([{ text:"To document a reproducible production protocol for a fully bio-based eggshell–agar composite, and to characterise it against published test standards.",
             options:{ bold:true, color:K.ink } }],
  S({ x:1.15, y:1.72, w:11.0, h:0.7, fontSize:13, lineSpacing:19 }));
H2(s, 0.8, 3.2, 11.7, "Objectives");
rule(s, 0.8, 3.6, 11.7);
[["01","Document the protocol"],
 ["02","Characterise to standards"],
 ["03","Position against two families"],
 ["04","Derive an evaluation criterion"]]
 .forEach(([n,h],i)=>{ const x = 0.8 + i*2.95;
  s.addText(n, S({ x, y:3.85, w:2.7, h:0.3, fontSize:12, bold:true, color:K.acc }));
  s.addText(h, S({ x, y:4.2, w:2.6, h:0.8, fontSize:13, bold:true,
    color:i===3?K.acc:K.ink, lineSpacing:21 })); });
em(s, 0.8, 5.25, 11.2, 0.5, "The fourth, deriving an evaluation criterion for this material class, is where I will spend most of my time.", false, true);
micro(s, 0.8, 6.0, 11.2, "Standards applied: ASTM D790-17 · ISO 11925-2:2020 · ASTM D570-98(2018).");
s.addNotes("The aim, stated narrowly on purpose: document a reproducible production protocol for a fully bio-based eggshell-agar composite, and characterise its mechanical, reaction-to-fire and hygric behaviour against published test standards. Four objectives follow. One, document the protocol in full, every parameter, in a form another laboratory can repeat. Two, characterise against published standards rather than ad hoc procedures. Three, position the results against two material families using published property data. Four, derive an evaluation criterion appropriate to this material class - and that fourth objective is the one I will spend most time on at the end.");

/* ===================== 7 · scope ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Framework" });
H1(s, "Scope");
H2(s, 0.8, 1.45, 7.0, "Within scope");
tbl(s, [
  [TH("Dimension"), TH("This study")],
  [TL("Formulations"), TL("Five — three compressive, two flexural")],
  [TL("Specimens"), TL("Three per formulation for mechanical testing")],
  [TL("Properties"), TL("Compression, flexure, ignitability, water absorption, bulk density")],
  [TL("Standards"), TL("ASTM D790-17 · ISO 11925-2:2020 · ASTM D570-98(2018)")],
  [TL("Conditions"), TL("Ambient cure, single laboratory, single operator")],
  [TL("Application"), TL("Non-loadbearing interior surfaces")],
], { x:0.8, y:1.85, w:7.0, colW:[1.9,5.1], rowH:0.5 });
vrule(s, 8.4, 1.45, 3.9);
H2(s, 8.9, 1.45, 3.6, "Outside scope");
list(s, 8.9, 1.9, 3.6, 2.2, [
  "Durability and ageing",
  "Fire classification",
  "Life-cycle assessment",
  "Structural use",
], false, 12);
rule(s, 0.8, 5.6, 11.7);
H2(s, 0.8, 5.78, 11.7, "Property coverage");
[["Compression",1],["Flexure",1],["Ignitability",1],["Water absorption",1],["Bulk density",1],
 ["Durability",0],["Fire classification",0],["Life-cycle",0],["Structural use",0]]
 .forEach(([lbl,on],i)=>{ const x = 0.8 + i*1.31;
  s.addShape(pres.ShapeType.rect, { x, y:6.2, w:1.2, h:0.52,
    fill:{ color:on?K.ink:"FFFFFF" }, line:{ color:on?K.ink:K.faint, width:1 }, objectName:"ch"+i });
  s.addText(lbl, S({ x:x+0.06, y:6.2, w:1.08, h:0.52, fontSize:9.5, bold:true, lineSpacing:11.5,
    color:on?K.onD:K.faint, align:"center", valign:"middle" })); });
em(s, 0.8, 6.85, 11.2, 0.4, "The filled boxes are the properties I determined. The outlined boxes are the ones I did not.");
s.addNotes("Scope, set out explicitly so that nothing I say today is read beyond it. Within scope: five formulations, three specimens per formulation for the mechanical work, five properties, three published standards, ambient cure in a single laboratory by a single operator, and an application envelope of non-loadbearing interior surfaces. Outside scope: structural use, durability and accelerated ageing, reaction-to-fire classification, and life-cycle assessment. None of those four was generated in this work. What follows is characterisation data, not a performance specification, and I will return to each exclusion at the end as a defined next experiment.");

/* ===================== 8 · method ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Framework" });
H1(s, "Method");
H2(s, 0.8, 1.42, 11.7, "A material-driven sequence in four stages");
const MS = [["Produce","every parameter recorded"],
            ["Measure","against published standards"],
            ["Position","against two material families"],
            ["Propose","from the observed behaviour"]];
const MX=0.8, MW=2.78, MG=0.33;
MS.forEach(([h,b],i)=>{
  const x = MX + i*(MW+MG);
  s.addShape(pres.ShapeType.ellipse, { x, y:1.95, w:0.46, h:0.46,
    fill:{ color:i===3?K.acc:"FFFFFF" }, line:{ color:i===3?K.acc:K.ink, width:1.25 }, objectName:"mo"+i });
  s.addText(String(i+1), S({ x, y:1.95, w:0.46, h:0.46, fontSize:12, bold:true,
    color:i===3?K.onD:K.ink, align:"center", valign:"middle" }));
  s.addText(h, S({ x, y:2.65, w:MW, h:0.32, fontSize:13, bold:true, color:K.ink }));
  s.addText(b, S({ x, y:3.05, w:MW-0.2, h:1.0, fontSize:12, color:K.body, lineSpacing:17 }));
  if (i<3) s.addShape(pres.ShapeType.rightArrow, { x:x+MW+0.04, y:2.08, w:0.24, h:0.18,
    fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"ma"+i });
});
rule(s, 0.8, 4.5, 11.7);
em(s, 0.8, 4.7, 11.2, 0.5, "The properties came first, and the application envelope was derived from them.");
micro(s, 0.8, 5.4, 11.2, "Material-driven design after Karana et al. (2015)");
s.addNotes("Four stages, and the order is the method. Produce, recording every production parameter. Measure against published standards. Position against two material families, conventional interior materials and bio-based composites. And propose an evaluation criterion derived from the observed behaviour. This is a material-driven sequence in the sense of Karana and colleagues: the properties are measured first and the application envelope is derived from them, rather than the material being selected to satisfy a form decided in advance. The design proposal I show near the end follows from the measurements and not the reverse.");

/* ===================== 9 · research questions ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Framework" });
H1(s, "Research questions");
rule(s, 0.8, 1.5, 11.7);
[["01","Which formulation variable governs compressive strength?","Formulation"],
 ["02","How does plasticiser content affect flexural behaviour?","Formulation"],
 ["03","How does the composite compare with conventional interior materials?","Benchmark"],
 ["04","How does it compare with other bio-based composites?","Benchmark"],
 ["05","Is compressive strength an adequate evaluation criterion for this class?","Criterion"]]
 .forEach(([n,q,t],i)=>{ const y = 1.75 + i*0.95;
  s.addText(n, S({ x:0.8, y:y+0.08, w:0.6, h:0.3, fontSize:12, bold:true, color:K.acc }));
  s.addText(q, S({ x:1.55, y, w:8.6, h:0.6, fontSize:13, bold:true, color:K.ink, lineSpacing:19 }));
  s.addText(t, S({ x:10.4, y:y+0.04, w:2.1, h:0.3, fontSize:10.5, color:K.grey, align:"right" }));
  rule(s, 0.8, y+0.72, 11.7); });
em(s, 0.8, 6.7, 11.2, 0.4, "The first four I can answer by measurement. The fifth I can only answer by argument.", false, true);

s.addNotes("Five research questions. The first two are formulation questions - which variable governs compressive strength, and what plasticiser content does to flexural behaviour. The next two are benchmarking questions against the two material families. The fifth asks whether compressive strength is an adequate evaluation criterion for this class of material at all, and it is the question I care most about. Questions one to four are answered by measurement. Question five is answered by argument from those measurements, which is a different kind of claim and I will flag it as such when I get there.");

/* ===================== 10 · hypothesis ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Framework" });
H1(s, "Hypothesis");
s.addShape(pres.ShapeType.rect, { x:0.8, y:1.45, w:11.7, h:1.3, fill:{ color:K.panel },
  line:{ color:K.panel, transparency:100 }, objectName:"hyp" });
s.addText([{ text:"A fully bio-based eggshell–agar composite can be produced repeatably under ambient conditions, and its performance as an interior surface material is governed by deformation capacity rather than by compressive strength.",
             options:{ bold:true, color:K.ink } }],
  S({ x:1.15, y:1.78, w:11.0, h:0.8, fontSize:13, lineSpacing:20 }));
H2(s, 0.8, 3.1, 11.7, "Two clauses, tested separately");
rule(s, 0.8, 3.5, 11.7);
[["Clause 1","Producible repeatably under ambient conditions",
   "Tested by the protocol and the formulation series."],
 ["Clause 2","Governed by deformation capacity rather than strength",
   "Tested by the mechanical results and the two benchmarks."]]
 .forEach(([n,h,b],i)=>{ const y = 3.75 + i*1.2;
  s.addText(n, S({ x:0.8, y:y+0.03, w:1.1, h:0.3, fontSize:12, bold:true, color:K.acc }));
  s.addText(h, S({ x:2.1, y, w:4.3, h:0.62, fontSize:13, bold:true, color:K.ink, lineSpacing:18 }));
  arw(s, 8.1, y+0.17);
  s.addText(i===0?"tested on slides 10–13":"tested on slides 15–22",
    S({ x:8.5, y:y+0.02, w:4.0, h:0.4, fontSize:12, bold:true, color:K.acc, valign:"middle" }));
  if (i<1) rule(s, 0.8, y+1.0, 11.7); });
rule(s, 0.8, 6.15, 11.7);
txt(s, 0.8, 6.35, 11.2, 0.5, "The dissertation behind this paper frames a broader hypothesis around spatial resilience, and what you see here is its materials-engineering component.", false, 11.5);
s.addNotes("The hypothesis, in two clauses, because the two are tested by different parts of the paper. First clause: a fully bio-based eggshell-agar composite can be produced repeatably under ambient conditions. That is tested by the protocol and the formulation series - a defined procedure, a fixed shell-to-binder ratio, five formulations, and a cure that requires no thermal input after mixing. Second clause: its performance as an interior surface material is governed by deformation capacity rather than by compressive strength. That is tested by the mechanical results and the two benchmarks. On provenance, and I would rather say this than have it asked: the dissertation this derives from states a broader hypothesis framed on spatial resilience in interior design. What you see here is the materials-engineering component of that, restated within the scope of the tests actually reported.");

/* ===================== 12 · stage 1 ===================== */
pres.addSection({ title:"Protocol" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Protocol" });
H1(s, "Stage 1 · Mineral phase");
H2(s, 0.8, 1.42, 11.7, "Progressive size reduction of the shell to a sieved powder");
const P1 = [["Whole shell","collected from a single bakery","—"],
            ["Cleaned","membrane and residue removed manually","—"],
            ["Heat-treated","decontamination and drying","120 °C, 20 min"],
            ["Milled","laboratory mechanical grinder","to homogeneous powder"],
            ["Sieved","passing fraction retained","150 µm mesh"]];
const QX=0.8, QW=2.15, QG=0.24;
P1.forEach(([h,b,par],i)=>{
  const x = QX + i*(QW+QG);
  const d = 0.9 - i*0.14;
  s.addShape(pres.ShapeType.ellipse, { x:x+(QW-d)/2, y:1.9+(0.9-d)/2, w:d, h:d,
    fill:{ color:i===4?K.acc:K.panel }, line:{ color:i===4?K.acc:K.line, width:1 }, objectName:"pc"+i });
  s.addText(h, S({ x, y:3.0, w:QW, h:0.3, fontSize:13, bold:true, color:K.ink, align:"center" }));
  s.addText(b, S({ x, y:3.35, w:QW, h:0.65, fontSize:10.5, color:K.grey, align:"center", lineSpacing:14 }));
  s.addText(par, S({ x, y:4.1, w:QW, h:0.3, fontSize:11, bold:true, color:i>1?K.acc:K.faint, align:"center" }));
  if (i<4) s.addShape(pres.ShapeType.rightArrow, { x:x+QW+0.02, y:2.28, w:0.2, h:0.15,
    fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"pa"+i });
});
rule(s, 0.8, 4.75, 11.7);
txt(s, 0.8, 4.95, 11.2, 0.6, "I chose 150 µm so that the mineral phase here would be comparable with the eggshell polymer-composite literature.", false, 12);
txt(s, 0.8, 5.65, 11.2, 0.6, "The heat step is decontamination and drying rather than sterilisation, because sterility was never verified.", false, 12);
s.addNotes("Stage one, the mineral phase. Whole shell from a single bakery, cleaned of membrane and residue by hand, heat-treated at 120 degrees for twenty minutes, milled in a laboratory grinder to a homogeneous powder, and sieved through a 150 micrometre mesh with only the passing fraction retained. The circles contract across the diagram to show what the stage actually does, which is progressive size reduction. Two points of precision. The 150 micrometre figure was selected to match the particle size used in the eggshell polymer-composite literature, so that the mineral phase here is comparable with that work. And I report the 120 degree step as decontamination and drying rather than sterilisation, because dry-heat sterilisation requires around 160 to 170 degrees for one to two hours and sterility was not verified.");

/* ===================== 13 · stage 2 ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Protocol" });
H1(s, "Stage 2 · Binder preparation");
H2(s, 0.8, 1.42, 11.7, "Temperature–time profile of the 55-minute preparation");
const bx=1.6, by=2.05, bh=2.7, bw=9.6;
const y95 = by+0.35, y80 = by+1.0, yAmb = by+bh;
s.addShape(pres.ShapeType.rect, { x:bx, y:by, w:0.02, h:bh, fill:{ color:K.line }, line:{ color:K.line, transparency:100 }, objectName:"tv" });
s.addShape(pres.ShapeType.rect, { x:bx, y:yAmb, w:bw, h:0.02, fill:{ color:K.line }, line:{ color:K.line, transparency:100 }, objectName:"th" });
s.addShape(pres.ShapeType.line, { x:bx, y:y95, w:1.9, h:yAmb-y95, flipV:true, line:{ color:K.ink, width:2.25 }, objectName:"ramp" });
s.addShape(pres.ShapeType.rect, { x:bx+1.9, y:y95, w:2.2, h:0.03, fill:{ color:K.ink }, line:{ color:K.ink, transparency:100 }, objectName:"pl95" });
s.addShape(pres.ShapeType.line, { x:bx+4.1, y:y95, w:0.75, h:y80-y95, line:{ color:K.ink, width:2.25 }, objectName:"drop" });
s.addShape(pres.ShapeType.rect, { x:bx+4.85, y:y80, w:4.6, h:0.03, fill:{ color:K.ink }, line:{ color:K.ink, transparency:100 }, objectName:"pl80" });
s.addText("95 °C", S({ x:bx-1.0, y:y95-0.16, w:0.9, h:0.3, fontSize:12, bold:true, color:K.acc, align:"right" }));
s.addText("80 °C", S({ x:bx-1.0, y:y80-0.16, w:0.9, h:0.3, fontSize:12, bold:true, color:K.acc, align:"right" }));
dim(s, bx-1.0, yAmb-0.16, 0.9, 0.3, "ambient", false, 10);
s.addText("55 min total", S({ x:bx+bw-2.2, y:yAmb-0.42, w:2.2, h:0.3, fontSize:12, bold:true, color:K.ink, align:"right" }));
[[bx+0.15,"Water and glycerol","pre-mixed, no solids present"],
 [bx+2.1,"Agar dissolution","added incrementally, stirred"],
 [bx+5.1,"Viscosity development","continuous stirring"],
 [bx+8.0,"Shell addition","incremental, near the end"]]
 .forEach(([x,h,b],i)=>{
  const yy = (i===0?yAmb:(i===1?y95:y80));
  s.addShape(pres.ShapeType.ellipse, { x:x+0.5, y:yy-0.07, w:0.14, h:0.14,
    fill:{ color:K.acc }, line:{ color:K.acc, transparency:100 }, objectName:"mk"+i });
  s.addText(h, S({ x, y:5.05, w:2.3, h:0.3, fontSize:12, bold:true, color:K.ink }));
  s.addText(b, S({ x, y:5.37, w:2.3, h:0.5, fontSize:10, color:K.grey, lineSpacing:13 }));
  s.addShape(pres.ShapeType.rect, { x:x+0.57, y:yy, w:0.012, h:5.0-yy,
    fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"dl"+i });
});
txt(s, 0.8, 6.0, 11.2, 0.55, "Agar is thermoreversible: it melts when you heat it and sets again as it cools, so no hardener and no cure temperature are needed.", false, 12);
txt(s, 0.8, 6.6, 11.2, 0.55, "The agar is added a little at a time under constant stirring, because added all at once it forms agglomerates that never redisperse.", false, 12);
micro(s, 0.8, 7.2, 11.2, "Schematic. The set points and the total time are recorded; the ramp rates are not, and stirring was manual.");
s.addNotes("Stage two, binder preparation, drawn as a temperature-time profile because that is what the stage is. Water and glycerol are pre-mixed first, before any solids are present. Agar is then added incrementally under continuous stirring - bulk addition forms agglomerates that do not redisperse. The mixture is taken to 95 degrees and held until the agar is fully in solution, because if viscosity builds before complete dissolution the gel network is patchy. The temperature is then reduced to 80 and held while viscosity develops, and the shell fraction is introduced incrementally near the end; introduced earlier, it sediments. Fifty-five minutes in total. This is a schematic: the two set points and the total time are recorded, the intermediate ramp rates are not, and stirring was manual so shear rate is not a controlled quantity.");

/* ===================== 14 · stage 3 ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Protocol" });
H1(s, "Stage 3 · Casting and cure");
H2(s, 0.8, 1.42, 11.7, "Eleven days from casting to finished specimen, without thermal input");
const cx=0.8, cy=2.85, cw=11.7, ch=0.78;
s.addShape(pres.ShapeType.rect, { x:cx, y:cy, w:cw*0.36, h:ch, fill:{ color:K.panel }, line:{ color:K.line, width:1 }, objectName:"c1" });
s.addShape(pres.ShapeType.rect, { x:cx+cw*0.36, y:cy, w:cw*0.64, h:ch, fill:{ color:"FFFFFF" }, line:{ color:K.ink, width:1 }, objectName:"c2" });
s.addText("In mould", S({ x:cx+0.3, y:cy+0.14, w:3.0, h:0.3, fontSize:13, bold:true, color:K.ink }));
dim(s, cx+0.3, cy+0.44, 3.4, 0.3, "setting and initial drying", false, 10.5);
s.addText("Ambient consolidation", S({ x:cx+cw*0.36+0.3, y:cy+0.14, w:4.0, h:0.3, fontSize:13, bold:true, color:K.ink }));
dim(s, cx+cw*0.36+0.3, cy+0.44, 5.0, 0.3, "≈ 23 °C, shielded from direct sun and air movement", false, 10.5);
[[cx,"Day 0","cast into silicone moulds"],
 [cx+cw*0.36,"Day 4","demoulded"],
 [cx+cw-1.4,"Day 11","finished specimen, three shellac coats"]]
 .forEach(([x,d,b],i)=>{
  s.addShape(pres.ShapeType.rect, { x:(i===2?x+1.39:x), y:cy-0.5, w:0.02, h:0.42,
    fill:{ color:K.ink }, line:{ color:K.ink, transparency:100 }, objectName:"tk"+i });
  s.addText(d, S({ x:(i===2?x-0.1:x+0.1), y:cy-0.92, w:1.5, h:0.3, fontSize:13, bold:true,
    color:K.acc, align:(i===2?"right":"left") }));
  s.addText(b, S({ x:(i===2?x-1.6:x+0.1), y:cy+ch+0.16, w:3.1, h:0.3, fontSize:10.5,
    color:K.grey, align:(i===2?"right":"left") }));
});
rule(s, 0.8, 4.45, 11.7);
txt(s, 0.8, 4.65, 11.2, 0.5, "After the 55-minute preparation the material receives no further heat, so the entire cure happens at room temperature.", false, 12);
micro(s, 0.8, 5.25, 11.2, "Silicone moulds · 50 mm cube moulds for compression, flat moulds otherwise.");
s.addShape(pres.ShapeType.rect, { x:0.8, y:5.85, w:11.7, h:0.85, fill:{ color:K.panel },
  line:{ color:K.panel, transparency:100 }, objectName:"disc" });
s.addText([{ text:"Limitation   ", options:{ bold:true, color:K.acc } },
           { text:"the composite shrinks as the water evaporates, and I did not log the dried dimensions, so every dimension I quote today is a mould dimension.", options:{ color:K.ink } }],
  S({ x:1.15, y:6.0, w:11.0, h:0.55, fontSize:12, lineSpacing:17, valign:"middle" }));
s.addNotes("Stage three, casting and cure, drawn as a timeline. Day zero, cast into silicone moulds - silicone because it flexes enough to release without a parting agent and without damaging a specimen that has not fully consolidated. Four days in mould for setting and initial drying, demoulded on day four, then seven further days at around 23 degrees shielded from direct sun and forced air movement. Day eleven, finished specimen, with three shellac coats where water resistance is required. Note that there is no thermal input at all after the fifty-five minute preparation: the entire cure proceeds at room temperature, which matters for the embodied-energy argument later. The limitation, which I will repeat because it affects every number that follows: the composite shrinks appreciably as water evaporates, cross-sections were measured at test time but post-drying dimensions were not logged, so every dimension I quote is a mould dimension.");

/* ===================== 15 · formulations ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Protocol" });
H1(s, "Formulations");
H2(s, 0.8, 1.42, 11.7, "Five mixes, with the derived ratios that govern the results");
tbl(s, [
  [TH("ID"), TH("Test"), TH("Water g"), TH("Shell g"), TH("Agar g"), TH("Glycerol g"), TH("Shell : binder"), TH("Solids : water")],
  [TD("C1"), TL("Compression"), TD("325"), TD("80"),  TD("35"), TD("5"),  TD("2.00",{bold:true}), TD("0.37")],
  [TD("C2"), TL("Compression"), TD("310"), TD("90"),  TD("40"), TD("5"),  TD("2.00",{bold:true}), TD("0.44")],
  [TD("C3"), TL("Compression"), TD("280"), TD("110"), TD("45"), TD("10"), TD("2.00",{bold:true}), TD("0.59")],
  [TD("F1"), TL("Flexure"),     TD("450"), TD("190"), TD("70"), TD("60"), TD("1.46"), TD("0.71")],
  [TD("F2"), TL("Flexure"),     TD("480"), TD("190"), TD("70"), TD("30"), TD("1.90"), TD("0.60")],
], { x:0.8, y:1.8, w:11.7, colW:[0.8,2.0,1.4,1.3,1.25,1.65,1.7,1.6], rowH:0.42 });
rule(s, 0.8, 4.45, 11.7);
H2(s, 0.8, 4.62, 6.0, "Batch composition by mass");
swatch(s, 0.8, 5.02, K.faint, "water");
swatch(s, 2.0, 5.02, K.acc, "shell");
swatch(s, 3.2, 5.02, K.ink, "agar");
swatch(s, 4.4, 5.02, K.grey, "glycerol");
[["C1",325,80,35,5],["C2",310,90,40,5],["C3",280,110,45,10],
 ["F1",450,190,70,60],["F2",480,190,70,30]]
 .forEach(([id,w,sh,ag,gl],i)=>{ const tot=w+sh+ag+gl, y=5.38+i*0.3;
  s.addText(id, S({ x:0.8, y, w:0.5, h:0.22, fontSize:10.5, bold:true, color:K.ink, valign:"middle" }));
  stackbar(s, 1.35, y, 5.1, 0.22, [[w/tot,K.faint],[sh/tot,K.acc],[ag/tot,K.ink],[gl/tot,K.grey]]);
  s.addText(Math.round(100*w/tot)+"% water", S({ x:6.52, y, w:1.1, h:0.22, fontSize:9.5,
    color:i<3?K.acc:K.grey, bold:i<3, valign:"middle" })); });
vrule(s, 8.0, 4.45, 2.4);
em(s, 8.4, 4.75, 4.1, 1.6, "Solids concentration is the only variable, and you can see it in the bars: the water band gets shorter from C1 to C3.", false, true);
txt(s, 8.4, 6.3, 4.1, 0.8, "The glycerol was halved while the batch mass stayed the same, so the water rose to compensate.", false, 11.5);
s.addNotes("The formulation matrix with the derived ratios, and there are two things to read in it. In the compressive series shell-to-binder is exactly two point zero zero in all three mixes. That was not planned as a control, but the consequence is that solids concentration is the only variable in the series, which makes the compression result interpretable. In the flexural series I declare a confound: glycerol was halved but batch mass was held at 770 grams, so water rose to compensate and the other ratios shifted with it. The plasticiser effect is therefore not cleanly isolated, and I will say so again when I present the flexural data.");

/* ===================== 16 · test programme ===================== */
pres.addSection({ title:"Results" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Test programme");
H2(s, 0.8, 1.42, 11.7, "Four specimen geometries");
rule(s, 0.8, 1.85, 11.7);
/* four specimen schematics */
const SPX = (i) => 0.8 + i*2.95;
[["Cube compression","50 mm cube, platen-loaded","n = 3 per mix"],
 ["Three-point flexure","180 × 60 × 20 mm, 120 mm span","ASTM D790-17 · n = 3 per mix"],
 ["Edge ignition","40 × 50 mm at 45°, 15 s flame","ISO 11925-2:2020 · n = 2"],
 ["Immersion","40 × 50 mm, shellac-coated, 24 h","ASTM D570-98 · n = 1"]]
 .forEach(([h,b,c],i)=>{
  const x = SPX(i);
  s.addText(h, S({ x, y:4.25, w:2.85, h:0.28, fontSize:13, bold:true, color:K.ink, align:"center" }));
  s.addText(b, S({ x, y:4.58, w:2.85, h:0.3, fontSize:10.5, color:K.grey, align:"center", lineSpacing:13 }));
  s.addText(c, S({ x, y:4.92, w:2.85, h:0.3, fontSize:10, bold:true, color:K.acc, align:"center" }));
  if (i<3) s.addShape(pres.ShapeType.rect, { x:x+2.88, y:2.1, w:0.015, h:3.2,
    fill:{ color:K.line }, line:{ color:K.line, transparency:100 }, objectName:"sp"+i });
});
rule(s, 0.8, 5.7, 11.7);
em(s, 0.8, 5.9, 11.2, 0.5, "The mechanical values are means of three specimens, and because I did not retain the individual values, I cannot give you standard deviations.");
/* 1 cube between platens */
let x0 = SPX(0)+0.95;
s.addShape(pres.ShapeType.downArrow, { x:x0+0.38, y:2.6, w:0.14, h:0.24,
  fill:{ color:K.acc }, line:{ color:K.acc, transparency:100 }, objectName:"cl1" });
s.addShape(pres.ShapeType.rect, { x:x0-0.1, y:2.89, w:1.1, h:0.07, fill:{ color:K.ink }, line:{ color:K.ink, transparency:100 }, objectName:"pt1" });
s.addShape(pres.ShapeType.rect, { x:x0, y:2.99, w:0.9, h:0.56, fill:{ color:K.panel }, line:{ color:K.ink, width:1.25 }, objectName:"cb1" });
s.addShape(pres.ShapeType.rect, { x:x0-0.1, y:3.58, w:1.1, h:0.07, fill:{ color:K.ink }, line:{ color:K.ink, transparency:100 }, objectName:"pt2" });
/* 2 beam on two supports, central load */
x0 = SPX(1)+0.2;
s.addShape(pres.ShapeType.downArrow, { x:x0+1.16, y:2.75, w:0.14, h:0.26,
  fill:{ color:K.acc }, line:{ color:K.acc, transparency:100 }, objectName:"cl2" });
s.addShape(pres.ShapeType.rect, { x:x0, y:3.07, w:2.45, h:0.2, fill:{ color:K.panel }, line:{ color:K.ink, width:1.25 }, objectName:"bm" });
s.addShape(pres.ShapeType.triangle, { x:x0+0.22, y:3.29, w:0.24, h:0.2, fill:{ color:K.ink }, line:{ color:K.ink, transparency:100 }, objectName:"su1" });
s.addShape(pres.ShapeType.triangle, { x:x0+1.99, y:3.29, w:0.24, h:0.2, fill:{ color:K.ink }, line:{ color:K.ink, transparency:100 }, objectName:"su2" });
s.addShape(pres.ShapeType.rect, { x:x0+0.34, y:3.61, w:1.77, h:0.015, fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"spn" });
s.addText("120 mm", S({ x:x0+0.55, y:3.63, w:1.35, h:0.22, fontSize:9, color:K.grey, align:"center" }));
/* 3 specimen at 45 degrees with an edge flame */
x0 = SPX(2)+0.85;
s.addShape(pres.ShapeType.rect, { x:x0, y:2.85, w:0.66, h:0.66, rotate:45,
  fill:{ color:K.panel }, line:{ color:K.ink, width:1.25 }, objectName:"fs" });
s.addShape(pres.ShapeType.triangle, { x:x0+0.23, y:3.61, w:0.2, h:0.24,
  fill:{ color:K.acc }, line:{ color:K.acc, transparency:100 }, objectName:"fm" });
s.addText("45°", S({ x:x0+0.82, y:3.11, w:0.5, h:0.22, fontSize:9, color:K.grey }));
/* 4 coupon immersed */
x0 = SPX(3)+0.5;
s.addShape(pres.ShapeType.rect, { x:x0, y:2.93, w:1.85, h:0.85, fill:{ color:"FFFFFF" }, line:{ color:K.ink, width:1.25 }, objectName:"vs" });
s.addShape(pres.ShapeType.rect, { x:x0+0.02, y:3.16, w:1.81, h:0.6, fill:{ color:K.acc, transparency:72 }, line:{ color:K.acc, transparency:100 }, objectName:"wt" });
s.addShape(pres.ShapeType.rect, { x:x0+0.6, y:3.3, w:0.65, h:0.34, fill:{ color:K.panel }, line:{ color:K.ink, width:1 }, objectName:"cp" });
txt(s, 0.8, 6.45, 11.2, 0.5, "The fire, absorption and density figures are single determinations.", false, 11.5);
micro(s, 0.8, 7.0, 11.2, "All testing: Advanced Construction Materials Research Laboratory, Hacettepe University.  ·  Schematic, not to scale.");
s.addNotes("The test programme. I want the reporting convention on the record before any numbers appear. Mechanical values are means of three specimens; individual values were not retained, so I cannot give standard deviations. The ignitability, absorption and density figures rest on single determinations and are indicative rather than characteristic values. Compression was run as cube compression rather than to a named standard, and I flag that as a deviation.");

/* ===================== 17 · compression ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Compression");
H2(s, 0.8, 1.45, 4.6, "Measured values");
tbl(s, [
  [TH("ID"), TH("Solids : water"), TH("Fₘₐₓ kN"), TH("σᴄ MPa")],
  [TD("C1"), TD("0.37"), TD("3.89"), TD("2.55")],
  [TD("C2"), TD("0.44"), TD("4.30"), TD("3.12")],
  [TD("C3"), TD("0.59"), TD("6.80",ACC), TD("4.10",ACC)],
], { x:0.8, y:1.85, w:4.6, colW:[0.7,1.6,1.15,1.15], rowH:0.42 });
rule(s, 0.8, 3.7, 4.6);
em(s, 0.8, 3.85, 4.6, 0.9, "Strength here is governed by packing density, not by mineral content.");
txt(s, 0.8, 4.85, 4.6, 0.9, "The way to a stronger composite is to take water out, not to put more shell in.", false, 12);
micro(s, 0.8, 5.75, 4.6, "Linear over the range tested, R² = 0.99 — three formulations, therefore a hypothesis rather than a law.  ·  Fitted relation: σᴄ = 6.93 (solids : water) + 0.04");
s.addChart(pres.ChartType.bar, [{ name:"σ", labels:["C1  0.37","C2  0.44","C3  0.59"], values:[2.55,3.12,4.10] }],
  { x:5.9, y:1.6, w:6.6, h:4.8, barDir:"col", chartColors:[K.ink], showLegend:false,
    showValue:true, dataLabelPosition:"outEnd", dataLabelColor:K.ink, dataLabelFontSize:12,
    dataLabelFontFace:"+mn-lt", dataLabelFormatCode:"0.00",
    catAxisLabelColor:K.grey, catAxisLabelFontSize:11, catAxisLabelFontFace:"+mn-lt",
    valAxisLabelColor:K.grey, valAxisLabelFontSize:10, valAxisLabelFontFace:"+mn-lt",
    valAxisTitle:"Compressive stress (MPa)", showValAxisTitle:true, valAxisTitleColor:K.grey,
    valAxisTitleFontSize:10.5, valAxisTitleFontFace:"+mn-lt", valAxisMaxVal:5,
    valGridLine:{ color:K.line, size:1 }, catGridLine:{ style:"none" }, objectName:"cc" });
micro(s, 5.9, 6.55, 6.6, "Solids : water ratio shown beneath each formulation identifier.");
s.addNotes("The compression result, and this answers research question one. Because shell-to-binder is fixed at two point zero zero across the series, solids concentration is the only variable - and compressive stress rises linearly with it, R-squared of 0.99 over the range 0.37 to 0.59. Three points will fit almost any line, so I am calling this a hypothesis rather than a law. But it has a clear physical reading: strength here is governed by packing density, not by mineral content as such. If that is right, the route to a stronger composite is to remove water rather than to add shell. The fitted relation is sigma equals 6.93 times the solids-to-water ratio plus 0.04.");

/* ===================== 18 · compressive failure ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Compressive failure");
s.addImage({ path:G+"04-basma-ficilasmis-kup.jpeg", x:0.8, y:1.5, w:2.5, h:5.41, objectName:"cube" });
H2(s, 3.9, 1.5, 5.2, "Compressive stress (MPa) – strain, C3");
s.addImage({ path:G+"05b-basma-egrisi.png", x:3.9, y:1.95, w:5.2, h:2.91, objectName:"curve" });
H2(s, 3.9, 5.1, 5.2, "Observed response");
list(s, 3.9, 5.5, 5.2, 1.4, [
  "Linear to approximately 1 MPa, then progressive loss of stiffness",
  "Peak stress near 10% strain, with no abrupt load drop",
  "Continued deformation beyond peak with retained integrity",
], false, 11.5);
vrule(s, 9.5, 1.5, 5.0);
em(s, 10.0, 1.5, 2.5, 1.8, "Failure proceeds by progressive crushing rather than by fracture.", false, true);
rule(s, 10.0, 3.3, 2.5);
txt(s, 10.0, 3.5, 2.5, 1.9, "It has barrelled, it is shorter and wider, and it is still a single body.", false, 12);
micro(s, 0.8, 7.0, 11.2, "The strain scale assumes ten per cent deformation from observation, not instrumented measurement.  ·  Bulk density 1.38 g/cm³, mould-volume basis.");
s.addNotes("This is the failure mode, and it is what I would ask about from where you are sitting. The curve is linear to about one megapascal, then stiffness falls away progressively as the agar network yields and the mineral redistributes. Peak arrives near ten percent strain with no abrupt load drop, and beyond peak the specimen continues to deform while holding together. The photograph shows the consequence: the cube has barrelled, it is shorter and wider, and it is still a single body. Energy is absorbed rather than released. One honesty point on the axis: the strain scale derives from an assumed ten percent maximum deformation based on observation, not from instrumented measurement.");

/* ===================== 19 · flexure ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Flexure");
H2(s, 0.8, 1.45, 7.3, "Measured values — ASTM D790-17, three-point");
tbl(s, [
  [TH("ID"), TH("Glycerol % solids"), TH("Fₘₐₓ N"), TH("σꜰ MPa"), TH("Eꜰ MPa"), TH("ε peak")],
  [TD("F1"), TD("18.8"), TD("—"), TD("not measurable",{italic:true}), TD("—"), TD("—")],
  [TD("F2"), TD("10.3"), TD("310"), TD("2.325",ACC), TD("192",ACC), TD("0.0121")],
], { x:0.8, y:1.85, w:7.3, colW:[0.75,1.75,1.1,1.75,1.0,0.95], rowH:0.42 });
rule(s, 0.8, 3.35, 7.3);
H2(s, 0.8, 3.55, 4.6, "Flexural stress (MPa) – strain, F2");
s.addImage({ path:G+"09b-egilme-egrisi.png", x:0.8, y:3.95, w:4.6, h:2.6, objectName:"fc" });
em(s, 5.8, 3.95, 2.5, 1.6, "The transition is sharp, and it lies between those two compositions.", false, true);
vrule(s, 8.6, 1.45, 5.3);
H2(s, 9.1, 1.45, 3.4, "Limitation");
txt(s, 9.1, 1.85, 3.4, 2.4, "The specimen is kerfed on its tension face while the standard assumes a solid rectangle, so the modulus I am quoting is a lower bound.", false, 12);
micro(s, 9.1, 5.7, 3.1, "Confounded with solids concentration: batch mass was held constant, so water rose as glycerol fell.");
micro(s, 0.8, 6.7, 7.3, "Flexural strength computed as σꜰ = 3FL / 2bd² on the full rectangular section.");
s.addNotes("Flexure, to ASTM D790. The decisive variable is plasticiser content. At 18.8 percent glycerol the composite deformed without developing measurable resistance - the instrument registered nothing usable at all. Halving it gives 2.325 megapascals at a modulus of 192. The transition is sharp and it lies between those two values, which is itself a useful thing to know and a target for the next formulation series. Two limitations. The glycerol effect is confounded with solids concentration, as I flagged on the formulation slide. And the specimen is kerfed on its tension face while the standard assumes a solid rectangle, so the modulus I am quoting is a lower bound on the bulk material rather than a material constant.");

/* ===================== 20 · flexural deformation ===================== */
s = pres.addSlide({ masterName:"FULL", sectionTitle:"Results" });
s.addImage({ path:G+"06-egilme-buyuk-sehim.jpg", x:0, y:0, w:3.38, h:7.5, objectName:"b1" });
s.addImage({ path:G+"07-egilme-yakin-yiv.jpeg", x:3.48, y:0, w:4.48, h:3.36, objectName:"b2" });
s.addImage({ path:G+"08c-kemer.jpg", x:3.48, y:3.85, w:4.48, h:3.65, objectName:"b3" });
s.addShape(pres.ShapeType.rect, { x:7.96, y:0, w:5.37, h:7.5, fill:{ color:K.dark }, line:{ color:K.dark, transparency:100 }, objectName:"pane" });
s.addText("Flexural deformation", S({ x:8.45, y:1.4, w:4.2, h:0.5, fontSize:20, bold:true, color:K.onD, valign:"middle" }));
em(s, 8.45, 2.1, 4.2, 1.6, "Both test programmes gave me the same result: substantial deformation with the integrity retained.", true, true);
txt(s, 8.45, 4.0, 4.2, 1.6, "The beam is deflected well past the point where a comparable ceramic would have parted, and it is still intact.", true, 12);
micro(s, 8.45, 6.0, 4.2, "Three-point rig at high deflection · kerfed tension face · panel arched by hand", true);
s.addNotes("I would rather show this than ask you to take it on the numbers. On the left, the three-point rig at high deflection: the beam is deflected well past the failure point of a comparable ceramic and it has not parted. In the middle, a close-up of the tension face, where the transverse kerfs are visible. Below, the same panel arched by hand. The kerfs are why it arches, and they are also why I report the modulus as a lower bound rather than a material constant. The common result across both test programmes is substantial deformation with retained integrity, and that is the observation the final argument rests on.");

/* ===================== 21 · fire, water, density ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Fire, water, density");
s.addImage({ path:G+"10-alev-testi.png", x:0.8, y:1.5, w:2.2, h:4.77, objectName:"fl" });
H2(s, 3.5, 1.45, 3.3, "Ignitability");
fig(s, 3.5, 1.9, 3.3, "≈ 10 s", "to ignition under direct flame");
fig(s, 3.5, 3.1, 3.3, "4 s", "to self-extinguish after flame removal");
list(s, 3.5, 4.3, 3.3, 1.3, ["Charring remains local","No lateral flame spread","No melting and no dripping"], false, 11.5);
txt(s, 3.5, 5.75, 3.3, 0.9, "It is an ignitability test, and there is no Euroclass classification behind it.", false, 12);
micro(s, 3.5, 6.65, 3.3, "ISO 11925-2:2020. No cone calorimetry, smoke or toxicity data.");
vrule(s, 7.3, 1.45, 4.9);
H2(s, 7.8, 1.45, 4.7, "Water absorption, 24 h immersion");
s.addText("0.7%", S({ x:7.8, y:1.85, w:1.8, h:0.6, fontSize:32, bold:true, color:K.acc, valign:"bottom" }));
txt(s, 9.7, 1.95, 2.8, 1.3, "mass gain. It is the coating that limits humid service rather than the composite itself.", false, 11.5);
rule(s, 7.8, 3.2, 4.7);
H2(s, 7.8, 3.4, 4.7, "Bulk density");
tbl(s, [
  [TH("Material"), TH("g/cm³"), TH("Reference")],
  [TL("This study (C3)", ACC), TD("1.38", ACC), TL("—")],
  [TL("Mycelium, cellulose"), TD("0.3 – 0.8"), TL("Jones et al. (2020)")],
  [TL("Fired clay brick"), TD("1.6 – 2.0"), TL("William & Owen (1995)")],
], { x:7.8, y:3.8, w:4.7, colW:[1.95,1.0,1.75], rowH:0.42, fontSize:10 });
micro(s, 7.8, 5.95, 4.7, "Mould-volume basis, therefore a lower bound.");
s.addNotes("Fire, water and density together. On ignitability: ignition at around ten seconds under direct flame, self-extinguishing four seconds after the flame is removed, with charring confined locally, no lateral spread, and no melting or dripping - which matters for a polymer-adjacent material. The probable mechanism is endothermic decomposition of the carbonate fraction releasing carbon dioxide and diluting the flame front, and I state that as a probable mechanism because it was not verified calorimetrically. To be precise: this is an ignitability test. There is no Euroclass classification, no cone calorimetry, no smoke or toxicity data. On water: 0.7 percent mass gain over twenty-four hours of full immersion with three shellac coats, with local dissolution where the coating was thin, so coating integrity is the limiting factor. On density: 1.38, above the fungal and cellulosic bio-materials and below fired clay, on a mould-volume basis and therefore a lower bound.");

/* ===================== 22 · conventional materials ===================== */
pres.addSection({ title:"Benchmark" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Benchmark" });
H1(s, "Conventional materials");
H2(s, 0.8, 1.42, 8.3, "Compressive and flexural strength against interior surface materials");
s.addChart(pres.ChartType.bar, [
  { name:"Compressive", labels:["Compressed\nmushroom panel","This study\n(C3)","WPC","MDF","Travertine"], values:[1.2,4.1,7.2,24,80] },
  { name:"Flexural",    labels:["Compressed\nmushroom panel","This study\n(C3)","WPC","MDF","Travertine"], values:[1.0,2.3,12,35,11] },
], { x:0.8, y:1.8, w:8.3, h:4.6, barDir:"col", barGrouping:"clustered",
     chartColors:[K.ink, K.faint], showLegend:true, legendPos:"t",
     legendColor:K.grey, legendFontSize:10.5, legendFontFace:"+mn-lt",
     showValue:true, dataLabelPosition:"outEnd", dataLabelColor:K.body, dataLabelFontSize:10,
     dataLabelFontFace:"+mn-lt", dataLabelFormatCode:"0.0",
     catAxisLabelColor:K.grey, catAxisLabelFontSize:10, catAxisLabelFontFace:"+mn-lt",
     valAxisLabelColor:K.grey, valAxisLabelFontSize:10, valAxisLabelFontFace:"+mn-lt",
     valAxisTitle:"Strength (MPa)", showValAxisTitle:true, valAxisTitleColor:K.grey,
     valAxisTitleFontSize:10.5, valAxisTitleFontFace:"+mn-lt",
     valGridLine:{ color:K.line, size:1 }, catGridLine:{ style:"none" }, objectName:"bc1" });
micro(s, 0.8, 6.5, 8.3, "Velasco & Gaona (2011) · Klyosov (2007) · Nemli & Aydın (2007) · Altun (2006)");
vrule(s, 9.5, 1.45, 5.0);
em(s, 10.0, 1.5, 2.5, 2.0, "On strength alone this composite is not competitive with engineered wood or stone.", false, true);
rule(s, 10.0, 3.6, 2.5);
txt(s, 10.0, 3.9, 2.5, 1.8, "It has one sixth the compressive strength of MDF and one twentieth that of travertine.", false, 12);
s.addNotes("First benchmark, against the materials this would sit alongside in an interior. Let me be direct. One sixth the compressive strength of MDF and one twentieth that of travertine - and travertine is the relevant aesthetic comparison, because the material resembles it. It does exceed compressed mushroom panel, the only other fully bio-based board in the set, by a factor of three in compression. But on strength alone the composite is not competitive with engineered wood or stone, and I am not going to claim otherwise.");

/* ===================== 23 · bio-based composites ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Benchmark" });
H1(s, "Bio-based composites");
H2(s, 0.8, 1.42, 5.6, "Compressive strength");
tbl(s, [
  [TH("Material"), TH("σᴄ MPa"), TH("Reference")],
  [TL("This study (C3)", ACC), TD("4.1", ACC), TL("—")],
  [TL("Mycelium composite"), TD("0.145 – 0.452"), TL("Jones et al. (2020)")],
  [TL("Hempcrete"), TD("0.3 – 0.6"), TL("Arnaud & Gourlay (2012)")],
  [TL("Eggshell-filled PLA"), TD("2 – 5"), TL("Kim & Pal (2010)")],
  [TL("Mineral-filled biocomposite"), TD("2.1 – 39.6"), TL("Shah et al. (2016)")],
], { x:0.8, y:1.8, w:5.6, colW:[2.6,1.5,1.5], rowH:0.42, fontSize:10 });
H2(s, 7.0, 1.42, 5.5, "Elastic modulus, MPa, logarithmic");
vrule(s, 6.5, 1.42, 2.5);
/* axis: four decades, 1 to 10 000 MPa */
const LX0 = 7.3, LDEC = 1.22, LY = 3.0;
const lpos = (v) => LX0 + LDEC*(Math.log(v)/Math.LN10);
s.addShape(pres.ShapeType.rect, { x:LX0, y:LY, w:4*LDEC, h:0.02,
  fill:{ color:K.ink }, line:{ color:K.ink, transparency:100 }, objectName:"lax" });
[1,10,100,1000,10000].forEach(v=>{ const x = lpos(v);
  s.addShape(pres.ShapeType.rect, { x, y:LY, w:0.015, h:0.14,
    fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"lt"+v });
  s.addText(v.toLocaleString("en-GB"), S({ x:x-0.45, y:LY+0.16, w:0.9, h:0.22,
    fontSize:9.5, color:K.grey, align:"center" })); });
/* ranges below the axis */
[[1.8,5,"Mycelium",K.grey],[100,300,"LDPE",K.grey]].forEach(([a,b,l,c],i)=>{
  const xa = lpos(a), xb = lpos(b), y = LY - 0.32 - i*0.28;
  s.addShape(pres.ShapeType.rect, { x:xa, y, w:xb-xa, h:0.1, fill:{ color:c, transparency:45 },
    line:{ color:c, transparency:100 }, objectName:"lr"+i });
  s.addText(l, S({ x:xb+0.1, y:y-0.07, w:1.3, h:0.24, fontSize:9.5, color:K.grey, valign:"middle" })); });
/* single points */
[[124,""],[198,""],[11000,"Pine"]].forEach(([v,l],i)=>{
  const x = lpos(v);
  s.addShape(pres.ShapeType.ellipse, { x:x-0.055, y:LY-0.055, w:0.11, h:0.11,
    fill:{ color:K.grey }, line:{ color:K.grey, transparency:100 }, objectName:"lp"+i });
  if (l) s.addText(l, S({ x:x-1.5, y:LY+0.42, w:1.4, h:0.24,
    fontSize:9.5, color:K.grey, align:"right" })); });
/* this study */
s.addShape(pres.ShapeType.ellipse, { x:lpos(192)-0.09, y:LY-0.09, w:0.18, h:0.18,
  fill:{ color:K.acc }, line:{ color:K.acc, transparency:100 }, objectName:"lme" });
s.addShape(pres.ShapeType.rect, { x:lpos(192)-0.008, y:LY-0.62, w:0.016, h:0.53,
  fill:{ color:K.acc }, line:{ color:K.acc, transparency:100 }, objectName:"lml" });
s.addText("This study  192", S({ x:lpos(192)-1.05, y:LY-0.9, w:2.1, h:0.26,
  fontSize:11, bold:true, color:K.acc, align:"center" }));
micro(s, 7.0, 4.0, 5.5, "Unlabelled points: soy-based bioplastic 124, flax-fibre PLA 198, pine 11 000.");
rule(s, 0.8, 4.6, 11.7);
em(s, 0.8, 4.85, 11.7, 0.5, "It was cast from water and dried at room temperature, with no oven, no autoclave and no extruder, and it still reaches the stiffness of melt-processed bio-polymers.");
micro(s, 0.8, 5.5, 11.2, "An order of magnitude above the fungal and lime-binder family in compression; wood remains two orders of magnitude above.  ·  Values are reported as published; specimen geometry and test method differ between sources.");
s.addNotes("Second benchmark, and this is the one that matters. Against the bio-based family the position changes completely. In compression, an order of magnitude above mycelium composites and hempcrete, and within the range reported for eggshell-filled PLA. In stiffness, 192 megapascals - between soy bioplastic at 124 and flax-fibre PLA at 198, inside the LDPE range. Note what that means in process terms. This is water-cast and dried at room temperature, with no oven, no autoclave and no extruder, and it reaches the stiffness of melt-processed bio-polymers. One caution: the cited values come from studies with differing specimen geometry and test method, so this is a position statement rather than a controlled comparison. And wood remains two orders of magnitude above in modulus.");

/* ===================== 24 · resilience ===================== */
s = pres.addSlide({ masterName:"DARK", sectionTitle:"Benchmark" });
H1(s, "Modulus of resilience", true);
H2(s, 0.9, 1.42, 5.0, "Elastic energy absorbed per unit volume", true);
const ax=0.9, ay=2.1, aw=4.6, ah=3.0;
s.addShape(pres.ShapeType.rect, { x:ax, y:ay, w:0.02, h:ah, fill:{ color:K.onDf }, line:{ color:K.onDf, transparency:100 }, objectName:"vx" });
s.addShape(pres.ShapeType.rect, { x:ax, y:ay+ah, w:aw, h:0.02, fill:{ color:K.onDf }, line:{ color:K.onDf, transparency:100 }, objectName:"hx" });
s.addShape("rtTriangle", { x:ax+0.02, y:ay+0.85, w:2.8, h:ah-0.85, flipH:true,
  fill:{ color:K.acc, transparency:28 }, line:{ color:K.acc, width:2 }, objectName:"area" });
s.addText("stress", S({ x:ax-0.85, y:ay+0.6, w:0.8, h:0.3, fontSize:11, color:K.onDg, align:"right" }));
s.addText("strain", S({ x:ax+2.55, y:ay+ah+0.1, w:0.8, h:0.3, fontSize:11, color:K.onDg }));
s.addText("Ur", S({ x:ax+1.35, y:ay+2.15, w:0.7, h:0.32, fontSize:13, bold:true, color:K.onD }));
micro(s, ax, ay+ah+0.5, 4.6, "The shaded area is the energy absorbed per unit volume before permanent damage: ½ σ ε, and with ε = σ / E it reduces to the expression at right.", true);
vrule(s, 6.3, 1.42, 5.0, true);
s.addText("Ur  =  σ² / 2E", S({ x:6.8, y:1.95, w:3.2, h:0.5, fontSize:22, bold:true, color:K.onD }));
s.addText("14.1 kJ/m³", S({ x:6.8, y:2.6, w:3.2, h:0.55, fontSize:26, bold:true, color:K.acc }));
micro(s, 6.8, 3.2, 3.2, "computed from this study's own σꜰ = 2.325 MPa and Eꜰ = 192 MPa", true);
em(s, 6.8, 3.8, 3.2, 1.0, "Notice where the modulus sits in that expression: it is in the denominator.", true);
txt(s, 6.8, 5.0, 3.2, 1.9, "Strength tells you the load at which a material stops performing. It does not tell you whether it then fails gracefully or catastrophically.", true, 12);
H2(s, 10.4, 1.42, 2.1, "Limitation", true);
txt(s, 10.4, 1.85, 2.1, 2.6, "I cannot give you a comparative table, because the literature reports strength and modulus in separate studies.", true, 11.5);
micro(s, 0.9, 6.85, 11.1, "Resilience as a property of systems that absorb disturbance and retain function, after Holling (1973).", true);
s.addNotes("This brings me to research question five, and the diagram is the argument. The shaded area under the elastic region is the energy a material absorbs per unit volume before it takes permanent damage. Because that area is one half sigma epsilon, and epsilon is sigma over E, the area reduces to sigma squared over two E. Notice where the elastic modulus sits: in the denominator. So the low modulus that counted against the material on the previous slide is the same property that raises this quantity. For this formulation it comes to about 14 kilojoules per cubic metre, computed from this study's own two measurements. Both test programmes gave the same qualitative result, substantial deformation with retained integrity. Strength records the load at which a material ceases to perform. It does not record whether it then fails gracefully or catastrophically, and for a demountable non-loadbearing component that is what governs service life. The limitation, stated plainly: I cannot give you a comparative table, because the literature reports strength and modulus in separate studies on separate formulations. This is a data point and a proposed reporting convention, not a ranking, and the value inherits the lower-bound modulus.");

/* ===================== 25 · application envelope ===================== */
pres.addSection({ title:"Application" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Application" });
H1(s, "Application envelope");
H2(s, 0.8, 1.42, 4.4, "Modular proposal derived from the measurements");
s.addImage({ path:G+"12-ic-mekan-render.jpeg", x:0.8, y:1.82, w:4.6, h:3.77, objectName:"ren" });
micro(s, 0.8, 5.72, 4.6, "Demountable modules on a reversible fixing, replaceable one unit at a time.");
vrule(s, 5.6, 1.42, 4.0);
H2(s, 6.1, 1.42, 6.4, "Conditions of use, each traced to a measured result");
[["Non-loadbearing surfaces","self-weight and handling loads only; σᴄ = 4.1 MPa"],
 ["Dry interiors","not wet rooms, not façades; absorption depends on coating integrity"],
 ["Away from ignition sources","self-extinguishing, but unclassified for reaction to fire"],
 ["Modular rather than sheet","damage is replaced one unit at a time"]]
 .forEach(([h,b],i)=>{ const y = 1.9 + i*0.88;
  s.addText(h, S({ x:6.1, y, w:6.4, h:0.3, fontSize:13, bold:true, color:K.ink }));
  s.addText(b, S({ x:6.1, y:y+0.33, w:6.4, h:0.4, fontSize:11.5, color:K.grey }));
  if (i<3) rule(s, 6.1, y+0.72, 6.4); });
rule(s, 6.1, 5.5, 6.4);
micro(s, 6.1, 5.7, 6.4, "Every constituent, the shellac included, is biodegradable; reversible fixing recovers the module intact. What is displaced is quarried limestone.");
txt(s, 0.8, 6.25, 4.6, 0.9, "I did not carry out a life-cycle assessment, so these are qualitative potentials rather than quantified claims.", false, 11.5);
s.addNotes("The application envelope follows from the measurements rather than being imposed on them, and each condition traces to a specific result. Non-loadbearing surfaces, carrying self-weight and handling loads only, because 4.1 megapascals supports nothing more. Dry interiors, not wet rooms and not facades, because water performance depends on coating integrity. Away from ignition sources: it self-extinguishes, but it carries no classification. And modular rather than sheet, which matters because damage is then replaced one unit at a time rather than refinishing a surface. On end of life: every constituent including the shellac is biodegradable, and reversible fixing allows the module to be recovered intact. What is displaced is quarried limestone, in a surface application rather than a downcycled one. The caveat: no life-cycle assessment was carried out, so these are qualitative potentials grounded in the protocol and not quantified claims.");

/* ===================== 26 · limitations and further work ===================== */
pres.addSection({ title:"Closing" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Closing" });
H1(s, "Limitations and further work");
H2(s, 0.8, 1.42, 11.7, "Each limitation, and the experiment that resolves it");
tbl(s, [
  [TH("Limitation"), TH("Resolved by")],
  [TL("No dispersion data — individual specimen values not retained"), TL("Repeat the series with individual values retained", ACC)],
  [TL("Compressive strain assumed from observation"), TL("Instrument the strain; measure the curve", ACC)],
  [TL("Shrinkage unquantified, so density is a lower bound"), TL("Record post-drying geometry", ACC)],
  [TL("Kerfed section calculated as a solid rectangle"), TL("Test an un-kerfed section", ACC)],
  [TL("Flexural series confounded — glycerol and solids moved together"), TL("Vary glycerol at constant solids concentration", ACC)],
  [TL("Durability, fire classification and life-cycle assessment untested"), TL("Outside this paper; named as further work", { color:K.grey })],
], { x:0.8, y:1.82, w:11.7, colW:[6.3,5.4], rowH:0.58 });
rule(s, 0.8, 6.1, 11.7);
em(s, 0.8, 6.3, 11.2, 0.5,
  "Every value I have given you today is a lower bound, and I would rather set that out myself than have you find it.", false, true);

s.addNotes("The limitations, each next to the experiment that resolves it, because that pairing is the point. No dispersion data, because individual specimen values were not retained - repeat the series and retain them. Compressive strain assumed from observation - instrument it. Shrinkage unquantified, so density is a lower bound - record the post-drying geometry. The kerfed section was calculated as a solid rectangle - test an un-kerfed one. The flexural series is confounded - vary glycerol at constant solids concentration. And durability, fire classification and life-cycle assessment are simply untested and outside this paper. Every value I reported today is a lower bound. I would rather set these out than have them found, and none of them is unknown to me.");

/* ===================== 28 · conclusions ===================== */
s = pres.addSlide({ masterName:"DARK", sectionTitle:"Closing" });
H1(s, "Conclusions", true);
[["A protocol that can be repeated","every production parameter reported"],
 ["Packing density governs compressive strength","not mineral content"],
 ["Plasticiser content sets brittle or ductile response","the transition is sharp"],
 ["Bio-polymer stiffness without thermal processing","water-cast, ambient-dried"],
 ["Strength on its own is not an adequate criterion","report σ and E together"]]
 .forEach(([h,b],i)=>{ const y = 1.85 + i*0.92;
  s.addText(String(i+1).padStart(2,"0"), S({ x:0.8, y:y+0.04, w:0.55, h:0.3, fontSize:12, bold:true, color:K.acc }));
  s.addText(h, S({ x:1.5, y, w:7.3, h:0.45, fontSize:13, bold:true, color:K.onD, valign:"middle" }));
  s.addText(b, S({ x:9.0, y:y+0.02, w:3.5, h:0.4, fontSize:12, color:K.onDg, valign:"middle" }));
  rule(s, 0.8, y+0.62, 11.7, true); });
s.addText("Betül Ünal   ·   b.unal91@gmail.com",
  S({ x:0.8, y:6.5, w:11.7, h:0.3, fontSize:12, bold:true, color:K.onD }));
micro(s, 0.8, 6.85, 11.2, "Testing: Advanced Construction Materials Research Laboratory, Hacettepe University, with thanks to Dr Hüseyin İlcan. Derived from the author's doctoral dissertation, Hacettepe University, 2025.", true);
s.addNotes("Five conclusions. A protocol that can be repeated, reported parameter by parameter. Packing density, not mineral content, governs compressive strength. Plasticiser content sets a brittle or a ductile response, and the transition is sharp. A water-cast, ambient-dried material reaches bio-polymer stiffness without thermal processing. And strength alone is an insufficient criterion for this class: deformation capacity governs service behaviour, so strength and modulus should be reported together. Thank you. I am happy to take questions.");

/* ===================== 29 · references ===================== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Closing" });
H1(s, "References");
const REFS = [
 "Adogla, F., Yalley, P.P.K. & Arkoh, M. (2016) Improving compressed laterite bricks using powdered eggshells. The International Journal of Engineering and Science, 5(4), 65–70.",
 "Altun, İ.A. (2006) Mechanical properties of travertine. Afyon Kocatepe University.",
 "Arnaud, L. & Gourlay, E. (2012) Experimental study of parameters influencing mechanical properties of hemp concretes. Construction and Building Materials, 28(1), 50–56.",
 "Ashby, M.F. (2011) Materials selection in mechanical design. 4th edn. Oxford: Butterworth-Heinemann.",
 "ASTM International (2017) ASTM D790-17: Flexural properties of unreinforced and reinforced plastics. West Conshohocken, PA.",
 "ASTM International (2018) ASTM D570-98: Water absorption of plastics. West Conshohocken, PA.",
 "Bhartiya, A. & Dubey, M. (2018) Replacement of cement with coconut shell ash and egg shell powder. IRJET, 5(6).",
 "Bilici, V.O., Peşmen, G., Yönetken, A. & Erol, A. (2023) Effect of egg-shell particulate reinforcement in ceramic-metal composites. Thermal Science, 27(4B), 3179–3188.",
 "Faruk, O., Bledzki, A.K., Fink, H.-P. & Sain, M. (2012) Biocomposites reinforced with natural fibers. Progress in Polymer Science, 37(11), 1552–1596.",
 "Hernández, V. et al. (2022) Agar biopolymer films for biodegradable packaging: a reference dataset. Materials, 15(11), 3954.",
 "Hirschler, M.M. (2013) Flammability and fire testing. In: Handbook of environmental degradation of materials. Oxford: William Andrew, 197–230.",
 "Holling, C.S. (1973) Resilience and stability of ecological systems. Annual Review of Ecology and Systematics, 4, 1–23.",
 "International Organization for Standardization (2020) ISO 11925-2: Ignitability of products subjected to direct impingement of flame — single-flame source test. Geneva.",
 "Islam, M.R., Tudryn, G., Bucinell, R., Schadler, L. & Picu, R.C. (2018) Mechanical behavior of mycelium-based particulate composites. Journal of Materials Science, 53, 16371–16382.",
 "Jones, M., Mautner, A., Luenco, S., Bismarck, A. & John, S. (2020) Engineered mycelium composite construction materials. Journal of Bionanoscience, 14(1), 1–10.",
 "Karana, E., Barati, B., Rognoli, V. & Zeeuw van der Laan, A. (2015) Material driven design (MDD). International Journal of Design, 9(2), 35–54.",
 "Kim, H.-S. & Pal, K. (2010) Mechanical properties of eggshell-filled poly(lactic acid) composites. Macromolecular Research.",
 "Klyosov, A.A. (2007) Wood-plastic composites. Hoboken, NJ: Wiley-Interscience.",
 "Mansour, G., Zoumaki, M., Tsongas, K. & Tzetzis, D. (2021) Microstructural and finite element analysis of soy protein isolate bioplastics. Materials, 14(19), 5479.",
 "Nemli, G. & Aydın, A. (2007) Evaluation of the physical and mechanical properties of particleboard. Building and Environment, 42(3), 1210–1214.",
 "Owuamanam, S. & Cree, D. (2020) Progress of bio-calcium carbonate waste eggshell and seashell fillers in polymer composites: a review. Journal of Composites Science, 4(2), 70.",
 "Pope, D.G. & Hudson, R.G. (1989) Mechanical properties of timber. Structural Engineer.",
 "Razzaq, A.K. & Yousif, R.A. (2017) Sustainability of HMA by using of egg shell powder. International Conference on Sustainable Futures, Bahrain.",
 "Shafiei, S. et al. (2019) Egg shell-derived calcium phosphate/carbon dot nanofibrous scaffolds. Materials Science and Engineering: C, 100, 564–575.",
 "Shah, D.U., Vollrath, F., Stires, J. & Deheyn, D.D. (2016) Housing fly larvae in silk: mechanical properties of mineral-filled biocomposites. Materials & Design, 109, 723–731.",
 "Skórczewska, K., Kwiatkowski, W. & Kwiatkowski, M. (2020) Poly(vinyl chloride) composites with waste eggshell as a natural filler. Polymer Composites, 41(9), 3580–3589.",
 "Soundara, B. & Vilasini, P.P. (2015) Effect of egg shell powder on the properties of clay. 50th Indian Geotechnical Conference, Pune.",
 "Teara, A. et al. (2019) Durability of fly ash and eggshell powder to replace cement in concrete. IOP Conf. Series: Earth and Environmental Science, 244, 012025.",
 "Torres, F.G., Troncoso, O.P., Piaggio, F. & Hijar, A. (2010) Structure–property relationships of a biopolymer network: the eggshell membrane. Acta Biomaterialia, 6(9), 3687–3693.",
 "Tutuş, A. et al. (2018) Evaluation of egg shells in wallpaper production. 1st International Technological Sciences and Design Symposium, Giresun.",
 "Velasco, P.M. & Gaona, J.L. (2011) Mechanical characterisation of compressed agricultural-waste panels. Construction and Building Materials.",
 "Victor, E.I., Louis, I.C., Alfred, N.O. & Ozioma, U.N. (2019) Use of chicken eggshells as fillers in flexible polyurethane foam. International Journal of Industrial Engineering, 3(1), 1–6.",
 "Vilarinho, I.S., Filippi, E. & Seabra, M.P. (2022) Development of eco-ceramic wall tiles with bioCaCO₃ from eggshells waste. Open Ceramics, 9, 100220.",
 "William, J.S. & Owen, J.C. (1995) Egg science and technology. 4th edn. Boca Raton, FL: CRC Press.",
 "Yönetken, A., Erol, A., Yakar, A. & Peşmen, G. (2016) Ceramic-metal composites produced by electroless Ni plating of AlN-Astaloy Cr-M. IJCMNMME, 10(3).",
 "Zhao, X. et al. (2022) Mechanical recycling of low-density polyethylene: property evolution. Resources, Conservation and Recycling.",
];
const HALF = Math.ceil(REFS.length/2);
[[0.8, REFS.slice(0,HALF)], [7.0, REFS.slice(HALF)]].forEach(([x,arr])=>{
  s.addText(arr.map((t,i)=>({ text:t, options:{ breakLine:i<arr.length-1 } })),
    S({ x, y:1.3, w:5.5, h:5.85, fontSize:8, color:K.body, valign:"top", paraSpaceAfter:4.5, lineSpacing:10 }));
});
vrule(s, 6.6, 1.35, 5.5);
micro(s, 0.8, 7.2, 11.7, "Standards applied: ASTM D790-17 · ISO 11925-2:2020 · ASTM D570-98(2018).");
s.addNotes("References, left up for questions.");

(async () => {
  await pres.writeFile({ fileName: OUT });
  const { applyTheme } = require("/root/.claude/skills/synced/ed12a668-6f07-4018-aad4-7be975f5699f_093145d0-7b3e-473d-b700-d8211791c264/pptx/scripts/apply_theme.js");
  await applyTheme(OUT, THEME);
  console.log("yazildi");
})();
