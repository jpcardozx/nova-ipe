'use client';

/**
 * Next.js 14 Dev Overlay Polyfill
 * This polyfill specifically addresses React Dev Overlay errors in Next.js 14
 * Fixes issues like "TypeError: Cannot read properties of undefined (reading 'userAgent')"
 */

// Apply polyfills for development mode only
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    // Fix for dev overlay accessing navigator.userAgent before it's available
    if (typeof navigator === 'undefined') {
      try {
        // Create a global navigator object if missing
        Object.defineProperty(window, 'navigator', {
          value: {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome Dev SSR',
            platform: 'Win32',
            vendor: 'Nova IPE Polyfill',
          },
          writable: true,
          configurable: true,
        });
      } catch (e) {
        console.warn('Failed to polyfill navigator for dev overlay:', e);
      }
    } else if (navigator && typeof navigator.userAgent === 'undefined') {
      try {
        // Add userAgent property to existing navigator if missing
        Object.defineProperty(navigator, 'userAgent', {
          value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome Dev SSR',
          writable: true,
          configurable: true,
        });
      } catch (e) {
        console.warn('Failed to add userAgent to navigator:', e);
      }
    }
  }
}

export {};
