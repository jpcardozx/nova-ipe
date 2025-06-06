import React, { Component, ErrorInfo, ReactNode } from 'react';
'use client';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    resetOnPropsChange?: boolean;
    resetKeys?: Array<string | number>;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Componente Error Boundary melhorado com opções de recuperação
 * e logging de erros para analytics
 */
export class ErrorBoundary extends Component<Props, State> {
    private resetTimeoutId: number | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // Log do erro para analytics
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Callback personalizado para logging
        this.props.onError?.(error, errorInfo);

        // Tentar reportar para serviço de analytics se disponível
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'exception', {
                description: error.toString(),
                fatal: false
            });
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { resetKeys, resetOnPropsChange } = this.props;
        const { hasError } = this.state;

        if (hasError && prevProps.resetKeys !== resetKeys) {
            if (resetKeys?.some((resetKey, idx) =>
                prevProps.resetKeys?.[idx] !== resetKey
            )) {
                this.resetErrorBoundary();
            }
        }

        if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
            this.resetErrorBoundary();
        }
    }

    resetErrorBoundary = () => {
        if (this.resetTimeoutId) {
            clearTimeout(this.resetTimeoutId);
        }

        this.resetTimeoutId = window.setTimeout(() => {
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null
            });
        }, 100);
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-8">
                    <div className="text-center max-w-md">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-red-800 mb-2">
                            Oops! Algo deu errado
                        </h2>
                        <p className="text-red-600 mb-6">
                            Ocorreu um erro inesperado. Nossa equipe foi notificada e já está trabalhando para resolver.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={this.resetErrorBoundary}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                Tentar Novamente
                            </button>

                            <button
                                onClick={() => window.location.reload()}
                                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                Recarregar Página
                            </button>
                        </div>

                        {process.env['NODE_ENV'] === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-red-700 font-medium">
                                    Detalhes do Erro (desenvolvimento)
                                </summary>
                                <pre className="mt-2 p-3 bg-red-100 rounded text-xs text-red-800 overflow-auto">
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

// Hook para usar error boundary de forma declarativa
export function useErrorHandler() {
    return (error: Error, errorInfo?: ErrorInfo) => {
        console.error('Error caught by useErrorHandler:', error, errorInfo);

        // Reportar para analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'exception', {
                description: error.toString(),
                fatal: false
            });
        }
    };
}

// Componente wrapper para facilitar o uso
interface SafeComponentProps {
    children: ReactNode;
    fallback?: ReactNode;
    className?: string;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export function SafeComponent({ children, fallback, className, onError }: SafeComponentProps) {
    // Função que captura erros para logging
    const handleError = (error: Error, errorInfo: ErrorInfo) => {
        console.error('SafeComponent caught an error:', error);
        // Envia para serviço de analytics se disponível
        if (typeof window !== 'undefined') {
            if ((window as any).gtag) {
                (window as any).gtag('event', 'exception', {
                    description: error.toString(),
                    fatal: false
                });
            }

            if ((window as any).Sentry?.captureException) {
                (window as any).Sentry.captureException(error);
            }
        }

        // Chama callback personalizado se fornecido
        if (onError) {
            onError(error, errorInfo);
        }
    };

    return (
        <ErrorBoundary
            onError={handleError}
            fallback={fallback || (
                <div className={`p-4 text-center text-gray-500 ${className || ''}`}>
                    <p>Conteúdo temporariamente indisponível</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Recarregar
                    </button>
                </div>
            )}
        >
            {children}
        </ErrorBoundary>
    );
}
