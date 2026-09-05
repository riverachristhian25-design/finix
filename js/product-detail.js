/* =========================================================
   PEGANTES FINIX — product-detail.js
   Behaviour shared by every producto-*.html page.
   The thumbnails and their images live in the HTML markup
   (data-img attribute) — this script only wires up the click
   behaviour, it does not generate content.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

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

});
