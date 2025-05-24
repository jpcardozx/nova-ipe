'use client';

/**
 * Performance Monitor Component
 * 
 * Monitors and reports Core Web Vitals metrics in both development and production.
 * Only shows UI in development mode for debugging.
 * 
 * @version 2.0.0
 * @date 23/05/2025
 */

import { useEffect, useState } from 'react';

// Interface for the performance metrics we track
interface PerformanceMetrics {
    LCP: number | null; // Largest Contentful Paint
    FID: number | null; // First Input Delay
    CLS: number | null; // Cumulative Layout Shift
    TTI: number | null; // Time to Interactive
    TTFB: number | null; // Time to First Byte
    pageLoaded: number | null; // Total page load time
}

export default function PerformanceMonitor() {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        LCP: null,
        FID: null,
        CLS: null,
        TTI: null,
        TTFB: null,
        pageLoaded: null
    });

    // Only show the UI in development mode
    const [showUI, setShowUI] = useState(false);

    useEffect(() => {
        // Initialize metrics tracking for all environments
        const cleanup = initPerformanceTracking((newMetrics) => {
            setMetrics(prev => ({ ...prev, ...newMetrics }));

            // Report to analytics in production
            if (process.env.NODE_ENV === 'production' && window.dataLayer && newMetrics) {
                for (const [key, value] of Object.entries(newMetrics)) {
                    if (value !== null) {
                        window.dataLayer.push({
                            event: 'web-vital',
                            metric: key,
                            value: key === 'CLS' ? Number(value).toFixed(3) : Math.round(value as number)
                        });
                    }
                }
            }
        });

        return cleanup;
    }, []);

    // Show the toggle button only in development
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <>
            <button
                onClick={() => setShowUI(prev => !prev)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    zIndex: 10000,
                }}
                title="Toggle Performance Monitor"
            >
                P
            </button>

            {showUI && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '70px',
                        right: '20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: '#0f0',
                        fontFamily: 'monospace',
                        padding: '15px',
                        borderRadius: '8px',
                        zIndex: 9999,
                        maxWidth: '300px',
                        fontSize: '12px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                        Core Web Vitals
                    </h3>
                    <MetricDisplay name="LCP" value={metrics.LCP} unit="ms" good={2500} needsImprovement={4000} />
                    <MetricDisplay name="FID" value={metrics.FID} unit="ms" good={100} needsImprovement={300} />
                    <MetricDisplay name="CLS" value={metrics.CLS} unit="" good={0.1} needsImprovement={0.25} />

                    <h3 style={{ margin: '10px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                        Other Metrics
                    </h3>
                    <MetricDisplay name="TTFB" value={metrics.TTFB} unit="ms" good={800} needsImprovement={1800} />
                    <MetricDisplay name="Page Load" value={metrics.pageLoaded} unit="ms" good={2000} needsImprovement={4000} />
                </div>
            )}
        </>
    );
}

// Helper component to display a metric with color coding
function MetricDisplay({
    name,
    value,
    unit,
    good,
    needsImprovement
}: {
    name: string;
    value: number | null;
    unit: string;
    good: number;
    needsImprovement: number;
}) {
    if (value === null) {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>{name}:</span>
                <span>Measuring...</span>
            </div>
        );
    }

    let color = '#4caf50'; // Good (green)
    if (value > needsImprovement) {
        color = '#f44336'; // Poor (red)
    } else if (value > good) {
        color = '#ff9800'; // Needs improvement (orange)
    }

    const formattedValue = unit === '' ? value.toFixed(3) : Math.round(value);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>{name}:</span>
            <span style={{ color }}>
                {formattedValue}{unit}
            </span>
        </div>
    );
}

// Initialize performance tracking
function initPerformanceTracking(onMetricsUpdate: (metrics: Partial<PerformanceMetrics>) => void) {
    if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
        return () => { }; // No-op cleanup function
    }

    const observers: PerformanceObserver[] = [];

    try {
        // LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            const lcp = lastEntry.startTime;
            onMetricsUpdate({ LCP: lcp });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        observers.push(lcpObserver);

        // FID (First Input Delay)
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
                if ('processingStart' in entry && 'startTime' in entry) {
                    const fid = (entry as any).processingStart - entry.startTime;
                    onMetricsUpdate({ FID: fid });
                }
            });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        observers.push(fidObserver);

        // CLS (Cumulative Layout Shift)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach((entry) => {
                if ('hadRecentInput' in entry && !(entry as any).hadRecentInput) {
                    clsValue += (entry as any).value;
                    onMetricsUpdate({ CLS: clsValue });
                }
            });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        observers.push(clsObserver);

        // Basic navigation timing
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                if (perfData) {
                    onMetricsUpdate({
                        TTFB: perfData.responseStart - perfData.requestStart,
                        pageLoaded: perfData.loadEventEnd - perfData.fetchStart,
                    });
                }
            }, 0);
        });

    } catch (error) {
        console.error('Error setting up performance monitoring:', error);
    }

    // Cleanup function
    return () => {
        observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (e) {
                // Ignore errors during cleanup
            }
        });
    };
}

// Type declaration for window.dataLayer
declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
    }
}
