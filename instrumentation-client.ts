/**
 * Client-side instrumentation and monitoring
 * This file is loaded dynamically by client components
 */

export function initSentry() {
  // Client-side Sentry initialization
  if (typeof window !== 'undefined') {
    console.log('Sentry client-side initialization skipped for now');
  }
}

export function initPerformanceMonitoring() {
  // Performance monitoring setup
  if (typeof window !== 'undefined') {
    console.log('Performance monitoring initialized');
  }
}

export default {
  initSentry,
  initPerformanceMonitoring
};
