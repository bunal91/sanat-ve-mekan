# -*- coding: utf-8 -*-
"""
D1 / D2 / D3 anotasyon duzeltmeleri.
Cizimler yeniden okundu; asagidaki uc tespit duzeltildi:
  1) 545/350 birimleri GUNEYBATI degil DOGU duvarinda (vitrin cephesi orasi).
  2) 475 olcusu asma tavan alti degil KIRIS ALTI net yuksekliktir (+1.00 -> +5.75).
  3) Galeri kati (A-39-1) dort yani duvarli kapali bir hacim; satis hacmine
     bakan bir bosluk / korkuluk kenari yok.
Betik PNG'leri yerinde gunceller. Iki kez calistirmak gerekmez.
"""
from PIL import Image, ImageDraw, ImageFont

FR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(sz, b=False): return ImageFont.truetype(FB if b else FR, sz)

ACC = (168, 92, 67); SEC = (63, 107, 99); INK = (34, 34, 32)
MUT = (122, 106, 98); BRN = (120, 100, 90)
PAPER = (247, 244, 239); WHITE = (255, 255, 255)

def band(d, x, y, text, fill, sz=26, pad=10, tcol=WHITE):
    ft = f(sz, True)
    bb = d.textbbox((0, 0), text, font=ft)
    d.rectangle([x, y, x + bb[2] - bb[0] + pad * 2, y + bb[3] - bb[1] + pad * 2], fill=fill)
    d.text((x + pad - bb[0], y + pad - bb[1]), text, font=ft, fill=tcol)

def band2(d, x, y, lines, fill, sz=26, pad=10, lead=34, tcol=WHITE):
    ft = f(sz, True)
    w = max(d.textbbox((0, 0), s, font=ft)[2] for s in lines)
    h = lead * (len(lines) - 1) + d.textbbox((0, 0), "Ag", font=ft)[3]
    d.rectangle([x, y, x + w + pad * 2, y + h + pad * 2], fill=fill)
    for i, s in enumerate(lines):
        d.text((x + pad, y + pad + i * lead - 4), s, font=ft, fill=tcol)

def caption(d, x, y0, lines, sz, lead, col=(34, 34, 32)):
    ft = f(sz)
    for i, s in enumerate(lines):
        d.text((x, y0 + i * lead), s, font=ft, fill=col)

# ----------------------------------------------------------------- D1 kesit
im = Image.open("D1-kesit.png").convert("RGB"); d = ImageDraw.Draw(im)
band(d, 1830, 724, "4.68 m net  ·  kiriş altı", ACC, sz=26)
d.rectangle([20, 1498, 3550, 1666], fill=PAPER)
caption(d, 41, 1500, [
 "1  Mağazalar bir meydana bakıyor; meydanın üstü büyük çatıyla örtülü, yanları açık. Vitrin doğrudan dış havaya değil, korunaklı bir avluya bakıyor.",
 "2  Satış hacmi: zemin +1.00 yapısal / +1.07 bitmiş  ·  kiriş altı net 4.68 m  ·  kiriş üstüne (+6.50) kadar 5.43 m. Satış hacminde asma tavan yok.",
 "3  +6.50 üstündeki boşluk paftada IŞIKLIK ve “mahal olarak kullanılamaz” diye işaretli — oraya kat/döşeme konulamaz.",
 "4  Alçıpan asma tavan ve +5.40 kotundaki TEKNİK GALERİ KATI yalnızca deponun üstünde; satış hacminin üstünde asma kat yok.",
], sz=27, lead=40)
im.save("D1-kesit.png")

# ------------------------------------------------------------------ D2 plan
im = Image.open("D2-plan.png").convert("RGB"); d = ImageDraw.Draw(im)
d.rectangle([283, 2941, 1160, 2996], fill=WHITE)
band(d, 285, 2945, "GÜNEYBATI DUVARI  ·  terasa açılan kapılar", ACC, sz=26)
caption(d, 287, 3002, ["burada vitrin yok — 545/350 cam birimleri doğu duvarında"], sz=24, lead=34, col=MUT)
d.rectangle([1326, 395, 1900, 450], fill=WHITE)
band2(d, 1330, 399, [
 "DOĞU DUVARI = VİTRİN CEPHESİ",
 "545/350  →  5.45 m en × 3.50 m yükseklik",
 "+1.07’den +4.57’ye  ·  ortada çift kanat kapı",
 "iki birim yan yana  ·  dışarısı ağaçlı meydan",
], INK, sz=26, lead=38)
band(d, 817, 2071, "MERDİVEN + GALERİ KATI · bölme duvarın doğusunda", SEC, sz=26)
d.rectangle([20, 3330, 2190, 3517], fill=PAPER)
caption(d, 40, 3333, [
 "Kabuk iki parçalı: kuzeyde dik açılı bir blok, güneydoğuda iki diyagonal duvar arasında genişleyen kama biçimli bir alan.",
 "Vitrin doğu duvarında: 5.45 × 3.50 m’lik iki cam birim (545/350), her birinin ortasında çift kanat kapı; dışarısı ağaçlı meydan.",
 "Güneybatı duvarı terasa açılıyor — tek ve çift kanat kapılar var, vitrin yok. Taşıyıcı sistem 8.00 × 8.00 m kolon aksı.",
 "Merdiven ve çıktığı 79.44 m² GALERİ KATI (A-39-1) diyagonal bölme duvarın doğusunda; satış hacminin üstünde asma kat yok.",
 "Çizim doğu kenarında pafta sınırıyla kesilmiş — birimin tamamı bu paftada görünmüyor.",
], sz=26, lead=38)
im.save("D2-plan.png")

# -------------------------------------------------------------- D3 asma kat
im = Image.open("D3-asmakat.png").convert("RGB"); d = ImageDraw.Draw(im)
band(d, 152, 950, "DÖŞEME YOK — altta tek hacim hâlinde satış alanı (+1.07)", ACC, sz=26)
band(d, 779, 2194, "merdiven kapalı galeriye varıyor", SEC, sz=26)
band2(d, 1254, 1520, ["KAPALI GALERİ KATI", "A-39-1 · 79.44 m² · dört yanı duvarlı"], SEC, sz=26, lead=38)
d.rectangle([20, 3272, 2390, 3430], fill=PAPER)
caption(d, 40, 3276, [
 "Asma kat bütün mekânı örtmüyor: yalnızca doğudaki bölümde 79.44 m²’lik bir döşeme var (A-39-1) ve pafta sınırının ötesine devam ediyor.",
 "Geri kalan alanlarda döşeme yok — planda +1.07 / +1.00 kotu görünüyor; yani oralarda zemin kat tek hacim hâlinde yukarı açılıyor.",
 "Galeri katı dört yanı duvarla çevrili kapalı bir hacim: satış hacmine bakan bir boşluk ya da korkuluk kenarı yok. Gri lekeler sunum gölgesidir.",
 "Kesitteki bilgiye göre bu kat +5.40 kotunda ve teknik galeri olarak tanımlı — tavan yüksekliği düşük.",
], sz=26, lead=38)
im.save("D3-asmakat.png")
print("ok")
