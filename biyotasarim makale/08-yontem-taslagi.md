# 3. MATERYAL VE YÖNTEM — ilk taslak

> Hedef uzunluk 4,0 sayfa. `[K##]` işaretleri `model/kaynaklar.md` sicilindedir.
> Tüm hesaplar `model/` klasöründeki betiklerle yürütülmüş, çıktılar
> yeniden üretilebilir biçimde saklanmıştır.

---

## 3.1. Genel akış

Çalışma yedi adımdan oluşmaktadır: (1) alternatif kümesinin ve ölçüt setinin
tanımlanması, (2) fonksiyonel birim üzerinden bölge bazlı büyüklüklerin
hesaplanması, (3) hesap temelinin bağımsız bir kaynakla doğrulanması,
(4) bölgelerin ısıtma/soğutma dengesinin iklim verisinden türetilmesi,
(5) ağırlıklandırma, (6) sıralama ve uygulanabilirlik kısıtının uygulanması,
(7) duyarlılık analizi. Adım 2 ile 6 arasındaki ilişki, çalışmanın ilk
bulgusunu doğuran analitik yapıyı içerdiğinden 3.2'de ayrıca ele alınmıştır.

**Şekil 1.** Model akış şeması *(çizilecek)*: iklim verisi ve U hedefleri →
fonksiyonel birim → karar matrisi → ağırlıklandırma (üç yöntem) → iklim ayarı →
uygulanabilirlik kısıtı → sıralama (TOPSIS, VIKOR) → duyarlılık.

## 3.2. Fonksiyonel birim ve orantılılık önermesi

### Fonksiyonel birim
Karşılaştırma birimi, TS 825:2024'ün ilgili derece gün bölgesi için tavsiye
ettiği ısıl geçirgenlik değerini sağlayan **1 m² dış duvar bileşenidir**.
Malzemeleri doğrudan ısı iletkenlik katsayısına göre karşılaştırmak yanıltıcı
olur; eşdeğer ısıl performans koşulu, her malzemenin farklı kalınlıkta
kullanılmasını gerektirir ve bu kalınlık farkı kütleye, gömülü karbona,
maliyete ve kaybedilen kullanım alanına doğrudan yansır.

Bir yapı bileşeninde toplam ısıl direnç, yalıtım katmanı ile diğer katmanların
ve yüzeysel ısı geçiş dirençlerinin toplamıdır:

    1/U_b = R_diğer + d/λ                                             (1)

Buradan, *b* bölgesinde *m* malzemesi için gereken yalıtım kalınlığı:

    d_{m,b} = λ_m · (1/U_b − R_diğer) = λ_m · K_b                     (2)

Burada **K_b = 1/U_b − R_diğer** yalnızca bölgeye bağlıdır ve malzemeden
bağımsızdır. Kalınlık, uygulama gerçekliğine uygun olarak en yakın santimetreye
yuvarlanır.

### Orantılılık önermesi

**Önerme.** Karar matrisinin her sütunu ya bölgeden bağımsız bir malzeme
özelliğidir ya da `x_{m,b} = φ(m) · K_b` biçiminde yazılabilir. Bu koşulda,
sütun bazlı ölçek değişimine duyarsız bir normalizasyon kullanan her sıralama
yöntemi, tüm bölgelerde **özdeş** sıralama üretir.

**Türetim.** Kalınlıktan türeyen büyüklüklerin tamamı ortak K_b çarpanını taşır:

| Büyüklük | İfade | Malzeme çarpanı φ(m) |
|---|---|---|
| Kalınlık | d = λ K_b | λ_m |
| Birim kütle | g = d·ρ = λ ρ K_b | λ_m ρ_m |
| Gömülü karbon | e = g·ε = λ ρ ε K_b | λ_m ρ_m ε_m |
| Alansal ısıl kapasite | κ = d·ρ·c = λ ρ c K_b | λ_m ρ_m c_m |
| Maliyet | p = d·π = λ π K_b | λ_m π_m |

Geriye kalan ölçütler (ısı iletkenliği, yangına tepki, yaşam sonu senaryosu,
nem/küf duyarlılığı) malzeme özellikleridir ve bölgeye göre zaten değişmez.

