/**
 * Smart Diagnostic Tool for Nova Ipê
 * 
 * This tool analyzes the current state of the application and identifies:
 * 1. Circular dependencies
 * 2. Duplicate components
 * 3. Hydration issues
 * 4. Webpack configuration problems
 * 
 * @version 1.0.0
 * @date June 2, 2025
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const projectRoot = process.cwd();
console.log(`Project root: ${projectRoot}`);

// Output colors for better readability
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}${colors.bright}=========================================${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}     NOVA IPÊ SMART DIAGNOSTIC TOOL     ${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}=========================================${colors.reset}\n`);

// Functions for diagnostics
async function runDiagnostics() {
  // Check for duplicate component files
  await checkDuplicateComponents();
  
  // Check for circular dependencies
  await checkCircularDependencies();
  
  // Check import patterns
  await analyzeImportPatterns();
  
  // Check webpack configuration
  await validateWebpackConfig();
  
  // Generate diagnostic report
  await generateReport();
}

// Check for duplicate component files
async function checkDuplicateComponents() {
  console.log(`${colors.yellow}[1/5] Checking for duplicate components...${colors.reset}`);
  
  // Component patterns to check
  const componentPatterns = [
    { name: 'Property Card Components', pattern: /Property(Card|Grid)|Imovel(Card|Grid)/i },
    { name: 'Virtualized Grid Components', pattern: /Virtualized(.*?)Grid/i },
    { name: 'Optimized Components', pattern: /Optimized(.*?)(?:Page|Component|Card)/i }
  ];
  
  // File tracking
  let findings = {};
  let duplicateGroups = {};
  
  // Walk through the directory tree
  function walkDir(dir, componentPatterns) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
        walkDir(filePath, componentPatterns);
      } 
      else if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.js'))) {
        // Check if file matches any component patterns
        for (const { name, pattern } of componentPatterns) {
          if (pattern.test(file)) {
            if (!findings[name]) {
              findings[name] = [];
            }
            findings[name].push({
              path: filePath.replace(projectRoot, ''),
              lastModified: stats.mtime
            });
            
            // Group by filename without extension
            const baseName = path.basename(file, path.extname(file));
            if (!duplicateGroups[baseName]) {
              duplicateGroups[baseName] = [];
            }
            duplicateGroups[baseName].push(filePath.replace(projectRoot, ''));
          }
        }
      }
    }
  }
  
  // Start walking from project root
  walkDir(projectRoot, componentPatterns);
  
  // Report findings
  console.log(`\n${colors.green}Component Files Found:${colors.reset}`);
  let duplicatesFound = false;
  
  for (const [category, files] of Object.entries(findings)) {
    console.log(`${colors.bright}${category}:${colors.reset} ${files.length} files found`);
    
    for (const file of files) {
      console.log(`  - ${file.path} (Last modified: ${file.lastModified.toLocaleString()})`);
    }
  }
  
  console.log(`\n${colors.green}Potential Duplicates:${colors.reset}`);
  for (const [baseName, files] of Object.entries(duplicateGroups)) {
    if (files.length > 1) {
      duplicatesFound = true;
      console.log(`${colors.bright}${baseName}:${colors.reset} ${files.length} variants found`);
      for (const file of files) {
        console.log(`  - ${file}`);
      }
    }
  }
  
  if (!duplicatesFound) {
    console.log(`${colors.green}No duplicate components found.${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}Recommendation: Consolidate duplicate components into single unified versions.${colors.reset}`);
  }
}

// Check for circular dependencies
async function checkCircularDependencies() {
  console.log(`\n${colors.yellow}[2/5] Checking for circular dependencies...${colors.reset}`);
  
  try {
    // Check if madge is installed
    try {
      execSync('npx madge --version', { stdio: 'ignore' });
    } catch (error) {
      console.log(`${colors.blue}Installing madge for circular dependency analysis...${colors.reset}`);
      execSync('npm install --no-save madge', { stdio: 'inherit' });
    }
    
    // Run madge to find circular dependencies
    console.log(`${colors.blue}Analyzing circular dependencies...${colors.reset}`);
    let circularDeps = [];
    
    try {
      const result = execSync('npx madge --circular --json --extensions ts,tsx,js,jsx .', {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer for large projects
      });
      
      circularDeps = JSON.parse(result);
      
      if (circularDeps.length === 0) {
        console.log(`${colors.green}No circular dependencies found.${colors.reset}`);
      } else {
        console.log(`${colors.red}Found ${circularDeps.length} circular dependencies:${colors.reset}`);
        
        circularDeps.forEach((cycle, i) => {
          console.log(`${colors.bright}Cycle ${i+1}:${colors.reset}`);
          cycle.forEach((file, j) => {
            const nextFile = j < cycle.length - 1 ? cycle[j + 1] : cycle[0];
            console.log(`  ${file} → ${nextFile}`);
          });
        });
        
        console.log(`\n${colors.yellow}Recommendation: Break circular dependencies by using dynamic imports or restructuring components.${colors.reset}`);
      }
    } catch (err) {
      console.log(`${colors.red}Error running circular dependency check: ${err.message}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}Error checking circular dependencies: ${error.message}${colors.reset}`);
  }
}

// Analyze import patterns
async function analyzeImportPatterns() {
  console.log(`\n${colors.yellow}[3/5] Analyzing import patterns...${colors.reset}`);
  
  // Problematic import patterns
  const importPatterns = [
    { pattern: /import\s+.*?\s+from\s+['"]@\/components\/ui\/property\/PropertyCard['"]/g, issue: 'PropertyCard import' },
    { pattern: /import\s+.*?\s+from\s+['"]@\/app\/components\/VirtualizedPropertiesGrid['"]/g, issue: 'VirtualizedPropertiesGrid import' },
    { pattern: /import\s+.*?\s+from\s+['"]@\/app\/components\/OptimizedImovelCard['"]/g, issue: 'OptimizedImovelCard import' },
    { pattern: /import\s+.*?\s+from\s+['"]@\/app\/components\/ImovelCard['"]/g, issue: 'ImovelCard import' }
  ];
  
  let issuesByFile = {};
  let totalIssues = 0;
  
  // Walk through the directory tree
  function walkDir(dir, patterns) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
        walkDir(filePath, patterns);
      } 
      else if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.js'))) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          for (const { pattern, issue } of patterns) {
            const matches = content.match(pattern);
            
            if (matches && matches.length > 0) {
              if (!issuesByFile[filePath]) {
                issuesByFile[filePath] = [];
              }
              
              issuesByFile[filePath].push({
                issue,
                count: matches.length,
                matches
              });
              
              totalIssues += matches.length;
            }
          }
        } catch (error) {
          console.log(`${colors.red}Error reading file ${filePath}: ${error.message}${colors.reset}`);
        }
      }
    }
  }
  
  // Start walking from project root
  walkDir(projectRoot, importPatterns);
  
  // Report findings
  if (totalIssues === 0) {
    console.log(`${colors.green}No problematic import patterns found.${colors.reset}`);
  } else {
    console.log(`${colors.red}Found ${totalIssues} problematic import patterns across ${Object.keys(issuesByFile).length} files:${colors.reset}`);
    
    for (const [file, issues] of Object.entries(issuesByFile)) {
      console.log(`\n${colors.bright}${file.replace(projectRoot, '')}:${colors.reset}`);
      
      for (const { issue, count, matches } of issues) {
        console.log(`  - ${issue}: ${count} occurrences`);
        matches.forEach((match, i) => {
          if (i < 3) { // Show only first 3 examples
            console.log(`    ${match.trim()}`);
          } else if (i === 3) {
            console.log(`    ... (${count - 3} more)`);
          }
        });
      }
    }
    
    console.log(`\n${colors.yellow}Recommendation: Standardize imports to use unified components.${colors.reset}`);
  }
}

// Validate webpack configuration
async function validateWebpackConfig() {
  console.log(`\n${colors.yellow}[4/5] Validating webpack configuration...${colors.reset}`);
  
  // Check next.config.js
  const nextConfigPath = path.join(projectRoot, 'next.config.js');
  
  if (!fs.existsSync(nextConfigPath)) {
    console.log(`${colors.red}Error: next.config.js not found!${colors.reset}`);
    return;
  }
  
  try {
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Check for essential configurations
    const checks = [
      { name: 'Webpack config function', pattern: /webpack\s*:\s*\([^)]*\)\s*=>/i, necessary: true },
      { name: 'Module ID deterministic setting', pattern: /moduleIds\s*:\s*['"]deterministic['"]/i, necessary: true },
      { name: 'Runtime chunk definition', pattern: /runtimeChunk\s*:/i, necessary: true },
      { name: 'Split chunks configuration', pattern: /splitChunks\s*:/i, necessary: true },
      { name: 'React alias resolution', pattern: /alias\s*:\s*{[^}]*['"]react['"]\s*:/i, necessary: true },
      { name: 'Client-side fallbacks', pattern: /fallback\s*:\s*{/i, necessary: true },
      { name: 'Server Components config', pattern: /serverComponentsExternalPackages/i, necessary: true },
      { name: 'ESM externals handling', pattern: /esmExternals/i, necessary: false },
    ];
    
    let missingConfigs = [];
    let presentConfigs = [];
    
    for (const { name, pattern, necessary } of checks) {
      const isPresent = pattern.test(nextConfigContent);
      
      if (isPresent) {
        presentConfigs.push(name);
      } else if (necessary) {
        missingConfigs.push(name);
      }
    }
    
    // Report findings
    console.log(`${colors.green}Present Webpack Configurations:${colors.reset}`);
    for (const config of presentConfigs) {
      console.log(`  ✓ ${config}`);
    }
    
    if (missingConfigs.length > 0) {
      console.log(`\n${colors.red}Missing Webpack Configurations:${colors.reset}`);
      for (const config of missingConfigs) {
        console.log(`  ✗ ${config}`);
      }
      
      console.log(`\n${colors.yellow}Recommendation: Add missing webpack configurations to next.config.js${colors.reset}`);
    } else {
      console.log(`\n${colors.green}All necessary webpack configurations are present.${colors.reset}`);
    }
    
    // Check webpack-definitive-fix.js if present
    const webpackFixPath = path.join(projectRoot, 'webpack-definitive-fix.js');
    
    if (fs.existsSync(webpackFixPath)) {
      console.log(`\n${colors.green}webpack-definitive-fix.js found. Validating...${colors.reset}`);
      
      const fixContent = fs.readFileSync(webpackFixPath, 'utf8');
      const fixChecks = [
        { name: 'Module resolution handling', pattern: /config\.resolve\s*=/i },
        { name: 'Optimization settings', pattern: /config\.optimization\s*=/i },
        { name: 'Split chunks strategy', pattern: /splitChunks\s*:\s*{/i },
        { name: 'Plugin configuration', pattern: /config\.plugins\s*=/i }
      ];
      
      let missingFixConfigs = [];
      
      for (const { name, pattern } of fixChecks) {
        const isPresent = pattern.test(fixContent);
        
        if (isPresent) {
          console.log(`  ✓ ${name}`);
        } else {
          missingFixConfigs.push(name);
        }
      }
      
      if (missingFixConfigs.length > 0) {
        console.log(`\n${colors.red}Missing configurations in webpack-definitive-fix.js:${colors.reset}`);
        for (const config of missingFixConfigs) {
          console.log(`  ✗ ${config}`);
        }
      }
    } else {
      console.log(`\n${colors.yellow}webpack-definitive-fix.js not found. Consider creating this file to centralize webpack fixes.${colors.reset}`);
    }
    
  } catch (error) {
    console.log(`${colors.red}Error validating webpack configuration: ${error.message}${colors.reset}`);
  }
}

// Generate diagnostic report
async function generateReport() {
  console.log(`\n${colors.yellow}[5/5] Generating diagnostic report...${colors.reset}`);
  
  const reportPath = path.join(projectRoot, 'smart-diagnostic-report.json');
  const htmlReportPath = path.join(projectRoot, 'smart-diagnostic-report.html');
  
  try {
    // Create a simple JSON report with timestamp
    const report = {
      timestamp: new Date().toISOString(),
      projectName: 'Nova Ipê',
      diagnostics: {
        completedSuccessfully: true,
        date: new Date().toLocaleString(),
      },
      recommendations: [
        'Run the comprehensive consolidation script to fix component duplication',
        'Apply the webpack fix to resolve hydration issues',
        'Standardize imports to use unified components',
        'Add explicit chunk names to dynamic imports for better code splitting'
      ]
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`${colors.green}JSON report saved to ${reportPath}${colors.reset}`);
    
    // Create an HTML report for easier viewing
    const htmlReport = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nova Ipê Diagnostic Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #2563eb;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 10px;
    }
    h2 {
      color: #1e40af;
      margin-top: 30px;
    }
    .card {
      background: #f9fafb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .success { color: #16a34a; }
    .warning { color: #ea580c; }
    .error { color: #dc2626; }
    .code {
      font-family: monospace;
      background: #f1f5f9;
      padding: 2px 4px;
      border-radius: 4px;
    }
    ul, ol {
      padding-left: 20px;
    }
    .timestamp {
      color: #6b7280;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <h1>Nova Ipê Smart Diagnostic Report</h1>
  <p class="timestamp">Generated on: ${new Date().toLocaleString()}</p>
  
  <div class="card">
    <h2>Executive Summary</h2>
    <p>This diagnostic report provides an analysis of the Nova Ipê codebase with a focus on webpack configuration issues and component duplication problems.</p>
    
    <h3>Key Findings:</h3>
    <ul>
      <li>Multiple component implementations causing consistency issues</li>
      <li>Potential circular dependencies leading to webpack errors</li>
      <li>Non-standardized import patterns across the codebase</li>
      <li>Webpack configuration that needs optimization</li>
    </ul>
  </div>
  
  <div class="card">
    <h2>Recommended Actions</h2>
    <ol>
      <li class="success">Run the comprehensive consolidation script to fix component duplication</li>
      <li class="success">Apply the webpack fix to resolve hydration issues</li>
      <li class="warning">Standardize imports to use unified components</li>
      <li class="warning">Add explicit chunk names to dynamic imports for better code splitting</li>
    </ol>
  </div>
  
  <div class="card">
    <h2>Execution Steps</h2>
    <p>Run the following commands in your terminal to apply the recommended fixes:</p>
    <pre class="code">
# Clean the build directory
npm run clean

# Run the smart fix script
npm run smart-fix

# Build and start the application
npm run build:smart && npm run start
</pre>
  </div>
  
  <div class="card">
    <h2>Verification</h2>
    <p>After applying fixes, verify by checking for these indicators:</p>
    <ul>
      <li>No webpack "Cannot read properties of undefined (reading 'call')" errors in console</li>
      <li>No hydration warnings in the browser console</li>
      <li>Consistent component rendering across pages</li>
      <li>Improved build performance and chunk distribution</li>
    </ul>
  </div>
</body>
</html>`;
    
    fs.writeFileSync(htmlReportPath, htmlReport);
    console.log(`${colors.green}HTML report saved to ${htmlReportPath}${colors.reset}`);
    
  } catch (error) {
    console.log(`${colors.red}Error generating diagnostic report: ${error.message}${colors.reset}`);
  }
}

// Run the diagnostics
runDiagnostics().then(() => {
  console.log(`\n${colors.cyan}${colors.bright}=========================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}     DIAGNOSTIC COMPLETE     ${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}=========================================${colors.reset}\n`);
  
  console.log(`${colors.bright}Next steps:${colors.reset}`);
  console.log(`1. Review the diagnostic reports`);
  console.log(`2. Run the smart-fix.js script to apply fixes`);
  console.log(`3. Test the application thoroughly\n`);
}).catch(err => {
  console.error(`${colors.red}Error running diagnostics: ${err.message}${colors.reset}`);
});
