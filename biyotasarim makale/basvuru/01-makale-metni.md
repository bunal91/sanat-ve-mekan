# Eşdeğer ısıl performans varsayımı altında biyo-bazlı yapı kabuğu malzemelerinin seçimi: kurgunun sonuç üzerindeki belirleyiciliği

## Öne Çıkanlar

- Sabit ısıl geçirgenlik hedefi tek başına iklim bölgesine göre sıralama farkı üretmez
- Bölge etkisi ancak uygulanabilirlik kısıtı gibi orantılılığı kıran yapılarla doğar
- Yaşam döngüsü sistem sınırı birinci sıradaki malzemeyi tüm bölgelerde değiştirir

## Öz

Biyo-bazlı yapı kabuğu malzemelerinin karşılaştırılmasında yaygın olarak eşdeğer ısıl performans kurgusu kullanılmakta, sonuçların iklim koşullarına göre değişeceği ise örtük olarak varsayılmaktadır. Bu çalışmada söz konusu kurgunun kendisi, TS 825:2024'ün altı derece gün bölgesi çerçevesinde sınanmıştır. On dört biyo-bazlı ve dört konvansiyonel alternatif; ısı iletkenliği, birim kütle, alansal ısıl kapasite, biyojenik karbon, yangına tepki, yaşam sonu senaryosu, nem duyarlılığı ve gerekli yalıtım kalınlığı ölçütleriyle değerlendirilmiştir. Ağırlıklar entropi, CRITIC ve eşit ağırlık yöntemleriyle, sıralama TOPSIS ve VIKOR ile üretilmiştir. Üç sonuç elde edilmiştir. Malzemeden bağımsız ve sabit bir katman direnci varsayımı altında kurulan sabit ısıl geçirgenlik kurgusu, gerekli kalınlığın malzemeden bağımsız bir çarpanla ölçeklenmesi nedeniyle iklim bölgesine göre sıralama farkı üretememektedir; yuvarlama devre dışı bırakıldığında bölgeler arası sıra korelasyonu tam olarak birdir. Bölge etkisi ancak orantılılığı kıran yapılar modele eklendiğinde ortaya çıkmakta, uygulanabilirlik kısıtı korelasyonu 0,990'dan 0,497'ye indirmektedir. Ağırlıklandırma yöntemi ile yaşam döngüsü sistem sınırının seçimi de sıralamayı belirlemekte, sistem sınırı birinci sıradaki malzemeyi incelenen tüm bölgelerde değiştirmektedir. Bulgular, bir malzeme sıralamasının ancak onu üreten kurgu eksiksiz beyan edildiğinde yorumlanabileceğini göstermektedir.

**Anahtar Kelimeler:** Biyo-bazlı yalıtım, çok ölçütlü karar verme, yaşam döngüsü sistem sınırı, TS 825, ağırlıklandırma

# Selection of bio-based building envelope materials under the equivalent thermal performance assumption: how the framing determines the result

## Highlights

- A fixed thermal transmittance target alone yields no climate-zone ranking difference
- A zone effect arises only through structures that break the proportionality
- The life cycle system boundary changes the top-ranked material in every zone

## Abstract

Comparisons of bio-based building envelope materials commonly rely on an equivalent thermal performance framing, while implicitly assuming that results vary with climate. This study tests that framing itself within the six degree-day zones of TS 825:2024. Fourteen bio-based and four conventional alternatives are evaluated against thermal conductivity, unit mass, areal heat capacity, biogenic carbon, reaction to fire, end-of-life scenario, moisture sensitivity and required insulation thickness. Weights are derived by entropy, CRITIC and equal weighting; rankings by TOPSIS and VIKOR. Three results are obtained. Under the assumption of a constant, material-independent resistance for the remaining layers, a framing based on a fixed thermal transmittance target cannot produce a climate-zone ranking difference, because the required thickness scales by a material-independent factor; with rounding disabled, the inter-zone rank correlation is exactly unity. A zone effect emerges only when structures that break this proportionality are added: the buildability constraint lowers the correlation from 0.990 to 0.497. The weighting method and the life cycle system boundary also govern the ranking, the latter changing the top-ranked material in every zone examined. The findings show that a material ranking is interpretable only when the framing that produced it is fully declared.

**Key Words:** Bio-based insulation, multi-criteria decision making, life cycle system boundary, TS 825, weighting

## 1. Giriş §(Introduction)§

Binalar, Türkiye'nin nihai enerji tüketiminde en büyük paylardan birine sahiptir; konut ve hizmet binalarının toplam nihai enerji tüketimindeki payı üçte bire yakındır [1]. Bu payın büyüklüğü, yapı kabuğunun ısıl performansını konfor meselesi olmaktan çıkarıp enerji politikasının doğrudan konusu hâline getirmektedir. Ulusal ısı yalıtımı standardının (TS 825) 2024 baskısı [2], 1 Nisan 2025'ten bu yana zorunlu uygulamadadır [3]. Bu baskı kendisinden önceki çerçeveden iki noktada ayrılır. Birincisi, ülkenin iklimsel ayrışması dört derece gün bölgesi yerine altı bölgeyle temsil edilmektedir. İkincisi, yıllık enerji dengesi artık yalnızca ısıtma üzerinden kurulmamakta, soğutma ihtiyacı da dengeye girmektedir. Tavsiye edilen ısıl geçirgenlik değerleri sıkılaştırılmış, izin verilen yıllık enerji tüketimi ise bina türüne ve bölgeye göre ayrışan daha düşük eşiklere bağlanmıştır [3, 4].

Bu düzenleyici değişim, yapı kabuğunda kullanılacak yalıtım malzemesinin seçimini yeniden gündeme getirmektedir. Gerekli yalıtım kalınlıklarının artması, malzeme başına düşen kütlenin ve dolayısıyla gömülü karbonun da artması anlamına gelir. İşletme enerjisi düştükçe bir yapı bileşeninin toplam yaşam döngüsü etkisi içinde gömülü karbonun payı görece büyümekte, bu da malzeme seçimini enerji verimliliği tartışmasının merkezine taşımaktadır [5]. Türkiye bağlamında optimum yalıtım kalınlığı ve enerji verimli yenileme çalışmaları da bu tartışmanın uygulamaya dönük tarafını oluşturmaktadır [6, 7].

Biyo-bazlı yapı malzemeleri bu noktada iki nedenle öne çıkmaktadır. Birincisi, üretim aşaması emisyonları mineral ve petrokimya esaslı muadillerine kıyasla düşük olabilmektedir; ancak bu, malzeme sınıfının değil tekil ürünün özelliğidir ve yetiştirme koşulları, bağlayıcı türü, kurutma ve presleme süreçleri ile taşıma mesafesine göre değişmektedir [8]. İkincisi ve daha belirleyicisi, bitkisel kökenli olanların büyüme sürecinde atmosferden aldıkları karbonu bileşen ömrü boyunca depolamalarıdır; bu mekanizma hayvansal (koyun yünü) ve fungal (miselyum) kökenli ürünler için aynı biçimde geçerli değildir [8]. Ne var ki biyojenik karbonun muhasebeleştirilmesi tartışmalıdır; depolamanın geçici olup olmadığı ve hangi zaman ufkunda hesaba katılacağı üzerine yöntem tartışması sürmektedir [9-11].

Literatürdeki ısı iletkenlik değerleri malzeme grubuna göre belirgin biçimde ayrışmaktadır. Lif keçelerinde λ = 0,031–0,046 W/mK aralığı raporlanmakta [12], koyun yünü kompozitlerinde ρ = 30–138,7 kg/m³ ve λ = 0,0324–0,0436 W/mK ölçülmüştür [13]. Ahşap lifi levhalarda λ = 0,038 W/mK ve c = 2100 J/kgK düzeyleri bildirilmektedir [14]. Tarımsal atık esaslı ürünlerde tablo belirgin biçimde değişir: kitosan bağlayıcılı ayçiçeği sapı kompozitlerinde ρ = 150–200 kg/m³ ile λ = 0,056–0,058 W/mK ölçülmüş [15], ladin kabuğu lifinden üretilen bağlayıcısız levhalarda benzer bir düzey raporlanmış [16], şeker kamışı küspesi levhalarında ise ρ ≈ 614 kg/m³ ile λ = 0,082 W/mK bulunmuştur [17]. Pirinç kavuzu esaslı levhalarda λ = 0,064–0,140 W/mK raporlanmaktadır [18, 19]. Miselyum kompozitleri bu grubun en oynak verili üyesidir; on dokuz çalışmayı derleyen bir inceleme λ değerlerinin 0,026–0,180 W/mK bandında dağıldığını göstermektedir [20, 21]. Bu tablo iki sonuca işaret eder: biyo-bazlı malzeme tek bir performans sınıfı değildir ve veri kalitesi malzemeye göre büyük ölçüde değişmektedir.

