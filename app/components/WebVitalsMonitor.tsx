'use client';

/**
 * WebVitalsMonitor.tsx
 * 
 * Componente para monitoramento de Web Vitals usando Next.js
 *
 * @version 1.0.0
 * @date 21/05/2025
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Define interface for web vitals metric
interface WebVitalMetric {
    name: string;
    value: number;
    delta: number;
    id: string;
}

/**
 * WebVitalsMonitor - Componente para monitorar e reportar métricas Web Vitals
 * 
 * Este componente é um wrapper simples que não renderiza nada visível.
 * Em produção, você pode conectá-lo a analytics reais.
 */
export default function WebVitalsMonitor() {
    const pathname = usePathname();

    useEffect(() => {
        // Não monitore em desenvolvimento para evitar dados distorcidos
        if (process.env.NODE_ENV !== 'production') {
            return;
        }

        // Em uma implementação real, você importaria e usaria:
        // import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
        // e registraria handlers para cada métrica

        console.log('[WebVitalsMonitor] Inicializado para:', pathname);

        // Cleanup
        return () => {
            console.log('[WebVitalsMonitor] Desconectado');
        };
    }, [pathname]);

    // Este componente não renderiza nada visível
    return null;
}