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

/* ---------------- başlık ---------------- */
body.push(new Paragraph({ spacing: { after: 40 },
  children: [new TextRun({ text: "KAPADOKYA ÜNİVERSİTESİ", font: FONT, size: 20, bold: true,
    color: ACC, characterSpacing: 40 })] }));
body.push(P("Mimarlık, Tasarım ve Güzel Sanatlar Fakültesi · İç Mimarlık ve Çevre Tasarımı Bölümü",
  { sz: 19, c: "5A6270", after: 220 }));
body.push(new Paragraph({ spacing: { after: 60 },
  children: [new TextRun({ text: "MEKÂNSAL PROGRAM VE BÖLGELEME", font: FONT, size: 34, bold: true })] }));
body.push(new Paragraph({ spacing: { after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACC, space: 8 } },
  children: [new TextRun({ text: "İç Mimari Proje III  ·  Mersin Marina  ·  2026–2027 Güz",
    font: FONT, size: 24, color: "5A6270" })] }));

/* ---------------- giriş ---------------- */
body.push(H1("Bu aşamada ne yapıyoruz"));
body.push(P("Markanızı seçtiniz, alanı analiz ettiniz. Şimdi ikisini birleştiriyoruz: markanın ihtiyaç duyduğu işlevleri tanımlayıp bunları mevcut mağaza planına yerleştirmenin farklı yollarını deneyeceğiz."));
body.push(P("Sıra şu: önce neyin gerektiğini yazacaksınız, sonra bu işlevlerin birbiriyle ilişkisini kuracaksınız, sonra bunları gerçek planın üzerine üç farklı biçimde oturtacaksınız, en sonunda kullanıcının bu mekânda yaşadığı deneyimi diyagrama dökeceksiniz."));
body.push(SPACE(60));
body.push(box([
  "Bu hafta kesin bir plan beklemiyoruz. Doğru soruları sormuş alternatifler bekliyoruz."
]));

/* ---------------- 1 ---------------- */
body.push(H1("Çalışma 1 · Mekânsal ihtiyaç programı"));
body.push(P("Markanızın mağazasında hangi işlevlerin bulunması gerektiğini listeleyin. Her işlev için beş başlığı da doldurun:", { after: 80 }));
["İşlevin neden gerekli olduğu — markanın hangi özelliği ya da hangi satış biçimi bunu zorunlu kılıyor?",
 "Kim tarafından kullanılacağı — müşteri mi, personel mi, ikisi birden mi?",
 "Yaklaşık alan ihtiyacı veya alan önceliği — kesin m² veremiyorsanız öncelik yazın (yüksek / orta / düşük).",
 "Hangi işlevlere yakın olması gerektiği",
 "Hangi işlevlerden ayrılması gerektiği"].forEach(x => body.push(BUL(x)));
body.push(SPACE(100));

const W1 = [1900, 1900, 1300, 1400, 1569, 1569];
body.push(table(W1, [
  headRow(["İşlev", "Neden gerekli", "Kim kullanıyor", "Alan / öncelik", "Yakın olmalı", "Ayrı olmalı"], W1),
  ...[0,1,2,3].map(i => new TableRow({ children: W1.map(w =>
    cell(" ", { w, fill: i % 2 ? ZEB : undefined })) }))
]));
body.push(SPACE(100));
body.push(box([
  "İşlev listesi her markada aynı olmaz. Deneme gerektiren bir üründe kabin ve ayna, üretimi görünür bir markada tezgâh ya da atölye, kırılgan bir üründe kontrollü teşhir öne çıkar. Listeyi markanızdan türetin, hazır bir şablondan değil."
], { fill: "F4F6F8", c: HDR }));

/* ---------------- 2 ---------------- */
body.push(H1("Çalışma 2 · Bubble diagram"));
body.push(P("Soru: hangi işlevler birbiriyle ilişkili?", { b: true, after: 90 }));
body.push(P("İşlevleri baloncuklarla gösterin."));
["Baloncuğun boyutu yaklaşık alan ihtiyacını ya da önemini anlatır.",
 "Baloncuklar arasındaki yakınlık ve çizgi mekânsal ilişkiyi anlatır."].forEach(x => body.push(BUL(x)));
body.push(SPACE(80));
body.push(box([
  "Bu aşamada duvar, mobilya veya kesin geometri çizilmez.",
  "Bubble diagram bir plan değildir. Baloncuğun kâğıttaki yeri, o işlevin plandaki yeri anlamına gelmez."
], { bFirst: true }));
body.push(SPACE(60));
body.push(P("Ölçeksizdir, elle çizilebilir.", { sz: 19, c: "5A6270" }));

