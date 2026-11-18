# JSCMT sürümü

Makalenin Journal of Sustainable Construction Materials and Technologies (JSCMT) yazar yönergesine göre
hazırlanmış sürümü. Metnin kaynağı `makale-jscmt.md`; Word dosyası `build.py` ile bu kaynaktan ve
`tablolar.py`, `refs.py`, `sekiller/` dosyalarından üretilir.

| Dosya | Ne |
|---|---|
| `Unal_JSCMT_Manuscript.docx` | Gönderilecek dosya (16 sayfa, şekil ve tablolar metnin içinde) |
| `Unal_JSCMT_Manuscript_preview.pdf` | LibreOffice önizlemesi (denklem alt simgeleri Word'de dik, burada eğik) |
| `JSCMT_uyum_listesi.md` / `.pdf` | Yönergedeki her kuralın nasıl karşılandığı, doldurulacak yerler, uyarılar |
| `makale-jscmt.md` | Metin (kaynak): özet, anahtar sözcükler, gövde, bildirimler |
| `tablolar.py` | Sekiz tablo ve sekiz şekil altyazısı (metindeki numaralarla) |
| `refs.py` | 44 kaynak (Vancouver biçimi; atıf sırası derlemede otomatik) |
| `sekil-uret.py` → `sekiller/` | Şekiller: `Fig_N.png` (Word'e gömülen), `Fig_N.tif` (300 dpi, gönderilecek), `Fig_6/8.eps` (vektör) |
| `build.py` | Kaynak → Word (derginin şablon dosyası taban alınır) |
| `check.py` | Üretilen Word dosyasını yönergeye göre denetler (48 kontrol) |
| `manuscript_template.docx` | Derginin Manuscript Template dosyası (taban belge) |

Yeniden üretmek için (`../hesap.json` gerekir; yoksa `python3 ../hesap.py`):

```
python3 sekil-uret.py     # sekiller/ ve sekiller/panels/ (tez fotoğrafları ../../03-gorseller/)
python3 build.py          # Unal_JSCMT_Manuscript.docx
python3 check.py          # kural denetimi
```

Pillow, numpy, matplotlib, python-docx, lxml ve pandoc gerekir. `sekiller/panels/` (etiketsiz paneller)
depoya konmaz; `sekil-uret.py` yeniden üretir.

Sarı işaretli yerler yazarın dolduracağı yerlerdir; tam liste `JSCMT_uyum_listesi.md` §4'te.
