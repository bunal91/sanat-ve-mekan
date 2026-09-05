# Pilot Çalıştırma Bulgu Notu — makalenin ana iddiası çalışmıyor, kurgu değişmeli

**Tarih:** Eylül 2026 · **Dayanak:** `model/model.py` pilot çalıştırması

---

## Özet

Karar modelinin iskeleti kuruldu ve çalıştırıldı. İki sonuç çıktı:

1. **İyi haber:** Hesap temeli doğrulandı. Kalınlık hesabı, İZODER'in TS 825:2024
   için yayımladığı asgari yalıtım kalınlıkları tablosunu **8 test noktasının
   8'inde birebir** yeniden üretiyor (Antalya, İstanbul, Ankara, Erzurum ×
   λ = 0,035 ve 0,040). Yalıtım dışı katmanların direnci R_diğer = 0,30 m²K/W
   olarak kalibre edildi.

2. **Kötü haber:** `01-secenek-B-detayli-plan.md` dosyasında makalenin ana
   bulgusu olarak tanımladığım **"sıralama iklim bölgesine göre kayar"**
   iddiası çalışmıyor. Bölgeler arası Spearman korelasyonu 0,983–1,000 çıktı.
   Yani altı bölgenin sıralaması pratikte aynı.

**Bu bir veri sorunu değil, kurgu sorunu.** Gerçek veri girildiğinde de
değişmeyecek, çünkü nedeni matematiksel.

---

## Teşhis: neden kaymıyor?

Fonksiyonel birim "hedef U değerini sağlayan 1 m² duvar" olarak tanımlandığında
gerekli yalıtım kalınlığı şudur:

```
d = λ · (1/U_hedef − R_diğer)
```

Buradaki parantez içi ifade **malzemeden bağımsızdır** — yalnızca bölgeye bağlıdır.
Dolayısıyla bölge 1'den bölge b'ye geçerken her malzemenin kalınlığı **aynı çarpanla**
ölçeklenir:

| Bölge | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Teorik oran (d_b / d_1) | 1,000 | 1,145 | 1,145 | 1,330 | 1,925 | 1,925 |
| Gerçekleşen yayılım | 0,000 | 0,202 | 0,202 | 0,179 | 0,182 | 0,182 |

Gerçekleşen yayılımın **tek kaynağı 1 cm'ye yuvarlamadır**; fiziksel bir fark değildir.

Kalınlıktan türeyen bütün ölçütler — kütle (d·ρ), gömülü karbon (d·ρ·e),
maliyet (d·birim fiyat), duvar kalınlığı kaybı (d), alansal ısıl kapasite (d·ρ·c) —
aynı ortak çarpanla ölçeklenir. TOPSIS ölçek değişimine karşı büyük ölçüde
duyarsız olduğundan sıralama sabit kalır.

Ek olarak sabit U hedefi, 1 m² duvardan geçen **iletim kaybını da malzemeden
bağımsız** kılar: tanım gereği hepsi aynı U değerini sağlar. Yani işletme enerjisi
de tek başına ayırt edici değildir.

### İkinci sorun: entropi ağırlıklandırması çarpıtıyor
Entropi ağırlığı yayılıma göre dağıtır. Yangın sınıfı ölçütü (Ö7) taşyünü/camyünü
için 7, diğerlerinin çoğu için 2 olduğundan aşırı yayılımlı bir sütun oluşuyor ve
**tek başına ağırlığın %39,7'sini alıyor**. Sonuç: her bölgede ilk iki sıra
camyünü ve taşyünü. Biyojenik karbon ölçütü ise yalnızca %2,6 ağırlık alıyor —
yani model biyo-esaslı malzemenin ayırt edici üstünlüğünü göremiyor.

Bu nedenle **AS2 de boş çıkıyor:** Ö6 ve Ö9 modelden çıkarıldığında Spearman
0,992–0,998, hiçbir bölgede 1. sıra değişmiyor.

---

## Bu aslında iyi bir haber — ve daha iyi bir makale

Yukarıdaki teşhis, atılacak bir sonuç değil; **makalenin asıl katkısı** olabilir.
Literatürdeki biyo-esaslı malzeme MCDM çalışmaları eşdeğer ısıl performans
varsayımıyla çalışıyor ve iklim bağımlılığını örtük olarak varsayıyor. Bu çalışma
şunu gösteriyor:

> Sabit U hedefine dayalı eşdeğer performans yaklaşımı, tanımı gereği iklim
> bölgesine göre sıralama farkı üretemez. Bölge etkisi ancak modele
> (i) uygulanabilirlik kısıtları, (ii) ısıtma/soğutma dengesindeki değişim ve
> (iii) dinamik ısıl kütle etkisi eklendiğinde ortaya çıkar.

Bu, örtük bir varsayımı düzelten, sınanabilir ve özgün bir metodolojik bulgudur.
"Şu malzeme en iyisidir" demekten daha sağlam bir katkıdır ve hakem karşısında
savunması kolaydır.

---

## Bölge etkisini gerçekten üreten üç mekanizma

