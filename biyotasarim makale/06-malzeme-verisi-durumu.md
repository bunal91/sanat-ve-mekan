# Malzeme Verisi — tarama sonucu ve modelin gerçek veriyle çıktısı

**Dosyalar:** `model/girdi_malzemeler.csv`, `model/kaynaklar.md`
Önceki yer tutucu dosya `model/girdi_malzemeler_INDIKATIF_yedek.csv` olarak saklandı.

---

## 1. Ne bulundu, ne bulunamadı

Isıl ve fiziksel özellikler için hakemli kaynaklardan değer aralıkları toplandı;
karbon verisi büyük ölçüde açık kaldı.

| Özellik | Kaynaklı | Eksik | Not |
|---|---|---|---|
| Isı iletkenliği λ | 11/18 | 7 | ortalama veri kalitesi 2,44/5 |
| Yoğunluk | 9/18 | 9 | |
| Özgül ısı | 3/18 | 15 | |
| **Gömülü karbon A1–A3** | **1/18** | **17** | **ölçüt modelden çıkarıldı** |
| Biyojenik karbon | 1/18 kaynaklı | 17'si hesapla | kuru biyokütle karbon içeriğinden |
| Maliyet | 0/18 | 18 | |

On iki kaynak `model/kaynaklar.md` dosyasında anahtarlanarak sicile geçirildi
(K01–K14). Her hücre için kaynak anahtarı ve 1–5 veri kalitesi puanı sütunları
eklendi.

**Kullanılmayan kaynak:** ICE v2.0 özet tabloları indirildi ancak sayısal
değerler PDF'te etiketlerden ayrı bir metin katmanında duruyor; satır-değer
eşleştirmesi güvenilir yapılamadığı için kullanılmadı. ICE v3.0'ın elektronik
tablosu doğrudan indirilmelidir.

## 2. Modele eklenen koruma

Eksik veri sessizce sıfır sayılıyordu — bu, bir ölçütü görünmez biçimde
etkisizleştirir. Artık:
- eksik değerler `None` olarak taşınıyor, sıfıra çevrilmiyor;
- eksik oranı %50'yi aşan ölçüt modelden **otomatik olarak çıkarılıyor** ve
  raporlanıyor;
- eksik veriyle karar matrisi kurulmaya çalışılırsa hata veriliyor.

Bu koruma yazılırken kendi hatasını yakaladı: ilk sürüm hesaplanan sütun adına
bakıyordu, dayandığı ham veri sütununa değil; gömülü karbonun 17 eksik hücresi
"0 eksik" görünüyordu.

## 3. Gerçek veriyle sonuçlar — bulgular güçlendi

Gömülü karbon çıkarıldığı için model **8 ölçütle** çalıştırıldı.

### Uygulanabilirlik kısıtı artık dört malzemeyi eliyor
Gerçek λ değerleri yer tutuculardan belirgin biçimde yüksek çıktı (pirinç kavuzu
0,070; fındık kabuğu 0,060 W/mK). 5. ve 6. bölgede 20 cm sınırını aşanlar:
**kenevir-kireç, saman balya, pirinç kavuzu paneli, fındık kabuğu paneli**
(önceki veriyle yalnızca ikisiydi).

### Bölge etkisi yaklaşık iki katına çıktı

| Kurgu | Yer tutucu veri | **Gerçek veri** |
|---|---|---|
| Ham model | 0,998 | 0,998 |
| + uygulanabilirlik kısıtı | 0,956 | 0,982 |
| + iklim ayarlı ağırlık | 0,769 | **0,534** |
| + her ikisi | 0,888 | 0,824 |

Ham modelin 0,998'de sabit kalması beklenen sonuç — orantılılık teoremi veriden
bağımsızdır. Mekanizmalar eklendiğinde etki gerçek veriyle çok daha güçlü.

### Ağırlıklandırma bulgusu sağlamlaştı

| Yöntem | En ağır ölçüt | İlk üç (1. Bölge) |
|---|---|---|
| Entropi | Ö7 Yangına tepki (%32,8) | Kenevir-kireç · Taşyünü · Camyünü |
| CRITIC | Ö6 Biyojenik karbon (%17,7) | Pirinç kavuzu · Fındık kabuğu · Şeker kamışı |
| Eşit | Ö10 Nem/küf (%18,0) | Pirinç kavuzu · Fındık kabuğu · Kenevir-kireç |

Üç yöntemden **ikisi** tarımsal atık esaslı panelleri başa koyuyor; entropi
tek başına ayrışıyor. Bu, argümanı önceki turdakinden daha net yapıyor:
sorun "yöntemler farklı sonuç veriyor" değil, **entropinin yayılımı yüksek tek
bir sıralı ölçüte yoğunlaşarak sistematik biçimde saptırması**.

### Bölgeye göre ilk üç (CRITIC, tam model)

| Bölge | 1 | 2 | 3 |
|---|---|---|---|
| 1–4 | Pirinç kavuzu paneli | Fındık kabuğu paneli | Şeker kamışı küspesi |
| 5–6 | Şeker kamışı küspesi | Genleştirilmiş mantar (ICB) | Camyünü |

Sıcak bölgelerde yüksek ısıl kütleli tarımsal atık panelleri kazanıyor; soğuk
bölgelerde kalınlık kısıtı bunları eleyince yerlerini daha ince kesitli
alternatifler ve camyünü alıyor. Fiziksel olarak tutarlı.

## 4. Bu sonuçlar makaleye girebilir mi?

**Yapısal bulgular evet** — orantılılık teoremi, mekanizmaların etkisi ve
ağırlıklandırma yöntemi duyarlılığı veri kalitesinden bağımsızdır.

**Sıralamalar henüz hayır.** λ verisinin ortalama kalitesi 2,44/5, gömülü karbon
tamamen dışarıda ve maliyet hiç yok. "Pirinç kavuzu paneli birinci" ifadesi
makalede yer alamaz.

## 5. Sıradaki iş — öncelik sırasıyla

1. **Ökobaudat'tan gömülü karbon** (ücretsiz, çevrimiçi). En kritik eksik;
   Ö5'i modele geri getirir.
2. **ICE v3.0 elektronik tablosu** (Circular Ecology) — çapraz doğrulama.
3. **EPD taraması** — EPD International, EPD Türkiye; özellikle ahşap lifi,
   selüloz, mantar, kenevir için doğrulanmış veri ve yaşam sonu modülleri.
4. **Özgül ısı** — 15 eksik; ısıl kütle mekanizması buna dayanıyor.
5. **Yangın sınıfları** — EN 13501-1 belgeleri; entropi bulgusunun dayandığı
   ölçüt olduğu için titiz olunmalı.
6. **Maliyet** — Türkiye piyasası, aralık tahminiyle.
7. **Tarımsal atık panelleri** (pirinç kavuzu, fındık kabuğu, şeker kamışı,
   ayçiçeği) için EPD yok; bu malzemelerin verisi tek tek hakemli çalışmalardan
   toplanacak ve veri kalitesi puanı düşük kalacak. Bu, makalede sınırlılık
   olarak açıkça yazılmalı.
