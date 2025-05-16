/**
 * Enhanced vercel-build script - simplified version
 * This script runs a simplified build process for Vercel
 */

console.log('🚀 Running simplified Vercel build process...');

// Execute the normal build process directly
const { execSync } = require('child_process');
console.log('📦 Running Next.js build...');

try {
    execSync('next build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully!');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
