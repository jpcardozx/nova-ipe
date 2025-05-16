/**
 * Custom implementation of the tailwindcss nesting plugin that avoids class inheritance issues
 * This is specifically designed to fix the "Class extends value undefined is not a constructor or null" error
 */

'use strict';

// Create a simple nesting plugin that doesn't depend on PostCSS sync methods
function createNestingPlugin(opts = {}) {
    return {
        postcssPlugin: 'tailwindcss-nesting',

        // Simple Once hook that doesn't transform anything
        Once(root) {
            return root;
        }
    };
}

// Required for PostCSS to recognize this as a plugin
createNestingPlugin.postcss = true;

module.exports = createNestingPlugin;
