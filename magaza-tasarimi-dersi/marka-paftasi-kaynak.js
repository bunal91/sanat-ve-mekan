const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "A4P", width: 8.27, height: 11.69 });
p.layout = "A4P";
p.title = "Marka araştırma paftası";

/* ---------------- palette (deck ile aynı) ---------------- */
const INK = "16161A", PAPER = "FCFCFA", BODY = "2B2B31";
const MUTED = "7A7A82", FAINT = "A6A6AC", ACC = "8C3A2B";
const ACCT = "F6EAE6", HAIR = "C9C9CF", RULE = "E4E4E8";
const H = "Cambria", S = "Calibri";

const M = 0.45, W = 7.37;                 // kenar boşluğu ve kullanılabilir genişlik

/* ---------------- yardımcılar ---------------- */
function line(s, x1, y, x2, col, wt) {
  s.addShape(p.ShapeType.line, { x: x1, y: y, w: x2 - x1, h: 0,
    line: { color: col || RULE, width: wt || 0.75 } });
}
function block(s, y, h, num, lab, hint) {
  s.addShape(p.ShapeType.rect, { x: M, y: y, w: W, h: h,
    fill: { type: "none" }, line: { color: HAIR, width: 0.9 } });
  s.addText(num, { x: M + 0.1, y: y + 0.06, w: 0.25, h: 0.22, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 11, bold: true, color: ACC });
  s.addText(lab, { x: M + 0.38, y: y + 0.08, w: 3.2, h: 0.2, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 8, bold: true, color: ACC, charSpacing: 1.3 });
  if (hint) s.addText(hint, { x: M + 3.5, y: y + 0.08, w: W - 3.6, h: 0.2, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 7, italic: true, color: MUTED, align: "right" });
}
function fieldLine(s, x, y, w, lab, labw) {
  const lw = labw || 0.95;
  s.addText(lab, { x: x, y: y - 0.005, w: lw, h: 0.18, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 7.5, color: MUTED });
  line(s, x + lw, y + 0.16, x + w, MUTED, 0.75);
}
function blank(s, x, y, w, n, gap) {
  const g = gap || 0.22;
  for (let i = 0; i < n; i++) line(s, x, y + i * g, x + w, RULE, 0.75);
}
function chk(s, x, y, lab) {
  s.addShape(p.ShapeType.rect, { x: x, y: y, w: 0.1, h: 0.1,
    fill: { type: "none" }, line: { color: MUTED, width: 0.75 } });
  s.addText(lab, { x: x + 0.15, y: y - 0.045, w: 0.055 * lab.length + 0.08, h: 0.19,
    isTextBox: true, margin: 0, fontFace: S, fontSize: 7.5, color: BODY });
  return x + 0.15 + 0.055 * lab.length + 0.16;
}
function chkRow(s, x, y, items, maxw) {
  let cx = x;
  items.forEach(t => {
    if (cx + 0.055 * t.length + 0.3 > x + maxw) { cx = x; y += 0.21; }
    cx = chk(s, cx, y, t);
  });
  return y;
}
function note(s, x, y, w, t, sz) {
  s.addText(t, { x: x, y: y, w: w, h: 0.32, isTextBox: true, margin: 0,
    fontFace: S, fontSize: sz || 7, italic: true, color: FAINT, lineSpacing: 9 });
}

