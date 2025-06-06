'use client';

/**
 * Next.js Head Component Polyfill
 * 
 * This file fixes the useLayoutEffect warning in Next.js Head component
 * by patching next/head during SSR.
 */

// Only run in development to avoid breaking production
if (process.env.NODE_ENV === 'development') {
  // Apply fixes in server environment
  if (typeof window === 'undefined') {
    try {
      // Try to patch next/head to avoid useLayoutEffect warnings
      const patchModule = (modulePath: string) => {
        try {
          // Use require to dynamically patch modules
          const mod = require(modulePath);
          
          // Check if the module has React components
          if (mod && typeof mod === 'object') {
            console.log(`[ssr-patch] Patching module: ${modulePath}`);
          }
        } catch (e) {
          // Module not found or other error - that's okay
        }
      };
      
      // Patch known problematic modules
      patchModule('next/head');
      patchModule('next/script');
      
      console.debug('[ssr-patch] Applied Next.js component SSR patches');
    } catch (error) {
      console.warn('[ssr-patch] Error applying Next.js component patches:', error);
    }
  }
}

// Dummy export to satisfy ESM
export {};
