const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE";              // 13.33 x 7.5
p.title  = "Mağaza okuma çalışma kâğıdı";

/* ---------------- palette (unchanged) ---------------- */
const INK   = "16161A";
const PAPER = "FCFCFA";
const BODY  = "2B2B31";
const MUTED = "7A7A82";
const FAINT = "A6A6AC";
const ACC   = "8C3A2B";
const ACCT  = "F6EAE6";   // accent tint for highlighted zones
const BACKF = "EFEFEC";   // back-of-house fill
const HAIR  = "C9C9CF";   // hairline
const DIMW  = "B9B9C0";

const H = "Cambria";
const S = "Calibri";

const M  = 0.85;
const CW = 5.50;
const C2 = 6.98;
const FW = 11.63;

let n = 0;

/* ================= text helpers ================= */

function label(s, t) {
  s.addText(t, { x: M, y: 0.52, w: 10.5, h: 0.26, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, bold: true, color: MUTED, charSpacing: 2.6 });
}
function num(s) {
  n += 1;
  s.addText(String(n), { x: 12.0, y: 6.95, w: 0.48, h: 0.26, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, color: FAINT, align: "right" });
}
function img(s, t) {
  s.addText("Görsel önerisi — " + t, { x: M, y: 6.9, w: 11.0, h: 0.34, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 8.5, color: FAINT, lineSpacing: 11 });
}
function slide(lab, title, titleSize) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  label(s, lab);
  s.addText(title, { x: M, y: 0.9, w: 11.4, h: 0.8, isTextBox: true, margin: 0,
    fontFace: H, fontSize: titleSize || 29, bold: true, color: INK, lineSpacing: 34 });
  num(s);
  return s;
}
// prose: one or two columns, balanced
function text(s, t, o) {
  o = o || {};
  const size = o.size || 14.5, ls = o.ls || 23;
  const y = o.y !== undefined ? o.y : 1.85;
  const h = o.h !== undefined ? o.h : 1.55;
  const w = o.w !== undefined ? o.w : (o.one ? FW : CW);
  if (o.one) {
    s.addText(t, { x: o.x !== undefined ? o.x : M, y: y, w: w, h: h, isTextBox: true, margin: 0,
      fontFace: H, fontSize: size, color: BODY, lineSpacing: ls });
    return;
  }
  const paras = t.split("\n\n");
  const per = Math.floor((CW * 72 - 4) / (size * 0.52));
  const est = paras.map(q => q.split("\n").reduce((a, l) => a + Math.max(1, Math.ceil(l.length / per)), 0) + 1);
  const tot = est.reduce((a, b) => a + b, 0);
  let acc = 0, cut = paras.length;
  for (let i = 0; i < paras.length; i++) { acc += est[i]; if (acc >= tot / 2) { cut = i + 1; break; } }
  const A = paras.slice(0, cut).join("\n\n"), B = paras.slice(cut).join("\n\n");
  s.addText(A, { x: M, y: y, w: CW, h: h, isTextBox: true, margin: 0,
    fontFace: H, fontSize: size, color: BODY, lineSpacing: ls });
  if (B) s.addText(B, { x: C2, y: y, w: CW, h: h, isTextBox: true, margin: 0,
    fontFace: H, fontSize: size, color: BODY, lineSpacing: ls });
}
function opener(nu, title, sub) {
  const s = p.addSlide();
  s.background = { color: INK };
  s.addText(nu, { x: M, y: 1.5, w: 3.4, h: 2.6, isTextBox: true, margin: 0,
    fontFace: H, fontSize: nu.length > 2 ? 92 : 130, bold: true, color: ACC, valign: "middle" });
  s.addText(title, { x: M, y: 3.95, w: 11.4, h: 1.45, isTextBox: true, margin: 0,
    fontFace: H, fontSize: title.length > 32 ? 34 : 40, bold: true, color: "FFFFFF", lineSpacing: 44 });
  s.addText(sub, { x: M, y: 5.5, w: 10.4, h: 0.9, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 15, color: DIMW, lineSpacing: 22 });
  n += 1;
  return s;
}
function quote(q, attr) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  s.addText(q, { x: M, y: 1.9, w: 11.4, h: 3.2, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 29, italic: true, color: INK, lineSpacing: 42 });
  s.addText(attr, { x: M, y: 5.3, w: 11.4, h: 0.4, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 14, bold: true, color: ACC });
  num(s);
  return s;
}

