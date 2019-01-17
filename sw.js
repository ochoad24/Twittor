//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE_NAME='static-v3';
const DYNAMIC_CACHE_NAME='dynamic-v1';
const INMUTABLE_CACHE_NAME='inmutable-v1';

const  APP_SHELL=[
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];
const APP_SHELL_INMUTABLE=[
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];
self.addEventListener('install',e=>{
    
    const cacheStatic=caches.open(STATIC_CACHE_NAME).then(cache=>cache.addAll(APP_SHELL));

    const cacheInmutable=caches.open(INMUTABLE_CACHE_NAME).then(cache=>cache.addAll(APP_SHELL_INMUTABLE));
    
    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
});

self.addEventListener('activate',e=>{
    const respuesta=caches.keys().then(keys=>{
        keys.forEach(key=>{
            //static-v4
            if(key!==STATIC_CACHE_NAME&& key.includes('static')){
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});

self.addEventListener('fetch',e=>{
    const respuesta=caches.match(e.request).then(res=>{
        if(res){
            return res;
        }else{
            return fetch(e.request).then(newRes=>{
                return actualizaCacheDinamico(DYNAMIC_CACHE_NAME,e.request,newRes);         
            });
        }
    });
    e.respondWith(respuesta);
});