/* ---------------- 3 ---------------- */
body.push(H1("Çalışma 3 · Komşuluk tablosu (adjacency matrix)"));
body.push(P("Soru: hangi ilişkiler zorunlu?", { b: true, after: 90 }));
body.push(P("Basit bir ilişki tablosu hazırlayın: işlevleri hem satıra hem sütuna yazın, kesişimleri kodlayın.", { after: 80 }));
body.push(P("●  zorunlu          ○  istenir          –  nötr          ✕  olmamalı", { b: true, after: 120 }));

const W3 = [2638, 1750, 1750, 1750, 1750];
body.push(table(W3, [
  headRow(["", "Giriş / eşik", "Sergileme", "Kasa", "Depo"], W3),
  new TableRow({ children: [cell("Karşılama", { w: W3[0], b: true, fill: ZEB }),
    cell("●", { w: W3[1], al: AlignmentType.CENTER, fill: ZEB }),
    cell("", { w: W3[2], fill: ZEB }), cell("", { w: W3[3], fill: ZEB }), cell("", { w: W3[4], fill: ZEB })] }),
  new TableRow({ children: [cell("Müşteri alanı", { w: W3[0], b: true }),
    cell("", { w: W3[1] }), cell("", { w: W3[2] }), cell("", { w: W3[3] }),
    cell("✕", { w: W3[4], al: AlignmentType.CENTER })] }),
  new TableRow({ children: [cell("Personel alanı", { w: W3[0], b: true, fill: ZEB }),
    cell("", { w: W3[1], fill: ZEB }), cell("?", { w: W3[2], al: AlignmentType.CENTER, fill: ZEB }),
    cell("", { w: W3[3], fill: ZEB }), cell("", { w: W3[4], fill: ZEB })] })
]));
body.push(SPACE(100));
body.push(P("Yukarıdaki üç satır örnektir; tabloyu kendi işlev listenizle kurun.", { sz: 19, c: "5A6270", after: 120 }));
["Giriş ile karşılama arasındaki ilişki güçlüdür.",
 "Stok ile müşteri alanı arasındaki ilişki kontrollü olmalıdır.",
 "Personel alanı ile ana sergileme alanı arasındaki ilişki markanın işletme modeline göre değişir — üretimi görünür bir markada bu ilişki açık, başka bir markada kapalı olabilir."
].forEach(x => body.push(BUL(x)));
body.push(SPACE(60));
body.push(P("En çok işe yarayan kod \"olmamalı\"dır. Hangi iki işlevin yan yana gelmemesi gerektiğini bilmek, planı birçok yanlış karardan korur.", { b: true }));
/* ---------------- 4 ---------------- */
body.push(H1("Çalışma 4 · Zoning: aynı planda üç farklı alternatif"));
body.push(box(["Bu haftanın en önemli tasarım egzersizi budur."]));
body.push(SPACE(100));
body.push(P("Mevcut plan altlığının üzerinde üç farklı bölgeleme alternatifi geliştirin.", { after: 90 }));
["Üçünde de aynı plan altlığı kullanılacak.",
 "Üçünde de aynı renk kodları kullanılacak — satış, teşhir, deneyim, kasa, depo, personel gibi. Lejant üç paftada da aynı olacak.",
 "Her alternatifin farklı bir yerleşim mantığı olacak; aynı fikrin üç varyasyonu değil.",
 "Her alternatifin altına iki cümlelik gerekçe yazılacak: bu kurgu markanın hangi özelliğinden çıkıyor?"
].forEach(x => body.push(BUL(x)));
body.push(SPACE(60));
body.push(P("Aynı altlık ve aynı renk kodları, alternatiflerin birbiriyle karşılaştırılabilmesi için zorunludur. Tek alternatif getiren öğrenci bu çalışmayı yapmamış sayılır — amaç en iyi şemayı ilk denemede bulmak değil, üçünü yan yana koyup tartışabilmek."));

/* ---------------- 5 ---------------- */
body.push(H1("Çalışma 5 · Müşteri yolculuğu ve mekân ilişkisi"));
body.push(P("Marka araştırmanızı mekânsal deneyimle bağlayan bir kullanıcı senaryosu hazırlayın. Ayrı bir araştırma dosyası gerekmiyor; tek bir diyagram yeterli.", { after: 100 }));
body.push(P("Örnek sıra:", { b: true, after: 60 }));
body.push(P("Yaklaşma  →  Giriş / eşik  →  İlk algı  →  Ürünleri keşfetme  →  Deneyimleme  →  Satın alma veya etkileşim  →  Çıkış",
  { b: true, c: ACC, after: 120 }));
