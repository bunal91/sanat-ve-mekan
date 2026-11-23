const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name:"A4P", width:8.27, height:11.69 });
p.layout = "A4P";
p.author = "IMC321 Serbest Çizim Teknikleri";
p.title  = "Dokuz Tarama Biçimi — Etüd Paftası";

const INK="1A1A1A", GREY="707070", FAINT="9A9A9A", F="Arial";
const T=(o)=>Object.assign({isTextBox:true,margin:0},o);
const M=0.55, W=8.27-2*M, G=0.20;
const LW=0.75;                                   // tüm izlerin çizgi kalınlığı
const s=p.addSlide(); s.background={color:"FFFFFF"};

let _sd=20261126; const rnd=()=>{ _sd=(_sd*1103515245+12345)%2147483648; return _sd/2147483648; };
function seg(x1,y1,x2,y2,lw){
  const x=Math.min(x1,x2), y=Math.min(y1,y2), w=Math.abs(x2-x1), h=Math.abs(y2-y1);
  s.addShape(p.ShapeType.line,{x,y,w,h,flipV:((x2-x1)*(y2-y1))<0,line:{color:INK,width:lw||LW}});
}
function dot(x,y,r){ s.addShape(p.ShapeType.ellipse,{x:x-r,y:y-r,w:2*r,h:2*r,fill:{color:INK},line:{color:INK,width:0}}); }
function ring(x,y,rx,ry){ s.addShape(p.ShapeType.ellipse,{x:x-rx,y:y-ry,w:2*rx,h:2*ry,fill:{type:"none"},line:{color:INK,width:LW}}); }
function rect(x,y,w,h,lw){ s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{type:"none"},line:{color:INK,width:lw||1}}); }
function txt(t,x,y,w,h,o){ s.addText(t,T(Object.assign({x,y,w,h,fontFace:F,fontSize:9.5,color:INK},o))); }

/* ---- tarama üreticileri (a,b = iç alanın sol üstü, L = iç kenar) ---- */
function yatay(a,b,L,n){ for(let k=0;k<n;k++){ const y=b+(k+0.5)*L/n; seg(a,y,a+L,y); } }
function dikey(a,b,L,n){ for(let k=0;k<n;k++){ const x=a+(k+0.5)*L/n; seg(x,b,x,b+L); } }
function egik(a,b,L,n,dir){
  for(let k=1;k<n;k++){ const t=k*L/n;
    if(dir<0){ seg(a,b+t,a+t,b); seg(a+t,b+L,a+L,b+t); }
    else     { seg(a,b+L-t,a+t,b+L); seg(a+t,b,a+L,b+L-t); } }
  if(dir<0) seg(a,b+L,a+L,b); else seg(a,b,a+L,b+L);
}
function kontur(a,b,L,n){
  const amp=0.095;
  for(let r=0;r<n;r++){ const y0=b+amp+(r+0.5)*(L-amp)/n;
    for(let k=0;k<10;k++){ const t1=k/10,t2=(k+1)/10;
      seg(a+t1*L, y0-amp*Math.sin(Math.PI*t1), a+t2*L, y0-amp*Math.sin(Math.PI*t2)); } }
}
/* sarsılmış ızgara: N öğeyi kareye eşit dağıtır, kümelenme olmaz */
function izgara(a,b,L,N,inset,jit){
  const n=Math.ceil(Math.sqrt(N)), c=(L-2*inset)/n, out=[];
  for(let r=0;r<n;r++) for(let k=0;k<n;k++){
    if(out.length>=N) break;
    out.push([a+inset+(k+0.5)*c+(rnd()-0.5)*c*jit, b+inset+(r+0.5)*c+(rnd()-0.5)*c*jit]);
  }
  return out;
}
function nokta(a,b,L,N,r){ izgara(a,b,L,N,r+0.01,1.3).forEach(q=>dot(q[0],q[1],r)); }
function dolasik(a,b,L,N){
  izgara(a,b,L,N,0.07,1.5).forEach(q=>{
    const rx=0.046+0.020*rnd(), ry=0.034+0.018*rnd();
    ring(Math.min(Math.max(q[0],a+rx),a+L-rx), Math.min(Math.max(q[1],b+ry),b+L-ry), rx, ry); });
}
function kirik(a,b,L,N,len){
  izgara(a,b,L,N,len*0.55,1.4).forEach(q=>{
    const ang=(-60+24*(rnd()-0.5))*Math.PI/180;
    const dx=Math.cos(ang)*len/2, dy=Math.sin(ang)*len/2;
    seg(q[0]-dx,q[1]+dy,q[0]+dx,q[1]-dy); });
}

