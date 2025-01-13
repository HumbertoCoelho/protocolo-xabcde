import { Capacitor } from '@capacitor/core';

// Inicializa o app
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se está rodando em ambiente nativo
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
        // Configurações específicas para ambiente mobile
        document.body.classList.add('mobile-app');
        
        // Ajusta o viewport para mobile
        const viewport = document.querySelector('meta[name=viewport]');
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
});
