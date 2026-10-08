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
  children: [new TextRun({ text: "ALAN ANALİZİ", font: FONT, size: 40, bold: true })] }));
body.push(new Paragraph({ spacing: { after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACC, space: 8 } },
  children: [new TextRun({ text: "İç Mimari Proje III  ·  Mersin Marina  ·  2026–2027 Güz",
    font: FONT, size: 24, color: "5A6270" })] }));

body.push(table([2200, 7438], [
  new TableRow({ children: [cell("Veriliş", { w: 2200, b: true, fill: ZEB, sz: 19 }),
    cell("8 Ekim 2026", { w: 7438, sz: 19 })] }),
  new TableRow({ children: [cell("Birinci teslim ve kritik", { w: 2200, b: true, fill: ZEB, sz: 19 }),
    cell("13 Ekim 2026 — 3. hafta stüdyosu", { w: 7438, sz: 19 })] }),
  new TableRow({ children: [cell("Tamamlanmış set", { w: 2200, b: true, fill: ZEB, sz: 19 }),
    cell("20 Ekim 2026 — 4. hafta stüdyosu", { w: 7438, sz: 19 })] }),
  new TableRow({ children: [cell("Nihai hâli", { w: 2200, b: true, fill: ZEB, sz: 19 }),
    cell("27 Ekim 2026 — araştırma sunumları içinde", { w: 7438, sz: 19 })] }),
  new TableRow({ children: [cell("Biçim", { w: 2200, b: true, fill: ZEB, sz: 19 }),
    cell("A3 yatay kitapçık · tek PDF + basılı set", { w: 7438, sz: 19 })] }),
  new TableRow({ children: [cell("Çalışma biçimi", { w: 2200, b: true, fill: ZEB, sz: 19 }),
    cell("Bireysel", { w: 7438, sz: 19 })] }),
  new TableRow({ children: [cell("Değerlendirme", { w: 2200, b: true, fill: ZEB, sz: 19 }),
    cell("Araştırma sunumu notunun (%15) içinde; ayrıca stüdyo süreç performansına (%15) girer.",
      { w: 7438, sz: 19 })] })
]));

/* ---------------- 1. amaç ---------------- */
body.push(H1("1. Amaç"));
body.push(P("6 Ekim'de Mersin Marina'ya gittiniz, alanı gezdiniz, fotoğraf ve video çektiniz. AutoCAD altlığı sizde. Bu ödev, elinizdeki üç kaynağı — gözleminiz, kendi görüntüleriniz ve çizim altlığı — birleştirip tasarım kararlarınıza dayanak üretmenizi istiyor."));
body.push(P("Amaç güzel pafta üretmek değil. Her analizin sonunda şu sorunun cevabı olmalı: bu bulgu beni ne yapmaya zorluyor? Cevabı olmayan analiz paftası dekorasyondur ve değerlendirilmez."));
body.push(SPACE(60));
body.push(box([
  "Bu projede kabuk verilidir: taşıyıcı sistem, cephe hattı ve kot değiştirilemez. Dolayısıyla alan analizi sizin için bir \"durum tespiti\" değil, tasarım serbestliğinizin sınırlarını öğrenme işidir. Neyi değiştiremeyeceğinizi bilmeden neyi tasarlayacağınıza karar veremezsiniz."
]));

/* ---------------- 2. teslim ---------------- */
body.push(H1("2. Ne teslim edeceksiniz"));
body.push(P("A3 yatay kitapçık: kapak + 15 analiz paftası + fotoğraf künyesi + kaynakça."));
body.push(P("Her analiz paftası tam olarak şu üçünü içerir:", { b: true, after: 60 }));
body.push(NUM("Bir çizim, diyagram ya da harita. Sayfanın en az yarısını kaplar, ana eleman budur."));
body.push(NUM("Kısa açıklama. En fazla 60 kelime."));
body.push(NUM("Tek cümlelik bulgu. Sayfanın altında, koyu: \"Bu analiz bana şunu söylüyor: …\""));
body.push(SPACE(60));
body.push(P("Çizimi olmayan pafta, yalnızca metinden oluşan pafta ve bulgu cümlesi yazılmamış pafta eksik sayılır.", { i: true, c: "5A6270" }));

/* ---------------- 3. pafta listesi ---------------- */
body.push(H1("3. Pafta listesi"));
body.push(P("On beş paftanın tamamı zorunludur. Kodları paftaların sağ alt köşesine yazın.", { after: 140 }));

