# -*- coding: utf-8 -*-
"""
Makale şekillerini üretir. Baskıya yönelik: gri tonlama, doku ve işaretçi
ayrımı; renk kullanılmaz, dolayısıyla renk körlüğü ve siyah-beyaz baskı
sorunları baştan ortadan kalkar.

Çıktı: ../sekiller/  (PDF vektör + PNG önizleme)
Çalıştırma: python3 sekiller_uret.py
"""

import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

import model as M
import ts825_aylik as T

CIKTI = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sekiller')
os.makedirs(CIKTI, exist_ok=True)

plt.rcParams.update({
    'font.family': 'DejaVu Sans', 'font.size': 8,
    'axes.linewidth': 0.6, 'axes.edgecolor': '#333333',
    'axes.spines.top': False, 'axes.spines.right': False,
    'axes.labelsize': 8, 'axes.titlesize': 8.5, 'axes.titleweight': 'bold',
    'xtick.major.width': 0.6, 'ytick.major.width': 0.6,
    'xtick.labelsize': 7.5, 'ytick.labelsize': 7.5,
    'legend.fontsize': 7, 'legend.frameon': False,
    'grid.color': '#cccccc', 'grid.linewidth': 0.4,
    'figure.dpi': 150, 'savefig.bbox': 'tight', 'savefig.pad_inches': 0.02,
})

GRI = ['#111111', '#4d4d4d', '#7a7a7a', '#a6a6a6', '#cccccc']
DOKU = ['', '///', '...', 'xxx', '\\\\\\']
ISARET = ['o', 's', '^', 'D', 'v', 'P']
GENISLIK = 7.0 / 2.54   # tek sütun ~7 cm; dergi şablonuna göre ayarlanır


def kaydet(fig, ad):
    for uzanti in ('pdf', 'png'):
        fig.savefig(os.path.join(CIKTI, f'{ad}.{uzanti}'))
    plt.close(fig)
    print(f'  {ad}.pdf / .png')


# --- Şekil 1: model akış şeması ----------------------------------------------
def sekil1():
    fig, ax = plt.subplots(figsize=(GENISLIK * 2.3, 3.2))
    ax.set_xlim(0, 11.4); ax.set_ylim(0, 4.6); ax.axis('off')
    G = 1.15   # kutu yarı genişliği
    kutular = [
        (1.15, 3.65, 'TS 825:2024\nU hedefleri'),
        (1.15, 2.35, 'İklim verisi\naylık sıcaklık'),
        (1.15, 0.95, 'Malzeme verisi\nEPD · literatür'),
        (3.85, 3.00, 'Fonksiyonel birim\n1 m² duvar'),
        (3.85, 1.25, 'Sistem sınırı\nS1 · S2 · S3'),
        (6.45, 3.00, 'Karar matrisi\n18 × n ölçüt'),
        (6.45, 1.25, 'Uygulanabilirlik\nkısıtı  d ≤ 20 cm'),
        (9.30, 3.95, 'Ağırlıklandırma\nEntropi·CRITIC·Eşit'),
        (9.30, 2.60, 'İklim ayarı\nw′ = w(1+ασ)'),
        (9.30, 1.25, 'Sıralama\nTOPSIS · VIKOR'),
    ]
    for x, y, t in kutular:
        ax.add_patch(FancyBboxPatch((x - G, y - 0.34), 2 * G, 0.68,
                                    boxstyle='round,pad=0.04,rounding_size=0.06',
                                    linewidth=0.7, edgecolor='#333333',
                                    facecolor='#f2f2f2'))
        ax.text(x, y, t, ha='center', va='center', fontsize=6.4, linespacing=1.35)
    oklar = [((2.30, 3.55), (2.70, 3.15)), ((2.30, 2.45), (2.70, 2.85)),
             ((2.30, 0.95), (2.70, 1.20)), ((5.00, 3.00), (5.30, 3.00)),
             ((5.00, 1.25), (5.30, 1.25)), ((6.45, 2.66), (6.45, 1.59)),
             ((7.60, 3.10), (8.15, 3.80)), ((7.60, 2.90), (8.15, 2.70)),
             ((7.60, 1.25), (8.15, 1.25)), ((9.30, 3.61), (9.30, 2.94)),
             ((9.30, 2.26), (9.30, 1.59))]
    for (x1, y1), (x2, y2) in oklar:
        ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle='-|>',
                                     mutation_scale=7, linewidth=0.7,
                                     color='#555555', shrinkA=0, shrinkB=0))
    ax.text(5.7, 0.15, 'Duyarlılık analizi:  α · $d_{maks}$ · $R_{diğer}$ · φ · ışınım ölçeği',
            ha='center', fontsize=6.4, style='italic', color='#555555')
    kaydet(fig, 'Sekil-1-model-akis-semasi')


