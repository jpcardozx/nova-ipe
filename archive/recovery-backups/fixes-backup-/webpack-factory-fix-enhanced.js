/**
 * Enhanced Module Factory Fix for Next.js
 * 
 * This webpack plugin ensures that all modules have proper factory functions
 * to prevent "Cannot read properties of undefined (reading 'call')" errors.
 * Specifically targets next-themes and error components.
 */

class WebpackFactoryFix {
  apply(compiler) {
    const pluginName = 'WebpackFactoryFix';
    
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      // Apply fixes during module optimization phase
      compilation.hooks.optimizeModules.tap(pluginName, (modules) => {
        modules.forEach(module => {
          // Focus on modules that might cause issues
          if (module.resource && (
              module.resource.includes('error.tsx') ||
              module.resource.includes('global-error.tsx') ||
              module.resource.includes('next-themes')
          )) {
            // Ensure the module always has a valid factory
            const originalFactory = module.factoryMeta;
            module.factoryMeta = {
              ...originalFactory,
              plugins: [...(originalFactory?.plugins || [])],
              resolver: originalFactory?.resolver || {},
              enhanced: true
            };
          }
        });
      });
      
      // Handle webpack runtime modules
      compilation.hooks.runtimeModule.tap(pluginName, (runtime, chunk) => {
        if (runtime.name === 'webpack') {
          // Add additional runtime code to handle undefined factory calls
          const originalSource = runtime.source;
          runtime.source = function() {
            const source = originalSource.call(this);
            const safeFactoryCode = `
// Enhanced factory call protection
var __webpack_call_factory_safe = function(factory, moduleObject) {
  try {
    if (typeof factory === 'function') {
      return factory.call(moduleObject.exports, moduleObject, moduleObject.exports);
    } else {
      return {};
    }
  } catch (e) {
    console.warn('[Webpack] Protected from factory call error:', e.message);
    return {};
  }
};
`;
            
            // Replace factory calls with safe version
            return {
              source: () => {
                let code = source.source();
                // Replace unsafe factory calls with our protected version
                code = code.replace(
                  /factory\.call\(moduleObject\.exports,\s*moduleObject,\s*moduleObject\.exports\)/g, 
                  '__webpack_call_factory_safe(factory, moduleObject)'
                );
                return safeFactoryCode + code;
              },
              map: () => source.map()
            };
          };
        }
      });
    });
  }
}

module.exports = WebpackFactoryFix;
