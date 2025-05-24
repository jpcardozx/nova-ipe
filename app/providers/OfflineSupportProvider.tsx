'use client';

import { useEffect, useState, useCallback } from 'react';
import { getServiceWorkerVersion } from '../utils/service-worker-utils';

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
    const [swVersion, setSwVersion] = useState<string | null>(null);

    // Verificar a versão do service worker
    const checkServiceWorkerVersion = useCallback(async () => {
        try {
            const versionInfo = await getServiceWorkerVersion();
            if (versionInfo) {
                setSwVersion(versionInfo.version);
                console.log('Service Worker version:', versionInfo.version);
            }
        } catch (error) {
            console.warn('Não foi possível verificar a versão do Service Worker:', error);
        }
    }, []);

    // Registrar o service worker
    useEffect(() => {
        // Verificar se estamos em um navegador e se o Service Worker é suportado
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            // Evitar conflitos com outros service workers (ex: workbox)
            (window as any).workbox === undefined
        ) {
            // Só registrar o service worker em produção
            if (process.env.NODE_ENV === 'production') {
                navigator.serviceWorker
                    .register('/service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registrado com sucesso:', registration);
                        setOfflineReady(true);

                        // Verificar se há update disponível
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            if (newWorker) {
                                newWorker.addEventListener('statechange', () => {
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        console.log('Nova versão do Service Worker instalada e pronta para ativação');
                                        checkServiceWorkerVersion();
                                    }
                                });
                            }
                        });

                        // Verificar versão atual
                        checkServiceWorkerVersion();
                    })
                    .catch(error => {
                        console.error('Erro ao registrar Service Worker:', error);
                    });
            }
        }

        // Adicionar listeners para eventos de offline/online
        const handleOffline = () => {
            console.log('Dispositivo está offline');
            // Adicionar classe para controle visual de estado offline
            document.documentElement.classList.add('offline-mode');
        };

        const handleOnline = () => {
            console.log('Dispositivo está online novamente');
            document.documentElement.classList.remove('offline-mode');
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        // Verificar o estado inicial
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            handleOffline();
        }

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, [checkServiceWorkerVersion]);

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
