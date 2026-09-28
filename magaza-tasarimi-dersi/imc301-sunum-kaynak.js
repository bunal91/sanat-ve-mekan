const pptxgen = require("pptxgenjs");
const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Kapadokya Üniversitesi";
pptx.title  = "Marka Anahtarını Okumak ve Müşteri Deneyimini Haritalamak";

/* ------------------------------------------------------------- palet */
const PAPER="FFFFFF", SAND="F5F1EA",
      INK="14171C", BODY="4B525C", MUT="9AA2AD", FAINT="C9CEd5".toUpperCase(),
      TEAL="0F3D3E", TEAL2="3C6E6A", CORAL="E4572E", CORAL2="F2B8A2",
      WHITE="FFFFFF";
const F="Georgia";
const M=0.82, R=12.51, FW=R-M;
let n=0;

function slide(bg){ const s=pptx.addSlide(); s.background={color:bg||PAPER}; return s; }

function t(s,str,x,y,w,h,o){
  o=o||{};
  s.addText(str,{x,y,w,h,isTextBox:true,fontFace:F,
    fontSize:o.sz||11, bold:!!o.b, italic:!!o.i, color:o.c||BODY,
    align:o.al||"left", valign:o.va||"top", charSpacing:o.ls||0,
    lineSpacing:o.lh, margin:0, wrap:o.wrap===false?false:true});
}
function dot(s,cx,cy,d,o){
  o=o||{}; const c=o.c||CORAL;
  s.addShape("ellipse",{x:cx-d/2,y:cy-d/2,w:d,h:d,
    fill:o.hollow?{type:"none"}:{color:c}, line:{color:c,width:o.lw||1}});
}
function axis(s,x1,y,x2,o){ o=o||{};
  s.addShape("line",{x:x1,y:y,w:x2-x1,h:0,line:{color:o.c||FAINT,width:o.w||1}});
}
function kick(s,str,x,y,c){ t(s,str.toUpperCase(),x||M,y||0.50,7.5,0.24,
  {sz:8.5,c:c||CORAL,ls:2.4,b:true}); }
function num(s){ t(s,String(n).padStart(2,"0"),R-0.7,6.94,0.7,0.26,
  {sz:8.5,c:FAINT,al:"right",ls:1.4,b:true}); }

/* başlık üstte — içerik altta akar */
function pTop(kicker,title,lead,o){
  o=o||{}; n++; const s=slide(o.bg);
  kick(s,kicker,M,0.50,o.kc);
  t(s,title,M,0.78,o.tw||FW*0.82,0.62,{sz:o.ts||34,c:o.tc||INK});
  if(lead) t(s,lead,M,1.46,FW*0.74,0.5,{sz:13.5,i:true,c:o.lc||TEAL2,lh:18});
  num(s); return s;
}
/* başlık solda dikey — içerik sağda */
function pSide(kicker,title,lead,o){
  o=o||{}; n++; const s=slide(o.bg);
  kick(s,kicker,M,0.50,o.kc);
  t(s,title,M,1.24,3.35,1.8,{sz:32,c:o.tc||INK,lh:37});
  if(lead) t(s,lead,M,3.30,3.35,1.6,{sz:12.5,i:true,c:o.lc||TEAL2,lh:17});
  num(s); return s;
}
const CX=4.62, CW=R-CX;   /* pSide içerik sütunu */
/* ============================================================ 01 KAPAK */
(function(){
  n++; const s=slide(TEAL);
  t(s,"Marka Anahtarını Okumak",M,2.30,11.3,0.82,{sz:44,c:WHITE});
  t(s,"ve Müşteri Deneyimini Haritalamak",M,3.10,11.4,0.82,{sz:44,c:CORAL2});
  const ws=["MARKA","KULLANICI","DENEYİM","MEKÂN"];
  let x=M;
  ws.forEach(function(w,i){
    const bw=w.length*0.125+0.20;
    dot(s,x+0.05,4.94,0.09,{c:i===3?CORAL:TEAL2});
    t(s,w,x+0.26,4.82,bw,0.3,{sz:10.5,c:i===3?CORAL:"9DB3AF",ls:2.6,b:true});
    x+=0.26+bw+0.62;
  });
  t(s,"İç Mimari Proje III  ·  Birinci ders",M,6.42,6,0.3,{sz:10.5,c:"6E8F8B",i:true});
})();

