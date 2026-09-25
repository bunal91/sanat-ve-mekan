# -*- coding: utf-8 -*-
"""D4-yukseklik.png  —  "Bu mekâna iki kat sığar mı?" diyagramı.
Kotlar kesitten okundu: bitmiş zemin +1.07, kiriş altı +5.75, kiriş üstü +6.50,
kiriş yüksekliği 75 cm, üstü IŞIKLIK (paftada 'mahal olarak kullanılamaz')."""
from PIL import Image, ImageDraw, ImageFont

FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(sz, b=False): return ImageFont.truetype(FB if b else FR, sz)

PAPER=(247,244,239); INK=(34,34,32); BODY=(74,66,62); MUT=(122,106,98)
HAIR=(214,204,195); LIGHT=(237,229,222); ACC=(168,92,67); ACCD=(126,66,48)
SEC=(63,107,99); SECT=(221,231,228); WHITE=(255,255,255); GREY=(150,140,132)
DARK=(60,54,50)

W, H = 2600, 1880
im = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(im)

S = 140.0                      # 1 m = 140 px
BASE = 1380                    # bitmiş zemin (+1.07)
def Y(h): return int(round(BASE - h * S))

def R(a, b, c, e, **kw):
    """kot -> piksel donusumu ekseni ters cevirdigi icin koseleri normalize eder"""
    d.rectangle([min(a, c), min(b, e), max(a, c), max(b, e)], **kw)

def band(x, y, text, fill, sz=26, pad=10, tcol=WHITE):
    ft = f(sz, True); bb = d.textbbox((0,0), text, font=ft)
    d.rectangle([x, y, x+bb[2]-bb[0]+pad*2, y+bb[3]-bb[1]+pad*2], fill=fill)
    d.text((x+pad-bb[0], y+pad-bb[1]), text, font=ft, fill=tcol)
    return x+bb[2]-bb[0]+pad*2

def txt(x, y, s, sz=26, b=False, c=BODY, anchor=None):
    d.text((x, y), s, font=f(sz, b), fill=c, anchor=anchor)

