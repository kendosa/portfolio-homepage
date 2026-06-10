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

/* ── Nav hide on scroll-down, show on scroll-up ─────────────────── */
const siteHeader = document.querySelector('.site-header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > lastScrollY && y > 80 && !toggle.classList.contains('open')) {
    siteHeader.classList.add('nav-hidden');
  } else {
    siteHeader.classList.remove('nav-hidden');
  }
  lastScrollY = y;
}, { passive: true });

/* ── One-shot scroll reveal for individual card images ──────────── */
const imgWraps = document.querySelectorAll('.project-card .img-wrap');
imgWraps.forEach(el => el.classList.add('p-reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries
    .filter(e => e.isIntersecting)
    .forEach((entry, i) => {
      entry.target.style.transitionDelay = `${i * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.08 });

imgWraps.forEach(el => revealObserver.observe(el));

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

/* Grow on link, button, or image hover — exclude squiggle tracks */
document.addEventListener('mouseover', e => {
  if (e.target.closest('.squiggle-track')) return;
  if (e.target.closest('a, button, img')) dot.classList.add('hovered');
});
document.addEventListener('mouseout', e => {
  const to = e.relatedTarget;
  if (!to || to.closest('.squiggle-track') || !to.closest('a, button, img')) dot.classList.remove('hovered');
});

/* ── Cover image gallery scrub on hover ─────────────────────── */
document.querySelectorAll('.img-wrap[data-gallery]').forEach(wrap => {
  const imgs = wrap.dataset.gallery.split(',');
  if (imgs.length < 2) return;

  const overlay = document.createElement('img');
  overlay.className = 'gallery-overlay';
  overlay.alt = '';
  wrap.appendChild(overlay);

  let currentIdx = -1;
  let lastX = null;
  let preloaded = false;

  wrap.addEventListener('mouseenter', () => {
    lastX = null; // first mousemove sets baseline — no image change on entry
    if (!preloaded) {
      imgs.forEach(src => { const p = new Image(); p.src = src; });
      preloaded = true;
    }
  });

  wrap.addEventListener('mousemove', e => {
    if (lastX === null) {
      lastX = e.clientX; // establish baseline, don't swap
      return;
    }
    const deltaX = e.clientX - lastX;
    lastX = e.clientX;
    if (deltaX <= 0) return; // only respond to rightward movement

    const rect = wrap.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(0.9999, (e.clientX - rect.left) / rect.width));
    const idx = Math.floor(ratio * imgs.length);
    if (idx === currentIdx) return;
    currentIdx = idx;
    if (idx === 0) {
      overlay.style.opacity = '0';
    } else {
      overlay.src = imgs[idx];
      overlay.style.opacity = '1';
    }
  });

  wrap.addEventListener('mouseleave', () => {
    currentIdx = -1;
    lastX = null;
    overlay.style.opacity = '0';
  });
});


