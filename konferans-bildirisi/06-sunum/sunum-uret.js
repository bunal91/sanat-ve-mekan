const pptxgen = require("pptxgenjs");
const G = "/home/user/sanat-ve-mekan/konferans-bildirisi/03-gorseller/";

const THEME = {
  name: "Eggshell Biocomposite",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1A1A18", lt1: "FFFFFF",
    dk2: "1B3B2F", lt2: "EFE9DC",
    accent1: "C9622F", accent2: "5E8C6A", accent3: "8C7B5E",
    accent4: "2E5F4A", accent5: "B8A98C", accent6: "6E6B64",
    hlink: "C9622F", folHlink: "8C7B5E",
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";            // 13.3 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = "Betul Unal";
pres.title  = "Eggshell-Agar Biocomposites for Sustainable Interior Applications";
const C = pres.SchemeColor;

const FOOT = "ICSMMEP-26  |  Mecca, 3-4 November 2026  |  B. Unal, Cappadocia University";

/* ---------------- layouts ---------------- */
pres.defineSlideMaster({
  title: "TITLE_DARK", background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 1.5, w: 7.3, h: 2.6,
        fontSize: 34, bold: true, color: C.background1, valign: "bottom", align: "left" }, text: " " } },
    { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 4.35, w: 7.3, h: 1.9,
        fontSize: 15, color: "D8E2DA", valign: "top" }, text: " " } },
  ],
});

pres.defineSlideMaster({
  title: "SECTION_DARK", background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.9, y: 3.15, w: 11.5, h: 1.1,
        fontSize: 38, bold: true, color: C.background1, valign: "middle", align: "left" }, text: " " } },
    { placeholder: { options: { name: "body", type: "body", x: 0.95, y: 4.3, w: 11.5, h: 0.5,
        fontSize: 16, color: "AFC4B7", valign: "top" }, text: " " } },
  ],
});

const contentObjs = (bg, titleColor, footColor) => ([
  { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.42, w: 12.1, h: 0.85,
      fontSize: 31, bold: true, color: titleColor, valign: "middle", align: "left" }, text: " " } },
  { text: { text: FOOT, options: { x: 0.6, y: 6.92, w: 10.6, h: 0.3, fontSize: 9,
      color: footColor, isTextBox: true, margin: 0, valign: "middle" } } },
  { placeholder: { options: { name: "slideNumber", type: "sldNum", x: 12.35, y: 6.92, w: 0.4, h: 0.3,
      fontSize: 9, color: footColor, align: "right" } } },
]);

pres.defineSlideMaster({ title: "CONTENT", background: { color: C.background1 },
  objects: contentObjs(C.background1, C.text2, "9A978F") });
pres.defineSlideMaster({ title: "CONTENT_DARK", background: { color: C.text2 },
  objects: contentObjs(C.text2, C.background1, "7E937F") });

/* ---------------- helpers ---------------- */
const S = (s, o = {}) => Object.assign({ isTextBox: true, margin: 0 }, o);

function statBlock(slide, x, y, w, value, label, valColor) {
  slide.addText(value, S(value, { x, y, w, h: 0.78, fontSize: 40, bold: true,
    color: valColor || C.accent1, fontFace: THEME.headFontFace, valign: "bottom", objectName: "stat-" + label }));
  slide.addText(label, S(label, { x, y: y + 0.82, w, h: 0.55, fontSize: 12, color: C.accent6, valign: "top" }));
}

function numberedStep(slide, x, y, w, n, head, body, dark) {
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: 0.42, h: 0.42,
    fill: { color: C.accent1 }, objectName: "step-dot-" + n });
  slide.addText(String(n), S(String(n), { x, y, w: 0.42, h: 0.42, fontSize: 13, bold: true,
    color: "FFFFFF", align: "center", valign: "middle" }));
  slide.addText(head, S(head, { x: x + 0.6, y: y - 0.02, w: w - 0.6, h: 0.34, fontSize: 15, bold: true,
    color: dark ? C.background1 : C.text2, valign: "middle" }));
  slide.addText(body, S(body, { x: x + 0.6, y: y + 0.32, w: w - 0.6, h: 0.62, fontSize: 12,
    color: dark ? "C7D4C9" : C.accent6, valign: "top" }));
}

function card(slide, x, y, w, h, name) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.06,
    fill: { color: C.background2 }, line: { color: C.background2 }, objectName: name });
}

/* =================== SLIDES =================== */

/* 1 — title */
pres.addSection({ title: "Opening" });
let s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Opening" });
s.addImage({ path: G + "01-prototip-cesitlemeleri.jpeg", x: 8.3, y: 1.55, w: 4.4, h: 2.47, objectName: "hero" });
s.addText("Development and Characterisation of Eggshell–Agar Biocomposites for Sustainable Interior Applications",
  { placeholder: "title" });
s.addText([
  { text: "Betül Ünal", options: { bold: true, color: "FFFFFF", fontSize: 17, breakLine: true } },
  { text: "Department of Interior Architecture, Cappadocia University, Nevşehir, Türkiye", options: { breakLine: true } },
  { text: " ", options: { fontSize: 7, breakLine: true } },
  { text: "ICSMMEP-26  ·  Mecca, Saudi Arabia  ·  3–4 November 2026", options: { color: "AFC4B7" } },
], { placeholder: "body" });
s.addNotes("Good morning. My name is Betul Unal, from the Department of Interior Architecture at Cappadocia University. Today I want to talk about a biocomposite made from eggshell waste - and about why the way we measure such materials may be hiding their most useful property.");

