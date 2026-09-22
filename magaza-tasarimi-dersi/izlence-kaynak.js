const d = require("docx");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
  LevelFormat, convertMillimetersToTwip, PageBreak, VerticalAlign
} = d;

/* ---------- ayarlar ---------- */
const FONT = "Calibri";
const HDR  = "44546A";   // tablo başlık zemini
const ZEB  = "F2F4F6";   // şerit zemin
const ACC  = "8C3A2B";   // vurgu
const LINE = "BFC7CF";

const CW = 9638;         // içerik genişliği (DXA)

/* ---------- yardımcılar ---------- */
const P = (text, o = {}) => new Paragraph({
  alignment: o.al || AlignmentType.LEFT,
  spacing: { before: o.before === undefined ? 0 : o.before, after: o.after === undefined ? 100 : o.after,
             line: o.line || 276 },
  indent: o.indent,
  border: o.border,
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
  spacing: { before: 320, after: 140 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ACC, space: 4 } },
  children: [new TextRun({ text, font: FONT, size: 26, bold: true, color: "1A1A1A" })]
});
const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 220, after: 90 },
  children: [new TextRun({ text, font: FONT, size: 22, bold: true, color: ACC })]
});
const BUL = (text, o = {}) => new Paragraph({
  numbering: { reference: "mermi", level: 0 },
  spacing: { after: 60, line: 264 },
  children: [new TextRun({ text, font: FONT, size: o.sz || 20, bold: !!o.b, color: "1A1A1A" })]
});
const NUM = (text) => new Paragraph({
  numbering: { reference: "sayi", level: 0 },
  spacing: { after: 60, line: 264 },
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
function table(colWidths, rows, o = {}) {
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
    rows: rows
  });
}
function headRow(labels, widths) {
  return new TableRow({
    tableHeader: true,
    children: labels.map((l, i) => cell(l, { w: widths[i], fill: HDR, head: true, b: true, sz: 18 }))
  });
}
function kv(k, v) {
  return new TableRow({ children: [
    cell(k, { w: 2600, b: true, sz: 19, fill: "F7F8F9" }),
    cell(v, { w: 7038, sz: 19 })
  ]});
}

/* ================== BELGE İÇERİĞİ ================== */
const body = [];

/* --- başlık --- */
body.push(new Paragraph({
  spacing: { after: 40 },
  children: [new TextRun({ text: "KAPADOKYA ÜNİVERSİTESİ", font: FONT, size: 20, bold: true,
    color: ACC, characterSpacing: 40 })]
}));
body.push(P("Mimarlık, Tasarım ve Güzel Sanatlar Fakültesi · İç Mimarlık ve Çevre Tasarımı Bölümü",
  { sz: 19, c: "5A6270", after: 220 }));
body.push(new Paragraph({
  spacing: { after: 60 },
  children: [new TextRun({ text: "İÇ MİMARİ PROJE III", font: FONT, size: 40, bold: true })]
}));
body.push(new Paragraph({
  spacing: { after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACC, space: 8 } },
  children: [new TextRun({ text: "Ders İzlencesi  ·  2026–2027 Güz Yarıyılı", font: FONT, size: 24,
    color: "5A6270" })]
}));
body.push(P("Dönem projesi: Ana akım olmayan bir markanın Mersin Marina'daki ilk fiziksel mağazası.",
  { sz: 21, i: true, c: "5A6270", after: 240 }));

/* --- 1. öğretim elemanları --- */
body.push(H1("1. Öğretim Elemanları"));
body.push(table([2600, 2600, 2400, 2038], [
  headRow(["Ad Soyad", "E-posta", "Ofis", "Ofis Saati"], [2600, 2600, 2400, 2038]),
  new TableRow({ children: [
    cell("………………………… (Koordinatör)", { w: 2600 }), cell("…………………………", { w: 2600 }),
    cell("…………………", { w: 2400 }), cell("…………………", { w: 2038 })]}),
  new TableRow({ children: [
    cell("…………………………", { w: 2600, fill: ZEB }), cell("…………………………", { w: 2600, fill: ZEB }),
    cell("…………………", { w: 2400, fill: ZEB }), cell("…………………", { w: 2038, fill: ZEB })]}),
  new TableRow({ children: [
    cell("…………………………", { w: 2600 }), cell("…………………………", { w: 2600 }),
    cell("…………………", { w: 2400 }), cell("…………………", { w: 2038 })]})
]));
body.push(SPACE(80));
body.push(P("Görüşme talebi için en az 24 saat önce e-posta ile randevu alınması gerekir. Görüşmeler en fazla 15 dakikadır.",
  { sz: 18, i: true, c: "5A6270" }));

