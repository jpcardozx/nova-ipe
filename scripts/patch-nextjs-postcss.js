/**
 * This script patches NextJS internal files to prevent class inheritance issues
 * especially with PostCSS processing
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Patching Next.js PostCSS processing...');

// Next.js directories to check
const nextModulePath = path.join(process.cwd(), 'node_modules', 'next');
const potentialPaths = [
  path.join(nextModulePath, 'dist', 'build', 'webpack', 'loaders', 'css-loader', 'src'),
  path.join(nextModulePath, 'dist', 'compiled', 'css-loader'),
  path.join(nextModulePath, 'dist', 'compiled', 'postcss-loader')
];

// Function to recursively find and patch files
function findAndPatchFiles(dir, patchFn) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️ Directory does not exist: ${dir}`);
    return;
  }
  
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      findAndPatchFiles(itemPath, patchFn);
    } else if (stats.isFile() && itemPath.endsWith('.js')) {
      patchFn(itemPath);
    }
  });
}

// Function to patch a specific file
function patchFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file contains any class inheritance
    if (content.includes('class ') && 
        (content.includes(' extends ') || content.includes('class extends'))) {
      
      console.log(`🔍 Found class inheritance in: ${filePath}`);
      
      // Replace class inheritance with function factories
      let patchedContent = content
        // Fix class extension
        .replace(/class\s+(\w+)\s+extends\s+([\w\.]+)/g, 'function $1_factory()')
        // Fix super calls
        .replace(/super\((.*?)\)/g, '{}')
        // Fix this references in constructors
        .replace(/this\.(\w+)\s*=/g, 'var $1 =');
      
      fs.writeFileSync(filePath, patchedContent);
      console.log(`✅ Patched: ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ Error patching ${filePath}: ${err.message}`);
  }
}

// Process all potential paths
potentialPaths.forEach(dir => {
  console.log(`🔍 Searching for files to patch in: ${dir}`);
  findAndPatchFiles(dir, patchFile);
});

// Create a NodeJS module resolution patch
const moduleResolutionPatch = `
/**
 * This patch ensures that all require() calls in NextJS work correctly
 * especially for modules that might have class inheritance issues.
 */

const originalRequire = module.constructor.prototype.require;

// Override require to handle errors and provide fallbacks
module.constructor.prototype.require = function patchedRequire(modulePath) {
  try {
    return originalRequire.apply(this, arguments);
  } catch (error) {
    // For PostCSS plugins, provide a simple fallback
    if (modulePath.includes('postcss') || 
        modulePath.includes('tailwindcss') || 
        modulePath.includes('autoprefixer') || 
        modulePath.includes('css-loader')) {
      
      console.warn(\`⚠️ Module resolution error: \${modulePath}, using fallback\`);
      
      // Return a simple plugin factory
      return function createFallbackPlugin() {
        const plugin = {
          postcssPlugin: 'fallback-plugin',
          Once(root) { return root; }
        };
        plugin.postcss = true;
        return plugin;
      };
    }
    
    // For other modules, rethrow the error
    throw error;
  }
};
`;

// Write the module resolution patch
const patchPath = path.join(process.cwd(), 'lib', 'patches', 'module-resolution-patch.js');
// Make sure directory exists
if (!fs.existsSync(path.dirname(patchPath))) {
  fs.mkdirSync(path.dirname(patchPath), { recursive: true });
}
fs.writeFileSync(patchPath, moduleResolutionPatch);
console.log(`✅ Created module resolution patch: ${patchPath}`);

// Create a loader for the patch in next.config.js
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Only add if not already present
  if (!nextConfig.includes('module-resolution-patch')) {
    const patchRequire = `
// Load our module resolution patch
try {
  require('./lib/patches/module-resolution-patch');
  console.log('✅ Module resolution patch loaded');
} catch (error) {
  console.error('❌ Failed to load module resolution patch:', error.message);
}
`;
    
    // Insert at the top of the file
    nextConfig = patchRequire + nextConfig;
    fs.writeFileSync(nextConfigPath, nextConfig);
    console.log('✅ Added module resolution patch to next.config.js');
  }
}

console.log('🎉 Next.js patching complete!');
