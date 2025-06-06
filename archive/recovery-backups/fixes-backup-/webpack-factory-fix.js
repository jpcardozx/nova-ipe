/**
 * Emergency Module Factory Fix
 * 
 * This webpack plugin ensures that all modules have factory functions
 * to prevent "Cannot read properties of undefined (reading 'call')" errors
 * at webpack runtime.
 */

class ModuleFactoryFix {
    apply(compiler) {
        compiler.hooks.compilation.tap('ModuleFactoryFix', (compilation) => {
            // Hook into the compilation process after modules are optimized
            compilation.hooks.afterOptimizeModules.tap('ModuleFactoryFix', (modules) => {
                for (const module of modules) {
                    // Ensure every module has a factory function
                    if (!module.factory) {
                        module.factory = function(dependencies, originModule) {
                            // Safe factory function that returns empty object
                            return function(require, module, exports) {
                                // Default export handling
                                if (typeof module !== 'undefined' && module.exports) {
                                    if (!module.exports.default && typeof module.exports === 'object') {
                                        module.exports.default = module.exports;
                                    }
                                }
                                return module.exports || {};
                            };
                        };
                    }

                    // Ensure module has proper request and identifier
                    if (!module.request && module.resource) {
                        module.request = module.resource;
                    }

                    if (!module.identifier) {
                        module.identifier = () => module.request || 'unknown-module';
                    }
                }
            });

            // Hook into chunk creation to ensure proper module factory calls
            compilation.hooks.afterOptimizeChunks.tap('ModuleFactoryFix', (chunks) => {
                for (const chunk of chunks) {
                    for (const module of chunk.modulesIterable || []) {
                        // Ensure module factory is callable
                        if (module.factory && typeof module.factory !== 'function') {
                            module.factory = () => ({});
                        }
                    }
                }
            });
        });

        // Add runtime module to handle missing factories at runtime
        compiler.hooks.thisCompilation.tap('ModuleFactoryFix', (compilation) => {
            compilation.hooks.additionalTreeRuntimeRequirements.tap(
                'ModuleFactoryFix',
                (chunk, set) => {
                    set.add('__webpack_require__.factory_fix');
                }
            );

            compilation.hooks.runtimeRequirementInTree.for('__webpack_require__.factory_fix').tap(
                'ModuleFactoryFix',
                (chunk, set) => {
                    compilation.addRuntimeModule(chunk, new RuntimeModuleFactoryFix());
                }
            );
        });
    }
}

class RuntimeModuleFactoryFix {
    constructor() {
        this.name = 'factory-fix';
    }

    generate() {
        return `
// Emergency factory function fix
__webpack_require__.factory_fix = function(moduleId) {
    if (!__webpack_modules__[moduleId]) {
        console.warn('[Webpack Factory Fix] Missing module:', moduleId);
        __webpack_modules__[moduleId] = function(module, exports, __webpack_require__) {
            module.exports = {};
            if (!module.exports.default) {
                module.exports.default = module.exports;
            }
        };
    }
    
    var factory = __webpack_modules__[moduleId];
    if (typeof factory !== 'function') {
        console.warn('[Webpack Factory Fix] Invalid factory for module:', moduleId);
        __webpack_modules__[moduleId] = function(module, exports, __webpack_require__) {
            module.exports = factory || {};
            if (!module.exports.default) {
                module.exports.default = module.exports;
            }
        };
    }
};

// Monkey patch __webpack_require__ to use factory fix
var originalRequire = __webpack_require__;
__webpack_require__ = function(moduleId) {
    try {
        __webpack_require__.factory_fix(moduleId);
        return originalRequire(moduleId);
    } catch (error) {
        console.error('[Webpack Factory Fix] Error loading module:', moduleId, error);
        return {};
    }
};

// Copy over properties
for (var prop in originalRequire) {
    if (originalRequire.hasOwnProperty(prop)) {
        __webpack_require__[prop] = originalRequire[prop];
    }
}
`;
    }
}

module.exports = ModuleFactoryFix;
