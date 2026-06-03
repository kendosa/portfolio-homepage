/*
 * ─── GRADIENT BACKGROUND — SAVED FOR LATER ─────────────────────────────────
 * Remove this file's contents back into the respective files to restore.
 *
 * HOW TO RESTORE:
 *  1. style.css  → add CSS sections below into their original positions
 *  2. main.js    → add the two JS blocks back after the nav-collapse section
 *  3. index.html → add the inline <script> block back before </body>
 * ────────────────────────────────────────────────────────────────────────────
 */


/* ══════════════════════════════════════════════════════════════
   style.css  — :root additions
   ══════════════════════════════════════════════════════════════

  Inside :root { ... } add:

  --blob1: rgba(90, 140, 190, 0.44);
  --blob2: rgba(240, 158, 52, 0.42);

*/


/* ══════════════════════════════════════════════════════════════
   style.css  — body additions
   ══════════════════════════════════════════════════════════════

  Inside body { ... } add:

  background-image:
    radial-gradient(circle 130px at var(--mx, -50%) var(--my, -50%), rgba(255, 255, 255, 0.72) 0%, transparent 100%),
    radial-gradient(ellipse 150% 40% at 50% 50%, rgba(255, 255, 255, var(--ct, 0)) 0%, transparent 100%),
    radial-gradient(ellipse 72% 52% at var(--g1x, 8%) var(--g1y, 2%), var(--blob1) 0%, transparent 70%),
    radial-gradient(ellipse 68% 50% at var(--g2x, 93%) var(--g2y, 3%), var(--blob2) 0%, transparent 65%);
  background-attachment: fixed;

  And add this media query after the body block:

  @media (max-width: 700px) {
    body { background-attachment: scroll; }
  }

*/


/* ══════════════════════════════════════════════════════════════
   style.css  — #grad-toggle + palette mode rules
   ══════════════════════════════════════════════════════════════ */

