// public/sw.js
// filepath: public/sw.js
const CACHE_NAME = "protextify-v1";
const STATIC_CACHE = "protextify-static-v1";
const DYNAMIC_CACHE = "protextify-dynamic-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Add critical CSS and JS files here
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^http:\/\/103\.217\.145\.28:3000\/api\/.*$/,
  /^https:\/\/api\.protextify\.id\/api\/.*$/,
  /^http:\/\/localhost:3000\/api\/.*$/,
];

// Assets that should always be fetched from network
const NETWORK_FIRST_PATTERNS = [
  /\/api\/auth\/.*/,
  /\/api\/submissions\/.*/,
  /\/api\/plagiarism\/.*/,
];

// Install event
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim(),
    ])
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Handle different caching strategies
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request)) {
    if (isNetworkFirstPattern(request)) {
      event.respondWith(networkFirst(request));
    } else {
      event.respondWith(staleWhileRevalidate(request));
    }
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigation(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Caching strategies
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log("[SW] Cache first failed:", error);
    return new Response("Offline content not available", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("[SW] Network first failed, trying cache:", error);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response(
      JSON.stringify({
        error: "Network unavailable",
        offline: true,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // Network failed, return cached version if available
      return cachedResponse;
    });

  return cachedResponse || fetchPromise;
}

async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Return cached index.html for SPA routing
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match("/index.html");
    return (
      cachedResponse ||
      new Response("Offline page not available", { status: 503 })
    );
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    STATIC_ASSETS.some((asset) => url.pathname === asset) ||
    /\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/.test(url.pathname)
  );
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return API_CACHE_PATTERNS.some((pattern) => pattern.test(request.url));
}

function isNetworkFirstPattern(request) {
  return NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(request.url));
}

function isNavigationRequest(request) {
  return (
    request.mode === "navigate" ||
    (request.method === "GET" &&
      request.headers.get("accept").includes("text/html"))
  );
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag);

  if (event.tag === "auto-save-submission") {
    event.waitUntil(syncSubmissions());
  }
});

async function syncSubmissions() {
  try {
    // Get pending submissions from IndexedDB
    const pendingSubmissions = await getPendingSubmissions();

    for (const submission of pendingSubmissions) {
      try {
        const response = await fetch(
          `/api/submissions/${submission.id}/content`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${submission.token}`,
            },
            body: JSON.stringify({ content: submission.content }),
          }
        );

        if (response.ok) {
          await removePendingSubmission(submission.id);
          console.log("[SW] Synced submission:", submission.id);
        }
      } catch (error) {
        console.log("[SW] Failed to sync submission:", submission.id, error);
      }
    }
  } catch (error) {
    console.log("[SW] Background sync failed:", error);
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingSubmissions() {
  // Implementation depends on your IndexedDB setup
  return [];
}

async function removePendingSubmission(id) {
  // Implementation depends on your IndexedDB setup
}

// Push notifications
self.addEventListener("push", (event) => {
  console.log("[SW] Push message received:", event);

  const options = {
    body: event.data ? event.data.text() : "Notifikasi baru dari Protextify",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    tag: "protextify-notification",
    requireInteraction: true,
    actions: [
      {
        action: "open",
        title: "Buka",
      },
      {
        action: "close",
        title: "Tutup",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Protextify", options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event);

  event.notification.close();

  if (event.action === "open") {
    event.waitUntil(clients.openWindow("/"));
  }
});
