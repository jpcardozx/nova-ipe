'use client';

/**
 * DiagnosticTool.tsx
 * Ferramenta de diagnóstico para verificar problemas com Web Vitals e componentes
 */

import { useEffect, useState } from 'react';

interface DiagnosticInfo {
    url: string;
    userAgent: string;
    windowDimensions: { width: number; height: number };
    performanceSupported: boolean;
    performanceObserverSupported: boolean;
    webVitalsQueryParam: string | null;
    renderTime: string;
    environmentVariables: Record<string, string | undefined>;
    errors: string[];
}

export default function DiagnosticTool() {
    const [info, setInfo] = useState<DiagnosticInfo | null>(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            // Coletar informações básicas
            const errors: string[] = [];
            const searchParams = new URLSearchParams(window.location.search);

            // Verificar variáveis de ambiente disponíveis
            const envVars: Record<string, string | undefined> = {};
            // Next.js só expõe variáveis NEXT_PUBLIC_* ao cliente
            for (const key in process.env) {
                if (key.startsWith('NEXT_PUBLIC_')) {
                    envVars[key] = process.env[key];
                }
            }

            // Verificar suporte a APIs críticas
            if (!window.performance) {
                errors.push('API Performance não suportada');
            }

            if (!('PerformanceObserver' in window)) {
                errors.push('PerformanceObserver não suportado');
            }

            // Gerar timestamp de renderização
            const now = new Date();
            const renderTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;

            // Compilar informações
            setInfo({
                url: window.location.href,
                userAgent: window.navigator.userAgent,
                windowDimensions: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                performanceSupported: 'performance' in window,
                performanceObserverSupported: 'PerformanceObserver' in window,
                webVitalsQueryParam: searchParams.get('debug'),
                renderTime,
                environmentVariables: envVars,
                errors
            });

            // Verificar especificamente o componente PerformanceAnalytics
            const checkPerformanceAnalyticsVisibility = () => {
                // Verifique se o componente está presente no DOM
                const perfPanel = document.querySelector('[data-component="performance-analytics"]');
                if (!perfPanel) {
                    console.log('[Diagnóstico] PerformanceAnalytics não encontrado no DOM');
                    errors.push('PerformanceAnalytics não encontrado no DOM');
                } else {
                    const style = window.getComputedStyle(perfPanel);
                    if (style.display === 'none' || style.visibility === 'hidden') {
                        console.log('[Diagnóstico] PerformanceAnalytics está oculto via CSS');
                        errors.push('PerformanceAnalytics está oculto via CSS');
                    } else {
                        console.log('[Diagnóstico] PerformanceAnalytics está no DOM e visível');
                    }
                }

                // Atualizar erros
                setInfo(prev => prev ? { ...prev, errors } : null);
            };

            // Verificar após o DOM estar completamente carregado
            if (document.readyState === 'complete') {
                setTimeout(checkPerformanceAnalyticsVisibility, 1000);
            } else {
                window.addEventListener('load', () => {
                    setTimeout(checkPerformanceAnalyticsVisibility, 1000);
                });
            }
        } catch (err) {
            console.error('Erro no DiagnosticTool:', err);
        }
    }, []);

    // Esconder a ferramenta de diagnóstico
    if (!visible || !info) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: '10px',
                left: '10px',
                zIndex: 10000,
                backgroundColor: 'rgba(0,0,0,0.85)',
                color: 'white',
                padding: '15px',
                borderRadius: '5px',
                maxWidth: '400px',
                fontSize: '12px',
                fontFamily: 'monospace',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                paddingBottom: '5px'
            }}>
                <h4 style={{ margin: 0 }}>Diagnóstico</h4>
                <button
                    onClick={() => setVisible(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '0'
                    }}
                >
                    ×
                </button>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <div><strong>URL:</strong> {info.url}</div>
                <div><strong>Tempo de Renderização:</strong> {info.renderTime}</div>
                <div><strong>Debug Query Param:</strong> {info.webVitalsQueryParam || 'não definido'}</div>
                <div><strong>Viewport:</strong> {info.windowDimensions.width}x{info.windowDimensions.height}</div>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <strong>Suporte a APIs:</strong>
                <div style={{ color: info.performanceSupported ? '#4ade80' : '#f87171' }}>
                    Performance API: {info.performanceSupported ? '✓' : '✗'}
                </div>
                <div style={{ color: info.performanceObserverSupported ? '#4ade80' : '#f87171' }}>
                    PerformanceObserver: {info.performanceObserverSupported ? '✓' : '✗'}
                </div>
            </div>

            {info.environmentVariables && Object.keys(info.environmentVariables).length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                    <strong>Variáveis de Ambiente:</strong>
                    {Object.entries(info.environmentVariables).map(([key, value]) => (
                        <div key={key}>
                            {key}: {value || '(vazio)'}
                        </div>
                    ))}
                </div>
            )}

            {info.errors.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#f87171' }}>Erros Detectados:</strong>
                    <ul style={{ margin: '5px 0 0 15px', padding: 0 }}>
                        {info.errors.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={{ fontSize: '11px', opacity: 0.7 }}>
                Para visualizar métricas detalhadas, adicione ?debug=performance à URL ou pressione Ctrl+Alt+P
            </div>
        </div>
    );
}
