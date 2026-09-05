# 4. BULGULAR — ilk taslak

> Hedef uzunluk 4,5 sayfa. Tüm sayılar `model/` betiklerinin güncel
> çıktısından alınmıştır ve yeniden üretilebilir.
> **Uyarı:** Ö5 ve Ö8 veri eksikliği nedeniyle ana çalıştırmada yer almaz
> (bkz. 3.4). Malzeme sıralamaları, veri kalitesi tamamlanana kadar
> göstergedir; **yapısal bulgular veri kalitesinden bağımsızdır.**

---

## 4.1. Hesap temelinin doğrulanması

Eşitlik (2)'deki R_diğer parametresi, TS 825:2024 için yayımlanmış asgari
yalıtım kalınlığı tablosuyla kalibre edilmiştir. R_diğer = 0,30 m²K/W
alındığında hesaplanan kalınlıklar sekiz doğrulama noktasının sekizinde de
yayımlanmış değerlerle örtüşmektedir.

**Çizelge 5.** Hesaplanan kalınlıkların yayımlanmış tabloyla karşılaştırılması

| İl (bölge) | U hedefi | λ | Hesaplanan | Yayımlanmış | Durum |
|---|---|---|---|---|---|
| Antalya (1) | 0,45 | 0,035 | 7 cm | ≥ 7 cm | uyumlu |
| Antalya (1) | 0,45 | 0,040 | 8 cm | ≥ 8 cm | uyumlu |
| İstanbul (3) | 0,40 | 0,035 | 8 cm | ≥ 8 cm | uyumlu |
| İstanbul (3) | 0,40 | 0,040 | 9 cm | ≥ 9 cm | uyumlu |
| Ankara (4) | 0,35 | 0,035 | 9 cm | ≥ 9 cm | uyumlu |
| Ankara (4) | 0,35 | 0,040 | 10 cm | ≥ 10 cm | uyumlu |
| Erzurum (6) | 0,25 | 0,035 | 13 cm | ≥ 13 cm | uyumlu |
| Erzurum (6) | 0,25 | 0,040 | 15 cm | ≥ 15 cm | uyumlu |

## 4.2. Orantılılık önermesinin sınanması (AS1)

Bölüm 3.2'de türetilen önerme, sabit U hedefine dayalı kurgunun iklim
bölgesine göre sıralama farkı üretemeyeceğini söylemektedir. Sınama iki
aşamada yapılmıştır.

**Birinci aşama — yuvarlama devre dışı.** Üç ağırlıklandırma yöntemi (entropi,
CRITIC, eşit) ve iki sıralama yöntemi (TOPSIS, VIKOR) için altı bölge arasındaki
Spearman sıra korelasyonu **1,000000**; entropi ağırlıklarının bölgeler arası
azami farkı **0,00 × 10⁰**'dır. Önerme, sayısal olarak tam biçimde
doğrulanmaktadır.

**İkinci aşama — yuvarlama etkin.** Kalınlık en yakın santimetreye
yuvarlandığında korelasyon 0,9938–1,0000 aralığına inmektedir.
**Gözlenen tüm sapmanın kaynağı yuvarlamadır; fiziksel bir bölge etkisi yoktur.**

**Şekil 2.** Bölgeler arası kalınlık oranı: teorik oran ile gerçekleşen
yayılımın karşılaştırılması *(çizilecek)*

| Bölge | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Teorik oran d_b/d_1 | 1,000 | 1,145 | 1,145 | 1,330 | 1,925 | 1,925 |
| Gerçekleşen yayılım | 0,000 | 0,202 | 0,202 | 0,179 | 0,182 | 0,182 |

**AS1'in cevabı: hayır.** Sabit ısıl geçirgenlik hedefine dayalı bir seçim
modelinde bölgeler arası sıralama farkı oluşmaz; bu, veriye bağlı bir sonuç
değil, kurgunun analitik bir sonucudur.

## 4.3. Mekanizmaların etkisi (AS2)

### İklim dengesi
Derece gün değerleri PVGIS (ERA5) aylık ortalamalarından, 20 °C ısıtma ve
22 °C soğutma tabanıyla türetilmiştir (gerekçe: `16-iklim-verisi-duzeltmesi.md`).
Hesap, il–bölge eşleşmesi doğrulanabilen dört bölge için tanımlıdır.

