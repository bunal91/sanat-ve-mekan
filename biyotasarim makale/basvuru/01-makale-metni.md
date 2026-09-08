# Eşdeğer ısıl performans varsayımı altında biyo-esaslı yapı kabuğu malzemelerinin seçimi: kurgunun sonuç üzerindeki belirleyiciliği

## Öne çıkanlar

- Sabit ısıl geçirgenlik hedefi iklim bölgesine göre sıralama farkı üretmez
- Ağırlıklandırma yöntemi biyo-esaslı malzemeleri yönlü biçimde geriye iter
- Sistem sınırı birinci sırayı tüm bölgelerde değiştirir

## Highlights

- A fixed thermal transmittance target yields no climate-zone ranking difference
- The weighting method systematically disadvantages bio-based alternatives
- The system boundary changes the top-ranked material in every climate zone

## Özet

Biyo-esaslı yapı kabuğu malzemelerinin karşılaştırılmasında yaygın olarak eşdeğer ısıl performans kurgusu kullanılmakta, sonuçların iklim koşullarına göre değişeceği ise örtük olarak varsayılmaktadır. Bu çalışmada söz konusu kurgunun kendisi, TS 825:2024'ün altı derece gün bölgesi çerçevesinde sınanmıştır. On dört biyo-esaslı ve dört konvansiyonel alternatif, ısı iletkenliği, birim kütle, alansal ısıl kapasite, yaşam döngüsü karbonu, yangına tepki, yaşam sonu senaryosu, nem duyarlılığı ve duvar kalınlığı ölçütleriyle değerlendirilmiştir. Ağırlıklar entropi, CRITIC ve eşit ağırlık yöntemleriyle, sıralama TOPSIS ve VIKOR ile üretilmiştir. Üç sonuç elde edilmiştir. Sabit ısıl geçirgenlik hedefine dayalı kurgu, gerekli kalınlığın malzemeden bağımsız bir çarpanla ölçeklenmesi nedeniyle iklim bölgesine göre sıralama farkı üretememektedir; yuvarlama devre dışı bırakıldığında bölgeler arası sıra korelasyonu tam olarak birdir. Ağırlıklandırma yönteminin seçimi biyo-esaslı alternatiflerin sıralamadaki yerini yönlü biçimde belirlemektedir. Yaşam döngüsü sistem sınırının seçimi ise birinci sıradaki malzemeyi tüm bölgelerde değiştirmektedir. Bulgular, bir malzeme sıralamasının ancak onu üreten kurgu eksiksiz beyan edildiğinde yorumlanabileceğini göstermektedir.

**Anahtar Kelimeler:** Biyo-esaslı yalıtım, çok ölçütlü karar verme, yaşam döngüsü sistem sınırı, TS 825, ağırlıklandırma

## Abstract

Comparisons of bio-based building envelope materials commonly rely on an equivalent thermal performance framing, while implicitly assuming that results vary with climate. This study tests that framing itself within the six degree-day zones of TS 825:2024. Fourteen bio-based and four conventional alternatives are evaluated against thermal conductivity, unit mass, areal heat capacity, life-cycle carbon, reaction to fire, end-of-life scenario, moisture sensitivity and wall thickness. Weights are derived by entropy, CRITIC and equal weighting; rankings by TOPSIS and VIKOR. Three results are obtained. A framing based on a fixed thermal transmittance target cannot produce a climate-zone ranking difference, because the required thickness scales by a material-independent factor; with rounding disabled, the inter-zone rank correlation is exactly unity. The choice of weighting method determines the position of bio-based alternatives in a directional manner. The choice of life-cycle system boundary changes the top-ranked material in every zone. The findings show that a material ranking is interpretable only when the framing that produced it is fully declared.

**Keywords:** Bio-based insulation, multi-criteria decision making, life cycle system boundary, TS 825, weighting

---

## 1. GİRİŞ (INTRODUCTION)

Binalar, Türkiye'nin nihai enerji tüketiminde en büyük paylardan birine sahiptir; konut ve hizmet binaları 2023 yılında toplam nihai enerji tüketiminin yaklaşık üçte birini oluşturmuştur. Bu payın büyüklüğü, yapı kabuğunun ısıl performansını konfor meselesi olmaktan çıkarıp enerji politikasının doğrudan konusu hâline getirmektedir. TS 825 Binalarda Isı Yalıtımı Kuralları standardı 2024 yılında revize edilmiş, 20 Şubat 2025 tarihli tebliğle 1 Nisan 2025 itibarıyla zorunlu standart olarak yürürlüğe girmiştir [1]. Revizyon iki yapısal değişiklik getirmiştir: derece gün bölgesi sayısı dörtten altıya çıkarılmış ve binaların yalnızca ısıtma ihtiyacına göre tasarlanması dönemi sona ererek soğutma ihtiyacı da hesaba dâhil edilmiştir. Tavsiye edilen ısıl geçirgenlik değerleri iyileştirilmiş, yıllık enerji limitleri 120–150 kWh/m²·yıl düzeyinden 70–90 kWh/m²·yıl düzeyine çekilmiştir [2].

Bu düzenleyici değişim, yapı kabuğunda kullanılacak yalıtım malzemesinin seçimini yeniden gündeme getirmektedir. Gerekli yalıtım kalınlıklarının artması, malzeme başına düşen kütlenin ve dolayısıyla gömülü karbonun da artması anlamına gelir. İşletme enerjisi düştükçe bir yapı bileşeninin toplam yaşam döngüsü etkisi içinde gömülü karbonun payı görece büyümekte, bu da malzeme seçimini enerji verimliliği tartışmasının merkezine taşımaktadır [3].

Biyo-esaslı yapı malzemeleri bu noktada iki nedenle öne çıkmaktadır. Birincisi, üretim aşaması emisyonları mineral ve petrokimya esaslı muadillerine kıyasla düşüktür. İkincisi ve daha belirleyicisi, lignoselülozik yapıları nedeniyle büyüme sürecinde atmosferden aldıkları karbonu bileşen ömrü boyunca depolarlar [4]. Ne var ki biyojenik karbonun muhasebeleştirilmesi tartışmalıdır; depolamanın geçici olup olmadığı ve hangi zaman ufkunda hesaba katılacağı üzerine yöntem tartışması sürmektedir [5-7].

