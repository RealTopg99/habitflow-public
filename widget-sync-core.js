(function initHabitFlowWidgetSync(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.HabitFlowWidgetSync = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createHabitFlowWidgetSync() {
  const WIDGET_KEYS = ['hydration', 'brushing'];
  const QUEUE_VERSION = 2;

  const createId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return `hf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  };

  const parseTimestamp = (value) => {
    const timestamp = Date.parse(value || '');
    return Number.isFinite(timestamp) ? timestamp : 0;
  };

  const mergeByUpdatedAt = (current, incoming) => {
    if (!incoming) return current;
    if (!current) return incoming;
    const currentTime = parseTimestamp(current.updatedAt);
    const incomingTime = parseTimestamp(incoming.updatedAt);
    if (incomingTime > currentTime) return incoming;
    if (incomingTime < currentTime) return current;
    return String(incoming.mutationId || '').localeCompare(String(current.mutationId || '')) >= 0 ? incoming : current;
  };

  const dedupeMutations = (mutations) => {
    const byId = new Map();
    (Array.isArray(mutations) ? mutations : []).forEach(mutation => {
      if (!mutation?.mutationId || !WIDGET_KEYS.includes(mutation.widgetKey)) return;
      const existing = byId.get(mutation.mutationId);
      if (!existing || parseTimestamp(mutation.updatedAt) >= parseTimestamp(existing.updatedAt)) {
        byId.set(mutation.mutationId, mutation);
      }
    });
    return [...byId.values()].sort((a, b) => parseTimestamp(a.updatedAt) - parseTimestamp(b.updatedAt));
  };

  const getPlatform = (navigatorLike = {}) => {
    const uaDataPlatform = navigatorLike.userAgentData?.platform;
    const platform = uaDataPlatform || navigatorLike.platform || 'Unknown';
    const userAgent = String(navigatorLike.userAgent || '');
    if (/android/i.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
    if (/windows/i.test(userAgent)) return 'Windows';
    if (/mac/i.test(platform) || /macintosh/i.test(userAgent)) return 'macOS';
    if (/linux/i.test(platform) || /linux/i.test(userAgent)) return 'Linux';
    return String(platform || 'Unknown');
  };

  const getDeviceName = (navigatorLike = {}) => {
    const platform = getPlatform(navigatorLike);
    const userAgent = String(navigatorLike.userAgent || '');
    let browser = 'Navegador';
    if (/edg\//i.test(userAgent)) browser = 'Edge';
    else if (/firefox\//i.test(userAgent)) browser = 'Firefox';
    else if (/chrome\//i.test(userAgent)) browser = 'Chrome';
    else if (/safari\//i.test(userAgent)) browser = 'Safari';
    return `${browser} en ${platform}`;
  };

  const isTransientError = (error) => {
    const text = `${error?.message || ''} ${error?.details || ''}`.toLowerCase();
    return !error || /network|fetch|offline|timeout|failed to fetch|load failed|connection/.test(text);
  };

  const createStorage = (storage) => ({
    get(key, fallback = null) {
      try {
        const raw = storage?.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try { storage?.setItem(key, JSON.stringify(value)); } catch {}
    },
    remove(key) {
      try { storage?.removeItem(key); } catch {}
    },
    getText(key, fallback = '') {
      try { return storage?.getItem(key) || fallback; } catch { return fallback; }
    },
    setText(key, value) {
      try { storage?.setItem(key, String(value)); } catch {}
    }
  });

  const createManager = (options = {}) => {
    const storageApi = createStorage(options.storage || (typeof localStorage !== 'undefined' ? localStorage : null));
    const getUserId = options.getUserId || (() => null);
    const getClient = options.getClient || (() => null);
    const getOnline = options.getOnline || (() => typeof navigator === 'undefined' || navigator.onLine !== false);
    const getTimezone = options.getTimezone || (() => {
      try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Bogota'; } catch { return 'America/Bogota'; }
    });
    const now = options.now || (() => new Date());
    const onState = options.onState || (() => {});
    const onStatus = options.onStatus || (() => {});
    let channel = null;
    let startedUserId = null;
    let flushing = null;

    const userKey = (suffix) => `habitflow_widget_sync_v${QUEUE_VERSION}:${getUserId() || 'anonymous'}:${suffix}`;
    const getQueue = () => dedupeMutations(storageApi.get(userKey('pending'), []));
    const saveQueue = queue => storageApi.set(userKey('pending'), dedupeMutations(queue));

    const getDeviceId = () => {
      let deviceId = storageApi.getText('habitflow_device_id_v1');
      if (!deviceId) {
        deviceId = createId();
        storageApi.setText('habitflow_device_id_v1', deviceId);
      }
      return deviceId;
    };

    const prepare = (widgetKey, state) => {
      if (!WIDGET_KEYS.includes(widgetKey)) throw new Error(`Widget no soportado: ${widgetKey}`);
      const updatedAt = now().toISOString();
      const mutationId = createId();
      return {
        widgetKey,
        state: { ...state, timezone: state?.timezone || getTimezone(), updatedAt, mutationId },
        updatedAt,
        mutationId,
        deviceId: getDeviceId()
      };
    };

    const normalizeRpcRow = (row, fallbackMutation) => {
      const resolved = Array.isArray(row) ? row[0] : row;
      if (!resolved) return fallbackMutation.state;
      return {
        ...(resolved.state || fallbackMutation.state),
        updatedAt: resolved.updated_at || resolved.updatedAt || fallbackMutation.updatedAt,
        mutationId: resolved.mutation_id || resolved.mutationId || fallbackMutation.mutationId,
        recordId: resolved.id || resolved.recordId || fallbackMutation.state?.recordId
      };
    };

    const applyRemote = async (mutation) => {
      const client = getClient();
      const userId = getUserId();
      if (!client || !userId) return { ok: false, queued: true, reason: 'La nube no está disponible.' };
      const { data, error } = await client.rpc('habitflow_apply_widget_mutation', {
        p_widget_key: mutation.widgetKey,
        p_state: mutation.state,
        p_updated_at: mutation.updatedAt,
        p_mutation_id: mutation.mutationId,
        p_device_id: mutation.deviceId
      });
      if (error) {
        return {
          ok: false,
          queued: !getOnline() || isTransientError(error),
          reason: error.message || 'No se pudo sincronizar el widget.'
        };
      }
      return { ok: true, queued: false, state: normalizeRpcRow(data, mutation) };
    };

    const removeMutation = (mutationId) => saveQueue(getQueue().filter(item => item.mutationId !== mutationId));

    const commitPrepared = async (mutation) => {
      saveQueue([...getQueue(), mutation]);
      if (!getOnline()) {
        onStatus({ status: 'offline', pending: getQueue().length });
        return { ok: false, queued: true, reason: 'Cambio guardado para sincronizar al volver la conexión.' };
      }
      const result = await applyRemote(mutation);
      if (result.ok) {
        removeMutation(mutation.mutationId);
        onState(mutation.widgetKey, result.state, { source: 'backend' });
        onStatus({ status: 'active', pending: getQueue().length });
      } else if (result.queued) {
        onStatus({ status: 'offline', pending: getQueue().length, reason: result.reason });
      } else {
        removeMutation(mutation.mutationId);
        onStatus({ status: 'error', pending: getQueue().length, reason: result.reason });
      }
      return result;
    };

    const flush = async () => {
      if (flushing) return flushing;
      if (!getOnline() || !getUserId() || !getClient()) return { ok: false, pending: getQueue().length };
      flushing = (async () => {
        for (const mutation of getQueue()) {
          const result = await applyRemote(mutation);
          if (!result.ok) {
            if (!result.queued) removeMutation(mutation.mutationId);
            onStatus({ status: result.queued ? 'offline' : 'error', pending: getQueue().length, reason: result.reason });
            if (result.queued) break;
            continue;
          }
          removeMutation(mutation.mutationId);
          onState(mutation.widgetKey, result.state, { source: 'flush' });
        }
        onStatus({ status: getQueue().length ? 'offline' : 'active', pending: getQueue().length });
        return { ok: getQueue().length === 0, pending: getQueue().length };
      })().finally(() => { flushing = null; });
      return flushing;
    };

    const start = async (localStates = {}) => {
      const userId = getUserId();
      const client = getClient();
      if (!userId || !client) {
        onStatus({ status: 'local', pending: getQueue().length });
        return { ok: false, reason: 'No hay sesión autenticada o cliente de nube.' };
      }
      startedUserId = userId;
      onStatus({ status: 'checking', pending: getQueue().length });
      const { data: rows, error } = await client
        .from('habitflow_widget_state')
        .select('id,widget_key,state,updated_at,mutation_id')
        .eq('user_id', userId);
      if (error) {
        onStatus({ status: 'error', pending: getQueue().length, reason: error.message });
        return { ok: false, reason: error.message };
      }

      const remoteByWidget = new Map((rows || []).map(row => [row.widget_key, {
        ...(row.state || {}),
        updatedAt: row.updated_at,
        mutationId: row.mutation_id,
        recordId: row.id
      }]));
      let migrationOk = true;
      const migrationKey = userKey('legacy-migrated');
      const migrationDone = storageApi.getText(migrationKey) === 'true';

      for (const widgetKey of WIDGET_KEYS) {
        const remote = remoteByWidget.get(widgetKey);
        if (remote) {
          onState(widgetKey, remote, { source: 'bootstrap' });
          continue;
        }
        if (!migrationDone && localStates[widgetKey]) {
          const mutation = prepare(widgetKey, { ...localStates[widgetKey], migratedFromLocal: true });
          const result = await commitPrepared(mutation);
          if (!result.ok) migrationOk = false;
        }
      }
      if (!migrationDone && migrationOk) storageApi.setText(migrationKey, 'true');

      if (typeof client.channel === 'function') {
        channel = client
          .channel(`habitflow-widgets-${userId}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'habitflow_widget_state',
            filter: `user_id=eq.${userId}`
          }, payload => {
            const row = payload?.new;
            if (!row?.widget_key || !WIDGET_KEYS.includes(row.widget_key)) return;
            onState(row.widget_key, {
              ...(row.state || {}),
              updatedAt: row.updated_at,
              mutationId: row.mutation_id,
              recordId: row.id
            }, { source: 'realtime' });
          })
          .subscribe();
      }

      await flush();
      onStatus({ status: 'active', pending: getQueue().length });
      return { ok: true, migrated: !migrationDone && migrationOk, pending: getQueue().length };
    };

    const stop = async () => {
      const client = getClient();
      if (channel && client?.removeChannel) await client.removeChannel(channel).catch(() => null);
      channel = null;
      startedUserId = null;
    };

    return {
      prepare,
      commitPrepared,
      flush,
      start,
      stop,
      getQueue,
      getDeviceId,
      get startedUserId() { return startedUserId; }
    };
  };

  return {
    WIDGET_KEYS,
    createId,
    parseTimestamp,
    mergeByUpdatedAt,
    dedupeMutations,
    getPlatform,
    getDeviceName,
    isTransientError,
    createManager
  };
});
