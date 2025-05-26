const fs = require('fs');
const path = require('path');

console.log('🔧 Starting comprehensive TypeScript error fixes...');

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

// Fix environment variable access patterns
function fixEnvironmentAccess(content) {
  // Replace process.env.VAR with process.env['VAR']
  return content.replace(/process\.env\.([A-Z_][A-Z0-9_]*)/g, "process.env['$1']");
}

// Fix missing React imports based on usage
function fixMissingReactImports(content) {
  let fixed = content;
  const hasJSX = /<[^>]+>/.test(content);
  
  if (hasJSX && !content.includes('import React') && !content.includes('from "react"')) {
    fixed = `import React from 'react';\n${fixed}`;
  }
  
  // Check for specific hooks and add them
  const hooks = ['useState', 'useEffect', 'useRef', 'useCallback', 'useMemo'];
  const usedHooks = hooks.filter(hook => content.includes(hook) && !content.includes(`import { ${hook}`) && !content.includes(`${hook},`));
  
  if (usedHooks.length > 0 && content.includes('import React')) {
    // Add hooks to existing React import
    const hookImports = usedHooks.join(', ');
    fixed = fixed.replace(
      "import React from 'react';", 
      `import React, { ${hookImports} } from 'react';`
    );
  } else if (usedHooks.length > 0) {
    // Add hook imports separately
    const hookImports = usedHooks.join(', ');
    fixed = `import { ${hookImports} } from 'react';\n${fixed}`;
  }
  
  return fixed;
}

// Fix bracket notation access for dynamic properties
function fixBracketNotation(content) {
  // Common property access patterns that should use brackets
  const patterns = [
    { from: /\.nome([^a-zA-Z0-9_])/g, to: "['nome']$1" },
    { from: /\.email([^a-zA-Z0-9_])/g, to: "['email']$1" },
    { from: /\.telefone([^a-zA-Z0-9_])/g, to: "['telefone']$1" },
    { from: /\.phone([^a-zA-Z0-9_])/g, to: "['phone']$1" },
    { from: /\.assunto([^a-zA-Z0-9_])/g, to: "['assunto']$1" },
    { from: /\.mensagem([^a-zA-Z0-9_])/g, to: "['mensagem']$1" },
    { from: /\.message([^a-zA-Z0-9_])/g, to: "['message']$1" },
    { from: /\.galeria([^a-zA-Z0-9_])/g, to: "['galeria']$1" },
    { from: /\.cidade([^a-zA-Z0-9_])/g, to: "['cidade']$1" },
    { from: /\.bairro([^a-zA-Z0-9_])/g, to: "['bairro']$1" },
  ];
  
  let fixed = content;
  patterns.forEach(pattern => {
    fixed = fixed.replace(pattern.from, pattern.to);
  });
  
  return fixed;
}

// Remove unused variables and imports
function removeUnusedCode(content) {
  let fixed = content;
  
  // Remove unused variable declarations
  const unusedPatterns = [
    /const\s+\w+\s*=\s*[^;]+;\s*\/\/\s*declared but its value is never read/g,
    /let\s+\w+\s*=\s*[^;]+;\s*\/\/\s*declared but its value is never read/g,
  ];
  
  // Remove common unused imports
  const commonUnusedImports = [
    /import\s*{\s*React\s*}\s*from\s*['"]react['"];\s*\n?/g,
    /,?\s*React\s*,?\s*/g, // React in destructured imports
  ];
  
  unusedPatterns.forEach(pattern => {
    fixed = fixed.replace(pattern, '');
  });
  
  commonUnusedImports.forEach(pattern => {
    fixed = fixed.replace(pattern, '');
  });
  
  return fixed;
}

// Add undefined to type unions for exactOptionalPropertyTypes
function fixOptionalProperties(content) {
  // This is complex and would require AST manipulation for accuracy
  // For now, we'll focus on common patterns
  return content;
}

// Main execution
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = content;
    
    // Apply fixes
    modified = fixEnvironmentAccess(modified);
    modified = fixMissingReactImports(modified);
    modified = fixBracketNotation(modified);
    modified = removeUnusedCode(modified);
    
    // Only write if content changed
    if (modified !== content) {
      fs.writeFileSync(filePath, modified, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

try {
  const files = getAllTypeScriptFiles('./');
  let totalFiles = 0;
  let modifiedFiles = 0;
  
  console.log(`Found ${files.length} TypeScript files`);
  
  // Process files in batches to avoid overwhelming output
  const batchSize = 50;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    
    batch.forEach(filePath => {
      if (processFile(filePath)) {
        console.log(`✅ Fixed: ${path.relative('./', filePath)}`);
        modifiedFiles++;
      }
      totalFiles++;
    });
    
    // Progress update
    console.log(`Progress: ${Math.min(i + batchSize, files.length)}/${files.length} files processed`);
  }
  
  console.log(`\n🎉 Comprehensive fixes complete!`);
  console.log(`📊 Processed: ${totalFiles} files`);
  console.log(`🔧 Modified: ${modifiedFiles} files`);
  
} catch (error) {
  console.error('❌ Fix process failed:', error.message);
  process.exit(1);
}
