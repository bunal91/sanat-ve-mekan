# Seçenek B — Detaylı Araştırma Planı
## Biyo-esaslı yapı kabuğu malzemeleri için iklim bölgesine duyarlı çok ölçütlü karar modeli

**Hedef:** GAZİ MMFD · Türkçe · 15–20 sayfa · laboratuvar gerektirmez

---

## 1. Başlık önerileri

1. **"TS 825:2024 iklim bölgeleri kapsamında biyo-esaslı yapı kabuğu malzemelerinin
   seçimi için çok ölçütlü bir karar destek modeli"** *(önerilen)*
2. "Isıtma ve soğutma ihtiyacının birlikte değerlendirildiği koşullarda biyo-esaslı
   yalıtım malzemelerinin iklim bölgesine göre sıralanması: entropi ağırlıklı bir model"
3. "Yaşam sonu senaryolarının karar ölçütü olarak modele dâhil edilmesi: biyo-esaslı
   yapı malzemeleri için bütünleşik bir değerlendirme yaklaşımı"

---

## 2. Araştırma boşluğu ve özgünlük iddiası

### Boşluk
1. **TS 825:2024 henüz literatüre yansımadı.** Standart 1 Nisan 2025'te yürürlüğe
   girdi; derece gün bölgesi sayısı 4'ten **6'ya** çıktı ve binaların yalnızca ısıtma
   ihtiyacına göre tasarlanması dönemi sona ererek **soğutma ihtiyacı** da hesaba
   girdi. Biyo-esaslı malzemeleri bu yeni çerçevede değerlendiren Türkçe bir çalışma
   yok. *(Bu iddiayı başvurudan önce TR Dizin + Scopus taramasıyla doğrulayın.)*
2. **Mevcut MCDM çalışmaları tek bir sıralama üretiyor.** Avrupa ölçeğinde
   biyo-esaslı malzemeleri TOPSIS ile karşılaştıran çalışmalar var (ahşap lifi ve
   mantarın istikrarlı üstünlüğü rapor ediliyor), ancak sıralama iklimden bağımsız
   veriliyor. Oysa gerekli yalıtım kalınlığı bölgeye göre değiştiğinde malzemenin
   kütlesi, dolayısıyla gömülü karbonu ve maliyeti de değişir — **sıralama iklim
   bölgesine göre yer değiştirmelidir.**
3. **Yaşam sonu ve biyojenik karbon ölçüt olarak kullanılmıyor.** Literatür bu iki
   başlığın gömülü karbon hesaplarında en çok iyileştirme gereken alan olduğunu
   söylüyor; karar modellerine ölçüt olarak girmiyorlar.

### Özgünlük iddiası (makalenin tek cümlelik katkısı)
> Bu çalışma, biyo-esaslı yapı kabuğu malzemelerinin sıralamasının iklim bölgesine
> göre değiştiğini gösteren, TS 825:2024'ün altı derece gün bölgesi ve ısıtma–soğutma
> bütünleşik çerçevesine dayanan, yaşam sonu senaryosu ve biyojenik karbon depolamayı
> karar ölçütü olarak içeren bir çok ölçütlü karar destek modeli önermektedir.

### Modelin analitik omurgası — fonksiyonel birim
Bu makalenin en kritik metodolojik kararı budur ve hakem karşısında sizi ayakta tutar:

> **Fonksiyonel birim = TS 825:2024'ün ilgili derece gün bölgesi için öngördüğü U
> değerini sağlayan 1 m² dış duvar bileşeni.**

Malzemeleri λ değerine göre yan yana koymak yanıltıcıdır. Aynı U değerini sağlamak
için her malzeme farklı kalınlık gerektirir; farklı kalınlık farklı kütle, farklı
gömülü karbon, farklı maliyet ve farklı duvar kalınlığı (dolayısıyla kaybedilen
kullanım alanı) demektir. Bölge değiştikçe gerekli U değeri değişir, kalınlık
değişir, sıralama kayar. **Makalenin bulgusu tam olarak bu kaymadır.**

---

## 3. Araştırma soruları

- **AS1.** TS 825:2024'ün altı derece gün bölgesinde, eşit ısıl performans koşulunda
  biyo-esaslı yapı kabuğu malzemelerinin çok ölçütlü sıralaması nasıl değişir?
- **AS2.** Yaşam sonu senaryosu ve biyojenik karbon depolama karar ölçütü olarak
  eklendiğinde sıralama, yalnızca ısıl ve ekonomik ölçütlere dayanan sıralamadan
  ne kadar sapar?