Yapı malzemesi seçimi, birbiriyle çatışan ölçütler içerdiği için çok ölçütlü karar verme yöntemlerinin yerleşik uygulama alanıdır. Yalıtım malzemelerinin sürdürülebilir seçimine odaklanan sistematik bir derleme, alanda ağırlıklı olarak AHP ile ağırlıklandırma ve TOPSIS ile sıralama yapıldığını ortaya koymaktadır [22]. Daha güncel çalışmalar bulanık gösterimler ve farklı yöntemleri de kullanmakta [23], dış duvar seçeneklerinin AHP, ANP ve TOPSIS ile karşılaştırıldığı örnekler bulunmaktadır [24]. Biyo-bazlı malzemelere odaklanan Avrupa ölçekli bir karar analizi, ahşap lifi ve mantarın farklı ağırlık senaryoları altında istikrarlı biçimde ilk sıralarda yer aldığını raporlamakta [25], yakın enerjili konutlar için yalıtım malzemesi seçimi de aynı çerçevede ele alınmaktadır [26].

Ağırlıklandırma yönteminin sonuca etkisi bu literatürde bilinen bir konudur. Farklı ağırlıklandırma yöntemlerinin sıralamalar arasında kayda değer farklar ürettiği ve sonuçların güvenilirliğinin doğrudan ağırlıklandırmanın güvenilirliğine bağlı olduğu ifade edilmektedir [27, 28]. Objektif yöntemler içinde Shannon entropisi ve CRITIC en yaygın ikilidir; entropi karar matrisindeki yayılımı yüksek ölçütlere daha büyük ağırlık verirken, CRITIC standart sapmanın yanı sıra ölçütler arası korelasyonu da hesaba katar [28, 29]. Dolayısıyla bu çalışma, ağırlıklandırma yönteminin sonucu etkilediği biçiminde genel bir sav ileri sürmemektedir; ele alınan soru daha dar ve yönlüdür.

Bu çerçevede üç araştırma sorusu tanımlanmıştır. Birincisi, sabit ısıl geçirgenlik hedefine dayalı bir seçim modelinde altı derece gün bölgesi arasında sıralama farkı oluşup oluşmadığıdır. İkincisi, uygulanabilirlik kısıtı ve iklim dengesi modele dâhil edildiğinde bölge etkisinin hangi koşulda ortaya çıktığıdır. Üçüncüsü, ağırlıklandırma ve sistem sınırı seçimlerinin biyo-bazlı alternatiflerin sıralamadaki yerini ne ölçüde belirlediğidir. Çalışmanın amacı belirli bir malzemeyi en iyi ilan etmek değil, karşılaştırmada kullanılan kurgunun kendisini sınamaktır.

## 2. Teorik Metot §(Theoretical Method)§

Çalışmanın genel akışı Şekil 1'de verilmiştir. Çözümleme dört bağımsız sınamadan oluşmaktadır: analitik değişmezlik sınaması, uygulanabilirlik kısıtı duyarlılığı, ağırlıklandırma duyarlılığı ve yaşam döngüsü sistem sınırı duyarlılığı.

### 2.1. Fonksiyonel Birim ve Orantılılık Önermesi §(Functional Unit and the Proportionality Proposition)§

Karşılaştırma birimi, TS 825:2024'ün ilgili derece gün bölgesi için tavsiye ettiği ısıl geçirgenlik değerini sağlayan 1 m² dış duvar bileşenidir. Malzemeleri doğrudan ısı iletkenlik katsayısına göre karşılaştırmak yanıltıcı olur; eşdeğer ısıl performans koşulu her malzemenin farklı kalınlıkta kullanılmasını gerektirir ve bu fark kütleye, gömülü karbona ve gerekli duvar kalınlığına yansır. Toplam ısıl direnç, yalıtım katmanı ile diğer katmanların ve yüzeysel dirençlerin toplamıdır (Eş. 1):

1/U_b = R_diğer + d/λ     (1)

Eş. 1'den, b bölgesinde m malzemesi için gereken yalıtım kalınlığı Eş. 2 ile elde edilir:

d_{m,b} = λ_m (1/U_b − R_diğer) = λ_m K_b     (2)

Eş. 2'deki K_b terimi yalnızca bölgeye bağlıdır ve malzemeden bağımsızdır. Kalınlık, uygulama gerçekliğine uygun olarak en yakın santimetreye yuvarlanmıştır.

**Önerme.** Bileşende yalnızca yalıtım katmanı değişiyorsa, yani R_diğer malzemeden bağımsız bir sabitse, karar matrisinin her sütunu ya bölgeden bağımsız bir malzeme özelliğidir ya da x_{m,b} = φ(m) K_b biçiminde yazılabilir. Bu koşulda, sütun bazlı ölçek değişimine duyarsız bir normalizasyon kullanan her sıralama yöntemi tüm bölgelerde özdeş sıralama üretir.

Kalınlıktan türeyen büyüklüklerin tamamı ortak K_b çarpanını taşır: birim kütle λρK_b, gömülü karbon λρεK_b, alansal ısıl kapasite λρcK_b ve gerekli yalıtım kalınlığı λK_b biçimindedir. Geriye kalan ölçütler malzeme özellikleridir ve bölgeye göre değişmez. TOPSIS'in vektörel normalizasyonunda j sütunu için Eş. 3 yazılır:

r_{mj} = φ_j(m) K_b / [Σ_i φ_j(i)² K_b²]^(1/2) = φ_j(m) / [Σ_i φ_j(i)²]^(1/2)     (3)

Eş. 3'te K_b tam olarak sadeleşir ve normalize matris bölgeden bağımsız hâle gelir. Aynı sadeleşme VIKOR'un min-maks normalizasyonunda ve entropi ile CRITIC'in dayandığı normalize sütun istatistiklerinde de gerçekleşir; dolayısıyla ağırlıklar da bölgeye göre değişmez.

Önermenin kapsamı, dayandığı varsayımla sınırlıdır. Sonuç, TS 825'in genel bir özelliği değil, sabit ve malzemeden bağımsız bir R_diğer ile kurulan eşdeğer ısıl geçirgenlik kurgusunun sonucudur. Yalıtım dışındaki katmanların da malzemeyle birlikte değiştiği bir bileşen tanımında, ya da kalınlığa bağlı olmayan bir ölçüt bölgeye göre değişiyorsa orantılılık kırılır ve önerme uygulanmaz.

### 2.2. Alternatifler, Ölçüt Seti ve Veri Kuralları §(Alternatives, Criteria Set and Data Rules)§

On dört biyo-bazlı ve dört konvansiyonel olmak üzere on sekiz alternatif değerlendirilmiştir (Tablo 1). Konvansiyonel grup kıyas amacıyla dâhil edilmiş, biyo-bazlı olanın üstün olduğu varsayımı sınanmaksızın kabul edilmemiştir. Ölçüt seti, birimleri ve eniyileme yönleri Tablo 2'de verilmiştir.

Isıl ve fiziksel özellikler hakemli kaynaklardan, biyojenik ve gömülü karbon ile yaşam sonu modülleri ÖKOBAUDAT veri tabanından alınmıştır [30]. Her hücre için kaynak ve 1–5 arası veri kalitesi puanı kaydedilmiş, tam liste ek tabloda sunulmuştur. Veri tabanı kayıtları kg, m² ve m³ başına beyan edildiğinden birim normalizasyonu uygulanmış; beyan edilen birimi kütleye güvenle çevrilemeyen kayıtlar, çevrim çarpanı yer tutucu olan kayıtlar ve yalıtım sınıflandırması dışındaki ürünler elenmiştir.

Yangına tepki ölçütü EN 13501-1 sınıflandırmasına dayanmaktadır [31]. Bu sınıflandırma sıralıdır; sınıflar arası mesafe tanımlı değildir. Bu nedenle sınıfların sayısallaştırılması bir modelleme kararıdır ve tek bir kodlamayla bırakılmamıştır. Temel çalıştırmada yedi sınıf eşit aralıklı olarak kodlanmış (A1 = 7 … F = 1), sonucun bu karara duyarlılığı iki alternatif kodlamayla ölçülmüştür: sınıfları yanmaz, sınırlı katkılı ve diğer biçiminde üç düzeye indiren gruplu kodlama ve yalnızca yanmazlığı ayıran ikili kodlama (Tablo 3).

