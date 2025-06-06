'use client';

/**
 * Next.js Context Provider
 * 
 * Resolves "Missing ActionQueueContext" errors in Next.js 14
 * by providing a minimal implementation of Next.js internal contexts.
 * 
 * @version 3.0.0
 * @date June 4, 2025
 */

import React, { createContext } from 'react';

// Create a minimal ActionQueueContext to satisfy Next.js internals
const ActionQueueContext = createContext({
    ping: () => { },
    invalidate: () => { },
    refresh: () => { },
    reset: () => { },
    prefetch: () => { }
});

// Attach to window for Next.js internal code to find
if (typeof window !== 'undefined') {
    // @ts-ignore - Next.js expects this global
    window.__NEXT_ACTION_QUEUE_CONTEXT = ActionQueueContext;
}

// Create a minimal ServerInsertedHTMLContext
const ServerInsertedHTMLContext = createContext({
    mountedInstances: new Set(),
    updateHead: () => { },
});

// Attach to window for Next.js internal use
if (typeof window !== 'undefined') {
    // @ts-ignore - Next.js expects this global
    window.__NEXT_SERVER_INSERTED_HTML_CONTEXT = ServerInsertedHTMLContext;
}

// Create additional contexts as needed
const PathnameContext = createContext("");
const LayoutSegmentsContext = createContext([]);

/**
 * NextContextProvider provides minimal implementations of 
 * internal Next.js contexts needed for proper functioning
 */
export function NextContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <ActionQueueContext.Provider value={{
            ping: () => { },
            invalidate: () => { },
            refresh: () => { },
            reset: () => { },
            prefetch: () => { }
        }}>
            <ServerInsertedHTMLContext.Provider value={{
                mountedInstances: new Set(),
                updateHead: () => { },
            }}>
                <PathnameContext.Provider value="">
                    <LayoutSegmentsContext.Provider value={[]}>
                        {children}
                    </LayoutSegmentsContext.Provider>
                </PathnameContext.Provider>
            </ServerInsertedHTMLContext.Provider>
        </ActionQueueContext.Provider>
    );
}

// Log success in development
if (process.env.NODE_ENV === 'development') {
    console.debug('✅ Next.js context providers initialized');
}

export default NextContextProvider;
