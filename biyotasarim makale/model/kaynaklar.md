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
