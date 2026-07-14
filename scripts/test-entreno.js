const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const feature = read('WorkoutFeature.jsx');
const app = read('HabitTrackerApp.jsx');
const service = read('exercise-dataset-service.js');
const catalogPath = path.join(root, 'public', 'exercises-dataset', 'data', 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const detailDir = path.join(root, 'public', 'exercises-dataset', 'data', 'details');
const imageDir = path.join(root, 'public', 'exercises-dataset', 'images');
const videoDir = path.join(root, 'public', 'exercises-dataset', 'videos');

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

assert(catalog.length === 1324, `El catálogo debe contener 1324 ejercicios y contiene ${catalog.length}`);
assert(fs.readdirSync(detailDir).filter(file => file.endsWith('.json')).length === 1324, 'Faltan detalles individuales del dataset');
assert(fs.readdirSync(imageDir).filter(file => file.endsWith('.jpg')).length === 1324, 'Faltan miniaturas del dataset');
assert(fs.readdirSync(videoDir).filter(file => file.endsWith('.gif')).length === 1324, 'Faltan GIF del dataset');
assert(catalog.every(item => item.id && item.name && item.image && item.gif_url && item.attribution.includes('Gym visual')), 'Hay registros sin datos o atribución');
assert(service.includes('let catalogPromise = null') && service.includes('const details = new Map()'), 'El servicio no cachea catálogo y detalle');
assert(service.includes('resolveExerciseMedia'), 'Falta la utilidad central de medios');
assert(feature.includes("const [playingId, setPlayingId] = useState('')"), 'La biblioteca no limita la reproducción a un solo GIF');
assert(feature.includes('loading="lazy"') && feature.includes('decoding="async"'), 'Los medios no usan carga diferida');
assert(feature.includes('setInterval(() => setTick(Date.now()), 1000)') && feature.includes('clearInterval(id)'), 'El temporizador no limpia su intervalo');
assert(feature.includes("activeSession: session") && feature.includes("activeSession: null"), 'La sesión activa no se persiste o limpia');
assert(feature.includes('updatedAt: nowIso()'), 'Los cambios de Entreno no incluyen updatedAt');
for (const screen of ['summary', 'routines', 'library', 'detail', 'builder', 'active', 'progress', 'history']) {
  assert(feature.includes(`'${screen}'`), `Falta la vista ${screen}`);
}
assert(app.includes("channel(`habitflow-workout-${userId}`)"), 'Falta la suscripción Realtime de Entreno');
assert(app.includes('onSync={syncWorkoutNow}'), 'Falta la sincronización manual de Entreno');
assert(!feature.includes('01_dashboard_entreno.png') && !feature.includes('02_biblioteca_ejercicios.png'), 'Las referencias visuales no deben incrustarse');

console.log('Entreno redesign tests ok');
