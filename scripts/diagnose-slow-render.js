/**
 * Performance diagnostic script for Nova-IPE
 * This script helps identify what might be causing slow rendering
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Starting Nova-IPE performance diagnostics...');

// Check for common performance issues
function checkForLargeImports() {
    console.log('\n🔄 Checking for large bundle imports...');

    const targetDirs = [
        path.join(__dirname, '..', 'app'),
        path.join(__dirname, '..', 'lib'),
        path.join(__dirname, '..', 'components')
    ];

    const problematicImports = [
        { pattern: /import.*from.*framer-motion/, severity: 'warning', message: 'Consider lazy loading framer-motion or using lighter alternatives' },
        { pattern: /import.*from.*@chakra-ui\/react/, severity: 'warning', message: 'Consider lazy loading Chakra UI components' },
        { pattern: /import.*{.*}.*from.*lucide-react/, severity: 'info', message: 'Make sure to import individual icons, not the whole package' },
        { pattern: /import.*\*.*from/, severity: 'warning', message: 'Wildcard imports can bloat bundles' },
        { pattern: /import.*Image.*from.*next\/image.*\n.*\n.*fill.*(?!sizes=)/, severity: 'warning', message: 'Image with fill but no sizes prop' },
    ];

    let foundIssues = 0;

    // Walk directories recursively
    function walkDir(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
                const content = fs.readFileSync(filePath, 'utf8');

                for (const { pattern, severity, message } of problematicImports) {
                    if (pattern.test(content)) {
                        console.log(`  [${severity.toUpperCase()}] ${path.relative(process.cwd(), filePath)}`);
                        console.log(`    - ${message}`);
                        foundIssues++;
                    }
                }
            }
        }
    }

    targetDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
            walkDir(dir);
        }
    });

    console.log(`\n✅ Import check complete: ${foundIssues} potential issues found`);
}

function checkForServerComponents() {
    console.log('\n🔄 Checking for incorrect client/server component usage...');

    const appDir = path.join(__dirname, '..', 'app');
    let issues = 0;

    function walkComponentFiles(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                walkComponentFiles(filePath);
            } else if (/\.(jsx|tsx)$/.test(file)) {
                const content = fs.readFileSync(filePath, 'utf8');

                // Check for components that might be using server-only features in client components
                if (content.includes("'use client'")) {
                    if (
                        content.includes('fetch(') ||
                        content.includes('headers()') ||
                        content.includes('cookies') ||
                        (content.includes('import') && content.includes('from \'next/headers\''))
                    ) {
                        console.log(`  [WARNING] ${path.relative(process.cwd(), filePath)}`);
                        console.log(`    - Client component may be using server-only features`);
                        issues++;
                    }
                }
            }
        }
    }

    walkComponentFiles(appDir);
    console.log(`\n✅ Component check complete: ${issues} potential issues found`);
}

function checkForLargePages() {
    console.log('\n🔄 Checking for overly large page components...');

    const appDir = path.join(__dirname, '..', 'app');
    let largeFiles = 0;

    function checkFileSize(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                checkFileSize(filePath);
            } else if (/\.(jsx|tsx)$/.test(file)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const lineCount = content.split('\n').length;

                if (lineCount > 300) {
                    console.log(`  [WARNING] ${path.relative(process.cwd(), filePath)}`);
                    console.log(`    - Large component (${lineCount} lines) - consider splitting into smaller components`);
                    largeFiles++;
                }
            }
        }
    }

    checkFileSize(appDir);
    console.log(`\n✅ Size check complete: ${largeFiles} large files found`);
}

// Run diagnostics
checkForLargeImports();
checkForServerComponents();
checkForLargePages();

console.log('\n🔍 Generating quick performance recommendations...');

console.log(`
✨ Performance Improvement Recommendations:

1. 🔄 Switch to fast dev mode when developing:
   Run your dev server with: npm run dev:fast

2. 🧩 Consider code splitting large components:
   - Use dynamic import with Suspense
   - Move components over 300 lines into smaller sub-components

3. 🌐 Check data fetching:
   - Make sure Sanity queries are optimized
   - Implement proper caching strategies

4. 🖼️ Verify image optimization:
   - All images with 'fill' need a 'sizes' prop
   - Consider using priority='true' only for above-the-fold images

5. 🚀 Next steps:
   - Run this diagnostic script to find specific issues
   - Review Web Vitals values after implementing fixes
`);

console.log('📊 Performance diagnostics complete');
