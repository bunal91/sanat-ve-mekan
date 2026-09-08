# -*- coding: utf-8 -*-
"""Kapak sayfasını derginin resmî şablonu üzerine kurar.

Şablon: sablon/kapak-sablonu.docx (derginin yayımladığı dosya, değiştirilmez)
Çıktı : 02-kapak-sayfasi.docx

Şablonun alan sırası, etiket metinleri, yazı tipi, punto, hizalama ve satır
aralığı ayarları olduğu gibi korunur; yalnızca içerik paragrafları yeniden
kurulur. Tek yazar varsayılmıştır: şablondaki beş yazarlı örneğin ikinci kurum
satırları kaldırılmıştır.
"""
import os, re, shutil, zipfile

BURASI = os.path.dirname(os.path.abspath(__file__))
SABLON = os.path.join(BURASI, 'sablon', 'kapak-sablonu.docx')
CIKTI = os.path.join(BURASI, '02-kapak-sayfasi.docx')

BASLIK_TR = ('Eşdeğer ısıl performans varsayımı altında biyo-bazlı yapı kabuğu '
             'malzemelerinin seçimi: kurgunun sonuç üzerindeki belirleyiciliği')
BASLIK_EN = ('Selection of bio-based building envelope materials under the equivalent '
             'thermal performance assumption: how the framing determines the result')
YAZAR = '[Ad SOYAD]'
ADRES_TR = '[Üniversite], [Fakülte], [Bölüm], [Posta kodu], [Şehir], Türkiye'
ADRES_EN = '[Department], [Faculty], [University], [Post code], [City], Türkiye'
ORCID = '0000-0000-0000-0000'
EPOSTA = 'b.unal91@gmail.com'

RPR9 = ('<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" '
        'w:cs="Times New Roman"/><w:sz w:val="18"/><w:szCs w:val="18"/>'
        '<w:shd w:val="clear" w:color="auto" w:fill="FFFFFF"/></w:rPr>')
RPR9U = RPR9.replace('</w:rPr>', '<w:vertAlign w:val="superscript"/></w:rPr>')
RPRB = '<w:rPr><w:b/><w:bCs/></w:rPr>'


def kacis(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def run(metin, rpr):
    return f'<w:r>{rpr}<w:t xml:space="preserve">{kacis(metin)}</w:t></w:r>'


def kur():
    with zipfile.ZipFile(SABLON) as z:
        parcalar = {ad: z.read(ad) for ad in z.namelist()}
    x = parcalar['word/document.xml'].decode('utf-8')

    bas = x.index('<w:body>') + len('<w:body>')
    son = x.index('<w:sectPr', bas)
    paras = re.findall(r'<w:p [^>]*>.*?</w:p>|<w:p/>', x[bas:son], re.S)
    if len(paras) != 23:
        raise SystemExit(f'şablon beklenmedik yapıda: {len(paras)} paragraf')

    def ppr(i):
        m = re.search(r'<w:pPr>.*?</w:pPr>', paras[i], re.S)
        return m.group(0) if m else ''

    def p(i, runlar):
        return '<w:p>' + ppr(i) + ''.join(runlar) + '</w:p>'

    yeni = list(paras)
    yeni[1] = p(1, [run(' ', ''), run(BASLIK_TR, RPRB)])
    yeni[4] = p(4, [run(YAZAR, RPR9), run('1,*', RPR9U)])
    yeni[5] = p(5, [run('1', RPR9U), run(ADRES_TR, RPR9)])
    yeni[6] = None                      # tek kurum: ikinci adres satırı yok
    yeni[7] = p(7, [run(ORCID, RPR9)])
    yeni[8] = p(8, [run(EPOSTA, RPR9)])
    yeni[13] = p(13, [run(' ', ''), run(BASLIK_EN, RPRB)])
    yeni[17] = p(17, [run(YAZAR, RPR9), run('1,*', RPR9U)])
    yeni[18] = p(18, [run('1', RPR9U), run(ADRES_EN, RPR9)])
    yeni[19] = None
    yeni[20] = p(20, [run(ORCID, RPR9)])
    yeni[21] = p(21, [run(EPOSTA, RPR9)])

    parcalar['word/document.xml'] = (
        x[:bas] + ''.join(q for q in yeni if q is not None) + x[son:]
    ).encode('utf-8')

    if os.path.exists(CIKTI):
        os.remove(CIKTI)
    with zipfile.ZipFile(CIKTI, 'w', zipfile.ZIP_DEFLATED) as z:
        sira = ['[Content_Types].xml']
        sira += [a for a in parcalar if a not in sira]
        for ad in sira:
            z.writestr(ad, parcalar[ad])
    print(f'yazıldı: {os.path.basename(CIKTI)} '
          f'({os.path.getsize(CIKTI) // 1024} KB, '
          f'{len([q for q in yeni if q is not None])} paragraf)')


if __name__ == '__main__':
    kur()
