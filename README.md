# Dragon Ball ES - Cronología para Stremio

Addon estático de Stremio con catálogos de Dragon Ball en español, preparado para publicarse directamente en GitHub Pages.

Este addon **solo organiza catálogos**. No incluye streams, torrents, magnet links, scraping ni contenido P2P.

## Qué hace

La pestaña principal del addon es:

```txt
Dragon Ball - Orden de visualización
```

Esa pestaña mezcla series, películas, especiales, OVAs y líneas alternativas en un único orden numerado para quien quiera seguir Dragon Ball paso a paso.

## Catálogos incluidos

- Dragon Ball - Orden de visualización
- Dragon Ball - Series principales
- Dragon Ball - Series por estreno
- Dragon Ball - GT / Heroes
- Dragon Ball - Películas por estreno
- Dragon Ball - Películas en orden narrativo
- Dragon Ball - Películas canon moderno
- Dragon Ball - Especiales y OVAs

## Instalación rápida en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos de esta carpeta al repositorio.
3. Entra en **Settings > Pages**.
4. En **Build and deployment**, usa:
   - **Source:** Deploy from a branch
   - **Branch:** main
   - **Folder:** /docs
5. Guarda.
6. Abre la web publicada por GitHub Pages.

Tu manifest quedará en:

```txt
https://TU_USUARIO.github.io/TU_REPO/manifest.json
```

Instalación directa en Stremio:

```txt
stremio://TU_USUARIO.github.io/TU_REPO/manifest.json
```

También puedes abrir la URL pública del addon y pulsar el botón **Instalar en Stremio**.

## Documentación completa

Lee el tutorial incluido:

```txt
TUTORIAL_GITHUB_STREMIO.md
```

Ahí tienes pasos por interfaz web, pasos por terminal, comprobaciones, solución de errores y cómo actualizar el addon.

## Validar o regenerar el addon

El addon ya viene generado dentro de `docs/`. Solo necesitas Node.js si modificas `src/data/dragonball-data.js`.

```bash
npm install
npm run validate
npm run build
```

## Estructura

```txt
dragonball-stremio-addon/
├── docs/                         # Carpeta que GitHub Pages publica
│   ├── manifest.json             # Manifest principal de Stremio
│   ├── index.html                # Página con botón de instalación
│   └── catalog/                  # Respuestas JSON de los catálogos
├── src/data/dragonball-data.js   # Base editable de títulos y catálogos
├── scripts/build-static.js       # Generador/validador
├── CRONOLOGIA_DRAGON_BALL.md     # Documento de cronología
├── CRONOLOGIA_DRAGON_BALL.docx   # Documento editable
└── TUTORIAL_GITHUB_STREMIO.md    # Guía de publicación e instalación
```

## Notas importantes

- Es un addon estático: no necesita servidor, backend, base de datos ni API keys.
- GitHub Pages debe publicar la carpeta `/docs`.
- Si cambias títulos, IDs o catálogos, ejecuta `npm run build` antes de subir los cambios.
- Si Stremio no actualiza el addon, sube la versión del manifest o desinstala/reinstala el addon.
- El addon no reproduce nada por sí mismo. Solo organiza la cronología y deja que Stremio/otros addons resuelvan la disponibilidad.

## Fuentes usadas

- Dragon Ball Official Site - cronología y listado de anime/películas.
- IMDb title pages para IDs `tt...`.
- Stremio Addon SDK / Protocol documentation.
- GitHub Pages documentation.
