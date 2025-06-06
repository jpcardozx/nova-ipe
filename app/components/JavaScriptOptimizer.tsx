/**
 * JavaScriptOptimizer.tsx
 * 
 * Componente para otimização de carregamento progressivo de JavaScript
 * Implementa técnicas de carregamento progressivo para melhorar FCP e LCP
 *
 * @version 1.0.0
 * @date 18/05/2025
 */

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface JSOptimizerProps {
    priority?: boolean; // Determina se carrega com maior prioridade
}

const JavaScriptOptimizer: React.FC<JSOptimizerProps> = ({ priority = false }) => {
    const pathname = usePathname();

    useEffect(() => {
        // Função para carregar scripts de terceiros não críticos
        const loadNonCriticalScripts = () => {
            // Pre-conectar com origens críticas
            const links = [
                { rel: 'preconnect', href: 'https://cdn.sanity.io' },
                { rel: 'dns-prefetch', href: 'https://cdn.sanity.io' },
            ];

            links.forEach(linkData => {
                const link = document.createElement('link');
                link.rel = linkData.rel;
                link.href = linkData.href;
                document.head.appendChild(link);
            });

            // Remover atributos de carregamento do HTML
            document.documentElement.removeAttribute('data-loading-state');
        };

        // Lógica para determinar quando executar a otimização
        if (priority) {
            // Em páginas prioritárias, carrega assim que a página está visível
            if (document.visibilityState === 'visible') {
                loadNonCriticalScripts();
            } else {
                document.addEventListener('visibilitychange', function onVisChange() {
                    if (document.visibilityState === 'visible') {
                        loadNonCriticalScripts();
                        document.removeEventListener('visibilitychange', onVisChange);
                    }
                });
            }
        } else {
            // Em páginas não-prioritárias, carrega quando o browser está ocioso
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(() => loadNonCriticalScripts(), { timeout: 2000 });
            } else {
                setTimeout(loadNonCriticalScripts, 1000);
            }
        }

        return () => {
            // Limpeza se necessário
        };
    }, [pathname, priority]);

    // Este componente não renderiza nada visualmente
    return null;
};

export default JavaScriptOptimizer;
