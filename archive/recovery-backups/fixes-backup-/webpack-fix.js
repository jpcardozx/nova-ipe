/**
 * Webpack Fix for Next.js
 * 
 * This module patches Next.js webpack configuration to fix common issues:
 * - Hydration errors
 * - Static file loading issues
 * - Chunk loading problems
 */
const fs = require('fs');
const path = require('path');

// Call this from next.config.js
module.exports = function fixWebpackConfig(config, { dev, isServer }) {
  // Increase chunk size limit for better performance
  if (!isServer) {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        // Important: Create stable, larger vendor chunks
        framework: {
          name: 'framework',
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next|use-subscription)[\\/]/,
          priority: 40,
          chunks: 'all',
          enforce: true,
        },
        // Group larger libraries together
        lib: {
          test: /[\\/]node_modules[\\/]/,
          priority: 30,
          minChunks: 2,
          reuseExistingChunk: true,
        },
        // Your app code
        commons: {
          name: 'commons',
          minChunks: 2,
          priority: 20,
        },
      },
      // Avoid too many small chunks
      minSize: 20000,
      maxSize: 250000,
    };
    
    // Resolve window.location in client code
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
      // These help with certain polyfills
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    };
    
    // Prevent chunk loading errors
    config.output.chunkLoadingGlobal = `webpackChunk_${Date.now()}`;
    
    // Polyfill missing Node.js globals
    config.plugins.push(
      new config.webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      })
    );
  }
  
  return config;
};
