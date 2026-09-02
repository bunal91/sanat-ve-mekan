const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE";           // 13.3 x 7.5
p.author = "Mağaza Tasarımı Stüdyosu";
p.title  = "Mağaza Tasarımı — Teorik Giriş";

/* ---------------- palette ---------------- */
const INK   = "10333F";   // deep sea ink  (dominant, dark slides)
const INK2  = "0A242C";   // deeper
const PAPER = "F5F6F4";   // content ground
const SLATE = "4E7C8A";   // marina slate (support)
const ACC   = "D95A2B";   // signage orange (sharp accent)
const TEXT  = "1E2A2F";
const MUTED = "6E7A80";
const LINE  = "D3D8D6";
const TINT  = "E7EDEE";   // slate tint card
const TINTA = "FBE7DE";   // accent tint card

const HF = "Cambria";     // headings
const BF = "Calibri";     // body

const M = 0.62;           // side margin
const W = 13.33 - M * 2;  // usable width

/* ---------------- helpers ---------------- */

function notes(s, t) { s.addNotes(t); }

// dark section divider
function divider(num, en, tr, week, eyebrow) {
  const s = p.addSlide();
  s.background = { color: INK };
  const nSize = num.length <= 1 ? 150 : num.length === 2 ? 120 : num.length === 3 ? 92 : 72;
  const TX = num ? M + 2.9 : M;
  s.addText(num, {
    x: M, y: 1.55, w: 2.85, h: 2.5, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: nSize, bold: true, color: SLATE, align: "left",
    valign: "middle", transparency: 30
  });
  s.addText(eyebrow || ("PART " + num), {
    x: TX, y: 2.05, w: 8.5, h: 0.4, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13, bold: true, color: ACC, charSpacing: 3
  });
  s.addText(en, {
    x: TX, y: 2.5, w: 9.4, h: 1.35, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: en.length > 30 ? 33 : 40, bold: true, color: "FFFFFF"
  });
  s.addText(tr, {
    x: TX, y: 3.82, w: 9.4, h: 0.6, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 19, color: "C6D5D9"
  });
  if (week) {
    s.addShape(p.ShapeType.roundRect, {
      x: TX, y: 4.62, w: 2.5, h: 0.42, fill: { color: INK2 },
      line: { color: SLATE, width: 1 }, rectRadius: 0.21
    });
    s.addText(week, {
      x: TX, y: 4.62, w: 2.5, h: 0.42, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11.5, bold: true, color: "C6D5D9", align: "center", valign: "middle"
    });
  }
  return s;
}

// light content slide with title
function slide(title, kicker) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  if (kicker) {
    s.addText(kicker, {
      x: M, y: 0.36, w: W, h: 0.3, isTextBox: true, margin: 0,
      fontFace: BF, fontSize: 11, bold: true, color: ACC, charSpacing: 2.4
    });
  }
  s.addText(title, {
    x: M, y: kicker ? 0.68 : 0.5, w: W, h: 0.85, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 32, bold: true, color: INK
  });
  return s;
}

// numbered circle + heading + body  (repeating motif)
function iconRow(s, x, y, w, n, head, body, col) {
  const c = col || SLATE;
  s.addShape(p.ShapeType.ellipse, {
    x: x, y: y, w: 0.52, h: 0.52, fill: { color: c }, line: { color: c }
  });
  s.addText(String(n), {
    x: x, y: y, w: 0.52, h: 0.52, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 15, bold: true, color: "FFFFFF",
    align: "center", valign: "middle"
  });
  s.addText(head, {
    x: x + 0.72, y: y - 0.03, w: w - 0.72, h: 0.32, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 15.5, bold: true, color: INK
  });
  s.addText(body, {
    x: x + 0.72, y: y + 0.29, w: w - 0.72, h: 0.72, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12.5, color: MUTED, lineSpacing: 15
  });
}

// tinted card
function card(s, x, y, w, h, head, body, accent) {
  s.addShape(p.ShapeType.roundRect, {
    x: x, y: y, w: w, h: h, rectRadius: 0.08,
    fill: { color: accent ? TINTA : TINT }, line: { color: accent ? "F0CBBA" : "D6E0E2", width: 1 }
  });
  s.addText(head, {
    x: x + 0.26, y: y + 0.2, w: w - 0.5, h: 0.34, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 14.5, bold: true, color: accent ? ACC : INK
  });
  s.addText(body, {
    x: x + 0.26, y: y + 0.58, w: w - 0.5, h: h - 0.78, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12.5, color: TEXT, lineSpacing: 16
  });
}

// big stat
function stat(s, x, y, w, num, lab, col) {
  s.addText(num, {
    x: x, y: y, w: w, h: 0.95, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 54, bold: true, color: col || ACC
  });
  s.addText(lab, {
    x: x, y: y + 0.98, w: w, h: 0.7, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12.5, color: MUTED, lineSpacing: 15
  });
}

// bullet block
function bullets(s, x, y, w, items, size) {
  s.addText(items.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i !== items.length - 1 }
  })), {
    x: x, y: y, w: w, h: 0.4 + items.length * 0.42, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: size || 14.5, color: TEXT, paraSpaceAfter: 8, lineSpacing: 20
  });
}

// image placeholder for the instructor
function imgSlot(s, x, y, w, h, label) {
  s.addShape(p.ShapeType.rect, {
    x: x, y: y, w: w, h: h, fill: { color: "ECEFEE" },
    line: { color: SLATE, width: 1.25, dashType: "dash" }
  });
  s.addText(label, {
    x: x + 0.2, y: y + h / 2 - 0.42, w: w - 0.4, h: 0.85, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12, color: SLATE, align: "center", valign: "middle", lineSpacing: 16
  });
}

// discussion prompt band
function ask(s, y, q) {
  s.addShape(p.ShapeType.roundRect, {
    x: M, y: y, w: W, h: 0.92, rectRadius: 0.1,
    fill: { color: INK }, line: { color: INK }
  });
  s.addText("SINIFA SOR", {
    x: M + 0.3, y: y + 0.14, w: 1.6, h: 0.26, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 9.5, bold: true, color: ACC, charSpacing: 2
  });
  s.addText(q, {
    x: M + 0.3, y: y + 0.4, w: W - 0.6, h: 0.42, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 16.5, italic: true, color: "FFFFFF"
  });
}

// slide footer tag (part marker)
function tag(s, txt) {
  s.addText(txt, {
    x: M, y: 7.0, w: W, h: 0.28, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 9.5, color: "A9B4B8", charSpacing: 1.5
  });
}

const TBL = {
  fontFace: BF, fontSize: 12, color: TEXT, border: { type: "solid", color: LINE, pt: 0.75 },
  valign: "middle"
};
function th(t) { return { text: t, options: { fill: { color: INK }, color: "FFFFFF", bold: true, fontSize: 11.5 } }; }

/* =========================================================
   COVER
   ========================================================= */
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addShape(p.ShapeType.ellipse, { x: 9.4, y: -1.5, w: 6.2, h: 6.2, fill: { color: INK2 }, line: { color: INK2 } });
  s.addShape(p.ShapeType.ellipse, { x: 11.0, y: 3.9, w: 3.4, h: 3.4, fill: { color: SLATE }, line: { color: SLATE }, transparency: 72 });

  s.addText("İÇ MİMARLIK 3. SINIF  ·  PROJE STÜDYOSU  ·  14 HAFTA", {
    x: M, y: 1.35, w: 9.2, h: 0.34, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 12, bold: true, color: ACC, charSpacing: 2.6
  });
  s.addText("Mağaza Tasarımı", {
    x: M, y: 1.85, w: 9.6, h: 1.15, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 60, bold: true, color: "FFFFFF"
  });
  s.addText("Teorik Giriş", {
    x: M, y: 3.0, w: 9.6, h: 0.85, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 44, color: SLATE
  });
  s.addText("Küçük bir markanın ilk fiziksel mekânı  —  Mersin Marina", {
    x: M, y: 4.15, w: 9.6, h: 0.45, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 18, color: "C6D5D9"
  });
  s.addShape(p.ShapeType.rect, { x: M, y: 4.95, w: 2.6, h: 0.035, fill: { color: ACC }, line: { color: ACC } });
  s.addText("Dokuz bölüm  ·  Hafta 1–3 teorik anlatım  ·  Hafta 10 atölye", {
    x: M, y: 5.25, w: 9.6, h: 0.4, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13.5, color: "8FA6AD"
  });
  notes(s, "Açılış. Kendinizi ve dersin amacını 2 dakikada tanıtın. Uzun bir hoş geldiniz yapmayın — 3. bölümdeki açılış sorusuna hızlı geçin, sınıfı ilk 10 dakikada konuşturmak dönem boyunca stüdyo kültürünü kuruyor.");
}

/* ---------- Agenda ---------- */
{
  const s = slide("Bu sunumun haritası", "İÇERİK");
  const rows = [
    ["I",    "What is Retail Design?",                  "Perakende tasarımı nedir",              "Hafta 1"],
    ["II",   "From Shop to Experience",                 "Dükkândan deneyime",                    "Hafta 1"],
    ["III",  "Brand + Identity + Space",                "Marka, kimlik, mekân",                  "Hafta 1–2"],
    ["IV",   "Understanding the Customer",              "Kullanıcıyı anlamak",                   "Hafta 2"],
    ["V",    "Spatial Behaviour & Customer Journey",    "Mekânsal davranış ve müşteri yolculuğu","Hafta 3"],
    ["VI",   "Atmosphere & Multisensory Experience",    "Atmosfer ve çok duyulu deneyim",        "Hafta 3"],
    ["VII",  "Product, Display & Visual Merchandising", "Ürün, teşhir ve görsel düzenleme",      "Hafta 9"],
    ["VIII", "Light, Material, Color & Sound",          "Işık, malzeme, renk, ses",              "Hafta 10"],
    ["IX",   "What Makes a Good Retail Space?",         "İyi bir mağaza mekânını ne yapar",      "Hafta 1"]
  ];
  const data = [[th("#"), th("BAŞLIK"), th("TÜRKÇE"), th("NE ZAMAN")]];
  rows.forEach(r => data.push([
    { text: r[0], options: { bold: true, color: ACC, fontFace: BF, align: "center" } },
    { text: r[1], options: { bold: true, color: INK } },
    { text: r[2], options: { color: MUTED } },
    { text: r[3], options: { color: SLATE, bold: true, fontSize: 11, align: "center" } }
  ]));
  s.addTable(data, {
    x: M, y: 1.72, w: W, colW: [0.7, 4.9, 4.55, 1.94],
    rowH: 0.44, ...TBL
  });
  s.addText("Bugün I–IV ve IX'u anlatacağız. V–VIII önümüzdeki iki hafta ve Hafta 10 atölyesinde açılacak.", {
    x: M, y: 6.5, w: W, h: 0.4, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13, italic: true, color: MUTED
  });
  notes(s, "8 saatlik ilk gün için: sabah I–IV + IX (yaklaşık 2.5 saat, aralarla), öğleden sonra proje brifi ve mekân tanıtımı. V–VIII'i bugün açmayın, Hafta 2–3'e bırakın.");
}

/* =========================================================
   PART I — What is Retail Design?
   ========================================================= */
divider("I", "What is Retail Design?", "Perakende tasarımı nedir?", "HAFTA 1");