body.push(P("Bu sıra her mağaza için aynı olmak zorunda değil. Ürünü denemek ya da kişiselleştirmek deneyimin merkezindeyse o duraklar öne çıkar; bazı markalarda satın alma daha ikincil bir adımdır. Sıralamayı kendi markanıza göre kurun.", { after: 120 }));
body.push(P("İstediğimiz, bu adımları plan üzerinde göstermeniz ve her adım için şu soruyu cevaplamanız:", { after: 80 }));
body.push(box([
  "“Kullanıcı bu deneyimi yaşarken mekânda nerede, ne yapıyor ve neden orada?”"
], { fill: "F4F6F8", c: HDR }));
body.push(SPACE(100));
body.push(P("Müşteri yolculuğu ile zoning birbirini kontrol etmeli.", { b: true, after: 60 }));
body.push(P("Planda bir deneyim alanı gösteriyorsanız bunun senaryoda karşılığı olmalı; senaryoda bir durak varsa planda yeri olmalı. Karşılığı olmayan her ikisi de eksiktir."));

/* ---------------- üç konu ---------------- */
body.push(H1("Her alternatifte görmek istediğim üç konu"));
const W5 = [2900, 6738];
body.push(table(W5, [
  new TableRow({ children: [
    cell("Mevcut yapıyla ilişki", { w: W5[0], b: true, fill: ZEB }),
    cell("Kolonlar, girişler, ışıklık, cephe ve yüksek hacim hangi işlevi nereye yerleştirme kararını etkiliyor? Kolon ve kiriş aksı çizilmeden yapılan bölgeleme değerlendirilmez.", { w: W5[1] })] }),
  new TableRow({ children: [
    cell("Yatay ve düşey organizasyon", { w: W5[0], b: true, fill: ZEB }),
    cell("Alt ve üst kat varsa işlevler nasıl dağılıyor? Üst kat yalnızca ilave satış alanı mı, yoksa markanın deneyimini tamamlayan farklı bir bölüm mü?", { w: W5[1] })] }),
  new TableRow({ children: [
    cell("Meydan ile ilişki", { w: W5[0], b: true, fill: ZEB }),
    cell("Mağazanın girişi ve önü yalnızca içeri girilen bir eşik mi, yoksa markanın dışarıdan algılanmasını ve kullanıcıyı davet etmesini sağlayan bir deneyim alanı mı?", { w: W5[1] })] })
]));

/* ---------------- teslim ---------------- */
body.push(H1("Teslim"));
body.push(P("Bu hafta stüdyoya getirilecekler:", { b: true, after: 70 }));
["İhtiyaç programı tablosu",
 "Bubble diagram",
 "Komşuluk tablosu",
 "Üç zoning alternatifi — aynı altlık, aynı renk kodları, her birinin altında iki cümlelik gerekçe",
 "Müşteri yolculuğu diyagramı, plan üzerinde"].forEach(x => body.push(BUL(x)));
body.push(SPACE(60));
body.push(P("Biçim: A3, PDF ve basılı. Bütün çizimlerde kuzey oku, ölçek ve lejant bulunacak.", { sz: 19, c: "5A6270" }));

body.push(H1("Gelecek hafta"));
body.push(P("Zoning alternatifleri ve yerleşim seçenekleri stüdyoda tartışılacak, mekân kullanım senaryoları geliştirilecek. Seçilen kurgu sunum formatına dökülecek: yerleşim planı, kesit çalışmaları, mood board ve perspektifler. Bu çalışmalar ara jüri hazırlığının temelini oluşturur."));

/* ---------------- belge ---------------- */
const doc = new Document({
  creator: "Kapadokya Üniversitesi · İç Mimarlık ve Çevre Tasarımı",
  title: "Mekânsal Program ve Bölgeleme — İç Mimari Proje III",
  numbering: { config: [
    { reference: "mermi", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 340, hanging: 200 } }, run: { font: FONT, size: 20 } } }] },
    { reference: "sayi", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 240 } }, run: { font: FONT, size: 20 } } }] }
  ]},
  sections: [{
    properties: { page: { margin: {
      top: convertMillimetersToTwip(20), bottom: convertMillimetersToTwip(18),
      left: convertMillimetersToTwip(20), right: convertMillimetersToTwip(20) } } },
    children: body
  }]
});
Packer.toBuffer(doc).then(b => {
  require("fs").writeFileSync("Mekansal-Program-ve-Bolgeleme.docx", b);
  console.log("ok");
});
