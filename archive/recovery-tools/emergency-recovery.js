/**
 * Next.js Emergency Recovery System
 * 
 * This script orchestrates the emergency recovery process to fix
 * critical errors preventing the application from starting.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// Logger
const logger = {
  info: (msg) => console.log(`\x1b[34m[INFO] ${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS] ${msg}\x1b[0m`),
  warning: (msg) => console.log(`\x1b[33m[WARNING] ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m[ERROR] ${msg}\x1b[0m`),
  section: (title) => console.log(`\n\x1b[36m=== ${title} ===\x1b[0m\n`),
};

// Configuration
const RECOVERY_DIR = path.join(process.cwd(), 'recovery-tools');
const BACKUP_DIR = path.join(process.cwd(), 'recovery-backups', `backup-${new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-')}`);
const PACKAGE_JSON = path.join(process.cwd(), 'package.json');
const NEXT_CONFIG = path.join(process.cwd(), 'next.config.js');

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    logger.info(`Created backup directory: ${BACKUP_DIR}`);
  }
}

// Create a backup of a file
function backupFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, fileName);
  
  try {
    fs.copyFileSync(filePath, backupPath);
    logger.info(`Backed up ${filePath} to ${backupPath}`);
    return backupPath;
  } catch (err) {
    logger.error(`Failed to back up ${filePath}: ${err.message}`);
    return null;
  }
}

// Run a script with error handling
async function runScript(scriptPath) {
  const relativePath = path.relative(process.cwd(), scriptPath);
  logger.info(`Running script: ${relativePath}`);
  
  try {
    const { stdout, stderr } = await exec(`node "${scriptPath}"`);
    
    if (stdout) {
      console.log(stdout);
    }
    
    if (stderr) {
      logger.warning(`Script produced stderr output:`);
      console.error(stderr);
    }
    
    logger.success(`Successfully ran: ${relativePath}`);
    return true;
  } catch (err) {
    logger.error(`Error running script ${relativePath}: ${err.message}`);
    
    if (err.stdout) {
      console.log(err.stdout);
    }
    
    if (err.stderr) {
      console.error(err.stderr);
    }
    
    return false;
  }
}

// Clean the .next directory
function cleanNextDirectory() {
  const nextDir = path.join(process.cwd(), '.next');
  
  if (fs.existsSync(nextDir)) {
    try {
      fs.rmSync(nextDir, { recursive: true, force: true });
      logger.success('Cleaned .next directory');
      return true;
    } catch (err) {
      logger.error(`Failed to clean .next directory: ${err.message}`);
      return false;
    }
  }
  
  logger.info('.next directory did not exist, no cleanup needed');
  return true;
}

// Fix package.json to remove problematic scripts
function fixPackageJson() {
  if (!fs.existsSync(PACKAGE_JSON)) {
    logger.error('package.json not found!');
    return false;
  }
  
  try {
    const packageJsonContent = fs.readFileSync(PACKAGE_JSON, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Backup original scripts
    const originalScripts = { ...packageJson.scripts };
    
    // Remove problematic patch scripts
    if (packageJson.scripts) {
      let modified = false;
      
      if (packageJson.scripts.predev && packageJson.scripts.predev.includes('patch')) {
        delete packageJson.scripts.predev;
        modified = true;
      }
      
      if (packageJson.scripts.prebuild && packageJson.scripts.prebuild.includes('patch')) {
        delete packageJson.scripts.prebuild;
        modified = true;
      }
      
      // Add useful scripts
      if (!packageJson.scripts.clean) {
        packageJson.scripts.clean = 'rimraf .next';
        modified = true;
      }
      
      if (!packageJson.scripts['dev:clean']) {
        packageJson.scripts['dev:clean'] = 'npm run clean && npm run dev';
        modified = true;
      }
      
      if (!packageJson.scripts['emergency-recovery']) {
        packageJson.scripts['emergency-recovery'] = 'node recovery-tools/emergency-recovery.js';
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(PACKAGE_JSON, JSON.stringify(packageJson, null, 2), 'utf8');
        logger.success('Updated package.json to remove problematic patch scripts');
      } else {
        logger.info('No problematic scripts found in package.json');
      }
    }
    
    return true;
  } catch (err) {
    logger.error(`Failed to fix package.json: ${err.message}`);
    return false;
  }
}

// Main recovery process
async function runEmergencyRecovery() {
  logger.section('NEXT.JS EMERGENCY RECOVERY SYSTEM');
  logger.info('Starting emergency recovery...');
  
  // Step 1: Preparation
  ensureDirectories();
  backupFile(PACKAGE_JSON);
  backupFile(NEXT_CONFIG);
  
  // Step 2: Fix package.json
  logger.section('FIXING PACKAGE.JSON');
  fixPackageJson();
  
  // Step 3: Clean .next directory
  logger.section('CLEANING BUILD ARTIFACTS');
  cleanNextDirectory();
  
  // Step 4: Fix React DOM syntax error
  logger.section('FIXING REACT DOM SYNTAX ERROR');
  const reactDomFixed = await runScript(path.join(RECOVERY_DIR, 'fix-react-dom-emergency.js'));
  
  // Step 5: Fix URL parser
  logger.section('FIXING URL PARSER');
  const urlParserFixed = await runScript(path.join(RECOVERY_DIR, 'fix-url-parser-emergency.js'));
  
  // Step 6: Fix build system
  logger.section('FIXING BUILD SYSTEM');
  const buildSystemFixed = await runScript(path.join(RECOVERY_DIR, 'fix-build-system-emergency.js'));
  
  // Step 7: Final verification
  logger.section('FINAL VERIFICATION');
  
  // Count successes
  const successCount = [reactDomFixed, urlParserFixed, buildSystemFixed].filter(Boolean).length;
  
  if (successCount === 3) {
    logger.success('All emergency fixes were applied successfully!');
  } else {
    logger.warning(`Only ${successCount} out of 3 fixes were successfully applied.`);
  }
  
  logger.info('\nNext steps:');
  logger.info('1. Run "npm run dev" to start the development server');
  logger.info('2. If you still encounter issues, try "npm run clean && npm install" to reinstall dependencies');
  logger.info('3. For persistent issues, check the recovery-logs directory');
}

// Execute recovery
runEmergencyRecovery().catch(err => {
  logger.error(`Unhandled error during recovery: ${err.message}`);
  logger.error(err.stack);
});