TOPSIS'in vektörel normalizasyonunda, *j* sütunu için:

    r_{mj} = x_{mj} / √(Σ_i x_{ij}²)
           = φ_j(m)·K_b / √(Σ_i φ_j(i)²·K_b²)
           = φ_j(m)·K_b / (K_b·√(Σ_i φ_j(i)²))
           = φ_j(m) / √(Σ_i φ_j(i)²)                                  (3)

K_b tam olarak sadeleşir; normalize matris bölgeden bağımsızdır. Aynı sadeleşme
VIKOR'un min-maks normalizasyonunda da gerçekleşir:

    (f*_j − f_{mj}) / (f*_j − f⁻_j)
        = (φ*_j − φ_j(m))·K_b / ((φ*_j − φ⁻_j)·K_b)                   (4)

Entropi ağırlıklandırmasında kullanılan `p_{mj} = x_{mj}/Σ_i x_{ij}` oranı ve
CRITIC'in dayandığı normalize sütun istatistikleri de aynı nedenle ölçekten
bağımsızdır; dolayısıyla **ağırlıklar da bölgeye göre değişmez**. ∎

### Önermenin sayısal doğrulanması
Yuvarlama devre dışı bırakıldığında, üç ağırlıklandırma yöntemi (entropi,
CRITIC, eşit) ve iki sıralama yöntemi (TOPSIS, VIKOR) için altı bölge arasındaki
Spearman sıra korelasyonu **1,000000** çıkmakta; entropi ağırlıklarının bölgeler
arası azami farkı **0,00 × 10⁰** olmaktadır. Yuvarlama etkinleştirildiğinde
korelasyon 0,9938–1,0000 aralığına inmektedir. **Gözlenen tüm sapma, kalınlığın
santimetreye yuvarlanmasından kaynaklanmaktadır.**

Bu önerme, çalışmanın birinci araştırma sorusunun cevabıdır ve aynı zamanda
bölge etkisini üretmek için modele hangi mekanizmaların eklenmesi gerektiğini
belirler: **K_b ile orantılı olmayan** bir yapı gereklidir.

## 3.3. Alternatifler

On dört biyo-esaslı ve dört konvansiyonel olmak üzere on sekiz alternatif
değerlendirilmiştir. Konvansiyonel grup kıyas amacıyla dâhil edilmiştir;
"biyo-esaslı olan üstündür" varsayımı sınanmaksızın kabul edilmemiştir.

**Çizelge 2.** Alternatifler *(gruplar: lifli levha, dökme/dolgu, kabuk ve
tarımsal atık esaslı, büyütülmüş, kıyas)* — `model/girdi_malzemeler.csv`

## 3.4. Ölçüt seti ve veri

**Çizelge 3.** Ölçüt seti

| Kod | Ölçüt | Birim | Yön |
|---|---|---|---|
| Ö1 | Isı iletkenliği λ | W/mK | min |
| Ö2 | Fonksiyonel birim kütlesi | kg/m² | min |
| Ö3 | Alansal ısıl kapasite | kJ/m²K | max, iklim ayarlı |
| Ö5 | Gömülü karbon A1–A3 | kgCO₂e/m² | min |
| Ö6 | Biyojenik karbon depolama | kgCO₂e/m² | min |
| Ö7 | Yangına tepki (EN 13501-1) | sıralı 1–7 | max |
| Ö8 | Maliyet | TL/m² | min |
| Ö9 | Yaşam sonu senaryosu | sıralı 1–4 | max |
| Ö10 | Nem/küf duyarlılığı | sıralı 1–5 | min, iklim ayarlı |
| Ö11 | Duvar kalınlığı kaybı | cm | min |

Ö6 ve Ö9, kararın zaman ufkunu bileşen ömrünün ötesine taşıyan ölçütlerdir;
gerekçeleri 2.3'te tartışılmıştır.

### Veri kaynakları ve veri kalitesi
Her hücre için kaynak anahtarı ve 1–5 arası veri kalitesi puanı kaydedilmiştir
(5 = doğrulanmış EPD veya kurumsal veri tabanı, 4 = hakemli birincil ölçüm,
3 = hakemli derleme aralığı, 2 = üretici beyanı, 1 = tahmin). Kaynak sicili
`model/kaynaklar.md` dosyasındadır.

**Çizelge 4.** Veri bütünlüğü ve kalite dağılımı.

