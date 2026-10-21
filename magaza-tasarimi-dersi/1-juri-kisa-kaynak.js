const d = require("docx");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
  LevelFormat, convertMillimetersToTwip, VerticalAlign
} = d;

const FONT = "Calibri";
const HDR  = "44546A";
const ZEB  = "F2F4F6";
const ACC  = "8C3A2B";
const LINE = "BFC7CF";
const CW   = 9638;

const P = (text, o = {}) => new Paragraph({
  alignment: o.al || AlignmentType.LEFT,
  spacing: { before: o.before || 0, after: o.after === undefined ? 100 : o.after, line: o.line || 276 },
  children: [new TextRun({ text, font: FONT, size: o.sz || 20, bold: !!o.b, italics: !!o.i,
                           color: o.c || "1A1A1A" })]
});
const RUNS = (parts, o = {}) => new Paragraph({
  alignment: o.al || AlignmentType.LEFT,
  spacing: { before: o.before || 0, after: o.after === undefined ? 100 : o.after, line: o.line || 276 },
  children: parts.map(p => new TextRun({ text: p[0], font: FONT, size: p[2] || o.sz || 20,
    bold: !!(p[1] && p[1].includes("b")), italics: !!(p[1] && p[1].includes("i")),
    color: (p[1] && p[1].includes("a")) ? ACC : (p[1] && p[1].includes("m")) ? "5A6270" : "1A1A1A" }))
});
const H1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 340, after: 150 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ACC, space: 4 } },
  children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: "1A1A1A" })]
});
const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 240, after: 90 },
  children: [new TextRun({ text, font: FONT, size: 22, bold: true, color: ACC })]
});
const BUL = (text, o = {}) => new Paragraph({
  numbering: { reference: "mermi", level: 0 },
  spacing: { after: 50, line: 264 },
  children: [new TextRun({ text, font: FONT, size: o.sz || 20, bold: !!o.b, color: "1A1A1A" })]
});
const NUM = (text) => new Paragraph({
  numbering: { reference: "sayi", level: 0 },
  spacing: { after: 50, line: 264 },
  children: [new TextRun({ text, font: FONT, size: 20 })]
});
const SPACE = (h) => new Paragraph({ spacing: { after: h || 120 }, children: [] });

