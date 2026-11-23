const pptxgen = require("pptxgenjs");
const p = new pptxgen();
const mm = v => v/25.4;                      // mm -> inç
p.defineLayout({ name:"A3P", width:mm(297), height:mm(420) });
p.layout = "A3P";
p.author = "IMC321 Serbest Çizim Teknikleri";
p.title  = "Tarama Etüdü — Pafta Düzeni";

const INK="1A1A1A", GREY="707070", F="Arial", LW=1;
const s = p.addSlide(); s.background={color:"FFFFFF"};

/* ---- ızgara (mm) ---- */
const PAD=21, GAP=15;                        // kenar boşluğu · tek oluk ölçüsü
const SQ=75;                                 // kare kenarı
const BARW=3*SQ+2*GAP;                       // 255 — şerit genişliği = kare bloğu genişliği
const BARH=26, CELL=BARW/5;                  // 51 x 26 — şerit gözü
const ROWS=[PAD, PAD+SQ+GAP, PAD+2*(SQ+GAP)];          // 21 · 111 · 201
const SQBOT=PAD+3*SQ+2*GAP;                            // 276
const BARY=[SQBOT+GAP, SQBOT+GAP+BARH+GAP, SQBOT+GAP+2*(BARH+GAP)];  // 291 · 332 · 373

function rect(x,y,w,h){ s.addShape(p.ShapeType.rect,
  {x:mm(x),y:mm(y),w:mm(w),h:mm(h),fill:{type:"none"},line:{color:INK,width:LW}}); }
function vline(x,y,h){ s.addShape(p.ShapeType.line,
  {x:mm(x),y:mm(y),w:0,h:mm(h),line:{color:INK,width:LW}}); }
function txt(t,x,y,w){ s.addText(t,{isTextBox:true,margin:0,
  x:mm(x),y:mm(y),w:mm(w),h:mm(4.4),fontFace:F,fontSize:9,color:GREY}); }

/* ---- dokuz kare ---- */
ROWS.forEach(y => ROWS.forEach(x => rect(x,y,SQ,SQ)));

/* ---- üç şerit, her biri beş parça ---- */
BARY.forEach(y => {
  rect(PAD,y,BARW,BARH);
  for(let k=1;k<5;k++) vline(PAD+k*CELL, y, BARH);
});

/* ---- ölçüler ---- */
txt("KARE  75 × 75 mm", PAD, PAD-10.5, BARW);
txt("ŞERİT  255 × 26 mm  ·  5 parça  ·  her parça 51 × 26 mm", PAD, SQBOT+5.2, BARW);
txt("A3  ·  297 × 420 mm  ·  kenar boşluğu 21 mm  ·  oluk 15 mm", PAD, BARY[2]+BARH+6.5, BARW);

p.writeFile({fileName:"/home/user/sanat-ve-mekan/ders/serbest-cizim-teknikleri/11-tarama-pafta-duzeni-A3.pptx"})
 .then(f=>console.log("yazıldı:",f));
