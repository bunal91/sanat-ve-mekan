# JSCMT sürümü

Makalenin Journal of Sustainable Construction Materials and Technologies (JSCMT) yazar yönergesine
göre hazırlanmış sürümü. Üst klasördeki `makale.md` dergiden bağımsız genişletilmiş sürümdür;
bu klasördeki metin onun yönergeye göre yeniden kurulmuş halidir.

| Dosya | Ne |
|---|---|
| `Unal_JSCMT_Manuscript.docx` | Gönderilecek dosya |
| `Unal_JSCMT_Manuscript_preview.pdf` | LibreOffice önizlemesi (denklem alt simgeleri Word'de dik, burada eğik) |
| `JSCMT_uyum_listesi.md` / `.pdf` | Yönergedeki her kuralın nasıl karşılandığı, doldurulacak yerler, uyarılar |
| `makale-jscmt.md` | Metin (kaynak): özet, anahtar sözcükler, gövde, bildirimler |
| `tablolar.py` | Beş tablo ve altı şekil altyazısı |
| `refs.py` | 43 kaynak (Vancouver biçimi, atıf sırası derlemede otomatik) |
| `sekil-uret.py` → `sekiller/` | Şekiller: `Fig_N.png` (Word'e gömülen), `Fig_N.tif` (300 dpi, gönderilecek), `Fig_2/6.eps` (vektör) |
| `build.py` | Markdown + tablolar + kaynaklar → Word (şablon dosyası taban alınır) |
| `check.py` | Üretilen Word dosyasını yönergeye göre denetler (54 kontrol) |
| `manuscript_template.docx` | Derginin Manuscript Template dosyası (taban belge) |

Yeniden üretmek için (üst klasördeki `hesap.json` gerekir; yoksa `python3 ../hesap.py`):

```
python3 sekil-uret.py     # sekiller/ ve sekiller/panels/ (tez fotoğrafları ../../03-gorseller/)
python3 build.py          # Unal_JSCMT_Manuscript.docx
python3 check.py          # kural denetimi
```

Pillow, numpy, matplotlib, python-docx, lxml ve pandoc gerekir. `sekiller/panels/` (etiketsiz paneller)
depoya konmaz; `sekil-uret.py` yeniden üretir.

Sarı işaretli yerler yazarın dolduracağı yerlerdir; tam liste `JSCMT_uyum_listesi.md` §12'de.
