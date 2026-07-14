import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(SCRIPT_DIR, '..');
const SOURCE_DIR = resolve(PROJECT_ROOT, 'tmp', 'exercises-dataset-source');
const OUTPUT_DIR = resolve(PROJECT_ROOT, 'public', 'exercises-dataset');
const REPOSITORY = 'https://github.com/hasaneyldrm/exercises-dataset.git';

const runGit = (args, cwd = PROJECT_ROOT) => execFileSync('git', args, {
  cwd,
  stdio: 'inherit',
  windowsHide: true
});

const syncSource = () => {
  mkdirSync(dirname(SOURCE_DIR), { recursive: true });
  if (existsSync(join(SOURCE_DIR, '.git'))) {
    runGit(['fetch', '--depth', '1', 'origin', 'main'], SOURCE_DIR);
    runGit(['reset', '--hard', 'origin/main'], SOURCE_DIR);
  } else {
    rmSync(SOURCE_DIR, { recursive: true, force: true });
    runGit(['clone', '--depth', '1', REPOSITORY, SOURCE_DIR]);
  }
};

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value)}\n`, 'utf8');

const buildOutput = () => {
  const translationsPath = join(OUTPUT_DIR, 'data', 'translations.es.json');
  const existingTranslations = existsSync(translationsPath) ? readFileSync(translationsPath, 'utf8') : null;
  const records = readJson(join(SOURCE_DIR, 'data', 'exercises.json'));
  if (!Array.isArray(records) || records.length < 1000) {
    throw new Error(`Catálogo inválido: se esperaban al menos 1.000 ejercicios y llegaron ${records?.length || 0}.`);
  }

  const invalid = records.filter(item => !item?.id || !item?.name || !item?.image || !item?.gif_url || !item?.attribution);
  if (invalid.length) throw new Error(`El dataset contiene ${invalid.length} registros sin campos obligatorios.`);

  rmSync(OUTPUT_DIR, { recursive: true, force: true });
  mkdirSync(join(OUTPUT_DIR, 'data', 'details'), { recursive: true });

  const catalog = records.map(item => ({
    id: String(item.id),
    name: item.name,
    category: item.category,
    body_part: item.body_part,
    equipment: item.equipment,
    muscle_group: item.muscle_group,
    secondary_muscles: item.secondary_muscles || [],
    target: item.target,
    image: item.image,
    gif_url: item.gif_url,
    attribution: item.attribution,
    source: 'hasaneyldrm/exercises-dataset'
  }));

  for (const item of records) {
    writeJson(join(OUTPUT_DIR, 'data', 'details', `${item.id}.json`), {
      ...item,
      source: 'hasaneyldrm/exercises-dataset'
    });
  }

  const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: SOURCE_DIR,
    encoding: 'utf8',
    windowsHide: true
  }).trim();
  const meta = {
    count: catalog.length,
    categories: [...new Set(catalog.map(item => item.category).filter(Boolean))].sort(),
    bodyParts: [...new Set(catalog.map(item => item.body_part).filter(Boolean))].sort(),
    equipment: [...new Set(catalog.map(item => item.equipment).filter(Boolean))].sort(),
    targets: [...new Set(catalog.map(item => item.target).filter(Boolean))].sort(),
    source: REPOSITORY,
    sourceCommit,
    mediaAttribution: '© Gym visual — https://gymvisual.com/'
  };

  writeJson(join(OUTPUT_DIR, 'data', 'catalog.json'), catalog);
  writeJson(join(OUTPUT_DIR, 'data', 'meta.json'), meta);
  if (existingTranslations) writeFileSync(translationsPath, existingTranslations, 'utf8');
  cpSync(join(SOURCE_DIR, 'data', 'exercises.json'), join(OUTPUT_DIR, 'data', 'exercises.json'));
  cpSync(join(SOURCE_DIR, 'data', 'exercises.schema.json'), join(OUTPUT_DIR, 'data', 'exercises.schema.json'));
  cpSync(join(SOURCE_DIR, 'images'), join(OUTPUT_DIR, 'images'), { recursive: true, force: true });
  cpSync(join(SOURCE_DIR, 'videos'), join(OUTPUT_DIR, 'videos'), { recursive: true, force: true });
  cpSync(join(SOURCE_DIR, 'NOTICE.md'), join(OUTPUT_DIR, 'NOTICE.md'));
  cpSync(join(SOURCE_DIR, 'LICENSE'), join(OUTPUT_DIR, 'LICENSE'));

  console.log(`Dataset sincronizado: ${catalog.length} ejercicios, ${meta.categories.length} categorías y ${meta.equipment.length} equipos.`);
  console.log(`Origen: ${sourceCommit}`);
  console.log(`Destino: ${OUTPUT_DIR}`);
};

try {
  syncSource();
  buildOutput();
} catch (error) {
  console.error(`No se pudo sincronizar exercises-dataset: ${error?.message || error}`);
  process.exitCode = 1;
}
