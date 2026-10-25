const pptxgen = require("pptxgenjs");
const G = "/home/user/sanat-ve-mekan/konferans-bildirisi/03-gorseller/";
const OUT = "/tmp/claude-0/-home-user-sanat-ve-mekan/083887b3-c080-5d69-a4cb-b10c492fdc94/scratchpad/deck/ICSMMEP26_Presentation_Unal.pptx";
const F = "Calibri";
const C = { ink:"141414", body:"3A3A3A", grey:"8C8C8C", faint:"BFBFBF", line:"E2E2E2",
            panel:"F6F5F3", acc:"B4513A", accSoft:"E9D9D2", dark:"141414",
            onD:"FFFFFF", onDg:"9A9A9A", onDf:"5E5E5E" };

const THEME = { name:"Eggshell Mono", headFontFace:F, bodyFontFace:F, colors:{
  dk1:C.ink, lt1:"FFFFFF", dk2:C.dark, lt2:C.panel, accent1:C.acc, accent2:C.grey,
  accent3:C.body, accent4:C.ink, accent5:C.line, accent6:C.grey, hlink:C.acc, folHlink:C.grey } };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace:F, bodyFontFace:F };
pres.author = "Betul Unal";
pres.title = "Eggshell-Agar Biocomposites for Sustainable Interior Applications";

const sn = (c) => ({ placeholder:{ options:{ name:"slideNumber", type:"sldNum",
  x:12.3, y:6.9, w:0.4, h:0.28, fontSize:9, color:c, align:"right", fontFace:F } } });
pres.defineSlideMaster({ title:"COVER", background:{ color:C.dark }, objects:[] });
pres.defineSlideMaster({ title:"PAGE",  background:{ color:"FFFFFF" }, objects:[ sn(C.faint) ] });
pres.defineSlideMaster({ title:"DARK",  background:{ color:C.dark },   objects:[ sn(C.onDf) ] });

/* ---------- type system: one family, weight and size only ---------- */
const S = (o={}) => Object.assign({ isTextBox:true, margin:0, fontFace:F }, o);
// running label replaces the title on most slides
const tag = (s,t,d) => s.addText(t.toUpperCase(), S({ x:0.8, y:0.5, w:11.7, h:0.26,
  fontSize:9, bold:true, charSpacing:1.6, color:d?C.onDg:C.grey, valign:"middle" }));
// bold statement — used on six slides only
const say = (s,t,d,sz) => s.addText(t, S({ x:0.8, y:0.92, w:11.7, h:0.62,
  fontSize:sz||21, bold:true, color:d?C.onD:C.ink, valign:"middle" }));
const lab = (s,x,y,w,t,d) => s.addText(t.toUpperCase(), S({ x, y, w, h:0.24,
  fontSize:8.5, bold:true, charSpacing:1.3, color:d?C.onDf:C.faint, valign:"middle" }));
const txt = (s,x,y,w,h,t,d,sz) => s.addText(t, S({ x,y,w,h, fontSize:sz||12,
  color:d?C.onD:C.body, valign:"top", lineSpacing:(sz||12)+6 }));
const dim = (s,x,y,w,h,t,d,sz) => s.addText(t, S({ x,y,w,h, fontSize:sz||10.5,
  color:d?C.onDg:C.grey, valign:"top", lineSpacing:(sz||10.5)+5 }));
const micro = (s,x,y,w,t,d) => s.addText(t, S({ x,y,w, h:0.5, fontSize:9,
  color:d?C.onDf:C.faint, valign:"top", lineSpacing:13 }));
const fig = (s,x,y,w,v,l,d) => { 
  s.addText(v, S({ x,y,w, h:0.58, fontSize:30, bold:true, color:C.acc, valign:"bottom" }));
  s.addText(l, S({ x, y:y+0.6, w, h:0.46, fontSize:9.5, color:d?C.onDg:C.grey, valign:"top", lineSpacing:12.5 })); };
const list = (s,x,y,w,h,items,d,sz) => s.addText(
  items.map((t,i)=>({ text:t, options:{ bullet:{ characterCode:"2013" }, breakLine:i<items.length-1 } })),
  S({ x,y,w,h, fontSize:sz||11.5, color:d?C.onD:C.body, paraSpaceAfter:6, lineSpacing:(sz||11.5)+5 }));
const TH = (t) => ({ text:t, options:{ bold:true, color:C.ink, fill:{ color:C.panel }, align:"center", valign:"middle", fontSize:10.5, fontFace:F } });
const TD = (t,o={}) => ({ text:t, options:Object.assign({ align:"center", valign:"middle", color:C.body, fontSize:10.5, fontFace:F }, o) });
const TL = (t,o={}) => TD(t, Object.assign({ align:"left" }, o));
const ACC = { bold:true, color:C.acc };
const tbl = (s,rows,opt) => s.addTable(rows, Object.assign({ rowH:0.36, fontSize:10.5, fontFace:F,
  border:{ type:"solid", color:C.line, pt:1 }, fill:{ color:"FFFFFF" } }, opt));
let s;

/* ================= 1 cover ================= */
pres.addSection({ title:"Opening" });
s = pres.addSlide({ masterName:"COVER", sectionTitle:"Opening" });
s.addImage({ path:G+"01-prototip-cesitlemeleri.jpeg", x:0, y:0, w:13.33, h:7.5, transparency:72, objectName:"wash" });
s.addShape(pres.ShapeType.rect, { x:0, y:0, w:6.6, h:7.5, fill:{ color:C.dark, transparency:12 }, line:{ color:C.dark, transparency:100 }, objectName:"scrim" });
s.addText("Development and Characterisation of\nEggshell–Agar Biocomposites for\nSustainable Interior Applications",
  S({ x:0.9, y:2.25, w:5.3, h:2.0, fontSize:25, bold:true, color:C.onD, lineSpacing:33, valign:"bottom" }));
s.addText([{ text:"Betül Ünal", options:{ bold:true, color:C.onD, fontSize:13, breakLine:true } },
           { text:"Department of Interior Architecture, Cappadocia University", options:{ color:C.onDg, fontSize:11.5 } }],
  S({ x:0.9, y:4.55, w:5.3, h:0.8 }));
s.addText("ICSMMEP-26   ·   MECCA   ·   3–4 NOVEMBER 2026",
  S({ x:0.9, y:5.6, w:5.3, h:0.3, fontSize:9, bold:true, charSpacing:1.6, color:C.onDf }));
s.addNotes("Good morning. Betul Unal, Department of Interior Architecture, Cappadocia University. This paper reports a production protocol and mechanical characterisation for a fully bio-based composite of waste eggshell bound in an agar-glycerol matrix, and proposes an evaluation criterion better suited to this class of material than compressive strength alone.");

