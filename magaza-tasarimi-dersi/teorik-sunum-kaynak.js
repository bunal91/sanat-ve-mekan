const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE";              // 13.33 x 7.5
p.title  = "Mağaza Tasarımı — Teorik Giriş";

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

/* =========================================================
   KAPAK  ·  KAPSAM
   ========================================================= */
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addText("Mağaza\nTasarımı", { x: M, y: 1.55, w: 10.5, h: 2.6, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 68, bold: true, color: "FFFFFF", lineSpacing: 76 });
  s.addText("Mekân, marka ve duyular üzerine teorik bir giriş", {
    x: M, y: 4.35, w: 10.5, h: 0.55, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 24, color: ACC });
  s.addText("İç Mimarlık  ·  Proje Stüdyosu  ·  Teorik Ders", {
    x: M, y: 5.35, w: 10.5, h: 0.4, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 13, color: DIMW, charSpacing: 1.6 });
  n += 1;
  s.addNotes("On bir bölüm, ağırlıklı olarak diyagram üzerinden anlatım. Kaynaklar metin içinde parantezle verildi, tam künyeler sonda.");
}
{
  const s = p.addSlide();
  s.background = { color: PAPER };
  label(s, "SUNUMUN KAPSAMI");
  s.addText("On bir bölüm", { x: M, y: 0.9, w: 11.2, h: 0.6, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 29, bold: true, color: INK });
  const secs = [
    ["I", "Mağaza tasarımı nedir?"], ["II", "Atmosfer"], ["III", "Marka ve mekân"],
    ["IV", "Dışarıdan içeriye: cephe, vitrin, eşik"],
    ["V", "Mağazanın içi: işlevler ve yerleşim"],
    ["VI", "Akış ve yönlendirme"], ["VII", "Duyular"],
    ["VIII", "Işık ve malzeme"], ["IX", "Teknoloji"],
    ["X", "Herkes için mağaza"], ["XI", "Örnekler"]
  ];
  let y = 1.72;
  secs.forEach(sec => {
    s.addText(sec[0], { x: M, y, w: 0.85, h: 0.4, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 16, bold: true, color: ACC, valign: "middle" });
    s.addText(sec[1], { x: M + 0.95, y, w: 9.6, h: 0.4, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 16, color: BODY, valign: "middle" });
    y += 0.47;
  });
  num(s);
}

/* =========================================================
   I — MAĞAZA TASARIMI NEDİR
   ========================================================= */
opener("I", "Mağaza tasarımı nedir?", "Bir mekân tipi olarak mağaza ne yapar?");

{
  const s = slide("I · MAĞAZA TASARIMI NEDİR", "Mağaza aynı anda dört iş yapar");
  text(s, "Mağaza tasarımı, ürünlerin sunulduğu mekânın tasarlanmasıdır. Ancak mağaza yalnızca ürünün durduğu yer değil, markanın kendini üç boyutlu anlattığı yerdir (Mesher, 2010). Bu dört iş aynı anda çözülmek zorundadır.",
       { one: true, y: 1.78, h: 0.85, size: 15 });

  const bx = 0.85, by = 2.95, bw = 2.72, gap = 0.25;
  const items = [
    ["ÜRÜNÜ SUNAR", "Ürün görünür, ulaşılabilir\nve anlaşılır olmalı.\nRaf yüksekliği, ışık, ölçü."],
    ["YÖNLENDİRİR", "İnsan nereye gideceğini\ndüşünmemeli. İyi mağaza\ntabelayla değil kurguyla\nyönlendirir."],
    ["ATMOSFER ÜRETİR", "Işık, malzeme, ses ve koku\nbir duygu durumu yaratır;\nbu, karara etki eder."],
    ["İŞLETMEYİ BARINDIRIR", "Depo, kasa, personel ve\nmal kabul çözülmezse\nmağaza çalışmaz."]
  ];
  items.forEach((it, i) => {
    const x = bx + i * (bw + gap);
    zone(s, x, by, bw, 2.35, "", i === 3 ? 1 : 0);
    s.addText(String(i + 1), { x: x + 0.22, y: by + 0.18, w: 0.6, h: 0.45, isTextBox: true,
      margin: 0, fontFace: H, fontSize: 26, bold: true, color: i === 3 ? ACC : FAINT });
    s.addText(it[0], { x: x + 0.22, y: by + 0.72, w: bw - 0.44, h: 0.5, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 10.5, bold: true, color: i === 3 ? ACC : INK, charSpacing: 1.2 });
    s.addText(it[1], { x: x + 0.22, y: by + 1.24, w: bw - 0.44, h: 0.95, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13.5 });
  });
  cap(s, M, 5.55, 11.4, "Dördüncüsü en çok ihmal edilendir: bir mağaza sadece müşterinin gördüğü yer değildir.",
      { size: 13, face: H, col: ACC, italic: true, h: 0.4 });
  s.addNotes("Dördüncü kutuyu vurgulayın; sunumun V. bölümü bütünüyle buna ayrıldı.");
}

{
  const s = slide("I · MAĞAZA TASARIMI NEDİR", "Perakende tasarımının beş öğesi");
  text(s, "Bir mağaza tasarımı beş ayrı katmandan oluşur. Bunlar birbirinden bağımsız kararlar değildir; biri değiştiğinde diğerleri de değişir. Yine de tasarımı ele alırken bu beş başlığı ayrı ayrı sormak, hiçbirinin atlanmamasını sağlar.",
       { one: true, y: 1.74, h: 1.0, size: 15 });

  const ly = 4.25, x0 = 2.05, x1 = 11.3;
  dline(s, x0 - 0.5, ly, x1 + 0.5, ly, { col: HAIR, w: 1.25 });
  const els = [
    ["Cephe", "Tabela, cephe düzeni ve vitrin — mağazanın sokağa söylediği"],
    ["İç mekân öğeleri", "Mekânsal planlama, bölgeler, genel tasarım dili"],
    ["Teşhir", "Ürün teşhiri ve görsel düzenleme stratejisi"],
    ["Aydınlatma", "Genel, vurgu, dekoratif ve vitrin aydınlatması"],
    ["Mağaza içi iletişim", "İşaretler, ekranlar, marka anlatısı"]
  ];
  const sp = (x1 - x0) / (els.length - 1);
  els.forEach((e, i) => {
    const x = x0 + i * sp, up = i % 2 === 0;
    dot(s, x, ly, { d: 0.17, col: ACC });
    dline(s, x, up ? ly - 0.09 : ly + 0.09, x, up ? ly - 0.34 : ly + 0.34, { col: HAIR, w: 1 });
    s.addText(e[0], { x: x - 1.1, y: up ? ly - 1.4 : ly + 0.38, w: 2.2, h: 0.4,
      isTextBox: true, margin: 0, fontFace: H, fontSize: 14, bold: true, color: INK,
      align: "center", valign: up ? "bottom" : "top", lineSpacing: 17 });
    s.addText(e[1], { x: x - 1.1, y: up ? ly - 1.02 : ly + 0.78, w: 2.2, h: 0.66,
      isTextBox: true, margin: 0, fontFace: S, fontSize: 10, color: MUTED,
      align: "center", valign: up ? "top" : "top", lineSpacing: 12.5 });
  });
  cap(s, M, 6.0, 11.4, "Beşi de bu sunumun ilerleyen bölümlerinde ayrı ayrı ele alınacak.",
      { size: 12.5, face: H, col: ACC, italic: true, h: 0.4, align: "center" });
  s.addNotes("Bu slayt bir içindekiler görevi de görüyor: öğrenci hangi başlığın nerede açılacağını biliyor.");
}

{
  const s = slide("I · MAĞAZA TASARIMI NEDİR", "Alışveriş mekânı, satın alma biçimi değiştikçe değişti");
  const ty = 3.15, x0 = 2.0, x1 = 11.35;
  dline(s, x0, ty, x1, ty, { col: HAIR, w: 1 });
  const steps = [
    ["Dükkân", "Üretim ve satış\naynı mekânda"],
    ["Bedesten · Arasta\nHan", "Örtülü çarşı;\nesnafın bir arada\ndizilmesi"],
    ["Pasaj", "Havadan bağımsız\ngezinti"],
    ["Büyük mağaza", "Sabit fiyat,\nserbest dolaşım,\npazarlıksız alışveriş"],
    ["Deneyim mekânı", "Ürün her yerden\nalınabilir; mekân\nhatırlanır"]
  ];
  const sp = (x1 - x0) / (steps.length - 1);
  steps.forEach((st, i) => {
    const x = x0 + i * sp, last = i === steps.length - 1;
    dot(s, x, ty, { d: last ? 0.22 : 0.15, col: last ? ACC : MUTED });
    s.addText(st[0], { x: x - 1.1, y: ty - 1.05, w: 2.2, h: 0.75, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: last ? ACC : INK, align: "center",
      valign: "bottom", lineSpacing: 17 });
    s.addText(st[1], { x: x - 1.1, y: ty + 0.28, w: 2.2, h: 0.95, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: MUTED, align: "center", lineSpacing: 13 });
  });
  text(s, "Her aşamada değişen şey mekânın kendisi değil, insanın ürünle kurduğu ilişkidir. Büyük mağazanın getirdiği kırılma özellikle önemlidir: bir şey almadan içeride dolaşabilmek, modern mağazanın kurucu fikridir.\n\nBugünkü kırılma da benzer: ürün internetten alınabildiği için mağazanın işi ürünü bulundurmak değil, ürünle karşılaşmayı kurmaktır (Pine & Gilmore, 1998).",
       { y: 4.85, h: 1.85 });
  img(s, "Bedesten ve arasta iç mekânı (Bursa, Edirne) · Çiçek Pasajı veya Hazzopulo Pasajı · Le Bon Marché tarihî fotoğrafı");
  s.addNotes("Tarihi hızlı geçin. Anadolu tipolojilerini (bedesten, arasta, han) mutlaka anın — mağaza tasarımı ithal bir konu değil.");
}

/* =========================================================
   II — ATMOSFER
   ========================================================= */
opener("II", "Atmosfer", "Mekânın, üründen bağımsız olarak davranışı etkileme gücü.");

{
  const s = slide("II · ATMOSFER", "Fiziksel çevre üç kanaldan etki eder");
  text(s, "Bir mekânın atmosferinin, ürünün kendisinden bağımsız olarak satın alma kararını etkilediği fikri elli yıllıktır (Kotler, 1973). Bitner (1992) bu etkiyi üç boyuta ayırır — ve bu üç boyut yalnızca müşteriyi değil, çalışanı da etkiler.",
       { one: true, y: 1.74, h: 1.0, size: 15 });

  const cy = 4.25, r = 1.02;
  const cols = [
    [2.55, "ORTAM KOŞULLARI", "ısı · ışık · ses\nkoku · hava"],
    [6.30, "MEKÂN VE İŞLEV", "yerleşim · ekipman\nmobilya · ölçü"],
    [10.05, "İŞARET VE SEMBOL", "tabela · malzeme\ndekor · anlam"]
  ];
  cols.forEach(c => {
    s.addShape(p.ShapeType.ellipse, { x: c[0] - r, y: cy - r, w: r * 2, h: r * 2,
      fill: { type: "none" }, line: { color: HAIR, width: 1 } });
    s.addText(c[1], { x: c[0] - r, y: cy - 0.42, w: r * 2, h: 0.34, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: INK, align: "center", charSpacing: 1 });
    s.addText(c[2], { x: c[0] - r, y: cy - 0.02, w: r * 2, h: 0.7, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: MUTED, align: "center", lineSpacing: 13 });
  });
  arrow(s, 3.62, cy, 5.24, cy, { col: HAIR, w: 1 });
  arrow(s, 7.37, cy, 8.99, cy, { col: HAIR, w: 1 });
  cap(s, M, 5.62, 11.4, "Üçü birlikte algılanır. Biri diğerini yalanladığında insan bunu fark eder — çoğu zaman nedenini adlandıramadan.",
      { size: 13, face: H, col: ACC, italic: true, h: 0.4, align: "center" });
  s.addNotes("Üçüncü boyutu örnekle açın: aynı ürünü satan iki mağazadan biri mermer, biri ham kontrplak kullanıyorsa ikisi farklı şey söyler.");
}

{
  const s = slide("II · ATMOSFER", "Mekân insanı ya içeri çeker ya dışarı iter");
  const y0 = 2.15, bw = 2.3, bh = 0.85;
  const boxes = [["MEKÂNSAL\nUYARAN", 1.35], ["DUYGUSAL\nTEPKİ", 5.0], ["DAVRANIŞ", 8.65]];
  boxes.forEach(b => zone(s, b[1], y0, bw, bh, b[0], 0, 10.5));
  arrow(s, 3.72, y0 + bh / 2, 4.9, y0 + bh / 2, { col: MUTED, w: 1.25 });
  arrow(s, 7.37, y0 + bh / 2, 8.55, y0 + bh / 2, { col: MUTED, w: 1.25 });

  cap(s, 1.35, y0 + bh + 0.16, 2.3, "ışık · ses · koku\nyoğunluk · malzeme", { align: "center", ls: 13, h: 0.45 });
  cap(s, 5.0, y0 + bh + 0.16, 2.3, "haz\nuyarılma\nkontrol duygusu", { align: "center", ls: 13, h: 0.6 });

  zone(s, 8.65, y0 + 1.25, bw, 0.62, "YAKLAŞMA", 1, 10.5);
  cap(s, 8.65, y0 + 1.93, 2.3, "girer · kalır · dolaşır\netkileşime geçer", { align: "center", ls: 12.5 });
  zone(s, 8.65, y0 + 2.55, bw, 0.62, "KAÇINMA", 0, 10.5);
  cap(s, 8.65, y0 + 3.23, 2.3, "girmez · kısa keser\nçıkar", { align: "center", ls: 12.5 });
  arrow(s, 9.8, y0 + bh, 9.8, y0 + 1.25, { col: ACC, w: 1.25 });
  arrow(s, 9.8, y0 + 1.87, 9.8, y0 + 2.55, { col: MUTED, w: 1.25, dash: "dash" });

  text(s, "Mekânsal uyaranlar önce bir duygu üretir, duygu da bir davranışa dönüşür (Mehrabian & Russell, 1974). Buradan çıkan sonuç açıktır: nötr bir mekân yoktur — hiçbir şey hissettirmemek de bir sonuçtur ve genellikle kaçınma yönünde çalışır. Sadelik bir karardır; kararsızlık değil.",
       { x: M, y: 6.0, w: 11.4, h: 0.85, size: 13.5, ls: 21, one: true });
  s.addNotes("'Nötr mekân yoktur' cümlesi bu bölümün özeti.");
}

