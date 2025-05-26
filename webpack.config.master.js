/**
 * Next.js Webpack Configuration - EMERGENCY RUNTIME FIX
 * @description Configuração de emergência para resolver corrupção total do webpack runtime
 * @version 7.0.0 - CRITICAL FIX
 * @author Emergency Runtime Repair
 * @date 25/05/2025
 */

const path = require('path');
const webpack = require('webpack');

/**
 * EMERGENCY FIX: Configuração que resolve corrupção crítica do webpack:
 * 1. Module factory corruption (Cannot read properties of undefined reading 'call')
 * 2. Runtime chunk initialization failures
 * 3. Client-side module loading breakdown
 * 4. React hydration system collapse
 */
function createWebpackConfig(config, { isServer, dev, buildId }) {
  // ===== EMERGENCY: Prevent Module Factory Corruption =====
  
  // 1. CRITICAL: Disable problematic optimizations that break module factories
  config.optimization = config.optimization || {};
  
  if (!isServer && dev) {
    // DEVELOPMENT: Ultra-safe configuration
    config.optimization.splitChunks = false; // Disable chunk splitting entirely in dev
    config.optimization.runtimeChunk = false; // Disable runtime chunks in dev
    config.optimization.concatenateModules = false;
    config.optimization.providedExports = false;
    config.optimization.usedExports = false;
    config.optimization.sideEffects = false;
    config.optimization.minimize = false;
  }
  
  // 2. Global Object Safety
  config.output = config.output || {};
  config.output.globalObject = 'globalThis';
  config.output.chunkLoadingGlobal = 'webpackChunk_nova_ipe';    // 3. EMERGENCY: Module Resolution Hardening
  config.resolve = config.resolve || {};
  config.resolve.symlinks = false; // Disable symlinks to prevent module confusion
  config.resolve.cacheWithContext = false;
  
  // 4. Strict module rules to prevent factory corruption
  if (!isServer) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      util: false,
      buffer: false,
      events: false,      'react/jsx-dev-runtime': false, // Prevent double loading
      'react/jsx-runtime': false,
      // Add ESM fallbacks for get-it  
      'get-it': false,
      'get-it/middleware': false
    };
  }
  // 5. SANITY FIX: Specific module resolution for Sanity packages
  if (!isServer) {
    config.resolve.alias = {
      ...config.resolve.alias,      // Fix get-it ES module resolution for browser
      'get-it/middleware': path.resolve(__dirname, 'node_modules/get-it/dist/middleware.browser.js'),
      'get-it': path.resolve(__dirname, 'node_modules/get-it/dist/index.browser.js'),
      // Additional fallbacks for middleware submodules
      'get-it/dist/middleware': path.resolve(__dirname, 'node_modules/get-it/dist/middleware.browser.js'),
      'get-it/dist/index': path.resolve(__dirname, 'node_modules/get-it/dist/index.browser.js'),      // Visual editing fallbacks
      '@sanity/visual-editing/react': path.resolve(__dirname, 'node_modules/@sanity/visual-editing/dist/react/index.js')
    };  }
  
  // 6. ESM Module handling for get-it and Sanity
  config.resolve.extensionAlias = {
    ...config.resolve.extensionAlias,
    '.js': ['.js', '.ts', '.tsx'],
    '.mjs': ['.mjs', '.js']
  };
  
  // ===== EMERGENCY: Plugin Configuration =====
  
  // 5. Minimal, safe plugins only
  config.plugins = config.plugins || [];
  
  // Essential globals only
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.__NEXT_VERSION': JSON.stringify('15.2.4'),
      'process.env.__BUILD_ID': JSON.stringify(buildId || 'dev'),
      'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
    })
  );

  // 6. CRITICAL: Development optimizations for stability
  if (dev) {
    // Disable filesystem cache that might be corrupted
    config.cache = false;
    
    // Disable all advanced optimizations
    config.optimization.removeAvailableModules = false;
    config.optimization.removeEmptyChunks = false;
    config.optimization.mergeDuplicateChunks = false;
    config.optimization.flagIncludedChunks = false;
    config.optimization.moduleIds = 'named';
    config.optimization.chunkIds = 'named';
    
    // Force stable module loading
    config.mode = 'development';
  }

  // ===== EMERGENCY: Error Suppression =====
  
  // 7. Suppress all non-critical warnings that might interfere
  config.ignoreWarnings = [/.*/]; // Ignore ALL warnings temporarily
  
  // 8. Stats configuration for minimal output
  config.stats = 'minimal';

  return config;
}

// ===== EXPORT =====
module.exports = createWebpackConfig;
