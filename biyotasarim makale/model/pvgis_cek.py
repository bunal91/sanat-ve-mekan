# -*- coding: utf-8 -*-
"""
PVGIS'ten (AB Ortak Araştırma Merkezi, açık erişim) düşey yüzeylere gelen
aylık ortalama güneş ışınımı şiddeti ve aylık ortalama dış hava sıcaklığı.

AMAÇ: TS 825:2024 Ek-C'deki ışınım tablosuna erişilemediğinden, yer tutucu
tablo yerine açık ve atıf verilebilir bir kaynak kullanmak.

YÖNTEM: Her derece gün bölgesi için temsilci il, adayların PVGIS aylık ortalama
sıcaklık profili ile TS 825:2024'ün o bölge için verdiği aylık sıcaklık profili
arasındaki karekök ortalama hata (RMSE) en küçük olacak şekilde seçilir. Böylece
temsilci il seçimi, il-bölge listesine erişim gerektirmeden ve tekrarlanabilir
biçimde yapılır.

Kaynak: PVGIS-SARAH2 ışınım, ERA5 meteoroloji. https://re.jrc.ec.europa.eu
Çıktı : girdi_gunes_isinimi.csv, girdi_temsilci_iller.csv
"""

import csv, json, math, os, ssl, time, urllib.parse, urllib.request
import model as M

API = 'https://re.jrc.ec.europa.eu/api/v5_2/MRcalc'
CTX = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
BURADA = os.path.dirname(os.path.abspath(__file__))
YIL_BAS, YIL_SON = 2018, 2020

# Aday iller — Türkiye'nin iklim çeşitliliğini kapsayacak biçimde seçilmiştir
ILLER = {
    'Antalya': (36.90, 30.69), 'Adana': (37.00, 35.32), 'Mersin': (36.80, 34.63),
    'İzmir': (38.42, 27.14), 'Aydın': (37.85, 27.84), 'İstanbul': (41.01, 28.98),
    'Bursa': (40.19, 29.06), 'Samsun': (41.29, 36.33), 'Trabzon': (41.00, 39.72),
    'Ankara': (39.93, 32.86), 'Eskişehir': (39.78, 30.52), 'Konya': (37.87, 32.48),
    'Diyarbakır': (37.91, 40.24), 'Şanlıurfa': (37.16, 38.79),
    'Kayseri': (38.73, 35.49), 'Sivas': (39.75, 37.02), 'Van': (38.49, 43.38),
    'Erzurum': (39.90, 41.27), 'Kars': (40.60, 43.09), 'Ağrı': (39.72, 43.05),
}
YONLER = {'Güney': 0, 'Doğu': -90, 'Batı': 90, 'Kuzey': 180}
AYLAR = list(M.GUN.keys())


def getir(**p):
    url = API + '?' + urllib.parse.urlencode(
        {**p, 'outputformat': 'json', 'startyear': YIL_BAS, 'endyear': YIL_SON})
    istek = urllib.request.Request(url, headers={'Accept': 'application/json'})
    with urllib.request.urlopen(istek, timeout=90, context=CTX) as y:
        return json.load(y)


def aylik_ortalama(kayitlar, alan):
    """Yıllar arası ortalamayı ay bazında döndürür (1..12)."""
    toplam, sayac = [0.0] * 12, [0] * 12
    for r in kayitlar:
        i = int(r['month']) - 1
        toplam[i] += float(r[alan]); sayac[i] += 1
    return [toplam[i] / sayac[i] if sayac[i] else None for i in range(12)]


def il_verisi(ad, lat, lon):
    """Dört yön için ışınım (W/m²) ve aylık ortalama sıcaklık (°C)."""
    sonuc = {'sicaklik': None, 'isinim': {}}
    for yon, aspect in YONLER.items():
        d = getir(lat=lat, lon=lon, selectrad=1, angle=90, aspect=aspect, avtemp=1)
        kayit = d['outputs']['monthly']
        # H(i)_m: kWh/m² ay  ->  ortalama şiddet W/m²
        aylik_kwh = aylik_ortalama(kayit, 'H(i)_m')
        sonuc['isinim'][yon] = [
            aylik_kwh[i] * 1000.0 / (M.GUN[AYLAR[i]] * 24.0) for i in range(12)]
        if sonuc['sicaklik'] is None:
            sonuc['sicaklik'] = aylik_ortalama(kayit, 'T2m')
        time.sleep(0.35)
    return sonuc


def rmse(a, b):
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)) / len(a))


def calistir():
    sic_ts = M.oku('girdi_bolge_sicakliklari.csv')
    bolgeler = M.oku('girdi_bolgeler.csv')

    print('PVGIS verisi çekiliyor (20 il × 4 yön)...')
    veri = {}
    for ad, (lat, lon) in ILLER.items():
        try:
            veri[ad] = il_verisi(ad, lat, lon)
            print(f'  {ad:<12} tamam')
        except Exception as e:
            print(f'  {ad:<12} HATA: {e}')

    print('\nTemsilci il seçimi (TS 825 aylık sıcaklık profiline en yakın):')
    secim = {}
    for b in bolgeler:
        hedef = [float(sic_ts[i][f"bolge{b['bolge']}"]) for i in range(12)]
        sirali = sorted(((rmse(hedef, v['sicaklik']), ad) for ad, v in veri.items()))
        e, ad = sirali[0]
        secim[b['bolge']] = ad
        digerleri = ', '.join(f'{a} ({r:.1f})' for r, a in sirali[1:3])
        print(f"  {b['bolge']}. {b['ad']:<12} -> {ad:<12} RMSE={e:.2f} °C"
              f"   (izleyenler: {digerleri})")

    with open(os.path.join(BURADA, 'girdi_temsilci_iller.csv'), 'w',
              newline='', encoding='utf-8') as f:
        w = csv.writer(f); w.writerow(['bolge', 'bolge_adi', 'temsilci_il', 'rmse_C'])
        for b in bolgeler:
            hedef = [float(sic_ts[i][f"bolge{b['bolge']}"]) for i in range(12)]
            ad = secim[b['bolge']]
            w.writerow([b['bolge'], b['ad'], ad,
                        f"{rmse(hedef, veri[ad]['sicaklik']):.2f}"])

    with open(os.path.join(BURADA, 'girdi_gunes_isinimi.csv'), 'w',
              newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['bolge', 'temsilci_il', 'yon'] + AYLAR)
        for b in bolgeler:
            ad = secim[b['bolge']]
            for yon in YONLER:
                w.writerow([b['bolge'], ad, yon] +
                           [f"{x:.1f}" for x in veri[ad]['isinim'][yon]])
    print('\ngirdi_temsilci_iller.csv ve girdi_gunes_isinimi.csv yazıldı.')


if __name__ == '__main__':
    calistir()
