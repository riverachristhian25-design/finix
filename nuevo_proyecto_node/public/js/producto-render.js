/* =========================================================
   PEGANTES FINIX — producto-render.js
   Builds the entire product detail page from data/products.json.
   URL shape: producto.html?p=<id>   e.g. producto.html?p=standard
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('productMain');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('p');

  Catalog.ready().then(() => {
    const p = id ? Catalog.byId(id) : null;

    if (!p) {
      main.innerHTML = notFoundMarkup(id);
      return;
    }
    if (p.status !== 'activo') {
      main.innerHTML = comingSoonMarkup(p);
      return;
    }

    document.title = `Pegante Finix ${p.name} — Ficha Técnica y Características`;
    main.innerHTML = productMarkup(p);
    if (window.initProductGallery) window.initProductGallery();
  });
});

/* ---------- small icon helpers (reused across steps/blocks) ---------- */
const ICO_BENEFICIOS = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Z"/></svg>';
const ICO_USOS = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6" fill="currentColor"/></svg>';
const ICO_SUPERFICIES = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8" rx="1.2"/><rect x="13" y="3" width="8" height="8" rx="1.2"/><rect x="3" y="13" width="8" height="8" rx="1.2"/><rect x="13" y="13" width="8" height="8" rx="1.2"/></svg>';
const ICO_PDF = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 15h6M9 11h3"/></svg>';
const ICO_MAP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 2 3 7v2h18V7z"/><path d="M4 10v9M8 10v9M12 10v9M16 10v9M20 10v9"/><path d="M2 21h20"/></svg>';

const STEP_ICONS = {
  'añada': '<path d="M6 3h5l1 4h5"/><path d="M7 7l1.5 12a2 2 0 0 0 2 1.8h3a2 2 0 0 0 2-1.8L17 7"/><path d="M9 11h6M9 14h6"/>',
  'aplique': '<path d="M3 20 20 3"/><path d="M14 3h7v7"/><path d="M3 13v7h7"/>',
  'coloque': '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1" stroke-dasharray="2 2"/>',
  'prepare': '<path d="M3 3h18v18H3z"/><path d="M3 9h18M9 21V9"/>',
  'afine': '<path d="M4 20h16"/><path d="M6 20V10l6-6 6 6v10"/>',
};
function stepIcon(title) {
  const key = (title || '').trim().toLowerCase();
  const paths = STEP_ICONS[key] || '<circle cx="12" cy="12" r="9"/>';
  return `<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${paths}</svg>`;
}

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function notFoundMarkup(id) {
  return `
    <section class="product-hero">
      <div class="wrap">
        <div class="crumb"><a href="index.html">Inicio</a> / <a href="productos.html">Productos</a> / No encontrado</div>
        <h1>PRODUCTO <b>NO ENCONTRADO</b></h1>
        <p class="sub">${id ? `No existe un producto con el identificador "${esc(id)}".` : 'No se especificó qué producto mostrar.'}</p>
        <p class="sub"><a href="productos.html" class="btn btn-dark" style="margin-top:20px;">Ver todos los productos</a></p>
      </div>
    </section>`;
}

function comingSoonMarkup(p) {
  return `
    <section class="product-hero">
      <div class="wrap">
        <div class="crumb"><a href="index.html">Inicio</a> / <a href="productos.html">Productos</a> / ${esc(p.name)}</div>
        <h1><b>${esc(p.displayName || p.name)}</b></h1>
        <p class="sub">${esc(p.short || 'Producto por lanzarse')}</p>
        <p class="sub"><a href="productos.html" class="btn btn-dark" style="margin-top:20px;">Ver todos los productos</a></p>
      </div>
    </section>`;
}

