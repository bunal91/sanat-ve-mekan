# -*- coding: utf-8 -*-
exec(open('ciz-ortak.py').read())
from PIL import Image, ImageDraw
import math

# ---- merdiven temel verileri ----
RISE=0.17125          # rıht (548/32)
GO  =0.28             # basamak genisligi
SLOPE=RISE/GO
FL  =1.07             # bitmis zemin
DECK=6.55             # asma kat dosemesi ust kot
SOF =5.75             # doseme / kiris alti
HEAD=2.20             # gerekli bas ustu
NR  =32               # rıht sayisi
SMAX=13*GO            # 3.64 m -> ilk 14 rıht doseme/kiris altinda kalabilir
LIM =11.19            # asma kat dogu siniri
FLIGHT=15*GO          # 4.20 m -> 16 rıhtlik kol
LAND=1.40
RUN=2*FLIGHT+LAND     # 9.80 m duz kollu toplam

DIAG=lambda x: 11.40+(16.0-x)*0.625
UNIT=[(0,0),(16,0),(16,11.40),(0,21.40)]
COL50=[(0,0),(8,0),(16,0),(0,8),(8,8),(16,8),(0,16)]
COL69=[(16.02,11.49),(8.17,16.39)]
PIER=(6.07,17.54)
BW=0.50; XD16=8.64

def bands():
    b=[]
    for xg in (0,8,16):
        b.append(('x',xg,[(xg-BW/2,0.0),(xg+BW/2,0.0),(xg+BW/2,DIAG(xg)),(xg-BW/2,DIAG(xg))]))
    for yg in (0,8):
        b.append(('y',yg,[(0.0,yg-BW/2),(16.0,yg-BW/2),(16.0,yg+BW/2),(0.0,yg+BW/2)]))
    b.append(('y',16,[(0.0,16-BW/2),(XD16,16-BW/2),(XD16,16+BW/2),(0.0,16+BW/2)]))
    return b
BANDS=bands()

BAYS={'B1':[(0.25,0.25),(7.75,0.25),(7.75,7.75),(0.25,7.75)],
      'B2':[(8.25,0.25),(15.75,0.25),(15.75,7.75),(8.25,7.75)],
      'B3':[(0.25,8.25),(7.75,8.25),(7.75,15.75),(0.25,15.75)],
      'B4':[(8.25,8.25),(15.75,8.25),(15.75,11.26),(8.25,15.94)],
      'B5':[(0.25,16.25),(7.76,16.25),(0.25,20.94)]}
ZONES={'B1':BAYS['B1'],
       'B2':[(8.25,0.25),(LIM,0.25),(LIM,7.75),(8.25,7.75)],
       'B3':BAYS['B3'],
       'B4':[(8.25,8.25),(LIM,8.25),(LIM,14.11),(8.25,15.94)],
       'B5':BAYS['B5']}

def pip(p,poly):
    x,y=p; n=len(poly); ins=False
    for i in range(n):
        x1,y1=poly[i]; x2,y2=poly[(i+1)%n]
        if (y1>y)!=(y2>y):
            xi=x1+(y-y1)*(x2-x1)/(y2-y1)
            if x<xi: ins=not ins
    return ins
def area(poly):
    s=0.0
    for i in range(len(poly)):
        x1,y1=poly[i]; x2,y2=poly[(i+1)%len(poly)]
        s+=x1*y2-x2*y1
    return abs(s)/2
def circ(cx,cy,r,n=48):
    return [(cx+r*math.cos(2*math.pi*k/n), cy+r*math.sin(2*math.pi*k/n)) for k in range(n)]

def mk(parts):
    """parts: ('F',x0,y0,x1,y1,dr) veya ('L',x0,y0,x1,y1)"""
    out=[]; s=0.0
    for p in parts:
        if p[0]=='F':
            _,x0,y0,x1,y1,dr=p
            L=abs(x1-x0) if dr in 'EW' else abs(y1-y0)
            out.append(dict(k='F',r=(min(x0,x1),min(y0,y1),max(x0,x1),max(y0,y1)),dr=dr,s0=s,s1=s+L,L=L))
            s+=L
        else:
            _,x0,y0,x1,y1=p
            out.append(dict(k='L',r=(min(x0,x1),min(y0,y1),max(x0,x1),max(y0,y1)),dr=None,s0=s,s1=s,L=0))
    return out,s

def sat(part,x,y):
    if part['k']=='L': return part['s0']
    x0,y0,x1,y1=part['r']; dr=part['dr']
    return part['s0']+{'E':x-x0,'W':x1-x,'S':y-y0,'N':y1-y}[dr]
def lev(s): return FL+RISE+SLOPE*s
def riser(s): return min(NR,int(s/GO)+1)

