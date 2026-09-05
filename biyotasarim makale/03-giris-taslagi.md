# 1. GİRİŞ — ilk taslak

> **Not:** `[KAYNAK: …]` işaretleri, literatür taraması tamamlandığında
> doldurulacak atıf yerleridir. Hedef uzunluk 2,0 sayfa.

---

Binalar, Türkiye'nin nihai enerji tüketiminde tek başına en büyük paya sahip
sektörlerden biridir; konut ve hizmet binaları 2023 yılında toplam nihai enerji
tüketiminin %32,3'ünü oluşturmuştur [KAYNAK: ETKB enerji istatistikleri].
Bu payın büyüklüğü, yapı kabuğunun ısıl performansını yalnızca bir konfor
meselesi olmaktan çıkarıp ulusal enerji politikasının doğrudan konusu hâline
getirmektedir. Nitekim TS 825 "Binalarda Isı Yalıtımı Kuralları" standardı
2024 yılında köklü biçimde revize edilmiş, 20 Şubat 2025 tarihli tebliğle
1 Nisan 2025 itibarıyla zorunlu standart olarak yürürlüğe girmiştir
[KAYNAK: TS 825:2024]. Revizyon iki yapısal değişiklik getirmiştir: derece gün
bölgesi sayısı dörtten altıya çıkarılmış ve binaların yalnızca ısıtma ihtiyacına
göre tasarlanması dönemi sona ererek soğutma ihtiyacı da hesaba dâhil edilmiştir.
Yeni standartla birlikte tavsiye edilen ısıl geçirgenlik değerleri iyileştirilmiş,
yıllık enerji limitleri 120–150 kWh/m²·yıl düzeyinden 70–90 kWh/m²·yıl düzeyine
çekilmiştir [KAYNAK: İZODER 2025].

Bu düzenleyici çerçeve değişimi, yapı kabuğunda kullanılacak yalıtım
malzemesinin seçimini yeniden gündeme getirmektedir. Gerekli yalıtım
kalınlıklarının artması, malzeme başına düşen kütlenin ve dolayısıyla gömülü
karbonun da artması anlamına gelir. İşletme enerjisi düştükçe, bir yapı
bileşeninin toplam yaşam döngüsü etkisi içinde gömülü karbonun payı görece
büyümekte; bu da malzeme seçimini enerji verimliliği tartışmasının merkezine
taşımaktadır [KAYNAK: gömülü karbon payı çalışmaları].

Biyo-esaslı yapı malzemeleri — kenevir lifi, ahşap lifi, selüloz, saman,
genleştirilmiş mantar, kenevir-kireç ve tarımsal atık esaslı paneller — bu
noktada iki nedenle öne çıkmaktadır. Birincisi, üretimlerinin gömülü karbonu
mineral ve petrokimya esaslı muadillerine kıyasla düşüktür. İkincisi ve daha
önemlisi, lignoselülozik yapıları nedeniyle büyüme sürecinde atmosferden
aldıkları karbonu bileşen ömrü boyunca depolarlar; yaşam sonlarında ise
kompostlanabilir ya da biyolojik döngüye geri dönebilir niteliktedirler
[KAYNAK: biyojenik karbon ve yaşam sonu literatürü].

Ne var ki bu iki özellik, yapı malzemesi seçiminde yerleşik karar modellerinin
ölçüt setine büyük ölçüde girmemektedir. Çok ölçütlü karar verme (ÇÖKV)
yöntemleriyle yapılan malzeme seçimi çalışmaları tipik olarak ısıl performansı,
maliyeti, mekanik dayanımı ve — en iyi durumda — gömülü karbonu ölçüt alır
[KAYNAK: MCDM malzeme seçimi çalışmaları]. Bu ölçütlerin tamamı insan-merkezli
ve bina ömrüyle sınırlı bir zaman ufkuna aittir: neyin iyi olduğu, insanın
konforu ve yatırımın geri dönüşü üzerinden, binanın ayakta kalacağı süre
boyunca tanımlanır. Biyojenik karbon depolama ve yaşam sonu senaryosu ise
kararı bu ufkun ötesine — malzemenin topraktan geldiği ve toprağa döneceği
zaman ölçeğine — taşır. Bu çalışmada antroposantrizm eleştirisi soyut bir
kuramsal çerçeve olarak değil, ölçüt setinin somut biçimde genişletilmesi
olarak işletilmekte; genişlemenin karara ne kadar fark ettirdiği sayısal olarak
ölçülmektedir.

