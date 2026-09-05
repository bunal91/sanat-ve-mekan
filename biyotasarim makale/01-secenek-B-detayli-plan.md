# Revize Araştırma Planı
## Eşdeğer ısıl performans varsayımı altında biyo-esaslı yapı kabuğu malzemelerinin seçimi: iklim bölgesi etkisinin sınırları ve koşulları

**Hedef:** GAZİ MMFD · Türkçe · 15–20 sayfa · laboratuvar gerektirmez
**Durum:** Kurgu, pilot çalıştırma bulgularına göre revize edildi
(gerekçe: `04-pilot-bulgu-notu.md`). Model çalışır durumda: `model/model.py`.

---

## 1. Makalenin tek cümlelik katkısı

> Sabit U hedefine dayalı eşdeğer performans yaklaşımı, tanımı gereği iklim
> bölgesine göre malzeme sıralaması farkı üretemez; bölge etkisi ancak
> uygulanabilirlik kısıtı, ısıtma/soğutma dengesi ve dinamik ısıl kütle modele
> dâhil edildiğinde ortaya çıkar. Ayrıca biyo-esaslı alternatiflerin sıralamadaki
> yeri, malzeme özelliklerinden çok ağırlıklandırma yönteminin seçimine bağlıdır.

İki tespit de sınanabilir, analitik gerekçesi verilebilir ve literatürdeki örtük
bir varsayımı düzeltir. "Şu malzeme en iyisidir" iddiasından daha savunulabilir.

---

## 2. Araştırma soruları

- **AS1.** Sabit U hedefine dayalı çok ölçütlü bir seçim modelinde, TS 825:2024'ün
  altı derece gün bölgesi arasında sıralama farkı oluşur mu?
  *Beklenen cevap: hayır — analitik gerekçesiyle birlikte gösterilir.*
- **AS2.** Uygulanabilirlik kısıtı, ısıtma/soğutma dengesi ve dinamik ısıl kütle
  modele eklendiğinde bölge etkisi hangi koşulda ve ne büyüklükte ortaya çıkar?
- **AS3.** Ağırlıklandırma yönteminin seçimi (entropi / CRITIC / eşit ağırlık),
  biyo-esaslı alternatiflerin sıralamasını ne ölçüde belirler; biyojenik karbon
  ve yaşam sonu ölçütlerinin etkisini maskeler mi?

---

## 3. Analitik omurga

### Fonksiyonel birim
> TS 825:2024'ün ilgili derece gün bölgesi için tavsiye ettiği U_duvar değerini
> sağlayan 1 m² dış duvar bileşeni.

### Orantılılık teoremi (AS1'in cevabı)
Gerekli yalıtım kalınlığı

```
d = λ · (1/U_hedef − R_diğer)
```

olduğundan, parantez içi ifade malzemeden bağımsızdır. Bölgeler arası oran
tüm malzemeler için aynıdır:

| Bölge | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| d_b / d_1 | 1,000 | 1,145 | 1,145 | 1,330 | 1,925 | 1,925 |

Kalınlıktan türeyen bütün ölçütler (kütle, gömülü karbon, maliyet, kalınlık
kaybı, alansal ısıl kapasite) bu ortak çarpanla ölçeklenir. TOPSIS ölçek
değişimine duyarsız olduğundan sıralama sabit kalır. Ayrıca sabit U hedefi,
1 m² duvardan geçen iletim kaybını da tanım gereği malzemeden bağımsız kılar.
**Pilot doğrulama:** Spearman(B1, B6) = 0,998.

### Bölge etkisini üreten üç mekanizma (AS2'nin cevabı)

| Mekanizma | Nasıl çalışır | Durum |
|---|---|---|
| (i) Uygulanabilirlik kısıtı | Azami kalınlık sınırı, uygun alternatif kümesini bölgeye göre değiştirir | uygulandı |
| (ii) Isıtma/soğutma dengesi | Ölçüt ağırlıkları bölgenin soğutma payından türetilir | uygulandı |
| (iii) Dinamik ısıl kütle | τ = C/H üzerinden kazanç kullanım faktörü — doğrusal değil, orantılılığı kırar | referans bina bekliyor |

**Pilot sonucu:**

| Kurgu | Spearman(B1, B6) |
|---|---|
| Ham model | 0,998 |
| + uygulanabilirlik kısıtı | 0,956 |
| + iklim ayarlı ağırlık | 0,769 |
| + her ikisi | 0,888 |

---

## 4. Yöntem — yedi adım

1. **Malzeme veri tabanı.** 14 biyo-esaslı alternatif + 4 konvansiyonel kıyas.
   Her hücre için kaynak künyesi ve 1–5 veri güvenilirlik puanı.
2. **Fonksiyonel birim hesabı.** Bölge başına kalınlık, kütle, alansal ısıl
   kapasite, gömülü ve biyojenik karbon, maliyet.
3. **Hesap temelinin doğrulanması.** Kalınlık hesabı, İZODER'in TS 825:2024
   için yayımladığı asgari kalınlık tablosuyla karşılaştırılır.
   *Ulaşılan sonuç: 8 test noktasının 8'inde uyum, R_diğer = 0,30 m²K/W.*
4. **İklim dengesinin türetilmesi.** TS 825:2024 aylık dış sıcaklıklarından
   bölge başına IDG, SDG ve soğutma payı.
5. **Ağırlıklandırma.** Entropi, CRITIC ve eşit ağırlık; ardından bölgeye bağlı
   ayar `w' = w · (1 + α · ilgili_pay)`.
   *Uzman anketi kullanılmaz — dergi anket sonuçlarını kabul etmiyor.*
