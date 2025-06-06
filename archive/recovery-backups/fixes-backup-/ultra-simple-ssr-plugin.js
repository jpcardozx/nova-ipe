/**
 * Ultra Simple SSR Globals Plugin for Next.js
 * This is a minimal plugin that avoids complex webpack hooks
 */

class UltraSimpleSSRPlugin {
  apply(compiler) {
    const pluginName = 'UltraSimpleSSRPlugin';
    
    // Add some global hooks but don't try to modify assets
    compiler.hooks.environment.tap(pluginName, () => {
      if (typeof global !== 'undefined') {
        // Basic globals for SSR
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
        
        if (typeof global.document === 'undefined') {
          global.document = {
            documentElement: { style: {}, setAttribute: () => {}, getAttribute: () => null },
            createElement: () => ({ style: {} }),
            querySelector: () => null,
            querySelectorAll: () => []
          };
        }
      }
    });
  }
}

module.exports = UltraSimpleSSRPlugin;
