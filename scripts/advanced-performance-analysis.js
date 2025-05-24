/**
 * Advanced Performance Analyzer for Nova-IPE
 * A comprehensive tool for identifying performance bottlenecks
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for better output formatting
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

console.log(`${colors.bright}${colors.cyan}🚀 NOVA-IPE ADVANCED PERFORMANCE ANALYSIS${colors.reset}\n`);
console.log(`${colors.yellow}Running comprehensive diagnostics...${colors.reset}\n`);

// Project stats collection
const stats = {
    totalFiles: 0,
    totalSize: 0,
    javascriptFiles: 0,
    javascriptSize: 0,
    cssFiles: 0,
    cssSize: 0,
    imageFiles: 0,
    imageSize: 0,
    components: 0,
    pages: 0,
    serverComponents: 0,
    clientComponents: 0
};

const issues = {
    critical: [],
    high: [],
    medium: [],
    low: []
};

// ----- ANALYSIS FUNCTIONS -----

// 1. Check for problematic imports
function analyzeImports() {
    console.log(`${colors.bright}📦 ANALYZING IMPORTS & DEPENDENCIES${colors.reset}`);

    const problematicImports = [
        { pattern: /import\s+.*\s+from\s+['"]framer-motion['"]/g, severity: 'high', message: 'Large import: framer-motion' },
        { pattern: /import\s+.*\s+from\s+['"]@chakra-ui\/react['"]/g, severity: 'high', message: 'Large import: Chakra UI' },
        { pattern: /import\s+{\s*[^}]{100,}\s*}\s+from\s+['"]lucide-react['"]/g, severity: 'medium', message: 'Many icons imported from lucide-react' },
        { pattern: /import\s+\*\s+as/g, severity: 'medium', message: 'Wildcard import - bundle size concern' },
        { pattern: /import\s+.*\s+from\s+['"]react-icons\/[^'"]+['"]/g, severity: 'medium', message: 'React Icons - potential bundle size issue' },
        { pattern: /import\s+.*\s+from\s+['"]@sanity\/[^'"]+['"]/g, severity: 'medium', message: 'Sanity import - potential bundle size issue' },
        { pattern: /import\s+.*\s+from\s+['"]@heroicons\/react['"]/g, severity: 'medium', message: 'HeroIcons - potential bundle size issue' },
        { pattern: /import\s+.*\s+from\s+['"]lodash['"]/g, severity: 'high', message: 'Lodash full import - use specific functions instead' }
    ];

    const rootDir = path.join(__dirname, '..');
    const excludeDirs = ['node_modules', '.next', 'public', '.git'];
    const fileTypes = ['.js', '.jsx', '.ts', '.tsx'];

    function processDirectory(dir, issues) {
        try {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativePath = path.relative(rootDir, fullPath);

                // Skip excluded directories
                if (excludeDirs.some(excluded => relativePath.includes(excluded))) {
                    continue;
                }

                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    processDirectory(fullPath, issues);
                } else if (fileTypes.includes(path.extname(fullPath).toLowerCase())) {
                    stats.totalFiles++;
                    stats.totalSize += stat.size;

                    // Track component stats
                    if (fullPath.includes('components')) {
                        stats.components++;
                    } else if (fullPath.includes('pages') || fullPath.includes('app') && (item === 'page.tsx' || item === 'page.js')) {
                        stats.pages++;
                    }

                    stats.javascriptFiles++;
                    stats.javascriptSize += stat.size;

                    const content = fs.readFileSync(fullPath, 'utf8');

                    // Check for client vs server components
                    if (content.includes("'use client'") || content.includes('"use client"')) {
                        stats.clientComponents++;
                    } else {
                        stats.serverComponents++;
                    }

                    // Check for problematic imports
                    for (const { pattern, severity, message } of problematicImports) {
                        const matches = content.match(pattern);
                        if (matches && matches.length > 0) {
                            issues[severity].push({
                                file: relativePath,
                                message: `${message} (${matches.length} instances)`,
                                lineCount: content.split('\n').length
                            });
                        }
                    }

                    // Large component check
                    const lineCount = content.split('\n').length;
                    if (lineCount > 500) {
                        issues.high.push({
                            file: relativePath,
                            message: `Extremely large file (${lineCount} lines) - consider splitting into smaller components`,
                            lineCount
                        });
                    } else if (lineCount > 300) {
                        issues.medium.push({
                            file: relativePath,
                            message: `Large file (${lineCount} lines) - consider refactoring`,
                            lineCount
                        });
                    }
                } else if (['.css', '.scss', '.less'].includes(path.extname(fullPath).toLowerCase())) {
                    stats.cssFiles++;
                    stats.cssSize += stat.size;
                } else if (['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg'].includes(path.extname(fullPath).toLowerCase())) {
                    stats.imageFiles++;
                    stats.imageSize += stat.size;
                }
            }
        } catch (err) {
            console.error(`Error processing directory ${dir}:`, err);
        }
    }

    processDirectory(rootDir, issues);

    // Report findings
    console.log(`\n${colors.yellow}Import Analysis Results:${colors.reset}`);

    ['critical', 'high', 'medium'].forEach(severity => {
        if (issues[severity].length > 0) {
            console.log(`\n${colors.bright}${severity.toUpperCase()} PRIORITY ISSUES:${colors.reset}`);
            issues[severity].forEach(issue => {
                console.log(`  ${colors.red}• ${issue.file} ${colors.reset}(${issue.lineCount} lines)`);
                console.log(`    ${issue.message}`);
            });
        }
    });

    console.log(`\n${colors.green}✓ Import analysis complete${colors.reset}`);
}

// 2. Check for image optimization issues
function analyzeImages() {
    console.log(`\n${colors.bright}🖼️ ANALYZING IMAGE OPTIMIZATION${colors.reset}`);

    // Check Next.js image components for optimization issues
    const imageIssues = [
        { pattern: /fill(?:={true}|\s+).*?(?!sizes=)/gs, severity: 'critical', message: 'Image with fill prop missing sizes attribute' },
        { pattern: /<Image[^>]*?src=.*?(\.jpg|\.png|\.jpeg)[^>]*?(?!placeholder=)/gs, severity: 'medium', message: 'Image missing placeholder for better loading experience' },
        { pattern: /<Image[^>]*?priority={true}[^>]*?>/g, severity: 'low', message: 'Priority image - ensure this is above the fold' },
    ];

    const rootDir = path.join(__dirname, '..');
    const fileTypes = ['.js', '.jsx', '.ts', '.tsx'];
    let filesWithImageIssues = 0;

    function scanImagesInDirectory(dir) {
        try {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativePath = path.relative(rootDir, fullPath);

                // Skip node_modules and other non-source directories
                if (relativePath.includes('node_modules') || relativePath.includes('.next') || relativePath.includes('.git')) {
                    continue;
                }

                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    scanImagesInDirectory(fullPath);
                } else if (fileTypes.includes(path.extname(fullPath).toLowerCase())) {
                    const content = fs.readFileSync(fullPath, 'utf8');

                    // Only process files that actually use Next.js Image component
                    if (content.includes('next/image') || content.includes('<Image')) {
                        let hasIssues = false;

                        for (const { pattern, severity, message } of imageIssues) {
                            const matches = content.match(pattern);
                            if (matches && matches.length > 0) {
                                if (!hasIssues) {
                                    filesWithImageIssues++;
                                    hasIssues = true;
                                }

                                issues[severity].push({
                                    file: relativePath,
                                    message: `${message} (${matches.length} instances)`
                                });
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.error(`Error scanning images in directory ${dir}:`, err);
        }
    }

    scanImagesInDirectory(rootDir);

    // Report findings
    console.log(`\n${colors.yellow}Image Optimization Results:${colors.reset}`);
    console.log(`Files with image issues: ${filesWithImageIssues}`);

    ['critical', 'high', 'medium'].forEach(severity => {
        const imageRelatedIssues = issues[severity].filter(issue => issue.message.includes('Image'));

        if (imageRelatedIssues.length > 0) {
            console.log(`\n${colors.bright}${severity.toUpperCase()} PRIORITY IMAGE ISSUES:${colors.reset}`);
            imageRelatedIssues.forEach(issue => {
                console.log(`  ${colors.red}• ${issue.file}${colors.reset}`);
                console.log(`    ${issue.message}`);
            });
        }
    });

    console.log(`\n${colors.green}✓ Image optimization analysis complete${colors.reset}`);
}

// 3. Check for data fetching patterns
function analyzeDataFetching() {
    console.log(`\n${colors.bright}🔄 ANALYZING DATA FETCHING PATTERNS${colors.reset}`);

    const dataFetchingIssues = [
        { pattern: /useEffect\([^)]*?\s*fetch\(/gs, severity: 'critical', message: 'Client-side fetch in useEffect - consider server components or SWR/React Query' },
        { pattern: /getStaticProps[^)]*?revalidate:\s*(?:0|1|2|3|4|5)\s*[,}]/g, severity: 'medium', message: 'Very frequent revalidation - consider performance impact' },
        { pattern: /fetch\([^)]*?cache:\s*['"]no-store['"]/g, severity: 'high', message: 'Uncached fetch - may impact performance' },
        { pattern: /useSWR\(/g, severity: 'low', message: 'SWR usage - ensure proper cache configuration' },
        { pattern: /fetch\([^{]*?{[^}]*?next:[^}]*?revalidate:\s*(?:0|1|[2-9]|[1-9][0-9])[^}]*?}/g, severity: 'medium', message: 'Short revalidation period - potential performance impact' },
    ];

    const rootDir = path.join(__dirname, '..');
    const fileTypes = ['.js', '.jsx', '.ts', '.tsx'];
    let fetchCount = 0;

    function scanDataFetchingInDirectory(dir) {
        try {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativePath = path.relative(rootDir, fullPath);

                // Skip non-source directories
                if (relativePath.includes('node_modules') || relativePath.includes('.next') || relativePath.includes('.git')) {
                    continue;
                }

                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    scanDataFetchingInDirectory(fullPath);
                } else if (fileTypes.includes(path.extname(fullPath).toLowerCase())) {
                    const content = fs.readFileSync(fullPath, 'utf8');

                    // Check for fetch calls
                    const fetchMatches = content.match(/fetch\(/g);
                    if (fetchMatches) {
                        fetchCount += fetchMatches.length;
                    }

                    // Check for specific data fetching patterns
                    for (const { pattern, severity, message } of dataFetchingIssues) {
                        const matches = content.match(pattern);
                        if (matches && matches.length > 0) {
                            issues[severity].push({
                                file: relativePath,
                                message: `${message} (${matches.length} instances)`
                            });
                        }
                    }
                }
            }
        } catch (err) {
            console.error(`Error scanning data fetching in directory ${dir}:`, err);
        }
    }

    scanDataFetchingInDirectory(rootDir);

    // Report findings
    console.log(`\n${colors.yellow}Data Fetching Analysis Results:${colors.reset}`);
    console.log(`Total fetch calls detected: ${fetchCount}`);

    ['critical', 'high', 'medium'].forEach(severity => {
        const fetchingIssues = issues[severity].filter(issue =>
            issue.message.includes('fetch') ||
            issue.message.includes('cache') ||
            issue.message.includes('SWR') ||
            issue.message.includes('revalidation')
        );

        if (fetchingIssues.length > 0) {
            console.log(`\n${colors.bright}${severity.toUpperCase()} PRIORITY DATA FETCHING ISSUES:${colors.reset}`);
            fetchingIssues.forEach(issue => {
                console.log(`  ${colors.red}• ${issue.file}${colors.reset}`);
                console.log(`    ${issue.message}`);
            });
        }
    });

    console.log(`\n${colors.green}✓ Data fetching analysis complete${colors.reset}`);
}

// 4. Analyze client vs server component usage
function analyzeComponentStructure() {
    console.log(`\n${colors.bright}🧩 ANALYZING COMPONENT ARCHITECTURE${colors.reset}`);

    // Look for common architectural issues
    const architectureIssues = [
        { pattern: /^['"]use client['"].*?(?=.*?import.*?from\s*['"]next\/headers['"])/gs, severity: 'critical', message: 'Client component importing server-only features' },
        { pattern: /'use client'.*?(?=.*?fetch\(.*?\{.*?cache:.*?\})/gs, severity: 'high', message: 'Client component doing fetch with cache options - should be in server component' }
    ];

    const rootDir = path.join(__dirname, '..');
    const fileTypes = ['.js', '.jsx', '.ts', '.tsx'];

    function scanComponentArchitecture(dir) {
        try {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativePath = path.relative(rootDir, fullPath);

                // Skip non-source directories
                if (relativePath.includes('node_modules') || relativePath.includes('.next') || relativePath.includes('.git')) {
                    continue;
                }

                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    scanComponentArchitecture(fullPath);
                } else if (fileTypes.includes(path.extname(fullPath).toLowerCase())) {
                    const content = fs.readFileSync(fullPath, 'utf8');

                    // Check for architectural issues
                    for (const { pattern, severity, message } of architectureIssues) {
                        const matches = content.match(pattern);
                        if (matches && matches.length > 0) {
                            issues[severity].push({
                                file: relativePath,
                                message: `${message} (${matches.length} instances)`
                            });
                        }
                    }
                }
            }
        } catch (err) {
            console.error(`Error scanning component architecture in directory ${dir}:`, err);
        }
    }

    scanComponentArchitecture(rootDir);

    // Report findings
    console.log(`\n${colors.yellow}Component Architecture Results:${colors.reset}`);
    console.log(`Total components: ${stats.components}`);
    console.log(`Server components: ${stats.serverComponents}`);
    console.log(`Client components: ${stats.clientComponents}`);

    ['critical', 'high'].forEach(severity => {
        const architecturalIssues = issues[severity].filter(issue =>
            issue.message.includes('component') ||
            issue.message.includes('server') ||
            issue.message.includes('client')
        );

        if (architecturalIssues.length > 0) {
            console.log(`\n${colors.bright}${severity.toUpperCase()} PRIORITY ARCHITECTURAL ISSUES:${colors.reset}`);
            architecturalIssues.forEach(issue => {
                console.log(`  ${colors.red}• ${issue.file}${colors.reset}`);
                console.log(`    ${issue.message}`);
            });
        }
    });

    console.log(`\n${colors.green}✓ Component architecture analysis complete${colors.reset}`);
}

// 5. Analyze Next.js configuration
function analyzeNextConfig() {
    console.log(`\n${colors.bright}⚙️ ANALYZING NEXT.JS CONFIGURATION${colors.reset}`);

    try {
        const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
        if (!fs.existsSync(nextConfigPath)) {
            console.log(`${colors.yellow}Next.js config file not found${colors.reset}`);
            return;
        }

        const configContent = fs.readFileSync(nextConfigPath, 'utf8');

        // Check for optimization settings
        const optimizationChecks = [
            { name: 'Image optimization', pattern: /images:\s*{[^}]*}/g, positive: true },
            { name: 'Swc minify', pattern: /swcMinify:\s*true/g, positive: true },
            { name: 'Gzip compression', pattern: /compress:\s*true/g, positive: true },
            { name: 'Module bundling optimization', pattern: /optimizePackageImports/g, positive: true },
            { name: 'Disabled sourcemaps in production', pattern: /productionBrowserSourceMaps:\s*true/g, positive: false },
            { name: 'Appropriate revalidation periods', pattern: /stale-while-revalidate/g, positive: true }
        ];

        console.log(`\n${colors.yellow}Next.js Configuration Analysis:${colors.reset}`);

        optimizationChecks.forEach(check => {
            const matches = configContent.match(check.pattern);
            const found = matches && matches.length > 0;

            if ((check.positive && found) || (!check.positive && !found)) {
                console.log(`  ${colors.green}✓ ${check.name}${colors.reset}`);
            } else {
                console.log(`  ${colors.red}✗ ${check.name}${colors.reset}`);
                issues.medium.push({
                    file: 'next.config.js',
                    message: `Missing or incorrect setting: ${check.name}`
                });
            }
        });

    } catch (err) {
        console.error('Error analyzing Next.js configuration:', err);
    }

    console.log(`\n${colors.green}✓ Next.js configuration analysis complete${colors.reset}`);
}

// Run all analyses
analyzeImports();
analyzeImages();
analyzeDataFetching();
analyzeComponentStructure();
analyzeNextConfig();

// Generate summary and recommendations
console.log(`\n${colors.bright}${colors.cyan}📊 PERFORMANCE ANALYSIS SUMMARY${colors.reset}\n`);

// Project stats
console.log(`${colors.bright}Project Statistics:${colors.reset}`);
console.log(`  Total JavaScript files: ${stats.javascriptFiles} (${(stats.javascriptSize / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`  Total CSS files: ${stats.cssFiles} (${(stats.cssSize / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`  Total image files: ${stats.imageFiles} (${(stats.imageSize / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`  Components: ${stats.components} (${stats.clientComponents} client, ${stats.serverComponents} server)`);
console.log(`  Pages: ${stats.pages}`);

// Issues summary
console.log(`\n${colors.bright}Issues Found:${colors.reset}`);
console.log(`  Critical issues: ${issues.critical.length}`);
console.log(`  High priority issues: ${issues.high.length}`);
console.log(`  Medium priority issues: ${issues.medium.length}`);
console.log(`  Low priority issues: ${issues.low.length}`);

// Top recommendations
console.log(`\n${colors.bright}${colors.cyan}🚀 TOP PERFORMANCE RECOMMENDATIONS${colors.reset}\n`);

if (issues.critical.length > 0) {
    console.log(`${colors.bright}Critical Priority:${colors.reset}`);
    issues.critical.slice(0, 5).forEach((issue, index) => {
        console.log(`  ${index + 1}. ${colors.red}Fix in ${issue.file}:${colors.reset} ${issue.message}`);
    });
}

if (issues.high.length > 0) {
    console.log(`\n${colors.bright}High Priority:${colors.reset}`);
    issues.high.slice(0, 5).forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.message} in ${issue.file}`);
    });
}

// Final recommendations
console.log(`\n${colors.bright}${colors.cyan}⚡ IMPLEMENTATION PLAN${colors.reset}\n`);
console.log(`${colors.bright}1. Immediate Fixes:${colors.reset}`);
console.log(`  • Fix client components using server features`);
console.log(`  • Add missing 'sizes' attributes to images with 'fill' prop`);
console.log(`  • Optimize largest components by splitting them`);

console.log(`\n${colors.bright}2. Architecture Improvements:${colors.reset}`);
console.log(`  • Move data fetching to server components where possible`);
console.log(`  • Implement better component code splitting`);
console.log(`  • Add Suspense boundaries around heavy components`);

console.log(`\n${colors.bright}3. Asset Optimization:${colors.reset}`);
console.log(`  • Implement proper image optimization`);
console.log(`  • Optimize third-party dependencies`);
console.log(`  • Implement font optimization`);

console.log(`\n${colors.bright}4. Caching Strategy:${colors.reset}`);
console.log(`  • Implement proper revalidation strategies`);
console.log(`  • Add HTTP caching headers`);
console.log(`  • Optimize Sanity queries and cache responses`);

// Generate a detailed action plan file
try {
    const actionPlanContent = `# Nova-IPE Performance Action Plan
  
## Critical Issues to Address (Priority 1)
${issues.critical.map(issue => `* **${issue.file}**: ${issue.message}`).join('\n')}

## High Priority Issues (Priority 2)
${issues.high.slice(0, 10).map(issue => `* **${issue.file}**: ${issue.message}`).join('\n')}

## Medium Priority Issues (Priority 3)
${issues.medium.slice(0, 10).map(issue => `* **${issue.file}**: ${issue.message}`).join('\n')}

## Implementation Strategy

1. **Fix Critical Client/Server Component Issues**
   - Move server-only code to server components
   - Fix image optimization issues
   - Address incorrect data fetching patterns

2. **Optimize Large Components**
   - Split components larger than 300 lines
   - Implement code splitting for below-the-fold content
   - Add Suspense boundaries around expensive renders

3. **Optimize Data Fetching**
   - Implement proper caching strategies
   - Move fetch calls to server components
   - Optimize Sanity queries

4. **Asset Optimization**
   - Ensure all images are properly sized and formatted
   - Implement font optimization
   - Minimize third-party libraries

5. **Bundle Optimization**
   - Implement tree-shaking for large libraries
   - Properly configure Next.js optimization features
   - Review and optimize CSS usage
`;

    fs.writeFileSync(path.join(__dirname, '..', 'PERFORMANCE-ACTION-PLAN.md'), actionPlanContent);
    console.log(`\n${colors.green}✓ Generated detailed action plan: PERFORMANCE-ACTION-PLAN.md${colors.reset}`);
} catch (err) {
    console.error('Error generating action plan:', err);
}

console.log(`\n${colors.bright}${colors.green}✓ Performance analysis complete${colors.reset}`);
