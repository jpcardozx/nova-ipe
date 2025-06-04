/**
 * Server-side polyfills for Next.js
 * This file provides essential browser globals for server-side rendering
 */

// Only run on server side
if (typeof window === 'undefined') {
  // Create a shared global object
  const globalObj = typeof global !== 'undefined' ? global : 
                   typeof globalThis !== 'undefined' ? globalThis : 
                   this || {};

  // Make self available
  if (typeof globalObj.self === 'undefined') {
    globalObj.self = globalObj;
  }

  // Make window available
  if (typeof globalObj.window === 'undefined') {
    globalObj.window = globalObj;
  }

  // Ensure essential browser APIs exist
  if (typeof globalObj.localStorage === 'undefined') {
    globalObj.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null
    };
  }

  // Minimal document implementation
  if (typeof globalObj.document === 'undefined') {
    globalObj.document = {
      documentElement: { 
        style: {}, 
        setAttribute: () => {}, 
        getAttribute: () => null,
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false
        }
      },
      createElement: () => ({ 
        style: {}, 
        setAttribute: () => {},
        getAttribute: () => null,
        appendChild: () => {}
      }),
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      removeEventListener: () => {},
      getElementsByTagName: () => []
    };
  }

  // Ensure navigator is available
  if (typeof globalObj.navigator === 'undefined') {
    globalObj.navigator = {
      userAgent: 'node',
      platform: 'node'
    };
  }

  // Provide implementation for critical browser objects
  ['HTMLElement', 'Element', 'Event', 'CustomEvent'].forEach(obj => {
    if (typeof globalObj[obj] === 'undefined') {
      globalObj[obj] = function() {};
      globalObj[obj].prototype = {};
    }
  });

  console.log('✅ Server-side browser polyfills applied successfully');
}

module.exports = {};