function productMarkup(p) {
  const presChips = (p.formats || []).map(f => `<div class="pres-chip">${esc(f.value)}<small>${esc(f.unit)}</small></div>`).join('');

  let yieldBlockTitle = 'Rendimiento';
  let yieldBlockBody;
  if (p.yieldTable && p.yieldTable.length) {
    yieldBlockTitle = 'Rendimiento por espesor';
    yieldBlockBody = `
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <thead>
          <tr style="border-bottom:1.5px solid var(--line);">
            <th style="text-align:left; padding:8px 0; color:var(--steel-dim); font-family:var(--mono); font-size:11px; text-transform:uppercase; letter-spacing:.06em;">Espesor</th>
            <th style="text-align:right; padding:8px 0; color:var(--steel-dim); font-family:var(--mono); font-size:11px; text-transform:uppercase; letter-spacing:.06em;">m² por saco</th>
          </tr>
        </thead>
        <tbody>
          ${p.yieldTable.map(r => `<tr style="border-bottom:1px solid var(--line);"><td style="padding:9px 0; font-weight:600;">${esc(r.espesor)}</td><td style="padding:9px 0; text-align:right;">${esc(r.rendimiento)}</td></tr>`).join('')}
        </tbody>
      </table>`;
  } else {
    yieldBlockBody = `<ul class="yield-list">${(p.yieldList || []).map(y => `<li>${esc(y)}</li>`).join('')}</ul>`;
  }

  const thumbs = ['frontal', 'derecha', 'izquierda']
    .filter(k => p.images && p.images[k])
    .map((k, i) => `<button type="button" class="thumb${i === 0 ? ' active' : ''}" data-img="${esc(p.images[k])}"><img src="${esc(p.images[k])}" alt="${esc(p.displayName)} - ${k}"></button>`)
    .join('\n');

  const surfacesCols = chunk(p.superficies || [], Math.ceil((p.superficies || []).length / 2));
  const surfacesHtml = surfacesCols.map(col =>
    `<div><ul>${col.map((s, i) => `<li style="display:flex;gap:10px;${i < col.length - 1 ? 'margin-bottom:10px;' : ''}"><span style="color:var(--accent);font-weight:800;">•</span>${esc(s)}</li>`).join('')}</ul></div>`
  ).join('');

  const stepsHtml = (p.pasos || []).map((s, i) => `
    <div class="step-card">
      <div class="step-visual">${stepIcon(s.title)}</div>
      <div class="step-body">
        <span class="num">PASO ${String(i + 1).padStart(2, '0')}</span>
        <h4>${esc(s.title)}</h4>
        <p>${esc(s.desc)}</p>
      </div>
    </div>`).join('');

  return `
  <section class="product-hero">
    <div class="wrap">
      <div class="crumb"><a href="index.html">Inicio</a> / <a href="productos.html">Productos</a> / ${esc(p.name)}</div>
      <h1>${p.heroPrefix ? esc(p.heroPrefix) + ' ' : ''}<b>${esc(p.heroTitle)}</b></h1>
      <p class="sub">${esc(p.heroSub)}</p>
      <p class="norm-line">${esc(p.normLine)}</p>
    </div>
  </section>

  <section class="product-main">
    <div class="wrap main-grid">
      <div class="gallery-col">
        <div class="gallery-main"><img id="mainImg" src="${esc(p.images.frontal)}" alt="Pegante ${esc(p.displayName)}"></div>
        <div class="thumb-row" id="thumbRow">${thumbs}</div>
      </div>

      <div class="info-col">
        <h2>Descripción</h2>
        <p class="desc">${p.desc}</p>

        <div class="fact-block">
          <h3>Presentaciones disponibles</h3>
          <div class="pres-chips">${presChips}</div>
        </div>

        <div class="fact-block">
          <h3>${esc(yieldBlockTitle)}</h3>
          ${yieldBlockBody}
        </div>

        <div class="fact-block">
          <h3>Información técnica descargable</h3>
          <div class="ficha-row">
            <a class="btn btn-dark" id="fichaBtn" href="${esc(p.pdf)}" download>
              ${ICO_PDF}
              Ficha Técnica
            </a>
            <div class="norm-badge"><small>Cumple la norma</small><strong>${esc(p.normBadge)}</strong></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="detail-section">
    <div class="wrap">
      <div class="detail-grid">
        <div class="detail-block">
          <h3><span class="ico">${ICO_BENEFICIOS}</span>Beneficios</h3>
          <ul>${(p.beneficios || []).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
        </div>
        <div class="detail-block">
          <h3><span class="ico">${ICO_USOS}</span>Usos recomendados</h3>
          <ul>${(p.usos || []).map(u => `<li>${esc(u)}</li>`).join('')}</ul>
        </div>
      </div>

      <div class="surfaces-row">
        <h3 style="font-size:19px; display:flex; align-items:center; gap:12px;">
          <span class="ico" style="display:inline-flex;">${ICO_SUPERFICIES}</span>
          Superficies recomendadas
        </h3>
        <div class="surfaces-cols">${surfacesHtml}</div>
      </div>
    </div>
  </section>

  <section class="steps-section">
    <div class="wrap">
      <span class="eyebrow">Modo de empleo</span>
      <h2 style="font-size:clamp(26px,4vw,38px); margin-top:12px;">PASOS DE USO</h2>
      <div class="steps-grid">${stepsHtml}</div>
    </div>
  </section>

  <section class="find-section">
    <div class="wrap find-grid">
      <div class="find-copy">
        <span class="eyebrow">Puntos de venta</span>
        <h2 style="font-size:clamp(28px,4vw,42px); margin-top:12px;">ENCUÉNTRALO EN</h2>
        <p>Nosotros proyectamos tus sueños y te acercamos a ellos. Nuestros pegantes se encuentran distribuidos en todas las tiendas Innova Centro Cerámico a nivel nacional.</p>
        <a href="index.html#coverage" class="btn btn-dark">¡Te indicamos cómo comprarlo!</a>
      </div>
      <div class="find-visual">${ICO_MAP}</div>
    </div>
  </section>

  <section class="cta-band">
    <div class="wrap inner">
      <span class="eyebrow">¿Tienes dudas?</span>
      <h2>¡CONTÁCTENOS PARA UNA ASESORÍA<br>PERSONALIZADA EN OBRA!</h2>
      <a href="https://wa.me/593982665958" target="_blank" rel="noopener" class="btn btn-primary btn-lg">Transformemos tus espacios</a>
    </div>
  </section>`;
}

function chunk(arr, size) {
  if (!size) return [arr];
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
