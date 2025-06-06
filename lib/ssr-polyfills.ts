// Global SSR polyfills for Nova IPE
// Must be imported before any other modules that might use 'self'

// SSR-safe polyfills
if (typeof globalThis !== 'undefined') {
  // Only polyfill in server environment
  if (typeof window === 'undefined') {
    // Define self for SSR environment
    if (typeof (globalThis as any).self === 'undefined') {
      (globalThis as any).self = globalThis;
    }
    
    // Define window for SSR environment  
    (globalThis as any).window = {
      location: { origin: 'http://localhost:3000' },
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    
    // Define document for SSR environment with enhanced properties for Next.js dev overlay
    (globalThis as any).document = {
      createElement: () => ({}),
      addEventListener: () => {},
      removeEventListener: () => {},
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      documentElement: {
        style: {},
        dataset: {},
        className: '',
        setAttribute: () => {},
        getAttribute: () => null,
      },
      head: {
        appendChild: () => {},
        removeChild: () => {},
      },
      body: {
        appendChild: () => {},
        removeChild: () => {},
        style: {},
        dataset: {},
      },
    };
      // Define navigator for SSR environment - Safe assignment with more robust properties
    if (typeof (globalThis as any).navigator === 'undefined') {
      try {
        Object.defineProperty(globalThis, 'navigator', {
          value: {
            userAgent: 'Mozilla/5.0 (compatible; Node.js SSR)',
            platform: 'Node.js',
            language: 'en-US',
            languages: ['en-US'],
            vendor: 'Nova IPE SSR',
            appName: 'Nova IPE',
            appVersion: '1.0.0',
          },
          writable: true, // Changed to true to allow Next.js to modify it if needed
          configurable: true
        });
      } catch (e) {
        // Fallback if defineProperty fails - don't set navigator at all
        console.warn('Could not define navigator in SSR context:', e);
      }
    } else if ((globalThis as any).navigator && typeof (globalThis as any).navigator.userAgent === 'undefined') {
      // If navigator exists but userAgent is undefined, add the property
      try {
        Object.defineProperty((globalThis as any).navigator, 'userAgent', {
          value: 'Mozilla/5.0 (compatible; Node.js SSR)',
          writable: true,
          configurable: true
        });
      } catch (e) {
        console.warn('Could not define navigator.userAgent in SSR context:', e);
      }
    }
  }
}

export {};
