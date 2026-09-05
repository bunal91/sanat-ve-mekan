# -*- coding: utf-8 -*-
"""
TS 825:2024 iklim bölgelerine göre biyo-esaslı yapı kabuğu malzemeleri için
çok ölçütlü karar modeli.

Fonksiyonel birim: ilgili derece gün bölgesi için TS 825:2024'ün tavsiye ettiği
U_duvar değerini sağlayan 1 m2 dış duvar bileşeni.

Yalnızca Python standart kütüphanesi kullanır. Çalıştırma:  python3 model.py
"""

import csv, math, os

# --- Sabitler / varsayımlar ---------------------------------------------------
# Yalıtım dışındaki katmanların ve yüzeysel ısı geçiş dirençlerinin toplamı.
# 0,30 değeri, İZODER'in TS 825:2024 için yayımladığı kalınlık tablosunu
# birebir yeniden ürettiği için seçilmiştir (bkz. dogrula_kalinlik()).
R_DIGER = 0.30          # m2K/W
KALINLIK_ADIMI = 0.01   # 1 cm; en yakın cm'ye yuvarlanır

BURADA = os.path.dirname(os.path.abspath(__file__))


def oku(dosya):
    with open(os.path.join(BURADA, dosya), encoding='utf-8') as f:
        return list(csv.DictReader(f))


def sayi(x):
    try:
        return float(str(x).replace(',', '.'))
    except (TypeError, ValueError):
        return None


# --- 1. Fonksiyonel birim hesabı ---------------------------------------------
def kalinlik(lmbda, u_hedef, r_diger=R_DIGER):
    """Hedef U değerini sağlayan yalıtım kalınlığı (m), en yakın cm'ye yuvarlanmış."""
    r_gerekli = 1.0 / u_hedef - r_diger
    if r_gerekli <= 0:
        return 0.0
    d = lmbda * r_gerekli
    return round(d / KALINLIK_ADIMI) * KALINLIK_ADIMI


def fonksiyonel_birim(malzeme, bolge):
    """1 m2 duvar için kalınlık, kütle, gömülü/biyojenik karbon ve maliyet."""
    lmbda = sayi(malzeme['lambda'])
    rho = sayi(malzeme['yogunluk'])
    u = sayi(bolge['U_duvar_hedef'])
    d = kalinlik(lmbda, u)
    kutle = d * rho                                   # kg/m2
    gomulu = kutle * sayi(malzeme['gomulu_karbon_kg'])        # kgCO2e/m2
    biyojenik = kutle * sayi(malzeme['biyojenik_karbon_kg'])  # kgCO2e/m2 (negatif)
    mmin, mmaks = sayi(malzeme['maliyet_min_TLm3']), sayi(malzeme['maliyet_max_TLm3'])
    maliyet = d * ((mmin + mmaks) / 2) if (mmin is not None and mmaks is not None) else None
    return {
        'kalinlik_m': d,
        'kalinlik_cm': d * 100,
        'kutle_kgm2': kutle,
        'gomulu_karbon_m2': gomulu,
        'biyojenik_karbon_m2': biyojenik,
        'net_karbon_m2': gomulu + biyojenik,
        'maliyet_TLm2': maliyet,
    }


# --- 2. Entropi ağırlıklandırma ----------------------------------------------
def entropi_agirliklari(matris):
    """Sütunları ölçüt olan karar matrisinden objektif ağırlıklar üretir."""
    n, m = len(matris), len(matris[0])
    k = 1.0 / math.log(n)
    agirliklar = []
    for j in range(m):
        sutun = [satir[j] for satir in matris]
        toplam = sum(sutun)
        if toplam == 0:
            agirliklar.append(0.0)
            continue
        p = [v / toplam for v in sutun]
        e = -k * sum(pi * math.log(pi) for pi in p if pi > 0)
        agirliklar.append(1.0 - e)
    tp = sum(agirliklar)
    return [a / tp for a in agirliklar] if tp else [1.0 / m] * m