{
  const s = p.addSlide();
  s.background = { color: PAPER };
  s.addText("Başlayalım", {
    x: M, y: 1.5, w: W, h: 0.5, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13, bold: true, color: ACC, charSpacing: 2.4
  });
  s.addText("Son bir ayda girip hiçbir şey\nalmadan çıktığınız bir mağaza\nvar mı? Neden çıktınız?", {
    x: M, y: 2.05, w: 10.6, h: 2.6, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 40, bold: true, color: INK, lineSpacing: 46
  });
  s.addText("Cevapları tahtaya yazın. Genelde şunlar gelir:", {
    x: M, y: 4.9, w: W, h: 0.35, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13, color: MUTED
  });
  const answers = ["Kalabalıktı", "Ne arayacağımı bulamadım", "Görevli üstüme geldi", "Kimse ilgilenmedi", "Işık kötüydü", "Sıra vardı"];
  let ax = M;
  answers.forEach(a => {
    const w = 0.28 + a.length * 0.105;
    s.addShape(p.ShapeType.roundRect, { x: ax, y: 5.35, w: w, h: 0.44, rectRadius: 0.22, fill: { color: TINT }, line: { color: "D6E0E2", width: 1 } });
    s.addText(a, { x: ax, y: 5.35, w: w, h: 0.44, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12, color: INK, align: "center", valign: "middle" });
    ax += w + 0.16;
  });
  s.addText("Bunların hepsi bir tasarım kararıdır.", {
    x: M, y: 6.15, w: W, h: 0.5, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 22, bold: true, color: ACC
  });
  tag(s, "PART I · PERAKENDE TASARIMI NEDİR");
  notes(s, "Slaytla değil bu soruyla başlayın. 5–7 cevap toplayın, tahtaya yazın. Sonra 'bunların hepsi tasarım kararı' diyerek dersin tezini kurun. Bu slayt dersin en önemli 10 dakikası.");
}

{
  const s = slide("Perakende tasarımı nedir?", "TANIM");
  s.addText("Ürünleri, hizmetleri ve markaları öne çıkaran fiziksel veya sanal ortamların tasarımı — markayla müşteri arasında kalıcı bir ilişki kurmayı hedefleyen, çok disiplinli bir uzmanlık alanı.", {
    x: M, y: 1.72, w: 8.1, h: 1.5, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 16.5, color: TEXT, lineSpacing: 25
  });
  s.addText("Quartier (2017)", {
    x: M, y: 3.15, w: 8.1, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11.5, italic: true, color: MUTED
  });
  card(s, 8.95, 1.72, 3.76, 1.75, "Neden \"çok disiplinli\"?",
       "Tek başına iç mimarlık değil. Markalama, pazarlama, psikoloji, lojistik, teknoloji ve kullanıcı deneyimi aynı anda devrede.");
  s.addText("Sekiz yetkinlik teması", {
    x: M, y: 3.75, w: W, h: 0.35, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 14, bold: true, color: INK
  });
  const themes = ["Araştırma", "Tasarım", "Sosyo-kültürel bilimler", "Markalama", "Pazarlama ve strateji", "Omni-kanal ve dijital", "İletişim", "Organizasyon ve yönetim"];
  let tx = M, ty = 4.2;
  themes.forEach((t, i) => {
    const w = 2.92, h = 0.58;
    if (i === 4) { tx = M; ty = 4.9; }
    s.addShape(p.ShapeType.roundRect, { x: tx, y: ty, w: w, h: h, rectRadius: 0.07, fill: { color: "FFFFFF" }, line: { color: LINE, width: 1 } });
    s.addText(t, { x: tx + 0.12, y: ty, w: w - 0.24, h: h, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12, color: INK, valign: "middle", align: "center" });
    tx += w + 0.14;
  });
  s.addText("Quartier, Claes & Vanrie (2020) — 77 meta-yetkinlik, 8 tema", {
    x: M, y: 5.68, w: W, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 11, italic: true, color: MUTED
  });
  s.addText("Bu ders sadece bir \"çizim\" dersi değil. Analiz, psikoloji ve strateji de içeriyor.", {
    x: M, y: 6.15, w: W, h: 0.45, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 18, bold: true, color: INK
  });
  tag(s, "PART I · PERAKENDE TASARIMI NEDİR");
  notes(s, "Sekiz temayı tek tek okumayın, göz gezdirtin. Vurgu: 'bu derste sizden sadece güzel çizim değil, analiz ve gerekçe isteyeceğim.'");
}

{
  const s = slide("İnternet varken fiziksel mağaza neden var?", "SORU");
  s.addShape(p.ShapeType.roundRect, { x: M, y: 1.75, w: 5.9, h: 2.15, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: LINE, width: 1 } });
  s.addText("Fiziksel mağazanın KAYBETTİĞİ savaş", { x: M + 0.28, y: 1.95, w: 5.35, h: 0.32, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5, bold: true, color: MUTED });
  bullets(s, M + 0.28, 2.35, 5.35, ["Fiyat", "Çeşit ve stok genişliği", "7/24 erişim", "Karşılaştırma kolaylığı"], 13.5);

  s.addShape(p.ShapeType.roundRect, { x: 6.85, y: 1.75, w: 5.86, h: 2.15, rectRadius: 0.08, fill: { color: TINTA }, line: { color: "F0CBBA", width: 1 } });
  s.addText("Fiziksel mağazanın KAZANDIĞI savaş", { x: 7.13, y: 1.95, w: 5.3, h: 0.32, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5, bold: true, color: ACC });
  bullets(s, 7.13, 2.35, 5.3, ["Dokunmak, denemek, koklamak", "Danışmak ve güven kurmak", "Anında sahiplenmek", "Aidiyet ve topluluk"], 13.5);

  s.addText("Mağazanın işi artık sadece satmak değil: markayı üç boyutlu anlatmak.", {
    x: M, y: 4.2, w: W, h: 0.5, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 22, bold: true, color: INK
  });
  s.addText("\"Fiziksel mağazalar artık satın alma yolculuğunun son durağı olarak görülmemeli. Çevrimiçi ve fiziksel perakendenin güçlü yanları birleştiğinde bütünsel bir deneyim ortaya çıkar.\"", {
    x: M, y: 4.95, w: 10.4, h: 1.1, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 15.5, italic: true, color: SLATE, lineSpacing: 23
  });
  s.addText("2021 Retail Trends, I-AM", { x: M, y: 6.05, w: 6, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 11, color: MUTED });
  tag(s, "PART I · PERAKENDE TASARIMI NEDİR");
  notes(s, "Öğrencilerin çoğu online alışverişle büyüdü. 'Sizi hâlâ mağazaya ne götürüyor?' diye sorun — cevaplar sağ sütunu kendiliğinden dolduruyor.");
}

{
  const s = slide("Mağaza tasarımı ölçülebilir", "NADİR BİR GERİ BİLDİRİM DÖNGÜSÜ");
  s.addText("İç mimarlıkta çok az mekân tipinin performansı sayıyla ölçülür. Mağaza ölçülür — ve tasarım kararları bu sayıları doğrudan etkiler.", {
    x: M, y: 1.7, w: 11.2, h: 0.75, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 15.5, color: TEXT, lineSpacing: 23
  });
  const kpis = [
    ["Dönüşüm oranı", "Girenlerin kaçı satın alıyor?", "Vitrin, eşik, yönlendirme"],
    ["Kalış süresi", "Ne kadar kalıyor?", "Oturma, dolaşım, deneyim alanı"],
    ["m² başına ciro", "Alan verimli mi?", "Teşhir yoğunluğu, plan tipi"],
    ["Sepet büyüklüğü", "Kaç ürün alıyor?", "Rota kurgusu, çapraz teşhir"],
    ["Tekrar ziyaret", "Geri geliyor mu?", "Atmosfer, ilişki, hafıza"]
  ];
  let ky = 2.65;
  kpis.forEach((k, i) => {
    s.addShape(p.ShapeType.rect, { x: M, y: ky, w: W, h: 0.78, fill: { color: i % 2 ? "FFFFFF" : "EDF1F1" }, line: { color: "FFFFFF", width: 0 } });
    s.addText(k[0], { x: M + 0.24, y: ky, w: 3.0, h: 0.78, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14.5, bold: true, color: INK, valign: "middle" });
    s.addText(k[1], { x: M + 3.3, y: ky, w: 4.0, h: 0.78, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13, color: MUTED, valign: "middle" });
    s.addText(k[2], { x: M + 7.5, y: ky, w: 4.4, h: 0.78, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13, bold: true, color: ACC, valign: "middle" });
    ky += 0.78;
  });
  s.addText("↑ hangi tasarım kararı etkiliyor", { x: M + 7.5, y: 2.35, w: 4.4, h: 0.26, isTextBox: true, margin: 0, fontFace: BF, fontSize: 10.5, color: MUTED, charSpacing: 1 });
  tag(s, "PART I · PERAKENDE TASARIMI NEDİR");
  notes(s, "Bu slayt 'işveren gerçekliği'ni gösteriyor. Öğrenciye: mezun olduğunuzda müşteriniz size bu soruları soracak. Güzel bulmak yetmeyecek, gerekçe isteyecek.");
}

{
  const s = slide("Mağaza tipolojileri", "HER BİRİ FARKLI BİR PROBLEM");
  const types = [
    ["Amiral gemisi", "Marka vitrini. Ciro değil, imaj hedefi. En büyük bütçe."],
    ["Konsept mağaza", "Yeni bir fikrin denendiği yer. Esnek, dönüşebilir."],
    ["Standart şube", "Tekrarlanabilirlik esas. Kit-of-parts mantığı."],
    ["Pop-up", "Geçici, sökülebilir, hızlı kurulum. Olay yaratır."],
    ["Shop-in-shop", "Başka bir mağazanın içinde ada. Sınır problemi."],
    ["Showroom", "Stok yok, sipariş var. Teşhir + danışmanlık."]
  ];
  let x = M, y = 1.8;
  types.forEach((t, i) => {
    if (i === 3) { x = M; y = 3.55; }
    card(s, x, y, 3.87, 1.55, t[0], t[1]);
    x += 4.03;
  });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 5.4, w: W, h: 1.15, rectRadius: 0.1, fill: { color: INK }, line: { color: INK } });
  s.addText("BU DÖNEM TASARLAYACAĞINIZ", { x: M + 0.3, y: 5.56, w: 5, h: 0.28, isTextBox: true, margin: 0, fontFace: BF, fontSize: 10, bold: true, color: ACC, charSpacing: 2 });
  s.addText("Küçük bir markanın ilk konsept mağazası — kopyalanacak bir şablon yok.", {
    x: M + 0.3, y: 5.85, w: W - 0.6, h: 0.5, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 18, bold: true, color: "FFFFFF"
  });
  tag(s, "PART I · PERAKENDE TASARIMI NEDİR");
  notes(s, "Tipolojileri hızlı geçin. Asıl mesaj alttaki koyu bant: bu dönem yapacakları şeyin ne olduğu.");
}

/* =========================================================
   PART II — From Shop to Experience
   ========================================================= */
divider("II", "From Shop to Experience", "Dükkândan deneyime", "HAFTA 1");