Eksik değerler sıfıra çevrilmemiştir; sıfıra çevirme bir ölçütü görünmez biçimde etkisizleştirir. Ana çalıştırmada, on sekiz alternatifin tamamı için verisi eksiksiz olan ölçütler kullanılmıştır. Bu kural gereği gömülü karbon ölçütü (7/18 eksik) ana çalıştırmada yer almamış, model sekiz ölçütle yürütülmüştür; maliyet ölçütü ise hiçbir alternatif için veri bulunamadığından baştan tanımlanmamıştır. Eşiğin sonuç üzerindeki etkisi ayrıca sınanmıştır: eşik %25'e yükseltildiğinde ölçüt seti değişmemekte, %50'ye yükseltildiğinde gömülü karbon sete girmekte ancak yedi alternatifte veri bulunmadığı için model çalıştırılamamaktadır. Yani bu veri setinde eşik seçiminin uygulanabilir tek değeri eksiksiz veri kuralıdır. Gömülü karbonun etkisi, veri bakımından tam olan on alternatiflik alt küme üzerinde ayrıca incelenmiştir.

### 2.3. Hesap Temelinin Çapraz Kontrolü §(Cross-Check of the Calculation Basis)§

Eş. 2'deki R_diğer, yalıtım dışındaki katmanların ve yüzeysel dirençlerin toplam ısıl direncidir. İç ve dış yüzeysel dirençlerin toplamı tek başına yaklaşık 0,17 m²K/W'tır; tuğla ve sıva katmanları buna eklendiğinde 0,30 m²K/W düzeyi tipik bir dış duvar kesiti için makul bir büyüklüktür. Bu değerle hesaplanan kalınlıklar, TS 825:2024 için yayımlanmış asgari yalıtım kalınlığı tablosunun dört il ve iki ısı iletkenlik değeri için verdiği sekiz veri noktasının tamamıyla örtüşmektedir [3] (Tablo 4).

Bu bir çapraz kontroldür, bağımsız bir doğrulama değildir: R_diğer parametresinin kendisi bu tabloyu yakalayacak biçimde seçilmiştir. Çapraz kontrolün gösterdiği şey, tek bir sabitin dört farklı bölge ve iki farklı ısı iletkenlik değeri için aynı anda tutarlı sonuç vermesidir; bu, Eş. 2'nin biçiminin yayımlanan tablonun dayandığı hesapla uyumlu olduğunu göstermektedir.

### 2.4. İklim Verisi ve İklim Dengesi §(Climate Data and Climate Balance)§

İklim verisi PVGIS servisinin 5.3 sürümünden alınmıştır [32]: aylık ortalama dış hava sıcaklıkları ERA5, düşey yüzeylere gelen yön bazlı aylık ortalama ışınım şiddetleri PVGIS-SARAH3 kaynaklıdır. Her iki büyüklük de servisin sunduğu tam dönem olan 2005–2023 (19 yıl) ortalamalarıdır; tekil yılların değil uzun dönem ikliminin kullanılması amaçlanmıştır.

Enerji hesabı ve iklim ayarı, il–bölge karşılığı bağımsız olarak doğrulanabilen dört bölge için yürütülmüştür: 1. bölge Antalya, 3. bölge İstanbul, 4. bölge Ankara, 6. bölge Erzurum. İkinci ve beşinci bölgeler için doğrulanabilir temsilci il belirlenemediğinden bu bölgeler iklime bağlı çözümlemelerin dışında bırakılmıştır. Buna karşılık orantılılık sınaması ve uygulanabilirlik kısıtı yalnızca tavsiye edilen ısıl geçirgenlik değerlerine ve ısı iletkenliğine dayandığı için altı bölgenin tamamı için yürütülmüştür.

Her bölge için ısıtma derece günü (IDG) ve soğutma derece günü (SDG) hesaplanmış, soğutma payı σ_b = SDG/(IDG+SDG) olarak tanımlanmıştır. Isıtma taban sıcaklığı θ = 20 °C, soğutma taban sıcaklığı θ = 22 °C alınmıştır; 26 °C tasarım sıcaklığı aylık ortalamalarla birlikte kullanıldığında Türkiye'de nadiren aşıldığından anlamlı bir gradyan üretmemektedir.

### 2.5. Ağırlıklandırma ve İklim Ayarı §(Weighting and Climate Adjustment)§

Üç objektif ağırlıklandırma yöntemi karşılaştırmalı olarak kullanılmıştır. Birincisinde ağırlık, bir sütunun taşıdığı bilginin ölçüsü olan Shannon entropisinden türetilir; bir sütunun entropisi bire ne kadar uzaksa ağırlığı o kadar büyür (Eş. 4):

e_j = −(1/ln n) Σ_m p_{mj} ln p_{mj},   w_j ∝ 1 − e_j     (4)

Burada p_{mj} normalize matriste m alternatifinin j sütunu içindeki payı, n ise alternatif sayısıdır. İkinci yöntemde ağırlık, sütunun standart sapması sd_j ile o sütunun diğer sütunlarla çelişme miktarının çarpımından gelir (Eş. 5):

C_j = sd_j Σ_k (1 − ρ_{jk})     (5)

Eş. 5'teki bu ölçü, yayılımı yüksek olmakla birlikte başka bir ölçütle güçlü ilişkili olan sütunların payını sınırlar [29]. Üçüncüsü w_j = 1/m ile tanımlı eşit ağırlıktır ve kontrol kurgusu olarak yer alır. Uzman anketine dayalı subjektif ağırlıklandırma, sonucun yanıt havuzuna bağımlı hâle gelmesini önlemek ve hesabın bağımsız olarak yinelenebilmesini korumak amacıyla bilinçli olarak dışarıda bırakılmıştır.

Bölgeye bağlı ağırlık ayarı şu biçimdedir:

w′_j = w_j (1 + α s_j(b))     (6)

Burada alansal ısıl kapasite için s_j(b) = σ_b, nem duyarlılığı için s_j(b) = 1 − σ_b alınır; diğer ölçütlerde s_j = 0'dır. Gerekçe fizikseldir: ısıl kütle kazançların kullanılabilirliğini artırdığı için kazançların paya sahip olduğu bölgelerde anlamlıdır, yoğuşma ve küf riski ise ısıtma sezonunun uzunluğuyla ağırlaşır. Duyarlılık parametresi α temel çalıştırmada 1,0 alınmıştır. Eş. 6, K_b ile orantılı olmayan bir yapı ürettiği için 2.1'deki önermenin kapsamı dışındadır. İklim ayarı σ_b'ye dayandığından yalnızca 2.4'te sayılan dört bölge için tanımlıdır.

### 2.6. Sıralama ve Uygulanabilirlik Kısıtı §(Ranking and Buildability Constraint)§

TOPSIS birincil yöntemdir. Ağırlıklı normalize matriste her alternatifin ideal ve negatif ideal çözüme Öklid uzaklıkları (d⁺_m ve d⁻_m) hesaplanır; alternatifin puanı bu iki uzaklığın oranından gelir (Eş. 7) [33]:

C_m = d⁻_m / (d⁺_m + d⁻_m)     (7)

VIKOR (v = 0,5), toplulaştırma mantığı farklı olduğu için tamamlayıcı bir sıralama yöntemi olarak kullanılmıştır; iki yöntemin aynı sıralamayı vermesi beklenmemekte, aradaki fark yöntem duyarlılığının ölçüsü olarak raporlanmaktadır. Sıralamalar Spearman sıra korelasyonu ile karşılaştırılmıştır.

Duvar bileşeninde uygulanabilir kabul edilen azami yalıtım kalınlığı aşıldığında alternatif, o bölge için uygun kümeden çıkarılmıştır. Temel çalıştırmada bu eşik 20 cm alınmıştır. Kısıt, Eş. 2 gereği bölgeye göre farklı alternatifleri elediğinden uygun küme bölgeye bağımlı hâle gelir.

### 2.7. Yaşam Döngüsü Sistem Sınırı §(Life Cycle System Boundary)§

Çevresel veriler ÖKOBAUDAT'tan alınan yaşam döngüsü değerlendirmesi veri kümeleridir [30]. Veri tabanı yalnızca doğrulanmış ürün beyanlarından oluşmamakta; ürün beyanı temelli, ortalama, temsilî ve jenerik veri kümelerini bir arada sunmaktadır. Bu çalışmada kullanılan her kaydın veri kümesi kimliği, sürüm yılı ve referans birimi ek tabloda verilmiştir.

Ürün beyanı modülleri kullanılarak üç sistem sınırı tanımlanmıştır [34]: S1 yalnızca A1–A3 modüllerini (beşikten kapıya, biyojenik alım dâhil), S2 buna C3 ve C4 modüllerini (beşikten mezara), S3 ise ek olarak D modülünü kapsar. Çifte sayımı önlemek için bu analizde gömülü karbon ve biyojenik karbon ayrı ölçüt olarak kullanılmamış, yerlerini tek bir yaşam döngüsü karbonu ölçütü almıştır. Bu ölçüt setinin ana çalıştırmanınkinden farkı budur; ana çalıştırma sekiz ölçütle ve biyojenik karbonla, sistem sınırı çözümlemesi ise sekiz ölçütle ve tek bir yaşam döngüsü karbonu ölçütüyle yürütülmüştür.

