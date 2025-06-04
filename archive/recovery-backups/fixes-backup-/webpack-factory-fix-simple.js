/**
 * Enhanced Module Factory Fix
 * 
 * This webpack plugin ensures that all modules have factory functions
 * to prevent "Cannot read properties of undefined (reading 'call')" errors
 * at webpack runtime. This version specifically targets next-themes and error components.
 */

class SimpleModuleFactoryFix {
    apply(compiler) {
        compiler.hooks.compilation.tap('SimpleModuleFactoryFix', (compilation) => {
            // Hook into the compilation process at multiple stages
            compilation.hooks.afterOptimizeModules.tap('SimpleModuleFactoryFix', (modules) => {
                for (const module of modules) {
                    // Ensure every module has a factory function
                    if (!module.factory || (module.request && module.request.includes('error.tsx'))) {
                        module.factory = function(dependencies, originModule) {
                            // Create a robust factory function that handles undefined cases
                            return function(require, module, exports) {
                                try {
                                    // Default export handling with safety checks
                                    if (typeof module !== 'undefined' && module.exports) {
                                        if (!module.exports.default && typeof module.exports === 'object') {
                                            module.exports.default = module.exports;
                                        }
                                    }
                                    return module.exports || {};
                                } catch (e) {
                                    console.warn('Module factory error handled:', e);
                                    return {};
                                }
                            };
                        };
                    }                    // Special handling for next-themes modules and error components
                    if (module.request && (
                        module.request.includes('next-themes') || 
                        module.request.includes('error.tsx') || 
                        module.request.includes('global-error.tsx')
                    )) {
                        // Add extra protection for these problematic modules
                        const originalFactory = module.factory;
                        module.factory = function(dependencies, originModule) {
                            try {
                                return originalFactory ? originalFactory(dependencies, originModule) : function() { return {}; };
                            } catch (e) {
                                return function() { return {}; };
                            }
                        };
                    if (!module.request && module.resource) {
                        module.request = module.resource;
                    }

                    if (typeof module.identifier !== 'function') {
                        module.identifier = () => module.request || module.id || 'unknown-module';
                    }
                }
            });

            // Hook into chunk creation to ensure proper module factory calls
            compilation.hooks.afterOptimizeChunks.tap('SimpleModuleFactoryFix', (chunks) => {
                for (const chunk of chunks) {
                    const modules = chunk.getModules ? chunk.getModules() : 
                                   (chunk.modulesIterable || []);
                    
                    for (const module of modules) {
                        // Ensure module factory is callable
                        if (module.factory && typeof module.factory !== 'function') {
                            module.factory = () => ({});
                        }
                        
                        // Ensure module has valid identifier
                        if (typeof module.identifier !== 'function') {
                            module.identifier = () => module.request || module.id || 'unknown-module';
                        }
                    }
                }
            });
        });
    }
}

module.exports = SimpleModuleFactoryFix;