Literatürdeki ısı iletkenlik değerleri malzeme grubuna göre belirgin biçimde ayrışmaktadır. Lif keçelerinde λ = 0,031–0,046 W/mK aralığı raporlanmakta [8], koyun yünü kompozitlerinde ρ = 30–138,7 kg/m³ ve λ = 0,0324–0,0436 W/mK ölçülmüştür [9]. Ahşap lifi levhalarda λ = 0,038 W/mK ve c = 2100 J/kgK düzeyleri bildirilmektedir [10]. Tarımsal atık esaslı panellerde tablo belirgin biçimde değişir: ayçiçeği sapı özünden üretilen bağlayıcısız levhalarda λ = 0,038–0,042 W/mK gibi rekabetçi değerler elde edilirken [11], pirinç kavuzu esaslı levhalarda λ = 0,064–0,140 W/mK raporlanmaktadır [12, 13]. Miselyum kompozitleri bu grubun en oynak verili üyesidir; on dokuz çalışmayı derleyen bir inceleme λ değerlerinin 0,026–0,180 W/mK bandında dağıldığını göstermektedir [14, 15]. Bu tablo iki sonuca işaret eder: biyo-esaslı malzeme tek bir performans sınıfı değildir ve veri kalitesi malzemeye göre büyük ölçüde değişmektedir.

Yapı malzemesi seçimi, birbiriyle çatışan ölçütler içerdiği için çok ölçütlü karar verme yöntemlerinin yerleşik uygulama alanıdır. Yalıtım malzemelerinin sürdürülebilir seçimine odaklanan sistematik bir derleme, alanda ağırlıklı olarak AHP ile ağırlıklandırma ve TOPSIS ile sıralama yapıldığını ortaya koymaktadır [16]. Daha güncel çalışmalar bulanık gösterimler ve farklı yöntemleri de kullanmakta [17], dış duvar seçeneklerinin AHP, ANP ve TOPSIS ile karşılaştırıldığı örnekler bulunmaktadır [18]. Biyo-esaslı malzemelere odaklanan Avrupa ölçekli bir karar analizi, ahşap lifi ve mantarın farklı ağırlık senaryoları altında istikrarlı biçimde ilk sıralarda yer aldığını raporlamaktadır [19].

Ağırlıklandırma yönteminin sonuca etkisi bu literatürde bilinen bir konudur. Farklı ağırlıklandırma yöntemlerinin sıralamalar arasında kayda değer farklar ürettiği ve sonuçların güvenilirliğinin doğrudan ağırlıklandırmanın güvenilirliğine bağlı olduğu ifade edilmektedir [20, 21]. Objektif yöntemler içinde Shannon entropisi ve CRITIC en yaygın ikilidir; entropi karar matrisindeki yayılımı yüksek ölçütlere daha büyük ağırlık verirken, CRITIC standart sapmanın yanı sıra ölçütler arası korelasyonu da hesaba katar [22, 23]. Dolayısıyla bu çalışma, ağırlıklandırma yönteminin sonucu etkilediği biçiminde genel bir sav ileri sürmemektedir; ele alınan soru daha dar ve yönlüdür.

Bu çerçevede üç araştırma sorusu tanımlanmıştır. Birincisi, sabit ısıl geçirgenlik hedefine dayalı bir seçim modelinde altı derece gün bölgesi arasında sıralama farkı oluşup oluşmadığıdır. İkincisi, uygulanabilirlik kısıtı ve iklim dengesi modele dâhil edildiğinde bölge etkisinin hangi koşulda ortaya çıktığıdır. Üçüncüsü, ağırlıklandırma ve sistem sınırı seçimlerinin biyo-esaslı alternatiflerin sıralamadaki yerini ne ölçüde belirlediğidir. Çalışmanın amacı belirli bir malzemeyi en iyi ilan etmek değil, karşılaştırmada kullanılan kurgunun kendisini sınamaktır.

## 2. TEORİK METOT (THEORETICAL METHOD)

Çalışmanın genel akışı Şekil 1'de verilmiştir.

### 2.1. Fonksiyonel birim ve orantılılık önermesi

Karşılaştırma birimi, TS 825:2024'ün ilgili derece gün bölgesi için tavsiye ettiği ısıl geçirgenlik değerini sağlayan 1 m² dış duvar bileşenidir. Malzemeleri doğrudan ısı iletkenlik katsayısına göre karşılaştırmak yanıltıcı olur; eşdeğer ısıl performans koşulu her malzemenin farklı kalınlıkta kullanılmasını gerektirir ve bu fark kütleye, gömülü karbona ve kaybedilen kullanım alanına yansır. Toplam ısıl direnç, yalıtım katmanı ile diğer katmanların ve yüzeysel dirençlerin toplamıdır:

1/U_b = R_diğer + d/λ     (1)

Buradan, b bölgesinde m malzemesi için gereken yalıtım kalınlığı:

d_{m,b} = λ_m (1/U_b − R_diğer) = λ_m K_b     (2)

Eş. 2'deki K_b terimi yalnızca bölgeye bağlıdır ve malzemeden bağımsızdır. Kalınlık, uygulama gerçekliğine uygun olarak en yakın santimetreye yuvarlanmıştır.

**Önerme.** Karar matrisinin her sütunu ya bölgeden bağımsız bir malzeme özelliğidir ya da x_{m,b} = φ(m) K_b biçiminde yazılabilir. Bu koşulda, sütun bazlı ölçek değişimine duyarsız bir normalizasyon kullanan her sıralama yöntemi tüm bölgelerde özdeş sıralama üretir.

Kalınlıktan türeyen büyüklüklerin tamamı ortak K_b çarpanını taşır: birim kütle λρK_b, gömülü karbon λρεK_b, alansal ısıl kapasite λρcK_b ve kalınlık kaybı λK_b biçimindedir. Geriye kalan ölçütler malzeme özellikleridir ve bölgeye göre değişmez. TOPSIS'in vektörel normalizasyonunda j sütunu için:

r_{mj} = φ_j(m) K_b / [Σ_i φ_j(i)² K_b²]^(1/2) = φ_j(m) / [Σ_i φ_j(i)²]^(1/2)     (3)

K_b tam olarak sadeleşir ve normalize matris bölgeden bağımsız hâle gelir. Aynı sadeleşme VIKOR'un min-maks normalizasyonunda ve entropi ile CRITIC'in dayandığı normalize sütun istatistiklerinde de gerçekleşir; dolayısıyla ağırlıklar da bölgeye göre değişmez.

### 2.2. Alternatifler ve ölçüt seti

On dört biyo-esaslı ve dört konvansiyonel olmak üzere on sekiz alternatif değerlendirilmiştir (Çizelge 1). Konvansiyonel grup kıyas amacıyla dâhil edilmiş, biyo-esaslı olanın üstün olduğu varsayımı sınanmaksızın kabul edilmemiştir. Ölçüt seti Çizelge 2'de verilmiştir.

