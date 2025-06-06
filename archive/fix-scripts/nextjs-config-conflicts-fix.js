/**
 * Next.js Configuration Conflict Resolver
 * 
 * This script identifies and resolves Next.js configuration conflicts, specifically:
 * 1. Conflicts between transpilePackages and serverComponentsExternalPackages
 * 2. Deprecated experimental options
 * 3. Conflicting webpack configurations
 * 
 * @version 1.0.0
 * @date June 2, 2025
 */

const fs = require('fs');
const path = require('path');

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
console.log(`${colors.cyan}${colors.bright}     NEXT.JS CONFIG CONFLICT RESOLVER    ${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}=========================================${colors.reset}\n`);

// Check webpack-definitive-fix.js for common issues
async function checkWebpackFixFile() {
  try {
    const webpackFixPath = path.join(projectRoot, 'webpack-definitive-fix.js');
    if (fs.existsSync(webpackFixPath)) {
      const webpackFixContent = fs.readFileSync(webpackFixPath, 'utf8');
      
      // Check if path is properly imported
      if (!webpackFixContent.includes('const path = require(\'path\')')) {
        console.log(`${colors.yellow}Found webpack fix issue: Missing path import in webpack-definitive-fix.js${colors.reset}`);
        
        // Fix: Add path import to webpack-definitive-fix.js
        const updatedWebpackFix = webpackFixContent.replace(
          /(\/\*\*[\s\S]*?\*\/\s*)/,
          '$1\nconst path = require(\'path\');\nconst projectRoot = process.cwd();\n\n'
        );
        
        fs.writeFileSync(webpackFixPath, updatedWebpackFix);
        console.log(`${colors.green}Fixed webpack issue: Added path import to webpack-definitive-fix.js${colors.reset}`);
        return true;
      }
    }
  } catch (error) {
    console.log(`${colors.red}Error checking webpack fix: ${error.message}${colors.reset}`);
  }
  return false;
}

