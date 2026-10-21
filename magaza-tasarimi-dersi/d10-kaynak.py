# -*- coding: utf-8 -*-
exec(open('merd-ortak.py').read())
PLUM=(112,74,104)
W,H=2840,2230
im=Image.new('RGB',(W,H),PAPER); d=ImageDraw.Draw(im)
def wrap(s,fnt,w):
    out=[];line=''
    for wd in s.split():
        t=(line+' '+wd).strip()
        if d.textlength(t,font=fnt)<=w: line=t
        else: out.append(line); line=wd
    if line: out.append(line)
    return out

SC=56
TIP=[
 dict(ad='DÜZ KOLLU',alt='sahanlıklı',col=ACC,bb=(1.40,9.80),
      parts=[('F',0,5.60,1.40,9.80,'N'),('L',0,4.20,1.40,5.60),('F',0,0,1.40,4.20,'N')],
      void=[(-0.10,-0.10),(1.50,-0.10),(1.50,6.16),(-0.10,6.16)],
      spec=['yer kaplar  9.80 × 1.40 m = 13.7 m²','döşeme boşluğu  6.16 × 1.60 = 9.9 m²','bir ızgara gözü net 7.50 m olduğu için','TEK GÖZE SIĞMAZ, kiriş kesmek zorunda',
            'En uzun ve en gösterişli tip. Vitrin ya da','sergi merdiveni olarak güçlü; mekânı','boydan boya böler.']),
 dict(ad='U DÖNÜŞLÜ',alt='180° dönüş',col=SEC,bb=(2.90,5.60),
      parts=[('F',0,1.40,1.40,5.60,'N'),('L',0,0,2.90,1.40),('F',1.50,1.40,2.90,5.60,'S')],
      void=[(-0.10,-0.10),(3.00,-0.10),(3.00,5.70),(1.40,5.70),(1.40,0.56),(-0.10,0.56)],
      spec=['yer kaplar  5.60 × 2.90 m = 15.8 m²','döşeme boşluğu  ≈ 12.4 m²','tek gözün içinde kalır, KİRİŞ KESMEZ','varış, başlangıcın hemen yanında',
            'En derli toplu plan, en çok döşeme kaybı.','İkinci kolun tamamı boşlukta kalmak','zorunda.']),
 dict(ad='L DÖNÜŞLÜ',alt='90° dönüş · sahanlıklı',col=BLU,bb=(5.60,5.60),
      parts=[('F',0,1.40,1.40,5.60,'N'),('L',0,0,1.40,1.40),('F',1.40,0,5.60,1.40,'E')],
      void=[(-0.10,-0.10),(5.70,-0.10),(5.70,1.50),(1.50,1.50),(1.50,0.56),(-0.10,0.56)],
      spec=['yer kaplar  5.60 × 5.60 m = 13.7 m²','döşeme boşluğu  ≈ 9.9 m²','tek gözün içinde kalır, KİRİŞ KESMEZ','bir köşeye ya da duvar dönüşüne oturur',
            'Sahanlık doğal bir duraklama ve sergileme','noktası verir. Perakendede en çok','kullanılan tip.']),
 dict(ad='BALANSLI',alt='sahanlıksız · 3 balans basamağı',col=(150,116,52),bb=(5.60,4.76),
      parts=[('F',0,1.40,1.40,4.76,'N'),('F',1.40,0,5.60,1.40,'E')],winder=True,
      void=[(-0.10,-0.10),(5.70,-0.10),(5.70,1.50),(1.50,1.50),(1.50,1.12),(-0.10,1.12)],
      spec=['yer kaplar  5.60 × 4.76 m ≈ 12.5 m²','döşeme boşluğu  ≈ 8 m²','L’den 0.84 m daha kısa, sahanlığı yok','dar uçta en az 10 cm basamak',
            'Yürüme hattında 28 cm korunmalı. Kaçış','hesabında balanslı basamak her zaman','kabul edilmez; yönetmelikten doğrulayın.']),
 dict(ad='HELİSEL',alt='Ø2.60 · göbek Ø0.50',col=PLUM,bb=(2.60,2.60),
      spiral=(1.30,1.30,1.30),parts=[],
      void=[],
      spec=['yer kaplar  Ø2.60 = 5.3 m²','döşeme boşluğu  Ø2.80 = 6.2 m²','16 rıht/tur → 32 rıht = 2 TAM TUR','bir turda 2.74 m yükselir',
            'En küçük yer kaplayan tip. Yalnızca','ikincil/servis merdiveni: müşteri ve kaçış','merdiveni olarak kullanılamaz.'])]

