// Header scroll effect
const header = document.getElementById('siteHeader');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('solid', window.scrollY > 20);
  }, { passive: true });
}

// Product detail thumbnail gallery initializer
document.addEventListener('DOMContentLoaded', () => {
  const mainImg = document.getElementById('mainImg');
  const thumbRow = document.getElementById('thumbRow');

  if (mainImg && thumbRow && typeof IMAGES !== 'undefined' && Array.isArray(IMAGES)) {
    thumbRow.innerHTML = '';
    IMAGES.forEach((im, i) => {
      const t = document.createElement('div');
      t.className = 'thumb' + (i === 0 ? ' active' : '');
      t.innerHTML = `<img src="${im.src}" alt="${im.label}">`;
      t.addEventListener('click', () => {
        mainImg.style.opacity = 0;
        setTimeout(() => {
          mainImg.src = im.src;
          mainImg.style.opacity = 1;
        }, 150);
        thumbRow.querySelectorAll('.thumb').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
      });
      thumbRow.appendChild(t);
    });
  }

  // PDF download button binding if PDF_DATA is present
  const fichaBtn = document.getElementById('fichaBtn');
  if (fichaBtn && typeof PDF_DATA !== 'undefined') {
    fichaBtn.setAttribute('href', PDF_DATA);
  }
});
