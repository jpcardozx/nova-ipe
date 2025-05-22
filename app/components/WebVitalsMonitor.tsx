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
import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

// Define interface for web vitals metric
interface WebVitalMetric {
    name: string;
    value: number;
    delta: number;
    id: string;
    page?: string;
    timestamp?: number;
}

/**
 * WebVitalsMonitor - Componente para monitorar e reportar métricas Web Vitals
 * 
 * Este componente é um wrapper que configura a coleta automática de métricas
 * e as envia para a API.
 */
export default function WebVitalsMonitor() {
    const pathname = usePathname();

    useEffect(() => {
        // Handler para enviar métricas para a API
        const reportWebVital = ({ name, delta, value, id }: Metric) => {
            const metric: WebVitalMetric = {
                name,
                delta,
                value,
                id,
                page: pathname || '/',
                timestamp: Date.now()
            };

            // Use sendBeacon se disponível para garantir que os dados são enviados
            const vitalsEndpoint = '/api/vitals';
            if ('sendBeacon' in navigator) {
                navigator.sendBeacon(vitalsEndpoint, JSON.stringify(metric));
            } else {
                fetch(vitalsEndpoint, {
                    method: 'POST',
                    body: JSON.stringify(metric),
                    headers: { 'Content-Type': 'application/json' },
                    keepalive: true // Garante envio mesmo se a página estiver fechando
                }).catch(console.error);
            }

            // Log em desenvolvimento
            if (process.env.NODE_ENV === 'development') {
                console.log(`[WebVitals] ${name}:`, value);
            }
        };

        // Registra handlers para todas as métricas principais
        onCLS(reportWebVital);
        onFCP(reportWebVital);
        onLCP(reportWebVital);
        onTTFB(reportWebVital);
        onINP(reportWebVital);

    }, [pathname]);

    // Componente não renderiza nada visualmente
    return null;
}