# -*- coding: utf-8 -*-
"""
Crossref üzerinden konu bazlı kaynak taraması. Mevcut künyelere ek olarak,
makalenin zayıf kalan sekiz başlığında hakemli kaynak toplar.

Süzgeçler: DOI'si ve yazarı olan dergi makaleleri; 2015 ve sonrası (yöntem
klasikleri hariç); yinelenenler DOI üzerinden elenir.
Çıktı: kaynaklar_taranan.md
"""

import json, ssl, time, urllib.parse, urllib.request

CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
UA = {'User-Agent': 'akademik-kaynak-tarama/1.0 (mailto:b.unal91@gmail.com)',
      'Accept': 'application/json'}

BASLIKLAR = {
    'A. Biyojenik karbon ve geçici depolama': [
        'biogenic carbon accounting temporary storage buildings timber',
        'dynamic life cycle assessment biogenic carbon building materials',
        'carbon storage bio-based building products end of life',
    ],
    'B. Tarımsal atık esaslı yalıtım': [
        'rice husk thermal insulation board building',
        'sunflower stalk pith insulation panel binderless',
        'agricultural waste bio-based insulation panel thermal conductivity',
        'hazelnut shell particleboard insulation',
        'straw bale wall thermal performance building',
    ],
    'C. Türkçe literatür — TS 825 ve yalıtım': [
        'TS 825 binalarda ısı yalıtımı enerji',
        'optimum yalıtım kalınlığı bina enerji Türkiye derece gün',
        'bina kabuğu enerji performansı yalıtım malzemesi Türkiye',
    ],
    'D. Ağırlıklandırma yöntemleri': [
        'entropy CRITIC weighting comparison multi criteria decision making',
        'objective weighting methods sensitivity ranking MCDM comparison',
        'MEREC LOPCOW objective weight determination method',
    ],
    'E. Miselyum kompozitler': [
        'mycelium based composite building material mechanical thermal',
        'fungal biocomposite insulation substrate species',
    ],
    'F. Yalıtım malzemesi seçiminde ÇÖKV': [
        'insulation material selection multi criteria decision building envelope',
        'TOPSIS building material selection sustainability criteria',
    ],
    'G. Gömülü karbon ve EPD': [
        'embodied carbon building materials environmental product declaration',
        'EN 15804 environmental product declaration construction comparability',
    ],
    'H. Isıl kütle ve kullanım faktörü': [
        'thermal mass building energy monthly quasi steady state utilization factor',
        'EN ISO 13790 monthly method validation dynamic simulation comparison',
    ],
}

TURKCE_BASLIK = 'C. Türkçe literatür — TS 825 ve yalıtım'


def ara(q, rows=8):
    u = 'https://api.crossref.org/works?' + urllib.parse.urlencode(
        {'query.bibliographic': q, 'rows': rows,
         'filter': 'type:journal-article,has-abstract:true'})
    with urllib.request.urlopen(urllib.request.Request(u, headers=UA),
                                timeout=60, context=CTX) as y:
        return json.load(y)['message']['items']


def bicimle(it):
    yz = []
    for a in it.get('author', [])[:10]:
        soyad = a.get('family', '')
        ad = ''.join(p[0] + '.' for p in (a.get('given') or '').split() if p)
        if soyad:
            yz.append(f'{soyad} {ad}'.strip())
    if len(it.get('author', [])) > 10:
        yz.append('vd.')
    yil = (it.get('issued', {}).get('date-parts') or [[None]])[0][0]
    return {
        'yazarlar': ', '.join(yz), 'baslik': (it.get('title') or [''])[0],
        'dergi': (it.get('container-title') or [''])[0],
        'cilt': it.get('volume', ''), 'sayi': it.get('issue', ''),
        'sayfa': it.get('page', '') or it.get('article-number', ''),
        'yil': yil, 'doi': it.get('DOI', ''), 'atif': it.get('is-referenced-by-count', 0),
    }


def uygun(k, turkce=False):
    if not (k['yazarlar'] and k['baslik'] and k['dergi'] and k['doi'] and k['yil']):
        return False
    if k['yil'] < (2010 if turkce else 2015):
        return False
    return True


def satir(k):
    p = f"({k['sayi']})" if k['sayi'] else ''
    s = f", {k['sayfa']}" if k['sayfa'] else ''
    return (f"{k['yazarlar']}, {k['baslik']}, *{k['dergi']}*, "
            f"{k['cilt']}{p}{s}, {k['yil']}. doi:{k['doi']}")


def calistir():
    gorulen, cikti = set(), {}
    # Halihazırda kaynakçada olanları atla
    mevcut = {'10.3390/su13020737', '10.3390/su18115508', '10.3390/info14050285',
              '10.1007/s10669-025-10001-w', '10.1007/s43939-024-00162-x',
              '10.3390/su16031190', '10.3390/en17143406',
              '10.1177/01436244241306631', '10.3390/buildings16091643',
              '10.1080/19397038.2026.2665914', '10.3390/ma19061229',
              '10.3390/su18179008', '10.1016/j.rser.2025.115872',
              '10.1016/j.buildenv.2025.113075', '10.3390/ma17092021',
              '10.3390/polym14102109'}
    gorulen |= mevcut

    for baslik, sorgular in BASLIKLAR.items():
        cikti[baslik] = []
        for q in sorgular:
            try:
                for it in ara(q):
                    k = bicimle(it)
                    if k['doi'].lower() in gorulen:
                        continue
                    if not uygun(k, baslik == TURKCE_BASLIK):
                        continue
                    gorulen.add(k['doi'].lower())
                    cikti[baslik].append(k)
            except Exception as e:
                print(f'  ! {q[:40]}: {e}')
            time.sleep(0.4)
        cikti[baslik].sort(key=lambda k: (-k['atif'], -(k['yil'] or 0)))
        print(f"{baslik:<44} {len(cikti[baslik])} kaynak")

    toplam = sum(len(v) for v in cikti.values())
    with open('kaynaklar_taranan.md', 'w', encoding='utf-8') as f:
        f.write('# Crossref konu taraması — aday kaynaklar\n\n')
        f.write(f'Toplam {toplam} aday. Her biri metne alınmadan önce '
                'konuyla ilgisi açısından gözden geçirilmelidir.\n\n')
        for baslik, liste in cikti.items():
            f.write(f'## {baslik}  ({len(liste)})\n\n')
            for k in liste:
                f.write(f"- {satir(k)}  ·atıf: {k['atif']}\n")
            f.write('\n')
    print(f'\nToplam {toplam} aday kaynak: kaynaklar_taranan.md')


if __name__ == '__main__':
    calistir()