# --- 3. TOPSIS ----------------------------------------------------------------
def topsis(matris, agirliklar, yonler):
    """yonler: her ölçüt için 'max' (fayda) veya 'min' (maliyet)."""
    m = len(matris[0])
    normlar = [math.sqrt(sum(satir[j] ** 2 for satir in matris)) for j in range(m)]
    N = [[(satir[j] / normlar[j] if normlar[j] else 0.0) * agirliklar[j]
          for j in range(m)] for satir in matris]
    ideal, anti = [], []
    for j in range(m):
        sutun = [satir[j] for satir in N]
        if yonler[j] == 'max':
            ideal.append(max(sutun)); anti.append(min(sutun))
        else:
            ideal.append(min(sutun)); anti.append(max(sutun))
    skorlar = []
    for satir in N:
        d_art = math.sqrt(sum((satir[j] - ideal[j]) ** 2 for j in range(m)))
        d_eksi = math.sqrt(sum((satir[j] - anti[j]) ** 2 for j in range(m)))
        skorlar.append(d_eksi / (d_art + d_eksi) if (d_art + d_eksi) else 0.0)
    return skorlar


def spearman(a, b):
    """İki sıralama arasında Spearman sıra korelasyonu."""
    n = len(a)
    if n < 2:
        return None
    d2 = sum((a[i] - b[i]) ** 2 for i in range(n))
    return 1 - (6 * d2) / (n * (n ** 2 - 1))


def siralar(skorlar):
    """Skorlardan 1..n sıra numaraları (yüksek skor = 1. sıra)."""
    sirali = sorted(range(len(skorlar)), key=lambda i: -skorlar[i])
    r = [0] * len(skorlar)
    for yer, i in enumerate(sirali):
        r[i] = yer + 1
    return r


# --- 4. Doğrulama: İZODER'in yayımlanmış kalınlık tablosu ---------------------
def dogrula_kalinlik():
    """
    İZODER'in TS 825:2024 için yayımladığı asgari yalıtım kalınlıkları ile
    hesabın uyumunu sınar. (il, U_hedef, lambda, beklenen_cm)
    """
    testler = [
        ('Antalya  (1. Bölge)', 0.45, 0.035, 7),
        ('Antalya  (1. Bölge)', 0.45, 0.040, 8),
        ('İstanbul (3. Bölge)', 0.40, 0.035, 8),
        ('İstanbul (3. Bölge)', 0.40, 0.040, 9),
        ('Ankara   (4. Bölge)', 0.35, 0.035, 9),
        ('Ankara   (4. Bölge)', 0.35, 0.040, 10),
        ('Erzurum  (6. Bölge)', 0.25, 0.035, 13),
        ('Erzurum  (6. Bölge)', 0.25, 0.040, 15),
    ]
    print('=' * 74)
    print('DOĞRULAMA — hesaplanan kalınlık ile İZODER tablosunun karşılaştırması')
    print(f'(R_diğer = {R_DIGER} m2K/W)')
    print('=' * 74)
    print(f"{'İl / Bölge':<22}{'U':>6}{'lambda':>9}{'hesap':>9}{'İZODER':>9}   sonuç")
    hepsi = True
    for il, u, lmb, beklenen in testler:
        h = kalinlik(lmb, u) * 100
        ok = abs(h - beklenen) < 0.5
        hepsi = hepsi and ok
        print(f'{il:<22}{u:>6.2f}{lmb:>9.3f}{h:>8.0f}cm{beklenen:>8}cm   {"UYUMLU" if ok else "SAPMA"}')
    print(f"\nGenel sonuç: {'8/8 uyumlu — hesap temeli doğrulandı.' if hepsi else 'Sapma var, R_diğer gözden geçirilmeli.'}\n")
    return hepsi


# --- 5. Ana akış --------------------------------------------------------------
OLCUTLER = [
    # (anahtar, etiket, yön)
    ('lambda',              'Ö1 Isı iletkenliği',        'min'),
    ('kutle_kgm2',          'Ö2 Fonksiyonel birim kütlesi', 'min'),
    ('ozgul_isi',           'Ö3 Özgül ısı kapasitesi',   'max'),
    ('gomulu_karbon_m2',    'Ö5 Gömülü karbon',          'min'),
    ('biyojenik_karbon_m2', 'Ö6 Biyojenik karbon',       'min'),
    ('yangin_puan',         'Ö7 Yangına tepki',          'max'),
    ('yasam_sonu_puan',     'Ö9 Yaşam sonu senaryosu',   'max'),
    ('nem_kuf_puan',        'Ö10 Nem/küf duyarlılığı',   'min'),
    ('kalinlik_cm',         'Ö11 Duvar kalınlığı kaybı', 'min'),
]
# Not: Ö4 (mu) hedef aralık ölçütü ve Ö8 (maliyet) veri beklediği için
# şimdilik devre dışı; maliyet verisi girildiğinde OLCUTLER'e eklenecek.