const W = [640, 2360, 3060, 3578];
const rows = [headRow(["Kod", "Pafta", "Nasıl üretilecek", "Cevaplaması gereken soru"], W)];
function sec(title) {
  rows.push(new TableRow({ children: [cell(title, { w: CW, span: 4, fill: "E8E3E0", b: true, sz: 18 })] }));
}
function r(k, a, b, c, z) {
  rows.push(new TableRow({ children: [
    cell(k, { w: W[0], b: true, fill: z ? ZEB : undefined }),
    cell(a, { w: W[1], b: true, fill: z ? ZEB : undefined }),
    cell(b, { w: W[2], fill: z ? ZEB : undefined }),
    cell(c, { w: W[3], fill: z ? ZEB : undefined })] }));
}
sec("A · KONUM VE ERİŞİM");
r("A1","Kent içinde konum","Uydu altlık üzerine kendi çiziminiz, yaklaşık 1/10000","Marina kentin neresinde? Kimin yolu üstünde, kim özel olarak geliyor?",1);
r("A2","Erişim ve giriş noktaları","Vaziyet üzerine ok diyagramı","Müşteri marinaya nereden giriyor: otoparktan mı, sahil yürüyüşünden mi, denizden mi?");
r("A3","Çevre kullanımlar","Renk kodlu çevre haritası","Marina kimin günlük rotasında? Hafta içi ve hafta sonu kim geliyor?",1);
sec("B · MARİNA BÜTÜNÜ");
r("B1","Vaziyet planı ve kütle–boşluk","DWG'den 1/1000 ya da 1/500","Marina nasıl bir boşluklar dizisi? Biriminiz hangi boşluğa bakıyor?");
r("B2","İşlev dağılımı ve mevcut perakende","Vaziyet üzerine renk kodu + kendi fotoğraflarınız","Hangi işlev nerede toplanmış? Biriminiz hangi komşuluğun içinde kalıyor?",1);
r("B3","Yaya hareketi, yoğunluk ve duraklama","Akış diyagramı + sayım tablosu","İnsan nereden geliyor, nerede duruyor, nereye hiç gitmiyor?");
sec("C · İKLİM VE ÇEVRE");
r("C1","Güneş ve gölge","21 Aralık / 21 Mart / 21 Haziran × 10.00, 13.00, 16.00 gölge şeması","Cephenize güneş hangi aylarda, günün hangi saatinde geliyor?",1);
r("C2","Rüzgâr ve deniz","MGM rüzgâr gülü + sahadaki gözleminiz (bayrak, tente, direk)","Hâkim rüzgâr nereden esiyor? Vitrin, kapı ve dış mekân bundan nasıl etkilenir?");
r("C3","Gün içi ritim: ışık, gürültü, kalabalık","24 saatlik şerit diyagram","Mekân saat kaçta canlanıyor, kaçta ölüyor? Akşam nasıl aydınlanıyor?",1);
sec("D · BİRİM");
r("D1","Kabuk: plan, kesit, cephe","DWG'den 1/100, ölçülendirilmiş","Elinizde tam olarak ne var? Net alan, net yükseklik, vitrin açıklığı kaç metre?");
r("D2","Komşuluk, servis ve teknik","1/100 plan üzerine işaretleme","Mal nereden giriyor, çöp nereye çıkıyor, tesisat ve pano nerede?",1);
r("D3","Yaklaşma dizisi ve görüş hatları","Fotoğraf dizisi + plan üzerinde bakış konileri","Biriminiz ilk kaç metreden görünüyor? Yürüyen biri için kaç saniye görünür kalıyor?");
sec("E · SENTEZ");
r("E1","Fırsat ve kısıt haritası","Vaziyet ve birim planı üzerine işaretleme","Neresi avantaj, neresi sorun? Hangisi değiştirilebilir, hangisi değil?",1);
r("E2","Beş tasarım girdisi","Metin + küçük şemalar","Analizden çıkan beş karar nedir? Her biri hangi paftadan geliyor?");
r("E3","Eksikler ve ikinci ziyaret listesi","Liste + anahtar plan","Neyi ölçemediniz, neyi göremediniz, kime ne sormanız gerekiyor?",1);
body.push(table(W, rows));
body.push(SPACE(100));
body.push(box([
  "13 Ekim'deki ilk kritiğe şunlar tamamlanmış gelecek: A1, A2, A3, B1, B2, B3, D1. Diğer paftalar taslak hâlinde olabilir.",
  "20 Ekim'de on beş paftanın tamamı bitmiş olacak. 27 Ekim'deki araştırma sunumunda bu setin revize edilmiş hâlini kullanacaksınız."
], { bFirst: true }));