- **AS3.** Önerilen model, referans bir yapı üzerinde yapılan enerji ve karbon
  hesabının sonuçlarıyla tutarlı mıdır?

---

## 4. Yöntem — altı adım

### Adım 1 — Malzeme veri tabanının oluşturulması
14–18 biyo-esaslı alternatif + 3–4 konvansiyonel kıyas malzemesi.

| Grup | Alternatifler |
|---|---|
| Lifli levhalar | Ahşap lifi levha, kenevir lifi levha, keten lifi levha, koyun yünü, geri dönüşüm tekstil |
| Dökme / dolgu | Selüloz (püskürtme), kenevir-kireç (hempcrete), saman balya |
| Kabuk / atık esaslı | Genleştirilmiş mantar (ICB), pirinç kavuzu paneli, ayçiçeği sapı özü paneli, şeker kamışı küspesi paneli, fındık kabuğu esaslı panel |
| Büyütülmüş | Miselyum esaslı kompozit panel |
| Kıyas (biyo-esaslı değil) | EPS, XPS, taşyünü, camyünü |

Kıyas grubunu mutlaka koyun: "biyo-esaslı olan iyidir" varsayımını test etmiş
olursunuz, bu da makaleyi savunuculuktan araştırmaya taşır.

### Adım 2 — Ölçüt setinin tanımlanması

| # | Ölçüt | Birim | Yön | Ana veri kaynağı |
|---|---|---|---|---|
| Ö1 | Isı iletkenlik katsayısı (λ) | W/mK | min | EPD, üretici föyü, TS EN 12667 verisi |
| Ö2 | Fonksiyonel birim kütlesi | kg/m² | min | λ + ρ'dan hesaplanır |
| Ö3 | Özgül ısı kapasitesi (c) | J/kgK | max | Literatür (soğutma performansı için) |
| Ö4 | Su buharı difüzyon direnci (μ) | – | hedef aralık | EPD |
| Ö5 | Gömülü karbon (A1–A3) | kgCO₂e/m² | min | ICE, Ökobaudat, EPD |
| Ö6 | Biyojenik karbon depolama | kgCO₂e/m² | max | EPD modül verisi |
| Ö7 | Yangına tepki sınıfı | EN 13501-1 → sıralı puan | max | Üretici / standart |
| Ö8 | Maliyet | TL/m² | min | Piyasa / birim fiyat |
| Ö9 | Yaşam sonu senaryosu | sıralı puan (kompostlanabilir > geri dönüşüm > enerji geri kazanımı > depolama) | max | EPD C modülleri |
| Ö10 | Nem ve küf duyarlılığı | sıralı puan | min | Literatür |
| Ö11 | Duvar kalınlığı kaybı | mm | min | Kalınlık hesabından |

**Veri kalitesi:** Her hücre için 1–5 arası bir veri güvenilirlik puanı verin
(kaynak türü, coğrafi ve zamansal temsiliyet). Bunu ek tablo olarak sunun.
Hakemin ilk soracağı şey veri kalitesidir; hazırlıklı yakalanırsınız.

### Adım 3 — Ağırlıklandırma
**Entropi yöntemi (birincil)** + **CRITIC (kontrol)**.

> **Önemli uyarı:** AHP için uzman anketi yapmayın veya birincil yöntem olarak
> kullanmayın. Dergi yazım kurallarında "anket sonuçları"nı kabul etmediğini açıkça
> belirtiyor. Objektif, veriden türeyen ağırlıklandırma bu riski tamamen ortadan
> kaldırır. AHP'yi yalnızca duyarlılık senaryolarından biri olarak, varsayımsal
> ağırlık setleriyle kullanabilirsiniz.

### Adım 4 — Sıralama
**TOPSIS (birincil)**, doğrulama için **VIKOR** ve **COPRAS**. Üç yöntemin
sıralamalarını **Spearman sıra korelasyonu** ile karşılaştırın. Yöntemler arası
tutarlılık, modelin sağlamlık kanıtıdır.

Bu adım altı derece gün bölgesi için **ayrı ayrı** tekrarlanır → altı sıralama.

### Adım 5 — Doğrulama (makalenin kabul edilmesini sağlayacak adım)
Model çıktısı, referans bir yapı üzerinde bağımsız bir hesapla sınanır.

- **Referans yapı:** Basit geometrili, TS 825:2024 uyumlu tek katlı/iki katlı bir
  konut ya da eğitim yapısı. Geometri, kabuk alanları ve pencere oranları tabloyla
  verilir (tekrarlanabilirlik için şart).
