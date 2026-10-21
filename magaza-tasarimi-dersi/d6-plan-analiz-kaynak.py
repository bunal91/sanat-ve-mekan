# -*- coding: utf-8 -*-
exec(open('ciz-ortak.py').read())
from PIL import Image, ImageDraw

S=1.5
PXL=0.60330*S                 # px per cm
M1=PXL*100                    # px per metre
OX=1902.2*S; OY=583.0*S
X=lambda m: OX+m*M1
Y=lambda m: OY+m*M1

src=Image.open('yeni/plan-r.png').convert('RGB')
# kirpma penceresi (metre)
LX,RX,TY,BY = -4.6, 18.6, -2.6, 23.4
cx0,cy0 = int(X(LX)), int(Y(TY))
cw,ch   = int(X(RX)-X(LX)), int(Y(BY)-Y(TY))
plan = src.crop((cx0,cy0,cx0+cw,cy0+ch))

TOP, BOT, SIDE = 300, 560, 50
W,H = cw+2*SIDE, ch+TOP+BOT
im = Image.new('RGB',(W,H),PAPER)
im.paste(plan,(SIDE,TOP))
# yerel koordinat
px=lambda m: SIDE + (X(m)-X(LX))
py=lambda m: TOP  + (Y(m)-Y(TY))

# ---------------- bolgeler ----------------
DIAG=lambda x: 11.40 + (16.0-x)*0.625      # diyagonal duvar: y(x)
LIM=11.19                                   # asma kat sinir (net 2.20)
# asma kat olabilir
im = zone(im,[(px(0),py(0)),(px(LIM),py(0)),(px(LIM),py(DIAG(LIM))),(px(0),py(DIAG(0)))],ACC,40)
# asma kat olamaz
im = zone(im,[(px(LIM),py(0)),(px(16),py(0)),(px(16),py(11.40)),(px(LIM),py(DIAG(LIM)))],BLU,42)
d=ImageDraw.Draw(im)

# ---------------- kiris akslari ----------------
BW=0.50   # kiris genisligi (m)
beams=[]
for xg in (0,8,16):   beams.append([(xg-BW/2,-0.25),(xg+BW/2,-0.25),(xg+BW/2,DIAG(xg)),(xg-BW/2,DIAG(xg))])
for yg in (0,8):      beams.append([(-0.25,yg-BW/2),(16.25,yg-BW/2),(16.25,yg+BW/2),(-0.25,yg+BW/2)])
# y=16 kirisi sadece diyagonale kadar
xd16 = 16.0-(16.0-11.40)/0.625
beams.append([(-0.25,16-BW/2),(xd16,16-BW/2),(xd16,16+BW/2),(-0.25,16+BW/2)])
for b in beams:
    pts=[(px(a),py(c)) for a,c in b]
    tile,msk,org = hatchpoly(d,pts,GREY,step=13,w=2)
    im.paste(tile,org,msk)
d=ImageDraw.Draw(im)
for b in beams:
    pts=[(px(a),py(c)) for a,c in b]
    d.polygon(pts,outline=(90,86,80))
    d.line(pts+[pts[0]],fill=(90,86,80),width=3)

# ---------------- kolonlar ----------------
for (a,c) in [(0,0),(8,0),(16,0),(0,8),(8,8),(16,8),(0,16)]:
    d.rectangle([px(a-0.25),py(c-0.25),px(a+0.25),py(c+0.25)],fill=INK)
for (a,c) in [(16.02,11.49),(8.17,16.39)]:
    d.rectangle([px(a-0.345),py(c-0.345),px(a+0.345),py(c+0.345)],fill=INK)

# ---------------- cepheler ----------------
d.line([(px(-0.08),py(0.28)),(px(-0.08),py(7.72))],fill=SEC,width=11)
d.line([(px(16.08),py(1.30)),(px(16.08),py(6.70))],fill=SEC,width=11)
for (a,y1,y2,lab) in [(-0.08,3.10,4.90,'çift kanat kapı'),(16.08,3.20,4.80,'çift kanat kapı')]:
    d.line([(px(a),py(y1)),(px(a),py(y2))],fill=ACC,width=16)

# ---------------- sinir cizgisi ----------------
for t in range(0,int((DIAG(LIM))*8)):
    y1=t/8.0; y2=y1+0.07
    if y2>DIAG(LIM): break
    d.line([(px(LIM),py(y1)),(px(LIM),py(y2))],fill=BLU,width=7)

# ---------------- etiketler ----------------
txt(d,(px(2.2),py(5.6)),'ASMA KAT',40,True,ACC)
txt(d,(px(2.2),py(6.3)),'BURAYA KURULABİLİR',30,True,ACC)
txt(d,(px(2.2),py(7.0)),'döşeme +6.55 · üstünde 2.20 m’den fazla',24,False,BODY)
txt(d,(px(11.9),py(5.1)),'ASMA KAT',34,True,BLU)
txt(d,(px(11.9),py(5.7)),'OLMAZ',34,True,BLU)
txt(d,(px(11.9),py(6.35)),'çatı alçalıyor',24,False,BLU)
txt(d,(px(11.9),py(6.8)),'baş üstü < 2.20 m',24,False,BLU)
txt(d,(px(LIM+0.15),py(2.55)),'11.19 m',26,True,BLU)