/* --- 2. ders bilgileri --- */
body.push(H1("2. Ders Bilgileri"));
body.push(table([2600, 7038], [
  kv("Dersin kodu ve adı", "……………… — İç Mimari Proje III"),
  kv("Yarıyıl", "2026–2027 Güz"),
  kv("Gün ve saat", "Salı, 09.30–17.30 (8 saat) · Sabah seansı 09.30–12.30 · Öğleden sonra seansı 13.30–17.30"),
  kv("Kredi / AKTS", "……… / ………"),
  kv("Stüdyo", "………………………"),
  kv("Öğretim şekli", "Yüz yüze"),
  kv("Ders türü", "Zorunlu"),
  kv("Ön koşul", "İç Mimari Proje II dersini almış olmak zorunludur."),
  kv("Öğretim dili", "Türkçe"),
  kv("Süre", "14 hafta + final jürisi")
]));

/* --- 3. amaç --- */
body.push(H1("3. Dersin Amacı"));
body.push(P("Bu ders, öğrencileri kullanıcı ihtiyaçlarını karşılayan; fiziksel, sosyal ve ekonomik kısıtları gözeten karmaşık mekânsal kurguları tasarlamaya, planlamaya ve uygulamaya hazırlar. Öğrenciler veri çözümleme, bilgiyi sentezleme ve çok işlevli mekânsal çözümler üretme becerilerini geliştirir. Kullanıcı odaklı tasarım vurgusuyla; güncel araçlar, yapım teknikleri ve mekânsal donatılar üzerinde yetkinlik kazanır."));
body.push(P("Dersin ayırt edici odağı, bir markanın kimliğinin çözümlenip mekânsal bir dile çevrilmesidir. Temel konular: insan–çevre ilişkisi, kullanıcı ihtiyaç ve profilleri, deneyimsel perakende mekânı tasarımı, duyusal tasarım, kullanıcı sağlığı ve güvenliği, evrensel ve sürdürülebilir tasarım, sosyal ve kültürel haklara saygı."));

/* --- 4. öğrenme çıktıları --- */
body.push(H1("4. Öğrenme Çıktıları"));
body.push(P("Dersi başarıyla tamamlayan öğrenci:", { after: 80 }));
[
 "Marka kimliğiyle uyumlu, perakende ve sergileme gereksinimlerini karşılayan karmaşık mekânsal kurgular tasarlar, planlar ve uygular.",
 "Bir markanın kimliğini araştırma yoluyla çözümler; anahtar kelimelere indirger ve bunları mekânsal tasarım kararlarına çevirir.",
 "Kullanıcı profilini ihtiyaç, değer ve davranış üzerinden tanımlar; müşteri yolculuğunu haritalayarak tasarım kararlarını buna dayandırır.",
 "Soyut ve somut kavramları kullanarak yaratıcı, yenilikçi, estetik ve çok işlevli mekânsal çözümler geliştirir.",
 "Deneyimi görme, işitme, dokunma, koku ve hareket üzerinden kurar; atmosferi malzeme, ışık, renk ve doku ile tanımlar.",
 "Fiziksel ve dijital temas noktalarını deneyimi destekleyecek biçimde bütünleştirir.",
 "Çağdaş teknolojik araçları bilgiye erişmek ve fikirlerini temsil etmek için etkin biçimde kullanır.",
 "Güncel mekânsal donatı ve yapım tekniklerini tasarımda uygular; teknik çizim, üç boyutlu model ve detay üretir.",
 "İnsan–çevre ilişkisini, kullanıcı sağlık ve güvenliğini, evrensel tasarım ilkelerini ve sürdürülebilirliği önceliklendirir.",
 "Yasal düzenlemeler, standartlar, meslek etiği ve sorumlulukları konusunda bilgi sahibi olur."
].forEach(x => body.push(NUM(x)));

/* --- 5. proje --- */
body.push(H1("5. Dönem Projesi"));
body.push(H2("5.1. Proje tanımı"));
body.push(P("Perakende mekânları çağdaş iç mimarlığın en dinamik alanlarından biridir; güncel kalabilmek için sürekli yenilenmeyi gerektirir. Bu dönem, ana akım olmayan ve henüz yerleşik bir tasarım dili bulunmayan bir markanın ilk fiziksel mağazasını tasarlayacaksınız."));
body.push(P("Tasarım problemi, perakende mekânı içinde etkileşimli ve duyularla desteklenen bir mekânsal deneyim geliştirmeyi gerektirir. Teknolojinin bu deneyimi nasıl daha sarmalayıcı ve tatmin edici hâle getirebileceği önemli bir tasarım sorusudur."));
body.push(RUNS([["Proje alanı: ", "b"], ["Mersin Marina. Alanın metrekaresi, kat sayısı, tavan yüksekliği ve cephe uzunluğu 2. haftadaki alan gezisinde yerinde ölçülerek paylaşılacaktır."]]));