**Eksik veri işlemi.** Eksik değerler sıfıra çevrilmemiştir; sıfıra çevirme,
bir ölçütü görünmez biçimde etkisizleştirir. Eksik değerler tanımsız olarak
taşınmış, eksik oranı %50'yi aşan ölçüt modelden çıkarılmış ve bu durum
raporlanmıştır. Bu kural gereği **Ö5 (gömülü karbon) ve Ö8 (maliyet) mevcut
çalıştırmada modele dâhil edilmemiş**, model sekiz ölçütle yürütülmüştür.
Bu, çalışmanın açıkça belirtilen sınırlılığıdır.

## 3.5. Hesap temelinin doğrulanması

Eşitlik (2)'deki R_diğer değeri, yalıtım dışı katmanların ve yüzeysel dirençlerin
toplamıdır. Bu parametre, bağımsız bir kaynakla kalibre edilmiştir: TS 825:2024
için yayımlanmış asgari yalıtım kalınlığı tablosu [K11], dört il (Antalya,
İstanbul, Ankara, Erzurum) ve iki ısı iletkenlik değeri (λ = 0,035 ve 0,040
W/mK) için sekiz veri noktası sunmaktadır. R_diğer = 0,30 m²K/W alındığında
hesaplanan kalınlıklar bu sekiz noktanın **tamamıyla** örtüşmektedir.

**Çizelge 5.** Hesaplanan kalınlıkların yayımlanmış tabloyla karşılaştırılması.

## 3.6. İklim dengesinin türetilmesi

TS 825:2024'ün altı bölge için verdiği aylık ortalama dış hava sıcaklıkları
[K11] ile konut için tanımlı iç tasarım sıcaklıkları (ısıtma 20 °C, soğutma
26 °C) kullanılarak, her bölge için ısıtma derece gün (IDG) ve soğutma derece
gün (SDG) değerleri hesaplanmıştır:

    IDG = Σ_ay maks(0, θ_i,ısıtma − θ_e,ay) · n_ay                    (5)
    SDG = Σ_ay maks(0, θ_e,ay − θ_i,soğutma) · n_ay                   (6)
    σ_b = SDG / (IDG + SDG)          (soğutma payı)                   (7)

## 3.7. Ağırlıklandırma

Üç objektif yöntem karşılaştırmalı olarak kullanılmıştır. **Uzman anketine
dayalı subjektif ağırlıklandırma bilinçli olarak kullanılmamıştır**; hem yanıt
havuzuna bağımlılığı ortadan kaldırmak hem de yöntemin tekrarlanabilirliğini
korumak amaçlanmıştır.

**Shannon entropisi.** Normalize matris üzerinden `e_j = −k Σ_m p_{mj} ln p_{mj}`,
`k = 1/ln n`; ağırlık `w_j ∝ 1 − e_j`. Yayılımı yüksek ölçütlere büyük ağırlık verir.

**CRITIC.** `C_j = σ_j · Σ_k (1 − ρ_{jk})`; standart sapmanın yanı sıra ölçütler
arası korelasyonu da hesaba katar.

**Eşit ağırlık.** `w_j = 1/m`; kontrol kurgusu.

### İklim ayarı
Bölgeye bağlı ağırlık ayarı, çalışmanın ikinci mekanizmasıdır:

    w'_j = w_j · (1 + α · s_j(b))                                     (8)

Burada Ö3 (alansal ısıl kapasite) için `s_j(b) = σ_b` (soğutma payı), Ö10
(nem/küf duyarlılığı) için `s_j(b) = 1 − σ_b` (ısıtma payı) alınır; diğer
ölçütlerde `s_j = 0`. Ağırlıklar yeniden normalize edilir. Gerekçe fizikseldir:
ısıl kütle kazançların kullanılabilirliğini artırdığı için kazançların paya
sahip olduğu bölgelerde anlamlıdır; yoğuşma ve küf riski ise ısıtma sezonunun
uzunluğuyla ağırlaşır. α duyarlılık parametresi olup temel çalıştırmada 1,0
alınmıştır.

Eşitlik (8), K_b ile orantılı olmayan bir yapı ürettiği için 3.2'deki önermenin
kapsamı dışındadır ve bölgeye göre sıralama farkı üretebilir.

## 3.8. Sıralama

