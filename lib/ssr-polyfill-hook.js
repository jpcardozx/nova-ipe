/**
 * SSR Polyfill Hook
 * 
 * This module patches the require system to inject SSR polyfills
 * directly into problematic webpack chunks before they execute.
 * 
 * @version 1.0.0
 * @date 28/05/2025
 */

const Module = require('module');
const fs = require('fs');
const path = require('path');

// Store original require method
const originalRequire = Module.prototype.require;

// Apply global polyfill immediately
if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
  global.self = global;
  global.webpackChunk_N_E = global.webpackChunk_N_E || [];
  global.self.webpackChunk_N_E = global.webpackChunk_N_E;
}

// SSR polyfill code to inject
const SSR_POLYFILL = `
// SSR Polyfill - Applied by ssr-polyfill-hook.js
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

// Override require to patch problematic files
Module.prototype.require = function(id) {
  const result = originalRequire.apply(this, arguments);
  
  // Check if this is a server vendors file that needs patching
  if (typeof id === 'string' && id.includes('vendors.js') && id.includes('.next/server')) {
    // If this is the problematic vendors file, we've already applied global polyfills
    // so it should work now
    console.log('✅ SSR polyfill applied for vendors.js');
  }
  
  return result;
};

// Patch fs.readFileSync for webpack chunks
const originalReadFileSync = fs.readFileSync;
fs.readFileSync = function(filename, options) {
  const result = originalReadFileSync.apply(this, arguments);
  
  // If this is a server vendors file, inject polyfill
  if (typeof filename === 'string' && 
      filename.includes('vendors.js') && 
      filename.includes('.next/server') &&
      typeof result === 'string') {
    
    console.log('🔧 Patching vendors.js with SSR polyfill');
    return SSR_POLYFILL + result;
  }
  
  return result;
};

console.log('✅ SSR polyfill hook installed');

module.exports = {};
