const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE";                 // 13.333 x 7.5
p.title  = "Marka Anahtarını Okumak ve Müşteri Deneyimini Haritalamak";

/* ===================== TEK RENK + TONLARI ===================== */
const PAPER = "F7F4EF";   // zemin
const INK   = "222220";   // başlık
const BODY  = "4A423E";   // gövde metni
const MUTED = "7A6A62";   // ikincil metin
const HAIR  = "D6CCC3";   // ince çizgi
const LIGHT = "EDE5DE";   // açık dolgu
const ACC   = "A85C43";   // vurgu
const ACCD  = "7E4230";   // koyu vurgu
const WHITE = "FFFFFF";

/* ===================== TEK FONT ===================== */
const F = "Calibri";

/* ===================== IZGARA ===================== */
const M   = 0.78;                  // sol pay
const R   = 12.55;                 // sağ kenar
const FW   = R - M;                // 11.77
const CT  = 2.35;                  // içerik üst hattı
const CB  = 6.72;                  // içerik alt hattı
let n = 0;

/* ===================== TEMEL ÖĞELER ===================== */
function rect(s, x, y, w, h, o) {
  o = o || {};
  s.addShape(p.ShapeType.rect, { x, y, w, h,
    fill: o.fill ? { color: o.fill } : { type: "none" },
    line: o.line === false ? { type: "none" }
        : { color: o.stroke || HAIR, width: o.lw || 0.75, dashType: o.dash || "solid" } });
}
function line(s, x1, y1, x2, y2, o) {
  o = o || {};
  s.addShape(p.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2),
    w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    line: { color: o.col || HAIR, width: o.w || 0.75, dashType: o.dash || "solid" } });
}
function arrow(s, x1, y1, x2, y2, o) {
  o = o || {};
  s.addShape(p.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2),
    w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: x2 < x1, flipV: y2 < y1,
    line: { color: o.col || ACC, width: o.w || 1.25, endArrowType: "triangle" } });
}
function t(s, str, x, y, w, h, o) {                  // tek metin fonksiyonu
  o = o || {};
  s.addText(str, { x, y, w, h, isTextBox: true, margin: 0, fontFace: F,
    fontSize: o.sz || 11, bold: !!o.b, italic: !!o.i, color: o.c || BODY,
    align: o.al || "left", valign: o.va || "top",
    lineSpacing: o.ls || (o.sz || 11) * 1.28, charSpacing: o.cs || 0 });
}
// numaralı kare işaret
function tag(s, x, y, str, o) {
  o = o || {};
  const d = o.d || 0.26;
  rect(s, x, y, d, d, { fill: o.fill || ACC, line: false });
  t(s, str, x, y, d, d, { sz: o.sz || 9.5, b: true, c: o.tc || WHITE, al: "center", va: "middle" });
}

/* ===================== SLAYT İSKELETİ ===================== */
function page(kicker, title, lead, o) {
  o = o || {};
  const s = p.addSlide();
  s.background = { color: PAPER };
  n += 1;
  t(s, kicker, M, 0.44, 9.0, 0.24, { sz: 9, b: true, c: ACC, cs: 2.6 });
  t(s, String(n).padStart(2, "0"), 12.05, 0.44, 0.5, 0.24, { sz: 9, b: true, c: HAIR, al: "right" });
  t(s, title, M, 0.72, 11.2, 0.68, { sz: o.ts || 27, b: true, c: INK, ls: (o.ts || 27) * 1.14 });
  line(s, M, 1.52, M + 1.3, 1.52, { col: ACC, w: 1.75 });
  if (lead) t(s, lead, M, 1.7, o.lw || 10.6, 0.56, { sz: 14, c: BODY, ls: 19 });
  return s;
}
function foot(s, str) {
  t(s, str, M, 6.92, 10.4, 0.3, { sz: 8.5, i: true, c: MUTED });
}
function cover() {
  const s = p.addSlide();
  s.background = { color: INK };
  return s;
}
// bölüm ayırıcı
function divider(nu, title, sub) {
  const s = p.addSlide();
  s.background = { color: INK };
  n += 1;
  rect(s, 0, 0, 0.3, 7.5, { fill: ACC, line: false });
  t(s, nu, M + 0.2, 2.5, 2.0, 1.0, { sz: 64, b: true, c: ACC });
  t(s, title, M + 0.2, 3.6, 10.6, 0.9, { sz: 34, b: true, c: WHITE, ls: 40 });
  if (sub) t(s, sub, M + 0.2, 4.7, 9.6, 0.7, { sz: 15, c: "B9B0A8", ls: 21 });
  return s;
}

