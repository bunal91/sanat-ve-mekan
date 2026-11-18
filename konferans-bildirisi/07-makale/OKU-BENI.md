# Makale klasörü

`makale.md` — genişletilmiş dergi makalesi (İngilizce, dergiden bağımsız).
Word ve PDF sürümleri `makale-docx.py` ile üretilir.

| Dosya | Ne |
|---|---|
| `makale.md` | Metin (kaynak) |
| `Unal_Eggshell_Agar_Manuscript.docx` / `.pdf` | Üretilmiş sürüm (docx gönderilecek dosya; pdf önizleme) |
| `hesap.py` → `hesap.json` | Metindeki tüm türetilmiş sayıların tek kaynağı |
| `sekil-uret.py` → `sekiller/` | Şekiller (tez fotoğrafları + hesaptan çizimler) |
| `makale-docx.py` | Markdown → Word dönüştürücü (pandoc + python-docx) |

Yeniden üretmek için: `python3 hesap.py && python3 sekil-uret.py && python3 makale-docx.py`
(Pillow, numpy, matplotlib, python-docx, lxml ve pandoc gerekir.)

Sarı işaretli yerler yazarın dolduracağı yerlerdir: ORCID/e-posta, finansman,
konferans sunumu beyanı, yapay zekâ kullanım beyanı (derginin politikasına göre),
YÖK tez numarası.
