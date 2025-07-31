'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="min-h-[200px] flex items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-red-800 mb-2">
                            Algo deu errado
                        </h2>
                        <p className="text-red-600 text-sm">
                            Por favor, recarregue a página ou tente novamente.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export { ErrorBoundary };
export default ErrorBoundary;