const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE";              // 13.33 x 7.5
p.title  = "Marka Anahtarı ve Müşteri Deneyimi Araştırması";

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
   KAPAK
   ========================================================= */
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addText("İÇ MİMARLIK · MAĞAZA TASARIMI STÜDYOSU · 1. HAFTA", {
    x: M, y: 1.35, w: 11.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 11, bold: true, color: ACC, charSpacing: 3 });
  s.addText("Marka Anahtarı ve\nMüşteri Deneyimi Araştırması", {
    x: M, y: 2.0, w: 11.4, h: 2.1, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 46, bold: true, color: "FFFFFF", lineSpacing: 58 });
  s.addShape(p.ShapeType.line, { x: M, y: 4.35, w: 2.6, h: 0,
    line: { color: ACC, width: 2 } });
  s.addText("Bir markayı mekâna çevirmenin ilk adımı: markayı ve müşterisini\nokunabilir hâle getirmek.", {
    x: M, y: 4.65, w: 9.8, h: 0.9, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 17, color: DIMW, lineSpacing: 26 });
  s.addText("Brand Key Mapping  ·  Customer Experience Research", {
    x: M, y: 6.5, w: 11.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10.5, color: MUTED, charSpacing: 1.6 });
}

/* ---- bugünün akışı ---- */
{
  const s = slide("BUGÜN", "Bugün ne yapacağız");
  text(s, "Bugünün sekiz saati üç işe ayrılıyor: dersin çerçevesini anlamak, bir markayı mekâna çeviren araçları öğrenmek ve bu araçları aynı gün içinde bir mağaza üzerinde denemek. Gün sonunda herkesin elinde doldurulmuş bir analiz kâğıdı ve önümüzdeki haftanın ödevi olacak.",
       { one: true, y: 1.72, h: 1.0, size: 14.5 });

  const steps = [
    ["1", "Proje brifi", "Ders akışı, teslimler,\ndeğerlendirme ölçütleri"],
    ["2", "Teorik anlatım", "Marka anahtarı ve\ndeneyim araştırması"],
    ["3", "Mağaza okuma", "Verilen görsel üzerinden\nbireysel analiz"],
    ["4", "Grup tartışması", "Aynı mağazayı okuyanların\nfarklarını karşılaştırma"],
    ["5", "Ödevin verilmesi", "Üç aday marka ve\naraştırma paftası"]
  ];
  const bw = 2.12, gap = 0.26, y0 = 2.95, bh = 1.5;
  steps.forEach((st, i) => {
    const x = M + i * (bw + gap), hi = (i === 2 || i === 3);
    zone(s, x, y0, bw, bh, "", hi ? 1 : 0);
    s.addText(st[1], { x: x + 0.16, y: y0 + 0.42, w: bw - 0.32, h: 0.4, isTextBox: true,
      margin: 0, fontFace: H, fontSize: 14, bold: true, color: hi ? ACC : INK, lineSpacing: 17 });
    s.addText(st[2], { x: x + 0.16, y: y0 + 0.84, w: bw - 0.32, h: 0.6, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 9.5, color: MUTED, lineSpacing: 12 });
    dot(s, x + 0.27, y0 + 0.28, { t: st[0], d: 0.24, col: hi ? ACC : MUTED });
    if (i < 4) dline(s, x + bw + 0.03, y0 + bh / 2, x + bw + gap - 0.03, y0 + bh / 2, { col: HAIR, w: 1 });
  });
  cap(s, M, y0 + bh + 0.22, 11.4, "İlk iki adım dinleyerek, son üç adım yaparak geçecek.",
      { size: 11, col: FAINT, italic: true });

  cap(s, M, 5.35, 11.4, "GÜN SONUNDA ELİNİZDE OLACAKLAR", { size: 9, bold: true, col: FAINT, charSpacing: 1.6 });
  const outs = [
    "Doldurulmuş bir mağaza okuma kâğıdı ve üç anahtar kelime",
    "Kendi seçtiğiniz mağazanın grup tartışmasından çıkan notlar",
    "Önümüzdeki hafta teslim edilecek marka araştırması paftası"
  ];
  outs.forEach((o, i) => {
    dot(s, M + 0.09, 5.72 + i * 0.36, { d: 0.1, col: ACC });
    cap(s, M + 0.32, 5.58 + i * 0.36, 11.0, o, { size: 12, face: H, col: BODY, h: 0.3 });
  });
  s.addNotes("Bu slaytı günün başında açık bırakın; öğrenci sekiz saatin neye gittiğini görsün.");
}

/* ---- iki soru ---- */
{
  const s = slide("ÇERÇEVE", "Bu dersin cevapladığı iki soru");
  text(s, "Bir mağaza tasarımı iki ayrı bilgiden doğar. Birincisi markanın kendisidir: ne olduğunu, neyi vaat ettiğini, hangi sözcüklerle konuştuğunu bilmeden onun mekânını kuramayız. İkincisi müşteridir: mağazaya nasıl geldiğini, içeride ne yaptığını, nerede karar verdiğini bilmeden o mekânın işleyip işlemediğini söyleyemeyiz.",
       { one: true, y: 1.75, h: 0.95, size: 15 });

  const cy = 4.05, r = 1.22;
  const lx = 4.35, rx = 8.98;
  s.addShape(p.ShapeType.ellipse, { x: lx - r, y: cy - r, w: r * 2, h: r * 2,
    fill: { type: "none" }, line: { color: ACC, width: 1.5 } });
  s.addShape(p.ShapeType.ellipse, { x: rx - r, y: cy - r, w: r * 2, h: r * 2,
    fill: { type: "none" }, line: { color: INK, width: 1.5 } });
  s.addText("MARKA", { x: lx - r, y: cy - 0.62, w: r * 1.1, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10, bold: true, color: ACC, align: "center", charSpacing: 1.6 });
  s.addText("Kim konuşuyor?", { x: lx - r - 0.1, y: cy - 0.28, w: r * 1.3, h: 0.5, isTextBox: true,
    margin: 0, fontFace: H, fontSize: 14, bold: true, color: INK, align: "center", lineSpacing: 17 });
  s.addText("MÜŞTERİ", { x: rx + r * (-0.1), y: cy - 0.62, w: r * 1.1, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10, bold: true, color: INK, align: "center", charSpacing: 1.6 });
  s.addText("Kim dinliyor?", { x: rx - r * 0.2, y: cy - 0.28, w: r * 1.3, h: 0.5, isTextBox: true,
    margin: 0, fontFace: H, fontSize: 14, bold: true, color: INK, align: "center", lineSpacing: 17 });

  s.addShape(p.ShapeType.ellipse, { x: (lx + rx) / 2 - 0.86, y: cy - 0.86, w: 1.72, h: 1.72,
    fill: { color: ACCT }, line: { color: ACC, width: 1.25 } });
  s.addText("MEKÂN", { x: (lx + rx) / 2 - 0.86, y: cy - 0.28, w: 1.72, h: 0.55, isTextBox: true,
    margin: 0, fontFace: H, fontSize: 15, bold: true, color: ACC, align: "center", valign: "middle" });

  cap(s, 0.85, 5.55, 3.2, "MARKA ANAHTARI", { size: 9.5, bold: true, col: ACC, charSpacing: 1.4 });
  cap(s, 0.85, 5.8, 3.4, "Markanın ne olduğunu dokuz başlıkta tarif eden bir çerçeve.", { size: 11, ls: 13.5, h: 0.6 });
  cap(s, 9.3, 5.55, 3.2, "DENEYİM ARAŞTIRMASI", { size: 9.5, bold: true, col: INK, charSpacing: 1.4 });
  cap(s, 9.3, 5.8, 3.2, "Müşterinin yolculuğunu ve temas noktalarını haritalayan yöntemler.", { size: 11, ls: 13.5, h: 0.6 });
  cap(s, 4.9, 6.35, 3.6, "Tasarım bu ikisinin kesişiminde başlar.", { size: 12, face: H, italic: true, col: ACC, align: "center" });
  s.addNotes("İki soruyu tahtaya da yazın: kim konuşuyor, kim dinliyor. Tüm dönem bu ikisine döneceğiz.");
}

/* =========================================================
   I · MARKA NEDEN TASARIMIN VERİSİ
   ========================================================= */
opener("I", "Marka neden tasarımın verisidir?", "Logo bir işaret; marka ise bir vaat. Tasarımcı vaadi mekâna çevirir.");

