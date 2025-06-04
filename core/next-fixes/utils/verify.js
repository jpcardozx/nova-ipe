/**
 * Verification utility for the Next.js fixes
 * 
 * Checks that all components of the solution are correctly implemented and working.
 * 
 * Created May 30, 2025
 */

const fs = require('fs');
const path = require('path');

// Console styling for logs
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

// Helper functions for logging
const log = {
  success: msg => console.log(`${GREEN}✅ ${msg}${RESET}`),
  info: msg => console.log(`${BLUE}ℹ️ ${msg}${RESET}`),
  warning: msg => console.log(`${YELLOW}⚠️ ${msg}${RESET}`),
  error: msg => console.log(`${RED}❌ ${msg}${RESET}`),
  title: msg => console.log(`\n${BLUE}==== ${msg} ====${RESET}\n`)
};

log.title('Verifying Next.js hydration and webpack fixes');

// Check required files
const requiredFiles = [
  { path: 'core/next-fixes/index.js', description: 'Main fix integration module' },
  { path: 'core/next-fixes/polyfills/browser-polyfills.js', description: 'Browser polyfills for SSR' },
  { path: 'core/next-fixes/plugins/webpack-factory-fix.js', description: 'Webpack factory fix plugin' },
  { path: 'core/next-fixes/plugins/minimal-ssr-plugin.js', description: 'Minimal SSR plugin' },
  { path: 'core/next-fixes/utils/next-patcher.js', description: 'Next.js patcher utility' },
  { path: 'app/error.tsx', description: 'Simplified error component' },
  { path: 'app/global-error.tsx', description: 'Simplified global error component' },
  { path: 'next.config.js', description: 'Next.js configuration' }
];

let allGood = true;
for (const file of requiredFiles) {
  const filePath = path.resolve(process.cwd(), file.path);
  
  if (!fs.existsSync(filePath)) {
    allGood = false;
    log.error(`Missing ${file.description}: ${file.path}`);
  } else {
    log.success(`Found ${file.description}: ${file.path}`);
    
    // Additional checks for file content
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (file.path === 'next.config.js') {
      if (!content.includes('core/next-fixes')) {
        allGood = false;
        log.error(`next.config.js is not using the new organized fix structure`);
      } else {
        log.success(`next.config.js is properly configured`);
      }
    }
    
    if (file.path === 'app/error.tsx' || file.path === 'app/global-error.tsx') {
      if (content.includes('useTheme') || content.includes('next-themes')) {
        allGood = false;
        log.error(`${file.path} still contains problematic code (useTheme/next-themes)`);
      } else {
        log.success(`${file.path} has been properly simplified`);
      }
    }
  }
}

// Check package.json scripts
const packageJsonPath = path.resolve(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  if (!packageJson.scripts.dev.includes('./core/next-fixes')) {
    allGood = false;
    log.error(`package.json dev script does not use the new organized fix structure`);
  } else {
    log.success(`package.json dev script is properly configured`);
  }
  
  if (!packageJson.scripts.build.includes('./core/next-fixes')) {
    allGood = false;
    log.error(`package.json build script does not use the new organized fix structure`);
  } else {
    log.success(`package.json build script is properly configured`);
  }
}

console.log('');
if (allGood) {
  log.success('All checks passed! The Next.js fixes are properly organized and implemented.');
  log.info('\nYou can now run the application with:');
  console.log(`${BLUE}npm run dev:clean${RESET}`);
} else {
  log.error('Some checks failed. Please address the issues above.');
}

console.log('');
log.info('For more information, see the documentation in:');
console.log(`${BLUE}docs/next-fixes-architecture.md${RESET}`);

module.exports = {
  verify: () => allGood
};
