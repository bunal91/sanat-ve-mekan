const pptxgen = require("pptxgenjs");
const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Kapadokya Üniversitesi";
pptx.title  = "Marka Anahtarını Okumak ve Müşteri Deneyimini Haritalamak";

/* ---------------------------------------------------------------- sistem */
const BG="FFFFFF", INK="15181C", BODY="3E434A", MUT="8B9199",
      HAIR="DCDFE3", RULE="B9BFC6", ACC="1B3A5B", ACC2="6E8399", PALE="C9D2DB";
const F="Georgia";
const M=0.82, R=12.51, FW=R-M;
let n=0;

function slide(){ const s=pptx.addSlide(); s.background={color:BG}; return s; }

function t(s,str,x,y,w,h,o){
  o=o||{};
  s.addText(str,{x,y,w,h,isTextBox:true,fontFace:F,
    fontSize:o.sz||11, bold:!!o.b, italic:!!o.i, color:o.c||BODY,
    align:o.al||"left", valign:o.va||"top", charSpacing:o.ls||0,
    lineSpacing:o.lh, margin:0, wrap:o.wrap===false?false:true});
}
function line(s,x1,y1,x2,y2,o){
  o=o||{};
  s.addShape("line",{x:x1,y:y1,w:x2-x1,h:y2-y1,
    line:{color:o.c||HAIR,width:o.w||0.75,dashType:o.dash||"solid"}});
}
function dot(s,cx,cy,d,o){
  o=o||{}; const c=o.c||ACC;
  s.addShape("ellipse",{x:cx-d/2,y:cy-d/2,w:d,h:d,
    fill:o.hollow?{type:"none"}:{color:c}, line:{color:c,width:o.lw||0.9}});
}
/* küçük harf aralıklı etiket */
function lab(s,str,x,y,w,o){
  o=o||{};
  t(s,str.toUpperCase(),x,y,w,0.24,{sz:o.sz||8,c:o.c||MUT,ls:o.ls||2.1,b:o.b!==false,al:o.al});
}

function page(kicker,title,lead){
  n++; const s=slide();
  lab(s,kicker,M,0.44,8.2);
  t(s,String(n).padStart(2,"0"),R-0.7,0.42,0.7,0.26,{sz:8.5,c:PALE,al:"right",ls:1.4,b:true});
  t(s,title,M,0.80,FW,0.66,{sz:30,c:INK,lh:34});
  let y=1.58;
  if(lead){ t(s,lead,M,1.52,FW*0.88,0.52,{sz:13,i:true,c:ACC,lh:18}); y=2.06; }
  else { y=1.66; }
  line(s,M,y,R,y,{c:RULE,w:1});
  s._y=y;
  return s;
}
function foot(s,str){
  line(s,M,6.86,R,6.86);
  t(s,str,M,6.94,FW,0.3,{sz:8.5,c:MUT,i:true});
}
/* dikey saç teli ayraç */
function vsep(s,x,y1,y2){ line(s,x,y1,x,y2); }

/* numaralı sütun öğesi — kutu yok */
function col(s,x,w,y,no,title,desc,o){
  o=o||{};
  if(no) t(s,no,x,y,0.5,0.24,{sz:8.5,c:o.nc||ACC2,ls:1.6,b:true});
  t(s,title,x,y+(no?0.28:0),w,0.36,{sz:o.ts||14,c:o.tc||INK});
  if(desc) t(s,desc,x,y+(no?0.66:0.38),w,0.9,{sz:o.ds||10.5,c:MUT,lh:14});
}
/* ======================================================== 01 · KAPAK */
(function(){
  n++; const s=slide();
  line(s,M,1.86,R,1.86,{c:RULE,w:1});
  t(s,"Marka Anahtarını Okumak",M,2.14,FW,0.9,{sz:46,c:INK});
  t(s,"ve Müşteri Deneyimini Haritalamak",M,3.00,FW,0.9,{sz:46,c:ACC});
  line(s,M,4.42,R,4.42,{c:RULE,w:1});
  const ws=["MARKA","KULLANICI","DENEYİM","MEKÂN"], cw=FW/4;
  ws.forEach(function(w,i){
    const x=M+i*cw;
    dot(s,x+0.05,4.78,0.075,{c:i===3?ACC:PALE});
    t(s,w,x+0.20,4.66,cw-0.3,0.3,{sz:10,c:i===3?ACC:MUT,ls:2.4,b:true});
    if(i) vsep(s,x-0.16,4.60,4.96);
  });
  t(s,"İç Mimari Proje III  ·  Birinci ders",M,6.44,FW,0.3,{sz:10.5,c:MUT,i:true});
})();

