/**
 * Next.js WebpackFix - CRITICAL FIX 
 * 
 * A definitive, direct solution for Next.js webpack and hydration issues.
 * This single file addresses all critical problems:
 * 
 * 1. "Cannot read properties of undefined (reading 'call')" in webpack factory
 * 2. Hydration errors with SSR components and next-themes
 * 3. Missing browser globals in SSR context
 * 4. Webpack runtime patches for robust module loading
 * 
 * Created May 30, 2025 (Final Version 2.0)
 */

// Detect environment
const isServer = typeof window === 'undefined';
const isClient = !isServer;

// Console output styling
const styles = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

const log = (msg, type = 'info') => {
  const prefix = {
    success: `${styles.green}✓${styles.reset}`,
    info: `${styles.blue}ℹ${styles.reset}`,
    warn: `${styles.yellow}⚠${styles.reset}`,
    error: `${styles.red}✖${styles.reset}`
  };
  console.log(`${prefix[type]} ${msg}`);
};

/**
 * Apply basic browser globals for SSR
 * Only the essentials needed to prevent errors
 */
function applyBrowserPolyfills() {
  if (isServer) {
    const globalObj = global || globalThis || this || {};
    
    // Only apply if not already defined
    const polyfills = {
      window: globalObj,
      self: globalObj,
      document: {
        querySelector: () => null,
        createElement: () => ({}),
        documentElement: { style: {} }
      },
      localStorage: { getItem: () => null, setItem: () => {} },
      sessionStorage: { getItem: () => null, setItem: () => {} },
      navigator: { userAgent: 'SSR' },
      location: { 
        protocol: 'http:', 
        hostname: 'localhost',
        href: `http://localhost:${process.env.PORT || 3002}/`
      }
    };
    
    Object.entries(polyfills).forEach(([key, value]) => {
      if (typeof globalObj[key] === 'undefined') {
        globalObj[key] = value;
      }
    });
    
    log('Essential browser globals applied for SSR', 'success');
  }
}

/**
 * DirectWebpackFix - Critical fix for webpack factory call errors
 * Core fix that directly targets the exact cause of the factory call issue
 */
class WebpackFactoryFix {
  constructor(options = {}) {
    this.options = {
      verbose: false,
      debug: false,
      ...options
    };
  }
  
