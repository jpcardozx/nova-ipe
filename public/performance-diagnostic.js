/**
 * Simplified Performance Diagnostic Script
 * This script helps identify performance bottlenecks in the application
 */

// Run this in the browser console on any page to get comprehensive performance metrics

(function runPerformanceDiagnostic() {
    console.log('Running Nova IPE Performance Diagnostic...');

    // Wait until the page is fully loaded
    if (document.readyState !== 'complete') {
        console.log('Waiting for page to fully load...');
        window.addEventListener('load', () => setTimeout(runDiagnostic, 1000));
    } else {
        setTimeout(runDiagnostic, 1000);
    }

    function runDiagnostic() {
        // Get basic navigation timing
        const navTiming = performance.getEntriesByType('navigation')[0];
        const paintEntries = performance.getEntriesByType('paint');

        // Results object
        const results = {
            timing: {},
            resources: {
                bySize: [],
                byLoadTime: [],
                slowest: null,
                largest: null,
                totalSize: 0,
                totalCount: 0
            },
            serviceWorker: {
                active: !!navigator.serviceWorker.controller,
                registered: false
            }
        };

        // Calculate timing metrics
        if (navTiming) {
            const t = navTiming;
            results.timing = {
                total: Math.round(t.loadEventEnd - t.startTime),
                dns: Math.round(t.domainLookupEnd - t.domainLookupStart),
                tcp: Math.round(t.connectEnd - t.connectStart),
                request: Math.round(t.responseStart - t.requestStart),
                response: Math.round(t.responseEnd - t.responseStart),
                processing: Math.round(t.domComplete - t.responseEnd),
                domInteractive: Math.round(t.domInteractive - t.startTime),
                domContentLoaded: Math.round(t.domContentLoadedEventEnd - t.startTime),
                loadEvent: Math.round(t.loadEventEnd - t.startTime)
            };
        }

        // Get paint timings
        const firstPaint = paintEntries.find(e => e.name === 'first-paint');
        const firstContentfulPaint = paintEntries.find(e => e.name === 'first-contentful-paint');

        if (firstPaint) {
            results.timing.firstPaint = Math.round(firstPaint.startTime);
        }

        if (firstContentfulPaint) {
            results.timing.firstContentfulPaint = Math.round(firstContentfulPaint.startTime);
        }

        // Analyze resource loading
        const resourceEntries = performance.getEntriesByType('resource');
        let totalSize = 0;

        results.resources.all = resourceEntries.map(res => {
            const size = res.transferSize || 0;
            totalSize += size;

            return {
                name: res.name,
                type: getResourceType(res.name),
                size: (size / 1024).toFixed(2) + ' KB',
                duration: Math.round(res.duration),
                startTime: Math.round(res.startTime)
            };
        });

        results.resources.bySize = [...results.resources.all]
            .sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
            .slice(0, 10);

        results.resources.byLoadTime = [...results.resources.all]
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 10);

        results.resources.slowest = results.resources.byLoadTime[0];
        results.resources.largest = results.resources.bySize[0];
        results.resources.totalSize = (totalSize / 1024 / 1024).toFixed(2) + ' MB';
        results.resources.totalCount = resourceEntries.length;

        // Check if Service Worker is registered
        navigator.serviceWorker.getRegistrations().then(regs => {
            results.serviceWorker.registered = regs.length > 0;

            // Log results to console
            console.group('📊 Nova IPE Performance Diagnostic Results');

            console.group('⏱️ Timing');
            console.table(results.timing);
            console.groupEnd();

            console.group('🔄 Resource Loading');
            console.log('Total resources:', results.resources.totalCount);
            console.log('Total size:', results.resources.totalSize);
            console.log('Largest resource:', results.resources.largest?.name, results.resources.largest?.size);
            console.log('Slowest resource:', results.resources.slowest?.name, results.resources.slowest?.duration + 'ms');
            console.groupEnd();

            console.group('Top 10 largest resources:');
            console.table(results.resources.bySize);
            console.groupEnd();

            console.group('Top 10 slowest resources:');
            console.table(results.resources.byLoadTime);
            console.groupEnd();

            console.group('🔧 Service Worker');
            console.log('Registered:', results.serviceWorker.registered);
            console.log('Active/Controlling:', results.serviceWorker.active);
            console.groupEnd();

            console.groupEnd();
        });
    }

    function getResourceType(url) {
        if (url.match(/\.(jpe?g|png|gif|svg|webp|avif)/)) return 'image';
        if (url.match(/\.(js)/)) return 'javascript';
        if (url.match(/\.(css)/)) return 'css';
        if (url.match(/\.(woff|woff2|ttf|otf)/)) return 'font';
        if (url.match(/\.(json)/)) return 'json';
        return 'other';
    }
})();
