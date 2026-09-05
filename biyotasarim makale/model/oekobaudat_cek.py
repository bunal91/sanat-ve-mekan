# -*- coding: utf-8 -*-
"""
Ökobaudat açık veri servisinden yalıtım malzemeleri için gömülü karbon
(GWP-fossil A1–A3), biyojenik karbon (GWP-biogenic A1–A3) ve yaşam sonu
(C3, C4, D) değerlerini toplar.

Kaynak: https://www.oekobaudat.de/OEKOBAU.DAT/resource  (soda4LCA REST)
Çıktı : oekobaudat/ham/*.json  ve  oekobaudat_ozet.csv
"""

import json, os, ssl, time, urllib.parse, urllib.request

KOK = 'https://www.oekobaudat.de/OEKOBAU.DAT/resource'
BURADA = os.path.dirname(os.path.abspath(__file__))
HAM = os.path.join(BURADA, 'oekobaudat', 'ham')
os.makedirs(HAM, exist_ok=True)

# malzeme kodu -> Ökobaudat arama terimleri (Almanca)
ARAMA = {
    'M01': ['Holzfaserdämmung', 'Holzfaserdämmplatte', 'Holzfaser'],
    'M02': ['Hanffaser', 'Hanfdämmung', 'Hanf'],
    'M03': ['Flachsdämmung', 'Flachs'],
    'M04': ['Schafwolle'],
    'M05': ['Textilfaser Dämmung', 'Baumwolldämmung', 'Jute'],
    'M06': ['Zellulose Einblasdämmung', 'Zellulosefaser'],
    'M07': ['Hanfkalk', 'Kalk-Hanf'],
    'M08': ['Stroh', 'Strohballen'],
    'M09': ['Korkdämmplatte', 'Expandierter Kork', 'Kork'],
    'M12': ['Bagasse'],
    'R01': ['EPS Dämmstoff', 'Expandiertes Polystyrol'],
    'R02': ['XPS Dämmstoff', 'Extrudiertes Polystyrol'],
    'R03': ['Steinwolle'],
    'R04': ['Glaswolle'],
}

CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')


def getir(yol, **params):
    url = f'{KOK}/{yol}?' + urllib.parse.urlencode({**params, 'format': 'json'})
    istek = urllib.request.Request(url, headers={'Accept': 'application/json'})
    with urllib.request.urlopen(istek, timeout=60, context=CTX) as y:
        return json.load(y)


def ara(terim, sayfa=6):
    try:
        d = getir('processes', search='true', name=terim, pageSize=sayfa)
        return d.get('data', [])
    except Exception as e:
        print(f'    ! arama hatası ({terim}): {e}')
        return []


def surec(uuid):
    yol = os.path.join(HAM, f'{uuid}.json')
    if os.path.exists(yol):
        return json.load(open(yol, encoding='utf-8'))
    d = getir(f'processes/{uuid}')
    json.dump(d, open(yol, 'w', encoding='utf-8'), ensure_ascii=False)
    return d


def gosterge(d, anahtar):
    """Verilen LCIA göstergesi için modül -> değer sözlüğü."""
    for r in d.get('LCIAResults', {}).get('LCIAResult', []):
        ref = r.get('referenceToLCIAMethodDataSet', {})
        adlar = [x['value'] for x in ref.get('shortDescription', [])]
        if any(anahtar in a for a in adlar):
            out = {}
            for o in r.get('other', {}).get('anies', []):
                if 'module' in o and 'value' in o:
                    try:
                        out[o['module']] = float(o['value'])
                    except (TypeError, ValueError):
                        pass
            return out
    return {}


def akis_uuid(d):
    """Referans akışın uuid'si."""
    qr = d.get('processInformation', {}).get('quantitativeReference', {})
    hedef = (qr.get('referenceToReferenceFlow') or [None])[0]
    for e in d.get('exchanges', {}).get('exchange', []):
        if e.get('dataSetInternalID') == hedef:
            return e.get('referenceToFlowDataSet', {}).get('refObjectId'), \
                   e.get('meanAmount')
    return None, None


def kg_carpani(flow_uuid):
    """
    Beyan edilen birimi kg'a çevirmek için çarpan.
    Yalnızca güvenle çevrilebilen kayıtlar kabul edilir; aksi hâlde (None, sebep).
    """
    if not flow_uuid:
        return None, None, 'referans akış yok'
    try:
        d = getir(f'flows/{flow_uuid}')
    except Exception as e:
        return None, None, f'akış çekilemedi: {e}'
    ozellikler = {}
    qr = d.get('flowInformation', {}).get('quantitativeReference', {})
    ref_id = qr.get('referenceToReferenceFlowProperty')
    if ref_id is None:
        ref_id = qr.get('referenceToFlowPropertyDataSet')
    ref_ad = None
    for p in d.get('flowProperties', {}).get('flowProperty', []):
        sd = p.get('referenceToFlowPropertyDataSet', {}).get('shortDescription', [])
        adlar = [x['value'] for x in sd]
        ad = adlar[0] if adlar else '?'
        try:
            ozellikler[ad] = float(p.get('meanValue'))
        except (TypeError, ValueError):
            continue
        if str(p.get('dataSetInternalID')) == str(ref_id):
            ref_ad = ad
    if ref_ad is None:
        return None, None, 'referans akış özelliği okunamadı'
    # Kütle özelliği var mı?
    kutle_ad = next((a for a in ozellikler
                     if a.strip().lower() in ('masse', 'mass', 'gewicht')), None)
    if ref_ad.strip().lower() in ('masse', 'mass', 'gewicht'):
        return 1.0, ref_ad, None            # zaten kg başına
    if kutle_ad and ozellikler[kutle_ad] > 0:
        m = ozellikler[kutle_ad]
        if abs(m - 1.0) < 1e-9:
            # Hacim/alan başına beyan edilen bir kayıtta kütle tam 1,0 ise bu
            # gerçek bir çevrim değil, yer tutucudur.
            return None, ref_ad, ('şüpheli çevrim: kütle=1,0 ama referans '
                                  f'birim {ref_ad}')
        return 1.0 / m, ref_ad, None
    return None, ref_ad, f'kütleye çevrim yok (referans birim: {ref_ad})'


