const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE";
p.author = "Serbest Çizim Teknikleri";
p.title  = "IMC321 Serbest Çizim Teknikleri — 1. Hafta";

const INK="1B1F24", PAPER="FFFFFF", CARD="F1F3F4", BLUE="2A6289",
      BLUELT="7FA9C6", MUTED="6B747C", LINE="D8DCDF", WHITE="FFFFFF", SOFT="C9CCCE";
const G=["FAFAFA","E2E4E5","C9CCCE","AFB4B7","959B9F","7B8288","5F676D","414950","232A2F"];
const FS="Century Schoolbook", FB="Calibri", FM="Courier New";
const MX=0.85, CW=11.63;
const T=(o)=>Object.assign({isTextBox:true,margin:0},o);
function dark(){ const s=p.addSlide(); s.background={color:INK}; return s; }
function light(){ const s=p.addSlide(); s.background={color:PAPER}; return s; }
function eyebrow(s,txt,onDark){ s.addText(txt,T({x:MX,y:0.52,w:CW,h:0.3,fontFace:FM,fontSize:11,charSpacing:1.6,color:onDark?BLUELT:MUTED})); }
function title(s,txt,y,size){ s.addText(txt,T({x:MX,y:y||0.95,w:CW,h:1.0,fontFace:FS,fontSize:size||34,bold:true,color:INK,lineSpacing:38})); }
function src(s,txt){ s.addText(txt,T({x:MX,y:6.72,w:CW,h:0.35,fontFace:FM,fontSize:10,color:MUTED,lineSpacing:13})); }
function card(s,x,y,w,h){ s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{color:CARD},line:{color:CARD,width:0}}); }
function divider(num,head,sub,note){
  const s=dark();
  s.addText(num,T({x:MX,y:1.75,w:3.2,h:1.9,fontFace:FM,fontSize:110,bold:true,color:BLUE}));
  s.addText(head,T({x:MX,y:3.75,w:CW,h:0.9,fontFace:FS,fontSize:44,bold:true,color:WHITE}));
  s.addText(sub,T({x:MX,y:4.72,w:9.6,h:0.6,fontFace:FB,fontSize:17,color:SOFT}));
  if(note) s.addNotes(note);
  return s;
}
function quote(txt,who,note){
  const s=dark();
  s.addText("“",T({x:MX-0.05,y:0.95,w:2,h:1.3,fontFace:FS,fontSize:72,color:BLUE}));
  s.addText(txt,T({x:MX,y:2.05,w:11.0,h:3.0,fontFace:FS,fontSize:30,italic:true,color:WHITE,lineSpacing:42}));
  s.addText(who,T({x:MX,y:5.45,w:CW,h:0.4,fontFace:FM,fontSize:13,charSpacing:1.4,color:BLUELT}));
  if(note) s.addNotes(note);
  return s;
}

/* 1 KAPAK */
{
  const s=dark();
  s.addText("İÇ MİMARLIK VE ÇEVRE TASARIMI · IMC321 · 2026–27 GÜZ · 1. HAFTA",T({x:MX,y:1.45,w:CW,h:0.35,fontFace:FM,fontSize:13,charSpacing:2,color:BLUELT}));
  s.addText("Serbest Çizim\nTeknikleri",T({x:MX,y:1.95,w:9.2,h:2.5,fontFace:FS,fontSize:60,bold:true,color:WHITE,lineSpacing:64}));
  s.addText("Derse giriş: çizim nedir, kalem nasıl tutulur, nasıl bakılır?",T({x:MX,y:4.62,w:9.2,h:0.5,fontFace:FB,fontSize:20,color:SOFT}));
  s.addText("Perşembe 12.40–14.20  ·  Mahzen Üst Salon  ·  2 kredi / 4 AKTS  ·  seçmeli",T({x:MX,y:6.35,w:8,h:0.4,fontFace:FM,fontSize:12,charSpacing:1.2,color:MUTED}));
  [0.6,1.0,1.6,2.4,3.4,5.0].forEach((wgt,i)=>{ s.addShape(p.ShapeType.line,{x:10.5,y:2.35+i*0.42,w:2.0,h:0,line:{color:i<3?"4A545C":BLUELT,width:wgt}}); });
  s.addText("çizgi ağırlığı merdiveni",T({x:10.5,y:4.95,w:2.2,h:0.3,fontFace:FM,fontSize:9,color:MUTED}));
  s.addNotes("Açılış. Ders 100 dakika (12.40–14.20). Süre planı: açılış + izlence 10 dk, tarihçe 30 dk, dönem planı ve kurallar 20 dk, kalem tutma ve sertlikler 15 dk, uygulama 20 dk, kapanış 5 dk.\n\nSağdaki altı çizgi bugünün ilk egzersizi: aynı kalemle altı farklı ağırlıkta çizgi.");
}

/* 2 TEZ */
{
  const s=light();
  eyebrow(s,"BAŞLARKEN");
  s.addText("Bu bir\nyetenek dersi\ndeğil.",T({x:MX,y:1.35,w:6.6,h:3.4,fontFace:FS,fontSize:52,bold:true,color:INK,lineSpacing:60}));
  card(s,7.9,1.35,4.58,4.0);
  s.addText([
    {text:"Çizim öğrenilebilir bir beceridir.",options:{bold:true,breakLine:true,fontSize:17}},
    {text:"\n",options:{breakLine:true,fontSize:8}},
    {text:"Ölçtüğümüz şey doğuştan gelen bir hüner değil; ",options:{breakLine:false}},
    {text:"gören, ölçen, kuran ve anlatan bir el",options:{bold:true,breakLine:false}},
    {text:".",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:8}},
    {text:"İlk iki hafta sizden “doğru çizim” istemeyeceğiz. Ölçüm baskısı 3. haftada başlıyor. Bu sıralama bilinçli.",options:{breakLine:true}}
  ],T({x:8.25,y:1.7,w:3.88,h:3.4,fontFace:FB,fontSize:15,color:INK,lineSpacing:22}));
  s.addText("“Kalem, hayal eden zihin ile beliren imge arasındaki köprüdür.”  — Juhani Pallasmaa",T({x:MX,y:5.6,w:CW,h:0.4,fontFace:FS,fontSize:15,italic:true,color:BLUE}));
  s.addNotes("El kaldırma sorusu: “Kaçınız çizim yapamadığını düşünüyor?” Genelde yarısı el kaldırır. Bunu veri olarak alın; 14. haftada aynı soruyu tekrar soracağız.");
}

/* 3 PLAN */
{
  const s=light();
  eyebrow(s,"BUGÜN");
  title(s,"Bu derste ne konuşacağız");
  const items=[
    ["01","Çizimin kısa tarihi","73.000 yıl, bir gölge, bir kelime ve bir kalem"],
    ["02","Çizmenin dokuz adımı","Dersin omurgası: nokta'dan katmana"],
    ["03","El ve alet","Kalem nasıl tutulur, hangi kalem ne işe yarar"],
    ["04","Dönem planı","14 hafta, bir quiz, iki teslim"],
    ["05","Kurallar ve malzeme","Neye uyacağız, ne alacağız"],
    ["06","Uygulama","Ustaların çizgileri: bugünün ilk iki kutusu"]
  ];
  items.forEach((it,i)=>{
    const col=i%2, row=Math.floor(i/2); const x=MX+col*6.0, y=2.05+row*1.42;
    s.addText(it[0],T({x,y,w:0.7,h:0.4,fontFace:FM,fontSize:15,bold:true,color:BLUE}));
    s.addText(it[1],T({x:x+0.78,y:y-0.03,w:4.9,h:0.38,fontFace:FB,fontSize:17,bold:true,color:INK}));
    s.addText(it[2],T({x:x+0.78,y:y+0.36,w:4.9,h:0.6,fontFace:FB,fontSize:13,color:MUTED,lineSpacing:17}));
  });
  s.addNotes("Son maddeyi vurgulayın: bugün de çizeceğiz. Ders anlatım saati değil, üretim saati.");
}

/* 4 DIV 01 */
divider("01","Çizimin kısa tarihi","Altı durak, altı kural","Bölüm 1. Her durağı dersin bir kuralına bağlayın — kronoloji ezberletmiyoruz.");

