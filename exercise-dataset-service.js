(function createExerciseDatasetService(global) {
  const BASE = './public/exercises-dataset';
  let catalogPromise = null;
  let metaPromise = null;
  const details = new Map();

  const fetchJson = async (path, signal) => {
    const response = await fetch(path, { signal, cache: 'force-cache' });
    if (!response.ok) throw new Error(`No se pudo cargar el catálogo de ejercicios (HTTP ${response.status}).`);
    return response.json();
  };

  const loadCatalog = () => {
    if (!catalogPromise) {
      catalogPromise = fetchJson(`${BASE}/data/catalog.json`).catch(error => {
        catalogPromise = null;
        throw error;
      });
    }
    return catalogPromise;
  };

  const loadMeta = () => {
    if (!metaPromise) {
      metaPromise = fetchJson(`${BASE}/data/meta.json`).catch(error => {
        metaPromise = null;
        throw error;
      });
    }
    return metaPromise;
  };

  const loadExercise = async (id, signal) => {
    const key = String(id || '');
    if (!key) throw new Error('El ejercicio solicitado no tiene identificador.');
    if (details.has(key)) return details.get(key);
    const item = await fetchJson(`${BASE}/data/details/${encodeURIComponent(key)}.json`, signal);
    details.set(key, item);
    return item;
  };

  const resolveExerciseMedia = (path) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${BASE}/${String(path).replace(/^\.?\/+/, '')}`;
  };

  const normalizeSearch = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  const searchableText = (item) => normalizeSearch([
    item?.name,
    item?.category,
    item?.body_part,
    item?.equipment,
    item?.target,
    item?.muscle_group,
    ...(item?.secondary_muscles || [])
  ].filter(Boolean).join(' '));

  global.HabitFlowExerciseDataset = Object.freeze({
    baseUrl: BASE,
    loadCatalog,
    loadMeta,
    loadExercise,
    resolveExerciseMedia,
    normalizeSearch,
    searchableText
  });
})(window);
