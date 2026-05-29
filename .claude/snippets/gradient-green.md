# Green gradient (original / ashfall-inspired)

Saved from index.html and info.html before sunset color swap.

## index.html body background-image
```css
body {
  background-image:
    radial-gradient(circle 130px at var(--mx, -50%) var(--my, -50%), rgba(245, 244, 242, 0.82) 0%, transparent 100%),
    radial-gradient(ellipse 150% 40% at 50% 50%, rgba(245, 244, 242, var(--ct, 0)) 0%, transparent 100%),
    radial-gradient(ellipse 72% 52% at var(--g1x, 8%) var(--g1y, 2%), rgba(194, 237, 130, 0.38) 0%, transparent 70%),
    radial-gradient(ellipse 68% 50% at var(--g2x, 93%) var(--g2y, 3%), rgba(185, 231, 113, 0.48) 0%, transparent 65%);
  background-attachment: fixed;
}
```

## info.html body background-image
```css
body {
  background-image:
    radial-gradient(circle 130px at var(--mx, -50%) var(--my, -50%), rgba(245, 244, 242, 0.82) 0%, transparent 100%),
    radial-gradient(ellipse 72% 52% at var(--g1x, 8%) var(--g1y, 2%), rgba(194, 237, 130, 0.38) 0%, transparent 70%),
    radial-gradient(ellipse 68% 50% at var(--g2x, 93%) var(--g2y, 3%), rgba(185, 231, 113, 0.48) 0%, transparent 65%);
  background-attachment: fixed;
}
```

## Blob colors
- Blob 1: `rgba(194, 237, 130, 0.38)` — chartreuse/lime
- Blob 2: `rgba(185, 231, 113, 0.48)` — slightly deeper lime
- Mouse clear: `rgba(245, 244, 242, 0.82)` — background cream
