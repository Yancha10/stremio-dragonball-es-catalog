# Pixar y Disney para Stremio

Dos addons independientes publicados bajo el GitHub Pages del addon de Dragon Ball. No modifican el manifest ni los catálogos de Dragon Ball.

## Instalación

- Pixar: https://yancha10.github.io/stremio-dragonball-es-catalog/pixar/manifest.json
- Disney: https://yancha10.github.io/stremio-dragonball-es-catalog/disney/manifest.json

Se puede abrir la página `/pixar/` o `/disney/` para usar el enlace de instalación. Los addons solo sirven catálogos de fichas; no incluyen streams.

## Alcance

Pixar: los 31 largometrajes que figuran en la [lista oficial de Pixar](https://www.pixar.com/feature-films), ordenados por estreno ascendente y descendente; sagas Toy Story, Cars, Del revés, Monstruos, Nemo/Dory e Increíbles. Los 42 títulos de la [lista oficial de cortos](https://www.pixar.com/short-films/) y las seis entradas únicas de la [lista de series](https://www.pixar.com/series) están identificados con IMDb. «Cars Toons» figura en el catálogo de series porque IMDb lo clasifica como serie: el resultado son 41 cortos y siete series. Las películas estrenadas hasta septiembre de 2026 se incluyen, sin predicciones de estrenos futuros.

Disney: los 64 largometrajes de la [lista oficial de Walt Disney Animation Studios](https://www.disneyanimation.com/films/) hasta 2025, Pixar y registros de películas atribuidas a Walt Disney Pictures con ID IMDb en Wikidata. El último bloque se presenta como «Archivo Pictures» porque la atribución de productora en Wikidata no es una filmografía oficial completa: puede omitir títulos y contener coproducciones u obras cortas. Por ejemplo, los sellos Marvel, Lucasfilm, 20th Century y Searchlight no se incorporan sistemáticamente al catálogo de Pictures solo por pertenecer a The Walt Disney Company. La recopilación amplia «Todos por estreno» reúne las tres fuentes, elimina IDs duplicados y pagina en grupos de 100.

«Por estreno» significa año de estreno, no cronología interna de las historias. En el caso de películas con varias fechas territoriales, se respeta el año de la fuente oficial del estudio en sus listas. Las sagas también siguen el año de estreno.

## Fuentes y regeneración

Las listas oficiales de películas están en `source-films.json`; la de cortos y series de Pixar en `source-extras.json`. Los archivos `*-resolved.json` contienen los ID IMDb cruzados con Cinemeta, Wikidata e IMDb según el título. `walt-disney-pictures.json` procede de una consulta a Wikidata de películas con `P272 = Q191224`, `P345` (IMDb) y fecha de estreno. Son una instantánea; no se actualizan automáticamente.

```sh
node scripts/build-studio-addons.mjs
```

El generador exige que se mantengan las 31 películas de Pixar y las 64 de Disney Animation de las fuentes oficiales y valida los IDs. Si se modifica el contenido, vuelve a generar y revisar los JSON de `docs/pixar/` y `docs/disney/`.

## Límite del alojamiento estático

La paginación se precalcula como `skip=100`, `skip=200` y sucesivos. Los addons no ofrecen búsqueda dinámica ni filtros arbitrarios; cada saga o bloque aparece como un catálogo independiente. Stremio controla la presentación de los catálogos y otros addons son responsables de ofrecer streams.
