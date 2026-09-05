/* =========================================================
   PEGANTES FINIX — products-page.js
   Renders the product grid on productos.html straight from
   data/products.json (via js/catalog.js), then wires up the
   ADHESIVOS / RECUBRIMIENTOS / COMPLEMENTARIOS tabs.
   Adding a product to the catalog is enough to make it show
   up here — no HTML edits required.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  Catalog.ready().then(() => {
    document.querySelectorAll('.product-grid[data-cat]').forEach(grid => {
      const cat = grid.dataset.cat;
      const items = Catalog.byCat(cat);
      grid.innerHTML = items.map(cardMarkup).join('');
    });
  });

  const tabs = document.querySelectorAll('.cat-tab');
  const panels = document.querySelectorAll('.cat-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      tabs.forEach(t => t.classList.toggle('active', t === tab));
      panels.forEach(p => p.classList.toggle('active', p.id === target));
    });
  });

});

function cardMarkup(p) {
  const img = (p.images && (p.images.frontal || Object.values(p.images)[0])) || '';
  const badge = p.status === 'proximamente' ? '<span class="card-badge">Producto por lanzarse</span>' : '';
  const comingClass = p.status === 'proximamente' ? ' coming' : '';

  const media = `<div class="card-media">${badge}<img src="${img}" alt="${p.displayName}"></div>
    <h3>${p.displayName}</h3>
    <p>${p.short}</p>`;

  if (p.status === 'activo') {
    return `<a class="product-card" href="producto.html?p=${encodeURIComponent(p.id)}">${media}</a>`;
  }
  if (p.status === 'consultar' && p.contactLink) {
    return `<a class="product-card" href="${p.contactLink}" target="_blank" rel="noopener">${media}</a>`;
  }
  return `<div class="product-card${comingClass}">${media}</div>`;
}
