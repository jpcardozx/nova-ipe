'use client';

import React from 'react';

/**
 * Componente de acessibilidade que permite usuários de teclado 
 * pularem diretamente para o conteúdo principal da página
 */
export default function SkipToContent() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-white focus:p-4 focus:shadow-md focus:text-amber-600 focus:font-medium focus:rounded-md"
        >
            Pular para o conteúdo principal
        </a>
    );
}