{
  const s = slide("II · ATMOSFER", "Deneyim neyden oluşur?");
  text(s, "Perakende deneyimini oluşturan bileşenler, duyusal markalama literatüründe dört başlık altında toplanır (Lindström, 2005). Bunların üçü tasarımcının doğrudan kurduğu şeylerdir; dördüncüsü işletmenin kararıdır ama mekân onu barındırmak zorundadır.",
       { one: true, y: 1.74, h: 1.0, size: 15 });

  const cy = 3.85, r = 0.86;
  const items = [
    ["Mağaza\ntasarımı", "Estetik olarak çekici bir mekân, hikâye anlatımı, gündelikten kopuş"],
    ["Duyular", "Görme, işitme, dokunma, koklama ve tat duyusunun birlikte kurulması"],
    ["Zirve–son\netkisi", "İnsan bir deneyimi en yoğun anı ve bitişiyle hatırlar; arası silinir"],
    ["Perakende\neğlence", "Gündelik alışverişi kıran, planlı bir sürpriz ya da etkinlik"]
  ];
  const xs = [2.35, 5.4, 8.45, 11.5];
  items.forEach((it, i) => {
    const x = xs[i], hi = i === 1;
    s.addShape(p.ShapeType.ellipse, { x: x - r, y: cy - r, w: r * 2, h: r * 2,
      fill: { color: hi ? ACCT : PAPER }, line: { color: hi ? ACC : HAIR, width: hi ? 1.5 : 1 } });
    s.addText(it[0], { x: x - r, y: cy - 0.45, w: r * 2, h: 0.9, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, bold: true, color: hi ? ACC : INK,
      align: "center", valign: "middle", lineSpacing: 14 });
    s.addText(it[1], { x: x - 1.42, y: cy + r + 0.22, w: 2.84, h: 1.05, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 10.5, color: MUTED, align: "center", lineSpacing: 13.5 });
    if (i < 3) dline(s, x + r, cy, xs[i + 1] - r, cy, { col: HAIR, w: 1 });
  });
  cap(s, M, 6.1, 11.4, "Zirve–son etkisi psikolojiden gelir (Kahneman & Fredrickson): bir mağazadan çıkarken yaşanan an, içeride geçen kırk dakikadan daha fazla hatırlanır.",
      { size: 12.5, face: H, col: BODY, h: 0.6, ls: 18 });
  s.addNotes("İkinci daire vurgulu; sunumun en uzun bölümü olan duyular oradan geliyor. Zirve–son etkisi çıkış tasarımını önemli kılıyor.");
}

{
  const s = slide("II · ATMOSFER", "Mağazanın sunabileceği dört deneyim türü");
  text(s, "Mağaza deneyimi tek bir biçimde kurulmaz. Aşağıdaki dört tür farklı mekânsal talepler üretir ve bir mağaza bunlardan yalnızca birini ya da birkaçını seçer.",
       { one: true, y: 1.78, h: 0.65, size: 15 });

  const y0 = 2.75, w = 2.72, h = 2.45, gap = 0.25;
  const kinds = [
    ["Öğrenme", "Müşterinin etkin katıldığı, yeni bir şey öğrendiği deneyim.",
     "atölye masası · demo alanı · oturma"],
    ["Kişisel satış", "Satış görevlisinin rolü ürün gösterenden deneyim kuranına dönüşür.",
     "danışma noktası · ölçü alma · birebir tezgâh"],
    ["Çok kanallılık", "Müşteri birden çok kanaldan geliyor; mağaza bunları buluşturmalı.",
     "stok sorgu · online sipariş teslim · iade"],
    ["Hazine avı", "Sınırlı sürede bulunan ürünlerin yarattığı heyecan; hızlı ürün değişimi.",
     "esnek teşhir · kampanya alanı · değişebilir düzen"]
  ];
  kinds.forEach((k, i) => {
    const x = 0.85 + i * (w + gap);
    zone(s, x, y0, w, h, "", i === 3 ? 1 : 0);
    s.addText(k[0], { x: x + 0.24, y: y0 + 0.26, w: w - 0.48, h: 0.4, isTextBox: true,
      margin: 0, fontFace: H, fontSize: 17, bold: true, color: i === 3 ? ACC : INK });
    s.addText(k[1], { x: x + 0.24, y: y0 + 0.72, w: w - 0.48, h: 1.05, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 11, color: BODY, lineSpacing: 14 });
    s.addText("MEKÂNSAL TALEP", { x: x + 0.24, y: y0 + 1.78, w: w - 0.48, h: 0.24,
      isTextBox: true, margin: 0, fontFace: S, fontSize: 8, bold: true, color: FAINT, charSpacing: 1.4 });
    s.addText(k[2], { x: x + 0.24, y: y0 + 2.0, w: w - 0.48, h: 0.4, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 10, color: i === 3 ? ACC : MUTED, lineSpacing: 12.5 });
  });
  cap(s, M, 5.5, 11.4, "Her deneyim türü mekânda yer kaplar. Bir mağaza dördünü birden iyi yapamaz; hangisini seçtiği bir tasarım kararıdır.",
      { size: 13, face: H, col: ACC, italic: true, h: 0.45 });
  text(s, "Bu türler çok kanallı perakende üzerine yapılan çalışmalarda, özellikle genç kuşak müşterinin beklentileri üzerinden tanımlanıyor (Xi & Idris, 2026; Lindström, 2005).",
       { one: true, y: 6.1, w: 11.4, h: 0.6, size: 12 });
  s.addNotes("Öğrencilerin markasına hangi deneyim türünün uyduğunu düşündürün — bu, konsept kararını doğrudan besler.");
}

/* =========================================================
   III — MARKA VE MEKÂN
   ========================================================= */
opener("III", "Marka ve mekân", "Bir markanın ne olduğu, mekânda nasıl görünür hâle gelir.");

{
  const s = slide("III · MARKA VE MEKÂN", "Marka DNA'sı: bir markayı ne oluşturur?");
  text(s, "Marka bir logo değil, bir vaadin tutarlı biçimde tekrarlanmasıdır (Wheeler, 2017). Bu vaat beş bileşenden oluşur ve bunlar iki gruba ayrılır: markanın kendi içinde bildiği şeyler ve dışarıya gösterdiği şeyler.",
       { one: true, y: 1.78, h: 0.72, size: 15 });

  const oy = 2.72, oh = 2.35;
  const iw = 2.0, gapi = 0.22;
  const inner = [
    ["NEDEN VARIZ", "Markanın özü ve\nvar oluş nedeni"],
    ["İDEAL", "Neye dönüşmek\nistiyor"],
    ["DEĞERLER", "İnanç sistemi;\nçalışma ve\niletişim biçimi"]
  ];
  inner.forEach((it, i) => {
    const x = 1.15 + i * (iw + gapi);
    zone(s, x, oy + 0.25, iw, oh - 0.5, "", 0);
    s.addText(it[0], { x: x + 0.14, y: oy + 0.5, w: iw - 0.28, h: 0.32, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 10, bold: true, color: INK, align: "center", charSpacing: 1 });
    s.addText(it[1], { x: x + 0.14, y: oy + 0.9, w: iw - 0.28, h: 1.0, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 10.5, color: MUTED, align: "center", lineSpacing: 13.5 });
  });
  dline(s, 7.62, oy - 0.05, 7.62, oy + oh + 0.55, { col: MUTED, w: 1, dash: "dash" });
  const outer = [
    [7.9, "KİŞİLİK", "Markanın pazara\nkonuşma biçimi,\nses tonu"],
    [10.25, "PAZAR KONUMU", "Rekabette kendini\nnasıl konumlandırdığı"]
  ];
  outer.forEach(o => {
    zone(s, o[0], oy + 0.25, 2.15, oh - 0.5, "", 1);
    s.addText(o[1], { x: o[0] + 0.14, y: oy + 0.5, w: 2.15 - 0.28, h: 0.32, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 10, bold: true, color: ACC, align: "center", charSpacing: 1 });
    s.addText(o[2], { x: o[0] + 0.14, y: oy + 0.9, w: 2.15 - 0.28, h: 1.0, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 10.5, color: BODY, align: "center", lineSpacing: 13.5 });
  });
  cap(s, 1.15, oy + oh + 0.18, 6.3, "İŞLETMENİN İÇİ", { bold: true, size: 10, col: INK, align: "center", charSpacing: 1.4 });
  cap(s, 1.15, oy + oh + 0.44, 6.3, "Kim olduğumuz, ne olmak istediğimiz — kendi kodumuz", { size: 10, align: "center" });
  cap(s, 7.9, oy + oh + 0.18, 4.5, "İŞLETMENİN DIŞI", { bold: true, size: 10, col: ACC, align: "center", charSpacing: 1.4 });
  cap(s, 7.9, oy + oh + 0.44, 4.5, "Dışarıya ne söylediğimiz, pazarda nasıl durduğumuz", { size: 10, align: "center" });

  cap(s, M, 6.05, 11.4, "Mekân bu beşini birden taşımak zorundadır. Reklam bir şey söyler; mekân o şeyi kanıtlamak zorundadır.",
      { size: 13.5, face: H, col: ACC, italic: true, h: 0.45 });
  s.addNotes("Sağdaki iki kutu vurgulu, çünkü mekân tasarımı en doğrudan onlarla ilgilidir. Ama solu bilmeden sağı kurulamaz.");
}

{
  const s = slide("III · MARKA VE MEKÂN", "Markadan mekâna: dört adım");
  text(s, "Marka analizi bir ön hazırlık değil, tasarımın ilk aşamasıdır. Aradaki yol dört adımda kurulur ve her adım bir sonrakinin girdisini üretir.",
       { one: true, y: 1.78, h: 0.6, size: 15 });

  const y0 = 2.6, w = 2.72, gap = 0.25;
  const steps = [
    ["Araştırma", "Marka hakkında bilgi toplama.", "web sitesi · ürün ve ambalaj · sosyal medya · basın · marka sahibiyle görüşme"],
    ["Analiz", "Toplananın anlamlandırılması.", "marka DNA'sı · hedef kitle · ürün · vizyon ve misyon · ihtiyaçlar"],
    ["Konsept geliştirme", "Analizin mekânsal fikre dönüşmesi.", "anahtar kelimeler · trend araştırması · atmosfer çalışması · mekânsal planlama"],
    ["Sunum", "Fikrin anlatılabilir hâle gelmesi.", "konsept görselleştirmesi · kavramsal ve mekânsal planlar · anlatı"]
  ];
  steps.forEach((st, i) => {
    const x = 0.85 + i * (w + gap);
    s.addText(String(i + 1), { x: x, y: y0, w: w, h: 0.75, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 46, bold: true, color: i === 2 ? ACC : FAINT });
    dline(s, x, y0 + 0.86, x + w - 0.3, y0 + 0.86, { col: i === 2 ? ACC : MUTED, w: 2 });
    arrow(s, x + w - 0.34, y0 + 0.86, x + w - 0.04, y0 + 0.86, { col: i === 2 ? ACC : MUTED, w: 2 });
    s.addText(st[0], { x: x, y: y0 + 1.0, w: w, h: 0.38, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 16, bold: true, color: i === 2 ? ACC : INK });
    s.addText(st[1], { x: x, y: y0 + 1.42, w: w, h: 0.55, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: BODY, lineSpacing: 14.5 });
    s.addText(st[2], { x: x, y: y0 + 2.0, w: w, h: 1.35, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: MUTED, lineSpacing: 13.5 });
  });
  cap(s, M, 6.15, 11.4, "Üçüncü adım vurgulu: analizle tasarım arasındaki köprü burada kurulur, ve genellikle burada kopar.",
      { size: 13, face: H, col: ACC, italic: true, h: 0.45 });
  s.addNotes("Öğrenciler 1 ve 2'yi yapıp doğrudan çizime geçiyor. Üçüncü adım atlanınca analiz ile tasarım arasında ilişki kurulamıyor.");
}

