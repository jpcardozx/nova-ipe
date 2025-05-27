const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define paths to scan
const SANITY_LIB_PATH = path.join(__dirname, 'node_modules', 'sanity', 'lib');
const PORTABLETEXT_EDITOR_PATH = path.join(__dirname, 'node_modules', '@portabletext', 'editor');
const NODE_MODULES_PATH = path.join(__dirname, 'node_modules');

// Get installed dependencies from package.json
const packageJson = require('./package.json');
const installedDeps = new Set([
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.devDependencies || {}),
  ...Object.keys(packageJson.optionalDependencies || {})
]);

// Known Node.js core modules to ignore
const NODE_CORE_MODULES = new Set([
  'fs', 'path', 'util', 'events', 'stream', 'http', 'https',
  'crypto', 'os', 'child_process', 'buffer', 'url', 'querystring',
  'zlib', 'net', 'dns', 'dgram', 'cluster', 'readline', 'process',
  'assert', 'string_decoder', 'tls', 'vm', 'timers', 'v8',
  'worker_threads', 'perf_hooks', 'punycode', 'tty', 'module',
  'domain'
]);

// Categories for grouping packages
const CATEGORIES = {
  highlighting: ['refractor', 'highlight.js', 'prismjs', 'shiki'],
  accessibility: ['@dnd-kit', 'react-remove-scroll', 'focus-trap', 'aria-'],
  editor: ['@portabletext', '@sanity/block-tools', 'slate', 'codemirror'],
  utils: ['copy-to-clipboard', 'toggle-selection', 'use-sync-external-store'],
  other: []
};

// Results storage
const missingDependencies = new Map();
const dependencyUsages = new Map();

// Scan a file for import statements
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for ES imports
    const esImports = content.match(/import\s+(?:(?:[^{},\s]+|\{(?:[^{}]*)\})\s+from\s+)?['"]([^'"]+)['"]/g) || [];
    
    // Look for require statements
    const requireStatements = content.match(/require\(['"]([^'"]+)['"]\)/g) || [];
    
    // Extract package names from ES imports
    const esPackages = esImports.map(imp => {
      const match = imp.match(/['"]([^'"]+)['"]/);
      return match ? match[1] : null;
    }).filter(Boolean);
    
    // Extract package names from require statements
    const requirePackages = requireStatements.map(req => {
      const match = req.match(/require\(['"]([^'"]+)['"]\)/);
      return match ? match[1] : null;
    }).filter(Boolean);
    
    // Combine all found packages
    return [...new Set([...esPackages, ...requirePackages])];
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error.message);
    return [];
  }
}

// Extract package name from import path
function getPackageName(importPath) {
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    return null; // Relative import, not an external package
  }
  
  // Handle scoped packages (@org/package)
  if (importPath.startsWith('@')) {
    const parts = importPath.split('/');
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`;
    }
  }
  
  // Handle normal packages
  return importPath.split('/')[0];
}

// Scan a directory recursively
function scanDirectory(dir, filter = () => true) {
  const results = [];
  
  try {
    if (!fs.existsSync(dir)) {
      return results;
    }
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        results.push(...scanDirectory(fullPath, filter));
      } else if (filter(fullPath)) {
        results.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
  
  return results;
}

// Check if a package is missing
function isMissingPackage(packageName) {
  if (!packageName) return false;
  if (NODE_CORE_MODULES.has(packageName)) return false;
  return !installedDeps.has(packageName);
}

// Categorize a package
function categorizePackage(packageName) {
  for (const [category, patterns] of Object.entries(CATEGORIES)) {
    if (patterns.some(pattern => packageName.includes(pattern))) {
      return category;
    }
  }
  return 'other';
}

// Main scanning function
function scanForMissingDependencies() {
  console.log('🔍 Scanning for missing dependencies...');
  
  // Define files to scan
  const filesToScan = [
    ...scanDirectory(SANITY_LIB_PATH, file => /\.(js|ts|jsx|tsx)$/.test(file)),
    ...scanDirectory(PORTABLETEXT_EDITOR_PATH, file => /\.(js|ts|jsx|tsx)$/.test(file)),
  ];
  
  console.log(`Found ${filesToScan.length} files to scan`);
  
  // Scan each file for imports
  for (const file of filesToScan) {
    const relativeFile = path.relative(__dirname, file);
    const imports = scanFile(file);
    
    for (const importPath of imports) {
      const packageName = getPackageName(importPath);
      
      if (packageName && !packageName.startsWith('.') && !NODE_CORE_MODULES.has(packageName)) {
        if (!dependencyUsages.has(importPath)) {
          dependencyUsages.set(importPath, []);
        }
        dependencyUsages.get(importPath).push(relativeFile);
        
        if (isMissingPackage(packageName)) {
          if (!missingDependencies.has(packageName)) {
            missingDependencies.set(packageName, new Set());
          }
          missingDependencies.get(packageName).add(importPath);
        }
      }
    }
  }
  
  // Handle special case for refractor languages
  if (installedDeps.has('refractor')) {
    const refractorLangs = [
      'refractor/lang/bash.js',
      'refractor/lang/javascript.js', 
      'refractor/lang/json.js',
      'refractor/lang/jsx.js',
      'refractor/lang/typescript.js',
    ];
    
    for (const lang of refractorLangs) {
      try {
        require.resolve(lang, { paths: [__dirname] });
      } catch (e) {
        // The language is not installed
        const packageName = lang.split('/')[0];
        if (!missingDependencies.has(packageName)) {
          missingDependencies.set(packageName, new Set());
        }
        missingDependencies.get(packageName).add(lang);
        
        if (!dependencyUsages.has(lang)) {
          dependencyUsages.set(lang, ['sanity/lib (implicit)']);
        }
      }
    }
  }
  
  // Results
  console.log('\n--- MISSING DEPENDENCIES ANALYSIS ---');
  
  if (missingDependencies.size === 0) {
    console.log('✅ No missing dependencies found!');
    return;
  }
  
  // Group by category
  const categorizedDeps = {};
  for (const [packageName, imports] of missingDependencies.entries()) {
    const category = categorizePackage(packageName);
    if (!categorizedDeps[category]) {
      categorizedDeps[category] = [];
    }
    
    categorizedDeps[category].push({
      package: packageName,
      imports: Array.from(imports),
      usages: Array.from(new Set(
        Array.from(imports).flatMap(imp => dependencyUsages.get(imp) || [])
      ))
    });
  }
  
  // Print by category
  for (const [category, deps] of Object.entries(categorizedDeps)) {
    if (deps.length === 0) continue;
    
    console.log(`\n🔹 ${category.toUpperCase()} (${deps.length} packages):`);
    
    for (const { package, imports, usages } of deps) {
      console.log(`\n📦 ${package}`);
      console.log('   Used as:');
      for (const imp of imports) {
        console.log(`   - ${imp}`);
      }
      console.log('   Referenced in:');
      for (const usage of usages.slice(0, 3)) {
        console.log(`   - ${usage}`);
      }
      if (usages.length > 3) {
        console.log(`   - ... and ${usages.length - 3} more`);
      }
    }
  }
  
  // Generate installation command
  const packagesToInstall = Array.from(missingDependencies.keys());
  
  console.log('\n--- INSTALLATION COMMAND ---');
  console.log(`pnpm add ${packagesToInstall.join(' ')}`);
}

// Execute
scanForMissingDependencies();
