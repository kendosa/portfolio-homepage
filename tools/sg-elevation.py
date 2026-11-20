import math
S=3.9                 # px per inch
FLOOR=560; X0=120     # floor line, left end of bar
L=192; H=42; R=24     # bar length, height, return radius (inches)
TOP=2; OH=1.5         # top thickness, overhang
BBL, BBR, BBH = 36, 162, 108   # back bar from/to (inches from bar left), height
K='#111'; G='#9a958c'
o=[]
def ln(x1,y1,x2,y2,w=1,c=K,d=None): o.append(f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{c}" stroke-width="{w}"'+(f' stroke-dasharray="{d}"' if d else '')+'/>')
def rect(x,y,w,h,sw=1,c=K,fill='none'): o.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{fill}" stroke="{c}" stroke-width="{sw}"/>')
def tx(x,y,t,size=17,anchor='start',weight=500,c=K,ls=0): o.append(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" fill="{c}"'+(f' letter-spacing="{ls}"' if ls else '')+f'>{t}</text>')
X=lambda inch: X0+inch*S
Y=lambda inch: FLOOR-inch*S

# ---- ceiling + pendants (light) ----
for px in [70, 116, 168]:
    ln(X(px),70,X(px),Y(86),0.8,G)
    o.append(f'<path d="M{X(px)-7:.1f} {Y(86):.1f} h14 l3 7 q11 4 12 18 h-44 q1 -14 12 -18 z" fill="none" stroke="{G}" stroke-width="1"/>'.replace('h-44','h-50'))

# ---- back bar (light, behind) ----
bx1,bx2=X(BBL),X(BBR)
rect(bx1,Y(BBH),bx2-bx1,Y(H)-Y(BBH),1.1,G)
for bay in [BBL+42, BBL+84]:                   # bay uprights
    ln(X(bay),Y(BBH),X(bay),Y(H),1.1,G)
for sh in [56,72,88,100]:                       # shelves
    ln(bx1,Y(sh),bx2,Y(sh),1,G)
# glazed wine cabinet, left bay, low
cx1,cx2=X(BBL+3),X(BBL+39)
rect(cx1,Y(72)+3,cx2-cx1,Y(44)-Y(72)-3,1,G)
for m in [1/3,2/3]: ln(cx1,Y(72)+3+(Y(44)-Y(72)-3)*m,cx2,Y(72)+3+(Y(44)-Y(72)-3)*m,0.6,G)
ln((cx1+cx2)/2,Y(72)+3,(cx1+cx2)/2,Y(44),0.6,G)
# a few bottles + books as quick ticks on shelves
import random; random.seed(7)
for sh,lo,hi in [(56,BBL+44,BBL+82),(72,BBL+88,BBL+124),(88,BBL+46,BBL+80),(88,BBL+90,BBL+120)]:
    x=lo
    while x<hi:
        w=random.choice([1.2,1.5,2.2]); h=random.choice([7,8,9,10])
        rect(X(x),Y(sh+h),w*S,h*S,0.6,G); x+=w+random.choice([0,0,0.3,3])

# ---- bar (heavy, in front) ----
face_top=H-TOP
flatEnd=L-R
o.append(f'<rect x="{X(0):.1f}" y="{Y(face_top):.1f}" width="{L*S:.1f}" height="{face_top*S:.1f}" fill="#f0ece6"/>')  # hide back bar behind
# slats on flat run, 3" face
x=0
while x<flatEnd-0.01:
    ln(X(x),Y(face_top),X(x),FLOOR,0.9); x+=3
# slats on the curved return: equal 3" arcs, foreshortened in elevation
n=int((math.pi/2*R)/3)
for i in range(1,n+1):
    th=i*3/R
    if th>math.pi/2: break
    ln(X(flatEnd+R*math.sin(th)),Y(face_top),X(flatEnd+R*math.sin(th)),FLOOR,0.9)
rect(X(0),Y(face_top),L*S,face_top*S,1.8)      # bar body outline
# concrete top with overhang
rect(X(-OH),Y(H),(L+OH*2)*S,TOP*S,1.8,K,'#f0ece6')

# ---- floor ----
ln(40,FLOOR,960,FLOOR,1.6)
for hx in range(44,960,9): ln(hx,FLOOR,hx-7,FLOOR+7,0.6)

# ---- dimensions ----
def dimh(xa,xb,y,label):
    ln(xa,y,xb,y,0.8)
    for xx in (xa,xb): ln(xx-4,y+4,xx+4,y-4,1.2); ln(xx,y-7,xx,y+7,0.6)
    mid=(xa+xb)/2; w=len(label)*8.6+20
    o.append(f'<rect x="{mid-w/2:.1f}" y="{y-10:.1f}" width="{w}" height="20" fill="#f0ece6"/>'); tx(mid,y+6,label,17,'middle')
def dimv(x,ya,yb,label,side='right'):
    ln(x,ya,x,yb,0.8)
    for yy in (ya,yb): ln(x-4,yy+4,x+4,yy-4,1.2); ln(x-7,yy,x+7,yy,0.6)
    tx(x+12 if side=='right' else x-12,(ya+yb)/2+6,label,17,'start' if side=='right' else 'end')
dimh(X(-OH),X(L+OH),FLOOR+66,"16'-3\" overall")
dimh(X(0),X(flatEnd),FLOOR+38,"14'-0\" straight run")
dimh(X(flatEnd),X(L),FLOOR+38,"2'-0\" R")
dimv(X(L+OH)+26,Y(H),FLOOR,"3'-6\"")
dimv(bx1-22,Y(BBH),Y(H),"9'-0\"","left")

# ---- leaders ----
def leader(x1,y1,x2,y2,label,anchor='start'):
    ln(x1,y1,x2,y2,0.7); o.append(f'<circle cx="{x1:.1f}" cy="{y1:.1f}" r="2" fill="{K}"/>'); ln(x2,y2,x2+(36 if anchor=='start' else -36),y2,0.7)
    tx(x2+(42 if anchor=='start' else -42),y2+4.5,label,13,anchor)
leader(X(150),Y(H)+TOP*S/2+1, X(150)+40, Y(H)+70+0, '')  # placeholder removed below
o.pop(); o.pop(); o.pop(); o.pop()
leader(X(10),Y(20),X(10)-0,Y(20),'')
o.pop(); o.pop(); o.pop(); o.pop()

svg_lines='\n'.join(o)
labels=[
 (X(0),Y(H)-14,'BAR FRONT'),(X(BBL)+2,Y(BBH)-10,'BACK BAR'),
]
lab='\n'.join(f'<text x="{x:.1f}" y="{y:.1f}" font-size="14" font-weight="700" letter-spacing="1.6" fill="{K}">{t}</text>' for x,y,t in labels)
svg=f'''<svg class="sg-elev" viewBox="30 70 950 590" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Elevation drawing of the bar at Decant, an oak slat bar with a concrete top and a curved return, with open back bar shelving behind" font-family="neue-haas-grotesk-display, 'Helvetica Neue', Helvetica, Arial, sans-serif">
{svg_lines}
{lab}
</svg>'''
open('elev.svg','w').write(svg)
print(len(svg),'bytes')
