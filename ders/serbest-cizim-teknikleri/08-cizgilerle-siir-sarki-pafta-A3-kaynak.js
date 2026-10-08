const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name:"A3P", width:11.69, height:16.54 });   // A3 dikey
p.layout = "A3P";
p.author = "IMC321 Serbest Çizim Teknikleri";
p.title  = "Çizgilerle Şiir / Çizgilerle Şarkı — Pafta";

const INK="1A1A1A", GREY="707070", WHITE="FFFFFF";
const F="Arial";
const T=(o)=>Object.assign({isTextBox:true,margin:0},o);

/* --- ızgara --- */
const M=0.75, W=11.69-2*M;            // 10.19
const G=0.22;                          // tek oluk ölçüsü
const LW=3.40, RW=W-LW-G;              // sol 3.40 · sağ 6.57
const BY=1.40, BH=3.80;                // üst blok
const R1=0.78, R2=0.92, R3=BH-R1-R2-2*G;   // 1.66
const SY=5.63, SQ=W;                   // çizim karesi: tam genişlik

function rect(s,x,y,w,h){
  s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{type:"none"},line:{color:INK,width:1}});
}
function label(s,x,y,w,txt){
  s.addText(txt,T({x:x+0.14,y:y+0.12,w:w-0.28,h:0.20,
    fontFace:F,fontSize:9.5,bold:true,charSpacing:0.8,color:INK}));
}
function cell(s,x,y,w,h,txt){ rect(s,x,y,w,h); label(s,x,y,w,txt); }

function pafta(song){
  const s=p.addSlide(); s.background={color:WHITE};

  /* başlık */
  s.addText("IMC321  ·  SERBEST ÇİZİM TEKNİKLERİ  ·  ÖDEV 1",
    T({x:M,y:0.58,w:W,h:0.18,fontFace:F,fontSize:9.5,charSpacing:1.2,color:GREY}));
  s.addText(song?"Çizgilerle Şarkı":"Çizgilerle Şiir",
    T({x:M,y:0.82,w:W,h:0.40,fontFace:F,fontSize:22,bold:true,color:INK}));

  /* ---- sol sütun ---- */
  if(song){
    cell(s,M,BY,LW,R1+G+R2,"KAREKOD");                       // 1.92
    cell(s,M,BY+R1+G+R2+G,LW,R3,"SÖZLER");                   // 1.66 — sağdaki duygular ile aynı hiza
  }else{
    cell(s,M,BY,LW,BH,"ŞİİR");                               // uzun dikey alan
  }

  /* ---- sağ sütun ---- */
  const RX=M+LW+G;
  const w3=(RW-2*G)/3, w2=(RW-G)/2;
  cell(s,RX,            BY,w3,R1,"AD SOYAD");
  cell(s,RX+w3+G,       BY,w3,R1,"ÖĞRENCİ NO");
  cell(s,RX+2*(w3+G),   BY,w3,R1,"TARİH");

  const Y2=BY+R1+G;
  cell(s,RX,      Y2,w2,R2,song?"ESER ADI":"ŞİİRİN ADI");
  cell(s,RX+w2+G, Y2,w2,R2,song?"SANATÇI":"ŞAİR");

  const Y3=Y2+R2+G;
  cell(s,RX,Y3,RW,R3,song?"ŞARKININ DUYGULARI":"ŞİİRİN DUYGULARI");

  /* ---- çizim karesi ---- */
  s.addText("ÇİZİM ALANI",T({x:M,y:SY-0.21,w:W,h:0.18,
    fontFace:F,fontSize:9.5,bold:true,charSpacing:0.8,color:INK}));
  rect(s,M,SY,SQ,SQ);

  /* ---- alt satır ---- */
  s.addText("Yalnızca çizgi: yazı, sembol ve figür kullanılmaz.",
    T({x:M,y:SY+SQ+0.14,w:W,h:0.18,fontFace:F,fontSize:9.5,italic:true,color:GREY}));
}

pafta(false);   // slayt 1 — şiir
pafta(true);    // slayt 2 — şarkı

p.writeFile({fileName:"/home/user/sanat-ve-mekan/ders/serbest-cizim-teknikleri/08-cizgilerle-siir-sarki-pafta-A3.pptx"})
 .then(f=>console.log("yazıldı:",f));
