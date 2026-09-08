# Hakem Değerlendirmesine Yanıt

Değerlendirmedeki her madde ayrı ayrı denetlenmiştir. Aşağıda maddenin
doğru olup olmadığı, doğrulama yöntemi ve yapılan işlem verilmektedir.

---

## Kabul edilen ve düzeltilen maddeler

### 1. Karbon ölçütündeki iç çelişki — **kısmen doğru, düzeltildi**

Hakem dört ifadenin aynı anda doğru olamayacağını söylüyor. Kodu denetledim:
üçü tutarlıydı, biri değildi.

- Tablo 2 dokuz ölçütün **tamamını** listeliyor (ölçüt havuzu).
- Ana çalıştırma bunlardan sekizini kullanıyor; Ö5 gömülü karbon eksik veri
  nedeniyle dışarıda. Yani Ö6 biyojenik karbon ana çalıştırmadadır.
- Tablo 5'in (yeni Tablo 6) CRITIC satırında Ö6'nın çıkması bununla tutarlıdır.
- Bölüm 2.7'deki "tek yaşam döngüsü karbonu ölçütü" ifadesi **yalnızca sistem
  sınırı çözümlemesi** içindir; ayrı bir ölçüt setidir (`OLCUTLER_SINIR`).

Çelişki bunlarda değil, **Öz'deydi**: Öz ana çalıştırmanın ölçütleri arasında
"yaşam döngüsü karbonu" yazıyordu, oysa ana çalıştırmada biyojenik karbon var.
Öz düzeltildi. Ayrıca Tablo 2'ye "Ana çalıştırma" sütunu eklendi ve 2.7'de iki
ölçüt setinin farkı açıkça yazıldı.

### 2. EN ISO 13790 güncel değil — **doğru, düzeltildi**

ISO 13790:2008 geri çekilmiş, yerini ISO 52016-1:2017 almıştır. Metin, hakemin
önerdiği çerçeveye getirildi: aylık yarı-kararlı biçim "tarihsel olarak
EN ISO 13790 ile tanımlanmış hesap mantığı" olarak sunuluyor, standardın geri
çekildiği belirtiliyor ve ISO 52016-1 kaynakçaya eklendi ([36]). Bölüm 3.6 ve
Sonuçlar, saatlik çözünürlük gerekliliğini ISO 52016-1'e atıfla ifade ediyor.

### 3. PVGIS verisi güncel değil — **doğru, veri yenilendi**

API sınandı: `v5_2` 2005–2020 ile sınırlı, `v5_3` mevcut ve PVGIS-SARAH3 + ERA5
ile **2005–2023** sunuyor. Gerekçe yazmak yerine veri yenilendi. Yeni bir betik
(`model/iklim_cek.py`) eklendi; iklim girdisi 19 yıllık uzun dönem ortalaması
oldu. Derece gün değerleri ve enerji sonuçları buna göre yeniden hesaplandı.

### 4. "ÖKOBAUDAT = doğrulanmış ürün beyanları" — **doğru, düzeltildi**

Metin "yaşam döngüsü değerlendirmesi veri kümeleri" ifadesine çevrildi ve veri
tabanının ürün beyanı temelli, ortalama, temsilî ve jenerik kayıtları bir arada
sunduğu 2.7'de açıkça yazıldı. Genişletilmiş İngilizce özette de düzeltildi.

### 5. EN 15804 sürümü — **doğru, düzeltildi**

Kaynak `EN 15804:2012+A2:2019` olarak verildi ([34]).

### 7. "TS 825'in sonucu" ile "modelin sonucu" ayrımı — **doğru, düzeltildi**

Önermenin kapsamı, dayandığı varsayımla birlikte açıkça sınırlandırıldı:
"malzemeden bağımsız ve sabit bir katman direnci varsayımı altında". Öz, 2.1,
3.1 ve Sonuçlar bu biçimde yeniden yazıldı. 2.1'e ayrıca kapsamın nerede
kırıldığını anlatan bir paragraf eklendi.

Bir noktada hakem yanılıyor: orantılılık için R_diğer'in **bölgeden** bağımsız
olması gerekmez, yalnızca **malzemeden** bağımsız olması yeterlidir. Bölgeye
göre değişen bir R_diğer, K_b = 1/U_b − R_diğer(b) tanımına girer ve yine
malzemeden bağımsız kalır. Metin bu nedenle yalnızca malzeme bağımsızlığını
şart koşuyor.

### 8. R_diğer = 0,30 için "doğrulama" iddiası — **doğru, düzeltildi**

