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
/* the only heading: two or three words */
const H1 = (s,t,d) => s.addText(t, S({ x:0.8, y:0.55, w:11.7, h:0.5, fontSize:20, bold:true,
  color:d?K.onD:K.ink, valign:"middle" }));
const lab = (s,x,y,w,t,d) => s.addText(t.toUpperCase(), S({ x,y,w, h:0.24, fontSize:8.5,
  bold:true, charSpacing:1.3, color:d?"8A8A8A":K.faint, valign:"middle" }));
const txt = (s,x,y,w,h,t,d,sz) => s.addText(t, S({ x,y,w,h, fontSize:sz||12,
  color:d?K.onD:K.body, valign:"top", lineSpacing:(sz||12)+6 }));
const dim = (s,x,y,w,h,t,d,sz) => s.addText(t, S({ x,y,w,h, fontSize:sz||10.5,
  color:d?K.onDg:K.grey, valign:"top", lineSpacing:(sz||10.5)+5 }));
const micro = (s,x,y,w,t,d) => s.addText(t, S({ x,y,w, h:0.5, fontSize:9,
  color:d?"8E8E8E":K.faint, valign:"top", lineSpacing:12.5 }));
const fig = (s,x,y,w,v,l,d,sz) => {
  s.addText(v, S({ x,y,w, h:(sz||34)/48, fontSize:sz||34, bold:true, color:K.acc, valign:"bottom" }));
  s.addText(l, S({ x, y:y+(sz||34)/48+0.04, w, h:0.46, fontSize:9.5, color:d?K.onDg:K.grey, valign:"top", lineSpacing:12.5 })); };
const list = (s,x,y,w,h,items,d,sz) => s.addText(
  items.map((t,i)=>({ text:t, options:{ bullet:{ characterCode:"2013" }, breakLine:i<items.length-1 } })),
  S({ x,y,w,h, fontSize:sz||11.5, color:d?K.onD:K.body, paraSpaceAfter:6, lineSpacing:(sz||11.5)+5 }));
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
/* caption band over a bleed photo */
function band(s, t, sub) {
  s.addShape(pres.ShapeType.rect, { x:0, y:6.05, w:13.33, h:1.45,
    fill:{ color:K.dark, transparency:6 }, line:{ color:K.dark, transparency:100 }, objectName:"bd" });
  s.addText(t, S({ x:0.8, y:6.3, w:8.0, h:0.38, fontSize:17, bold:true, color:K.onD }));
  if (sub) s.addText(sub, S({ x:0.8, y:6.72, w:11.7, h:0.3, fontSize:10.5, color:"CFCFCF" }));
}
let s;

/* ========== 1 cover ========== */
pres.addSection({ title:"Opening" });
s = pres.addSlide({ masterName:"FULL", sectionTitle:"Opening" });
s.addImage({ path:G+"01-prototip-cesitlemeleri.jpeg", x:0, y:0, w:13.33, h:7.5, objectName:"cov" });
s.addShape(pres.ShapeType.rect, { x:0, y:0, w:5.9, h:7.5, fill:{ color:K.dark }, line:{ color:K.dark, transparency:100 }, objectName:"panel" });
s.addText("Eggshell\u2013Agar\nBiocomposites", S({ x:0.85, y:2.2, w:4.6, h:1.6, fontSize:32, bold:true, color:K.onD, lineSpacing:42, valign:"bottom" }));
s.addText("Development and characterisation for sustainable interior applications",
  S({ x:0.85, y:3.95, w:4.4, h:0.7, fontSize:13, color:"C8C8C8", lineSpacing:19 }));
rule(s, 0.85, 4.95, 2.4, true);
s.addText([{ text:"Betül Ünal", options:{ bold:true, color:K.onD, fontSize:13, breakLine:true } },
           { text:"Department of Interior Architecture", options:{ color:K.onDg, fontSize:11, breakLine:true } },
           { text:"Cappadocia University", options:{ color:K.onDg, fontSize:11 } }],
  S({ x:0.85, y:5.2, w:4.4, h:1.0 }));
s.addText("ICSMMEP-26   ·   MECCA   ·   3\u20134 NOVEMBER 2026",
  S({ x:0.85, y:6.5, w:4.6, h:0.3, fontSize:8.5, bold:true, charSpacing:1.4, color:K.onDf }));
s.addNotes("Good morning. Betul Unal, Department of Interior Architecture, Cappadocia University. What you are looking at is the material: a composite of waste eggshell bound in agar. Over the next fifteen minutes I will give you the production protocol, the characterisation, and an argument about how materials like this should be evaluated.");

