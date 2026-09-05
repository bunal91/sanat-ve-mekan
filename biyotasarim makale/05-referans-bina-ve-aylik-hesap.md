# Referans Konut ve TS 825 Aylık Hesabı — kurulum ve kritik bulgu

**Dosyalar:** `model/girdi_referans_bina.csv`, `model/ts825_aylik.py`

---

## 1. Önce bir düzeltme

Önceki notta üçüncü mekanizmayı "TS 825'in aylık yönteminde kazanç kullanım
faktörü τ = C/H üzerinden hesaplanır" diye tarif etmiştim. **Bu, standardın
2008 sürümü için yanlış.** TS 825:2008'de kullanım faktörü

```
η = 1 − exp(−1/KKO)          KKO = kazançlar / kayıplar
```

biçimindedir ve **zaman sabitine hiç bağlı değildir**. EN ISO 13790'ın
τ'ya bağlı biçimi ise farklıdır:

```
η = (1 − γ^a) / (1 − γ^(a+1)),     a = a₀ + τ/τ₀,     τ = C/H
```

TS 825:2024'ün hangisini benimsediği standardın metninden **doğrulanmalıdır.**
Bu, projenin şu andaki tek kritik açık sorusudur ve cevabı yöntemi belirler.

---

## 2. Neden bu soru her şeyi belirliyor

Fonksiyonel birim sabit U hedefine dayandığı için, yalıtım malzemesi
değiştiğinde binanın özgül ısı kaybı H **değişmez** — tanım gereği hepsi aynı
U değerini sağlar. Havalandırma kaybı da malzemeden bağımsızdır. Dolayısıyla
malzemenin yıllık enerjiye etki edebileceği **tek yol**, ısıl kütlesi C
üzerinden kullanım faktörüdür.

Bunu doğrudan sınadım. Referans konut, 4. Bölge, 18 alternatif:

| Kurgu | Kullanım faktörü | Malzemeler arası QH yayılımı |
|---|---|---|
| **A** | TS 825:2008 biçimi, τ'dan bağımsız | **0 kWh — %0,00** |
| **B** | EN ISO 13790 biçimi, τ'ya bağlı | 739 kWh — %1,55 |

**A kurgusunda 18 malzemenin tamamı birebir aynı yıllık enerji ihtiyacını
veriyor: 55 992 kWh/yıl (43,4 kWh/m²).** Yani TS 825:2024 eski kullanım
faktörünü koruduysa, aylık hesap yalıtım malzemelerini birbirinden ayıramaz
ve planladığımız doğrulama adımı boş çıkar. Bu, orantılılık sorununun ikinci
bir görünümüdür.

---

## 3. Kurgu B çalışıyor ve doğru şekli veriyor

τ'ya bağlı kullanım faktörüyle, en hafif (camyünü) ve en ağır (kenevir-kireç)
alternatif arasındaki yıllık enerji farkı:

| Bölge | QH hafif (kWh) | QH ağır (kWh) | Fark | Fark % |
|---|---|---|---|---|
| 1 · Aşırı Sıcak | 14 929 | 14 030 | 900 | **%6,03** |
| 2 · Sıcak | 22 911 | 22 003 | 908 | %3,96 |
| 3 · Ilıman | 36 639 | 35 794 | 846 | %2,31 |
| 4 · Soğuk | 48 534 | 47 796 | 739 | %1,52 |
| 5 · Çok Soğuk | 75 513 | 74 731 | 783 | %1,04 |
| 6 · Aşırı Soğuk | 94 939 | 94 117 | 822 | %0,87 |

Örüntü fiziksel olarak doğru: ısıl kütlenin sağladığı avantaj sıcak bölgede
en yüksek (%6,03), soğuk bölgede neredeyse yok (%0,87). Isıl kütle, kazançların
kullanılabilirliğini artırdığı için kazançların paya sahip olduğu bölgelerde
işe yarar; ısıtma yükünün ezici olduğu bölgelerde etkisi kaybolur.

**Önemli olan şu:** bu gradyan, ikinci mekanizmadan (iklim ayarlı ağırlıklandırma)
tamamen bağımsız olarak elde edildi ve **onunla aynı yönde**. İki farklı yoldan
aynı fiziksel sonuca varılması, modelin iç tutarlılığının güçlü bir kanıtıdır
ve makalede böyle sunulmalıdır.

---

## 4. Güneş ışınımı verisi ne kadar kritik?