**TOPSIS** birincil yöntemdir; ağırlıklı normalize matris üzerinden ideal ve
negatif ideal çözümlere Öklid uzaklıkları hesaplanır ve yakınlık katsayısı
`C_m = d⁻_m/(d⁺_m + d⁻_m)` elde edilir. **VIKOR** (v = 0,5) yöntem tutarlılığı
kontrolü için kullanılır. İki yöntemin sıralamaları **Spearman sıra korelasyonu**
ile karşılaştırılır; bölgeler arası karşılaştırmalar da aynı ölçütle yapılır ve
yalnızca her iki bölgede de uygun olan alternatifler üzerinden hesaplanır.

## 3.9. Uygulanabilirlik kısıtı

Çalışmanın üçüncü mekanizmasıdır. Duvar bileşeninde uygulanabilir kabul edilen
azami yalıtım kalınlığı d_maks aşıldığında alternatif, o bölge için uygun
kümeden çıkarılır. Temel çalıştırmada d_maks = 20 cm alınmış, eşik duyarlılık
analizine konu edilmiştir. Kısıt, eşitlik (2) gereği bölgeye göre farklı
alternatifleri elediğinden, uygun küme bölgeye bağımlı hâle gelir ve önermenin
kapsamı dışına çıkılır.

## 3.10. Aylık enerji hesabı ve kazanç kullanım faktörü

Doğrulama adımı, tam tanımlı bir temsili referans konut üzerinde TS 825 aylık
yöntemiyle yürütülmüştür (geometri: `model/girdi_referans_bina.csv`).
Binanın özgül ısı kaybı:

    H = H_T + H_V                                                     (9)
    H_T = U_D·A_opak + U_P·A_pencere + 0,8·U_T·A_çatı + 0,5·U_t·A_taban  (10)
    H_V = 0,33 · A_f · n_h                                            (11)

Aylık net ısıtma enerjisi ihtiyacı `Q_ay = maks(0, kayıp − η·kazanç)` biçiminde
hesaplanır.

**Kritik nokta.** Fonksiyonel birim sabit U hedefine dayandığı için, yalıtım
malzemesi değiştiğinde H değişmez. Malzemenin yıllık enerjiye etki edebileceği
tek yol, ısıl kütlesi C üzerinden kazanç kullanım faktörüdür. İki kurgu
karşılaştırılmıştır:

    (A)  η = 1 − exp(−1/KKO)                          (τ'dan bağımsız)
    (B)  η = (1 − γ^a)/(1 − γ^(a+1)),  a = a₀ + τ/τ₀,  τ = C/H   (τ'ya bağlı)

Kurgu A'da malzemeler arasında tanım gereği hiçbir fark oluşamaz. Bu ayrım,
sonuçların yorumu açısından belirleyicidir ve 4. bölümde ele alınmaktadır.

## 3.11. Duyarlılık analizi

Duyarlılık analizi altı eksende yürütülmüştür: (i) ağırlıklandırma yöntemi
(entropi / CRITIC / eşit), (ii) iklim ayarı katsayısı α, (iii) azami kalınlık
eşiği d_maks, (iv) R_diğer değeri, (v) Ö6 ve Ö9'un modelden çıkarılması,
(vi) güneş ışınımı şiddetinin ölçeklenmesi. Ayrıca mekanizmaların ayrı ayrı ve
birlikte etkileri, ham modele göre Spearman korelasyonundaki değişimle
ölçülmüştür.

---

## Yazım notları

- 3.2 makalenin çekirdeğidir; türetim eksiksiz verilmeli, kısaltılmamalıdır.
  Hakem buraya bakacaktır.
- 3.4'teki eksik veri kuralı bir sınırlılık gibi görünse de yöntemsel titizlik
  göstergesidir; savunma değil, tercih olarak yazılmalıdır.
- 3.10'daki A/B ayrımı, TS 825:2024'ün kullanım faktörü biçimi doğrulandıktan
  sonra netleştirilecek. Standart eski biçimi koruyorsa bu alt bölüm bulguya
  dönüşür ve Tartışma'da mevzuat eleştirisine bağlanır.
- Eşitlik numaraları dergi şablonuna göre yeniden düzenlenecek.
- Şekil 1 çizilecek; Çizelge 2–5 model çıktılarından üretilecek.
