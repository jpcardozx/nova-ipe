/**
 * VERIFY-DEFINITIVE-FIX.js
 * 
 * This script verifies that the comprehensive fix for Next.js hydration and webpack issues
 * has been correctly implemented and applied to the project.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk').default || require('chalk');

console.log(chalk.blue.bold('🔍 Verifying definitive Next.js hydration and webpack fix implementation\n'));

// Check required files
const requiredFiles = [
  { path: 'nextjs-hydration-webpack-fix.js', description: 'Comprehensive fix module' },
  { path: 'app/error.tsx', description: 'Error component with simplified implementation' },
  { path: 'next.config.js', description: 'Next.js configuration with fix applied' }
];

let allGood = true;
for (const file of requiredFiles) {
  const filePath = path.resolve(__dirname, file.path);
  
  if (!fs.existsSync(filePath)) {
    allGood = false;
    console.error(chalk.red(`❌ Missing ${file.description}: ${file.path}`));
  } else {
    console.log(chalk.green(`✅ Found ${file.description}: ${file.path}`));
    
    // Additional checks for file content
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (file.path === 'next.config.js') {
      if (!content.includes('nextjs-hydration-webpack-fix')) {
        allGood = false;
        console.error(chalk.red(`❌ next.config.js is not properly configured to use the definitive fix`));
      } else {
        console.log(chalk.green(`✅ next.config.js is properly configured`));
      }
    }
    
    if (file.path === 'app/error.tsx') {
      if (content.includes('useTheme') || content.includes('useState(')) {
        allGood = false;
        console.error(chalk.red(`❌ error.tsx still contains problematic code (useTheme or complex state)`));
      } else {
        console.log(chalk.green(`✅ error.tsx has been properly simplified`));
      }
    }
  }
}

// Check package.json scripts
const packageJsonPath = path.resolve(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  if (!packageJson.scripts.dev.includes('nextjs-hydration-webpack-fix.js')) {
    allGood = false;
    console.error(chalk.red(`❌ package.json dev script does not use the definitive fix`));
  } else {
    console.log(chalk.green(`✅ package.json dev script is properly configured`));
  }
  
  if (!packageJson.scripts.build.includes('nextjs-hydration-webpack-fix.js')) {
    allGood = false;
    console.error(chalk.red(`❌ package.json build script does not use the definitive fix`));
  } else {
    console.log(chalk.green(`✅ package.json build script is properly configured`));
  }
}

console.log('');
if (allGood) {
  console.log(chalk.green.bold('✅ All checks passed! The definitive fix has been properly implemented.'));
  console.log(chalk.blue('\nYou can now run the application with:'));
  console.log(chalk.cyan('npm run dev:clean'));
} else {
  console.log(chalk.red.bold('❌ Some checks failed. Please address the issues above.'));
}

console.log(chalk.blue('\nIf you encounter any issues, check the documentation in RESOLUCAO-PROBLEMAS-MAIO-2025.md'));
