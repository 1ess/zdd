'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

hexo.extend.generator.register('versioned-service-worker', function () {
  const root = hexo.base_dir;
  const versionInputs = [
    ...fs.readdirSync(path.join(root, 'themes/journal/source/css')).filter((name) => name.endsWith('.css')).sort().map((name) => 'themes/journal/source/css/' + name),
    'themes/journal/source/js/journal.js',
    'themes/journal/source/js/site-runtime.js',
    'themes/journal/source/js/search.js',
    'themes/journal/source/vendor/fonts.css',
    'themes/journal/source/vendor/code-font.css',
    'themes/journal/source/vendor/nord.css',
    'scripts/search-index.js',
    'scripts/service-worker-generator.js',
    'source/offline.html'
  ];
  const hash = crypto.createHash('sha256');
  versionInputs.forEach(function (relativePath) {
    const file = path.join(root, relativePath);
    if (fs.existsSync(file)) hash.update(fs.readFileSync(file));
  });

  const version = hash.digest('hex').slice(0, 12);
  const shell = ['/offline.html', '/manifest.webmanifest'];

  const worker = `'use strict';
const VERSION = '${version}';
const PRECACHE = 'zdd-precache-' + VERSION;
const PAGES = 'zdd-pages-' + VERSION;
const STATIC = 'zdd-static-' + VERSION;
const DATA = 'zdd-data-' + VERSION;
const IMAGES = 'zdd-images-' + VERSION;
const APP_SHELL = ${JSON.stringify(shell)};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PRECACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  const current = new Set([PRECACHE, PAGES, STATIC, DATA, IMAGES]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('zdd-') && !current.has(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED', version: VERSION })))
  );
});

async function save(cacheName, request, response) {
  if (response && response.ok && response.type !== 'opaque') {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
}

async function trim(cacheName, maximum) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maximum)).map((key) => cache.delete(key)));
}

async function networkFirst(request, cacheName, fallback) {
  try {
    const response = await save(cacheName, request, await fetch(request));
    if (cacheName === PAGES) await trim(PAGES, 30);
    if (cacheName === DATA) await trim(DATA, 8);
    return response;
  } catch (_) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallback) {
      const precache = await caches.open(PRECACHE);
      return (await precache.match(fallback)) || Response.error();
    }
    return Response.error();
  }
}

async function cacheFirst(request, cacheName, maximum) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await save(cacheName, request, await fetch(request));
  if (maximum) await trim(cacheName, maximum);
  return response;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGES, '/offline.html'));
  } else if (/\\/search\\/content\\.[a-f0-9]{16}\\.json$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request, DATA, 8));
  } else if (url.pathname.endsWith('/search-index.json') || url.pathname.endsWith('/footprints.geojson')) {
    event.respondWith(networkFirst(request, DATA));
  } else if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGES, 80));
  } else if (request.destination === 'font' || ((request.destination === 'style' || request.destination === 'script') && url.searchParams.has('v'))) {
    event.respondWith(cacheFirst(request, STATIC, 24));
  } else if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(networkFirst(request, STATIC));
  }
});
`;

  return { path: 'service-worker.js', data: worker };
});
