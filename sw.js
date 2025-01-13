const CACHE_NAME = 'xabcde-v2';
const OFFLINE_URL = './offline.html';

// Arquivos para cache
const STATIC_CACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './offline.html',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(STATIC_CACHE_URLS);
      }),
      // Cache da página offline
      caches.open(CACHE_NAME).then(cache => {
        return cache.add(OFFLINE_URL);
      })
    ])
  );
  // Força o service worker a se tornar ativo
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  // Garante que o service worker controle todas as abas/janelas
  self.clients.claim();
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  // Estratégia: Cache First, falling back to Network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Cache hit
        }

        return fetch(event.request)
          .then(response => {
            // Verifica se é uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta pois ela só pode ser usada uma vez
            const responseToCache = response.clone();

            // Adiciona ao cache para uso futuro
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Se falhar, retorna a página offline
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Sincronização em background
self.addEventListener('sync', event => {
  if (event.tag === 'sync-relatorios') {
    event.waitUntil(syncRelatorios());
  }
});

// Notificações push
self.addEventListener('push', event => {
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
