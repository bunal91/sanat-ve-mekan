# -*- coding: utf-8 -*-
exec(open('merd-ortak.py').read())
exec(open('merd-yerler.py').read())

print('RIHT %.3f m  BASAMAK %.2f m  EGIM %.4f'%(RISE,GO,SLOPE))
print('KAT YUKSEKLIGI %.2f -> %.2f = %.2f m / %d riht'%(FL,DECK,DECK-FL,NR))
print('2h+b = %.1f cm'%(2*RISE*100+GO*100))
print('DOSEME/KIRIS ALTI %.2f  GEREKLI BAS USTU %.2f  -> izin verilen en yuksek kot %.2f'%(SOF,HEAD,SOF-HEAD))
print('  pitch line kot(s)=%.4f+%.5f*s -> s_max=%.3f m'%(FL+RISE,SLOPE,(SOF-HEAD-FL-RISE)/SLOPE))
for k in (13,14,15):
    print('   riht %d: kot %.3f  bas ustu %.3f  %s'%(k,FL+k*RISE,SOF-FL-k*RISE,'OK' if SOF-FL-k*RISE>=HEAD else 'OLMAZ'))
print('KULLANILAN SINIR SMAX = %.2f m (13 basamak) -> ilk 14 riht doseme altinda'%SMAX)
print('DUZ KOL TOPLAM RUN %.2f m  -> bosluk %.2f m'%(RUN,RUN-SMAX))
print('TEK GOZ NET 7.50 m  -> duz kol tek gozde SIGMAZ, kiris kesmek zorunlu')
print('  kiris aksindan baslangic mesafesi d: d>=%.2f (uzak gozde kalan %.2f<=7.50) ve d<=%.2f (uzak yuz %.2f)'
      %(RUN-0.25-7.50, RUN-0.25-(RUN-0.25-7.50), SMAX-0.25, SMAX))
print('  -> d = 2.05 .. 3.39 m')
print()
for p in PL:
    if p['void']=='SP':
        cx,cy,r=p['spiral']; void=circ(cx,cy,r+0.10); st=[]; stot=0.0
    else:
        void=p['void']; st,stot=mk(p['parts'])
    bad,cross=kontrol(st,void) if st else ([],[])
    bays=[]
    if p['void']!='SP':
        c=(sum(x for x,y in void)/len(void),sum(y for x,y in void)/len(void))
        vs=[(x+(c[0]-x)*0.01,y+(c[1]-y)*0.01) for x,y in void]
        bays=[k for k,z in ZONES.items() if all(pip(q,z) for q in vs)]
    else:
        bays=[k for k,z in ZONES.items() if all(pip(q,z) for q in void)]
    cr={}
    for (why,s,L,cl,x,y) in cross:
        if why not in cr or s>cr[why][0]: cr[why]=(s,L,cl)
    print('%-4s %-13s %-34s run=%.2f  bosluk=%5.2f m2  goz=%s'%(p['id'],p['tip'],p['bolge'],stot,area(void),','.join(bays) or 'YOK'))
    for why,(s,L,cl) in cr.items():
        print('      %s : en gec s=%.2f m (riht %d) kot %.2f  bas ustu %.2f  %s'%(why,s,riser(s),L,cl,'OK' if cl>=HEAD else 'OLMAZ'))
    if bad: print('      !! IHLAL %d nokta, en kotu: %s'%(len(bad),sorted(bad,key=lambda t:t[3])[0]))
    else:   print('      tum noktalarda bas ustu >= 2.20 m  OK')
    for q in [(p['gel'])]:
        print('      varis (%.2f,%.2f) x<=%.2f : %s'%(q[0],q[1],LIM,'OK' if q[0]<=LIM+0.01 else 'OLMAZ'))
