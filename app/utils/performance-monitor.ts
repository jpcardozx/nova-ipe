'use client';

/**
 * Performance monitoring utility
 * Helps track and analyze key performance metrics
 */

interface PerformanceMetric {
    name: string;
    value: number;
    timestamp: number;
}

interface PageLoadInfo {
    lcp: number | null;
    fcp: number | null;
    fid: number | null;
    cls: number | null;
    ttfb: number | null;
    resourceLoads: Record<string, number>;
}

// Store performance metrics
const metrics: PerformanceMetric[] = [];
const resourceTimes: Record<string, number> = {};

// Page load information
const pageLoadInfo: PageLoadInfo = {
    lcp: null,
    fcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    resourceLoads: {}
};

/**
 * Initialize performance monitoring
 * This sets up listeners for core web vitals
 */
export function initPerformanceMonitoring() {
    if (typeof window === 'undefined' || !window.performance) {
        return;
    }

    try {
        // Observe Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
                pageLoadInfo.lcp = lastEntry.startTime;
                trackMetric('LCP', lastEntry.startTime);
            }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // Observe First Contentful Paint
        const fcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const firstEntry = entries[0];
            if (firstEntry) {
                pageLoadInfo.fcp = firstEntry.startTime;
                trackMetric('FCP', firstEntry.startTime);
            }
        });
        fcpObserver.observe({ type: 'paint', buffered: true });

        // Observe First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const firstEntry = entries[0];
            if (firstEntry) {
                // @ts-ignore - TypeScript doesn't know about processingStart and processingEnd
                const delay = firstEntry.processingStart - firstEntry.startTime;
                pageLoadInfo.fid = delay;
                trackMetric('FID', delay);
            }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // Observe Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((entryList) => {
            let clsValue = 0;
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                // @ts-ignore - value property exists on layout-shift entries
                if (!entry.hadRecentInput) {
                    // @ts-ignore
                    clsValue += entry.value;
                }
            });
            pageLoadInfo.cls = clsValue;
            trackMetric('CLS', clsValue);
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        // Observe resource loading
        const resourceObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.entryType === 'resource') {
                    const url = (entry as PerformanceResourceTiming).name;
                    const duration = entry.duration;

                    // Track only slow resources (> 300ms)
                    if (duration > 300) {
                        const urlParts = url.split('/');
                        const resourceName = urlParts[urlParts.length - 1].split('?')[0];
                        resourceTimes[resourceName] = duration;
                        pageLoadInfo.resourceLoads[resourceName] = duration;
                    }
                }
            });
        });
        resourceObserver.observe({ type: 'resource', buffered: true });

        // Track TTFB from navigation
        const navObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const navigationEntry = entries[0] as PerformanceNavigationTiming;
            if (navigationEntry) {
                const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
                pageLoadInfo.ttfb = ttfb;
                trackMetric('TTFB', ttfb);
            }
        });
        navObserver.observe({ type: 'navigation', buffered: true });

        // Capture load event
        window.addEventListener('load', () => {
            setTimeout(() => {
                logPerformanceData();
            }, 1000);
        });

    } catch (err) {
        console.error('Error initializing performance monitoring:', err);
    }
}

/**
 * Track a custom performance metric
 */
export function trackMetric(name: string, value: number) {
    const metric = {
        name,
        value,
        timestamp: performance.now()
    };

    metrics.push(metric);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${name}: ${Math.round(value)}ms`);
    }

    return metric;
}

/**
 * Start measuring a custom timing
 */
export function startMeasure(name: string) {
    if (typeof performance === 'undefined') return () => { };

    const startTime = performance.now();

    return () => {
        const duration = performance.now() - startTime;
        trackMetric(name, duration);
        return duration;
    };
}

/**
 * Log performance data to console
 */
function logPerformanceData() {
    if (process.env.NODE_ENV !== 'development') return;

    console.log('==== Performance Summary ====');
    console.log(`LCP: ${pageLoadInfo.lcp ? Math.round(pageLoadInfo.lcp) + 'ms' : 'Not available'}`);
    console.log(`FCP: ${pageLoadInfo.fcp ? Math.round(pageLoadInfo.fcp) + 'ms' : 'Not available'}`);
    console.log(`TTFB: ${pageLoadInfo.ttfb ? Math.round(pageLoadInfo.ttfb) + 'ms' : 'Not available'}`);
    console.log(`FID: ${pageLoadInfo.fid ? Math.round(pageLoadInfo.fid) + 'ms' : 'Not available'}`);
    console.log(`CLS: ${pageLoadInfo.cls !== null ? pageLoadInfo.cls.toFixed(3) : 'Not available'}`);

    if (Object.keys(resourceTimes).length > 0) {
        console.log('---- Slow Resources ----');
        Object.entries(resourceTimes)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .forEach(([resource, time]) => {
                console.log(`${resource}: ${Math.round(time)}ms`);
            });
    }
}

/**
 * Get current performance data
 */
export function getPerformanceData() {
    return {
        metrics,
        pageLoad: pageLoadInfo,
        slowestResources: Object.entries(resourceTimes)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {} as Record<string, number>)
    };
}
