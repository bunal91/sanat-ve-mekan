# -*- coding: utf-8 -*-
"""
TS 825 aylık yöntemine göre net ISITMA enerjisi ihtiyacı.

Isıtma ve soğutma ihtiyacı birlikte hesaplanır.

SADELEŞTİRME: Soğutma tarafı, EN ISO 13790'ın aylık yarı-kararlı yöntemine
göre kurulmuştur (kayıp kullanım faktörü eta_C,ls). Dış sıcaklığın iç tasarım
sıcaklığını aştığı aylarda iletim de kazanç tarafına geçer ve kullanım faktörü
uygulanmaz. TS 825:2024'ün soğutma hesabının tam biçimi standart metninden
doğrulanmalıdır.

AMAÇ: fonksiyonel birim sabit U hedefine dayandığı için, yalıtım malzemesi
değiştiğinde binanın özgül ısı kaybı H DEĞİŞMEZ. Malzemenin yıllık enerjiye
etki edebileceği tek yol, ısıl kütlesi C üzerinden kazanç kullanım faktörüdür.
Bu betik iki kullanım faktörü kurgusunu karşılaştırır:

  A) TS 825:2008 biçimi   eta = 1 - exp(-1/KKO)        -> tau'dan BAĞIMSIZ
  B) EN ISO 13790 biçimi  eta = (1-g^a)/(1-g^(a+1)),
                          a = a0 + tau/tau0            -> tau'ya BAĞLI

A kurgusunda malzemeler arasında hiçbir fark oluşamaz. B kurgusunda oluşur.
TS 825:2024'ün hangisini kullandığı standardın metninden DOĞRULANMALIDIR.

UYARI: güneş ışınımı şiddeti I (TS 825:2024 Ek-C) elimizde yok. Aşağıdaki
tablo YER TUTUCUDUR ve duyarlılık analiziyle ölçeklenir.
"""

import csv, math, os
import model as M

BURADA = os.path.dirname(os.path.abspath(__file__))
AYLAR = list(M.GUN.keys())

# YER TUTUCU — TS 825:2024 Ek-C ile değiştirilecek. Düşey yüzeye gelen aylık
# ortalama güneş ışınımı şiddeti (W/m2), yöne göre.
I_YER_TUTUCU = {
    'Güney': [72, 90, 96, 89, 84, 82, 86, 96, 103, 95, 76, 65],
    'Kuzey': [23, 32, 45, 58, 71, 78, 74, 62, 47, 34, 24, 20],
    'Doğu':  [38, 52, 71, 85, 97, 103, 100, 92, 76, 57, 40, 33],
    'Batı':  [38, 52, 71, 85, 97, 103, 100, 92, 76, 57, 40, 33],
}


def bina():
    with open(os.path.join(BURADA, 'girdi_referans_bina.csv'), encoding='utf-8') as f:
        return {r['parametre']: M.sayi(r['deger']) for r in csv.DictReader(f)}


def ozgul_isi_kaybi(b, bolge):
    """H = H_T + H_V  (W/K). Sabit U hedefi nedeniyle malzemeden bağımsızdır."""
    ud = M.sayi(bolge['U_duvar_hedef'])
    ut = M.sayi(bolge['U_cati_hedef'])
    utab = M.sayi(bolge['U_doseme_hedef'])
    up = M.sayi(bolge['U_pencere_hedef'])

    pencere = sum(b[f'duvar_brut_{y}'] * b[f'pencere_orani_{y}']
                  for y in ('guney', 'kuzey', 'dogu', 'bati'))
    duvar_brut = sum(b[f'duvar_brut_{y}'] for y in ('guney', 'kuzey', 'dogu', 'bati'))
    opak = duvar_brut - pencere

    h_t = (ud * opak + up * pencere
           + 0.8 * ut * b['cati_alani'] + 0.5 * utab * b['taban_alani'])
    h_v = 0.33 * b['kat_alani_toplam'] * b['hava_degisim_sayisi']
    return h_t + h_v, pencere, opak


def gunes_kazanci(b, ay_i, olcek=1.0):
    """phi_s (W) — YER TUTUCU ışınım tablosuyla."""
    r, g = b['golgelenme_faktoru'], b['gunes_gecirme_faktoru']
    yonler = {'Güney': 'guney', 'Kuzey': 'kuzey', 'Doğu': 'dogu', 'Batı': 'bati'}
    return sum(r * g * (I_YER_TUTUCU[ad][ay_i] * olcek)
               * b[f'duvar_brut_{k}'] * b[f'pencere_orani_{k}']
               for ad, k in yonler.items())


