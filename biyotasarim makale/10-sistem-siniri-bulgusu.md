# Sistem Sınırı Bulgusu — projenin en güçlü sonucu

**Veri:** Ökobaudat EPD modülleri (K15) · **Model:** `model/model.py`, `SINIR` parametresi

---

## 1. Ö9'u modüllerden türetme denemesi başka bir yere çıktı

Amaç, çekilmiş C3, C4 ve D modüllerinden yaşam sonu ölçütünü türetmekti.
Modüllere bakınca daha temel bir şey görüldü ve yön değişti.

EN 15804 muhasebesinde biyo-esaslı bir malzemenin A1–A3'te aldığı biyojenik
karbon, C3'te (enerji geri kazanımlı yakma) yeniden salınır. Veri bunu birebir
doğruluyor:

| Malzeme | Biyojenik A1–A3 | C3 | Toplam |
|---|---|---|---|
| Ahşap lifi | −1,739 | +1,776 | **+0,038** |
| Koyun yünü | −1,566 | +1,606 | **+0,041** |
| Selüloz | −1,832 | +1,873 | **+0,041** |
| Saman balya | −1,482 | +1,504 | **+0,022** |
| Mantar (ICB) | −1,581 | +1,604 | **+0,023** |
| Geri dön. tekstil | −1,495 | +1,600 | +0,106 |
| Kenevir lifi | −1,509 | +2,163 | +0,654 ¹ |
| Keten lifi | −1,519 | +2,163 | +0,644 ¹ |

¹ Bu iki kayıt, `kaynaklar.md`'de belgelenen sürüm anomalisini taşıyor.

Altı malzemede alım ve salım **±0,04 kgCO₂e/kg içinde** birbirini götürüyor.
Yani biyojenik karbon depolaması, yaşam döngüsünün tamamı hesaba katıldığında
net olarak sıfırlanıyor. Depolama avantajı yalnızca (a) hesap bina ömrüyle
kesildiğinde ya da (b) yaşam sonunda oksitlenmeyen bir senaryo varsayıldığında
vardır.

Bu nedenle C3/C4/D modüllerini sıralı bir yaşam sonu puanına indirgemek yerine,
**sistem sınırını modelin bir parametresi hâline getirmek** daha verimli oldu.
(Ö9 sıralı ölçüt olarak kalıyor; kompostlanabilirlik gibi modüllerin yakalamadığı
bir niteliği temsil ediyor. Modüllerden ayrıca türetilirse çifte sayım olurdu.)

## 2. Üç sistem sınırı

| Sınır | Kapsam |
|---|---|
| **S1** | A1–A3 — beşikten kapıya, biyojenik alım dahil |
| **S2** | A1–A3 + C3 + C4 — beşikten mezara |
| **S3** | A1–A3 + C3 + C4 + D — modül D (geri kazanım kredisi) dahil |

Çifte sayımı önlemek için bu analizde Ö5 (gömülü karbon) ve Ö6 (biyojenik
karbon) ayrı ölçüt olarak kullanılmıyor; yerlerini tek bir **Ö5\* yaşam
döngüsü karbonu** ölçütü alıyor.

### Malzeme bazında (kgCO₂e/kg)

| Kod | Malzeme | S1 | S2 | S3 |
|---|---|---|---|---|
| M06 | Selüloz | **−1,599** | 0,273 | −0,239 |
| M08 | Saman balya | −1,294 | 0,210 | 0,135 |
| M09 | Mantar (ICB) | −1,064 | 0,540 | 0,228 |
| M01 | Ahşap lifi | −1,017 | 0,760 | 0,239 |
| M04 | Koyun yünü | −0,831 | 0,775 | 0,475 |
| M05 | Geri dön. tekstil | −0,358 | 1,242 | 0,864 |
| M02 | Kenevir lifi | 0,373 | 2,536 | 2,065 |
| M03 | Keten lifi | 0,890 | 3,053 | 2,583 |
| R04 | Camyünü | 1,079 | 1,086 | 1,033 |
| R02 | XPS | 3,188 | 6,880 | 5,497 |

S1'de biyo-esaslı malzemelerin çoğu **karbon-negatif** görünüyor. S2'de
tamamı pozitife dönüyor ve camyününe göre üstünlükleri ~2,7 kgCO₂e/kg'dan
~0,8'e iniyor; kenevir ve keten camyününün **gerisine** düşüyor.

## 3. Sıralamaya etkisi — birinci sıra her bölgede değişiyor

CRITIC ağırlıklı, tam model, 10 alternatif:

