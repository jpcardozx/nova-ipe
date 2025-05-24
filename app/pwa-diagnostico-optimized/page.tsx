'use client';

/**
 * Optimized PWA Diagnostic Page
 * Lightweight version for performance testing
 */

import { useState, useEffect } from 'react';
import { useOptimizedPWA } from '../utils/optimized-pwa';

export default function OptimizedPWADiagnostic() {
    const [pwaStatus, pwaActions] = useOptimizedPWA();
    const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

    // Collect performance metrics
    useEffect(() => {
        // Wait for page to be fully loaded
        if (document.readyState === 'complete') {
            collectMetrics();
        } else {
            window.addEventListener('load', collectMetrics);
            return () => window.removeEventListener('load', collectMetrics);
        }
    }, []);

    function collectMetrics() {
        if (window.performance) {
            setTimeout(() => {
                const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                const paintTiming = performance.getEntriesByType('paint');

                const metrics = {
                    loadTime: navigationTiming ? Math.round(navigationTiming.loadEventEnd - navigationTiming.startTime) : 'N/A',
                    domContentLoaded: navigationTiming ? Math.round(navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime) : 'N/A',
                    firstPaint: paintTiming.find(p => p.name === 'first-paint')?.startTime.toFixed(0) || 'N/A',
                    firstContentfulPaint: paintTiming.find(p => p.name === 'first-contentful-paint')?.startTime.toFixed(0) || 'N/A',
                };

                setPerformanceMetrics(metrics);
            }, 0);
        }
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Optimized PWA Diagnostic</h1>

            <div className="bg-white rounded-lg shadow p-4 mb-4 border border-neutral-100">
                <h2 className="text-lg font-medium mb-2">Service Worker Status</h2>
                <div>
                    <p><span className="font-medium">Online:</span> {pwaStatus.isOnline ? 'Yes' : 'No'}</p>
                    <p><span className="font-medium">Service Worker Registered:</span> {pwaStatus.serviceWorkerRegistered ? 'Yes' : 'No'}</p>
                    <p><span className="font-medium">Service Worker Active:</span> {pwaStatus.serviceWorkerActive ? 'Yes' : 'No'}</p>
                </div>
            </div>

            {performanceMetrics && (
                <div className="bg-white rounded-lg shadow p-4 mb-4 border border-neutral-100">
                    <h2 className="text-lg font-medium mb-2">Performance Metrics</h2>
                    <div>
                        <p><span className="font-medium">Load Time:</span> {performanceMetrics.loadTime}ms</p>
                        <p><span className="font-medium">DOM Content Loaded:</span> {performanceMetrics.domContentLoaded}ms</p>
                        <p><span className="font-medium">First Paint:</span> {performanceMetrics.firstPaint}ms</p>
                        <p><span className="font-medium">First Contentful Paint:</span> {performanceMetrics.firstContentfulPaint}ms</p>
                    </div>
                </div>
            )}

            <div className="flex space-x-4">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => pwaActions.update()}
                >
                    Check for Updates
                </button>
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={() => pwaActions.install()}
                >
                    Install App
                </button>
            </div>
        </div>
    );
}
