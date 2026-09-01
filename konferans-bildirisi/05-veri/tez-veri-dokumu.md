# Tez Veri Dökümü ve Kontrolü

Kaynak: Betül Ünal (2025), *Biyoloji Bazlı Malzemelerin Üretiminden Mekânsal
Dirençlilik Analizine: Tasarım Odaklı Deneysel Bir Yaklaşım*, Hacettepe
Üniversitesi Güzel Sanatlar Enstitüsü, İç Mimarlık ve Çevre Tasarımı ABD,
Doktora Tezi. Danışman: Prof. Dr. Duygu Koca.

## 1. Malzeme

Ana bileşenler: yumurta kabuğu tozu (steril, öğütülmüş, elenmiş), agar agar,
su, gliserol. Yardımcı: jelatin, nişasta, sirke (varyasyonlarda).
Yüzey koruması: gomalak (shellac) — hidrofobik doğal reçine.

## 2. Basma testi

50×50×50 mm küp numuneler. Hacettepe Ü. İleri Yapı Malzemeleri Araştırma Lab.

| Prototip | Su (g) | Yumurta kabuğu (g) | Agar (g) | Gliserol (g) | F_max (kN) | σ (MPa) |
|---|---|---|---|---|---|---|
| P1 | 325 | 80 | 35 | 5 | 3,89 | 2,55 |
| P2 | 310 | 90 | 40 | 5 | 4,30 | 3,12 |
| P3 | 280 | 110 | 45 | 10 | 6,80 | 4,10 |

P3 kütle: 173 g → yoğunluk 173/125 = **1,384 g/cm³**

### ✔ Tutarsızlık çözüldü

**50 × 50 × 50 mm, kalıbın ölçüsüdür — kurumuş numunenin değil.** Malzeme
kururken büzülüyor, dolayısıyla test edilen kesit kalıptan küçük.

Bu, tezdeki MPa değerlerini **geçerli kılıyor.** Cihazın MPa raporlayabilmesi
için bir alan girilmesi gerekir; girilen alanlar formülasyona göre farklı çıkıyor:

| Prototip | F_max | σ | İma edilen kesit | Kenar |
|---|---|---|---|---|
| P1 | 3,89 kN | 2,55 MPa | 1525 mm² | ~39,1 mm |
| P2 | 4,30 kN | 3,12 MPa | 1378 mm² | ~37,1 mm |
| P3 | 6,80 kN | 4,10 MPa | 1659 mm² | ~40,7 mm |

Üçü de 50 mm kalıptan %19–26 dogrusal büzülme aralığında ve birbirinden hafifçe
farklı — yani her numune kuruduktan sonra ayrı ayrı ölçülüp cihaza girilmiş
olmalı. Formülasyonların su oranı farklı olduğu için büzülmenin de farklı olması
zaten beklenir: en az su içeren P3 en az büzülmüş (%19), en çok su içeren
P2 en çok (%26). Fiziksel olarak tutarlı.

**Sonuç:** Basma verisi bildiride MPa olarak raporlanabilir. Metinde şu
belirtilmeli: numuneler 50 mm küp kalıplarda döküldü, kuruma sonrası kesit
ölçüleri test anında ölçüldü, ancak bu ölçüler tezde kayıt altına alınmadı.

> **Teyit edildi (yazar):** Kuruma sonrası kesit ölçümü laboratuvarda gerçekten
> yapılmıştır. MPa değerleri ölçülmüş kesitlere dayanıyor ve bildiride
> kullanılabilir.

### ✔ Numune sayısı — n > 1

Yazarın beyanı: her formülasyon için **birden fazla küp** üretildi ve raporlanan
değerler bunların **ortalaması**. Tezdeki "üç adet prototip örnek" ifadesi üç
*formülasyonu* anlatıyor, üç numuneyi değil.

**Teyit edildi (yazar): formülasyon başına 3 küp (n = 3).** Raporlanan
2,55 / 3,12 / 4,10 MPa değerleri bu üçünün ortalamasıdır.

Bu, bildirinin en büyük zayıflığını ortadan kaldırıyor. Çalışma artık "tek
numuneli keşifsel deneme" değil, n=3 ile yürütülmüş bir ön çalışma.

**Eğilme testi de n = 3** (yazar teyidi). Yani her iki mekanik test de
formülasyon başına üç numuneyle yürütülmüş; özette "three specimens tested per
formulation" olarak genelleştirildi.

**Kalan eksik — standart sapma yok.** Tek tek küplerin değerleri elde olmadığı
için yalnızca ortalamalar raporlanabiliyor. Bildiride şu ifade kullanılacak:

> Values are means of three specimens per formulation; individual specimen
> values were not retained, and standard deviations are therefore not reported.

Bu, sınırlılıklar bölümünde de tekrarlanmalı. Ortalamayı SD'siz vermek
mühendislik konferansında kabul edilebilir ama eleştiriye açık; beyan edilmesi
şart.

