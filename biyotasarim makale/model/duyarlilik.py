# -*- coding: utf-8 -*-
"""
Duyarlılık çözümlemeleri ve ek tablo üretimi.

1) Yangına tepki sınıfının sayısallaştırılmasına duyarlılık. EN 13501-1
   sınıfları sıralıdır; sınıflar arası mesafe tanımlı değildir. Bu nedenle üç
   farklı kodlama karşılaştırılır ve entropi ağırlığının ve sıralamanın
   kodlamaya duyarlılığı ölçülür.
2) Tam karar matrisi (ek tablo): 18 alternatif × ana çalıştırma ölçütleri,
   ham değerler ve hücre kaynaklarıyla birlikte.

Çıktı: cikti_yangin_kodlama.csv, cikti_karar_matrisi.csv, cikti_veri_kaynaklari.csv
"""

import csv, os
import model as M

BURADA = os.path.dirname(os.path.abspath(__file__))

# EN 13501-1 sınıfı -> sayısal puan. Üç kodlama:
#   dogrusal : yedi sınıf eşit aralıklı (temel çalıştırma)
#   grup     : yanmaz (A1,A2) / sınırlı katkı (B,C) / diğer (D,E,F)
#   ikili    : yanmaz mı, değil mi
KODLAMALAR = {
    'dogrusal': {'A1': 7, 'A2': 6, 'B': 5, 'C': 4, 'D': 3, 'E': 2, 'F': 1},
    'grup':     {'A1': 3, 'A2': 3, 'B': 2, 'C': 2, 'D': 1, 'E': 1, 'F': 1},
    'ikili':    {'A1': 1, 'A2': 1, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0},
}


def _malzemeler_kodlanmis(kodlama):
    mals = M.oku('girdi_malzemeler.csv')
    tablo = KODLAMALAR[kodlama]
    for m in mals:
        m['yangin_puan'] = str(tablo[m['yangin_sinif']])
    return mals


def yangin_duyarliligi(bolge_no='1'):
    bolge = [b for b in M.oku('girdi_bolgeler.csv') if b['bolge'] == bolge_no][0]
    olc, _ = M.tam_olcutler()
    j7 = [i for i, o in enumerate(olc) if o[0] == 'yangin_puan'][0]

    satirlar, taban = [], {}
    print('=' * 78)
    print(f'YANGINA TEPKİ KODLAMASINA DUYARLILIK — {bolge_no}. Bölge, tam model')
    print('=' * 78)
    print(f"{'kodlama':<10}{'yöntem':<9}{'w(Ö7)':>8}{'1. sıra':<32}"
          f"{'doğrusal ile Spearman':>22}")
    for kodlama in KODLAMALAR:
        mals = _malzemeler_kodlanmis(kodlama)
        for yontem in M.AGIRLIK_YONTEMLERI:
            adlar, t, _, w = M.calistir(bolge, yontem, olcutler=olc, mals=mals)
            sira = M.siralar(t)
            if kodlama == 'dogrusal':
                taban[yontem] = (adlar, sira)
            ad0, s0 = taban[yontem]
            ortak = [a for a in adlar if a in ad0]
            r = M.spearman([sira[adlar.index(a)] for a in ortak],
                           [s0[ad0.index(a)] for a in ortak])
            birinci = adlar[max(range(len(t)), key=lambda i: t[i])]
            print(f'{kodlama:<10}{yontem:<9}{w[j7]:>7.1%} {birinci:<32}{r:>21.3f}')
            satirlar.append([kodlama, yontem, f'{w[j7]:.4f}', birinci, f'{r:.4f}'])

    yol = os.path.join(BURADA, 'cikti_yangin_kodlama.csv')
    with open(yol, 'w', newline='', encoding='utf-8') as f:
        w_ = csv.writer(f)
        w_.writerow(['kodlama', 'agirlik_yontemi', 'w_yangin', 'birinci', 'spearman_dogrusal'])
        w_.writerows(satirlar)
    print(f'\n{os.path.basename(yol)} yazıldı.\n')


