'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class HydrationErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log hydration errors specifically
        if (error.message.includes('hydration') || error.message.includes('Hydration')) {
            console.error('Hydration Error Boundary caught:', error, errorInfo);
        }

        this.props.onError?.(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback || (
                <div className="hydration-error-fallback p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h2 className="text-red-800 font-semibold mb-2">Something went wrong</h2>
                    <p className="text-red-600 text-sm">
                        There was an error loading this component. Please refresh the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default HydrationErrorBoundary;