/* ===================== DİKDÖRTGEN ŞEMALAR ===================== */
// kart ızgarası · items: [başlık, açıklama] · o.cols, o.numbered, o.hi (index dizisi)
function cards(s, items, y, h, o) {
  o = o || {};
  const cols = o.cols || items.length;
  const gap = o.gap === undefined ? 0.22 : o.gap;
  const rows = Math.ceil(items.length / cols);
  const w = (FW - gap * (cols - 1)) / cols;
  const rh = o.rh || h;
  items.forEach((it, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const x = M + c * (w + gap), yy = y + r * (rh + gap);
    const hi = o.hi ? o.hi.indexOf(i) >= 0 : false;
    rect(s, x, yy, w, rh, { fill: hi ? ACC : LIGHT, line: false });
    let ty = yy + 0.2;
    if (o.numbered) {
      tag(s, x + 0.2, ty, String(i + 1).padStart(2, "0"),
        { fill: hi ? WHITE : ACC, tc: hi ? ACC : WHITE, d: 0.3, sz: 9.5 });
      ty += 0.44;
    }
    t(s, it[0], x + 0.2, ty, w - 0.4, 0.4, { sz: o.hs || 13.5, b: true,
      c: hi ? WHITE : INK, ls: (o.hs || 13.5) * 1.14 });
    const th = (it[0].length > 22 ? 0.5 : 0.28);
    if (it[1]) t(s, it[1], x + 0.2, ty + th, w - 0.4, rh - (ty - yy) - th - 0.14,
      { sz: o.bs || 10.5, c: hi ? "F0DED7" : MUTED, ls: (o.bs || 10.5) * 1.28 });
  });
  return y + rows * (rh + gap) - gap;
}
// yatay dikdörtgen zincir · items: dizi ya da [ad, altbilgi]
function chain(s, items, y, h, o) {
  o = o || {};
  const gap = o.gap === undefined ? 0.3 : o.gap;
  const w = (FW - gap * (items.length - 1)) / items.length;
  items.forEach((it, i) => {
    const x = M + i * (w + gap);
    const hi = o.hi ? o.hi.indexOf(i) >= 0 : false;
    const nm = Array.isArray(it) ? it[0] : it;
    const sub = Array.isArray(it) ? it[1] : null;
    rect(s, x, y, w, h, { fill: hi ? ACC : LIGHT, line: false });
    if (o.numbered) {
      t(s, String(i + 1).padStart(2, "0"), x + 0.16, y + 0.14, w - 0.32, 0.24,
        { sz: 9, b: true, c: hi ? "E8C9BE" : ACC, cs: 1.2 });
    }
    t(s, nm, x + 0.16, y + (o.numbered ? 0.42 : 0.16), w - 0.32, sub ? 0.4 : h - 0.3,
      { sz: o.hs || 12.5, b: true, c: hi ? WHITE : INK, ls: (o.hs || 12.5) * 1.14 });
    if (sub) t(s, sub, x + 0.16, y + (o.numbered ? 0.86 : 0.6), w - 0.32,
      h - (o.numbered ? 1.0 : 0.74), { sz: o.bs || 10, c: hi ? "F0DED7" : MUTED, ls: (o.bs || 10) * 1.26 });
    if (i < items.length - 1 && gap > 0.18)
      arrow(s, x + w + 0.05, y + h / 2, x + w + gap - 0.05, y + h / 2, { col: ACC, w: 1.2 });
  });
  return y + h;
}
// tam genişlik bölmeli şerit
function band(s, items, y, h, o) {
  o = o || {};
  const gap = 0.04;
  const w = (FW - gap * (items.length - 1)) / items.length;
  items.forEach((it, i) => {
    const x = M + i * (w + gap);
    const hi = o.hi ? o.hi.indexOf(i) >= 0 : false;
    rect(s, x, y, w, h, { fill: hi ? ACC : LIGHT, line: false });
    t(s, it, x + 0.08, y, w - 0.16, h, { sz: o.sz || 11, b: true,
      c: hi ? WHITE : (o.c || ACC), al: "center", va: "middle", cs: o.cs || 0.8,
      ls: (o.sz || 11) * 1.2 });
  });
  return y + h;
}
// dikdörtgen hücreli tablo · cols: [[başlık, genişlik], ...]
function table(s, cols, rows, y, o) {
  o = o || {};
  const rh = o.rh || 0.62, gap = 0.04;
  let x = M;
  const xs = cols.map(c => { const cx = x; x += c[1] + gap; return cx; });
  cols.forEach((c, j) => t(s, c[0], xs[j] + (j ? 0.14 : 0), y, c[1], 0.24,
    { sz: 8.5, b: true, c: MUTED, cs: 1.5 }));
  line(s, M, y + 0.3, R, y + 0.3, { col: HAIR, w: 1 });
  rows.forEach((row, i) => {
    const yy = y + 0.38 + i * (rh + gap);
    row.forEach((cell, j) => {
      const first = j === 0;
      rect(s, xs[j], yy, cols[j][1], rh, { fill: first ? ACC : LIGHT, line: false });
      t(s, cell, xs[j] + 0.14, yy, cols[j][1] - 0.28, rh,
        { sz: first ? (o.ks || 13) : (o.cs2 || 11), b: first || !!o.bold2 && j === 1,
          c: first ? WHITE : BODY, va: "middle", ls: (first ? 15 : 14) });
    });
  });
  return y + 0.38 + rows.length * (rh + gap) - gap;
}
// etiket + ince çizgi
function rule(s, x, y, w, str, o) {
  o = o || {};
  const tw = 0.082 * str.length + 0.12;
  t(s, str, x, y - 0.15, tw, 0.3, { sz: 8.5, b: true, c: o.c || MUTED, cs: 1.6 });
  if (w > tw + 0.2) line(s, x + tw + 0.06, y, x + w, y, { col: o.lc || HAIR, w: 0.75 });
}
// anahtar–değer satırları (çizgisiz)
function list(s, items, x, y, w, o) {
  o = o || {};
  const rh = o.rh || 0.52;
  items.forEach((it, i) => {
    const yy = y + i * rh;
    rect(s, x, yy + 0.09, 0.1, 0.1, { fill: ACC, line: false });
    t(s, it[0], x + 0.26, yy, o.kw || 2.0, 0.3, { sz: o.sz || 12, b: true, c: INK });
    if (it[1]) t(s, it[1], x + 0.26 + (o.kw || 2.0) + 0.16, yy + 0.01, w - 0.42 - (o.kw || 2.0), 0.4,
      { sz: o.sz || 12, c: BODY, ls: (o.sz || 12) * 1.26 });
    if (i < items.length - 1 && o.sep !== false)
      line(s, x + 0.26, yy + rh - 0.1, x + w, yy + rh - 0.1, { col: HAIR, w: 0.5 });
  });
  return y + items.length * rh;
}

/* ===================== 01 KAPAK ===================== */
{
  const s = cover();
  rect(s, 0, 0, 0.3, 7.5, { fill: ACC, line: false });
  t(s, "MAĞAZA TASARIMI  ·  İÇ MİMARLIK 3. SINIF  ·  İLK DERS", M + 0.2, 1.35, 10.6, 0.26,
    { sz: 10, b: true, c: ACC, cs: 3 });
  t(s, "Marka Anahtarını Okumak\nve Müşteri Deneyimini Haritalamak", M + 0.2, 1.85, 11.2, 1.9,
    { sz: 40, b: true, c: WHITE, ls: 50 });
  t(s, "Araştırmadan mekânsal tasarım kararına", M + 0.2, 3.95, 10.0, 0.4,
    { sz: 17, c: "B9B0A8" });

  const st = ["MARKA", "KULLANICI", "DENEYİM", "MEKÂN"];
  const gap = 0.04, w = (11.2 - gap * 3) / 4;
  st.forEach((x2, i) => {
    const x = M + 0.2 + i * (w + gap);
    rect(s, x, 4.9, w, 0.56, { fill: i === 3 ? ACC : "33312E", line: false });
    t(s, x2, x, 4.9, w, 0.56, { sz: 12, b: true, c: i === 3 ? WHITE : "B9B0A8",
      al: "center", va: "middle", cs: 1.6 });
  });
  t(s, "Markayı oku  →  kullanıcıyı anla  →  deneyimi haritala  →  mekâna çevir",
    M + 0.2, 5.62, 11.2, 0.3, { sz: 11.5, c: MUTED });
}

