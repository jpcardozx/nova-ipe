'use client';

import React, { useState, useEffect } from 'react';
import styles from './DiagnosticPanel.module.css';
import { LazyIcon } from '../utils/icon-splitter';

type ServiceWorkerStatus = 'unsupported' | 'unregistered' | 'registered' | 'active';
type ConnectionStatus = 'online' | 'offline';

interface DiagnosticInfo {
    serviceWorkerStatus: ServiceWorkerStatus;
    connectionStatus: ConnectionStatus;
    installable: boolean;
    cachedAssetsCount: number;
    buildTimestamp?: string;
    serviceWorkerVersion?: string;
    webAppStatus: 'not_installed' | 'installed' | 'standalone';
}

export default function DiagnosticPanel() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [diagnosticInfo, setDiagnosticInfo] = useState<DiagnosticInfo>({
        serviceWorkerStatus: 'unsupported',
        connectionStatus: 'online',
        installable: false,
        cachedAssetsCount: 0,
        webAppStatus: 'not_installed'
    });

    useEffect(() => {
        // Verificar status de Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                if (registrations.length > 0) {
                    // Verificar se está ativo
                    if (navigator.serviceWorker.controller) {
                        setDiagnosticInfo(prev => ({
                            ...prev,
                            serviceWorkerStatus: 'active'
                        }));

                        // Extrair versão do SW
                        if (navigator.serviceWorker.controller.scriptURL) {
                            // Enviar mensagem para o service worker pedindo a versão
                            navigator.serviceWorker.controller.postMessage({ type: 'GET_VERSION' });
                        }
                    } else {
                        setDiagnosticInfo(prev => ({
                            ...prev,
                            serviceWorkerStatus: 'registered'
                        }));
                    }
                } else {
                    setDiagnosticInfo(prev => ({
                        ...prev,
                        serviceWorkerStatus: 'unregistered'
                    }));
                }
            });

            // Listener para mensagens do Service Worker
            navigator.serviceWorker.addEventListener('message', event => {
                if (event.data && event.data.type === 'VERSION_INFO') {
                    setDiagnosticInfo(prev => ({
                        ...prev,
                        serviceWorkerVersion: event.data.version,
                        buildTimestamp: event.data.timestamp
                    }));
                }
            });
        }

        // Verificar status de conexão
        const updateConnectionStatus = () => {
            setDiagnosticInfo(prev => ({
                ...prev,
                connectionStatus: navigator.onLine ? 'online' : 'offline'
            }));
        };

        updateConnectionStatus();
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);

        // Verificar status de instalação
        const isInStandaloneMode = () =>
            (window.matchMedia('(display-mode: standalone)').matches) ||
            (window.navigator as any).standalone ||
            document.referrer.includes('android-app://');

        setDiagnosticInfo(prev => ({
            ...prev,
            webAppStatus: isInStandaloneMode() ? 'standalone' : 'not_installed'
        }));

        // Verificar capacidade de instalação
        window.addEventListener('beforeinstallprompt', () => {
            setDiagnosticInfo(prev => ({
                ...prev,
                installable: true
            }));
        });

        // Verificar caches
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                let totalAssets = 0;

                const countPromises = cacheNames.map(name =>
                    caches.open(name).then(cache =>
                        cache.keys().then(keys => {
                            totalAssets += keys.length;
                            return keys.length;
                        })
                    )
                );

                Promise.all(countPromises).then(() => {
                    setDiagnosticInfo(prev => ({
                        ...prev,
                        cachedAssetsCount: totalAssets
                    }));
                });
            });
        }

        return () => {
            window.removeEventListener('online', updateConnectionStatus);
            window.removeEventListener('offline', updateConnectionStatus);
        };
    }, []);

    const clearCaches = async () => {
        if ('caches' in window) {
            try {
                const keys = await caches.keys();
                await Promise.all(keys.map(key => caches.delete(key)));

                // Também manda mensagem para o Service Worker
                if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CHUNK_CACHE' });
                }

                alert('Caches limpos com sucesso');
                setDiagnosticInfo(prev => ({
                    ...prev,
                    cachedAssetsCount: 0
                }));
            } catch (error) {
                alert(`Erro ao limpar caches: ${error instanceof Error ? error.message : String(error)}`);
            }
        } else {
            alert('API de Cache não disponível');
        }
    };

    const getStatusIcon = () => {
        if (diagnosticInfo.serviceWorkerStatus === 'active' && diagnosticInfo.connectionStatus === 'online') {
            return <LazyIcon name="CheckCircle" className={styles.iconGreen} />;
        } else if (diagnosticInfo.connectionStatus === 'offline') {
            return <LazyIcon name="WifiOff" className={styles.iconAmber} />;
        } else {
            return <LazyIcon name="AlertCircle" className={styles.iconRed} />;
        }
    };

    return (
        <div className={`${styles.panel} ${isExpanded ? styles.expanded : ''}`}>
            <div className={styles.handle} onClick={() => setIsExpanded(!isExpanded)}>
                <div className={styles.statusIndicator}>
                    {getStatusIcon()}
                    <span>Status do aplicativo</span>
                </div>
                <LazyIcon name={isExpanded ? "ChevronDown" : "ChevronUp"} className={styles.chevron} />
            </div>

            {isExpanded && (
                <div className={styles.content}>
                    <div className={styles.grid}>
                        <div>
                            <h3>Service Worker</h3>
                            <span className={diagnosticInfo.serviceWorkerStatus === 'active' ? styles.statusGood : styles.statusBad}>
                                {
                                    {
                                        'unsupported': 'Não suportado',
                                        'unregistered': 'Não registrado',
                                        'registered': 'Registrado',
                                        'active': 'Ativo'
                                    }[diagnosticInfo.serviceWorkerStatus]
                                }
                            </span>
                        </div>

                        <div>
                            <h3>Conexão</h3>
                            <span className={diagnosticInfo.connectionStatus === 'online' ? styles.statusGood : styles.statusWarning}>
                                {diagnosticInfo.connectionStatus === 'online' ? 'Online' : 'Offline'}
                            </span>
                        </div>

                        <div>
                            <h3>Modo PWA</h3>
                            <span className={diagnosticInfo.webAppStatus === 'standalone' ? styles.statusGood : styles.statusNeutral}>
                                {
                                    {
                                        'not_installed': 'Não instalado',
                                        'installed': 'Instalado',
                                        'standalone': 'Standalone'
                                    }[diagnosticInfo.webAppStatus]
                                }
                            </span>
                        </div>

                        <div>
                            <h3>Assets em cache</h3>
                            <span>{diagnosticInfo.cachedAssetsCount}</span>
                        </div>
                    </div>

                    {diagnosticInfo.serviceWorkerVersion && (
                        <div className={styles.version}>
                            <small>Service Worker v{diagnosticInfo.serviceWorkerVersion}</small>
                            {diagnosticInfo.buildTimestamp && (
                                <small>Build: {new Date(parseInt(diagnosticInfo.buildTimestamp)).toLocaleString()}</small>
                            )}
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button onClick={clearCaches} className={styles.clearButton}>
                            <LazyIcon name="Trash" className={styles.buttonIcon} />
                            Limpar caches
                        </button>

                        <a href="/diagnostico" className={styles.diagnosticLink}>
                            <LazyIcon name="Settings" className={styles.buttonIcon} />
                            Diagnóstico completo
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
