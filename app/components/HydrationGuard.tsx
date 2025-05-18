'use client';

/**
 * HydrationGuard.tsx
 * 
 * Componente que previne erros de hydration relacionados a atributos que
 * precisam ser diferentes entre o servidor e o cliente.
 * 
 * @version 1.0.0
 * @date 18/05/2025
 */

import { useEffect } from 'react';

interface HydrationGuardProps {
    initialAttributes?: Record<string, string>;
    onHydrated?: () => void;
}

export default function HydrationGuard({
    initialAttributes = {},
    onHydrated
}: HydrationGuardProps) {

    useEffect(() => {
        // Aguarda até o próximo tick para garantir que a hydration foi concluída
        const timer = setTimeout(() => {
            if (typeof window !== 'undefined' && document.documentElement) {
                // Remove qualquer atributo data-* que precise ser diferente entre servidor e cliente
                document.documentElement.removeAttribute('data-loading-state');

                // Aplicar quaisquer novos atributos necessários
                if (initialAttributes) {
                    Object.entries(initialAttributes).forEach(([key, value]) => {
                        document.documentElement.setAttribute(key, value);
                    });
                }

                if (onHydrated) {
                    onHydrated();
                }
            }
        }, 10); // Pequeno delay para garantir que a hydration terminou

        return () => clearTimeout(timer);
    }, [initialAttributes, onHydrated]);

    // Este componente não renderiza nada
    return null;
}