/* ==========================================================
   SAYFA 1 — ARAŞTIRMA PAFTASI
   ========================================================== */
{
  const s = p.addSlide();
  s.background = { color: PAPER };

  /* başlık */
  s.addText("Marka araştırma paftası", { x: M, y: 0.34, w: 5.2, h: 0.36, isTextBox: true,
    margin: 0, fontFace: H, fontSize: 19, bold: true, color: INK });
  s.addText("Her aday marka için ayrı bir pafta. Üç pafta ile gelin.", {
    x: M, y: 0.70, w: 5.2, h: 0.2, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 8, color: MUTED });
  s.addText("ADAY", { x: 5.85, y: 0.36, w: 0.5, h: 0.18, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 7, bold: true, color: FAINT, charSpacing: 1.2 });
  ["1", "2", "3"].forEach((t, i) => {
    s.addShape(p.ShapeType.ellipse, { x: 6.35 + i * 0.35, y: 0.33, w: 0.24, h: 0.24,
      fill: { type: "none" }, line: { color: MUTED, width: 0.9 } });
    s.addText(t, { x: 6.35 + i * 0.35, y: 0.33, w: 0.24, h: 0.24, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 8, color: MUTED, align: "center", valign: "middle" });
  });
  fieldLine(s, 5.85, 0.70, 1.97, "AD SOYAD", 0.72);
  line(s, M, 1.12, M + W, INK, 1.1);

  /* 1 — MARKA KÜNYESİ */
  let y = 1.24, h = 1.0;
  block(s, y, h, "1", "MARKA KÜNYESİ");
  fieldLine(s, M + 0.12, y + 0.33, 3.5, "Marka adı", 0.62);
  fieldLine(s, M + 3.75, y + 0.33, 7.25, "Web / Instagram", 0.95);
  fieldLine(s, M + 0.12, y + 0.58, 2.1, "Kuruluş", 0.52);
  fieldLine(s, M + 2.35, y + 0.58, 4.3, "Ekip (tahmin)", 0.82);
  s.addText("Şu an nerede satıyor:", { x: M + 4.55, y: y + 0.575, w: 1.3, h: 0.18,
    isTextBox: true, margin: 0, fontFace: S, fontSize: 7.5, color: MUTED });
  chkRow(s, M + 0.12, y + 0.82, ["kendi sitesi", "Instagram", "pazaryeri", "tek fiziksel nokta", "başka mağazada köşe", "pazar / fuar"], W - 0.24);

  /* 2 — ÜRÜN */
  y = 2.32; h = 1.42;
  block(s, y, h, "2", "ÜRÜN", "bu ölçüler teşhir biriminin ölçüsünü belirleyecek");
  fieldLine(s, M + 0.12, y + 0.33, 7.25, "Ne satıyor", 0.68);
  fieldLine(s, M + 0.12, y + 0.58, 3.3, "Kaç farklı ürün", 1.0);
  fieldLine(s, M + 3.55, y + 0.58, 7.25, "Fiyat aralığı", 0.85);
  s.addText("ÖLÇÜ NOTU  —  ürünü gerçekten ölç ya da ambalajından tahmin et", {
    x: M + 0.12, y: y + 0.80, w: 5.4, h: 0.18, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 7, bold: true, color: FAINT, charSpacing: 0.8 });
  fieldLine(s, M + 0.12, y + 1.0, 2.05, "En büyük ürün", 0.85);
  fieldLine(s, M + 2.25, y + 1.0, 4.15, "En küçük", 0.62);
  fieldLine(s, M + 4.35, y + 1.0, 7.25, "En kırılgan / en ağır", 1.2);

  /* 3 — ÜRÜNLE İLİŞKİ VE DEPOLAMA */
  y = 3.82; h = 1.72;
  block(s, y, h, "3", "ÜRÜNLE İLİŞKİ VE DEPOLAMA");
  s.addText("Müşteri ürünle ne yapıyor?", { x: M + 0.12, y: y + 0.33, w: 2.2, h: 0.18,
    isTextBox: true, margin: 0, fontFace: S, fontSize: 7.5, bold: true, color: BODY });
  chkRow(s, M + 0.12, y + 0.56, ["dokunuyor", "deniyor", "kokluyor", "tadıyor", "ölçtürüyor", "sadece bakıyor"], 3.3);
  s.addText("Bu, mekânda neyi gerektiriyor?", { x: M + 0.12, y: y + 1.04, w: 2.4, h: 0.18,
    isTextBox: true, margin: 0, fontFace: S, fontSize: 7.5, italic: true, color: MUTED });
  blank(s, M + 0.12, y + 1.42, 3.4, 2, 0.2);

  line(s, M + 3.66, y + 0.3, M + 3.66, HAIR, 0.9);
  s.addShape(p.ShapeType.line, { x: M + 3.66, y: y + 0.3, w: 0, h: h - 0.42,
    line: { color: HAIR, width: 0.9 } });
  s.addText("Nasıl depolanır?", { x: M + 3.8, y: y + 0.33, w: 2.2, h: 0.18, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 7.5, bold: true, color: BODY });
  chkRow(s, M + 3.8, y + 0.56, ["raf", "askı", "kutu", "soğuk", "karanlık", "kuru", "dik", "yatay"], 3.3);
  s.addText("Stok devir hızı:", { x: M + 3.8, y: y + 1.04, w: 1.1, h: 0.18, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 7.5, color: MUTED });
  chkRow(s, M + 4.95, y + 1.08, ["hızlı", "orta", "yavaş"], 2.2);
  s.addText("Sezonluk mu:", { x: M + 3.8, y: y + 1.29, w: 1.0, h: 0.18, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 7.5, color: MUTED });
  chkRow(s, M + 4.95, y + 1.33, ["evet", "hayır"], 2.2);
  fieldLine(s, M + 3.8, y + 1.5, 7.25, "Depo, satış alanının yüzde kaçı olmalı", 2.3);

  /* 4 — KULLANICI */
  y = 5.62; h = 0.98;
  block(s, y, h, "4", "KULLANICI", "meslek ve yaş değil — davranış yaz");
  fieldLine(s, M + 0.12, y + 0.33, 7.25, "Kim alıyor", 0.68);
  fieldLine(s, M + 0.12, y + 0.58, 2.7, "Nereden duydu", 0.92);
  fieldLine(s, M + 2.95, y + 0.58, 4.95, "Yanında kim var", 1.0);
  fieldLine(s, M + 5.2, y + 0.58, 7.25, "Ne kadar zamanı var", 1.25);
  fieldLine(s, M + 0.12, y + 0.83, 7.25, "Nelerden rahatsız olur", 1.35);

  /* 5 — MARKA DİLİ VE ANAHTAR KELİMELER */
  y = 6.68; h = 1.62;
  block(s, y, h, "5", "MARKA DİLİ VE ANAHTAR KELİMELER");
  fieldLine(s, M + 0.12, y + 0.33, 4.6, "Üç sıfatla tarif et", 1.15);
  s.addText("Görsel kimliği:", { x: M + 4.85, y: y + 0.325, w: 1.0, h: 0.18, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 7.5, color: MUTED });
  chkRow(s, M + 5.85, y + 0.355, ["logo", "renk", "ambalaj", "yok"], 1.5);
  s.addShape(p.ShapeType.rect, { x: M + 0.12, y: y + 0.62, w: W - 0.24, h: 0.92,
    fill: { color: ACCT }, line: { color: ACC, width: 0.9 } });
  s.addText("ÜÇ ANAHTAR KELİME", { x: M + 0.24, y: y + 0.68, w: 1.6, h: 0.18, isTextBox: true,
    margin: 0, fontFace: S, fontSize: 7.5, bold: true, color: ACC, charSpacing: 1.2 });
  s.addText("“kaliteli”, “modern”, “özel” kabul edilmez — her markaya uyar, hiçbir mekânsal karar üretmez", {
    x: M + 1.95, y: y + 0.68, w: 5.2, h: 0.18, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 7, italic: true, color: MUTED });
  for (let i = 0; i < 3; i++) {
    const ry = y + 0.92 + i * 0.2;
    s.addText(String(i + 1), { x: M + 0.24, y: ry - 0.03, w: 0.15, h: 0.18, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 7.5, bold: true, color: ACC });
    line(s, M + 0.42, ry + 0.14, M + 2.3, MUTED, 0.75);
    s.addText("kanıt", { x: M + 2.4, y: ry - 0.025, w: 0.4, h: 0.17, isTextBox: true,
      margin: 0, fontFace: S, fontSize: 6.5, italic: true, color: FAINT });
    line(s, M + 2.82, ry + 0.14, M + 7.13, RULE, 0.75);
  }

  /* 6 — MEKÂNSAL KARŞILIK */
  y = 8.38; h = 1.72;
  block(s, y, h, "6", "MEKÂNSAL KARŞILIK", "her anahtar kelime bir tasarım kararına dönüşmeli");
  const cols = [[0.12, 1.9, "ANAHTAR KELİME"], [2.22, 2.4, "MEKÂNSAL İLKE"], [4.82, 2.43, "TASARIM ÖĞESİ"]];
  cols.forEach(c => {
    s.addText(c[2], { x: M + c[0], y: y + 0.33, w: c[1], h: 0.18, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 7, bold: true, color: FAINT, charSpacing: 1 });
  });
  for (let i = 0; i < 3; i++) {
    const ry = y + 0.62 + i * 0.36;
    cols.forEach((c, ci) => {
      line(s, M + c[0], ry + 0.2, M + c[0] + c[1], ci === 0 ? MUTED : RULE, 0.75);
      if (ci < 2) s.addText("→", { x: M + c[0] + c[1] + 0.02, y: ry - 0.01, w: 0.18, h: 0.2,
        isTextBox: true, margin: 0, fontFace: S, fontSize: 8, color: ACC, align: "center" });
    });
  }
  note(s, M + 0.12, y + 1.46, W - 0.24,
    "Örnek:  her ürün elde üretiliyor  →  TEKİLLİK  →  düşük yoğunluk, her ürüne kendi ışığı  →  tekil kaide, nokta aydınlatma");

  /* 7 — ALT ŞERİT */
  y = 10.18; h = 0.92;
  block(s, y, h, "7", "SON İKİ SORU");
  s.addText("Bu markanın ürünü ekrandan satılamayan neye sahip?", { x: M + 0.12, y: y + 0.32,
    w: 3.4, h: 0.18, isTextBox: true, margin: 0, fontFace: S, fontSize: 7.5, color: BODY });
  blank(s, M + 0.12, y + 0.58, 3.4, 2, 0.2);
  s.addShape(p.ShapeType.line, { x: M + 3.66, y: y + 0.3, w: 0, h: h - 0.42,
    line: { color: HAIR, width: 0.9 } });
  s.addText("UYGUNLUK KONTROLÜ  —  beşi de işaretlenmeliydi", { x: M + 3.8, y: y + 0.32,
    w: 3.3, h: 0.18, isTextBox: true, margin: 0, fontFace: S, fontSize: 7, bold: true,
    color: ACC, charSpacing: 0.8 });
  chkRow(s, M + 3.8, y + 0.55, ["ürün bazlı", "fiziksel mağazası yok", "yaygın mekân kimliği yok",
    "site / hesap doğrulanabilir", "analiz edilecek malzeme var"], 3.3);

  s.addText("Ürün, ambalaj ve marka görsellerini bu sayfanın arkasına yapıştırın.  ·  Mağaza Tasarımı  ·  Hafta 1 ödevi", {
    x: M, y: 11.18, w: W, h: 0.2, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 7, color: FAINT });
  s.addNotes("A4 dikey basılır. Her öğrenci üç kopya doldurur. Hafta 2'de saha gezisinden sonra biri onaylanır.");
}