{
  const s = slide("I · MARKA", "Marka görünenden ibaret değildir");
  text(s, "Bir markanın görünen yüzü küçüktür: adı, logosu, renkleri, ambalajı. Bunlar markayı tanıtır ama açıklamaz. Altında, çoğu zaman yazılı bile olmayan bir katman vardır — markanın neye inandığı, kime seslendiği, neyi vaat ettiği. Tasarımcının malzemesi bu alt katmandır (Wheeler, 2017).",
       { one: true, y: 1.75, h: 0.9, size: 15 });

  const cx = 4.5, top = 2.95;
  dline(s, 1.5, 4.12, 7.5, 4.12, { col: MUTED, w: 1, dash: "dash" });
  cap(s, 1.5, 3.8, 2.2, "görünen", { size: 9, bold: true, col: MUTED, charSpacing: 1.4 });
  cap(s, 1.5, 4.16, 2.2, "görünmeyen", { size: 9, bold: true, col: ACC, charSpacing: 1.4 });

  const vis = ["Logo", "Renk", "Ambalaj", "İsim"];
  vis.forEach((t, i) => {
    const x = 3.35 + i * 1.02;
    s.addShape(p.ShapeType.ellipse, { x: x - 0.34, y: 3.36, w: 0.68, h: 0.68,
      fill: { type: "none" }, line: { color: HAIR, width: 1 } });
    s.addText(t, { x: x - 0.5, y: 3.05, w: 1.0, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, color: MUTED, align: "center" });
  });

  const inv = [
    ["İnanç", "Marka neye değer veriyor?"],
    ["Vaat", "Müşteriye ne söz veriyor?"],
    ["Ton", "Nasıl konuşuyor?"],
    ["Topluluk", "Kime sesleniyor?"],
    ["Ritüel", "Hangi alışkanlığı kuruyor?"]
  ];
  inv.forEach((t, i) => {
    const x = 1.9 + i * 2.18;
    zone(s, x, 4.5, 1.95, 0.55, t[0], 1, 12);
    cap(s, x, 5.12, 1.95, t[1], { size: 9.5, col: MUTED, align: "center", ls: 11.5, h: 0.5 });
    dline(s, x + 0.97, 4.12, x + 0.97, 4.5, { col: ACC, w: 1 });
  });
  cap(s, M, 6.15, 11.4, "Öğrencinin ilk işi bu alt katmanı yazıya dökmektir. Yazılamayan bir marka mekâna da çevrilemez.",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Küçük markalarda bu katman çoğu zaman sahibinin kafasındadır; öğrenci onu görüşerek çıkarmak zorunda.");
}

{
  const s = slide("I · MARKA", "Markadan mekâna: dört adım");
  text(s, "Marka ile mekân arasında tek bir sıçrama yoktur; arada iki ara durak bulunur. Öğrencilerin en sık yaptığı hata bu duraklara uğramadan doğrudan görsele atlamaktır — o durumda tasarım markanın değil, tasarımcının beğenisinin ürünü olur.",
       { one: true, y: 1.75, h: 1.0, size: 15 });

  const items = [
    ["Marka", "Ne olduğunu\nyazıyla tarif et", "marka anahtarı"],
    ["Anahtar\nkelime", "Üç sıfata\nindirge", "ayırt edici olanı seç"],
    ["Tasarım\nilkesi", "Her kelimeyi bir\nmekânsal kurala çevir", "ölçü, ilişki, hiyerarşi"],
    ["Mekânsal\nöğe", "İlkeyi bir malzeme,\nışık, eleman yap", "çizilebilir karar"]
  ];
  const bw = 2.45, gap = 0.62, y0 = 3.0, bh = 1.35;
  items.forEach((it, i) => {
    const x = 0.95 + i * (bw + gap);
    zone(s, x, y0, bw, bh, "", i === 3 ? 1 : 0);
    s.addText(it[0], { x: x + 0.18, y: y0 + 0.16, w: bw - 0.36, h: 0.62, isTextBox: true,
      margin: 0, fontFace: H, fontSize: 16, bold: true, color: i === 3 ? ACC : INK, lineSpacing: 19 });
    s.addText(it[1], { x: x + 0.18, y: y0 + 0.78, w: bw - 0.36, h: 0.48, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 10, color: MUTED, lineSpacing: 12.5 });
    cap(s, x, y0 + bh + 0.14, bw, it[2], { size: 9, col: FAINT, italic: true });
    if (i < 3) arrow(s, x + bw + 0.09, y0 + bh / 2, x + bw + gap - 0.09, y0 + bh / 2, { col: ACC, w: 1.5 });
  });

  dline(s, 0.95, 5.15, 12.4, 5.15, { col: HAIR, w: 0.75 });
  cap(s, M, 5.3, 5.5, "Bugünün konusu ilk iki adım.", { size: 12, face: H, bold: true, col: ACC });
  cap(s, M, 5.6, 5.5, "Marka anahtarı ve deneyim araştırması, markayı yazıya ve sonra anahtar kelimeye çeviren araçlardır.",
      { size: 11, ls: 14, h: 0.6 });
  cap(s, C2, 5.3, 5.5, "Son iki adım önümüzdeki haftaların işi.", { size: 12, face: H, bold: true, col: INK });
  cap(s, C2, 5.6, 5.5, "Konsept jürisine kadar her anahtar kelimenin karşılığı bir mekânsal kararla verilmiş olacak.",
      { size: 11, ls: 14, h: 0.6 });
  s.addNotes("Dönem boyunca kritiklerde bu dört kutuyu sorun: hangi adımdasın, bir öncekini yaptın mı?");
}

/* =========================================================
   II · MARKA ANAHTARI
   ========================================================= */
opener("II", "Marka Anahtarı", "Bir markayı dokuz başlıkta okunabilir hâle getiren çerçeve.");

{
  const s = slide("II · MARKA ANAHTARI", "Marka anahtarı nedir, nereden gelir?");
  text(s, "Marka anahtarı (brand key), 1990'larda Unilever'in marka yönetimi için geliştirdiği bir şablondur. Amacı basittir: bir markayı sezgiyle değil, belirli başlıklar altında tarif etmek. Başlıklar rekabet ortamından başlar, hedef kitleye ve müşterinin ihtiyacına geçer, faydalar ve değerler üzerinden markanın özüne varır (Wheeler, 2017; Micheaux & Bosio, 2019).\n\nPazarlamada doğmuş olsa da tasarım eğitiminde yaygın biçimde kullanılır; çünkü çıktısı bir slogan değil, birbirine bağlı bir dizi ifadedir. Bu ifadeler mekânsal kararlara çevrilebilecek kadar somuttur.",
       { one: false, y: 1.78, h: 2.35, size: 14 });

  dline(s, M, 4.35, 12.48, 4.35, { col: HAIR, w: 0.75 });
  cap(s, M, 4.5, 11.4, "STÜDYODA NEDEN İŞE YARAR", { size: 9, bold: true, col: FAINT, charSpacing: 1.6 });
  const why = [
    ["Ortak bir dil kurar", "Jüride \"hoşuma gitti\" yerine hangi bileşenin karşılığı olduğu konuşulur."],
    ["Boşlukları gösterir", "Doldurulamayan başlık, araştırmanın eksik kaldığı yerdir."],
    ["Küçük markaya uygundur", "Kurumsal kimliği olmayan markada bu şablon kimliğin kendisini üretir."]
  ];
  const ww = 3.6, wg = 0.42;
  why.forEach((w, i) => {
    const x = M + i * (ww + wg);
    dot(s, x + 0.09, 4.97, { d: 0.11, col: ACC });
    s.addText(w[0], { x: x + 0.3, y: 4.82, w: ww - 0.3, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, bold: true, color: INK });
    s.addText(w[1], { x: x + 0.3, y: 5.14, w: ww - 0.3, h: 0.8, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: MUTED, lineSpacing: 14 });
  });
  cap(s, M, 6.15, 11.4, "Marka anahtarı bir dolduralım-geçelim formu değildir; her satırı bir kanıta dayanmalıdır.",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Unilever kökeni önemli değil; önemli olan şablonun neden işe yaradığı. Kanıt vurgusunu tekrarlayın.");
}

{
  const s = slide("II · MARKA ANAHTARI", "Dokuz bileşen ve birbirine bağlanışı");
  text(s, "Bileşenler bir liste değil, daralan bir hunidir: dışarıdan içeriye doğru okunur ve her kat bir öncekinden beslenir. En sondaki öz, kendi başına yazılamaz; yukarıdaki sekiz kutunun sonucudur.",
       { one: true, y: 1.7, h: 0.6, size: 14 });

  const rowY = [2.5, 3.42, 4.34, 5.26];
  const bh = 0.62;
  // row 1: three outer inputs
  const r1 = [["Kök güç", "markanın geldiği yer"], ["Rekabet ortamı", "kiminle karşılaştırılıyor"], ["Hedef kitle", "kime sesleniyor"]];
  const w1 = 3.2, g1 = 0.85;
  r1.forEach((it, i) => {
    const x = 0.98 + i * (w1 + g1);
    zone(s, x, rowY[0], w1, bh, it[0], 0, 12);
    cap(s, x, rowY[0] + bh + 0.04, w1, it[1], { size: 9, col: FAINT, align: "center" });
    dline(s, x + w1 / 2, rowY[0] + bh + 0.26, x + w1 / 2, rowY[1], { col: HAIR, w: 1 });
  });
  // row 2: insight + benefits
  const r2 = [["İçgörü", "müşterinin dile getirmediği ihtiyaç"], ["Faydalar", "işlevsel ve duygusal karşılık"]];
  const w2 = 4.6, g2 = 1.1;
  r2.forEach((it, i) => {
    const x = 1.53 + i * (w2 + g2);
    zone(s, x, rowY[1], w2, bh, it[0], 0, 12);
    cap(s, x, rowY[1] + bh + 0.04, w2, it[1], { size: 9, col: FAINT, align: "center" });
    dline(s, x + w2 / 2, rowY[1] + bh + 0.26, x + w2 / 2, rowY[2], { col: HAIR, w: 1 });
  });
  // row 3: values + reason to believe + discriminator
  const r3 = [["Değerler ve kişilik", "nasıl biri"], ["İnanma nedeni", "kanıt"], ["Ayırt edici güç", "tek farkı"]];
  const w3 = 3.2, g3 = 0.85;
  r3.forEach((it, i) => {
    const x = 0.98 + i * (w3 + g3);
    zone(s, x, rowY[2], w3, bh, it[0], 0, 11);
    cap(s, x, rowY[2] + bh + 0.04, w3, it[1], { size: 9, col: FAINT, align: "center" });
    dline(s, x + w3 / 2, rowY[2] + bh + 0.26, x + w3 / 2, rowY[3], { col: HAIR, w: 1 });
  });
  // row 4: essence
  zone(s, 4.4, rowY[3], 4.5, 0.66, "ÖZ  —  markanın tek cümlesi", 1, 13);

  cap(s, M, 6.15, 11.4, "Huninin yönü önemlidir: öz yukarıdan aşağı doğru üretilir, aşağıdan yukarı uydurulmaz (Micheaux & Bosio, 2019).",
      { size: 12, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Öğrenciye: önce en üst sıradan başla. Öz'ü ilk yazan öğrenci genellikle klişeye düşer.");
}

{
  const s = slide("II · MARKA ANAHTARI", "Bileşenler ne soruyor?");
  text(s, "Her bileşen, cevabı bir cümleyle verilebilecek tek bir soruya karşılık gelir. Cevaplar markadan, müşteriden ve rakiplerden toplanan bilgiye dayanmalı; tahminle doldurulan bir satır sonraki bütün adımları bozar.",
       { one: true, y: 1.7, h: 0.6, size: 14 });

  const L = [
    ["Kök güç", "Marka nereden geliyor; kim, neden kurmuş?"],
    ["Rekabet ortamı", "Müşteri bu markayı hangi seçeneklerle yan yana koyuyor?"],
    ["Hedef kitle", "Kime sesleniyor; yaşla değil davranışla tarif edilebilir mi?"],
    ["İçgörü", "Müşterinin dile getirmediği ama yaşadığı gerçek ne?"],
    ["Faydalar", "Ürün ne işe yarıyor, insanı ne hissettiriyor?"]
  ];
  const R = [
    ["Değerler ve kişilik", "Bu marka bir insan olsa nasıl biri olurdu?"],
    ["İnanma nedeni", "Vaadin doğru olduğunu gösteren somut kanıt ne?"],
    ["Ayırt edici güç", "Rakiplerin söyleyemeyeceği tek şey ne?"],
    ["Öz", "Hepsini tek cümlede toplarsak ne kalır?"]
  ];
  const draw = (arr, x0, y0) => {
    arr.forEach((it, i) => {
      const y = y0 + i * 0.78;
      dot(s, x0 + 0.1, y + 0.14, { t: "", d: 0.11, col: ACC });
      s.addText(it[0], { x: x0 + 0.33, y: y, w: CW - 0.33, h: 0.28, isTextBox: true, margin: 0,
        fontFace: H, fontSize: 14, bold: true, color: INK });
      s.addText(it[1], { x: x0 + 0.33, y: y + 0.3, w: CW - 0.33, h: 0.44, isTextBox: true, margin: 0,
        fontFace: S, fontSize: 11, color: MUTED, lineSpacing: 14 });
    });
  };
  draw(L, M, 2.5);
  draw(R, C2, 2.5);
  dline(s, 6.55, 2.45, 6.55, 6.3, { col: HAIR, w: 0.75 });
  s.addNotes("Bu slayt öğrencinin görüşme sorularını hazırlarken kullanacağı kontrol listesidir.");
}

{
  const s = slide("II · MARKA ANAHTARI", "Stüdyo için uyarlanmış hâli");
  text(s, "Pazarlama kökenli şablon iç mimarlık stüdyosunda olduğu gibi kullanılmaz. Bazı başlıklar küçük ve yeni bir markada karşılıksız kalır; buna karşılık mekâna doğrudan çevrilebilecek iki başlık şablonda yoktur. Aşağıdaki uyarlama, tasarım stüdyolarında yaygın biçimde kullanılan hâlidir.",
       { one: true, y: 1.7, h: 0.96, size: 14 });

  cap(s, M, 2.72, 5.5, "ÇIKARILANLAR", { size: 9, bold: true, col: MUTED, charSpacing: 1.6 });
  const out = [
    ["İçgörü", "yeni markada henüz ölçülmüş bir müşteri verisi yok"],
    ["İnanma nedeni", "kanıt çoğu zaman markanın kendi hikâyesiyle örtüşüyor"],
    ["Ayırt edici güç", "değerler ve kişilik başlığının içinde eriyor"]
  ];
  out.forEach((it, i) => {
    const y = 3.05 + i * 0.68;
    s.addText("—", { x: M, y: y, w: 0.3, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 13, color: MUTED });
    s.addText(it[0], { x: M + 0.32, y: y, w: CW - 0.32, h: 0.28, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, bold: true, color: MUTED });
    s.addText(it[1], { x: M + 0.32, y: y + 0.28, w: CW - 0.32, h: 0.38, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: FAINT, lineSpacing: 13 });
  });

  cap(s, C2, 2.72, 5.5, "EKLENENLER", { size: 9, bold: true, col: ACC, charSpacing: 1.6 });
  const add = [
    ["Hedefler ve misyon", "markanın beş yıl sonra nerede olmak istediği — mekânın esnekliğini belirler"],
    ["Görünüm", "markanın malzemesi, rengi, dokusu, biçim dili"],
    ["İletişim dili", "nasıl konuştuğu: yazısı, tabelası, sesi, sessizliği"]
  ];
  add.forEach((it, i) => {
    const y = 3.05 + i * 0.68;
    s.addText("+", { x: C2, y: y, w: 0.3, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 13, bold: true, color: ACC });
    s.addText(it[0], { x: C2 + 0.32, y: y, w: CW - 0.32, h: 0.28, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, bold: true, color: ACC });
    s.addText(it[1], { x: C2 + 0.32, y: y + 0.28, w: CW - 0.32, h: 0.4, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13 });
  });

  dline(s, M, 5.32, 12.48, 5.32, { col: HAIR, w: 0.75 });
  cap(s, M, 5.48, 11.4, "STÜDYODA DOLDURULACAK SEKİZ BAŞLIK", { size: 9, bold: true, col: FAINT, charSpacing: 1.6 });
  const fin = ["Kök güç", "Rekabet ortamı", "Hedef kitle", "Hedefler ve misyon",
               "Faydalar", "Değerler ve kişilik", "Görünüm ve iletişim dili", "Öz"];
  const fw = 1.32, fg = 0.145;
  fin.forEach((t, i) => {
    const x = M + i * (fw + fg);
    zone(s, x, 5.78, fw, 0.62, t, i === 7 ? 1 : 0, 9);
  });
  cap(s, M, 6.55, 11.4, "Son iki başlık — görünüm ve iletişim dili — mekâna en doğrudan çevrilen bileşenlerdir.",
      { size: 11.5, face: H, italic: true, col: ACC, h: 0.35 });
  s.addNotes("Bu sekizli, öğrencinin paftasında da aynen bulunacak.");
}

{
  const s = slide("II · MARKA ANAHTARI", "Bileşenlerin mekânsal karşılığı");
  text(s, "Her bileşen mekânda farklı bir ölçekte iş görür; kimi bütün kurguyu belirler, kimi tek bir detayda karşılık bulur. Bileşeni doğru ölçeğe bağlamak, hangi kararın nereden geldiğini açıklayabilmektir.",
       { one: true, y: 1.7, h: 0.66, size: 14 });

  const rows = [
    ["Hedef kitle", "kurgu ölçeği", "dolaşım hızı, kalma süresi, oturma ihtiyacı"],
    ["Hedefler ve misyon", "kurgu ölçeği", "esneklik, değişebilir teşhir, büyümeye açık plan"],
    ["Rekabet ortamı", "cephe ölçeği", "vitrinin sokakta nasıl ayrıştığı, tabelanın tonu"],
    ["Faydalar", "teşhir ölçeği", "ürüne dokunma izni, deneme alanı, ürün yoğunluğu"],
    ["Değerler ve kişilik", "atmosfer ölçeği", "ışık sıcaklığı, ses düzeyi, malzeme sertliği"],
    ["Görünüm", "malzeme ölçeği", "yüzey, renk, doku, birleşim detayı"],
    ["İletişim dili", "detay ölçeği", "yazı karakteri, yönlendirme, etiket, ambalaj"],
    ["Öz", "hepsinin sınavı", "her karar bu cümleyle sınanır"]
  ];
  let y = 2.55;
  const cx1 = M, cx2 = 3.55, cx3 = 6.25;
  cap(s, cx1, 2.28, 2.5, "BİLEŞEN", { size: 8.5, bold: true, col: FAINT, charSpacing: 1.5 });
  cap(s, cx2, 2.28, 2.5, "ÖLÇEK", { size: 8.5, bold: true, col: FAINT, charSpacing: 1.5 });
  cap(s, cx3, 2.28, 5.0, "MEKÂNDA NEYİ BELİRLER", { size: 8.5, bold: true, col: FAINT, charSpacing: 1.5 });
  dline(s, M, 2.5, 12.48, 2.5, { col: HAIR, w: 0.75 });
  rows.forEach((r, i) => {
    const hi = i === 7;
    s.addText(r[0], { x: cx1, y: y, w: 2.55, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, bold: true, color: hi ? ACC : INK });
    s.addText(r[1], { x: cx2, y: y + 0.02, w: 2.5, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: hi ? ACC : MUTED, italic: true });
    arrow(s, 5.72, y + 0.14, 6.08, y + 0.14, { col: hi ? ACC : HAIR, w: 1 });
    s.addText(r[2], { x: cx3, y: y + 0.01, w: 6.2, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: hi ? ACC : BODY });
    y += 0.5;
    if (i < rows.length - 1) dline(s, M, y - 0.09, 12.48, y - 0.09, { col: "EFEFF2", w: 0.5 });
  });
  s.addNotes("Sağ sütun, kritiklerde 'bu karar nereden geliyor' sorusunun cevap listesidir.");
}

{
  const s = slide("II · MARKA ANAHTARI", "Örnek: küçük bir kavurma-kahve markası");
  text(s, "Aşağıdaki örnek, sizin bulacağınız türden bir markadan üretildi: tek dükkânlı, kendi çekirdeğini kavuran, henüz tasarım dili olmayan bir kahveci. Doldurulmuş bir anahtarın ne kadar somut olabileceğini göstermek için.",
       { one: true, y: 1.7, h: 0.66, size: 14 });

  const ex = [
    ["Kök güç", "Kurucusu gıda mühendisi; kavurma eğrisini kendi yazıyor."],
    ["Rekabet ortamı", "Zincir kahveciler değil, semtteki üç küçük kavurucu."],
    ["Hedef kitle", "Kahveyi tarif ederek soran, bekleyebilen, soru soran müşteri."],
    ["Hedefler", "İki yıl içinde kavurmayı müşteriye gösterebilecek ikinci bir dükkân."],
    ["Faydalar", "Taze kavrulmuş çekirdek; ne aldığını anlama duygusu."],
    ["Değerler", "Meraklı, sabırlı, gösterişsiz; öğretmeyi seviyor."],
    ["Görünüm", "Ham metal, açık ahşap, cam kavanoz; boyasız yüzeyler."],
    ["İletişim dili", "El yazısı etiket, tarih ve rakım yazan fiş, az söz."]
  ];
  let y = 2.6;
  ex.forEach((e, i) => {
    const x = i < 4 ? M : C2;
    const yy = 2.6 + (i % 4) * 0.82;
    s.addText(e[0], { x: x, y: yy, w: CW, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 1.3 });
    s.addText(e[1], { x: x, y: yy + 0.26, w: CW, h: 0.5, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, color: BODY, lineSpacing: 16.5 });
  });

  zone(s, M, 5.95, 11.63, 0.72, "", 1);
  s.addText("ÖZ", { x: M + 0.22, y: 6.08, w: 0.6, h: 0.3, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 1.4 });
  s.addText("\"Kahveyi saklamayan, gösteren dükkân.\"", { x: M + 0.95, y: 6.05, w: 10.4, h: 0.45,
    isTextBox: true, margin: 0, fontFace: H, fontSize: 17, italic: true, bold: true, color: ACC });
  s.addNotes("Öz cümlesi zaten bir mekânsal talimat: üretimin görünür olması. Bunu vurgulayın.");
}

/* =========================================================
   III · MÜŞTERİ DENEYİMİ ARAŞTIRMASI
   ========================================================= */
opener("III", "Müşteri Deneyimi Araştırması", "Mağazayı tasarlamadan önce, insanın mağazayla ne yaptığını öğrenmek.");

{
  const s = slide("III · DENEYİM", "Deneyim mağazadan önce başlar, sonra biter");
  text(s, "Müşteri deneyimi kapıdan girip çıkma süresinden ibaret değildir: öncesi, anı ve sonrası olmak üzere üç evrede kurulur ve her evrede ayrı temas noktaları vardır (Lemon & Verhoef, 2016). İç mimarlık ortadaki evrenin tamamından, diğer ikisinin ise mekâna bakan ucundan sorumludur.",
       { one: true, y: 1.7, h: 0.96, size: 14.5 });

  const phases = [
    ["ÖNCE", "Duyma, arama, karşılaştırma,\nyola çıkma", 0],
    ["SIRASINDA", "Bulma, girme, gezinme, deneme,\nsorma, satın alma", 1],
    ["SONRA", "Kullanma, paylaşma, geri gelme,\niade", 0]
  ];
  const pw = 3.6, pg = 0.42, py = 3.0, ph = 1.25;
  phases.forEach((ph_, i) => {
    const x = M + i * (pw + pg);
    zone(s, x, py, pw, ph, "", ph_[2] ? 1 : 0);
    s.addText(ph_[0], { x: x + 0.2, y: py + 0.18, w: pw - 0.4, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, bold: true, color: ph_[2] ? ACC : MUTED, charSpacing: 1.8 });
    s.addText(ph_[1], { x: x + 0.2, y: py + 0.5, w: pw - 0.4, h: 0.6, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13, color: ph_[2] ? ACC : BODY, lineSpacing: 16.5 });
    if (i < 2) arrow(s, x + pw + 0.06, py + ph / 2, x + pw + pg - 0.06, py + ph / 2, { col: HAIR, w: 1.25 });
  });

  dline(s, M, 4.55, 12.48, 4.55, { col: ACC, w: 1.25 });
  cap(s, M, 4.62, 11.4, "İÇ MİMARLIĞIN SORUMLULUK ALANI", { size: 9, bold: true, col: ACC, charSpacing: 1.6 });
  const resp = [
    ["Öncenin ucu", "Vitrin ve cephe: mağazayı sokakta görünür ve okunur kılmak."],
    ["Sırası boyunca", "Eşik, dolaşım, teşhir, deneme, kasa: deneyimin tamamı."],
    ["Sonranın ucu", "Çıkış anı, iade ve teslim noktası: hatırlanan son izlenim."]
  ];
  resp.forEach((r, i) => {
    const x = M + i * (pw + pg);
    s.addText(r[0], { x: x, y: 4.95, w: pw, h: 0.28, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, bold: true, color: INK });
    s.addText(r[1], { x: x, y: 5.25, w: pw, h: 0.7, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: MUTED, lineSpacing: 14 });
  });
  cap(s, M, 6.15, 11.4, "Deneyimin en çok hatırlanan iki anı, en yoğun an ve bitiş anıdır (Kahneman & Fredrickson). Çıkışı tasarlamayan mağaza, hatırlanma şansını harcar.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.5, ls: 16 });
  s.addNotes("Çıkış anının önemi bu dersin sık tekrarlanan vurgularından biri olacak.");
}

{
  const s = slide("III · DENEYİM", "Temas noktalarının yedi türü");
  text(s, "Müşteri mağazayla tek bir biçimde temas etmez. Perakende deneyimi üzerine yapılan ölçümlerde temas noktaları yedi başlık altında toplanıyor (Stein & Ramaseshan, 2016). Bunlardan üçü doğrudan tasarımın konusudur; kalan dördü tasarımın barındırmak zorunda olduğu şeylerdir.",
       { one: true, y: 1.7, h: 0.96, size: 14 });

  const tp = [
    ["Atmosferik", "ışık, ses, koku, malzeme, sıcaklık", 1],
    ["Teknolojik", "ekran, uygulama, kiosk, ödeme", 1],
    ["İletişimsel", "tabela, etiket, yönlendirme, fiyat", 1],
    ["Süreçle ilgili", "sıra, bekleme, kasa, iade akışı", 0],
    ["Çalışan–müşteri", "karşılama, danışma, birebir ilgi", 0],
    ["Müşteri–müşteri", "kalabalık, mahremiyet, başkasının bakışı", 0],
    ["Ürünle etkileşim", "dokunma, deneme, tartma, koklama", 0]
  ];
  const tw = 2.62, tg = 0.38, y0 = 2.72, th = 1.05;
  tp.forEach((t, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = M + col * (tw + tg);
    const y = y0 + row * (th + 0.42);
    zone(s, x, y, tw, th, "", t[2] ? 1 : 0);
    s.addText(t[0], { x: x + 0.18, y: y + 0.16, w: tw - 0.36, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: t[2] ? ACC : INK });
    s.addText(t[1], { x: x + 0.18, y: y + 0.48, w: tw - 0.36, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: t[2] ? ACC : MUTED, lineSpacing: 12.5 });
  });
  cap(s, 9.85, y0 + th + 0.42 + 0.3, 2.6, "İlk üçü tasarımcının\ndoğrudan kurduğu\ntemas noktalarıdır.",
      { size: 11, face: H, italic: true, col: ACC, ls: 15, h: 0.8 });
  dline(s, 9.6, y0 + th + 0.42, 9.6, y0 + th + 0.42 + th, { col: HAIR, w: 0.75 });
  cap(s, M, 6.15, 11.4, "Ölçümler, atmosferik ve çalışan temas noktalarının marka sadakatine en güçlü katkıyı yaptığını gösteriyor (Stein & Ramaseshan, 2016).",
      { size: 12, face: H, col: BODY, h: 0.45, ls: 16 });
  s.addNotes("Müşteri–müşteri teması çoğu öğrencinin atladığı başlık: kalabalık ve mahremiyet bir tasarım konusudur.");
}

{
  const s = slide("III · DENEYİM", "Müşteri yolculuğu haritası");
  text(s, "Yolculuk haritası, müşterinin markayla karşılaşmasını sıralı anlara böler. Her an için üç şey yazılır: müşteri ne yapıyor, ne hissediyor, hangi temas noktasıyla karşılaşıyor. Aşağıdaki sekiz andan altısı doğrudan mekânda geçer.",
       { one: true, y: 1.7, h: 0.72, size: 14 });

  const moments = [
    ["Duyma", 0], ["Yola çıkma", 0], ["Bulma", 1], ["Eşik", 1],
    ["Gezinme", 1], ["Deneme", 1], ["Satın alma", 1], ["Ayrılma", 1]
  ];
  const mx0 = 1.25, mx1 = 12.1;
  const sp = (mx1 - mx0) / (moments.length - 1);
  dline(s, mx0 - 0.35, 3.35, mx1 + 0.3, 3.35, { col: HAIR, w: 1 });
  moments.forEach((m, i) => {
    const x = mx0 + i * sp;
    dot(s, x, 3.35, { d: m[1] ? 0.2 : 0.14, col: m[1] ? ACC : DIMW });
    s.addText(m[0], { x: x - 0.78, y: 2.98, w: 1.56, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, bold: true, color: m[1] ? ACC : MUTED, align: "center" });
    if (m[1]) dline(s, x, 3.47, x, 3.75, { col: ACC, w: 1 });
  });
  cap(s, mx0 - 0.4, 3.62, 2.2, "mekân dışında", { size: 9, col: FAINT, italic: true });
  dline(s, 3.2, 2.85, 3.2, 3.95, { col: MUTED, w: 0.75, dash: "dash" });
  cap(s, 3.35, 3.92, 4.0, "buradan sonrası iç mimarlığın alanı", { size: 9.5, col: ACC, italic: true });

  const q = [
    ["NE YAPIYOR", "Gözlemlenebilen davranış: duruyor, dokunuyor, soruyor, geri dönüyor."],
    ["NE HİSSEDİYOR", "Merak, tereddüt, sıkılma, güven, aceleyle çıkma isteği."],
    ["NEYLE KARŞILAŞIYOR", "O anda devrede olan temas noktası: vitrin, tabela, çalışan, kasa."]
  ];
  const qw = 3.6, qg = 0.42, qy = 4.55;
  q.forEach((it, i) => {
    const x = M + i * (qw + qg);
    dline(s, x, qy, x + qw, qy, { col: ACC, w: 1.25 });
    s.addText(it[0], { x: x, y: qy + 0.1, w: qw, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 1.5 });
    s.addText(it[1], { x: x, y: qy + 0.4, w: qw, h: 0.85, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12.5, color: BODY, lineSpacing: 16.5 });
  });
  cap(s, M, 6.1, 11.4, "Haritanın işe yaraması için her sütunun gözleme dayanması gerekir; hayal edilen bir yolculuk mekânı da hayalî kılar.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("İkinci hafta alan ziyaretinde öğrenciler kendi markalarına benzer bir mağazada bu haritayı dolduracak.");
}

{
  const s = slide("III · DENEYİM", "Persona: demografi değil davranış");
  text(s, "Persona, hedef kitleyi tek bir kurgusal kişide somutlaştırma aracıdır. En sık yapılan hata onu demografik bir künyeye indirgemektir; yaş ve gelir bir mekân kararı üretmez. İşe yarayan persona, kişinin ne yaptığını anlatır.",
       { one: true, y: 1.7, h: 0.72, size: 14 });

  zone(s, M, 2.65, 5.5, 3.25, "", 0);
  cap(s, M + 0.24, 2.85, 5.0, "İŞE YARAMAYAN", { size: 9.5, bold: true, col: MUTED, charSpacing: 1.6 });
  const bad = ["28 yaşında", "Üniversite mezunu", "Orta-üst gelir grubu", "Sosyal medyayı aktif kullanıyor", "Kaliteye önem veriyor"];
  bad.forEach((b, i) => {
    s.addText("·  " + b, { x: M + 0.24, y: 3.22 + i * 0.44, w: 5.0, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12, color: FAINT });
  });
  cap(s, M + 0.24, 5.5, 5.0, "Hiçbiri bir rafın yüksekliğini,\nbir koridorun genişliğini değiştirmez.",
      { size: 10.5, col: MUTED, italic: true, ls: 13.5, h: 0.5 });

  zone(s, C2, 2.65, 5.5, 3.25, "", 1);
  cap(s, C2 + 0.24, 2.85, 5.0, "İŞE YARAYAN", { size: 9.5, bold: true, col: ACC, charSpacing: 1.6 });
  const good = ["İşten çıkınca uğruyor, on dakikası var",
                "Ürünü eline almadan karar vermiyor",
                "Soru sormayı sevmiyor, etiketten okuyor",
                "Yanında çocuk ya da poşetle geliyor",
                "Aynı ürünü ikinci kez almaya geliyor"];
  good.forEach((b, i) => {
    s.addText("·  " + b, { x: C2 + 0.24, y: 3.22 + i * 0.44, w: 5.0, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12, color: BODY });
  });
  cap(s, C2 + 0.24, 5.5, 5.0, "Her biri bir mekânsal karara çevrilebilir:\nsüre, erişim, etiket, alan, tekrar.",
      { size: 10.5, col: ACC, italic: true, ls: 13.5, h: 0.5 });

  cap(s, M, 6.2, 11.4, "Kural: bir persona maddesi bir tasarım kararını değiştirmiyorsa, o madde personaya ait değildir.",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Öğrenciden persona isterken bu kuralı tekrarlayın; aksi hâlde stok fotoğraflı künyeler gelir.");
}

{
  const s = slide("III · DENEYİM", "Üç araştırma yöntemi");
  text(s, "Deneyim araştırması anket doldurtmak değildir; gözleme dayanır. Hizmet tasarımı literatüründe bu iş için üç temel yöntem kullanılır (Stickdorn vd., 2018). Üçü de bir öğrencinin tek başına, bir hafta içinde uygulayabileceği yöntemlerdir.",
       { one: true, y: 1.7, h: 0.96, size: 14 });

  const mets = [
    ["Hizmet safarisi", "service safari",
     "Araştırmacı müşteri gibi davranır: mağazaya gider, alışverişi baştan sona yaşar, her adımda ne hissettiğini not eder.",
     "ne zaman: kendi markanıza\nbenzer bir mağazada"],
    ["Yerinde gözlem", "mobile ethnography",
     "Mağazada durup insanları izler; nereye baktıklarını, nerede durakladıklarını, neye dokunduklarını kaydeder.",
     "ne zaman: yoğun ve\nsakin iki farklı saatte"],
    ["Bağlamsal görüşme", "contextual interview",
     "Müşteriyle ya da marka sahibiyle mağazanın içinde konuşulur; sorular yaşanan ana bağlı olduğu için cevaplar somuttur.",
     "ne zaman: alışveriş\nbiter bitmez"]
  ];
  const mw = 3.6, mg = 0.42, my = 2.7, mh = 2.6;
  mets.forEach((m, i) => {
    const x = M + i * (mw + mg);
    zone(s, x, my, mw, mh, "", i === 1 ? 1 : 0);
    dot(s, x + 0.42, my + 0.42, { t: String(i + 1), d: 0.3, col: i === 1 ? ACC : INK });
    s.addText(m[0], { x: x + 0.22, y: my + 0.72, w: mw - 0.44, h: 0.32, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15.5, bold: true, color: i === 1 ? ACC : INK });
    s.addText(m[1], { x: x + 0.22, y: my + 1.04, w: mw - 0.44, h: 0.24, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, color: FAINT, italic: true });
    s.addText(m[2], { x: x + 0.22, y: my + 1.34, w: mw - 0.44, h: 0.85, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
    s.addText(m[3], { x: x + 0.22, y: my + 2.18, w: mw - 0.44, h: 0.36, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, color: i === 1 ? ACC : MUTED, lineSpacing: 11.5 });
  });
  cap(s, M, 5.55, 11.4, "Üçü birlikte kullanıldığında birbirini doğrular: safari neyi hissettiğinizi, gözlem insanların gerçekte ne yaptığını, görüşme ise nedenini verir.",
      { size: 12.5, face: H, col: BODY, h: 0.45, ls: 17 });
  cap(s, M, 6.15, 11.4, "Her yöntemin çıktısı yazıya ve fotoğrafa dökülmeli; hatırlanan gözlem, gözlem sayılmaz.",
      { size: 12, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("İkinci hafta alan ziyaretinde en az iki yöntemi uygulamalarını isteyin.");
}

{
  const s = slide("III · DENEYİM", "Hangi yöntem, yolculuğun hangi anında?");
  text(s, "Yöntemler yolculuğun her anında aynı şeyi vermez. Aşağıdaki şema, hangi anı anlamak için hangi yöntemin işe yaradığını gösteriyor.",
       { one: true, y: 1.7, h: 0.68, size: 14 });

  const mm = ["Bulma", "Eşik", "Gezinme", "Deneme", "Satın alma", "Ayrılma"];
  const ax0 = 3.55, ax1 = 12.05;
  const sp = (ax1 - ax0) / (mm.length - 1);
  mm.forEach((m, i) => {
    const x = ax0 + i * sp;
    s.addText(m, { x: x - 0.72, y: 2.5, w: 1.44, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, bold: true, color: MUTED, align: "center" });
    dline(s, x, 2.86, x, 5.05, { col: "EDEDF0", w: 0.75 });
  });
  dline(s, ax0 - 0.35, 2.86, ax1 + 0.3, 2.86, { col: HAIR, w: 1 });

  const rows = [
    ["Hizmet safarisi", [0, 5], "yolculuğun tamamını kendi üzerinizde yaşarsınız"],
    ["Yerinde gözlem", [1, 3], "eşikte duraklama, gezinme rotası, dokunma anı"],
    ["Bağlamsal görüşme", [3, 5], "denemeden sonra verilen karar ve çıkış izlenimi"]
  ];
  let ry = 3.25;
  rows.forEach(r => {
    s.addText(r[0], { x: M, y: ry - 0.04, w: 2.5, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: ACC });
    const dx = r[1].map(i => ax0 + i * sp);
    dline(s, dx[0], ry + 0.12, dx[1], ry + 0.12, { col: ACC, w: 1.75 });
    dx.forEach(x => dot(s, x, ry + 0.12, { d: 0.17, col: ACC }));
    s.addText(r[2], { x: M, y: ry + 0.3, w: 2.6, h: 0.42, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, color: MUTED, lineSpacing: 11 });
    ry += 0.62;
  });

  cap(s, M, 5.3, 11.4, "ARAŞTIRMANIN ÇIKTISI", { size: 9, bold: true, col: FAINT, charSpacing: 1.6 });
  const outs = [
    ["Yolculuk haritası", "sekiz an, her an için üç satır"],
    ["Persona", "davranışla tarif edilmiş tek kişi"],
    ["Sorun listesi", "gözlemlenen tereddüt ve tıkanma anları"]
  ];
  outs.forEach((o, i) => {
    const x = M + i * 3.95;
    dot(s, x + 0.09, 5.78, { d: 0.11, col: ACC });
    s.addText(o[0], { x: x + 0.32, y: 5.63, w: 3.5, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, bold: true, color: INK });
    s.addText(o[1], { x: x + 0.32, y: 5.95, w: 3.5, h: 0.4, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13 });
  });
  s.addNotes("Sorun listesi en değerli çıktı: tasarım problemi oradan çıkar.");
}

/* =========================================================
   IV · İKİSİNİ BİRLEŞTİRMEK
   ========================================================= */
opener("IV", "İkisini birleştirmek", "Marka ne diyor, müşteri ne yapıyor — tasarım kararı ikisinin kesiştiği yerde doğar.");

{
  const s = slide("IV · ÇEVİRİ", "Çeviri zinciri");
  text(s, "Bir tasarım kararının savunulabilir olması, nereden geldiğinin gösterilebilmesine bağlıdır. Aşağıdaki zincir, marka anahtarındaki bir bileşenin hangi basamaklardan geçerek çizilebilir bir karara dönüştüğünü gösterir. Zincirin bir halkası atlandığında karar dayanaksız kalır.",
       { one: true, y: 1.7, h: 0.96, size: 14 });

  const chain = [
    ["Bileşen", "Marka anahtarından\nbir başlık", "Değerler: öğretmeyi seviyor"],
    ["Anahtar\nkelime", "Bileşeni tek sıfata\nindirge", "Şeffaflık"],
    ["Yolculuk anı", "Bu kelime hangi anda\nsınanıyor?", "Gezinme ve bekleme anı"],
    ["Mekânsal\nkarar", "O anı kuran somut\ntasarım kararı", "Kavurma makinesi satış\nalanına bakıyor"]
  ];
  const cw = 2.65, cg = 0.35, cy = 2.75, ch = 1.55;
  chain.forEach((c, i) => {
    const x = M + i * (cw + cg);
    zone(s, x, cy, cw, ch, "", i === 3 ? 1 : 0);
    s.addText(c[0], { x: x + 0.18, y: cy + 0.18, w: cw - 0.36, h: 0.62, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: i === 3 ? ACC : INK, lineSpacing: 18 });
    s.addText(c[1], { x: x + 0.18, y: cy + 0.82, w: cw - 0.36, h: 0.6, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: MUTED, lineSpacing: 12.5 });
    if (i < 3) arrow(s, x + cw + 0.05, cy + ch / 2, x + cw + cg - 0.05, cy + ch / 2, { col: ACC, w: 1.5 });
  });
  cap(s, M, cy + ch + 0.25, 2.3, "ÖRNEK", { size: 8.5, bold: true, col: FAINT, charSpacing: 1.5 });
  chain.forEach((c, i) => {
    const x = M + i * (cw + cg);
    s.addText(c[2], { x: x + 0.02, y: cy + ch + 0.5, w: cw - 0.04, h: 0.62, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 12, italic: true, color: i === 3 ? ACC : BODY, lineSpacing: 15 });
  });

  dline(s, M, 5.5, 12.48, 5.5, { col: HAIR, w: 0.75 });
  cap(s, M, 5.68, 11.4, "Aynı zincir müşteri tarafından da kurulur: gözlenen bir davranış → o davranışın yarattığı ihtiyaç → mekânsal karar. İki zincir aynı kararda buluşmuyorsa, ya marka ya müşteri yanlış okunmuştur.",
      { size: 12.5, face: H, col: BODY, h: 0.6, ls: 17 });
  s.addNotes("Konsept jürisinde her öğrenciden en az üç zincir isteyin.");
}

{
  const s = slide("IV · ÇEVİRİ", "Anahtar kelime nasıl seçilir?");
  text(s, "Anahtar kelime, markayı tarif eden onlarca sıfatın içinden ayakta kalanıdır. Seçim rastgele değildir; üç elemeden geçer. Sonunda elde üç kelime kalmalıdır — daha fazlası tasarımı dağıtır, daha azı yönlendirmez.",
       { one: true, y: 1.7, h: 0.72, size: 14 });

  const levels = [
    [10.6, "Markayla ilgili bütün sıfatlar", "araştırmadan çıkan ham liste, 20–30 kelime"],
    [7.8, "Rakiplerin söyleyemeyecekleri", "herkesin söylediği sıfatlar elenir"],
    [5.0, "Mekânda karşılığı olanlar", "bir ölçüye, malzemeye, ilişkiye çevrilebilenler kalır"],
    [4.4, "ÜÇ ANAHTAR KELİME", "tasarımın her kararını sınayan üç sıfat"]
  ];
  let y = 2.6;
  levels.forEach((l, i) => {
    const w = l[0], x = M + (11.63 - w) / 2;
    const hi = i === 3;
    zone(s, x, y, w, 0.66, "", hi ? 1 : 0);
    s.addText(l[1], { x: x + 0.2, y: y + 0.08, w: w - 0.4, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: hi ? 16 : 14, bold: true, color: hi ? ACC : INK, align: "center" });
    s.addText(l[2], { x: x + 0.2, y: y + 0.38, w: w - 0.4, h: 0.26, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: hi ? ACC : MUTED, align: "center" });
    if (i < 3) {
      const nx = M + (11.63 - levels[i + 1][0]) / 2 + levels[i + 1][0] / 2;
      arrow(s, 6.665, y + 0.7, 6.665, y + 0.95, { col: ACC, w: 1.5 });
    }
    y += 1.0;
  });
  cap(s, M, 6.3, 11.4, "Eleme ölçütü hep aynıdır: bu kelime bir mekânsal kararı değiştiriyor mu?",
      { size: 13, face: H, italic: true, col: ACC, h: 0.4, align: "center" });
  s.addNotes("Huninin genişlikleri kasıtlı: ham listenin uzun olması iyidir, eleme sert olmalıdır.");
}

{
  const s = slide("IV · ÇEVİRİ", "Kaçınılması gereken kelimeler");
  text(s, "Öğrenci paftalarında en sık görülen anahtar kelimeler, hiçbir markayı diğerinden ayırmayan kelimelerdir. Bir sıfatın anahtar kelime sayılabilmesi için basit bir sınav vardır: zıttını bir marka isteyebilir mi?",
       { one: true, y: 1.7, h: 0.72, size: 14 });

  cap(s, M, 2.62, 5.5, "SINAVDA KALANLAR", { size: 9.5, bold: true, col: MUTED, charSpacing: 1.6 });
  const fail = [
    ["Kaliteli", "hiçbir marka kalitesiz olmak istemez"],
    ["Modern", "hangi modernlik? tarih mi, tavır mı?"],
    ["Özel", "kime göre, neye göre özel?"],
    ["Şık", "ölçüye çevrilemez"],
    ["Müşteri odaklı", "bir mekân kararı üretmez"]
  ];
  fail.forEach((f, i) => {
    const y = 2.98 + i * 0.6;
    s.addText(f[0], { x: M, y: y, w: 2.1, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14.5, color: FAINT, strike: true });
    s.addText(f[1], { x: M + 2.15, y: y + 0.03, w: 3.35, h: 0.45, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: FAINT, lineSpacing: 12.5 });
  });

  cap(s, C2, 2.62, 5.5, "SINAVI GEÇENLER", { size: 9.5, bold: true, col: ACC, charSpacing: 1.6 });
  const pass = [
    ["Ham", "zıttı işlenmiş — ikisi de tercih edilebilir"],
    ["Yavaş", "zıttı hızlı — dolaşımı doğrudan etkiler"],
    ["Yoğun", "zıttı seyrek — teşhir sıklığını belirler"],
    ["Gizli", "zıttı açık — görüş hatlarını kurar"],
    ["Törensel", "zıttı gündelik — kasa ve paketlemeyi değiştirir"]
  ];
  pass.forEach((f, i) => {
    const y = 2.98 + i * 0.6;
    s.addText(f[0], { x: C2, y: y, w: 1.65, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14.5, bold: true, color: ACC });
    s.addText(f[1], { x: C2 + 1.7, y: y + 0.03, w: 3.8, h: 0.45, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, color: BODY, lineSpacing: 12.5 });
  });
  dline(s, 6.55, 2.6, 6.55, 6.05, { col: HAIR, w: 0.75 });

  zone(s, M, 6.15, 11.63, 0.62, "", 1);
  s.addText("SINAV:  Bu sıfatın zıttını bilinçli olarak seçen bir marka olabilir mi?  Olamıyorsa, o sıfat anahtar kelime değildir.",
    { x: M + 0.25, y: 6.24, w: 11.1, h: 0.45, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14, bold: true, color: ACC });
  s.addNotes("Bu sınavı öğrenciler birbirine uygulasın; kritik süresini çok kısaltır.");
}

/* =========================================================
   V · BUGÜN VE BU HAFTA
   ========================================================= */
opener("V", "Bugün ve bu hafta", "Öğrendiğimiz araçları aynı gün içinde bir mağaza üzerinde deneyeceğiz.");

{
  const s = slide("V · BUGÜN", "Günün akışı");
  text(s, "Kalan saatlerde iki çalışma yapacağız: önce herkes tek başına bir mağaza görselini okuyacak, sonra aynı görseli okuyanlar bir araya gelip farklarını karşılaştıracak.",
       { one: true, y: 1.7, h: 0.6, size: 14 });

  const hours = [
    ["1. saat", "Proje brifi", "Ders akışı, teslim takvimi, değerlendirme"],
    ["2–3. saat", "Bu sunum", "Marka anahtarı ve deneyim araştırması"],
    ["4. saat", "Mağaza okuma", "Bireysel analiz kâğıdı — dört görselden biri"],
    ["5. saat", "Grup oluşturma", "Aynı görseli okuyanlar bir araya gelir"],
    ["6–7. saat", "Grup çalışması", "Farkların karşılaştırılması, ortak sunum"],
    ["8. saat", "Ödevin verilmesi", "Üç aday marka ve araştırma paftası"]
  ];
  let y = 2.55;
  dline(s, M, 2.5, 12.48, 2.5, { col: HAIR, w: 1 });
  hours.forEach((h, i) => {
    const hi = i >= 2 && i <= 4;
    s.addText(h[0], { x: M, y: y + 0.04, w: 1.5, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, bold: true, color: hi ? ACC : MUTED, charSpacing: 0.8 });
    dot(s, 2.6, y + 0.17, { d: hi ? 0.16 : 0.11, col: hi ? ACC : DIMW });
    s.addText(h[1], { x: 2.95, y: y, w: 3.2, h: 0.32, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: hi ? ACC : INK });
    s.addText(h[2], { x: 6.35, y: y + 0.04, w: 6.1, h: 0.32, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: hi ? BODY : MUTED });
    y += 0.62;
    if (i < hours.length - 1) dline(s, M, y - 0.13, 12.48, y - 0.13, { col: "EFEFF2", w: 0.5 });
  });
  dline(s, 2.6, 2.72, 2.6, y - 0.45, { col: HAIR, w: 0.75 });
  cap(s, M, 6.4, 11.4, "Öğle arası ve kısa molalar bu akışın içinde; saatler kesin değil, sıra kesindir.",
      { size: 11.5, face: H, italic: true, col: FAINT, h: 0.35 });
  s.addNotes("Gruplar oluşurken masaları yeniden dizmek için on dakika ayırın.");
}

{
  const s = slide("V · BUGÜN", "Birinci çalışma: bir mağazayı okumak");
  text(s, "Her birinize bir mağaza görseli verilecek. Göreviniz o mağazayı altı başlık altında okumak ve sonunda üç anahtar kelime çıkarmak. Markayı tanımıyorsunuz; yalnızca gördüğünüzden hareket edeceksiniz. Amaç doğru cevabı bulmak değil, gördüğünüzü gerekçelendirebilmek.",
       { one: true, y: 1.7, h: 0.96, size: 14 });

  const six = [
    ["Marka", "Bu mekân hangi markayı anlatıyor? Nasıl bir tavrı var?"],
    ["Kullanıcı", "Burada kim rahat eder, kim etmez?"],
    ["Ürün", "Ne satılıyor; ürün nasıl korunuyor, nasıl sunuluyor?"],
    ["Davranış", "Müşteri burada ne yapıyor: bakıyor, dokunuyor, bekliyor?"],
    ["Duyular", "Hangi duyulara sesleniyor; hangileri sessiz bırakılmış?"],
    ["Atmosfer", "Işık, renk, malzeme, yoğunluk nasıl bir his kuruyor?"]
  ];
  const sw = 3.6, sg = 0.42, sy = 2.72, sh = 1.12;
  six.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (sw + sg), y = sy + row * (sh + 0.32);
    zone(s, x, y, sw, sh, "", 0);
    dot(s, x + 0.34, y + 0.34, { t: String(i + 1), d: 0.28, col: ACC });
    s.addText(it[0], { x: x + 0.72, y: y + 0.2, w: sw - 0.94, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: INK });
    s.addText(it[1], { x: x + 0.24, y: y + 0.58, w: sw - 0.48, h: 0.46, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: MUTED, lineSpacing: 13 });
  });

  zone(s, M, 5.75, 11.63, 0.8, "", 1);
  s.addText("ÇIKTI", { x: M + 0.25, y: 5.88, w: 0.8, h: 0.28, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, bold: true, color: ACC, charSpacing: 1.4 });
  s.addText("Üç anahtar kelime — ve her kelimenin yanında görselde onu gösteren kanıt.",
    { x: M + 1.1, y: 5.9, w: 10.2, h: 0.5, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15, bold: true, color: ACC });
  cap(s, M, 6.65, 11.4, "Süre: 45 dakika · Bireysel · Kâğıt dağıtılacak",
      { size: 11, col: FAINT, charSpacing: 0.6 });
  s.addNotes("Kanıt zorunluluğunu vurgulayın: kelime tek başına değersiz, kanıtla birlikte değerli.");
}

{
  const s = slide("V · BUGÜN", "İkinci çalışma: aynı mağaza, farklı okumalar");
  text(s, "Aynı görseli okuyanlar bir grup olacak. Karşılaştırdığınızda üç kelimelerin tutmadığını göreceksiniz — bu bir hata değil, çalışmanın asıl konusu. Aynı mekânın farklı okunması, mekânın hangi mesajı net verdiğini ve hangisini veremediğini gösterir.",
       { one: true, y: 1.7, h: 0.96, size: 14 });

  const tasks = [
    ["Ortak olanı bulun", "Grubun çoğunun yazdığı kelimeler mekânın net söylediği şeydir.",
     "bunlar markanın güçlü sinyalleri"],
    ["Ayrışanı tartışın", "Yalnız bir kişinin gördüğü şey ya derin bir okuma ya da bir yanlış anlamadır; hangisi olduğuna kanıta bakarak karar verin.",
     "burada mekân belirsiz kalmış"],
    ["Eksiği adlandırın", "Hiç kimsenin yazmadığı ama mekânda olması gereken bir şey var mı?",
     "tasarım fırsatı burada"]
  ];
  const tw = 3.6, tg = 0.42, ty = 2.72, th = 2.35;
  tasks.forEach((t, i) => {
    const x = M + i * (tw + tg);
    zone(s, x, ty, tw, th, "", i === 2 ? 1 : 0);
    dot(s, x + 0.4, ty + 0.4, { t: String(i + 1), d: 0.3, col: i === 2 ? ACC : INK });
    s.addText(t[0], { x: x + 0.22, y: ty + 0.7, w: tw - 0.44, h: 0.32, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 15.5, bold: true, color: i === 2 ? ACC : INK });
    s.addText(t[1], { x: x + 0.22, y: ty + 1.06, w: tw - 0.44, h: 0.9, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
    s.addText(t[2], { x: x + 0.22, y: ty + 1.96, w: tw - 0.44, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, color: i === 2 ? ACC : MUTED, italic: true });
  });

  cap(s, M, 5.35, 11.4, "GRUP ÇIKTISI", { size: 9, bold: true, col: FAINT, charSpacing: 1.6 });
  cap(s, M, 5.62, 11.4, "Tek bir A3 sayfa: ortak kelimeler, ayrışan kelimeler ve grubun ortak cümlesi — \"Bu mağaza şunu söylüyor ama şunu söyleyemiyor.\" Her grup beş dakikada anlatacak.",
      { size: 13, face: H, col: BODY, h: 0.7, ls: 18 });
  cap(s, M, 6.45, 11.4, "Süre: 60 dakika çalışma + 30 dakika sunum · 4–5 kişilik gruplar",
      { size: 11, col: FAINT, charSpacing: 0.6 });
  s.addNotes("Uzlaşma istemeyin. Anlaşmazlığın kendisi veri: mekânın belirsiz kaldığı yeri gösteriyor.");
}

{
  const s = slide("V · ÖDEV", "Haftaya: üç aday marka");
  text(s, "Önümüzdeki hafta için üç aday marka bulup her biri için bir araştırma paftası hazırlayacaksınız. Üçünü de araştıracaksınız; hangisiyle devam edeceğinize kritikte birlikte karar vereceğiz. Bu yüzden üçü de gerçekten araştırılmış olmalı.",
       { one: true, y: 1.7, h: 0.96, size: 14 });

  cap(s, M, 2.78, 5.5, "MARKA NASIL OLMALI", { size: 9.5, bold: true, col: ACC, charSpacing: 1.6 });
  const yes = [
    "Küçük ve yerel — tercihen tek dükkânlı ya da hiç dükkânı olmayan",
    "Yerleşik bir tasarım dili olmayan; mağazası varsa da kimliksiz",
    "Ürünü somut ve elle tutulur — depolama ve teşhir sorunu olan",
    "Ulaşabileceğiniz bir sahibi ya da çalışanı olan",
    "Hakkında konuşulacak bir hikâyesi bulunan"
  ];
  yes.forEach((t, i) => {
    dot(s, M + 0.09, 3.26 + i * 0.6, { d: 0.11, col: ACC });
    s.addText(t, { x: M + 0.32, y: 3.12 + i * 0.6, w: CW - 0.32, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: BODY, lineSpacing: 14.5 });
  });

  cap(s, C2, 2.78, 5.5, "MARKA NASIL OLMAMALI", { size: 9.5, bold: true, col: MUTED, charSpacing: 1.6 });
  const no = [
    "Tasarım dili zaten belirlenmiş büyük markalar",
    "Yalnızca hizmet satan, ürünü olmayan işler",
    "Hakkında yalnızca internetten bilgi bulabileceğiniz markalar",
    "Kendi hayalinizde kurduğunuz, var olmayan markalar",
    "Geçen dönem başka bir derste çalıştığınız markalar"
  ];
  no.forEach((t, i) => {
    s.addText("—", { x: C2, y: 3.12 + i * 0.6, w: 0.28, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 12, color: FAINT });
    s.addText(t, { x: C2 + 0.32, y: 3.12 + i * 0.6, w: CW - 0.32, h: 0.5, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11.5, color: FAINT, lineSpacing: 14.5 });
  });
  dline(s, 6.55, 2.76, 6.55, 6.1, { col: HAIR, w: 0.75 });

  cap(s, M, 6.25, 11.4, "En iyi adaylar çoğu zaman tanıdığınız birinin işidir: bir üretici, bir atölye, bir aile dükkânı.",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Mersin ve Çukurova'ya özgü kategorileri hatırlatın: narenciye, baharat, deniz malzemesi, tekstil atölyeleri.");
}

{
  const s = slide("V · ÖDEV", "Araştırma paftasının içeriği");
  text(s, "Her marka için A4 dikey bir pafta hazırlayacaksınız. Pafta yedi bölümden oluşuyor; ilk dördü araştırma, son üçü ise araştırmanın mekâna çevrilmesi. Son iki bölüm doldurulmadan pafta tamamlanmış sayılmaz.",
       { one: true, y: 1.7, h: 0.78, size: 14 });

  const parts = [
    ["1", "Marka künyesi", "adı, yeri, kuruluş, sahibi, nasıl satıyor"],
    ["2", "Ürün", "ne satılıyor, kaç çeşit, ölçüleri, kırılgan mı"],
    ["3", "Ürünle ilişki ve depolama", "müşteri ürünle ne yapıyor, stok nasıl duruyor"],
    ["4", "Kullanıcı", "kim geliyor, ne yapıyor, neden rahatsız oluyor"],
    ["5", "Marka dili ve anahtar kelimeler", "üç kelime ve her birinin kanıtı"],
    ["6", "Mekânsal karşılık", "her kelimenin karşılığı bir ilke ve bir öğe"],
    ["7", "Uygunluk değerlendirmesi", "bu marka proje için neden uygun"]
  ];
  let y = 2.62;
  parts.forEach((pt, i) => {
    const res = i >= 4;
    dot(s, M + 0.14, y + 0.17, { t: pt[0], d: 0.28, col: res ? ACC : INK });
    s.addText(pt[1], { x: M + 0.48, y: y, w: 3.85, h: 0.32, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 14.5, bold: true, color: res ? ACC : INK });
    s.addText(pt[2], { x: 5.4, y: y + 0.04, w: 5.4, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: MUTED });
    y += 0.56;
  });
  dline(s, 11.1, 2.62, 11.1, 2.62 + 4 * 0.56 - 0.12, { col: HAIR, w: 1 });
  cap(s, 11.25, 3.1, 1.3, "ARAŞTIRMA", { size: 8.5, bold: true, col: MUTED, charSpacing: 1.3 });
  dline(s, 11.1, 2.62 + 4 * 0.56, 11.1, 2.62 + 7 * 0.56 - 0.12, { col: ACC, w: 1.25 });
  cap(s, 11.25, 5.35, 1.6, "ÇEVİRİ", { size: 8.5, bold: true, col: ACC, charSpacing: 1.3 });

  dline(s, M, 6.1, 12.48, 6.1, { col: HAIR, w: 0.75 });
  cap(s, M, 6.25, 11.4, "Teslim: üç pafta, A4 dikey, çıktı olarak. Fotoğraf ve el çizimi serbest; kopyala-yapıştır marka metni kabul edilmez.",
      { size: 12.5, face: H, col: BODY, h: 0.45 });
  s.addNotes("Paftanın boş şablonu ders sonunda dağıtılacak.");
}

{
  const s = slide("V · ÖNÜMÜZDEKİ HAFTALAR", "Sonraki üç hafta ne olacak");
  text(s, "Bugün öğrendiğiniz araçlar önümüzdeki haftalarda sırayla kullanılacak. Her hafta bir öncekinin üstüne biniyor; bir hafta eksik kalırsa sonraki hafta boşa gidiyor.",
       { one: true, y: 1.7, h: 0.6, size: 14 });

  const wk = [
    ["2. HAFTA", "Alan ziyareti ve marka seçimi",
     "Proje alanını yerinde göreceğiz. Aynı gün üç adaydan biri seçilecek ve o marka için deneyim araştırmasına başlanacak.",
     "yanınızda: üç pafta"],
    ["3. HAFTA", "Marka anahtarı ve persona",
     "Seçilen marka için sekiz başlıklı marka anahtarı doldurulacak; gözleme dayalı bir persona ve yolculuk haritası çıkarılacak.",
     "yanınızda: görüşme notları"],
    ["4. HAFTA", "Anahtar kelime ve konsept",
     "Üç anahtar kelime kesinleşecek ve her kelime için ilk mekânsal karşılıklar önerilecek. Konsept jürisine buradan gidilecek.",
     "yanınızda: çeviri zinciri"]
  ];
  const ww = 3.6, wg = 0.42, wy = 2.6, wh = 2.85;
  wk.forEach((w, i) => {
    const x = M + i * (ww + wg);
    zone(s, x, wy, ww, wh, "", i === 0 ? 1 : 0);
    s.addText(w[0], { x: x + 0.22, y: wy + 0.22, w: ww - 0.44, h: 0.28, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10, bold: true, color: i === 0 ? ACC : MUTED, charSpacing: 1.8 });
    s.addText(w[1], { x: x + 0.22, y: wy + 0.56, w: ww - 0.44, h: 0.62, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 16, bold: true, color: i === 0 ? ACC : INK, lineSpacing: 20 });
    s.addText(w[2], { x: x + 0.22, y: wy + 1.26, w: ww - 0.44, h: 1.15, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
    s.addText(w[3], { x: x + 0.22, y: wy + 2.42, w: ww - 0.44, h: 0.3, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9.5, color: i === 0 ? ACC : FAINT, italic: true });
    if (i < 2) arrow(s, x + ww + 0.08, wy + wh / 2, x + ww + wg - 0.08, wy + wh / 2, { col: HAIR, w: 1.25 });
  });
  cap(s, M, 5.75, 11.4, "Dördüncü haftanın sonunda elinizde savunulabilir bir konsept olacak: üç kelime, üç mekânsal ilke ve bunları doğuran araştırma.",
      { size: 13, face: H, col: BODY, h: 0.5, ls: 18 });
  cap(s, M, 6.45, 11.4, "Araştırma, tasarımın öncesinde yapılan bir ödev değil; tasarımın kendisinin başladığı yerdir.",
      { size: 12.5, face: H, italic: true, col: ACC, h: 0.4 });
  s.addNotes("Kapanış cümlesi bu: araştırma tasarımın kendisidir.");
}

/* ---- kaynakça ---- */
{
  const s = slide("KAYNAKÇA", "Okuma listesi");
  text(s, "Aşağıdaki kaynaklar sunumda geçen kavramların dayandığı çalışmalardır. İlk üçü bu haftanın ödevini yaparken doğrudan işinize yarayacak.",
       { one: true, y: 1.68, h: 0.7, size: 13.5 });

  const refs = [
    "Stickdorn, M., Hormess, M., Lawrence, A. & Schneider, J. (2018). This Is Service Design Doing. O'Reilly.",
    "Lemon, K. N. & Verhoef, P. C. (2016). Understanding Customer Experience Throughout the Customer Journey. Journal of Marketing, 80(6), 69–96.",
    "Stein, A. & Ramaseshan, B. (2016). Towards the Identification of Customer Experience Touch Point Elements. Journal of Retailing and Consumer Services, 30, 8–19.",
    "Wheeler, A. (2017). Designing Brand Identity (5. baskı). Wiley.",
    "Micheaux, A. & Bosio, B. (2019). Customer Journey Mapping as a New Way to Teach Data-Driven Marketing. Journal of Marketing Education, 41(2), 127–140.",
    "Kotler, P. (1973). Atmospherics as a Marketing Tool. Journal of Retailing, 49(4), 48–64.",
    "Lindström, M. (2005). Brand Sense: Sensory Secrets Behind the Stuff We Buy. Free Press.",
    "Kahneman, D. & Fredrickson, B. L. (1993). When More Pain Is Preferred to Less: Adding a Better End. Psychological Science, 4(6), 401–405.",
    "Bükülmez, S. vd. (2025). Mağaza tasarımı stüdyosunda öğrenci performansının modüler değerlendirilmesi.",
    "Xi, X. & Idris, M. Z. (2026). Omnichannel Fashion Retail Experience Design. (Baskıda.)"
  ];
  let y = 2.42;
  refs.forEach((r, i) => {
    const x = i < 5 ? M : C2;
    const yy = 2.42 + (i % 5) * 0.82;
    dline(s, x, yy, x + 0.18, yy, { col: ACC, w: 1 });
    s.addText(r, { x: x, y: yy + 0.08, w: CW, h: 0.72, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 13.5 });
  });
  cap(s, M, 6.7, 11.4, "Tam künyeler ve ek okumalar ders klasöründeki kaynakça belgesinde.",
      { size: 10.5, col: FAINT, italic: true });
}

/* ---- kapanış ---- */
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addText("Bir mağazayı tasarlamadan önce\niki şeyi bilmek gerekir:\nmarka ne söylüyor, müşteri ne yapıyor.", {
    x: M, y: 2.2, w: 11.4, h: 2.6, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 30, italic: true, color: "FFFFFF", lineSpacing: 46 });
  s.addShape(p.ShapeType.line, { x: M, y: 5.1, w: 2.6, h: 0, line: { color: ACC, width: 2 } });
  s.addText("Bugünün çalışması: mağaza okuma kâğıdı  ·  Haftaya: üç aday marka, üç pafta", {
    x: M, y: 5.35, w: 11.4, h: 0.4, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 13, color: DIMW });
}

p.writeFile({ fileName: "Gun1-Marka-Anahtari-ve-Musteri-Deneyimi.pptx" })
 .then(f => console.log("yazildi:", f, "| slayt:", n));
