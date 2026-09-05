/* =========================================================
   PEGANTES FINIX — catalog.js
   Loads data/products.json (the single source of truth for
   every product) and exposes small helpers on window.Catalog.
   Every page-specific script waits for Catalog.ready() before
   touching the data.
   ========================================================= */

window.Catalog = (function () {
  let _products = null;
  let _promise = null;

  function load() {
    if (_promise) return _promise;
    _promise = fetch('data/products.json')
      .then(r => {
        if (!r.ok) throw new Error('No se pudo cargar data/products.json (HTTP ' + r.status + ')');
        return r.json();
      })
      .then(json => {
        _products = json.products || [];
        return _products;
      })
      .catch(err => {
        console.error('[Catalog] Error cargando el catálogo:', err);
        _products = [];
        return _products;
      });
    return _promise;
  }

  return {
    /** Resolves with the full product array once data/products.json has loaded. */
    ready: load,
    /** Convenience getters — only reliable after ready() has resolved. */
    all: () => _products || [],
    byId: (id) => (_products || []).find(p => p.id === id) || null,
    byCat: (cat) => (_products || []).filter(p => p.cat === cat),
    active: () => (_products || []).filter(p => p.status === 'activo'),
  };
})();
