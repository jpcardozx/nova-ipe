'use client';

import { useState, useEffect } from 'react';

// Simplified wrapper to avoid dynamic import issues
export default function WebVitalsDebuggerWrapper() {
    const [isDev, setIsDev] = useState(false);

    useEffect(() => {
        // Only run in development mode
        setIsDev(process.env.NODE_ENV !== 'production');

        if (process.env.NODE_ENV !== 'production') {
            console.log('WebVitals debugger initialized in dev mode');
        }
    }, []);

    // Only render in development mode
    if (!isDev) return null;

    // Simply return null for now to prevent errors
    return null;
}
