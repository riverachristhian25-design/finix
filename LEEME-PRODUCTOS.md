# Cómo agregar o editar productos — sin tocar código

El sitio ahora lee todos los productos desde **un solo archivo**:
`data/products.json`. La página de Productos (`productos.html`) y cada
ficha técnica (`producto.html?p=...`) se dibujan solas a partir de ese
archivo. Para agregar un producto nuevo **no hace falta escribir HTML,
CSS ni JavaScript** — solo completar un formulario.

## Opción recomendada: usar el Generador de Productos

1. Abre `admin/generador-productos.html` en tu navegador (Chrome,
   Firefox, Edge). Esta página es solo para uso interno — no está
   enlazada desde el sitio público, y una vez subida al hosting pide
   usuario y contraseña antes de cargar (ver
   `admin/LEEME-SEGURIDAD.md` para configurarla).
2. Copia las fotos del producto (frontal, derecha, izquierda) a la
   carpeta `img/` del sitio, y el PDF de la ficha técnica a la carpeta
   `pdf/`. Anota los nombres exactos de esos archivos.
3. Completa el formulario:
   - Si el producto ya tiene ficha técnica completa, elige **Estado:
     Activo** y llena toda la información (descripción, beneficios,
     usos, pasos de uso, etc.).
   - Si el producto todavía no está disponible, elige **Estado:
     Próximamente** — solo pide nombre, foto y descripción corta, y
     aparecerá con la etiqueta "Producto por lanzarse", igual que
     Finix Nivelador o Finix Formato Grande.
   - Si el producto existe pero todavía no tiene página propia (por
     ejemplo, un producto que se vende por consulta directa), elige
     **Estado: Consultar** y coloca el enlace de WhatsApp.
4. Haz clic en **"Agregar producto a la lista"**. Puedes agregar o
   editar varios productos antes de continuar.
5. Cuando termines, haz clic en **"Descargar products.json"**.
6. Sube (reemplaza) ese archivo en `data/products.json` en el
   servidor del sitio, tal como subes cualquier otro archivo por tu
   panel de hosting o FTP.

Listo — el producto aparece automáticamente en la página de
Productos, en la categoría correcta, y ya tiene su propia ficha
técnica en `producto.html?p=<identificador>`, sin tocar ningún
archivo de código.

## Editar un producto existente

Abre el Generador de Productos: el catálogo actual se carga solo.
Haz clic en **"Editar"** junto al producto, cambia lo que necesites y
vuelve a hacer clic en **"Agregar producto a la lista"** (esto
actualiza ese producto en vez de crear uno nuevo). Al final, descarga
`products.json` y reemplázalo igual que antes.

## Eliminar un producto

En el Generador de Productos, haz clic en **"Eliminar"** junto al
producto y luego descarga `products.json` para guardar el cambio.

## Opción alternativa: editar el archivo directamente

`data/products.json` es un archivo de texto plano que también se
puede editar a mano con cualquier editor (Bloc de notas, VS Code,
etc.) copiando el formato de un producto existente. Esto ya requiere
más cuidado con las comas y comillas del formato JSON — se
recomienda usar el Generador de Productos para evitar errores.

## Resumen de las carpetas del sitio

- `data/products.json` — toda la información de los productos.
- `img/` — fotos de los productos y el logo.
- `pdf/` — fichas técnicas en PDF.
- `admin/generador-productos.html` — la herramienta para agregar o
  editar productos sin programar.

No es necesario tocar `index.html`, `productos.html`,
`producto.html` ni ninguno de los archivos en `css/` o `js/` para
agregar, editar o quitar productos.
