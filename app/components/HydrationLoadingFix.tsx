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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // This runs after hydration is complete
        setMounted(true);

        // Since we're already including body-visible class server-side,
        // we don't need to add it client-side (which would cause a hydration mismatch)
        const timer = setTimeout(() => {
            try {
                // Only do debugging, don't modify any attributes that would
                // cause hydration mismatches
                if (process.env.NODE_ENV !== 'production') {
                    console.debug('Hydration complete - styles maintained from server');
                }
            } catch (error) {
                console.error('Error in hydration fix:', error);
            }
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    // The component doesn't render anything visible
    return null;
}
