const fs = require('fs');
const path = require('path');

// Script para encontrar componentes potencialmente undefined
function findPotentialUndefinedComponents(dir) {
  const results = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Padrões que podem causar componentes undefined
        const patterns = [
          /export\s+default\s+undefined/g,
          /return\s+undefined/g,
          /\<\s*undefined\s*\>/g,
          /\<\s*\{\s*undefined\s*\}\s*\>/g,
          /component\s*:\s*undefined/g,
          /Component\s*=\s*undefined/g,
          /\{\s*undefined\s*\}/g
        ];
        
        patterns.forEach((pattern, index) => {
          const matches = content.match(pattern);
          if (matches) {
            results.push({
              file: fullPath,
              pattern: pattern.toString(),
              matches: matches,
              lines: content.split('\n').map((line, i) => 
                pattern.test(line) ? `Line ${i + 1}: ${line.trim()}` : null
              ).filter(Boolean)
            });
          }
        });
      }
    }
  }
  
  scanDirectory(dir);
  return results;
}

const projectDir = process.cwd();
console.log('🔍 Searching for potential undefined components...\n');

const results = findPotentialUndefinedComponents(projectDir);

if (results.length === 0) {
  console.log('✅ No obvious undefined component patterns found.');
} else {
  console.log(`❌ Found ${results.length} potential issues:\n`);
  results.forEach((result, index) => {
    console.log(`${index + 1}. File: ${result.file}`);
    console.log(`   Pattern: ${result.pattern}`);
    console.log(`   Lines: ${result.lines.join(', ')}`);
    console.log('');
  });
}
