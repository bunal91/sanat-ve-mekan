const pptxgen = require("pptxgenjs");
const G = "/home/user/sanat-ve-mekan/konferans-bildirisi/03-gorseller/";
const OUT = "/tmp/claude-0/-home-user-sanat-ve-mekan/083887b3-c080-5d69-a4cb-b10c492fdc94/scratchpad/deck/ICSMMEP26_Presentation_Unal.pptx";

const THEME = { name: "Eggshell Biocomposite", headFontFace: "Cambria", bodyFontFace: "Calibri",
  colors: { dk1: "1A1A18", lt1: "FFFFFF", dk2: "1B3B2F", lt2: "EFE9DC",
            accent1: "C9622F", accent2: "5E8C6A", accent3: "8C7B5E",
            accent4: "2E5F4A", accent5: "B8A98C", accent6: "6E6B64",
            hlink: "C9622F", folHlink: "8C7B5E" } };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = "Betul Unal";
pres.title = "Eggshell-Agar Biocomposites for Sustainable Interior Applications";
const C = pres.SchemeColor;
const FOOT = "ICSMMEP-26  |  Mecca, 3-4 November 2026  |  B. Unal, Cappadocia University";

/* layouts */
pres.defineSlideMaster({ title: "TITLE_DARK", background: { color: C.text2 }, objects: [
  { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 1.45, w: 7.3, h: 2.5,
      fontSize: 33, bold: true, color: C.background1, valign: "bottom", align: "left" }, text: " " } },
  { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 4.2, w: 7.3, h: 2.0,
      fontSize: 15, color: "D8E2DA", valign: "top", align: "left" }, text: " " } } ] });

const contentObjs = (titleColor, footColor) => ([
  { placeholder: { options: { name: "title", type: "title", x: 0.55, y: 0.36, w: 12.2, h: 0.78,
      fontSize: 29, bold: true, color: titleColor, valign: "middle", align: "left" }, text: " " } },
  { text: { text: FOOT, options: { x: 0.55, y: 6.95, w: 10.6, h: 0.28, fontSize: 9,
      color: footColor, isTextBox: true, margin: 0, valign: "middle" } } },
  { placeholder: { options: { name: "slideNumber", type: "sldNum", x: 12.35, y: 6.95, w: 0.4, h: 0.28,
      fontSize: 9, color: footColor, align: "right" } } } ]);
pres.defineSlideMaster({ title: "CONTENT", background: { color: C.background1 }, objects: contentObjs(C.text2, "9A978F") });
pres.defineSlideMaster({ title: "CONTENT_DARK", background: { color: C.text2 }, objects: contentObjs(C.background1, "7E937F") });

/* helpers */
const S = (o = {}) => Object.assign({ isTextBox: true, margin: 0 }, o);
const card = (s, x, y, w, h, n, col) => s.addShape(pres.ShapeType.roundRect,
  { x, y, w, h, rectRadius: 0.05, fill: { color: col || C.background2 }, line: { color: col || C.background2 }, objectName: n });

function kicker(s, x, y, w, t, dark) {
  s.addText(t, S({ x, y, w, h: 0.3, fontSize: 12, bold: true, color: dark ? "AFC4B7" : C.accent1, valign: "middle" }));
}
function stat(s, x, y, w, v, l, dark) {
  s.addText(v, S({ x, y, w, h: 0.62, fontSize: 30, bold: true, color: dark ? "FFFFFF" : C.accent1,
    fontFace: THEME.headFontFace, valign: "bottom" }));
  s.addText(l, S({ x, y: y + 0.66, w, h: 0.5, fontSize: 11, color: dark ? "AFC4B7" : C.accent6, valign: "top", lineSpacing: 14 }));
}
const H = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: C.accent4 }, align: "center", valign: "middle", fontSize: 12 } });
const D = (t, o = {}) => ({ text: t, options: Object.assign({ align: "center", valign: "middle", color: C.text1, fontSize: 12 }, o) });
const DL = (t, o = {}) => D(t, Object.assign({ align: "left" }, o));
const HI = { fill: { color: "F6E8DF" }, bold: true, color: C.accent1 };

function steps(s, x, y, w, items, gap, dark) {
  items.forEach(([h, b], i) => {
    const yy = y + i * gap;
    s.addShape(pres.ShapeType.ellipse, { x, y: yy, w: 0.36, h: 0.36, fill: { color: C.accent1 }, objectName: "d" + h.slice(0, 4) + i });
    s.addText(String(i + 1), S({ x, y: yy, w: 0.36, h: 0.36, fontSize: 12, bold: true, color: "FFFFFF", align: "center", valign: "middle" }));
    s.addText(h, S({ x: x + 0.52, y: yy - 0.03, w: w - 0.52, h: 0.3, fontSize: 14, bold: true, color: dark ? C.background1 : C.text2, valign: "middle" }));
    s.addText(b, S({ x: x + 0.52, y: yy + 0.28, w: w - 0.52, h: gap - 0.32, fontSize: 11.5, color: dark ? "C7D4C9" : C.accent6, valign: "top", lineSpacing: 15 }));
  });
}

/* ========== 1 title ========== */
pres.addSection({ title: "Introduction" });
let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Introduction" });
s.addImage({ path: G + "01-prototip-cesitlemeleri.jpeg", x: 8.3, y: 1.5, w: 4.4, h: 2.47, objectName: "hero" });
s.addText("Development and Characterisation of Eggshell–Agar Biocomposites for Sustainable Interior Applications", { placeholder: "title" });
s.addText([
  { text: "Betül Ünal", options: { bold: true, color: "FFFFFF", fontSize: 17, breakLine: true } },
  { text: "Department of Interior Architecture, Cappadocia University, Nevşehir, Türkiye", options: { breakLine: true } },
  { text: " ", options: { fontSize: 8, breakLine: true } },
  { text: "ICSMMEP-26  ·  Mecca, Saudi Arabia  ·  3–4 November 2026", options: { color: "AFC4B7" } },
], { placeholder: "body" });
s.addNotes("Good morning. Betul Unal, Department of Interior Architecture, Cappadocia University. This paper reports the production protocol and mechanical characterisation of a fully bio-based composite made from waste eggshell bound in an agar-glycerol matrix, and proposes an evaluation criterion better suited to this class of material than compressive strength alone.");