Isıl ve fiziksel özellikler hakemli kaynaklardan, gömülü ve biyojenik karbon ile yaşam sonu modülleri ÖKOBAUDAT veri tabanından alınmıştır [24]. Her hücre için kaynak ve 1–5 arası veri kalitesi puanı kaydedilmiştir. Veri tabanı kayıtları kg, m² ve m³ başına beyan edildiğinden birim normalizasyonu uygulanmış; beyan edilen birimi kütleye güvenle çevrilemeyen kayıtlar, çevrim çarpanı yer tutucu olan kayıtlar ve yalıtım sınıflandırması dışındaki ürünler elenmiştir.

Eksik değerler sıfıra çevrilmemiştir; sıfıra çevirme bir ölçütü görünmez biçimde etkisizleştirir. Eksik oranı %50'yi aşan ölçüt modelden çıkarılmıştır. Bu kural gereği gömülü karbon ve maliyet ölçütleri ana çalıştırmada yer almamış, model sekiz ölçütle yürütülmüştür. Gömülü karbonun etkisi, veri bakımından tam olan on bir alternatiflik alt küme üzerinde ayrıca incelenmiştir.

### 2.3. Hesap temelinin doğrulanması

Eş. 2'deki R_diğer parametresi bağımsız bir kaynakla kalibre edilmiştir. TS 825:2024 için yayımlanmış asgari yalıtım kalınlığı tablosu, dört il ve iki ısı iletkenlik değeri için sekiz veri noktası sunmaktadır [2]. R_diğer = 0,30 m²K/W alındığında hesaplanan kalınlıklar bu sekiz noktanın tamamıyla örtüşmektedir (Çizelge 3).

### 2.4. İklim verisi ve iklim dengesi

İklim verisi PVGIS servisinden alınmıştır [25]: aylık ortalama dış hava sıcaklıkları ERA5 kaynaklı, düşey yüzeylere gelen yön bazlı aylık ortalama ışınım şiddetleri PVGIS-SARAH2 kaynaklıdır; her ikisi de 2018–2020 ortalamalarıdır. Enerji hesabı, il–bölge eşleşmesi bağımsız olarak doğrulanabilen dört bölge için yürütülmüştür.

Her bölge için ısıtma derece günü (IDG) ve soğutma derece günü (SDG) hesaplanmış, soğutma payı σ_b = SDG/(IDG+SDG) olarak tanımlanmıştır. Isıtma tabanı 20 °C, soğutma tabanı 22 °C alınmıştır; 26 °C tasarım sıcaklığı aylık ortalamalarla birlikte kullanıldığında Türkiye'de nadiren aşıldığından anlamlı bir gradyan üretmemektedir.

### 2.5. Ağırlıklandırma ve iklim ayarı

Üç objektif yöntem karşılaştırmalı olarak kullanılmıştır. Shannon entropisinde normalize matris üzerinden e_j = −k Σ_m p_{mj} ln p_{mj} ve k = 1/ln n ile w_j ∝ 1 − e_j hesaplanır. CRITIC'te C_j = σ_j Σ_k (1 − ρ_{jk}) ile standart sapmanın yanı sıra ölçütler arası korelasyon da hesaba katılır. Eşit ağırlık w_j = 1/m kontrol kurgusudur. Uzman anketine dayalı subjektif ağırlıklandırma, yanıt havuzuna bağımlılığı ortadan kaldırmak ve tekrarlanabilirliği korumak amacıyla bilinçli olarak kullanılmamıştır.

Bölgeye bağlı ağırlık ayarı şu biçimdedir:

w′_j = w_j (1 + α s_j(b))     (4)

Burada alansal ısıl kapasite için s_j(b) = σ_b, nem duyarlılığı için s_j(b) = 1 − σ_b alınır; diğer ölçütlerde s_j = 0'dır. Gerekçe fizikseldir: ısıl kütle kazançların kullanılabilirliğini artırdığı için kazançların paya sahip olduğu bölgelerde anlamlıdır, yoğuşma ve küf riski ise ısıtma sezonunun uzunluğuyla ağırlaşır. Duyarlılık parametresi α temel çalıştırmada 1,0 alınmıştır. Eş. 4, K_b ile orantılı olmayan bir yapı ürettiği için 2.1'deki önermenin kapsamı dışındadır.

### 2.6. Sıralama ve uygulanabilirlik kısıtı

TOPSIS birincil yöntemdir; ağırlıklı normalize matris üzerinden ideal ve negatif ideal çözümlere Öklid uzaklıkları hesaplanarak yakınlık katsayısı C_m = d⁻_m/(d⁺_m + d⁻_m) elde edilir. VIKOR (v = 0,5) yöntem tutarlılığı kontrolü için kullanılmıştır. Sıralamalar Spearman sıra korelasyonu ile karşılaştırılmıştır.

Duvar bileşeninde uygulanabilir kabul edilen azami yalıtım kalınlığı aşıldığında alternatif, o bölge için uygun kümeden çıkarılmıştır. Temel çalıştırmada bu eşik 20 cm alınmıştır. Kısıt, Eş. 2 gereği bölgeye göre farklı alternatifleri elediğinden uygun küme bölgeye bağımlı hâle gelir.

### 2.7. Yaşam döngüsü sistem sınırı

Ürün beyanı modülleri kullanılarak üç sistem sınırı tanımlanmıştır [26]: S1 yalnızca A1–A3 modüllerini (beşikten kapıya, biyojenik alım dâhil), S2 buna C3 ve C4 modüllerini (beşikten mezara), S3 ise ek olarak D modülünü kapsar. Çifte sayımı önlemek için bu analizde gömülü karbon ve biyojenik karbon ayrı ölçüt olarak kullanılmamış, yerlerini tek bir yaşam döngüsü karbonu ölçütü almıştır.

Yaşam sonu senaryosunun sonucu ne ölçüde belirlediğini ölçmek için, C3 modülünde beyan edilen salımın gerçekleşen oranı φ bir duyarlılık parametresi olarak tanımlanmıştır. φ = 1 beyan edilen senaryoyu, φ = 0 depolanan biyojenik karbonun hiç salınmadığı sınır durumu temsil eder.

### 2.8. Referans konut ve aylık enerji hesabı

