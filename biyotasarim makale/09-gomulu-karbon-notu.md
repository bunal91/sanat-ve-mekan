# Gömülü Karbon Verisi — Ökobaudat çekimi ve sonuçları

**Betik:** `model/oekobaudat_cek.py` · **Ham kayıtlar:** `model/oekobaudat/ham/`
**Özet:** `model/oekobaudat_ozet.csv` · **Kaynak künyesi:** `model/kaynaklar.md` (K15)

---

## 1. Kaynak ve yöntem

Ökobaudat (BMWSB) açık veri servisi üzerinden, yalıtım malzemeleri
sınıflandırmasındaki EPD kayıtları için GWP-fossil, GWP-biogenic ve GWP-total
göstergelerinin A1–A3 (gömülü karbon) ile C3, C4 ve D (yaşam sonu) modülleri
çekildi. Çekim tekrarlanabilir; ham kayıtlar saklandı.

**Uygulanan dört filtre.** Bunlar isteğe bağlı değil, verinin doğruluğu için
zorunluydu:

1. **Birim normalizasyonu.** Kayıtlar kg, m², m³ ve adet başına beyan ediliyor.
   Birim çevrimi yapılmadan kullanılsaydı, kg başına ve m³ başına değerler
   karışacak ve iki büyüklük mertebesi hata oluşacaktı. İlk denemede aynı
   malzeme grubunda 0,527 ile 45,365 gibi değerler yan yana geldi; hata buradan
   yakalandı. Çevrim çarpanı, bağlı akış kaydındaki kütle özelliğinden alınıyor.
2. **Sahte çevrim reddi.** Referans birimi hacim veya alan olan bir kayıtta
   kütle özelliği tam olarak 1,0 ise bu gerçek bir çevrim değil, yer tutucudur.
   Bu filtre, kenevir-kireç için 178 kgCO₂e/kg gibi anlamsız bir değeri engelledi.
3. **Makullik bandı.** Fosil değer −1…20, biyojenik değer −3…1 kgCO₂e/kg
   bandı dışındaysa kayıt şüpheli işaretleniyor.
4. **Alaka filtresi.** Yalnızca yalıtım sınıflandırmasındaki kayıtlar; duvar
   kaplaması, linolyum ve boru kabuğu gibi ürünler elendi.

## 2. Elde edilen veri: 11/18 malzeme

| Kod | Malzeme | Fosil A1–A3 | Biyojenik A1–A3 | Kalite |
|---|---|---|---|---|
| M06 | Selüloz | **0,233** | −1,832 | 5 |
| M08 | Saman balya | **0,185** | −1,482 | 5 |
| M09 | Genleştirilmiş mantar | 0,512 | −1,581 | 5 |
| M01 | Ahşap lifi | 0,721 | −1,739 | 5 |
| M04 | Koyun yünü | 0,726 | −1,566 | 5 |
| M05 | Geri dönüşüm tekstil* | 1,134 | −1,495 | 2 |
| M03 | Keten lifi | 1,871 | −1,519 | 4 |
| M02 | Kenevir lifi | 1,881 | −1,509 | 4 |
| R04 | Camyünü | 1,244 | −0,166 | 4 |
| R03 | Taşyünü | 1,515 | 0,016 | 3 |
| R02 | XPS | **3,174** | 0,013 | 5 |

\* Kayıt kenevir-jüt karışımıdır, geri dönüşüm tekstil değil; kalite puanı bu
nedenle 2'dir.

Biyo-esaslı malzemelerin biyojenik değerleri −1,48 ile −1,83 arasında toplanıyor;
bu, lignoselülozik kuru kütlenin karbon içeriğinden beklenen büyüklükle
(%50 C × 44/12 ≈ 1,83) tutarlı. Bağımsız bir iç tutarlılık göstergesi.

**Kayıt bulunamayan 7 malzeme:** kenevir-kireç, pirinç kavuzu, ayçiçeği sapı özü,
şeker kamışı küspesi, fındık kabuğu, miselyum kompozit ve **EPS**. İlk altısı
için Ökobaudat'ta EPD yok. EPS için kayıt var ancak tamamı hacim başına beyan
edilmiş ve kütleye çevrim çarpanı içermiyor.

## 3. Tespit edilen veri anomalisi