/* ---------------- 4. kontrol listesi ---------------- */
body.push(H1("4. Sahada ve kendi görüntülerinizde arayacaklarınız"));
body.push(P("Aşağıdaki liste, paftaları doldururken neye bakacağınızı gösterir. Hepsini kullanmak zorunda değilsiniz; ama bakmadığınız şeyi analiz edemezsiniz.", { after: 150 }));

body.push(H2("Yön ve iklim"));
["Kuzey yönü ve biriminizin cephesinin baktığı yön",
 "Güneşin cepheye geldiği saat aralığı — yazın ve kışın ayrı ayrı",
 "Gölge kaynakları: saçak, tente, ağaç, komşu kütle, direk",
 "Rüzgârın yönü: bayrak, tente, tekne direkleri, dalga yönü, bağlı teknelerin salındığı yön",
 "Tuz serpintisinin izleri: metalde pas, ahşapta grileşme, boyada kabarma",
 "Yağmur suyu nereye akıyor, nerede birikiyor; saçak var mı",
 "Yaz ile kış arasındaki sıcaklık, nem ve kullanım farkı"].forEach(x => body.push(BUL(x)));

body.push(H2("İnsan hareketi"));
["Yaya akışının yönü ve hızı — promenad mı, gezinti mi, geçiş mi",
 "Sayım: belirli bir noktadan beş dakikada geçen kişi sayısı, en az iki farklı saatte",
 "Duraklama noktaları: oturma, gölge, manzara, vitrin önü, buluşma",
 "Ölü uçlar — kimsenin gitmediği yerler ve nedeni",
 "Kullanıcı türleri: tekne sahibi, Mersinli aile, turist, çalışan, gençler",
 "Çocuk arabası, bisiklet, scooter, tekerlekli sandalye — rotayı kullanabiliyorlar mı",
 "Hafta içi ile hafta sonu, gündüz ile akşam arasındaki fark",
 "İnsanlar biriminizin önünden geçerken nereye bakıyor"].forEach(x => body.push(BUL(x)));

body.push(H2("Mekân ve kabuk"));
["Kot farkları: basamak, rampa, bordür, eşik",
 "Zemin kaplaması ve değiştiği yerler — kaplama değişimi çoğu zaman görünmez bir sınırdır",
 "Komşu birimlerin vitrin yüksekliği ve tabela hizası — cephe ritmi",
 "Tente, şemsiye ve dış mobilyanın taşabildiği sınır",
 "Mevcut aydınlatma: direk, aplik, vitrin ışığı; gece ışık seviyesi ve rengi",
 "Yangın çıkışı, tahliye yönü ve yangın dolabı konumu",
 "Teknik altyapı: elektrik panosu, su ve atıksu bağlantısı, klima dış ünitesi nereye konabiliyor",
 "Mal kabul rotası, çöp toplama noktası ve servis saatleri"].forEach(x => body.push(BUL(x)));

body.push(H2("Duyusal ortam"));
["Ses kaynakları ve saatleri: müzik, restoran, deniz, trafik, kalabalık",
 "Koku kaynakları: deniz, mutfak, yakıt",
 "Gece ışığın rengi ve seviyesi — hangi cephe gece okunuyor",
 "Manzara: hangi noktadan deniz ve tekneler görünüyor, hangi noktadan görünmüyor"].forEach(x => body.push(BUL(x)));

body.push(H2("Kurallar ve işletme"));
["Marina yönetiminin tabela, tente ve dış mekân kullanımına dair kuralları — sorun, varsa not edin",
 "Birimlerin açılış ve kapanış saatleri",
 "Mevsimsel doluluk: yazın kaç birim açık, kışın kaç tanesi"].forEach(x => body.push(BUL(x)));
