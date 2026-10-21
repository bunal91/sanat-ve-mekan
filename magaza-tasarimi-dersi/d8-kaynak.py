# -*- coding: utf-8 -*-
exec(open('merd-ortak.py').read())
SC=92; PX0=300; PY0=430
W,H=2800,3060
im=Image.new('RGB',(W,H),PAPER)
P=lambda a,b:(PX0+a*SC,PY0+b*SC)
px=lambda a: PX0+a*SC; py=lambda b: PY0+b*SC
ImageDraw.Draw(im).polygon([P(*q) for q in UNIT],fill=FLOORC)

# ---- bolge tonlari ----
im=zone(im,[P(0,0),P(LIM,0),P(LIM,DIAG(LIM)),P(0,21.40)],ACC,30)
im=zone(im,[P(LIM,0),P(16,0),P(16,11.40),P(LIM,DIAG(LIM))],BLU,34)
d=ImageDraw.Draw(im)

# ---- baslangic bantlari ----
BANT=[([(10.05,0.25),(11.39,0.25),(11.39,7.75),(10.05,7.75)],(10.4,4.0),(8.6,4.0),'A',(10.15,0.95)),
      ([(0.25,10.05),(7.75,10.05),(7.75,11.39),(0.25,11.39)],(4.0,10.4),(4.0,8.6),'B',(0.40,10.45)),
      ([(8.25,10.05),(11.19,10.05),(11.19,11.39),(8.25,11.39)],(9.7,10.4),(9.7,8.6),'C',(8.40,10.45)),
      ([(0.25,18.05),(4.88,18.05),(2.74,19.39),(0.25,19.39)],(2.0,18.4),(2.0,16.6),'D',(0.40,18.45)),
      ([(0.25,4.61),(7.75,4.61),(7.75,5.95),(0.25,5.95)],(3.2,5.6),(3.2,7.4),'E',(0.40,5.00))]
for poly,a1,a2,k,lp in BANT:
    pts=[P(*q) for q in poly]
    tile,msk,org=hatchpoly(d,pts,SEC,step=14,w=2); im.paste(tile,org,msk)
d=ImageDraw.Draw(im)

# ---- plan ----
d=plan_base(im,d,P,SC,floor=False)
for k,z in ZONES.items(): dashpoly(d,[P(*q) for q in z],SEC,6,26,16)
for poly,a1,a2,k,lp in BANT:
    dashpoly(d,[P(*q) for q in poly],SEC,3,13,9)
    arrow(d,P(*a1),P(*a2),SEC,7,22)
    txt(d,P(*lp),k,34,True,SEC)

# ---- goz etiketleri ----
for k,z in BAYS.items():
    cx=sum(a for a,b in z)/len(z); cy=sum(b for a,b in z)/len(z)
    txt(d,(px(cx),py(cy)-16),k,60,True,(182,175,166),anchor='mm')
txt(d,(px(4.0),py(4.0)+34),'7.50 × 7.50 net',25,False,(176,169,160),anchor='mm')
txt(d,(px(4.0),py(12.0)+34),'7.50 × 7.50 net',25,False,(176,169,160),anchor='mm')
txt(d,(px(9.05),py(6.9)),'2.94 m',25,False,(176,169,160),anchor='mm')

# ---- asma kat siniri ----
for t in range(0,240):
    y1=t*0.135; y2=y1+0.075
    if y2>DIAG(LIM): break
    d.line([P(LIM,y1),P(LIM,y2)],fill=BLU,width=9)
txt(d,(px(LIM)-16,py(13.4)),'11.19 m',28,True,BLU,anchor='rm')

# ---- olculer ----
dim(d,P(0,-0.95),P(8,-0.95),'8.00',INK,28)
dim(d,P(8,-0.95),P(16,-0.95),'8.00',INK,28)
dim(d,P(0,-1.95),P(16,-1.95),'16.00 m',INK,30)
dim(d,P(-1.0,0),P(-1.0,8),'8.00',INK,28)
dim(d,P(-1.0,8),P(-1.0,16),'8.00',INK,28)
dim(d,P(-1.0,16),P(-1.0,21.40),'5.40',INK,28)
dim(d,P(16.5,0),P(16.5,11.40),'11.40 m',INK,28)
txt(d,(px(-1.9),py(10.7)),'MEYDAN',30,True,MUT,anchor='mm')
txt(d,(px(-2.55),py(2.8)),'cam cephe',24,False,SEC)
txt(d,(px(-2.55),py(3.3)),'çift kapı',24,False,ACC)

# ================= sag kolon =================
RX=1970; RW=780
y=PY0-70
txt(d,(RX,y),'OKUMA',30,True,ACC); y+=56
def sw(y,col,t1,t2,hat=False):
    if hat:
        pts=[(RX,y+6),(RX+34,y+6),(RX+34,y+40),(RX,y+40)]
        tile,msk,org=hatchpoly(d,pts,col,step=9,w=2); im.paste(tile,org,msk)
        dd=ImageDraw.Draw(im); dd.line(pts+[pts[0]],fill=col,width=2); return dd
    d.rectangle([RX,y+6,RX+34,y+40],fill=col); return d
