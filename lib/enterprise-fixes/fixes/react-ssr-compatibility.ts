'use client';

import React, { useLayoutEffect, useEffect, useState, type ComponentType } from 'react';

/**
 * Safe version of useLayoutEffect that doesn't warn during SSR
 * Works with React 18+ and Next.js 14+
 */
export const useSSRSafeLayoutEffect = typeof window !== 'undefined' ? 
  useLayoutEffect : 
  useEffect;

/**
 * Safe state hook that handles hydration mismatches gracefully
 */
export function useSSRSafeState<T>(
  initialState: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialState);
  const [isFirstRender] = useState(true);

  // Return stable state during hydration
  if (isFirstRender && typeof window === 'undefined') {
    return [
      typeof initialState === 'function'
        ? (initialState as () => T)()
        : initialState,
      setState
    ];
  }
  
  return [state, setState];
}

/**
 * HOC to make components SSR-safe
 */
export function withSSRCompat<P extends object>(
  Component: ComponentType<P>, 
  displayName = Component.displayName || Component.name
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    const [isClient, setIsClient] = useState(false);

    useSSRSafeLayoutEffect(() => {
      setIsClient(true);
    }, []);

    if (!isClient) {
      // Return null or a loading state during SSR/hydration
      return null;
    }

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withSSRCompat(${displayName})`;

  return WrappedComponent;
}
