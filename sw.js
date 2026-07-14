const CACHE_VERSION = 'habitflow-pwa-v2026-07-14-auto-update-a';
const APP_SHELL = [
  './',
  './index.html',
  './HabitTrackerApp.jsx',
  './widget-sync-core.js',
  './exercise-dataset-service.js',
  './WorkoutFeature.jsx',
  './manifest.webmanifest',
  './brand-logo.svg',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('habitflow-pwa-') && key !== CACHE_VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const isNavigation = request.mode === 'navigate';
  const isLocalAsset = url.origin === self.location.origin;
  const isFreshAppAsset = isLocalAsset && (
    isNavigation ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/HabitTrackerApp.jsx') ||
    url.pathname.endsWith('/WorkoutFeature.jsx') ||
    url.pathname.endsWith('/widget-sync-core.js') ||
    url.pathname.endsWith('/exercise-dataset-service.js') ||
    url.pathname.endsWith('/manifest.webmanifest')
  );
  const isRuntimeAsset = ['script', 'style', 'font', 'image'].includes(request.destination)
    && ['unpkg.com', 'cdn.jsdelivr.net', 'esm.sh', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname);
  if (!isNavigation && !isLocalAsset && !isRuntimeAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    if (isFreshAppAsset) {
      const canonicalKey = isNavigation
        ? new Request(new URL('./index.html', self.registration.scope).href)
        : new Request(`${url.origin}${url.pathname}`);
      try {
        const response = await fetch(request, { cache: 'no-store' });
        if (response.ok) await cache.put(canonicalKey, response.clone());
        return response;
      } catch {
        return (await cache.match(canonicalKey)) || Response.error();
      }
    }

    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch {
      return Response.error();
    }
  })());
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type !== 'SHOW_NOTIFICATION') return;
  event.waitUntil(
    self.registration.showNotification(data.title || 'HabitFlow', {
      icon: './icon-192-20260603.png',
      badge: './icon-192-20260603.png',
      tag: data.tag || 'habitflow-notification',
      renotify: Boolean(data.renotify),
      requireInteraction: Boolean(data.requireInteraction),
      body: data.body || '',
      data: data.data || {}
    })
  );
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { title: 'HabitFlow', body: 'Tienes una alerta pendiente.' };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'HabitFlow', {
      icon: './icon-192-20260603.png',
      badge: './icon-192-20260603.png',
      tag: payload.tag || `habitflow-push-${Date.now()}`,
      renotify: payload.renotify !== false,
      requireInteraction: Boolean(payload.requireInteraction),
      body: payload.body || 'Tienes una alerta pendiente.',
      data: payload.data || {}
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const params = new URLSearchParams();
  if (data.view) params.set('view', data.view);
  if (data.section) params.set('section', data.section);
  const targetUrl = `./index.html${params.toString() ? `?${params}` : ''}`;
  event.waitUntil((async () => {
    const windowClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windowClients) {
      if ('focus' in client) {
        await client.focus();
        if ('navigate' in client) await client.navigate(targetUrl);
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(targetUrl);
  })());
});
