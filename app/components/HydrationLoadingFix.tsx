'use client';

import { useEffect, useState } from 'react';

/**
 * HydrationLoadingFix
 * 
 * This component safely handles the page visibility after hydration
 * to avoid hydration mismatches between server and client rendering.
 * It uses React's lifecycle to ensure visibility changes happen
 * only after hydration is complete.
 */
export default function HydrationLoadingFix() {
    const [mounted, setMounted] = useState(false); useEffect(() => {
        // Prevenir execução durante SSR
        if (typeof window === 'undefined') {
            return;
        }

        // This runs after hydration is complete
        setMounted(true);

        // Usar um único setTimeout para evitar múltiplos eventos
        const timer = setTimeout(() => {
            try {
                // Esperar até que o evento de hidratação termine
                document.documentElement.setAttribute('data-hydrated', 'true');

                // Log apenas em desenvolvimento
                if (process.env.NODE_ENV !== 'production') {
                    console.debug('Hydration complete - visibility handling active');
                }
            } catch (error) {
                console.error('Error in hydration fix:', error);
            }
        }, 0); // Executado no próximo tick após hidratação

        return () => clearTimeout(timer);
    }, []);

    // The component doesn't render anything visible
    return null;
}