Kenevir ve keten liflerinin **2023** tarihli kayıtlarında GWP-biogenic A1–A3
sıfıra yakın (−0,145 ve +0,009) iken **2022** tarihli kayıtlarında ≈ −1,5
kgCO₂e/kg. Fosil değerler ise birbirine yakın. Bu, biyojenik karbonun
muhasebeleştirilme biçiminde sürüm bazlı bir değişikliğe işaret ediyor.
İki sürüm karıştırılmamalı. Bu çalışmada 2022 sürümleri kullanıldı; gerekçe,
lignoselülozik kuru kütle karbon içeriğiyle tutarlı olmaları. **Makalede
sınırlılık olarak yazılmalı** — ve 2.3'te değinilen "biyojenik karbon
muhasebesi tartışmalıdır" saptamasının somut bir örneği olarak kullanılabilir.

## 4. İki çalıştırma, iki soru

Eksik veri kuralı gereği tek bir çalıştırma yeterli değil; iki ayrı analiz
yapıldı ve **karıştırılmamalı**:

| | Ana çalıştırma | Ek çalıştırma |
|---|---|---|
| Alternatif | 18 | 11 (tam veri) |
| Ölçüt | 8 (Ö5 hariç) | 9 (Ö5 dahil) |
| Sorusu | Tüm aday kümede sıralama nasıl davranıyor | Gömülü karbon eklendiğinde ne değişiyor |

### Ek çalıştırma sonuçları (11 alternatif, 9 ölçüt, 1. Bölge)

| Yöntem | En ağır ölçüt | İlk üç |
|---|---|---|
| Entropi | Ö7 Yangına tepki (%31,4) | Taşyünü · Camyünü · Selüloz |
| CRITIC | Ö7 Yangına tepki (%16,9) | Mantar (ICB) · Saman · Selüloz |
| Eşit | Ö10 Nem/küf (%16,2) | Mantar (ICB) · Saman · Selüloz |

**Ağırlıklandırma bulgusu gerçek EPD verisiyle de doğrulandı.** Entropi
mineral yünleri başa koyuyor; CRITIC ve eşit ağırlık aynı üç biyo-esaslı
malzemeyi veriyor. Entropi tek başına ayrışmayı sürdürüyor ve nedeni aynı:
yangına tepki ölçütüne ağırlığın üçte birini vermesi. CRITIC'te de en ağır
ölçüt yangın, ama payı %16,9 — yani CRITIC aynı ölçütü tanıyor, tek başına
egemen olmasına izin vermiyor.

### Gömülü karbon eklemenin etkisi

Aynı 11 alternatif üzerinde Ö5 dahil ve hariç sıralamalar (CRITIC):

| Bölge | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Spearman | 0,936 | 0,936 | 0,964 | 0,973 | 0,952 | 0,952 |

Sıralama kenarlarda değişiyor, ancak **hiçbir bölgede birinci sıra
değişmiyor**. Yani gömülü karbon bu ölçüt setinde belirleyici değil, ayırt
edici. Bu da raporlanabilir bir bulgu: biyo-esaslı malzemelerin üstünlüğü
tek başına gömülü karbondan gelmiyor.

## 5. Durum ve kalan iş

| İş | Durum |
|---|---|
| Gömülü karbon | **11/18** — ana çalıştırmada hariç, ek çalıştırmada dahil |
| Biyojenik karbon | 11'i EPD'den, 7'si hesapla |
| Yaşam sonu (C3, C4, D) | 11 malzeme için çekildi, **henüz ölçüte dönüştürülmedi** |
| EPS | Ökobaudat'tan alınamadı; ICE v3 veya üretici EPD'si gerekiyor |
| 6 tarımsal atık / miselyum malzemesi | EPD yok; hakemli çalışmalardan tek tek toplanacak, kalite puanı düşük kalacak |
| Maliyet | 0/18 |

**Sıradaki en verimli adım:** çekilmiş olan C3, C4 ve D modüllerini Ö9 (yaşam
sonu senaryosu) ölçütüne dönüştürmek. Şu an Ö9 elle verilmiş sıralı bir puan;
EPD modüllerinden türetilirse hem gerekçelendirilmiş hem de veri kalitesi
yükselmiş olur. Veri zaten elimizde.
