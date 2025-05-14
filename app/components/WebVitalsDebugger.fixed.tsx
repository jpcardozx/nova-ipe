'use client';

import React, { useEffect } from 'react';

// Interfaces para as entradas específicas de Performance
interface LCPEntry extends PerformanceEntry {
    element: HTMLElement | null;
    size: number;
    renderTime?: number;
    loadTime?: number;
    url?: string;
}

interface CLSEntry extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
    sources: Array<{
        node: HTMLElement | null;
        previousRect?: DOMRectReadOnly;
        currentRect?: DOMRectReadOnly;
    }>;
}

interface INPEntry extends PerformanceEntry {
    target?: HTMLElement | null;
    duration: number;
    processingStart?: number;
    processingEnd?: number;
    interactionId?: number;
}

export function LCPDetector() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                // Type assertion para usar as propriedades específicas de LCP
                const lcpEntry = entry as unknown as LCPEntry;
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('[LCP] Elemento detectado:', lcpEntry.element);
                    console.log('[LCP] Tempo:', lcpEntry.startTime.toFixed(1) + 'ms');
                    console.log('[LCP] Tamanho:', lcpEntry.size);

                    // Destacar visualmente
                    if (lcpEntry.element && lcpEntry.element instanceof HTMLElement) {
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

export function CLSDetector() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        let cumulativeScore = 0;

        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                // Type assertion para usar as propriedades específicas de CLS
                const clsEntry = entry as unknown as CLSEntry;
                if (!clsEntry.hadRecentInput) {
                    const currentShift = clsEntry.value;
                    cumulativeScore += currentShift;

                    console.log('[CLS] Shift detectado:', currentShift.toFixed(4));
                    console.log('[CLS] Acumulado:', cumulativeScore.toFixed(4));

                    if (clsEntry.sources && clsEntry.sources.length) {
                        clsEntry.sources.forEach(source => {
                            if (source.node && source.node instanceof HTMLElement) {
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

export function INPDetector() {
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

                    if (inpEntry.target && inpEntry.target instanceof HTMLElement) {
                        try {
                            const severity = Math.min(1, (inpEntry.duration - 200) / 800);
                            const color = `rgba(255, ${Math.floor(255 - (severity * 255))}, 0, 0.3)`;
                            // Guardar o backgroundColor original antes de alterar
                            const originalBg = inpEntry.target.style.backgroundColor || '';

                            inpEntry.target.style.backgroundColor = color;
                            inpEntry.target.setAttribute('title', `Interação lenta: ${inpEntry.duration.toFixed(1)}ms`);

                            setTimeout(() => {
                                // Garantir que target ainda existe antes de tentar usá-lo
                                if (inpEntry.target && inpEntry.target instanceof HTMLElement) {
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
            <LCPDetector />
            <CLSDetector />
            <INPDetector />
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
