# Tutorial: publicar e instalar el addon Dragon Ball ES en Stremio

Este repositorio ya está preparado como **addon estático de Stremio** para GitHub Pages.

No necesita servidor Node en producción. GitHub Pages solo sirve archivos estáticos desde `docs/`: `manifest.json`, la página `index.html` y los catálogos JSON.

## URL del repositorio

```txt
https://github.com/Yancha10/stremio-dragonball-es-catalog
```

## URL final del addon cuando actives GitHub Pages

```txt
https://yancha10.github.io/stremio-dragonball-es-catalog/
```

## URL del manifest para Stremio

```txt
https://yancha10.github.io/stremio-dragonball-es-catalog/manifest.json
```

## Enlace directo de instalación

```txt
stremio://yancha10.github.io/stremio-dragonball-es-catalog/manifest.json
```

## 1. Activar GitHub Pages

En GitHub:

1. Entra en el repositorio.
2. Abre **Settings**.
3. En el menú lateral entra en **Pages**.
4. En **Build and deployment**, selecciona:

```txt
Source: Deploy from a branch
Branch: main
Folder: /docs
```

5. Pulsa **Save**.
6. Espera a que GitHub publique la web.

## 2. Comprobar que funciona

Abre estas URLs en el navegador:

```txt
https://yancha10.github.io/stremio-dragonball-es-catalog/
```

Debe aparecer la página del addon con el botón **Instalar en Stremio**.

Después abre:

```txt
https://yancha10.github.io/stremio-dragonball-es-catalog/manifest.json
```

Debe aparecer un JSON con el nombre:

```txt
Dragon Ball ES - Cronología
```

Comprueba también el catálogo principal:

```txt
https://yancha10.github.io/stremio-dragonball-es-catalog/catalog/series/db-orden-visualizacion.json
```

Debe devolver una lista `metas` con títulos numerados.

## 3. Instalar en Stremio

### Método recomendado

1. Abre:

```txt
https://yancha10.github.io/stremio-dragonball-es-catalog/
```

2. Pulsa **Instalar en Stremio**.
3. Acepta la instalación en Stremio.

### Método manual

1. Copia esta URL:

```txt
https://yancha10.github.io/stremio-dragonball-es-catalog/manifest.json
```

2. Abre Stremio.
3. Entra en **Add-ons**.
4. Usa la opción de instalar addon por URL.
5. Pega la URL del manifest.
6. Confirma.

## 4. Qué catálogos incluye

- Dragon Ball - Orden de visualización
- Dragon Ball - Series principales
- Dragon Ball - Series por estreno
- Dragon Ball - GT / Heroes
- Dragon Ball - Películas por estreno
- Dragon Ball - Películas en orden narrativo
- Dragon Ball - Películas canon moderno
- Dragon Ball - Especiales y OVAs

La pestaña importante es:

```txt
Dragon Ball - Orden de visualización
```

Ahí está todo mezclado y numerado para seguir un orden completo.

## 5. Cosas importantes

Este addon no reproduce contenido. No incluye streams, torrents, magnet links, scraping ni P2P. Solo organiza catálogos de Dragon Ball.

La carpeta que debe publicar GitHub Pages es:

```txt
docs/
```

No borres:

```txt
docs/.nojekyll
```

Ese archivo evita problemas con GitHub Pages.

## 6. Modificar y validar

Si cambias catálogos o manifest, puedes validar con Node.js 18 o superior:

```bash
npm run validate
npm run build
```

Si Stremio no refresca los cambios, sube la versión en `docs/manifest.json`, haz commit y reinstala el addon.

## 7. Checklist final

- [ ] GitHub Pages apunta a `main / docs`.
- [ ] La página pública abre correctamente.
- [ ] El manifest devuelve JSON.
- [ ] El catálogo `db-orden-visualizacion` devuelve JSON.
- [ ] El addon se instala en Stremio.
- [ ] Aparece la pestaña **Dragon Ball - Orden de visualización**.
