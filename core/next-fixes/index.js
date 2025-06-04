/**
 * Next.js Hydration and Webpack Fix
 * 
 * This module integrates all fixes for Next.js hydration and webpack issues,
 * providing a cleaner and more maintainable codebase structure.
 * 
 * Created May 30, 2025
 */

// Import all fix modules
const { applySSRPolyfills } = require('./polyfills/browser-polyfills');
const WebpackFactoryFixPlugin = require('./plugins/webpack-factory-fix');
const { createMinimalSSRPlugin } = require('./plugins/minimal-ssr-plugin');
const { patchNextJSFiles } = require('./utils/next-patcher');

// Apply patches immediately on import (server-side only)
if (typeof window === 'undefined') {
  try {
    patchNextJSFiles();
  } catch (e) {
    console.error(`Error applying Next.js patches: ${e.message}`);
  }
}

// Export everything for usage in next.config.js
module.exports = {
  applySSRPolyfills,
  WebpackFactoryFixPlugin,
  createMinimalSSRPlugin,
  patchNextJSFiles
};
