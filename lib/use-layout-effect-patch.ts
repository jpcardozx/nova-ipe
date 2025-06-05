'use client';

/**
 * useLayoutEffect SSR Patch for Next.js
 * 
 * Fixes the common "useLayoutEffect does nothing on the server" warning
 * by replacing useLayoutEffect with useEffect during SSR.
 */

import { useLayoutEffect, useEffect, type EffectCallback, type DependencyList } from 'react';

// Create a version of useLayoutEffect that does not warn during SSR
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' 
  ? useLayoutEffect 
  : useEffect;

// Apply patch to react-dom to suppress useLayoutEffect warnings
if (typeof window === 'undefined') {
  // We're on the server
  try {
    // Try to patch React's useLayoutEffect in SSR to suppress warnings
    const React = require('react');
    
    // Create a version that does nothing on server
    const originalUseLayoutEffect = React.useLayoutEffect;
    
    // Override React's useLayoutEffect during SSR
    Object.defineProperty(React, 'useLayoutEffect', {
      configurable: true,
      get() {
        return function useLayoutEffectSSR(
          effect: EffectCallback,
          deps?: DependencyList
        ) {
          // Use useEffect during SSR to avoid warnings
          return useEffect(effect, deps);
        };
      }
    });
  } catch (error) {
    console.warn('Failed to patch React useLayoutEffect for SSR:', error);
  }
}

export default useIsomorphicLayoutEffect;