/*
#grad-toggle {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--black);
  flex-shrink: 0;
  align-self: center;
  margin-right: 5px;
}

body.forest {
  --black: #f4f2e5;
  --white: #1f442e;
  --grey:  rgba(244, 242, 229, 0.45);
  --hover: #2a5a3c;
  color: #f4f2e5;
  background-color: #1f442e;
  background-image: none;
}
body.forest .logo,
body.forest .logo:visited,
body.forest .logo:active { color: #f4f2e5; }
body.forest .hero-text { color: #f4f2e5; }
body.forest .img-wrap { background: #2a5a3c; }
body.forest .info-section { border-top-color: rgba(244, 242, 229, 0.15); }
body.forest .info-bio p,
body.forest .clients-list li { color: rgba(244, 242, 229, 0.78); }
body.forest .clients-list li { border-bottom-color: rgba(244, 242, 229, 0.15); }
body.forest .clients-list li:first-child { border-top-color: rgba(244, 242, 229, 0.15); }
body.forest .site-footer { border-top-color: rgba(244, 242, 229, 0.15); }
body.forest .project-aa-body,
body.forest .sub-desc { color: rgba(244, 242, 229, 0.85); }
body.forest .full-img { background: #2a5a3c; }
body.forest .proj-header { border-bottom-color: rgba(244, 242, 229, 0.15); }
body.forest .sub-project + .sub-project,
body.forest .project-cta,
body.forest .project-footer { border-top-color: rgba(244, 242, 229, 0.15); }

html:has(body.aa) { background: #1b1b1b; }
body.aa {
  --black: #fcfcfc;
  --white: #1b1b1b;
  --grey:  rgba(252, 252, 252, 0.42);
  --hover: #2a2a2a;
  color: #fcfcfc;
  background-color: #1b1b1b;
  background-image: none;
}
body.aa .logo,
body.aa .logo:visited,
body.aa .logo:active { color: #fcfcfc; }
body.aa .hero-text { color: #fcfcfc; }
body.aa .img-wrap { background: #2e2e2e; }
body.aa .info-section { border-top-color: rgba(252, 252, 252, 0.1); }
body.aa .info-bio p,
body.aa .clients-list li { color: rgba(252, 252, 252, 0.78); }
body.aa .clients-list li { border-bottom-color: rgba(252, 252, 252, 0.1); }
body.aa .clients-list li:first-child { border-top-color: rgba(252, 252, 252, 0.1); }
body.aa .site-footer { border-top-color: rgba(252, 252, 252, 0.1); }
body.aa .project-aa-body,
body.aa .sub-desc { color: rgba(252, 252, 252, 0.78); }
body.aa .full-img { background: #2e2e2e; }
body.aa .proj-header { border-bottom-color: rgba(252, 252, 252, 0.1); }
body.aa .sub-project + .sub-project,
body.aa .project-cta,
body.aa .project-footer { border-top-color: rgba(252, 252, 252, 0.1); }

html:has(body.stone) { background: #ebeaeb; }
body.stone {
  --black: #1b1b1b;
  --white: #ebeaeb;
  --grey:  rgba(27, 27, 27, 0.42);
  --hover: #d7d5d6;
  color: #1b1b1b;
  background-color: #ebeaeb;
  background-image: none;
}
body.stone .logo,
body.stone .logo:visited,
body.stone .logo:active { color: #1b1b1b; }
body.stone .hero-text { color: #1b1b1b; }
body.stone .img-wrap { background: #d7d5d6; }
body.stone .info-section { border-top-color: rgba(27, 27, 27, 0.15); }
body.stone .info-bio p,
body.stone .clients-list li { color: rgba(27, 27, 27, 0.78); }
body.stone .clients-list li { border-bottom-color: rgba(27, 27, 27, 0.15); }
body.stone .clients-list li:first-child { border-top-color: rgba(27, 27, 27, 0.15); }
body.stone .site-footer { border-top-color: rgba(27, 27, 27, 0.15); }
body.stone .project-aa-body,
body.stone .sub-desc { color: rgba(27, 27, 27, 0.78); }
body.stone .full-img { background: #d7d5d6; }
body.stone .proj-header { border-bottom-color: rgba(27, 27, 27, 0.15); }
body.stone .sub-project + .sub-project,
body.stone .project-cta,
body.stone .project-footer { border-top-color: rgba(27, 27, 27, 0.15); }

html:has(body.ember) { background: #4f160b; }
body.ember {
  --black: #fdf0e3;
  --white: #4f160b;
  --grey:  rgba(253, 240, 227, 0.45);
  --hover: #6b2010;
  color: #fdf0e3;
  background-color: #4f160b;
  background-image: none;
}
body.ember .logo,
body.ember .logo:visited,
body.ember .logo:active { color: #fdf0e3; }
body.ember .hero-text { color: #fdf0e3; }
body.ember .img-wrap { background: #6b2010; }
body.ember .info-section { border-top-color: rgba(253, 240, 227, 0.15); }
body.ember .info-bio p,
body.ember .clients-list li { color: rgba(253, 240, 227, 0.78); }
body.ember .clients-list li { border-bottom-color: rgba(253, 240, 227, 0.15); }
body.ember .clients-list li:first-child { border-top-color: rgba(253, 240, 227, 0.15); }
body.ember .site-footer { border-top-color: rgba(253, 240, 227, 0.15); }
body.ember .project-aa-body,
body.ember .sub-desc { color: rgba(253, 240, 227, 0.85); }
body.ember .full-img { background: #6b2010; }
body.ember .proj-header { border-bottom-color: rgba(253, 240, 227, 0.15); }
body.ember .sub-project + .sub-project,
body.ember .project-cta,
body.ember .project-footer { border-top-color: rgba(253, 240, 227, 0.15); }
*/


/* ══════════════════════════════════════════════════════════════
   main.js  — gradient palette toggle (add after nav-collapse block)
   ══════════════════════════════════════════════════════════════

(function () {
  const palettes = [
    ['rgba(90, 140, 190, 0.44)', 'rgba(240, 158, 52, 0.42)'],
    ['rgba(90, 140, 190, 0.44)', 'rgba(240, 158, 52, 0.42)'],
    ['rgba(90, 140, 190, 0.44)', 'rgba(240, 158, 52, 0.42)'],
  ];

  let state = parseInt(localStorage.getItem('palette') || '0', 10);
  if (state > palettes.length - 1) state = 0;

  function applyState(s) {
    document.body.style.setProperty('--blob1', palettes[s][0]);
    document.body.style.setProperty('--blob2', palettes[s][1]);
    document.body.style.backgroundImage = s > 0 ? 'none' : '';
    document.body.classList.toggle('aa',    s === 1);
    document.body.classList.toggle('stone', s === 2);
    document.body.classList.remove('forest', 'ember');
  }

  if (state > 0) applyState(state);

  const circle = document.createElement('span');
  circle.id = 'grad-toggle';
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) navLinks.insertBefore(circle, navLinks.firstChild);

  circle.addEventListener('mouseenter', () => {
    state = (state + 1) % palettes.length;
    applyState(state);
    localStorage.setItem('palette', state);
  });
}());

*/


