'use client';

import { useEffect } from 'react';
import { setupChunkErrorHandler } from '../utils/chunk-error-recovery';

export function ChunkErrorHandler() {
    useEffect(() => {
        setupChunkErrorHandler();
    }, []);

    return null;
}
