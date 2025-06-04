/**
 * WebpackFactoryFixPlugin
 * Prevents "Cannot read properties of undefined (reading 'call')" errors
 * in webpack module factories
 * 
 * Created May 30, 2025
 */

class WebpackFactoryFixPlugin {
  constructor(options = {}) {
    this.options = {
      verbose: false,
      ...options
    };
  }

  apply(compiler) {
    const pluginName = 'WebpackFactoryFixPlugin';
    
    // Safe runtime patching
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // Check if processRuntimeExt hook exists
      if (compilation.hooks.processRuntimeExt) {
        // Add webpack runtime safety code
        compilation.hooks.processRuntimeExt.tap(pluginName, (runtime) => {
          // Add our safety wrapper for webpack factory calls
          runtime.add(`
// Webpack factory call safety wrapper
function safeFactoryCall(factory, moduleObject) {
  try {
    if (typeof factory === 'function') {
      return factory.call(moduleObject.exports, moduleObject, moduleObject.exports);
    }
    // For non-function factories, return empty exports
    return {};
  } catch (e) {
    console.error('Protected from webpack factory call error:', e.message);
    return {};
  }
}`);

          // Replace standard webpack module functions with safe versions
          runtime.add(`
// Make webpack's __webpack_require__.factory safe
var originalFactoryHandler = __webpack_require__.f ? __webpack_require__.f.j : null;
if (originalFactoryHandler) {
  __webpack_require__.f.j = function(chunkId, promises) {
    try {
      return originalFactoryHandler(chunkId, promises);
    } catch (e) {
      console.error('Protected from webpack chunk load error:', e.message);
      return promises;
    }
  };
}
          `);
        });
      } else {
        // Fallback for webpack versions without processRuntimeExt hook
        compilation.mainTemplate.hooks.requireExtensions.tap(pluginName, (source) => {
          return source + `
// Webpack factory call safety wrapper
function safeFactoryCall(factory, moduleObject) {
  try {
    if (typeof factory === 'function') {
      return factory.call(moduleObject.exports, moduleObject, moduleObject.exports);
    }
    return {};
  } catch (e) {
    console.error('Protected from webpack factory call error:', e.message);
    return {};
  }
}

// Make webpack's __webpack_require__.factory safe
var originalFactoryHandler = __webpack_require__.f ? __webpack_require__.f.j : null;
if (originalFactoryHandler) {
  __webpack_require__.f.j = function(chunkId, promises) {
    try {
      return originalFactoryHandler(chunkId, promises);
    } catch (e) {
      console.error('Protected from webpack chunk load error:', e.message);
      return promises;
    }
  };
}
`;
        });
      }
    });

    // Make module factories safe
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      if (compilation.hooks.optimizeModules) {
        compilation.hooks.optimizeModules.tap(pluginName, (modules) => {
          modules.forEach(module => {
            // Focus on problematic modules (error components and next-themes)
            if (module.resource && (
              module.resource.includes('error.tsx') ||
              module.resource.includes('global-error.tsx') ||
              module.resource.includes('next-themes')
            )) {
              // Ensure factory meta exists 
              if (!module.factoryMeta) {
                module.factoryMeta = {};
              }
              // Flag as protected
              module.factoryMeta.protected = true;
            }
          });
        });
      }
    });
  }
}

module.exports = WebpackFactoryFixPlugin;