/* ==========================================================
   SAYFA 2 — ÖĞRENCİ İÇİN YÖNERGE
   ========================================================== */
{
  const s = p.addSlide();
  s.background = { color: PAPER };
  s.addText("Paftayı doldururken", { x: M, y: 0.34, w: 5.5, h: 0.36, isTextBox: true,
    margin: 0, fontFace: H, fontSize: 19, bold: true, color: INK });
  s.addText("Bu sayfayı doldurmayın; yanınızda bulunsun.", { x: M, y: 0.70, w: 5.5, h: 0.2,
    isTextBox: true, margin: 0, fontFace: S, fontSize: 8, color: MUTED });
  line(s, M, 1.0, M + W, INK, 1.1);

  function sec(y, lab) {
    s.addText(lab, { x: M, y: y, w: W, h: 0.2, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 8, bold: true, color: ACC, charSpacing: 1.3 });
  }
  function bullets(y, items, gap) {
    let yy = y;
    items.forEach(t => {
      s.addShape(p.ShapeType.ellipse, { x: M + 0.05, y: yy + 0.06, w: 0.07, h: 0.07,
        fill: { color: ACC }, line: { color: ACC } });
      s.addText(t, { x: M + 0.25, y: yy - 0.02, w: W - 0.25, h: gap || 0.42, isTextBox: true,
        margin: 0, fontFace: S, fontSize: 9, color: BODY, lineSpacing: 12 });
      yy += gap || 0.42;
    });
    return yy;
  }

  sec(1.2, "MARKA HANGİ KOŞULLARI SAĞLAMALI");
  let y = bullets(1.45, [
    "Ürün satıyor — hizmet değil. Elle tutulur bir şey olmalı.",
    "Fiziksel mağazası yok, ya da yalnızca tek küçük bir noktası var.",
    "Yaygın bir mekân kimliği yok: internette mağaza fotoğrafları çıkmıyor.",
    "Gerçek ve doğrulanabilir: çalışan bir sitesi ve/veya aktif bir hesabı var.",
    "Analiz edecek malzeme var: ürün gamı, dili, hikâyesi okunabiliyor."
  ]);

  sec(y + 0.18, "BİLGİYİ NEREDEN BULACAKSINIZ");
  y = bullets(y + 0.43, [
    "Markanın kendi sitesi — özellikle “hakkımızda” ve ürün açıklamaları.",
    "Instagram — gönderilerden çok yorumlar ve markanın yanıt verme biçimi.",
    "Ürün ambalajı ve etiketi — malzeme, ölçü, saklama koşulu buradan okunur.",
    "Varsa basında çıkan yazılar, röportajlar, pazar ve fuar kayıtları.",
    "En değerlisi: marka sahibiyle yirmi dakikalık bir telefon görüşmesi. Küçük markalar buna genelde açıktır — sorun."
  ], 0.44);

  sec(y + 0.18, "SIK YAPILAN ÜÇ HATA");
  const errs = [
    ["Tanınmış marka seçmek", "Tasarım dili zaten belirlenmiş bir markayı seçerseniz tasarlamazsınız, taklit edersiniz. Dersin konusu bu değil."],
    ["Boş marka seçmek", "Üç gönderisi olan bir hesabın analiz edilecek hiçbir şeyi yoktur. Ürün gamı ve dili okunabilmeli."],
    ["Anahtar kelime yerine sıfat yazmak", "“Kaliteli”, “modern”, “özel” her markaya uyar ve hiçbir mekânsal karar üretmez. Sınama şudur: kelime bir mekânsal karara dönüşemiyorsa, o bir anahtar kelime değildir."]
  ];
  y = y + 0.43;
  errs.forEach(e => {
    s.addText(e[0], { x: M, y: y, w: W, h: 0.2, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 11, bold: true, color: INK });
    s.addText(e[1], { x: M, y: y + 0.22, w: W, h: 0.42, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, color: MUTED, lineSpacing: 12 });
    y += 0.76;
  });

  sec(y + 0.1, "ÖLÇÜ NOTUNU CİDDİYE ALIN");
  s.addText("Paftadaki ölçü satırları tasarımın en somut girdisidir. Bir ürünün boyutu raf derinliğini, ağırlığı taşıyıcıyı, kırılganlığı açık raf ile cam dolap arasındaki seçimi, çeşit sayısı ise metrekare başına düşen yoğunluğu belirler.\n\nMümkünse ürünü gerçekten ölçün. Mümkün değilse ambalaj görselinden tahmin edin ve tahmin olduğunu yazın — tahmin edilmiş bir ölçü, hiç ölçü olmamasından iyidir.",
    { x: M, y: y + 0.35, w: W, h: 1.0, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 9, color: BODY, lineSpacing: 12.5 });

  s.addShape(p.ShapeType.rect, { x: M, y: y + 1.45, w: W, h: 0.72,
    fill: { color: ACCT }, line: { color: ACC, width: 0.9 } });
  s.addText("Üç paftayla gelin. Hafta 2'de saha gezisinden sonra biri onaylanacak — mekânı gördükten sonra karar vereceksiniz.  Bir markayı yalnızca bir öğrenci alabilir.",
    { x: M + 0.2, y: y + 1.45, w: W - 0.4, h: 0.72, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 11, italic: true, color: ACC, valign: "middle", lineSpacing: 15 });
  s.addNotes("Paftanın arkasına basılabilir ya da ayrı verilebilir.");
}

p.writeFile({ fileName: "Marka-Arastirma-Paftasi.pptx" }).then(f => console.log("WROTE", f));
