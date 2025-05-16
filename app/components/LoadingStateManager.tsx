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

                // Forçando repintura do DOM para garantir visibilidade
                document.body.style.opacity = '1';
                requestAnimationFrame(() => {
                    document.body.style.visibility = 'visible';
                });
            }
        };

        // Chamada imediata para casos onde o conteúdo já está carregado
        removeLoadingState();

        // Adiciona listener para quando a página estiver totalmente carregada
        window.addEventListener('load', removeLoadingState);
        window.addEventListener('DOMContentLoaded', removeLoadingState);

        // Múltiplos timeouts com intervalos progressivos para garantir que o estado mude
        const timeouts = [
            setTimeout(removeLoadingState, 800),
            setTimeout(removeLoadingState, 1500),
            setTimeout(removeLoadingState, 2500),
            setTimeout(() => {
                removeLoadingState();
                document.body.classList.add('force-visible');
            }, 3000)
        ];

        return () => {
            window.removeEventListener('load', removeLoadingState);
            window.removeEventListener('DOMContentLoaded', removeLoadingState);
            timeouts.forEach(clearTimeout);
        };
    }, []);

    return null;
}
