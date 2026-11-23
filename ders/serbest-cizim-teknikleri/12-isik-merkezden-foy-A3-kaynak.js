const pptxgen = require("pptxgenjs");
const p = new pptxgen();
const mm = v => v/25.4;
p.defineLayout({ name:"A3P", width:mm(297), height:mm(420) });
p.layout = "A3P";
p.author = "IMC321 Serbest Çizim Teknikleri";
p.title  = "Işık Merkezden — Çalışma Föyü";

const INK="1A1A1A", GREY="707070", FAINT="9A9A9A", F="Arial";
const s = p.addSlide(); s.background={color:"FFFFFF"};

const PAD=21, CW=297-2*PAD;                    // 255
function ring(x,y,r,lw,c){ s.addShape(p.ShapeType.ellipse,
  {x:mm(x-r),y:mm(y-r),w:mm(2*r),h:mm(2*r),fill:{type:"none"},line:{color:c||INK,width:lw||1}}); }
function oval(x,y,rx,ry,lw,c,dash){ s.addShape(p.ShapeType.ellipse,
  {x:mm(x-rx),y:mm(y-ry),w:mm(2*rx),h:mm(2*ry),fill:{type:"none"},
   line:{color:c||INK,width:lw||1,dashType:dash||"solid"}}); }
function arrow(x1,y1,x2,y2){
  const x=Math.min(x1,x2), y=Math.min(y1,y2), w=Math.abs(x2-x1), h=Math.abs(y2-y1);
  const fh=(x2<x1), fv=(y2<y1);
  s.addShape(p.ShapeType.line,{x:mm(x),y:mm(y),w:mm(w),h:mm(h),flipH:fh,flipV:fv,
    line:{color:GREY,width:1,endArrowType:"triangle"}});
}
function seg(x1,y1,x2,y2,c,lw){
  const x=Math.min(x1,x2), y=Math.min(y1,y2), w=Math.abs(x2-x1), h=Math.abs(y2-y1);
  s.addShape(p.ShapeType.line,{x:mm(x),y:mm(y),w:mm(w),h:mm(h),flipV:((x2-x1)*(y2-y1))<0,
    line:{color:c||INK,width:lw||1}});
}
function txt(t,x,y,w,o){ s.addText(t,Object.assign({isTextBox:true,margin:0,
  x:mm(x),y:mm(y),w:mm(w),h:mm((o&&o.hmm)||5),fontFace:F,fontSize:9,color:INK},o)); }

/* ---------------- BAŞLIK ---------------- */
txt("IMC321  ·  SERBEST ÇİZİM TEKNİKLERİ  ·  ÇALIŞMA FÖYÜ",PAD,21,CW,{fontSize:9,charSpacing:1,color:GREY});
txt("Işık Merkezden",PAD,28.5,CW,{fontSize:20,bold:true,hmm:10});
txt("Sekiz kürenin ışığı ortadaki kaynaktan geliyor. Her küreyi kendi ışık yönüne göre tonla, düşen gölgesini de çiz.",
    PAD,42,CW,{fontSize:10});

/* ---------------- TEKERLEK ---------------- */
const CX=148.5, CY=192.5, R=82, SR=25.5, HUB=22;
for(let k=0;k<8;k++){
  const a=k*Math.PI/4, sx=Math.sin(a), sy=-Math.cos(a);
  arrow(CX+sx*(HUB+3), CY+sy*(HUB+3), CX+sx*(R-SR-4), CY+sy*(R-SR-4));
  ring(CX+sx*R, CY+sy*R, SR, 1);
}
ring(CX,CY,HUB,1);
txt("IŞIK\nMERKEZDEN",CX-HUB,CY-6,2*HUB,{fontSize:9,bold:true,align:"center",lineSpacing:11,hmm:12});

/* ---------------- KÖŞE NOTLARI ---------------- */
const NW=64, WY0=65, WY1=320;
[["Işık yönü her küre için merkezden dışa doğrudur.",PAD,WY0+2],
 ["En parlak nokta her zaman merkeze bakan yüzdedir.",297-PAD-NW,WY0+2],
 ["Çekirdek gölge merkezin karşı tarafında, kenardan biraz içeride durur.",PAD,WY1-28],
 ["Düşen gölge merkezin tersine, dışa doğru uzar.",297-PAD-NW,WY1-28]
].forEach(n=>txt(n[0],n[1],n[2],NW,{fontSize:9,color:GREY,lineSpacing:11,hmm:26}));

/* ---------------- ALT ŞERİT · KÜRE ANATOMİSİ ---------------- */
{
  const SY=335;
  seg(PAD,SY,297-PAD,SY,INK,1);
  txt("KÜRE ANATOMİSİ",PAD,SY+6,CW/2,{fontSize:9,bold:true,charSpacing:0.8});
  txt("küre çapı 51 mm  ·  A3  297 × 420 mm",PAD+CW/2,SY+6,CW/2,
      {fontSize:9,color:FAINT,align:"right"});

  const ax=PAD+22, ay=SY+41, r=16;
  ring(ax,ay,r,1);
  oval(ax+22,ay+13,14,4.5,1,FAINT,"dash");                 // düşen gölgenin yeri
  [[-6.9,-7.7,"1"],[-1.4,-1.4,"2"],[6.9,6.2,"3"],[10.4,9.8,"4"],[21.6,12,"5"]]
    .forEach(q=>txt(q[2],ax+q[0]-3,ay+q[1]-2.2,6,{fontSize:8,color:GREY,align:"center"}));

  [["1","en parlak nokta"],["2","ara ton"],["3","çekirdek gölge"],
   ["4","yansıyan ışık"],["5","düşen gölge"]].forEach((l,i)=>{
    const c=Math.floor(i/3), r2=i%3, x=PAD+80+c*80, y=SY+24+r2*11;
    txt(l[0],x,y,5,{fontSize:9,color:GREY});
    txt(l[1],x+7,y,70,{fontSize:9});
  });
}

p.writeFile({fileName:"/home/user/sanat-ve-mekan/ders/serbest-cizim-teknikleri/12-isik-merkezden-foy-A3.pptx"})
 .then(f=>console.log("yazıldı:",f));