/* ========== 2 the waste ========== */
pres.addSection({ title:"Position" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Position" });
H1(s, "The waste");
s.addImage({ path:G+"03-uretim-sureci.jpeg", x:0, y:1.35, w:13.33, h:4.26, objectName:"waste" });
fig(s, 0.8, 5.85, 2.4, "94%", "calcium carbonate", false, 30);
fig(s, 3.6, 5.85, 2.4, "> 12", "months of collection", false, 30);
fig(s, 6.4, 5.85, 2.4, "1", "local bakery", false, 30);
dim(s, 9.3, 5.95, 3.2, 1.0, "Porous, protein-bound crystalline structure. Specific gravity 0.85–2.66 — lighter than most mineral fillers.");
s.addNotes("This is where the material starts. Eggshell is generated continuously as food waste and landfilled at scale. Chemically it is almost pure calcium carbonate, with a porous, protein-bound crystalline structure and a specific gravity lower than most mineral fillers. Every shell in this study came from one bakery, collected over more than a year. The material argument for eggshell is settled - that is not what this paper is about.");

/* ========== 3 the problem — diagram ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Position" });
H1(s, "The problem");
function stack(x, y, w, topTxt, topSub, botTxt, botSub, hot) {
  const tH = 1.5, bH = 2.1;
  s.addShape(pres.ShapeType.rect, { x, y, w, h:tH, fill:{ color:K.panel }, line:{ color:K.line, width:1 }, objectName:"t"+x });
  s.addShape(pres.ShapeType.rect, { x, y:y+tH, w, h:bH, fill:{ color:hot?K.acc:"FFFFFF" }, line:{ color:hot?K.acc:K.line, width:1 }, objectName:"b"+x });
  s.addText(topTxt, S({ x:x+0.35, y:y+0.42, w:w-0.7, h:0.34, fontSize:14, bold:true, color:K.ink }));
  s.addText(topSub, S({ x:x+0.35, y:y+0.8, w:w-0.7, h:0.4, fontSize:11, color:K.grey }));
  s.addText(botTxt, S({ x:x+0.35, y:y+tH+0.5, w:w-0.7, h:0.34, fontSize:14, bold:true, color:hot?K.onD:K.ink }));
  s.addText(botSub, S({ x:x+0.35, y:y+tH+0.9, w:w-0.7, h:0.85, fontSize:11, color:hot?"F2E4DE":K.grey, lineSpacing:15 }));
}
lab(s, 0.8, 1.5, 5.5, "Established practice");
stack(0.8, 1.8, 5.5, "Mineral phase", "waste eggshell, 5–30% of matrix",
  "Binding phase", "Portland clinker · bitumen · lime · ceramic body · PLA, epoxy, PVC, PU", false);
lab(s, 7.0, 1.5, 5.5, "This study");
stack(7.0, 1.8, 5.5, "Mineral phase", "waste eggshell, 66% of solids",
  "Binding phase", "agar, plasticised with glycerol", true);
s.addShape(pres.ShapeType.rightArrow, { x:6.45, y:3.4, w:0.45, h:0.32, fill:{ color:K.acc }, line:{ color:K.acc, transparency:100 }, objectName:"ar" });
dim(s, 0.8, 5.65, 5.5, 0.8, "The waste is valorised. The matrix is not.");
dim(s, 7.0, 5.65, 5.5, 0.8, "Both phases biological and biodegradable.");
micro(s, 0.8, 6.45, 11.7, "Teara et al. 2019 · Adogla et al. 2016 · Razzaq & Yousif 2017 · Soundara & Vilasini 2015 · Vilarinho et al. 2022 · Owuamanam & Cree 2020");
s.addNotes("Here is the problem, and it is a problem about the binder rather than the filler. Eggshell valorisation is well established - cement replacement, brick stabilisation, asphalt binders, lime substitution, ceramic bodies, particulate filler in thermoplastics, with loadings from five to thirty percent. But look at the lower block in each stack. In every one of those cases the binding phase is petrochemical, clinker-based or ceramic. The waste is valorised; the matrix is not. This study replaces the binder too, so both phases are biological.");

/* ========== 4 the binder ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Position" });
H1(s, "The binder");
txt(s, 0.8, 1.5, 5.5, 1.4, "Agar is a thermoreversible polysaccharide from red seaweed. Its behaviour with glycerol has been mapped systematically — 32 formulations, released as an open dataset.", false, 13);
micro(s, 0.8, 3.1, 5.5, "Hernández et al. (2022), Materials 15(11), 3954");
lab(s, 0.8, 3.75, 5.5, "But only as a film");
txt(s, 0.8, 4.05, 5.5, 1.3, "Unfilled, thin, tested in uniaxial tension, for packaging. Never as the binder of a mineral-filled cast solid in bending.", false, 13);
vrule(s, 6.6, 1.5, 4.6);
lab(s, 7.1, 1.5, 5.4, "The shift");
tbl(s, [
  [TH("—"), TH("Film literature"), TH("This study")],
  [TL("Form"), TL("Thin cast film"), TL("Cast solid, 20–50 mm")],
  [TL("Filler"), TL("Unfilled"), TL("Mineral, 66% of solids")],
  [TL("Loading"), TL("Uniaxial tension"), TL("Compression, bending")],
  [TL("Use"), TL("Packaging"), TL("Interior surfaces")],
], { x:7.1, y:1.8, w:5.4, colW:[1.3,1.95,2.15], rowH:0.42 });
dim(s, 7.1, 3.95, 5.4, 0.8, "The compositional logic carries over. The form and the loading case do not.");
s.addNotes("The binder is agar - a thermoreversible polysaccharide from red seaweed, which melts on heating and sets on cooling without chemical crosslinking. Its behaviour with glycerol is reasonably well mapped: Hernandez and colleagues ran thirty-two agar, glycerin and water formulations by design of experiments in 2022 and released the dataset openly. But all of that is unfilled thin film, tested in tension, for packaging. Nobody has characterised agar as the binder of a mineral-filled cast solid in bending, which is the actual loading case for an interior surface. The compositional logic carries over. The form and the loading case do not.");

/* ========== 5 the gap ========== */
s = pres.addSlide({ masterName:"DARK", sectionTitle:"Position" });
H1(s, "The gap", true);
txt(s, 0.8, 1.5, 5.3, 1.5, "Materiom publishes biomaterial recipes under CC-BY-SA, archives each as prior art, and indexes property data with citable DOIs. The infrastructure for shared procedures is built.", true, 13);
fig(s, 0.8, 3.4, 2.2, "4", "recipes with published property data", true, 54);
lab(s, 3.5, 3.5, 2.6, "Which are", true);
dim(s, 3.5, 3.8, 2.6, 1.6, "agar bioplastic\ngelatin bioplastic\nmycelium–walnut shell\nmussel shell–sucrose ceramic", true, 11);
vrule(s, 6.6, 1.5, 4.4, true);
lab(s, 7.1, 1.5, 5.4, "What that means", true);
txt(s, 7.1, 1.8, 5.4, 2.0, "The nearest analogue is the mussel shell–sucrose ceramic: a shell mineral in a biological binder. Nothing couples a shell mineral to agar. Nothing reports compressive, flexural, ignitability and hygric data for one formulation family.", true, 13);
s.addText("A protocol and a property set entering that commons.",
  S({ x:7.1, y:4.3, w:5.4, h:0.8, fontSize:15, bold:true, color:K.acc, lineSpacing:21 }));
micro(s, 0.8, 6.4, 6.0, "materiom.org/data, accessed October 2026", true);
s.addNotes("Claiming a gap is cheap, so let me measure it. Materiom is an open commons for biomaterial recipes - CC-BY-SA licensed, each recipe archived as prior art, property data indexed with citable DOIs. The infrastructure exists. But property data exists for four recipes. Four. The nearest analogue to this work is the last one, a shell mineral in a biological binder. Nothing couples a shell mineral to agar, and nothing reports compressive, flexural, ignitability and hygric data for one formulation family. So the contribution is not originality of idea. It is a protocol and a property set entering a commons that is four recipes deep.");

/* ========== 6 aim and scope ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Position" });
H1(s, "Aim and scope");
lab(s, 0.8, 1.5, 5.5, "Aim");
s.addText("To document a reproducible production protocol for a fully bio-based eggshell composite, and to characterise what it can and cannot do.",
  S({ x:0.8, y:1.8, w:5.5, h:1.2, fontSize:16, color:K.ink, lineSpacing:24 }));
rule(s, 0.8, 3.3, 5.5);
lab(s, 0.8, 3.55, 5.5, "Not in scope");
list(s, 0.8, 3.85, 5.5, 1.8, [
  "Structural or loadbearing use",
  "Durability and accelerated ageing",
  "Reaction-to-fire classification",
  "Life-cycle assessment",
], false, 12.5);
vrule(s, 6.6, 1.5, 4.4);
lab(s, 7.1, 1.5, 5.4, "In scope");
tbl(s, [
  [TH("Dimension"), TH("This study")],
  [TL("Formulations"), TL("Five — three compression, two flexure")],
  [TL("Specimens"), TL("Three per formulation")],
  [TL("Properties"), TL("Compression, flexure, ignitability, absorption, density")],
  [TL("Standards"), TL("ASTM D790-17 · ISO 11925-2 · ASTM D570")],
  [TL("Conditions"), TL("Ambient cure, single laboratory")],
  [TL("Application"), TL("Non-loadbearing interior surfaces")],
], { x:7.1, y:1.8, w:5.4, colW:[1.8,3.6], rowH:0.42 });
s.addNotes("The aim is narrow and I want to state it narrowly: document a protocol others can repeat, and characterise what the material can and cannot do. The right-hand column is what is in scope. The left-hand list is what is not, and I will come back to each of those at the end. In particular there is no durability testing, no fire classification and no life-cycle assessment in this work, so nothing I say today should be read as a performance specification.");

/* ========== 7 method — diagram ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Position" });
H1(s, "Method");
const MS = [["Produce","Develop the composite and record every parameter","Iterative formulation, over one year"],
            ["Measure","Characterise against published standards","Compression · flexure · fire · absorption"],
            ["Position","Benchmark against two material families","Conventional interior · bio-based composites"],
            ["Propose","Derive an evaluation criterion from the behaviour","Deformation capacity alongside strength"]];
const MX=0.8, MW=2.78, MG=0.33;
MS.forEach(([h,b,c],i)=>{
  const x = MX + i*(MW+MG);
  s.addShape(pres.ShapeType.ellipse, { x, y:1.75, w:0.46, h:0.46,
    fill:{ color:i===3?K.acc:"FFFFFF" }, line:{ color:i===3?K.acc:K.ink, width:1.25 }, objectName:"mo"+i });
  s.addText(String(i+1), S({ x, y:1.75, w:0.46, h:0.46, fontSize:12, bold:true,
    color:i===3?K.onD:K.ink, align:"center", valign:"middle" }));
  s.addText(h, S({ x, y:2.45, w:MW, h:0.36, fontSize:17, bold:true, color:K.ink }));
  s.addText(b, S({ x, y:2.9, w:MW-0.2, h:0.9, fontSize:12, color:K.body, lineSpacing:17 }));
  rule(s, x, 3.95, MW-0.2);
  s.addText(c, S({ x, y:4.12, w:MW-0.2, h:0.6, fontSize:10, color:K.grey, lineSpacing:14 }));
  if (i<3) s.addShape(pres.ShapeType.rightArrow, { x:x+MW+0.04, y:1.88, w:0.24, h:0.18,
    fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"ma"+i });
});
rule(s, 0.8, 5.2, 11.7);
dim(s, 0.8, 5.4, 11.7, 0.9, "Material-driven: the properties are measured first and the application is derived from them, rather than the material being selected to fit a predetermined form. The design proposal shown later follows from the measurements, not the other way round.");
s.addNotes("Four steps, and the order matters. Produce, recording every parameter. Measure against published standards. Position against two material families - conventional interior materials and bio-based composites. And then propose an evaluation criterion derived from how the material actually behaves. This is a material-driven sequence: the properties are measured first and the application is derived from them, rather than the material being chosen to fit a form that was decided in advance. The design proposal I show near the end follows from the measurements, not the other way round.");

/* ========== 8 questions and hypothesis ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Position" });
H1(s, "Questions");
[["01","Which formulation variable governs compressive strength?"],
 ["02","What does plasticiser content do to flexural behaviour?"],
 ["03","How does it compare with conventional interior materials?"],
 ["04","How does it compare with other bio-based composites?"],
 ["05","Is compressive strength the right criterion at all?"]]
 .forEach(([n,q],i)=>{ const y=1.5+i*0.72;
  s.addText(n, S({ x:0.8, y:y+0.08, w:0.6, h:0.3, fontSize:11, bold:true, color:K.acc }));
  s.addText(q, S({ x:1.6, y, w:10.9, h:0.5, fontSize:15, color:K.ink }));
  if (i<4) rule(s, 0.8, y+0.55, 11.7); });
s.addShape(pres.ShapeType.rect, { x:0.8, y:5.3, w:11.7, h:1.35, fill:{ color:K.panel },
  line:{ color:K.panel, transparency:100 }, objectName:"hyp" });
lab(s, 1.15, 5.52, 11.0, "Hypothesis");
s.addText("A fully bio-based eggshell–agar composite can be produced repeatably under ambient conditions, and its performance for interior surfaces is governed by deformation capacity rather than by strength.",
  S({ x:1.15, y:5.82, w:11.0, h:0.7, fontSize:14, bold:true, color:K.ink, lineSpacing:20 }));
s.addNotes("Five questions. The first two are formulation questions, the next two benchmarking, and the fifth is the one I actually care about. The hypothesis has two clauses, and the paper tests both: first, that the composite can be produced repeatably under ambient conditions; second, that for interior surfaces its performance is governed by deformation capacity rather than strength. A note on lineage: the dissertation this derives from states a broader hypothesis, framed around spatial resilience in interior design. What you see here is the materials-engineering slice of it, scoped to what these tests can actually support.");

/* ========== 7 the material — full bleed ========== */
pres.addSection({ title:"Material" });
s = pres.addSlide({ masterName:"FULL", sectionTitle:"Material" });
s.addImage({ path:G+"01-prototip-cesitlemeleri.jpeg", x:0, y:0, w:13.33, h:7.5, objectName:"mat" });
band(s, "Four constituents, all biodegradable",
  "Waste eggshell powder · agar · glycerol · water, with a shellac finish. Colour and texture vary from natural pigments and mould geometry at constant composition.");
s.addNotes("This is the material. Four constituents: waste eggshell powder as the mineral phase, agar as the binder, glycerol as the plasticiser, water as the carrier, and a shellac finish where water resistance matters. Everything you see here is one formulation family - the variation in colour and texture comes from natural pigments and mould geometry, not from different compositions. Beetroot gives the dark tones.");

/* ========== stage 1 — mineral fraction ========== */
pres.addSection({ title:"Protocol" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Protocol" });
H1(s, "Stage 1 — the mineral");
const P1 = [["Whole shell","collected from one bakery","—"],
            ["Cleaned","membrane and residue removed by hand","—"],
            ["Heat-treated","decontamination and drying","120 °C, 20 min"],
            ["Milled","laboratory mechanical grinder","to homogeneous powder"],
            ["Sieved","passing fraction only","150 µm mesh"]];
const QX=0.8, QW=2.15, QG=0.24;
P1.forEach(([h,b,par],i)=>{
  const x = QX + i*(QW+QG);
  const d = 0.9 - i*0.14;
  s.addShape(pres.ShapeType.ellipse, { x:x+(QW-d)/2, y:1.75+(0.9-d)/2, w:d, h:d,
    fill:{ color:i===4?K.acc:K.panel }, line:{ color:i===4?K.acc:K.line, width:1 }, objectName:"pc"+i });
  s.addText(h, S({ x, y:2.85, w:QW, h:0.32, fontSize:13, bold:true, color:K.ink, align:"center" }));
  s.addText(b, S({ x, y:3.2, w:QW, h:0.65, fontSize:10.5, color:K.grey, align:"center", lineSpacing:14 }));
  s.addText(par, S({ x, y:3.95, w:QW, h:0.3, fontSize:11, bold:true, color:i>1?K.acc:K.faint, align:"center" }));
  if (i<4) s.addShape(pres.ShapeType.rightArrow, { x:x+QW+0.02, y:2.13, w:0.2, h:0.15,
    fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"pa"+i });
});
rule(s, 0.8, 4.6, 11.7);
lab(s, 0.8, 4.8, 5.5, "Why 150 µm");
dim(s, 0.8, 5.1, 5.5, 1.0, "Chosen to match the particle size used in the eggshell polymer-composite literature, so the mineral phase here is comparable with that work.");
lab(s, 7.1, 4.8, 5.4, "Why not sterilisation");
dim(s, 7.1, 5.1, 5.4, 1.0, "Dry-heat sterilisation needs far higher temperatures for far longer, and sterility was not verified. This step is decontamination and drying.");
s.addNotes("Stage one, the mineral. Whole shell from one bakery, cleaned of membrane and residue by hand, heat-treated at 120 degrees for twenty minutes, milled to a homogeneous powder, and sieved through a 150 micrometre mesh with only the passing fraction used. The circles shrink to show what is actually happening: progressive size reduction. Two things worth saying. The 150 micrometre figure was chosen to match the particle size used in the eggshell polymer-composite literature, so the mineral phase here is comparable with that body of work. And I call the 120 degree step decontamination and drying rather than sterilisation, because dry-heat sterilisation needs around 160 to 170 degrees for one to two hours and we did not verify sterility.");

/* ========== stage 2 — binder, thermal profile ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Protocol" });
H1(s, "Stage 2 — the binder");
const bx=1.6, by=1.95, bh=2.9, bw=9.6;
const y95 = by+0.35, y80 = by+1.0, yAmb = by+bh;
s.addShape(pres.ShapeType.rect, { x:bx, y:by, w:0.02, h:bh, fill:{ color:K.line }, line:{ color:K.line, transparency:100 }, objectName:"tv" });
s.addShape(pres.ShapeType.rect, { x:bx, y:yAmb, w:bw, h:0.02, fill:{ color:K.line }, line:{ color:K.line, transparency:100 }, objectName:"th" });
s.addShape(pres.ShapeType.line, { x:bx, y:y95, w:1.9, h:yAmb-y95, flipV:true, line:{ color:K.ink, width:2.25 }, objectName:"ramp" });
s.addShape(pres.ShapeType.rect, { x:bx+1.9, y:y95, w:2.2, h:0.03, fill:{ color:K.ink }, line:{ color:K.ink, transparency:100 }, objectName:"pl95" });
s.addShape(pres.ShapeType.line, { x:bx+4.1, y:y95, w:0.75, h:y80-y95, line:{ color:K.ink, width:2.25 }, objectName:"drop" });
s.addShape(pres.ShapeType.rect, { x:bx+4.85, y:y80, w:4.6, h:0.03, fill:{ color:K.ink }, line:{ color:K.ink, transparency:100 }, objectName:"pl80" });
s.addText("95 °C", S({ x:bx-1.0, y:y95-0.16, w:0.9, h:0.3, fontSize:13, bold:true, color:K.acc, align:"right" }));
s.addText("80 °C", S({ x:bx-1.0, y:y80-0.16, w:0.9, h:0.3, fontSize:13, bold:true, color:K.acc, align:"right" }));
dim(s, bx-1.0, yAmb-0.16, 0.9, 0.3, "ambient", false, 10);
dim(s, bx, yAmb+0.14, 3.0, 0.3, "0", false, 10);
s.addText("55 min total", S({ x:bx+bw-2.2, y:yAmb-0.42, w:2.2, h:0.3, fontSize:11, bold:true, color:K.ink, align:"right" }));
[[bx+0.15,"Water + glycerol","pre-mixed, no solids yet"],
 [bx+2.1,"Agar dissolving","added incrementally, stirred"],
 [bx+5.1,"Viscosity develops","continuous stirring"],
 [bx+8.0,"Shell added","incrementally, near the end"]]
 .forEach(([x,h,b],i)=>{
  s.addShape(pres.ShapeType.ellipse, { x:x+0.5, y:(i===0?yAmb:(i===1?y95:y80))-0.07, w:0.14, h:0.14,
    fill:{ color:K.acc }, line:{ color:K.acc, transparency:100 }, objectName:"mk"+i });
  s.addText(h, S({ x, y:5.1, w:2.2, h:0.3, fontSize:12, bold:true, color:K.ink }));
  s.addText(b, S({ x, y:5.42, w:2.2, h:0.5, fontSize:10, color:K.grey, lineSpacing:13 }));
  s.addShape(pres.ShapeType.rect, { x:x+0.57, y:(i===0?yAmb:(i===1?y95:y80)), w:0.012,
    h:5.05-(i===0?yAmb:(i===1?y95:y80)), fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"dl"+i });
});
micro(s, 0.8, 6.3, 11.7, "Schematic. The two set points and the total heating time are recorded; intermediate ramp rates are not, and are drawn indicatively. Stirring was manual throughout: shear rate is not a controlled quantity.");
s.addNotes("Stage two, the binder, drawn as a temperature profile because that is what it is. Water and glycerol are pre-mixed first, before any solids go in. Agar is then added incrementally under continuous stirring - bulk addition forms agglomerates that never redisperse. The mixture is taken to 95 degrees and held until the agar is fully in solution, because if viscosity builds before complete dissolution you get a patchy gel network. Then the temperature drops to 80 and is held there while viscosity develops, and the shell fraction goes in incrementally near the end - earlier and it sediments out. Fifty-five minutes in total. I should be clear this is a schematic: the two set points and the total time are recorded, the intermediate ramp rates are not. And stirring was manual, so shear rate is not a controlled quantity.");

/* ========== stage 3 — casting and cure ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Protocol" });
H1(s, "Stage 3 — casting and cure");
const cx=0.8, cy=2.3, cw=11.7, ch=0.78;
s.addShape(pres.ShapeType.rect, { x:cx, y:cy, w:cw*0.36, h:ch, fill:{ color:K.panel }, line:{ color:K.line, width:1 }, objectName:"c1" });
s.addShape(pres.ShapeType.rect, { x:cx+cw*0.36, y:cy, w:cw*0.64, h:ch, fill:{ color:"FFFFFF" }, line:{ color:K.ink, width:1 }, objectName:"c2" });
s.addText("In mould", S({ x:cx+0.3, y:cy+0.14, w:3.0, h:0.3, fontSize:13, bold:true, color:K.ink }));
dim(s, cx+0.3, cy+0.44, 3.4, 0.3, "setting and initial drying", false, 10.5);
s.addText("Ambient consolidation", S({ x:cx+cw*0.36+0.3, y:cy+0.14, w:4.0, h:0.3, fontSize:13, bold:true, color:K.ink }));
dim(s, cx+cw*0.36+0.3, cy+0.44, 5.0, 0.3, "~23 °C, shielded from direct sun and air movement", false, 10.5);
[[cx,"Day 0","cast into silicone moulds"],
 [cx+cw*0.36,"Day 4","demoulded"],
 [cx+cw-1.4,"Day 11","finished specimen"]]
 .forEach(([x,d,b],i)=>{
  s.addShape(pres.ShapeType.rect, { x:(i===2?x+1.39:x), y:cy-0.5, w:0.02, h:0.42,
    fill:{ color:K.ink }, line:{ color:K.ink, transparency:100 }, objectName:"tk"+i });
  s.addText(d, S({ x:(i===2?x-0.1:x+0.1), y:cy-0.92, w:1.5, h:0.3, fontSize:13, bold:true,
    color:K.acc, align:(i===2?"right":"left") }));
  s.addText(b, S({ x:(i===2?x-1.1:x+0.1), y:cy+ch+0.16, w:2.6, h:0.3, fontSize:10.5,
    color:K.grey, align:(i===2?"right":"left") }));
});
rule(s, 0.8, 4.1, 11.7);
lab(s, 0.8, 4.3, 5.5, "Why silicone");
dim(s, 0.8, 4.6, 5.5, 0.9, "Flexible enough to release without a parting agent and without damaging the partially consolidated specimen. 50 mm cube moulds for compression, flat moulds otherwise.");
lab(s, 7.1, 4.3, 5.4, "No oven at any stage");
dim(s, 7.1, 4.6, 5.4, 0.9, "After the 55-minute cook the material receives no further heat input. The entire cure is at room temperature.");
s.addShape(pres.ShapeType.rect, { x:0.8, y:5.75, w:11.7, h:0.95, fill:{ color:K.panel },
  line:{ color:K.panel, transparency:100 }, objectName:"disc" });
s.addText([{ text:"Disclosure   ", options:{ bold:true, color:K.acc } },
           { text:"the composite shrinks appreciably as water evaporates. Cross-sections were measured at test time, but post-drying dimensions were not logged, so every dimension quoted in this talk is a mould dimension.", options:{ color:K.ink } }],
  S({ x:1.15, y:5.95, w:11.0, h:0.6, fontSize:12, lineSpacing:17 }));
s.addNotes("Stage three, casting and cure, drawn as a timeline. Day zero, cast into silicone moulds - silicone because it flexes enough to release without a parting agent and without damaging a specimen that has not fully consolidated. Four days in mould for setting and initial drying. Demoulded on day four, then seven more days at around 23 degrees, shielded from direct sun and forced air movement. Day eleven, finished specimen. And note: after the fifty-five minute cook the material receives no further heat input at all. The entire cure is at room temperature, which matters for the energy argument later. The disclosure, which I will repeat because it affects every number that follows: the composite shrinks appreciably as water evaporates, cross-sections were measured at test time but post-drying dimensions were not logged, so every dimension I quote today is a mould dimension.");

/* ========== 10 formulations ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Protocol" });
H1(s, "Formulations");
tbl(s, [
  [TH("ID"), TH("Test"), TH("Water g"), TH("Shell g"), TH("Agar g"), TH("Glycerol g"), TH("Solids g"), TH("Shell : binder"), TH("Solids : water"), TH("Glycerol % solids")],
  [TD("C1"), TL("Compression"), TD("325"), TD("80"),  TD("35"), TD("5"),  TD("120"), TD("2.00",{bold:true}), TD("0.37"), TD("4.2")],
  [TD("C2"), TL("Compression"), TD("310"), TD("90"),  TD("40"), TD("5"),  TD("135"), TD("2.00",{bold:true}), TD("0.44"), TD("3.7")],
  [TD("C3"), TL("Compression"), TD("280"), TD("110"), TD("45"), TD("10"), TD("165"), TD("2.00",{bold:true}), TD("0.59"), TD("6.1")],
  [TD("F1"), TL("Flexure"),     TD("450"), TD("190"), TD("70"), TD("60"), TD("320"), TD("1.46"), TD("0.71"), TD("18.8")],
  [TD("F2"), TL("Flexure"),     TD("480"), TD("190"), TD("70"), TD("30"), TD("290"), TD("1.90"), TD("0.60"), TD("10.3")],
], { x:0.8, y:1.5, w:11.7, colW:[0.7,1.8,0.95,0.9,0.85,1.2,0.95,1.5,1.5,1.35], rowH:0.4 });
lab(s, 0.8, 4.2, 5.5, "Compression series");
txt(s, 0.8, 4.5, 5.5, 0.9, "Shell : binder is held at exactly 2.00. The only variable is solids concentration.", false, 13);
lab(s, 7.0, 4.2, 5.5, "Flexural series — confound");
txt(s, 7.0, 4.5, 5.5, 1.0, "Glycerol was halved at fixed batch mass, so water rose with it. The plasticiser effect is not isolated.", false, 13);
micro(s, 0.8, 5.9, 11.7, "Three specimens per formulation. Values are means; individual specimen values were not retained, so standard deviations are not available.");
s.addNotes("The formulation matrix with derived ratios. Two things to read. In the compression series shell-to-binder is exactly two point zero zero in all three mixes - that was not planned as a control, but it means the only thing that varies is solids concentration. In the flexural series I declare a confound: glycerol was halved but batch mass was fixed at 770 grams, so water rose to compensate and the other ratios shifted with it. The plasticiser effect is not cleanly isolated.");

/* ========== 11 tests ========== */
pres.addSection({ title:"Results" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Tests");
tbl(s, [
  [TH("Property"), TH("Standard"), TH("Specimen"), TH("n"), TH("Measured")],
  [TL("Compressive behaviour"), TL("Cube compression"), TL("50 mm cube moulds"), TD("3 per mix"), TL("Max load; compressive stress")],
  [TL("Flexural behaviour"), TL("ASTM D790-17"), TL("180 × 60 × 20 mm, 120 mm span"), TD("3 per mix"), TL("Flexural strength; modulus")],
  [TL("Reaction to fire"), TL("ISO 11925-2:2020"), TL("40 × 50 mm, 45°, 15 s edge flame"), TD("2"), TL("Time to ignition; to extinguish")],
  [TL("Water absorption"), TL("ASTM D570-98"), TL("40 × 50 mm, shellac-coated"), TD("1"), TL("Mass gain, 24 h immersion")],
  [TL("Bulk density"), TL("Gravimetric"), TL("50 mm cube"), TD("1"), TL("Mass / mould volume")],
], { x:0.8, y:1.5, w:11.7, colW:[2.5,2.3,3.5,1.1,2.3], rowH:0.46 });
rule(s, 0.8, 4.5, 11.7);
txt(s, 0.8, 4.7, 11.7, 0.9, "Mechanical values are means of three specimens; individual values were not retained, so standard deviations cannot be reported. Fire, absorption and density rest on single determinations and are indicative, not characteristic.", false, 12.5);
micro(s, 0.8, 5.85, 11.7, "All testing: Advanced Construction Materials Research Laboratory, Hacettepe University.");
s.addNotes("The test programme. I want the reporting convention on the record before any numbers appear: mechanical values are means of three specimens, individual values were not retained so I cannot give standard deviations, and the fire, absorption and density figures are single determinations - indicative, not characteristic.");

/* ========== 12 compression ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Compression");
tbl(s, [
  [TH("ID"), TH("Solids : water"), TH("Fₘₐₓ kN"), TH("σᴄ MPa")],
  [TD("C1"), TD("0.37"), TD("3.89"), TD("2.55")],
  [TD("C2"), TD("0.44"), TD("4.30"), TD("3.12")],
  [TD("C3"), TD("0.59"), TD("6.80",ACC), TD("4.10",ACC)],
], { x:0.8, y:1.6, w:4.6, colW:[0.7,1.6,1.15,1.15], rowH:0.42 });
rule(s, 0.8, 3.4, 4.6);
s.addText("Strength rises with solids concentration, not with mineral content.",
  S({ x:0.8, y:3.65, w:4.6, h:0.8, fontSize:15, bold:true, color:K.ink, lineSpacing:21 }));
dim(s, 0.8, 4.6, 4.6, 1.5, "Shell : binder is fixed at 2.00 across the series, so packing density is the only variable. Linear across the range tested, R² = 0.99 — three formulations, so a hypothesis, not a law.");
s.addChart(pres.ChartType.bar, [{ name:"σ", labels:["C1  0.37","C2  0.44","C3  0.59"], values:[2.55,3.12,4.10] }],
  { x:5.9, y:1.6, w:6.6, h:4.6, barDir:"col", chartColors:[K.ink], showLegend:false,
    showValue:true, dataLabelPosition:"outEnd", dataLabelColor:K.ink, dataLabelFontSize:13,
    dataLabelFontFace:"+mn-lt", dataLabelFormatCode:"0.00",
    catAxisLabelColor:K.grey, catAxisLabelFontSize:11, catAxisLabelFontFace:"+mn-lt",
    valAxisLabelColor:K.grey, valAxisLabelFontSize:10, valAxisLabelFontFace:"+mn-lt",
    valAxisTitle:"Compressive stress (MPa)", showValAxisTitle:true, valAxisTitleColor:K.grey,
    valAxisTitleFontSize:10.5, valAxisTitleFontFace:"+mn-lt", valAxisMaxVal:5,
    valGridLine:{ color:K.line, size:1 }, catGridLine:{ style:"none" }, objectName:"cc" });
s.addNotes("The compression result. Because shell-to-binder is fixed at two point zero zero across the series, solids concentration is the only variable - and compressive stress rises linearly with it, R-squared of 0.99 over the range 0.37 to 0.59. Three points will fit almost any line, so I am calling this a hypothesis rather than a law. But it has a clear physical reading: strength here is governed by packing density, not by mineral content as such. If that is right, the route to a stronger composite is to remove water, not to add shell. The fitted relation is sigma equals 6.93 times the solids-to-water ratio plus 0.04, if anyone wants it.");

/* ========== 13 crushing — big photo ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Crushing");
s.addImage({ path:G+"04-basma-ficilasmis-kup.jpeg", x:0.8, y:1.5, w:2.5, h:5.41, objectName:"cube" });
s.addImage({ path:G+"05b-basma-egrisi.png", x:3.9, y:2.3, w:5.2, h:2.91, objectName:"curve" });
lab(s, 3.9, 1.95, 5.2, "Compressive stress – strain, C3");
vrule(s, 9.6, 1.5, 5.0);
lab(s, 10.1, 1.5, 2.4, "The curve");
list(s, 10.1, 1.85, 2.4, 3.2, [
  "Linear to about 1 MPa",
  "Progressive stiffness loss",
  "Peak near 10% strain",
  "No abrupt load drop",
  "Deformation with retained integrity",
], false, 11.5);
s.addText("It crushes.\nIt does not fracture.",
  S({ x:10.1, y:5.2, w:2.4, h:0.9, fontSize:15, bold:true, color:K.acc, lineSpacing:21 }));
micro(s, 0.8, 6.55, 11.7, "Strain derived from an assumed 10% maximum deformation based on observation, not instrumented measurement.  ·  Bulk density 1.38 g/cm³, mould-volume basis.");
s.addNotes("This is the failure mode, and it is what I would ask about if I were sitting where you are. The curve is linear to about one megapascal, then stiffness falls away progressively as the agar network yields and the mineral redistributes. Peak arrives near ten percent strain with no abrupt drop, and beyond peak the specimen keeps deforming while holding together. Look at the photograph: the cube has barrelled, it is shorter and wider, and it is still one object. Energy is absorbed rather than released. One honesty point: the strain axis derives from an assumed ten percent maximum deformation based on observation, not instrumented measurement.");

/* ========== 14 flexure ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Flexure");
tbl(s, [
  [TH("ID"), TH("Glycerol % solids"), TH("Fₘₐₓ N"), TH("σꜰ MPa"), TH("Eꜰ MPa"), TH("ε peak")],
  [TD("F1"), TD("18.8"), TD("—"), TD("not measurable",{italic:true}), TD("—"), TD("—")],
  [TD("F2"), TD("10.3"), TD("310"), TD("2.325",ACC), TD("192",ACC), TD("0.0121")],
], { x:0.8, y:1.6, w:7.3, colW:[0.75,1.75,1.1,1.75,1.0,0.95], rowH:0.42 });
s.addImage({ path:G+"09b-egilme-egrisi.png", x:0.8, y:3.4, w:4.6, h:2.6, objectName:"fc" });
lab(s, 0.8, 3.1, 4.6, "Flexural stress – strain, F2");
vrule(s, 8.6, 1.6, 4.9);
lab(s, 9.1, 1.6, 3.4, "Disclosure");
txt(s, 9.1, 1.9, 3.4, 2.1, "The specimen is kerfed on its tension face. The standard assumes a solid rectangle, and the calculation uses the full section. Part of the compliance is geometric: the modulus is a lower bound.", false, 11.5);
rule(s, 9.1, 4.2, 3.4);
s.addText("Plasticiser decides whether it resists at all.",
  S({ x:9.1, y:4.45, w:3.4, h:0.9, fontSize:15, bold:true, color:K.acc, lineSpacing:21 }));
dim(s, 9.1, 5.5, 3.4, 1.0, "At 18.8% glycerol the machine registered nothing usable. Halving it gave a section that resists while still flexing.");
dim(s, 5.8, 3.4, 2.5, 2.4, "Three specimens per formulation. The two formulations differ in glycerol, but batch mass was fixed, so solids concentration moved as well.");
s.addNotes("Flexure, to ASTM D790. The decisive variable is plasticiser. At 18.8 percent glycerol the composite deformed without developing measurable resistance - the machine registered nothing usable at all. Halving it gives 2.325 megapascals at a modulus of 192. The transition is sharp and it lies between those two values, which is itself useful to know. Two disclosures: the glycerol effect is confounded with solids concentration, and the specimen is kerfed on its tension face while the standard assumes a solid rectangle, so the modulus I am quoting is a lower bound on the bulk material. The flexural strength formula is three F L over two b d squared, if anyone wants to check it.");

/* ========== 15 bending — big photos ========== */
s = pres.addSlide({ masterName:"FULL", sectionTitle:"Results" });
s.addImage({ path:G+"06-egilme-buyuk-sehim.jpg", x:0, y:0, w:3.38, h:7.5, objectName:"b1" });
s.addImage({ path:G+"07-egilme-yakin-yiv.jpeg", x:3.48, y:0, w:5.0, h:3.75, objectName:"b2" });
s.addImage({ path:G+"08b-yivli-panel-kemer.jpg", x:3.48, y:3.85, w:5.0, h:3.65, objectName:"b3" });
s.addShape(pres.ShapeType.rect, { x:8.58, y:0, w:4.75, h:7.5, fill:{ color:K.dark }, line:{ color:K.dark, transparency:100 }, objectName:"pane" });
lab(s, 9.1, 1.5, 3.7, "Bending", true);
s.addText("The kerfs are visible, and so is the consequence.",
  S({ x:9.1, y:1.85, w:3.7, h:1.0, fontSize:18, bold:true, color:K.onD, lineSpacing:25 }));
txt(s, 9.1, 3.1, 3.7, 2.2, "Transverse kerfs on the tension face let the panel arch by hand. They also mean the measured compliance is partly geometric, which is why the reported modulus is a lower bound rather than a material constant.", true, 12);
micro(s, 9.1, 5.6, 3.7, "Three-point rig at high deflection · close-up of the kerfed tension face · panel arched by hand", true);
s.addNotes("I want you to see this rather than take my word for it. On the left, the three-point rig at high deflection - the beam is bent well past anything a ceramic would survive, and it has not fractured. In the middle, a close-up of the tension face: those are transverse kerfs. And below, the same panel arched by hand. The kerfs are why it arches, and they are also why I am calling the modulus a lower bound rather than a material constant. I would rather point at this than have someone find it in the photograph later.");

/* ========== fire, water, weight ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Fire and water");
s.addImage({ path:G+"10-alev-testi.png", x:0.8, y:1.5, w:2.2, h:4.77, objectName:"fl" });
lab(s, 3.5, 1.5, 3.3, "Ignitability — ISO 11925-2");
fig(s, 3.5, 1.85, 3.3, "~10 s", "to ignition under direct flame", false, 36);
fig(s, 3.5, 3.15, 3.3, "4 s", "to self-extinguish", false, 36);
list(s, 3.5, 4.4, 3.3, 1.5, ["Charring stays local","No lateral spread","No melting, no dripping"], false, 11.5);
micro(s, 3.5, 6.1, 3.3, "Ignitability only. No Euroclass, cone calorimetry, smoke or toxicity data.");
vrule(s, 7.3, 1.5, 4.8);
lab(s, 7.8, 1.5, 4.7, "Absorption — 24 h immersion");
s.addText("0.7%", S({ x:7.8, y:1.8, w:1.8, h:0.6, fontSize:36, bold:true, color:K.acc, valign:"bottom" }));
dim(s, 9.7, 1.9, 2.8, 1.2, "mass gain, shellac-coated. Coating integrity, not the composite, is the limiting factor for humid use.", false, 11);
rule(s, 7.8, 3.15, 4.7);
lab(s, 7.8, 3.35, 4.7, "Bulk density");
tbl(s, [
  [TH("Material"), TH("g/cm³"), TH("Reference")],
  [TL("This study (C3)", ACC), TD("1.38", ACC), TL("—")],
  [TL("Mycelium, cellulose"), TD("0.3 – 0.8"), TL("Jones et al. 2020")],
  [TL("Fired clay brick"), TD("1.6 – 2.0"), TL("William & Owen 1995")],
  [TL("Normal-weight concrete"), TD("2.4"), TL("William & Owen 1995")],
], { x:7.8, y:3.65, w:4.7, colW:[1.95,1.0,1.75], rowH:0.38, fontSize:10 });
dim(s, 7.8, 5.5, 4.7, 0.9, "Denser than the fungal and cellulosic family, lighter than fired clay. Mould-volume basis, therefore a lower bound.");
s.addNotes("Fire and water together. On fire: ignition at around ten seconds under direct flame, self-extinguishing four seconds after the flame is removed. Charring stayed local, no lateral spread, and no melting or dripping, which matters for a polymer-adjacent material. The probable mechanism is the carbonate fraction decomposing endothermically and releasing carbon dioxide, diluting the flame front - not verified calorimetrically. To be clear: this is an ignitability test, there is no Euroclass classification, no cone calorimetry, no smoke or toxicity data. On water: 0.7 percent mass gain over twenty-four hours of full immersion with three shellac coats, with local dissolution where the coating was thin, so coating integrity is the limiting factor. And on density: 1.38, between the fungal and cellulosic bio-materials below and fired clay above, on a mould-volume basis so a lower bound.");

/* ========== 18 versus conventional ========== */
pres.addSection({ title:"Benchmark" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Benchmark" });
H1(s, "Versus stone and board");
s.addChart(pres.ChartType.bar, [
  { name:"Compressive", labels:["Compressed\nmushroom panel","This study\n(C3)","WPC","MDF","Travertine"], values:[1.2,4.1,7.2,24,80] },
  { name:"Flexural",    labels:["Compressed\nmushroom panel","This study\n(C3)","WPC","MDF","Travertine"], values:[1.0,2.3,12,35,11] },
], { x:0.8, y:1.5, w:8.3, h:4.8, barDir:"col", barGrouping:"clustered",
     chartColors:[K.ink, K.faint], showLegend:true, legendPos:"t",
     legendColor:K.grey, legendFontSize:10.5, legendFontFace:"+mn-lt",
     showValue:true, dataLabelPosition:"outEnd", dataLabelColor:K.body, dataLabelFontSize:10,
     dataLabelFontFace:"+mn-lt", dataLabelFormatCode:"0.0",
     catAxisLabelColor:K.grey, catAxisLabelFontSize:10, catAxisLabelFontFace:"+mn-lt",
     valAxisLabelColor:K.grey, valAxisLabelFontSize:10, valAxisLabelFontFace:"+mn-lt",
     valAxisTitle:"Strength (MPa)", showValAxisTitle:true, valAxisTitleColor:K.grey,
     valAxisTitleFontSize:10.5, valAxisTitleFontFace:"+mn-lt",
     valGridLine:{ color:K.line, size:1 }, catGridLine:{ style:"none" }, objectName:"b1" });
micro(s, 0.8, 6.4, 8.3, "Velasco & Gaona 2011 · Klyosov 2007 · Nemli & Aydın 2007 · Altun 2006");
vrule(s, 9.5, 1.5, 4.8);
s.addText("On strength alone it does not compete.",
  S({ x:10.0, y:1.6, w:2.5, h:1.1, fontSize:17, bold:true, color:K.ink, lineSpacing:23 }));
dim(s, 10.0, 2.95, 2.5, 2.4, "One sixth the compressive strength of MDF. One twentieth that of travertine — a stone it visually resembles. Three times compressed mushroom panel, the only other fully bio-based board here.");
s.addNotes("First benchmark, against the materials this would sit alongside. Let me be blunt. One sixth of MDF, one twentieth of travertine - and travertine is the relevant comparison aesthetically, because the material actually looks like it. It does beat compressed mushroom panel, the only other fully bio-based board in the set, by a factor of three. But on strength alone it does not compete with engineered wood or stone, and I am not going to claim that it does.");

/* ========== 19 versus bio-based ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Benchmark" });
H1(s, "Versus bio-based");
lab(s, 0.8, 1.5, 5.6, "Compressive strength");
tbl(s, [
  [TH("Material"), TH("σᴄ MPa"), TH("Reference")],
  [TL("This study (C3)", ACC), TD("4.1", ACC), TL("—")],
  [TL("Mycelium composite"), TD("0.145 – 0.452"), TL("Jones et al. 2020")],
  [TL("Hempcrete"), TD("0.3 – 0.6"), TL("Arnaud & Gourlay 2012")],
  [TL("Eggshell-filled PLA"), TD("2 – 5"), TL("Kim & Pal 2010")],
  [TL("Mineral-filled biocomposite"), TD("2.1 – 39.6"), TL("Shah et al. 2016")],
], { x:0.8, y:1.8, w:5.6, colW:[2.6,1.5,1.5], rowH:0.38, fontSize:10 });
lab(s, 7.0, 1.5, 5.5, "Elastic modulus");
tbl(s, [
  [TH("Material"), TH("E MPa"), TH("Reference")],
  [TL("This study (F2)", ACC), TD("192", ACC), TL("—")],
  [TL("Mycelium composite"), TD("1.8 – 5"), TL("Islam et al. 2018")],
  [TL("Soy-based bioplastic"), TD("124"), TL("Mansour et al. 2021")],
  [TL("Flax-fibre PLA"), TD("198"), TL("Faruk et al. 2012")],
  [TL("LDPE"), TD("100 – 300"), TL("Zhao et al. 2022")],
  [TL("Wood (pine)"), TD("11 000"), TL("Pope & Hudson 1989")],
], { x:7.0, y:1.8, w:5.5, colW:[2.45,1.35,1.7], rowH:0.38, fontSize:10 });
rule(s, 0.8, 4.45, 11.7);
s.addText("Water-cast and ambient-dried, at melt-processed stiffness.",
  S({ x:0.8, y:4.7, w:11.7, h:0.45, fontSize:19, bold:true, color:K.acc }));
dim(s, 0.8, 5.3, 11.7, 1.0, "An order of magnitude above the fungal and lime-binder family in compression, and inside the bio-polymer band in stiffness — between soy bioplastic and flax-fibre PLA, within the LDPE range. No oven, no autoclave, no extrusion. Wood remains two orders of magnitude above.");
s.addNotes("Second benchmark, and this is the one that matters. Against the bio-based family the position changes completely. In compression, an order of magnitude above mycelium composites and hempcrete. In stiffness, 192 megapascals - between soy bioplastic at 124 and flax-fibre PLA at 198, inside the LDPE range. Note what that means. This is water-cast, dried at room temperature, no oven, no autoclave, no extrusion, and it reaches the stiffness of melt-processed bio-polymers. Wood is still two orders of magnitude above, and I will not pretend otherwise.");

/* ========== 20 resilience — diagram ========== */
s = pres.addSlide({ masterName:"DARK", sectionTitle:"Benchmark" });
H1(s, "Resilience", true);
const ax=0.9, ay=2.0, aw=4.6, ah=3.1;
s.addShape(pres.ShapeType.rect, { x:ax, y:ay, w:0.02, h:ah, fill:{ color:K.onDf }, line:{ color:K.onDf, transparency:100 }, objectName:"vx" });
s.addShape(pres.ShapeType.rect, { x:ax, y:ay+ah, w:aw, h:0.02, fill:{ color:K.onDf }, line:{ color:K.onDf, transparency:100 }, objectName:"hx" });
s.addShape("rtTriangle", { x:ax+0.02, y:ay+0.85, w:2.8, h:ah-0.85, flipH:true,
  fill:{ color:K.acc, transparency:28 }, line:{ color:K.acc, width:2 }, objectName:"area" });
s.addText("stress", S({ x:ax-0.85, y:ay+0.6, w:0.8, h:0.3, fontSize:11, color:K.onDg, align:"right" }));
s.addText("strain", S({ x:ax+2.55, y:ay+ah+0.1, w:0.8, h:0.3, fontSize:11, color:K.onDg }));
s.addText("Ur", S({ x:ax+1.35, y:ay+2.25, w:0.7, h:0.32, fontSize:15, bold:true, color:K.onD }));
micro(s, ax, ay+ah+0.5, 4.6, "The shaded area is the elastic energy absorbed per unit volume before permanent damage.", true);
vrule(s, 6.3, 1.5, 4.8, true);
s.addText("Ur  =  σ² / 2E", S({ x:6.8, y:1.95, w:3.0, h:0.5, fontSize:22, bold:true, color:K.onD }));
s.addText("14.1 kJ/m³", S({ x:6.8, y:2.6, w:3.0, h:0.55, fontSize:26, bold:true, color:K.acc }));
micro(s, 6.8, 3.2, 3.0, "for the formulation measured here", true);
s.addText("Stiffness sits in the denominator.",
  S({ x:6.8, y:3.95, w:3.0, h:0.9, fontSize:16, bold:true, color:K.onD, lineSpacing:22 }));
dim(s, 6.8, 5.0, 3.0, 1.2, "The low modulus that counted against the material on the previous slide is exactly what raises this quantity.", true, 11.5);
lab(s, 10.3, 1.5, 2.2, "The limit", true);
micro(s, 10.3, 1.85, 2.2, "A comparative table cannot yet be assembled: the literature reports strength and modulus in separate studies on different formulations. This is a data point and a measurement convention, not a ranking.", true);
s.addNotes("This brings me to the fifth question. The diagram is the argument. The shaded area under the elastic region is the energy a material absorbs per unit volume before it takes permanent damage - and because that area is one half sigma epsilon, and epsilon is sigma over E, the area is sigma squared over two E. Notice where stiffness sits: in the denominator. So the low modulus that counted against the material on the previous slide is exactly what raises this quantity. For this formulation it comes to about 14 kilojoules per cubic metre, from this study's own two measurements - 2.325 squared over twice 192. Both test programmes gave the same qualitative result: substantial deformation with retained integrity. Strength records the load at which a material stops performing. It does not record whether it then fails gracefully or catastrophically, and for a demountable non-loadbearing component that is what governs service life. The honest limit: I cannot give you a comparative table, because the literature reports strength and modulus in separate studies on different formulations. This is a data point and a measurement convention, not a ranking.");

/* ========== application + circularity ========== */
pres.addSection({ title:"Application" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Application" });
H1(s, "Where it fits");
s.addImage({ path:G+"12-ic-mekan-render.jpeg", x:0.8, y:1.5, w:4.4, h:3.61, objectName:"ren" });
micro(s, 0.8, 5.2, 4.4, "Modular interior proposal derived from the measured properties");
vrule(s, 5.6, 1.5, 3.9);
[["Non-loadbearing surfaces","self-weight and handling loads only"],
 ["Dry interiors","not wet rooms, not facades"],
 ["Away from ignition sources","self-extinguishing, but unclassified"],
 ["Modular, not sheet","failure replaced one unit at a time"]]
 .forEach(([h,b],i)=>{ const y=1.55+i*0.95;
  s.addText(h, S({ x:6.1, y, w:6.4, h:0.3, fontSize:14, bold:true, color:K.ink }));
  s.addText(b, S({ x:6.1, y:y+0.33, w:6.4, h:0.4, fontSize:11.5, color:K.grey }));
  if (i<3) rule(s, 6.1, y+0.78, 6.4); });
rule(s, 0.8, 5.7, 11.7);
lab(s, 0.8, 5.9, 11.7, "And the loop it closes");
const LOOP = ["Bakery waste","Shell powder","One 55-min cook","Cast module","Reversible assembly","Biological cycle"];
const LX=0.8, LW=1.75, LG=0.24;
LOOP.forEach((h,i)=>{
  const x = LX + i*(LW+LG);
  s.addShape(pres.ShapeType.rect, { x, y:6.25, w:LW, h:0.5,
    fill:{ color:i===5?K.acc:K.panel }, line:{ color:i===5?K.acc:K.line, width:1 }, objectName:"lp"+i });
  s.addText(h, S({ x:x+0.1, y:6.25, w:LW-0.2, h:0.5, fontSize:10, bold:true,
    color:i===5?K.onD:K.ink, align:"center", valign:"middle", lineSpacing:12 }));
  if (i<5) s.addShape(pres.ShapeType.rightArrow, { x:x+LW+0.03, y:6.43, w:0.18, h:0.14,
    fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"la"+i });
});
s.addNotes("Where it fits follows from the measurements rather than being imposed on them. Non-loadbearing surfaces, carrying self-weight and handling loads only. Dry interiors - not wet rooms and not facades, because water performance depends on the coating. Away from ignition sources: it self-extinguishes, but it is unclassified. And modular rather than sheet, which matters because failure is then replaced one unit at a time. The strip along the bottom is the loop this closes: bakery waste becomes shell powder with a grinder and a sieve, one fifty-five minute cook, a cast module dried at ambient, assembled reversibly so it can be recovered intact, and at end of life every constituent degrades - including the shellac - so the material returns to the stream it came from. What is displaced is quarried limestone, in a surface application rather than a downcycled one. One caveat: no life-cycle assessment was carried out, so these are qualitative potentials grounded in the protocol, not quantified claims.");

/* ========== limits ========== */
pres.addSection({ title:"Closing" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Closing" });
H1(s, "Limits");
[["Measurement", ["No dispersion data — means of three, individual values not retained",
                  "Compressive strain assumed from observation, not instrumented",
                  "Shrinkage unquantified — density is a lower bound"]],
 ["Process",     ["Flexural series confounded — glycerol and solids moved together",
                  "Kerfed section calculated as solid — modulus is a lower bound",
                  "Manual stirring; one laboratory, one operator"]],
 ["Untested",    ["Durability — humidity, thermal cycling, UV, microbial, ageing",
                  "Reaction-to-fire classification",
                  "Life-cycle assessment"]]]
 .forEach(([h,items],i)=>{ const x=0.8+i*4.0;
  s.addText(h, S({ x, y:1.6, w:3.6, h:0.4, fontSize:18, bold:true, color:K.ink }));
  rule(s, x, 2.15, 3.6);
  list(s, x, 2.28, 3.6, 2.8, items, false, 11.5); });
s.addText("None of these is unknown. Each one is the next experiment.",
  S({ x:0.8, y:5.6, w:11.7, h:0.4, fontSize:15, bold:true, color:K.acc }));
s.addNotes("The limits, in three groups rather than a list, because the grouping is the point. Measurement: no dispersion data, strain assumed rather than instrumented, shrinkage unquantified. Process: the flexural series is confounded, the kerfed section was calculated as solid, and stirring was manual in one laboratory by one operator. Untested: durability of any kind, fire classification, life-cycle assessment. I would rather set these out than have them found - and none of them is unknown to me. Each one is the next experiment, which is the next slide.");

/* ========== next ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Closing" });
H1(s, "Next");
[["01","Repeat with dispersion","Three or more specimens per formulation with individual values retained, so standard deviations can be reported."],
 ["02","Record post-drying geometry","Measure and log the dried cross-section, giving a true stress and a true density rather than lower bounds."],
 ["03","Instrument the strain","Replace the assumed 10% deformation with measured strain, giving a real stress–strain curve and a defensible modulus of resilience."],
 ["04","Test an un-kerfed section","Separate the geometric contribution from the material one, so the flexural modulus becomes a material constant."]]
 .forEach(([n,h,b],i)=>{ const y=1.6+i*1.18;
  s.addText(n, S({ x:0.8, y:y+0.17, w:0.6, h:0.3, fontSize:12, bold:true, color:K.acc }));
  s.addText(h, S({ x:1.6, y, w:4.0, h:0.6, fontSize:15, bold:true, color:K.ink, lineSpacing:19 }));
  s.addText(b, S({ x:5.9, y:y+0.1, w:6.6, h:0.8, fontSize:11.5, color:K.grey, lineSpacing:16 }));
  if (i<3) rule(s, 0.8, y+1.0, 11.7); });
rule(s, 0.8, 6.1, 11.7);
dim(s, 0.8, 6.3, 11.7, 0.6, "Beyond these four: humidity and thermal cycling, microbial resistance, a reaction-to-fire classification, and a life-cycle assessment to support the environmental argument quantitatively.");
s.addNotes("Four experiments, in order of what they unlock. First, repeat with individual specimen values retained, so dispersion can be reported - that is the single most requested thing and the cheapest to fix. Second, record post-drying geometry, which converts every lower bound in this talk into a real value. Third, instrument the strain, which replaces the assumed ten percent deformation with a measured curve and makes the modulus of resilience defensible rather than indicative. Fourth, test an un-kerfed section, which separates the geometric contribution from the material one. Beyond those four: humidity and thermal cycling, microbial resistance, a fire classification, and a life-cycle assessment.");

/* ========== conclusions ========== */
s = pres.addSlide({ masterName:"DARK", sectionTitle:"Closing" });
H1(s, "Conclusions", true);
[["A protocol others can repeat","every parameter reported"],
 ["Packing density governs strength","not mineral content"],
 ["Plasticiser sets brittle or ductile","the transition is sharp"],
 ["Bio-polymer stiffness, oven-free","water-cast, ambient-dried"],
 ["Strength is not the only criterion","report σ and E together"]]
 .forEach(([h,b],i)=>{ const y=1.65+i*0.92;
  s.addText(String(i+1).padStart(2,"0"), S({ x:0.8, y:y+0.06, w:0.55, h:0.3, fontSize:11, bold:true, color:K.acc }));
  s.addText(h, S({ x:1.5, y, w:7.0, h:0.45, fontSize:19, bold:true, color:K.onD }));
  s.addText(b, S({ x:8.8, y:y+0.07, w:3.7, h:0.4, fontSize:12, color:K.onDg }));
  if (i<4) rule(s, 0.8, y+0.62, 11.7, true); });
s.addText("Betül Ünal   ·   b.unal91@gmail.com",
  S({ x:0.8, y:6.45, w:11.7, h:0.3, fontSize:12, bold:true, color:K.onD }));
micro(s, 0.8, 6.78, 11.7, "Testing: Advanced Construction Materials Research Laboratory, Hacettepe University, with thanks to Dr Hüseyin İlcan. Derived from the author's doctoral dissertation, Hacettepe University, 2025.", true);
s.addNotes("Five conclusions. A protocol others can repeat, reported parameter by parameter. Packing density, not mineral content, governs compressive strength. Plasticiser content sets brittle or ductile, and the transition is sharp. A water-cast, ambient-dried material reaches bio-polymer stiffness without an oven. And strength is not the only criterion: for this class, deformation capacity governs service behaviour, so strength and modulus should be reported together. Thank you. I am happy to take questions.");

/* ========== 25 references ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Closing" });
H1(s, "References");
[["Reviews and state of the art",[
  "Ngayakamo, B. & Onwualu, A.P. (2022). Valorisation of eggshell waste for sustainable construction materials. Heliyon.",
  "Owuamanam, S. & Cree, D. (2020). Progress of bio-calcium carbonate waste eggshell and seashell fillers in polymer composites. Journal of Composites Science, 4(2), 70.",
  "Biogenic calcium carbonate from waste shells for advanced material applications (2022). Frontiers in Materials, 9, 1024977."]],
 ["Agar and bio-polymer systems",[
  "Hernández, V. et al. (2022). Agar biopolymer films for biodegradable packaging: a reference dataset. Materials, 15(11), 3954.",
  "Materiom (2026). Open biomaterial recipe commons and property database. materiom.org/data.",
  "Mansour et al. (2021) · Faruk et al. (2012) · Zhao et al. (2022) — bio-polymer elastic moduli."]],
 ["Comparative material data",[
  "Jones, M. et al. (2020) · Islam et al. (2018) — mycelium composites. Arnaud & Gourlay (2012) — hempcrete.",
  "Kim & Pal (2010) — eggshell-filled PLA. Shah et al. (2016) — mineral-filled biocomposites.",
  "Nemli & Aydın (2007) — MDF. Altun (2006) — travertine. Klyosov (2007) — WPC. Velasco & Gaona (2011) — mushroom panel."]]]
 .forEach(([h,items],i)=>{ const y=1.55+i*1.7;
  lab(s, 0.8, y, 11.7, h);
  s.addText(items.map((x,j)=>({ text:x, options:{ bullet:{ characterCode:"2013" }, breakLine:j<items.length-1 } })),
    S({ x:0.8, y:y+0.3, w:11.7, h:1.2, fontSize:10, color:K.grey, paraSpaceAfter:3, lineSpacing:14 }));
  rule(s, 0.8, y+1.52, 11.7); });
micro(s, 0.8, 6.65, 11.7, "Standards: ASTM D790-17 · ISO 11925-2:2020 · ASTM D570-98(2018).");
s.addNotes("References, left up for questions.");

(async () => {
  await pres.writeFile({ fileName: OUT });
  const { applyTheme } = require("/root/.claude/skills/synced/ed12a668-6f07-4018-aad4-7be975f5699f_093145d0-7b3e-473d-b700-d8211791c264/pptx/scripts/apply_theme.js");
  await applyTheme(OUT, THEME);
  console.log("yazildi");
})();
