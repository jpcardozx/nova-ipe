/**
 * dynamic-import-helper.ts
 * Universal (SSR + CSR) compatible version of dynamic import utilities
 * 
 * @version 1.0.0
 * @date 23/05/2025
 */

/**
 * Safe dynamic import that works in both server and client environments
 * 
 * @param importer Function that returns a dynamic import
 * @param componentName Name for logging and debugging
 * @returns A promise that works both client-side and server-side
 */
export function universalDynamicImport<T>(
  importer: () => Promise<any>,
  componentName: string = 'UnnamedComponent'
): () => Promise<any> {
  return () => {
    try {
      // Get the raw import
      const importPromise = importer();

      // If on client-side, apply enhancement
      if (typeof window !== 'undefined') {
        return importPromise.then(mod => {
          if (!mod) {
            console.warn(`[universalDynamicImport] Module ${componentName} loaded as ${mod}, using fallback`);
            return { default: () => null };
          }

          // Handle modules with only named exports (no default)
          if (mod.default === undefined) {
            if (Object.keys(mod).length > 0) {
              // Find a suitable export to use as default
              const firstExport = Object.values(mod)[0];
              if (typeof firstExport === 'function') {
                mod.default = firstExport;
              } else {
                // Create a placeholder if nothing suitable
                mod.default = () => null;
              }
            } else {
              // Handle empty module
              mod.default = () => null;
            }
          }
          return mod;
        }).catch(err => {
          console.error(`[universalDynamicImport] Error loading ${componentName}:`, err);
          return { default: () => null };
        });
      }
      
      // On server, just return the promise
      return importPromise;
    } catch (e) {
      console.error(`[universalDynamicImport] Error in ${componentName}:`, e);
      return Promise.resolve({ default: () => null });
    }
  };
}