- **Hesap yolu — iki seçenek:**
  - *(a) Düşük eşik:* TS 825:2024 yıllık ısıtma **ve soğutma** enerjisi ihtiyacı
    hesabı, hesap tablosu üzerinde. Ulusal standart olduğu için bu derginin okuruna
    en anlamlı gelen yol. Yazılım lisansı gerektirmez.
  - *(b) Yüksek eşik:* EnergyPlus (ücretsiz) veya DesignBuilder ile saatlik simülasyon,
    TMY iklim verisiyle, altı bölgeyi temsil eden altı il için.
- **Karbon:** 50 yıllık kullanım ömrü için gömülü + işletme karbonu toplamı.
- **Doğrulama kriteri:** MCDM sıralamasının ilk üçü ile enerji+karbon hesabının ilk
  üçü örtüşüyor mu? Örtüşmüyorsa bu da bir bulgudur — hangi ölçütün sıralamayı
  saptırdığını tartışırsınız.

### Adım 6 — Duyarlılık analizi
- Ağırlıkların ±%20 ve ±%40 değiştirilmesi
- Ö6 (biyojenik karbon) ve Ö9 (yaşam sonu) modelden çıkarıldığında sıralamanın
  nasıl değiştiği → **AS2'nin doğrudan cevabı**
- Maliyet verisindeki belirsizlik senaryoları
- Sonuçları ısı haritası (heatmap) olarak sunun; tek bakışta okunur.

---

## 5. Antroposantrizm hattının modele gömülmesi

Bu, sizin ilgi alanınızı makaleye süs olarak değil **yöntem olarak** sokar:

> Yapı malzemesi seçim modelleri geleneksel olarak insan konforunu, ilk yatırım
> maliyetini ve işletme performansını ölçüt alır; bunların tamamı insan-merkezli ve
> bina ömrüyle sınırlı bir zaman ufkuna aittir. Ö6 (biyojenik karbon depolama) ve
> Ö9 (yaşam sonu senaryosu) ölçütleri, kararı bina ömrünün ötesine — malzemenin
> topraktan geldiği ve toprağa döndüğü zaman ölçeğine — taşır. Bu çalışmada
> antroposantrizm eleştirisi kuramsal bir çerçeve olarak değil, **ölçüt setinin
> genişletilmesi** olarak işletilmektedir; AS2 tam olarak bu genişlemenin karara
> ne kadar fark yaptığını ölçmektedir.

Yerleşimi: Giriş'te ~1 sayfa, Yöntem'de ölçüt gerekçelendirmesinde ~0,5 sayfa,
Tartışma'da ~1 sayfa. Toplamda 2,5 sayfayı geçmesin.

---

## 6. Sayfa bütçeli makale iskeleti

| Bölüm | Sayfa | İçerik | Görsel |
|---|---|---|---|
| 1. Giriş | 2,0 | Yapı sektörü karbon yükü → biyo-esaslı malzemeye geçiş → TS 825:2024 ile değişen çerçeve → insan-merkezli ölçüt setinin sınırı → araştırma boşluğu, sorular, amaç | — |
| 2. Kuramsal arka plan | 2,5 | (2.1) Biyo-esaslı yapı malzemeleri ve performans aralıkları (2.2) Malzeme seçiminde MCDM literatürü ve sınırları (2.3) Gömülü/biyojenik karbon ve yaşam sonu | T1: literatür karşılaştırma tablosu |
| 3. Yöntem | 4,0 | Adım 1–6, fonksiyonel birim tanımı, ölçüt seti, formüller (entropi, TOPSIS, VIKOR) | Ş1: model akış şeması · T2: alternatifler · T3: ölçüt seti · T4: veri kalitesi |
| 4. Bulgular | 4,5 | Bölge bazlı kalınlık ve kütle hesabı → ağırlıklar → altı sıralama → yöntemler arası korelasyon → referans yapı doğrulaması → duyarlılık | T5: karar matrisi · T6: entropi ağırlıkları · Ş2: bölgelere göre sıralama · Ş3: gömülü+işletme karbonu · Ş4: duyarlılık ısı haritası · T7: Spearman |
| 5. Tartışma | 2,5 | Sıralama neden bölgeye göre kayıyor · biyojenik karbon ve yaşam sonunun etkisi · insan-merkezli ölçüt setinin genişletilmesi · uygulanabilirlik ve mevzuat · sınırlılıklar (veri kalitesi, nem/küf, yangın, tedarik) | — |
| 6. Sonuç | 1,0 | Sayısal, net, üç madde | — |
| Kaynaklar | 2,0 | 50–65 kaynak, ağırlıkla son 5 yıl | — |
| **Toplam** | **~18,5** | 15–20 aralığında | 4 şekil · 7 tablo |

