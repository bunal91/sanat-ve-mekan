const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name:"A4P", width:8.27, height:11.69 });
p.layout = "A4P";
p.author = "IMC321 Serbest Çizim Teknikleri";
p.title  = "Tarama ve Ton — Ders Föyü";

const INK="1A1A1A", GREY="707070", FAINT="9A9A9A", F="Arial";
const T=(o)=>Object.assign({isTextBox:true,margin:0},o);
const M=0.62, W=8.27-2*M, G=0.18;
const s=p.addSlide(); s.background={color:"FFFFFF"};

function rect(x,y,w,h,lw){ s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{type:"none"},line:{color:INK,width:lw||1}}); }
function seg(x1,y1,x2,y2,c,lw){
  const x=Math.min(x1,x2), y=Math.min(y1,y2), w=Math.abs(x2-x1), h=Math.abs(y2-y1);
  s.addShape(p.ShapeType.line,{x,y,w,h,flipV:((x2-x1)*(y2-y1))<0,line:{color:c||INK,width:lw||0.75}});
}
function fill45(a,b,L,n,dir){
  for(let k=1;k<n;k++){ const t=k*L/n;
    if(dir<0){ seg(a,b+t, a+t,b); seg(a+t,b+L, a+L,b+t); }
    else     { seg(a,b+L-t, a+t,b+L); seg(a+t,b, a+L,b+L-t); } }
  if(dir<0) seg(a,b+L,a+L,b); else seg(a,b,a+L,b+L);
}
let _sd=7; const rnd=()=>{ _sd=(_sd*1103515245+12345)%2147483648; return _sd/2147483648; };
function dot(x,y,r){ s.addShape(p.ShapeType.ellipse,{x:x-r,y:y-r,w:2*r,h:2*r,fill:{color:INK},line:{color:INK,width:0}}); }
function ring(x,y,rx,ry,lw){ s.addShape(p.ShapeType.ellipse,{x:x-rx,y:y-ry,w:2*rx,h:2*ry,fill:{type:"none"},line:{color:INK,width:lw||0.6}}); }
function txt(t,x,y,w,h,o){ s.addText(t,T(Object.assign({x,y,w,h,fontFace:F,fontSize:9.5,color:INK},o))); }

/* ---------------- BAŞLIK ---------------- */
txt("IMC321  ·  SERBEST ÇİZİM TEKNİKLERİ  ·  9. HAFTA  ·  26 KASIM 2026",M,0.55,W,0.18,{fontSize:9,charSpacing:1,color:GREY});
txt("Tarama ve Ton",M,0.78,W,0.38,{fontSize:20,bold:true});
txt("Tarama, çizgiyi tona çeviren tekniktir. Bugün üç adım: önce teknikleri tanıyoruz, sonra tek bir teknikle denetimli ton üretiyoruz, en son o tonu bir kürenin yüzeyine oturtuyoruz.",
    M,1.20,W,0.44,{fontSize:10,lineSpacing:14});

/* ---------------- BÖLÜM 1 · BEŞ TEKNİK ---------------- */
txt("BEŞ TEKNİK",M,1.74,W,0.18,{fontSize:9.5,bold:true,charSpacing:0.8});
const SW=(W-4*G)/5, SY=1.98;
const names=[["PARALEL TARAMA","hatching"],["ÇAPRAZ TARAMA","cross-hatching"],
             ["KONTUR TARAMASI","contour hatching"],["NOKTALAMA","stippling"],["DOLAŞIK TARAMA","scumbling"]];