/* ===================== 02 DERSİN ÇERÇEVESİ ===================== */
{
  const s = page("01 · DERSİN ÇERÇEVESİ", "Ders izlencesinden bugünkü sunuma",
    "İzlencede okuduğumuz dört eksen, bu sunumun da omurgası. Bugün bu dört ekseni birbirine bağlayan yöntemi kuruyoruz.");

  cards(s, [
    ["Marka kimliği", "Markayı araştırmak ve kimliğini çözümlemek."],
    ["Kullanıcı", "Kullanıcının ihtiyaç, değer ve davranışlarını anlamak."],
    ["Deneyim", "Etkileşim, duyular ve müşteri yolculuğunu tasarlamak."],
    ["Mekân", "Kimliği atmosfer, malzeme, ışık ve mekânsal kurguya çevirmek."]
  ], 2.5, 1.85, { cols: 4, numbered: true, hi: [3] });

  rule(s, M, 4.75, FW, "İZLENCEDEKİ ÖĞRENME ÇIKTILARIYLA BAĞI");
  t(s, "İzlence, karmaşık mekânsal kurguları marka kimliğiyle uyumlu biçimde tasarlamayı, kullanıcı odaklı çözüm üretmeyi, güncel teknolojik araçları kullanmayı ve evrensel tasarım ile sürdürülebilirliği gözetmeyi bekliyor. Bu sunum, o beklentileri günlük stüdyo pratiğine çeviren yöntemi anlatıyor.",
    M, 4.98, FW, 0.9, { sz: 13.5, c: BODY, ls: 19 });

  band(s, ["ARAŞTIR", "SENTEZLE", "HARİTALA", "ÇEVİR", "SINA"], 6.1, 0.52, { sz: 11, cs: 1.6 });
  s.addNotes("Syllabus anlatımından hemen sonra bu slaytla sunuma geçin: izlence ne istiyor, sunum onu nasıl yapılır hâle getiriyor.");
}

/* ===================== 03 BEKLENTİLER ===================== */
{
  const s = page("02 · BEKLENTİLER", "Bu derste sizden ne bekliyorum?",
    "Tasarımın yalnızca görsel olarak etkileyici olması değil, gerekçelendirilebilir olması önemli.");

  cards(s, [
    ["Marka analizi", "Markanın misyonunu, değerlerini, ürünlerini ve kimliğini araştırmak."],
    ["Kullanıcı odağı", "Kullanıcı profilini ihtiyaç, değer ve davranışlarıyla anlamak."],
    ["Deneyim ve duyular", "Mekânı görme, dokunma, işitme, koku ve hareket üzerinden düşünmek."],
    ["Teknoloji entegrasyonu", "Fiziksel ve dijital temasları deneyimi destekleyecek biçimde kurmak."],
    ["Mekânsal kimlik", "Kimliği atmosfer, malzeme, ışık, renk, doku ve kurguya çevirmek."],
    ["Uygulanabilirlik", "Ergonomi, operasyon, depolama, dolaşım ve detay kararlarını gözetmek."]
  ], 2.5, 1.8, { cols: 3, numbered: true, hi: [2] });

  t(s, "Bu altı başlık dönem boyunca her kritikte ve her jüride sorulacak.",
    M, 6.44, FW, 0.3, { sz: 13.5, b: true, c: ACC });
  foot(s, "Kaynak: İç Mimari Tasarım III ders izlencesi, öğrenme çıktıları.");
  s.addNotes("Üçüncü kart vurgulu: duyusal deneyim bu dersin ayırt edici talebi.");
}

/* ===================== 04 PROJE ===================== */
{
  const s = page("03 · PROJE", "Bu dönem ne tasarlıyoruz?",
    "Ana akım olmayan bir markanın ilk fiziksel mağazasını, etkileşimli ve duyusal bir mekânsal deneyim olarak kuracaksınız.");

  const y = list(s, [
    ["Marka", "Ana akım olmayan, tasarım dili henüz oturmamış bir marka — sizin bulacağınız."],
    ["Mekân", "Proje alanı bizim tarafımızdan verilecek; ölçüler alan ziyaretinde kesinleşir."],
    ["Deneyim", "Etkileşimli, duyularla desteklenen ve teknolojiyle bütünleşmiş mekânsal deneyim."],
    ["Ölçek", "Bireysel proje; dönem boyunca tek marka üzerinden derinleşme."]
  ], M, 2.5, 6.6, { kw: 1.5, sz: 12.5, rh: 0.66 });

  rule(s, M, 5.42, 6.6, "TASARLAMAK ZORUNDA OLDUĞUNUZ İŞLEVLER", { c: ACC, lc: HAIR });
  t(s, "Vitrin ve sergileme  ·  giriş ve eşik  ·  dolaşım  ·  deneyim alanı  ·  bilgi ve tanıtım  ·  satış ve kasa  ·  depolama ve stok  ·  personel",
    M, 5.62, 6.6, 0.8, { sz: 12, c: BODY, ls: 17 });

  rect(s, 7.72, 2.5, 4.83, 2.55, { fill: ACC, line: false });
  t(s, "TEMEL SORU", 8.0, 2.78, 4.27, 0.26, { sz: 9, b: true, c: "E8C9BE", cs: 2 });
  t(s, "Markanın kimliğini, kullanıcının ihtiyaçlarını ve ürünün doğasını nasıl tek bir mekânsal dilde birleştiririz?",
    8.0, 3.15, 4.27, 1.7, { sz: 17, b: true, c: WHITE, ls: 24 });

  rect(s, 7.72, 5.25, 4.83, 1.17, { fill: LIGHT, line: false });
  t(s, "TASARIM KAPSAMI", 8.0, 5.45, 4.27, 0.26, { sz: 9, b: true, c: ACC, cs: 2 });
  t(s, "Atmosfer · kimlik · malzeme · ışık · renk · doku · mobilya · duyusal nitelikler",
    8.0, 5.74, 4.27, 0.6, { sz: 11.5, c: BODY, ls: 16 });
  foot(s, "Proje kapsamı ders izlencesindeki gerekliliklerden sadeleştirilerek çıkarılmıştır.");
  s.addNotes("Alanın m²'si, kat sayısı ve tavan yüksekliği alan ziyaretinde verilecek — burada bilinçli olarak boş.");
}

