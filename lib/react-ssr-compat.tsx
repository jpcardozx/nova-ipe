'use client';

/**
 * React Dynamic Component Patch
 * 
 * This file patches React components that might use useLayoutEffect
 * to avoid SSR warnings.
 */

import React, { useEffect } from 'react';

/**
 * A HOC that ensures components with useLayoutEffect don't warn during SSR
 */
export function withSsrCompatible<P extends object>(
    Component: React.ComponentType<P>,
    displayName?: string
): React.ComponentType<P> {
    // Create a wrapper component that handles SSR compatibility
    const WrappedComponent = (props: P) => {
        // Use a state to avoid rendering the component during SSR
        const [isMounted, setIsMounted] = React.useState(false);

        // Only render the component after mounting on the client
        useEffect(() => {
            setIsMounted(true);
        }, []);

        // During SSR or before mounting, render nothing or a placeholder
        if (!isMounted && typeof window === 'undefined') {
            return null; // Return null during SSR
        }

        // On the client or after mounting, render the actual component
        return <Component {...props} />;
    };

    // Set a display name for better debugging
    WrappedComponent.displayName =
        `SsrCompatible(${displayName || Component.displayName || Component.name || 'Component'})`;

    return WrappedComponent;
}

/**
 * A safer version of useState that avoids hydration mismatches
 */
export function useSsrSafeState<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = React.useState<T>(initialState);
    const isFirstRender = React.useRef(true);

    React.useEffect(() => {
        // Mark first render complete on client
        isFirstRender.current = false;
    }, []);

    // During SSR and first client render, always return the initial state
    // to avoid hydration mismatches
    if (isFirstRender.current && typeof window === 'undefined') {
        return [
            typeof initialState === 'function'
                ? (initialState as () => T)()
                : initialState,
            setState
        ];
    }

    return [state, setState];
}

export default { withSsrCompatible, useSsrSafeState };
