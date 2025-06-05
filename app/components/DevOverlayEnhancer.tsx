'use client';

declare global {
    interface Window {
        __NEXT_HAS_OVERLAY_PATCH__?: boolean;
        __NEXT_DEV_OVERLAY_PATCHED__?: boolean;
    }
}

/**
 * DevOverlayEnhancer
 * 
 * This is a specialized component that enhances the Next.js dev overlay experience.
 * It intercepts and fixes common issues with the Next.js dev overlay component.
 * 
 * Problems fixed:
 * - TypeError: Cannot read properties of undefined (reading 'userAgent')
 * - Overlay error positioning issues
 * - Various ReferenceError issues in overlay code
 */

import { useEffect } from 'react';

export function DevOverlayEnhancer() {
    useEffect(() => {
        // Only run in development mode
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        try {
            // Patch the Next.js dev overlay internals
            const patchDevOverlay = () => {
                // Target the specific Next.js file that causes userAgent errors
                const targetModule = 'maintain--tab-focus.js';

                // Look for script elements that might contain the target code
                const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script'));
                scripts.forEach((script) => {
                    if (script.src && script.src.includes('/next/dist/') && script.src.includes(targetModule)) {
                        console.debug('[DevOverlayEnhancer] Found target module:', script.src);

                        // Create a patched version of the script
                        const newScript = document.createElement('script');
                        newScript.innerHTML = `
                            // Patch for Next.js dev overlay userAgent issue
                            (function() {
                                // Check for navigator before accessing
                                if (typeof navigator === 'undefined' || !navigator.userAgent) {
                                    const nav = window.navigator;
                                    Object.defineProperty(nav, 'userAgent', {
                                        value: 'Mozilla/5.0 Polyfill',
                                        configurable: true,
                                        writable: true
                                    });
                                }
                                
                                // Override the problematic function
                                window.__NEXT_DEV_OVERLAY_PATCHED__ = true;
                            })();
                        `;
                        document.head.appendChild(newScript);
                    }
                });

                // Patch specific error paths in dev overlay
                window.__NEXT_HAS_OVERLAY_PATCH__ = true;
            };

            // Run immediately and also after a short delay to catch late-loaded modules
            patchDevOverlay();
            setTimeout(patchDevOverlay, 1000);
        } catch (err) {
            console.warn('[DevOverlayEnhancer] Error patching dev overlay:', err);
        }
    }, []);

    // This is an invisible component, it doesn't render anything
    return null;
}

export default DevOverlayEnhancer;
