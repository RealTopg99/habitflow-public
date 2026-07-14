const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const worker = read('sw.js');
const index = read('index.html');

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

for (const asset of ['HabitTrackerApp.jsx', 'WorkoutFeature.jsx', 'widget-sync-core.js', 'exercise-dataset-service.js']) {
  assert(worker.includes(`url.pathname.endsWith('/${asset}')`), `${asset} no está marcado para actualización inmediata`);
}
assert(worker.includes("fetch(request, { cache: 'no-store' })"), 'Los archivos principales no usan red primero');
assert(worker.includes('new Request(`${url.origin}${url.pathname}`)'), 'La caché no usa claves canónicas sin parámetros duplicados');
assert(!worker.includes('ignoreSearch: isLocalAsset'), 'El worker todavía puede devolver la primera versión antigua ignorando parámetros');
assert(worker.includes("key.startsWith('habitflow-pwa-') && key !== CACHE_VERSION"), 'No se eliminan las versiones anteriores de la caché');
assert(index.includes("updateViaCache: 'none'"), 'El navegador puede reutilizar una copia antigua del service worker');
assert(index.includes("navigator.serviceWorker.addEventListener('controllerchange'"), 'La interfaz no se recarga al activar una versión nueva');
assert(index.includes('registration.update()'), 'No se comprueban actualizaciones al abrir la aplicación');

console.log('PWA automatic update tests ok');