for(let i=0;i<5;i++){
  const x=M+i*(SW+G); rect(x,SY,SW,SW);
  const a=x+0.07, b=SY+0.07, L=SW-0.14;   // iç alan
  if(i===0){ fill45(a,b,L,15,-1); }
  if(i===1){ fill45(a,b,L,10,-1); fill45(a,b,L,10,1); }
  if(i===2){ for(let r=0;r<7;r++){ const y0=b+0.06+r*(L-0.12)/6, amp=0.055+0.012*r;
      for(let k=0;k<8;k++){ const t1=k/8,t2=(k+1)/8;
        seg(a+t1*L, y0-amp*Math.sin(Math.PI*t1), a+t2*L, y0-amp*Math.sin(Math.PI*t2)); } } }
  if(i===3){ for(let r=0;r<13;r++) for(let c=0;c<13;c++){
      const u=(r+c)/24; if(((r*7+c*5)%11)/11 > u*1.25) continue;
      dot(a+(c+0.5)*L/13, b+(r+0.5)*L/13, 0.0105); } }
  if(i===4){ for(let k=0;k<38;k++){
      ring(a+0.11+rnd()*(L-0.22), b+0.11+rnd()*(L-0.22), 0.048+0.022*rnd(), 0.036+0.020*rnd(), 0.6); } }
  txt(names[i][0],x,SY+SW+0.07,SW,0.16,{fontSize:7.6,bold:true,align:"center"});
  txt(names[i][1],x,SY+SW+0.24,SW,0.14,{fontSize:7,italic:true,color:FAINT,align:"center"});
}
txt("Koyuluk aralık, kalınlık ve kesişim sayısıyla üretilir — kaleme bastırarak değil.",
    M,SY+SW+0.46,W,0.18,{fontSize:9.5,italic:true,color:GREY});

/* ---------------- BÖLÜM 2 · ALIŞTIRMALAR ---------------- */
const RY=SY+SW+0.74;
s.addShape(p.ShapeType.line,{x:M,y:RY,w:W,h:0,line:{color:INK,width:1}});
txt("ÜÇ ALIŞTIRMA  ·  80 DAKİKA",M,RY+0.14,W,0.18,{fontSize:9.5,bold:true,charSpacing:0.8});

const BY=RY+0.42, BH=1.92, TX=M+0.42, TWID=4.30, DX=M+W-1.95, DW=1.95;
const ex=[
 ["1","BEŞ TEKNİK","20 dk",
  "A3 kâğıdı beş sütuna böl ve her sütunu bir teknikle doldur. Hepsi aynı orta koyulukta olsun; bugünkü amaç ton değil, dokuyu tanımak.",
  "Fineliner kullan: bastıramadığın için koyuluğu aralıkla üretmek zorunda kalırsın."],
 ["2","TON SKALASI","25 dk",
  "İki teknik seç. Her biri için beş kademeli bir skala üret — 1 en açık, 5 en koyu. Sırayla doldurma: önce 1, sonra 5, sonra 3, en son 2 ve 4.",
  "Kademeler arasındaki fark eşit olmalı. Üç adım geri çekil: beşi de ayrı ayrı okunuyor mu?"],
 ["3","KÜRE","35 dk",
  "Bir küre çiz ve kontur taramasıyla tonla. Skaladaki beş değeri küreye yerleştir: en parlak nokta boş kalır, en koyu bant ışığın karşı tarafındadır, zemine düşen gölge ayrıca çizilir.",
  "Çizgi yönü biçimi kurar: düz tarama küreyi düz gösterir, saran tarama yuvarlaklaştırır."]
];
ex.forEach((e,i)=>{
  const y=BY+i*BH;
  rect(M,y,0.30,0.30);
  txt(e[0],M,y+0.065,0.30,0.18,{fontSize:11,bold:true,align:"center"});
  txt(e[1],TX,y-0.01,2.4,0.22,{fontSize:11.5,bold:true});
  txt(e[2],TX,y+0.02,TWID,0.18,{fontSize:9,color:GREY,align:"right"});
  txt(e[3],TX,y+0.32,TWID,0.70,{fontSize:9.5,lineSpacing:13});
  s.addShape(p.ShapeType.line,{x:TX,y:y+1.08,w:0.22,h:0,line:{color:INK,width:1.25}});
  txt(e[4],TX,y+1.18,TWID,0.44,{fontSize:9,italic:true,color:GREY,lineSpacing:12});
  if(i<2) s.addShape(p.ShapeType.line,{x:M,y:y+BH-0.14,w:W,h:0,line:{color:"D5DAE0",width:0.75}});
});

