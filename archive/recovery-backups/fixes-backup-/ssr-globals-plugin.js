/**
 * Simplified SSR Globals Plugin for Next.js
 * 
 * This plugin injects polyfills for browser globals in SSR context
 * Compatible with latest webpack 5 hooks (non-waterfall style)
 */

class SSRGlobalsPlugin {
  apply(compiler) {
    const pluginName = 'SSRGlobalsPlugin';
    
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // Use processAssets hook to inject polyfills into JavaScript files
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets) => {
          // Process JavaScript assets
          Object.keys(assets).forEach(assetName => {
            if (assetName.endsWith('.js')) {
              const asset = assets[assetName];
              const source = asset.source();
              
              if (typeof source === 'string') {
                // Polyfill code to inject at the beginning of each JS file                const polyfillCode = `
// SSR Global Polyfills - Injected by SSRGlobalsPlugin
(function() {
  if (typeof globalThis === 'undefined') return;
  if (typeof self === 'undefined') globalThis.self = globalThis;
  if (typeof window === 'undefined') globalThis.window = globalThis;
  
  // Handle localStorage for next-themes
  if (typeof localStorage === 'undefined') {
    globalThis.localStorage = {
      getItem: function() { return null; },
      setItem: function() {},
      removeItem: function() {},
      clear: function() {},
      key: function() { return null; },
      length: 0
    };
  }
  
  // Simple document mock for SSR
  if (typeof document === 'undefined') {
    globalThis.document = {
      documentElement: { style: {}, setAttribute: function() {}, getAttribute: function() { return null; } },
      createElement: function() { return { style: {} }; },
      querySelector: function() { return null; },
      querySelectorAll: function() { return []; }
    };
  }
})();
`;
                
                try {
                  // Add polyfill to the beginning of the file
                  const newSource = polyfillCode + source;
                  // Check if webpack.sources is available from compilation
                  if (compilation.webpack && compilation.webpack.sources) {
                    compilation.updateAsset(
                      assetName, 
                      new compilation.webpack.sources.RawSource(newSource)
                    );
                  } else {
                    // Fallback for older webpack versions
                    compilation.assets[assetName] = {
                      source: () => newSource,
                      size: () => newSource.length
                    };
                  }
                } catch (err) {
                  console.warn('[SSR Plugin] Error processing asset:', err.message);
                }
              }
            }
          });
        }
      );
    });
  }
}

module.exports = SSRGlobalsPlugin;
