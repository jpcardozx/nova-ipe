'use client';

import React from 'react';

interface ChunkErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ChunkErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ChunkErrorBoundary extends React.Component<ChunkErrorBoundaryProps, ChunkErrorBoundaryState> {
    private retryTimeoutId: NodeJS.Timeout | null = null;

    constructor(props: ChunkErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ChunkErrorBoundaryState {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ChunkErrorBoundary caught an error:', error, errorInfo);

        // Auto-retry for chunk load errors
        if (this.isChunkLoadError(error)) {
            this.scheduleRetry();
        }
    }

    private isChunkLoadError = (error: Error): boolean => {
        return error.name === 'ChunkLoadError' ||
            error.message.includes('Loading chunk') ||
            error.message.includes('Loading CSS chunk') ||
            error.message.includes('ChunkLoadError');
    };

    private scheduleRetry = () => {
        if (this.retryTimeoutId) {
            clearTimeout(this.retryTimeoutId);
        }

        this.retryTimeoutId = setTimeout(() => {
            this.handleRetry();
        }, 1000);
    };

    private handleRetry = () => {
        if (this.state.error && this.isChunkLoadError(this.state.error)) {
            // Force reload for chunk errors
            window.location.reload();
        } else {
            // Soft retry for other errors
            this.setState({ hasError: false, error: undefined });
        }
    };

    componentWillUnmount() {
        if (this.retryTimeoutId) {
            clearTimeout(this.retryTimeoutId);
        }
    }

    render() {
        if (this.state.hasError) {
            const { fallback: Fallback } = this.props;

            if (Fallback && this.state.error) {
                return <Fallback error={this.state.error} retry={this.handleRetry} />;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Algo deu errado
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Ocorreu um erro inesperado. Tentaremos recarregar automaticamente.
                        </p>
                        <button
                            onClick={this.handleRetry}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ChunkErrorBoundary;