/* 2 — waste stream */
pres.addSection({ title: "Problem" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Problem" });
s.addText("A waste stream in search of a binder", { placeholder: "title" });
s.addImage({ path: G + "03-uretim-sureci.jpeg", x: 0.6, y: 4.55, w: 7.2, h: 2.3, objectName: "process" });
s.addText([
  { text: "Eggshell is produced as food waste in millions of tonnes each year. It is roughly 94% calcium carbonate, and its porous shell structure is mechanically useful.", options: { breakLine: true } },
  { text: " ", options: { fontSize: 8, breakLine: true } },
  { text: "The shells for this study came from one bakery in Ankara, collected over more than a year.", options: { bold: true, color: C.text2 } },
], S("", { x: 0.6, y: 1.5, w: 7.2, h: 1.9, fontSize: 15, color: C.accent6, lineSpacing: 22 }));
card(s, 8.4, 1.5, 4.3, 5.0, "facts-card");
s.addText("Composition of eggshell", S("", { x: 8.75, y: 1.75, w: 3.6, h: 0.4, fontSize: 13, bold: true, color: C.text2 }));
[["94%", "calcium carbonate"], ["4%", "organic matter"], ["1%", "calcium phosphate"], ["1%", "magnesium carbonate"]]
  .forEach(([v, l], i) => {
    s.addText(v, S(v, { x: 8.75, y: 2.3 + i * 1.0, w: 1.1, h: 0.45, fontSize: 22, bold: true,
      color: C.accent1, fontFace: THEME.headFontFace, valign: "middle" }));
    s.addText(l, S(l, { x: 9.95, y: 2.3 + i * 1.0, w: 2.4, h: 0.45, fontSize: 12, color: C.accent6, valign: "middle" }));
  });
s.addNotes("Eggshell is one of the most abundant food waste streams we have. Chemically it is almost pure calcium carbonate, and that is why it keeps appearing in the materials literature. For this study, all shells came from a single bakery, collected over more than a year - which is itself a point about local waste streams.");

/* 3 — the gap */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Problem" });
s.addText("The filler was already bio-based. The binder was not", { placeholder: "title" });
card(s, 0.6, 1.5, 5.85, 4.95, "lit-card");
s.addText("Eggshell in the literature", S("", { x: 0.95, y: 1.75, w: 5.2, h: 0.4, fontSize: 14, bold: true, color: C.text2 }));
s.addText([
  { text: "Cement and concrete replacement", options: { bullet: true, breakLine: true } },
  { text: "Asphalt binder modification", options: { bullet: true, breakLine: true } },
  { text: "Soil stabilisation, replacing lime", options: { bullet: true, breakLine: true } },
  { text: "Ceramic tile and wallpaper production", options: { bullet: true, breakLine: true } },
  { text: "Filler in PLA, epoxy, PVC and polyurethane", options: { bullet: true, breakLine: true } },
  { text: "Reinforcement in metal and ceramic composites", options: { bullet: true, breakLine: true } },
  { text: "Bio-calcium carbonate for wall tiles and paper", options: { bullet: true } },
], S("", { x: 0.95, y: 2.3, w: 5.2, h: 3.1, fontSize: 13.5, color: C.accent6, paraSpaceAfter: 7 }));
s.addText("In every case the matrix stays petrochemical or clinker-based.",
  S("", { x: 0.95, y: 5.55, w: 5.2, h: 0.6, fontSize: 14, bold: true, italic: true, color: C.accent1 }));
s.addShape(pres.ShapeType.rightArrow, { x: 6.62, y: 3.72, w: 0.55, h: 0.45, fill: { color: C.accent5 }, line: { color: C.accent5 }, objectName: "arrow" });
s.addShape(pres.ShapeType.roundRect, { x: 7.35, y: 1.5, w: 5.35, h: 4.95, rectRadius: 0.06,
  fill: { color: C.accent4 }, line: { color: C.accent4 }, objectName: "this-card" });
s.addText("This study", S("", { x: 7.7, y: 1.75, w: 4.7, h: 0.4, fontSize: 14, bold: true, color: "FFFFFF" }));
s.addText([
  { text: "Filler:  ", options: { bold: true, color: "FFFFFF" } },
  { text: "waste eggshell powder", options: { color: "D8E2DA", breakLine: true } },
  { text: " ", options: { fontSize: 9, breakLine: true } },
  { text: "Binder:  ", options: { bold: true, color: "FFFFFF" } },
  { text: "agar and glycerol", options: { color: "D8E2DA", breakLine: true } },
  { text: " ", options: { fontSize: 9, breakLine: true } },
  { text: "Finish:  ", options: { bold: true, color: "FFFFFF" } },
  { text: "shellac", options: { color: "D8E2DA" } },
], S("", { x: 7.7, y: 2.5, w: 4.7, h: 2.7, fontSize: 16 }));
s.addText("Both phases are biological and biodegradable.",
  S("", { x: 7.7, y: 5.55, w: 4.7, h: 0.6, fontSize: 14, bold: true, italic: true, color: "F0C9A8" }));
s.addNotes("This is the gap. Eggshell has been used widely - but almost always as a mineral filler suspended in a synthetic matrix: epoxy, PLA, PVC, or cement. The waste is valorised; the binder is not. In this study both the filler and the binder are biological.");

/* 4 — the material */
pres.addSection({ title: "Protocol" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Protocol" });
s.addText("Four components, all biodegradable", { placeholder: "title" });
s.addImage({ path: G + "01-prototip-cesitlemeleri.jpeg", x: 5.7, y: 1.6, w: 7.0, h: 3.94, objectName: "variants" });
[["Eggshell powder", "Mineral phase. Sieved to 150 µm."],
 ["Agar", "Seaweed polysaccharide. Thermoreversible gel."],
 ["Glycerol", "Plasticiser. Governs ductility."],
 ["Water", "Carrier. Governs final density."]].forEach(([h, b], i) => {
  s.addText(h, S(h, { x: 0.6, y: 1.62 + i * 1.08, w: 4.8, h: 0.34, fontSize: 15, bold: true, color: C.text2 }));
  s.addText(b, S(b, { x: 0.6, y: 1.96 + i * 1.08, w: 4.8, h: 0.6, fontSize: 12, color: C.accent6 }));
});
s.addText("Prototype variations in colour, texture and format. Natural pigments including beetroot were trialled.",
  S("", { x: 5.7, y: 5.68, w: 7.0, h: 0.5, fontSize: 11, italic: true, color: C.accent6 }));
s.addNotes("The material has four components. Eggshell powder is the mineral phase. Agar, from seaweed, is the binder - it is thermoreversible, so it melts and sets repeatedly. Glycerol is the plasticiser, and as we will see it is the single most influential variable. Water is the carrier and governs the final density.");

/* 5 — why protocol */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Protocol" });
s.addText("Why the protocol is the contribution", { placeholder: "title" });
numberedStep(s, 0.6, 1.6, 7.3, 1, "No shared procedures exist",
  "Designer-led biofabrication has no standard protocol. Each study starts from scratch.");
numberedStep(s, 0.6, 2.9, 7.3, 2, "So the process stays trial and error",
  "Finding a workable formulation takes months of iteration that nobody else can reuse.");
numberedStep(s, 0.6, 4.2, 7.3, 3, "And results cannot be compared",
  "Without recorded parameters, two studies of the same material are not comparable at all.");
s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 5.6, w: 7.3, h: 0.85, rectRadius: 0.06,
  fill: { color: C.background2 }, line: { color: C.background2 }, objectName: "claim" });
s.addText("This paper reports every parameter needed to reproduce the material.",
  S("", { x: 0.95, y: 5.6, w: 6.6, h: 0.85, fontSize: 14, bold: true, color: C.text2, valign: "middle" }));
s.addImage({ path: G + "02-panel-elde.png", x: 8.4, y: 1.6, w: 4.3, h: 4.18, objectName: "panel" });
s.addText("Cast panel, 300 mm square", S("", { x: 8.4, y: 5.9, w: 4.3, h: 0.35, fontSize: 11, italic: true, color: C.accent6 }));
s.addNotes("I want to be clear about what the contribution is. It is not that eggshell can be used - that is known. It is that this particular process is written down completely enough to be repeated. In designer-led biofabrication that is rare, and it is why results in this field are so hard to compare.");

/* 6 — protocol: shell */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Protocol" });
s.addText("Preparing the shell fraction", { placeholder: "title" });
const steps6 = [["Clean", "Membrane and organic residue removed"],
                ["Heat treat", "120 °C for 20 minutes, for decontamination and drying"],
                ["Cool and dry", "To room temperature, then dried until no residual moisture"],
                ["Mill", "Laboratory mechanical grinder, until visually homogeneous"],
                ["Sieve", "150 µm mesh; only the passing fraction is used"]];
steps6.forEach(([h, b], i) => numberedStep(s, 0.6, 1.62 + i * 1.0, 7.3, i + 1, h, b));
s.addImage({ path: G + "03-uretim-sureci.jpeg", x: 8.4, y: 2.5, w: 4.3, h: 1.37, objectName: "shells" });
statBlock(s, 8.4, 4.2, 2.0, "120 °C", "heat treatment");
statBlock(s, 10.6, 4.2, 2.1, "150 µm", "sieve aperture");
s.addNotes("The shell preparation is straightforward but the parameters matter. Note the heat treatment: 120 degrees for 20 minutes. I describe this as decontamination and drying rather than sterilisation, because dry heat sterilisation needs far higher temperatures and we did not verify sterility. The 150 micrometre sieve is consistent with eggshell powder procedures in the composite literature.");

/* 7 — protocol: binder */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Protocol" });
s.addText("Preparing the binder phase", { placeholder: "title" });
[["Combine", "Water and glycerol, stirred until homogeneous"],
 ["Add agar", "Introduced gradually under continuous stirring to prevent agglomeration"],
 ["Dissolve", "Heated to 95 °C until the agar is fully in solution"],
 ["Hold", "Reduced to 80 °C and cooked at that temperature, stirring throughout"],
 ["Add the mineral", "Shell fraction added incrementally near the end of cooking"]]
 .forEach(([h, b], i) => numberedStep(s, 0.6, 1.62 + i * 1.0, 7.5, i + 1, h, b));
card(s, 8.55, 1.75, 4.15, 4.3, "binder-stats");
s.addText("Key parameters", S("", { x: 8.9, y: 2.0, w: 3.5, h: 0.35, fontSize: 13, bold: true, color: C.text2 }));
statBlock(s, 8.9, 2.5, 3.5, "95 °C", "agar dissolution");
statBlock(s, 8.9, 3.65, 3.5, "80 °C", "controlled cooking");
statBlock(s, 8.9, 4.8, 3.5, "55 min", "total heating time");
s.addText("Stirring was manual throughout, so shear rate is not controlled. This is stated as a limitation.",
  S("", { x: 0.6, y: 6.3, w: 7.5, h: 0.5, fontSize: 11, italic: true, color: C.accent1 }));
s.addNotes("The binder is a two-stage thermal regime. Agar is dissolved at 95 degrees, then the temperature drops to 80 and the mixture is held there while viscosity develops. Total heating time is 55 minutes. The mineral goes in near the end, at 80 degrees - adding it earlier causes sedimentation. I should say openly that stirring was manual, so shear rate is uncontrolled. That is a reproducibility limit, and also an honest reflection of a studio process rather than a laboratory one.");

/* 8 — casting */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Protocol" });
s.addText("Casting, drying and consolidation", { placeholder: "title" });
[["Cast", "Poured into silicone moulds and spread to uniform thickness. Silicone flexes, so no release agent is needed."],
 ["Set in mould", "Four days for initial setting and drying"],
 ["Demould", "Removed once the specimen holds its form"],
 ["Consolidate", "A further seven days under ambient conditions, shielded from direct sun and air movement"]]
 .forEach(([h, b], i) => numberedStep(s, 0.6, 1.66 + i * 1.3, 7.4, i + 1, h, b));
s.addShape(pres.ShapeType.roundRect, { x: 8.4, y: 1.66, w: 4.3, h: 3.25, rectRadius: 0.06,
  fill: { color: "F6E8DF" }, line: { color: "F6E8DF" }, objectName: "shrink-note" });
s.addText("Dimensional loss", S("", { x: 8.75, y: 1.92, w: 3.6, h: 0.35, fontSize: 13, bold: true, color: C.accent1 }));
s.addText("The material shrinks appreciably as the water phase evaporates. Post-drying dimensions were not recorded in this study; the dimensions reported here are mould dimensions. Future work using this protocol should measure specimens after drying, not at casting.",
  S("", { x: 8.75, y: 2.35, w: 3.6, h: 2.4, fontSize: 12.5, color: C.text2, lineSpacing: 17 }));
statBlock(s, 8.4, 5.25, 2.0, "23 °C", "ambient drying");
statBlock(s, 10.6, 5.25, 2.1, "11 days", "mould to finished");
s.addNotes("Casting is in silicone moulds, which flex enough to release without any agent. Four days in the mould, then seven more days consolidating. One honest point: the material shrinks noticeably as water leaves, and we did not record the dried dimensions. The dimensions I quote are mould dimensions. Anyone repeating this should measure after drying.");

/* 9 — formulations */
pres.addSection({ title: "Results" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Results" });
s.addText("Formulations characterised", { placeholder: "title" });
const hdr = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: C.accent4 }, align: "center", valign: "middle" } });
const cel = (t, o = {}) => ({ text: t, options: Object.assign({ align: "center", valign: "middle", color: C.text1 }, o) });
s.addTable([
  [hdr("Test"), hdr("ID"), hdr("Water (g)"), hdr("Eggshell (g)"), hdr("Agar (g)"), hdr("Glycerol (g)"), hdr("Outcome")],
  [cel("Compression"), cel("C1"), cel("325"), cel("80"),  cel("35"), cel("5"),  cel("2.55 MPa")],
  [cel("Compression"), cel("C2"), cel("310"), cel("90"),  cel("40"), cel("5"),  cel("3.12 MPa")],
  [cel("Compression"), cel("C3"), cel("280"), cel("110"), cel("45"), cel("10"), cel("4.10 MPa", { bold: true, color: C.accent1 })],
  [cel("Flexure"),     cel("F1"), cel("450"), cel("190"), cel("70"), cel("60"), cel("not measurable", { italic: true })],
  [cel("Flexure"),     cel("F2"), cel("480"), cel("190"), cel("70"), cel("30"), cel("2.33 MPa", { bold: true, color: C.accent1 })],
], { x: 0.6, y: 1.75, w: 12.1, colW: [1.9, 0.75, 1.5, 1.75, 1.3, 1.75, 3.15], rowH: 0.52,
     fontSize: 13, fontFace: THEME.bodyFontFace, border: { type: "solid", color: "DEDAD1", pt: 1 },
     fill: { color: "FFFFFF" }, objectName: "formulation-table" });
