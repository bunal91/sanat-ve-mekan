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
const TAG = (txt, kod, tag) => new Paragraph({
  spacing: { before: 170, after: 40, line: 272 },
  children: [
    new TextRun({ text: kod + "  ", font: FONT, size: 20, bold: true, color: ACC }),
    new TextRun({ text: txt, font: FONT, size: 20, bold: true, color: "1A1A1A" }),
    new TextRun({ text: "   " + tag, font: FONT, size: 15, bold: true, color: "5A6270", characterSpacing: 30 })
  ]
});

/* ---------------- başlık ---------------- */
body.push(new Paragraph({ spacing: { after: 40 },
  children: [new TextRun({ text: "KAPADOKYA ÜNİVERSİTESİ", font: FONT, size: 20, bold: true,
    color: ACC, characterSpacing: 40 })] }));
body.push(P("Mimarlık, Tasarım ve Güzel Sanatlar Fakültesi · İç Mimarlık ve Çevre Tasarımı Bölümü",
  { sz: 19, c: "5A6270", after: 220 }));
body.push(new Paragraph({ spacing: { after: 60 },
  children: [new TextRun({ text: "1. JÜRİ — KONSEPT JÜRİSİ", font: FONT, size: 34, bold: true })] }));
body.push(new Paragraph({ spacing: { after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACC, space: 8 } },
  children: [new TextRun({ text: "IMC – 301 İç Mimari Tasarım Stüdyosu IV  ·  Mersin Marina  ·  2026–27 Güz",
    font: FONT, size: 24, color: "5A6270" })] }));

/* ---------------- amaç ---------------- */
body.push(box([
  "Bu bir tasarım jürisi değil, bir karar jürisidir.",
  "20 Ekim’de üç zoning alternatifi ürettiniz. Bu jüride bunlardan birini seçmiş, seçiminizi markanızla ve mekânın gerçek kısıtlarıyla savunabiliyor olmanız bekleniyor. Jüriden çıktığınızda elinizde tek bir mekânsal kurgu, bu kurgunun kesitte kanıtlanmış hali ve onu taşıyan net bir konsept cümlesi olmalı."
], { bFirst: true }));
body.push(SPACE(80));

const W0 = [2600, 7038];
body.push(table(W0, [
  new TableRow({ children: [cell("Tarih", { w: W0[0], b: true, fill: ZEB }), cell("10 Kasım 2026, Salı — 7. hafta", { w: W0[1] })] }),
  new TableRow({ children: [cell("Sunum", { w: W0[0], b: true, fill: ZEB }), cell("Kişi başı 10 dakika sunum + 10 dakika eleştiri", { w: W0[1] })] }),
  new TableRow({ children: [cell("Pafta boyutu", { w: W0[0], b: true, fill: ZEB }), cell("A1 dikey (59,4 × 84,1 cm) — istediğiniz sayıda pafta, hepsi aynı boyut ve aynı yön", { w: W0[1] })] }),
  new TableRow({ children: [cell("Altlık", { w: W0[0], b: true, fill: ZEB }), cell("Paylaşılan pafta şablonu kullanılacak. Başlık ve alt bant değiştirilmeyecek.", { w: W0[1] })] }),
  new TableRow({ children: [cell("Çizim ölçeği", { w: W0[0], b: true, fill: ZEB }), cell("Plan ve kesitler 1/100. Her çizimde ölçek, kuzey oku ve lejant bulunacak.", { w: W0[1] })] }),
  new TableRow({ children: [cell("Dijital teslim", { w: W0[0], b: true, fill: ZEB }), cell("Tek PDF, jüri sabahı 09.00’a kadar. Dosya adı: IMC301_Ad-Soyad_1Juri.pdf", { w: W0[1] })] }),
  new TableRow({ children: [cell("Basılı teslim", { w: W0[0], b: true, fill: ZEB }), cell("Zorunlu. Ekrandan sunum kabul edilmez.", { w: W0[1] })] })
]));