{
  const s = slide("Atmosfer 50 yıldır biliniyor", "KURUCU METİN");
  s.addText("\"Atmospherics as a Marketing Tool\"", {
    x: M, y: 1.75, w: 8.4, h: 0.6, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 30, bold: true, color: INK
  });
  s.addText("Philip Kotler, Journal of Retailing, 1973", {
    x: M, y: 2.38, w: 8.4, h: 0.35, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13.5, color: MUTED
  });
  s.addText("Kotler'in tezi: bir mekânın atmosferi, üründen bağımsız olarak satın alma kararını etkiler. Ürün aynı, mekân farklı — sonuç farklı.", {
    x: M, y: 2.95, w: 8.4, h: 1.0, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 16, color: TEXT, lineSpacing: 24
  });
  s.addText("Ve atmosfer, iç mimarlığın alanıdır.", {
    x: M, y: 4.05, w: 8.4, h: 0.5, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 21, bold: true, color: ACC
  });
  stat(s, 9.5, 1.8, 3.2, "1973", "Kotler'in makalesinin tarihi.\nYani bu, yeni bir moda değil —\nyarım asırlık bir bilgi birikimi.", INK);
  s.addText("Sonraki elli yıl bu tezi üç ayrı çerçeveyle derinleştirdi:", {
    x: M, y: 4.85, w: W, h: 0.35, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, bold: true, color: INK
  });
  iconRow(s, M, 5.3, 3.9, 1, "Servicescape", "Bitner (1992) — fiziksel çevrenin üç boyutu");
  iconRow(s, M + 4.1, 5.3, 3.9, 2, "Uyaran–Tepki", "Mehrabian & Russell (1974) — yaklaşma / kaçınma");
  iconRow(s, M + 8.2, 5.3, 3.9, 3, "Deneyim ekonomisi", "Pine & Gilmore (1998) — deneyimin bedeli");
  tag(s, "PART II · DÜKKÂNDAN DENEYİME");
  notes(s, "Öğrenciler 'deneyim tasarımı'nı yeni ve modaya dair bir şey sanıyor. 1973 tarihi bu algıyı kırıyor.");
}

{
  const s = slide("Deneyim ekonomisi", "PINE & GILMORE, 1998");
  s.addText("Her basamakta müşterinin ödemeye razı olduğu bedel artar. Aynı çekirdek, dört farklı fiyat.", {
    x: M, y: 1.68, w: 11.4, h: 0.4, isTextBox: true, margin: 0, fontFace: BF, fontSize: 15, color: TEXT
  });
  const steps = [
    ["EMTİA", "Kahve çekirdeği", "Çuvalda, kilo ile", "1×"],
    ["ÜRÜN", "Paket kahve", "Rafta, markalı", "5×"],
    ["HİZMET", "Kafede kahve", "Pişirilip sunulan", "40×"],
    ["DENEYİM", "Mekânı için gidilen kahve", "Hatırlanan, anlatılan", "100×"]
  ];
  let sx = M;
  steps.forEach((st, i) => {
    const last = i === 3;
    const w = 2.92;
    s.addShape(p.ShapeType.roundRect, {
      x: sx, y: 2.3, w: w, h: 2.75, rectRadius: 0.09,
      fill: { color: last ? INK : "FFFFFF" }, line: { color: last ? INK : LINE, width: 1 }
    });
    s.addText(st[0], { x: sx + 0.2, y: 2.5, w: w - 0.4, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 10.5, bold: true, color: last ? ACC : MUTED, charSpacing: 2 });
    s.addText(st[1], { x: sx + 0.2, y: 2.85, w: w - 0.4, h: 0.75, isTextBox: true, margin: 0, fontFace: HF, fontSize: 17, bold: true, color: last ? "FFFFFF" : INK, lineSpacing: 21 });
    s.addText(st[2], { x: sx + 0.2, y: 3.65, w: w - 0.4, h: 0.6, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12, color: last ? "AFC3C9" : MUTED, lineSpacing: 16 });
    s.addText(st[3], { x: sx + 0.2, y: 4.35, w: w - 0.4, h: 0.55, isTextBox: true, margin: 0, fontFace: HF, fontSize: 26, bold: true, color: last ? ACC : SLATE });
    if (i < 3) {
      s.addText("→", { x: sx + w + 0.005, y: 3.4, w: 0.32, h: 0.4, isTextBox: true, margin: 0, fontFace: BF, fontSize: 20, color: SLATE, align: "center" });
    }
    sx += w + 0.33;
  });
  s.addText("Fiyat çarpanları temsilîdir — amaç oranı göstermek, kesin rakam vermek değil.", {
    x: M, y: 5.2, w: W, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 11, italic: true, color: MUTED
  });
  ask(s, 5.7, "Mersin'de sırf mekânı için gittiğiniz bir yer var mı? Orada tam olarak ne farklı?");
  tag(s, "PART II · DÜKKÂNDAN DENEYİME");
  notes(s, "Kahve örneği herkeste karşılık buluyor. Soruyu Mersin'e bağlamak önemli — marina zaten bir 'deneyim' yerleşimi, öğrenci oraya tasarım yapacak.");
}

{
  const s = slide("Mekân insanı ya içeri çeker ya dışarı iter", "MEHRABIAN & RUSSELL · BITNER");
  s.addShape(p.ShapeType.roundRect, { x: M, y: 1.72, w: 5.9, h: 2.5, rectRadius: 0.08, fill: { color: TINT }, line: { color: "D6E0E2", width: 1 } });
  s.addText("Servicescape — Bitner, 1992", { x: M + 0.28, y: 1.95, w: 5.35, h: 0.32, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, bold: true, color: INK });
  s.addText("Fiziksel çevrenin üç boyutu:", { x: M + 0.28, y: 2.32, w: 5.35, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, color: MUTED });
  bullets(s, M + 0.28, 2.68, 5.35, ["Ortam koşulları — ısı, ışık, ses, koku", "Mekân ve işlev — yerleşim, ekipman, mobilya", "İşaret ve semboller — tabela, dekor, malzeme"], 13);

  s.addShape(p.ShapeType.roundRect, { x: 6.85, y: 1.72, w: 5.86, h: 2.5, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: LINE, width: 1 } });
  s.addText("Uyaran → Organizma → Tepki", { x: 7.13, y: 1.95, w: 5.3, h: 0.32, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, bold: true, color: INK });
  s.addText("Mehrabian & Russell, 1974", { x: 7.13, y: 2.32, w: 5.3, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, color: MUTED });
  s.addText("Mekânsal uyaranlar iki duyguyu tetikler — haz (pleasure) ve uyarılma (arousal). Bu ikisi de davranışa dönüşür: yaklaşma ya da kaçınma.", {
    x: 7.13, y: 2.7, w: 5.3, h: 1.2, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13, color: TEXT, lineSpacing: 18
  });

  s.addShape(p.ShapeType.roundRect, { x: M, y: 4.5, w: W, h: 1.05, rectRadius: 0.1, fill: { color: INK }, line: { color: INK } });
  s.addText("Nötr diye bir şey yok. Bir mekân ya çeker ya iter — hiçbir şey hissettirmemek de bir sonuçtur.", {
    x: M + 0.35, y: 4.5, w: W - 0.7, h: 1.05, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 21, bold: true, color: "FFFFFF", valign: "middle"
  });
  s.addText("Mikunda'nın eklediği: her güçlü mekânın bir çekim çekirdeği (core attraction) vardır — insanın fotoğrafını çektiği, arkadaşına anlattığı, hatırladığı tek şey. Bu dönem herkesin projesinde bir tane olmalı.", {
    x: M, y: 5.8, w: 11.6, h: 0.9, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, color: TEXT, lineSpacing: 21
  });
  tag(s, "PART II · DÜKKÂNDAN DENEYİME");
  notes(s, "'Core attraction' fikrini not aldırın — Vize 1'de her öğrenciye 'senin çekim çekirdeğin ne?' diye soracaksınız.");
}

/* =========================================================
   PART III — Brand + Identity + Space
   ========================================================= */
divider("III", "Brand + Identity + Space", "Marka, kimlik, mekân", "HAFTA 1–2");

{
  const s = slide("Marka logo değildir", "TEMEL AYRIM");
  s.addText("Marka  =  bir vaat  +  bir kişilik  +  bir tutarlılık", {
    x: M, y: 1.72, w: 11.6, h: 0.6, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 27, bold: true, color: INK
  });
  s.addText("Mekân ise bu vaadin fiziksel kanıtıdır. Marka bir şey söylüyorsa, mekân onu ya doğrular ya yalanlar.", {
    x: M, y: 2.45, w: 11.6, h: 0.5, isTextBox: true, margin: 0, fontFace: BF, fontSize: 16, color: TEXT
  });
  s.addText("Marka Anahtarı — Brand Key", {
    x: M, y: 3.2, w: W, h: 0.35, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, bold: true, color: ACC, charSpacing: 1.2
  });
  const bk = ["Rekabet", "Hedef kitle", "Hedefler", "Misyon", "Değerler", "Faydalar", "Kişilik", "Görünüm", "İletişim dili", "Öz"];
  let bx = M, by = 3.65;
  bk.forEach((b, i) => {
    if (i === 5) { bx = M; by = 4.42; }
    const w = 2.3;
    s.addShape(p.ShapeType.roundRect, { x: bx, y: by, w: w, h: 0.62, rectRadius: 0.07, fill: { color: "FFFFFF" }, line: { color: SLATE, width: 1 } });
    s.addText(b, { x: bx + 0.08, y: by, w: w - 0.16, h: 0.62, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, bold: true, color: INK, align: "center", valign: "middle" });
    bx += w + 0.19;
  });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 5.35, w: W, h: 1.2, rectRadius: 0.1, fill: { color: TINTA }, line: { color: "F0CBBA", width: 1 } });
  s.addText("Her bileşenin mekânsal karşılığını sorun", { x: M + 0.3, y: 5.5, w: 11.6, h: 0.32, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5, bold: true, color: ACC });
  s.addText("\"Bu markanın kişiliği 'sakin ve mütevazı' ise — ışık kaç lux? Müzik var mı? Koridor kaç santim? Vitrinde kaç ürün duruyor?\"", {
    x: M + 0.3, y: 5.85, w: 11.6, h: 0.55, isTextBox: true, margin: 0, fontFace: HF, fontSize: 16, italic: true, color: INK
  });
  tag(s, "PART III · MARKA, KİMLİK, MEKÂN");
  notes(s, "Marka Anahtarı'nı Hafta 2'de derinleştireceksiniz. Bugün sadece tanıtın ve alttaki soruyu vurgulayın — 'mekânsal karşılık' bu dersin anahtar ifadesi.");
}

{
  const s = slide("Marka değerini mekânsal karara çevirmek", "CANLI EGZERSİZ");
  s.addText("Tahtada birlikte yapın. Bir marka özelliği alın, sınıfla mekânsal karşılıklarını çıkarın.", {
    x: M, y: 1.7, w: 11.6, h: 0.35, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, color: MUTED
  });
  const rows = [
    ["\"Şeffaf üretim\"", "Açık atölye, cam bölme, üretim sürecinin görünürlüğü, mutfak/tezgâh mekânın ortasında"],
    ["\"El yapımı, her biri tek\"", "Ürünlerin tek tek sergilenmesi, düşük yoğunluk, vitrin dolabı, nokta aydınlatma"],
    ["\"Erişilebilir, herkes için\"", "Yüksek yoğunluk, açık raf, serbest dolaşım, hızlı ve çok kasalı çıkış"],
    ["\"Yavaş, sakin\"", "Geniş koridor, düşük ışık kontrastı, oturma alanı, sessiz bölge, az ürün"],
    ["\"Denizle ilişkili\"", "Dışa açılan cephe, tuza dayanıklı malzeme, açık hava oturması, gün ışığı"]
  ];
  const data = [[th("MARKA DEĞERİ"), th("OLASI MEKÂNSAL KARAR")]];
  rows.forEach(r => data.push([
    { text: r[0], options: { bold: true, color: INK, fontFace: BF } },
    { text: r[1], options: { color: TEXT } }
  ]));
  s.addTable(data, { x: M, y: 2.2, w: W, colW: [3.5, 8.59], rowH: 0.62, ...TBL });
  s.addText("Son satır bu dönemin mekânına özel: Mersin Marina açık hava bir yerleşim. Marka değeri ile bağlamın kesiştiği yer, projenin en güçlü fikri olabilir.", {
    x: M, y: 6.0, w: 11.6, h: 0.6, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5, italic: true, color: SLATE, lineSpacing: 19
  });
  tag(s, "PART III · MARKA, KİMLİK, MEKÂN");
  notes(s, "Slaytı hemen göstermeyin — önce boş tahtada sınıfla üretin, sonra slaytı 'biz ne bulduk' diye açın. Katılım çok daha yüksek oluyor.");
}