body.push(H2("5.2. Tasarımda çözülmesi zorunlu alanlar"));
[
 "Giriş ve marka eşiği — marka kimliğini anlatan, güçlü bir ilk izlenim kuran cephe ve giriş sekansı.",
 "Sergileme alanları — görünürlüğü ve erişimi destekleyen, farklı teşhir senaryolarına açık esnek sistemler.",
 "Dolaşım ve mekânsal akış — müşteri hareketini yönlendiren, keşfi teşvik eden açık ve sezgisel kurgu.",
 "Satış ve kasa bölgesi — etkileşimi güçlendiren, satın alma sürecini kesintisiz kılan bütünleşik çözüm.",
 "Depolama ve arka alan — lojistiği ve stok yönetimini sorunsuz kılan, metrekaresi gerekçelendirilmiş çözüm.",
 "Personel alanları — günlük işleyişi ve çalışan konforunu destekleyen işlevsel ve ergonomik mekânlar.",
 "Deneyim ve etkileşim alanları — duyusal, dijital ya da sarmalayıcı yollarla müşteri bağını güçlendiren bölgeler.",
 "Malzeme ve mimari öğeler — marka kimliğini pekiştiren yüzey, ışık ve strüktürel jestler."
].forEach(x => body.push(BUL(x)));

body.push(H2("5.3. Öğrencilerden beklenenler"));
[
 "Verilen seçenekler arasından az bilinen bir perakende markası seçmek.",
 "Alan gezisine katılmak, araştırma yapmak, kendi parametrelerini tanımlayarak bir senaryo kurmak ve senaryonun aşamalarını ortaya koymak.",
 "Seçilen markanın misyonunu, hedeflerini, faaliyetlerini ve gereksinimlerini araştırmak; kimliğini hedef kitleye etkili biçimde aktarmak.",
 "Araştırmanın görsel ve sözlü sunumunu hazırlayıp tüm stüdyoyla paylaşmak.",
 "Verilen alanı ve potansiyelini çözümlemek: yakın çevre, dolaşım, yön kullanımı, manzara, mekânsal hacim, gün ışığı.",
 "Deneyim tasarımı, kullanıcı odaklılık, erişilebilirlik, sürdürülebilirlik, geçicilik, yenilikçi yapım teknolojileri ve malzeme başlıklarındaki tartışmalara katılmak.",
 "Mekânsal ve işlevsel gereksinimlere göre bir iç mimari program geliştirmek.",
 "Kendi tanımladığı sınırlar içinde, maket ve çizimlerle mekânsal organizasyon şeması geliştirmek.",
 "Malzeme, aydınlatma, renk ve dokuyu gözeterek mekânın atmosferi ve markanın kimliği üzerine çalışmak.",
 "Uygulamaya yönelik yapım ve mobilya detayları, malzeme ve renk önerileri geliştirmek.",
 "Müzik, koku gibi diğer duyusal nitelikleri araştırmak, geliştirmek ve tasarıma dâhil etmek.",
 "Teknik çizimleri hazırlamak, üç boyutlu fiziksel ve sanal modeller ile animasyonlar üretip jüride görsel ve sözlü olarak sunmak."
].forEach(x => body.push(BUL(x)));

/* --- 6. yürütülme --- */
body.push(H1("6. Dersin Yürütülme Biçimi"));
body.push(P("Bu ders, haftada 8 saat yüz yüze yürütülen bir stüdyo dersidir ve öğrencinin yürütücü gözetiminde etkin biçimde üretmesini gerektirir. Ders 14 hafta boyunca her salı 09.30–17.30 saatleri arasında, biri sabah biri öğleden sonra olmak üzere iki seans hâlinde yapılır."));
body.push(P("Proje, yürütücülerin kritikleriyle; eskiz, maket ve detaylı çizimler üzerinden geliştirilir. Her aşamada yaratıcılığın farklı bir yönünü zorlayan tasarım problemleri çalışılır ve değerlendirilir. Hem tasarım süreci hem de değerlendirme (jüri) oturumları eğitsel süreçlerdir; bu nedenle jürilere katılım zorunludur."));

body.push(SPACE(100));
body.push(new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [CW],
  borders: {
    top:    { style: BorderStyle.SINGLE, size: 2, color: ACC },
    left:   { style: BorderStyle.SINGLE, size: 18, color: ACC },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: ACC },
    right:  { style: BorderStyle.SINGLE, size: 2, color: ACC },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
    insideVertical:   { style: BorderStyle.NONE, size: 0, color: "auto" }
  },
  rows: [new TableRow({ children: [new TableCell({
    width: { size: CW, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: "F6EAE6", color: "auto" },
    margins: { top: 130, bottom: 130, left: 200, right: 160 },
    children: [
      new Paragraph({ spacing: { after: 70 }, children: [new TextRun({
        text: "Kritik ve teslim zorunluluğu", font: FONT, size: 21, bold: true, color: ACC })] }),
      new Paragraph({ spacing: { after: 0, line: 270 }, children: [new TextRun({
        text: "Her ders günü en az bir kritik almak ve bir teslim yapmak zorunludur. Teslim, o hafta için takvimde belirtilen çalışmanın çizim, eskiz, maket ya da dijital çıktı olarak stüdyoda hazır bulundurulmasıdır. Elinde işi olmayan öğrenci kritik almış sayılmaz. Kritikler ve teslimler yürütücü tarafından kayıt altına alınır ve stüdyo süreç performansı notuna doğrudan yansır.",
        font: FONT, size: 19 })] })
    ]
  })]})]
}));
body.push(SPACE(140));

