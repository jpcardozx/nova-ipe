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

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Interface for the performance metrics we track
interface PerformanceMetrics {
    fcp: number | null; // First Contentful Paint
    lcp: number | null; // Largest Contentful Paint
    cls: number | null; // Cumulative Layout Shift
    fid: number | null; // First Input Delay
    ttfb: number | null; // Time to First Byte
}

interface PerformanceMonitorProps {
    enabled?: boolean;
    showMetrics?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
    enabled = true,
    showMetrics = false
}) => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fcp: null,
        lcp: null,
        cls: null,
        fid: null,
        ttfb: null
    });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!enabled || typeof window === 'undefined') return;

        const collectMetrics = () => {
            // Collect performance metrics
            const navigation = performance.getEntriesByType('navigation')[0] as any;

            if (navigation) {
                setMetrics(prev => ({
                    ...prev,
                    ttfb: navigation.responseStart - navigation.requestStart
                }));
            }

            // Observe Web Vitals
            if ('PerformanceObserver' in window) {
                // First Contentful Paint
                const fcpObserver = new PerformanceObserver((list) => {
                    const fcpEntry = list.getEntries().find(entry => entry.name === 'first-contentful-paint');
                    if (fcpEntry) {
                        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
                    }
                });
                fcpObserver.observe({ entryTypes: ['paint'] });

                // Largest Contentful Paint
                const lcpObserver = new PerformanceObserver((list) => {
                    const lcpEntry = list.getEntries()[list.getEntries().length - 1];
                    if (lcpEntry) {
                        setMetrics(prev => ({ ...prev, lcp: lcpEntry.startTime }));
                    }
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // Cumulative Layout Shift
                const clsObserver = new PerformanceObserver((list) => {
                    let clsValue = 0;
                    list.getEntries().forEach((entry: any) => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    setMetrics(prev => ({ ...prev, cls: clsValue }));
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });

                // First Input Delay
                const fidObserver = new PerformanceObserver((list) => {
                    const fidEntry = list.getEntries()[0] as any;
                    if (fidEntry) {
                        setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
                    }
                });
                fidObserver.observe({ entryTypes: ['first-input'] });

                return () => {
                    fcpObserver.disconnect();
                    lcpObserver.disconnect();
                    clsObserver.disconnect();
                    fidObserver.disconnect();
                };
            }
        };

        collectMetrics();
    }, [enabled]);

    const getMetricStatus = (metric: number | null, thresholds: { good: number; needs: number }) => {
        if (metric === null) return 'loading';
        if (metric <= thresholds.good) return 'good';
        if (metric <= thresholds.needs) return 'needs-improvement';
        return 'poor';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good': return 'text-green-600 bg-green-50 border-green-200';
            case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'poor': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    if (!enabled || !showMetrics) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 right-4 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">Performance Metrics</h4>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-2 text-xs">
                        {/*
              { label: 'FCP', value: metrics.fcp, thresholds: { good: 1800, needs: 3000 }, unit: 'ms' },
              { label: 'LCP', value: metrics.lcp, thresholds: { good: 2500, needs: 4000 }, unit: 'ms' },
              { label: 'CLS', value: metrics.cls, thresholds: { good: 0.1, needs: 0.25 }, unit: '' },
              { label: 'FID', value: metrics.fid, thresholds: { good: 100, needs: 300 }, unit: 'ms' },
              { label: 'TTFB', value: metrics.ttfb, thresholds: { good: 800, needs: 1800 }, unit: 'ms' }
            */}
                        {Object.entries(metrics).map(([key, value]) => {
                            const thresholds = { good: 0, needs: 0 };
                            let unit = '';

                            switch (key) {
                                case 'fcp':
                                    thresholds.good = 1800;
                                    thresholds.needs = 3000;
                                    unit = 'ms';
                                    break;
                                case 'lcp':
                                    thresholds.good = 2500;
                                    thresholds.needs = 4000;
                                    unit = 'ms';
                                    break;
                                case 'cls':
                                    thresholds.good = 0.1;
                                    thresholds.needs = 0.25;
                                    break;
                                case 'fid':
                                    thresholds.good = 100;
                                    thresholds.needs = 300;
                                    unit = 'ms';
                                    break;
                                case 'ttfb':
                                    thresholds.good = 800;
                                    thresholds.needs = 1800;
                                    unit = 'ms';
                                    break;
                                default:
                                    break;
                            }

                            const status = getMetricStatus(value, thresholds);
                            const colorClass = getStatusColor(status);

                            return (
                                <div key={key} className="flex items-center justify-between">
                                    <span className="text-gray-600">{key.toUpperCase()}:</span>
                                    <span className={`px-2 py-1 rounded border text-xs font-medium ${colorClass}`}>
                                        {value !== null
                                            ? `${Math.round(value * 100) / 100}${unit}`
                                            : 'Loading...'
                                        }
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                            Nova Ipê - Performance Optimized
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Toggle button */}
            <motion.button
                onClick={() => setIsVisible(!isVisible)}
                className="fixed bottom-4 right-4 z-40 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </motion.button>
        </AnimatePresence>
    );
};

export default PerformanceMonitor;

// Type declaration for window.dataLayer
declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
    }
}