# --- Şekil 2: orantılılık ----------------------------------------------------
def sekil2():
    mals, bolg = M.oku('girdi_malzemeler.csv'), M.oku('girdi_bolgeler.csv')
    x = [int(b['bolge']) for b in bolg]
    u1 = M.sayi(bolg[0]['U_duvar_hedef'])
    fig, ax = plt.subplots(figsize=(GENISLIK * 1.35, 2.4))
    for m in mals:
        lam = M.sayi(m['lambda'])
        d1 = M.kalinlik(lam, u1)
        ax.plot(x, [M.kalinlik(lam, M.sayi(b['U_duvar_hedef'])) / d1 for b in bolg],
                color='#999999', linewidth=0.6, marker='o', markersize=2.2,
                alpha=0.85, zorder=2)
    teorik = [(1 / M.sayi(b['U_duvar_hedef']) - M.R_DIGER) / (1 / u1 - M.R_DIGER)
              for b in bolg]
    ax.plot(x, teorik, color='#111111', linewidth=1.8, zorder=3,
            label='Teorik oran  $K_b/K_1$')
    ax.plot([], [], color='#999999', linewidth=0.6, marker='o', markersize=2.2,
            label='18 alternatifin gerçekleşen oranı')
    ax.set_xlabel('TS 825:2024 derece gün bölgesi')
    ax.set_ylabel('Kalınlık oranı  $d_b/d_1$')
    ax.set_xticks(x); ax.grid(axis='y', zorder=0)
    ax.legend(loc='upper left')
    ax.set_title('Şekil 2. Gerekli kalınlığın bölgeler arası oranı', loc='left')
    ax.text(0.98, 0.05, 'Yayılımın tek kaynağı\n1 cm yuvarlamadır',
            transform=ax.transAxes, ha='right', va='bottom', fontsize=6.4,
            style='italic', color='#555555')
    kaydet(fig, 'Sekil-2-orantililik')


# --- Şekil 3: mekanizmaların katkısı ----------------------------------------
def sekil3():
    bolg = M.oku('girdi_bolgeler.csv'); b1, b6 = bolg[0], bolg[5]
    ana, _ = M.tam_olcutler(M.OLCUTLER)
    kurgular = [('Ham model', 0, 0), ('+ uygulanabilirlik\nkısıtı', 1, 0),
                ('+ iklim ayarlı\nağırlık', 0, 1), ('+ her ikisi\n(tam model)', 1, 1)]
    etiket, deger = [], []
    for ad, kisit, iklim in kurgular:
        a1, t1, _, _ = M.calistir(b1, 'Entropi', iklim, kisit, ana)
        a6, t6, _, _ = M.calistir(b6, 'Entropi', iklim, kisit, ana)
        ortak = [x for x in a1 if x in a6]
        r1 = M.siralar([t1[a1.index(x)] for x in ortak])
        r6 = M.siralar([t6[a6.index(x)] for x in ortak])
        etiket.append(ad); deger.append(M.spearman(r1, r6))
    fig, ax = plt.subplots(figsize=(GENISLIK * 1.35, 2.2))
    y = range(len(etiket))
    ax.barh(list(y), deger, height=0.6, color='#d9d9d9', edgecolor='#333333',
            linewidth=0.7, hatch=None, zorder=2)
    for i, v in enumerate(deger):
        ax.text(v - 0.02, i, f'{v:.3f}', va='center', ha='right', fontsize=7,
                color='#111111', fontweight='bold')
    ax.set_yticks(list(y)); ax.set_yticklabels(etiket)
    ax.invert_yaxis(); ax.set_xlim(0, 1.05)
    ax.set_xlabel('Spearman sıra korelasyonu, 1. ve 6. bölge')
    ax.grid(axis='x', zorder=0)
    ax.set_title('Şekil 3. Mekanizmaların bölge etkisine katkısı', loc='left')
    ax.text(0.99, 0.97, 'Düşük değer = güçlü bölge etkisi', transform=ax.transAxes,
            ha='right', va='top', fontsize=6.4, style='italic', color='#555555')
    kaydet(fig, 'Sekil-3-mekanizma-katkisi')


