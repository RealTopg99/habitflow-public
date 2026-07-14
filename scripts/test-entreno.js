const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const feature = read('WorkoutFeature.jsx');
const app = read('HabitTrackerApp.jsx');
const service = read('exercise-dataset-service.js');
const catalogPath = path.join(root, 'public', 'exercises-dataset', 'data', 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const translations = JSON.parse(fs.readFileSync(path.join(root, 'public', 'exercises-dataset', 'data', 'translations.es.json'), 'utf8'));
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
assert(Object.keys(translations.translations || {}).length === 1324, 'Faltan nombres de ejercicios en español');
assert(service.includes('name_en: item.name') && service.includes('name: spanishName'), 'El servicio no aplica los nombres en español');
assert(feature.includes('const MUSCLE_ES') && feature.includes('const displayMuscle'), 'Falta traducir la taxonomía muscular');
assert(catalog.every(item => item.id && item.name && item.image && item.gif_url && item.attribution.includes('Gym visual')), 'Hay registros sin datos o atribución');
assert(service.includes('let catalogPromise = null') && service.includes('const details = new Map()'), 'El servicio no cachea catálogo y detalle');
assert(service.includes('resolveExerciseMedia'), 'Falta la utilidad central de medios');
assert(feature.includes("const [playingId, setPlayingId] = useState('')"), 'La biblioteca no limita la reproducción a un solo GIF');
assert(feature.includes('loading="lazy"') && feature.includes('decoding="async"'), 'Los medios no usan carga diferida');
assert(feature.includes('width:clamp(320px,62%,430px)') && feature.includes('aspect-ratio:1/1'), 'El medio del detalle sigue siendo pequeño en escritorio');
assert(feature.includes('<span className="wr-attribution">© Gym visual</span>') && !feature.includes('href="https://gymvisual.com/"'), 'La atribución debe conservarse sin enlace visible');
assert(feature.includes('setInterval(() => setTick(Date.now()), 1000)') && feature.includes('clearInterval(id)'), 'El temporizador no limpia su intervalo');
assert(feature.includes("activeSession: session") && feature.includes("activeSession: null"), 'La sesión activa no se persiste o limpia');
assert(feature.includes('updatedAt: nowIso()'), 'Los cambios de Entreno no incluyen updatedAt');
assert(!feature.includes('Base de ejercicios integrada'), 'La tarjeta intermedia de la base de ejercicios sigue visible');
assert(feature.includes("!['detail', 'builder'].includes(screen)"), 'El constructor sigue mostrando el encabezado global con Nuevo');
assert(feature.includes('Indicaciones, técnica, tempo o ajustes…'), 'Falta el campo amplio de notas del constructor');
for (const label of ['Series', 'Repeticiones', 'Carga (kg)', 'Descanso (s)', 'Notas']) {
  assert(feature.includes(`>${label}<`), `Falta la etiqueta visible ${label}`);
}
assert(feature.includes('Selecciona al menos un día.') && feature.includes('disabled={!formValid || saving}'), 'La programación semanal no bloquea guardados inválidos');
assert(feature.includes('Añadir seleccionados') && feature.includes('pendingIds') && feature.includes('Filtrar por grupo muscular'), 'El selector no admite selección múltiple y filtros');
assert(feature.includes('Este ejercicio ya está incluido en la rutina.'), 'Falta el aviso de ejercicios duplicados');
assert(feature.includes('wr-row-action') && feature.includes('pendingRemoveId'), 'Faltan acciones accesibles o confirmación de borrado');
assert(feature.includes('wr-set-head') && feature.includes('>Repeticiones<') && feature.includes('>Peso (kg)<') && feature.includes('>Estado<'), 'La sesión activa no muestra los encabezados de las series');
for (const screen of ['summary', 'routines', 'library', 'detail', 'builder', 'active', 'progress', 'history']) {
  assert(feature.includes(`'${screen}'`), `Falta la vista ${screen}`);
}
assert(app.includes("channel(`habitflow-workout-${userId}`)"), 'Falta la suscripción Realtime de Entreno');
assert(app.includes('onSync={syncWorkoutNow}'), 'Falta la sincronización manual de Entreno');
assert(!feature.includes('01_dashboard_entreno.png') && !feature.includes('02_biblioteca_ejercicios.png'), 'Las referencias visuales no deben incrustarse');

console.log('Entreno redesign tests ok');
