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

/* ── Card title char-shift on hover (hover-capable devices only) ── */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    const title = card.querySelector('.card-title');
    if (!title) return;

    const text = title.textContent;
    title.innerHTML = [...text].map(ch =>
      `<span class="char">${ch === ' ' ? '&nbsp;' : ch}</span>`
    ).join('');
    const chars = [...title.querySelectorAll('.char')];

    const dur    = 280;
    const spread = 180;
    const perChar = spread / Math.max(chars.length, 1);
    let resetTimer = null;

    card.addEventListener('mouseenter', () => {
      if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
      chars.forEach((span, i) => {
        span.style.transitionDelay = `${i * perChar}ms`;
        span.style.transform = 'translateY(-76%)';
      });
      resetTimer = setTimeout(() => {
        chars.forEach(span => {
          span.style.transition = 'none';
          span.style.transitionDelay = '';
          span.style.transform = '';
        });
        requestAnimationFrame(() => {
          chars.forEach(span => { span.style.transition = ''; });
        });
        resetTimer = null;
      }, dur + spread + 20);
    });
  });
}

/* ── Tag filter: drag-to-scroll on desktop ──────────────────── */
(function () {
  const tf = document.querySelector('.tag-filter');
  if (!tf) return;
  let dragging = false, startX = 0, scrollStart = 0, moved = false;

  tf.addEventListener('mousedown', e => {
    dragging = true; moved = false;
    startX = e.clientX;
    scrollStart = tf.scrollLeft;
    tf.classList.add('is-dragging');
    e.preventDefault();
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 3) moved = true;
    tf.scrollLeft = scrollStart - dx;
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
    tf.classList.remove('is-dragging');
  });

  // Swallow clicks that were actually drags so filters don't fire
  tf.addEventListener('click', e => {
    if (moved) { e.stopPropagation(); moved = false; }
  }, true);
}());

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

  // Touch: drag-reveal swipe — current slides out, next slides in, snaps or reverts
  const baseImg = wrap.querySelector('img');

  function getEl(idx) {
    return idx === 0 ? baseImg : (frames[idx] || null);
  }

  let touchStartX = 0, touchStartY = 0;
  let touchDirLocked = false, touchIsHorizontal = false;
  let swipeDir = 0, incomingIdx = -1, wrapW = 0;

  wrap.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchDirLocked = false;
    touchIsHorizontal = false;
    swipeDir = 0;
    incomingIdx = -1;
    wrapW = wrap.offsetWidth;
  }, { passive: true });

  wrap.addEventListener('touchmove', e => {
    const rawDx = e.touches[0].clientX - touchStartX;
    const rawDy = e.touches[0].clientY - touchStartY;

    if (!touchDirLocked) {
      if (Math.abs(rawDx) < 8 && Math.abs(rawDy) < 8) return;
      touchDirLocked = true;
      touchIsHorizontal = Math.abs(rawDx) > Math.abs(rawDy);
    }
    if (!touchIsHorizontal) return;
    e.preventDefault();

    const dir = rawDx < 0 ? -1 : 1;

    // First horizontal move: lock in the incoming frame and position it
    if (incomingIdx === -1) {
      swipeDir = dir;
      const candidate = dir === -1
        ? Math.min(imgs.length - 1, currentIdx + 1)
        : Math.max(0, currentIdx - 1);
      if (candidate === currentIdx) return; // at boundary
      incomingIdx = candidate;

      const inEl = getEl(incomingIdx);
      const curEl = getEl(currentIdx);
      if (inEl) {
        inEl.style.transition = 'none';
        inEl.style.opacity = '1';
        inEl.style.transform = `translateX(${-dir * wrapW}px)`;
      }
      if (curEl) curEl.style.transition = 'none';
    }
    if (incomingIdx === -1) return;

    const curEl = getEl(currentIdx);
    const inEl  = getEl(incomingIdx);
    if (curEl) curEl.style.transform = `translateX(${rawDx}px)`;
    if (inEl)  inEl.style.transform  = `translateX(${-swipeDir * wrapW + rawDx}px)`;
  }, { passive: false });

  wrap.addEventListener('touchend', e => {
    if (!touchDirLocked || !touchIsHorizontal || incomingIdx === -1) {
      incomingIdx = -1;
      return;
    }

    const dx = e.changedTouches[0].clientX - touchStartX;
    const committed = Math.abs(dx) > wrapW * 0.25;
    const ease = 'transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    const prevIdx = currentIdx;
    const savedIncoming = incomingIdx;
    const curEl = getEl(currentIdx);
    const inEl  = getEl(incomingIdx);

    if (committed) {
      if (curEl) { curEl.style.transition = ease; curEl.style.transform = `translateX(${swipeDir * wrapW}px)`; }
      if (inEl)  { inEl.style.transition  = ease; inEl.style.transform  = 'translateX(0)'; }
      currentIdx = incomingIdx;
      incomingIdx = -1;

      setTimeout(() => {
        showFrame(currentIdx); // add .active before removing inline opacity
        if (inEl)  { inEl.style.transition = 'none'; inEl.style.transform = ''; inEl.style.opacity = ''; }
        if (curEl) { curEl.style.transition = 'none'; curEl.style.transform = ''; }
        requestAnimationFrame(() => {
          if (inEl)  inEl.style.transition  = '';
          if (curEl) curEl.style.transition = '';
        });
      }, 230);
    } else {
      if (curEl) { curEl.style.transition = ease; curEl.style.transform = 'translateX(0)'; }
      if (inEl)  { inEl.style.transition  = ease; inEl.style.transform  = `translateX(${-swipeDir * wrapW}px)`; }
      incomingIdx = -1;

      setTimeout(() => {
        const inElSaved = getEl(savedIncoming);
        if (curEl)     { curEl.style.transition = 'none'; curEl.style.transform = ''; }
        if (inElSaved) { inElSaved.style.transition = 'none'; inElSaved.style.transform = ''; inElSaved.style.opacity = ''; }
        requestAnimationFrame(() => {
          if (curEl)     curEl.style.transition     = '';
          if (inElSaved) inElSaved.style.transition = '';
        });
      }, 230);
    }
  });
});


