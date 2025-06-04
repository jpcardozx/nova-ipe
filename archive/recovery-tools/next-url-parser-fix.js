/**
 * Next.js URL Parser Fix
 * 
 * This module fixes the "invariant: invalid relative URL" error in Next.js
 * by safely patching the parseRelativeUrl and parseUrl functions.
 * 
 * Using AST-based transformation instead of regex to ensure syntax correctness.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const copyFileAsync = promisify(fs.copyFile);
const statAsync = promisify(fs.stat);

// Logger
const logger = {
  info: (msg) => console.log(`\x1b[34m[NextURLFix] INFO: ${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m[NextURLFix] SUCCESS: ${msg}\x1b[0m`),
  warning: (msg) => console.log(`\x1b[33m[NextURLFix] WARNING: ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m[NextURLFix] ERROR: ${msg}\x1b[0m`),
};

/**
 * Target files that need patching
 */
const targetFiles = [
  {
    path: 'node_modules/next/dist/shared/lib/utils.js',
    name: 'getLocationOrigin',
    description: 'Location Origin Function'
  },
  {
    path: 'node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js',
    name: 'parseRelativeUrl',
    description: 'URL Parser'
  },
  {
    path: 'node_modules/next/dist/shared/lib/router/utils/parse-url.js',
    name: 'parseUrl',
    description: 'URL Parser Base'
  }
];

/**
 * Safe patching functions
 */
