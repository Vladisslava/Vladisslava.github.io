const CACHE = 'diploma-v1';
const timeout = 400;

self.addEventListener('install', (event) => {
    console.log('Установлен');
    /*event.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.addAll([
                '/',
                '/manifest.json',
                '/favicon.ico',
                '/asset-manifest.json',
                '/static/css/2.*.chunk.css',
                '/static/css/main.*.chunk.css',
                '/static/js/2.*.chunk.js',
                '/static/js/main.*.chunk.js',
                '/static/js/runtime~main.*.js',
                '/static/media/!*.*',
                '/sw.js',
                '/index.html'
            ].map(item => 'http://localhost:3000' + item));
        })
    );*/
});

self.addEventListener('activate', () => {
    console.log('Активирован');
});

self.addEventListener('fetch', function (event) {
        console.log('Service Worker Fetch...');

        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    if (response) {
                        console.log('Serve from cache', response);
                        return response;
                    }
                    return fetch(event.request)
                        .then(response =>
                            caches.open(CACHE)
                                .then((cache) => {
                                    // cache response after making a request
                                    cache.put(event.request, response.clone());
                                    // return original response
                                    return response;
                                })
                        )
                })
        )
    }
);

// Временно-ограниченный запрос.
function fromNetwork(request, timeout) {
    return new Promise((fulfill, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
// Открываем наше хранилище кэша (CacheStorage API), выполняем поиск запрошенного ресурса.
// Обратите внимание, что в случае отсутствия соответствия значения Promise выполнится успешно, но со значением `undefined`
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}
