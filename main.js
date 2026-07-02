/* ── Animated favicon ────────────────────────────────────────── */
(function () {
  const SZ = 32;
  const letters = ['K', 'e', 'n'];
  const FG = '#ffffff';
  const INTERVAL = 700;

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SZ;
  const ctx = canvas.getContext('2d');

  const link = document.querySelector("link[rel='icon']") || (() => {
    const l = document.createElement('link'); l.rel = 'icon'; document.head.appendChild(l); return l;
  })();

  let fontSize = SZ, baselineY = SZ / 2;

  function calcFont() {
    let lo = 10, hi = 400;
    while (hi - lo > 0.5) {
      const mid = (lo + hi) / 2;
      ctx.font = `500 ${mid}px "neue-haas-grotesk-display","Helvetica Neue",Helvetica,Arial,sans-serif`;
      ctx.textBaseline = 'alphabetic';
      const m = ctx.measureText('K');
      if (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent < SZ) lo = mid; else hi = mid;
    }
    fontSize = Math.floor(lo);
    ctx.font = `500 ${fontSize}px "neue-haas-grotesk-display","Helvetica Neue",Helvetica,Arial,sans-serif`;
    const m = ctx.measureText('K');
    const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    baselineY = (SZ - h) / 2 + m.actualBoundingBoxAscent;
  }

  function draw(letter) {
    ctx.clearRect(0, 0, SZ, SZ);
    ctx.font = `500 ${fontSize}px "neue-haas-grotesk-display","Helvetica Neue",Helvetica,Arial,sans-serif`;
    ctx.fillStyle = FG;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(letter, SZ / 2, baselineY);
    link.type = 'image/png';
    link.href = canvas.toDataURL();
  }

  let idx = 0;

  document.fonts.ready.then(() => {
    calcFont();
    draw(letters[idx]);
    setInterval(() => { idx = (idx + 1) % letters.length; draw(letters[idx]); }, INTERVAL);
  });
})();

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
    const chars = [...title.textContent];
    const perChar = 160 / Math.max(chars.length, 1);
    title.innerHTML = '';
    chars.forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.dataset.char = ch === ' ' ? ' ' : ch;
      span.style.setProperty('--td', `${i * perChar}ms`);
      title.appendChild(span);
    });

    card.addEventListener('mouseenter', () => {
      title.classList.remove('char-reset');
      title.classList.add('char-animate');
    });

    card.addEventListener('mouseleave', () => {
      title.classList.add('char-reset');
      title.classList.remove('char-animate');
      requestAnimationFrame(() => title.classList.remove('char-reset'));
    });
  });

  // Logo: proximity-based independent char shift
  const logo = document.querySelector('.logo');
  if (logo) {
    const logoText = [...logo.textContent];
    logo.innerHTML = '';
    const charData = logoText.map(ch => {
      const span = document.createElement('span');
      span.className = 'char';
      const top = document.createElement('span');
      top.className = 'char-top';
      top.textContent = ch === ' ' ? '\u00a0' : ch;
      const bot = document.createElement('span');
      bot.className = 'char-bot';
      bot.textContent = ch === ' ' ? '\u00a0' : ch;
      span.appendChild(top);
      span.appendChild(bot);
      logo.appendChild(span);
      return { span, top, bot };
    });

    let entryCharIdx = 0;
    let enterAnimTimeout = null;

    logo.addEventListener('mouseenter', e => {
      if (enterAnimTimeout) { clearTimeout(enterAnimTimeout); enterAnimTimeout = null; }

      const rects = charData.map(({ span }) => span.getBoundingClientRect());

      // Find which char the cursor is over at entry
      const mx = e.clientX;
      let closest = 0, minDist = Infinity;
      rects.forEach((r, i) => {
        const d = Math.abs(mx - (r.left + r.width / 2));
        if (d < minDist) { minDist = d; closest = i; }
      });
      entryCharIdx = closest;

      // Snap all chars to initial (top visible, bot hidden) with no transition
      charData.forEach(({ top, bot }) => {
        top.style.transition = 'none';
        bot.style.transition = 'none';
        top.style.transform = 'translateY(0%)';
        bot.style.transform = 'translateY(100%)';
      });

      // Cascade to flipped state (top hidden, bot visible), radiating from entry char
      const dur = 200;
      const spread = 120;
      const maxDist = Math.max(entryCharIdx, charData.length - 1 - entryCharIdx);
      const perChar = maxDist > 0 ? spread / maxDist : 0;
      const easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      requestAnimationFrame(() => requestAnimationFrame(() => {
        charData.forEach(({ top, bot }, i) => {
          const delay = Math.abs(i - entryCharIdx) * perChar;
          top.style.transition = `transform ${dur}ms ${easing} ${delay}ms`;
          bot.style.transition = `transform ${dur}ms ${easing} ${delay}ms`;
          top.style.transform = 'translateY(-100%)';
          bot.style.transform = 'translateY(0%)';
        });
        enterAnimTimeout = setTimeout(() => {
          charData.forEach(({ top, bot }) => { top.style.transition = ''; bot.style.transition = ''; });
          enterAnimTimeout = null;
        }, dur + spread + 50);
      }));
    });

    logo.addEventListener('mouseleave', () => {
      if (enterAnimTimeout) { clearTimeout(enterAnimTimeout); enterAnimTimeout = null; }
      const dur = 300;
      const spread = 140;
      const maxDist = Math.max(entryCharIdx, charData.length - 1 - entryCharIdx);
      const perChar = maxDist > 0 ? spread / maxDist : spread / Math.max(charData.length, 1);
      const easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      charData.forEach(({ top, bot }, i) => {
        const delay = `${Math.abs(i - entryCharIdx) * perChar}ms`;
        top.style.transition = `transform ${dur}ms ${easing} ${delay}`;
        bot.style.transition = `transform ${dur}ms ${easing} ${delay}`;
        top.style.transform = 'translateY(0%)';
        bot.style.transform = 'translateY(100%)';
      });
    });
  }
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

