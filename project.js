
/* Magazine marquee — JS RAF with hover speed/direction + click-drag */
function initMarquee(wrapSel, trackSel) {
  const wrap  = document.querySelector(wrapSel);
  const track = document.querySelector(trackSel);
  if (!wrap || !track) return;

  const DEFAULT_SPEED = 88; // px/sec
  let pos          = 0;
  let speed        = DEFAULT_SPEED;
  let targetSpeed  = DEFAULT_SPEED;
  let lastTime     = null;

  let isDragging   = false;
  let isHovering   = false;
  let dragStartX   = 0;
  let dragStartPos = 0;
  let lastDragX    = 0;
  let lastDragTime = 0;
  let dragVelocity = 0;

  function getCur() { return document.getElementById('ccCursor'); }

  function wrap_pos(p) {
    const half = track.scrollWidth / 2;
    if (p >= half) return p - half;
    if (p < 0)     return p + half;
    return p;
  }

  function tick(now) {
    if (lastTime === null) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (!isDragging) {
      speed += (targetSpeed - speed) * Math.min(1, dt * 5);
      pos    = wrap_pos(pos + speed * dt);
    }

    track.style.transform = `translateX(${-pos}px)`;
    requestAnimationFrame(tick);
  }

  /* hover: scrub speed & direction + show cursor */
  wrap.addEventListener('mouseenter', function () {
    isHovering = true;
    const cur = getCur();
    if (cur) { cur.textContent = 'Click & drag'; cur.style.opacity = '1'; }
    document.body.classList.add('cc-on-card');
  });

  wrap.addEventListener('mousemove', function (e) {
    if (isDragging) {
      const now   = performance.now();
      const dtDrag = Math.max((now - lastDragTime) / 1000, 0.001);
      pos          = wrap_pos(dragStartPos - (e.clientX - dragStartX));
      dragVelocity = -(e.clientX - lastDragX) / dtDrag;
      lastDragX    = e.clientX;
      lastDragTime = now;
      return;
    }

    const rect  = wrap.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (ratio < 0.5) {
      targetSpeed = -DEFAULT_SPEED * 3 * ((0.5 - ratio) / 0.5);
    } else {
      targetSpeed = DEFAULT_SPEED * (1 + 3 * ((ratio - 0.5) / 0.5));
    }
  });

  wrap.addEventListener('mouseleave', function () {
    isHovering = false;
    const cur = getCur();
    if (cur) cur.style.opacity = '0';
    document.body.classList.remove('cc-on-card');
    if (!isDragging) targetSpeed = DEFAULT_SPEED;
  });

  /* drag start */
  wrap.addEventListener('mousedown', function (e) {
    isDragging    = true;
    dragStartX    = e.clientX;
    dragStartPos  = pos;
    lastDragX     = e.clientX;
    lastDragTime  = performance.now();
    dragVelocity  = 0;
    const cur = getCur();
    if (cur) cur.style.opacity = '0';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  /* drag end — release with momentum then ease to default */
  document.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging                     = false;
    document.body.style.userSelect = '';
    if (isHovering) {
      const cur = getCur();
      if (cur) cur.style.opacity = '1';
    }
    speed       = dragVelocity;
    targetSpeed = DEFAULT_SPEED;
  });

  wrap.style.cursor = 'none';
  requestAnimationFrame(tick);
}

initMarquee('.rc-marquee-wrap',  '.rc-marquee-track');
initMarquee('.ffd-marquee-wrap', '.ffd-marquee-track');
initMarquee('.wm-marquee-wrap',  '.wm-marquee-track');
initMarquee('.eh-marquee-wrap',  '.eh-marquee-track');

/* Scroll reveal */
const textEls = document.querySelectorAll('.content-block, .project-hero, .sub-project, .project-cta');
const imgEls  = document.querySelectorAll('.images__container picture, .sticky-image-col img:not(.rc-marquee-card)');

[...textEls, ...imgEls].forEach(el => el.classList.add('p-reveal'));

const io = new IntersectionObserver(entries => {
  entries
    .filter(e => e.isIntersecting)
    .forEach((e, i) => {
      e.target.style.transitionDelay = `${i * 80}ms`;
      e.target.classList.add('visible');
      io.unobserve(e.target);
    });
}, { threshold: 0.06 });

[...textEls, ...imgEls].forEach(el => io.observe(el));
