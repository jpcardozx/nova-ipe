'use client';

/**
 * CoreWebVitalsTracker - Componente para rastreamento de métricas Web Vitals ao longo do tempo
 * 
 * Este componente mantém um histórico das métricas Web Vitals e permite a visualização
 * de tendências e melhorias após as otimizações.
 */

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePerformanceMonitor } from '@/app/utils/performance-monitor-advanced';

// Tipo para armazenar métricas históricas
interface HistoricalMetric {
    timestamp: number;
    value: number;
    path: string;
}

// Tipo para armazenar todas as métricas
interface MetricsHistory {
    lcp: HistoricalMetric[];
    fcp: HistoricalMetric[];
    ttfb: HistoricalMetric[];
    cls: HistoricalMetric[];
    fid: HistoricalMetric[];
    tbt: HistoricalMetric[];
}

// Chave para armazenamento local
const STORAGE_KEY = 'nova-ipe-web-vitals-history';

// Limite de entradas por métrica
const MAX_HISTORY_ENTRIES = 20;

export default function CoreWebVitalsTracker() {
    const metrics = usePerformanceMonitor();
    const pathname = usePathname();
    const [history, setHistory] = useState<MetricsHistory>({
        lcp: [],
        fcp: [],
        ttfb: [],
        cls: [],
        fid: [],
        tbt: []
    });
    const [showUI, setShowUI] = useState(false);

    // Carregar histórico do localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const savedHistory = window.localStorage.getItem(STORAGE_KEY);
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error('Erro ao carregar histórico de métricas:', error);
        }

        // Mostrar UI apenas se solicitado pelo usuário
        const showVitalsTracker = window.location.search.includes('show-vitals-history');
        setShowUI(showVitalsTracker);
    }, []);

    // Atualizar histórico quando as métricas mudarem
    useEffect(() => {
        // Só armazena se tivermos métricas válidas
        if (!metrics.lcp || !metrics.fcp) return;

        const currentTimestamp = Date.now();
        const currentPath = pathname || '/';

        const addMetricToHistory = <K extends keyof MetricsHistory>(
            metricName: K,
            value: number | null
        ) => {
            if (value === null) return history[metricName];

            const newEntry: HistoricalMetric = {
                timestamp: currentTimestamp,
                value,
                path: currentPath
            };

            return [newEntry, ...history[metricName]].slice(0, MAX_HISTORY_ENTRIES);
        };

        const updatedHistory = {
            lcp: addMetricToHistory('lcp', metrics.lcp),
            fcp: addMetricToHistory('fcp', metrics.fcp),
            ttfb: addMetricToHistory('ttfb', metrics.ttfb),
            cls: addMetricToHistory('cls', metrics.cls),
            fid: addMetricToHistory('fid', metrics.fid),
            tbt: addMetricToHistory('tbt', metrics.tbt)
        };

        setHistory(updatedHistory);

        // Salvar no localStorage
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
            }
        } catch (error) {
            console.error('Erro ao salvar histórico de métricas:', error);
        }
    }, [metrics, pathname, history]);

    // Não renderizar UI se não estiver solicitado
    if (!showUI) return null;

    // Calcular tendências (melhoria ou piora)
    const getTrend = (metricHistory: HistoricalMetric[], lowerIsBetter = true) => {
        if (metricHistory.length < 2) return null;

        const recent = metricHistory[0].value;
        const previous = metricHistory[1].value;
        const diff = recent - previous;
        const percentage = Math.abs(Math.round((diff / previous) * 100));

        const isImprovement = lowerIsBetter ? diff < 0 : diff > 0;
        return {
            direction: isImprovement ? 'improvement' : 'degradation',
            percentage,
            value: Math.abs(Math.round(diff))
        };
    };

    // Renderizar o histórico
    return (
        <div className="fixed top-20 right-4 p-4 bg-white/95 border border-gray-200 rounded-lg shadow-lg z-50 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Histórico de Web Vitals</h3>
                <button
                    onClick={() => setShowUI(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
            </div>

            {/* LCP History */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Largest Contentful Paint (LCP)</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-2 text-left">Data</th>
                                <th className="p-2 text-right">Valor (ms)</th>
                                <th className="p-2 text-left">Página</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.lcp.map((entry, index) => {
                                const trend = index === 0 ? getTrend(history.lcp) : null;

                                return (
                                    <tr key={entry.timestamp} className="border-t border-gray-100">
                                        <td className="p-2 text-left">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-2 text-right font-mono">
                                            <span className={entry.value > 2500 ? 'text-red-600' : 'text-green-600'}>
                                                {Math.round(entry.value)}
                                                {index === 0 && trend && (
                                                    <span className={trend.direction === 'improvement' ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                                                        ({trend.direction === 'improvement' ? '↓' : '↑'} {trend.percentage}%)
                                                    </span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-2 text-left truncate max-w-[150px]" title={entry.path}>
                                            {entry.path}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CLS History */}
            <div className="mb-6">
                <h4 className="font-medium mb-2">Cumulative Layout Shift (CLS)</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-2 text-left">Data</th>
                                <th className="p-2 text-right">Valor</th>
                                <th className="p-2 text-left">Página</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.cls.map((entry, index) => {
                                const trend = index === 0 ? getTrend(history.cls) : null;

                                return (
                                    <tr key={entry.timestamp} className="border-t border-gray-100">
                                        <td className="p-2 text-left">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-2 text-right font-mono">
                                            <span className={entry.value > 0.1 ? 'text-red-600' : 'text-green-600'}>
                                                {entry.value.toFixed(3)}
                                                {index === 0 && trend && (
                                                    <span className={trend.direction === 'improvement' ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                                                        ({trend.direction === 'improvement' ? '↓' : '↑'} {trend.percentage}%)
                                                    </span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-2 text-left truncate max-w-[150px]" title={entry.path}>
                                            {entry.path}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TBT History */}
            <div className="mb-4">
                <h4 className="font-medium mb-2">Total Blocking Time (TBT)</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-2 text-left">Data</th>
                                <th className="p-2 text-right">Valor (ms)</th>
                                <th className="p-2 text-left">Página</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.tbt.map((entry, index) => {
                                const trend = index === 0 ? getTrend(history.tbt) : null;

                                return (
                                    <tr key={entry.timestamp} className="border-t border-gray-100">
                                        <td className="p-2 text-left">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-2 text-right font-mono">
                                            <span className={entry.value > 300 ? 'text-red-600' : 'text-green-600'}>
                                                {Math.round(entry.value)}
                                                {index === 0 && trend && (
                                                    <span className={trend.direction === 'improvement' ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                                                        ({trend.direction === 'improvement' ? '↓' : '↑'} {trend.percentage}%)
                                                    </span>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-2 text-left truncate max-w-[150px]" title={entry.path}>
                                            {entry.path}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={() => {
                        if (typeof window !== 'undefined') {
                            window.localStorage.removeItem(STORAGE_KEY);
                        }
                        setHistory({
                            lcp: [],
                            fcp: [],
                            ttfb: [],
                            cls: [],
                            fid: [],
                            tbt: []
                        });
                    }}
                    className="text-xs text-gray-500 hover:text-red-600 underline"
                >
                    Limpar histórico
                </button>
            </div>
        </div>
    );
}
