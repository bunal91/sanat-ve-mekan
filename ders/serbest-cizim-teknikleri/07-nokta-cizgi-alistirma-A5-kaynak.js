const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name:"A5", width:5.83, height:8.27 });
p.layout = "A5";
p.author = "IMC321 Serbest Çizim Teknikleri";
p.title  = "Nokta ve Çizgi — Alıştırma Föyü";

const INK="1B1F24", BLUE="2A6289", MUTED="6B747C", LINE="D8DCDF", CARD="F2F4F6", SOFT="A8ADB2", WHITE="FFFFFF";
const FS="Century Schoolbook", FB="Calibri", FM="Courier New";
const M=0.45, W=5.83-2*M;
const T=(o)=>Object.assign({isTextBox:true,margin:0},o);
const s=p.addSlide(); s.background={color:WHITE};

/* iki nokta arasına çizgi — negatif en/boy üretmez (PowerPoint/Canva uyumu) */
function seg(x1,y1,x2,y2,o){
  const x=Math.min(x1,x2), y=Math.min(y1,y2);
  const w=Math.abs(x2-x1), h=Math.abs(y2-y1);
  const flip=((x2-x1)*(y2-y1))<0;
  s.addShape(p.ShapeType.line,{x,y,w,h,flipV:flip,line:o});
}
function dot(x,y,r,c){ s.addShape(p.ShapeType.ellipse,{x:x-r,y:y-r,w:2*r,h:2*r,fill:{color:c},line:{color:c,width:0}}); }

/* ---------- BAŞLIK ---------- */
s.addText("IMC321 SERBEST ÇİZİM TEKNİKLERİ  ·  2. HAFTA  ·  8 EKİM 2026",
  T({x:M,y:0.38,w:W,h:0.18,fontFace:FM,fontSize:7,charSpacing:0.8,color:MUTED}));
s.addText("Nokta ve Çizgi",
  T({x:M,y:0.59,w:3.4,h:0.42,fontFace:FS,fontSize:23,bold:true,color:INK}));
s.addText("DÖRT ALIŞTIRMA\n45 DAKİKA",
  T({x:M+3.4,y:0.61,w:W-3.4,h:0.42,fontFace:FM,fontSize:8,color:BLUE,align:"right",lineSpacing:11}));
s.addText("Bugün tek bir soruyu çalışıyoruz: bir çizgi kaç farklı şey olabilir? Sırayı bozmayın — her alıştırma bir öncekinin üzerine biniyor.",
  T({x:M,y:1.07,w:W,h:0.36,fontFace:FB,fontSize:8.5,color:INK,lineSpacing:12}));
s.addShape(p.ShapeType.line,{x:M,y:1.47,w:W,h:0,line:{color:INK,width:1.25}});

/* ---------- BLOKLAR ---------- */
const BY=1.60, BH=1.48, TW=3.02, VX=M+3.62, VW=1.31;
const ex=[
 ["1","IŞINLAR","8 dk",
  "Sayfanın ortasına tek bir nokta koy. O noktadan dışarı doğru ışınlar çiz; her ışın noktadan başlasın ve kâğıdın kenarına kadar gitsin. Sayfa dolana kadar devam et.",
  "Kalem hep merkezden dışa çekilir, kenardan içeri değil. Hareket omuzdan gelsin."],
 ["2","ELLİ NOKTA","10 dk",
  "Yeni sayfaya, düşünmeden, rastgele 50 nokta serp. Sonra bunları tek tek, düz çizgilerle birleştir. Her çizgi bir noktada başlayıp öbüründe tam isabetle bitsin.",
  "Gözün kalemin ucuna değil, gitmek istediğin noktaya baksın. Önce havada prova et, sonra tek hamlede çek."],
 ["3","TEK ÇİZGİ, KAÇ TÜRLÜ?","12 dk",
  "Kalemi kâğıttan hiç kaldırmadan tek bir çizgi çiz — ama çizgi hep aynı kalmasın. İlerledikçe karakterini değiştir ve sayfayı dolaş.",
  "Değiştirebileceklerin: hız · basınç · süreklilik · ritim · yoğunluk · açısallık · yön. Kaç karakter bulduğunu say."],
 ["4","DÖRT SIRA","15 dk",
  "3. alıştırmada bulduğun karakterlerden dördünü seç. Yeni bir sayfayı yatay dört şeride böl ve her şeride bir karakteri, baştan sona aynı tutarak tekrarla.",
  "Hedef: tesadüfen bulduğun izi isteyerek üretebilmek. Şeridin başına izin adını yaz."]
];
ex.forEach((e,i)=>{
  const y=BY+i*BH;
  s.addShape(p.ShapeType.rect,{x:M,y:y+0.01,w:0.30,h:0.30,fill:{color:CARD},line:{color:INK,width:0.75}});
  s.addText(e[0],T({x:M,y:y+0.065,w:0.30,h:0.20,fontFace:FM,fontSize:11,bold:true,color:INK,align:"center"}));
  s.addText(e[1],T({x:M+0.42,y:y-0.01,w:2.25,h:0.24,fontFace:FB,fontSize:12,bold:true,color:INK}));
  s.addText(e[2],T({x:M+0.42,y:y+0.03,w:TW,h:0.20,fontFace:FM,fontSize:8,color:BLUE,align:"right"}));
  s.addText(e[3],T({x:M+0.42,y:y+0.29,w:TW,h:0.56,fontFace:FB,fontSize:8.5,color:INK,lineSpacing:12}));
  s.addShape(p.ShapeType.line,{x:M+0.42,y:y+0.91,w:0.22,h:0,line:{color:BLUE,width:1.25}});
  s.addText(e[4],T({x:M+0.42,y:y+0.98,w:TW,h:0.34,fontFace:FB,fontSize:8,color:BLUE,lineSpacing:11}));
  if(i<3) s.addShape(p.ShapeType.line,{x:M,y:y+BH-0.09,w:W,h:0,line:{color:LINE,width:0.75}});
});