6. **Sıralama.** TOPSIS birincil, VIKOR yöntem tutarlılığı için; Spearman ile
   karşılaştırma. Uygulanabilirlik kısıtı bölge başına uygulanır.
7. **Duyarlılık analizi.** α katsayısı, azami kalınlık sınırı, R_diğer,
   ağırlıkların ±%20/±%40 değişimi, Ö6 ve Ö9'un modelden çıkarılması.

### Doğrulama (adım 3'e ek)
Referans konut üzerinde TS 825:2024 aylık ısıtma **ve soğutma** enerjisi
ihtiyacı hesabı; ilk üç alternatifin 50 yıllık gömülü + işletme karbonu.
Bu adım aynı zamanda mekanizma (iii)'ü modele sokar.

---

## 5. Ölçüt seti

| # | Ölçüt | Birim | Yön |
|---|---|---|---|
| Ö1 | Isı iletkenliği (λ) | W/mK | min |
| Ö2 | Fonksiyonel birim kütlesi | kg/m² | min |
| Ö3 | Alansal ısıl kapasite (d·ρ·c) | kJ/m²K | max · *soğutma payıyla ağırlaşır* |
| Ö5 | Gömülü karbon (A1–A3) | kgCO₂e/m² | min |
| Ö6 | Biyojenik karbon depolama | kgCO₂e/m² | min |
| Ö7 | Yangına tepki (EN 13501-1) | sıralı 1–7 | max |
| Ö8 | Maliyet | TL/m² | min · *aralık tahminiyle, duyarlılıkta* |
| Ö9 | Yaşam sonu senaryosu | sıralı 1–4 | max |
| Ö10 | Nem/küf duyarlılığı | sıralı 1–5 | min · *ısıtma payıyla ağırlaşır* |
| Ö11 | Duvar kalınlığı kaybı | cm | min |

---

## 6. Antroposantrizm hattı

Ölçüt setine gömülü olarak işler, süs olarak değil:

> Malzeme seçim modelleri geleneksel olarak insan konforunu, ilk yatırım
> maliyetini ve işletme performansını ölçüt alır; bunların tamamı insan-merkezli
> ve bina ömrüyle sınırlı bir zaman ufkuna aittir. Ö6 ve Ö9, kararı bina ömrünün
> ötesine taşır. AS3 tam olarak bu genişlemenin karara kaç sıra fark ettirdiğini,
> ve ağırlıklandırma yönteminin bu farkı ne ölçüde görünmez kıldığını ölçer.

Yerleşim: Giriş ~1 sayfa, Yöntem'de ölçüt gerekçesi ~0,5 sayfa, Tartışma ~1 sayfa.

---

## 7. Sayfa bütçeli iskelet

| Bölüm | Sayfa | Görsel |
|---|---|---|
| 1. Giriş | 2,0 | — |
| 2. Kuramsal arka plan | 2,5 | T1 literatür karşılaştırması |
| 3. Yöntem | 4,0 | Ş1 model akış şeması · T2 alternatifler · T3 ölçüt seti · T4 veri kalitesi |
| 4. Bulgular | 4,5 | T5 doğrulama · Ş2 orantılılık · T6 iklim dengesi · Ş3 mekanizma etkisi · T7 ağırlık karşılaştırması · Ş4 bölge sıralamaları · Ş5 duyarlılık ısı haritası |
| 5. Tartışma | 2,5 | — |
| 6. Sonuç | 1,0 | — |
| Kaynaklar | 2,0 | 50–65 kaynak |
| **Toplam** | **~18,5** | 5 şekil · 7 tablo |

Ayrı dosya: genişletilmiş İngilizce özet (1 sayfa, grafik/tablo özeti dahil).

---

## 8. Risk kaydı

| Risk | Karşı önlem |
|---|---|
| "Derleme/genel değerlendirme" eleştirisi | Analitik teorem + doğrulama + duyarlılık gövdeyi oluşturur; veri derlemesi yöntemin alt adımı |
| Veri kalitesi sorgulaması | Güvenilirlik puanı tablosu, açık kaynak künyeleri |
| "Sonuç negatif, bulgu yok" eleştirisi | AS1 negatif değil, koşullu: AS2 etkinin hangi koşulda doğduğunu ölçer |
| Avrupa MCDA literatürüyle örtüşme | Farkı ilk sayfada söyle: TS 825:2024, altı bölge, orantılılık teoremi, yöntem duyarlılığı |
| "Anket sonuçları kabul edilmiyor" | AHP uzman anketi yok; entropi/CRITIC/eşit ağırlık |
| TS 825:2024 tam metnine erişim | Model kamuya açık parametrelerle çalışıyor; atıf ve Ek-E için standart edinilmeli |

---

## 9. Kalan işler

| # | İş | Durum |
|---|---|---|
| 1 | Orantılılık tanısı | tamam |
| 2 | Uygulanabilirlik kısıtı | tamam |
| 3 | Entropi / CRITIC / eşit ağırlık | tamam |
| 4 | VIKOR ile yöntem tutarlılığı | tamam |
| 5 | Bölgeye bağlı ağırlık ayarı | tamam |
| 6 | Referans konut + TS 825:2024 aylık hesabı + τ = C/H | **sıradaki** |
| 7 | Gerçek malzeme verisi (EPD / Ökobaudat / ICE) | **sıradaki** |
| 8 | Literatür taraması, 50–65 kaynak | sıradaki |
| 9 | Duyarlılık analizi ve şekillerin üretimi | 6 ve 7'den sonra |
| 10 | Türkçe metin, genişletilmiş İngilizce özet, dört dosya, iThenticate | son |