{
  const s = slide("Bu dönem neden küçük ve az bilinen bir marka?", "PROJE KARARI");
  s.addShape(p.ShapeType.roundRect, { x: M, y: 1.7, w: 5.8, h: 1.5, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: LINE, width: 1 } });
  s.addText("SEÇEMEZSİNİZ", { x: M + 0.28, y: 1.88, w: 5.24, h: 0.28, isTextBox: true, margin: 0, fontFace: BF, fontSize: 10.5, bold: true, color: MUTED, charSpacing: 2 });
  s.addText("Apple · Zara · Nike · IKEA · Starbucks", { x: M + 0.28, y: 2.2, w: 5.24, h: 0.4, isTextBox: true, margin: 0, fontFace: HF, fontSize: 18, bold: true, color: MUTED });
  s.addText("Tasarım dili zaten belirlenmiş. Bunları seçmek tasarım değil, taklittir.", { x: M + 0.28, y: 2.62, w: 5.24, h: 0.5, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, color: MUTED, lineSpacing: 17 });

  s.addShape(p.ShapeType.roundRect, { x: 6.75, y: 1.7, w: 5.96, h: 1.5, rectRadius: 0.08, fill: { color: INK }, line: { color: INK } });
  s.addText("SEÇECEKSİNİZ", { x: 7.03, y: 1.88, w: 5.4, h: 0.28, isTextBox: true, margin: 0, fontFace: BF, fontSize: 10.5, bold: true, color: ACC, charSpacing: 2 });
  s.addText("Fiziksel mağazası olmayan küçük bir marka", { x: 7.03, y: 2.2, w: 5.4, h: 0.4, isTextBox: true, margin: 0, fontFace: HF, fontSize: 18, bold: true, color: "FFFFFF" });
  s.addText("Çevrimiçi satıyor, kimliği henüz mekâna dönüşmemiş. Mekânı siz kuracaksınız.", { x: 7.03, y: 2.62, w: 5.4, h: 0.5, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, color: "AFC3C9", lineSpacing: 17 });

  s.addText("Üç gerekçe", { x: M, y: 3.5, w: W, h: 0.35, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, bold: true, color: INK });
  iconRow(s, M, 3.95, 3.9, 1, "Kopyalanacak dil yok", "Markanın mekânsal karşılığını sıfırdan kurmak zorunda kalıyorsunuz. Dersin asıl becerisi bu.", ACC);
  iconRow(s, M + 4.1, 3.95, 3.9, 2, "Analiz gerçekten yapılıyor", "Büyük markada bilgi hazır. Küçük markada ürüne, dile, müşteri yorumuna bakmak zorundasınız.", ACC);
  iconRow(s, M + 8.2, 3.95, 3.9, 3, "Ölçek gerçekçi", "İlk mağazasını açan küçük bir marka, mezun olunca karşılaşacağınız işe benziyor.", ACC);

  s.addShape(p.ShapeType.roundRect, { x: M, y: 5.5, w: W, h: 1.0, rectRadius: 0.1, fill: { color: TINT }, line: { color: "D6E0E2", width: 1 } });
  s.addText("Mersin ve Çukurova bağlamı size avantaj: narenciye ve gurme gıda, zeytinyağı, deniz ve tekne ekipmanı, yerel tekstil, seramik ve zanaat atölyeleri — hepsi mağazası olmayan küçük markalarla dolu.", {
    x: M + 0.35, y: 5.5, w: W - 0.7, h: 1.0, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 14, color: INK, valign: "middle", lineSpacing: 20
  });
  tag(s, "PART III · MARKA, KİMLİK, MEKÂN");
  notes(s, "Bu slayt öğrencilerin en çok itiraz ettiği yer olacak ('ben Nike yapmak istiyordum'). Üç gerekçeyi net verin. Yerel marka listesi vermeyin — bulma işi onların.");
}

/* =========================================================
   PART IV — Understanding the Customer
   ========================================================= */
divider("IV", "Understanding the Customer", "Kullanıcıyı anlamak", "HAFTA 2");

{
  const s = slide("Persona bir demografi listesi değildir", "KULLANICI PROFİLİ");
  s.addShape(p.ShapeType.roundRect, { x: M, y: 1.72, w: 5.9, h: 2.35, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: LINE, width: 1 } });
  s.addText("İŞE YARAMAYAN PERSONA", { x: M + 0.28, y: 1.92, w: 5.35, h: 0.28, isTextBox: true, margin: 0, fontFace: BF, fontSize: 10.5, bold: true, color: MUTED, charSpacing: 2 });
  s.addText("\"Ayşe, 28, grafik tasarımcı, İstanbul'da yaşıyor, doğayı ve kahveyi seviyor.\"", { x: M + 0.28, y: 2.28, w: 5.35, h: 0.85, isTextBox: true, margin: 0, fontFace: HF, fontSize: 15.5, italic: true, color: MUTED, lineSpacing: 21 });
  s.addText("Bundan hiçbir mekânsal karar çıkmaz.", { x: M + 0.28, y: 3.35, w: 5.35, h: 0.4, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13, bold: true, color: MUTED });

  s.addShape(p.ShapeType.roundRect, { x: 6.85, y: 1.72, w: 5.86, h: 2.35, rectRadius: 0.08, fill: { color: TINTA }, line: { color: "F0CBBA", width: 1 } });
  s.addText("İŞE YARAYAN PERSONA", { x: 7.13, y: 1.92, w: 5.3, h: 0.28, isTextBox: true, margin: 0, fontFace: BF, fontSize: 10.5, bold: true, color: ACC, charSpacing: 2 });
  s.addText("\"45 dakikası var, yanında 4 yaşında çocuğu ve bebek arabası var, elinde iki poşet daha, hediye arıyor ve acelesi yok ama oturacak yer arıyor.\"", { x: 7.13, y: 2.28, w: 5.3, h: 1.0, isTextBox: true, margin: 0, fontFace: HF, fontSize: 15, italic: true, color: INK, lineSpacing: 20 });
  s.addText("→ Geniş koridor, oturma alanı, çocuğun oyalanacağı nokta, poşet koyacak yüzey", { x: 7.13, y: 3.4, w: 5.3, h: 0.55, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, bold: true, color: ACC, lineSpacing: 17 });

  s.addText("Her persona bir mekânsal talep üretmeli. Üretmiyorsa o persona işe yaramaz.", {
    x: M, y: 4.35, w: 11.6, h: 0.5, isTextBox: true, margin: 0, fontFace: HF, fontSize: 21, bold: true, color: INK
  });
  s.addText("Persona yazarken cevaplanacak sorular", { x: M, y: 5.05, w: W, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13, bold: true, color: ACC, charSpacing: 1 });
  const qs = ["Markadan nasıl haberdar oldu?", "Neden geliyor — belirli bir ürün, gezme, hediye?", "Yanında kim var?", "Ne kadar zamanı var?", "Karar süreci: anında mı, karşılaştırarak mı?", "Elinde ne var?", "Neden rahatsız olur?", "Çıkarken ne bekliyor?"];
  let qx = M, qy = 5.45;
  qs.forEach((q, i) => {
    if (i === 4) { qx = M; qy = 6.1; }
    const w = 2.92;
    s.addShape(p.ShapeType.roundRect, { x: qx, y: qy, w: w, h: 0.55, rectRadius: 0.07, fill: { color: TINT }, line: { color: "D6E0E2", width: 1 } });
    s.addText(q, { x: qx + 0.1, y: qy, w: w - 0.2, h: 0.55, isTextBox: true, margin: 0, fontFace: BF, fontSize: 11, color: INK, align: "center", valign: "middle", lineSpacing: 13 });
    qx += w + 0.14;
  });
  tag(s, "PART IV · KULLANICIYI ANLAMAK");
  notes(s, "Öğrenciler persona derslerinde hep 'Ayşe, 28' yazıyor. Sağdaki örneği okutun ve sorun: hangisinden plan çizebilirsiniz?");
}

{
  const s = slide("Ürün analizi teşhirin ölçüsünü belirler", "SIK ATLANAN ADIM");
  s.addText("Raf derinliğini konsept değil, ürün belirler. Ürünü ölçmeden teşhir tasarlanamaz.", {
    x: M, y: 1.68, w: 11.6, h: 0.4, isTextBox: true, margin: 0, fontFace: BF, fontSize: 15.5, color: TEXT
  });
  const rows = [
    ["Boyut ve ağırlık", "Raf derinliği, modül ölçüsü, taşıyıcı ve askı seçimi"],
    ["Kırılganlık", "Açık raf mı, vitrin dolabı mı — dokunma izni var mı?"],
    ["Çeşit sayısı (SKU)", "m² başına yoğunluk, depo büyüklüğü"],
    ["Fiyat segmenti", "Pahalı ürün = az ürün + çok boşluk. Yoğunluk ucuzluk sinyalidir"],
    ["Stok devir hızı", "Depo m²'si ve mal kabul sıklığı"],
    ["Duyusal ilişki", "Dokunuluyor / deneniyor / koklanıyor / tadılıyor mu?"]
  ];
  const data = [[th("NEYE BAKACAKSINIZ"), th("HANGİ TASARIM KARARINI BELİRLER")]];
  rows.forEach((r, i) => data.push([
    { text: r[0], options: { bold: true, color: i === 3 ? ACC : INK, fontFace: BF } },
    { text: r[1], options: { color: i === 3 ? ACC : TEXT, bold: i === 3 } }
  ]));
  s.addTable(data, { x: M, y: 2.2, w: W, colW: [3.6, 8.49], rowH: 0.55, ...TBL });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 5.75, w: W, h: 0.95, rectRadius: 0.1, fill: { color: INK }, line: { color: INK } });
  s.addText("Aynı 100 m²'ye 50 ürün mü koyalım, 500 ürün mü? — Cevap markada değil, fiyat segmentinde.", {
    x: M + 0.35, y: 5.75, w: W - 0.7, h: 0.95, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 19, bold: true, color: "FFFFFF", valign: "middle"
  });
  tag(s, "PART IV · KULLANICIYI ANLAMAK");
  notes(s, "Turuncu satır en önemlisi. Öğrenciler lüks marka seçip mekânı ürünle dolduruyor, sonra 'neden ucuz duruyor' diye şaşırıyor.");
}

/* =========================================================
   PART V — Spatial Behaviour & Customer Journey
   ========================================================= */
divider("V", "Spatial Behaviour & Customer Journey", "Mekânsal davranış ve müşteri yolculuğu", "HAFTA 3");