txt(d,(px(-4.3),py(13.0)),'MEYDAN',40,True,MUT)
txt(d,(px(-4.3),py(13.7)),'üstü örtülü',26,False,MUT)
arrow(d,(px(-1.6),py(4.0)),(px(-0.5),py(4.0)),SEC,6,20)
txt(d,(px(-4.4),py(3.2)),'MEYDAN CEPHESİ',26,True,SEC)
txt(d,(px(-4.4),py(3.65)),'cam · çift kapı',24,False,BODY)
txt(d,(px(16.5),py(2.6)),'DOĞU CEPHESİ',26,True,SEC)
txt(d,(px(16.5),py(3.05)),'545/350 cam birim',24,False,BODY)
txt(d,(px(16.5),py(3.5)),'çift kanat kapı',24,False,BODY)

# kiris etiketi
txt(d,(px(8.25),py(19.6)),'KİRİŞ AKSI',26,True,(70,66,60))
txt(d,(px(8.25),py(20.1)),'8.00 × 8.00 m · 50/75 cm',24,False,BODY)
txt(d,(px(8.25),py(20.6)),'alt kot +5.75 · üst kot +6.50',24,False,BODY)
arrow(d,(px(8.9),py(19.4)),(px(8.1),py(17.6)),(70,66,60),5,18)

# olculer
dim(d,(px(0),py(-1.05)),(px(16),py(-1.05)),'16.00 m',INK,30)
dim(d,(px(17.9),py(0)),(px(17.9),py(11.40)),'11.40 m',INK,30)
dim(d,(px(-2.1),py(0)),(px(-2.1),py(21.40)),'21.40 m',INK,30)
dim(d,(px(0),py(22.6)),(px(8),py(22.6)),'8.00',INK,28)
dim(d,(px(8),py(22.6)),(px(16),py(22.6)),'8.00',INK,28)

# ---------------- baslik ----------------
d.rectangle([0,0,W,8],fill=ACC)
txt(d,(SIDE,48),'D6 · D BLOK ZEMİN KAT — KİRİŞ AKSLARI VE ASMA KAT SINIRI',42,True,INK)
txt(d,(SIDE,112),'Ölçüler çizimden okunmuştur. Kolon aksı 8.00 × 8.00 m · kolon 50/50 · bitmiş zemin +1.07 · kiriş altı +5.75 · kiriş üstü +6.50',27,False,BODY)
txt(d,(SIDE,172),'Asma kat döşemesi +6.55 kabul edilmiştir (kiriş yüksekliği içine oturtulmuş döşeme).',27,False,BODY)
d.line([(SIDE,200),(W-SIDE,200)],fill=HAIR,width=3)

# ---------------- alt aciklama ----------------
by=TOP+ch+40
d.line([(SIDE,by),(W-SIDE,by)],fill=HAIR,width=3)
rows=[
 (ACC,'1','Asma kat x ≤ 11.19 m bandında kurulabilir: döşeme +6.55, üstünde 2.20 m’den fazla kalır. Trapez alan ≈ 200 m².'),
 (BLU,'2','x > 11.19 m’de çatı alçalır, baş üstü 2.20 m’nin altına düşer. Bu bölge zemin katta serbest yükseklikte kalır.'),
 (SEC,'3','Merdiven konumları, merdiven tipleri ve döşeme boşluğu kuralları için D8, D9 ve D10 paftalarına bakınız.'),
]
for i,(col,k,s) in enumerate(rows):
    y=by+28+i*52
    d.rectangle([SIDE,y+6,SIDE+26,y+32],fill=col)
    txt(d,(SIDE+40,y),k,30,True,col); txt(d,(SIDE+76,y),s,26,False,BODY)
y=by+28+3*52+22
txt(d,(SIDE,y),'Kat yüksekliği +1.07 → +6.55 = 548 cm.  32 rıht × 17.13 cm, 28 cm basamak (2h+b = 62).  Bir kolda en çok 16 rıht.',28,True,INK)
txt(d,(SIDE,y+46),'Merdiven asma katın veya bir kirişin altından geçiyorsa: alt kot +5.75, üstünde 2.20 m gerekli → basamak kotu en çok +3.55. Yani ilk 14 rıht (ilk 3.64 m)',26,False,BODY)
txt(d,(SIDE,y+84),'altta kalabilir; 15. rıhttan sonrası ya galeri boşluğunda ya da asma katın hiç kurulmadığı bölgede olmak zorunda.',26,False,BODY)
txt(d,(SIDE,y+136),'Kiriş aksları kolon düzeninden çıkarılmış OLASI konumlardır; kesit yalnızca cephe akslarındaki 75 cm’lik kirişi kanıtlar. Kalıp planından doğrulanmalıdır.',25,False,MUT)

im.save('yeni/D6-plan-analiz.png')
print('ok',im.size)