TS 825:2024'ün Ek-C'sindeki aylık güneş ışınımı şiddeti değerleri elimizde yok
(2008'de tüm Türkiye için tek tablo ve dört yön vardı; 2024'te bölgeye göre
çeşitlendirilmiş ve tüm yönler için detaylandırılmış). Betikte yer tutucu bir
tablo var. Duyarlılığı ölçtüm (4. Bölge, kurgu B):

| Işınım ölçeği | QH hafif | QH ağır | Malzeme farkı |
|---|---|---|---|
| 0,50 | 56 868 | 56 337 | %0,93 |
| 0,75 | 52 566 | 51 944 | %1,18 |
| 1,00 | 48 534 | 47 796 | %1,52 |
| 1,25 | 44 754 | 43 878 | %1,96 |
| 1,50 | 41 212 | 40 184 | %2,49 |

Işınım verisi ±%50 değişse bile malzeme farkı %0,9–2,5 aralığında kalıyor —
büyüklük mertebesi değişmiyor. **Bulgu, Ek-C verisine karşı sağlam.** Ek-C
gerçek değerleri mutlak QH sayılarını düzeltecek, ama makalenin argümanını
bozmayacak.

---

## 5. Referans konut

Belgelenmiş bir yapıdan (Denizli, Pamukkale Üniv. çalışması: 5 kat, 2,80 m kat
yüksekliği, betonarme karkas, PVC çift cam) kat yüksekliği ve yapım sistemi
alınarak, tam tanımlı ve tekrarlanabilir bir **temsili referans konut**
kurgulandı. Karma kullanımlı gerçek yapı yerine temsili yapı seçilmesinin
nedeni, iç kazanç ve iç sıcaklık tanımlarının tek işlevle temiz kalmasıdır.

| Parametre | Değer |
|---|---|
| Plan | 24,0 × 12,0 m (uzun aks doğu–batı) |
| Kat sayısı / yüksekliği | 5 / 2,80 m |
| Brüt hacim | 4032 m³ |
| Şartlandırılmış döşeme alanı (A_f) | 1440 m² |
| Kullanım alanı A_n = 0,32·V | 1290,2 m² |
| Pencere alanı | 184,8 m² (G %25, K/D/B %15) |
| Opak duvar alanı | 823,2 m² |
| A/V oranı | 0,393 |
| Hava değişimi | 0,7 m³/(h·m²) — TS 825:2024 konut |
| İç kazanç | 5·A_n = 6451 W — konut |

Hesap yolu: H = H_T + H_V; H_T = U_D·A_opak + U_P·A_pencere + 0,8·U_T·A_çatı
+ 0,5·U_t·A_taban. Aylık: Q = maks(0, kayıp − η·kazanç).

**Not:** TS 825:2024, iletim kaybında sabit 0,8 katsayısı yerine hesaplanan bir
düzeltme faktörü kullanıyor. Betik şimdilik 0,8 ile çalışıyor; standarda
erişildiğinde güncellenmelidir.

---

## 6. Sıradaki adım — tek bir soruya bağlı

| TS 825:2024'ün kullanım faktörü | Sonuç |
|---|---|
| τ'ya bağlıysa (EN ISO 13790 biçimi) | Doğrulama adımı olduğu gibi yürür; kurgu B sonuçları makaleye girer |
| τ'dan bağımsızsa (2008 biçimi) | TS 825 rotası malzemeleri ayıramaz. İki seçenek: (a) doğrulamayı dinamik simülasyona (EnergyPlus) taşımak, (b) bu durumu **bulgu olarak** raporlamak — "ulusal hesap yöntemi, eşdeğer U koşulunda yalıtım malzemesinin ısıl kütlesini görmez" |

(b) seçeneği küçümsenmemeli: mevzuata dönük, somut ve özgün bir tespit olur ve
makalenin ana savıyla — kurgunun kendisinin sonucu belirlediği savıyla —
mükemmel örtüşür.

---

## 7. Açık veri ihtiyaçları

| Veri | Kaynak | Etki |
|---|---|---|
| Kullanım faktörü biçimi | TS 825:2024 metni | **kritik** — yöntemi belirler |
| Ek-C güneş ışınımı tablosu | TS 825:2024 Ek-C | orta — mutlak değerleri düzeltir, argümanı değiştirmez |
| İletim düzeltme faktörü | TS 825:2024 | düşük — H'yi az miktarda kaydırır |
| Ek-E ısıl iletkenlik hesap değerleri | TS 825:2024 Ek-E | orta — λ değerlerinin resmî karşılığı |
| Bina türüne göre enerji limitleri | TS 825:2024 | düşük — karşılaştırma için |
| Cam g değeri doğrulaması | üretici / EN 410 | düşük |
