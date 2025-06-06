'use client';

import React from 'react';

/**
 * dynamic-import-fix.ts
 * Utility to fix webpack's "undefined is not a function" errors
 * when calling dynamically imported modules
 * 
 * @version 1.0.0
 * @date 23/05/2025
 */

/**
 * Ensures a dynamic import correctly resolves to a valid component or function
 * Fixes the "options.factory is not a function" webpack error
 * 
 * @param importPromise The dynamic import promise
 * @param componentName Name for logging purposes
 * @returns A promise that always resolves to an object with a valid default export
 */
export async function ensureDynamicImport<T>(
    importPromise: Promise<any>,
    componentName: string = 'UnknownComponent'
): Promise<{ default: React.ComponentType<T> }> {
    try {
        const mod = await importPromise;

        // If the module is undefined or null, provide a fallback
        if (!mod) {
            console.warn(`Dynamic import of ${componentName} resolved to ${mod}, using fallback`);
            return {
                default: (() => null) as unknown as React.ComponentType<T>
            };
        }

        // If the module already has a default export, use it
        if (mod.default !== undefined) {
            return mod;
        }

        // Handle modules that only have named exports (no default export)
        // Find the first function or component to use as default
        const keys = Object.keys(mod);
        if (keys.length > 0) {
            for (const key of keys) {
                const exportedItem = mod[key];
                if (typeof exportedItem === 'function') {
                    console.info(`Using named export "${key}" as default for ${componentName}`);
                    return {
                        ...mod,
                        default: exportedItem
                    };
                }
            }
        }

        // If we reach here, no suitable function was found,
        // return a dummy component to prevent runtime errors
        console.warn(`No suitable export found in ${componentName}, using fallback`);
        return {
            ...mod,
            default: (() => null) as unknown as React.ComponentType<T>
        };
    } catch (err) {
        console.error(`Error in dynamic import of ${componentName}:`, err);
        // Return a functional component that renders nothing
        return {
            default: (() => null) as unknown as React.ComponentType<T>
        };
    }
}

/**
 * Helper to safely wrap Next.js dynamic imports
 * 
 * Usage:
 * const MyComponent = dynamic(() => 
 *   safeDynamicImport(import('./path/to/component'), 'MyComponent')
 * );
 */
export function safeDynamicImport<T>(
    importPromise: Promise<any>,
    componentName: string = 'UnknownComponent'
): Promise<{ default: React.ComponentType<T> }> {
    return ensureDynamicImport<T>(importPromise, componentName);
}