{
  const s = slide("Müşteri yolculuğu", "YEDİ AN, YEDİ TASARIM SORUSU");
  const rows = [
    ["Çekim", "Attract", "Cepheden ne görünüyor? 30 / 10 / 3 metreden ne okunuyor?"],
    ["Eşik", "Threshold", "Girerken ne değişiyor — ışık, ses, koku, sıcaklık, zemin?"],
    ["Yönelme", "Orientation", "Nereye gideceğimi nasıl anlıyorum?"],
    ["Gezinme", "Browsing", "Ürünü nasıl tarıyorum? Ne kadar sürüyor?"],
    ["Etkileşim", "Interaction", "Dokunuyor muyum? Deniyor muyum? Kime soruyorum?"],
    ["Satın alma", "Purchase", "Kasa nerede? Kuyruk nerede? Poşetleme nerede?"],
    ["Ayrılma", "Departure", "Çıkarken ne hissediyorum? Elimde ne var?"]
  ];
  const data = [[th("AN"), th(""), th("MEKÂNSAL SORU")]];
  rows.forEach((r, i) => data.push([
    { text: r[0], options: { bold: true, color: INK, fontFace: BF } },
    { text: r[1], options: { color: MUTED, italic: true, fontSize: 11 } },
    { text: r[2], options: { color: TEXT } }
  ]));
  s.addTable(data, { x: M, y: 1.75, w: W, colW: [1.8, 1.7, 8.59], rowH: 0.52, ...TBL });
  s.addText("Bu yedi an, dönem boyunca hem tasarım hem değerlendirme çerçeveniz. Vize ve final rubriğindeki başlıklar bunlar.", {
    x: M, y: 5.9, w: 11.6, h: 0.5, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, bold: true, color: SLATE, lineSpacing: 20
  });
  tag(s, "PART V · MEKÂNSAL DAVRANIŞ VE MÜŞTERİ YOLCULUĞU");
  notes(s, "Bu tabloyu öğrencilere çıktı olarak da verin. Dönem boyunca kritikte bu yedi başlığa dönüp duracaksınız.");
}

{
  const s = slide("Mağaza planlamanın gramerleri", "HERKESİN BİLDİĞİ AMA ÖĞRENCİNİN ATLADIĞI");
  card(s, M, 1.75, 3.87, 2.1, "Dekompresyon bölgesi",
       "Girişten sonraki ilk 2–4 metre. Müşteri hâlâ dışarıdan içeriye geçiş yapıyor — ışığa, sese, kokuya alışıyor.\n\nBuraya değerli ürün konmaz. Konursa görülmez.");
  card(s, M + 4.03, 1.75, 3.87, 2.1, "Güç duvarı",
       "İnsanların büyük çoğunluğu girer girmez sağa yönelir. Sağdaki ilk büyük yüzey markanın ne olduğunu tek bakışta söylemeli.\n\nEn iyi ürün, en güçlü mesaj burada.");
  card(s, M + 8.06, 1.75, 3.87, 2.1, "Altın bant",
       "Yerden yaklaşık 120–150 cm arası, göz hizası. Dikkatin yoğunlaştığı bant.\n\nBu bandın üstü ve altı farklı iş görür — üstü işaret, altı stok.");

  s.addText("Plan tipleri", { x: M, y: 4.15, w: W, h: 0.32, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, bold: true, color: ACC, charSpacing: 1 });
  const plans = [
    ["Izgara", "Süpermarket mantığı. Verimli, tahmin edilebilir, sıkıcı."],
    ["Serbest akış", "Butik mantığı. Keşif hissi yüksek, alan verimi düşük."],
    ["Döngü (loop)", "Müşteriyi tüm mağazadan geçiren tek rota."],
    ["Çapraz", "Açılı yerleşim, görüş hatlarını uzatır, ürünü sürekli yeni gösterir."]
  ];
  let px = M;
  plans.forEach(pl => {
    s.addShape(p.ShapeType.roundRect, { x: px, y: 4.55, w: 2.92, h: 1.4, rectRadius: 0.07, fill: { color: "FFFFFF" }, line: { color: LINE, width: 1 } });
    s.addText(pl[0], { x: px + 0.18, y: 4.7, w: 2.56, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5, bold: true, color: INK });
    s.addText(pl[1], { x: px + 0.18, y: 5.02, w: 2.56, h: 0.85, isTextBox: true, margin: 0, fontFace: BF, fontSize: 11.5, color: MUTED, lineSpacing: 15 });
    px += 3.06;
  });
  s.addText("Görüş hatları her plan tipinin üstünde: girişten bakınca mağazanın derinliği okunuyor mu? Okunmuyorsa müşteri içeri girmez.", {
    x: M, y: 6.15, w: 11.6, h: 0.5, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5, italic: true, color: SLATE, lineSpacing: 19
  });
  tag(s, "PART V · MEKÂNSAL DAVRANIŞ VE MÜŞTERİ YOLCULUĞU");
  notes(s, "Bu slaydın içeriği Hafta 5 mikro-dersinde tekrar açılacak. Bugün sadece kavramları tanıtın.");
}

{
  const s = slide("Yolculuğun görünmeyen tarafı", "PERSONELİN GÜNÜ");
  s.addText("Bir mağaza sadece müşterinin gördüğü yer değildir. Ve stüdyoda en çok puan burada kaybediliyor.", {
    x: M, y: 1.7, w: 11.6, h: 0.4, isTextBox: true, margin: 0, fontFace: BF, fontSize: 15.5, color: TEXT
  });
  const steps = ["Sabah açılış", "Mal kabul", "Depolama", "Stok tazeleme", "Satış ve danışma", "Kasa", "Mola", "Kapanış ve sayım"];
  let sx = M, sy = 2.3;
  steps.forEach((st, i) => {
    if (i === 4) { sx = M; sy = 3.25; }
    const w = 2.92;
    s.addShape(p.ShapeType.roundRect, { x: sx, y: sy, w: w, h: 0.72, rectRadius: 0.07, fill: { color: INK }, line: { color: INK } });
    s.addText(String(i + 1), { x: sx + 0.16, y: sy, w: 0.4, h: 0.72, isTextBox: true, margin: 0, fontFace: HF, fontSize: 16, bold: true, color: ACC, valign: "middle" });
    s.addText(st, { x: sx + 0.6, y: sy, w: w - 0.75, h: 0.72, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, color: "FFFFFF", valign: "middle" });
    sx += w + 0.14;
  });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 4.3, w: W, h: 0.95, rectRadius: 0.1, fill: { color: TINTA }, line: { color: "F0CBBA", width: 1 } });
  s.addText("Kural: personelin mal kabul rotası, müşterinin dolaşım rotasıyla kesişmemeli.", {
    x: M + 0.35, y: 4.3, w: W - 0.7, h: 0.95, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 20, bold: true, color: ACC, valign: "middle"
  });
  s.addText("Tasarlamak zorunda olduğunuz \"arka\" alanlar", { x: M, y: 5.45, w: W, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13, bold: true, color: INK });
  const back = ["Kasa ve kasa arkası yönetim", "Depo — satış alanının %15–25'i", "Personel soyunma, dinlenme, WC", "Mal kabul ve servis rotası"];
  let bx2 = M;
  back.forEach(b => {
    s.addShape(p.ShapeType.roundRect, { x: bx2, y: 5.85, w: 2.92, h: 0.72, rectRadius: 0.07, fill: { color: TINT }, line: { color: "D6E0E2", width: 1 } });
    s.addText(b, { x: bx2 + 0.14, y: 5.85, w: 2.64, h: 0.72, isTextBox: true, margin: 0, fontFace: BF, fontSize: 11.5, color: INK, align: "center", valign: "middle", lineSpacing: 14 });
    bx2 += 3.06;
  });
  tag(s, "PART V · MEKÂNSAL DAVRANIŞ VE MÜŞTERİ YOLCULUĞU");
  notes(s, "Bu slaytı sertçe vurgulayın. Aynı dersin ölçülmüş verisinde en zayıf başlık tam olarak bu ('organizasyonel ihtiyaçlar', 5 üzerinden 2.84). Hafta 8'de bir atölye günü buna ayrılacak.");
}

/* =========================================================
   PART VI — Atmosphere & Multisensory
   ========================================================= */
divider("VI", "Atmosphere & Multisensory Experience", "Atmosfer ve çok duyulu deneyim", "HAFTA 3 + ATÖLYE");

{
  const s = slide("Mekânı beş duyuyla yaşıyoruz, ama göze tasarlıyoruz", "PALLASMAA");
  s.addText("\"Mimarlığın gözün tekeline girmesi, bedeni ve diğer duyuları dışarıda bırakır.\"", {
    x: M, y: 1.75, w: 11.6, h: 0.9, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 25, italic: true, color: INK, lineSpacing: 34
  });
  s.addText("Juhani Pallasmaa, Tenin Gözleri (2005)", { x: M, y: 2.72, w: 8, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12, color: MUTED });
  s.addText("Mağaza, bu tekeli kırmak için en uygun laboratuvardır — çünkü duyusal tasarımın burada ticari bir karşılığı da var.", {
    x: M, y: 3.2, w: 11.6, h: 0.58, isTextBox: true, margin: 0, fontFace: BF, fontSize: 15.5, color: TEXT
  });
  const senses = [
    ["Görme", "Işık, renk, kontrast, görüş hattı"],
    ["Dokunma", "Malzeme, doku, sıcaklık, zeminin sertliği"],
    ["İşitme", "Akustik, müzik, sessizlik, ürünün sesi"],
    ["Koklama", "Ürünün, malzemenin, bir tezgâhın kokusu"],
    ["Tat", "Tadım, ikram, ağızda kalan"],
    ["Beden", "Isı, hava akımı, kot farkı, hareket"]
  ];
  let x = M, y = 3.9;
  senses.forEach((sn, i) => {
    if (i === 3) { x = M; y = 5.25; }
    const w = 3.87;
    s.addShape(p.ShapeType.roundRect, { x: x, y: y, w: w, h: 1.15, rectRadius: 0.08, fill: { color: TINT }, line: { color: "D6E0E2", width: 1 } });
    s.addText(sn[0], { x: x + 0.24, y: y + 0.18, w: w - 0.48, h: 0.34, isTextBox: true, margin: 0, fontFace: HF, fontSize: 18, bold: true, color: INK });
    s.addText(sn[1], { x: x + 0.24, y: y + 0.56, w: w - 0.48, h: 0.5, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12, color: MUTED, lineSpacing: 16 });
    x += w + 0.16;
  });
  tag(s, "PART VI · ATMOSFER VE ÇOK DUYULU DENEYİM");
  notes(s, "Altı satırı okuyun ve 'beden'i vurgulayın — öğrenciler beş duyuyu sayıyor ama ısı, hava akımı ve kot farkını mekânsal bir duyu olarak düşünmüyor.");
}

{
  const s = slide("Duyu × Yolculuk Matrisi", "BU DERSİN ANA ARACI");
  s.addText("Her hücre tek bir soruyu yanıtlar: bu anda bu duyuyu taşıyan somut tasarım kararı nedir?", {
    x: M, y: 1.68, w: 11.6, h: 0.35, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14.5, color: TEXT
  });
  const data = [
    [th("DUYU"), th("ÇEKİM"), th("EŞİK"), th("GEZİNME"), th("ETKİLEŞİM")],
    [
      { text: "Koklama", options: { bold: true, color: INK, fontFace: BF } },
      { text: "Kapı hattından dışarı sızan hafif kavurma kokusu", options: { color: TEXT, fontSize: 11 } },
      { text: "Ahşap ve mumun doğal kokusu — difüzör yok", options: { color: TEXT, fontSize: 11 } },
      { text: "Ürün açık kaplarda, koklanabilir", options: { color: TEXT, fontSize: 11 } },
      { text: "İMZA AN — koklama tezgâhı: 8 açık cam kavanoz, 90 cm, üstten nokta ışık → 1/10 detay", options: { color: ACC, bold: true, fontSize: 11, fill: { color: TINTA } } }
    ],
    [
      { text: "Görme", options: { bold: true, color: INK, fontFace: BF } },
      { text: "Gece cephesinde tek sıcak ışık lekesi", options: { color: MUTED, fontSize: 11 } },
      { text: "Dışarıdan içeriye kontrast düşüşü", options: { color: MUTED, fontSize: 11 } },
      { text: "Çuvalların rengi, kavurma tonları", options: { color: MUTED, fontSize: 11 } },
      { text: "Kavurma makinesinin görünürlüğü", options: { color: MUTED, fontSize: 11 } }
    ]
  ];
  s.addTable(data, { x: M, y: 2.2, w: W, colW: [1.5, 2.65, 2.65, 2.65, 2.64], rowH: 0.95, ...TBL });
  s.addText("Örnek: bir kahve kavurucusu için doldurulmuş iki satır. Gerçek matriste 6 duyu × 7 an vardır.", {
    x: M, y: 5.15, w: 11.6, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 11, italic: true, color: MUTED
  });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 5.6, w: W, h: 1.05, rectRadius: 0.1, fill: { color: INK }, line: { color: INK } });
  s.addText("KURAL — İMZA ANLAR", { x: M + 0.35, y: 5.75, w: 5, h: 0.26, isTextBox: true, margin: 0, fontFace: BF, fontSize: 10, bold: true, color: ACC, charSpacing: 2 });
  s.addText("Üç hücre seçip \"İmza An\" ilan edeceksiniz. Bu üçü finalde 1/20 veya daha büyük ölçekte çizilmek zorunda.", {
    x: M + 0.35, y: 6.0, w: W - 0.7, h: 0.62, isTextBox: true, margin: 0, fontFace: HF, fontSize: 16, bold: true, color: "FFFFFF"
  });
  tag(s, "PART VI · ATMOSFER VE ÇOK DUYULU DENEYİM");
  notes(s, "Bu, dersin en ayırt edici aracı. Boş matris şablonunu Hafta 3'te dağıtacaksınız. Vurgu: duyusal fikir mood board'da kalmayacak, çizime dönüşecek.");
}

