'use client';

/**
 * PerformanceVerification - Componente para validação e medição das melhorias de performance
 * 
 * Este componente fornece uma visão completa das métricas de performance, permitindo
 * comparar os dados antes e depois das otimizações implementadas.
 */

import React, { useEffect, useState } from 'react';
import { usePerformanceMonitor } from '@/app/utils/performance-monitor-advanced';

// Métricas de base (antes das otimizações)
const BASELINE_METRICS = {
    lcp: 78056, // LCP original era 78056ms
    tbt: 57778, // Thread blocking time original era 57778ms
    resourceLoads: {
        alugar: 6860, // Tempo de carregamento da página "alugar" era ~6860ms
        comprar: 6860, // Tempo de carregamento da página "comprar" era ~6860ms
        lucideReact: 4320, // Tempo de carregamento do pacote lucide-react era ~4320ms
    }
};

export default function PerformanceVerification() {
    const metrics = usePerformanceMonitor();
    const [improvements, setImprovements] = useState<{
        lcp: { value: number; percentage: number } | null;
        tbt: { value: number; percentage: number } | null;
        resourceAlugar: { value: number; percentage: number } | null;
        resourceComprar: { value: number; percentage: number } | null;
        resourceIcons: { value: number; percentage: number } | null;
    }>({
        lcp: null,
        tbt: null,
        resourceAlugar: null,
        resourceComprar: null,
        resourceIcons: null,
    });

    // Calcular melhorias em relação ao baseline
    useEffect(() => {
        if (!metrics.lcp && !metrics.tbt) return;

        const resourceLoads = metrics.resourceTiming;
        const alugarResource = Object.keys(resourceLoads).find(key => key.includes('alugar'));
        const comprarResource = Object.keys(resourceLoads).find(key => key.includes('comprar'));
        const iconsResource = Object.keys(resourceLoads).find(key =>
            key.includes('lucide') || key.includes('icon') || key.includes('svg')
        );

        const calculateImprovement = (current: number | undefined, baseline: number) => {
            if (!current) return null;
            const improvement = baseline - current;
            const percentage = Math.round((improvement / baseline) * 100);
            return { value: Math.round(improvement), percentage };
        };

        setImprovements({
            lcp: calculateImprovement(metrics.lcp || undefined, BASELINE_METRICS.lcp),
            tbt: calculateImprovement(metrics.tbt || undefined, BASELINE_METRICS.tbt),
            resourceAlugar: calculateImprovement(
                alugarResource ? resourceLoads[alugarResource] : undefined,
                BASELINE_METRICS.resourceLoads.alugar
            ),
            resourceComprar: calculateImprovement(
                comprarResource ? resourceLoads[comprarResource] : undefined,
                BASELINE_METRICS.resourceLoads.comprar
            ),
            resourceIcons: calculateImprovement(
                iconsResource ? resourceLoads[iconsResource] : undefined,
                BASELINE_METRICS.resourceLoads.lucideReact
            ),
        });
    }, [metrics]);

    if (!metrics.lcp && !metrics.tbt) {
        return <div className="hidden">Carregando métricas de performance...</div>;
    }

    return (
        <div className="fixed bottom-4 left-4 p-4 bg-white/95 border border-gray-200 rounded-lg shadow-lg z-50 max-w-md">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Verificação de Performance</h3>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Otimizado
                </span>
            </div>

            <div className="space-y-4">
                {/* LCP Improvement */}
                <div className="border-b pb-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">LCP</span>
                        <span className="text-sm font-bold text-green-600">
                            {improvements.lcp?.percentage
                                ? `${improvements.lcp.percentage}% melhor`
                                : 'Medindo...'}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Original: {BASELINE_METRICS.lcp}ms</span>
                        <span>Atual: {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'Medindo...'}</span>
                    </div>
                    {improvements.lcp && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${Math.min(100, improvements.lcp.percentage)}%` }}
                            ></div>
                        </div>
                    )}
                </div>

                {/* TBT Improvement */}
                <div className="border-b pb-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Thread Blocking</span>
                        <span className="text-sm font-bold text-green-600">
                            {improvements.tbt?.percentage
                                ? `${improvements.tbt.percentage}% melhor`
                                : 'Medindo...'}
                        </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Original: {BASELINE_METRICS.tbt}ms</span>
                        <span>Atual: {metrics.tbt ? `${Math.round(metrics.tbt)}ms` : 'Medindo...'}</span>
                    </div>
                    {improvements.tbt && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${Math.min(100, improvements.tbt.percentage)}%` }}
                            ></div>
                        </div>
                    )}
                </div>

                {/* Resource Load Improvements */}
                <div>
                    <div className="text-sm font-medium mb-2">Recursos Otimizados</div>

                    {/* Alugar Page */}
                    <div className="mb-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs">Página "alugar"</span>
                            <span className="text-xs font-bold text-green-600">
                                {improvements.resourceAlugar?.percentage
                                    ? `${improvements.resourceAlugar.percentage}% melhor`
                                    : 'Medindo...'}
                            </span>
                        </div>
                        {improvements.resourceAlugar && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                    className="bg-green-600 h-1.5 rounded-full"
                                    style={{ width: `${Math.min(100, improvements.resourceAlugar.percentage)}%` }}
                                ></div>
                            </div>
                        )}
                    </div>

                    {/* Comprar Page */}
                    <div className="mb-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs">Página "comprar"</span>
                            <span className="text-xs font-bold text-green-600">
                                {improvements.resourceComprar?.percentage
                                    ? `${improvements.resourceComprar.percentage}% melhor`
                                    : 'Medindo...'}
                            </span>
                        </div>
                        {improvements.resourceComprar && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                    className="bg-green-600 h-1.5 rounded-full"
                                    style={{ width: `${Math.min(100, improvements.resourceComprar.percentage)}%` }}
                                ></div>
                            </div>
                        )}
                    </div>

                    {/* Icons */}
                    <div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs">Ícones (lucide-react)</span>
                            <span className="text-xs font-bold text-green-600">
                                {improvements.resourceIcons?.percentage
                                    ? `${improvements.resourceIcons.percentage}% melhor`
                                    : 'Medindo...'}
                            </span>
                        </div>
                        {improvements.resourceIcons && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                    className="bg-green-600 h-1.5 rounded-full"
                                    style={{ width: `${Math.min(100, improvements.resourceIcons.percentage)}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Timestamp */}
            <div className="mt-4 text-xs text-gray-400 text-right">
                {new Date().toLocaleTimeString()}
            </div>
        </div>
    );
}
