/**
 * Minimal SSR Plugin for Next.js
 */

function MinimalSSRPlugin() {
  // Initialize global polyfills right away
  if (typeof global !== 'undefined') {
    if (typeof global.self === 'undefined') {
      global.self = global;
    }
    
    if (typeof global.window === 'undefined') {
      global.window = global;
    }
    
    if (typeof global.localStorage === 'undefined') {
      global.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        length: 0,
        key: () => null
      };
    }
  }
  
  return {
    apply(compiler) {
      // Simple event hook that doesn't modify assets
      compiler.hooks.environment.tap('MinimalSSRPlugin', () => {
        // Nothing to do here - just ensure the plugin is properly initialized
      });
    }
  };
}

module.exports = MinimalSSRPlugin;
