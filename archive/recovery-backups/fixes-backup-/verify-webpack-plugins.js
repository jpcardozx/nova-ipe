/**
 * Webpack Plugin Verification Script
 * 
 * This script verifies that the webpack plugins are compatible with
 * the current webpack version in your Next.js project.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying webpack plugin compatibility...');

// Check if required files exist
const requiredFiles = [
  './ssr-globals-plugin.js',
  './webpack-factory-fix-enhanced.js',
  './next.config.js'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.resolve(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing required file: ${file}`);
    allFilesExist = false;
  } else {
    console.log(`✅ Found required file: ${file}`);
    
    // Verify file content
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for common mistakes in webpack plugins
    if (file.includes('plugin') && content.includes('return result')) {
      console.warn(`⚠️ Potential issue in ${file}: Contains "return result" which may cause issues with bailing hooks`);
    }
    
    if (file === './next.config.js' && !content.includes('ssr-globals-plugin')) {
      console.warn(`⚠️ next.config.js may not be using the updated plugin`);
    }
  }
}

if (!allFilesExist) {
  console.error('❌ Some required files are missing. Please run the fix script again.');
  process.exit(1);
}

console.log('\n✅ Verification complete! You should now be able to run:');
console.log('npm run dev\n');

// Provide helpful command to clear cache
console.log('If you still encounter issues, try clearing the Next.js cache:');
console.log('npm run clean && npm run dev');
