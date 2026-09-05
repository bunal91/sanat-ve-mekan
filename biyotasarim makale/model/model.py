# -*- coding: utf-8 -*-
"""
Biyo-esaslı yapı kabuğu malzemeleri için çok ölçütlü karar modeli.

Makalenin kurgusu (bkz. ../04-pilot-bulgu-notu.md):
  Sabit U hedefine dayalı eşdeğer performans yaklaşımı, tanımı gereği iklim
  bölgesine göre sıralama farkı üretemez. Bölge etkisi ancak modele
  (i) uygulanabilirlik kısıtı, (ii) ısıtma/soğutma dengesi ve (iii) dinamik
  ısıl kütle eklendiğinde ortaya çıkar. Bu betik (i) ve (ii)'yi uygular ve
  farkı ölçer; (iii) referans bina geometrisi ile eklenecektir.

Fonksiyonel birim: ilgili bölge için TS 825:2024'ün tavsiye ettiği U_duvar
değerini sağlayan 1 m2 dış duvar bileşeni.

Yalnızca Python standart kütüphanesi kullanır.  Çalıştırma: python3 model.py
"""

import csv, math, os

# --- Sabitler -----------------------------------------------------------------
R_DIGER = 0.30            # m2K/W — yalıtım dışı katmanlar + yüzeysel dirençler
KALINLIK_ADIMI = 0.01     # m (1 cm)
AZAMI_KALINLIK_CM = 20.0  # uygulanabilirlik sınırı
TI_ISITMA, TI_SOGUTMA = 20.0, 26.0   # TS 825:2024 konut tasarım sıcaklıkları
ALFA = 1.0                # iklim ağırlık ayarının duyarlılık katsayısı

GUN = {'Ocak': 31, 'Şubat': 28, 'Mart': 31, 'Nisan': 30, 'Mayıs': 31, 'Haziran': 30,
       'Temmuz': 31, 'Ağustos': 31, 'Eylül': 30, 'Ekim': 31, 'Kasım': 30, 'Aralık': 31}

BURADA = os.path.dirname(os.path.abspath(__file__))


def oku(dosya):
    with open(os.path.join(BURADA, dosya), encoding='utf-8') as f:
        return list(csv.DictReader(f))


def sayi(x):
    try:
        return float(str(x).replace(',', '.'))
    except (TypeError, ValueError):
        return None


# --- 1. Fonksiyonel birim -----------------------------------------------------
def kalinlik(lmbda, u_hedef, r_diger=R_DIGER):
    r = 1.0 / u_hedef - r_diger
    if r <= 0:
        return 0.0
    return round(lmbda * r / KALINLIK_ADIMI) * KALINLIK_ADIMI


def fonksiyonel_birim(malzeme, bolge):
    """Eksik veri sıfıra çevrilmez; None olarak taşınır."""
    lmbda, rho, c = (sayi(malzeme['lambda']), sayi(malzeme['yogunluk']),
                     sayi(malzeme['ozgul_isi']))
    d = kalinlik(lmbda, sayi(bolge['U_duvar_hedef']))
    kutle = d * rho if rho is not None else None
    gk = sayi(malzeme.get('gomulu_karbon_kg'))
    bk = sayi(malzeme.get('biyojenik_karbon_kg'))
    mmin, mmaks = (sayi(malzeme.get('maliyet_min_TLm3')),
                   sayi(malzeme.get('maliyet_max_TLm3')))
    return {
        'kalinlik_cm': d * 100,
        'kutle_kgm2': kutle,
        'kappa_kJm2K': d * rho * c / 1000.0 if None not in (rho, c) else None,
        'gomulu_karbon_m2': kutle * gk if None not in (kutle, gk) else None,
        'biyojenik_karbon_m2': kutle * bk if None not in (kutle, bk) else None,
        'maliyet_TLm2': d * ((mmin + mmaks) / 2) if None not in (mmin, mmaks) else None,
    }


def uygulanabilir(malzeme, bolge, sinir_cm=AZAMI_KALINLIK_CM):
    return kalinlik(sayi(malzeme['lambda']),
                    sayi(bolge['U_duvar_hedef'])) * 100 <= sinir_cm + 1e-9