Bölüm başlığı "Hesap Temelinin Doğrulanması" yerine "Hesap Temelinin Çapraz
Kontrolü" oldu. Metin, bunun bağımsız bir doğrulama olmadığını, parametrenin
tabloyu yakalayacak biçimde seçildiğini açıkça söylüyor. Buna karşılık 0,30'un
fiziksel makullüğü ayrıca gerekçelendirildi (yüzeysel dirençler ≈ 0,17 m²K/W,
üzerine tuğla ve sıva katmanları).

### 9. n_h birimi — **doğru, ve altından daha büyük bir hata çıktı**

Hakem birim tutarsızlığını yakaladı. Koda bakınca hata yalnızca etikette değil
formüldeydi: `H_V = 0,33 · A_f · n_h` kullanılıyordu; yani TS 825'in
h⁻¹ birimli hava değişim sayısı, hacim yerine döşeme alanıyla çarpılıyordu. Bu,
havalandırma ısı kaybını yaklaşık 2,24 kat eksik hesaplıyordu. Formül standardın
kendi biçimine getirildi:

    H_V = 0,33 · n_h · V_h,  V_h = 0,8 · V_brüt,  n_h = 0,7 h⁻¹

Simge listesinde birim h⁻¹ oldu. Referans konutun özgül ısı kaybı 4. bölgede
1467 W/K'dır. Tüm enerji sonuçları yeniden hesaplandı.

### 10. Isıl kütle bölümü yeniden üretilebilir değil — **doğru, genişletildi**

Bölüm 2.8 yeniden yazıldı; a₀ = 1,0 ve τ₀ = 15 saat değerleri, kullanım
faktörünün açık biçimi, iç kazanç (5 W/m² × kullanım alanı), güneş kazancı
(gölgelenme 0,6, güneş geçirme 0,6, dört yön), etkin ısıl kapasite bileşenleri,
havalandırma formülü ve τ'nun gerçekleşen aralığı (41,2–75,1 saat) verildi.
Gece havalandırmasının neden modellenmediği de yazıldı.

### 11. "Isıl kütle görülemez" fazla genel — **doğru, yumuşatıldı**

İfade, hakemin önerdiği biçime getirildi: "kullanılan aylık yarı-kararlı biçimin
ısıl kütle etkilerine duyarlılığı, saatlik dinamik bir yaklaşıma kıyasla
sınırlıdır". ISO 52016-1'in saatlik yordamları kapsadığı belirtildi.

### 12. Dört bölge / altı bölge — **doğru, netleştirildi**

Denetimde kodun bunu **sessizce** yaptığı görüldü: iklim verisi olmayan 2. ve
5. bölgelerde `iklim_ayari` ayarı uygulamadan geri dönüyordu, yani "tam model"
bu iki bölgede farklı bir modeldi. Bu düzeltildi: iklim ayarı artık bu bölgeler
için hata veriyor ve iklime bağlı çözümlemeler dört bölgeyle sınırlı olarak
raporlanıyor. Buna karşılık orantılılık sınaması ve uygulanabilirlik kısıtı
iklim verisi gerektirmediği için altı bölgenin tamamında yürütülüyor. Bölüm
2.4, 3.1 ve Sınırlılıklar bu ayrımı açıkça yazıyor.

### 13. "Biyo-bazlı malzemeler düşük emisyonludur" fazla genel — **doğru**

"düşük olabilmektedir" biçimine çevrildi ve bunun malzeme sınıfının değil tekil
ürünün özelliği olduğu, yetiştirme, bağlayıcı, kurutma, presleme ve taşımaya
bağlı değiştiği eklendi.

### 14. "Lignoselülozik" genellemesi — **doğru**

İfade "bitkisel kökenli olanların" biçimine çevrildi ve koyun yünü (hayvansal)
ile miselyum (fungal) için aynı mekanizmanın geçerli olmadığı yazıldı.

### 15 ve 29. Malzeme kaynakları ve tam karar matrisi — **doğru, en büyük düzeltme**

Denetimde asıl sorunun bir kaynak eşleşmesi değil, sistematik bir izlenebilirlik
açığı olduğu görüldü: on sekiz alternatifin altısında ısı iletkenliği, sekizinde
yoğunluk hiçbir hakemli kaynağa bağlanmamış, veri dosyasında `DOLDUR` olarak
duruyordu.

Yapılanlar:

- Tablo 1'e **özgül ısı, yangın sınıfı, kaynak ve veri kalitesi** sütunları
  eklendi; kaynağı olmayan hücreler açıkça "gösterge" olarak işaretlendi.
