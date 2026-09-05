# TS 825:2024 — Çıkarılan Parametreler ve Eksikler

**Durum:** Standardın tam metnine erişim yok. Aşağıdaki parametreler kamuya
açık ikincil kaynaklardan (K11, K12) çıkarılmış ve modelde kullanılmıştır.
**Makalede TS 825:2024'ün kendisine atıf yapılmalıdır**; bu not yalnızca
modeli çalıştırmak için gereken girdileri belgeler.

---

## 1. Yürürlük ve kapsam

| | |
|---|---|
| TSE yayımı | 21 Ekim 2024 |
| Resmî Gazete tebliği | 20 Şubat 2025 |
| Zorunlu yürürlük | **1 Nisan 2025** |
| Derece gün bölgesi sayısı | 4 → **6** |
| Temel yenilik | Soğutma ihtiyacı hesaba dâhil edildi |
| Enerji limiti | 120–150 → **70–90 kWh/m²·yıl** (ısıtma + soğutma toplamı) |

Kaynak: K12 (İZODER basın bülteni, 21.02.2025).

## 2. Tavsiye edilen ısıl geçirgenlik değerleri

Modelde `model/girdi_bolgeler.csv` olarak kullanılmaktadır.

| Bölge | Ad | U_duvar | U_çatı | U_döşeme | U_pencere | g |
|---|---|---|---|---|---|---|
| 1 | Aşırı Sıcak | 0,45 | 0,35 | 0,40 | 1,8 | ≤ 0,45 |
| 2 | Sıcak | 0,40 | 0,30 | 0,35 | 1,8 | ≤ 0,45 |
| 3 | Ilıman | 0,40 | 0,30 | 0,35 | 1,8 | ≤ 0,45 |
| 4 | Soğuk | 0,35 | 0,25 | 0,30 | 1,8 | ≥ 0,55 |
| 5 | Çok Soğuk | 0,25 | 0,20 | 0,25 | 1,8 | ≥ 0,55 |
| 6 | Aşırı Soğuk | 0,25 | 0,20 | 0,25 | 1,8 | ≥ 0,55 |

Karşılaştırma için TS 825:2008 değerleri: 1. bölge 0,70 / 0,45 / 0,70 / 2,4 …
4. bölge 0,40 / 0,25 / 0,40 / 2,4.

**Yüksek oranda cam içeren yapılar** (ısı kaybeden düşey yüzeyin %60 ve
üzeri camlama): pencere U ≤ 1,6 ve diğer elemanlarda tavsiye edilen U
değerlerinden %25 daha küçük değerler. Bölge bazlı tablo K11'de mevcut.

### Bölge değişimi örnekleri (2008 → 2024)
Antalya 1 → 1 · İstanbul 2 → **3** · Ankara 3 → **4** · Erzurum 4 → **6**

## 3. Aylık ortalama dış hava sıcaklıkları (°C)

Modelde `model/girdi_bolge_sicakliklari.csv` olarak kullanılmaktadır.
Derece gün ve soğutma payı hesabının tek girdisidir.

| Ay | B1 | B2 | B3 | B4 | B5 | B6 |
|---|---|---|---|---|---|---|
| Ocak | 9,60 | 4,00 | 1,00 | −3,0 | −10,40 | −16,00 |
| Şubat | 6,00 | 4,40 | 1,30 | −2,7 | −12,40 | −15,35 |
| Mart | 11,00 | 6,30 | 3,90 | 0,4 | −8,70 | −9,70 |
| Nisan | 13,00 | 11,25 | 9,70 | 6,38 | 1,80 | −1,00 |
| Mayıs | 29,00 | 19,40 | 15,40 | 14,0 | 11,75 | 5,00 |
| Haziran | 35,20 | 35,41 | 28,20 | 18,7 | 14,25 | 13,00 |
| Temmuz | 37,00 | 35,79 | 32,00 | 28,40 | 18,75 | 17,55 |
| Ağustos | 34,99 | 34,90 | 33,20 | 26,90 | 17,10 | 19,40 |
| Eylül | 32,61 | 32,41 | 18,70 | 17,2 | 13,80 | 14,00 |
| Ekim | 19,00 | 17,50 | 13,00 | 13,0 | 4,08 | 1,18 |
| Kasım | 11,40 | 10,10 | 4,80 | −1,8 | −6,80 | −11,85 |
| Aralık | 6,60 | 4,88 | 1,28 | −0,3 | −12,50 | −17,40 |