# --- 2. İklim: derece gün ve soğutma payı -------------------------------------
def derece_gun(bolge_no):
    rows = oku('girdi_bolge_sicakliklari.csv')
    idg = sdg = 0.0
    for r in rows:
        t, d = float(r[f'bolge{bolge_no}']), GUN[r['ay']]
        idg += max(0.0, TI_ISITMA - t) * d
        sdg += max(0.0, t - TI_SOGUTMA) * d
    toplam = idg + sdg
    return {'IDG': idg, 'SDG': sdg,
            'sogutma_payi': sdg / toplam if toplam else 0.0,
            'isitma_payi': idg / toplam if toplam else 1.0}


# --- 3. Ağırlıklandırma -------------------------------------------------------
def _normalize_sutunlar(matris):
    """Sütunları [0,1]'e taşır (entropi ve CRITIC negatif değer kabul etmez)."""
    n, m = len(matris), len(matris[0])
    N = [[0.0] * m for _ in range(n)]
    for j in range(m):
        sut = [s[j] for s in matris]
        lo, hi = min(sut), max(sut)
        for i in range(n):
            N[i][j] = 0.5 if hi == lo else (matris[i][j] - lo) / (hi - lo) + 1e-6
    return N


def entropi_agirliklari(matris):
    N = _normalize_sutunlar(matris)
    n, m = len(N), len(N[0])
    k = 1.0 / math.log(n)
    d = []
    for j in range(m):
        toplam = sum(s[j] for s in N)
        p = [s[j] / toplam for s in N] if toplam else [0.0] * n
        e = -k * sum(pi * math.log(pi) for pi in p if pi > 0)
        d.append(1.0 - e)
    tp = sum(d)
    return [x / tp for x in d] if tp else [1.0 / m] * m


def critic_agirliklari(matris):
    """CRITIC: standart sapma (kontrast) x ölçütler arası çatışma (1 - korelasyon)."""
    N = _normalize_sutunlar(matris)
    n, m = len(N), len(N[0])
    ort = [sum(s[j] for s in N) / n for j in range(m)]
    std = [math.sqrt(sum((s[j] - ort[j]) ** 2 for s in N) / (n - 1)) for j in range(m)]

    def kor(a, b):
        pay = sum((N[i][a] - ort[a]) * (N[i][b] - ort[b]) for i in range(n))
        payda = (n - 1) * std[a] * std[b]
        return pay / payda if payda else 0.0

    c = [std[j] * sum(1 - kor(j, k) for k in range(m)) for j in range(m)]
    tp = sum(c)
    return [x / tp for x in c] if tp else [1.0 / m] * m


def esit_agirliklar(matris):
    m = len(matris[0])
    return [1.0 / m] * m


AGIRLIK_YONTEMLERI = {'Entropi': entropi_agirliklari,
                      'CRITIC': critic_agirliklari,
                      'Eşit': esit_agirliklar}


def iklim_ayari(agirliklar, olcutler, bolge_no, alfa=ALFA):
    """
    Bölgeye bağlı ağırlık ayarı — makalenin mekanizma (ii)'si.
    Isıl kütle (kappa) soğutma baskın bölgede, nem/küf duyarlılığı ısıtma
    baskın bölgede ağırlaşır.  w' = w * (1 + alfa * ilgili_pay)
    """
    dg = derece_gun(bolge_no)
    carpan = []
    for (anahtar, _, _), w in zip(olcutler, agirliklar):
        if anahtar == 'kappa_kJm2K':
            carpan.append(w * (1 + alfa * dg['sogutma_payi']))
        elif anahtar == 'nem_kuf_puan':
            carpan.append(w * (1 + alfa * dg['isitma_payi']))
        else:
            carpan.append(w)
    tp = sum(carpan)
    return [x / tp for x in carpan]


# --- 4. Sıralama yöntemleri ---------------------------------------------------
def topsis(matris, agirliklar, yonler):
    m = len(matris[0])
    nrm = [math.sqrt(sum(s[j] ** 2 for s in matris)) for j in range(m)]
    N = [[(s[j] / nrm[j] if nrm[j] else 0.0) * agirliklar[j] for j in range(m)]
         for s in matris]
    ideal, anti = [], []
    for j in range(m):
        sut = [s[j] for s in N]
        (ideal.append(max(sut)), anti.append(min(sut))) if yonler[j] == 'max' \
            else (ideal.append(min(sut)), anti.append(max(sut)))
    out = []
    for s in N:
        dp = math.sqrt(sum((s[j] - ideal[j]) ** 2 for j in range(m)))
        dn = math.sqrt(sum((s[j] - anti[j]) ** 2 for j in range(m)))
        out.append(dn / (dp + dn) if (dp + dn) else 0.0)
    return out