- Ek dosya olarak **Ek Tablo S1** (tam karar matrisi, 18 × 8),
  **Ek Tablo S2** (hücre bazında kaynak ve kalite) ve **Ek Tablo S3**
  (kullanılan ÖKOBAUDAT veri kümelerinin UUID, sürüm yılı ve referans birimi)
  üretildi (`05-ek-tablolar.docx`).
- Sınırlılıklar bölümü sayıyı açıkça veriyor: λ ortalama kalite 2,72/5,
  ρ ortalama 2,50/5.

### 16. Kaynak [11] yanlış eşleşmiş — **doğru, ve düzeltme veriyi de değiştirdi**

Hakem haklı: Gößwald ve ark. ladin kabuğu lifi çalışmasıdır, ayçiçeği için
kullanılamaz. Denetimde daha kötüsü çıktı: ayçiçeği satırının λ ve ρ değerleri
de hiçbir tekil kaynağa dayanmıyordu.

Doğrulanabilir kaynak arandı ve bulundu: Mati-Baouche ve ark. (2014),
*Industrial Crops and Products*, 58, 244–250. Tam metni açık arşivden okundu.
Ölçülen değerler λ = 0,056–0,058 W/mK ve ρ = 150–200 kg/m³'tür. Veri buna göre
düzeltildi (λ 0,040 → 0,056; ρ 75 → 150) ve alternatifin adı ölçülen malzemeye
uyacak biçimde "Ayçiçeği sapı-kitosan kompozit" oldu. Gößwald ve ark. metinde
kendi konusuyla, ladin kabuğu lifi levhalarıyla anılıyor.

Aynı denetimde **şeker kamışı küspesi** satırının da kaynaksız olduğu görüldü.
Doğrulanabilir kaynak bulundu: Mohammed ve ark. (2024), *Cellulose Chemistry
and Technology*, 58, 331–338; tam metin okundu, λ = 0,082 W/mK ve ρ = 614 kg/m³.
Veri düzeltildi (λ 0,055 → 0,082; ρ 250 → 614).

Bu iki düzeltmenin sonuçlara etkisi büyüktür ve raporlanmıştır: şeker kamışı
levhası artık 20 cm uygulanabilirlik kısıtını 4.–6. bölgelerde aşmakta,
elenen alternatif sayısı soğuk bölgelerde dörtten altıya çıkmakta ve kısıtın
ürettiği bölge etkisi belirgin biçimde güçlenmektedir (Spearman 0,982 → 0,497).

### 20. VIKOR terminolojisi — **doğru, düzeltildi**

"Yöntem tutarlılığı kontrolü" ifadesi kaldırıldı; VIKOR "toplulaştırma mantığı
farklı olduğu için tamamlayıcı bir sıralama yöntemi" olarak tanımlandı ve iki
yöntemin aynı sonucu vermesinin beklenmediği açıkça yazıldı.

### 22. Yangına tepki sınıfının sayısallaştırılması — **doğru, yeni çözümleme eklendi**

Kodlama şeması metinde yoktu. Eklendi: Tablo 3, üç kodlamayı (doğrusal 7 düzey,
gruplu 3 düzey, ikili) ve her birinin entropi ile CRITIC ağırlığına ve
sıralamaya etkisini veriyor. Yeni bir alt bölüm (3.4) sonucu tartışıyor.

Bulgu şudur: doğrusal ile gruplu kodlama arasında pratik fark yok
(Spearman 0,979–0,994); ikili kodlama entropi ağırlığını %30,4'ten %38,5'e
çıkarıyor ve entropi sıralamasının korelasyonunu 0,453'e düşürüyor, buna karşılık
CRITIC 0,744 ve eşit ağırlık 0,903 düzeyinde kalıyor. Yani entropinin bu ölçüte
yüklenmesi kodlamadan bağımsız, hatta kaba kodlamada güçleniyor; ama entropi
ağırlıklandırmasının kendisi sıralı ölçütün gösterimine duyarlı.

### 23. "Sistematik olarak dezavantajlı kılıyor" — **doğru, yumuşatıldı**

Öne Çıkanlar maddesi değiştirildi. Metinde ifade, hakemin önerdiği biçime
yakın olarak "entropi ağırlıklandırması bu ölçüt seti ve bu veri gösterimi
altında mineral esaslı alternatifleri öne çıkarmaktadır" oldu.

### 24. A1–A3'ün karbon-negatif görünmesi — **doğru, netleştirildi**

Bölüm 2.7'ye, bunun malzemenin değil sistem sınırının ve biyojenik karbon
muhasebesinin sonucu olduğunu söyleyen açık bir paragraf eklendi.

### 25. S2/S3 karbon değerlerinin izlenebilirliği — **doğru**