/* ===================== 05 TASARIM MANTIĞI ===================== */
{
  const s = page("04 · TASARIM MANTIĞI", "Tasarım çizimle başlamıyor.",
    "Önce anlamı ve kullanıcıyı çözüyoruz; sonra bunu mekânsal karara dönüştürüyoruz.");

  chain(s, [
    ["Araştır", "marka · ürün · kullanıcı · rakip"],
    ["Sentezle", "temel değerler ve üç anahtar kelime"],
    ["Haritala", "müşterinin mekândaki yolculuğu"],
    ["Çevir", "kelimeyi malzeme · ışık · dolaşım · sergileme kararına"],
    ["Sına", "karar marka ve kullanıcıyla örtüşüyor mu?"]
  ], 2.6, 1.85, { numbered: true, gap: 0.3, hi: [3], hs: 15, bs: 10.5 });

  rule(s, M, 5.0, FW, "BU SUNUMUN AKIŞI DA AYNI SIRAYI İZLİYOR");
  const steps = [
    ["Araştır", "Marka anahtarı · araştırma kaynakları · kullanıcı profili"],
    ["Sentezle", "Anahtar kelime ölçütleri · örnek vaka"],
    ["Haritala", "Müşteri yolculuğu · sekiz aşama · iç mimarlık modülleri"],
    ["Çevir", "Kelime → mekânsal tasarım kararı"],
    ["Sına", "Sınıf çalışması ve ödev"]
  ];
  const w = (FW - 0.22 * 4) / 5;
  steps.forEach((st, i) => {
    const x = M + i * (w + 0.22);
    t(s, st[0], x, 5.26, w, 0.26, { sz: 11.5, b: true, c: ACC });
    t(s, st[1], x, 5.54, w, 0.9, { sz: 10.5, c: MUTED, ls: 13.5 });
  });
  s.addNotes("Beş adımı tahtaya yazın; dönem boyunca kritiklerde 'hangi adımdasın' diye sorun.");
}

/* ===================== 06 MARKA ANAHTARI ===================== */
{
  const s = page("05 · MARKA ANALİZİ", "Marka Anahtarı nedir?",
    "Bir markanın özünü belirli başlıklar altında çözümlemeye yarayan çerçeve. İki grupta okunur, tek bir özde toplanır.");

  rule(s, M, 2.5, FW, "MARKANIN BAĞLAMI — DIŞARIDAN GELEN", { c: ACC, lc: HAIR });
  chain(s, [
    ["Rekabet", "Başka hangi seçenekler var?"],
    ["Hedef kullanıcı", "Kime sesleniyor?"],
    ["Amaçlar", "Neyi başarmak istiyor?"]
  ], 2.68, 1.0, { gap: 0.04, hs: 13, bs: 10.5 });

  rule(s, M, 4.04, FW, "MARKANIN İFADESİ — KENDİ KURDUĞU", { c: ACC, lc: HAIR });
  cards(s, [
    ["Misyon", "Var olma nedeni"],
    ["Değerler", "Neye inanıyor?"],
    ["Faydalar", "İşlevsel ve duygusal olarak ne sunuyor?"],
    ["Kişilik", "Bir insan olsaydı nasıl biri olurdu?"],
    ["Görsel dil", "Renk · biçim · malzeme · görüntü"],
    ["İletişim tonu", "Nasıl konuşuyor?"]
  ], 4.22, 1.05, { cols: 6, gap: 0.04, hs: 12, bs: 9.5 });

  rect(s, M, 5.72, FW, 0.7, { fill: ACC, line: false });
  t(s, "ÖZ", M + 0.24, 5.72, 0.6, 0.7, { sz: 10, b: true, c: "E8C9BE", va: "middle", cs: 1.8 });
  t(s, "Müşterinin aklında kalmasını istediğimiz temel anlam — en son yazılır.",
    M + 1.0, 5.72, 10.5, 0.7, { sz: 15, b: true, c: WHITE, va: "middle" });
  foot(s, "Kaynak: Sunar Bükülmez, Girginkaya Akdağ ve Ekin (2025), Marka Anahtarı Analizi aracı (I-AM İstanbul).");
  s.addNotes("Öz bağımsız yazılamaz: yukarıdaki dokuz başlığın sonucu.");
}

/* ===================== 07 ARAŞTIRMA ===================== */
{
  const s = page("06 · ARAŞTIRMA", "Bir markanın kimliğini nasıl çıkarırız?",
    "Bir logo ya da birkaç güzel görsel yeterli değil. Farklı kaynaklardan kanıt toplarız.");

  cards(s, [
    ["Web sitesi", "Misyon · ürün dili · değerler"],
    ["Sosyal medya", "Görsel dil · iletişim · kullanıcı"],
    ["Ürün", "Malzeme · biçim · fiyat · kullanım"],
    ["Kullanıcı yorumları", "Beklenti · memnuniyet · sorunlar"],
    ["Rakipler", "Farklılaşma · konum · fırsat"],
    ["Gözlem", "Gerçek davranış · temas · bağlam"]
  ], 2.5, 1.62, { cols: 3, numbered: true, hi: [5] });

  rect(s, M, 6.02, FW, 0.62, { fill: LIGHT, line: false });
  t(s, "Araştırmanın amacı çok bilgi toplamak değil; aynı anlamı farklı kanıtlarda görebilmek.",
    M + 0.24, 6.02, 11.3, 0.62, { sz: 14, b: true, c: ACC, va: "middle" });
  foot(s, "Kaynak: Sunar Bükülmez vd. (2025), marka analizi ve kullanıcı profili bölümleri.");
  s.addNotes("Altıncı kaynak vurgulu: gözlem olmadan diğer beşi iddia düzeyinde kalır.");
}

