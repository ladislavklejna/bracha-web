/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

clientsClaim();

// Precachování všech statických assetů (JS, CSS, fonty…) – seznam injectuje Workbox při buildu
precacheAndRoute(self.__WB_MANIFEST);

// SPA fallback – všechny navigace dostávají index.html
const fileExtensionRegexp = /\/[^/?]+\.[^/]+$/;
registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') return false;
    if (url.pathname.startsWith('/_')) return false;
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Obrázky – Cache First, 30 dní, max 150 souborů
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin &&
    /\.(png|jpg|jpeg|gif|webp|svg|ico)$/.test(url.pathname),
  new CacheFirst({
    cacheName: 'arapro-images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 150,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// API portfolio – Network First, 1 hodina záloha
registerRoute(
  ({ url }) => url.href.includes('arapro.cz/index.php'),
  new NetworkFirst({
    cacheName: 'arapro-api',
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 5,
        maxAgeSeconds: 60 * 60,
      }),
    ],
  })
);
