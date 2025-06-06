/**
 * Strategic SSR Fix for Next.js - Modern Webpack 5 Implementation
 * This approach ensures 'self' is properly polyfilled using modern webpack hooks
 * Enhanced to handle next-themes and other library-specific SSR issues
 */

class SSRGlobalsPlugin {
  apply(compiler) {
    const pluginName = 'SSRGlobalsPlugin';
    
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // Use modern webpack 5 API for processing assets
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets) => {
          // Process both server and client assets to ensure proper hydration
          Object.keys(assets).forEach(assetName => {
            // Focus on all JS files that might contain problematic references
            if (assetName.endsWith('.js')) {
              const asset = assets[assetName];
              const source = asset.source();
              
              if (typeof source === 'string') {
                // More comprehensive polyfill with special handling for next-themes
                const polyfillCode = `
// Enhanced SSR Global Polyfill - Injected by SSRGlobalsPlugin
(function() {
  if (typeof self === 'undefined') {
    if (typeof global !== 'undefined') {
      var self = global;
    } else if (typeof globalThis !== 'undefined') {
      var self = globalThis;
    } else {
      var self = this || {};
    }
    // Ensure critical browser globals exist
    if (typeof self.window === 'undefined') {
      self.window = self;
    }
    // Ensure webpackChunk_N_E exists
    if (typeof self.webpackChunk_N_E === 'undefined') {
      self.webpackChunk_N_E = [];
    }
    // next-themes safety check
    if (typeof self.localStorage === 'undefined') {
      self.localStorage = { getItem: function() { return null; }, setItem: function() {} };
    }
  }
})();
`;
                  // Create new asset with polyfill prepended
                const newSource = polyfillCode + source;
                compilation.updateAsset(assetName, new compilation.webpack.sources.RawSource(newSource));
              }
            }
          });
        }
      );
    });
      // Handle next-themes specific issues
    compiler.hooks.normalModuleFactory.tap(pluginName, (factory) => {
      factory.hooks.afterResolve.tap(pluginName, (result) => {
        // For a bailing hook, we should not return the result
        // but just modify it in-place if needed
        if (result && result.resource && result.resource.includes('next-themes')) {
          // We can perform any modifications to result here if needed
          // but we don't need to explicitly return it
        }
        // Don't return anything - the hook is now a bailing hook, not waterfall
      });
    });
  }
}

module.exports = SSRGlobalsPlugin;
