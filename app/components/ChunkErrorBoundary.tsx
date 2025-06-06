'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    isChunkLoadError: boolean;
}

/**
 * Componente de ErrorBoundary especializado em capturar ChunkLoadError
 * para evitar problemas de carregamento de código dinâmico na aplicação
 */
class ChunkErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            isChunkLoadError: false
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Detecção mais robusta de erros de carregamento de chunk/módulo
        const chunkErrorPatterns = [
            'ChunkLoadError',
            'Loading chunk',
            'Loading CSS chunk',
            'failed to load',
            'Failed to fetch',
            'dynamically imported module',
            'Cannot find module',
            'MIME type',
            'is not executable',
            'not a supported stylesheet MIME type',
            'Script error'
        ];

        const isChunkError = chunkErrorPatterns.some(pattern =>
            error.message.includes(pattern) ||
            error.stack?.includes(pattern)
        );

        return {
            hasError: true,
            error,
            isChunkLoadError: isChunkError
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.warn('ChunkErrorBoundary capturou um erro:', error);
        console.warn('Detalhes do erro:', errorInfo.componentStack);

        // Se for um erro de carregamento de chunk, podemos tentar recarregar a página após um atraso
        if (this.state.isChunkLoadError && typeof window !== 'undefined') {
            const MAX_RETRIES = 3;
            const RETRY_KEY = 'chunk_error_retries';
            let retries = 0;
            if (typeof window !== 'undefined' && window.localStorage) {
                retries = parseInt(window.localStorage.getItem(RETRY_KEY) || '0', 10);
                retries += 1;
                window.localStorage.setItem(RETRY_KEY, retries.toString());
            }

            if (retries <= MAX_RETRIES) {
                // Comunicação aprimorada com o Service Worker
                this.clearCaches().then(() => {
                    // Adiciona parâmetro de timestamp para evitar cache do navegador
                    const reloadUrl = new URL(window.location.href);
                    reloadUrl.searchParams.set('t', Date.now().toString());

                    setTimeout(() => {
                        window.location.href = reloadUrl.toString();
                    }, 1500);
                });
            } else {
                if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.removeItem(RETRY_KEY);
                }
                this.setState({
                    ...this.state,
                    hasError: true,
                    error,
                    isChunkLoadError: true,
                });
            }
        }
    }

    // Método melhorado para limpar caches
    async clearCaches(): Promise<void> {
        const promises: Promise<any>[] = [];        // Limpa caches do navegador
        if ('caches' in window) {
            const cachePromise = caches.keys().then(keys => {
                return Promise.all(
                    keys.map(key => {
                        console.log('[ChunkErrorBoundary] Limpando cache:', key);
                        return caches.delete(key);
                    })
                );
            });
            promises.push(cachePromise);
        }

        // Envia mensagem para o Service Worker e aguarda resposta
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller !== null) {
            const swPromise = new Promise<void>((resolve) => {
                // Handler para receber confirmação
                const messageHandler = (event: MessageEvent) => {
                    if (event.data && event.data.type === 'CHUNK_CACHE_CLEARED') {
                        navigator.serviceWorker.removeEventListener('message', messageHandler);
                        console.log('[ChunkErrorBoundary] Service Worker confirmou limpeza de cache');
                        resolve();
                    }
                };

                // Configura listener antes de enviar mensagem
                navigator.serviceWorker.addEventListener('message', messageHandler);

                // Verifica se o controller existe antes de enviar a mensagem
                const controller = navigator.serviceWorker.controller;
                if (controller) {
                    controller.postMessage({ type: 'CLEAR_CHUNK_CACHE' });
                    console.log('[ChunkErrorBoundary] Mensagem enviada ao Service Worker');
                } else {
                    console.warn('[ChunkErrorBoundary] Service Worker controller não disponível');
                }

                // Resolve após timeout como fallback
                setTimeout(resolve, 2000);
            });
            promises.push(swPromise);
        }

        // Limpa caches locais do Next.js
        if (typeof window !== 'undefined') {
            // Limpa caches específicos do Next.js
            const localStorageCaches = [
                'nextjs_cache',
                'next-router-state-tree',
                'next-static-data'
            ];

            localStorageCaches.forEach(key => {
                try {
                    window.localStorage.removeItem(key);
                } catch (e) {
                    console.warn(`[ChunkErrorBoundary] Falha ao limpar cache local: ${key}`, e);
                }
            });
        }

        // Aguarda todas as operações de limpeza de cache
        return Promise.all(promises).then(() => {
            console.log('[ChunkErrorBoundary] Todos os caches foram limpos');
        });
    }

    render(): ReactNode {
        let retryCount = 0;
        if (typeof window !== 'undefined' && window.localStorage) {
            retryCount = parseInt(window.localStorage.getItem('chunk_error_retries') || '0', 10);
        }
        if (this.state.hasError) {
            // Se temos um fallback personalizado, usamos
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Fallback padrão
            return (
                <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200">
                    <p className="text-heading-3 text-red-600 mb-3">
                        {this.state.isChunkLoadError
                            ? retryCount > 3
                                ? 'Falha ao recuperar recursos da aplicação após várias tentativas. Por favor, limpe o cache do navegador ou tente novamente mais tarde.'
                                : 'Houve um problema ao carregar alguns recursos da página.'
                            : 'Ocorreu um erro inesperado.'}
                    </p>
                    {this.state.isChunkLoadError && retryCount <= 3 && (
                        <p className="text-body-2 text-neutral-600 leading-relaxed">
                            Tentando recuperação automática... Se a página não carregar em alguns segundos, por favor atualize a página manualmente.
                        </p>
                    )}
                    <button
                        onClick={() => {
                            if (typeof window !== 'undefined' && window.localStorage) {
                                window.localStorage.removeItem('chunk_error_retries');
                            }
                            window.location.reload();
                        }}
                        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded text-body-2 font-medium hover:bg-primary-700 transition-colors"
                    >
                        Atualizar agora
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ChunkErrorBoundary;
