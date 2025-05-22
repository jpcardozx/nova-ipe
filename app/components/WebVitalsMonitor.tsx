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

            try {
                // Garantir que o objeto está sendo serializado corretamente
                const body = JSON.stringify(metric);

                // Usar fetch para garantir o controle sobre o envio
                fetch('/api/vitals', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body,
                    // Garante que a requisição será completada mesmo se a página for fechada
                    keepalive: true
                }).catch(error => {
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('[WebVitals] Erro ao enviar métrica:', error);
                    }
                });

                // Log em desenvolvimento
                if (process.env.NODE_ENV === 'development') {
                    console.log(`[WebVitals] ${name}:`, value);
                }
            } catch (error) {
                console.error('[WebVitals] Erro ao processar métrica:', error);
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