{
  const s = slide("III · MARKA VE MEKÂN", "Anahtar kelimeler nasıl çıkarılır?");
  text(s, "Anahtar kelime, marka analizini tasarım kararına bağlayan ara durakdır. Analizden doğrudan plana geçilemez; arada kelimeye dönüşmesi gerekir.",
       { one: true, y: 1.76, h: 0.6, size: 15 });

  const y0 = 2.5, w = 2.72, gap = 0.25, h = 2.6;
  const stages = [
    ["KAYNAKLAR", "Markanın kendi ürettiği her şey", "web sitesi metinleri\nürün ve ambalaj\nsosyal medya dili\nmüşteri yorumları\nmarka sahibiyle görüşme\nrakiplerin dili"],
    ["HAM KELİME HAVUZU", "Otuz–elli kelime", "sıfat, fiil ve nesne adı\nhepsini yaz, hiçbirini eleme\ntekrar edenleri işaretle"],
    ["GRUPLAMA", "Kümeleme ve eleme", "eş anlamlıları birleştir\ntekrar edenleri kümele\nmarkaya özgü olmayanları at\n(“kaliteli”, “modern”, “özel”)"],
    ["ANAHTAR KELİMELER", "Üç–beş kelime", "her biri mekânsal olarak\nsınanabilir olmalı\nbirbirinin eş anlamlısı olmamalı"]
  ];
  stages.forEach((st, i) => {
    const x = 0.85 + i * (w + gap);
    zone(s, x, y0, w, h, "", i === 3 ? 1 : 0);
    s.addText(st[0], { x: x + 0.2, y: y0 + 0.22, w: w - 0.4, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 3 ? ACC : INK, charSpacing: 1.2, lineSpacing: 12 });
    s.addText(st[1], { x: x + 0.2, y: y0 + 0.72, w: w - 0.4, h: 0.46, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12.5, italic: true, color: i === 3 ? ACC : MUTED, lineSpacing: 16 });
    s.addText(st[2], { x: x + 0.2, y: y0 + 1.2, w: w - 0.4, h: 1.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: BODY, lineSpacing: 13.5 });
    if (i < 3) arrow(s, x + w + 0.03, y0 + h / 2, x + w + 0.22, y0 + h / 2, { col: ACC, w: 1.5 });
  });
  cap(s, M, 5.4, 11.4, "SINAMA", { size: 9, bold: true, col: FAINT, h: 0.24, charSpacing: 1.6 });
  cap(s, M, 5.66, 11.4, "Bir anahtar kelime bir mekânsal karara dönüşemiyorsa, o bir anahtar kelime değildir.",
      { size: 17, face: H, col: ACC, italic: true, h: 0.45 });
  text(s, "“Kaliteli” bir anahtar kelime değildir, çünkü hangi markayı seçerseniz seçin doğrudur ve hiçbir mekânsal karar üretmez. “Elden ele geçen” bir anahtar kelimedir: teşhir yüksekliğini, tezgâh konumunu ve dokunma iznini belirler.",
       { one: true, y: 6.15, w: 11.4, h: 0.6, size: 12.5 });
  s.addNotes("“Kaliteli / modern / özel” tuzağını mutlaka vurgulayın; öğrencilerin çıkardığı kelimelerin yarısı böyle oluyor.");
}

{
  const s = slide("III · MARKA VE MEKÂN", "Çeviri zinciri: özellikten tasarım öğesine");
  const cw = 2.645, gapc = 0.35;
  const xs = [0.85, 0.85 + cw + gapc, 0.85 + 2 * (cw + gapc), 0.85 + 3 * (cw + gapc)];
  const heads = ["MARKA ÖZELLİĞİ", "ANAHTAR KELİME", "MEKÂNSAL İLKE", "TASARIM ÖĞESİ"];
  heads.forEach((hd, i) => {
    s.addText(hd, { x: xs[i], y: 1.8, w: cw, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, bold: true, color: i === 1 ? ACC : FAINT, charSpacing: 1.6 });
  });
  const rows = [
    ["Her ürün tek tek, elde üretiliyor", "TEKİLLİK", "Düşük yoğunluk; her ürüne kendi alanı ve kendi ışığı",
     "Tekil kaideler · nokta aydınlatma · ürünler arası geniş aralık"],
    ["Üretim süreci gizlenmiyor", "GÖRÜNÜRLÜK", "Üretimin satış alanına açılması; arka alanın sahne olması",
     "Cam bölme · mekânın ortasında tezgâh · açık raflı depo"],
    ["Ürün denizle ve dış mekânla ilişkili", "DAYANIKLILIK", "Yıpranmayı gizlemeyen, zamanla güzelleşen yüzeyler",
     "Masif ahşap · ham metal · dokusu belirgin sıva · yıkanabilir zemin"]
  ];
  let y = 2.32;
  rows.forEach((r, ri) => {
    s.addText(r[0], { x: xs[0], y: y, w: cw, h: 1.0, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, color: BODY, lineSpacing: 18 });
    s.addText(r[1], { x: xs[1], y: y, w: cw, h: 0.44, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 17, bold: true, color: ACC });
    s.addText(r[2], { x: xs[2], y: y, w: cw, h: 1.0, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, color: BODY, lineSpacing: 18 });
    s.addText(r[3], { x: xs[3], y: y, w: cw, h: 1.0, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: MUTED, lineSpacing: 15 });
    for (let c = 0; c < 3; c++)
      arrow(s, xs[c] + cw + 0.04, y + 0.22, xs[c + 1] - 0.05, y + 0.22, { col: HAIR, w: 1.25 });
    y += 1.28;
  });
  cap(s, M, 6.2, 11.4, "Zincirin her halkası bir öncekinden türetilebilmelidir. Bir tasarım öğesini gerekçelendiremiyorsanız, zincirde bir halka eksiktir.",
      { size: 13.5, face: H, col: ACC, italic: true, h: 0.45 });
  s.addNotes("Bu, sunumun en pratik slaydı. Öğrenciden kendi markası için bu zinciri üç satır hâlinde kurmasını isteyin.");
}

{
  const s = slide("III · MARKA VE MEKÂN", "Yoğunluk bir mesajdır");
  text(s, "Aynı metrekareye kaç ürün konacağı estetik değil, stratejik bir karardır. Az ürün ve çok boşluk değer ve seçicilik duygusu üretir; yoğun teşhir bolluk ve erişilebilirlik duygusu üretir. İkisi de doğrudur — yanlış olan, markanın iddiasıyla çelişen bir yoğunluk seçmektir.",
       { one: true, y: 1.74, h: 1.0, size: 15 });

  const ax = 2.0, ay = 4.55, aw = 9.3;
  dline(s, ax, ay, ax + aw, ay, { col: HAIR, w: 1 });
  cap(s, ax - 0.9, ay - 0.2, 1.6, "AZ ÜRÜN", { align: "right", bold: true, size: 10, col: INK });
  cap(s, ax + aw - 0.7, ay - 0.2, 1.7, "ÇOK ÜRÜN", { align: "left", bold: true, size: 10, col: INK });
  const pts = [
    [0.10, "Mücevher\nSanat", "birim değer yüksek\nboşluk = değer"],
    [0.34, "Sofistike moda\nParfüm", "seçilmiş az sayıda\nürün, geniş boşluk"],
    [0.62, "Kitap · Plak\nZanaat", "tarama davranışı,\norta yoğunluk"],
    [0.88, "Süpermarket\nİndirim", "bolluk sinyali,\nhızlı hareket"]
  ];
  pts.forEach(pt => {
    const x = ax + pt[0] * aw;
    dot(s, x, ay, { d: 0.16, col: ACC });
    s.addText(pt[1], { x: x - 1.05, y: ay - 1.15, w: 2.1, h: 0.8, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, bold: true, color: INK, align: "center", valign: "bottom", lineSpacing: 16 });
    s.addText(pt[2], { x: x - 1.05, y: ay + 0.24, w: 2.1, h: 0.7, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: MUTED, align: "center", lineSpacing: 12.5 });
  });
  cap(s, M, 5.85, 11.4, "Kural: pahalı ürün = az ürün + çok boşluk. Yoğunluk, ucuzluk sinyalidir.",
      { size: 14, face: H, col: ACC, italic: true, h: 0.4, align: "center" });
  s.addNotes("Öğrencilerin en sık hatası: lüks marka seçip mekânı ürünle doldurmak.");
}

/* =========================================================
   IV — DIŞARIDAN İÇERİYE
   ========================================================= */
opener("IV", "Dışarıdan içeriye", "Cephe, vitrin ve eşik: insanı sokaktan mağazaya almak.");

{
  const s = slide("IV · DIŞARIDAN İÇERİYE", "Üç mesafe: cephe kaç metreden ne söylüyor?");
  const fx = 9.4, fy0 = 2.05, fy1 = 6.1;                 // facade line (right)
  dline(s, fx, fy0, fx, fy1, { col: INK, w: 2 });
  cap(s, fx + 0.18, fy0 - 0.04, 1.4, "CEPHE", { bold: true, size: 10, col: INK });

  const bands = [
    [1.15, "30 m", "Promenadın veya sokağın karşı ucundan", "Silüet, ışık lekesi, tabela. Marka okunmaz — sadece orada bir şey olduğu okunur."],
    [4.05, "10 m", "Yürüyüş hattından", "Marka adı, vitrinin kurgusu, içerinin derinliği. Durup durmama kararı burada verilir."],
    [7.55, "3 m", "Vitrinin önünde", "Ürün, etiket, doku, fiyat. İçeri girme kararı burada verilir."]
  ];
  bands.forEach((b, i) => {
    const x = b[0];
    dot(s, x, 5.55, { d: 0.2, col: i === 1 ? ACC : MUTED });
    arrow(s, x + 0.16, 5.55, fx - 0.06, 5.55, { col: i === 1 ? ACC : HAIR, w: i === 1 ? 1.5 : 1, dash: i === 1 ? "solid" : "dash" });
    s.addText(b[1], { x: x - 0.35, y: 2.15 + i * 0.02, w: 1.5, h: 0.5, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 30, bold: true, color: i === 1 ? ACC : MUTED });
    s.addText(b[2], { x: x - 0.35, y: 2.7, w: 2.6, h: 0.34, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: INK, lineSpacing: 12 });
    s.addText(b[3], { x: x - 0.35, y: 3.06, w: 2.6, h: 1.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 14 });
  });
  cap(s, M, 6.2, 11.4, "Cepheyi bu üç mesafeden ayrı ayrı çizmek, tasarımın en hızlı sınamasıdır. Bir mesafede çalışan çözüm diğerinde çalışmayabilir.",
      { size: 13, face: H, col: ACC, italic: true, h: 0.4 });
  img(s, "Aynı mağaza cephesinin üç farklı mesafeden çekilmiş fotoğrafı");
  s.addNotes("Açık hava yerleşimlerde ve sokak mağazalarında bu test belirleyici. Gece görünümü ayrıca çizilmeli.");
}

{
  const s = slide("IV · DIŞARIDAN İÇERİYE", "Vitrin tipleri");
  const y0 = 2.3, h = 1.75, w = 2.72, gap = 0.25;
  const types = [
    ["Kapalı arkalı", "Arkası kapalı bir sahne. Kurgu tam denetimde, ama içerisi görünmez.", 1],
    ["Açık", "Vitrinin arkası satış alanına açılır. İçerisi görünür, kurgu zayıflar.", 2],
    ["Yarı açık", "Kısmi arkalık. Hem sahne hem derinlik. En sık kullanılan.", 3],
    ["Vitrinsiz / şeffaf", "Cephe tümüyle cam. Mağazanın kendisi vitrindir.", 4]
  ];
  types.forEach((t, i) => {
    const x = 0.85 + i * (w + gap);
    plan(s, x, y0, w, h);                                  // shop footprint (plan)
    // street edge at bottom
    dline(s, x - 0.06, y0 + h + 0.09, x + w + 0.06, y0 + h + 0.09, { col: HAIR, w: 1.5, dash: "dash" });
    const hi = i === 2;
    if (t[2] === 1) {                                      // closed back
      zone(s, x + 0.12, y0 + h - 0.6, w - 0.24, 0.45, "", hi ? 1 : 0);
      dline(s, x + 0.12, y0 + h - 0.6, x + w - 0.12, y0 + h - 0.6, { col: INK, w: 2 });
    } else if (t[2] === 2) {                               // open
      zone(s, x + 0.12, y0 + h - 0.6, w - 0.24, 0.45, "", hi ? 1 : 0);
    } else if (t[2] === 3) {                               // semi-open
      zone(s, x + 0.12, y0 + h - 0.6, w - 0.24, 0.45, "", hi ? 1 : 0);
      dline(s, x + 0.12, y0 + h - 0.6, x + 1.05, y0 + h - 0.6, { col: INK, w: 2 });
    } else {                                               // fully transparent
      dline(s, x + 0.12, y0 + h - 0.6, x + w - 0.12, y0 + h - 0.6, { col: HAIR, w: 0.75, dash: "dot" });
    }
    cap(s, x, y0 + h + 0.22, w, "sokak", { align: "center", size: 8.5, col: FAINT });
    s.addText(t[0], { x: x, y: y0 - 0.42, w: w, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: hi ? ACC : INK });
    s.addText(t[1], { x: x, y: y0 + h + 0.5, w: w, h: 0.95, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13.5 });
  });
  text(s, "Vitrin bir reklam panosu değil, mekânın ilk odasıdır. Tip seçimi ürünle ilgilidir: küçük ve değerli ürün sahne ister, geniş ürün gamı derinlik ister. Vitrinin gece görünümü ayrı bir tasarım kararıdır — gündüz için kurgulanmış bir vitrin gece çoğunlukla çalışmaz.",
       { one: true, y: 5.75, h: 0.95, size: 14 });
  s.addNotes("Diyagramlar plandır: alt kenar sokak. Kalın çizgi arkalığı, kesikli çizgi cam yüzeyi gösteriyor.");
}

