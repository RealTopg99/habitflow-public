self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
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
    payload = { title: '🔔 HabitFlow', body: 'Tienes una alerta pendiente.' };
  }
  const title = payload.title || '🔔 HabitFlow';
  event.waitUntil(
    self.registration.showNotification(title, {
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
  const targetUrl = './index.html';
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
