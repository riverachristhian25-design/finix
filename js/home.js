/* =========================================================
   PEGANTES FINIX — home.js
   Behaviour specific to index.html. Product data comes from
   data/products.json via js/catalog.js. Header/reveal handled
   by main.js.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const NORMS = ['ISO 13007','ANSI A118.1','ANSI A118.4','ANSI A118.11','NTE INEN 13007','UNE-EN 12004-2','UNE-EN 1015-11','UNE-EN 998-1','CLASE A1 REACCIÓN AL FUEGO'];

  const tabsEl = document.getElementById('tabs');
  const switchBag = document.getElementById('switchBag');
  const ribbonSweep = document.getElementById('ribbonSweep');
  const switcherGlow = document.getElementById('switcherGlow');
  const catWord = document.getElementById('catWord');
  const verProductoBtn = document.getElementById('verProductoBtn');
  const root = document.documentElement;

  Catalog.ready().then(() => {
    /* Only active adhesive products appear in the home switcher */
    const SWITCHER_PRODUCTS = Catalog.byCat('adhesivo').filter(p => p.status === 'activo');
    if (!tabsEl || !switchBag || !SWITCHER_PRODUCTS.length) return;

    SWITCHER_PRODUCTS.forEach((p, i) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tab' + (i === 0 ? ' active' : '');
      tab.style.setProperty('--dot', p.color);
      tab.innerHTML = `<span class="tab-dot"></span>${p.name}`;
      tab.dataset.index = i;
      tab.addEventListener('click', () => selectProduct(i, tab));
      tabsEl.appendChild(tab);
    });

    let currentIndex = -1;
    function selectProduct(i, tabEl) {
      if (i === currentIndex) return;
      const p = SWITCHER_PRODUCTS[i];
      tabsEl.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      if (tabEl) tabEl.classList.add('active');

      root.style.setProperty('--accent', p.color);
      root.style.setProperty('--accent-soft', p.color + '22');
      switcherGlow.style.background = `radial-gradient(ellipse 50% 55% at 22% 20%, ${p.color}22, transparent 65%)`;
      catWord.textContent = p.category;

      document.getElementById('pName').textContent = p.name;
      document.getElementById('pTagline').textContent = p.tagline;
      const formats = (p.formats || []).map(f => `${f.value} ${f.unit}`).join(' · ');
      const yieldText = p.yieldTable ? p.yieldTable.map(r => `${r.espesor}: ${r.rendimiento}`).join(' · ') : (p.yieldList || []).join(' · ');
      document.getElementById('specList').innerHTML = `
        <div class="spec-item wide"><dt>Descripción</dt><dd>${p.desc}</dd></div>
        <div class="spec-item"><dt>Norma</dt><dd>${p.norm}</dd></div>
        <div class="spec-item"><dt>Uso recomendado</dt><dd>${p.use}</dd></div>
        <div class="spec-item"><dt>Presentaciones</dt><dd>${formats}</dd></div>
        <div class="spec-item"><dt>Rendimiento</dt><dd>${yieldText}</dd></div>
        <div class="spec-item"><dt>Adherencia (28 días)</dt><dd>${p.bond}</dd></div>
        <div class="spec-item"><dt>Tiempo abierto</dt><dd>${p.open}</dd></div>
      `;
      verProductoBtn.setAttribute('href', `producto.html?p=${encodeURIComponent(p.id)}`);

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        switchBag.src = p.images.derecha;
      } else {
        switchBag.style.transform = 'rotateY(70deg) scale(.92)';
        switchBag.style.opacity = '0.35';
        setTimeout(() => { switchBag.src = p.images.izquierda; switchBag.style.transform = 'rotateY(-70deg) scale(.92)'; }, 160);
        setTimeout(() => { switchBag.src = p.images.derecha; switchBag.style.transform = 'rotateY(0deg) scale(1)'; switchBag.style.opacity = '1'; }, 320);
        ribbonSweep.classList.remove('sweep'); void ribbonSweep.offsetWidth; ribbonSweep.classList.add('sweep');
      }
      currentIndex = i;
    }
    switchBag.src = SWITCHER_PRODUCTS[0].images.derecha;
    selectProduct(0, tabsEl.querySelector('[data-index="0"]'));
  });

  function fillMarquee(el, items) {
    if (!el) return;
    el.innerHTML = [...items, ...items].map(t => `<span>${t}</span>`).join('');
  }
  fillMarquee(document.getElementById('normsTrack'), NORMS);

  /* ABOUT SLIDER */
  const aboutImages = [
    { src: 'img/asset-5e5e1919a3.webp', alt: 'Planta Finix' },
    { src: 'img/asset-9e5b596082.webp', alt: 'Finix Standard' },
    { src: 'img/asset-43aea72191.webp', alt: 'Finix Super' },
    { src: 'img/asset-e1deb8270d.webp', alt: 'Finix Premium' },
    { src: 'img/asset-e2d256cbaa.webp', alt: 'Finix Gold' },
  ];
  const aboutSlider = document.getElementById('aboutSlider');
  const aboutDots = document.getElementById('aboutDots');
  if (aboutSlider && aboutDots) {
    aboutImages.forEach((im, i) => {
      const slide = document.createElement('div');
      slide.className = 'about-slide' + (i === 0 ? ' active' : '');
      slide.innerHTML = `<img src="${im.src}" alt="${im.alt}">`;
      aboutSlider.insertBefore(slide, aboutDots);
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => setAboutSlide(i));
      aboutDots.appendChild(dot);
    });
    let aboutIdx = 0;
    function setAboutSlide(i) {
      aboutSlider.querySelectorAll('.about-slide').forEach((s, idx) => s.classList.toggle('active', idx === i));
      aboutDots.querySelectorAll('span').forEach((d, idx) => d.classList.toggle('active', idx === i));
      aboutIdx = i;
    }
    setInterval(() => setAboutSlide((aboutIdx + 1) % aboutImages.length), 3500);
  }

  /* HERO SLIDER CUE (visual placeholder for future promo banners) */
  const heroSliderCue = document.getElementById('heroSliderCue');
  if (heroSliderCue) {
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('span');
      if (i === 0) s.classList.add('active');
      heroSliderCue.appendChild(s);
    }
    let heroCueIdx = 0;
    setInterval(() => {
      heroCueIdx = (heroCueIdx + 1) % 3;
      heroSliderCue.querySelectorAll('span').forEach((s, idx) => s.classList.toggle('active', idx === heroCueIdx));
    }, 3000);
  }

});
