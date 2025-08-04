'use client';

import { useEffect, useState, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

interface SafeHydrationBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * SafeHydrationBoundary - Componente que previne erros de hidratação
 * 
 * Este componente garante que a renderização seja consistente entre
 * servidor e cliente, evitando conflitos de atributos e estilos.
 */
export default function SafeHydrationBoundary({
    children,
    fallback = null
}: SafeHydrationBoundaryProps) {
    const [isHydrated, setIsHydrated] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Garante que a hidratação aconteça de forma segura
    useIsomorphicLayoutEffect(() => {
        // Marca como hidratado apenas no cliente
        setIsHydrated(true);

        // Remove atributos problemáticos que podem causar conflitos
        const cleanupAttributes = () => {
            if (containerRef.current) {
                const elementsWithSSRAttributes = containerRef.current.querySelectorAll(
                    '[data-ssr-styled], [data-server-rendered], [data-reactroot]'
                );

                elementsWithSSRAttributes.forEach(element => {
                    element.removeAttribute('data-ssr-styled');
                    element.removeAttribute('data-server-rendered');
                    element.removeAttribute('data-reactroot');
                });
            }
        };

        // Aguarda um frame para garantir que a hidratação foi concluída
        const timer = requestAnimationFrame(() => {
            cleanupAttributes();
        });

        return () => {
            cancelAnimationFrame(timer);
        };
    }, []);

    // Durante SSR ou antes da hidratação, renderiza o fallback ou version simplificada
    if (!isHydrated) {
        return (
            <div ref={containerRef} suppressHydrationWarning>
                {fallback || children}
            </div>
        );
    }

    // Após hidratação, renderiza o conteúdo completo
    return (
        <div ref={containerRef}>
            {children}
        </div>
    );
}
