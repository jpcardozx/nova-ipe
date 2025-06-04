/**
 * Simple build verification script
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function verify() {
  console.log('\n🔍 Verifying build setup...\n');

  // 1. Check critical files
  const requiredFiles = [
    'core/webpack-fix.js',
    'next.config.js',
    'app/error.tsx'
  ];

  console.log('Checking required files...');
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ Found ${file}`);
    } else {
      console.error(`❌ Missing ${file}`);
      process.exit(1);
    }
  });

  // 2. Test compilation
  console.log('\nTesting development build...');
  try {
    execSync('next build --no-lint', { stdio: 'inherit' });
    console.log('\n✅ Build successful!');
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

verify();