/* ================================================ 02 · MARKADAN MEKÂNA */
(function(){
  const s=page("Markadan mekâna","Markadan Mekâna");
  const items=[
    ["01","Marka kimliği","Markayı araştırmak ve kimliğini çözümlemek."],
    ["02","Kullanıcı","Kullanıcının ihtiyaç, değer ve davranışlarını anlamak."],
    ["03","Deneyim","Etkileşim, duyular, teknoloji ve müşteri yolculuğunu tasarlamak."],
    ["04","Mekân","Kimliği atmosfer, malzeme, ışık ve mekânsal kurguya çevirmek."]];
  const cw=FW/4;
  items.forEach(function(it,i){
    const x=M+i*cw;
    if(i) vsep(s,x-0.18,2.10,3.62);
    col(s,x,cw-0.42,2.10,it[0],it[1],it[2],{tc:i===3?ACC:INK});
  });
  line(s,M,4.16,R,4.16,{c:RULE,w:1});
  lab(s,"İşlevler",M,4.30,3.2,{c:ACC});
  t(s,"Vitrin ve sergileme  ·  giriş ve eşik  ·  dolaşım  ·  deneyim alanı  ·  bilgi ve tanıtım  ·  satış ve kasa  ·  depolama ve stok  ·  personel",
    M,4.58,FW,0.6,{sz:12.5,c:BODY,lh:19});
  line(s,M,5.34,R,5.34);
  lab(s,"Tasarım kapsamı",M,5.48,3.2,{c:ACC});
  t(s,"Atmosfer  ·  kimlik  ·  malzeme  ·  ışık  ·  renk  ·  doku  ·  mobilya  ·  duyusal nitelikler",
    M,5.76,FW,0.6,{sz:12.5,c:BODY,lh:19});
})();

/* ============================================ 03 · ALTI YETKİNLİK */
(function(){
  const s=page("Markadan mekâna","Markadan Mekâna","tasarımın gerekçelendirilebilir olması");
  const items=[
    ["01","Marka analizi","Markanın misyonunu, değerlerini, ürünlerini ve kimliğini araştırmak."],
    ["02","Kullanıcı odağı","Kullanıcı profilini ihtiyaç, değer ve davranışlarıyla anlamak."],
    ["03","Deneyim ve duyular","Mekânı görme, dokunma, işitme, koku ve hareket üzerinden düşünmek."],
    ["04","Teknoloji entegrasyonu","Fiziksel ve dijital temasları deneyimi destekleyecek biçimde kurmak."],
    ["05","Mekânsal kimlik","Kimliği atmosfer, malzeme, ışık, renk, doku ve kurguya çevirmek."],
    ["06","Uygulanabilirlik","Ergonomi, operasyon, depolama, dolaşım ve detay kararlarını gözetmek."]];
  const cw=FW/3, ys=[2.44,4.62];
  items.forEach(function(it,i){
    const r=Math.floor(i/3), c=i%3, x=M+c*cw;
    if(c) vsep(s,x-0.22,ys[r]-0.06,ys[r]+1.56);
    col(s,x,cw-0.5,ys[r],it[0],it[1],it[2]);
  });
  line(s,M,4.28,R,4.28);
})();

/* ================================================= 04 · MARKA DNA'SI */
(function(){
  const s=page("Marka analizi","Marka DNA’sı",
    "Markanın kimliğini çözümlemek ve onu mekânsal bir dile çevirmek.");
  t(s,"Marka bir vaadin tutarlı biçimde tekrarlanmasıdır.",M,2.22,FW,0.4,{sz:16,c:INK});

  lab(s,"Markanın bağlamı — dışarıdan gelen",M,3.02,4.6,{c:ACC});
  line(s,M+4.7,3.14,R,3.14);
  const a=[["Rekabet","Başka hangi seçenekler var?"],
           ["Hedef kullanıcı","Kime sesleniyor?"],
           ["Amaçlar","Neyi başarmak istiyor?"]];
  const aw=FW/3;
  a.forEach(function(it,i){
    const x=M+i*aw;
    if(i) vsep(s,x-0.22,3.38,4.12);
    t(s,it[0],x,3.38,aw-0.5,0.32,{sz:13.5,c:INK});
    t(s,it[1],x,3.70,aw-0.5,0.32,{sz:10.5,c:MUT});
  });

  lab(s,"Markanın ifadesi — kendi kurduğu",M,4.44,4.4,{c:ACC});
  line(s,M+4.5,4.56,R,4.56);
  const b=[["Misyon","Var olma nedeni"],["Değerler","Neye inanıyor?"],
           ["Faydalar","İşlevsel ve duygusal olarak ne sunuyor?"],
           ["Kişilik","Bir insan olsaydı nasıl biri olurdu?"],
           ["Görsel dil","Renk · biçim · malzeme · görüntü"],
           ["İletişim tonu","Nasıl konuşuyor?"]];
  const bw=FW/6;
  b.forEach(function(it,i){
    const x=M+i*bw;
    if(i) vsep(s,x-0.16,4.80,5.96);
    t(s,it[0],x,4.80,bw-0.34,0.3,{sz:12.5,c:INK});
    t(s,it[1],x,5.12,bw-0.34,0.8,{sz:9.5,c:MUT,lh:13});
  });
  foot(s,"Kaynak: Sunar Bükülmez, Girginkaya Akdağ ve Ekin (2025), Marka Anahtarı Analizi aracı (I-AM İstanbul).");
})();
/* ============================================== 05 · MARKA KİMLİĞİ */
(function(){
  const s=page("Araştırma","Marka Kimliği",
    "Araştırmanın amacı aynı anlamı farklı kanıtlarda görebilmek.");
  const items=[["01","Web sitesi","Misyon · ürün dili · değerler"],
    ["02","Sosyal medya","Görsel dil · iletişim · kullanıcı"],
    ["03","Ürün","Malzeme · biçim · fiyat · kullanım"],
    ["04","Kullanıcı yorumları","Beklenti · memnuniyet · sorunlar"],
    ["05","Rakipler","Farklılaşma · konum · fırsat"],
    ["06","Gözlem","Gerçek davranış · temas · bağlam"]];
  const cw=FW/3, ys=[2.52,4.44];
  items.forEach(function(it,i){
    const r=Math.floor(i/3), c=i%3, x=M+c*cw;
    if(c) vsep(s,x-0.22,ys[r]-0.06,ys[r]+1.30);
    col(s,x,cw-0.5,ys[r],it[0],it[1],it[2]);
  });
  line(s,M,4.14,R,4.14);
  foot(s,"Kaynak: Sunar Bükülmez vd. (2025), marka analizi ve kullanıcı profili bölümleri.");
})();

