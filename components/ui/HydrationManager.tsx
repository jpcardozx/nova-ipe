'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

interface HydrationManagerProps {
    children: React.ReactNode;
}

/**
 * HydrationManager v2
 * 
 * Versão corrigida que evita conflitos de hidratação causados por
 * atributos divergentes entre servidor e cliente.
 */
export default function HydrationManager({ children }: HydrationManagerProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    // Só executa no cliente após hidratação
    useIsomorphicLayoutEffect(() => {
        if (!rootRef.current) return;

        // Previne flash de conteúdo não estilizado
        const preventFOUC = () => {
            const styleElement = document.createElement('style');
            styleElement.id = 'hydration-fouc-prevention';
            styleElement.textContent = `
                .hydration-safe { opacity: 0; transition: opacity 0.1s ease-in; }
                .hydration-complete .hydration-safe { opacity: 1; }
            `;
            document.head.appendChild(styleElement);
        };

        preventFOUC();

        // Marca como hidratado
        const timer = requestAnimationFrame(() => {
            if (rootRef.current) {
                setIsHydrated(true);
                rootRef.current.classList.add('hydration-complete');

                // Cleanup preventivo de atributos problemáticos
                const cleanup = () => {
                    const problematicElements = document.querySelectorAll(
                        '[data-ssr-styled], [data-server-rendered], [data-reactroot]'
                    );

                    problematicElements.forEach(element => {
                        element.removeAttribute('data-ssr-styled');
                        element.removeAttribute('data-server-rendered');
                        element.removeAttribute('data-reactroot');
                    });
                };

                // Executa cleanup após hidratação
                setTimeout(cleanup, 50);

                // Remove estilo preventivo após transição
                setTimeout(() => {
                    const style = document.getElementById('hydration-fouc-prevention');
                    if (style) style.remove();
                }, 200);
            }
        });

        return () => {
            cancelAnimationFrame(timer);
        };
    }, []);

    return (
        <div
            id="hydration-sync-root"
            ref={rootRef}
            className={isHydrated ? "hydration-complete" : "hydration-pending"}
            suppressHydrationWarning
        >
            {children}
        </div>
    );
}
