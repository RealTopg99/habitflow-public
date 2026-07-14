import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = path.join(root, 'public', 'exercises-dataset', 'data', 'catalog.json');
const outputPath = path.join(root, 'public', 'exercises-dataset', 'data', 'translations.es.json');
const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'));

let translations = {};
try {
  const previous = JSON.parse(await fs.readFile(outputPath, 'utf8'));
  translations = previous.translations || {};
} catch {}

const pending = catalog.filter(item => !translations[item.id]);
let cursor = 0;
let completed = 0;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const translate = async (text, attempt = 0) => {
  const params = new URLSearchParams({ client: 'gtx', sl: 'en', tl: 'es', dt: 't', q: text });
  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params}`, {
      headers: { 'User-Agent': 'HabitFlow exercise catalog localization/1.0' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const translated = (payload?.[0] || []).map(part => part?.[0] || '').join('').trim();
    if (!translated) throw new Error('respuesta vacía');
    return translated;
  } catch (error) {
    if (attempt >= 4) throw error;
    await sleep(500 * (2 ** attempt));
    return translate(text, attempt + 1);
  }
};

const save = async () => {
  const ordered = Object.fromEntries(catalog
    .filter(item => translations[item.id])
    .map(item => [item.id, translations[item.id]]));
  await fs.writeFile(outputPath, `${JSON.stringify({
    sourceLanguage: 'en',
    targetLanguage: 'es',
    source: 'hasaneyldrm/exercises-dataset',
    generatedAt: new Date().toISOString(),
    translations: ordered
  })}\n`, 'utf8');
};

const worker = async () => {
  while (cursor < pending.length) {
    const item = pending[cursor++];
    translations[item.id] = await translate(item.name);
    completed += 1;
    if (completed % 25 === 0) {
      await save();
      console.log(`Traducidos ${Object.keys(translations).length}/${catalog.length}`);
    }
    await sleep(80);
  }
};

await Promise.all(Array.from({ length: 6 }, worker));
await save();

if (Object.keys(translations).length !== catalog.length) {
  throw new Error(`Traducción incompleta: ${Object.keys(translations).length}/${catalog.length}`);
}

console.log(`Traducciones guardadas: ${catalog.length}`);
