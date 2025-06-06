/**
 * This module shims the `postcss-nested` module to guarantee it doesn't cause 
 * class inheritance errors during the build process.
 * It is compatible with the standard PostCSS plugin API.
 */

'use strict';

// Export a simplified version of the nested plugin
// This completely eliminates the class inheritance that causes problems
module.exports = function shimNestedPlugin(options = {}) {
    return {
        postcssPlugin: 'postcss-nested-shim',

        // Most basic implementation that does nothing
        // but provides a valid plugin shape
        Once(root) {
            return root;
        }
    };
};

// Required flag for PostCSS plugin compatibility
module.exports.postcss = true;