/* ============================================ 06 · KULLANICI PROFİLİ */
(function(){
  const s=page("Kullanıcı","Kullanıcı Profili",
    "Davranışı okunabilen kullanıcı, mekânsal karar üretir.");
  const items=[["01","Kim?","Yaş · yaşam biçimi · sosyo-ekonomik bağlam"],
    ["02","Neye değer veriyor?","Değerler · öncelikler · inançlar"],
    ["03","Neye ihtiyacı var?","İşlevsel ve duygusal ihtiyaçlar"],
    ["04","Nasıl davranıyor?","Arıyor · karşılaştırıyor · seçiyor · bekliyor"],
    ["05","Ne hissediyor?","Merak · güven · huzursuzluk · aidiyet"],
    ["06","Ne bekliyor?","Hız · keşif · kişisellik · kolaylık"]];
  const cw=FW/3, ys=[2.52,4.44];
  items.forEach(function(it,i){
    const r=Math.floor(i/3), c=i%3, x=M+c*cw;
    if(c) vsep(s,x-0.22,ys[r]-0.06,ys[r]+1.30);
    col(s,x,cw-0.5,ys[r],it[0],it[1],it[2]);
  });
  line(s,M,4.14,R,4.14);
  foot(s,"Kaynak: Sunar Bükülmez vd. (2025), kullanıcı profili ve persona yaklaşımı.");
})();

/* =========================================== 07 · ANAHTAR KELİME · YÖNTEM */
(function(){
  const s=page("Sentez","Anahtar Kelime",
    "Markanın analizini tasarım kararına bağlar.");
  const st=[["01","Kaynaklar","Markanın kendi ürettiği her şey: metinler, ambalaj, sosyal medya dili, müşteri yorumları, görüşme, rakiplerin dili"],
    ["02","Ham kelime havuzu","Otuz–elli kelime. Sıfat, fiil ve nesne adı; hepsini yaz, hiçbirini eleme, tekrar edenleri işaretle"],
    ["03","Gruplama ve eleme","Eş anlamlıları birleştir, kümele; markaya özgü olmayanları at: kaliteli, modern, özel"],
    ["04","Üç anahtar kelime","Özgül · kanıtlı · mekânda karşılığı kurulabilir"]];
  const cw=FW/4;
  st.forEach(function(it,i){
    const x=M+i*cw;
    col(s,x,cw-0.52,2.34,it[0],it[1],it[2],{tc:i===3?ACC:INK,ts:15});
    if(i<3){ const mx=x+cw-0.30; dot(s,mx,2.46,0.07,{c:PALE}); }
  });
  line(s,M,4.34,R,4.34);
  lab(s,"Üç kelimenin sınavı",M,4.50,3.4,{c:ACC});
  const rules=["Her markaya uyacak kadar genel olmamalı.",
               "Araştırmada karşılığı bulunmalı.",
               "Mekânda somut bir karşılığı kurulabilmeli."];
  rules.forEach(function(r,i){
    const y=4.92+i*0.46;
    dot(s,M+0.06,y+0.13,0.07,{c:ACC});
    t(s,r,M+0.30,y,FW-0.4,0.34,{sz:14,c:INK});
    if(i<2) line(s,M,y+0.36,R,y+0.36);
  });
})();

