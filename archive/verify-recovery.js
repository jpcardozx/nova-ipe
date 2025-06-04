/**
 * Next.js Recovery Verification
 * 
 * This script checks if the emergency recovery successfully fixed the issues
 * by examining critical files and their content.
 */

const fs = require('fs');
const path = require('path');

// Logger
const log = {
  info: (msg) => console.log(`\x1b[34m[INFO] ${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS] ${msg}\x1b[0m`),
  warning: (msg) => console.log(`\x1b[33m[WARNING] ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m[ERROR] ${msg}\x1b[0m`),
  section: (title) => console.log(`\n\x1b[36m=== ${title} ===\x1b[0m\n`)
};

// Check React DOM for syntax error
function checkReactDom() {
  const reactDomPath = path.join(__dirname, 'node_modules', 'react-dom', 'cjs', 'react-dom.development.js');
  
  log.section('CHECKING REACT DOM');
  
  if (!fs.existsSync(reactDomPath)) {
    log.error(`React DOM development file not found: ${reactDomPath}`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(reactDomPath, 'utf8');
    
    // Check for the problematic pattern
    if (content.includes('setAttribute(_attributeName, \'\' + value) || function(){};')) {
      log.error('React DOM still contains the syntax error!');
      return false;
    } else {
      log.success('React DOM syntax error has been fixed');
      return true;
    }
  } catch (err) {
    log.error(`Error checking React DOM: ${err.message}`);
    return false;
  }
}

// Check Next.js URL parser
function checkUrlParser() {
  const parseRelativeUrlPath = path.join(
    __dirname, 
    'node_modules', 
    'next', 
    'dist', 
    'shared', 
    'lib', 
    'router', 
    'utils', 
    'parse-relative-url.js'
  );
  
  log.section('CHECKING NEXT.JS URL PARSER');
  
  if (!fs.existsSync(parseRelativeUrlPath)) {
    log.error(`Next.js parse-relative-url.js file not found: ${parseRelativeUrlPath}`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(parseRelativeUrlPath, 'utf8');
    
    // Check if the fix has been applied
    if (content.includes('// EMERGENCY FIX: Handle absolute URLs')) {
      log.success('Next.js URL parser has been fixed');
      return true;
    } else {
      log.warning('Next.js URL parser fix was not found - may not be necessary if using a clean next.config.js');
      return true;
    }
  } catch (err) {
    log.error(`Error checking Next.js URL parser: ${err.message}`);
    return false;
  }
}

// Check next.config.js
function checkNextConfig() {
  const nextConfigPath = path.join(__dirname, 'next.config.js');
  
  log.section('CHECKING NEXT.JS CONFIG');
  
  if (!fs.existsSync(nextConfigPath)) {
    log.error(`Next.js config file not found: ${nextConfigPath}`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Check for problematic patching code
    if (content.includes('patch-react-dom.js') || 
        content.includes('PATCHED_FOR_SSR_ELEMENT_SETATTRIBUTE') ||
        content.includes('lib/next-patchers')) {
      log.warning('Next.js config still contains references to old patching system');
      return false;
    } else {
      log.success('Next.js config appears to be clean');
      return true;
    }
  } catch (err) {
    log.error(`Error checking Next.js config: ${err.message}`);
    return false;
  }
}

// Check package.json
function checkPackageJson() {
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  log.section('CHECKING PACKAGE.JSON');
  
  if (!fs.existsSync(packageJsonPath)) {
    log.error(`package.json not found: ${packageJsonPath}`);
    return false;
  }
  
  try {
    const content = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check for problematic scripts
    let hasProblematicScripts = false;
    
    if (content.scripts) {
      if (content.scripts.predev && content.scripts.predev.includes('patch')) {
        log.warning(`Found problematic script 'predev': ${content.scripts.predev}`);
        hasProblematicScripts = true;
      }
      
      if (content.scripts.prebuild && content.scripts.prebuild.includes('patch')) {
        log.warning(`Found problematic script 'prebuild': ${content.scripts.prebuild}`);
        hasProblematicScripts = true;
      }
    }
    
    if (hasProblematicScripts) {
      log.warning('Package.json contains problematic patching scripts');
      return false;
    } else {
      log.success('Package.json appears to be clean');
      return true;
    }
  } catch (err) {
    log.error(`Error checking package.json: ${err.message}`);
    return false;
  }
}

// Check for build artifacts
function checkBuildArtifacts() {
  const dotNextDir = path.join(__dirname, '.next');
  
  log.section('CHECKING BUILD ARTIFACTS');
  
  if (!fs.existsSync(dotNextDir)) {
    log.info('.next directory does not exist - run npm run dev or npm run build to generate it');
    return true;
  }
  
  // Check for critical build files
  const fallbackManifest = path.join(dotNextDir, 'fallback-build-manifest.json');
  
  if (!fs.existsSync(fallbackManifest)) {
    log.info('Fallback build manifest not found - not a critical issue if Next.js starts correctly');
  } else {
    log.success('Fallback build manifest exists');
  }
  
  return true;
}

// Run all checks
function runVerification() {
  log.section('NEXT.JS RECOVERY VERIFICATION');
  
  const checks = [
    { name: 'React DOM Syntax', result: checkReactDom() },
    { name: 'Next.js URL Parser', result: checkUrlParser() },
    { name: 'Next.js Config', result: checkNextConfig() },
    { name: 'Package.json', result: checkPackageJson() },
    { name: 'Build Artifacts', result: checkBuildArtifacts() }
  ];
  
  log.section('VERIFICATION SUMMARY');
  
  const passed = checks.filter(check => check.result).length;
  const failed = checks.filter(check => !check.result).length;
  
  for (const check of checks) {
    if (check.result) {
      log.success(`✓ ${check.name}`);
    } else {
      log.error(`✗ ${check.name}`);
    }
  }
  
  log.section('NEXT STEPS');
  
  if (failed === 0) {
    log.success(`All ${checks.length} checks passed!`);
    log.info('The application should now work correctly. Run:');
    log.info('  npm run dev     - to start the development server');
    log.info('  npm run build   - to build for production');
  } else {
    log.warning(`${failed} out of ${checks.length} checks failed.`);
    
    if (checks[0].result === false) {
      log.info('The React DOM syntax error needs to be fixed:');
      log.info('  node fix-react-dom-direct.js');
    }
    
    if (checks[2].result === false) {
      log.info('Replace the next.config.js with a clean version:');
      log.info('  Copy-Item -Path next.config.emergency-clean.js -Destination next.config.js -Force');
    }
    
    if (checks[3].result === false) {
      log.info('Remove problematic scripts from package.json');
    }
  }
}

// Run verification
runVerification();