/* ================= diagram kit ================= */

function plan(s, x, y, w, h) {                       // building outline
  s.addShape(p.ShapeType.rect, { x, y, w, h,
    fill: { type: "none" }, line: { color: INK, width: 1.25 } });
}
function zone(s, x, y, w, h, t, kind, tsize) {       // kind: 0 normal, 1 accent, 2 back-of-house
  const fill = kind === 1 ? { color: ACCT } : kind === 2 ? { color: BACKF } : { type: "none" };
  const col  = kind === 1 ? ACC : kind === 2 ? MUTED : HAIR;
  s.addShape(p.ShapeType.rect, { x, y, w, h, fill: fill,
    line: { color: col, width: kind === 1 ? 1.25 : 0.75 } });
  if (t) s.addText(t, { x: x + 0.04, y: y, w: w - 0.08, h: h, isTextBox: true, margin: 0,
    fontFace: S, fontSize: tsize || 9, color: kind === 1 ? ACC : BODY,
    align: "center", valign: "middle", lineSpacing: 11 });
}
function arrow(s, x1, y1, x2, y2, o) {
  o = o || {};
  const x = Math.min(x1, x2), y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
  s.addShape(p.ShapeType.line, { x, y, w, h,
    flipH: x2 < x1, flipV: y2 < y1,
    line: { color: o.col || ACC, width: o.w || 1.75,
            dashType: o.dash || "solid", endArrowType: "triangle" } });
}
function dline(s, x1, y1, x2, y2, o) {               // plain line, no head
  o = o || {};
  const x = Math.min(x1, x2), y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
  s.addShape(p.ShapeType.line, { x, y, w, h,
    flipH: x2 < x1, flipV: y2 < y1,
    line: { color: o.col || HAIR, width: o.w || 0.9, dashType: o.dash || "solid" } });
}
function dot(s, x, y, o) {
  o = o || {};
  const d = o.d || 0.17;
  s.addShape(p.ShapeType.ellipse, { x: x - d / 2, y: y - d / 2, w: d, h: d,
    fill: { color: o.col || ACC }, line: { color: o.col || ACC } });
  if (o.t) s.addText(o.t, { x: x - d / 2, y: y - d / 2, w: d, h: d, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 7.5, bold: true, color: "FFFFFF", align: "center", valign: "middle" });
}
function cap(s, x, y, w, t, o) {                     // diagram caption / label
  o = o || {};
  s.addText(t, { x, y, w, h: o.h || 0.3, isTextBox: true, margin: 0,
    fontFace: o.face || S, fontSize: o.size || 9.5, bold: o.bold || false,
    color: o.col || MUTED, align: o.align || "left", lineSpacing: o.ls || 12,
    italic: o.italic || false });
}
// numbered legend beside a diagram
function legend(s, items, x, y, w, size) {
  let yy = y;
  items.forEach((it, i) => {
    dot(s, x + 0.09, yy + 0.11, { t: String(i + 1), d: 0.22, col: it[2] || ACC });
    s.addText(it[0], { x: x + 0.34, y: yy - 0.03, w: w - 0.34, h: 0.26, isTextBox: true,
      margin: 0, fontFace: S, fontSize: (size || 10.5) + 0.5, bold: true, color: INK });
    if (it[1]) s.addText(it[1], { x: x + 0.34, y: yy + 0.23, w: w - 0.34, h: 0.42, isTextBox: true,
      margin: 0, fontFace: S, fontSize: size || 10, color: MUTED, lineSpacing: 12 });
    yy += it[1] ? 0.74 : 0.4;
  });
}
// row of named examples across the width
function exampleRow(s, items, y, cols) {
  const c = cols || items.length, gap = 0.5;
  const w = (FW - gap * (c - 1)) / c;
  items.forEach((it, i) => {
    const col = i % c, row = Math.floor(i / c);
    const x = M + col * (w + gap), yy = y + row * 1.22;
    s.addText(it[0], { x, y: yy, w, h: 0.42, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, bold: true, color: ACC, lineSpacing: 17 });
    s.addText(it[1], { x, y: yy + 0.45, w, h: 0.68, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: MUTED, lineSpacing: 14 });
  });
}


