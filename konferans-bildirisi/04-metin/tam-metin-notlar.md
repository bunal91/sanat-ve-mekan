# Tam Metin — Kapsam ve Düzeltme Notları

## Kapsam kararı

Konferansın anlaşmalı dergisi yağmacı profilde olduğu için (bkz.
`../00-konferans-bilgi/yayin-karari.md`), tam metin **bilerek dar** tutuldu.

### Metne giren

Giriş ve literatür, üretim protokolü (tam, tüm parametreleriyle), test programı,
basma / eğilme / yangın / su emme / yoğunluk sonuçları, kısa tartışma,
sınırlılıklar, sonuçlar. Kabul edilen özette söz verilen her şey karşılandı.

### Metne GİRMEYEN — dergi makalesine saklandı

| İçerik | Neden tutuldu |
|---|---|
| σc = 6,93·(katı/su) + 0,04, R² = 0,994 | Tezde yok, özgün analitik katkı |
| Kabuk : bağlayıcı = 2,00 sabit tespiti | Formülasyon tablosu ham kütlelerle verildi, türetilmiş oran sütunları çıkarıldı |
| Dirençlilik modülü türetmesi (Ur = 14,1 kJ/m³) | Tartışmada yalnızca niteliksel olarak anıldı, geliştirilmedi |
| Geleneksel malzeme karşılaştırma bloğu | — |
| Biyo-esaslı malzeme karşılaştırma bloğu | — |
| Materiom / commons çerçevesi | — |
| Agar film literatürüyle ayrıntılı konumlandırma | Tek cümlelik atıfla sınırlandı |
| Modüler tasarım önerisi ve görselleri | — |

Tartışma bölümü dirençlilik önerisini **anıyor ama geliştirmiyor**: kabul edilen
özet bunu vaat ettiği için çıkarılamazdı, ama "developing that proposition into a
quantified evaluation framework is the subject of further work" cümlesiyle
dergi makalesine devredildi.

## Tezde bulunan ve düzeltilen hatalar

**1. Yanlış standart numarası.** Tezin gövde metni "ISO 11925-1 (2020)" diyor;
kaynakçası ise doğru olanı veriyor: **ISO 11925-2:2020, Single-flame source
test.** Part 1 kılavuz, Part 2 test yöntemidir. Tam metinde, sunumda ve tüm
notlarda Part 2 olarak düzeltildi.

**2. Kaynakçada eksik künyeler.** Tezin gövdesinde atıf verilen ama kaynakçasında
yer almayan kaynaklar:

- Rhim (2011), Rhim & Wang (2013) — agar/biyofilm
- Gómez-Guillén vd. (2011) — agar
- Arrieta vd. (2015) — agar film
- Pagliaro vd. (2007) — gliserin
- Rodrigues vd. (2021) — agar biyomimetik
- Kumar vd. (2018) — agar antimikrobiyal
- Santos vd. (2022) — su emme testi
- ASTM D790 — standart künyesi yok (D570 var)

Tam metinde bunların yerine doğrulanmış kaynaklar kullanıldı
(Hernández vd. 2022, Owuamanam & Cree 2020, ASTM D790-17). **Tezin kendi
kaynakçası bu eksikler için ayrıca düzeltilmeli** — dergi hakemi ilk turda yakalar.

**3. Yıl tutarsızlıkları.**
- Teara vd.: gövde 2020, kaynakça 2019, DOI 2019 → **2019** kullanıldı
- Vilarinho vd.: kaynakça 2020, DOI 10.1016/j.oceram.**2022**.100220 → **2022** kullanıldı
- Ashby: gövdede "Ashby & Jones, 2012", kaynakçada "Ashby, M.F. (2011), 4th edn" → **Ashby 2011** kullanıldı

## Göndermeden önce

- [ ] Konferansın tam metin şablonu varsa metin ona aktarılacak
- [ ] Görseller eklenecek: basma düzeneği, fıçılaşmış küp, eğilme düzeneği,
      gerilme–şekil değiştirme eğrileri (Türkçe etiketleri temizlenmiş sürümler
      `../03-gorseller/` içinde)
- [ ] Üniversitenin mali işlerinden tam olarak hangi belgenin istendiği teyit edilecek
- [ ] Konferanstan dergi aktarımının isteğe bağlı olduğu yazılı olarak alınacak
- [ ] iThenticate taraması (Kapadokya Ü. erişimi varsa)
