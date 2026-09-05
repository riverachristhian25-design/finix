/* =========================================================
   PEGANTES FINIX — main.js
   Shared behaviour loaded on every page:
   - solid header background on scroll
   - scroll-reveal animations (.reveal / .reveal-stagger)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // Solid header once the page scrolls past the hero area
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => header.classList.toggle('solid', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Scroll-reveal animations
  const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
  if (revealTargets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    revealTargets.forEach(el => io.observe(el));
  }

  // Animated stat counters (.stat-num with data-count), used on
  // index.html and nosotros.html
  const statEls = document.querySelectorAll('.stat-num');
  if (statEls.length) {
    const countIo = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const dur = 1400;
        const t0 = performance.now();
        function tick(t) {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countIo.unobserve(el);
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => countIo.observe(el));
  }

});