/* ===================== 08 KULLANICI ===================== */
{
  const s = page("07 · KULLANICI", "Kullanıcı profilini nasıl anlarız?",
    "Demografik bilgi başlangıçtır; tasarım için asıl önemli olan ihtiyaç, değer ve davranıştır.");

  cards(s, [
    ["Kim?", "Yaş · yaşam biçimi · sosyo-ekonomik bağlam"],
    ["Neye değer veriyor?", "Değerler · öncelikler · inançlar"],
    ["Neye ihtiyacı var?", "İşlevsel ve duygusal ihtiyaçlar"],
    ["Nasıl davranıyor?", "Arıyor · karşılaştırıyor · seçiyor · bekliyor"],
    ["Ne hissediyor?", "Merak · güven · huzursuzluk · aidiyet"],
    ["Ne bekliyor?", "Hız · keşif · kişisellik · kolaylık"]
  ], 2.5, 1.62, { cols: 3, numbered: true, hi: [3] });

  rect(s, M, 6.02, FW, 0.62, { fill: LIGHT, line: false });
  t(s, "Davranışı yazılabilen kullanıcı, mekânsal karar üretir: süre, erişim, bilgi, mahremiyet.",
    M + 0.24, 6.02, 11.3, 0.62, { sz: 14, b: true, c: ACC, va: "middle" });
  foot(s, "Kaynak: Sunar Bükülmez vd. (2025), kullanıcı profili ve persona yaklaşımı.");
  s.addNotes("Dördüncü kart vurgulu: davranış, tasarıma en doğrudan çevrilen bilgi.");
}

/* ===================== 09 SENTEZ ===================== */
{
  const s = page("08 · SENTEZ", "Anahtar kelimeyi nasıl belirleriz?",
    "Kelime, markayı tarif etmekten öte tasarım kararını yönlendirebilmelidir.");

  cards(s, [
    ["Özgül", "Her markaya uyacak kadar genel olmamalı."],
    ["Kanıtlı", "Araştırmada karşılığı bulunmalı."],
    ["Çevrilebilir", "Mekânda somut bir karşılığı kurulabilmeli."]
  ], 2.5, 1.35, { cols: 3, numbered: true });

  rule(s, M, 4.32, FW, "BU DERS İÇİN KULLANACAĞIMIZ ÖRNEK KELİMELER", { c: ACC, lc: HAIR });
  const kw = ["CESUR", "DOĞAL", "SÜRDÜRÜLEBİLİR"];
  const w = (FW - 0.04 * 2) / 3;
  kw.forEach((k, i) => {
    const x = M + i * (w + 0.04);
    rect(s, x, 4.52, w, 0.92, { fill: ACC, line: false });
    t(s, k, x, 4.52, w, 0.92, { sz: 26, b: true, c: WHITE, al: "center", va: "middle", cs: 2 });
  });

  rect(s, M, 5.66, FW, 0.98, { fill: LIGHT, line: false });
  t(s, "Bu üç kelime bir markayı tarif etmekle kalmaz; her biri malzeme, ışık, dolaşım ve sergileme kararına çevrilebilir. Bir sonraki slaytta tam olarak bunu yapacağız.",
    M + 0.24, 5.78, 11.3, 0.8, { sz: 13.5, c: BODY, ls: 19 });
  s.addNotes("Üç kelime dönem boyunca örnek olarak kullanılacak; öğrenci kendi markası için kendi üçlüsünü bulacak.");
}

/* ===================== 10 VAKA: MARKA ===================== */
{
  const s = page("09 · VAKA", "Varsayımsal yerel seramik markası",
    "Yöntemi tek bir örnek üzerinden birlikte okuyalım.");

  const y = list(s, [
    ["Ürün", "El yapımı seramik ev ve sofra ürünleri"],
    ["Kullanıcı", "Kentin yoğunluğu içinde yavaş ve anlamlı seçim yapmak isteyen kişi"],
    ["Değerler", "Yerellik · zanaat · uzun kullanım"],
    ["Kişilik", "Özenli · açık sözlü · malzemeye yakın"],
    ["Görsel dil", "Mat yüzey · toprak tonları · elle yapılmışın izi"]
  ], M, 2.5, 7.0, { kw: 1.5, sz: 12.5, rh: 0.62 });

  rect(s, M, 5.72, 7.0, 0.9, { fill: ACC, line: false });
  t(s, "MARKANIN ÖZÜ", M + 0.24, 5.86, 6.5, 0.24, { sz: 9, b: true, c: "E8C9BE", cs: 2 });
  t(s, "Gündelik yaşama üretim ve malzeme duygusu katmak", M + 0.24, 6.12, 6.5, 0.4,
    { sz: 16, b: true, c: WHITE });

  rule(s, 8.12, 2.5, 4.43, "ARAŞTIRMADAN ÇIKAN ÜÇ KELİME", { c: ACC, lc: HAIR });
  const kw = [["CESUR", "karakterli · görünür"], ["DOĞAL", "malzemeye yakın · yalın"],
              ["SÜRDÜRÜLEBİLİR", "uzun ömürlü · esnek"]];
  kw.forEach((k, i) => {
    const yy = 2.72 + i * 1.02;
    rect(s, 8.12, yy, 4.43, 0.9, { fill: LIGHT, line: false });
    t(s, k[0], 8.36, yy + 0.14, 3.95, 0.36, { sz: 17, b: true, c: ACC, cs: 1.2 });
    t(s, k[1], 8.36, yy + 0.52, 3.95, 0.26, { sz: 11, c: MUTED });
  });
  t(s, "Üçü de araştırmadaki kanıta dayanıyor: ürünün malzemesi, üretim biçimi ve kullanıcının seçim nedeni.",
    8.12, 5.86, 4.43, 0.76, { sz: 11.5, c: BODY, ls: 16 });
  foot(s, "Vaka varsayımsaldır; öğrencinin düşünme biçimini göstermek için oluşturulmuştur.");
  s.addNotes("Bu vakayı dönem boyunca ortak referans olarak kullanın.");
}

/* ===================== 11 TASARIMA GEÇİŞ (toplu) ===================== */
{
  const s = page("10 · TASARIMA GEÇİŞ", "Kelimeden mekânsal karara",
    "Amaç kelimeyi forma çevirmek değil, tasarım kriterine çevirmek. Aynı karar birden fazla kelimeyi taşıyabilir.");

  table(s, [["ANAHTAR KELİME", 2.4], ["NE ANLAMA GELİYOR", 2.7], ["TASARIM KRİTERİ", 2.7], ["MEKÂNDAKİ KARŞILIĞI", 3.83]], [
    ["CESUR", "Karakterli · görünür · güçlü",
     "Vurgu öğesi", "Tek ve belirgin bir mekânsal jest: üretim tezgâhı ya da merkezî sergileme"],
    ["DOĞAL", "Malzemeye yakın · sıcak · yalın",
     "Malzeme ve ışık", "Doğal doku, boyasız yüzey, gün ışığını destekleyen aydınlatma"],
    ["SÜRDÜRÜLEBİLİR", "Uzun ömürlü · az atık · esnek",
     "Sistem ve işletme", "Sökülebilir sergileme birimi, uyarlanabilir düzen, onarılabilir detay"]
  ], 2.5, { rh: 1.0, ks: 14, cs2: 11.5 });

  rect(s, M, 6.0, FW, 0.66, { fill: LIGHT, line: false });
  t(s, "Sınama sorusu: bu karar, kelimeyi bilmeyen birine de aynı şeyi anlatıyor mu?",
    M + 0.24, 6.0, 11.3, 0.66, { sz: 14, b: true, c: ACC, va: "middle" });
  s.addNotes("Bu slayt kelime–karar ilişkisinin tek referansı; başka slaytta tekrar anlatmıyoruz.");
}

