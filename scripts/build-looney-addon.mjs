import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const output = join(root, 'docs', 'looney');
const shorts = [1930, 1940, 1950, 1960, 1980, 1990, 2000]
  .flatMap((decade) => JSON.parse(readFileSync(join(root, 'looney-shorts', `${decade}.json`), 'utf8')));
const { movies, series } = JSON.parse(readFileSync(join(root, 'looney-features.json'), 'utf8'));
const unique = (rows) => [...new Map(rows.map((x) => [x.imdb, x])).values()];
const byYear = (a, b) => a.year - b.year || a.name.localeCompare(b.name);
const classics = unique(shorts.filter((x) => x.year >= 1930 && x.year <= 1969)).sort(byYear);
const revivals = unique(shorts.filter((x) => x.year > 1969 && x.name !== 'Acme Animation Factory')).sort(byYear);
const picks = [
  'Porky in Wackyland', 'The Dover Boys at Pimento University or The Rivals of Roquefort Hall',
  'The Great Piggy Bank Robbery', 'Rabbit of Seville', 'Feed the Kitty',
  'Duck Amuck', 'Bully for Bugs', 'One Froggy Evening', "What's Opera, Doc?"
].map((name) => {
  const item = classics.find((x) => x.name === name);
  if (!item) throw new Error(`Falta el clásico seleccionado: ${name}`);
  return item;
}).sort(byYear);

const catalogDefs = [
  ['movie', 'looney-clasicos', 'Looney Tunes · Cortos 1930–1969', classics],
  ...[1930, 1940, 1950, 1960].map((decade) =>
    ['movie', `looney-${decade}`, `Looney Tunes · Años ${decade}`,
      classics.filter((x) => x.year >= decade && x.year < decade + 10)]),
  ['movie', 'looney-lt', 'Looney Tunes · Serie original', classics.filter((x) => x.banner === 'Looney Tunes')],
  ['movie', 'looney-mm', 'Merrie Melodies · Serie original', classics.filter((x) => x.banner === 'Merrie Melodies')],
  ['movie', 'looney-esenciales', 'Looney Tunes · Imprescindibles', picks],
  ['movie', 'looney-revivals', 'Looney Tunes · Cortos posteriores', revivals],
  ['movie', 'looney-peliculas', 'Looney Tunes · Películas', [...movies].sort(byYear)],
  ['series', 'looney-series', 'Looney Tunes · Series', [...series].sort(byYear)]
];

function writeJson(path, value) {
  const target = join(output, path);
  mkdirSync(join(target, '..'), { recursive: true });
  writeFileSync(target, JSON.stringify(value, null, 2) + '\n');
}
function meta(item, type) {
  return {
    id: item.imdb, type, name: item.name,
    poster: `https://images.metahub.space/poster/medium/${item.imdb}/img`,
    background: `https://images.metahub.space/background/medium/${item.imdb}/img`,
    posterShape: 'poster', releaseInfo: String(item.year)
  };
}
if (classics.length < 800 || movies.length !== 9 || series.length !== 10) {
  throw new Error(`Datos incompletos: ${classics.length} cortos, ${movies.length} películas, ${series.length} series`);
}
const manifest = {
  id: 'community.looneytunes.es.catalog', version: '1.0.0',
  name: 'Looney Tunes · Clásicos y más',
  description: 'Cortos de Looney Tunes y Merrie Melodies por década, películas y series. Solo fichas; no incluye reproducción ni enlaces.',
  logo: 'https://images.metahub.space/logo/medium/tt8543208/img',
  background: 'https://images.metahub.space/background/medium/tt8543208/img',
  resources: ['catalog'], types: ['movie', 'series'],
  catalogs: catalogDefs.map(([type, id, name, rows]) => ({
    type, id, name, ...(unique(rows).length > 100 ? { extra: [{ name: 'skip', isRequired: false }] } : {})
  })),
  behaviorHints: { adult: false, p2p: false, configurable: false }
};
writeJson('manifest.json', manifest);
for (const [type, id, , rows] of catalogDefs) {
  const entries = unique(rows).map((item) => meta(item, type));
  if (!entries.length || entries.some((x) => !/^tt\d+$/.test(x.id))) throw new Error(`Catálogo inválido: ${id}`);
  writeJson(`catalog/${type}/${id}.json`, { metas: entries.slice(0, 100) });
  for (let skip = 100; skip < entries.length; skip += 100) {
    writeJson(`catalog/${type}/${id}/skip=${skip}.json`, { metas: entries.slice(skip, skip + 100) });
  }
  if (entries.length > 100 && entries.length % 100 === 0) {
    writeJson(`catalog/${type}/${id}/skip=${entries.length}.json`, { metas: [] });
  }
}
const url = 'https://yancha10.github.io/stremio-dragonball-es-catalog/looney/manifest.json';
writeFileSync(join(output, 'index.html'),
  `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Looney Tunes · Clásicos y más</title><style>body{font:18px system-ui;background:#121212;color:#fff;max-width:680px;margin:8vh auto;padding:24px}a{color:#85baff}code{overflow-wrap:anywhere}</style><h1>Looney Tunes · Clásicos y más</h1><p>Cortos por década, películas y series. Las fichas no incluyen reproducción.</p><p><a href="stremio://${url.slice(8)}">Instalar en Stremio</a></p><p>Manifest: <a href="./manifest.json"><code>${url}</code></a></p></html>\n`);
console.log(`Generado: ${classics.length} cortos clásicos, ${revivals.length} posteriores, ${movies.length} películas, ${series.length} series.`);