/* ---------------- ne değişiyor ---------------- */
body.push(H1("20 Ekim teslimine göre ne değişiyor"));
body.push(P("Bu jüri sıfırdan yeni bir iş istemiyor. 20 Ekim’de ürettiklerinizin üzerine iki şey ekliyor: bir seçim ve bu seçimin çizimle kanıtlanması."));
body.push(SPACE(40));
const W1 = [3100, 6538];
body.push(table(W1, [
  headRow(["Ekleniyor", "Neden"], W1),
  new TableRow({ children: [cell("Tek bir zoning seçimi", { w: W1[0], b: true }), cell("Üç alternatif artık karar değil, gerekçedir. Jüriye bir kurguyla gelinir.", { w: W1[1] })] }),
  new TableRow({ children: [cell("1/100 plan ve kesit", { w: W1[0], b: true }), cell("Asma kat kararı baloncuk diyagramıyla sınanamaz. Kesit olmadan asma katın çalışıp çalışmadığı bilinemez.", { w: W1[1] })] }),
  new TableRow({ children: [cell("Asma kat etüdü", { w: W1[0], b: true }), cell("Mekânın en zor kısıtı burada. Döşeme kotu, galeri boşluğu ve merdiven birlikte çözülmek zorunda.", { w: W1[1] })] }),
  new TableRow({ children: [cell("Konsept metni", { w: W1[0], b: true }), cell("Anlatamadığınız bir tasarımı savunamazsınız. Yazı, kararların tutarlı olup olmadığını açığa çıkarır.", { w: W1[1] })] }),
  new TableRow({ children: [cell("Bir elle eskiz", { w: W1[0], b: true }), cell("Maket ve render bu aşamada erken. Ama mekânı üç boyutlu düşünmeden plan kararı verilemez.", { w: W1[1] })] })
]));
body.push(SPACE(60));
body.push(P("Aşağıdaki listede YENİ etiketi ilk kez istenen işi, REVİZE etiketi 20 Ekim’de teslim ettiğiniz işin geliştirilmiş halini gösterir.", { sz: 19, c: "5A6270" }));

/* ---------------- A ---------------- */
body.push(H1("A · KONSEPT — mekândan önce söz"));
body.push(TAG("Konsept metni", "A1", "YENİ"));
body.push(P("En çok 150 kelime, tek paragraf. Şu üç soruyu cevaplasın: Bu mağaza kimin için? Burada ne oluyor? Mekân bunu nasıl yapıyor? Sıfat yığmayın; mekânsal karşılığı olmayan cümle kurmayın."));
body.push(TAG("Anahtar kelimeler", "A2", "REVİZE"));
body.push(P("En çok beş kelime. Her kelimenin yanına tek cümlelik mekânsal karşılığını yazın. “Sıcak” bir anahtar kelime değildir; “alçak tavanlı, kapalı deneme bölgesi” bir anahtar kelimedir."));
body.push(TAG("Marka anahtarı", "A3", "REVİZE"));
body.push(P("Markanın kimliği, hedef kitlesi, rakiplerinden ayrıştığı nokta ve mekânsal beklentisi. Tek paftada, görselle birlikte."));
body.push(TAG("Kullanıcı profilleri", "A4", "REVİZE"));
body.push(P("En az iki farklı kullanıcı tanımlayın: örneğin ilk kez gelen müşteri, düzenli müşteri ve çalışan. Her biri mekândan farklı bir şey ister; bu farkı yazın."));