/* 5 BLOMBOS */
{
  const s=light();
  eyebrow(s,"BÖLÜM 1 · TARİHÇE");
  s.addText("73.000",T({x:MX,y:1.15,w:5.4,h:1.5,fontFace:FM,fontSize:78,bold:true,color:INK}));
  s.addText("yıl önce, bir taş parçasının üzerine\ndokuz çizgi çizildi.",T({x:MX,y:2.62,w:5.6,h:0.9,fontFace:FS,fontSize:21,color:INK,lineSpacing:29}));
  s.addText([
    {text:"Güney Afrika, Blombos Mağarası. ",options:{bold:true,breakLine:false}},
    {text:"İnce uçlu bir aşıboyası parçası kalem gibi kullanılarak silkrit bir yonga üzerine çizilmiş çapraz tarama. Bilinen en eski çizim — öncekileri en az 30.000 yıl geride bırakıyor.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:9}},
    {text:"Önemli olan şu: bu bir alet değil. Kesmiyor, taşımıyor, işe yaramıyor. ",options:{breakLine:false}},
    {text:"Sadece bir işaret.",options:{bold:true,breakLine:false}}
  ],T({x:MX,y:3.75,w:5.6,h:2.6,fontFace:FB,fontSize:15,color:INK,lineSpacing:22}));
  card(s,7.4,1.15,5.08,4.6);
  const bx=8.1, by=1.95;
  [0,1,2,3,4,5].forEach(i=>{ s.addShape(p.ShapeType.line,{x:bx+i*0.62,y:by,w:0.95,h:2.6,line:{color:i%2?G[7]:G[8],width:2.2}}); });
  [0,1,2].forEach(i=>{ s.addShape(p.ShapeType.line,{x:bx-0.15,y:by+0.55+i*0.85,w:3.9,h:0,line:{color:G[6],width:2.2}}); });
  s.addText("dokuz çizgilik çapraz tarama · şematik",T({x:7.75,y:5.1,w:4.4,h:0.3,fontFace:FM,fontSize:10,color:MUTED}));
  src(s,"Henshilwood ve ark., “An abstract drawing from the 73,000-year-old levels at Blombos Cave, South Africa”, Nature, 12 Eylül 2018.");
  s.addNotes("Soru sorun: “Sıkıldığınızda defterin kenarına ne çiziyorsunuz?” Aynı davranış, 73.000 yıldır.");
}

/* 6 BUTADES */
{
  const s=light();
  eyebrow(s,"BÖLÜM 1 · TARİHÇE");
  title(s,"Çizim bir gölgeden doğdu");
  s.addText([
    {text:"Plinius, ",options:{breakLine:false}},{text:"Doğa Tarihi",options:{italic:true,breakLine:false}},
    {text:" (MS 77–79): Korintli çömlekçi Butades’in kızı, ertesi gün yola çıkacak sevgilisinin ",options:{breakLine:false}},
    {text:"kandil ışığıyla duvara düşen gölgesinin konturunu çizer",options:{bold:true,breakLine:false}},
    {text:". Babası bu ize kil basıp fırınlar.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:9}},
    {text:"Batı düşüncesinde bu, çizimin kuruluş anlatısıdır. Bizim için üç şey söylüyor:",options:{breakLine:true}}
  ],T({x:MX,y:2.0,w:6.5,h:2.2,fontFace:FB,fontSize:15,color:INK,lineSpacing:22}));
  [["Çizim bir kayıptan doğar.","Gitmekte olan bir şeyi tutma girişimi."],
   ["İlk çizim bir duvarın üzerindeydi.","Yani ilk çizim yüzeyi bir iç mekândı."],
   ["Kontur, ışığın bıraktığı sınırdır.","Çizgi icat edilmedi — bulundu."]].forEach((f,i)=>{
    const y=4.35+i*0.72;
    s.addShape(p.ShapeType.ellipse,{x:MX,y:y+0.04,w:0.26,h:0.26,fill:{color:BLUE},line:{color:BLUE,width:0}});
    s.addText(f[0],T({x:MX+0.45,y,w:6.1,h:0.3,fontFace:FB,fontSize:14,bold:true,color:INK}));
    s.addText(f[1],T({x:MX+0.45,y:y+0.3,w:6.1,h:0.3,fontFace:FB,fontSize:13,color:MUTED}));
  });
  card(s,7.9,1.9,4.58,3.9);
  s.addShape(p.ShapeType.ellipse,{x:8.35,y:3.55,w:0.36,h:0.36,fill:{color:BLUE},line:{color:BLUE,width:0}});
  s.addText("kandil",T({x:8.15,y:4.0,w:0.9,h:0.25,fontFace:FM,fontSize:9,color:MUTED}));
  s.addShape(p.ShapeType.line,{x:9.85,y:2.6,w:0,h:2.5,line:{color:G[7],width:3}});
  s.addText("figür",T({x:9.55,y:5.15,w:0.9,h:0.25,fontFace:FM,fontSize:9,color:MUTED}));
  s.addShape(p.ShapeType.rect,{x:11.55,y:2.35,w:0.16,h:3.0,fill:{color:G[8]},line:{color:G[8],width:0}});
  s.addShape(p.ShapeType.rect,{x:11.71,y:2.6,w:0.5,h:2.5,fill:{color:G[3]},line:{color:G[3],width:0}});
  s.addShape(p.ShapeType.line,{x:8.6,y:3.6,w:3.0,h:-0.95,line:{color:BLUELT,width:1,dashType:"dash"}});
  s.addShape(p.ShapeType.line,{x:8.6,y:3.78,w:3.0,h:1.35,line:{color:BLUELT,width:1,dashType:"dash"}});
  s.addText("gölge = ilk çizgi",T({x:11.35,y:5.42,w:1.2,h:0.25,fontFace:FM,fontSize:9,color:BLUE}));
  src(s,"Plinius, Naturalis Historia, XXXV — “Butades / Korintli Kız” anlatısı.");
  s.addNotes("Işığı kapatıp telefon fenerini bir öğrencinin profiline tutun; duvardaki gölgenin konturunu parmakla gösterin. On saniye sürer, dersin en akılda kalan anı olur.");
}

/* 7 DISEGNO */
{
  const s=light();
  eyebrow(s,"BÖLÜM 1 · TARİHÇE");
  title(s,"Disegno: çizim ile tasarım aynı kelimedir");
  s.addText([
    {text:"İtalyanca ",options:{breakLine:false}},{text:"disegno",options:{italic:true,bold:true,breakLine:false}},
    {text:" hem “çizim” hem “tasarım” demektir. Vasari 1568’de onu ",options:{breakLine:false}},
    {text:"“üç sanatın babası” ",options:{bold:true,breakLine:false}},
    {text:"olarak tanımlar: mimarlık, heykel, resim. Ona göre disegno elin değil, ",options:{breakLine:false}},
    {text:"önce zihnin işidir",options:{bold:true,breakLine:false}},
    {text:". Tarihin ilk güzel sanatlar akademisinin adı da budur: Accademia delle Arti del Disegno (Floransa, 1563).",options:{breakLine:true}}
  ],T({x:MX,y:2.0,w:6.5,h:2.4,fontFace:FB,fontSize:16,color:INK,lineSpacing:24}));
  s.addText("Bu dersin var oluş sebebi bu kelimede saklı:\nçizmeyi öğrenmek, tasarlamayı öğrenmenin bir parçasıdır.",T({x:MX,y:4.7,w:6.5,h:1.2,fontFace:FS,fontSize:19,italic:true,color:BLUE,lineSpacing:28}));
  card(s,7.9,1.9,4.58,3.9);
  s.addText("disegno",T({x:8.3,y:2.35,w:3.8,h:0.8,fontFace:FS,fontSize:40,bold:true,color:INK}));
  [["çizim","elin işi"],["tasarım","zihnin işi"]].forEach((d,i)=>{
    const y=3.45+i*0.95;
    s.addShape(p.ShapeType.line,{x:8.3,y:y-0.12,w:0.55,h:0,line:{color:BLUE,width:2}});
    s.addText(d[0],T({x:9.0,y:y-0.32,w:2.9,h:0.35,fontFace:FB,fontSize:19,bold:true,color:INK}));
    s.addText(d[1],T({x:9.0,y:y+0.06,w:2.9,h:0.3,fontFace:FB,fontSize:13,color:MUTED}));
  });
  s.addText("tek kelime, iki iş",T({x:8.3,y:5.25,w:3.8,h:0.3,fontFace:FM,fontSize:10,color:MUTED}));
  src(s,"Giorgio Vasari, Le Vite, 2. baskı, 1568 · Accademia delle Arti del Disegno, Floransa, 1563.");
  s.addNotes("Türkçede bu bağ kayboluyor: “çizim” ve “tasarım” ayrı kelimeler. İtalyancada tek kelime — bu tesadüf değil.");
}

/* 8 KALEMİN TARİHİ */
{
  const s=light();
  eyebrow(s,"BÖLÜM 1 · TARİHÇE");
  title(s,"Elinizdeki kalem 230 yaşında");
  s.addText([
    {text:"1564 ",options:{bold:true,breakLine:false}},
    {text:"— İngiltere’de ",options:{breakLine:false}},{text:"Borrowdale",options:{bold:true,breakLine:false}},
    {text:"’de saf grafit yatağı bulunur. Çubuk hâlinde kesilip iple sarılarak kullanılır. Ama yatak tükenir.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:9}},
    {text:"1795 ",options:{bold:true,breakLine:false}},
    {text:"— Fransız bilim insanı ",options:{breakLine:false}},{text:"Nicolas-Jacques Conté",options:{bold:true,breakLine:false}},
    {text:", grafiti toz hâline getirip ",options:{breakLine:false}},
    {text:"kille karıştırır ve fırınlar",options:{bold:true,breakLine:false}},
    {text:". Hem hammadde sıkıntısını çözer hem de yepyeni bir şey kazandırır: ayarlanabilir sertlik.",options:{breakLine:true}}
  ],T({x:MX,y:2.0,w:6.4,h:2.8,fontFace:FB,fontSize:16,color:INK,lineSpacing:24}));
  s.addText("Kil çok → sert (H).  Grafit çok → yumuşak (B).\nElinizdeki 2B, bir savaş dönemi hammadde sıkıntısının çözümüdür.",T({x:MX,y:5.05,w:6.4,h:1.2,fontFace:FS,fontSize:18,italic:true,color:BLUE,lineSpacing:26}));
  card(s,7.7,1.9,4.78,4.1);
  const labs=["9H","4H","2H","H","HB","B","2B","4B","6B","9B"];
  labs.forEach((l,i)=>{
    const y=2.25+i*0.36;
    s.addShape(p.ShapeType.line,{x:9.5,y:y+0.12,w:2.4,h:0,line:{color:G[Math.min(8,Math.round(i*0.9))],width:0.8+i*0.42}});
    s.addText(l,T({x:8.1,y,w:1.1,h:0.28,fontFace:FM,fontSize:12,bold:(l==="HB"),color:(l==="HB")?BLUE:INK}));
  });
  s.addText("sert · açık",T({x:8.1,y:2.02,w:2,h:0.24,fontFace:FM,fontSize:9,color:MUTED}));
  s.addText("yumuşak · koyu",T({x:8.1,y:5.68,w:2.4,h:0.24,fontFace:FM,fontSize:9,color:MUTED}));
  src(s,"Borrowdale grafit yatağı, 1564 · Nicolas-Jacques Conté, grafit–kil karışımı, 1795.");
  s.addNotes("Bu slayt malzeme listesinin gerekçesi: 2H, HB, 2B, 4B, 6B istiyoruz çünkü kuruluş ve ton farklı sertlik istiyor.");
}

/* 9 ÇİZİM MAKİNELERİ */
{
  const s=light();
  eyebrow(s,"BÖLÜM 1 · TARİHÇE");
  title(s,"Çizim hep bir görme aygıtı aradı");
  s.addText([
    {text:"1435 — Alberti, ",options:{bold:true,breakLine:false}},{text:"Della Pittura",options:{italic:true,breakLine:false}},
    {text:"’da ",options:{breakLine:false}},{text:"velo",options:{italic:true,bold:true,breakLine:false}},
    {text:" (peçe) adını verdiği aygıtı tarif eder: ince ipliklerden dokunmuş, kalın ipliklerle karelere bölünmüş, çerçeveye gerilmiş bir tül. Çizer tülün arkasından bakar ve gördüğünü kare kare aktarır.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:9}},
    {text:"1525 — Dürer",options:{bold:true,breakLine:false}},
    {text:" aynı fikri ızgaralı çerçeve gravürleriyle gösterir.",options:{breakLine:true}}
  ],T({x:MX,y:2.0,w:6.3,h:2.6,fontFace:FB,fontSize:16,color:INK,lineSpacing:24}));
  s.addText("4. haftada öğreneceğimiz “dış zarf” yöntemi,\nbu aygıtların elle yapılan hâlidir.",T({x:MX,y:4.95,w:6.3,h:1.0,fontFace:FS,fontSize:19,italic:true,color:BLUE,lineSpacing:27}));
  card(s,7.6,1.9,4.88,4.1);
  const gx=8.6, gy=2.5, gw=2.4, gh=2.4;
  for(let i=0;i<=4;i++){
    s.addShape(p.ShapeType.line,{x:gx+i*(gw/4),y:gy,w:0,h:gh,line:{color:i%2?G[3]:G[5],width:i%2?0.8:1.4}});
    s.addShape(p.ShapeType.line,{x:gx,y:gy+i*(gh/4),w:gw,h:0,line:{color:i%2?G[3]:G[5],width:i%2?0.8:1.4}});
  }
  s.addShape(p.ShapeType.ellipse,{x:11.35,y:3.4,w:0.3,h:0.3,fill:{color:BLUE},line:{color:BLUE,width:0}});
  s.addShape(p.ShapeType.line,{x:11.35,y:3.55,w:-0.4,h:0,line:{color:BLUELT,width:1,dashType:"dash"}});
  s.addText("göz",T({x:11.3,y:3.78,w:0.9,h:0.25,fontFace:FM,fontSize:9,color:MUTED}));
  s.addText("velo · ızgaralı çerçeve",T({x:8.4,y:5.12,w:3.4,h:0.3,fontFace:FM,fontSize:10,color:MUTED}));
  src(s,"Leon Battista Alberti, De pictura / Della Pittura, 1435 · Albrecht Dürer, Underweysung der Messung, Nürnberg, 1525.");
  s.addNotes("Bu slayt 4. haftanın dış zarf yöntemini önceden meşrulaştırıyor: yöntem yeni değil, 600 yıllık bir problemin elle çözümü.");
}

/* 10 AKADEMİDEN BUGÜNE */
{
  const s=light();
  eyebrow(s,"BÖLÜM 1 · TARİHÇE");
  title(s,"Çizim öğretilebilir bileşenlere ayrıldı");
  const tl=[["1563","Accademia delle Arti del Disegno","Floransa. Çizim ilk kez kurumsal bir müfredat konusu."],
            ["1919","Bauhaus Vorkurs","Itten’in temel kursu. Bugünkü “temel tasarım” dersinin atası."],
            ["1941","Nicolaïdes · The Natural Way to Draw","Kör kontur ve dinamik çizim. 5. haftamızın kaynağı."],
            ["1979","Edwards · Right Side of the Brain","Çizimi beş bileşen beceriye ayırır."]];
  tl.forEach((t,i)=>{
    const y=2.1+i*1.12;
    s.addText(t[0],T({x:MX,y,w:1.1,h:0.4,fontFace:FM,fontSize:19,bold:true,color:BLUE}));
    s.addText(t[1],T({x:MX+1.3,y:y-0.02,w:6.0,h:0.4,fontFace:FB,fontSize:18,bold:true,color:INK}));
    s.addText(t[2],T({x:MX+1.3,y:y+0.4,w:9.6,h:0.4,fontFace:FB,fontSize:14,color:MUTED}));
    if(i<3) s.addShape(p.ShapeType.line,{x:MX+0.35,y:y+0.5,w:0,h:0.55,line:{color:LINE,width:1.5}});
  });
  s.addText("Bu dersin dokuz adımı o geleneğin devamıdır.",T({x:MX,y:6.2,w:CW,h:0.35,fontFace:FB,fontSize:15,italic:true,color:BLUE}));
  s.addNotes("Kısa geçin. Amaç: çizimin bir sır değil, ayrıştırılabilir bir beceri olduğunu göstermek.");
}

/* 11 ALINTI INGRES */
quote("Çizim, sanatın dürüstlüğüdür.","JEAN-AUGUSTE-DOMINIQUE INGRES  ·  “Le dessin est la probité de l’art.”",
  "Probité: dürüstlük, doğruluk, sağlamlık. Renk ve efekt gizler, çizgi gizlemez.");

/* 12 DIV 02 */
divider("02","Çizmenin dokuz adımı","Dersin omurgası","Bölüm 2: dersin yapısı. Bu diyagramı öğrencilere fotoğraflatın.");

/* 13 DOKUZ ADIM */
{
  const s=light();
  eyebrow(s,"BÖLÜM 2 · OMURGA");
  title(s,"Nokta’dan katmana");
  s.addText("Ders kavramsal başlıklarla değil, çizme eyleminin kendi adımlarıyla ilerler. Her adım bir öncekinin üzerine biner ve hiçbiri atlanamaz.",T({x:MX,y:1.95,w:CW,h:0.5,fontFace:FB,fontSize:15,color:MUTED}));
  const steps=[["1","nokta","H2"],["2","çizgi","H2"],["3","düzlem","H3"],["4","hacim","H4"],["5","kontur","H6"],
               ["6","perspektif","H7"],["7","doku","H9"],["8","ışık","H10"],["9","katman","H13"]];
  s.addShape(p.ShapeType.line,{x:MX+0.2,y:3.55,w:11.0,h:0,line:{color:LINE,width:1.5}});
  steps.forEach((st,i)=>{
    const x=MX+0.2+i*1.375;
    s.addShape(p.ShapeType.ellipse,{x:x-0.16,y:3.39,w:0.32,h:0.32,fill:{color:i<2?BLUE:(i<6?G[6]:INK)},line:{color:WHITE,width:1.5}});
    s.addText(st[0],T({x:x-0.5,y:3.02,w:1.0,h:0.28,fontFace:FM,fontSize:11,color:MUTED,align:"center"}));
    s.addText(st[1],T({x:x-0.72,y:3.86,w:1.44,h:0.3,fontFace:FB,fontSize:14,bold:true,color:INK,align:"center"}));
    s.addText(st[2],T({x:x-0.5,y:4.2,w:1.0,h:0.26,fontFace:FM,fontSize:10,color:BLUE,align:"center"}));
  });
  const ph=[["I · İZ","H2",0,1],["II · BİÇİM","H3–7",2,5],["III · YÜZEY","H9–10",6,7],["IV · BÜTÜN","H11–14",8,8]];
  ph.forEach(f=>{
    const x1=MX+0.2+f[2]*1.375-0.6, x2=MX+0.2+f[3]*1.375+0.6;
    s.addShape(p.ShapeType.line,{x:x1,y:4.75,w:x2-x1,h:0,line:{color:BLUE,width:1.5}});
    s.addText(f[0],T({x:x1,y:4.9,w:x2-x1,h:0.3,fontFace:FM,fontSize:12,bold:true,color:BLUE,align:"center"}));
    s.addText(f[1],T({x:x1,y:5.2,w:x2-x1,h:0.28,fontFace:FM,fontSize:10,color:MUTED,align:"center"}));
  });
  s.addText("5. hafta (29 Ekim) ders yok  ·  8. hafta quiz.",T({x:MX,y:5.85,w:CW,h:0.35,fontFace:FB,fontSize:14,italic:true,color:MUTED}));
  s.addNotes("Dersin en önemli slaydı. Her hafta başında “bu hafta hangi adımdayız?” diye sorun.");
}

/* 14 DÖRT EVRE */
{
  const s=light();
  eyebrow(s,"BÖLÜM 2 · OMURGA");
  title(s,"Dört evre");
  s.addText("Dokuz adım dört evrede toplanır. Evre çubuklarının kalınlığı dersin kendi konusudur: çizgi ağırlığı hiyerarşisi.",T({x:MX,y:1.95,w:CW,h:0.5,fontFace:FB,fontSize:15,color:MUTED}));
  const mods=[["I","İz","Hafta 1–2","Çizgi ne söyler?","nokta · çizgi",1],
              ["II","Biçim","Hafta 3–7","Biçimi nasıl kurarım?","düzlem · hacim · kontur · perspektif",2],
              ["III","Yüzey","Hafta 9–10","Yüzeyi nasıl anlatırım?","doku · ışık ve gölge",4],
              ["IV","Bütün","Hafta 11–14","Hepsini nasıl birleştiririm?","natürmort · mimari gösterim · katman",6.5]];
  mods.forEach((m,i)=>{
    const x=MX+i*2.95; card(s,x,2.6,2.68,3.4);
    s.addShape(p.ShapeType.line,{x:x+0.28,y:2.95,w:2.1,h:0,line:{color:INK,width:m[5]}});
    s.addText("EVRE "+m[0],T({x:x+0.28,y:3.15,w:2.2,h:0.3,fontFace:FM,fontSize:10,charSpacing:1.2,color:MUTED}));
    s.addText(m[1],T({x:x+0.28,y:3.5,w:2.25,h:0.5,fontFace:FB,fontSize:20,bold:true,color:INK}));
    s.addText(m[3],T({x:x+0.28,y:4.08,w:2.25,h:0.85,fontFace:FB,fontSize:13,color:INK,lineSpacing:18}));
    s.addText(m[4],T({x:x+0.28,y:5.02,w:2.25,h:0.65,fontFace:FM,fontSize:10,color:MUTED,lineSpacing:14}));
    s.addText(m[2],T({x:x+0.28,y:5.62,w:2.2,h:0.3,fontFace:FM,fontSize:11,color:BLUE}));
  });
  s.addNotes("5. hafta (29 Ekim) tatil, 8. hafta quiz olduğu için evre listesinde yok.");
}

/* 15 EDWARDS BEŞ BECERİ */
{
  const s=light();
  eyebrow(s,"BÖLÜM 2 · OMURGA");
  title(s,"Çizmek beş ayrı beceriye ayrılabilir");
  s.addText("Betty Edwards, algısal çizimi öğretilebilir beş bileşene ayırır. Hepsi ayrı ayrı çalışılabilir — ve dersin dokuz adımı bu beşliyi izler.",T({x:MX,y:1.95,w:CW,h:0.6,fontFace:FB,fontSize:15,color:MUTED,lineSpacing:21}));
  const sk=[["1","Kenarları görmek","kontur","Hafta 6"],
            ["2","Boşlukları görmek","negatif alan","Hafta 6"],
            ["3","İlişkileri görmek","oran, dış zarf, göz hizası","Hafta 3 · 4 · 7"],
            ["4","Işık ve gölgeyi görmek","tarama ve ton","Hafta 9 · 10"],
            ["5","Bütünü görmek","natürmort, mimari gösterim, katman","Hafta 11 · 12 · 13"]];
  sk.forEach((k,i)=>{
    const y=2.8+i*0.78;
    s.addShape(p.ShapeType.ellipse,{x:MX,y,w:0.42,h:0.42,fill:{color:BLUE},line:{color:BLUE,width:0}});
    s.addText(k[0],T({x:MX,y:y+0.07,w:0.42,h:0.3,fontFace:FM,fontSize:13,bold:true,color:WHITE,align:"center"}));
    s.addText(k[1],T({x:MX+0.62,y:y+0.02,w:3.7,h:0.35,fontFace:FB,fontSize:17,bold:true,color:INK}));
    s.addText(k[2],T({x:MX+4.4,y:y+0.05,w:3.6,h:0.32,fontFace:FB,fontSize:15,color:MUTED}));
    s.addText(k[3],T({x:MX+8.1,y:y+0.06,w:2.9,h:0.32,fontFace:FM,fontSize:12,color:BLUE}));
  });
  src(s,"Betty Edwards, Drawing on the Right Side of the Brain — algısal çizimin beş bileşen becerisi.");
  s.addNotes("Bu tabloyu fotoğraflatın. Dönem boyunca “şu an hangi beceriyi çalışıyoruz?” diye sorabilirsiniz.");
}

/* 16 ŞEMA */
{
  const s=light();
  eyebrow(s,"BÖLÜM 2 · OMURGA");
  title(s,"Neden hepimiz aynı sandalyeyi çiziyoruz?");
  s.addText([
    {text:"Beyin ekonomiktir. Bir nesneye her baktığında onu yeniden görmez; daha önce kurduğu ",options:{breakLine:false}},
    {text:"şemayı",options:{bold:true,breakLine:false}},
    {text:" çağırır. “Sandalye” dendiğinde zihninizde beliren şey karşınızdaki sandalye değil, ",options:{breakLine:false}},
    {text:"sandalye fikridir",options:{bold:true,breakLine:false}},
    {text:": dört bacak, bir oturma yüzeyi, bir sırt.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:9}},
    {text:"Elinizden çıkan da budur. Bu bir yetenek eksikliği değil; ",options:{breakLine:false}},
    {text:"algının varsayılan ayarıdır",options:{bold:true,breakLine:false}},
    {text:". Dersin ilk işi bu ayarı geçici olarak kapatmayı öğretmek.",options:{breakLine:true}}
  ],T({x:MX,y:2.0,w:6.4,h:3.2,fontFace:FB,fontSize:16,color:INK,lineSpacing:24}));
  s.addText("Bu haftanın ev ödevinde tam olarak bunu göreceksiniz:\nhafızadan çizdiğinizde şema çıkar, gözlemle çizdiğinizde nesne.",T({x:MX,y:5.4,w:6.4,h:0.9,fontFace:FM,fontSize:13,color:BLUE,lineSpacing:22}));
  card(s,7.8,1.9,4.68,4.0);
  s.addText("BİLDİĞİN SANDALYE",T({x:8.2,y:2.2,w:3.9,h:0.3,fontFace:FM,fontSize:10,charSpacing:1.2,color:MUTED}));
  s.addShape(p.ShapeType.line,{x:8.4,y:3.35,w:1.5,h:0,line:{color:G[7],width:3}});
  s.addShape(p.ShapeType.line,{x:8.4,y:3.35,w:0,h:0.85,line:{color:G[7],width:3}});
  s.addShape(p.ShapeType.line,{x:9.9,y:3.35,w:0,h:0.85,line:{color:G[7],width:3}});
  s.addShape(p.ShapeType.line,{x:8.4,y:2.65,w:0,h:0.7,line:{color:G[7],width:3}});
  s.addText("GÖRDÜĞÜN SANDALYE",T({x:8.2,y:4.55,w:3.9,h:0.3,fontFace:FM,fontSize:10,charSpacing:1.2,color:BLUE}));
  s.addShape(p.ShapeType.line,{x:10.55,y:5.25,w:1.45,h:-0.28,line:{color:INK,width:3}});
  s.addShape(p.ShapeType.line,{x:10.62,y:5.3,w:0.16,h:0.52,line:{color:INK,width:3}});
  s.addShape(p.ShapeType.line,{x:11.9,y:5.0,w:0.1,h:0.6,line:{color:INK,width:3}});
  s.addShape(p.ShapeType.line,{x:10.5,y:5.2,w:0.28,h:-0.62,line:{color:INK,width:3}});
  s.addText("aynı nesne, iki farklı iş",T({x:8.2,y:5.5,w:3.9,h:0.3,fontFace:FM,fontSize:10,color:MUTED}));
  s.addNotes("Gösterim: tahtaya “bir ev çizin” deyip 10 saniye verin. Neredeyse herkes üçgen çatılı kare çizer — çoğunun yaşadığı ev öyle değildir. Şema budur.");
}

/* 17 ALINTI EDWARDS */
quote("Sorun görmek — daha doğrusu,\nbelirli bir görme biçimine geçebilmek.","BETTY EDWARDS  ·  Drawing on the Right Side of the Brain",
  "Dersin en pratik cümlesi. El zaten yeterince beceriklidir; imza atabiliyorsanız çizebilirsiniz. Eğitilecek olan göz.");

/* 18 DIV 03 */
divider("03","El ve alet","Kalem nasıl tutulur, hangi kalem ne işe yarar","Bölüm 3: bugünün en pratik kısmı. Herkes kalemini çıkarsın, birlikte deneyeceğiz.");

/* 19 KALEM TUTMA */
{
  const s=light();
  eyebrow(s,"BÖLÜM 3 · EL VE ALET");
  title(s,"Üç tutuş, üç eklem, üç ölçek");
  const gr=[["Yazı tutuşu","tripod","Baş, işaret ve orta parmak, uca yakın","Detay, kontur, küçük ölçek","BİLEK"],
            ["Üstten tutuş","overhand","Kalem avuç içinde, parmaklar üstte, uçtan uzak","Jest, büyük hareket, tonlama","OMUZ"],
            ["Uzun tutuş","—","Uçtan uzak, gevşek","Ölçü alma, hayalet çizgi, kuruluş","DİRSEK"]];
  gr.forEach((g,i)=>{
    const x=MX+i*3.95; card(s,x,2.0,3.63,3.5);
    s.addText(g[0],T({x:x+0.32,y:2.28,w:3.0,h:0.4,fontFace:FB,fontSize:19,bold:true,color:INK}));
    s.addText(g[1],T({x:x+0.32,y:2.72,w:3.0,h:0.28,fontFace:FM,fontSize:10,color:MUTED}));
    s.addText(g[2],T({x:x+0.32,y:3.12,w:3.0,h:0.9,fontFace:FB,fontSize:13.5,color:INK,lineSpacing:19}));
    s.addText(g[3],T({x:x+0.32,y:4.15,w:3.0,h:0.75,fontFace:FB,fontSize:14,bold:true,color:BLUE,lineSpacing:19}));
    s.addShape(p.ShapeType.line,{x:x+0.32,y:4.98,w:0.5,h:0,line:{color:BLUE,width:2}});
    s.addText("hareket "+g[4]+"’den",T({x:x+0.95,y:4.85,w:2.4,h:0.28,fontFace:FM,fontSize:11,bold:true,color:INK}));
  });
  s.addText("Düz bir çizgi bilekten çizilemez. Bu fiziksel bir gerçektir — yetenek meselesi değil.",T({x:MX,y:5.75,w:CW,h:0.4,fontFace:FS,fontSize:19,italic:true,color:BLUE}));
  s.addNotes("Burada 5 dakika ayakta uygulama yaptırın: herkes bir kâğıda önce bilekten, sonra omuzdan 30 cm'lik düz çizgi çeksin. Fark anında görülür.");
}

/* 20 SERTLİK */
{
  const s=light();
  eyebrow(s,"BÖLÜM 3 · EL VE ALET");
  title(s,"Kuruluş için sert, ton için yumuşak");
  s.addText([
    {text:"Bir çizim iki ayrı işten oluşur ve ikisi ",options:{breakLine:false}},
    {text:"aynı kalemle yapılmaz",options:{bold:true,breakLine:false}},
    {text:".",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:9}},
    {text:"Kuruluş — H, HB. ",options:{bold:true,breakLine:false}},
    {text:"Açık, silinebilir, kâğıdı kirletmez. Dış zarf, eksenler, oran çizgileri.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:6}},
    {text:"Ton — 2B, 4B, 6B. ",options:{bold:true,breakLine:false}},
    {text:"Koyu, hızlı, geniş aralık. Gölge, doku, ağırlık.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:9}},
    {text:"En sık yapılan iki hata: yumuşak kalemle kurmak (silinmez, kirlenir) ve sert kalemle tonlamak (kâğıdı çizer, ezer).",options:{breakLine:true}}
  ],T({x:MX,y:2.0,w:6.3,h:4.1,fontFace:FB,fontSize:15.5,color:INK,lineSpacing:22}));
  card(s,7.6,1.95,4.88,4.15);
  const labs=["9H","4H","2H","H","HB","B","2B","4B","6B","9B"];
  labs.forEach((l,i)=>{
    const y=2.32+i*0.36;
    s.addShape(p.ShapeType.line,{x:9.4,y:y+0.12,w:2.5,h:0,line:{color:G[Math.min(8,Math.round(i*0.9))],width:0.8+i*0.42}});
    s.addText(l,T({x:8.0,y,w:1.1,h:0.28,fontFace:FM,fontSize:12,bold:(l==="HB"),color:(l==="HB")?BLUE:INK}));
  });
  s.addText("sert · açık · silinir",T({x:8.0,y:2.08,w:2.6,h:0.24,fontFace:FM,fontSize:9,color:MUTED}));
  s.addText("yumuşak · koyu · kirlenir",T({x:8.0,y:5.9,w:3.0,h:0.24,fontFace:FM,fontSize:9,color:MUTED}));
  s.addNotes("Malzeme listesinde 2H, HB, 2B, 4B, 6B istememizin sebebi bu slayt.");
}

/* 21 YEDİ AYAR */
{
  const s=light();
  eyebrow(s,"BÖLÜM 3 · EL VE ALET");
  title(s,"Elinizde yedi ayar var");
  s.addText("Çizgi tek bir şey değil. Aşağıdakiler bilinçli olarak kontrol edilebilir — ve her biri okuyucuya farklı bir şey söyler. Gelecek hafta bunlarla duygu anlatacağız.",T({x:MX,y:1.95,w:CW,h:0.5,fontFace:FB,fontSize:15,color:MUTED}));
  const vars=[["Basınç","hafif ↔ bastırılmış"],["Hız","yavaş ↔ savrulmuş"],["Süreklilik","kesintisiz ↔ kırık"],["Ritim","düzenli ↔ düzensiz"],
              ["Yoğunluk","seyrek ↔ sık"],["Açısallık","yumuşak ↔ keskin"],["Yön","yatay ↔ düşey"]];
  vars.slice(0,4).forEach((v,i)=>{
    const x=MX+i*2.95; card(s,x,2.6,2.68,1.55);
    s.addText(v[0],T({x:x+0.28,y:2.82,w:2.2,h:0.32,fontFace:FB,fontSize:16,bold:true,color:INK}));
    s.addText(v[1],T({x:x+0.28,y:3.16,w:2.3,h:0.3,fontFace:FM,fontSize:10,color:MUTED}));
    s.addShape(p.ShapeType.line,{x:x+0.28,y:3.78,w:2.1,h:0,line:{color:INK,width:[0.75,1.5,2.5,3.5][i],dashType:i===2?"dash":"solid"}});
  });
  vars.slice(4).forEach((v,i)=>{
    const x=MX+i*2.95; card(s,x,4.35,2.68,1.55);
    s.addText(v[0],T({x:x+0.28,y:4.57,w:2.2,h:0.32,fontFace:FB,fontSize:16,bold:true,color:INK}));
    s.addText(v[1],T({x:x+0.28,y:4.91,w:2.3,h:0.3,fontFace:FM,fontSize:10,color:MUTED}));
    s.addShape(p.ShapeType.line,{x:x+0.28,y:5.53,w:2.1,h:0,line:{color:INK,width:2,dashType:["sysDash","dashDot","solid"][i]}});
  });
  card(s,MX+3*2.95,4.35,2.68,1.55);
  s.addText("… ve ikisi\nbir arada",T({x:MX+3*2.95+0.28,y:4.75,w:2.2,h:0.7,fontFace:FB,fontSize:16,bold:true,color:BLUE,lineSpacing:21}));
  s.addNotes("Kısa deneme: herkes defterine 30 saniyede “tedirginlik” çizsin — yüz, sembol, ok yok, sadece çizgi. Üç tanesini gösterin. 2. haftanın önizlemesi.");
}

/* 22 ALINTI LEONARDO */
quote("Kuramsız pratiği seven, dümensiz ve pusulasız\ngemiye binen denizciye benzer;\nnereye varacağını asla bilemez.","LEONARDO DA VINCI  ·  Defterler",
  "Bugünkü dersin gerekçesi bu cümle: bu hafta teori yaptık, 13 hafta pratik yapacağız. İkisi ayrılmaz.\n\nNot: Leonardo'nun defterlerinden derlenmiş bir cümledir; hangi kodekste geçtiği kesin değil — derste 'defterlerinden' demek yeterli ve dürüst.");

/* 23 DIV 04 */
divider("04","Dönem planı","14 hafta, bir quiz, iki teslim","Bölüm 4: pratik bilgi. Buradan sonrası not alınacak kısım. İzlenceyi ekranda açık tutun.");

/* 24 14 HAFTA */
{
  const s=light();
  eyebrow(s,"BÖLÜM 4 · DÖNEM PLANI");
  title(s,"On dört hafta");
  const wk=[["01","Giriş + sunum · 1 Ekim"],["02","Nokta ve çizgi · Ödev 1"],["03","Düzlem: kare, elips, üçgen"],
            ["04","Hacim + dış zarf · Ödev 2"],["05","29 EKİM — DERS YOK"],["06","Kontur ve dinamik çizim"],
            ["07","Perspektif: göz hizası"],["08","QUIZ · 19 Kasım"],["09","Doku: tarama teknikleri"],["10","Işık ve gölge · Ödev 3"],
            ["11","Natürmort"],["12","Mimari gösterimler · Ödev 4"],["13","Katmanlı temsil + kuru boya"],["14","Final projesi stüdyosu"]];
  wk.forEach((w,i)=>{
    const col=i<7?0:1, row=i%7; const x=MX+col*6.0, y=2.05+row*0.62;
    const hot=[4,7,13].includes(i);
    s.addText(w[0],T({x,y,w:0.62,h:0.32,fontFace:FM,fontSize:13,bold:true,color:hot?BLUE:G[4]}));
    s.addText(w[1],T({x:x+0.68,y:y-0.02,w:5.1,h:0.36,fontFace:FB,fontSize:15,bold:hot,color:hot?BLUE:INK}));
    s.addShape(p.ShapeType.line,{x,y:y+0.42,w:5.5,h:0,line:{color:LINE,width:0.75}});
  });
  s.addText("Final projesi teslimi: fakülte sınav takvimiyle duyurulacak final sınav haftasında.",T({x:MX,y:6.5,w:CW,h:0.35,fontFace:FB,fontSize:14,italic:true,color:BLUE}));
  s.addNotes("Takvimi tek tek okumayın; işaretli üç haftayı vurgulayın: 5 (tatil), 8 (quiz) ve 14.\n\n29 Ekim Cumhuriyet Bayramı perşembeye denk geliyor; o hafta ders yapılmayacak.");
}

/* 25 ÖLÇME */
{
  const s=light();
  eyebrow(s,"BÖLÜM 4 · DÖNEM PLANI");
  title(s,"Üç bileşen. İkisi teslim, biri quiz.");
  s.addText("Dönemin tamamı bir dönem projesi (portfolyo), bir quiz ve bir final projesi üzerinden değerlendirilir. Not verirken gözlem doğruluğu, el kontrolü, teknik yetkinlik, kavramsal karar ve süreç düzenliliği birlikte gözetilir.",T({x:MX,y:1.95,w:CW,h:0.6,fontFace:FB,fontSize:15,color:MUTED,lineSpacing:21}));
  const ev=[["%40","DÖNEM PROJESİ","Portfolyo: 4 ödev + 2 ev tekrarı + derste üretilen çizimler","Hafta 14"],
            ["%20","QUIZ","Yüz yüze, uygulamalı; ilk altı haftanın konuları","Hafta 8 · 19 Kasım"],
            ["%40","FİNAL PROJESİ","Katmanlı mekân temsili","Final sınav haftası"]];
  ev.forEach((e,i)=>{
    const x=MX+i*3.95; card(s,x,2.72,3.63,2.72);
    s.addText(e[0],T({x:x+0.32,y:2.92,w:2.2,h:0.75,fontFace:FM,fontSize:40,bold:true,color:BLUE}));
    s.addText(e[1],T({x:x+0.32,y:3.78,w:3.1,h:0.3,fontFace:FM,fontSize:11,charSpacing:1.4,color:MUTED}));
    s.addText(e[2],T({x:x+0.32,y:4.12,w:2.98,h:0.9,fontFace:FB,fontSize:15,bold:true,color:INK,lineSpacing:20}));
    s.addText(e[3],T({x:x+0.32,y:5.05,w:2.98,h:0.3,fontFace:FM,fontSize:11,color:BLUE}));
  });
  s.addText([
    {text:"Başarı koşulu: ",options:{bold:true,breakLine:false}},
    {text:"yarıyıl sonu başarı notunun en az ",options:{breakLine:false}},
    {text:"60",options:{bold:true,breakLine:false}},
    {text:" olması gerekir (CC). Bu puanın altında kalan öğrenci, tüm teslimleri yapmış olsa dahi başarısız sayılır.",options:{breakLine:true}}
  ],T({x:MX,y:5.72,w:CW,h:0.5,fontFace:FB,fontSize:15,color:INK}));
  s.addText("Ölçütler: kuruluş ve oran · çizgi kalitesi · hacim, ton ve ışık · tekniğin yerinde kullanımı · kavramsal karar · süreç düzenliliği · kritiğin işlenmesi · dosya düzeni · zamanlama · eksiksiz teslim",T({x:MX,y:6.3,w:CW,h:0.55,fontFace:FM,fontSize:11.5,color:MUTED,lineSpacing:16}));
  s.addNotes("On ölçüt izlencede tam hâliyle var; burada okumayın, izlenceye yönlendirin.\n\nVurgulanacak tek şey: dönem projesi yeni bir üretim değil, zaten yaptığınız işin derlenmesi. Düzenli çalışan için ek yük yok.");
}

/* 25b DÖNEM PROJESİ */
{
  const s=light();
  eyebrow(s,"BÖLÜM 4 · DÖNEM PLANI");
  title(s,"Dönem projesi yeni bir iş değil");
  s.addText([
    {text:"Portfolyo, dönem boyunca ürettiğiniz çalışmaların ",options:{breakLine:false}},
    {text:"tamamının",options:{bold:true,breakLine:false}},
    {text:" bir araya getirilmesidir — yeni bir üretim değil, var olanın derlenmesi.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:9}},
    {text:"Düzenli çalışan öğrenci için ",options:{breakLine:false}},
    {text:"ek bir yük oluşturmaz",options:{bold:true,breakLine:false}},
    {text:"; hiçbir şey saklamayan öğrenci için telafisi yoktur.",options:{breakLine:true}}
  ],T({x:MX,y:2.0,w:6.4,h:2.6,fontFace:FB,fontSize:16,color:INK,lineSpacing:24}));
  s.addText("Bugünden itibaren\nhiçbir sayfayı atmayın.",T({x:MX,y:4.6,w:6.4,h:1.0,fontFace:FS,fontSize:25,bold:true,color:BLUE,lineSpacing:33}));
  s.addText("Denemeler, yarım kalan çizimler ve yeniden yapılan çalışmalar da dosyaya girer. Ölçtüğümüz şey sonuç değil süreç.",T({x:MX,y:5.72,w:6.4,h:0.8,fontFace:FB,fontSize:14.5,color:MUTED,lineSpacing:21}));
  card(s,7.6,1.95,4.88,4.45);
  s.addText("DOSYADA NE OLACAK",T({x:8.0,y:2.25,w:4.1,h:0.3,fontFace:FM,fontSize:11,charSpacing:1.4,color:BLUE}));
  s.addText([
    {text:"Kapak sayfası",options:{bullet:true,breakLine:true}},
    {text:"Bir sayfalık kişisel gelişim notu",options:{bullet:true,breakLine:true}},
    {text:"4 ödev",options:{bullet:true,breakLine:true}},
    {text:"2 ev tekrarı (3. ve 9. hafta)",options:{bullet:true,breakLine:true}},
    {text:"Derste üretilen tüm çizimler",options:{bullet:true,breakLine:true}},
    {text:"Denemeler ve yarım kalanlar",options:{bullet:true,breakLine:false}}
  ],T({x:8.0,y:2.72,w:4.1,h:2.6,fontFace:FB,fontSize:14.5,color:INK,paraSpaceAfter:8}));
  s.addText("Tarih sırasına göre düzenlenir.\nTeslim: 14. hafta.",T({x:8.0,y:5.5,w:4.1,h:0.7,fontFace:FB,fontSize:14,bold:true,color:INK,lineSpacing:20}));
  s.addNotes("Bu slayt dönemin en çok işe yarayan uyarısıdır. İlk haftada söylenmezse yarısı sayfalarını atar.\n\nKişisel gelişim notu: “dönem başında ne yapamıyordum, şimdi ne yapabiliyorum” — bir sayfa, elle yazılabilir.");
}

/* 26 EV TEKRARI */
{
  const s=light();
  eyebrow(s,"BÖLÜM 4 · DÖNEM PLANI");
  title(s,"Ev tekrarı");
  s.addText("Günlük çizim beklentimiz yok.",T({x:MX,y:2.0,w:6.3,h:0.45,fontFace:FS,fontSize:24,bold:true,color:MUTED}));
  s.addText("Sınıfta yaptığınız\nçalışmanın aynısını\nevde bir kez daha yapın.",T({x:MX,y:2.65,w:6.3,h:1.9,fontFace:FS,fontSize:30,bold:true,color:INK,lineSpacing:40}));
  s.addText("Ve gelecek hafta yanınızda getirin.",T({x:MX,y:4.7,w:6.3,h:0.45,fontFace:FB,fontSize:19,bold:true,color:BLUE}));
  s.addText("Dönemde iki ev tekrarı var: 3. hafta ve 9. hafta. İkisi de dönem projesi dosyasına girer.",T({x:MX,y:5.35,w:6.3,h:0.7,fontFace:FB,fontSize:14,color:MUTED,lineSpacing:20}));
  card(s,7.6,2.0,4.88,4.35);
  s.addText("Neden tekrar?",T({x:8.0,y:2.3,w:4.1,h:0.4,fontFace:FB,fontSize:19,bold:true,color:INK}));
  s.addText([
    {text:"Aynı problemi ikinci kez çözmek, iki farklı problemi bir kez çözmekten daha çok öğretir.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:8}},
    {text:"Sınıftaki çalışma yönlendirilmiştir, evdeki değildir. ",options:{breakLine:false}},
    {text:"Fark, öğrenmenin nerede olduğunu gösterir.",options:{bold:true,breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:8}},
    {text:"Tekrarı sınıftaki eşiyle yan yana koyup birlikte bakacağız.",options:{breakLine:true}}
  ],T({x:8.0,y:2.9,w:4.1,h:3.3,fontFace:FB,fontSize:14.5,color:INK,lineSpacing:21}));
  s.addNotes("Karşılığında günlük defter yükü yok — bunu açıkça söyleyin, itirazı düşürür.");
}

/* 27 FİNAL */
{
  const s=light();
  eyebrow(s,"BÖLÜM 4 · DÖNEM PLANI");
  title(s,"Final projesi: katmanlı temsil");
  s.addText([
    {text:"Elle çizilmiş kâğıt katmanların arka arkaya, aralarında boşluk bırakılarak yerleştirilmesiyle kurulan, önden izlenen bir mekân temsili. ",options:{breakLine:false}},
    {text:"En az 8 katman",options:{bold:true,breakLine:false}},
    {text:". Konu serbest; zorunlu olan konu değil, katman mantığı ve değer sisteminin tutarlılığı.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:8}},
    {text:"Tek kesin kural: ",options:{breakLine:false}},
    {text:"her katman önce elle çizilir; kesim çizimin türevidir.",options:{bold:true,breakLine:true}}
  ],T({x:MX,y:2.0,w:6.3,h:2.6,fontFace:FB,fontSize:15.5,color:INK,lineSpacing:23}));
  s.addText("Asıl kararınız: değer sistemi",T({x:MX,y:4.78,w:6.3,h:0.4,fontFace:FB,fontSize:17,bold:true,color:INK}));
  const sysA=[8,7,6,5,4,3,2,1], sysB=[2,8,4,7,3,8,2,0];
  sysA.forEach((g,i)=>{ s.addShape(p.ShapeType.rect,{x:MX+i*0.38,y:5.28,w:0.33,h:0.5,fill:{color:G[g]},line:{color:G[g],width:0}}); });
  s.addText("A · mesafe mantığı",T({x:MX,y:5.86,w:3.0,h:0.28,fontFace:FM,fontSize:10.5,color:MUTED}));
  sysB.forEach((g,i)=>{ s.addShape(p.ShapeType.rect,{x:MX+3.35+i*0.38,y:5.28,w:0.33,h:0.5,fill:{color:G[g]},line:{color:G[g],width:0}}); });
  s.addText("B · grafik mantık (notan)",T({x:MX+3.35,y:5.86,w:3.2,h:0.28,fontFace:FM,fontSize:10.5,color:MUTED}));
  s.addText("İkisi de doğrudur — karıştırılması yanlıştır. Ayrıntılı şartname 13. haftada yazılı olarak paylaşılacak.",T({x:MX,y:6.22,w:6.4,h:0.55,fontFace:FB,fontSize:13.5,italic:true,color:BLUE,lineSpacing:19}));
  card(s,7.55,1.9,4.93,4.5);
  for(let i=7;i>=0;i--){
    const x=8.25+i*0.22, y=4.55-i*0.20;
    s.addShape(p.ShapeType.rect,{x,y:y-1.0,w:1.5,h:1.1,fill:{color:WHITE},line:{color:G[Math.min(8,3+i)],width:i===0?1.6:1.0}});
  }
  s.addText("katmanlar ayrı ayrı çizilir",T({x:8.0,y:5.62,w:3.0,h:0.28,fontFace:FM,fontSize:9.5,color:MUTED}));
  s.addShape(p.ShapeType.line,{x:10.55,y:3.55,w:0.5,h:0,line:{color:BLUE,width:1.5}});
  s.addShape(p.ShapeType.line,{x:10.9,y:3.4,w:0.16,h:0.15,line:{color:BLUE,width:1.5}});
  s.addShape(p.ShapeType.line,{x:10.9,y:3.7,w:0.16,h:-0.15,line:{color:BLUE,width:1.5}});
  s.addShape(p.ShapeType.rect,{x:11.15,y:2.8,w:1.1,h:1.5,fill:{color:WHITE},line:{color:INK,width:1.6}});
  [[0.3,7],[0.55,5],[0.8,3],[1.05,1]].forEach(b=>{ s.addShape(p.ShapeType.rect,{x:11.2,y:2.8+b[0],w:1.0,h:0.2,fill:{color:G[b[1]]},line:{color:G[b[1]],width:0}}); });
  s.addText("önden tek sahne",T({x:11.0,y:4.42,w:1.5,h:0.28,fontFace:FM,fontSize:9.5,color:BLUE}));
  s.addNotes("Mümkünse gerçek bir örnek gösterin. Türün adı: pop-up shadow box card / layered papercut diorama. Tarihsel dayanağı Hoogstraten'in perspektif kutusu (1655-60) ve tunnel book geleneği.\n\n13. haftada kuru boya çalışacağız; renk serbest ama tek renk ailesi ve en az 5 değer kuralı var.");
}

/* 28 DEVAM VE TESLİM */
{
  const s=dark();
  eyebrow(s,"BÖLÜM 4 · DÖNEM PLANI",true);
  s.addText("İki şey pazarlığa kapalı:\ndevam ve teslim tarihi",T({x:MX,y:1.3,w:10.2,h:1.6,fontFace:FS,fontSize:40,bold:true,color:WHITE,lineSpacing:50}));
  const two=[["%80","Derslerin en az %80'ine devam zorunlu. Her ders bir kez ıslak imza alınır; imzayı takip etmek öğrencinin sorumluluğundadır, sonradan imza talebi kabul edilmez.","Sınırı aşan öğrenci final projesini teslim edemez."],
             ["0","Geç teslim kabul edilmez. Ödevler hem fiziksel olarak derse getirilir hem de ders platformuna yüklenir; e-posta ile gönderilen ödev kabul edilmez.","Yetişemeyecekseniz tarihten önce haber verin."]];
  two.forEach((t,i)=>{
    const x=MX+i*6.1;
    s.addText(t[0],T({x,y:3.3,w:2.0,h:0.9,fontFace:FM,fontSize:46,bold:true,color:BLUE}));
    s.addText(t[1],T({x,y:4.32,w:5.5,h:1.5,fontFace:FB,fontSize:15,color:SOFT,lineSpacing:22}));
    s.addText(t[2],T({x,y:5.95,w:5.5,h:0.5,fontFace:FB,fontSize:14,bold:true,color:WHITE,lineSpacing:20}));
  });
  s.addText("Dijital teslimlerinizi yükledikten sonra indirip kontrol edin. Bozuk ya da boş dosyaların sorumluluğu öğrenciye aittir.",T({x:MX,y:6.7,w:11.2,h:0.4,fontFace:FM,fontSize:11.5,color:MUTED}));
  s.addNotes("Bu slaytta yavaş gidin ve soru alın. Dönem içindeki itirazların neredeyse tamamı bu iki maddeden çıkıyor.\n\nMazeret sınavı üniversitenin yürürlükteki yönetmeliğine göre uygulanır.");
}

/* 29 DIV 05 */
divider("05","Kurallar ve malzeme","Altı kural, bir alışveriş listesi","Bölüm 5: not alınacak kısım. Yavaş gidin ve soru alın.");

/* 30 KURALLAR */
{
  const s=light();
  eyebrow(s,"BÖLÜM 5 · KURALLAR");
  title(s,"Altı kural");
  const r=[["Cetvel yok","Hiçbir haftada cetvel, gönye veya şablon kullanılmıyor. Perspektif haftası dâhil. Dersin adı serbest çizim."],
           ["Yapay zekâ yok","Üretken yapay zekâ ile oluşturulmuş görüntüler teslim edilen çalışmalarda kullanılamaz. Bu ders el–göz–zihin döngüsünü ölçer."],
           ["Referans fotoğraf serbest","Kaynağı belirtmek koşuluyla. Ancak fotoğraftan birebir kopya, gözlem çiziminin yerine geçmez."],
           ["Üretim ders saatinde olur","Ders, evde yapılan işin gösterildiği bir saat değil. Her hafta kalem ve defterinizle gelin, burada çizin."],
           ["Hiçbir sayfa atılmaz","Denemeler, yarım kalanlar ve yeniden yapılanlar dâhil her şey dönem projesi dosyasına girer. Temiz bir dosya düşük not alır."],
           ["Teslim çift kanaldan","Her teslim hem fiziksel olarak derse getirilir hem de ders platformuna yüklenir. E-posta ile ödev kabul edilmez."]];
  r.forEach((c,i)=>{
    const col=i%2, row=Math.floor(i/2); const x=MX+col*5.95, y=1.95+row*1.52;
    s.addShape(p.ShapeType.ellipse,{x,y:y+0.02,w:0.4,h:0.4,fill:{color:i<2?BLUE:G[2]},line:{color:i<2?BLUE:G[2],width:0}});
    s.addText(String(i+1),T({x,y:y+0.09,w:0.4,h:0.28,fontFace:FM,fontSize:13,bold:true,color:i<2?WHITE:INK,align:"center"}));
    s.addText(c[0],T({x:x+0.6,y:y+0.02,w:4.9,h:0.35,fontFace:FB,fontSize:16.5,bold:true,color:i<2?BLUE:INK}));
    s.addText(c[1],T({x:x+0.6,y:y+0.42,w:4.95,h:1.0,fontFace:FB,fontSize:13,color:INK,lineSpacing:18}));
  });
  s.addText("Telefonlar ders başlamadan sessize alınır. Tablet ve dizüstü yalnızca ders amacıyla kullanılabilir.",T({x:MX,y:6.6,w:CW,h:0.35,fontFace:FB,fontSize:13.5,italic:true,color:MUTED}));
  s.addNotes("İlk iki kural mavi: bu ikisinden taviz yok.\n\nEngelli öğrenci desteği: güçlük yaşayan öğrenciler doğrudan benimle ve üniversitenin engelli öğrenci birimiyle iletişime geçsin — bunu sözlü olarak söyleyin.\n\nDers kaydı KVKK kapsamında yalnızca bilgi ve onayla yapılabilir; izinsiz kayıt yasak.");
}

/* 31 MALZEME */
{
  const s=light();
  eyebrow(s,"BÖLÜM 5 · KURALLAR");
  title(s,"Malzeme listesi");
  s.addText("Gelecek haftaya kadar temin edilmeli. İlk beş hafta tek bir 2B kalem ve defterle de geçilebilir — kimse malzeme yüzünden geri kalmasın.",T({x:MX,y:1.92,w:CW,h:0.55,fontFace:FB,fontSize:15,color:MUTED}));
  card(s,MX,2.5,5.63,3.7);
  s.addText("ZORUNLU",T({x:MX+0.38,y:2.78,w:3,h:0.3,fontFace:FM,fontSize:11,charSpacing:1.6,color:BLUE}));
  s.addText([
    {text:"A4 dikişli eskiz defteri + A3 eskiz bloğu",options:{bullet:true,breakLine:true}},
    {text:"Kurşun kalem: 2H, HB, 2B, 4B, 6B",options:{bullet:true,breakLine:true}},
    {text:"İnce kömür kalem + kömür çubuk",options:{bullet:true,breakLine:true}},
    {text:"Fineliner 0.1 / 0.3 / 0.5, siyah",options:{bullet:true,breakLine:true}},
    {text:"Gri marker seti, 3 ton",options:{bullet:true,breakLine:true}},
    {text:"Hamur silgi + normal silgi + kalemtıraş",options:{bullet:true,breakLine:true}},
    {text:"Kâğıt kıskacı ve A3 çizim altlığı",options:{bullet:true,breakLine:false}}
  ],T({x:MX+0.38,y:3.15,w:4.95,h:2.85,fontFace:FB,fontSize:13.5,color:INK,paraSpaceAfter:7}));
  card(s,6.85,2.5,5.63,3.7);
  s.addText("13. HAFTADAN İTİBAREN",T({x:7.23,y:2.78,w:4,h:0.3,fontFace:FM,fontSize:11,charSpacing:1.6,color:MUTED}));
  s.addText([
    {text:"Kuru boya seti — en az 24 renk; tek renk ailesinde 5 ton bulunacak şekilde",options:{bullet:true,breakLine:true}},
    {text:"Renksiz burnishing kalemi (varsa)",options:{bullet:true,breakLine:true}},
    {text:"Fon kartonu 160–200 gsm",options:{bullet:true,breakLine:true}},
    {text:"Köpüklü çift taraflı bant",options:{bullet:true,breakLine:true}},
    {text:"Maket bıçağı + kesim altlığı",options:{bullet:true,breakLine:false}}
  ],T({x:7.23,y:3.15,w:4.95,h:2.4,fontFace:FB,fontSize:13.5,color:INK,paraSpaceAfter:7}));
  s.addText("Bunları 12. haftada hatırlatacağım.\nBugün için tek bir kurşun kalem yeterli.",T({x:7.23,y:5.7,w:4.95,h:0.6,fontFace:FB,fontSize:12.5,italic:true,color:MUTED,lineSpacing:17}));
  s.addNotes("Kampüse yakın kırtasiyeyi söyleyin. Bütçe sıkıntısı olan öğrenciyle ders sonrası ayrı konuşun.");
}

/* 32 ALINTI NICOLAIDES */
quote("İlk beş bin hatanızı ne kadar erken yaparsanız,\nonları düzeltmeye o kadar erken başlarsınız.","KIMON NICOLAÏDES  ·  The Natural Way to Draw",
  "Dönemin mottosu. Süreç dosyası kuralı, “temiz dosya düşük not alır” maddesi ve ev tekrarı sözleşmesi hep bu cümleden çıkıyor.");

/* 33 UYGULAMA */
{
  const s=light();
  eyebrow(s,"ŞİMDİ");
  title(s,"Ustaların çizgileri");
  s.addText("Bugünün son 20 dakikası",T({x:MX,y:1.95,w:6.4,h:0.5,fontFace:FS,fontSize:26,bold:true,color:BLUE}));
  s.addText("Sayfanızı üç katla sekize bölün. Bugün ilk iki kutuyu dolduruyoruz; kalan altısını gelecek hafta yapacağız.",T({x:MX,y:2.55,w:6.4,h:0.75,fontFace:FB,fontSize:15,color:INK,lineSpacing:21}));
  const bx=[["1","CY TWOMBLY","180 BPM","Ne çizdiğini düşünme. Elini bırak, kâğıdın üstünde gezdir. Çok hafif bastır, sayfanın yarısı boş kalsın."],
            ["2","HOKUSAI","150 BPM","Bastırarak başla, hareket ederken gevşet. Kenarı yuvarlatma — kır, basamak yap. Tek vuruş, tek karar."]];
  bx.forEach((b,i)=>{
    const y=3.5+i*1.42;
    s.addText(b[0],T({x:MX,y,w:0.5,h:0.42,fontFace:FM,fontSize:22,bold:true,color:BLUE}));
    s.addText(b[1],T({x:MX+0.62,y:y+0.02,w:3.0,h:0.34,fontFace:FB,fontSize:17,bold:true,color:INK}));
    s.addText(b[2],T({x:MX+3.7,y:y+0.06,w:1.4,h:0.3,fontFace:FM,fontSize:12,color:BLUE}));
    s.addText(b[3],T({x:MX+0.62,y:y+0.42,w:5.6,h:0.85,fontFace:FB,fontSize:13.5,color:MUTED,lineSpacing:19}));
  });
  s.addText("Kutulara hiçbir nesne çizilmez — yalnızca iz.",T({x:MX,y:6.42,w:6.4,h:0.4,fontFace:FB,fontSize:16,bold:true,color:INK}));
  card(s,7.6,1.95,4.88,4.45);
  s.addText("Neden?",T({x:8.0,y:2.3,w:4.1,h:0.4,fontFace:FB,fontSize:19,bold:true,color:INK}));
  s.addText([
    {text:"Bugün elinizde tek bir çizgi var: yavaş, ürkek, arayan bir çizgi. Dönem sonunda sekiz olacak.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:8}},
    {text:"Kopyaladığımız şey görüntü değil ",options:{breakLine:false}},
    {text:"hareket",options:{bold:true,breakLine:false}},
    {text:". Sanatçının çizimini değil, elini çalışıyoruz.",options:{breakLine:true}},
    {text:"\n",options:{breakLine:true,fontSize:8}},
    {text:"İz bir alettir, imza değil.",options:{bold:true,breakLine:true}}
  ],T({x:8.0,y:2.9,w:4.1,h:3.3,fontFace:FB,fontSize:14,color:INK,lineSpacing:20}));
  s.addNotes("Metronom uygulamasını açın: 180 ve 150 BPM. Tempoyu öğrenci seçmesin, duysun.\n\nReprodüksiyonları sırayla tek tek yansıtın; ikisi aynı anda ekranda olursa öğrenci karşılaştırır, taklit etmez.\n\nSüreyi siz tutun. Kutu başına 6 dakika; ilk 30 saniye kalem masada, sadece bakılır.\n\nAyrıntı: 06-ustalarin-cizgileri-hoca-notlari.md");
}

/* 34 KAPANIŞ */
{
  const s=dark();
  s.addText("“",T({x:MX-0.05,y:1.05,w:2,h:1.3,fontFace:FS,fontSize:72,color:BLUE}));
  s.addText("Çizim, insanın gördüğü şey değil,\nbaşkalarına gösterebildiği şeydir.",T({x:MX,y:2.1,w:11.0,h:1.9,fontFace:FS,fontSize:32,italic:true,color:WHITE,lineSpacing:46}));
  s.addText("EDGAR DEGAS",T({x:MX,y:4.15,w:CW,h:0.35,fontFace:FM,fontSize:13,charSpacing:1.4,color:BLUELT}));
  s.addText("BU HAFTANIN ÖDEVİ",T({x:MX,y:4.95,w:8,h:0.3,fontFace:FM,fontSize:12,charSpacing:1.6,color:BLUE}));
  s.addText("Dışarıda bir nesne seçin. On dakika ona bakın — kalem çantada.\nSonra eve gidip, ona bakmadan, hafızadan çizin. Gelecek hafta getirin.",T({x:MX,y:5.35,w:10.6,h:0.9,fontFace:FB,fontSize:18,color:SOFT,lineSpacing:27}));
  s.addText("Gelecek hafta: nokta ve çizgi.",T({x:MX,y:6.32,w:8,h:0.35,fontFace:FB,fontSize:16,bold:true,color:WHITE}));
  s.addText("IMC321 Serbest Çizim Teknikleri  ·  2026–27 Güz  ·  1. Hafta",T({x:MX,y:6.88,w:8,h:0.3,fontFace:FM,fontSize:11,color:MUTED}));
  s.addNotes("İzlenceyi bugün dağıtın ve ölçütleri ilk haftada paylaşın — bu, ölçme kurgusunun bir parçası.\n\nBu hafta çizilen hafıza çizimini toplayıp tarihleyin ve saklayın: 14. haftada aynı protokol tekrarlanıp ikisi yan yana konacak.");
}

p.writeFile({fileName:"/home/user/sanat-ve-mekan/ders/serbest-cizim-teknikleri/02-1hafta-sunum.pptx"}).then(f=>console.log("yazıldı:",f));
