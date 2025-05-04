// @components/LoadingState.jsx
import React from 'react';

/**
 * Componente de estado de carregamento
 */
export function LoadingState() {
    return (
        <div className="space-y-8">
            <div className="h-10 w-2/3 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
            <div className="grid grid-cols-4 gap-4 h-10">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-full animate-pulse" />
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    );
}