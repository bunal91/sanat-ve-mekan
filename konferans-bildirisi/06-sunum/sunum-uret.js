const pptxgen = require("pptxgenjs");
const G = "/home/user/sanat-ve-mekan/konferans-bildirisi/03-gorseller/";
const OUT = "/tmp/claude-0/-home-user-sanat-ve-mekan/083887b3-c080-5d69-a4cb-b10c492fdc94/scratchpad/deck/ICSMMEP26_Presentation_Unal.pptx";

const T = { name: "Eggshell Biocomposite Minimal", head: "Cambria", body: "Calibri",
  ink: "1A1A18", mute: "77736B", faint: "A8A49B", line: "E4E0D8",
  accent: "C9622F", dark: "1B3B2F", onDark: "FFFFFF", onDarkMute: "A9BFB1" };

const THEME = { name: T.name, headFontFace: T.head, bodyFontFace: T.body,
  colors: { dk1: T.ink, lt1: "FFFFFF", dk2: T.dark, lt2: "F7F5F0",
            accent1: T.accent, accent2: "5E8C6A", accent3: T.mute,
            accent4: T.dark, accent5: T.line, accent6: T.mute,
            hlink: T.accent, folHlink: T.mute } };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: T.head, bodyFontFace: T.body };
pres.author = "Betul Unal";
pres.title = "Eggshell-Agar Biocomposites for Sustainable Interior Applications";

/* ---- layouts: title at a fixed place, slide number only, no footer bar ---- */
pres.defineSlideMaster({ title: "TITLE", background: { color: T.dark }, objects: [
  { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.0, w: 8.2, h: 2.3,
      fontSize: 32, bold: true, color: T.onDark, valign: "bottom", align: "left" }, text: " " } },
  { placeholder: { options: { name: "body", type: "body", x: 0.8, y: 4.55, w: 8.2, h: 1.7,
      fontSize: 14, color: T.onDarkMute, valign: "top", align: "left" }, text: " " } } ] });

const num = (c) => ({ placeholder: { options: { name: "slideNumber", type: "sldNum",
  x: 12.2, y: 6.85, w: 0.5, h: 0.3, fontSize: 9, color: c, align: "right" } } });

pres.defineSlideMaster({ title: "PLAIN", background: { color: "FFFFFF" }, objects: [
  { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 0.52, w: 11.7, h: 0.72,
      fontSize: 26, bold: true, color: T.ink, valign: "middle", align: "left" }, text: " " } },
  num(T.faint) ] });

pres.defineSlideMaster({ title: "PIVOT", background: { color: T.dark }, objects: [
  { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 0.52, w: 11.7, h: 0.72,
      fontSize: 26, bold: true, color: T.onDark, valign: "middle", align: "left" }, text: " " } },
  num("5F7A66") ] });

/* ---- helpers ---- */
const S = (o = {}) => Object.assign({ isTextBox: true, margin: 0 }, o);
const lab = (s, x, y, w, t, d) => s.addText(t.toUpperCase(),
  S({ x, y, w, h: 0.26, fontSize: 9.5, bold: true, charSpacing: 1.2,
      color: d ? T.onDarkMute : T.faint, valign: "middle" }));
const body = (s, x, y, w, h, t, d, sz) => s.addText(t,
  S({ x, y, w, h, fontSize: sz || 13, color: d ? T.onDark : T.ink, valign: "top", lineSpacing: (sz || 13) + 6 }));
const mute = (s, x, y, w, h, t, d, sz) => s.addText(t,
  S({ x, y, w, h, fontSize: sz || 11, color: d ? T.onDarkMute : T.mute, valign: "top", lineSpacing: (sz || 11) + 5 }));
const note = (s, x, y, w, t, sz) => s.addText(t,
  S({ x, y, w, h: 0.55, fontSize: sz || 10, italic: true, color: T.faint, valign: "top", lineSpacing: (sz || 10) + 4 }));
function big(s, x, y, w, v, l, d) {
  s.addText(v, S({ x, y, w, h: 0.62, fontSize: 32, bold: true, color: T.accent,
    fontFace: T.head, valign: "bottom" }));
  s.addText(l, S({ x, y: y + 0.66, w, h: 0.5, fontSize: 10.5,
    color: d ? T.onDarkMute : T.mute, valign: "top", lineSpacing: 14 }));
}
function bullets(s, x, y, w, h, items, d, sz) {
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1 } })),
    S({ x, y, w, h, fontSize: sz || 12.5, color: d ? T.onDark : T.ink, paraSpaceAfter: 7, lineSpacing: (sz || 12.5) + 5 }));
}
const TH = (t) => ({ text: t, options: { bold: true, color: T.ink, fill: { color: "F7F5F0" }, align: "center", valign: "middle", fontSize: 11.5 } });
const TD = (t, o = {}) => ({ text: t, options: Object.assign({ align: "center", valign: "middle", color: T.ink, fontSize: 11.5 }, o) });
const TL = (t, o = {}) => TD(t, Object.assign({ align: "left" }, o));
const ACC = { bold: true, color: T.accent };
const table = (s, rows, opt) => s.addTable(rows, Object.assign({
  rowH: 0.4, fontSize: 11.5, fontFace: T.body,
  border: { type: "solid", color: T.line, pt: 1 }, fill: { color: "FFFFFF" } }, opt));
function steps(s, x, y, w, items, gap, d) {
  items.forEach(([h, b], i) => {
    const yy = y + i * gap;
    s.addText(String(i + 1).padStart(2, "0"), S({ x, y: yy, w: 0.5, h: 0.3, fontSize: 11,
      bold: true, color: T.accent, fontFace: T.head, valign: "middle" }));
    s.addText(h, S({ x: x + 0.58, y: yy, w: w - 0.58, h: 0.3, fontSize: 13.5, bold: true,
      color: d ? T.onDark : T.ink, valign: "middle" }));
    s.addText(b, S({ x: x + 0.58, y: yy + 0.3, w: w - 0.58, h: gap - 0.34, fontSize: 11,
      color: d ? T.onDarkMute : T.mute, valign: "top", lineSpacing: 15 }));
  });
}
let s;

/* ============ 1 ============ */
pres.addSection({ title: "Introduction" });
s = pres.addSlide({ masterName: "TITLE", sectionTitle: "Introduction" });
s.addImage({ path: G + "01-prototip-cesitlemeleri.jpeg", x: 9.3, y: 2.55, w: 3.4, h: 1.91, objectName: "hero" });
s.addText("Development and Characterisation of Eggshell–Agar Biocomposites for Sustainable Interior Applications", { placeholder: "title" });
s.addText([
  { text: "Betül Ünal", options: { bold: true, color: T.onDark, fontSize: 16, breakLine: true } },
  { text: "Department of Interior Architecture, Cappadocia University, Nevşehir, Türkiye", options: { breakLine: true } },
  { text: " ", options: { fontSize: 9, breakLine: true } },
  { text: "ICSMMEP-26  ·  Mecca  ·  3–4 November 2026", options: { color: "7E937F" } },
], { placeholder: "body" });
s.addNotes("Good morning. Betul Unal, Department of Interior Architecture, Cappadocia University. This paper reports a production protocol and mechanical characterisation for a fully bio-based composite made from waste eggshell bound in an agar-glycerol matrix, and proposes an evaluation criterion better suited to this class of material than compressive strength alone.");

