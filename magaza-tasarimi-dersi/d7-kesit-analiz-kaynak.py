# -*- coding: utf-8 -*-
exec(open('ciz-ortak.py').read())
from PIL import Image, ImageDraw
S=1.5
fx=lambda m:(383.08+m*73.77)*S
fy=lambda L:(1467.96-(L-1.0)*73.77)*S
src=Image.open('yeni/kesit-r.png').convert('RGB')
LX,RX,TL,BL = 14.2, 34.6, 12.7, 0.25
cx0,cy0=int(fx(LX)),int(fy(TL)); cw,ch=int(fx(RX)-fx(LX)),int(fy(BL)-fy(TL))
TOP,BOT,SIDE=270,470,50
W,H=cw+2*SIDE, ch+TOP+BOT
im=Image.new('RGB',(W,H),PAPER); im.paste(src.crop((cx0,cy0,cx0+cw,cy0+ch)),(SIDE,TOP))
X=lambda m: SIDE+(fx(m)-fx(LX)); Y=lambda L: TOP+(fy(L)-fy(TL))

DECK_T, DECK_B = 6.55, 5.75
MEZ_W, MEZ_E = 16.0, 27.2          # kesit koordinati (plan x + 16)
prof={16:10.68,18:10.38,20:10.07,22:9.77,24:9.41,26:9.00,28:8.58,30:8.17,32:7.76}
def soffit(x):
    ks=sorted(prof); 
    for i in range(len(ks)-1):
        if ks[i]<=x<=ks[i+1]:
            t=(x-ks[i])/(ks[i+1]-ks[i]); return prof[ks[i]]+(prof[ks[i+1]]-prof[ks[i]])*t
    return prof[ks[-1]]

# --- asma katin kurulabilecegi hacim (yesil) / kurulamayacak (mavi)
im=zone(im,[(X(MEZ_W),Y(soffit(MEZ_W))),(X(MEZ_E),Y(soffit(MEZ_E))),(X(MEZ_E),Y(DECK_T)),(X(MEZ_W),Y(DECK_T))],ACC,38)
im=zone(im,[(X(MEZ_E),Y(soffit(MEZ_E))),(X(32),Y(soffit(32))),(X(32),Y(DECK_T)),(X(MEZ_E),Y(DECK_T))],BLU,40)
d=ImageDraw.Draw(im)

# --- asma kat dosemesi
d.rectangle([X(MEZ_W),Y(DECK_T),X(MEZ_E),Y(DECK_B)],fill=(58,54,50))
txt(d,(X(16.3),Y(DECK_T)+16),'ASMA KAT DÖŞEMESİ   üst +6.55 / alt +5.75',26,True,WHITE)

# --- bas ustu olculeri
for xm,lab in ((16.6,None),(20,None),(24,None),(27.2,None)):
    s=soffit(xm); h=s-DECK_T
    dim(d,(X(xm),Y(DECK_T)),(X(xm),Y(s)),'%.2f m'%h, ACC if h>=2.2 else BLU, 26)
# alt kat
dim(d,(X(18.4),Y(1.07)),(X(18.4),Y(DECK_B)),'4.68 m',SEC,28)
txt(d,(X(19.2),Y(2.6)),'ZEMİN KAT',34,True,SEC)
txt(d,(X(19.2),Y(2.25)),'kiriş altında 4.68 m · kirişler arasında 5.43 m net',26,False,BODY)

# --- sinir
for t in range(0,40):
    y1=DECK_T+t*0.09; y2=y1+0.05
    if y1>soffit(MEZ_E)+0.2: break
    d.line([(X(MEZ_E),Y(y1)),(X(MEZ_E),Y(y2))],fill=BLU,width=7)
