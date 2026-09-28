import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const docs = join(root, 'docs');
const read = (name) => JSON.parse(readFileSync(join(root, name), 'utf8'));
const load = (name) => read(`${name}-resolved.json`).filter((x) => x.imdb);
const pixar = load('pixar');
const disney = load('disney');
const officialShorts = load('shorts');
const shorts = officialShorts.filter((x) => x.type !== 'series');
const series = [...load('series'), ...officialShorts.filter((x) => x.type === 'series')];
const pictures = read('walt-disney-pictures.json').filter((x) => x.year >= 1937 && !/^Q\d+$/.test(x.name));
const all = [...pixar, ...disney, ...shorts, ...series];
const unique = (rows) => [...new Map(rows.map((x) => [x.imdb, x])).values()];
const ascending = (a, b) => a.year - b.year || a.name.localeCompare(b.name);
const descending = (a, b) => b.year - a.year || a.name.localeCompare(b.name);
const meta = (x, type = 'movie') => ({
  id: x.imdb, type, name: x.name,
  poster: `https://images.metahub.space/poster/medium/${x.imdb}/img`,
  background: `https://images.metahub.space/background/medium/${x.imdb}/img`,
  posterShape: 'poster', releaseInfo: String(x.year)
});

function writeJson(path, object) {
  mkdirSync(join(docs, path, '..'), { recursive: true });
  writeFileSync(join(docs, path), JSON.stringify(object, null, 2) + '\n');
}
function makeAddon(folder, title, logo, catalogs) {
  const manifest = {
    id: `community.${folder}.es.catalog`, version: '1.0.0',
    name: title, description: 'Catálogos de películas y series por estreno y franquicia. Solo organiza fichas; no incluye reproducción ni enlaces.',
    logo: `https://images.metahub.space/logo/medium/${logo}/img`,
    background: `https://images.metahub.space/background/medium/${logo}/img`,
    resources: ['catalog'], types: ['movie', 'series'],
    catalogs: catalogs.map(({ id, name, type, rows }) => ({
      id, name, type,
      ...(unique(rows).length > 100 ? { extra: [{ name: 'skip', isRequired: false }] } : {})
    })),
    behaviorHints: { adult: false, p2p: false, configurable: false }
  };
  writeJson(`${folder}/manifest.json`, manifest);
  for (const { id, type, rows } of catalogs) {
    if (!rows.length) throw new Error(`Catálogo vacío: ${folder}/${id}`);
    const metas = unique(rows).map((x) => meta(x, type));
    for (const x of metas) if (!/^tt\d+$/.test(x.id) || x.type !== type) throw new Error(`Ficha inválida: ${id}`);
    writeJson(`${folder}/catalog/${type}/${id}.json`, { metas: metas.slice(0, 100) });
    for (let skip = 100; skip < metas.length; skip += 100) {
      writeJson(`${folder}/catalog/${type}/${id}/skip=${skip}.json`, { metas: metas.slice(skip, skip + 100) });
    }
    if (metas.length > 100 && metas.length % 100 === 0) {
      writeJson(`${folder}/catalog/${type}/${id}/skip=${metas.length}.json`, { metas: [] });
    }
  }
  const url = `https://yancha10.github.io/stremio-dragonball-es-catalog/${folder}/manifest.json`;
  mkdirSync(join(docs, folder), { recursive: true });
  writeFileSync(join(docs, folder, 'index.html'),
    `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><style>body{font:18px system-ui;background:#121212;color:#fff;max-width:680px;margin:8vh auto;padding:24px}a{color:#85baff}button{font:inherit;padding:14px 22px;cursor:pointer}code{overflow-wrap:anywhere}</style><h1>${title}</h1><p>Catálogos ordenados por fecha de estreno y franquicia. Solo fichas: la disponibilidad depende de tus otros addons.</p><p><a href="stremio://${url.slice(8)}">Instalar en Stremio</a></p><p>Manifest: <a href="./manifest.json"><code>${url}</code></a></p></html>\n`);
}

