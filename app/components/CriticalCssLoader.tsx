'use client';

import { useEffect } from 'react';

/**
 * CriticalCssLoader - Este componente injeta CSS crítico diretamente no head para melhorar o LCP
 * 
 * A técnica de injeção de CSS crítico reduz drasticamente o LCP (Largest Contentful Paint)
 * e o bloqueio de renderização, endereçando diretamente os problemas de performance
 * identificados (78056ms LCP / 57778ms bloqueio da thread principal).
 */
export function CriticalCssLoader({ pageName }: { pageName: 'property' | 'home' | 'detail' }) {
    useEffect(() => {
        // Injeta o CSS crítico específico para o tipo de página
        const cssFile = pageName === 'property'
            ? '/critical-property-styles.css'
            : pageName === 'detail'
                ? '/critical-detail-styles.css'
                : '/critical-home-styles.css';

        // Verifica se já existe um link para esse CSS crítico
        const existingLink = document.querySelector(`link[href="${cssFile}"]`);

        if (!existingLink) {
            // Cria e injeta o link no head com alta prioridade
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssFile;
            link.setAttribute('importance', 'high'); // Aumenta a prioridade do carregamento
            link.setAttribute('fetchpriority', 'high');
            link.setAttribute('data-critical', 'true');

            document.head.appendChild(link);

            // Define um atributo no HTML para aplicar otimizações específicas
            document.documentElement.setAttribute('data-critical-css', pageName);
        }

        // Cleanup ao desmontar
        return () => {
            document.documentElement.removeAttribute('data-critical-css');
        };
    }, [pageName]);

    return null; // Este componente não renderiza nada visualmente
}