/* ---------------- B ---------------- */
body.push(H1("B · ANALİZ — neyi biliyoruz"));
body.push(TAG("Alan analizi özeti", "B1", "REVİZE"));
body.push(P("Mersin Marina analizinizin tamamını değil, yalnızca tasarımı etkileyen bulguları getirin. Her bulgunun karşısına aldığınız kararı yazın:"));
body.push(BUL("bulgu → karar  (örnek: “öğleden sonra batı cephesi tam güneş alıyor → vitrin camının önüne derin bir eşik bölgesi ve gölgeleme”)"));
body.push(P("En az beş bulgu-karar çifti. Rüzgâr, güneş yönü, insan hareketi, gürültü, manzara ve komşu kullanımlar arasından seçin.", { before: 60 }));
body.push(TAG("Mevcut mekânın okunması", "B2", "YENİ"));
body.push(P("1/100 plan ve kesit üzerinde, kendi çiziminizle gösterin:"));
["Kolon aksları (8,00 × 8,00 m ızgara) ve kolon boyutları",
 "Kiriş aksları — 50/75 cm, alt kot +5.75, üst kot +6.50",
 "İki cam cephe ve çift kanat kapılar: meydan cephesi ve doğu cephesi",
 "Işıklık ve çatının alçaldığı yön",
 "Asma kat kurulabilen sınır: x ≤ 11,19 m",
 "Kotlar: bitmiş zemin +1.07, kiriş altı +5.75, asma kat döşemesi +6.55"].forEach(x => body.push(BUL(x)));
body.push(P("Bu çizim size verilen paftalardan kopyalanmayacak; kendiniz çizeceksiniz. Mekânı çizerek öğrenmenin başka yolu yok.", { before: 60, sz: 19, c: "5A6270" }));
body.push(TAG("Kısıtlar listesi", "B3", "YENİ"));
body.push(P("Değiştiremeyeceğiniz şeylerin listesi, tek sayfada: kabuk, kolonlar, kirişler, ışıklık, cepheler, meydan. Yanlarına her birinin tasarımınızda nasıl bir fırsata dönüştüğünü yazın."));

/* ---------------- C ---------------- */
body.push(H1("C · MEKÂNSAL KURGU — bu jürinin omurgası"));
body.push(TAG("İhtiyaç programı", "C1", "REVİZE"));
body.push(P("Tablo halinde, m² ile. 20 Ekim’deki programı seçtiğiniz zoning’e göre güncelleyin. Toplam alanın mevcut 262 m² ile tutarlı olduğunu gösterin."));
body.push(TAG("Seçilen zoning", "C2", "REVİZE"));
body.push(P("Tek alternatif, büyük ölçekte. Elenen iki alternatif küçük ölçekte yanında dursun ve altlarında iki cümlelik gerekçe olsun: neden bu değil, neden o."));
body.push(TAG("1/100 zemin kat planı", "C3", "YENİ"));
body.push(P("Şematik ama ölçekli. Giriş(ler), vitrin, sirkülasyon, satış bölgeleri, deneme/deneyim alanı, kasa, depo, personel ve merdiven. Mobilya detayı beklemiyoruz; bölge sınırları ve geçiş genişlikleri bekliyoruz."));
body.push(TAG("1/100 asma kat planı", "C4", "YENİ"));
body.push(P("Döşemenin nerede başlayıp nerede bittiği, galeri boşluğu, korkuluk hattı ve merdivenin varış noktası."));
body.push(TAG("1/100 kesit — en az bir adet", "C5", "YENİ"));
body.push(P("Mekânın uzun yönünde, asma katı, galeri boşluğunu ve merdiveni kesen bir kesit. Kesitte şunlar okunabilmeli: kat yükseklikleri, asma kat altındaki ve üstündeki net yükseklikler, çatının alçaldığı bölge, ışıklık."));
body.push(SPACE(60));
body.push(box([
  "C6 · ASMA KAT ETÜDÜ — bu jürinin teknik şartı",
  "Asma kat zorunlu. Aşağıdaki beş kalemi tek bir paftada, sayılarıyla göstereceksiniz. Sayılar tutmuyorsa tasarım tutmuyor demektir.",
  "1 · Asma kat döşemesinin kotu ve asma kat alanı (m²).",
  "2 · Galeri boşluğu alanı ve oranı. Asma kat döşemesinin en çok 1/3’ü açılabilir.",
  "3 · Merdiven tipi, konumu, rıht sayısı ve basamak genişliği. Kat yüksekliği +1.07 → +6.55 = 5,48 m; 32 rıht × 17,13 cm, basamak 28 cm.",
  "4 · Üç baş üstü kontrolü: merdivenin altından geçtiği her yerde 2,20 m; asma katın üstünde 2,20 m; asma katın altında 2,20 m.",
  "5 · Döşeme boşluğunun tek bir ızgara gözünün içinde kaldığının gösterimi — boşluk kirişi kesemez."
], { bFirst: true }));
body.push(SPACE(60));
body.push(P("D8, D9 ve D10 paftalarındaki kurallar ve doğrulanmış merdiven konumları size referanstır, hazır cevap değildir. Kendi merdiveninizi kendi kurgunuza göre çözüp kontrolünü yapacaksınız.", { sz: 19, c: "5A6270" }));
body.push(TAG("Düşey organizasyon diyagramı", "C7", "YENİ"));
body.push(P("Hangi işlev hangi katta ve neden. Alt kat ile üst kat arasındaki ilişkiyi tek bir şemayla anlatın: ne görülüyor, ne duyuluyor, ne gizleniyor."));

