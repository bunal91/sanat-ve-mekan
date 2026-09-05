# -*- coding: utf-8 -*-
"""Taranan adaylardan seçilenleri nihai kaynakça biçimine döker."""
import re

SECIM = {
 'A. Biyojenik karbon, geçici depolama ve yaşam sonu': [
   'Accounting for the climate benefit of temporary',
   'Embodied GHG Emissions of Wooden',
   'Balancing the green carbon cycle',
   'Time dynamic climate impact',
   'Evaluating the end-of-life modelling for circul',
   'Carbon Footprint Variability in Engin'],
 'B. Tarımsal atık ve bitkisel esaslı yalıtım malzemeleri': [
   'Binderless Thermal Insulation Panel',
   'Bio-Waste Thermal Insulation Panel',
   'Thermal insulation material produced f',
   'Revalorization of sunflower stalk pith',
   'Composite Materials of Rice Husk and Reed',
   'Investiga',
   'A Comparative Inv',
   'Temperature and moisture storage in'],
 'C. Türkiye bağlamı ve TS 825 uygulamaları': [
   'Konutlarda ısıtma ve soğutma yükleri altında optimum',
   'Bina Zarfının Renk Koyuluğunun',
   'K En Yakın Komşu Algoritması ile Binalarda Ene',
   'Binalarda Enerji Verimliliğinde Son Gelişmeler',
   'Bitlis İlinde Farklı Yakıtlar Ve Duvar Bileşenleri',
   'Mevcut Binalarda Enerji Verimli Yenileme'],
 'D. Ağırlıklandırma yöntemleri ve duyarlılığı': [
   'Determination of ',
   'Identifying the Most Efficient Natural Fibre',
   'Integration of objective weighting methods',
   'A Hybrid Multi-Criteria Decision-Making Approach Based on ANP-Entropy',
   'Simulation-Based Evaluation of Criteria Rank-Weighting',
   'A Novel Multi-Criteria Decision-Making Model for Building Material Supplie'],
 'E. Miselyum esaslı kompozitler': [
   'Material Function of Mycelium-Based Bio-Composite',
   'Mycelium-Based Composite Graded Materials',
   'Thermal and So',
   'Effect of fungal species on thermal conductiv',
   'Comparing substrates for mycelium-based com',
   'PRODUCTION OF MYCELIUM-BASED COMPOSITE MATERIALS'],
 'F. Yapı malzemesi seçiminde çok ölçütlü karar verme': [
   'A multi-criteria decision-making method for t',
   'Material Selection in Green Design',
   'A New Multi-Criteria Assessment Model Combining GRA',
   'Criteria in Building Material Selection'],
 'G. Gömülü karbon ve çevresel ürün beyanları': [
   'Sustainability of Bui',
   'Product Environmental Footprint (PEF',
   'Environmental product declarat',
   'Sensitivity analysis of the impact of'],
 'H. Aylık yöntem, ısıl kütle ve doğrulama': [
   'On the limits of the quasi-steady-state method',
   'Evaluation of the Reference Numerical Parameters of the Mon',
   'Thermal m',
   'Influence of sunspaces on the heating demand'],
}

ham = open('kaynaklar_taranan.md', encoding='utf-8').read()
satirlar = [l for l in ham.split('\n') if l.startswith('- ')]

out, kullanilan, bulunamayan = [], set(), []
for baslik, parcalar in SECIM.items():
    grup = []
    for p in parcalar:
        eslesen = [l for l in satirlar if p in l and l not in kullanilan]
        if eslesen:
            grup.append(eslesen[0]); kullanilan.add(eslesen[0])
        else:
            bulunamayan.append((baslik, p))
    out.append((baslik, grup))

with open('kaynakca_secilen.md', 'w', encoding='utf-8') as f:
    n = 0
    for baslik, grup in out:
        f.write(f'### {baslik}\n\n')
        for l in grup:
            n += 1
            f.write(re.sub(r'\s+·atıf: \d+$', '', l) + '\n')
        f.write('\n')
    f.write(f'\n<!-- seçilen: {n} -->\n')
print(f'seçilen: {sum(len(g) for _, g in out)}')
if bulunamayan:
    print('eşleşmeyen:')
    for b, p in bulunamayan:
        print(f'  {b[:20]} :: {p[:45]}')
