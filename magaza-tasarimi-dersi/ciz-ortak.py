# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw, ImageFont
import math
F ="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def f(sz,b=False): return ImageFont.truetype(FB if b else F, sz)

PAPER=(246,244,239); INK=(28,28,26); BODY=(70,64,60); MUT=(126,116,108)
ACC =(158,96,72)    # terrakota
SEC =(47,98,96)     # teal
BLU =(52,80,120)    # lacivert
HAIR=(205,198,190); GREY=(150,142,134); WHITE=(255,255,255)

def band(d,xy,text,fill,sz=30,pad=12,tcol=WHITE):
    x,y=xy; ft=f(sz,True); bb=d.textbbox((0,0),text,font=ft)
    d.rectangle([x,y,x+bb[2]-bb[0]+pad*2,y+bb[3]-bb[1]+pad*2],fill=fill)
    d.text((x+pad-bb[0],y+pad-bb[1]),text,font=ft,fill=tcol)
    return x+bb[2]-bb[0]+pad*2, y+bb[3]-bb[1]+pad*2

def txt(d,xy,s,sz=28,b=False,c=INK,anchor=None):
    d.text(xy,s,font=f(sz,b),fill=c,anchor=anchor)

def arrow(d,p1,p2,col,w=5,head=22):
    d.line([p1,p2],fill=col,width=w)
    a=math.atan2(p2[1]-p1[1],p2[0]-p1[0])
    for s in (1,-1):
        d.line([p2,(p2[0]-head*math.cos(a-s*0.42),p2[1]-head*math.sin(a-s*0.42))],fill=col,width=w)

def dim(d,p1,p2,label,col=ACC,sz=26,off=0):
    """iki uclu olcu oku + etiket"""
    d.line([p1,p2],fill=col,width=3)
    a=math.atan2(p2[1]-p1[1],p2[0]-p1[0])
    for p,s in ((p1,1),(p2,-1)):
        for k in (1,-1):
            d.line([p,(p[0]+s*18*math.cos(a+k*0.4),p[1]+s*18*math.sin(a+k*0.4))],fill=col,width=3)
        d.line([(p[0]-14*math.sin(a),p[1]+14*math.cos(a)),(p[0]+14*math.sin(a),p[1]-14*math.cos(a))],fill=col,width=3)
    cx,cy=(p1[0]+p2[0])/2,(p1[1]+p2[1])/2
    ft=f(sz,True); bb=d.textbbox((0,0),label,font=ft)
    w,h=bb[2]-bb[0],bb[3]-bb[1]
    d.rectangle([cx-w/2-8,cy-h/2-6,cx+w/2+8,cy+h/2+6],fill=PAPER)
    d.text((cx-w/2-bb[0],cy-h/2-bb[1]),label,font=ft,fill=col)

def zone(base,pts,col,alpha=46):
    ov=Image.new("RGBA",base.size,(0,0,0,0))
    ImageDraw.Draw(ov).polygon(pts,fill=col+(alpha,))
    return Image.alpha_composite(base.convert("RGBA"),ov).convert("RGB")

def hatchpoly(d,pts,col,step=16,w=2):
    xs=[p[0] for p in pts]; ys=[p[1] for p in pts]
    x0,x1,y0,y1=min(xs),max(xs),min(ys),max(ys)
    import PIL.ImageDraw
    msk=Image.new("L",(int(x1-x0)+2,int(y1-y0)+2),0)
    PIL.ImageDraw.Draw(msk).polygon([(p[0]-x0,p[1]-y0) for p in pts],fill=255)
    tile=Image.new("RGB",msk.size,(255,255,255)); td=PIL.ImageDraw.Draw(tile)
    h=msk.size[1]
    for k in range(-(h//step)-1,msk.size[0]//step+2):
        td.line([(k*step,0),(k*step+h,h)],fill=col,width=w)
    return (tile,msk,(int(x0),int(y0)))