/* ================================================= 02 MARKADAN MEKÂNA */
(function(){
  const s=pTop("Markadan mekâna","Markadan Mekâna");
  const it=[["01","Marka kimliği","Markayı araştırmak ve kimliğini çözümlemek."],
    ["02","Kullanıcı","Kullanıcının ihtiyaç, değer ve davranışlarını anlamak."],
    ["03","Deneyim","Etkileşim, duyular, teknoloji ve müşteri yolculuğunu tasarlamak."],
    ["04","Mekân","Kimliği atmosfer, malzeme, ışık ve mekânsal kurguya çevirmek."]];
  it.forEach(function(r,i){
    const x=M+i*2.72, y=1.82+i*0.52;
    t(s,r[0],x,y,0.7,0.36,{sz:22,c:i===3?CORAL:CORAL2});
    t(s,r[1],x,y+0.40,2.5,0.34,{sz:16,c:i===3?CORAL:INK});
    t(s,r[2],x,y+0.76,2.5,0.9,{sz:10.5,c:MUT,lh:14});
  });
  t(s,"İŞLEVLER",M,5.34,2.4,0.26,{sz:8.5,c:TEAL,ls:2.4,b:true});
  t(s,"Vitrin ve sergileme · giriş ve eşik · dolaşım · deneyim alanı · bilgi ve tanıtım · satış ve kasa · depolama ve stok · personel",
    M,5.62,FW,0.5,{sz:13,c:BODY,lh:19});
  t(s,"TASARIM KAPSAMI",M,6.24,2.8,0.26,{sz:8.5,c:TEAL,ls:2.4,b:true});
  t(s,"Atmosfer · kimlik · malzeme · ışık · renk · doku · mobilya · duyusal nitelikler",
    M,6.52,FW,0.5,{sz:13,c:BODY,lh:19});
})();

/* ============================================== 03 ALTI YETKİNLİK */
(function(){
  const s=pTop("Markadan mekâna","Markadan Mekâna","tasarımın gerekçelendirilebilir olması");
  const it=[["01","Marka analizi","Markanın misyonunu, değerlerini, ürünlerini ve kimliğini araştırmak."],
    ["02","Kullanıcı odağı","Kullanıcı profilini ihtiyaç, değer ve davranışlarıyla anlamak."],
    ["03","Deneyim ve duyular","Mekânı görme, dokunma, işitme, koku ve hareket üzerinden düşünmek."],
    ["04","Teknoloji entegrasyonu","Fiziksel ve dijital temasları deneyimi destekleyecek biçimde kurmak."],
    ["05","Mekânsal kimlik","Kimliği atmosfer, malzeme, ışık, renk, doku ve kurguya çevirmek."],
    ["06","Uygulanabilirlik","Ergonomi, operasyon, depolama, dolaşım ve detay kararlarını gözetmek."]];
  it.forEach(function(r,i){
    const c=i%3, rr=Math.floor(i/3);
    const x=M+c*3.86+rr*0.62, y=2.36+rr*2.06+c*0.24;
    t(s,r[0],x,y,0.7,0.3,{sz:15,c:CORAL,ls:1.2});
    t(s,r[1],x,y+0.30,3.3,0.66,{sz:17,c:INK,lh:21});
    t(s,r[2],x,y+1.02,3.3,0.9,{sz:10.5,c:MUT,lh:14});
  });
})();