Doğrulama adımı, tam tanımlı temsili bir referans konut üzerinde yürütülmüştür: 24,0 × 12,0 m plan, beş kat, 2,80 m kat yüksekliği, 4032 m³ brüt hacim, 1440 m² şartlandırılmış döşeme alanı, 184,8 m² pencere alanı ve 0,393 A/V oranı. Binanın özgül ısı kaybı H = H_T + H_V biçiminde, iletim bileşeni H_T = U_D A_opak + U_P A_pencere + 0,8 U_T A_çatı + 0,5 U_t A_taban ve havalandırma bileşeni H_V = 0,33 A_f n_h olarak hesaplanmıştır.

Aylık net ısıtma ve soğutma enerjisi ihtiyaçları, kazanç ve kayıp kullanım faktörleri üzerinden belirlenmiştir [27]. Fonksiyonel birim sabit U hedefine dayandığı için yalıtım malzemesi değiştiğinde H değişmez; malzemenin yıllık enerjiye etki edebileceği tek yol ısıl kütlesi C üzerinden kullanım faktörüdür. Bu nedenle iki kurgu karşılaştırılmıştır: kullanım faktörünün zaman sabitinden bağımsız olduğu kurgu A ve zaman sabitine bağlı olduğu kurgu B (a = a₀ + τ/τ₀, τ = C/H).

## 3. SONUÇLAR VE TARTIŞMALAR (RESULTS AND DISCUSSION)

### 3.1. Orantılılık önermesinin sınanması

Yuvarlama devre dışı bırakıldığında, üç ağırlıklandırma ve iki sıralama yöntemi için altı bölge arasındaki Spearman sıra korelasyonu 1,000000; entropi ağırlıklarının bölgeler arası azami farkı 0,00 × 10⁰ çıkmıştır. Kalınlık en yakın santimetreye yuvarlandığında korelasyon 0,9938–1,0000 aralığına inmektedir. Gözlenen tüm sapmanın kaynağı yuvarlamadır; fiziksel bir bölge etkisi yoktur (Şekil 2).

Bu sonuç, birinci araştırma sorusunun cevabıdır: sabit ısıl geçirgenlik hedefine dayalı bir seçim modelinde bölgeler arası sıralama farkı oluşmaz. Bu, veriye bağlı bir gözlem değil, kurgunun analitik sonucudur.

### 3.2. Bölge etkisini üreten mekanizmalar

Derece gün değerleri bölgeler arasında tek yönlü ve düzgün bir gradyan göstermektedir (Çizelge 4). Uygulanabilirlik kısıtı, 1–4. bölgelerde eleme yapmazken 5. ve 6. bölgelerde dört alternatifi elemektedir: kenevir-kireç, saman balya, pirinç kavuzu paneli ve fındık kabuğu paneli. Elenenlerin tamamı yüksek ısı iletkenlikli, hacimli biyo-esaslı ürünlerdir.

Mekanizmaların sıralamaya etkisi Şekil 3'te verilmiştir. Ham modelde 1. ve 6. bölge arasındaki korelasyon 0,998 iken, uygulanabilirlik kısıtıyla 0,982'ye, iklim ayarlı ağırlıklandırmayla 0,567'ye inmektedir. Tam modelde değer 0,824'tür; bunun nedeni kısıtın ortak alternatif kümesini 18'den 14'e daraltması ve karşılaştırmanın bu daraltılmış küme üzerinden yapılmasıdır.

İkinci araştırma sorusunun cevabı buradadır: bölge etkisi, K_b ile orantılı olmayan bir yapı modele girdiğinde ortaya çıkar. Uygulamada bu, soğuk bölgelerde yüksek ısı iletkenlikli biyo-esaslı ürünlerin gereken duvar kalınlığı nedeniyle kullanılamaz hâle gelmesi biçiminde somutlaşmaktadır.

### 3.3. Ağırlıklandırma yönteminin etkisi

Ağırlıklandırma yöntemine göre en ağır ölçüt ve ilk üç sıra Çizelge 5'te verilmiştir. Entropi, ağırlığın yaklaşık üçte birini tek bir sıralı ölçüte, yangına tepki sınıfına vermektedir. Bu ölçütte mineral esaslı ürünler diğer alternatiflerden keskin biçimde ayrıldığı için, yayılıma duyarlı bir yöntem bu tek ölçüt üzerinden mineral yünleri öne çıkarmaktadır. CRITIC ve eşit ağırlık ise aynı tarımsal atık esaslı panelleri ilk sıralara koymaktadır.

Bulgu, doğrulanmış ürün beyanlarıyla çalışılan tam veri alt kümesinde de korunmaktadır. Bu alt kümede CRITIC'in de en ağır ölçütü yangına tepkidir, ancak payı %16,9'dur: CRITIC aynı ölçütü tanımakta, fakat tek başına egemen olmasına izin vermemektedir.

TOPSIS ve VIKOR sıralamaları arasındaki Spearman korelasyonu 0,350–0,509 düzeyindedir. Bu, sıralama yönteminin seçiminin de sonucu etkilediğini göstermekte ve tek bir sıralamanın doğru cevap olarak sunulmasını engellemektedir.

### 3.4. Sistem sınırının etkisi

Yaşam döngüsü modülleri incelendiğinde, biyo-esaslı malzemelerin A1–A3'te aldığı biyojenik karbonun C3'te yeniden salındığı görülmektedir. Altı malzemede alım ve salım ±0,04 kgCO₂e/kg içinde birbirini götürmektedir. Sistem sınırına göre yaşam döngüsü karbonu Çizelge 6'da, sıralama değişimi Şekil 4'te verilmiştir.

S1 sınırında biyo-esaslı malzemelerin çoğu karbon-negatif görünmekte ve sıralamanın başında yer almaktadır. C modülleri eklendiğinde birinci sıra altı bölgenin altısında da camyününe geçmektedir. Sınırlar arası Spearman korelasyonu S1–S2 için 0,758, S1–S3 için 0,697, S2–S3 için 0,939'dur. Etki, veri sürümü tutarsızlığı taşıyan iki kayıt çıkarıldığında güçlenmekte (0,758 → 0,333) ve üç ağırlıklandırma yönteminde de korunmaktadır.

Yaşam sonu senaryosunun duyarlılığı Şekil 5'te verilmiştir. CRITIC ağırlıklandırmasında camyününün birinci sıraya geçtiği salım oranı eşiği 0,51 ile 0,82 arasındadır; yani depolanan biyojenik karbonun yarısından fazlası yaşam sonunda salınmadıkça biyo-esaslı bir malzeme birinci sırada kalmaktadır. Eşik sıcak bölgelerde daha yüksektir, çünkü biyo-esaslı malzemeler orada ısıl kütle üzerinden ek bir üstünlük taşımakta ve daha büyük bir karbon yükünü soğurabilmektedir. Entropi ağırlıklandırmasında eşik her bölgede sıfırdır: camyünü salım oranından bağımsız olarak birinci sıradadır; bu, 3.3'teki bulgunun bir başka görünümüdür.

