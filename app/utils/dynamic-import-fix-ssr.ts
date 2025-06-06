/**
 * dynamic-import-fix-ssr.ts
 * Server-side compatible version of dynamic import utilities
 * 
 * @version 1.0.0
 * @date 23/05/2025
 */

/**
 * Server-compatible version of safeDynamicImport
 * Simply returns the original import promise to work with SSR
 * 
 * @param importPromise The dynamic import promise
 * @param _componentName Optional name for logging (unused in SSR version)
 * @returns The original import promise
 */
export function safeDynamicImport<T>(
  importPromise: Promise<any>,
  _componentName?: string
): Promise<any> {
  // On the server, we just return the original import promise
  // This avoids the "attempting to call client function from server" error
  return importPromise;
}
