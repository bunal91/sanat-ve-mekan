# Şekiller Sicili

**Üretim:** `model/sekiller_uret.py` · **Çıktı:** `sekiller/` (PDF vektör + PNG)
Tüm şekiller model çıktılarından doğrudan üretilir; veri değişirse betik
yeniden çalıştırılarak güncellenir.

## Tasarım kararları

**Renk kullanılmamıştır.** Ayrım gri tonlama, doku (tarama) ve işaretçi
biçimiyle sağlanmıştır. Gerekçe: dergi basılı yayımlanmakta, okurların önemli
bölümü siyah-beyaz çıktı almakta. Bu tercih aynı zamanda renk körlüğü
sorununu baştan ortadan kaldırır.

Diğer kurallar: tek eksen (çift y ekseni yok), ince çizgi ve çerçeve, geri
planda kalan ızgara, iki serinin üzerinde daima lejant, seçili noktalarda
doğrudan etiket, her noktada sayı yazılmaz. Genişlik tek sütun ~7 cm
temel alınarak ölçeklenmiştir; dergi şablonu geldiğinde `GENISLIK` sabiti
güncellenmelidir.

## Şekiller

| No | Dosya | Bölüm | Ne gösteriyor |
|---|---|---|---|
| **1** | `Sekil-1-model-akis-semasi` | 3.1 | Model akışı: iklim verisi ve U hedeflerinden fonksiyonel birime, karar matrisine, ağırlıklandırma ve kısıt üzerinden sıralamaya |
| **2** | `Sekil-2-orantililik` | 4.2 | 18 alternatifin bölgeler arası kalınlık oranı ile teorik oranın çakışması. Önermenin görsel kanıtı; yayılımın yalnızca yuvarlamadan geldiğini gösterir |
| **3** | `Sekil-3-mekanizma-katkisi` | 4.3 | Dört kurgunun Spearman(B1,B6) değeri. Ham modelde 0,998; iklim ayarıyla 0,567. Dört bölge (PVGIS iklimi) |
| **4** | `Sekil-4-sistem-siniri-siralama` | 4.6 | S1 → S2 → S3 arasında sıralamanın değişimi. Beş öne çıkan alternatif koyu, diğerleri açık gri |
| **5** | `Sekil-5-isil-kutle-enerji` | 4.7.1 | İki panel: (a) ısıl kütlenin mutlak katkısı (kWh/m²·yıl), (b) karşılaştırma tabanı olan toplam ihtiyaç. Dört bölge |
| **6** | `Sekil-6-salim-orani-esigi` | 4.6.1 | Camyününün birinci sıraya geçtiği salım oranı eşiği φ\*, üç ağırlıklandırma yöntemi için. Dört bölge |

## Notlar

- **Şekil 2** makalenin en önemli görselidir: 18 ince gri çizginin kalın siyah
  teorik çizgiyle örtüşmesi, orantılılık önermesini tek bakışta anlatır.
- **Şekil 5** beklenenin tersi sonucu taşır; ısıtma çubuklarının soldan sağa
  azalırken soğutma çubuklarının artması, toplamın düz kalması bu şekilde
  görünür hâle gelir.
- **Şekil 6**'da entropi çizgisinin sıfırda düz gitmesi ayrı bir bulgudur:
  entropi altında karbon muhasebesi sonucu hiç etkilemez.
- Şekil 1 dışındaki beş şekil tamamen veriden üretilir; Şekil 1 elle
  konumlandırılmış bir şemadır ve metin değişirse betikten güncellenmelidir.
- Dergi şablonuna göre yapılacaklar: şekil altı yazılarının dergi biçimine
  çevrilmesi, çözünürlük ve genişlik kontrolü, şekil numaralarının nihai
  sıraya göre gözden geçirilmesi.
