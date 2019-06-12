const CACHE = 'diploma-v1';
const timeout = 400;

const log = (message) => {

    // console.log(message)
};

self.addEventListener('install', (event) => {
    log('Встановлено');
});

self.addEventListener('activate', () => {
    log('Активований');
});

self.addEventListener('fetch', function (event) {
        log('Service Worker Fetch...');
        if (event.request.method !== 'GET') {
            return;
        }

        event.respondWith(networkElseCache(event))
    }
);

function networkElseCache(event) {
    return caches.match(event.request).then(match => {
        if (!match) {
            return fetch(event.request);
        }
        return fetch(event.request).then(response => {
            // Update cache.
            caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
            return response;
        });
    });
}

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