Bu sonuç, biyo-esaslı malzemelerin çevresel açıdan tercih edilmemesi gerektiği anlamına gelmez. C3 modülü enerji geri kazanımlı yakma senaryosunu yansıtmaktadır; düzenli depolama veya yeniden kullanım senaryolarında depolanan karbonun bir bölümü sistemde kalır, ancak depolamada oluşan metanın küresel ısınma potansiyeli de dikkate alınmalıdır. Bulgunun söylediği şey, yaşam sonu senaryosunun sonucu belirlediği ve varsayım olarak bırakılamayacağıdır. Bu da tartışmayı malzeme seçiminden atık yönetimi politikasına taşımaktadır.

### 3.5. Isıl kütlenin enerji ihtiyacına etkisi

Kurgu A'da, yani kullanım faktörünün zaman sabitinden bağımsız olduğu durumda, on sekiz alternatifin tamamı birebir aynı yıllık ısıtma enerjisi ihtiyacını vermektedir; malzemeler arası yayılım tam olarak sıfırdır. Bu beklenen sonuçtur: sabit U hedefi altında özgül ısı kaybı malzemeden bağımsızdır ve zaman sabitinden bağımsız bir kullanım faktörü ısıl kütleyi görmez.

Kurgu B'de fark oluşmaktadır. Referans konutun bölgelere göre enerji ihtiyacı ve ısıl kütlenin katkısı Çizelge 7'de, karşılaştırma Şekil 6'da verilmiştir. Isıl kütlenin en hafif ile en ağır alternatif arasında yarattığı yıllık enerji farkı 1,94 ile 2,89 kWh/m²·yıl arasındadır; bölgeler arası değişim yaklaşık 1,5 kattır.

Yüzdesel ifade yanıltıcıdır. Isıtma tarafında fark 1. bölgede %26,8'e ulaşmakta, 6. bölgede %3,7'ye inmektedir; ancak bu, ısıtma ihtiyacının 1. bölgede yalnızca 2,4 kWh/m²·yıl olmasından kaynaklanır. Aynı oran mutlak olarak 0,64 kWh/m²·yıl demektir. Karşılaştırmalarda mutlak değer kullanılmalıdır.

Dış ortam sıcaklığının iç tasarım sıcaklığını aştığı aylarda iletim de kazanç tarafına geçmekte ve kayıp kullanım faktörü uygulanamamaktadır; bu aylarda ısıl kütle hesaba hiç girmez. Aylık yarı-kararlı yöntemin öngörü sınırları literatürde de tartışılmıştır [28]. Bu, yöntemin ısıl kütleyi fiziksel katkısının en yüksek olduğu koşullarda görememesi anlamına gelir; doğru değerlendirme saatlik dinamik simülasyon gerektirir [29].

### 3.6. Bulguların birlikte değerlendirilmesi

Dört tespit birbirinden bağımsız yollarla elde edilmiş ancak aynı noktaya çıkmıştır: fonksiyonel birim kurgusu bölge etkisini analitik olarak imkânsız kılmakta, ağırlıklandırma yöntemi biyo-esaslı alternatiflerin yerini yönlü biçimde belirlemekte, sistem sınırı birinci sırayı değiştirmekte ve hesap yönteminin yapısı sonucun ne gösterebileceğini sınırlamaktadır. Ortak sonuç şudur: bir malzeme sıralaması, ancak onu üreten kurgu — fonksiyonel birim tanımı, ağırlıklandırma yöntemi, sıralama yöntemi ve sistem sınırı — eksiksiz beyan edildiğinde yorumlanabilir.

Bu, kararın zaman ufkuna ilişkin bir sonucu da beraberinde getirir. Yapı malzemesi seçim modellerinin ölçütleri geleneksel olarak insan konforu ve yatırımın geri dönüşü üzerinden, bina ömrüyle sınırlı bir ufukta tanımlanır. Hesabı A1–A3'te kesmek, malzemeyi bina kapısına kadar izleyip orada bırakmak demektir ve bu tercih biyo-esaslı malzemeleri karbon-negatif göstermektedir. Hesap malzemenin gerçek yaşam sonuna kadar uzatıldığında bu görüntü kaybolmaktadır. Ölçüt setini biyojenik karbon ve yaşam sonu senaryosuyla genişletmek kararı bina ömrünün ötesine taşımakta, ancak bu genişletme yalnızca sistem sınırı da buna uygun seçildiğinde anlamlı olmaktadır.

### 3.7. Sınırlılıklar

Ana çalıştırmada gömülü karbon ve maliyet ölçütleri eksik veri kuralı gereği yer almamaktadır; ısı iletkenliği verisinin ortalama kalite puanı 2,44/5'tir. Bu nedenle çalışmada üretilen malzeme sıralamaları göstergedir, yapısal bulgular ise veri kalitesinden bağımsızdır. Soğutma hesabı aylık yarı-kararlı yöntemle kurulmuş, gece havalandırması ve gölgeleme kontrolü modellenmemiştir. Enerji hesabı, il–bölge eşleşmesi doğrulanabilen dört bölgeyle sınırlıdır. Geometri, yönlenme ve A/V oranı duyarlılığı incelenmemiştir. Sistem sınırı analizi, doğrulanmış ürün beyanı bulunan on alternatifle sınırlıdır; tarımsal atık esaslı paneller ve miselyum kompozit bu analizin dışındadır.

## 4. SİMGELER (SYMBOLS)

A_f : şartlandırılmış döşeme alanı, m²
c : özgül ısı kapasitesi, J/kgK
C : etkin ısıl kapasite, J/K
C_m : TOPSIS yakınlık katsayısı, –
d : yalıtım kalınlığı, m
H : özgül ısı kaybı, W/K
IDG : ısıtma derece günü, °C·gün
K_b : bölgeye bağlı kalınlık çarpanı, m²K/W
n_h : hava değişim sayısı, m³/(h·m²)
R : ısıl direnç, m²K/W
SDG : soğutma derece günü, °C·gün
U : ısıl geçirgenlik katsayısı, W/m²K
w : ölçüt ağırlığı, –
α : iklim ayarı duyarlılık katsayısı, –
ε : birim kütle başına gömülü karbon, kgCO₂e/kg
η : kazanç veya kayıp kullanım faktörü, –
θ : sıcaklık, °C
λ : ısı iletkenlik katsayısı, W/mK
ρ : yoğunluk, kg/m³
σ_b : soğutma payı, –
τ : zaman sabiti, h
φ : yaşam sonu salım oranı, –