{
  const s = slide("IV · DIŞARIDAN İÇERİYE", "Eşik ve geçiş bölgesi");
  const px = 1.6, py = 2.02, pw = 6.6, ph = 3.2;
  plan(s, px, py, pw, ph);
  dline(s, px - 0.15, py + ph + 0.12, px + pw + 0.15, py + ph + 0.12, { col: HAIR, w: 1.5, dash: "dash" });
  cap(s, px, py + ph + 0.24, pw, "sokak", { align: "center", size: 9, col: FAINT });

  // entrance gap
  s.addShape(p.ShapeType.rect, { x: px + 2.6, y: py + ph - 0.03, w: 1.4, h: 0.06,
    fill: { color: PAPER }, line: { color: PAPER } });
  arrow(s, px + 3.3, py + ph + 0.55, px + 3.3, py + ph - 0.15, { col: ACC, w: 2 });

  zone(s, px + 2.05, py + ph - 1.35, 2.5, 1.32, "GEÇİŞ BÖLGESİ\n(ürün konmaz)", 1, 10);
  zone(s, px + 0.1, py + ph - 0.75, 1.85, 0.72, "vitrin", 0);
  zone(s, px + 4.65, py + ph - 0.75, 1.85, 0.72, "vitrin", 0);
  zone(s, px + pw - 1.15, py + 0.1, 1.05, ph - 1.55, "güç\nduvarı", 0);
  cap(s, px + 0.15, py + 0.35, 1.9, "satış alanı", { size: 9.5, col: MUTED });

  legend(s, [
    ["Işık düzeyi düşer ya da yükselir", "Gözün dışarıdan içeriye uyum süresi"],
    ["Ses ve koku değişir", "Bedene 'başka bir yere girdim' bilgisini veren asıl katman"],
    ["Zemin malzemesi ve sertliği değişir", "Adımın sesi ve hissi"],
    ["Sıcaklık farkı hissedilir", "Eşiğin en az fark edilen ama en güçlü aracı"]
  ], 8.55, 2.2, 3.9, 10);

  text(s, "Girişten sonraki ilk 2–4 metre geçiş bölgesidir. Duyular hâlâ dışarıya ayarlıdır; buraya konan ürün ya da bilgi genellikle görülmez (Underhill, 2008). Eşiği sınamanın en basit yolu tek bir sorudur: bu kapıdan geçerken ne değişiyor?",
       { one: true, y: 5.66, h: 1.3, size: 13, w: 6.9 });
  s.addNotes("Eşik, beş duyunun aynı anda değiştiği tek andır. Duyular bölümüne buradan köprü kurun.");
}

/* =========================================================
   V — MAĞAZANIN İÇİ: İŞLEVLER
   ========================================================= */
opener("V", "Mağazanın içi", "Hangi işlevler var ve birbirleriyle nasıl ilişkilenirler?");

{
  const s = slide("V · MAĞAZANIN İÇİ", "Bir mağazada bulunması gereken işlevler");
  text(s, "Bu şema bir yerleşim önerisi değildir; işlevlerin listesini ve aralarındaki ilişkiyi gösterir. Hangi işlevin nereye konacağı markaya, ürüne ve mekâna göre değişir.",
       { one: true, y: 1.64, h: 0.6, size: 14.5 });

  // FRONT OF HOUSE — six functions in a row (order = journey, not position)
  const fw = 1.73, fg = 0.25, fy = 2.66, fh = 0.78;
  const front = ["Vitrin", "Giriş ve\ngeçiş", "Teşhir", "Etkileşim ve\ndeneme", "Deneme\nkabini", "Oturma ve\nbekleme"];
  front.forEach((t, i) => {
    const x = 0.85 + i * (fw + fg);
    zone(s, x, fy, fw, fh, t, 0, 9.5);
    if (i < 5) dline(s, x + fw, fy + fh / 2, x + fw + fg, fy + fh / 2, { col: HAIR, w: 1 });
  });
  cap(s, M, fy - 0.32, 6.0, "ÖN ALAN — müşterinin gördüğü", { bold: true, size: 9.5, col: INK, charSpacing: 1.4 });

  // boundary
  dline(s, M, 4.28, 12.48, 4.28, { col: MUTED, w: 1, dash: "dash" });

  // CASH DESK straddling the boundary
  zone(s, 5.47, 3.98, 2.4, 0.6, "KASA", 1, 11);
  cap(s, 7.95, 4.02, 4.5, "iki alanın kesiştiği tek nokta", { size: 9.5, col: ACC, italic: true });

  // BACK OF HOUSE
  const bw = 2.3, bg = 0.6, by = 4.85, bh = 0.78;
  const back = ["Mal kabul", "Depo", "Personel ve WC"];
  back.forEach((t, i) => {
    const x = 2.6 + i * (bw + bg);
    zone(s, x, by, bw, bh, t, 2, 10);
    if (i < 2) dline(s, x + bw, by + bh / 2, x + bw + bg, by + bh / 2, { col: MUTED, w: 1 });
  });
  cap(s, M, by - 0.3, 6.0, "ARKA ALAN — işletmenin çalıştığı", { bold: true, size: 9.5, col: INK, charSpacing: 1.4 });

  // vertical relations across the boundary
  dline(s, 6.67, fy + fh, 6.67, 3.98, { col: HAIR, w: 1 });
  dline(s, 6.67, 4.58, 6.67, by, { col: MUTED, w: 1, dash: "dash" });
  dline(s, 4.4, fy + fh, 4.4, 4.28, { col: ACC, w: 1.25 });
  dline(s, 4.4, 4.28, 4.4, by, { col: ACC, w: 1.25 });
  cap(s, 3.05, 3.55, 1.3, "stok\ntazeleme", { size: 8.5, col: ACC, align: "right", ls: 10.5 });

  const rules = [
    "Vitrin ve giriş birbirinin devamıdır; ayrı tasarlanamaz.",
    "Depo satış alanına doğrudan açılmalı; stok tazeleme müşteri rotasını kesmemeli.",
    "Kasadan mağazanın tamamı görülebilmeli, aynı anda arka alana ulaşılabilmeli.",
    "Deneme kabini teşhire yakın, ama giriş görüş hattının dışında olmalı."
  ];
  let ry = 5.95;
  cap(s, M, ry - 0.28, 11.4, "KOMŞULUK KURALLARI", { size: 9, bold: true, col: FAINT, charSpacing: 1.6 });
  rules.forEach((r, i) => {
    const x = i % 2 === 0 ? M : C2;
    const yy = ry + Math.floor(i / 2) * 0.46;
    dot(s, x + 0.09, yy + 0.11, { d: 0.1, col: ACC });
    cap(s, x + 0.32, yy - 0.03, CW - 0.32, r, { size: 11, col: BODY, ls: 13.5, h: 0.42 });
  });
  s.addNotes("Bu şema bilinçli olarak plan değildir. Öğrenci işlevleri kendi mekânına göre yerleştirmeli; buradaki tek bağlayıcı şey komşuluk kurallarıdır.");
}

{
  const s = slide("V · MAĞAZANIN İÇİ", "İki rota birbirine karışmamalı");
  text(s, "Mağazanın çalışması, çalışanın gününün de tasarlanmış olmasına bağlıdır. İki rota yalnızca kasada buluşur; başka bir yerde kesişirlerse mağaza her teslimatta durur.",
       { one: true, y: 1.72, h: 0.6, size: 14.5 });

  const cy1 = 2.85, cy2 = 5.15, bw = 1.62, bh = 0.62;
  const cust = ["Giriş", "Geçiş", "Teşhir", "Deneme", "Kasa", "Çıkış"];
  const staff = ["Mal kabul", "Depo", "Stok\ntazeleme", "Danışma", "Kasa", "Kapanış"];
  const x0 = 0.85, gapx = 0.29;
  cust.forEach((t, i) => {
    const x = x0 + i * (bw + gapx), hi = i === 4;
    zone(s, x, cy1, bw, bh, t, hi ? 1 : 0, 10);
    if (i < 5) arrow(s, x + bw + 0.03, cy1 + bh / 2, x + bw + gapx - 0.03, cy1 + bh / 2, { col: ACC, w: 1.5 });
  });
  staff.forEach((t, i) => {
    const x = x0 + i * (bw + gapx), hi = i === 4;
    zone(s, x, cy2, bw, bh, t, hi ? 1 : 2, 9.5);
    if (i < 5) arrow(s, x + bw + 0.03, cy2 + bh / 2, x + bw + gapx - 0.03, cy2 + bh / 2, { col: MUTED, w: 1.25, dash: "dash" });
  });
  cap(s, M, cy1 - 0.3, 6.0, "MÜŞTERİ ROTASI", { bold: true, size: 9.5, col: ACC, charSpacing: 1.4 });
  cap(s, M, cy2 - 0.3, 6.0, "PERSONEL ROTASI", { bold: true, size: 9.5, col: MUTED, charSpacing: 1.4 });

  // the only permitted meeting point
  const mx = x0 + 4 * (bw + gapx) + bw / 2;
  dline(s, mx, cy1 + bh, mx, cy2, { col: ACC, w: 1.5 });
  cap(s, mx + 0.25, 3.78, 2.85, "Buluşmaları gereken\ntek nokta", { size: 11, bold: true, col: ACC, ls: 14, h: 0.5 });
  cap(s, mx + 0.25, 4.32, 2.9, "Kasa hem satışı bitirir hem arka alana açılır.", { size: 10.5, ls: 13.5, h: 0.5 });

  // the crossing that must not happen
  s.addText("✕", { x: 1.15, y: 3.98, w: 0.42, h: 0.42, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 20, bold: true, color: ACC, align: "center", valign: "middle" });
  cap(s, 1.68, 3.95, 7.2, "Başka hiçbir noktada kesişmemeli: mal kabulden depoya giden yol satış alanından geçerse, mağaza her teslimatta durur.",
      { size: 11.5, col: ACC, ls: 15, h: 0.5 });

  cap(s, M, 6.15, 11.4, "Şema rota sırasını gösterir, mekândaki yerlerini değil. Sıra sabittir; yerleşim her mağazada farklıdır.",
      { size: 12.5, face: H, col: BODY, italic: true, h: 0.4 });
  s.addNotes("Öğrencilere 'personelin gününü çiz' egzersizini önerin: açılış, mal kabul, stok tazeleme, mola, kapanış.");
}

/* =========================================================
   VI — AKIŞ VE YÖNLENDİRME
   ========================================================= */
opener("VI", "Akış ve yönlendirme", "İnsan içeri girdikten sonra nereye gider?");

{
  const s = slide("VI · AKIŞ VE YÖNLENDİRME", "Dört plan tipi");
  const y0 = 2.35, w = 2.72, h = 1.9, gap = 0.25;
  const kinds = [
    ["Izgara", "Paralel raf dizileri. Verimli ve tahmin edilebilir; keşif duygusu düşük.", "market · kırtasiye"],
    ["Serbest akış", "Bağımsız yerleşmiş adalar. Keşif yüksek, alan verimi düşük.", "butik · konsept"],
    ["Döngü", "Müşteriyi tüm mağazadan geçiren tek rota.", "büyük mağaza · mobilya"],
    ["Çapraz", "Açılı yerleşim; görüş hatlarını uzatır, ürünü sürekli yeni gösterir.", "moda · aksesuar"]
  ];
  kinds.forEach((k, i) => {
    const x = 0.85 + i * (w + gap);
    plan(s, x, y0, w, h);
    const ix = x + 0.16, iy = y0 + 0.16, iw = w - 0.32, ih = h - 0.32;
    if (i === 0) {
      for (let r = 0; r < 4; r++) dline(s, ix, iy + 0.28 + r * 0.38, ix + iw, iy + 0.28 + r * 0.38, { col: HAIR, w: 1.4 });
    } else if (i === 1) {
      [[0.25, 0.3, 0.75, 0.35], [1.35, 0.22, 0.6, 0.5], [0.55, 0.95, 0.9, 0.3], [1.6, 1.05, 0.5, 0.32]]
        .forEach(b => zone(s, ix + b[0], iy + b[1], b[2], b[3], "", 0));
    } else if (i === 2) {
      s.addShape(p.ShapeType.rect, { x: ix + 0.42, y: iy + 0.3, w: iw - 0.84, h: ih - 0.6,
        fill: { type: "none" }, line: { color: ACC, width: 1.5, dashType: "dash" } });
      zone(s, ix + 0.85, iy + 0.62, iw - 1.7, ih - 1.24, "", 0);
    } else {
      for (let r = 0; r < 4; r++)
        dline(s, ix + 0.1 + r * 0.42, iy + ih - 0.15, ix + 0.72 + r * 0.42, iy + 0.2, { col: HAIR, w: 1.4 });
    }
    arrow(s, x + w / 2, y0 + h + 0.42, x + w / 2, y0 + h + 0.06, { col: ACC, w: 1.5 });
    s.addText(k[0], { x, y: y0 - 0.42, w, h: 0.34, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14.5, bold: true, color: INK });
    s.addText(k[1], { x, y: y0 + h + 0.6, w, h: 0.95, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13.5 });
    s.addText(k[2], { x, y: y0 + h + 1.5, w, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 0.8 });
  });
  cap(s, M, 6.3, 11.4, "Plan tipi ürünün taranma biçimine göre seçilir; estetik bir tercih değildir.",
      { size: 13, face: H, col: ACC, italic: true, h: 0.4 });
  s.addNotes("Ok, girişi ve ana yönelimi gösteriyor. Döngü tipinde kesikli çizgi zorunlu rotadır.");
}

