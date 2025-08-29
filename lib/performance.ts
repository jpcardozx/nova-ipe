// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  // Mark the start of a performance measurement
  mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-start`);
    }
  }

  // Mark the end and measure the duration
  measure(name: string): number {
    if (typeof window === 'undefined' || !window.performance) {
      return 0;
    }

    try {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name, 'measure')[0];
      const duration = measure ? measure.duration : 0;
      
      this.metrics.set(name, duration);
      return duration;
    } catch (error) {
      console.warn(`Performance measurement failed for ${name}:`, error);
      return 0;
    }
  }

  // Get all metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Clear all metrics
  clear(): void {
    this.metrics.clear();
    if (typeof window !== 'undefined' && window.performance) {
      try {
        performance.clearMarks();
        performance.clearMeasures();
      } catch (error) {
        console.warn('Failed to clear performance marks/measures:', error);
      }
    }
  }

  // Report Core Web Vitals
  reportWebVitals(metric: { name: string; value: number }): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value);
    }
    
    // You can send metrics to your analytics service here
    this.metrics.set(metric.name, metric.value);
  }
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Intersection Observer hook for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Preload critical resources
export function preloadResource(href: string, type: 'image' | 'script' | 'style' = 'image'): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = type;
  
  if (type === 'image') {
    link.type = 'image/webp';
  }
  
  document.head.appendChild(link);
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();