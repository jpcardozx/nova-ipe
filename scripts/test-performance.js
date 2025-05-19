#!/usr/bin/env node

/**
 * Performance Testing Script
 * 
 * This script helps verify that the performance optimizations have been successfully implemented
 * and provides metrics that can be compared with the baseline performance.
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Create interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Test URLs
const TEST_URLS = {
    home: 'http://localhost:3000',
    alugar: 'http://localhost:3000/alugar',
    comprar: 'http://localhost:3000/comprar'
};

// Performance thresholds
const THRESHOLDS = {
    lcp: 3000, // 3 seconds
    fcp: 1800, // 1.8 seconds
    ttfb: 800, // 800ms
    mainThreadBlocking: 1000 // 1 second
};

// Baseline performance (before optimizations)
const BASELINE = {
    lcp: 78056, // ms
    mainThreadBlocking: 57778, // ms
    alugarPageLoad: 6860, // ms
    comprarPageLoad: 6860 // ms
};

async function runPerformanceTest() {
    console.log('\n📊 Running Performance Tests...\n');

    // Start the Next.js server if not already running
    try {
        console.log('🚀 Starting Next.js server...');
        execSync('npm run dev', { stdio: 'inherit' });
    } catch (error) {
        // Server might already be running or failed to start
    }

    // Launch browser
    console.log('🌐 Launching browser for performance tests...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        // Results object
        const results = {
            home: {},
            alugar: {},
            comprar: {}
        };

        // Test all URLs
        for (const [page, url] of Object.entries(TEST_URLS)) {
            console.log(`\n🔍 Testing ${page} page: ${url}`);

            // Create new page and enable performance metrics
            const browserPage = await browser.newPage();
            await browserPage.setCacheEnabled(false);

            // Collect performance metrics
            const client = await browserPage.target().createCDPSession();
            await client.send('Performance.enable');

            // Start tracing
            await browserPage.tracing.start({
                path: `trace-${page}.json`,
                categories: ['devtools.timeline']
            });

            // Navigate to URL and wait for network idle
            const startTime = Date.now();
            const response = await browserPage.goto(url, {
                waitUntil: 'networkidle0',
                timeout: 30000
            });
            const loadTime = Date.now() - startTime;

            // Get performance metrics
            const performanceMetrics = await client.send('Performance.getMetrics');
            const metrics = performanceMetrics.metrics;

            // Stop tracing
            await browserPage.tracing.stop();

            // Extract metrics
            const lcpMetric = await browserPage.evaluate(() => {
                const entries = performance.getEntriesByType('paint');
                const lcp = entries.find(entry => entry.name === 'largest-contentful-paint');
                return lcp ? lcp.startTime : null;
            });

            const fcpMetric = await browserPage.evaluate(() => {
                const entries = performance.getEntriesByType('paint');
                const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
                return fcp ? fcp.startTime : null;
            });

            const ttfbMetric = await browserPage.evaluate(() => {
                const navEntry = performance.getEntriesByType('navigation')[0];
                return navEntry ? navEntry.responseStart - navEntry.requestStart : null;
            });

            const mainThreadBlockingTime = metrics.find(m => m.name === 'TaskDuration')?.value || null;

            // Store results
            results[page] = {
                loadTime,
                lcp: lcpMetric,
                fcp: fcpMetric,
                ttfb: ttfbMetric,
                mainThreadBlockingTime: mainThreadBlockingTime ? Math.round(mainThreadBlockingTime) : null,
                status: response.status()
            };

            await browserPage.close();
        }

        // Close browser
        await browser.close();

        // Show results
        console.log('\n📈 Performance Test Results:\n');
        console.log('='.repeat(60));
        console.log(' Page  |  Load Time  |  LCP  |  FCP  |  TTFB  |  Main Thread  ');
        console.log('='.repeat(60));

        for (const [page, metrics] of Object.entries(results)) {
            console.log(
                ` ${page.padEnd(6)} | ` +
                ` ${formatMetric(metrics.loadTime, 5000)} | ` +
                ` ${formatMetric(metrics.lcp, THRESHOLDS.lcp)} | ` +
                ` ${formatMetric(metrics.fcp, THRESHOLDS.fcp)} | ` +
                ` ${formatMetric(metrics.ttfb, THRESHOLDS.ttfb)} | ` +
                ` ${formatMetric(metrics.mainThreadBlockingTime, THRESHOLDS.mainThreadBlocking)} `
            );
        }
        console.log('='.repeat(60));

        // Show improvement
        console.log('\n🚀 Performance Improvements:\n');

        // LCP improvement
        const lcpImprovement = calculateImprovement(
            BASELINE.lcp,
            results.alugar.lcp || results.comprar.lcp || 0
        );
        console.log(`LCP: ${lcpImprovement}% improvement`);

        // Main thread blocking improvement
        const mainThreadImprovement = calculateImprovement(
            BASELINE.mainThreadBlocking,
            results.alugar.mainThreadBlockingTime || results.comprar.mainThreadBlockingTime || 0
        );
        console.log(`Main Thread Blocking: ${mainThreadImprovement}% improvement`);

        // Page load time improvements
        const alugarLoadTimeImprovement = calculateImprovement(
            BASELINE.alugarPageLoad,
            results.alugar.loadTime || 0
        );
        console.log(`Alugar Page Load: ${alugarLoadTimeImprovement}% improvement`);

        const comprarLoadTimeImprovement = calculateImprovement(
            BASELINE.comprarPageLoad,
            results.comprar.loadTime || 0
        );
        console.log(`Comprar Page Load: ${comprarLoadTimeImprovement}% improvement`);

        // Recommendations based on results
        console.log('\n🔧 Recommendations:\n');

        if (results.alugar.lcp > THRESHOLDS.lcp || results.comprar.lcp > THRESHOLDS.lcp) {
            console.log('• LCP is still above target threshold. Consider further image optimizations.');
        }

        if ((results.alugar.mainThreadBlockingTime || 0) > THRESHOLDS.mainThreadBlocking) {
            console.log('• Main thread blocking time is still high. Consider further JavaScript optimizations.');
        }

        // Save results to file
        const resultsPath = path.join(process.cwd(), 'performance-test-results.json');
        fs.writeFileSync(
            resultsPath,
            JSON.stringify({
                timestamp: new Date().toISOString(),
                baseline: BASELINE,
                results,
                improvements: {
                    lcp: lcpImprovement,
                    mainThreadBlocking: mainThreadImprovement,
                    alugarLoad: alugarLoadTimeImprovement,
                    comprarLoad: comprarLoadTimeImprovement
                }
            }, null, 2)
        );

        console.log(`\nDetailed results saved to ${resultsPath}`);
        console.log('\n✅ Performance test completed.\n');
    } catch (error) {
        console.error('❌ Error during performance testing:', error);
        await browser.close();
    }
}

// Format metric with color based on threshold
function formatMetric(value, threshold) {
    if (value === null || value === undefined) {
        return 'N/A'.padEnd(8);
    }

    const formattedValue = `${Math.round(value)}ms`.padEnd(8);

    if (value > threshold) {
        // Red for above threshold
        return `\x1b[31m${formattedValue}\x1b[0m`;
    }

    // Green for below threshold
    return `\x1b[32m${formattedValue}\x1b[0m`;
}

// Calculate improvement percentage
function calculateImprovement(baseline, current) {
    if (baseline === 0 || current === 0) return 'N/A';

    const improvement = ((baseline - current) / baseline) * 100;
    return improvement.toFixed(1);
}

// Ask user if they want to run the test
rl.question('Do you want to run the performance test? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        runPerformanceTest()
            .finally(() => {
                rl.close();
            });
    } else {
        console.log('Performance test cancelled.');
        rl.close();
    }
});
