/**
 * Webpack SSR Fix Plugin
 * Ensures server-side webpack chunks don't use browser globals
 */
class WebpackSSRFixPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const pluginName = 'WebpackSSRFixPlugin';
    
    // Hook into the compilation process
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // Hook into the chunk rendering process
      compilation.hooks.afterOptimizeChunkIds.tap(pluginName, (chunks) => {
        // Only apply to server builds
        if (compilation.options.target === 'node') {
          console.log('🔧 WebpackSSRFixPlugin: Applying server-side fixes...');
        }
      });      // Hook into asset processing to modify chunk loading code
      compilation.hooks.processAssets.tap({
        name: pluginName,
        stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE - 1 // Run before minification
      }, (assets) => {
        // Only process server-side assets
        if (compilation.options.target === 'node') {
          Object.keys(assets).forEach(assetName => {
            if (assetName.includes('vendors') && assetName.endsWith('.js')) {
              const asset = assets[assetName];
              let content = asset.source();
              
              // Replace browser-specific chunk loading patterns
              if (typeof content === 'string') {
                // Replace self references with globalThis
                content = content.replace(
                  /\(self\.webpackChunk_N_E\s*=\s*self\.webpackChunk_N_E\s*\|\|\s*\[\]\)/g,
                  '(globalThis.webpackChunk_N_E = globalThis.webpackChunk_N_E || [])'
                );
                
                // Replace any remaining 'self' references
                content = content.replace(/\bself\b(?!\w)/g, 'globalThis');
                
                // Replace window references
                content = content.replace(/\bwindow\b(?!\w)/g, 'globalThis');
                
                // Update the asset with proper webpack source
                compilation.updateAsset(assetName, new (compilation.compiler.webpack.sources.RawSource)(content));
                
                console.log(`✅ Fixed server-side globals in: ${assetName}`);
              }
            }
          });
        }
      });
    });

    // Hook into the webpack runtime generation
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      if (compilation.options.target === 'node') {
        // Modify webpack runtime globals
        compilation.hooks.runtimeRequirementInChunk.for('webpack/runtime/chunk loading').tap(
          pluginName,
          (chunk, set) => {
            // Ensure globals are available in server environment
            compilation.addRuntimeModule(chunk, new (require('webpack').RuntimeModule)(
              'SSR Globals Polyfill',
              `
if (typeof globalThis !== 'undefined') {
  globalThis.self = globalThis.self || globalThis;
  globalThis.window = globalThis.window || globalThis;
  globalThis.webpackChunk_N_E = globalThis.webpackChunk_N_E || [];
}
              `.trim()
            ));
          }
        );
      }
    });
  }
}

module.exports = WebpackSSRFixPlugin;
