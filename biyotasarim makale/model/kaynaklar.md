# Malzeme Verisi Kaynak Sicili

Her kaynağa bir anahtar verilmiştir; `girdi_malzemeler.csv` içindeki
`kaynak_*` sütunları bu anahtarlara atıfta bulunur.

**Veri kalitesi puanı (1–5):** kaynak türü, coğrafi ve zamansal temsiliyet ile
ölçüm yönteminin belirginliğine göre verilir.
5 = doğrulanmış EPD veya kurumsal veri tabanı ·
4 = hakemli birincil ölçüm ·
3 = hakemli derleme aralığı ·
2 = üretici beyanı ·
1 = tahmin / benzer üründen aktarım.

---

## Isıl ve fiziksel özellikler

| Anahtar | Kaynak | Kapsam |
|---|---|---|
| **K01** | Wildman J., Shea A., Walker P., Henk D. (2025), *Extrinsic and intrinsic determinants of thermal conductivity in mycelium composites*, Building Services Engineering Research and Technology. doi:10.1177/01436244241306631 | 19 çalışmanın derlemesi; miselyum kompozitlerde λ = 0,026–0,18 W/mK |
| **K02** | Elsacker vd., K01 içinde aktarılan ölçümler | *Trametes versicolor* ile: keten 0,0578 · kenevir 0,0404 · saman 0,0419 W/mK |
| **K03** | Miselyum kompozit ölçümü (2025) | λ = 0,047 ± 0,002 W/mK · c = 1714 ± 105 J/kgK |
| **K04** | *Analysis of Sheep Wool-Based Composites for Building Insulation*, PMC9143407 | 24 numune; ρ = 30–138,7 kg/m³ · λ = 0,0324–0,0436 W/mK |
| **K05** | *Hygrothermal Properties and Performance of Bio-Based Insulation Materials Locally Sourced in Sweden*, PMC11084737 | Ahşap lifi ρ50 λ0,038 c2100 · çim ρ40 λ0,041 c1500 · deniz otu ρ120 λ0,05 · taşyünü ρ29 λ0,037 c1030 |
| **K06** | Ayçiçeği özü bağlayıcısız yonga levha çalışmaları | ρ = 50–100 kg/m³ · λ = 0,038–0,042 W/mK |
| **K07** | Pirinç kavuzu esaslı yalıtım levhaları (çoklu çalışma) | ρ = 300–520 kg/m³ ile λ = 0,064–0,076 W/mK; ρ = 378–488 kg/m³ ile λ = 0,08–0,14 W/mK |
| **K08** | Biyo-esaslı yalıtım derlemesi (2025), ScienceDirect S1364032125005453 | Koyun yünü, kenevir, keten, jüt lifleri: λ = 0,031–0,046 W/mK |
| **K09** | Kenevir esaslı yalıtım ölçümleri | λ = 0,055–0,065 W/mK (kenevir kırığı / hempcrete; lif keçesinden farklıdır) |
| **K10** | Genleştirilmiş mantar levha (ICB) çalışmaları | ρ ≈ 110 kg/m³ · λ = 0,040–0,050 W/mK |

## Mevzuat ve iklim verisi

| Anahtar | Kaynak | Kapsam |
|---|---|---|
| **K11** | İZODER / Diz T., *Yeni TS 825:2024 Standardı ve Isı Yalıtımı* sunumu | Altı bölge için tavsiye edilen U değerleri · aylık dış sıcaklıklar · iç tasarım sıcaklıkları · hava değişim sayıları · iç kazanç · asgari kalınlık tablosu |
| **K12** | İZODER Basın Bülteni, 21.02.2025 | TSE yayımı 21.10.2024 · RG tebliği 20.02.2025 · yürürlük 01.04.2025 · enerji limiti 120–150 → 70–90 kWh/m²·yıl |

## Karbon verisi — **büyük ölçüde eksik**

| Anahtar | Kaynak | Kapsam | Not |
|---|---|---|---|
| **K13** | Yalıtım malzemeleri karşılaştırması (ikincil kaynak) | Camyünü 1,533 kgCO₂e/kg · poliüretan levha 4,532 kgCO₂e/kg | kalite 2 |
| **K14** | Selüloz yalıtım biyojenik karbon beyanı | 900 kg kâğıttan 1370 kg CO₂ depolama ≈ 1,52 kgCO₂e/kg | kalite 2 |

**Kullanılmayan kaynak:** ICE v2.0 özet tabloları PDF'i indirildi ancak sayısal
değerler etiketlerden ayrı bir metin katmanında bulunduğu için satır-değer
eşleştirmesi güvenilir yapılamadı. Yanlış eşleştirme riski nedeniyle bu kaynak
**kullanılmamıştır**. ICE v3.0 (2019) veya güncel sürümün elektronik tablosu
Circular Ecology'den indirilerek doğrudan okunmalıdır.

---

## Doldurulması gereken hücreler

| Özellik | Durum | Gereken kaynak |
|---|---|---|
| Gömülü karbon A1–A3 | **18 malzemenin 16'sı eksik** | Ökobaudat (ücretsiz), ICE v3 elektronik tablosu, EPD International / EPD Türkiye |
| Biyojenik karbon depolama | **17 eksik** | EPD modül verisi; alternatif olarak kuru biyokütle karbon içeriğinden hesap (%C × 44/12) |
| Yaşam sonu senaryosu | tamamı gerekçelendirilmemiş | EPD C1–C4 modülleri |
| Yangına tepki sınıfı | tamamı üretici beyanı gerektirir | EN 13501-1 sınıflandırma belgeleri |
| Su buharı difüzyon direnci μ | çoğu eksik | EPD / üretici föyü |
| Maliyet | tamamı eksik | Türkiye piyasası; aralık tahminiyle |

