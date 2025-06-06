/**
 * Hydration Error Verification Script
 * 
 * This script can be run to verify that the hydration errors have been fixed.
 * It checks for common error patterns and verifies that the critical fixes have been applied.
 */

console.log('Verifying fixes for "Cannot read properties of undefined (reading \'call\')" error');

// Check that the necessary polyfills are applied
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  './lib/global-polyfills.js',
  './webpack-factory-fix-enhanced.js',
  './webpack-ssr-fix.js'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.resolve(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing required file: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found required file: ${file}`);
  }
}

if (!allFilesExist) {
  console.error('Please run the fix script again to create all necessary files');
  process.exit(1);
}

// Verify that the error.tsx component has been fixed properly
const errorTsxPath = path.resolve(__dirname, './app/error.tsx');
if (fs.existsSync(errorTsxPath)) {
  const errorContent = fs.readFileSync(errorTsxPath, 'utf-8');
  if (errorContent.includes('import { useTheme } from \'next-themes\'')) {
    console.error('❌ Error component still has useTheme import which causes SSR issues');
  } else {
    console.log('✅ Error component has been properly fixed');
  }
} else {
  console.warn('⚠️ Could not find error.tsx to verify');
}

// Verify next.config.js has the webpack plugins
const nextConfigPath = path.resolve(__dirname, './next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const nextConfig = fs.readFileSync(nextConfigPath, 'utf-8');
  if (
    nextConfig.includes('WebpackFactoryFix') && 
    nextConfig.includes('SSRGlobalsPlugin')
  ) {
    console.log('✅ next.config.js has required webpack plugins');
  } else {
    console.error('❌ next.config.js is missing webpack plugins');
  }
} else {
  console.warn('⚠️ Could not find next.config.js to verify');
}

console.log('\nFix verification complete! Start the development server to test:');
console.log('npm run dev\n');

console.log('If you still encounter issues, try clearing the Next.js cache:');
console.log('npm run clean && npm run dev');
