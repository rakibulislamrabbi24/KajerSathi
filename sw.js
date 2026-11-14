/* KajerSathi service worker — precaches the whole app shell so it works offline.
 * CACHE_VERSION is re-stamped from the file contents by `npm run build` (scripts/stamp-sw.mjs).
 * If you edit files without running the build, change this string by hand so users get the update. */
'use strict';

const CACHE_PREFIX = 'kajersathi-';
const LEGACY_PREFIXES = ['aether-'];                // caches from the old brand name are removed on activate
const CACHE_VERSION = 'kajersathi-b0ca8b45df';

// Every file the app needs. Paths are relative to this file, so it works under /repo-name/ on GitHub Pages.
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/app.css',
  './assets/fonts/inter-latin-wght-normal.woff2',
  './assets/fonts/noto-sans-bengali-wght.woff2',
  './assets/i18n/bn.js',
  './assets/i18n/en.js',
  './assets/vendor/lucide.min.js',
  './assets/vendor/easy.qrcode.min.js',
  './assets/vendor/html5-qrcode.min.js',
  './assets/vendor/fflate.min.js',
  './assets/data/eff-wordlist.js',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    // cache:'reload' skips the HTTP cache, so a new version never precaches stale files from GitHub's CDN
    await cache.addAll(PRECACHE.map(url => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_VERSION && (k.startsWith(CACHE_PREFIX) || LEGACY_PREFIXES.some(p => k.startsWith(p)))).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;           // never touch third-party requests

  // Single-page app: every navigation is answered with the cached shell, falling back to the network.
  if (req.mode === 'navigate') {
    event.respondWith((async () => (await caches.match('./index.html')) || fetch(req))());
    return;
  }

  // Everything else: cache first, network as a fallback.
  event.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try { return await fetch(req); } catch { return Response.error(); }
  })());
});
