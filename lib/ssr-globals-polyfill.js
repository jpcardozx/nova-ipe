/**
 * SSR Globals Polyfill - Definitive Solution
 * 
 * Provides browser globals in Node.js environment to prevent
 * "self is not defined" errors during SSR and build processes.
 * 
 * This polyfill must be loaded BEFORE any webpack chunks.
 * 
 * @version 2.0.0
 * @date 28/05/2025
 */

(function() {
  'use strict';

  // Exit early if already applied
  if (global.__SSR_POLYFILL_APPLIED) {
    return;
  }

  // 1. Define 'self' global for Node.js environment
  if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
    global.self = global;
  }

  // 2. Define 'window' if needed (some libraries expect it)
  if (typeof global !== 'undefined' && typeof global.window === 'undefined') {
    global.window = global;
  }

  // 3. Initialize webpack chunk arrays for Next.js
  if (!global.webpackChunk_N_E) {
    global.webpackChunk_N_E = [];
  }

  // 4. Ensure self has the webpack chunk array
  if (global.self && !global.self.webpackChunk_N_E) {
    global.self.webpackChunk_N_E = global.webpackChunk_N_E;
  }

  // 5. Apply to globalThis for full compatibility
  if (typeof globalThis !== 'undefined') {
    if (typeof globalThis.self === 'undefined') {
      globalThis.self = global;
    }
    if (!globalThis.webpackChunk_N_E) {
      globalThis.webpackChunk_N_E = global.webpackChunk_N_E;
    }
  }

  // 6. Define other browser globals that might be needed
  const browserGlobals = [
    'document',
    'navigator',
    'location',
    'history',
    'localStorage',
    'sessionStorage'
  ];

  browserGlobals.forEach(globalName => {
    if (typeof global[globalName] === 'undefined') {
      global[globalName] = {};
    }
  });

  // 7. Mock performance API if needed
  if (typeof global.performance === 'undefined') {
    global.performance = {
      now: () => Date.now(),
      mark: () => {},
      measure: () => {},
      getEntriesByType: () => [],
    };
  }

  // 8. Mark as applied to prevent double application
  global.__SSR_POLYFILL_APPLIED = true;

  // 9. Log success in development
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    console.log('✅ SSR Globals Polyfill applied successfully');
  }

})();

// Export the self global for webpack ProvidePlugin
module.exports = {
  self: global.self || global,
  window: global.window || global,
  document: global.document || {},
  webpackChunk_N_E: global.webpackChunk_N_E || [],
};