s.addText("Three specimens were tested per formulation. Values reported are means; individual specimen values were not retained, so standard deviations are not available.",
  S("", { x: 0.6, y: 5.1, w: 12.1, h: 0.5, fontSize: 12, italic: true, color: C.accent6 }));
s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 5.75, w: 12.1, h: 0.75, rectRadius: 0.06,
  fill: { color: C.background2 }, line: { color: C.background2 }, objectName: "read" });
s.addText([
  { text: "Two relationships hold across the set:  " , options: { bold: true, color: C.text2 } },
  { text: "less water with more mineral and agar raises load capacity; halving glycerol turns an unmeasurably ductile material into a measurable one.", options: { color: C.accent6 } },
], S("", { x: 0.95, y: 5.75, w: 11.4, h: 0.75, fontSize: 13, valign: "middle" }));
s.addNotes("These are the five formulations. Read down the compression rows: water falls, mineral and agar rise, and strength rises with them. The two flexural rows differ only in glycerol - sixty grams against thirty. At sixty the material was too ductile for the machine to register anything at all.");

/* 10 — compression */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Results" });
s.addText("Compression: it crushes without disintegrating", { placeholder: "title" });
s.addImage({ path: G + "04-basma-ficilasmis-kup.jpeg", x: 0.6, y: 1.6, w: 2.2, h: 4.77, objectName: "cube" });
s.addImage({ path: G + "05b-basma-egrisi.png", x: 3.3, y: 1.98, w: 4.95, h: 2.77, objectName: "comp-curve" });
s.addText("Compressive stress \u2013 strain", S("", { x: 3.3, y: 1.62, w: 4.95, h: 0.3, fontSize: 12, bold: true, color: C.text2 }));
s.addText("Stress (MPa)", S("", { x: 2.62, y: 2.9, w: 1.3, h: 0.3, fontSize: 10, color: C.accent6, rotate: 270 }));
s.addText("Strain", S("", { x: 3.3, y: 4.78, w: 4.95, h: 0.3, fontSize: 10, color: C.accent6, align: "center" }));
s.addText("Barrelled specimen, still in one piece", S("", { x: 0.6, y: 6.42, w: 2.4, h: 0.35, fontSize: 10, italic: true, color: C.accent6 }));
card(s, 8.45, 1.6, 4.25, 4.0, "comp-stats");
statBlock(s, 8.8, 1.85, 3.5, "4.10 MPa", "mean compressive strength, C3");
statBlock(s, 8.8, 3.15, 3.5, "6.80 kN", "maximum load at failure");
statBlock(s, 8.8, 4.45, 3.5, "~1.4 g/cm³", "density, below brick and concrete");
s.addText("Past peak load the stress does not collapse. The specimen keeps deforming while holding together, which is energy absorption rather than fracture.",
  S("", { x: 3.3, y: 5.3, w: 4.95, h: 1.2, fontSize: 13.5, color: C.text2, lineSpacing: 18 }));