S1 sınırında biyo-bazlı malzemelerin karbon-negatif görünmesi malzemenin bir özelliği değil, sistem sınırının ve biyojenik karbon muhasebesinin bir sonucudur: A1–A3'te atmosferden alınan karbon eksi işaretle kaydedilirken, bu karbonun yaşam sonunda geri salınması hesabın dışında bırakılmaktadır.

EN 15804'ün A1 ve A2 sürümleri biyojenik karbonu farklı biçimde muhasebeleştirmektedir; veri tabanı bu iki sürümün göstergelerinin birlikte karşılaştırılmamasını öngörmektedir. Veri setinde bu fark somut olarak gözlenmiştir: kenevir ve keten lifi için 2023 tarihli kayıtlarda A1–A3 biyojenik karbon sıfıra yakınken, 2022 tarihli kayıtlarda yaklaşık −1,5 kgCO₂e/kg'dır. Bu çalışmada, lignoselülozik malzemenin kuru kütle karbon içeriğinden beklenen büyüklükle tutarlı olduğu için 2022 sürümleri kullanılmış, sonucun bu seçime duyarlılığı 3.4'te ayrıca raporlanmıştır.

Yaşam sonu senaryosunun sonucu ne ölçüde belirlediğini ölçmek için, C3 modülünde beyan edilen salımın gerçekleşen oranı φ bir duyarlılık parametresi olarak tanımlanmıştır. φ = 1 beyan edilen senaryoyu, φ = 0 depolanan biyojenik karbonun hiç salınmadığı sınır durumu temsil eder.

### 2.8. Referans Konut ve Aylık Enerji Hesabı §(Reference Dwelling and Monthly Energy Calculation)§

Doğrulama adımı, tam tanımlı temsili bir referans konut üzerinde yürütülmüştür: 24,0 × 12,0 m plan, beş kat, 2,80 m kat yüksekliği, 4032 m³ brüt hacim, A_f = 1440 m² şartlandırılmış döşeme alanı, A_n = 1290,2 m² kullanım alanı, 184,8 m² pencere alanı (güneyde duvar alanının %25'i, diğer yönlerde %15'i) ve 0,393 A/V oranı. Binanın özgül ısı kaybı, iletim ve havalandırma bileşenlerinin toplamıdır (Eş. 8):

H = H_T + H_V     (8)

İletim bileşeni, kabuğu oluşturan yüzeylerin ısıl geçirgenlik-alan çarpımlarından; çatı ve taban için sıcaklık düzeltme çarpanlarıyla birlikte kurulur (Eş. 9):

H_T = U_D A_opak + U_P A_pencere + 0,8 U_T A_çatı + 0,5 U_t A_taban     (9)

Havalandırma bileşeni ise havalandırılan hacim üzerinden yazılır (Eş. 10):

H_V = 0,33 n_h V_h,   V_h = 0,8 V_brüt     (10)

Hava değişim sayısı n_h = 0,7 h⁻¹ alınmıştır. Dördüncü bölge için H = 1467 W/K bulunmuştur.

İç kazançlar 5 W/m² × A_n, güneş kazançları ise dört yönün pencere alanları üzerinden gölgelenme faktörü 0,6 ve güneş geçirme faktörü 0,6 ile hesaplanmıştır. Duvar yalıtımının etkin ısıl kapasitesine katkısı λρcK_b × opak alan biçiminde, döşeme ve iç duvarların katkısı ise 150 kJ/m²K × döşeme alanı kabulüyle hesaplanmıştır.

Aylık net ısıtma ve soğutma enerjisi ihtiyaçları, kazanç ve kayıp kullanım faktörleri üzerinden belirlenmiştir. Kullanılan aylık yarı-kararlı çerçeve, tarihsel olarak EN ISO 13790 ile tanımlanmış hesap mantığına dayanmaktadır [35]; bu standart geri çekilmiş olup yerini hem aylık hem saatlik hesap yordamlarını kapsayan ISO 52016-1 almıştır [36]. Bu çalışmada aylık biçim, TS 825'in hesap yapısına yakınlığı nedeniyle kullanılmıştır.

Fonksiyonel birim sabit U hedefine dayandığı için yalıtım malzemesi değiştiğinde H değişmez; malzemenin yıllık enerjiye etki edebileceği tek yol ısıl kütlesi C üzerinden kullanım faktörüdür. Bu nedenle iki kurgu karşılaştırılmıştır. Kurgu A'da kullanım faktörü yalnızca kazanç-kayıp oranına bağlıdır ve zaman sabitinden bağımsızdır. Kurgu B'de kullanım faktörü, kazanç-kayıp oranı γ ile binanın zaman sabitine birlikte bağlıdır (Eş. 11):

η = (1 − γ^a) / (1 − γ^(a+1)),   a = a₀ + τ/τ₀,   τ = C/H     (11)

Burada a₀ = 1,0 ve τ₀ = 15 saat olup bu iki katsayı konutlar için aylık yöntemde kullanılan değerlerdir. Soğutma için aynı biçimin kayıp kullanım faktörü karşılığı kullanılmıştır. Referans konutta τ, alternatife göre 41,2 ile 75,1 saat arasında değişmektedir. Gece havalandırması ve hareketli gölgeleme kontrolü modellenmemiştir; her ikisi de saatlik çözünürlük gerektirmekte ve aylık yarı-kararlı çerçevede temsil edilememektedir.

## 3. Sonuçlar ve Tartışmalar §(Results and Discussions)§

### 3.1. Orantılılık Önermesinin Sınanması §(Testing the Proportionality Proposition)§

Yuvarlama devre dışı bırakıldığında, üç ağırlıklandırma yöntemi ve iki sıralama yöntemi için altı bölge arasındaki Spearman sıra korelasyonu bütün çiftlerde 1,000000; ağırlıkların bölgeler arası azami farkı 1,8 × 10⁻⁹ çıkmıştır. Bu fark, hesapta kullanılan kalınlık adımının kendisiyle aynı mertebededir; yani sayısal olarak sıfırdır. Kalınlık en yakın santimetreye yuvarlandığında korelasyon TOPSIS için 0,983–1,000, VIKOR için 0,992–1,000 aralığına inmekte, ağırlık farkı 9,2 × 10⁻³'e çıkmaktadır. Gözlenen tüm sapmanın kaynağı yuvarlamadır; fiziksel bir bölge etkisi yoktur (Şekil 2).

Bu sonuç, birinci araştırma sorusunun cevabıdır: sabit ısıl geçirgenlik hedefine ve malzemeden bağımsız sabit bir katman direncine dayalı bir seçim modelinde bölgeler arası sıralama farkı oluşmaz. Bu, veriye bağlı bir gözlem değil, kurgunun analitik sonucudur. Bulgunun geçerliliği kullanılan veri setinden bağımsızdır; kapsamı ise 2.1'de belirtilen varsayımla sınırlıdır.

### 3.2. Bölge Etkisini Üreten Mekanizmalar §(Mechanisms Producing the Zone Effect)§

Derece gün değerleri bölgeler arasında tek yönlü ve düzgün bir gradyan göstermektedir (Tablo 5). Uygulanabilirlik kısıtı, 1–3. bölgelerde eleme yapmazken 4. bölgede bir, 5. ve 6. bölgelerde altı alternatifi elemektedir: kenevir-kireç, saman balya, pirinç kavuzu paneli, ayçiçeği sapı-kitosan kompozit, şeker kamışı küspesi levhası ve fındık kabuğu paneli. Elenenlerin tamamı yüksek ısı iletkenlikli, hacimli biyo-bazlı ürünlerdir.

Mekanizmaların sıralamaya etkisi Şekil 3'te verilmiştir. Ham modelde 1. ve 6. bölge arasındaki korelasyon 0,990 iken, uygulanabilirlik kısıtıyla 0,497'ye, iklim ayarlı ağırlıklandırmayla 0,513'e inmektedir. Tam modelde değer 0,573'tür. Kısıtın etkisi, ortak alternatif kümesini 18'den 12'ye daraltmasından ve karşılaştırmanın bu daraltılmış küme üzerinden yapılmasından kaynaklanmaktadır.

İkinci araştırma sorusunun cevabı buradadır: bölge etkisi, K_b ile orantılı olmayan bir yapı modele girdiğinde ortaya çıkar. Uygulamada bu, soğuk bölgelerde yüksek ısı iletkenlikli biyo-bazlı ürünlerin gereken duvar kalınlığı nedeniyle kullanılamaz hâle gelmesi biçiminde somutlaşmaktadır. Nicel olarak bu mekanizma, iklime bağlı ağırlıklandırmadan daha güçlü bir bölge etkisi üretmektedir.

