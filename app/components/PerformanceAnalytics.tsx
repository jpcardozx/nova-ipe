'use client';

import { useState, useEffect } from 'react';
import { getPerformanceData } from '../utils/performance-monitor';

/**
 * Performance Diagnostics Tool
 * Provides a UI for monitoring performance in development and production
 */
export default function PerformanceAnalytics() {
    const [isVisible, setIsVisible] = useState(false);
    const [performanceData, setPerformanceData] = useState<any>(null);
    const [refreshCounter, setRefreshCounter] = useState(0);

    // Check URL for debug parameter
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Show diagnostics if debug=performance in URL
        const params = new URLSearchParams(window.location.search);
        if (params.get('debug') === 'performance') {
            setIsVisible(true);
        }

        // Keyboard shortcut (Ctrl+Alt+P) to toggle diagnostics
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.altKey && e.key === 'p') {
                e.preventDefault();
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Fetch performance data
    useEffect(() => {
        if (!isVisible) return;

        // Get performance data
        const data = getPerformanceData();
        setPerformanceData(data);

        // Refresh periodically
        const intervalId = setInterval(() => {
            setRefreshCounter(prev => prev + 1);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [isVisible, refreshCounter]);

    // Not visible, return null
    if (!isVisible || !performanceData) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '10px',
                borderRadius: '4px',
                maxWidth: '400px',
                maxHeight: '400px',
                overflow: 'auto',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h4 style={{ margin: '0', color: '#4ade80' }}>Performance Analytics</h4>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '0',
                    }}
                >
                    ×
                </button>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <h5 style={{ margin: '5px 0', color: '#60a5fa' }}>Core Web Vitals</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                    <div>LCP:</div>
                    <div style={{ color: performanceData.pageLoad.lcp && performanceData.pageLoad.lcp < 2500 ? '#4ade80' : '#ef4444' }}>
                        {performanceData.pageLoad.lcp ? `${Math.round(performanceData.pageLoad.lcp)}ms` : 'N/A'}
                    </div>
                    <div>FCP:</div>
                    <div style={{ color: performanceData.pageLoad.fcp && performanceData.pageLoad.fcp < 1800 ? '#4ade80' : '#ef4444' }}>
                        {performanceData.pageLoad.fcp ? `${Math.round(performanceData.pageLoad.fcp)}ms` : 'N/A'}
                    </div>
                    <div>TTFB:</div>
                    <div style={{ color: performanceData.pageLoad.ttfb && performanceData.pageLoad.ttfb < 800 ? '#4ade80' : '#ef4444' }}>
                        {performanceData.pageLoad.ttfb ? `${Math.round(performanceData.pageLoad.ttfb)}ms` : 'N/A'}
                    </div>
                    <div>CLS:</div>
                    <div style={{ color: performanceData.pageLoad.cls && performanceData.pageLoad.cls < 0.1 ? '#4ade80' : '#ef4444' }}>
                        {performanceData.pageLoad.cls !== null ? performanceData.pageLoad.cls.toFixed(3) : 'N/A'}
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <h5 style={{ margin: '5px 0', color: '#60a5fa' }}>Slow Resources</h5>
                <ul style={{ margin: '5px 0', padding: '0 0 0 20px' }}>
                    {Object.entries(performanceData.slowestResources).map(([resource, time]: [string, any]) => (
                        <li key={resource}>
                            {resource}: <span style={{ color: time < 1000 ? '#4ade80' : '#ef4444' }}>{Math.round(time)}ms</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h5 style={{ margin: '5px 0', color: '#60a5fa' }}>Custom Metrics</h5>
                <ul style={{ margin: '5px 0', padding: '0 0 0 20px' }}>
                    {performanceData.metrics.slice(-5).map((metric: any, index: number) => (
                        <li key={index}>
                            {metric.name}: <span style={{ color: metric.value < 1000 ? '#4ade80' : '#ef4444' }}>{Math.round(metric.value)}ms</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={() => setRefreshCounter(prev => prev + 1)}
                style={{
                    backgroundColor: '#60a5fa',
                    border: 'none',
                    borderRadius: '3px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '5px 10px',
                    marginTop: '10px',
                }}
            >
                Refresh Data
            </button>
        </div>
    );
}