/* ---------------- 5. çizim ve sunum kuralları ---------------- */
body.push(H1("5. Çizim ve sunum kuralları"));
["A3 yatay, tek PDF dosyası. Dosya adı: AdSoyad_AlanAnalizi.pdf",
 "Her çizimde kuzey oku ve ölçek çubuğu bulunacak. Ölçeği ayrıca yazın.",
 "DWG'den türetilen çizimler ölçekli olacak. Serbest el çizimlerin üzerine \"ölçeksiz\" yazın.",
 "Siyah-beyaz çalışın; en fazla tek bir vurgu rengi kullanın.",
 "Her paftanın sağ alt köşesinde ad soyad, öğrenci numarası ve pafta kodu olacak.",
 "Fotoğraflar anahtar plan üzerinde numaralandırılacak ve bakış yönü koni ile gösterilecek.",
 "Son sayfada fotoğraf künyesi: numara, tarih, saat, bakış yönü.",
 "El çizimi serbesttir ve teşvik edilir. Taranmış el çizimi tam puan alır."
].forEach(x => body.push(BUL(x)));

/* ---------------- 6. doğrulama verileri ---------------- */
body.push(H1("6. Doğrulama verileri"));
body.push(P("Güneş analizinizi aşağıdaki değerlerle karşılaştırın. Çiziminiz bu değerlerle tutmuyorsa analiz yanlıştır; düzeltin.", { after: 140 }));
const W6 = [2600, 2400, 2400, 2238];
body.push(table(W6, [
  headRow(["Tarih", "Öğle vakti güneş yüksekliği", "Gölge katsayısı (1 m için)", "Gündoğumu yönü"], W6),
  new TableRow({ children: [cell("21 Haziran", { w: W6[0], b: true }), cell("≈ 77°", { w: W6[1] }),
    cell("≈ 0,24 m", { w: W6[2] }), cell("≈ 60° (kuzeydoğu)", { w: W6[3] })] }),
  new TableRow({ children: [cell("21 Mart / 23 Eylül", { w: W6[0], b: true, fill: ZEB }),
    cell("≈ 53°", { w: W6[1], fill: ZEB }), cell("≈ 0,75 m", { w: W6[2], fill: ZEB }),
    cell("90° (tam doğu)", { w: W6[3], fill: ZEB })] }),
  new TableRow({ children: [cell("21 Aralık", { w: W6[0], b: true }), cell("≈ 30°", { w: W6[1] }),
    cell("≈ 1,75 m", { w: W6[2] }), cell("≈ 120° (güneydoğu)", { w: W6[3] })] })
]));
body.push(SPACE(80));
body.push(P("Mersin Marina'nın yaklaşık konumu: 36°47′ kuzey, 34°34′ doğu. Değerler bu enleme göre hesaplanmıştır; kendi koordinatınızı haritadan doğrulayın.", { sz: 19, c: "5A6270" }));
body.push(P("İklim ve rüzgâr verisi için: Meteoroloji Genel Müdürlüğü (mgm.gov.tr) — Mersin istasyonu, uzun yıllar ortalamaları ve rüzgâr gülü. Veriyi kaynak göstererek kullanın, ekran görüntüsü yapıştırmayın; kendiniz yeniden çizin.", { sz: 19, c: "5A6270" }));

/* ---------------- 7. yapay zekâ ---------------- */
body.push(H1("7. Yapay zekâ kullanımı"));
body.push(box([
  "Bu ödevde yapay zekâ kullanılmayacaktır.",
  "Metin, çizim, diyagram, harita ve şemaların tamamı sizin üretiminiz olacak. Yapay zekâ ile üretilmiş görsel, metin veya diyagram kabul edilmez. İnternetten indirilmiş hazır analiz diyagramları da kullanılamaz."
], { bFirst: true }));
body.push(SPACE(100));
body.push(H2("Neden"));
body.push(P("Bu ödevin konusu bakmayı öğrenmek. Analizi bir araca yaptırırsanız öğrenmeniz gereken tek şeyi atlamış olursunuz. Ayrıca yapay zekâ Mersin Marina'ya gitmedi; siz gittiniz. Bu ödevin tek gerçek kaynağı sizin gözünüz ve kendi görüntüleriniz."));
body.push(H2("Serbest olanlar"));
["Uydu ve hava fotoğrafı — kaynak göstererek, altlık olarak",
 "Resmî kurum verileri (MGM gibi) — kaynak göstererek, yeniden çizerek",
 "Verilen AutoCAD altlığı",
 "Kendi çektiğiniz fotoğraf ve videolar",
 "Basılı ve akademik kaynaklar — kaynakçada belirterek"].forEach(x => body.push(BUL(x)));
