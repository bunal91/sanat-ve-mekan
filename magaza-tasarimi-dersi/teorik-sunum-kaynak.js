const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE";              // 13.33 x 7.5
p.title  = "Mağaza Tasarımı — Teorik Giriş";

/* ---------------- minimal palette ---------------- */
const INK    = "16161A";   // near-black
const PAPER  = "FCFCFA";   // near-white ground
const BODY   = "2B2B31";   // body text
const MUTED  = "7A7A82";   // captions, citations
const FAINT  = "A6A6AC";   // slide numbers
const ACC    = "8C3A2B";   // deep brick — section numbers, sense names only
const DIMW   = "B9B9C0";   // light text on dark

const H  = "Cambria";      // headings + body paragraphs
const S  = "Calibri";      // labels, citations, captions

const M   = 0.85;          // margin
const CW  = 5.50;          // text column width
const C2  = 6.98;          // second column x
const FW  = 11.63;         // full usable width

let n = 0;                 // slide counter

/* ---------------- helpers ---------------- */

// small letterspaced label, top of slide
function label(s, t) {
  s.addText(t, {
    x: M, y: 0.52, w: 10.5, h: 0.26, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, bold: true, color: MUTED, charSpacing: 2.6
  });
}

function num(s) {
  n += 1;
  s.addText(String(n), {
    x: 12.0, y: 6.92, w: 0.48, h: 0.26, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 9.5, color: FAINT, align: "right"
  });
}

// citation line, bottom left
function cite(s, t) {
  s.addText(t, {
    x: M, y: 6.82, w: 6.0, h: 0.52, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 8.5, color: MUTED, italic: true, lineSpacing: 11
  });
}

// image suggestion, bottom of right column
function img(s, t) {
  s.addText("Görsel önerisi — " + t, {
    x: 7.25, y: 6.82, w: 4.55, h: 0.52, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 8.5, color: FAINT, lineSpacing: 11
  });
}

// standard content slide
function slide(lab, title, titleSize) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  label(s, lab);
  s.addText(title, {
    x: M, y: 0.92, w: 11.2, h: 0.95, isTextBox: true, margin: 0,
    fontFace: H, fontSize: titleSize || 30, bold: true, color: INK, lineSpacing: 36
  });
  num(s);
  return s;
}

// flowing paragraph(s) in the left column
function text(s, t, opts) {
  const o = opts || {};
  const size = o.size || 14.5, ls = o.ls || 23;
  const y = o.y !== undefined ? o.y : 2.05;
  const h = o.h !== undefined ? o.h : 4.55;
  const paras = t.split("\n\n");
  const perLine = Math.floor((CW * 72 - 4) / (size * 0.52));
  const est = paras.map(q =>
    q.split("\n").reduce((a, l) => a + Math.max(1, Math.ceil(l.length / perLine)), 0) + 1);
  const total = est.reduce((a, b) => a + b, 0);
  let acc = 0, cut = paras.length;
  for (let i = 0; i < paras.length; i++) {
    acc += est[i];
    if (acc >= total / 2) { cut = i + 1; break; }
  }
  const A = paras.slice(0, cut).join("\n\n");
  const B = paras.slice(cut).join("\n\n");
  const opt = { h: h, isTextBox: true, margin: 0, fontFace: H,
                fontSize: size, color: BODY, lineSpacing: ls };
  s.addText(A, Object.assign({ x: M, y: y, w: CW }, opt));
  if (B) s.addText(B, Object.assign({ x: C2, y: y, w: CW }, JSON.parse(JSON.stringify(opt))));
}

// right column note: a heading + running text (no box)
// a row of named examples across the full width (no boxes, no rules)
function exampleRow(s, items, y, cols) {
  const c = cols || items.length;
  const gap = 0.5;
  const w = (FW - gap * (c - 1)) / c;
  items.forEach((it, i) => {
    const col = i % c, row = Math.floor(i / c);
    const x = M + col * (w + gap);
    const yy = y + row * 1.12;
    s.addText(it[0], {
      x: x, y: yy, w: w, h: 0.3, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 13.5, bold: true, color: ACC
    });
    s.addText(it[1], {
      x: x, y: yy + 0.32, w: w, h: 0.72, isTextBox: true, margin: 0,
      fontFace: S, fontSize: 11, color: MUTED, lineSpacing: 14
    });
  });
}

// a list of named examples, set as running lines (no bullets, no boxes)
function examples(s, items, y, x, w, size) {
  let yy = y === undefined ? 2.15 : y;
  const xx = x === undefined ? M : x;
  const ww = w === undefined ? CW : w;
  const sz = size || 13;
  items.forEach(it => {
    s.addText(it[0], {
      x: xx, y: yy, w: ww, h: 0.28, isTextBox: true, margin: 0,
      fontFace: H, fontSize: sz + 0.5, bold: true, color: ACC
    });
    s.addText(it[1], {
      x: xx, y: yy + 0.3, w: ww, h: 0.72, isTextBox: true, margin: 0,
      fontFace: S, fontSize: sz - 1.5, color: MUTED, lineSpacing: 15
    });
    yy += 1.13;
  });
}

// dark section opener
function opener(numeral, title, sub) {
  const s = p.addSlide();
  s.background = { color: INK };
  s.addText(numeral, {
    x: M, y: 1.5, w: 3.4, h: 2.6, isTextBox: true, margin: 0,
    fontFace: H, fontSize: numeral.length > 2 ? 96 : 130, bold: true,
    color: ACC, valign: "middle"
  });
  s.addText(title, {
    x: M, y: 3.95, w: 11.4, h: 1.45, isTextBox: true, margin: 0,
    fontFace: H, fontSize: title.length > 32 ? 34 : 40, bold: true,
    color: "FFFFFF", lineSpacing: 44
  });
  s.addText(sub, {
    x: M, y: 5.5, w: 10.4, h: 0.9, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 15, color: DIMW, lineSpacing: 22
  });
  n += 1;
  return s;
}

// large pull quote on white
function quote(q, attr, src) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  s.addText(q, {
    x: M, y: 1.75, w: 11.4, h: 3.4, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 30, italic: true, color: INK, lineSpacing: 44
  });
  s.addText(attr, {
    x: M, y: 5.35, w: 11.4, h: 0.4, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 14, bold: true, color: ACC
  });
  if (src) cite(s, src);
  num(s);
  return s;
}

// a sense slide: big sense name + paragraph + named examples
function sense(name, en, para, exs, citation, imgs) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  label(s, "V · DUYULAR");
  s.addText(name, {
    x: M, y: 0.85, w: 6.8, h: 0.8, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 40, bold: true, color: ACC
  });
  s.addText(en, {
    x: M, y: 1.66, w: 9.0, h: 0.28, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 10.5, color: MUTED, charSpacing: 1.6
  });
  text(s, para, { y: 2.18, h: 3.35, size: 14, ls: 22 });
  exampleRow(s, exs, 5.72);
  if (citation) cite(s, citation);
  if (imgs) img(s, imgs);
  num(s);
  return s;
}

/* =========================================================
   KAPAK
   ========================================================= */
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addText("Mağaza\nTasarımı", {
    x: M, y: 1.55, w: 10.5, h: 2.6, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 68, bold: true, color: "FFFFFF", lineSpacing: 76
  });
  s.addText("Mekân, marka ve duyular üzerine teorik bir giriş", {
    x: M, y: 4.35, w: 10.5, h: 0.55, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 24, color: ACC
  });
  s.addText("İç Mimarlık  ·  Proje Stüdyosu  ·  Teorik Ders", {
    x: M, y: 5.35, w: 10.5, h: 0.4, isTextBox: true, margin: 0,
    fontFace: S, fontSize: 13, color: DIMW, charSpacing: 1.6
  });
  n += 1;
  s.addNotes("Sunum dokuz bölümden oluşuyor ve tamamı teoriktir; proje bilgisi içermez. Yaklaşık 90-120 dakikalık bir anlatım için tasarlandı. Görsel önerileri sağ alt köşelerde belirtildi.");
}

/* ---------- kapsam ---------- */
{
  const s = p.addSlide();
  s.background = { color: PAPER };
  label(s, "SUNUMUN KAPSAMI");
  s.addText("Dokuz bölüm", {
    x: M, y: 0.92, w: 11.2, h: 0.7, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 30, bold: true, color: INK
  });
  const secs = [
    ["I", "Mağaza tasarımı nedir?"],
    ["II", "Atmosfer: mekânın duygusal etkisi"],
    ["III", "Marka ve mekân"],
    ["IV", "Müşteri yolculuğu ve mekânsal davranış"],
    ["V", "Duyular"],
    ["VI", "Işık, malzeme, teşhir"],
    ["VII", "Fiziksel ve dijital olanın iç içe geçmesi"],
    ["VIII", "Herkes için mağaza"],
    ["IX", "Dünyadan ve Türkiye'den örnekler"]
  ];
  let y = 2.0;
  secs.forEach(sec => {
    s.addText(sec[0], {
      x: M, y: y, w: 0.85, h: 0.42, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 17, bold: true, color: ACC, valign: "middle"
    });
    s.addText(sec[1], {
      x: M + 0.95, y: y, w: 9.6, h: 0.42, isTextBox: true, margin: 0,
      fontFace: H, fontSize: 17, color: BODY, valign: "middle"
    });
    y += 0.52;
  });
  num(s);
  s.addNotes("Bölümleri tek tek okumayın; genel çerçeveyi gösterin ve geçin. Duyular bölümü (V) sunumun en uzun ve en ayrıntılı bölümüdür.");
}

/* =========================================================
   I — MAĞAZA TASARIMI NEDİR?
   ========================================================= */
opener("I", "Mağaza tasarımı nedir?", "Bir mekân tipi olarak mağaza, ne yapar ve nereden gelir.");