arrow(d,(X(28.9),Y(4.95)),(X(27.45),Y(6.25)),BLU,5,20)
band(d,(X(28.6),Y(4.55)),'  ASMA KAT BURADA BİTER  ',BLU,27,9)
txt(d,(X(28.6),Y(4.55)+52),'vitrinden 11.20 m içeride',25,False,BLU)
txt(d,(X(28.6),Y(4.55)+88),'baş üstü 2.20 m’ye düşer',25,False,BLU)
txt(d,(X(28.6),Y(4.55)+124),'doğusunda asma kat yapılamaz',25,False,BLU)

# --- merdiven (B secenegi) sematik
x_bot,x_top=31.6,21.9
d.line([(X(x_bot),Y(1.07)),(X(x_top),Y(DECK_T))],fill=SEC,width=7)
for i in range(1,32):
    t=i/32.0; xx=x_bot+(x_top-x_bot)*t; yy=1.07+(DECK_T-1.07)*t
    d.line([(X(xx),Y(yy)),(X(xx),Y(yy-0.17))],fill=SEC,width=3)
band(d,(X(24.3),Y(2.55)),'  B MERDİVENİ · 32 RIHT × 17.13 cm  ',SEC,27,9)
txt(d,(X(24.3),Y(2.55)+52),'kesit düzleminin arkasında, kuzey duvarı boyunca',24,False,SEC)

# --- isiklik
txt(d,(X(17.9),Y(9.75)),'IŞIKLIK — artık kullanılabilir hacim',28,True,ACC)
txt(d,(X(17.9),Y(9.40)),'“mahal olarak kullanılamaz” notu kaldırılmış',24,False,BODY)

# --- cati alti kotlari
txt(d,(X(16.9),Y(soffit(16.9)-0.45)),'çatı altı +10.58',25,True,MUT,anchor='lm')

# --- baslik
d.rectangle([0,0,W,8],fill=ACC)
txt(d,(SIDE,46),'ZONE 2 A-A’ KESİTİ · YÜKSELTİLMİŞ ÇATI, ASMA KAT SINIRI VE MERDİVEN',42,True,INK)
txt(d,(SIDE,110),'Bitmiş zemin +1.07 · kiriş 75 cm (alt +5.75 / üst +6.50) · çatı altı vitrinde ≈+10.60, 16 m içeride ≈+7.76',27,False,BODY)
txt(d,(SIDE,150),'+6.50 artık kesikli çizgi: döşeme değil, referans. Üstündeki ışıklık hacmi asma kat için kullanılabilir.',27,False,BODY)
d.line([(SIDE,200),(W-SIDE,200)],fill=HAIR,width=3)

# --- alt metin
by=TOP+ch+36
d.line([(SIDE,by),(W-SIDE,by)],fill=HAIR,width=3)
txt(d,(SIDE,by+24),'Asma kat döşemesi kirişlerin arasına, kiriş yüksekliğinin içine oturtulur: üst kotu +6.55, alt kotu +5.75.',28,True,INK)
L=[ 'Böylece zemin katta kiriş hattında 4.68 m, kirişler arasında 5.43 m net kalır — bir mağaza için fazlasıyla cömert.',
    'Asma katın üstünde ise vitrin hizasında 4.05 m, 8 m içeride 2.86 m, 11.20 m içeride 2.20 m kalır. Bu son nokta sınırdır.',
    'Net 2.40 m isterseniz sınır 10.20 m’ye çekilir. Daha derin bir asma kat istiyorsanız döşemeyi alçaltmak çözüm değildir:',
    'döşemeyi indirince zemin kat yüksekliği gider, üst katta kazandığınız yer yine çatı eğimine takılır.']
for i,s in enumerate(L): txt(d,(SIDE,by+68+i*40),s,26,False,BODY)
txt(d,(SIDE,by+240),'Çatı altı kotları çizimdeki 200+208, 297 ve 128 ölçülerinden türetilmiştir; ±10 cm tolerans kabul edin.',25,False,MUT)
im.save('yeni/D7-kesit-analiz.png'); print('ok',im.size)
