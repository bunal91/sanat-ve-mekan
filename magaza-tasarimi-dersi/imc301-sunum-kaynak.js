const pptxgen = require("pptxgenjs");
const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Kapadokya Üniversitesi";
pptx.title  = "Marka Anahtarını Okumak ve Müşteri Deneyimini Haritalamak";

/* -------- palet: kullanıcının hazırladığı 01 numaralı slayttan ölçüldü */
const BG="F6F4EF", BLACK="000000", INK="222220", BODY="49423F", MUT="776B63",
      ACC="9E6048", ACCT="EDDFD8", FAINT="D4CCC4", WHITE="FFFFFF", HOLLOW="C9C2BA";
const F="Calibri";
const M=0.96, RM=12.56, CW=RM-M;
const D=0.19;                       /* nokta çapı */
let n=0;

function slide(){ const s=pptx.addSlide(); s.background={color:BG}; return s; }
function t(s,str,x,y,w,h,o){
  o=o||{};
  s.addText(str,{x,y,w,h,isTextBox:true,fontFace:F,
    fontSize:o.sz||12, bold:!!o.b, italic:!!o.i, color:o.c||BODY,
    align:o.al||"left", valign:o.va||"top", charSpacing:o.ls||0,
    lineSpacing:o.lh, margin:0, wrap:o.wrap===false?false:true});
}
/* tam kenardan kenara yatay çizgi */
function rule(s,y,o){ o=o||{};
  s.addShape("line",{x:o.x0===undefined?0:o.x0, y:y,
    w:(o.x1===undefined?13.333:o.x1)-(o.x0===undefined?0:o.x0), h:0,
    line:{color:o.c||BLACK,width:o.w||1.5}});
}
function drop(s,x,y1,y2,o){ o=o||{};
  s.addShape("line",{x:x,y:y1,w:0,h:y2-y1,line:{color:o.c||BLACK,width:o.w||1.5}});
}
function node(s,cx,cy,o){ o=o||{}; const d=o.d||D, c=o.c||BLACK;
  s.addShape("ellipse",{x:cx-d/2,y:cy-d/2,w:d,h:d,
    fill:o.hollow?{color:BG}:{color:c}, line:{color:c,width:o.lw||1.5}});
}
function fill(s,x,y,w,h,c){
  s.addShape("rect",{x,y,w,h,fill:{color:c||ACC},line:{color:c||ACC,width:0.5}});
}
/* terrakota etiket — büyük harf değil, başlık düzeni */
function label(s,str,x,y,w,o){ o=o||{}; t(s,str,x,y,w||3.2,0.28,{sz:o.sz||14,b:true,c:o.c||ACC}); }
/* dikey liste — her madde kendi satırında */
function vlist(s,items,x,y,w,o){ o=o||{};
  items.forEach(function(it,i){
    t(s,it,x,y+i*(o.pitch||0.245),w,0.3,{sz:o.sz||12.5,c:o.c||BODY,lh:o.lh||17});
  });
}
function page(title,lead){
  n++; const s=slide();
  t(s,title,M,0.70,CW,0.52,{sz:28,b:true,c:INK});
  t(s,String(n).padStart(2,"0"),11.9,0.46,0.66,0.26,{sz:10,c:FAINT,al:"right",b:true});
  if(lead) t(s,lead,M,1.28,CW*0.80,0.5,{sz:14,c:MUT,lh:19});
  return s;
}
/* yatay çizgi üzerinde düğümler + altında metin */
function hrow(s,y,xs,items,o){
  o=o||{}; rule(s,y);
  items.forEach(function(it,i){
    const x=xs[i], hi=(o.hi===i);
    node(s,x,y,{hollow:o.hollowIdx&&o.hollowIdx.indexOf(i)>=0});
    const tx=x-0.06, w=o.w||2.6;
    if(hi){ fill(s,x-0.15,y+0.02,o.hw||2.79,o.hh||1.14);
      t(s,it[0],tx+0.05,y+0.16,(o.hw||2.79)-0.3,0.3,{sz:15,b:true,c:WHITE});
      t(s,it[1],tx+0.05,y+0.46,(o.hw||2.79)-0.3,0.66,{sz:12,c:ACCT,lh:16});
    } else {
      t(s,it[0],tx,y+0.16,w,0.3,{sz:15,b:true,c:INK});
      t(s,it[1],tx,y+0.46,w,0.9,{sz:12,c:MUT,lh:16});
    }
  });
}
/* dikey çizgi üzerinde düğümler */
function vrow(s,x,y0,items,o){
  o=o||{}; const p=o.pitch||0.74;
  drop(s,x,y0-0.22,y0+(items.length-1)*p+0.30);
  items.forEach(function(it,i){
    node(s,x,y0+i*p,{hollow:o.hollowIdx&&o.hollowIdx.indexOf(i)>=0});
  });
}
/* ======================================================== KAPAK (numarasız) */
(function(){
  const s=slide();
  t(s,"Marka Anahtarını Okumak",M,1.52,11.6,0.72,{sz:44,b:true,c:INK});
  t(s,"ve Müşteri Deneyimini Haritalamak",M,2.26,11.6,0.72,{sz:44,b:true,c:ACC});
  const y=4.30; rule(s,y);
  const ws=[["MARKA"],["KULLANICI"],["DENEYİM"],["MEKÂN"]];
  const xs=[1.04,4.06,7.04,9.92];
  ws.forEach(function(w,i){
    node(s,xs[i],y);
    t(s,w[0],xs[i]-0.06,y+0.18,2.6,0.3,{sz:15,b:true,c:i===3?ACC:INK,ls:1.2});
  });
  t(s,"İç Mimari Proje III  ·  Birinci ders",M,6.40,6,0.3,{sz:13,c:MUT});
})();