{
  const s = slide("VI · AKIŞ VE YÖNLENDİRME", "Sağa yönelim, güç duvarı ve görüş hatları");
  const px = 1.15, py = 2.1, pw = 6.4, ph = 3.5;
  plan(s, px, py, pw, ph);
  s.addShape(p.ShapeType.rect, { x: px + 2.5, y: py + ph - 0.03, w: 1.4, h: 0.06,
    fill: { color: PAPER }, line: { color: PAPER } });
  const ex = px + 3.2, ey = py + ph;
  arrow(s, ex, ey + 0.5, ex, ey - 0.18, { col: ACC, w: 2 });
  // right-turn tendency
  arrow(s, ex, ey - 0.35, px + pw - 0.75, ey - 0.95, { col: ACC, w: 1.75 });
  zone(s, px + pw - 0.95, py + 0.15, 0.82, ph - 1.35, "GÜÇ\nDUVARI", 1, 9.5);
  // sightlines
  dline(s, ex, ey - 0.2, px + 0.25, py + 0.3, { col: FAINT, w: 0.9, dash: "dash" });
  dline(s, ex, ey - 0.2, px + pw - 0.25, py + 0.3, { col: FAINT, w: 0.9, dash: "dash" });
  dline(s, ex, ey - 0.2, ex, py + 0.3, { col: FAINT, w: 0.9, dash: "dash" });
  cap(s, px + 0.2, py + 0.35, 2.2, "görüş hatları", { size: 9, col: FAINT });


  legend(s, [
    ["İnsanlar girer girmez sağa yönelir", "Bu bir eğilimdir, kural değil — ama tasarımın başlangıç noktasıdır"],
    ["Sağdaki ilk büyük yüzey: güç duvarı", "Markanın kendini tek bakışta anlatma fırsatı; en güçlü ürün buraya"],
    ["Girişten mekânın derinliği okunmalı", "Görüş hattı kapalıysa insan içeri girmekte tereddüt eder"],
    ["Göz hizası bandı en çok dikkat çeker", "Yaklaşık 120–150 cm; bu bandın üstü işaret, altı stok içindir"]
  ], 8.15, 2.05, 4.45, 10);

  cap(s, px - 0.05, ey + 0.52, 6.5, "giriş", { size: 9, col: MUTED, align: "center" });
  text(s, "Bu örüntüler perakende gözlem araştırmalarından gelir (Underhill, 2008). Kesin kural değil, eğilimdir — ama plan kararlarının çıkış noktası olarak kullanılırlar.",
       { one: true, y: 6.28, w: 11.4, h: 0.6, size: 13 });
  s.addNotes("Görüş hatlarını tahtada çizerek gösterin: girişten bakınca ne görünüyor?");
}

{
  const s = slide("VI · AKIŞ VE YÖNLENDİRME", "Yönlendirmenin iki katmanı");
  const y0 = 2.2;
  // layer 1
  s.addText("1", { x: M, y: y0, w: 0.5, h: 0.5, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 30, bold: true, color: ACC });
  s.addText("MEKÂNSAL KATMAN", { x: M + 0.55, y: y0 + 0.08, w: 4.6, h: 0.34, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 11, bold: true, color: INK, charSpacing: 1.4 });
  s.addText("Önce bu çalışır. İnsanı tabelaya ihtiyaç duymadan yönlendirir.", {
    x: M + 0.55, y: y0 + 0.42, w: 4.9, h: 0.4, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 11, color: MUTED, lineSpacing: 13.5 });
  const l1 = ["Görüş hatları ve açık perspektifler", "Işık farkı — aydınlık nokta çeker",
              "Tavan yüksekliğindeki değişim", "Zemin malzemesi ve deseni",
              "Koridor genişliği hiyerarşisi", "Bir odak nesnesi ya da vista"];
  let yy = y0 + 1.0;
  l1.forEach(t => { dot(s, M + 0.12, yy + 0.1, { d: 0.1, col: ACC });
    cap(s, M + 0.4, yy - 0.02, 5.0, t, { size: 11.5, col: BODY }); yy += 0.42; });

  // layer 2
  s.addText("2", { x: 6.98, y: y0, w: 0.5, h: 0.5, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 30, bold: true, color: MUTED });
  s.addText("GRAFİK KATMAN", { x: 7.53, y: y0 + 0.08, w: 4.6, h: 0.34, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 11, bold: true, color: INK, charSpacing: 1.4 });
  s.addText("Sonra gelir. Mekânsal katmanın yerini alamaz, onu tamamlar.", {
    x: 7.53, y: y0 + 0.42, w: 4.9, h: 0.4, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 11, color: MUTED, lineSpacing: 13.5 });
  const l2 = ["Bölüm ve kategori tabelaları", "Ürün etiketi ve fiyat bilgisi",
              "Yön işaretleri ve kat planı", "Kampanya ve bilgi panoları",
              "Piktogram ve renk kodlama", "Dokunsal harita ve kabartma yazı"];
  yy = y0 + 1.0;
  l2.forEach(t => { dot(s, 7.1, yy + 0.1, { d: 0.1, col: MUTED });
    cap(s, 7.38, yy - 0.02, 5.0, t, { size: 11.5, col: BODY }); yy += 0.42; });

  cap(s, M, 5.9, 11.4, "İyi bir mağaza tabelayla değil kurguyla yönlendirir. Tabela, kurgunun çözemediğini kapatmak için değil, onu netleştirmek için vardır.",
      { size: 14, face: H, col: ACC, italic: true, h: 0.5 });
  cap(s, M, 6.5, 11.4, "Türkiye'de 105 engelli kullanıcıyla yapılan bir araştırmada en sık tekrarlanan tek sorun, yönlendirme ve uyarı işaretlerinin yetersizliğidir (Akyazıcı & Yaşar, 2026).",
      { size: 11, h: 0.4 });
  s.addNotes("Sıralama önemli: mekânsal katman önce, grafik katman sonra.");
}

{
  const s = slide("VI · AKIŞ VE YÖNLENDİRME", "Müşteri yolculuğu: yedi an, yedi tasarım sorusu");
  const y0 = 2.5, x0 = 0.95, tot = 11.45;
  const steps = [
    ["ÇEKİM", "Cepheden ne\ngörünüyor?"],
    ["EŞİK", "Girerken ne\ndeğişiyor?"],
    ["YÖNELME", "Nereye gideceğimi\nnasıl anlıyorum?"],
    ["GEZİNME", "Ürünü nasıl\ntarıyorum?"],
    ["ETKİLEŞİM", "Dokunuyor,\ndeniyor muyum?"],
    ["SATIN ALMA", "Kasa ve kuyruk\nnerede?"],
    ["AYRILMA", "Çıkarken ne\nhissediyorum?"]
  ];
  const w = (tot - 6 * 0.22) / 7;
  steps.forEach((st, i) => {
    const x = x0 + i * (w + 0.22);
    zone(s, x, y0, w, 0.62, "", i === 1 || i === 4 ? 1 : 0);
    s.addText(st[0], { x: x + 0.04, y: y0, w: w - 0.08, h: 0.62, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 1 || i === 4 ? ACC : INK,
      align: "center", valign: "middle", charSpacing: 0.6 });
    s.addText(st[1], { x: x, y: y0 + 0.74, w: w, h: 0.7, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, color: MUTED, align: "center", lineSpacing: 12 });
    if (i < 6) arrow(s, x + w + 0.03, y0 + 0.31, x + w + 0.19, y0 + 0.31, { col: HAIR, w: 1.1 });
  });
  cap(s, x0, y0 - 0.4, tot, "satın alma öncesi  →  satın alma  →  sonrası", { size: 9.5, col: FAINT, align: "center" });

  text(s, "Alışveriş tek bir satın alma anı değil, birbirini izleyen anların dizisidir (Lemon & Verhoef, 2016). Her an ayrı bir tasarım sorusu üretir.\n\nAncak önemli olan anları tek tek iyileştirmek değil, aralarındaki geçişi kurmaktır. Kopuk iyi anlar bütünlüklü bir deneyim üretmez; bir mağazanın zayıf halkası, en zayıf geçişidir.",
       { y: 4.3, h: 2.45, size: 13.5, ls: 21 });
  s.addNotes("Vurgulanan iki an — eşik ve etkileşim — mekânın en çok fark yarattığı yerlerdir.");
}

/* =========================================================
   VII — DUYULAR
   ========================================================= */
opener("VII", "Duyular", "Mekânı yalnızca gözle değil, bütün bedenle deneyimliyoruz.");

{
  const s = slide("VII · DUYULAR", "Atmosfer tek bir duyudan doğmaz");
  text(s, "Mimarlık kültürü görme duyusunu diğerlerinin önüne geçirir; bu da mekânı bedenden koparır (Pallasmaa, 2005). Mağaza, bu tekeli kırmak için en uygun laboratuvardır — çünkü duyusal tasarımın burada ticari bir karşılığı da vardır.",
       { one: true, y: 1.78, h: 1.0, size: 15 });

  const cx = 3.55, cy = 4.72, R = 1.45;
  s.addShape(p.ShapeType.ellipse, { x: cx - R, y: cy - R, w: R * 2, h: R * 2,
    fill: { type: "none" }, line: { color: HAIR, width: 1 } });
  s.addText("ATMOSFER", { x: cx - 0.9, y: cy - 0.18, w: 1.8, h: 0.36, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10.5, bold: true, color: ACC, align: "center", charSpacing: 1.4 });
  const senses = ["GÖRME", "İŞİTME", "DOKUNMA", "KOKLAMA", "TAT", "BEDEN"];
  senses.forEach((sn, i) => {
    const a = (-90 + i * 60) * Math.PI / 180;
    const x = cx + Math.cos(a) * (R + 0.42), y = cy + Math.sin(a) * (R + 0.42);
    s.addText(sn, { x: x - 0.62, y: y - 0.14, w: 1.24, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: INK, align: "center" });
    dline(s, cx + Math.cos(a) * R, cy + Math.sin(a) * R,
             cx + Math.cos(a) * (R + 0.26), cy + Math.sin(a) * (R + 0.26), { col: HAIR, w: 1 });
  });

  s.addText("Duyusal uyum", { x: 6.98, y: 2.85, w: 5.5, h: 0.42, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 20, bold: true, color: INK });
  text(s, "Duyusal etki tek tek uyaranlardan değil, uyaranların birlikte çalışmasından doğar (Spence vd., 2014). Bir kokunun ya da müziğin etkisi, yanındakilerle uyumlu olup olmamasına bağlıdır.\n\nEn dikkat çekici bulgu şudur: birbiriyle uyumsuz duyusal ipuçları, hiç olmamasından daha kötü sonuç verir. Uyumlu bir koku–müzik birlikteliği memnuniyeti artırırken, uyumsuz bir birliktelik değerlendirmeyi düşürür.\n\nDolayısıyla duyusal katmanlar tek tek 'iyi' olmak zorunda değildir; birlikte aynı şeyi söylemek zorundadır.",
       { one: true, x: 6.98, y: 3.35, w: 5.5, h: 3.35, size: 13, ls: 20 });
  s.addNotes("Bu bulgu duyular bölümünün ana ilkesidir: rastgele eklenen etkileyici bir duyusal öğe bütünü zayıflatır.");
}

{
  const s = slide("VII · DUYULAR", "Hangi duyu, yolculuğun hangi anında çalışır?");
  text(s, "Duyular mağazanın her yerinde aynı yoğunlukta çalışmaz. Her duyunun baskın olduğu bir an vardır; tasarımcının işi o anı bilerek kurmaktır.",
       { one: true, y: 1.66, h: 0.68, size: 14.5 });

  const moments = ["Çekim", "Eşik", "Yönelme", "Gezinme", "Etkileşim", "Satın alma", "Ayrılma"];
  const ax0 = 3.05, ax1 = 12.15;
  const sp = (ax1 - ax0) / (moments.length - 1);
  moments.forEach((m, i) => {
    const x = ax0 + i * sp;
    s.addText(m, { x: x - 0.62, y: 2.38, w: 1.24, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 8.5, bold: true, color: MUTED, align: "center" });
    dline(s, x, 2.72, x, 6.15, { col: "EDEDF0", w: 0.75 });
  });
  dline(s, ax0 - 0.3, 2.72, ax1 + 0.3, 2.72, { col: HAIR, w: 1 });

  const rows = [
    ["Görme", [0, 3], "vitrin silüeti ve ışık lekesi · teşhir kontrastı"],
    ["Beden", [1, 2], "eşikte ısı ve zemin değişimi · koridor genişliği, yoğunluk"],
    ["Koklama", [1, 4], "ilk izlenim · ürünün ve malzemenin kendi kokusu"],
    ["İşitme", [3, 4], "genel akustik · kabinde ve danışmada sessizlik"],
    ["Dokunma", [3, 4], "açık raf ve ürüne erişim · deneme, tezgâh, kumaş"],
    ["Tat", [4], "tadım noktası · ikram"]
  ];
  let ry = 3.0;
  rows.forEach(r => {
    s.addText(r[0], { x: M, y: ry - 0.02, w: 1.9, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: ACC });
    const dx = r[1].map(i => ax0 + i * sp);
    if (dx.length > 1) dline(s, dx[0], ry + 0.13, dx[dx.length - 1], ry + 0.13, { col: ACC, w: 1.5 });
    dx.forEach(x => dot(s, x, ry + 0.13, { d: 0.16, col: ACC }));
    s.addText(r[2], { x: dx[dx.length - 1] + 0.22, y: ry - 0.02, w: 12.4 - dx[dx.length - 1] - 0.22,
      h: 0.34, isTextBox: true, margin: 0, fontFace: S, fontSize: 9.5, color: MUTED });
    ry += 0.55;
  });
  cap(s, M, 6.32, 11.4, "Bir duyunun baskın olduğu an, o duyu için ayrılacak bütçenin ve dikkatin de nerede olması gerektiğini söyler.",
      { size: 12.5, face: H, col: ACC, italic: true, h: 0.4 });
  s.addNotes("Bu diyagram duyusal tasarımı mood board olmaktan çıkarıp yolculuğa bağlar; plana değil, ana bağlar.");
}