/* ══════════════════════════════════════════════════════════════
   main.js  — gradient drift for non-index pages (add after palette toggle)
   ══════════════════════════════════════════════════════════════

requestAnimationFrame(() => {
  if (window._hasGradientAnimation) return;
  const body = document.body;
  let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
  let cx = -50, cy = -50, tcx = -50, tcy = -50;
  function lerp(a, b, t) { return a + (b - a) * t; }
  document.addEventListener('mousemove', e => {
    tmx = e.clientX / window.innerWidth;
    tmy = e.clientY / window.innerHeight;
    tcx = e.clientX / window.innerWidth  * 100;
    tcy = e.clientY / window.innerHeight * 100;
  });
  document.addEventListener('mouseleave', () => { tcx = -50; tcy = -50; });
  (function tick() {
    const t = Date.now() / 1000;
    mx = lerp(mx, tmx, 0.04);
    my = lerp(my, tmy, 0.04);
    cx = lerp(cx, tcx, 0.18);
    cy = lerp(cy, tcy, 0.18);
    body.style.setProperty('--g1x', (28 + mx * 6 + Math.sin(t * 0.22) * 10).toFixed(2) + '%');
    body.style.setProperty('--g1y', (35 + my * 8 + Math.cos(t * 0.17) * 14).toFixed(2) + '%');
    body.style.setProperty('--g2x', (72 - mx * 6 + Math.cos(t * 0.19) * 10).toFixed(2) + '%');
    body.style.setProperty('--g2y', (65 - my * 8 + Math.sin(t * 0.14) * 14).toFixed(2) + '%');
    body.style.setProperty('--mx',  cx.toFixed(2) + '%');
    body.style.setProperty('--my',  cy.toFixed(2) + '%');
    requestAnimationFrame(tick);
  }());
});

*/


/* ══════════════════════════════════════════════════════════════
   index.html  — inline <script> before </body>
   ══════════════════════════════════════════════════════════════

  <script>
    (function () {
      window._hasGradientAnimation = true;
      let scrollY = 0, targetScrollY = 0;
      let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
      let cx = -50, cy = -50, tcx = -50, tcy = -50;
      let ct = 0, targetCt = 0;
      const body = document.body;
      const covers = Array.from(document.querySelectorAll('.img-wrap'));
      function lerp(a, b, t) { return a + (b - a) * t; }

      function updateCenter() {
        const mid = window.innerHeight / 2;
        const threshold = window.innerHeight * 0.32;
        let minDist = Infinity;
        covers.forEach(el => {
          const r = el.getBoundingClientRect();
          const dist = Math.abs((r.top + r.height / 2) - mid);
          if (dist < minDist) minDist = dist;
        });
        targetCt = Math.max(0, 1 - minDist / threshold) * 0.88;
      }

      function tick() {
        scrollY = lerp(scrollY, targetScrollY, 0.07);
        mx = lerp(mx, tmx, 0.04);
        my = lerp(my, tmy, 0.04);
        cx = lerp(cx, tcx, 0.18);
        cy = lerp(cy, tcy, 0.18);
        ct = lerp(ct, targetCt, 0.06);

        const p = scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const t = Date.now() / 1000;
        const d1x = Math.sin(t * 0.20) * 6,  d1y = Math.cos(t * 0.17) * 10;
        const d2x = Math.cos(t * 0.18) * 6,  d2y = Math.sin(t * 0.14) * 10;

        body.style.setProperty('--g1x', (8  + mx * 4 + p * 8  + d1x).toFixed(2) + '%');
        body.style.setProperty('--g1y', (2  + my * 3 + p * 20 + d1y).toFixed(2) + '%');
        body.style.setProperty('--g2x', (93 - mx * 4 - p * 8  + d2x).toFixed(2) + '%');
        body.style.setProperty('--g2y', (3  + my * 2 + p * 18 + d2y).toFixed(2) + '%');
        body.style.setProperty('--mx',  cx.toFixed(2) + '%');
        body.style.setProperty('--my',  cy.toFixed(2) + '%');
        body.style.setProperty('--ct',  ct.toFixed(3));

        requestAnimationFrame(tick);
      }

      window.addEventListener('scroll', () => { targetScrollY = window.scrollY; updateCenter(); }, { passive: true });
      document.addEventListener('mousemove', e => {
        tmx = e.clientX / window.innerWidth;
        tmy = e.clientY / window.innerHeight;
        tcx = e.clientX / window.innerWidth  * 100;
        tcy = e.clientY / window.innerHeight * 100;
      });
      document.addEventListener('mouseleave', () => { tcx = -50; tcy = -50; });

      updateCenter();
      tick();
    }());
  </script>

*/
