
/* Scroll reveal */
const els = document.querySelectorAll('.content-block, .project-hero, .sub-project, .project-cta, .images');
els.forEach(el => el.classList.add('p-reveal'));

const io = new IntersectionObserver(entries => {
  entries
    .filter(e => e.isIntersecting)
    .forEach((e, i) => {
      e.target.style.transitionDelay = `${i * 60}ms`;
      e.target.classList.add('visible');
      io.unobserve(e.target);
    });
}, { threshold: 0.06 });

els.forEach(el => io.observe(el));
