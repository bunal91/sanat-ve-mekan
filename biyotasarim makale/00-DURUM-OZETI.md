# DURUM ÖZETİ — GAZİ MMFD makalesi

**Branch:** `claude/biotasarim-makale-hazirlik-mxngcx` · **Güncelleme:** Eylül 2026
Bu dosya giriş noktasıdır. Diğer dosyalar numara sırasıyla okunabilir.

---

## 1. Makale nedir

**Başlık (çalışma):** Eşdeğer ısıl performans varsayımı altında biyo-esaslı yapı
kabuğu malzemelerinin seçimi: kurgunun sonuç üzerindeki belirleyiciliği

**Tek cümlelik katkı:** Bir malzeme sıralaması, ancak onu üreten kurgu —
fonksiyonel birim tanımı, ağırlıklandırma yöntemi, sıralama yöntemi ve sistem
sınırı — eksiksiz beyan edildiğinde yorumlanabilir. Bu dördü, sonucun kendisi
kadar sonucun parçasıdır.

**Hedef dergi:** GAZİ MMFD · Türkçe · 15–20 sayfa · SCI-E, Scopus, TR Dizin
Zorunlu ek dosya: genişletilmiş İngilizce özet (en fazla 1 sayfa).

## 2. Dört bulgu

| # | Bulgu | Dayanağı | Veriye bağımlı mı |
|---|---|---|---|
| **1** | Sabit U hedefine dayalı kurgu, iklim bölgesine göre sıralama farkı **üretemez** | Analitik türetim + sayısal doğrulama: yuvarlama kapalıyken Spearman = 1,000000, entropi ağırlık farkı 0,00 | **Hayır** |
| **2** | Ağırlıklandırma yöntemi, biyo-esaslı alternatiflerin yerini **yönlü** belirler | Entropi ağırlığın %32,8'ini yangın ölçütüne verir; CRITIC ve eşit ağırlık biyo-esaslıları öne alır | **Hayır** |
| **3** | Sistem sınırı, birinci sırayı **altı bölgenin altısında da** değiştirir | EPD modülleri: biyojenik alım C3'te ±0,04 kgCO₂e/kg içinde geri salınır | **Hayır** |
| **4** | Aylık hesap yöntemi, ısıl kütleyi **fiziksel katkısının en yüksek olduğu koşulda göremez** | Dış sıcaklık iç tasarım sıcaklığını aştığı aylarda kullanım faktörü uygulanamaz | Kısmen |

Dördü de aynı savı destekler. **İlk üçü veri kalitesinden bağımsızdır** —
makalenin omurgası budur.

## 3. Dosyalar

| Dosya | İçerik |
|---|---|
| `00-DURUM-OZETI.md` | bu dosya |
| `00-makale-onerisi.md` | ilk üç seçenek ve dergi kısıtları |
| `01-secenek-B-detayli-plan.md` | revize araştırma planı |
| `02-ts825-2024-veri-notu.md` | standarttan çıkarılan parametreler ve eksikler |
| `03-giris-taslagi.md` | **Bölüm 1 — Giriş** (~1,8 s.) |
| `04-pilot-bulgu-notu.md` | orantılılık sorununun keşfi ve düzeltmeler |
| `05-referans-bina-ve-aylik-hesap.md` | referans konut, kullanım faktörü kritiği |
| `06-malzeme-verisi-durumu.md` | malzeme verisi taraması |
| `07-kuramsal-arkaplan-taslagi.md` | **Bölüm 2 — Kuramsal Arka Plan** (~2,4 s.) |
| `08-yontem-taslagi.md` | **Bölüm 3 — Yöntem** (~4,0 s.) |
| `09-gomulu-karbon-notu.md` | Ökobaudat çekimi ve filtreleri |
| `10-sistem-siniri-bulgusu.md` | sistem sınırı bulgusu |
| `11-bulgular-taslagi.md` | **Bölüm 4 — Bulgular** (~4,5 s.) |
| `12-tartisma-taslagi.md` | **Bölüm 5 — Tartışma** (~2,5 s.) |
| `13-sonuc-taslagi.md` | **Bölüm 6 — Sonuç** (~0,9 s.) |
| `14-sekiller-sicili.md` | altı şeklin sicili |
| `15-kaynakca-taslagi.md` | 16 hakemli künye + standartlar |
| `16-iklim-verisi-duzeltmesi.md` | **iklim verisi sorunu ve PVGIS'e geçiş** |
| `sekiller/` | 6 şekil, PDF (vektör) + PNG |
| `model/` | çalışan model, veri, çekim betikleri |

**Taslak toplamı ~17 sayfa** — derginin 15–20 aralığında.

## 4. Model

Saf Python, dış bağımlılık yok (şekiller hariç). `model/` içinde:

| Betik | İşi |
|---|---|
| `model.py` | karar modeli: fonksiyonel birim, entropi/CRITIC/eşit ağırlık, iklim ayarı, TOPSIS/VIKOR, uygulanabilirlik kısıtı, sistem sınırı, orantılılık tanısı, eksik veri koruması |
| `ts825_aylik.py` | referans konut, aylık ısıtma ve soğutma hesabı, iki kullanım faktörü kurgusu |
| `oekobaudat_cek.py` | EPD çekimi, dört veri kalitesi filtresi |
| `pvgis_cek.py` | PVGIS iklim ve ışınım çekimi |
| `kunye_cek.py` | Crossref künye çekimi |
| `sekiller_uret.py` | altı şeklin üretimi |

