/**
 * Tipos relacionados a monitoramento de performance
 */

export interface WebVitalMetric {
    name: string;
    value: number;
    delta: number;
    id: string;
    page: string;
    rating?: 'good' | 'needs-improvement' | 'poor';
    timestamp: number;
    userAgent?: string;
    deviceType?: string;
    connection?: string;
    viewport?: string;
}

export interface PerformanceMetrics {
    lcp: number | null;
    fcp: number | null;
    cls: number | null;
    fid: number | null;
    ttfb: number | null;
    loadTime: number | null;
}

export interface ResourceTiming {
    name: string;
    duration: number;
    size: number;
    startTime: number;
}

export interface ResourceConfig {
    path: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    type: 'script' | 'style' | 'image' | 'font';
}

// First Input Delay (FID) entry interface
export interface FIDEntry extends PerformanceEntry {
    processingStart: number;
    processingEnd: number;
    startTime: number;
    duration: number;
    entryType: 'first-input';
}

// Extend PerformanceObserverEntryList for type safety
declare global {
    interface PerformanceObserverEntryList {
        getEntries(): PerformanceEntry[];
        getEntriesByType(type: 'first-input'): FIDEntry[];
        getEntriesByName(name: string): PerformanceEntry[];
    }
}
