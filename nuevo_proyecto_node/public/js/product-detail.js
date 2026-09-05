/* =========================================================
   PEGANTES FINIX — product-detail.js
   Behaviour shared by every producto-*.html page.
   The thumbnails and their images live in the HTML markup
   (data-img attribute) — this script only wires up the click
   behaviour, it does not generate content.

   producto-render.js draws the page asynchronously (it waits
   on Catalog.ready()), so this cannot wait for DOMContentLoaded
   — that event fires before the async markup exists. Instead,
   producto-render.js calls window.initProductGallery() itself
   right after it injects the markup.
   ========================================================= */

function initProductGallery() {
  const mainImg = document.getElementById('mainImg');
  const thumbRow = document.getElementById('thumbRow');
  if (!mainImg || !thumbRow) return;

  thumbRow.querySelectorAll('.thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.img;
      if (!src) return;
      mainImg.style.opacity = 0;
      setTimeout(() => { mainImg.src = src; mainImg.style.opacity = 1; }, 150);
      thumbRow.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

window.initProductGallery = initProductGallery;