/* ===================== 12 MÜŞTERİ YOLCULUĞU NEDİR ===================== */
{
  const s = page("11 · MÜŞTERİ DENEYİMİ", "Müşteri Yolculuğu Haritası nedir?",
    "Marka ile kullanıcının temas ettiği anları bir hikâye gibi görmemizi sağlar. Her an için dört şey yazılır.");

  chain(s, [
    ["Temas", "Müşterinin marka ile karşılaştığı an"],
    ["Deneyim", "Ne görüyor · ne yapıyor · ne hissediyor?"],
    ["Beklenti", "Bu anda ne bekliyor?"],
    ["Fırsat", "Tasarım bu deneyimi nasıl iyileştirebilir?"]
  ], 2.5, 1.7, { numbered: true, gap: 0.3, hi: [3], hs: 15, bs: 11 });

  rule(s, M, 4.66, FW, "NEDEN İŞE YARAR");
  const why = [
    ["Empati kurdurur", "Kullanıcının o andaki hâlini tasarımcıya görünür kılar."],
    ["Fırsatı gösterir", "Deneyimin tıkandığı yeri ve iyileştirme noktasını ortaya çıkarır."],
    ["Tutarlılık sağlar", "Marka mesajını yolculuğun her anında aynı hikâyeye bağlar."]
  ];
  const w = (FW - 0.22 * 2) / 3;
  why.forEach((it, i) => {
    const x = M + i * (w + 0.22);
    t(s, it[0], x, 4.92, w, 0.28, { sz: 13.5, b: true, c: INK });
    t(s, it[1], x, 5.24, w, 0.7, { sz: 11.5, c: MUTED, ls: 15 });
  });

  rect(s, M, 6.02, FW, 0.62, { fill: LIGHT, line: false });
  t(s, "Her temas noktası müşterinin akılcı, duygusal ve davranışsal tepkisini etkiler.",
    M + 0.24, 6.02, 11.3, 0.62, { sz: 14, b: true, c: ACC, va: "middle" });
  foot(s, "Kaynak: Sunar Bükülmez vd. (2025); Lemon ve Verhoef (2016); Stein ve Ramaseshan (2016).");
  s.addNotes("Dört başlık öğrencinin haritasında birer satır olacak.");
}

/* ===================== 13 SEKİZ AŞAMA ===================== */
{
  const s = page("12 · MÜŞTERİ YOLCULUĞU", "Müşteri yolculuğunun sekiz aşaması",
    "Kaynaktaki model bu sekiz aşamayı tanımlıyor. Ortadaki altısı doğrudan iç mekânda geçiyor.");

  const st = ["FARKINDALIK", "ÇEKİM", "EŞİK", "YÖNLENME", "KEŞİF", "ETKİLEŞİM", "SATIN ALMA", "AYRILIŞ"];
  const gap = 0.04, w = (FW - gap * 7) / 8;
  st.forEach((x2, i) => {
    const x = M + i * (w + gap);
    const core = i >= 1 && i <= 6;
    rect(s, x, 2.6, w, 1.15, { fill: core ? ACC : LIGHT, line: false });
    t(s, String(i + 1).padStart(2, "0"), x + 0.1, 2.72, w - 0.2, 0.24,
      { sz: 9, b: true, c: core ? "E8C9BE" : MUTED, cs: 1.2 });
    t(s, x2, x + 0.1, 3.02, w - 0.2, 0.6, { sz: 11, b: true, c: core ? WHITE : MUTED,
      al: "left", ls: 13.5 });
  });
  line(s, M + w + gap, 3.92, M + 7 * (w + gap) - gap, 3.92, { col: ACC, w: 1.5 });
  t(s, "İç mekânda geçen altı aşama — dersin tasarım konusu", M + w + gap, 4.0, 6.0, 0.26,
    { sz: 10.5, b: true, c: ACC });
  t(s, "Mekânın dışında", M, 4.0, 1.4, 0.26, { sz: 10.5, c: MUTED });
  t(s, "Mekânın dışında", M + 7 * (w + gap), 4.0, 1.4, 0.26, { sz: 10.5, c: MUTED, al: "right" });

  rule(s, M, 4.66, FW, "İÇ MİMARLIK İÇİN ASIL SORU", { c: ACC, lc: HAIR });
  t(s, "Bu aşamaların her biri hangi mekânsal kararla destekleniyor?", M, 4.9, FW, 0.42,
    { sz: 20, b: true, c: INK });
  t(s, "Farkındalık ve ayrılış pazarlamanın alanına girer; aradaki altı aşama tasarımcının kurduğu deneyimdir. Bir sonraki slayt bu altı aşamanın mekânsal karşılıklarını gösteriyor.",
    M, 5.46, FW, 0.7, { sz: 13.5, c: BODY, ls: 19 });
  foot(s, "Kaynak: I-AM İstanbul müşteri yolculuğu modeli; Sunar Bükülmez vd. (2025), Şekil 1.");
  s.addNotes("Aşama adlarını öğrenciye yazdırın; dönem boyunca bu terimlerle konuşacağız.");
}