/* ============ 2 state of the art I ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Introduction" });
s.addText("Eggshell valorisation is established", { placeholder: "title" });
lab(s, 0.8, 1.55, 7.0, "Where eggshell waste currently goes");
table(s, [
  [TH("Application"), TH("Matrix"), TH("Reference")],
  [TL("Cement replacement"), TL("Portland clinker"), TL("Teara et al. 2019")],
  [TL("Laterite brick stabilisation"), TL("Cement"), TL("Adogla et al. 2016")],
  [TL("Asphalt binder modification"), TL("Bitumen"), TL("Razzaq & Yousif 2017")],
  [TL("Soil stabilisation"), TL("Lime substitute"), TL("Soundara & Vilasini 2015")],
  [TL("Eco-ceramic wall tile"), TL("Ceramic body"), TL("Vilarinho et al. 2022")],
  [TL("Particulate filler"), TL("PLA, epoxy, PVC, PU"), TL("Owuamanam & Cree 2020")],
], { x: 0.8, y: 1.88, w: 7.0, colW: [2.9, 2.0, 2.1], rowH: 0.37 });
s.addText("In every case the matrix is petrochemical, clinker-based or ceramic.",
  S({ x: 0.8, y: 4.65, w: 7.0, h: 0.4, fontSize: 14, bold: true, color: T.accent }));
lab(s, 8.6, 1.55, 3.9, "Why the field returns to it");
bullets(s, 8.6, 1.88, 3.9, 3.0, [
  "~94% calcium carbonate",
  "Porous, protein-bound crystalline structure",
  "Specific gravity 0.85–2.66",
  "Continuously generated, landfilled at scale",
], false, 12);
mute(s, 8.6, 4.55, 3.9, 0.9, "The material argument is settled. The open question is what binds it.", false, 12);
note(s, 0.8, 5.25, 7.0, "William & Owen 1995  ·  Torres et al. 2010  ·  Shafiei et al. 2019");
s.addNotes("Let me start with where the field is rather than where my work is. Eggshell valorisation is well established - cement replacement, brick stabilisation, asphalt binders, lime substitution, ceramic bodies, and particulate filler in thermoplastics. The reason is clear: 94 percent calcium carbonate, a useful porous microstructure, and a lower specific gravity than most mineral fillers. The material argument for eggshell is settled. What is not settled is what binds it, because in every one of these cases the matrix is petrochemical, clinker-based or ceramic. The waste is valorised; the binder is not.");

/* ============ 3 state of the art II ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Introduction" });
s.addText("Agar is characterised — but only as a film", { placeholder: "title" });
lab(s, 0.8, 1.55, 5.6, "What is known");
body(s, 0.8, 1.9, 5.6, 1.5, "Hernández et al. (2022) mapped 32 agar–glycerin–water formulations by design of experiments and released the dataset openly. Across the film literature, glycerol raises elongation and lowers tensile strength.", false, 12.5);
lab(s, 0.8, 3.65, 5.6, "What is not");
body(s, 0.8, 4.0, 5.6, 1.5, "That work concerns unfilled thin films in uniaxial tension, for packaging. Agar has not been characterised as the binder of a mineral-filled cast solid in bending — the loading case for an interior surface.", false, 12.5);
lab(s, 7.3, 1.55, 5.2, "The shift this study makes");
table(s, [
  [TH("—"), TH("Film literature"), TH("This study")],
  [TL("Form"), TL("Thin cast film"), TL("Cast solid, 20–50 mm")],
  [TL("Filler"), TL("Unfilled"), TL("Mineral, 66% of solids")],
  [TL("Loading"), TL("Tension"), TL("Compression, bending")],
  [TL("Use"), TL("Packaging"), TL("Interior surfaces")],
], { x: 7.3, y: 1.88, w: 5.2, colW: [1.4, 1.85, 1.95], rowH: 0.42 });
mute(s, 7.3, 4.2, 5.2, 1.0, "The compositional logic carries over. The form, the filler and the loading case do not.", false, 12.5);
s.addNotes("Second, the binder. Agar-glycerol systems are reasonably well characterised. Hernandez and colleagues mapped thirty-two agar, glycerin and water formulations by design of experiments in 2022 and released the dataset openly. The consistent finding is that glycerol raises elongation and lowers tensile strength. But all of that concerns unfilled thin films, tested in tension, for packaging. Agar has not been characterised as the binder of a mineral-filled cast solid in bending, which is the actual loading case for an interior surface component. The compositional logic carries over; the form and the loading case do not.");

/* ============ 4 gap ============ */
s = pres.addSlide({ masterName: "PIVOT", sectionTitle: "Introduction" });
s.addText("The gap is documented, not asserted", { placeholder: "title" });
lab(s, 0.8, 1.7, 5.6, "An open commons exists", true);
body(s, 0.8, 2.05, 5.6, 1.6, "Materiom publishes biomaterial recipes under CC-BY-SA, excludes petrochemical ingredients, archives each as prior art, and indexes property data with citable DOIs. The infrastructure is built.", true, 13);
big(s, 0.8, 4.0, 2.4, "4", "recipes with published property data", true);
mute(s, 3.6, 4.05, 2.8, 1.6, "agar bioplastic\ngelatin bioplastic\nmycelium–walnut shell\nmussel shell–sucrose ceramic", true, 12);
lab(s, 7.3, 1.7, 5.2, "What that means here", true);
body(s, 7.3, 2.05, 5.2, 2.2, "The nearest analogue is the mussel shell–sucrose ceramic: a shell mineral in a biological binder. Nothing couples a shell mineral to an agar binder, and nothing reports compressive, flexural, ignitability and hygric data for one formulation family.", true, 13);
s.addText("A protocol and a property set entering a commons four recipes deep.",
  S({ x: 7.3, y: 4.5, w: 5.2, h: 0.9, fontSize: 14, bold: true, color: "F0C9A8", lineSpacing: 20 }));
note(s, 0.8, 6.25, 6.0, "materiom.org/data, accessed October 2026");
s.addNotes("Claiming a gap is cheap, so let me show it rather than assert it. Materiom is an open commons for biomaterial recipes - CC-BY-SA, petrochemical ingredients excluded, each recipe archived as prior art, property data indexed with citable DOIs. The infrastructure for shared procedures exists. But property data currently exists for four recipes. The nearest analogue to this work is the mussel shell-sucrose ceramic, a shell mineral in a biological binder. Nothing couples a shell mineral to an agar binder, and nothing reports compressive, flexural, ignitability and hygric data for one formulation family. So the contribution is not that nobody thought of this. It is a protocol and a property set entering a commons that is four recipes deep.");

