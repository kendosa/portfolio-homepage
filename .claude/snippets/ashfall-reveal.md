# Ashfall-style clip-path reveal animation

Inspired by https://ashfall.studio/ — project cards reveal from a narrow
center strip, expanding to full width with a simultaneous zoom-out.

---

## CSS

Add to the `.img-wrap` and `.img-wrap img` blocks, and add the new classes below:

```css
.img-wrap {
  /* ...existing styles... */
  clip-path: inset(10% 15% 0% 15% round 20px);
  transition: clip-path 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.project-card.card-revealed .img-wrap {
  clip-path: inset(0% 0% 0% 0% round 2px);
}

.img-wrap img {
  /* ...existing styles... */
  transform: scale(1.1);
  transition: transform 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter .35s ease;
}

.project-card.card-revealed .img-wrap img {
  transform: scale(1);
}

/* Restore fast hover transition once reveal is done */
.project-card.card-post-reveal .img-wrap img {
  transition: transform .45s ease, filter .35s ease;
}

.project-card.card-post-reveal .card-link:hover .img-wrap img {
  transform: scale(1.02);
  filter: brightness(.93);
}
```

## JS

Replace the project card section of the IntersectionObserver in main.js:

```js
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
```

## How it works

- `clip-path: inset()` starts the image as a narrow center strip with rounded corners
- Animates to full rectangle with near-zero rounding over 1.4s
- `scale(1.1) → scale(1)` on the img gives a simultaneous zoom-out feel
- `card-post-reveal` class is added after 1400ms to restore the fast hover transition
- Easing `cubic-bezier(0.25, 0.46, 0.45, 0.94)` approximates GSAP's power2.out

## Source reference

Original uses GSAP in a Nuxt app (WorkItem.T5cPeq5V.js):
- clip-path: `inset(10% 20% 0% 20% round 30px)` → `inset(0% 0% 0% 0% round 4px)`
- scale: `1.1` → `1.0`
- ease: `power2.out`, duration: `1.4`
