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
import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from 'web-vitals';

// Tipos para as métricas
type WebVitalName = 'CLS' | 'INP' | 'LCP' | 'FCP' | 'TTFB';
type MetricReport = { name: string; value: number; path: string };

const WebVitalsMonitor = () => {
    useEffect(() => {
        // Handler para métricas coletadas
        const reportWebVital = ({ name, value, id }: Metric) => {            // Define limites para métricas
            const thresholds = {
                CLS: { good: 0.1, needsImprovement: 0.25 },
                LCP: { good: 2500, needsImprovement: 4000 },
                INP: { good: 200, needsImprovement: 500 }, // INP substituiu FID nas métricas Core Web Vitals
                FCP: { good: 1800, needsImprovement: 3000 },
                TTFB: { good: 800, needsImprovement: 1800 },
            };

            const metric = name as WebVitalName;
            const threshold = thresholds[metric];

            // Determina status da métrica
            let status = 'good';
            if (threshold) {
                if (value > threshold.needsImprovement) {
                    status = 'poor';
                } else if (value > threshold.good) {
                    status = 'needs-improvement';
                }
            }

            // Constrói relatório da métrica
            const report: MetricReport = {
                name: name,
                value: Math.round(value),
                path: window.location.pathname,
            };

            // Envia para análise e console para debug
            console.log(`[WebVital] ${name}: ${Math.round(value)} (${status})`);

            // Analytics usando sendBeacon para não bloquear
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify({
                    metricName: name,
                    metricValue: value,
                    status: status,
                    path: window.location.pathname
                })], { type: 'application/json' });

                navigator.sendBeacon('/api/vitals', blob);
            }
        };        // Registra as métricas principais
        onFCP(reportWebVital);
        onLCP(reportWebVital);
        onCLS(reportWebVital);
        onINP(reportWebVital);
        onTTFB(reportWebVital);

    }, []);

    return null; // Componente não renderiza visualmente
};

export default WebVitalsMonitor;