/* ========== 2 state of the art I ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Introduction" });
s.addText("State of the art I — eggshell valorisation", { placeholder: "title" });
kicker(s, 0.55, 1.2, 7.3, "WHERE EGGSHELL WASTE CURRENTLY GOES");
s.addTable([
  [H("Application"), H("Matrix"), H("Reference")],
  [DL("Cement and concrete replacement"), DL("Portland clinker"), DL("Teara et al. 2020")],
  [DL("Laterite brick stabilisation"), DL("Cement"), DL("Adogla et al. 2016")],
  [DL("Asphalt binder modification"), DL("Bitumen"), DL("Razzaq & Yousif 2017")],
  [DL("Soil stabilisation"), DL("Lime substitute"), DL("Soundara et al. 2015")],
  [DL("Ceramic wall tile"), DL("Ceramic body"), DL("Vilarinho et al. 2020")],
  [DL("Particulate filler"), DL("PLA, epoxy, PVC, PU"), DL("Owuamanam & Cree 2020")],
  [DL("Bio-packaging reinforcement"), DL("Starch, PLA films"), DL("Recent reviews, 2021–2025")],
], { x: 0.55, y: 1.54, w: 7.3, colW: [3.1, 2.1, 2.1], rowH: 0.36, fontSize: 12,
     fontFace: THEME.bodyFontFace, border: { type: "solid", color: "DEDAD1", pt: 1 }, fill: { color: "FFFFFF" }, objectName: "lit-table" });
s.addText("Reviews: Ngayakamo & Onwualu, Heliyon 2022  ·  Owuamanam & Cree, J. Compos. Sci. 4(2):70, 2020  ·  Frontiers in Materials 9:1024977, 2022",
  S({ x: 0.55, y: 4.2, w: 7.3, h: 0.5, fontSize: 10.5, italic: true, color: C.accent6, lineSpacing: 14 }));
card(s, 0.55, 4.8, 7.3, 1.45, "pattern", "F6E8DF");
kicker(s, 0.9, 5.0, 6.6, "THE PATTERN ACROSS THIS LITERATURE");
s.addText("Eggshell enters as a mineral filler. The binding phase it enters remains petrochemical, clinker-based or ceramic. Reported loadings sit between 5% and 30% of the matrix. The waste is valorised; the matrix is not.",
  S({ x: 0.9, y: 5.35, w: 6.6, h: 0.85, fontSize: 12, color: C.text1, lineSpacing: 16 }));
card(s, 8.15, 1.2, 4.6, 5.05, "why-caco3", THEME.colors.accent4);
kicker(s, 8.5, 1.42, 3.9, "WHY THE FIELD KEEPS RETURNING TO IT", true);
s.addText([
  { text: "Approximately 94% calcium carbonate, chemically close to quarried limestone.", options: { bullet: true, breakLine: true } },
  { text: "A porous, layered shell microstructure with a protein-bound crystalline matrix.", options: { bullet: true, breakLine: true } },
  { text: "Specific gravity of 0.85–2.66, lighter than most mineral fillers.", options: { bullet: true, breakLine: true } },
  { text: "Continuously generated, geographically distributed, and currently landfilled at scale.", options: { bullet: true } },
], S({ x: 8.5, y: 1.85, w: 3.9, h: 3.1, fontSize: 12, color: "FFFFFF", paraSpaceAfter: 8, lineSpacing: 16 }));
s.addText("The material argument for eggshell is settled. The open question is what binds it.",
  S({ x: 8.5, y: 5.3, w: 3.9, h: 0.75, fontSize: 12, bold: true, italic: true, color: "F0C9A8", lineSpacing: 16 }));
s.addNotes("Let me start with where the field is, not where my work is. Eggshell valorisation is well established across construction and packaging - cement, bitumen, lime substitution, ceramic bodies, and as a particulate filler in thermoplastics. Reported loadings run from five to thirty percent. The reason the field keeps returning to it is clear: it is 94 percent calcium carbonate, chemically close to quarried limestone, with a useful porous microstructure and a lower specific gravity than most mineral fillers. So the material argument for eggshell is settled. What is not settled is what binds it - and that is where this study sits.");

/* ========== 3 state of the art II ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Introduction" });
s.addText("State of the art II — agar as a structural binder", { placeholder: "title" });
card(s, 0.55, 1.2, 6.0, 2.75, "agar-lit");
kicker(s, 0.9, 1.42, 5.3, "WHAT IS KNOWN ABOUT AGAR–GLYCEROL SYSTEMS");
s.addText([
  { text: "Hernández et al. (Materials 15:3954, 2022) mapped 32 agar–glycerin–water formulations by design of experiments, trained a regression model on the result, and released the dataset openly.", options: { breakLine: true } },
  { text: " ", options: { fontSize: 8, breakLine: true } },
  { text: "Across the agar film literature the direction is consistent: glycerol raises elongation and lowers tensile strength. Agar fraction and the agar–glycerol interaction, not glycerol alone, govern stiffness.", options: {} },
], S({ x: 0.9, y: 1.8, w: 5.3, h: 2.0, fontSize: 12, color: C.text1, lineSpacing: 16 }));
card(s, 0.55, 4.15, 6.0, 2.1, "agar-limit", "F6E8DF");
kicker(s, 0.9, 4.37, 5.3, "AND WHAT IS NOT");
s.addText("That body of work concerns unfilled thin films, tested in tension, for packaging. Agar has not been characterised as the binder of a mineral-filled cast solid in bending, which is the loading case for an interior surface component.",
  S({ x: 0.9, y: 4.75, w: 5.3, h: 1.35, fontSize: 12, color: C.text1, lineSpacing: 16 }));
card(s, 6.85, 1.2, 5.9, 5.05, "shift", THEME.colors.accent4);
kicker(s, 7.2, 1.42, 5.2, "THE SHIFT THIS STUDY MAKES", true);
s.addTable([
  [H("—"), H("Agar film literature"), H("This study")],
  [DL("Form", { color: "FFFFFF" }), DL("Thin cast film"), DL("Cast solid, 20–50 mm")],
  [DL("Filler", { color: "FFFFFF" }), DL("Unfilled or organic"), DL("Mineral, 66% of solids")],
  [DL("Loading", { color: "FFFFFF" }), DL("Uniaxial tension"), DL("Compression and bending")],
  [DL("Application", { color: "FFFFFF" }), DL("Packaging"), DL("Interior surfaces")],
  [DL("Property set", { color: "FFFFFF" }), DL("Tensile, barrier"), DL("Strength, fire, hygric")],
], { x: 7.2, y: 1.8, w: 5.2, colW: [1.5, 1.9, 1.8], rowH: 0.44, fontSize: 11.5,
     fontFace: THEME.bodyFontFace, border: { type: "solid", color: "DEDAD1", pt: 1 }, fill: { color: "FFFFFF" }, objectName: "shift-table" });
s.addText("The compositional logic is carried over from the film literature. The form, the filler, the loading case and the property set are not.",
  S({ x: 7.2, y: 4.65, w: 5.2, h: 1.0, fontSize: 12.5, bold: true, color: "F0C9A8", lineSpacing: 17 }));
s.addNotes("Second, what is known about the binder. Agar-glycerol systems are reasonably well characterised - Hernandez and colleagues mapped thirty-two agar, glycerin and water formulations by design of experiments in 2022 and released the dataset openly. The consistent finding across that literature is that glycerol raises elongation and lowers tensile strength, and that stiffness is governed by the agar fraction and the agar-glycerol interaction rather than glycerol alone. But all of that concerns unfilled thin films, tested in tension, for packaging. Agar has not been characterised as the binder of a mineral-filled cast solid in bending - which is the actual loading case for an interior surface component. That is the shift this study makes: the compositional logic carries over, the form and the loading case do not.");

/* ========== 4 the gap, evidenced ========== */
s = pres.addSlide({ masterName: "CONTENT_DARK", sectionTitle: "Introduction" });
s.addText("The gap is not rhetorical — it is documented", { placeholder: "title" });
card(s, 0.55, 1.2, 6.0, 2.4, "materiom", "15302A");
kicker(s, 0.9, 1.42, 5.3, "AN OPEN COMMONS ALREADY EXISTS", true);
s.addText("Materiom publishes biomaterial recipes under CC-BY-SA, excludes petrochemical ingredients, archives each recipe as prior art, and indexes property data on the Materials Data Facility with citable DOIs. The infrastructure for shared procedures is built.",
  S({ x: 0.9, y: 1.8, w: 5.3, h: 1.6, fontSize: 12, color: "FFFFFF", lineSpacing: 16 }));
card(s, 0.55, 3.8, 6.0, 2.45, "four", "15302A");
kicker(s, 0.9, 4.02, 5.3, "BUT THE PROPERTY DATA IS THIN", true);
s.addText("Property data currently exists for four recipes:",
  S({ x: 0.9, y: 4.38, w: 5.3, h: 0.3, fontSize: 12, color: "C7D4C9" }));
s.addText([
  { text: "agar bioplastic", options: { bullet: true, breakLine: true } },
  { text: "gelatin bioplastic", options: { bullet: true, breakLine: true } },
  { text: "mycelium–walnut shell composite", options: { bullet: true, breakLine: true } },
  { text: "mussel shell–sucrose ceramic", options: { bullet: true } },
], S({ x: 0.9, y: 4.72, w: 5.3, h: 1.4, fontSize: 12, color: "FFFFFF", paraSpaceAfter: 4, lineSpacing: 15 }));
s.addText("materiom.org/data, accessed October 2026",
  S({ x: 0.55, y: 6.32, w: 6.0, h: 0.3, fontSize: 10, italic: true, color: "AFC4B7" }));
stat(s, 6.95, 1.3, 2.7, "4", "recipes with published property data", true);
stat(s, 9.95, 1.3, 2.8, "> 50 000", "articles queued for automated recipe extraction", true);
card(s, 6.95, 3.0, 5.8, 3.25, "gap-read", "15302A");
kicker(s, 7.3, 3.22, 5.1, "WHAT THIS MEANS FOR THE PRESENT WORK", true);
s.addText([
  { text: "The nearest analogue in that set is the mussel shell–sucrose ceramic: a shell mineral in a biological binder. Nothing in it couples a shell mineral to an agar binder, and nothing reports compressive, flexural, ignitability and hygric data for the same formulation family.", options: { color: "FFFFFF", breakLine: true } },
  { text: " ", options: { fontSize: 10, breakLine: true } },
  { text: "So the contribution is not a claim that nobody has thought of this. It is a protocol and a property set entering a commons that is currently four recipes deep.", options: { bold: true, color: "F0C9A8" } },
], S({ x: 7.3, y: 3.6, w: 5.1, h: 2.5, fontSize: 12, lineSpacing: 16 }));
s.addNotes("I want to be careful here, because claiming a gap is cheap. So let me show you the gap rather than assert it. Materiom is an open commons for biomaterial recipes - CC-BY-SA licensed, petrochemical ingredients excluded, each recipe archived as prior art, property data indexed with citable DOIs. The infrastructure for shared procedures exists. But property data currently exists for four recipes: agar bioplastic, gelatin bioplastic, mycelium-walnut shell composite, and mussel shell-sucrose ceramic. The nearest analogue to this work is the last one - a shell mineral in a biological binder. Nothing in that set couples a shell mineral to an agar binder, and nothing reports compressive, flexural, ignitability and hygric data for one formulation family. So my contribution is not that nobody thought of this. It is a protocol and a property set entering a commons that is four recipes deep.");