/* ---- individual senses ---- */
function sense(name, sub, para, exs, imgs, note) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  label(s, "VII · DUYULAR");
  s.addText(name, { x: M, y: 0.82, w: 6.8, h: 0.72, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 38, bold: true, color: ACC });
  s.addText(sub, { x: M, y: 1.56, w: 9.5, h: 0.28, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10.5, color: MUTED, charSpacing: 1.6 });
  text(s, para, { y: 2.05, h: 3.1, size: 13.5, ls: 21 });
  cap(s, M, 5.32, 11.4, "MAĞAZADA NASIL KULLANILIR", { size: 9, bold: true, col: FAINT, h: 0.24 });
  exampleRow(s, exs, 5.62);
  if (imgs) img(s, imgs);
  num(s);
  if (note) s.addNotes(note);
  return s;
}

sense("Görme", "IŞIK · RENK · KONTRAST · GÖRÜŞ HATTI",
"Mağazada görmeyi yöneten şey biçim değil, ışıktır. Işığın düzeyi mekânın hızını belirler: parlak ve düz aydınlatılmış bir mekânda insanlar hızlanır, kontrastlı ve yumuşak aydınlatılmış bir mekânda yavaşlar.\n\nKontrast dikkati yönetir. Bir ürünün öne çıkması, ona daha çok ışık verilmesinden değil, çevresine daha az ışık verilmesinden doğar. Her yerin eşit aydınlatıldığı bir mekânda hiçbir ürün öne çıkmaz.\n\nIşığın rengi ise ürünün rengini doğrudan değiştirir; tekstilde ve gıdada bu, satın alma kararını belirleyen bir etkendir (Spence vd., 2014).",
[["Vurgu ışığı", "Genel aydınlatmanın 3–5 katı yoğunlukta nokta ışıkla tekil ürünü öne çıkarmak."],
 ["Işık koridoru", "Zemine düşen ışık lekeleriyle rota çizmek; tabelasız yönlendirme."],
 ["Karanlık zemin", "Koyu duvar ve zeminle kontrastı yükseltip ürünü tek görünür nesne yapmak."]],
"Vurgu aydınlatmalı bir vitrin · aynı ürünün iki farklı renk sıcaklığında fotoğrafı",
"Kontrast oranını somut örnekle açın. CRI konusunu iade örneğiyle anlatın: düşük renk geriverimli ışıkta beğenilen kumaş gün ışığında bambaşka görünür.");

sense("İşitme", "AKUSTİK · MÜZİK · SESSİZLİK",
"Ses, mağazada en az tasarlanan ve en çok şikâyet edilen duyudur. Akustik malzemeyle belirlenir: sert ve düz yüzeyler sesi yansıtır, gözenekli yüzeyler yutar. Yüksek tavanlı, cam ve sert zeminli bir mekân, hiç müzik çalınmasa bile gürültülüdür.\n\nMüziğin temposu ve düzeyi kalış süresini etkiler; hızlı ve yüksek müzik hareketi hızlandırır, yavaş ve düşük müzik kalışı uzatır.\n\nEn çok ihmal edilen boyut ise sessizliktir. Karar verilen yerlerde — deneme kabini, danışma noktası, ödeme alanı — sesin düşmesi gerekir.",
[["Sessiz bölge", "Kabin ve danışma çevresinde yutucu yüzey kullanarak ses düzeyini düşürmek."],
 ["Malzeme ile akustik", "Halı, kumaş perde, ahşap lata ve akustik tavanla yankıyı kırmak."],
 ["Ürünün kendi sesi", "Plak, enstrüman ya da makine sesini teşhirin parçası hâline getirmek."]],
"Akustik yüzey kullanılan bir mağaza içi · dinleme kabini olan bir plak dükkânı",
"Türkiye'de yapılan güncel araştırmada engelli kullanıcıların en düşük puan verdiği boyut işitsel ve duyusal konfordur — bunu burada anın.");

sense("Dokunma", "MALZEME · DOKU · SICAKLIK · AĞIRLIK",
"Dokunma, mağazanın internete karşı en güçlü olduğu duyudur. İnsan ürünü eline aldığında ona karşı sahiplik duygusu geliştirir; dokunmaya izin veren teşhir düzenleri bu nedenle satın almayı artırır.\n\nMekân, dokunma iznini kendisi verir ya da geri alır. Açık raf 'dokun' der, cam dolap 'dokunma' der — sözlü olmayan ama son derece net bir iletişim.\n\nDokunma ürünle sınırlı değildir. Kapı kolunun ağırlığı, tezgâhın sıcaklığı ve zeminin sertliği de markanın iddiasını sessizce doğrular ya da yalanlar.",
[["Açık teşhir", "Ürünü ambalajsız ve elin ulaşacağı yükseklikte sunmak."],
 ["Malzeme örneği", "Kumaş, deri veya ahşap örneklerini duvarda dokunulabilir hâlde vermek."],
 ["Dokunsal yönlendirme", "Zeminde doku değişimi ve dokunsal harita ile görme engelli kullanıcıya rota vermek."]],
"Açık raf ile cam dolabın yan yana göründüğü bir mağaza içi · dokunsal yüzey örneği",
"IKEA'nın dokunsal harita hizmeti ve Mastercard Touch Card, dokunmanın erişilebilirlik aracı olarak kullanımına iyi örnek (Tonin vd., 2026).");

sense("Koklama", "KOKU · HAFIZA · KAYNAK",
"Koku, hafızaya en doğrudan bağlanan duyudur; bir kokunun yıllar sonra bir mekânı hatırlatması bundandır. Bu nedenle koku, mağazanın hatırlanmasında güçlü bir araçtır.\n\nAncak koku tasarımı mekâna difüzör koymak değildir. Etkili olan koku, kaynağı görünen kokudur: ürünün kendisi, kullanılan malzeme, taze bir yüzey ya da bir hazırlık tezgâhı. Kaynağı belirsiz yapay koku çoğu insanda rahatsızlık yaratır.\n\nÜçüncü kural ölçüdür: yoğun koku, koku hassasiyeti olan kullanıcılar için mekânı kullanılamaz kılar.",
[["Ürünün kendisi", "Ambalajı kaldırıp kokuyu doğrudan ürüne bırakmak."],
 ["Üretimi görünür kılmak", "Kavurma, fırın veya hazırlık tezgâhını satış alanına açmak."],
 ["Malzeme kokusu", "Ham ahşap, deri ve doğal yağ gibi kendi kokusu olan malzemeleri seçmek."]],
"Ambalajsız teşhir yapan bir mağaza · açık kavurma makinesi · deneme lavabosu",
"Lush ve Aesop örnekleri buraya çok uygun: koku bir eklenti değil, ürün ve teşhir kararının sonucudur.");

sense("Tat", "TADIM · İKRAM · AĞIZDA KALAN",
"Tat, mağaza tasarımında en dar kullanım alanına sahip duyudur; ancak kullanıldığı yerde etkisi çok güçlüdür. Tadım, ürünle kurulan ilişkiyi anlatımdan deneyime taşır.\n\nTadımın mekânsal karşılığı vardır ve genellikle ihmal edilir. Bir tadım noktası tezgâh, lavabo, hijyen alanı, atık çözümü ve insanların durabileceği bir boşluk gerektirir. Bu boşluk hesaplanmadığında tadım noktası dolaşımı tıkar.\n\nGıda dışı mağazalarda tat, ikram yoluyla dolaylı olarak devreye girer ve alışverişin süresini uzatır.",
[["Tadım tezgâhı", "Açık kap, ölçülü porsiyon, lavabo ve atık; çevresinde 1,5 m boşluk."],
 ["Açık hazırlık", "Demleme veya pişirme sürecini müşteriye açık konumlandırmak."],
 ["İkram", "Çay veya kahve ikramıyla alışverişi bir karşılaşmaya dönüştürmek — çarşı geleneği."]],
"Bir tadım tezgâhı · açık demleme alanı olan bir kahve dükkânı",
"Çay ikramı Türkiye'de köklü bir pratik; öğrencilere bunun mekânsal karşılığını sordurun.");

sense("Beden ve hareket", "ISI · HAVA · KOT · RİTİM · YOĞUNLUK",
"Beş duyunun dışında, mekânı bedenimizle algıladığımız bir katman daha vardır: sıcaklık, hava akımı, kot farkı, tavan yüksekliğindeki değişim ve insan yoğunluğu.\n\nSıcaklık farkı bir eşik aracıdır. Tavan yüksekliğindeki değişim mekânı bölmeden bölgelere ayırır; alçalan bir tavan yakınlık, yükselen bir tavan tören duygusu üretir.\n\nYoğunluk ise en güçlü etkendir. Kalabalık bir mekânda insanlar ürünü incelemeyi bırakır, hızlanır ve erken çıkar. Boşluk, tasarımın israfı değil aracıdır.",
[["Tavanla bölgeleme", "Duvar örmeden, tavan yüksekliğini değiştirerek alan tanımlamak."],
 ["Koridor hiyerarşisi", "Ana rotayı geniş, keşif rotalarını dar tutarak hız farkı yaratmak."],
 ["Eşikte sıcaklık", "Girişte hissedilen ısı değişimini bilinçli bir geçiş aracı olarak kullanmak."]],
"Tavan yüksekliği değişen bir mağaza kesiti veya fotoğrafı",
"Öğrenciler beş duyuyu sayıyor ama ısıyı, hava akımını ve kot farkını mekânsal bir duyu olarak düşünmüyor.");

{
  const s = slide("VII · DUYULAR", "Fazlası, eksiği kadar sorunludur");
  text(s, "Duyusal tasarım denildiğinde akla çoğunlukla daha fazla uyaran eklemek gelir. Oysa güncel araştırmalar tersini gösteriyor: mağazalarda asıl sorun duyusal yoksunluk değil, duyusal aşırılıktır.",
       { one: true, y: 1.78, h: 0.65, size: 15 });

  const bx = 3.4, bw = 6.3, by = 2.5, bh = 0.3, gap = 0.14;
  const dims = [["Personel yaklaşımı", 3.40], ["Görsel algı ve aydınlatma", 3.20],
                ["Erişilebilirlik ve algılanabilirlik", 3.10],
                ["Fiziksel dolaşım ve erişim", 2.99], ["İşitsel ve duyusal konfor", 2.89]];
  dims.forEach((d, i) => {
    const y = by + i * (bh + gap);
    const low = i >= 3;
    const frac = (d[1] - 1) / 4;
    s.addShape(p.ShapeType.rect, { x: bx, y: y, w: bw * frac, h: bh,
      fill: { color: low ? ACC : HAIR }, line: { color: low ? ACC : HAIR } });
    s.addText(d[0], { x: 0.85, y: y, w: 2.4, h: bh, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: low ? ACC : BODY, bold: low, align: "right", valign: "middle" });
    s.addText(d[1].toFixed(2).replace(".", ","), { x: bx + bw * frac + 0.1, y: y, w: 0.7, h: bh,
      isTextBox: true, margin: 0, fontFace: S, fontSize: 10, bold: true,
      color: low ? ACC : MUTED, valign: "middle" });
  });
  dline(s, bx, by - 0.12, bx, by + 5 * (bh + gap) - gap + 0.06, { col: HAIR, w: 0.9 });
  cap(s, bx, by + 5 * (bh + gap) + 0.02, 6.5, "1 = en olumsuz   ·   5 = en olumlu   ·   105 katılımcı", { size: 9, col: FAINT });

  text(s, "İstanbul'da 105 engelli kullanıcıyla yapılan bir araştırmada büyük mağaza iç mekânları beş boyutta değerlendirildi. En düşük puanı işitsel ve duyusal konfor aldı: yüksek müzik, anlaşılmayan anonslar, genel duyusal yük (Akyazıcı & Yaşar, 2026).",
       { one: true, x: M, w: CW, y: 4.95, h: 1.9, size: 12.5, ls: 19 });
  text(s, "Görme engelli kullanıcılar için en sorunlu boyut görsel algı ve aydınlatmaydı; parlama ve okunamayan etiketler öne çıktı.\n\nÇıkan ilke: her uyaranın bir gerekçesi olmalıdır. Gerekçesi olmayan uyaran, birileri için engeldir.",
       { one: true, x: C2, w: CW, y: 4.95, h: 1.9, size: 12.5, ls: 19 });
  s.addNotes("Araştırmanın Türkiye'de yapılmış olması öğrenciler için değerli. Son cümleyi not aldırın.");
}

quote("Duyusal tasarım bir estetik katman değil, hizmetin işleyen bir parçasıdır.",
      "Tonin, Ferrara & Nickel, 2026");

/* =========================================================
   VIII — IŞIK VE MALZEME
   ========================================================= */
opener("VIII", "Işık ve malzeme", "Atmosferi kuran iki somut araç.");

