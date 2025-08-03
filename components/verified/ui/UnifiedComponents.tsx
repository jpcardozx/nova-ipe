'use client';

import React from 'react';

export const UnifiedLoading: React.FC<{ className?: string; height?: string; title?: string }> = ({
    className = '',
    height = 'auto',
    title = 'Carregando...'
}) => {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={{ height }}>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            {title && <div className="text-sm text-gray-500 mt-2">{title}</div>}
        </div>
    );
};

export default UnifiedLoading;