Ek Tablo S3 her malzeme için ÖKOBAUDAT veri kümesi adı, **UUID**, sürüm yılı ve
referans birimini veriyor. EN 15804 A1/A2 sürüm ayrımı 2.7'de açıkça yazıldı ve
veri setinde gözlenen somut fark (kenevir ve keten için 2022/2023 kayıtları
arasında ≈1,5 kgCO₂e/kg) raporlandı; sonucun bu seçime duyarlılığı 3.5'te
ayrıca veriliyor.

### 26. %50 eşiği gerekçesiz — **doğru, ve metin gerçekte uygulanandan farklıydı**

Denetimde metnin kuralı yanlış anlattığı görüldü. Kodun uyguladığı kural %50
değil, **eksiksiz veri** (eşik 0) kuralıdır; %50 eşiğinde gömülü karbon
(7/18 eksik) sette kalırdı. Metin gerçekte uygulanan kurala göre düzeltildi.
Eşik duyarlılığı da eklendi ve raporlandı: %25'te ölçüt seti değişmiyor,
%50 ve %75'te gömülü karbon sete giriyor ancak yedi alternatifte veri
bulunmadığı için model çalıştırılamıyor. Yani bu veri setinde uygulanabilir
tek eşik eksiksiz veri kuralıdır.

### 27. Tablo 2'de birimler — **doğru, düzeltildi**

Bütün ölçütlere birim yazıldı (W/mK, kg/m², kJ/m²K, kgCO₂e/m², sıralı 1–7,
sıralı 1–5, cm) ve "Ana çalıştırma" sütunu eklendi.

### 28. "Duvar kalınlığı kaybı" adlandırması — **doğru, düzeltildi**

Ölçüt "Gerekli yalıtım kalınlığı" oldu; hem metinde hem kodda
(`model.py`, `duyarlilik.py` çıktıları) değiştirildi.

### 30. Girişteki ilk cümle kaynaksız — **doğru, düzeltildi**

Cümle kaynaklandırıldı ([1], enerji denge tabloları) ve "yaklaşık üçte biri"
ifadesi "üçte bire yakın" olarak yumuşatıldı.

### 31. İZODER basın bülteni — **kısmen doğru, düzeltildi**

Kaynak sicilinde bu aslında bir basın bülteni değil, teknik bir sunumdur.
Kaynak buna göre düzeltildi ([3], Diz T., İZODER teknik sunumu) ve metinde
sektör kuruluşunun teknik sunumu olarak konumlandırıldı. Resmî Gazete tebliğinin
sayı bilgisine erişilemediğinden uydurulmadı; yürürlük tarihi bu kaynağa
dayandırıldı.

### 32. "120–150 → 70–90" nüansı — **doğru, düzeltildi**

İfade hakemin önerdiği biçime getirildi: "sektörel olarak 120–150 kWh/m²·yıl
düzeyinde ifade edilen önceki durumdan, bina türüne ve bölgeye bağlı olarak
tanımlanan daha düşük limitlere".

### 33. Dört ayrı çözümleme olarak kurgulama — **doğru, uygulandı**

Bölüm 2'nin girişine dört bağımsız sınamanın adı yazıldı ve Bölüm 3 bu sıraya
göre yeniden düzenlendi: 3.1 analitik değişmezlik, 3.2 uygulanabilirlik,
3.3 ağırlıklandırma, 3.4 ölçüt gösterimi (yeni), 3.5 sistem sınırı,
3.6 ısıl kütle.

### 34. "Veri kalitesinden bağımsızdır" fazla güçlü — **doğru, düzeltildi**

Sınırlılıklar bölümü ayrım yapıyor: 3.1'deki analitik sonuç kurgudan türediği
için veri setinden bağımsız; 3.2–3.6'daki nicel bulgular veri kalitesine ve
ölçüt gösterimine duyarlı.

### 35. Anahtar cümlenin güçlendirilmesi — **kabul edildi**

Cümle, hakemin önerdiği yöne çekildi: "bir malzeme sıralaması, malzemelerin
içkin bir özelliği olarak okunamaz; fonksiyonel birim tanımı, ağırlıklandırma
yöntemi, ölçüt gösterimi, sıralama yöntemi ve yaşam döngüsü sistem sınırı
birlikte beyan edildiğinde yorumlanabilir bir sonuçtur."

---

## Katılınmayan maddeler

### 17. Kaynak [10]'da bibliyografik hata — **yanlış**