**Çizelge 6.** Bölgelerin ısıtma/soğutma dengesi

| Bölge | Temsilci il | IDG | SDG | Soğutma payı σ |
|---|---|---|---|---|
| 1 · Aşırı Sıcak | Antalya | 1253 | 717 | %36,4 |
| 3 · Ilıman | İstanbul | 2001 | 164 | %7,6 |
| 4 · Soğuk | Ankara | 2933 | 81 | %2,7 |
| 6 · Aşırı Soğuk | Erzurum | 4985 | 0 | %0,0 |

Gradyan tek yönlü ve düzgündür.

### Uygulanabilirlik kısıtı
Azami 20 cm yalıtım kalınlığı kısıtı, uygun alternatif kümesini bölgeye göre
değiştirmektedir. 1–4. bölgelerde eleme yoktur; 5. ve 6. bölgelerde dört
alternatif elenmektedir: **kenevir-kireç (22 cm), saman balya (22 cm), pirinç
kavuzu paneli (26 cm) ve fındık kabuğu paneli (22 cm)**. Elenenlerin tamamı
yüksek ısı iletkenlikli, hacimli biyo-esaslı ürünlerdir.

### Mekanizmaların sıralamaya etkisi

**Çizelge 7.** 1. ve 6. bölge sıralamalarının Spearman korelasyonu

| Kurgu | Spearman(B1, B6) | Ortak alternatif |
|---|---|---|
| Ham model | **0,998** | 18 |
| + uygulanabilirlik kısıtı | 0,982 | 14 |
| + iklim ayarlı ağırlık | **0,567** | 18 |
| + her ikisi (tam model) | 0,824 | 14 |

**Şekil 3.** Mekanizmaların bölge etkisine katkısı *(çizilecek)*

**AS2'nin cevabı:** bölge etkisi, K_b ile orantılı olmayan bir yapı modele
girdiğinde ortaya çıkar. En güçlü etkiyi iklim ayarlı ağırlıklandırma
üretmektedir (0,998 → 0,567). Tam modelin ara değerde kalmasının nedeni,
uygulanabilirlik kısıtının ortak alternatif kümesini 18'den 14'e daraltması ve
karşılaştırmanın bu daraltılmış küme üzerinden yapılmasıdır.

## 4.4. Ağırlıklandırma yönteminin etkisi (AS3)

**Çizelge 8.** Ağırlıklandırma yöntemine göre en ağır ölçüt ve ilk üç
(1. Bölge, tam model, 18 alternatif)

| Yöntem | En ağır ölçüt | Payı | İlk üç |
|---|---|---|---|
| Entropi | Ö7 Yangına tepki | **%32,8** | Kenevir-kireç · Taşyünü · Camyünü |
| CRITIC | Ö6 Biyojenik karbon | %17,6 | Pirinç kavuzu · Fındık kabuğu · Şeker kamışı |
| Eşit | Ö10 Nem/küf | %18,0 | Pirinç kavuzu · Fındık kabuğu · Kenevir-kireç |

Entropi, ağırlığın yaklaşık üçte birini tek bir sıralı ölçüte — yangına tepki
sınıfına — vermektedir. Bu ölçütte mineral esaslı ürünler (A1 sınıfı) diğer
alternatiflerden keskin biçimde ayrıldığı için, yayılıma duyarlı bir yöntem
bu tek ölçüt üzerinden mineral yünleri öne çıkarmaktadır. CRITIC ve eşit
ağırlık ise aynı üç tarımsal atık esaslı paneli ilk sıralara koymaktadır.

Bulgu, doğrulanmış EPD verisiyle çalışılan tam veri alt kümesinde de
korunmaktadır (11 alternatif, 9 ölçüt, 1. Bölge): entropi taşyünü ve camyününü,
CRITIC ile eşit ağırlık ise mantar, saman ve selülozu ilk sıralara
yerleştirmektedir. Dikkat çekici ayrıntı şudur: bu alt kümede CRITIC'in de en
ağır ölçütü yangına tepkidir, ancak payı %16,9'dur. **CRITIC aynı ölçütü
tanımakta, fakat tek başına egemen olmasına izin vermemektedir.**

**AS3'ün cevabı:** ağırlıklandırma yönteminin seçimi, biyo-esaslı
alternatiflerin sıralamadaki yerini belirlemektedir ve bu etki yönlüdür —
entropi, sistematik olarak biyo-esaslı grubun aleyhine çalışmaktadır.

