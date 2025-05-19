/**
 * WebVitalsMonitor.tsx
 * 
 * Componente para monitoramento de Web Vitals usando Next.js
 * Ajuda a rastrear e registrar métricas críticas de performance
 *
 * @version 1.1.0
 * @date 18/05/2025
 */

'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { usePathname } from 'next/navigation';

// Define interface to represent web vitals metric
interface WebVitalMetric {
    name: string;
    value: number;
    delta: number;
    id: string;
    entries: any[];
}

/**
 * WebVitalsMonitor - Componente para monitorar e reportar métricas Web Vitals
 * 
 * Este componente coleta e envia métricas de Core Web Vitals para uma API
 * de análise sem bloquear o thread principal. Importante para monitorar
 * o desempenho real da aplicação em produção.
 */
export default function WebVitalsMonitor() {
    const pathname = usePathname();

    useEffect(() => {
        // Não monitore em desenvolvimento para evitar dados distorcidos
        if (process.env.NODE_ENV === 'development') {
            return;
        }

        // Handler para processar e reportar métricas
        const reportWebVital = (metric: WebVitalMetric) => {
            const { name, value, delta, id } = metric;

            // Categoriza a métrica
            let status: 'good' | 'needs-improvement' | 'poor' = 'good';

            // Aplica os limites do Core Web Vitals para categorização
            if (name === 'CLS') {
                status = value > 0.25 ? 'poor' : value > 0.1 ? 'needs-improvement' : 'good';
            } else if (name === 'LCP') {
                status = value > 4000 ? 'poor' : value > 2500 ? 'needs-improvement' : 'good';
            } else if (name === 'FID' || name === 'INP') {
                status = value > 300 ? 'poor' : value > 100 ? 'needs-improvement' : 'good';
            } else if (name === 'FCP') {
                status = value > 3000 ? 'poor' : value > 1800 ? 'needs-improvement' : 'good';
            } else if (name === 'TTFB') {
                status = value > 1800 ? 'poor' : value > 800 ? 'needs-improvement' : 'good';
            }

            // Envia para análise e console para debug
            console.log(`[WebVital] ${name}: ${Math.round(value)} (${status})`);

            // Analytics usando sendBeacon para não bloquear
            if ('sendBeacon' in navigator) {
                const blob = new Blob([JSON.stringify({
                    metricName: name,
                    metricValue: value,
                    status: status,
                    path: pathname || window.location.pathname
                })], { type: 'application/json' });

                (navigator as any).sendBeacon('/api/vitals', blob);
            }
        };

        // Registra as métricas principais
        onFCP(reportWebVital);
        onLCP(reportWebVital);
        onCLS(reportWebVital);
        onINP(reportWebVital);
        onTTFB(reportWebVital);

    }, [pathname]);

    // Este componente não renderiza nada visível
    return null;
}