const saga = (rows, names) => rows.filter((x) => names.some((n) => n === x.name)).sort(ascending);
const pixarCatalogs = [
  { type: 'movie', id: 'pixar-estrenos', name: 'Pixar · Todos los largometrajes (estreno)', rows: [...pixar].sort(ascending) },
  { type: 'movie', id: 'pixar-recientes', name: 'Pixar · Más recientes', rows: [...pixar].sort(descending) },
  { type: 'movie', id: 'pixar-toy-story', name: 'Pixar · Toy Story', rows: saga([...pixar, ...shorts], ['Toy Story','Toy Story 2','Toy Story 3','Toy Story 4','Toy Story 5','Toy Story That Time Forgot','Toy Story of TERROR!','Hawaiian Vacation','Small Fry','Partysaurus Rex']) },
  { type: 'movie', id: 'pixar-cars', name: 'Pixar · Cars', rows: saga([...pixar, ...shorts], ['Cars','Cars 2','Cars 3','Mater and the Ghostlight']) },
  { type: 'movie', id: 'pixar-emociones', name: 'Pixar · Del revés', rows: saga(pixar, ['Inside Out','Inside Out 2']) },
  { type: 'movie', id: 'pixar-monstruos', name: 'Pixar · Monstruos', rows: saga(pixar, ["Monster's Inc.","Monster's University"]) },
  { type: 'movie', id: 'pixar-buscando', name: 'Pixar · Nemo y Dory', rows: saga(pixar, ['Finding Nemo','Finding Dory']) },
  { type: 'movie', id: 'pixar-increibles', name: 'Pixar · Los Increíbles', rows: saga(pixar, ['The Incredibles','Incredibles 2']) },
  { type: 'movie', id: 'pixar-cortos', name: 'Pixar · Cortometrajes', rows: [...shorts].sort(ascending) },
  { type: 'series', id: 'pixar-series', name: 'Pixar · Series', rows: [...series].sort(ascending) }
];
const disneyFilms = unique([...disney, ...pixar, ...pictures]);
const disneyCatalogs = [
  { type: 'movie', id: 'disney-todos', name: 'Disney · Todos por estreno', rows: [...disneyFilms].sort(ascending) },
  { type: 'movie', id: 'disney-animacion-pixar', name: 'Disney · Animación + Pixar', rows: unique([...disney, ...pixar]).sort(ascending) },
  { type: 'movie', id: 'disney-animacion', name: 'Disney · Walt Disney Animation', rows: [...disney].sort(ascending) },
  { type: 'movie', id: 'disney-pixar', name: 'Disney · Pixar', rows: [...pixar].sort(ascending) },
  { type: 'movie', id: 'disney-pictures-clasicos', name: 'Disney · Archivo Pictures 1937–1989', rows: pictures.filter((x) => x.year < 1990).sort(ascending) },
  { type: 'movie', id: 'disney-pictures-1990', name: 'Disney · Archivo Pictures 1990–2009', rows: pictures.filter((x) => x.year >= 1990 && x.year < 2010).sort(ascending) },
  { type: 'movie', id: 'disney-pictures-2010', name: 'Disney · Archivo Pictures 2010–hoy', rows: pictures.filter((x) => x.year >= 2010).sort(ascending) },
  { type: 'movie', id: 'disney-clasicos', name: 'Disney · Clásicos 1937–1989', rows: disney.filter((x) => x.year < 1990).sort(ascending) },
  { type: 'movie', id: 'disney-renacimiento', name: 'Disney · Renacimiento y 2000', rows: disney.filter((x) => x.year >= 1990 && x.year < 2010).sort(ascending) },
  { type: 'movie', id: 'disney-modernos', name: 'Disney · 2010 en adelante', rows: disney.filter((x) => x.year >= 2010).sort(ascending) },
  { type: 'movie', id: 'disney-frozen', name: 'Disney · Frozen', rows: saga(disney, ['Frozen','Frozen 2']) },
  { type: 'movie', id: 'disney-moana', name: 'Disney · Vaiana / Moana', rows: saga(disney, ['Moana','Moana 2']) },
  { type: 'movie', id: 'disney-zootopia', name: 'Disney · Zootrópolis', rows: saga(disney, ['Zootopia','Zootopia 2']) },
  { type: 'movie', id: 'disney-winnie', name: 'Disney · Winnie the Pooh', rows: saga(disney, ['The Many Adventures of Winnie the Pooh','Winnie the Pooh']) },
  { type: 'movie', id: 'disney-ralph', name: 'Disney · Rompe Ralph', rows: saga(disney, ['Wreck-It Ralph','Ralph Breaks the Internet']) },
  { type: 'movie', id: 'disney-rescatadores', name: 'Disney · Los rescatadores', rows: saga(disney, ['The Rescuers','The Rescuers Down Under']) }
];

if (pixar.length !== 31 || disney.length !== 64) throw new Error(`Faltan largometrajes oficiales: Pixar ${pixar.length}/31; Disney ${disney.length}/64`);
if (new Set(all.filter(x=>x.imdb).map(x=>x.imdb)).size !== all.filter(x=>x.imdb).length) {
  // Some official shorts and features may share IMDb IDs; reject before silently mixing types.
  const duplicates = all.filter((x,i) => x.imdb && all.findIndex(y => y.imdb === x.imdb) !== i);
  throw new Error('IDs duplicados: ' + duplicates.map(x=>x.name).join(', '));
}
makeAddon('pixar', 'Pixar · Filmografía', 'tt0114709', pixarCatalogs);
makeAddon('disney', 'Disney · Animación y Pixar', 'tt0029583', disneyCatalogs);
console.log(`Generados: Pixar ${pixar.length} películas, ${shorts.length} cortos, ${series.length} series; Disney Animation ${disney.length} películas; Pictures ${pictures.length} registros.`);
