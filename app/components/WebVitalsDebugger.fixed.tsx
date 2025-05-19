'use client';

import React, { useEffect } from 'react';

// Type declaration for Performance Entries
interface LCPEntry extends PerformanceEntry {
    element: any;
    size: number;
    renderTime?: number;
    loadTime?: number;
    startTime: number;
}

interface CLSEntry extends PerformanceEntry {
    value: number;
    sources: Array<{
        node: any;
        previousRect: DOMRectReadOnly;
        currentRect: DOMRectReadOnly;
    }>;
}

interface INPEntry extends PerformanceEntry {
    target: any;
    duration: number;
    processingStart: number;
    processingEnd: number;
    startTime: number;
}

// Web Vitals Debugger Components
function LCPDebugger() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Observe Largest Contentful Paint events
        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();

            // Get the latest LCP
            if (entries.length > 0) {
                const lcpEntry = entries[entries.length - 1] as unknown as LCPEntry;
                if (lcpEntry.element) {
                    console.log('[LCP] Elemento detectado:', lcpEntry.element);
                    console.log('[LCP] Tempo:', lcpEntry.startTime.toFixed(1) + 'ms');
                    console.log('[LCP] Tamanho:', lcpEntry.size);

                    // Destacar visualmente
                    if (lcpEntry.element && 'style' in lcpEntry.element && 'setAttribute' in lcpEntry.element) {
                        try {
                            lcpEntry.element.style.outline = '5px solid red';
                            lcpEntry.element.setAttribute('title', `LCP: ${lcpEntry.startTime.toFixed(1)}ms`);
                        } catch (err) {
                            console.warn('[LCP] Não foi possível estilizar o elemento:', err);
                        }
                    }
                }
            }
        });

        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        return () => {
            observer.disconnect();
        };
    }, []);

    return null;
}

function CLSDebugger() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Track cumulative layout shift score
        let cumulativeScore = 0;

        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries() as unknown as CLSEntry[];

            for (const clsEntry of entries) {
                cumulativeScore += clsEntry.value;

                if (clsEntry.value > 0.01) {
                    console.log('[CLS] Shift detectado:', clsEntry.value.toFixed(4));
                    console.log('[CLS] Acumulado:', cumulativeScore.toFixed(4));

                    if (clsEntry.sources && clsEntry.sources.length) {
                        clsEntry.sources.forEach(source => {
                            if (source.node && 'style' in source.node) {
                                console.log('[CLS] Elemento causador:', source.node);
                                try {
                                    source.node.style.outline = '3px dashed orange';
                                } catch (err) {
                                    console.warn('[CLS] Não foi possível estilizar o elemento:', err);
                                }
                            }
                        });
                    }
                }
            }
        });

        observer.observe({ type: 'layout-shift', buffered: true });

        return () => {
            observer.disconnect();
        };
    }, []);

    return null;
}

function INPDebugger() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Polyfill simples para navegadores que não suportam INP diretamente
        const observer = new PerformanceObserver((entryList) => {
            const events = entryList.getEntries();

            events.forEach(event => {
                // Type assertion para usar as propriedades específicas de INP
                const inpEntry = event as unknown as INPEntry;
                if (inpEntry.duration > 200) {
                    console.log('[INP] Interação lenta detectada:');
                    console.log(`[INP] Duração: ${inpEntry.duration.toFixed(1)}ms`);
                    console.log('[INP] Elemento:', inpEntry.target);

                    if (inpEntry.target && 'style' in inpEntry.target && 'setAttribute' in inpEntry.target) {
                        try {
                            const severity = Math.min(1, (inpEntry.duration - 200) / 800);
                            const color = `rgba(255, ${Math.floor(255 - (severity * 255))}, 0, 0.3)`;
                            // Guardar o backgroundColor original antes de alterar
                            const originalBg = inpEntry.target.style.backgroundColor || '';

                            inpEntry.target.style.backgroundColor = color;
                            inpEntry.target.setAttribute('title', `Interação lenta: ${inpEntry.duration.toFixed(1)}ms`);

                            setTimeout(() => {
                                // Garantir que target ainda existe antes de tentar usá-lo
                                if (inpEntry.target && 'style' in inpEntry.target) {
                                    inpEntry.target.style.backgroundColor = originalBg;
                                }
                            }, 2000);
                        } catch (err) {
                            console.warn('[INP] Não foi possível estilizar o elemento:', err);
                        }
                    }
                }
            });
        });

        observer.observe({ type: 'event', buffered: true });

        return () => {
            observer.disconnect();
        };
    }, []);

    return null;
}

interface WebVitalsDebuggerProps {
    enabled?: boolean;
}

export function WebVitalsDebugger({ enabled = true }: WebVitalsDebuggerProps) {
    // Garantir que não renderiza nada em produção ou no servidor
    if (!enabled || typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
        return null;
    }

    // Usa React.lazy para carregar detectores sob demanda
    // Evita impacto no desempenho
    return (
        <React.Fragment>
            <LCPDebugger />
            <CLSDebugger />
            <INPDebugger />
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '8px',
                    fontSize: '12px',
                    zIndex: 9999
                }}
            >
                Web Vitals Debugger Ativo
            </div>
        </React.Fragment>
    );
}

export default WebVitalsDebugger;