### 3.3. Ağırlıklandırma Yönteminin Etkisi §(Effect of the Weighting Method)§

Ağırlıklandırma yöntemine göre en ağır ölçüt ve ilk üç sıra Tablo 6'da verilmiştir. Entropi, ağırlığın yaklaşık üçte birini tek bir sıralı ölçüte, yangına tepki sınıfına vermektedir. Bu ölçütte mineral esaslı ürünler diğer alternatiflerden keskin biçimde ayrıldığı için, yayılıma duyarlı bir yöntem bu tek ölçüt üzerinden mineral yünleri öne çekmektedir: entropi ağırlıklandırmasında taşyünü ve camyünü ikinci ve üçüncü sıraya yerleşirken, CRITIC ve eşit ağırlıkta bu iki ürünün yerini tarımsal atık esaslı paneller almaktadır.

Bulgu, yaşam döngüsü modülleri eksiksiz olan on alternatiflik alt kümede daha da belirginleşmektedir. Bu alt kümede entropinin yangına tepkiye verdiği pay %37,7, CRITIC'inki %19,5'tir: CRITIC aynı ölçütü tanımakta, fakat tek başına egemen olmasına izin vermemektedir.

TOPSIS ve VIKOR sıralamaları arasındaki Spearman korelasyonu 0,352–0,633 düzeyindedir. Bu, sıralama yönteminin seçiminin de sonucu etkilediğini göstermekte ve tek bir sıralamanın doğru cevap olarak sunulmasını engellemektedir.

### 3.4. Yangına Tepki Kodlamasına Duyarlılık §(Sensitivity to the Reaction-to-Fire Encoding)§

Yangına tepki sınıfının sayısallaştırılması entropi bulgusunun dayandığı noktadır; bu nedenle ayrıca sınanmıştır (Tablo 3). Yedi sınıfı eşit aralıklı kodlayan temel kurgu ile sınıfları üç düzeye indiren gruplu kodlama arasında pratik bir fark yoktur; sıralamalar arası Spearman korelasyonu 0,979–0,994 düzeyindedir ve entropi ağırlığı %30,4'ten %30,8'e çıkmaktadır. Buna karşılık yalnızca yanmazlığı ayıran ikili kodlama, ölçütteki yayılımı yoğunlaştırarak entropi ağırlığını %38,5'e çıkarmakta ve sıralamayı belirgin biçimde değiştirmektedir (Spearman 0,453). Aynı kodlamada CRITIC 0,744, eşit ağırlık 0,903 düzeyinde kalmaktadır.

Bunun iki sonucu vardır. Birincisi, entropinin bu ölçüte yüklendiği yönündeki bulgu kodlamadan bağımsızdır; hatta kaba kodlamada güçlenmektedir. İkincisi, entropi ağırlıklandırmasının sonucu sıralı bir ölçütün nasıl sayısallaştırıldığına duyarlıdır, CRITIC ve eşit ağırlık ise belirgin biçimde daha dayanıklıdır. Dolayısıyla bulgu, ağırlıklandırma yönteminin biyo-bazlı alternatifleri sistematik olarak dezavantajlı kıldığı biçiminde değil, entropi ağırlıklandırmasının bu ölçüt seti ve bu veri gösterimi altında mineral esaslı alternatifleri öne çıkardığı biçiminde ifade edilmelidir.

### 3.5. Sistem Sınırının Etkisi §(Effect of the System Boundary)§

Yaşam döngüsü modülleri incelendiğinde, biyo-bazlı malzemelerin A1–A3'te aldığı biyojenik karbonun C3'te yeniden salındığı görülmektedir. Altı malzemede alım ve salım ±0,04 kgCO₂e/kg içinde birbirini götürmektedir. Sistem sınırına göre yaşam döngüsü karbonu Tablo 7'de, sıralama değişimi Şekil 4'te verilmiştir.

S1 sınırında biyo-bazlı malzemelerin çoğu karbon-negatif görünmekte ve sıralamanın başında yer almaktadır: birinci sıra 1. ve 3. bölgede saman balya, 4. ve 6. bölgede genleştirilmiş mantardır. C modülleri eklendiğinde birinci sıra incelenen dört bölgenin dördünde de camyününe geçmektedir. Sınırlar arası Spearman korelasyonu S1–S2 için 0,648, S1–S3 için 0,636, S2–S3 için 0,988'dir.

Etki, 2.7'de tanımlanan sürüm tutarsızlığını taşıyan iki kayıt çıkarıldığında zayıflamamakta, güçlenmektedir: sekiz alternatiflik alt kümede S1–S2 korelasyonu 1. bölgede 0,333, 3. bölgede 0,405, 4. bölgede 0,286 ve 6. bölgede 0,607'ye inmektedir. Bulgu üç ağırlıklandırma yönteminde de korunmaktadır.

Yaşam sonu senaryosunun duyarlılığı Şekil 5'te verilmiştir. CRITIC ağırlıklandırmasında camyününün birinci sıraya geçtiği salım oranı eşiği 0,51 ile 0,81 arasındadır; yani depolanan biyojenik karbonun yarısından fazlası yaşam sonunda salınmadıkça biyo-bazlı bir malzeme birinci sırada kalmaktadır. Eşik sıcak bölgelerde daha yüksektir, çünkü biyo-bazlı malzemeler orada ısıl kütle üzerinden ek bir üstünlük taşımakta ve daha büyük bir karbon yükünü soğurabilmektedir. Entropi ağırlıklandırmasında eşik her bölgede sıfırdır: camyünü salım oranından bağımsız olarak birinci sıradadır; bu, 3.3'teki bulgunun bir başka görünümüdür.

Bu sonuç, biyo-bazlı malzemelerin çevresel açıdan tercih edilmemesi gerektiği anlamına gelmez. C3 modülü enerji geri kazanımlı yakma senaryosunu yansıtmaktadır; düzenli depolama veya yeniden kullanım senaryolarında depolanan karbonun bir bölümü sistemde kalır, ancak depolamada oluşan metanın küresel ısınma potansiyeli de dikkate alınmalıdır. Bulgunun söylediği şey, yaşam sonu senaryosunun sonucu belirlediği ve varsayım olarak bırakılamayacağıdır. Bu da tartışmayı malzeme seçiminden atık yönetimi politikasına taşımaktadır.

### 3.6. Isıl Kütlenin Enerji İhtiyacına Etkisi §(Effect of Thermal Mass on Energy Demand)§

Kurgu A'da, yani kullanım faktörünün zaman sabitinden bağımsız olduğu durumda, on sekiz alternatifin tamamı birebir aynı yıllık ısıtma enerjisi ihtiyacını vermektedir; malzemeler arası yayılım tam olarak sıfırdır. Bu beklenen sonuçtur: sabit U hedefi altında özgül ısı kaybı malzemeden bağımsızdır ve zaman sabitinden bağımsız bir kullanım faktörü ısıl kütleyi görmez.

Kurgu B'de fark oluşmaktadır. Referans konutun bölgelere göre enerji ihtiyacı ve ısıl kütlenin katkısı Tablo 8'de, karşılaştırma Şekil 6'da verilmiştir. Isıl kütlenin en hafif ile en ağır alternatif arasında yarattığı yıllık toplam enerji farkı 5,57 ile 7,74 kWh/m²·yıl arasındadır; bölgeler arası değişim yaklaşık 1,4 kattır.

Yüzdesel ifade yanıltıcıdır. Isıtma tarafında fark 1. bölgede %53,1'e ulaşmakta, 6. bölgede %6,4'e inmektedir; ancak bu, ısıtma ihtiyacının 1. bölgede yalnızca 3,8 kWh/m²·yıl olmasından kaynaklanır. Aynı oran mutlak olarak 2,02 kWh/m²·yıl demektir. Karşılaştırmalarda mutlak değer kullanılmalıdır.

Dış ortam sıcaklığının iç tasarım sıcaklığını aştığı aylarda iletim de kazanç tarafına geçmekte ve kayıp kullanım faktörü uygulanamamaktadır; bu aylarda ısıl kütle hesaba hiç girmez. Aylık yarı-kararlı yöntemin dinamik etkileri temsil etmedeki sınırları literatürde de ölçülmüştür [37]. Buradaki sonuç, hesap yöntemlerinin genel olarak ısıl kütleyi göremediği biçiminde okunmamalıdır: kullanılan aylık yarı-kararlı biçimin ısıl kütle etkilerine duyarlılığı, saatlik dinamik bir yaklaşıma kıyasla sınırlıdır. ISO 52016-1 saatlik hesap yordamlarını da kapsamaktadır [36]; ısıl kütlenin gerçek katkısının ölçülmesi bu düzeyde bir çözünürlük gerektirir.