/* ---------------- BAŞLIK ---------------- */
txt("IMC321  ·  SERBEST ÇİZİM TEKNİKLERİ  ·  9. HAFTA  ·  26 KASIM 2026",M,0.50,W,0.18,{fontSize:9,charSpacing:1,color:GREY});
txt("Dokuz Tarama Biçimi",M,0.73,W,0.38,{fontSize:20,bold:true});
txt("Dokuz karenin hepsi aynı koyulukta. Değişen tek şey iz — koyuluk sabit. Her kareyi kendi kâğıdında birebir tekrarla.",
    M,1.15,W,0.30,{fontSize:10,lineSpacing:14});

/* ---------------- DOKUZ KARE ---------------- */
const SQ=(W-2*G)/3, PAD=0.08, L=SQ-2*PAD, PITCH=SQ+0.40, GY=1.72;
const teks=[
 ["YATAY TARAMA","horizontal hatching",   (a,b)=>yatay(a,b,L,34)],
 ["DİKEY TARAMA","vertical hatching",     (a,b)=>dikey(a,b,L,34)],
 ["EĞİK TARAMA","diagonal hatching",      (a,b)=>egik(a,b,L,24,-1)],
 ["ÇAPRAZ TARAMA","cross-hatching",       (a,b)=>{egik(a,b,L,13,-1); egik(a,b,L,13,1);}],
 ["ÜÇLÜ ÇAPRAZ","three-way cross-hatching",(a,b)=>{yatay(a,b,L,12); egik(a,b,L,9,-1); egik(a,b,L,9,1);}],
 ["KONTUR TARAMASI","contour hatching",   (a,b)=>kontur(a,b,L,36)],
 ["NOKTALAMA","stippling",                (a,b)=>nokta(a,b,L,333,0.028)],
 ["DOLAŞIK TARAMA","scumbling",           (a,b)=>dolasik(a,b,L,252)],
 ["KIRIK TARAMA","broken hatching",       (a,b)=>kirik(a,b,L,529,0.15)]
];
teks.forEach((t,i)=>{
  const c=i%3, r=Math.floor(i/3);
  const x=M+c*(SQ+G), y=GY+r*PITCH;
  rect(x,y,SQ,SQ);
  t[2](x+PAD, y+PAD);
  txt((i+1)+"  "+t[0], x, y+SQ+0.08, SQ, 0.16, {fontSize:8.5,bold:true});
  txt(t[1],            x, y+SQ+0.24, SQ, 0.14, {fontSize:7.5,italic:true,color:FAINT});
});

/* ---------------- ALT BLOK ---------------- */
{
  const FY=GY+3*PITCH-0.03;
  s.addShape(p.ShapeType.line,{x:M,y:FY,w:W,h:0,line:{color:INK,width:1}});
  txt("NASIL ETÜD EDİLİR",M,FY+0.13,W,0.16,{fontSize:8.5,bold:true,charSpacing:0.8});
  const ad=[
   "Her kareyi kendi kâğıdında aynı boyutta tekrarla — küçültme, hızlandırma.",
   "Fineliner kullan. Koyuluk aralıkla üretilir; kaleme bastırmak yok.",
   "Bitince gözünü kıs ve üç adım geri çekil: dokuz kare de aynı grilikte mi?"
  ];
  ad.forEach((a,i)=>{
    txt("—",M,FY+0.36+i*0.22,0.16,0.16,{fontSize:9,color:GREY});
    txt(a,M+0.24,FY+0.36+i*0.22,W-0.24,0.16,{fontSize:9.5});
  });
}

p.writeFile({fileName:"/home/user/sanat-ve-mekan/ders/serbest-cizim-teknikleri/10-dokuz-tarama-etudu-A4.pptx"})
 .then(f=>console.log("yazıldı:",f));