s.addNotes("Here is the compression result. Mean strength of the best formulation is 4.1 megapascals. But look at the curve rather than the number: after the peak, stress does not drop away. The specimen goes on deforming while holding together. And look at the photograph - the cube has barrelled, it is shorter and wider, and it is still a single object. That is ductile crushing, not brittle failure. Hold that thought.");

/* 11 — flexure */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Results" });
s.addText("Flexure: glycerol governs everything", { placeholder: "title" });
s.addImage({ path: G + "06-egilme-buyuk-sehim.jpg", x: 0.6, y: 1.6, w: 2.15, h: 4.78, objectName: "bend" });
s.addImage({ path: G + "08b-yivli-panel-kemer.jpg", x: 3.0, y: 1.62, w: 1.75, h: 2.45, objectName: "arch" });
s.addText("Kerfed panel arched by hand", S("", { x: 3.0, y: 4.12, w: 2.95, h: 0.3, fontSize: 10, italic: true, color: C.accent6 }));
s.addImage({ path: G + "09b-egilme-egrisi.png", x: 3.0, y: 4.85, w: 2.95, h: 1.67, objectName: "flex-curve" });
s.addText("Flexural stress \u2013 strain  (MPa / strain)", S("", { x: 3.0, y: 4.53, w: 3.3, h: 0.28, fontSize: 11, bold: true, color: C.text2 }));
card(s, 6.35, 1.6, 6.35, 2.55, "flex-stats");
statBlock(s, 6.7, 1.8, 2.7, "2.33 MPa", "flexural strength, F2");
statBlock(s, 9.6, 1.8, 2.8, "192 MPa", "flexural modulus");
s.addText("At 60 g glycerol the specimen was too ductile to register a reading. At 30 g it became measurable while still flexing.",
  S("", { x: 6.7, y: 3.15, w: 5.7, h: 0.75, fontSize: 12, color: C.accent6, lineSpacing: 17 }));
