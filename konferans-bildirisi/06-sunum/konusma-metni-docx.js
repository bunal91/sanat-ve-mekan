const fs = require("fs");
const d = require("docx");
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
        Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
        LevelFormat, convertInchesToTwip } = d;

const SRC = "/home/user/sanat-ve-mekan/konferans-bildirisi/06-sunum/konusma-metni.md";
const OUT = "/home/user/sanat-ve-mekan/konferans-bildirisi/06-sunum/ICSMMEP26_Konusma_Metni.docx";
const F = "Calibri";
const ACC = "B4513A", INK = "141414", GREY = "8C8C8C", LINE = "D9D9D9", PANEL = "F7F6F4";

/* inline **bold** / *italic* -> runs */
function runs(text, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(new TextRun({ text: text.slice(last, m.index), font: F, ...base }));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(new TextRun({ text: tok.slice(2, -2), font: F, bold: true, ...base }));
    else out.push(new TextRun({ text: tok.slice(1, -1), font: F, italics: true, ...base }));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(new TextRun({ text: text.slice(last), font: F, ...base }));
  return out.length ? out : [new TextRun({ text: "", font: F, ...base })];
}

const RULE = () => new Paragraph({
  spacing: { before: 200, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE, space: 1 } },
  children: [new TextRun({ text: "", font: F, size: 2 })],
});

const raw = fs.readFileSync(SRC, "utf8").split("\n");

/* fold wrapped markdown lines into blocks */
const blocks = [];
let buf = [];
const flush = () => { if (buf.length) { blocks.push({ t: "p", v: buf.join(" ") }); buf = []; } };
for (let i = 0; i < raw.length; i++) {
  const l = raw[i].replace(/\s+$/, "");
  if (l.trim() === "") { flush(); continue; }
  if (l.startsWith("## ")) { flush(); blocks.push({ t: "h2", v: l.slice(3) }); continue; }
  if (l.startsWith("# "))  { flush(); blocks.push({ t: "h1", v: l.slice(2) }); continue; }
  if (l.trim() === "---")  { flush(); blocks.push({ t: "rule" }); continue; }
  if (l.startsWith("|"))   { flush(); blocks.push({ t: "tr", v: l }); continue; }
  if (/^\s*-\s/.test(l))   { flush(); blocks.push({ t: "li", v: l.replace(/^\s*-\s/, "") }); continue; }
  if (/^\s+\d+\.\s/.test(l)) { flush(); blocks.push({ t: "oli", v: l.replace(/^\s+\d+\.\s/, "") }); continue; }
  if (/^\s{4,}\S/.test(l) && blocks.length && ["li","oli"].includes(blocks[blocks.length-1].t)) {
    blocks[blocks.length-1].v += " " + l.trim(); continue;
  }
  buf.push(l.trim());
}
flush();

/* group consecutive table rows */
const kids = [];
for (let i = 0; i < blocks.length; i++) {
  const b = blocks[i];
  if (b.t === "tr") {
    const rows = [];
    while (i < blocks.length && blocks[i].t === "tr") {
      const cells = blocks[i].v.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
      if (!cells.every(c => /^-*$/.test(c))) rows.push(cells);
      i++;
    }
    i--;
    const cols = Math.max(...rows.map(r => r.length));
    const total = convertInchesToTwip(6.3);
    const w = Math.floor(total / cols);
    kids.push(new Table({
      columnWidths: Array(cols).fill(w),
      width: { size: w * cols, type: WidthType.DXA },
      borders: {
        top:{style:BorderStyle.SINGLE,size:2,color:LINE}, bottom:{style:BorderStyle.SINGLE,size:2,color:LINE},
        left:{style:BorderStyle.SINGLE,size:2,color:LINE}, right:{style:BorderStyle.SINGLE,size:2,color:LINE},
        insideHorizontal:{style:BorderStyle.SINGLE,size:2,color:LINE}, insideVertical:{style:BorderStyle.SINGLE,size:2,color:LINE},
      },
      rows: rows.map(r => new TableRow({
        children: Array.from({ length: cols }, (_, c) => new TableCell({
          width: { size: w, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: "FFFFFF", color: "auto" },
          margins: { top: 60, bottom: 60, left: 110, right: 110 },
          children: [new Paragraph({ spacing: { before: 0, after: 0, line: 260 },
            children: runs(r[c] ?? "", { size: 20, color: INK }) })],
        })),
      })),
    }));
    kids.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: "", font: F, size: 2 })] }));
    continue;
  }
  if (b.t === "rule") { kids.push(RULE()); continue; }
  if (b.t === "h1") {
    kids.push(new Paragraph({
      spacing: { before: 320, after: 140 }, keepNext: true,
      border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: INK, space: 4 } },
      children: [new TextRun({ text: b.v, font: F, bold: true, size: 30, color: INK })],
    }));
    continue;
  }
  if (b.t === "h2") {
    kids.push(new Paragraph({
      spacing: { before: 300, after: 110 }, keepNext: true,
      children: [new TextRun({ text: b.v, font: F, bold: true, size: 26, color: ACC })],
    }));
    continue;
  }
  if (b.t === "li" || b.t === "oli") {
    kids.push(new Paragraph({
      numbering: { reference: b.t === "li" ? "dash" : "num", level: 0 },
      spacing: { before: 0, after: 90, line: 300 },
      children: runs(b.v, { size: 23, color: INK }),
    }));
    continue;
  }
  /* stage direction */
  if (/^\[.*\]$/.test(b.v.trim())) {
    kids.push(new Paragraph({
      spacing: { before: 60, after: 140, line: 300 },
      children: [new TextRun({ text: b.v.trim(), font: F, italics: true, size: 21, color: GREY })],
    }));
    continue;
  }
  kids.push(new Paragraph({
    spacing: { before: 0, after: 130, line: 300 },
    children: runs(b.v, { size: 23, color: INK }),
  }));
}

const doc = new Document({
  creator: "Betül Ünal",
  title: "ICSMMEP-26 — Konuşma Metni",
  numbering: {
    config: [
      { reference: "dash", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 340, hanging: 200 } } } }] },
      { reference: "num", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 620, hanging: 220 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { margin: { top: 1130, bottom: 1130, left: 1250, right: 1250 } } },
    children: kids,
  }],
});

Packer.toBuffer(doc).then(b => { fs.writeFileSync(OUT, b); console.log("yazildi", OUT, b.length, "bayt"); });