CW=W//5; TOPH=250; PLANH=760
for i,t in enumerate(TIP):
    x0=i*CW+40; y0=TOPH
    bw,bh=t['bb']
    ox=x0+(CW-100-bw*SC)/2+10; oy=y0+90+(PLANH-120-bh*SC)/2
    P=lambda a,b,_x=ox,_y=oy:(_x+a*SC,_y+b*SC)
    col=t['col']
    if t['void']:
        im=zone(im,[P(*q) for q in t['void']],SEC,60); d=ImageDraw.Draw(im)
    if t.get('spiral'):
        cx,cy,r=t['spiral']
        im=zone(im,circ(cx,cy,r+0.10,64) and [P(*q) for q in circ(cx,cy,r+0.10,64)],SEC,60); d=ImageDraw.Draw(im)
    ciz_merdiven(d,P,SC,t,col,lw=4)
    if t.get('winder'):
        for q in [(0,0.467),(0.467,0)]:
            d.line([P(1.40,1.40),P(*q)],fill=col,width=4)
        d.rectangle([P(0,0),P(1.40,1.40)],outline=col,width=4)
    # yon oku + varis
    if t.get('spiral'):
        arrow(d,P(1.30,2.40),P(2.30,2.00),col,6,18)
    else:
        sa={0:((0.70,10.55),(0.70,9.95)),1:((0.70,6.35),(0.70,5.75)),2:((0.70,6.35),(0.70,5.75)),3:((0.70,5.51),(0.70,4.91))}[i]
        arrow(d,P(*sa[0]),P(*sa[1]),col,6,18)
        gx,gy=[(0.70,-0.28),(2.20,5.88),(5.88,0.70),(5.88,0.70)][i]
        d.ellipse([P(gx-0.19,gy-0.19),P(gx+0.19,gy+0.19)],fill=col)
    # olcu
    d.line([P(0,bh+0.80),P(bw,bh+0.80)],fill=MUT,width=2)
    txt(d,P(bw/2,bh+1.08),'%.2f m'%bw,24,True,MUT,anchor='mm')
    d.line([P(bw+0.80,0),P(bw+0.80,bh)],fill=MUT,width=2)
    txt(d,(P(bw+0.80,bh/2)[0]+28,P(bw+0.80,bh/2)[1]),'%.2f'%bh,24,True,MUT,anchor='lm')
    # baslik + spec
    bx,by=band(d,(x0,y0),'  %s  '%t['ad'],col,30,9)
    txt(d,(x0,y0+58),t['alt'],24,False,BODY)
    ty=TOPH+PLANH+30
    for j,s in enumerate(t['spec']):
        txt(d,(x0,ty),s,24,True if j<4 else False, INK if j<4 else MUT); ty+= 34 if j<4 else 32
        if j==3: ty+=14
    if i<4: d.line([(x0+CW-60,y0),(x0+CW-60,ty)],fill=HAIR,width=2)

# ================= KESIT PANELI =================
SY=TOPH+PLANH+330
d.line([(40,SY-46),(W-40,SY-46)],fill=HAIR,width=3)
txt(d,(40,SY-22),'KESİT — 14 RIHT KURALI',34,True,ACC)
KS=108; KX=215; KY=SY+40+(6.55-1.00)*KS
fx=lambda m: KX+m*KS
fy=lambda k: KY-(k-1.00)*KS
def slab(a,b):
    pts=[(fx(a),fy(6.55)),(fx(b),fy(6.55)),(fx(b),fy(5.75)),(fx(a),fy(5.75))]
    tile,msk,org=hatchpoly(d,pts,(150,143,134),step=13,w=2); im.paste(tile,org,msk)
    dd=ImageDraw.Draw(im); dd.line(pts+[pts[0]],fill=(84,80,74),width=3); return dd
d=slab(-1.3,3.64); d=slab(9.80,11.1)
d.line([(fx(-1.3),fy(1.07)),(fx(11.1),fy(1.07))],fill=INK,width=5)
def step(k):
    if k<=15: x0=(k-1)*GO
    else: x0=5.60+(k-17)*GO
    L=FL+k*RISE
    d.line([(fx(x0),fy(L)),(fx(x0+GO),fy(L))],fill=ACC,width=5)
    d.line([(fx(x0),fy(L)),(fx(x0),fy(L-RISE))],fill=ACC,width=5)