def karar_matrisi_disa_aktar(bolge_no='1'):
    """Ek tablo: tam karar matrisi ve hücre kaynakları."""
    bolge = [b for b in M.oku('girdi_bolgeler.csv') if b['bolge'] == bolge_no][0]
    olc, _ = M.tam_olcutler()
    mals = M.oku('girdi_malzemeler.csv')

    yol = os.path.join(BURADA, 'cikti_karar_matrisi.csv')
    with open(yol, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['kod', 'ad', 'grup'] + [o[1] for o in olc])
        for m in mals:
            kaynak = dict(m); kaynak.update(M.fonksiyonel_birim(m, bolge))
            satir = []
            for a, _, _ in olc:
                v = kaynak.get(a)
                v = v if isinstance(v, float) else M.sayi(v)
                satir.append(f'{v:.4f}' if v is not None else '')
            w.writerow([m['kod'], m['ad'], m['grup']] + satir)
    print(f'{os.path.basename(yol)} yazıldı ({len(mals)} alternatif × {len(olc)} ölçüt).')

    yol2 = os.path.join(BURADA, 'cikti_veri_kaynaklari.csv')
    alanlar = [('lambda', 'kaynak_lambda', 'kalite_lambda'),
               ('yogunluk', 'kaynak_yogunluk', 'kalite_yogunluk'),
               ('ozgul_isi', 'kaynak_ozgul_isi', 'kalite_ozgul_isi'),
               ('gomulu_karbon_kg', 'kaynak_gomulu', 'kalite_gomulu'),
               ('biyojenik_karbon_kg', 'kaynak_biyojenik', 'kalite_biyojenik')]
    with open(yol2, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['kod', 'ad', 'buyukluk', 'deger', 'kaynak', 'kalite_1_5'])
        for m in mals:
            for deger, kayn, kal in alanlar:
                w.writerow([m['kod'], m['ad'], deger, m.get(deger, ''),
                            m.get(kayn, ''), m.get(kal, '')])
            w.writerow([m['kod'], m['ad'], 'yangin_sinif', m['yangin_sinif'],
                        'EN 13501-1 sınıflandırma belgesi / üretici beyanı', ''])
    print(f'{os.path.basename(yol2)} yazıldı.')

    # ÖKOBAUDAT veri kümesi künyeleri: UUID, sürüm yılı, referans birim
    ozet = M.oku('oekobaudat_ozet.csv')
    yol3 = os.path.join(BURADA, 'cikti_oekobaudat_kunye.csv')
    with open(yol3, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['kod', 'ad', 'oekobaudat_veri_kumesi', 'uuid', 'surum_yili',
                    'referans_birim', 'GWP_A1A3_kgCO2e_kg', 'C3', 'C4', 'D'])
        for m in mals:
            etiket = m.get('kaynak_biyojenik', '')
            if not etiket.startswith('K15:'):
                continue
            ad = etiket.split(':', 1)[1].strip()
            yil = ad.rsplit(' ', 1)[-1]
            cekirdek = ad.rsplit(' ', 1)[0].lower()
            adaylar = [o for o in ozet
                       if o['kod'] == m['kod'] and o['refYear'] == yil
                       and not o['durum'].startswith('KULLANILAMAZ')]
            eş = next((o for o in adaylar
                       if cekirdek.split()[0] in o['ad'].lower()), None) \
                or (adaylar[0] if adaylar else None)
            w.writerow([m['kod'], m['ad'], ad,
                        eş['uuid'] if eş else '', eş['refYear'] if eş else '',
                        eş['ref_birim'] if eş else '',
                        m['gwp_A1A3_kg'], m['gwp_C3_kg'], m['gwp_C4_kg'], m['gwp_D_kg']])
    print(f'{os.path.basename(yol3)} yazıldı.')


def _ana():
    yangin_duyarliligi()
    karar_matrisi_disa_aktar()
    print()
    sinir_raporu()