## 5. SONUÇLAR (CONCLUSIONS)

Bu çalışmada, biyo-esaslı yapı kabuğu malzemelerinin seçiminde kullanılan çok ölçütlü karar kurgusunun kendisi TS 825:2024 çerçevesinde sınanmıştır. Hesap temeli, yayımlanmış asgari yalıtım kalınlığı tablosunun sekiz veri noktasının tamamında doğrulanmıştır.

Sabit ısıl geçirgenlik hedefine dayalı kurgu, iklim bölgesine göre sıralama farkı üretememektedir. Gerekli kalınlık malzemeden bağımsız bir çarpanla ölçeklendiğinden, sütun bazlı ölçek değişimine duyarsız her normalizasyonda bu çarpan sadeleşmektedir; yuvarlama devre dışı bırakıldığında bölgeler arası sıra korelasyonu 1,000000'dır. Bölge etkisi ancak orantılılığı kıran yapılar modele eklendiğinde doğmaktadır: uygulanabilirlik kısıtı soğuk bölgelerde dört alternatifi elemekte, iklim dengesine bağlı ağırlıklandırma korelasyonu 0,998'den 0,567'ye indirmektedir.

Ağırlıklandırma yönteminin seçimi biyo-esaslı alternatiflerin sıralamadaki yerini yönlü biçimde belirlemektedir. Entropi, ağırlığın yaklaşık üçte birini tek bir sıralı ölçüte vererek mineral esaslı ürünleri öne çıkarmakta; CRITIC ve eşit ağırlık ise biyo-esaslı alternatifleri ilk sıralara koymaktadır.

Yaşam döngüsü sistem sınırının seçimi birinci sırayı tüm bölgelerde değiştirmektedir. Biyo-esaslı malzemelerin A1–A3'te depoladığı biyojenik karbon C3'te yeniden salınmakta, altı malzemede alım ile salım ±0,04 kgCO₂e/kg içinde birbirini götürmektedir. Biyo-esaslı üstünlük, depolanan karbonun yarısından fazlası salınmadıkça korunmaktadır.

Bulguların mevzuata dönük karşılığı, tavsiye edilen ısıl geçirgenlik değerleri koşulunda derece gün bölgesinin malzeme seçimini tek başına farklılaştırmadığı ve zaman sabitinden bağımsız bir kullanım faktörü kullanıldığında hesap yönteminin ısıl kütle farkını değerlendirme dışı bıraktığıdır.

Öncelikli gelecek çalışma yönleri, ısıl kütle etkisinin saatlik dinamik simülasyonla ölçülmesi, yaşam sonu senaryolarının kendi iklim etkileriyle modellenmesi ve Türkiye'ye özgü tarımsal atık esaslı yalıtım ürünleri için doğrulanmış ürün beyanı üretilmesidir.

## 6. TEŞEKKÜR (ACKNOWLEDGEMENT)

[Varsa proje desteği, kurum veya kişi teşekkürleri buraya yazılacaktır.]

---

## ÇİZELGELER (TABLES)

**Çizelge 1.** Değerlendirilen alternatifler
*(Table 1. Alternatives evaluated)*

| Kod | Malzeme | Grup | λ (W/mK) | ρ (kg/m³) |
|---|---|---|---|---|
| M01 | Ahşap lifi levha | Lifli levha | 0,038 | 50 |
| M02 | Kenevir lifi levha | Lifli levha | 0,040 | 40 |
| M03 | Keten lifi levha | Lifli levha | 0,038 | 35 |
| M04 | Koyun yünü | Lifli levha | 0,038 | 60 |
| M05 | Geri dönüşüm tekstil | Lifli levha | 0,039 | 35 |
| M06 | Selüloz (püskürtme) | Dökme/dolgu | 0,040 | 50 |
| M07 | Kenevir-kireç (hempcrete) | Dökme/dolgu | 0,060 | 330 |
| M08 | Saman balya | Dökme/dolgu | 0,060 | 100 |
| M09 | Genleştirilmiş mantar (ICB) | Kabuk/atık esaslı | 0,045 | 110 |
| M10 | Pirinç kavuzu paneli | Kabuk/atık esaslı | 0,070 | 400 |
| M11 | Ayçiçeği sapı özü paneli | Kabuk/atık esaslı | 0,040 | 75 |
| M12 | Şeker kamışı küspesi paneli | Kabuk/atık esaslı | 0,055 | 250 |
| M13 | Fındık kabuğu esaslı panel | Kabuk/atık esaslı | 0,060 | 300 |
| M14 | Miselyum esaslı kompozit | Büyütülmüş | 0,047 | 120 |
| R01 | EPS | Kıyas | 0,035 | 20 |
| R02 | XPS | Kıyas | 0,032 | 32 |
| R03 | Taşyünü | Kıyas | 0,037 | 29 |
| R04 | Camyünü | Kıyas | 0,035 | 20 |

**Çizelge 2.** Ölçüt seti ve yönleri
*(Table 2. Criteria set and optimisation directions)*

| Kod | Ölçüt | Birim | Yön |
|---|---|---|---|
| Ö1 | Isı iletkenliği | – | en küçük |
| Ö2 | Birim kütle | – | en küçük |
| Ö3 | Alansal ısıl kapasite | – | en büyük |
| Ö5 | Gömülü karbon | – | en küçük |
| Ö6 | Biyojenik karbon | – | en küçük |
| Ö7 | Yangına tepki | – | en büyük |
| Ö9 | Yaşam sonu senaryosu | – | en büyük |
| Ö10 | Nem/küf duyarlılığı | – | en küçük |
| Ö11 | Duvar kalınlığı kaybı | – | en küçük |

**Çizelge 3.** Hesaplanan yalıtım kalınlıklarının yayımlanmış tabloyla karşılaştırılması
*(Table 3. Calculated insulation thicknesses versus the published table)*