Hakem "Materials, 17, 9, 2021, 2024" yazımını hatalı buluyor ve "2021'in makale
numarası olduğunu" söylüyor. Bu doğru; ancak yazım da doğrudur. Dergi biçimi
*dergi, cilt, sayı, makale/sayfa, yıl* sırasını kullanır. Aynı kaynakçadaki
"Sustainability, 16, 3, 1190, 2024" kaydı da aynı yapıdadır. Değişiklik
yapılmadı.

### 7 (kısmi). R_diğer'in bölge bağımsızlığı gerekliliği — **yanlış**

Yukarıda 7. maddede açıklandı: orantılılık için yalnızca malzeme bağımsızlığı
gereklidir.

---

## Hakemin kaçırdığı, denetimde çıkan hatalar

Bunlar değerlendirmede yoktu; kod ve kaynak denetiminde bulundu ve düzeltildi.

1. **Havalandırma ısı kaybı formülü yanlıştı** (bkz. madde 9). Etkisi yalnızca
   bir birim etiketi değil, enerji sonuçlarının tamamıydı.
2. **İki kaynak, desteklemedikleri iddialara bağlanmıştı.** Aylık yarı-kararlı
   yöntemin sınırları için bir ÇKKV yalıtım seçimi çalışması, saatlik dinamik
   simülasyon gerekliliği için bir DEA-TOPSIS çalışması gösteriliyordu. Birincisi
   için konuyu birebir ele alan bir çalışma bulundu (Wauman ve ark., 2013, [37]);
   ikincisi ISO 52016-1'e bağlandı.
3. **Ağırlıklandırma iddiaları için üç Türkçe kaynak yanlış yerdeydi.** Bu
   kaynaklar (optimum yalıtım kalınlığı, enerji verimli yenileme, Türkiye bina
   enerjisi) gerçekte destekledikleri cümlelere taşındı; ağırlıklandırma
   iddiaları için konuya özgü kaynaklar eklendi (Mukhametzyanov 2021 [28],
   Diakoulaki ve ark. 1995 [29]).
4. **Şeker kamışı küspesi verisi kaynaksızdı** (bkz. madde 16).
5. **İklim ayarı iki bölgede sessizce atlanıyordu** (bkz. madde 12).
6. **Metindeki eksik veri kuralı, kodun uyguladığı kuraldan farklıydı**
   (bkz. madde 26).

---

## Etkilenen sayılar

Havalandırma formülü, iklim verisi ve iki malzeme satırı değiştiği için
metindeki nicel sonuçların çoğu yeniden hesaplanmıştır. Yapısal bulgular
korunmuş, bazıları güçlenmiştir.

| Büyüklük | Önce | Sonra |
|---|---|---|
| Bölgeler arası Spearman (yuvarlamasız) | 1,000000 | 1,000000 |
| Ham model Spearman (1.–6. bölge) | 0,998 | 0,990 |
| + uygulanabilirlik kısıtı | 0,982 | 0,497 |
| + iklim ayarlı ağırlık | 0,567 | 0,513 |
| Kısıtın elediği alternatif (6. bölge) | 4 | 6 |
| Entropi w(Ö7) | %32,9 | %30,4 |
| TOPSIS–VIKOR Spearman | 0,350–0,509 | 0,352–0,633 |
| Sistem sınırı Spearman(S1,S2) | 0,758 | 0,648 |
| Salım oranı eşiği (CRITIC) | 0,51–0,82 | 0,51–0,81 |
| Isıl kütle katkısı | 1,94–2,89 kWh/m²·yıl | 5,57–7,74 kWh/m²·yıl |
| Referans konut Q_H (4. bölge) | 16,8 kWh/m² | 28,6 kWh/m² |

---

## Kapatılamayan maddeler

- **2. ve 5. bölgeler için temsilci il.** TS 825:2024'ün il-bölge listesine
  erişilemediğinden bu iki bölge için doğrulanabilir temsilci il
  belirlenememiştir. Hakemin ikinci seçeneği uygulandı: iklime bağlı
  çözümlemelerin dört bölgeyle sınırlı olduğu açıkça yazıldı.
- **Altı satırın ısı iletkenliği ve sekiz satırın yoğunluğu** hâlâ hakemli tek
  bir kaynağa bağlanamamıştır (selüloz, saman balya, fındık kabuğu paneli, EPS,
  XPS, camyünü). Uydurulmuş kaynak verilmemiş, bu hücreler "gösterge" olarak
  işaretlenmiş ve Ek Tablo S2'de açıkça listelenmiştir.
- **Maliyet ölçütü** için veri bulunamamıştır; ölçüt tanımlanmamıştır.
- **TS 825:2024 tam metni** (kazanç kullanım faktörünün standarttaki biçimi,
  Ek-C ışınım tablosu, Ek-E) hâlâ elde değildir.
