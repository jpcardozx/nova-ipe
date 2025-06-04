/**
 * Smart Next.js Webpack Fix
 * Minimal solution for webpack and SSR issues
 */

const isServer = typeof window === 'undefined';

// Apply SSR polyfills immediately if needed
if (isServer) {
  const globalObj = global || globalThis;
  const polyfills = {
    window: globalObj,
    document: {
      querySelector: () => null,
      createElement: () => ({}),
      documentElement: { style: {} }
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {} }
  };

  Object.entries(polyfills).forEach(([key, value]) => {
    if (typeof globalObj[key] === 'undefined') {
      globalObj[key] = value;
    }
  });
}

class NextJSWebpackFix {
  apply(compiler) {
    const PLUGIN_NAME = 'NextJSWebpackFix';

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      // Handle error components specially
      compilation.hooks.optimizeModules.tap(PLUGIN_NAME, (modules) => {
        modules.forEach(module => {
          if (!module.resource) return;
          
          if (module.resource.includes('error.tsx') || 
              module.resource.includes('global-error.tsx')) {
            if (!module.buildInfo) module.buildInfo = {};
            module.buildInfo.strict = false;
          }
        });
      });

      // Add safety wrapper for module loading
      if (compilation.mainTemplate?.hooks?.requireExtensions) {
        compilation.mainTemplate.hooks.requireExtensions.tap(PLUGIN_NAME, (source) => {
          return `${source}
// NextJSWebpackFix: Safe module loading
(function() {
  var originalFactory = __webpack_require__.c;
  var safeModules = {};
  
  Object.keys(originalFactory).forEach(function(id) {
    var originalModule = originalFactory[id];
    safeModules[id] = function(module, exports, require) {
      try {
        return originalModule.call(this, module, exports, require);
      } catch (e) {
        if (e.message?.includes('undefined')) {
          console.warn('[WebpackFix] Protected from error in module:', id);
          module.exports = {};
        } else {
          throw e;
        }
      }
      return module;
    };
  });
  
  __webpack_require__.c = safeModules;
  
  var originalRequire = __webpack_require__;
  __webpack_require__ = function(moduleId) {
    try {
      return originalRequire(moduleId);
    } catch (e) {
      if (e.message?.includes('undefined')) {
        console.warn('[WebpackFix] Protected from require error:', moduleId);
        return {};
      }
      throw e;
    }
  };
})();`;
        });
      }
    });
  }
}

module.exports = new NextJSWebpackFix();