| İl (bölge) | U (W/m²K) | λ (W/mK) | Hesaplanan (cm) | Yayımlanmış (cm) |
|---|---|---|---|---|
| Antalya (1) | 0,45 | 0,035 | 7 | ≥ 7 |
| Antalya (1) | 0,45 | 0,040 | 8 | ≥ 8 |
| İstanbul (3) | 0,40 | 0,035 | 8 | ≥ 8 |
| İstanbul (3) | 0,40 | 0,040 | 9 | ≥ 9 |
| Ankara (4) | 0,35 | 0,035 | 9 | ≥ 9 |
| Ankara (4) | 0,35 | 0,040 | 10 | ≥ 10 |
| Erzurum (6) | 0,25 | 0,035 | 13 | ≥ 13 |
| Erzurum (6) | 0,25 | 0,040 | 15 | ≥ 15 |

**Çizelge 4.** Bölgelerin ısıtma ve soğutma derece günleri
*(Table 4. Heating and cooling degree days of the zones)*

| Bölge | Temsilci il | IDG (°C·gün) | SDG (°C·gün) | Soğutma payı |
|---|---|---|---|---|
| 1 · Aşırı Sıcak | Antalya | 1253 | 717 | %36,4 |
| 3 · Ilıman | İstanbul | 2001 | 164 | %7,6 |
| 4 · Soğuk | Ankara | 2933 | 81 | %2,7 |
| 6 · Aşırı Soğuk | Erzurum | 4985 | 0 | %0,0 |

**Çizelge 5.** Ağırlıklandırma yöntemine göre en ağır ölçüt ve ilk üç sıra
*(Table 5. Heaviest criterion and top three alternatives by weighting method)*

| Yöntem | En ağır ölçüt | Payı | 1. | 2. | 3. |
|---|---|---|---|---|---|
| Entropi | Ö7 Yangına tepki | %32,9 | Taşyünü | Camyünü | Kenevir-kireç (hempcrete) |
| CRITIC | Ö6 Biyojenik karbon | %17,6 | Pirinç kavuzu paneli | Fındık kabuğu esaslı panel | Şeker kamışı küspesi paneli |
| Eşit | Ö10 Nem/küf duyarlılığı | %18,2 | Pirinç kavuzu paneli | Fındık kabuğu esaslı panel | Kenevir-kireç (hempcrete) |

**Çizelge 6.** Sistem sınırına göre yaşam döngüsü karbonu (kgCO₂e/kg)
*(Table 6. Life-cycle carbon by system boundary)*

| Malzeme | S1 (A1–A3) | S2 (+C) | S3 (+C+D) |
|---|---|---|---|
| Selüloz (püskürtme) | -1,599 | 0,273 | -0,239 |
| Saman balya | -1,294 | 0,210 | 0,135 |
| Genleştirilmiş mantar (ICB) | -1,063 | 0,541 | 0,228 |
| Ahşap lifi levha | -1,017 | 0,760 | 0,239 |
| Koyun yünü | -0,832 | 0,775 | 0,475 |
| Geri dönüşüm tekstil | -0,358 | 1,242 | 0,864 |
| Kenevir lifi levha | 0,373 | 2,536 | 2,065 |
| Keten lifi levha | 0,890 | 3,053 | 2,583 |
| Camyünü | 1,079 | 1,086 | 1,033 |
| XPS | 3,188 | 6,880 | 5,497 |

**Çizelge 7.** Referans konutun enerji ihtiyacı ve ısıl kütlenin katkısı
*(Table 7. Energy demand of the reference dwelling and the contribution of thermal mass)*

| Bölge | Temsilci il | Q_H (kWh/m²) | Q_C (kWh/m²) | Toplam | Isıl kütle katkısı (kWh/m²) |
|---|---|---|---|---|---|
| 1 · Aşırı Sıcak | Antalya | 2,4 | 54,8 | 57,2 | 1,94 |
| 3 · Ilıman | İstanbul | 7,9 | 33,1 | 41,0 | 2,35 |
| 4 · Soğuk | Ankara | 16,8 | 28,9 | 45,6 | 2,56 |
| 6 · Aşırı Soğuk | Erzurum | 33,8 | 14,3 | 48,1 | 2,89 |

---

## ŞEKİL ALTI YAZILARI (FIGURE CAPTIONS)

Şekiller belgede ilgili yerlere yerleştirilecek; başlıklar şeklin altına konur.

**Şekil 1.** Model akış şeması
*(Figure 1. Model flow chart)*

**Şekil 2.** Gerekli yalıtım kalınlığının bölgeler arası oranı; kalın çizgi teorik oranı, ince çizgiler on sekiz alternatifin gerçekleşen oranını gösterir. Yayılımın tek kaynağı bir santimetreye yuvarlamadır
*(Figure 2. Inter-zone ratio of required insulation thickness; the bold line is the theoretical ratio and the thin lines the realised ratios of eighteen alternatives. The spread arises solely from rounding to one centimetre)*

**Şekil 3.** Mekanizmaların bölge etkisine katkısı; düşük korelasyon güçlü bölge etkisi anlamına gelir
*(Figure 3. Contribution of the mechanisms to the climate-zone effect; a lower correlation indicates a stronger zone effect)*

**Şekil 4.** Sistem sınırının sıralamaya etkisi (1. bölge, CRITIC ağırlıklandırma)
*(Figure 4. Effect of the system boundary on the ranking (zone 1, CRITIC weighting))*

**Şekil 6.** Isıl kütlenin enerji ihtiyacına etkisi: (a) mutlak katkı, (b) karşılaştırma tabanı olan toplam ihtiyaç
*(Figure 6. Effect of thermal mass on energy demand: (a) absolute contribution, (b) total demand as the basis of comparison)*

**Şekil 5.** Biyo-esaslı üstünlüğün kaybolduğu yaşam sonu salım oranı eşiği; eşiğin üzerinde camyünü birinci sıradadır
*(Figure 5. Threshold end-of-life release fraction at which the bio-based advantage disappears; above the threshold glass wool ranks first)*

## 7. KAYNAKLAR (REFERENCES)