body.push(H2("Kullanılan öğretim yöntem ve teknikleri"));
body.push(P("Proje · Vaka çalışması · Anlatım · Tartışma · Bireysel çalışma · Alan gezisi · Saha çalışması · Gözlem · Problem çözme · Uygulama · İşbirlikli öğrenme · Konuk konuşmacı · Teknoloji destekli öğrenme"));

/* --- 7. kurallar --- */
body.push(H1("7. Ders Kuralları"));

body.push(H2("7.1. İletişim"));
body.push(BUL("Ders dışındaki iletişim e-posta üzerinden yürütülür."));
body.push(BUL("Sohbet diliyle yazılmış e-postalar yanıtlanmaz. Üniversite öğrencisi olduğunuzu gözeterek yazınız."));
body.push(BUL("Duyurular ders platformu üzerinden yapılır; duyuruları takip etmek öğrencinin sorumluluğundadır."));

body.push(H2("7.2. Dijital araçların kullanımı"));
body.push(BUL("Telefon, tablet ve dizüstü bilgisayar yalnızca ders amacıyla kullanılabilir."));
body.push(BUL("Telefonlar ders başlamadan önce sessize alınmalı ya da kapatılmalıdır. Zorunlu bir durumda sınıf dışına çıkarak görüşünüz."));

body.push(H2("7.3. Ödev ve teslimler"));
body.push(BUL("Tüm teslimler (ara jüriler, final sunumları ve ödevler dâhil) ders platformuna yüklenir."));
body.push(BUL("Ödevlerin, görevlerin, duyuruların ve teslim tarihlerinin takibi öğrencinin sorumluluğundadır."));
body.push(BUL("Ödevlerinizi yürütücülere e-posta ile göndermeyiniz; e-posta ile gönderilen ödevler kabul edilmez."));
body.push(BUL("Geç teslimler kabul edilmez. Ödevi tamamlayamayacak durumdaysanız, teslim tarihinden önce yürütücünüze durumu bildiriniz."));
body.push(BUL("Dijital teslimlerinizi yükledikten sonra indirip içeriğini kontrol ediniz. Bozuk ya da boş dosyaların sorumluluğu öğrenciye aittir."));

body.push(H2("7.4. Jüriler"));
body.push(BUL("Jüriler dersin sınavlarıdır. Jürilere katılmak ve sözlü sunum yapmak zorunludur."));
body.push(BUL("Final jürisinde projesini teslim edip sunmayan öğrenci, süreci tamamlamamış sayılacağından dersten geçemez."));
body.push(BUL("Ara jüriler ve final jürisi belirtilen tarihlerde yüz yüze yapılır."));
body.push(BUL("Platforma teslim eden ancak jüride sunum yapmayan öğrenci jüriden başarısız sayılır."));
body.push(BUL("Sağlık sorunu nedeniyle jüriye katılamayan ve resmî kurumdan alınmış onaylı raporu bulunan öğrenci, ilan edilen teslim saatinde o ana kadar ürettiği çalışmayı (eksik dahi olsa) yüklemekle yükümlüdür. Süreç temelli bir stüdyo dersi olduğundan hiçbir çalışma yüklemeyen öğrenci kapalı jüri dâhil değerlendirmeye alınamaz."));
body.push(BUL("Sağlık raporları yalnızca jüri teslimleri için geçerlidir; devamsızlığı telafi etmez ve devam durumunu etkilemez."));

body.push(H2("7.5. Devam"));
body.push(BUL("Öğrencinin derslerin en az %80'ine devam etmesi zorunludur."));
body.push(BUL("Her ders günü, biri sabah biri öğleden sonra seansında olmak üzere iki kez ıslak imza alınır (araştırma sunumu, ara jüri ve final jürisi günleri dâhil). İmza listelerini imzalamak ve takip etmek öğrencinin sorumluluğundadır."));
body.push(BUL("Ders 09.30'da başlar ve 17.30'da biter; öğrencinin bu süre boyunca stüdyoda bulunması beklenir. Sonradan imza talepleri kabul edilmez."));
body.push(BUL("Devamsızlık sınırını aşan öğrenci final jürisine giremez ve dersten NA ile başarısız olur."));

body.push(H2("7.6. Katılım"));
body.push(BUL("Süreç temelli bir ders olduğundan öğrencinin derse aktif katılımı, gelişimin izlenmesi açısından belirleyicidir."));
body.push(BUL("Aktif katılım, dönem sonunda verilecek stüdyo süreç performansı notunun önemli bir bölümünü oluşturur."));
body.push(BUL("Kendi kritiğiniz dışında diğer kritikleri de dinlemeniz önemle tavsiye edilir."));
body.push(BUL("Haftalık teslimini yapmayan öğrenci o gün için kritik almamış sayılır; bu durum süreç performansı notuna yansır."));
body.push(BUL("Kritik alabilmek için gerekli tüm ortamların, maketlerin ve üç boyutlu görsellerin stüdyo saatinde hazır bulundurulması gerekir."));

