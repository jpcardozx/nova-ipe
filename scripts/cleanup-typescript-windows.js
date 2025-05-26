const fs = require('fs');
const path = require('path');

console.log('🧹 Starting TypeScript cleanup for Windows...');

// Get all TypeScript files
function getAllTypeScriptFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !['node_modules', '.next', '.git'].includes(item)) {
      getAllTypeScriptFiles(fullPath, files);
    } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fix unused variables pattern
function fixUnusedVariables(content) {
  let fixed = content;
  
  // Remove unused imports like: import { unused } from 'module'
  const unusedImportPattern = /import\s*{\s*([^}]+)\s*}\s*from\s*['"][^'"]+['"];?\s*\n/g;
  
  // Common unused patterns we can safely remove
  const commonUnused = [
    /import\s+React\s+from\s+['"]react['"];\s*\n/g, // React import when not needed
    /import\s*{\s*useEffect\s*}\s*from\s*['"]react['"];\s*\n/g, // Unused useEffect
    /import\s*{\s*useState\s*}\s*from\s*['"]react['"];\s*\n/g, // Unused useState
    /import\s*{\s*useRef\s*}\s*from\s*['"]react['"];\s*\n/g, // Unused useRef
  ];
  
  commonUnused.forEach(pattern => {
    fixed = fixed.replace(pattern, '');
  });
  
  return fixed;
}

// Fix environment variable access
function fixEnvAccess(content) {
  // Replace process.env.VAR with process.env['VAR']
  return content.replace(/process\.env\.([A-Z_][A-Z0-9_]*)/g, "process.env['$1']");
}

// Main execution
try {
  const files = getAllTypeScriptFiles('./');
  let totalFiles = 0;
  let modifiedFiles = 0;
  
  console.log(`Found ${files.length} TypeScript files`);
  
  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let modified = content;
      
      // Apply fixes
      modified = fixUnusedVariables(modified);
      modified = fixEnvAccess(modified);
      
      // Only write if content changed
      if (modified !== content) {
        fs.writeFileSync(filePath, modified, 'utf8');
        console.log(`✅ Fixed: ${path.relative('./', filePath)}`);
        modifiedFiles++;
      }
      
      totalFiles++;
    } catch (error) {
      console.log(`❌ Error processing ${filePath}: ${error.message}`);
    }
  });
  
  console.log(`\n🎉 Cleanup complete!`);
  console.log(`📊 Processed: ${totalFiles} files`);
  console.log(`🔧 Modified: ${modifiedFiles} files`);
  
} catch (error) {
  console.error('❌ Cleanup failed:', error.message);
  process.exit(1);
}
