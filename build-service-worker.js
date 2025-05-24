// Enhanced service worker build script with TypeScript support
const esbuild = require('esbuild');
const path = require('path');

/** @type {import('esbuild').BuildOptions} */
const esbuildConfig = {
    entryPoints: [path.resolve(__dirname, 'app/workers/service-worker.ts')],
    bundle: true,
    outfile: path.resolve(__dirname, 'public/service-worker.js'),
    format: 'iife',
    platform: 'browser',
    target: ['es2020', 'chrome58', 'firefox57', 'safari11', 'edge18'],
    minify: true,
    sourcemap: true,
    metafile: true,
    loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
    },
    tsconfig: 'tsconfig.json',
    define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.SW_VERSION': '"2.1.0"'
    },
    legalComments: 'none',
    treeShaking: true,
    supported: {
        'dynamic-import': true,
        'import-meta': true
    }
};

async function buildServiceWorker() {
    try {
        const result = await esbuild.build({
            ...esbuildConfig,
            // Ensure TypeScript type assertions are properly transformed
            plugins: [{
                name: 'typescript-transform',
                setup(build) {
                    build.onEnd(() => {
                        console.log('TypeScript transformations completed');
                    });
                }
            }]
        });

        console.log('\nService worker built successfully! 🚀\n');

        // Output detailed build stats
        const bytes = result.metafile ? Object.keys(result.metafile.outputs).reduce(
            (acc, key) => acc + (result.metafile.outputs[key].bytes || 0), 0
        ) : 0;

        console.log('Build Statistics:');
        console.log('----------------');
        console.log(`Size: ${(bytes / 1024).toFixed(2)} KB`);
        console.log(`Location: ${path.resolve(__dirname, 'public/service-worker.js')}`);
        console.log(`Sourcemap: ${path.resolve(__dirname, 'public/service-worker.js.map')}`);
        console.log('\nOptimizations enabled:');
        console.log('- Tree shaking');
        console.log('- Minification');
        console.log('- TypeScript transformations');
        console.log('- Cross-browser compatibility\n');
    } catch (error) {
        console.error('\n❌ Error building service worker:', error);
        process.exit(1);
    }
}

buildServiceWorker().catch(error => {
    console.error('\n❌ Unhandled error:', error);
    process.exit(1);
});
