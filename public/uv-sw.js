importScripts('/uv/uv.sw.js');

const params = new URL(self.serviceWorker.scriptURL).searchParams

const serverURL = atob(params.get('url'));
const sw = new UVServiceWorker(serverURL);

self.addEventListener('fetch', event => event.respondWith(sw.fetch(event)));