/* ============================================ 08 · VAKA · MARKA PROFİLİ */
function zincir(s,y,hi){
  const st=[["01","Marka özelliği","araştırmada bulunan somut olgu"],
            ["02","Anahtar kelime","o olgunun tek sıfata indirgenmesi"],
            ["03","Mekânsal ilke","sayısız çözüme açık genel kural"],
            ["04","Tasarım öğesi","çizilebilir, ölçülebilir karar"]];
  const cw=FW/4;
  st.forEach(function(it,i){
    const x=M+i*cw;
    t(s,it[0],x,y,0.5,0.24,{sz:8.5,c:(hi===i?ACC:ACC2),ls:1.6,b:true});
    t(s,it[1],x,y+0.26,cw-0.52,0.34,{sz:15,c:(hi===i?ACC:INK)});
    t(s,it[2],x,y+0.62,cw-0.52,0.5,{sz:10.5,c:MUT,lh:14});
    if(i<3) dot(s,x+cw-0.30,y+0.12,0.07,{c:PALE});
  });
}
(function(){
  const s=page("Sentez","Anahtar Kelime",
    "Örnek vaka: yerel bir seramik markası — el yapımı seramik ev ve sofra ürünleri.");
  zincir(s,2.30);
  line(s,M,3.62,R,3.62);
  lab(s,"Markanın profili",M,3.78,3.4,{c:ACC});
  const rows=[["Neden varız","Gündelik yaşama üretim ve malzeme duygusu katmak"],
    ["İdeal","Atölyesini müşteriye açabilen, öğreten bir dükkân olmak"],
    ["Değerler","Yerellik · zanaat · doğaya saygı"],
    ["Kişilik","Özenli · açık sözlü · malzemeye yakın"],
    ["Pazar konumu","Seri üretim ev ürünleri değil; imzalı zanaat parçaları"],
    ["Kullanıcı profili","Kentin yoğunluğu içinde yavaş ve anlamlı seçim yapmak isteyen, ürünü eline almadan karar vermeyen kullanıcı"]];
  rows.forEach(function(r,i){
    const last=(i===rows.length-1), y=4.10+i*0.44;
    t(s,r[0],M,y,2.3,0.32,{sz:12,c:INK});
    t(s,r[1],M+2.5,y,FW-2.5,last?0.48:0.32,{sz:12,c:BODY,lh:15});
    line(s,M,y+(last?0.52:0.36),R,y+(last?0.52:0.36));
  });
})();

/* ======================================== 09 · VAKA · BEŞ ANAHTAR KELİME */
(function(){
  const s=page("Sentez","Anahtar Kelime",
    "Örnek vaka: yerel bir seramik markası — el yapımı seramik ev ve sofra ürünleri.");
  zincir(s,2.30,1);
  line(s,M,3.66,R,3.66);
  const cw=FW/4, x=M+cw;
  lab(s,"Bu markadan çıkan beş kelime",x,3.82,4.0,{c:ACC});
  ["CESUR","DOĞAL","SÜRDÜRÜLEBİLİR","TEKİLLİK","GÖRÜNÜRLÜK"].forEach(function(w,i){
    const y=4.22+i*0.50;
    dot(s,x+0.06,y+0.16,0.08,{c:ACC});
    t(s,w,x+0.32,y,3.0,0.34,{sz:15,c:INK,ls:1.6});
    line(s,x,y+0.40,x+cw*1.35,y+0.40);
  });
  t(s,"Kelime, markanın analizinden çıkar; mekânsal ilke o kelimenin kuralıdır; tasarım öğesi ise o kuralın çizilebilir hâlidir.",
    M+cw*2.45,4.22,FW-cw*2.45,1.6,{sz:12.5,c:MUT,i:true,lh:19});
})();
/* ================================== 10 · KELİME → İLKE → ÖĞE MATRİSİ */
(function(){
  const s=page("Sentez","Anahtar Kelime",
    "Örnek vaka: yerel bir seramik markası — el yapımı seramik ev ve sofra ürünleri.");
  const d=[
    ["CESUR","karakterli · görünür · güçlü","vurgu ve hiyerarşi",
     "Koyu vurgu duvarı · ölçek atlayan tek büyük parça"],
    ["DOĞAL","malzemeye yakın · sıcak · yalın","malzeme ve ışık",
     "Ham sıva ve masif ahşap · dokunulabilir açık raf"],
    ["SÜRDÜRÜLEBİLİR","uzun ömürlü · az atık · esnek","sistem ve işletme",
     "Sökülebilir modüler raf · vidalı (yapıştırmasız) birleşim"],
    ["TEKİLLİK","her ürün tek · elde üretilmiş","yoğunluk ve aralık",
     "Tekil kaideler · nokta aydınlatma · ürünler arası geniş aralık"],
    ["GÖRÜNÜRLÜK","üretim gizlenmiyor · süreç sahnede","görüş hattı ve sınır",
     "Camlı atölye duvarı · tezgâhın vitrine bakması · açık kuruma rafı"]];
  const cw=FW/5;
  d.forEach(function(r,i){
    const x=M+i*cw, w=cw-0.34;
    if(i) vsep(s,x-0.17,2.28,6.34);
    dot(s,x+0.05,2.46,0.08,{c:ACC});
    t(s,r[0],x+0.26,2.33,w,0.34,{sz:13,c:ACC,ls:0.5});
    t(s,r[1],x,2.74,w,0.5,{sz:10,c:MUT,lh:13});
    t(s,r[2],x,3.92,w,0.5,{sz:13,c:INK,i:true,lh:17});
    t(s,r[3],x,5.08,w,1.1,{sz:10.5,c:BODY,lh:14});
  });
  line(s,M,3.46,R,3.46);  lab(s,"Mekânsal ilke",M,3.58,3.0,{c:ACC});
  line(s,M,4.62,R,4.62);  lab(s,"Tasarım öğesi",M,4.74,3.0,{c:ACC});
  line(s,M,6.34,R,6.34,{c:RULE,w:1});
})();