/* ============ 5 aim ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Introduction" });
s.addText("Aim and research questions", { placeholder: "title" });
lab(s, 0.8, 1.55, 5.3, "Aim");
body(s, 0.8, 1.9, 5.3, 1.5, "To document a reproducible production protocol for a fully bio-based eggshell composite, and to characterise its mechanical, thermal and hygric response against conventional and bio-based interior materials.", false, 13);
lab(s, 0.8, 3.75, 5.3, "Scope");
bullets(s, 0.8, 4.1, 5.3, 1.9, [
  "Five formulations, two mechanical programmes",
  "Three specimens per formulation",
  "ASTM D790-17, ISO 11925-2, ASTM D570",
  "Single laboratory, ambient curing, no ageing",
], false, 12);
lab(s, 7.0, 1.55, 5.5, "Research questions");
[["Q1", "Which formulation variable governs compressive strength?"],
 ["Q2", "What is the effect of plasticiser content on flexural behaviour?"],
 ["Q3", "How does it compare with conventional interior materials?"],
 ["Q4", "How does it compare with other bio-based composites?"],
 ["Q5", "Is compressive strength the appropriate criterion at all?"]]
 .forEach(([n, q], i) => {
  const y = 1.95 + i * 0.86;
  s.addText(n, S({ x: 7.0, y, w: 0.55, h: 0.3, fontSize: 12, bold: true, color: T.accent, fontFace: T.head }));
  s.addText(q, S({ x: 7.6, y, w: 4.9, h: 0.7, fontSize: 12.5, color: T.ink, lineSpacing: 17 }));
});
s.addNotes("Five questions. The first two are formulation questions, the next two benchmarking, and the fifth is the one I actually care about and will return to at the end.");

/* ============ 6 constituents ============ */
pres.addSection({ title: "Production" });
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Production" });
s.addText("Constituents and their function", { placeholder: "title" });
table(s, [
  [TH("Constituent"), TH("Origin"), TH("Function"), TH("Relevant property")],
  [TL("Eggshell powder"), TL("Food waste"), TL("Mineral filler; carries load"), TL("94% CaCO₃; porous structure")],
  [TL("Agar"), TL("Red seaweed"), TL("Continuous binding phase"), TL("Thermoreversible gel")],
  [TL("Glycerol"), TL("Vegetable oil"), TL("Plasticiser; sets ductility"), TL("Humectant; low vapour pressure")],
  [TL("Water"), TL("—"), TL("Carrier; sets solids packing"), TL("Fully evaporated on drying")],
  [TL("Shellac"), TL("Kerria lacca"), TL("Hydrophobic surface finish"), TL("Biodegradable film-former")],
], { x: 0.8, y: 1.55, w: 11.7, colW: [2.1, 1.7, 3.6, 4.3], rowH: 0.48 });
s.addText("Water is not a component of the finished material. It is the process variable that determines how densely the solids pack.",
  S({ x: 0.8, y: 4.5, w: 11.7, h: 0.45, fontSize: 14, bold: true, color: T.accent }));
note(s, 0.8, 5.15, 11.7, "Gelatine, starch and vinegar were trialled during development and are not part of the reported formulations.");
s.addNotes("Five constituents, and the division of labour matters. Eggshell carries load. Agar forms the continuous network. Glycerol decides whether the composite behaves brittle or ductile. Shellac is a surface finish only. And water is not in the final material at all - it is the process variable that sets how densely the solids pack. Keep that last point, because it turns out to be the controlling variable.");

/* ============ 7 protocol I ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Production" });
s.addText("Protocol I — mineral fraction", { placeholder: "title" });
steps(s, 0.8, 1.6, 7.3, [
  ["Collection and cleaning", "Single local bakery, over one year. Membrane and organic residue removed."],
  ["Thermal treatment", "120 °C for 20 min. Decontamination and drying, not sterilisation: sterility was not verified."],
  ["Cooling and drying", "To ambient, then dried until no further mass loss."],
  ["Milling", "Laboratory mechanical grinder, to a visually homogeneous powder."],
  ["Sieving", "150 µm mesh; passing fraction only, consistent with polymer-composite practice."],
], 1.02);
s.addImage({ path: G + "03-uretim-sureci.jpeg", x: 8.9, y: 1.6, w: 3.6, h: 1.15, objectName: "shells" });
big(s, 8.9, 3.1, 1.7, "120 °C", "20 min");
big(s, 10.8, 3.1, 1.7, "150 µm", "sieve aperture");
s.addNotes("Shell preparation. Two points. First, I call the 120 degree step decontamination and drying rather than sterilisation, because dry-heat sterilisation needs around 160 to 170 degrees for one to two hours and we did not verify sterility. Second, the 150 micrometre sieve was chosen to match the particle size used in the polymer-composite eggshell literature, so the mineral phase here is comparable to that work.");

/* ============ 8 protocol II ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Production" });
s.addText("Protocol II — binder phase", { placeholder: "title" });
steps(s, 0.8, 1.6, 7.3, [
  ["Pre-mixing", "Water and glycerol to a homogeneous liquid before any solids enter."],
  ["Agar dispersion", "Added incrementally under continuous stirring. Bulk addition forms agglomerates that do not redisperse."],
  ["Dissolution", "Heated to 95 °C and held until the agar is fully in solution."],
  ["Controlled cook", "Reduced to 80 °C and held, stirring maintained, while viscosity develops."],
], 1.2);
lab(s, 8.9, 1.6, 3.6, "Thermal regime");
big(s, 8.9, 1.95, 3.6, "95 °C", "dissolution set point");
big(s, 8.9, 3.15, 3.6, "80 °C", "controlled cook");
big(s, 8.9, 4.35, 3.6, "55 min", "total heating time");
s.addText("Stirring was manual. Shear rate and mixing energy are not controlled quantities.",
  S({ x: 0.8, y: 6.15, w: 7.3, h: 0.5, fontSize: 12.5, bold: true, color: T.accent, lineSpacing: 17 }));
note(s, 8.9, 5.5, 3.6, "Two-stage regime follows the 70–90 °C band reported for agar preparation.");
s.addNotes("The binder is a two-stage thermal regime: dissolution at 95, then a controlled cook at 80, 55 minutes in total. Two stages because viscosity building before full dissolution gives a patchy gel network. And plainly: stirring was manual, so shear rate is not a controlled quantity. This is reproducible in a studio. It is not yet tight enough for an instrumented laboratory.");

/* ============ 9 protocol III ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Production" });
s.addText("Protocol III — compositing, casting, drying", { placeholder: "title" });
steps(s, 0.8, 1.6, 7.3, [
  ["Mineral incorporation", "Added incrementally into the binder at 80 °C. Earlier addition lets the mineral sediment out."],
  ["Casting", "Silicone moulds, levelled. Silicone releases without a parting agent. 50 mm cubes for compression, flat moulds otherwise."],
  ["In-mould setting", "Four days."],
  ["Ambient consolidation", "Demoulded, then seven days at ~23 °C, shielded from sun and air movement. No oven at any stage."],
], 1.2);
lab(s, 8.9, 1.6, 3.6, "Disclosure — dimensional loss");
body(s, 8.9, 1.95, 3.6, 2.6, "The composite shrinks appreciably as water evaporates. Cross-sections were measured at test time, but post-drying dimensions were not logged. Dimensions quoted here are mould dimensions.", false, 12);
s.addText("23 °C  ·  11 days  ·  no oven",
  S({ x: 8.9, y: 4.9, w: 3.6, h: 0.45, fontSize: 15, bold: true, color: T.accent, fontFace: T.head }));
note(s, 8.9, 5.45, 3.6, "Anyone applying this protocol should record geometry after drying, not at casting.");
s.addNotes("Compositing, casting and drying. The mineral goes in late, at 80 degrees, because adding it earlier lets it settle. Silicone moulds release without a parting agent. Four days in mould, seven days consolidating, all at ambient - no oven at any point, which matters for the energy argument. The disclosure: the material shrinks as water leaves. Cross-sections were measured at test time but the dried dimensions were not logged, so unless I say otherwise these are mould dimensions.");

/* ============ 10 formulations ============ */
pres.addSection({ title: "Characterisation" });
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Characterisation" });
s.addText("Formulation matrix", { placeholder: "title" });
table(s, [
  [TH("ID"), TH("Test"), TH("Water g"), TH("Shell g"), TH("Agar g"), TH("Glycerol g"), TH("Solids g"), TH("Shell : binder"), TH("Solids : water"), TH("Glycerol % solids")],
  [TD("C1"), TL("Compression"), TD("325"), TD("80"),  TD("35"), TD("5"),  TD("120"), TD("2.00", { bold: true }), TD("0.37"), TD("4.2")],
  [TD("C2"), TL("Compression"), TD("310"), TD("90"),  TD("40"), TD("5"),  TD("135"), TD("2.00", { bold: true }), TD("0.44"), TD("3.7")],
  [TD("C3"), TL("Compression"), TD("280"), TD("110"), TD("45"), TD("10"), TD("165"), TD("2.00", { bold: true }), TD("0.59"), TD("6.1")],
  [TD("F1"), TL("Flexure"),     TD("450"), TD("190"), TD("70"), TD("60"), TD("320"), TD("1.46"), TD("0.71"), TD("18.8")],
  [TD("F2"), TL("Flexure"),     TD("480"), TD("190"), TD("70"), TD("30"), TD("290"), TD("1.90"), TD("0.60"), TD("10.3")],
], { x: 0.8, y: 1.55, w: 11.7, colW: [0.7, 1.8, 0.95, 0.9, 0.85, 1.2, 0.95, 1.5, 1.5, 1.35], rowH: 0.42 });
lab(s, 0.8, 4.35, 5.5, "Compression series");
body(s, 0.8, 4.68, 5.5, 1.2, "Shell : binder is held at exactly 2.00. The only variable that changes is solids concentration, 0.37 to 0.59.", false, 12.5);
lab(s, 7.0, 4.35, 5.5, "Flexural series — confound");
body(s, 7.0, 4.68, 5.5, 1.2, "Glycerol was halved but batch mass was fixed at 770 g, so water rose to compensate and the other ratios moved with it. The plasticiser effect is not isolated.", false, 12.5);
note(s, 0.8, 6.2, 11.7, "Three specimens per formulation. Values are means; individual specimen values were not retained, so standard deviations are not available.");
s.addNotes("The formulation matrix with derived ratios, and the two right-hand columns are the ones to read. In the compression series shell-to-binder is exactly two point zero zero in all three mixes - not planned as a control, but it means the only thing that varies is solids concentration. In the flexural series I have to declare a confound: glycerol was halved, but batch mass was fixed at 770 grams, so water rose to compensate and the other two ratios shifted with it. The plasticiser effect is not cleanly isolated.");

