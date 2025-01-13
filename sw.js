const CACHE_NAME = 'xabcde-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/index.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Retorna do cache se encontrar
                if (response) {
                    return response;
                }

                // Clone a requisição
                const fetchRequest = event.request.clone();

                // Tenta buscar da rede
                return fetch(fetchRequest).then(
                    (response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone a resposta
                        const responseToCache = response.clone();

                        // Adiciona ao cache
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
            .catch(() => {
                // Fallback para recursos não encontrados
                if (event.request.url.indexOf('.html') > -1) {
                    return caches.match('/offline.html');
                }
            })
    );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-relatorios') {
        event.waitUntil(syncRelatorios());
    }
});

// Notificações push
self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: './icons/icon-192x192.png',
        badge: './icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver detalhes'
            },
            {
                action: 'close',
                title: 'Fechar'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Protocolo XABCDE', options)
    );
});

// Função para sincronizar relatórios
async function syncRelatorios() {
    const relatorios = await getRelatoriosPendentes();
    
    for (const relatorio of relatorios) {
        try {
            await enviarRelatorio(relatorio);
            await marcarComoEnviado(relatorio.id);
        } catch (error) {
            console.error('Erro ao sincronizar relatório:', error);
        }
    }
}

// Funções auxiliares (implemente conforme necessário)
async function getRelatoriosPendentes() {
    // Implementar lógica para buscar relatórios pendentes
    return [];
}

async function enviarRelatorio(relatorio) {
    // Implementar lógica para enviar relatório
}

async function marcarComoEnviado(id) {
    // Implementar lógica para marcar relatório como enviado
}