/* ================================================== 01 MARKADAN MEKÂNA */
(function(){
  const s=page("Markadan mekâna");
  const y=2.12, xs=[1.04,4.06,7.04,9.92];
  hrow(s,y,xs,[
    ["Marka kimliği","Markayı araştırmak ve kimliğini çözümlemek."],
    ["Kullanıcı","Kullanıcının ihtiyaç, değer ve davranışlarını anlamak."],
    ["Deneyim","Etkileşim, duyular, teknoloji ve müşteri yolculuğunu tasarlamak."],
    ["Mekân","Kimliği atmosfer, malzeme, ışık ve mekânsal kurguya çevirmek."]],
    {hi:3,w:2.7});
  drop(s,xs[3],2.03,4.23);
  label(s,"İşlevler",xs[3]-0.02,4.02,3.0);
  vlist(s,["vitrin ve sergileme","giriş ve eşik","dolaşım","deneyim alanı",
    "bilgi ve tanıtım","satış ve kasa","depolama ve stok","personel"],xs[3]+0.07,4.38,2.5);
  label(s,"Tasarım kapsamı",M,5.86,3.0);
  vlist(s,["atmosfer","kimlik","malzeme","ışık"],M,6.22,2.0);
  vlist(s,["renk","doku","mobilya","duyusal nitelikler"],M+2.2,6.22,2.4);
})();

/* ================================================ 02 ALTI YETKİNLİK */
(function(){
  const s=page("Markadan mekâna","tasarımın gerekçelendirilebilir olması");
  const xs=[1.04,4.62,8.20];
  hrow(s,2.34,xs,[
    ["Marka analizi","Markanın misyonunu, değerlerini, ürünlerini ve kimliğini araştırmak."],
    ["Kullanıcı odağı","Kullanıcı profilini ihtiyaç, değer ve davranışlarıyla anlamak."],
    ["Deneyim ve duyular","Mekânı görme, dokunma, işitme, koku ve hareket üzerinden düşünmek."]],
    {w:3.2});
  hrow(s,4.62,xs,[
    ["Teknoloji entegrasyonu","Fiziksel ve dijital temasları deneyimi destekleyecek biçimde kurmak."],
    ["Mekânsal kimlik","Kimliği atmosfer, malzeme, ışık, renk, doku ve kurguya çevirmek."],
    ["Uygulanabilirlik","Ergonomi, operasyon, depolama, dolaşım ve detay kararlarını gözetmek."]],
    {w:3.2});
})();