{
  const s = slide("I · MAĞAZA TASARIMI NEDİR", "Ürünün, markanın ve insanın buluştuğu mekân");
  text(s, "Mağaza tasarımı, ürünlerin ve hizmetlerin sunulduğu fiziksel ortamların tasarlanmasıdır. Ancak bu tanım eksiktir: mağaza yalnızca ürünün durduğu yer değil, markanın kendini üç boyutlu olarak anlattığı yerdir.\n\nBir iç mimar mağaza tasarlarken aynı anda birden fazla soruya cevap verir. Ürün nasıl görünecek ve nasıl korunacak? İnsan mekânda nasıl hareket edecek? Marka hangi duyguyu uyandırmak istiyor? Ve bütün bunlar, çalışanların günlük işini aksatmadan nasıl kurulacak?\n\nBu soruların hepsi aynı anda cevaplanmak zorundadır. Mağaza tasarımını zorlaştıran da, ilginç kılan da budur.\n\nBurada bir ayrım yapmak gerekir: vitrin düzenlemek ile mağaza tasarlamak aynı şey değildir. Vitrin, mekânın ürettiği anlamın yalnızca bir katmanıdır.");
  cite(s, "Mesher, L. (2010). Basics Interior Design: Retail Design. AVA Publishing.");
  s.addNotes("Bu slaytta 'mağaza = markanın üç boyutlu anlatımı' fikrini kurun. Sunumun geri kalanı bu cümlenin açılımıdır.");
}

{
  const s = slide("I · MAĞAZA TASARIMI NEDİR", "Mağaza aynı anda dört iş yapar");
  text(s, "Birincisi, ürünü sunar. Ürün görünür, ulaşılabilir ve anlaşılır olmalıdır; raf yüksekliğinden ışığın rengine kadar her karar bunu etkiler.\n\nİkincisi, insanı yönlendirir. İnsan mekâna girdiğinde nereye gideceğini düşünmek zorunda kalmamalıdır. İyi bir mağaza, tabelayla değil kurguyla yönlendirir.\n\nÜçüncüsü, bir atmosfer üretir. Işık, malzeme, ses ve koku birlikte bir duygu durumu yaratır ve bu duygu, satın alma kararını üründen bağımsız olarak etkiler.\n\nDördüncüsü, bir işletmeyi barındırır. Deponun, kasanın, personel alanının ve mal kabul rotasının çözülmediği bir mağaza, ne kadar güzel görünürse görünsün çalışmaz.");
  cite(s, "Quartier, K. (2017). Retail Design: What Does It Mean to a Store's Efficacy? / Bitner, M. J. (1992). Servicescapes. Journal of Marketing, 56(2), 57–71.");
  s.addNotes("Dördüncü maddeyi vurgulayın: öğrenciler mağazanın 'arka' tarafını en çok ihmal ettikleri yer burasıdır.");
}

{
  const s = slide("I · MAĞAZA TASARIMI NEDİR", "Birden çok alanın kesiştiği bir konu");
  text(s, "Mağaza tasarımı tek başına iç mimarlığın konusu değildir. Bir mağazayı anlamak için ürünün nasıl satıldığını, müşterinin nasıl davrandığını ve markanın kendini nasıl tanımladığını da bilmek gerekir.\n\nAlanın uluslararası literatüründe bu durum bir yetkinlik çerçevesiyle tarif edilir. Quartier ve arkadaşlarının geliştirdiği modelde perakende tasarımcısının bilgisi sekiz başlık altında toplanır: araştırma, tasarım, sosyo-kültürel bilimler, markalama, pazarlama ve strateji, çok kanallı ve dijital sistemler, iletişim, organizasyon ve yönetim.\n\nBu listeyi ezberlemek gerekmez. Önemli olan şunu görmektir: mağaza tasarımı, çizim becerisinin yanına gözlem, analiz ve gerekçelendirme becerisini de koyar.\n\nSadeleştirilmiş hâliyle mağaza tasarımı üç soruyu birlikte sorar: kim satıyor, kime satıyor ve mekân bu ilişkiyi nasıl kuruyor?");
  cite(s, "Quartier, K., Claes, S. & Vanrie, J. (2020). A Holistic Competence Framework for (Future) Retail Design and Retail Design Education. Journal of Retailing and Consumer Services.");
  s.addNotes("Sekiz başlığı tek tek okumayın. Sağdaki üç soru, öğrencinin akılda tutması gereken sadeleştirilmiş hâlidir.");
}

{
  const s = slide("I · MAĞAZA TASARIMI NEDİR", "Alışveriş mekânının kısa tarihi");
  text(s, "Alışveriş mekânı, satın alma biçimi değiştikçe biçim değiştirdi. Antik dünyada tabernae adı verilen sokağa açılan dükkânlar, ürünün doğrudan sokakla ilişki kurduğu bir düzendi. Ortaçağ ve sonrasında üretim ile satış aynı mekânda, çoğu zaman atölyenin önünde gerçekleşti.\n\nOn dokuzuncu yüzyıl iki büyük yenilik getirdi. Camlı pasajlar, alışverişi hava koşullarından bağımsız bir gezinti hâline getirdi. Büyük mağazalar ise ilk kez sabit fiyat, serbest dolaşım ve pazarlıksız alışverişi mümkün kıldı; müşteri artık bir şey almadan da içeride dolaşabiliyordu.\n\nYirminci yüzyılda self-servis düzeni ürünü müşterinin eline verdi. Yüzyılın ikinci yarısında alışveriş merkezi, mağazaları tek bir iç mekânda topladı. Bugün ise mağazadan beklenen şey değişti: ürün internetten de alınabildiği için mağaza, ürünün değil deneyimin mekânı hâline geldi.");
  cite(s, "Pine, B. J. & Gilmore, J. H. (1998). Welcome to the Experience Economy. Harvard Business Review, 76(4), 97–105.");
  img(s, "Le Bon Marché (Paris, 1852)\nGaleries Lafayette (Paris, 1912)\nSelfridges (Londra, 1909)");
  s.addNotes("Tarihi hızlı geçin ama pasaj ve büyük mağaza kırılmasını vurgulayın: 'bir şey almadan içeride dolaşabilmek' modern mağazanın kurucu fikridir.");
}

{
  const s = slide("I · MAĞAZA TASARIMI NEDİR", "Türkiye'de alışveriş mekânının biçimleri");
  text(s, "Bu tarihin Anadolu'daki karşılığı kendi tipolojilerini üretti. Bedesten, değerli malın saklandığı ve satıldığı kapalı, kâgir yapıdır. Arasta, aynı işi yapan esnafın iki sıra dükkânla dizildiği üstü örtülü sokaktır. Han, üretim, depolama ve konaklamayı bir avlu etrafında birleştirir. Kapalı Çarşı ise bu üç yapı tipinin zaman içinde büyüyerek birbirine eklenmesiyle oluşmuştur.\n\nOn dokuzuncu yüzyılın sonunda İstanbul'da Avrupa'daki pasajların yerel yorumları açıldı. Cumhuriyet döneminde Sümerbank mağazaları, ardından Yeni Karamürsel gibi zincirler, Türkiye'nin ilk büyük mağaza deneyimlerini oluşturdu.\n\n1988'de Galleria Ataköy ve 1993'te Akmerkez ile birlikte alışveriş merkezi tipolojisi yerleşti. Bugün Türkiye'de mağaza tasarımı, bu iki mirasın — çarşı geleneğinin ve alışveriş merkezinin — arasında konumlanıyor.");
  cite(s, "Cezar, M. (1983). Tipik Yapılarıyla Osmanlı Şehirciliğinde Çarşı ve Klasik Dönem İmar Sistemi. Mimar Sinan Üniversitesi Yayınları.");
  img(s, "Kapalı Çarşı ve Mısır Çarşısı (İstanbul)\nÇiçek Pasajı, Hazzopulo Pasajı (Beyoğlu)\nAkmerkez (1993)");
  s.addNotes("Bu slayt öğrenciler için çok değerli: mağaza tasarımı Batı'dan ithal bir konu değil, yerel bir geleneği de var. Bedesten-arasta-han ayrımını kısaca açın.");
}

{
  const s = slide("I · MAĞAZA TASARIMI NEDİR", "İnternet varken fiziksel mağaza neden var?");
  text(s, "Fiyat, çeşit ve erişim kolaylığı bakımından fiziksel mağaza internetle yarışamaz. Buna rağmen mağazalar açılmaya devam ediyor; çünkü mağazanın güçlü olduğu alan başka.\n\nMağaza, ürüne dokunmayı, denemeyi, koklamayı ve ölçüsünü bedenle anlamayı mümkün kılar. Satın alma anını bir olaya dönüştürür. Marka ile müşteri arasında, ekranda kurulamayacak bir yakınlık kurar.\n\nBu nedenle bugün mağazanın işi yalnızca satmak değildir. Literatürde mağazalar giderek 'deneyim merkezi' olarak tanımlanıyor: markanın anlatıldığı, denendiği ve hatırlandığı yer. Ürün internetten de alınabilir; hatırlanan şey mekândır.\n\nMağaza tasarımının bugünkü temel sorusu buradan çıkar: bu mekân, ekranın veremediği neyi veriyor?");
  cite(s, "Ratnayake, J. C., Jayasuriya, N., Suraweera, T. & De Silva, L. (2026). Integrating Industry 4.0 and 5.0 Technologies in Luxury Fashion Retail Interiors. Social Sciences & Humanities Open, 13, 102798.");
  s.addNotes("Sağdaki soru bütün sunumun eksenidir. Duyular bölümü bu sorunun cevabıdır.");
}

/* =========================================================
   II — ATMOSFER
   ========================================================= */
opener("II", "Atmosfer", "Mekânın, üründen bağımsız olarak davranışı etkileme gücü.");

{
  const s = slide("II · ATMOSFER", "Atmosfer bir tasarım aracıdır");
  text(s, "Mağaza atmosferinin satın alma davranışını etkilediği fikri yeni değildir. Philip Kotler 1973'te yayımladığı makalede, bir mekânın atmosferinin ürünün kendisinden bağımsız olarak satın alma kararını etkilediğini öne sürdü ve bu etkiyi bilinçli olarak tasarlanabilir bir araç olarak tanımladı.\n\nKotler'in kullandığı 'atmospherics' terimi, o tarihten sonra hem pazarlama hem de tasarım literatürünün ortak kavramı hâline geldi. Önemli olan şudur: atmosfer bir yan ürün değildir. Işığın rengi, tavanın yüksekliği, zeminin sesi ve koridorun genişliği bir araya gelerek ölçülebilir bir etki üretir.\n\nBu, iç mimarlık açısından dikkat çekici bir durumdur. Mağaza, tasarım kararlarının sonucunun sayıyla geri döndüğü ender mekân tiplerinden biridir.");
  cite(s, "Kotler, P. (1973). Atmospherics as a Marketing Tool. Journal of Retailing, 49(4), 48–64.");
  s.addNotes("Tarihi vurgulayın: 1973. Öğrenciler 'deneyim tasarımı'nı güncel bir moda sanıyor; elli yıllık bir literatür olduğunu bilmek yaklaşımı değiştiriyor.");
}