## 4.5. Sıralama yöntemleri arasındaki uyum

TOPSIS ve VIKOR sıralamaları arasındaki Spearman korelasyonu 1. Bölge tam
modelde entropi için 0,350, CRITIC için 0,509, eşit ağırlık için 0,447
düzeyindedir. Bu, iki yöntemin belirgin biçimde farklı sıralamalar ürettiğini
göstermektedir.

Bu sonuç, tek bir sıralamanın "doğru cevap" olarak sunulmasının sakıncalı
olduğunu ortaya koymaktadır ve çalışmanın genel savını desteklemektedir.
Aynı zamanda bir sınırlılıktır: bu çalışmada üretilen hiçbir sıralama,
yöntemden bağımsız bir malzeme tavsiyesi olarak okunmamalıdır.

## 4.6. Sistem sınırının etkisi

Yaşam döngüsü modülleri incelendiğinde, biyo-esaslı malzemelerin A1–A3'te
aldığı biyojenik karbonun C3'te yeniden salındığı görülmektedir. Altı
malzemede alım ve salım ±0,04 kgCO₂e/kg içinde birbirini götürmektedir
(ahşap lifi +0,038; koyun yünü +0,041; selüloz +0,041; saman +0,022;
mantar +0,023; geri dönüşüm tekstil +0,106).

**Çizelge 9.** Sistem sınırına göre yaşam döngüsü karbonu (kgCO₂e/kg)

| Malzeme | S1 (A1–A3) | S2 (+C) | S3 (+C+D) |
|---|---|---|---|
| Selüloz | **−1,599** | 0,273 | −0,239 |
| Saman balya | −1,294 | 0,210 | 0,135 |
| Mantar (ICB) | −1,064 | 0,540 | 0,228 |
| Ahşap lifi | −1,017 | 0,760 | 0,239 |
| Koyun yünü | −0,831 | 0,775 | 0,475 |
| Geri dön. tekstil | −0,358 | 1,242 | 0,864 |
| Kenevir lifi | 0,373 | 2,536 | 2,065 |
| Keten lifi | 0,890 | 3,053 | 2,583 |
| Camyünü | 1,079 | 1,086 | 1,033 |
| XPS | 3,188 | 6,880 | 5,497 |

**Çizelge 10.** Sistem sınırına göre birinci sıra (CRITIC, tam model)

| Bölge | S1 | S2 | S3 |
|---|---|---|---|
| 1 · Aşırı Sıcak | Saman balya | **Camyünü** | Selüloz |
| 2 · Sıcak | Saman balya | **Camyünü** | Camyünü |
| 3 · Ilıman | Saman balya | **Camyünü** | Camyünü |
| 4 · Soğuk | Mantar (ICB) | **Camyünü** | Camyünü |
| 5 · Çok Soğuk | Mantar (ICB) | **Camyünü** | Camyünü |
| 6 · Aşırı Soğuk | Mantar (ICB) | **Camyünü** | Camyünü |

Sınırlar arası Spearman korelasyonu: S1–S2 = 0,758 · S1–S3 = 0,697 ·
S2–S3 = 0,939.

**Sağlamlık.** Sürüm anomalisi taşıyan kenevir ve keten kayıtları
çıkarıldığında etki zayıflamamakta, güçlenmektedir: Spearman(S1, S2)
1. Bölgede 0,758'den **0,333'e**, 4. Bölgede 0,612'den **0,286'ya**
inmektedir. Bulgu ağırlıklandırma yönteminden de bağımsızdır; CRITIC ve eşit
ağırlık, S1'de biyo-esaslı bir malzemeden S2'de camyününe geçmektedir.

### 4.6.1. Yaşam sonu senaryosunun duyarlılığı

4.6'daki karşılaştırma, ürün beyanlarında ilan edilen yaşam sonu senaryosunu
(enerji geri kazanımlı yakma) esas almaktadır. Senaryonun sonucu ne ölçüde
belirlediğini ölçmek için, C3 modülünde beyan edilen salımın gerçekleşen
oranı bir duyarlılık parametresi olarak tanımlanmıştır:

    φ = gerçekleşen salım / C3'te beyan edilen salım                  (12)