/* ======================================= 11 · MÜŞTERİ YOLCULUĞU */
(function(){
  const s=page("Müşteri yolculuğu","Müşteri Yolculuğunun Sekiz Aşaması");
  const st=[["01","FARKINDALIK",""],["02","ÇEKİM","cephe\nvitrin\nilk görsel temas"],
    ["03","EŞİK","giriş\nilk izlenim\natmosfer"],
    ["04","YÖNLENME","dolaşım\ngörüş hatları\nişaretleme"],
    ["05","KEŞİF","ürün grupları\nbilgi\nsergileme"],
    ["06","ETKİLEŞİM","deneme\nbekleme\nteknoloji"],
    ["07","SATIN ALMA","kasa\nödeme\npaketleme"],["08","AYRILIŞ",""]];
  const sp=FW/8, LY=3.16;
  line(s,M,LY,R,LY,{c:RULE,w:1});
  st.forEach(function(it,i){
    const cx=M+sp*i+sp/2, inside=(i>0&&i<7);
    t(s,it[0],cx-sp/2,2.46,sp,0.24,{sz:8.5,c:inside?ACC2:PALE,al:"center",ls:1.6,b:true});
    t(s,it[1],cx-sp/2,2.74,sp,0.32,{sz:10.5,c:inside?INK:MUT,al:"center",ls:1.1});
    dot(s,cx,LY,inside?0.13:0.09,{c:inside?ACC:PALE});
    if(it[2]) t(s,it[2],cx-sp/2,3.34,sp,0.78,{sz:9.5,c:MUT,al:"center",lh:13});
  });
  const b0=M+sp, b1=M+sp*7;
  line(s,b0,4.42,b1,4.42,{c:ACC,w:1});
  line(s,b0,4.42,b0,4.30,{c:ACC,w:1});
  line(s,b1,4.42,b1,4.30,{c:ACC,w:1});
  t(s,"İç mekânda geçen altı aşama",b0,4.50,b1-b0,0.3,{sz:11,c:ACC,al:"center"});
  t(s,"Mekânın dışında",M,4.50,sp,0.3,{sz:10,c:MUT,al:"center"});
  t(s,"Mekânın dışında",M+sp*7,4.50,sp,0.3,{sz:10,c:MUT,al:"center"});
  line(s,M,5.40,R,5.40);
  lab(s,"Yolculuğun görünmeyen yüzü",M,5.54,4.0,{c:ACC});
  t(s,"Depolama  ·  personel  ·  ergonomi",M,5.84,FW,0.34,{sz:13,c:BODY});
})();

/* ============================================ 12 · VAKA · YOLCULUK */
(function(){
  const s=page("Vaka","Seramik Markasının Müşteri Yolculuğu");
  const X=[M,M+2.10,M+8.80], W=[1.9,6.5,FW-8.80];
  lab(s,"Aşama",X[0],2.02,W[0]); lab(s,"Mekânsal karar",X[1],2.02,W[1]);
  lab(s,"Hangi kelimeyi taşıyor",X[2],2.02,W[2]);
  line(s,M,2.30,R,2.30,{c:RULE,w:1});
  const rows=[["Çekim","Vitrinde tek bir parça; arkasında çalışan çark görünüyor","GÖRÜNÜRLÜK"],
    ["Eşik","Ham yüzey, mat ışık ve çamurun kokusu karşılıyor","DOĞAL"],
    ["Yönlenme","Net görüş hattı; rota atölyeden tartıma doğru akıyor","GÖRÜNÜRLÜK"],
    ["Keşif","Her parça kendi kaidesinde, aralarında geniş boşluk","TEKİLLİK"],
    ["Etkileşim","Dokunma serbest; numune ve üretim anlatısı tezgâhta","TEKİLLİK"],
    ["Satın alma","Ambalajın kendisi zanaatın parçası; paketleme görünür","SÜRDÜRÜLEBİLİRLİK"],
    ["Ayrılış","Parçanın kim tarafından yapıldığı yazan kart","TEKİLLİK"]];
  rows.forEach(function(r,i){
    const y=2.48+i*0.62;
    dot(s,M+0.05,y+0.17,0.075,{c:ACC});
    t(s,r[0],X[0]+0.26,y,W[0],0.34,{sz:13,c:INK});
    t(s,r[1],X[1],y,W[1],0.34,{sz:12,c:BODY});
    t(s,r[2],X[2],y,W[2],0.34,{sz:11,c:ACC,ls:0.9});
    line(s,M,y+0.44,R,y+0.44);
  });
})();