/* =================================================== 04 MARKA DNA'SI */
(function(){
  const s=pSide("Marka analizi","Marka DNA’sı",
    "Markanın kimliğini çözümlemek ve onu mekânsal bir dile çevirmek.");
  t(s,"Marka bir vaadin\ntutarlı biçimde\ntekrarlanmasıdır.",CX,1.22,CW,1.7,{sz:27,c:TEAL,lh:34});
  t(s,"DIŞARIDAN GELEN  ·  markanın bağlamı",CX,3.20,CW,0.26,{sz:8.5,c:CORAL,ls:2.2,b:true});
  const a=[["Rekabet","Başka hangi seçenekler var?"],
           ["Hedef kullanıcı","Kime sesleniyor?"],["Amaçlar","Neyi başarmak istiyor?"]];
  a.forEach(function(r,i){
    const x=CX+i*2.66;
    t(s,r[0],x,3.52,2.4,0.3,{sz:14,c:INK});
    t(s,r[1],x,3.84,2.4,0.44,{sz:10.5,c:MUT,lh:13});
  });
  t(s,"KENDİ KURDUĞU  ·  markanın ifadesi",CX,4.54,CW,0.26,{sz:8.5,c:CORAL,ls:2.2,b:true});
  const b=[["Misyon","Var olma nedeni"],["Değerler","Neye inanıyor?"],
           ["Faydalar","İşlevsel ve duygusal olarak ne sunuyor?"],
           ["Kişilik","Bir insan olsaydı nasıl biri olurdu?"],
           ["Görsel dil","Renk · biçim · malzeme · görüntü"],
           ["İletişim tonu","Nasıl konuşuyor?"]];
  b.forEach(function(r,i){
    const c=i%3, rr=Math.floor(i/3);
    const x=CX+c*2.66, y=4.86+rr*0.96;
    t(s,r[0],x,y,2.4,0.3,{sz:13,c:TEAL});
    t(s,r[1],x,y+0.30,2.4,0.58,{sz:10,c:MUT,lh:13});
  });
  t(s,"Kaynak: Sunar Bükülmez, Girginkaya Akdağ ve Ekin (2025), Marka Anahtarı Analizi aracı (I-AM İstanbul).",
    M,6.94,8.6,0.3,{sz:8.5,c:MUT,i:true});
})();
/* ================================================= 05 MARKA KİMLİĞİ */
(function(){
  const s=pTop("Araştırma","Marka Kimliği",
    "Araştırmanın amacı aynı anlamı farklı kanıtlarda görebilmek.");
  const it=[["01","Web sitesi","Misyon · ürün dili · değerler"],
    ["02","Sosyal medya","Görsel dil · iletişim · kullanıcı"],
    ["03","Ürün","Malzeme · biçim · fiyat · kullanım"],
    ["04","Kullanıcı yorumları","Beklenti · memnuniyet · sorunlar"],
    ["05","Rakipler","Farklılaşma · konum · fırsat"],
    ["06","Gözlem","Gerçek davranış · temas · bağlam"]];
  it.forEach(function(r,i){
    const c=i%3, rr=Math.floor(i/3);
    const x=M+c*3.86+rr*0.58, y=2.30+rr*1.98+c*0.26;
    t(s,r[0],x,y,0.7,0.3,{sz:15,c:i===5?CORAL:CORAL2,ls:1.2});
    t(s,r[1],x,y+0.30,3.3,0.62,{sz:17,c:i===5?CORAL:INK,lh:21});
    t(s,r[2],x,y+0.96,3.3,0.5,{sz:10.5,c:MUT,lh:14});
  });
  t(s,"Kaynak: Sunar Bükülmez vd. (2025), marka analizi ve kullanıcı profili bölümleri.",
    M,6.94,8.6,0.3,{sz:8.5,c:MUT,i:true});
})();

/* ============================================== 06 KULLANICI PROFİLİ */
(function(){
  const s=pTop("Kullanıcı","Kullanıcı Profili",
    "Davranışı okunabilen kullanıcı, mekânsal karar üretir.");
  const it=[["Kim?","Yaş · yaşam biçimi · sosyo-ekonomik bağlam"],
    ["Neye değer veriyor?","Değerler · öncelikler · inançlar"],
    ["Neye ihtiyacı var?","İşlevsel ve duygusal ihtiyaçlar"],
    ["Nasıl davranıyor?","Arıyor · karşılaştırıyor · seçiyor · bekliyor"],
    ["Ne hissediyor?","Merak · güven · huzursuzluk · aidiyet"],
    ["Ne bekliyor?","Hız · keşif · kişisellik · kolaylık"]];
  it.forEach(function(r,i){
    const c=i%2, rr=Math.floor(i/2);
    const x=M+c*6.0+rr*0.46, y=2.36+rr*1.42+c*0.32;
    dot(s,x+0.06,y+0.19,0.10,{c:CORAL});
    t(s,r[0],x+0.34,y,5.0,0.4,{sz:21,c:INK});
    t(s,r[1],x+0.34,y+0.46,5.0,0.4,{sz:11.5,c:MUT,lh:15});
  });
})();