**Doğrulanmış:** kalınlık hesabı, İZODER'in yayımlanmış asgari kalınlık
tablosunun sekiz noktasının sekizinde de örtüşüyor (R_diğer = 0,30 m²K/W).

## 5. Bu turda ne değişti — iklim verisi

`16-iklim-verisi-duzeltmesi.md` ayrıntılı anlatıyor. Özet: İZODER sunumundan
alınan TS 825:2024 aylık sıcaklık tablosu hem iç tutarsızlık taşıyor
(2. bölge Haziran'da 1. bölgeden sıcak) hem de gerçek iklim normallerinden
çok uzak (Antalya Temmuz 37,0 °C — hiçbir ilde aylık ortalama olamaz).
İklim tabanı **PVGIS**'e taşındı: açık erişimli, atıf verilebilir, ERA5 tabanlı.

Bu değişiklik **iki sınırlılığı kaldırdı** (yer tutucu ışınım tablosu, ikincil
kaynaklı sıcaklıklar), karşılığında **bir sınırlılık ekledi** (enerji hesabı
altı bölgenin dördünü kapsıyor — yalnızca il–bölge eşleşmesi doğrulanabilen
Antalya, İstanbul, Ankara, Erzurum).

**Üç ana bulgunun üçü de etkilenmedi.**

## 6. Sıradaki iş — erişim gerektirmeyen (ben yapabilirim)

| # | İş | Not |
|---|---|---|
| 1 | Modeli PVGIS iklimine geçirmek | `girdi_iklim_pvgis.csv` hazır; `model.py` ve `ts825_aylik.py` bu dosyayı okuyacak biçimde güncellenecek |
| 2 | İklim ağırlıklı mekanizmayı ve enerji sonuçlarını yeniden hesaplamak | Bulgular 4.3, 4.7, 4.7.1 ve Çizelge 6, 11, 13 güncellenecek |
| 3 | Şekil 5'i yeniden üretmek | Betikten |
| 4 | Kaynak sayısını 16'dan 50–65'e çıkarmak | Crossref üzerinden konu taraması; dört başlıkta derinleştirme (`15-kaynakca-taslagi.md` madde 4) |
| 5 | Türkçe literatür taraması | TR Dizin / DergiPark üzerinden TS 825 ve yalıtım malzemesi seçimi |
| 6 | Tarımsal atık panelleri için hakemli LCA verisi aramak | EPD yok; tekil çalışmalardan, düşük veri kalitesi puanıyla |
| 7 | Bölüm metinlerini güncel sayılarla uyumlamak | 4 ve 5. bölümler |

## 7. Sıradaki iş — erişim gerektiren (sizin tarafınızda)

| # | İş | Neden gerekli | Aciliyet |
|---|---|---|---|
| 1 | **TS 825:2024 tam metni** | Kazanç kullanım faktörünün biçimi (τ'ya bağlı mı) yöntemi belirliyor; soğutma hesabının tam formu; iletim düzeltme faktörü; Ek-E | **Yüksek** |
| 2 | Çizelge 1'in dört satırının doğrulanması | K16, K17, K18, K28 makalelerinin metninden; çıkarım yapılmamalı | Yüksek |
| 3 | EPS ve 6 malzemenin gömülü karbonu | Ökobaudat'ta yok veya çevrilemiyor; ICE v3 elektronik tablosu | Orta |
| 4 | Maliyet verisi | Türkiye piyasası, aralık tahminiyle | Düşük |
| 5 | DergiPark dört dosya şablonu | kapak, kontrol formu, genişletilmiş özet, telif devri | Başvuruda |
| 6 | iThenticate benzerlik raporu | Dergi zorunlu tutuyor | Başvuruda |

**Not:** 1 numaralı madde çözülemezse makale yine de yazılabilir. Bu durumda
4.7'deki A/B kurgu karşılaştırması, "TS 825:2024 şunu yapıyor" iddiası yerine
"τ'dan bağımsız bir kullanım faktörü kullanan **herhangi bir** aylık yöntem
ısıl kütleyi göremez" biçiminde genel bir tespit olarak sunulur. Bu, kendi
hesabımızla doğrulanmıştır ve standardın metnine ihtiyaç duymaz.

## 8. Değişmeyen uyarılar

- **Malzeme sıralamaları göstergedir.** Gömülü karbon 11/18, maliyet 0/18,
  λ verisinin ortalama kalitesi 2,44/5. Hiçbir sıralama malzeme tavsiyesi
  olarak sunulmamalı.
- **TOPSIS–VIKOR uyumu düşük** (0,350–0,509). Bu bulgu hem savı destekliyor
  hem de tek bir sıralamanın "doğru cevap" olarak sunulmasını engelliyor.
- **Sınırlılık listesi uzun ve bilerek öyle.** Bu tür bir makalede sınırlılığı
  eksik yazmak, hakemin onu sizin yerinize bulması demektir.
