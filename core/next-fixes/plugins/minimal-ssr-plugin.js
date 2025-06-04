/**
 * MinimalSSRPlugin
 * A safe, minimal webpack plugin that doesn't cause compatibility issues
 * 
 * Created May 30, 2025
 */

// Import browser polyfills
const { applySSRPolyfills } = require('../polyfills/browser-polyfills');

/**
 * Creates a minimal SSR-compatible Webpack plugin
 */
function createMinimalSSRPlugin(options = {}) {
  // Apply SSR polyfills immediately
  applySSRPolyfills();
  
  // Return a minimal plugin that doesn't try to modify webpack assets
  return {
    apply(compiler) {
      const pluginName = 'MinimalSSRPlugin';
      
      // Simple environment hook with no side effects
      compiler.hooks.environment.tap(pluginName, () => {
        if (options.verbose) {
          console.log('✅ MinimalSSRPlugin initialized');
        }
      });
    }
  };
}

module.exports = { createMinimalSSRPlugin };