/* ── View project badge (hover-capable devices only) ─────────────── */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.img-wrap').forEach(wrap => {
    const badge = document.createElement('div');
    badge.className = 'view-badge';
    badge.textContent = 'View case';
    wrap.appendChild(badge);
  });
}

/* ── Footer interactive gradient ─────────────────────────────── */
(function () {
  const footer = document.querySelector('.site-footer');
  if (!footer || !window.matchMedia('(hover: hover)').matches) return;

  footer.style.position = 'relative';
  footer.style.overflow = 'hidden';

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;filter:blur(70px)';
  footer.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;
  function resize() {
    W = canvas.width  = footer.offsetWidth;
    H = canvas.height = footer.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Mouse pull: active on hover, otherwise blobs drift freely
  let mx = W / 2, my = H / 2, tx = W / 2, ty = H / 2, mouseActive = false;

  footer.addEventListener('mouseenter', e => {
    const r = footer.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
    mouseActive = true;
  });
  footer.addEventListener('mousemove', e => {
    const r = footer.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
  });
  footer.addEventListener('mouseleave', () => {
    mouseActive = false;
  });

  // Each blob drifts autonomously across the footer.
  // `pull` = how strongly the mouse displaces it from its natural path (0 = ignores mouse, 1 = follows fully)
  const blobs = [
    { r: 520, a: 0.14, sxS: 0.55, syS: 0.40, sxP: 0.0,  syP: 1.5,  pull: 0.28 },
    { r: 440, a: 0.10, sxS: 0.30, syS: 0.70, sxP: 2.1,  syP: 0.3,  pull: 0.15 },
    { r: 600, a: 0.06, sxS: 0.80, syS: 0.35, sxP: 4.2,  syP: 3.0,  pull: 0.40 },
    { r: 380, a: 0.17, sxS: 1.10, syS: 0.90, sxP: 1.0,  syP: 5.0,  pull: 0.10 },
    { r: 680, a: 0.05, sxS: 0.25, syS: 0.20, sxP: 3.3,  syP: 2.2,  pull: 0.55 },
    { r: 480, a: 0.09, sxS: 0.65, syS: 0.55, sxP: 5.1,  syP: 0.8,  pull: 0.22 },
    { r: 420, a: 0.12, sxS: 0.45, syS: 1.00, sxP: 1.8,  syP: 4.1,  pull: 0.35 },
  ];

  let t = 0;
  (function draw() {
    requestAnimationFrame(draw);
    if (!W || !H) return;

    if (mouseActive) {
      mx += (tx - mx) * 0.055;
      my += (ty - my) * 0.055;
    }
    t += 0.006;

    ctx.clearRect(0, 0, W, H);

    blobs.forEach(b => {
      // Autonomous drift: sine paths across full footer dimensions
      const autoX = W  * (0.5 + 0.44 * Math.sin(t * b.sxS + b.sxP));
      const autoY = H  * (0.5 + 0.40 * Math.cos(t * b.syS + b.syP));

      // Mouse displaces blob toward cursor proportional to pull strength
      const bx = autoX + (mx - autoX) * b.pull;
      const by = autoY + (my - autoY) * b.pull;

      const g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
      g.addColorStop(0,   `rgba(255,255,255,${b.a})`);
      g.addColorStop(0.3, `rgba(255,255,255,${b.a * 0.75})`);
      g.addColorStop(0.65,`rgba(255,255,255,${b.a * 0.25})`);
      g.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
  }());
}());

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

  // Dot indicators — styled via CSS, visible on touch only
  const dotContainer = document.createElement('div');
  dotContainer.className = 'gallery-dots';
  imgs.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dotContainer.appendChild(dot);
  });
  wrap.appendChild(dotContainer);
  const dots = [...dotContainer.children];

  let currentIdx = 0;
  let lastX = 0;
  let lastY = 0;

  function getZone(clientX) {
    const { left, width } = wrap.getBoundingClientRect();
    const n = imgs.length - 1; // gallery frames only, skip cover at index 0
    return Math.min(n, Math.max(1, Math.floor((clientX - left) / width * n) + 1));
  }

  function showFrame(idx) {
    frames.forEach((frame, i) => {
      if (frame) frame.classList.toggle('active', i === idx);
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
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
    showFrame(0);
  });

  // Touch: drag-reveal swipe — current slides out, next slides in, snaps or reverts
  const baseImg = wrap.querySelector('img');

  function getEl(idx) {
    return idx === 0 ? baseImg : (frames[idx] || null);
  }

  let touchStartX = 0, touchStartY = 0;
  let touchDirLocked = false, touchIsHorizontal = false;
  let swipeDir = 0, incomingIdx = -1, wrapW = 0;
  let atBoundary = false;

  wrap.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchDirLocked = false;
    touchIsHorizontal = false;
    swipeDir = 0;
    incomingIdx = -1;
    atBoundary = false;
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

    // On first horizontal move: check for boundary or set up incoming frame
    if (!atBoundary && incomingIdx === -1) {
      const hitStart = currentIdx === 0 && dir === 1;
      const hitEnd   = currentIdx === imgs.length - 1 && dir === -1;

      if (hitStart || hitEnd) {
        atBoundary = true;
      } else {
        swipeDir = dir;
        const candidate = dir === -1
          ? Math.min(imgs.length - 1, currentIdx + 1)
          : Math.max(0, currentIdx - 1);
        if (candidate === currentIdx) return;
        incomingIdx = candidate;

        const inEl  = getEl(incomingIdx);
        const curEl = getEl(currentIdx);
        if (inEl) {
          inEl.style.transition = 'none';
          inEl.style.opacity    = '1';
          inEl.style.transform  = `translateX(${-dir * wrapW}px)`;
        }
        if (curEl) curEl.style.transition = 'none';
      }
    }

    // Rubber-band at boundary: damped resistance, clamp so it only pulls in the boundary direction
    if (atBoundary) {
      // White background so nothing shows through behind the pulled image
      wrap.style.background = '#fff';
      if (currentIdx === imgs.length - 1) baseImg.style.opacity = '0';

      const clamped = currentIdx === 0 ? Math.max(0, rawDx) : Math.min(0, rawDx);
      const curEl = getEl(currentIdx);
      if (curEl) {
        curEl.style.transition = 'none';
        curEl.style.transform  = `translateX(${clamped * 0.18}px)`;
      }
      return;
    }

    if (incomingIdx === -1) return;
    const curEl = getEl(currentIdx);
    const inEl  = getEl(incomingIdx);
    if (curEl) curEl.style.transform = `translateX(${rawDx}px)`;
    if (inEl)  inEl.style.transform  = `translateX(${-swipeDir * wrapW + rawDx}px)`;
  }, { passive: false });

  wrap.addEventListener('touchend', e => {
    const spring = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

    // Snap back from boundary rubber-band
    if (atBoundary) {
      atBoundary = false;
      const curEl = getEl(currentIdx);
      if (curEl) {
        curEl.style.transition = spring;
        curEl.style.transform  = 'translateX(0)';
        setTimeout(() => {
          curEl.style.transition = 'none';
          curEl.style.transform  = '';
          wrap.style.background  = '';
          baseImg.style.opacity  = '';
          requestAnimationFrame(() => { curEl.style.transition = ''; });
        }, 510);
      }
      return;
    }

    if (!touchDirLocked || !touchIsHorizontal || incomingIdx === -1) {
      incomingIdx = -1;
      return;
    }

    const dx = e.changedTouches[0].clientX - touchStartX;
    const committed = Math.abs(dx) > wrapW * 0.25;
    const ease = 'transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    const savedIncoming = incomingIdx;
    const curEl = getEl(currentIdx);
    const inEl  = getEl(incomingIdx);

    if (committed) {
      if (curEl) { curEl.style.transition = ease; curEl.style.transform = `translateX(${swipeDir * wrapW}px)`; }
      if (inEl)  { inEl.style.transition  = ease; inEl.style.transform  = 'translateX(0)'; }
      currentIdx = incomingIdx;
      incomingIdx = -1;

      setTimeout(() => {
        showFrame(currentIdx);
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


