/**
 * Next.js Webpack Configuration - Refractor Module Fix
 * @description Configuration to resolve refractor module import issues
 * @version 8.0.0 - REFRACTOR FIX
 * @author System Repair
 * @date 26/05/2025
 */

const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

/**
 * REFRACTOR FIX: Configuration to resolve refractor module import issues:
 * 1. Create proper aliases for refractor language modules
 * 2. Handle missing refractor/lang/lang.js import
 * 3. Ensure all refractor languages are available
 * 4. Fix Sanity's refractor dependencies
 */
function createWebpackConfig(config, { isServer, dev, buildId }) {
  
  // Basic optimization settings
  config.optimization = config.optimization || {};
  
  if (!isServer && dev) {
    config.optimization.splitChunks = false;
    config.optimization.runtimeChunk = false;
    config.optimization.minimize = false;
  }
  
  // Global object safety
  config.output = config.output || {};
  config.output.globalObject = 'globalThis';
  config.output.chunkLoadingGlobal = 'webpackChunk_nova_ipe';
  
  // Module resolution configuration
  config.resolve = config.resolve || {};
  config.resolve.symlinks = false;
  config.resolve.cacheWithContext = false;  
  // Fallback configuration for server-side rendering
  if (!isServer) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      util: false,
      buffer: false,
      events: false,
      'react/jsx-dev-runtime': false,
      'react/jsx-runtime': false,
      'get-it': false,
      'get-it/middleware': false
    };
  }

  // ===== REFRACTOR MODULE RESOLUTION FIX =====
  
  if (!isServer) {
    config.resolve.alias = config.resolve.alias || {};
    
    try {
      // Find refractor package location
      const refractorPkgPath = require.resolve('refractor/package.json');
      const refractorDir = path.dirname(refractorPkgPath);
      const langDir = path.join(refractorDir, 'lang');
      
      // Create comprehensive language module aliases
      const languageModules = [
        'bash', 'javascript', 'json', 'jsx', 'typescript', 'tsx', 
        'css', 'markdown', 'html', 'python', 'java', 'cpp', 'c',
        'csharp', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin'
      ];
      
      // Set up aliases for all language modules
      languageModules.forEach(lang => {
        const langFile = path.join(langDir, `${lang}.js`);
        if (fs.existsSync(langFile)) {
          config.resolve.alias[`refractor/lang/${lang}.js`] = langFile;
          config.resolve.alias[`refractor/lang/${lang}`] = langFile;
        }
      });
      
      // Special handling for the problematic lang.js file
      const javascriptLangFile = path.join(langDir, 'javascript.js');
      if (fs.existsSync(javascriptLangFile)) {
        config.resolve.alias['refractor/lang/lang.js'] = javascriptLangFile;
        config.resolve.alias['refractor/lang/lang'] = javascriptLangFile;
      } else {
        // Fallback to our custom module
        config.resolve.alias['refractor/lang/lang.js'] = path.resolve(__dirname, 'lib/refractor-lang-fallback.js');
        config.resolve.alias['refractor/lang/lang'] = path.resolve(__dirname, 'lib/refractor-lang-fallback.js');
      }
      
      // Additional get-it aliases for Sanity
      config.resolve.alias['get-it/middleware'] = path.resolve(__dirname, 'node_modules/get-it/dist/middleware.browser.js');
      config.resolve.alias['get-it'] = path.resolve(__dirname, 'node_modules/get-it/dist/index.browser.js');
      config.resolve.alias['get-it/dist/middleware'] = path.resolve(__dirname, 'node_modules/get-it/dist/middleware.browser.js');
      config.resolve.alias['get-it/dist/index'] = path.resolve(__dirname, 'node_modules/get-it/dist/index.browser.js');
      
      // Sanity visual editing
      config.resolve.alias['@sanity/visual-editing/react'] = path.resolve(__dirname, 'node_modules/@sanity/visual-editing/dist/react/index.js');
      
      console.log('✅ Refractor language module aliases configured successfully');
      
    } catch (err) {
      console.warn('⚠️ Could not configure refractor paths:', err.message);
      
      // Fallback configuration if refractor is not found
      config.resolve.alias['refractor/lang/lang.js'] = path.resolve(__dirname, 'lib/refractor-lang-fallback.js');
      config.resolve.alias['refractor/lang/lang'] = path.resolve(__dirname, 'lib/refractor-lang-fallback.js');
    }
  }  
  // ESM Module handling
  config.resolve.extensionAlias = {
    ...config.resolve.extensionAlias,
    '.js': ['.js', '.ts', '.tsx'],
    '.mjs': ['.mjs', '.js']
  };

  // ===== PLUGIN CONFIGURATION =====
  
  config.plugins = config.plugins || [];
  
  // Essential globals
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.__NEXT_VERSION': JSON.stringify('15.2.4'),
      'process.env.__BUILD_ID': JSON.stringify(buildId || 'dev'),
      'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
    })
  );

  // Development optimizations
  if (dev) {
    config.cache = false;
    config.optimization.removeAvailableModules = false;
    config.optimization.removeEmptyChunks = false;
    config.optimization.mergeDuplicateChunks = false;
    config.optimization.flagIncludedChunks = false;
    config.optimization.moduleIds = 'named';
    config.optimization.chunkIds = 'named';
    config.mode = 'development';
  }

  // Suppress warnings
  config.ignoreWarnings = [/Failed to parse source map/];
  config.stats = 'minimal';

  return config;
}

// ===== EXPORT =====
module.exports = createWebpackConfig;