s.addShape(pres.ShapeType.roundRect, { x: 6.35, y: 4.3, w: 6.35, h: 1.95, rectRadius: 0.06,
  fill: { color: "F6E8DF" }, line: { color: "F6E8DF" }, objectName: "kerf-note" });
s.addText("A note on the cross-section", S("", { x: 6.7, y: 4.5, w: 5.7, h: 0.32, fontSize: 13, bold: true, color: C.accent1 }));
s.addText("The specimen carries transverse kerfs on its tension face, visible in both photographs. ASTM D790 assumes a solid rectangular section, and the calculation here uses the full 60 × 20 mm. Part of the measured compliance is therefore geometric, not material.",
  S("", { x: 6.7, y: 4.88, w: 5.7, h: 1.3, fontSize: 11.5, color: C.text2, lineSpacing: 15 }));
s.addNotes("Flexure, tested to ASTM D790. The decisive variable is glycerol. At sixty grams the beam simply would not register - it deformed without resisting. Halve the glycerol and you get 2.33 megapascals at a modulus of 192. Now, I want to point something out before anyone else does: look at the underside of the beam. It is kerfed. ASTM D790 assumes a solid rectangle and my calculation uses the full twenty millimetre depth. So some of the compliance I am reporting is geometry, not material. That needs to be resolved in further work.");