# --- Şekil 4: sistem sınırına göre sıralama değişimi ------------------------
def sekil4():
    bolg = M.oku('girdi_bolgeler.csv')
    kod = M.tam_veri_kodlari(M.OLCUTLER_SINIR)
    sinirlar = ['S1', 'S2', 'S3']
    veri = {}
    for sn in sinirlar:
        M.SINIR = sn
        a, t, _, _ = M.calistir(bolg[0], 'CRITIC', True, True, M.OLCUTLER_SINIR, kod)
        for ad, r in zip(a, M.siralar(t)):
            veri.setdefault(ad, []).append(r)
    M.SINIR = 'S2'
    fig, ax = plt.subplots(figsize=(GENISLIK * 1.5, 2.9))
    vurgu = sorted(veri, key=lambda k: min(veri[k]))[:5]
    for i, (ad, r) in enumerate(sorted(veri.items(), key=lambda x: x[1][0])):
        one = ad in vurgu
        ax.plot(range(3), r, color='#111111' if one else '#bbbbbb',
                linewidth=1.4 if one else 0.6,
                marker=ISARET[vurgu.index(ad) % len(ISARET)] if one else 'o',
                markersize=4 if one else 2, zorder=3 if one else 1,
                markerfacecolor='white' if one else '#bbbbbb',
                markeredgewidth=1.0 if one else 0.4)
        if one:
            ax.text(2.08, r[2], ' ' + ad[:22], va='center', fontsize=6.4)
    ax.set_xticks(range(3))
    ax.set_xticklabels(['S1\nA1–A3', 'S2\n+C3, C4', 'S3\n+D'])
    ax.set_ylabel('Sıra')
    ax.invert_yaxis(); ax.set_xlim(-0.15, 3.4)
    ax.grid(axis='y', zorder=0)
    ax.set_title('Şekil 4. Sistem sınırının sıralamaya etkisi (1. Bölge, CRITIC)',
                 loc='left')
    kaydet(fig, 'Sekil-4-sistem-siniri-siralama')


# --- Şekil 5: ısıl kütlenin enerji farkı ------------------------------------
def sekil5():
    b = T.bina(); bolg = M.oku('girdi_bolgeler.csv')
    mals = M.oku('girdi_malzemeler.csv')
    hafif = min(mals, key=lambda m: M.sayi(m['yogunluk']) * M.sayi(m['ozgul_isi']))
    agir = max(mals, key=lambda m: M.sayi(m['yogunluk']) * M.sayi(m['ozgul_isi']))
    isit, sog, top = [], [], []
    for bo in bolg:
        h1 = T.yillik_ihtiyac(b, hafif, bo, 'B')['QH_kWh']
        h2 = T.yillik_ihtiyac(b, agir, bo, 'B')['QH_kWh']
        c1 = T.yillik_sogutma(b, hafif, bo, 'B')['QC_kWh']
        c2 = T.yillik_sogutma(b, agir, bo, 'B')['QC_kWh']
        isit.append((h1 - h2) / h1 * 100)
        sog.append((c1 - c2) / c1 * 100 if c1 else 0)
        top.append(((h1 + c1) - (h2 + c2)) / (h1 + c1) * 100)
    x = range(len(bolg)); g = 0.26
    fig, ax = plt.subplots(figsize=(GENISLIK * 1.55, 2.4))
    ax.bar([i - g for i in x], isit, g, label='Isıtma', color='#ffffff',
           edgecolor='#111111', linewidth=0.7, hatch='///', zorder=2)
    ax.bar(list(x), sog, g, label='Soğutma', color='#a6a6a6',
           edgecolor='#111111', linewidth=0.7, zorder=2)
    ax.bar([i + g for i in x], top, g, label='Toplam', color='#111111',
           edgecolor='#111111', linewidth=0.7, zorder=2)
    ax.set_xticks(list(x))
    ax.set_xticklabels([f"{bo['bolge']}\n{bo['ad']}" for bo in bolg], fontsize=6.4)
    ax.set_ylabel('Malzemeler arası enerji farkı (%)')
    ax.set_ylim(0, max(isit + sog + top) * 1.32)
    ax.grid(axis='y', zorder=0)
    ax.legend(ncol=3, loc='upper center', bbox_to_anchor=(0.5, 1.02))
    ax.set_title('Şekil 5. Isıl kütlenin enerji ihtiyacına etkisi', loc='left')
    kaydet(fig, 'Sekil-5-isil-kutle-enerji')