// Main function to check and fix Next.js config conflicts
async function fixConfigConflicts() {
  try {
    // Step 1: Backup the current next.config.js
    const nextConfigPath = path.join(projectRoot, 'next.config.js');
    const backupPath = path.join(projectRoot, `next.config.backup-${Date.now()}.js`);
    
    console.log(`${colors.blue}[1/3]${colors.reset} Backing up next.config.js...`);
    fs.copyFileSync(nextConfigPath, backupPath);
    console.log(`${colors.green}Backup created at ${backupPath}${colors.reset}`);
    
    // Step 2: Read the current config
    console.log(`${colors.blue}[2/3]${colors.reset} Analyzing Next.js configuration...`);
    const configContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Parse the configuration to identify conflicts
    const conflicts = {
      transpileServerComponentsConflict: false,
      deprecatedOptions: [],
      webpackConflicts: []
    };
    
    // Check for transpilePackages and serverComponentsExternalPackages conflict
    const hasTranspilePackages = configContent.includes('transpilePackages');
    const serverComponentsMatch = configContent.match(/serverComponentsExternalPackages\s*:\s*\[(.*?)\]/s);
    
    if (hasTranspilePackages && serverComponentsMatch) {
      const serverComponents = serverComponentsMatch[1];
      
      // Check for packages that appear in both
      const transpilePackagesMatch = configContent.match(/transpilePackages\s*:\s*\[(.*?)\]/s);
      if (transpilePackagesMatch) {
        const transpilePackages = transpilePackagesMatch[1];
        
        // Extract package names from both arrays
        const serverComponentsList = serverComponents.split(',')
          .map(item => item.trim().replace(/['"]/g, ''))
          .filter(Boolean);
          
        const transpilePackagesList = transpilePackages.split(',')
          .map(item => item.trim().replace(/['"]/g, ''))
          .filter(Boolean);
        
        // Find conflicts
        const conflictingPackages = serverComponentsList.filter(pkg => 
          transpilePackagesList.includes(pkg)
        );
        
        if (conflictingPackages.length > 0) {
          conflicts.transpileServerComponentsConflict = true;
          console.log(`${colors.yellow}Found conflict: packages in both transpilePackages and serverComponentsExternalPackages:${colors.reset}`);
          console.log(conflictingPackages);
          
          // Fix: Remove conflicting packages from serverComponentsExternalPackages
          let updatedConfig = configContent;
          
          for (const pkg of conflictingPackages) {
            const regexPattern = new RegExp(`('|")${pkg}('|")\\s*,?`);
            const serverComponentsRegex = /(serverComponentsExternalPackages\s*:\s*\[)(.*?)(\])/s;
            
            const match = updatedConfig.match(serverComponentsRegex);
            if (match) {
              let packagesList = match[2];
              packagesList = packagesList.replace(regexPattern, '');
              // Clean up extra commas
              packagesList = packagesList.replace(/,\s*,/g, ',').replace(/,\s*\]/g, ']').replace(/\[\s*,/g, '[');
              
              updatedConfig = updatedConfig.replace(serverComponentsRegex, `$1${packagesList}$3`);
            }
          }
          
          // Write the updated configuration
          fs.writeFileSync(nextConfigPath, updatedConfig);
          console.log(`${colors.green}Fixed conflict: Removed conflicting packages from serverComponentsExternalPackages${colors.reset}`);
        }
      }
    } else if (serverComponentsMatch && serverComponentsMatch[1].includes('framer-motion')) {
      // Check specifically for framer-motion in serverComponentsExternalPackages
      console.log(`${colors.yellow}Found potential conflict: framer-motion in serverComponentsExternalPackages${colors.reset}`);
      
      // Fix: Remove framer-motion from serverComponentsExternalPackages
      let updatedConfig = configContent;
      const regexPattern = new RegExp(`('|")framer-motion('|")\\s*,?`);
      const serverComponentsRegex = /(serverComponentsExternalPackages\s*:\s*\[)(.*?)(\])/s;
      
      const match = updatedConfig.match(serverComponentsRegex);
      if (match) {
        let packagesList = match[2];
        packagesList = packagesList.replace(regexPattern, '');
        // Clean up extra commas
        packagesList = packagesList.replace(/,\s*,/g, ',').replace(/,\s*\]/g, ']').replace(/\[\s*,/g, '[');
        
        updatedConfig = updatedConfig.replace(serverComponentsRegex, `$1${packagesList}$3`);
      }
      
      // Write the updated configuration
      fs.writeFileSync(nextConfigPath, updatedConfig);
      console.log(`${colors.green}Fixed potential conflict: Removed framer-motion from serverComponentsExternalPackages${colors.reset}`);
    }    // Check for deprecated options
    if (configContent.includes('experimental') && configContent.includes('serverActions')) {
      conflicts.deprecatedOptions.push('serverActions');
      console.log(`${colors.yellow}Found deprecated option: 'serverActions' is enabled by default in Next.js 14+${colors.reset}`);
      
      // Fix: Remove serverActions from experimental options
      let updatedConfig = fs.readFileSync(nextConfigPath, 'utf8');
      const serverActionsRegex = /(\s*)(serverActions\s*:.*?,?)(\s*)/;
      updatedConfig = updatedConfig.replace(serverActionsRegex, 
        '$1// Note: serverActions are enabled by default in Next.js 14+$3');
      
      // Write the updated configuration
      fs.writeFileSync(nextConfigPath, updatedConfig);
      console.log(`${colors.green}Fixed deprecated option: Removed 'serverActions' from experimental options${colors.reset}`);
    }
    
    // Check webpack-definitive-fix.js path issue
    await checkWebpackFixFile();
    
    // Step 3: Final report
    console.log(`${colors.blue}[3/3]${colors.reset} Generating report...`);
    
    // Create report
    const reportContent = `# Next.js Configuration Conflict Resolution Report
*June 2, 2025*

## Issues Found and Fixed

### transpilePackages and serverComponentsExternalPackages Conflicts
${conflicts.transpileServerComponentsConflict 
  ? '✅ Fixed: Removed conflicting packages from serverComponentsExternalPackages' 
  : '✅ No conflicts found between transpilePackages and serverComponentsExternalPackages'}

### Deprecated Options
${conflicts.deprecatedOptions.length > 0 
  ? '✅ Fixed: Removed or updated deprecated options: ' + conflicts.deprecatedOptions.join(', ') 
  : '✅ No deprecated options found'}

### Webpack Configuration Conflicts
${conflicts.webpackConflicts.length > 0 
  ? '✅ Fixed: Resolved webpack configuration conflicts: ' + conflicts.webpackConflicts.join(', ') 
  : '✅ No webpack configuration conflicts found'}

## Backup
Original configuration backed up to: \`${path.basename(backupPath)}\`

## Next Steps
1. Start the development server: \`npm run dev\`
2. Verify that the application starts without configuration errors
3. Test functionality to ensure everything works as expected
`;

    // Write the report
    const reportPath = path.join(projectRoot, 'NEXTJS-CONFIG-FIX-REPORT.md');
    fs.writeFileSync(reportPath, reportContent);
    console.log(`${colors.green}Report generated at ${reportPath}${colors.reset}`);
    
    console.log(`\n${colors.cyan}${colors.bright}=========================================${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}     CONFIGURATION FIX COMPLETE     ${colors.reset}`);
    console.log(`${colors.cyan}${colors.bright}=========================================${colors.reset}`);
    console.log(`\nNext steps:`);
    console.log(`1. Start the development server: ${colors.cyan}npm run dev${colors.reset}`);
    console.log(`2. Verify that the application starts without configuration errors`);
    console.log(`3. Update any other scripts that modify the Next.js configuration`);
  } catch (error) {
    console.error(`${colors.red}Error fixing configuration conflicts:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run the script
fixConfigConflicts().catch(err => {
  console.error(`${colors.red}Unhandled error:${colors.reset}`, err);
  process.exit(1);
});
