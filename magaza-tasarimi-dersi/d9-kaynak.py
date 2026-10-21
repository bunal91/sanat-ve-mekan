# -*- coding: utf-8 -*-
exec(open('merd-ortak.py').read())
exec(open('merd-yerler.py').read())
PLUM=(112,74,104)
COLOR={'DÜZ KOLLU':ACC,'U DÖNÜŞLÜ':SEC,'L DÖNÜŞLÜ':BLU,'HELİSEL Ø2.60':PLUM}

SC=32; CW=604; CH=1100; COLS=5
MX=70; TOPH=300
W=MX*2+CW*COLS-60; H=TOPH+CH*2+330
im=Image.new('RGB',(W,H),PAPER); d=ImageDraw.Draw(im)

def wrap(s,fnt,w):
    out=[]; line=''
    for word in s.split():
        t=(line+' '+word).strip()
        if d.textlength(t,font=fnt)<=w: line=t
        else: out.append(line); line=word
    if line: out.append(line)
    return out

def bbox(p):
    if p.get('spiral'):
        cx,cy,r=p['spiral']; return (cx-r,cy-r,cx+r,cy+r)
    st,_=mk(p['parts'])
    xs=[]; ys=[]
    for q in st:
        xs+= [q['r'][0],q['r'][2]]; ys+=[q['r'][1],q['r'][3]]
    return (min(xs),min(ys),max(xs),max(ys))

def kirisnot(p):
    if p.get('spiral'): return 'hiçbir kirişi kesmez'
    st,_=mk(p['parts'])
    void=p['void']
    bad,cross=kontrol(st,void)
    best={}
    for (why,s,L,cl,x,y) in cross:
        if why not in best or s>best[why][0]: best[why]=(s,L,cl)
    if not best: return ['hiçbir kirişi kesmez']
    out=[]
    for why,(s,L,cl) in best.items():
        ax=why.replace('kiris ','').replace('=',' = ')
        out.append('%s aksını %d. rıhtta geçer,'%(ax,riser(s)))
        out.append('baş üstü %.2f m — geçer'%cl)
    return out

for i,p in enumerate(PL):
    col=COLOR[p['tip']]
    cx0=MX+(i%COLS)*CW; cy0=TOPH+(i//COLS)*CH
    sc=SC; P=lambda a,b,_x=cx0,_y=cy0:(_x+28+a*sc,_y+58+b*sc)
    # zemin + bolgeler
    d.polygon([P(*q) for q in UNIT],fill=FLOORC)
    im=zone(im,[P(0,0),P(LIM,0),P(LIM,DIAG(LIM)),P(0,21.40)],ACC,26)
    im=zone(im,[P(LIM,0),P(16,0),P(16,11.40),P(LIM,DIAG(LIM))],BLU,30)
    void=circ(*p['spiral'][:2],p['spiral'][2]+0.10) if p.get('spiral') else p['void']
    im=zone(im,[P(*q) for q in void],WHITE,255)
    im=zone(im,[P(*q) for q in void],SEC,70)
    d=ImageDraw.Draw(im)
    d=plan_base(im,d,P,sc,hatch=False,floor=False)
    dashpoly(d,[P(*q) for q in void],SEC,3,11,8)
    dash(d,P(LIM,0),P(LIM,DIAG(LIM)),BLU,3,10,8)
    ciz_merdiven(d,P,sc,p,col)
    # varis noktasi
    gx,gy=p['gel']
    d.ellipse([P(gx-0.28,gy-0.28),P(gx+0.28,gy+0.28)],fill=col)
    d.ellipse([P(gx-0.13,gy-0.13),P(gx+0.13,gy+0.13)],fill=PAPER)
    # etiket
    x0,y0,x1,y1=bbox(p)
    ty=cy0+58+21.40*sc+26
    w,h=band(d,(cx0+28,cy0+2),' %s '%p['id'],col,30,8)
    txt(d,(w+16,cy0+10),p['tip'],30,True,col)
    txt(d,(cx0+28,ty),p['bolge'],24,True,INK); ty+=36
    txt(d,(cx0+28,ty),'%s'%p['alt'],23,False,BODY); ty+=32
    txt(d,(cx0+28,ty),'yer kaplar: %.2f × %.2f m'%(x1-x0,y1-y0),23,False,BODY); ty+=32
    txt(d,(cx0+28,ty),'döşeme boşluğu: %.1f m²'%area(void),23,True,SEC); ty+=32
    fnt=f(23,False)
    for L in kirisnot(p): txt(d,(cx0+28,ty),L,23,False,BLU); ty+=30
    ty+=4
    for L in wrap(p['aciklama'],fnt,CW-90): txt(d,(cx0+28,ty),L,23,False,MUT); ty+=30

# ---- baslik ----
d.rectangle([0,0,W,9],fill=ACC)
txt(d,(MX,48),'D9 · MERDİVEN NEREYE KONABİLİR — DOĞRULANMIŞ 10 KONUM',44,True,INK)
txt(d,(MX,116),'Hepsinde 32 rıht × 17.13 cm, basamak 28 cm, kol genişliği 1.40 m, sahanlık 1.40 m. Hepsinde her noktada baş üstü yüksekliği 2.20 m’nin üstünde kalıyor; döşeme boşluğu tek bir ızgara gözünün içinde; varış noktası x ≤ 11.19 m.',27,False,BODY)
txt(d,(MX,156),'Koyu daire = asma kata varış noktası.  Yeşil taralı alan = döşemede açılması gereken boşluk.  Mavi noktalı çizgi = asma kat sınırı (x = 11.19 m).',27,False,BODY)
d.line([(MX,200),(W-MX,200)],fill=HAIR,width=3)
txt(d,(MX,222),'Kırmızı = düz kollu · Yeşil = U dönüşlü · Lacivert = L dönüşlü · Mor = helisel',26,True,MUT)

# ---- alt ----
by=TOPH+CH*2+10
d.line([(MX,by),(W-MX,by)],fill=HAIR,width=3)
txt(d,(MX,by+24),'KARŞILAŞTIRMA',30,True,ACC)
rows=[('En az döşeme kaybı','M5 ve M10 — 4.6 m². Merdiven asma katın kurulamadığı alçak bölgede tırmanıyor, döşemeden yalnızca kenar çentiği alınıyor.'),
      ('En çok döşeme kaybı','M4 ve M7 — 12.4 m². U merdivende ikinci kolun tamamı boşlukta kalmak zorunda.'),
      ('Kiriş kesmeyen çözümler','M4, M5, M6, M7, M8, M10 — tek gözün içinde kaldıkları için kiriş sorunu hiç doğmuyor.'),
      ('Kiriş kesen çözümler','M1, M2, M3, M9 — düz kollu oldukları için zorunlu; hepsi kirişi ilk 14 rıht içinde geçiyor.'),
      ('Vitrin cephesini kullanmayan','M6, M7, M8, M9 — satış cephesi tamamen serbest kalıyor.')]
for i,(k,s) in enumerate(rows):
    y=by+74+i*42
    txt(d,(MX,y),k,26,True,INK); txt(d,(MX+530,y),s,26,False,BODY)
im.save('yeni/D9-merdiven-konumlari.png')
im.resize((W//2,H//2)).save('yeni/_d9prev.png'); print('ok',im.size)
