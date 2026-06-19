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

const revealObserver = new IntersectionObserver((entries) => {
  entries
    .filter(e => e.isIntersecting)
    .forEach((entry, i) => {
      entry.target.style.transitionDelay = `${i * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.08 });

imgWraps.forEach((el, i) => {
  if (i === 0) return; // first card stays visible on load
  el.classList.add('p-reveal');
  revealObserver.observe(el);
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

/* Grow on link, button, or image hover — exclude squiggle tracks */
document.addEventListener('mouseover', e => {
  if (e.target.closest('.squiggle-track')) return;
  if (e.target.closest('a, button, img')) dot.classList.add('hovered');
});
document.addEventListener('mouseout', e => {
  const to = e.relatedTarget;
  if (!to || to.closest('.squiggle-track') || !to.closest('a, button, img')) dot.classList.remove('hovered');
});

/* ── Category tag filter ─────────────────────────────────────── */
const grid = document.querySelector('.grid');
document.querySelectorAll('.tag-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tag-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    grid.classList.toggle('filtered', filter !== 'all');
    document.querySelectorAll('.project-card').forEach(card => {
      const cats = (card.dataset.category || '').split(',').map(s => s.trim());
      card.style.display = (filter === 'all' || cats.includes(filter)) ? '' : 'none';
    });
  });
});

/* ── Cover image gallery — position-based zone hover (Fuzzco-style) ── */

document.querySelectorAll('.img-wrap[data-gallery]').forEach(wrap => {
  const imgs = wrap.dataset.gallery.split(',');
  if (imgs.length < 2) return;
  const positions = wrap.dataset.positions ? wrap.dataset.positions.split('|') : [];

  // Pre-render one absolutely-positioned frame per image (index 0 = base img already in DOM)
  const frames = imgs.map((src, i) => {
    if (i === 0) return null;

    const frame = document.createElement('div');
    frame.className = 'gallery-frame';

    const srcs = src.split('|');
    if (srcs.length > 1) {
      frame.classList.add('two-up');
      srcs.forEach(s => {
        const img = document.createElement('img');
        img.src = s; img.alt = '';
        frame.appendChild(img);
      });
    } else {
      const img = document.createElement('img');
      img.src = srcs[0]; img.alt = '';
      img.style.objectPosition = positions[i] || 'center';
      frame.appendChild(img);
    }

    wrap.appendChild(frame);
    return frame;
  });

  let currentIdx = 0;
  let lastX = 0;
  let lastY = 0;

  function getZone(clientX) {
    const { left, width } = wrap.getBoundingClientRect();
    return Math.min(imgs.length - 1, Math.max(0, Math.floor((clientX - left) / width * imgs.length)));
  }

  function showFrame(idx) {
    frames.forEach((frame, i) => {
      if (frame) frame.classList.toggle('active', i === idx);
    });
  }

  wrap.addEventListener('mouseenter', e => {
    lastX = e.clientX;
    lastY = e.clientY;
    currentIdx = 0;
    // don't show a frame on entry — wait for horizontal movement
  });

  wrap.addEventListener('mousemove', e => {
    const dx = Math.abs(e.clientX - lastX);
    const dy = Math.abs(e.clientY - lastY);
    lastX = e.clientX;
    lastY = e.clientY;

    if (dx <= dy) return; // vertical-dominant move, don't swap

    const idx = getZone(e.clientX);
    if (idx === currentIdx) return;
    currentIdx = idx;
    showFrame(idx);
  });

  wrap.addEventListener('mouseleave', () => {
    currentIdx = 0;
    frames.forEach(frame => { if (frame) frame.classList.remove('active'); });
  });

  // Touch: swipe left/right scrubs through the same frames
  let touchStartX = 0;
  let touchStartY = 0;
  let touchDirLocked = false;
  let touchScrubbing = false;

  wrap.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchDirLocked = false;
    touchScrubbing = false;
    currentIdx = 0;
  }, { passive: true });

  wrap.addEventListener('touchmove', e => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX);
    const dy = Math.abs(e.touches[0].clientY - touchStartY);

    if (!touchDirLocked) {
      if (dx < 8 && dy < 8) return; // wait for clear intent
      touchDirLocked = true;
      touchScrubbing = dx > dy; // commit to horizontal or vertical
    }

    if (!touchScrubbing) return; // vertical — let the page scroll

    e.preventDefault();

    const idx = getZone(e.touches[0].clientX);
    if (idx !== currentIdx) {
      currentIdx = idx;
      showFrame(idx);
    }
  }, { passive: false });

  wrap.addEventListener('touchend', () => {
    touchDirLocked = false;
    touchScrubbing = false;
    currentIdx = 0;
    frames.forEach(frame => { if (frame) frame.classList.remove('active'); });
  });
});