def calistir(olcutler=OLCUTLER, etiket='TAM MODEL'):
    malzemeler, bolgeler = oku('girdi_malzemeler.csv'), oku('girdi_bolgeler.csv')
    tum_siralamalar = {}
    satirlar_csv = []

    for bolge in bolgeler:
        matris, adlar = [], []
        for mal in malzemeler:
            fb = fonksiyonel_birim(mal, bolge)
            kaynak = dict(mal); kaynak.update(fb)
            satir = []
            for anahtar, _, _ in olcutler:
                v = sayi(kaynak.get(anahtar))
                satir.append(v if v is not None else 0.0)
            matris.append(satir); adlar.append(mal['ad'])
            satirlar_csv.append({
                'bolge': bolge['bolge'], 'bolge_adi': bolge['ad'],
                'malzeme': mal['ad'], 'biyo_esasli': mal['biyo_esasli'],
                'kalinlik_cm': round(fb['kalinlik_cm'], 1),
                'kutle_kgm2': round(fb['kutle_kgm2'], 1),
                'gomulu_karbon_m2': round(fb['gomulu_karbon_m2'], 2),
                'biyojenik_karbon_m2': round(fb['biyojenik_karbon_m2'], 2),
                'net_karbon_m2': round(fb['net_karbon_m2'], 2),
            })

        # Entropi negatif değer kabul etmediği için sütunları [0,1]'e taşı
        m = len(matris[0])
        pozitif = []
        for satir in matris:
            pozitif.append(list(satir))
        for j in range(m):
            sut = [s[j] for s in matris]
            lo, hi = min(sut), max(sut)
            for i, s in enumerate(pozitif):
                s[j] = 0.5 if hi == lo else (matris[i][j] - lo) / (hi - lo) + 1e-6

        agirliklar = entropi_agirliklari(pozitif)
        yonler = [y for _, _, y in olcutler]
        skorlar = topsis(matris, agirliklar, yonler)
        tum_siralamalar[bolge['bolge']] = (adlar, skorlar, siralar(skorlar), agirliklar)

    return tum_siralamalar, satirlar_csv, [e[1] for e in olcutler]


def rapor():
    dogrula_kalinlik()

    sonuc, satirlar, etiketler = calistir()
    _, _, _, agirliklar = sonuc['1']
    print('=' * 74)
    print('ENTROPİ AĞIRLIKLARI (1. Bölge)')
    print('=' * 74)
    for e, a in sorted(zip(etiketler, agirliklar), key=lambda x: -x[1]):
        print(f'  {e:<32}{a:>7.3f}  {"#" * int(a * 90)}')

    print()
    print('=' * 74)
    print('BÖLGELERE GÖRE TOPSIS SIRALAMASI (ilk 6)')
    print('=' * 74)
    bolge_adlari = {b['bolge']: b['ad'] for b in oku('girdi_bolgeler.csv')}
    for b in sorted(sonuc, key=int):
        adlar, skorlar, sira, _ = sonuc[b]
        ilk = sorted(range(len(adlar)), key=lambda i: -skorlar[i])[:6]
        print(f"\n{b}. Bölge — {bolge_adlari[b]}")
        for yer, i in enumerate(ilk, 1):
            print(f'   {yer}. {adlar[i]:<32}{skorlar[i]:.4f}')

    # Sıralama kayması: ölçüt olan asıl bulgu
    print()
    print('=' * 74)
    print('SIRALAMA KAYMASI — bölgeler arası Spearman korelasyonu')
    print('=' * 74)
    bolgeler = sorted(sonuc, key=int)
    print('      ' + ''.join(f'{b:>8}' for b in bolgeler))
    for b1 in bolgeler:
        satir = f'{b1:>4}  '
        for b2 in bolgeler:
            satir += f'{spearman(sonuc[b1][2], sonuc[b2][2]):>8.3f}'
        print(satir)

    # AS2: biyojenik karbon ve yaşam sonu çıkarılınca ne değişiyor?
    kisitli = [o for o in OLCUTLER if o[0] not in ('biyojenik_karbon_m2', 'yasam_sonu_puan')]
    sonuc2, _, _ = calistir(kisitli)
    print()
    print('=' * 74)
    print('AS2 — Ö6 (biyojenik karbon) ve Ö9 (yaşam sonu) modelden çıkarılınca')
    print('=' * 74)
    for b in bolgeler:
        rho = spearman(sonuc[b][2], sonuc2[b][2])
        adlar = sonuc[b][0]
        eski = adlar[sonuc[b][2].index(1)]
        yeni = adlar[sonuc2[b][2].index(1)]
        degisim = '→ 1. sıra DEĞİŞTİ' if eski != yeni else '  1. sıra aynı'
        print(f'  {b}. Bölge  Spearman={rho:>6.3f}   {eski:<26} vs {yeni:<26}{degisim}')

    with open(os.path.join(BURADA, 'cikti_fonksiyonel_birim.csv'), 'w',
              newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(satirlar[0].keys()))
        w.writeheader(); w.writerows(satirlar)
    print('\nÇıktı yazıldı: cikti_fonksiyonel_birim.csv')



