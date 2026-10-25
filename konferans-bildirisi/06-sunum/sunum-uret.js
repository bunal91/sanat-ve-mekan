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

/* ========== 6 questions ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Position" });
H1(s, "Questions");
[["01","Which formulation variable governs compressive strength?"],
 ["02","What does plasticiser content do to flexural behaviour?"],
 ["03","How does it compare with conventional interior materials?"],
 ["04","How does it compare with other bio-based composites?"],
 ["05","Is compressive strength the right criterion at all?"]]
 .forEach(([n,q],i)=>{ const y=1.75+i*1.0;
  s.addText(n, S({ x:0.8, y:y+0.1, w:0.6, h:0.3, fontSize:12, bold:true, color:K.acc }));
  s.addText(q, S({ x:1.6, y, w:10.9, h:0.55, fontSize:16, color:K.ink }));
  if (i<4) rule(s, 0.8, y+0.72, 11.7); });
s.addNotes("Five questions. The first two are formulation questions, the next two benchmarking, and the fifth is the one I actually care about and will come back to at the end.");

/* ========== 7 the material — full bleed ========== */
pres.addSection({ title:"Material" });
s = pres.addSlide({ masterName:"FULL", sectionTitle:"Material" });
s.addImage({ path:G+"01-prototip-cesitlemeleri.jpeg", x:0, y:0, w:13.33, h:7.5, objectName:"mat" });
band(s, "Four constituents, all biodegradable",
  "Waste eggshell powder · agar · glycerol · water, with a shellac finish. Colour and texture vary from natural pigments and mould geometry at constant composition.");
s.addNotes("This is the material. Four constituents: waste eggshell powder as the mineral phase, agar as the binder, glycerol as the plasticiser, water as the carrier, and a shellac finish where water resistance matters. Everything you see here is one formulation family - the variation in colour and texture comes from natural pigments and mould geometry, not from different compositions. Beetroot gives the dark tones.");

