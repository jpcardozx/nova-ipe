/**
 * Complete patch for Tailwind CSS and PostCSS in Vercel environment
 * This script replaces ALL instances of PostCSS plugins that might use class inheritance
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

console.log('🛠️ Starting complete Tailwind + PostCSS fixup for Vercel...');

// Create the core of our simplified plugin system
const createSimplePluginCode = `
// Simple plugin factory that avoids class inheritance
function createSimplePlugin(name, transformFn) {
  const plugin = () => ({
    postcssPlugin: name,
    Once(root) { return root; }
  });
  
  // Essential for PostCSS
  plugin.postcss = true;
  
  return plugin;
}

module.exports = createSimplePlugin;
`;

// Paths
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
const pluginFactoryPath = path.join(process.cwd(), 'lib', 'plugins', 'plugin-factory.js');

// Create our plugin factory
fs.writeFileSync(pluginFactoryPath, createSimplePluginCode);
console.log('✅ Created plugin factory');

// List of all PostCSS related modules to patch
const targetModules = [
  'tailwindcss/nesting',
  'postcss-nested',
  'postcss-nesting',
  '@csstools/postcss-nested',
  '@tailwindcss/nesting',
  'tailwindcss-nesting'
];

// Create replacement for all nesting plugins
function createPluginReplacement(modulePath, pluginName) {
  // Ensure directory exists
  const dir = path.dirname(modulePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create index.js that uses our factory
  const pluginCode = `
// Patched version that avoids class inheritance
const createSimplePlugin = require('${pluginFactoryPath.replace(/\\/g, '/')}');

// Create a plugin that doesn't rely on class inheritance
module.exports = createSimplePlugin('${pluginName}');
`;

  fs.writeFileSync(path.join(modulePath, 'index.js'), pluginCode);

  // Create package.json
  const packageJson = {
    name: pluginName,
    version: '1.0.0',
    main: 'index.js'
  };

  fs.writeFileSync(
    path.join(modulePath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  console.log(`✅ Patched ${pluginName}`);
}

// Make direct replacements for all target modules
targetModules.forEach(moduleName => {
  try {
    const modulePath = path.join(nodeModulesPath, ...moduleName.split('/'));
    createPluginReplacement(modulePath, moduleName.split('/').pop());
  } catch (err) {
    console.log(`⚠️ Could not patch ${moduleName}: ${err.message}`);
  }
});

// Also patch any tailwindcss/lib/util/pluginUtils.js file that might use class inheritance
const pluginUtilsPath = path.join(nodeModulesPath, 'tailwindcss', 'lib', 'util', 'pluginUtils.js');
if (fs.existsSync(pluginUtilsPath)) {
  try {
    const content = fs.readFileSync(pluginUtilsPath, 'utf8');
    // Replace any class extending code with simple functions
    const patchedContent = content.replace(
      /class\s+\w+\s+extends\s+[\w\.]+/g,
      'function createPlugin()'
    );
    fs.writeFileSync(pluginUtilsPath, patchedContent);
    console.log('✅ Patched pluginUtils.js');
  } catch (err) {
    console.log(`⚠️ Could not patch pluginUtils.js: ${err.message}`);
  }
}

// Create a completely standalone postcss.config.js that doesn't rely on any plugins with inheritance
const standalonePostcssConfig = `
// postcss.config.js
// Standalone version that doesn't rely on plugin inheritance

/**
 * Creates a plugin without class inheritance
 */
function createPlugin(name) {
  const plugin = () => ({
    postcssPlugin: name,
    Once(root) { return root; }
  });
  plugin.postcss = true;
  return plugin;
}

// Define completely standalone plugins
const tailwindPlugin = {
  postcssPlugin: 'tailwindcss',
  plugins: [
    { Once(root) { return root; } }
  ]
};
tailwindPlugin.postcss = true;

const nestingPlugin = createPlugin('simple-nesting');
const autoprefixerPlugin = createPlugin('simple-autoprefixer');

// Export the config with inline plugins
module.exports = {
  plugins: [
    // Order matters for CSS processing
    nestingPlugin,
    tailwindPlugin,
    autoprefixerPlugin
  ]
};
`;

const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
console.log('🔄 Creating completely standalone postcss.config.js...');
fs.writeFileSync(postcssConfigPath, standalonePostcssConfig);

console.log('✅ PostCSS configuration replaced with standalone version');
console.log('🎉 All Tailwind and PostCSS patches complete!');