{
  const s = slide("Duyusal uyum ve kabul edilmeyenler", "SPENCE (2014)");
  s.addShape(p.ShapeType.roundRect, { x: M, y: 1.72, w: 5.9, h: 2.62, rectRadius: 0.08, fill: { color: TINTA }, line: { color: "F0CBBA", width: 1 } });
  s.addText("Duyusal uyum — congruence", { x: M + 0.28, y: 1.95, w: 5.35, h: 0.32, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, bold: true, color: ACC });
  s.addText("Birbiriyle uyumsuz duyusal ipuçları, hiç olmamasından daha kötü sonuç verir.", {
    x: M + 0.28, y: 2.35, w: 5.35, h: 0.6, isTextBox: true, margin: 0, fontFace: HF, fontSize: 16, bold: true, color: INK, lineSpacing: 21
  });
  s.addText("Uyumlu koku + müzik ikilisi memnuniyeti artırıyor; uyumsuz ikili değerlendirmeyi düşürüyor.\n\nRastgele \"havalı\" katman eklemeyin — hepsi aynı hikâyeyi anlatmalı.", {
    x: M + 0.28, y: 3.0, w: 5.35, h: 1.25, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, color: TEXT, lineSpacing: 17
  });

  s.addShape(p.ShapeType.roundRect, { x: 6.85, y: 1.72, w: 5.86, h: 2.62, rectRadius: 0.08, fill: { color: "FFFFFF" }, line: { color: LINE, width: 1 } });
  s.addText("Sakin bir eşik istiyorsanız", { x: 7.13, y: 1.95, w: 5.3, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13, bold: true, color: MUTED });
  s.addText("orada yüksek tempolu müzik olamaz.\nGüçlü bir koku olamaz.\nKeskin bir ışık kontrastı olamaz.", {
    x: 7.13, y: 2.32, w: 5.3, h: 1.18, isTextBox: true, margin: 0, fontFace: HF, fontSize: 16, color: INK, lineSpacing: 24
  });
  s.addText("Aynı sütundaki hücreler çelişmemeli — matrisin üçüncü kuralı budur.", {
    x: 7.13, y: 3.6, w: 5.3, h: 0.6, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, bold: true, color: SLATE, lineSpacing: 17
  });

  s.addText("Bu derste kabul edilmeyenler", { x: M, y: 4.55, w: W, h: 0.35, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, bold: true, color: ACC, charSpacing: 1 });
  const bad = [
    "Duvara asılan ekran  =  \"dijital deneyim\" değil",
    "Difüzör  =  koku tasarımı değil",
    "Yeşil bitki duvarı + neon yazı + terrazzo  =  konsept değil",
    "\"Instagrammable köşe\"  bir strateji değil, bir sonuçtur",
    "Mood board'da olup planda karşılığı olmayan hiçbir şey puan almaz"
  ];
  let by2 = 4.95;
  bad.forEach(b => {
    s.addText("✕", { x: M, y: by2, w: 0.35, h: 0.36, isTextBox: true, margin: 0, fontFace: BF, fontSize: 15, bold: true, color: ACC });
    s.addText(b, { x: M + 0.38, y: by2, w: 11.4, h: 0.36, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, color: TEXT, valign: "middle" });
    by2 += 0.38;
  });
  tag(s, "PART VI · ATMOSFER VE ÇOK DUYULU DENEYİM");
  notes(s, "'Kabul edilmeyenler' listesini çıktı olarak da verin ve duvara asın. Dönem boyunca bu beş maddeyi göstererek kritik verebilirsiniz.");
}

/* =========================================================
   PART VII — Product, Display & Visual Merchandising
   ========================================================= */
divider("VII", "Product, Display & Visual Merchandising", "Ürün, teşhir ve görsel düzenleme", "HAFTA 9");

{
  const s = slide("Teşhir sistemleri", "ÜRÜN TİPİ SİSTEMİ SEÇER");
  const sys = [
    ["Duvar sistemi", "Yoğun stok, dikey kullanım. Ray/panel ile esnek."],
    ["Ada (gondol)", "Ortada durur, etrafından dolaşılır. Rotayı kurar."],
    ["Masa / platform", "Öne çıkan az sayıda ürün. Dokunmayı davet eder."],
    ["Vitrin dolabı", "Değerli veya kırılgan ürün. Dokunma izni yok."],
    ["Manken / büst", "Ürünü bedende gösterir. Tekstil ve aksesuar."],
    ["Asma sistem", "Tavandan iner. Hafif ürün, esnek düzen."]
  ];
  let x = M, y = 1.78;
  sys.forEach((sy, i) => {
    if (i === 3) { x = M; y = 3.42; }
    card(s, x, y, 3.87, 1.45, sy[0], sy[1]);
    x += 4.03;
  });
  s.addText("Sormanız gereken iki soru", { x: M, y: 5.1, w: W, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5, bold: true, color: ACC, charSpacing: 1 });
  iconRow(s, M, 5.5, 5.8, 1, "Sezon değişince ne değişiyor?", "Sabit mobilya mı tasarlıyorsunuz, yoksa dönüşebilir bir sistem mi? Küçük marka için ikincisi genelde doğru.");
  iconRow(s, 6.85, 5.5, 5.86, 2, "Kampanya alanı var mı?", "Markanın indirim, yeni ürün veya iş birliği anlarında kullanacağı esnek bir alan ayırdınız mı?");
  tag(s, "PART VII · ÜRÜN, TEŞHİR VE GÖRSEL DÜZENLEME");
  notes(s, "Hafta 9'da bu slayt tekrar açılacak. Bugün sadece kavram tanıtımı.");
}

{
  const s = slide("Vitrin: üç mesafe testi", "ATÖLYE A'NIN ANA EGZERSİZİ");
  s.addText("Vitrin bir reklam panosu değil, mekânın ilk odasıdır. Ve marina gibi açık hava bir yerleşimde vitrin, işin tamamına yakınıdır.", {
    x: M, y: 1.68, w: 11.6, h: 0.45, isTextBox: true, margin: 0, fontFace: BF, fontSize: 15, color: TEXT
  });
  const dists = [
    ["30 m", "Promenadın karşı ucundan", "Silüet, ışık lekesi, tabela. Marka okunmuyor — sadece bir şeyin orada olduğu okunuyor."],
    ["10 m", "Yürüyüş hattından", "Marka adı, vitrinin kurgusu, içerinin derinliği. Durup durmama kararı burada veriliyor."],
    ["3 m", "Vitrinin önünde", "Ürünün kendisi, etiket, doku, fiyat. İçeri girme kararı burada veriliyor."]
  ];
  let dx = M;
  dists.forEach((d, i) => {
    const w = 3.87;
    s.addShape(p.ShapeType.roundRect, { x: dx, y: 2.35, w: w, h: 2.55, rectRadius: 0.09, fill: { color: i === 1 ? INK : "FFFFFF" }, line: { color: i === 1 ? INK : LINE, width: 1 } });
    s.addText(d[0], { x: dx + 0.26, y: 2.55, w: w - 0.5, h: 0.75, isTextBox: true, margin: 0, fontFace: HF, fontSize: 40, bold: true, color: i === 1 ? ACC : SLATE });
    s.addText(d[1], { x: dx + 0.26, y: 3.32, w: w - 0.5, h: 0.32, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, bold: true, color: i === 1 ? "FFFFFF" : INK });
    s.addText(d[2], { x: dx + 0.26, y: 3.7, w: w - 0.5, h: 1.05, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12, color: i === 1 ? "AFC3C9" : MUTED, lineSpacing: 16 });
    dx += w + 0.16;
  });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 5.15, w: W, h: 1.4, rectRadius: 0.1, fill: { color: TINT }, line: { color: "D6E0E2", width: 1 } });
  s.addText("Marina için ek bir katman: gece", { x: M + 0.35, y: 5.32, w: 11.4, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5, bold: true, color: ACC });
  s.addText("Marina akşam canlanır. Yani vitrininizin gece görünümü, gündüz görünümünden daha önemli olabilir. Cephe aydınlatmasını dekoratif bir ek olarak değil, tasarımın ana kararı olarak düşünün.", {
    x: M + 0.35, y: 5.68, w: 11.4, h: 0.75, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, color: INK, lineSpacing: 20
  });
  tag(s, "PART VII · ÜRÜN, TEŞHİR VE GÖRSEL DÜZENLEME");
  notes(s, "Üç mesafe testi Hafta 7 atölyesinde çizilecek bir egzersiz. Bugün fikri ekin — özellikle gece meselesini, çünkü marina projesinde belirleyici.");
}

/* =========================================================
   PART VIII — Light, Material, Color & Sound
   ========================================================= */
divider("VIII", "Light, Material, Color & Sound", "Işık, malzeme, renk, ses", "HAFTA 10 — ATÖLYE C");

{
  const s = slide("Aydınlatma dört katmandır", "TEK BİR GENEL IŞIK YETMEZ");
  const layers = [
    ["Genel", "Mekânın temel görülebilirliği. Yeterli ama düz."],
    ["Vurgu", "Ürünü öne çıkarır. Genel ışığın 3–5 katı."],
    ["Dekoratif", "Kendisi bir nesne. Marka kişiliğini taşır."],
    ["Vitrin", "Dışarıdan okunur. Gündüz ve gece ayrı hesaplanır."]
  ];
  let lx = M;
  layers.forEach((l, i) => {
    const w = 2.92;
    s.addShape(p.ShapeType.roundRect, { x: lx, y: 1.78, w: w, h: 1.5, rectRadius: 0.08, fill: { color: i === 1 ? TINTA : "FFFFFF" }, line: { color: i === 1 ? "F0CBBA" : LINE, width: 1 } });
    s.addText(l[0], { x: lx + 0.2, y: 1.96, w: w - 0.4, h: 0.35, isTextBox: true, margin: 0, fontFace: HF, fontSize: 19, bold: true, color: i === 1 ? ACC : INK });
    s.addText(l[1], { x: lx + 0.2, y: 2.36, w: w - 0.4, h: 0.8, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12, color: i === 1 ? INK : MUTED, lineSpacing: 16 });
    lx += w + 0.14;
  });
  s.addText("Üç teknik değişken", { x: M, y: 3.5, w: W, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5, bold: true, color: ACC, charSpacing: 1 });
  stat(s, M, 3.9, 3.6, "3:1 – 5:1", "Kontrast oranı\nVurgu ışığının genel ışığa oranı.\nDaha azı düz, daha fazlası rahatsız.", INK);
  stat(s, M + 4.1, 3.9, 3.6, "CRI", "Renk geriverimi\nÜrünün rengi doğru görünüyor mu?\nTekstil ve gıdada belirleyici.", INK);
  stat(s, M + 8.2, 3.9, 3.6, "K", "Renk sıcaklığı\nSıcak mı serin mi?\nMarka kişiliğiyle uyumlu olmalı.", INK);
  s.addShape(p.ShapeType.roundRect, { x: M, y: 5.85, w: W, h: 0.85, rectRadius: 0.1, fill: { color: INK }, line: { color: INK } });
  s.addText("Aydınlatma kararlarınız tavan planında gösterilecek — \"render'da güzel duruyordu\" bir çözüm değildir.", {
    x: M + 0.35, y: 5.85, w: W - 0.7, h: 0.85, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 17, bold: true, color: "FFFFFF", valign: "middle"
  });
  tag(s, "PART VIII · IŞIK, MALZEME, RENK, SES");
  notes(s, "Aydınlatmayı Hafta 10 atölyesinde derinleştireceksiniz. Bugün dört katman + kontrast oranı fikri yeterli.");
}

