/**
 * React SSR Compatibility Module
 * Handles server-side rendering compatibility issues with React components
 */

import { useEffect, useState } from 'react';

export function withSSRCompat<P extends object>(Component: React.ComponentType<P>, options = {}) {
    const displayName = typeof Component === 'string' ? Component : Component.displayName || Component.name;

    function WrappedComponent(props: P) {
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
            setMounted(true);
        }, []);

        if (!mounted && typeof window === 'undefined') {
            // Return null during SSR if the component isn't mounted
            return null;
        }

        return <Component {...props} />;
    }

    WrappedComponent.displayName = `SSRCompatible(${displayName})`;
    return WrappedComponent;
}

export function useSSRSafeEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            return effect();
        }
    }, [mounted, ...(deps || [])]);
}

export function SSRProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
