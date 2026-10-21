const pptxgen = require("pptxgenjs");
const CM = 0.3937007874;
const c = v => +(v * CM).toFixed(4);
const W = 59.4, H = 84.1;
const ML = 2.0, MR = 2.0, MT = 1.8, MB = 1.8;
const CWD = W - ML - MR;                 // 55.4 cm
const F = "Arial";
const INK = "1A1A1A", GREY = "5A6270", ACC = "8C3A2B", LINE = "C3CAD2";

const pres = new pptxgen();
pres.defineLayout({ name: "A1P", width: c(W), height: c(H) });
pres.layout = "A1P";
pres.author = "Kapadokya Universitesi - Ic Mimarlik ve Cevre Tasarimi";
pres.title  = "IMC 301 Pafta Sablonu A1";

const T = (s, o) => s.addText(o.t, {
  x: c(o.x), y: c(o.y), w: c(o.w), h: c(o.h),
  fontFace: F, fontSize: o.sz, bold: !!o.b, color: o.c || INK,
  align: o.al || "left", valign: o.va || "top", charSpacing: o.cs || 0,
  lineSpacing: o.ls, isTextBox: true, fill: { type: "none" }, margin: 0
});
const L = (s, x1, y1, x2, y2, col, wpt) => s.addShape(pres.ShapeType.line, {
  x: c(Math.min(x1, x2)), y: c(Math.min(y1, y2)),
  w: c(Math.abs(x2 - x1)), h: c(Math.abs(y2 - y1)),
  line: { color: col, width: wpt }
});

function field(s, x, y, w, label) {
  T(s, { t: label, x, y, w, h: 0.5, sz: 8, b: true, c: GREY, cs: 1.4 });
  L(s, x, y + 1.3, x + w, y + 1.3, LINE, 0.75);
}

function sheet() {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };

  /* --- sol: kurum ve ders --- */
  T(s, { t: "KAPADOKYA ÜNİVERSİTESİ", x: ML, y: 1.75, w: 30, h: 0.9, sz: 14, b: true, c: ACC, cs: 2.2 });
  T(s, { t: "Mimarlık, Tasarım ve Güzel Sanatlar Fakültesi  ·  İç Mimarlık ve Çevre Tasarımı Bölümü",
         x: ML, y: 2.68, w: 36, h: 0.8, sz: 10.5, c: GREY });
  T(s, { t: "IMC – 301  İÇ MİMARİ TASARIM STÜDYOSU IV", x: ML, y: 4.00, w: 38, h: 1.5, sz: 24, b: true });
  T(s, { t: "2026–27 Güz Dönemi", x: ML, y: 5.85, w: 20, h: 0.8, sz: 11, c: GREY });

  /* --- sağ: öğrenci alanları --- */
  const RX = W - MR - 16.0, FW = 7.6, G = 0.8;
  field(s, RX, 1.75, 16.0, "AD SOYAD");
  field(s, RX, 3.85, FW, "NUMARA");
  field(s, RX + FW + G, 3.85, FW, "PAFTA NO");
  field(s, RX, 5.95, FW, "JÜRİ / TESLİM");
  field(s, RX + FW + G, 5.95, FW, "TARİH");

  /* --- başlık çizgisi --- */
  L(s, ML, 8.1, W - MR, 8.1, ACC, 2.0);

  /* --- çalışma alanı köşe işaretleri --- */
  const A = 8.9, B = 80.7, TK = 1.3;
  [[ML, A, 1, 1], [W - MR, A, -1, 1], [ML, B, 1, -1], [W - MR, B, -1, -1]].forEach(([x, y, sx, sy]) => {
    L(s, x, y, x + sx * TK, y, LINE, 0.75);
    L(s, x, y, x, y + sy * TK, LINE, 0.75);
  });

  /* --- alt bant --- */
  L(s, ML, 81.3, W - MR, 81.3, LINE, 0.75);
  T(s, { t: "IMC 301  ·  İÇ MİMARİ TASARIM STÜDYOSU IV  ·  2026–27 GÜZ  ·  MERSİN MARINA",
         x: ML, y: 81.7, w: 36, h: 0.7, sz: 8, c: GREY, cs: 1.2 });
  T(s, { t: "ÖLÇEK  ____________________",
         x: W - MR - 16, y: 81.7, w: 16, h: 0.7, sz: 8, c: GREY, cs: 1.2, al: "right" });
  return s;
}
sheet(); sheet();
pres.writeFile({ fileName: "IMC301-Pafta-Sablonu-A1.pptx" }).then(() => console.log("ok"));