### 3.7. Bulguların Birlikte Değerlendirilmesi §(Joint Assessment of the Findings)§

Dört tespit birbirinden bağımsız yollarla elde edilmiş ancak aynı noktaya çıkmıştır: fonksiyonel birim kurgusu, kendi varsayımları içinde bölge etkisini analitik olarak imkânsız kılmakta; uygulanabilirlik kısıtı bu etkiyi geri getirmekte; ağırlıklandırma yöntemi ve ölçütlerin sayısallaştırılma biçimi biyo-bazlı alternatiflerin yerini değiştirmekte; sistem sınırı birinci sırayı değiştirmektedir. Ortak sonuç şudur: bir malzeme sıralaması, malzemelerin içkin bir özelliği olarak okunamaz; fonksiyonel birim tanımı, ağırlıklandırma yöntemi, ölçüt gösterimi, sıralama yöntemi ve yaşam döngüsü sistem sınırı birlikte beyan edildiğinde yorumlanabilir bir sonuçtur.

Bu, kararın zaman ufkuna ilişkin bir sonucu da beraberinde getirir. Yapı malzemesi seçim modellerinin ölçütleri geleneksel olarak insan konforu ve yatırımın geri dönüşü üzerinden, bina ömrüyle sınırlı bir ufukta tanımlanır. Hesabı A1–A3'te kesmek, malzemeyi bina kapısına kadar izleyip orada bırakmak demektir ve bu tercih biyo-bazlı malzemeleri karbon-negatif göstermektedir. Hesap malzemenin gerçek yaşam sonuna kadar uzatıldığında bu görüntü kaybolmaktadır. Ölçüt setini biyojenik karbon ve yaşam sonu senaryosuyla genişletmek kararı bina ömrünün ötesine taşımakta, ancak bu genişletme yalnızca sistem sınırı da buna uygun seçildiğinde anlamlı olmaktadır.

### 3.8. Sınırlılıklar §(Limitations)§

Ana çalıştırmada gömülü karbon ölçütü eksik veri kuralı gereği yer almamaktadır. Isı iletkenliği verisinin ortalama kalite puanı 2,72/5, yoğunluk verisininki 2,50/5'tir; on sekiz alternatifin altısında ısı iletkenliği, sekizinde yoğunluk hakemli tek bir kaynağa bağlanamamış, gösterge değer olarak kullanılmıştır. Tüm hücrelerin kaynak ve kalite bilgisi ek tabloda açık biçimde sunulmuştur. Bu nedenle çalışmada üretilen malzeme sıralamaları göstergedir; 3.1'deki analitik sonuç ise kurgudan türediği için veri setinden bağımsızdır, buna karşılık 3.2–3.6'daki nicel bulgular veri kalitesine ve ölçütlerin sayısallaştırılma biçimine duyarlıdır.

Soğutma hesabı aylık yarı-kararlı yöntemle kurulmuş, gece havalandırması ve gölgeleme kontrolü modellenmemiştir. Enerji hesabı ve iklim ayarı, il–bölge eşleşmesi doğrulanabilen dört bölgeyle sınırlıdır; ikinci ve beşinci bölgeler bu çözümlemelerin dışındadır. Geometri, yönlenme ve A/V oranı duyarlılığı incelenmemiştir. Sistem sınırı analizi, yaşam döngüsü modülleri eksiksiz olan on alternatifle sınırlıdır; tarımsal atık esaslı panellerin çoğu ve miselyum kompozit bu analizin dışındadır.

## 4. Simgeler §(Symbols)§

A_f : şartlandırılmış döşeme alanı, m²
A_n : kullanım alanı, m²
a₀ : kullanım faktörü sabiti, –
c : özgül ısı kapasitesi, J/kgK
C : etkin ısıl kapasite, J/K
C_j : CRITIC ölçüt bilgi miktarı, –
C_m : TOPSIS yakınlık katsayısı, –
d : yalıtım kalınlığı, m
d⁺, d⁻ : ideal ve negatif ideal çözüme uzaklık, –
e : ölçüt entropisi, –
H : özgül ısı kaybı, W/K
IDG : ısıtma derece günü, °C·gün
K_b : bölgeye bağlı kalınlık çarpanı, m²K/W
n_h : hava değişim sayısı, h⁻¹
p : normalize karar matrisi sütun payı, –
R : ısıl direnç, m²K/W
sd : ölçüt standart sapması, –
SDG : soğutma derece günü, °C·gün
U : ısıl geçirgenlik katsayısı, W/m²K
V_h : havalandırılan hacim, m³
w : ölçüt ağırlığı, –
α : iklim ayarı duyarlılık katsayısı, –
γ : kazanç-kayıp oranı, –
ε : birim kütle başına gömülü karbon, kgCO₂e/kg
η : kazanç veya kayıp kullanım faktörü, –
θ : sıcaklık, °C
λ : ısı iletkenlik katsayısı, W/mK
ρ : yoğunluk, kg/m³
ρ_{jk} : ölçütler arası korelasyon katsayısı, –
σ_b : soğutma payı, –
τ : zaman sabiti, h
τ₀ : referans zaman sabiti, h
φ : yaşam sonu salım oranı, –

## 5. Sonuçlar §(Conclusions)§

Bu çalışmada, biyo-bazlı yapı kabuğu malzemelerinin seçiminde kullanılan çok ölçütlü karar kurgusunun kendisi TS 825:2024 çerçevesinde sınanmıştır. Hesap temeli, yayımlanmış asgari yalıtım kalınlığı tablosunun sekiz veri noktasının tamamında çapraz kontrolden geçmiştir.

Sabit ısıl geçirgenlik hedefine ve malzemeden bağımsız sabit bir katman direncine dayalı kurgu, iklim bölgesine göre sıralama farkı üretememektedir. Gerekli kalınlık malzemeden bağımsız bir çarpanla ölçeklendiğinden, sütun bazlı ölçek değişimine duyarsız her normalizasyonda bu çarpan sadeleşmektedir; yuvarlama devre dışı bırakıldığında bölgeler arası sıra korelasyonu 1,000000'dır. Bölge etkisi ancak orantılılığı kıran yapılar modele eklendiğinde doğmaktadır: uygulanabilirlik kısıtı soğuk bölgelerde altı alternatifi elemekte ve korelasyonu 0,990'dan 0,497'ye indirmektedir; iklim dengesine bağlı ağırlıklandırmanın etkisi ise 0,513 düzeyindedir.

Ağırlıklandırma yönteminin ve ölçütlerin sayısallaştırılma biçiminin seçimi biyo-bazlı alternatiflerin sıralamadaki yerini belirlemektedir. Entropi, ağırlığın yaklaşık üçte birini tek bir sıralı ölçüte vererek mineral esaslı ürünleri öne çekmekte; CRITIC ve eşit ağırlık ise aynı ölçütü tanımakla birlikte egemen olmasına izin vermemektedir. Bu davranış yangına tepki sınıfının kodlanma biçimine duyarlıdır ve kaba bir kodlamada güçlenmektedir.

Yaşam döngüsü sistem sınırının seçimi birinci sırayı incelenen tüm bölgelerde değiştirmektedir. Biyo-bazlı malzemelerin A1–A3'te depoladığı biyojenik karbon C3'te yeniden salınmakta, altı malzemede alım ile salım ±0,04 kgCO₂e/kg içinde birbirini götürmektedir. Biyo-bazlı üstünlük, depolanan karbonun yarısından fazlası salınmadıkça korunmaktadır.

Bulguların mevzuata dönük karşılığı, tavsiye edilen ısıl geçirgenlik değerleri koşulunda derece gün bölgesinin malzeme seçimini tek başına farklılaştırmadığı, bölgeye göre farklılaşmanın uygulanabilirlik kısıtı üzerinden geldiğidir. Aylık yarı-kararlı hesapta ısıl kütle farkı ancak zaman sabitine bağlı bir kullanım faktörü kullanıldığında görünür hâle gelmekte, bu durumda dahi mutlak katkısı 5,6–7,7 kWh/m²·yıl düzeyinde kalmaktadır.

Öncelikli gelecek çalışma yönleri, ısıl kütle etkisinin ISO 52016-1'in saatlik yordamlarıyla ölçülmesi, yaşam sonu senaryolarının kendi iklim etkileriyle modellenmesi ve Türkiye'ye özgü tarımsal atık esaslı yalıtım ürünleri için doğrulanmış ürün beyanı üretilmesidir.

## Teşekkür §(Acknowledgement)§

[Varsa proje desteği, kurum veya kişi teşekkürleri buraya yazılacaktır.]