/* ========================================== 07 ANAHTAR KELİME · YÖNTEM */
(function(){
  const s=pTop("Sentez","Anahtar Kelime","Markanın analizini tasarım kararına bağlar.");
  const st=[["01","Kaynaklar","Markanın kendi ürettiği her şey: metinler, ambalaj, sosyal medya dili, müşteri yorumları, görüşme, rakiplerin dili"],
    ["02","Ham kelime havuzu","Otuz–elli kelime. Sıfat, fiil ve nesne adı; hepsini yaz, hiçbirini eleme, tekrar edenleri işaretle"],
    ["03","Gruplama ve eleme","Eş anlamlıları birleştir, kümele; markaya özgü olmayanları at: kaliteli, modern, özel"],
    ["04","Üç anahtar kelime","Özgül · kanıtlı · mekânda karşılığı kurulabilir"]];
  st.forEach(function(r,i){
    const x=M+i*2.78, y=2.10+i*0.46;
    t(s,r[0],x,y,0.7,0.3,{sz:15,c:i===3?CORAL:CORAL2,ls:1.2});
    t(s,r[1],x,y+0.30,2.5,0.62,{sz:17,c:i===3?CORAL:INK,lh:21});
    t(s,r[2],x,y+0.96,2.5,1.1,{sz:10.5,c:MUT,lh:14});
  });
  t(s,"ÜÇ KELİMENİN SINAVI",M,5.72,3.4,0.26,{sz:8.5,c:TEAL,ls:2.2,b:true});
  ["Her markaya uyacak kadar genel olmamalı.","Araştırmada karşılığı bulunmalı.",
   "Mekânda somut bir karşılığı kurulabilmeli."].forEach(function(r,i){
    t(s,r,M+i*0.48,6.06+i*0.38,FW-2,0.34,{sz:13.5,c:TEAL});
  });
})();

/* =================================== zincir (08–10 ortak, çizgisiz) */
function zincir(s,y,hi){
  const st=[["01","Marka özelliği","araştırmada bulunan somut olgu"],
            ["02","Anahtar kelime","o olgunun tek sıfata indirgenmesi"],
            ["03","Mekânsal ilke","sayısız çözüme açık genel kural"],
            ["04","Tasarım öğesi","çizilebilir, ölçülebilir karar"]];
  st.forEach(function(r,i){
    const x=M+i*2.92, on=(hi===i);
    t(s,r[0],x,y,0.6,0.24,{sz:9,c:on?CORAL:FAINT,ls:1.6,b:true});
    t(s,r[1],x,y+0.24,2.6,0.34,{sz:15,c:on?CORAL:INK});
    t(s,r[2],x,y+0.60,2.6,0.5,{sz:10,c:MUT,lh:13});
    if(i<3) dot(s,x+2.72,y+0.40,0.075,{c:FAINT});
  });
}

/* ========================================= 08 VAKA · MARKANIN PROFİLİ */
(function(){
  const s=pTop("Sentez","Anahtar Kelime",
    "Örnek vaka: yerel bir seramik markası — el yapımı seramik ev ve sofra ürünleri.");
  zincir(s,2.20);
  const rows=[["Neden varız","Gündelik yaşama üretim ve malzeme duygusu katmak"],
    ["İdeal","Atölyesini müşteriye açabilen, öğreten bir dükkân olmak"],
    ["Değerler","Yerellik · zanaat · doğaya saygı"],
    ["Kişilik","Özenli · açık sözlü · malzemeye yakın"],
    ["Pazar konumu","Seri üretim ev ürünleri değil; imzalı zanaat parçaları"],
    ["Kullanıcı profili","Kentin yoğunluğu içinde yavaş ve anlamlı seçim yapmak isteyen, ürünü eline almadan karar vermeyen kullanıcı"]];
  t(s,"MARKANIN PROFİLİ",M,3.70,3.0,0.26,{sz:8.5,c:CORAL,ls:2.2,b:true});
  rows.forEach(function(r,i){
    const y=4.04+i*0.46;
    t(s,r[0],M,y,2.4,0.34,{sz:12.5,c:TEAL});
    t(s,r[1],M+2.6,y,FW-2.6,0.46,{sz:12.5,c:BODY,lh:16});
  });
})();

