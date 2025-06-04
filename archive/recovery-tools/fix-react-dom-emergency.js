/**
 * React DOM Emergency Fix
 * 
 * This script fixes the syntax error in react-dom.development.js caused by
 * a malformed setAttribute patch. This is a critical fix to allow the app to run.
 */

const fs = require('fs');
const path = require('path');

// Logger with colors
const logger = {
  info: (msg) => console.log(`\x1b[34m[INFO] ${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS] ${msg}\x1b[0m`),
  warning: (msg) => console.log(`\x1b[33m[WARNING] ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m[ERROR] ${msg}\x1b[0m`),
};

// The target file with the syntax error
const filePath = path.join(process.cwd(), 'node_modules', 'react-dom', 'cjs', 'react-dom.development.js');

// Fix the syntax error
function fixReactDom() {
  logger.info(`Checking React DOM file at: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    logger.error('React DOM development file not found!');
    return false;
  }
  
  // Create a backup
  const backupPath = `${filePath}.backup-${Date.now()}`;
  try {
    fs.copyFileSync(filePath, backupPath);
    logger.info(`Backup created at: ${backupPath}`);
  } catch (err) {
    logger.error(`Failed to create backup: ${err.message}`);
    return false;
  }
  
  try {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains the problematic code
    if (content.includes('(typeof (element||node) !== \'undefined\' && (element||node) && (element||node).setAttribute ? (element||node).setAttribute(_attributeName, \'\' + value) || function(){};')) {
      logger.info('Found the malformed syntax in React DOM file');
      
      // Replace the problematic line with correct syntax
      const fixedContent = content.replace(
        /(typeof \(element\|\|node\) !== 'undefined' && \(element\|\|node\) && \(element\|\|node\)\.setAttribute \? \(element\|\|node\)\.setAttribute\(_attributeName, '' \+ value\) \|\| function\(\)\{\};)/g,
        '(typeof (element||node) !== \'undefined\' && (element||node) && (element||node).setAttribute) ? (element||node).setAttribute(_attributeName, \'\' + value) : undefined'
      );
      
      // Write the fixed content back to file
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      
      // Verify the fix by reading back and checking syntax
      const verifyContent = fs.readFileSync(filePath, 'utf8');
      if (!verifyContent.includes('function(){};')) {
        logger.success('Successfully fixed React DOM syntax error');
        return true;
      } else {
        logger.error('Failed to fix syntax error - problematic code still exists');
        // Restore backup
        fs.copyFileSync(backupPath, filePath);
        logger.warning('Restored backup due to failed fix');
        return false;
      }
    } else {
      logger.info('The problematic code was not found or has already been fixed');
      return true;
    }
  } catch (err) {
    logger.error(`Error fixing React DOM: ${err.message}`);
    return false;
  }
}

// Execute the fix
try {
  if (fixReactDom()) {
    logger.success('React DOM fix completed successfully');
  } else {
    logger.error('Failed to fix React DOM');
    process.exit(1);
  }
} catch (err) {
  logger.error(`Unexpected error: ${err.message}`);
  process.exit(1);
}
