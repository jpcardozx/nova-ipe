'use client';

import { useEffect } from 'react';
import { registerChunkErrorHandler, isInFallbackMode } from '@/lib/chunk-error-recovery';

/**
 * Component that provides chunk error recovery for the entire application
 * This should be placed high in the component tree, preferably in the layout
 */
export default function ChunkErrorRecovery({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Register global error handler
        registerChunkErrorHandler();

        // Log fallback mode status
        if (isInFallbackMode()) {
            console.log('[ChunkErrorRecovery] Application running in fallback mode due to previous chunk loading errors');
        }
    }, []);

    return <>{children}</>;
}
