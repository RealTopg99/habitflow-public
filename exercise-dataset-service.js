(function createExerciseDatasetService(global) {
  const BASE = './public/exercises-dataset';
  let catalogPromise = null;
  let metaPromise = null;
  let translationsPromise = null;
  const details = new Map();

  const fetchJson = async (path, signal) => {
    const response = await fetch(path, { signal, cache: 'force-cache' });
    if (!response.ok) throw new Error(`No se pudo cargar el catálogo de ejercicios (HTTP ${response.status}).`);
    return response.json();
  };

  const loadTranslations = () => {
    if (!translationsPromise) {
      translationsPromise = fetchJson(`${BASE}/data/translations.es.json`)
        .then(payload => payload?.translations || {})
        .catch(() => ({}));
    }
    return translationsPromise;
  };

  const localizeExercise = (item, translations) => {
    if (!item) return item;
    const spanishName = translations?.[String(item.id)];
    return spanishName ? { ...item, name_en: item.name, name: spanishName } : item;
  };

  const loadCatalog = () => {
    if (!catalogPromise) {
      catalogPromise = Promise.all([
        fetchJson(`${BASE}/data/catalog.json`),
        loadTranslations()
      ]).then(([items, translations]) => items.map(item => localizeExercise(item, translations))).catch(error => {
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
    const [rawItem, translations] = await Promise.all([
      fetchJson(`${BASE}/data/details/${encodeURIComponent(key)}.json`, signal),
      loadTranslations()
    ]);
    const item = localizeExercise(rawItem, translations);
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
    item?.name_en,
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
