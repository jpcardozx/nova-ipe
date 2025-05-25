/**
 * Simplified Webpack Patch for Next.js
 * Emergency fix for "Cannot read properties of undefined (reading 'length')" error
 */

module.exports = function applyWebpackFixes(config) {
    // Basic output configuration
    config.output = config.output || {};
    config.output.globalObject = 'globalThis';

    // Disable problematic optimizations that cause runtime errors
    if (config.optimization) {
        config.optimization.concatenateModules = false;
        config.optimization.splitChunks = false; // Temporarily disable split chunks
    }

    // Ignore common warnings
    config.ignoreWarnings = [
        { message: /Critical dependency/ },
        { message: /Failed to parse source map/ }
    ];

    return config;
}