| Bölge | Spearman(S1,S2) | 1. sıra (S1) | 1. sıra (S2) |
|---|---|---|---|
| 1 Aşırı Sıcak | 0,758 | Saman balya | **Camyünü** |
| 2 Sıcak | 0,673 | Saman balya | **Camyünü** |
| 3 Ilıman | 0,624 | Saman balya | **Camyünü** |
| 4 Soğuk | 0,612 | Mantar (ICB) | **Camyünü** |
| 5 Çok Soğuk | 0,767 | Mantar (ICB) | **Camyünü** |
| 6 Aşırı Soğuk | 0,767 | Mantar (ICB) | **Camyünü** |

Sınırlar arası genel korelasyon: S1–S2 = 0,758 · S1–S3 = 0,697 · S2–S3 = 0,939.

## 4. Sağlamlık kontrolleri

**Anomali sonucu taşımıyor.** Sürüm anomalisi taşıyan kenevir ve keten
kayıtları çıkarıldığında etki **zayıflamıyor, güçleniyor**:

| Alt küme | Spearman(S1,S2) 1. Bölge | 4. Bölge |
|---|---|---|
| Tümü (10 alternatif) | 0,758 | 0,612 |
| Anomalisiz (8 alternatif) | **0,333** | **0,286** |

**Ağırlıklandırmadan bağımsız.** Anomalisiz alt küme, 1. Bölge:

| Yöntem | 1. sıra (S1) | 1. sıra (S2) | Spearman |
|---|---|---|---|
| Entropi | Camyünü | Camyünü | 0,500 |
| CRITIC | Saman balya | **Camyünü** | 0,333 |
| Eşit | Mantar (ICB) | **Camyünü** | 0,643 |

CRITIC ve eşit ağırlık, biyo-esaslı bir malzemeden camyününe dönüyor.
Entropi zaten camyününü birinci veriyordu — kendi ayrı sapması nedeniyle.

## 5. Makale açısından anlamı

Bu, çalışmanın ana savının **üçüncü ve en güçlü örneği**:

> Sonucu belirleyen şey malzemelerin kendisi değil, karşılaştırmanın kurgusudur.

Üç örnek artık şöyle sıralanıyor:

1. **Fonksiyonel birim kurgusu** — sabit U hedefi, iklim bölgesine göre
   sıralama farkı üretilmesini analitik olarak imkânsız kılıyor.
2. **Ağırlıklandırma yöntemi** — entropi, yayılımı yüksek tek bir ölçüt
   üzerinden biyo-esaslı malzemeleri sistematik olarak geriye itiyor.
3. **Sistem sınırı** — A1–A3'te kesilen bir hesap biyo-esaslı malzemeleri
   karbon-negatif gösteriyor; C modülleri eklendiğinde birinci sıra
   **altı bölgenin altısında da** camyününe geçiyor.

Üçüncüsü aynı zamanda antroposantrizm hattını doğrudan sayısallaştırıyor.
Hesabı bina ömrüyle kesmek insan-merkezli bir zaman ufku tercihidir; malzemenin
depoladığı karbon, o ufkun ötesinde yeniden salınır. Giriş'te kurulan
"kararın zaman ufkunu bina ömrünün ötesine taşımak" savı, burada ölçülmüş bir
sıralama değişimine dönüşüyor. Bu, kuramsal bir iddia olmaktan çıkıp bulgu
hâline geliyor.

## 6. Sınırlılıklar — makalede açıkça yazılmalı

1. **C3 senaryosu varsayımdır.** Modüller enerji geri kazanımlı yakma
   senaryosunu yansıtıyor. Düzenli depolama, yeniden kullanım veya uzun ömürlü
   ürüne dönüştürme senaryolarında biyojenik karbonun bir kısmı depoda kalır.
   Bulgu, "biyo-esaslı malzeme iyi değildir" demiyor; **yaşam sonu senaryosunun
   sonucu belirlediğini** söylüyor.
2. **On alternatif.** Tarımsal atık esaslı paneller ve miselyum kompozit,
   EPD bulunmadığı için bu analizin dışında.
3. **Sürüm anomalisi.** Kenevir ve keten kayıtlarındaki biyojenik karbon
   tutarsızlığı belgelendi ve sağlamlık kontrolüne alındı.
4. **Geçici depolamanın değeri tartışmalıdır.** Biyojenik karbonun geçici
   depolanmasının iklim faydası, literatürde açık bir tartışma konusudur;
   bu çalışma tarafını tutmuyor, sınır seçiminin sonucu nasıl değiştirdiğini
   gösteriyor.

## 7. Sıradaki iş

| İş | Durum |
|---|---|
| Sistem sınırı analizi | **tamam** |
| Yaşam sonu senaryo duyarlılığı (yakma / depolama / yeniden kullanım) | önerilir — C3'ün ölçeklenmesiyle |
| EPS gömülü karbonu | eksik |
| 6 tarımsal atık / miselyum malzemesi | EPD yok |
| Maliyet | 0/18 |
| Bulgular bölümü taslağı | yazılabilir — üç bulgu da hazır |