def vikor(matris, agirliklar, yonler, v=0.5):
    """VIKOR — düşük Q iyidir; karşılaştırma için (1 - Q) döndürülür."""
    m = len(matris[0])
    en_iyi, en_kotu = [], []
    for j in range(m):
        sut = [s[j] for s in matris]
        (en_iyi.append(max(sut)), en_kotu.append(min(sut))) if yonler[j] == 'max' \
            else (en_iyi.append(min(sut)), en_kotu.append(max(sut)))
    S, R = [], []
    for s in matris:
        pay = []
        for j in range(m):
            araluk = en_iyi[j] - en_kotu[j]
            pay.append(agirliklar[j] * (en_iyi[j] - s[j]) / araluk if araluk else 0.0)
        S.append(sum(pay)); R.append(max(pay))
    Smin, Smaks, Rmin, Rmaks = min(S), max(S), min(R), max(R)
    Q = []
    for i in range(len(matris)):
        a = (S[i] - Smin) / (Smaks - Smin) if Smaks != Smin else 0.0
        b = (R[i] - Rmin) / (Rmaks - Rmin) if Rmaks != Rmin else 0.0
        Q.append(v * a + (1 - v) * b)
    return [1 - q for q in Q]


def siralar(skorlar):
    sirali = sorted(range(len(skorlar)), key=lambda i: -skorlar[i])
    r = [0] * len(skorlar)
    for yer, i in enumerate(sirali):
        r[i] = yer + 1
    return r


def spearman(a, b):
    n = len(a)
    if n < 2:
        return None
    return 1 - 6 * sum((a[i] - b[i]) ** 2 for i in range(n)) / (n * (n ** 2 - 1))


# --- 5. Ölçüt seti ------------------------------------------------------------
OLCUTLER = [
    ('lambda',              'Ö1 Isı iletkenliği',           'min'),
    ('kutle_kgm2',          'Ö2 Birim kütle',               'min'),
    ('kappa_kJm2K',         'Ö3 Alansal ısıl kapasite',     'max'),
    ('gomulu_karbon_m2',    'Ö5 Gömülü karbon',             'min'),
    ('biyojenik_karbon_m2', 'Ö6 Biyojenik karbon',          'min'),
    ('yangin_puan',         'Ö7 Yangına tepki',             'max'),
    ('yasam_sonu_puan',     'Ö9 Yaşam sonu senaryosu',      'max'),
    ('nem_kuf_puan',        'Ö10 Nem/küf duyarlılığı',      'min'),
    ('kalinlik_cm',         'Ö11 Duvar kalınlığı kaybı',    'min'),
]


# Hesaplanan ölçütlerin dayandığı ham veri sütunları
KAYNAK_SUTUN = {
    'kutle_kgm2':          ['yogunluk'],
    'kappa_kJm2K':         ['yogunluk', 'ozgul_isi'],
    'gomulu_karbon_m2':    ['gomulu_karbon_kg'],
    'biyojenik_karbon_m2': ['biyojenik_karbon_kg'],
    'kalinlik_cm':         ['lambda'],
    'maliyet_TLm2':        ['maliyet_min_TLm3', 'maliyet_max_TLm3'],
}


def veri_eksigi(olcutler=OLCUTLER):
    """Her ölçüt için eksik (DOLDUR) hücre sayısı. Eksik veri sessizce sıfır
    sayılmamalıdır; %50'yi aşan ölçüt modelden çıkarılır."""
    mals = oku('girdi_malzemeler.csv')
    rapor = {}
    for anahtar, etiket, _ in olcutler:
        sutunlar = KAYNAK_SUTUN.get(anahtar, [anahtar])
        eksik = sum(1 for m in mals
                    if any(sayi(m.get(s)) is None for s in sutunlar))
        rapor[anahtar] = (etiket, eksik, len(mals))
    return rapor


def kullanilabilir_olcutler(olcutler=OLCUTLER, esik=0.5):
    """Eksik veri oranı esiği aşan ölçütleri eleyip kalanları döndürür."""
    rapor = veri_eksigi(olcutler)
    tutulan, elenen = [], []
    for o in olcutler:
        _, eksik, n = rapor[o[0]]
        (elenen if eksik / n > esik else tutulan).append((o, eksik, n))
    return [t[0] for t in tutulan], elenen


def malzeme_adi(m):
    return m['ad']