/* --- diyagram 1: beş sütunlu A3 --- */
{
  const y=BY+0.12, dh=1.18; rect(DX,y,DW,dh);
  for(let k=1;k<5;k++) s.addShape(p.ShapeType.line,{x:DX+k*DW/5,y,w:0,h:dh,line:{color:INK,width:0.6}});
  for(let k=0;k<5;k++) txt(String(k+1),DX+k*DW/5,y+dh/2-0.08,DW/5,0.16,{fontSize:8,color:GREY,align:"center"});
  txt("A3 · beş sütun",DX,y+dh+0.07,DW,0.14,{fontSize:7.5,italic:true,color:FAINT,align:"center"});
}
/* --- diyagram 2: beş kademeli skala --- */
{
  const y=BY+BH+0.18, cw=DW/5, ch=0.62;
  const dens=[2,5,9,14,20];
  for(let k=0;k<5;k++){
    const x=DX+k*cw; rect(x,y,cw,ch,0.75);
    for(let j=1;j<=dens[k];j++){
      const t=j/(dens[k]+1);
      s.addShape(p.ShapeType.line,{x:x+0.03,y:y+t*ch,w:cw-0.06,h:0,line:{color:INK,width:0.6}});
    }
    txt(String(k+1),x,y+ch+0.05,cw,0.14,{fontSize:7.5,color:GREY,align:"center"});
  }
  txt("1 açık  →  5 koyu",DX,y+ch+0.22,DW,0.14,{fontSize:7.5,italic:true,color:FAINT,align:"center"});
}
/* --- diyagram 3: küre --- */
{
  const y=BY+2*BH+0.06, cx=DX+DW/2-0.10, cy=y+0.68, R=0.48;
  ring(cx+0.60,cy+0.54,0.42,0.115,0.75);            // düşen gölge
  ring(cx,cy,R,R,1);                                 // küre
  ring(cx-0.21,cy-0.23,0.075,0.070,0.6);             // en parlak nokta
  [-0.30,-0.12,0.07,0.25,0.40].forEach((dd,k)=>{     // beş değer, ışık ekseni boyunca
    txt(String(k+1),cx+dd*0.707-0.09,cy+dd*0.707-0.055,0.18,0.13,{fontSize:7.5,color:GREY,align:"center"});
  });
  txt("ışık",DX+0.04,y+0.02,0.40,0.14,{fontSize:7.5,italic:true,color:FAINT});
  seg(DX+0.28,y+0.18,cx-0.42,cy-0.40,FAINT,0.75);
  txt("beş değer  ·  düşen gölge",DX,y+1.34,DW,0.14,{fontSize:7.5,italic:true,color:FAINT,align:"center"});
}

/* ---------------- ALT ŞERİT ---------------- */
{
  const FY=BY+3*BH+0.12;
  s.addShape(p.ShapeType.line,{x:M,y:FY,w:W,h:0,line:{color:INK,width:1}});
  txt("YANINDA OLSUN",M,FY+0.12,3.3,0.16,{fontSize:8,bold:true,charSpacing:0.8});
  txt("Fineliner 0,1 / 0,3 / 0,5  ·  2B ve 4B kalem  ·  3 sayfa A3",M,FY+0.30,3.3,0.34,{fontSize:9,lineSpacing:12});
  txt("KONTROL",M+3.6,FY+0.12,W-3.6,0.16,{fontSize:8,bold:true,charSpacing:0.8});
  txt("Gözünü kıs  ·  Üç adım geri çekil  ·  Fotoğrafını gri tonla",M+3.6,FY+0.30,W-3.6,0.34,{fontSize:9,lineSpacing:12});
}

p.writeFile({fileName:"/home/user/sanat-ve-mekan/ders/serbest-cizim-teknikleri/09-tarama-ton-foy-A4.pptx"})
 .then(f=>console.log("yazıldı:",f));
