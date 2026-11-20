# Studio Glagola shop drawing sheet A-201 (bar at Decant). Writes tools/sg-sheet.svg
# Dimensions are estimated from the cover photo. Confirm with John before treating as real.
import math, random, os
HERE=os.path.dirname(os.path.abspath(__file__))
MONO=open(os.path.join(HERE,'sg-monogram.svgfrag')).read()
W,H_=1800,1200; K='#141414'; G='#8f8a82'; PAPER='#f0ece6'
o=[]
def ln(x1,y1,x2,y2,w=1.0,c=K,d=None,cap='butt'):
    o.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{c}" stroke-width="{w}" stroke-linecap="{cap}"'+(f' stroke-dasharray="{d}"' if d else '')+'/>')
def rect(x,y,w,h,sw=1.0,c=K,fill='none'): o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{fill}" stroke="{c}" stroke-width="{sw}"/>')
def tx(x,y,t,size=15,anchor='start',weight=500,c=K,ls=0,upper=False):
    if upper: t=t.upper()
    o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" fill="{c}"'+(f' letter-spacing="{ls}"' if ls else '')+f'>{t}</text>')
def circ(x,y,r,sw=1.2,fill='none',c=K): o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{fill}" stroke="{c}" stroke-width="{sw}"/>')

# ---------- sheet frame ----------
o.append(f'<rect width="{W}" height="{H_}" fill="{PAPER}"/>')
rect(18,18,W-36,H_-36,0.8)
rect(34,34,W-68,H_-68,2.2)
TB=1490   # title block strip left edge
ln(TB,34,TB,H_-34,2.2)

# ---------- elevation ----------
S=4.55; X0=262; FLOOR=905
L=192; BH=42; R=24; TOP=2.5; OH=1.5; BASE=4
X=lambda i: X0+i*S; Y=lambda i: FLOOR-i*S
BBL,BBR,BBH=36,162,108
# ceiling
ln(X(-14),Y(120),X(L+14),Y(120),0.8,G,'14 6 3 6')
# pendants
for px in [70,116,168]:
    ln(X(px),Y(120),X(px),Y(88),0.7,G)
    o.append(f'<path d="M{X(px)-6:.1f} {Y(88):.1f} h12 l2 6 q14 5 15 20 h-46 q1 -15 15 -20 z" fill="{PAPER}" stroke="{G}" stroke-width="1"/>')
# back bar (screened)
bx1,bx2=X(BBL),X(BBR)
rect(bx1,Y(BBH),bx2-bx1,Y(BH)-Y(BBH),1.2,G)
rect(bx1+5,Y(BBH)+5,bx2-bx1-10,Y(BH)-Y(BBH)-5,0.5,G)
for bay in [BBL+42,BBL+84]: ln(X(bay),Y(BBH)+5,X(bay),Y(BH),1,G)
for sh in [56,72,88,100]: ln(bx1+5,Y(sh),bx2-5,Y(sh),0.9,G); ln(bx1+5,Y(sh)-2.5,bx2-5,Y(sh)-2.5,0.4,G)
cx1,cx2=X(BBL+4),X(BBL+38)
rect(cx1,Y(71),cx2-cx1,Y(45)-Y(71),0.9,G)
rect(cx1+5,Y(71)+5,cx2-cx1-10,Y(45)-Y(71)-10,0.5,G)
for m in [1/3,2/3]: ln(cx1+5,Y(71)+5+(Y(45)-Y(71)-10)*m,cx2-5,Y(71)+5+(Y(45)-Y(71)-10)*m,0.4,G)
for gx in range(8): ln(cx1+12+gx*14,Y(71)+12,cx1+30+gx*14,Y(71)+30,0.35,G)  # glazing hatch
random.seed(11)
for sh,lo,hi in [(56,BBL+46,BBL+80),(72,BBL+88,BBL+122),(88,BBL+46,BBL+78),(88,BBL+90,BBL+120)]:
    x=lo
    while x<hi:
        w=random.choice([1.2,1.5,2.2,2.8]); h=random.choice([7,8,9,10,11])
        rect(X(x),Y(sh+h),w*S,h*S,0.5,G); x+=w+random.choice([0,0,0.2,2.5])
