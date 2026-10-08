const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name:"A3P", width:11.69, height:16.54 });   // A3 dikey
p.layout = "A3P";
p.author = "IMC321 Serbest Çizim Teknikleri";
p.title  = "Çizgilerle Şiir / Çizgilerle Şarkı — Pafta";

const INK="1B1F24", BLUE="2A6289", MUTED="6B747C", LINE="C9CFD5", HAIR="E3E7EB",
      CARD="F4F6F8", WHITE="FFFFFF";
const FS="Century Schoolbook", FB="Calibri", FM="Courier New";
const M=0.75, W=11.69-2*M;                       // 10.19
const T=(o)=>Object.assign({isTextBox:true,margin:0},o);
const DUYGU="tedirginlik · dinginlik · öfke · beklenti · yorgunluk · neşe · yalnızlık · panik · ağırlık · hafiflik · kararsızlık · kararlılık";

function box(s,x,y,w,h,{fill=null,dash=null,lw=1}={}){
  s.addShape(p.ShapeType.rect,{x,y,w,h,fill:fill?{color:fill}:{type:"none"},
    line:{color:LINE,width:lw,dashType:dash||"solid"}});
}
function boxLabel(s,x,y,w,txt){
  s.addText(txt,T({x:x+0.18,y:y+0.14,w:w-0.36,h:0.22,fontFace:FM,fontSize:9.5,charSpacing:1.2,color:BLUE}));
}
function hint(s,x,y,w,txt){
  s.addText(txt,T({x:x+0.18,y,w:w-0.36,h:0.26,fontFace:FB,fontSize:10.5,italic:true,color:MUTED}));
}
function rules(s,x,y,w,n,gap){
  for(let i=0;i<n;i++) s.addShape(p.ShapeType.line,{x:x+0.18,y:y+i*gap,w:w-0.36,h:0,line:{color:HAIR,width:0.75}});
}
function field(s,x,y,w,label){
  s.addText(label,T({x,y,w,h:0.2,fontFace:FM,fontSize:8.5,charSpacing:1,color:MUTED}));
  s.addShape(p.ShapeType.line,{x,y:y+0.46,w,h:0,line:{color:INK,width:0.9}});
}

