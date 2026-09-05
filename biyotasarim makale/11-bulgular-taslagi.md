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
TS 825:2024 aylık dış sıcaklıklarından türetilen derece gün değerleri, bölgeler
arasında tek yönlü ve düzgün bir gradyan göstermektedir.

**Çizelge 6.** Bölgelerin ısıtma/soğutma dengesi

| Bölge | IDG | SDG | Soğutma payı σ |
|---|---|---|---|
| 1 · Aşırı Sıcak | 1908 | 1187 | %38,4 |
| 2 · Sıcak | 2482 | 1054 | %29,8 |
| 3 · Ilıman | 3356 | 475 | %12,4 |
| 4 · Soğuk | 4174 | 102 | %2,4 |
| 5 · Çok Soğuk | 6333 | 0 | %0,0 |
| 6 · Aşırı Soğuk | 7304 | 0 | %0,0 |

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
| + iklim ayarlı ağırlık | **0,534** | 18 |
| + her ikisi (tam model) | 0,824 | 14 |

**Şekil 3.** Mekanizmaların bölge etkisine katkısı *(çizilecek)*

**AS2'nin cevabı:** bölge etkisi, K_b ile orantılı olmayan bir yapı modele
girdiğinde ortaya çıkar. En güçlü etkiyi iklim ayarlı ağırlıklandırma
üretmektedir (0,998 → 0,534). Tam modelin ara değerde kalmasının nedeni,
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

**Çizelge 11.** En hafif (camyünü) ve en ağır (kenevir-kireç) alternatif
arasındaki yıllık enerji farkı

| Bölge | QH hafif (kWh) | QH ağır (kWh) | Fark | Fark % |
|---|---|---|---|---|
| 1 · Aşırı Sıcak | 14 929 | 14 030 | 900 | **%6,03** |
| 2 · Sıcak | 22 911 | 22 003 | 908 | %3,96 |
| 3 · Ilıman | 36 639 | 35 794 | 846 | %2,31 |
| 4 · Soğuk | 48 534 | 47 796 | 739 | %1,52 |
| 5 · Çok Soğuk | 75 513 | 74 731 | 783 | %1,04 |
| 6 · Aşırı Soğuk | 94 939 | 94 117 | 822 | **%0,87** |

Isıl kütlenin sağladığı avantaj, soğutma payının yüksek olduğu bölgede en
büyük (%6,03), ısıtma yükünün baskın olduğu bölgede en küçüktür (%0,87).
Bu gradyan, 4.3'teki iklim ayarlı ağırlıklandırmadan **bağımsız** olarak elde
edilmiştir ve onunla **aynı yöndedir**; iki farklı yoldan aynı fiziksel
sonuca ulaşılması modelin iç tutarlılığını desteklemektedir.

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