İkinci bir örtük varsayım, iklim bağımlılığına ilişkindir. Biyo-esaslı
malzemeleri karşılaştıran ÇÖKV çalışmaları genellikle tek bir sıralama üretir
ve bu sıralamanın iklim koşullarına göre değişeceği zımnen kabul edilir
[KAYNAK: Avrupa ölçekli MCDA çalışmaları]. Oysa karşılaştırma "eşdeğer ısıl
performans" varsayımıyla, yani her malzemenin aynı ısıl geçirgenlik değerini
sağlayacak kalınlıkta kullanıldığı kabulüyle yapıldığında, bu varsayımın kendisi
sonucu belirler. Bu çalışmanın ilk bulgusu, söz konusu kurgunun iklim bölgesine
göre sıralama farkı üretmesinin matematiksel olarak mümkün olmadığıdır.

Bu çerçevede çalışmanın araştırma soruları şunlardır:

**AS1.** Sabit ısıl geçirgenlik hedefine dayalı çok ölçütlü bir malzeme seçim
modelinde, TS 825:2024'ün altı derece gün bölgesi arasında sıralama farkı
oluşur mu?

**AS2.** Uygulanabilirlik kısıtı, ısıtma/soğutma dengesi ve dinamik ısıl kütle
modele dâhil edildiğinde bölge etkisi hangi koşulda ve ne büyüklükte ortaya
çıkar?

**AS3.** Ağırlıklandırma yönteminin seçimi, biyo-esaslı alternatiflerin
sıralamadaki yerini ne ölçüde belirler; biyojenik karbon ve yaşam sonu
ölçütlerinin etkisini maskeler mi?

Çalışmanın amacı, belirli bir malzemeyi "en iyi" ilan etmek değil, biyo-esaslı
yapı kabuğu malzemelerinin karşılaştırılmasında kullanılan kurgunun kendisini
sınamak ve iklim bölgesi etkisinin hangi koşullarda anlamlı hâle geldiğini
göstermektir. Bu yönüyle çalışma, literatürde yaygın biçimde kullanılan ancak
gerekçelendirilmeden benimsenen iki varsayımı — eşdeğer performans kurgusunun
iklim duyarlılığı ve ağırlıklandırma yönteminin nötrlüğü — sınanabilir biçimde
ele almaktadır.

Makalenin kalanı şu şekilde düzenlenmiştir: İkinci bölümde biyo-esaslı yapı
malzemeleri ve malzeme seçiminde ÇÖKV literatürü ele alınmakta, araştırma
boşluğu sayısal olarak ortaya konmaktadır. Üçüncü bölümde fonksiyonel birim
tanımı, ölçüt seti, ağırlıklandırma ve sıralama yöntemleri ile hesap temelinin
doğrulanması sunulmaktadır. Dördüncü bölümde orantılılık bulgusu, mekanizmaların
sıralamaya etkisi, ağırlıklandırma yöntemi karşılaştırması ve duyarlılık analizi
verilmektedir. Beşinci bölüm bulguları mevzuat ve uygulama bağlamında
tartışmakta, altıncı bölüm sonuçları özetlemektedir.

---

## Yazım notları

- Uzunluk şu hâliyle yaklaşık 1,8 sayfa; hedefe uygun. Kuramsal arka plan
  bölümüne kayan içerik varsa oradan buraya çekilmemeli.
- 3. paragraf (biyo-esaslı malzemelerin iki özelliği) atıf yoğunluğu en yüksek
  yer olacak; en az 6–8 kaynak beklenir.
- 5. paragraftaki "matematiksel olarak mümkün değildir" iddiası güçlü bir
  cümledir; Yöntem bölümünde türetimi eksiksiz verilmeli, aksi hâlde hakem
  buraya takılır.
- Antroposantrizm paragrafı (4. paragraf) kuramsal referans olmadan durmamalı;
  ancak referans yoğunluğu 2–3 kaynağı geçmesin — dergi kuramsal genişlemeyi
  hoş karşılamaz.
- Genişletilmiş İngilizce özet için bu bölümün 1., 5. ve araştırma soruları
  paragrafları çekirdek oluşturur.
