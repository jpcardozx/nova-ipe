/**
 * Global Polyfill for Server-Side Rendering
 * 
 * Fixes "self is not defined" errors in webpack chunks during SSR
 * by providing necessary global variable definitions.
 * 
 * @version 1.0.0
 * @date 23/05/2025
 */

// Polyfill 'self' for server-side environment
if (typeof globalThis !== 'undefined' && typeof self === 'undefined') {
    globalThis.self = globalThis;
}

// Ensure self is defined in Node.js environment
if (typeof global !== 'undefined' && typeof self === 'undefined') {
    global.self = global;
}

// Additional polyfills for webpack chunks
if (typeof globalThis !== 'undefined') {
    // Ensure webpackChunk_N_E is initialized
    if (!globalThis.webpackChunk_N_E) {
        globalThis.webpackChunk_N_E = [];
    }

    // Make sure self also has the webpack chunk array
    if (globalThis.self && !globalThis.self.webpackChunk_N_E) {
        globalThis.self.webpackChunk_N_E = globalThis.webpackChunk_N_E;
    }
}

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}
