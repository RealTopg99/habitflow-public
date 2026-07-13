const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

parser.parse(read('HabitTrackerApp.jsx'), { sourceType: 'script', plugins: ['jsx'] });
parser.parse(read('widget-sync-core.js'), { sourceType: 'script' });
parser.parse(read('sw.js'), { sourceType: 'script' });
parser.parse(read('netlify/functions/habitflow-push-cron.mjs'), { sourceType: 'module' });
parser.parse(read('supabase/functions/habitflow-push-cron/index.ts'), { sourceType: 'module', plugins: ['typescript'] });
parser.parse(read('supabase/functions/habitflow-creator-notifications/index.ts'), { sourceType: 'module', plugins: ['typescript'] });

const index = read('index.html');
if (!index.includes('./widget-sync-core.js')) throw new Error('index.html no carga widget-sync-core.js');
if (!index.includes('./HabitTrackerApp.jsx')) throw new Error('index.html no carga HabitTrackerApp.jsx');

const manifest = JSON.parse(read('manifest.webmanifest'));
if (!manifest.name || !manifest.start_url || !Array.isArray(manifest.icons)) throw new Error('Manifest PWA incompleto');

console.log('Static build check ok');
