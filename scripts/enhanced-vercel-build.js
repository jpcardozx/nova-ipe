/**
 * Enhanced vercel-build script - simplified version with PostCSS fix
 * This script runs a simplified build process for Vercel
 */

console.log('🚀 Running simplified Vercel build process...');

// Fix PostCSS configuration first
console.log('🔧 Applying critical PostCSS fix...');
require('./fix-postcss-config');

// Execute the normal build process directly
const { execSync } = require('child_process');
console.log('📦 Running Next.js build...');

try {
    // Ensure environment is production
    process.env.NODE_ENV = 'production';
    execSync('next build', {
        stdio: 'inherit',
        env: {
            ...process.env,
            NODE_ENV: 'production',
            NEXT_TELEMETRY_DISABLED: '1'
        }
    });
    console.log('✅ Build completed successfully!');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
