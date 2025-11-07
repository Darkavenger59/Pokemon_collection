// Nom du cache
const CACHE_NAME = 'pokemon-collection-cache-v1';

// Fichiers essentiels à mettre en cache
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
    // Les scripts externes Firebase et Tailwind sont exclus car trop lourds et gérés par le CDN.
];

// Installation du service worker et mise en cache des actifs
self.addEventListener('install', event => {
  // Le service worker s'installe
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Ouverture du cache et mise en cache des ressources essentielles');
        // Ajout des URLs au cache
        return cache.addAll(urlsToCache);
      })
  );
});

// Récupération des requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne la ressource depuis le cache si elle est présente
        if (response) {
          return response;
        }
        
        // Si non, fait une requête réseau
        return fetch(event.request);
      }
    )
  );
});

// Activation du service worker et nettoyage des anciens caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Supprime les anciens caches qui ne sont pas dans la liste blanche
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

