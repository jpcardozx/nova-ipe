/**
 * Nova Ipê Definitive Webpack Fix
 * Updated version based on diagnostic analysis
 * 
 * This script resolves:
 * - "Cannot read properties of undefined (reading 'call')" errors
 * - Hydration mismatches between server and client 
 * - Module duplication in the dependency tree
 * - Import resolution conflicts
 * 
 * @version 2.0.0
 * @date June 2, 2025
 */

const path = require('path');
const projectRoot = process.cwd();

function applyWebpackFix(config, { dev, isServer }) {
  // Step 1: Ensure consistent module resolution
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};
  
  // Step 2: Prevent duplicate module instances
  config.optimization = config.optimization || {};
  if (!isServer) {
    // Force deterministic module and chunk IDs for consistent hashes
    config.optimization.moduleIds = 'deterministic';
    config.optimization.chunkIds = 'deterministic';
    
    // Create a single runtime chunk
    config.optimization.runtimeChunk = 'single';
    
    // Improve caching by separating vendor chunks
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 30,
      minSize: 20000,
      cacheGroups: {
        // Framework chunks - ensure these load first and are shared
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
          name: 'framework',
          priority: 40,
          enforce: true,
        },
        // Core library chunks
        lib: {
          test: /[\\/]node_modules[\\/](framer-motion|next|@sanity)[\\/]/,
          name(module) {
            if (!module.context) return 'lib.unknown';
            const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            const packageName = match && match[1] ? match[1] : 'unknown';
            return `lib.${packageName.replace('@', '')}`;
          },
          priority: 30,
        },
        // All other vendor code
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // Get package name
            if (!module.context) return 'npm.unknown';
            const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
            const packageName = match && match[1] ? match[1] : 'unknown';
            return `npm.${packageName.replace('@', '').replace('/', '-')}`;
          },
          priority: 20,
        },
        // Common code chunks
        common: {
          minChunks: 2,
          priority: 10,
          reuseExistingChunk: true,
        }
      }
    };
  }

  // Step 3: Fix hydration errors by ensuring consistent serialization
  if (isServer) {
    // Add deterministic IDs on server side
    config.optimization.moduleIds = 'deterministic';
    
    // Fix for "Cannot read properties of undefined (reading 'call')" errors
    config.externals = [...(config.externals || [])];
    if (Array.isArray(config.externals)) {
      config.externals.push(({context, request}, cb) => {
        // Externalize problematic packages for server
        if (
          request.startsWith('framer-motion') ||          request.includes('react-dom/client') || 
          request.includes('react-interaction')
        ) {
          // Add to allowed list for server components
          return cb(null, 'commonjs ' + request);
        }
        cb();
      });
    }
  } else {
    // Client-side fallbacks for Node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      path: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
    };
    
    // Ensure React is loaded from the same place consistently
    config.resolve.alias['react'] = path.resolve(projectRoot, 'node_modules/react');
    config.resolve.alias['react-dom'] = path.resolve(projectRoot, 'node_modules/react-dom');
    config.resolve.alias['next'] = path.resolve(projectRoot, 'node_modules/next');
    
    // Fix modules that try to load server-only code on client
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    // Add a rule to prevent certain modules from being imported on the client
    config.module.rules.push({
      test: /node_modules[\\/](framer-motion)[\\/].+server[\\/]/,
      use: 'null-loader',
    });
  }

  // Step 4: Add plugins for better compatibility
  config.plugins = config.plugins || [];
  
  const webpack = require('webpack');
  
  // Add polyfills for browser modules
  if (!isServer) {
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
      // Fix "process is not defined" errors
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
      })
    );
  }
  
  // Return the modified config
  return config;
}

module.exports = applyWebpackFix;
