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
    ['rgba(90, 140, 190, 0.44)', 'rgba(240, 158, 52, 0.42)'],  // 0: sunset gradient (default)
    ['rgba(90, 140, 190, 0.44)', 'rgba(240, 158, 52, 0.42)'],  // 1: A&A (#1b1b1b / #fcfcfc)
    ['rgba(90, 140, 190, 0.44)', 'rgba(240, 158, 52, 0.42)'],  // 2: stone (#d7d5d6 / #1b1b1b)
  ];

  let state = parseInt(localStorage.getItem('palette') || '0', 10);
  if (state > palettes.length - 1) state = 0;

  function applyState(s) {
    document.body.style.setProperty('--blob1', palettes[s][0]);
    document.body.style.setProperty('--blob2', palettes[s][1]);
    document.body.style.backgroundImage = s > 0 ? 'none' : '';
    document.body.classList.toggle('aa',    s === 1);
    document.body.classList.toggle('stone', s === 2);
    document.body.classList.remove('forest', 'ember');
  }

  if (state > 0) applyState(state);

  const circle = document.createElement('span');
  circle.id = 'grad-toggle';
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) navLinks.insertBefore(circle, navLinks.firstChild);

  circle.addEventListener('mouseenter', () => {
    state = (state + 1) % palettes.length;
    applyState(state);
    localStorage.setItem('palette', state);
  });
}());

/* ── Gradient drift for project/info pages ─────────────────────── */
/* index.html sets window._hasGradientAnimation = true and runs its  */
/* own richer tick, so this only fires on pages that don't have one. */
requestAnimationFrame(() => {
  if (window._hasGradientAnimation) return;
  const body = document.body;
  let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
  let cx = -50, cy = -50, tcx = -50, tcy = -50;
  function lerp(a, b, t) { return a + (b - a) * t; }
  document.addEventListener('mousemove', e => {
    tmx = e.clientX / window.innerWidth;
    tmy = e.clientY / window.innerHeight;
    tcx = e.clientX / window.innerWidth  * 100;
    tcy = e.clientY / window.innerHeight * 100;
  });
  document.addEventListener('mouseleave', () => { tcx = -50; tcy = -50; });
  (function tick() {
    const t = Date.now() / 1000;
    mx = lerp(mx, tmx, 0.04);
    my = lerp(my, tmy, 0.04);
    cx = lerp(cx, tcx, 0.18);
    cy = lerp(cy, tcy, 0.18);
    body.style.setProperty('--g1x', (28 + mx * 6 + Math.sin(t * 0.22) * 10).toFixed(2) + '%');
    body.style.setProperty('--g1y', (35 + my * 8 + Math.cos(t * 0.17) * 14).toFixed(2) + '%');
    body.style.setProperty('--g2x', (72 - mx * 6 + Math.cos(t * 0.19) * 10).toFixed(2) + '%');
    body.style.setProperty('--g2y', (65 - my * 8 + Math.sin(t * 0.14) * 14).toFixed(2) + '%');
    body.style.setProperty('--mx',  cx.toFixed(2) + '%');
    body.style.setProperty('--my',  cy.toFixed(2) + '%');
    requestAnimationFrame(tick);
  }());
});

/* Grow on link, button, or image hover — exclude squiggle tracks */
document.addEventListener('mouseover', e => {
  if (e.target.closest('.squiggle-track')) return;
  if (e.target.closest('a, button, img')) dot.classList.add('hovered');
});
document.addEventListener('mouseout', e => {
  const to = e.relatedTarget;
  if (!to || to.closest('.squiggle-track') || !to.closest('a, button, img')) dot.classList.remove('hovered');
});


