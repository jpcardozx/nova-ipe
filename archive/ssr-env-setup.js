#!/usr/bin/env node

/**
 * SSR Environment Setup Script
 * 
 * This script must run BEFORE Next.js starts to ensure all
 * browser globals are available in the Node.js environment.
 * 
 * Usage: node ssr-env-setup.js
 * 
 * @version 1.0.0
 * @date 28/05/2025
 */

// 1. Apply comprehensive browser globals polyfill
(function setupSSREnvironment() {
  'use strict';

  // Core browser globals
  if (typeof global !== 'undefined') {
    if (typeof global.self === 'undefined') {
      global.self = global;
    }
    
    if (typeof global.window === 'undefined') {
      global.window = global;
    }

    // Mock document object
    if (typeof global.document === 'undefined') {
      global.document = {
        createElement: () => ({}),
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
        addEventListener: () => {},
        removeEventListener: () => {},
        body: {},
        head: {},
        title: '',
      };
    }

    // Mock navigator
    if (typeof global.navigator === 'undefined') {
      global.navigator = {
        userAgent: 'Node.js',
        platform: 'node',
        language: 'en-US',
        languages: ['en-US'],
      };
    }

    // Mock location
    if (typeof global.location === 'undefined') {
      global.location = {
        href: 'http://localhost',
        origin: 'http://localhost',
        protocol: 'http:',
        host: 'localhost',
        hostname: 'localhost',
        port: '',
        pathname: '/',
        search: '',
        hash: '',
      };
    }

    // Mock localStorage and sessionStorage
    const mockStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };

    if (typeof global.localStorage === 'undefined') {
      global.localStorage = mockStorage;
    }

    if (typeof global.sessionStorage === 'undefined') {
      global.sessionStorage = mockStorage;
    }

    // Initialize webpack chunks
    if (!global.webpackChunk_N_E) {
      global.webpackChunk_N_E = [];
    }

    // Ensure self has webpack chunks
    if (global.self && !global.self.webpackChunk_N_E) {
      global.self.webpackChunk_N_E = global.webpackChunk_N_E;
    }

    // Apply to globalThis for compatibility
    if (typeof globalThis !== 'undefined') {
      ['self', 'window', 'document', 'navigator', 'location', 'localStorage', 'sessionStorage', 'webpackChunk_N_E'].forEach(prop => {
        if (typeof globalThis[prop] === 'undefined') {
          globalThis[prop] = global[prop];
        }
      });
    }
  }

  console.log('✅ SSR environment setup completed');
})();

// 2. Export for module loading
module.exports = {};
