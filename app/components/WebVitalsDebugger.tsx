'use client';

import { useEffect, useState } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

interface WebVitalMetric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    id: string;
    timestamp: number;
}

interface WebVitalsDebuggerProps {
    enabled?: boolean;
}

export default function WebVitalsDebugger({ enabled = true }: WebVitalsDebuggerProps) {
    const [metrics, setMetrics] = useState<WebVitalMetric[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Marcar componente como inicializado
        setIsInitialized(true);
        console.log('[WebVitalsDebugger] Inicializado');

        // Tornar visível após um curto período para garantir que a interface se estabilize
        const visibilityTimer = setTimeout(() => {
            setIsVisible(true);
            console.log('[WebVitalsDebugger] Visível');
        }, 500);

        return () => clearTimeout(visibilityTimer);
    }, []);

    useEffect(() => {
        if (!enabled || !isInitialized) return;

        console.log('[WebVitalsDebugger] Registrando métricas...');

        const handleMetric = (metric: any) => {
            const { name, value, rating, delta, id } = metric;

            console.log(`[WebVitalsDebugger] Métrica coletada: ${name} = ${value}`);

            const newMetric: WebVitalMetric = {
                name,
                value,
                rating,
                delta,
                id,
                timestamp: Date.now()
            };

            setMetrics(prev => [...prev, newMetric]);

            // Enviar para API
            if ('sendBeacon' in navigator) {
                const body = JSON.stringify({
                    name,
                    value,
                    delta,
                    id,
                    page: window.location.pathname,
                    environment: 'development',
                    debug: true
                });

                navigator.sendBeacon('/api/vitals', body);
            }
        };

        // Registrar handlers
        onCLS(handleMetric);
        onFCP(handleMetric);
        onINP(handleMetric);
        onLCP(handleMetric);
        onTTFB(handleMetric);

        // Observar eventos de interação (se necessário)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'event' && entry.duration > 100) {
                        console.log('Slow interaction:', {
                            type: entry.name,
                            duration: entry.duration,
                            target: (entry as any).target
                        });
                    }
                });
            });

            try {
                observer.observe({ type: 'event', buffered: true });
            } catch (e) {
                // Fallback se o tipo 'event' não for suportado
                console.log('Event type not supported');
            }

            return () => observer.disconnect();
        }
    }, []);

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
            >
                Show Web Vitals
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Web Vitals</h3>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
            </div>

            <div className="space-y-2">
                {metrics.map((metric) => (
                    <div
                        key={metric.id}
                        className={`p-2 rounded ${metric.rating === 'good'
                            ? 'bg-green-100'
                            : metric.rating === 'needs-improvement'
                                ? 'bg-yellow-100'
                                : 'bg-red-100'
                            }`}
                    >
                        <div className="font-semibold">{metric.name}</div>
                        <div className="text-sm">
                            Value: {metric.value.toFixed(2)} ms
                        </div>
                        <div className="text-xs text-gray-600">
                            Rating: {metric.rating}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}