/* ================================== 09 BEŞ ANAHTAR KELİME · tam renk */
(function(){
  n++; const s=slide(TEAL);
  kick(s,"Sentez",M,0.50,CORAL2);
  t(s,"Bu markadan çıkan beş kelime",M,0.78,FW,0.6,{sz:34,c:WHITE});
  t(s,"Örnek vaka: yerel bir seramik markası — el yapımı seramik ev ve sofra ürünleri.",
    M,1.48,FW*0.8,0.4,{sz:13.5,i:true,c:"9DB3AF"});
  const ws=[["CESUR","karakterli · görünür · güçlü"],
    ["DOĞAL","malzemeye yakın · sıcak · yalın"],
    ["SÜRDÜRÜLEBİLİR","uzun ömürlü · az atık · esnek"],
    ["TEKİLLİK","her ürün tek · elde üretilmiş"],
    ["GÖRÜNÜRLÜK","üretim gizlenmiyor · süreç sahnede"]];
  ws.forEach(function(r,i){
    const x=M+i*0.72, y=2.08+i*0.90;
    t(s,r[0],x,y,7.2,0.48,{sz:28,c:i%2?CORAL2:WHITE,ls:1.2});
    t(s,r[1],x,y+0.50,6.4,0.3,{sz:11,c:"8FA8A5"});
  });
  t(s,String(n).padStart(2,"0"),R-0.7,6.94,0.7,0.26,{sz:8.5,c:"3C6E6A",al:"right",ls:1.4,b:true});
})();
/* ================================ 10 KELİME → İLKE → ÖĞE (asılı liste) */
(function(){
  const s=pTop("Sentez","Kelimeden Tasarım Öğesine",
    "Örnek vaka: yerel bir seramik markası — el yapımı seramik ev ve sofra ürünleri.");
  const d=[["CESUR","karakterli · görünür · güçlü","vurgu ve hiyerarşi",
     "Koyu vurgu duvarı · ölçek atlayan tek büyük parça"],
    ["DOĞAL","malzemeye yakın · sıcak · yalın","malzeme ve ışık",
     "Ham sıva ve masif ahşap · dokunulabilir açık raf"],
    ["SÜRDÜRÜLEBİLİR","uzun ömürlü · az atık · esnek","sistem ve işletme",
     "Sökülebilir modüler raf · vidalı (yapıştırmasız) birleşim"],
    ["TEKİLLİK","her ürün tek · elde üretilmiş","yoğunluk ve aralık",
     "Tekil kaideler · nokta aydınlatma · ürünler arası geniş aralık"],
    ["GÖRÜNÜRLÜK","üretim gizlenmiyor · süreç sahnede","görüş hattı ve sınır",
     "Camlı atölye duvarı · tezgâhın vitrine bakması · açık kuruma rafı"]];
  t(s,"MEKÂNSAL İLKE",4.66,2.14,2.5,0.24,{sz:8,c:MUT,ls:2.2,b:true});
  t(s,"TASARIM ÖĞESİ",7.72,2.14,2.5,0.24,{sz:8,c:MUT,ls:2.2,b:true});
  d.forEach(function(r,i){
    const y=2.48+i*0.90;
    t(s,r[0],M,y,3.6,0.34,{sz:r[0].length>10?15:17,c:CORAL,ls:0.6});
    t(s,r[1],M,y+0.36,3.6,0.4,{sz:10,c:MUT,lh:13});
    t(s,r[2],4.66,y+0.04,2.9,0.5,{sz:14,c:TEAL,i:true,lh:18});
    t(s,r[3],7.72,y+0.06,FW-6.90,0.62,{sz:11.5,c:BODY,lh:15});
  });
})();