def karar_matrisi(bolge, olcutler=OLCUTLER, kisit=True):
    """Bölge için karar matrisi; kisit=True ise uygulanamayan alternatifler elenir."""
    mals = oku('girdi_malzemeler.csv')
    if kisit:
        mals = [m for m in mals if uygulanabilir(m, bolge)]
    matris, adlar = [], []
    for m in mals:
        kaynak = dict(m); kaynak.update(fonksiyonel_birim(m, bolge))
        satir = []
        for a, etiket, _ in olcutler:
            v = sayi(kaynak.get(a)) if not isinstance(kaynak.get(a), float) \
                else kaynak.get(a)
            if v is None:
                raise ValueError(
                    f"'{malzeme_adi(m)}' için '{etiket}' verisi eksik. "
                    f'Eksik veri sıfır sayılamaz; ölçütü modelden çıkarın '
                    f'(kullanilabilir_olcutler) veya veriyi tamamlayın.')
            satir.append(v)
        matris.append(satir)
        adlar.append(m['ad'])
    return matris, adlar


def calistir(bolge, yontem='Entropi', iklim=True, kisit=True, olcutler=OLCUTLER):
    matris, adlar = karar_matrisi(bolge, olcutler, kisit)
    w = AGIRLIK_YONTEMLERI[yontem](matris)
    if iklim:
        w = iklim_ayari(w, olcutler, int(bolge['bolge']))
    yonler = [y for _, _, y in olcutler]
    return adlar, topsis(matris, w, yonler), vikor(matris, w, yonler), w


# --- 6. Tanı: orantılılık -----------------------------------------------------
def orantilik_testi():
    mals, bolg = oku('girdi_malzemeler.csv'), oku('girdi_bolgeler.csv')
    u1 = sayi(bolg[0]['U_duvar_hedef'])
    print('=' * 78)
    print('TANI — ORANTILILIK TESTİ  (d = lambda * (1/U - R_diğer))')
    print('=' * 78)
    print(f"{'Bölge':<8}{'teorik oran':>14}{'gerçekleşen min':>18}{'maks':>10}{'yayılım':>10}")
    for b in bolg:
        u = sayi(b['U_duvar_hedef'])
        teorik = (1 / u - R_DIGER) / (1 / u1 - R_DIGER)
        o = [kalinlik(sayi(m['lambda']), u) / kalinlik(sayi(m['lambda']), u1)
             for m in mals]
        print(f"{b['bolge']:<8}{teorik:>14.3f}{min(o):>18.3f}{max(o):>10.3f}"
              f"{max(o) - min(o):>10.3f}")
    print('\nTeorik oran malzemeden bağımsız; yayılımın tek kaynağı 1 cm yuvarlama.')
    print('Sabit U hedefi TEK BAŞINA bölgeye göre sıralama farkı üretemez.\n')


def dogrula_kalinlik():
    testler = [('Antalya  (1. Bölge)', 0.45, 0.035, 7), ('Antalya  (1. Bölge)', 0.45, 0.040, 8),
               ('İstanbul (3. Bölge)', 0.40, 0.035, 8), ('İstanbul (3. Bölge)', 0.40, 0.040, 9),
               ('Ankara   (4. Bölge)', 0.35, 0.035, 9), ('Ankara   (4. Bölge)', 0.35, 0.040, 10),
               ('Erzurum  (6. Bölge)', 0.25, 0.035, 13), ('Erzurum  (6. Bölge)', 0.25, 0.040, 15)]
    print('=' * 78)
    print(f'DOĞRULAMA — hesaplanan kalınlık ve İZODER tablosu  (R_diğer = {R_DIGER})')
    print('=' * 78)
    uyum = 0
    for il, u, lmb, bek in testler:
        h = kalinlik(lmb, u) * 100
        ok = abs(h - bek) < 0.5
        uyum += ok
        print(f'{il:<22}U={u:.2f}  λ={lmb:.3f}  hesap={h:>3.0f}cm  '
              f'İZODER={bek:>3}cm  {"UYUMLU" if ok else "SAPMA"}')
    print(f'\nSonuç: {uyum}/8 uyumlu.\n')
    return uyum == 8


# --- 7. Rapor -----------------------------------------------------------------
def veri_raporu():
    print('=' * 78)
    print('VERİ BÜTÜNLÜĞÜ')
    print('=' * 78)
    tutulan, elenen = kullanilabilir_olcutler()
    for o, eksik, n in [(x, *veri_eksigi()[x[0]][1:]) for x in tutulan]:
        print(f'  TUTULDU  {o[1]:<32} eksik {eksik}/{n}')
    for o, eksik, n in elenen:
        print(f'  ELENDİ   {o[1]:<32} eksik {eksik}/{n}  '
              f'-> veri tamamlanana kadar modelden çıkarıldı')
    print()
    return tutulan


