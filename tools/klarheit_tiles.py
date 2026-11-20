# Regenerates the Endeavor "A line everyone can finish" tiles as outlined ES Klarheit Grotesk (no font file is shipped).
# Edit WORDS, run: python3 tools/klarheit_tiles.py /tmp/tiles.frag, then swap the defs + tiles into endeavor-health.html.

import sys, re
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

D = "/Users/kennyphillips/Library/Fonts/ES Klarheit/"
FONTS = {"rm": D+"ESKlarheitGrotesk-Bk.ttf", "it": D+"ESKlarheitGrotesk-BkIt.ttf"}
WORDS = ["best health","recovery","first breath","communities","care","next step"]
SIZE, PAD, LH = 1000, 100, 1.12
LOGO_W = 520

class F:
    def __init__(s, key, path):
        s.key = key
        blob = hb.Blob.from_file_path(path); s.hbf = hb.Font(hb.Face(blob))
        s.tt = TTFont(path); s.gs = s.tt.getGlyphSet(); s.order = s.tt.getGlyphOrder()
        s.upem = s.tt['head'].unitsPerEm
    def shape(s, text):
        buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
        hb.shape(s.hbf, buf, {"kern": True, "liga": True})
        out, x = [], 0
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            out.append((s.order[info.codepoint], x + pos.x_offset, pos.y_offset)); x += pos.x_advance
        return out, x
fonts = {k: F(k, p) for k, p in FONTS.items()}
upem = fonts["rm"].upem
used = {}
def run(font, text, x0):
    glyphs, w = font.shape(text)
    for name, x, y in glyphs:
        gid = f"k{font.key}-{re.sub(r'[^A-Za-z0-9]', '_', name)}"
        if gid not in used:
            pen = SVGPathPen(font.gs); font.gs[name].draw(pen); used[gid] = pen.getCommands()
    return [(f"k{font.key}-{re.sub(r'[^A-Za-z0-9]', '_', n)}", x0 + x, y) for n, x, y in glyphs if used[f"k{font.key}-{re.sub(r'[^A-Za-z0-9]', '_', n)}"]], w

# pick one font size so the widest first line fits
avail = SIZE - 2*PAD
def line1(word):
    _, w1 = fonts["rm"].shape("Your "); _, w2 = fonts["it"].shape(word); return w1 + w2
widest = max(max(line1(w) for w in WORDS), fonts["rm"].shape("is our endeavor.")[1])
fs = min(122, avail * upem / widest)   # font size in tile units
sc = fs / upem
asc = fonts["rm"].tt['hhea'].ascent * sc
tiles = []
for word in WORDS:
    placed = []
    a, w = run(fonts["rm"], "Your ", 0); b, _ = run(fonts["it"], word, w)
    placed += [(g, x, y, 0) for g, x, y in a + b]
    c, _ = run(fonts["rm"], "is our endeavor.", 0)
    placed += [(g, x, y, 1) for g, x, y in c]
    uses = "".join(f'<use href="#{g}" transform="translate({PAD + x*sc:.1f} {PAD + fs*0.92 + line*fs*LH - y*sc:.1f}) scale({sc:.4f} -{sc:.4f})"/>' for g, x, y, line in placed)
    label = f"Your {word} is our endeavor."
    tiles.append(f'        <div class="eh-line-tile"><svg viewBox="0 0 {SIZE} {SIZE}" role="img" aria-label="{label}"><title>{label}</title>{uses}<use href="#eh-logo" x="{PAD}" y="{SIZE - PAD - LOGO_W*102/1243:.1f}" width="{LOGO_W}" height="{LOGO_W*102/1243:.1f}"/></svg></div>\n')
import os
_logo = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "images", "endeavor-logo.svg")).read()
_vb = re.search(r'viewBox="([^"]+)"', _logo).group(1)
_paths = "".join(re.sub(r'\s*fill="[^"]*"', "", m) for m in re.findall(r'<path[^>]*/>', _logo))
logo_symbol = f'<symbol id="eh-logo" viewBox="{_vb}">{_paths}</symbol>'
defs = '      <svg class="eh-klarheit-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>' + logo_symbol + "".join(f'<path id="{g}" d="{d}"/>' for g, d in used.items() if d) + '</defs></svg>\n'
sys.stdout.write(f"FS {fs:.1f}\n")
open(sys.argv[1], "w").write(defs + "|||" + "".join(tiles))
