'use client';

import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
    isHydrationError: boolean;
}

class HydrationErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            isHydrationError: false
        };
    }

    static getDerivedStateFromError(error: Error): State {
        const isHydrationError = error.message.includes('hydration') ||
            error.message.includes('Hydration') ||
            error.message.includes('did not match');

        return {
            hasError: true,
            error,
            isHydrationError
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Handle hydration errors differently
        if (this.state.isHydrationError) {
            console.warn('Hydration mismatch detected - attempting recovery...');
            // Force a client-side only render after a brief delay
            setTimeout(() => {
                this.setState({ hasError: false });
            }, 100);
        } else {
            console.error('Error caught by boundary:', error, errorInfo);
        }

        this.props.onError?.(error, errorInfo);
    }

    private handleRefresh = () => {
        // Clear any cached data that might be causing hydration issues
        if (typeof window !== 'undefined') {
            // Clear specific caches that might cause hydration mismatches
            window.sessionStorage.clear();
            // Reload with a clean slate
            window.location.reload();
        }
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="hydration-error-fallback p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h2 className="text-red-800 font-semibold mb-2">
                        {this.state.isHydrationError ?
                            'Erro de Sincronização' :
                            'Algo deu errado'}
                    </h2>
                    <p className="text-red-600 text-sm">
                        {this.state.isHydrationError ?
                            'Houve um erro de sincronização. Tentando recuperar automaticamente...' :
                            'Ocorreu um erro ao carregar este componente. Por favor, recarregue a página.'}
                    </p>
                    <button
                        onClick={this.handleRefresh}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                        Recarregar Página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default HydrationErrorBoundary;
