#!/usr/bin/env node
// Batch fix unused imports and variables - TypeScript cleanup script

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Common unused imports to remove
const unusedImports = [
    'React',
    'useRef',
    'useEffect', 
    'Calendar',
    'Camera',
    'Share2',
    'ArrowUpRight',
    'AreaChart',
    'DynamicComponentLoader'
];

// Common unused variables to remove
const unusedVars = [
    'setFetchFunction',
    'request',
    'req',
    'isVisible',
    'processProperties',
    'isEmpty'
];

console.log('🧹 Starting TypeScript cleanup...');

// Get all TypeScript files
const files = execSync('find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v .next', 
    { encoding: 'utf8' }).split('\n').filter(Boolean);

let fixedCount = 0;

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Remove unused React import if not JSX
        if (content.includes("import React") && !content.includes('<') && !content.includes('React.')) {
            content = content.replace(/import React[^;]*;?\n?/g, '');
            modified = true;
        }

        // Remove unused imports
        unusedImports.forEach(imp => {
            const regex = new RegExp(`\\s*${imp},?\\s*`, 'g');
            if (content.includes(`'${imp}' is declared but its value is never read`)) {
                content = content.replace(regex, '');
                modified = true;
            }
        });

        // Remove unused variable declarations
        unusedVars.forEach(varName => {
            const regex = new RegExp(`\\s*const\\s+${varName}[^;]*;?\\n?`, 'g');
            content = content.replace(regex, '');
            if (content !== fs.readFileSync(file, 'utf8')) {
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(file, content);
            fixedCount++;
            console.log(`✅ Fixed: ${file}`);
        }
    } catch (error) {
        console.log(`❌ Error processing ${file}:`, error.message);
    }
});

console.log(`🎉 Cleanup complete! Fixed ${fixedCount} files.`);