{
  const s = slide("II · ATMOSFER", "Servicescape: fiziksel çevrenin üç boyutu");
  text(s, "Mary Jo Bitner 1992'de, hizmet verilen fiziksel çevreyi tanımlamak için 'servicescape' kavramını önerdi ve bu çevreyi üç boyuta ayırdı.\n\nBirincisi ortam koşullarıdır: ısı, ışık, ses, koku ve hava kalitesi. Bunlar çoğu zaman fark edilmez, ancak fark edilmedikleri hâlde ruh hâlini belirlerler.\n\nİkincisi mekân ve işlevdir: yerleşim düzeni, ekipman, mobilya ve bunların birbirleriyle ilişkisi. Bu boyut, mekânda ne yapabildiğimizi belirler.\n\nÜçüncüsü işaretler ve sembollerdir: tabelalar, dekor, malzeme seçimleri ve bunların taşıdığı anlam. Bir mermer zemin ile bir OSB zemin farklı şeyler söyler; bu, işlevsel değil sembolik bir farktır.\n\nBu üç boyut yalnızca müşteriyi değil, çalışanı da etkiler. Bitner'in modelinin önemli katkısı budur.");
  cite(s, "Bitner, M. J. (1992). Servicescapes: The Impact of Physical Surroundings on Customers and Employees. Journal of Marketing, 56(2), 57–71.");
  s.addNotes("Üçüncü boyutu (işaret ve semboller) örnekle açın: aynı ürünü satan iki mağazadan biri mermer, diğeri ham kontrplak kullanıyorsa, ikisi farklı şey söylüyordur.");
}

{
  const s = slide("II · ATMOSFER", "İnsan mekâna yaklaşır ya da ondan kaçınır");
  text(s, "Çevre psikolojisinde yaygın olarak kullanılan Mehrabian ve Russell modeli, mekânsal uyaranların davranışa nasıl dönüştüğünü açıklar. Model üç aşamalıdır: mekân bir uyaran sunar, insan buna duygusal olarak tepki verir, bu tepki de bir davranışa dönüşür.\n\nDuygusal tepki iki eksende ölçülür. Haz ekseni mekânın hoşa gidip gitmediğini, uyarılma ekseni ise mekânın ne kadar canlandırıcı ya da yatıştırıcı olduğunu tanımlar. Sonraki çalışmalarda bunlara bir üçüncü eksen, kontrol duygusu eklenmiştir.\n\nOrtaya çıkan davranış iki yönlüdür: yaklaşma ya da kaçınma. İnsan ya içeri girer, kalır, dolaşır ve etkileşime geçer; ya da girmez, kısa keser, çıkar.\n\nBuradan çıkan sonuç açıktır: nötr bir mekân yoktur. Hiçbir şey hissettirmemek de bir sonuçtur ve genellikle kaçınma yönünde çalışır.");
  cite(s, "Mehrabian, A. & Russell, J. A. (1974). An Approach to Environmental Psychology. MIT Press. / Tonin, P. E., Ferrara, M. & Nickel, E. (2026). Inclusive Sensory Design in Phygital Retail. IntechOpen.");
  s.addNotes("'Nötr mekân yoktur' cümlesi bu bölümün özeti. Öğrenciler çoğu zaman 'sade tuttum' diyerek kararsızlığı savunuyor; sadelik bir karardır, kararsızlık değil.");
}

{
  const s = slide("II · ATMOSFER", "Deneyim, kendi başına bir değer üretir");
  text(s, "Pine ve Gilmore 1998'de ekonomik değerin dört basamakta yükseldiğini öne sürdü: emtia, ürün, hizmet ve deneyim. Her basamakta müşterinin ödemeye razı olduğu bedel artar.\n\nSık verilen örnek kahvedir. Çuvaldaki kahve çekirdeği bir emtiadır. Paketlenip markalandığında ürün olur. Bir mekânda pişirilip sunulduğunda hizmet hâline gelir. İnsanlar oraya kahve için değil, mekânın kendisi için gitmeye başladığında ise deneyim olur.\n\nBu model mağaza tasarımı için doğrudan sonuç üretir. Mekân, ürünün üzerine değer ekleyebilen bir katmandır. Aynı ürün, farklı mekânlarda farklı şeydir.\n\nAncak modelin bir uyarısı da vardır: deneyim, üretilmiş bir gösteri değildir. Zorlama, ürünle ilgisiz ya da abartılı deneyim girişimleri genellikle ters teper.");
  cite(s, "Pine, B. J. & Gilmore, J. H. (1998). Welcome to the Experience Economy. Harvard Business Review, 76(4), 97–105.");
  s.addNotes("Son paragraf önemli. 'Deneyim' kelimesi öğrencilerde gereksiz teatral çözümlere yol açıyor; deneyimin ürünle ilişkili olması gerektiğini vurgulayın.");
}

quote("Mağaza atmosferi, bazı durumlarda satın alınan ürünün kendisinden daha etkilidir.",
      "Philip Kotler, 1973",
      "Kotler, P. (1973). Atmospherics as a Marketing Tool. Journal of Retailing, 49(4), 48–64.");

/* =========================================================
   III — MARKA VE MEKÂN
   ========================================================= */
opener("III", "Marka ve mekân", "Bir markanın ne olduğu, mekânda nasıl görünür hâle gelir.");

{
  const s = slide("III · MARKA VE MEKÂN", "Marka bir logo değildir");
  text(s, "Marka çoğu zaman bir logo, bir renk ya da bir yazı karakteriyle karıştırılır. Oysa marka, bir vaadin sürekli ve tutarlı biçimde tekrarlanmasıyla oluşur. Logo bu vaadin işaretidir, kendisi değildir.\n\nMağaza, markanın en zor sınavıdır. Çünkü bir reklam görselinden farklı olarak mekân, insanın bedeniyle içine girdiği bir şeydir. Marka 'özenli' olduğunu söylüyorsa, kapı kolunun ağırlığı bunu doğrulamak zorundadır. 'Erişilebilir' olduğunu söylüyorsa, koridor genişliği bunu yalanlamamalıdır.\n\nBu nedenle mağaza tasarımında marka analizi bir ön hazırlık değil, tasarımın kendisidir. Mekânsal kararların gerekçesi buradan gelir.\n\nMekânın reklama göre avantajı da budur. Reklam bir şey söyler; mekân o şeyi kanıtlamak zorundadır. İnsan marka ile mekân arasındaki çelişkiyi hemen fark eder, çoğu zaman nedenini adlandıramadan.");
  cite(s, "Wheeler, A. (2017). Designing Brand Identity. Wiley.");
  s.addNotes("Kapı kolu örneğini somutlaştırın. Marka-mekân tutarsızlığı öğrencilerin en sık düştüğü hatadır.");
}

{
  const s = slide("III · MARKA VE MEKÂN", "Marka kişiliği ve mekânsal karşılığı");
  text(s, "Markaları bir kişilik üzerinden tanımlamak, tasarım için işe yarar bir yöntemdir. Jennifer Aaker'ın geliştirdiği ve sonraki çalışmalarda perakende tasarımına uyarlanan modelde beş temel kişilik tipi tanımlanır.\n\nSamimiyet, dürüstlük ve gündelik yakınlık üzerine kurulur. Heyecan, canlılık, yenilik ve sürprize dayanır. Yetkinlik, güvenilirlik ve ustalık iddiasındadır. Sofistikelik, incelik ve ayrıcalık duygusu üretir. Sağlamlık ise dayanıklılık, doğa ve zorlu koşullarla ilişkilidir.\n\nBu tipler mekânsal olarak birbirinden ayrışır. Samimiyet düşük teşhir yoğunluğu, sıcak malzeme ve oturma alanı ister. Sofistikelik boşluk, kontrollü ışık ve az sayıda ürün ister. Sağlamlık ham malzeme, görünür yapı ve dayanıklı yüzeyler ister.\n\nBu bir formül değildir; bir düşünme çerçevesidir.");
  cite(s, "Xi, C. & Idris, M. Z. (2026). Omnichannel Fashion Retail Experience Design Informed by Brand Personality. Textile & Leather Review, 9, 1053–1119.");
  s.addNotes("Beş tipi tek tek sayarken sınıfta akla gelen markalarla eşleştirin. Bu, marka-mekân çevirisini somutlaştıran en hızlı yoldur.");
}

{
  const s = slide("III · MARKA VE MEKÂN", "Değerden mekânsal karara");
  text(s, "Marka analizinin işe yaraması için soyut değerlerin mekânsal karara dönüşmesi gerekir.\n\nBir marka 'şeffaf üretim' diyorsa üretimin görünür kılınması gerekir: açık atölye, cam bölme ya da mekânın ortasında duran bir tezgâh.\n\n'El yapımı, her biri tek' diyorsa ürünler tek tek sergilenir; yoğunluk düşer, her parçaya kendi ışığı verilir.\n\n'Herkes için erişilebilir' diyorsa ürün açık rafta ve elin ulaşabileceği yüksekliktedir; dolaşım serbest, kasa hızlıdır.\n\n'Yavaş ve sakin' diyorsa koridor genişler, ışık kontrastı düşer, oturulacak yer açılır.", { h: 3.35, size: 14, ls: 22 });  exampleRow(s, [
    ["Aesop", "Her mağazasında yerel malzeme ve yerel bir tasarımcı; markanın 'yere ait olma' vaadinin doğrudan mekânsal karşılığı."],
    ["Muji", "Ürünün sadeliği ile mekânın sadeliği aynı dili konuşur; ham ahşap, nötr ışık, düşük kontrast."],
    ["Camper", "Mağazaların farklı tasarımcılara verilmesi, markanın oyunculuk iddiasının mekânsal kanıtı."]
  ], 5.72);
  cite(s, "Wheeler, A. (2017). Designing Brand Identity. Wiley. / Quartier, K. et al. (2020).");
  s.addNotes("Sağdaki üç örnek dünyaca bilinen ve kolay bulunan görsellerdir. Her biri için birer mağaza fotoğrafı yeterli.");
}

