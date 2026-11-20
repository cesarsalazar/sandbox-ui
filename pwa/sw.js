// Sandbox's service worker for installed apps. Copy it to the app's public/
// folder as sw.js and register it once (see the README's "Installed app").
//
// It does one thing: when a page can't be reached because the phone has no
// connection, it shows the app's offline page instead of the browser's error.
// Nothing else is cached, so people never see stale member data, and a
// deploy reaches them on their next visit as usual.

const VERSION = "sandbox-offline-v1";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: "reload" })))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(() => caches.open(VERSION).then((cache) => cache.match(OFFLINE_URL))),
  );
});
