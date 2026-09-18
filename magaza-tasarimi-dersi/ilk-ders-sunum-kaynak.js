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
const SEC   = "3F6B63";   // ikincil renk — yalnızca odak noktalarında
const SECT  = "DDE7E4";   // ikincil renk açık tonu
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
  t(s, String(n).padStart(2, "0") + " · " + kicker, M, 0.44, 9.0, 0.24,
    { sz: 9, b: true, c: ACC, cs: 2.6 });
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
  const tw = o.w || FW, x0 = o.x !== undefined ? o.x : M;
  const w = (tw - gap * (items.length - 1)) / items.length;
  items.forEach((it, i) => {
    const x = x0 + i * (w + gap);
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


/* ===================== EK DİKDÖRTGEN ŞEMALAR ===================== */
// satır × kolon matrisi · rows: [ad, [aktif kolon indeksleri], not]
function matrix(s, cols, rows, x, y, o) {
  o = o || {};
  const lw = o.lw || 1.6, ch = o.ch || 0.42, gap = 0.04;
  const cw = (o.w - lw - 0.1) / cols.length;
  cols.forEach((c, j) => {
    t(s, c, x + lw + 0.1 + j * cw, y - 0.3, cw, 0.26,
      { sz: 8.5, b: true, c: MUTED, al: "center", cs: 0.6 });
  });
  rows.forEach((r, i) => {
    const yy = y + i * (ch + gap);
    t(s, r[0], x, yy, lw, ch, { sz: 12, b: true, c: INK, va: "middle" });
    cols.forEach((c, j) => {
      const on = r[1].indexOf(j) >= 0;
      const peak = o.peak && o.peak[i] === j;
      rect(s, x + lw + 0.1 + j * cw + gap / 2, yy, cw - gap, ch,
        { fill: peak ? SEC : (on ? ACC : LIGHT), line: false });
    });
    if (r[2]) t(s, r[2], x + o.w + 0.16, yy, o.nw || 3.3, ch,
      { sz: 10, c: MUTED, va: "middle" });
  });
  return y + rows.length * (ch + gap) - gap;
}
// iki uç arasında dizilmiş dikdörtgen bloklar
function spectrum(s, items, x, y, w, h, leftLbl, rightLbl, o) {
  o = o || {};
  const gap = 0.04, bw = (w - gap * (items.length - 1)) / items.length;
  t(s, leftLbl, x, y - 0.32, w / 2, 0.26, { sz: 9, b: true, c: ACC, cs: 1.6 });
  t(s, rightLbl, x + w / 2, y - 0.32, w / 2, 0.26,
    { sz: 9, b: true, c: ACC, cs: 1.6, al: "right" });
  items.forEach((it, i) => {
    const bx = x + i * (bw + gap);
    rect(s, bx, y, bw, h, { fill: LIGHT, line: false });
    rect(s, bx, y, bw, 0.08, { fill: ACC, line: false });
    t(s, it[0], bx + 0.14, y + 0.2, bw - 0.28, 0.44, { sz: 12, b: true, c: INK, ls: 14 });
    t(s, it[1], bx + 0.14, y + 0.68, bw - 0.28, h - 0.82, { sz: 10, c: MUTED, ls: 13 });
  });
  return y + h;
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
  const s = page("DERSİN ÇERÇEVESİ", "Ders izlencesinden bugünkü sunuma",
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
  const s = page("BEKLENTİLER", "Bu derste sizden ne bekliyorum?",
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
  const s = page("PROJE", "Bu dönem ne tasarlıyoruz?",
    "Ana akım olmayan bir markanın ilk fiziksel mağazasını, etkileşimli ve duyusal bir mekânsal deneyim olarak kuracaksınız.");

  const y = list(s, [
    ["Marka", "Ana akım olmayan, tasarım dili henüz oturmamış bir marka — sizin bulacağınız."],
    ["Kimlik", "Markanın kimliğini çözümleyip onu mekânsal bir dile çevirmek."],
    ["Deneyim", "Etkileşimli, duyularla desteklenen ve teknolojiyle bütünleşmiş mekânsal deneyim."],
    ["Ölçek", "Bireysel proje; dönem boyunca tek marka üzerinden derinleşme."]
  ], M, 2.5, 6.6, { kw: 1.5, sz: 12.5, rh: 0.66 });

  rule(s, M, 5.42, 6.6, "TASARLAMAK ZORUNDA OLDUĞUNUZ İŞLEVLER", { c: ACC, lc: HAIR });
  t(s, "Vitrin ve sergileme  ·  giriş ve eşik  ·  dolaşım  ·  deneyim alanı  ·  bilgi ve tanıtım  ·  satış ve kasa  ·  depolama ve stok  ·  personel",
    M, 5.62, 6.6, 0.8, { sz: 12, c: BODY, ls: 17 });

  rect(s, 7.72, 2.5, 4.83, 2.55, { fill: SEC, line: false });
  t(s, "TEMEL SORU", 8.0, 2.78, 4.27, 0.26, { sz: 9, b: true, c: SECT, cs: 2 });
  t(s, "Markanın kimliğini, kullanıcının ihtiyaçlarını ve ürünün doğasını nasıl tek bir mekânsal dilde birleştiririz?",
    8.0, 3.15, 4.27, 1.7, { sz: 17, b: true, c: WHITE, ls: 24 });

  rect(s, 7.72, 5.25, 4.83, 1.17, { fill: LIGHT, line: false });
  t(s, "TASARIM KAPSAMI", 8.0, 5.45, 4.27, 0.26, { sz: 9, b: true, c: ACC, cs: 2 });
  t(s, "Atmosfer · kimlik · malzeme · ışık · renk · doku · mobilya · duyusal nitelikler",
    8.0, 5.74, 4.27, 0.6, { sz: 11.5, c: BODY, ls: 16 });
  foot(s, "Proje kapsamı ders izlencesindeki gerekliliklerden sadeleştirilerek çıkarılmıştır.");
  s.addNotes("Alan bilgisi bilinçli olarak yok; ölçüler ayrıca duyurulacak.");
}

/* ===================== 05 TASARIM MANTIĞI ===================== */
{
  const s = page("TASARIM MANTIĞI", "Tasarım çizimle başlamıyor.",
    "Önce anlamı ve kullanıcıyı çözüyoruz; sonra bunu mekânsal karara dönüştürüyoruz.");

  chain(s, [
    ["Araştır", "marka · ürün · kullanıcı · rakip"],
    ["Sentezle", "marka DNA'sı ve üç anahtar kelime"],
    ["Çevir", "kelimeyi malzeme · ışık · dolaşım · sergileme kararına"],
    ["Haritala", "müşterinin mekândaki yolculuğu ve davranışı"],
    ["Sına", "karar marka ve kullanıcıyla örtüşüyor mu?"]
  ], 2.6, 1.85, { numbered: true, gap: 0.3, hi: [2], hs: 15, bs: 10.5 });

  rule(s, M, 5.0, FW, "BU SUNUMUN AKIŞI DA AYNI SIRAYI İZLİYOR");
  const steps = [
    ["Araştır", "Marka DNA'sı · marka anahtarı · araştırma kaynakları · kullanıcı"],
    ["Sentezle", "Anahtar kelime havuzu ve eleme · beş örnek kelime"],
    ["Çevir", "Çeviri zinciri · tasarım kararı · yoğunluk kararı"],
    ["Haritala", "Atmosfer · duyular · müşteri akışı ve davranış"],
    ["Sına", "Vaka okuması · sınıf çalışması ve ödev"]
  ];
  const w = (FW - 0.22 * 4) / 5;
  steps.forEach((st, i) => {
    const x = M + i * (w + 0.22);
    t(s, st[0], x, 5.26, w, 0.26, { sz: 11.5, b: true, c: ACC });
    t(s, st[1], x, 5.54, w, 0.9, { sz: 10.5, c: MUTED, ls: 13.5 });
  });
  s.addNotes("Beş adımı tahtaya yazın; dönem boyunca kritiklerde 'hangi adımdasın' diye sorun.");
}

/* ===================== 06 MARKA DNA'SI (yeni) ===================== */
{
  const s = page("MARKA KİMLİĞİ", "Marka DNA'sı: bir markayı ne oluşturur?",
    "Marka bir logo değil, bir vaadin tutarlı biçimde tekrarlanmasıdır. Bu vaat beş bileşenden oluşur.");

  rule(s, M, 2.5, 7.3, "MARKANIN KENDİ İÇİNDE KURDUĞU", { c: ACC, lc: HAIR });
  chain(s, [
    ["Neden varız", "Markanın özü ve var oluş nedeni"],
    ["İdeal", "Neye dönüşmek istiyor"],
    ["Değerler", "İnanç sistemi; çalışma ve iletişim biçimi"]
  ], 2.7, 1.18, { gap: 0.04, hs: 13, bs: 10, w: 7.3 });

  rule(s, M, 4.32, 7.3, "DIŞA DÖNÜK OLARAK GÖSTERDİĞİ", { c: ACC, lc: HAIR });
  chain(s, [
    ["Kişilik", "Pazara konuşma biçimi, ses tonu"],
    ["Pazar konumu", "Rekabette kendini nasıl konumlandırdığı"]
  ], 4.52, 1.18, { gap: 0.04, hs: 13, bs: 10, w: 7.3 });

  rect(s, 8.28, 2.5, 4.27, 3.2, { fill: SEC, line: false });
  t(s, "BU DERSİN ANA KONUSU", 8.54, 2.74, 3.75, 0.26, { sz: 9, b: true, c: SECT, cs: 2 });
  t(s, "Markanın kimliğini çözümlemek ve onu mekânsal bir dile çevirmek.",
    8.54, 3.04, 3.75, 1.0, { sz: 17, b: true, c: WHITE, ls: 23 });
  t(s, "Dönem boyunca her tasarım kararı bu beş bileşenden birine dayanmak zorunda. Dayanmıyorsa karar değil, tercihtir.",
    8.54, 4.2, 3.75, 1.2, { sz: 12, c: SECT, ls: 17 });

  rect(s, M, 6.0, FW, 0.64, { fill: LIGHT, line: false });
  t(s, "Bir markanın kimliği, tekrarlanabilir olduğunda kimlik olur; tek seferlik bir jest kimlik kurmaz.",
    M + 0.24, 6.0, 11.3, 0.64, { sz: 14, b: true, c: ACC, va: "middle" });
  foot(s, "Kaynak: Wheeler (2017), Designing Brand Identity; Klanten vd. (2013), Brand Spaces.");
  s.addNotes("Beş bileşeni tahtaya yazın; öğrenci kendi markası için beşini de doldurmak zorunda.");
}

/* ===================== 07 MARKA ANAHTARI ===================== */
{
  const s = page("MARKA ANALİZİ", "Marka Anahtarı nedir?",
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
  const s = page("ARAŞTIRMA", "Bir markanın kimliğini nasıl çıkarırız?",
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
  const s = page("KULLANICI", "Kullanıcı profilini nasıl anlarız?",
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

/* ===================== SENTEZ ===================== */
{
  const s = page("SENTEZ", "Anahtar kelime nasıl çıkarılır?",
    "Anahtar kelime, marka analizini tasarım kararına bağlayan ara duraktır. Analizden doğrudan plana geçilemez.");

  chain(s, [
    ["Kaynaklar", "Markanın kendi ürettiği her şey: metinler, ambalaj, sosyal medya dili, müşteri yorumları, görüşme, rakiplerin dili"],
    ["Ham kelime havuzu", "Otuz–elli kelime. Sıfat, fiil ve nesne adı; hepsini yaz, hiçbirini eleme, tekrar edenleri işaretle"],
    ["Gruplama ve eleme", "Eş anlamlıları birleştir, kümele; markaya özgü olmayanları at: kaliteli, modern, özel"],
    ["Üç anahtar kelime", "Özgül · kanıtlı · mekânda karşılığı kurulabilir"]
  ], 2.5, 2.1, { numbered: true, gap: 0.28, hi: [3], hs: 14, bs: 10.5 });

  rule(s, M, 5.02, FW, "ELEME ÖLÇÜTÜ");
  const crit = [
    ["Özgül", "Her markaya uyacak kadar genel olmamalı."],
    ["Kanıtlı", "Araştırmada karşılığı bulunmalı."],
    ["Çevrilebilir", "Mekânda somut bir karşılığı kurulabilmeli."]
  ];
  const w = (FW - 0.22 * 2) / 3;
  crit.forEach((it, i) => {
    const x = M + i * (w + 0.22);
    t(s, it[0], x, 5.26, w, 0.28, { sz: 13.5, b: true, c: ACC });
    t(s, it[1], x, 5.58, w, 0.5, { sz: 11.5, c: MUTED, ls: 15 });
  });

  rect(s, M, 6.16, FW, 0.62, { fill: SEC, line: false });
  t(s, "Sınama: bu sıfatın zıttını bilinçli olarak seçen bir marka olabilir mi?",
    M + 0.24, 6.16, 11.3, 0.62, { sz: 14, b: true, c: WHITE, va: "middle" });
  s.addNotes("Ham havuzun uzun olması iyidir; eleme sert olmalı. Otuz kelimeden üçe inmek normaldir.");
}

/* ===================== BEŞ ÖRNEK KELİME ===================== */
{
  const s = page("SENTEZ", "Bu derste kullanacağımız beş örnek kelime",
    "Bunlar bir katalog değil, örnek. Kendi markanız için kendi üçlünüzü bulacaksınız.");

  const kw = [
    ["CESUR", "karakterli · görünür · güçlü"],
    ["DOĞAL", "malzemeye yakın · sıcak · yalın"],
    ["SÜRDÜRÜLEBİLİR", "uzun ömürlü · az atık · esnek"],
    ["TEKİLLİK", "her ürün tek · elde üretilmiş"],
    ["GÖRÜNÜRLÜK", "üretim gizlenmiyor · süreç sahnede"]
  ];
  const gap = 0.04, w = (FW - gap * 4) / 5;
  kw.forEach((k, i) => {
    const x = M + i * (w + gap);
    const nw = i >= 3;
    rect(s, x, 2.6, w, 1.5, { fill: nw ? SEC : ACC, line: false });
    t(s, k[0], x + 0.12, 2.82, w - 0.24, 0.66,
      { sz: k[0].length > 9 ? 15 : 21, b: true, c: WHITE, al: "center", ls: 20 });
    t(s, k[1], x + 0.12, 3.5, w - 0.24, 0.5,
      { sz: 10, c: nw ? SECT : "F0DED7", al: "center", ls: 13 });
  });
  t(s, "İki kelime ikincil renkte: bunlar üretimi görünür olan, elde üretilmiş ürünlü markalar için özellikle işe yarar.",
    M, 4.24, FW, 0.3, { sz: 11, i: true, c: MUTED });

  rule(s, M, 4.82, FW, "HER KELİME MEKÂNDA BAŞKA BİR ŞEYİ DEĞİŞTİRİR", { c: ACC, lc: HAIR });
  const eff = [
    ["CESUR", "vurgu ve hiyerarşi"], ["DOĞAL", "malzeme ve ışık"],
    ["SÜRDÜRÜLEBİLİR", "sistem ve işletme"], ["TEKİLLİK", "yoğunluk ve aralık"],
    ["GÖRÜNÜRLÜK", "görüş hattı ve sınır"]
  ];
  eff.forEach((e, i) => {
    const x = M + i * (w + gap);
    rect(s, x, 5.04, w, 0.66, { fill: LIGHT, line: false });
    t(s, e[1], x + 0.12, 5.04, w - 0.24, 0.66,
      { sz: 11.5, b: true, c: i >= 3 ? SEC : ACC, al: "center", va: "middle", ls: 14 });
  });
  t(s, "Bir tasarım kararı birden fazla kelimeyi aynı anda taşıyabilir; taşıması da beklenir. Beş kelimenin hepsini kullanan bir mağaza ise hiçbirini kullanmamış olur.",
    M, 5.94, FW, 0.62, { sz: 13.5, c: BODY, ls: 19 });
  s.addNotes("Son iki kelime bu dersin eklediği örnekler; el üretimi ve atölyeli markalarda çok işe yarıyor.");
}

/* ===================== ÇEVİRİ ZİNCİRİ ===================== */
{
  const s = page("ÇEVİRİ", "Çeviri zinciri: özellikten tasarım öğesine",
    "Bir marka özelliği doğrudan çizime dönüşmez. Arada iki durak var ve ikisi de atlanamaz.");

  chain(s, [
    ["Marka özelliği", "araştırmada bulunan somut olgu"],
    ["Anahtar kelime", "o olgunun tek sıfata indirgenmesi"],
    ["Mekânsal ilke", "sayısız çözüme açık genel kural"],
    ["Tasarım öğesi", "çizilebilir, ölçülebilir karar"]
  ], 2.5, 1.5, { numbered: true, gap: 0.3, hi: [3], hs: 15, bs: 11 });

  rule(s, M, 4.32, FW, "AYNI ZİNCİR, İKİ ÖRNEK", { c: SEC, lc: HAIR });
  const ex = [
    ["Her ürün tek tek, elde üretiliyor", "TEKİLLİK",
     "Düşük yoğunluk; her ürüne kendi alanı ve kendi ışığı",
     "Tekil kaideler · nokta aydınlatma · ürünler arası geniş aralık"],
    ["Üretim süreci gizlenmiyor", "GÖRÜNÜRLÜK",
     "Üretimin satış alanına açılması; arka alanın sahne olması",
     "Camlı atölye duvarı · tezgâhın vitrine bakması · açık kuruma rafı"]
  ];
  const gap = 0.3, w = (FW - gap * 3) / 4;
  ex.forEach((row, r) => {
    const y = 4.56 + r * 1.02;
    row.forEach((cell, j) => {
      const x = M + j * (w + gap);
      const isKw = j === 1;
      rect(s, x, y, w, 0.86, { fill: isKw ? SEC : LIGHT, line: false });
      t(s, cell, x + 0.14, y, w - 0.28, 0.86,
        { sz: isKw ? 14 : 11, b: isKw, c: isKw ? WHITE : BODY,
          al: isKw ? "center" : "left", va: "middle", ls: isKw ? 16 : 14 });
      if (j < 3) arrow(s, x + w + 0.06, y + 0.43, x + w + gap - 0.06, y + 0.43,
        { col: ACC, w: 1.1 });
    });
  });
  t(s, "Mekânsal ilke ile tasarım öğesini ayırmak önemli: ilke sabittir, öğe her mekânda değişir.",
    M, 6.7, FW, 0.3, { sz: 13, b: true, c: ACC });
  s.addNotes("Bu iki örnek makalede de geçiyor; öğrenci kendi markası için üç zincir kuracak.");
}

/* ===================== BEŞ KELİMENİN TASARIM KARARLARI ===================== */
{
  const s = page("ÇEVİRİ", "Beş kelime, beş tasarım kararı",
    "Her satır bir çeviri zinciridir. Sağdaki kolon çizime giren karardır.");

  table(s, [["ANAHTAR KELİME", 2.3], ["NE ANLAMA GELİYOR", 2.5], ["MEKÂNSAL İLKE", 3.0], ["TASARIM ÖĞESİ", 3.85]], [
    ["CESUR", "Karakterli · görünür · güçlü",
     "Tek ve güçlü bir mekânsal jest; hiyerarşi net",
     "Merkezî kaide · güç duvarı · yüksek kontrastlı vurgu ışığı"],
    ["DOĞAL", "Malzemeye yakın · sıcak · yalın",
     "Malzemenin kendisi görünür kalır; ışık doğal ışığı destekler",
     "Boyasız yüzey · ham ahşap ve taş · sıcak renk sıcaklığı"],
    ["SÜRDÜRÜLEBİLİR", "Uzun ömürlü · az atık · esnek",
     "Mekân sökülebilir ve yeniden kurulabilir olmalı",
     "Vidalı birleşim · modüler teşhir · değişebilir vitrin arkalığı"],
    ["TEKİLLİK", "Her ürün tek · elde üretilmiş",
     "Düşük yoğunluk; her ürüne kendi alanı ve kendi ışığı",
     "Tekil kaide · nokta aydınlatma · ürünler arası geniş aralık"],
    ["GÖRÜNÜRLÜK", "Üretim gizlenmiyor · süreç sahnede",
     "Üretim satış alanına açılır; arka alan sahne olur",
     "Camlı atölye duvarı · vitrine bakan tezgâh · açık kuruma rafı"]
  ], 2.5, { rh: 0.68, ks: 13, cs2: 10.5 });

  t(s, "Sınama sorusu: bu karar, kelimeyi bilmeyen birine de aynı şeyi anlatıyor mu?",
    M, 6.56, FW, 0.3, { sz: 13.5, b: true, c: SEC });
  s.addNotes("Kelime–karar ilişkisinin tek referansı bu slayt; başka yerde tekrar anlatmıyoruz.");
}

/* ===================== YOĞUNLUK ===================== */
{
  const s = page("ÇEVİRİ", "Yoğunluk bir mesajdır",
    "Aynı metrekareye kaç ürün konacağı estetik değil, stratejik bir karar. Az ürün ve çok boşluk değer duygusu üretir; yoğun teşhir bolluk ve erişilebilirlik duygusu.");

  spectrum(s, [
    ["Mücevher · sanat", "birim değer yüksek; boşluk doğrudan değer anlamına gelir"],
    ["Parfüm · sofistike moda", "seçilmiş az sayıda ürün, geniş boşluk, oturarak satış"],
    ["Seramik · zanaat", "her parça tekil; kaide ve aralık gerekir"],
    ["Kitap · plak", "tarama davranışı; orta yoğunluk, raf metrajı önemli"],
    ["Giyim · ayakkabı", "beden çeşidi yoğunluk üretir; stok yakınlığı belirleyici"],
    ["Süpermarket · indirim", "bolluk sinyali, hızlı hareket, yüksek yoğunluk"]
  ], M, 2.92, FW, 1.5, "AZ ÜRÜN — BOŞLUK DEĞERDİR", "ÇOK ÜRÜN — BOLLUK SİNYALİDİR");

  rule(s, M, 4.92, FW, "YOĞUNLUK KARARI NEYİ BELİRLER");
  const eff = [
    ["Hız", "Yoğun mekânda insan hızlanır, seyrek mekânda yavaşlar."],
    ["Değer algısı", "Boşluk ürünün değerini yükseltir; yoğunluk fiyat beklentisini düşürür."],
    ["Dokunma", "Seyrek teşhir dokunmayı davet eder; yoğun teşhir gözle taramayı."],
    ["Depo oranı", "Yoğun teşhir satış alanında stok tutar; seyrek teşhir depo ister."]
  ];
  const w = (FW - 0.2 * 3) / 4;
  eff.forEach((it, i) => {
    const x = M + i * (w + 0.2);
    t(s, it[0], x, 5.14, w, 0.28, { sz: 13, b: true, c: ACC });
    t(s, it[1], x, 5.46, w, 0.8, { sz: 11, c: BODY, ls: 14.5 });
  });

  rect(s, M, 6.34, FW, 0.6, { fill: LIGHT, line: false });
  t(s, "Markanızın ürünü bu eksende nerede duruyor? Cevap, mekânsal programın ilk sayısını verir.",
    M + 0.24, 6.34, 11.3, 0.6, { sz: 13.5, b: true, c: ACC, va: "middle" });
  s.addNotes("Bu slayt hem yoğunluk kararını hem de sonraki slayttaki ürün kategorilerini hazırlıyor.");
}

/* ===================== VAKA: MARKA ===================== */
{
  const s = page("VAKA", "Varsayımsal yerel seramik markası",
    "Yöntemi tek bir örnek üzerinden birlikte okuyalım. Aynı markaya dönem boyunca döneceğiz.");

  rule(s, M, 2.5, 7.0, "MARKA DNA'SI");
  list(s, [
    ["Neden varız", "Gündelik yaşama üretim ve malzeme duygusu katmak"],
    ["İdeal", "Atölyesini müşteriye açabilen, öğreten bir dükkân olmak"],
    ["Değerler", "Yerellik · zanaat · uzun kullanım"],
    ["Kişilik", "Özenli · açık sözlü · malzemeye yakın"],
    ["Pazar konumu", "Seri üretim ev ürünleri değil; imzalı zanaat parçaları"]
  ], M, 2.74, 7.0, { kw: 1.7, sz: 12, rh: 0.56 });

  rule(s, M, 5.66, 7.0, "ÜRÜN VE KULLANICI");
  t(s, "El yapımı seramik ev ve sofra ürünleri. Kentin yoğunluğu içinde yavaş ve anlamlı seçim yapmak isteyen, ürünü eline almadan karar vermeyen kullanıcı.",
    M, 5.88, 7.0, 0.7, { sz: 12, c: BODY, ls: 16.5 });

  rule(s, 8.12, 2.5, 4.43, "ARAŞTIRMADAN ÇIKAN ÜÇ KELİME", { c: SEC, lc: HAIR });
  const kw = [["DOĞAL", "malzeme kendini gösteriyor"],
              ["TEKİLLİK", "her parça elde, tek tek"],
              ["GÖRÜNÜRLÜK", "çark ve fırın gizlenmiyor"]];
  kw.forEach((k, i) => {
    const yy = 2.74 + i * 1.02;
    rect(s, 8.12, yy, 4.43, 0.9, { fill: i === 0 ? ACC : SEC, line: false });
    t(s, k[0], 8.36, yy + 0.14, 3.95, 0.36, { sz: 17, b: true, c: WHITE, cs: 1.2 });
    t(s, k[1], 8.36, yy + 0.52, 3.95, 0.26, { sz: 11, c: i === 0 ? "F0DED7" : SECT });
  });
  t(s, "Üçü de araştırmadaki kanıta dayanıyor: ürünün malzemesi, üretim biçimi ve kullanıcının seçim nedeni. Marka beş kelimeden bu üçünü seçti.",
    8.12, 5.86, 4.43, 1.0, { sz: 11.5, c: BODY, ls: 16 });
  foot(s, "Vaka varsayımsaldır; öğrencinin düşünme biçimini göstermek için oluşturulmuştur.");
  s.addNotes("Bu markanın kelimeleri beş örnekten üçü: DOĞAL, TEKİLLİK, GÖRÜNÜRLÜK. Başka bir marka başka üçünü seçer.");
}

/* ===================== ATMOSFER ===================== */
{
  const s = page("ATMOSFER", "Atmosferi ne oluşturur?",
    "Bir mekânın atmosferinin, ürünün kendisinden bağımsız olarak satın alma kararını etkilediği fikri elli yıllıktır. Fiziksel çevre üç kanaldan etki eder.");

  chain(s, [
    ["Ortam koşulları", "ısı · ışık · ses · koku · hava kalitesi"],
    ["Mekân ve işlev", "yerleşim · ekipman · mobilya · ölçü · dolaşım"],
    ["İşaret ve sembol", "tabela · malzeme · dekor · anlam taşıyan öğeler"]
  ], 2.6, 1.6, { numbered: true, gap: 0.3, hi: [0], hs: 16, bs: 11.5 });

  rect(s, M, 4.44, FW, 0.62, { fill: SEC, line: false });
  t(s, "Üçü birlikte algılanır. Biri diğerini yalanladığında insan bunu fark eder — çoğu zaman nedenini adlandıramadan.",
    M + 0.24, 4.44, 11.3, 0.62, { sz: 14, b: true, c: WHITE, va: "middle" });

  rule(s, M, 5.34, FW, "MARKA KİMLİĞİ BU ÜÇ KANALA DAĞILIR");
  const map = [
    ["Ortam koşulları", "Kişilik ve değerler burada hissedilir: ışığın sıcaklığı, ses düzeyi, kokunun kaynağı."],
    ["Mekân ve işlev", "Pazar konumu ve ürün burada okunur: yoğunluk, aralık, dolaşımın hızı."],
    ["İşaret ve sembol", "Neden varız ve ideal burada anlatılır: malzeme seçimi, anlatı, yazı dili."]
  ];
  const w = (FW - 0.22 * 2) / 3;
  map.forEach((it, i) => {
    const x = M + i * (w + 0.22);
    t(s, it[0], x, 5.56, w, 0.28, { sz: 13, b: true, c: ACC });
    t(s, it[1], x, 5.88, w, 0.9, { sz: 11.5, c: BODY, ls: 15 });
  });
  foot(s, "Kaynak: Kotler (1973), Atmospherics as a Marketing Tool; Bitner (1992), Servicescapes.");
  s.addNotes("Atmosfer = marka kimliğinin duyulur hâli. Bu cümleyi tekrarlayın.");
}

{
  const s = page("ATMOSFER", "Mekân insanı ya içeri çeker ya dışarı iter",
    "Mekânsal uyaranlar önce bir duygu üretir, duygu da bir davranışa dönüşür. Nötr bir mekân yoktur.");

  const ch = [
    ["Mekânsal uyaran", "ışık · ses · koku · yoğunluk · malzeme"],
    ["Duygusal tepki", "haz · uyarılma · kontrol duygusu"],
    ["Davranış", "yaklaşma ya da kaçınma"]
  ];
  const gap = 0.36, w = (FW - gap * 2) / 3;
  ch.forEach((c, i) => {
    const x = M + i * (w + gap);
    rect(s, x, 2.6, w, 1.1, { fill: i === 2 ? SEC : LIGHT, line: false });
    t(s, c[0], x + 0.18, 2.78, w - 0.36, 0.32, { sz: 15, b: true, c: i === 2 ? WHITE : INK });
    t(s, c[1], x + 0.18, 3.14, w - 0.36, 0.46, { sz: 11, c: i === 2 ? SECT : MUTED, ls: 14 });
    if (i < 2) arrow(s, x + w + 0.06, 3.15, x + w + gap - 0.06, 3.15, { col: ACC, w: 1.4 });
  });

  const out = [
    ["YAKLAŞMA", "Girer · kalır · dolaşır · ürüne dokunur · etkileşime geçer · geri gelir", 1],
    ["KAÇINMA", "Girmez · kısa keser · hızla çıkar · ürüne dokunmaz", 0]
  ];
  const ow = (FW - 0.22) / 2;
  out.forEach((o, i) => {
    const x = M + i * (ow + 0.22);
    rect(s, x, 4.1, ow, 1.12, { fill: o[2] ? ACC : LIGHT, line: false });
    t(s, o[0], x + 0.22, 4.28, ow - 0.44, 0.28, { sz: 11, b: true, c: o[2] ? SECT : MUTED, cs: 2 });
    t(s, o[1], x + 0.22, 4.6, ow - 0.44, 0.52, { sz: 13, c: o[2] ? WHITE : BODY, ls: 17 });
  });

  rule(s, M, 5.56, FW, "TASARIMCI İÇİN SONUÇ");
  t(s, "Her mekân bir davranış üretir; soru bunun bilinçli mi tesadüfi mi olduğudur. Işık, ses, yoğunluk ve koku üzerinde verilmeyen her karar, yerine kendiliğinden bir karar koyar.",
    M, 5.78, FW, 0.6, { sz: 13.5, c: BODY, ls: 19 });
  rect(s, M, 6.44, FW, 0.5, { fill: LIGHT, line: false });
  t(s, "Bu yüzden ilk sorulacak soru şu: bu mekân kimi içeri çağırıyor, kimi dışarıda bırakıyor?",
    M + 0.24, 6.44, 11.3, 0.5, { sz: 13, b: true, c: ACC, va: "middle" });
  foot(s, "Kaynak: Mehrabian & Russell (1974), An Approach to Environmental Psychology.");
  s.addNotes("Yaklaşma–kaçınma modeli dönem boyunca kritiklerin ortak dili olacak.");
}

/* ===================== DUYULAR ===================== */
{
  const s = page("DUYULAR", "Duyular marka kimliğini nasıl taşır?",
    "Atmosfer tek bir duyudan doğmaz. Duyusal etki tek tek uyaranlardan değil, uyaranların birlikte çalışmasından doğar.");

  const sens = [
    ["Görme", "ışık · renk · kontrast · görüş hattı", "Işığın düzeyi mekânın hızını belirler; rengi ürünün rengini değiştirir."],
    ["Dokunma", "malzeme · doku · sıcaklık · ağırlık", "İnsan ürünü eline aldığında sahiplik duygusu geliştirir. İnternete karşı en güçlü duyu."],
    ["İşitme", "akustik · müzik · sessizlik", "Karar verilen yerlerde sesin düşmesi gerekir: kabin, danışma, ödeme."],
    ["Koklama", "koku · hafıza · kaynak", "Hafızaya en doğrudan bağlanan duyu. Kokunun kaynağı ürünün kendisi olmalı."],
    ["Tat", "tadım · ikram", "En dar kullanım alanı, ama kullanıldığı yerde en güçlü etki."],
    ["Beden", "ısı · hava · kot · ritim · yoğunluk", "Yoğunluk en güçlü etken: kalabalıkta insan hızlanır ve erken çıkar."]
  ];
  let y = 2.5;
  sens.forEach((it, i) => {
    rect(s, M, y, 1.7, 0.6, { fill: i === 1 ? SEC : ACC, line: false });
    t(s, it[0], M + 0.16, y, 1.5, 0.6, { sz: 14, b: true, c: WHITE, va: "middle" });
    t(s, it[1], M + 1.86, y, 2.9, 0.6, { sz: 10.5, b: true, c: i === 1 ? SEC : ACC, va: "middle", ls: 13 });
    t(s, it[2], M + 4.9, y + 0.02, 6.87, 0.58, { sz: 11.5, c: BODY, va: "middle", ls: 14.5 });
    y += 0.66;
    if (i < 5) line(s, M, y - 0.03, R, y - 0.03, { col: HAIR, w: 0.5 });
  });

  rect(s, M, 6.54, FW, 0.44, { fill: LIGHT, line: false });
  t(s, "Fazlası eksiği kadar sorunludur: asıl sorun duyusal yoksunluk değil, denetimsiz duyusal yüklemedir.",
    M + 0.24, 6.54, 11.3, 0.44, { sz: 12.5, b: true, c: ACC, va: "middle" });
  foot(s, "");
  s.addNotes("Dokunma vurgulu: fiziksel mağazanın çevrim içine karşı en güçlü kozu.");
}

{
  const s = page("DUYULAR", "Hangi duyu, yolculuğun hangi anında?",
    "Duyular mekânın her yerinde aynı yoğunlukta çalışmaz. Her duyunun baskın olduğu bir an vardır.");

  matrix(s, ["ÇEKİM", "EŞİK", "YÖNELME", "GEZİNME", "ETKİLEŞİM", "SATIN ALMA", "AYRILIŞ"], [
    ["Görme", [0, 1, 2, 3], "vitrin silüeti · teşhir kontrastı"],
    ["Beden", [1, 2, 3], "eşikte ısı · koridor genişliği"],
    ["Koklama", [1, 4], "ilk izlenim · ürünün kendi kokusu"],
    ["İşitme", [3, 4, 5], "genel akustik · kabinde sessizlik"],
    ["Dokunma", [3, 4], "açık raf · deneme · tezgâh"],
    ["Tat", [4], "tadım noktası · ikram"]
  ], M, 2.86, { w: 8.0, lw: 1.5, ch: 0.44, nw: 3.5,
                peak: [0, 1, 1, 4, 4, 4] });

  rule(s, M, 6.2, FW, "İKİ OKUMA", { c: SEC, lc: HAIR });
  const two = [
    ["Koyu kutular", "duyunun devrede olduğu anlar"],
    ["İkincil renkli kutu", "o duyunun baskın olduğu tek an — bütçe ve dikkat oraya gider"]
  ];
  const w = (FW - 0.3) / 2;
  two.forEach((it, i) => {
    const x = M + i * (w + 0.3);
    t(s, it[0], x, 6.42, 2.1, 0.28, { sz: 12, b: true, c: i ? SEC : ACC });
    t(s, it[1], x + 2.2, 6.42, w - 2.2, 0.46, { sz: 11, c: BODY, ls: 13.5 });
  });
  s.addNotes("Bu matris duyusal tasarımı mood board olmaktan çıkarıp yolculuğa bağlıyor.");
}

/* ===================== MÜŞTERİ YOLCULUĞU ===================== */
{
  const s = page("MÜŞTERİ DENEYİMİ", "Müşteri Yolculuğu Haritası nedir?",
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

{
  const s = page("MÜŞTERİ YOLCULUĞU", "Müşteri yolculuğunun sekiz aşaması",
    "Kaynaktaki model bu sekiz aşamayı tanımlıyor. Ortadaki altısı doğrudan iç mekânda geçiyor.");

  const st = ["FARKINDALIK", "ÇEKİM", "EŞİK", "YÖNLENME", "KEŞİF", "ETKİLEŞİM", "SATIN ALMA", "AYRILIŞ"];
  const gap = 0.04, w = (FW - gap * 7) / 8;
  st.forEach((x2, i) => {
    const x = M + i * (w + gap);
    const core = i >= 1 && i <= 6;
    rect(s, x, 2.6, w, 1.15, { fill: core ? ACC : LIGHT, line: false });
    t(s, String(i + 1).padStart(2, "0"), x + 0.1, 2.72, w - 0.2, 0.24,
      { sz: 9, b: true, c: core ? "E8C9BE" : MUTED, cs: 1.2 });
    t(s, x2, x + 0.1, 3.02, w - 0.2, 0.6, { sz: 11, b: true, c: core ? WHITE : MUTED, ls: 13.5 });
  });
  line(s, M + w + gap, 3.92, M + 7 * (w + gap) - gap, 3.92, { col: ACC, w: 1.5 });
  t(s, "İç mekânda geçen altı aşama — dersin tasarım konusu", M + w + gap, 4.0, 6.0, 0.26,
    { sz: 10.5, b: true, c: ACC });
  t(s, "Mekânın dışında", M, 4.0, 1.4, 0.26, { sz: 10.5, c: MUTED });
  t(s, "Mekânın dışında", M + 7 * (w + gap), 4.0, 1.4, 0.26, { sz: 10.5, c: MUTED, al: "right" });

  rule(s, M, 4.66, FW, "İÇ MİMARLIK İÇİN ASIL SORU", { c: SEC, lc: HAIR });
  t(s, "Bu aşamaların her biri hangi mekânsal kararla destekleniyor?", M, 4.9, FW, 0.42,
    { sz: 20, b: true, c: SEC });
  t(s, "Farkındalık ve ayrılış pazarlamanın alanına girer; aradaki altı aşama tasarımcının kurduğu deneyimdir. Bir sonraki iki slayt bu altı aşamanın mekânsal karşılıklarını ve müşterinin içerideki davranışını gösteriyor.",
    M, 5.46, FW, 0.7, { sz: 13.5, c: BODY, ls: 19 });
  foot(s, "Kaynak: I-AM İstanbul müşteri yolculuğu modeli; Sunar Bükülmez vd. (2025), Şekil 1.");
  s.addNotes("Aşama adlarını öğrenciye yazdırın; dönem boyunca bu terimlerle konuşacağız.");
}

{
  const s = page("İÇ MİMARLIK AÇISINDAN", "Mağazada hangi temasları tasarlıyoruz?",
    "Kaynak model fiziksel mağazaya uyarlandığında yönlenme, ürün ve operasyon gibi iç mimarlık gerektiren alanlar öne çıkıyor.");

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

/* ===================== İÇERİDEKİ DAVRANIŞ ===================== */
{
  const s = page("AKIŞ VE DAVRANIŞ", "İnsan içeri girdikten sonra ne yapıyor?",
    "Müşterinin mekândaki davranışı rastgele değil. Üç eğilim, mağaza kurgusunun başlangıç noktasıdır.");

  const beh = [
    ["Sağa yönelim", "İnsanlar girer girmez sağa yönelir. Kural değil, eğilim."],
    ["Güç duvarı", "Sağdaki ilk büyük yüzey; en güçlü ürün buraya konur."],
    ["Görüş hattı", "Derinlik girişten okunmalı; yoksa insan tereddüt eder."],
    ["Geçiş bölgesi", "Girişin ardına ürün konmaz; göz uyum sağlar."]
  ];
  const w = (FW - 0.2 * 3) / 4;
  beh.forEach((it, i) => {
    const x = M + i * (w + 0.2);
    rect(s, x, 2.5, w, 1.6, { fill: i === 1 ? SEC : LIGHT, line: false });
    tag(s, x + 0.2, 2.7, String(i + 1).padStart(2, "0"),
      { fill: i === 1 ? WHITE : ACC, tc: i === 1 ? SEC : WHITE, d: 0.3 });
    t(s, it[0], x + 0.2, 3.14, w - 0.4, 0.3, { sz: 14, b: true, c: i === 1 ? WHITE : INK });
    t(s, it[1], x + 0.2, 3.48, w - 0.4, 0.58, { sz: 10.5, c: i === 1 ? SECT : MUTED, ls: 13.5 });
  });

  rule(s, M, 4.42, FW, "DÖRT PLAN TİPİ — DAVRANIŞI FARKLI BİÇİMDE KURAR", { c: ACC, lc: HAIR });
  chain(s, [
    ["Izgara", "Paralel raf dizileri. Verimli ve tahmin edilebilir; keşif duygusu düşük."],
    ["Serbest akış", "Bağımsız yerleşmiş adalar. Keşif yüksek, alan verimi düşük."],
    ["Döngü", "Müşteriyi tüm mağazadan geçiren tek rota."],
    ["Çapraz", "Açılı yerleşim; görüş hatlarını uzatır, ürünü sürekli yeni gösterir."]
  ], 4.62, 1.24, { gap: 0.04, hs: 13, bs: 10 });

  rule(s, M, 6.1, FW, "YÖNLENDİRMENİN İKİ KATMANI");
  t(s, "Önce mekânsal katman çalışır: görüş hatları, ışık farkı, tavan yüksekliği, zemin malzemesi, koridor genişliği. Grafik katman — tabela, etiket — ancak bunun üstüne gelir. Tabelayla çözülmeye çalışılan her yön problemi, aslında bir kurgu problemidir.",
    M, 6.3, FW, 0.6, { sz: 12.5, c: BODY, ls: 17 });
  s.addNotes("Bu slayt mağaza tasarımının detayına girmeden davranış bilgisini veriyor; yeterli.");
}

/* ===================== VAKA: YOLCULUK ===================== */
{
  const s = page("VAKA", "Seramik markasının müşteri yolculuğu",
    "Aynı marka, yolculuğun her aşamasında başka bir mekânsal karar üretir.");

  const j = [
    ["Çekim", "Vitrinde tek bir parça; arkasında çalışan çark görünüyor", "GÖRÜNÜRLÜK"],
    ["Eşik", "Ham yüzey, mat ışık ve çamurun kokusu karşılıyor", "DOĞAL"],
    ["Yönlenme", "Net görüş hattı; rota atölyeden tartıma doğru akıyor", "GÖRÜNÜRLÜK"],
    ["Keşif", "Her parça kendi kaidesinde, aralarında geniş boşluk", "TEKİLLİK"],
    ["Etkileşim", "Dokunma serbest; numune ve üretim anlatısı tezgâhta", "TEKİLLİK"],
    ["Satın alma", "Ambalajın kendisi zanaatın parçası; paketleme görünür", "DOĞAL"],
    ["Ayrılış", "Parçanın kim tarafından yapıldığı yazan kart", "TEKİLLİK"]
  ];
  const cols = [["AŞAMA", 2.1], ["MEKÂNSAL KARAR", 6.3], ["HANGİ KELİMEYİ TAŞIYOR", 3.23]];
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
    const sec2 = row[2] !== "DOĞAL";
    rect(s, xs[2], yy, cols[2][1], 0.46, { fill: sec2 ? SECT : LIGHT, line: false });
    t(s, row[2], xs[2] + 0.14, yy, cols[2][1] - 0.28, 0.46,
      { sz: 11, b: true, c: sec2 ? SEC : ACC, va: "middle", cs: 1 });
  });
  t(s, "Bir aşama birden fazla kelimeyi taşıyabilir; taşımıyorsa o aşama henüz tasarlanmamıştır.",
    M, 6.46, FW, 0.3, { sz: 13.5, b: true, c: ACC });
  foot(s, "Örnek senaryo; kaynak modelin öğrenci tasarımına aktarılışını göstermek için kurulmuştur.");
  s.addNotes("Sağ kolon kelime–karar ilişkisinin yolculuk üzerinde okunuşu.");
}

/* ===================== MARKA KATEGORİLERİ ===================== */
{
  const s = page("MARKA SEÇİMİ", "Hangi tür ürün satan markaları seçebilirsiniz?",
    "Ürünün türü mekândan istediği şeyi belirler. Aşağıdaki altı grup, ihtiyaçlarına göre ayrıldı — kendi adayınız hangi gruba giriyor?");

  table(s, [["ÜRÜN GRUBU", 2.55], ["ÖRNEK MARKA TÜRLERİ", 3.4], ["MEKÂNDAN NE İSTER", 5.74]], [
    ["Yüksek değer, az ürün", "Mücevher · saat · sanat baskısı · tekil tasarım objesi",
     "Kilitli ve vitrinli teşhir · nokta aydınlatma · oturarak satış · güvenlik ve sigorta"],
    ["Denenen ürün", "Giyim · ayakkabı · gözlük · şapka · takı",
     "Deneme kabini ve ayna · oturma · stok yakınlığı · ayakkabıda büyük kutu deposu"],
    ["Koklanan ve tadılan ürün", "Parfüm · kahve ve çay · çikolata · zeytinyağı ve baharat · sabun",
     "Test tezgâhı · havalandırma ve koku nötrleme · lavabo · dökme satış ve kapalı stok"],
    ["Taranan ürün", "Kitap · plak · kırtasiye ve kâğıt · tohum ve bitki",
     "Uzun raf metrajı · kategori işaretleme · oturma · bitkide su, ışık, nem ve drenaj"],
    ["Ağır ve hacimli ürün", "Mobilya · halı ve kilim · ev tekstili · bisiklet",
     "Kurulu kullanım senaryosu · geniş rota · asma ve katman sistemi · mal kabul ve büyük depo"],
    ["Üretimi görünür ürün", "Seramik · deri ve ayakkabı atölyesi · terzi · fırın · kahve kavurma",
     "Atölye ile satışın bir arada olması · fırın, çark, tezgâh · ısı, koku ve atık · kuruma rafı"]
  ], 2.5, { rh: 0.58, ks: 12.5, cs2: 10.5 });

  rect(s, M, 6.62, FW, 0.44, { fill: SEC, line: false });
  t(s, "Son grup bu ders için en verimlisi: üretimi görünür bir marka, TEKİLLİK ve GÖRÜNÜRLÜK kelimelerini doğrudan mekâna çevirmenize izin verir.",
    M + 0.24, 6.62, 11.3, 0.44, { sz: 11.5, b: true, c: WHITE, va: "middle" });
  s.addNotes("Öğrenci seçim yaparken bu tabloyu kullansın: hangi gruptaysa mekânsal programı oradan başlıyor.");
}

/* ===================== 16 SINIF ÇALIŞMASINA GEÇİŞ ===================== */
{
  const s = page("ŞİMDİ SIRA SİZDE", "Sunumdan sınıf çalışmasına geçiyoruz",
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
  const s = page("BUGÜNKÜ ÇALIŞMA", "Karşılaştırma paftasında ne dolduracaksınız?",
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
  const s = page("KAYNAKLAR", "Dersin temel kaynakları",
    "Sunumun çerçevesi aşağıdaki makale ve ders izlencesinden kuruldu.");

  const refs = [
    ["Sunar Bükülmez, P., Girginkaya Akdağ, S. ve Ekin, G. (2025)", "Retail Design Competencies and Customer Journey Mapping Tools. The International Journal of Design Education, 19(2), 25–50. — Marka anahtarı ve yolculuk haritası"],
    ["Wheeler, A. (2017)", "Designing Brand Identity. Wiley. — Marka DNA'sı ve marka deneyiminin bileşenleri"],
    ["Kotler, P. (1973)", "Atmospherics as a Marketing Tool. Journal of Retailing, 49(4), 48–64. — Atmosfer kavramı"],
    ["Bitner, M. J. (1992)", "Servicescapes: The Impact of Physical Surroundings. Journal of Marketing, 56(2), 57–71. — Fiziksel çevrenin üç kanalı"],
    ["Mehrabian, A. ve Russell, J. A. (1974)", "An Approach to Environmental Psychology. MIT Press. — Yaklaşma ve kaçınma davranışı"],
    ["Spence, C. vd. (2014)", "Store Atmospherics: A Multisensory Perspective. Psychology & Marketing, 31(7), 472–488. — Duyuların birlikte çalışması"],
    ["Pallasmaa, J. (2005)", "The Eyes of the Skin. Wiley. [Tenin Gözleri, YEM Yayın] — Mekânın bedenle deneyimlenmesi"],
    ["Lemon, K. N. ve Verhoef, P. C. (2016)", "Understanding Customer Experience Throughout the Customer Journey. Journal of Marketing, 80(6), 69–96."],
    ["Stein, A. ve Ramaseshan, B. (2016)", "Towards the Identification of Customer Experience Touch Point Elements. JRCS, 30, 8–19."],
    ["Underhill, P. (2008)", "Why We Buy: The Science of Shopping. Simon & Schuster. — Mağaza içi davranış ve sağa yönelim"],
    ["Mesher, L. (2010)", "Basics Interior Design: Retail Design. AVA Publishing."],
    ["İç Mimari Tasarım III ders izlencesi (2025–2026)", "Proje kapsamı, gereklilikler ve öğrenme çıktıları."]
  ];
  refs.forEach((r, i) => {
    const col = i < 6 ? 0 : 1;
    const yy = 2.5 + (i % 6) * 0.72;
    const cx = M + col * 5.99;
    rect(s, cx, yy + 0.06, 0.09, 0.09, { fill: ACC, line: false });
    t(s, r[0], cx + 0.22, yy - 0.02, 5.56, 0.28, { sz: 10.5, b: true, c: INK, ls: 13 });
    t(s, r[1], cx + 0.22, yy + 0.24, 5.56, 0.44, { sz: 9.5, c: BODY, ls: 12 });
  });
  line(s, 6.39, 2.46, 6.39, 6.7, { col: HAIR, w: 0.6 });
  foot(s, "Kaynak modellerdeki diyagramlar bu sunum için yeniden çizilmiştir · doi.org/10.18848/2325-128X/CGP/v19i02/25-50");
}

/* ===================== 19 ÖDEV (en son) ===================== */
{
  const s = page("ÖDEV", "Bir sonraki derse ne getiriyorsunuz?",
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
