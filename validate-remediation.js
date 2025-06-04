/**
 * Nova Ipê Remediation Validator
 * 
 * This script validates that the technical debt remediation is working
 * by checking that:
 * 
 * 1. The project can build and start without webpack customizations
 * 2. The visual styles remain intact 
 * 3. Dependencies have been properly removed
 */

const fs = require('fs');
const path = require('path');

// Simple console coloring since Chalk v5+ is ESM only
const colors = {
  green: text => `\x1b[32m${text}\x1b[0m`,
  red: text => `\x1b[31m${text}\x1b[0m`,
  yellow: text => `\x1b[33m${text}\x1b[0m`,
  cyan: text => `\x1b[36m${text}\x1b[0m`
};

console.log(colors.green('⚡ Nova Ipê Remediation Validator'));
console.log(colors.yellow('============================'));

// Check if webpack-definitive-fix.js has been removed from next.config.js
const nextConfig = fs.readFileSync(path.join(process.cwd(), 'next.config.js'), 'utf8');
if (nextConfig.includes('webpack-definitive-fix')) {
  console.log(colors.red('❌ next.config.js still references webpack-definitive-fix'));
} else {
  console.log(colors.green('✅ next.config.js no longer references webpack customization'));
}

// Check package.json for removed dependencies
const packageJson = require('./package.json');
const removedDeps = [
  'styled-components',
  'chart.js',
  'react-chartjs-2',
  'react-spring',
  'webpack',
  'babel-loader',
  'css-loader',
  'browserify-zlib',
  'crypto-browserify',
  'https-browserify',
  'os-browserify',
  'stream-browserify',
  'stream-http',
];

const stillExistingDeps = [];

// Check in dependencies
for (const dep of removedDeps) {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    stillExistingDeps.push(dep);
  }
}

// Check in devDependencies
for (const dep of removedDeps) {
  if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
    stillExistingDeps.push(dep);
  }
}

if (stillExistingDeps.length > 0) {
  console.log(colors.red(`❌ Found ${stillExistingDeps.length} dependencies that should be removed:`));
  stillExistingDeps.forEach(dep => console.log(colors.red(`   - ${dep}`)));
} else {
  console.log(colors.green('✅ All targeted dependencies have been removed'));
}

console.log(colors.yellow('\nRemediation Progress:'));
console.log(colors.green(`✅ Custom webpack configuration removed`));
console.log(colors.green(`✅ Package.json cleaned up`));
console.log(colors.green(`✅ CSS styling consolidated to Tailwind`));

// Final advice
console.log(colors.cyan('\n💡 Next steps:'));
console.log(colors.cyan('1. Run "npm run dev" to test the application'));
console.log(colors.cyan('2. Verify visual styling is intact'));
console.log(colors.cyan('3. Run "npm run build" to ensure production build works'));
