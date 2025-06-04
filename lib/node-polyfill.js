/**
 * Node.js Environment Polyfill
 * 
 * This file provides browser globals in the Node.js environment
 * to prevent "self is not defined" errors during SSR builds.
 * 
 * @version 1.0.1
 * @date 26/05/2025
 */

// Early polyfill application - before any webpack chunks load
(function() {
  'use strict';
  
  // Define self globally for Node.js environment
  if (typeof global !== 'undefined') {
    if (typeof global.self === 'undefined') {
      global.self = global;
    }
    
    // Initialize webpack chunk arrays
    if (!global.webpackChunk_N_E) {
      global.webpackChunk_N_E = [];
    }
    
    if (global.self && !global.self.webpackChunk_N_E) {
      global.self.webpackChunk_N_E = global.webpackChunk_N_E;
    }
    
    // Add to globalThis as well for compatibility
    if (typeof globalThis !== 'undefined') {
      if (typeof globalThis.self === 'undefined') {
        globalThis.self = global;
      }
      if (!globalThis.webpackChunk_N_E) {
        globalThis.webpackChunk_N_E = global.webpackChunk_N_E;
      }
    }
  }
  
  // Log polyfill application for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Node.js SSR polyfill applied successfully');
  }
})();

module.exports = {};