# bar body (masks back bar)
face_top=BH-TOP
o.append(f'<rect x="{X(0):.1f}" y="{Y(face_top):.1f}" width="{L*S:.1f}" height="{face_top*S:.1f}" fill="{PAPER}"/>')
flat=L-R; x=0
while x<flat-0.01: ln(X(x),Y(face_top),X(x),Y(BASE),0.6); x+=3
n=int((math.pi/2*R)/3)
for i in range(1,n+1):
    th=i*3/R
    if th<=math.pi/2: ln(X(flat+R*math.sin(th)),Y(face_top),X(flat+R*math.sin(th)),Y(BASE),0.6)
# recessed base / toe kick
o.append(f'<rect x="{X(0.75):.1f}" y="{Y(BASE):.1f}" width="{(L-1.5)*S:.1f}" height="{BASE*S:.1f}" fill="#e2ddd5" stroke="{K}" stroke-width="0.9"/>')
rect(X(0),Y(face_top),L*S,(face_top-BASE)*S,2.0)
# concrete top with stipple
tx0,ty0,tw,th_=X(-OH),Y(BH),(L+2*OH)*S,TOP*S
o.append(f'<rect x="{tx0:.1f}" y="{ty0:.1f}" width="{tw:.1f}" height="{th_:.1f}" fill="{PAPER}" stroke="{K}" stroke-width="2"/>')
random.seed(3)
for _ in range(260):
    px=tx0+3+random.random()*(tw-6); py=ty0+2+random.random()*(th_-4)
    o.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{random.choice([0.5,0.6,0.8])}" fill="{K}"/>')
for _ in range(26):
    px=tx0+8+random.random()*(tw-16); py=ty0+3+random.random()*(th_-6)
    o.append(f'<path d="M{px:.1f} {py:.1f} l2.6 3.4 h-5.2 z" fill="none" stroke="{K}" stroke-width="0.5"/>')
# floor
ln(X(-24),FLOOR,X(L+30),FLOOR,2.6)
for hx in range(int(X(-24))+4,int(X(L+30)),10): ln(hx,FLOOR+1,hx-8,FLOOR+9,0.5)

# ---------- dimensions ----------
def tick(x,y): ln(x-4.5,y+4.5,x+4.5,y-4.5,1.4)
def dimh(xa,xb,y,label,ext_from=None):
    if ext_from is not None:
        for xx in (xa,xb): ln(xx,ext_from+6,xx,y+8,0.5)
    ln(xa-8,y,xb+8,y,0.6); tick(xa,y); tick(xb,y)
    tx((xa+xb)/2,y-7,label,15,'middle')
def dimv(x,ya,yb,label,ext_to=None,side='right'):
    if ext_to is not None:
        for yy in (ya,yb): ln(ext_to+6 if side=='right' else ext_to-6,yy,x+(8 if side=='right' else -8),yy,0.5)
    ln(x,ya-8,x,yb+8,0.6); tick(x,ya); tick(x,yb)
    o.append(f'<text x="{x-8 if side=="right" else x+8:.1f}" y="{(ya+yb)/2:.1f}" font-size="15" font-weight="500" text-anchor="middle" fill="{K}" transform="rotate(-90 {x-8 if side=="right" else x+8:.1f} {(ya+yb)/2:.1f})">{label}</text>')
dimh(X(0),X(flat),FLOOR+44,"14'-0\"",FLOOR)
dimh(X(flat),X(L),FLOOR+44,"2'-0\" R",FLOOR)
dimh(X(-OH),X(L+OH),FLOOR+80,"16'-3\" OVERALL",FLOOR)

# ---------- level markers ----------
LX=X(L+30)+18
def level(y,name,val,x_from=None):
    ln((x_from if x_from is not None else X(L+OH))+10,y,LX+70,y,0.5,K,'6 4')
    o.append(f'<path d="M{LX+70:.1f} {y:.1f} l-8 -10 h16 z" fill="{K}"/>')
    o.append(f'<path d="M{LX+70:.1f} {y:.1f} l-8 -10 h8 z" fill="{PAPER}" stroke="{K}" stroke-width="0.8"/>')
    tx(LX+86,y-14,name,13,'start',700,K,1.2)
    tx(LX+86,y+4,val,15)