Ayrı dosya: genişletilmiş İngilizce özet (1 sayfa, grafik/tablo özeti dahil).

---

## 7. Veri kaynakları

| Kaynak | Ne için |
|---|---|
| Ökobaudat (Almanya, ücretsiz) | Gömülü karbon, biyojenik karbon, yaşam sonu modülleri |
| ICE Database (Bath) | Gömülü karbon ve enerji |
| EPD Türkiye, EPD International, EPD Norge | Ürün bazlı doğrulanmış veri |
| Üretici teknik föyleri | λ, ρ, μ, yangın sınıfı |
| TS 825:2024 | U değeri gereksinimleri, altı derece gün bölgesi, hesap yöntemi |
| Çevre ve Şehircilik / BEP-TR | Referans bina ve iklim verisi |
| Scopus / WoS / TR Dizin | Literatür ve performans aralıkları |

---

## 8. Risk kaydı

| Risk | Olasılık | Karşı önlem |
|---|---|---|
| "Bu bir derleme/genel değerlendirme" eleştirisi | **Yüksek** | Adım 5 (doğrulama) ve Adım 6 (duyarlılık) makalenin ana gövdesi olsun; veri derlemesi Yöntem'in bir alt adımı gibi görünsün, amaç gibi değil |
| Veri kalitesi sorgulaması | Yüksek | Veri güvenilirlik puanı tablosu + tüm kaynakların açık künyesi |
| Avrupa MCDA literatürüyle örtüşme | Orta | Farkı ilk sayfada net söyleyin: TS 825:2024, altı bölge, ısıtma+soğutma, bölgeye göre kayan sıralama |
| "Anket sonuçları kabul edilmiyor" | Orta | AHP uzman anketi kullanmayın; entropi + CRITIC |
| Simülasyon yazılımına erişim | Orta | (a) yolunu seçin: TS 825:2024 hesap tablosu yeterli ve daha yerel |
| Türkiye'de bazı malzemelerin piyasa fiyatı yok | Orta | Maliyeti duyarlılık analizine bırakın, aralık verin |

---

## 9. On iki haftalık takvim

| Hafta | İş |
|---|---|
| 1–2 | Literatür taraması (50–65 kaynak), boşluk iddiasının TR Dizin + Scopus ile doğrulanması |
| 3–4 | TS 825:2024'ün edinilmesi ve altı bölge için U değeri / kalınlık hesap tablosunun kurulması |
| 5–6 | Malzeme veri tabanı ve veri kalitesi puanlaması |
| 7 | Entropi + CRITIC ağırlıkları, karar matrisi |
| 8 | TOPSIS / VIKOR / COPRAS, altı bölge sıralaması |
| 9 | Referans yapı doğrulaması, karbon hesabı |
| 10 | Duyarlılık analizi, şekillerin üretimi |
| 11 | Türkçe metnin yazımı |
| 12 | Genişletilmiş İngilizce özet, dört dosyanın hazırlanması, iThenticate, başvuru |

---

## 10. Bir sonraki adımda sizden gereken kararlar

1. **Referans yapı:** Konut mu, eğitim yapısı mı? Elinizde plan/geometri verisi olan
   gerçek bir yapı var mı?
2. **Hesap yolu:** TS 825:2024 hesap tablosu (a) mı, EnergyPlus (b) mi? Excel'e
   hâkimseniz (a) fazlasıyla yeterli.
3. **TS 825:2024 erişimi:** Standardın tam metnine (TSE'den satın alma veya kurum
   aboneliği) erişiminiz var mı? Altı bölgenin U değeri tablosu olmadan model kurulamaz.
4. **Ortak yazar:** Bina fiziği / enerji tarafından bir ortak yazar makaleyi
   hem hızlandırır hem hakem karşısında güçlendirir.
5. **Maliyet verisi:** Türkiye piyasasından biyo-esaslı malzeme fiyatı bulmakta
   zorlanırsak Ö8'i çıkarıp on ölçütle mi devam edelim, yoksa aralık tahminiyle mi?

Bu beş sorunun cevabı geldiğinde bir sonraki çıktı, karar matrisinin boş iskeleti ve
Giriş bölümünün ilk taslağı olabilir.
