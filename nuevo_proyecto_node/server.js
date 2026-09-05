require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const PRODUCTS_FILE = path.join(PUBLIC_DIR, 'data', 'products.json');

const ADMIN_USER = process.env.ADMIN_USER || 'finixadmin';
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH || '';
const IS_PROD = process.env.NODE_ENV === 'production';

app.set('trust proxy', 1); // cPanel/Render suelen poner un proxy con HTTPS delante

app.use(express.json({ limit: '5mb' }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'cambia-esto-por-un-valor-largo-y-aleatorio',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: IS_PROD,
    maxAge: 8 * 60 * 60 * 1000, // 8 horas
  },
}));

function requireAuth(req, res, next) {
  if (req.session && req.session.authed) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'No autenticado' });
  return res.redirect('/admin/login.html');
}

/* ---------- login / logout ---------- */

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!ADMIN_PASS_HASH) {
    return res.status(500).json({
      error: 'El servidor no tiene ADMIN_PASS_HASH configurado. Revisa el archivo .env (ver .env.example).',
    });
  }

  const okUser = username === ADMIN_USER;
  const okPass = okUser && bcrypt.compareSync(String(password || ''), ADMIN_PASS_HASH);

  if (!okUser || !okPass) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
  }

  req.session.authed = true;
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/session', (req, res) => {
  res.json({ authed: !!(req.session && req.session.authed) });
});

/* ---------- página protegida del generador ---------- */
/* Registrada antes de express.static para que la sesión se
   revise antes de servir el archivo. */

app.get('/admin/generador-productos.html', requireAuth, (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'admin', 'generador-productos.html'));
});

/* ---------- API de productos ---------- */

app.get('/api/productos', (req, res) => {
  fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer products.json' });
    res.type('application/json').send(data);
  });
});

app.post('/api/productos/save', requireAuth, (req, res) => {
  const body = req.body;
  if (!body || !Array.isArray(body.products)) {
    return res.status(400).json({ error: 'Formato inválido: se espera { products: [...] }' });
  }

  const json = JSON.stringify(body, null, 2);
  const tmpFile = PRODUCTS_FILE + '.tmp';

  fs.writeFile(tmpFile, json, 'utf8', (writeErr) => {
    if (writeErr) return res.status(500).json({ error: 'No se pudo escribir el archivo temporal.' });

    fs.rename(tmpFile, PRODUCTS_FILE, (renameErr) => {
      if (renameErr) return res.status(500).json({ error: 'No se pudo reemplazar products.json.' });
      res.json({ ok: true, count: body.products.length });
    });
  });
});

/* ---------- resto del sitio (estático) ---------- */

app.use(express.static(PUBLIC_DIR));

app.listen(PORT, () => {
  console.log(`Pegantes Finix corriendo en http://localhost:${PORT}`);
});
