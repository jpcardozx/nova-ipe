/**
 * PWA Performance Diagnostic
 * 
 * This script helps identify potential performance issues with the PWA implementation.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Files to check
const FILES_TO_CHECK = [
    { path: 'public/service-worker.js', name: 'Service Worker' },
    { path: 'app/utils/pwa-service.ts', name: 'PWA Service' },
    { path: 'app/utils/service-worker-utils.ts', name: 'Service Worker Utils' },
    { path: 'app/manifest.ts', name: 'PWA Manifest' }
];

// Potential performance issues patterns
const PERFORMANCE_ISSUES = [
    {
        pattern: /console\.(log|warn|error)/g,
        description: 'Console logging in production code can impact performance',
        severity: 'medium'
    },
    {
        pattern: /getElementById|querySelector|querySelectorAll/g,
        description: 'DOM queries should be minimized and cached for performance',
        severity: 'medium'
    },
    {
        pattern: /\.forEach\(/g,
        description: 'forEach loops are less performant than for/for-of loops',
        severity: 'low'
    },
    {
        pattern: /\beval\b/g,
        description: 'Eval usage is a performance and security concern',
        severity: 'high'
    },
    {
        pattern: /fetch\(/g,
        description: 'Fetch calls should use caching strategies in PWA context',
        severity: 'medium'
    },
    {
        pattern: /setTimeout\(\s*[^,]+\s*,\s*0\s*\)/g,
        description: 'setTimeout with 0ms delay can cause unnecessary reflows',
        severity: 'low'
    }
];

// Cache efficiency issues
const CACHE_ISSUES = [
    {
        pattern: /cache\.addAll\(\s*\[\s*[^\]]{200,}\s*\]\s*\)/gs,
        description: 'Large cache.addAll operations can delay service worker activation',
        severity: 'high'
    },
    {
        pattern: /caches\.open\([^)]*\).*?\.then.*?cache\.put\(/gs,
        description: 'Individual cache.put operations should be batched for performance',
        severity: 'medium'
    }
];

console.log('🔍 Running PWA Performance Diagnostic...');

// Results object
const results = {
    filesChecked: 0,
    issuesFound: 0,
    details: []
};

// Check each file
for (const file of FILES_TO_CHECK) {
    const filePath = path.resolve(process.cwd(), file.path);

    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ File not found: ${file.path}`);
            continue;
        }

        results.filesChecked++;
        const content = fs.readFileSync(filePath, 'utf8');
        const fileIssues = [];

        // Check for performance issues
        for (const issue of [...PERFORMANCE_ISSUES, ...CACHE_ISSUES]) {
            const matches = content.match(issue.pattern);
            if (matches) {
                results.issuesFound += matches.length;
                fileIssues.push({
                    type: issue.description,
                    count: matches.length,
                    severity: issue.severity
                });
            }
        }

        // Add file results
        if (fileIssues.length > 0) {
            results.details.push({
                file: file.name,
                path: file.path,
                issues: fileIssues
            });
        }
    } catch (error) {
        console.error(`Error checking ${file.path}:`, error);
    }
}

// Check manifest size
try {
    const manifestPath = path.resolve(process.cwd(), 'public/manifest.webmanifest');
    if (fs.existsSync(manifestPath)) {
        const stats = fs.statSync(manifestPath);
        const fileSizeKB = stats.size / 1024;

        if (fileSizeKB > 10) {
            results.issuesFound++;
            results.details.push({
                file: 'PWA Manifest',
                path: 'public/manifest.webmanifest',
                issues: [{
                    type: 'Manifest file size is large',
                    description: `${fileSizeKB.toFixed(2)}KB - Consider optimizing manifest size`,
                    severity: 'medium'
                }]
            });
        }
    }
} catch (error) {
    console.error('Error checking manifest:', error);
}

// Output results
console.log('\n📊 PWA Performance Diagnostic Results:');
console.log(`Checked ${results.filesChecked} files and found ${results.issuesFound} potential issues`);

if (results.issuesFound > 0) {
    console.log('\nIssues by file:');
    results.details.forEach(file => {
        console.log(`\n${file.file} (${file.path}):`);
        file.issues.forEach(issue => {
            const marker = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟠' : '🟡';
            console.log(`  ${marker} ${issue.type} ${issue.count ? `(${issue.count} occurrences)` : ''}`);
        });
    });

    console.log('\n📝 Recommendations:');
    console.log('1. Remove unnecessary console logging from production code');
    console.log('2. Optimize cache operations in service worker');
    console.log('3. Minimize DOM operations in critical paths');
    console.log('4. Consider using a lighter weight PWA implementation for improved performance');
} else {
    console.log('✅ No performance issues found!');
}

// Save results to file
fs.writeFileSync(
    path.resolve(process.cwd(), 'pwa-performance-diagnostic.json'),
    JSON.stringify(results, null, 2)
);

console.log('\n💾 Results saved to pwa-performance-diagnostic.json');

// Export results for programmatic usage
export default results;