/* =========================================================
   IV — MÜŞTERİ YOLCULUĞU
   ========================================================= */
opener("IV", "Müşteri yolculuğu ve mekânsal davranış", "İnsan mağazaya girdiğinde ne yapar, mekân bunu nasıl yönetir.");

{
  const s = slide("IV · MÜŞTERİ YOLCULUĞU", "Alışveriş bir an değil, bir dizidir");
  text(s, "Müşteri yolculuğu kavramı, alışverişi tek bir satın alma anı olarak değil, birbirini izleyen anların dizisi olarak ele alır. Bu anların her biri, markayla temas edilen bir nokta oluşturur.\n\nLemon ve Verhoef'in yaygın kabul gören çerçevesinde yolculuk satın alma öncesi, satın alma ve satın alma sonrası olarak üçe ayrılır. Mekân tasarımı açısından bu üç aşama daha ayrıntılı okunabilir: uzaktan fark etme, cepheye yaklaşma, eşikten geçme, yönünü bulma, ürünü tarama, ürünle etkileşime girme, ödeme ve ayrılma.\n\nBu anların her biri farklı bir tasarım sorusu üretir. Ve önemli olan tek tek anları iyileştirmek değil, aralarındaki geçişi kurmaktır. İyi bir mağaza, bu anları birbirine bağlar; kopuk iyi anlar bütünlüklü bir deneyim üretmez.");
  cite(s, "Lemon, K. N. & Verhoef, P. C. (2016). Understanding Customer Experience Throughout the Customer Journey. Journal of Marketing, 80(6), 69–96.");
  s.addNotes("Son cümleyi vurgulayın. Öğrenciler tek tek 'güzel köşeler' tasarlıyor; aralarındaki geçişi kurmuyorlar.");
}

{
  const s = slide("IV · MÜŞTERİ YOLCULUĞU", "Eşik: mekânın ilk cümlesi");
  text(s, "Eşik, dışarıdan içeriye geçilen andır ve mekânın en yoğun çalışan bölgesidir. Burada ışık düzeyi, ses düzeyi, sıcaklık, koku ve zemin malzemesi aynı anda değişir. İnsan bu değişimi bilinçli olarak fark etmez ama bedeni fark eder.\n\nPerakende literatüründe girişten sonraki ilk birkaç metre için 'geçiş bölgesi' terimi kullanılır. Bu aralıkta insanın dikkati henüz mekâna odaklanmamıştır; dışarının ışığına ve sesine göre ayarlanmış duyuları yeni ortama uyum sağlamaktadır. Bu nedenle bu bölgeye yerleştirilen ürün ya da bilgi genellikle görülmez.\n\nEşiğin ikinci işlevi haber vermektir. İnsan içeri girdiği anda nasıl bir yere girdiğini anlamalıdır. Bu bilgi tabelayla değil, atmosferle verilir.\n\nEşiği sınamanın en basit yolu tek bir soru sormaktır: bu kapıdan geçerken ne değişiyor? Cevap \"hiçbir şey\" ise, eşik henüz tasarlanmamış demektir.");
  cite(s, "Underhill, P. (2008). Why We Buy: The Science of Shopping. Simon & Schuster.");
  s.addNotes("Eşik konusu duyular bölümüne köprüdür. Beş duyunun aynı anda değiştiği tek an olduğunu söyleyin.");
}

{
  const s = slide("IV · MÜŞTERİ YOLCULUĞU", "Yönelme ve gezinme");
  text(s, "Eşikten sonra insanın ilk yaptığı şey yönünü bulmaktır. Bu, bilinçli bir okuma değil, hızlı bir tarama sürecidir; birkaç saniye içinde mekânın derinliği, çıkışın yeri ve gidilecek yön hakkında bir izlenim oluşur.\n\nYönlendirmenin ilk katmanı mekânsaldır. Görüş hatları, ışık farkları, tavan yüksekliğindeki değişimler ve zemin desenleri, insanı tabelaya ihtiyaç duymadan yönlendirir. İkinci katman grafiktir: tabelalar, etiketler, yön işaretleri. Grafik katman mekânsal katmanın yerini alamaz; onu tamamlar.\n\nGezinme aşamasında ise insan ürünleri tarar. Bu taramanın hızı ve derinliği, teşhir yoğunluğuna, yüksekliğe ve ürünler arasındaki hiyerarşiye bağlıdır. Her şeyin eşit derecede öne çıktığı bir düzende hiçbir şey öne çıkmaz.");
  cite(s, "Akyazıcı, A. O. & Yaşar, D. (2026). Disability-Specific Spatial Friction in Department Store Interiors. Buildings, 16(12), 2405.");
  s.addNotes("'Her şeyin eşit derecede öne çıktığı bir düzende hiçbir şey öne çıkmaz' — bu cümle hem teşhir hem pafta tasarımı için geçerli.");
}

{
  const s = slide("IV · MÜŞTERİ YOLCULUĞU", "Mekânsal davranışın bilinen örüntüleri");
  text(s, "Perakende gözlem araştırmaları, insanların mağaza içinde belirli örüntüler gösterdiğini ortaya koymuştur. Bunlar kesin kurallar değil, eğilimlerdir; ancak tasarım kararlarının başlangıç noktası olarak kullanılırlar.\n\nİnsanlar mağazaya girdikten sonra çoğunlukla sağa yönelirler. Bu nedenle girişin sağındaki ilk büyük yüzey, markanın kendini anlatmak için en güçlü fırsatıdır.\n\nGöz hizasına yakın yükseklikteki ürünler, daha yüksek ya da daha alçaktakilere göre belirgin biçimde daha fazla dikkat çeker. Bu bant, teşhir hiyerarşisinin merkezidir.\n\nDar geçitlerde insanlar durup incelemekten kaçınır; arkadan gelen biriyle temas riski, ilgilerini kesmelerine neden olur. Koridor genişliği bu nedenle yalnızca bir erişilebilirlik değil, aynı zamanda bir davranış meselesidir.");
  cite(s, "Underhill, P. (2008). Why We Buy: The Science of Shopping. Simon & Schuster.");
  s.addNotes("Underhill'in gözlem yöntemi (mağazada video ile müşteri izleme) öğrencilere ilginç gelir; kısaca anlatın.");
}

/* =========================================================
   V — DUYULAR
   ========================================================= */
opener("V", "Duyular", "Mekânı yalnızca gözle değil, bütün bedenle deneyimliyoruz.");

{
  const s = slide("V · DUYULAR", "Gözün tekeli");
  text(s, "Juhani Pallasmaa, mimarlık kültürünün görme duyusunu diğerlerinin önüne geçirdiğini, bunun da mekânı bedenden kopardığını savunur. Ona göre mimarlık yalnızca bakılan değil, dokunulan, duyulan, koklanan ve içinde hareket edilen bir şeydir.\n\nBu eleştiri mağaza tasarımı için özellikle anlamlıdır. Çünkü mağaza, insanın ürünle ve mekânla bedensel temas kurduğu, duyuların en yoğun ve en bilinçli biçimde devrede olduğu mekân tiplerinden biridir.\n\nDuyusal tasarım burada bir süsleme değildir. Işığın rengi ürünün rengini belirler, zeminin sesi mekânın hızını değiştirir, malzemenin dokusu markanın iddiasını doğrular ya da yalanlar. Duyular, tasarımın sonucu değil, aracıdır.");
  cite(s, "Pallasmaa, J. (2005). The Eyes of the Skin: Architecture and the Senses. Wiley. [Türkçesi: Tenin Gözleri, YEM Yayın]");
  s.addNotes("Bu, sunumun en önemli bölümünün açılışı. Pallasmaa'nın eleştirisini kısa tutun, hemen mağaza bağlamına bağlayın.");
}

{
  const s = slide("V · DUYULAR", "Atmosfer tek bir duyudan doğmaz");
  text(s, "Charles Spence ve arkadaşlarının mağaza atmosferi üzerine yaptığı derleme, duyusal etkinin tek tek uyaranlardan değil, uyaranların birlikte çalışmasından doğduğunu gösterir. Bir kokunun ya da bir müziğin etkisi, yanındaki diğer uyaranlarla uyumlu olup olmamasına bağlıdır.\n\nBu bulgunun en dikkat çekici yanı şudur: birbiriyle uyumsuz duyusal ipuçları, hiç olmamasından daha kötü sonuç verir. Uyumlu bir koku ve müzik birlikteliği memnuniyeti ve satın alma eğilimini artırırken, uyumsuz bir birliktelik değerlendirmeyi düşürür.\n\nBundan çıkan tasarım ilkesi açıktır. Duyusal katmanlar tek tek 'iyi' olmak zorunda değildir; birlikte aynı şeyi söylemek zorundadır. Rastgele eklenen etkileyici bir duyusal öğe, bütünü zayıflatır.");
  cite(s, "Spence, C., Puccinelli, N. M., Grewal, D. & Roggeveen, A. L. (2014). Store Atmospherics: A Multisensory Perspective. Psychology & Marketing, 31(7), 472–488.");
  s.addNotes("Bu, duyular bölümünün en önemli bulgusu. 'Uyumsuz duyusal ipucu, hiç olmamasından kötüdür' cümlesini not aldırın.");
}

sense("Görme", "IŞIK · RENK · KONTRAST · GÖRÜŞ HATTI",
"Görme, mağazada en çok çalışan duyudur; ancak mağaza tasarımında görme demek, biçim demek değildir. Görmeyi yöneten şey ışıktır.\n\nIşığın düzeyi mekânın hızını belirler: parlak ve düz aydınlatılmış bir mekânda insanlar daha hızlı hareket eder, kontrastlı ve yumuşak aydınlatılmış bir mekânda yavaşlar. Işığın rengi ürünün rengini doğrudan değiştirir; tekstilde ve gıdada bu, satın alma kararını belirleyen bir etkendir.\n\nKontrast ise dikkati yönetir. Bir ürünün öne çıkması, o ürüne daha çok ışık verilmesinden değil, çevresine daha az ışık verilmesinden doğar. Her yerin eşit aydınlatıldığı bir mekânda hiçbir ürün öne çıkmaz.\n\nGörüş hatları da bu duyunun parçasıdır: girişten bakıldığında mekânın derinliği okunmuyorsa, insan içeri girmekte tereddüt eder.",
[["Apple Store", "Şeffaflık, gün ışığı ve düşük kontrastlı düzgün aydınlatma."],
 ["Tiffany & Co.", "Ürünün küçük olduğu yerde vurgu ışığının nokta kullanımı."],
 ["Vakko", "Koyu zeminle yüksek kontrast; ürünün ışıkla tekil olarak öne çıkarılması."]],
"Spence, C. et al. (2014). Store Atmospherics. Psychology & Marketing, 31(7), 472–488.",
"Aydınlatma kontrastını gösteren bir vitrin fotoğrafı; aynı ürünün farklı renk sıcaklığında iki fotoğrafı.");
{ const s = p.getSlide ? null : null; }