/* ============ 11 test programme ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Characterisation" });
s.addText("Test programme", { placeholder: "title" });
table(s, [
  [TH("Property"), TH("Standard"), TH("Specimen"), TH("n"), TH("Measured")],
  [TL("Compressive behaviour"), TL("Cube compression"), TL("50 mm cube moulds"), TD("3 per mix"), TL("Max load; compressive stress")],
  [TL("Flexural behaviour"), TL("ASTM D790-17"), TL("180 × 60 × 20 mm, 120 mm span"), TD("3 per mix"), TL("Flexural strength; modulus")],
  [TL("Reaction to fire"), TL("ISO 11925-2:2020"), TL("40 × 50 mm, 45°, 15 s"), TD("2"), TL("Time to ignition; to extinguish")],
  [TL("Water absorption"), TL("ASTM D570-98"), TL("40 × 50 mm, shellac-coated"), TD("1"), TL("Mass gain, 24 h immersion")],
  [TL("Bulk density"), TL("Gravimetric"), TL("50 mm cube"), TD("1"), TL("Mass / mould volume")],
], { x: 0.8, y: 1.55, w: 11.7, colW: [2.5, 2.3, 3.5, 1.1, 2.3], rowH: 0.5 });
lab(s, 0.8, 4.75, 11.7, "Reporting convention");
body(s, 0.8, 5.1, 11.7, 1.0, "Mechanical values are means of three specimens; standard deviations cannot be reported. Fire, absorption and density rest on single determinations and are indicative, not characteristic, values.", false, 13);
note(s, 0.8, 6.1, 11.7, "All testing: Advanced Construction Materials Research Laboratory, Hacettepe University.");
s.addNotes("The test programme with standards and specimen geometries. I want the reporting convention on the record before any numbers appear: mechanical values are means of three specimens, individual values were not retained so I cannot give standard deviations, and the fire, absorption and density figures are single determinations - indicative, not characteristic.");

/* ============ 12 compression ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Characterisation" });
s.addText("Compressive strength scales with solids concentration", { placeholder: "title" });
table(s, [
  [TH("ID"), TH("Solids : water"), TH("Fₘₐₓ kN"), TH("σᴄ MPa")],
  [TD("C1"), TD("0.37"), TD("3.89"), TD("2.55")],
  [TD("C2"), TD("0.44"), TD("4.30"), TD("3.12")],
  [TD("C3"), TD("0.59"), TD("6.80", ACC), TD("4.10", ACC)],
], { x: 0.8, y: 1.6, w: 5.0, colW: [0.8, 1.7, 1.25, 1.25], rowH: 0.44 });
s.addChart(pres.ChartType.bar, [
  { name: "σ", labels: ["C1  0.37", "C2  0.44", "C3  0.59"], values: [2.55, 3.12, 4.10] },
], { x: 6.3, y: 1.5, w: 6.2, h: 3.4, barDir: "col", chartColors: [T.dark], showLegend: false,
     showValue: true, dataLabelPosition: "outEnd", dataLabelColor: T.ink, dataLabelFontSize: 12,
     dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.00",
     catAxisLabelColor: T.mute, catAxisLabelFontSize: 11, catAxisLabelFontFace: "+mn-lt",
     valAxisLabelColor: T.mute, valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt",
     valAxisTitle: "Compressive stress (MPa)", showValAxisTitle: true, valAxisTitleColor: T.mute,
     valAxisTitleFontSize: 11, valAxisTitleFontFace: "+mn-lt", valAxisMaxVal: 5,
     valGridLine: { color: T.line, size: 1 }, catGridLine: { style: "none" }, objectName: "cchart" });
lab(s, 0.8, 3.5, 5.0, "Observed relationship");
s.addText("σᴄ = 6.93 · (solids : water) + 0.04",
  S({ x: 0.8, y: 3.85, w: 5.0, h: 0.45, fontSize: 16, bold: true, color: T.ink, fontFace: T.head }));
s.addText("R² = 0.994  over 0.37 – 0.59",
  S({ x: 0.8, y: 4.32, w: 5.0, h: 0.3, fontSize: 12, color: T.accent }));
mute(s, 0.8, 4.75, 5.0, 1.4, "With shell : binder fixed, strength is linear in solids concentration across the range tested. Three formulations cannot establish a law — but the reading is that packing density, not mineral content, sets strength.", false, 12);
s.addNotes("The compression result is tidier than I expected. Because shell-to-binder is fixed at two, solids concentration is the only variable, and compressive stress is linear in it with an R-squared of 0.994 across 0.37 to 0.59. Three points will fit almost any line, so I am not claiming a law. I am claiming a testable hypothesis with a clear physical reading: strength here is governed by packing density, not mineral content as such. If that is right, the route to a stronger composite is to remove water, not to add shell.");

/* ============ 13 failure mode ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Characterisation" });
s.addText("Failure mode: progressive crushing", { placeholder: "title" });
s.addImage({ path: G + "04-basma-ficilasmis-kup.jpeg", x: 0.8, y: 1.55, w: 1.95, h: 4.22, objectName: "cube" });
note(s, 0.8, 5.85, 2.3, "C3 after loading: barrelled, shortened, intact");
lab(s, 3.3, 1.55, 5.0, "Compressive stress – strain, C3");
s.addImage({ path: G + "05b-basma-egrisi.png", x: 3.3, y: 1.9, w: 5.0, h: 2.8, objectName: "curve" });
mute(s, 2.62, 2.8, 1.3, 0.3, "Stress (MPa)", false, 10);
mute(s, 3.3, 4.72, 5.0, 0.3, "Strain", false, 10);
bullets(s, 8.85, 1.9, 3.65, 3.0, [
  "Linear elastic to approximately 1 MPa",
  "Progressive stiffness loss as the agar network yields",
  "Peak at roughly 10% strain, no abrupt load drop",
  "Beyond peak: deformation with retained integrity",
], false, 12);
lab(s, 8.85, 1.55, 3.65, "Reading the curve");
s.addText("1.38 g/cm³  ·  2.96 MPa per g/cm³",
  S({ x: 3.3, y: 5.15, w: 5.0, h: 0.35, fontSize: 13, bold: true, color: T.ink }));
note(s, 8.85, 5.1, 3.65, "Strain derived from an assumed 10% maximum deformation based on observation, not instrumented.");
note(s, 3.3, 5.5, 5.0, "Bulk density on a mould-volume basis; specific compressive strength.");
s.addNotes("The failure mode is what I would ask about if I were sitting where you are. The curve is linear to about one megapascal, then stiffness falls away progressively as the agar network yields and the mineral redistributes. Peak arrives at roughly ten percent strain with no abrupt drop, and beyond peak the specimen keeps deforming while holding together. Energy is absorbed rather than released. One honesty point: the strain axis derives from an assumed ten percent maximum deformation based on observation, not instrumented measurement.");

/* ============ 14 flexure ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Characterisation" });
s.addText("Flexure: plasticiser content is decisive", { placeholder: "title" });
table(s, [
  [TH("ID"), TH("Glycerol % solids"), TH("Fₘₐₓ N"), TH("σꜰ MPa"), TH("Eꜰ MPa"), TH("ε peak")],
  [TD("F1"), TD("18.8"), TD("—"), TD("not measurable", { italic: true }), TD("—"), TD("—")],
  [TD("F2"), TD("10.3"), TD("310"), TD("2.325", ACC), TD("192", ACC), TD("0.0121")],
], { x: 0.8, y: 1.6, w: 7.3, colW: [0.75, 1.75, 1.1, 1.75, 1.0, 0.95], rowH: 0.44 });
mute(s, 0.8, 3.05, 7.3, 0.35, "σꜰ = 3FL / 2bd²  with F = 310 N, L = 120 mm, b = 60 mm, d = 20 mm", false, 11);
s.addImage({ path: G + "06-egilme-buyuk-sehim.jpg", x: 0.8, y: 3.6, w: 1.25, h: 2.78, objectName: "bend" });
s.addImage({ path: G + "08b-yivli-panel-kemer.jpg", x: 2.3, y: 3.6, w: 1.6, h: 2.24, objectName: "arch" });
s.addImage({ path: G + "09b-egilme-egrisi.png", x: 4.25, y: 3.95, w: 3.85, h: 2.18, objectName: "fcurve" });
note(s, 0.8, 6.45, 3.1, "Three-point rig; kerfed panel arched by hand");
lab(s, 4.25, 3.6, 3.85, "Flexural stress – strain, F2");
lab(s, 8.85, 1.6, 3.65, "Disclosure — section geometry");
body(s, 8.85, 1.95, 3.65, 2.1, "The specimen carries transverse kerfs on its tension face. ASTM D790-17 assumes a solid rectangular section and the calculation uses the full 60 × 20 mm. Part of the measured compliance is geometric, so the modulus is a lower bound.", false, 12);
lab(s, 8.85, 4.35, 3.65, "Interpretation");
body(s, 8.85, 4.7, 3.65, 1.7, "At 18.8% glycerol the composite deformed without developing measurable resistance. Halving it produced a section that resists while still flexing. The transition lies between these values.", false, 12);
s.addNotes("Flexure, to ASTM D790. The decisive variable is plasticiser. At 18.8 percent glycerol the composite deformed without developing measurable resistance - the machine registered nothing usable. Halving it gives 2.325 megapascals at a modulus of 192. The transition is sharp and it lies between those two values. Two disclosures. The glycerol effect is confounded with solids concentration, as I showed. And look at the tension face: it is kerfed. D790 assumes a solid rectangle and my calculation uses the full twenty millimetre depth, so some of this compliance is geometry. The modulus I am quoting is a lower bound on the bulk material.");

/* ============ 15 fire + hygric ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Characterisation" });
s.addText("Fire, hygric response and density", { placeholder: "title" });
s.addImage({ path: G + "10-alev-testi.png", x: 0.8, y: 1.55, w: 1.6, h: 3.47, objectName: "flame" });
lab(s, 2.75, 1.55, 4.2, "Ignitability — ISO 11925-2");
big(s, 2.75, 1.95, 1.9, "~10 s", "to ignition");
big(s, 4.85, 1.95, 2.1, "4 s", "to self-extinguish");
bullets(s, 2.75, 3.3, 4.2, 1.4, [
  "Charring local to flame contact",
  "No lateral flame spread",
  "No melting, no dripping",
], false, 12);
note(s, 2.75, 4.9, 4.2, "Probable mechanism: endothermic carbonate decomposition releasing CO₂. Not verified calorimetrically. Ignitability only — no Euroclass, cone calorimetry, smoke or toxicity data.");
lab(s, 7.4, 1.55, 5.1, "Water absorption — ASTM D570");
s.addText("0.7%", S({ x: 7.4, y: 1.9, w: 1.5, h: 0.6, fontSize: 32, bold: true, color: T.accent, fontFace: T.head, valign: "bottom" }));
mute(s, 9.0, 1.95, 3.5, 1.1, "mass gain over 24 h immersion, shellac-coated. Local dissolution where the coating was thin: coating integrity is the limiting factor.", false, 11.5);
lab(s, 7.4, 3.3, 5.1, "Bulk density");
table(s, [
  [TH("Material"), TH("g/cm³"), TH("Reference")],
  [TL("This study (C3)", ACC), TD("1.38", ACC), TL("—")],
  [TL("Mycelium, cellulose"), TD("0.3 – 0.8"), TL("Jones et al. 2020")],
  [TL("Fired clay brick"), TD("1.6 – 2.0"), TL("William & Owen 1995")],
  [TL("Normal-weight concrete"), TD("2.4"), TL("William & Owen 1995")],
], { x: 7.4, y: 3.65, w: 5.1, colW: [2.1, 1.1, 1.9], rowH: 0.36, fontSize: 11 });
note(s, 7.4, 5.55, 5.1, "Quoted on a mould-volume basis and therefore a lower bound.");
s.addNotes("Three environmental properties. On fire: ignition at around ten seconds under direct flame, self-extinguishing four seconds after removal, charring local, no lateral spread, no melting or dripping. The probable mechanism is endothermic carbonate decomposition releasing carbon dioxide, not verified calorimetrically. To be explicit: 11925-2 is an ignitability test. No Euroclass, no cone calorimetry, no smoke or toxicity. On water: 0.7 percent mass gain with three shellac coats, with local dissolution where the coating was thin, so coating integrity is the limit, not the composite. On density: 1.38, between the fungal and cellulosic materials below and fired clay above, on a mould-volume basis so a lower bound.");

/* ============ 16 benchmark I ============ */
pres.addSection({ title: "Benchmarking" });
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Benchmarking" });
s.addText("Benchmark I — conventional interior materials", { placeholder: "title" });
s.addChart(pres.ChartType.bar, [
  { name: "Compressive", labels: ["Compressed\nmushroom panel", "This study\n(C3)", "WPC", "MDF", "Travertine"], values: [1.2, 4.1, 7.2, 24, 80] },
  { name: "Flexural",    labels: ["Compressed\nmushroom panel", "This study\n(C3)", "WPC", "MDF", "Travertine"], values: [1.0, 2.3, 12, 35, 11] },
], { x: 0.8, y: 1.5, w: 8.0, h: 4.5, barDir: "col", barGrouping: "clustered",
     chartColors: [T.dark, "B8AE9B"], showLegend: true, legendPos: "t",
     legendColor: T.mute, legendFontSize: 11, legendFontFace: "+mn-lt",
     showValue: true, dataLabelPosition: "outEnd", dataLabelColor: T.ink, dataLabelFontSize: 10,
     dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.0",
     catAxisLabelColor: T.mute, catAxisLabelFontSize: 10, catAxisLabelFontFace: "+mn-lt",
     valAxisLabelColor: T.mute, valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt",
     valAxisTitle: "Strength (MPa)", showValAxisTitle: true, valAxisTitleColor: T.mute,
     valAxisTitleFontSize: 11, valAxisTitleFontFace: "+mn-lt",
     valGridLine: { color: T.line, size: 1 }, catGridLine: { style: "none" }, objectName: "b1" });
