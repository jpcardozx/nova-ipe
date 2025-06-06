'use client';

/**
 * Next.js 14 Dev Overlay Polyfill
 * This polyfill specifically addresses React Dev Overlay errors in Next.js 14
 * Fixes issues like "TypeError: Cannot read properties of undefined (reading 'userAgent')"
 * 
 * This provides comprehensive polyfills for the Next.js development overlay
 * which often accesses browser APIs that might not be available during SSR
 */

// Apply polyfills for development mode only
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    try {
      // --- Navigator Polyfills ---
      
      // Fix for dev overlay accessing navigator.userAgent before it's available
      if (typeof navigator === 'undefined') {
        // Create a complete navigator object if missing
        Object.defineProperty(window, 'navigator', {
          value: {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome Dev SSR',
            platform: 'Win32',
            vendor: 'Nova IPE Polyfill',
            language: 'en-US',
            languages: ['en-US', 'en'],
            onLine: true,
            hardwareConcurrency: 8,
            deviceMemory: 8,
            maxTouchPoints: 0,
            cookieEnabled: true,
            doNotTrack: null,
          },
          writable: true,
          configurable: true,
        });
      } else if (navigator) {
        // Add missing properties to existing navigator object
        const navigatorProps = {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome Dev SSR',
          platform: navigator.platform || 'Win32',
          vendor: navigator.vendor || 'Nova IPE Polyfill',
          language: navigator.language || 'en-US',
          languages: navigator.languages || ['en-US', 'en'],
          onLine: true,
          hardwareConcurrency: 8,
          deviceMemory: 8,
          maxTouchPoints: 0,
          cookieEnabled: true,
          doNotTrack: null,
        };
        
        // Add all missing properties
        Object.entries(navigatorProps).forEach(([key, value]) => {
          if (navigator[key as keyof Navigator] === undefined) {
            try {
              Object.defineProperty(navigator, key, {
                value,
                writable: true,
                configurable: true,
              });
            } catch (e) {
              // Suppress errors for read-only properties
            }
          }
        });
      }

      // --- Window Events Handling ---
      
      // Fix for overlay event listeners
      if (!window.matchMedia) {
        window.matchMedia = (query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        });
      }
      
      // --- Browser Feature Detection ---
      
      // Fix for overlay feature detection
      if (typeof document !== 'undefined') {
        if (!document.fonts) {
          Object.defineProperty(document, 'fonts', {
            value: {
              ready: Promise.resolve(),
              check: () => false,
              load: () => Promise.resolve([]),
            },
            configurable: true,
          });
        }
      }
      
      console.debug('[next-polyfill] Dev overlay polyfill applied');
    } catch (e) {
      console.warn('[next-polyfill] Error applying dev overlay polyfills:', e);
    }
  }
}

export {};