sense("İşitme", "AKUSTİK · MÜZİK · SESSİZLİK",
"Ses, mağazada en az tasarlanan ve en çok şikâyet edilen duyudur. Oysa akustik, mekânın malzemesiyle doğrudan belirlenir: sert ve düz yüzeyler sesi yansıtır, gözenekli ve yumuşak yüzeyler yutar. Yüksek tavanlı, cam ve sert zeminli bir mekân, hiçbir müzik çalınmasa bile gürültülüdür.\n\nMüziğin temposu ve ses düzeyi, insanların mekânda kalma süresini ve hareket hızını etkiler. Hızlı tempolu ve yüksek müzik hareketi hızlandırır; yavaş ve düşük düzeyli müzik kalış süresini uzatır.\n\nAncak sesin en çok ihmal edilen boyutu sessizliktir. Deneme kabini, danışma noktası ve ödeme alanı gibi karar verilen yerlerde sesin düşmesi gerekir. Türkiye'de yapılan güncel bir araştırmada, engelli kullanıcıların en düşük puan verdiği boyut işitsel ve duyusal konfor olmuştur.",
[["Abercrombie & Fitch", "Yüksek müzik ve düşük ışığın bilinçli kullanımı; aynı zamanda en çok eleştirilen örnek."],
 ["Muji", "Düşük ses düzeyi ve yumuşak yüzeylerle kurulan sakin akustik."],
 ["Kitapçılar ve plak dükkânları", "Dinleme noktası ve sessiz bölge kurgusu."]],
"Akyazıcı, A. O. & Yaşar, D. (2026). Buildings, 16(12), 2405. / Spence, C. et al. (2014).",
"Akustik yüzey kullanılan bir mağaza içi; dinleme kabini olan bir plak dükkânı.");

sense("Dokunma", "MALZEME · DOKU · SICAKLIK · AĞIRLIK",
"Dokunma, mağazanın internete karşı en güçlü olduğu duyudur. İnsan ürünü eline aldığında ona karşı sahiplik duygusu geliştirir; dokunmaya izin veren teşhir düzenleri bu nedenle satın almayı artırır.\n\nMekân, dokunma iznini kendisi verir ya da geri alır. Açık raf 'dokun' der, cam dolap 'dokunma' der. Sözlü olmayan ama son derece net bir iletişimdir bu.\n\nDokunma ürünle sınırlı değildir. Kapı kolunun ağırlığı, tezgâhın sıcaklığı ve zeminin sertliği de dokunsal deneyimin parçasıdır; markanın iddiasını sessizce doğrular ya da yalanlar.\n\nDokunma aynı zamanda bir erişilebilirlik konusudur: görme engelli kullanıcılar için dokunsal yüzeyler ve haritalar, mekânı okunur kılan başlıca araçtır.",
[["IKEA", "Dokunsal yönlendirme ve dokunsal harita hizmeti; erişilebilirlik amaçlı dokunsal tasarım."],
 ["Mastercard Touch Card", "Kart üzerinde dokunsal çentikle ayırt etme; ödeme anında bağımsızlık."],
 ["Zanaat ve seramik atölyeleri", "Ürünün elle incelenmesi üzerine kurulu teşhir."]],
"Tonin, P. E., Ferrara, M. & Nickel, E. (2026). Inclusive Sensory Design in Phygital Retail. IntechOpen.",
"Açık raf ile cam dolabın yan yana göründüğü bir mağaza içi; dokunsal yüzey örneği.");

sense("Koklama", "KOKU · HAFIZA · KAYNAK",
"Koku, hafızaya en doğrudan bağlanan duyudur. Bir kokunun yıllar sonra bir mekânı hatırlatması, koku alma sisteminin bellek ve duygu merkezleriyle olan yakın bağından kaynaklanır. Bu nedenle koku, mağazanın hatırlanmasında güçlü bir araçtır.\n\nAncak koku tasarımı, mekâna bir difüzör yerleştirmek değildir. Etkili olan koku, kaynağı görünen kokudur: ürünün kendisi, kullanılan malzeme, taze bir yüzey ya da bir hazırlık tezgâhı. Kaynağı belirsiz yapay koku, çoğu insanda rahatsızlık yaratır.\n\nKokunun ikinci kuralı uyumdur. Spence'in derlemesinde gösterildiği gibi, kokunun etkisi müzikle ve mekânın genel diliyle uyumlu olup olmamasına bağlıdır. Uyumsuz bir koku, hiç koku olmamasından daha olumsuz bir etki üretir.\n\nÜçüncüsü ise ölçüdür: yoğun koku, koku hassasiyeti olan kullanıcılar için mekânı kullanılamaz hâle getirir.",
[["Lush", "Ürünün kendisinin koku kaynağı olması; ambalajsız teşhirin doğrudan sonucu."],
 ["Aesop", "Ürün denemesi için lavabo; kokunun deneyimlendiği tanımlı bir nokta."],
 ["Kahve kavurucuları ve fırınlar", "Üretim sürecinin kokusu; kaynağı görünen koku."]],
"Spence, C. et al. (2014). Store Atmospherics. Psychology & Marketing, 31(7), 472–488.",
"Lush vitrini; Aesop mağazasındaki lavabo detayı; açık kavurma makinesi.");

sense("Tat", "TADIM · İKRAM · AĞIZDA KALAN",
"Tat, mağaza tasarımında en dar kullanım alanına sahip duyudur; ancak kullanıldığı yerde etkisi çok güçlüdür. Gıda satan bir mekânda tadım, ürünle kurulan ilişkiyi anlatımdan deneyime taşır.\n\nTadımın mekânsal karşılığı vardır ve genellikle ihmal edilir. Bir tadım noktası bir tezgâh, bir lavabo, hijyen için bir alan, atık için bir çözüm ve insanların durabileceği bir boşluk gerektirir. Bu boşluk hesaplanmadığında tadım noktası dolaşımı tıkar.\n\nGıda dışı mağazalarda ise tat, ikram yoluyla dolaylı olarak devreye girer. Bir bardak çay ya da kahve, alışverişin süresini uzatan ve karşılıklılık duygusu üreten basit bir araçtır. Türkiye'de bu, çarşı geleneğinden gelen köklü bir alışkanlıktır.",
[["Zeytinyağı ve gurme gıda dükkânları", "Tadım tezgâhı, açık kap, ölçülü porsiyon."],
 ["Üçüncü dalga kahve dükkânları", "Demleme tezgâhının müşteriye açık konumlanması."],
 ["Kapalı Çarşı esnafı", "Çay ikramı; alışverişi bir karşılaşmaya dönüştüren geleneksel pratik."]],
"Krishna, A. (2012). An Integrative Review of Sensory Marketing. Journal of Consumer Psychology, 22(3), 332–351.",
"Bir tadım tezgâhı; açık demleme alanı olan bir kahve dükkânı.");

sense("Beden ve hareket", "ISI · HAVA · KOT · RİTİM · YOĞUNLUK",
"Beş duyunun dışında, mekânı bedenimizle algıladığımız bir katman daha vardır. Sıcaklık, hava akımı, kot farkı, tavan yüksekliğindeki değişim ve insan yoğunluğu, adı konmadan hissedilen ama davranışı doğrudan belirleyen etkenlerdir.\n\nSıcaklık farkı bir eşik aracıdır: dışarıdan içeriye geçerken hissedilen değişim, mekâna girildiğini bedene bildirir. Tavan yüksekliğindeki değişim mekânı bölmeden bölgelere ayırır; alçalan bir tavan yakınlık, yükselen bir tavan tören duygusu üretir.\n\nYoğunluk ise en güçlü etkendir. Kalabalık bir mekânda insanlar ürünü incelemeyi bırakır, hızlanır ve erken çıkar. Bu nedenle boşluk, tasarımın israfı değil aracıdır.\n\nKot farkları ve basamaklar bir ritim üretebilir; ancak bu ritim erişilebilirlik pahasına kurulmamalıdır.",
[["Sofistike moda mağazaları", "Az ürün ve çok boşlukla üretilen ayrıcalık duygusu."],
 ["Bedesten ve arasta", "Örtülü sokakta kot ve ışık değişimiyle kurulan ritim."],
 ["İndirim mağazaları", "Yüksek yoğunluğun bilinçli olarak erişilebilirlik sinyaline dönüştürülmesi."]],
"Bitner, M. J. (1992). Servicescapes. Journal of Marketing, 56(2), 57–71.",
"Tavan yüksekliği değişen bir mağaza kesiti ya da fotoğrafı.");

{
  const s = slide("V · DUYULAR", "Duyusal aşırılık: fazlası eksiği kadar sorunludur");
  text(s, "Duyusal tasarım denildiğinde akla çoğunlukla daha fazla uyaran eklemek gelir. Oysa güncel araştırmalar tersini gösteriyor: mağazalarda asıl sorun duyusal yoksunluk değil, duyusal aşırılıktır.\n\nİstanbul'da 105 engelli kullanıcıyla yürütülen güncel bir araştırmada, büyük mağaza iç mekânları beş boyutta değerlendirildi. En düşük puanı işitsel ve duyusal konfor aldı; yüksek müzik, anlaşılmayan anonslar ve genel duyusal yük en sık dile getirilen sorunlardı. Bilişsel engeli olan kullanıcılar bu boyuta beş üzerinden 2,34 puan verdi.\n\nAynı araştırmada görme engelli kullanıcılar için en sorunlu boyut görsel algı ve aydınlatma oldu; parlama, düşük kontrast ve okunamayan etiketler öne çıktı.\n\nBu bulgular tasarım için net bir sonuç üretir: her uyaranın bir gerekçesi olmalıdır. Gerekçesi olmayan uyaran, birileri için engeldir.");
  cite(s, "Akyazıcı, A. O. & Yaşar, D. (2026). Disability-Specific Spatial Friction in Department Store Interiors: A Mixed-Methods Study of Inclusive Retail Design. Buildings, 16(12), 2405.");
  s.addNotes("Bu slayt duyular bölümünü kapsayıcılık bölümüne bağlar. Araştırmanın Türkiye'de yapılmış olması öğrenciler için değerli; vurgulayın.");
}

