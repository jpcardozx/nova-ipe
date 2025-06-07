'use client';

/**
 * Performance monitoring utilities for real estate website
 * Tracks Core Web Vitals and animation performance
 */

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    try {
      // Monitor Core Web Vitals
      this.observeWebVitals();
      
      // Monitor frame drops
      this.observeFramePerformance();
      
      // Monitor paint metrics
      this.observePaintMetrics();
    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }

  private observeWebVitals() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const metricName = entry.name;
          const value = entry.startTime || (entry as any).value;
          
          this.addMetric(metricName, value);
            // Log significant metrics
          if (['largest-contentful-paint', 'first-input-delay', 'cumulative-layout-shift'].includes(metricName)) {
            // console.log(`🚀 ${metricName}: ${value.toFixed(2)}ms`);
          }
        });
      });

      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        observer.observe({ type: 'first-input', buffered: true });
        observer.observe({ type: 'layout-shift', buffered: true });
        this.observers.push(observer);
      } catch (error) {
        console.warn('Web Vitals observation failed:', error);
      }
    }
  }
  private observeFramePerformance() {
    if ('requestAnimationFrame' in window) {
      let lastTime = performance.now();
      let frameCount = 0;
      let droppedFrames = 0;
      let animationId: number;

      const measureFrames = () => {
        const now = performance.now();
        const delta = now - lastTime;
        lastTime = now;
        frameCount++;

        // Detect dropped frames (assuming 60fps target)
        if (delta > 16.7 * 2) {
          droppedFrames++;
        }

        // Log frame performance less frequently (every 300 frames instead of 60)
        if (frameCount % 300 === 0) {
          const fps = 1000 / delta;
          const dropRate = (droppedFrames / frameCount) * 100;
          
          this.addMetric('fps', fps);
          this.addMetric('dropped-frames-rate', dropRate);
          
          if (dropRate > 10) { // Increased threshold to reduce noise
            console.warn(`⚠️ High frame drop rate: ${dropRate.toFixed(1)}%`);
          }
        }

        // Throttle the animation frame requests to reduce CPU usage
        if (frameCount % 3 === 0) { // Only measure every 3rd frame
          animationId = requestAnimationFrame(measureFrames);
        } else {
          setTimeout(() => {
            animationId = requestAnimationFrame(measureFrames);
          }, 16); // Wait one frame
        }
      };

      animationId = requestAnimationFrame(measureFrames);
    }
  }

  private observePaintMetrics() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {          this.addMetric(entry.name, entry.startTime);
          // console.log(`🎨 ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
        });
      });

      try {
        observer.observe({ type: 'paint', buffered: true });
        this.observers.push(observer);
      } catch (error) {
        console.warn('Paint metrics observation failed:', error);
      }
    }
  }

  private addMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  // Public methods for component performance tracking
  public trackAnimationStart(animationName: string) {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.addMetric(`animation-${animationName}`, duration);
      
      if (duration > 100) {
        console.warn(`⚠️ Slow animation "${animationName}": ${duration.toFixed(2)}ms`);
      }
    };
  }

  public trackComponentRender(componentName: string) {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.addMetric(`render-${componentName}`, duration);
      
      if (duration > 16) {
        console.warn(`⚠️ Slow render "${componentName}": ${duration.toFixed(2)}ms`);
      }
    };
  }

  public getMetricsSummary() {
    const summary: Record<string, { avg: number; max: number; count: number }> = {};
    
    this.metrics.forEach((values, name) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const max = Math.max(...values);
      
      summary[name] = {
        avg: parseFloat(avg.toFixed(2)),
        max: parseFloat(max.toFixed(2)),
        count: values.length
      };
    });
    
    return summary;
  }

  public logPerformanceReport() {
    const summary = this.getMetricsSummary();
    console.group('📊 Performance Report');
      Object.entries(summary).forEach(([metric, stats]) => {
      // console.log(`${metric}:`, stats);
    });
    
    console.groupEnd();
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// React hook for easy component integration
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    trackAnimation: (name: string) => monitor.trackAnimationStart(name),
    trackRender: (name: string) => monitor.trackComponentRender(name),
    getReport: () => monitor.getMetricsSummary(),
    logReport: () => monitor.logPerformanceReport(),
  };
}

// Utility for tracking specific Framer Motion animations
export function withPerformanceTracking<T extends Record<string, any>>(
  variants: T,
  animationName: string
): T {
  const monitor = PerformanceMonitor.getInstance();
  
  return Object.keys(variants).reduce((tracked, key) => {
    return {
      ...tracked,
      [key]: {
        ...variants[key],
        onAnimationStart: () => {
          const endTracking = monitor.trackAnimationStart(`${animationName}-${key}`);
          return endTracking;
        }
      }
    };
  }, {} as T);
}

// Auto-initialize performance monitoring in development with throttling
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const monitor = PerformanceMonitor.getInstance();
  
  // Log performance report less frequently to reduce Fast Refresh triggers
  let reportInterval: NodeJS.Timeout;
  
  // Debounce to prevent multiple intervals
  const startReporting = () => {
    if (reportInterval) clearInterval(reportInterval);
    reportInterval = setInterval(() => {
      monitor.logPerformanceReport();
    }, 60000); // Increased to 60 seconds
  };
  
  // Start after a delay to avoid initial load interference
  setTimeout(startReporting, 5000);
}
