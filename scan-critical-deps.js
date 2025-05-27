const fs = require('fs');
const path = require('path');

console.log('🔍 Scanning for critical missing dependencies causing build errors...');

// Define key packages that are causing errors in the build
const criticalPackages = [
  'refractor',
  '@dnd-kit/accessibility', 
  '@dnd-kit/core',
  '@dnd-kit/modifiers',
  '@dnd-kit/sortable',
  '@dnd-kit/utilities',
  '@portabletext/editor',
  '@portabletext/block-tools',
  '@portabletext/to-html',
  '@portabletext/patches',
  'react-copy-to-clipboard',
  'copy-to-clipboard',
  'toggle-selection',
  'react-remove-scroll',
  'use-sync-external-store'
];

// Check for refractor languages specifically
const refractorLangs = [
  'bash',
  'javascript',
  'json',
  'jsx',
  'typescript',
  'tsx',
  'css',
  'markdown',
  'php',
  'python',
  'yaml'
];

// Check if packages are in dependencies
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
const allDependencies = {
  ...packageJson.dependencies || {}, 
  ...packageJson.devDependencies || {},
  ...packageJson.optionalDependencies || {}
};

// First check for refractor, since it's the main cause of build errors
const hasRefractor = !!allDependencies['refractor'];
console.log(`✓ Refractor package installed: ${hasRefractor ? 'Yes' : 'No'}`);

// Check for all missing packages
const missingPackages = [];
const missingRefractorLangs = [];

// Check critical packages
for (const pkg of criticalPackages) {
  if (!allDependencies[pkg]) {
    missingPackages.push(pkg);
  } else {
    console.log(`✓ ${pkg} is already installed`);
  }
}

// Check if refractor languages can be resolved
if (hasRefractor) {
  for (const lang of refractorLangs) {
    try {
      require.resolve(`refractor/lang/${lang}.js`);
      console.log(`✓ refractor/lang/${lang}.js is available`);
    } catch (e) {
      console.log(`✗ refractor/lang/${lang}.js is missing`);
      missingRefractorLangs.push(lang);
    }
  }
}

// Generate installation commands
if (missingPackages.length > 0 || missingRefractorLangs.length > 0) {
  console.log('\n--- CRITICAL MISSING PACKAGES ---');
  
  if (missingPackages.length > 0) {
    console.log(`\npnpm add ${missingPackages.join(' ')}`);
  }
  
  // For refractor, we need to install the main package if missing
  // Otherwise, just install the language packages
  if (missingRefractorLangs.length > 0) {
    if (!hasRefractor) {
      console.log(`\n# Install refractor with critical languages:`);
      console.log(`pnpm add refractor`);
    }
    
    // Additional languages if needed
    if (missingRefractorLangs.length > 0) {
      console.log(`\n# If needed, additional refractor languages can be added manually in code:`);
      console.log(`// Add these imports to a file that runs early in your app:`);
      missingRefractorLangs.forEach(lang => {
        console.log(`import 'refractor/lang/${lang}.js';`);
      });
    }
  }
  
  console.log('\n--- BUILD FIX COMMAND ---');
  console.log('# After installing dependencies, run:');
  console.log('pnpm run build');
} else {
  console.log('\n✅ All critical packages are installed.');
}
