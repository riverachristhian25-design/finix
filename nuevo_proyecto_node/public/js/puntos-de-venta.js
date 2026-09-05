/* =========================================================
   PEGANTES FINIX — puntos-de-venta.js
   Behaviour specific to puntos-de-venta.html.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const CITIES_1 = ['La Troncal — Matriz', 'La Troncal — Ecuacerámica', 'La Troncal — Centro de Acopio', 'El Triunfo', 'Milagro', 'La Libertad', 'Cumandá', 'Babahoyo I', 'Babahoyo II'];
  const CITIES_2 = ['Portoviejo', 'Quevedo', 'Naranjal', 'Machala', 'Pasaje', 'Montecristi', 'Santo Domingo', 'Durán', 'Daule', 'Playas', 'La Aurora', 'Naranjito'];
  const ALL_CITIES = [...CITIES_1, ...CITIES_2];

  const pinIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.3-7-11.5A7 7 0 0 1 19 9.5C19 14.7 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.4"/></svg>';

  function fillGrid(el, items) {
    if (!el) return;
    el.innerHTML = items.map(c => `<div class="city-chip">${pinIcon}<span>${c}</span></div>`).join('');
  }
  fillGrid(document.getElementById('grid1'), CITIES_1);
  fillGrid(document.getElementById('grid2'), CITIES_2);

  const marquee = document.getElementById('citiesMarquee');
  if (marquee) {
    marquee.innerHTML = [...ALL_CITIES, ...ALL_CITIES].map(c => `<span>${c}</span>`).join('');
  }

});
