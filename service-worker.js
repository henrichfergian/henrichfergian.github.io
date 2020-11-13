const CACHE_NAME = "footballstatV1";
const urlsToCache = [
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
  "https://code.jquery.com/jquery-3.3.1.min.js",
  "/",
  "/index.html",
  "/manifest.json",
  "/nav.html",
  "/player.html",
  "/register-sw.js",
  "/team.html",
  "/assets/css/materialize.min.css",
  "/assets/css/style.css",
  "/assets/img/icons/android-chrome-192x192.png",
  "/assets/img/icons/android-chrome-512x512.png",
  "/assets/img/icons/apple-touch-icon.png",
  "/assets/img/icons/favicon-16x16.png",
  "/assets/img/icons/favicon-32x32.png",
  "/assets/img/helper.png",
  "/assets/js/api-v2.js",
  "/assets/js/db.js",
  "/assets/js/idb.js",
  "/assets/js/materialize.min.js",
  "/assets/js/nav.js",
  "/assets/js/player.js",
  "/assets/js/team.js",
  "/assets/pages/favorite.html",
  "/assets/pages/home.html",
  "/assets/pages/teams.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const BASE_URL = "https://api.football-data.org/v2/";

  if (event.request.url.indexOf(BASE_URL) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, {
        ignoreSearch: true
      }).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " deleted");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("push", (event) => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "push message no payload";
  }

  const OPTIONS = {
    body: body,
    icon: "/img/apple-touch-icon.png",
    vibrate: [10, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification("Football Stat", OPTIONS)
  );
});