body.push(H2("7.7. Diğer hükümler"));
body.push(BUL("Derse yalnızca kayıtlı öğrenciler ve yürütücüler katılabilir."));
body.push(BUL("Telafi dersleri gerektiğinde yürütücü tarafından düzenlenir ve duyurulur."));
body.push(BUL("Engelli öğrenci desteği: görme, işitme vb. nedenlerle güçlük yaşayan öğrenciler doğrudan ders koordinatörüyle ve üniversitenin engelli öğrenci birimiyle iletişime geçmelidir."));
body.push(BUL("Sözlü ve yazılı iletişimde; arkadaşlarınızla ve yürütücülerle saygılı bir dil kullanmakla yükümlüsünüz."));
body.push(BUL("Kişisel Verilerin Korunması Kanunu uyarınca, kayıt yapılması hâlinde bu ancak bilgi ve onayınız dâhilinde olur. Ders sırasında katılımcıların izinsiz kaydedilmesi kesinlikle yasaktır."));

/* --- 8. değerlendirme --- */
body.push(H1("8. Değerlendirme"));
body.push(P("Öğrencinin değerlendirilmesinde genel performans, gelişim, yaratıcılık, problem çözme, tasarıma katkı, tasarım niteliği ve grafik anlatım niteliği birlikte gözetilir. Dönemin tamamı; iki ara jüri, bir final jürisi ve stüdyo süreç performansı üzerinden değerlendirilir."));
body.push(SPACE(60));
body.push(table([3400, 3438, 1200, 1600], [
  headRow(["Değerlendirme", "Açıklama", "Puan", "Ağırlık"], [3400, 3438, 1200, 1600]),
  new TableRow({ children: [
    cell("Araştırma Sunumu", { w: 3400, b: true }),
    cell("5. hafta · 27 Ekim 2026", { w: 3438 }),
    cell("100", { w: 1200, al: AlignmentType.CENTER }),
    cell("%15", { w: 1600, al: AlignmentType.CENTER, b: true })]}),
  new TableRow({ children: [
    cell("Ara Jüri", { w: 3400, b: true, fill: ZEB }),
    cell("10. hafta · 1 Aralık 2026", { w: 3438, fill: ZEB }),
    cell("100", { w: 1200, al: AlignmentType.CENTER, fill: ZEB }),
    cell("%30", { w: 1600, al: AlignmentType.CENTER, b: true, fill: ZEB })]}),
  new TableRow({ children: [
    cell("Final Jürisi", { w: 3400, b: true }),
    cell("Final sınav haftası · tarih fakülte takvimiyle duyurulacak", { w: 3438 }),
    cell("100", { w: 1200, al: AlignmentType.CENTER }),
    cell("%40", { w: 1600, al: AlignmentType.CENTER, b: true })]}),
  new TableRow({ children: [
    cell("Stüdyo Süreç Performansı", { w: 3400, b: true, fill: ZEB }),
    cell("Yarıyıl boyunca kritik ve teslim düzenliliği, katılım ve gelişim", { w: 3438, fill: ZEB }),
    cell("100", { w: 1200, al: AlignmentType.CENTER, fill: ZEB }),
    cell("%15", { w: 1600, al: AlignmentType.CENTER, b: true, fill: ZEB })]}),
  new TableRow({ children: [
    cell("TOPLAM", { w: 3400, b: true, fill: "E8EBEE" }),
    cell("", { w: 3438, fill: "E8EBEE" }),
    cell("—", { w: 1200, al: AlignmentType.CENTER, fill: "E8EBEE" }),
    cell("%100", { w: 1600, al: AlignmentType.CENTER, b: true, fill: "E8EBEE" })]})
]));

body.push(SPACE(140));
body.push(new Table({
  width: { size: CW, type: WidthType.DXA },
  columnWidths: [CW],
  borders: {
    top:    { style: BorderStyle.SINGLE, size: 2, color: ACC },
    left:   { style: BorderStyle.SINGLE, size: 18, color: ACC },
    bottom: { style: BorderStyle.SINGLE, size: 2, color: ACC },
    right:  { style: BorderStyle.SINGLE, size: 2, color: ACC },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
    insideVertical:   { style: BorderStyle.NONE, size: 0, color: "auto" }
  },
  rows: [new TableRow({ children: [new TableCell({
    width: { size: CW, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: "F6EAE6", color: "auto" },
    margins: { top: 130, bottom: 130, left: 200, right: 160 },
    children: [
      new Paragraph({ spacing: { after: 70 }, children: [new TextRun({
        text: "Başarı koşulu", font: FONT, size: 21, bold: true, color: ACC })] }),
      new Paragraph({ spacing: { after: 0, line: 270 }, children: [new TextRun({
        text: "Dersten başarılı sayılmak için yarıyıl sonu başarı notunun en az 60 puan olması gerekir. 60 puan CC harf notuna karşılık gelir. Bu puanın altında kalan öğrenci, jürilere katılmış olsa dahi dersten başarısız sayılır.",
        font: FONT, size: 19 })] })
    ]
  })]})]
}));
body.push(SPACE(140));