def sinir_raporu():
    """Sistem sınırı (S1/S2/S3) ve yaşam sonu salım oranı eşiği."""
    bolg = M.oku('girdi_bolgeler.csv')
    iklim = [b for b in bolg if b['bolge'] in M.IKLIM_BOLGELERI]
    kod = M.tam_veri_kodlari(M.OLCUTLER_SINIR)

    print('=' * 78)
    print('SİSTEM SINIRININ ETKİSİ — CRITIC, tam veri alt kümesi '
          f'({len(kod)} alternatif)')
    print('=' * 78)
    siralamalar = {}
    for sn in ('S1', 'S2', 'S3'):
        M.SINIR = sn
        a, t, _, _ = M.calistir(iklim[0], 'CRITIC', True, True,
                                M.OLCUTLER_SINIR, kod)
        siralamalar[sn] = (a, M.siralar(t))
        print(f'  {sn}  1. sıra: {a[max(range(len(t)), key=lambda i: t[i])]}')
    M.SINIR = 'S2'
    for x, y in (('S1', 'S2'), ('S1', 'S3'), ('S2', 'S3')):
        ax, sx = siralamalar[x]; ay, sy = siralamalar[y]
        ortak = [k for k in ax if k in ay]
        r = M.spearman([sx[ax.index(k)] for k in ortak],
                       [sy[ay.index(k)] for k in ortak])
        print(f'  Spearman({x},{y}) = {r:.3f}')

    print('\n  Bölgelere göre birinci sıra (S1 ve S2):')
    for b in iklim:
        satir = []
        for sn in ('S1', 'S2'):
            M.SINIR = sn
            a, t, _, _ = M.calistir(b, 'CRITIC', True, True, M.OLCUTLER_SINIR, kod)
            satir.append(a[max(range(len(t)), key=lambda i: t[i])])
        print(f"    {b['bolge']}. {b['ad']:<14}S1: {satir[0]:<28}S2: {satir[1]}")
    M.SINIR = 'S2'

    print('\n  Sürüm anomalisi taşıyan iki kayıt (kenevir, keten lifi) çıkarıldığında:')
    anom = [k for k in kod
            if next(x for x in M.oku('girdi_malzemeler.csv')
                    if x['kod'] == k)['ad'] not in
            ('Kenevir lifi levha', 'Keten lifi levha')]
    for b in iklim:
        s12 = {}
        for sn in ('S1', 'S2'):
            M.SINIR = sn
            a, t, _, _ = M.calistir(b, 'CRITIC', True, True, M.OLCUTLER_SINIR, anom)
            s12[sn] = (a, M.siralar(t))
        a1_, r1_ = s12['S1']; a2_, r2_ = s12['S2']
        ortak = [k for k in a1_ if k in a2_]
        r = M.spearman([r1_[a1_.index(k)] for k in ortak],
                       [r2_[a2_.index(k)] for k in ortak])
        print(f"    {b['bolge']}. bölge  Spearman(S1,S2) = {r:.3f} "
              f"({len(anom)} alternatif)")
    M.SINIR = 'S2'

    print('\n  Yaşam sonu salım oranı eşiği (biyo-bazlı üstünlüğün kaybolduğu φ):')
    for yontem in ('CRITIC', 'Entropi'):
        esikler = []
        for b in iklim:
            lo, hi = 0.0, 1.0
            for _ in range(20):
                m = (lo + hi) / 2
                M.C3_ORANI = m
                adlar, t, _, _ = M.calistir(b, yontem, True, True,
                                            M.OLCUTLER_SINIR, kod)
                birinci = adlar[max(range(len(t)), key=lambda i: t[i])]
                if M.sayi(next(x for x in M.oku('girdi_malzemeler.csv')
                               if x['ad'] == birinci)['biyo_esasli']):
                    lo = m
                else:
                    hi = m
            esikler.append((b['bolge'], (lo + hi) / 2))
        M.C3_ORANI = 1.0
        ozet = ', '.join(f'{bn}. bölge {e:.2f}' for bn, e in esikler)
        print(f'    {yontem:<8}{ozet}')
    M.C3_ORANI = 1.0


if __name__ == '__main__':
    _ana()
