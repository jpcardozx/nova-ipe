// @ts-nocheck
/**
 * Next.js Webpack Fix - Fixed Version
 * Comprehensive webpack configuration fixes
 * 
 * Created May 31, 2025
 */

const path = require('path');

// Enhanced webpack configuration fixes
function applyWebpackFixes(config, { dev, isServer }) {
  // Ensure config exists
  if (!config) {
    config = {};
  }

  // Initialize resolve if not exists
  if (!config.resolve) {
    config.resolve = {};
  }

  // Add alias for better module resolution
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.join(process.cwd()),
    '~': path.join(process.cwd()),
  };

  // Fallback configuration for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    crypto: false,
    stream: false,
    util: false,
    buffer: false,
    process: false,
  };

  // Module configuration
  config.module = config.module || {};
  config.module.rules = config.module.rules || [];

  // Add rule for handling potential problematic modules
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  // Optimization configuration
  if (dev) {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
  }

  // Plugin configuration
  config.plugins = config.plugins || [];

  // Experiments configuration for modern features
  config.experiments = {
    ...config.experiments,
    topLevelAwait: true,
  };

  // Performance hints
  config.performance = {
    hints: dev ? false : 'warning',
    maxAssetSize: 1000000,
    maxEntrypointSize: 1000000,
  };

  return config;
}

module.exports = {
  applyWebpackFixes,
};
