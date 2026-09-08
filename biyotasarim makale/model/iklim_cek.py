# -*- coding: utf-8 -*-
"""
PVGIS 5.3'ten enerji hesabının iklim girdisi: aylık ortalama dış hava sıcaklığı
ve düşey duvar yüzeylerine gelen yön bazlı aylık ortalama ışınım şiddeti.

SÜRÜM VE DÖNEM: PVGIS API v5_3 (Eylül 2024'ten beri üretim sürümü). Işınım
PVGIS-SARAH3, meteoroloji ERA5. Veri dönemi, servisin sunduğu tam aralık olan
2005-2023'tür (19 yıl); bu, tek tek yılların değil uzun dönem ikliminin
kullanılmasını sağlar.

BÖLGE-İL EŞLEŞMESİ: Yalnızca il-bölge karşılığı bağımsız olarak doğrulanabilen
dört bölge için veri çekilir. 2. ve 5. bölgeler için doğrulanabilir temsilci il
bulunamadığından enerji hesabı bu bölgelerde yürütülmez.

Çıktı: girdi_iklim_pvgis.csv
"""

import csv, json, os, ssl, time, urllib.parse, urllib.request
import model as M

API = 'https://re.jrc.ec.europa.eu/api/v5_3/MRcalc'
CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
BURADA = os.path.dirname(os.path.abspath(__file__))
YIL_BAS, YIL_SON = 2005, 2023

# Bölge -> (temsilci il, enlem, boylam). Eşleşme, TS 825:2024 için yayımlanmış
# asgari yalıtım kalınlığı tablosunun il-bölge sütunundan alınmıştır.
ILLER = {
    '1': ('Antalya',  36.90, 30.69),
    '3': ('İstanbul', 41.01, 28.98),
    '4': ('Ankara',   39.93, 32.86),
    '6': ('Erzurum',  39.90, 41.27),
}
YONLER = {'Güney': 0, 'Doğu': -90, 'Batı': 90, 'Kuzey': 180}
AYLAR = list(M.GUN.keys())


def getir(**p):
    url = API + '?' + urllib.parse.urlencode(
        {**p, 'outputformat': 'json', 'startyear': YIL_BAS, 'endyear': YIL_SON})
    istek = urllib.request.Request(url, headers={'Accept': 'application/json'})
    with urllib.request.urlopen(istek, timeout=120, context=CTX) as y:
        return json.load(y)


def aylik_ortalama(kayitlar, alan):
    """Yıllar arası ortalamayı ay bazında döndürür (1..12)."""
    toplam, sayac = [0.0] * 12, [0] * 12
    for r in kayitlar:
        i = int(r['month']) - 1
        toplam[i] += float(r[alan]); sayac[i] += 1
    return [toplam[i] / sayac[i] if sayac[i] else None for i in range(12)]


def il_verisi(lat, lon):
    sonuc = {'sicaklik': None, 'isinim': {}}
    for yon, aspect in YONLER.items():
        d = getir(lat=lat, lon=lon, selectrad=1, angle=90, aspect=aspect, avtemp=1)
        meteo = d['inputs']['meteo_data']
        kayit = d['outputs']['monthly']
        aylik_kwh = aylik_ortalama(kayit, 'H(i)_m')   # kWh/m² ay
        sonuc['isinim'][yon] = [
            aylik_kwh[i] * 1000.0 / (M.GUN[AYLAR[i]] * 24.0) for i in range(12)]
        if sonuc['sicaklik'] is None:
            sonuc['sicaklik'] = aylik_ortalama(kayit, 'T2m')
            sonuc['kunye'] = (meteo['radiation_db'], meteo['meteo_db'],
                              meteo['year_min'], meteo['year_max'])
        time.sleep(0.35)
    return sonuc


def calistir():
    print(f'PVGIS v5_3 verisi çekiliyor ({len(ILLER)} il × 4 yön, '
          f'{YIL_BAS}-{YIL_SON})...')
    veri = {}
    for bolge, (ad, lat, lon) in ILLER.items():
        veri[bolge] = il_verisi(lat, lon)
        r, m, y1, y2 = veri[bolge]['kunye']
        print(f'  {bolge}. bölge {ad:<10} {r} + {m}, {y1}-{y2}')

    yol = os.path.join(BURADA, 'girdi_iklim_pvgis.csv')
    with open(yol, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['bolge', 'il', 'buyukluk', 'yon'] + AYLAR)
        for bolge, (ad, _, _) in ILLER.items():
            v = veri[bolge]
            w.writerow([bolge, ad, 'sicaklik_C', '-'] +
                       [f'{x:.2f}' for x in v['sicaklik']])
            for yon in YONLER:
                w.writerow([bolge, ad, 'isinim_Wm2', yon] +
                           [f'{x:.1f}' for x in v['isinim'][yon]])
    print(f'\n{os.path.basename(yol)} yazıldı.')


if __name__ == '__main__':
    calistir()
