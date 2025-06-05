#!/usr/bin/env node

/**
 * Nova Ipê Intelligent Stack Migration Script
 * Migrates from npm to pnpm and optimizes dependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Nova Ipê - Intelligent Stack Migration');
console.log('==========================================\n');

// Step 1: Install pnpm if not exists
console.log('📦 Step 1: Setting up pnpm...');
try {
  execSync('pnpm --version', { stdio: 'ignore' });
  console.log('✅ pnpm already installed');
} catch {
  console.log('⬇️ Installing pnpm globally...');
  execSync('npm install -g pnpm', { stdio: 'inherit' });
  console.log('✅ pnpm installed successfully');
}

// Step 2: Backup current state
console.log('\n🔄 Step 2: Creating backup...');
if (fs.existsSync('package.json')) {
  fs.copyFileSync('package.json', 'package.json.backup');
  console.log('✅ package.json backed up');
}
if (fs.existsSync('package-lock.json')) {
  fs.copyFileSync('package-lock.json', 'package-lock.json.backup');
  console.log('✅ package-lock.json backed up');
}

// Step 3: Clean npm artifacts
console.log('\n🧹 Step 3: Cleaning npm artifacts...');
try {
  if (fs.existsSync('node_modules')) {
    fs.rmSync('node_modules', { recursive: true, force: true });
    console.log('✅ node_modules removed');
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
    console.log('✅ package-lock.json removed');
  }
} catch (error) {
  console.log('⚠️ Some files could not be removed:', error.message);
}

// Step 4: Apply optimized package.json
console.log('\n⚡ Step 4: Applying optimized dependencies...');
if (fs.existsSync('package-optimized.json')) {
  fs.copyFileSync('package-optimized.json', 'package.json');
  console.log('✅ Optimized package.json applied');
  
  // Show the reduction
  const backup = JSON.parse(fs.readFileSync('package.json.backup', 'utf8'));
  const optimized = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const oldDeps = Object.keys(backup.dependencies || {}).length + Object.keys(backup.devDependencies || {}).length;
  const newDeps = Object.keys(optimized.dependencies || {}).length + Object.keys(optimized.devDependencies || {}).length;
  
  console.log(`📊 Dependencies reduced: ${oldDeps} → ${newDeps} (-${Math.round((1 - newDeps/oldDeps) * 100)}%)`);
} else {
  console.log('⚠️ package-optimized.json not found, skipping optimization');
}

// Step 5: Install with pnpm
console.log('\n📦 Step 5: Installing dependencies with pnpm...');
const startTime = Date.now();
try {
  execSync('pnpm install', { stdio: 'inherit' });
  const duration = Math.round((Date.now() - startTime) / 1000);
  console.log(`✅ Dependencies installed in ${duration}s`);
} catch (error) {
  console.log('❌ Installation failed:', error.message);
  process.exit(1);
}

// Step 6: Apply optimized Next.js config
console.log('\n⚙️ Step 6: Applying optimized Next.js config...');
if (fs.existsSync('next-optimized.config.js')) {
  if (fs.existsSync('next.config.js')) {
    fs.copyFileSync('next.config.js', 'next.config.js.backup');
  }
  fs.copyFileSync('next-optimized.config.js', 'next.config.js');
  console.log('✅ Optimized Next.js config applied');
} else {
  console.log('⚠️ next-optimized.config.js not found, skipping config optimization');
}

// Step 7: Test the setup
console.log('\n🧪 Step 7: Testing the optimized setup...');
try {
  console.log('Running type check...');
  execSync('pnpm typecheck', { stdio: 'inherit' });
  console.log('✅ TypeScript check passed');
} catch (error) {
  console.log('⚠️ TypeScript issues found, but continuing...');
}

console.log('\n🎉 Migration completed successfully!');
console.log('\nNext steps:');
console.log('1. Run: pnpm dev');
console.log('2. Test all functionality');
console.log('3. Monitor performance improvements');
console.log('\nRollback: copy package.json.backup to package.json and run npm install');