{
  const s = slide("Malzeme, ses ve koku", "ATMOSFERİN GERİ KALANI");
  card(s, M, 1.78, 3.87, 2.5, "Malzeme ve doku",
       "Dokunulan yüzeyler ve dokunulmayanlar ayrı düşünülür.\n\nAşınma, temizlik, maliyet, sökülebilirlik.\n\nZemin ayrı bir konu: sertliği, sesi, yürüme hissi.");
  card(s, M + 4.03, 1.78, 3.87, 2.5, "Akustik ve müzik",
       "Yansıma yüzeyleri gürültüyü belirler.\n\nMüziğin temposu kalış süresini etkiler.\n\nHer mağazada bir sessiz bölge olmalı — deneme kabini, danışma noktası.");
  card(s, M + 8.06, 1.78, 3.87, 2.5, "Koku", "Difüzör bir tasarım kararı değildir.\n\nKoku kaynaktan gelmeli: ürünün kendisi, malzeme (ahşap, deri, kahve), bir hazırlık tezgâhı, taze bir yüzey.", true);

  s.addShape(p.ShapeType.roundRect, { x: M, y: 4.5, w: W, h: 2.05, rectRadius: 0.1, fill: { color: TINT }, line: { color: SLATE, width: 1.25 } });
  s.addText("MERSİN MARİNA — MALZEME KISITI", { x: M + 0.35, y: 4.68, w: 11.4, h: 0.28, isTextBox: true, margin: 0, fontFace: BF, fontSize: 10.5, bold: true, color: ACC, charSpacing: 2 });
  s.addText("Açık hava bir yerleşimde tasarlıyorsunuz. Bu, malzeme seçimini kapalı bir AVM'den tamamen ayırır.", {
    x: M + 0.35, y: 5.0, w: 11.4, h: 0.35, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, bold: true, color: INK
  });
  const cons = ["Tuzlu hava — metal korozyonu", "UV — renk solması, plastik yorulması", "Nem ve tuz — ahşap ve tekstil", "Mevsimsellik — yaz zirvesi, kış sakin"];
  let cx = M + 0.35;
  cons.forEach(c => {
    s.addShape(p.ShapeType.roundRect, { x: cx, y: 5.5, w: 2.78, h: 0.78, rectRadius: 0.07, fill: { color: "FFFFFF" }, line: { color: LINE, width: 1 } });
    s.addText(c, { x: cx + 0.12, y: 5.5, w: 2.54, h: 0.78, isTextBox: true, margin: 0, fontFace: BF, fontSize: 11.5, color: INK, align: "center", valign: "middle", lineSpacing: 14 });
    cx += 2.9;
  });
  tag(s, "PART VIII · IŞIK, MALZEME, RENK, SES");
  notes(s, "Malzeme kısıtı slaydı bu projeye özel. Öğrenciler kapalı AVM mantığıyla malzeme seçiyor; marina bunu affetmez. Hafta 2 saha gezisinde mevcut dükkânların malzemelerinin nasıl yaşlandığına baktırın.");
}

/* =========================================================
   PART IX — What Makes a Good Retail Space?
   ========================================================= */
divider("IX", "What Makes a Good Retail Space?", "İyi bir mağaza mekânını ne yapar?", "HAFTA 1 — SENTEZ");

{
  const s = slide("Dokuz kontrol sorusu", "DÖNEM BOYUNCA KENDİNİZE SORUN");
  const checks = [
    "Bu mekân hangi markaya ait olduğunu söylemeden anlatabiliyor mu?",
    "30 metreden bakınca burada bir şey olduğu anlaşılıyor mu?",
    "Girdikten sonraki ilk üç saniyede nereye gideceğimi biliyor muyum?",
    "Ürüne dokunma izni mekân tarafından açıkça veriliyor mu?",
    "Bir çekim çekirdeği var mı — insanın anlatacağı tek şey?",
    "Personel bu mekânda bir gün geçirebilir mi?",
    "Sezon değiştiğinde bu mekân değişebilir mi?",
    "Duyusal kararlar birbiriyle uyumlu mu?",
    "Herkes bu mekâna girebiliyor mu?"
  ];
  let cy = 1.72;
  checks.forEach((c, i) => {
    const dark = [4, 5].includes(i);
    s.addShape(p.ShapeType.roundRect, { x: M, y: cy, w: W, h: 0.55, rectRadius: 0.07, fill: { color: dark ? INK : "FFFFFF" }, line: { color: dark ? INK : LINE, width: 1 } });
    s.addText(String(i + 1).padStart(2, "0"), { x: M + 0.22, y: cy, w: 0.55, h: 0.55, isTextBox: true, margin: 0, fontFace: HF, fontSize: 15, bold: true, color: dark ? ACC : SLATE, valign: "middle" });
    s.addText(c, { x: M + 0.85, y: cy, w: W - 1.1, h: 0.55, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14, color: dark ? "FFFFFF" : TEXT, valign: "middle" });
    cy += 0.6;
  });
  s.addText("Koyu iki satır, aynı dersin ölçülmüş verisinde öğrencilerin en zayıf olduğu alanlar.", {
    x: M, y: 7.05, w: W, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 10.5, italic: true, color: MUTED
  });
  notes(s, "Bu dokuz soruyu çıktı olarak verin. Her kritikte 'hangi soruyu henüz cevaplamadın' diye sorabilirsiniz. 5 ve 6 numaralı sorular ölçümde en zayıf çıkan alanlara denk geliyor.");
}

/* =========================================================
   PROJECT — Mersin Marina
   ========================================================= */
divider("", "The Project", "Proje: Mersin Marina", "BU DÖNEM", "BU DÖNEMİN PROJESİ");

{
  const s = slide("Proje tanımı", "MERSİN MARİNA");
  s.addText("Fiziksel mağazası olmayan, ağırlıklı olarak çevrimiçi satan küçük bir markanın ilk mağazasını tasarlayacaksınız.", {
    x: M, y: 1.7, w: 11.6, h: 0.92, isTextBox: true, margin: 0, fontFace: HF, fontSize: 21, bold: true, color: INK, lineSpacing: 29
  });
  s.addText("Mekân verilidir ve herkes aynı kabuk üzerinde çalışacak. Marka sizin bulacağınız ve hocanızın onaylayacağı olacak.", {
    x: M, y: 2.55, w: 11.6, h: 0.45, isTextBox: true, margin: 0, fontFace: BF, fontSize: 15, color: TEXT
  });
  imgSlot(s, M, 3.15, 6.0, 3.3, "GÖRSEL YERİ\nMersin Marina — vaziyet planı ve proje alanının işaretlenmiş hâli\n(hoca ekleyecek)");
  s.addText("Bilmeniz gerekenler", { x: 6.95, y: 3.15, w: 5.76, h: 0.32, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5, bold: true, color: ACC, charSpacing: 1 });
  const facts = [
    ["Konum", "Mersin Marina, Yenişehir"],
    ["Alan", "[hoca dolduracak] m²"],
    ["Kat", "[hoca dolduracak]"],
    ["Tavan yüksekliği", "[hoca dolduracak] m"],
    ["Cephe / vitrin hattı", "[hoca dolduracak] m"],
    ["Saha gezisi", "Hafta 2"]
  ];
  let fy = 3.58;
  facts.forEach((f, i) => {
    s.addShape(p.ShapeType.rect, { x: 6.95, y: fy, w: 5.76, h: 0.46, fill: { color: i % 2 ? "FFFFFF" : "EDF1F1" }, line: { width: 0, color: "FFFFFF" } });
    s.addText(f[0], { x: 7.12, y: fy, w: 2.5, h: 0.46, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, bold: true, color: INK, valign: "middle" });
    s.addText(f[1], { x: 9.7, y: fy, w: 2.85, h: 0.46, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, color: MUTED, valign: "middle" });
    fy += 0.46;
  });
  tag(s, "PROJE · MERSİN MARİNA");
  notes(s, "Alan bilgilerini kendi rölövenizle doldurun. Görsel yerine marina vaziyet planını ve proje alanının fotoğraflarını koyun.");
}

{
  const s = slide("Marina, kapalı bir AVM değildir", "ALTI BAĞLAM KISITI");
  s.addText("Bu proje bir alışveriş merkezi içinde değil. Bu, tasarım kararlarınızın çoğunu değiştirir.", {
    x: M, y: 1.68, w: 11.6, h: 0.4, isTextBox: true, margin: 0, fontFace: BF, fontSize: 15, color: TEXT
  });
  const ctx = [
    ["Açık hava", "Vitrininiz iklime açık. Güneş, yağmur, rüzgâr ve tuz artık malzeme kararınızın parçası."],
    ["Akşam kullanımı", "Marina akşam canlanır. Gece cephesi ve aydınlatma, gündüzden daha belirleyici."],
    ["Yaya promenadı", "Müşteri otoparktan değil, yürüyüş hattından geliyor. Vitrin yürürken okunuyor."],
    ["Mevsimsellik", "Yaz zirvesi, kış sakin. Mekân iki farklı yoğunluğa aynı anda cevap vermeli."],
    ["Karma kullanıcı", "Tekne sahibi, Mersinli aile, turist. Üç farklı hız, üç farklı beklenti."],
    ["Deniz ve manzara", "Bir yön diğerlerinden değerli. Vista, plan kararınızın girdisi."]
  ];
  let x = M, y = 2.2;
  ctx.forEach((c, i) => {
    if (i === 3) { x = M; y = 4.35; }
    const w = 3.87;
    s.addShape(p.ShapeType.roundRect, { x: x, y: y, w: w, h: 1.95, rectRadius: 0.09, fill: { color: i === 1 ? INK : TINT }, line: { color: i === 1 ? INK : "D6E0E2", width: 1 } });
    s.addText(c[0], { x: x + 0.26, y: y + 0.2, w: w - 0.5, h: 0.4, isTextBox: true, margin: 0, fontFace: HF, fontSize: 19, bold: true, color: i === 1 ? ACC : INK });
    s.addText(c[1], { x: x + 0.26, y: y + 0.68, w: w - 0.5, h: 1.1, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, color: i === 1 ? "C6D5D9" : TEXT, lineSpacing: 17 });
    x += w + 0.16;
  });
  tag(s, "PROJE · MERSİN MARİNA");
  notes(s, "Hafta 2 saha gezisinde bu altı maddeyi elinize alın ve mevcut dükkânlar üzerinden tek tek gösterin. Hangi dükkân akşam çalışıyor, hangisinin malzemesi yıpranmış, hangisi promenaddan okunuyor?");
}