level(Y(120),'CLG','10\'-0" A.F.F.',X(L+14)-10)
level(Y(BBH),'T.O. BACK BAR','9\'-0" A.F.F.',X(BBR))
level(Y(BH),'T.O. BAR','3\'-6" A.F.F.')
level(FLOOR,'FIN. FLOOR','0\'-0"',X(L+30)-10)

# ---------- keynote tags ----------
def tag(n,tx_,ty_,px,py):
    ln(tx_,ty_,px,py,0.6); o.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="2.2" fill="{K}"/>')
    o.append(f'<rect x="{tx_-13:.1f}" y="{ty_-13:.1f}" width="26" height="26" transform="rotate(45 {tx_:.1f} {ty_:.1f})" fill="{PAPER}" stroke="{K}" stroke-width="1.1"/>')
    tx(tx_,ty_+5.5,str(n),15,'middle',700)
tag(1,X(-24),Y(BH+16),X(10),Y(BH)+th_/2)
tag(2,X(-24),Y(22),X(4.5),Y(22))
tag(3,X(-24),Y(1),X(3),Y(2))
tag(4,X(BBL-18),Y(96),X(BBL)+3,Y(96))
tag(5,X(BBL-18),Y(60),X(BBL+4)+2,Y(60))
tag(6,X(56),Y(104),X(70)-14,Y(86)+12)
tag(7,X(L+18),Y(30),X(L-1.2),Y(30))

# ---------- drawing title ----------
ty=1022
circ(X(0)+26,ty,26,1.6)
ln(X(0),ty,X(0)+52,ty,1.2)
tx(X(0)+26,ty-6,"1",17,'middle',700)
tx(X(0)+26,ty+18,"A-201",11,'middle',700)
tx(X(0)+68,ty-3,"BAR ELEVATION",22,'start',700,K,1.5)
ln(X(0)+68,ty+6,X(0)+430,ty+6,2.2)
tx(X(0)+68,ty+28,"SCALE 1/2\" = 1'-0\"",14,'start',500,K,0.8)

# ---------- 2  BAR PLAN (small, bottom right) ----------
S2=2.1; PX0=880; PY0=1022; D=24
PX=lambda i: PX0+i*S2; PY=lambda i: PY0+i*S2   # i along length, depth measured down from back edge
# bar footprint: straight run then quarter-circle return on the front right corner
o.append(f'<path d="M{PX(0):.1f} {PY(0):.1f} H{PX(L):.1f} V{PY(D-R):.1f} A{R*S2:.1f} {R*S2:.1f} 0 0 1 {PX(L-R):.1f} {PY(D):.1f} H{PX(0):.1f} Z" fill="{PAPER}" stroke="{K}" stroke-width="1.8"/>')
# top overhang, dashed
o.append(f'<path d="M{PX(-OH):.1f} {PY(-OH):.1f} H{PX(L+OH):.1f} V{PY(D-R):.1f} A{(R+OH)*S2:.1f} {(R+OH)*S2:.1f} 0 0 1 {PX(L-R):.1f} {PY(D+OH):.1f} H{PX(-OH):.1f} Z" fill="none" stroke="{K}" stroke-width="0.6" stroke-dasharray="5 4"/>')
# slat rhythm along the front face
xx=0
while xx<L-R: ln(PX(xx),PY(D)-3,PX(xx),PY(D),0.5); xx+=3
tx(PX(L/2),PY(D/2)+5,'BAR',12,'middle',700,K,1.6)
# elevation cut arrow, keyed to drawing 1
ax,ay=PX(158),PY(D)+22
circ(ax,ay,11,1.1); o.append(f'<path d="M{ax-5:.1f} {ay-9:.1f} L{ax:.1f} {ay-19:.1f} L{ax+5:.1f} {ay-9:.1f} Z" fill="{K}"/>')
tx(ax,ay+4.5,'1',12,'middle',700)
# plan title
pty=1124
circ(PX0+20,pty,20,1.4); ln(PX0,pty,PX0+40,pty,1)
tx(PX0+20,pty-5,'2',14,'middle',700); tx(PX0+20,pty+14,'A-201',9,'middle',700)
tx(PX0+54,pty-2,'BAR PLAN',17,'start',700,K,1.4)
ln(PX0+54,pty+5,PX0+300,pty+5,1.8)
tx(PX0+54,pty+24,'SCALE 1/4" = 1\'-0"',12,'start',500,K,0.8)