note(s, 0.8, 6.05, 8.0, "Velasco & Gaona 2011 · Klyosov 2007 · Nemli & Aydın 2007 · Altun 2006");
lab(s, 9.2, 1.5, 3.3, "Position");
body(s, 9.2, 1.85, 3.3, 2.4, "One sixth the compressive strength of MDF and one twentieth that of travertine — a stone the material visually resembles. Three times compressed mushroom panel, the only other fully bio-based board here.", false, 12.5);
s.addText("On strength alone it does not compete with engineered wood or stone, and this paper does not claim it does.",
  S({ x: 9.2, y: 4.5, w: 3.3, h: 1.5, fontSize: 12.5, bold: true, color: T.accent, lineSpacing: 18 }));
s.addNotes("First benchmark, against the conventional materials this would sit alongside. Let me be blunt. One sixth of MDF, one twentieth of travertine - and travertine is the relevant comparison aesthetically because the material looks like it. It does beat compressed mushroom panel, the only other fully bio-based board in the set, by a factor of three. But on strength alone it does not compete with engineered wood or stone, and I will not claim that it does.");

/* ============ 17 benchmark II ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Benchmarking" });
s.addText("Benchmark II — bio-based composites", { placeholder: "title" });
lab(s, 0.8, 1.5, 5.6, "Compressive strength");
table(s, [
  [TH("Material"), TH("σᴄ MPa"), TH("Reference")],
  [TL("This study (C3)", ACC), TD("4.1", ACC), TL("—")],
  [TL("Mycelium composite"), TD("0.145 – 0.452"), TL("Jones et al. 2020")],
  [TL("Hempcrete"), TD("0.3 – 0.6"), TL("Arnaud & Gourlay 2012")],
  [TL("Eggshell-filled PLA"), TD("2 – 5"), TL("Kim & Pal 2010")],
  [TL("Mineral-filled biocomposite"), TD("2.1 – 39.6"), TL("Shah et al. 2016")],
  [TL("30% algae-filled"), TD("21.3"), TL("Kim & Pal 2010")],
], { x: 0.8, y: 1.85, w: 5.6, colW: [2.6, 1.5, 1.5], rowH: 0.4, fontSize: 11 });
lab(s, 6.9, 1.5, 5.6, "Elastic modulus");
table(s, [
  [TH("Material"), TH("E MPa"), TH("Reference")],
  [TL("This study (F2)", ACC), TD("192", ACC), TL("—")],
  [TL("Mycelium composite"), TD("1.8 – 5"), TL("Islam et al. 2018")],
  [TL("Soy-based bioplastic"), TD("124"), TL("Mansour et al. 2021")],
  [TL("Corn starch + hemp"), TD("158"), TL("Dweib et al. 2004")],
  [TL("Flax-fibre PLA"), TD("198"), TL("Faruk et al. 2012")],
  [TL("LDPE"), TD("100 – 300"), TL("Zhao et al. 2022")],
  [TL("Wood (pine)"), TD("11 000"), TL("Pope & Hudson 1989")],
], { x: 6.9, y: 1.85, w: 5.6, colW: [2.5, 1.4, 1.7], rowH: 0.4, fontSize: 11 });
s.addText("An order of magnitude above the fungal and lime-binder family in compression, and inside the bio-polymer band in stiffness.",
  S({ x: 0.8, y: 5.05, w: 11.7, h: 0.45, fontSize: 14, color: T.ink }));
s.addText("A water-cast, ambient-dried material reaches the stiffness of melt-processed bio-polymers.",
  S({ x: 0.8, y: 5.6, w: 11.7, h: 0.45, fontSize: 14, bold: true, color: T.accent }));
note(s, 0.8, 6.2, 11.7, "Unfilled agar films in the packaging literature sit well below this: the mineral phase, not the binder, carries the stiffness.");
s.addNotes("Second benchmark, and this is the one that matters. Against the bio-based family the position changes completely. In compression the material is an order of magnitude above mycelium composites and hempcrete. In stiffness it sits inside the bio-polymer band: 192, between soy bioplastic at 124 and flax-fibre PLA at 198, within the LDPE range. Note what that means. This is water-cast, dried at room temperature, with no oven and no extrusion, and it reaches the stiffness of melt-processed bio-polymers. Wood is still two orders of magnitude above and I will not pretend otherwise.");

/* ============ 18 resilience ============ */
s = pres.addSlide({ masterName: "PIVOT", sectionTitle: "Benchmarking" });
s.addText("A derived property: modulus of resilience", { placeholder: "title" });
lab(s, 0.8, 1.7, 5.6, "Definition", true);
s.addText("Ur  =  σꜰ² / 2Eꜰ",
  S({ x: 0.8, y: 2.05, w: 5.6, h: 0.6, fontSize: 26, bold: true, color: T.onDark, fontFace: T.head }));
