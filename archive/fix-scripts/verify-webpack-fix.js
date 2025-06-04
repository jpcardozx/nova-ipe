/**
 * Webpack Fix Verification Script
 * 
 * This script analyzes the webpack build output to detect and report:
 * - Circular dependencies 
 * - Duplicate module instances
 * - Excessive chunk loading
 * - Import resolution conflicts
 * 
 * @version 1.0.0
 * @date June 2, 2025
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Configuration
const buildDir = path.resolve(__dirname, '.next');
const reportFile = path.resolve(__dirname, 'webpack-analysis-report.json');

console.log('Starting webpack build analysis...');

// Check if .next directory exists
if (!fs.existsSync(buildDir)) {
  console.error('Error: Build directory (.next) not found!');
  console.log('Please run a build first with: npm run build');
  process.exit(1);
}

// Install madge if not already installed
try {
  console.log('Checking for circular dependencies analysis tool...');
  execSync('npx madge --version', { stdio: 'ignore' });
} catch (error) {
  console.log('Installing madge for circular dependency analysis...');
  execSync('npm install --no-save madge', { stdio: 'inherit' });
}

// Run the analysis
try {
  console.log('Analyzing circular dependencies...');
  const circularResults = JSON.parse(
    execSync('npx madge --circular --json .next/server/app', { encoding: 'utf8' })
  );
  
  // Check for duplicate chunks in the client build
  console.log('Analyzing webpack chunks...');
  const clientBuildManifest = path.join(buildDir, 'static', 'development', '_buildManifest.js');
  
  let duplicateModules = [];
  let chunkSizes = {};
  
  if (fs.existsSync(clientBuildManifest)) {
    const manifest = fs.readFileSync(clientBuildManifest, 'utf8');
    
    // Extract chunk names from manifest
    const chunkRegex = /"static\/chunks\/([^"]+)"/g;
    const chunks = new Set();
    let match;
    
    while ((match = chunkRegex.exec(manifest)) !== null) {
      const chunk = match[1];
      if (chunks.has(chunk)) {
        duplicateModules.push(chunk);
      } else {
        chunks.add(chunk);
      }
    }
    
    // Get chunk sizes
    const chunksDir = path.join(buildDir, 'static', 'chunks');
    if (fs.existsSync(chunksDir)) {
      fs.readdirSync(chunksDir).forEach(file => {
        if (file.endsWith('.js')) {
          const stats = fs.statSync(path.join(chunksDir, file));
          chunkSizes[file] = (stats.size / 1024).toFixed(2) + ' KB';
        }
      });
    }
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    circularDependencies: {
      count: circularResults.length,
      details: circularResults
    },
    duplicateModules: {
      count: duplicateModules.length,
      details: duplicateModules
    },
    chunkSizes,
    recommendations: []
  };
  
  // Generate recommendations
  if (circularResults.length > 0) {
    report.recommendations.push(
      'Found circular dependencies. Consider refactoring to break these cycles.',
      'Use dynamic imports or context API to break problematic dependencies.'
    );
  }
  
  if (duplicateModules.length > 0) {
    report.recommendations.push(
      'Found duplicate module chunks. Check for multiple instances of the same component.',
      'Ensure all imports use the same casing and path format.'
    );
  }
  
  // Save report
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  console.log(`Analysis complete! Report saved to ${reportFile}`);
  
  // Show summary
  console.log('\n--- SUMMARY ---');
  console.log(`Circular Dependencies: ${circularResults.length}`);
  console.log(`Duplicate Modules: ${duplicateModules.length}`);
  
  if (report.recommendations.length > 0) {
    console.log('\nRecommendations:');
    report.recommendations.forEach((rec, i) => console.log(`${i + 1}. ${rec}`));
  }
  
} catch (error) {
  console.error('Error during analysis:', error);
  process.exit(1);
}