# --- Şekil 6: yaşam sonu salım oranı eşiği ----------------------------------
def sekil6():
    bolg = M.oku('girdi_bolgeler.csv')
    kod = M.tam_veri_kodlari(M.OLCUTLER_SINIR); M.SINIR = 'S2'

    def birinci(bo, phi, yontem):
        M.C3_ORANI = phi
        a, t, _, _ = M.calistir(bo, yontem, True, True, M.OLCUTLER_SINIR, kod)
        return a[M.siralar(t).index(1)]

    def esik(bo, yontem):
        if 'ünü' in birinci(bo, 0.0, yontem):
            return 0.0
        if 'ünü' not in birinci(bo, 1.0, yontem):
            return None
        lo, hi = 0.0, 1.0
        for _ in range(24):
            m = (lo + hi) / 2
            if 'ünü' in birinci(bo, m, yontem):
                hi = m
            else:
                lo = m
        return hi

    fig, ax = plt.subplots(figsize=(GENISLIK * 1.5, 2.4))
    x = [int(bo['bolge']) for bo in bolg]
    for i, y in enumerate(('CRITIC', 'Eşit', 'Entropi')):
        d = [esik(bo, y) for bo in bolg]
        ax.plot(x, d, color=GRI[i], linewidth=1.3, marker=ISARET[i],
                markersize=4.2, markerfacecolor='white', markeredgewidth=1.0,
                label=y, zorder=3)
    M.C3_ORANI = 1.0
    ax.fill_between([0.6, 6.4], 0, 1.02, color='#f5f5f5', zorder=0)
    ax.axhline(0, color='#cccccc', linewidth=0.5, zorder=1)
    ax.set_xlim(0.6, 6.4); ax.set_ylim(-0.16, 1.06)
    ax.set_xticks(x)
    ax.set_xticklabels([f"{bo['bolge']}\n{bo['ad']}" for bo in bolg], fontsize=6.4)
    ax.set_ylabel('Eşik salım oranı  $\\varphi^*$')
    ax.set_yticks([0, 0.2, 0.4, 0.6, 0.8, 1.0])
    ax.grid(axis='y', zorder=1)
    ax.legend(ncol=3, loc='upper center', bbox_to_anchor=(0.5, -0.20))
    ax.set_title('Şekil 6. Biyo-esaslı üstünlüğün kaybolduğu salım oranı', loc='left')
    ax.text(0.99, 0.96, '$\\varphi^*$ üzerinde camyünü birinci',
            transform=ax.transAxes, ha='right', va='top', fontsize=6.4,
            style='italic', color='#555555')
    kaydet(fig, 'Sekil-6-salim-orani-esigi')


if __name__ == '__main__':
    print('Şekiller üretiliyor:')
    for f in (sekil1, sekil2, sekil3, sekil4, sekil5, sekil6):
        f()
    print(f'\nÇıktı klasörü: sekiller/')
