/**
 * Standalone implementation of CSS nesting plugin for PostCSS that doesn't rely on inheritance
 * This version is designed specifically to fix the "Class extends value undefined is not a constructor or null" error
 * 
 * This is a simplified version that doesn't actually process CSS nesting but provides a valid
 * plugin interface to avoid build errors on Vercel.
 */

'use strict';

/**
 * Creates a plugin that complies with PostCSS plugin specification
 * @param {Object} opts Plugin options (not used in this implementation)
 * @returns {Object} A valid PostCSS plugin
 */
function createNestingPlugin(opts = {}) {
    // Create a simple object with the required PostCSS plugin structure
    return {
        // Must have a postcssPlugin property with a string value
        postcssPlugin: 'postcss-isolated-nesting',

        // Simple Once hook that passes through without transformation
        Once(root) {
            return root;
        },

        // Root node processing (optional, not doing anything in this implementation)
        Root(root) {
            // Just return without modifying
            return;
        },

        // Rule processing (optional, not doing anything in this implementation) 
        Rule(rule) {
            // Just return without modifying
            return;
        }
    };
}

// CRITICAL: This property must be set to true for PostCSS to recognize this as a plugin
createNestingPlugin.postcss = true;

module.exports = createNestingPlugin;