function pafta(song){
  const s=p.addSlide(); s.background={color:WHITE};
  const TW = song ? 8.55 : W;                   // başlık genişliği (şarkıda karekoda yer bırakır)

  /* ---------------- BAŞLIK ---------------- */
  s.addText("IMC321  ·  SERBEST ÇİZİM TEKNİKLERİ  ·  ÖDEV 1",
    T({x:M,y:0.68,w:TW,h:0.24,fontFace:FM,fontSize:10,charSpacing:1.6,color:MUTED}));
  s.addText(song?"Çizgilerle Şarkı":"Çizgilerle Şiir",
    T({x:M,y:0.96,w:TW,h:0.84,fontFace:FS,fontSize:46,bold:true,color:INK}));
  s.addText(song
    ? "Seçtiğiniz şarkıyı çizgiyle anlatın — resmetmeden, duyduğunuzu çizginin diline çevirerek."
    : "Seçtiğiniz şiiri çizgiyle anlatın — resmetmeden, okuduğunuzu çizginin diline çevirerek.",
    T({x:M,y:1.84,w:TW,h:0.28,fontFace:FB,fontSize:13.5,color:INK}));

  if(song){                                      /* karekod — sağ üst */
    const QX=M+W-1.34, QY=0.68, QW=1.34, QH=1.46;
    box(s,QX,QY,QW,QH,{fill:CARD});
    s.addText("KAREKOD",T({x:QX,y:QY+0.12,w:QW,h:0.2,fontFace:FM,fontSize:8,charSpacing:1,color:BLUE,align:"center"}));
    s.addShape(p.ShapeType.rect,{x:QX+(QW-0.86)/2,y:QY+0.38,w:0.86,h:0.86,
      fill:{color:WHITE},line:{color:MUTED,width:1,dashType:"dash"}});
    s.addText("dinlemek için",T({x:QX,y:QY+1.28,w:QW,h:0.18,fontFace:FB,fontSize:8,italic:true,color:MUTED,align:"center"}));
  }

  /* öğrenci şeridi */
  box(s,M,2.18,W,0.68,{fill:CARD});
  const fw=(W-0.36-0.5)/3;
  field(s,M+0.18,            2.30,fw,"AD SOYAD");
  field(s,M+0.18+fw+0.25,    2.30,fw,"ÖĞRENCİ NO");
  field(s,M+0.18+2*(fw+0.25),2.30,fw,"TARİH");
  s.addShape(p.ShapeType.line,{x:M,y:3.00,w:W,h:0,line:{color:INK,width:1.6}});

  /* ---------------- ÜST BLOK ---------------- */
  const CY=3.18, CH=2.95;
  const LW = song ? 4.60 : 6.05;                 // sol kutu
  const RX = M+LW+0.25, RW = W-LW-0.25;

  box(s,M,CY,LW,CH);
  boxLabel(s,M,CY,LW,song?"ŞARKI":"ŞİİR");
  if(song){
    field(s,M+0.18,CY+0.48,LW-0.36,"ESER ADI");
    field(s,M+0.18,CY+1.14,LW-0.36,"SANATÇI");
    hint(s,M,CY+1.78,LW,"Seçtiğiniz bölümün sözleri:");
    rules(s,M,CY+2.26,LW,3,0.27);
  }else{
    field(s,M+0.18,CY+0.48,3.10,"ŞİİRİN ADI");
    field(s,M+0.18+3.30,CY+0.48,LW-0.36-3.30,"ŞAİR");
    hint(s,M,CY+1.12,LW,"Şiiri bu alana yazın ya da çıktısını yapıştırın.");
    rules(s,M,CY+1.62,LW,5,0.28);
  }

  /* sağ sütun: duygu + neden */
  const EH = song ? 1.15 : 1.02;
  box(s,RX,CY,RW,EH,{fill:CARD});
  boxLabel(s,RX,CY,RW,"HEDEFLEDİĞİM DUYGU");
  s.addText(DUYGU,T({x:RX+0.18,y:CY+0.44,w:RW-0.36,h:EH-0.68,fontFace:FB,fontSize:song?10.5:9.5,color:INK,lineSpacing:song?14:13}));
  s.addText("birini daire içine alın",T({x:RX+0.18,y:CY+EH-0.24,w:RW-0.36,h:0.2,fontFace:FB,fontSize:9,italic:true,color:MUTED}));

  const NY=CY+EH+0.15, NH=CH-EH-0.15;
  box(s,RX,NY,RW,NH);
  boxLabel(s,RX,NY,RW,"NEDEN BU ÇİZGİ?");
  hint(s,RX,NY+0.42,RW,song?"Bu şarkı için neden bu çizgiyi seçtiniz?":"Bu şiir için neden bu çizgiyi seçtiniz?");
  rules(s,RX,NY+0.95,RW,song?4:3,0.27);

  /* ---------------- ÇİZİM KARESİ ---------------- */
  const SQ=9.10, SX=(11.69-SQ)/2, SY=6.58;
  s.addShape(p.ShapeType.rect,{x:SX,y:SY,w:SQ,h:SQ,fill:{type:"none"},line:{color:INK,width:1.6}});
  s.addText("ÇİZİM ALANI",T({x:SX,y:SY-0.28,w:3.0,h:0.22,fontFace:FM,fontSize:9.5,charSpacing:1.2,color:BLUE}));
  s.addText("23 × 23 cm  ·  taşmayın",T({x:SX+SQ-3.0,y:SY-0.28,w:3.0,h:0.22,fontFace:FM,fontSize:9.5,color:MUTED,align:"right"}));

  /* ---------------- ALT ŞERİT ---------------- */
  const FY=SY+SQ+0.24;
  s.addShape(p.ShapeType.line,{x:M,y:FY,w:W,h:0,line:{color:INK,width:1.2}});
  s.addText("Çalışmanızı bu kareye yerleştirin ya da doğrudan içine çizin.  ·  Yalnızca çizgi: yazı, sembol ve figür kullanılmaz.",
    T({x:M,y:FY+0.14,w:7.5,h:0.26,fontFace:FB,fontSize:10.5,color:INK}));
  s.addText("KAPADOKYA ÜNİVERSİTESİ",
    T({x:M+7.5,y:FY+0.14,w:W-7.5,h:0.26,fontFace:FM,fontSize:9.5,charSpacing:1.2,color:BLUE,align:"right"}));
}

pafta(false);   // slayt 1 — şiir
pafta(true);    // slayt 2 — şarkı

p.writeFile({fileName:"/home/user/sanat-ve-mekan/ders/serbest-cizim-teknikleri/08-cizgilerle-siir-sarki-pafta-A3.pptx"})
 .then(f=>console.log("yazıldı:",f));