/* 12 — fire and water */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Results" });
s.addText("Fire and water response", { placeholder: "title" });
s.addImage({ path: G + "10-alev-testi.png", x: 0.6, y: 1.6, w: 2.3, h: 4.98, objectName: "flame" });
card(s, 3.3, 1.6, 4.55, 4.3, "fire-card");
s.addText("Single-flame ignitability", S("", { x: 3.65, y: 1.85, w: 3.9, h: 0.35, fontSize: 14, bold: true, color: C.text2 }));
s.addText("ISO 11925-1, 15 s flame at 45°", S("", { x: 3.65, y: 2.2, w: 3.9, h: 0.3, fontSize: 11, italic: true, color: C.accent6 }));
statBlock(s, 3.65, 2.65, 3.9, "~10 s", "to ignition");
statBlock(s, 3.65, 3.85, 3.9, "4 s", "to self-extinguish after flame removal");
s.addText("Charring stayed local. No flame spread, no melting, no dripping.",
  S("", { x: 3.65, y: 5.15, w: 3.9, h: 0.6, fontSize: 12, color: C.text2, lineSpacing: 17 }));
card(s, 8.2, 1.6, 4.5, 4.3, "water-card");
s.addText("Water absorption", S("", { x: 8.55, y: 1.85, w: 3.8, h: 0.35, fontSize: 14, bold: true, color: C.text2 }));
s.addText("ASTM D570, 24 h full immersion", S("", { x: 8.55, y: 2.2, w: 3.8, h: 0.3, fontSize: 11, italic: true, color: C.accent6 }));
statBlock(s, 8.55, 2.65, 3.8, "0.7%", "mass gain, shellac-coated");
s.addText("Shellac is a natural, biodegradable, hydrophobic resin, applied here in three coats. Where the coating was thin, surface loss occurred. Coating integrity is the limiting factor for any humid application.",
  S("", { x: 8.55, y: 3.8, w: 3.8, h: 1.9, fontSize: 12, color: C.text2, lineSpacing: 17 }));
s.addNotes("Two environmental tests. On fire: the material ignites at about ten seconds under direct flame, and self-extinguishes four seconds after the flame is removed. Charring stays where the flame touched - no spread, and importantly no melting or dripping, which is what you worry about with polymer-based materials. On water: with three coats of shellac, 0.7 percent mass gain over twenty-four hours of full immersion. The coating is doing the work there, and where it was thin the surface dissolved. So coating integrity is the real variable.");

/* 13 — judged by strength */
pres.addSection({ title: "Argument" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Argument" });
s.addText("Judged by strength, this material is weak", { placeholder: "title" });
s.addChart(pres.ChartType.bar, [
  { name: "Compressive strength", labels: ["Mushroom panel", "This study", "WPC", "MDF", "Travertine"], values: [1.2, 4.1, 7.2, 24, 80] },
  { name: "Flexural strength",   labels: ["Mushroom panel", "This study", "WPC", "MDF", "Travertine"], values: [1.0, 2.3, 12, 35, 11] },
], { x: 0.6, y: 1.65, w: 8.0, h: 4.6, barDir: "col", barGrouping: "clustered",
     chartColors: [THEME.colors.accent4, THEME.colors.accent3],
     showLegend: true, legendPos: "t", legendColor: THEME.colors.accent6, legendFontSize: 11, legendFontFace: "+mn-lt",
     showValue: true, dataLabelPosition: "outEnd", dataLabelColor: THEME.colors.dk1,
     dataLabelFontSize: 10, dataLabelFontFace: "+mn-lt",
     catAxisLabelColor: THEME.colors.accent6, catAxisLabelFontSize: 11, catAxisLabelFontFace: "+mn-lt",
     valAxisLabelColor: THEME.colors.accent6, valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt",
     valAxisTitle: "MPa", showValAxisTitle: true, valAxisTitleColor: THEME.colors.accent6,
     valAxisTitleFontSize: 11, valAxisTitleFontFace: "+mn-lt",
     valGridLine: { color: "EDEAE3", size: 1 }, catGridLine: { style: "none" },
     objectName: "strength-chart" });
s.addText("Sources: Velasco & Gaona 2011; Klyosov 2007; Nemli & Aydın 2007; Altun 2006",
  S("", { x: 0.6, y: 6.32, w: 8.0, h: 0.35, fontSize: 10, italic: true, color: C.accent6 }));
s.addShape(pres.ShapeType.roundRect, { x: 8.9, y: 1.65, w: 3.8, h: 4.6, rectRadius: 0.06,
  fill: { color: C.background2 }, line: { color: C.background2 }, objectName: "verdict" });
s.addText("On the conventional criterion the conclusion is simple.",
  S("", { x: 9.25, y: 1.95, w: 3.1, h: 0.8, fontSize: 14, bold: true, color: C.text2, lineSpacing: 19 }));
s.addText("It is one sixth the compressive strength of MDF and one twentieth that of travertine — a stone it happens to resemble.",
  S("", { x: 9.25, y: 2.85, w: 3.1, h: 1.5, fontSize: 12.5, color: C.accent6, lineSpacing: 18 }));
s.addText("So we stop here, and the material is filed as not strong enough.",
  S("", { x: 9.25, y: 4.5, w: 3.1, h: 1.5, fontSize: 12.5, italic: true, color: C.accent1, lineSpacing: 18 }));
s.addNotes("So let us be blunt about where this material stands on the usual measure. Against MDF it has one sixth the compressive strength. Against travertine, one twentieth - and travertine is interesting here because the material actually resembles it visually, porous and pale. On strength alone, this is where the conversation normally ends. The material is filed under not strong enough, and we move on.");

/* 14 — judged by deformation */
s = pres.addSlide({ masterName: "CONTENT_DARK", sectionTitle: "Argument" });
s.addText("But strength is not the only thing worth measuring", { placeholder: "title" });
s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 1.6, w: 5.6, h: 2.15, rectRadius: 0.06,
  fill: { color: "16noop" === "x" ? "000000" : "15302A" }, line: { color: "2E5F4A" }, objectName: "formula-card" });
