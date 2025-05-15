'use client';

import React from 'react';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center space-y-6">
                <div className="relative w-24 h-24">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                </div>

                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-medium text-gray-800">Carregando Ipê Imobiliária</h3>
                    <p className="text-sm text-gray-500">Preparando os melhores imóveis de Guararema para você</p>
                </div>
            </div>
        </div>
    );
}
