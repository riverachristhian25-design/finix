# Proteger admin/ con usuario y contraseña (cPanel / Apache)

Esta carpeta incluye `.htaccess` y `.htpasswd` para pedir usuario y
contraseña **antes** de que el navegador cargue
`generador-productos.html`. Es protección real de servidor (no un
candado hecho en JavaScript, que cualquiera podría saltarse viendo el
código fuente).

## Credenciales generadas

- Usuario: `finixadmin`
- Contraseña: `qAnBbE0AS1x4cN`

**Cámbiala apenas puedas** (ver abajo cómo generar una nueva).
Guárdala en un lugar seguro (gestor de contraseñas), no en este
archivo ni en ningún chat.

## Paso obligatorio antes de que funcione

Abre `admin/.htaccess` y reemplaza `USUARIO_CPANEL` por tu usuario
real de cPanel en esta línea:

```
AuthUserFile /home/USUARIO_CPANEL/public_html/admin/.htpasswd
```

Ese usuario aparece en la URL del panel de cPanel o te lo puede
confirmar tu proveedor de hosting. Si el sitio no vive en
`public_html` sino en una subcarpeta, ajusta también esa parte de la
ruta. `AuthUserFile` necesita la ruta real en el servidor, no una
URL — por eso no se puede dejar genérica.

Sube ambos archivos (`.htaccess` y `.htpasswd`) dentro de `admin/`
igual que subes cualquier otro archivo del sitio. Como muchos
clientes FTP ocultan los archivos que empiezan con punto, activa
"mostrar archivos ocultos" en tu programa de FTP para verlos y
confirmar que se subieron.

## Cómo cambiar la contraseña más adelante

Con OpenSSL (Mac/Linux, o Git Bash en Windows):

```
openssl passwd -apr1 "tu-nueva-contraseña"
```

Copia el resultado (algo como `$apr1$....`) y reemplaza la parte
después de `finixadmin:` en `.htpasswd`, o cambia también el usuario
si quieres.

## Alternativa recomendada si tu cPanel la ofrece

La mayoría de cPanel tiene una opción propia llamada **"Privacidad de
directorios" / "Directory Privacy"** en la sección de Archivos. Es
más segura porque guarda el archivo de contraseñas fuera de la carpeta
pública del sitio, y no requiere editar ningún archivo a mano:

1. En cPanel, entra a "Privacidad de directorios".
2. Navega hasta la carpeta `admin/` dentro de tu sitio.
3. Actívala y crea un usuario y contraseña desde ahí.
4. Si usas esta opción, puedes borrar `.htaccess` y `.htpasswd` de
   esta carpeta — cPanel crea los suyos automáticamente.

## Si ves un error 500 al abrir admin/

Algunos hostings antiguos (Apache 2.2) no entienden la sintaxis
`Require all denied`. Si pasa eso, abre un ticket con tu proveedor
para confirmar la versión de Apache, o reemplaza esas dos líneas por:

```
Order deny,allow
Deny from all
```