quote("Duyusal tasarım bir estetik katman değil, hizmetin işleyen bir parçasıdır.",
      "Tonin, Ferrara & Nickel, 2026",
      "Tonin, P. E., Ferrara, M. & Nickel, E. (2026). Inclusive Sensory Design in Phygital Retail: Regulatory Guidelines Bridging Accessibility and Brand Experience. IntechOpen.");

/* =========================================================
   VI — IŞIK, MALZEME, TEŞHİR
   ========================================================= */
opener("VI", "Işık, malzeme, teşhir", "Atmosferi kuran üç somut araç.");

{
  const s = slide("VI · IŞIK, MALZEME, TEŞHİR", "Aydınlatma dört katmandan oluşur");
  text(s, "Mağaza aydınlatması tek bir genel ışıkla çözülemez. Uygulamada dört katman birlikte çalışır.\n\nGenel aydınlatma mekânın temel görülebilirliğini sağlar. Tek başına kullanıldığında mekân düz ve kimliksiz görünür.\n\nVurgu aydınlatması ürünü öne çıkarır. Etkisi mutlak parlaklıktan değil, çevresiyle arasındaki farktan doğar. Perakende uygulamasında vurgunun genel aydınlatmaya oranı genellikle üç ile beş kat arasında tutulur.\n\nDekoratif aydınlatma, kendisi bir nesne olan armatürlerden oluşur ve markanın kişiliğini taşır.\n\nVitrin aydınlatması ise dışarıdan okunur ve gündüz ile gece için ayrı hesaplanması gerekir; gündüz için tasarlanmış bir vitrin gece çoğunlukla çalışmaz.\n\nEn sık yapılan hata, aydınlatmayı görselleştirme aşamasında düşünmektir. Işık plan ve kesitle birlikte kurulur; tavan planında karşılığı olmayan bir ışık fikri henüz tasarlanmamıştır.");
  cite(s, "Petermans, A. & Van Cleempoel, K. (2009). Retail Design: Lighting as a Design Tool for the Retail Environment.");
  s.addNotes("Vurgu/genel oranını somut bir örnekle açın. Gece vitrini konusu özellikle atlanıyor.");
}

{
  const s = slide("VI · IŞIK, MALZEME, TEŞHİR", "Işığın niteliği: renk ve renk geriverimi");
  text(s, "Işığın miktarı kadar niteliği de önemlidir. Renk sıcaklığı, ışığın sıcak sarıya mı yoksa serin maviye mi yaklaştığını tanımlar ve mekânın duygusal tonunu belirler. Sıcak ışık yakınlık ve rahatlık, serin ışık netlik ve mesafe duygusu üretir.\n\nRenk geriverimi ise ışığın, nesnelerin gerçek rengini ne kadar doğru gösterdiğini ifade eder. Bu ölçüt tekstilde, gıdada ve kozmetikte belirleyicidir: düşük renk geriverimli bir ışık altında beğenilerek alınan bir kumaş, gün ışığında bambaşka görünür ve iade edilir.\n\nÜçüncü konu parlamadır. Yansıtıcı yüzeylerden ya da doğrudan görülen ışık kaynaklarından gelen parlama, hem konforu düşürür hem de etiket okumayı zorlaştırır. Güncel erişilebilirlik araştırmalarında parlama, görme engelli kullanıcıların en sık dile getirdiği sorunlar arasındadır.");
  cite(s, "Akyazıcı, A. O. & Yaşar, D. (2026). Buildings, 16(12), 2405. / Petermans, A. & Van Cleempoel, K. (2009).");
  s.addNotes("Renk geriverimi konusunu iade örneğiyle anlatın; öğrencilerde karşılığı olan somut bir durum.");
}

{
  const s = slide("VI · IŞIK, MALZEME, TEŞHİR", "Malzeme: dokunulan ve dokunulmayan");
  text(s, "Malzeme seçimi mağazada iki ayrı işlev görür. Bir yandan markanın dilini kurar, öte yandan günlük kullanımın yükünü taşır.\n\nBu nedenle malzemeleri iki gruba ayırmak işe yarar. Dokunulan yüzeyler — tezgâh, kapı kolu, korkuluk, raf — hem dokunsal niteliğiyle hem de aşınma ve temizlik davranışıyla seçilir. Dokunulmayanlar ise öncelikle görsel ve akustik rolleriyle değerlendirilir.\n\nÜçüncü ölçüt zamandır. Mağaza iç mekânları çok daha sık yenilenir; sökülebilirlik ve malzemenin ikinci bir kullanım ömrü artık estetik kadar önemli bir ölçüttür.", { h: 3.35, size: 14, ls: 22 });  exampleRow(s, [
    ["Muji", "Ham ahşap, nötr renk, düşük kontrast; ürün diliyle birebir örtüşen malzeme kararı."],
    ["Aesop", "Her mağazada yerel ve çoğu zaman geri kazanılmış malzeme kullanımı."],
    ["Pop-up mağazalar", "Sökülebilirlik ve yeniden kurulabilirlik üzerine kurulu malzeme sistemleri."]
  ], 5.72);
  cite(s, "Schittich, C. (Ed.) (2002). Interior Spaces: Space, Light, Material. Edition Detail.");
  s.addNotes("Sökülebilirlik konusu sürdürülebilirlik tartışmasının mağaza tasarımındaki en somut karşılığı.");
}

{
  const s = slide("VI · IŞIK, MALZEME, TEŞHİR", "Teşhir: ürünü anlaşılır kılmak");
  text(s, "Teşhir, ürünü göstermekten ibaret değildir; ürünü anlaşılır kılmaktır. Bir teşhir düzeni, ürünün ne olduğunu, kime hitap ettiğini ve diğer ürünlerle nasıl ilişkilendiğini aynı anda anlatır.\n\nTeşhir birimlerinin ölçüsünü ürünün kendisi belirler. Ürünün boyutu raf derinliğini, ağırlığı taşıyıcıyı, kırılganlığı açık raf ile kapalı dolap arasındaki seçimi, çeşit sayısı ise metrekare başına düşen yoğunluğu tanımlar.\n\nYoğunluğun kendisi de bir mesajdır. Az sayıda ürünün geniş boşluklarla sergilenmesi değer ve seçicilik duygusu üretirken, yoğun teşhir bolluk ve erişilebilirlik duygusu üretir. İkisi de doğrudur; yanlış olan, markanın iddiasıyla çelişen bir yoğunluk seçmektir.\n\nSon olarak teşhir esnek olmalıdır. Sezon, kampanya ve yeni ürün, mekânın yılda birkaç kez değişmesini gerektirir.");
  cite(s, "Mesher, L. (2010). Basics Interior Design: Retail Design. AVA Publishing.");
  s.addNotes("Yoğunluk-fiyat ilişkisi öğrencilerin en sık ıskaladığı konu: lüks marka seçip mekânı ürünle dolduruyorlar.");
}

/* =========================================================
   VII — FİZİKSEL VE DİJİTAL
   ========================================================= */
opener("VII", "Fiziksel ve dijital olanın iç içe geçmesi", "Teknoloji atmosferi değiştirmez; onu derinleştirir ya da bozar.");

{
  const s = slide("VII · FİZİKSEL VE DİJİTAL", "Mağaza artık tek bir kanal değil");
  text(s, "Bugün müşteri bir markayla birden çok kanaldan temas ediyor: sosyal medyada görüyor, internet sitesinde inceliyor, mağazada deniyor, tekrar internetten satın alıyor ya da tersini yapıyor. Literatürde bu duruma çok kanallılık, fiziksel ve dijital katmanların iç içe geçtiği duruma ise 'phygital' deniyor.\n\nBunun mağaza tasarımı açısından sonucu şudur: mağaza artık yolculuğun tamamı değil, bir parçasıdır. İnsan mağazaya geldiğinde ürünü çoğu zaman zaten biliyordur. O hâlde mağazanın işi bilgi vermek değil, ekranın veremediğini vermektir.\n\nDijital katman bu noktada bir yardımcıdır, amaç değildir. Ürünün stok durumunu gösteren bir ekran işe yarar; duvara asılmış ve kimsenin bakmadığı bir ekran, mekânın dikkatini dağıtır.");
  cite(s, "Xi, C. & Idris, M. Z. (2026). Omnichannel Fashion Retail Experience Design Informed by Brand Personality. Textile & Leather Review, 9, 1053–1119.");
  s.addNotes("'Mağaza yolculuğun tamamı değil bir parçasıdır' — bu, dijital katmanı doğru konumlandırmanın anahtarı.");
}

{
  const s = slide("VII · FİZİKSEL VE DİJİTAL", "Teknoloji atmosferin yerine geçmez");
  text(s, "Elli çalışmayı inceleyen güncel bir derleme, lüks moda mağazalarında teknolojinin nasıl kullanıldığını üç tema altında topladı: marka ve müşteri deneyimi, iç mekânın atmosferik nitelikleri ve teknoloji entegrasyonu.\n\nDerlemenin en dikkat çekici sonucu şudur: gelişmiş sistemler yaygınlaştıkça bile malzemenin, ışığın, sesin ve rengin anlatım gücü belirleyici olmaya devam ediyor. Dijital sistemler bu nitelikleri ikame etmiyor; onları derinleştiriyor ya da dönüştürüyor.\n\nAynı derleme bir uyarıda da bulunuyor. Teknolojinin başarılı entegrasyonu insan merkezli olduğunda gerçekleşiyor; mekânsal bütünlüğü ve anlatı sürekliliğini bozan teknoloji, deneyimi zenginleştirmiyor, dağıtıyor.\n\nBaşka bir deyişle: iyi çözülmemiş bir mekânı teknoloji kurtarmaz.");
  cite(s, "Ratnayake, J. C., Jayasuriya, N., Suraweera, T. & De Silva, L. (2026). Integrating Industry 4.0 and 5.0 Technologies in Luxury Fashion Retail Interiors: A Systematic Review. Social Sciences & Humanities Open, 13, 102798.");
  s.addNotes("Son cümle önemli: öğrenciler zayıf bir plan çözümünü dijital öğelerle örtmeye çalışıyor.");
}