/* =================================================== 13 · DUYULAR */
(function(){
  const s=page("Duyular","Duyular Marka Kimliğini Nasıl Taşır?",
    "Atmosfer tek bir duyudan doğmaz; duyusal etki uyaranların birlikte çalışmasından doğar.");
  const X=[M,M+1.90,M+5.20], W=[1.8,3.2,FW-5.20];
  const d=[["Görme","ışık · renk · kontrast · görüş hattı","Işığın düzeyi mekânın hızını belirler; rengi ürünün rengini değiştirir."],
    ["Dokunma","malzeme · doku · sıcaklık · ağırlık","İnsan ürünü eline aldığında sahiplik duygusu geliştirir. İnternete karşı en güçlü duyu."],
    ["İşitme","akustik · müzik · sessizlik","Karar verilen yerlerde sesin düşmesi gerekir: kabin, danışma, ödeme."],
    ["Koklama","koku · hafıza · kaynak","Hafızaya en doğrudan bağlanan duyu. Kokunun kaynağı ürünün kendisi olmalı."],
    ["Tat","tadım · ikram","En dar kullanım alanı, ama kullanıldığı yerde en güçlü etki."],
    ["Beden","ısı · hava · kot · ritim · yoğunluk","Yoğunluk en güçlü etken: kalabalıkta insan hızlanır ve erken çıkar."]];
  d.forEach(function(r,i){
    const y=2.34+i*0.72;
    t(s,r[0],X[0],y,W[0],0.36,{sz:15,c:INK});
    t(s,r[1],X[1],y+0.05,W[1],0.5,{sz:10.5,c:ACC,i:true,lh:14});
    t(s,r[2],X[2],y+0.05,W[2],0.5,{sz:11.5,c:BODY,lh:15});
    line(s,M,y+0.56,R,y+0.56);
  });
})();

/* ======================================= 14 · DUYU × AŞAMA MATRİSİ */
(function(){
  const s=page("Duyular","Hangi Duyu, Yolculuğun Hangi Anında?",
    "Duyular mekânın her yerinde aynı yoğunlukta çalışmaz; her duyunun baskın olduğu bir an vardır.");
  const cols=["ÇEKİM","EŞİK","YÖNELME","GEZİNME","ETKİLEŞİM","SATIN ALMA","AYRILIŞ"];
  const MX=2.55, MW=6.05, sp=MW/7;
  cols.forEach(function(c,i){
    t(s,c,MX+i*sp,2.28,sp,0.24,{sz:7.5,c:MUT,al:"center",ls:1.1,b:true});
  });
  const rows=[["Görme",[1,1,1,1,0,0,0],"vitrin silüeti · teşhir kontrastı"],
    ["Beden",[0,1,1,1,0,0,0],"eşikte ısı · koridor genişliği"],
    ["Koklama",[0,1,0,0,1,0,0],"ilk izlenim · ürünün kendi kokusu"],
    ["İşitme",[0,0,0,1,1,1,0],"genel akustik · kabinde sessizlik"],
    ["Dokunma",[0,0,0,1,1,0,0],"açık raf · deneme · tezgâh"],
    ["Tat",[0,0,0,0,1,0,0],"tadım noktası · ikram"]];
  line(s,M,2.58,R,2.58,{c:RULE,w:1});
  rows.forEach(function(r,i){
    const y=2.72+i*0.62, cy=y+0.19;
    t(s,r[0],M,y,1.6,0.34,{sz:13,c:INK});
    r[1].forEach(function(v,j){
      const cx=MX+j*sp+sp/2;
      if(v) dot(s,cx,cy,0.17,{c:ACC});
      else  dot(s,cx,cy,0.085,{c:PALE});
    });
    t(s,r[2],M+8.95,y+0.02,FW-8.95,0.34,{sz:10,c:MUT});
    line(s,M,y+0.46,R,y+0.46);
  });
})();
/* =============================================== 15 · ÜRÜN + BOŞLUK */
(function(){
  const s=page("Çeviri","Ürün + Boşluk");
  const d=[["Mücevher · sanat","birim değer yüksek; boşluk doğrudan değer anlamına gelir",1],
    ["Parfüm · sofistike moda","seçilmiş az sayıda ürün, geniş boşluk, oturarak satış",2],
    ["Seramik · zanaat","her parça tekil; kaide ve aralık gerekir",3],
    ["Kitap · plak","tarama davranışı; orta yoğunluk, raf metrajı önemli",5],
    ["Giyim · ayakkabı","beden çeşidi yoğunluk üretir; stok yakınlığı belirleyici",8]];
  const cw=FW/5, LY=3.34;
  lab(s,"Az ürün",M,2.06,3.0,{c:ACC});
  lab(s,"Çok ürün",R-3.0,2.06,3.0,{c:ACC,al:"right"});
  d.forEach(function(r,i){
    const x=M+i*cw, cx=x+cw/2, w=cw-0.42;
    const k=r[2], row=Math.min(k,4), sp2=0.15;
    for(let j=0;j<k;j++){
      const rr=Math.floor(j/4), cc=j%4, cnt=Math.min(k-rr*4,4);
      dot(s, cx-(cnt-1)*sp2/2+cc*sp2, 2.80+rr*0.17, 0.075, {c:ACC});
    }
    dot(s,cx,LY,0.10,{c:ACC});
    t(s,r[0],x,3.52,w,0.48,{sz:13.5,c:INK,al:"center",lh:18});
    t(s,r[1],x,4.06,w,0.9,{sz:10.5,c:MUT,al:"center",lh:14});
  });
  line(s,M,LY,R,LY,{c:RULE,w:1});
  line(s,M,5.10,R,5.10);
  t(s,"Ürün sayısı arttıkça boşluk azalır; boşluk azaldıkça mekânın anlattığı şey değişir.",
    M,5.26,FW,0.4,{sz:13,c:BODY,i:true});
})();