body.push(H2("Jüri değerlendirme ölçütleri"));
body.push(P("1. Tasarım fikri ve konsept · 2. Tasarımın geliştirilmesi · 3. Mekânsal program ve işlevsellik · 4. Mekânsal kurgu ve organizasyon · 5. Mekânın atmosferi ve kimliği · 6. Detay önerileri · 7. Görsel sunum niteliği ve yeterliliği · 8. Sözlü sunum becerisi · 9. Sürece uygunluk ve zamanlama · 10. Eksiksiz ve zamanında teslim"));

/* --- 9. takvim --- */
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(H1("9. Ders Takvimi"));
body.push(P("Dersler her salı 09.30–17.30 saatleri arasında yapılır. Sabah seansı 09.30–12.30, öğleden sonra seansı 13.30–17.30'dur.",
  { sz: 19, i: true, c: "5A6270", after: 140 }));

const CAL = [
  ["1. Hafta\n29 Eylül 2026 · Salı",
   "Oryantasyon",
   ["Ders akışı, izlence ve ders kuralları",
    "Proje brifi",
    "Teorik anlatım: marka kimliği, kullanıcı profili ve müşteri yolculuğu",
    "Sınıf içi çalışma ve tartışma"],
   ["Üç aday marka araştırması", "A3 üç marka karşılaştırma paftası", "Teslim: 6 Ekim"]],

  ["2. Hafta\n6 Ekim 2026 · Salı\nMersin Marina",
   "Alan Gezisi",
   ["Alanın yerinde incelenmesi: ölçü, fotoğraf, yaya akışı, yön, manzara, gün ışığı, komşu birimler",
    "Aday markaların sunumu ve marka seçimi"],
   ["Alan analizi", "Marka anahtarı ve kullanıcı profili", "Teslim: 13 Ekim"]],

  ["3. Hafta\n13 Ekim 2026 · Salı",
   "Araştırma, Analiz ve Konsept Geliştirme",
   ["Kritikler"],
   ["Alan analizi paftaları", "Marka anahtarı", "Kullanıcı profili", "Müşteri yolculuğu haritası"]],

  ["4. Hafta\n20 Ekim 2026 · Salı",
   "Araştırma, Analiz ve Konsept Geliştirme",
   ["Kritikler"],
   ["Üç anahtar kelime ve gerekçeleri", "Mekânsal program ve m² dağılımı", "Senaryo ve konsept panosu"]],

  ["5. Hafta\n27 Ekim 2026 · Salı",
   "ARAŞTIRMA SUNUMLARI",
   ["Sunumlar ve kritikler"],
   ["Teslim: marka anahtarı, kullanıcı profili, müşteri yolculuğu haritası, senaryo, anahtar kelimeler ve konsept panosu"]],

  ["6. Hafta\n3 Kasım 2026 · Salı",
   "Konsept Geliştirme / Mekânsal Yerleşim",
   ["Kritikler"],
   ["Program öğelerinin dağılımı", "1/100 zoning şeması", "1/50 plan ve kesitler", "Kavramsal 3B modeller"]],

  ["7. Hafta\n10 Kasım 2026 · Salı",
   "Konsept Geliştirme / Mekânsal Yerleşim",
   ["Kritikler"],
   ["Cephe, vitrin, giriş ve eşik", "1/50 plan, kesit ve cephe", "Kavramsal 3B modeller"]],

  ["8. Hafta\n17 Kasım 2026 · Salı",
   "Tasarım Geliştirme",
   ["Kritikler"],
   ["Kasa, kasa arkası, depo ve personel alanı", "Servis rotası ve dolaşım", "1/50 plan ve kesitler"]],

  ["9. Hafta\n24 Kasım 2026 · Salı",
   "Tasarım Geliştirme",
   ["Kritikler"],
   ["1/50 plan, kesit ve cephe", "1/50 tavan ve aydınlatma planı", "Malzeme paneli", "3B görseller"]],

  ["10. Hafta\n1 Aralık 2026 · Salı",
   "ARA JÜRİ",
   ["Jüri sunumları ve değerlendirme"],
   ["Teslim gereklilikleri ayrıca paylaşılacaktır"]],

  ["11. Hafta\n8 Aralık 2026 · Salı",
   "Tasarım Geliştirme",
   ["Kritikler"],
   ["Revize 1/50 set", "1/20 kısmi plan ve kesit", "Malzeme, doku, renk ve aydınlatma kararları"]],

  ["12. Hafta\n15 Aralık 2026 · Salı",
   "Detay Tasarımı",
   ["Bireysel kritikler"],
   ["1/20 kısmi plan ve kesit", "Mobilya ve teşhir birimi", "1/10–1/5 detaylar", "Malzeme ve birleşim"]],

  ["13. Hafta\n22 Aralık 2026 · Salı",
   "Detay Tasarımı",
   ["Bireysel kritikler"],
   ["1/20 plan ve kesitler", "1/10–1/5 detaylar", "3B görseller", "Malzeme, aydınlatma ve renk"]],

  ["14. Hafta\n29 Aralık 2026 · Salı",
   "Sunum Detayları ve Tamlık",
   ["Bireysel kritikler"],
   ["Final teslim paketinin tamamlanması", "Pafta kurgusu ve maket", "Sözlü sunum provası"]],

  ["FİNAL JÜRİSİ\nFinal sınav haftası",
   "FİNAL JÜRİSİ",
   ["Tarih ve saat fakülte sınav takvimiyle duyurulacaktır."],
   ["Teslim: analiz ve konsept özeti, 1/50 plan, en az iki kesit, cephe, tavan planı, 1/20 kısmi plan ve kesit, en az bir adet 1/10–1/5 detay, malzeme paneli ve lejant, en az beş iç mekân görseli ve bir gece cephesi, fiziksel maket, erişilebilirlik notu"]]
];

