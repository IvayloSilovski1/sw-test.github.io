const cacheName = 'v1';



// call install event
self.addEventListener('install', (e) => {
  console.log(`Service Worker: Installed`);
});

// activate event
self.addEventListener('activate', (e) => {
  console.log(`Service Worker: Activated`);
  // remove unwanted cached files
  e.waitUntil(
    // loop through the caches and delete unwanted
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log(`Service Worker: Clearing Old Cache!`);
            return caches.delete(cache);
          }
        })
      )
    })
  )
});

// call fetch event to see files offline
self.addEventListener('fetch', (e) => {
  console.log(`Service Worker: Fetching`);
  e.respondWith(
    fetch(e.request)
    .then(res => {
      // make copy/clone of response
      const resClonse = res.clone();
      // open cache
      caches
        .open(cacheName)
        .then(cache => {
          // add response to cache
          cache.put(e.request, resClonse);
        });
      return res;
    }).catch(err => caches.match(e.reuest).then(res => res))
  );
});