function cell(text, o = {}) {
  const parts = Array.isArray(text) ? text : [text];
  return new TableCell({
    width: { size: o.w, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: "auto" } : undefined,
    verticalAlign: VerticalAlign.TOP,
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    columnSpan: o.span,
    children: parts.map((t, i) => new Paragraph({
      spacing: { after: i === parts.length - 1 ? 0 : 40, line: 250 },
      alignment: o.al || AlignmentType.LEFT,
      children: [new TextRun({ text: t, font: FONT, size: o.sz || 18,
        bold: o.b || (o.bFirst && i === 0), color: o.c || (o.head ? "FFFFFF" : "1A1A1A") })]
    }))
  });
}
function table(colWidths, rows) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: colWidths,
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 4, color: LINE },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      left:   { style: BorderStyle.SINGLE, size: 4, color: LINE },
      right:  { style: BorderStyle.SINGLE, size: 4, color: LINE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: LINE },
      insideVertical:   { style: BorderStyle.SINGLE, size: 4, color: LINE }
    },
    rows
  });
}
function headRow(labels, widths) {
  return new TableRow({ tableHeader: true,
    children: labels.map((l, i) => cell(l, { w: widths[i], fill: HDR, head: true, b: true, sz: 18 })) });
}
/* kutu: tek hücreli tablo — paragraf kenarlığı şema hatası verdiği için */
function box(lines, o = {}) {
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [CW],
    borders: {
      top:    { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left:   { style: BorderStyle.SINGLE, size: 18, color: o.c || ACC },
      right:  { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical:   { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
    },
    rows: [new TableRow({ children: [new TableCell({
      width: { size: CW, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: o.fill || "F7F3F1", color: "auto" },
      margins: { top: 130, bottom: 130, left: 180, right: 160 },
      children: lines.map((t, i) => new Paragraph({
        spacing: { after: i === lines.length - 1 ? 0 : 70, line: 272 },
        children: [new TextRun({ text: t, font: FONT, size: 20,
          bold: i === 0 && !!o.bFirst, color: "1A1A1A" })]
      }))
    })]})]
  });
}
const body = [];
const SH = (t) => new Paragraph({
  spacing: { before: 240, after: 80 },
  children: [new TextRun({ text: t, font: FONT, size: 22, bold: true, color: ACC })] });
const B = (t, o = {}) => new Paragraph({
  numbering: { reference: "mermi", level: 0 },
  spacing: { after: 30, line: 258 },
  children: [new TextRun({ text: t, font: FONT, size: 19, bold: !!o.b, color: "1A1A1A" })] });

body.push(new Paragraph({ spacing: { after: 30 },
  children: [new TextRun({ text: "KAPADOKYA ÜNİVERSİTESİ · İÇ MİMARLIK VE ÇEVRE TASARIMI", font: FONT,
    size: 17, bold: true, color: ACC, characterSpacing: 30 })] }));
body.push(new Paragraph({ spacing: { after: 50 },
  children: [new TextRun({ text: "IMC 301 — 1. JÜRİ (KONSEPT JÜRİSİ)", font: FONT, size: 32, bold: true })] }));
body.push(new Paragraph({ spacing: { after: 140 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACC, space: 7 } },
  children: [new TextRun({ text: "Tarih: 10 Kasım 2026, Salı  ·  Sunum: 10 dk + 10 dk eleştiri  ·  Mersin Marina",
    font: FONT, size: 20, color: "5A6270" })] }));
body.push(P("Pafta: A1 dikey (59,4 × 84,1 cm), verilen şablon üzerine. İstediğiniz sayıda pafta — hepsi aynı boyut ve aynı yön. Plan ve kesitler 1/100. Basılı teslim zorunlu, ayrıca tek PDF.", { sz: 19, after: 60 }));
body.push(box(["Üç zoning alternatifinden birini seçmiş olarak geleceksiniz. Bu jüri seçimin savunulduğu jüridir."]));

body.push(SH("1 · KONSEPT"));
B2 = B;
["Konsept metni — en çok 150 kelime, tek paragraf",
 "Anahtar kelimeler — en çok 5, her birinin yanında tek cümlelik mekânsal karşılığı",
 "Marka anahtarı — kimlik, hedef kitle, rakiplerinden farkı",
 "Kullanıcı profilleri — en az iki farklı kullanıcı"].forEach(t => body.push(B(t)));

body.push(SH("2 · ANALİZ"));
["Alan analizi özeti — en az beş “bulgu → karar” çifti (rüzgâr, güneş, insan hareketi, gürültü, manzara)",
 "Mevcut mekânın okunması, kendi çiziminizle: kolon ve kiriş aksları, iki cam cephe ve kapılar, ışıklık, çatının alçaldığı yön",
 "Kotlar: bitmiş zemin +1.07 · kiriş altı +5.75 · asma kat döşemesi +6.55 · asma kat sınırı x ≤ 11,19 m",
 "Kısıtlar listesi — değiştiremeyecekleriniz ve her birinin nasıl fırsata döndüğü"].forEach(t => body.push(B(t)));

body.push(SH("3 · MEKÂNSAL KURGU"));
["Güncellenmiş ihtiyaç programı, m² ile (mevcut alan 262 m²)",
 "Seçilen tek zoning alternatifi, büyük ölçekte",
 "Elenen iki alternatif, küçük ölçekte, altlarında ikişer cümle gerekçe",
 "1/100 zemin kat planı — giriş, vitrin, sirkülasyon, satış, deneme, kasa, depo, personel, merdiven",
 "1/100 asma kat planı — döşeme sınırı, galeri boşluğu, korkuluk, merdivenin varışı",
 "1/100 en az bir kesit — asma katı, galeri boşluğunu ve merdiveni kesen",
 "Düşey organizasyon diyagramı — hangi işlev hangi katta, neden"].forEach(t => body.push(B(t)));

