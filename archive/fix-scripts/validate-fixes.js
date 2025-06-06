/**
 * Validation Tool for Nova Ipê Website Fixes
 * 
 * This tool validates that all the fixes have been correctly applied and
 * checks for any remaining issues in:
 * 1. Webpack configuration
 * 2. Component standardization
 * 3. Import patterns
 * 4. Server/client component boundaries
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
console.log(`${colors.cyan}${colors.bright}     NOVA IPÊ FIX VALIDATION TOOL     ${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}=========================================${colors.reset}\n`);

// Functions for validation
async function validateFixes() {
  // Validation status
  const status = {
    webpack: { success: false, details: [] },
    components: { success: false, details: [] },
    imports: { success: false, details: [] },
    serverClient: { success: false, details: [] }
  };
  
  // Track overall success
  let successCount = 0;
  
  console.log(`${colors.blue}[1/4]${colors.reset} Validating webpack configuration...`);
  try {
    // Check if webpack-definitive-fix.js exists
    if (fs.existsSync(path.join(projectRoot, 'webpack-definitive-fix.js'))) {
      status.webpack.details.push('✓ webpack-definitive-fix.js exists');
      
      // Validate webpack config is being used in next.config.js
      const nextConfig = fs.readFileSync(path.join(projectRoot, 'next.config.js'), 'utf8');
      if (nextConfig.includes('applyWebpackFix')) {
        status.webpack.details.push('✓ next.config.js references webpack fix');
        
        // Validate webpack config content
        const webpackFix = fs.readFileSync(path.join(projectRoot, 'webpack-definitive-fix.js'), 'utf8');
        if (webpackFix.includes('moduleIds') && webpackFix.includes('splitChunks')) {
          status.webpack.details.push('✓ webpack config includes optimization settings');
          status.webpack.success = true;
          successCount++;
        } else {
          status.webpack.details.push('✗ webpack config missing optimization settings');
        }
      } else {
        status.webpack.details.push('✗ next.config.js does not use webpack fix');
      }
    } else {
      status.webpack.details.push('✗ webpack-definitive-fix.js not found');
    }
  } catch (error) {
    status.webpack.details.push(`✗ Error checking webpack: ${error.message}`);
  }
  
  console.log(`${colors.blue}[2/4]${colors.reset} Validating component standardization...`);
  try {
    // Check for unified component files
    const unifiedFiles = [
      'components/ui/property/PropertyCardUnified.tsx',
      'app/components/VirtualizedPropertiesGridUnified.tsx'
    ];
    
    let unifiedFilesFound = 0;
    for (const file of unifiedFiles) {
      if (fs.existsSync(path.join(projectRoot, file))) {
        status.components.details.push(`✓ Found ${file}`);
        unifiedFilesFound++;
      } else {
        status.components.details.push(`✗ Missing ${file}`);
      }
    }
    
    // Check for redirect stubs
    const redirectFiles = [
      'app/components/ImovelCard.tsx',
      'app/components/OptimizedImovelCard.tsx',
      'components/ui/property/PropertyCard.tsx'
    ];
    
    let redirectFilesFound = 0;
    for (const file of redirectFiles) {
      if (fs.existsSync(path.join(projectRoot, file))) {
        const content = fs.readFileSync(path.join(projectRoot, file), 'utf8');
        if (content.includes('This is a redirect stub') || content.includes('PropertyCardUnified')) {
          status.components.details.push(`✓ Redirect stub found for ${file}`);
          redirectFilesFound++;
        } else {
          status.components.details.push(`✗ File exists but is not a redirect stub: ${file}`);
        }
      } else {
        status.components.details.push(`✗ Missing redirect stub for ${file}`);
      }
    }
    
    // Check for backup files
    const backupDir = fs.readdirSync(path.join(projectRoot, 'archive'))
      .some(dir => dir.startsWith('component-backup-'));
      
    if (backupDir) {
      status.components.details.push('✓ Found component backups in archive directory');
    } else {
      status.components.details.push('✗ Missing component backups');
    }
    
    status.components.success = (unifiedFilesFound === unifiedFiles.length) && 
                              (redirectFilesFound === redirectFiles.length) &&
                              backupDir;
                              
    if (status.components.success) successCount++;
  } catch (error) {
    status.components.details.push(`✗ Error checking components: ${error.message}`);
  }
  
  console.log(`${colors.blue}[3/4]${colors.reset} Validating import patterns...`);
  try {
    // Check a sample of files for proper imports
    const filesToCheck = [
      'app/components/ClientPropertySection.tsx',
      'app/sections/Destaques.tsx',
      'lib/property-transformers.ts'
    ];
    
    let correctImports = 0;
    for (const file of filesToCheck) {
      if (fs.existsSync(path.join(projectRoot, file))) {
        const content = fs.readFileSync(path.join(projectRoot, file), 'utf8');
        if (content.includes('PropertyCardUnified') || 
            !content.includes('PropertyCard') ||
            content.includes('// Using unified component')) {
          status.imports.details.push(`✓ ${file} has correct imports`);
          correctImports++;
        } else {
          status.imports.details.push(`✗ ${file} has incorrect imports`);
        }
      } else {
        status.imports.details.push(`✗ File not found: ${file}`);
      }
    }
    
    status.imports.success = correctImports === filesToCheck.length;
    if (status.imports.success) successCount++;
  } catch (error) {
    status.imports.details.push(`✗ Error checking imports: ${error.message}`);
  }
  
  console.log(`${colors.blue}[4/4]${colors.reset} Validating server/client component boundaries...`);
  try {
    // Check next.config.js for server components configuration
    const nextConfig = fs.readFileSync(path.join(projectRoot, 'next.config.js'), 'utf8');
    if (nextConfig.includes('serverComponentsExternalPackages')) {
      status.serverClient.details.push('✓ Server components configuration present');
      
      // Check for use client directives in key files
      const clientFiles = [
        'components/ui/property/PropertyCardUnified.tsx',
        'app/components/VirtualizedPropertiesGridUnified.tsx'
      ];
      
      let clientDirectivesFound = 0;
      for (const file of clientFiles) {
        if (fs.existsSync(path.join(projectRoot, file))) {
          const content = fs.readFileSync(path.join(projectRoot, file), 'utf8');
          if (content.includes('use client')) {
            status.serverClient.details.push(`✓ "use client" directive found in ${file}`);
            clientDirectivesFound++;
          } else {
            status.serverClient.details.push(`✗ Missing "use client" directive in ${file}`);
          }
        } else {
          status.serverClient.details.push(`✗ File not found: ${file}`);
        }
      }
      
      status.serverClient.success = clientDirectivesFound === clientFiles.length;
      if (status.serverClient.success) successCount++;
    } else {
      status.serverClient.details.push('✗ Missing server components configuration');
    }
  } catch (error) {
    status.serverClient.details.push(`✗ Error checking server/client boundaries: ${error.message}`);
  }
  
  // Display validation results
  console.log(`\n${colors.bright}Validation Results:${colors.reset}\n`);
  
  console.log(`${colors.bright}Webpack Configuration:${colors.reset} ${status.webpack.success ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset}`);
  status.webpack.details.forEach(detail => console.log(`  ${detail}`));
  console.log();
  
  console.log(`${colors.bright}Component Standardization:${colors.reset} ${status.components.success ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset}`);
  status.components.details.forEach(detail => console.log(`  ${detail}`));
  console.log();
  
  console.log(`${colors.bright}Import Patterns:${colors.reset} ${status.imports.success ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset}`);
  status.imports.details.forEach(detail => console.log(`  ${detail}`));
  console.log();
  
  console.log(`${colors.bright}Server/Client Boundaries:${colors.reset} ${status.serverClient.success ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset}`);
  status.serverClient.details.forEach(detail => console.log(`  ${detail}`));
  console.log();
  
  // Overall result
  const overallSuccess = successCount === 4;
  console.log(`${colors.bright}Overall Validation:${colors.reset} ${overallSuccess ? colors.green + 'PASS' : colors.red + 'FAIL'}${colors.reset}`);
  console.log(`Score: ${successCount}/4 checks passed\n`);
  
  // Generate validation report
  const reportContent = `# Nova Ipê Fix Validation Report
*June 2, 2025*

## Validation Results

### 1. Webpack Configuration: ${status.webpack.success ? '✅ PASS' : '❌ FAIL'}
${status.webpack.details.map(detail => `- ${detail}`).join('\n')}

### 2. Component Standardization: ${status.components.success ? '✅ PASS' : '❌ FAIL'}
${status.components.details.map(detail => `- ${detail}`).join('\n')}

### 3. Import Patterns: ${status.imports.success ? '✅ PASS' : '❌ FAIL'}
${status.imports.details.map(detail => `- ${detail}`).join('\n')}

### 4. Server/Client Boundaries: ${status.serverClient.success ? '✅ PASS' : '❌ FAIL'}
${status.serverClient.details.map(detail => `- ${detail}`).join('\n')}

## Overall Validation: ${overallSuccess ? '✅ PASS' : '❌ FAIL'}
**Score:** ${successCount}/4 checks passed

${overallSuccess 
  ? '🎉 All fixes have been successfully applied! The application should now be free from webpack and hydration errors.'
  : '⚠️ Some issues remain. Please address the failed checks above before proceeding.'}

## Next Steps
1. Start the development server: \`npm run dev:clean\`
2. Test all major functionality
3. Deploy the application: \`npm run build:clean\`
`;

  fs.writeFileSync(path.join(projectRoot, 'FIX-VALIDATION-REPORT.md'), reportContent);
  console.log(`Validation report saved to ${colors.cyan}FIX-VALIDATION-REPORT.md${colors.reset}`);
  
  // Update package.json with validation script
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts['validate:fixes']) {
      packageJson.scripts['validate:fixes'] = 'node validate-fixes.js';
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`${colors.green}Added validation script to package.json${colors.reset}`);
    }
  } catch (error) {
    console.error(`${colors.red}Error updating package.json:${colors.reset}`, error.message);
  }
  
  console.log(`${colors.cyan}${colors.bright}=========================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}     VALIDATION COMPLETE     ${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}=========================================${colors.reset}\n`);
  
  return overallSuccess;
}

validateFixes().then(success => {
  if (!success) {
    process.exit(1);
  }
});