def rapor():
    dogrula_kalinlik()
    orantilik_testi()

    bolg = oku('girdi_bolgeler.csv')

    print('=' * 78)
    print('İKLİM DENGESİ — TS 825:2024 aylık dış sıcaklıklarından türetilmiştir')
    print('=' * 78)
    print(f"{'Bölge':<28}{'IDG':>9}{'SDG':>9}{'soğutma payı':>16}")
    for b in bolg:
        dg = derece_gun(int(b['bolge']))
        print(f"{b['bolge'] + '. ' + b['ad']:<28}{dg['IDG']:>9.0f}{dg['SDG']:>9.0f}"
              f"{dg['sogutma_payi']:>15.1%}")

    print()
    print('=' * 78)
    print(f'UYGULANABİLİRLİK KISITI — azami {AZAMI_KALINLIK_CM:.0f} cm')
    print('=' * 78)
    mals = oku('girdi_malzemeler.csv')
    for b in bolg:
        elenen = [m['ad'] for m in mals if not uygulanabilir(m, b)]
        print(f"  {b['bolge']}. Bölge ({b['ad']:<12}) : "
              f"{', '.join(elenen) if elenen else '— eleme yok'}")

    # Mekanizmaların sıralamaya etkisi
    print()
    print('=' * 78)
    print('MEKANİZMALARIN ETKİSİ — 1. Bölge ile 6. Bölge sıralamasının karşılaştırması')
    print('=' * 78)
    print(f"{'Kurgu':<46}{'Spearman(B1,B6)':>18}")
    b1, b6 = bolg[0], bolg[5]
    senaryolar = [
        ('Ham model (kısıt yok, iklim ayarı yok)', False, False),
        ('+ uygulanabilirlik kısıtı',              True,  False),
        ('+ iklim ayarlı ağırlık',                 False, True),
        ('+ her ikisi (tam model)',                True,  True),
    ]
    for etiket, kisit, iklim in senaryolar:
        a1, t1, _, _ = calistir(b1, 'Entropi', iklim, kisit)
        a6, t6, _, _ = calistir(b6, 'Entropi', iklim, kisit)
        ortak = [ad for ad in a1 if ad in a6]
        r1 = siralar([t1[a1.index(x)] for x in ortak])
        r6 = siralar([t6[a6.index(x)] for x in ortak])
        print(f'{etiket:<46}{spearman(r1, r6):>18.3f}')

    # Ağırlıklandırma yönteminin etkisi
    print()
    print('=' * 78)
    print('AĞIRLIKLANDIRMA YÖNTEMİNİN ETKİSİ — 1. Bölge, tam model')
    print('=' * 78)
    for yontem in AGIRLIK_YONTEMLERI:
        adlar, t, v, w = calistir(b1, yontem)
        ilk3 = sorted(range(len(adlar)), key=lambda i: -t[i])[:3]
        en_buyuk = max(range(len(w)), key=lambda j: w[j])
        print(f'\n  {yontem:<8} en ağır ölçüt: {OLCUTLER[en_buyuk][1]} ({w[en_buyuk]:.1%})')
        for yer, i in enumerate(ilk3, 1):
            print(f'      {yer}. {adlar[i]:<32}{t[i]:.4f}')
        print(f'      TOPSIS-VIKOR Spearman: {spearman(siralar(t), siralar(v)):.3f}')

    # Bölgelere göre tam model sıralaması
    print()
    print('=' * 78)
    print('TAM MODEL — bölgelere göre ilk 5 (CRITIC ağırlıklı)')
    print('=' * 78)
    for b in bolg:
        adlar, t, _, _ = calistir(b, 'CRITIC')
        ilk = sorted(range(len(adlar)), key=lambda i: -t[i])[:5]
        print(f"\n{b['bolge']}. Bölge — {b['ad']}  "
              f"(soğutma payı %{derece_gun(int(b['bolge']))['sogutma_payi'] * 100:.1f})")
        for yer, i in enumerate(ilk, 1):
            print(f'   {yer}. {adlar[i]:<32}{t[i]:.4f}')


if __name__ == '__main__':
    rapor()
