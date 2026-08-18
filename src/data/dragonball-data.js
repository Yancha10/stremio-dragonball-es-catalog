import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', '..');

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

export const manifest = readJson('docs/manifest.json');

function catalog(type, id) {
  return readJson(`docs/catalog/${type}/${id}.json`).metas;
}

export const catalogs = {
  series: {
    'db-orden-visualizacion': catalog('series', 'db-orden-visualizacion'),
    'db-series-cronologia': catalog('series', 'db-series-cronologia'),
    'db-series-estreno': catalog('series', 'db-series-estreno'),
    'db-series-alternativo': catalog('series', 'db-series-alternativo')
  },
  movie: {
    'db-peliculas-estreno': catalog('movie', 'db-peliculas-estreno'),
    'db-peliculas-cronologia-aproximada': catalog('movie', 'db-peliculas-cronologia-aproximada'),
    'db-peliculas-canon-moderno': catalog('movie', 'db-peliculas-canon-moderno'),
    'db-especiales-ovas': catalog('movie', 'db-especiales-ovas')
  }
};