## 3. Eğilme testi — ASTM D790, üç nokta

Numune 180×60×20 mm, destek açıklığı L = 120 mm.

| Prototip | Su (g) | Yumurta kabuğu (g) | Agar (g) | Gliserol (g) | Sonuç |
|---|---|---|---|---|---|
| P1 | 450 | 190 | 70 | 60 | Ölçülemedi — aşırı sünek, plastikleşti |
| P2 | 480 | 190 | 70 | 30 | F_max = 310 N |

**Doğrulama — bu değerler tutarlı:**

    σf = 3FL / (2bd²) = 3·310·120 / (2·60·20²) = 2,325 MPa   ✓ tezle birebir
    Ef = 192 MPa (cihaz ölçümü)
    ε  = σ/E = 2,325/192 = 0,0121                             ✓ tezle uyumlu

## 4. Diğer testler

**Alev tepkisi (ISO 11925-1):** 40×50 mm numune, 45°, 15 s alev.
Tutuşma ~10. saniyede; alev çekilince **4 saniyede kendi kendine sönme**.
Lokal kömürleşme, alev yayılımı yok. Erime/damlama yok.

**Su emme (ASTM D570):** 40×50 mm, gomalak kaplı, W₀ = 10 g, 24 saat tam daldırma.
Ağırlık artışı **%0,7**. Hafif boyutsal genişleme; kaplamanın zayıf kaldığı
noktalarda yüzey kaybı.

## 5. HESAPLANAN: dirençlilik modülü (modulus of resilience)

Tezde yok. Mevcut veriden yeni deney gerekmeden hesaplanıyor:

    U_r = σf² / (2·Ef) = 2,325² / (2·192) = 0,01408 MPa = **14,1 kJ/m³**

Kontrol: ½·σ·ε = 0,5 · 2,325 · 0,0121 = 0,01408 MPa ✓

Yoğunluğa bölünmüş (özgül) değer: 14,08 kJ/m³ ÷ 1384 kg/m³ = **10,2 J/kg**

### Karşılaştırma — eğilmede, aynı formülle

| Malzeme | σf (MPa) | Ef (MPa) | U_r (kJ/m³) | U_r/ρ (J/kg) |
|---|---|---|---|---|
| **Biyokompozit (bu tez)** | **2,33** | **192** | **14,1** | **10,2** |
| Beton (eğilme) | 3,5 | 25 000 | 0,24 | 0,10 |
| Alçı levha | 5,0 | 2 500 | 5,0 | 6,7 |
| Miselyum kompozit | 0,6 | 30 | 6,0 | 17,1 |
| Seramik karo | 35 | 60 000 | 10,2 | 4,4 |
| MDF | 30 | 2 700 | 166,7 | 222,2 |
| Kontrplak | 45 | 8 000 | 126,6 | 210,9 |

> Karşılaştırma değerleri el kitabı mertebesindeki tipik değerlerdir;
> bildiriye girmeden önce her biri kaynağıyla değiştirilmelidir.

**Okuma:** Biyokompozit, yerini alabileceği *kırılgan mineral* iç mekân
malzemelerini (beton panel ~57×, alçı levha ~2,8×, seramik karo ~1,4×) dirençlilik
modülünde geçiyor. Ahşap esaslı panelleri (MDF, kontrplak) geçmiyor — onların
onda biri düzeyinde. Bu dürüst sınır bildiride açıkça yazılmalı.

**Kritik nokta:** Bunu sağlayan şey malzemenin **düşük elastisite modülü**
(192 MPa). Yani mühendislik literatüründe zayıflık olarak raporlanan özellik
(düşük rijitlik), dirençlilik ölçütüne geçildiğinde avantaja dönüşüyor.
Bildirinin ampirik omurgası budur.

## 6. Metodolojik zayıflıklar (bildiride açıkça beyan edilmeli)

1. ~~Her formülasyon için tek numune (n=1).~~ **Çözüldü:** basma ve eğilmede
   n=3. Kalan sınır: tek tek değerler elde olmadığı için standart sapma
   verilemiyor, yalnızca ortalama raporlanıyor — beyan edilecek.
2. **Basmada şekil değiştirme ölçülmemiş**, gözleme dayalı %10 varsayılmış.
   Bu nedenle basma verisinden U_r hesaplanmadı; yalnızca eğilme verisi kullanıldı.
3. **Eğilmede tek geçerli numune** (P1 ölçülemedi).
4. ~~Basma kN↔MPa tutarsızlığı.~~ **Çözüldü:** 50 mm kalıp ölçüsü, kesitler
   kuruma sonrası ölçülmüş (bkz. §2).
5. Uzun vadeli performans, nem/sıcaklık döngüsü, mikrobiyal dayanım verisi yok.
6. Tasarım önerisi gerçek mekânda uygulanmamış, prototip ölçeğinde.

Maddeler 5 ve 6 tezin kendi sınırlılıklar bölümünde zaten beyan edilmiş.