---

## TABLOLAR

**Tablo 1.** Değerlendirilen alternatifler, ısıl özellikleri ve veri kaynakları §(Alternatives evaluated, their thermal properties and data sources)§

| Kod | Malzeme | Grup | λ (W/mK) | ρ (kg/m³) | c (J/kgK) | Yangın sınıfı | Kaynak (λ/ρ) | Kalite |
|---|---|---|---|---|---|---|---|---|
| M01 | Ahşap lifi levha | Lifli levha | 0,038 | 50 | 2100 | E | [14] | 4 |
| M02 | Kenevir lifi levha | Lifli levha | 0,040 | 40 | 1700 | E | [12] | 3 |
| M03 | Keten lifi levha | Lifli levha | 0,038 | 35 | 1600 | E | [12] | 3 |
| M04 | Koyun yünü | Lifli levha | 0,038 | 60 | 1720 | E | [13] | 4 |
| M05 | Geri dönüşüm tekstil | Lifli levha | 0,039 | 35 | 1600 | E | [12] | 3 |
| M06 | Selüloz (püskürtme) | Dökme/dolgu | 0,040 | 50 | 1600 | B | gösterge | 1 |
| M07 | Kenevir-kireç (hempcrete) | Dökme/dolgu | 0,060 | 330 | 1500 | B | [12]/gösterge | 3 |
| M08 | Saman balya | Dökme/dolgu | 0,060 | 100 | 1500 | E | gösterge | 1 |
| M09 | Genleştirilmiş mantar (ICB) | Kabuk/atık esaslı | 0,045 | 110 | 1800 | E | [12] | 3 |
| M10 | Pirinç kavuzu paneli | Kabuk/atık esaslı | 0,070 | 400 | 1700 | E | [18, 19] | 3 |
| M11 | Ayçiçeği sapı-kitosan kompozit | Kabuk/atık esaslı | 0,056 | 150 | 1700 | E | [15] | 5 |
| M12 | Şeker kamışı küspesi levhası | Kabuk/atık esaslı | 0,082 | 614 | 1700 | E | [17] | 5 |
| M13 | Fındık kabuğu esaslı panel | Kabuk/atık esaslı | 0,060 | 300 | 1700 | E | gösterge | 1 |
| M14 | Miselyum esaslı kompozit | Büyütülmüş | 0,047 | 120 | 1714 | E | [20, 21]/gösterge | 3 |
| R01 | EPS | Kıyas | 0,035 | 20 | 1450 | E | gösterge | 1 |
| R02 | XPS | Kıyas | 0,032 | 32 | 1450 | E | gösterge | 1 |
| R03 | Taşyünü | Kıyas | 0,037 | 29 | 1030 | A1 | [14] | 4 |
| R04 | Camyünü | Kıyas | 0,035 | 20 | 1030 | A1 | gösterge | 1 |

**Tablo 2.** Ölçüt seti, birimleri ve eniyileme yönleri §(Criteria set, units and optimisation directions)§

| Kod | Ölçüt | Birim | Yön | Ana çalıştırma |
|---|---|---|---|---|
| Ö1 | Isı iletkenliği | W/mK | en küçük | var |
| Ö2 | Birim kütle | kg/m² | en küçük | var |
| Ö3 | Alansal ısıl kapasite | kJ/m²K | en büyük | var |
| Ö5 | Gömülü karbon | kgCO₂e/m² | en küçük | yok (7/18 eksik) |
| Ö6 | Biyojenik karbon | kgCO₂e/m² | en küçük | var |
| Ö7 | Yangına tepki (EN 13501-1) | sıralı 1–7 | en büyük | var |
| Ö9 | Yaşam sonu senaryosu | sıralı 1–5 | en büyük | var |
| Ö10 | Nem/küf duyarlılığı | sıralı 1–5 | en küçük | var |
| Ö11 | Gerekli yalıtım kalınlığı | cm | en küçük | var |

**Tablo 3.** Yangına tepki sınıfının üç kodlaması ve sonuca etkisi (1. bölge) §(Three encodings of the reaction-to-fire class and their effect on the result (zone 1))§

| Sınıf | Doğrusal | Gruplu | İkili |
|---|---|---|---|
| A1 | 7 | 3 | 1 |
| A2 | 6 | 3 | 1 |
| B | 5 | 2 | 0 |
| C | 4 | 2 | 0 |
| D | 3 | 1 | 0 |
| E | 2 | 1 | 0 |
| F | 1 | 1 | 0 |
| **Entropi ağırlığı w(Ö7)** | **%30,4** | **%30,8** | **%38,5** |
| **CRITIC ağırlığı w(Ö7)** | **%18,4** | **%18,0** | **%17,4** |
| **Doğrusal ile Spearman (entropi)** | **1,000** | **0,979** | **0,453** |
| **Doğrusal ile Spearman (CRITIC)** | **1,000** | **0,994** | **0,744** |

**Tablo 4.** Hesaplanan yalıtım kalınlıklarının yayımlanmış tabloyla karşılaştırılması §(Calculated insulation thicknesses versus the published table)§

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

**Tablo 5.** Bölgelerin ısıtma ve soğutma derece günleri §(Heating and cooling degree days of the zones)§

| Bölge | Temsilci il | IDG (°C·gün) | SDG (°C·gün) | Soğutma payı |
|---|---|---|---|---|
| 1 · Aşırı Sıcak | Antalya | 1409 | 688 | %32,8 |
| 3 · Ilıman | İstanbul | 2167 | 163 | %7,0 |
| 4 · Soğuk | Ankara | 3231 | 98 | %3,0 |
| 6 · Aşırı Soğuk | Erzurum | 5320 | 0 | %0,0 |

**Tablo 6.** Ağırlıklandırma yöntemine göre en ağır ölçüt ve ilk üç sıra (1. bölge) §(Heaviest criterion and top three alternatives by weighting method (zone 1))§

| Yöntem | En ağır ölçüt | Payı | 1. | 2. | 3. |
|---|---|---|---|---|---|
| Entropi | Ö7 Yangına tepki | %30,4 | Şeker kamışı küspesi levhası | Camyünü | Taşyünü |
| CRITIC | Ö7 Yangına tepki | %18,4 | Şeker kamışı küspesi levhası | Pirinç kavuzu paneli | Fındık kabuğu esaslı panel |
| Eşit | Ö10 Nem/küf duyarlılığı | %18,6 | Şeker kamışı küspesi levhası | Pirinç kavuzu paneli | Camyünü |

**Tablo 7.** Sistem sınırına göre yaşam döngüsü karbonu (kgCO₂e/kg) §(Life-cycle carbon by system boundary)§

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

**Tablo 8.** Referans konutun enerji ihtiyacı ve ısıl kütlenin katkısı §(Energy demand of the reference dwelling and the contribution of thermal mass)§

| Bölge | Temsilci il | Q_H (kWh/m²) | Q_C (kWh/m²) | Toplam | Isıl kütle katkısı (kWh/m²) |
|---|---|---|---|---|---|
| 1 · Aşırı Sıcak | Antalya | 3,8 | 57,0 | 60,8 | 5,57 |
| 3 · Ilıman | İstanbul | 14,1 | 29,8 | 43,9 | 5,76 |
| 4 · Soğuk | Ankara | 28,6 | 24,0 | 52,7 | 6,57 |
| 6 · Aşırı Soğuk | Erzurum | 55,5 | 7,7 | 63,2 | 7,74 |

---

## ŞEKİL ALTI YAZILARI (FIGURE CAPTIONS)

Şekiller belgede ilgili yerlere yerleştirilecek; başlıklar şeklin altına konur.

**Şekil 1.** Model akış şeması §(Model flow chart)§

**Şekil 2.** Gerekli yalıtım kalınlığının bölgeler arası oranı; kalın çizgi teorik oranı, ince çizgiler on sekiz alternatifin gerçekleşen oranını gösterir. Yayılımın tek kaynağı bir santimetreye yuvarlamadır §(Inter-zone ratio of required insulation thickness; the bold line is the theoretical ratio and the thin lines the realised ratios of eighteen alternatives. The spread arises solely from rounding to one centimetre)§

**Şekil 3.** Mekanizmaların bölge etkisine katkısı; düşük korelasyon güçlü bölge etkisi anlamına gelir §(Contribution of the mechanisms to the climate-zone effect; a lower correlation indicates a stronger zone effect)§

**Şekil 4.** Sistem sınırının sıralamaya etkisi (1. bölge, CRITIC ağırlıklandırma) §(Effect of the system boundary on the ranking (zone 1, CRITIC weighting))§