mute(s, 0.8, 2.75, 5.6, 0.9, "Elastic strain energy absorbed per unit volume up to permanent deformation — the area under the curve to yield.", true, 12.5);
s.addText("2.325² / (2 × 192)  =  14.1 kJ/m³",
  S({ x: 0.8, y: 3.9, w: 5.6, h: 0.5, fontSize: 17, bold: true, color: T.onDark, fontFace: T.head }));
note(s, 0.8, 4.45, 5.6, "from this study's own measured σꜰ and Eꜰ for F2");
s.addText("Stiffness sits in the denominator. The low modulus reported as a deficiency in Benchmark I is what raises this quantity.",
  S({ x: 0.8, y: 5.05, w: 5.6, h: 1.1, fontSize: 14, bold: true, color: "F0C9A8", lineSpacing: 20 }));
lab(s, 7.3, 1.7, 5.2, "Why it fits this class", true);
body(s, 7.3, 2.05, 5.2, 2.0, "Both programmes gave the same qualitative result: substantial deformation with retained integrity. Strength records the load at which a material stops performing, not whether it then fails gracefully or catastrophically — which, for a demountable non-loadbearing component, governs service life.", true, 12.5);
lab(s, 7.3, 4.3, 5.2, "Proposal, and its limit", true);
mute(s, 7.3, 4.65, 5.2, 1.9, "Report σ and E from the same specimen set so Ur can be derived. At present the literature reports them in separate studies on different formulations, so a comparative table cannot be assembled. This is a data point and a measurement convention, not a ranking.", true, 12.5);
s.addNotes("This brings me to the fifth question. The modulus of resilience is the elastic strain energy absorbed per unit volume up to permanent deformation. Note where stiffness sits: in the denominator. So the low modulus that counted against the material in the first benchmark is exactly what raises this quantity. For F2 it comes to about 14 kilojoules per cubic metre, from this study's own two measurements. Why does it fit? Because both programmes gave the same qualitative result - substantial deformation with retained integrity. Strength tells you the load at which a material stops performing. It does not tell you whether it then fails gracefully or catastrophically, and for a demountable non-loadbearing component that is what governs service life. The honest limit: I cannot give a comparative table, because the literature reports strength and modulus in separate studies on different formulations. This is a data point and a measurement convention, not a ranking.");

