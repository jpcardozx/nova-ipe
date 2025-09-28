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
    page?: string;
    timestamp?: number;
}

// Simple Metric interface to replace web-vitals import
interface Metric {
    name: string;
    value: number;
    delta: number;
    id: string;
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

        // Simple performance observation without web-vitals library
        const observePerformance = () => {
            if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
                return;
            }

            try {
                // LCP (Largest Contentful Paint)
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    reportWebVital({ 
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
                            reportWebVital({ 
                                name: 'FCP', 
                                value: entry.startTime, 
                                delta: entry.startTime,
                                id: Math.random().toString(36).substr(2, 9)
                            });
                        }
                    }
                });
                fcpObserver.observe({ entryTypes: ['paint'] });

                // CLS (Cumulative Layout Shift) - simplified
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!(entry as any).hadRecentInput) {
                            clsValue += (entry as any).value;
                        }
                    }
                    if (clsValue > 0) {
                        reportWebVital({ 
                            name: 'CLS', 
                            value: clsValue, 
                            delta: clsValue,
                            id: Math.random().toString(36).substr(2, 9)
                        });
                    }
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });

            } catch (error) {
                console.warn('Performance monitoring not supported', error);
            }
        };

        // Register performance observers
        observePerformance();

    }, [pathname]);

    // Componente não renderiza nada visualmente
    return null;
}