import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalogs, manifest } from '../src/data/dragonball-data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const docsDir = join(root, 'docs');
const validateOnly = process.argv.includes('--validate-only');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateManifest() {
  assert(manifest.id && manifest.version && manifest.name, 'Manifest incompleto');
  assert(Array.isArray(manifest.resources) && manifest.resources.includes('catalog'), 'Falta resource catalog');
  assert(Array.isArray(manifest.catalogs) && manifest.catalogs.length > 0, 'Faltan catálogos');
}

function validateCatalogs() {
  const manifestCatalogIds = new Set(manifest.catalogs.map((catalog) => `${catalog.type}/${catalog.id}`));
  const seenIds = new Set();

  for (const [type, byId] of Object.entries(catalogs)) {
    for (const [catalogId, metas] of Object.entries(byId)) {
      assert(manifestCatalogIds.has(`${type}/${catalogId}`), `Catálogo ${type}/${catalogId} no declarado en manifest`);
      assert(Array.isArray(metas), `Catálogo ${catalogId} no es array`);
      for (const item of metas) {
        assert(item.id && /^tt\d+$/.test(item.id), `ID IMDb inválido en ${item.name}: ${item.id}`);
        const isMixedViewingOrder = type === 'series' && catalogId === 'db-orden-visualizacion';
        if (isMixedViewingOrder) {
          assert(['movie', 'series'].includes(item.type), `Tipo no mezclable en ${item.name}: ${item.type}`);
        } else {
          assert(item.type === type, `Tipo incoherente en ${item.name}: item=${item.type}, catalog=${type}`);
        }
        assert(item.name, `Nombre vacío en ${item.id}`);
        assert(item.poster && item.poster.startsWith('https://'), `Poster inválido en ${item.name}`);
        seenIds.add(item.id);
      }
    }
  }

  console.log(`Validación OK: ${seenIds.size} títulos únicos con IDs IMDb.`);
}

async function writeJson(file, data) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function build() {
  validateManifest();
  validateCatalogs();
  if (validateOnly) return;

  await writeJson(join(docsDir, 'manifest.json'), manifest);

  for (const [type, byId] of Object.entries(catalogs)) {
    for (const [catalogId, metas] of Object.entries(byId)) {
      await writeJson(join(docsDir, 'catalog', type, `${catalogId}.json`), { metas });
    }
  }

  await writeFile(join(docsDir, '.nojekyll'), '', 'utf8');

  console.log('Addon estático generado en docs/.');
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