/* ---------------- D ---------------- */
body.push(H1("D · DENEYİM"));
body.push(TAG("Müşteri yolculuğu haritası", "D1", "REVİZE"));
body.push(P("Seçilen zoning planının üzerine işlenmiş olacak. Yaklaşma / giriş / eşik ve ilk algı / keşif / deneyimleme / satın alma / çıkış. Her durakta kullanıcının nerede durduğunu, ne gördüğünü ve bunun neden gerekli olduğunu yazın."));
body.push(TAG("Meydan ilişkisi", "D2", "YENİ"));
body.push(P("Mağazanın meydandan nasıl algılandığı. Şematik bir görünüş ya da eskiz. Meydan sizin paftanızda boş bir alan olarak kalmayacak: yaklaşımı tasarlayın."));
body.push(TAG("Eşik ve ilk algı", "D3", "YENİ"));
body.push(P("Kapıdan girildiği anda ne görülüyor? Göz hizasından tek bir eskiz. Yüksek hacim, ışıklık ve asma kat bu eskizde okunmalı."));

/* ---------------- E ---------------- */
body.push(H1("E · ATMOSFER"));
body.push(TAG("Konsept panosu / moodboard", "E1", "REVİZE"));
body.push(P("Toplanmış görsel değil, seçilmiş görsel. Her görselin neden orada olduğunu bir kelimeyle etiketleyin."));
body.push(TAG("Malzeme ve renk yönü", "E2", "YENİ"));
body.push(P("Henüz malzeme listesi değil, yön. Üç ile beş malzeme, üç ile dört renk. Zemin, duvar, tavan ve asma kat döşemesi için ayrı ayrı hangi yöne gittiğinizi belirtin."));
body.push(TAG("Elle çizilmiş iç mekân eskizi veya şematik aksonometri", "E3", "YENİ"));
body.push(P("En az bir adet. Bilgisayar görselleştirmesi ve maket bu jüride istenmiyor — erken. Ama mekânı üç boyutlu düşündüğünüzü görmemiz gerekiyor."));

