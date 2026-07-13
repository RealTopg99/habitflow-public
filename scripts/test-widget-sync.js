const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sync = require('../widget-sync-core.js');

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

const makeClient = () => {
  const widgetRows = new Map();
  const appliedMutations = new Set();
  let writes = 0;
  const client = {
    get writes() { return writes; },
    async rpc(name, params) {
      assert.equal(name, 'habitflow_apply_widget_mutation');
      if (!appliedMutations.has(params.p_mutation_id)) {
        appliedMutations.add(params.p_mutation_id);
        const previous = widgetRows.get(params.p_widget_key);
        const incomingTime = Date.parse(params.p_updated_at);
        const previousTime = Date.parse(previous?.updated_at || '');
        if (!previous || incomingTime > previousTime || (
          incomingTime === previousTime && params.p_mutation_id > previous.mutation_id
        )) {
          widgetRows.set(params.p_widget_key, {
            id: previous?.id || `row-${params.p_widget_key}`,
            widget_key: params.p_widget_key,
            state: params.p_state,
            updated_at: params.p_updated_at,
            mutation_id: params.p_mutation_id
          });
          writes += 1;
        }
      }
      return { data: widgetRows.get(params.p_widget_key), error: null };
    },
    from(table) {
      assert.equal(table, 'habitflow_widget_state');
      return {
        select() {
          return {
            async eq() { return { data: [...widgetRows.values()], error: null }; }
          };
        }
      };
    },
    channel() {
      return { on() { return this; }, subscribe() { return this; } };
    },
    async removeChannel() {}
  };
  return client;
};

(async () => {
  const older = { amount: 250, updatedAt: '2026-07-13T10:00:00.000Z', mutationId: 'a' };
  const newer = { amount: 500, updatedAt: '2026-07-13T10:00:01.000Z', mutationId: 'b' };
  assert.equal(sync.mergeByUpdatedAt(older, newer).amount, 500, 'last-write-wins debe conservar el estado más reciente');
  assert.equal(sync.mergeByUpdatedAt(newer, older).amount, 500, 'un evento Realtime antiguo no debe revertir la UI');

  const duplicates = sync.dedupeMutations([
    { widgetKey: 'hydration', mutationId: 'same', updatedAt: older.updatedAt },
    { widgetKey: 'hydration', mutationId: 'same', updatedAt: newer.updatedAt }
  ]);
  assert.equal(duplicates.length, 1, 'los reintentos deben deduplicarse por mutationId');
  assert.equal(duplicates[0].updatedAt, newer.updatedAt);

  const offlineStorage = new MemoryStorage();
  const offlineManager = sync.createManager({
    storage: offlineStorage,
    getUserId: () => 'user-a',
    getClient: () => makeClient(),
    getOnline: () => false,
    now: () => new Date('2026-07-13T11:00:00.000Z')
  });
  const offlineMutation = offlineManager.prepare('hydration', { date: '2026-07-13', amount: 250, goal: 2500 });
  const offlineResult = await offlineManager.commitPrepared(offlineMutation);
  assert.equal(offlineResult.queued, true, 'sin conexión el cambio debe permanecer optimista y en cola');
  assert.equal(offlineManager.getQueue().length, 1);

  const onlineStorage = new MemoryStorage();
  const client = makeClient();
  const received = [];
  const onlineManager = sync.createManager({
    storage: onlineStorage,
    getUserId: () => 'user-a',
    getClient: () => client,
    getOnline: () => true,
    now: () => new Date('2026-07-13T12:00:00.000Z'),
    onState: (widgetKey, state) => received.push({ widgetKey, state })
  });
  const mutation = onlineManager.prepare('brushing', { date: '2026-07-13', count: 1, goal: 2 });
  await onlineManager.commitPrepared(mutation);
  await onlineManager.commitPrepared(mutation);
  assert.equal(client.writes, 1, 'reintentar el mismo mutationId no debe escribir dos veces');
  assert.equal(onlineManager.getQueue().length, 0);
  assert.equal(received.at(-1).state.count, 1);

  const migrationStorage = new MemoryStorage();
  const migrationClient = makeClient();
  const migrationManager = sync.createManager({
    storage: migrationStorage,
    getUserId: () => 'user-migration',
    getClient: () => migrationClient,
    getOnline: () => true,
    now: () => new Date('2026-07-13T13:00:00.000Z')
  });
  const migrated = await migrationManager.start({
    hydration: { date: '2026-07-13', amount: 750, goal: 2500 },
    brushing: { date: '2026-07-13', count: 1, goal: 2 }
  });
  assert.equal(migrated.ok, true);
  assert.equal(migrated.migrated, true, 'la primera sesión debe migrar el respaldo local');
  assert.equal(migrationClient.writes, 2);
  await migrationManager.stop();

  const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase-habitflow-cloud.sql'), 'utf8');
  assert.match(sql, /habitflow_select_own_widget_state/);
  assert.match(sql, /auth\.jwt\(\)->>'sub'/);
  assert.match(sql, /habitflow_apply_widget_mutation/);
  assert.match(sql, /unique \(user_id, widget_key\)/i);

  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const publicKey = html.match(/HABITFLOW_VAPID_PUBLIC_KEY\s*=\s*'([^']+)'/)?.[1] || '';
  assert.equal(publicKey.length, 87, 'la clave pública VAPID debe tener longitud P-256 válida');
  assert.match(publicKey, /^[A-Za-z0-9_-]+$/, 'la clave pública VAPID debe ser Base64 URL-safe');

  const app = fs.readFileSync(path.join(__dirname, '..', 'HabitTrackerApp.jsx'), 'utf8');
  assert.match(app, /habitflow_push_vapid_public_key/);
  assert.match(app, /subscription\.unsubscribe\(\)/, 'una rotación VAPID debe renovar suscripciones antiguas');

  console.log('Widget sync tests ok');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
