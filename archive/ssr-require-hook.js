/**
 * SSR Require Hook - Intercepts and patches problematic modules
 * This runs before any module is loaded, ensuring globals are available
 */

const Module = require('module');
const fs = require('fs');
const path = require('path');

// Store original require method
const originalRequire = Module.prototype.require;

// Override Module.prototype.require to intercept vendors.js
Module.prototype.require = function(id) {
  // Check if this is the problematic vendors.js file
  if (id && (id.includes('vendors.js') || id.includes('.next/server/vendors.js'))) {
    
    // Ensure self is defined before loading the module
    if (typeof global.self === 'undefined') {
      global.self = global;
      global.webpackChunk_N_E = global.webpackChunk_N_E || [];
    }
  }
  
  // Call original require
  return originalRequire.apply(this, arguments);
};

// Also apply global polyfill immediately
if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
  global.self = global;
  global.window = global;
  global.webpackChunk_N_E = global.webpackChunk_N_E || [];
  
  console.log('✅ SSR globals polyfill applied via require hook');
}

module.exports = {};
