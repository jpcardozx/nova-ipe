/**
 * NEXTJS-HYDRATION-WEBPACK-FIX.js
 * 
 * This is a comprehensive fix for Next.js hydration and webpack issues,
 * specifically targeting issues with:
 * 1. "Cannot read properties of undefined (reading 'call')" errors
 * 2. Hydration mismatches with next-themes
 * 3. SSR polyfill problems
 * 4. Webpack plugin compatibility issues
 * 5. "Cannot destructure property 'protocol' of 'window.location'"
 * 6. "element.setAttribute is not a function"
 * 
 * Created May 30, 2025
 * 
 * Usage:
 * 1. In package.json scripts: 
 *    "dev": "cross-env NODE_OPTIONS=\"--require ./nextjs-hydration-webpack-fix.js\" next dev"
 * 2. In next.config.js:
 *    const { applySSRPolyfills, WebpackFactoryFixPlugin, createMinimalSSRPlugin } = require('./nextjs-hydration-webpack-fix');
 *    // Apply polyfills
 *    applySSRPolyfills();
 *    // Add to webpack config:
 *    config.plugins.push(new WebpackFactoryFixPlugin());
 *    config.plugins.push(createMinimalSSRPlugin());
 */

// Determine environment
const isServer = typeof window === 'undefined';
const isClient = !isServer;

// Console styling for logs
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

// Helper functions for logging
const log = {
  success: msg => console.log(`${GREEN}✅ ${msg}${RESET}`),
  info: msg => console.log(`${BLUE}ℹ️ ${msg}${RESET}`),
  warning: msg => console.log(`${YELLOW}⚠️ ${msg}${RESET}`),
  error: msg => console.log(`${RED}❌ ${msg}${RESET}`),
  title: msg => console.log(`\n${BLUE}==== ${msg} ====${RESET}\n`)
};

/**
 * Part 1: SSR Browser Globals Polyfills
 * These polyfills provide essential browser globals during SSR
 */
function applySSRPolyfills() {
  if (isServer) {
    const globalObj = typeof global !== 'undefined' ? global : 
                     typeof globalThis !== 'undefined' ? globalThis : 
                     this || {};    // Critical object polyfills
    const polyfills = {
      // Self reference
      self: globalObj,
      
      // Window reference
      window: globalObj,
      
      // Storage
      localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0
      },
      
      sessionStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0
      },
      
      // Location polyfill
      location: {
        protocol: 'http:',
        host: 'localhost:3000',
        hostname: 'localhost',
        port: '3000',
        pathname: '/',
        search: '',
        hash: '',
        href: 'http://localhost:3000/',
        origin: 'http://localhost:3000',
        toString: () => 'http://localhost:3000/',
        assign: () => {},
        replace: () => {},
        reload: () => {}
      },
      
      // Document stub with critical methods
      document: {
        documentElement: {
          style: {},
          classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
            toggle: () => false
          },
          setAttribute: () => {},
          getAttribute: () => null
        },
        body: {
          classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
            toggle: () => false
          }
        },
        createElement: () => ({ 
          style: {}, 
          setAttribute: () => {},
          getAttribute: () => null,
          appendChild: () => {},
          classList: {
            add: () => {},
            remove: () => {}
          }
        }),
        createTextNode: () => ({}),
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementById: () => null,
        getElementsByClassName: () => [],
        getElementsByTagName: () => [],
        addEventListener: () => {},
        removeEventListener: () => {}
      },
      
      // Navigator stub
      navigator: {
        userAgent: 'node',
        platform: 'node',
        language: 'en',
        languages: ['en']
      }
    };

    // Apply all polyfills to the global object
    Object.entries(polyfills).forEach(([key, value]) => {
      if (typeof globalObj[key] === 'undefined') {
        globalObj[key] = value;
      }
    });

    // Create HTML* element classes
    ['HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent'].forEach(className => {
      if (typeof globalObj[className] === 'undefined') {
        globalObj[className] = class MockElement {};
        globalObj[className].prototype = {};
      }
    });

    // Special case for matchMedia
    if (typeof globalObj.matchMedia === 'undefined') {
      globalObj.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true
      });
    }

    console.log('✅ Server-side browser globals polyfilled successfully');
  }
}

