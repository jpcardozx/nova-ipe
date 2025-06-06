'use client';

/**
 * SSR-Safe Layout Effect Hook
 * 
 * This hook provides a version of useLayoutEffect that doesn't warn during SSR.
 * It's useful for components that need layout measurements but are also SSR'd.
 * 
 * Usage:
 * import { useSSRSafeLayoutEffect } from '@/lib/use-ssr-safe-layout-effect';
 * 
 * function MyComponent() {
 *   useSSRSafeLayoutEffect(() => {
 *     // Your layout effect code here
 *   }, []);
 * }
 */

import { useEffect, useLayoutEffect } from 'react';

// Use useLayoutEffect in browser, useEffect during SSR
export const useSSRSafeLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useSSRSafeLayoutEffect;
