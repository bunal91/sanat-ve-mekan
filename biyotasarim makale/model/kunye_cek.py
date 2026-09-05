# -*- coding: utf-8 -*-
"""Crossref üzerinden tam künye çeker ve GAZİ MMFD biçimine yakın çıktı verir."""
import json, ssl, time, urllib.parse, urllib.request

CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
UA = {'User-Agent': 'akademik-kunye-derleme/1.0 (mailto:b.unal91@gmail.com)',
      'Accept': 'application/json'}

DOI = [
    ('K16', '10.3390/su13020737'),
    ('K17', '10.3390/su18115508'),
    ('K18', '10.3390/info14050285'),
    ('K19', '10.1007/s10669-025-10001-w'),
    ('K20', '10.1007/s43939-024-00162-x'),
    ('K21', '10.3390/su16031190'),
    ('K22', '10.3390/en17143406'),
    ('K01', '10.1177/01436244241306631'),
    ('K23', '10.3390/buildings16091643'),
    ('K24', '10.1080/19397038.2026.2665914'),
    ('K25', '10.3390/ma19061229'),
    ('K26', '10.3390/su18179008'),
]
BASLIK = [
    ('K27', 'Bio-based insulation materials in sustainable constructions review '
            'environmental thermal acoustic durability mechanical'),
    ('K28', 'Multi-criteria decision-making for energy building renovation '
            'comparing exterior wall structures AHP ANP utility analysis TOPSIS'),
    ('K29', 'Hygrothermal properties and performance of bio-based insulation '
            'materials locally sourced in Sweden'),
    ('K30', 'Analysis of sheep wool-based composites for building insulation'),
]


def getir(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA),
                                timeout=60, context=CTX) as y:
        return json.load(y)


def bicimle(it):
    yazarlar = []
    for a in it.get('author', [])[:12]:
        soyad = a.get('family', '')
        ad = ''.join(p[0] + '.' for p in a.get('given', '').split() if p)
        yazarlar.append(f'{soyad} {ad}'.strip())
    if len(it.get('author', [])) > 12:
        yazarlar.append('vd.')
    baslik = (it.get('title') or [''])[0]
    dergi = (it.get('container-title') or [''])[0]
    yil = (it.get('issued', {}).get('date-parts') or [[None]])[0][0]
    return {
        'yazarlar': ', '.join(yazarlar), 'baslik': baslik, 'dergi': dergi,
        'cilt': it.get('volume', ''), 'sayi': it.get('issue', ''),
        'sayfa': it.get('page', '') or it.get('article-number', ''),
        'yil': yil, 'doi': it.get('DOI', ''),
    }


def satir(k):
    p = f", {k['sayi']}" if k['sayi'] else ''
    s = f", {k['sayfa']}" if k['sayfa'] else ''
    return (f"{k['yazarlar']}, {k['baslik']}, *{k['dergi']}*, "
            f"{k['cilt']}{p}{s}, {k['yil']}. doi:{k['doi']}")


sonuc = []
for anahtar, doi in DOI:
    try:
        d = getir(f'https://api.crossref.org/works/{urllib.parse.quote(doi)}')
        k = bicimle(d['message'])
        sonuc.append((anahtar, k)); print(f'  {anahtar}  OK   {k["baslik"][:58]}')
    except Exception as e:
        print(f'  {anahtar}  HATA {doi}: {e}')
    time.sleep(0.4)

for anahtar, q in BASLIK:
    try:
        d = getir('https://api.crossref.org/works?' +
                  urllib.parse.urlencode({'query.bibliographic': q, 'rows': 1}))
        it = d['message']['items'][0]
        k = bicimle(it)
        sonuc.append((anahtar, k)); print(f'  {anahtar}  ARA  {k["baslik"][:58]}')
    except Exception as e:
        print(f'  {anahtar}  HATA arama: {e}')
    time.sleep(0.4)

with open('kunyeler_ham.md', 'w', encoding='utf-8') as f:
    f.write('# Crossref\'ten çekilen künyeler\n\n')
    for anahtar, k in sonuc:
        f.write(f'**{anahtar}** — {satir(k)}\n\n')
print(f'\n{len(sonuc)} künye yazıldı: kunyeler_ham.md')
