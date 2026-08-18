# Dragon Ball ES - Cronología para Stremio

Addon estático de Stremio con catálogos de Dragon Ball en español, preparado para publicarse directamente en GitHub Pages.

Este addon **solo organiza catálogos**. No incluye streams, torrents, magnet links, scraping ni contenido P2P.

## URL del addon

Cuando GitHub Pages esté activado, la URL pública será:

```txt
https://yancha10.github.io/stremio-dragonball-es-catalog/
```

Manifest para instalar en Stremio:

```txt
https://yancha10.github.io/stremio-dragonball-es-catalog/manifest.json
```

Instalación directa:

```txt
stremio://yancha10.github.io/stremio-dragonball-es-catalog/manifest.json
```

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

## Activar GitHub Pages

En el repositorio, ve a:

```txt
Settings > Pages
```

Y configura:

```txt
Source: Deploy from a branch
Branch: main
Folder: /docs
```

Guarda. GitHub publicará la web del addon.

## Validar o regenerar el addon

El addon ya viene generado dentro de `docs/`. Solo necesitas Node.js si modificas los JSON o quieres validar.

```bash
npm run validate
npm run build
```

## Estructura

```txt
stremio-dragonball-es-catalog/
├── docs/                         # Carpeta que GitHub Pages publica
│   ├── manifest.json             # Manifest principal de Stremio
│   ├── index.html                # Página con botón de instalación
│   └── catalog/                  # Respuestas JSON de los catálogos
├── src/data/dragonball-data.js   # Loader de datos para validar/reconstruir
├── scripts/build-static.js       # Generador/validador
├── CRONOLOGIA_DRAGON_BALL.md     # Documento de cronología
├── TUTORIAL_GITHUB_STREMIO.md    # Guía de publicación e instalación
├── package.json
├── .gitignore
└── LICENSE
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
