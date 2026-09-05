# İklim Verisi Düzeltmesi — önemli bulgu ve yapılan değişiklik

**Betikler:** `model/pvgis_cek.py` · **Yeni veri:** `model/girdi_iklim_pvgis.csv`

---

## 1. Sorun

Modelin iklim tarafı, İZODER sunumundan (K11) çıkarılan "TS 825:2024 dış ortam
sıcaklıkları" tablosuna dayanıyordu. Bu tablo üzerinde iki bağımsız kontrol
yapıldı ve ikisi de tabloyu enerji hesabına temel olarak kullanmanın doğru
olmadığını gösterdi.

**Birinci kontrol — iç tutarlılık.** Tabloda 2. bölge (Sıcak) Haziran ayında
35,41 °C ile 1. bölgeden (Aşırı Sıcak, 35,20 °C) daha sıcaktır. Bölgeler iklim
şiddetine göre sıralandığından bu sıralama kendi içinde tutarsızdır.

**İkinci kontrol — gerçek iklimle karşılaştırma.** PVGIS (AB Ortak Araştırma
Merkezi) üzerinden 2018–2020 aylık ortalamalarıyla karşılaştırıldığında fark
büyüktür:

| | Ocak | Temmuz | IDG | SDG | Soğutma payı |
|---|---|---|---|---|---|
| **Antalya** — tablo | 9,6 | **37,0** | 1908 | 1187 | %38,4 |
| **Antalya** — PVGIS | 9,7 | **29,5** | 1253 | 242 | %16,2 |
| **Erzurum** — tablo | **−16,0** | 17,6 | 7304 | 0 | %0,0 |
| **Erzurum** — PVGIS | **−7,3** | 18,4 | 4985 | 0 | %0,0 |

Kışın tablo değerleri gerçek ortalamaların belirgin biçimde altında, yazın
üstündedir. 37,0 °C hiçbir Türkiye ilinde aylık **ortalama** olamaz; bu
değerler tasarım veya uç değer niteliğindedir. PDF metin katmanı yeniden
okunarak çıkarımın kaynağa sadık olduğu doğrulanmıştır — sorun aktarımda değil,
tablonun kendisinde ya da ikincil kaynaktaki sunumundadır.

**Sonuç:** bu tablo, aylık enerji hesabına ve derece gün türetimine temel
yapılamaz.

## 2. Yapılan değişiklik

İklim tabanı **PVGIS** verisine taşındı. PVGIS açık erişimlidir, atıf
verilebilir ve tekrarlanabilir.

- **Sıcaklık:** PVGIS MRcalc, ERA5, 2018–2020 aylık ortalamaları.
- **Işınım:** PVGIS PVcalc, düşey yüzey (eğim 90°), dört yön için aylık
  ortalama şiddet (W/m²). Bu, TS 825:2024 Ek-C'ye erişilemediği için kullanılan
  **yer tutucu tabloyu da ortadan kaldırır.**

Üretilen değerler fiziksel olarak tutarlıdır: Ocak'ta güney cephe en yüksek
(Antalya 159 W/m²), Temmuz'da doğu ve batı cepheler güneyi aşar (Antalya
158 ve 171 W/m²'ye karşı 108 W/m²), kuzey cephe yıl boyu en düşüktür. Bu
davranış, bu enlemlerde beklenen yaz güneş açısı davranışıdır.

## 3. Kapsam daralması ve gerekçesi

PVGIS verisi il bazlıdır; bölgeye bağlanabilmesi için il–bölge eşleşmesi
gerekir. Elimizde **İZODER'in asgari kalınlık tablosundan doğrulanan dört
eşleşme** vardır: Antalya (1), İstanbul (3), Ankara (4), Erzurum (6).

Bölgeleri, adayların PVGIS sıcaklık profilini TS 825 tablosuna eşleyerek
belirleme denendi ve **başarısız oldu**: yöntem Antalya yerine Şanlıurfa'yı,
İstanbul yerine Konya'yı seçti ve RMSE değerleri 3–8 °C çıktı. Bu, 1. maddedeki
tespitin ayrı bir doğrulaması olmuştur — tablo gerçek iklim profillerine
eşlenemiyor.

**Karar:** Karar modeli **altı bölge** üzerinde kalır; dayandığı U değeri
tablosu birden fazla kaynakla örtüşen ve iç tutarlı bir veridir. Enerji hesabı
ise **doğrulanmış dört bölge** ile sınırlanır. Bu, kapsamı daraltır ama
sonuçları savunulabilir kılar.

## 4. Soğutma payı ölçütünün gözden geçirilmesi

Aylık **ortalama** sıcaklıklarla 26 °C tabanına göre soğutma derece günü,
Antalya dışında sıfır çıkmaktadır; çünkü Türkiye'de aylık ortalamalar 26 °C'yi
nadiren aşar. Bu, iklim ağırlıklandırma mekanizmasını işlevsiz bırakır.
Taban sıcaklığına duyarlılık incelendi:

| Bölge | 26 °C | 24 °C | **22 °C** | 20 °C | 18 °C |
|---|---|---|---|---|---|
| 1 Antalya | %16,2 | %27,4 | **%36,4** | %45,7 | %53,2 |
| 3 İstanbul | %0,0 | %1,3 | **%7,6** | %16,7 | %24,3 |
| 4 Ankara | %0,0 | %0,0 | **%2,7** | %6,8 | %13,5 |
| 6 Erzurum | %0,0 | %0,0 | **%0,0** | %0,0 | %0,2 |

**22 °C** tabanı seçilmiştir: soğutma derece günü hesaplarında yaygın kullanılan
bir tabandır ve tek yönlü, anlamlı bir gradyan üretir (%36,4 → %0,0).
Taban seçimi duyarlılık analizine eklenmelidir.

## 5. Sonuçlara etkisi

| Sonuç | Etkilenme |
|---|---|
| **Orantılılık önermesi (AS1)** | **Etkilenmez.** Analitiktir; iklim verisine bağlı değildir |
| **Ağırlıklandırma bulgusu (AS3)** | **Etkilenmez.** İklim verisinden bağımsızdır |
| **Sistem sınırı bulgusu** | **Etkilenmez.** EPD modüllerine dayanır |
| Uygulanabilirlik kısıtı | Etkilenmez. U değerlerine dayanır |
| İklim ağırlıklı mekanizma | **Yeniden hesaplanmalı.** Gradyanın şekli korunur, büyüklüğü değişir |
| Aylık ısıtma ve soğutma enerjisi | **Yeniden hesaplanmalı** |
| Isıl kütle enerji farkı (Çizelge 11, 13) | **Yeniden hesaplanmalı** |
| Şekil 5 | **Yeniden üretilmeli** |

Makalenin üç ana bulgusunun **üçü de etkilenmemektedir**. Etkilenen kısım,
ikinci mekanizmanın sayısal büyüklüğü ve enerji hesabı sonuçlarıdır.

## 6. Kazanç

Bu düzeltme, sınırlılık listesinden iki maddeyi kaldırır:

- *"Güneş ışınımı verisi: TS 825:2024 Ek-C değerleri kullanılamamış, yer tutucu
  bir tablo kullanılmıştır."* → Artık açık ve atıf verilebilir gerçek veri var.
- *"Aylık dış sıcaklıklar ikincil kaynaktan alınmıştır."* → Artık ERA5 tabanlı
  normaller kullanılıyor.

Karşılığında bir sınırlılık eklenir: enerji hesabı altı bölgenin dördünü
kapsamaktadır.
