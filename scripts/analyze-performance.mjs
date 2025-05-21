// Performance Analysis Script for Nova Ipê
// This script helps identify performance issues in the project

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

console.log('📊 Starting Nova Ipê Performance Analysis...');

// Function to check component file for potential performance issues
function analyzeComponentFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    // Check for common performance issues
    if (content.includes('framer-motion') && !content.includes('layoutId') &&
        content.match(/motion\.[a-zA-Z]+/g)?.length > 5) {
        issues.push('⚠️ Heavy use of framer-motion animations may impact performance');
    }

    if (content.includes('useState') && content.match(/useState/g).length > 5) {
        issues.push('⚠️ Multiple state variables may cause excessive re-renders');
    }

    if (!content.includes('React.memo') &&
        !content.includes('memo') &&
        (content.includes('export default function') || content.includes('export function'))) {
        issues.push('💡 Component could benefit from React.memo for prop memoization');
    }

    if (content.includes('useEffect') &&
        !content.includes('useCallback') &&
        content.includes('addEventListener')) {
        issues.push('⚠️ Event listeners in useEffect should use useCallback to prevent unnecessary re-creation');
    }

    return issues;
}

// Get project Next.js build stats
try {
    console.log('\n🔍 Getting build statistics...');
    console.log('Run "npm run build:analyze" to generate detailed bundle analysis');

    console.log('\n🔍 Analyzing components for performance issues...');

    // Directories to search for components
    const directories = [
        'app/components',
        'components/ui',
        'lib/ui'
    ];

    let totalIssues = 0;

    directories.forEach(dir => {
        const fullPath = path.join(__dirname, '..', dir);
        if (fs.existsSync(fullPath)) {
            const files = fs.readdirSync(fullPath)
                .filter(file => /\.(tsx|jsx)$/.test(file));

            files.forEach(file => {
                const filePath = path.join(fullPath, file);
                const issues = analyzeComponentFile(filePath);

                if (issues.length > 0) {
                    console.log(`\n📁 ${dir}/${file}:`);
                    issues.forEach(issue => console.log(`  ${issue}`));
                    totalIssues += issues.length;
                }
            });
        }
    });

    console.log(`\n📊 Analysis complete: ${totalIssues} potential issues found`);
    console.log('\n💡 Performance Recommendations:');
    console.log('1. Use React.memo for pure functional components');
    console.log('2. Consider replacing framer-motion with CSS transitions for simple animations');
    console.log('3. Use Image component with proper "sizes" attribute');
    console.log('4. Implement code splitting with dynamic imports for large components');
    console.log('5. Delay non-essential scripts until after page load');

} catch (error) {
    console.error('❌ Error analyzing performance:', error);
}