**Şekil 5.** Biyo-bazlı üstünlüğün kaybolduğu yaşam sonu salım oranı eşiği; eşiğin üzerinde camyünü birinci sıradadır §(Threshold end-of-life release fraction at which the bio-based advantage disappears; above the threshold glass wool ranks first)§

**Şekil 6.** Isıl kütlenin enerji ihtiyacına etkisi: (a) mutlak katkı, (b) karşılaştırma tabanı olan toplam ihtiyaç §(Effect of thermal mass on energy demand: (a) absolute contribution, (b) total demand as the basis of comparison)§

## Kaynaklar §(References)§

1. Enerji ve Tabii Kaynaklar Bakanlığı, Türkiye Genel Enerji Denge Tabloları, Ankara.
2. TS 825, Binalarda Isı Yalıtımı Kuralları, Türk Standartları Enstitüsü, Ankara, 2024.
3. Diz T., Yeni TS 825:2024 Standardı ve Isı Yalıtımı, İZODER teknik sunumu, İstanbul, 2025.
4. Yıldız C., Binalarda Enerji Verimliliğinde Son Gelişmeler: Türkiye Örneği, Gazi Üniversitesi Fen Bilimleri Dergisi Part C: Tasarım ve Teknoloji, 12(1), 176-213, 2024.
5. Morganti L., Vandi L., Astudillo Larraz J., García-Jaca J., Navarro Muedra A., Pracucci A., A1–A5 Embodied Carbon Assessment to Evaluate Bio-Based Components in Façade System Modules, Sustainability, 16, 3, 1190, 2024.
6. Yüce B.E., Acar M.C., Bitlis İlinde Farklı Yakıtlar ve Duvar Bileşenleri İçin Optimum Yalıtım Kalınlığı ve Enerji Tasarrufunun Analizi, Bitlis Eren Üniversitesi Fen Bilimleri Dergisi, 10(4), 1426-1434, 2021.
7. Mıhlayanlar E., Meral S., Mevcut Binalarda Enerji Verimli Yenileme ve EKB Uygulaması, Kırklareli Üniversitesi Mühendislik ve Fen Bilimleri Dergisi, 9(2), 478-497, 2023.
8. Hossain M.S., Therasme O., Crovella P., Volk T.A., Assessing the Environmental Impact of Biobased Exterior Insulation Panel: A Focus on Carbon Uptake and Embodied Emissions, Energies, 17, 14, 3406, 2024.
9. Matthews H.D., Zickfeld K., Koch A., Luers A., Accounting for the climate benefit of temporary carbon storage in nature, Nature Communications, 14, 1, 5485, 2023.
10. Andersen C.E., Rasmussen F.N., Habert G., Birgisdóttir H., Embodied GHG Emissions of Wooden Buildings — Challenges of Biogenic Carbon Accounting in Current LCA Methods, Frontiers in Built Environment, 7, 729096, 2021.
11. Füchsl S., Huber J., Fröhling M., Röder H., Balancing the green carbon cycle — Biogenic carbon within life cycle assessment, The International Journal of Life Cycle Assessment, 30, 10, 2300-2313, 2025.
12. Ye F., Wei H., Xiao Y., Berardi U., Quaranta G., Demartino C., Bio-based insulation materials in sustainable constructions: A review of environmental, thermal and acoustic insulation, durability, and mechanical performances, Renewable and Sustainable Energy Reviews, 223, 115872, 2025.
13. Dénes T., Iştoan R., Tămaş-Gavrea D.R., Manea D.L., Hegyi A., Popa F., Vasile O., Analysis of Sheep Wool-Based Composites for Building Insulation, Polymers, 14, 10, 2109, 2022.
14. Ranefjärd O., Strandberg-de Bruijn P.B., Wadsö L., Hygrothermal Properties and Performance of Bio-Based Insulation Materials Locally Sourced in Sweden, Materials, 17, 9, 2021, 2024.
15. Mati-Baouche N., De Baynast H., Lebert A., Sun S., Lopez-Mingo C.J.S., Leclaire P., Michaud P., Mechanical, thermal and acoustical characterizations of an insulating bio-based composite made from sunflower stalks particles and chitosan, Industrial Crops and Products, 58, 244-250, 2014.
16. Gößwald J., Barbu M., Petutschnigg A., Tudor E.M., Binderless Thermal Insulation Panels Made of Spruce Bark Fibres, Polymers, 13, 11, 1799, 2021.
17. Mohammed W., Osman Z., Elarabi S., Mehats J., Charrier B., Mechanical and physical properties of biocomposites for furniture and thermal insulation, Cellulose Chemistry and Technology, 58, 3-4, 331-338, 2024.
18. Pavelek M., Adamová T., Bio-Waste Thermal Insulation Panel for Sustainable Building Construction in Steady and Unsteady-State Conditions, Materials, 12, 12, 2004, 2019.
19. Marín-Calvo N., González-Serrud S., James-Rivas A., Thermal insulation material produced from recycled materials for building applications: cellulose and rice husk-based material, Frontiers in Built Environment, 9, 1271317, 2023.
20. Wildman J., Shea A., Walker P., Henk D., Extrinsic and intrinsic determinants of thermal conductivity in mycelium composites, Building Services Engineering Research and Technology, 46, 3, 317-338, 2024.
21. Ashraf M.U., Hzami A., Alghamri R., Khattab T., Abu Rayash A., Systematic review of mycelium-based composites as sustainable insulators for carbon-neutral building envelopes, International Journal of Sustainable Engineering, 19, 1, 2665914, 2026.
22. Siksnelyte-Butkiene I., Streimikiene D., Balezentis T., Skulskis V., A Systematic Literature Review of Multi-Criteria Decision-Making Methods for Sustainable Selection of Insulation Materials in Buildings, Sustainability, 13, 2, 737, 2021.
23. Bajwa A.U.R., Siriwardana C., Shahzad W., Naeem M.A., Material selection in the construction industry: a systematic literature review on multi-criteria decision making, Environment Systems and Decisions, 45, 1, 8, 2025.
24. Theilig K., Vollmer M., Lang W., Albus J., Multi-criteria decision-making for energy building renovation: Comparing exterior wall structures with the AHP, ANP, utility analysis, and TOPSIS, Building and Environment, 280, 113075, 2025.
25. Pacheco-Torgal F., Chindaprasirt P., Comparative Performance of Bio-Based Construction Materials in Europe: A Multi-Criteria Decision Analysis, Sustainability, 18, 11, 5508, 2026.
26. Yilmaz B.Ç., Acun Özgünler S., Yilmaz Y., A multi-criteria decision-making method for thermal insulation material selection in nZEB level questioned affordable multifamily housings, Journal of Building Physics, 47, 6, 628-650, 2024.
27. Ayan B., Abacıoğlu S., Basilio M.P., A Comprehensive Review of the Novel Weighting Methods for Multi-Criteria Decision-Making, Information, 14, 5, 285, 2023.
28. Mukhametzyanov I., Specific character of objective methods for determining weights of criteria in MCDM problems: Entropy, CRITIC and SD, Decision Making: Applications in Management and Engineering, 4, 2, 76-105, 2021.
29. Diakoulaki D., Mavrotas G., Papayannakis L., Determining objective weights in multiple criteria problems: The CRITIC method, Computers and Operations Research, 22, 7, 763-770, 1995.
30. ÖKOBAUDAT, Bundesministerium für Wohnen, Stadtentwicklung und Bauwesen, çevrimiçi veri tabanı, https://www.oekobaudat.de, erişim: 5 Eylül 2026.
31. EN 13501-1, Fire classification of construction products and building elements — Part 1: Classification using data from reaction to fire tests, CEN, Brüksel, Belçika, 2018.
32. PVGIS, Photovoltaic Geographical Information System, sürüm 5.3, Avrupa Komisyonu Ortak Araştırma Merkezi, https://re.jrc.ec.europa.eu/pvg_tools/en/, erişim: 8 Eylül 2026.
33. Peng C., Feng D., Guo S., Material Selection in Green Design: A Method Combining DEA and TOPSIS, Sustainability, 13, 10, 5497, 2021.
34. EN 15804:2012+A2:2019, Sustainability of construction works — Environmental product declarations — Core rules for the product category of construction products, CEN, Brüksel, Belçika, 2019.
35. EN ISO 13790, Energy performance of buildings — Calculation of energy use for space heating and cooling, CEN, Brüksel, Belçika, 2008 (geri çekilmiştir).
36. ISO 52016-1, Energy performance of buildings — Energy needs for heating and cooling, internal temperatures and sensible and latent heat loads — Part 1: Calculation procedures, ISO, Cenevre, İsviçre, 2017.
37. Wauman B., Breesch H., Saelens D., Evaluation of the accuracy of the implementation of dynamic effects in the quasi steady-state calculation method for school buildings, Energy and Buildings, 65, 173-184, 2013.
