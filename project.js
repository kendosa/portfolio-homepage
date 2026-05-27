/* Header scroll shadow */
const header = document.querySelector('.proj-header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 10
    ? '0 1px 12px rgba(0,0,0,.07)'
    : 'none';
}, { passive: true });

/* Scroll reveal */
const els = document.querySelectorAll('.content-block, .project-hero, .sub-project, .project-cta');
els.forEach(el => el.classList.add('p-reveal'));

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.06 });

els.forEach(el => io.observe(el));