/* ============ 19 application ============ */
pres.addSection({ title: "Application" });
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Application" });
s.addText("Application pathway", { placeholder: "title" });
s.addImage({ path: G + "11-moduler-sistem.jpeg", x: 0.8, y: 1.55, w: 3.1, h: 2.55, objectName: "mod" });
s.addImage({ path: G + "12-ic-mekan-render.jpeg", x: 0.8, y: 4.3, w: 3.1, h: 2.54, objectName: "ren" });
lab(s, 4.35, 1.55, 8.15, "Derived from the measured properties");
[["Low strength, high deformation capacity", "self-weight and handling loads only; no structural duty"],
 ["Self-extinguishing, no dripping", "interior surfaces away from ignition sources"],
 ["Coating-dependent water resistance", "dry interiors; not wet rooms or facades"],
 ["Repeatable small-format casting", "a module, not a sheet — failure is replaced one unit at a time"]]
 .forEach(([h, b], i) => {
  const y = 1.95 + i * 0.62;
  s.addText([{ text: h + "  →  ", options: { bold: true, color: T.ink } },
             { text: b, options: { color: T.mute } }],
    S({ x: 4.35, y, w: 8.15, h: 0.55, fontSize: 12.5, lineSpacing: 17 }));
});
lab(s, 4.35, 4.6, 8.15, "System characteristics");
bullets(s, 4.35, 4.95, 8.15, 1.9, [
  "Reversible assembly — cast units joined without adhesive, recoverable intact",
  "Distributed load path — units interlock and share load across neighbours",
  "Unit replaceability — a damaged unit is exchanged without dismantling",
  "Formulation-family variation — colour and texture from pigment and mould geometry",
], false, 12.5);
s.addNotes("The application pathway follows from the measurements rather than being imposed on them. Low strength with high deformation capacity means self-weight and handling loads only. Self-extinguishing with no dripping means interior surfaces away from ignition sources. Coating-dependent water resistance means dry interiors, not wet rooms and not facades. And repeatable small-format casting means a module rather than a sheet, which matters because failure is then replaced one unit at a time. The assembly is adhesive-free and therefore reversible, units interlock and share load, a damaged unit is exchangeable, and colour and texture vary within one formulation family.");

/* ============ 20 potentials ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Application" });
s.addText("Potentials for sustainable interiors", { placeholder: "title" });
[["Waste valorisation at source", "A local food-waste stream becomes a surface material with no intermediate industry."],
 ["Low-energy production", "No oven, no autoclave, no extrusion. One 55-minute cook, then ambient drying."],
 ["End-of-life by design", "Every constituent biodegrades, including the shellac finish."],
 ["Reversible assembly", "Adhesive-free modular assembly means reuse precedes recycling."],
 ["Displacing a mineral extraction", "Substitutes quarried limestone in a surface application, not a downcycled use."],
 ["Low-barrier manufacture", "A grinder, a sieve, a hotplate and silicone moulds. Production can be distributed."]]
 .forEach(([h, b], i) => {
  const x = 0.8 + (i % 2) * 6.15, y = 1.6 + Math.floor(i / 2) * 1.5;
  s.addText(h, S({ x, y, w: 5.6, h: 0.32, fontSize: 13.5, bold: true, color: T.ink }));
  s.addText(b, S({ x, y: y + 0.36, w: 5.6, h: 0.85, fontSize: 11.5, color: T.mute, lineSpacing: 16 }));
});
s.addText("No life-cycle assessment was carried out. These are qualitative potentials grounded in the protocol, not quantified environmental claims.",
  S({ x: 0.8, y: 6.25, w: 11.7, h: 0.4, fontSize: 12, bold: true, color: T.accent }));
s.addNotes("Six potentials, and I will call them potentials. Waste valorisation at source - a local stream becomes a surface material with no intermediate industry. Low-energy production - no oven, no autoclave, no extrusion; one cook and then ambient drying. End-of-life by design - everything biodegrades including the shellac. Reversible assembly, so reuse precedes recycling. A direct displacement of quarried limestone rather than a downcycled use. And low-barrier manufacture. One caveat that matters: no life-cycle assessment was carried out, so these are qualitative potentials, not quantified claims.");

/* ============ 21 limitations ============ */
pres.addSection({ title: "Closing" });
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Closing" });
s.addText("Limitations", { placeholder: "title" });
[["Dispersion not reported", "Means of three specimens; individual values not retained, so no standard deviations."],
 ["Formulation confound in flexure", "Glycerol, solids concentration and shell : binder moved together between F1 and F2."],
 ["Section geometry in flexure", "A kerfed specimen treated as a solid rectangle. The modulus is a lower bound."],
 ["Strain not instrumented", "Compressive strain derived from an assumed 10% maximum deformation."],
 ["Shrinkage unquantified", "Post-drying dimensions not logged; density is a lower bound."],
 ["Process not instrumented", "Manual stirring; single laboratory, single operator, no inter-laboratory reproduction."],
 ["No durability data", "No humidity or thermal cycling, UV exposure, microbial resistance or accelerated ageing."],
 ["No fire classification or LCA", "Ignitability only; no Euroclass determination and no life-cycle assessment."]]
 .forEach(([h, b], i) => {
  const x = 0.8 + (i % 2) * 6.15, y = 1.55 + Math.floor(i / 2) * 1.2;
  s.addText(h, S({ x, y, w: 5.6, h: 0.3, fontSize: 12.5, bold: true, color: T.ink }));
  s.addText(b, S({ x, y: y + 0.33, w: 5.6, h: 0.72, fontSize: 11, color: T.mute, lineSpacing: 15 }));
});
s.addText("Each defines a specific next experiment rather than a general caveat.",
  S({ x: 0.8, y: 6.4, w: 11.7, h: 0.35, fontSize: 12.5, bold: true, color: T.accent }));
