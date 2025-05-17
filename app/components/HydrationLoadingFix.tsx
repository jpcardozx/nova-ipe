'use client';

import { useEffect, useState } from 'react';

/**
 * HydrationLoadingFix
 * 
 * This component safely handles the page visibility after hydration
 * to avoid hydration mismatches between server and client rendering.
 * It uses React's lifecycle to ensure visibility changes happen
 * only after hydration is complete.
 */
export default function HydrationLoadingFix() {
    const [mounted, setMounted] = useState(false); useEffect(() => {
        // This runs after hydration is complete
        setMounted(true);

        // Make page visible with a slightly longer delay to ensure hydration is fully complete
        const timer = setTimeout(() => {
            try {
                if (document.body) {
                    // Update styles directly without adding data attributes that could cause hydration mismatches
                    document.body.style.visibility = 'visible';
                    document.body.style.opacity = '1';

                    // For debugging - use a less intrusive log
                    if (process.env.NODE_ENV !== 'production') {
                        console.debug('Page visibility restored after hydration');
                    }
                }
            } catch (error) {
                console.error('Error restoring visibility:', error);
            }
        }, 50); // Slightly longer delay to ensure hydration completes

        return () => clearTimeout(timer);
    }, []);

    // The component doesn't render anything visible
    return null;
}