/* ---------- worksheet helpers ---------- */
function field(s, x, y, w, h, lab, prompt, lines) {
  s.addShape(p.ShapeType.rect, { x, y, w, h,
    fill: { type: "none" }, line: { color: HAIR, width: 0.9 } });
  s.addText(lab, { x: x + 0.16, y: y + 0.1, w: w - 0.32, h: 0.24, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9, bold: true, color: ACC, charSpacing: 1.4 });
  s.addText(prompt, { x: x + 0.16, y: y + 0.32, w: w - 0.32, h: 0.44, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 8.5, italic: true, color: MUTED, lineSpacing: 10.5 });
  const n = lines || 3;
  for (let i = 0; i < n; i++)
    dline(s, x + 0.16, y + h - 0.18 - i * 0.24, x + w - 0.16, y + h - 0.18 - i * 0.24,
          { col: "E4E4E8", w: 0.75 });
}

/* =========================  SAYFA 1 — ÖĞRENCİ KÂĞIDI  ========================= */
{
  const s = p.addSlide();
  s.background = { color: PAPER };

  s.addText("Mağaza okuma", { x: 0.6, y: 0.3, w: 6.0, h: 0.5, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 26, bold: true, color: INK });
  s.addText("Verilen görseldeki mekândan markayı geri okuma çalışması", {
    x: 0.6, y: 0.8, w: 7.2, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10.5, color: MUTED });
  s.addText("AD SOYAD", { x: 8.4, y: 0.34, w: 1.4, h: 0.24, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 8, bold: true, color: FAINT, charSpacing: 1.4 });
  dline(s, 9.5, 0.58, 11.5, 0.58, { col: MUTED, w: 0.9 });
  s.addText("GÖRSEL NO", { x: 11.6, y: 0.34, w: 1.2, h: 0.24, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 8, bold: true, color: FAINT, charSpacing: 1.4 });
  dline(s, 11.6, 0.58, 12.73, 0.58, { col: MUTED, w: 0.9 });
  s.addText("Önce ne GÖRDÜĞÜNÜ yaz, sonra ondan ne ÇIKARDIĞINI. Gerekçesiz çıkarım yapma.", {
    x: 0.6, y: 1.08, w: 12.13, h: 0.28, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 12, italic: true, color: ACC });

  const c1 = 0.6, c2 = 4.5, c3 = 8.4, cwid = 3.7, rw = 4.33;
  field(s, c1, 1.45, cwid, 1.2, "MARKA",
    "Bu mekân hangi markaya ait olabilir? Ne vaat ediyor? Bunu hangi öğeden çıkardın?");
  field(s, c1, 2.75, cwid, 1.2, "KULLANICI",
    "Kim geliyor? Yanında kim var? Ne kadar zamanı var? Nelerden rahatsız olur?");
  field(s, c1, 4.05, cwid, 1.2, "ÜRÜN",
    "Ne satılıyor? Kaç çeşit? Dokunuluyor, deneniyor, koklanıyor mu? Fiyat segmenti?");

  field(s, c2, 1.45, cwid, 1.2, "DAVRANIŞ",
    "Mekân insanı nereye yönlendiriyor? Nerede yavaşlatıyor, nerede hızlandırıyor?");
  field(s, c2, 2.75, cwid, 1.2, "DUYULAR",
    "Hangi duyular devrede? Hangisi baskın? Hangisi hiç yok — ve bu bilinçli mi?");
  field(s, c2, 4.05, cwid, 1.2, "ATMOSFER",
    "Mekânın hissi: üç sıfat. Her sıfatı üreten somut tasarım kararı ne?");

  s.addShape(p.ShapeType.rect, { x: c3, y: 1.45, w: rw, h: 2.5,
    fill: { type: "none" }, line: { color: MUTED, width: 1.1 } });
  s.addText("PLAN VE DOLAŞIM TAHMİNİ", { x: c3 + 0.16, y: 1.55, w: rw - 0.32, h: 0.24,
    isTextBox: true, margin: 0, fontFace: S, fontSize: 9, bold: true, color: ACC, charSpacing: 1.4 });
  s.addText("Görselden tahmin ettiğin planı çiz. Girişi, ana rotayı ve durma noktalarını okla göster.",
    { x: c3 + 0.16, y: 1.77, w: rw - 0.32, h: 0.42, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 8.5, italic: true, color: MUTED, lineSpacing: 10.5 });

  field(s, c3, 4.05, rw, 1.2, "GÖRÜNMEYEN",
    "Depo, kasa arkası ve personel nerede olabilir? Görselde göremediğin ne var?");

  s.addText("ÜÇ ANAHTAR KELİME", { x: 0.6, y: 5.45, w: 2.3, h: 0.26, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9, bold: true, color: ACC, charSpacing: 1.6 });
  s.addText("“kaliteli”, “modern”, “özel” kabul edilmez — her markaya uyar, hiçbir mekânsal karar üretmez.",
    { x: 3.1, y: 5.45, w: 9.63, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, italic: true, color: MUTED });
  for (let i = 0; i < 3; i++) {
    const x = 0.6 + i * (3.87 + 0.25);
    s.addShape(p.ShapeType.rect, { x, y: 5.75, w: 3.87, h: 1.05,
      fill: { type: "none" }, line: { color: HAIR, width: 0.9 } });
    s.addText(String(i + 1), { x: x + 0.14, y: 5.82, w: 0.3, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: FAINT });
    dline(s, x + 0.5, 6.12, x + 3.71, 6.12, { col: MUTED, w: 0.9 });
    s.addText("kanıt — görselde neye dayanıyor?", { x: x + 0.14, y: 6.2, w: 3.6, h: 0.22,
      isTextBox: true, margin: 0, fontFace: S, fontSize: 8, italic: true, color: FAINT });
    dline(s, x + 0.14, 6.66, x + 3.71, 6.66, { col: "E4E4E8", w: 0.75 });
  }
  s.addText("Mağaza Tasarımı  ·  Hafta 1 egzersizi  ·  Süre: 25 dakika, bireysel ve sessiz", {
    x: 0.6, y: 6.94, w: 12.13, h: 0.26, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 8.5, color: FAINT });
  s.addNotes("A3 basmak en iyisi; A4 de olur ama yazı alanı daralır. Her öğrenciye tek görsel verin, dört farklı görsel dolaşsın.");
}

