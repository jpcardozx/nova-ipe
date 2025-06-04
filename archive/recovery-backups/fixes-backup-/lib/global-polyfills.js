/**
 * Global polyfills for Next.js SSR
 * This file provides essential polyfills for browser globals in SSR environment
 */

if (typeof globalThis !== 'undefined') {
  // Ensure self exists
  if (typeof globalThis.self === 'undefined') {
    globalThis.self = globalThis;
  }

  // Ensure window exists
  if (typeof globalThis.window === 'undefined') {
    globalThis.window = globalThis;
  }

  // Add storage polyfills for next-themes
  if (typeof globalThis.localStorage === 'undefined') {
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => null,
      removeItem: () => null,
      clear: () => null,
      key: () => null,
      length: 0
    };
  }

  if (typeof globalThis.sessionStorage === 'undefined') {
    globalThis.sessionStorage = globalThis.localStorage;
  }

  // Ensure document exists with minimal API needed
  if (typeof globalThis.document === 'undefined') {
    globalThis.document = {
      addEventListener: () => {},
      removeEventListener: () => {},
      getElementsByTagName: () => [],
      createElement: () => ({
        setAttribute: () => {},
        style: {}
      }),
      querySelector: () => null,
      querySelectorAll: () => [],
      documentElement: {
        style: {},
        getAttribute: () => null,
        setAttribute: () => null
      }
    };
  }

  // Ensure navigator exists
  if (typeof globalThis.navigator === 'undefined') {
    globalThis.navigator = {
      userAgent: 'node',
      platform: 'node',
    };
  }

  // Ensure critical browser objects exist
  const criticalBrowserObjects = ['HTMLElement', 'Event', 'CustomEvent'];
  criticalBrowserObjects.forEach(obj => {
    if (typeof globalThis[obj] === 'undefined') {
      globalThis[obj] = function() {};
    }
  });
}