/* ============================================= 16 · MARKA SEÇİMİ */
(function(){
  const s=page("Marka seçimi","Hangi Tür Ürün Satan Markaları Seçebilirsiniz?",
    "Ürünün türü mekândan istediği şeyi belirler. Kendi adayınız hangi gruba giriyor?");
  const X=[M,M+2.80,M+6.40], W=[2.6,3.4,FW-6.40];
  lab(s,"Ürün grubu",X[0],2.20,W[0]); lab(s,"Örnek marka türleri",X[1],2.20,W[1]);
  lab(s,"Mekândan ne ister",X[2],2.20,W[2]);
  line(s,M,2.48,R,2.48,{c:RULE,w:1});
  const rows=[["Yüksek değer, az ürün","Mücevher · saat · sanat baskısı · tekil tasarım objesi",
      "Kilitli ve vitrinli teşhir · nokta aydınlatma · oturarak satış · güvenlik ve sigorta"],
    ["Denenen ürün","Giyim · ayakkabı · gözlük · şapka · takı",
      "Deneme kabini ve ayna · oturma · stok yakınlığı · ayakkabıda büyük kutu deposu"],
    ["Koklanan ürün","Parfüm · zeytinyağı ve baharat · sabun",
      "Test tezgâhı · havalandırma ve koku nötrleme · lavabo · dökme satış ve kapalı stok"],
    ["Taranan ürün","Kitap · plak · kırtasiye ve kâğıt · tohum ve bitki",
      "Uzun raf metrajı · kategori işaretleme · oturma · bitkide su, ışık, nem ve drenaj"],
    ["Ağır ve hacimli ürün","Mobilya · halı ve kilim · ev tekstili · bisiklet",
      "Kurulu kullanım senaryosu · geniş rota · asma ve katman sistemi · mal kabul ve büyük depo"],
    ["Üretimi görünür ürün","Seramik · deri ve ayakkabı atölyesi · terzi",
      "Atölye ile satışın bir arada olması · fırın, çark, tezgâh · ısı, koku ve atık · kuruma rafı"]];
  rows.forEach(function(r,i){
    const y=2.66+i*0.70;
    dot(s,M+0.05,y+0.17,0.075,{c:ACC});
    t(s,r[0],X[0]+0.26,y,W[0]-0.3,0.5,{sz:12.5,c:INK,lh:16});
    t(s,r[1],X[1],y,W[1]-0.3,0.5,{sz:10.5,c:BODY,lh:14});
    t(s,r[2],X[2],y,W[2],0.5,{sz:10.5,c:BODY,lh:14});
    line(s,M,y+0.56,R,y+0.56);
  });
})();

