'use client';

import { useEffect, useState, useCallback } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

const vitalsUrl = '/api/vitals';

// Cache para evitar reportar a mesma métrica múltiplas vezes
const reportedMetrics = new Set<string>();

/**
 * Envia os dados de Web Vitals para o endpoint de análise de forma otimizada
 */
const sendToAnalytics = (metric: Metric) => {
    // Evita duplicação de métricas
    const metricKey = `${metric.name}-${metric.id}`;
    if (reportedMetrics.has(metricKey)) return;
    reportedMetrics.add(metricKey);

    const body = {
        name: metric.name,
        delta: metric.delta,
        value: metric.value,
        id: metric.id,
        page: window.location.pathname,
        timestamp: Date.now(),
    };

    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        console.log(`[WebVitals] ${metric.name} = ${Math.round(metric.value)}`);
    }

    // Usa sendBeacon para métricas não críticas e fetch para críticas
    const isCriticalMetric = metric.name === 'LCP' || metric.name === 'FCP';
    if (!isCriticalMetric && 'sendBeacon' in navigator) {
        navigator.sendBeacon(vitalsUrl, JSON.stringify(body));
    } else {
        fetch(vitalsUrl, {
            body: JSON.stringify(body),
            method: 'POST',
            keepalive: true,
            headers: { 'Content-Type': 'application/json' },
        }).catch(() => {
            // Fallback para sendBeacon em caso de erro
            if ('sendBeacon' in navigator) {
                navigator.sendBeacon(vitalsUrl, JSON.stringify(body));
            }
        });
    }
};

/**
 * Componente para rastrear Web Vitals
 * Carrega e configura o rastreamento de métricas de performance
 */
export function WebVitals() {
    const [isEnabled] = useState(true);

    const registerVitals = useCallback(() => {
        try {
            // Registra primeiro as métricas mais importantes
            onLCP((metric) => {
                // Report LCP immediately
                sendToAnalytics(metric);
            });

            // Delay non-critical metrics
            setTimeout(() => {
                // FCP é importante mas pode esperar um pouco
                onFCP(sendToAnalytics);

                // TTFB já aconteceu, então podemos coletar
                onTTFB(sendToAnalytics);

                // Métricas de interação podem esperar mais
                setTimeout(() => {
                    onCLS(sendToAnalytics);
                    onINP(sendToAnalytics);
                }, 300);
            }, 100);
        } catch (error) {
            console.warn('Error registering Web Vitals:', error);
        }
    }, []);

    useEffect(() => {
        if (!isEnabled) return;

        // Usa requestIdleCallback para registrar métricas em tempo ocioso
        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(registerVitals, { timeout: 1000 });
        } else {
            // Fallback para setTimeout com prioridade baixa
            setTimeout(registerVitals, 200);
        }

        // Limpa cache de métricas ao desmontar
        return () => {
            reportedMetrics.clear();
        };
    }, [isEnabled, registerVitals]);

    // Componente não renderiza nada
    return null;
}

export default WebVitals;