{
  const s = slide("VIII · IŞIK VE MALZEME", "Aydınlatma dört katmandan oluşur");
  const sx = 0.95, sy = 2.35, sw = 7.0, sh = 2.9;
  // section: floor, ceiling, shop face
  dline(s, sx, sy + sh, sx + sw, sy + sh, { col: INK, w: 1.5 });          // floor
  dline(s, sx, sy, sx + sw, sy, { col: INK, w: 1.5 });                    // ceiling
  dline(s, sx, sy, sx, sy + sh, { col: HAIR, w: 1 });
  dline(s, sx + sw, sy, sx + sw, sy + sh, { col: INK, w: 1.5 });          // facade at right
  cap(s, sx + sw + 0.1, sy + sh / 2 - 0.15, 1.2, "cephe", { size: 9, col: MUTED });
  // shelf + product
  zone(s, sx + 0.5, sy + 1.55, 1.5, 0.55, "", 0);
  zone(s, sx + 3.1, sy + 1.9, 1.2, 0.2, "", 0);
  zone(s, sx + sw - 1.2, sy + 1.75, 0.95, 0.35, "", 0);

  const lamps = [
    [1.35, "GENEL", "Mekânın temel görülebilirliği", "yaygın · düz"],
    [3.7, "VURGU", "Ürünü öne çıkarır — genel ışığın 3–5 katı", "yönlü · dar açı"],
    [5.35, "DEKORATİF", "Kendisi bir nesne; marka kişiliğini taşır", "görünür armatür"],
    [6.55, "VİTRİN", "Dışarıdan okunur; gündüz ve gece ayrı hesaplanır", "cepheye yönlü"]
  ];
  lamps.forEach((l, i) => {
    const x = sx + l[0];
    const hi = i === 1;
    dot(s, x, sy + 0.1, { d: 0.14, col: hi ? ACC : MUTED });
    if (i === 0) { for (let k = -1; k <= 1; k++) dline(s, x, sy + 0.17, x + k * 0.55, sy + sh, { col: HAIR, w: 0.8, dash: "dot" }); }
    else if (i === 1) { dline(s, x, sy + 0.17, x - 0.2, sy + 1.88, { col: ACC, w: 1 }); dline(s, x, sy + 0.17, x + 0.5, sy + 1.88, { col: ACC, w: 1 }); }
    else if (i === 2) { s.addShape(p.ShapeType.ellipse, { x: x - 0.16, y: sy + 0.3, w: 0.32, h: 0.32, fill: { type: "none" }, line: { color: MUTED, width: 1 } }); }
    else { dline(s, x, sy + 0.17, x + 0.55, sy + 1.72, { col: HAIR, w: 0.9, dash: "dot" }); }
  });
  legend(s, lamps.map((l, i) => [l[1].charAt(0) + l[1].slice(1).toLowerCase(), l[2] + " — " + l[3], i === 1 ? ACC : MUTED]),
    8.4, 2.35, 4.2, 10);

  text(s, "Tek bir genel ışıkla mağaza çözülmez. Vurgunun etkisi mutlak parlaklıktan değil, çevresiyle arasındaki farktan doğar (Petermans & Van Cleempoel, 2009). En sık yapılan hata, aydınlatmayı görselleştirme aşamasında düşünmektir: ışık plan ve kesitle birlikte kurulur, tavan planında karşılığı olmayan bir ışık fikri henüz tasarlanmamıştır.",
       { one: true, y: 5.6, w: 11.4, h: 1.05, size: 13.5 });
  cap(s, sx, sy + sh + 0.14, sw, "şematik kesit", { size: 9, col: FAINT, align: "center" });
  s.addNotes("Kesit şematiktir. Vurgu ışığının dar açısı ile genel ışığın yayılımı arasındaki farkı gösterin.");
}

{
  const s = slide("VIII · IŞIK VE MALZEME", "Malzeme: dokunulan, dokunulmayan, değişen");
  const y0 = 2.25, w = 3.55, h = 2.05, gap = 0.44;
  const cols = [
    ["DOKUNULAN", "Tezgâh, kapı kolu, korkuluk, raf, kabin duvarı.", "Dokunsal niteliğiyle birlikte aşınma ve temizlik davranışına göre seçilir."],
    ["DOKUNULMAYAN", "Tavan, üst duvar, uzaktaki yüzeyler.", "Öncelikle görsel ve akustik rolüyle değerlendirilir; maliyet burada dengelenir."],
    ["DEĞİŞEN", "Teşhir birimleri, kampanya yüzeyleri, vitrin arkalığı.", "Sökülebilirlik, parça değiştirilebilirliği ve ikinci kullanım ömrü belirleyicidir."]
  ];
  cols.forEach((c, i) => {
    const x = 0.85 + i * (w + gap);
    zone(s, x, y0, w, h, "", i === 2 ? 1 : 0);
    s.addText(c[0], { x: x + 0.25, y: y0 + 0.25, w: w - 0.5, h: 0.34, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, bold: true, color: i === 2 ? ACC : INK, charSpacing: 1.4 });
    s.addText(c[1], { x: x + 0.25, y: y0 + 0.66, w: w - 0.5, h: 0.6, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, color: INK, lineSpacing: 18 });
    s.addText(c[2], { x: x + 0.25, y: y0 + 1.28, w: w - 0.5, h: 0.7, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13.5 });
  });
  text(s, "Malzeme mağazada iki iş görür: markanın dilini kurar ve günlük kullanımın yükünü taşır. Üçüncü bir ölçüt zamandır — mağaza iç mekânları diğer mekân tiplerine göre çok daha sık yenilenir.\n\nBu nedenle sökülebilirlik ve malzemenin ikinci bir kullanım ömrü, artık estetik kadar önemli bir tasarım ölçütüdür. Bir mağazayı sökülemez biçimde inşa etmek, beş yıl sonrasının atığını bugünden üretmek demektir.",
       { y: 4.75, h: 1.9, size: 13.5 });
  s.addNotes("Üçüncü sütun vurgulu: sürdürülebilirlik tartışmasının mağaza tasarımındaki en somut karşılığı burasıdır.");
}

/* =========================================================
   IX — TEKNOLOJİ
   ========================================================= */
opener("IX", "Teknoloji", "Nerede işe yarar, nerede mekânı bozar?");

{
  const s = slide("IX · TEKNOLOJİ", "Teknoloji yolculuğun neresine girer?");
  const y0 = 2.35, x0 = 0.95, tot = 11.45;
  const steps = ["ÇEKİM", "EŞİK", "YÖNELME", "GEZİNME", "ETKİLEŞİM", "SATIN ALMA", "AYRILMA"];
  const w = (tot - 6 * 0.22) / 7;
  const tech = [
    "dijital cephe\nyayını",
    "—",
    "ekranlı kat\nplanı",
    "raf üstü stok\nve fiyat bilgisi",
    "sanal deneme\nkonfigüratör",
    "temassız ödeme\nkasa dışı ödeme",
    "dijital fiş\nteslimat takibi"
  ];
  steps.forEach((st, i) => {
    const x = x0 + i * (w + 0.22);
    zone(s, x, y0, w, 0.6, "", i === 4 ? 1 : 0);
    s.addText(st, { x: x + 0.04, y: y0, w: w - 0.08, h: 0.6, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: i === 4 ? ACC : INK,
      align: "center", valign: "middle" });
    if (tech[i] !== "—") {
      arrow(s, x + w / 2, y0 + 1.32, x + w / 2, y0 + 0.68, { col: HAIR, w: 1.1 });
      s.addText(tech[i], { x: x - 0.05, y: y0 + 1.4, w: w + 0.1, h: 0.7, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 9.5, color: i === 4 ? ACC : MUTED, align: "center", lineSpacing: 12 });
    } else {
      s.addText("teknoloji\ngerekmez", { x: x - 0.05, y: y0 + 1.4, w: w + 0.1, h: 0.7, isTextBox: true,
        margin: 0, fontFace: S, fontSize: 9.5, italic: true, color: FAINT, align: "center", lineSpacing: 12 });
    }
  });
  cap(s, x0, y0 + 2.25, tot, "Teknoloji yolculuğun tamamına değil, belirli anlarına girer. Her ana bir ekran koymak, hiçbirine koymamaktan daha kötüdür.",
      { size: 13, face: H, col: ACC, italic: true, h: 0.4, align: "center" });

  text(s, "Müşteri bugün bir markayla birden çok kanaldan temas ediyor: sosyal medyada görüyor, internette inceliyor, mağazada deniyor, tekrar internetten alıyor. Fiziksel ve dijital katmanların iç içe geçtiği bu duruma literatürde 'phygital' deniyor (Xi & Idris, 2026).\n\nBunun mağaza tasarımı açısından sonucu şudur: mağaza artık yolculuğun tamamı değil, bir parçasıdır. İnsan geldiğinde ürünü çoğu zaman zaten biliyordur. O hâlde mağazanın işi bilgi vermek değil, ekranın veremediğini vermektir.",
       { y: 5.15, h: 1.6, size: 13 });
  s.addNotes("Eşik anında 'teknoloji gerekmez' demek bilinçli bir seçim: eşik duyusal bir andır, ekran orada dikkat dağıtır.");
}

{
  const s = slide("IX · TEKNOLOJİ", "Ne işe yarar, ne işe yaramaz");
  const y0 = 2.3, w = 5.5, h = 3.3;
  zone(s, M, y0, w, h, "", 1);
  s.addText("İŞE YARAR", { x: M + 0.32, y: y0 + 0.28, w: w - 0.64, h: 0.34, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 11, bold: true, color: ACC, charSpacing: 1.6 });
  const good = [
    "Bir engeli kaldırıyorsa — stok sorgusu, beden bulma, sıra beklememe",
    "Ürünü kullanım bağlamında gösteriyorsa — mankende, odada, bedende",
    "Kişiselleştirmeyi mümkün kılıyorsa — ölçü, renk, isim",
    "Erişilebilirliği artırıyorsa — sesli bilgi, büyük punto, dokunsal karşılık",
    "Mekânın kendisiyle uyumluysa — malzemeye ve ışığa gömülüyse"
  ];
  let yy = y0 + 0.78;
  good.forEach(t => { dot(s, M + 0.42, yy + 0.13, { d: 0.1, col: ACC });
    s.addText(t, { x: M + 0.68, y: yy - 0.04, w: w - 1.0, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: BODY, lineSpacing: 14 }); yy += 0.5; });

  zone(s, C2, y0, w, h, "", 0);
  s.addText("İŞE YARAMAZ", { x: C2 + 0.32, y: y0 + 0.28, w: w - 0.64, h: 0.34, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 11, bold: true, color: MUTED, charSpacing: 1.6 });
  const bad = [
    "Duvara asılmış, kimsenin bakmadığı ekran",
    "Telefonda zaten olan bilgiyi tekrar eden arayüz",
    "Kullanımı personel yardımı gerektiren 'self-servis' cihaz",
    "Bakımı yapılmadığında mekânı bozan, kapalı duran ünite",
    "Zayıf çözülmüş bir planı örtmek için eklenen gösteri"
  ];
  yy = y0 + 0.78;
  bad.forEach(t => { dot(s, C2 + 0.42, yy + 0.13, { d: 0.1, col: FAINT });
    s.addText(t, { x: C2 + 0.68, y: yy - 0.04, w: w - 1.0, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: MUTED, lineSpacing: 14 }); yy += 0.5; });

  cap(s, M, 5.85, 11.4, "Elli çalışmayı inceleyen bir derleme, gelişmiş sistemler yaygınlaştıkça bile malzemenin, ışığın, sesin ve rengin anlatım gücünün belirleyici kaldığını gösteriyor. Dijital sistemler bu nitelikleri ikame etmiyor, derinleştiriyor (Ratnayake vd., 2026).",
      { size: 12.5, face: H, col: BODY, h: 0.7, ls: 18 });
  cap(s, M, 6.6, 11.4, "Kısacası: iyi çözülmemiş bir mekânı teknoloji kurtarmaz.",
      { size: 14, face: H, col: ACC, italic: true, h: 0.4 });
  s.addNotes("Son cümle önemli: öğrenciler zayıf plan çözümünü dijital öğelerle örtmeye çalışıyor.");
}

{
  const s = slide("IX · TEKNOLOJİ", "Somut olan, hayalî olandan güçlüdür");
  const y0 = 2.55, w = 4.6, h = 2.2;
  // contextual
  zone(s, 1.35, y0, w, h, "", 1);
  s.addText("BAĞLAMSAL SUNUM", { x: 1.62, y: y0 + 0.25, w: w - 0.54, h: 0.32, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 10.5, bold: true, color: ACC, charSpacing: 1.4 });
  s.addText("Ürün tanıdık ve kullanımla ilgili bir ortamda gösterilir.", {
    x: 1.62, y: y0 + 0.62, w: w - 0.54, h: 0.6, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 14, color: INK, lineSpacing: 19 });
  s.addText("Mankende giyilmiş bir ceket · döşenmiş bir odada duran mobilya · masada kurulmuş bir sofra takımı", {
    x: 1.62, y: y0 + 1.28, w: w - 0.54, h: 0.75, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13.5 });
  // imaginative
  zone(s, 7.35, y0, w, h, "", 0);
  s.addText("HAYALÎ SUNUM", { x: 7.62, y: y0 + 0.25, w: w - 0.54, h: 0.32, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 10.5, bold: true, color: MUTED, charSpacing: 1.4 });
  s.addText("Ürün fantastik, soyut ya da alışılmadık bir kurgu içinde sunulur.", {
    x: 7.62, y: y0 + 0.62, w: w - 0.54, h: 0.6, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 14, color: INK, lineSpacing: 19 });
  s.addText("Havada asılı duran ürün · soyut bir sahnede tek başına sergilenen nesne", {
    x: 7.62, y: y0 + 1.28, w: w - 0.54, h: 0.75, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13.5 });
  arrow(s, 6.15, y0 + h / 2, 7.15, y0 + h / 2, { col: HAIR, w: 1.25 });
  cap(s, 5.85, y0 + h / 2 - 0.55, 1.6, "daha güçlü", { align: "center", size: 10, bold: true, col: ACC });

  text(s, "Sanal gerçeklik tabanlı mağaza içi teşhirler üzerine yapılan çok çalışmalı bir deney, teknolojinin etkisinin teknik yetkinlikten çok tasarım mantığına bağlı olduğunu gösterdi. Dört ayrı çalışma dizisinde bağlamsal sunumlar tutarlı biçimde daha güçlü tepki üretti (Ishaq vd., 2026).\n\nNedeni basit: insanlar bir ürünü değerlendirirken onu nasıl kullanacaklarını hayal eder. Ürünü tanıdık bir kullanım durumuna yerleştiren sunum bu işi kolaylaştırır. Bulgu dijital olmayan teşhir için de geçerlidir — manken, oda kurgusu ve masa düzeni aynı ilkeyle çalışır.",
       { y: 5.2, h: 1.6, size: 13 });
  s.addNotes("Bu bulgunun en pratik sonucu vitrin ve teşhir için geçerli: ürünü kullanım bağlamında göstermek her zaman daha etkili.");
}

