/**
 * Next.js Patch Verification Script
 * 
 * This script checks if the Next.js patching has been applied correctly
 * and verifies that no syntax errors have been introduced
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Console formatting
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`
};

// Logger
const log = {
  info: (msg) => console.log(colors.blue('ℹ️ ') + msg),
  success: (msg) => console.log(colors.green('✅ ') + msg),
  warning: (msg) => console.log(colors.yellow('⚠️ ') + msg),
  error: (msg) => console.log(colors.red('❌ ') + msg),
  title: (msg) => console.log(`\n${colors.blue('==== ' + msg + ' ====')}\n`)
};

// Files to check
const filesToVerify = [
  'node_modules/next/dist/shared/lib/utils.js',
  'node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js',
  'node_modules/next/dist/shared/lib/router/utils/parse-url.js',
  'node_modules/next/dist/server/base-server.js'
];

// Check if a file contains a specific pattern
function fileContainsPattern(filePath, pattern) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes(pattern);
  } catch (error) {
    log.error(`Error reading ${path.basename(filePath)}: ${error.message}`);
    return false;
  }
}

// Check JavaScript syntax
function checkSyntax(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    vm.runInNewContext(content, {});
    return true;
  } catch (error) {
    return { error: error.message };
  }
}

// Main verification function
async function verifyPatches() {
  log.title('NEXT.JS PATCH VERIFICATION');
  
  let allValid = true;
  
  for (const file of filesToVerify) {
    const fullPath = path.resolve(process.cwd(), file);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      log.error(`File not found: ${file}`);
      allValid = false;
      continue;
    }
    
    // Check for patch marker
    const isPatchApplied = fileContainsPattern(fullPath, 'SAFE-PATCH');
    
    // Check syntax
    const syntaxCheck = checkSyntax(fullPath);
    
    if (syntaxCheck === true) {
      if (isPatchApplied) {
        log.success(`${file}: Patched correctly, syntax valid`);
      } else {
        log.warning(`${file}: Not patched, but syntax is valid`);
        allValid = false;
      }
    } else {
      log.error(`${file}: SYNTAX ERROR - ${syntaxCheck.error}`);
      allValid = false;
    }
  }
  
  log.title('VERIFICATION RESULTS');
  
  if (allValid) {
    log.success('All patches are applied correctly and syntax is valid!');
    log.info('Your Next.js application should now run without window.location errors.');
  } else {
    log.error('Some files are not properly patched or have syntax errors.');
    log.info('Run the improved-nextjs-patch.js script to fix these issues.');
  }
}

// Run verification
verifyPatches().catch(err => {
  log.error(`Uncaught error: ${err.message}`);
});
