'use client';

/**
 * PerformanceAnalytics.tsx
 * 
 * Componente para análise de performance em tempo real
 *
 * @version 1.0.0
 * @date 21/05/2025
 */

import React, { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Interface simples para métricas de performance
interface PerformanceData {
    pageLoad: {
        total: number | null;
        fcp: number | null;
        lcp: number | null;
        ttfb: number | null;
        cls: number | null;
    };
    resources: Array<{
        name: string;
        duration: number;
        size: number;
    }>;

}

/**
 * Obter dados básicos de performance de forma otimizada
 */
const getBasicPerformanceData = (): PerformanceData => {
    if (typeof window === 'undefined') {
        return {
            pageLoad: {
                total: null,
                fcp: null,
                lcp: null,
                ttfb: null,
                cls: null
            },
            resources: []
        };
    }

    // Usa as PerformanceEntry APIs de forma eficiente
    const loadMetrics = {
        total: null,
        fcp: null,
        lcp: null,
        ttfb: null,
        cls: null
    } as PerformanceData['pageLoad'];

    try {
        // Get navigation timing metrics efficiently
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries.length > 0) {
            const nav = navEntries[0] as PerformanceNavigationTiming;
            loadMetrics.total = nav.loadEventEnd - nav.fetchStart;
            loadMetrics.ttfb = nav.responseStart - nav.requestStart;
        }

        // Get paint timing metrics
        const paintEntries = performance.getEntriesByType('paint');
        for (const entry of paintEntries) {
            if (entry.name === 'first-contentful-paint') {
                loadMetrics.fcp = entry.startTime;
            }
        }

        // Get LCP if available
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        if (lcpEntries.length > 0) {
            loadMetrics.lcp = lcpEntries[lcpEntries.length - 1].startTime;
        }

        // Get layout shift if available
        const clsEntries = performance.getEntriesByType('layout-shift');
        if (clsEntries.length > 0) {
            loadMetrics.cls = clsEntries.reduce((acc, entry: any) => acc + entry.value, 0);
        }

        // Get resource timing metrics efficiently
        const resources = performance.getEntriesByType('resource')
            .map(entry => ({
                name: entry.name.split('/').pop() || entry.name,
                duration: entry.duration,
                size: (entry as PerformanceResourceTiming).encodedBodySize || 0
            }))
            .slice(0, 50); // Limit to 50 resources to avoid memory issues

        return { pageLoad: loadMetrics, resources };
    } catch (error) {
        console.warn('Error getting performance data:', error);
        return { pageLoad: loadMetrics, resources: [] };
    }
};

/**
 * PerformanceAnalytics - Componente para análise de performance em tempo real
 */
export default function PerformanceAnalytics() {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<PerformanceData>(() => getBasicPerformanceData());
    const pathname = usePathname();

    // Use useCallback para evitar recriações desnecessárias
    const refreshData = useCallback(() => {
        // Usa requestIdleCallback para evitar bloquear o thread principal
        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(
                () => setData(getBasicPerformanceData()),
                { timeout: 2000 }
            );
        } else {
            // Fallback para setTimeout com baixa prioridade
            setTimeout(() => setData(getBasicPerformanceData()), 50);
        }
    }, []);

    // Atualiza dados quando a rota muda
    useEffect(() => {
        refreshData();
    }, [pathname, refreshData]);

    // Check visibility conditions
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const debugParam = params.get('debug');
        const forceVisible = window.localStorage?.getItem('force_performance_panel') === 'true';

        setVisible(debugParam === 'performance' || debugParam === 'perf' || forceVisible);
    }, [pathname]);

    // Se não estiver visível, não renderiza nada
    if (!visible) return null;

    // Renderiza o painel com os dados de performance
    return (
        <div className="fixed bottom-4 right-4 p-4 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg text-sm max-w-md">
            <h3 className="font-semibold mb-2">Performance Metrics</h3>

            <div className="space-y-1">
                <p>Load Time: {data.pageLoad.total ? `${Math.round(data.pageLoad.total)}ms` : 'N/A'}</p>
                <p>TTFB: {data.pageLoad.ttfb ? `${Math.round(data.pageLoad.ttfb)}ms` : 'N/A'}</p>
                <p>FCP: {data.pageLoad.fcp ? `${Math.round(data.pageLoad.fcp)}ms` : 'N/A'}</p>
                <p>LCP: {data.pageLoad.lcp ? `${Math.round(data.pageLoad.lcp)}ms` : 'N/A'}</p>
                <p>CLS: {data.pageLoad.cls ? data.pageLoad.cls.toFixed(3) : 'N/A'}</p>
            </div>

            {/* Render resource stats */}
            {data.resources.length > 0 && (
                <div className="mt-4">
                    <p className="font-semibold">Slowest Resources:</p>
                    <ul className="text-xs space-y-1 mt-1">
                        {data.resources
                            .sort((a, b) => b.duration - a.duration)
                            .slice(0, 3)
                            .map((resource, i) => (
                                <li key={i}>
                                    {resource.name}: {Math.round(resource.duration)}ms
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}