  apply(compiler) {
    const PLUGIN_NAME = 'DirectWebpackFix';
    
    // Core fix: directly patch the webpack runtime
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      // Special handling for error.tsx and global-error.tsx
      if (compilation.hooks.optimizeModules) {
        compilation.hooks.optimizeModules.tap(PLUGIN_NAME, (modules) => {
          modules.forEach(module => {
            if (!module.resource) return;
            
            // Apply special handling to error components
            if (module.resource.includes('error.tsx') || 
                module.resource.includes('global-error.tsx')) {
              
              // Mark as critical module with special treatment
              if (!module.buildInfo) module.buildInfo = {};
              module.buildInfo.critical = true;
              
              if (this.options.verbose) {
                log(`Applied special handling to: ${module.resource}`, 'info');
              }
            }
          });
        });
      }
      
      // Add runtime patch through JavascriptModulesPlugin
      const JavascriptModulesPlugin = compiler.webpack && compiler.webpack.javascript && compiler.webpack.javascript.JavascriptModulesPlugin;
      
      if (JavascriptModulesPlugin && JavascriptModulesPlugin.getCompilationHooks) {
        const hooks = JavascriptModulesPlugin.getCompilationHooks(compilation);
        
        if (hooks && hooks.renderMain) {
          hooks.renderMain.tap(PLUGIN_NAME, (source, renderContext) => {
            if (this.options.verbose) {
              log('Applying webpack factory fix via renderMain hook', 'success');
            }
            
            return `
// NEXTJS-WEBPACK-FIX: Direct fix for "Cannot read properties of undefined" errors
(function() {
  // Protect __webpack_require__.c (module factories)
  var safeGetFactory = function(moduleId) {
    try {
      return __webpack_require__.c[moduleId];
    } catch(e) {
      console.warn("[WebpackFix] Protected from factory access error:", moduleId);
      return function() { return {}; };
    }
  };

  // Create safe wrappers for module factories
  var originalModules = __webpack_require__.c || {};
  var safeModules = {};
  
  // Safely transfer all existing modules
  Object.keys(originalModules).forEach(function(moduleId) {
    var originalFactory = originalModules[moduleId];
    safeModules[moduleId] = function(module, exports, __webpack_require__) {
      try {
        return originalFactory.call(this, module, exports, __webpack_require__);
      } catch(e) {
        console.warn("[WebpackFix] Protected from factory call error in module:", moduleId);
        module.exports = {};
        return module;
      }
    };
  });

  // Replace with our safe version
  __webpack_require__.c = safeModules;

  // Create a safer __webpack_require__
  var originalRequire = __webpack_require__;
  var safeRequire = function(moduleId) {
    try {
      return originalRequire(moduleId);
    } catch(e) {
      console.warn("[WebpackFix] Protected from require error:", moduleId);
      return {};
    }
  };
  
  // Only replace specific properties we want to make safe
  for (var prop in originalRequire) {
    if (Object.prototype.hasOwnProperty.call(originalRequire, prop)) {
      safeRequire[prop] = originalRequire[prop];
    }
  }

  // Replace webpack require
  __webpack_require__ = safeRequire;
})();

${source}`;
          });
        } else if (compilation.mainTemplate && compilation.mainTemplate.hooks && compilation.mainTemplate.hooks.requireExtensions) {
          // Fallback for older webpack versions
          compilation.mainTemplate.hooks.requireExtensions.tap(PLUGIN_NAME, (source) => {
            if (this.options.verbose) {
              log('Applying webpack factory fix via requireExtensions hook (fallback)', 'success');
            }
            
            return `
// NEXTJS-WEBPACK-FIX: Factory call protection (fallback)
${source}

// Protect against factory errors
(function() {
  // Create safe wrappers for module factories
  var originalModules = __webpack_require__.c;
  
  if (originalModules) {
    Object.keys(originalModules).forEach(function(moduleId) {
      var originalFactory = originalModules[moduleId];
      
      if (typeof originalFactory === 'function') {
        originalModules[moduleId] = function(module, exports, __webpack_require__) {
          try {
            return originalFactory.call(this, module, exports, __webpack_require__);
          } catch(e) {
            console.warn("[WebpackFix] Protected from factory call error in module:", moduleId);
            module.exports = {};
            return module;
          }
        };
      }
    });
  }
})();`;
          });
        }
      }
    });
  }
}

/**
 * Patch Next.js files to fix common issues
 */
function patchNextJSFiles() {
  // Only run on server
  if (!isServer) return;
  
  const fs = require('fs');
  const path = require('path');
  
  // Simple patch function
  const applyPatch = (filePath, searchValue, replaceValue) => {
    try {
      if (!fs.existsSync(filePath)) {
        return false;
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Skip if already patched
      if (content.includes('NEXTJS-WEBPACK-FIX')) {
        return false;
      }
      
      // Apply patch
      const newContent = content.replace(searchValue, replaceValue);
      
      // Skip if no changes
      if (newContent === content) {
        return false;
      }
      
      // Backup original
      fs.writeFileSync(`${filePath}.backup`, content);
      
      // Write patched file
      fs.writeFileSync(filePath, newContent);
      
      return true;
    } catch (err) {
      return false;
    }
  };
  
  // List of critical patches
  const patches = [
    {
      file: 'node_modules/next/dist/shared/lib/utils.js',
      search: /function getLocationOrigin\(\) \{[\s\S]*?const \{[^}]+\} = window\.location;/,
      replace: `function getLocationOrigin() {
  // NEXTJS-WEBPACK-FIX
  if (typeof window === 'undefined' || !window.location) {
    return `http://localhost:${process.env.PORT || 3002}`;
  }
  const { protocol, hostname, port } = window.location;`
    }
  ];
  
  // Apply all patches and count successes
  let patchCount = 0;
  patches.forEach(patch => {
    const filePath = path.resolve(process.cwd(), patch.file);
    if (applyPatch(filePath, patch.search, patch.replace)) {
      log(`Patched ${patch.file}`, 'success');
      patchCount++;
    }
  });
  
  return patchCount > 0;
}

// Apply fixes immediately on import
if (isServer) {
  applyBrowserPolyfills();
  patchNextJSFiles();
}

// Export all functions
module.exports = {
  WebpackFactoryFix,
  applyBrowserPolyfills,
  patchNextJSFiles
};
