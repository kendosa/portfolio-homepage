/* ── Mobile menu ──────────────────────────────────────────────── */
const toggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function setToggleLabel(label) {
  toggle.innerHTML = `<span class="nav-paren">(</span><span class="nav-first">${label[0]}</span><span class="nav-rest">${label.slice(1)}</span><span class="nav-paren">)</span>`;
}

setToggleLabel('Menu');

toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  setToggleLabel(open ? 'Close' : 'Menu');
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    setToggleLabel('Menu');
  });
});

/* Close mobile menu instantly after 2px of browser widening */
let lastWidth = window.innerWidth;

window.addEventListener('resize', () => {
  const w = window.innerWidth;
  if (toggle.classList.contains('open') && w >= lastWidth + 2) {
    mobileMenu.style.display = 'none';
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    setToggleLabel('Menu');
    requestAnimationFrame(() => { mobileMenu.style.display = ''; });
  }
  lastWidth = w;
});

/* ── Nav collapse: (W) default → (Work) on hover ──────────────── */
document.querySelectorAll('.nav-links a').forEach(link => {
  const text = link.textContent.trim();
  link.innerHTML = `<span class="nav-paren">(</span><span class="nav-first">${text[0]}</span><span class="nav-rest">${text.slice(1)}</span><span class="nav-paren">)</span>`;
});

/* ── Custom cursor ─────────────────────────────────────────────── */
/* Always create the element; CSS @media (hover:hover) controls visibility */
const dot = document.createElement('div');
dot.id = 'cursor-dot';
document.body.appendChild(dot);

document.addEventListener('mousemove', e => {
  dot.style.left = e.clientX + 'px';
  dot.style.top  = e.clientY + 'px';
  dot.classList.add('visible');
});

document.addEventListener('mouseleave', () => dot.classList.remove('visible'));

/* ── Gradient palette toggle circle ────────────────────────────── */
(function () {
  const palettes = [
    ['rgba(90, 140, 190, 0.34)',  'rgba(240, 158, 52, 0.32)' ],  // 0: sunset (default)
    ['rgba(131, 131, 131, 0.34)', 'rgba(170, 170, 170, 0.32)'],  // 1: grayscale
    null,                                                          // 2: dark lava (blobs handle color)
    ['rgba(31, 68, 46, 0.38)',    'rgba(244, 242, 229, 0.72)'],  // 3: forest + cream
  ];
  let state = 0;
  let lavaRaf = null;
  let lavaBlobs = null;

  const circle = document.createElement('span');
  circle.id = 'grad-toggle';
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) navLinks.insertBefore(circle, navLinks.firstChild);

  function startLava() {
    if (lavaRaf) return;
    const bg = document.getElementById('lava-bg');
    if (!bg) return;

    if (!lavaBlobs) {
      ['lb1', 'lb2', 'lb3', 'lb4'].forEach(id => {
        const el = document.createElement('div');
        el.className = 'lava-blob';
        el.id = id;
        bg.appendChild(el);
      });
      lavaBlobs = Array.from(bg.querySelectorAll('.lava-blob'));
    }

    function tick(t) {
      if (!document.body.classList.contains('dark')) { lavaRaf = null; return; }
      const vw = window.innerWidth, vh = window.innerHeight;

      // Blob 1 — blue, center-left drifter
      let x = 0.35 + Math.sin(t * 0.00025) * 0.30 + Math.cos(t * 0.00047) * 0.08;
      let y = 0.40 + Math.cos(t * 0.00031) * 0.35 + Math.sin(t * 0.00041) * 0.10;
      let w = (0.44 + Math.sin(t * 0.00037) * 0.14) * vh;
      let h = (0.38 + Math.cos(t * 0.00029) * 0.12) * vh;
      lavaBlobs[0].style.cssText = `width:${w|0}px;height:${h|0}px;left:${(x*vw-w/2)|0}px;top:${(y*vh-h/2)|0}px`;

      // Blob 2 — amber, center-right drifter
      x = 0.65 + Math.sin(t * 0.00033 + 2.0) * 0.26 + Math.cos(t * 0.00053) * 0.07;
      y = 0.55 + Math.cos(t * 0.00027 + 1.4) * 0.30 + Math.sin(t * 0.00039) * 0.09;
      w = (0.40 + Math.cos(t * 0.00041 + 0.8) * 0.13) * vh;
      h = (0.34 + Math.sin(t * 0.00035 + 1.1) * 0.12) * vh;
      lavaBlobs[1].style.cssText = `width:${w|0}px;height:${h|0}px;left:${(x*vw-w/2)|0}px;top:${(y*vh-h/2)|0}px`;

      // Blob 3 — blue, upper traveler
      x = 0.55 + Math.sin(t * 0.00041 + 3.5) * 0.24 + Math.cos(t * 0.00029) * 0.09;
      y = 0.22 + Math.cos(t * 0.00045 + 2.2) * 0.28 + Math.sin(t * 0.00021) * 0.12;
      w = (0.38 + Math.sin(t * 0.00031 + 2.0) * 0.15) * vh;
      h = (0.42 + Math.cos(t * 0.00047 + 0.4) * 0.14) * vh;
      lavaBlobs[2].style.cssText = `width:${w|0}px;height:${h|0}px;left:${(x*vw-w/2)|0}px;top:${(y*vh-h/2)|0}px`;

      // Blob 4 — amber, lower wanderer
      x = 0.42 + Math.cos(t * 0.00047 + 1.0) * 0.22 + Math.sin(t * 0.00059) * 0.07;
      y = 0.75 + Math.sin(t * 0.00035 + 0.7) * 0.20 + Math.cos(t * 0.00023) * 0.09;
      w = (0.36 + Math.cos(t * 0.00027 + 1.4) * 0.12) * vh;
      h = (0.38 + Math.sin(t * 0.00039 + 1.8) * 0.14) * vh;
      lavaBlobs[3].style.cssText = `width:${w|0}px;height:${h|0}px;left:${(x*vw-w/2)|0}px;top:${(y*vh-h/2)|0}px`;

      lavaRaf = requestAnimationFrame(tick);
    }
    lavaRaf = requestAnimationFrame(tick);
  }

  function stopLava() {
    if (lavaRaf) { cancelAnimationFrame(lavaRaf); lavaRaf = null; }
  }

  circle.addEventListener('mouseenter', () => {
    state = (state + 1) % palettes.length;
    if (palettes[state]) {
      document.body.style.setProperty('--blob1', palettes[state][0]);
      document.body.style.setProperty('--blob2', palettes[state][1]);
    }
    const isDark = state === 2;
    document.body.classList.toggle('dark', isDark);
    document.body.classList.toggle('forest', state === 3);
    if (isDark) startLava(); else stopLava();
  });
}());

/* Grow on link, button, or image hover — exclude squiggle tracks */
document.addEventListener('mouseover', e => {
  if (e.target.closest('.squiggle-track')) return;
  if (e.target.closest('a, button, img')) dot.classList.add('hovered');
});
document.addEventListener('mouseout', e => {
  const to = e.relatedTarget;
  if (!to || to.closest('.squiggle-track') || !to.closest('a, button, img')) dot.classList.remove('hovered');
});


