'use client';

import { useEffect } from 'react';

/**
 * Componente que remove o estado de carregamento do HTML
 * após a página carregar completamente
 */
export default function LoadingStateManager() {
    useEffect(() => {
        // Função para remover o estado de carregamento
        const removeLoadingState = () => {
            const htmlElement = document.documentElement;
            if (htmlElement) {
                htmlElement.removeAttribute('data-loading-state');
                htmlElement.setAttribute('data-loaded', 'true');
            }
        };

        // Chamada imediata para casos onde o conteúdo já está carregado
        removeLoadingState();

        // Adiciona listener para quando a página estiver totalmente carregada
        window.addEventListener('load', removeLoadingState);

        // Timeout de segurança para garantir que o estado mude mesmo se ocorrer algum problema
        const timeout = setTimeout(removeLoadingState, 3000);

        return () => {
            window.removeEventListener('load', removeLoadingState);
            clearTimeout(timeout);
        };
    }, []);

    return null;
}
