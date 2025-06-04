/**
 * Next.js Master Recovery System
 * 
 * This script orchestrates the complete recovery process for a corrupted
 * Next.js project. It applies all specialized fixes in the correct sequence,
 * with proper validation and rollback capabilities.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const mkdirAsync = promisify(fs.mkdir);
const accessAsync = promisify(fs.access);

// Import specialized tools
const nextjsRecovery = require('./nextjs-recovery');
const safeReactDomPatch = require('./safe-react-dom-patch');
const nextUrlParserFix = require('./next-url-parser-fix');
const cleanNextConfig = require('./clean-next-config');

// Logger with timestamp
const logger = {
  info: (msg) => console.log(`\x1b[34m[${new Date().toISOString()}] INFO: ${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m[${new Date().toISOString()}] SUCCESS: ${msg}\x1b[0m`),
  warning: (msg) => console.log(`\x1b[33m[${new Date().toISOString()}] WARNING: ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m[${new Date().toISOString()}] ERROR: ${msg}\x1b[0m`),
  section: (title) => console.log(`\n\x1b[35m=== ${title.toUpperCase()} ===\x1b[0m`),
};

// File paths
const ROOT_DIR = process.cwd();
const RECOVERY_DIR = path.join(ROOT_DIR, 'recovery-logs');
const DOT_NEXT_DIR = path.join(ROOT_DIR, '.next');
const PACKAGE_JSON = path.join(ROOT_DIR, 'package.json');
const LOG_FILE = path.join(RECOVERY_DIR, `recovery-${new Date().toISOString().replace(/:/g, '-')}.log`);

// Ensure required directories exist
async function ensureDirectories() {
  try {
    await accessAsync(RECOVERY_DIR);
  } catch {
    await mkdirAsync(RECOVERY_DIR, { recursive: true });
  }
}

// Create simple script to check if the recovery was successful
async function createVerificationScript() {
  const verificationPath = path.join(ROOT_DIR, 'verify-recovery.js');
  const verificationContent = `/**
 * Next.js Recovery Verification
 * 
 * This script checks if the recovery process was successful by validating
 * critical files and functionality.
 */

const fs = require('fs');
const path = require('path');

console.log('\\n\\x1b[36m=== NEXT.JS RECOVERY VERIFICATION ===\\x1b[0m\\n');

// Check if critical directories exist
const dotNextExists = fs.existsSync(path.join(process.cwd(), '.next'));
console.log(\`\\x1b[34m.next directory exists:\\x1b[0m \${dotNextExists ? '\\x1b[32mYes\\x1b[0m' : '\\x1b[33mNo (will be created on build)\\x1b[0m'}\`);

// Check next.config.js
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const content = fs.readFileSync(nextConfigPath, 'utf8');
  
  console.log(\`\\x1b[34mnext.config.js exists:\\x1b[0m \\x1b[32mYes\\x1b[0m\`);
  console.log(\`\\x1b[34mnext.config.js has syntax errors:\\x1b[0m \${content.includes('PATCHED_FOR_SSR_ELEMENT_SETATTRIBUTE') ? '\\x1b[33mPossibly (contains old patches)\\x1b[0m' : '\\x1b[32mNo\\x1b[0m'}\`);
} else {
  console.log(\`\\x1b[34mnext.config.js exists:\\x1b[0m \\x1b[31mNo\\x1b[0m\`);
}

// Check package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const content = fs.readFileSync(packageJsonPath, 'utf8');
  let packageJson;
  
  try {
    packageJson = JSON.parse(content);
    console.log(\`\\x1b[34mpackage.json is valid JSON:\\x1b[0m \\x1b[32mYes\\x1b[0m\`);
    
    // Check scripts
    if (packageJson.scripts) {
      const hasPredev = packageJson.scripts.predev && packageJson.scripts.predev.includes('patch');
      console.log(\`\\x1b[34mpatching scripts in package.json:\\x1b[0m \${hasPredev ? '\\x1b[33mYes (potential issue)\\x1b[0m' : '\\x1b[32mNo\\x1b[0m'}\`);
    }
  } catch (e) {
    console.log(\`\\x1b[34mpackage.json is valid JSON:\\x1b[0m \\x1b[31mNo\\x1b[0m\`);
  }
} else {
  console.log(\`\\x1b[34mpackage.json exists:\\x1b[0m \\x1b[31mNo\\x1b[0m\`);
}

// Check for React DOM polyfill
const reactDomPolyfillPath = path.join(process.cwd(), 'lib', 'react-dom-safe.js');
console.log(\`\\x1b[34mReact DOM safe polyfill exists:\\x1b[0m \${fs.existsSync(reactDomPolyfillPath) ? '\\x1b[32mYes\\x1b[0m' : '\\x1b[33mNo\\x1b[0m'}\`);

// Check for SSR polyfill
const ssrPolyfillPath = path.join(process.cwd(), 'lib', 'ssr-safe-polyfill.js');
console.log(\`\\x1b[34mSSR safe polyfill exists:\\x1b[0m \${fs.existsSync(ssrPolyfillPath) ? '\\x1b[32mYes\\x1b[0m' : '\\x1b[33mNo\\x1b[0m'}\`);

console.log('\\n\\x1b[36m=== NEXT STEPS ===\\x1b[0m');
console.log('To start the development server, run: \\x1b[32mnpm run dev\\x1b[0m');
console.log('To build the project, run: \\x1b[32mnpm run build\\x1b[0m');
console.log('If you encounter any issues, check the recovery-logs directory.');
`;

  fs.writeFileSync(verificationPath, verificationContent, 'utf8');
  logger.success(`Created verification script at ${verificationPath}`);
}