/* =========================  SAYFA 2 — HOCA NOTU  ========================= */
{
  const s = p.addSlide();
  s.background = { color: PAPER };
  s.addText("Egzersizi yönetme notu", { x: 0.6, y: 0.32, w: 8.0, h: 0.5, isTextBox: true,
    margin: 0, fontFace: H, fontSize: 24, bold: true, color: INK });
  s.addText("Mağaza okuma  ·  75 dakika", { x: 0.6, y: 0.82, w: 8.0, h: 0.28, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 10.5, color: MUTED });

  s.addText("GÖRSEL SEÇİM KRİTERLERİ", { x: 0.6, y: 1.35, w: 5.6, h: 0.26, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 9, bold: true, color: ACC, charSpacing: 1.6 });
  const crit = [
    "Dördü birbirinden farklı olsun: biri yoğun ve ucuz, biri az ürünlü ve pahalı, biri üretimi görünür, biri koku ya da gıda ağırlıklı.",
    "Tanınmayan mağazalar seçin. Öğrenci Zara'yı tanırsa görseli okumaz, bildiğini yazar.",
    "Logoyu ve tabelayı kırpın. Marka adı görünmesin — mekânı okumak zorunda kalsınlar.",
    "İç mekân görseli olsun, vitrin fotoğrafı değil; dolaşım okunabilsin.",
    "Görseli numaralandırın (1–4) ve kâğıdın üstüne numarayı yazdırın."
  ];
  let y = 1.64;
  crit.forEach(t => {
    dot(s, 0.72, y + 0.1, { d: 0.1, col: ACC });
    s.addText(t, { x: 0.95, y: y - 0.04, w: 5.3, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
    y += 0.56;
  });

  s.addText("AKIŞ", { x: 6.9, y: 1.35, w: 5.8, h: 0.26, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9, bold: true, color: ACC, charSpacing: 1.6 });
  const flow = [
    ["10 dk", "Yönerge + birlikte bir örnek. Beşinci bir görseli ekrana yansıtıp iki kutuyu sınıfla doldurun."],
    ["25 dk", "Bireysel ve sessiz çalışma. Konuşma yok, telefon yok, arama yok."],
    ["10 dk", "Aynı görseli alanlar dörtlü gruplaşır ve karşılaştırır. Anlaşamadıkları yer asıl konudur."],
    ["20 dk", "Dört grup sırayla görselini sınıfa anlatır — beşer dakika."],
    ["10 dk", "Kapanış sorusu: “Aynı mekân başka ne satabilirdi, ne satamazdı?”"]
  ];
  y = 1.64;
  flow.forEach(f => {
    s.addText(f[0], { x: 6.9, y: y, w: 0.75, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, bold: true, color: ACC });
    s.addText(f[1], { x: 7.75, y: y - 0.04, w: 4.98, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
    y += 0.56;
  });

  dline(s, 0.6, 4.62, 12.73, 4.62, { col: HAIR, w: 1 });
  s.addText("ÖRNEK DOLDURULMUŞ SATIR", { x: 0.6, y: 4.78, w: 5.6, h: 0.26, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 9, bold: true, color: ACC, charSpacing: 1.6 });
  s.addText("Bir seramik atölyesi görseli için:", { x: 0.6, y: 5.06, w: 5.6, h: 0.28,
    isTextBox: true, margin: 0, fontFace: S, fontSize: 10.5, italic: true, color: MUTED });
  const ex = [
    ["GÖRDÜĞÜM", "Ürünler tek tek, aralarında 30–40 cm boşlukla duruyor. Her parçanın üstünde ayrı bir nokta ışık var. Raf sayısı az."],
    ["ÇIKARDIĞIM", "Ürünler birbirinin aynısı değil; her biri tekil. Marka “el yapımı” iddiasında ve bunu yoğunluk düşürerek kanıtlıyor."],
    ["ANAHTAR KELİME", "TEKİLLİK  —  kanıt: ürünler arası boşluk ve parça başına ayrı aydınlatma."]
  ];
  y = 5.42;
  ex.forEach(e => {
    s.addText(e[0], { x: 0.6, y: y, w: 1.75, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 8.5, bold: true, color: FAINT, charSpacing: 1.2 });
    s.addText(e[1], { x: 2.45, y: y - 0.04, w: 10.28, h: 0.5, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12, color: BODY, lineSpacing: 16 });
    y += 0.5;
  });
  s.addText("En sık görülen hata: kanıtsız çıkarım. “Lüks bir marka” yazıp geçmek. Her çıkarımın yanında görseldeki dayanağını isteyin — bu alışkanlık dönem boyunca işinize yarayacak.",
    { x: 0.6, y: 6.98, w: 12.13, h: 0.4, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12, italic: true, color: ACC, lineSpacing: 16 });
  s.addNotes("Bu sayfayı öğrencilere dağıtmayın; kendinizde kalsın. Örnek satırı sadece sözlü olarak, ekrandaki beşinci görsel üzerinden gösterin.");
}

p.writeFile({ fileName: "Magaza-Okuma-Calisma-Kagidi.pptx" }).then(f => console.log("WROTE", f));