## 4. Hesap parametreleri

| Parametre | Değer | Kapsam |
|---|---|---|
| İç tasarım sıcaklığı — kış | 20 °C | Müstakil konut, apartman, ofis |
| İç tasarım sıcaklığı — yaz | 26 °C | aynı |
| Hava değişim sayısı n_h | 0,7 m³/(h·m²) | Konut ve apartman; şartlandırılmış döşeme alanı başına |
| İç ısı kazancı | 5 × A_n (W) | Konut, okul ve normal binalar |
| Kullanım alanı | A_n = 0,32 · V_brüt | |
| Gölgelenme faktörü r | 0,8 / 0,6 / 0,5 | Ayrık ve az katlı / ağaçlı veya 10 kata kadar / bitişik nizam veya 10 kat üzeri |

**İletim kaybı.** TS 825:2008'de sabit katsayılar kullanılıyordu
(ΣAU = U_D·A_D + U_P·A_P + U_K·A_K + 0,8·U_T·A_T + 0,5·U_t·A_t + …).
**TS 825:2024'te bunun yerine hesaplanan bir düzeltme faktörü kullanılmaktadır.**
Model şimdilik 0,8 ve 0,5 sabitleriyle çalışmaktadır; standarda erişildiğinde
güncellenmelidir.

**Enerji limitleri.** TS 825:2008'de A/V oranına bağlı bir geometrik faktörle
tanımlanıyordu. TS 825:2024'te limitler **A/V oranından bağımsız** ve bina
türüne göre farklıdır. Sayısal değerler elimizde yoktur.

## 5. Pencere ısıl geçirgenlik değerleri (U_Wİ)

K11'de doğrama tipi × cam tipi × ara boşluk matrisi mevcuttur (örn. PVC
doğrama 5 odacıklı, çift camlı low-E, 16 mm: 1,6 W/m²K). TS 825:2024'e göre
**kaplamasız yalıtım camı üniteleri yeni binalarda kullanılamaz.**

## 6. Elimizde OLMAYAN veriler

| Veri | Nerede | Etki |
|---|---|---|
| **Kazanç kullanım faktörünün biçimi** | Standart metni | **Kritik** — τ'ya bağlı mı değil mi sorusu yöntemi belirliyor (bkz. 05 numaralı not) |
| **Ek-C — aylık güneş ışınımı şiddeti** | Standart Ek-C | Orta. 2008'de tüm Türkiye için tek tablo ve 4 yön vardı; 2024'te bölgeye göre çeşitlendirilmiş ve tüm yönler için detaylandırılmıştır. Modelde yer tutucu tablo kullanılıyor |
| **Ek-E — ısıl iletkenlik hesap değerleri** | Standart Ek-E | Orta. λ değerlerinin resmî karşılığı |
| İletim düzeltme faktörü | Standart metni | Düşük — H'yi az miktarda kaydırır |
| Bina türüne göre enerji limitleri | Standart metni | Düşük — karşılaştırma için |
| Tam il–bölge eşleşmesi (81 il) | Standart eki | Düşük — dört il elimizde |

## 7. Edinme yolları

1. **TSE**, standardın satın alınması (kurum aboneliği varsa ücretsiz erişim
   mümkün olabilir).
2. **İZODER TS 825 hesap programı** — MMO ile birlikte geliştirilmiş, web
   tabanlı. Hesap adımlarını ve bazı tabloları dolaylı olarak görünür kılabilir.
3. **İZODER il bilgi notları** — 81 il için ayrı ayrı yayımlanmış; il–bölge
   eşleşmesi buradan tamamlanabilir.