for k in list(range(1,16))+list(range(17,33)): step(k)
d.line([(fx(4.20),fy(3.81)),(fx(5.60),fy(3.81))],fill=ACC,width=6)
d.line([(fx(4.20),fy(3.81)),(fx(4.20),fy(3.639))],fill=ACC,width=5)
d.line([(fx(5.60),fy(3.98)),(fx(5.60),fy(3.81))],fill=ACC,width=5)
txt(d,(fx(4.90),fy(3.81)+14),'sahanlık 1.40',22,False,BODY,anchor='mt')
dash(d,(fx(3.64),fy(6.95)),(fx(3.64),fy(2.6)),SEC,4,16,11)
txt(d,(fx(3.78),fy(7.30)),'DÖŞEME BOŞLUĞUNUN KENARI',26,True,SEC)
txt(d,(fx(3.78),fy(7.30)+34),'ilk rıhttan 3.64 m sonra · 14. rıhtın ucunda',24,False,BODY)
dim(d,(fx(3.30),fy(3.468)),(fx(3.30),fy(5.75)),'2.28 m',SEC,26)
d.ellipse([fx(3.92)-11,fy(3.639)-11,fx(3.92)+11,fy(3.639)+11],fill=BLU)
arrow(d,(fx(5.70),fy(5.55)),(fx(4.05),fy(3.74)),BLU,4,16)
txt(d,(fx(5.80),fy(5.65)),'15. rıht  +3.64',25,True,BLU)
txt(d,(fx(5.80),fy(5.65)+34),'baş üstü 2.11 m — geçmez',24,False,BLU)
txt(d,(fx(-1.25),fy(2.45)),'ilk 14 rıht döşemenin altında kalabilir',25,True,SEC)
for (lv,lab,c) in [(1.07,'+1.07  zemin',INK),(5.75,'+5.75  kiriş altı',BLU),(6.55,'+6.55  asma kat',ACC)]:
    dash(d,(fx(-1.3),fy(lv)),(fx(11.1),fy(lv)),(196,189,181),2,14,10)
    txt(d,(fx(11.2),fy(lv)),lab,25,True,c,anchor='lm')
dim(d,(fx(-0.75),fy(1.07)),(fx(-0.75),fy(6.55)),'5.48',INK,26)
txt(d,(fx(9.25),fy(6.55)-46),'varış',24,True,ACC)
TX=1780; ty=SY+30
for s,b in [('Kat yüksekliği 5.48 m → 32 rıht × 17.13 cm, basamak 28 cm.',True),
            ('2h + b = 62.2 cm (kabul aralığı 61–65 cm).',False),('',False),
            ('Döşemenin ve kirişlerin altı +5.75. Merdivende gerekli baş üstü',False),
            ('yüksekliği 2.20 m. Demek ki basamak kotu, döşemenin veya',False),
            ('kirişin altından geçerken en çok +3.55 olabilir.',False),('',False),
            ('14. rıht   +3.47   →   baş üstü 2.28 m   geçer',True),
            ('15. rıht   +3.64   →   baş üstü 2.11 m   geçmez',True),('',False),
            ('Aynı kural kirişler için de geçerli: merdiven bir kiriş aksını',False),
            ('ancak ilk 14 rıhtı içinde kesebilir. Kirişe gelene kadar en',False),
            ('çok 3.64 m yatay yol vardır.',False),('',False),
            ('Bir kolda en çok 16 rıht, arada 1.40 m sahanlık. Kol genişliği',False),
            ('en az 1.20 m; perakende için 1.40–1.60 m önerilir. Korkuluk',False),
            ('yüksekliği 1.10 m, asma kat kenarında da aynı.',False)]:
    if s: txt(d,(TX,ty),s,26,b,INK if b else BODY)
    ty+=38

# ================= baslik =================
d.rectangle([0,0,W,9],fill=ACC)
txt(d,(40,48),'D10 · MERDİVEN TİPLERİ — HEPSİ AYNI ÖLÇEKTE, HEPSİ 32 RIHT',44,True,INK)
txt(d,(40,116),'Kat yüksekliği +1.07 → +6.55 = 5.48 m. Her tipte 32 rıht × 17.13 cm, basamak 28 cm, kol genişliği 1.40 m. Yeşil taralı alan: asma kat döşemesinde açılması gereken boşluk.',27,False,BODY)
txt(d,(40,156),'Seçim üç şeye bakar: zeminde ne kadar yer kaplıyor · asma kattan ne kadar döşeme götürüyor · bir ızgara gözüne sığıyor mu. Ok = çıkış yönü, dolu daire = asma kata varış.',27,False,BODY)
d.line([(40,200),(W-40,200)],fill=HAIR,width=3)
txt(d,(40,H-90),'Rıht/basamak ve baş üstü değerleri Planlı Alanlar İmar Yönetmeliği ve yangın yönetmeliğinden öğrenci tarafından ayrıca doğrulanmalıdır. Helisel ve balanslı merdivenler kaçış yolu olarak her durumda kabul edilmez.',25,False,MUT)
im.save('yeni/D10-merdiven-tipleri.png')
im.resize((W//2,H//2)).save('yeni/_d10prev.png'); print('ok',im.size)