/* ==================================================== 03 MARKA DNA'SI */
(function(){
  const s=page("Marka DNA’sı","Markanın kimliğini çözümlemek ve onu mekânsal bir dile çevirmek.");
  t(s,"Marka bir vaadin tutarlı biçimde tekrarlanmasıdır.",M,1.76,11.2,0.44,{sz:22,b:true,c:ACC});
  label(s,"Markanın bağlamı — dışarıdan gelen",M,2.60,5.4);
  const x3=[1.04,4.86,8.68];
  hrow(s,3.06,x3,[["Rekabet","Başka hangi seçenekler var?"],
    ["Hedef kullanıcı","Kime sesleniyor?"],["Amaçlar","Neyi başarmak istiyor?"]],{w:3.4});
  label(s,"Markanın ifadesi — kendi kurduğu",M,4.30,5.4);
  const x6=[1.04,2.96,4.88,6.80,8.72,10.64];
  hrow(s,4.76,x6,[["Misyon","Var olma nedeni"],["Değerler","Neye inanıyor?"],
    ["Faydalar","İşlevsel ve duygusal olarak ne sunuyor?"],
    ["Kişilik","Bir insan olsaydı nasıl biri olurdu?"],
    ["Görsel dil","Renk · biçim · malzeme · görüntü"],
    ["İletişim tonu","Nasıl konuşuyor?"]],{w:1.78});
  t(s,"Kaynak: Sunar Bükülmez, Girginkaya Akdağ ve Ekin (2025), Marka Anahtarı Analizi aracı (I-AM İstanbul).",
    M,6.90,9.6,0.3,{sz:11,c:MUT});
})();
/* ================================================== 04 MARKA KİMLİĞİ */
(function(){
  const s=page("Marka kimliği","Araştırmanın amacı aynı anlamı farklı kanıtlarda görebilmek.");
  const xs=[1.04,4.62,8.20];
  hrow(s,2.34,xs,[["Web sitesi","Misyon · ürün dili · değerler"],
    ["Sosyal medya","Görsel dil · iletişim · kullanıcı"],
    ["Ürün","Malzeme · biçim · fiyat · kullanım"]],{w:3.2});
  hrow(s,4.44,xs,[["Kullanıcı yorumları","Beklenti · memnuniyet · sorunlar"],
    ["Rakipler","Farklılaşma · konum · fırsat"],
    ["Gözlem","Gerçek davranış · temas · bağlam"]],{w:3.2,hi:2,hw:3.4,hh:1.0});
  t(s,"Kaynak: Sunar Bükülmez vd. (2025), marka analizi ve kullanıcı profili bölümleri.",
    M,6.90,9.6,0.3,{sz:11,c:MUT});
})();

/* ================================================ 05 KULLANICI PROFİLİ */
(function(){
  const s=page("Kullanıcı profili","Davranışı okunabilen kullanıcı, mekânsal karar üretir.");
  const xs=[1.04,4.62,8.20];
  hrow(s,2.34,xs,[["Kim?","Yaş · yaşam biçimi · sosyo-ekonomik bağlam"],
    ["Neye değer veriyor?","Değerler · öncelikler · inançlar"],
    ["Neye ihtiyacı var?","İşlevsel ve duygusal ihtiyaçlar"]],{w:3.2});
  hrow(s,4.44,xs,[["Nasıl davranıyor?","Arıyor · karşılaştırıyor · seçiyor · bekliyor"],
    ["Ne hissediyor?","Merak · güven · huzursuzluk · aidiyet"],
    ["Ne bekliyor?","Hız · keşif · kişisellik · kolaylık"]],{w:3.2,hi:0,hw:3.4,hh:1.0});
  t(s,"Kaynak: Sunar Bükülmez vd. (2025), kullanıcı profili ve persona yaklaşımı.",
    M,6.90,9.6,0.3,{sz:11,c:MUT});
})();

