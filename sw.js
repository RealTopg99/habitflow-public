const CACHE_VERSION = 'habitflow-pwa-v2026-07-13-typography-a';
const APP_SHELL = [
  './',
  './index.html',
  './HabitTrackerApp.jsx',
  './widget-sync-core.js',
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
  const isRuntimeAsset = ['script', 'style', 'font', 'image'].includes(request.destination)
    && ['unpkg.com', 'cdn.jsdelivr.net', 'esm.sh', 'fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname);
  if (!isNavigation && !isLocalAsset && !isRuntimeAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    if (!isNavigation) {
      const cached = await cache.match(request, { ignoreSearch: isLocalAsset });
      const refresh = fetch(request).then(response => {
        if (response.ok) cache.put(request, response.clone());
        return response;
      }).catch(() => null);
      if (cached) {
        event.waitUntil(refresh);
        return cached;
      }
      const response = await refresh;
      if (response) return response;
    } else {
      try {
        const response = await fetch(request);
        if (response.ok) cache.put('./index.html', response.clone());
        return response;
      } catch {}
    }
    const cached = await cache.match(request, { ignoreSearch: isLocalAsset });
    if (cached) return cached;
    if (isNavigation) return (await cache.match('./index.html')) || Response.error();
    return Response.error();
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
