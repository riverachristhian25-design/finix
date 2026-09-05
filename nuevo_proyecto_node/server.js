require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const PRODUCTS_FILE = path.join(PUBLIC_DIR, 'data', 'products.json');
const IMG_DIR = path.join(PUBLIC_DIR, 'img');
const PDF_DIR = path.join(PUBLIC_DIR, 'pdf');

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024; // 100 MB, pedido por el cliente
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const ALLOWED_PDF_TYPES = new Set(['application/pdf']);

function sanitizeFilename(name) {
  const base = path.basename(name || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
  return base.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-') || 'archivo';
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      const kind = req.query.kind === 'pdf' ? 'pdf' : 'img';
      cb(null, kind === 'pdf' ? PDF_DIR : IMG_DIR);
    },
    filename(req, file, cb) {
      cb(null, sanitizeFilename(file.originalname));
    },
  }),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter(req, file, cb) {
    const kind = req.query.kind === 'pdf' ? 'pdf' : 'img';
    const allowed = kind === 'pdf' ? ALLOWED_PDF_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowed.has(file.mimetype)) {
      return cb(new Error(kind === 'pdf' ? 'Solo se aceptan archivos PDF.' : 'Solo se aceptan imágenes PNG, JPG/JPEG, WEBP o GIF.'));
    }
    cb(null, true);
  },
});

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

/* ---------- subida de fotos y PDF ---------- */

fs.mkdirSync(IMG_DIR, { recursive: true });
fs.mkdirSync(PDF_DIR, { recursive: true });

app.post('/api/upload', requireAuth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'El archivo supera el límite de 100 MB.' });
      }
      return res.status(400).json({ error: 'Error al subir el archivo: ' + err.message });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo.' });
    }
    const kind = req.query.kind === 'pdf' ? 'pdf' : 'img';
    res.json({ ok: true, filename: req.file.filename, path: `${kind}/${req.file.filename}` });
  });
});

/* ---------- resto del sitio (estático) ---------- */

app.use(express.static(PUBLIC_DIR));

app.listen(PORT, () => {
  console.log(`Pegantes Finix corriendo en http://localhost:${PORT}`);
});
