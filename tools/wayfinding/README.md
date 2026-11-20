# Endeavor wayfinding mockups

`signs.html` lays out the sign family with the locally installed ES Klarheit Grotesk
(~/Library/Fonts/ES Klarheit) and Google Material Symbols Rounded. The font files are
only used for rendering; no font is published with the site.

Render the four page images (then convert to JPG in images/):

    node tools/wayfinding/render.mjs "$PWD/tools/wayfinding/signs.html" /tmp/out "#c-lobby" "#c-room" "#c-exterior" "#c-overhead"

Export each sign as a 2x transparent PNG for Envato mockups:

    node tools/wayfinding/export.mjs "$PWD/tools/wayfinding/signs.html" ~/Desktop/endeavor-wayfinding-signs
