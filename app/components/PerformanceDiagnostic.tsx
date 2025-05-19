'use client';

/**
 * Diagnóstico de Performance
 * 
 * Este componente fornece um diagnóstico detalhado da performance do site,
 * com foco nos problemas críticos identificados:
 * - LCP (Largest Contentful Paint): 78056ms (ideal <2500ms)
 * - Thread main blocked: 57778ms
 * - Recursos lentos: páginas "alugar" e "comprar" (~6860ms cada) e pacote lucide-react
 */

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PerformanceData {
    lcp: number | null;
    fcp: number | null;
    ttfb: number | null;
    cls: number | null;
    fid: number | null;
    tbt: number | null;
    longTasks: { duration: number, startTime: number }[];
    resourceLoads: Record<string, number>;
    paintTimings: Record<string, number>;
    jsHeapUsed: number | null;
}

// Cria um registro de performance para comparação posterior
const BASELINE_METRICS = {
    'before_optimization': {
        path: '/alugar',
        lcp: 78056,
        tbt: 57778,
        cls: 0.32,
        ttfb: 863,
        resourceLoads: {
            'alugar': 6860,
            'comprar': 6860,
            'lucide-react': 4320
        }
    }
};

export default function PerformanceDiagnostic() {
    const [data, setData] = useState<PerformanceData>({
        lcp: null,
        fcp: null,
        ttfb: null,
        cls: null,
        fid: null,
        tbt: null,
        longTasks: [],
        resourceLoads: {},
        paintTimings: {},
        jsHeapUsed: null
    });

    const [visible, setVisible] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Mostrar apenas em modo de desenvolvimento ou quando explicitamente habilitado por parâmetro de URL
        const showDiagnostic = process.env.NODE_ENV === 'development' ||
            window.location.search.includes('performance-diagnostic');

        if (!showDiagnostic) {
            return;
        }

        setVisible(true);

        // Array para armazenar observadores de performance
        const observers: PerformanceObserver[] = [];
        let longTasks: { duration: number; startTime: number }[] = [];
        let resourceLoads: Record<string, number> = {};

        try {
            // Observe LCP (Largest Contentful Paint)
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) {
                    setData(prev => ({ ...prev, lcp: lastEntry.startTime }));
                }
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            observers.push(lcpObserver);

            // Observe FCP (First Contentful Paint)
            const fcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const firstEntry = entries[0];
                if (firstEntry) {
                    setData(prev => ({
                        ...prev,
                        fcp: firstEntry.startTime,
                        paintTimings: { ...prev.paintTimings, fcp: firstEntry.startTime }
                    }));
                }
            });
            fcpObserver.observe({ type: 'paint', buffered: true });
            observers.push(fcpObserver);

            // Observe Long Tasks (main thread blocking)
            const longTaskObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const newTasks = entries.map(entry => ({
                    duration: entry.duration,
                    startTime: entry.startTime
                }));

                longTasks = [...longTasks, ...newTasks];

                // Calculate TBT (Total Blocking Time)
                const tbt = longTasks.reduce((total, task) => {
                    const blockingTime = task.duration > 50 ? task.duration - 50 : 0;
                    return total + blockingTime;
                }, 0);

                setData(prev => ({ ...prev, longTasks, tbt }));
            });
            longTaskObserver.observe({ type: 'longtask', buffered: true });
            observers.push(longTaskObserver);

            // Observe Resource Timing
            const resourceObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries() as PerformanceResourceTiming[];

                entries.forEach(entry => {
                    const url = entry.name;
                    const duration = entry.duration;

                    if (duration < 20) return; // Ignorar recursos muito pequenos

                    const urlPath = new URL(url, window.location.origin).pathname;
                    const fileName = url.split('/').pop()?.split('?')[0] || url;

                    // Categorize by file type or path segment
                    const key = fileName.includes('.js')
                        ? fileName
                        : urlPath.includes('alugar')
                            ? 'alugar'
                            : urlPath.includes('comprar')
                                ? 'comprar'
                                : fileName;

                    resourceLoads[key] = duration;
                });

                setData(prev => ({ ...prev, resourceLoads }));
            });
            resourceObserver.observe({ type: 'resource', buffered: true });
            observers.push(resourceObserver);

            // Observe Navigation Timing (TTFB)
            const navObserver = new PerformanceObserver((entryList) => {
                const navEntry = entryList.getEntries()[0] as PerformanceNavigationTiming;

                if (navEntry) {
                    const ttfb = navEntry.responseStart - navEntry.requestStart;
                    setData(prev => ({ ...prev, ttfb }));
                }
            });
            navObserver.observe({ type: 'navigation', buffered: true });
            observers.push(navObserver);

            // Observe Memory Usage if available
            if ('memory' in performance) {
                const updateMemory = () => {
                    // @ts-ignore - TypeScript doesn't know about performance.memory
                    const jsHeapUsed = performance.memory?.usedJSHeapSize / (1024 * 1024);
                    setData(prev => ({ ...prev, jsHeapUsed }));
                };

                updateMemory();
                const memoryInterval = setInterval(updateMemory, 2000);

                return () => {
                    clearInterval(memoryInterval);
                    observers.forEach(obs => obs.disconnect());
                };
            }

        } catch (err) {
            console.error('Erro ao inicializar diagnóstico de performance:', err);
        }

        return () => {
            observers.forEach(obs => obs.disconnect());
        };
    }, [pathname]);

    if (!visible) return null;

    // Calcula melhorias em relação à linha de base
    const baseline = BASELINE_METRICS.before_optimization;
    const lcpImprovement = data.lcp && baseline.lcp ? ((baseline.lcp - data.lcp) / baseline.lcp * 100).toFixed(1) : null;
    const tbtImprovement = data.tbt && baseline.tbt ? ((baseline.tbt - data.tbt) / baseline.tbt * 100).toFixed(1) : null;

    return (
        <div className="fixed top-0 right-0 z-50 bg-white/90 shadow-lg rounded-bl-lg p-4 max-w-md max-h-screen overflow-auto text-xs">
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-base">Diagnóstico de Performance</h2>
                <button onClick={() => setVisible(false)} className="text-gray-500 hover:text-gray-700">
                    ×
                </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div className="font-medium">LCP:</div>
                <div className={data.lcp && data.lcp > 2500 ? 'text-red-600' : 'text-green-600'}>
                    {data.lcp ? `${Math.round(data.lcp)}ms` : 'Coletando...'}
                    {lcpImprovement && <span className="text-green-600 ml-2">↓{lcpImprovement}%</span>}
                </div>

                <div className="font-medium">Thread Blocking (TBT):</div>
                <div className={data.tbt && data.tbt > 300 ? 'text-red-600' : 'text-green-600'}>
                    {data.tbt ? `${Math.round(data.tbt)}ms` : 'Coletando...'}
                    {tbtImprovement && <span className="text-green-600 ml-2">↓{tbtImprovement}%</span>}
                </div>

                <div className="font-medium">TTFB:</div>
                <div className={data.ttfb && data.ttfb > 600 ? 'text-red-600' : 'text-green-600'}>
                    {data.ttfb ? `${Math.round(data.ttfb)}ms` : 'Coletando...'}
                </div>

                <div className="font-medium">CLS:</div>
                <div className={data.cls && data.cls > 0.1 ? 'text-red-600' : 'text-green-600'}>
                    {data.cls !== null ? data.cls.toFixed(3) : 'Coletando...'}
                </div>

                <div className="font-medium">FCP:</div>
                <div className={data.fcp && data.fcp > 1800 ? 'text-red-600' : 'text-green-600'}>
                    {data.fcp ? `${Math.round(data.fcp)}ms` : 'Coletando...'}
                </div>

                <div className="font-medium">JS Heap:</div>
                <div>
                    {data.jsHeapUsed ? `${Math.round(data.jsHeapUsed)}MB` : 'N/A'}
                </div>
            </div>

            {data.longTasks.length > 0 && (
                <div className="mt-3">
                    <div className="font-medium mb-1">Long Tasks:</div>
                    <div className="text-2xs">
                        <div>Contagem: {data.longTasks.length}</div>
                        <div>Maior duração: {Math.round(Math.max(...data.longTasks.map(t => t.duration)))}ms</div>
                        <div>Duração média: {Math.round(data.longTasks.reduce((sum, t) => sum + t.duration, 0) / data.longTasks.length)}ms</div>
                    </div>
                </div>
            )}

            {Object.keys(data.resourceLoads).length > 0 && (
                <div className="mt-3">
                    <div className="font-medium mb-1">Recursos Lentos:</div>
                    <div className="max-h-40 overflow-y-auto text-2xs">
                        {Object.entries(data.resourceLoads)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 10)
                            .map(([resource, time]) => (
                                <div key={resource} className="flex justify-between">
                                    <span className="truncate max-w-[200px]" title={resource}>{resource}</span>
                                    <span className={time > 1000 ? 'text-red-600' : ''}>{Math.round(time)}ms</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            <div className="mt-4 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="font-medium">Página atual:</span>
                    <span>{pathname}</span>
                </div>

                <div className="mt-2 text-2xs text-gray-500">
                    {new Date().toLocaleString()}
                </div>
            </div>
        </div>
    );
}