---

## K15 — Ökobaudat (eklendi)

**Kaynak:** ÖKOBAUDAT, Bundesministerium für Wohnen, Stadtentwicklung und
Bauwesen (BMWSB), açık veri servisi
`https://www.oekobaudat.de/OEKOBAU.DAT/resource` (soda4LCA REST API).
Çekim betiği: `model/oekobaudat_cek.py` · Ham kayıtlar: `model/oekobaudat/ham/`
· Özet: `model/oekobaudat_ozet.csv`

**Çekilen büyüklükler:** GWP-fossil, GWP-biogenic ve GWP-total göstergelerinin
A1, A2, A3 modülleri (gömülü karbon) ile C3, C4 ve D modülleri (yaşam sonu).

**Uygulanan üç veri kalitesi filtresi:**
1. *Birim normalizasyonu.* Kayıtlar kg, m², m³ ve adet başına beyan edilmektedir.
   Yalnızca beyan edilen birimi kütleye güvenle çevrilebilen kayıtlar kabul
   edilmiştir; çevrim çarpanı bağlı akış kaydındaki kütle özelliğinden alınır.
   Bu filtre olmadan kg başına ve m³ başına değerler karışır ve iki büyüklük
   mertebesi hata oluşur.
2. *Sahte çevrim reddi.* Referans birimi hacim veya alan olan bir kayıtta kütle
   özelliği tam olarak 1,0 ise bu gerçek bir çevrim değil yer tutucudur; kayıt
   reddedilir.
3. *Makullik bandı.* Kg başına GWP-fossil değeri −1 ile 20 kgCO₂e/kg, biyojenik
   değer −3 ile 1 kgCO₂e/kg bandının dışındaysa kayıt şüpheli işaretlenir.
4. *Alaka filtresi.* Yalnızca "Dämmstoffe / Insulation" sınıflandırmasındaki
   kayıtlar alınmış; duvar kaplaması, linolyum, boru kabuğu gibi ürünler elenmiştir.

**Kabul edilen kayıtlar (kgCO₂e/kg, A1–A3):**

| Kod | Malzeme | Ürün kaydı | Yıl | Fosil | Biyojenik | Kalite |
|---|---|---|---|---|---|---|
| M01 | Ahşap lifi | Wood fibre board (wet process) | 2023 | 0,721 | −1,739 | 5 |
| M02 | Kenevir lifi | Hemp fibre fleece 38 kg/m³ | 2022 | 1,881 | −1,509 | 4 |
| M03 | Keten lifi | Flax fibre fleece 38 kg/m³ | 2022 | 1,871 | −1,519 | 4 |
| M04 | Koyun yünü | ISOLENA Schafwolle | 2025 | 0,726 | −1,566 | 5 |
| M05 | Geri dönüşüm tekstil | HemKor Jute Blend | 2025 | 1,134 | −1,495 | 2 |
| M06 | Selüloz | Cellulose fibre blowing insulation | 2022 | 0,233 | −1,832 | 5 |
| M08 | Saman balya | FASBA Baustroh 100 kg/m³ | 2024 | 0,185 | −1,482 | 5 |
| M09 | Genleştirilmiş mantar | Expanded cork 80 kg/m³ | 2023 | 0,512 | −1,581 | 5 |
| R02 | XPS | Extruded polystyrene 32 kg/m³ | 2023 | 3,174 | 0,013 | 5 |
| R03 | Taşyünü | Mineral wool (floor insulation) 85 kg/m³ | 2022 | 1,515 | 0,016 | 3 |
| R04 | Camyünü | SAGLAN glass wool | 2021 | 1,244 | −0,166 | 4 |

**Kayıt bulunamayan malzemeler (7):** kenevir-kireç (M07), pirinç kavuzu (M10),
ayçiçeği sapı özü (M11), şeker kamışı küspesi (M12), fındık kabuğu (M13),
miselyum kompozit (M14) ve **EPS (R01)**. İlk altısı için Ökobaudat'ta EPD
bulunmamaktadır; EPS için kayıt vardır ancak tamamı hacim başına beyan edilmiş
ve kütleye çevrim çarpanı içermemektedir.

**Tespit edilen veri anomalisi.** Kenevir ve keten liflerinin 2023 tarihli
kayıtlarında GWP-biogenic A1–A3 değeri sıfıra yakın (−0,145 ve +0,009) iken
2022 tarihli kayıtlarında yaklaşık −1,5 kgCO₂e/kg'dır. Fosil değerler ise
birbirine yakındır. Bu, biyojenik karbonun muhasebeleştirilme biçiminde
sürüm bazlı bir değişikliğe işaret etmektedir; iki sürüm karıştırılmamalı ve
makalede sınırlılık olarak belirtilmelidir. Bu çalışmada 2022 sürümleri
kullanılmıştır çünkü lignoselülozik malzemenin kuru kütle karbon içeriğinden
beklenen büyüklükle (≈ −1,5 kgCO₂e/kg) tutarlıdır.
