//Asignar nombre y version de la cache
const CACHE_NAME = 'v1_cache_CR_PWA';

//Configuracion de los ficheros
var urlsToCache = [
    "/",
    "index.html",
    "css/styles.css",
    "main.js",
    "img/images/icons/icon-72x72.png",
    "img/images/icons/icon-96x96.png",
    "img/images/icons/icon-128x128.png",
    "img/images/icons/icon-144x144.png",
    "img/images/icons/icon-152x152.png",
    "img/images/icons/icon-192x192.png",
    "img/images/icons/icon-384x384.png",
    "img/images/icons/icon-512x512.png",

];

// Eventos del Serverworker
//Evento install
self.addEventListener('install', e => {

    //Utilizamos la variable del evento
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                    .then(() => {
                        self.skipWaiting();
                    })
            })
            .catch(err => console.log('No se ha registrado el cache', err))
    );
});



// Evento activar
// Este evento permite que la aplicación fucione offline
self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME];
    //Que el evento espere a que se inicie
    e.waitUntil(
        caches.keys()
            .then(cachesNames => {
                return Promise.all(
                    cachesNames.map(cacheName => {
                        if (cacheWhitelist.indexOf(cacheName) == -1) {
                            //Borrar los elementos que no se necesitan
                            return cache.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                self.clients.claim(); // activa la cache en el dispositivo
            })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(res => {
                if (res) {
                    //Devuelvo datos desde el cache
                    console.log("Devuelve los datos desde cache /n")
                    return res;
                }
                return fetch(e.request); // Se realiza la petición al servidor en caso de que no este en cache
            }
            )
    )
});