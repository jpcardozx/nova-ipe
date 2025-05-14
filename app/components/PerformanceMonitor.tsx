'use client';

/**
 * Performance Monitor Script 
 * This script helps identify rendering bottlenecks and slow components
 */

import { useEffect } from 'react';

interface PerformanceEntry {
    name: string;
    entryType: string;
    startTime: number;
    duration: number;
    [key: string]: any;
}

export default function PerformanceMonitor() {
    useEffect(() => {
        // Only run in development
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        // Create custom styles for the monitor panel
        const style = document.createElement('style');
        style.textContent = `
      .performance-monitor {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: #00ff00;
        font-family: monospace;
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
        max-width: 300px;
        font-size: 12px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        transition: all 0.3s;
        display: none;
      }
      .performance-monitor.visible {
        display: block;
      }
      .performance-monitor h3 {
        margin: 0 0 8px 0;
        font-size: 14px;
        border-bottom: 1px solid #333;
        padding-bottom: 4px;
      }
      .performance-metric {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
      }
      .performance-warning {
        color: orange;
      }
      .performance-critical {
        color: red;
        font-weight: bold;
      }
      .toggle-monitor {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 20px;
        cursor: pointer;
        z-index: 10000;
      }
    `;
        document.head.appendChild(style);

        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-monitor';
        toggleButton.textContent = 'P';
        toggleButton.title = 'Toggle Performance Monitor';
        document.body.appendChild(toggleButton);

        // Create monitor panel
        const monitorPanel = document.createElement('div');
        monitorPanel.className = 'performance-monitor';
        monitorPanel.innerHTML = `
      <h3>Performance Monitor</h3>
      <div id="metrics-container"></div>
    `;
        document.body.appendChild(monitorPanel);

        // Toggle visibility
        toggleButton.addEventListener('click', () => {
            monitorPanel.classList.toggle('visible');
        });

        // Store metrics
        const metrics: Record<string, number> = {
            FCP: 0,
            LCP: 0,
            CLS: 0,
            INP: 0,
            'Memory Usage': 0,
            'DOM Nodes': document.querySelectorAll('*').length,
            'Long Tasks': 0,
            'React Renders': 0
        };

        // Update metrics in the UI
        const updateMetricsUI = () => {
            const container = document.getElementById('metrics-container');
            if (!container) return;

            container.innerHTML = '';
            Object.entries(metrics).forEach(([key, value]) => {
                const formattedValue =
                    key === 'CLS' ? value.toFixed(3) :
                        key === 'Memory Usage' ? `${Math.round(value / 1024 / 1024)} MB` :
                            key === 'DOM Nodes' ? value.toString() :
                                key === 'Long Tasks' ? value.toString() :
                                    key === 'React Renders' ? value.toString() :
                                        `${value.toFixed(0)} ms`;

                let className = 'performance-metric';

                // Add visual indicators for poor performance
                if (
                    (key === 'FCP' && value > 1800) ||
                    (key === 'LCP' && value > 2500) ||
                    (key === 'CLS' && value > 0.1) ||
                    (key === 'INP' && value > 200) ||
                    (key === 'Long Tasks' && value > 5)
                ) {
                    className += ' performance-warning';
                }

                if (
                    (key === 'FCP' && value > 3000) ||
                    (key === 'LCP' && value > 4000) ||
                    (key === 'CLS' && value > 0.25) ||
                    (key === 'INP' && value > 500) ||
                    (key === 'Long Tasks' && value > 10)
                ) {
                    className += ' performance-critical';
                }

                container.innerHTML += `
          <div class="${className}">
            <span>${key}:</span>
            <span>${formattedValue}</span>
          </div>
        `;
            });
        };

        // Use Performance Observer to monitor metrics
        if ('PerformanceObserver' in window) {
            // FCP
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    metrics.FCP = entry.startTime;
                    updateMetricsUI();
                }
            }).observe({ type: 'paint', buffered: true });

            // LCP
            new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    metrics.LCP = entry.startTime;
                    updateMetricsUI();
                }
            }).observe({ type: 'largest-contentful-paint', buffered: true });            // CLS
            new PerformanceObserver((entryList) => {
                let clsValue = 0;
                for (const entry of entryList.getEntries()) {
                    // We need to properly handle LayoutShift entries
                    // First convert to unknown, then to our custom type
                    const layoutShift = entry as unknown;

                    // Check if the entry has the properties we need before using them
                    if (
                        layoutShift &&
                        typeof layoutShift === 'object' &&
                        'value' in layoutShift &&
                        ('hadRecentInput' in layoutShift ? !(layoutShift as any).hadRecentInput : true)
                    ) {
                        clsValue += (layoutShift as any).value;
                    }
                }
                metrics.CLS = clsValue;
                updateMetricsUI();
            }).observe({ type: 'layout-shift', buffered: true });

            // Long Tasks
            new PerformanceObserver((entryList) => {
                metrics['Long Tasks'] = entryList.getEntries().length;
                updateMetricsUI();
            }).observe({ type: 'longtask', buffered: true });
        }

        // Monitor memory usage
        const checkMemoryUsage = () => {
            if ('memory' in performance) {
                metrics['Memory Usage'] = (performance as any).memory.usedJSHeapSize;
                updateMetricsUI();
            }
        };

        // Count DOM nodes periodically
        const countDOMNodes = () => {
            metrics['DOM Nodes'] = document.querySelectorAll('*').length;
            updateMetricsUI();
        };

        // Initial update
        updateMetricsUI();

        // Setup intervals
        const memoryInterval = setInterval(checkMemoryUsage, 2000);
        const domInterval = setInterval(countDOMNodes, 2000);

        return () => {
            clearInterval(memoryInterval);
            clearInterval(domInterval);
            document.head.removeChild(style);
            document.body.removeChild(toggleButton);
            document.body.removeChild(monitorPanel);
        };
    }, []);

    return null;
}