{
  const s = slide("VII · FİZİKSEL VE DİJİTAL", "Somut olan, hayalî olandan güçlüdür");
  text(s, "Sanal gerçeklik tabanlı mağaza içi teşhirler üzerine yapılan çok çalışmalı bir deneysel araştırma, teknolojinin etkisinin teknik yetkinlikten çok tasarım mantığına bağlı olduğunu gösterdi.\n\nİki tür sanal teşhir karşılaştırıldı: bağlamsal teşhirler ürünü tanıdık ve kullanımla ilgili bir ortamda, hayalî teşhirler ise fantastik bir kurgu içinde sunuyordu.\n\nDört ayrı çalışma dizisinde bağlamsal teşhirler tutarlı biçimde daha güçlü tepki üretti. İnsanlar bir ürünü değerlendirirken onu nasıl kullanacaklarını hayal eder; ürünü tanıdık bir kullanım durumuna yerleştiren sunum bu işi kolaylaştırır.\n\nBulgu dijital olmayan teşhir için de geçerlidir: ürünü kullanım bağlamında gösteren bir düzen, onu soyut biçimde sergileyenden daha etkilidir.");
  cite(s, "Ishaq, M. I., Raza, A., Haider, A., Goudarzi, K. & Talpur, Q. (2026). Immersive Retail Technologies and Customer Experiences: A Multi-Study Experimental Design. Psychology & Marketing.");
  s.addNotes("Son paragraf bulguyu dijitalin ötesine taşıyor: manken, oda kurgusu, masa düzeni de aynı ilkeyle çalışır.");
}

/* =========================================================
   VIII — HERKES İÇİN MAĞAZA
   ========================================================= */
opener("VIII", "Herkes için mağaza", "Erişilebilirlik bir ek değil, tasarımın ölçütlerinden biridir.");

{
  const s = slide("VIII · HERKES İÇİN MAĞAZA", "Mekânsal sürtünme");
  text(s, "Erişilebilirlik çoğu zaman rampa, asansör ve tuvalet gibi teknik başlıklara indirgenir. Oysa mağaza iç mekânında zorluk üreten şeyler çok daha çeşitlidir ve çoğu görünmez.\n\nİstanbul'da 105 engelli kullanıcıyla yapılan güncel bir araştırma, bu durumu tanımlamak için 'mekânsal sürtünme' kavramını öneriyor. Kavram, mekânın yapısal koşullarının kullanıcının hareketini ve katılımını nasıl yavaşlattığını anlatıyor.\n\nAraştırmada beş boyut ölçüldü: erişilebilirlik ve algılanabilirlik, fiziksel dolaşım ve erişim konforu, işitsel ve duyusal konfor, görsel algı ve aydınlatma, personel yaklaşımı. Beş boyutun ortalaması 3,11 çıktı — yani ölçeğin tam ortasında.\n\nEn düşük iki boyut, işitsel ve duyusal konfor ile fiziksel dolaşımdı. En yüksek puanı ise personel yaklaşımı aldı; başka bir deyişle, mekânın çözemediğini insanlar telafi ediyor.");
  cite(s, "Akyazıcı, A. O. & Yaşar, D. (2026). Disability-Specific Spatial Friction in Department Store Interiors. Buildings, 16(12), 2405. İstanbul Aydın Üniversitesi.");
  s.addNotes("Son cümleyi vurgulayın: 'mekânın çözemediğini insanlar telafi ediyor.' Bu, tasarımcı için doğrudan bir eleştiridir.");
}

{
  const s = slide("VIII · HERKES İÇİN MAĞAZA", "Farklı kullanıcı, farklı engel");
  text(s, "Aynı araştırmanın önemli bir bulgusu, engelin tek tip olmadığıdır. Farklı engel gruplarının aynı mekânda karşılaştığı zorluklar birbirinden belirgin biçimde ayrışıyor.\n\nGörme engelli kullanıcılar için en sorunlu boyut görsel algı ve aydınlatma oldu; parlama, saydam yüzeyler, düşük kontrast ve okunamayan etiketler öne çıktı. Bilişsel engeli olan kullanıcılar için en sorunlu boyut işitsel ve duyusal konfordu; yüksek ses düzeyi ve genel duyusal yük belirleyiciydi. Fiziksel engeli olan kullanıcılar için ise dar geçitler, yoğunluk ve düşey erişim öne çıktı.\n\nBu ayrışma, tek bir 'erişilebilir mağaza' reçetesinin mümkün olmadığını gösteriyor. Ortalamalara göre tasarlamak, en çok zorlanan kullanıcıyı görünmez kılıyor.\n\nAraştırmada en sık tekrarlanan tek sorun ise yönlendirme ve uyarı işaretlerinin yetersizliğiydi.");
  cite(s, "Akyazıcı, A. O. & Yaşar, D. (2026). Buildings, 16(12), 2405.");
  s.addNotes("Bu slayt evrensel tasarım söyleminin yüzeyselliğine karşı iyi bir panzehir: farklı gruplar farklı şeylerden zorlanıyor.");
}

{
  const s = slide("VIII · HERKES İÇİN MAĞAZA", "Dört ilke");
  text(s, "Avrupa Erişilebilirlik Yasası'nı temel alan güncel bir çalışma, duyusal erişilebilirlik için dört performans ilkesi öneriyor. Bu ilkeler kesin sayısal eşikler koymuyor; markanın anlatım özgürlüğünü koruyarak katılımı güvence altına almayı amaçlıyor.\n\nAnlamlı uyaran ilkesi, her duyusal uyaranın açık bir işlevi ya da anlatımsal amacı olmasını, gereksiz yoğunluk üretmemesini gerektirir.\n\nSeçim ve kontrol ilkesi, temel hizmetlere birden çok yoldan ulaşılabilmesini ister; sakinleştirilmiş bir mod, personel desteği ya da alternatif bir kanal.\n\nÖngörülebilirlik ve şeffaflık ilkesi, duyusal koşulların önceden bildirilmesini savunur; sakin saatler gibi bilgiler ziyaretin planlanmasını sağlar. Dördüncü ilke ise fiziksel ve dijital kanallar arasında eşdeğerliktir.");
  cite(s, "Tonin, P. E., Ferrara, M. & Nickel, E. (2026). Inclusive Sensory Design in Phygital Retail: Regulatory Guidelines Bridging Accessibility and Brand Experience. IntechOpen.");
  s.addNotes("'Anlamlı uyaran' ilkesi duyular bölümüyle doğrudan bağlantılı: gerekçesi olmayan uyaran, birileri için engeldir.");
}

{
  const s = slide("VIII · HERKES İÇİN MAĞAZA", "Uygulanmış örnekler");
  text(s, "Duyusal erişilebilirlik soyut bir ideal değildir; büyük perakendecilerde uygulanmış karşılıkları vardır. Aşağıdaki dört örnek üç farklı stratejiyi temsil ediyor: uyaranı azaltma, uyaranı çoğaltma ve etkileşimi çok kanallı kılma.\n\nDikkat çekici olan, hiçbirinin markanın kimliğinden ödün vermemesidir. Sakin saat uygulaması mağazanın tasarımını değiştirmez, yalnızca belirli saatlerde uyaran düzeyini düşürür. Dokunsal harita mekânı bozmaz, ona bir okuma katmanı ekler.\n\nDers şudur: erişilebilirlik çoğu zaman mekânı yeniden kurmayı değil, mekâna seçenek eklemeyi gerektirir.", { h: 3.35, size: 14, ls: 22 });  exampleRow(s, [
    ["Tesco", "Sakin saat: belirli saatlerde müzik ve anonsların kapatılması, ışığın kısılması."],
    ["Walmart", "Duyusal dostu saatler: aynı yaklaşımın büyük ölçekte, düzenli bir protokol olarak uygulanması."],
    ["IKEA", "Dokunsal yönlendirme ve dokunsal harita hizmeti."],
    ["Mastercard Touch Card", "Kartta dokunsal çentik; ödeme anında bağımsızlık."]
  ], 5.72, 4);
  cite(s, "Tonin, P. E., Ferrara, M. & Nickel, E. (2026). IntechOpen.");
  s.addNotes("Bu dört örnek makalede belgesel vaka olarak inceleniyor. Görsel bulmak kolay.");
}

/* =========================================================
   IX — ÖRNEKLER
   ========================================================= */
opener("IX", "Örnekler", "Dünyadan ve Türkiye'den okunabilir mağaza örnekleri.");

{
  const s = slide("IX · ÖRNEKLER", "Dünyadan — mekânı fikir üzerine kuranlar");
  exampleRow(s, [
    ["Prada Epicenter, New York (OMA, 2001)", "Mağazayı bir kültür mekânı gibi ele alan, dalga biçimli ahşap zeminiyle satış alanını sahneye dönüştüren erken ve etkili bir örnek."],
    ["Dover Street Market, Londra", "Farklı markaların kendi kurdukları stantlarla bir arada bulunduğu, düzenli olarak yeniden kurulan 'güzel kaos' fikri."],
    ["Gentle Monster, Seul", "Gözlük satan mekânı büyük ölçekli enstalasyonlarla kuran, ürünü neredeyse arka plana iten radikal bir yaklaşım."],
    ["Aesop", "Her mağazasının yerel bir tasarımcıyla ve yerel malzemeyle kurulması; markanın tekil bir mağaza tipi olmaması."]
  ], 2.05, 2);
  cite(s, "Klanten, R., Ehmann, S. & Borges, S. (Eds.) (2013). Brand Spaces: Branded Architecture and the Future of Retail Design. Gestalten.");
  s.addNotes("Her örnek için bir iç mekân fotoğrafı yeterli. Prada Epicenter'ın dalga zemini ve Gentle Monster'ın enstalasyonları en çarpıcı görseller.");
}

