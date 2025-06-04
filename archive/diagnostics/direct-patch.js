/**
 * Direct patch for Next.js parseRelativeUrl function
 * This patches the exact location where the error occurs
 */

const path = require('path');
const fs = require('fs');

// Get the path to the parse-relative-url.js file
const parseRelativeUrlPath = path.resolve(
  __dirname,
  'node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js'
);

try {
  // Read the original file
  let content = fs.readFileSync(parseRelativeUrlPath, 'utf8');
  
  // Check if already patched
  if (content.includes('VS_CODE_PATCH_APPLIED')) {
    console.log('[DIRECT PATCH] Parse relative URL already patched');
    return;
  }
  
  // Find the error location and patch it
  const originalErrorPattern = /throw new Error\(`invariant: invalid relative URL, router received \${url\}`\)/g;
  
  const patchedCode = `
    // VS_CODE_PATCH_APPLIED
    // Handle VS Code Simple Browser absolute URLs
    if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
      try {
        const urlObj = new URL(url);
        // Convert to relative URL
        url = urlObj.pathname + urlObj.search + urlObj.hash;
        console.log('[DIRECT PATCH] Converted absolute URL to relative:', url);
      } catch (error) {
        console.log('[DIRECT PATCH] Failed to parse URL, using root:', url);
        url = '/';
      }
    }
    
    // Original error check
    if (typeof url !== 'string' || (!url.startsWith('/') && !url.startsWith('#') && !url.startsWith('?'))) {
      throw new Error(\`invariant: invalid relative URL, router received \${url}\`);
    }
  `;
  
  // Replace the error throw with our patched version
  content = content.replace(
    originalErrorPattern,
    patchedCode
  );
  
  // Write back the patched file
  fs.writeFileSync(parseRelativeUrlPath, content);
  console.log('[DIRECT PATCH] Successfully patched parse-relative-url.js');
  
} catch (error) {
  console.error('[DIRECT PATCH] Failed to patch parse-relative-url.js:', error);
}
