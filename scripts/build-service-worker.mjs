/**
 * Service Worker Build Script
 * 
 * This script compiles the service worker TypeScript file to JavaScript
 * and places it in the public directory so it can be served at the root.
 */

import fs from 'node:fs';
import path from 'node:path';
import { exec, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Get dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const serviceWorkerSrc = path.join(__dirname, '..', 'app', 'workers', 'service-worker.ts');
const serviceWorkerDest = path.join(__dirname, '..', 'public', 'service-worker.js');
const tempDir = path.join(__dirname, '..', 'temp');

console.log('Service Worker Builder:');
console.log('Source:', serviceWorkerSrc);
console.log('Destination:', serviceWorkerDest);

// Create temp dir if needed
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Check if source file exists
if (!fs.existsSync(serviceWorkerSrc)) {
    console.error(`Source file not found: ${serviceWorkerSrc}`);
    process.exit(1);
}

// Simple method: Read the TypeScript file and create a JavaScript version
try {
    console.log('Reading service worker source...');
    const swSource = fs.readFileSync(serviceWorkerSrc, 'utf8');

    // Very simple TypeScript to JavaScript conversion for the service worker
    // This is not a full TS compiler, but works for our basic SW
    console.log('Converting TypeScript to JavaScript...');
    let jsContent = swSource
        // Remove TypeScript type annotations
        .replace(/: FetchEvent/g, '')
        .replace(/: ExtendableEvent/g, '')
        .replace(/: Response/g, '')
        .replace(/<Response>/g, '')
        // Other TS-specific syntax we know is in our file
        .replace(/as unknown as ServiceWorkerGlobalScope/, '')
        .replace(/(const\s+\w+)\s*:\s*\w+(\s*=)/g, '$1$2') // Remove simple type annotations
        .replace(/\/\/\/ <reference.+>/g, '') // Remove TS reference comments
        .replace(/: Promise<[^>]+>/g, '') // Remove Promise type annotations

    // Add a banner comment
    jsContent = `/**
 * Service Worker for Nova Ipê Imobiliária
 * Generated on: ${new Date().toISOString()}
 * 
 * This service worker implements a stale-while-revalidate strategy for static chunks
 * to prevent chunk loading errors and improve offline capabilities.
 */

${jsContent}`;

    // Add timestamp at the end for cache busting
    jsContent += `\n\n// Build timestamp: ${Date.now()}`;

    console.log('Writing service worker to public directory...');
    fs.writeFileSync(serviceWorkerDest, jsContent);
    console.log('Service worker build completed successfully!');

    // Also try to use tsc as a fallback
    try {
        console.log('Attempting to also create a tsc-compiled version (as fallback)...');
        const tsConfig = {
            compilerOptions: {
                target: "ES2020",
                lib: ["DOM", "ES2020", "WebWorker"],
                skipLibCheck: true,
                outFile: path.join(tempDir, "service-worker-tsc.js")
            }
        };

        // Write temporary tsconfig without the 'files' array
        fs.writeFileSync(path.join(tempDir, "tsconfig-sw.json"), JSON.stringify(tsConfig, null, 2));

        // Run tsc with the source file directly
        execSync(`npx tsc -p ${path.join(tempDir, "tsconfig-sw.json")}`, { stdio: 'inherit' });
        console.log('TypeScript compilation successful');
    } catch (tscError) {
        console.log('TypeScript compiler fallback failed, but the main build succeeded:', tscError);
    }
} catch (error) {
    console.error('Failed to build service worker:', error);
    process.exit(1);
}
