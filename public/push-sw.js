/* FurTools push service worker — receives Web Push messages sent by the
   site's own worker (see src/lib/web-push.ts) and shows notifications. */
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "FurTools", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "FurTools";
  const options = {
    body: data.body || "",
    icon: data.icon || "/favicon.png",
    badge: "/favicon.png",
    tag: data.tag || undefined,
    data: { url: data.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";
  const url = new URL(target, self.location.origin).toString();
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) return client.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow(url);
      }),
  );
});
