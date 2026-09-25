# -*- coding: utf-8 -*-
"""D5-brief-secenekleri.png — asma kat icin uc kabuk secenegi, boyuna kesit.
Kotlar kesitten olculdu (aks araligi 680 px = 800 cm -> 0.85 px/cm):
  bitmis zemin +1.07 · kiris alti +5.75 · kiris ustu +6.50 · kiris 75 cm
  cati altyuzu: cephede ~+9.6, dogu ucunda ~+6.4 (egim ~%17)
Butun yukseklikler BITMIS ZEMIN (+1.07) ustunden metre olarak verilmistir."""
from PIL import Image, ImageDraw, ImageFont

FR="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(sz,b=False): return ImageFont.truetype(FB if b else FR, sz)

PAPER=(247,244,239); INK=(34,34,32); BODY=(74,66,62); MUT=(122,106,98)
HAIR=(214,204,195); LIGHT=(237,229,222); ACC=(168,92,67); ACCD=(126,66,48)
SEC=(63,107,99); SECT=(221,231,228); WHITE=(255,255,255); GREY=(150,140,132)
DARK=(60,54,50)

W,H = 2040, 2520
im = Image.new("RGB",(W,H),PAPER); d = ImageDraw.Draw(im)

S = 60.0                     # 1 m = 60 px (yatay ve dusey ayni)
X0 = 470                     # cephe duzlemi
DEPTH = 20.0                 # gosterilen derinlik (m)
def X(m): return int(round(X0 + m*S))
ROOF0, SLOPE = 8.55, 0.169   # cati altyuzu: cephede 8.55 m, %16.9 egimle iniyor
def roof(m): return ROOF0 - SLOPE*m

def txt(x,y,s,sz=26,b=False,c=BODY,anchor=None):
    d.text((x,y),s,font=f(sz,b),fill=c,anchor=anchor)

def band(x,y,s,fill,sz=26,pad=10,tcol=WHITE):
    ft=f(sz,True); bb=d.textbbox((0,0),s,font=ft)
    d.rectangle([x,y,x+bb[2]-bb[0]+pad*2,y+bb[3]-bb[1]+pad*2],fill=fill)
    d.text((x+pad-bb[0],y+pad-bb[1]),s,font=ft,fill=tcol)