def blok(y,col,t1,lines,hat=False):
    global d
    d=sw(y,col,None,None,hat)
    txt(d,(RX+52,y),t1,28,True,col)
    yy=y+40
    for L in lines:
        txt(d,(RX+52,yy),L,25,False,BODY); yy+=34
    return yy+22
y=blok(y,ACC,'ASMA KAT KURULABİLİR',['x ≤ 11.19 m. Döşeme +6.55, üstünde 2.20 m’den','fazla kalıyor. Trapez alan ≈ 200 m².'])
y=blok(y,BLU,'ASMA KAT KURULAMAZ',['x > 11.19 m. Çatı alçalıyor, baş üstü 2.20 m’nin','altına düşüyor. 11.19 → 16.00 arası ≈ 76 m².','Zemin katta serbest yükseklik: merdiven için','en elverişli bölge burası.'])
y=blok(y,SEC,'DÖŞEME BOŞLUĞU AÇILABİLEN GÖZLER',['Boşluk bir kirişi kesemez; tek gözün içinde','kalmak zorunda. Beş göz: B1 (7.50×7.50),','B2 batı şeridi (2.94×7.50), B3 (7.50×7.50),','B4 batı şeridi, B5 üçgen.'])
y=blok(y,SEC,'DÜZ KOL BAŞLANGIÇ BANTLARI  A–E',['Düz kollu merdiven 9.80 m uzunluğunda, bir göz','ise net 7.50 m: düz kol tek göze sığmaz, mutlaka','bir kiriş aksını keser. Bunu ilk 14 rıht içinde','yapabilmesi için İLK RIHTIN kiriş aksına uzaklığı','2.05 – 3.39 m olmalı. Oklar tırmanma yönüdür.'],hat=True)
y=blok(y,(140,133,124),'KİRİŞ AKSLARI',['x = 0 / 8 / 16 · y = 0 / 8 / 16. y=16 aksı','x=8.64’te diyagonal duvara saplanıyor.','50/75 cm · alt kot +5.75 · üst kot +6.50.'],hat=True)
y+=10
d.line([(RX,y),(RX+RW,y)],fill=HAIR,width=3); y+=26
txt(d,(RX,y),'ÜÇ KURAL',30,True,INK); y+=50
for i,(a,b) in enumerate([('1','Merdivenin ilk 14 rıhtı döşemenin veya kirişin\naltında kalabilir. 15. rıhttan sonrası mutlaka\ndöşeme boşluğunun içinde olmak zorunda.'),
                          ('2','Döşeme boşluğu bir kirişi kesemez:\ntek bir ızgara gözünün içinde kalmalı.'),
                          ('3','Merdivenin asma kata vardığı nokta\nx ≤ 11.19 m olmalı.')]):
    d.ellipse([RX,y+2,RX+34,y+36],fill=ACC)
    txt(d,(RX+17,y+19),a,24,True,PAPER,anchor='mm')
    for j,L in enumerate(b.split('\n')): txt(d,(RX+52,y+j*33),L,25,False,INK)
    y+=33*len(b.split('\n'))+24

# ================= baslik =================
d.rectangle([0,0,W,9],fill=ACC)
txt(d,(PX0-20,48),'D8 · IZGARA SİSTEMİ — MERDİVEN VE DÖŞEME BOŞLUĞU NEREYE KONABİLİR',44,True,INK)
txt(d,(PX0-20,116),'Bütün kolonların kirişlerle birleştiği tam bir 8.00 × 8.00 m ızgara kabul edilmiştir. Kiriş 50/75 cm, alt kotu +5.75, üst kotu +6.50.',27,False,BODY)
txt(d,(PX0-20,156),'Bitmiş zemin +1.07 · asma kat döşemesi kirişin içine oturur, üst kot +6.55 · kat yüksekliği 5.48 m · 32 rıht × 17.13 cm, basamak 28 cm (2h+b = 62).',27,False,BODY)
d.line([(PX0-20,200),(W-60,200)],fill=HAIR,width=3)

# ================= alt =================
by=PY0+21.40*SC+180
d.line([(PX0-20,by),(W-60,by)],fill=HAIR,width=3)
txt(d,(PX0-20,by+24),'NEDEN 14 RIHT?',30,True,ACC)
L=['Döşemenin ve kirişlerin altı +5.75. Merdivende gerekli baş üstü yüksekliği 2.20 m. Demek ki merdiven, döşemenin altından geçerken basamak kotu en çok',
   '+3.55 olabilir. 14. rıhtın kotu +3.47 → baş üstü 2.28 m, geçer. 15. rıhtın kotu +3.64 → baş üstü 2.11 m, geçmez.',
   'Yani merdivenin ilk 3.64 metresi (13 basamak) döşemenin altında kalabilir; ondan sonrası ya döşeme boşluğunda ya da asma katın hiç olmadığı bölgede olmalı.']
for i,s in enumerate(L): txt(d,(PX0-20,by+70+i*40),s,27,False,BODY if i else INK)
txt(d,(PX0-20,by+206),'Ölçüler PLAN.pdf ve kesit.pdf’ten okunmuştur. Kiriş aksları kolon düzeninden türetilmiş OLASI konumlardır; kalıp planından doğrulanmalıdır.',25,False,MUT)
im.save('yeni/D8-izgara-merdiven.png')
im.resize((W//2,H//2)).save('yeni/_d8prev.png'); print('ok',im.size)