def vdim(x, ya, yb, label, col=ACC, sz=24, side=1, lw=3):
    """dikey ölçü oku + etiket"""
    d.line([(x, ya), (x, yb)], fill=col, width=lw)
    for y in (ya, yb):
        d.line([(x-14, y), (x+14, y)], fill=col, width=lw)
    ft = f(sz, True); bb = d.textbbox((0,0), label, font=ft)
    tw, th = bb[2]-bb[0], bb[3]-bb[1]
    cy = (ya+yb)//2
    bx = x + 12 if side > 0 else x - 12 - tw - 16
    d.rectangle([bx, cy-th//2-8, bx+tw+16, cy+th//2+8], fill=PAPER)
    d.text((bx+8-bb[0], cy-th//2-bb[1]), label, font=ft, fill=col)

def hatch(x0, y0, x1, y1, col, step=16, lw=2):
    """dikdortgene kirpilmis 45 derece tarama"""
    w, h = x1-x0, y1-y0
    tile = Image.new("RGB", (w, h), LIGHT); td = ImageDraw.Draw(tile)
    for k in range(-(h//step) - 1, w//step + 2):
        td.line([(k*step, 0), (k*step + h, h)], fill=col, width=lw)
    im.paste(tile, (x0, y0))

# ------------------------------------------------------------------ başlık
d.rectangle([0, 0, W, 6], fill=ACC)
txt(78, 74, "04 · YÜKSEKLİK", 28, True, ACC)
txt(78, 124, "Bu mekâna iki kat sığar mı?", 62, True, INK)
txt(78, 214, "Kesitten okunan kotlar: bitmiş zemin +1.07  ·  kiriş altı +5.75  ·  kiriş üstü +6.50  ·  kiriş yüksekliği 75 cm.",
    28, False, BODY)
txt(78, 256, "+6.50’nin üstü paftada IŞIKLIK ve “mahal olarak kullanılamaz” — oraya döşeme konulamaz.",
    28, False, BODY)
d.line([(78, 316), (W-78, 316)], fill=HAIR, width=3)

CX = [500, 1300, 2100]
HW = 300                        # yarı genişlik
TOPY = Y(5.43)                  # +6.50
BEAMY = Y(4.68)                 # +5.75

def shell(cx, beams="both"):
    x0, x1 = cx-HW, cx+HW
    # ışıklık bandı (kullanılamaz)
    d.rectangle([x0, TOPY-110, x1, TOPY], fill=LIGHT)
    hatch(x0, TOPY-110, x1, TOPY, HAIR, 18, 2)
    d.rectangle([x0, TOPY-110, x1, TOPY], outline=HAIR, width=2)
    # +6.50 tavan çizgisi
    d.line([(x0, TOPY), (x1, TOPY)], fill=DARK, width=5)
    # kirişler
    if beams in ("both", "left"):
        R(x0, BEAMY, x0+86, TOPY, fill=GREY, outline=DARK, width=2)
    if beams in ("both", "right"):
        R(x1-86, BEAMY, x1, TOPY, fill=GREY, outline=DARK, width=2)
    # yan duvarlar
    d.line([(x0, TOPY), (x0, Y(0))], fill=HAIR, width=3)
    d.line([(x1, TOPY), (x1, Y(0))], fill=HAIR, width=3)
    # zemin
    d.rectangle([x0-20, Y(0), x1+20, Y(0)+34], fill=DARK)
    txt(x0-20, Y(0)+46, "+1.07 bitmiş zemin", 22, False, MUT)

def head(cx, no, title, sub, col):
    x0 = cx-HW
    band(x0, 372, "  " + no + "   " + title + "  ", col, sz=28, pad=8)
    txt(x0, 430, sub, 24, False, MUT)

# ---------------------------------------------------------- A · MEVCUT
cx = CX[0]; shell(cx)
head(cx, "A", "MEVCUT KABUK", "tek hacim — hiçbir ara döşeme yok", SEC)
txt(cx-HW+10, TOPY-98, "IŞIKLIK — mahal olarak kullanılamaz", 22, True, MUT)
txt(cx-HW+100, BEAMY+14, "KİRİŞ  75 cm", 24, True, DARK)
txt(cx+HW+12, TOPY-14, "+6.50", 22, True, MUT)
txt(cx+HW+12, BEAMY-14, "+5.75", 22, True, MUT)
vdim(cx-240, BEAMY, Y(0), "4.68 m", ACC, 26, +1)
vdim(cx+140, TOPY, Y(0), "5.43 m", SEC, 26, +1)

# ------------------------------------------------- B · KISMİ ASMA KAT
cx = CX[1]; shell(cx)
head(cx, "B", "KISMİ ASMA KAT", "kirişlerin arasında kalan bölümde — olur", SEC)
x0, x1 = cx-HW, cx+HW
dx0, dx1 = cx-30, x1-96
R(x0+2, Y(5.43), dx0, Y(0), fill=SECT)
R(dx0, Y(2.83), dx1, Y(2.60), fill=DARK)
R(dx1-16, Y(2.60), dx1, Y(0), fill=GREY)
txt(x0+14, Y(1.70), "vitrin boyu", 22, True, SEC)
txt(x0+14, Y(1.70)+30, "boş kalır", 22, True, SEC)
txt(x0+16, Y(2.60)+10, "döşeme 23 cm", 22, False, MUT)
vdim(dx0+170, Y(2.60), Y(0), "2.60 m", ACC, 26, +1)
vdim(dx0+170, TOPY, Y(2.83), "2.60 m", ACC, 26, +1)

# ---------------------------------------------------- C · İKİ TAM KAT
cx = CX[2]; shell(cx)
head(cx, "C", "İKİ TAM KAT", "kiriş hattında — üst kat 2.08 m, asgari 2.20 m’nin altında", ACCD)
x0, x1 = cx-HW, cx+HW
R(x0, Y(2.60), x1, Y(2.40), fill=DARK)
d.line([(x0+30, Y(0)-30), (x1-30, TOPY+30)], fill=ACCD, width=9)
d.line([(x0+30, TOPY+30), (x1-30, Y(0)-30)], fill=ACCD, width=9)
vdim(cx-140, Y(2.40), Y(0), "2.40 m", ACC, 26, -1)
vdim(cx+140, BEAMY, Y(2.60), "2.08 m", ACCD, 26, +1)

# --------------------------------------------------------- alt açıklama
ty = 1512
d.line([(78, ty-40), (W-78, ty-40)], fill=HAIR, width=3)
rows = [
 ("A", "Kiriş altı net 4.68 m, kirişlerin arasında +6.50’ye kadar 5.43 m. Satış hacminde asma tavan yok; hacim doğrudan kirişli tavana açılıyor."),
 ("B", "Kirişler arası açıklıkta 2.60 + 2.60 çıkar. Asma kat toplam alanın üçte birini geçmemeli, cepheden geri çekilmeli, vitrin boyu bölünmemeli."),
 ("C", "Tam kat, kirişin altından geçmek zorunda: 2.40 + döşeme + 2.08. Üst kat asgari yüksekliğin altında kalıyor — ticari mekân olarak çözülemez."),
]
for i, (k, s) in enumerate(rows):
    y = ty + i*46
    txt(78, y, k, 26, True, ACC); txt(120, y, s, 26, False, BODY)

# --------------------------------------------------------- kapanış bandı
by = 1690
d.rectangle([78, by, W-78, by+140], fill=SECT)
d.rectangle([78, by, 92, by+140], fill=SEC)
txt(124, by+24, "Kirişi aşağı almak yükseklik kazandırmaz — olan yüksekliği de alır.", 30, True, INK)
txt(124, by+76, "Tavanı belirleyen şey kirişin kendisi değil, üstündeki +6.50 kotu ve “kullanılamaz” işaretli ışıklıktır. Kiriş 75 cm’lik taşıyıcı bir",
    26, False, BODY)
txt(124, by+110, "elemandır ve kiracı tarafından yeri değiştirilemez. İki kat isteniyorsa kiriş indirilmez; brifte kabuk yükseltilir.",
    26, False, BODY)

im.save("D4-yukseklik.png")
print("ok", im.size)