/* ========== 8 components ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Material" });
H1(s, "What each does");
tbl(s, [
  [TH("Constituent"), TH("Origin"), TH("Function"), TH("Relevant property")],
  [TL("Eggshell powder"), TL("Food waste"), TL("Mineral filler; carries load"), TL("94% CaCO₃; porous structure")],
  [TL("Agar"), TL("Red seaweed"), TL("Continuous binding phase"), TL("Thermoreversible gel")],
  [TL("Glycerol"), TL("Vegetable oil"), TL("Plasticiser; sets ductility"), TL("Humectant; low vapour pressure")],
  [TL("Water"), TL("—"), TL("Carrier; sets solids packing"), TL("Fully evaporated on drying")],
  [TL("Shellac"), TL("Kerria lacca"), TL("Hydrophobic surface finish"), TL("Biodegradable film-former")],
], { x:0.8, y:1.5, w:11.7, colW:[2.1,1.7,3.6,4.3], rowH:0.44 });
s.addText("Water is not in the finished material. It is the process variable that sets how densely the solids pack.",
  S({ x:0.8, y:4.2, w:11.7, h:0.4, fontSize:14, bold:true, color:K.acc }));
dim(s, 0.8, 4.85, 11.7, 0.5, "Gelatine, starch and vinegar were trialled during development and are not part of the reported formulations.");
s.addNotes("Five constituents and a clear division of labour. Eggshell carries load. Agar forms the continuous network. Glycerol decides whether the composite behaves brittle or ductile. Shellac is a surface finish only. And water is not in the final material at all - it is the process variable that sets how densely the solids pack. Hold that, because it turns out to be the controlling variable.");

/* ========== 9 protocol — diagram ========== */
pres.addSection({ title:"Protocol" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Protocol" });
H1(s, "Protocol");
const ST = [["01","Mineral fraction","120 °C","20 min",["Clean of membrane","Heat-treat, then dry","Mill to fine powder","Sieve, 150 µm passing"]],
            ["02","Binder phase","95 °C","",["Water and glycerol first","Agar added incrementally","Held until fully dissolved"]],
            ["03","Compositing","80 °C","55 min total",["Temperature reduced","Viscosity develops","Shell added incrementally"]],
            ["04","Casting and cure","23 °C","11 days",["Silicone moulds","Four days in mould","Seven days ambient","No oven at any stage"]]];
const BX=0.8, BW=2.7, GP=0.45;
rule(s, 0.8, 1.72, 11.7);
ST.forEach(([n,h,temp,dur,items],i)=>{
  const x = BX + i*(BW+GP);
  s.addText(temp, S({ x, y:1.9, w:BW, h:0.5, fontSize:24, bold:true, color:K.acc, valign:"bottom" }));
  if (dur) s.addText(dur, S({ x, y:2.42, w:BW, h:0.26, fontSize:10, color:K.grey }));
  s.addShape(pres.ShapeType.rect, { x, y:2.85, w:BW, h:0.7,
    fill:{ color:i===3?"FFFFFF":K.panel }, line:{ color:i===3?K.ink:K.line, width:1 }, objectName:"bk"+i });
  s.addText(n, S({ x:x+0.2, y:2.97, w:0.4, h:0.26, fontSize:10, bold:true, color:K.acc }));
  s.addText(h, S({ x:x+0.2, y:3.2, w:BW-0.4, h:0.28, fontSize:13, bold:true, color:K.ink }));
  if (i<3) s.addShape(pres.ShapeType.rightArrow, { x:x+BW+0.07, y:3.1, w:0.3, h:0.2,
    fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"a"+i });
  list(s, x, 3.8, BW, 1.8, items, false, 10.5);
});
rule(s, 0.8, 5.85, 11.7);
dim(s, 0.8, 6.05, 11.7, 0.9, "Disclosure — the composite shrinks appreciably as water evaporates; post-drying dimensions were not logged, so dimensions quoted are mould dimensions. Stirring was manual: shear rate is not a controlled quantity.");
s.addNotes("This is the protocol, and it is the contribution. Read it left to right with the temperatures above. Shell preparation at 120 degrees for twenty minutes - decontamination and drying, not sterilisation, because dry-heat sterilisation needs far higher temperatures and we did not verify sterility. Then the binder: water and glycerol first, agar added incrementally because bulk addition forms agglomerates that never redisperse, dissolved at 95. Temperature drops to 80 and the mineral goes in late, because adding it earlier lets it settle out. Fifty-five minutes of heating in total. Then silicone moulds, four days in mould, seven days ambient, no oven at any point. Two disclosures, and I will be explicit: the material shrinks as water leaves and we did not log the dried dimensions, and stirring was manual so shear rate is uncontrolled.");

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

/* ========== 16 fire — big photo ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Fire");
s.addImage({ path:G+"10-alev-testi.png", x:0.8, y:1.5, w:2.5, h:5.42, objectName:"fl" });
fig(s, 3.9, 1.6, 2.6, "~10 s", "to ignition under direct flame", false, 40);
fig(s, 3.9, 3.1, 2.6, "4 s", "to self-extinguish after the flame is removed", false, 40);
list(s, 3.9, 4.7, 2.6, 1.6, ["Charring stays local","No lateral spread","No melting, no dripping"], false, 11.5);
vrule(s, 7.1, 1.5, 5.0);
lab(s, 7.6, 1.5, 4.9, "Mechanism");
txt(s, 7.6, 1.8, 4.9, 1.5, "The carbonate fraction decomposes endothermically and releases CO₂, diluting the flame front locally. Consistent with the absence of spread, but not verified calorimetrically.", false, 12.5);
rule(s, 7.6, 3.6, 4.9);
lab(s, 7.6, 3.85, 4.9, "What this is not");
txt(s, 7.6, 4.15, 4.9, 1.5, "ISO 11925-2 is an ignitability test. No Euroclass classification was determined. No cone calorimetry, smoke density or toxicity data were obtained.", false, 12.5);
s.addNotes("Reaction to fire. Ignition at around ten seconds under direct flame; self-extinguishing four seconds after the flame is removed. Charring stayed local, no lateral spread in either ignition, and - importantly for a polymer-adjacent material - no melting and no dripping. The probable mechanism is the carbonate fraction decomposing endothermically and releasing carbon dioxide, which dilutes the flame front locally. I did not verify that calorimetrically. And to be clear about what this is not: 11925-2 is an ignitability test. There is no Euroclass classification here, no cone calorimetry, no smoke density, no toxicity data.");

/* ========== 17 water and density ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Results" });
H1(s, "Water and weight");
lab(s, 0.8, 1.6, 5.5, "Absorption — 24 h full immersion");
fig(s, 0.8, 1.95, 2.4, "0.7%", "mass gain, shellac-coated", false, 46);
txt(s, 3.5, 2.05, 2.8, 1.8, "Local dissolution where the coating was thin. Coating integrity, not the composite, is the limiting factor for humid use.", false, 12);
rule(s, 0.8, 4.0, 5.5);
dim(s, 0.8, 4.25, 5.5, 1.0, "Three coats of shellac — a natural, biodegradable, hydrophobic resin. Slight dimensional expansion was observed.");
vrule(s, 6.6, 1.6, 4.4);
lab(s, 7.1, 1.6, 5.4, "Bulk density");
tbl(s, [
  [TH("Material"), TH("g/cm³"), TH("Reference")],
  [TL("This study (C3)", ACC), TD("1.38", ACC), TL("—")],
  [TL("Mycelium, cellulose"), TD("0.3 – 0.8"), TL("Jones et al. 2020")],
  [TL("Fired clay brick"), TD("1.6 – 2.0"), TL("William & Owen 1995")],
  [TL("Normal-weight concrete"), TD("2.4"), TL("William & Owen 1995")],
], { x:7.1, y:1.9, w:5.4, colW:[2.2,1.2,2.0], rowH:0.4 });
dim(s, 7.1, 4.05, 5.4, 1.2, "Denser than the fungal and cellulosic family, lighter than fired clay and concrete. Quoted on a mould-volume basis and therefore a lower bound.");
s.addNotes("Two more properties. On water: with three coats of shellac - a natural, biodegradable, hydrophobic resin - the specimen gained 0.7 percent of its mass over twenty-four hours of full immersion. There was slight dimensional expansion, and where the coating was thin the surface dissolved locally. So coating integrity, not the composite, is the limiting factor for humid use. On density: 1.38, which places it between the fungal and cellulosic bio-materials below and fired clay above. That is on a mould-volume basis, so it is a lower bound.");

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

/* ========== 21 where it fits — big images ========== */
pres.addSection({ title:"Application" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Application" });
H1(s, "Where it fits");
s.addImage({ path:G+"12-ic-mekan-render.jpeg", x:0.8, y:1.5, w:5.3, h:4.35, objectName:"ren" });
s.addImage({ path:G+"11-moduler-sistem.jpeg", x:6.4, y:1.5, w:2.6, h:2.14, objectName:"mod" });
micro(s, 0.8, 5.95, 5.3, "Modular interior proposal developed from the measured properties");
vrule(s, 9.4, 1.5, 4.6);
[["Non-loadbearing surfaces","self-weight and handling loads only"],
 ["Dry interiors","not wet rooms, not facades"],
 ["Away from ignition sources","self-extinguishing, but unclassified"],
 ["Modular, not sheet","failure replaced one unit at a time"]]
 .forEach(([h,b],i)=>{ const y=1.55+i*1.15;
  s.addText(h, S({ x:9.9, y, w:2.6, h:0.3, fontSize:13, bold:true, color:K.ink }));
  s.addText(b, S({ x:9.9, y:y+0.32, w:2.6, h:0.6, fontSize:10.5, color:K.grey, lineSpacing:14 })); });
dim(s, 6.4, 3.95, 2.6, 1.9, "Assembled without adhesive, so components can be recovered intact. Units interlock and share load. A damaged unit is exchanged without dismantling.");
s.addNotes("The application envelope follows from the measurements rather than being imposed on them. Non-loadbearing surfaces, carrying self-weight and handling loads only. Dry interiors - not wet rooms and not facades, because water performance depends on the coating. Away from ignition sources: it self-extinguishes, but it is unclassified. And modular rather than sheet, which matters because failure is then replaced one unit at a time. The assembly is adhesive-free and therefore reversible, units interlock and share load, and a damaged unit can be exchanged without dismantling the whole.");

/* ========== 22 circularity — diagram ========== */
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Application" });
H1(s, "Why it matters");
const LOOP = [["Bakery waste","one local stream"],["Shell powder","grind, sieve"],
              ["One 55-min cook","no oven, no extrusion"],["Cast module","ambient dried"],
              ["Reversible assembly","recovered intact"],["Biological cycle","all constituents degrade"]];
const LX=0.8, LW=1.78, LG=0.21;
LOOP.forEach(([h,b],i)=>{
  const x = LX + i*(LW+LG);
  s.addShape(pres.ShapeType.rect, { x, y:2.1, w:LW, h:1.5,
    fill:{ color:i===5?K.acc:K.panel }, line:{ color:i===5?K.acc:K.line, width:1 }, objectName:"lp"+i });
  s.addText(String(i+1).padStart(2,"0"), S({ x:x+0.16, y:2.24, w:0.4, h:0.24, fontSize:9.5, bold:true, color:i===5?"F2E4DE":K.acc }));
  s.addText(h, S({ x:x+0.16, y:2.52, w:LW-0.32, h:0.52, fontSize:11.5, bold:true, color:i===5?K.onD:K.ink, lineSpacing:14 }));
  s.addText(b, S({ x:x+0.16, y:3.06, w:LW-0.32, h:0.42, fontSize:9.5, color:i===5?"F2E4DE":K.grey, lineSpacing:12 }));
  if (i<5) s.addShape(pres.ShapeType.rightArrow, { x:x+LW+0.015, y:2.78, w:0.18, h:0.14,
    fill:{ color:K.faint }, line:{ color:K.faint, transparency:100 }, objectName:"la"+i });
});
s.addShape(pres.ShapeType.leftArrow, { x:6.2, y:4.1, w:0.5, h:0.3, fill:{ color:K.acc }, line:{ color:K.acc, transparency:100 }, objectName:"back" });
dim(s, 6.9, 4.12, 5.6, 0.5, "The loop closes: the material returns to the stream it came from.");
rule(s, 0.8, 4.9, 11.7);
lab(s, 0.8, 5.1, 11.7, "What is displaced");
txt(s, 0.8, 5.4, 11.7, 0.8, "Quarried limestone, in a surface application rather than a downcycled one. A grinder, a sieve, a hotplate and silicone moulds: production can be distributed rather than centralised.", false, 12.5);
micro(s, 0.8, 6.5, 11.7, "No life-cycle assessment was carried out. These are qualitative potentials grounded in the protocol, not quantified environmental claims.");
s.addNotes("Why this matters, as a loop rather than a list. A local bakery stream becomes shell powder with a grinder and a sieve. One fifty-five minute cook - no oven, no autoclave, no extrusion. A cast module, dried at ambient. Assembled reversibly, so it can be recovered intact. And at end of life every constituent degrades, including the shellac finish, so the material returns to the biological stream it came from. What is displaced is quarried limestone, in a surface application rather than a downcycled one. And the equipment list is a grinder, a sieve, a hotplate and silicone moulds, so production can be distributed rather than centralised. One caveat that matters: no life-cycle assessment was carried out. These are qualitative potentials grounded in the protocol, not quantified environmental claims.");

/* ========== 23 limits ========== */
pres.addSection({ title:"Closing" });
s = pres.addSlide({ masterName:"PAGE", sectionTitle:"Closing" });
H1(s, "Limits");
[["No dispersion data","Means of three specimens; individual values not retained."],
 ["Confounded flexural series","Glycerol, solids concentration and shell : binder moved together."],
 ["Kerfed section, solid assumption","The modulus is a lower bound, not a material constant."],
 ["Strain not instrumented","Compressive strain assumed from observation."],
 ["Shrinkage unquantified","Density is a lower bound on a mould-volume basis."],
 ["Process not instrumented","Manual stirring; one laboratory, one operator."],
 ["No durability testing","No humidity or thermal cycling, UV, microbial or ageing."],
 ["No fire class, no LCA","Ignitability only; no quantified environmental assessment."]]
 .forEach(([h,b],i)=>{ const x=0.8+(i%2)*6.15, y=1.6+Math.floor(i/2)*1.28;
  s.addText(h, S({ x, y, w:5.6, h:0.3, fontSize:13, bold:true, color:K.ink }));
  s.addText(b, S({ x, y:y+0.33, w:5.6, h:0.6, fontSize:11, color:K.grey, lineSpacing:14 }));
  rule(s, x, y+1.06, 5.6); });
s.addText("Each defines a specific next experiment.",
  S({ x:0.8, y:6.5, w:11.7, h:0.32, fontSize:13, bold:true, color:K.acc }));
s.addNotes("I would rather set these out than have them found. No dispersion data. A confounded flexural series. A kerfed section treated as solid. Strain assumed rather than instrumented. Shrinkage unquantified. The process not instrumented - manual stirring, one laboratory, one operator. No durability testing of any kind. No fire classification and no life-cycle assessment. Each of these defines a specific next experiment rather than a vague caveat, and that is the programme for the next phase.");

/* ========== 24 conclusions ========== */
s = pres.addSlide({ masterName:"DARK", sectionTitle:"Closing" });
H1(s, "Conclusions", true);
[["01","A protocol others can repeat","Every parameter reported: 120 °C · 150 µm · 95 °C · 80 °C · 55 min · silicone · 11 days ambient"],
 ["02","Packing density governs strength","With shell : binder fixed, compressive stress rises linearly with solids concentration"],
 ["03","Plasticiser sets brittle or ductile","Between 18.8% and 10.3% glycerol, from unmeasurable to 2.33 MPa at 192 MPa"],
 ["04","Bio-polymer stiffness, oven-free","Water-cast and ambient-dried, inside the melt-processed bio-polymer band"],
 ["05","Strength is not the only criterion","Deformation capacity governs service behaviour; report σ and E together"]]
 .forEach(([n,h,b],i)=>{ const y=1.45+i*1.02;
  s.addText(n, S({ x:0.8, y, w:0.55, h:0.3, fontSize:12, bold:true, color:K.acc }));
  s.addText(h, S({ x:1.45, y, w:4.3, h:0.7, fontSize:14, bold:true, color:K.onD, lineSpacing:18 }));
  s.addText(b, S({ x:6.0, y, w:6.5, h:0.8, fontSize:11, color:K.onDg, lineSpacing:15 }));
  if (i<4) rule(s, 0.8, y+0.88, 11.7, true); });
s.addText("Betül Ünal   ·   b.unal91@gmail.com",
  S({ x:0.8, y:6.45, w:11.7, h:0.3, fontSize:12, bold:true, color:K.onD }));
micro(s, 0.8, 6.78, 11.7, "Testing: Advanced Construction Materials Research Laboratory, Hacettepe University, with thanks to Dr Hüseyin İlcan. Derived from the author's doctoral dissertation, Hacettepe University, 2025.", true);
s.addNotes("Five conclusions. A protocol others can repeat, reported parameter by parameter. Packing density, not mineral content, governs compressive strength. Plasticiser content sets brittle or ductile, and the transition lies between 18.8 and 10.3 percent glycerol. A water-cast, ambient-dried material reaches bio-polymer stiffness without an oven. And strength is not the only criterion: deformation capacity governs service behaviour for this class, so strength and modulus should be reported together. Thank you. I am happy to take questions.");

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