/* ============================================ 11 MÜŞTERİ YOLCULUĞU */
(function(){
  const s=pTop("Müşteri yolculuğu","Müşteri Yolculuğunun Sekiz Aşaması");
  const st=[["01","FARKINDALIK",""],["02","ÇEKİM","cephe · vitrin\nilk görsel temas"],
    ["03","EŞİK","giriş · ilk izlenim\natmosfer"],
    ["04","YÖNLENME","dolaşım · görüş hatları\nişaretleme"],
    ["05","KEŞİF","ürün grupları · bilgi\nsergileme"],
    ["06","ETKİLEŞİM","deneme · bekleme\nteknoloji"],
    ["07","SATIN ALMA","kasa · ödeme\npaketleme"],["08","AYRILIŞ",""]];
  const sp=FW/8, LY=3.70;
  axis(s,M,LY,R,{c:TEAL2,w:1.25});
  st.forEach(function(r,i){
    const cx=M+sp*i+sp/2, ins=(i>0&&i<7), up=(i%2===0);
    dot(s,cx,LY,ins?0.15:0.10,{c:ins?CORAL:FAINT});
    const ny = up ? LY-0.92 : LY+0.28;
    t(s,r[0],cx-sp/2,ny,sp,0.22,{sz:8.5,c:ins?CORAL2:FAINT,al:"center",ls:1.6,b:true});
    t(s,r[1],cx-sp/2,ny+0.24,sp,0.3,{sz:11,c:ins?INK:MUT,al:"center",ls:1});
    if(r[2]) t(s,r[2],cx-sp/2-0.1,up?ny-0.66:ny+0.58,sp+0.2,0.56,
      {sz:9.5,c:MUT,al:"center",lh:12.5});
  });
  t(s,"Mekânın dışında",M,5.18,sp,0.3,{sz:10,c:MUT,al:"center"});
  t(s,"Mekânın dışında",M+sp*7,5.18,sp,0.3,{sz:10,c:MUT,al:"center"});
  t(s,"İç mekânda geçen altı aşama",M+sp,5.18,sp*6,0.3,{sz:12,c:CORAL,al:"center"});
  t(s,"YOLCULUĞUN GÖRÜNMEYEN YÜZÜ",M,6.12,4.0,0.26,{sz:8.5,c:TEAL,ls:2.2,b:true});
  t(s,"Depolama · personel · ergonomi",M,6.42,FW,0.34,{sz:14,c:BODY});
})();

/* ================================================ 12 VAKA · YOLCULUK */
(function(){
  const s=pTop("Vaka","Seramik Markasının Müşteri Yolculuğu");
  const rows=[["Çekim","Vitrinde tek bir parça; arkasında çalışan çark görünüyor","GÖRÜNÜRLÜK"],
    ["Eşik","Ham yüzey, mat ışık ve çamurun kokusu karşılıyor","DOĞAL"],
    ["Yönlenme","Net görüş hattı; rota atölyeden tartıma doğru akıyor","GÖRÜNÜRLÜK"],
    ["Keşif","Her parça kendi kaidesinde, aralarında geniş boşluk","TEKİLLİK"],
    ["Etkileşim","Dokunma serbest; numune ve üretim anlatısı tezgâhta","TEKİLLİK"],
    ["Satın alma","Ambalajın kendisi zanaatın parçası; paketleme görünür","SÜRDÜRÜLEBİLİRLİK"],
    ["Ayrılış","Parçanın kim tarafından yapıldığı yazan kart","TEKİLLİK"]];
  rows.forEach(function(r,i){
    const y=1.86+i*0.72, off=(i%2)?0.42:0;
    t(s,r[0],M+off,y,2.1,0.34,{sz:16,c:TEAL});
    t(s,r[1],M+off+2.2,y+0.04,5.3,0.44,{sz:12.5,c:BODY,lh:16});
    t(s,r[2],8.6,y+0.06,FW-7.78,0.3,{sz:10.5,c:CORAL,ls:1.2,b:true});
  });
})();

