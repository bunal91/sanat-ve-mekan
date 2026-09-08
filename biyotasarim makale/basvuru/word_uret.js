// GAZİ MMFD yazım kurallarına uygun Word üretimi
const fs = require('fs');
const path = require('path');
const D = require('docx');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ImageRun,
} = D;

const FONT = 'Times New Roman';
const P9 = 18, P8 = 16;                 // yarım punto
const SATIR = { line: 360, lineRule: 'auto', before: 0, after: 0 }; // 1,5 aralık
const KENAR = 1417;                     // 2,5 cm (twips)
const ICGENISLIK = 11906 - 2 * KENAR;   // A4 kullanılabilir genişlik
const SEKILLER = path.join(__dirname, '..', 'sekiller');

const run = (t, o = {}) => new TextRun({ text: t, font: FONT, size: o.size || P9,
  bold: !!o.bold, italics: !!o.italics });
const par = (t, o = {}) => new Paragraph({
  spacing: SATIR, alignment: o.align || AlignmentType.JUSTIFIED,
  children: Array.isArray(t) ? t : [run(t, o)] });
const bos = () => new Paragraph({ spacing: SATIR, children: [run('')] });

// **kalın**, *italik* ve §(İngilizce)§ işaretlerini TextRun dizisine çevirir.
// §...§ içindeki İngilizce karşılıklar dergi kuralı gereği 8 punto kalın verilir.
function satirParcala(s, size = P9) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|§[^§]+§)/g;
  let son = 0, m;
  while ((m = re.exec(s)) !== null) {
    if (m.index > son) out.push(run(s.slice(son, m.index), { size }));
    const t = m[0];
    if (t.startsWith('**')) out.push(run(t.slice(2, -2), { size, bold: true }));
    else if (t.startsWith('§')) out.push(run(t.slice(1, -1), { size: P8, bold: true }));
    else out.push(run(t.slice(1, -1), { size, italics: true }));
    son = m.index + t.length;
  }
  if (son < s.length) out.push(run(s.slice(son), { size }));
  return out.length ? out : [run(s, { size })];
}

// --- markdown çizelgesi -> docx tablosu ---
function tabloYap(satirlar) {
  const hucre = (s) => s.trim().replace(/^\||\|$/g, '').split('|').map((x) => x.trim());
  const basliklar = hucre(satirlar[0]);
  const govde = satirlar.slice(2).map(hucre);
  const n = basliklar.length;
  const gen = Math.floor(ICGENISLIK / n);
  const sut = Array(n).fill(gen);
  sut[n - 1] = ICGENISLIK - gen * (n - 1);

  const kenarlik = (alt) => ({
    top: { style: alt ? BorderStyle.SINGLE : BorderStyle.NONE, size: 6, color: '000000' },
    bottom: { style: BorderStyle.SINGLE, size: alt ? 6 : 4, color: '000000' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  });

  const satirYap = (hucreler, basliksa) => new TableRow({
    children: hucreler.map((h, i) => new TableCell({
      width: { size: sut[i], type: WidthType.DXA },
      borders: kenarlik(basliksa),
      margins: { top: 40, bottom: 40, left: 60, right: 60 },
      children: [new Paragraph({
        spacing: { line: 240, lineRule: 'auto', before: 0, after: 0 },
        children: satirParcala(h, P9) })],
    })),
  });

  return new Table({
    columnWidths: sut,
    width: { size: ICGENISLIK, type: WidthType.DXA },
    rows: [satirYap(basliklar, true), ...govde.map((r) => satirYap(r, false))],
  });
}

// --- şekil ---
function sekilYap(dosya, cmGenislik) {
  const yol = path.join(SEKILLER, dosya);
  const png = fs.readFileSync(yol);
  // PNG başlığından piksel boyutu
  const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
  const gen = Math.round((cmGenislik / 2.54) * 96);
  const yuk = Math.round(gen * (h / w));
  return new Paragraph({
    spacing: SATIR, alignment: AlignmentType.CENTER,
    children: [new ImageRun({ type: 'png', data: png,
      transformation: { width: gen, height: yuk } })],
  });
}

module.exports = { D, FONT, P9, P8, SATIR, KENAR, ICGENISLIK, run, par, bos,
  satirParcala, tabloYap, sekilYap };