/* ======================================= 06 ANAHTAR KELİME · YÖNTEM */
(function(){
  const s=page("Anahtar kelime","Markanın analizini tasarım kararına bağlar.");
  const y=2.34, xs=[1.04,4.06,7.04,9.92];
  hrow(s,y,xs,[
    ["Kaynaklar","Markanın kendi ürettiği her şey: metinler, ambalaj, sosyal medya dili, müşteri yorumları, görüşme, rakiplerin dili"],
    ["Ham kelime havuzu","Otuz–elli kelime. Sıfat, fiil ve nesne adı; hepsini yaz, hiçbirini eleme, tekrar edenleri işaretle"],
    ["Gruplama ve eleme","Eş anlamlıları birleştir, kümele; markaya özgü olmayanları at: kaliteli, modern, özel"],
    ["Üç anahtar kelime","Özgül · kanıtlı · mekânda karşılığı kurulabilir"]],
    {hi:3,w:2.7,hh:1.30});
  drop(s,xs[3],y-0.09,4.42);
  label(s,"Üç kelimenin sınavı",xs[3]-0.02,4.20,3.0);
  vlist(s,["Her markaya uyacak kadar","genel olmamalı.","",
    "Araştırmada karşılığı","bulunmalı.","",
    "Mekânda somut bir karşılığı","kurulabilmeli."],xs[3]+0.07,4.56,2.6,{sz:13,c:INK,pitch:0.26});
})();

/* ==================================== zincir (07–09 ortak dört adım) */
function zincir(s,y,hi){
  const xs=[1.04,4.06,7.04,9.92];
  hrow(s,y,xs,[["Marka özelliği","araştırmada bulunan somut olgu"],
    ["Anahtar kelime","o olgunun tek sıfata indirgenmesi"],
    ["Mekânsal ilke","sayısız çözüme açık genel kural"],
    ["Tasarım öğesi","çizilebilir, ölçülebilir karar"]],
    {w:2.7,hi:hi,hw:2.79,hh:0.96});
  return xs;
}

/* ======================================= 07 VAKA · MARKANIN PROFİLİ */
(function(){
  const s=page("Anahtar kelime",
    "Örnek vaka: yerel bir seramik markası — el yapımı seramik ev ve sofra ürünleri.");
  zincir(s,2.20);
  label(s,"Markanın profili",M,3.62,3.0);
  const rows=[["Neden varız","Gündelik yaşama üretim ve malzeme duygusu katmak"],
    ["İdeal","Atölyesini müşteriye açabilen, öğreten bir dükkân olmak"],
    ["Değerler","Yerellik · zanaat · doğaya saygı"],
    ["Kişilik","Özenli · açık sözlü · malzemeye yakın"],
    ["Pazar konumu","Seri üretim ev ürünleri değil; imzalı zanaat parçaları"],
    ["Kullanıcı profili","Kentin yoğunluğu içinde yavaş ve anlamlı seçim yapmak isteyen, ürünü eline almadan karar vermeyen kullanıcı"]];
  rows.forEach(function(r,i){
    const y=4.06+i*0.50;
    t(s,r[0],M,y,2.5,0.32,{sz:13.5,b:true,c:INK});
    t(s,r[1],M+2.7,y,CW-2.7,0.46,{sz:13.5,c:BODY,lh:18});
  });
})();

