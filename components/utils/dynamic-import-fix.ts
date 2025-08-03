import React from 'react';

/**
 * Safe dynamic import utility to handle import failures gracefully
 */

export async function safeDynamicImport<T>(
  importFn: () => Promise<T>
): Promise<T | null> {
  try {
    return await importFn();
  } catch (error) {
    console.warn('Dynamic import failed:', error);
    return null;
  }
}

export function withDynamicImportFallback<T>(
  importFn: () => Promise<T>,
  fallback: T
): Promise<T> {
  return safeDynamicImport(importFn).then(result => result || fallback);
}

export function createLazyComponent<P>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>
) {
  return React.lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.error('Failed to load component:', error);
      // Return a fallback component
      return {
        default: () => React.createElement('div', { 
          className: 'p-4 text-center text-gray-500' 
        }, 'Componente não pôde ser carregado')
      };
    }
  });
}
