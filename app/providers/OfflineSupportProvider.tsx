'use client';

import { useEffect, useState } from 'react';

/**
 * OfflineSupportProvider - Registra o service worker para suporte offline
 * e implementa funcionalidades PWA (Progressive Web App).
 * 
 * Esta funcionalidade melhora significativamente a experiência do usuário
 * em condições de rede limitada ou intermitente.
 */
export default function OfflineSupportProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [offlineReady, setOfflineReady] = useState(false);

    // Registrar o service worker
    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            (window as any).workbox === undefined
        ) {
            // Registrar service worker
            if (process.env.NODE_ENV === 'production') {
                navigator.serviceWorker
                .register('/sw.js') // Alterado de .ts para .js, pois o navegador requer um arquivo JS
                .then(registration => {
                    console.log('Service Worker registrado com sucesso:', registration);
                    setOfflineReady(true);
                })
                .catch(error => {
                    console.error('Erro ao registrar Service Worker:', error);
                });
            }
        }

        // Adicionar listeners para eventos de offline/online
        const handleOffline = () => {
            console.log('Dispositivo está offline');
            // Podemos adicionar uma notificação ou outra UI aqui
            document.documentElement.classList.add('offline-mode');
        };

        const handleOnline = () => {
            console.log('Dispositivo está online novamente');
            document.documentElement.classList.remove('offline-mode');
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        // Verificar o estado inicial
        if (!navigator.onLine) {
            handleOffline();
        }

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    return (
        <>
            {children}
            {offlineReady && (
                <div className="hidden">
                    {/* Este elemento só existe para confirmar que o suporte offline está pronto */}
                    <span id="offline-support-ready" data-testid="offline-support-ready" />
                </div>
            )}
        </>
    );
}
