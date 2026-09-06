# -*- coding: utf-8 -*-
"""Yer tutucu atıf anahtarlarını GAZİ MMFD biçiminde numaralara çevirir.

Kural: atıflar metinde ilk geçtikleri sırayla numaralanır; kaynakça yalnızca
fiilen atıf verilen kaynakları içerir; toplu atıflarda ardışık numaralar
[1-4] biçiminde kısaltılır (en fazla 4 kaynak).
"""
import json, os, re, sys

BURADA = os.path.dirname(os.path.abspath(__file__))
sicil = json.load(open(os.path.join(BURADA, 'kaynak_sicil.json'), encoding='utf-8'))

kaynak = sys.argv[1] if len(sys.argv) > 1 else '../basvuru/_metin_kaynakli.md'
hedef = sys.argv[2] if len(sys.argv) > 2 else '../basvuru/01-makale-metni.md'
metin = open(os.path.join(BURADA, kaynak), encoding='utf-8').read()

sira, numara = [], {}


def kisalt(nums):
    """Ardışık numaraları [1-4] biçiminde kısaltır."""
    nums = sorted(nums)
    parca, i = [], 0
    while i < len(nums):
        j = i
        while j + 1 < len(nums) and nums[j + 1] == nums[j] + 1:
            j += 1
        parca.append(f'{nums[i]}-{nums[j]}' if j - i >= 2 else
                     ', '.join(str(n) for n in nums[i:j + 1]))
        i = j + 1
    return '[' + ', '.join(parca) + ']'


def degistir(m):
    anahtarlar = [a.strip() for a in m.group(1).split(',')]
    nums = []
    for a in anahtarlar:
        if a not in sicil:
            raise SystemExit(f'HATA: sicilde yok -> {a}')
        if a not in numara:
            sira.append(a); numara[a] = len(sira)
        nums.append(numara[a])
    if len(nums) > 4:
        raise SystemExit(f'HATA: toplu atıf 4 kaynağı aşıyor -> {m.group(1)}')
    return kisalt(nums)


# Anahtarlar büyük harfle başlar; matematik alt indisleriyle karışmaz
cikti = re.sub(r'\{([A-Z][A-Za-z0-9]*(?:\s*,\s*[A-Z][A-Za-z0-9]*)*)\}',
               degistir, metin)

kaynakca = ['\n## 7. KAYNAKLAR (REFERENCES)\n']
for i, a in enumerate(sira, 1):
    kaynakca.append(f'{i}. {sicil[a]}')
cikti = cikti.rstrip() + '\n' + '\n'.join(kaynakca) + '\n'

open(os.path.join(BURADA, hedef), 'w', encoding='utf-8').write(cikti)
son5 = sum(1 for a in sira if re.search(r'\b(202[1-6])\b', sicil[a]))
print(f'atıf verilen kaynak: {len(sira)}')
print(f'son 5 yıl (2021+): {son5}/{len(sira)} = %{son5 / len(sira) * 100:.0f}'
      f'   (dergi kuralı: en az %30)')