{
  const s = slide("Tasarlayacağınız alanlar", "TESLİM KONTROL LİSTESİ");
  const groups = [
    ["A · Dış kabuk", "Cephe · vitrin · giriş ve eşik · dekompresyon bölgesi", false],
    ["B · Satış alanı", "Güç duvarı · sirkülasyon · yönlendirme · teşhir sistemleri · etkileşim alanı · oturma", false],
    ["C · İşletme tarafı", "Kasa ve kasa arkası · depo · personel alanı ve WC · mal kabul rotası", true],
    ["D · Atmosfer", "Aydınlatma senaryosu · malzeme paleti · akustik · koku kaynağı · ısı ve hava", false],
    ["E · Teknik katman", "Erişilebilirlik · sürdürülebilirlik ve sökülebilirlik · kaçış rotası", false]
  ];
  let gy = 1.8;
  groups.forEach(g => {
    s.addShape(p.ShapeType.roundRect, { x: M, y: gy, w: W, h: 0.88, rectRadius: 0.08, fill: { color: g[2] ? TINTA : "FFFFFF" }, line: { color: g[2] ? "F0CBBA" : LINE, width: 1 } });
    s.addText(g[0], { x: M + 0.3, y: gy, w: 2.9, h: 0.88, isTextBox: true, margin: 0, fontFace: HF, fontSize: 17, bold: true, color: g[2] ? ACC : INK, valign: "middle" });
    s.addText(g[1], { x: M + 3.3, y: gy, w: 8.6, h: 0.88, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13, color: TEXT, valign: "middle", lineSpacing: 17 });
    gy += 1.0;
  });
  s.addText("C grubu turuncu, çünkü en çok puan orada kaybediliyor. Bir mağaza sadece müşterinin gördüğü yer değildir.", {
    x: M, y: 6.85, w: 11.6, h: 0.4, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13, bold: true, color: ACC
  });
  notes(s, "Bu listeyi çıktı olarak dağıtın. Her teslimde 'C grubunu gösterin' diye sorun.");
}

{
  const s = slide("Dönem takvimi ve değerlendirme", "14 HAFTA");
  const phases = [
    ["1–3", "Araştırma ve analiz", "Marka, persona, ürün, mekân · Araştırma sunumu", "%10"],
    ["4–6", "Konsept tasarım", "Senaryo, konsept, zoning · Vize 1", "%25"],
    ["7–11", "Somutlaştırma", "Üç atölye + tasarım geliştirme · Vize 2", "%25"],
    ["12–14", "Detay ve tamamlama", "1/20 ve 1/10 detay, sunum · Final", "%30"]
  ];
  let py = 1.8;
  phases.forEach((ph, i) => {
    const last = i === 3;
    s.addShape(p.ShapeType.roundRect, { x: M, y: py, w: W, h: 1.0, rectRadius: 0.08, fill: { color: last ? INK : "FFFFFF" }, line: { color: last ? INK : LINE, width: 1 } });
    s.addText("HAFTA " + ph[0], { x: M + 0.3, y: py, w: 1.9, h: 1.0, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12, bold: true, color: last ? ACC : SLATE, valign: "middle", charSpacing: 1 });
    s.addText(ph[1], { x: M + 2.3, y: py + 0.16, w: 4.3, h: 0.36, isTextBox: true, margin: 0, fontFace: HF, fontSize: 18, bold: true, color: last ? "FFFFFF" : INK });
    s.addText(ph[2], { x: M + 2.3, y: py + 0.53, w: 6.8, h: 0.36, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, color: last ? "AFC3C9" : MUTED });
    s.addText(ph[3], { x: M + 9.6, y: py, w: 2.3, h: 1.0, isTextBox: true, margin: 0, fontFace: HF, fontSize: 26, bold: true, color: last ? ACC : SLATE, align: "right", valign: "middle" });
    py += 1.1;
  });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 6.25, w: W, h: 0.62, rectRadius: 0.08, fill: { color: TINT }, line: { color: "D6E0E2", width: 1 } });
  s.addText("Stüdyo süreç performansı — katılım, kritik alma, atölye teslimleri", { x: M + 0.3, y: 6.25, w: 9.3, h: 0.62, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13, bold: true, color: INK, valign: "middle" });
  s.addText("%10", { x: M + 9.6, y: 6.25, w: 2.3, h: 0.62, isTextBox: true, margin: 0, fontFace: HF, fontSize: 20, bold: true, color: SLATE, align: "right", valign: "middle" });
  notes(s, "Kurallar: jüriye katılım ve sözlü sunum zorunlu, geç teslim yok, maket zorunlu, kritiğe elinde işle gelmek zorunlu. Bunları burada net söyleyin.");
}

{
  const s = slide("Bu hafta ne yapacaksınız", "İLK ÖDEV");
  s.addShape(p.ShapeType.roundRect, { x: M, y: 1.75, w: W, h: 1.5, rectRadius: 0.1, fill: { color: INK }, line: { color: INK } });
  s.addText("Üç aday marka bulun", { x: M + 0.4, y: 1.95, w: 11.3, h: 0.55, isTextBox: true, margin: 0, fontFace: HF, fontSize: 32, bold: true, color: "FFFFFF" });
  s.addText("Her biri için tek sayfa. Şablon dağıtılacak. Hafta 2 sonunda biri onaylanacak — bir marka bir öğrenci, ilk gelen alır.", {
    x: M + 0.4, y: 2.55, w: 11.3, h: 0.55, isTextBox: true, margin: 0, fontFace: BF, fontSize: 14.5, color: "C6D5D9", lineSpacing: 20
  });
  s.addText("Her aday için cevaplayacağınız sorular", { x: M, y: 3.45, w: W, h: 0.3, isTextBox: true, margin: 0, fontFace: BF, fontSize: 13.5, bold: true, color: ACC, charSpacing: 1 });
  const qq = [
    "Ne satıyor, kaç çeşit ürünü var?",
    "Şu an nerede satıyor — site, Instagram, pazaryeri?",
    "Marka dili nasıl? Üç sıfatla yazın.",
    "Müşterisi kim olabilir?",
    "Neden fiziksel bir mekânı olmalı?",
    "Ürünü koklanır / tadılır / dokunulur / denenir mi?"
  ];
  let qy = 3.88;
  qq.forEach((q, i) => {
    const col = i < 3 ? M : 6.85;
    const yy = 3.88 + (i % 3) * 0.62;
    s.addShape(p.ShapeType.roundRect, { x: col, y: yy, w: i < 3 ? 5.9 : 5.86, h: 0.5, rectRadius: 0.07, fill: { color: "FFFFFF" }, line: { color: LINE, width: 1 } });
    s.addText(q, { x: col + 0.18, y: yy, w: (i < 3 ? 5.9 : 5.86) - 0.36, h: 0.5, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12.5, color: INK, valign: "middle" });
  });
  s.addShape(p.ShapeType.roundRect, { x: M, y: 5.95, w: W, h: 0.75, rectRadius: 0.08, fill: { color: TINTA }, line: { color: "F0CBBA", width: 1 } });
  s.addText("Hafta 2: saha gezisi — Mersin Marina. Fotoğraf makinesi, metre ve defter getirin.", {
    x: M + 0.35, y: 5.95, w: W - 0.7, h: 0.75, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 15, bold: true, color: ACC, valign: "middle"
  });
  notes(s, "Ödevi net verin ve şablonu aynı gün dağıtın. 'Üç aday' kuralı önemli — tek marka isterseniz öğrenci ilk aklına geleni seçiyor ve genelde çok büyük ya da çok boş bir marka çıkıyor.");
}

/* ---------- closing ---------- */
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addShape(p.ShapeType.ellipse, { x: -1.6, y: 3.6, w: 5.4, h: 5.4, fill: { color: INK2 }, line: { color: INK2 } });
  s.addText("\"Bu dönem güzel bir mağaza tasarlamanızı\nistemiyorum.\n\nBir markanın ne olduğunu anlayıp, onu\nbir mekânda insanların bedeniyle\nkarşılaştıracak bir kurgu kurmanızı\nistiyorum.\n\nGüzellik bunun sonucu olacak,\nbaşlangıcı değil.\"", {
    x: 1.4, y: 1.15, w: 10.6, h: 4.75, isTextBox: true, margin: 0,
    fontFace: HF, fontSize: 23, color: "FFFFFF", lineSpacing: 32
  });
  s.addShape(p.ShapeType.rect, { x: 1.4, y: 5.95, w: 2.0, h: 0.035, fill: { color: ACC }, line: { color: ACC } });
  s.addText("Mağaza Tasarımı Proje Stüdyosu  ·  Hafta 1", {
    x: 1.4, y: 6.2, w: 10.6, h: 0.35, isTextBox: true, margin: 0,
    fontFace: BF, fontSize: 13, color: "8FA6AD"
  });
  notes(s, "Kapanış cümlesi. Yavaş okuyun, sonra soru alın.");
}

/* ---------- references ---------- */
{
  const s = slide("Kaynaklar", "OKUMA LİSTESİ");
  const refs = [
    ["Mesher, L. (2010)", "Basics Interior Design: Retail Design. AVA Publishing.", "Bölüm 1–2 — Hafta 1 okuması"],
    ["Underhill, P. (2008)", "Why We Buy: The Science of Shopping. (Türkçesi mevcut)", "Giriş + dekompresyon — Hafta 2"],
    ["Spence, C. et al. (2014)", "\"Store Atmospherics: A Multisensory Perspective.\" Psychology & Marketing, 31(7).", "Özet + sonuç — Hafta 3"],
    ["Zumthor, P. (2006)", "Atmosferler. (Türkçesi mevcut)", "Tamamı, kısa — Hafta 10"],
    ["Quartier, K. et al. (2020)", "\"A Holistic Competence Framework for (Future) Retail Design.\" J. of Retailing and Consumer Services.", "Hoca kaynağı"],
    ["Bükülmez, Girginkaya Akdağ & Ekin (2025)", "\"Retail Design Competencies and Customer Journey Mapping Tools.\" Int. J. of Design Education, 19(2).", "Bu dersin kurgusunun dayanağı"],
    ["Pallasmaa, J. (2005)", "Tenin Gözleri: Mimarlık ve Duyular. YEM Yayın.", "Duyusal çerçeve"]
  ];
  const data = [[th("KAYNAK"), th("KÜNYE"), th("NE ZAMAN")]];
  refs.forEach(r => data.push([
    { text: r[0], options: { bold: true, color: INK, fontFace: BF, fontSize: 11 } },
    { text: r[1], options: { color: TEXT, fontSize: 11 } },
    { text: r[2], options: { color: SLATE, fontSize: 10.5, bold: true } }
  ]));
  s.addTable(data, { x: M, y: 1.75, w: W, colW: [3.0, 6.4, 2.69], rowH: 0.62, ...TBL });
  s.addText("Okuma verdiyseniz stüdyoda 10 dakika konuşun. Konuşulmayan okuma yapılmaz.", {
    x: M, y: 6.5, w: W, h: 0.35, isTextBox: true, margin: 0, fontFace: BF, fontSize: 12, italic: true, color: MUTED
  });
  notes(s, "Tüm listeyi öğrenciye vermeyin — sağ sütundaki 'ne zaman' sırasına göre parça parça verin.");
}

p.writeFile({ fileName: "/tmp/claude-0/-home-user-sanat-ve-mekan/8e32618a-9471-5a88-afa8-31873b734ef0/scratchpad/Magaza-Tasarimi-Teorik-Giris.pptx" })
 .then(f => console.log("WROTE", f));