s.addNotes("I would rather set these out precisely than have them found. Dispersion not reported. A formulation confound in the flexural comparison. A kerfed section treated as solid. Strain assumed, not instrumented. Shrinkage unquantified. The process not instrumented - manual stirring, one laboratory, one operator. No durability data of any kind. No fire classification and no LCA. Each defines a specific next experiment rather than a vague caveat.");

/* ============ 22 conclusions ============ */
s = pres.addSlide({ masterName: "PIVOT", sectionTitle: "Closing" });
s.addText("Conclusions", { placeholder: "title" });
[["01", "A reproducible protocol", "120 °C shell treatment, 150 µm fraction, 95 °C dissolution, 80 °C cook, 55 min, silicone casting, 11 days ambient."],
 ["02", "Solids concentration governs strength", "With shell : binder fixed at 2.00, compressive stress is linear in solids concentration across 0.37–0.59."],
 ["03", "Plasticiser sets the brittle–ductile transition", "Between 18.8% and 10.3% glycerol, from unmeasurable compliance to 2.33 MPa at 192 MPa."],
 ["04", "Bio-polymer stiffness, oven-free", "192 MPa places a water-cast, ambient-dried material inside the melt-processed bio-polymer band."],
 ["05", "Strength is the wrong sole criterion", "Deformation capacity governs service behaviour. σ and E should be reported together."]]
 .forEach(([n, h, b], i) => {
  const y = 1.5 + i * 0.95;
  s.addText(n, S({ x: 0.8, y, w: 0.6, h: 0.35, fontSize: 15, bold: true, color: "F0C9A8", fontFace: T.head }));
  s.addText(h, S({ x: 1.5, y, w: 3.8, h: 0.7, fontSize: 13, bold: true, color: T.onDark, lineSpacing: 17 }));
  s.addText(b, S({ x: 5.5, y, w: 7.0, h: 0.85, fontSize: 11.5, color: T.onDarkMute, lineSpacing: 16 }));
});
s.addText("Betül Ünal  ·  Cappadocia University  ·  b.unal91@gmail.com",
  S({ x: 0.8, y: 6.3, w: 11.7, h: 0.3, fontSize: 12.5, bold: true, color: T.onDark }));
note(s, 0.8, 6.62, 11.7, "Testing: Advanced Construction Materials Research Laboratory, Hacettepe University, with thanks to Dr Hüseyin İlcan. Derived from the author's doctoral dissertation, Hacettepe University, 2025.");
s.addNotes("Five conclusions. A reproducible protocol, parameter by parameter. Solids concentration, not mineral content, governs compressive strength. Plasticiser content sets the brittle-ductile transition, and that transition lies between 18.8 and 10.3 percent glycerol. A water-cast, ambient-dried material reaches bio-polymer stiffness without an oven. And strength alone is the wrong criterion for this class: deformation capacity governs service behaviour, and strength and modulus should be reported together. Thank you - I am happy to take questions.");

/* ============ 23 references ============ */
s = pres.addSlide({ masterName: "PLAIN", sectionTitle: "Closing" });
s.addText("Selected references", { placeholder: "title" });
[["Reviews and state of the art", [
   "Ngayakamo, B. & Onwualu, A.P. (2022). Valorisation of eggshell waste for sustainable construction materials. Heliyon.",
   "Owuamanam, S. & Cree, D. (2020). Progress of bio-calcium carbonate waste eggshell and seashell fillers in polymer composites. J. Composites Science, 4(2), 70.",
   "Biogenic calcium carbonate from waste shells for advanced material applications (2022). Frontiers in Materials, 9, 1024977."]],
 ["Agar and bio-polymer systems", [
   "Hernández, V. et al. (2022). Agar biopolymer films for biodegradable packaging: a reference dataset. Materials, 15(11), 3954.",
   "Materiom (2026). Open biomaterial recipe commons and property database. materiom.org/data.",
   "Mansour et al. (2021); Dweib et al. (2004); Faruk et al. (2012); Zhao et al. (2022) — bio-polymer elastic moduli."]],
 ["Comparative material data", [
   "Jones, M. et al. (2020); Islam et al. (2018) — mycelium composites. Arnaud & Gourlay (2012) — hempcrete.",
   "Kim & Pal (2010) — eggshell-filled PLA. Shah et al. (2016) — mineral-filled biocomposites.",
   "Nemli & Aydın (2007) — MDF. Altun (2006) — travertine. Klyosov (2007) — WPC. Velasco & Gaona (2011) — mushroom panel."]]]
 .forEach(([h, items], i) => {
  const y = 1.55 + i * 1.65;
  lab(s, 0.8, y, 11.7, h);
  s.addText(items.map((x, j) => ({ text: x, options: { bullet: true, breakLine: j < items.length - 1 } })),
    S({ x: 0.8, y: y + 0.32, w: 11.7, h: 1.15, fontSize: 10.5, color: T.mute, paraSpaceAfter: 3, lineSpacing: 14 }));
});
note(s, 0.8, 6.5, 11.7, "Standards: ASTM D790-17 · ISO 11925-2:2020 · ASTM D570-98(2018).");
s.addNotes("Selected references, left up for questions.");

(async () => {
  await pres.writeFile({ fileName: OUT });
  const { applyTheme } = require("/root/.claude/skills/synced/ed12a668-6f07-4018-aad4-7be975f5699f_093145d0-7b3e-473d-b700-d8211791c264/pptx/scripts/apply_theme.js");
  await applyTheme(OUT, THEME);
  console.log("yazildi");
})();