def hatch(x0,y0,x1,y1,col,step=18,lw=2,bg=LIGHT):
    w,h = x1-x0, y1-y0
    if w<=0 or h<=0: return
    t=Image.new("RGB",(w,h),bg); td=ImageDraw.Draw(t)
    for k in range(-(h//step)-1, w//step+2):
        td.line([(k*step,0),(k*step+h,h)],fill=col,width=lw)
    im.paste(t,(x0,y0))

def vdim(x,ya,yb,label,col=ACC,sz=23,side=1):
    ya,yb = min(ya,yb), max(ya,yb)
    d.line([(x,ya),(x,yb)],fill=col,width=3)
    for y in (ya,yb): d.line([(x-11,y),(x+11,y)],fill=col,width=3)
    ft=f(sz,True); bb=d.textbbox((0,0),label,font=ft); tw,th=bb[2]-bb[0],bb[3]-bb[1]
    cy=(ya+yb)//2; bx = x+10 if side>0 else x-10-tw-14
    d.rectangle([bx,cy-th//2-7,bx+tw+14,cy+th//2+7],fill=PAPER)
    d.text((bx+7-bb[0],cy-th//2-bb[1]),label,font=ft,fill=col)

# --------------------------------------------------------------- baslik
d.rectangle([0,0,W,6],fill=ACC)
txt(70,66,"05 · BRİF SEÇENEKLERİ",27,True,ACC)
txt(70,112,"Asma kat için kabuk nasıl tanımlanmalı?",54,True,INK)
txt(70,192,"Boyuna kesit, cepheden doğuya 20 m. Bütün yükseklikler bitmiş zeminden (+1.07). Kirişler 8.00 m aksta, 75 cm derinliğinde.",25,False,BODY)
txt(70,228,"Çatı altyüzü paftadan ölçüldü: cephede ≈ +9.6, doğuya doğru ≈ +6.4’e iniyor. Asma kat için asgari 2.20 m net kabul edildi.",25,False,BODY)
d.line([(70,286),(W-70,286)],fill=HAIR,width=3)

OPTS = [
 ("A","MEVCUT KİRİŞ", "kiriş +5.75 / +6.50", SEC, 4.68, 5.43, 5.48),
 ("B","KİRİŞ 50 cm İNDİ", "kiriş +5.25 / +6.00", SEC, 4.18, 4.93, 4.98),
 ("C","KİRİŞ 75 cm İNDİ", "kiriş +5.00 / +5.75", ACC, 3.93, 4.68, 4.73),
]

BY = [900, 1520, 2140]       # her seridin bitmis zemin y'si
for i,(no,ttl,sub,col,soff,btop,deck) in enumerate(OPTS):
    by = BY[i]
    def Y(h): return int(round(by - h*S))
    lim = (ROOF0 - (deck+2.20))/SLOPE
    # --- sol sutun
    band(70, by-510, "  "+no+"   "+ttl+"  ", col, sz=27, pad=8)
    txt(70, by-452, sub, 23, False, MUT)
    txt(70, by-382, "asma kat derinliği", 23, True, INK)
    txt(70, by-344, "≈ %.1f m" % lim, 36, True, ACC)
    txt(70, by-282, "alt kat   %.2f m" % soff, 23, False, BODY)
    txt(70, by-246, "üst kat   %.2f m" % (ROOF0-deck), 23, False, BODY)
    if i == 2:
        txt(70, by-196, "sizin öneriniz", 22, True, ACC)
    # --- isiklik: kiris ustu ile cati altyuzu arasi
    pts=[(X(m), Y(roof(m))) for m in range(0, int(DEPTH)+1)]
    hatch(X0, Y(ROOF0), X(DEPTH), Y(btop), HAIR, 18, 2)
    d.polygon(pts + [(X(DEPTH), Y(ROOF0))], fill=PAPER)
    d.line(pts, fill=DARK, width=5)
    txt(X(13.5), Y(roof(13.5))-64, "IŞIKLIK", 22, True, MUT)
    # --- zemin, cephe, vitrin
    d.rectangle([X0-24, Y(0), X(DEPTH)+24, Y(0)+26], fill=DARK)
    d.line([(X0, Y(0)), (X0, Y(roof(0)))], fill=HAIR, width=3)
    d.line([(X0-7, Y(0)), (X0-7, Y(3.50))], fill=SEC, width=8)
    txt(X0-24, Y(0)+34, "+1.07 bitmiş zemin", 21, False, MUT)
    txt(X0+14, Y(3.50)-32, "vitrin 3.50", 21, True, SEC)
    # --- kirisler
    for m in (0.0, 8.0, 16.0):
        d.rectangle([X(m)-20, Y(btop), X(m)+20, Y(soff)], fill=GREY, outline=DARK, width=2)
    # --- asma kat dosemesi (cepheden 3.00 m geri cekik)
    a, b = 3.0, min(lim, DEPTH)
    d.rectangle([X(a), Y(deck), X(b), Y(deck)+16], fill=DARK)
    d.line([(X(b)-4, Y(deck)+16), (X(b)-4, Y(0))], fill=HAIR, width=5)
    d.line([(X(b), Y(deck)), (X(b), Y(deck+2.20))], fill=ACCD, width=3)
    txt(X(b)+12, Y(deck+2.20)-14, "burada 2.20 m", 21, True, ACCD)
    # --- olculer
    vdim(X(3.1), Y(0), Y(soff), "%.2f m" % soff, ACC, 23, +1)
    mid = (a+b)/2.0
    vdim(X(mid), Y(deck), Y(roof(mid)), "%.2f m" % (roof(mid)-deck), SEC, 23, +1)
    txt(X(0.35), Y(1.15), "galeri", 22, True, SEC)
    txt(X(0.35), Y(1.15)+28, "boşluğu", 22, True, SEC)

# ----------------------------------------------------------------- notlar
ny = 2300
d.line([(70,ny-40),(W-70,ny-40)],fill=HAIR,width=3)
for i,(k,s) in enumerate([
 ("A","Hiçbir yapısal kurgu değişmiyor ama asma kat ancak ≈5 m derinliğinde ince bir galeri olabiliyor; alt kat 5.43 m ile gereğinden yüksek kalıyor."),
 ("B","Alın yüksekliği 68 cm’de kalır, alt/üst dengelidir, derinlik ≈8 m. Vitrin üstündeki alınlık bandı sıkışmadan çözülür."),
 ("C","En derin asma katı verir (≈10 m) ve alt/üst neredeyse eşitlenir; bedeli, vitrin üstündeki alınlığın 43 cm’e düşmesidir."),
]):
    txt(70, ny+i*42, k, 25, True, ACC); txt(112, ny+i*42, s, 25, False, BODY)

im.save("D5-brief-secenekleri.png"); print("ok", im.size)
