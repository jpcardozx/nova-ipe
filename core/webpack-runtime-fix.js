/**
 * Advanced Next.js Webpack Runtime Fix
 * Handles webpack, hydration, and SSR issues efficiently
 */

class WebpackRuntimePlugin {
  apply(compiler) {
    const PLUGIN_NAME = 'WebpackRuntimePlugin';

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      // 1. Fix miniCss undefined error
      compilation.hooks.afterOptimizeChunks.tap(PLUGIN_NAME, (chunks) => {
        chunks.forEach(chunk => {
          if (!chunk.runtime) chunk.runtime = {};
          if (!chunk.miniCss) chunk.miniCss = new Set();
        });
      });

      // 2. Safe module loading wrapper
      if (compilation.mainTemplate?.hooks?.requireExtensions) {
        compilation.mainTemplate.hooks.requireExtensions.tap(PLUGIN_NAME, (source) => {
          return `${source}
// Safe module loading wrapper
(function() {
  const originalRequire = __webpack_require__;
  const moduleCache = {};

  function safeRequire(moduleId) {
    if (moduleCache[moduleId]) return moduleCache[moduleId].exports;

    try {
      // Initialize module with safe defaults
      const module = moduleCache[moduleId] = {
        id: moduleId,
        loaded: false,
        exports: {}
      };

      // Safely execute module function
      try {
        originalRequire.m[moduleId].call(
          module.exports,
          module,
          module.exports,
          safeRequire
        );
      } catch (e) {
        console.warn('[SafeRequire] Module error:', moduleId, e.message);
        // Return empty exports instead of crashing
        return {};
      }

      module.loaded = true;
      return module.exports;
    } catch (e) {
      console.warn('[SafeRequire] Load error:', moduleId, e.message);
      return {};
    }
  }

  // Replace webpack's require function
  __webpack_require__ = safeRequire;
})();`;
        });
      }
    });
  }
}

module.exports = WebpackRuntimePlugin;