/* ============================================ 08 BEŞ ANAHTAR KELİME */
(function(){
  const s=page("Bu markadan çıkan beş kelime",
    "Örnek vaka: yerel bir seramik markası — el yapımı seramik ev ve sofra ürünleri.");
  const X=1.12, y0=2.34, P=0.92;
  const ws=[["CESUR","karakterli · görünür · güçlü"],
    ["DOĞAL","malzemeye yakın · sıcak · yalın"],
    ["SÜRDÜRÜLEBİLİR","uzun ömürlü · az atık · esnek"],
    ["TEKİLLİK","her ürün tek · elde üretilmiş"],
    ["GÖRÜNÜRLÜK","üretim gizlenmiyor · süreç sahnede"]];
  vrow(s,X,y0,ws,{pitch:P});
  ws.forEach(function(r,i){
    const y=y0+i*P;
    t(s,r[0],X+0.42,y-0.24,5.4,0.44,{sz:26,b:true,c:i%2?ACC:INK,ls:0.8});
    t(s,r[1],X+0.42,y+0.20,5.4,0.3,{sz:13,c:MUT});
  });
  t(s,"Kelime markanın analizinden çıkar.",6.90,2.34,5.0,0.36,{sz:15,b:true,c:INK});
  t(s,"Mekânsal ilke o kelimenin kuralıdır; tasarım öğesi ise o kuralın çizilebilir hâlidir. Üç kelime seçilecek, hepsi mekânda karşılık bulacak.",
    6.90,2.76,5.0,1.2,{sz:13.5,c:MUT,lh:19});
})();
/* ================================= 09 KELİMEDEN TASARIM ÖĞESİNE */
(function(){
  const s=page("Kelimeden tasarım öğesine",
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
  const X=1.12, y0=2.66, P=0.86;
  label(s,"Mekânsal ilke",5.10,2.10,2.6,{sz:13});
  label(s,"Tasarım öğesi",8.10,2.10,2.6,{sz:13});
  vrow(s,X,y0,d,{pitch:P});
  d.forEach(function(r,i){
    const y=y0+i*P;
    t(s,r[0],X+0.40,y-0.22,3.5,0.34,{sz:r[0].length>10?15:17,b:true,c:ACC,ls:0.4});
    t(s,r[1],X+0.40,y+0.10,3.5,0.3,{sz:11.5,c:MUT});
    t(s,r[2],5.10,y-0.16,2.9,0.36,{sz:15,b:true,c:INK});
    t(s,r[3],8.10,y-0.18,CW-7.14,0.62,{sz:12.5,c:BODY,lh:17});
  });
})();

/* ============================================ 10 MÜŞTERİ YOLCULUĞU */
(function(){
  const s=page("Müşteri yolculuğunun sekiz aşaması");
  const y=2.60, sp=1.47, X0=0.92;
  rule(s,y);
  const st=[["01","FARKINDALIK",""],["02","ÇEKİM","cephe\nvitrin\nilk görsel temas"],
    ["03","EŞİK","giriş\nilk izlenim\natmosfer"],
    ["04","YÖNLENME","dolaşım\ngörüş hatları\nişaretleme"],
    ["05","KEŞİF","ürün grupları\nbilgi\nsergileme"],
    ["06","ETKİLEŞİM","deneme\nbekleme\nteknoloji"],
    ["07","SATIN ALMA","kasa\nödeme\npaketleme"],["08","AYRILIŞ",""]];
  st.forEach(function(r,i){
    const x=X0+i*sp, ins=(i>0&&i<7);
    node(s,x,y,{hollow:!ins,c:ins?BLACK:HOLLOW});
    t(s,r[0],x-0.06,y-0.44,1.3,0.26,{sz:11,b:true,c:ins?ACC:FAINT});
    t(s,r[1],x-0.06,y+0.16,1.4,0.28,{sz:12,b:true,c:ins?INK:MUT,ls:0.4});
    if(r[2]) t(s,r[2],x-0.06,y+0.46,1.4,0.76,{sz:11.5,c:MUT,lh:16});
  });
  t(s,"mekânın\ndışında",X0-0.06,y+0.46,1.4,0.5,{sz:11.5,c:MUT,lh:16});
  t(s,"mekânın\ndışında",X0+7*sp-0.06,y+0.46,1.4,0.5,{sz:11.5,c:MUT,lh:16});
  rule(s,4.28,{x0:X0+sp,x1:X0+6*sp,w:1.5});
  drop(s,X0+sp,4.16,4.28);  drop(s,X0+6*sp,4.16,4.28);
  t(s,"İç mekânda geçen altı aşama",X0+sp,4.36,6.0,0.3,{sz:14,b:true,c:ACC});
  label(s,"Yolculuğun görünmeyen yüzü",M,5.62,4.4);
  vlist(s,["depolama","personel","ergonomi"],M,5.98,3.0,{sz:13.5});
})();

/* ============================================== 11 VAKA · YOLCULUK */
(function(){
  const s=page("Seramik markasının müşteri yolculuğu");
  const rows=[["Çekim","Vitrinde tek bir parça; arkasında çalışan çark görünüyor","GÖRÜNÜRLÜK"],
    ["Eşik","Ham yüzey, mat ışık ve çamurun kokusu karşılıyor","DOĞAL"],
    ["Yönlenme","Net görüş hattı; rota atölyeden tartıma doğru akıyor","GÖRÜNÜRLÜK"],
    ["Keşif","Her parça kendi kaidesinde, aralarında geniş boşluk","TEKİLLİK"],
    ["Etkileşim","Dokunma serbest; numune ve üretim anlatısı tezgâhta","TEKİLLİK"],
    ["Satın alma","Ambalajın kendisi zanaatın parçası; paketleme görünür","SÜRDÜRÜLEBİLİRLİK"],
    ["Ayrılış","Parçanın kim tarafından yapıldığı yazan kart","TEKİLLİK"]];
  const X=1.12, y0=1.92, P=0.72;
  vrow(s,X,y0,rows,{pitch:P});
  rows.forEach(function(r,i){
    const y=y0+i*P;
    t(s,r[0],X+0.40,y-0.17,2.1,0.34,{sz:16,b:true,c:INK});
    t(s,r[1],X+2.60,y-0.14,5.1,0.4,{sz:13.5,c:BODY});
    t(s,r[2],8.90,y-0.13,CW-7.94,0.3,{sz:12.5,b:true,c:ACC,ls:0.5});
  });
})();

/* ==================================================== 12 DUYULAR */
(function(){
  const s=page("Duyular marka kimliğini nasıl taşır?",
    "Atmosfer tek bir duyudan doğmaz; duyusal etki uyaranların birlikte çalışmasından doğar.");
  const d=[["Görme","ışık · renk · kontrast · görüş hattı","Işığın düzeyi mekânın hızını belirler; rengi ürünün rengini değiştirir."],
    ["Dokunma","malzeme · doku · sıcaklık · ağırlık","İnsan ürünü eline aldığında sahiplik duygusu geliştirir. İnternete karşı en güçlü duyu."],
    ["İşitme","akustik · müzik · sessizlik","Karar verilen yerlerde sesin düşmesi gerekir: kabin, danışma, ödeme."],
    ["Koklama","koku · hafıza · kaynak","Hafızaya en doğrudan bağlanan duyu. Kokunun kaynağı ürünün kendisi olmalı."],
    ["Tat","tadım · ikram","En dar kullanım alanı, ama kullanıldığı yerde en güçlü etki."],
    ["Beden","ısı · hava · kot · ritim · yoğunluk","Yoğunluk en güçlü etken: kalabalıkta insan hızlanır ve erken çıkar."]];
  const X=1.12, y0=2.24, P=0.80;
  vrow(s,X,y0,d,{pitch:P});
  d.forEach(function(r,i){
    const y=y0+i*P;
    t(s,r[0],X+0.40,y-0.19,1.8,0.34,{sz:17,b:true,c:INK});
    t(s,r[1],X+2.30,y-0.15,2.9,0.44,{sz:12.5,b:true,c:ACC,lh:16});
    t(s,r[2],X+5.40,y-0.16,RM-(X+5.40),0.5,{sz:13,c:BODY,lh:17});
  });
})();

/* =========================================== 13 DUYU × AŞAMA */
(function(){
  const s=page("Hangi duyu, yolculuğun hangi anında?",
    "Duyular mekânın her yerinde aynı yoğunlukta çalışmaz; her duyunun baskın olduğu bir an vardır.");
  const cols=["ÇEKİM","EŞİK","YÖNELME","GEZİNME","ETKİLEŞİM","SATIN ALMA","AYRILIŞ"];
  const MX=2.90, MW=6.30, sp=MW/7;
  cols.forEach(function(c,i){
    t(s,c,MX+i*sp,2.06,sp,0.26,{sz:9.5,b:true,c:MUT,al:"center",ls:0.4});
  });
  const rows=[["Görme",[1,1,1,1,0,0,0],"vitrin silüeti · teşhir kontrastı"],
    ["Beden",[0,1,1,1,0,0,0],"eşikte ısı · koridor genişliği"],
    ["Koklama",[0,1,0,0,1,0,0],"ilk izlenim · ürünün kendi kokusu"],
    ["İşitme",[0,0,0,1,1,1,0],"genel akustik · kabinde sessizlik"],
    ["Dokunma",[0,0,0,1,1,0,0],"açık raf · deneme · tezgâh"],
    ["Tat",[0,0,0,0,1,0,0],"tadım noktası · ikram"]];
  rows.forEach(function(r,i){
    const y=2.60+i*0.72, cy=y+0.19;
    t(s,r[0],M,y,1.8,0.34,{sz:16,b:true,c:INK});
    r[1].forEach(function(v,j){
      const cx=MX+j*sp+sp/2;
      if(v) node(s,cx,cy,{d:0.22}); else node(s,cx,cy,{d:0.10,c:HOLLOW});
    });
    t(s,r[2],9.50,y+0.02,CW-8.54,0.34,{sz:11.5,c:MUT});
  });
})();
/* ============================================== 14 ÜRÜN + BOŞLUK */
(function(){
  const s=page("Ürün + boşluk");
  const d=[["Mücevher · sanat","birim değer yüksek; boşluk doğrudan değer anlamına gelir",1],
    ["Parfüm · sofistike moda","seçilmiş az sayıda ürün, geniş boşluk, oturarak satış",2],
    ["Seramik · zanaat","her parça tekil; kaide ve aralık gerekir",3],
    ["Kitap · plak","tarama davranışı; orta yoğunluk, raf metrajı önemli",5],
    ["Giyim · ayakkabı","beden çeşidi yoğunluk üretir; stok yakınlığı belirleyici",8]];
  const y=3.30, xs=[1.04,3.40,5.76,8.12,10.48];
  label(s,"Az ürün",M,1.66,2.4);
  t(s,"Çok ürün",9.56,1.66,3.0,0.28,{sz:14,b:true,c:ACC,al:"right"});
  rule(s,y);
  d.forEach(function(r,i){
    const x=xs[i], k=r[2], hi=(i===2);
    for(let j=0;j<k;j++){
      const rr=Math.floor(j/4), cc=j%4, cnt=Math.min(k-rr*4,4);
      node(s,x+0.30-(cnt-1)*0.11+cc*0.22, 2.36+rr*0.24, {d:0.11});
    }
    node(s,x,y,{d:hi?0.24:0.19});
    t(s,r[0],x-0.06,y+0.20,2.2,0.52,{sz:14.5,b:true,c:hi?ACC:INK,lh:19});
    t(s,r[1],x-0.06,y+0.76,2.2,0.9,{sz:12,c:MUT,lh:16});
  });
  t(s,"Ürün sayısı arttıkça boşluk azalır; boşluk azaldıkça mekânın anlattığı şey değişir.",
    M,5.60,11.0,0.36,{sz:15,b:true,c:INK});
})();

/* ================================================ 15 MARKA SEÇİMİ */
(function(){
  const s=page("Hangi tür ürün satan markaları seçebilirsiniz?",
    "Ürünün türü mekândan istediği şeyi belirler. Kendi adayınız hangi gruba giriyor?");
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
  const X=1.12, y0=2.26, P=0.78;
  vrow(s,X,y0,rows,{pitch:P});
  rows.forEach(function(r,i){
    const y=y0+i*P, hi=(i===5);
    t(s,r[0],X+0.40,y-0.20,2.7,0.44,{sz:14,b:true,c:hi?ACC:INK,lh:18});
    t(s,r[1],X+3.30,y-0.18,3.2,0.5,{sz:12,c:BODY,lh:16});
    t(s,r[2],X+6.70,y-0.18,RM-(X+6.70),0.5,{sz:12,c:MUT,lh:16});
  });
})();

/* =========================================== 16 MARKA ARAŞTIRMASI */
(function(){
  const s=page("Marka araştırması");
  const y=2.34, xs=[1.04,3.40,5.76,8.12,10.48];
  const st=[["Üç marka bul","Ana akım olmayan, mağaza kimliği henüz oluşmamış adaylar"],
    ["Markayı araştır","Ürün · kullanıcı · değer ve hikâye · rakipler"],
    ["Üç anahtar kelime","Markayı mekâna taşıyabilecek üç kelime seç"],
    ["Üründen mekâna","Sergileme ve depolama · aydınlatma · deneyim ve duyu"],
    ["Kelimeyi karara çevir","Her kelime için somut bir mekânsal karar"]];
  rule(s,y);
  st.forEach(function(r,i){
    const x=xs[i], hi=(i===4);
    node(s,x,y,{d:hi?0.24:0.19});
    t(s,"0"+(i+1),x-0.06,y-0.44,1.2,0.26,{sz:11,b:true,c:hi?ACC:FAINT});
    if(hi){
      fill(s,x-0.15,y+0.02,2.23,1.30);
      t(s,r[0],x-0.06,y+0.14,2.0,0.56,{sz:15,b:true,c:WHITE,lh:19});
      t(s,r[1],x-0.06,y+0.74,2.0,0.5,{sz:12,c:ACCT,lh:16});
    } else {
      t(s,r[0],x-0.06,y+0.16,2.2,0.5,{sz:15,b:true,c:INK,lh:19});
      t(s,r[1],x-0.06,y+0.66,2.2,0.9,{sz:12,c:MUT,lh:16});
    }
  });
  drop(s,xs[4],y-0.09,4.42);
  label(s,"Teslim",xs[4]-0.02,4.20,2.4);
  vlist(s,["Üç aday marka stüdyoda","çalışılmaya","başlanabilir; teslim","hafta içinde alınacaktır."],
    xs[4]+0.07,4.56,2.3,{sz:12.5,c:INK,pitch:0.26});
})();

/* =================================================== 17 KAYNAKLAR */
(function(){
  const s=page("Dersin temel kaynakları",
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
  const OFF=[0,1.02,1.76,2.50,3.24,3.98], cw=5.25;
  [L,Rr].forEach(function(list,k){
    const x=M+k*(cw+0.85);
    list.forEach(function(r,i){
      const y=2.06+OFF[i];
      node(s,x+0.05,y+0.10,{d:0.09});
      t(s,r[0],x+0.28,y,cw-0.28,i===0?0.44:0.32,{sz:12,b:true,c:INK,lh:15});
      t(s,r[1],x+0.28,y+(i===0?0.40:0.28),cw-0.28,i===0?0.62:0.56,{sz:11,c:MUT,lh:14});
    });
  });
  t(s,"Kaynak modellerdeki diyagramlar bu sunum için yeniden çizilmiştir · doi.org/10.18848/2325-128X/CGP/v19i02/25-50",
    M,6.90,10.6,0.3,{sz:11,c:MUT});
})();

pptx.writeFile({fileName:"IMC301-Sunum-1.pptx"}).then(function(){console.log("ok");});