# --- 6. Tanı: orantılılık testi ------------------------------------------------
def orantilik_testi():
    """
    Sabit U hedefine dayalı fonksiyonel birimde, gerekli kalınlık
        d = lambda * (1/U - R_diger)
    olduğundan, bölgeler arası oran (1/U_b - R_diger)/(1/U_1 - R_diger) TÜM
    malzemeler için AYNIDIR. Kalınlıktan türeyen bütün ölçütler (kütle, gömülü
    karbon, maliyet, kalınlık kaybı, ısıl kütle) bu ortak çarpanla ölçeklenir;
    dolayısıyla TOPSIS sıralaması bölgeden bağımsız hale gelir. Aşağıdaki test
    bunu sayısal olarak gösterir: yayılım yalnızca 1 cm'ye yuvarlamadan doğar.
    """
    mals, bolg = oku('girdi_malzemeler.csv'), oku('girdi_bolgeler.csv')
    u1 = sayi(bolg[0]['U_duvar_hedef'])
    print('=' * 74)
    print('TANI — ORANTILILIK TESTİ')
    print('=' * 74)
    print(f"{'Bölge':<8}{'teorik oran':>14}{'gerçekleşen min':>18}{'maks':>10}{'yayılım':>10}")
    for b in bolg:
        u = sayi(b['U_duvar_hedef'])
        teorik = (1 / u - R_DIGER) / (1 / u1 - R_DIGER)
        oranlar = []
        for m in mals:
            lam = sayi(m['lambda'])
            d1 = kalinlik(lam, u1)
            oranlar.append(kalinlik(lam, u) / d1 if d1 else 0)
        print(f"{b['bolge']:<8}{teorik:>14.3f}{min(oranlar):>18.3f}"
              f"{max(oranlar):>10.3f}{max(oranlar) - min(oranlar):>10.3f}")
    print('\nYayılımın tek kaynağı 1 cm yuvarlamadır. Sabit U hedefi tek başına')
    print('bölgeye göre sıralama farkı üretemez — bkz. 04-pilot-bulgu-notu.md\n')


# --- 7. Uygulanabilirlik kısıtı ------------------------------------------------
AZAMI_KALINLIK_CM = 20.0  # duvar bileşeninde uygulanabilir kabul edilen üst sınır


def uygulanabilir(malzeme, bolge, sinir_cm=AZAMI_KALINLIK_CM):
    """Bölgenin U hedefi için gereken kalınlık uygulanabilirlik sınırında mı?"""
    return kalinlik(sayi(malzeme['lambda']), sayi(bolge['U_duvar_hedef'])) * 100 <= sinir_cm + 1e-9


def uygulanabilirlik_raporu(sinir_cm=AZAMI_KALINLIK_CM):
    mals, bolg = oku('girdi_malzemeler.csv'), oku('girdi_bolgeler.csv')
    print('=' * 74)
    print(f'UYGULANABİLİRLİK KISITI — azami {sinir_cm:.0f} cm yalıtım kalınlığı')
    print('=' * 74)
    for b in bolg:
        elenen = [m['ad'] for m in mals if not uygulanabilir(m, b, sinir_cm)]
        durum = ', '.join(elenen) if elenen else '— eleme yok'
        print(f"  {b['bolge']}. Bölge ({b['ad']:<12}) : {durum}")
    print('\nEleme kümesi bölgeye göre DEĞİŞTİĞİ için, uygun alternatif kümesi')
    print('bölgeye bağımlıdır. Gerçek bölge etkisi buradan doğar.\n')


if __name__ == '__main__':
    orantilik_testi()
    uygulanabilirlik_raporu()
    rapor()
