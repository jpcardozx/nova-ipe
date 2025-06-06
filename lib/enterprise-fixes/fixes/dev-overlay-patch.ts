'use client';

/**
 * Development Overlay Patch
 * 
 * Fixes Next.js development overlay issues:
 * - TypeError: Cannot read properties of undefined (reading 'userAgent')
 * - Additional dev overlay rendering issues
 * 
 * @version 3.0.0
 * @date June 4, 2025
 */

// Add proper window type declarations in a module
declare module 'next' {
  interface NEXT_DATA {
    props: any;
    page: string;
    query: any;
    buildId: string;
  }
}

declare global {
  interface Window {
    next: {
      version?: string;
      router?: {
        events: {
          on: (...args: any[]) => void;
          off: (...args: any[]) => void;
          emit: (...args: any[]) => void;
        };
      };
    };
  }
}

// Only apply in development mode
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    // Fix for dev overlay - ensure navigator.userAgent exists
    if (typeof navigator !== 'undefined' && !navigator.userAgent) {
      try {
        Object.defineProperty(navigator, 'userAgent', {
          value: 'Mozilla/5.0 NextDevOverlay',
          writable: true, 
          configurable: true,
        });
      } catch (e) {
        console.warn('Failed to patch navigator.userAgent:', e);
      }
    }

    // Ensure Next.js data exists
    if (!(window as any).__NEXT_DATA__) {
      (window as any).__NEXT_DATA__ = {
        props: {},
        page: '',
        query: {},
        buildId: 'development'
      };
    }

    // These globals should be defined if missing
    window.next = window.next || {};
    window.next.version = window.next.version || '14.2.15';
    
    // Fix for error overlay and hot reload
    window.next.router = window.next.router || {
      events: {
        on: () => {},
        off: () => {},
        emit: () => {},
      }
    };
  }

  // Log success
  console.debug('✅ Development overlay patches applied');
}

export {};
