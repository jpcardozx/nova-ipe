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
      });

      // Hook early in the process, before minification
      compilation.hooks.processAssets.tap({
        name: pluginName,
        stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS
      }, (assets) => {
        // Only process server-side assets
        if (compilation.options.target === 'node') {
          Object.keys(assets).forEach(assetName => {
            if (assetName.includes('vendors') && assetName.endsWith('.js')) {
              const asset = assets[assetName];
              let content = asset.source();
              
              // Replace browser-specific chunk loading patterns
              if (typeof content === 'string') {
                let modified = false;
                
                // Replace self references with globalThis
                const newContent = content.replace(
                  /\(self\.webpackChunk_N_E\s*=\s*self\.webpackChunk_N_E\s*\|\|\s*\[\]\)/g,
                  (match) => {
                    modified = true;
                    return '(globalThis.webpackChunk_N_E = globalThis.webpackChunk_N_E || [])';
                  }
                );
                
                if (modified) {
                  // Create a proper webpack source object
                  const { RawSource } = compilation.compiler.webpack.sources;
                  compilation.updateAsset(assetName, new RawSource(newContent));
                  console.log(`✅ Fixed server-side globals in: ${assetName}`);
                }
              }
            }
          });
        }
      });
    });
  }
}

module.exports = WebpackSSRFixPlugin;
