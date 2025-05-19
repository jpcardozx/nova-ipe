'use client';

/**
 * Performance Monitor Avançado
 * 
 * Este monitor de performance fornece métricas detalhadas sobre o desempenho da aplicação,
 * focando especialmente nos problemas de LCP (78056ms) e bloqueio da thread principal (57778ms)
 * que foram identificados nas páginas 'alugar' e 'comprar'.
 */

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PerformanceMetrics {
    lcp: number | null;
    fcp: number | null;
    ttfb: number | null;
    cls: number | null;
    fid: number | null;
    tbt: number | null; // Total Blocking Time
    loadTime: number | null;
    resourceTiming: Record<string, number>;
    longTasks: { duration: number; startTime: number }[];
}

/**
 * Hook para rastreamento de métricas de performance
 */
export function usePerformanceMonitor() {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        lcp: null,
        fcp: null,
        ttfb: null,
        cls: null,
        fid: null,
        tbt: null,
        loadTime: null,
        resourceTiming: {},
        longTasks: []
    });

    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

        const observers: PerformanceObserver[] = [];
        let longTasks: { duration: number; startTime: number }[] = [];
        let resourceTiming: Record<string, number> = {};

        try {
            // 1. Observe LCP
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) {
                    setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
                }
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            observers.push(lcpObserver);

            // 2. Observe FCP
            const fcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const firstEntry = entries[0];
                if (firstEntry) {
                    setMetrics(prev => ({ ...prev, fcp: firstEntry.startTime }));
                }
            });
            fcpObserver.observe({ type: 'paint', buffered: true });
            observers.push(fcpObserver);

            // 3. Observe long tasks (thread blocking)
            const longTaskObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const newTasks = entries.map(entry => ({
                    duration: entry.duration,
                    startTime: entry.startTime
                }));

                longTasks = [...longTasks, ...newTasks];

                // Calcular TBT (Total Blocking Time)
                const tbt = longTasks.reduce((total, task) => {
                    // Only count blocking time above 50ms threshold
                    const blockingTime = task.duration > 50 ? task.duration - 50 : 0;
                    return total + blockingTime;
                }, 0);

                setMetrics(prev => ({
                    ...prev,
                    longTasks,
                    tbt
                }));
            });
            longTaskObserver.observe({ type: 'longtask', buffered: true });
            observers.push(longTaskObserver);

            // 4. Observe resource timing (para identificar recursos lentos)
            const resourceObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries() as PerformanceResourceTiming[];

                entries.forEach(entry => {
                    const url = entry.name;
                    const duration = entry.duration;

                    // Ignorar recursos muito pequenos
                    if (duration < 20) return;

                    // Extrair nome do recurso da URL
                    const fileName = url.split('/').pop()?.split('?')[0] || url;

                    resourceTiming[fileName] = duration;
                });

                setMetrics(prev => ({ ...prev, resourceTiming }));
            });
            resourceObserver.observe({ type: 'resource', buffered: true });
            observers.push(resourceObserver);

            // 5. Observe CLS
            const clsObserver = new PerformanceObserver((entryList) => {
                let clsValue = 0;
                const entries = entryList.getEntries();

                entries.forEach(entry => {
                    // @ts-ignore: TS não reconhece a propriedade value em layout-shift
                    if (!entry.hadRecentInput) {
                        // @ts-ignore
                        clsValue += entry.value;
                    }
                });

                setMetrics(prev => ({ ...prev, cls: clsValue }));
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
            observers.push(clsObserver);

            // 6. Observe FID
            const fidObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const firstEntry = entries[0];

                if (firstEntry) {
                    // @ts-ignore: TS não reconhece a propriedade processingStart
                    const delay = firstEntry.processingStart - firstEntry.startTime;
                    setMetrics(prev => ({ ...prev, fid: delay }));
                }
            });
            fidObserver.observe({ type: 'first-input', buffered: true });
            observers.push(fidObserver);

            // 7. Observe Navigation Timing (TTFB e loadTime)
            const navObserver = new PerformanceObserver((entryList) => {
                const navEntry = entryList.getEntries()[0] as PerformanceNavigationTiming;

                if (navEntry) {
                    const ttfb = navEntry.responseStart - navEntry.requestStart;
                    const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;

                    setMetrics(prev => ({
                        ...prev,
                        ttfb,
                        loadTime
                    }));
                }
            });
            navObserver.observe({ type: 'navigation', buffered: true });
            observers.push(navObserver);

        } catch (error) {
            console.error('Erro ao configurar Performance Observer:', error);
        }

        // Cleanup
        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, [pathname]);

    return metrics;
}

/**
 * Componente para exibir métricas de performance
 * Habilitado apenas em desenvolvimento ou com a flag ?debug-performance
 */
export function PerformanceMonitorDisplay() {
    const metrics = usePerformanceMonitor();
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Mostrar apenas em desenvolvimento ou quando explicitamente solicitado via URL
        const showDebug = process.env.NODE_ENV === 'development' ||
            window.location.search.includes('debug-performance');

        if (showDebug) {
            setIsVisible(true);
        }
    }, [pathname]);

    if (!isVisible) return null;

    // Classificar recursos por tempo de carregamento
    const sortedResources = Object.entries(metrics.resourceTiming)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="fixed bottom-4 right-4 bg-white/95 border border-gray-200 p-4 rounded-lg shadow-lg z-50 max-w-md text-xs font-mono">
            <h3 className="font-bold text-sm mb-2">Métricas de Performance</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>LCP:</div>
                <div className={metrics.lcp && metrics.lcp > 2500 ? 'text-red-600 font-bold' : ''}>
                    {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'Carregando...'}
                </div>

                <div>FCP:</div>
                <div>{metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'Carregando...'}</div>

                <div>TTFB:</div>
                <div>{metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'Carregando...'}</div>

                <div>TBT:</div>
                <div className={metrics.tbt && metrics.tbt > 300 ? 'text-red-600 font-bold' : ''}>
                    {metrics.tbt ? `${Math.round(metrics.tbt)}ms` : 'Carregando...'}
                </div>

                <div>CLS:</div>
                <div>{metrics.cls !== null ? metrics.cls.toFixed(3) : 'Carregando...'}</div>

                <div>FID:</div>
                <div>{metrics.fid ? `${Math.round(metrics.fid)}ms` : 'Carregando...'}</div>
            </div>

            {sortedResources.length > 0 && (
                <>
                    <h4 className="font-bold mt-3 mb-1">Recursos Lentos:</h4>
                    <div className="max-h-40 overflow-y-auto">
                        {sortedResources.map(([resource, time]) => (
                            <div key={resource} className="flex justify-between text-2xs">
                                <span className="truncate max-w-[180px]">{resource}</span>
                                <span className={time > 1000 ? 'text-red-600' : ''}>{Math.round(time)}ms</span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {metrics.longTasks.length > 0 && (
                <div className="mt-2 text-2xs">
                    <div>Total tarefas longas: {metrics.longTasks.length}</div>
                    <div className={metrics.longTasks.length > 10 ? 'text-red-600' : ''}>
                        Maior bloqueio: {Math.round(Math.max(...metrics.longTasks.map(t => t.duration)))}ms
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * Componente não visível para inicializar monitoramento de performance
 */
export function PerformanceMonitorInitializer() {
    usePerformanceMonitor();
    return null;
}
