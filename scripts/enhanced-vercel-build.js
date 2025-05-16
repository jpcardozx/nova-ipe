/**
 * Enhanced vercel-build script that combines all fixes
 * This script should be run as part of Vercel's build process
 */

console.log('🚀 Running enhanced Vercel build process...');

// Run our comprehensive fixes first
require('./complete-postcss-patch');
require('./patch-nextjs-postcss');
require('./fix-postcss-inheritance');
require('./fix-postcss-sync');
require('./validate-nesting-plugin');

// Execute the normal build process
const { execSync } = require('child_process');
console.log('📦 Running Next.js build...');

try {
  execSync('npm run build:vercel', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