const CW1 = 1750, CW2 = 2300, CW3 = 2794, CW4 = 2794;
const calRows = [headRow(["Hafta / Tarih", "Ders Konusu", "Yapılacaklar", "Ödev ve Teslim Tarihi*"],
  [CW1, CW2, CW3, CW4])];
CAL.forEach((r, i) => {
  const jury = r[1].toUpperCase() === r[1];
  const fill = jury ? "F6EAE6" : (i % 2 ? ZEB : undefined);
  calRows.push(new TableRow({ children: [
    cell(r[0].split("\n"), { w: CW1, fill, bFirst: true, sz: 17, c: jury ? ACC : undefined }),
    cell(r[1], { w: CW2, fill, b: jury, sz: 18, c: jury ? ACC : undefined }),
    cell(r[2], { w: CW3, fill, sz: 17 }),
    cell(r[3], { w: CW4, fill, sz: 17 })
  ]}));
});
body.push(table([CW1, CW2, CW3, CW4], calRows));
body.push(SPACE(80));
body.push(P("* Teslim tarihleri ve saatleri ders platformunda ayrıca duyurulur. Geç teslimler kabul edilmez.",
  { sz: 17, i: true, c: "5A6270", after: 40 }));
body.push(P("Her ders günü en az bir kritik alınması ve o hafta için belirtilen teslimin yapılması zorunludur.",
  { sz: 17, i: true, c: "5A6270", after: 40 }));
body.push(P("Telafi dersleri: gerektiğinde yürütücü tarafından düzenlenir ve duyurulur.",
  { sz: 17, i: true, c: "5A6270" }));

/* --- 10. kaynaklar --- */
body.push(H1("10. Ders Kaynakları"));
[
 "Klanten, R., Ehmann, S. ve Borges, S. (ed.) (2013). Brand Spaces: Branded Architecture and the Future of Retail Design. Gestalten.",
 "Mesher, L. (2010). Basics Interior Design: Retail Design. AVA Publishing.",
 "Wheeler, A. (2017). Designing Brand Identity (5. baskı). Wiley.",
 "Schittich, C. (ed.) (2002). Interior Spaces: Space, Light, Material. Edition Detail.",
 "Panero, J. ve Zelnik, M. (1979). Human Dimension and Interior Space. Watson-Guptill.",
 "De Chiara, J., Panero, J. ve Zelnik, M. (ed.) (2001). Time-Saver Standards for Interior Design and Space Planning. McGraw-Hill.",
 "Sunar Bükülmez, P., Girginkaya Akdağ, S. ve Ekin, G. (2025). Retail Design Competencies and Customer Journey Mapping Tools. The International Journal of Design Education, 19(2), 25–50.",
 "Stickdorn, M., Hormess, M., Lawrence, A. ve Schneider, J. (2018). This Is Service Design Doing. O'Reilly.",
 "Kotler, P. (1973). Atmospherics as a Marketing Tool. Journal of Retailing, 49(4), 48–64.",
 "Bitner, M. J. (1992). Servicescapes: The Impact of Physical Surroundings on Customers and Employees. Journal of Marketing, 56(2), 57–71.",
 "Pallasmaa, J. (2005). Tenin Gözleri: Mimarlık ve Duyular. YEM Yayın.",
 "Underhill, P. (2008). Why We Buy: The Science of Shopping. Simon & Schuster."
].forEach(x => body.push(BUL(x, { sz: 19 })));

/* --- 11. not dönüşüm --- */
body.push(H1("11. Not Dönüşüm Tablosu"));
const grades = [["100–90","AA"],["89–80","BA"],["79–70","BB"],["69–65","CB"],["64–60","CC"],
                ["59–55","DC"],["54–50","DD"],["49–40","FD"],["39–0","FF"]];
