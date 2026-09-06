# Başvuru Dosyaları ve Word'e Aktarım Rehberi

GAZİ MMFD yazar rehberine göre hazırlanmıştır.
Kaynak: https://dergipark.org.tr/tr/pub/gazimmfd/page/1851

---

## Derginin istediği dört dosya ve buradaki karşılıkları

| # | Dergi dosyası | Bu klasördeki karşılığı |
|---|---|---|
| 1 | Kapak Sayfası | `02-kapak-sayfasi.md` |
| 2 | Makale Kontrol Listesi Formu + Makale Metni | `01-makale-metni.md` (kontrol formu DergiPark'tan indirilip önüne eklenecek) |
| 3 | Genişletilmiş İngilizce Özet | `03-genisletilmis-ingilizce-ozet.md` + `../sekiller/Grafik-ozet.png` |
| 4 | Telif Hakkı Devir Formu | DergiPark'tan indirilecek, imzalanacak, taranıp PDF olarak yüklenecek |

Ayrıca başvuru formundaki **Editöre Not** alanına `04-editore-not.md` içeriği
yapıştırılacaktır. Bu alan boş bırakılırsa makale değerlendirmeye alınmadan
iade edilmektedir.

## Kurallara uygunluk durumu

| Kural | Durum |
|---|---|
| Toplam uzunluk ≤ 20 sayfa | Word'e aktarımda ölçülecek; metin ~5 400 kelime + 7 çizelge + 6 şekil |
| Türkçe özet ≤ 200 kelime | **147 kelime** ✔ |
| Anahtar kelime ≤ 5 | **5** ✔ |
| Genişletilmiş İngilizce özet ≤ 1 sayfa | **583 kelime** ✔ |
| Bölüm numaralandırması (1., 2., 2.1.) | ✔ |
| Bölüm başlıklarının İngilizce karşılıkları | ✔ (parantez içinde) |
| Kaynakların ≥ %30'u son 5 yıl | **%90** ✔ |
| Toplu atıfta en fazla 4 kaynak | ✔ (betikle denetleniyor) |
| Atıf numaralandırması metinde geçiş sırasıyla | ✔ (betikle üretiliyor) |
| Çizelge başlığı üstte, Türkçe + İngilizce | ✔ |
| Şekil başlığı altta, Türkçe + İngilizce | ✔ |
| Şekillerde 300 dpi, < 1 MB | ✔ (en büyüğü 99 KB) |
| Şekil yazıları serif, siyah, büyük harfsiz | ✔ |
| Ondalık ayırıcı Türkçe metinde virgül | ✔ |
| Simgeler bölümü | ✔ |
| Öne çıkanlar (3 madde, TR + EN) | ✔ |
| Grafik özet 6 × 14 cm | ✔ (13,8 × 5,8 cm) |
| SI birimleri | ✔ |

## Word'e aktarırken yapılacaklar

Bu dosyalar düz metin olarak hazırlanmıştır; biçimlendirme Word'de
tamamlanacaktır.

1. **Sayfa düzeni:** A4, tek sütun, kenar boşlukları 2,5 cm, bölüm sonu
   kullanılmayacak.
2. **Yazı tipi:** Gövde metni Times New Roman 9 punto, satır aralığı 1,5,
   paragraflar arası bir satır boşluk, otomatik aralık sıfır.
3. **Alt başlıkların İngilizce karşılıkları:** Times New Roman 8 punto, kalın.
4. **Çizelgeler:** Times New Roman 9 punto (sığmazsa en az 8), kalın yazı
   kullanılmayacak, vurgu gerekiyorsa italik; dolgu ve arka fon olmayacak;
   genişlik 8,5 cm veya 12–16 cm; resim olarak değil, gerçek tablo olarak
   eklenecek.
5. **Şekiller:** `../sekiller/` klasöründeki PNG dosyaları tek öge olarak
   eklenecek; şekil altı yazıları Türkçe, ardından parantez içinde İngilizce
   8 punto.
6. **Denklemler:** Numaralar (1), (2) biçiminde formül dışında metin olarak;
   denklem punto 9; 8,5 cm sütun genişliğine sığacak.
7. **Yazar bilgisi:** `01-makale-metni.md` içinde yazar bilgisi yoktur ve
   olmamalıdır; son gönderimde bu kontrol edilmelidir.
8. **Teşekkür bölümü:** Varsa doldurulacak, yoksa çıkarılacak.
9. **iThenticate:** Benzerlik raporu alınacak.

## Metin içinde doldurulacak yerler

- Kapak sayfasındaki yazar, kurum, ORCID ve iletişim bilgileri
- Yazar katkı oranı beyanı
- Finansman ve teşekkür bölümü
- Veri erişimi bölümündeki depo adresi

## Yeniden üretilebilirlik

Metindeki tüm sayılar `../model/` klasöründeki betiklerden üretilmektedir.
Veri değişirse sırasıyla şu komutlar çalıştırılır:

```
python3 model.py              # karar modeli çıktıları
python3 ts825_aylik.py        # enerji hesabı
python3 sekiller_uret.py      # altı şekil + grafik özet
python3 atif_coz.py           # atıf numaralandırma ve kaynakça
```

## Açık kalan konular

Aşağıdakiler makalenin bilimsel içeriğini değil, doğrulama derinliğini
etkilemektedir; başvuru öncesi tamamlanması önerilir.

1. **TS 825:2024 tam metni.** Kazanç kullanım faktörünün biçimi, soğutma
   hesabının tam formu, iletim düzeltme faktörü ve Ek-E ısıl iletkenlik hesap
   değerleri standardın metninden doğrulanmalıdır. Metin şu anda bu noktalarda
   standarda iddia atfetmemekte, genel yöntem ifadeleri kullanmaktadır.
2. **Kaynak genişletme.** Metinde 29 kaynağa atıf verilmektedir. Derginin
   beklediği yoğunluğa yaklaşmak için `../15-kaynakca-taslagi.md` dosyasındaki
   diğer 31 taranmış kaynak okunup uygun yerlerde kullanılabilir. **Okunmamış
   kaynak kaynakçaya eklenmemelidir.**
3. **Karşılaştırma tablosu.** Giriş bölümünde literatürle karşılaştırma yapılan
   ifadeler, ilgili çalışmaların metinlerinden doğrulanmalıdır.