/* ================= 2 the gap — diagram ================= */
pres.addSection({ title:"Position" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Position" });
tag(s, "The position eggshell occupies");
say(s, "The filler was already bio-based. The binder was not.");
function stack(x, y, w, topH, botH, topFill, botFill, topTxt, topSub, botTxt, botSub, accent) {
  s.addShape(pres.ShapeType.rect, { x, y, w, h:topH, fill:{ color:topFill }, line:{ color:C.line, width:1 }, objectName:"t"+x });
  s.addShape(pres.ShapeType.rect, { x, y:y+topH, w, h:botH, fill:{ color:botFill }, line:{ color:C.line, width:1 }, objectName:"b"+x });
  s.addText(topTxt, S({ x:x+0.3, y:y+0.18, w:w-0.6, h:0.3, fontSize:12, bold:true, color:C.ink }));
  s.addText(topSub, S({ x:x+0.3, y:y+0.5, w:w-0.6, h:0.3, fontSize:10, color:C.grey }));
  s.addText(botTxt, S({ x:x+0.3, y:y+topH+0.22, w:w-0.6, h:0.3, fontSize:12, bold:true, color:accent?C.onD:C.ink }));
  s.addText(botSub, S({ x:x+0.3, y:y+topH+0.54, w:w-0.6, h:0.6, fontSize:10, color:accent?"F2E4DE":C.grey, lineSpacing:13 }));
}
lab(s, 0.8, 1.95, 5.4, "Established practice");
stack(0.8, 2.25, 5.4, 1.1, 1.75, C.panel, "FFFFFF",
  "Mineral phase", "waste eggshell, 5–30% of matrix",
  "Binding phase", "Portland clinker · bitumen · lime · ceramic body · PLA, epoxy, PVC, PU", false);
lab(s, 7.1, 1.95, 5.4, "This study");
stack(7.1, 2.25, 5.4, 1.1, 1.75, C.panel, C.acc,
  "Mineral phase", "waste eggshell, 66% of solids",
  "Binding phase", "agar, plasticised with glycerol — biological and biodegradable", true);
s.addShape(pres.ShapeType.rect, { x:6.35, y:3.05, w:0.4, h:0.04, fill:{ color:C.faint }, line:{ color:C.faint, transparency:100 }, objectName:"tick1" });
s.addShape(pres.ShapeType.rightArrow, { x:6.3, y:3.9, w:0.5, h:0.34, fill:{ color:C.acc }, line:{ color:C.acc, transparency:100 }, objectName:"arr" });
dim(s, 0.8, 5.3, 5.4, 0.8, "The waste stream is valorised. The matrix remains petrochemical, clinker-based or ceramic.");
dim(s, 7.1, 5.3, 5.4, 0.8, "Both phases are biological. The composite returns to a biological cycle intact.");
micro(s, 0.8, 6.3, 11.7, "Teara et al. 2019 · Adogla et al. 2016 · Razzaq & Yousif 2017 · Soundara & Vilasini 2015 · Vilarinho et al. 2022 · Owuamanam & Cree 2020");
s.addNotes("Let me start with where the field is rather than where my work is. Eggshell valorisation is well established - cement replacement, brick stabilisation, asphalt binders, lime substitution, ceramic bodies, particulate filler in thermoplastics. Reported loadings run from five to thirty percent. But look at the lower half of each stack. In every one of those cases the binding phase is petrochemical, clinker-based or ceramic. The waste is valorised; the matrix is not. This study replaces the binder as well, so both phases are biological.");

/* ================= 3 context ================= */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Position" });
tag(s, "What is already known");
lab(s, 0.8, 1.05, 5.6, "Eggshell — established uses");
tbl(s, [
  [TH("Application"), TH("Matrix"), TH("Reference")],
  [TL("Cement replacement"), TL("Portland clinker"), TL("Teara et al. 2019")],
  [TL("Laterite brick stabilisation"), TL("Cement"), TL("Adogla et al. 2016")],
  [TL("Asphalt binder modification"), TL("Bitumen"), TL("Razzaq & Yousif 2017")],
  [TL("Soil stabilisation"), TL("Lime substitute"), TL("Soundara & Vilasini 2015")],
  [TL("Eco-ceramic wall tile"), TL("Ceramic body"), TL("Vilarinho et al. 2022")],
  [TL("Particulate filler"), TL("PLA, epoxy, PVC, PU"), TL("Owuamanam & Cree 2020")],
], { x:0.8, y:1.35, w:5.6, colW:[2.05,1.5,2.05], rowH:0.34 });
dim(s, 0.8, 3.95, 5.6, 0.9, "~94% calcium carbonate; porous, protein-bound crystalline structure; specific gravity 0.85–2.66. The material argument is settled.");
lab(s, 7.1, 1.05, 5.4, "Agar — characterised, but as a film");
txt(s, 7.1, 1.35, 5.4, 1.2, "Hernández et al. (2022) mapped 32 agar–glycerin–water formulations by design of experiments and released the dataset openly. Glycerol raises elongation and lowers tensile strength.", false, 11.5);
tbl(s, [
  [TH("—"), TH("Film literature"), TH("This study")],
  [TL("Form"), TL("Thin cast film"), TL("Cast solid, 20–50 mm")],
  [TL("Filler"), TL("Unfilled"), TL("Mineral, 66% of solids")],
  [TL("Loading"), TL("Uniaxial tension"), TL("Compression, bending")],
  [TL("Use"), TL("Packaging"), TL("Interior surfaces")],
], { x:7.1, y:2.75, w:5.4, colW:[1.3,1.95,2.15], rowH:0.36 });
dim(s, 7.1, 4.6, 5.4, 0.8, "The compositional logic carries over. The form, the filler and the loading case do not.");
s.addNotes("Two bodies of literature meet here. On the left, eggshell: well established across construction and packaging, and the material argument is settled - 94 percent calcium carbonate, a useful porous microstructure, low specific gravity. On the right, agar: reasonably well characterised, but only as unfilled thin film in tension, for packaging. Nobody has characterised agar as the binder of a mineral-filled cast solid in bending, which is the actual loading case for an interior surface.");

/* ================= 4 documented gap ================= */
s = pres.addSlide({ masterName:"DARK", sectionTitle:"Position" });
tag(s, "The gap, measured", true);
say(s, "A commons four recipes deep.", true);
txt(s, 0.8, 2.1, 5.4, 1.6, "Materiom publishes biomaterial recipes under CC-BY-SA, excludes petrochemical ingredients, archives each as prior art, and indexes property data with citable DOIs. The infrastructure for shared procedures is built.", true, 12);
fig(s, 0.8, 3.85, 2.3, "4", "recipes with published property data", true);
lab(s, 3.5, 3.9, 2.7, "Which are", true);
dim(s, 3.5, 4.2, 2.7, 1.5, "agar bioplastic\ngelatin bioplastic\nmycelium–walnut shell\nmussel shell–sucrose ceramic", true, 10.5);
s.addShape(pres.ShapeType.rect, { x:6.75, y:2.1, w:0.02, h:3.9, fill:{ color:C.onDf }, line:{ color:C.onDf, transparency:100 }, objectName:"rule" });
lab(s, 7.3, 2.1, 5.2, "What that means here", true);
txt(s, 7.3, 2.4, 5.2, 2.1, "The nearest analogue is the mussel shell–sucrose ceramic: a shell mineral in a biological binder. Nothing couples a shell mineral to an agar binder. Nothing reports compressive, flexural, ignitability and hygric data for one formulation family.", true, 12);
s.addText("The contribution is a protocol and a property set entering that commons.",
  S({ x:7.3, y:4.8, w:5.2, h:0.9, fontSize:13.5, bold:true, color:C.acc, lineSpacing:19 }));
micro(s, 0.8, 6.3, 6.0, "materiom.org/data, accessed October 2026", true);
s.addNotes("Claiming a gap is cheap, so let me measure it. Materiom is an open commons for biomaterial recipes - CC-BY-SA, petrochemical ingredients excluded, each recipe archived as prior art, property data indexed with citable DOIs. The infrastructure exists. But property data exists for four recipes. The nearest analogue to this work is the mussel shell-sucrose ceramic, a shell mineral in a biological binder. Nothing couples a shell mineral to an agar binder, and nothing reports compressive, flexural, ignitability and hygric data for one formulation family. So the contribution is not originality of idea. It is a protocol and a property set entering a commons that is four recipes deep.");

/* ================= 5 aim ================= */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Position" });
tag(s, "Aim and questions");
txt(s, 0.8, 1.0, 5.5, 1.4, "To document a reproducible production protocol for a fully bio-based eggshell composite, and to characterise its mechanical, thermal and hygric response against conventional and bio-based interior materials.", false, 13);
lab(s, 0.8, 2.7, 5.5, "Scope");
list(s, 0.8, 3.0, 5.5, 1.8, [
  "Five formulations, two mechanical programmes",
  "Three specimens per formulation",
  "ASTM D790-17 · ISO 11925-2 · ASTM D570",
  "Single laboratory, ambient curing, no ageing",
]);
lab(s, 7.1, 1.0, 5.4, "Research questions");
[["01","Which formulation variable governs compressive strength?"],
 ["02","What is the effect of plasticiser content on flexural behaviour?"],
 ["03","How does it compare with conventional interior materials?"],
 ["04","How does it compare with other bio-based composites?"],
 ["05","Is compressive strength the appropriate criterion at all?"]]
 .forEach(([n,q],i)=>{ const y=1.35+i*0.82;
  s.addText(n, S({ x:7.1, y:y+0.18, w:0.5, h:0.28, fontSize:10.5, bold:true, color:C.acc }));
  s.addText(q, S({ x:7.7, y, w:4.8, h:0.65, fontSize:12, color:C.body, lineSpacing:17 })); });
s.addNotes("Five questions. The first two are formulation questions, the next two benchmarking, and the fifth is the one I actually care about and will return to at the end.");

/* ================= 6 protocol diagram ================= */
pres.addSection({ title:"Protocol" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Protocol" });
tag(s, "Production protocol");
say(s, "One cook, then eleven days at room temperature.");
const ST = [
  ["01","Mineral fraction","120 °C","20 min", ["Clean of membrane and residue","Heat-treat: decontamination and drying","Dry to constant mass","Mill to homogeneous powder","Sieve, 150 µm passing fraction"]],
  ["02","Binder phase","95 °C","← 55 min →", ["Water and glycerol pre-mixed","Agar added incrementally, stirred","Held until fully in solution","Bulk addition forms agglomerates"]],
  ["03","Compositing","80 °C","", ["Temperature reduced, stirring kept","Viscosity develops","Shell fraction added incrementally","Earlier addition lets it sediment"]],
  ["04","Casting and cure","23 °C","11 days", ["Silicone moulds, no parting agent","Four days in mould","Demoulded, seven days ambient","No oven at any stage"]],
];
const BX = 0.8, BW = 2.55, GAP = 0.5;
ST.forEach(([n,h,temp,dur,items],i)=>{
  const x = BX + i*(BW+GAP);
  s.addText(temp, S({ x, y:1.78, w:BW, h:0.42, fontSize:19, bold:true, color:C.acc, valign:"bottom" }));
  if (dur) s.addText(dur, S({ x, y:2.22, w:BW, h:0.26, fontSize:9.5, color:C.grey }));
  s.addShape(pres.ShapeType.rect, { x, y:2.6, w:BW, h:0.62,
    fill:{ color:i===3?"FFFFFF":C.panel }, line:{ color:i===3?C.ink:C.line, width:1 }, objectName:"blk"+i });
  s.addText(n, S({ x:x+0.18, y:2.72, w:0.4, h:0.26, fontSize:9.5, bold:true, color:C.acc }));
  s.addText(h, S({ x:x+0.18, y:2.95, w:BW-0.36, h:0.26, fontSize:12, bold:true, color:C.ink }));
  if (i<3) s.addShape(pres.ShapeType.rightArrow, { x:x+BW+0.1, y:2.82, w:0.3, h:0.2,
    fill:{ color:C.faint }, line:{ color:C.faint, transparency:100 }, objectName:"a"+i });
  list(s, x, 3.45, BW, 1.9, items, false, 10);
});
s.addShape(pres.ShapeType.rect, { x:0.8, y:1.66, w:11.7, h:0.02, fill:{ color:C.line }, line:{ color:C.line, transparency:100 }, objectName:"axis" });
s.addImage({ path:G+"03-uretim-sureci.jpeg", x:0.8, y:5.55, w:3.6, h:1.15, objectName:"proc" });
lab(s, 4.75, 5.55, 7.75, "Disclosure — dimensional loss");
dim(s, 4.75, 5.85, 7.75, 0.9, "The composite shrinks appreciably as water evaporates. Cross-sections were measured at test time, but post-drying dimensions were not logged, so dimensions quoted here are mould dimensions. Stirring was manual: shear rate and mixing energy are not controlled quantities.");
s.addNotes("This is the protocol, and it is the contribution. Read it left to right with the temperatures above. Shell preparation at 120 degrees for twenty minutes - I call that decontamination and drying, not sterilisation, because dry-heat sterilisation needs far higher temperatures and we did not verify sterility. Then the binder: water and glycerol first, agar added incrementally because bulk addition forms agglomerates that never redisperse, dissolved at 95. Temperature drops to 80 and the mineral goes in late, because adding it earlier lets it settle out. Fifty-five minutes of heating in total. Then silicone moulds, four days in mould, seven days ambient, and no oven at any point. Two disclosures: the material shrinks as water leaves and we did not log the dried dimensions, and stirring was manual so shear rate is uncontrolled.");

/* ================= 7 constituents + formulations ================= */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Protocol" });
tag(s, "Constituents and formulations");
lab(s, 0.8, 1.0, 11.7, "What each component does");
tbl(s, [
  [TH("Constituent"), TH("Origin"), TH("Function"), TH("Relevant property")],
  [TL("Eggshell powder"), TL("Food waste"), TL("Mineral filler; carries load"), TL("94% CaCO₃; porous structure")],
  [TL("Agar"), TL("Red seaweed"), TL("Continuous binding phase"), TL("Thermoreversible gel")],
  [TL("Glycerol"), TL("Vegetable oil"), TL("Plasticiser; sets ductility"), TL("Humectant; low vapour pressure")],
  [TL("Water"), TL("—"), TL("Carrier; sets solids packing"), TL("Fully evaporated on drying")],
  [TL("Shellac"), TL("Kerria lacca"), TL("Hydrophobic surface finish"), TL("Biodegradable film-former")],
], { x:0.8, y:1.3, w:11.7, colW:[2.1,1.7,3.6,4.3], rowH:0.38 });
s.addText("Water is not a component of the finished material. It is the process variable that sets how densely the solids pack.",
  S({ x:0.8, y:3.65, w:11.7, h:0.38, fontSize:13, bold:true, color:C.acc }));
lab(s, 0.8, 4.25, 11.7, "Formulation matrix");
tbl(s, [
  [TH("ID"), TH("Test"), TH("Water g"), TH("Shell g"), TH("Agar g"), TH("Glycerol g"), TH("Solids g"), TH("Shell : binder"), TH("Solids : water"), TH("Glycerol % solids")],
  [TD("C1"), TL("Compression"), TD("325"), TD("80"),  TD("35"), TD("5"),  TD("120"), TD("2.00",{bold:true}), TD("0.37"), TD("4.2")],
  [TD("C2"), TL("Compression"), TD("310"), TD("90"),  TD("40"), TD("5"),  TD("135"), TD("2.00",{bold:true}), TD("0.44"), TD("3.7")],
  [TD("C3"), TL("Compression"), TD("280"), TD("110"), TD("45"), TD("10"), TD("165"), TD("2.00",{bold:true}), TD("0.59"), TD("6.1")],
  [TD("F1"), TL("Flexure"),     TD("450"), TD("190"), TD("70"), TD("60"), TD("320"), TD("1.46"), TD("0.71"), TD("18.8")],
  [TD("F2"), TL("Flexure"),     TD("480"), TD("190"), TD("70"), TD("30"), TD("290"), TD("1.90"), TD("0.60"), TD("10.3")],
], { x:0.8, y:4.55, w:11.7, colW:[0.7,1.8,0.95,0.9,0.85,1.2,0.95,1.5,1.5,1.35], rowH:0.36 });
dim(s, 0.8, 6.45, 5.6, 0.5, "Shell : binder is held at exactly 2.00 across the compression series. The only variable is solids concentration.");
dim(s, 7.1, 6.45, 5.4, 0.5, "Glycerol was halved at fixed batch mass, so water rose with it: the plasticiser effect is not isolated.");
s.addNotes("Five constituents, and the division of labour matters. Eggshell carries load, agar forms the continuous network, glycerol decides brittle or ductile, shellac is a surface finish only. Water is not in the final material at all - it is the process variable that sets how densely the solids pack, and that turns out to be the controlling variable. Below, the formulation matrix with derived ratios. Two things to read. In the compression series shell-to-binder is exactly two point zero zero in all three mixes, so the only thing that varies is solids concentration. In the flexural series I declare a confound: glycerol was halved but batch mass was fixed, so water rose to compensate and the other ratios shifted with it.");

/* ================= 8 test programme ================= */
pres.addSection({ title:"Results" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
tag(s, "Test programme");
tbl(s, [
  [TH("Property"), TH("Standard"), TH("Specimen"), TH("n"), TH("Measured")],
  [TL("Compressive behaviour"), TL("Cube compression"), TL("50 mm cube moulds"), TD("3 per mix"), TL("Max load; compressive stress")],
  [TL("Flexural behaviour"), TL("ASTM D790-17"), TL("180 × 60 × 20 mm, 120 mm span"), TD("3 per mix"), TL("Flexural strength; modulus")],
  [TL("Reaction to fire"), TL("ISO 11925-2:2020"), TL("40 × 50 mm, 45°, 15 s edge flame"), TD("2"), TL("Time to ignition; to extinguish")],
  [TL("Water absorption"), TL("ASTM D570-98"), TL("40 × 50 mm, shellac-coated"), TD("1"), TL("Mass gain, 24 h immersion")],
  [TL("Bulk density"), TL("Gravimetric"), TL("50 mm cube"), TD("1"), TL("Mass / mould volume")],
], { x:0.8, y:1.05, w:11.7, colW:[2.5,2.3,3.5,1.1,2.3], rowH:0.44 });
lab(s, 0.8, 3.85, 11.7, "Reporting convention");
txt(s, 0.8, 4.15, 11.7, 0.9, "Mechanical values are means of three specimens; individual specimen values were not retained, so standard deviations cannot be reported. Fire, absorption and density rest on single determinations and are indicative, not characteristic, values.", false, 12.5);
micro(s, 0.8, 5.3, 11.7, "All testing: Advanced Construction Materials Research Laboratory, Hacettepe University.");
s.addNotes("The test programme with standards and specimen geometries. I want the reporting convention on the record before any numbers appear: mechanical values are means of three specimens, individual values were not retained so I cannot give standard deviations, and the fire, absorption and density figures are single determinations - indicative, not characteristic.");

/* ================= 9 compression ================= */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
tag(s, "Compression");
say(s, "Strength is set by packing density, not mineral content.");
tbl(s, [
  [TH("ID"), TH("Solids : water"), TH("Fₘₐₓ kN"), TH("σᴄ MPa")],
  [TD("C1"), TD("0.37"), TD("3.89"), TD("2.55")],
  [TD("C2"), TD("0.44"), TD("4.30"), TD("3.12")],
  [TD("C3"), TD("0.59"), TD("6.80",ACC), TD("4.10",ACC)],
], { x:0.8, y:1.95, w:4.8, colW:[0.75,1.65,1.2,1.2], rowH:0.4 });
lab(s, 0.8, 3.7, 4.8, "Observed relationship");
s.addText("σᴄ = 6.93 · (solids : water) + 0.04",
  S({ x:0.8, y:4.0, w:4.8, h:0.4, fontSize:15, bold:true, color:C.ink }));
s.addText("R² = 0.994  over 0.37 – 0.59", S({ x:0.8, y:4.42, w:4.8, h:0.28, fontSize:11, color:C.acc }));
dim(s, 0.8, 4.85, 4.8, 1.4, "With shell : binder fixed, compressive stress is linear in solids concentration across the range tested. Three formulations cannot establish a law — but the reading is testable: remove water rather than add shell.");
s.addChart(pres.ChartType.bar, [{ name:"σ", labels:["C1  0.37","C2  0.44","C3  0.59"], values:[2.55,3.12,4.10] }],
  { x:6.1, y:1.9, w:6.4, h:4.3, barDir:"col", chartColors:[C.ink], showLegend:false,
    showValue:true, dataLabelPosition:"outEnd", dataLabelColor:C.ink, dataLabelFontSize:12,
    dataLabelFontFace:"+mn-lt", dataLabelFormatCode:"0.00",
    catAxisLabelColor:C.grey, catAxisLabelFontSize:10.5, catAxisLabelFontFace:"+mn-lt",
    valAxisLabelColor:C.grey, valAxisLabelFontSize:10, valAxisLabelFontFace:"+mn-lt",
    valAxisTitle:"Compressive stress (MPa)", showValAxisTitle:true, valAxisTitleColor:C.grey,
    valAxisTitleFontSize:10.5, valAxisTitleFontFace:"+mn-lt", valAxisMaxVal:5,
    valGridLine:{ color:C.line, size:1 }, catGridLine:{ style:"none" }, objectName:"cc" });
s.addNotes("The compression result is tidier than I expected. Because shell-to-binder is fixed at two, solids concentration is the only variable, and compressive stress is linear in it with an R-squared of 0.994. Three points will fit almost any line, so I am not claiming a law. I am claiming a testable hypothesis with a physical reading: strength here is governed by packing density, not mineral content. If that is right, the route to a stronger composite is to remove water, not to add shell.");

/* ================= 10 failure mode ================= */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
tag(s, "Failure mode");
say(s, "It crushes progressively. It does not fracture.");
s.addImage({ path:G+"04-basma-ficilasmis-kup.jpeg", x:0.8, y:1.95, w:1.85, h:4.0, objectName:"cube" });
micro(s, 0.8, 6.05, 2.2, "C3 after loading: barrelled, shortened, intact");
lab(s, 3.15, 1.95, 5.1, "Compressive stress – strain, C3");
s.addImage({ path:G+"05b-basma-egrisi.png", x:3.15, y:2.25, w:5.1, h:2.85, objectName:"curve" });
dim(s, 2.5, 3.2, 1.3, 0.3, "Stress (MPa)", false, 9.5);
dim(s, 3.15, 5.12, 5.1, 0.3, "Strain", false, 9.5);
s.addText("1.38 g/cm³   ·   2.96 MPa per g/cm³",
  S({ x:3.15, y:5.55, w:5.1, h:0.32, fontSize:12.5, bold:true, color:C.ink }));
micro(s, 3.15, 5.9, 5.1, "Bulk density on a mould-volume basis, therefore a lower bound.");
lab(s, 8.75, 1.95, 3.75, "Reading the curve");
list(s, 8.75, 2.25, 3.75, 2.8, [
  "Linear elastic to approximately 1 MPa",
  "Progressive stiffness loss as the agar network yields",
  "Peak at roughly 10% strain, no abrupt load drop",
  "Beyond peak: deformation with retained integrity",
]);
micro(s, 8.75, 5.3, 3.75, "Strain derived from an assumed 10% maximum deformation based on observation, not instrumented measurement.");
s.addNotes("The failure mode is what I would ask about if I were sitting where you are. The curve is linear to about one megapascal, then stiffness falls away progressively as the agar network yields and the mineral redistributes. Peak arrives at roughly ten percent strain with no abrupt drop, and beyond peak the specimen keeps deforming while holding together. Energy is absorbed rather than released. One honesty point: the strain axis derives from an assumed ten percent maximum deformation based on observation, not instrumented measurement.");

/* ================= 11 flexure ================= */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
tag(s, "Flexure");
say(s, "Plasticiser content decides whether the material resists at all.");
tbl(s, [
  [TH("ID"), TH("Glycerol % solids"), TH("Fₘₐₓ N"), TH("σꜰ MPa"), TH("Eꜰ MPa"), TH("ε peak")],
  [TD("F1"), TD("18.8"), TD("—"), TD("not measurable",{italic:true}), TD("—"), TD("—")],
  [TD("F2"), TD("10.3"), TD("310"), TD("2.325",ACC), TD("192",ACC), TD("0.0121")],
], { x:0.8, y:1.95, w:7.4, colW:[0.75,1.8,1.1,1.8,1.0,0.95], rowH:0.4 });
micro(s, 0.8, 3.3, 7.4, "σꜰ = 3FL / 2bd²  with F = 310 N, L = 120 mm, b = 60 mm, d = 20 mm");
s.addImage({ path:G+"06-egilme-buyuk-sehim.jpg", x:0.8, y:3.75, w:1.2, h:2.67, objectName:"bend" });
s.addImage({ path:G+"08b-yivli-panel-kemer.jpg", x:2.2, y:3.75, w:1.55, h:2.17, objectName:"arch" });
s.addImage({ path:G+"09b-egilme-egrisi.png", x:4.1, y:4.05, w:4.1, h:2.32, objectName:"fc" });
lab(s, 4.1, 3.75, 4.1, "Flexural stress – strain, F2");
micro(s, 0.8, 6.5, 3.0, "Three-point rig; kerfed panel arched by hand");
lab(s, 8.75, 1.95, 3.75, "Disclosure — section geometry");
txt(s, 8.75, 2.25, 3.75, 2.0, "The specimen carries transverse kerfs on its tension face. ASTM D790-17 assumes a solid rectangular section and the calculation uses the full 60 × 20 mm. Part of the measured compliance is geometric, so the modulus is a lower bound.", false, 11.5);
lab(s, 8.75, 4.5, 3.75, "Interpretation");
txt(s, 8.75, 4.8, 3.75, 1.7, "At 18.8% glycerol the composite deformed without developing measurable resistance. Halving it produced a section that resists while still flexing. The transition lies between these values.", false, 11.5);
s.addNotes("Flexure, to ASTM D790. The decisive variable is plasticiser. At 18.8 percent glycerol the composite deformed without developing measurable resistance - the machine registered nothing usable. Halving it gives 2.325 megapascals at a modulus of 192. The transition is sharp and lies between those values. Two disclosures. The glycerol effect is confounded with solids concentration, as I showed. And look at the tension face: it is kerfed. D790 assumes a solid rectangle and my calculation uses the full twenty millimetre depth, so some of this compliance is geometry. The modulus is a lower bound on the bulk material.");

/* ================= 12 fire + hygric ================= */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
tag(s, "Fire, moisture, density");
s.addImage({ path:G+"10-alev-testi.png", x:0.8, y:1.05, w:1.5, h:3.25, objectName:"flame" });
lab(s, 2.65, 1.05, 4.2, "Ignitability — ISO 11925-2");
fig(s, 2.65, 1.4, 1.9, "~10 s", "to ignition");
fig(s, 4.75, 1.4, 2.1, "4 s", "to self-extinguish");
list(s, 2.65, 2.75, 4.2, 1.3, [
  "Charring local to flame contact",
  "No lateral flame spread",
  "No melting, no dripping",
]);
micro(s, 2.65, 4.25, 4.2, "Probable mechanism: endothermic carbonate decomposition releasing CO₂, not verified calorimetrically. Ignitability only — no Euroclass, cone calorimetry, smoke or toxicity data.");
s.addShape(pres.ShapeType.rect, { x:7.2, y:1.05, w:0.02, h:4.6, fill:{ color:C.line }, line:{ color:C.line, transparency:100 }, objectName:"r2" });
lab(s, 7.6, 1.05, 4.9, "Water absorption — ASTM D570");
s.addText("0.7%", S({ x:7.6, y:1.35, w:1.5, h:0.56, fontSize:30, bold:true, color:C.acc, valign:"bottom" }));
dim(s, 9.2, 1.4, 3.3, 1.1, "mass gain over 24 h immersion, shellac-coated. Local dissolution where the coating was thin: coating integrity is the limiting factor, not the composite.");
lab(s, 7.6, 2.75, 4.9, "Bulk density");
tbl(s, [
  [TH("Material"), TH("g/cm³"), TH("Reference")],
  [TL("This study (C3)", ACC), TD("1.38", ACC), TL("—")],
  [TL("Mycelium, cellulose"), TD("0.3 – 0.8"), TL("Jones et al. 2020")],
  [TL("Fired clay brick"), TD("1.6 – 2.0"), TL("William & Owen 1995")],
  [TL("Normal-weight concrete"), TD("2.4"), TL("William & Owen 1995")],
], { x:7.6, y:3.05, w:4.9, colW:[2.0,1.05,1.85], rowH:0.34, fontSize:10 });
micro(s, 7.6, 4.85, 4.9, "Quoted on a mould-volume basis and therefore a lower bound.");
s.addNotes("Three environmental properties. On fire: ignition at around ten seconds under direct flame, self-extinguishing four seconds after removal, charring local, no lateral spread, no melting or dripping. Probable mechanism is endothermic carbonate decomposition releasing carbon dioxide, not verified calorimetrically. To be explicit: this is an ignitability test. No Euroclass, no cone calorimetry, no smoke or toxicity. On water: 0.7 percent mass gain with three shellac coats, with local dissolution where the coating was thin, so coating integrity is the limit. On density: 1.38, between the fungal and cellulosic materials below and fired clay above, on a mould-volume basis so a lower bound.");

/* ================= 13 benchmark I ================= */
pres.addSection({ title:"Benchmark" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Benchmark" });
tag(s, "Against conventional interior materials");
s.addChart(pres.ChartType.bar, [
  { name:"Compressive", labels:["Compressed\nmushroom panel","This study\n(C3)","WPC","MDF","Travertine"], values:[1.2,4.1,7.2,24,80] },
  { name:"Flexural",    labels:["Compressed\nmushroom panel","This study\n(C3)","WPC","MDF","Travertine"], values:[1.0,2.3,12,35,11] },
], { x:0.8, y:1.05, w:8.1, h:4.8, barDir:"col", barGrouping:"clustered",
     chartColors:[C.ink, C.faint], showLegend:true, legendPos:"t",
     legendColor:C.grey, legendFontSize:10.5, legendFontFace:"+mn-lt",
     showValue:true, dataLabelPosition:"outEnd", dataLabelColor:C.body, dataLabelFontSize:10,
     dataLabelFontFace:"+mn-lt", dataLabelFormatCode:"0.0",
     catAxisLabelColor:C.grey, catAxisLabelFontSize:10, catAxisLabelFontFace:"+mn-lt",
     valAxisLabelColor:C.grey, valAxisLabelFontSize:10, valAxisLabelFontFace:"+mn-lt",
     valAxisTitle:"Strength (MPa)", showValAxisTitle:true, valAxisTitleColor:C.grey,
     valAxisTitleFontSize:10.5, valAxisTitleFontFace:"+mn-lt",
     valGridLine:{ color:C.line, size:1 }, catGridLine:{ style:"none" }, objectName:"b1" });
micro(s, 0.8, 5.95, 8.1, "Velasco & Gaona 2011 · Klyosov 2007 · Nemli & Aydın 2007 · Altun 2006");
lab(s, 9.4, 1.05, 3.1, "Position");
txt(s, 9.4, 1.35, 3.1, 2.4, "One sixth the compressive strength of MDF and one twentieth that of travertine — a stone the material visually resembles. Three times compressed mushroom panel, the only other fully bio-based board here.", false, 11.5);
s.addText("On strength alone it does not compete with engineered wood or stone, and this paper does not claim it does.",
  S({ x:9.4, y:4.1, w:3.1, h:1.5, fontSize:11.5, bold:true, color:C.acc, lineSpacing:17 }));
s.addNotes("First benchmark, against the materials this would sit alongside. Let me be blunt. One sixth of MDF, one twentieth of travertine - and travertine is the relevant comparison aesthetically because the material looks like it. It does beat compressed mushroom panel, the only other fully bio-based board in the set, by a factor of three. But on strength alone it does not compete with engineered wood or stone, and I will not claim that it does.");

/* ================= 14 benchmark II ================= */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Benchmark" });
tag(s, "Against bio-based composites");
say(s, "Water-cast and ambient-dried, at melt-processed stiffness.");
lab(s, 0.8, 1.95, 5.6, "Compressive strength");
tbl(s, [
  [TH("Material"), TH("σᴄ MPa"), TH("Reference")],
  [TL("This study (C3)", ACC), TD("4.1", ACC), TL("—")],
  [TL("Mycelium composite"), TD("0.145 – 0.452"), TL("Jones et al. 2020")],
  [TL("Hempcrete"), TD("0.3 – 0.6"), TL("Arnaud & Gourlay 2012")],
  [TL("Eggshell-filled PLA"), TD("2 – 5"), TL("Kim & Pal 2010")],
  [TL("Mineral-filled biocomposite"), TD("2.1 – 39.6"), TL("Shah et al. 2016")],
  [TL("30% algae-filled"), TD("21.3"), TL("Kim & Pal 2010")],
], { x:0.8, y:2.25, w:5.6, colW:[2.6,1.5,1.5], rowH:0.36, fontSize:10 });
lab(s, 6.9, 1.95, 5.6, "Elastic modulus");
tbl(s, [
  [TH("Material"), TH("E MPa"), TH("Reference")],
  [TL("This study (F2)", ACC), TD("192", ACC), TL("—")],
  [TL("Mycelium composite"), TD("1.8 – 5"), TL("Islam et al. 2018")],
  [TL("Soy-based bioplastic"), TD("124"), TL("Mansour et al. 2021")],
  [TL("Corn starch + hemp"), TD("158"), TL("Dweib et al. 2004")],
  [TL("Flax-fibre PLA"), TD("198"), TL("Faruk et al. 2012")],
  [TL("LDPE"), TD("100 – 300"), TL("Zhao et al. 2022")],
  [TL("Wood (pine)"), TD("11 000"), TL("Pope & Hudson 1989")],
], { x:6.9, y:2.25, w:5.6, colW:[2.5,1.4,1.7], rowH:0.36, fontSize:10 });
txt(s, 0.8, 5.35, 11.7, 0.45, "An order of magnitude above the fungal and lime-binder family in compression, and inside the bio-polymer band in stiffness — between soy bioplastic and flax-fibre PLA, within the LDPE range.", false, 12.5);
micro(s, 0.8, 5.95, 11.7, "Unfilled agar films in the packaging literature sit well below this: the mineral phase, not the binder, carries the stiffness. Wood remains two orders of magnitude above.");
s.addNotes("Second benchmark, and this is the one that matters. Against the bio-based family the position changes completely. In compression the material is an order of magnitude above mycelium composites and hempcrete. In stiffness it sits inside the bio-polymer band: 192, between soy bioplastic at 124 and flax-fibre PLA at 198, within the LDPE range. Note what that means. This is water-cast, dried at room temperature, no oven and no extrusion, and it reaches the stiffness of melt-processed bio-polymers. Wood is still two orders of magnitude above and I will not pretend otherwise.");

/* ================= 15 resilience — diagram ================= */
s = pres.addSlide({ masterName:"DARK", sectionTitle:"Benchmark" });
tag(s, "A derived property", true);
say(s, "Stiffness sits in the denominator.", true);
// stress-strain schematic: the shaded triangle IS the formula
const ax = 0.9, ay = 2.3, aw = 4.3, ah = 2.6;
s.addShape(pres.ShapeType.rect, { x:ax, y:ay, w:0.02, h:ah, fill:{ color:C.onDf }, line:{ color:C.onDf, transparency:100 }, objectName:"vax" });
s.addShape(pres.ShapeType.rect, { x:ax, y:ay+ah, w:aw, h:0.02, fill:{ color:C.onDf }, line:{ color:C.onDf, transparency:100 }, objectName:"hax" });
s.addShape("rtTriangle", { x:ax+0.02, y:ay+0.75, w:2.5, h:ah-0.75, flipH:true,
  fill:{ color:C.acc, transparency:35 }, line:{ color:C.acc, width:1.5 }, objectName:"area" });
s.addText("σꜰ", S({ x:ax-0.55, y:ay+0.55, w:0.5, h:0.3, fontSize:12, bold:true, color:C.onD, align:"right" }));
s.addText("ε", S({ x:ax+2.3, y:ay+ah+0.08, w:0.4, h:0.3, fontSize:12, bold:true, color:C.onD }));
s.addText("Ur", S({ x:ax+1.25, y:ay+1.95, w:0.6, h:0.3, fontSize:13, bold:true, color:C.onD }));
micro(s, ax, ay+ah+0.45, 4.3, "Area under the elastic region to yield  =  ½ σ ε  =  σ² / 2E", true);
s.addShape(pres.ShapeType.rect, { x:5.9, y:2.0, w:0.02, h:3.6, fill:{ color:C.onDf }, line:{ color:C.onDf, transparency:100 }, objectName:"r3" });
lab(s, 6.4, 2.0, 2.9, "The quantity", true);
s.addText("Ur = σꜰ² / 2Eꜰ", S({ x:6.4, y:2.3, w:2.9, h:0.4, fontSize:17, bold:true, color:C.onD }));
s.addText("14.1 kJ/m³", S({ x:6.4, y:2.85, w:2.9, h:0.45, fontSize:22, bold:true, color:C.acc }));
micro(s, 6.4, 3.35, 2.9, "2.325² / (2 × 192), from this study's own measured values for F2", true);
dim(s, 6.4, 4.1, 2.9, 1.5, "The low modulus that counted against the material in the previous benchmark is exactly what raises this quantity.", true, 11.5);
lab(s, 9.7, 2.0, 2.8, "Why it fits, and its limit", true);
txt(s, 9.7, 2.3, 2.8, 2.0, "Both programmes gave the same result: substantial deformation with retained integrity. Strength records the load at which a material stops performing, not how it then fails.", true, 11.5);
micro(s, 9.7, 4.45, 2.8, "A comparative table cannot yet be assembled: the literature reports σ and E in separate studies on different formulations. This is a data point and a measurement convention, not a ranking.", true);
s.addNotes("This brings me to the fifth question. The modulus of resilience is the elastic strain energy absorbed per unit volume up to permanent deformation - and the diagram on the left is the formula. The shaded area under the elastic line is one half sigma epsilon, and since epsilon equals sigma over E, that area is sigma squared over two E. Note where stiffness sits: in the denominator. So the low modulus that counted against the material on the previous slide is exactly what raises this quantity. For F2 it comes to about 14 kilojoules per cubic metre, from this study's own two measurements. Why does it fit this class? Because both programmes gave the same result - substantial deformation with retained integrity. Strength tells you the load at which a material stops performing, not how it then fails, and for a demountable non-loadbearing component that is what governs service life. The honest limit: I cannot give you a comparative table, because the literature reports strength and modulus in separate studies on different formulations. This is a data point and a measurement convention, not a ranking.");

/* ================= 16 application ================= */
pres.addSection({ title:"Application" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Application" });
tag(s, "Application pathway");
s.addImage({ path:G+"11-moduler-sistem.jpeg", x:0.8, y:1.05, w:2.9, h:2.39, objectName:"mod" });
s.addImage({ path:G+"12-ic-mekan-render.jpeg", x:0.8, y:3.65, w:2.9, h:2.38, objectName:"ren" });
micro(s, 0.8, 6.15, 2.9, "Modular proposal developed from the measured properties");
lab(s, 4.2, 1.05, 8.3, "What the measurements permit");
[["Low strength, high deformation capacity","self-weight and handling loads only; no structural duty"],
 ["Self-extinguishing, no dripping","interior surfaces away from ignition sources"],
 ["Coating-dependent water resistance","dry interiors; not wet rooms or facades"],
 ["Repeatable small-format casting","a module, not a sheet — failure is replaced one unit at a time"]]
 .forEach(([h,b],i)=>{ const y=1.38+i*0.6;
  s.addText([{ text:h+"   ", options:{ bold:true, color:C.ink } },{ text:b, options:{ color:C.grey } }],
    S({ x:4.2, y, w:8.3, h:0.52, fontSize:11.5, lineSpacing:16 })); });
lab(s, 4.2, 3.95, 8.3, "Potentials for sustainable interiors");
[["Waste valorisation at source","A local food-waste stream becomes a surface material with no intermediate industry."],
 ["Low-energy production","No oven, no autoclave, no extrusion. One 55-minute cook, then ambient drying."],
 ["End-of-life by design","Every constituent biodegrades, including the shellac finish."],
 ["Reversible assembly","Adhesive-free modular assembly means reuse precedes recycling."],
 ["Displacing a mineral extraction","Substitutes quarried limestone in a surface application, not a downcycled use."],
 ["Low-barrier manufacture","A grinder, a sieve, a hotplate and silicone moulds. Production can be distributed."]]
 .forEach(([h,b],i)=>{ const x=4.2+(i%2)*4.25, y=4.28+Math.floor(i/2)*0.74;
  s.addText(h, S({ x, y, w:3.95, h:0.26, fontSize:11, bold:true, color:C.ink }));
  s.addText(b, S({ x, y:y+0.26, w:3.95, h:0.42, fontSize:9.5, color:C.grey, lineSpacing:12.5 })); });
s.addText("No life-cycle assessment was carried out. These are qualitative potentials grounded in the protocol, not quantified environmental claims.",
  S({ x:4.2, y:6.5, w:8.3, h:0.35, fontSize:10.5, bold:true, color:C.acc }));
s.addNotes("The application pathway follows from the measurements. Low strength with high deformation capacity means self-weight and handling loads only. Self-extinguishing with no dripping means interior surfaces away from ignition sources. Coating-dependent water resistance means dry interiors, not wet rooms and not facades. Repeatable small-format casting means a module rather than a sheet, so failure is replaced one unit at a time. Below that, six potentials - and I will call them potentials. Waste valorisation at source, low-energy production with no oven, biodegradable end-of-life including the finish, reversible adhesive-free assembly, direct displacement of quarried limestone rather than a downcycled use, and low-barrier manufacture. One caveat: no life-cycle assessment was carried out, so these are qualitative, not quantified claims.");

/* ================= 17 limitations ================= */
pres.addSection({ title:"Closing" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Closing" });
tag(s, "Limitations");
[["Dispersion not reported","Means of three specimens; individual values not retained, so no standard deviations."],
 ["Formulation confound in flexure","Glycerol, solids concentration and shell : binder moved together between F1 and F2."],
 ["Section geometry in flexure","A kerfed specimen treated as a solid rectangle. The modulus is a lower bound."],
 ["Strain not instrumented","Compressive strain derived from an assumed 10% maximum deformation."],
 ["Shrinkage unquantified","Post-drying dimensions not logged; density is a lower bound."],
 ["Process not instrumented","Manual stirring; single laboratory, single operator, no inter-laboratory reproduction."],
 ["No durability data","No humidity or thermal cycling, UV exposure, microbial resistance or accelerated ageing."],
 ["No fire classification or LCA","Ignitability only; no Euroclass determination and no life-cycle assessment."]]
 .forEach(([h,b],i)=>{ const x=0.8+(i%2)*6.15, y=1.1+Math.floor(i/2)*1.3;
  s.addText(h, S({ x, y, w:5.6, h:0.28, fontSize:12, bold:true, color:C.ink }));
  s.addText(b, S({ x, y:y+0.3, w:5.6, h:0.72, fontSize:10.5, color:C.grey, lineSpacing:14 }));
  s.addShape(pres.ShapeType.rect, { x, y:y+1.1, w:5.6, h:0.01, fill:{ color:C.line }, line:{ color:C.line, transparency:100 }, objectName:"ln"+i }); });
s.addText("Each defines a specific next experiment rather than a general caveat.",
  S({ x:0.8, y:6.35, w:11.7, h:0.32, fontSize:12, bold:true, color:C.acc }));
s.addNotes("I would rather set these out precisely than have them found. Dispersion not reported. A formulation confound in the flexural comparison. A kerfed section treated as solid. Strain assumed, not instrumented. Shrinkage unquantified. The process not instrumented - manual stirring, one laboratory, one operator. No durability data of any kind. No fire classification and no LCA. Each defines a specific next experiment rather than a vague caveat.");

/* ================= 18 conclusions ================= */
s = pres.addSlide({ masterName:"DARK", sectionTitle:"Closing" });
tag(s, "Conclusions", true);
[["01","A reproducible protocol","120 °C shell treatment · 150 µm fraction · 95 °C dissolution · 80 °C cook · 55 min · silicone casting · 11 days ambient"],
 ["02","Solids concentration governs strength","With shell : binder fixed at 2.00, compressive stress is linear in solids concentration across 0.37–0.59"],
 ["03","Plasticiser sets the brittle–ductile transition","Between 18.8% and 10.3% glycerol, from unmeasurable compliance to 2.33 MPa at 192 MPa"],
 ["04","Bio-polymer stiffness, oven-free","192 MPa places a water-cast, ambient-dried material inside the melt-processed bio-polymer band"],
 ["05","Strength is the wrong sole criterion","Deformation capacity governs service behaviour; σ and E should be reported together"]]
 .forEach(([n,h,b],i)=>{ const y=1.15+i*1.0;
  s.addText(n, S({ x:0.8, y, w:0.55, h:0.3, fontSize:12, bold:true, color:C.acc }));
  s.addText(h, S({ x:1.45, y, w:4.0, h:0.68, fontSize:12.5, bold:true, color:C.onD, lineSpacing:16 }));
  s.addText(b, S({ x:5.7, y, w:6.8, h:0.8, fontSize:11, color:C.onDg, lineSpacing:15 }));
  if (i<4) s.addShape(pres.ShapeType.rect, { x:0.8, y:y+0.86, w:11.7, h:0.01,
    fill:{ color:C.onDf }, line:{ color:C.onDf, transparency:100 }, objectName:"cl"+i }); });
s.addText("Betül Ünal   ·   Cappadocia University   ·   b.unal91@gmail.com",
  S({ x:0.8, y:6.3, w:11.7, h:0.28, fontSize:11.5, bold:true, color:C.onD }));
micro(s, 0.8, 6.62, 11.7, "Testing: Advanced Construction Materials Research Laboratory, Hacettepe University, with thanks to Dr Hüseyin İlcan. Derived from the author's doctoral dissertation, Hacettepe University, 2025.", true);
s.addNotes("Five conclusions. A reproducible protocol, parameter by parameter. Solids concentration, not mineral content, governs compressive strength. Plasticiser content sets the brittle-ductile transition. A water-cast, ambient-dried material reaches bio-polymer stiffness without an oven. And strength alone is the wrong criterion for this class: deformation capacity governs service behaviour, and strength and modulus should be reported together. Thank you - I am happy to take questions.");

/* ================= 19 references ================= */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Closing" });
tag(s, "Selected references");
[["Reviews and state of the art",[
  "Ngayakamo, B. & Onwualu, A.P. (2022). Valorisation of eggshell waste for sustainable construction materials. Heliyon.",
  "Owuamanam, S. & Cree, D. (2020). Progress of bio-calcium carbonate waste eggshell and seashell fillers in polymer composites. Journal of Composites Science, 4(2), 70.",
  "Biogenic calcium carbonate from waste shells for advanced material applications (2022). Frontiers in Materials, 9, 1024977."]],
 ["Agar and bio-polymer systems",[
  "Hernández, V. et al. (2022). Agar biopolymer films for biodegradable packaging: a reference dataset. Materials, 15(11), 3954.",
  "Materiom (2026). Open biomaterial recipe commons and property database. materiom.org/data.",
  "Mansour et al. (2021) · Dweib et al. (2004) · Faruk et al. (2012) · Zhao et al. (2022) — bio-polymer elastic moduli."]],
 ["Comparative material data",[
  "Jones, M. et al. (2020) · Islam et al. (2018) — mycelium composites. Arnaud & Gourlay (2012) — hempcrete.",
  "Kim & Pal (2010) — eggshell-filled PLA. Shah et al. (2016) — mineral-filled biocomposites.",
  "Nemli & Aydın (2007) — MDF. Altun (2006) — travertine. Klyosov (2007) — WPC. Velasco & Gaona (2011) — mushroom panel."]]]
 .forEach(([h,items],i)=>{ const y=1.1+i*1.7;
  lab(s, 0.8, y, 11.7, h);
  s.addText(items.map((x,j)=>({ text:x, options:{ bullet:{ characterCode:"2013" }, breakLine:j<items.length-1 } })),
    S({ x:0.8, y:y+0.3, w:11.7, h:1.2, fontSize:10, color:C.grey, paraSpaceAfter:3, lineSpacing:14 }));
  s.addShape(pres.ShapeType.rect, { x:0.8, y:y+1.5, w:11.7, h:0.01, fill:{ color:C.line }, line:{ color:C.line, transparency:100 }, objectName:"rl"+i }); });
micro(s, 0.8, 6.3, 11.7, "Standards: ASTM D790-17 · ISO 11925-2:2020 · ASTM D570-98(2018).");
s.addNotes("Selected references, left up for questions.");

(async () => {
  await pres.writeFile({ fileName: OUT });
  const { applyTheme } = require("/root/.claude/skills/synced/ed12a668-6f07-4018-aad4-7be975f5699f_093145d0-7b3e-473d-b700-d8211791c264/pptx/scripts/apply_theme.js");
  await applyTheme(OUT, THEME);
  console.log("yazildi");
})();