/* ---------- GÖRSEL İPUÇLARI ---------- */
// 1 · ışınlar
{
  const cx=VX+VW/2, cy=BY+0.58, R=0.46, r0=0.06;
  for(let a=0;a<18;a++){
    const t=a*Math.PI*2/18, c=Math.cos(t), sn=Math.sin(t);
    seg(cx+c*r0, cy+sn*r0, cx+c*R, cy+sn*R, {color:a%3===0?INK:SOFT, width:a%3===0?1.1:0.6});
  }
  dot(cx,cy,0.035,BLUE);
}
// 2 · elli nokta
{
  const y0=BY+BH+0.08;
  const pts=[[0.13,0.20],[0.45,0.07],[0.76,0.25],[1.07,0.12],[1.16,0.46],
             [0.86,0.60],[0.56,0.44],[0.24,0.56],[0.40,0.82],[0.74,0.90],[1.12,0.78]];
  for(let i=0;i<pts.length-1;i++)
    seg(VX+pts[i][0],y0+pts[i][1],VX+pts[i+1][0],y0+pts[i+1][1],{color:INK,width:0.85});
  pts.forEach(q=>dot(VX+q[0],y0+q[1],0.032,BLUE));
}
// 3 · aynı çizgi, değişen karakter (üç sıra, soldan sağa)
{
  const y0=BY+2*BH+0.14;
  const rows=[
    [[0.08,0.00],[0.38,0.10],[0.66,0.00],[1.00,0.12],[1.22,0.02]],
    [[0.08,0.38],[0.34,0.50],[0.62,0.36],[0.96,0.50],[1.22,0.40]],
    [[0.08,0.78],[0.36,0.90],[0.66,0.76],[0.98,0.90],[1.22,0.80]]
  ];
  const wts=[[0.6,1.2,2.0,3.0],[1.4,1.4,1.4,1.4],[0.9,0.9,0.9,0.9]];
  const dsh=[["solid","solid","solid","solid"],["dash","sysDash","dashDot","sysDot"],["solid","solid","solid","solid"]];
  rows.forEach((rw,ri)=>{
    for(let i=0;i<rw.length-1;i++)
      seg(VX+rw[i][0],y0+rw[i][1],VX+rw[i+1][0],y0+rw[i+1][1],
          {color:INK,width:wts[ri][i],dashType:dsh[ri][i]});
  });
}
// 4 · dört sıra
{
  const y0=BY+3*BH+0.10;
  const rows=[[0.9,"solid"],[1.9,"dash"],[0.7,"sysDot"],[2.6,"dashDot"]];
  rows.forEach((r,i)=>{
    const yy=y0+0.16+i*0.25;
    s.addShape(p.ShapeType.rect,{x:VX,y:yy-0.10,w:VW,h:0.20,fill:{color:CARD},line:{color:LINE,width:0.5}});
    s.addShape(p.ShapeType.line,{x:VX+0.09,y:yy,w:VW-0.18,h:0,line:{color:INK,width:r[0],dashType:r[1]}});
  });
}

/* ---------- ALT ŞERİT ---------- */
{
  const fy=7.58;
  s.addShape(p.ShapeType.line,{x:M,y:fy,w:W,h:0,line:{color:INK,width:1.25}});
  s.addText("YANINDA OLSUN",T({x:M,y:fy+0.08,w:1.6,h:0.16,fontFace:FM,fontSize:6.5,charSpacing:0.6,color:BLUE}));
  s.addText("4 sayfa A4 ya da A3  ·  2B kalem  ·  fineliner",T({x:M,y:fy+0.25,w:2.6,h:0.32,fontFace:FB,fontSize:8,color:INK,lineSpacing:11}));
  s.addText("ÜÇ KURAL",T({x:M+2.72,y:fy+0.08,w:1.6,h:0.16,fontFace:FM,fontSize:6.5,charSpacing:0.6,color:BLUE}));
  s.addText("Silgi yok  ·  Bastırarak koyulaştırma yok\nHiçbir sayfa atılmaz — dosyaya girer",T({x:M+2.72,y:fy+0.25,w:W-2.72,h:0.32,fontFace:FB,fontSize:8,color:INK,lineSpacing:11}));
}

p.writeFile({fileName:"/home/user/sanat-ve-mekan/ders/serbest-cizim-teknikleri/07-nokta-cizgi-alistirma-A5.pptx"})
 .then(f=>console.log("yazıldı:",f));
