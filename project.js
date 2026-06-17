
/* Magazine marquee — JS-driven so hover can control speed & direction */
(function () {
  const wrap  = document.querySelector('.rc-marquee-wrap');
  const track = document.querySelector('.rc-marquee-track');
  if (!wrap || !track) return;

  const DEFAULT_SPEED = 88; // px/sec — matches previous 60s CSS duration
  let pos         = 0;
  let speed       = DEFAULT_SPEED;
  let targetSpeed = DEFAULT_SPEED;
  let lastTime    = null;

  function tick(now) {
    if (lastTime === null) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05); // cap at 50ms
    lastTime = now;

    speed += (targetSpeed - speed) * Math.min(1, dt * 5); // ease
    pos   += speed * dt;

    const half = track.scrollWidth / 2;
    if (pos >= half) pos -= half;
    if (pos <  0)    pos += half;

    track.style.transform = `translateX(${-pos}px)`;
    requestAnimationFrame(tick);
  }

  wrap.addEventListener('mousemove', function (e) {
    const rect  = wrap.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width; // 0=left 1=right

    if (ratio < 0.5) {
      const t = (0.5 - ratio) / 0.5;          // 0 at centre → 1 at left edge
      targetSpeed = -DEFAULT_SPEED * 3 * t;   // up to 3× speed backward
    } else {
      const t = (ratio - 0.5) / 0.5;          // 0 at centre → 1 at right edge
      targetSpeed = DEFAULT_SPEED * (1 + 3 * t); // up to 4× speed forward
    }
  });

  wrap.addEventListener('mouseleave', function () {
    targetSpeed = DEFAULT_SPEED;
  });

  requestAnimationFrame(tick);
})();

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
