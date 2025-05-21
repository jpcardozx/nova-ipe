'use client';

/**
 * LucidePreloader
 * 
 * Este componente precarrega módulos do lucide-react que causaram ChunkLoadError
 * para garantir que estejam disponíveis antes de serem necessários.
 * 
 * Como o lucide-react é carregado dinamicamente em vários componentes,
 * precarregar os módulos mais usados ajuda a evitar ChunkLoadError.
 */

import { useEffect } from 'react';

export default function LucidePreloader() {
    useEffect(() => {
        // Lista de ícones comumente usados que devem ser pré-carregados
        // para evitar ChunkLoadError durante carregamentos dinâmicos
        const commonIcons = [
            'Home',
            'Menu',
            'Search',
            'User',
            'Settings',
            'ChevronRight',
            'ChevronLeft',
            'ChevronDown',
            'ChevronUp',
            'X',
            'Check',
            'Info',
            'AlertCircle',
            'Bell',
            'Mail',
            'Phone',
            'Calendar',
            'Clock',
            'Map',
            'MapPin',
        ];

        // Função para precarregar ícones em segundo plano
        const preloadIcons = async () => {
            try {
                // Precarregar módulo principal do lucide-react
                await import('lucide-react');

                // Precarregar ícones individuais em paralelo
                // Usamos Promise.allSettled para garantir que falhas individuais
                // não impeçam o carregamento dos outros ícones
                const preloadPromises = commonIcons.map(async (iconName) => {
                    try {
                        // Use correct PascalCase import from lucide-react
                        await import('lucide-react').then(mod => {
                            if (!mod[iconName]) throw new Error(`Icon ${iconName} not found in lucide-react`);
                            return mod[iconName];
                        });
                        return { icon: iconName, status: 'loaded' };
                    } catch (err: unknown) {
                        const errorMessage = err instanceof Error ? err.message : String(err);
                        console.warn(`Falha ao precarregar ícone ${iconName}:`, errorMessage);
                        return { icon: iconName, status: 'failed', error: errorMessage };
                    }
                });

                // Aguardamos o resultado de todos
                await Promise.allSettled(preloadPromises);
            } catch (err: unknown) {
                // Não precisamos fazer nada se falhar, é apenas uma otimização
                console.warn('Falha no precarregamento de ícones lucide-react:', err);
            }
        };

        // Iniciamos o precarregamento após um curto atraso para priorizar
        // o carregamento de conteúdo crítico primeiro
        const timer = setTimeout(() => {
            // Executando em requestIdleCallback (quando disponível) para
            // garantir que não impactará a performance da página
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => preloadIcons(), { timeout: 2000 });
            } else {
                preloadIcons();
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Este componente não renderiza nada visualmente
    return null;
}