{
  const s = slide("IX · ÖRNEKLER", "Dünyadan — sadelikle ve duyularla kuranlar");
  exampleRow(s, [
    ["Muji", "Malzeme, ışık ve ürün dilinin tek bir sadelik fikrinde buluşması; markanın felsefesinin mekânda birebir görünmesi."],
    ["Apple Store", "Şeffaflık, gün ışığı ve ürünün dokunmaya açık sunumu; teşhirin neredeyse tamamen ortadan kaldırılması."],
    ["Lush", "Ambalajın kaldırılmasıyla kokunun mekânın ana malzemesi hâline gelmesi; duyusal kimliğin ürün kararından doğması."],
    ["Camper", "Mağazaların farklı tasarımcılara açılması; tek bir kurumsal şablon yerine çoğulluk üzerine kurulu bir marka mekânı stratejisi."]
  ], 2.05, 2);
  cite(s, "Quartier, K., Petermans, A., Melewar, T. C. & Dennis, C. (Eds.) (2021). The Value of Design in Retail and Branding. Emerald.");
  s.addNotes("Lush örneği duyular bölümüne geri bağlanır: koku bir eklenti değil, ürün kararının sonucudur.");
}

{
  const s = slide("IX · ÖRNEKLER", "Türkiye'den — gelenek ve tipoloji");
  exampleRow(s, [
    ["Kapalı Çarşı ve Mısır Çarşısı, İstanbul", "Bedesten, arasta ve han tiplerinin zaman içinde birbirine eklenmesiyle oluşan, hâlâ çalışan bir ticaret mekânı örgüsü."],
    ["Beyoğlu pasajları — Çiçek Pasajı, Hazzopulo, Atlas", "On dokuzuncu yüzyıl Avrupa pasajının yerel yorumları; sokakla iç mekân arasındaki ara tipoloji."],
    ["Arasta ve bedestenler — Bursa, Edirne, Antalya", "Aynı işi yapan esnağın bir arada dizildiği, ışığı ve ritmi üstten kurgulanan örtülü ticaret sokağı."],
    ["Sümerbank ve Yeni Karamürsel mağazaları", "Türkiye'de büyük mağaza deneyiminin ilk yaygın örnekleri; sabit fiyat ve serbest dolaşımın yerleşmesi."]
  ], 2.05, 2);
  cite(s, "Cezar, M. (1983). Tipik Yapılarıyla Osmanlı Şehirciliğinde Çarşı ve Klasik Dönem İmar Sistemi. Mimar Sinan Üniversitesi Yayınları.");
  s.addNotes("Öğrencilere bu tipolojileri gidip görmelerini önerin. Arasta ve bedesten, ışık ve ritim açısından çok öğretici.");
}

{
  const s = slide("IX · ÖRNEKLER", "Türkiye'den — güncel mağaza tasarımı");
  exampleRow(s, [
    ["Vakko Fashion Center, İstanbul (REX, 2010)", "Marka merkezi ile mağaza deneyimini birleştiren, cam kutu strüktürüyle tanınan güncel bir örnek."],
    ["Armaggan, Nuruosmaniye", "Türk zanaatını çok katlı bir mekânda sergi ve satış arasında konumlandıran, teşhir dili güçlü bir kurgu."],
    ["Paşabahçe Mağazaları", "Cam ürününün kırılganlığı ve saydamlığı üzerine kurulmuş teşhir ve aydınlatma yaklaşımı."],
    ["Bağımsız butikler — Karaköy, Çukurcuma, Alaçatı", "Küçük ölçekli, yerel malzemeli ve çoğu zaman tek mekânlık tasarımlar; öğrenci projeleri için en yakın ölçek."]
  ], 2.05, 2);
  cite(s, "Türkiye örnekleri için: Arkitera ve XXI Mimarlık Dergisi arşivleri.");
  s.addNotes("Son madde önemli: öğrencilerin tasarlayacağı ölçek burasıdır, amiral gemisi mağazalar değil.");
}

/* =========================================================
   KAPANIŞ
   ========================================================= */
{
  const s = p.addSlide();
  s.background = { color: INK };
  s.addText("Toparlarsak", {
    x: M, y: 1.0, w: 10.5, h: 0.7, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 30, bold: true, color: ACC
  });
  s.addText("Mağaza tasarımı, bir markanın ne olduğunu anlayıp onu insanların bedeniyle karşılaşacağı bir mekâna çevirme işidir.\n\nBu çeviri gözle sınırlı değildir. Işık, malzeme, ses, koku ve mekânın insana verdiği bedensel hisler birlikte çalışır; ve ancak birbirleriyle uyumlu olduklarında bir anlam üretirler.\n\nDuyusal tasarım bir süsleme katmanı değil, mekânın işleyen bir parçasıdır. Her uyaranın bir gerekçesi olmalıdır — çünkü gerekçesi olmayan uyaran, birileri için engeldir.\n\nVe iyi bir mağaza yalnızca müşterinin gördüğü yer değildir. Çalışanın günü, deponun rotası ve herkesin erişebilirliği de aynı tasarımın parçasıdır.", {
    x: M, y: 1.95, w: 11.4, h: 4.7, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 16, color: "E8E8EC", lineSpacing: 27
  });
  n += 1;
  s.addNotes("Kapanışı yavaş okuyun. Bu dört paragraf sunumun tamamının özetidir.");
}

/* ---------- kaynakça ---------- */
function refslide(title, refs) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  label(s, "KAYNAKÇA");
  s.addText(title, {
    x: M, y: 0.92, w: 11.2, h: 0.6, isTextBox: true, margin: 0,
    fontFace: H, fontSize: 26, bold: true, color: INK
  });
  const half = Math.ceil(refs.length / 2);
  refs.forEach((r, i) => {
    const col = i < half ? 0 : 1;
    const row = i < half ? i : i - half;
    s.addText(r, {
      x: col === 0 ? M : C2, y: 1.82 + row * 1.02, w: CW, h: 0.95,
      isTextBox: true, margin: 0,
      fontFace: S, fontSize: 10.5, color: BODY, lineSpacing: 14
    });
  });
  num(s);
  return s;
}

refslide("Güncel araştırmalar", [
  "Akyazıcı, A. O. & Yaşar, D. (2026). Disability-Specific Spatial Friction in Department Store Interiors: A Mixed-Methods Study of Inclusive Retail Design. Buildings, 16(12), 2405.",
  "Ishaq, M. I., Raza, A., Haider, A., Goudarzi, K. & Talpur, Q. (2026). Immersive Retail Technologies and Customer Experiences: A Multi-Study Experimental Design. Psychology & Marketing.",
  "Ratnayake, J. C., Jayasuriya, N., Suraweera, T. & De Silva, L. (2026). Integrating Industry 4.0 and 5.0 Technologies in Luxury Fashion Retail Interiors: A Systematic Review of Digital Transformation, Sensory Design, and Brand Storytelling. Social Sciences & Humanities Open, 13, 102798.",
  "Tonin, P. E., Ferrara, M. & Nickel, E. (2026). Inclusive Sensory Design in Phygital Retail: Regulatory Guidelines Bridging Accessibility and Brand Experience. IntechOpen.",
  "Xi, C. & Idris, M. Z. (2026). Omnichannel Fashion Retail Experience Design Informed by Brand Personality. Textile & Leather Review, 9, 1053–1119.",
  "Quartier, K., Claes, S. & Vanrie, J. (2020). A Holistic Competence Framework for (Future) Retail Design and Retail Design Education. Journal of Retailing and Consumer Services."
]);

refslide("Temel kaynaklar", [
  "Bitner, M. J. (1992). Servicescapes: The Impact of Physical Surroundings on Customers and Employees. Journal of Marketing, 56(2), 57–71.",
  "Cezar, M. (1983). Tipik Yapılarıyla Osmanlı Şehirciliğinde Çarşı ve Klasik Dönem İmar Sistemi. Mimar Sinan Üniversitesi Yayınları.",
  "Klanten, R., Ehmann, S. & Borges, S. (Eds.) (2013). Brand Spaces: Branded Architecture and the Future of Retail Design. Gestalten.",
  "Kotler, P. (1973). Atmospherics as a Marketing Tool. Journal of Retailing, 49(4), 48–64.",
  "Krishna, A. (2012). An Integrative Review of Sensory Marketing. Journal of Consumer Psychology, 22(3), 332–351.",
  "Lemon, K. N. & Verhoef, P. C. (2016). Understanding Customer Experience Throughout the Customer Journey. Journal of Marketing, 80(6), 69–96.",
  "Mehrabian, A. & Russell, J. A. (1974). An Approach to Environmental Psychology. MIT Press.",
  "Mesher, L. (2010). Basics Interior Design: Retail Design. AVA Publishing."
]);

refslide("Temel kaynaklar (devamı)", [
  "Pallasmaa, J. (2005). The Eyes of the Skin: Architecture and the Senses. Wiley. [Türkçesi: Tenin Gözleri: Mimarlık ve Duyular, YEM Yayın]",
  "Petermans, A. & Van Cleempoel, K. (2009). Retail Design: Lighting as a Design Tool for the Retail Environment.",
  "Pine, B. J. & Gilmore, J. H. (1998). Welcome to the Experience Economy. Harvard Business Review, 76(4), 97–105.",
  "Quartier, K., Petermans, A., Melewar, T. C. & Dennis, C. (Eds.) (2021). The Value of Design in Retail and Branding. Emerald.",
  "Schittich, C. (Ed.) (2002). Interior Spaces: Space, Light, Material. Edition Detail.",
  "Spence, C., Puccinelli, N. M., Grewal, D. & Roggeveen, A. L. (2014). Store Atmospherics: A Multisensory Perspective. Psychology & Marketing, 31(7), 472–488.",
  "Underhill, P. (2008). Why We Buy: The Science of Shopping (Rev. ed.). Simon & Schuster.",
  "Wheeler, A. (2017). Designing Brand Identity (5th ed.). Wiley.",
  "Zumthor, P. (2006). Atmospheres. Birkhäuser. [Türkçesi: Atmosferler]"
]);

p.writeFile({ fileName: "/tmp/claude-0/-home-user-sanat-ve-mekan/8e32618a-9471-5a88-afa8-31873b734ef0/scratchpad/Magaza-Tasarimi-Teorik-Sunum.pptx" })
 .then(f => console.log("WROTE", f, "| slides:", n));
