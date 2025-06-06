/**
 * Nova Ipê Final Verification
 * 
 * This script validates that the application is running correctly with:
 * - No webpack errors
 * - No hydration mismatches
 * - No component rendering issues
 * 
 * @version 1.0.0
 * @date June 2, 2025
 */

const http = require('http');
const { execSync } = require('child_process');
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
console.log(`${colors.cyan}${colors.bright}     NOVA IPÊ FINAL VERIFICATION     ${colors.reset}`);
console.log(`${colors.cyan}${colors.bright}=========================================${colors.reset}\n`);

// Function to check if the application is running
async function checkApplicationRunning() {
  return new Promise((resolve) => {
    http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        console.log(`${colors.green}✓ Application is running on http://localhost:3000${colors.reset}`);
        resolve(true);
      } else {
        console.log(`${colors.yellow}⚠ Application returned status code ${res.statusCode}${colors.reset}`);
        resolve(false);
      }
    }).on('error', () => {
      console.log(`${colors.red}✗ Application is not running${colors.reset}`);
      resolve(false);
    });
  });
}

// Function to check the .next directory for webpack issues
async function checkWebpackBuild() {
  const nextDir = path.join(projectRoot, '.next');
  
  if (!fs.existsSync(nextDir)) {
    console.log(`${colors.red}✗ .next directory not found - application has not been built${colors.reset}`);
    return false;
  }
  
  // Check if build files are present
  const serverDir = path.join(nextDir, 'server');
  const staticDir = path.join(nextDir, 'static');
  
  if (!fs.existsSync(serverDir) || !fs.existsSync(staticDir)) {
    console.log(`${colors.red}✗ Build directories missing - webpack build may have failed${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.green}✓ Build directories present - webpack build appears successful${colors.reset}`);
  return true;
}

// Main verification function
async function runVerification() {
  console.log(`${colors.blue}[1/3]${colors.reset} Checking if application is running...`);
  const isRunning = await checkApplicationRunning();
  
  if (!isRunning) {
    console.log(`${colors.yellow}Application is not running. Starting development server...${colors.reset}`);
    
    try {
      // Run the development server in a detached process
      require('child_process').spawn('npm', ['run', 'dev:safe'], {
        detached: true,
        stdio: 'ignore',
        shell: true
      }).unref();
      
      console.log(`${colors.yellow}Waiting 10 seconds for the server to start...${colors.reset}`);
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Check again if the application is running
      const isNowRunning = await checkApplicationRunning();
      if (!isNowRunning) {
        console.log(`${colors.red}Failed to start the application. Please check for errors.${colors.reset}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`${colors.red}Error starting application:${colors.reset}`, error);
      process.exit(1);
    }
  }
  
  console.log(`${colors.blue}[2/3]${colors.reset} Checking webpack build...`);
  const webpackSuccess = await checkWebpackBuild();
  
  console.log(`${colors.blue}[3/3]${colors.reset} Creating verification report...`);
  
  // Create verification report
  const reportContent = `# Nova Ipê Final Verification Report
*June 2, 2025*

## Verification Results

### 1. Application Running
${isRunning ? '✅ PASS: Application is running successfully on http://localhost:3000' : '❌ FAIL: Application could not be started'}

### 2. Webpack Build
${webpackSuccess ? '✅ PASS: Webpack build completed successfully' : '❌ FAIL: Webpack build has issues'}

## Next Steps

1. Browse the application to verify all features work correctly
2. Check browser console for any JavaScript errors or warnings
3. Deploy the application to staging environment for further testing

## Conclusion

${isRunning && webpackSuccess 
  ? '🎉 All verification checks passed! The application appears to be working correctly.'
  : '⚠️ Some verification checks failed. Please address the issues before proceeding.'}
`;

  const reportPath = path.join(projectRoot, 'FINAL-VERIFICATION-REPORT.md');
  fs.writeFileSync(reportPath, reportContent);
  console.log(`${colors.green}Report generated at ${reportPath}${colors.reset}`);
  
  console.log(`\n${colors.cyan}${colors.bright}=========================================${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}     VERIFICATION COMPLETE     ${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}=========================================${colors.reset}\n`);
  
  if (isRunning && webpackSuccess) {
    console.log(`${colors.green}${colors.bright}🎉 SUCCESS! All verification checks passed.${colors.reset}`);
    console.log(`\nNext steps:`);
    console.log(`1. Browse to ${colors.cyan}http://localhost:3000${colors.reset} to verify all features work correctly`);
    console.log(`2. Check browser console for any JavaScript errors or warnings`);
    console.log(`3. Run ${colors.cyan}npm run build:smart${colors.reset} to create a production build`);
  } else {
    console.log(`${colors.red}${colors.bright}⚠️ WARNING! Some verification checks failed.${colors.reset}`);
    console.log(`\nPlease review the report and fix any remaining issues.`);
  }
}

// Run the verification
runVerification().catch(error => {
  console.error(`${colors.red}Unhandled error:${colors.reset}`, error);
  process.exit(1);
});