s.addText("Modulus of resilience", S("", { x: 0.95, y: 1.8, w: 4.9, h: 0.32, fontSize: 13, bold: true, color: "AFC4B7" }));
s.addText("Ur  =  σf²  /  2E", S("", { x: 0.95, y: 2.15, w: 4.9, h: 0.6, fontSize: 26, bold: true,
  color: "FFFFFF", fontFace: THEME.headFontFace, valign: "middle" }));
s.addText("The elastic energy a material absorbs per unit volume before it takes permanent damage.",
  S("", { x: 0.95, y: 2.85, w: 4.9, h: 0.7, fontSize: 12, color: "C7D4C9", lineSpacing: 17 }));
s.addText("A low stiffness raises this value. The property reported as a weakness is what produces it.",
  S("", { x: 0.6, y: 3.95, w: 5.6, h: 0.85, fontSize: 14, bold: true, color: "F0C9A8", lineSpacing: 19 }));
s.addText("2.33²  /  (2 × 192)  =  14.1 kJ/m³", S("", { x: 0.6, y: 4.95, w: 5.6, h: 0.5, fontSize: 17, bold: true,
  color: "FFFFFF", fontFace: THEME.headFontFace }));
s.addText("for the formulation measured here",
  S("", { x: 0.6, y: 5.45, w: 5.6, h: 0.35, fontSize: 11, italic: true, color: "AFC4B7" }));
s.addImage({ path: G + "04-basma-ficilasmis-kup.jpeg", x: 6.7, y: 1.6, w: 1.75, h: 3.79, objectName: "cube2" });
s.addImage({ path: G + "06-egilme-buyuk-sehim.jpg", x: 8.7, y: 1.6, w: 1.7, h: 3.78, objectName: "bend2" });
s.addText("Neither specimen fractured. Both absorbed load and kept their integrity — the behaviour strength figures do not capture.",
  S("", { x: 6.7, y: 5.55, w: 3.7, h: 1.1, fontSize: 12, color: "C7D4C9", lineSpacing: 17 }));
s.addShape(pres.ShapeType.roundRect, { x: 10.7, y: 1.6, w: 2.0, h: 3.79, rectRadius: 0.06,
  fill: { color: "15302A" }, line: { color: "2E5F4A" }, objectName: "ask" });
s.addText("The proposal", S("", { x: 10.95, y: 1.85, w: 1.55, h: 0.35, fontSize: 13, bold: true, color: "F0C9A8" }));
s.addText("Report this value for bio-based materials. Almost no study currently does, so the comparative set does not yet exist.",
  S("", { x: 10.95, y: 2.3, w: 1.55, h: 2.9, fontSize: 12, color: "FFFFFF", lineSpacing: 17 }));
s.addNotes("Here is the reframe. The modulus of resilience is a standard quantity in materials science: the elastic energy a material absorbs per unit volume before permanent damage. Notice the formula. Stiffness is in the denominator. So low stiffness - the thing reported as a deficiency on the previous slide - is precisely what raises this value. For this material it comes to about 14 kilojoules per cubic metre. Now I have to be honest: I cannot give you a full comparison table, because almost nobody reports this quantity for bio-based materials. Both the strength and the modulus have to come from the same source, and that pairing mostly does not exist in the literature. So this is a proposal, not a finished ranking. But the photographs make the case qualitatively - neither specimen fractured.");

/* 15 — where it fits */
pres.addSection({ title: "Closing" });
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Closing" });
s.addText("Where a material like this belongs", { placeholder: "title" });
s.addImage({ path: G + "12-ic-mekan-render.jpeg", x: 0.6, y: 1.6, w: 5.6, h: 4.59, objectName: "render" });
s.addImage({ path: G + "11-moduler-sistem.jpeg", x: 6.6, y: 1.6, w: 2.75, h: 2.26, objectName: "modular" });
[["Non-loadbearing surfaces", "Panels, cladding and partitions, where stiffness is not the governing requirement"],
 ["Modular and demountable systems", "Components designed to be reconfigured rather than to last unchanged"],
 ["Temporary and exhibition structures", "Short service life, where biodegradability is an advantage, not a defect"]]
 .forEach(([h, b], i) => {
  s.addText(h, S(h, { x: 9.65, y: 1.62 + i * 1.55, w: 3.05, h: 0.6, fontSize: 14, bold: true, color: C.text2, lineSpacing: 17 }));
  s.addText(b, S(b, { x: 9.65, y: 2.22 + i * 1.55, w: 3.05, h: 1.0, fontSize: 11.5, color: C.accent6, lineSpacing: 15 }));
});
s.addText("Modular interior proposal developed from the material's measured properties, from the author's doctoral research.",
  S("", { x: 0.6, y: 6.32, w: 8.7, h: 0.35, fontSize: 10, italic: true, color: C.accent6 }));