/* ========== 3 aim ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Introduction" });
s.addText("Aim, scope and research questions", { placeholder: "title" });
card(s, 0.55, 1.25, 5.9, 2.1, "aim");
kicker(s, 0.9, 1.48, 5.2, "AIM");
s.addText("To document a reproducible production protocol for a fully bio-based eggshell composite, and to characterise its mechanical, thermal and hygric response against both conventional and bio-based interior materials.",
  S({ x: 0.9, y: 1.85, w: 5.2, h: 1.3, fontSize: 13, color: C.text1, lineSpacing: 18 }));
card(s, 0.55, 3.55, 5.9, 2.6, "scope");
kicker(s, 0.9, 3.78, 5.2, "SCOPE");
s.addText([
  { text: "Five formulations, two mechanical test programmes", options: { bullet: true, breakLine: true } },
  { text: "Three specimens per formulation", options: { bullet: true, breakLine: true } },
  { text: "Standardised tests: ASTM D790, ISO 11925-2, ASTM D570", options: { bullet: true, breakLine: true } },
  { text: "Single laboratory, ambient curing, no accelerated ageing", options: { bullet: true } },
], S({ x: 0.9, y: 4.15, w: 5.2, h: 1.85, fontSize: 12.5, color: C.accent6, paraSpaceAfter: 6 }));
card(s, 6.85, 1.25, 5.9, 4.9, "rq", THEME.colors.accent4);
kicker(s, 7.2, 1.48, 5.2, "RESEARCH QUESTIONS", true);
[["Q1", "Which formulation variable governs compressive strength, and over what range?"],
 ["Q2", "What is the effect of plasticiser content on flexural behaviour?"],
 ["Q3", "How does the material compare with conventional interior surface materials?"],
 ["Q4", "How does it compare with other bio-based composites?"],
 ["Q5", "Is compressive strength the appropriate criterion for this material class?"]]
 .forEach(([n, q], i) => {
  s.addText(n, S({ x: 7.2, y: 1.9 + i * 0.82, w: 0.55, h: 0.35, fontSize: 14, bold: true, color: "F0C9A8", fontFace: THEME.headFontFace }));
  s.addText(q, S({ x: 7.8, y: 1.9 + i * 0.82, w: 4.6, h: 0.72, fontSize: 12.5, color: "FFFFFF", lineSpacing: 16 }));
});
s.addNotes("Five questions. The first two are formulation questions, the next two are benchmarking questions, and the fifth is the one I actually care about and will come back to at the end.");

/* ========== 4 materials ========== */
pres.addSection({ title: "Production" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Production" });
s.addText("Constituents and their function", { placeholder: "title" });
s.addTable([
  [H("Constituent"), H("Origin"), H("Function in the composite"), H("Relevant property")],
  [DL("Eggshell powder"), DL("Food waste"), DL("Mineral filler; load-bearing phase"), DL("94% CaCO₃; porous shell structure")],
  [DL("Agar"), DL("Red seaweed"), DL("Binder; forms the continuous phase"), DL("Thermoreversible gel; high water retention")],
  [DL("Glycerol"), DL("Vegetable oil"), DL("Plasticiser; controls ductility"), DL("Humectant; low vapour pressure")],
  [DL("Water"), DL("—"), DL("Carrier; governs solids concentration"), DL("Fully evaporated during drying")],
  [DL("Shellac"), DL("Kerria lacca resin"), DL("Surface finish; hydrophobic barrier"), DL("Biodegradable; film-forming")],
], { x: 0.55, y: 1.3, w: 12.2, colW: [2.1, 1.75, 4.1, 4.25], rowH: 0.5, fontSize: 12,
     fontFace: THEME.bodyFontFace, border: { type: "solid", color: "DEDAD1", pt: 1 }, fill: { color: "FFFFFF" }, objectName: "mat-table" });
card(s, 0.55, 4.65, 12.2, 1.0, "mat-note");
s.addText([
  { text: "Design logic:  ", options: { bold: true, color: C.text2 } },
  { text: "the mineral phase carries load, the agar network holds it together, and glycerol sets where the composite sits on the brittle–ductile axis. Water is not a component of the final material; it is the process variable that determines how densely the solids pack.", options: { color: C.accent6 } },
], S({ x: 0.9, y: 4.65, w: 11.5, h: 1.0, fontSize: 12.5, valign: "middle", lineSpacing: 17 }));
s.addText("Gelatine, starch and vinegar were trialled during development and are not part of the reported formulations.",
  S({ x: 0.55, y: 5.85, w: 12.2, h: 0.4, fontSize: 11, italic: true, color: C.accent6 }));
s.addNotes("Five constituents. The division of labour matters: eggshell carries load, agar forms the continuous network, glycerol decides whether the composite behaves brittle or ductile, and water is not in the final material at all - it is the process variable that sets how densely the solids pack. Keep that last point in mind, because it turns out to be the controlling variable.");

/* ========== 5 protocol I ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Production" });
s.addText("Protocol I — preparation of the mineral fraction", { placeholder: "title" });
steps(s, 0.55, 1.35, 7.4, [
  ["Collection and cleaning", "Shells from a single local bakery, collected over more than one year. Membrane and organic residue removed by hand."],
  ["Thermal treatment", "Laboratory oven, 120 °C for 20 minutes. Described as decontamination and drying; sterility was not verified and dry-heat sterilisation requires higher temperatures."],
  ["Cooling and drying", "Cooled to ambient, then dried until no residual moisture remained by mass."],
  ["Milling", "Laboratory mechanical grinder; milling continued until a visually homogeneous fine powder was obtained."],
  ["Sieving", "150 µm mesh. Only the passing fraction was used, consistent with eggshell powder procedures reported for polymer composites."],
], 1.05);
s.addImage({ path: G + "03-uretim-sureci.jpeg", x: 8.4, y: 1.45, w: 4.35, h: 1.39, objectName: "shells" });
card(s, 8.4, 3.0, 4.35, 2.55, "p1-stats");
kicker(s, 8.75, 3.22, 3.65, "CONTROLLED PARAMETERS");
s.addTable([
  [DL("Treatment temperature", { fontSize: 11.5 }), D("120 °C", { bold: true, color: C.accent1, fontSize: 11.5 })],
  [DL("Treatment duration", { fontSize: 11.5 }), D("20 min", { bold: true, color: C.accent1, fontSize: 11.5 })],
  [DL("Sieve aperture", { fontSize: 11.5 }), D("150 µm", { bold: true, color: C.accent1, fontSize: 11.5 })],
  [DL("Collection period", { fontSize: 11.5 }), D("> 12 months", { bold: true, color: C.accent1, fontSize: 11.5 })],
], { x: 8.75, y: 3.6, w: 3.65, colW: [2.35, 1.3], rowH: 0.42, fontSize: 11.5,
     fontFace: THEME.bodyFontFace, border: { type: "none" }, objectName: "p1-table" });
s.addNotes("Shell preparation. Two points worth flagging. First, I call the 120 degree step decontamination and drying rather than sterilisation, because dry-heat sterilisation needs around 160 to 170 degrees for one to two hours and we did not verify sterility. Second, the 150 micrometre sieve was chosen to match the particle size used in the polymer-composite eggshell literature, so that the mineral phase here is comparable to that work.");

/* ========== 6 protocol II ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Production" });
s.addText("Protocol II — the binder phase and its thermal regime", { placeholder: "title" });
steps(s, 0.55, 1.35, 7.4, [
  ["Pre-mixing", "Water and glycerol combined and stirred to a homogeneous liquid before any solids are introduced."],
  ["Agar dispersion", "Powdered agar added incrementally under continuous stirring. Bulk addition causes agglomeration that does not redisperse."],
  ["Dissolution stage", "Heated to 95 °C and held until the agar is fully in solution. Below full dissolution the gel network does not form continuously."],
  ["Cooking stage", "Reduced to 80 °C and held, stirring maintained, while viscosity develops into a pourable but cohesive binder."],
], 1.2);
card(s, 8.4, 1.35, 4.35, 3.4, "p2-stats", THEME.colors.accent4);
kicker(s, 8.75, 1.58, 3.65, "THERMAL REGIME", true);
stat(s, 8.75, 1.95, 3.65, "95 °C", "dissolution set point", true);
stat(s, 8.75, 3.1, 3.65, "80 °C", "controlled cooking set point", true);
s.addText("55 min total heating, across both stages",
  S({ x: 8.75, y: 4.25, w: 3.65, h: 0.4, fontSize: 13, bold: true, color: "F0C9A8" }));
card(s, 0.55, 5.9, 12.2, 0.85, "p2-note", "F6E8DF");
s.addText([
  { text: "Reproducibility limit:  ", options: { bold: true, color: C.accent1 } },
  { text: "stirring was manual throughout, so shear rate and mixing energy are not controlled quantities. The regime is reproducible in a studio; it is not yet specified tightly enough for an instrumented laboratory.", options: { color: C.text1 } },
], S({ x: 0.9, y: 5.9, w: 11.5, h: 0.85, fontSize: 12.5, valign: "middle", lineSpacing: 17 }));
s.addText("The two-stage regime follows the 70–90 °C band reported for agar-based biomaterial preparation.",
  S({ x: 8.75, y: 4.85, w: 3.9, h: 0.7, fontSize: 11, italic: true, color: C.accent6, lineSpacing: 15 }));
s.addNotes("The binder is a two-stage thermal regime: dissolution at 95, then a controlled cooking hold at 80, 55 minutes in total. The reason for two stages is that agar must be fully in solution before viscosity is allowed to build, otherwise the gel network forms in patches. And I will say plainly: stirring was manual, so shear rate is not a controlled quantity. This protocol is reproducible in a studio. It is not yet tight enough for an instrumented laboratory, and that is a real limit.");

/* ========== 7 protocol III ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Production" });
s.addText("Protocol III — compositing, casting and drying", { placeholder: "title" });
steps(s, 0.55, 1.35, 7.4, [
  ["Mineral incorporation", "Sieved shell fraction added incrementally into the binder held at 80 °C, under continuous stirring. Earlier addition causes sedimentation of the mineral phase."],
  ["Casting", "Poured into silicone moulds and levelled. Silicone was selected for flexibility: it releases without a parting agent and without damaging the partially consolidated specimen."],
  ["In-mould setting", "Four days. Mould geometry follows the test: 50 mm cube moulds for compression, flat moulds for flexural, flame and absorption specimens."],
  ["Ambient consolidation", "Demoulded, then a further seven days at approximately 23 °C, shielded from direct sunlight and forced air movement. No oven drying at any stage."],
], 1.2);
card(s, 8.4, 1.35, 4.35, 3.6, "shrink", "F6E8DF");
kicker(s, 8.75, 1.58, 3.65, "DISCLOSURE — DIMENSIONAL LOSS");
s.addText("The composite shrinks appreciably as the water phase evaporates. Cross-sections were measured at the time of testing, but post-drying dimensions were not logged in the original study. Dimensions quoted in this presentation are mould dimensions unless stated otherwise.\n\nAnyone applying this protocol should record specimen geometry after drying, not at casting.",
  S({ x: 8.75, y: 1.95, w: 3.65, h: 2.85, fontSize: 11.5, color: C.text1, lineSpacing: 16 }));
s.addText("Total time from casting to a finished specimen: 11 days, entirely at ambient temperature. No energy input beyond the 55-minute cook.",
  S({ x: 0.55, y: 6.05, w: 7.6, h: 0.7, fontSize: 12, italic: true, color: C.accent6, lineSpacing: 16 }));
s.addText("23 °C  ·  11 days  ·  no oven",
  S({ x: 8.4, y: 5.15, w: 4.35, h: 0.4, fontSize: 15, bold: true, color: C.accent1, fontFace: THEME.headFontFace }));
s.addNotes("Compositing, casting and drying. The mineral goes in at 80 degrees, late, because adding it earlier lets it settle out. Silicone moulds release without a parting agent. Then four days in mould and seven days consolidating, all at ambient - no oven at any point, which matters for the energy argument. And the disclosure: the material shrinks as water leaves. Cross-sections were measured at test time, but the dried dimensions were not logged, so unless I say otherwise the dimensions here are mould dimensions.");

/* ========== 8 formulation matrix ========== */
pres.addSection({ title: "Characterisation" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Characterisation" });
s.addText("Formulation matrix and derived ratios", { placeholder: "title" });
s.addTable([
  [H("ID"), H("Test"), H("Water\n(g)"), H("Shell\n(g)"), H("Agar\n(g)"), H("Glycerol\n(g)"), H("Solids\n(g)"), H("Shell : binder"), H("Solids : water"), H("Glycerol\n% of solids")],
  [D("C1"), DL("Compression"), D("325"), D("80"),  D("35"), D("5"),  D("120"), D("2.00", { bold: true }), D("0.37"), D("4.2")],
  [D("C2"), DL("Compression"), D("310"), D("90"),  D("40"), D("5"),  D("135"), D("2.00", { bold: true }), D("0.44"), D("3.7")],
  [D("C3"), DL("Compression"), D("280"), D("110"), D("45"), D("10"), D("165"), D("2.00", { bold: true }), D("0.59"), D("6.1")],
  [D("F1"), DL("Flexure"),     D("450"), D("190"), D("70"), D("60"), D("320"), D("1.46"), D("0.71"), D("18.8")],
  [D("F2"), DL("Flexure"),     D("480"), D("190"), D("70"), D("30"), D("290"), D("1.90"), D("0.60"), D("10.3")],
], { x: 0.55, y: 1.3, w: 12.2, colW: [0.7, 1.85, 1.0, 0.95, 0.9, 1.25, 1.0, 1.55, 1.55, 1.5], rowH: 0.44,
     fontSize: 12, fontFace: THEME.bodyFontFace, border: { type: "solid", color: "DEDAD1", pt: 1 },
     fill: { color: "FFFFFF" }, objectName: "form-matrix" });
card(s, 0.55, 4.5, 5.95, 1.95, "obs1");
kicker(s, 0.9, 4.72, 5.25, "COMPRESSION SERIES");
s.addText("The shell-to-binder mass ratio is held at exactly 2.00 across all three formulations. The single variable that changes is solids concentration, which rises from 0.37 to 0.59.",
  S({ x: 0.9, y: 5.08, w: 5.25, h: 1.2, fontSize: 12.5, color: C.text1, lineSpacing: 17 }));
card(s, 6.8, 4.5, 5.95, 1.95, "obs2", "F6E8DF");
kicker(s, 7.15, 4.72, 5.25, "FLEXURAL SERIES — CONFOUND");
s.addText("Glycerol was halved, but total batch mass was held at 770 g, so water rose to compensate. Shell-to-binder and solids concentration therefore moved as well. The glycerol effect is not fully isolated.",
  S({ x: 7.15, y: 5.08, w: 5.25, h: 1.2, fontSize: 12.5, color: C.text1, lineSpacing: 17 }));
s.addNotes("This is the formulation matrix with the derived ratios added, and the two right-hand columns are the ones to read. In the compression series the shell-to-binder ratio is exactly two point zero zero in all three mixes - that was not planned as a control, but it means the only thing that actually varies is solids concentration. In the flexural series I have to declare a confound: glycerol was halved, but total batch mass was fixed at 770 grams, so water rose to compensate and the other two ratios shifted with it. The glycerol effect is therefore not cleanly isolated.");

/* ========== 9 test programme ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Characterisation" });
s.addText("Test programme", { placeholder: "title" });
s.addTable([
  [H("Property"), H("Standard"), H("Specimen geometry"), H("n"), H("Measured quantity")],
  [DL("Compressive behaviour"), DL("— (cube compression)"), DL("50 mm cube moulds"), D("3 per mix"), DL("Maximum load; compressive stress")],
  [DL("Flexural behaviour"), DL("ASTM D790, three-point"), DL("180 × 60 × 20 mm, 120 mm span"), D("3 per mix"), DL("Flexural strength; flexural modulus")],
  [DL("Reaction to fire"), DL("ISO 11925-2"), DL("40 × 50 mm, 45°, 15 s edge flame"), D("2 ignitions"), DL("Time to ignition; time to self-extinguish")],
  [DL("Water absorption"), DL("ASTM D570"), DL("40 × 50 mm, shellac-coated"), D("1"), DL("Mass gain after 24 h immersion")],
  [DL("Bulk density"), DL("Gravimetric"), DL("50 mm cube"), D("1"), DL("Mass / mould volume")],
], { x: 0.55, y: 1.3, w: 12.2, colW: [2.5, 2.45, 3.5, 1.15, 2.6], rowH: 0.52, fontSize: 12,
     fontFace: THEME.bodyFontFace, border: { type: "solid", color: "DEDAD1", pt: 1 }, fill: { color: "FFFFFF" }, objectName: "test-table" });
card(s, 0.55, 4.75, 12.2, 1.6, "test-note");
kicker(s, 0.9, 4.97, 11.5, "REPORTING CONVENTION");
s.addText("All mechanical values reported in this presentation are means of three specimens. Individual specimen values were not retained in the original study, so standard deviations cannot be reported. Fire, absorption and density figures rest on single determinations and are presented as indicative rather than characteristic values.",
  S({ x: 0.9, y: 5.33, w: 11.5, h: 0.95, fontSize: 12.5, color: C.text1, lineSpacing: 17 }));
s.addText("All testing: Advanced Construction Materials Research Laboratory, Hacettepe University.",
  S({ x: 0.55, y: 6.45, w: 12.2, h: 0.35, fontSize: 11, italic: true, color: C.accent6 }));
s.addNotes("The test programme, with the standards and specimen geometries. I want the reporting convention on the record before any numbers appear: mechanical values are means of three specimens, individual values were not retained so I cannot give you standard deviations, and the fire, absorption and density figures are single determinations - indicative, not characteristic. All testing was at the Advanced Construction Materials Research Laboratory at Hacettepe.");

/* ========== 10 compression results ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Characterisation" });
s.addText("Compressive strength scales with solids concentration", { placeholder: "title" });
s.addTable([
  [H("ID"), H("Solids : water"), H("Fₘₐₓ (kN)"), H("σᴄ (MPa)")],
  [D("C1"), D("0.37"), D("3.89"), D("2.55")],
  [D("C2"), D("0.44"), D("4.30"), D("3.12")],
  [D("C3"), D("0.59"), D("6.80", HI), D("4.10", HI)],
], { x: 0.55, y: 1.3, w: 5.3, colW: [0.8, 1.7, 1.4, 1.4], rowH: 0.46, fontSize: 12.5,
     fontFace: THEME.bodyFontFace, border: { type: "solid", color: "DEDAD1", pt: 1 }, fill: { color: "FFFFFF" }, objectName: "comp-table" });
s.addChart(pres.ChartType.bar, [
  { name: "Compressive stress", labels: ["C1  (0.37)", "C2  (0.44)", "C3  (0.59)"], values: [2.55, 3.12, 4.10] },
], { x: 6.1, y: 1.3, w: 6.65, h: 3.5, barDir: "col",
     chartColors: [THEME.colors.accent4], showLegend: false,
     showValue: true, dataLabelPosition: "outEnd", dataLabelColor: THEME.colors.dk1, dataLabelFontSize: 12, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.00",
     catAxisLabelColor: THEME.colors.accent6, catAxisLabelFontSize: 11, catAxisLabelFontFace: "+mn-lt",
     valAxisLabelColor: THEME.colors.accent6, valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt",
     valAxisTitle: "Compressive stress (MPa)", showValAxisTitle: true, valAxisTitleColor: THEME.colors.accent6,
     valAxisTitleFontSize: 11, valAxisTitleFontFace: "+mn-lt", valAxisMaxVal: 5,
     catAxisTitle: "Formulation  (solids : water)", showCatAxisTitle: true, catAxisTitleColor: THEME.colors.accent6,
     catAxisTitleFontSize: 11, catAxisTitleFontFace: "+mn-lt",
     valGridLine: { color: "EDEAE3", size: 1 }, catGridLine: { style: "none" }, objectName: "comp-chart" });
card(s, 0.55, 3.5, 5.3, 2.85, "fit-card", THEME.colors.accent4);
kicker(s, 0.9, 3.72, 4.6, "OBSERVED RELATIONSHIP", true);
s.addText("σᴄ  =  6.93 · (solids : water)  +  0.04",
  S({ x: 0.9, y: 4.1, w: 4.6, h: 0.55, fontSize: 16, bold: true, color: "FFFFFF", fontFace: THEME.headFontFace }));
s.addText("R² = 0.994  over the range 0.37 – 0.59",
  S({ x: 0.9, y: 4.65, w: 4.6, h: 0.35, fontSize: 12, color: "F0C9A8" }));
s.addText("With shell : binder fixed at 2.00, compressive stress is a linear function of solids concentration across the range tested. Three formulations cannot establish this as a law — but it is a testable hypothesis, and it predicts that strength is set by packing density rather than by mineral content as such.",
  S({ x: 0.9, y: 5.08, w: 4.6, h: 1.1, fontSize: 11.5, color: "C7D4C9", lineSpacing: 15 }));
s.addNotes("Here is the compression result, and it is tidier than I expected. Because shell-to-binder is fixed at two, solids concentration is the only variable - and compressive stress is linear in it, with an R-squared of 0.994 over the range 0.37 to 0.59. Now, three points will fit almost any line, so I am not claiming a law. What I am claiming is a testable hypothesis with a clear physical reading: strength here is governed by packing density, not by mineral content as such. If that is right, the way to a stronger composite is to remove water, not to add shell.");

/* ========== 11 compression failure mode ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Characterisation" });
s.addText("Failure mode: progressive crushing, not fracture", { placeholder: "title" });
s.addImage({ path: G + "04-basma-ficilasmis-kup.jpeg", x: 0.55, y: 1.3, w: 2.05, h: 4.44, objectName: "cube" });
s.addText("C3 specimen after loading: barrelled, shortened, still a single body",
  S({ x: 0.55, y: 5.8, w: 2.4, h: 0.6, fontSize: 10.5, italic: true, color: C.accent6, lineSpacing: 14 }));
s.addText("Compressive stress – strain, C3", S({ x: 3.0, y: 1.32, w: 5.0, h: 0.3, fontSize: 12.5, bold: true, color: C.text2 }));
s.addImage({ path: G + "05b-basma-egrisi.png", x: 3.0, y: 1.68, w: 5.0, h: 2.8, objectName: "comp-curve" });
s.addText("Stress (MPa)", S({ x: 2.32, y: 2.6, w: 1.3, h: 0.3, fontSize: 10, color: C.accent6, rotate: 270 }));
s.addText("Strain", S({ x: 3.0, y: 4.5, w: 5.0, h: 0.3, fontSize: 10, color: C.accent6, align: "center" }));
card(s, 8.3, 1.3, 4.45, 4.55, "fail-card");
kicker(s, 8.65, 1.52, 3.75, "READING THE CURVE");
s.addText([
  { text: "Initial linear elastic region to approximately 1 MPa.", options: { bullet: true, breakLine: true } },
  { text: "Progressive stiffness loss as the agar network yields and the mineral phase redistributes.", options: { bullet: true, breakLine: true } },
  { text: "Peak stress reached at roughly 10% strain, with no abrupt load drop.", options: { bullet: true, breakLine: true } },
  { text: "Beyond peak the specimen continues to deform while retaining integrity: energy is absorbed rather than released.", options: { bullet: true } },
], S({ x: 8.65, y: 1.9, w: 3.75, h: 2.9, fontSize: 12, color: C.text1, paraSpaceAfter: 8, lineSpacing: 16 }));
s.addText("Strain values were derived from an assumed 10% maximum deformation based on observation during testing, not from instrumented strain measurement.",
  S({ x: 8.65, y: 4.95, w: 3.75, h: 0.8, fontSize: 10.5, italic: true, color: C.accent1, lineSpacing: 14 }));
s.addText("Bulk density 1.38 g/cm³ (mould volume basis)  ·  specific compressive strength 2.96 MPa per g/cm³",
  S({ x: 3.0, y: 5.05, w: 5.0, h: 0.7, fontSize: 12, bold: true, color: C.text2, lineSpacing: 16 }));
s.addNotes("The failure mode is the part I would ask about if I were sitting where you are. The curve is initially linear to about one megapascal, then stiffness falls away progressively as the agar network yields and the mineral phase redistributes. Peak stress arrives at roughly ten percent strain with no abrupt drop, and beyond peak the specimen keeps deforming while holding together. Energy is absorbed rather than released. One honesty point: the strain axis is derived from an assumed ten percent maximum deformation based on observation, not from instrumented strain measurement.");

/* ========== 12 flexure ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Characterisation" });
s.addText("Flexural behaviour: plasticiser content is decisive", { placeholder: "title" });
s.addTable([
  [H("ID"), H("Glycerol\n% of solids"), H("Fₘₐₓ (N)"), H("σꜰ (MPa)"), H("Eꜰ (MPa)"), H("ε at peak")],
  [D("F1"), D("18.8"), D("—"), D("not measurable", { italic: true }), D("—"), D("—")],
  [D("F2"), D("10.3"), D("310"), D("2.325", HI), D("192", HI), D("0.0121")],
], { x: 0.55, y: 1.3, w: 7.45, colW: [0.75, 1.65, 1.2, 1.75, 1.1, 1.0], rowH: 0.46, fontSize: 12.5,
     fontFace: THEME.bodyFontFace, border: { type: "solid", color: "DEDAD1", pt: 1 }, fill: { color: "FFFFFF" }, objectName: "flex-table" });
s.addText("σꜰ = 3FL / 2bd²  with F = 310 N, L = 120 mm, b = 60 mm, d = 20 mm   ·   ε = σꜰ / Eꜰ (Hooke, elastic region)",
  S({ x: 0.55, y: 2.85, w: 7.45, h: 0.4, fontSize: 11.5, color: C.accent6 }));
s.addImage({ path: G + "06-egilme-buyuk-sehim.jpg", x: 0.55, y: 3.45, w: 1.35, h: 3.0, objectName: "bend" });
s.addImage({ path: G + "08b-yivli-panel-kemer.jpg", x: 2.1, y: 3.45, w: 2.0, h: 2.8, objectName: "arch" });
s.addText("Three-point rig at high deflection; kerfed panel arched by hand",
  S({ x: 0.55, y: 6.4, w: 3.55, h: 0.45, fontSize: 10, italic: true, color: C.accent6, lineSpacing: 13 }));
s.addText("Flexural stress – strain, F2", S({ x: 4.35, y: 3.45, w: 3.6, h: 0.28, fontSize: 11.5, bold: true, color: C.text2 }));
s.addImage({ path: G + "09b-egilme-egrisi.png", x: 4.35, y: 3.78, w: 3.6, h: 2.03, objectName: "flex-curve" });
card(s, 8.3, 1.3, 4.45, 2.6, "kerf", "F6E8DF");
kicker(s, 8.65, 1.52, 3.75, "DISCLOSURE — SECTION GEOMETRY");
s.addText("The specimen carries transverse kerfs on its tension face, visible in both photographs. ASTM D790 assumes a solid rectangular section and the calculation above uses the full 60 × 20 mm. Part of the measured compliance is geometric, not material, and the reported modulus is therefore a lower bound on the bulk material.",
  S({ x: 8.65, y: 1.9, w: 3.75, h: 1.9, fontSize: 11.5, color: C.text1, lineSpacing: 16 }));
card(s, 8.3, 4.1, 4.45, 2.35, "flex-read");
kicker(s, 8.65, 4.32, 3.75, "INTERPRETATION");
s.addText("At 18.8% glycerol the composite deformed without developing measurable resistance — the testing machine registered no usable load. Halving the plasticiser produced a section that resists while still flexing. The transition is sharp, and it sits between these two values.",
  S({ x: 8.65, y: 4.7, w: 3.75, h: 1.65, fontSize: 11.5, color: C.text1, lineSpacing: 16 }));
s.addNotes("Flexure, to ASTM D790. The decisive variable is plasticiser. At 18.8 percent glycerol the composite deformed without developing measurable resistance - the machine registered nothing usable. Halving it produced a section that resists while still flexing: 2.325 megapascals at a modulus of 192. The transition is sharp and it lies between those two values, which is itself useful to know. Two disclosures. First, as I showed earlier, the glycerol effect is confounded with solids concentration. Second, look at the tension face - it is kerfed. D790 assumes a solid rectangle and my calculation uses the full twenty millimetre depth, so some of this compliance is geometric. The modulus I am quoting is a lower bound on the bulk material.");

/* ========== 13 fire + hygric ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Characterisation" });
s.addText("Reaction to fire, hygric response and density", { placeholder: "title" });
s.addImage({ path: G + "10-alev-testi.png", x: 0.55, y: 1.25, w: 1.75, h: 3.79, objectName: "flame" });
card(s, 2.5, 1.25, 4.5, 5.05, "fire-card");
kicker(s, 2.85, 1.45, 3.8, "IGNITABILITY — ISO 11925-2");
s.addText("40 × 50 mm dried specimen; flame at 45° to the upper corner for 15 s, repeated at the lower corner.",
  S({ x: 2.85, y: 1.8, w: 3.8, h: 0.6, fontSize: 11, color: C.accent6, lineSpacing: 14 }));
stat(s, 2.85, 2.45, 1.8, "~10 s", "to ignition");
stat(s, 4.85, 2.45, 1.8, "4 s", "to self-extinguish");
s.addText([
  { text: "Charring local to the flame contact point.", options: { bullet: true, breakLine: true } },
  { text: "No lateral flame spread in either ignition.", options: { bullet: true, breakLine: true } },
  { text: "No melting, no dripping — no thermoplastic behaviour.", options: { bullet: true } },
], S({ x: 2.85, y: 3.75, w: 3.8, h: 1.1, fontSize: 11, color: C.text1, paraSpaceAfter: 5, lineSpacing: 14 }));
s.addText("Probable mechanism: endothermic carbonate decomposition releasing CO₂, diluting the flame front locally. Not verified calorimetrically. ISO 11925-2 is an ignitability test — no Euroclass classification, cone calorimetry, smoke or toxicity data were obtained.",
  S({ x: 2.85, y: 4.95, w: 3.8, h: 1.25, fontSize: 10.5, italic: true, color: C.accent1, lineSpacing: 14 }));
card(s, 7.2, 1.25, 5.55, 2.2, "water-card");
kicker(s, 7.55, 1.45, 4.85, "WATER ABSORPTION — ASTM D570");
s.addText("40 × 50 mm specimen, three shellac coats, 10 g initial mass, 24 h full immersion.",
  S({ x: 7.55, y: 1.8, w: 4.85, h: 0.4, fontSize: 11, color: C.accent6, lineSpacing: 14 }));
s.addText("0.7%", S({ x: 7.55, y: 2.2, w: 1.5, h: 0.55, fontSize: 28, bold: true, color: C.accent1, fontFace: THEME.headFontFace, valign: "bottom" }));
s.addText("mass gain over 24 h. Slight dimensional expansion; local dissolution where the coating was thin. Coating integrity, not the composite, is the limiting factor for humid use.",
  S({ x: 9.2, y: 2.18, w: 3.2, h: 1.3, fontSize: 11, color: C.text1, lineSpacing: 14 }));
card(s, 7.2, 3.6, 5.55, 2.72, "dens-card");
kicker(s, 7.55, 3.8, 4.85, "BULK DENSITY — COMPARATIVE POSITION");
s.addTable([
  [H("Material"), H("g/cm³"), H("Reference")],
  [DL("This study (C3)", { bold: true, color: C.accent1 }), D("1.38", HI), DL("—")],
  [DL("Mycelium, cellulose composites"), D("0.3 – 0.8"), DL("Jones et al. 2020")],
  [DL("Fired clay brick"), D("1.6 – 2.0"), DL("William & Owen 1995")],
  [DL("Normal-weight concrete"), D("2.4"), DL("William & Owen 1995")],
], { x: 7.55, y: 4.14, w: 4.85, colW: [2.05, 0.95, 1.85], rowH: 0.35, fontSize: 10.5,
     fontFace: THEME.bodyFontFace, border: { type: "solid", color: "DEDAD1", pt: 1 }, fill: { color: "FFFFFF" }, objectName: "dens-table" });
s.addText("Quoted on a mould-volume basis and therefore a lower bound.",
  S({ x: 7.55, y: 5.99, w: 4.85, h: 0.32, fontSize: 10, italic: true, color: C.accent6 }));
s.addNotes("Three environmental properties together. On fire: ignition at around ten seconds under direct flame, self-extinguishing four seconds after removal, charring local, no lateral spread, and no melting or dripping. The probable mechanism is endothermic carbonate decomposition releasing carbon dioxide, which dilutes the flame front - not verified calorimetrically. And to be explicit: 11925-2 is an ignitability test. No Euroclass, no cone calorimetry, no smoke or toxicity data. On water: 0.7 percent mass gain over twenty-four hours with three shellac coats, with local dissolution where the coating was thin - so coating integrity is the limiting factor, not the composite. On density: 1.38, between the fungal and cellulosic materials below and fired clay above, and quoted on a mould-volume basis so it is a lower bound.");

/* ========== 15 benchmark conventional ========== */
pres.addSection({ title: "Benchmarking" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Benchmarking" });
s.addText("Benchmark I — conventional interior surface materials", { placeholder: "title" });
s.addChart(pres.ChartType.bar, [
  { name: "Compressive strength", labels: ["Compressed\nmushroom panel", "This study\n(C3)", "WPC", "MDF", "Travertine"], values: [1.2, 4.1, 7.2, 24, 80] },
  { name: "Flexural strength",    labels: ["Compressed\nmushroom panel", "This study\n(C3)", "WPC", "MDF", "Travertine"], values: [1.0, 2.3, 12, 35, 11] },
], { x: 0.55, y: 1.3, w: 7.9, h: 4.5, barDir: "col", barGrouping: "clustered",
     chartColors: [THEME.colors.accent4, THEME.colors.accent3],
     showLegend: true, legendPos: "t", legendColor: THEME.colors.accent6, legendFontSize: 11, legendFontFace: "+mn-lt",
     showValue: true, dataLabelPosition: "outEnd", dataLabelColor: THEME.colors.dk1, dataLabelFontSize: 10, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0.0",
     catAxisLabelColor: THEME.colors.accent6, catAxisLabelFontSize: 10, catAxisLabelFontFace: "+mn-lt",
     valAxisLabelColor: THEME.colors.accent6, valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt",
     valAxisTitle: "Strength (MPa)", showValAxisTitle: true, valAxisTitleColor: THEME.colors.accent6,
     valAxisTitleFontSize: 11, valAxisTitleFontFace: "+mn-lt",
     valGridLine: { color: "EDEAE3", size: 1 }, catGridLine: { style: "none" }, objectName: "bench1" });
s.addText("Velasco & Gaona 2011  ·  Klyosov 2007  ·  Nemli & Aydın 2007  ·  Altun 2006",
  S({ x: 0.55, y: 5.88, w: 7.9, h: 0.35, fontSize: 10, italic: true, color: C.accent6 }));
card(s, 8.75, 1.3, 4.0, 4.9, "bench1-read", THEME.colors.accent4);
kicker(s, 9.1, 1.52, 3.3, "POSITION", true);
s.addText([
  { text: "Compressive strength is one sixth that of MDF and one twentieth that of travertine — a stone the material visually resembles.", options: { breakLine: true } },
  { text: " ", options: { fontSize: 9, breakLine: true } },
  { text: "It exceeds compressed mushroom panel, the only other fully bio-based board in this set, by a factor of three.", options: { breakLine: true } },
  { text: " ", options: { fontSize: 9, breakLine: true } },
  { text: "On strength alone, the material does not compete with engineered wood or stone, and this presentation does not claim that it does.", options: { bold: true, color: "F0C9A8" } },
], S({ x: 9.1, y: 1.92, w: 3.3, h: 4.0, fontSize: 12, color: "FFFFFF", lineSpacing: 16 }));
s.addNotes("First benchmark, against the conventional interior materials this would sit alongside. Let me be blunt. Compressive strength is one sixth of MDF and one twentieth of travertine - and travertine is the relevant comparison aesthetically, because the material looks like it. It does beat compressed mushroom panel, which is the only other fully bio-based board in the set, by a factor of three. But on strength alone it does not compete with engineered wood or stone, and I am not going to claim that it does.");

/* ========== 16 benchmark bio-based ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Benchmarking" });
s.addText("Benchmark II — bio-based composites", { placeholder: "title" });
kicker(s, 0.55, 1.2, 6.0, "COMPRESSIVE STRENGTH");
s.addTable([
  [H("Material"), H("σᴄ (MPa)"), H("Reference")],
  [DL("This study (C3)", { bold: true, color: C.accent1 }), D("4.1", HI), DL("—")],
  [DL("Mycelium-based composite"), D("0.145 – 0.452"), DL("Jones et al. 2020")],
  [DL("Hempcrete"), D("0.3 – 0.6"), DL("Arnaud & Gourlay 2012")],
  [DL("Eggshell-filled PLA"), D("2 – 5"), DL("Kim & Pal 2010")],
  [DL("Mineral-filled biocomposite"), D("2.1 – 39.6"), DL("Shah et al. 2016")],
  [DL("30% algae-filled composite"), D("21.3"), DL("Kim & Pal 2010")],
], { x: 0.55, y: 1.54, w: 6.0, colW: [2.75, 1.65, 1.6], rowH: 0.42, fontSize: 11.5,
     fontFace: THEME.bodyFontFace, border: { type: "solid", color: "DEDAD1", pt: 1 }, fill: { color: "FFFFFF" }, objectName: "bio1" });
kicker(s, 6.85, 1.2, 5.9, "ELASTIC MODULUS");
s.addTable([
  [H("Material"), H("E (MPa)"), H("Reference")],
  [DL("This study (F2)", { bold: true, color: C.accent1 }), D("192", HI), DL("—")],
  [DL("Mycelium-based composite"), D("1.8 – 5"), DL("Islam et al. 2018")],
  [DL("Soy-based bioplastic"), D("124"), DL("Mansour et al. 2021")],
  [DL("Corn starch + hemp fibre"), D("158"), DL("Dweib et al. 2004")],
  [DL("Flax-fibre PLA"), D("198"), DL("Faruk et al. 2012")],
  [DL("LDPE"), D("100 – 300"), DL("Zhao et al. 2022")],
  [DL("Wood (pine)"), D("11 000"), DL("Pope & Hudson 1989")],
], { x: 6.85, y: 1.54, w: 5.9, colW: [2.7, 1.6, 1.6], rowH: 0.42, fontSize: 11.5,
     fontFace: THEME.bodyFontFace, border: { type: "solid", color: "DEDAD1", pt: 1 }, fill: { color: "FFFFFF" }, objectName: "bio2" });
card(s, 0.55, 4.7, 12.2, 1.55, "bio-read", THEME.colors.accent4);
kicker(s, 0.9, 4.9, 11.5, "WHERE THE MATERIAL SITS", true);
s.addText([
  { text: "An order of magnitude above the fungal and lime-binder family in compression, and squarely inside the bio-polymer band in stiffness — between soy bioplastic at 124 MPa and flax-fibre PLA at 198 MPa, within the LDPE range. ", options: { color: "FFFFFF" } },
  { text: "A mineral-filled, water-cast, oven-free material reaches the stiffness of melt-processed bio-polymers. Unfilled agar films reported in the packaging literature sit one to two orders of magnitude below this; the mineral phase, not the binder, is carrying the stiffness.", options: { bold: true, color: "F0C9A8" } },
], S({ x: 0.9, y: 5.25, w: 11.5, h: 0.95, fontSize: 12.5, lineSpacing: 17 }));
s.addNotes("Second benchmark, and this is the one that matters. Against the bio-based family the position changes completely. In compression the material is an order of magnitude above mycelium composites and hempcrete - the fungal and lime-binder family. In stiffness it sits squarely inside the bio-polymer band: 192 megapascals, between soy bioplastic at 124 and flax-fibre PLA at 198, inside the LDPE range. I want to underline what that means. This is a water-cast material, dried at room temperature, with no oven and no extrusion - and it reaches the stiffness of melt-processed bio-polymers. Wood is still two orders of magnitude above, and I am not going to pretend otherwise.");

/* ========== 17 modulus of resilience ========== */
s = pres.addSlide({ masterName: "CONTENT_DARK", sectionTitle: "Benchmarking" });
s.addText("A derived property: modulus of resilience", { placeholder: "title" });
card(s, 0.55, 1.3, 5.7, 2.5, "ur", "15302A");
kicker(s, 0.9, 1.52, 5.0, "DEFINITION", true);
s.addText("Ur  =  σꜰ² / 2Eꜰ",
  S({ x: 0.9, y: 1.9, w: 5.0, h: 0.6, fontSize: 24, bold: true, color: "FFFFFF", fontFace: THEME.headFontFace, valign: "middle" }));
s.addText("The elastic strain energy absorbed per unit volume up to the onset of permanent deformation — the area under the stress–strain curve to yield.",
  S({ x: 0.9, y: 2.55, w: 5.0, h: 1.0, fontSize: 12, color: "C7D4C9", lineSpacing: 16 }));
s.addText("Ur  =  2.325² / (2 × 192)  =  0.0141 MPa  =  14.1 kJ/m³",
  S({ x: 0.55, y: 4.0, w: 6.2, h: 0.5, fontSize: 15, bold: true, color: "FFFFFF", fontFace: THEME.headFontFace }));
s.addText("from this study's own measured σꜰ and Eꜰ for F2",
  S({ x: 0.55, y: 4.5, w: 6.2, h: 0.3, fontSize: 11, italic: true, color: "AFC4B7" }));
card(s, 0.55, 4.95, 5.7, 1.5, "ur-point", "15302A");
s.addText("Stiffness sits in the denominator. The low modulus reported as a deficiency in Benchmark I is precisely what raises this quantity.",
  S({ x: 0.9, y: 4.95, w: 5.0, h: 1.5, fontSize: 12.5, bold: true, color: "F0C9A8", valign: "middle", lineSpacing: 17 }));
card(s, 6.6, 1.3, 6.15, 2.45, "ur-why", "15302A");
kicker(s, 6.95, 1.52, 5.45, "WHY IT FITS THIS MATERIAL CLASS", true);
s.addText("Both test programmes produced the same qualitative result: the specimens deformed substantially and retained integrity rather than fracturing. Strength figures record the load at which a material stops performing. They do not record whether it then fails gracefully or catastrophically — which, for a demountable non-loadbearing component, is the behaviour that governs service life.",
  S({ x: 6.95, y: 1.9, w: 5.45, h: 1.75, fontSize: 12, color: "FFFFFF", lineSpacing: 16 }));
card(s, 6.6, 3.95, 6.15, 2.5, "ur-ask", "15302A");
kicker(s, 6.95, 4.17, 5.45, "PROPOSAL, AND ITS CURRENT LIMIT", true);
s.addText("Report σꜰ and Eꜰ from the same specimen set for bio-based materials, so that Ur can be derived. At present it rarely can: the literature reports strength and modulus in separate studies on different formulations, so a comparative Ur table cannot yet be assembled. This value is offered as a single data point and a measurement convention, not as a ranking.",
  S({ x: 6.95, y: 4.55, w: 5.45, h: 1.8, fontSize: 12, color: "C7D4C9", lineSpacing: 16 }));
s.addNotes("This brings me to the fifth research question. The modulus of resilience is the elastic strain energy absorbed per unit volume up to permanent deformation - the area under the curve to yield. Note where stiffness sits: in the denominator. So the low modulus that counted against the material in the first benchmark is exactly what raises this quantity. For F2 it works out at 14.1 kilojoules per cubic metre, from this study's own two measurements. Why does this fit the material class? Because both test programmes gave the same qualitative result - substantial deformation with retained integrity. Strength tells you the load at which a material stops performing. It does not tell you whether it then fails gracefully or catastrophically, and for a demountable non-loadbearing component that is the behaviour that governs service life. Now the honest limit: I cannot give you a comparative table, because the literature reports strength and modulus in separate studies on different formulations. So this is a data point and a measurement convention, not a ranking.");

/* ========== 18 product proposal ========== */
pres.addSection({ title: "Application" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Application" });
s.addText("Product proposal — a modular, demountable interior system", { placeholder: "title" });
s.addImage({ path: G + "11-moduler-sistem.jpeg", x: 0.55, y: 1.3, w: 3.19, h: 2.62, objectName: "modular" });
s.addImage({ path: G + "12-ic-mekan-render.jpeg", x: 0.55, y: 4.12, w: 3.19, h: 2.62, objectName: "render" });
card(s, 3.95, 1.3, 8.8, 2.6, "prop-logic");
kicker(s, 4.3, 1.52, 8.1, "DERIVED FROM THE MEASURED PROPERTIES, NOT IMPOSED ON THEM");
s.addText([
  { text: "Low strength, high deformation capacity  →  ", options: { bold: true, color: C.text2 } },
  { text: "component carries its own weight and handling loads only; no structural duty.", options: { color: C.accent6, breakLine: true } },
  { text: "Self-extinguishing, no dripping  →  ", options: { bold: true, color: C.text2 } },
  { text: "acceptable for interior surfaces away from ignition sources.", options: { color: C.accent6, breakLine: true } },
  { text: "Coating-dependent water resistance  →  ", options: { bold: true, color: C.text2 } },
  { text: "dry interior environments; not wet rooms or facades.", options: { color: C.accent6, breakLine: true } },
  { text: "Repeatable small-format casting  →  ", options: { bold: true, color: C.text2 } },
  { text: "a module, not a sheet. Failure is replaced one unit at a time.", options: { color: C.accent6 } },
], S({ x: 4.3, y: 1.9, w: 8.1, h: 1.9, fontSize: 12, lineSpacing: 18 }));
card(s, 3.95, 4.1, 8.8, 2.6, "prop-sys", THEME.colors.accent4);
kicker(s, 4.3, 4.32, 8.1, "SYSTEM CHARACTERISTICS", true);
s.addText([
  { text: "Reversible assembly — ", options: { bold: true, color: "FFFFFF" } },
  { text: "repeated cast units joined without adhesive, so components can be recovered intact.", options: { color: "D8E2DA", breakLine: true } },
  { text: "Distributed load path — ", options: { bold: true, color: "FFFFFF" } },
  { text: "units interlock and share load across neighbours rather than transferring it through a frame.", options: { color: "D8E2DA", breakLine: true } },
  { text: "Unit replaceability — ", options: { bold: true, color: "FFFFFF" } },
  { text: "a damaged unit is exchanged without dismantling the assembly; no single component is critical.", options: { color: "D8E2DA", breakLine: true } },
  { text: "Formulation-family variation — ", options: { bold: true, color: "FFFFFF" } },
  { text: "colour, texture and format vary from pigments and mould geometry at constant composition.", options: { color: "D8E2DA" } },
], S({ x: 4.3, y: 4.7, w: 8.1, h: 1.9, fontSize: 12, lineSpacing: 18 }));
s.addNotes("The product proposal follows from the measurements rather than being imposed on them. Low strength with high deformation capacity means the component carries its own weight and handling loads and nothing else. Self-extinguishing with no dripping means interior surfaces away from ignition sources. Coating-dependent water resistance means dry interiors, not wet rooms and not facades. And repeatable small-format casting means a module rather than a sheet - which matters, because it means failure is replaced one unit at a time. The system is assembled without adhesive, so it is reversible; units interlock so load distributes across neighbours; a damaged unit is replaceable; and colour and texture vary within a single formulation family.");

/* ========== 19 potentials ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Application" });
s.addText("Potentials for sustainable interiors", { placeholder: "title" });
const pots = [
  ["Waste valorisation at source", "A locally available food-waste stream becomes a surface material without an intermediate industry. The shells for this study came from one bakery."],
  ["Low-energy production", "No oven, no autoclave, no extrusion. A single 55-minute cook near 95 °C, then ambient drying. The thermal budget is a fraction of ceramic or cement-based surfaces."],
  ["End-of-life by design", "Every constituent is biodegradable, including the shellac finish. The material returns to a biological cycle rather than requiring separation and disposal."],
  ["Reversible assembly", "Adhesive-free modular assembly means the material can be recovered intact, so reuse precedes recycling in the hierarchy."],
  ["Replacing a mineral extraction", "The calcium carbonate here substitutes quarried limestone in a surface application, which is a direct displacement rather than a downcycled use."],
  ["Local, low-barrier manufacture", "The protocol requires a grinder, a sieve, a hotplate and silicone moulds. Production can be distributed rather than centralised."],
];
pots.forEach(([h, b], i) => {
  const x = 0.55 + (i % 2) * 6.25, y = 1.3 + Math.floor(i / 2) * 1.72;
  card(s, x, y, 5.95, 1.55, "pot-" + i);
  s.addText(h, S({ x: x + 0.3, y: y + 0.16, w: 5.35, h: 0.32, fontSize: 13.5, bold: true, color: C.text2 }));
  s.addText(b, S({ x: x + 0.3, y: y + 0.52, w: 5.35, h: 0.9, fontSize: 11.5, color: C.accent6, lineSpacing: 15 }));
});
s.addText("No life-cycle assessment was carried out. These are qualitative potentials grounded in the production protocol, not quantified environmental claims.",
  S({ x: 0.55, y: 6.5, w: 12.2, h: 0.35, fontSize: 11.5, italic: true, color: C.accent1 }));
s.addNotes("Six potentials, and I want to be careful to call them potentials. Waste valorisation at source - a local food-waste stream becomes a surface material with no intermediate industry. Low-energy production - no oven, no autoclave, no extrusion; one 55-minute cook and then ambient drying. End-of-life by design - every constituent biodegrades, including the shellac. Reversible assembly, so reuse precedes recycling. A direct displacement of quarried limestone rather than a downcycled use. And low-barrier manufacture: a grinder, a sieve, a hotplate, silicone moulds. One caveat that matters: no life-cycle assessment was carried out, so these are qualitative potentials grounded in the protocol, not quantified environmental claims.");

/* ========== 20 limitations ========== */
pres.addSection({ title: "Closing" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Closing" });
s.addText("Limitations of the study", { placeholder: "title" });
const lims = [
  ["Dispersion not reported", "Means of three specimens per formulation; individual values were not retained, so no standard deviations or coefficients of variation can be given."],
  ["Formulation confound in flexure", "Glycerol, solids concentration and shell-to-binder ratio moved together between F1 and F2. The plasticiser effect is not isolated."],
  ["Section geometry in flexure", "The ASTM D790 calculation treats a kerfed specimen as a solid rectangle. The reported modulus is a lower bound."],
  ["Strain not instrumented", "Compressive strain was derived from an assumed 10% maximum deformation based on observation, not measured directly."],
  ["Shrinkage unquantified", "Post-drying dimensions were not logged. Density is quoted on a mould-volume basis and is a lower bound."],
  ["Process not instrumented", "Manual stirring leaves shear rate and mixing energy uncontrolled. Single laboratory, single operator, no inter-laboratory reproduction."],
  ["No durability data", "No humidity cycling, thermal cycling, UV exposure, microbial resistance or accelerated ageing was performed."],
  ["No fire classification or LCA", "Ignitability only, with no Euroclass determination, and no life-cycle assessment to support the environmental argument."],
];
lims.forEach(([h, b], i) => {
  const x = 0.55 + (i % 2) * 6.25, y = 1.25 + Math.floor(i / 2) * 1.32;
  card(s, x, y, 5.95, 1.17, "lim-" + i);
  s.addText(h, S({ x: x + 0.28, y: y + 0.12, w: 5.4, h: 0.3, fontSize: 12.5, bold: true, color: C.text2 }));
  s.addText(b, S({ x: x + 0.28, y: y + 0.43, w: 5.4, h: 0.68, fontSize: 10.5, color: C.accent6, lineSpacing: 14 }));
});
s.addText("A protocol offered for others to repeat has to state where it is thin. Each of these is addressable, and each defines a specific next experiment.",
  S({ x: 0.55, y: 6.5, w: 12.2, h: 0.35, fontSize: 12, italic: true, color: C.accent1 }));
s.addNotes("I would rather set out the limitations precisely than have them found. Dispersion is not reported. The flexural comparison carries a formulation confound. The D790 calculation treats a kerfed section as solid. Compressive strain was assumed, not instrumented. Shrinkage is unquantified, so density is a lower bound. The process is not instrumented - manual stirring, one laboratory, one operator, no inter-laboratory reproduction. There is no durability data of any kind. And there is no fire classification and no LCA. A protocol offered for others to repeat has to say where it is thin, and each of these defines a specific next experiment rather than a vague caveat.");

/* ========== 21 conclusions ========== */
s = pres.addSlide({ masterName: "CONTENT_DARK", sectionTitle: "Closing" });
s.addText("Conclusions", { placeholder: "title" });
[["01", "A reproducible protocol", "Every parameter required to produce the composite is reported: 120 °C shell treatment, 150 µm fraction, 95 °C dissolution, 80 °C cook, 55 min, silicone casting, 11 days ambient."],
 ["02", "Solids concentration governs strength", "With shell : binder fixed at 2.00, compressive stress is linear in solids concentration across 0.37–0.59 (R² = 0.994, three formulations). Strength is set by packing density."],
 ["03", "Plasticiser sets the brittle–ductile transition", "Between 18.8% and 10.3% glycerol the composite moves from unmeasurable compliance to 2.33 MPa at 192 MPa."],
 ["04", "Bio-polymer stiffness, oven-free", "192 MPa places a water-cast, ambient-dried material inside the band occupied by melt-processed bio-polymers."],
 ["05", "Strength is the wrong sole criterion", "Deformation capacity governs service behaviour for demountable non-loadbearing components. σ and E should be reported together so that Ur can be derived."]]
 .forEach(([n, h, b], i) => {
  const y = 1.25 + i * 1.02;
  s.addText(n, S({ x: 0.55, y, w: 0.65, h: 0.4, fontSize: 17, bold: true, color: "F0C9A8", fontFace: THEME.headFontFace }));
  s.addText(h, S({ x: 1.3, y, w: 3.75, h: 0.75, fontSize: 13.5, bold: true, color: "FFFFFF", lineSpacing: 17 }));
  s.addText(b, S({ x: 5.2, y, w: 7.55, h: 0.9, fontSize: 12, color: "C7D4C9", lineSpacing: 16 }));
});
s.addText("Betül Ünal  ·  Department of Interior Architecture, Cappadocia University  ·  b.unal91@gmail.com",
  S({ x: 0.55, y: 6.42, w: 12.2, h: 0.32, fontSize: 12.5, bold: true, color: "FFFFFF" }));
s.addText("Testing: Advanced Construction Materials Research Laboratory, Hacettepe University, with thanks to Dr Hüseyin İlcan. Derived from the author's doctoral dissertation, Hacettepe University, 2025.",
  S({ x: 0.55, y: 6.74, w: 12.2, h: 0.32, fontSize: 10, italic: true, color: "AFC4B7" }));
s.addNotes("Five conclusions. A reproducible protocol, reported parameter by parameter. Solids concentration, not mineral content, governs compressive strength - linear across the range tested. Plasticiser content sets the brittle-ductile transition, and that transition lies between 18.8 and 10.3 percent glycerol. A water-cast, ambient-dried material reaches bio-polymer stiffness without an oven. And strength alone is the wrong criterion for this class: deformation capacity governs service behaviour, and strength and modulus should be reported together so that the modulus of resilience can be derived. Thank you. I am happy to take questions.");

/* ========== references ========== */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Closing" });
s.addText("Selected references", { placeholder: "title" });
const refs = [
 ["Reviews and state of the art", [
   "Ngayakamo, B. & Onwualu, A.P. (2022). Recent advances in green processing technologies for valorisation of eggshell waste for sustainable construction materials. Heliyon.",
   "Owuamanam, S. & Cree, D. (2020). Progress of bio-calcium carbonate waste eggshell and seashell fillers in polymer composites: a review. Journal of Composites Science, 4(2), 70.",
   "Biogenic calcium carbonate derived from waste shells for advanced material applications: a review (2022). Frontiers in Materials, 9, 1024977." ]],
 ["Agar and bio-polymer systems", [
   "Hernández, V., Ibarra, D., Triana, J.F., Martínez-Soto, B. et al. (2022). Agar biopolymer films for biodegradable packaging: a reference dataset for exploring the limits of mechanical performance. Materials, 15(11), 3954.",
   "Materiom (2026). Open biomaterial recipe commons and property database. materiom.org/data.",
   "Mansour et al. (2021); Dweib et al. (2004); Faruk et al. (2012); Zhao et al. (2022) — bio-polymer elastic moduli." ]],
 ["Comparative material data", [
   "Jones, M. et al. (2020) — mycelium composite density and compressive strength. Islam et al. (2018) — mycelium modulus.",
   "Arnaud, L. & Gourlay, E. (2012) — hempcrete. Kim & Pal (2010) — eggshell-filled PLA. Shah et al. (2016) — mineral-filled biocomposites.",
   "Nemli & Aydın (2007) — MDF. Altun (2006) — travertine. Klyosov (2007) — WPC. Velasco & Gaona (2011) — compressed mushroom panel. Pope & Hudson (1989) — pine." ]],
];
refs.forEach(([h, items], i) => {
  const y = 1.25 + i * 1.78;
  card(s, 0.55, y, 12.2, 1.6, "ref-" + i);
  kicker(s, 0.9, y + 0.14, 11.5, h.toUpperCase());
  s.addText(items.map((x, j) => ({ text: x, options: { bullet: true, breakLine: j < items.length - 1 } })),
    S({ x: 0.9, y: y + 0.46, w: 11.5, h: 1.05, fontSize: 10.5, color: C.accent6, paraSpaceAfter: 3, lineSpacing: 13 }));
});
s.addText("Standards: ASTM D790-17 · ISO 11925-2:2020 · ASTM D570-98(2018).   Full reference list available on request.",
  S({ x: 0.55, y: 6.6, w: 12.2, h: 0.3, fontSize: 10.5, italic: true, color: C.accent6 }));
s.addNotes("Selected references, left up for questions. The standards used are listed at the bottom.");

(async () => {
  await pres.writeFile({ fileName: OUT });
  const { applyTheme } = require("/root/.claude/skills/synced/ed12a668-6f07-4018-aad4-7be975f5699f_093145d0-7b3e-473d-b700-d8211791c264/pptx/scripts/apply_theme.js");
  await applyTheme(OUT, THEME);
  console.log("yazildi");
})();
