importScripts('/uv/uv.sw.js');

const params = new URLSearchParams(self.serviceWorker.scriptURL)

var cfg = JSON.parse(params.get('config'));
const sw = new UVServiceWorker(cfg);

self.addEventListener('fetch', event =>
    event.respondWith(sw.fetch(event))
);