/* ---------------- pafta ---------------- */
body.push(H1("Pafta kuralları"));
const W2 = [3100, 6538];
body.push(table(W2, [
  new TableRow({ children: [cell("Boyut", { w: W2[0], b: true, fill: ZEB }), cell("A1 dikey, 59,4 × 84,1 cm. Yatay pafta kabul edilmez.", { w: W2[1] })] }),
  new TableRow({ children: [cell("Sayı", { w: W2[0], b: true, fill: ZEB }), cell("Serbest. İşinizin gerektirdiği kadar pafta hazırlayın; hepsi aynı boyut ve aynı yön olacak.", { w: W2[1] })] }),
  new TableRow({ children: [cell("Altlık", { w: W2[0], b: true, fill: ZEB }), cell("Paylaşılan şablon. Başlık bloğu, alt bant ve kenar boşlukları değiştirilmeyecek.", { w: W2[1] })] }),
  new TableRow({ children: [cell("Numaralama", { w: W2[0], b: true, fill: ZEB }), cell("Her paftanın başlığında pafta no: 1/3, 2/3, 3/3 biçiminde.", { w: W2[1] })] }),
  new TableRow({ children: [cell("Yazı", { w: W2[0], b: true, fill: ZEB }), cell("Tek yazı ailesi. Gövde metni en az 10 punto — paftaya iki metre mesafeden bakılacak.", { w: W2[1] })] }),
  new TableRow({ children: [cell("Çizimler", { w: W2[0], b: true, fill: ZEB }), cell("Ölçek çubuğu, kuzey oku, kot işaretleri ve lejant zorunlu. Ölçeksiz çizim değerlendirilmez.", { w: W2[1] })] }),
  new TableRow({ children: [cell("Açıklama", { w: W2[0], b: true, fill: ZEB }), cell("Her diyagramın ve her çizimin altında en az bir cümle açıklama.", { w: W2[1] })] }),
  new TableRow({ children: [cell("Baskı", { w: W2[0], b: true, fill: ZEB }), cell("Basılı teslim zorunlu. Fotoblok veya sert zemine yapıştırma serbest.", { w: W2[1] })] })
]));
body.push(SPACE(70));
body.push(P("Önerilen pafta dağılımı — zorunlu değil, bir başlangıç noktası:", { b: true, after: 70 }));
const W3 = [1900, 7738];
body.push(table(W3, [
  new TableRow({ children: [cell("Pafta 1", { w: W3[0], b: true, fill: ZEB }), cell("Konsept metni, anahtar kelimeler, marka anahtarı, kullanıcı profilleri, konsept panosu  (A1–A4, E1)", { w: W3[1] })] }),
  new TableRow({ children: [cell("Pafta 2", { w: W3[0], b: true, fill: ZEB }), cell("Alan analizi özeti, mevcut mekânın okunması, kısıtlar, ihtiyaç programı  (B1–B3, C1)", { w: W3[1] })] }),
  new TableRow({ children: [cell("Pafta 3", { w: W3[0], b: true, fill: ZEB }), cell("Seçilen zoning, 1/100 zemin ve asma kat planları, elenen iki alternatif  (C2–C4)", { w: W3[1] })] }),
  new TableRow({ children: [cell("Pafta 4", { w: W3[0], b: true, fill: ZEB }), cell("1/100 kesit, asma kat etüdü, düşey organizasyon  (C5–C7)", { w: W3[1] })] }),
  new TableRow({ children: [cell("Pafta 5", { w: W3[0], b: true, fill: ZEB }), cell("Müşteri yolculuğu, meydan ilişkisi, eşik eskizi, malzeme ve renk yönü  (D1–D3, E2–E3)", { w: W3[1] })] })
]));
body.push(SPACE(50));
body.push(P("A1 dikey paftada 1/100 ölçekli zemin kat planı 16,0 × 21,4 cm yer kaplar. Üç zoning alternatifini yan yana koyabilir, aynı paftaya kesiti de sığdırabilirsiniz. Aynı altlık, ileride 1/50’ye geçtiğinizde de (32,0 × 42,8 cm) yetiyor.", { sz: 19, c: "5A6270" }));