const gw = [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1238];
const gRows = [];
for (let i = 0; i < grades.length; i += 4) {
  const chunk = grades.slice(i, i + 4);
  const cells = [];
  chunk.forEach(g => {
    cells.push(cell(g[0], { w: 1200, al: AlignmentType.CENTER, sz: 18, fill: "F7F8F9" }));
    cells.push(cell(g[1], { w: 1200, al: AlignmentType.CENTER, sz: 18, b: true }));
  });
  while (cells.length < 8) {
    cells.push(cell("", { w: 1200, fill: "F7F8F9" }));
    cells.push(cell("", { w: 1200 }));
  }
  gRows.push(new TableRow({ children: cells.slice(0, 8) }));
}
body.push(table([1200,1200,1200,1200,1200,1200,1200,1238], gRows));
body.push(SPACE(60));
body.push(P("Ders başarı notu / Harf notu karşılıkları.", { sz: 17, i: true, c: "5A6270", after: 40 }));
body.push(P("Dersten başarılı sayılmak için en az 60 puan (CC) alınması zorunludur.",
  { sz: 19, b: true, c: ACC, after: 40 }));
body.push(P("Harf notu aralıkları üniversitenin yürürlükteki ölçme ve değerlendirme yönetmeliğine göre uygulanır. Ders kapsamında şüpheli bir durum oluşması hâlinde ek ölçme ve değerlendirme yöntemleri uygulanır.",
  { sz: 17, i: true, c: "5A6270" }));

/* --- 12. akademik dürüstlük --- */
body.push(H1("12. Akademik Dürüstlük, Kopya ve İntihal"));
body.push(P("İntihal, bir başkasının sözlerini ya da çalışmasını kendine aitmiş gibi göstererek okuyucuyu yanıltmaya yönelik planlı ve kasıtlı bir eylemdir. Akademik intihal, yazılı bir kaynaktan tırnak işareti kullanmadan ve özgün kaynağa açık atıf yapmadan alıntı yapmayı da kapsar."));
body.push(P("Bilim camiasında yayın etiğine aykırı sayılan davranışlar şunlardır:", { after: 60 }));
body.push(BUL("İntihal, kopya, uygun atıf yapmadan başkasının ifadelerini yeniden yazma."));
body.push(BUL("Veri uydurma ve çarpıtma."));
body.push(BUL("Kopya ve intihale yardım etme; başkalarının bir kaynağa ya da veriye erişimini engelleme."));
body.push(BUL("Ortak çalışmalara katkı vermeden yazar olarak görünme."));
body.push(BUL("Düzenli atıf yapmama ve kendinden intihal."));
body.push(P("İnternette bulunan her şey kamuya açık değildir; izin ya da atıf olmaksızın kullanılamaz. Uygun atıf yapılmadan hazırlanan çalışmalar sıfır puanla değerlendirilir. Alıntılanmadan kopyalanan geniş metinler intihal sayılır ve sorumluluğu öğrenciye aittir.",
  { before: 80 }));
body.push(P("Sınav, ödev veya diğer değerlendirme etkinliklerinde kopya çekildiği, kopyaya teşebbüs edildiği, intihal yapıldığı ya da benzeri ihlallerin gerçekleştiği yönünde şüphe oluşması hâlinde öğrenci hakkında disiplin soruşturması açılır. Soruşturma süresince söz konusu çalışma değerlendirilmez. Suçlu bulunan öğrenciye disiplin cezasının yanı sıra sıfır puan verilir. Soruşturma sonucunda suçsuz bulunması hâlinde öğrencinin çalışması değerlendirilir ya da kendisine telafi imkânı tanınır."));
body.push(P("Yukarıda belirtilen ders koşulları, değişen durumlara göre güncellenebilir.",
  { sz: 18, i: true, c: "5A6270", before: 120 }));

/* --- imza --- */
body.push(SPACE(240));
body.push(P("Hazırlayan", { sz: 18, c: "5A6270", after: 40 }));
body.push(P("…………………………………………", { b: true, after: 40 }));
body.push(P("İç Mimarlık ve Çevre Tasarımı Bölümü", { sz: 18, c: "5A6270", after: 40 }));
body.push(P("Eylül 2026", { sz: 18, c: "5A6270" }));

/* ================== BELGE ================== */
const doc = new Document({
  numbering: {
    config: [
      { reference: "mermi", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 340, hanging: 200 } } } }] },
      { reference: "sayi", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 400, hanging: 260 } } } }] }
    ]
  },
  styles: { default: { document: { run: { font: FONT, size: 20, color: "1A1A1A" } } } },
  sections: [{
    properties: { page: { margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } } },
    children: body
  }]
});

Packer.toBuffer(doc).then(buf => {
  require("fs").writeFileSync("IcMimariProje3-Ders-Izlencesi-2026-2027-Guz.docx", buf);
  console.log("yazildi:", buf.length, "bayt");
});