# ---------- notes (top of sheet) ----------
def notes(x,y,title,items,width_note=None):
    tx(x,y,title,13,'start',700,K,1.6)
    ln(x,y+8,x+330,y+8,1)
    yy=y+34
    for i,it in enumerate(items):
        tx(x,yy,f'{i+1}.',14,'start',700)
        for j,line in enumerate(it): tx(x+26,yy+j*19,line,14,'start',500)
        yy+=19*len(it)+7
notes(70,86,'GENERAL NOTES',[
  ['Verify all dimensions in field before','fabrication.'],
  ['All millwork fabricated and installed','by Studio Glagola.'],
  ['Wood finish to match approved sample.','Matte oil, no sheen.']])
notes(1090,86,'KEYNOTES',[
  ['Poured concrete top, eased edge,','1 1/2" overhang.'],
  ['Oak slat, 3" face, vertical grain.'],
  ['Recessed base, 4" high, painted.'],
  ['Back bar, painted open shelving.'],
  ['Glazed wine cabinet, framed door.'],
  ['Pendant by others, shown for reference.'],
  ['Curved return, 2\'-0" radius, slats','follow curve.']])

# ---------- title block strip ----------
tbw=W-34-TB; cx=TB+tbw/2
o.append(f'<svg x="{cx-46:.1f}" y="70" width="92" height="130" viewBox="1969 632 347 492" fill="{K}">{MONO}</svg>')
tx(cx,236,'STUDIO GLAGOLA',17,'middle',700,K,2.4)
tx(cx,258,'CUSTOM MILLWORK',12,'middle',500,K,2.2)
ln(TB,290,W-34,290,1.2)
rows=[('PROJECT',['Bar at Decant']),('LOCATION',['Hurleyville, NY']),('CLIENT',['Decant Wine &amp; Spirits']),
      ('DRAWING',['Bar elevation']),('SCALE',['1/2" = 1\'-0"']),('DATE',['11.20.2026']),('DRAWN BY',['SG'])]
y=290
for lab,vals in rows:
    tx(TB+18,y+24,lab,11,'start',700,K,1.6)
    for j,v in enumerate(vals): tx(TB+18,y+48+j*22,v,19,'start',500)
    y+=70; ln(TB,y,W-34,y,0.6)
# revisions
tx(TB+18,y+24,'REVISIONS',11,'start',700,K,1.6)
for i,(r_,d_,n_) in enumerate([('0','11.20.26','Issued for review')]):
    tx(TB+18,y+48,r_,14,'start',700); tx(TB+40,y+48,d_,14,'start',500); tx(TB+120,y+48,n_,14,'start',500)
y+=80; ln(TB,y,W-34,y,1.2)
# sheet number
tx(TB+18,H_-34-118,'SHEET',11,'start',700,K,1.6)
tx(TB+14,H_-34-40,'A-201',76,'start',700,K,-1)
ln(TB,H_-34-150,W-34,H_-34-150,1.2)

svg=('<svg class="sg-sheet" viewBox="0 0 %d %d" xmlns="http://www.w3.org/2000/svg" role="img" '
     'aria-label="Studio Glagola shop drawing sheet A-201, a dimensioned elevation of the oak slat bar with a concrete top at Decant, with keynotes, general notes and a title block" '
     'font-family="neue-haas-grotesk-display, \'Helvetica Neue\', Helvetica, Arial, sans-serif">\n' % (W,H_)) + '\n'.join(o) + '\n</svg>\n'
open(os.path.join(HERE,'sg-sheet.svg'),'w').write(svg)
print(len(svg)//1024,'KB')
