/**
 * This script updates the vercel.json configuration to use our enhanced build script
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Updating Vercel deployment configuration...');

// Path to vercel.json
const vercelJsonPath = path.join(process.cwd(), 'vercel.json');

// Check if vercel.json exists
let config = {};
if (fs.existsSync(vercelJsonPath)) {
  try {
    config = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
    console.log('✅ Found existing vercel.json configuration');
  } catch (error) {
    console.error('❌ Error reading vercel.json:', error.message);
  }
} else {
  console.log('⚠️ No vercel.json found, creating a new one');
}

// Update the build command
config.buildCommand = 'node scripts/enhanced-vercel-build.js';

// Add other important settings
if (!config.framework) {
  config.framework = 'nextjs';
}

// Ensure we have install command set properly
if (!config.installCommand) {
  config.installCommand = 'npm install --force';
}

// Add build environment variables
if (!config.build) {
  config.build = {};
}

if (!config.build.env) {
  config.build.env = {};
}

// Set specific environment variables to help with the build
config.build.env.NEXT_TELEMETRY_DISABLED = '1';
config.build.env.SKIP_INSTALL_DEPS = '1'; // Skip any automatic dependency installation
config.build.env.NEXT_SHARP_PATH = '/tmp/node_modules/sharp';

// Write the updated config
try {
  fs.writeFileSync(vercelJsonPath, JSON.stringify(config, null, 2));
  console.log('✅ Updated vercel.json configuration');
} catch (error) {
  console.error('❌ Error writing vercel.json:', error.message);
}