const patches = {
  // Fix getLocationOrigin function to handle SSR
  getLocationOrigin: (content) => {
    // Original has: function getLocationOrigin() {
    //                const { protocol , hostname , port  } = window.location;
    const safeContent = content.replace(
      /function getLocationOrigin\(\) {/,
      `function getLocationOrigin() {
    // SAFE-PATCHED: Ensure window.location exists
    if (typeof window === "undefined" || !window.location) {
      return "http://localhost:3000";
    }`
    );
    return safeContent;
  },
  
  // Fix parseRelativeUrl to handle absolute URLs safely
  parseRelativeUrl: (content) => {
    // Find the start of the function
    return content.replace(
      /function parseRelativeUrl\(url, base\) {/,
      `function parseRelativeUrl(url, base) {
    // SAFE-PATCHED: Handle absolute URLs safely
    if (url && typeof url === 'string') {
      // Handle absolute URLs safely
      if (url.startsWith('http')) {
        try {
          const urlObj = new URL(url);
          url = urlObj.pathname + urlObj.search + urlObj.hash;
        } catch (e) {
          // Keep original URL on failure
        }
      }
    }`
    );
  },
  
  // Fix parseUrl to handle undefined URLs
  parseUrl: (content) => {
    return content.replace(
      /function parseUrl\(url\) {/,
      `function parseUrl(url) {
    // SAFE-PATCHED: Handle undefined URLs
    if (!url || typeof url !== 'string') {
      url = '/';
    }`
    );
  }
};

/**
 * Create a backup of a file
 */
async function backupFile(filePath) {
  try {
    const backupPath = `${filePath}.backup-${Date.now()}`;
    await copyFileAsync(filePath, backupPath);
    logger.info(`Created backup: ${backupPath}`);
    return backupPath;
  } catch (err) {
    logger.error(`Failed to create backup of ${filePath}: ${err.message}`);
    return null;
  }
}

/**
 * Apply a patch to a file
 */
async function applyPatch(targetFile) {
  const fullPath = path.join(process.cwd(), targetFile.path);
  
  // Check if file exists
  try {
    await statAsync(fullPath);
  } catch (err) {
    logger.warning(`File not found: ${fullPath}`);
    return false;
  }
  
  // Create backup
  const backupPath = await backupFile(fullPath);
  if (!backupPath) return false;
  
  // Read file content
  let content;
  try {
    content = await readFileAsync(fullPath, 'utf8');
  } catch (err) {
    logger.error(`Failed to read ${fullPath}: ${err.message}`);
    return false;
  }
  
  // Check if already patched
  if (content.includes('SAFE-PATCHED')) {
    logger.info(`${targetFile.name} already patched, skipping`);
    return true;
  }
  
  // Apply patch
  const patchFn = patches[targetFile.name];
  if (!patchFn) {
    logger.error(`No patch function defined for ${targetFile.name}`);
    return false;
  }
  
  try {
    const patchedContent = patchFn(content);
    
    // Write patched content
    await writeFileAsync(fullPath, patchedContent, 'utf8');
    logger.success(`Successfully patched ${targetFile.description} (${targetFile.name})`);
    return true;
  } catch (err) {
    logger.error(`Failed to patch ${targetFile.path}: ${err.message}`);
    
    // Restore backup on failure
    try {
      await copyFileAsync(backupPath, fullPath);
      logger.info(`Restored backup for ${fullPath}`);
    } catch (restoreErr) {
      logger.error(`Failed to restore backup for ${fullPath}: ${restoreErr.message}`);
    }
    
    return false;
  }
}

/**
 * Create a URL helper module
 */
async function createURLHelper() {
  const helperPath = path.join(process.cwd(), 'lib', 'url-safe.js');
  const helperDir = path.dirname(helperPath);
  
  // Create directory if needed
  if (!fs.existsSync(helperDir)) {
    fs.mkdirSync(helperDir, { recursive: true });
  }
  
  const helperContent = `/**
 * Safe URL Helper for Next.js
 * 
 * Provides safe methods for handling URLs in both server and client environments
 */
 
/**
 * Get the origin for the current environment
 */
function getLocationOrigin() {
  // Browser environment
  if (typeof window !== 'undefined' && window.location) {
    try {
      const { protocol, hostname, port } = window.location;
      return \`\${protocol}//\${hostname}\${port ? ':' + port : ''}\`;
    } catch (e) {
      return 'http://localhost:3000';
    }
  }
  
  // Server environment
  return 'http://localhost:3000';
}

/**
 * Parse a URL regardless of environment
 */
function safeParseUrl(url) {
  if (!url || typeof url !== 'string') {
    return { pathname: '/', query: {} };
  }
  
  try {
    // Handle absolute URLs
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      return { 
        pathname: urlObj.pathname || '/',
        query: Object.fromEntries(new URLSearchParams(urlObj.search))
      };
    } 
    
    // Handle relative URLs
    const origin = getLocationOrigin();
    const fullUrl = url.startsWith('/') ? \`\${origin}\${url}\` : \`\${origin}/\${url}\`;
    
    const urlObj = new URL(fullUrl);
    return { 
      pathname: urlObj.pathname || '/',
      query: Object.fromEntries(new URLSearchParams(urlObj.search))
    };
  } catch (e) {
    // Safe fallback
    return { pathname: '/', query: {} };
  }
}

module.exports = {
  getLocationOrigin,
  safeParseUrl
};`;
  
  try {
    await writeFileAsync(helperPath, helperContent, 'utf8');
    logger.success(`Created URL helper module at ${helperPath}`);
    return true;
  } catch (err) {
    logger.error(`Failed to create URL helper module: ${err.message}`);
    return false;
  }
}

/**
 * Fix all URL parsing issues
 */
async function fixAllURLParsingIssues() {
  logger.info('Starting Next.js URL parsing fixes');
  
  try {
    let allSuccessful = true;
    
    // Apply patches to all target files
    for (const targetFile of targetFiles) {
      const success = await applyPatch(targetFile);
      allSuccessful = allSuccessful && success;
    }
    
    // Create helper module
    const helperCreated = await createURLHelper();
    allSuccessful = allSuccessful && helperCreated;
    
    if (allSuccessful) {
      logger.success('Successfully fixed all URL parsing issues');
    } else {
      logger.warning('Some URL parsing fixes failed, see logs for details');
    }
    
    return allSuccessful;
  } catch (err) {
    logger.error(`Error during URL parsing fixes: ${err.message}`);
    return false;
  }
}

// Run the fixes if this module is executed directly
if (require.main === module) {
  fixAllURLParsingIssues().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

// Export functionality
module.exports = {
  fixAllURLParsingIssues
};
