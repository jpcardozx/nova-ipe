/**
 * Browser Polyfills for Server-Side Rendering
 * 
 * Provides essential browser globals during SSR to prevent errors with code
 * that expects browser-specific APIs to be available.
 * 
 * Created May 30, 2025
 */

// Determine environment
const isServer = typeof window === 'undefined';
const isClient = !isServer;

/**
 * Apply SSR Browser Globals Polyfills
 * These polyfills provide essential browser globals during SSR
 */
function applySSRPolyfills() {
  if (isServer) {
    const globalObj = typeof global !== 'undefined' ? global : 
                     typeof globalThis !== 'undefined' ? globalThis : 
                     this || {};
    
    // Critical object polyfills
    const polyfills = {
      // Self reference
      self: globalObj,
      
      // Window reference
      window: globalObj,
      
      // Storage
      localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0
      },
      
      sessionStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0
      },
      
      // Location polyfill
      location: {
        protocol: 'http:',
        host: `localhost:${process.env.PORT || 3002}`,
        hostname: 'localhost',
        port: process.env.PORT || '3002',
        pathname: '/',
        search: '',
        hash: '',        href: `http://localhost:${process.env.PORT || 3002}/`,
        origin: `http://localhost:${process.env.PORT || 3002}`,
        toString: () => `http://localhost:${process.env.PORT || 3002}/`,
        assign: () => {},
        replace: () => {},
        reload: () => {}
      },
      
      // Document stub with critical methods
      document: {
        documentElement: {
          style: {},
          classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
            toggle: () => false
          },
          setAttribute: () => {},
          getAttribute: () => null
        },
        body: {
          classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
            toggle: () => false
          }
        },
        createElement: () => ({ 
          style: {}, 
          setAttribute: () => {},
          getAttribute: () => null,
          appendChild: () => {},
          classList: {
            add: () => {},
            remove: () => {}
          }
        }),
        createTextNode: () => ({}),
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementById: () => null,
        getElementsByClassName: () => [],
        getElementsByTagName: () => [],
        addEventListener: () => {},
        removeEventListener: () => {}
      },
      
      // Navigator stub
      navigator: {
        userAgent: 'node',
        platform: 'node',
        language: 'en',
        languages: ['en']
      }
    };

    // Apply all polyfills to the global object
    Object.entries(polyfills).forEach(([key, value]) => {
      if (typeof globalObj[key] === 'undefined') {
        globalObj[key] = value;
      }
    });

    // Create HTML* element classes
    ['HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent'].forEach(className => {
      if (typeof globalObj[className] === 'undefined') {
        globalObj[className] = class MockElement {};
        globalObj[className].prototype = {};
      }
    });

    // Special case for matchMedia
    if (typeof globalObj.matchMedia === 'undefined') {
      globalObj.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true
      });
    }

    console.log('✅ Server-side browser globals polyfilled successfully');
  }
}

// Export the polyfill function
module.exports = {
  applySSRPolyfills
};
