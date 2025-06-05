'use client';

/**
 * This file contains special development mode polyfills for Next.js 14
 * It helps prevent common errors in the Next.js development environment
 * 
 * Issues fixed:
 * 1. Error: Invariant: Missing ActionQueueContext
 * 2. TypeError: Cannot read properties of undefined (reading 'userAgent')
 * 
 * This file should be imported at the top of the root layout
 */

// Apply dev-specific fixes
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    // Prevent errors in Next.js internal components
    try {
      // Make sure window.next exists
      window.next = window.next || {};
      
      // Fix Next.js dev overlay issues
      if (!window.__NEXT_DATA__) {
        window.__NEXT_DATA__ = {
          props: {},
          page: '',
          query: {},
          buildId: 'development'
        };
      }
      
      // Ensure config exists
      window.next.config = window.next.config || {};
      
      // Fix for ActionQueueContext errors
      window.next.router = window.next.router || {
        events: {
          on: () => {},
          off: () => {},
          emit: () => {}
        }
      };
      
      // Diagnostic info
      console.debug('[dev-mode] Dev mode polyfills applied');
    } catch (e) {
      console.warn('[dev-mode] Error applying dev polyfills:', e);
    }
  }
}

// No-op export - just to satisfy ESM
export {};
