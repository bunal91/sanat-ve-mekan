# Başvuru Dosyaları ve Word'e Aktarım Rehberi

GAZİ MMFD yazar rehberine göre hazırlanmıştır.
Kaynak: https://dergipark.org.tr/tr/pub/gazimmfd/page/1851

---

## Derginin istediği dört dosya ve buradaki karşılıkları

| # | Dergi dosyası | Bu klasördeki karşılığı |
|---|---|---|
| 1 | Kapak Sayfası | **`02-kapak-sayfasi.docx`** — derginin resmî kapak şablonu üzerine kurulmuştur |
| 2 | Makale Kontrol Listesi Formu + Makale Metni | **`01-makale-metni.docx`** (kontrol formu DergiPark'tan indirilip önüne eklenecek) |
| 3 | Genişletilmiş İngilizce Özet | **`03-genisletilmis-ingilizce-ozet.docx`** — derginin resmî şablonu üzerine kurulmuştur; Figure A gömülü |
| 4 | Telif Hakkı Devir Formu | DergiPark'tan indirilecek, imzalanacak, taranıp PDF olarak yüklenecek |

Editöre Not için: **`04-editore-not.docx`**.
Ek tablolar için: **`05-ek-tablolar.docx`** (tam karar matrisi, hücre bazında
veri kaynakları, kullanılan ÖKOBAUDAT veri kümeleri ve yangın kodlaması
duyarlılığı). Makale metni bu dosyaya üç yerde atıf vermektedir.
Markdown kaynakları aynı adla `.md` uzantısıyla korunmuştur. Yeniden üretim:

| Dosya | Komut | Kaynak |
|---|---|---|
| `01-makale-metni.docx` | `node makale_word.js` | `01-makale-metni.md` |
| `02-kapak-sayfasi.docx` | `python3 kapak_kur.py` | `sablon/kapak-sablonu.docx` |
| `03-genisletilmis-ingilizce-ozet.docx` | (elle) | `sablon/genisletilmis-ozet-sablonu.docx` |
| `04-editore-not.docx` | `node yan_dosyalar_word.js` | `04-editore-not.md` |
| `05-ek-tablolar.docx` | `node yan_dosyalar_word.js` | `05-ek-tablolar.md` |

Derginin yayımladığı iki şablon dosyası `sablon/` klasöründe değiştirilmeden
saklanmaktadır. Kapak sayfası ve genişletilmiş özet bu şablonlar üzerine
kurulduğu için `yan_dosyalar_word.js` bu ikisini **üretmez**; üretseydi
şablon yapısını bozardı.

Ayrıca başvuru formundaki **Editöre Not** alanına `04-editore-not.md` içeriği
yapıştırılacaktır. Bu alan boş bırakılırsa makale değerlendirmeye alınmadan
iade edilmektedir.

## Ayrıntılı yazım kurallarına göre yapılan güncellemeler

Derginin ayrıntılı makale formatı rehberine göre metin yeniden düzenlenmiştir:

| Kural | Uygulama |
|---|---|
| Ön sayfa sırası | Türkçe başlık (14 pt) → Öne Çıkanlar → Öz → Anahtar Kelimeler → İngilizce başlık (14 pt) → Highlights → Abstract → Key Words |
| Ana başlıklar | 1. Giriş, 2. Teorik Metot, 3. Sonuçlar ve Tartışmalar, 4. Simgeler, 5. Sonuçlar; kalın, cümle düzeninde |
| Teşekkür ve Kaynaklar | **numarasız** (kural gereği) |
| İkincil başlıklar | 2.1., 2.2., … biçiminde; Kelimelerin İlk Harfleri Büyük |
| İngilizce karşılıklar | **Her başlık, alt başlık, tablo ve şekil adının** yanında parantez içinde 8 punto |
| Tablo adlandırması | "Çizelge" değil **"Tablo"**; başlık tablonun üstünde, Türkçe adı ve hemen ardından parantez içinde İngilizcesi |
| Şekil adlandırması | Başlık şeklin altında, Türkçe adı ve parantez içinde İngilizcesi |
| Kaynaklar | Yayımlanmış makalelerde **DOI verilmemiştir** (kural gereği); 23 DOI kaldırıldı |
| Şekil üzerindeki yazılar | Türkçe, Times 10 punto, siyah, büyük harfsiz, kenarlıksız |
| Toplu atıf | En fazla 4 kaynak; betikle denetleniyor |

## Uygulanamayan / dikkat edilmesi gereken

1. **Dergi adı kısaltmaları.** Kural, dergi başlıklarının UBC listesine göre
   kısaltılmasını istiyor. Kaynakçadaki dergi adları şu an **açık hâlde**;
   başvuru öncesi kısaltılmalıdır.
2. **Dördüncü seviye başlık.** Kural altı çizili olmasını istiyor; bu makalede
   dördüncü seviye başlık bulunmamaktadır.
3. **Ekler.** Makalede ek bölümü yoktur.

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

## Word dosyalarında uygulanmış biçimlendirme

Aşağıdakiler `.docx` dosyalarına doğrudan uygulanmıştır; Word'de yeniden
yapılması gerekmez.

- A4, tek sütun, kenar boşlukları 2,5 cm (1417 twips), bölüm sonu yok
- Gövde metni Times New Roman 9 punto, satır aralığı 1,5, otomatik paragraf
  aralığı sıfır, paragraflar arası bir satır boşluk
- Bölüm başlıkları kalın 9 punto; İngilizce karşılıkları kalın 8 punto
- Çizelgeler gerçek tablo olarak, 9 punto, kalın yazı ve dolgu yok, sayfa
  genişliğine oturtulmuş; başlıklar üstte Türkçe + İngilizce (8 punto italik)
- Şekiller tek öge olarak gömülü, 300 dpi; başlıklar altta Türkçe + İngilizce
- Şekiller ve çizelgeler metinde ilk anıldıkları yere yerleştirilmiş
- Denklem numaraları (1)–(4) metin olarak

## Word'de elle yapılacaklar

1. **Kontrol listesi formu:** DergiPark'tan indirilip makale metninin önüne
   eklenecek.
2. **Kapak sayfası:** Yazar, kurum, ORCID, iletişim ve katkı oranı alanları
   doldurulacak.
3. **Teşekkür bölümü:** Varsa doldurulacak, yoksa çıkarılacak.
4. **Sayfa sayısı:** Word'de açıldığında 20 sayfa sınırı doğrulanacak.
5. **Yazı tipi kontrolü:** Belgeler Times New Roman olarak tanımlanmıştır;
   şekiller Liberation Serif ile üretilmiştir (Times New Roman ile metrik
   olarak uyumlu ikame). Dergi ısrar ederse şekiller gerçek Times New Roman
   ile yeniden üretilebilir.
6. **Yazar bilgisi:** Makale metni dosyasında yazar bilgisi yoktur; son
   gönderimde teyit edilmelidir.
7. **iThenticate:** Benzerlik raporu alınacak.

## Genişletilmiş İngilizce özet — şablon uyumu

Bu dosya sıfırdan yazılmamış, **derginin kendi şablon dosyası** üzerine
kurulmuştur; şablonun tablo düzeni, yazı tipi ve punto ayarları olduğu gibi
korunmuştur. Doldurulan alanlar: başlık, üç Highlights maddesi, Figure A
açıklaması, Figure A görseli ve başlığı, Purpose, Theory and Methods, Results,
Conclusion ve beş Keywords.

**Dokunulmayan alanlar** (şablonun açık talimatı gereği): yazar adları,
kurum adresleri, Article Info (Received/Accepted/DOI), Acknowledgement,
Correspondence. Şablon bu sarı dolgulu alanların bu dosyada
doldurulmamasını, kapak sayfasında verilmesini istemektedir.

**Figure A**, şablonun beş maddelik kuralına göre yeniden üretilmiştir:
üzerindeki yazılar İngilizce, Times 9 punto, kalın değil, kenarlık çizgisi
yok, çalışmayı özetleyen tek bir görsel. Açıklaması, şablonun istediği gibi
görselden önce ve Figure A'ya atıf verilerek yazılmıştır.
Kaynak: `../sekiller/Figure-A.png` (`sekiller_uret.py` içindeki `figure_a()`).

Şablonun yazara yönelik açıklama metinleri (doldurulacak alanların içindeki
yönergeler) boşaltılmıştır; şablonun kendi üst ve alt notları korunmuştur.
Word'de bunları silmek isterseniz serbestsiniz.

## Doğrulama durumu

Dört `.docx` dosyasının tamamı XSD şema doğrulamasından geçmiştir
(`All validations PASSED`). Genişletilmiş özet ayrıca şablonla
karşılaştırmalı olarak doğrulanmıştır: paragraf sayısı 90 → 90, yani
şablonun yapısı bozulmamıştır. İçerik pandoc ile geri okunarak teyit edilmiştir:
7 çizelge, 6 şekil, 29 kaynak, doğru kenar boşluğu, yazı tipi, punto ve satır
aralığı. **Görsel sayfa önizlemesi yapılamamıştır**; bu ortamdaki LibreOffice
hiçbir docx dosyasını açamamaktadır (asgari bir test belgesiyle doğrulandı).
Dosyalar Word'de ilk açılışta gözle kontrol edilmelidir.

## Kapak sayfası — şablon uyumu

Bu dosya da sıfırdan yazılmamış, **derginin kendi kapak şablonu** üzerine
kurulmuştur (`kapak_kur.py`). Şablonun alan sırası, etiket metinleri, yazı
tipi, punto, hizalama ve satır aralığı ayarları olduğu gibi korunmuştur;
İngilizce bölümdeki "Yazar adları ve adres bilgileri:" etiketi de şablonda
Türkçe olduğu için Türkçe bırakılmıştır.

Tek yazar varsayılmış, şablondaki beş yazarlı örneğin ikinci kurum satırları
kaldırılmıştır. Yazar sayısı artarsa üst simge numaraları ve kurum satırları
şablondaki gibi çoğaltılır.

## Metin içinde doldurulacak yerler

- Kapak sayfasındaki ad soyad, kurum adresi (Türkçe ve İngilizce), ORCID ve
  telefon; e-posta alanında `b.unal91@gmail.com` yazılıdır, kurumsal adres
  varsa değiştirilecektir
- Yazar katkı oranı beyanı (başvuru formunda; kapak şablonunda alan yoktur)
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
python3 iklim_cek.py          # PVGIS 5.3 iklim girdisi
python3 duyarlilik.py         # duyarlılık çözümlemeleri ve ek tablolar
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

## Hakem değerlendirmesine göre yapılan revizyon

Metin, ayrıntılı bir hakem değerlendirmesi üzerine baştan sona denetlenmiş ve
revize edilmiştir. Her maddenin doğruluğu, doğrulama yöntemi ve yapılan işlem
`../17-hakem-yorumlarina-yanit.md` dosyasında madde madde kayıtlıdır.

Revizyonun hesaba dokunan başlıkları:

- Havalandırma ısı kaybı formülü TS 825 biçimine getirildi
  (`H_V = 0,33 n_h V_h`); önceki biçim ısı kaybını yaklaşık 2,24 kat eksik
  hesaplıyordu. Tüm enerji sonuçları yeniden üretildi.
- İklim verisi PVGIS 5.3'e taşındı (SARAH3 + ERA5, 2005–2023); yeni betik
  `model/iklim_cek.py`.
- İki malzemenin ısı iletkenliği ve yoğunluğu, tam metni okunan hakemli
  kaynaklarla değiştirildi (ayçiçeği sapı-kitosan kompozit; şeker kamışı
  küspesi levhası).
- Eksik veri kuralı, metinde yazılan biçimden kodun gerçekte uyguladığı biçime
  düzeltildi ve eşik duyarlılığı eklendi.
- İklim ayarı, iklim verisi olmayan bölgelerde sessizce atlanmak yerine hata
  veriyor; iklime bağlı çözümlemeler dört bölgeyle sınırlı olarak raporlanıyor.
- Yangına tepki sınıfının sayısallaştırılmasına duyarlılık çözümlemesi eklendi
  (`model/duyarlilik.py`).

## Benzerlik raporu

9 Eylül 2026 tarihli rapor, revizyon öncesi metin üzerinde %15 genel benzerlik
vermiştir. Raporun işaretlediği parçalar tek tek çıkarıldığında dağılım şudur:

| Nerede | İşaretli sözcük | Belgeye oranı |
|---|---|---|
| Kaynaklar listesi | 663 | %13,3 |
| Gövde metni | 67 | %1,3 |
| **Toplam** | **730** | **%14,6** |

Yani oranın neredeyse tamamı kaynakça künyelerinden gelmektedir; bunlar doğru
verilmiş atıflardır ve değiştirilemez. **Raporu "Bibliography" ve "Quotes"
hariç tutma seçenekleri açık biçimde yeniden almak gerekir**; iThenticate ve
Turnitin bu ayarları taşımaktadır. Kaynak sayısı revizyonla 29'dan 37'ye
çıktığı için, kaynakça dâhil alınan bir rapor daha yüksek bir oran verecektir.

Gövdedeki 67 sözcüklük eşleşme dört yerdeydi ve üçü yeniden yazıldı:

- Giriş'in TS 825 paragrafı (sektörel yayınlardaki kalıp anlatımla örtüşüyordu)
  yeniden kuruldu; "120–150" ve "70–90 kWh/m²·yıl" ifadeleri çıkarıldı.
- Entropi ve CRITIC anlatımı yeniden yazıldı, formüller numaralı denkleme alındı.
- Özgül ısı kaybı anlatımı yeniden yazıldı, formüller numaralı denkleme alındı.
- TOPSIS yakınlık katsayısı ve kullanım faktörü de numaralı denkleme alındı.

Değiştirilmeyenler ve nedenleri:

- **"3. Sonuçlar ve Tartışmalar (Results and Discussions)"** başlığı derginin
  kendi zorunlu başlığıdır; dergipark eşleşmesi bundandır.
- **Isı kaybı ve entropi formülleri** standardın ve yöntemin kendi biçimidir.
- **"Q_H (kWh/m²)", "Q_C (kWh/m²)"** gibi tablo başlıkları semboldür.

Denklem numaralandırması bu revizyonla birlikte 4'ten **11'e** çıkmıştır; bu
aynı zamanda derginin "denklemler numaralandırılır" kuralına tam uyum sağlar.

## Terim kararı

Metnin tamamında **"biyo-bazlı"** kullanılmaktadır ("biyo-esaslı" değil).
Değişiklik makale metni, kapak sayfası, editöre not ve tüm çalışma
notlarında uygulanmıştır. Farklı kökten türeyen bileşikler
("atık esaslı", "mineral esaslı", "miselyum esaslı", "kabuğu esaslı")
olduğu gibi bırakılmıştır. İngilizce karşılık değişmemiştir: *bio-based*.
