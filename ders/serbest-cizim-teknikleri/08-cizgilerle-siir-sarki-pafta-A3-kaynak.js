const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name:"A3L", width:16.54, height:11.69 });   // A3 yatay
p.layout = "A3L";
p.author = "IMC321 Serbest Çizim Teknikleri";
p.title  = "Çizgilerle Şiir / Çizgilerle Şarkı — Pafta";

const INK="1A1A1A", GREY="707070", WHITE="FFFFFF";
const F="Arial";
const T=(o)=>Object.assign({isTextBox:true,margin:0},o);

/* --- ızgara --- */
const M=0.70, W=16.54-2*M;             // 15.14
const G=0.22;                          // tek oluk ölçüsü
const BY=1.42, BB=10.80, BH=BB-BY;     // gövde: 9.38
const SQ=BH;                           // çizim karesi (kare)
const LW=W-SQ-G;                       // sol sütun: 5.54
const SX=M+LW+G;                       // kare sol kenarı
const R1=0.78, R2=0.92;                // kimlik · künye satırları
const REST=BH-R1-R2-3*G;               // 7.02
const R3=4.95, R4=REST-R3;             // kaynak 4.95 · duygular 2.07

function rect(s,x,y,w,h){
  s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{type:"none"},line:{color:INK,width:1}});
}
function cell(s,x,y,w,h,txt){
  rect(s,x,y,w,h);
  s.addText(txt,T({x:x+0.14,y:y+0.12,w:w-0.28,h:0.20,
    fontFace:F,fontSize:9.5,bold:true,charSpacing:0.8,color:INK}));
}

function pafta(song){
  const s=p.addSlide(); s.background={color:WHITE};

  /* başlık */
  s.addText("IMC321  ·  SERBEST ÇİZİM TEKNİKLERİ  ·  ÖDEV 1",
    T({x:M,y:0.55,w:W,h:0.18,fontFace:F,fontSize:9.5,charSpacing:1.2,color:GREY}));
  s.addText(song?"Çizgilerle Şarkı":"Çizgilerle Şiir",
    T({x:M,y:0.79,w:W,h:0.40,fontFace:F,fontSize:22,bold:true,color:INK}));

  /* ---- sol sütun ---- */
  const w3=(LW-2*G)/3, w2=(LW-G)/2;
  cell(s,M,            BY,w3,R1,"AD SOYAD");
  cell(s,M+w3+G,       BY,w3,R1,"ÖĞRENCİ NO");
  cell(s,M+2*(w3+G),   BY,w3,R1,"TARİH");

  const Y2=BY+R1+G;
  cell(s,M,      Y2,w2,R2,song?"ESER ADI":"ŞİİRİN ADI");
  cell(s,M+w2+G, Y2,w2,R2,song?"SANATÇI":"ŞAİR");

  const Y3=Y2+R2+G;
  if(song){
    const qh=1.95;
    cell(s,M,Y3,         LW,qh,          "KAREKOD");
    cell(s,M,Y3+qh+G,    LW,R3-qh-G,     "SÖZLER");
  }else{
    cell(s,M,Y3,LW,R3,"ŞİİR");
  }

  const Y4=Y3+R3+G;
  cell(s,M,Y4,LW,R4,song?"ŞARKININ DUYGULARI":"ŞİİRİN DUYGULARI");

  /* ---- çizim karesi ---- */
  cell(s,SX,BY,SQ,SQ,"ÇİZİM ALANI");

  /* ---- alt satır ---- */
  s.addText("Yalnızca çizgi: yazı, sembol ve figür kullanılmaz.",
    T({x:M,y:BB+0.16,w:W,h:0.18,fontFace:F,fontSize:9.5,italic:true,color:GREY}));
}

pafta(false);   // slayt 1 — şiir
pafta(true);    // slayt 2 — şarkı

p.writeFile({fileName:"/home/user/sanat-ve-mekan/ders/serbest-cizim-teknikleri/08-cizgilerle-siir-sarki-pafta-A3.pptx"})
 .then(f=>console.log("yazıldı:",f));
