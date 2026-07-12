# Convergencia

Asesoría y materiales para la educación real.

Sitio web estático de 4 páginas para el emprendimiento Convergencia: materiales didácticos digitales + asesoría profesional para docentes.

## Estructura

```
convergencia/
├── index.html          # Landing page
├── tienda.html         # Catálogo con filtros y carrito
├── nosotros.html       # Perfil de la creadora y valores
├── contacto.html       # Formulario y canales de contacto
├── 404.html            # Página no encontrada
├── css/
│   └── styles.css      # Estilos centralizados
├── js/
│   └── app.js          # Lógica de navegación, tienda y carrito
├── assets/
│   ├── images/         # Placeholders para productos, equipo y hero
│   └── samples/        # PDFs de muestra (por agregar)
└── .nojekyll           # Para publicar en GitHub Pages sin Jekyll
```

## Tecnologías

- HTML5 semántico
- CSS3 con variables nativas
- JavaScript ES6+ vanilla
- Sin frameworks, sin build steps, sin dependencias de backend

## Cómo usar localmente

1. Clona o descarga este repositorio.
2. Abre `index.html` en tu navegador.
3. Para probar la tienda y el carrito, usa un servidor local simple:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

Luego visita `http://localhost:8000`.

## Carrito y checkout

- Los productos se añaden al carrito y se guardan en `localStorage`.
- El checkout redirige a WhatsApp con el resumen del pedido.
- El número de WhatsApp es un placeholder; actualízalo en `js/app.js` (`checkoutWhatsApp`).

## Placeholders

Las imágenes y PDFs de muestra son placeholders. Reemplázalos por:

- `assets/images/productos/*.webp` — portadas de los PDFs.
- `assets/images/equipo/creadora.webp` — foto de la creadora.
- `assets/images/hero/aula.webp` — imagen de fondo del hero.
- `assets/samples/*.pdf` — versiones de muestra de 2-3 páginas.

## Personalización

- Paleta y espaciado: `css/styles.css` → `:root`.
- Productos: `js/app.js` → `const productos`.
- Datos de contacto: busca los placeholders en todos los HTML y en `js/app.js`.

## Deploy en GitHub Pages

1. Sube el repositorio a GitHub.
2. Ve a **Settings > Pages**.
3. Selecciona la rama principal y la carpeta raíz (`/`).
4. El archivo `.nojekyll` evita que GitHub Pages procese el sitio con Jekyll.

## Licencia

© 2026 Convergencia. Todos los derechos reservados.
Materiales protegidos por derechos de autor.
