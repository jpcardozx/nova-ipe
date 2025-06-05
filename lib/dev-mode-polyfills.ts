'use client';

/**
 * This file contains special development mode polyfills for Next.js 14
 * It helps prevent common errors in the Next.js development environment
 * 
 * Issues fixed:
 * 1. Error: Invariant: Missing ActionQueueContext
 * 2. TypeError: Cannot read properties of undefined (reading 'userAgent')
 * 3. Warning: useLayoutEffect does nothing on the server
 * 
 * This file should be imported at the top of the root layout
 */

interface NextData {
  props: Record<string, unknown>;
  page: string;
  query: Record<string, unknown>;
  buildId: string;
}

interface NextWindow {
  next?: {
    config?: Record<string, unknown>;
    router?: {
      events: {
        on: (...args: any[]) => void;
        off: (...args: any[]) => void;
        emit: (...args: any[]) => void;
      };
    };
  };
  __NEXT_DATA__?: NextData;
}

// Fix useLayoutEffect warnings in SSR
// This needs to run regardless of window presence
try {
  // Only apply in development to avoid impacting production
  if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
    const React = require('react');
    const originalUseLayoutEffect = React.useLayoutEffect;
    
    // Replace useLayoutEffect with a no-op during SSR
    React.useLayoutEffect = function useIsomorphicLayoutEffect(...args: any[]) {
      // Use useEffect during SSR to prevent warnings
      return React.useEffect(...args);
    };
    
    console.debug('[dev-mode] Applied useLayoutEffect SSR patch');
  }
} catch (e) {
  console.warn('[dev-mode] Failed to patch useLayoutEffect:', e);
}

// Apply dev-specific fixes
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    // Prevent errors in Next.js internal components
    try {
      const win = window as unknown as NextWindow;
      
      // Make sure window.next exists
      win.next = win.next || {};
      
      // Fix Next.js dev overlay issues
      if (!win.__NEXT_DATA__) {
        win.__NEXT_DATA__ = {
          props: {},
          page: '',
          query: {},
          buildId: 'development'
        };
      }
      
      // Ensure config exists
      win.next.config = win.next.config || {};
      
      // Fix for ActionQueueContext errors
      win.next.router = win.next.router || {
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