/* =========================================================
   X — HERKES İÇİN MAĞAZA
   ========================================================= */
opener("X", "Herkes için mağaza", "Erişilebilirlik bir ek değil, tasarımın ölçütlerinden biridir.");

{
  const s = slide("X · HERKES İÇİN MAĞAZA", "Dört ilke ve uygulanmış karşılıkları");
  text(s, "Erişilebilirlik çoğu zaman rampa ve asansöre indirgenir. Oysa zorluk üreten şeylerin çoğu görünmezdir ve gruplar farklı şeylerden zorlanır: görme engelli kullanıcılar için parlama ve düşük kontrast, bilişsel engeli olanlar için ses ve duyusal yük, fiziksel engeli olanlar için dar geçit ve yoğunluk (Akyazıcı & Yaşar, 2026).",
       { one: true, y: 1.78, h: 1.05, size: 14 });

  const y0 = 3.05, w = 2.72, h = 1.9, gap = 0.25;
  const pr = [
    ["Anlamlı uyaran", "Her duyusal uyaranın açık bir işlevi olmalı; gereksiz yoğunluk üretilmemeli."],
    ["Seçim ve kontrol", "Temel hizmetlere birden çok yoldan ulaşılabilmeli: sakinleştirilmiş mod, personel desteği."],
    ["Öngörülebilirlik", "Duyusal koşullar önceden bildirilmeli; sakin saatler, duyusal bölgeleme."],
    ["Eşdeğerlik", "Fiziksel ve dijital kanallar arasında hizmet eşdeğer olmalı."]
  ];
  pr.forEach((r, i) => {
    const x = 0.85 + i * (w + gap);
    zone(s, x, y0, w, h, "", 0);
    s.addText(String(i + 1), { x: x + 0.22, y: y0 + 0.16, w: 0.6, h: 0.42, isTextBox: true,
      margin: 0, fontFace: H, fontSize: 24, bold: true, color: ACC });
    s.addText(r[0], { x: x + 0.22, y: y0 + 0.65, w: w - 0.44, h: 0.34, isTextBox: true,
      margin: 0, fontFace: H, fontSize: 14, bold: true, color: INK });
    s.addText(r[1], { x: x + 0.22, y: y0 + 1.02, w: w - 0.44, h: 0.82, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13.5 });
  });
  cap(s, M, 5.12, 11.4, "Tonin, Ferrara & Nickel (2026) — Avrupa Erişilebilirlik Yasası temelli performans ilkeleri", { size: 10 });
  exampleRow(s, [
    ["Tesco", "Sakin saat: belirli saatlerde müzik ve anonsların kapatılması, ışığın kısılması."],
    ["Walmart", "Duyusal dostu saatler; aynı yaklaşımın düzenli bir protokol olarak uygulanması."],
    ["IKEA", "Dokunsal yönlendirme ve dokunsal harita hizmeti."],
    ["Mastercard", "Touch Card: kartta dokunsal çentik; ödeme anında bağımsızlık."]
  ], 5.5, 4);
  s.addNotes("Vurgulanacak nokta: bu uygulamaların hiçbiri markanın kimliğinden ödün vermiyor. Erişilebilirlik çoğu zaman mekâna seçenek eklemektir.");
}

/* =========================================================
   XI — ÖRNEKLER
   ========================================================= */
opener("XI", "Örnekler", "Dünyadan ve Türkiye'den okunabilir mağaza örnekleri.");

{
  const s = slide("XI · ÖRNEKLER", "Dünyadan");
  exampleRow(s, [
    ["Prada Epicenter, New York", "OMA, 2001. Satış alanını dalga biçimli ahşap zeminle sahneye dönüştüren, mağazayı kültür mekânı gibi ele alan erken örnek."],
    ["Dover Street Market, Londra", "Markaların kendi kurdukları stantlarla bir arada bulunduğu, düzenli olarak yeniden kurulan kurgu."],
    ["Gentle Monster, Seul", "Gözlük satan mekânı büyük ölçekli enstalasyonlarla kuran, ürünü neredeyse arka plana iten yaklaşım."],
    ["Aesop", "Her mağazanın yerel bir tasarımcı ve yerel malzemeyle kurulması; tek bir mağaza tipinin olmaması."],
    ["Muji", "Malzeme, ışık ve ürün dilinin tek bir sadelik fikrinde buluşması."],
    ["Apple Store", "Şeffaflık, gün ışığı ve ürünün dokunmaya açık sunumu; teşhirin neredeyse kaldırılması."]
  ], 2.0, 3);
  cap(s, M, 4.45, 11.4, "Duyusal kimliğin ürün kararından doğduğu iki örnek", { size: 9, bold: true, col: FAINT, h: 0.24 });
  exampleRow(s, [
    ["Lush", "Ambalajın kaldırılmasıyla kokunun mekânın ana malzemesi hâline gelmesi."],
    ["Camper", "Mağazaların farklı tasarımcılara açılması; kurumsal şablon yerine çoğulluk."]
  ], 4.78, 2);
  img(s, "Her marka için birer iç mekân fotoğrafı yeterli; Prada Epicenter'ın dalga zemini ve Gentle Monster'ın enstalasyonları en çarpıcı görseller.");
  s.addNotes("Örnekleri kısa geçin; öğrenciler bunları zaten arayacak. Amaç bir referans listesi vermek.");
}

{
  const s = slide("XI · ÖRNEKLER", "Türkiye'den");
  exampleRow(s, [
    ["Kapalı Çarşı ve Mısır Çarşısı", "Bedesten, arasta ve han tiplerinin zamanla birbirine eklenmesiyle oluşan, hâlâ çalışan bir ticaret örgüsü."],
    ["Beyoğlu pasajları", "Çiçek Pasajı, Hazzopulo, Atlas — on dokuzuncu yüzyıl pasajının yerel yorumları; sokakla iç mekân arası tipoloji."],
    ["Arasta ve bedestenler", "Bursa, Edirne, Antalya — ışığı ve ritmi üstten kurgulanan örtülü ticaret sokağı."]
  ], 2.0, 3);
  cap(s, M, 4.45, 11.4, "Güncel mağaza tasarımı", { size: 9, bold: true, col: FAINT, h: 0.24 });
  exampleRow(s, [
    ["Vakko Fashion Center", "REX, 2010. Marka merkezi ile mağaza deneyimini birleştiren, cam kutu strüktürüyle tanınan yapı."],
    ["Armaggan, Nuruosmaniye", "Türk zanaatını çok katlı bir mekânda sergi ile satış arasında konumlandıran güçlü teşhir dili."],
    ["Bağımsız butikler", "Karaköy, Çukurcuma, Alaçatı — küçük ölçekli, yerel malzemeli, çoğu zaman tek mekânlık tasarımlar."]
  ], 4.78, 3);
  s.addNotes("Öğrencilere arasta ve bedestenleri gidip görmelerini önerin; ışık ve ritim açısından çok öğretici.");
}

/* =========================================================
   KAPANIŞ  ·  KAYNAKÇA
   ========================================================= */
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addText("Toparlarsak", { x: M, y: 1.0, w: 10.5, h: 0.7, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 30, bold: true, color: ACC });
  s.addText("Mağaza tasarımı, bir markanın ne olduğunu anlayıp onu insanların bedeniyle karşılaşacağı bir mekâna çevirme işidir.\n\nBu çeviri gözle sınırlı değildir. Işık, malzeme, ses, koku ve mekânın bedene verdiği hisler birlikte çalışır ve ancak birbiriyle uyumlu olduklarında bir anlam üretirler.\n\nDuyusal tasarım bir süsleme katmanı değil, mekânın işleyen bir parçasıdır. Her uyaranın bir gerekçesi olmalıdır — çünkü gerekçesi olmayan uyaran, birileri için engeldir.\n\nVe iyi bir mağaza yalnızca müşterinin gördüğü yer değildir. Çalışanın günü, deponun rotası ve herkesin erişebilirliği de aynı tasarımın parçasıdır.", {
    x: M, y: 1.95, w: 11.4, h: 4.7, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 16, color: "E8E8EC", lineSpacing: 27 });
  n += 1;
}

function refslide(title, refs) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  label(s, "KAYNAKÇA");
  s.addText(title, { x: M, y: 0.9, w: 11.2, h: 0.6, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 26, bold: true, color: INK });
  const half = Math.ceil(refs.length / 2);
  refs.forEach((r, i) => {
    const col = i < half ? 0 : 1, row = i < half ? i : i - half;
    s.addText(r, { x: col === 0 ? M : C2, y: 1.82 + row * 1.02, w: CW, h: 0.95,
      isTextBox: true, margin: 0, fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 14 });
  });
  num(s);
}

refslide("Güncel araştırmalar", [
  "Akyazıcı, A. O. & Yaşar, D. (2026). Disability-Specific Spatial Friction in Department Store Interiors: A Mixed-Methods Study of Inclusive Retail Design. Buildings, 16(12), 2405.",
  "Ishaq, M. I., Raza, A., Haider, A., Goudarzi, K. & Talpur, Q. (2026). Immersive Retail Technologies and Customer Experiences: A Multi-Study Experimental Design. Psychology & Marketing.",
  "Ratnayake, J. C., Jayasuriya, N., Suraweera, T. & De Silva, L. (2026). Integrating Industry 4.0 and 5.0 Technologies in Luxury Fashion Retail Interiors. Social Sciences & Humanities Open, 13, 102798.",
  "Tonin, P. E., Ferrara, M. & Nickel, E. (2026). Inclusive Sensory Design in Phygital Retail: Regulatory Guidelines Bridging Accessibility and Brand Experience. IntechOpen.",
  "Xi, C. & Idris, M. Z. (2026). Omnichannel Fashion Retail Experience Design Informed by Brand Personality. Textile & Leather Review, 9, 1053–1119.",
  "Quartier, K., Claes, S. & Vanrie, J. (2020). A Holistic Competence Framework for (Future) Retail Design and Retail Design Education. Journal of Retailing and Consumer Services."
]);

refslide("Temel kaynaklar", [
  "Bitner, M. J. (1992). Servicescapes: The Impact of Physical Surroundings on Customers and Employees. Journal of Marketing, 56(2), 57–71.",
  "Cezar, M. (1983). Tipik Yapılarıyla Osmanlı Şehirciliğinde Çarşı ve Klasik Dönem İmar Sistemi. Mimar Sinan Üniversitesi Yayınları.",
  "Klanten, R., Ehmann, S. & Borges, S. (Eds.) (2013). Brand Spaces: Branded Architecture and the Future of Retail Design. Gestalten.",
  "Kotler, P. (1973). Atmospherics as a Marketing Tool. Journal of Retailing, 49(4), 48–64.",
  "Krishna, A. (2012). An Integrative Review of Sensory Marketing. Journal of Consumer Psychology, 22(3), 332–351.",
  "Lemon, K. N. & Verhoef, P. C. (2016). Understanding Customer Experience Throughout the Customer Journey. Journal of Marketing, 80(6), 69–96.",
  "Mehrabian, A. & Russell, J. A. (1974). An Approach to Environmental Psychology. MIT Press.",
  "Mesher, L. (2010). Basics Interior Design: Retail Design. AVA Publishing."
]);

refslide("Temel kaynaklar (devamı)", [
  "Pallasmaa, J. (2005). The Eyes of the Skin: Architecture and the Senses. Wiley. [Türkçesi: Tenin Gözleri, YEM Yayın]",
  "Petermans, A. & Van Cleempoel, K. (2009). Retail Design: Lighting as a Design Tool for the Retail Environment.",
  "Pine, B. J. & Gilmore, J. H. (1998). Welcome to the Experience Economy. Harvard Business Review, 76(4), 97–105.",
  "Quartier, K., Petermans, A., Melewar, T. C. & Dennis, C. (Eds.) (2021). The Value of Design in Retail and Branding. Emerald.",
  "Schittich, C. (Ed.) (2002). Interior Spaces: Space, Light, Material. Edition Detail.",
  "Spence, C., Puccinelli, N. M., Grewal, D. & Roggeveen, A. L. (2014). Store Atmospherics: A Multisensory Perspective. Psychology & Marketing, 31(7), 472–488.",
  "Underhill, P. (2008). Why We Buy: The Science of Shopping (Rev. ed.). Simon & Schuster.",
  "Wheeler, A. (2017). Designing Brand Identity (5th ed.). Wiley.",
  "Zumthor, P. (2006). Atmospheres. Birkhäuser. [Türkçesi: Atmosferler]"
]);

p.writeFile({ fileName: "/tmp/claude-0/-home-user-sanat-ve-mekan/8e32618a-9471-5a88-afa8-31873b734ef0/scratchpad/Magaza-Tasarimi-Teorik-Sunum.pptx" })
 .then(f => console.log("WROTE", f, "| slides:", n));
