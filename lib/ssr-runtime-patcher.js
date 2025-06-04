/**
 * SSR Runtime Patcher
 * 
 * Patches problematic webpack chunks at runtime by intercepting
 * the require system and injecting SSR polyfills before execution.
 * 
 * @version 1.0.0
 * @date 28/05/2025
 */

const Module = require('module');
const originalRequire = Module.prototype.require;

// Apply global polyfills immediately
if (typeof global !== 'undefined') {
  if (typeof global.self === 'undefined') {
    global.self = global;
  }
  if (typeof global.window === 'undefined') {
    global.window = global;
  }
  if (!global.webpackChunk_N_E) {
    global.webpackChunk_N_E = [];
  }
  if (global.self && !global.self.webpackChunk_N_E) {
    global.self.webpackChunk_N_E = global.webpackChunk_N_E;
  }
}

// Polyfill code to prepend to problematic files
const POLYFILL_CODE = `
// Runtime SSR Polyfill
if (typeof global !== 'undefined' && typeof self === 'undefined') {
  global.self = global;
  global.webpackChunk_N_E = global.webpackChunk_N_E || [];
  global.self.webpackChunk_N_E = global.webpackChunk_N_E;
}
if (typeof globalThis !== 'undefined' && typeof self === 'undefined') {
  globalThis.self = globalThis;
  globalThis.webpackChunk_N_E = globalThis.webpackChunk_N_E || [];
  globalThis.self.webpackChunk_N_E = globalThis.webpackChunk_N_E;
}
`;

// Override Module._compile to patch problematic files
const originalCompile = Module.prototype._compile;
Module.prototype._compile = function(content, filename) {
  // Check if this is a server vendor file that needs patching
  if (filename && 
      filename.includes('.next') && 
      filename.includes('server') && 
      (filename.includes('vendors.js') || filename.includes('webpack-runtime'))) {
    
    // Prepend polyfill to the content
    content = POLYFILL_CODE + content;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔧 SSR Runtime Patcher applied to: ${filename}`);
    }
  }
  
  return originalCompile.call(this, content, filename);
};

console.log('✅ SSR Runtime Patcher installed');

module.exports = {};
