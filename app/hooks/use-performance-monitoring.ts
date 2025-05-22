'use client';

import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
    lcp: number | null;
    fcp: number | null;
    cls: number | null;
    fid: number | null;
    ttfb: number | null;
    loadTime: number | null;
}

interface ResourceTiming {
    name: string;
    duration: number;
    size: number;
    startTime: number;
}

export function usePerformanceMonitoring(enabled = true) {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        lcp: null,
        fcp: null,
        cls: null,
        fid: null,
        ttfb: null,
        loadTime: null
    });
    const [resources, setResources] = useState<ResourceTiming[]>([]);

    // Observa métricas de Web Vitals
    const observeWebVitals = useCallback(() => {
        if (!window.performance || !window.PerformanceObserver) {
            console.warn('Performance APIs não suportadas');
            return;
        }

        try {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) {
                    setMetrics(prev => ({
                        ...prev,
                        lcp: lastEntry.startTime
                    }));
                }
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

            // First Contentful Paint
            const fcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                if (entries.length > 0) {
                    setMetrics(prev => ({
                        ...prev,
                        fcp: entries[0].startTime
                    }));
                }
            });
            fcpObserver.observe({ type: 'paint', buffered: true });

            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                list.getEntries().forEach((entry: any) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                setMetrics(prev => ({
                    ...prev,
                    cls: clsValue
                }));
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                if (entries.length > 0) {
                    setMetrics(prev => ({
                        ...prev,
                        fid: (entries[0] as any).processingStart - entries[0].startTime
                    }));
                }
            });
            fidObserver.observe({ type: 'first-input', buffered: true });

            // Navigation timing
            const navObserver = new PerformanceObserver((list) => {
                const entry = list.getEntries()[0] as PerformanceNavigationTiming;
                setMetrics(prev => ({
                    ...prev,
                    ttfb: entry.responseStart - entry.requestStart,
                    loadTime: entry.loadEventEnd - entry.fetchStart
                }));
            });
            navObserver.observe({ type: 'navigation', buffered: true });

            // Resource timing
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries() as PerformanceResourceTiming[];
                const newResources = entries.map(entry => ({
                    name: entry.name,
                    duration: entry.duration,
                    size: entry.encodedBodySize,
                    startTime: entry.startTime
                }));
                setResources(prev => [...prev, ...newResources]);
            });
            resourceObserver.observe({ type: 'resource', buffered: true });

            return () => {
                lcpObserver.disconnect();
                fcpObserver.disconnect();
                clsObserver.disconnect();
                fidObserver.disconnect();
                navObserver.disconnect();
                resourceObserver.disconnect();
            };
        } catch (error) {
            console.error('Erro ao configurar observadores de performance:', error);
        }
    }, []);

    // Inicializa monitoramento quando componente monta
    useEffect(() => {
        if (!enabled) return;

        const cleanup = observeWebVitals();
        return () => {
            cleanup?.();
        };
    }, [enabled, observeWebVitals]);

    // Retorna métricas coletadas
    return {
        metrics,
        resources: resources.sort((a, b) => b.duration - a.duration),
        hasData: Object.values(metrics).some(value => value !== null)
    };
}
