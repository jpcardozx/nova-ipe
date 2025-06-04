/**
 * Patch for Next.js require-hook to handle 'self' reference
 * This patches the require-hook to inject 'self' polyfill before loading modules
 */

const originalRequireHook = require('next/dist/server/require-hook');
const Module = require('module');
const fs = require('fs');
const path = require('path');

// Store original compile method
const originalCompile = Module.prototype._compile;

// Override Module._compile to inject self polyfill
Module.prototype._compile = function(content, filename) {
  // Check if this is a server-side chunk that references 'self'
  if (filename.includes('.next/server') && 
      (content.includes('self.') || content.includes('self['))) {
    
    // Inject self polyfill at the beginning
    const polyfill = `
if (typeof self === 'undefined') {
  if (typeof global !== 'undefined') {
    var self = global;
  } else if (typeof window !== 'undefined') {
    var self = window;
  } else {
    var self = this;
  }
}
`;
    content = polyfill + content;
  }
  
  // Call original compile with potentially modified content
  return originalCompile.call(this, content, filename);
};

console.log('✅ Next.js require-hook patched for self polyfill');
