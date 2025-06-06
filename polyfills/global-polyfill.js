/**
 * Global Polyfill for Server-Side Rendering
 * 
 * Provides browser globals in Node.js environment to prevent
 * "self is not defined" and related errors during SSR.
 */

(function() {
  'use strict';

  // Exit early if already applied
  if (global.__SSR_POLYFILL_APPLIED) {
    return;
  }

  // Apply to both global and globalThis
  const targets = [global];
  if (typeof globalThis !== 'undefined') {
    targets.push(globalThis);
  }

  targets.forEach(target => {
    // Polyfill self
    if (typeof target.self === 'undefined') {
      target.self = target;
    }
    
    // Polyfill window
    if (typeof target.window === 'undefined') {
      target.window = target;
    }
    
    // Polyfill document
    if (typeof target.document === 'undefined') {
      target.document = {};
    }
    
    // Polyfill navigator
    if (typeof target.navigator === 'undefined') {
      target.navigator = {};
    }
    
    // Polyfill webpack chunks
    if (!target.webpackChunk_N_E) {
      target.webpackChunk_N_E = [];
    }
  });

  // Mark as applied
  global.__SSR_POLYFILL_APPLIED = true;

  // Log success in development
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    console.log('✅ SSR Globals Polyfill applied successfully');
  }
})();

// Export global for webpack alias resolution
module.exports = global;
