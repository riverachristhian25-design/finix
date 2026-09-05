# Pegantes Finix — versión Node.js

Mismo sitio de siempre (`index.html`, `productos.html`, etc.) pero
servido por un pequeño servidor Node/Express. La diferencia con la
versión estática: cuando agregas o editas un producto en
`admin/generador-productos.html`, el cambio se **guarda de verdad**
en el servidor (archivo `public/data/products.json`) con un clic —
ya no hay que descargar el JSON y volver a subirlo por FTP.

Corre exactamente igual en tu computadora (localhost), en un cPanel
con soporte de Node.js, y en Render — es el mismo código en los tres
lugares.

## Estructura

```
nuevo_proyecto_node/
  server.js              ← servidor Express (páginas + API)
  package.json
  .env.example           ← copia esto a .env y complétalo
  scripts/hash-password.js
  public/                ← todo el sitio (antes vivía en site/)
    index.html, productos.html, ...
    css/ js/ img/ pdf/
    data/products.json   ← el servidor escribe aquí al guardar
    admin/
      login.html
      generador-productos.html
```

## 1. Instalar dependencias

```
cd nuevo_proyecto_node
npm install
```

## 2. Configurar el usuario y contraseña del admin

Copia `.env.example` a `.env`:

```
cp .env.example .env
```

Genera el hash de tu contraseña (no se guarda en texto plano):

```
npm run hash-password -- "tu-contraseña-elegida"
```

Copia el resultado (empieza con `$2a$...`) dentro de `.env`, en
`ADMIN_PASS_HASH`. Cambia también `ADMIN_USER` si quieres, y pon un
valor largo y aleatorio en `SESSION_SECRET`.

## 3. Correr en tu computadora (localhost)

```
npm start
```

Abre `http://localhost:3000`. El sitio público funciona igual que
antes. Para editar productos entra a
`http://localhost:3000/admin/login.html`, inicia sesión, y usa
"Guardar en el servidor" en el generador de productos.

## 4. Subir a cPanel

La mayoría de cPanel moderno trae **"Setup Node.js App"**:

1. Sube toda la carpeta `nuevo_proyecto_node` al hosting (por FTP o
   el administrador de archivos), fuera de `public_html` si tu
   proveedor lo pide (la herramienta de Node te indica dónde).
2. En "Setup Node.js App": crea una app nueva, apunta el
   "Application root" a esta carpeta, "Application startup file" a
   `server.js`.
3. En "Environment variables" de esa misma pantalla agrega
   `ADMIN_USER`, `ADMIN_PASS_HASH`, `SESSION_SECRET`, `NODE_ENV=production`
   (los mismos valores que pusiste en tu `.env` local — no subas el
   archivo `.env` real, cárgalos ahí).
4. Presiona "Run NPM Install" desde el panel, luego "Restart".
5. cPanel te da la URL/dominio conectado a esa app.

Ya no se necesita `.htaccess`/`.htpasswd` (esos archivos eran solo
para Apache) — el login ahora lo maneja el propio servidor Node
igual en cualquier hosting.

## 5. Subir a Render (para que el cliente pruebe)

1. Sube esta carpeta a un repositorio de GitHub (o todo el proyecto,
   Render puede apuntar a un subdirectorio).
2. En Render: **New → Web Service**, conecta el repo.
   - Root Directory: `nuevo_proyecto_node` (si el repo tiene más cosas
     alrededor).
   - Build Command: `npm install`
   - Start Command: `npm start`
3. En "Environment" agrega `ADMIN_USER`, `ADMIN_PASS_HASH`,
   `SESSION_SECRET`, `NODE_ENV=production`.
4. Deploy. Render te da una URL pública (`https://algo.onrender.com`)
   para que el cliente pruebe el sitio y el generador de productos.

## Notas

- `data/products.json` vive dentro de `public/`, igual que antes —
  se sigue leyendo con una petición normal a `/data/products.json`.
  Nada cambia en `catalog.js`, `producto-render.js`, etc.
- El plan gratuito de Render "duerme" el servicio si no recibe
  tráfico; la primera visita después de dormir tarda unos segundos
  en responder. Para pruebas con el cliente es suficiente.
- Con un solo servidor corriendo (el caso normal aquí), la sesión en
  memoria (`express-session`) es suficiente. Si más adelante corres
  varias instancias a la vez, cambia a un almacén de sesión
  compartido (ej. Redis) — no hace falta para este proyecto.