s.addNotes("I am not proposing this as a structural material, and I want to say that plainly. Its place is in non-loadbearing surfaces, in modular systems designed to be taken apart and reconfigured, and in temporary structures where a short service life and biodegradability are advantages rather than defects. The images are from the modular interior proposal in my doctoral work, which was developed from these measured properties rather than imposed on them.");

/* 16 — limitations */
s = pres.addSlide({ masterName: "CONTENT", sectionTitle: "Closing" });
s.addText("What this study does not establish", { placeholder: "title" });
const lims = [
  ["Three specimens, means only", "Individual specimen values were not retained, so no standard deviations are reported."],
  ["Shrinkage not recorded", "Dimensions quoted are mould dimensions; the dried cross-section was measured at test time but not logged."],
  ["Kerfed section treated as solid", "The ASTM D790 calculation assumes a full rectangular section, so some compliance is geometric."],
  ["No long-term data", "Humidity cycling, temperature cycling and microbial resistance were not tested."],
  ["One laboratory, one operator", "Stirring was manual; the process has not been reproduced elsewhere."],
  ["Prototype scale only", "The design proposal was never built at full scale or occupied."],
];
lims.forEach(([h, b], i) => {
  const x = 0.6 + (i % 2) * 6.25, y = 1.7 + Math.floor(i / 2) * 1.62;
  card(s, x, y, 5.85, 1.42, "lim-" + i);
  s.addText(h, S(h, { x: x + 0.3, y: y + 0.14, w: 5.25, h: 0.34, fontSize: 13.5, bold: true, color: C.text2 }));
  s.addText(b, S(b, { x: x + 0.3, y: y + 0.5, w: 5.25, h: 0.78, fontSize: 11.5, color: C.accent6, lineSpacing: 15 }));
});
s.addText("Stating these is part of the contribution: a protocol that others are meant to repeat has to say where it is thin.",
  S("", { x: 0.6, y: 6.3, w: 12.1, h: 0.4, fontSize: 12, italic: true, color: C.accent1 }));
s.addNotes("I would rather name the gaps myself than have them found. Three specimens, means only, no standard deviations. Shrinkage measured at test time but not logged. The kerfed section treated as solid in the D790 calculation. No long-term, humidity or microbial data. One laboratory, one operator, manual stirring. And prototype scale only. If the contribution is a protocol others are meant to repeat, then saying where it is thin is part of the contribution.");

/* 17 — conclusion */
s = pres.addSlide({ masterName: "SECTION_DARK", sectionTitle: "Closing" });
s.addText("Thank you", { placeholder: "title" });
s.addText("Questions welcome", { placeholder: "body" });
[["01", "A complete protocol", "Every parameter needed to reproduce an eggshell–agar biocomposite is reported."],
 ["02", "Measured, with limits stated", "4.10 MPa compressive, 2.33 MPa flexural, self-extinguishing, 0.7% water uptake."],
 ["03", "A criterion worth changing", "Deformation capacity, not strength alone, is what makes this class of material useful."]]
 .forEach(([n, h, b], i) => {
  const x = 0.9 + i * 3.95;
  s.addText(n, S(n, { x, y: 0.75, w: 3.5, h: 0.5, fontSize: 20, bold: true, color: "F0C9A8", fontFace: THEME.headFontFace }));
  s.addText(h, S(h, { x, y: 1.25, w: 3.5, h: 0.4, fontSize: 15, bold: true, color: "FFFFFF" }));
  s.addText(b, S(b, { x, y: 1.68, w: 3.5, h: 0.95, fontSize: 12, color: "C7D4C9", lineSpacing: 16 }));
});
s.addText("Betül Ünal  ·  Cappadocia University  ·  b.unal91@gmail.com",
  S("", { x: 0.9, y: 5.15, w: 11.5, h: 0.35, fontSize: 14, bold: true, color: "FFFFFF" }));
s.addText("With thanks to the Advanced Construction Materials Research Laboratory, Hacettepe University, and to Dr Hüseyin İlcan. Derived from the author's doctoral dissertation, Hacettepe University, 2025.",
  S("", { x: 0.9, y: 5.6, w: 11.5, h: 0.8, fontSize: 11, italic: true, color: "AFC4B7", lineSpacing: 15 }));
s.addNotes("To close with three things. First, a complete protocol - every parameter needed to make this material again. Second, measurement with the limits stated honestly. Third, and the part I would most like to leave you with: for this class of material, deformation capacity rather than strength alone is what determines whether it is useful. My thanks to the Advanced Construction Materials Research Laboratory at Hacettepe, and to Dr Ilcan. I am happy to take questions.");

(async () => {
  await pres.writeFile({ fileName: "/tmp/claude-0/-home-user-sanat-ve-mekan/083887b3-c080-5d69-a4cb-b10c492fdc94/scratchpad/deck/ICSMMEP26_Presentation_Unal.pptx" });
  const { applyTheme } = require("/root/.claude/skills/synced/ed12a668-6f07-4018-aad4-7be975f5699f_093145d0-7b3e-473d-b700-d8211791c264/pptx/scripts/apply_theme.js");
  await applyTheme("/tmp/claude-0/-home-user-sanat-ve-mekan/083887b3-c080-5d69-a4cb-b10c492fdc94/scratchpad/deck/ICSMMEP26_Presentation_Unal.pptx", THEME);
  console.log("yazildi");
})();
