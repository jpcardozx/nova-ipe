'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export default class ChunkErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Detecta erros específicos de chunk loading
        const isChunkError = error.message?.includes('ChunkLoadError') ||
            error.message?.includes('Loading chunk') ||
            error.message?.includes('Failed to fetch');

        if (isChunkError) {
            console.warn('Chunk loading error detected, attempting recovery:', error.message);

            // Tentativa automática de recarregar a página para resolver chunk errors
            setTimeout(() => {
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
            }, 1000);
        }

        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ChunkErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // Log específico para chunk errors
        if (error.message?.includes('ChunkLoadError') ||
            error.message?.includes('Loading chunk')) {
            console.warn('Chunk loading failed. This usually happens after deployments. Reloading...');
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleReload = () => {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // UI de erro personalizada
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>

                        <h1 className="text-xl font-semibold text-gray-900 mb-2">
                            Ops! Algo deu errado
                        </h1>

                        <p className="text-gray-600 mb-6">
                            {this.state.error?.message?.includes('ChunkLoadError') ||
                                this.state.error?.message?.includes('Loading chunk')
                                ? 'A aplicação foi atualizada. Vamos recarregar para você.'
                                : 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReload}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Recarregar Página
                            </button>

                            <button
                                onClick={this.handleRetry}
                                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Tentar Novamente
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-4 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                    Detalhes do erro (desenvolvimento)
                                </summary>
                                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