φ = 1 beyan edilen senaryoyu, φ = 0 ise depolanan biyojenik karbonun yaşam
sonunda hiç salınmadığı sınır durumu temsil eder. φ bir senaryo verisi değil,
senaryo belirsizliğini tarayan bir parametredir.

**Çizelge 12.** Camyününün birinci sıraya geçtiği salım oranı eşiği (φ\*)

| Bölge | CRITIC | Eşit ağırlık | Entropi |
|---|---|---|---|
| 1 · Aşırı Sıcak | 0,82 | 0,93 | 0,00 |
| 3 · Ilıman | 0,73 | 0,63 | 0,00 |
| 4 · Soğuk | 0,71 | 0,60 | 0,00 |
| 6 · Aşırı Soğuk | 0,51 | 0,58 | 0,00 |

**Şekil 6.** Salım oranına göre birinci sıradaki alternatif *(çizilecek)*

Üç sonuç çıkmaktadır.

**Birincisi**, biyo-esaslı üstünlük yalnızca yüksek salım oranlarında
kaybolmaktadır. CRITIC ağırlıklandırmasında eşik 0,51 ile 0,82 arasındadır;
yani depolanan biyojenik karbonun **yarısından fazlası** yaşam sonunda
salınmadıkça biyo-esaslı bir malzeme birinci sırada kalmaktadır. 4.6'daki
sıralama değişimi, bu nedenle "biyo-esaslı malzemeler geride kalır"
biçiminde değil, "beyan edilen yakma senaryosu altında geride kalır"
biçiminde okunmalıdır.

**İkincisi**, eşik sıcak bölgelerde daha yüksektir (1. Bölge 0,82; 6. Bölge 0,51). Sıcak bölgelerde biyo-esaslı malzemeler ısıl kütle üzerinden ek bir
üstünlük taşıdığı için, birinci sırayı kaybetmeden daha büyük bir karbon
yükünü soğurabilmektedirler.

**Üçüncüsü**, entropi ağırlıklandırmasında eşik her bölgede 0,00'dır: camyünü,
salım oranından tamamen bağımsız olarak birinci sıradadır. Bu, 4.4'teki
bulgunun bir başka görünümüdür — entropi altında sıralamayı yangına tepki
ölçütü belirlemekte, karbon muhasebesi sonucu hiç etkilememektedir.

**Önemli sınırlılık.** Düşük φ değerleri, biyo-esaslı malzemenin düzenli
depolamaya gönderilmesi durumuna karşılık gelebilir; ancak depolamada
biyobozunma sonucu oluşan metanın küresel ısınma potansiyeli karbondioksitten
yüksektir. Bu nedenle düşük φ, doğrudan "daha iyi iklim performansı" anlamına
gelmez. Çizelge 12, senaryonun sonucu ne kadar belirlediğini gösterir;
hangi senaryonun tercih edilmesi gerektiğini söylemez.

## 4.7. Aylık enerji hesabı ve ısıl kütlenin rolü

Referans konut üzerinde yapılan aylık hesap, kazanç kullanım faktörünün
biçimine göre iki farklı sonuç vermektedir.