def eta_2008(kko):
    if kko <= 0:
        return 1.0
    if kko >= 2.5:
        return 1.0 / kko          # kayıp yok kabulüne yaklaşır
    return 1.0 - math.exp(-1.0 / kko)


def eta_13790(gama, tau_saat, a0=1.0, tau0=15.0):
    """EN ISO 13790 ısıtma kazanç kullanım faktörü; tau'ya bağlıdır."""
    a = a0 + tau_saat / tau0
    if abs(gama - 1.0) < 1e-9:
        return a / (a + 1.0)
    return (1 - gama ** a) / (1 - gama ** (a + 1))


def eta_soguma(gama, tau_saat, a0=1.0, tau0=15.0):
    """EN ISO 13790 soğutma KAYIP kullanım faktörü; tau'ya bağlıdır."""
    a = a0 + tau_saat / tau0
    if gama <= 0:
        return 1.0
    if abs(gama - 1.0) < 1e-9:
        return a / (a + 1.0)
    return (1 - gama ** (-a)) / (1 - gama ** (-(a + 1)))


def isil_kapasite(b, malzeme, bolge):
    """Binanın etkin ısıl kapasitesi C (J/K): duvar yalıtımı + diğer bileşenler."""
    fb = M.fonksiyonel_birim(malzeme, bolge)
    _, pencere, opak = ozgul_isi_kaybi(b, bolge)
    c_duvar = fb['kappa_kJm2K'] * 1000.0 * opak                 # J/K
    c_diger = b['diger_bilesen_isil_kapasite'] * 1000.0 * b['kat_alani_toplam']
    return c_duvar + c_diger


def yillik_ihtiyac(b, malzeme, bolge, kurgu='A', gunes_olcek=1.0):
    """Yıllık net ısıtma enerjisi ihtiyacı (kWh/yıl) ve ayrıntılar."""
    H, _, _ = ozgul_isi_kaybi(b, bolge)
    sic = M.oku('girdi_bolge_sicakliklari.csv')
    bno = int(bolge['bolge'])
    phi_i = b['ic_kazanc_katsayisi'] * b['An_kullanim_alani']
    C = isil_kapasite(b, malzeme, bolge)
    tau_saat = C / H / 3600.0

    toplam = 0.0
    aylik = []
    for i, ay in enumerate(AYLAR):
        te = float(sic[i][f'bolge{bno}'])
        dt = M.GUN[ay] * 24.0                                    # saat
        kayip = H * (M.TI_ISITMA - te) * dt / 1000.0             # kWh
        if kayip <= 0:
            aylik.append((ay, 0.0)); continue
        kazanc = (phi_i + gunes_kazanci(b, i, gunes_olcek)) * dt / 1000.0
        gama = kazanc / kayip
        eta = eta_2008(gama) if kurgu == 'A' else eta_13790(gama, tau_saat)
        q = max(0.0, kayip - eta * kazanc)
        toplam += q
        aylik.append((ay, q))
    return {'QH_kWh': toplam, 'QH_ozgul': toplam / b['An_kullanim_alani'],
            'H': H, 'C_MJ': C / 1e6, 'tau_saat': tau_saat, 'aylik': aylik}


def yillik_sogutma(b, malzeme, bolge, kurgu='B', gunes_olcek=1.0):
    """Yıllık net soğutma enerjisi ihtiyacı (kWh/yıl)."""
    H, _, _ = ozgul_isi_kaybi(b, bolge)
    sic = M.oku('girdi_bolge_sicakliklari.csv')
    bno = int(bolge['bolge'])
    phi_i = b['ic_kazanc_katsayisi'] * b['An_kullanim_alani']
    C = isil_kapasite(b, malzeme, bolge)
    tau_saat = C / H / 3600.0

    toplam = 0.0
    for i, ay in enumerate(AYLAR):
        te = float(sic[i][f'bolge{bno}'])
        dt = M.GUN[ay] * 24.0
        ic_kazanc = (phi_i + gunes_kazanci(b, i, gunes_olcek)) * dt / 1000.0
        kayip = H * (M.TI_SOGUTMA - te) * dt / 1000.0        # + ise ısı atılabiliyor
        if kayip <= 0:
            # Dış ortam iç tasarım sıcaklığından sıcak: iletim de kazanç
            toplam += ic_kazanc + abs(kayip)
            continue
        if ic_kazanc <= 0:
            continue
        gama = ic_kazanc / kayip
        eta = 1.0 if kurgu == 'A' else eta_soguma(gama, tau_saat)
        toplam += max(0.0, ic_kazanc - eta * kayip)
    return {'QC_kWh': toplam, 'QC_ozgul': toplam / b['An_kullanim_alani'],
            'tau_saat': tau_saat}


