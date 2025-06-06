/**
 * Component and Import Consolidation Script
 * 
 * This script analyzes the codebase for duplicate component imports
 * and updates them to use the standardized unified components.
 * 
 * @version 1.0.0
 * @date June 2, 2025
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Configuration
const projectRoot = path.resolve(__dirname);
const excludeDirs = ['node_modules', '.next', 'archive', '.git'];

// Component mappings for consolidation
const componentMappings = {
  // Map old component imports to new unified ones
  '@/app/components/VirtualizedPropertiesGrid': '@/app/components/VirtualizedPropertiesGridUnified',
  '@/components/ui/property/PropertyCard': '@/components/ui/property/PropertyCardUnified',
  'VirtualizedPropertiesGrid': 'VirtualizedPropertiesGridUnified',
  'PropertyCard': 'PropertyCardUnified',
  'OptimizedImovelCard': 'PropertyCardUnified',
  'ImovelCard': 'PropertyCardUnified',
};

// File patterns to process
const filePatterns = ['.tsx', '.jsx', '.ts', '.js'];

// Function to recursively get all files
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    if (excludeDirs.includes(subdir)) return [];
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.flat();
}

// Function to process a file
async function processFile(filePath) {
  // Skip if not a target file type
  if (!filePatterns.some(ext => filePath.endsWith(ext))) {
    return false;
  }
  
  try {
    let content = await readFile(filePath, 'utf8');
    let originalContent = content;
    let changed = false;

    // Process imports
    Object.entries(componentMappings).forEach(([oldImport, newImport]) => {
      // Match different import patterns
      const importRegexes = [
        new RegExp(`import\\s+[{\\s\\w,]*${oldImport}[\\s\\w,}]*\\s+from\\s+['"](.*?)['"]`, 'g'),
        new RegExp(`import\\s+${oldImport}\\s+from\\s+['"](.*?)['"]`, 'g'),
        new RegExp(`const\\s+${oldImport}\\s*=\\s*dynamic\\(\\s*\\(\\)\\s*=>\\s*import\\(['"](.*?)['"]\\)`, 'g'),
      ];
      
      importRegexes.forEach(regex => {
        if (regex.test(content)) {
          changed = true;
          
          if (regex.source.includes('dynamic')) {
            // Handle dynamic imports
            content = content.replace(regex, 
              `const ${newImport} = dynamic(() => import('${newImport.startsWith('@') ? newImport : `@/components/ui/property/${newImport}`}')`);
          } else {
            // Handle static imports
            content = content.replace(regex, 
              (match) => match.replace(oldImport, newImport));
          }
        }
      });
      
      // Also replace component usage
      const usageRegex = new RegExp(`<${oldImport}(\\s|\\/)`, 'g');
      if (usageRegex.test(content)) {
        changed = true;
        content = content.replace(usageRegex, `<${newImport}$1`);
      }
    });
    
    // If changes were made, write the file
    if (changed) {
      await writeFile(filePath, content, 'utf8');
      console.log(`[UPDATED] ${path.relative(projectRoot, filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`[ERROR] Processing ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting component consolidation...');
  
  const files = await getFiles(projectRoot);
  let updatedCount = 0;
  
  // Process files in parallel with a concurrency limit
  const concurrencyLimit = 10;
  const chunks = [];
  for (let i = 0; i < files.length; i += concurrencyLimit) {
    chunks.push(files.slice(i, i + concurrencyLimit));
  }
  
  for (const chunk of chunks) {
    const results = await Promise.all(chunk.map(file => processFile(file)));
    updatedCount += results.filter(Boolean).length;
  }
  
  console.log(`Consolidation complete! Updated ${updatedCount} files.`);
}

// Run the script
main().catch(console.error);
