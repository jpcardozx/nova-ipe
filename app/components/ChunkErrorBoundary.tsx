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
        // Verificar se é um erro de carregamento de chunk
        const errorIsChunkError =
            error.message.includes('ChunkLoadError') ||
            error.message.includes('Loading chunk') ||
            error.message.includes('Loading CSS chunk') ||
            error.message.includes('failed to load') ||
            error.message.includes('Failed to fetch dynamically imported module') ||
            error.stack?.includes('ChunkLoadError'); return {
                hasError: true,
                error,
                isChunkLoadError: errorIsChunkError || false
            };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.warn('ChunkErrorBoundary capturou um erro:', error);
        console.warn('Detalhes do erro:', errorInfo.componentStack);

        // Se for um erro de carregamento de chunk, podemos tentar recarregar a página após um atraso
        if (this.state.isChunkLoadError && typeof window !== 'undefined') {
            console.log('Detectado ChunkLoadError, tentando recuperação automática em 3 segundos...'); setTimeout(() => {
                // Verifica se ainda estamos na mesma página
                if (typeof document !== 'undefined') {
                    console.log('Recarregando a página para recuperar de ChunkLoadError...');
                    window.location.reload();
                }
            }, 3000);
        }
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Se temos um fallback personalizado, usamos
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Fallback padrão
            return (
                <div className="p-4 bg-gray-100 rounded-md">
                    <p className="font-medium text-red-600 mb-2">
                        {this.state.isChunkLoadError
                            ? 'Houve um problema ao carregar alguns recursos da página.'
                            : 'Ocorreu um erro inesperado.'}
                    </p>
                    {this.state.isChunkLoadError && (
                        <p className="text-sm text-gray-600">
                            Tentando recuperação automática... Se a página não carregar em alguns segundos,
                            por favor <button
                                onClick={() => window.location.reload()}
                                className="text-blue-500 underline"
                            >
                                clique aqui para recarregar
                            </button>.
                        </p>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ChunkErrorBoundary;