**Kurgu A (τ'dan bağımsız kullanım faktörü):** on sekiz alternatifin tamamı
birebir aynı yıllık ısıtma enerjisi ihtiyacını vermektedir (4. Bölge için
55 992 kWh/yıl; 43,4 kWh/m²). Malzemeler arası yayılım **0 kWh, %0,00**'dır.
Bu beklenen sonuçtur: sabit U hedefi altında özgül ısı kaybı H malzemeden
bağımsızdır ve τ'dan bağımsız bir kullanım faktörü ısıl kütleyi görmez.

**Kurgu B (τ'ya bağlı kullanım faktörü):** malzemeler arasında fark
oluşmaktadır ve bu fark bölgeye göre belirgin biçimde değişmektedir.

**Çizelge 11.** Referans konutun bölgelere göre enerji ihtiyacı ve ısıl
kütlenin katkısı (PVGIS iklimi, kurgu B)

| Bölge | Temsilci il | QH (kWh/m²) | QC (kWh/m²) | Toplam | Isıl kütle katkısı (kWh/m²) |
|---|---|---|---|---|---|
| 1 · Aşırı Sıcak | Antalya | 2,4 | 54,8 | 57,2 | 1,94 |
| 3 · Ilıman | İstanbul | 7,9 | 33,1 | 41,0 | 2,35 |
| 4 · Soğuk | Ankara | 16,8 | 28,9 | 45,6 | 2,56 |
| 6 · Aşırı Soğuk | Erzurum | 33,8 | 14,3 | 48,1 | 2,89 |

### 4.7.1. Isıl kütlenin katkısı mutlak olarak küçüktür ve bölgeden az etkilenir

Isıl kütlenin en hafif (camyünü) ile en ağır (pirinç kavuzu paneli) alternatif
arasında yarattığı yıllık enerji farkı **1,94 ile 2,89 kWh/m²·yıl** arasındadır.
Bölgeler arası değişim yaklaşık 1,5 kattır; toplam ihtiyacın kendisi
41–57 kWh/m²·yıl aralığındadır.

**Yüzdesel ifade yanıltıcıdır.** Isıtma tarafında fark 1. Bölgede %26,8'e
ulaşmakta, 6. Bölgede %3,7'ye inmektedir; ancak bu, ısıtma ihtiyacının 1.
Bölgede yalnızca 2,4 kWh/m²·yıl olmasından kaynaklanır. Aynı %26,8, mutlak
olarak **0,64 kWh/m²·yıl** demektir. Soğutma tarafında oran ters yönde işler
(%2,4 → %11,5), fakat mutlak fark 1,29–1,65 kWh/m²·yıl bandında kalır.
**Karşılaştırmalarda mutlak değer kullanılmalıdır.**

**Aylık yöntemin ısıl kütle körlüğü.** Dış ortam sıcaklığının iç tasarım
sıcaklığını (26 °C) aştığı aylarda iletim de kazanç tarafına geçer ve kayıp
kullanım faktörü uygulanamaz; bu aylarda ısıl kütle hesaba **hiç girmez**.
Bu, çalışmanın genel savının dördüncü örneğidir: **hesap yönteminin yapısı,
sonucun ne gösterebileceğini belirlemektedir.** Aylık yarı-kararlı yöntem,
ısıl kütleyi fiziksel katkısının en yüksek olduğu koşullarda görememektedir;
doğru değerlendirme saatlik dinamik simülasyon gerektirir.

**Sınırlılık.** Soğutma sonuçları mutlak değer olarak ihtiyatla okunmalıdır.
Gece havalandırması, gölgeleme kontrolü ve iç kazançların mevsimsel değişimi
modellenmemiş; iç kazanç yıl boyunca sabit 5 W/m² alınmıştır.

## 4.8. Duyarlılık analizi

**Güneş ışınımı.** Işınım şiddeti ±%50 ölçeklendiğinde malzemeler arası enerji
farkı %0,93–2,49 aralığında kalmaktadır; büyüklük mertebesi değişmemektedir.

**Ö6 ve Ö9'un çıkarılması.** Tam veri alt kümesinde gömülü karbon ölçütü
eklenip çıkarıldığında Spearman 0,936–0,973 aralığındadır ve hiçbir bölgede
birinci sıra değişmemektedir. Gömülü karbon bu ölçüt setinde **belirleyici
değil, ayırt edicidir**.

**Diğer eksenler.** İklim ayarı katsayısı α, azami kalınlık eşiği d_maks ve
R_diğer değeri üzerindeki duyarlılık analizleri metnin son hâlinde
tamamlanacaktır.

---

## Yazım notları

- 4.2 ve 4.6 makalenin iki ana bulgusudur; 4.4 üçüncüsüdür. Bu üçü aynı savı
  farklı yollardan destekler ve Tartışma'da birlikte ele alınmalıdır.
- 4.5 (TOPSIS–VIKOR uyumsuzluğu) hem bulgu hem sınırlılıktır. Gizlenmemeli:
  hakem bunu kendisi fark ederse makale zarar görür, biz söylersek tutarlılık
  göstergesi olur.
- 4.7'deki A/B ayrımı, TS 825:2024'ün kullanım faktörü biçimi doğrulandıktan
  sonra tek bir sonuca indirgenecek ya da mevzuat bulgusu olarak korunacaktır.
- Malzeme adları geçen her yerde "göstergedir" uyarısı korunmalı; özellikle
  4.4 ve 4.6'daki ilk sıra isimleri.
- Üretilecek görseller: Ş2 orantılılık, Ş3 mekanizma katkısı, Ş4 bölgelere göre
  sıralama, Ş5 duyarlılık ısı haritası.