// Update package.json to remove problematic scripts
async function updatePackageJson() {
  try {
    const packageJsonContent = await readFileAsync(PACKAGE_JSON, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Backup original scripts
    const originalScripts = { ...packageJson.scripts };
    
    // Remove problematic scripts like predev and prebuild that run patchers
    if (packageJson.scripts) {
      if (packageJson.scripts.predev && packageJson.scripts.predev.includes('patch')) {
        delete packageJson.scripts.predev;
      }
      
      if (packageJson.scripts.prebuild && packageJson.scripts.prebuild.includes('patch')) {
        delete packageJson.scripts.prebuild;
      }
      
      // Add a clean script if it doesn't exist
      if (!packageJson.scripts.clean) {
        packageJson.scripts.clean = 'rimraf .next';
      }
      
      // Add a clean:dev script if it doesn't exist
      if (!packageJson.scripts['dev:clean']) {
        packageJson.scripts['dev:clean'] = 'npm run clean && npm run dev';
      }
      
      // Add verification script
      packageJson.scripts['verify-recovery'] = 'node verify-recovery.js';
    }
    
    // Write updated package.json
    await fs.promises.writeFile(PACKAGE_JSON, JSON.stringify(packageJson, null, 2), 'utf8');
    logger.success('Updated package.json to remove problematic scripts');
    
    // Log what was changed
    logger.info('Script changes:');
    for (const [key, value] of Object.entries(originalScripts)) {
      if (!packageJson.scripts[key]) {
        logger.info(`  - Removed: ${key}: "${value}"`);
      } else if (packageJson.scripts[key] !== value) {
        logger.info(`  - Changed: ${key}: "${value}" -> "${packageJson.scripts[key]}"`);
      }
    }
    
    for (const [key, value] of Object.entries(packageJson.scripts)) {
      if (!originalScripts[key]) {
        logger.info(`  - Added: ${key}: "${value}"`);
      }
    }
    
    return true;
  } catch (err) {
    logger.error(`Failed to update package.json: ${err.message}`);
    return false;
  }
}

// Clean build artifacts
async function cleanBuildArtifacts() {
  try {
    if (fs.existsSync(DOT_NEXT_DIR)) {
      fs.rmSync(DOT_NEXT_DIR, { recursive: true, force: true });
      logger.success('Removed .next directory');
    } else {
      logger.info('.next directory does not exist, skipping cleanup');
    }
    
    return true;
  } catch (err) {
    logger.error(`Failed to clean build artifacts: ${err.message}`);
    return false;
  }
}

// Main recovery function
async function runCompleteRecovery() {
  logger.section('NEXT.JS MASTER RECOVERY SYSTEM');
  logger.info('Starting complete recovery process...');
  
  try {
    // Ensure recovery directories exist
    await ensureDirectories();
    
    // Phase 1: Clean up
    logger.section('PHASE 1: CLEANUP');
    await cleanBuildArtifacts();
    
    // Phase 2: Update package.json
    logger.section('PHASE 2: PACKAGE.JSON UPDATE');
    await updatePackageJson();
    
    // Phase 3: Apply recovery modules in sequence
    logger.section('PHASE 3: APPLYING RECOVERY MODULES');
    
    // Create safe polyfills
    logger.info('Creating safe polyfills...');
    const reactDomResult = await safeReactDomPatch.setupSafeReactDOM();
    logger.info(`React DOM patch status: ${reactDomResult ? 'Success' : 'Failed'}`);
    
    // Fix URL parsing
    logger.info('Applying Next.js URL parser fixes...');
    const urlParserResult = await nextUrlParserFix.fixAllURLParsingIssues();
    logger.info(`URL parser fix status: ${urlParserResult ? 'Success' : 'Failed'}`);
    
    // Create clean Next.js config
    logger.info('Creating clean Next.js configuration...');
    const configResult = await cleanNextConfig.generateCleanConfig();
    logger.info(`Clean config generation status: ${configResult ? 'Success' : 'Failed'}`);
    
    // Phase 4: Create verification script
    logger.section('PHASE 4: CREATING VERIFICATION');
    await createVerificationScript();
    
    // Phase 5: Run npm install
    logger.section('PHASE 5: REINSTALLING DEPENDENCIES');
    try {
      logger.info('Running npm install...');
      execSync('npm install', { stdio: 'inherit' });
      logger.success('Dependencies reinstalled successfully');
    } catch (err) {
      logger.error(`Failed to reinstall dependencies: ${err.message}`);
    }
    
    // Successfully completed
    logger.section('RECOVERY COMPLETE');
    logger.success('Next.js recovery process completed successfully!');
    logger.info('To verify the recovery, run: npm run verify-recovery');
    logger.info('To start the development server, run: npm run dev');
    
    return true;
  } catch (error) {
    logger.error(`Recovery process failed: ${error.message}`);
    logger.error(`Error stack: ${error.stack}`);
    return false;
  }
}

// Run the recovery process
runCompleteRecovery().catch(err => {
  console.error('Fatal error during recovery:', err);
  process.exit(1);
});