### (i) Uygulanabilirlik kısıtı — **çalıştığı doğrulandı**
20 cm azami yalıtım kalınlığı kısıtı uygulandığında:

| Bölge | Elenen alternatifler |
|---|---|
| 1–4 | eleme yok |
| 5 (Çok Soğuk) | Kenevir-kireç (26 cm), Saman balya (22 cm) |
| 6 (Aşırı Soğuk) | Kenevir-kireç (26 cm), Saman balya (22 cm) |

Uygun alternatif kümesi bölgeye göre değişiyor. Bu **gerçek** ve fiziksel bir
bölge etkisidir: yüksek λ değerli hacimli biyo-esaslı malzemeler soğuk bölgelerde
duvar kalınlığı nedeniyle uygulanamaz hale geliyor. Kısıt eşiği (20 cm) duyarlılık
analizine konu edilmeli.

### (ii) Isıtma/soğutma dengesi — TS 825:2024'ün asıl yeniliği
Yeni standart ilk kez soğutma ihtiyacını da hesaba katıyor. 1. bölgede (Aşırı
Sıcak) soğutma, 6. bölgede (Aşırı Soğuk) ısıtma baskın. Bu, **ölçütlerin
yönünü ve önemini** bölgeye göre değiştirir: ısıl kütle ve özgül ısı sıcak
bölgede fayda ölçütüyken soğuk bölgede neredeyse etkisizdir; nem/küf riski ise
soğuk bölgede yoğuşma nedeniyle ağırlaşır. Bu, ağırlıkların bölgeye göre
türetilmesini gerektirir — modele girmesi gereken asıl mekanizma budur.

### (iii) Dinamik ısıl kütle — τ = C/H
TS 825'in aylık yöntemi, kazançların kullanım faktörünü zaman sabiti
τ = C/H üzerinden hesaplar ve bu ilişki **doğrusal değildir**. Doğrusal olmadığı
için orantılılık kırılır ve gerçek sıralama kayması burada doğar. Uygulanması
için referans binanın geometrisi ve aylık güneş ışınımı verisi gerekir.

---

## Kurgu değişikliği önerisi

### Yeni başlık
**"Eşdeğer ısıl performans varsayımı altında biyo-esaslı yapı kabuğu
malzemelerinin seçimi: iklim bölgesi etkisinin sınırları ve koşulları"**

### Yeni araştırma soruları
- **AS1.** Sabit U hedefine dayalı çok ölçütlü bir seçim modelinde, TS 825:2024'ün
  altı derece gün bölgesi arasında sıralama farkı oluşur mu? *(Cevap: hayır —
  ve bunun analitik gerekçesi gösterilir.)*
- **AS2.** Uygulanabilirlik kısıtı, ısıtma/soğutma dengesi ve dinamik ısıl kütle
  modele eklendiğinde bölge etkisi hangi koşulda ve ne büyüklükte ortaya çıkar?
- **AS3.** Biyojenik karbon depolama ve yaşam sonu senaryosu ölçüt olarak
  eklendiğinde sıralama nasıl değişir; ağırlıklandırma yöntemi bu değişimi
  ne ölçüde maskeler?

AS3 artık ayrıca bir **yöntem eleştirisi** taşıyor: entropi ağırlıklandırmasının
yüksek yayılımlı sıralı ölçütlere aşırı ağırlık vermesi, biyo-esaslı malzemelerin
çevresel üstünlüğünü görünmez kılıyor. Bu tespit tek başına yayımlanabilir
değerde.

---

## Yapılacak düzeltmeler

| # | Düzeltme | Durum |
|---|---|---|
| 1 | Orantılılık tanısını modele gömmek | **yapıldı** (`orantilik_testi()`) |
| 2 | Uygulanabilirlik kısıtı eklemek | **yapıldı** (`uygulanabilirlik_raporu()`) |
| 3 | Entropi yanında eşit ağırlık ve CRITIC karşılaştırması | yapılacak |
| 4 | Sıralı ölçütleri (yangın, yaşam sonu, nem) yeniden ölçeklemek | yapılacak |
| 5 | Bölgeye göre ölçüt yönü/ağırlığı (ısıtma vs soğutma baskınlığı) | yapılacak |
| 6 | TS 825:2024 aylık hesabı ile τ = C/H bağlantısı | referans bina ve ışınım verisi bekliyor |
| 7 | Gerçek malzeme verisi (şu an INDIKATIF) | EPD/Ökobaudat taraması bekliyor |

---

## Uyarı: mevcut sayısal sonuçlar kullanılamaz

`girdi_malzemeler.csv` içindeki λ, yoğunluk, gömülü karbon vb. değerlerin tamamı
`kaynak = INDIKATIF` olarak işaretlidir; literatürden tipik büyüklük mertebeleri
olarak girilmiştir, **doğrulanmış veri değildir**. Pilot çalıştırmanın "camyünü
birinci" sonucu makalede kullanılmamalıdır; yalnızca modelin çalıştığını ve
yukarıdaki yapısal sorunu gösterir. Her hücre EPD/Ökobaudat/ICE kaynağıyla
değiştirilmeli ve veri kalitesi puanı verilmelidir.
