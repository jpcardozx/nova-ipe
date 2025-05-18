'use client';

/**
 * LoadingStateController.tsx
 * 
 * Componente cliente para gerenciar os estados de carregamento do documento
 * Previne erros de hydration ao manipular atributos de loading apenas no cliente
 *
 * @version 1.0.0
 * @date 18/05/2025
 */

import { useEffect } from 'react';

export default function LoadingStateController() {
    useEffect(() => {
        // Impedir execução durante SSR
        if (typeof window === 'undefined') {
            return;
        }

        // Garante que isso só executa no cliente após a hydration estar completa
        const removeLoadingState = () => {
            if (document.documentElement) {
                document.documentElement.removeAttribute('data-loading-state');
                // Adiciona atributo data-hydrated para indicar que o cliente está hidratado
                document.documentElement.setAttribute('data-hydrated', 'true');
            }
        };

        // Remove o atributo após um curto delay para garantir que a hydration está completa
        // Este delay é importante para evitar erro de inconsistência de hidratação
        const timer = setTimeout(removeLoadingState, 5);

        // Também registra para eventos de carregamento
        window.addEventListener('load', removeLoadingState);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('load', removeLoadingState);
        };
    }, []);

    return null; // Componente não renderiza nada visualmente
}
