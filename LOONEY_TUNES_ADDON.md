# Looney Tunes para Stremio

Addon independiente alojado junto a Pixar, Disney y Dragon Ball:

https://yancha10.github.io/stremio-dragonball-es-catalog/looney/manifest.json

Incluye 890 cortos clásicos (1930–1969) identificados con IMDb, tres cortos posteriores, nueve películas y diez series relacionadas. Hay catálogos por década, por los dos sellos originales (Looney Tunes y Merrie Melodies), películas, series y una selección de clásicos. «Por década» usa el año de estreno; no pretende definir un orden narrativo.

La selección de cortos procede de una consulta a Wikidata que exige `P179` (serie Looney Tunes `Q622435` o Merrie Melodies `Q1750628`), `P345` (ID IMDb) y `P577` (estreno). Los títulos, años, IMDb y sello quedaron guardados por década en `looney-shorts/`. Se excluye una entrada identificada como videojuego y se elimina la duplicación de un corto etiquetado con ambos sellos. El archivo `looney-features.json` contiene las películas y series verificadas por título y año contra IMDb/Wikidata. No hay actualización automática.

**Alcance:** no es una recopilación íntegra de todos los cortos jamás producidos. Faltan los que no cumplen los criterios de identificación anteriores; la cifra de 890 expresa exactamente los que sirven estos catálogos. IMDb/Cinemeta tampoco garantiza carátulas o fichas detalladas para todos los cortos antiguos. El addon solo ofrece catálogos y no incluye fuentes de reproducción.

Para regenerar los JSON estáticos:

```sh
node scripts/build-looney-addon.mjs
```

Los catálogos largos se paginan en bloques de 100 mediante el parámetro estándar `skip` de Stremio. Las respuestas se publican en `docs/looney/` con GitHub Pages.
