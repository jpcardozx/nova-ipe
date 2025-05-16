
// postcss.config.js
// Enhanced version for compatibility with Vercel and NextJS 15+
const path = require('path');

// First try the isolated, standalone nesting plugin 
const isolatedNestingPath = path.join(process.cwd(), 'lib', 'plugins', 'postcss-isolated-nesting.js');
// Fallback to the original one if the isolated version isn't available
const fallbackNestingPath = path.join(process.cwd(), 'lib', 'plugins', 'nesting-fallback.js');

// Attempt to load the plugins in order of preference
let nestingPlugin;
try {
  // Try to load our isolated plugin first
  nestingPlugin = require(isolatedNestingPath);
  console.log('✅ Using isolated nesting plugin');
} catch (error) {
  try {
    // Try fallback plugin next
    nestingPlugin = require(fallbackNestingPath);
    console.log('✅ Using fallback nesting plugin');
  } catch (fallbackError) {
    // If all else fails, use an inline definition
    nestingPlugin = function () {
      return {
        postcssPlugin: 'tailwindcss-nesting-inline-fallback',
        Once(root) { return root; }
      };
    };
    nestingPlugin.postcss = true;
    console.log('⚠️ Using inline nesting plugin definition');
  }
}

// Define simplified plugins to avoid class inheritance issues
const plugins = {
  // Use our custom nesting implementation first
  'tailwindcss/nesting': nestingPlugin,

  // Use tailwindcss with explicit config to avoid path resolution issues
  'tailwindcss': {
    config: path.join(__dirname, 'tailwind.config.js')
  }
};

// Add autoprefixer only if we're not in a problematic environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  plugins['autoprefixer'] = {};
} else {
  // In production Vercel builds, use a simplified inline version
  plugins['autoprefixer'] = {
    postcssPlugin: 'autoprefixer-inline',
    Once(root) { return root; }
  };
}

module.exports = { plugins };