/* ===================== 14 İÇMİMARLIK MODÜLLERİ ===================== */
{
  const s = page("13 · İÇ MİMARLIK AÇISINDAN", "Mağazada hangi temasları tasarlıyoruz?",
    "Kaynak model fiziksel mağazaya uyarlandığında yönlenme, ürün, operasyon gibi iç mimarlık gerektiren alanlar öne çıkıyor.");

  cards(s, [
    ["Çekim", "Cephe · vitrin · ilk görsel temas"],
    ["Eşik", "Giriş · ilk izlenim · atmosfer"],
    ["Yönlenme", "Dolaşım · görüş hatları · işaretleme"],
    ["Keşif", "Ürün grupları · bilgi · etkileşim"],
    ["Ürün ve hizmet", "Sergileme · erişim · deneme · bekleme"],
    ["Etkileşim", "Personel · ürün · teknoloji"],
    ["Satın alma", "Kasa · ödeme · paketleme"],
    ["Operasyon", "Depolama · personel · ergonomi"]
  ], 2.5, 1.62, { cols: 4, numbered: true, hi: [7] });

  rect(s, M, 6.02, FW, 0.62, { fill: LIGHT, line: false });
  t(s, "Son modül en çok atlanan: mağaza çalışmıyorsa deneyim de çalışmaz.",
    M + 0.24, 6.02, 11.3, 0.62, { sz: 14, b: true, c: ACC, va: "middle" });
  foot(s, "Kaynak: Sunar Bükülmez vd. (2025); fiziksel perakende için uyarlanmış modüller.");
  s.addNotes("Operasyon vurgulu: ölçümlerde öğrencilerin en zayıf olduğu modül burası.");
}

/* ===================== 15 VAKA: YOLCULUK ===================== */
{
  const s = page("14 · VAKA", "Seramik markasının müşteri yolculuğu",
    "Aynı marka, yolculuğun her aşamasında başka bir mekânsal karar üretir.");

  const j = [
    ["Çekim", "Seçili tek ürün ve güçlü bir ilk bakış", "CESUR"],
    ["Eşik", "Malzeme ve ışıkla markanın ilk hissi", "DOĞAL"],
    ["Yönlenme", "Net görüş hattı ve açık bir ana rota", "DOĞAL"],
    ["Keşif", "Koleksiyonlara göre sakin gruplama", "SÜRDÜRÜLEBİLİR"],
    ["Etkileşim", "Dokunma, numune ve üretim anlatısı", "CESUR"],
    ["Satın alma", "Kolay ödeme ve dikkatli paketleme", "SÜRDÜRÜLEBİLİR"],
    ["Ayrılış", "Ürünün hikâyesiyle birlikte çıkış", "CESUR"]
  ];
  const cols = [["AŞAMA", 2.2], ["MEKÂNSAL KARAR", 6.2], ["HANGİ KELİMEYİ TAŞIYOR", 3.23]];
  let x = M;
  const xs = cols.map(c => { const cx = x; x += c[1] + 0.04; return cx; });
  cols.forEach((c, i) => t(s, c[0], xs[i] + (i ? 0.14 : 0), 2.5, c[1], 0.24,
    { sz: 8.5, b: true, c: MUTED, cs: 1.5 }));
  line(s, M, 2.8, R, 2.8, { col: HAIR, w: 1 });
  j.forEach((row, i) => {
    const yy = 2.88 + i * 0.5;
    rect(s, xs[0], yy, cols[0][1], 0.46, { fill: ACC, line: false });
    t(s, row[0], xs[0] + 0.14, yy, cols[0][1] - 0.28, 0.46,
      { sz: 12, b: true, c: WHITE, va: "middle" });
    rect(s, xs[1], yy, cols[1][1], 0.46, { fill: LIGHT, line: false });
    t(s, row[1], xs[1] + 0.14, yy, cols[1][1] - 0.28, 0.46, { sz: 11.5, c: BODY, va: "middle" });
    rect(s, xs[2], yy, cols[2][1], 0.46, { fill: LIGHT, line: false });
    t(s, row[2], xs[2] + 0.14, yy, cols[2][1] - 0.28, 0.46,
      { sz: 11, b: true, c: ACC, va: "middle", cs: 1 });
  });
  t(s, "Bir aşama birden fazla kelimeyi taşıyabilir; taşımıyorsa o aşama henüz tasarlanmamıştır.",
    M, 6.46, FW, 0.3, { sz: 13.5, b: true, c: ACC });
  foot(s, "Örnek senaryo; kaynak modelin öğrenci tasarımına aktarılışını göstermek için kurulmuştur.");
  s.addNotes("Tablodaki sağ kolon, kelime–karar ilişkisinin yolculuk üzerinde okunuşu.");
}

/* ===================== 16 SINIF ÇALIŞMASINA GEÇİŞ ===================== */
{
  const s = page("15 · ŞİMDİ SIRA SİZDE", "Sunumdan sınıf çalışmasına geçiyoruz",
    "Konuştuğumuz çerçeveyi şimdi gerçek markalar üzerinde deneyeceğiz.");

  chain(s, [
    ["Üç marka bul", "Ana akım olmayan, mağaza kimliği henüz oluşmamış adaylar"],
    ["Markayı araştır", "Ürün · kullanıcı · değer ve hikâye · rakipler"],
    ["Üç anahtar kelime", "Markayı mekâna taşıyabilecek üç kelime seç"],
    ["Üründen mekâna", "Sergileme ve depolama · aydınlatma · deneyim ve duyu"],
    ["Kelimeyi karara çevir", "Her kelime için somut bir mekânsal karar"]
  ], 2.5, 1.95, { numbered: true, gap: 0.24, hi: [4], hs: 13.5, bs: 10.5 });

  rect(s, M, 4.72, FW, 0.78, { fill: ACC, line: false });
  t(s, "BUGÜNKÜ SINIF ÇALIŞMASI", M + 0.24, 4.84, 5.0, 0.24, { sz: 9, b: true, c: "E8C9BE", cs: 2 });
  t(s, "Marka Avı — Üç Marka Karşılaştırma Paftası", M + 0.24, 5.08, 11.3, 0.34,
    { sz: 17, b: true, c: WHITE });

  rule(s, M, 5.86, FW, "NASIL ÇALIŞACAĞIZ");
  const how = [
    ["Bireysel araştırma", "Kendi üç adayınızı bulup paftayı doldurun."],
    ["Masa kritiği", "Yürütücüyle birlikte adayları karşılaştırın."],
    ["Kısa anlatım", "Seçtiğiniz adayı iki dakikada gerekçelendirin."]
  ];
  const w = (FW - 0.22 * 2) / 3;
  how.forEach((it, i) => {
    const x = M + i * (w + 0.22);
    t(s, it[0], x, 6.08, w, 0.28, { sz: 13, b: true, c: INK });
    t(s, it[1], x, 6.38, w, 0.5, { sz: 11, c: MUTED, ls: 14 });
  });
  s.addNotes("Pafta dağıtıldıktan sonra bu slaytı açık bırakın.");
}

