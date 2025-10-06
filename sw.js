self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("ladeberegner-v1").then((cache) =>
      cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/js/beregner.js",
        "/img/icon-192.png",
        "/img/icon-512.png"
      ])
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((resp) => resp || fetch(e.request))
  );
});