def a1a3(mod):
    if not mod:
        return None
    if 'A1-A3' in mod:
        return mod['A1-A3']
    if all(k in mod for k in ('A1', 'A2', 'A3')):
        return mod['A1'] + mod['A2'] + mod['A3']
    return None


def calistir():
    satirlar = []
    for kod, terimler in ARAMA.items():
        print(f'\n[{kod}]')
        bulundu = []
        for t in terimler:
            for k in ara(t):
                sinif = (k.get('classific') or '')
                yalitim = ('Dämmstoffe' in sinif or 'Insulation' in sinif
                           or 'Dämmung' in sinif)
                if (k.get('type') == 'EPD' and yalitim
                        and k['uuid'] not in [b['uuid'] for b in bulundu]):
                    bulundu.append(k)
            time.sleep(0.3)
        if not bulundu:
            print('    kayıt yok')
            continue
        bulundu.sort(key=lambda k: -(k.get('refYear') or 0))
        for k in bulundu[:4]:
            try:
                d = surec(k['uuid'])
            except Exception as e:
                print(f"    ! {k['name'][:40]}: {e}")
                continue
            fuuid, miktar = akis_uuid(d)
            carpan, ref_birim, sebep = kg_carpani(fuuid)
            fosil = a1a3(gosterge(d, 'GWP-fossil'))
            biyo = a1a3(gosterge(d, 'GWP-biogenic'))
            toplam = a1a3(gosterge(d, 'GWP-total'))
            c = gosterge(d, 'GWP-total')
            if carpan is None:
                print(f"    ATLANDI {k['name'][:40]:<40} -> {sebep}")
                satirlar.append({
                    'kod': kod, 'ad': k['name'], 'uuid': k['uuid'],
                    'refYear': k.get('refYear'), 'geo': k.get('geo'),
                    'ref_birim': ref_birim, 'kg_carpani': None,
                    'GWP_fossil_A1A3_kg': None, 'GWP_biogenic_A1A3_kg': None,
                    'GWP_total_A1A3_kg': None, 'C3_kg': None, 'C4_kg': None,
                    'D_kg': None, 'durum': f'KULLANILAMAZ: {sebep}'})
                time.sleep(0.3); continue
            olc = lambda v: None if v is None else v * carpan
            f_kg, b_kg = olc(fosil), olc(biyo)
            uyari = []
            if f_kg is not None and not (-1.0 <= f_kg <= 20.0):
                uyari.append(f'fosil {f_kg:.2f} bandın dışında')
            if b_kg is not None and not (-3.0 <= b_kg <= 1.0):
                uyari.append(f'biyojenik {b_kg:.2f} bandın dışında')
            if uyari:
                print(f"    ŞÜPHELİ {k['name'][:38]:<38} -> {'; '.join(uyari)}")
                satirlar.append({
                    'kod': kod, 'ad': k['name'], 'uuid': k['uuid'],
                    'refYear': k.get('refYear'), 'geo': k.get('geo'),
                    'ref_birim': ref_birim, 'kg_carpani': carpan,
                    'GWP_fossil_A1A3_kg': f_kg, 'GWP_biogenic_A1A3_kg': b_kg,
                    'GWP_total_A1A3_kg': olc(toplam), 'C3_kg': olc(c.get('C3')),
                    'C4_kg': olc(c.get('C4')), 'D_kg': olc(c.get('D')),
                    'durum': 'ŞÜPHELİ: ' + '; '.join(uyari)})
                time.sleep(0.3); continue
            print(f"    {k['name'][:40]:<40} {k.get('refYear')} "
                  f"birim={ref_birim} x{carpan:.4g}  "
                  f"fosil={olc(fosil) if fosil is None else round(olc(fosil),3)} "
                  f"biyo={olc(biyo) if biyo is None else round(olc(biyo),3)}")
            satirlar.append({
                'kod': kod, 'ad': k['name'], 'uuid': k['uuid'],
                'refYear': k.get('refYear'), 'geo': k.get('geo'),
                'ref_birim': ref_birim, 'kg_carpani': carpan,
                'GWP_fossil_A1A3_kg': olc(fosil),
                'GWP_biogenic_A1A3_kg': olc(biyo),
                'GWP_total_A1A3_kg': olc(toplam),
                'C3_kg': olc(c.get('C3')), 'C4_kg': olc(c.get('C4')),
                'D_kg': olc(c.get('D')), 'durum': 'kg başına normalize'})
            time.sleep(0.3)

    import csv
    yol = os.path.join(BURADA, 'oekobaudat_ozet.csv')
    with open(yol, 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(satirlar[0].keys()))
        w.writeheader(); w.writerows(satirlar)
    print(f'\n{len(satirlar)} kayıt yazıldı: oekobaudat_ozet.csv')


if __name__ == '__main__':
    calistir()
