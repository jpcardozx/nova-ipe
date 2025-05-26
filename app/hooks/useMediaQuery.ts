import { useState, useEffect, useCallback } from 'react';
'use client';

/**
 * Custom hook for handling media queries with proper browser compatibility
 * @param query Media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Avoid running matchMedia on the server
  const getInitialMatch = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = useState<boolean>(getInitialMatch);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery: MediaQueryList = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    // Handle modern and legacy browsers
    const updateMatches = (e: MediaQueryListEvent | MediaQueryList) => {
      setMatches(e.matches);
    };

    // Try modern API first, fall back to legacy if needed
    try {
      mediaQuery.addEventListener('change', updateMatches);
      return () => mediaQuery.removeEventListener('change', updateMatches);
    } catch (e) {
      // Fallback for older browsers
      mediaQuery.addListener(updateMatches);
      return () => mediaQuery.removeListener(updateMatches);
    }
  }, [query]);

  return matches;
}