def rapor():
    b = bina()
    mals, bolg = M.oku('girdi_malzemeler.csv'), M.oku('girdi_bolgeler.csv')

    print('=' * 78)
    print('REFERANS KONUT — geometri')
    print('=' * 78)
    for k in ('plan_uzunluk', 'plan_genislik', 'kat_sayisi', 'kat_yuksekligi',
              'brut_hacim', 'kat_alani_toplam', 'An_kullanim_alani'):
        print(f'  {k:<26}{b[k]:>10.1f}')
    H, pen, opak = ozgul_isi_kaybi(b, bolg[3])
    A = sum(b[f'duvar_brut_{y}'] for y in ('guney', 'kuzey', 'dogu', 'bati')) \
        + b['cati_alani'] + b['taban_alani']
    print(f"  {'pencere alanı':<26}{pen:>10.1f} m2")
    print(f"  {'opak duvar alanı':<26}{opak:>10.1f} m2")
    print(f"  {'A/V oranı':<26}{A / b['brut_hacim']:>10.3f}")

    print()
    print('=' * 78)
    print('KRİTİK SINAMA — malzeme değişimi yıllık enerjiyi değiştiriyor mu?')
    print('=' * 78)
    for kurgu, ad in (('A', 'TS 825:2008 biçimi  eta = 1-exp(-1/KKO)'),
                      ('B', 'EN ISO 13790 biçimi eta = f(gama, tau)')):
        print(f'\n  Kurgu {kurgu} — {ad}')
        print(f"    {'Malzeme':<30}{'tau (saat)':>12}{'QH (kWh/yıl)':>15}{'kWh/m2':>10}")
        sonuc = []
        for m in mals:
            r = yillik_ihtiyac(b, m, bolg[3], kurgu)   # 4. Bölge (Ankara)
            sonuc.append((m['ad'], r))
        for ad_m, r in sonuc[:4] + sonuc[-2:]:
            print(f"    {ad_m:<30}{r['tau_saat']:>12.1f}{r['QH_kWh']:>15.0f}"
                  f"{r['QH_ozgul']:>10.1f}")
        q = [r['QH_kWh'] for _, r in sonuc]
        yayilim = (max(q) - min(q)) / min(q) * 100 if min(q) else 0
        print(f"    {'--> malzemeler arası yayılım':<30}{'':>12}{max(q) - min(q):>15.0f}"
              f"{yayilim:>9.2f}%")

    print()
    print('=' * 78)
    print('BÖLGELERE GÖRE — kurgu B, en hafif ve en ağır malzeme')
    print('=' * 78)
    hafif = min(mals, key=lambda m: M.sayi(m['yogunluk']) * M.sayi(m['ozgul_isi']))
    agir = max(mals, key=lambda m: M.sayi(m['yogunluk']) * M.sayi(m['ozgul_isi']))
    print(f"  hafif: {hafif['ad']}   ağır: {agir['ad']}\n")
    print(f"  {'Bölge':<22}{'QH hafif':>12}{'QH ağır':>12}{'fark':>10}{'fark %':>9}")
    for bo in bolg:
        r1 = yillik_ihtiyac(b, hafif, bo, 'B')
        r2 = yillik_ihtiyac(b, agir, bo, 'B')
        fark = r1['QH_kWh'] - r2['QH_kWh']
        print(f"  {bo['bolge'] + '. ' + bo['ad']:<22}{r1['QH_kWh']:>12.0f}"
              f"{r2['QH_kWh']:>12.0f}{fark:>10.0f}"
              f"{fark / r1['QH_kWh'] * 100 if r1['QH_kWh'] else 0:>8.2f}%")

    print()
    print('=' * 78)
    print('GÜNEŞ IŞINIMI DUYARLILIĞI — Ek-C verisi ne kadar kritik? (4. Bölge, kurgu B)')
    print('=' * 78)
    print(f"  {'ölçek':<10}{'QH hafif':>12}{'QH ağır':>12}{'malzeme farkı %':>18}")
    for olcek in (0.5, 0.75, 1.0, 1.25, 1.5):
        r1 = yillik_ihtiyac(b, hafif, bolg[3], 'B', olcek)
        r2 = yillik_ihtiyac(b, agir, bolg[3], 'B', olcek)
        f = (r1['QH_kWh'] - r2['QH_kWh']) / r1['QH_kWh'] * 100 if r1['QH_kWh'] else 0
        print(f"  {olcek:<10.2f}{r1['QH_kWh']:>12.0f}{r2['QH_kWh']:>12.0f}{f:>17.2f}%")


if __name__ == '__main__':
    rapor()
