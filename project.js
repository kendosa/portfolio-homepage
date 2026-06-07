
/* Scroll reveal */
const textEls = document.querySelectorAll('.content-block, .project-hero, .sub-project, .project-cta');
const imgEls  = document.querySelectorAll('.images__container picture, .sticky-image-col img');

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
