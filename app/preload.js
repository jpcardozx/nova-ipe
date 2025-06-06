'use client';

/**
 * This file preloads compatibility shims for React features
 * needed by Sanity and other dependencies.
 */

// Import compatibility shims
import './sanity-react-compat';

// For server-side rendering compatibility
import React from 'react';

// Mock the React.use API for server components if needed
if (!React.use) {
  React.use = function useServerShim(promise) {
    // Simple implementation for SSR
    return null;
  };
}

// Handle preloadModule shim for React DOM if needed in SSR context
if (typeof globalThis !== 'undefined' && !globalThis.preloadModule) {
  globalThis.preloadModule = function() {
    return Promise.resolve();
  };
}