1. TS 825, Binalarda Isı Yalıtımı Kuralları, Türk Standartları Enstitüsü, Ankara, 2024.
2. İZODER, TS 825 Binalarda Isı Yalıtımı Kuralları Standardı Revizyonu, basın bülteni, İstanbul, 21 Şubat 2025.
3. Morganti L., Vandi L., Astudillo Larraz J., García-Jaca J., Navarro Muedra A., Pracucci A., A1–A5 Embodied Carbon Assessment to Evaluate Bio-Based Components in Façade System Modules, Sustainability, 16, 3, 1190, 2024. doi:10.3390/su16031190
4. Hossain M.S., Therasme O., Crovella P., Volk T.A., Assessing the Environmental Impact of Biobased Exterior Insulation Panel: A Focus on Carbon Uptake and Embodied Emissions, Energies, 17, 14, 3406, 2024. doi:10.3390/en17143406
5. Matthews H.D., Zickfeld K., Koch A., Luers A., Accounting for the climate benefit of temporary carbon storage in nature, Nature Communications, 14(1), 5485, 2023. doi:10.1038/s41467-023-41242-5
6. Andersen C.E., Rasmussen F.N., Habert G., Birgisdóttir H., Embodied GHG Emissions of Wooden Buildings—Challenges of Biogenic Carbon Accounting in Current LCA Methods, Frontiers in Built Environment, 7, 729096, 2021. doi:10.3389/fbuil.2021.729096
7. Füchsl S., Huber J., Fröhling M., Röder H., Balancing the green carbon cycle — Biogenic carbon within life cycle assessment, The International Journal of Life Cycle Assessment, 30(10), 2300-2313, 2025. doi:10.1007/s11367-025-02469-0
8. Ye F., Wei H., Xiao Y., Berardi U., Quaranta G., Demartino C., Bio-based insulation materials in sustainable constructions: A review of environmental, thermal and acoustic insulation, durability, and mechanical performances, Renewable and Sustainable Energy Reviews, 223, 115872, 2025. doi:10.1016/j.rser.2025.115872
9. Dénes T., Iştoan R., Tǎmaş-Gavrea D.R., Manea D.L., Hegyi A., Popa F., Vasile O., Analysis of Sheep Wool-Based Composites for Building Insulation, Polymers, 14, 10, 2109, 2022. doi:10.3390/polym14102109
10. Ranefjärd O., Strandberg-de Bruijn P.B., Wadsö L., Hygrothermal Properties and Performance of Bio-Based Insulation Materials Locally Sourced in Sweden, Materials, 17, 9, 2021, 2024. doi:10.3390/ma17092021
11. Gößwald J., Barbu M., Petutschnigg A., Tudor E.M., Binderless Thermal Insulation Panels Made of Spruce Bark Fibres, Polymers, 13(11), 1799, 2021. doi:10.3390/polym13111799
12. Pavelek M., Adamová T., Bio-Waste Thermal Insulation Panel for Sustainable Building Construction in Steady and Unsteady-State Conditions, Materials, 12(12), 2004, 2019. doi:10.3390/ma12122004
13. Marín-Calvo N., González-Serrud S., James-Rivas A., Thermal insulation material produced from recycled materials for building applications: cellulose and rice husk-based material, Frontiers in Built Environment, 9, 1271317, 2023. doi:10.3389/fbuil.2023.1271317
14. Wildman J., Shea A., Walker P., Henk D., Extrinsic and intrinsic determinants of thermal conductivity in mycelium composites, Building Services Engineering Research &amp; Technology, 46, 3, 317-338, 2024. doi:10.1177/01436244241306631
15. Ashraf M.U., Hzami A., Alghamri R., Khattab T., Abu Rayash A., Systematic review of mycelium-based composites as sustainable insulators for carbon-neutral building envelopes, International Journal of Sustainable Engineering, 19, 1, 2665914, 2026. doi:10.1080/19397038.2026.2665914
16. Siksnelyte-Butkiene I., Streimikiene D., Balezentis T., Skulskis V., A Systematic Literature Review of Multi-Criteria Decision-Making Methods for Sustainable Selection of Insulation Materials in Buildings, Sustainability, 13, 2, 737, 2021. doi:10.3390/su13020737
17. Bajwa A.U.R., Siriwardana C., Shahzad W., Naeem M.A., Material selection in the construction industry: a systematic literature review on multi-criteria decision making, Environment Systems and Decisions, 45, 1, 8, 2025. doi:10.1007/s10669-025-10001-w
18. Theilig K., Vollmer M., Lang W., Albus J., Multi-criteria decision-making for energy building renovation: Comparing exterior wall structures with the AHP, ANP, utility analysis, and TOPSIS, Building and Environment, 280, 113075, 2025. doi:10.1016/j.buildenv.2025.113075
19. Pacheco-Torgal F., Chindaprasirt P., Comparative Performance of Bio-Based Construction Materials in Europe: A Multi-Criteria Decision Analysis, Sustainability, 18, 11, 5508, 2026. doi:10.3390/su18115508
20. Ayan B., Abacıoğlu S., Basilio M.P., A Comprehensive Review of the Novel Weighting Methods for Multi-Criteria Decision-Making, Information, 14, 5, 285, 2023. doi:10.3390/info14050285
21. Yıldız C., Binalarda Enerji Verimliliğinde Son Gelişmeler: Türkiye Örneği, Gazi Üniversitesi Fen Bilimleri Dergisi Part C: Tasarım ve Teknoloji, 12(1), 176-213, 2024. doi:10.29109/gujsc.1293759
22. YÜCE B.E., ACAR M.C., Bitlis İlinde Farklı Yakıtlar Ve Duvar Bileşenleri İçin Optimum Yalıtım Kalınlığı Ve Enerji Tasarrufunun Analizi, Bitlis Eren Üniversitesi Fen Bilimleri Dergisi, 10(4), 1426-1434, 2021. doi:10.17798/bitlisfen.959930
23. MIHLAYANLAR E., MERAL S., Mevcut Binalarda Enerji Verimli Yenileme ve EKB Uygulaması, Kırklareli Üniversitesi Mühendislik ve Fen Bilimleri Dergisi, 9(2), 478-497, 2023. doi:10.34186/klujes.1379762
24. ÖKOBAUDAT, Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen, çevrimiçi veri tabanı, https://www.oekobaudat.de, erişim: 5 Eylül 2026.
25. PVGIS, Photovoltaic Geographical Information System, Avrupa Komisyonu Ortak Araştırma Merkezi, https://re.jrc.ec.europa.eu/pvg_tools/en/, erişim: 5 Eylül 2026.
26. EN 15804, Sustainability of construction works — Environmental product declarations — Core rules for the product category of construction products, CEN, Brüksel, Belçika, 2019.
27. EN ISO 13790, Energy performance of buildings — Calculation of energy use for space heating and cooling, CEN, Brüksel, Belçika, 2008.
28. Yilmaz B.Ç., Acun Özgünler S., Yilmaz Y., A multi-criteria decision-making method for thermal insulation material selection in nZEB level questioned affordable multifamily housings, Journal of Building Physics, 47(6), 628-650, 2024. doi:10.1177/17442591241238440
29. Peng C., Feng D., Guo S., Material Selection in Green Design: A Method Combining DEA and TOPSIS, Sustainability, 13(10), 5497, 2021. doi:10.3390/su13105497
