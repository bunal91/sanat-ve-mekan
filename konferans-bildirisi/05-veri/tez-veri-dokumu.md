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

### ⚠ Tutarsızlık — çözülmeden bildiriye girmemeli

50×50 mm yüzey alanı = 2500 mm². Buradan:

| Prototip | F/A hesabı | Tezdeki σ | İma edilen alan |
|---|---|---|---|
| P1 | 3890 N / 2500 = **1,56 MPa** | 2,55 MPa | 1525 mm² ≈ 39×39 |
| P2 | 4300 N / 2500 = **1,72 MPa** | 3,12 MPa | 1378 mm² ≈ 37×37 |
| P3 | 6800 N / 2500 = **2,72 MPa** | 4,10 MPa | 1659 mm² ≈ 41×41 |

Üç satırda da kN ile MPa birbirini tutmuyor, üstelik ima edilen alanlar da
birbirinden farklı. Olası açıklamalar:

1. **Kuruma büzülmesi.** Numuneler 50 mm kalıba dökülüp kuruyunca ~37–41 mm'ye
   büzülmüş olabilir (yüksek su oranı düşünülürse gayet olası). Bu durumda MPa
   değerleri doğru, ama **yoğunluk hesabı yanlış** — 125 cm³ yerine gerçek hacim
   kullanılmalı, yoğunluk 1,384'ten belirgin biçimde yüksek çıkar.
2. Cihazın raporladığı MPa başka bir referans alana göre hesaplanmış.
3. Hesap hatası.

**Yapılacak:** Test raporlarındaki gerçek numune ölçüleri kontrol edilecek.
Tablo 5 tezde görsel olarak yerleştiği için metinden okunamadı; oradaki ham
değerlere bakılmalı.

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

1. **Her formülasyon için tek numune (n=1).** Standart sapma yok, tekrar yok.
   Malzeme mühendisliği hakemleri ilk buna bakar. Ya n≥3 ile tekrarlanmalı ya da
   bildiri açıkça "keşifsel ön çalışma" olarak konumlandırılmalı.
2. **Basmada şekil değiştirme ölçülmemiş**, gözleme dayalı %10 varsayılmış.
   Bu nedenle basma verisinden U_r hesaplanmadı; yalnızca eğilme verisi kullanıldı.
3. **Eğilmede tek geçerli numune** (P1 ölçülemedi).
4. **Basma kN↔MPa tutarsızlığı** (bkz. §2).
5. Uzun vadeli performans, nem/sıcaklık döngüsü, mikrobiyal dayanım verisi yok.
6. Tasarım önerisi gerçek mekânda uygulanmamış, prototip ölçeğinde.

Maddeler 5 ve 6 tezin kendi sınırlılıklar bölümünde zaten beyan edilmiş.
