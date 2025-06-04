'use client';

import { ReactNode, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

interface HydrationOptions {
  priority?: 'high' | 'medium' | 'low';
  placeholder?: ReactNode;
  delay?: number;
  ssrOnly?: boolean;
}

interface LoaderProps {
  children: ReactNode;
  priority?: 'high' | 'medium' | 'low';
  fallback?: ReactNode;
  onLoad?: () => void;
  ssrOnly?: boolean;
}

interface StaticProps {
  children: ReactNode;
  id: string;
}

/**
 * Smart component hydration manager
 * Handles progressive hydration and loading states
 */
export function useSmartHydration(Component: React.ComponentType, options: HydrationOptions = {}) {
  const {
    priority = 'low',
    placeholder,
    delay = 0,
    ssrOnly = false
  } = options;

  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (ssrOnly) return;

    const timer = setTimeout(() => {
      try {
        flushSync(() => {
          setHydrated(true);
        });
      } catch (e) {
        console.error('Hydration failed:', e);
        setError(e as Error);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, ssrOnly]);

  if (error) {
    return placeholder || null;
  }

  if (!hydrated) {
    if (typeof window === 'undefined') {
      // Server-side: Render static HTML
      return <Component />;
    }
    // Client-side: Show placeholder until hydrated
    return placeholder || null;
  }

  return <Component />;
}

/**
 * Static component wrapper
 * Prevents unnecessary hydration for static content
 */
export function StaticComponent({ children, id }: StaticProps) {
  if (typeof window === 'undefined') {
    return (
      <div
        id={id}
        data-hydration="static"
        suppressHydrationWarning
      >
        {children}
      </div>
    );
  }

  // Client-side: Preserve server-rendered content
  return (
    <div
      id={id}
      data-hydration="static"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: document.getElementById(id)?.innerHTML || ''
      }}
    />
  );
}

/**
 * Smart component loader
 * Handles progressive loading with animations
 */
export function SmartComponentLoader({
  children,
  priority = 'low',
  fallback,
  onLoad,
  ssrOnly = false
}: LoaderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (ssrOnly) return;

    const loadPriority = {
      high: 0,
      medium: 100,
      low: 200
    };

    const timer = setTimeout(() => {
      try {
        setLoaded(true);
        onLoad?.();
      } catch (e) {
        console.error('Component load failed:', e);
        setError(e as Error);
      }
    }, loadPriority[priority]);

    return () => clearTimeout(timer);
  }, [priority, onLoad, ssrOnly]);

  if (error) {
    return fallback || null;
  }

  if (!loaded) {
    if (typeof window === 'undefined') {
      // Server-side: Render placeholder
      return fallback || null;
    }
    // Client-side: Show loading animation
    return fallback || null;
  }

  return <>{children}</>;
}
