/* ── Mobile menu ──────────────────────────────────────────────── */
const toggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Project card clip-path reveal ───────────────────────────── */
const cardObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add('card-revealed');
        setTimeout(() => card.classList.add('card-post-reveal'), 1400);
        cardObserver.unobserve(card);
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll('.project-card').forEach(el => cardObserver.observe(el));

/* ── Scroll-reveal (info + footer) ───────────────────────────── */
const revealTargets = document.querySelectorAll('.info-inner, .site-footer');
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

revealTargets.forEach(el => revealObserver.observe(el));
