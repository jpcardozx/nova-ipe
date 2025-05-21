'use client';

/**
 * PerformanceAnalytics.tsx
 * 
 * Componente para análise de performance em tempo real
 *
 * @version 1.0.0
 * @date 21/05/2025
 */

import { useState, useEffect } from 'react';

// Interface simples para métricas de performance
interface PerformanceData {
    pageLoad: {
        total: number | null;
        fcp: number | null;
        lcp: number | null;
        ttfb: number | null;
        cls: number | null;
    };
    resources: {
        name: string;
        duration: number;
        size: number;
    }[];
}

/**
 * Obter dados básicos de performance
 */
function getBasicPerformanceData(): PerformanceData {
    // Valores padrão
    const data: PerformanceData = {
        pageLoad: {
            total: null,
            fcp: null,
            lcp: null,
            ttfb: null,
            cls: null
        },
        resources: []
    };

    // Se estamos no navegador, colete as métricas
    if (typeof window !== 'undefined' && window.performance) {
        try {
            const perf = window.performance;

            // Navegação e timing
            if (perf.timing) {
                data.pageLoad.total = perf.timing.loadEventEnd - perf.timing.navigationStart;
                data.pageLoad.ttfb = perf.timing.responseStart - perf.timing.navigationStart;
            }

            // Recursos carregados
            if (perf.getEntriesByType) {
                // Métricas paint
                const paintEntries = perf.getEntriesByType('paint');
                const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
                if (fcpEntry) {
                    data.pageLoad.fcp = fcpEntry.startTime;
                }

                // Recursos (JavaScript, CSS, imagens, etc.)
                const resourceEntries = perf.getEntriesByType('resource');
                data.resources = resourceEntries
                    .filter(r => r.duration > 100) // Apenas recursos que levaram algum tempo para carregar
                    .slice(0, 5) // Limite para os 5 primeiros
                    .map(r => ({
                        name: r.name.split('/').pop() || r.name,
                        duration: Math.round(r.duration),
                        size: r.encodedBodySize || 0
                    }));
            }
        } catch (e) {
            console.error('Erro ao coletar métricas de performance:', e);
        }
    }

    return data;
}

/**
 * PerformanceAnalytics - Componente para análise de performance em tempo real
 */
export default function PerformanceAnalytics() {
    const [isVisible, setIsVisible] = useState(false);
    const [data, setData] = useState<PerformanceData>({
        pageLoad: { total: null, fcp: null, lcp: null, ttfb: null, cls: null },
        resources: []
    });

    useEffect(() => {
        // Verificar se devemos mostrar o painel
        const params = new URLSearchParams(window.location.search);
        if (params.get('debug') === 'performance') {
            setIsVisible(true);
        }

        // Atalho de teclado para alternar visibilidade (Ctrl+Alt+P)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.altKey && e.key === 'p') {
                e.preventDefault();
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Atualizar dados a cada 3 segundos se o painel estiver visível
        let intervalId: NodeJS.Timeout;
        if (isVisible) {
            const updateData = () => {
                setData(getBasicPerformanceData());
            };

            updateData(); // Atualização inicial
            intervalId = setInterval(updateData, 3000);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (intervalId) clearInterval(intervalId);
        };
    }, [isVisible]);

    // Não mostrar nada se não estiver visível
    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
                maxWidth: '300px',
                maxHeight: '400px',
                overflow: 'auto'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <h4 style={{ margin: '0', fontSize: '14px' }}>Performance Analytics</h4>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '0',
                    }}
                >
                    ×
                </button>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <h5 style={{ margin: '5px 0', color: '#60a5fa' }}>Page Load</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    <div>Total:</div>
                    <div>{data.pageLoad.total ? `${data.pageLoad.total}ms` : 'N/A'}</div>

                    <div>FCP:</div>
                    <div>{data.pageLoad.fcp ? `${Math.round(data.pageLoad.fcp)}ms` : 'N/A'}</div>

                    <div>TTFB:</div>
                    <div>{data.pageLoad.ttfb ? `${data.pageLoad.ttfb}ms` : 'N/A'}</div>
                </div>
            </div>

            {data.resources.length > 0 && (
                <div>
                    <h5 style={{ margin: '5px 0', color: '#60a5fa' }}>Slow Resources</h5>
                    <ul style={{ margin: '5px 0', padding: '0 0 0 15px' }}>
                        {data.resources.map((resource, i) => (
                            <li key={i} style={{ marginBottom: '3px' }}>
                                {resource.name} - {resource.duration}ms
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}