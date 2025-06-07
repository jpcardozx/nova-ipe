'use client';

import React from 'react';

// Componente de loading unificado que substitui todos os loaders anteriores
export const UnifiedLoading = ({
    height = "200px",
    title = "Carregando...",
    className = "",
    variant = "default"
}: {
    height?: string;
    title?: string;
    className?: string;
    variant?: string;
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center w-full ${className}`}
            style={{ height }}
        >
            <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            {title && <p className="mt-4 text-gray-500">{title}</p>}
        </div>
    );
};