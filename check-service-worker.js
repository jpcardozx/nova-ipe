// Service Worker Test Script
// This script invokes the TypeScript compiler to check the service worker file for errors.
// It uses the same libraries and configuration as the service worker would use in production.

const { exec } = require('child_process');
const path = require('path');

const serviceWorkerPath = path.resolve(__dirname, 'app/workers/service-worker.ts');
console.log(`Checking service worker file: ${serviceWorkerPath}`);

// Execute TypeScript compiler in noEmit mode to just check for errors
const command = `npx tsc --noEmit "${serviceWorkerPath}" --lib es2020,webworker,dom --target es2020 --moduleResolution node --esModuleInterop`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error('TypeScript compilation failed with errors:');
        console.error(stderr || stdout);
        process.exit(1);
    } else {
        console.log('Service worker TypeScript compilation successful!');
        console.log(stdout);
        process.exit(0);
    }
});