/* ==================================================== 13 DUYULAR */
(function(){
  const s=pSide("Duyular","Duyular marka kimliğini nasıl taşır?",
    "Atmosfer tek bir duyudan doğmaz; duyusal etki uyaranların birlikte çalışmasından doğar.");
  const d=[["Görme","ışık · renk · kontrast · görüş hattı","Işığın düzeyi mekânın hızını belirler; rengi ürünün rengini değiştirir."],
    ["Dokunma","malzeme · doku · sıcaklık · ağırlık","İnsan ürünü eline aldığında sahiplik duygusu geliştirir. İnternete karşı en güçlü duyu."],
    ["İşitme","akustik · müzik · sessizlik","Karar verilen yerlerde sesin düşmesi gerekir: kabin, danışma, ödeme."],
    ["Koklama","koku · hafıza · kaynak","Hafızaya en doğrudan bağlanan duyu. Kokunun kaynağı ürünün kendisi olmalı."],
    ["Tat","tadım · ikram","En dar kullanım alanı, ama kullanıldığı yerde en güçlü etki."],
    ["Beden","ısı · hava · kot · ritim · yoğunluk","Yoğunluk en güçlü etken: kalabalıkta insan hızlanır ve erken çıkar."]];
  d.forEach(function(r,i){
    const y=1.14+i*0.96;
    t(s,r[0],CX,y,1.55,0.34,{sz:17,c:CORAL});
    t(s,r[1],CX+1.62,y+0.06,2.5,0.5,{sz:10,c:TEAL,i:true,lh:13});
    t(s,r[2],CX+4.30,y+0.02,CW-4.30,0.66,{sz:11.5,c:BODY,lh:15});
  });
})();

/* ============================================ 14 DUYU × AŞAMA */
(function(){
  const s=pTop("Duyular","Hangi duyu, yolculuğun hangi anında?",
    "Duyular mekânın her yerinde aynı yoğunlukta çalışmaz; her duyunun baskın olduğu bir an vardır.");
  const cols=["ÇEKİM","EŞİK","YÖNELME","GEZİNME","ETKİLEŞİM","SATIN ALMA","AYRILIŞ"];
  const MX=2.46, MW=6.10, sp=MW/7;
  cols.forEach(function(c,i){
    t(s,c,MX+i*sp,2.28,sp,0.24,{sz:7.5,c:MUT,al:"center",ls:1.1,b:true});
  });
  const rows=[["Görme",[1,1,1,1,0,0,0],"vitrin silüeti · teşhir kontrastı"],
    ["Beden",[0,1,1,1,0,0,0],"eşikte ısı · koridor genişliği"],
    ["Koklama",[0,1,0,0,1,0,0],"ilk izlenim · ürünün kendi kokusu"],
    ["İşitme",[0,0,0,1,1,1,0],"genel akustik · kabinde sessizlik"],
    ["Dokunma",[0,0,0,1,1,0,0],"açık raf · deneme · tezgâh"],
    ["Tat",[0,0,0,0,1,0,0],"tadım noktası · ikram"]];
  rows.forEach(function(r,i){
    const y=2.76+i*0.66, cy=y+0.20;
    t(s,r[0],M,y,1.5,0.34,{sz:15,c:TEAL});
    r[1].forEach(function(v,j){
      const cx=MX+j*sp+sp/2;
      if(v) dot(s,cx,cy,0.20,{c:CORAL}); else dot(s,cx,cy,0.075,{c:FAINT});
    });
    t(s,r[2],M+8.30,y+0.05,FW-8.30,0.34,{sz:10,c:MUT});
  });
})();
/* ============================================== 15 ÜRÜN + BOŞLUK */
(function(){
  const s=pTop("Çeviri","Ürün + Boşluk");
  const d=[["Mücevher · sanat","birim değer yüksek; boşluk doğrudan değer anlamına gelir",1],
    ["Parfüm · sofistike moda","seçilmiş az sayıda ürün, geniş boşluk, oturarak satış",2],
    ["Seramik · zanaat","her parça tekil; kaide ve aralık gerekir",3],
    ["Kitap · plak","tarama davranışı; orta yoğunluk, raf metrajı önemli",5],
    ["Giyim · ayakkabı","beden çeşidi yoğunluk üretir; stok yakınlığı belirleyici",8]];
  const cw=FW/5, LY=3.66;
  t(s,"AZ ÜRÜN",M,1.72,3.0,0.26,{sz:9,c:CORAL,ls:2.4,b:true});
  t(s,"ÇOK ÜRÜN",R-3.0,1.72,3.0,0.26,{sz:9,c:CORAL,ls:2.4,al:"right",b:true});
  axis(s,M,LY,R,{c:TEAL2,w:1.25});
  d.forEach(function(r,i){
    const x=M+i*cw, cx=x+cw/2, w=cw-0.34, k=r[2], up=(i%2===0);
    for(let j=0;j<k;j++){
      const rr=Math.floor(j/4), cc=j%4, cnt=Math.min(k-rr*4,4);
      dot(s,cx-(cnt-1)*0.17/1+cc*0.17, 2.56+rr*0.19, 0.085, {c:CORAL});
    }
    dot(s,cx,LY,0.12,{c:TEAL});
    const ty = up ? 3.92 : 4.86;
    t(s,r[0],x,ty,w,0.46,{sz:14,c:INK,al:"center",lh:18});
    t(s,r[1],x,ty+0.50,w,0.8,{sz:10.5,c:MUT,al:"center",lh:14});
  });
  t(s,"Ürün sayısı arttıkça boşluk azalır; boşluk azaldıkça mekânın anlattığı şey değişir.",
    M,6.44,FW,0.4,{sz:13.5,c:TEAL,i:true});
})();

