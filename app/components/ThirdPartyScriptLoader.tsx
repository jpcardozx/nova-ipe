'use client';

/**
 * ThirdPartyScriptLoader.tsx
 * 
 * Componente inteligente para carregamento otimizado de scripts de terceiros
 * Implementa técnicas avançadas para minimizar o impacto no tempo de carregamento
 * e métricas de performance como FCP, LCP e CLS.
 */

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export type ScriptPriority = 'critical' | 'high' | 'medium' | 'low';

export interface ThirdPartyScript {
    id: string;
    src: string;
    priority: ScriptPriority;
    async?: boolean;
    defer?: boolean;
    onLoad?: () => void;
    strategy?: 'afterInteractive' | 'lazyOnload' | 'worker';
    attributes?: Record<string, string>;
}

interface ThirdPartyScriptLoaderProps {
    scripts: ThirdPartyScript[];
    enabled?: boolean;
}

const LOADING_DELAYS: Record<ScriptPriority, number> = {
    critical: 0,
    high: 1000, // 1 second after critical layout is complete
    medium: 2500, // After LCP should have happened
    low: 5000, // After all important metrics should be stable
};

/**
 * Componente para carregamento otimizado de scripts de terceiros
 * Carrega scripts com diferentes estratégias baseadas na prioridade
 */
function ThirdPartyScriptLoader({
    scripts = [],
    enabled = true
}: ThirdPartyScriptLoaderProps) {
    const pathname = usePathname();
    const [initialPageLoad, setInitialPageLoad] = useState(true);

    useEffect(() => {
        if (!enabled) return;

        // Reset load flag on navigation
        if (!initialPageLoad) {
            setInitialPageLoad(true);
        }

        // Function to load script based on priority
        const loadScript = (script: ThirdPartyScript) => {
            // Check if script already loaded
            if (document.getElementById(script.id)) return;

            // Create script element
            const scriptElement = document.createElement('script');
            scriptElement.id = script.id;
            scriptElement.src = script.src;

            // Set attributes
            if (script.async !== false) scriptElement.async = true;
            if (script.defer) scriptElement.defer = true;

            // Add any additional attributes
            if (script.attributes) {
                Object.entries(script.attributes).forEach(([key, value]) => {
                    scriptElement.setAttribute(key, value);
                });
            }

            // Set onload handler
            if (script.onLoad) {
                scriptElement.onload = script.onLoad;
            }

            // Scripts loaded with "worker" strategy use Partytown if available
            if (script.strategy === 'worker') {
                scriptElement.setAttribute('type', 'text/partytown');
            }

            // Add to document
            document.body.appendChild(scriptElement);
        };

        // Create array to track timeout IDs for cleanup
        const timeoutIds: NodeJS.Timeout[] = [];

        // Group scripts by priority
        const scriptsByPriority: Record<ScriptPriority, ThirdPartyScript[]> = {
            critical: [],
            high: [],
            medium: [],
            low: [],
        };

        scripts.forEach(script => {
            scriptsByPriority[script.priority].push(script);
        });

        // Load critical scripts immediately
        scriptsByPriority.critical.forEach(loadScript);

        // Schedule loading of non-critical scripts
        Object.entries(scriptsByPriority).forEach(([priority, priorityScripts]) => {
            if (priority === 'critical') return; // Already loaded

            const delay = LOADING_DELAYS[priority as ScriptPriority];

            const timeoutId = setTimeout(() => {
                // Check if browser is idle first for better performance
                if ('requestIdleCallback' in window) {
                    (window as any).requestIdleCallback(() => {
                        priorityScripts.forEach(loadScript);
                    }, { timeout: 1000 });
                } else {
                    priorityScripts.forEach(loadScript);
                }
            }, delay);

            timeoutIds.push(timeoutId);
        });

        // Clean up on unmount or route change
        return () => {
            timeoutIds.forEach(clearTimeout);
        };
    }, [pathname, scripts, enabled, initialPageLoad]);

    // Component doesn't render anything visually
    return null;
}

// Export for use in other components
export const defaultScripts: ThirdPartyScript[] = [
    {
        id: 'google-analytics',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX',
        priority: 'medium',
        async: true,
        strategy: 'lazyOnload',
    },
    {
        id: 'facebook-pixel',
        src: 'https://connect.facebook.net/en_US/fbevents.js',
        priority: 'low',
        strategy: 'worker',
    },
    {
        id: 'hotjar',
        src: 'https://static.hotjar.com/c/hotjar-XXXXXXX.js?sv=6',
        priority: 'low',
        strategy: 'lazyOnload',
    }
];

// Export the component
export { ThirdPartyScriptLoader };
export default ThirdPartyScriptLoader;