body.push(H2("Nasıl denetlenecek"));
["Kritikte paftanızdaki her çizgiyi açıklamanız beklenir. Açıklayamadığınız bölüm değerlendirmeye alınmaz.",
 "Fotoğraf künyesi zorunludur: her fotoğrafın tarihi, saati ve bakış yönü yazılacak.",
 "Teslimde imzalı beyan verilecek (son sayfadaki metin)."].forEach(x => body.push(BUL(x)));

/* ---------------- 8. değerlendirme ---------------- */
body.push(H1("8. Değerlendirme ölçütleri"));
const W8 = [6838, 2800];
body.push(table(W8, [
  headRow(["Ölçüt", "Ağırlık"], W8),
  new TableRow({ children: [cell("Gözlemin doğruluğu ve kanıta dayanması — kendi fotoğrafınız, ölçünüz, sayımınız", { w: W8[0] }), cell("%30", { w: W8[1], b: true })] }),
  new TableRow({ children: [cell("Çizim ve diyagram dilinin netliği — ölçek, kuzey, okunabilirlik, hiyerarşi", { w: W8[0], fill: ZEB }), cell("%25", { w: W8[1], b: true, fill: ZEB })] }),
  new TableRow({ children: [cell("Bulguların tasarım girdisine dönüşmesi — özellikle E2 paftası", { w: W8[0] }), cell("%25", { w: W8[1], b: true })] }),
  new TableRow({ children: [cell("Bütünlük ve teslim disiplini — eksiksiz set, zamanında teslim", { w: W8[0], fill: ZEB }), cell("%20", { w: W8[1], b: true, fill: ZEB })] })
]));

/* ---------------- 9. sık yapılan hatalar ---------------- */
body.push(H1("9. Sık yapılan hatalar"));
["İnternetten indirilmiş bir vaziyet planını analiz sanmak. Altlık analiz değildir; üzerine sizin koyduğunuz bilgi analizdir.",
 "Kuzey oku ve ölçek çubuğu koymamak.",
 "\"Yaya akışı yoğun\" yazıp sayı vermemek. Yoğunluk bir sayıdır.",
 "On beş paftayı güzelleştirip hiçbirinden sonuç çıkarmamak.",
 "Marinayı analiz edip birimin kendisine hiç inmemek — ya da tersi.",
 "Gece durumunu hiç çalışmamak. Marina akşam canlanır; vitrininizin gece görünümü gündüzünden önemli olabilir.",
 "Fotoğrafı anahtar plana bağlamamak. Nereden çekildiği belli olmayan fotoğraf kanıt değildir.",
 "Tuzlu havayı ve açık hava olmasını atlamak. Kapalı AVM için doğru olan malzeme burada iki yılda biter."
].forEach(x => body.push(BUL(x)));

/* ---------------- 10. beyan ---------------- */
body.push(H1("10. Teslimde verilecek beyan"));
body.push(P("Aşağıdaki metni kitapçığınızın son sayfasına yazıp imzalayın.", { after: 140 }));
body.push(box([
  "Bu alan analizi çalışmasının tamamı tarafımdan üretilmiştir. Kullandığım fotoğraf ve videolar 6 Ekim 2026 tarihli alan gezisinde kendim tarafından çekilmiştir. Çizim, diyagram ve metinlerin üretiminde yapay zekâ kullanılmamıştır. Yararlandığım kaynakları kaynakçada belirttim.",
  "",
  "Ad Soyad:  ……………………………………        Numara:  ……………………        İmza:  ……………………",
], { fill: "F4F6F8", c: HDR }));

/* ---------------- belge ---------------- */
const doc = new Document({
  creator: "Kapadokya Üniversitesi · İç Mimarlık ve Çevre Tasarımı",
  title: "Alan Analizi Ödevi — İç Mimari Proje III",
  numbering: { config: [
    { reference: "mermi", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 340, hanging: 200 } },
                 run: { font: FONT, size: 20 } } }] },
    { reference: "sayi", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 240 } },
                 run: { font: FONT, size: 20 } } }] }
  ]},
  sections: [{
    properties: { page: { margin: {
      top: convertMillimetersToTwip(20), bottom: convertMillimetersToTwip(18),
      left: convertMillimetersToTwip(20), right: convertMillimetersToTwip(20) } } },
    children: body
  }]
});

Packer.toBuffer(doc).then(b => {
  require("fs").writeFileSync("Alan-Analizi-Odevi.docx", b);
  console.log("ok");
});
