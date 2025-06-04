// @ts-nocheck
/**
 * Next.js Path Fixes - Fixed Version
 * Apply patches to Next.js core files for specific issues
 * 
 * Created May 31, 2025
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

/**
 * Apply patches to Next.js core files for specific issues
 */
function patchNextJSFiles() {
  // Only run on server
  if (typeof window !== 'undefined') return false;
  
  const patches = [
    // Fix for "Cannot destructure property 'protocol' of 'window.location'"
    {
      file: 'node_modules/next/dist/shared/lib/utils.js',
      search: /function getLocationOrigin\(\) \{[\s\S]*?const \{[^}]+\} = window\.location;/,
      replace: `function getLocationOrigin() {
  // PATCHED by next-fixes/utils/next-patcher.js
  if (typeof window === 'undefined' || !window.location) {
    return \`http://localhost:\${process.env.PORT || 3002}\`;
  }
  const { protocol, hostname, port } = window.location;`
    },
    // Fix for getURL
    {
      file: 'node_modules/next/dist/shared/lib/utils.js',
      search: /function getURL\(\) \{[\s\S]*?const \{[^}]+\} = window\.location;/,
      replace: `function getURL() {
  // PATCHED by next-fixes/utils/next-patcher.js
  if (typeof window === 'undefined' || !window.location) {
    return '/';
  }
  const { href } = window.location;`
    },
    // Fix for parsing relative URL
    {
      file: 'node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js',
      search: /export function parseRelativeUrl\(url, base\?\) \{[\s\S]*?const resolvedBase = base \? new URL\(base, DUMMY_BASE\) : DUMMY_BASE;/,
      replace: `export function parseRelativeUrl(url, base) {
  // PATCHED by next-fixes/utils/next-patcher.js
  const DUMMY_BASE = new URL(
    typeof window === 'undefined' || !window.location
      ? (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://localhost:3000')
      : getLocationOrigin()
  );
  const resolvedBase = base ? new URL(base, DUMMY_BASE) : DUMMY_BASE;`
    }
  ];

  try {
    let patchesApplied = 0;
    
    // Apply each patch
    patches.forEach(({ file, search, replace }) => {
      try {
        const filePath = path.resolve(process.cwd(), file);
        
        // Skip if file doesn't exist
        if (!fs.existsSync(filePath)) {
          log.warning(`File not found: ${file}`);
          return;
        }
        
        // Read file content
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if already patched
        if (content.includes('PATCHED by next-fixes')) {
          log.info(`File already patched: ${file}`);
          return;
        }
        
        // Apply patch
        const newContent = content.replace(search, replace);
        
        // Skip if no changes
        if (newContent === content) {
          log.warning(`Pattern not found in ${file}`);
          return;
        }
        
        // Backup original file
        const backupPath = `${filePath}.original`;
        if (!fs.existsSync(backupPath)) {
          fs.writeFileSync(backupPath, content);
        }
        
        // Write patched file
        fs.writeFileSync(filePath, newContent);
        patchesApplied++;
        
        log.success(`Patched ${file}`);
      } catch (e) {
        log.error(`Failed to patch ${file}: ${e.message}`);
      }
    });
    
    if (patchesApplied > 0) {
      log.success(`${patchesApplied} Next.js files patched successfully`);
      return true;
    } else {
      log.info('No patches applied to Next.js files');
      return false;
    }
  } catch (e) {
    log.error(`Failed to apply patches: ${e.message}`);
    return false;
  }
}

module.exports = {
  patchNextJSFiles
};
