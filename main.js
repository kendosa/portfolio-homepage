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
    ['rgba(90, 140, 190, 0.34)', 'rgba(240, 158, 52, 0.32)'],  // 0: sunset gradient (default)
    ['rgba(31, 68, 46, 0.38)',   'rgba(244, 242, 229, 0.72)'],  // 1: forest + cream
    ['rgba(90, 140, 190, 0.34)', 'rgba(240, 158, 52, 0.32)'],  // 2: A&A (#fcfcfc / #1b1b1b)
    ['rgba(114, 211, 83, 0.5)',  'rgba(34, 31, 32, 0.3)'],     // 3: green (#72d353 / #221f20)
  ];
  let state = 0;

  const circle = document.createElement('span');
  circle.id = 'grad-toggle';
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) navLinks.insertBefore(circle, navLinks.firstChild);

  circle.addEventListener('mouseenter', () => {
    state = (state + 1) % palettes.length;
    document.body.style.setProperty('--blob1', palettes[state][0]);
    document.body.style.setProperty('--blob2', palettes[state][1]);
    // solid-color states: override the inline <style> gradient via inline style
    document.body.style.backgroundImage = state > 0 ? 'none' : '';
    document.body.classList.toggle('forest', state === 1);
    document.body.classList.toggle('aa', state === 2);
    document.body.classList.toggle('green', state === 3);
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