/* ================================================ 16 MARKA SEÇİMİ */
(function(){
  const s=pTop("Marka seçimi","Hangi tür ürün satan markaları seçebilirsiniz?",
    "Ürünün türü mekândan istediği şeyi belirler. Kendi adayınız hangi gruba giriyor?",{ts:30,tw:FW});
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
    const y=2.28+i*0.78;
    t(s,r[0],M,y,2.7,0.52,{sz:14,c:CORAL,lh:17});
    t(s,r[1],M+2.95,y+0.02,3.1,0.6,{sz:10.5,c:TEAL,lh:14});
    t(s,r[2],M+6.35,y+0.02,FW-6.35,0.6,{sz:10.5,c:BODY,lh:14});
  });
})();

/* ============================================ 17 MARKA ARAŞTIRMASI */
(function(){
  const s=pTop("Ödev","Marka Araştırması");
  const st=[["01","Üç marka bul","Ana akım olmayan, mağaza kimliği henüz oluşmamış adaylar"],
    ["02","Markayı araştır","Ürün · kullanıcı · değer ve hikâye · rakipler"],
    ["03","Üç anahtar kelime","Markayı mekâna taşıyabilecek üç kelime seç"],
    ["04","Üründen mekâna","Sergileme ve depolama · aydınlatma · deneyim ve duyu"],
    ["05","Kelimeyi karara çevir","Her kelime için somut bir mekânsal karar"]];
  st.forEach(function(r,i){
    const y=1.82+i*0.86, x=M+i*0.52, on=(i===4);
    t(s,r[0],x,y+0.06,0.8,0.4,{sz:24,c:on?CORAL:CORAL2});
    t(s,r[1],x+1.05,y,4.6,0.42,{sz:20,c:on?CORAL:INK});
    t(s,r[2],x+6.0,y+0.10,FW-6.4-i*0.52,0.5,{sz:11.5,c:MUT,lh:15});
  });
  t(s,"Üç aday marka stüdyoda çalışılmaya başlanabilir; teslim hafta içinde alınacaktır.",
    M,6.42,FW,0.4,{sz:13.5,c:TEAL,i:true});
})();

/* =================================================== 18 KAYNAKLAR */
(function(){
  const s=pSide("Kaynaklar","Dersin temel kaynakları",
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
  const OFF=[0,1.18,1.98,2.78,3.58,4.38], cw=3.72;
  [L,Rr].forEach(function(list,k){
    const x=CX+k*(cw+0.44);
    list.forEach(function(r,i){
      const y=0.92+OFF[i]+k*0.30;
      t(s,r[0],x,y,cw,0.40,{sz:10,c:CORAL,lh:13});
      t(s,r[1],x,y+0.38,cw,i===0?0.72:0.56,{sz:9,c:MUT,lh:12});
    });
  });
  t(s,"Kaynak modellerdeki diyagramlar bu sunum için yeniden çizilmiştir · doi.org/10.18848/2325-128X/CGP/v19i02/25-50",
    M,6.94,9.4,0.3,{sz:8.5,c:MUT,i:true});
})();

pptx.writeFile({fileName:"IMC301-Sunum-1.pptx"}).then(function(){console.log("ok");});
