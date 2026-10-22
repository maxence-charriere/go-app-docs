// -----------------------------------------------------------------------------
// PWA
// -----------------------------------------------------------------------------
const cacheName = "app-" + "485409b4e12b9f42c57c634a43fe7909585665d5";
const resourcesToCache = ["https://raw.githubusercontent.com/maxence-charriere/go-app-docs/main/docs/web/icon.png","https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1013306768105236","/web/js/prism.js","/web/documents/what-is-go-app.md","/web/documents/updates.md","/web/documents/home.md","/web/documents/home-next.md","/web/css/prism.css","/web/css/docs.css","/web/app.wasm","/wasm_exec.js","/manifest.webmanifest","/app.js","/app.css","/"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    try {
      console.log("installing app worker " + "485409b4e12b9f42c57c634a43fe7909585665d5");
      await installWorker();
      await self.skipWaiting();
    } catch (error) {
      console.error("error during installation:", error);
      throw error;
    }
  })());
});

async function installWorker() {
  const cache = await caches.open(cacheName);
  await cache.addAll(resourcesToCache);
}

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try {
      await deletePreviousCaches();
      await self.clients.claim();
      console.log("app worker " + "485409b4e12b9f42c57c634a43fe7909585665d5" + " is activated");
    } catch (error) {
      console.error("error during activation:", error);
      throw error;
    }
  })());
});

async function deletePreviousCaches() {
  const keys = await caches.keys();
  await Promise.all(
    keys.map(async (key) => {
      if (key !== cacheName) {
        try {
          console.log("deleting", key, "cache");
          await caches.delete(key);
        } catch (err) {
          console.error("deleting", key, "cache failed:", err);
        }
      }
    })
  );
}

self.addEventListener("fetch", (event) => {
  event.respondWith(fetchWithCache(event.request));
});

async function fetchWithCache(request) {
  const cachedResponse = await caches.match(request, { cacheName });
  if (cachedResponse) {
    return cachedResponse;
  }
  return await fetch(request);
}

// -----------------------------------------------------------------------------
// Push Notifications
// -----------------------------------------------------------------------------
self.addEventListener("push", (event) => {
  event.waitUntil((async () => {
    let notification;

    try {
      notification = event.data ? event.data.json() : null;
    } catch {
      notification = null;
    }

    if (!notification) {
      return;
    }

    await showNotification(self.registration, notification);
  })());
});

self.addEventListener("message", (event) => {
  const msg = event.data;
  if (!msg || msg.type !== "goapp:notify") {
    return;
  }

  event.waitUntil(
    showNotification(self.registration, msg.options)
  );
});

async function showNotification(registration, notification) {
  const title = notification.title || "Notification";

  let actions = [];
  for (let i in notification.actions) {
    const action = notification.actions[i];
    actions.push({
      action: action.action,
      path: action.path,
    });
    delete action.path;
  }

  await registration.showNotification(title, {
    body: notification.body,
    icon: notification.icon,
    badge: notification.badge,
    actions: notification.actions,
    data: {
      goapp: {
        path: notification.path,
        actions: actions
      }
    }
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const notification = event.notification;
  let path = notification.data.goapp.path;

  for (let i in notification.data.goapp.actions) {
    const action = notification.data.goapp.actions[i];
    if (action.action === event.action) {
      path = action.path;
      break;
    }
  }

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        for (var i = 0; i < clientList.length; i++) {
          let client = clientList[i];
          if ("focus" in client) {
            client.focus();
            client.postMessage({
              goapp: {
                type: "notification",
                path: path,
              },
            });
            return;
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(path);
        }
      })
  );
});
