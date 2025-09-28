'use client';

import { useEffect, useState, useCallback } from 'react';

// Simple Metric interface to replace web-vitals import
interface Metric {
    name: string;
    value: number;
    delta: number;
    id: string;
}

const verifiedVitalsUrl = '/api/vitals';

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
        navigator.sendBeacon(verifiedVitalsUrl, JSON.stringify(body));
    } else {
        fetch(verifiedVitalsUrl, {
            body: JSON.stringify(body),
            method: 'POST',
            keepalive: true,
            headers: { 'Content-Type': 'application/json' },
        }).catch(() => {
            // Fallback para sendBeacon em caso de erro
            if ('sendBeacon' in navigator) {
                navigator.sendBeacon(verifiedVitalsUrl, JSON.stringify(body));
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
            // Simple performance observation without web-vitals library
            if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
                return;
            }

            // LCP (Largest Contentful Paint)
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                sendToAnalytics({ 
                    name: 'LCP', 
                    value: lastEntry.startTime, 
                    delta: lastEntry.startTime,
                    id: Math.random().toString(36).substr(2, 9)
                });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // FCP (First Contentful Paint)  
            const fcpObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        sendToAnalytics({ 
                            name: 'FCP', 
                            value: entry.startTime, 
                            delta: entry.startTime,
                            id: Math.random().toString(36).substr(2, 9)
                        });
                    }
                }
            });
            fcpObserver.observe({ entryTypes: ['paint'] });

            // CLS (Cumulative Layout Shift)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!(entry as any).hadRecentInput) {
                        clsValue += (entry as any).value;
                    }
                }
                if (clsValue > 0) {
                    sendToAnalytics({ 
                        name: 'CLS', 
                        value: clsValue, 
                        delta: clsValue,
                        id: Math.random().toString(36).substr(2, 9)
                    });
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

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

