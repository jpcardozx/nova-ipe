'use client';

import React from 'react';

export const UnifiedLoading = ({ height = "300px", title = "Carregando..." }) => {
    return (
        <div
            style={{ height: height }}
            className="w-full flex items-center justify-center flex-col"
        >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800 mb-4"></div>
            <p className="text-gray-600 font-medium">{title}</p>
        </div>
    );
};
