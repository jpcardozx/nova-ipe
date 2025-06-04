'use client';

/**
 * This file provides compatibility shims for Sanity components 
 * that expect certain React APIs that might not be available in React 18.3.1
 */

// Mock the 'use' API if it doesn't exist in React
if (typeof React !== 'undefined' && !React.use) {
  React.use = function useShim(promise) {
    // Very basic implementation - just synchronously return the value if resolved
    // or throw the promise if not resolved
    if (promise && typeof promise.then === 'function') {
      const status = promise._status;
      const result = promise._result;
      
      if (status === 'fulfilled') {
        return result;
      } else if (status === 'rejected') {
        throw result;
      } else {
        throw promise;
      }
    }
    return promise;
  };
}

// Provide a mock for preloadModule if needed
if (typeof window !== 'undefined' && typeof window.preloadModule === 'undefined') {
  window.preloadModule = function preloadModuleShim(moduleId) {
    console.warn('preloadModule shim called for:', moduleId);
    // Return a dummy promise that resolves immediately
    return Promise.resolve();
  };
}

// Export as needed by Next.js
export default function SanityReactCompat() {
  // This is a component that can be imported where needed
  return null;
}
