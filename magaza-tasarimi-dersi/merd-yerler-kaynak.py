# -*- coding: utf-8 -*-
# 10 dogrulanmis merdiven konumu
PL=[]
def A(**k): PL.append(k)

A(id='M1',tip='DÜZ KOLLU',alt='sahanlıklı, 16+16 rıht',bolge='kuzey duvar · B2 → B1',
  parts=[('F',11.00,0.30,6.80,1.70,'W'),('L',6.80,0.30,5.40,1.70),('F',5.40,0.30,1.20,1.70,'W')],
  void=[(7.36,0.25),(1.05,0.25),(1.05,1.85),(7.36,1.85)],
  gel=(1.20,1.00),yon='W',
  aciklama='Kuzey sağır duvar boyunca; vitrin ve meydan cephesi serbest kalır.')

A(id='M2',tip='DÜZ KOLLU',alt='sahanlıklı, 16+16 rıht',bolge='B3 → B1 · x=8 kirişinin batısı',
  parts=[('F',6.15,11.00,7.55,6.80,'N'),('L',6.15,6.80,7.55,5.40),('F',6.15,5.40,7.55,1.20,'N')],
  void=[(6.00,7.36),(7.70,7.36),(7.70,1.05),(6.00,1.05)],
  gel=(6.85,1.20),yon='N',
  aciklama='Arkadan öne tırmanır; müşteri merdiveni görerek ilerler.')

A(id='M3',tip='DÜZ KOLLU',alt='sahanlıklı, 16+16 rıht',bolge='B4 → B2 batı şeridi',
  parts=[('F',8.50,11.00,9.90,6.80,'N'),('L',8.50,6.80,9.90,5.40),('F',8.50,5.40,9.90,1.20,'N')],
  void=[(8.35,7.36),(10.05,7.36),(10.05,1.05),(8.35,1.05)],
  gel=(9.20,1.20),yon='N',
  aciklama='Asma katın doğu kenarı şeridinde. B1 bütünüyle boş kalır.')

A(id='M4',tip='U DÖNÜŞLÜ',alt='2×16 rıht · 1.40 m sahanlık',bolge='B1 içinde',
  parts=[('F',1.00,2.00,2.40,6.20,'S'),('L',1.00,6.20,3.90,7.60),('F',2.50,6.20,3.90,2.00,'N')],
  void=[(0.90,5.64),(2.40,5.64),(2.40,1.90),(4.00,1.90),(4.00,7.70),(0.90,7.70)],
  gel=(3.20,2.00),yon='N',
  aciklama='Hiçbir kirişi kesmez: tek göz içinde kalır. Döşeme kaybı en yüksek.')

A(id='M5',tip='U DÖNÜŞLÜ',alt='2×16 rıht · kenar çentiği',bolge='alçak çatı bölgesi (x>11.19)',
  parts=[('F',8.40,4.60,12.60,6.00,'E'),('L',12.60,4.60,14.00,7.50),('F',8.40,6.10,12.60,7.50,'W')],
  void=[(8.30,6.00),(11.19,6.00),(11.19,7.60),(8.30,7.60)],
  gel=(8.40,6.80),yon='W',
  aciklama='Asma kat kurulamayan alçak bölgeyi kullanır; döşemeden yalnızca kenar çentiği alınır.')

A(id='M6',tip='L DÖNÜŞLÜ',alt='16+16 rıht · 1.40×1.40 sahanlık',bolge='B1 kuzeybatı',
  parts=[('F',7.30,0.30,3.10,1.70,'W'),('L',1.70,0.30,3.10,1.70),('F',1.70,1.70,3.10,5.90,'S')],
  void=[(3.66,0.25),(1.60,0.25),(1.60,6.00),(3.20,6.00),(3.20,1.80),(3.66,1.80)],
  gel=(2.40,5.90),yon='S',
  aciklama='Kiriş kesmez. Vitrin cephesini serbest bırakır, üst kat “keşfedilen” kat olur.')

A(id='M7',tip='U DÖNÜŞLÜ',alt='2×16 rıht',bolge='B3 · arka hacim',
  parts=[('F',1.50,9.00,2.90,13.20,'S'),('L',1.50,13.20,4.40,14.60),('F',3.00,13.20,4.40,9.00,'N')],
  void=[(1.40,12.64),(2.90,12.64),(2.90,8.90),(4.50,8.90),(4.50,14.70),(1.40,14.70)],
  gel=(3.70,9.00),yon='N',
  aciklama='Satış hacmini hiç kullanmaz; üst kat depo/ofis kurgusuna uygun.')

A(id='M8',tip='HELİSEL Ø2.60',alt='göbek Ø0.50 · 16 rıht/tur · 2 tam tur',bolge='B5 · güneybatı üçgen',
  spiral=(2.00,18.00,1.30),
  parts=[],
  void='SP',
  gel=(2.00,18.00),yon='-',
  aciklama='Yalnızca ikincil/servis merdiveni. En küçük döşeme boşluğu (Ø2.80).')

A(id='M9',tip='DÜZ KOLLU',alt='sahanlıklı, 16+16 rıht',bolge='B5 → B3 · servis',
  parts=[('F',1.70,18.60,3.10,14.40,'N'),('L',1.70,13.00,3.10,14.40),('F',1.70,8.80,3.10,13.00,'N')],
  void=[(1.55,14.96),(3.25,14.96),(3.25,8.65),(1.55,8.65)],
  gel=(2.40,8.80),yon='N',
  aciklama='Arka üçgenden başlar; satış hacmini hiç kullanmaz.')

A(id='M10',tip='L DÖNÜŞLÜ',alt='16+16 rıht · kenar çentiği',bolge='alçak çatı bölgesi (x>11.19)',
  parts=[('F',12.60,3.40,14.00,7.60,'N'),('L',12.60,2.00,14.00,3.40),('F',8.40,2.00,12.60,3.40,'W')],
  void=[(8.30,1.90),(11.19,1.90),(11.19,3.50),(8.30,3.50)],
  gel=(8.40,2.70),yon='W',
  aciklama='Alçak bölgede tırmanır, asma kata doğu kenarından girer. Döşeme kaybı 4.6 m².')