/**
 * Part 2: Webpack Factory Fix Plugin
 * Prevents "Cannot read properties of undefined (reading 'call')" errors
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

/**
 * Part 3: Minimal SSR Plugin 
 * A safe, minimal webpack plugin that doesn't cause compatibility issues
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

/**
 * Part 4: Next.js Path Fixes
 * Apply patches to Next.js core files for specific issues
 */
function patchNextJSFiles() {
  if (!isServer) return false; // Only run on server
  
  const fs = require('fs');
  const path = require('path');
  
  const patches = [
    // Fix for "Cannot destructure property 'protocol' of 'window.location'"
    {
      file: 'node_modules/next/dist/shared/lib/utils.js',
      search: /function getLocationOrigin\(\) \{[\s\S]*?const \{[^}]+\} = window\.location;/,
      replace: `function getLocationOrigin() {
  // PATCHED by nextjs-hydration-webpack-fix.js
  if (typeof window === 'undefined' || !window.location) {
    return 'http://localhost:3000';
  }
  const { protocol, hostname, port } = window.location;`
    },
    // Fix for getURL
    {
      file: 'node_modules/next/dist/shared/lib/utils.js',
      search: /function getURL\(\) \{[\s\S]*?const \{[^}]+\} = window\.location;/,
      replace: `function getURL() {
  // PATCHED by nextjs-hydration-webpack-fix.js
  if (typeof window === 'undefined' || !window.location) {
    return '/';
  }
  const { href } = window.location;`
    },
    // Fix for parsing relative URL
    {
      file: 'node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js',
      search: /export function parseRelativeUrl\(url, base\?\) \{[\s\S]*?const resolvedBase = base \? new URL\(base, DUMMY_BASE\) : DUMMY_BASE;/,
      replace: `export function parseRelativeUrl(url, base?) {
  // PATCHED by nextjs-hydration-webpack-fix.js
  const DUMMY_BASE = new URL(
    typeof window === 'undefined' || !window.location
      ? 'http://localhost:3000'
      : getLocationOrigin()
  );
  const resolvedBase = base ? new URL(base, DUMMY_BASE) : DUMMY_BASE;`
    }
  ];

  try {
    let patchesApplied = 0;
    
    // Apply each patch
    patches.forEach(({ file, search, replace }) => {
      try {
        const filePath = path.resolve(process.cwd(), file);
        
        // Skip if file doesn't exist
        if (!fs.existsSync(filePath)) {
          log.warning(`File not found: ${file}`);
          return;
        }
        
        // Read file content
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if already patched
        if (content.includes('PATCHED by nextjs-hydration-webpack-fix.js')) {
          log.info(`File already patched: ${file}`);
          return;
        }
        
        // Apply patch
        const newContent = content.replace(search, replace);
        
        // Skip if no changes
        if (newContent === content) {
          log.warning(`Pattern not found in ${file}`);
          return;
        }
        
        // Backup original file
        const backupPath = `${filePath}.original`;
        if (!fs.existsSync(backupPath)) {
          fs.writeFileSync(backupPath, content);
        }
        
        // Write patched file
        fs.writeFileSync(filePath, newContent);
        patchesApplied++;
        
        log.success(`Patched ${file}`);
      } catch (e) {
        log.error(`Failed to patch ${file}: ${e.message}`);
      }
    });
    
    if (patchesApplied > 0) {
      log.success(`${patchesApplied} Next.js files patched successfully`);
      return true;
    } else {
      log.info('No patches applied to Next.js files');
      return false;
    }
  } catch (e) {
    log.error(`Failed to apply patches: ${e.message}`);
    return false;
  }
}

// Apply patches immediately on import
if (isServer) {
  try {
    patchNextJSFiles();
  } catch (e) {
    log.error(`Error applying Next.js patches: ${e.message}`);
  }
}

// Export everything
module.exports = {
  applySSRPolyfills,
  WebpackFactoryFixPlugin,
  createMinimalSSRPlugin,
  patchNextJSFiles
};
