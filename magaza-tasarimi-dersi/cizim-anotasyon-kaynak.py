from PIL import Image, ImageDraw, ImageFont
F="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(sz,b=False): return ImageFont.truetype(FB if b else F, sz)

ACC=(168,92,67); SEC=(63,107,99); INK=(34,34,32); MUT=(122,106,98)

def band(d, xy, text, fill, sz=26, pad=10, tcol=(255,255,255)):
    x,y=xy
    ft=f(sz,True)
    bb=d.textbbox((0,0),text,font=ft)
    w,h=bb[2]-bb[0], bb[3]-bb[1]
    d.rectangle([x,y,x+w+pad*2,y+h+pad*2], fill=fill)
    d.text((x+pad,y+pad-bb[1]), text, font=ft, fill=tcol)
    return (x, y, x+w+pad*2, y+h+pad*2)

def note(d, xy, text, sz=24, col=INK, b=False, anchor=None):
    d.text(xy, text, font=f(sz,b), fill=col, anchor=anchor)

def arrow(d, p1, p2, col, w=5, head=18):
    import math
    d.line([p1,p2], fill=col, width=w)
    a=math.atan2(p2[1]-p1[1], p2[0]-p1[0])
    for s in (+1,-1):
        d.line([p2,(p2[0]-head*math.cos(a-s*0.45), p2[1]-head*math.sin(a-s*0.45))], fill=col, width=w)

def zone(base, pts, col, alpha=58):
    ov=Image.new("RGBA", base.size, (0,0,0,0))
    ImageDraw.Draw(ov).polygon(pts, fill=col+(alpha,))
    return Image.alpha_composite(base.convert("RGBA"), ov).convert("RGB")
