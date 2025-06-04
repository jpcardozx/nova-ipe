'use client';

import React from 'react';

interface ErrorFallbackProps {
    error?: Error;
    resetError?: () => void;
    componentName?: string;
}

export function ErrorFallback({ error, resetError, componentName = "Component" }: ErrorFallbackProps) {
    return (
        <div className="min-h-[200px] bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">
                Erro ao carregar {componentName}
            </div>
            <div className="text-red-500 text-sm mb-4">
                {error?.message || 'Erro interno do sistema'}
            </div>
            {resetError && (
                <button
                    onClick={resetError}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Tentar novamente
                </button>
            )}
        </div>
    );
}

export function LoadingFallback({ message = "Carregando..." }: { message?: string }) {
    return (
        <div className="min-h-[200px] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-amber-800 text-lg font-medium">{message}</div>
        </div>
    );
}

export function HeroLoadingFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-900/90 via-orange-800/80 to-yellow-700/70 animate-pulse flex items-center justify-center">
            <div className="text-white text-xl font-medium">Carregando página inicial...</div>
        </div>
    );
}

export function PropertyLoadingFallback() {
    return (
        <div className="min-h-[400px] bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-amber-800 text-lg font-medium">Carregando propriedades...</div>
        </div>
    );
}