/* ===================== 17 BUGÜNKÜ ÇALIŞMA ===================== */
{
  const s = page("16 · BUGÜNKÜ ÇALIŞMA", "Karşılaştırma paftasında ne dolduracaksınız?",
    "Her marka için aynı soruları kullanıyoruz; böylece seçimi araştırma üzerinden karşılaştırabiliriz.");

  cards(s, [
    ["Markayı anlamak", "Ürün · kullanıcı · değer ve hikâye · üç anahtar kelime"],
    ["Üründen mekâna", "Sergileme ve depolama · aydınlatma · deneyim ve duyu"],
    ["Kelime → karar", "Üç kelimenin her biri için somut bir mekânsal tasarım kararı"]
  ], 2.5, 1.55, { cols: 3, numbered: true, hi: [2], hs: 15 });

  rule(s, M, 4.42, FW, "PAFTADA ARADIĞIMIZ ÜÇ ŞEY", { c: ACC, lc: HAIR });
  const three = [
    ["Kanıt", "Yazdığınız her önemli bilgi bir kaynağa dayansın."],
    ["Gerekçe", "Neden bu üç kelime? Markanın hangi verisi bunu söylüyor?"],
    ["Karar", "Kelimeyi en az bir somut mekânsal karara dönüştürün."]
  ];
  const w = (FW - 0.04 * 2) / 3;
  three.forEach((it, i) => {
    const x = M + i * (w + 0.04);
    rect(s, x, 4.62, w, 1.2, { fill: LIGHT, line: false });
    t(s, it[0], x + 0.22, 4.82, w - 0.44, 0.3, { sz: 15, b: true, c: ACC });
    t(s, it[1], x + 0.22, 5.16, w - 0.44, 0.58, { sz: 11.5, c: BODY, ls: 15 });
  });

  t(s, "Bugün güzel bir pafta değil, iyi bir araştırma yapıyoruz. Paftanın görsel dili önemli; ama asıl değer araştırmadan tasarıma kurduğunuz ilişkide.",
    M, 6.02, FW, 0.62, { sz: 13.5, c: BODY, ls: 19 });
  foot(s, "Araç: A3 üç marka karşılaştırma paftası.");
  s.addNotes("Kanıt / gerekçe / karar üçlüsü kritikte de aynı sırayla sorulacak.");
}

/* ===================== 18 KAYNAKLAR ===================== */
{
  const s = page("17 · KAYNAKLAR", "Dersin temel kaynakları",
    "Sunumun çerçevesi aşağıdaki makale ve ders izlencesinden kuruldu.");

  const refs = [
    ["Sunar Bükülmez, P., Girginkaya Akdağ, S. ve Ekin, G. (2025)", "Retail Design Competencies and Customer Journey Mapping Tools: A Holistic Interior Design Studio Perspective. The International Journal of Design Education, 19(2), 25–50."],
    ["Wheeler, A. (2017)", "Designing Brand Identity. Wiley. — Marka deneyiminin temel bileşenleri."],
    ["Lemon, K. N. ve Verhoef, P. C. (2016)", "Understanding Customer Experience Throughout the Customer Journey. Journal of Marketing, 80(6), 69–96."],
    ["Stein, A. ve Ramaseshan, B. (2016)", "Towards the Identification of Customer Experience Touch Point Elements. Journal of Retailing and Consumer Services, 30, 8–19."],
    ["Stickdorn, M. vd. (2018)", "This Is Service Design Doing. O'Reilly. — Hizmet tasarımı ve yolculuk haritalama yöntemleri."],
    ["Mesher, L. (2010)", "Basics Interior Design: Retail Design. AVA Publishing."],
    ["İç Mimari Tasarım III ders izlencesi (2025–2026)", "Proje kapsamı, gereklilikler ve öğrenme çıktıları."]
  ];
  refs.forEach((r, i) => {
    const yy = 2.5 + i * 0.6;
    rect(s, M, yy + 0.08, 0.1, 0.1, { fill: ACC, line: false });
    t(s, r[0], M + 0.26, yy, 4.0, 0.5, { sz: 11.5, b: true, c: INK, ls: 14 });
    t(s, r[1], M + 4.4, yy, 7.37, 0.5, { sz: 11, c: BODY, ls: 14 });
    if (i < refs.length - 1) line(s, M + 0.26, yy + 0.5, R, yy + 0.5, { col: HAIR, w: 0.5 });
  });
  foot(s, "Kaynak modellerdeki diyagramlar bu sunum için yeniden çizilmiştir · doi.org/10.18848/2325-128X/CGP/v19i02/25-50");
}

/* ===================== 19 ÖDEV (en son) ===================== */
{
  const s = page("18 · ÖDEV", "Bir sonraki derse ne getiriyorsunuz?",
    "Bir sonraki derse araştırılmış ve karşılaştırılmış bir başlangıçla geliyoruz.");

  cards(s, [
    ["Üç aday marka", "Üç aday seçin ve her biri için kısa bir araştırma yapın."],
    ["Marka anahtarı", "Ürün, kullanıcı, değer ve hikâye, rakipler ve temel kimlik bilgileri."],
    ["Üç anahtar kelime", "Her aday için üç kelime belirleyin ve nedenlerini yazın."],
    ["Üründen mekâna", "Sergileme ve depolama, aydınlatma, deneyim ve duyu başlıkları."],
    ["Kelime → tasarım", "Her kelime için en az bir somut mekânsal tasarım kararı önerin."],
    ["Karşılaştır ve seç", "Üç aday arasından neden birini seçtiğinizi kısaca gerekçelendirin."]
  ], 2.5, 1.9, { cols: 3, numbered: true, hi: [4] });

  rect(s, M, 6.52, FW, 0.62, { fill: ACC, line: false });
  t(s, "Teslim aracı: A3 üç marka karşılaştırma paftası  ·  Sonraki aşama: seçilen marka, kullanıcı profili, müşteri yolculuğu ve kavramsal tasarım",
    M + 0.24, 6.52, 11.3, 0.62, { sz: 13, b: true, c: WHITE, va: "middle" });
  s.addNotes("Ödev sunumun son slaytı: öğrencinin dersten çıkarken aklında kalması gereken şey bu.");
}

p.writeFile({ fileName: "Marka-Anahtari-ve-Musteri-Deneyimi-Ilk-Ders.pptx" })
 .then(f => console.log("yazildi:", f, "| slayt:", n));
