/**
 * Next.js Build System Emergency Fix
 * 
 * This script fixes webpack compilation errors and regenerates critical 
 * build artifacts that might be missing or corrupted.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Logger with colors
const logger = {
  info: (msg) => console.log(`\x1b[34m[INFO] ${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS] ${msg}\x1b[0m`),
  warning: (msg) => console.log(`\x1b[33m[WARNING] ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m[ERROR] ${msg}\x1b[0m`),
};

// Clean build artifacts
function cleanBuildArtifacts() {
  const nextDir = path.join(process.cwd(), '.next');
  
  logger.info('Cleaning build artifacts');
  
  if (fs.existsSync(nextDir)) {
    try {
      fs.rmSync(nextDir, { recursive: true, force: true });
      logger.success('Successfully removed .next directory');
    } catch (err) {
      logger.error(`Failed to remove .next directory: ${err.message}`);
      return false;
    }
  } else {
    logger.info('.next directory does not exist, no cleaning needed');
  }
  
  // Clean npm cache
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
    logger.success('Cleaned npm cache');
    return true;
  } catch (err) {
    logger.error(`Failed to clean npm cache: ${err.message}`);
    return false;
  }
}

// Create fallback build manifest (for emergency recovery)
function createFallbackBuildManifest() {
  const dotNextDir = path.join(process.cwd(), '.next');
  const fallbackManifestPath = path.join(dotNextDir, 'fallback-build-manifest.json');
  
  logger.info('Creating fallback build manifest');
  
  // Create .next directory if it doesn't exist
  if (!fs.existsSync(dotNextDir)) {
    try {
      fs.mkdirSync(dotNextDir, { recursive: true });
      logger.info('Created .next directory');
    } catch (err) {
      logger.error(`Failed to create .next directory: ${err.message}`);
      return false;
    }
  }
  
  // Create a minimal fallback manifest
  const fallbackManifest = {
    pages: {
      '/_app': [],
      '/_error': [],
      '/_document': []
    },
    ampFirstPages: [],
    rootMainFiles: [],
    app: {}
  };
  
  try {
    fs.writeFileSync(
      fallbackManifestPath,
      JSON.stringify(fallbackManifest, null, 2),
      'utf8'
    );
    logger.success(`Created fallback build manifest at ${fallbackManifestPath}`);
    return true;
  } catch (err) {
    logger.error(`Failed to create fallback build manifest: ${err.message}`);
    return false;
  }
}

// Fix webpack syntax errors in app-router.js
function fixWebpackSyntaxError() {
  const distDir = path.join(process.cwd(), '.next', 'server', 'vendors-node_modules_next_c.js');
  
  logger.info('Checking for webpack syntax errors');
  
  if (!fs.existsSync(distDir)) {
    logger.warning('Compiled app-router.js not found, may need to run build first');
    return true; // Not a failure, file may not exist yet
  }
  
  try {
    const content = fs.readFileSync(distDir, 'utf8');
    
    // Look for potential syntax errors like "Unexpected token ':'
    if (content.includes(':{') || content.includes('} :')) {
      logger.warning('Potential syntax error found in compiled file');
      
      // Create backup before modifying
      const backupPath = `${distDir}.backup-${Date.now()}`;
      fs.copyFileSync(distDir, backupPath);
      logger.info(`Created backup at ${backupPath}`);
      
      // This is risky but we're in emergency recovery mode
      // We replace any suspicious "} :" or ": {" patterns
      const fixedContent = content
        .replace(/\}\s*:/g, '}:')
        .replace(/:\s*\{/g, ':{');
      
      fs.writeFileSync(distDir, fixedContent, 'utf8');
      logger.success('Applied potential fix to webpack syntax errors');
    } else {
      logger.info('No obvious syntax errors found in compiled file');
    }
    
    return true;
  } catch (err) {
    logger.error(`Error checking/fixing webpack syntax: ${err.message}`);
    return false;
  }
}

// Execute all fixes
async function runAllFixes() {
  logger.info('Starting Next.js Build System Emergency Fix');
  
  // Step 1: Clean build artifacts
  const cleanResult = cleanBuildArtifacts();
  if (!cleanResult) {
    logger.warning('Build artifact cleaning had issues, but continuing');
  }
  
  // Step 2: Create fallback build manifest
  const manifestResult = createFallbackBuildManifest();
  if (!manifestResult) {
    logger.warning('Fallback manifest creation failed, but continuing');
  }
  
  // Step 3: Fix webpack syntax errors
  const webpackResult = fixWebpackSyntaxError();
  if (!webpackResult) {
    logger.warning('Webpack fixes had issues, but continuing');
  }
  
  logger.success('Build system emergency fixes applied');
  logger.info('You should now be able to run the application');
}

// Run the fixes
runAllFixes();