body.push(SH("4 · ASMA KAT ETÜDÜ  (zorunlu — eksikse değerlendirme yapılmaz)"));
["Asma kat döşemesinin kotu ve asma kat alanı",
 "Galeri boşluğunun alanı ve oranı — asma katın en çok 1/3’ü",
 "Merdiven tipi, konumu, rıht ve basamak ölçüsü (5,48 m → 32 rıht × 17,13 cm, basamak 28 cm)",
 "Baş üstü kontrolü: merdivenin geçtiği her yerde, asma katın altında ve üstünde 2,20 m",
 "Döşeme boşluğunun tek bir ızgara gözü içinde kaldığının gösterimi — boşluk kirişi kesemez"].forEach(t => body.push(B(t)));

body.push(SH("5 · DENEYİM"));
["Müşteri yolculuğu haritası — seçilen plan üzerine işlenmiş",
 "Meydan ilişkisi — mağazanın dışarıdan algısı, eskiz veya şematik görünüş",
 "Eşik ve ilk algı — girişten tek bir göz hizası eskizi"].forEach(t => body.push(B(t)));

body.push(SH("6 · ATMOSFER"));
["Konsept panosu / moodboard — her görselin yanında tek kelimelik etiket",
 "Malzeme ve renk yönü — 3–5 malzeme, 3–4 renk",
 "Elle çizilmiş en az bir iç mekân eskizi veya şematik aksonometri"].forEach(t => body.push(B(t)));

body.push(SH("PAFTA KURALLARI"));
["Verilen şablon kullanılacak; başlık bloğu ve alt bant değiştirilmeyecek",
 "Her paftada pafta no (1/4, 2/4 …), her çizimde ölçek çubuğu, kuzey oku ve lejant",
 "Her diyagramın ve çizimin altında en az bir cümle açıklama",
 "Gövde yazısı en az 10 punto, tek yazı ailesi",
 "Dijital teslim: tek PDF, jüri sabahı 09.00’a kadar — IMC301_Ad-Soyad_1Juri.pdf"].forEach(t => body.push(B(t)));

body.push(SH("KABUL EDİLMEYENLER"));
["Yapay zekâ ile üretilmiş görsel, metin, diyagram veya çizim",
 "Mevcut yapıyı değiştiren çizimler: kolon kaldırmak, kabuğu veya cephe açıklığını değiştirmek",
 "Ölçeksiz ya da ölçeği belirtilmemiş plan ve kesit",
 "Seçim yapılmadan üç alternatifin birlikte sunulması",
 "Maket ve bilgisayar görselleştirmesi bu jüride istenmiyor"].forEach(t => body.push(B(t)));

const doc = new Document({
  creator: "Kapadokya Üniversitesi · İç Mimarlık ve Çevre Tasarımı",
  title: "IMC 301 — 1. Jüri (Konsept Jürisi) İstenenler",
  numbering: { config: [
    { reference: "mermi", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 320, hanging: 190 } }, run: { font: FONT, size: 19 } } }] },
    { reference: "sayi", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 240 } }, run: { font: FONT, size: 19 } } }] }
  ]},
  sections: [{ properties: { page: { margin: {
      top: convertMillimetersToTwip(18), bottom: convertMillimetersToTwip(16),
      left: convertMillimetersToTwip(19), right: convertMillimetersToTwip(19) } } }, children: body }]
});
Packer.toBuffer(doc).then(b => {
  require("fs").writeFileSync("1-Juri-Istenenler-Kisa.docx", b); console.log("ok");
});