/* ============================================ 17 · MARKA ARAŞTIRMASI */
(function(){
  const s=page("Ödev","Marka Araştırması");
  const st=[["01","Üç marka bul","Ana akım olmayan, mağaza kimliği henüz oluşmamış adaylar"],
    ["02","Markayı araştır","Ürün · kullanıcı · değer ve hikâye · rakipler"],
    ["03","Üç anahtar kelime","Markayı mekâna taşıyabilecek üç kelime seç"],
    ["04","Üründen mekâna","Sergileme ve depolama · aydınlatma · deneyim ve duyu"],
    ["05","Kelimeyi karara çevir","Her kelime için somut bir mekânsal karar"]];
  const cw=FW/5, LY=2.60;
  line(s,M,LY,R,LY,{c:RULE,w:1});
  st.forEach(function(it,i){
    const x=M+i*cw;
    if(i) vsep(s,x-0.20,2.78,4.66);
    dot(s,x+0.05,LY,i===4?0.13:0.09,{c:i===4?ACC:PALE});
    t(s,it[0],x,2.76,0.5,0.24,{sz:8.5,c:i===4?ACC:ACC2,ls:1.6,b:true});
    t(s,it[1],x,3.04,cw-0.48,0.7,{sz:15,c:i===4?ACC:INK,lh:19});
    t(s,it[2],x,3.82,cw-0.48,0.9,{sz:10.5,c:MUT,lh:14});
  });
  line(s,M,5.06,R,5.06);
  t(s,"Üç aday marka stüdyoda çalışılmaya başlanabilir; teslim hafta içinde alınacaktır.",
    M,5.24,FW,0.4,{sz:13,c:BODY,i:true});
})();

/* ================================================== 18 · KAYNAKLAR */
(function(){
  const s=page("Kaynaklar","Dersin Temel Kaynakları",
    "Sunumun çerçevesi aşağıdaki makale ve ders izlencesinden kuruldu.");
  const L=[["Sunar Bükülmez, P., Girginkaya Akdağ, S. ve Ekin, G. (2025)",
      "Retail Design Competencies and Customer Journey Mapping Tools. The International Journal of Design Education, 19(2), 25–50. — Marka anahtarı ve yolculuk haritası"],
    ["Wheeler, A. (2017)","Designing Brand Identity. Wiley. — Marka DNA’sı ve marka deneyiminin bileşenleri"],
    ["Kotler, P. (1973)","Atmospherics as a Marketing Tool. Journal of Retailing, 49(4), 48–64. — Atmosfer kavramı"],
    ["Bitner, M. J. (1992)","Servicescapes: The Impact of Physical Surroundings. Journal of Marketing, 56(2), 57–71. — Fiziksel çevrenin üç kanalı"],
    ["Mehrabian, A. ve Russell, J. A. (1974)","An Approach to Environmental Psychology. MIT Press. — Yaklaşma ve kaçınma davranışı"],
    ["Spence, C. vd. (2014)","Store Atmospherics: A Multisensory Perspective. Psychology & Marketing, 31(7), 472–488. — Duyuların birlikte çalışması"]];
  const Rr=[["Pallasmaa, J. (2005)","The Eyes of the Skin. Wiley. [Tenin Gözleri, YEM Yayın] — Mekânın bedenle deneyimlenmesi"],
    ["Lemon, K. N. ve Verhoef, P. C. (2016)","Understanding Customer Experience Throughout the Customer Journey. Journal of Marketing, 80(6), 69–96."],
    ["Stein, A. ve Ramaseshan, B. (2016)","Towards the Identification of Customer Experience Touch Point Elements. JRCS, 30, 8–19."],
    ["Underhill, P. (2008)","Why We Buy: The Science of Shopping. Simon & Schuster. — Mağaza içi davranış ve sağa yönelim"],
    ["Mesher, L. (2010)","Basics Interior Design: Retail Design. AVA Publishing."],
    ["İç Mimari Tasarım III ders izlencesi (2025–2026)","Proje kapsamı, gereklilikler ve öğrenme çıktıları."]];
  const cw=5.55;
  vsep(s,M+cw+0.55,2.24,6.60);
  [L,Rr].forEach(function(list,k){
    const x=M+k*(cw+1.10);
    const OFF=[0,0.92,1.66,2.40,3.14,3.88];
    list.forEach(function(r,i){
      const y=2.24+OFF[i];
      dot(s,x+0.045,y+0.10,0.07,{c:PALE});
      t(s,r[0],x+0.26,y,cw-0.26,0.26,{sz:10.5,c:INK});
      t(s,r[1],x+0.26,y+0.24,cw-0.26,0.62,{sz:9.5,c:MUT,lh:12.5});
    });
  });
  foot(s,"Kaynak modellerdeki diyagramlar bu sunum için yeniden çizilmiştir  ·  doi.org/10.18848/2325-128X/CGP/v19i02/25-50");
})();

pptx.writeFile({fileName:"IMC301-Sunum-1.pptx"}).then(function(){console.log("ok");});