def kontrol(st,void,step=0.04):
    """her noktada: kiris/doseme altinda mi, bas ustu yeterli mi"""
    bad=[]; cross=[]
    for part in st:
        x0,y0,x1,y1=part['r']
        nx=max(1,int(round((x1-x0)/step))); ny=max(1,int(round((y1-y0)/step)))
        for i in range(nx+1):
            for j in range(ny+1):
                x=x0+(x1-x0)*i/nx; y=y0+(y1-y0)*j/ny
                s=sat(part,x,y); L=lev(s); cl=SOF-L
                why=None
                for (o,g,poly) in BANDS:
                    if pip((x,y),poly): why='kiris %s=%g'%(o,g); break
                if why is None and x<=LIM and not pip((x,y),void): why='doseme'
                if why:
                    if why.startswith('kiris'): cross.append((why,s,L,cl,x,y))
                    if cl<HEAD-1e-6: bad.append((why,round(s,2),round(L,3),round(cl,3),round(x,2),round(y,2)))
    return bad,cross

def bayof(void):
    hit=[]
    for k,z in ZONES.items():
        if all(pip(p,z) for p in void): hit.append(k)
    return hit

# ================= temiz plan cizimi =================
SHELL=(58,54,50); FLOORC=(255,254,251); BEAMF=(222,217,210)
def dash(d,p1,p2,col,w=4,seg=18,gap=12):
    x1,y1=p1; x2,y2=p2; L=math.hypot(x2-x1,y2-y1)
    if L<1: return
    t=0.0
    while t<L:
        t2=min(L,t+seg)
        d.line([(x1+(x2-x1)*t/L,y1+(y2-y1)*t/L),(x1+(x2-x1)*t2/L,y1+(y2-y1)*t2/L)],fill=col,width=w)
        t+=seg+gap
def dashpoly(d,pts,col,w=4,seg=18,gap=12):
    for i in range(len(pts)): dash(d,pts[i],pts[(i+1)%len(pts)],col,w,seg,gap)

def plan_base(im,d,P,sc,hatch=True,glaz=True,cols=True,floor=True):
    """P(x,y)->px ; sc = px/metre"""
    if floor: d.polygon([P(*q) for q in UNIT],fill=FLOORC)
    for (o,g,poly) in BANDS:
        pts=[P(*q) for q in poly]
        d.polygon(pts,fill=BEAMF)
    if hatch:
        for (o,g,poly) in BANDS:
            pts=[P(*q) for q in poly]
            tile,msk,org=hatchpoly(d,pts,(150,143,134),step=max(7,int(sc*0.13)),w=2)
            im.paste(tile,org,msk)
        d=ImageDraw.Draw(im)
    for (o,g,poly) in BANDS:
        pts=[P(*q) for q in poly]
        d.line(pts+[pts[0]],fill=(130,123,114),width=max(1,int(sc*0.022)))
    wt=max(2,int(sc*0.24))
    pts=[P(*q) for q in UNIT]
    d.line(pts+[pts[0]],fill=SHELL,width=wt)
    if glaz:
        d.line([P(0,0.28),P(0,7.72)],fill=SEC,width=wt)
        d.line([P(16,1.30),P(16,6.70)],fill=SEC,width=wt)
        d.line([P(0,3.10),P(0,4.90)],fill=ACC,width=wt)
        d.line([P(16,3.20),P(16,4.80)],fill=ACC,width=wt)
    if cols:
        for (a,b) in COL50: d.rectangle([P(a-0.25,b-0.25),P(a+0.25,b+0.25)],fill=INK)
        for (a,b) in COL69: d.rectangle([P(a-0.345,b-0.345),P(a+0.345,b+0.345)],fill=INK)
        d.rectangle([P(PIER[0]-0.165,PIER[1]-0.25),P(PIER[0]+0.165,PIER[1]+0.25)],fill=INK)
    return d

def ciz_merdiven(d,P,sc,p,col,lw=None):
    """basamaklar + yon oku"""
    lw=lw or max(2,int(sc*0.035))
    if p.get('spiral'):
        cx,cy,r=p['spiral']
        d.ellipse([P(cx-r,cy-r),P(cx+r,cy+r)],outline=col,width=lw)
        d.ellipse([P(cx-0.25,cy-0.25),P(cx+0.25,cy+0.25)],fill=col)
        for k in range(16):
            a=2*math.pi*k/16
            d.line([P(cx+0.25*math.cos(a),cy+0.25*math.sin(a)),P(cx+r*math.cos(a),cy+r*math.sin(a))],fill=col,width=max(1,lw//2))
        return
    st,tot=mk(p['parts'])
    for part in st:
        x0,y0,x1,y1=part['r']
        d.rectangle([P(x0,y0),P(x1,y1)],outline=col,width=lw)
        if part['k']=='F':
            n=int(round(part['L']/GO))
            for i in range(1,n):
                t=i*GO
                if part['dr'] in 'EW':
                    xx=x0+t if part['dr']=='E' else x1-t
                    d.line([P(xx,y0),P(xx,y1)],fill=col,width=max(1,lw//2))
                else:
                    yy=y0+t if part['dr']=='S' else y1-t
                    d.line([P(x0,yy),P(x1,yy)],fill=col,width=max(1,lw//2))
