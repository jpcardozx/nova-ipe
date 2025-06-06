'use client';

import { useState, useEffect } from 'react';

/**
 * Componente para monitorar o desempenho de carregamento da página
 * Somente renderizado em desenvolvimento quando a flag NEXT_PUBLIC_LOADING_PROFILE está ativa
 */
interface LoadingMetrics {
    domContentLoaded: number | string;
    loadComplete: number | string;
    firstContentfulPaint: number | string;
    renderBlocking: number | string;
    networkLatency: number | string;
}

export default function LoadingProfiler() {
    const [metrics, setMetrics] = useState<LoadingMetrics | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Verifica se está no ambiente de desenvolvimento com o flag ativo
        if (process.env.NODE_ENV !== 'development' || process.env.NEXT_PUBLIC_LOADING_PROFILE !== 'true') {
            return;
        }

        // Coletando métricas após o carregamento completo da página
        const collectMetrics = () => {
            setTimeout(() => {
                const navigationEntries = performance.getEntriesByType('navigation');
                const paintEntries = performance.getEntriesByType('paint');

                if (navigationEntries.length > 0) {
                    const navTiming = navigationEntries[0] as PerformanceNavigationTiming;
                    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');

                    setMetrics({
                        domContentLoaded: Math.round(navTiming.domContentLoadedEventEnd),
                        loadComplete: Math.round(navTiming.loadEventEnd),
                        firstContentfulPaint: fcp ? Math.round(fcp.startTime) : 'N/A',
                        renderBlocking: Math.round(navTiming.domContentLoadedEventEnd - navTiming.responseStart),
                        networkLatency: Math.round(navTiming.responseStart - navTiming.requestStart),
                    });
                }
            }, 0);
        };

        // Registra quando a janela estiver carregada
        if (document.readyState === 'complete') {
            collectMetrics();
        } else {
            window.addEventListener('load', collectMetrics);
            return () => window.removeEventListener('load', collectMetrics);
        }

        // Exibe o componente após um pequeno delay
        setTimeout(() => setVisible(true), 1000);
    }, []);

    // Não renderiza nada se não estiver em desenvolvimento ou se não tiver métricas
    if (!visible || !metrics) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '12px',
                borderRadius: '4px',
                fontSize: '14px',
                maxWidth: '300px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                fontFamily: 'monospace'
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                📊 Loading Performance
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px' }}>
                <div>FCP:</div>
                <div style={{ textAlign: 'right' }}>{metrics.firstContentfulPaint}ms</div>

                <div>DOM Ready:</div>
                <div style={{ textAlign: 'right' }}>{metrics.domContentLoaded}ms</div>

                <div>Load Complete:</div>
                <div style={{ textAlign: 'right' }}>{metrics.loadComplete}ms</div>

                <div>Render Blocking:</div>
                <div style={{ textAlign: 'right' }}>{metrics.renderBlocking}ms</div>

                <div>Network Latency:</div>
                <div style={{ textAlign: 'right' }}>{metrics.networkLatency}ms</div>
            </div>
            <div
                style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    opacity: 0.8,
                    cursor: 'pointer',
                    textAlign: 'center'
                }}
                onClick={() => setVisible(false)}
            >
                (click to hide)
            </div>
        </div>
    );
}