/* ---------------- değerlendirme ---------------- */
body.push(H1("Değerlendirme"));
const W4 = [6338, 1300, 2000];
body.push(table(W4, [
  headRow(["Ölçüt", "Ağırlık", "Nereye bakıyoruz"], W4),
  new TableRow({ children: [cell("Konseptin netliği ve markayla ilişkisi", { w: W4[0] }), cell("25", { w: W4[1], al: AlignmentType.CENTER, b: true }), cell("A1–A4", { w: W4[2] })] }),
  new TableRow({ children: [cell("Mekânsal kurgunun tutarlılığı — zoning, kesit ve yolculuk aynı şeyi söylüyor mu", { w: W4[0] }), cell("25", { w: W4[1], al: AlignmentType.CENTER, b: true }), cell("C2–C3, C7, D1", { w: W4[2] })] }),
  new TableRow({ children: [cell("Mevcut yapının doğru okunması ve kısıtların çözülmesi — asma kat, merdiven, kiriş", { w: W4[0] }), cell("25", { w: W4[1], al: AlignmentType.CENTER, b: true }), cell("B2–B3, C4–C6", { w: W4[2] })] }),
  new TableRow({ children: [cell("Anlatım, pafta düzeni ve çizim kalitesi", { w: W4[0] }), cell("15", { w: W4[1], al: AlignmentType.CENTER, b: true }), cell("bütün paftalar", { w: W4[2] })] }),
  new TableRow({ children: [cell("Süreç — kritiklere katılım ve gelişim", { w: W4[0] }), cell("15", { w: W4[1], al: AlignmentType.CENTER, b: true }), cell("hafta 5–7", { w: W4[2] })] })
]));

/* ---------------- kontrol listesi ---------------- */
body.push(H1("Jüriye gelmeden önce kendinize sorun"));
["Konsept cümlemi yirmi saniyede anlatabiliyor muyum?",
 "Zoning şemam ile kesitim aynı şeyi mi söylüyor?",
 "Asma katım x ≤ 11,19 m sınırının içinde mi kalıyor?",
 "Galeri boşluğum asma kat döşemesinin üçte birini geçiyor mu?",
 "Merdivenim bir kirişe çarpıyor mu? İlk 14 rıhttan sonra döşemenin altında kalan basamak var mı?",
 "Asma katın altında ve üstünde 2,20 m net yükseklik var mı?",
 "Döşeme boşluğum tek bir ızgara gözünün içinde mi?",
 "Meydandan bakan biri mağazamın ne olduğunu anlıyor mu?",
 "Her çizimde ölçek ve kuzey oku var mı?",
 "Her paftada en az bir cümle açıklama var mı?"].forEach(x => body.push(BUL(x)));

/* ---------------- kabul edilmeyenler ---------------- */
body.push(H1("Kabul edilmeyecek işler"));
body.push(box([
  "Yapay zekâ ile üretilmiş görsel, metin, diyagram veya çizim. Bu jüride yapay zekâ kullanımı yasaktır.",
  "Mevcut yapı verilerini değiştiren çizimler: kolon kaldırmak, kabuğu değiştirmek, cephe açıklığını büyütmek.",
  "Ölçeksiz veya ölçeği belirtilmemiş plan ve kesit.",
  "Üç zoning alternatifinin seçim yapılmadan birlikte sunulması.",
  "Asma kat etüdü olmayan teslim. C6 eksikse jüri değerlendirmesi yapılmaz."
], { c: "8C3A2B", fill: "F7F3F1" }));

/* ---------------- sonrası ---------------- */
body.push(H1("Bu jüriden sonra"));
body.push(P("Jüride seçilen kurgu üzerinden 1/50 ölçeğe geçilecek: plan, kesit ve cephe. Kasa, depo ve personel alanları, servis rotası, tavan ve aydınlatma kurgusu sırayla çözülecek. Ara jüride (1 Aralık 2026) 1/50 set, malzeme paneli ve üç boyutlu anlatım beklenecek."));

/* ---------------- belge ---------------- */
const doc = new Document({
  creator: "Kapadokya Üniversitesi · İç Mimarlık ve Çevre Tasarımı",
  title: "1. Jüri — Konsept Jürisi · IMC 301",
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
  require("fs").writeFileSync("1-Juri-Konsept-Istenenler.docx", b);
  console.log("ok");
});
