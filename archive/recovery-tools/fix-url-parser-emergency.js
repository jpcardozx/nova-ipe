/**
 * Next.js URL Parser Emergency Fix
 * 
 * This script fixes the "invariant: invalid relative URL" error by directly
 * patching the Next.js parseRelativeUrl function to handle absolute URLs correctly.
 */

const fs = require('fs');
const path = require('path');

// Logger with colors
const logger = {
  info: (msg) => console.log(`\x1b[34m[INFO] ${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS] ${msg}\x1b[0m`),
  warning: (msg) => console.log(`\x1b[33m[WARNING] ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m[ERROR] ${msg}\x1b[0m`),
};

// Function to patch the parseRelativeUrl function
function fixUrlParser() {
  const parseRelativeUrlPath = path.join(
    process.cwd(),
    'node_modules',
    'next',
    'dist',
    'shared',
    'lib',
    'router',
    'utils',
    'parse-relative-url.js'
  );

  if (!fs.existsSync(parseRelativeUrlPath)) {
    logger.error(`URL parser file not found: ${parseRelativeUrlPath}`);
    return false;
  }

  // Create backup
  const backupPath = `${parseRelativeUrlPath}.backup-${Date.now()}`;
  try {
    fs.copyFileSync(parseRelativeUrlPath, backupPath);
    logger.info(`Created backup of URL parser: ${backupPath}`);
  } catch (err) {
    logger.error(`Failed to create backup: ${err.message}`);
    return false;
  }

  try {
    // Read the file content
    let content = fs.readFileSync(parseRelativeUrlPath, 'utf8');
    
    // Look for the parseRelativeUrl function
    const functionRegex = /function parseRelativeUrl\(url,\s*base\)\s*{/;
    if (functionRegex.test(content)) {
      // Add our fix to handle absolute URLs
      const fixedContent = content.replace(
        functionRegex,
        `function parseRelativeUrl(url, base) {
  // EMERGENCY FIX: Handle absolute URLs safely
  if (url && typeof url === 'string' && url.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      // Extract the relative part only
      url = urlObj.pathname + urlObj.search + urlObj.hash;
    } catch (e) {
      // Silently continue with original URL
    }
  }`
      );
      
      // Write the fixed content
      fs.writeFileSync(parseRelativeUrlPath, fixedContent, 'utf8');
      logger.success('Successfully patched URL parser to handle absolute URLs');
      return true;
    } else {
      logger.warning('Could not locate parseRelativeUrl function');
      return false;
    }
  } catch (err) {
    logger.error(`Error fixing URL parser: ${err.message}`);
    try {
      // Restore backup on failure
      fs.copyFileSync(backupPath, parseRelativeUrlPath);
      logger.info('Restored backup due to error');
    } catch (restoreErr) {
      logger.error(`Failed to restore backup: ${restoreErr.message}`);
    }
    return false;
  }
}

// Function to fix the parse-url.js file too
function fixParseUrl() {
  const parseUrlPath = path.join(
    process.cwd(),
    'node_modules',
    'next',
    'dist',
    'shared',
    'lib',
    'router',
    'utils',
    'parse-url.js'
  );

  if (!fs.existsSync(parseUrlPath)) {
    logger.error(`Parse URL file not found: ${parseUrlPath}`);
    return false;
  }

  // Create backup
  const backupPath = `${parseUrlPath}.backup-${Date.now()}`;
  try {
    fs.copyFileSync(parseUrlPath, backupPath);
    logger.info(`Created backup of parse-url.js: ${backupPath}`);
  } catch (err) {
    logger.error(`Failed to create backup: ${err.message}`);
    return false;
  }

  try {
    // Read the file content
    let content = fs.readFileSync(parseUrlPath, 'utf8');
    
    // Look for the parseUrl function
    const functionRegex = /function parseUrl\(url\)\s*{/;
    if (functionRegex.test(content)) {
      // Add our fix to handle undefined or malformed URLs
      const fixedContent = content.replace(
        functionRegex,
        `function parseUrl(url) {
  // EMERGENCY FIX: Handle undefined or malformed URLs
  if (!url || typeof url !== 'string') {
    url = '/';
  }`
      );
      
      // Write the fixed content
      fs.writeFileSync(parseUrlPath, fixedContent, 'utf8');
      logger.success('Successfully patched parse-url.js to handle edge cases');
      return true;
    } else {
      logger.warning('Could not locate parseUrl function');
      return false;
    }
  } catch (err) {
    logger.error(`Error fixing parse-url.js: ${err.message}`);
    try {
      // Restore backup on failure
      fs.copyFileSync(backupPath, parseUrlPath);
      logger.info('Restored backup due to error');
    } catch (restoreErr) {
      logger.error(`Failed to restore backup: ${restoreErr.message}`);
    }
    return false;
  }
}

// Execute the fixes
try {
  logger.info('Starting Next.js URL Parser Emergency Fix');
  
  const relativeUrlFixed = fixUrlParser();
  const parseUrlFixed = fixParseUrl();
  
  if (relativeUrlFixed && parseUrlFixed) {
    logger.success('Successfully fixed both URL parser components');
  } else {
    logger.warning('Some URL parser fixes may not have been applied correctly');
  }
} catch (err) {
  logger.error(`Unexpected error: ${err.message}`);
}
